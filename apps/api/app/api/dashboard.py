from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_workspace_id, require_workspace_access
from app.database.session import get_db
from app.schemas.dashboard import DashboardOverviewRead
from app.services.dashboard_service import DashboardService


router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/overview", response_model=DashboardOverviewRead)
def get_dashboard_overview(
    requested_workspace_id: UUID | None = Query(default=None, alias="workspaceId"),
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> DashboardOverviewRead:
    if requested_workspace_id is not None:
        require_workspace_access(workspace_id, requested_workspace_id)
    return DashboardService(db).get_overview(workspace_id)
