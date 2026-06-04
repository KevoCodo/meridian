# Meridian Data Model

This document defines the initial domain entities for planning only. Phase 0A includes placeholder models but no migrations, CRUD endpoints, or business workflows.

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

Relationships:

- Belongs to a workspace
- May have many projects
- May be referenced by notes and activity records in later phases

### Project

A structured body of work, usually tied to a client.

Relationships:

- Belongs to a workspace
- May belong to a client
- Has many tasks
- May have notes and activity records in later phases

### Task

A work item inside a workspace, optionally connected to a project.

Relationships:

- Belongs to a workspace
- May belong to a project
- May be assigned to users in later phases
- Produces task activity events in later phases

### Note

Textual knowledge or context captured in a workspace.

Relationships:

- Belongs to a workspace
- May be authored by a user
- May later attach to clients, projects, tasks, or workflows

### Activity

Append-oriented operational event record.

Relationships:

- Belongs to a workspace
- May have an actor user
- References a subject by `subjectType` and `subjectId`

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
  "actorId": "uuid-or-null",
  "eventType": "task_completed",
  "subjectType": "task",
  "subjectId": "uuid",
  "metadata": {},
  "createdAt": "timestamp"
}
```

Planned event types include:

- `client_created`
- `project_created`
- `task_created`
- `task_updated`
- `task_completed`
- `note_added`
- `automation_triggered`
- `workflow_executed`

Activity logging is not implemented in Phase 0A.
