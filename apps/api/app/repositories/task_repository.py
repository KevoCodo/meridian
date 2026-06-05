from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import TaskPriority, TaskStatus


class TaskRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list(
        self,
        workspace_id: UUID | None = None,
        project_id: UUID | None = None,
        status: TaskStatus | None = None,
        priority: TaskPriority | None = None,
    ) -> list[Task]:
        statement = select(Task)

        if workspace_id is not None:
            statement = statement.where(Task.workspace_id == workspace_id)
        if project_id is not None:
            statement = statement.where(Task.project_id == project_id)
        if status is not None:
            statement = statement.where(Task.status == status.value)
        if priority is not None:
            statement = statement.where(Task.priority == priority.value)

        statement = statement.order_by(Task.created_at.desc())
        return list(self.db.scalars(statement).all())

    def get(self, task_id: UUID) -> Task | None:
        return self.db.get(Task, task_id)

    def create(self, data: dict) -> Task:
        task = Task(**data)
        self.db.add(task)
        self.db.flush()
        return task

    def update(self, task: Task, data: dict) -> Task:
        for field, value in data.items():
            setattr(task, field, value)
        self.db.flush()
        return task
