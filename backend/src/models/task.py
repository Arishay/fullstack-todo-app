"""Task database model."""

from datetime import datetime
from typing import Optional, TYPE_CHECKING
from uuid import UUID
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .user import User


class Task(SQLModel, table=True):
    """
    Task model representing user's todo tasks.

    Reference: @specs/001-phase2-specs/database/schema.md
    """

    __tablename__ = "tasks"

    id: Optional[int] = Field(
        default=None,
        primary_key=True,
        nullable=False
    )
    user_id: UUID = Field(
        foreign_key="users.id",
        index=True,
        nullable=False
    )
    title: str = Field(
        min_length=1,
        max_length=200,
        nullable=False
    )
    description: Optional[str] = Field(
        default=None,
        max_length=1000
    )
    completed: bool = Field(
        default=False,
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
    user: "User" = Relationship(back_populates="tasks")
