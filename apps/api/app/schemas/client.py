from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, HttpUrl

from app.schemas.base import to_camel


class ClientStatus(StrEnum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ARCHIVED = "archived"


class ClientBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    status: ClientStatus = ClientStatus.ACTIVE
    contact_name: str | None = Field(default=None, max_length=255)
    contact_email: EmailStr | None = None
    company_website: HttpUrl | None = None
    notes: str | None = None

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class ClientCreate(ClientBase):
    workspace_id: UUID


class ClientUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    status: ClientStatus | None = None
    contact_name: str | None = Field(default=None, max_length=255)
    contact_email: EmailStr | None = None
    company_website: HttpUrl | None = None
    notes: str | None = None

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class ClientRead(ClientBase):
    id: UUID
    workspace_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        alias_generator=to_camel,
        from_attributes=True,
        populate_by_name=True,
    )
