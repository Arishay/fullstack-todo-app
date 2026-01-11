"""Task API endpoints."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..models.user import User
from ..schemas.task import (
    CreateTaskRequest,
    UpdateTaskRequest,
    TaskResponse,
    TaskListResponse
)
from ..services.task import (
    create_task,
    get_user_tasks,
    get_task_by_id,
    update_task,
    toggle_task_completion,
    delete_task
)
from .deps import get_current_user

router = APIRouter()


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new task",
    description="Create a new todo task for the authenticated user"
)
async def create_task_endpoint(
    request: CreateTaskRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> TaskResponse:
    """
    Create a new task.

    Args:
        request: Task creation data
        current_user: Authenticated user (injected)
        db: Database session (injected)

    Returns:
        Created task

    Raises:
        401: Unauthorized
        400: Invalid input data
    """
    task = await create_task(db, current_user.id, request)
    return TaskResponse.from_orm(task)


@router.get(
    "",
    response_model=TaskListResponse,
    summary="List user's tasks",
    description="Get all tasks owned by the authenticated user"
)
async def list_tasks_endpoint(
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum results per page"),
    offset: int = Query(0, ge=0, description="Number of results to skip"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> TaskListResponse:
    """
    List all tasks for the authenticated user.

    Args:
        completed: Optional filter by completion status
        limit: Maximum results (1-1000)
        offset: Number of results to skip
        current_user: Authenticated user (injected)
        db: Database session (injected)

    Returns:
        Task list with pagination metadata

    Raises:
        401: Unauthorized
    """
    tasks, total = await get_user_tasks(
        db,
        current_user.id,
        completed=completed,
        limit=limit,
        offset=offset
    )

    return TaskListResponse(
        tasks=[TaskResponse.from_orm(task) for task in tasks],
        total=total,
        limit=limit,
        offset=offset
    )


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Get task by ID",
    description="Get a single task by ID (must be owned by authenticated user)"
)
async def get_task_endpoint(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> TaskResponse:
    """
    Get a single task by ID.

    Args:
        task_id: Task ID
        current_user: Authenticated user (injected)
        db: Database session (injected)

    Returns:
        Task data

    Raises:
        401: Unauthorized
        404: Task not found or not owned by user
    """
    task = await get_task_by_id(db, task_id, current_user.id)
    return TaskResponse.from_orm(task)


@router.put(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Update task",
    description="Update task title and/or description"
)
async def update_task_endpoint(
    task_id: int,
    request: UpdateTaskRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> TaskResponse:
    """
    Update a task.

    Args:
        task_id: Task ID
        request: Update data
        current_user: Authenticated user (injected)
        db: Database session (injected)

    Returns:
        Updated task

    Raises:
        401: Unauthorized
        404: Task not found or not owned by user
        400: Invalid input data
    """
    task = await update_task(db, task_id, current_user.id, request)
    return TaskResponse.from_orm(task)


@router.patch(
    "/{task_id}/complete",
    response_model=TaskResponse,
    summary="Toggle task completion",
    description="Toggle or set task completion status"
)
async def toggle_task_completion_endpoint(
    task_id: int,
    completed: Optional[bool] = Query(None, description="Set specific completion status (or toggle if not provided)"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> TaskResponse:
    """
    Toggle task completion status.

    Args:
        task_id: Task ID
        completed: Optional specific status to set
        current_user: Authenticated user (injected)
        db: Database session (injected)

    Returns:
        Updated task

    Raises:
        401: Unauthorized
        404: Task not found or not owned by user
    """
    task = await toggle_task_completion(db, task_id, current_user.id, completed)
    return TaskResponse.from_orm(task)


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete task",
    description="Permanently delete a task"
)
async def delete_task_endpoint(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> None:
    """
    Delete a task.

    Args:
        task_id: Task ID
        current_user: Authenticated user (injected)
        db: Database session (injected)

    Raises:
        401: Unauthorized
        404: Task not found or not owned by user
    """
    await delete_task(db, task_id, current_user.id)
