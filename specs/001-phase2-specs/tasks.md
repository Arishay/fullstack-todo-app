---

description: "Task list for Phase II Todo Web Application implementation"
---

# Tasks: Phase II Todo Web Application

**Input**: Design documents from `/specs/001-phase2-specs/`
**Prerequisites**: plan.md (complete), spec.md (not present as single file - divided into features/), research.md (complete), data-model.md (complete), contracts/ (complete)

**Tests**: Tests are NOT explicitly requested in feature specifications. Test tasks OMITTED per template guidelines.

**Organization**: Tasks are grouped by implementation phase following backend-first dependency order. User stories are implemented after foundational infrastructure is complete.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., AUTH-US1, TASK-US1, etc.)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Backend structure: `backend/src/{models,schemas,services,api,core}/`
- Frontend structure: `frontend/src/{app,components,lib}/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend project structure (backend/src with models, schemas, services, api, core subdirectories)
- [X] T002 [P] Initialize Python project with pyproject.toml (dependencies: fastapi, sqlmodel, asyncpg, python-jose, passlib, uvicorn)
- [X] T003 [P] Create frontend project structure (frontend/src with app, components, lib subdirectories)
- [X] T004 [P] Initialize Next.js 16 project with TypeScript in frontend/ directory
- [X] T005 [P] Configure Tailwind CSS in frontend/tailwind.config.ts and frontend/src/app/globals.css
- [X] T006 Create root .env.example with BETTER_AUTH_SECRET, DATABASE_URL, CORS_ORIGINS placeholders

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Configure database engine and async session in backend/src/core/database.py (asyncpg, create_async_engine, async_sessionmaker)
- [X] T008 [P] Configure application settings in backend/src/core/config.py (load DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS from environment)
- [X] T009 [P] Implement JWT utilities in backend/src/core/security.py (verify_token function using python-jose, password hashing with passlib bcrypt)
- [X] T010 Initialize FastAPI app in backend/src/main.py (app creation, CORS middleware, route registration placeholder)
- [X] T011 Create database migration script in backend/migrations/001_initial_schema.py (users and tasks tables per @specs/001-phase2-specs/database/schema.md)
- [X] T012 [P] Configure Better Auth in frontend/lib/auth.ts (JWT plugin, shared BETTER_AUTH_SECRET)
- [X] T013 [P] Implement centralized API client in frontend/lib/api-client.ts (fetch wrapper, JWT attachment, 401 handling)
- [X] T014 [P] Create Next.js middleware in frontend/middleware.ts (route protection, auth redirects)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story AUTH-US1 - User Registration (Priority: P1) 🎯 MVP

**Goal**: Enable new users to create accounts with email and password

**Independent Test**: User can navigate to signup page, enter email and password (8+ chars), submit form, and receive account creation confirmation

**Spec References**:
- @specs/001-phase2-specs/features/authentication.md (User Story 1)
- @specs/001-phase2-specs/api/rest-endpoints.md (POST /api/auth/register)
- @specs/001-phase2-specs/database/schema.md (users table)

### Implementation for AUTH-US1

- [X] T015 [P] [AUTH-US1] Create User model in backend/src/models/user.py (SQLModel with UUID PK, email unique, password_hash, timestamps)
- [X] T016 [P] [AUTH-US1] Create auth request/response schemas in backend/src/schemas/auth.py (RegisterRequest, LoginRequest, TokenResponse)
- [X] T017 [AUTH-US1] Implement auth service in backend/src/services/auth.py (register_user function: validate email, hash password, create user, check duplicates)
- [X] T018 [AUTH-US1] Implement POST /api/auth/register endpoint in backend/src/api/auth.py (FastAPI route, call auth service, return user_id and email)
- [X] T019 [P] [AUTH-US1] Create SignupForm component in frontend/components/auth/SignupForm.tsx (Client Component, email/password inputs, validation, error display)
- [X] T020 [AUTH-US1] Create signup page in frontend/app/signup/page.tsx (Server Component wrapper for SignupForm, calls register API)
- [X] T021 [AUTH-US1] Register auth routes in backend/src/main.py (include auth router from api/auth.py)

**Checkpoint**: At this point, User Story AUTH-US1 should be fully functional and testable independently

---

## Phase 4: User Story AUTH-US2 - User Login (Priority: P1) 🎯 MVP

**Goal**: Enable registered users to authenticate with email and password, receiving JWT token

**Independent Test**: User can navigate to login page, enter registered credentials, submit, and receive JWT token with redirect to task list

**Spec References**:
- @specs/001-phase2-specs/features/authentication.md (User Story 2)
- @specs/001-phase2-specs/api/rest-endpoints.md (POST /api/auth/login)
- @specs/001-phase2-specs/research.md (JWT HS256 algorithm)

### Implementation for AUTH-US2

- [X] T022 [AUTH-US2] Extend auth service in backend/src/services/auth.py (login_user function: verify password, generate JWT with user_id claim, 24hr expiration)
- [X] T023 [AUTH-US2] Implement POST /api/auth/login endpoint in backend/src/api/auth.py (FastAPI route, call login service, return TokenResponse)
- [X] T024 [P] [AUTH-US2] Create LoginForm component in frontend/components/auth/LoginForm.tsx (Client Component, email/password inputs, error display)
- [X] T025 [AUTH-US2] Create login page in frontend/app/login/page.tsx (Server Component wrapper for LoginForm, calls login API, stores JWT)

**Checkpoint**: At this point, User Stories AUTH-US1 AND AUTH-US2 should both work independently

---

## Phase 5: User Story AUTH-US5 - Protected Route Access (Priority: P1) 🎯 MVP

**Goal**: Redirect unauthenticated users to login when accessing protected routes

**Independent Test**: Unauthenticated user attempts to navigate to /tasks and is immediately redirected to /login

**Spec References**:
- @specs/001-phase2-specs/features/authentication.md (User Story 5)
- @specs/001-phase2-specs/research.md (Next.js middleware patterns)

### Implementation for AUTH-US5

- [X] T026 [AUTH-US5] Implement get_current_user dependency in backend/src/api/deps.py (FastAPI Depends, extract JWT from Authorization header, verify token, extract user_id, raise 401 if invalid)
- [X] T027 [AUTH-US5] Update Next.js middleware in frontend/middleware.ts (check auth token cookie, redirect /tasks → /login if no token, redirect /login → /tasks if has token)
- [X] T028 [P] [AUTH-US5] Create Header component in frontend/components/layout/Header.tsx (Server Component, display app name, logout button if authenticated)
- [X] T029 [P] [AUTH-US5] Create PageContainer component in frontend/components/layout/PageContainer.tsx (Server Component, responsive padding and max-width)

**Checkpoint**: Authentication foundation complete - all auth flows working

---

## Phase 6: User Story TASK-US1 - Create New Task (Priority: P1) 🎯 MVP

**Goal**: Enable authenticated users to create tasks with title (required) and description (optional)

**Independent Test**: Authenticated user can open task creation interface, enter title (1-200 chars), optionally add description (0-1000 chars), submit, and see new task in list

**Spec References**:
- @specs/001-phase2-specs/features/task-crud.md (User Story 1)
- @specs/001-phase2-specs/api/rest-endpoints.md (POST /api/tasks)
- @specs/001-phase2-specs/database/schema.md (tasks table)

### Implementation for TASK-US1

- [ ] T030 [P] [TASK-US1] Create Task model in backend/src/models/task.py (SQLModel with int PK, user_id FK, title 1-200, description 0-1000, completed bool default False, timestamps)
- [ ] T031 [P] [TASK-US1] Create task request/response schemas in backend/src/schemas/task.py (CreateTaskRequest, UpdateTaskRequest, TaskResponse)
- [ ] T032 [TASK-US1] Implement task service in backend/src/services/task.py (create_task function: validate input, associate with user_id, persist to DB)
- [ ] T033 [TASK-US1] Implement POST /api/tasks endpoint in backend/src/api/tasks.py (FastAPI route, use get_current_user dependency, call task service)
- [ ] T034 [P] [TASK-US1] Create TaskForm component in frontend/src/components/tasks/TaskForm.tsx (Client Component, title/description inputs, character counters, validation)
- [ ] T035 [TASK-US1] Update task list page in frontend/src/app/tasks/page.tsx (Server Component, fetch tasks server-side, render TaskList, include create button)
- [ ] T036 [TASK-US1] Register task routes in backend/src/main.py (include tasks router from api/tasks.py)

**Checkpoint**: Users can now create tasks - first user-facing value delivered

---

## Phase 7: User Story TASK-US2 - View All Tasks (Priority: P1) 🎯 MVP

**Goal**: Display list of all tasks owned by authenticated user, with NO tasks from other users visible

**Independent Test**: Authenticated user views task list and sees only their tasks (title, completion status, created date), with visual distinction between completed/incomplete

**Spec References**:
- @specs/001-phase2-specs/features/task-crud.md (User Story 2)
- @specs/001-phase2-specs/api/rest-endpoints.md (GET /api/tasks)
- @specs/001-phase2-specs/ui/pages.md (Task List Page)

### Implementation for TASK-US2

- [ ] T037 [TASK-US2] Extend task service in backend/src/services/task.py (get_user_tasks function: query tasks filtered by user_id, support completed filter, order by created_at DESC)
- [ ] T038 [TASK-US2] Implement GET /api/tasks endpoint in backend/src/api/tasks.py (use get_current_user dependency, call get_user_tasks, return TaskListResponse)
- [ ] T039 [P] [TASK-US2] Create TaskList component in frontend/src/components/tasks/TaskList.tsx (Server Component, render array of TaskItem components, empty state if no tasks)
- [ ] T040 [P] [TASK-US2] Create TaskItem component in frontend/src/components/tasks/TaskItem.tsx (Client Component, display title/description/status, edit/delete buttons, links to detail page)
- [ ] T041 [TASK-US2] Integrate TaskList in task list page frontend/src/app/tasks/page.tsx (fetch tasks via API client, pass to TaskList component)

**Checkpoint**: MVP complete - users can register, login, create tasks, and view their task list

---

## Phase 8: User Story TASK-US6 - Toggle Task Completion (Priority: P1)

**Goal**: Enable users to mark tasks as completed or incomplete with visual distinction

**Independent Test**: User clicks checkbox on incomplete task → task marked complete with visual change (strikethrough/checkmark), click again → reverts to incomplete

**Spec References**:
- @specs/001-phase2-specs/features/task-crud.md (User Story 6)
- @specs/001-phase2-specs/api/rest-endpoints.md (PATCH /api/tasks/{id}/complete)

### Implementation for TASK-US6

- [ ] T042 [TASK-US6] Extend task service in backend/src/services/task.py (toggle_task_completion function: verify ownership, flip completed boolean, update updated_at)
- [ ] T043 [TASK-US6] Implement PATCH /api/tasks/{id}/complete endpoint in backend/src/api/tasks.py (use get_current_user, call toggle service, return updated task)
- [ ] T044 [P] [TASK-US6] Create TaskCheckbox component in frontend/src/components/tasks/TaskCheckbox.tsx (Client Component, controlled checkbox, optimistic update, API call on change)
- [ ] T045 [TASK-US6] Integrate TaskCheckbox into TaskItem component in frontend/src/components/tasks/TaskItem.tsx (render checkbox, strikethrough title if completed)

**Checkpoint**: Core task management complete (create, view, complete)

---

## Phase 9: User Story TASK-US3 - View Single Task Detail (Priority: P2)

**Goal**: Display full task details including complete description, timestamps, and metadata

**Independent Test**: User selects task from list, views full details (title, description, completion status, created/updated dates), cannot access other users' tasks (404)

**Spec References**:
- @specs/001-phase2-specs/features/task-crud.md (User Story 3)
- @specs/001-phase2-specs/api/rest-endpoints.md (GET /api/tasks/{id})
- @specs/001-phase2-specs/ui/pages.md (Task Detail Page)

### Implementation for TASK-US3

- [ ] T046 [TASK-US3] Extend task service in backend/src/services/task.py (get_task_by_id function: query task by ID and user_id, return 404 if not found or not owned)
- [ ] T047 [TASK-US3] Implement GET /api/tasks/{id} endpoint in backend/src/api/tasks.py (use get_current_user, call get_task_by_id, return TaskResponse or 404)
- [ ] T048 [TASK-US3] Create task detail page in frontend/src/app/tasks/[id]/page.tsx (Server Component, fetch task by ID, render TaskForm in view mode with all details)

**Checkpoint**: Task detail view functional

---

## Phase 10: User Story TASK-US4 - Update Task (Priority: P2)

**Goal**: Allow users to edit task title and description, with validation and ownership enforcement

**Independent Test**: User opens task detail, modifies title/description, saves, sees updated information immediately, cannot edit other users' tasks (403)

**Spec References**:
- @specs/001-phase2-specs/features/task-crud.md (User Story 4)
- @specs/001-phase2-specs/api/rest-endpoints.md (PUT /api/tasks/{id})

### Implementation for TASK-US4

- [ ] T049 [TASK-US4] Extend task service in backend/src/services/task.py (update_task function: verify ownership, validate title/description, update fields, save to DB)
- [ ] T050 [TASK-US4] Implement PUT /api/tasks/{id} endpoint in backend/src/api/tasks.py (use get_current_user, call update service, return updated task or 403/404)
- [ ] T051 [TASK-US4] Update TaskForm component in frontend/src/components/tasks/TaskForm.tsx (add edit mode, save button, handle PUT request via API client)
- [ ] T052 [TASK-US4] Update task detail page in frontend/src/app/tasks/[id]/page.tsx (enable edit mode in TaskForm, handle save/cancel actions)

**Checkpoint**: Task editing functional

---

## Phase 11: User Story TASK-US5 - Delete Task (Priority: P2)

**Goal**: Permanently delete tasks with ownership verification (no soft delete)

**Independent Test**: User clicks delete on owned task, confirms deletion, task removed from list and database permanently, cannot delete other users' tasks (403)

**Spec References**:
- @specs/001-phase2-specs/features/task-crud.md (User Story 5)
- @specs/001-phase2-specs/api/rest-endpoints.md (DELETE /api/tasks/{id})

### Implementation for TASK-US5

- [ ] T053 [TASK-US5] Extend task service in backend/src/services/task.py (delete_task function: verify ownership, delete from DB permanently, no soft delete)
- [ ] T054 [TASK-US5] Implement DELETE /api/tasks/{id} endpoint in backend/src/api/tasks.py (use get_current_user, call delete service, return 204 No Content or 403/404)
- [ ] T055 [P] [TASK-US5] Create ConfirmDialog component in frontend/src/components/ui/ConfirmDialog.tsx (Client Component, modal with confirm/cancel, destructive action styling)
- [ ] T056 [TASK-US5] Integrate delete functionality in TaskItem component (delete button, ConfirmDialog, API call on confirm, remove from list on success)

**Checkpoint**: All task CRUD operations complete

---

## Phase 12: User Story AUTH-US3 - User Logout (Priority: P2)

**Goal**: Enable users to end session, clear JWT token, and redirect to login

**Independent Test**: User clicks logout button, token cleared, redirected to login, subsequent API requests return 401, protected pages inaccessible

**Spec References**:
- @specs/001-phase2-specs/features/authentication.md (User Story 3)
- @specs/001-phase2-specs/api/rest-endpoints.md (POST /api/auth/logout)

### Implementation for AUTH-US3

- [ ] T057 [AUTH-US3] Implement POST /api/auth/logout endpoint in backend/src/api/auth.py (stateless backend - endpoint for client-side token clearing, return success message)
- [ ] T058 [AUTH-US3] Add logout functionality to Header component in frontend/src/components/layout/Header.tsx (logout button, clear token, redirect to /login)

**Checkpoint**: Logout functional

---

## Phase 13: User Story AUTH-US4 - Session Persistence (Priority: P2)

**Goal**: Maintain login state across page refreshes and browser sessions (within token expiry)

**Independent Test**: User logs in, refreshes page → still logged in, closes/reopens browser (within 24hrs) → still logged in, after token expiry → prompted to re-login

**Spec References**:
- @specs/001-phase2-specs/features/authentication.md (User Story 4)
- @specs/001-phase2-specs/research.md (JWT expiration 24 hours)

### Implementation for AUTH-US4

- [ ] T059 [AUTH-US4] Update Better Auth config in frontend/src/lib/auth.ts (enable httpOnly cookie storage, set 24hr expiration)
- [ ] T060 [AUTH-US4] Update API client in frontend/src/lib/api-client.ts (handle 401 by clearing stale token and redirecting to login)
- [ ] T061 [AUTH-US4] Test session persistence (manual verification: refresh, close/reopen browser, wait for expiry)

**Checkpoint**: Session persistence complete

---

## Phase 14: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality assurance

- [ ] T062 [P] Create remaining UI components in frontend/src/components/ui/ (Button.tsx, Input.tsx, TextArea.tsx, ErrorMessage.tsx, LoadingSpinner.tsx, Modal.tsx)
- [ ] T063 [P] Add form validation styling to all forms (error states, success states, disabled states)
- [ ] T064 [P] Implement responsive design breakpoints for all pages (mobile 320px+, tablet 768px+, desktop 1024px+)
- [ ] T065 [P] Add loading states to all async operations (spinners, skeleton screens)
- [ ] T066 [P] Improve error handling across all API calls (user-friendly messages, retry buttons)
- [ ] T067 Create quickstart validation script (verify DATABASE_URL connects, BETTER_AUTH_SECRET matches, ports available)
- [ ] T068 [P] Add ARIA labels and accessibility attributes to all interactive elements
- [ ] T069 [P] Create backend README.md (setup instructions, API docs link, environment variables)
- [ ] T070 [P] Create frontend README.md (setup instructions, component structure, development commands)
- [ ] T071 Run end-to-end validation per specs/001-phase2-specs/quickstart.md (register → login → create task → view → complete → edit → delete → logout)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-13)**: All depend on Foundational phase completion
  - AUTH-US1, AUTH-US2, AUTH-US5 should complete first (authentication foundation)
  - TASK-US1, TASK-US2, TASK-US6 follow (core task operations - MVP)
  - TASK-US3, TASK-US4, TASK-US5 can proceed after core tasks (enhancements)
  - AUTH-US3, AUTH-US4 can be done anytime after AUTH-US1/US2 (nice-to-have)
- **Polish (Phase 14)**: Depends on all desired user stories being complete

### Critical Path (Must Execute Sequentially)

1. Phase 1 (Setup) → Phase 2 (Foundational) → Phase 3 (AUTH-US1) → Phase 4 (AUTH-US2) → Phase 5 (AUTH-US5)
2. Then Phase 6 (TASK-US1) → Phase 7 (TASK-US2) → Phase 8 (TASK-US6)
3. Phases 9-13 can proceed in any order after critical path
4. Phase 14 (Polish) finalizes

### User Story Dependencies

- **AUTH-US1**: No dependencies (can start after Foundational)
- **AUTH-US2**: Depends on AUTH-US1 (needs User model and register functionality)
- **AUTH-US5**: Depends on AUTH-US2 (needs JWT generation and login)
- **TASK-US1**: Depends on AUTH-US5 (needs authentication working)
- **TASK-US2**: Depends on TASK-US1 (needs Task model and create functionality)
- **TASK-US6**: Depends on TASK-US2 (needs task list display)
- **TASK-US3**: Depends on TASK-US1 (needs Task model)
- **TASK-US4**: Depends on TASK-US3 (uses same detail page)
- **TASK-US5**: Depends on TASK-US2 (deletes from list)
- **AUTH-US3**: Depends on AUTH-US2 (needs logout from logged-in state)
- **AUTH-US4**: Depends on AUTH-US2 (extends session management)

### Parallel Opportunities

- Within Phase 1 (Setup): T002, T003, T004, T005 can all run in parallel
- Within Phase 2 (Foundational): T008, T009, T012, T013, T014 can run in parallel
- Within each User Story phase: Model tasks marked [P] can run in parallel

**Example - Phase 3 (AUTH-US1)**:
```bash
# Can run in parallel:
T015 [P] Create User model
T016 [P] Create auth schemas
T019 [P] Create SignupForm component

# Then sequentially:
T017 → T018 → T020 → T021
```

---

## Parallel Example: Foundational Phase

```bash
# Launch in parallel (different files, no dependencies):
T007: Database engine setup (backend/src/core/database.py)
T008: Settings config (backend/src/core/config.py)
T009: JWT utilities (backend/src/core/security.py)
T012: Better Auth config (frontend/src/lib/auth.ts)
T013: API client (frontend/src/lib/api-client.ts)
T014: Middleware (frontend/src/middleware.ts)

# After parallel tasks complete:
T010: FastAPI app init (depends on T007, T008, T009)
T011: Database migrations (depends on T007)
```

---

## Implementation Strategy

### MVP First (Core User Stories Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phases 3-5: Authentication foundation (AUTH-US1, AUTH-US2, AUTH-US5)
4. Complete Phases 6-8: Core task operations (TASK-US1, TASK-US2, TASK-US6)
5. **STOP and VALIDATE**: Test MVP independently (register → login → create task → view list → toggle complete)
6. Deploy/demo if ready

**MVP Scope**: Phases 1-8 (71 tasks through T045)

### Incremental Delivery

1. MVP (Phases 1-8) → Test → Deploy
2. Add Phase 9 (TASK-US3: View Detail) → Test → Deploy
3. Add Phase 10 (TASK-US4: Update) → Test → Deploy
4. Add Phase 11 (TASK-US5: Delete) → Test → Deploy
5. Add Phases 12-13 (AUTH-US3/US4: Logout/Session) → Test → Deploy
6. Add Phase 14 (Polish) → Final QA → Production Deploy

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (Phases 1-2)
2. **Split after Foundational**:
   - Developer A: Backend auth (Phase 3-5 backend tasks)
   - Developer B: Frontend auth (Phase 3-5 frontend tasks)
   - Developer C: Start UI components (Phase 14 UI tasks)
3. **After auth complete**:
   - Developer A: Backend task API (Phase 6-8 backend tasks)
   - Developer B: Frontend task UI (Phase 6-8 frontend tasks)
   - Developer C: Continue polish/testing
4. **Final integration**: All developers test E2E scenarios

---

## Notes

- **[P] tasks** = different files, no dependencies - safe to parallelize
- **[Story] label** maps task to specific user story for traceability
- **MVP = Phases 1-8** (authentication + core task operations)
- Each user story should be independently completable and testable
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- **Total Tasks**: 71 (T001-T071)
- **MVP Tasks**: 45 (T001-T045)
- **Parallel Opportunities**: 23 tasks marked [P]

---

## Task Count Summary

- **Phase 1 (Setup)**: 6 tasks (T001-T006)
- **Phase 2 (Foundational)**: 8 tasks (T007-T014)
- **Phase 3 (AUTH-US1)**: 7 tasks (T015-T021)
- **Phase 4 (AUTH-US2)**: 4 tasks (T022-T025)
- **Phase 5 (AUTH-US5)**: 4 tasks (T026-T029)
- **Phase 6 (TASK-US1)**: 7 tasks (T030-T036)
- **Phase 7 (TASK-US2)**: 5 tasks (T037-T041)
- **Phase 8 (TASK-US6)**: 4 tasks (T042-T045) **← MVP ENDS HERE**
- **Phase 9 (TASK-US3)**: 3 tasks (T046-T048)
- **Phase 10 (TASK-US4)**: 4 tasks (T049-T052)
- **Phase 11 (TASK-US5)**: 4 tasks (T053-T056)
- **Phase 12 (AUTH-US3)**: 2 tasks (T057-T058)
- **Phase 13 (AUTH-US4)**: 3 tasks (T059-T061)
- **Phase 14 (Polish)**: 10 tasks (T062-T071)

**Total**: 71 tasks
**Parallelizable**: 23 tasks marked [P]
**MVP Scope**: First 45 tasks (Phases 1-8)
