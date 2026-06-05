from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_workspace_id, require_workspace_access
from app.database.session import get_db
from app.schemas.activity import ActivityEntityType, ActivityRead
from app.services.activity_service import ActivityService


router = APIRouter(prefix="/activities", tags=["activities"])


@router.get("", response_model=list[ActivityRead])
def list_activities(
    requested_workspace_id: UUID | None = Query(default=None, alias="workspaceId"),
    entity_type: ActivityEntityType | None = Query(default=None, alias="entityType"),
    entity_id: UUID | None = Query(default=None, alias="entityId"),
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> list[ActivityRead]:
    if requested_workspace_id is not None:
        require_workspace_access(workspace_id, requested_workspace_id)
    return ActivityService(db).list_activities(
        workspace_id=workspace_id,
        entity_type=entity_type,
        entity_id=entity_id,
    )
