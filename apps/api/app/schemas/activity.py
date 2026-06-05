from datetime import datetime
from enum import StrEnum
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.base import to_camel


class ActivityEntityType(StrEnum):
    CLIENT = "client"
    PROJECT = "project"
    TASK = "task"
    NOTE = "note"
    WORKSPACE = "workspace"


class ActivityAction(StrEnum):
    CREATED = "created"
    UPDATED = "updated"
    COMPLETED = "completed"
    ARCHIVED = "archived"
    NOTE_ADDED = "note_added"


class ActivityCreate(BaseModel):
    workspace_id: UUID
    entity_type: ActivityEntityType
    entity_id: UUID
    action: ActivityAction
    message: str = Field(min_length=1, max_length=500)
    metadata: dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class ActivityRead(BaseModel):
    id: UUID
    workspace_id: UUID
    entity_type: ActivityEntityType
    entity_id: UUID
    action: ActivityAction
    message: str
    metadata: dict[str, Any] = Field(validation_alias="metadata_json")
    created_at: datetime

    model_config = ConfigDict(
        alias_generator=to_camel,
        from_attributes=True,
        populate_by_name=True,
    )
