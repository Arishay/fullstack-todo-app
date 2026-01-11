"""Task service for CRUD operations with user ownership enforcement."""

from datetime import datetime
from typing import Optional, List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from fastapi import HTTPException, status

from ..models.task import Task
from ..schemas.task import CreateTaskRequest, UpdateTaskRequest


async def create_task(
    db: AsyncSession,
    user_id: UUID,
    request: CreateTaskRequest
) -> Task:
    """
    Create a new task for the authenticated user.

    Args:
        db: Database session
        user_id: Authenticated user's UUID
        request: Task creation data

    Returns:
        Created task model
    """
    new_task = Task(
        user_id=user_id,
        title=request.title.strip(),
        description=request.description.strip() if request.description else None,
        completed=False
    )

    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)

    return new_task


async def get_user_tasks(
    db: AsyncSession,
    user_id: UUID,
    completed: Optional[bool] = None,
    limit: int = 100,
    offset: int = 0
) -> tuple[List[Task], int]:
    """
    Get all tasks for a user with optional filtering.

    Args:
        db: Database session
        user_id: User UUID
        completed: Optional filter by completion status
        limit: Maximum results (default 100, max 1000)
        offset: Number of results to skip

    Returns:
        Tuple of (tasks list, total count)
    """
    # Enforce maximum limit
    limit = min(limit, 1000)

    # Build base query
    query = select(Task).where(Task.user_id == user_id)

    # Apply completion filter if provided
    if completed is not None:
        query = query.where(Task.completed == completed)

    # Order by created_at DESC
    query = query.order_by(Task.created_at.desc())

    # Get total count
    count_query = select(func.count()).select_from(Task).where(Task.user_id == user_id)
    if completed is not None:
        count_query = count_query.where(Task.completed == completed)

    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Apply pagination
    query = query.limit(limit).offset(offset)

    # Execute query
    result = await db.execute(query)
    tasks = result.scalars().all()

    return list(tasks), total


async def get_task_by_id(
    db: AsyncSession,
    task_id: int,
    user_id: UUID
) -> Optional[Task]:
    """
    Get a single task by ID, enforcing user ownership.

    Args:
        db: Database session
        task_id: Task ID
        user_id: User UUID (for ownership verification)

    Returns:
        Task model or None if not found or not owned by user

    Raises:
        HTTPException: 404 if task not found or not owned by user
    """
    result = await db.execute(
        select(Task).where(
            Task.id == task_id,
            Task.user_id == user_id
        )
    )
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found"
        )

    return task


async def update_task(
    db: AsyncSession,
    task_id: int,
    user_id: UUID,
    request: UpdateTaskRequest
) -> Task:
    """
    Update a task's title and/or description.

    Args:
        db: Database session
        task_id: Task ID
        user_id: User UUID (for ownership verification)
        request: Update data

    Returns:
        Updated task model

    Raises:
        HTTPException: 404 if task not found or not owned by user
    """
    task = await get_task_by_id(db, task_id, user_id)

    task.title = request.title.strip()
    task.description = request.description.strip() if request.description else None
    task.updated_at = datetime.utcnow()

    await db.commit()
    await db.refresh(task)

    return task


async def toggle_task_completion(
    db: AsyncSession,
    task_id: int,
    user_id: UUID,
    completed: Optional[bool] = None
) -> Task:
    """
    Toggle task completion status or set to specific value.

    Args:
        db: Database session
        task_id: Task ID
        user_id: User UUID (for ownership verification)
        completed: Optional specific completion status (if None, toggles current)

    Returns:
        Updated task model

    Raises:
        HTTPException: 404 if task not found or not owned by user
    """
    task = await get_task_by_id(db, task_id, user_id)

    if completed is None:
        # Toggle current state
        task.completed = not task.completed
    else:
        # Set to specific state
        task.completed = completed

    task.updated_at = datetime.utcnow()

    await db.commit()
    await db.refresh(task)

    return task


async def delete_task(
    db: AsyncSession,
    task_id: int,
    user_id: UUID
) -> None:
    """
    Permanently delete a task.

    Args:
        db: Database session
        task_id: Task ID
        user_id: User UUID (for ownership verification)

    Raises:
        HTTPException: 404 if task not found or not owned by user
    """
    task = await get_task_by_id(db, task_id, user_id)

    await db.delete(task)
    await db.commit()
