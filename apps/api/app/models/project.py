from uuid import UUID

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

from app.database.base import Base, IdMixin, TimestampMixin


class Project(IdMixin, TimestampMixin, Base):
    __tablename__ = "projects"

    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("workspaces.id"),
        index=True,
        nullable=False,
    )
    client_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("clients.id"),
        nullable=True,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(80), nullable=False, default="planned")
