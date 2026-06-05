from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get(self, user_id: UUID) -> User | None:
        return self.db.get(User, user_id)

    def get_by_email(self, email: str) -> User | None:
        statement = select(User).where(func.lower(User.email) == email.lower())
        return self.db.scalar(statement)

    def create(self, email: str, name: str, password_hash: str) -> User:
        user = User(email=email.lower(), name=name, password_hash=password_hash)
        self.db.add(user)
        self.db.flush()
        return user
