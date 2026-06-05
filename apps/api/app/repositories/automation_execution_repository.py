from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.automation_execution import AutomationExecution


class AutomationExecutionRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list(
        self,
        workspace_id: UUID | None = None,
        automation_rule_id: UUID | None = None,
        trigger_entity_id: UUID | None = None,
    ) -> list[AutomationExecution]:
        statement = select(AutomationExecution)
        if workspace_id is not None:
            statement = statement.where(AutomationExecution.workspace_id == workspace_id)
        if automation_rule_id is not None:
            statement = statement.where(
                AutomationExecution.automation_rule_id == automation_rule_id
            )
        if trigger_entity_id is not None:
            statement = statement.where(
                AutomationExecution.trigger_entity_id == trigger_entity_id
            )
        statement = statement.order_by(AutomationExecution.created_at.desc())
        return list(self.db.scalars(statement).all())

    def get_for_rule_and_trigger(
        self,
        automation_rule_id: UUID,
        trigger_entity_id: UUID,
    ) -> AutomationExecution | None:
        statement = select(AutomationExecution).where(
            AutomationExecution.automation_rule_id == automation_rule_id,
            AutomationExecution.trigger_entity_id == trigger_entity_id,
        )
        return self.db.scalar(statement)

    def create(self, data: dict) -> AutomationExecution:
        execution = AutomationExecution(**data)
        self.db.add(execution)
        self.db.flush()
        return execution

    def set_result(
        self,
        execution: AutomationExecution,
        result_entity_id: UUID,
    ) -> AutomationExecution:
        execution.result_entity_id = result_entity_id
        self.db.flush()
        return execution
