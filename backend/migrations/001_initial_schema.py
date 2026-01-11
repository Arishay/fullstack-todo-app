"""Initial database schema migration - Users and Tasks tables.

Reference: @specs/001-phase2-specs/database/schema.md
"""

from sqlalchemy import text


def upgrade(connection):
    """
    Create users and tasks tables with indexes and constraints.

    Args:
        connection: Database connection
    """
    # Create users table
    connection.execute(text("""
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    """))

    # Create index on users.email for fast lookups
    connection.execute(text("""
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    """))

    # Create tasks table
    connection.execute(text("""
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(200) NOT NULL CHECK (length(title) >= 1),
            description TEXT CHECK (length(description) <= 1000),
            completed BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    """))

    # Create indexes on tasks table for query optimization
    connection.execute(text("""
        CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)
    """))

    connection.execute(text("""
        CREATE INDEX IF NOT EXISTS idx_tasks_user_completed
        ON tasks(user_id, completed)
    """))

    connection.execute(text("""
        CREATE INDEX IF NOT EXISTS idx_tasks_user_created
        ON tasks(user_id, created_at DESC)
    """))


def downgrade(connection):
    """
    Drop users and tasks tables.

    Args:
        connection: Database connection
    """
    connection.execute(text("DROP TABLE IF EXISTS tasks CASCADE"))
    connection.execute(text("DROP TABLE IF NOT EXISTS users CASCADE"))
