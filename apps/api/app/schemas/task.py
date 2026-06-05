from datetime import date, datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.base import to_camel
from app.schemas.auth import UserRead


class TaskStatus(StrEnum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    BLOCKED = "blocked"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class TaskPriority(StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    status: TaskStatus = TaskStatus.TODO
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: date | None = None
    assigned_user_id: UUID | None = None

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class TaskCreate(TaskBase):
    workspace_id: UUID
    project_id: UUID


class TaskUpdate(BaseModel):
    workspace_id: UUID | None = None
    project_id: UUID | None = None
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    due_date: date | None = None
    assigned_user_id: UUID | None = None

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class TaskRead(TaskBase):
    id: UUID
    workspace_id: UUID
    project_id: UUID
    created_at: datetime
    updated_at: datetime
    assigned_user: UserRead | None = None

    model_config = ConfigDict(
        alias_generator=to_camel,
        from_attributes=True,
        populate_by_name=True,
    )
