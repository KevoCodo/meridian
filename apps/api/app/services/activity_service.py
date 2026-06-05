from uuid import UUID

from sqlalchemy.orm import Session

from app.models.activity import Activity
from app.repositories.activity_repository import ActivityRepository
from app.schemas.activity import (
    ActivityAction,
    ActivityCreate,
    ActivityEntityType,
)


class ActivityService:
    def __init__(self, db: Session) -> None:
        self.activities = ActivityRepository(db)

    def list_activities(
        self,
        workspace_id: UUID | None = None,
        entity_type: ActivityEntityType | None = None,
        entity_id: UUID | None = None,
    ) -> list[Activity]:
        return self.activities.list(
            workspace_id=workspace_id,
            entity_type=entity_type,
            entity_id=entity_id,
        )

    def record(
        self,
        *,
        workspace_id: UUID,
        entity_type: ActivityEntityType,
        entity_id: UUID,
        action: ActivityAction,
        message: str,
        metadata: dict | None = None,
    ) -> Activity:
        payload = ActivityCreate(
            workspace_id=workspace_id,
            entity_type=entity_type,
            entity_id=entity_id,
            action=action,
            message=message,
            metadata=metadata or {},
        )
        data = payload.model_dump(mode="python", by_alias=False)
        data["metadata_json"] = data.pop("metadata")
        return self.activities.create(data)
