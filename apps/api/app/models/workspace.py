from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, IdMixin, TimestampMixin


class Workspace(IdMixin, TimestampMixin, Base):
    __tablename__ = "workspaces"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
