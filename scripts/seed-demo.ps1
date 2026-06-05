$ErrorActionPreference = "Stop"

Write-Host "Seeding Meridian demo workspace..."
docker compose exec -T api python -m app.database.seed_demo
Write-Host "Demo workspace is ready at http://localhost:3001"
