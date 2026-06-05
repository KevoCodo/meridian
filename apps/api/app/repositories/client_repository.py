from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.client import Client


class ClientRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list(self, workspace_id: UUID) -> list[Client]:
        statement = (
            select(Client)
            .where(Client.workspace_id == workspace_id)
            .order_by(Client.created_at.desc())
        )
        return list(self.db.scalars(statement).all())

    def get(self, client_id: UUID) -> Client | None:
        return self.db.get(Client, client_id)

    def create(self, data: dict) -> Client:
        client = Client(**data)
        self.db.add(client)
        self.db.flush()
        return client

    def update(self, client: Client, data: dict) -> Client:
        for field, value in data.items():
            setattr(client, field, value)
        self.db.flush()
        return client
