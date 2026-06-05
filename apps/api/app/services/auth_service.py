from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.repositories.workspace_membership_repository import WorkspaceMembershipRepository
from app.repositories.workspace_repository import WorkspaceRepository
from app.schemas.auth import UserRegister


class EmailAlreadyRegisteredError(Exception):
    pass


class InvalidCredentialsError(Exception):
    pass


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = UserRepository(db)
        self.memberships = WorkspaceMembershipRepository(db)
        self.workspaces = WorkspaceRepository(db)

    def register(self, payload: UserRegister) -> User:
        if self.repository.get_by_email(str(payload.email)) is not None:
            raise EmailAlreadyRegisteredError

        user = self.repository.create(
            email=str(payload.email),
            name=payload.name.strip(),
            password_hash=hash_password(payload.password),
        )
        workspace = self.workspaces.create(
            name=f"{user.name}'s Workspace",
            slug=f"user-{user.id}",
        )
        self.memberships.create(workspace.id, user.id, "owner")
        self.db.commit()
        self.db.refresh(user)
        return user

    def authenticate(self, email: str, password: str) -> User:
        user = self.repository.get_by_email(email)
        if user is None or not verify_password(password, user.password_hash):
            raise InvalidCredentialsError
        return user
