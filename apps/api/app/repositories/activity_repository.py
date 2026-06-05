from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.activity import Activity
from app.schemas.activity import ActivityEntityType


class ActivityRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list(
        self,
        workspace_id: UUID | None = None,
        entity_type: ActivityEntityType | None = None,
        entity_id: UUID | None = None,
    ) -> list[Activity]:
        statement = select(Activity)

        if workspace_id is not None:
            statement = statement.where(Activity.workspace_id == workspace_id)
        if entity_type is not None:
            statement = statement.where(Activity.entity_type == entity_type.value)
        if entity_id is not None:
            statement = statement.where(Activity.entity_id == entity_id)

        statement = statement.order_by(Activity.created_at.desc())
        return list(self.db.scalars(statement).all())

    def create(self, data: dict) -> Activity:
        activity = Activity(**data)
        self.db.add(activity)
        self.db.flush()
        return activity
