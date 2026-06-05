from uuid import UUID

from sqlalchemy.orm import Session

from app.models.workspace_membership import WorkspaceMembership
from app.repositories.workspace_membership_repository import (
    WorkspaceMembershipRepository,
)


class WorkspaceMembershipService:
    def __init__(self, db: Session) -> None:
        self.memberships = WorkspaceMembershipRepository(db)

    def list_members(self, workspace_id: UUID) -> list[WorkspaceMembership]:
        return self.memberships.list_for_workspace(workspace_id)
