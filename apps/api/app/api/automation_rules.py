from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_workspace_id, require_workspace_access
from app.core.errors import ResourceNotFoundError
from app.database.session import get_db
from app.schemas.automation_rule import (
    AutomationRuleCreate,
    AutomationRuleRead,
    AutomationRuleUpdate,
)
from app.services.automation_rule_service import AutomationRuleService


router = APIRouter(prefix="/automation-rules", tags=["automation rules"])


@router.get("", response_model=list[AutomationRuleRead])
def list_automation_rules(
    requested_workspace_id: UUID | None = Query(default=None, alias="workspaceId"),
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> list[AutomationRuleRead]:
    if requested_workspace_id is not None:
        require_workspace_access(workspace_id, requested_workspace_id)
    return AutomationRuleService(db).list_rules(workspace_id)


@router.get("/{rule_id}", response_model=AutomationRuleRead)
def get_automation_rule(
    rule_id: UUID,
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> AutomationRuleRead:
    try:
        rule = AutomationRuleService(db).get_rule(rule_id)
        require_workspace_access(workspace_id, rule.workspace_id)
        return rule
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error


@router.post("", response_model=AutomationRuleRead, status_code=status.HTTP_201_CREATED)
def create_automation_rule(
    payload: AutomationRuleCreate,
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> AutomationRuleRead:
    try:
        require_workspace_access(workspace_id, payload.workspace_id)
        return AutomationRuleService(db).create_rule(payload)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error


@router.patch("/{rule_id}", response_model=AutomationRuleRead)
def update_automation_rule(
    rule_id: UUID,
    payload: AutomationRuleUpdate,
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> AutomationRuleRead:
    try:
        rule = AutomationRuleService(db).get_rule(rule_id)
        require_workspace_access(workspace_id, rule.workspace_id)
        if payload.workspace_id is not None:
            require_workspace_access(workspace_id, payload.workspace_id)
        return AutomationRuleService(db).update_rule(rule_id, payload)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error
