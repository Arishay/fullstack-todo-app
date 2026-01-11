"""Application configuration management."""

import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://user:password@localhost:5432/todoapp"
    )

    # Security
    BETTER_AUTH_SECRET: str = os.getenv(
        "BETTER_AUTH_SECRET",
        "change-this-secret-key-in-production"
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24

    # CORS
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3000")

    # Application
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    API_PREFIX: str = "/api"

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        """Pydantic configuration."""
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
