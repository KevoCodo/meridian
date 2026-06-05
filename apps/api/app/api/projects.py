from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.errors import ResourceNotFoundError
from app.database.session import get_db
from app.schemas.project import ProjectCreate, ProjectRead, ProjectStatus, ProjectUpdate
from app.services.project_service import ProjectService


router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[ProjectRead])
def list_projects(
    workspace_id: UUID | None = Query(default=None, alias="workspaceId"),
    client_id: UUID | None = Query(default=None, alias="clientId"),
    project_status: ProjectStatus | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
) -> list[ProjectRead]:
    return ProjectService(db).list_projects(
        workspace_id=workspace_id,
        client_id=client_id,
        status=project_status,
    )


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(project_id: UUID, db: Session = Depends(get_db)) -> ProjectRead:
    try:
        return ProjectService(db).get_project(project_id)
    except ResourceNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
) -> ProjectRead:
    try:
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
    db: Session = Depends(get_db),
) -> ProjectRead:
    try:
        return ProjectService(db).update_project(project_id, payload)
    except ResourceNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
