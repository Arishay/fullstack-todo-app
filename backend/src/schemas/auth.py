"""Authentication request and response schemas."""

from pydantic import BaseModel, EmailStr, Field
from uuid import UUID


class RegisterRequest(BaseModel):
    """User registration request."""

    email: EmailStr = Field(
        ...,
        description="User email address",
        example="user@example.com"
    )
    password: str = Field(
        ...,
        min_length=8,
        description="User password (minimum 8 characters)",
        example="securepassword123"
    )


class LoginRequest(BaseModel):
    """User login request."""

    email: EmailStr = Field(
        ...,
        description="User email address",
        example="user@example.com"
    )
    password: str = Field(
        ...,
        description="User password",
        example="securepassword123"
    )


class UserResponse(BaseModel):
    """User data response."""

    id: UUID = Field(..., description="User unique identifier")
    email: str = Field(..., description="User email address")

    class Config:
        """Pydantic configuration."""
        from_attributes = True


class TokenResponse(BaseModel):
    """JWT token response."""

    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(default=86400, description="Token expiration in seconds")
    user: UserResponse = Field(..., description="Authenticated user data")


class RegisterResponse(BaseModel):
    """User registration success response."""

    user_id: UUID = Field(..., description="Created user ID")
    email: str = Field(..., description="User email")
    message: str = Field(default="User registered successfully")
