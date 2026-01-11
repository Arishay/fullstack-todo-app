# Feature Specification: User Authentication

**Feature Branch**: `001-phase2-specs`
**Created**: 2026-01-08
**Status**: Draft
**Input**: User description: "User authentication and authorization using Better Auth with JWT"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Registration (Priority: P1)

As a new user, I want to create an account with email and password so that I can securely access my personal task list.

**Why this priority**: Foundational requirement - users cannot use the application without an account. Must be implemented first.

**Independent Test**: User can navigate to signup page, enter email and password, submit form, and receive confirmation that account was created successfully.

**Acceptance Scenarios**:

1. **Given** user is on signup page, **When** user submits valid email and password (8+ characters), **Then** account is created and user is redirected to login page or automatically logged in
2. **Given** user is on signup page, **When** user submits email already registered, **Then** system returns error "Email already in use"
3. **Given** user is on signup page, **When** user submits invalid email format, **Then** system returns error "Please enter a valid email address"
4. **Given** user is on signup page, **When** user submits password shorter than 8 characters, **Then** system returns error "Password must be at least 8 characters"
5. **Given** user is on signup page, **When** user submits empty email or password, **Then** system returns error "Email and password are required"

---

### User Story 2 - User Login (Priority: P1)

As a registered user, I want to log in with my email and password so that I can access my tasks securely.

**Why this priority**: Core authentication flow - users must log in before accessing any task functionality. Critical path.

**Independent Test**: User can navigate to login page, enter registered credentials, submit, and gain access to authenticated areas of the application.

**Acceptance Scenarios**:

1. **Given** user has registered account, **When** user submits correct email and password, **Then** user is authenticated and redirected to task list page
2. **Given** user has registered account, **When** user submits incorrect password, **Then** system returns error "Invalid email or password"
3. **Given** user has registered account, **When** user submits non-existent email, **Then** system returns error "Invalid email or password" (no user enumeration)
4. **Given** user is already logged in, **When** user navigates to login page, **Then** user is redirected to task list page
5. **Given** user submits valid credentials, **When** authentication succeeds, **Then** JWT token is issued and stored securely client-side

---

### User Story 3 - User Logout (Priority: P2)

As a logged-in user, I want to log out so that I can end my session and protect my account on shared devices.

**Why this priority**: Important for security but not blocking initial development. Users can close browser as workaround.

**Independent Test**: User can click logout button/link, be logged out, and be redirected to login page. Subsequent API requests fail with 401 until re-authentication.

**Acceptance Scenarios**:

1. **Given** user is logged in, **When** user clicks logout, **Then** user session ends, JWT token is cleared, and user is redirected to login page
2. **Given** user is logged in, **When** user logs out, **Then** subsequent attempts to access protected pages redirect to login
3. **Given** user has logged out, **When** user attempts API requests with old token, **Then** backend returns 401 Unauthorized
4. **Given** user logs out, **When** user presses browser back button, **Then** protected pages are not accessible (no cached authenticated state)

---

### User Story 4 - Session Persistence (Priority: P2)

As a logged-in user, I want my session to persist across page refreshes and browser reopening so that I don't have to log in repeatedly.

**Why this priority**: Significantly improves user experience but not essential for MVP. Can be added after basic auth works.

**Independent Test**: User logs in, closes browser, reopens browser, navigates to application, and is still logged in (within token expiry window).

**Acceptance Scenarios**:

1. **Given** user is logged in, **When** user refreshes the page, **Then** user remains logged in
2. **Given** user is logged in, **When** user closes and reopens browser (within token expiry), **Then** user remains logged in
3. **Given** user is logged in, **When** JWT token expires, **Then** user is prompted to log in again on next API request
4. **Given** user's token is about to expire, **When** user is actively using application, **Then** token is refreshed automatically (optional enhancement - can be implemented as silent refresh or re-login prompt)

---

### User Story 5 - Protected Route Access (Priority: P1)

As an unauthenticated user, I want to be redirected to login when attempting to access protected pages so that I understand authentication is required.

**Why this priority**: Critical security control - prevents unauthorized access to application functionality.

**Independent Test**: Unauthenticated user attempts to navigate directly to task list URL and is immediately redirected to login page.

**Acceptance Scenarios**:

1. **Given** user is not logged in, **When** user attempts to access task list page, **Then** user is redirected to login page
2. **Given** user is not logged in, **When** user attempts to access task detail page, **Then** user is redirected to login page
3. **Given** user is not logged in, **When** user attempts to access task creation page, **Then** user is redirected to login page
4. **Given** user is not logged in, **When** user is redirected to login and then successfully logs in, **Then** user is redirected to originally requested page (optional enhancement)

---

### Edge Cases

- What happens when user's JWT token is tampered with? (Backend rejects with 401 Unauthorized, frontend redirects to login)
- What happens when JWT secret is rotated? (All existing tokens become invalid, all users must re-login)
- What happens when user tries to register with whitespace in email? (System trims whitespace before validation)
- What happens during concurrent login attempts from different devices? (Both sessions succeed - multiple active sessions allowed)
- What happens when user forgets password? (Out of scope for Phase II - manual admin reset or Phase III feature)
- What happens when network request fails during login? (Frontend displays error message, user can retry)
- What happens when backend is unavailable during authentication? (Frontend displays connection error, user can retry when backend recovers)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow new users to register with email address and password
- **FR-002**: System MUST validate email format and password strength (minimum 8 characters) on both frontend and backend
- **FR-003**: System MUST prevent duplicate account creation with same email address
- **FR-004**: System MUST hash passwords before storage (never store plaintext passwords)
- **FR-005**: System MUST allow registered users to log in with email and password
- **FR-006**: System MUST issue JWT token upon successful authentication
- **FR-007**: System MUST include `user_id` claim in JWT token payload
- **FR-008**: System MUST validate JWT signature using shared `BETTER_AUTH_SECRET` on backend
- **FR-009**: System MUST reject API requests without valid JWT token (401 Unauthorized)
- **FR-010**: System MUST reject API requests with expired JWT token (401 Unauthorized)
- **FR-011**: System MUST reject API requests with tampered JWT token (401 Unauthorized)
- **FR-012**: System MUST allow logged-in users to log out, clearing their client-side token
- **FR-013**: System MUST redirect unauthenticated users attempting to access protected routes to login page
- **FR-014**: System MUST maintain stateless backend - no server-side session storage
- **FR-015**: Frontend MUST attach JWT token to Authorization header for all API requests
- **FR-016**: Frontend MUST store JWT token securely (httpOnly cookie preferred, or secure localStorage with appropriate precautions)
- **FR-017**: System MUST use Better Auth library on frontend for authentication flows
- **FR-018**: Backend MUST extract `user_id` from verified JWT and use it for all data filtering

### Key Entities

- **User**: Represents a registered account
  - Has unique email address (used as login identifier)
  - Has hashed password (never plaintext)
  - Has unique user ID (used in JWT claims and task ownership)
  - Has account creation timestamp
  - Has last login timestamp (optional, for audit)

- **JWT Token**: Cryptographically signed authentication credential
  - Contains `user_id` claim (identifies authenticated user)
  - Contains `exp` claim (expiration timestamp)
  - Contains `iat` claim (issued at timestamp)
  - Signed with `BETTER_AUTH_SECRET` (shared between frontend auth system and backend)
  - Has configurable expiration time (default: 24 hours recommended)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete registration in under 30 seconds
- **SC-002**: Users can complete login in under 10 seconds
- **SC-003**: 100% of API requests without valid JWT are rejected (no unauthorized access)
- **SC-004**: 100% of passwords are hashed - zero plaintext passwords in database
- **SC-005**: JWT verification completes in under 50ms (p95)
- **SC-006**: Users remain authenticated across page refreshes until token expiry
- **SC-007**: Zero instances of user identity confusion (correct user_id extracted from JWT for all operations)
- **SC-008**: 95% of login attempts with correct credentials succeed on first try
- **SC-009**: Unauthenticated users cannot access any task data or operations

### Assumptions

- Email is sufficient identifier (no username or phone number required)
- Single factor authentication is sufficient (no 2FA/MFA in Phase II)
- Password reset functionality is out of scope (manual admin intervention if needed)
- Email verification is out of scope (users can access application immediately after registration)
- Account deletion/deactivation is out of scope for Phase II
- Password strength requirements are minimal (8+ characters only)
- Better Auth handles CSRF protection and other security best practices
- JWT expiration is acceptable UX - users will re-login when token expires (no automatic token refresh required for MVP)

## Constraints

- Authentication MUST use Better Auth library on frontend
- Authorization MUST use JWT tokens exclusively
- Backend MUST verify JWT using shared `BETTER_AUTH_SECRET` environment variable
- Backend MUST remain stateless - no server-side sessions, session stores, or cookies
- Frontend MUST NOT store sensitive user data beyond JWT token
- Passwords MUST be hashed using industry-standard algorithm (bcrypt, argon2, or scrypt)
- JWT tokens MUST include `user_id` claim for user identification
- All protected API endpoints MUST require valid JWT in Authorization header
- Frontend and backend MUST share the same `BETTER_AUTH_SECRET` value

## Security Considerations

- **Password Storage**: Use bcrypt/argon2 with appropriate cost factor
- **JWT Secret**: `BETTER_AUTH_SECRET` must be strong (32+ random characters), stored in `.env`, never committed
- **Token Expiration**: Set reasonable expiration (24 hours recommended for MVP)
- **HTTPS Only**: All authentication traffic MUST use HTTPS in production
- **No User Enumeration**: Login errors should not reveal whether email exists ("Invalid email or password" for both cases)
- **Input Validation**: Sanitize and validate all user inputs to prevent injection attacks
- **Rate Limiting**: Consider rate limiting login attempts (optional for MVP, recommended for production)

## Integration Points

- **Better Auth (Frontend)**: Handles authentication UI flows, token storage, session management
- **FastAPI Backend**: Verifies JWT, extracts user_id, enforces authorization
- **Database**: Stores user accounts with hashed passwords
- **Environment Variables**: `BETTER_AUTH_SECRET` shared between frontend and backend

## Token Flow

```
┌─────────────────┐
│  User Browser   │
└────────┬────────┘
         │ 1. Submit credentials
         ▼
┌─────────────────┐
│  Better Auth    │ 2. Validate credentials
│   (Frontend)    │ 3. Issue JWT with user_id
└────────┬────────┘
         │ 4. Store JWT securely
         │
         │ 5. Attach JWT to API requests
         ▼
┌─────────────────┐
│ FastAPI Backend │ 6. Verify JWT signature (BETTER_AUTH_SECRET)
│                 │ 7. Extract user_id from claims
│                 │ 8. Process request with user_id
└─────────────────┘
```
