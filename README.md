# Meridian

Meridian is a business operations platform foundation built as a monorepo with:

- `apps/web` for the Next.js frontend
- `apps/api` for the FastAPI backend
- `docs` for architecture and product engineering documentation
- `docker` and `scripts` for local infrastructure support

## Local Startup

```bash
docker compose up --build
```

Services:

- Frontend: http://localhost:3001
- API health: http://localhost:8001/health
- PostgreSQL: localhost:5433
