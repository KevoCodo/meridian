from typing import TYPE_CHECKING
from uuid import UUID

from datetime import date

from sqlalchemy import CheckConstraint, Date, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

from app.database.base import Base, IdMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User


class Task(IdMixin, TimestampMixin, Base):
    __tablename__ = "tasks"
    __table_args__ = (
        CheckConstraint(
            "status in ('todo', 'in_progress', 'blocked', 'completed', 'archived')",
            name="task_status_valid",
        ),
        CheckConstraint(
            "priority in ('low', 'medium', 'high', 'urgent')",
            name="task_priority_valid",
        ),
    )

    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("workspaces.id"),
        index=True,
        nullable=False,
    )
    project_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("projects.id"),
        index=True,
        nullable=False,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(80), nullable=False, default="todo")
    priority: Mapped[str] = mapped_column(String(80), nullable=False, default="medium")
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    assigned_user_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id"),
        index=True,
        nullable=True,
    )
    assigned_user: Mapped["User | None"] = relationship()
