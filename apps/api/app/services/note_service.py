from uuid import UUID

from sqlalchemy.orm import Session

from app.core.errors import ResourceNotFoundError
from app.models.note import Note
from app.repositories.client_repository import ClientRepository
from app.repositories.note_repository import NoteRepository
from app.repositories.project_repository import ProjectRepository
from app.repositories.task_repository import TaskRepository
from app.repositories.workspace_repository import WorkspaceRepository
from app.schemas.activity import ActivityAction, ActivityEntityType
from app.schemas.note import NoteCreate, NoteUpdate
from app.services.activity_service import ActivityService


class NoteService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.activities = ActivityService(db)
        self.clients = ClientRepository(db)
        self.notes = NoteRepository(db)
        self.projects = ProjectRepository(db)
        self.tasks = TaskRepository(db)
        self.workspaces = WorkspaceRepository(db)

    def list_notes(
        self,
        workspace_id: UUID | None = None,
        client_id: UUID | None = None,
        project_id: UUID | None = None,
        task_id: UUID | None = None,
    ) -> list[Note]:
        return self.notes.list(
            workspace_id=workspace_id,
            client_id=client_id,
            project_id=project_id,
            task_id=task_id,
        )

    def get_note(self, note_id: UUID) -> Note:
        note = self.notes.get(note_id)
        if note is None:
            raise ResourceNotFoundError("note", note_id)
        return note

    def create_note(self, payload: NoteCreate) -> Note:
        self._validate_relationships(
            payload.workspace_id,
            payload.client_id,
            payload.project_id,
            payload.task_id,
        )
        note = self.notes.create(payload.model_dump(mode="python", by_alias=False))
        entity_type, entity_id, context = self._activity_target(note)
        self.activities.record(
            workspace_id=note.workspace_id,
            entity_type=entity_type,
            entity_id=entity_id,
            action=ActivityAction.NOTE_ADDED,
            message=f"Note added to {context}: {note.title}",
            metadata={"noteId": str(note.id)},
        )
        self.db.commit()
        self.db.refresh(note)
        return note

    def update_note(self, note_id: UUID, payload: NoteUpdate) -> Note:
        note = self.get_note(note_id)
        update_data = payload.model_dump(
            mode="python",
            by_alias=False,
            exclude_unset=True,
        )
        self._validate_relationships(
            update_data.get("workspace_id", note.workspace_id),
            update_data.get("client_id", note.client_id),
            update_data.get("project_id", note.project_id),
            update_data.get("task_id", note.task_id),
        )
        note = self.notes.update(note, update_data)
        self.db.commit()
        self.db.refresh(note)
        return note

    def _validate_relationships(
        self,
        workspace_id: UUID,
        client_id: UUID | None,
        project_id: UUID | None,
        task_id: UUID | None,
    ) -> None:
        if self.workspaces.get(workspace_id) is None:
            raise ResourceNotFoundError("workspace", workspace_id)

        if client_id is not None:
            client = self.clients.get(client_id)
            if client is None or client.workspace_id != workspace_id:
                raise ResourceNotFoundError("client", client_id)

        if project_id is not None:
            project = self.projects.get(project_id)
            if project is None or project.workspace_id != workspace_id:
                raise ResourceNotFoundError("project", project_id)

        if task_id is not None:
            task = self.tasks.get(task_id)
            if task is None or task.workspace_id != workspace_id:
                raise ResourceNotFoundError("task", task_id)

    def _activity_target(
        self,
        note: Note,
    ) -> tuple[ActivityEntityType, UUID, str]:
        if note.task_id is not None:
            return ActivityEntityType.TASK, note.task_id, "task"
        if note.project_id is not None:
            return ActivityEntityType.PROJECT, note.project_id, "project"
        if note.client_id is not None:
            return ActivityEntityType.CLIENT, note.client_id, "client"
        return ActivityEntityType.WORKSPACE, note.workspace_id, "workspace"
