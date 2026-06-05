# Meridian

Meridian is a workspace-aware business operations platform built as a monorepo.
It currently supports clients, projects, tasks, notes, operational activity, a
dashboard overview, and automation rule definitions.

Repository structure:

- `apps/web` for the Next.js frontend
- `apps/api` for the FastAPI backend
- `docs` for architecture and product engineering documentation
- `scripts` for local verification and developer utilities
- `docker-compose.yml` for the local application stack

## Requirements

- Docker Desktop
- Docker Compose

Node.js and Python are only required when running the frontend or backend outside Docker.

## Local Setup

Start the full local stack with one command:

```bash
docker compose up --build
```

Services:

- Frontend: http://localhost:3001
- API health: http://localhost:8001/health
- API docs: http://localhost:8001/docs
- PostgreSQL: localhost:5433

The app uses `3001`, `8001`, and `5433` on the host to avoid common conflicts with other local projects. Inside Docker, services still use standard ports: web `3000`, API `8000`, and PostgreSQL `5432`.

## Verify Setup

In another terminal, run:

```powershell
.\scripts\verify-local.ps1
```

Manual checks:

- Open http://localhost:3001 and confirm dashboard metrics, upcoming tasks, and recent activity load.
- Open http://localhost:3001/workspaces and confirm the default workspace is visible.
- Open http://localhost:3001/clients and create a client, then edit it from the detail page.
- Open http://localhost:3001/projects and create a project linked to a client, then filter by client or status.
- Open http://localhost:3001/tasks and create a task linked to a project, then filter by project, status, or priority.
- Open http://localhost:3001/notes and create a workspace or related note.
- Open http://localhost:3001/activity and confirm key business events appear.
- Open http://localhost:3001/automations and create or update an automation rule.
- Open http://localhost:8001/health and confirm:

```json
{
  "status": "healthy",
  "database": "connected",
  "version": "0.1.0"
}
```

- Open http://localhost:8001/docs and confirm FastAPI documentation loads.

Available API endpoints:

- `GET /workspaces`
- `GET /workspaces/{id}`
- `GET /clients`
- `GET /clients/{id}`
- `POST /clients`
- `PATCH /clients/{id}`
- `GET /projects`
- `GET /projects/{id}`
- `POST /projects`
- `PATCH /projects/{id}`
- `GET /tasks`
- `GET /tasks/{id}`
- `POST /tasks`
- `PATCH /tasks/{id}`
- `GET /notes`
- `GET /notes/{id}`
- `POST /notes`
- `PATCH /notes/{id}`
- `GET /activities`
- `GET /dashboard/overview`
- `GET /automation-rules`
- `GET /automation-rules/{id}`
- `POST /automation-rules`
- `PATCH /automation-rules/{id}`
- `GET /automation-executions`

Project filters:

- `GET /projects?workspaceId=<uuid>`
- `GET /projects?clientId=<uuid>`
- `GET /projects?status=active`

Task filters:

- `GET /tasks?workspaceId=<uuid>`
- `GET /tasks?projectId=<uuid>`
- `GET /tasks?status=in_progress`
- `GET /tasks?priority=urgent`

Note filters:

- `GET /notes?workspaceId=<uuid>`
- `GET /notes?clientId=<uuid>`
- `GET /notes?projectId=<uuid>`
- `GET /notes?taskId=<uuid>`

Activity filters:

- `GET /activities?workspaceId=<uuid>`
- `GET /activities?entityType=project`
- `GET /activities?entityId=<uuid>`

Activity is recorded automatically when clients, projects, tasks, and notes are
created, and when a task first moves to `completed`.

Dashboard overview:

- `GET /dashboard/overview`
- `GET /dashboard/overview?workspaceId=<uuid>`

The overview counts active clients, active projects, open and completed tasks,
plus notes and activity created during the last 7 days.

Active `task_completed` rules using `create_follow_up_task` execute
synchronously when a task moves to completed. Meridian creates one follow-up
task per matching rule and completed task, records the execution, and logs an
activity event. Other trigger and action combinations remain definition-only.

## Environment Files

Example environment files are committed for local reference:

- `apps/web/.env.example`
- `apps/api/.env.example`

For Docker Compose, environment values are supplied directly by `docker-compose.yml`. Copy the examples to `.env` only when running a service outside Docker.

## Troubleshooting

If startup fails because a port is already allocated, check for another local service using the same port:

```powershell
docker ps --format "{{.Names}} {{.Ports}}"
```

If containers start but health is degraded, confirm PostgreSQL is healthy:

```powershell
docker compose ps
```

If the frontend cannot show backend health, confirm the API responds from the host:

```powershell
Invoke-RestMethod http://localhost:8001/health
```

Stop the stack with:

```bash
docker compose down
```
