# UI Specification: Pages

**Feature Branch**: `001-phase2-specs`
**Created**: 2026-01-08
**Status**: Draft

## Overview

This document defines the page-level structure and user interface requirements for the Phase II Todo web application. All pages follow Next.js App Router conventions with Server Components as default.

**Framework**: Next.js 16+ (App Router)
**Styling**: Tailwind CSS only (no inline styles)
**Component Model**: Server Components by default, Client Components only when interactivity required
**Routing**: File-system based routing per Next.js conventions

## General Page Requirements

### All Pages

- **Responsive Design**: Mobile-first, works on screens 320px to 4K+
- **Accessibility**: WCAG 2.1 AA compliance minimum
- **Loading States**: Show loading indicators for async operations
- **Error States**: Display user-friendly error messages
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **SEO**: Appropriate meta tags, titles, descriptions

### Performance Targets

- **First Contentful Paint**: <1.5 seconds
- **Time to Interactive**: <3 seconds
- **Lighthouse Score**: >90 across all metrics

## Page Inventory

1. Login Page (`/login`)
2. Signup Page (`/signup`)
3. Task List Page (`/tasks` or `/`) - protected
4. Task Detail/Edit Page (`/tasks/[id]`) - protected

---

## Page 1: Login Page

**Route**: `/login`
**Authentication**: Public (redirects to task list if already logged in)
**Component Type**: Mixture (Server Component wrapper, Client Component for form)

### Purpose
Allow registered users to authenticate and access their task list.

### Layout

```
┌─────────────────────────────────────────────┐
│                  Header                      │
│            "Todo App Login"                  │
├─────────────────────────────────────────────┤
│                                              │
│            ┌─────────────────┐              │
│            │   Login Form     │              │
│            │                  │              │
│            │  [Email Input]   │              │
│            │                  │              │
│            │  [Password]      │              │
│            │                  │              │
│            │  [Login Button]  │              │
│            │                  │              │
│            │  [Link: Signup]  │              │
│            └─────────────────┘              │
│                                              │
│          [Error Message Area]                │
│                                              │
└─────────────────────────────────────────────┘
```

### Content Elements

**Header**:
- App name/logo
- Centered or left-aligned
- Consistent across all pages

**Login Form**:
- **Email Input**:
  - Label: "Email"
  - Type: email
  - Placeholder: "you@example.com"
  - Required field indicator
  - Autocomplete: "email"
  - Validation: Email format

- **Password Input**:
  - Label: "Password"
  - Type: password
  - Placeholder: "Enter your password"
  - Required field indicator
  - Autocomplete: "current-password"
  - Show/hide password toggle (optional enhancement)

- **Login Button**:
  - Text: "Log In" or "Sign In"
  - Type: submit
  - Loading state: Disabled with spinner when submitting
  - Primary button styling (prominent)

- **Signup Link**:
  - Text: "Don't have an account? Sign up"
  - Links to `/signup`
  - Secondary text styling

**Error Message Area**:
- Displays authentication errors
- Visible only when error occurs
- Color: Red/error color from theme
- Example messages:
  - "Invalid email or password"
  - "Please enter a valid email address"
  - "Email and password are required"

### User Interactions

1. User enters email
2. User enters password
3. User clicks "Log In"
4. Form validates inputs (client-side)
5. If valid: Submit to backend API
6. If successful: Redirect to `/tasks`
7. If failed: Display error message

### States

**Default State**:
- Empty form fields
- Login button enabled
- No error message

**Loading State**:
- Login button disabled
- Spinner/loading indicator visible
- Form inputs disabled
- Text: "Logging in..."

**Error State**:
- Error message displayed above or below form
- Form inputs enabled
- Focus returns to first invalid field
- Error styling on invalid fields (red border)

**Success State**:
- Brief success message (optional)
- Immediate redirect to `/tasks`

### Validation Rules

- Email: Required, valid email format
- Password: Required, minimum 1 character (validation happens server-side)
- Both fields must be filled before submission

### Accessibility

- Form uses semantic HTML (`<form>`, `<label>`, `<input>`)
- Labels associated with inputs (for/id attributes)
- Error messages announced to screen readers (aria-live)
- Keyboard accessible (tab order, Enter to submit)
- Focus visible indicator

### Responsive Behavior

- **Mobile (320-640px)**: Full-width form, stacked layout
- **Tablet (641-1024px)**: Centered form, max-width 400px
- **Desktop (1025px+)**: Centered form, max-width 450px

---

## Page 2: Signup Page

**Route**: `/signup`
**Authentication**: Public (redirects to task list if already logged in)
**Component Type**: Mixture (Server Component wrapper, Client Component for form)

### Purpose
Allow new users to create an account.

### Layout

```
┌─────────────────────────────────────────────┐
│                  Header                      │
│          "Create Your Account"               │
├─────────────────────────────────────────────┤
│                                              │
│            ┌─────────────────┐              │
│            │   Signup Form    │              │
│            │                  │              │
│            │  [Email Input]   │              │
│            │                  │              │
│            │  [Password]      │              │
│            │                  │              │
│            │  [Confirm Pass]  │              │
│            │                  │              │
│            │  [Signup Button] │              │
│            │                  │              │
│            │  [Link: Login]   │              │
│            └─────────────────┘              │
│                                              │
│          [Error Message Area]                │
│                                              │
└─────────────────────────────────────────────┘
```

### Content Elements

**Header**:
- Text: "Create Your Account" or "Sign Up"
- Consistent styling with login page

**Signup Form**:
- **Email Input**:
  - Label: "Email"
  - Type: email
  - Placeholder: "you@example.com"
  - Required field indicator
  - Autocomplete: "email"
  - Validation: Email format, not already registered

- **Password Input**:
  - Label: "Password"
  - Type: password
  - Placeholder: "At least 8 characters"
  - Required field indicator
  - Autocomplete: "new-password"
  - Validation: Minimum 8 characters
  - Helper text: "Must be at least 8 characters"

- **Confirm Password Input** (optional but recommended):
  - Label: "Confirm Password"
  - Type: password
  - Placeholder: "Re-enter your password"
  - Validation: Matches password field

- **Signup Button**:
  - Text: "Create Account" or "Sign Up"
  - Type: submit
  - Loading state: Disabled with spinner when submitting
  - Primary button styling

- **Login Link**:
  - Text: "Already have an account? Log in"
  - Links to `/login`
  - Secondary text styling

**Error Message Area**:
- Displays registration errors
- Example messages:
  - "Email already in use"
  - "Password must be at least 8 characters"
  - "Passwords do not match"

### User Interactions

1. User enters email
2. User enters password (8+ characters)
3. User confirms password
4. User clicks "Create Account"
5. Form validates inputs
6. If valid: Submit to backend API
7. If successful: Redirect to `/login` or auto-login to `/tasks`
8. If failed: Display error message

### States

**Default State**:
- Empty form fields
- Signup button enabled
- Helper text visible for password requirements

**Loading State**:
- Signup button disabled
- Spinner visible
- Form inputs disabled
- Text: "Creating account..."

**Error State**:
- Error message displayed
- Form inputs enabled
- Focus on first invalid field

**Success State**:
- Success message: "Account created successfully!"
- Auto-redirect to login or tasks page

### Validation Rules

- Email: Required, valid format, not already registered
- Password: Required, minimum 8 characters
- Confirm Password: Must match password field
- Real-time validation feedback as user types

### Accessibility

- Same requirements as login page
- Password strength indicator (visual + screen reader accessible)
- Clear error messages for each field

### Responsive Behavior

- Same responsive behavior as login page

---

## Page 3: Task List Page

**Route**: `/tasks` or `/` (home page)
**Authentication**: Protected (requires JWT token)
**Component Type**: Server Component (list) + Client Components (interactive elements)

### Purpose
Display all user's tasks with ability to create, complete, and delete tasks inline.

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Header: "My Tasks"    [+ New Task]     [Logout]         │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  [Filter: All | Active | Completed]                      │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │ ☐ Task Title 1                    [Edit] [Delete]│    │
│  │   Brief description preview...                   │    │
│  │   Created: 2 hours ago                           │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │ ☑ Completed Task Title              [Edit] [Delete]│    │
│  │   Description preview (strikethrough)            │    │
│  │   Created: Yesterday                             │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │ ☐ Another Task                      [Edit] [Delete]│    │
│  │   No description                                 │    │
│  │   Created: 3 days ago                            │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  [Load More] (if pagination needed)                      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Content Elements

**Page Header**:
- Title: "My Tasks" or "Tasks"
- New Task Button: "+ New Task" or "Create Task"
  - Opens task creation modal or navigates to creation page
  - Primary action button
- Logout Button/Link
  - Positioned top-right
  - Secondary styling

**Filter Tabs** (optional enhancement):
- All (default)
- Active (incomplete tasks only)
- Completed (completed tasks only)
- Pill-style or tab-style buttons

**Task List**:
- Each task displayed as card/row
- For each task:
  - **Checkbox**: Toggle completion status
    - Unchecked for incomplete
    - Checked for completed
    - Client Component (interactive)
  - **Task Title**: Clickable, links to detail page
    - Strikethrough if completed
    - Truncate if too long (show full on hover or detail page)
  - **Description Preview**:
    - First 100 characters
    - Italic or secondary text color
    - "No description" if empty
  - **Created Timestamp**:
    - Relative time (e.g., "2 hours ago", "Yesterday")
    - Small, secondary text
  - **Action Buttons**:
    - Edit button: Opens edit modal or detail page
    - Delete button: Shows confirmation, then deletes
    - Icon buttons or text links

**Empty State**:
- Displayed when no tasks exist
- Message: "No tasks yet. Create your first task to get started!"
- Large "+ Create Task" button centered

**Loading State**:
- Skeleton screens for task cards while loading
- Spinner if initial load

### User Interactions

**View Tasks**:
1. Page loads with all user's tasks
2. Tasks sorted by created date (newest first)

**Create Task**:
1. Click "+ New Task"
2. Modal opens with form (or navigate to new page)
3. Enter title and optional description
4. Submit
5. New task appears at top of list

**Toggle Completion**:
1. Click checkbox on task
2. Checkbox toggles immediately (optimistic update)
3. API call updates backend
4. If fails: Revert checkbox, show error

**Edit Task**:
1. Click "Edit" button
2. Navigate to detail page or open edit modal
3. Modify title/description
4. Save changes
5. Return to list with updated task

**Delete Task**:
1. Click "Delete" button
2. Confirmation dialog: "Are you sure you want to delete this task?"
3. If confirmed: Task removed from list
4. If cancelled: No action

### States

**Default State**:
- Task list populated
- All interactive elements enabled

**Loading State**:
- Skeleton UI or spinner
- Action buttons disabled

**Empty State**:
- "No tasks" message
- Create task CTA prominent

**Error State**:
- Error message: "Failed to load tasks. Please refresh."
- Retry button

### Accessibility

- Task checkbox: Proper label, keyboard accessible
- Task title: Focusable link
- Action buttons: Keyboard accessible, screen reader labels
- Skip links for navigation

### Responsive Behavior

- **Mobile**: Single column, full-width cards, stacked action buttons
- **Tablet**: Single column, centered, max-width 768px
- **Desktop**: Single column or optional two-column grid, max-width 1200px

---

## Page 4: Task Detail/Edit Page

**Route**: `/tasks/[id]`
**Authentication**: Protected
**Component Type**: Server Component (initial data) + Client Component (edit form)

### Purpose
View full task details and edit title/description.

### Layout

```
┌─────────────────────────────────────────────┐
│  [← Back to Tasks]         [Delete Task]    │
├─────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────┐    │
│  │  [Title Input]                      │    │
│  │  [Large Text Area for Description]  │    │
│  │                                      │    │
│  │  Status: ☑ Completed                │    │
│  │         (Toggle switch or checkbox) │    │
│  │                                      │    │
│  │  Created: Jan 8, 2026 at 10:30 AM   │    │
│  │  Updated: Jan 8, 2026 at 2:45 PM    │    │
│  │                                      │    │
│  │  [Cancel]  [Save Changes]           │    │
│  └────────────────────────────────────┘    │
│                                              │
└─────────────────────────────────────────────┘
```

### Content Elements

**Navigation**:
- Back button: "← Back to Tasks" (links to `/tasks`)
- Delete button: "Delete Task" (top-right, destructive styling)

**Task Form**:
- **Title Input**:
  - Large text input
  - Autofocus on page load
  - Character counter: "120/200" below input
  - Validation: 1-200 characters required

- **Description Text Area**:
  - Multi-line textarea
  - Rows: 8 (expandable)
  - Character counter: "450/1000" below textarea
  - Validation: 0-1000 characters, optional
  - Placeholder: "Add a description (optional)"

- **Completion Toggle**:
  - Checkbox or toggle switch
  - Label: "Mark as completed"
  - Current state visually indicated

- **Metadata** (read-only):
  - Created timestamp: Full date and time
  - Updated timestamp: Full date and time
  - Small, secondary text below form

**Action Buttons**:
- **Cancel Button**:
  - Text: "Cancel" or "Discard Changes"
  - Secondary styling
  - Links back to task list

- **Save Button**:
  - Text: "Save Changes"
  - Primary styling
  - Disabled if no changes made
  - Loading state when submitting

### User Interactions

**Edit Task**:
1. Page loads with current task data pre-filled
2. User modifies title, description, or completion status
3. User clicks "Save Changes"
4. Form validates inputs
5. If valid: Submit to backend, redirect to task list on success
6. If invalid: Show validation errors

**Delete Task**:
1. User clicks "Delete Task"
2. Confirmation modal: "Are you sure? This cannot be undone."
3. If confirmed: Delete via API, redirect to task list
4. If cancelled: Close modal, no action

**Cancel Edit**:
1. User clicks "Cancel"
2. If changes were made: Confirmation "Discard unsaved changes?"
3. Navigate back to task list

### States

**View/Edit Mode**:
- Form fields editable
- Save button enabled when changes detected

**Loading State**:
- Form disabled while saving
- Save button shows spinner: "Saving..."

**Error State**:
- Validation errors displayed below respective fields
- API errors shown at top of form

**Not Found State**:
- If task doesn't exist or user doesn't own it:
- Error message: "Task not found"
- Link back to task list

### Validation Rules

- Title: 1-200 characters, required
- Description: 0-1000 characters, optional
- Real-time character counters
- Submit button disabled if title empty

### Accessibility

- Form uses semantic HTML
- Labels properly associated
- Error messages announced
- Keyboard navigation fully supported

### Responsive Behavior

- **Mobile**: Full-width form, stacked buttons
- **Tablet/Desktop**: Centered form, max-width 600px, side-by-side buttons

---

## Page Transitions & Navigation

**From Login → Task List**:
- Immediate redirect after successful authentication
- No flash of login page if already authenticated

**From Signup → Login or Task List**:
- After account creation, redirect to login with success message
- Or auto-login and redirect to task list

**From Task List → Task Detail**:
- Click task title or edit button
- Preserve scroll position on back navigation

**From Task Detail → Task List**:
- After save or cancel
- After successful deletion
- Show brief success toast: "Task updated" or "Task deleted"

---

## Error Handling

### Network Errors

- Display user-friendly message: "Connection error. Please check your internet and try again."
- Provide retry button
- Don't lose user input on error

### Authentication Errors

- 401 Unauthorized: Redirect to login
- Clear local JWT token
- Preserve intended destination for post-login redirect

### Not Found Errors

- 404 responses: Show "Not Found" page with link back to task list
- Don't reveal whether resource exists (security)

---

## Performance Optimization

**Server Components**:
- Use for static content, initial data fetching
- Reduces JavaScript bundle size

**Client Components**:
- Only for interactive elements (forms, toggles, delete confirmations)
- Lazy load modals and dialogs

**Data Fetching**:
- Server-side fetch for initial page load
- Optimistic updates for user actions
- Cache API responses appropriately

**Image Optimization**:
- If adding icons/images, use Next.js Image component
- Lazy load below-the-fold content

---

## Visual Design Guidelines

### Color Palette

- Primary: Brand color for buttons, links
- Secondary: Neutral for secondary actions
- Success: Green for completion indicators
- Error: Red for validation errors, destructive actions
- Background: Light (white/light gray) or dark mode support

### Typography

- Headings: Sans-serif, bold, clear hierarchy
- Body: Sans-serif, readable size (16px minimum)
- Monospace: For timestamps (optional)

### Spacing

- Consistent padding/margin using Tailwind spacing scale
- Adequate touch targets (44x44px minimum for mobile)

### Animations

- Subtle transitions for interactive elements (hover, focus)
- Loading spinners for async actions
- Smooth page transitions (optional)

---

## Constraints

- Server Components by default (Next.js App Router)
- Client Components ONLY for interactivity (forms, buttons with onClick)
- Tailwind CSS ONLY (no inline styles, no CSS-in-JS)
- No external component libraries beyond headless UI libraries if needed (e.g., Radix UI for accessibility)
- Responsive design required for all pages
- Keyboard accessibility mandatory
