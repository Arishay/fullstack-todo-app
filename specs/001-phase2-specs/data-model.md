# Data Model: Phase II Todo Web Application

**Feature Branch**: `001-phase2-specs`
**Date**: 2026-01-08
**Status**: Complete
**Source**: Derived from `@specs/001-phase2-specs/database/schema.md`

## Overview

This document defines the data models (entities) for Phase II. Models are implemented as SQLModel classes providing both ORM functionality and Pydantic validation.

---

## Entity: User

**Purpose**: Represents a registered user account

**Source Specification**: `@specs/001-phase2-specs/features/authentication.md`

### Attributes

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique user identifier |
| `email` | str | NOT NULL, UNIQUE, max_length=255 | User email (login identifier) |
| `password_hash` | str | NOT NULL, max_length=255 | Bcrypt hashed password |
| `created_at` | datetime | NOT NULL, DEFAULT now() | Account creation timestamp (UTC) |
| `updated_at` | datetime | NOT NULL, DEFAULT now() | Last update timestamp (UTC) |

### Relationships

- **One-to-Many with Task**: A user can have zero or more tasks (`tasks: list[Task]`)

### Validation Rules

- Email must be valid format (validated by Pydantic `EmailStr`)
- Email normalized to lowercase before storage
- Password must be hashed before storage (never store plaintext)
- Minimum password length: 8 characters (enforced at service layer)

### SQLModel Implementation

```python
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from pydantic import EmailStr

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    password_hash: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship (not stored in DB)
    tasks: list["Task"] = Relationship(back_populates="user")
```

---

## Entity: Task

**Purpose**: Represents a todo task owned by a user

**Source Specification**: `@specs/001-phase2-specs/features/task-crud.md`

### Attributes

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| `id` | int | PRIMARY KEY, AUTO INCREMENT | Unique task identifier |
| `user_id` | UUID | FOREIGN KEY (users.id), NOT NULL, INDEXED | Task owner |
| `title` | str | NOT NULL, min_length=1, max_length=200 | Task title (required) |
| `description` | str | NULL, max_length=1000 | Task description (optional) |
| `completed` | bool | NOT NULL, DEFAULT False | Completion status |
| `created_at` | datetime | NOT NULL, DEFAULT now() | Task creation timestamp (UTC) |
| `updated_at` | datetime | NOT NULL, DEFAULT now() | Last update timestamp (UTC) |

### Relationships

- **Many-to-One with User**: Each task belongs to exactly one user (`user: User`)

### Validation Rules

- Title: Required, 1-200 characters
- Description: Optional, 0-1000 characters (can be NULL or empty string)
- Completed: Boolean only (true/false)
- `user_id`: Must reference existing user (foreign key constraint)
- All queries MUST filter by `user_id` for security

### SQLModel Implementation

```python
from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    user: User = Relationship(back_populates="tasks")
```

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│       User          │
├─────────────────────┤
│ id (UUID) PK        │
│ email (str)         │
│ password_hash (str) │
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │
           │ 1:N
           │
┌──────────▼──────────┐
│       Task          │
├─────────────────────┤
│ id (int) PK         │
│ user_id (UUID) FK   │
│ title (str)         │
│ description (str?)  │
│ completed (bool)    │
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

---

## State Transitions

### Task Completion State

```
┌──────────────┐     toggle_complete()      ┌──────────────┐
│  Incomplete  │ ──────────────────────────> │   Completed  │
│              │                             │              │
│ completed:   │ <────────────────────────── │ completed:   │
│   false      │     toggle_complete()       │   true       │
└──────────────┘                             └──────────────┘
```

**Transitions**:
- `create()`: Task created with `completed=False`
- `toggle_complete()`: Flips `completed` boolean
- `update()`: Can modify title/description, does NOT affect completion
- `delete()`: Permanent removal (no soft delete)

---

## Database Indexes

### User Table
- **Primary Key**: `id` (UUID) - automatic
- **Unique Index**: `email` - enforces uniqueness, fast login lookups

### Task Table
- **Primary Key**: `id` (int) - automatic
- **Foreign Key Index**: `user_id` - essential for ownership filtering
- **Composite Index**: `(user_id, completed)` - optimizes filtered list queries
- **Composite Index**: `(user_id, created_at DESC)` - optimizes default sort

**Index Usage Examples**:
```sql
-- Fast: Uses (user_id, created_at DESC) index
SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC;

-- Fast: Uses (user_id, completed) index
SELECT * FROM tasks WHERE user_id = ? AND completed = false;

-- Fast: Uses user_id index
SELECT COUNT(*) FROM tasks WHERE user_id = ?;
```

---

## Constraints Summary

### Referential Integrity
- `tasks.user_id` → `users.id` (CASCADE DELETE)
- When user deleted, all their tasks automatically deleted

### Data Validation
- Email format validated by Pydantic
- Password length validated at service layer (min 8 chars)
- Title length: 1-200 characters (enforced by SQLModel Field)
- Description length: 0-1000 characters (enforced by SQLModel Field)

### Security Constraints
- **CRITICAL**: All task queries MUST include `WHERE user_id = <authenticated_user_id>`
- No raw SQL queries that bypass ORM (constitution requirement)
- Passwords MUST be hashed before setting `password_hash`

---

## Implementation Notes

### Timestamps
- Use `datetime.utcnow()` for all timestamps (UTC timezone)
- Automatic update triggers for `updated_at` (database level or application level)
- Display timestamps in user's local timezone (frontend responsibility)

### Password Hashing
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash password before storing
user.password_hash = pwd_context.hash(plain_password)

# Verify password during login
is_valid = pwd_context.verify(plain_password, user.password_hash)
```

### UUID vs Integer IDs
- **User IDs**: UUID (globally unique, non-sequential, harder to enumerate)
- **Task IDs**: Integer (simple, sequential, user-facing)

---

## Testing Considerations

### Test Data
```python
# Test user
test_user = User(
    email="test@example.com",
    password_hash=pwd_context.hash("password123")
)

# Test tasks
task1 = Task(
    user_id=test_user.id,
    title="Test Task 1",
    description="Description for test",
    completed=False
)

task2 = Task(
    user_id=test_user.id,
    title="Test Task 2",
    description=None,
    completed=True
)
```

### Security Tests
- Verify user A cannot access tasks owned by user B
- Verify CASCADE DELETE removes all tasks when user deleted
- Verify email uniqueness constraint

### Validation Tests
- Test title length boundaries (0, 1, 200, 201 characters)
- Test description length boundaries (0, 1000, 1001 characters)
- Test invalid email formats rejected

---

## References

- SQLModel Documentation: https://sqlmodel.tiangolo.com/
- Pydantic Validation: https://docs.pydantic.dev/
- Database Schema Spec: `@specs/001-phase2-specs/database/schema.md`
- Task CRUD Spec: `@specs/001-phase2-specs/features/task-crud.md`
- Authentication Spec: `@specs/001-phase2-specs/features/authentication.md`
