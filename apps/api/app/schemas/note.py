from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.base import to_camel


class NoteBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    content: str = Field(min_length=1)

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class NoteCreate(NoteBase):
    workspace_id: UUID
    client_id: UUID | None = None
    project_id: UUID | None = None
    task_id: UUID | None = None


class NoteUpdate(BaseModel):
    workspace_id: UUID | None = None
    client_id: UUID | None = None
    project_id: UUID | None = None
    task_id: UUID | None = None
    title: str | None = Field(default=None, min_length=1, max_length=255)
    content: str | None = Field(default=None, min_length=1)

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class NoteRead(NoteBase):
    id: UUID
    workspace_id: UUID
    client_id: UUID | None
    project_id: UUID | None
    task_id: UUID | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        alias_generator=to_camel,
        from_attributes=True,
        populate_by_name=True,
    )
