from uuid import UUID

from sqlalchemy.orm import Session

from app.core.errors import ResourceNotFoundError
from app.models.project import Project
from app.repositories.client_repository import ClientRepository
from app.repositories.project_repository import ProjectRepository
from app.repositories.workspace_repository import WorkspaceRepository
from app.schemas.project import ProjectCreate, ProjectStatus, ProjectUpdate


class ProjectService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.clients = ClientRepository(db)
        self.projects = ProjectRepository(db)
        self.workspaces = WorkspaceRepository(db)

    def list_projects(
        self,
        workspace_id: UUID | None = None,
        client_id: UUID | None = None,
        status: ProjectStatus | None = None,
    ) -> list[Project]:
        return self.projects.list(
            workspace_id=workspace_id,
            client_id=client_id,
            status=status,
        )

    def get_project(self, project_id: UUID) -> Project:
        project = self.projects.get(project_id)
        if project is None:
            raise ResourceNotFoundError("project", project_id)
        return project

    def create_project(self, payload: ProjectCreate) -> Project:
        self._validate_workspace_client(payload.workspace_id, payload.client_id)
        project = self.projects.create(payload.model_dump(mode="python", by_alias=False))
        self.db.commit()
        self.db.refresh(project)
        return project

    def update_project(self, project_id: UUID, payload: ProjectUpdate) -> Project:
        project = self.get_project(project_id)
        update_data = payload.model_dump(
            mode="python",
            by_alias=False,
            exclude_unset=True,
        )

        workspace_id = update_data.get("workspace_id", project.workspace_id)
        client_id = update_data.get("client_id", project.client_id)
        self._validate_workspace_client(workspace_id, client_id)

        project = self.projects.update(project, update_data)
        self.db.commit()
        self.db.refresh(project)
        return project

    def _validate_workspace_client(self, workspace_id: UUID, client_id: UUID) -> None:
        workspace = self.workspaces.get(workspace_id)
        if workspace is None:
            raise ResourceNotFoundError("workspace", workspace_id)

        client = self.clients.get(client_id)
        if client is None:
            raise ResourceNotFoundError("client", client_id)

        if client.workspace_id != workspace_id:
            raise ResourceNotFoundError("client", client_id)
