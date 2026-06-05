from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, IdMixin


class AutomationExecution(IdMixin, Base):
    __tablename__ = "automation_executions"
    __table_args__ = (
        UniqueConstraint(
            "automation_rule_id",
            "trigger_entity_id",
            name="uq_automation_executions_rule_trigger_entity",
        ),
    )

    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("workspaces.id"),
        index=True,
        nullable=False,
    )
    automation_rule_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("automation_rules.id"),
        index=True,
        nullable=False,
    )
    trigger_type: Mapped[str] = mapped_column(String(120), nullable=False)
    trigger_entity_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        index=True,
        nullable=False,
    )
    action_type: Mapped[str] = mapped_column(String(120), nullable=False)
    result_entity_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        index=True,
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
