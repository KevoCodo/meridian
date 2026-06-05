from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.automation_rule import AutomationRule
from app.schemas.automation_rule import AutomationActionType, AutomationTriggerType


class AutomationRuleRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list(self, workspace_id: UUID | None = None) -> list[AutomationRule]:
        statement = select(AutomationRule)
        if workspace_id is not None:
            statement = statement.where(AutomationRule.workspace_id == workspace_id)
        statement = statement.order_by(AutomationRule.created_at.desc())
        return list(self.db.scalars(statement).all())

    def get(self, rule_id: UUID) -> AutomationRule | None:
        return self.db.get(AutomationRule, rule_id)

    def list_active_matching(
        self,
        workspace_id: UUID,
        trigger_type: AutomationTriggerType,
        action_type: AutomationActionType,
    ) -> list[AutomationRule]:
        statement = (
            select(AutomationRule)
            .where(
                AutomationRule.workspace_id == workspace_id,
                AutomationRule.is_active.is_(True),
                AutomationRule.trigger_type == trigger_type.value,
                AutomationRule.action_type == action_type.value,
            )
            .order_by(AutomationRule.created_at.asc())
        )
        return list(self.db.scalars(statement).all())

    def create(self, data: dict) -> AutomationRule:
        rule = AutomationRule(**data)
        self.db.add(rule)
        self.db.flush()
        return rule

    def update(self, rule: AutomationRule, data: dict) -> AutomationRule:
        for field, value in data.items():
            setattr(rule, field, value)
        self.db.flush()
        return rule
