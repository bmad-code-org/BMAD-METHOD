# Inter-Agent Messenger System

## Overview

The Inter-Agent Messenger enables formal handoff protocols between BMAD agents. It provides structured communication for work transitions, review requests, clarifications, and escalations.

## Architecture

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────┐
│   Agent A   │───▶│  Message Queue  │───▶│   Agent B   │
│  (sender)   │    │  (YAML file)    │    │ (receiver)  │
└─────────────┘    └─────────────────┘    └─────────────┘
                           │
                           ▼
                   ┌─────────────┐
                   │   Archive   │
                   └─────────────┘
```

## Message Types

### handoff
Transfer work from one agent to another with full context.

**Example:**
```yaml
type: handoff
from: pm
to: architect
payload:
  artifact_path: "_bmad-output/planning-artifacts/prd.md"
  context_summary: "PRD complete for user auth feature"
  next_actions:
    - Review technical requirements
    - Identify infrastructure needs
    - Propose architecture patterns
```

### review
Request review of completed work.

**Example:**
```yaml
type: review
from: dev
to: tea
payload:
  artifact_path: "_bmad-output/implementation-artifacts/stories/1-2-user-login.md"
  review_type: "code-review"
  files_changed:
    - src/auth/login.ts
    - src/auth/login.test.ts
```

### clarify
Request clarification on requirements or decisions.

**Example:**
```yaml
type: clarify
from: dev
to: architect
payload:
  question: "Should authentication use JWT or session cookies?"
  context: "Story 1-2 requires user login but auth method not specified in architecture"
```

### escalate
Escalate issue to user attention (critical).

**Example:**
```yaml
type: escalate
from: dev
to: user
payload:
  issue: "Blocking dependency conflict between React 18 and legacy charting library"
  severity: "blocker"
  recommendation: "Either upgrade charting library or downgrade to React 17"
  impact: "Cannot proceed with Epic 2 until resolved"
```

### notify
Inform agents of status or decisions.

**Example:**
```yaml
type: notify
from: architect
to_agents: all
payload:
  message: "Architecture decision: Using PostgreSQL with Prisma ORM"
  decision_doc: "_bmad-output/planning-artifacts/architecture.md#database"
```

### collaborate
Request collaborative input from multiple agents.

**Example:**
```yaml
type: collaborate
from: pm
to_agents:
  - architect
  - ux-designer
  - tea
payload:
  topic: "Feature complexity assessment for real-time collaboration"
  deadline: "2025-01-16T17:00:00Z"
  context: "Client requesting WebSocket-based real-time editing"
```

## Standard Handoff Routes

### Phase 1 → Phase 2

| From | To | Trigger | Payload |
|------|-----|---------|---------|
| analyst | pm | Product brief complete | brief_path, key_insights |
| pm | architect | PRD complete | prd_path, priority_features |
| pm | ux-designer | PRD with UI complete | prd_path, user_personas |

### Phase 2 → Phase 3

| From | To | Trigger | Payload |
|------|-----|---------|---------|
| architect | sm | Architecture approved | architecture_path, tech_decisions |
| ux-designer | sm | UX design complete | ux_path, component_library |

### Phase 3 → Phase 4

| From | To | Trigger | Payload |
|------|-----|---------|---------|
| sm | dev | Story ready | story_path, acceptance_criteria |
| dev | tea | Implementation complete | story_path, files_changed |
| tea | dev | Review with issues | review_findings, required_actions |

## Priority Levels

| Priority | Value | Use Case |
|----------|-------|----------|
| critical | 1 | Blockers, escalations |
| high | 2 | Handoffs, clarifications |
| medium | 3 | Reviews, collaborations |
| low | 4 | Notifications |

## Usage

### Sending a Message

```xml
<exec task="send-message">
  <param name="type">handoff</param>
  <param name="from_agent">pm</param>
  <param name="to_agent">architect</param>
  <param name="payload">
    artifact_path: "_bmad-output/planning-artifacts/prd.md"
    context_summary: "PRD complete, ready for architecture"
    next_actions:
      - Review technical requirements
      - Design system architecture
  </param>
</exec>
```

### Receiving Messages

```xml
<exec task="receive-message">
  <param name="agent">architect</param>
  <param name="type_filter">handoff</param>
</exec>
```

## Queue File Structure

```yaml
# _bmad-output/messenger/message-queue.yaml
messages:
  - message_id: "MSG-20250115-a1b2"
    type: "handoff"
    from: "pm"
    to: "architect"
    priority: "high"
    created: "2025-01-15T10:30:00Z"
    status: "pending"
    payload:
      artifact_path: "_bmad-output/planning-artifacts/prd.md"
      context_summary: "PRD complete"
      next_actions:
        - Review requirements
        - Design architecture

  - message_id: "MSG-20250115-c3d4"
    type: "notify"
    from: "architect"
    to_agents: "all"
    priority: "low"
    created: "2025-01-15T11:00:00Z"
    status: "read"
    payload:
      message: "Using PostgreSQL with Prisma"
```

## Best Practices

1. **Always include context** - Don't assume receiving agent knows the background
2. **Use appropriate priority** - Reserve critical for true blockers
3. **Include artifact paths** - Reference documents, not content
4. **Specify next actions** - Clear handoff means faster pickup
5. **Check messages at workflow start** - Agents should check queue before beginning work
