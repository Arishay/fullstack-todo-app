"""Authentication API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..schemas.auth import RegisterRequest, LoginRequest, TokenResponse, RegisterResponse
from ..services.auth import register_user, login_user

router = APIRouter()


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register new user",
    description="Create a new user account with email and password"
)
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_db)
) -> RegisterResponse:
    """
    Register a new user.

    Args:
        request: Registration request with email and password
        db: Database session (injected)

    Returns:
        RegisterResponse with user_id and email

    Raises:
        409: Email already registered
        400: Invalid input data
    """
    user = await register_user(db, request)

    return RegisterResponse(
        user_id=user.id,
        email=user.email,
        message="User registered successfully"
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate user",
    description="Login with email and password to receive JWT token"
)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db)
) -> TokenResponse:
    """
    Authenticate user and return JWT token.

    Args:
        request: Login request with email and password
        db: Database session (injected)

    Returns:
        TokenResponse with access_token and user data

    Raises:
        401: Invalid credentials
    """
    return await login_user(db, request)
