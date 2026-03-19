---
name: 'step-32-create-platform-document'
description: 'Finalize the Platform Requirements as a complete build specification'

# File References
nextStepFile: './step-33-analyze-brief.md'
workflowFile: '../workflow.md'
activityWorkflowFile: '../workflow.md'
---

# Step 32: Finalize Platform Requirements

## STEP GOAL:
Complete the Platform Requirements document and verify it passes the build specification litmus test. This is the final gate before the document ships — everything must be actionable.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- YOU ARE A FACILITATOR, not a content generator
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:
- You are a Systems Architect performing final review of a build specification
- Your job is quality assurance — find gaps that would block a coding agent

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Completeness Checklist

Verify all sections are present and substantive:

**Architecture & Technology:**
- [ ] Architecture pattern and system diagram
- [ ] Frontend framework, styling, state management
- [ ] Backend language, framework, API style
- [ ] Database choice with exact column types
- [ ] Hosting, CI/CD, environments

**Build Specification (the new core):**
- [ ] Complete database schema — every table, every column, types, defaults, constraints, relationships
- [ ] State machines — every stateful entity has states, transitions, triggers, per-phase actions
- [ ] Business logic — every calculation as pseudocode, not prose
- [ ] Event system — scheduled jobs, webhook handlers, user events with preconditions and effects
- [ ] Notification rules — triggers, channels, timing, deduplication
- [ ] API surface — every endpoint with method, path, auth, request shape, response shape
- [ ] Authentication and authorization — method, token lifecycle, roles, RLS rules

**Integration & Operations:**
- [ ] Third-party integrations with purpose and config
- [ ] Contact/communication strategy
- [ ] Multilingual requirements (if applicable)
- [ ] SEO technical requirements (if applicable)
- [ ] Release phase feature gating (if applicable)
- [ ] Maintenance ownership

### 2. The Litmus Test

Read through the entire document and answer these questions honestly:

**Can a coding agent build from this?**
1. Can it create ALL database migrations from the schema section? (Every table, column, type, constraint)
2. Can it implement ALL state machines from the state machine section? (Every transition, trigger, action)
3. Can it write ALL API endpoints from the API section? (Every route, request, response)
4. Can it implement ALL business calculations from the business logic section?
5. Can it set up ALL scheduled jobs from the event system?
6. Can it handle ALL webhooks from the webhook section?
7. Can it send ALL notifications with correct timing and content?

**If ANY answer is "no" — the document has gaps. Go back and fill them.**

Present the litmus test results to the user:
```
Build Specification Litmus Test:
✓ Database migrations: [complete/gaps in X]
✓ State machines: [complete/gaps in X]
✓ API endpoints: [complete/gaps in X]
✓ Business logic: [complete/gaps in X]
✓ Event handlers: [complete/gaps in X]
✓ Webhooks: [complete/gaps in X]
✓ Notifications: [complete/gaps in X]
```

### 3. Summary

Present a high-level summary table:

```
Platform Requirements Summary
─────────────────────────────
Architecture:   [pattern] — [frontend] + [backend] + [database]
Tables:         [N] database tables defined
State Machines: [N] entity lifecycles mapped
API Endpoints:  [N] endpoints specified
Event Handlers: [N] scheduled + [N] webhook + [N] user events
Integrations:   [list]
Release Phases: [N] phases with feature gating
```

### 4. Confirm and Save

Ask: "This document should enable a coding agent to build the entire platform without asking questions. Does it?"

- If gaps found: go back to the relevant step and fill them
- If complete: finalize the document

### 5. Design Log Update

Update design log marking Platform Requirements as complete.

### N. Present MENU OPTIONS
Display: "**Select an Option:** [C] Continue to Analysis"

## CRITICAL STEP COMPLETION NOTE
ONLY WHEN the litmus test passes and user confirms will you proceed.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:
- All checklist items verified as present
- Litmus test passed — every section is actionable by a coding agent
- Summary presented and confirmed by user
- Document finalized

### FAILURE:
- Passed a document with vague sections ("we'll figure out the API later")
- Did not run the litmus test
- Left the document as a planning document instead of a build specification
- Accepted "tech stack + integrations list" as complete Platform Requirements

**THE GOLDEN RULE:** A Platform Requirements document that a coding agent can't build from is not a Platform Requirements document. It's a wish list.

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
