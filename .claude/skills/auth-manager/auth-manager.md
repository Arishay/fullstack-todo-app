---
name: auth-manager
description: Handle authentication, JWT issuance, and verification between Better Auth (Next.js) and FastAPI backend.
---

# Authentication Management Skill

## Executive Summary
This skill governs user authentication and authorization for the "Advanced AI-Todo" application. It ensures secure user isolation using JWT-based authentication across frontend (Next.js) and backend (FastAPI).

## Operational Mandates
1. **Shared Secret:** ALWAYS use the same `BETTER_AUTH_SECRET` in frontend and backend environments.
2. **JWT First:** All authentication must rely on JWT tokens issued by Better Auth.
3. **Stateless Backend:** Backend must never manage frontend sessions.
4. **Docs Validation:** Before implementing JWT verification, query MCP `context-7` for latest FastAPI JWT security patterns.

## Execution Workflow
- **Step 1: Planning:** Review authentication spec in `@specs/features/authentication.md`.
- **Step 2: Documentation:** Query MCP `context-7` for "FastAPI JWT verification best practices".
- **Step 3: Implementation:**
    - Configure Better Auth JWT plugin on Next.js.
    - Attach JWT token to API requests via Authorization header.
    - Implement FastAPI dependency/middleware to decode and validate JWT.
    - Extract user identity (`user_id`, `email`) from token.
- **Step 4: Verification:** Confirm unauthorized requests return `401 Unauthorized`.

## Examples
- **Input:** "Secure all task routes with authentication."
- **Action:** Invoke `auth-manager` → Configure Better Auth JWT → Implement FastAPI JWT dependency → Enforce user isolation.
