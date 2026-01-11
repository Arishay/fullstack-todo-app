"""User database model."""

from datetime import datetime
from typing import Optional, TYPE_CHECKING
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .task import Task


class User(SQLModel, table=True):
    """
    User model representing registered users.

    Reference: @specs/001-phase2-specs/database/schema.md
    """

    __tablename__ = "users"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        nullable=False
    )
    email: str = Field(
        unique=True,
        index=True,
        max_length=255,
        nullable=False
    )
    password_hash: str = Field(
        max_length=255,
        nullable=False
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )

    # Relationships
    tasks: list["Task"] = Relationship(back_populates="user")
