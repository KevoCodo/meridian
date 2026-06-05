from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.config import settings
from app.core.security import create_access_token
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import AuthResponse, UserLogin, UserRead, UserRegister
from app.services.auth_service import (
    AuthService,
    EmailAlreadyRegisteredError,
    InvalidCredentialsError,
)


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(
    payload: UserRegister,
    response: Response,
    db: Session = Depends(get_db),
) -> AuthResponse:
    try:
        user = AuthService(db).register(payload)
    except EmailAlreadyRegisteredError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        ) from error

    _set_auth_cookie(response, user)
    return AuthResponse(user=UserRead.model_validate(user))


@router.post("/login", response_model=AuthResponse)
def login(
    payload: UserLogin,
    response: Response,
    db: Session = Depends(get_db),
) -> AuthResponse:
    try:
        user = AuthService(db).authenticate(str(payload.email), payload.password)
    except InvalidCredentialsError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        ) from error

    _set_auth_cookie(response, user)
    return AuthResponse(user=UserRead.model_validate(user))


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response) -> None:
    response.delete_cookie(
        key=settings.AUTH_COOKIE_NAME,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite="lax",
    )


@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)) -> UserRead:
    return UserRead.model_validate(current_user)


def _set_auth_cookie(response: Response, user: User) -> None:
    response.set_cookie(
        key=settings.AUTH_COOKIE_NAME,
        value=create_access_token(user.id),
        max_age=settings.AUTH_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite="lax",
    )
