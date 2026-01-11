"""Authentication service for user registration and login."""

from typing import Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from ..models.user import User
from ..core.security import hash_password, verify_password, create_access_token
from ..schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse


async def register_user(
    db: AsyncSession,
    request: RegisterRequest
) -> User:
    """
    Register a new user.

    Args:
        db: Database session
        request: Registration request data

    Returns:
        Created user model

    Raises:
        HTTPException: If email already exists (409) or validation fails (400)
    """
    # Normalize email to lowercase
    email = request.email.lower()

    # Check if user already exists
    result = await db.execute(
        select(User).where(User.email == email)
    )
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Hash password
    password_hash = hash_password(request.password)

    # Create new user
    new_user = User(
        email=email,
        password_hash=password_hash
    )

    db.add(new_user)

    try:
        await db.commit()
        await db.refresh(new_user)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    return new_user


async def login_user(
    db: AsyncSession,
    request: LoginRequest
) -> TokenResponse:
    """
    Authenticate user and generate JWT token.

    Args:
        db: Database session
        request: Login request data

    Returns:
        Token response with JWT and user data

    Raises:
        HTTPException: If credentials are invalid (401)
    """
    # Normalize email to lowercase
    email = request.email.lower()

    # Find user by email
    result = await db.execute(
        select(User).where(User.email == email)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Generate JWT token
    access_token = create_access_token(
        data={
            "user_id": str(user.id),
            "email": user.email
        }
    )

    # Build response
    user_response = UserResponse(
        id=user.id,
        email=user.email
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=86400,  # 24 hours
        user=user_response
    )


async def get_user_by_id(
    db: AsyncSession,
    user_id: UUID
) -> Optional[User]:
    """
    Get user by ID.

    Args:
        db: Database session
        user_id: User UUID

    Returns:
        User model or None if not found
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()
