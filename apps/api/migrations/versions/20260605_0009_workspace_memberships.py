"""workspace memberships and user assignment

Revision ID: 20260605_0009
Revises: 20260605_0008
Create Date: 2026-06-05
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from uuid import uuid4


revision = "20260605_0009"
down_revision = "20260605_0008"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "workspace_memberships",
        sa.Column("workspace_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("role", sa.String(length=40), nullable=False),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("role in ('owner', 'member')", name=op.f("ck_workspace_memberships_membership_role_valid")),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name=op.f("fk_workspace_memberships_user_id_users")),
        sa.ForeignKeyConstraint(["workspace_id"], ["workspaces.id"], name=op.f("fk_workspace_memberships_workspace_id_workspaces")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_workspace_memberships")),
        sa.UniqueConstraint("workspace_id", "user_id", name="uq_workspace_memberships_workspace_user"),
    )
    op.create_index(op.f("ix_workspace_memberships_user_id"), "workspace_memberships", ["user_id"])
    op.create_index(op.f("ix_workspace_memberships_workspace_id"), "workspace_memberships", ["workspace_id"])
    connection = op.get_bind()
    workspace_id = connection.scalar(
        sa.text("select id from workspaces order by created_at asc limit 1")
    )
    user_ids = connection.scalars(sa.text("select id from users")).all()
    if workspace_id is not None:
        membership_table = sa.table(
            "workspace_memberships",
            sa.column("id", postgresql.UUID(as_uuid=True)),
            sa.column("workspace_id", postgresql.UUID(as_uuid=True)),
            sa.column("user_id", postgresql.UUID(as_uuid=True)),
            sa.column("role", sa.String()),
        )
        op.bulk_insert(
            membership_table,
            [
                {
                    "id": uuid4(),
                    "workspace_id": workspace_id,
                    "user_id": user_id,
                    "role": "owner",
                }
                for user_id in user_ids
            ],
        )
    op.add_column("tasks", sa.Column("assigned_user_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_foreign_key(op.f("fk_tasks_assigned_user_id_users"), "tasks", "users", ["assigned_user_id"], ["id"])
    op.create_index(op.f("ix_tasks_assigned_user_id"), "tasks", ["assigned_user_id"])
    op.drop_column("tasks", "assigned_to")


def downgrade() -> None:
    op.add_column("tasks", sa.Column("assigned_to", sa.String(length=255), nullable=True))
    op.drop_index(op.f("ix_tasks_assigned_user_id"), table_name="tasks")
    op.drop_constraint(op.f("fk_tasks_assigned_user_id_users"), "tasks", type_="foreignkey")
    op.drop_column("tasks", "assigned_user_id")
    op.drop_index(op.f("ix_workspace_memberships_workspace_id"), table_name="workspace_memberships")
    op.drop_index(op.f("ix_workspace_memberships_user_id"), table_name="workspace_memberships")
    op.drop_table("workspace_memberships")
