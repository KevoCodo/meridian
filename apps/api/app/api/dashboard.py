from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.dashboard import DashboardOverviewRead
from app.services.dashboard_service import DashboardService


router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/overview", response_model=DashboardOverviewRead)
def get_dashboard_overview(
    workspace_id: UUID | None = Query(default=None, alias="workspaceId"),
    db: Session = Depends(get_db),
) -> DashboardOverviewRead:
    return DashboardService(db).get_overview(workspace_id)
