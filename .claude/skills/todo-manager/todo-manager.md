---
name: todo-manager
description: Manage authenticated, multi-user Todo operations (Create, Read, Update, Delete, Complete) using SQLModel, FastAPI, and Neon Postgres.
---

# Todo Management Skill (Phase II – Full-Stack)

## Executive Summary
This skill governs the full lifecycle of Todos in the "Advanced AI-Todo" Hackathon-2 application.  
It ensures **secure, multi-user, persistent** task management using JWT-authenticated requests, async SQLModel operations, and RESTful API patterns.

This skill is **backend-only** and MUST always operate on the **authenticated user context** provided by JWT verification.

---

## Operational Mandates

1. **Auth Required (Mandatory)**
   - Every Todo operation MUST receive a validated `user_id` from JWT.
   - NEVER trust `user_id` from request body or URL alone.

2. **Environment First**
   - ALWAYS run `source .venv/bin/activate` before any backend execution.
   - Use `.env` variables for `DATABASE_URL` and `BETTER_AUTH_SECRET`.

3. **Dependency Management**
   - Use `uv` for all package installs and execution.
   - NEVER use raw `pip`.

4. **Async Database Operations**
   - All CRUD operations MUST be async.
   - Use SQLModel with async session support.

5. **Ownership Enforcement**
   - Every query MUST filter by `task.user_id == authenticated_user.id`.
   - Cross-user access is strictly forbidden.

6. **Docs Validation**
   - Before changing SQLModel or FastAPI behavior, query MCP `context-7`
     for **"FastAPI SQLModel async Postgres best practices"**.

---

## Execution Workflow

### Step 1: Context Awareness
- Confirm JWT authentication is active (via `auth-manager`).
- Ensure authenticated user context is available in request.

### Step 2: Documentation
- Query MCP `context-7` for:
  - SQLModel async CRUD patterns
  - FastAPI dependency injection patterns

### Step 3: Implementation

Implement the following **user-scoped async operations**:

#### Core Operations
- `create_task(user_id, title, description)`
- `get_tasks(user_id, filters, sort)`
- `get_task_by_id(user_id, task_id)`
- `update_task(user_id, task_id, payload)`
- `delete_task(user_id, task_id)`
- `toggle_task_completion(user_id, task_id)`

#### Business Rules
- Title required (1–200 chars)
- Description optional (≤1000 chars)
- Tasks default to `completed = false`
- Only owner may update/delete task
- 404 if task not found OR not owned by user

### Step 4: Verification
- Run tests using:
```bash
uv run pytest
