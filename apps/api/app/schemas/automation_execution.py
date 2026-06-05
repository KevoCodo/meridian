from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.automation_rule import AutomationActionType, AutomationTriggerType
from app.schemas.base import to_camel


class AutomationExecutionRead(BaseModel):
    id: UUID
    workspace_id: UUID
    automation_rule_id: UUID
    trigger_type: AutomationTriggerType
    trigger_entity_id: UUID
    action_type: AutomationActionType
    result_entity_id: UUID | None
    created_at: datetime

    model_config = ConfigDict(
        alias_generator=to_camel,
        from_attributes=True,
        populate_by_name=True,
    )
