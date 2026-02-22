# {YYYY-MM-DD} {Feature Name} — Prototype Implementation

<!--
FILE NAMING CONVENTION:
- Folder: {YYYY-MM-DD}-{agent}-{feature-name}/
- File:   {YYYY-MM-DD}-{agent}-{feature-name}-dialog.md

Example:
- Folder: 2026-01-23-freya-booking-details-overlay/
- File:   2026-01-23-freya-booking-details-overlay-dialog.md
-->

## Meta

| Field | Value |
|-------|-------|
| **Date** | {YYYY-MM-DD} |
| **Type** | 🔧 Prototype Implementation |
| **Agent** | {Agent name} ({Role}) |
| **Feature** | {Feature name} |
| **Specification** | [{Spec name}]({path-to-spec}) |
| **Target** | {Where to implement: app path or prototype folder} |
| **Status** | Not Started |

---

## Purpose

Implement {feature name} from specification into working code, following the section-by-section approach with approval gates.

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
| Existing code to modify | This file → [Existing Code](#existing-code) table |

---

## Setup Context

### Project Context

- **Project:** {Project name}
- **Tech Stack:** {e.g., React 19, Next.js 15, TypeScript, Tailwind CSS}
- **Repository:** {path}

### Specification Summary

**Page/Feature:** {Name from spec}

**States/Variants:**
- {State 1}
- {State 2}
- {etc.}

**Key Sections:**
| Section | Object IDs | Priority |
|---------|------------|----------|
| {Section 1} | `{object-id-1}`, `{object-id-2}` | High |
| {Section 2} | `{object-id-3}` | Medium |

### Existing Code

| File | Purpose | Status |
|------|---------|--------|
| `{path/to/file}` | {What it does} | {Exists / To Create} |

### Design System Components

| Component | Path | Notes |
|-----------|------|-------|
| [{Component}]({path}) | `{import path}` | {Usage notes} |

---

## Scope

### In Scope

- {Section/feature 1}
- {Section/feature 2}
- Translations (SE/EN)
- Accessibility (WCAG AA)

### Out of Scope

- {Explicitly excluded}
- Backend/API changes (unless specified)

### Dependencies

- [ ] {Dependency 1} — {status}
- [ ] {Dependency 2} — {status}

---

## Implementation Approach

### Section-by-Section

Each section is implemented and approved before moving to the next:

1. **Build section** — Implement the code
2. **Test section** — Verify against spec
3. **User approval** — Confirm it's correct
4. **Next section** — Move forward

### Approval Criteria

- [ ] **Matches sketches precisely** — Text sizes, proportions, spacing, layout
- [ ] All Object IDs present as `data-object-id` attributes
- [ ] Translations work (SE/EN toggle)
- [ ] Accessibility requirements met
- [ ] No TypeScript errors

> **Sketch Fidelity:** Sketches are intentional design decisions. Text sizes, proportions, and spacing are chosen deliberately. Implement as close to the sketch as possible. If constraints prevent exact matching, document the deviation.

---

## Feedback Protocol

How designer feedback is handled during implementation:

| Type | What It Is | When to Address | Documentation |
|------|------------|-----------------|---------------|
| **Bug/Issue** | Something broken or not working | Now — iterate until fixed | Part of current step |
| **Quick Adjustment** | Small tweak to current work | Now — implement immediately | Note in progress log |
| **Addition** | New requirement in scope | Later step — add to plan | Note in step file |
| **Change Request** | Outside current scope | Future session — document | Add to Change Requests |

### The 2-Minute Rule (GTD)

**If a fix takes less than 2 minutes, do it immediately.**

Planning overhead should not exceed task complexity. See [GTD Model](../../../../docs/models/gtd-getting-things-done.md).

**Pattern:** Do the fix → Log as sub-step (e.g., 20a-1) → Continue main task

### Agent Response Pattern

**When user reports something:**
1. **CLASSIFY** — What type of feedback is this?
2. **TIMING** — When should it be addressed?
3. **CONFIRM** — For additions and change requests, confirm before proceeding
4. **EXECUTE** — Implement or document as appropriate

### Change Request Flow

```
Designer: "The profile button should go to /family"
Agent:    "This is outside the current dialog scope.
          It doesn't block {current feature}.
          I'll add it to Change Requests for a future session. Confirm?"
Designer: "Yes" → Agent adds to Change Requests
          OR "Do it now" → Agent treats as quick adjustment, implements
```

---

## Change Requests

Structural changes identified during implementation. Assessed for timing.

| # | Request | Raised | Assessment | Timing | Status |
|---|---------|--------|------------|--------|--------|
| _None yet_ | | | | | |

<!--
Example:
| CR-1 | **Infinite Calendar Scroll** — Calendar should scroll continuously | 2026-01-24 | Structural change to calendar. Significant scope. | Future session | 🔲 Pending |
-->

---

## Steps Overview

### Done

| # | Section | Notes |
|---|---------|-------|
| _None yet_ | | |

### In Progress

| # | Section | Status | Description |
|---|---------|--------|-------------|
| 1 | [{Section name}](steps/01-{section}.md) | 🔄 | {Brief description} |
| 1a | — {Sub-task} | 🔄 | {Sub-step added during execution} |

### To Do

| # | Section | Description |
|---|---------|-------------|
| 2 | [{Section name}](steps/02-{section}.md) | {Brief description} |
| 3 | [{Section name}](steps/03-{section}.md) | {Brief description} |

**Status:** 🔲 Not Started | 🔄 In Progress | ✅ Complete | ⏸️ Blocked

**Sub-Step Numbering:**
- Main steps: `1`, `2`, `3`...
- Sub-steps during execution: `1a`, `1b`...
- Bug fixes (2-min rule): `1a-1`, `1a-2`...

---

## Progress Log

### {YYYY-MM-DD}

- Created dialog from specification
- Identified {N} sections to implement

<!--
### {YYYY-MM-DD}
- Completed Section 1: {name}
- User approved ✅
- Started Section 2
-->

---

## Spec Changes Discovered

<!--
Document any issues with the specification found during implementation.
-->

| Issue | Resolution | Spec Updated? |
|-------|------------|---------------|
| _None yet_ | | |

---

## Testing Checklist

### Per-Section Testing

- [ ] Visual match to specification
- [ ] Object IDs present and correct
- [ ] Translations toggle correctly
- [ ] Touch targets ≥ 44px
- [ ] Keyboard navigation works

### Final Integration Testing

- [ ] All sections work together
- [ ] State transitions correct
- [ ] No console errors
- [ ] Responsive (if applicable)

---

## Learnings

<!--
Capture learnings for future prototype implementations.
-->

_None yet._

---

_Prototype Implementation Dialog — WDS Agent Dialog Workflow_
