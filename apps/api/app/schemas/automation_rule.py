from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.base import to_camel


class AutomationTriggerType(StrEnum):
    TASK_COMPLETED = "task_completed"
    PROJECT_CREATED = "project_created"
    CLIENT_CREATED = "client_created"


class AutomationActionType(StrEnum):
    CREATE_FOLLOW_UP_TASK = "create_follow_up_task"
    ADD_ACTIVITY_LOG = "add_activity_log"
    CREATE_NOTE_STUB = "create_note_stub"


class AutomationRuleBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    trigger_type: AutomationTriggerType
    action_type: AutomationActionType
    is_active: bool = False

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class AutomationRuleCreate(AutomationRuleBase):
    workspace_id: UUID


class AutomationRuleUpdate(BaseModel):
    workspace_id: UUID | None = None
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    trigger_type: AutomationTriggerType | None = None
    action_type: AutomationActionType | None = None
    is_active: bool | None = None

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class AutomationRuleRead(AutomationRuleBase):
    id: UUID
    workspace_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        alias_generator=to_camel,
        from_attributes=True,
        populate_by_name=True,
    )
