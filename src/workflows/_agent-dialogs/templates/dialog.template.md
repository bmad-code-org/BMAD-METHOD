# {DATE} {Feature Name}

## Meta

| Field | Value |
|-------|-------|
| **Date** | {YYYY-MM-DD} |
| **Agent** | {Agent name, e.g., Freya (UX Designer)} |
| **Feature** | {Feature name} |
| **Specification** | [{Spec name}]({path-to-spec}) |
| **Status** | {Not Started / In Progress / Blocked / Complete} |

---

## Purpose

{1-3 sentences describing what this dialog accomplishes}

---

## About This Dialog

This dialog **bridges the gap** between the page specification and the development work.

```
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│   SPECIFICATION     │         │    THIS DIALOG      │         │   DEVELOPMENT       │
│                     │         │                     │         │                     │
│ • What to build     │────────▶│ • What's in scope   │────────▶│ • How to build      │
│ • Object IDs        │         │ • Step breakdown    │         │ • Code files        │
│ • Requirements      │         │ • Traceability      │         │ • Components        │
│ • Translations      │         │ • Progress tracking │         │ • Tests             │
└─────────────────────┘         └─────────────────────┘         └─────────────────────┘
     Single Source                   Navigation                    Implementation
      of Truth                         Layer
```

**The specification is the single source of truth.** This dialog does not duplicate spec content — it maps implementation tasks to spec sections.

---

## Where to Find What

| I need... | Go to... |
|-----------|----------|
| Complete requirements for an Object ID | [{Spec name}]({path-to-spec}) |
| Translation keys and strings | Specification → each Object ID section |
| What's in scope for this implementation | This file → [Scope](#scope) section |
| Step-by-step implementation instructions | [steps/](steps/) folder |
| Which Object IDs belong to which step | Each step file → Object ID Implementation Map |
| Design system component patterns | {path-to-design-system} |
| Existing code to modify | This file → [Relevant Files](#relevant-files) table |

---

## Setup Context

{Everything an agent needs to understand the project and start working. Include:}

### Project Context

- **Project:** {Project name}
- **Tech Stack:** {e.g., React 19, Next.js 15, TypeScript, Tailwind CSS}
- **Repository:** {path or URL}

### Relevant Files

| File | Purpose |
|------|---------|
| `{path/to/file}` | {What this file does} |
| `{path/to/file}` | {What this file does} |

### Existing Patterns

{Describe any patterns the agent should follow, e.g.:}

- Component structure: {describe}
- Styling approach: {describe}
- State management: {describe}

### Current State

{What exists already that this work builds on}

---

## Scope

### In Scope

- {Feature/change 1}
- {Feature/change 2}
- {Feature/change 3}

### Out of Scope

- {Explicitly excluded item 1}
- {Explicitly excluded item 2}

### Dependencies

- {Dependency 1 — describe what must exist first}
- {Dependency 2}

---

## Implementation Workflow

### Step-by-Step Process

1. **Build step** — Implement the code
2. **Test step** — Verify against spec
3. **User approval** — Confirm it's correct
4. **CW status check** — Verify context window has room for next step
5. **Next step** — Move forward

### Context Window (CW) Status Check

At the end of each completed step, perform a CW status check to ensure the AI session can handle the next step without losing important context.

| Check | Action |
|-------|--------|
| **Session length** | If conversation is very long, consider starting fresh for next step |
| **Context clarity** | Can the agent still reference earlier decisions accurately? |
| **Handoff summary** | If starting new session, document: completed steps, key decisions, current file states |

**Recommendation thresholds:**
- **Continue** — Session is manageable, context is clear
- **Consider fresh start** — Session is long but context is still intact
- **Fresh start recommended** — Context overflow risk, or major architectural shift in next step

---

## Steps Overview

| # | Step | Status | Notes |
|---|------|--------|-------|
| 1 | [{Step name}](steps/01-{step-name}.md) | 🔲 | |
| 2 | [{Step name}](steps/02-{step-name}.md) | 🔲 | |
| 3 | [{Step name}](steps/03-{step-name}.md) | 🔲 | |

**Status Legend:** 🔲 Not Started | 🔄 In Progress | ✅ Complete | ⏸️ Blocked | ❌ Skipped

---

## Progress Log

### {YYYY-MM-DD}

- Created dialog structure
- {Other activities}

<!--
Add entries as work progresses:

### {YYYY-MM-DD}
- Completed Step 1: {description}
- Started Step 2
- {Issues or discoveries}
-->

---

## Spec Changes Discovered

<!--
Document any specification changes or clarifications discovered during implementation.
These should be fed back to the specification files.
-->

_None yet._

<!--
Example:
| Issue | Resolution | Spec Updated? |
|-------|------------|---------------|
| Missing error state | Added to spec | ✅ |
| Unclear button label | Clarified as "Close" | 🔲 |
-->

---

## Learnings

<!--
Capture learnings for future dialogs.
-->

_None yet._

<!--
Example:
- Pattern X works well for this type of component
- Should have broken step 3 into smaller pieces
- Dependency on Y wasn't documented
-->

---

_Created using WDS Agent Dialog Workflow_
