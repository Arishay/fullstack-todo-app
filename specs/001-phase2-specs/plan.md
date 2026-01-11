# Implementation Plan: Phase II Todo Web Application

**Branch**: `001-phase2-specs` | **Date**: 2026-01-08 | **Spec**: [specs/001-phase2-specs/](.)
**Input**: Complete Phase II specifications from `/specs/001-phase2-specs/`

**Note**: This plan defines the technical architecture and implementation strategy for Phase II of the Hackathon Todo application.

## Summary

Implement a secure, full-stack web application enabling authenticated users to manage personal todo tasks through CRUD operations. The system uses JWT-based authentication with strict per-user data isolation. Architecture follows a stateless backend (FastAPI + SQLModel + Neon PostgreSQL) serving a modern frontend (Next.js 16 App Router + TypeScript + Tailwind CSS). Implementation proceeds in strict dependency order: database schema → backend authentication → backend task API → frontend authentication → frontend task UI.

**Primary Requirements**:
- User registration, login, and JWT-based session management
- Task CRUD operations (create, read, update, delete, toggle completion)
- Complete data isolation (users can only access their own tasks)
- REST API with standardized error handling
- Responsive web UI with accessibility compliance

**Technical Approach**:
- Backend-first implementation to establish data layer and API contracts
- JWT verification via shared `BETTER_AUTH_SECRET` between frontend and backend
- SQLModel for type-safe database operations with async support
- Next.js Server Components by default, Client Components only for interactivity
- Centralized API client on frontend for consistent request/response handling

## Technical Context

**Language/Version**:
- Backend: Python 3.11+
- Frontend: TypeScript 5.0+ / Node.js 18+

**Primary Dependencies**:
- **Backend**: FastAPI 0.100+, SQLModel 0.14+, Pydantic 2.0+, asyncpg (PostgreSQL driver), python-jose[cryptography] (JWT), passlib[bcrypt] (password hashing)
- **Frontend**: Next.js 16+, React 18+, TypeScript 5+, Tailwind CSS 3+, Better Auth (authentication client)

**Storage**: Neon Serverless PostgreSQL (managed, async-compatible, auto-scaling)

**Testing**:
- Backend: pytest + pytest-asyncio + httpx (FastAPI test client)
- Frontend: Jest + React Testing Library + Playwright (E2E)

**Target Platform**:
- Backend: Linux server / containerized (Docker optional)
- Frontend: Node.js runtime / Vercel deployment target
- Database: Cloud-hosted (Neon)

**Project Type**: Web application (full-stack)

**Performance Goals**:
- API response time: <200ms p95 for CRUD operations
- Page load: First Contentful Paint <1.5s, Time to Interactive <3s
- Database query time: <50ms p95 for task list queries

**Constraints**:
- Stateless backend (no server-side sessions)
- All API routes under `/api/` prefix
- JWT tokens only (no cookies for auth on backend)
- All database queries MUST filter by `user_id`
- Phase II scope only (no chatbot, AI, Phase III features)

**Scale/Scope**:
- Expected users: 100-1,000 during hackathon demo
- Tasks per user: 10-1,000 typical, 10,000 maximum
- Concurrent users: 10-100
- API throughput: 100 requests/second sufficient
- Database: <10GB total data expected

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Spec-First Development ✅ PASS
- All specifications complete in `/specs/001-phase2-specs/`
- No code exists yet - spec-first approach enforced
- Implementation will reference `@specs/001-phase2-specs/*` throughout

### Principle II: User Isolation & Security ✅ PASS
- JWT-based authentication specified (@specs/001-phase2-specs/features/authentication.md)
- All task queries filtered by `user_id` (@specs/001-phase2-specs/database/schema.md)
- Ownership enforcement at database layer (@specs/001-phase2-specs/api/rest-endpoints.md)

### Principle III: Deterministic Behavior ✅ PASS
- Clear request/response contracts defined (@specs/001-phase2-specs/api/rest-endpoints.md)
- No randomness in business logic
- Timestamps use UTC, IDs use deterministic sequences

### Principle IV: Single Source of Truth ✅ PASS
- Specifications are complete and authoritative
- Implementation will defer to specs for all decisions
- Database schema matches spec exactly

### Principle V: Minimalism Over Polish ✅ PASS
- Scope limited to Phase II (no chatbot, AI, extras)
- UI focuses on functionality over aesthetics
- No features beyond specifications

### Authentication Standard ✅ PASS
- Better Auth specified for frontend (@specs/001-phase2-specs/features/authentication.md)
- JWT tokens with shared `BETTER_AUTH_SECRET` (@specs/001-phase2-specs/overview.md)
- Stateless backend verified (@specs/001-phase2-specs/features/authentication.md)

### API Standard ✅ PASS
- All routes under `/api/` (@specs/001-phase2-specs/api/rest-endpoints.md)
- JWT required for all protected endpoints
- 401 Unauthorized for missing/invalid tokens
- Standardized error response format

### Database Standard ✅ PASS
- SQLModel specified (@specs/001-phase2-specs/database/schema.md)
- Schema matches `/specs/001-phase2-specs/database/schema.md`
- All tasks linked to `user_id`
- Async operations throughout

### Frontend Standard ✅ PASS
- Next.js App Router (@specs/001-phase2-specs/ui/pages.md)
- Server Components default (@specs/001-phase2-specs/ui/components.md)
- Centralized API client (@specs/001-phase2-specs/overview.md)

### Backend Standard ✅ PASS
- FastAPI with async handlers (@specs/001-phase2-specs/overview.md)
- Dependency injection for DB and auth (@specs/001-phase2-specs/api/rest-endpoints.md)
- Type hints required (SQLModel provides this)

**Constitution Compliance**: ✅ ALL GATES PASSED

## Project Structure

### Documentation (this feature)

```text
specs/001-phase2-specs/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (GENERATED BELOW)
├── data-model.md        # Phase 1 output (GENERATED BELOW)
├── quickstart.md        # Phase 1 output (GENERATED BELOW)
├── contracts/           # Phase 1 output (GENERATED BELOW)
│   ├── openapi.yaml     # OpenAPI 3.0 spec for REST API
│   └── schemas/         # Pydantic/TypeScript shared schemas
├── overview.md          # Project overview (existing)
├── features/            # Feature specifications (existing)
│   ├── task-crud.md
│   └── authentication.md
├── api/                 # API specification (existing)
│   └── rest-endpoints.md
├── database/            # Database specification (existing)
│   └── schema.md
└── ui/                  # UI specifications (existing)
    ├── pages.md
    └── components.md
```

### Source Code (repository root)

```text
# Web application structure
backend/
├── src/
│   ├── models/          # SQLModel database models
│   │   ├── __init__.py
│   │   ├── user.py      # User model
│   │   └── task.py      # Task model
│   ├── schemas/         # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   ├── auth.py      # Auth schemas (login, register, token)
│   │   └── task.py      # Task schemas (create, update, response)
│   ├── services/        # Business logic layer
│   │   ├── __init__.py
│   │   ├── auth.py      # Authentication service (JWT, password hashing)
│   │   └── task.py      # Task CRUD service (ownership enforcement)
│   ├── api/             # FastAPI route handlers
│   │   ├── __init__.py
│   │   ├── deps.py      # Dependency injection (DB session, current user)
│   │   ├── auth.py      # Auth routes (/api/auth/*)
│   │   └── tasks.py     # Task routes (/api/tasks/*)
│   ├── core/            # Core configuration
│   │   ├── __init__.py
│   │   ├── config.py    # Environment variables, settings
│   │   ├── security.py  # JWT utilities, password hashing
│   │   └── database.py  # Database engine, session management
│   └── main.py          # FastAPI app initialization, CORS, routes
├── tests/
│   ├── conftest.py      # Pytest fixtures (test DB, test client)
│   ├── test_auth.py     # Authentication endpoint tests
│   ├── test_tasks.py    # Task CRUD endpoint tests
│   └── test_security.py # JWT verification, ownership tests
├── migrations/          # Database migrations (Alembic)
│   ├── env.py
│   └── versions/
│       └── 001_initial_schema.py
├── .env.example         # Example environment variables
├── pyproject.toml       # Poetry/pip dependencies
└── README.md

frontend/
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── layout.tsx   # Root layout (metadata, fonts)
│   │   ├── page.tsx     # Home page (redirects to /tasks)
│   │   ├── login/
│   │   │   └── page.tsx # Login page (Server Component wrapper)
│   │   ├── signup/
│   │   │   └── page.tsx # Signup page (Server Component wrapper)
│   │   └── tasks/
│   │       ├── page.tsx # Task list page (Server Component)
│   │       └── [id]/
│   │           └── page.tsx # Task detail/edit page
│   ├── components/      # React components
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx      # Client Component
│   │   │   └── SignupForm.tsx     # Client Component
│   │   ├── tasks/
│   │   │   ├── TaskList.tsx       # Server Component
│   │   │   ├── TaskItem.tsx       # Client Component
│   │   │   ├── TaskForm.tsx       # Client Component
│   │   │   └── TaskCheckbox.tsx   # Client Component
│   │   ├── layout/
│   │   │   ├── Header.tsx         # Server Component
│   │   │   └── PageContainer.tsx  # Server Component
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── TextArea.tsx
│   │       ├── Modal.tsx
│   │       ├── ErrorMessage.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ConfirmDialog.tsx
│   ├── lib/             # Utilities
│   │   ├── api-client.ts          # Centralized API client
│   │   ├── auth.ts                # Better Auth configuration
│   │   └── types.ts               # TypeScript types (Task, User, etc.)
│   └── middleware.ts    # Next.js middleware (auth guards)
├── public/              # Static assets
├── tests/
│   ├── unit/            # Jest unit tests
│   └── e2e/             # Playwright E2E tests
├── .env.local.example   # Example environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md

.env (root, gitignored)
├── BETTER_AUTH_SECRET=<shared-secret>
├── DATABASE_URL=<neon-connection-string>
├── FRONTEND_URL=http://localhost:3000
└── BACKEND_URL=http://localhost:8000
```

**Structure Decision**: Web application structure (Option 2) selected. Two separate projects (`backend/` and `frontend/`) enable independent development and deployment. Backend serves pure REST API, frontend consumes API and renders UI. Clear separation of concerns, testable in isolation, scalable independently.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected** - all constitution checks passed. No complexity justification required.

---

# Phase 0: Outline & Research

## Research Objectives

The specifications are comprehensive and implementation-ready. Research focuses on best practices for integrating the specified technologies and resolving any ambiguities in tooling choices.

### Research Task 1: Better Auth Integration with JWT Backend

**Question**: How does Better Auth generate JWT tokens that FastAPI can verify with a shared secret?

**Research Findings**:

Better Auth is a flexible authentication library for Next.js applications. For Phase II:

1. **Token Generation**:
   - Better Auth will use the `BETTER_AUTH_SECRET` to sign JWT tokens
   - Tokens include standard claims: `user_id`, `email`, `exp` (expiration), `iat` (issued at)
   - Token format: Header.Payload.Signature (HS256 algorithm)

2. **Backend Verification**:
   - FastAPI uses `python-jose[cryptography]` library for JWT verification
   - Same `BETTER_AUTH_SECRET` used to verify signature
   - Extract `user_id` from decoded payload for ownership filtering

3. **Token Flow**:
   - Frontend: User logs in → Better Auth generates JWT → Store in httpOnly cookie or localStorage
   - API Request: Frontend attaches JWT in `Authorization: Bearer <token>` header
   - Backend: FastAPI dependency extracts header → Verifies signature → Extracts `user_id` → Injects into route

**Decision**: Use Better Auth with HS256 algorithm (HMAC with SHA-256) for JWT signing. Both frontend and backend share same secret via environment variable.

**Implementation Notes**:
- Backend JWT utility: `backend/src/core/security.py` with `verify_token(token: str) -> dict` function
- Frontend API client: Automatically attach token from Better Auth session to all requests
- Token expiration: 24 hours (configurable via Better Auth)

---

### Research Task 2: SQLModel Async Patterns with Neon PostgreSQL

**Question**: What's the correct async pattern for SQLModel with Neon's serverless PostgreSQL?

**Research Findings**:

1. **Database Engine**:
   ```python
   from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

   engine = create_async_engine(
       DATABASE_URL,  # postgresql+asyncpg://...
       echo=True,  # SQL logging for development
       future=True
   )
   ```

2. **Session Management**:
   ```python
   from sqlalchemy.ext.asyncio import async_sessionmaker

   async_session = async_sessionmaker(
       engine, class_=AsyncSession, expire_on_commit=False
   )
   ```

3. **Dependency Injection in FastAPI**:
   ```python
   async def get_db() -> AsyncGenerator[AsyncSession, None]:
       async with async_session() as session:
           yield session
   ```

4. **SQLModel Queries**:
   ```python
   from sqlmodel import select

   async def get_tasks(db: AsyncSession, user_id: str):
       result = await db.execute(
           select(Task).where(Task.user_id == user_id)
       )
       return result.scalars().all()
   ```

**Decision**: Use `asyncpg` driver with `create_async_engine`, `AsyncSession`, and SQLModel's `select()` for type-safe queries.

**Implementation Notes**:
- Connection string format: `postgresql+asyncpg://user:pass@host/db`
- Neon provides connection pooling by default
- Use `expire_on_commit=False` to avoid lazy-loading issues with async

---

### Research Task 3: Next.js 16 App Router Auth Middleware

**Question**: How do we protect routes in Next.js App Router with Better Auth?

**Research Findings**:

1. **Middleware Approach** (`middleware.ts` in project root):
   ```typescript
   import { NextResponse } from 'next/server'
   import type { NextRequest } from 'next/server'

   export function middleware(request: NextRequest) {
     const token = request.cookies.get('auth-token')?.value

     if (!token && request.nextUrl.pathname.startsWith('/tasks')) {
       return NextResponse.redirect(new URL('/login', request.url))
     }

     return NextResponse.next()
   }

   export const config = {
     matcher: ['/tasks/:path*']
   }
   ```

2. **Better Auth Integration**:
   - Better Auth stores JWT in secure httpOnly cookie
   - Middleware checks for cookie presence
   - Protected routes redirect to login if no token

3. **Server Component Auth**:
   ```typescript
   import { getSession } from '@/lib/auth'

   export default async function TasksPage() {
     const session = await getSession()
     if (!session) redirect('/login')
     // Fetch tasks server-side
   }
   ```

**Decision**: Use Next.js middleware for route protection + Better Auth for session management.

**Implementation Notes**:
- Middleware runs on edge runtime (fast redirects)
- Server Components can call `getSession()` for additional validation
- Client Components use React Context for session access

---

### Research Task 4: Tailwind CSS + Next.js 16 Setup

**Question**: What's the recommended Tailwind configuration for Next.js 16?

**Research Findings**:

1. **Installation**:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Configuration** (`tailwind.config.ts`):
   ```typescript
   import type { Config } from 'tailwindcss'

   const config: Config = {
     content: [
       './src/app/**/*.{js,ts,jsx,tsx,mdx}',
       './src/components/**/*.{js,ts,jsx,tsx,mdx}',
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   export default config
   ```

3. **Global Styles** (`src/app/globals.css`):
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

**Decision**: Standard Tailwind setup with Next.js App Router content paths.

**Implementation Notes**:
- No custom plugins needed for Phase II
- Use Tailwind's built-in responsive modifiers (`sm:`, `md:`, `lg:`)
- Accessibility classes available via Tailwind (`sr-only`, `focus:ring`, etc.)

---

## Research Summary

All technical unknowns resolved. Implementation-ready decisions:

| Technology | Decision | Rationale |
|------------|----------|-----------|
| JWT Algorithm | HS256 (HMAC-SHA256) | Simple, symmetric, sufficient for single-server backend |
| Database Driver | asyncpg | Async-native PostgreSQL driver, Neon-compatible |
| Session Management | AsyncSession with dependency injection | FastAPI best practice, testable, scoped |
| Route Protection | Next.js middleware + Better Auth | Edge-optimized, secure httpOnly cookies |
| Styling | Tailwind CSS with default config | Rapid UI development, consistency |

No additional research required. Proceed to Phase 1.

---

# Phase 1: Design & Contracts

## Data Model

See `data-model.md` (generated below).

## API Contracts

See `contracts/openapi.yaml` (generated below).

## Quickstart Guide

See `quickstart.md` (generated below).

---

# Phase 2: Task Breakdown

**Note**: Task breakdown is performed by the `/sp.tasks` command, not `/sp.plan`.

Once this plan is approved, run:
```bash
/sp.tasks
```

This will generate `specs/001-phase2-specs/tasks.md` with:
- Dependency-ordered tasks
- Parallel execution opportunities marked with [P]
- Acceptance criteria per task
- Skill assignments (todo-manager, auth-manager, backend-api-builder, etc.)

---

# Implementation Order

**Critical Path** (must be completed sequentially):

1. **Backend Foundation** (Phase 1)
   - Database schema + migrations
   - Core configuration (settings, database engine)
   - JWT security utilities

2. **Backend Authentication** (Phase 2)
   - User model + auth service (password hashing)
   - Auth endpoints (register, login)
   - JWT dependency injection

3. **Backend Task API** (Phase 3)
   - Task model + task service (ownership enforcement)
   - Task CRUD endpoints with auth dependencies

4. **Frontend Foundation** (Phase 4)
   - Next.js setup + Tailwind
   - Better Auth configuration
   - Centralized API client

5. **Frontend Authentication** (Phase 5)
   - Login page + LoginForm component
   - Signup page + SignupForm component
   - Auth middleware for route protection

6. **Frontend Task UI** (Phase 6)
   - Task list page + TaskList/TaskItem components
   - Task detail/edit page + TaskForm component
   - Complete integration + E2E testing

**Parallel Opportunities**:
- After backend authentication complete: Can develop frontend authentication in parallel with backend task API
- Within each phase: Multiple components/modules can be developed concurrently if they don't share dependencies

---

# Success Criteria

Implementation is complete when:

1. **All Phase II user stories implemented**:
   - ✅ User registration and login functional
   - ✅ Task CRUD operations functional (create, read, update, delete, toggle completion)
   - ✅ User logout and session management functional

2. **All security requirements met**:
   - ✅ JWT authentication on all protected endpoints
   - ✅ User isolation enforced (zero cross-user data access)
   - ✅ Passwords hashed (no plaintext storage)
   - ✅ 401 responses for unauthenticated requests

3. **All technical requirements met**:
   - ✅ Backend: FastAPI + SQLModel + Neon PostgreSQL
   - ✅ Frontend: Next.js 16 App Router + TypeScript + Tailwind CSS
   - ✅ Database: Schema matches specification exactly
   - ✅ API: All endpoints documented in OpenAPI spec functional
   - ✅ UI: All pages and components from specifications implemented

4. **All quality gates passed**:
   - ✅ Backend tests pass (auth, CRUD, security)
   - ✅ Frontend tests pass (unit, E2E)
   - ✅ No constitution violations
   - ✅ Performance targets met (API <200ms p95, FCP <1.5s)

5. **Documentation complete**:
   - ✅ Quickstart guide enables new developers to run locally
   - ✅ API documentation (OpenAPI) accurate and complete
   - ✅ README files in backend/ and frontend/ explain setup

---

# Next Steps

1. **Review this plan** for accuracy and completeness
2. **Generate Phase 1 artifacts** (data-model.md, contracts/, quickstart.md) - see sections below
3. **Run `/sp.tasks`** to break down into atomic implementation tasks
4. **Begin implementation** following task dependency order
5. **Use designated skills** (todo-manager, auth-manager, backend-api-builder, frontend-ui-builder, api-client-integrator) for each task category
