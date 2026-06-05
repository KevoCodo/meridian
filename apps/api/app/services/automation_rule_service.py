from uuid import UUID

from sqlalchemy.orm import Session

from app.core.errors import ResourceNotFoundError
from app.models.automation_rule import AutomationRule
from app.repositories.automation_rule_repository import AutomationRuleRepository
from app.repositories.workspace_repository import WorkspaceRepository
from app.schemas.automation_rule import AutomationRuleCreate, AutomationRuleUpdate


class AutomationRuleService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.rules = AutomationRuleRepository(db)
        self.workspaces = WorkspaceRepository(db)

    def list_rules(self, workspace_id: UUID | None = None) -> list[AutomationRule]:
        return self.rules.list(workspace_id)

    def get_rule(self, rule_id: UUID) -> AutomationRule:
        rule = self.rules.get(rule_id)
        if rule is None:
            raise ResourceNotFoundError("automation rule", rule_id)
        return rule

    def create_rule(self, payload: AutomationRuleCreate) -> AutomationRule:
        self._validate_workspace(payload.workspace_id)
        rule = self.rules.create(payload.model_dump(mode="python", by_alias=False))
        self.db.commit()
        self.db.refresh(rule)
        return rule

    def update_rule(
        self,
        rule_id: UUID,
        payload: AutomationRuleUpdate,
    ) -> AutomationRule:
        rule = self.get_rule(rule_id)
        update_data = payload.model_dump(
            mode="python",
            by_alias=False,
            exclude_unset=True,
        )
        self._validate_workspace(update_data.get("workspace_id", rule.workspace_id))
        rule = self.rules.update(rule, update_data)
        self.db.commit()
        self.db.refresh(rule)
        return rule

    def _validate_workspace(self, workspace_id: UUID) -> None:
        if self.workspaces.get(workspace_id) is None:
            raise ResourceNotFoundError("workspace", workspace_id)
