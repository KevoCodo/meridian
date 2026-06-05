from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.auth import UserRead
from app.schemas.base import to_camel


class WorkspaceRole(StrEnum):
    OWNER = "owner"
    MEMBER = "member"


class WorkspaceMemberRead(BaseModel):
    id: UUID
    workspace_id: UUID
    user_id: UUID
    role: WorkspaceRole
    user: UserRead
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        alias_generator=to_camel,
        from_attributes=True,
        populate_by_name=True,
    )
