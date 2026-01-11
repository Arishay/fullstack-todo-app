# UI Specification: Components

**Feature Branch**: `001-phase2-specs`
**Created**: 2026-01-08
**Status**: Draft

## Overview

This document defines reusable UI components for the Phase II Todo application. Components follow React best practices with Server Components as default and Client Components only when interactivity is required.

**Component Philosophy**:
- Composable and reusable
- Single responsibility
- Props-driven configuration
- Accessible by default
- Styled with Tailwind CSS only

## Component Categories

1. **Authentication Components**: Forms for login and signup
2. **Task Components**: Task display, creation, and management
3. **Layout Components**: Navigation, headers, containers
4. **Utility Components**: Buttons, inputs, modals, error displays

---

## Authentication Components

### Component: LoginForm

**Type**: Client Component (form interactivity required)
**Location**: `components/auth/LoginForm.tsx`

**Purpose**: Capture user credentials for authentication

**Props**:
```typescript
interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}
```

**Structure**:
- Email input field
- Password input field
- Submit button
- Error message display
- Link to signup page

**Behavior**:
- Client-side validation before submission
- Displays loading state during authentication
- Shows error messages from server
- Clears form on successful login
- Keyboard accessible (Enter to submit)

**Styling Requirements**:
- Consistent with app theme
- Focus visible on inputs
- Error state styling (red border on invalid inputs)
- Disabled state for loading

---

### Component: SignupForm

**Type**: Client Component
**Location**: `components/auth/SignupForm.tsx`

**Purpose**: Capture new user registration details

**Props**:
```typescript
interface SignupFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}
```

**Structure**:
- Email input field
- Password input field
- Confirm password input field (optional)
- Submit button
- Error message display
- Link to login page
- Password requirements helper text

**Behavior**:
- Real-time validation (email format, password length)
- Password confirmation matching
- Displays loading state
- Shows error messages from server
- Clears form on successful signup

**Styling Requirements**:
- Match LoginForm styling
- Helper text below password field
- Character count for password

---

## Task Components

### Component: TaskList

**Type**: Server Component (fetches data) containing Client Component children
**Location**: `components/tasks/TaskList.tsx`

**Purpose**: Display list of user's tasks

**Props**:
```typescript
interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: number) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
  emptyMessage?: string;
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}
```

**Structure**:
- List container
- TaskItem components for each task
- Empty state when no tasks
- Loading skeleton (optional)

**Behavior**:
- Renders all tasks in order
- Passes interaction handlers to child TaskItem components
- Shows empty state if tasks array is empty
- Server Component can fetch initial data

**Styling Requirements**:
- Responsive grid or list layout
- Adequate spacing between items
- Consistent card styling

---

### Component: TaskItem

**Type**: Client Component (interactive checkbox and buttons)
**Location**: `components/tasks/TaskItem.tsx`

**Purpose**: Display single task with actions

**Props**:
```typescript
interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: number) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}
```

**Structure**:
- Checkbox for completion toggle
- Task title (clickable link to detail page)
- Description preview (truncated)
- Created timestamp
- Edit button/link
- Delete button

**Behavior**:
- Checkbox toggles completion optimistically
- Title links to `/tasks/[id]`
- Delete button shows confirmation dialog
- Optimistic UI updates with rollback on error
- Hover effects on interactive elements

**Styling Requirements**:
- Card or row layout
- Strikethrough title when completed
- Muted text for completed tasks
- Hover state visible
- Action buttons aligned right

---

### Component: TaskForm

**Type**: Client Component
**Location**: `components/tasks/TaskForm.tsx`

**Purpose**: Create or edit task

**Props**:
```typescript
interface TaskFormProps {
  initialData?: Partial<Task>;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

interface TaskFormData {
  title: string;
  description: string | null;
  completed?: boolean;
}
```

**Structure**:
- Title input field
- Description textarea
- Completion toggle (for edit mode)
- Character counters
- Submit button
- Cancel button (optional)

**Behavior**:
- Pre-fills data if editing existing task
- Real-time character counting
- Client-side validation
- Displays loading state during submission
- Shows validation errors inline

**Styling Requirements**:
- Large, clear input fields
- Character counter below each field
- Validation error styling
- Disabled state during loading

---

### Component: TaskCheckbox

**Type**: Client Component
**Location**: `components/tasks/TaskCheckbox.tsx`

**Purpose**: Toggle task completion status

**Props**:
```typescript
interface TaskCheckboxProps {
  taskId: number;
  completed: boolean;
  onChange: (taskId: number, completed: boolean) => Promise<void>;
  disabled?: boolean;
}
```

**Structure**:
- Checkbox input
- Label (screen reader only)

**Behavior**:
- Optimistic update on toggle
- Reverts on API failure
- Disabled during API call
- Accessible label

**Styling Requirements**:
- Custom styled checkbox (Tailwind)
- Checkmark visible when completed
- Hover and focus states
- Disabled state (grayed out)

---

## Layout Components

### Component: Header

**Type**: Server Component
**Location**: `components/layout/Header.tsx`

**Purpose**: Application header with navigation

**Props**:
```typescript
interface HeaderProps {
  title?: string;
  showLogout?: boolean;
  showNewTask?: boolean;
}
```

**Structure**:
- App logo/name
- Page title (optional)
- New Task button (if authenticated page)
- Logout button (if authenticated page)

**Behavior**:
- Static content, no interactivity in Server Component
- Logout button can be Client Component child

**Styling Requirements**:
- Fixed or sticky positioning
- Responsive (hamburger menu on mobile optional)
- Consistent brand colors

---

### Component: PageContainer

**Type**: Server Component
**Location**: `components/layout/PageContainer.tsx`

**Purpose**: Consistent page wrapper with padding and max-width

**Props**:
```typescript
interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}
```

**Structure**:
- Main content wrapper
- Responsive padding
- Centered layout

**Behavior**:
- Wraps page content
- Applies consistent spacing

**Styling Requirements**:
- Responsive padding (mobile: 4, tablet: 6, desktop: 8)
- Max-width constraints
- Centered horizontally

---

## Utility Components

### Component: Button

**Type**: Client Component (if interactive) or Server Component (if just styled link)
**Location**: `components/ui/Button.tsx`

**Purpose**: Reusable button with consistent styling

**Props**:
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}
```

**Variants**:
- **Primary**: Prominent call-to-action (colored background)
- **Secondary**: Less prominent (outline or muted background)
- **Destructive**: Dangerous actions like delete (red)
- **Ghost**: Minimal styling, text-only

**Behavior**:
- Shows spinner when loading
- Disabled state prevents clicks
- Keyboard accessible
- Focus visible

**Styling Requirements**:
- Consistent sizing across variants
- Hover and active states
- Loading spinner replaces text
- Disabled state (opacity + cursor)

---

### Component: Input

**Type**: Client Component (for controlled inputs)
**Location**: `components/ui/Input.tsx`

**Purpose**: Reusable text input field

**Props**:
```typescript
interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  disabled?: boolean;
}
```

**Structure**:
- Label element
- Input field
- Error message (if error prop provided)
- Helper text (optional)
- Character counter (if maxLength provided)

**Behavior**:
- Controlled input (value from props)
- Calls onChange on input
- Shows error state styling if error present
- Displays character count if maxLength set

**Styling Requirements**:
- Label above input
- Error state (red border + red error text below)
- Focus visible
- Disabled state
- Adequate padding in input field

---

### Component: TextArea

**Type**: Client Component
**Location**: `components/ui/TextArea.tsx`

**Purpose**: Multi-line text input

**Props**:
```typescript
interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
}
```

**Structure**:
- Label element
- Textarea field
- Error message
- Character counter

**Behavior**:
- Same as Input component
- Auto-resize option (optional enhancement)

**Styling Requirements**:
- Match Input component styling
- Minimum height (rows prop)
- Resize vertical allowed

---

### Component: Modal

**Type**: Client Component
**Location**: `components/ui/Modal.tsx`

**Purpose**: Dialog overlay for confirmations and forms

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

**Structure**:
- Backdrop overlay (semi-transparent)
- Modal container (centered)
- Header with title and close button
- Content area (children)
- Footer (optional, for action buttons)

**Behavior**:
- Opens/closes based on isOpen prop
- Clicking backdrop closes modal (calls onClose)
- Escape key closes modal
- Focus trapped within modal
- Body scroll locked when open

**Styling Requirements**:
- Backdrop: Dark overlay (bg-black/50)
- Modal: White card, rounded corners, shadow
- Close button: X icon in top-right
- Responsive width (full-width on mobile, max-width on desktop)

---

### Component: ErrorMessage

**Type**: Server Component or Client Component
**Location**: `components/ui/ErrorMessage.tsx`

**Purpose**: Display error messages consistently

**Props**:
```typescript
interface ErrorMessageProps {
  message: string | null;
  variant?: 'inline' | 'toast' | 'banner';
}
```

**Structure**:
- Error container
- Error icon (optional)
- Error text

**Behavior**:
- Only renders if message is not null
- Different layouts for different variants
- Toast variant auto-dismisses after 5 seconds (optional)

**Styling Requirements**:
- Red/error color
- Error icon (⚠️ or similar)
- Adequate padding
- **Inline**: Below field
- **Toast**: Fixed position, top-right
- **Banner**: Full-width at top of page

---

### Component: LoadingSpinner

**Type**: Server or Client Component
**Location**: `components/ui/LoadingSpinner.tsx`

**Purpose**: Indicate loading state

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}
```

**Structure**:
- Animated spinner icon
- Optional label text

**Behavior**:
- Animated rotation
- Screen reader label

**Styling Requirements**:
- CSS animation or SVG animation
- Consistent brand color
- Sizes: sm (16px), md (24px), lg (48px)

---

### Component: ConfirmDialog

**Type**: Client Component
**Location**: `components/ui/ConfirmDialog.tsx`

**Purpose**: Confirmation dialog for destructive actions

**Props**:
```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}
```

**Structure**:
- Modal wrapper
- Title
- Message text
- Cancel button
- Confirm button

**Behavior**:
- Calls onConfirm when confirmed
- Calls onClose when cancelled or dismissed
- Disables buttons during async onConfirm
- Focus confirm button by default

**Styling Requirements**:
- Confirm button uses destructive styling for danger variant
- Cancel button secondary styling
- Clear visual hierarchy (message larger than buttons)

---

## Component Composition Examples

### Login Page Composition

```
<PageContainer maxWidth="sm">
  <Header title="Login" />
  <LoginForm
    onSubmit={handleLogin}
    error={loginError}
    isLoading={isLoggingIn}
  />
</PageContainer>
```

### Task List Page Composition

```
<PageContainer maxWidth="lg">
  <Header title="My Tasks" showLogout showNewTask />
  <TaskList
    tasks={userTasks}
    onToggleComplete={handleToggleComplete}
    onDelete={handleDelete}
    emptyMessage="No tasks yet. Create your first task!"
  />
</PageContainer>
```

### Task Edit Page Composition

```
<PageContainer maxWidth="md">
  <Header title="Edit Task" />
  <TaskForm
    initialData={existingTask}
    onSubmit={handleUpdateTask}
    onCancel={() => router.push('/tasks')}
    submitLabel="Save Changes"
    isLoading={isSaving}
  />
</PageContainer>
```

---

## Component Guidelines

### Server vs Client Components

**Use Server Components for**:
- Static content
- Data fetching
- Layout components without interactivity
- Initial page structure

**Use Client Components for**:
- Forms (controlled inputs)
- Event handlers (onClick, onChange)
- State management (useState, useEffect)
- Browser APIs (localStorage, etc.)
- Interactive animations

### Props Design

- Keep props simple and typed
- Use optional props with sensible defaults
- Avoid complex nested objects where possible
- Props should be serializable for Server Components

### Styling

- Tailwind utility classes only
- No inline styles
- Use consistent spacing scale (Tailwind spacing)
- Define colors in tailwind.config.ts
- Use semantic color names (primary, error, success)

### Accessibility

- All interactive elements keyboard accessible
- Proper ARIA labels where needed
- Focus visible indicators
- Screen reader text for icons
- Semantic HTML elements

### Performance

- Lazy load modals/dialogs
- Optimize re-renders (React.memo for expensive components)
- Use Server Components where possible to reduce JS bundle
- Avoid unnecessary client-side state

---

## Shared Component Library

Consider extracting these components to a shared `/components` directory:

```
/components
  /auth
    - LoginForm.tsx
    - SignupForm.tsx
  /tasks
    - TaskList.tsx
    - TaskItem.tsx
    - TaskForm.tsx
    - TaskCheckbox.tsx
  /layout
    - Header.tsx
    - PageContainer.tsx
  /ui
    - Button.tsx
    - Input.tsx
    - TextArea.tsx
    - Modal.tsx
    - ErrorMessage.tsx
    - LoadingSpinner.tsx
    - ConfirmDialog.tsx
```

---

## Constraints

- Server Components by default
- Client Components ONLY for interactivity ("use client" directive)
- Tailwind CSS only (no CSS modules, styled-components, or inline styles)
- TypeScript required for all components
- Props interfaces exported for reusability
- No external component libraries (build custom or use headless libraries like Radix UI)
