# Meridian Data Model

This document defines Meridian's domain entities. Phase 1A implements Workspace and Client, Phase 1B implements Project, Phase 2A implements Task, Phase 2B implements Notes, and Phase 3A implements Activity.

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

- Has many users
- Has many clients
- Has many projects
- Has many tasks
- Has many notes
- Has many activities
- Has many automation rules

### User

A person with access to a workspace.

Relationships:

- Belongs to a workspace
- May author notes
- May act on activities
- May own or be assigned future work items

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
- `assignedTo`
- `createdAt`
- `updatedAt`

Relationships:

- Belongs to a workspace
- Belongs to a project
- May be assigned to users in later phases
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

`assignedTo` is currently optional text. It can move to a user relationship after authentication and user management exist.

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

Relationships:

- Belongs to a workspace
- May later react to activity events or domain state changes

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
