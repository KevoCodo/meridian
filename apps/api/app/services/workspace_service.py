from uuid import UUID

from sqlalchemy.orm import Session

from app.core.errors import ResourceNotFoundError
from app.models.workspace import Workspace
from app.repositories.workspace_repository import WorkspaceRepository


class WorkspaceService:
    def __init__(self, db: Session) -> None:
        self.repository = WorkspaceRepository(db)

    def list_workspaces(self) -> list[Workspace]:
        return self.repository.list()

    def get_workspace(self, workspace_id: UUID) -> Workspace:
        workspace = self.repository.get(workspace_id)
        if workspace is None:
            raise ResourceNotFoundError("workspace", workspace_id)
        return workspace
