from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.activities import router as activities_router
from app.api.auth import router as auth_router
from app.api.dependencies import get_current_user
from app.api.automation_rules import router as automation_rules_router
from app.api.automation_executions import router as automation_executions_router
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
    app.include_router(auth_router)

    protected_dependencies = [Depends(get_current_user)]
    app.include_router(activities_router, dependencies=protected_dependencies)
    app.include_router(automation_rules_router, dependencies=protected_dependencies)
    app.include_router(automation_executions_router, dependencies=protected_dependencies)
    app.include_router(dashboard_router, dependencies=protected_dependencies)
    app.include_router(workspaces_router, dependencies=protected_dependencies)
    app.include_router(clients_router, dependencies=protected_dependencies)
    app.include_router(projects_router, dependencies=protected_dependencies)
    app.include_router(tasks_router, dependencies=protected_dependencies)
    app.include_router(notes_router, dependencies=protected_dependencies)

    @app.on_event("startup")
    def seed_default_workspace() -> None:
        db = SessionLocal()
        try:
            ensure_default_workspace(db)
        finally:
            db.close()

    return app


app = create_app()
