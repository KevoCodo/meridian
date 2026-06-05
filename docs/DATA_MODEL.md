# Meridian Data Model

This document defines Meridian's domain entities. Phase 1A implements Workspace
and Client, Phase 1B implements Project, Phase 2A implements Task, Phase 2B
implements Notes, Phase 3A implements Activity, Phase 4A implements
AutomationRule definitions, Phase 6A implements User authentication, and Phase
6B implements workspace memberships and user assignment.

## Standard Fields

All persisted entities should use:

- `id`: UUID primary key
- `createdAt`: creation timestamp in API responses
- `updatedAt`: update timestamp in API responses

Database column names use snake_case:

- `id`
- `created_at`
- `updated_at`

Future lifecycle fields may include:

- `archivedAt` / `archived_at`
- `deletedAt` / `deleted_at`

## Entities

### Workspace

Top-level tenant boundary for a company, team, or operating unit.

Implemented fields:

- `id`
- `name`
- `slug`
- `createdAt`
- `updatedAt`

Relationships:

- Has many users through workspace memberships
- Has many clients
- Has many projects
- Has many tasks
- Has many notes
- Has many activities
- Has many automation rules
- Has many workspace memberships

### User

An authenticated person who may belong to one or more workspaces.

Implemented fields:

- `id`
- `email`
- `name`
- `passwordHash` stored only in the database and never returned by the API
- `createdAt`
- `updatedAt`

Relationships:

- May belong to many workspaces through workspace memberships
- May author notes in later phases
- May act on activities in later phases
- May be assigned tasks

Implemented endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Client

An organization or person that the workspace manages work for.

Implemented fields:

- `id`
- `workspaceId`
- `name`
- `status`: `active`, `inactive`, or `archived`
- `contactName`
- `contactEmail`
- `companyWebsite`
- `notes`
- `createdAt`
- `updatedAt`

Relationships:

- Belongs to a workspace
- May have many projects
- May be referenced by notes and activity records in later phases

Implemented endpoints:

- `GET /clients`
- `GET /clients/{id}`
- `POST /clients`
- `PATCH /clients/{id}`

Delete is intentionally excluded from Phase 1A.

### Project

A structured body of work, usually tied to a client.

Implemented fields:

- `id`
- `workspaceId`
- `clientId`
- `name`
- `description`
- `status`: `planning`, `active`, `paused`, `completed`, or `archived`
- `priority`: `low`, `medium`, or `high`
- `startDate`
- `dueDate`
- `createdAt`
- `updatedAt`

Relationships:

- Belongs to a workspace
- Belongs to a client
- Has many tasks
- May have notes and activity records in later phases

Implemented endpoints:

- `GET /projects`
- `GET /projects/{id}`
- `POST /projects`
- `PATCH /projects/{id}`

Supported filters:

- `workspaceId`
- `clientId`
- `status`

Delete is intentionally excluded from Phase 1B.

### Task

A work item inside a workspace, optionally connected to a project.

Implemented fields:

- `id`
- `workspaceId`
- `projectId`
- `title`
- `description`
- `status`: `todo`, `in_progress`, `blocked`, `completed`, or `archived`
- `priority`: `low`, `medium`, `high`, or `urgent`
- `dueDate`
- `assignedUserId`
- `createdAt`
- `updatedAt`

Relationships:

- Belongs to a workspace
- Belongs to a project
- May be assigned to a workspace member
- Produces task activity events in later phases

Implemented endpoints:

- `GET /tasks`
- `GET /tasks/{id}`
- `POST /tasks`
- `PATCH /tasks/{id}`

Supported filters:

- `workspaceId`
- `projectId`
- `status`
- `priority`

`assignedUserId` is optional and must reference a member of the task workspace.

### WorkspaceMembership

Connects one user to one workspace.

Implemented fields:

- `id`
- `workspaceId`
- `userId`
- `role`: `owner` or `member`
- `createdAt`
- `updatedAt`

The workspace and user pair is unique. Meridian currently uses the user's first
membership as the active workspace.

### Note

Textual knowledge or context captured in a workspace.

Implemented fields:

- `id`
- `workspaceId`
- `clientId` optional
- `projectId` optional
- `taskId` optional
- `title`
- `content`
- `createdAt`
- `updatedAt`

Relationships:

- Belongs to a workspace
- May attach to a client
- May attach to a project
- May attach to a task
- May remain general workspace context

Implemented endpoints:

- `GET /notes`
- `GET /notes/{id}`
- `POST /notes`
- `PATCH /notes/{id}`

Supported filters:

- `workspaceId`
- `clientId`
- `projectId`
- `taskId`

### Activity

Append-oriented operational event record.

Implemented fields:

- `id`
- `workspaceId`
- `entityType`: `client`, `project`, `task`, `note`, or `workspace`
- `entityId`
- `action`: `created`, `updated`, `completed`, `archived`, or `note_added`
- `message`
- `metadata`
- `createdAt`

Relationships:

- Belongs to a workspace
- References a business entity through `entityType` and `entityId`
- May carry non-authoritative event context in `metadata`

Implemented endpoint:

- `GET /activities`

Supported filters:

- `workspaceId`
- `entityType`
- `entityId`

### AutomationRule

Declarative rule for future workflow automation.

Implemented fields:

- `id`
- `workspaceId`
- `name`
- `description`
- `triggerType`: `task_completed`, `project_created`, or `client_created`
- `actionType`: `create_follow_up_task`, `add_activity_log`, or `create_note_stub`
- `isActive`
- `createdAt`
- `updatedAt`

Relationships:

- Belongs to a workspace
- May later react to activity events or domain state changes

Implemented endpoints:

- `GET /automation-rules`
- `GET /automation-rules/{id}`
- `POST /automation-rules`
- `PATCH /automation-rules/{id}`

Phase 4B executes only active `task_completed` rules whose action is
`create_follow_up_task`. Other trigger and action combinations remain
configuration records only.

### AutomationExecution

Idempotency and traceability record for one automation rule execution.

Implemented fields:

- `id`
- `workspaceId`
- `automationRuleId`
- `triggerType`
- `triggerEntityId`
- `actionType`
- `resultEntityId`
- `createdAt`

Relationships:

- Belongs to a workspace
- Belongs to an automation rule
- References the completed task through `triggerEntityId`
- References the created follow-up task through `resultEntityId`

Implemented endpoint:

- `GET /automation-executions`

The unique rule and trigger-entity pair prevents the same rule from creating
multiple follow-up tasks for one completed task.

## Activity Event Shape

Intended event structure:

```json
{
  "id": "uuid",
  "workspaceId": "uuid",
  "entityType": "task",
  "entityId": "uuid",
  "action": "completed",
  "message": "Task completed: Draft homepage copy",
  "metadata": {},
  "createdAt": "timestamp"
}
```

Phase 3A automatically records:

- Client creation
- Project creation
- Task creation
- A task first moving to completed
- Note creation

For related notes, `entityType` and `entityId` point to the note's most specific
attachment. The note ID remains available in `metadata.noteId`.
