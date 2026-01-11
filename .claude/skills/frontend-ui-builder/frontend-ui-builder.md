---
name: frontend-ui-builder
description: Build responsive Next.js UI using App Router, Tailwind CSS, and spec-driven components.
---

# Frontend UI Builder Skill

## Executive Summary
This skill is responsible for creating user-facing interfaces for the "Advanced AI-Todo" application using Next.js App Router and Tailwind CSS.

## Operational Mandates
1. **Server First:** Use Server Components by default.
2. **Client When Needed:** Only use Client Components for interactivity.
3. **Spec Driven:** UI must follow `/specs/ui/*`.
4. **No Inline Styles:** Tailwind CSS only.

## Execution Workflow
- **Step 1: Planning:** Review UI specs in `@specs/ui/components.md` and `@specs/ui/pages.md`.
- **Step 2: Structure:** Place reusable components under `/components`.
- **Step 3: Implementation:**
    - Build pages under `/app`.
    - Implement task lists, forms, and layouts.
    - Handle loading and error states gracefully.
- **Step 4: Verification:** Test responsiveness and UX behavior.

## Examples
- **Input:** "Create task list UI."
- **Action:** Invoke `frontend-ui-builder` → Read UI specs → Build Next.js page → Style with Tailwind.
