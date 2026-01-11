# Quickstart Guide: Phase II Todo Web Application

**Feature Branch**: `001-phase2-specs`
**Date**: 2026-01-08
**Status**: Ready for Implementation

## Prerequisites

- **Python**: 3.11 or higher
- **Node.js**: 18 or higher
- **PostgreSQL**: Neon account (or local PostgreSQL 14+)
- **Git**: For version control
- **Code Editor**: VS Code, PyCharm, or similar

## Project Structure

```
todo-app-phase2/
├── backend/          # FastAPI backend (Python)
├── frontend/         # Next.js frontend (TypeScript)
├── specs/            # Specifications (this directory)
└── .env             # Shared environment variables
```

---

## Part 1: Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Python Virtual Environment

```bash
# Using venv
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install fastapi uvicorn sqlmodel asyncpg python-jose[cryptography] passlib[bcrypt] python-multipart
```

Or with `pyproject.toml`:
```bash
pip install -e .
```

### 4. Configure Environment Variables

Create `backend/.env`:
```env
DATABASE_URL=postgresql+asyncpg://user:password@host/database
BETTER_AUTH_SECRET=your-32-character-secret-key-here
CORS_ORIGINS=http://localhost:3000
```

**Get Neon Database URL**:
1. Sign up at https://neon.tech
2. Create new project
3. Copy connection string
4. Replace `postgresql://` with `postgresql+asyncpg://`

### 5. Run Database Migrations

```bash
# Create initial migration
alembic revision --autogenerate -m "Initial schema"

# Apply migrations
alembic upgrade head
```

### 6. Start Backend Server

```bash
uvicorn src.main:app --reload --port 8000
```

**Verify**: Open http://localhost:8000/docs (FastAPI auto-generated docs)

---

## Part 2: Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd ../frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-32-character-secret-key-here
```

**Note**: Use the SAME `BETTER_AUTH_SECRET` as backend.

### 4. Start Frontend Development Server

```bash
npm run dev
```

**Verify**: Open http://localhost:3000

---

## Part 3: Verify Full Stack

### 1. Test API Directly

**Register User**:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Login**:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Response** (save the `access_token`):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {"id": "...", "email": "test@example.com"}
}
```

**Create Task**:
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"My first task"}'
```

### 2. Test Frontend

1. Open http://localhost:3000
2. Click "Sign Up"
3. Register with email/password
4. Login with credentials
5. Create a task
6. Toggle task completion
7. Edit task
8. Delete task

---

## Development Workflow

### Running Tests

**Backend**:
```bash
cd backend
pytest
```

**Frontend**:
```bash
cd frontend
npm test                  # Unit tests (Jest)
npm run test:e2e          # E2E tests (Playwright)
```

### Code Quality

**Backend**:
```bash
# Format
black src/

# Lint
pylint src/

# Type check
mypy src/
```

**Frontend**:
```bash
# Format
npm run format

# Lint
npm run lint

# Type check
npm run type-check
```

---

## Common Issues & Solutions

### Issue: Database Connection Error

**Error**: `asyncpg.exceptions.ConnectionDoesNotExistError`

**Solution**:
1. Verify `DATABASE_URL` in `.env` is correct
2. Ensure Neon database is active (not paused)
3. Check firewall/network allows connection to Neon

### Issue: JWT Verification Fails

**Error**: `401 Unauthorized` on all API requests

**Solution**:
1. Verify `BETTER_AUTH_SECRET` is IDENTICAL in both frontend and backend `.env` files
2. Ensure token is being sent in `Authorization: Bearer <token>` header
3. Check token hasn't expired (default: 24 hours)

### Issue: CORS Error

**Error**: `Access to fetch... has been blocked by CORS policy`

**Solution**:
1. Verify backend CORS middleware allows `http://localhost:3000`
2. Check `CORS_ORIGINS` environment variable in backend
3. Restart backend server after `.env` changes

### Issue: Frontend Can't Connect to Backend

**Error**: `Failed to fetch` or `Network error`

**Solution**:
1. Verify backend is running on port 8000
2. Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
3. Test backend directly with curl (see Part 3)

---

## Project Specifications

All specifications are in `/specs/001-phase2-specs/`:
- `overview.md` - Project architecture
- `features/task-crud.md` - Task operations spec
- `features/authentication.md` - Auth spec
- `api/rest-endpoints.md` - API documentation
- `database/schema.md` - Database schema
- `ui/pages.md` - Page specifications
- `ui/components.md` - Component specifications

---

## Next Steps

1. **Implement Backend**:
   - Database models (`backend/src/models/`)
   - API routes (`backend/src/api/`)
   - Business logic (`backend/src/services/`)

2. **Implement Frontend**:
   - Pages (`frontend/src/app/`)
   - Components (`frontend/src/components/`)
   - API client (`frontend/src/lib/api-client.ts`)

3. **Run `/sp.tasks`** to generate detailed implementation tasks

---

## Additional Resources

- **Backend API Docs**: http://localhost:8000/docs (when running)
- **OpenAPI Spec**: `/specs/001-phase2-specs/contracts/openapi.yaml`
- **Data Model**: `/specs/001-phase2-specs/data-model.md`
- **Implementation Plan**: `/specs/001-phase2-specs/plan.md`

---

## Support

For issues or questions:
1. Check specifications in `/specs/001-phase2-specs/`
2. Review implementation plan
3. Consult constitution (`.specify/memory/constitution.md`)
