"""Database configuration and session management."""

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlmodel import SQLModel
from .config import settings


# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,
)

# Create async session maker
async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency injection for database session.

    Yields:
        AsyncSession: Database session
    """
    async with async_session() as session:
        yield session


async def create_db_and_tables() -> None:
    """Create database tables (for development/testing)."""
    # Import models to register them with SQLModel metadata
    from ..models.user import User
    from ..models.task import Task

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
