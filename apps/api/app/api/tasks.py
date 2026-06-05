from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_workspace_id, require_workspace_access
from app.core.errors import ResourceNotFoundError
from app.database.session import get_db
from app.schemas.task import TaskCreate, TaskPriority, TaskRead, TaskStatus, TaskUpdate
from app.services.task_service import TaskService


router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskRead])
def list_tasks(
    requested_workspace_id: UUID | None = Query(default=None, alias="workspaceId"),
    project_id: UUID | None = Query(default=None, alias="projectId"),
    task_status: TaskStatus | None = Query(default=None, alias="status"),
    task_priority: TaskPriority | None = Query(default=None, alias="priority"),
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> list[TaskRead]:
    if requested_workspace_id is not None:
        require_workspace_access(workspace_id, requested_workspace_id)
    return TaskService(db).list_tasks(
        workspace_id=workspace_id,
        project_id=project_id,
        status=task_status,
        priority=task_priority,
    )


@router.get("/{task_id}", response_model=TaskRead)
def get_task(task_id: UUID, workspace_id: UUID = Depends(get_current_workspace_id), db: Session = Depends(get_db)) -> TaskRead:
    try:
        task = TaskService(db).get_task(task_id)
        require_workspace_access(workspace_id, task.workspace_id)
        return task
    except ResourceNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, workspace_id: UUID = Depends(get_current_workspace_id), db: Session = Depends(get_db)) -> TaskRead:
    try:
        require_workspace_access(workspace_id, payload.workspace_id)
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
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> TaskRead:
    try:
        task = TaskService(db).get_task(task_id)
        require_workspace_access(workspace_id, task.workspace_id)
        if payload.workspace_id is not None:
            require_workspace_access(workspace_id, payload.workspace_id)
        return TaskService(db).update_task(task_id, payload)
    except ResourceNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
