from uuid import UUID

from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import decode_access_token
from app.database.session import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.repositories.workspace_membership_repository import WorkspaceMembershipRepository


def get_current_user(
    session_token: str | None = Cookie(default=None, alias=settings.AUTH_COOKIE_NAME),
    db: Session = Depends(get_db),
) -> User:
    user_id = decode_access_token(session_token) if session_token else None
    user = UserRepository(db).get(user_id) if user_id else None
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    return user


def get_current_workspace_id(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UUID:
    membership = WorkspaceMembershipRepository(db).get_first_for_user(current_user.id)
    if membership is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User does not belong to a workspace",
        )
    return membership.workspace_id


def require_workspace_access(
    current_workspace_id: UUID,
    requested_workspace_id: UUID,
) -> None:
    if current_workspace_id != requested_workspace_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"workspace not found: {requested_workspace_id}",
        )
