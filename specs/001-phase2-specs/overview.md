# Project Overview: Phase II Todo Web Application

**Phase**: Phase II – Full-Stack Web Application
**Created**: 2026-01-08
**Status**: Active Development

## Application Purpose

A secure, user-centric task management web application that enables authenticated users to create, organize, and track their personal to-do items. The application prioritizes data isolation, ensuring each user has complete privacy and exclusive access to their task data.

## Current Phase: Phase II – Web Application

Phase II focuses on delivering a full-stack web application with:
- Complete task lifecycle management (create, read, update, delete, complete)
- Secure user authentication and authorization
- Persistent data storage
- Modern, responsive web interface

**Out of Scope for Phase II**:
- Chatbot or conversational interfaces
- AI agents or LLM integration
- Real-time collaboration features
- Third-party integrations beyond authentication
- Mobile native applications (iOS/Android)

## Technology Stack

### Frontend
- **Framework**: Next.js 16+ using App Router architecture
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for utility-first styling
- **Component Model**: Server Components by default, Client Components only for interactivity
- **Authentication**: Better Auth client library for session management

### Backend
- **Framework**: FastAPI for high-performance async API
- **Language**: Python 3.11+
- **ORM**: SQLModel for type-safe database operations
- **Authentication**: JWT verification using shared secret
- **Architecture**: Stateless, dependency injection-based

### Database
- **Provider**: Neon Serverless PostgreSQL
- **Access Pattern**: Async-compatible connections via SQLModel
- **Schema Management**: Migrations tracked and versioned

### Authentication
- **Method**: JWT (JSON Web Tokens)
- **Frontend Provider**: Better Auth
- **Token Storage**: Secure client-side storage (httpOnly cookies preferred)
- **Shared Secret**: `BETTER_AUTH_SECRET` environment variable used by both frontend and backend

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Next.js Frontend (Port 3000)               │    │
│  │                                                     │    │
│  │  • Server Components (default)                     │    │
│  │  • Client Components (forms, interactions)         │    │
│  │  • Better Auth (session management)                │    │
│  │  • Centralized API Client                          │    │
│  │  • JWT token attachment                            │    │
│  └─────────────────┬──────────────────────────────────┘    │
│                    │                                         │
└────────────────────┼─────────────────────────────────────────┘
                     │ HTTPS
                     │ JWT in Authorization header
                     │
    ┌────────────────▼──────────────────────────────────┐
    │      FastAPI Backend (Port 8000)                  │
    │                                                    │
    │  • JWT Verification (BETTER_AUTH_SECRET)          │
    │  • User Context Extraction                        │
    │  • Dependency Injection                           │
    │  • Route Handlers (/api/*)                        │
    │  • Business Logic Layer                           │
    │  • Data Access Layer (SQLModel)                   │
    └────────────────┬──────────────────────────────────┘
                     │ Async DB Queries
                     │
    ┌────────────────▼──────────────────────────────────┐
    │      Neon Serverless PostgreSQL                   │
    │                                                    │
    │  • users table                                    │
    │  • tasks table (user_id foreign key)              │
    │  • Indexes on user_id, completed                  │
    │  • Automatic timestamps                           │
    └───────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow
1. User submits credentials via frontend login form
2. Better Auth validates credentials and issues JWT token
3. Frontend stores JWT securely and attaches to all API requests
4. Backend verifies JWT signature using `BETTER_AUTH_SECRET`
5. Backend extracts `user_id` from JWT claims
6. All subsequent operations filtered by authenticated `user_id`

### Task Operations Flow
1. User interacts with frontend UI (view, create, edit, delete task)
2. Frontend sends HTTPS request to `/api/tasks/*` with JWT in header
3. Backend validates JWT, extracts `user_id`
4. Backend executes database query filtered by `user_id`
5. Backend returns data or confirmation to frontend
6. Frontend updates UI with response

## Security Model

- **Authentication**: JWT-based, stateless backend
- **Authorization**: Per-user data isolation enforced at database query level
- **Data Access**: All queries MUST include `user_id` filter from JWT
- **Secrets Management**: All sensitive values in `.env` files, never hardcoded
- **HTTPS**: All communication encrypted in transit (production)

## Non-Functional Characteristics

- **Performance**: Sub-second response times for typical operations
- **Scalability**: Stateless backend enables horizontal scaling
- **Reliability**: Deterministic behavior, testable operations
- **Maintainability**: Type-safe code, clear separation of concerns
- **Security**: Zero-trust architecture, defense in depth

## Success Criteria for Phase II

Phase II is considered complete when:
1. Users can register, log in, and maintain authenticated sessions
2. Users can perform all CRUD operations on their tasks
3. Complete data isolation between users (zero leakage)
4. All API endpoints secured with JWT verification
5. Frontend and backend communicate via documented REST API
6. Application deployed and accessible via web browser
7. All specifications have corresponding implementations
