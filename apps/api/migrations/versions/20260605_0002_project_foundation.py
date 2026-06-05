"""project foundation

Revision ID: 20260605_0002
Revises: 20260604_0001
Create Date: 2026-06-05
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260605_0002"
down_revision = "20260604_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "projects",
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("client_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=80), nullable=False),
        sa.Column("priority", sa.String(length=80), nullable=False),
        sa.Column("start_date", sa.Date(), nullable=True),
        sa.Column("due_date", sa.Date(), nullable=True),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "priority in ('low', 'medium', 'high')",
            name=op.f("ck_projects_project_priority_valid"),
        ),
        sa.CheckConstraint(
            "status in ('planning', 'active', 'paused', 'completed', 'archived')",
            name=op.f("ck_projects_project_status_valid"),
        ),
        sa.ForeignKeyConstraint(
            ["client_id"],
            ["clients.id"],
            name=op.f("fk_projects_client_id_clients"),
        ),
        sa.ForeignKeyConstraint(
            ["workspace_id"],
            ["workspaces.id"],
            name=op.f("fk_projects_workspace_id_workspaces"),
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_projects")),
    )
    op.create_index(op.f("ix_projects_client_id"), "projects", ["client_id"])
    op.create_index(op.f("ix_projects_workspace_id"), "projects", ["workspace_id"])


def downgrade() -> None:
    op.drop_index(op.f("ix_projects_workspace_id"), table_name="projects")
    op.drop_index(op.f("ix_projects_client_id"), table_name="projects")
    op.drop_table("projects")
