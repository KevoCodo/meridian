from uuid import UUID

from sqlalchemy.orm import Session

from app.core.errors import ResourceNotFoundError
from app.models.task import Task
from app.repositories.project_repository import ProjectRepository
from app.repositories.task_repository import TaskRepository
from app.repositories.workspace_repository import WorkspaceRepository
from app.repositories.workspace_membership_repository import WorkspaceMembershipRepository
from app.schemas.activity import ActivityAction, ActivityEntityType
from app.schemas.task import TaskCreate, TaskPriority, TaskStatus, TaskUpdate
from app.services.activity_service import ActivityService
from app.services.automation_service import AutomationService


class TaskService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.activities = ActivityService(db)
        self.automations = AutomationService(db)
        self.projects = ProjectRepository(db)
        self.tasks = TaskRepository(db)
        self.workspaces = WorkspaceRepository(db)
        self.memberships = WorkspaceMembershipRepository(db)

    def list_tasks(
        self,
        workspace_id: UUID | None = None,
        project_id: UUID | None = None,
        status: TaskStatus | None = None,
        priority: TaskPriority | None = None,
    ) -> list[Task]:
        return self.tasks.list(
            workspace_id=workspace_id,
            project_id=project_id,
            status=status,
            priority=priority,
        )

    def get_task(self, task_id: UUID) -> Task:
        task = self.tasks.get(task_id)
        if task is None:
            raise ResourceNotFoundError("task", task_id)
        return task

    def create_task(self, payload: TaskCreate) -> Task:
        self._validate_workspace_project(payload.workspace_id, payload.project_id)
        self._validate_assignment(payload.workspace_id, payload.assigned_user_id)
        task = self.tasks.create(payload.model_dump(mode="python", by_alias=False))
        self.activities.record(
            workspace_id=task.workspace_id,
            entity_type=ActivityEntityType.TASK,
            entity_id=task.id,
            action=ActivityAction.CREATED,
            message=f"Task created: {task.title}",
        )
        self.db.commit()
        self.db.refresh(task)
        return task

    def update_task(self, task_id: UUID, payload: TaskUpdate) -> Task:
        task = self.get_task(task_id)
        update_data = payload.model_dump(
            mode="python",
            by_alias=False,
            exclude_unset=True,
        )
        workspace_id = update_data.get("workspace_id", task.workspace_id)
        project_id = update_data.get("project_id", task.project_id)
        self._validate_workspace_project(workspace_id, project_id)
        self._validate_assignment(
            workspace_id,
            update_data.get("assigned_user_id", task.assigned_user_id),
        )
        became_completed = (
            task.status != TaskStatus.COMPLETED.value
            and update_data.get("status") == TaskStatus.COMPLETED
        )

        task = self.tasks.update(task, update_data)
        if became_completed:
            self.activities.record(
                workspace_id=task.workspace_id,
                entity_type=ActivityEntityType.TASK,
                entity_id=task.id,
                action=ActivityAction.COMPLETED,
                message=f"Task completed: {task.title}",
            )
            self.automations.handle_task_completed(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def _validate_workspace_project(self, workspace_id: UUID, project_id: UUID) -> None:
        workspace = self.workspaces.get(workspace_id)
        if workspace is None:
            raise ResourceNotFoundError("workspace", workspace_id)

        project = self.projects.get(project_id)
        if project is None or project.workspace_id != workspace_id:
            raise ResourceNotFoundError("project", project_id)

    def _validate_assignment(self, workspace_id: UUID, user_id: UUID | None) -> None:
        if user_id is not None and self.memberships.get(user_id, workspace_id) is None:
            raise ResourceNotFoundError("workspace member", user_id)
