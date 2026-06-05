"""notes foundation

Revision ID: 20260605_0004
Revises: 20260605_0003
Create Date: 2026-06-05
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260605_0004"
down_revision = "20260605_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "notes",
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("client_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("project_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("task_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["client_id"], ["clients.id"], name=op.f("fk_notes_client_id_clients")),
        sa.ForeignKeyConstraint(["project_id"], ["projects.id"], name=op.f("fk_notes_project_id_projects")),
        sa.ForeignKeyConstraint(["task_id"], ["tasks.id"], name=op.f("fk_notes_task_id_tasks")),
        sa.ForeignKeyConstraint(["workspace_id"], ["workspaces.id"], name=op.f("fk_notes_workspace_id_workspaces")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_notes")),
    )
    op.create_index(op.f("ix_notes_client_id"), "notes", ["client_id"])
    op.create_index(op.f("ix_notes_project_id"), "notes", ["project_id"])
    op.create_index(op.f("ix_notes_task_id"), "notes", ["task_id"])
    op.create_index(op.f("ix_notes_workspace_id"), "notes", ["workspace_id"])


def downgrade() -> None:
    op.drop_index(op.f("ix_notes_workspace_id"), table_name="notes")
    op.drop_index(op.f("ix_notes_task_id"), table_name="notes")
    op.drop_index(op.f("ix_notes_project_id"), table_name="notes")
    op.drop_index(op.f("ix_notes_client_id"), table_name="notes")
    op.drop_table("notes")
