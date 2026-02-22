# Freya's Agentic Development Guide

**When to load:** When implementing features, building prototypes, or fixing bugs through structured agent dialogs

---

## Core Principle

**Agentic Development uses structured dialogs to build incrementally with full traceability.**

Agent Dialogs bridge the gap between specifications and working code. Each step is self-contained, allowing fresh context while maintaining continuity.

---

## What is Agentic Development?

Agentic Development is a **workflow approach** that produces various outputs:

| Output Type | Description | When to Use |
|-------------|-------------|-------------|
| **Interactive Prototypes** | HTML prototypes that let users FEEL the design | Validating UX before production |
| **Prototype Implementation** | Building features from specifications | Feature development |
| **Bug Fixes** | Structured debugging and fixing | Issue resolution |
| **Design Exploration** | Exploring visual/UX directions | Creative iteration |

**Key Insight:** By structuring work into documented dialog folders, we create:
- **Isolation** — Each step can run in a fresh context
- **Traceability** — Clear record of what was planned and executed
- **Replayability** — Instructions can be rerun if needed
- **Handoff** — Different agents or humans can continue the work

---

## Agent Startup Protocol

**When awakened, always check for pending dialogs:**

```
1. Check: {output_folder}/_progress/agent-dialogs/
2. Find dialogs where:
   - Status = "Not Started" or "In Progress"
   - Agent matches the awakened agent
3. Present pending dialogs to user
```

This ensures no captured work is forgotten.

---

## The Bridge Role

Agent Dialogs bridge **specifications** and **development**:

```
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│   SPECIFICATION     │         │   AGENT DIALOG      │         │   DEVELOPMENT       │
│                     │         │                     │         │                     │
│ • What to build     │────────▶│ • What's in scope   │────────▶│ • How to build      │
│ • Object IDs        │         │ • Step breakdown    │         │ • Code files        │
│ • Requirements      │         │ • Traceability      │         │ • Components        │
│ • Translations      │         │ • Progress tracking │         │ • Tests             │
└─────────────────────┘         └─────────────────────┘         └─────────────────────┘
     Single Source                   Navigation                    Implementation
      of Truth                         Layer
```

**The specification is the single source of truth.** Dialogs do not duplicate spec content — they map implementation tasks to spec sections via Object IDs.

---

## Dialog Folder Structure

```
{output_folder}/_progress/agent-dialogs/
└── {DATE}-{agent}-{feature-name}/
    ├── {DATE}-{agent}-{feature-name}-dialog.md    ← Main file
    └── steps/
        ├── 01-{step-name}.md                      ← Self-contained steps
        ├── 02-{step-name}.md
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

### Dialog Files
- **Be thorough in Setup Context** — Assume zero prior knowledge
- **Include file paths** — Always use absolute or project-relative paths
- **Track progress** — Update the Steps Overview table after each step

### Execution
- **Read spec first** — Before implementing any Object ID
- **Fresh context is fine** — Steps are designed to work in isolation
- **Update as you go** — Don't wait to update progress
- **Capture discoveries** — Note spec changes or issues found

---

## Related Resources

- **Agent Dialog Workflow:** `workflows/_agent-dialogs/workflow.md`
- **Dialog Template:** `workflows/_agent-dialogs/templates/dialog.template.md`
- **Step Template:** `workflows/_agent-dialogs/templates/step.template.md`
- **Phase 4 UX Design:** `workflows/4-ux-design/workflow.md`
- **Inline Testing Guide:** `workflows/5-agentic-development/guides/INLINE-TESTING-GUIDE.md`

---

*Build incrementally. Document thoroughly. Let users FEEL the design before committing to production.*
