# Meridian Architecture

## Monorepo Structure

```text
meridian/
  apps/
    web/
    api/
  docs/
  docker/
  scripts/
  .github/
```

## Backend

The backend is a FastAPI application under `apps/api`.

```text
app/
  api/            Route modules and versioned API surfaces
  core/           Settings, shared configuration, application constants
  database/       SQLAlchemy base, engine, sessions, migrations support
  models/         SQLAlchemy models and persistence shape
  schemas/        Pydantic request and response schemas
  services/       Business logic and orchestration
  repositories/   Persistence access and query construction
  middleware/     Request middleware
  health/         Health endpoint
```

Routes should stay thin. They validate transport concerns, call services, and return API schemas. Services own business rules and orchestration. Repositories own persistence logic and SQLAlchemy query details.

## Frontend

The frontend is a Next.js application under `apps/web`.

```text
app/         Next.js routes and layouts
components/  Shared UI components
features/    Product-area components and workflows
lib/         Framework helpers and shared utilities
hooks/       Reusable React hooks
types/       Shared TypeScript types
services/    API clients and external service boundaries
```

Feature-oriented organization should be preferred once product surfaces appear. Shared components should remain generic and presentation-focused.

## Multi-Tenant Readiness

Major business entities must be workspace-scoped through `workspaceId` at the API contract level and `workspace_id` at the database level. This supports future multiple companies, multiple workspaces, and multiple teams without redesigning the schema.

Workspace scoping should be enforced consistently in repositories and services before user-facing CRUD is added.

## Integration Readiness

Future integrations should enter through explicit modules:

- API clients in `services`
- Domain orchestration in backend `services`
- Persistence isolated in `repositories`
- Activity/event records through the activity foundation

External integrations should not leak directly into route handlers or frontend components.
