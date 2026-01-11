# API Specification: REST Endpoints

**Feature Branch**: `001-phase2-specs`
**Created**: 2026-01-08
**Status**: Draft

## Overview

All API endpoints follow RESTful conventions and are prefixed with `/api`. All endpoints require authentication via JWT token in the `Authorization` header unless explicitly noted as public.

## Base Configuration

- **Base Path**: `/api`
- **Protocol**: HTTPS (production), HTTP (local development)
- **Authentication**: JWT Bearer token in `Authorization` header
- **Content Type**: `application/json` for request and response bodies
- **Character Encoding**: UTF-8

## Authentication Header Format

```
Authorization: Bearer <JWT_TOKEN>
```

All protected endpoints MUST include this header. Requests without valid token receive `401 Unauthorized`.

## Common Response Codes

- **200 OK**: Successful GET, PUT, PATCH requests
- **201 Created**: Successful POST request creating new resource
- **204 No Content**: Successful DELETE request
- **400 Bad Request**: Invalid request data (validation errors)
- **401 Unauthorized**: Missing, invalid, or expired JWT token
- **403 Forbidden**: Valid authentication but insufficient permissions (e.g., accessing another user's task)
- **404 Not Found**: Resource does not exist or user does not have access
- **500 Internal Server Error**: Unexpected server error

## Error Response Format

All error responses follow consistent structure:

```json
{
  "error": "ErrorType",
  "message": "Human-readable error description",
  "details": {
    "field": "validation error detail"
  }
}
```

**Example - Validation Error**:
```json
{
  "error": "ValidationError",
  "message": "Request validation failed",
  "details": {
    "title": "Title must be between 1 and 200 characters"
  }
}
```

**Example - Authentication Error**:
```json
{
  "error": "Unauthorized",
  "message": "Valid JWT token required"
}
```

## Authentication Endpoints

### Register User

**Endpoint**: `POST /api/auth/register`
**Authentication**: Not required (public endpoint)
**Description**: Create new user account

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Request Validation**:
- `email`: Required, valid email format
- `password`: Required, minimum 8 characters

**Success Response** (201 Created):
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "message": "Account created successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid email format or password too short
- `409 Conflict`: Email already registered

---

### Login

**Endpoint**: `POST /api/auth/login`
**Authentication**: Not required (public endpoint)
**Description**: Authenticate user and receive JWT token

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400,
  "user": {
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials

---

### Logout

**Endpoint**: `POST /api/auth/logout`
**Authentication**: Required
**Description**: End user session (client-side token invalidation)

**Request Body**: Empty (or optional token revocation data)

**Success Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

**Note**: Since backend is stateless, actual logout is handled client-side by removing token. This endpoint exists for consistency and potential future token blacklisting.

---

## Task Endpoints

### List All Tasks

**Endpoint**: `GET /api/tasks`
**Authentication**: Required
**Description**: Retrieve all tasks for authenticated user

**Query Parameters** (all optional):
- `completed`: Filter by completion status (`true` | `false`)
- `limit`: Maximum number of results (default: 100, max: 1000)
- `offset`: Number of results to skip for pagination (default: 0)
- `sort`: Sort order (`created_desc` | `created_asc` | `updated_desc` | `updated_asc`, default: `created_desc`)

**Example Request**:
```
GET /api/tasks?completed=false&limit=50&sort=created_desc
```

**Success Response** (200 OK):
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive docs for Phase II",
      "completed": false,
      "created_at": "2026-01-08T10:30:00Z",
      "updated_at": "2026-01-08T10:30:00Z"
    },
    {
      "id": 2,
      "title": "Review pull requests",
      "description": null,
      "completed": false,
      "created_at": "2026-01-08T09:15:00Z",
      "updated_at": "2026-01-08T09:15:00Z"
    }
  ],
  "total": 2,
  "limit": 50,
  "offset": 0
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT token

**Notes**:
- Only returns tasks where `user_id` matches authenticated user
- Empty array returned if user has no tasks
- Timestamps in ISO 8601 format with UTC timezone

---

### Create Task

**Endpoint**: `POST /api/tasks`
**Authentication**: Required
**Description**: Create new task for authenticated user

**Request Body**:
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for Phase II"
}
```

**Request Validation**:
- `title`: Required, 1-200 characters
- `description`: Optional, 0-1000 characters (null or empty string allowed)

**Success Response** (201 Created):
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for Phase II",
  "completed": false,
  "created_at": "2026-01-08T10:30:00Z",
  "updated_at": "2026-01-08T10:30:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors (empty title, title too long, description too long)
- `401 Unauthorized`: Missing or invalid JWT token

**Notes**:
- `user_id` automatically set from JWT claims (not in request body)
- `completed` defaults to `false`
- `created_at` and `updated_at` automatically set to current timestamp

---

### Get Task by ID

**Endpoint**: `GET /api/tasks/{id}`
**Authentication**: Required
**Description**: Retrieve specific task by ID

**Path Parameters**:
- `id`: Task ID (integer)

**Example Request**:
```
GET /api/tasks/1
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for Phase II",
  "completed": false,
  "created_at": "2026-01-08T10:30:00Z",
  "updated_at": "2026-01-08T10:30:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT token
- `404 Not Found`: Task does not exist OR task belongs to different user (no user enumeration)

**Notes**:
- Backend MUST verify task belongs to authenticated user
- Return 404 (not 403) to prevent user enumeration

---

### Update Task

**Endpoint**: `PUT /api/tasks/{id}`
**Authentication**: Required
**Description**: Update task title and/or description

**Path Parameters**:
- `id`: Task ID (integer)

**Request Body** (all fields required in PUT):
```json
{
  "title": "Updated task title",
  "description": "Updated description text"
}
```

**Request Validation**:
- `title`: Required, 1-200 characters
- `description`: Optional, 0-1000 characters (can be null)

**Success Response** (200 OK):
```json
{
  "id": 1,
  "title": "Updated task title",
  "description": "Updated description text",
  "completed": false,
  "created_at": "2026-01-08T10:30:00Z",
  "updated_at": "2026-01-08T14:45:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Missing or invalid JWT token
- `404 Not Found`: Task does not exist OR task belongs to different user

**Notes**:
- Backend MUST verify task belongs to authenticated user
- `updated_at` timestamp automatically updated
- `completed` status NOT affected (use PATCH endpoint)
- Full replacement semantics (PUT) - must provide all fields

---

### Toggle Task Completion

**Endpoint**: `PATCH /api/tasks/{id}/complete`
**Authentication**: Required
**Description**: Toggle task completion status

**Path Parameters**:
- `id`: Task ID (integer)

**Request Body** (optional - if empty, toggles current state):
```json
{
  "completed": true
}
```

**Alternative**: Empty body toggles current state

**Success Response** (200 OK):
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for Phase II",
  "completed": true,
  "created_at": "2026-01-08T10:30:00Z",
  "updated_at": "2026-01-08T15:00:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT token
- `404 Not Found`: Task does not exist OR task belongs to different user

**Notes**:
- Backend MUST verify task belongs to authenticated user
- `updated_at` timestamp automatically updated
- If body contains `completed` boolean, sets to that value explicitly
- If body empty, toggles current state (false → true, true → false)

---

### Delete Task

**Endpoint**: `DELETE /api/tasks/{id}`
**Authentication**: Required
**Description**: Permanently delete task

**Path Parameters**:
- `id`: Task ID (integer)

**Request Body**: None

**Success Response** (204 No Content):
```
(Empty body)
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT token
- `404 Not Found`: Task does not exist OR task belongs to different user

**Notes**:
- Backend MUST verify task belongs to authenticated user
- Deletion is permanent - no soft delete or trash
- Idempotent - deleting already deleted task returns 404

---

## Data Filtering & Security

### Ownership Enforcement

ALL task endpoints MUST filter by authenticated user:

```
WHERE user_id = <user_id_from_jwt>
```

This ensures:
- Users can ONLY see their own tasks
- Users can ONLY modify their own tasks
- No cross-user data leakage

### JWT Verification Flow

1. Extract `Authorization` header from request
2. Verify header format: `Bearer <token>`
3. Verify JWT signature using `BETTER_AUTH_SECRET`
4. Verify token not expired (`exp` claim)
5. Extract `user_id` from token claims
6. Use `user_id` for all database queries

### Error Response Security

- Use 404 (not 403) when task not found to prevent user enumeration
- Generic error messages for authentication failures ("Invalid email or password")
- No stack traces or internal details in error responses

## Rate Limiting (Optional for MVP)

Recommended rate limits for production:
- Authentication endpoints: 5 requests/minute per IP
- Task endpoints: 100 requests/minute per user
- Global: 1000 requests/minute per IP

## CORS Configuration

For local development:
- Allow `http://localhost:3000` (Next.js frontend)
- Allow credentials for cookies (if using httpOnly cookies)

For production:
- Allow specific production domain only
- Enable HTTPS-only

## Example Full Request Flow

### Creating a Task

**Request**:
```http
POST /api/tasks HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Review API specification",
  "description": "Ensure all endpoints are documented"
}
```

**Response**:
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 42,
  "title": "Review API specification",
  "description": "Ensure all endpoints are documented",
  "completed": false,
  "created_at": "2026-01-08T16:20:00Z",
  "updated_at": "2026-01-08T16:20:00Z"
}
```

## Endpoint Summary Table

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create user account |
| POST | `/api/auth/login` | No | Authenticate and receive JWT |
| POST | `/api/auth/logout` | Yes | End session |
| GET | `/api/tasks` | Yes | List user's tasks |
| POST | `/api/tasks` | Yes | Create new task |
| GET | `/api/tasks/{id}` | Yes | Get task by ID |
| PUT | `/api/tasks/{id}` | Yes | Update task title/description |
| PATCH | `/api/tasks/{id}/complete` | Yes | Toggle task completion |
| DELETE | `/api/tasks/{id}` | Yes | Delete task |

## Implementation Notes

- All endpoints return JSON
- Timestamps use ISO 8601 format with UTC timezone
- IDs are integers (auto-incrementing primary keys)
- Boolean values are lowercase (`true`, `false`)
- Null values represented as `null` (not omitted)
- Empty strings distinct from null
- Backend validates all inputs server-side (never trust client)
- Frontend should validate for UX but backend is source of truth
