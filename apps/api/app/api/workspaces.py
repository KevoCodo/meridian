from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.errors import ResourceNotFoundError
from app.database.session import get_db
from app.schemas.workspace import WorkspaceRead
from app.services.workspace_service import WorkspaceService


router = APIRouter(prefix="/workspaces", tags=["workspaces"])


@router.get("", response_model=list[WorkspaceRead])
def list_workspaces(db: Session = Depends(get_db)) -> list[WorkspaceRead]:
    return WorkspaceService(db).list_workspaces()


@router.get("/{workspace_id}", response_model=WorkspaceRead)
def get_workspace(
    workspace_id: UUID,
    db: Session = Depends(get_db),
) -> WorkspaceRead:
    try:
        return WorkspaceService(db).get_workspace(workspace_id)
    except ResourceNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
