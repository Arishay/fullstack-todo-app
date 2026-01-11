# Database Schema Specification

**Feature Branch**: `001-phase2-specs`
**Created**: 2026-01-08
**Status**: Draft

## Overview

This document defines the database schema for Phase II of the Todo application. The schema supports user authentication and task management with strict per-user data isolation.

**Database Provider**: Neon Serverless PostgreSQL
**ORM**: SQLModel (Python)
**Character Set**: UTF-8
**Timezone**: UTC for all timestamps

## Schema Principles

1. **Referential Integrity**: Foreign keys enforce relationships
2. **Data Isolation**: All user data linked via `user_id` foreign key
3. **Automatic Timestamps**: Creation and update times tracked automatically
4. **Immutable IDs**: Primary keys never change after creation
5. **No Soft Deletes**: Deletions are permanent (Phase II requirement)

## Tables

### Table: `users`

**Purpose**: Store registered user accounts

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique user identifier |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | User email address (login identifier) |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt/Argon2 hashed password |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation time (UTC) |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last modification time (UTC) |

**Indexes**:
- Primary key index on `id` (automatic)
- Unique index on `email` (enforces uniqueness)

**Example Row**:
```
id: 123e4567-e89b-12d3-a456-426614174000
email: user@example.com
password_hash: $2b$12$KIXfF.S8mCWE7y8F3F0F3OqX1N9xH2F5xC6F3F0F3F0F3F0F3F0F3
created_at: 2026-01-08 10:00:00+00
updated_at: 2026-01-08 10:00:00+00
```

**Notes**:
- `email` is case-insensitive for login (normalized to lowercase before storage)
- `password_hash` NEVER stores plaintext passwords
- UUID provides globally unique, non-sequential identifiers
- `updated_at` triggers automatically on row modification

---

### Table: `tasks`

**Purpose**: Store user tasks with ownership tracking

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique task identifier |
| `user_id` | UUID | NOT NULL, FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE | Task owner |
| `title` | VARCHAR(200) | NOT NULL | Task title (required) |
| `description` | TEXT | NULL | Task description (optional, can be null) |
| `completed` | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Task creation time (UTC) |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last modification time (UTC) |

**Indexes**:
- Primary key index on `id` (automatic)
- Index on `user_id` (critical for filtering by owner)
- Index on `(user_id, completed)` (composite for filtered queries)
- Index on `(user_id, created_at DESC)` (composite for sorted list queries)

**Foreign Keys**:
- `user_id` → `users.id` ON DELETE CASCADE
  - When user is deleted, all their tasks are automatically deleted
  - Maintains referential integrity

**Example Row**:
```
id: 42
user_id: 123e4567-e89b-12d3-a456-426614174000
title: Complete project documentation
description: Write comprehensive docs for Phase II
completed: false
created_at: 2026-01-08 14:30:00+00
updated_at: 2026-01-08 14:30:00+00
```

**Notes**:
- `description` can be NULL or empty string (both allowed)
- `completed` defaults to FALSE (new tasks are incomplete)
- `updated_at` triggers automatically on any field modification
- Integer ID provides simple, sequential identifiers for tasks

---

## Relationships

### One-to-Many: Users → Tasks

- One user can have zero or many tasks
- Each task belongs to exactly one user
- Relationship enforced by foreign key constraint
- Cascade delete ensures orphaned tasks are removed when user deleted

**Diagram**:
```
┌──────────────┐         ┌──────────────┐
│    users     │         │    tasks     │
├──────────────┤         ├──────────────┤
│ id (PK)      │←────────│ id (PK)      │
│ email        │    1:N  │ user_id (FK) │
│ password_hash│         │ title        │
│ created_at   │         │ description  │
│ updated_at   │         │ completed    │
└──────────────┘         │ created_at   │
                         │ updated_at   │
                         └──────────────┘
```

---

## Data Constraints

### Field-Level Constraints

**users.email**:
- Must be valid email format (validated at application layer)
- Normalized to lowercase before storage
- Maximum 255 characters
- Unique across all users

**users.password_hash**:
- Minimum length determined by hashing algorithm (typically 60+ chars for bcrypt)
- Never exposed via API

**tasks.title**:
- Minimum 1 character (NOT NULL constraint + validation)
- Maximum 200 characters
- Cannot be empty string (validated at application layer)

**tasks.description**:
- Maximum 1000 characters
- Can be NULL or empty string
- No minimum length

**tasks.completed**:
- Boolean only (true/false)
- Defaults to false

### Table-Level Constraints

- `users.email` UNIQUE constraint prevents duplicate accounts
- `tasks.user_id` FOREIGN KEY constraint enforces referential integrity
- CASCADE DELETE on foreign key maintains data consistency

---

## Indexes Strategy

### Performance Considerations

1. **Primary Keys**: Automatic indexes for fast ID lookups
2. **Foreign Keys**: Index on `tasks.user_id` for efficient JOIN operations
3. **Filtered Queries**: Composite index on `(user_id, completed)` for common filter
4. **Sorted Lists**: Composite index on `(user_id, created_at DESC)` for default task list view

### Index Usage Examples

```sql
-- Fast: Uses index on (user_id, created_at DESC)
SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC;

-- Fast: Uses index on (user_id, completed)
SELECT * FROM tasks WHERE user_id = ? AND completed = false;

-- Fast: Uses index on user_id
SELECT COUNT(*) FROM tasks WHERE user_id = ?;
```

---

## Data Types Rationale

| Choice | Rationale |
|--------|-----------|
| UUID for user_id | Globally unique, non-sequential, secure |
| INTEGER for task_id | Simple, efficient, sequential for user-facing IDs |
| VARCHAR(200) for title | Fixed reasonable limit, indexed efficiently |
| TEXT for description | Variable length, suitable for longer content |
| TIMESTAMP for dates | Standard, timezone-aware, sufficient precision |
| BOOLEAN for completed | Clear two-state flag, efficient storage |

---

## Migration Strategy

### Initial Migration (v1)

**File**: `migrations/001_initial_schema.sql`

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email (unique constraint creates this automatically)
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes on tasks
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);
CREATE INDEX idx_tasks_user_created ON tasks(user_id, created_at DESC);

-- Create trigger to auto-update updated_at (PostgreSQL)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Future Migrations

Future schema changes will be tracked with sequential migration files:
- `002_add_task_priority.sql` (example)
- `003_add_user_preferences.sql` (example)

Each migration must:
1. Be idempotent (safe to run multiple times)
2. Include rollback script
3. Preserve existing data
4. Update this specification document

---

## Data Access Patterns

### Query Patterns

**All task queries MUST filter by user_id**:

```sql
-- Correct (enforces ownership)
SELECT * FROM tasks WHERE user_id = ? AND id = ?;

-- WRONG (security violation - no user filter)
SELECT * FROM tasks WHERE id = ?;
```

**Common Queries**:

1. **List user's tasks**:
```sql
SELECT * FROM tasks
WHERE user_id = ?
ORDER BY created_at DESC
LIMIT ? OFFSET ?;
```

2. **Get specific task (with ownership check)**:
```sql
SELECT * FROM tasks
WHERE user_id = ? AND id = ?;
```

3. **Create task**:
```sql
INSERT INTO tasks (user_id, title, description)
VALUES (?, ?, ?)
RETURNING *;
```

4. **Update task (with ownership check)**:
```sql
UPDATE tasks
SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP
WHERE user_id = ? AND id = ?
RETURNING *;
```

5. **Delete task (with ownership check)**:
```sql
DELETE FROM tasks
WHERE user_id = ? AND id = ?;
```

---

## Security Considerations

### Data Isolation

- **CRITICAL**: ALL queries on `tasks` table MUST include `user_id` filter
- Never query tasks by ID alone without user verification
- Use parameterized queries to prevent SQL injection
- No raw SQL strings with concatenated user input

### Password Security

- Store only bcrypt/argon2/scrypt hashes (never plaintext)
- Use appropriate cost factor (bcrypt: 12+ rounds)
- Hash generation happens in application layer before database
- `password_hash` column never exposed in API responses

### Sensitive Data

- Email addresses are PII - handle according to privacy regulations
- Implement data retention policies (beyond Phase II scope)
- Consider encryption at rest for production (Neon handles this)

---

## Performance Characteristics

### Expected Data Volume (per user)

- Tasks: 10-1000 typical, 10,000 maximum expected
- Users: Unlimited growth expected

### Query Performance Targets

- Task list query: <50ms (p95)
- Task CRUD operations: <20ms (p95)
- User authentication query: <30ms (p95)

### Scaling Considerations

- Indexes support efficient querying up to 100k+ tasks per user
- Foreign key indexes enable efficient CASCADE DELETE
- Neon serverless auto-scales for connection pooling
- Read replicas possible if read-heavy load (future optimization)

---

## Example Data Set

### Sample Users
```
id: 123e4567-e89b-12d3-a456-426614174000
email: alice@example.com
(password: hashed securely)

id: 223e4567-e89b-12d3-a456-426614174001
email: bob@example.com
(password: hashed securely)
```

### Sample Tasks (for alice@example.com)
```
id: 1, user_id: 123e..., title: "Buy groceries", description: null, completed: false
id: 2, user_id: 123e..., title: "Write documentation", description: "Phase II specs", completed: true
id: 3, user_id: 123e..., title: "Review PRs", description: null, completed: false
```

### Sample Tasks (for bob@example.com)
```
id: 4, user_id: 223e..., title: "Deploy to production", description: null, completed: false
id: 5, user_id: 223e..., title: "Fix bug #42", description: "Auth token expiry", completed: true
```

**Note**: Alice cannot see Bob's tasks (IDs 4-5), Bob cannot see Alice's tasks (IDs 1-3).

---

## Testing Data

### Seed Data for Development

```sql
-- Test user (password: "password123")
INSERT INTO users (id, email, password_hash) VALUES
('123e4567-e89b-12d3-a456-426614174000', 'test@example.com', '$2b$12$...');

-- Test tasks
INSERT INTO tasks (user_id, title, description, completed) VALUES
('123e4567-e89b-12d3-a456-426614174000', 'Test Task 1', 'Description 1', false),
('123e4567-e89b-12d3-a456-426614174000', 'Test Task 2', null, true),
('123e4567-e89b-12d3-a456-426614174000', 'Test Task 3', 'Description 3', false);
```

### Boundary Test Cases

- Maximum title length (200 chars): `"A" * 200`
- Maximum description length (1000 chars): `"B" * 1000`
- Empty description (null vs empty string): Both valid
- Special characters in title/description: UTF-8 emoji, accents, etc.
- Concurrent updates to same task: Last write wins

---

## Implementation Requirements

### ORM Configuration (SQLModel)

- Define models matching this schema exactly
- Enable automatic timestamp updates
- Configure async database engine
- Use connection pooling for performance
- Set appropriate timeouts

### Migration Management

- Use Alembic or similar migration tool
- Track all schema changes in version control
- Test migrations on staging before production
- Maintain both upgrade and downgrade scripts

### Backup Strategy

- Neon handles automated backups
- Point-in-time recovery available
- Test restore procedures regularly
- Document recovery runbooks
