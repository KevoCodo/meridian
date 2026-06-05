from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.project import Project
from app.schemas.project import ProjectStatus


class ProjectRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list(
        self,
        workspace_id: UUID | None = None,
        client_id: UUID | None = None,
        status: ProjectStatus | None = None,
    ) -> list[Project]:
        statement = select(Project)

        if workspace_id is not None:
            statement = statement.where(Project.workspace_id == workspace_id)
        if client_id is not None:
            statement = statement.where(Project.client_id == client_id)
        if status is not None:
            statement = statement.where(Project.status == status.value)

        statement = statement.order_by(Project.created_at.desc())
        return list(self.db.scalars(statement).all())

    def get(self, project_id: UUID) -> Project | None:
        return self.db.get(Project, project_id)

    def create(self, data: dict) -> Project:
        project = Project(**data)
        self.db.add(project)
        self.db.flush()
        return project

    def update(self, project: Project, data: dict) -> Project:
        for field, value in data.items():
            setattr(project, field, value)
        self.db.flush()
        return project
