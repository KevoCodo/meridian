# Database Standards

## Naming

Database tables and columns use snake_case.

Examples:

- `workspaces`
- `workspace_id`
- `created_at`
- `updated_at`

API contracts should expose camelCase fields.

## Identifiers

Primary keys should use UUIDs. Foreign keys should be indexed when they are used for tenant scoping or common lookups.

## Timestamps

Standard timestamp fields:

- `created_at`
- `updated_at`

Timestamps should be timezone-aware.

## Multi-Tenant Scope

Major business tables should include `workspace_id`. Repository queries must scope reads and writes by workspace before feature endpoints are added.

## Soft Delete

Soft delete is not implemented in Phase 0A. Future lifecycle fields should be reserved conceptually:

- `archived_at`
- `deleted_at`

When introduced, soft delete filtering should be centralized in repositories rather than scattered through route handlers.

## Audit Fields

Future audit fields may include:

- `created_by_id`
- `updated_by_id`
- `archived_by_id`
- `deleted_by_id`

Audit behavior should be introduced only after authentication and workspace context exist.
