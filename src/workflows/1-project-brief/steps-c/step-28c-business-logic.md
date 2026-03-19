---
name: 'step-28c-business-logic'
description: 'Define business logic, calculations, event handlers, and API surface'

# File References
nextStepFile: './step-29-integrations.md'
workflowFile: '../workflow.md'
activityWorkflowFile: '../workflow.md'
---

# Step 28c: Business Logic, Events & API

## STEP GOAL:
Define the business logic layer: calculations, event system, scheduled jobs, webhook handlers, and the complete API surface. This step turns the database schema (28a) and state machines (28b) into the living system that connects them. The output must be specific enough that a coding agent can implement every handler and endpoint.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- YOU ARE A FACILITATOR, not a content generator
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:
- You are a Systems Architect defining the behavioral layer of the system
- Schema + state machines are your inputs. Business logic is your output.
- Write pseudocode for non-trivial calculations. Don't describe — specify.

## CONTEXT DEPENDENCIES:
- Database Schema (Step 28a): The data structures
- State Machines (Step 28b): The lifecycle flows
- Product Brief: Business rules, pricing, calculations
- Technology Stack (Step 28): API style (REST/GraphQL), language constraints

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Business Calculations

Extract every calculation from the Product Brief and document as pseudocode:

```
function calculate_commission(payment, user):
    if user.tier == 'flex':
        rate = 0.05
    elif user.tier == 'pro':
        rate = 0.02
    elif user.tier == 'enterprise':
        rate = negotiated_rate(user)
    return payment.gross_amount * rate
```

Ask: "What are the financial calculations, pricing rules, or formulas in your product?"

Document EVERY calculation — not just the obvious ones. Include:
- Pricing calculations
- Commission/fee calculations
- Date calculations (expiry dates, reminder schedules)
- Threshold calculations (when to trigger actions)
- Scoring/ranking algorithms (if any)

### 2. Event System

Every system has events — things that happen that trigger other things. Document three categories:

**Scheduled Events (cron / background jobs):**

| Event | Frequency | Handler |
|-------|-----------|---------|
| check_expiring_X | Daily | Find all X where deadline approaching. Transition state. Send notification. |
| ... | ... | ... |

**Webhook Events (external triggers):**

| Event | Source | Handler |
|-------|--------|---------|
| payment_succeeded | Stripe | Find entity. Update status. Create record. Notify user. |
| ... | ... | ... |

**User Events (from UI / chat / API):**

| Event | Source | Handler |
|-------|--------|---------|
| entity_created | UI/API | Validate. Insert. Schedule follow-ups. |
| ... | ... | ... |

For each handler, document:
- What it checks (preconditions)
- What it changes (state transitions, record creation)
- What it triggers (notifications, follow-up events)
- How it differs per release phase (if applicable)

### 3. Notification Rules

When does the system communicate with the user? Document every notification:

| Trigger | Channel | Message Pattern | Phase |
|---------|---------|----------------|-------|
| Usage right expiring in 30 days | Push + in-app | "DJI expires in 30 days — chase?" | All |
| Invoice overdue 7 days | Email + in-app | "Nike hasn't paid — send reminder?" | 2+ |
| ... | ... | ... | ... |

Include: timing rules (don't send at 3am), deduplication (don't remind twice for same thing), escalation (first reminder → second → urgent).

### 4. API Surface

Document every endpoint the system exposes:

**REST format:**
| Method | Path | Purpose | Auth | Request | Response |
|--------|------|---------|------|---------|----------|
| POST | /api/auth/register | Create account | None | { email, password, name } | { user, token } |
| POST | /api/chat | Send message to AI | Bearer | { message, attachments? } | SSE stream |
| GET | /api/projects | List user's projects | Bearer | ?status=active&limit=20 | { projects[], total } |
| POST | /api/projects | Create project | Bearer | { title, client_id, ... } | { project } |
| PATCH | /api/projects/:id | Update project | Bearer | { status?, title?, ... } | { project } |
| ... | ... | ... | ... | ... | ... |

**For EVERY entity in the schema, define at minimum:**
- List (GET with filters and pagination)
- Get single (GET by ID)
- Create (POST)
- Update (PATCH)
- Delete/archive (DELETE or soft-delete)

**Plus any special endpoints:**
- File upload
- Export (CSV, PDF)
- Bulk operations
- Webhook receivers
- MCP server endpoints (if applicable)

### 5. Authentication & Authorization

- Auth method (JWT, sessions, OAuth)
- Token lifecycle (access token TTL, refresh token)
- Role-based access (who can do what)
- Row-level security rules (who sees what data)

### 6. AI Integration Spec (if applicable)

If the product has AI features:
- Which endpoints involve AI
- Model selection logic (which model for which task)
- Tool definitions (what tools can the AI call)
- Conversation memory strategy (full history, summarized, window)
- Cost management (model routing by complexity)
- Streaming approach (SSE, WebSocket)

### 7. Validate with User

Present the complete business logic spec and ask:
- "Does this capture every rule in your business?"
- "Are there calculations I missed?"
- "Does the API surface cover every action users need?"
- "Are the notification rules right — not too many, not too few?"

### 8. Design Log Update

Update design log with business logic decisions.

### N. Present MENU OPTIONS
Display: "**Select an Option:** [C] Continue to Integrations"

## CRITICAL STEP COMPLETION NOTE
ONLY WHEN the user confirms the business logic is complete will you proceed.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:
- Every calculation documented as pseudocode
- Event system complete (scheduled, webhook, user events)
- Notification rules defined with timing and channels
- API surface covers every entity and special operation
- Auth and authorization specified
- AI integration documented (if applicable)
- User confirmed

### FAILURE:
- Described business rules in prose instead of pseudocode/tables
- Listed API endpoints without request/response shapes
- Missed event handlers for state transitions defined in Step 28b
- Did not address notification timing and deduplication
- Generated API surface without user validation

**LITMUS TEST:** Can a coding agent implement every endpoint, every handler, and every calculation from this document alone? Can it write the cron jobs, the webhook receivers, the notification logic? If not, it's not done.

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
