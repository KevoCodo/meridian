from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.note import Note


class NoteRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list(
        self,
        workspace_id: UUID | None = None,
        client_id: UUID | None = None,
        project_id: UUID | None = None,
        task_id: UUID | None = None,
    ) -> list[Note]:
        statement = select(Note)

        if workspace_id is not None:
            statement = statement.where(Note.workspace_id == workspace_id)
        if client_id is not None:
            statement = statement.where(Note.client_id == client_id)
        if project_id is not None:
            statement = statement.where(Note.project_id == project_id)
        if task_id is not None:
            statement = statement.where(Note.task_id == task_id)

        statement = statement.order_by(Note.updated_at.desc())
        return list(self.db.scalars(statement).all())

    def get(self, note_id: UUID) -> Note | None:
        return self.db.get(Note, note_id)

    def create(self, data: dict) -> Note:
        note = Note(**data)
        self.db.add(note)
        self.db.flush()
        return note

    def update(self, note: Note, data: dict) -> Note:
        for field, value in data.items():
            setattr(note, field, value)
        self.db.flush()
        return note
