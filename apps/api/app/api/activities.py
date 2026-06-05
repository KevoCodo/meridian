from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.activity import ActivityEntityType, ActivityRead
from app.services.activity_service import ActivityService


router = APIRouter(prefix="/activities", tags=["activities"])


@router.get("", response_model=list[ActivityRead])
def list_activities(
    workspace_id: UUID | None = Query(default=None, alias="workspaceId"),
    entity_type: ActivityEntityType | None = Query(default=None, alias="entityType"),
    entity_id: UUID | None = Query(default=None, alias="entityId"),
    db: Session = Depends(get_db),
) -> list[ActivityRead]:
    return ActivityService(db).list_activities(
        workspace_id=workspace_id,
        entity_type=entity_type,
        entity_id=entity_id,
    )
