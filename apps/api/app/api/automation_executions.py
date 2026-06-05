from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_workspace_id, require_workspace_access
from app.database.session import get_db
from app.schemas.automation_execution import AutomationExecutionRead
from app.services.automation_service import AutomationService


router = APIRouter(prefix="/automation-executions", tags=["automation executions"])


@router.get("", response_model=list[AutomationExecutionRead])
def list_automation_executions(
    requested_workspace_id: UUID | None = Query(default=None, alias="workspaceId"),
    automation_rule_id: UUID | None = Query(default=None, alias="automationRuleId"),
    trigger_entity_id: UUID | None = Query(default=None, alias="triggerEntityId"),
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> list[AutomationExecutionRead]:
    if requested_workspace_id is not None:
        require_workspace_access(workspace_id, requested_workspace_id)
    return AutomationService(db).list_executions(
        workspace_id=workspace_id,
        automation_rule_id=automation_rule_id,
        trigger_entity_id=trigger_entity_id,
    )
