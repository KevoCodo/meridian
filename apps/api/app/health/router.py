from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text

from app.core.config import settings
from app.database.session import engine


router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    status: str
    database: str
    version: str


@router.get("/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    database_status = "disconnected"
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        database_status = "connected"
    except Exception:
        database_status = "disconnected"

    return HealthResponse(
        status="healthy" if database_status == "connected" else "degraded",
        database=database_status,
        version=settings.VERSION,
    )
