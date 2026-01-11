---
name: backend-api-builder
description: Build and maintain RESTful FastAPI endpoints following project conventions and specs.
---

# Backend API Builder Skill

## Executive Summary
This skill is responsible for exposing backend business logic through clean, secure, and spec-compliant RESTful APIs using FastAPI.

## Operational Mandates
1. **API Namespace:** All routes MUST live under `/api/`.
2. **Async Only:** All route handlers must be async.
3. **Validation First:** Use Pydantic/SQLModel schemas for request and response validation.
4. **Docs Validation:** Verify FastAPI patterns via MCP `context-7` before structural changes.

## Execution Workflow
- **Step 1: Planning:** Read `@specs/api/rest-endpoints.md`.
- **Step 2: Documentation:** Query MCP `context-7` for "FastAPI async route patterns".
- **Step 3: Implementation:**
    - Create route modules under `/routes`.
    - Inject dependencies (DB session, authenticated user).
    - Return structured JSON responses.
    - Handle errors with `HTTPException`.
- **Step 4: Verification:** Test endpoints using Swagger UI or pytest.

## Examples
- **Input:** "Implement GET /api/tasks endpoint."
- **Action:** Invoke `backend-api-builder` → Read API spec → Generate FastAPI route → Connect todo-manager logic.
