"""Database initialization script - creates tables."""

import asyncio
from src.core.database import create_db_and_tables


async def init_database():
    """Initialize database by creating all tables."""
    print("Creating database tables...")
    await create_db_and_tables()
    print("✅ Database tables created successfully!")


if __name__ == "__main__":
    asyncio.run(init_database())
