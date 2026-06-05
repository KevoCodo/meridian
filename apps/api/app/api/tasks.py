from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.errors import ResourceNotFoundError
from app.database.session import get_db
from app.schemas.task import TaskCreate, TaskPriority, TaskRead, TaskStatus, TaskUpdate
from app.services.task_service import TaskService


router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskRead])
def list_tasks(
    workspace_id: UUID | None = Query(default=None, alias="workspaceId"),
    project_id: UUID | None = Query(default=None, alias="projectId"),
    task_status: TaskStatus | None = Query(default=None, alias="status"),
    task_priority: TaskPriority | None = Query(default=None, alias="priority"),
    db: Session = Depends(get_db),
) -> list[TaskRead]:
    return TaskService(db).list_tasks(
        workspace_id=workspace_id,
        project_id=project_id,
        status=task_status,
        priority=task_priority,
    )


@router.get("/{task_id}", response_model=TaskRead)
def get_task(task_id: UUID, db: Session = Depends(get_db)) -> TaskRead:
    try:
        return TaskService(db).get_task(task_id)
    except ResourceNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)) -> TaskRead:
    try:
        return TaskService(db).create_task(payload)
    except ResourceNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.patch("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: UUID,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
) -> TaskRead:
    try:
        return TaskService(db).update_task(task_id, payload)
    except ResourceNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
