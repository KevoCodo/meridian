from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.activities import router as activities_router
from app.api.clients import router as clients_router
from app.api.dashboard import router as dashboard_router
from app.api.notes import router as notes_router
from app.api.projects import router as projects_router
from app.api.tasks import router as tasks_router
from app.api.workspaces import router as workspaces_router
from app.core.config import settings
from app.database.bootstrap import ensure_default_workspace
from app.database.session import SessionLocal
from app.health.router import router as health_router


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="Meridian business operations platform API.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_router)
    app.include_router(activities_router)
    app.include_router(dashboard_router)
    app.include_router(workspaces_router)
    app.include_router(clients_router)
    app.include_router(projects_router)
    app.include_router(tasks_router)
    app.include_router(notes_router)

    @app.on_event("startup")
    def seed_default_workspace() -> None:
        db = SessionLocal()
        try:
            ensure_default_workspace(db)
        finally:
            db.close()

    return app


app = create_app()
