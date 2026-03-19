---
name: 'step-28b-state-machines'
description: 'Define state machines for every entity with a lifecycle'

# File References
nextStepFile: './step-28c-business-logic.md'
workflowFile: '../workflow.md'
activityWorkflowFile: '../workflow.md'
---

# Step 28b: State Machines

## STEP GOAL:
Define the state machine for every entity that has a lifecycle. Every status field in the database schema (from Step 28a) becomes a state machine with explicit states, transitions, triggers, and actions. If the product has release phases, document what each transition does in EACH phase.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- YOU ARE A FACILITATOR, not a content generator
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:
- You are a Systems Architect mapping business processes to state transitions
- The database schema from Step 28a is your primary input — every `status` column becomes a state machine
- Draw the states as ASCII diagrams so the user can visualize the flow

## CONTEXT DEPENDENCIES:
- Database Schema (Step 28a): Every entity with a `status` column
- Product Brief: Business process descriptions
- Technology Stack (Step 28): Hosting/deployment constraints

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Identify Stateful Entities

From the database schema, list every table that has a `status` column:
- "These entities have lifecycles: [list]. Each one needs a state machine."
- Ask: "Are there any other processes that move through stages that I missed?"

### 2. For Each Entity, Define the State Machine

**Present as ASCII state diagram:**
```
draft ──→ active ──→ expiring ──→ expired
                                    │     │
                                    ▼     ▼
                                renewed   lapsed
```

**Then document as a transition table:**

| From → To | Trigger | What Happens |
|-----------|---------|-------------|
| draft → active | User confirms | Set start_date, schedule reminders |
| active → expiring | 30 days before end | Send notification |
| ... | ... | ... |

### 3. Per-Phase Actions (if product has release phases)

If the Product Brief describes progressive automation (e.g., manual → assisted → automated), document what each transition does in EACH phase:

| From → To | Trigger | Phase 1 (Manual) | Phase 2 (Assisted) | Phase 3 (Automated) |
|-----------|---------|------------------|-------------------|---------------------|
| delivered → active | Payment confirmed | Creator logs "they paid" | Stripe webhook | Stripe webhook |
| expiring → expired | End date reached | Notification: "chase?" | "Want me to send offer?" | Auto-send offer |

**Key principle:** The states and transitions NEVER change between phases. Only the ACTION HANDLERS change. Same database, same state machine, different level of automation.

### 4. Feature Gate Pattern

If phases exist, document the gating pattern:

```
function onTransition(entity, from, to):
    // Always happens (all phases):
    entity.status = to
    entity.updated_at = now()
    log_event(entity, from, to)

    // Phase-gated actions:
    if feature_flag('phase_2_automation'):
        // Automated action
    else:
        // Manual reminder
```

Present to user: "This pattern means you build once and unlock features by flipping flags. The database and state machine never change."

### 5. Edge Cases

For each state machine, ask about:
- Can an entity move backward? (e.g., active → draft for corrections)
- What happens on cancellation from any state?
- What about simultaneous transitions? (e.g., payment received while in wrong state)
- Timeout transitions (what if nothing happens for N days?)

### 6. Validate with User

Present all state machines and ask:
- "Does this match how your business actually works?"
- "Are there any states or transitions I missed?"
- "Do the per-phase actions feel right?"

### 7. Design Log Update

Update design log with state machine decisions.

### N. Present MENU OPTIONS
Display: "**Select an Option:** [C] Continue to Business Logic"

## CRITICAL STEP COMPLETION NOTE
ONLY WHEN the user confirms all state machines are complete will you proceed.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:
- Every status column from the schema has a state machine
- State diagrams presented visually (ASCII)
- Transition tables complete with triggers and actions
- Per-phase action differences documented (if applicable)
- Feature gate pattern documented
- Edge cases addressed
- User confirmed

### FAILURE:
- Listed states without transitions
- Described processes in prose instead of explicit state → state tables
- Missed per-phase action differences
- Did not address edge cases

**LITMUS TEST:** Can a developer implement the state machine as a function from this document, with every transition and its effects explicit? If not, it's not done.

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
