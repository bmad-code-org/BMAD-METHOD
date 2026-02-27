# Freya's Agentic Development Guide

**When to load:** When implementing features, building prototypes, or fixing bugs through structured development

> **Note:** Agent dialogs have been replaced by the Design Log system. Use `_progress/00-design-log.md` for state tracking and `_progress/agent-experiences/` for session insights.

---

## Core Principle

**Agentic Development builds incrementally with full traceability via the design log.**

The design log bridges the gap between specifications and working code. Each step is self-contained, allowing fresh context while maintaining continuity.

---

## What is Agentic Development?

Agentic Development is a **workflow approach** that produces various outputs:

| Output Type | Description | When to Use |
|-------------|-------------|-------------|
| **Interactive Prototypes** | HTML prototypes that let users FEEL the design | Validating UX before production |
| **Prototype Implementation** | Building features from specifications | Feature development |
| **Bug Fixes** | Structured debugging and fixing | Issue resolution |
| **Design Exploration** | Exploring visual/UX directions | Creative iteration |

**Key Insight:** By structuring work with a design log and experience records, we create:
- **Isolation** — Each step can run in a fresh context
- **Traceability** — Clear record of what was planned and executed
- **Replayability** — Instructions can be rerun if needed
- **Handoff** — Different agents or humans can continue the work

---

## Agent Startup Protocol

**When awakened, always check the design log:**

```
1. Read: {output_folder}/_progress/00-design-log.md
2. Check Current and Backlog sections for:
   - Items in progress
   - Items ready to start
3. Present current state to user
```

This ensures no captured work is forgotten.

---

## The Bridge Role

The design log bridges **specifications** and **development**:

```
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│   SPECIFICATION     │         │   DESIGN LOG        │         │   DEVELOPMENT       │
│                     │         │                     │         │                     │
│ • What to build     │────────▶│ • What's in scope   │────────▶│ • How to build      │
│ • Object IDs        │         │ • Current/Backlog   │         │ • Code files        │
│ • Requirements      │         │ • Traceability      │         │ • Components        │
│ • Translations      │         │ • Progress tracking │         │ • Tests             │
└─────────────────────┘         └─────────────────────┘         └─────────────────────┘
     Single Source                   Navigation                    Implementation
      of Truth                         Layer
```

**The specification is the single source of truth.** The design log does not duplicate spec content — it maps implementation tasks to spec sections via Object IDs.

---

## Progress Folder Structure

```
{output_folder}/_progress/
├── 00-design-log.md                               ← Main state tracking
└── agent-experiences/
    ├── {DATE}-{agent}-{feature-name}.md            ← Session insights
    └── ...
```

---

## Feedback Protocol

During implementation, classify and handle feedback naturally:

| Type | What It Is | When to Address |
|------|------------|-----------------|
| **Bug/Issue** | Something broken or not working as expected | Now — iterate until fixed |
| **Quick Adjustment** | Small tweak to current work | Now — implement immediately |
| **Addition** | New requirement that fits current scope | Later step — add to plan |
| **Change Request** | Outside current dialog scope | Future session — document in Change Requests |

**Response Pattern:**
1. **Classify** — Note what kind of feedback this is
2. **Timing** — State when it should be addressed
3. **Confirm** — For additions and change requests, confirm before proceeding
4. **Execute** — Implement or document as appropriate

---

## Inline Testing

**The agent tests its own work before presenting it to the user.**

During agentic development, use Puppeteer to verify measurable criteria after each implementation step. This ensures the user only evaluates qualitative aspects (feel, clarity, hierarchy) rather than checking things the agent can measure.

**Key rules:**

1. **Verify before presenting** — After implementing a section, open the page with Puppeteer and check all measurable criteria
2. **Narrate findings** — Use ✓/✗ marks with actual vs expected values
3. **Fix before showing** — Never present with known measurable failures
4. **Capture baselines** — Before modifying existing features, document current state with Puppeteer
5. **Split test plans** — Story files divide criteria into agent-verifiable and user-evaluable

**Responsibility split:**
- **Agent handles:** Text content, colors, dimensions, touch targets, error states, visibility, state transitions
- **Human handles:** Flow feel, visual hierarchy, user understanding, overall consistency

**Full methodology:** `workflows/4-ux-design/agentic-development/guides/INLINE-TESTING-GUIDE.md`

---

## Interactive Prototypes (Output Type)

Interactive Prototypes are **one output** of Agentic Development.

### Why HTML Prototypes?

**Static Specs Can't Show:**
- How it FEELS to interact
- Where users get confused
- What's missing in the flow
- If the pacing feels right

**HTML Prototypes Reveal:**
- Interaction feels natural or awkward
- Information appears when needed
- Flow has logical gaps
- Users understand next steps

### Fidelity Levels

| Level | Focus | Use When |
|-------|-------|----------|
| **Wireframe** | Information architecture | Testing flow logic only |
| **Interactive** | User experience | Validating UX (standard) |
| **Design System** | Component-based | Phase 5 enabled |

### Prototype vs Production

**Prototypes ARE:**
- Thinking tools
- Communication tools
- Validation tools
- Specification supplements

**Prototypes are NOT:**
- Production code
- Pixel-perfect mockups
- Final design

---

## Prototype Implementation (Output Type)

Building features from specifications through structured dialog steps.

### Step File Structure

Each step links to specifications (doesn't duplicate):

```markdown
## Object ID Implementation Map

| Object ID | Spec Section | Lines |
|-----------|--------------|-------|
| `booking-detail-header` | Drawer Header | L149-L158 |
| `booking-detail-close` | Close Button | L159-L168 |
```

### Implementation Checklist Pattern

For each Object ID:
1. **Read** — Load the spec section
2. **Implement** — Build to match spec
3. **Verify (Puppeteer)** — Open in browser, check measurable criteria with ✓/✗ narration
4. **Fix** — Resolve any mismatches before presenting to user

---

## Best Practices

### Single Source of Truth
- **Never duplicate spec content** — Link to spec sections with line numbers
- **Object IDs are the contract** — Every implementation maps to an Object ID
- **Spec changes update the spec** — Not the dialog or step files

### Design Log
- **Be thorough in Setup Context** — Assume zero prior knowledge
- **Include file paths** — Always use absolute or project-relative paths
- **Track progress** — Update the design log after each step

### Execution
- **Read spec first** — Before implementing any Object ID
- **Fresh context is fine** — Steps are designed to work in isolation
- **Update as you go** — Don't wait to update progress
- **Capture discoveries** — Note spec changes or issues found

---

## Related Resources

- **Design Log:** `{output_folder}/_progress/00-design-log.md`
- **Agent Experiences:** `{output_folder}/_progress/agent-experiences/`
- **Phase 4 UX Design:** `workflows/4-ux-design/workflow.md`
- **Inline Testing Guide:** `workflows/5-agentic-development/guides/INLINE-TESTING-GUIDE.md`

---

*Build incrementally. Document thoroughly. Let users FEEL the design before committing to production.*
