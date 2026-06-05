from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.workspace_membership import WorkspaceMembership


class WorkspaceMembershipRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get(self, user_id: UUID, workspace_id: UUID) -> WorkspaceMembership | None:
        statement = select(WorkspaceMembership).where(
            WorkspaceMembership.user_id == user_id,
            WorkspaceMembership.workspace_id == workspace_id,
        )
        return self.db.scalar(statement)

    def get_first_for_user(self, user_id: UUID) -> WorkspaceMembership | None:
        statement = (
            select(WorkspaceMembership)
            .where(WorkspaceMembership.user_id == user_id)
            .order_by(WorkspaceMembership.created_at.asc())
        )
        return self.db.scalar(statement)

    def list_for_workspace(self, workspace_id: UUID) -> list[WorkspaceMembership]:
        statement = (
            select(WorkspaceMembership)
            .options(joinedload(WorkspaceMembership.user))
            .where(WorkspaceMembership.workspace_id == workspace_id)
            .order_by(WorkspaceMembership.created_at.asc())
        )
        return list(self.db.scalars(statement).all())

    def create(self, workspace_id: UUID, user_id: UUID, role: str) -> WorkspaceMembership:
        membership = WorkspaceMembership(
            workspace_id=workspace_id,
            user_id=user_id,
            role=role,
        )
        self.db.add(membership)
        self.db.flush()
        return membership
