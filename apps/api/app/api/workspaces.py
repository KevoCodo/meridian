from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_workspace_id, require_workspace_access
from app.core.errors import ResourceNotFoundError
from app.database.session import get_db
from app.schemas.workspace import WorkspaceRead
from app.schemas.workspace_membership import WorkspaceMemberRead
from app.services.workspace_membership_service import WorkspaceMembershipService
from app.services.workspace_service import WorkspaceService


router = APIRouter(prefix="/workspaces", tags=["workspaces"])


@router.get("", response_model=list[WorkspaceRead])
def list_workspaces(
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> list[WorkspaceRead]:
    return WorkspaceService(db).list_workspaces(workspace_id)


@router.get("/current/members", response_model=list[WorkspaceMemberRead])
def list_current_workspace_members(
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> list[WorkspaceMemberRead]:
    return WorkspaceMembershipService(db).list_members(workspace_id)


@router.get("/{workspace_id}", response_model=WorkspaceRead)
def get_workspace(
    workspace_id: UUID,
    current_workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> WorkspaceRead:
    try:
        require_workspace_access(current_workspace_id, workspace_id)
        return WorkspaceService(db).get_workspace(workspace_id)
    except ResourceNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
