"""activity timeline foundation

Revision ID: 20260605_0005
Revises: 20260605_0004
Create Date: 2026-06-05
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260605_0005"
down_revision = "20260605_0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "activities",
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("entity_type", sa.String(length=80), nullable=False),
        sa.Column("entity_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("action", sa.String(length=80), nullable=False),
        sa.Column("message", sa.String(length=500), nullable=False),
        sa.Column("metadata", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "action in ('created', 'updated', 'completed', 'archived', 'note_added')",
            name=op.f("ck_activities_activity_action_valid"),
        ),
        sa.CheckConstraint(
            "entity_type in ('client', 'project', 'task', 'note', 'workspace')",
            name=op.f("ck_activities_activity_entity_type_valid"),
        ),
        sa.ForeignKeyConstraint(
            ["workspace_id"],
            ["workspaces.id"],
            name=op.f("fk_activities_workspace_id_workspaces"),
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_activities")),
    )
    op.create_index(op.f("ix_activities_action"), "activities", ["action"])
    op.create_index(op.f("ix_activities_entity_id"), "activities", ["entity_id"])
    op.create_index(op.f("ix_activities_entity_type"), "activities", ["entity_type"])
    op.create_index(op.f("ix_activities_workspace_id"), "activities", ["workspace_id"])


def downgrade() -> None:
    op.drop_index(op.f("ix_activities_workspace_id"), table_name="activities")
    op.drop_index(op.f("ix_activities_entity_type"), table_name="activities")
    op.drop_index(op.f("ix_activities_entity_id"), table_name="activities")
    op.drop_index(op.f("ix_activities_action"), table_name="activities")
    op.drop_table("activities")
