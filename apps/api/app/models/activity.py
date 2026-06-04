from typing import Any
from uuid import UUID

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, IdMixin, TimestampMixin


class Activity(IdMixin, TimestampMixin, Base):
    __tablename__ = "activities"

    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("workspaces.id"),
        index=True,
        nullable=False,
    )
    actor_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    event_type: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    subject_type: Mapped[str] = mapped_column(String(120), nullable=False)
    subject_id: Mapped[UUID | None] = mapped_column(PG_UUID(as_uuid=True), nullable=True)
    metadata_json: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict)
