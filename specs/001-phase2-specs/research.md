# Research: Phase II Todo Web Application

**Feature Branch**: `001-phase2-specs`
**Date**: 2026-01-08
**Status**: Complete

## Purpose

This document consolidates research findings for technology integration patterns and best practices for Phase II implementation.

## Research Tasks Completed

1. Better Auth Integration with JWT Backend
2. SQLModel Async Patterns with Neon PostgreSQL
3. Next.js 16 App Router Auth Middleware
4. Tailwind CSS + Next.js 16 Setup

---

## 1. Better Auth Integration with JWT Backend

### Question
How does Better Auth generate JWT tokens that FastAPI can verify with a shared secret?

### Findings

**Token Generation Flow**:
- Better Auth uses `BETTER_AUTH_SECRET` environment variable to sign JWT tokens
- Tokens generated on successful authentication include standard claims
- Token structure: Header.Payload.Signature (HS256 algorithm - HMAC with SHA-256)

**JWT Claims**:
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "exp": 1704758400,
  "iat": 1704672000
}
```

**Backend Verification**:
- Use `python-jose[cryptography]` library for JWT decode and verification
- Same `BETTER_AUTH_SECRET` verifies token signature
- Extract `user_id` from payload for all database operations

**Token Flow Diagram**:
```
Frontend (Better Auth)           Backend (FastAPI)
─────────────────────           ─────────────────
1. User logs in
2. Better Auth generates JWT
   using BETTER_AUTH_SECRET
3. Store JWT (httpOnly cookie)

4. API Request →               5. Extract Authorization header
   Header: Bearer <JWT>        6. Verify JWT signature
                               7. Decode payload
                               8. Extract user_id
                               9. Execute query with user_id filter
                               10. Return response ←
```

### Decision

**JWT Algorithm**: HS256 (HMAC-SHA256)
- Symmetric algorithm (same key signs and verifies)
- Sufficient security for single-server architecture
- Simpler than RS256 (no public/private key pair needed)

**Token Expiration**: 24 hours (configurable)

**Storage**: httpOnly cookie (preferred) or secure localStorage

### Implementation Notes

**Backend** (`backend/src/core/security.py`):
```python
from jose import JWTError, jwt
from fastapi import HTTPException, status

SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
```

**Frontend API Client** (`frontend/src/lib/api-client.ts`):
```typescript
import { getSession } from './auth'

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const session = await getSession()
  const token = session?.token

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    // Redirect to login
  }

  return response
}
```

### Alternatives Considered

- **RS256 (RSA)**: Rejected - Over-engineered for single backend server. Requires key pair management.
- **Session cookies (stateful)**: Rejected - Constitution requires stateless backend.
- **OAuth2 with external provider**: Out of scope for Phase II.

---

## 2. SQLModel Async Patterns with Neon PostgreSQL

### Question
What's the correct async pattern for SQLModel with Neon's serverless PostgreSQL?

### Findings

**Database Connection**:
- Neon requires `asyncpg` driver (async-native PostgreSQL driver)
- Connection string format: `postgresql+asyncpg://user:password@host/database`
- Use `create_async_engine` from SQLAlchemy

**Session Management**:
- Use `async_sessionmaker` to create session factory
- Set `expire_on_commit=False` to avoid lazy-loading issues in async context
- Dependency injection via FastAPI's `Depends()`

**Query Patterns**:
- SQLModel's `select()` provides type-safe queries
- Use `await db.execute(statement)` for query execution
- Extract results with `.scalars().all()` or `.scalars().first()`

### Decision

**Architecture**:
```
Application Code
      ↓
Dependency Injection (get_db)
      ↓
AsyncSession (scoped to request)
      ↓
AsyncEngine (application-wide)
      ↓
asyncpg Driver
      ↓
Neon PostgreSQL
```

**Configuration** (`backend/src/core/database.py`):
```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlmodel import SQLModel

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # SQL logging (disable in production)
    future=True,
    pool_pre_ping=True,  # Verify connections before use
)

async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session
```

**Query Example** (`backend/src/services/task.py`):
```python
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession

async def get_user_tasks(db: AsyncSession, user_id: str) -> list[Task]:
    statement = select(Task).where(Task.user_id == user_id)
    result = await db.execute(statement)
    return result.scalars().all()
```

### Implementation Notes

- **Connection Pooling**: Neon handles pooling at infrastructure level
- **Transaction Management**: Use `async with db.begin()` for explicit transactions
- **Error Handling**: Catch `SQLAlchemyError` for database errors
- **Testing**: Create separate test database engine with in-memory SQLite or test PostgreSQL instance

### Alternatives Considered

- **Sync SQLModel**: Rejected - Blocks event loop, poor performance under load.
- **Raw asyncpg**: Rejected - Loses type safety and ORM convenience.
- **Tortoise ORM**: Rejected - SQLModel preferred for Pydantic integration.

---

## 3. Next.js 16 App Router Auth Middleware

### Question
How do we protect routes in Next.js App Router with Better Auth?

### Findings

**Middleware Capabilities**:
- Runs on Edge Runtime (fast, globally distributed)
- Executes before page renders
- Can access cookies, redirect, rewrite URLs
- Perfect for authentication checks

**Better Auth Integration**:
- Better Auth stores JWT in httpOnly cookie (secure, not accessible to JavaScript)
- Middleware can read cookie and validate presence
- Invalid/missing token → redirect to login

**Implementation Layers**:
1. **Middleware**: Fast redirect for unauthenticated users
2. **Server Component**: Additional validation, fetch user-specific data
3. **Client Component**: Display user info, handle logout

### Decision

**Two-Layer Protection**:
1. **Middleware** (`middleware.ts`): Fast redirects for missing tokens
2. **Server Components**: Validate token and fetch user session

**Middleware Implementation**:
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/signup')
  const isProtectedPage = request.nextUrl.pathname.startsWith('/tasks')

  // Redirect authenticated users away from auth pages
  if (isAuthPage && authToken) {
    return NextResponse.redirect(new URL('/tasks', request.url))
  }

  // Redirect unauthenticated users to login
  if (isProtectedPage && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/tasks/:path*',
    '/login',
    '/signup',
  ],
}
```

**Server Component Auth Check**:
```typescript
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function TasksPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  // Fetch user-specific data
  const tasks = await fetchTasksServerSide(session.user_id)

  return <TaskList tasks={tasks} />
}
```

### Implementation Notes

- **Cookie Security**: Use `httpOnly`, `secure` (HTTPS only), `sameSite: 'strict'`
- **Token Refresh**: Implement silent refresh before expiration (optional for MVP)
- **Logout**: Clear cookie and redirect to login

### Alternatives Considered

- **Client-side only auth**: Rejected - Allows unauthorized access if JavaScript disabled, SEO issues.
- **Server-side sessions**: Rejected - Constitution requires stateless backend.
- **Authentication in API routes**: Rejected - Slower, less efficient than middleware.

---

## 4. Tailwind CSS + Next.js 16 Setup

### Question
What's the recommended Tailwind configuration for Next.js 16?

### Findings

**Standard Setup**:
- Tailwind CSS 3.x officially supported by Next.js
- PostCSS integration built-in
- No additional configuration needed beyond standard setup

**Content Configuration**:
- Must specify paths to all files containing Tailwind class names
- Next.js App Router uses `src/app/` and `src/components/` by default

### Decision

**Standard Tailwind Setup** with Next.js App Router content paths.

**Installation**:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configuration** (`tailwind.config.ts`):
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',      // Blue for CTAs
        secondary: '#6b7280',    // Gray for secondary actions
        success: '#10b981',      // Green for completion
        error: '#ef4444',        // Red for errors/delete
        background: '#ffffff',   // White background
        foreground: '#111827',   // Near-black text
      },
    },
  },
  plugins: [],
}

export default config
```

**Global Styles** (`src/app/globals.css`):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-background text-foreground;
  }
}
```

### Implementation Notes

- **No custom plugins needed** for Phase II MVP
- **Responsive Design**: Use built-in breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`)
- **Accessibility**: Use `sr-only`, `focus:ring`, `focus:outline-none` classes
- **Dark Mode**: Not required for Phase II, but Tailwind supports it (`dark:` prefix)

### Alternatives Considered

- **Styled-components/Emotion**: Rejected - Constitution requires Tailwind CSS only.
- **CSS Modules**: Rejected - Less consistent, more verbose than Tailwind.
- **Custom CSS**: Rejected - Harder to maintain, not as fast to develop.

---

## Technology Decision Matrix

| Technology | Decision | Alternatives Rejected | Rationale |
|------------|----------|----------------------|-----------|
| JWT Algorithm | HS256 | RS256, Session Cookies | Simplicity, stateless, sufficient security |
| Database Driver | asyncpg | psycopg2 (sync), Tortoise ORM | Async-native, SQLModel compatible |
| Auth Middleware | Next.js Edge Middleware | Client-side only, API routes | Fast redirects, secure, SEO-friendly |
| Styling | Tailwind CSS | Styled-components, CSS Modules | Constitution requirement, rapid development |
| Password Hashing | bcrypt via passlib | argon2, scrypt | Industry standard, proven security |

---

## Risks & Mitigations

### Risk 1: Better Auth + FastAPI JWT Mismatch
**Risk**: Different JWT implementations could cause signature verification failures.

**Mitigation**:
- Use HS256 algorithm (standard, widely supported)
- Test JWT generation/verification early in development
- Create integration test that generates token in frontend, verifies in backend

### Risk 2: Async/Await Complexity
**Risk**: Incorrect async patterns could cause deadlocks or performance issues.

**Mitigation**:
- Follow SQLModel + asyncpg patterns exactly as researched
- Use `pytest-asyncio` for testing async code
- Profile queries to ensure performance targets met

### Risk 3: CORS Configuration
**Risk**: Frontend and backend on different ports/domains could cause CORS errors.

**Mitigation**:
- Configure FastAPI CORS middleware early
- Allow `http://localhost:3000` in development
- Use environment variables for allowed origins

---

## Open Questions (None)

All critical technical questions resolved. Implementation-ready.

---

## References

- Better Auth Documentation: https://better-auth.com/docs
- FastAPI Documentation: https://fastapi.tiangolo.com/
- SQLModel Documentation: https://sqlmodel.tiangolo.com/
- Next.js App Router: https://nextjs.org/docs/app
- Tailwind CSS: https://tailwindcss.com/docs
- python-jose JWT: https://python-jose.readthedocs.io/
