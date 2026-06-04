from typing import Any
from uuid import UUID

from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, IdMixin, TimestampMixin


class AutomationRule(IdMixin, TimestampMixin, Base):
    __tablename__ = "automation_rules"

    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("workspaces.id"),
        index=True,
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    trigger_type: Mapped[str] = mapped_column(String(120), nullable=False)
    conditions_json: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict)
    actions_json: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict)
    is_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
