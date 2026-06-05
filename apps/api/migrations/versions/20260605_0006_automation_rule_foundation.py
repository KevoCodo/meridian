"""automation rule foundation

Revision ID: 20260605_0006
Revises: 20260605_0005
Create Date: 2026-06-05
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260605_0006"
down_revision = "20260605_0005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "automation_rules",
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("trigger_type", sa.String(length=120), nullable=False),
        sa.Column("action_type", sa.String(length=120), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint(
            "action_type in ('create_follow_up_task', 'add_activity_log', 'create_note_stub')",
            name=op.f("ck_automation_rules_automation_rule_action_type_valid"),
        ),
        sa.CheckConstraint(
            "trigger_type in ('task_completed', 'project_created', 'client_created')",
            name=op.f("ck_automation_rules_automation_rule_trigger_type_valid"),
        ),
        sa.ForeignKeyConstraint(
            ["workspace_id"],
            ["workspaces.id"],
            name=op.f("fk_automation_rules_workspace_id_workspaces"),
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_automation_rules")),
    )
    op.create_index(
        op.f("ix_automation_rules_workspace_id"),
        "automation_rules",
        ["workspace_id"],
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_automation_rules_workspace_id"), table_name="automation_rules")
    op.drop_table("automation_rules")
