# Meridian

Meridian is a business operations platform foundation built as a monorepo with:

- `apps/web` for the Next.js frontend
- `apps/api` for the FastAPI backend
- `docs` for architecture and product engineering documentation
- `docker` and `scripts` for local infrastructure support

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

- Open http://localhost:3001 and confirm the page shows `Meridian`, `Project Status: Foundation Phase`, backend health status, and database connection status.
- Open http://localhost:3001/workspaces and confirm the default workspace is visible.
- Open http://localhost:3001/clients and create a client, then edit it from the detail page.
- Open http://localhost:3001/projects and create a project linked to a client, then filter by client or status.
- Open http://localhost:8001/health and confirm:

```json
{
  "status": "healthy",
  "database": "connected",
  "version": "0.1.0"
}
```

- Open http://localhost:8001/docs and confirm FastAPI documentation loads.

Phase 1A API endpoints:

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

Project filters:

- `GET /projects?workspaceId=<uuid>`
- `GET /projects?clientId=<uuid>`
- `GET /projects?status=active`

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
