from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_workspace_id, require_workspace_access
from app.core.errors import ResourceNotFoundError
from app.database.session import get_db
from app.schemas.project import ProjectCreate, ProjectRead, ProjectStatus, ProjectUpdate
from app.services.project_service import ProjectService


router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[ProjectRead])
def list_projects(
    requested_workspace_id: UUID | None = Query(default=None, alias="workspaceId"),
    client_id: UUID | None = Query(default=None, alias="clientId"),
    project_status: ProjectStatus | None = Query(default=None, alias="status"),
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> list[ProjectRead]:
    if requested_workspace_id is not None:
        require_workspace_access(workspace_id, requested_workspace_id)
    return ProjectService(db).list_projects(
        workspace_id=workspace_id,
        client_id=client_id,
        status=project_status,
    )


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(
    project_id: UUID,
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> ProjectRead:
    try:
        project = ProjectService(db).get_project(project_id)
        require_workspace_access(workspace_id, project.workspace_id)
        return project
    except ResourceNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> ProjectRead:
    try:
        require_workspace_access(workspace_id, payload.workspace_id)
        return ProjectService(db).create_project(payload)
    except ResourceNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.patch("/{project_id}", response_model=ProjectRead)
def update_project(
    project_id: UUID,
    payload: ProjectUpdate,
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> ProjectRead:
    try:
        project = ProjectService(db).get_project(project_id)
        require_workspace_access(workspace_id, project.workspace_id)
        if payload.workspace_id is not None:
            require_workspace_access(workspace_id, payload.workspace_id)
        return ProjectService(db).update_project(project_id, payload)
    except ResourceNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
