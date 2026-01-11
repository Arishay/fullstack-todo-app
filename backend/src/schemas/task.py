"""Task request and response schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class CreateTaskRequest(BaseModel):
    """Create task request."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Task title (1-200 characters)",
        example="Complete project documentation"
    )
    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Task description (optional, 0-1000 characters)",
        example="Write comprehensive docs for Phase II"
    )


class UpdateTaskRequest(BaseModel):
    """Update task request."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Task title (1-200 characters)",
        example="Updated task title"
    )
    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Task description (optional, 0-1000 characters)",
        example="Updated description"
    )


class TaskResponse(BaseModel):
    """Task data response."""

    id: int = Field(..., description="Task unique identifier")
    title: str = Field(..., description="Task title")
    description: Optional[str] = Field(None, description="Task description")
    completed: bool = Field(..., description="Task completion status")
    created_at: datetime = Field(..., description="Task creation timestamp (UTC)")
    updated_at: datetime = Field(..., description="Last update timestamp (UTC)")

    class Config:
        """Pydantic configuration."""
        from_attributes = True


class TaskListResponse(BaseModel):
    """Task list response with pagination metadata."""

    tasks: list[TaskResponse] = Field(..., description="List of tasks")
    total: int = Field(..., description="Total number of tasks matching query")
    limit: int = Field(..., description="Maximum results per page")
    offset: int = Field(..., description="Number of results skipped")
