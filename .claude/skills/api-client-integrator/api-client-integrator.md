---
name: api-client-integrator
description: Centralize frontend-to-backend API communication with JWT support.
---

# API Client Integration Skill

## Executive Summary
This skill manages all frontend API communication, ensuring consistent request handling, JWT attachment, and environment-aware configuration.

## Operational Mandates
1. **Single Client:** All API calls MUST go through `/lib/api.ts`.
2. **Auth Required:** Always attach JWT token in Authorization header.
3. **Environment Aware:** Support dev and production API URLs.
4. **No Direct Fetch:** Never call fetch directly in components.

## Execution Workflow
- **Step 1: Planning:** Review API usage in `@specs/api/rest-endpoints.md`.
- **Step 2: Token Handling:** Retrieve JWT from Better Auth session.
- **Step 3: Implementation:**
    - Create typed API helper functions.
    - Attach headers automatically.
    - Handle error responses consistently.
- **Step 4: Verification:** Confirm authenticated requests succeed and unauthenticated fail.

## Examples
- **Input:** "Connect frontend to task API."
- **Action:** Invoke `api-client-integrator` → Build api.ts → Attach JWT → Expose task helpers.
