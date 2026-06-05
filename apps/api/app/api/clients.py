from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_workspace_id, require_workspace_access
from app.core.errors import ResourceNotFoundError
from app.database.session import get_db
from app.schemas.client import ClientCreate, ClientRead, ClientUpdate
from app.services.client_service import ClientService


router = APIRouter(prefix="/clients", tags=["clients"])


@router.get("", response_model=list[ClientRead])
def list_clients(
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> list[ClientRead]:
    return ClientService(db).list_clients(workspace_id)


@router.get("/{client_id}", response_model=ClientRead)
def get_client(
    client_id: UUID,
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> ClientRead:
    try:
        client = ClientService(db).get_client(client_id)
        require_workspace_access(workspace_id, client.workspace_id)
        return client
    except ResourceNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.post("", response_model=ClientRead, status_code=status.HTTP_201_CREATED)
def create_client(
    payload: ClientCreate,
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> ClientRead:
    try:
        require_workspace_access(workspace_id, payload.workspace_id)
        return ClientService(db).create_client(payload)
    except ResourceNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.patch("/{client_id}", response_model=ClientRead)
def update_client(
    client_id: UUID,
    payload: ClientUpdate,
    workspace_id: UUID = Depends(get_current_workspace_id),
    db: Session = Depends(get_db),
) -> ClientRead:
    try:
        client = ClientService(db).get_client(client_id)
        require_workspace_access(workspace_id, client.workspace_id)
        if payload.workspace_id is not None:
            require_workspace_access(workspace_id, payload.workspace_id)
        return ClientService(db).update_client(client_id, payload)
    except ResourceNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
