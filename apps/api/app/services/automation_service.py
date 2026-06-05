from uuid import UUID

from sqlalchemy.orm import Session

from app.models.automation_execution import AutomationExecution
from app.models.task import Task
from app.repositories.automation_execution_repository import (
    AutomationExecutionRepository,
)
from app.repositories.automation_rule_repository import AutomationRuleRepository
from app.repositories.task_repository import TaskRepository
from app.schemas.activity import ActivityAction, ActivityEntityType
from app.schemas.automation_rule import AutomationActionType, AutomationTriggerType
from app.services.activity_service import ActivityService


FOLLOW_UP_PREFIX = "Follow up on completed task: "


class AutomationService:
    def __init__(self, db: Session) -> None:
        self.activities = ActivityService(db)
        self.executions = AutomationExecutionRepository(db)
        self.rules = AutomationRuleRepository(db)
        self.tasks = TaskRepository(db)

    def list_executions(
        self,
        workspace_id: UUID | None = None,
        automation_rule_id: UUID | None = None,
        trigger_entity_id: UUID | None = None,
    ) -> list[AutomationExecution]:
        return self.executions.list(
            workspace_id=workspace_id,
            automation_rule_id=automation_rule_id,
            trigger_entity_id=trigger_entity_id,
        )

    def handle_task_completed(self, task: Task) -> list[AutomationExecution]:
        rules = self.rules.list_active_matching(
            task.workspace_id,
            AutomationTriggerType.TASK_COMPLETED,
            AutomationActionType.CREATE_FOLLOW_UP_TASK,
        )
        executions: list[AutomationExecution] = []

        for rule in rules:
            if self.executions.get_for_rule_and_trigger(rule.id, task.id) is not None:
                continue

            execution = self.executions.create(
                {
                    "workspace_id": task.workspace_id,
                    "automation_rule_id": rule.id,
                    "trigger_type": AutomationTriggerType.TASK_COMPLETED.value,
                    "trigger_entity_id": task.id,
                    "action_type": AutomationActionType.CREATE_FOLLOW_UP_TASK.value,
                }
            )
            follow_up = self.tasks.create(
                {
                    "workspace_id": task.workspace_id,
                    "project_id": task.project_id,
                    "title": self._follow_up_title(task.title),
                    "description": f"Created automatically by rule: {rule.name}",
                    "status": "todo",
                    "priority": "medium",
                }
            )
            self.executions.set_result(execution, follow_up.id)
            self.activities.record(
                workspace_id=task.workspace_id,
                entity_type=ActivityEntityType.TASK,
                entity_id=task.id,
                action=ActivityAction.CREATED,
                message=f"Automation created follow-up task: {follow_up.title}",
                metadata={
                    "automationExecutionId": str(execution.id),
                    "automationRuleId": str(rule.id),
                    "followUpTaskId": str(follow_up.id),
                },
            )
            executions.append(execution)

        return executions

    def _follow_up_title(self, original_title: str) -> str:
        return f"{FOLLOW_UP_PREFIX}{original_title}"[:255]
