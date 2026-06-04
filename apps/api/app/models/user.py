from uuid import UUID

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

from app.database.base import Base, IdMixin, TimestampMixin


class User(IdMixin, TimestampMixin, Base):
    __tablename__ = "users"

    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("workspaces.id"),
        index=True,
        nullable=False,
    )
    email: Mapped[str] = mapped_column(String(320), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
