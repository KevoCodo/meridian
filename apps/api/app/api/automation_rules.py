from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

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
    workspace_id: UUID | None = Query(default=None, alias="workspaceId"),
    db: Session = Depends(get_db),
) -> list[AutomationRuleRead]:
    return AutomationRuleService(db).list_rules(workspace_id)


@router.get("/{rule_id}", response_model=AutomationRuleRead)
def get_automation_rule(
    rule_id: UUID,
    db: Session = Depends(get_db),
) -> AutomationRuleRead:
    try:
        return AutomationRuleService(db).get_rule(rule_id)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error


@router.post("", response_model=AutomationRuleRead, status_code=status.HTTP_201_CREATED)
def create_automation_rule(
    payload: AutomationRuleCreate,
    db: Session = Depends(get_db),
) -> AutomationRuleRead:
    try:
        return AutomationRuleService(db).create_rule(payload)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error


@router.patch("/{rule_id}", response_model=AutomationRuleRead)
def update_automation_rule(
    rule_id: UUID,
    payload: AutomationRuleUpdate,
    db: Session = Depends(get_db),
) -> AutomationRuleRead:
    try:
        return AutomationRuleService(db).update_rule(rule_id, payload)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error
