"""simple automation execution

Revision ID: 20260605_0007
Revises: 20260605_0006
Create Date: 2026-06-05
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260605_0007"
down_revision = "20260605_0006"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "automation_executions",
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("automation_rule_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("trigger_type", sa.String(length=120), nullable=False),
        sa.Column("trigger_entity_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("action_type", sa.String(length=120), nullable=False),
        sa.Column("result_entity_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(
            ["automation_rule_id"],
            ["automation_rules.id"],
            name=op.f("fk_automation_executions_automation_rule_id_automation_rules"),
        ),
        sa.ForeignKeyConstraint(
            ["workspace_id"],
            ["workspaces.id"],
            name=op.f("fk_automation_executions_workspace_id_workspaces"),
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_automation_executions")),
        sa.UniqueConstraint(
            "automation_rule_id",
            "trigger_entity_id",
            name="uq_automation_executions_rule_trigger_entity",
        ),
    )
    op.create_index(op.f("ix_automation_executions_automation_rule_id"), "automation_executions", ["automation_rule_id"])
    op.create_index(op.f("ix_automation_executions_result_entity_id"), "automation_executions", ["result_entity_id"])
    op.create_index(op.f("ix_automation_executions_trigger_entity_id"), "automation_executions", ["trigger_entity_id"])
    op.create_index(op.f("ix_automation_executions_workspace_id"), "automation_executions", ["workspace_id"])


def downgrade() -> None:
    op.drop_index(op.f("ix_automation_executions_workspace_id"), table_name="automation_executions")
    op.drop_index(op.f("ix_automation_executions_trigger_entity_id"), table_name="automation_executions")
    op.drop_index(op.f("ix_automation_executions_result_entity_id"), table_name="automation_executions")
    op.drop_index(op.f("ix_automation_executions_automation_rule_id"), table_name="automation_executions")
    op.drop_table("automation_executions")
