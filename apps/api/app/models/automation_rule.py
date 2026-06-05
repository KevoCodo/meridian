from uuid import UUID

from sqlalchemy import Boolean, CheckConstraint, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, IdMixin, TimestampMixin


class AutomationRule(IdMixin, TimestampMixin, Base):
    __tablename__ = "automation_rules"
    __table_args__ = (
        CheckConstraint(
            "trigger_type in ('task_completed', 'project_created', 'client_created')",
            name="automation_rule_trigger_type_valid",
        ),
        CheckConstraint(
            "action_type in ('create_follow_up_task', 'add_activity_log', 'create_note_stub')",
            name="automation_rule_action_type_valid",
        ),
    )

    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("workspaces.id"),
        index=True,
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    trigger_type: Mapped[str] = mapped_column(String(120), nullable=False)
    action_type: Mapped[str] = mapped_column(String(120), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
