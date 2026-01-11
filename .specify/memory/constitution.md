<!--
Sync Impact Report:
Version: 1.0.0 → No previous version (initial constitution)
Modifications:
  - Initial constitution created with 5 core principles
  - Added 3 key sections: Key Standards, Skill Invocation Rules, Development Workflow
  - Project: Hackathon II – Spec-Driven Full-Stack Todo Web Application
Templates requiring updates:
  ✅ plan-template.md: Constitution Check section needs principles validation
  ✅ spec-template.md: Aligned - no changes required (focuses on user stories and requirements)
  ✅ tasks-template.md: Aligned - no changes required (focuses on task execution)
Follow-up TODOs:
  - None - all templates reviewed and aligned with constitution
-->

# Hackathon II – Spec-Driven Full-Stack Todo Web Application Constitution

## Core Principles

### I. Spec-First Development

No code may be written or modified unless a relevant specification exists in `/specs`. Specifications are the authoritative source for all implementation decisions. Any ambiguity, missing requirement, or unclear behavior MUST result in implementation stopping and requesting a spec update.

**Rationale**: This principle ensures that all work is traceable, intentional, and approved before execution. It prevents scope creep, reduces rework, and maintains a single source of truth for what the system should do.

### II. User Isolation & Security

Every feature MUST enforce strict per-user data isolation using JWT-based authentication. No user may access, view, or modify another user's data under any circumstances. All API endpoints MUST verify JWT tokens and filter data by authenticated user ID.

**Rationale**: Security and data privacy are non-negotiable. This principle protects user trust and ensures compliance with data protection standards by making isolation the default behavior rather than an afterthought.

### III. Deterministic Behavior

Backend and frontend behavior MUST be predictable, testable, and reproducible. Given the same inputs and state, the system MUST produce the same outputs. Randomness, side effects, and implicit dependencies are prohibited unless explicitly documented and justified.

**Rationale**: Deterministic behavior enables reliable testing, easier debugging, and confident deployment. It reduces production incidents and makes the system maintainable over time.

### IV. Single Source of Truth

Specifications supersede assumptions, prior code, model intuition, or external documentation. When conflicts arise between code and spec, the spec wins. When the spec is unclear, clarify the spec rather than making assumptions in code.

**Rationale**: Distributed truth sources create confusion and inconsistency. A single, authoritative source simplifies decision-making and ensures the entire team operates from the same understanding.

### V. Minimalism Over Polish

Functional correctness and spec compliance take absolute priority over UI aesthetics, code elegance, or "nice-to-have" features. Deliver what is specified, no more, no less. Polish is only permitted when explicitly specified.

**Rationale**: In time-constrained environments like hackathons, focus must remain on delivering working, specified functionality. Premature optimization and aesthetic improvements waste resources and delay delivery.

## Key Standards

### Specification Compliance

- All implementation MUST directly reference one or more spec files using `@specs/...` notation
- If a requirement is missing or unclear, implementation MUST STOP and request a spec update
- No "implied" or "assumed" requirements are permitted
- Every feature claim must be traceable to a spec section

### Authentication Standard

- Authentication MUST use Better Auth on the frontend
- Authorization MUST rely on JWT tokens
- Backend MUST verify JWT using the shared `BETTER_AUTH_SECRET` environment variable
- Backend MUST remain stateless with respect to frontend sessions
- No session storage, cookies, or stateful authentication mechanisms on the backend

### API Standard

- All API routes MUST be under `/api/` prefix
- All routes MUST require a valid JWT token
- Requests without valid tokens MUST return `401 Unauthorized` with appropriate error message
- All task operations MUST be filtered by the authenticated user ID extracted from the JWT
- Error responses MUST use consistent JSON structure with `error` and `message` fields

### Database Standard

- All database access MUST use SQLModel for type safety and validation
- Database schema MUST match `/specs/database/schema.md` exactly
- Tasks MUST always be associated with a `user_id` field
- No raw SQL queries unless explicitly justified and approved in spec
- All database operations MUST be async-compatible

### Frontend Standard

- Use Next.js App Router (not Pages Router)
- Server Components by default for all pages
- Client Components ONLY when user interactivity is required (forms, buttons, state)
- All backend communication MUST go through a centralized API client module
- No direct fetch calls from components

### Backend Standard

- Use FastAPI with async route handlers (`async def`)
- Use dependency injection for database sessions and authenticated user context
- Handle errors explicitly with `HTTPException` including appropriate status codes
- No global state or mutable module-level variables
- All routes MUST have type hints for request/response models

## Skill Invocation Rules

The following skills have clearly defined responsibilities and MUST be used only for their designated purposes:

- **todo-manager**: ONLY for task business logic as defined in `@specs/features/task-crud.md`
  - Create, read, update, delete operations for tasks
  - Task filtering, sorting, completion status management
  - Ownership enforcement at the service layer

- **auth-manager**: ONLY for authentication and JWT handling as defined in `@specs/features/authentication.md`
  - User authentication flows
  - JWT token generation and verification
  - Session management and user context extraction

- **backend-api-builder**: ONLY for implementing FastAPI routes from `@specs/api/*`
  - Route definition and registration
  - Request/response model creation
  - Dependency injection setup
  - HTTP method handling

- **frontend-ui-builder**: ONLY for UI implementation from `@specs/ui/*`
  - React component creation
  - Layout and styling
  - Client-side state management
  - Form handling and validation

- **api-client-integrator**: ONLY for frontend-backend API communication
  - Centralized API client implementation
  - Request/response normalization
  - Error handling and retry logic
  - JWT token attachment

Using a skill outside its defined scope is a constitution violation and requires explicit approval and documentation.

## Constraints

### Phase Scope

This constitution governs **Phase II only** (Web Application). Features are strictly limited to:
- Task CRUD operations (create, read, update, delete)
- User authentication (login, logout, session management)

The following are explicitly OUT OF SCOPE and MUST NOT be implemented:
- Chatbot features
- AI agents or LLM integration
- Phase III features of any kind
- Real-time collaboration
- Third-party integrations beyond Better Auth

### Technical Constraints

- No direct database access from frontend under any circumstances
- No hardcoded secrets, credentials, or tokens in code
- All secrets MUST be loaded from `.env` files
- No client-side storage of sensitive data (JWT tokens stored securely only)
- No bypassing of authentication checks for "convenience" or "testing"

## Development Workflow

1. **Read and validate relevant spec files**
   - Identify which specs apply to the current task
   - Verify specs are complete and unambiguous
   - Flag any gaps or conflicts before proceeding

2. **Select the appropriate skill based on responsibility**
   - Match task to skill domain per Skill Invocation Rules
   - Do not mix responsibilities across skills
   - Document any cross-skill dependencies

3. **Implement changes strictly according to the spec**
   - No interpretation or assumption
   - No "improvements" beyond spec
   - No refactoring of unrelated code

4. **Reject or pause implementation if specs are missing or contradictory**
   - Do not proceed with ambiguous requirements
   - Document the blocker clearly
   - Request spec clarification or update

5. **Favor clarity and correctness over speed**
   - Readable code is maintainable code
   - Type safety catches errors early
   - Explicit is better than implicit

## Success Criteria

The project is considered successful when:

- All features defined for Phase II are implemented and working
- Every API endpoint is secured with JWT authentication and rejects unauthenticated requests
- Each user can only see and modify their own tasks (zero data leakage)
- Frontend and backend operate independently but verify auth using the same `BETTER_AUTH_SECRET`
- Codebase remains aligned with Spec-Kit structure and conventions
- All code can be traced back to specific spec sections
- No constitution violations remain unresolved

## Governance

This constitution supersedes all other practices, coding conventions, and prior decisions. When conflicts arise, this document is authoritative.

**Amendment Process**:
- Amendments require documentation of the rationale and impact analysis
- Version must be incremented following semantic versioning (MAJOR.MINOR.PATCH)
- All dependent templates and documentation must be updated to reflect changes
- Team approval required before amendments take effect

**Compliance**:
- All pull requests and code reviews MUST verify constitution compliance
- Complexity additions require explicit justification documented in planning artifacts
- Violations discovered in production must be remediated immediately

**Version**: 1.0.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-08
