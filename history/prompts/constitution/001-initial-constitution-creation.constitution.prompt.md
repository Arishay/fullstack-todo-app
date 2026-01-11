---
id: 001
title: Initial Constitution Creation
stage: constitution
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5
feature: none
branch: master
user: AlizaGhaffar
command: /sp.constitution
labels: ["constitution", "governance", "principles", "standards", "phase-ii"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - N/A - Documentation artifact
---

## Prompt

Project: Hackathon II – Spec-Driven Full-Stack Todo Web Application

## Core Principles
- **Spec-First Development:** No code may be written or modified unless a relevant specification exists in `/specs`.
- **Single Source of Truth:** Specifications are authoritative over assumptions, prior code, or model intuition.
- **User Isolation & Security:** Every feature must enforce strict per-user data isolation using JWT-based authentication.
- **Deterministic Behavior:** Backend and frontend behavior must be predictable, testable, and reproducible.
- **Minimalism Over Polish:** Functional correctness and spec compliance take priority over UI aesthetics.

## Key Standards
- **Specification Compliance:**
  - All implementation must directly reference one or more spec files using `@specs/...`.
  - If a requirement is missing or unclear, implementation must STOP and request a spec update.
- **Authentication Standard:**
  - Authentication MUST use Better Auth on the frontend.
  - Authorization MUST rely on JWT tokens.
  - Backend MUST verify JWT using the shared `BETTER_AUTH_SECRET`.
  - Backend MUST remain stateless with respect to frontend sessions.
- **API Standard:**
  - All API routes MUST be under `/api/`.
  - All routes MUST require a valid JWT token.
  - Requests without valid tokens MUST return `401 Unauthorized`.
  - All task operations MUST be filtered by the authenticated user.
- **Database Standard:**
  - All database access MUST use SQLModel.
  - Database schema MUST match `/specs/database/schema.md`.
  - Tasks MUST always be associated with a user ID.
- **Frontend Standard:**
  - Use Next.js App Router.
  - Server Components by default.
  - Client Components ONLY when interactivity is required.
  - All backend communication MUST go through a centralized API client.
- **Backend Standard:**
  - Use FastAPI with async route handlers.
  - Use dependency injection for database sessions and authenticated user context.
  - Handle errors explicitly with HTTPException.

## Skill Invocation Rules
- Use **todo-manager** ONLY for task business logic defined in `@specs/features/task-crud.md`.
- Use **auth-manager** ONLY for authentication and JWT handling defined in `@specs/features/authentication.md`.
- Use **backend-api-builder** ONLY for implementing FastAPI routes from `@specs/api/*`.
- Use **frontend-ui-builder** ONLY for UI implementation from `@specs/ui/*`.
- Use **api-client-integrator** ONLY for frontend-backend API communication.

## Constraints
- Phase Scope: **Phase II only** (Web Application).
- Features limited to:
  - Task CRUD operations
  - User authentication
- No chatbot, AI agents, or Phase III features may be implemented.
- No direct database access from frontend.
- No hardcoded secrets or credentials in code.

## Development Workflow
1. Read and validate relevant spec files.
2. Select the appropriate skill based on responsibility.
3. Implement changes strictly according to the spec.
4. Reject or pause implementation if specs are missing or contradictory.
5. Favor clarity and correctness over speed.

## Success Criteria
- All features defined for Phase II are implemented.
- Every API endpoint is secured with JWT authentication.
- Each user can only see and modify their own tasks.
- Frontend and backend operate independently but verify auth using the same secret.
- Codebase remains aligned with Spec-Kit structure and conventions.

## Response snapshot

Constitution v1.0.0 successfully created at `.specify/memory/constitution.md`.

**5 Core Principles Established:**
1. Spec-First Development - No code without specification
2. User Isolation & Security - JWT-based per-user data isolation
3. Deterministic Behavior - Predictable, testable, reproducible
4. Single Source of Truth - Specifications supersede all else
5. Minimalism Over Polish - Functional correctness over aesthetics

**6 Key Standards Codified:**
- Specification Compliance (traceability required)
- Authentication Standard (Better Auth + JWT)
- API Standard (all routes under /api/, token required)
- Database Standard (SQLModel, async operations)
- Frontend Standard (Next.js App Router, centralized API client)
- Backend Standard (FastAPI, dependency injection)

**Skill Invocation Rules:** Clear boundaries established for 5 specialized skills to prevent scope mixing.

**Sync Impact:** All templates (.specify/templates/*.md) reviewed and confirmed aligned with new constitution.

## Outcome

- ✅ Impact: Initial project constitution ratified. Establishes governance framework for Phase II development with 5 core principles and 6 technical standards.
- 🧪 Tests: N/A - Documentation artifact (no executable tests)
- 📁 Files: Created .specify/memory/constitution.md (1 file, 210 lines)
- 🔁 Next prompts: Create feature specifications in `/specs/` directory; implement authentication spec; implement task CRUD spec
- 🧠 Reflection: Constitution establishes clear boundaries and enforcement mechanisms. Version 1.0.0 provides solid foundation for hackathon constraints. Template alignment verified - no propagation issues.

## Evaluation notes (flywheel)

- Failure modes observed: None - initial constitution creation
- Graders run and results (PASS/FAIL): Manual review - PASS (all placeholders resolved, no conflicts)
- Prompt variant (if applicable): N/A - Standard constitution command
- Next experiment (smallest change to try): Monitor compliance during first feature implementation to identify missing or overly restrictive rules
