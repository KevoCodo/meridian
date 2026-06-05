from datetime import datetime
from uuid import UUID

from sqlalchemy import Select, func, select
from sqlalchemy.orm import Session

from app.models.activity import Activity
from app.models.client import Client
from app.models.note import Note
from app.models.project import Project
from app.models.task import Task


class DashboardRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def active_clients(self, workspace_id: UUID | None = None) -> int:
        statement = select(func.count(Client.id)).where(Client.status == "active")
        return self._count(self._scope(statement, Client, workspace_id))

    def active_projects(self, workspace_id: UUID | None = None) -> int:
        statement = select(func.count(Project.id)).where(Project.status == "active")
        return self._count(self._scope(statement, Project, workspace_id))

    def open_tasks(self, workspace_id: UUID | None = None) -> int:
        statement = select(func.count(Task.id)).where(
            Task.status.in_(("todo", "in_progress", "blocked"))
        )
        return self._count(self._scope(statement, Task, workspace_id))

    def completed_tasks(self, workspace_id: UUID | None = None) -> int:
        statement = select(func.count(Task.id)).where(Task.status == "completed")
        return self._count(self._scope(statement, Task, workspace_id))

    def recent_notes(self, since: datetime, workspace_id: UUID | None = None) -> int:
        statement = select(func.count(Note.id)).where(Note.created_at >= since)
        return self._count(self._scope(statement, Note, workspace_id))

    def recent_activity(self, since: datetime, workspace_id: UUID | None = None) -> int:
        statement = select(func.count(Activity.id)).where(Activity.created_at >= since)
        return self._count(self._scope(statement, Activity, workspace_id))

    def _count(self, statement: Select) -> int:
        return int(self.db.scalar(statement) or 0)

    def _scope(self, statement: Select, model: type, workspace_id: UUID | None) -> Select:
        if workspace_id is not None:
            return statement.where(model.workspace_id == workspace_id)
        return statement
