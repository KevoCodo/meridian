# Meridian Architecture

## Monorepo Structure

```text
meridian/
  apps/
    web/
    api/
  docs/
  scripts/
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

## Authentication

Phase 6A uses short-lived signed JWT claims stored in an HTTP-only, same-site
cookie. Passwords are hashed with Argon2 through `pwdlib`; plain-text passwords
are never persisted. FastAPI validates the cookie through a shared dependency
before allowing access to business routers.

The Next.js application proxies authentication requests so the browser cookie
stays first-party to the frontend. Its route proxy validates the session before
serving protected pages, while server-side API calls forward the current cookie
to FastAPI. Health checks, API documentation, login, and registration remain
public.

Authentication proves who a user is. Workspace authorization then limits that
user to business data owned by their active workspace.

## Workspace Authorization

Phase 6B introduces `WorkspaceMembership` as the link between users and
workspaces. Registration creates a workspace and an owner membership in the
same transaction. The API resolves the user's first membership as the active
workspace and scopes list, detail, create, and update operations to that
workspace.

Tasks reference an assigned user through `assignedUserId`. Assignment is only
valid when that user is a member of the task workspace. Workspace switching,
invitations, and role-specific permissions are intentionally deferred.

## Activity Timeline

Activity records are append-oriented operational events. `ActivityService` owns
event creation and is called by domain services, never directly by route
handlers. Each activity is flushed and committed in the same database
transaction as the business change that caused it.

The Phase 3A activity timeline is intentionally synchronous and read-only:

- Domain services record human-readable event messages.
- `ActivityRepository` owns filtering and newest-first ordering.
- `GET /activities` supports workspace and entity filtering.
- The frontend uses one timeline component for workspace-wide and related views.

Activity is not a complete audit log. Phase 3A does not include actor
attribution, permissions, notifications, real-time delivery, or background
processing.

## Automation Rule Definitions

Automation rules are workspace-scoped configuration records managed through the
standard route, service, repository, and model boundaries. Phase 4A stores the
intended trigger, action, active state, and description only.

Phase 4B introduces a narrow synchronous execution path:

1. `TaskService` detects a transition to `completed`.
2. `AutomationService` loads active matching rules for the task workspace.
3. A unique `AutomationExecution` record prevents duplicate execution.
4. A follow-up task and activity event are created.
5. Task completion, execution, follow-up task, and activity commit together.

Only `task_completed` with `create_follow_up_task` executes. Other rule
combinations remain definition-only. Execution does not use background workers,
scheduling, external integrations, or AI.

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

## Local Runtime

Docker Compose is the primary local development path during foundation phases.

Host endpoints:

- Frontend: `http://localhost:3001`
- API health: `http://localhost:8001/health`
- API docs: `http://localhost:8001/docs`
- PostgreSQL: `localhost:5433`

Container network endpoints:

- Web: `web:3000`
- API: `api:8000`
- PostgreSQL: `postgres:5432`

The frontend calls the backend health endpoint through the configured API base URL. In Docker Compose, the web container uses `http://api:8000`; when running outside Docker, use `http://localhost:8001`.
