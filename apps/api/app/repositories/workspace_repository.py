from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.workspace import Workspace


class WorkspaceRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list(self) -> list[Workspace]:
        statement = select(Workspace).order_by(Workspace.created_at.asc())
        return list(self.db.scalars(statement).all())

    def get(self, workspace_id: UUID) -> Workspace | None:
        return self.db.get(Workspace, workspace_id)

    def get_by_slug(self, slug: str) -> Workspace | None:
        statement = select(Workspace).where(Workspace.slug == slug)
        return self.db.scalar(statement)

    def create(self, name: str, slug: str) -> Workspace:
        workspace = Workspace(name=name, slug=slug)
        self.db.add(workspace)
        self.db.flush()
        return workspace
