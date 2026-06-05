from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_workspace_id, require_workspace_access
from app.core.errors import ResourceNotFoundError
from app.database.session import get_db
from app.schemas.note import NoteCreate, NoteRead, NoteUpdate
from app.services.note_service import NoteService


router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("", response_model=list[NoteRead])
def list_notes(
    requested_workspace_id: UUID | None = Query(default=None, alias="workspaceId"),
    client_id: UUID | None = Query(default=None, alias="clientId"),
    project_id: UUID | None = Query(default=None, alias="projectId"),
    task_id: UUID | None = Query(default=None, alias="taskId"),
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> list[NoteRead]:
    if requested_workspace_id is not None:
        require_workspace_access(workspace_id, requested_workspace_id)
    return NoteService(db).list_notes(
        workspace_id=workspace_id,
        client_id=client_id,
        project_id=project_id,
        task_id=task_id,
    )


@router.get("/{note_id}", response_model=NoteRead)
def get_note(note_id: UUID, workspace_id: UUID = Depends(get_current_workspace_id), db: Session = Depends(get_db)) -> NoteRead:
    try:
        note = NoteService(db).get_note(note_id)
        require_workspace_access(workspace_id, note.workspace_id)
        return note
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error


@router.post("", response_model=NoteRead, status_code=status.HTTP_201_CREATED)
def create_note(payload: NoteCreate, workspace_id: UUID = Depends(get_current_workspace_id), db: Session = Depends(get_db)) -> NoteRead:
    try:
        require_workspace_access(workspace_id, payload.workspace_id)
        return NoteService(db).create_note(payload)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error


@router.patch("/{note_id}", response_model=NoteRead)
def update_note(
    note_id: UUID,
    payload: NoteUpdate,
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> NoteRead:
    try:
        note = NoteService(db).get_note(note_id)
        require_workspace_access(workspace_id, note.workspace_id)
        if payload.workspace_id is not None:
            require_workspace_access(workspace_id, payload.workspace_id)
        return NoteService(db).update_note(note_id, payload)
    except ResourceNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error
