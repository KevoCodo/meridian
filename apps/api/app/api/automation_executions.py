from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.automation_execution import AutomationExecutionRead
from app.services.automation_service import AutomationService


router = APIRouter(prefix="/automation-executions", tags=["automation executions"])


@router.get("", response_model=list[AutomationExecutionRead])
def list_automation_executions(
    workspace_id: UUID | None = Query(default=None, alias="workspaceId"),
    automation_rule_id: UUID | None = Query(default=None, alias="automationRuleId"),
    trigger_entity_id: UUID | None = Query(default=None, alias="triggerEntityId"),
    db: Session = Depends(get_db),
) -> list[AutomationExecutionRead]:
    return AutomationService(db).list_executions(
        workspace_id=workspace_id,
        automation_rule_id=automation_rule_id,
        trigger_entity_id=trigger_entity_id,
    )
