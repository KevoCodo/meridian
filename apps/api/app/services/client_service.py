from uuid import UUID

from sqlalchemy.orm import Session

from app.core.errors import ResourceNotFoundError
from app.models.client import Client
from app.repositories.client_repository import ClientRepository
from app.repositories.workspace_repository import WorkspaceRepository
from app.schemas.activity import ActivityAction, ActivityEntityType
from app.schemas.client import ClientCreate, ClientUpdate
from app.services.activity_service import ActivityService


class ClientService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.activities = ActivityService(db)
        self.clients = ClientRepository(db)
        self.workspaces = WorkspaceRepository(db)

    def list_clients(self) -> list[Client]:
        return self.clients.list()

    def get_client(self, client_id: UUID) -> Client:
        client = self.clients.get(client_id)
        if client is None:
            raise ResourceNotFoundError("client", client_id)
        return client

    def create_client(self, payload: ClientCreate) -> Client:
        workspace = self.workspaces.get(payload.workspace_id)
        if workspace is None:
            raise ResourceNotFoundError("workspace", payload.workspace_id)

        client = self.clients.create(self._to_persistence_data(payload))
        self.activities.record(
            workspace_id=client.workspace_id,
            entity_type=ActivityEntityType.CLIENT,
            entity_id=client.id,
            action=ActivityAction.CREATED,
            message=f"Client created: {client.name}",
        )
        self.db.commit()
        self.db.refresh(client)
        return client

    def update_client(self, client_id: UUID, payload: ClientUpdate) -> Client:
        client = self.get_client(client_id)
        update_data = payload.model_dump(
            mode="python",
            by_alias=False,
            exclude_unset=True,
        )
        if update_data.get("company_website") is not None:
            update_data["company_website"] = str(update_data["company_website"])
        client = self.clients.update(client, update_data)
        self.db.commit()
        self.db.refresh(client)
        return client

    def _to_persistence_data(self, payload: ClientCreate) -> dict:
        data = payload.model_dump(mode="python", by_alias=False)
        if data.get("company_website") is not None:
            data["company_website"] = str(data["company_website"])
        return data
