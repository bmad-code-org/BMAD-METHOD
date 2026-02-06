---
name: Agent Dialog Workflow
description: Create structured agent dialog folders for implementation tasks with isolated context and reproducible instructions
web_bundle: true
---

# Agent Dialog Workflow

**Goal:** Create structured, documented agent dialog folders that enable isolated, reproducible implementation tasks.

**Your Role:** Guide the user through creating an agent dialog structure that captures scope, context, and step-by-step instructions.

---

## OVERVIEW

Agent Dialogs bridge specifications → implementation by providing isolation, traceability, and handoff capability.

| Problem | Solution |
|---------|----------|
| Context window limits | Each step is a fresh agent dialog |
| Lost planning work | Everything documented in files |
| Handoff to others | Complete instructions, anyone can execute |
| Resumability | Pick up where you left off |

**The specification is the single source of truth.** Dialogs map implementation tasks to spec sections via Object IDs — they never duplicate spec content.

---

## WHEN TO USE

- Implementing features from specifications
- Changes across multiple files
- Work that might need resuming or handoff
- Saving ideas for later (Capture Dialogs)

**Skip when:** Simple one-file changes, quick fixes, or pure exploration.

---

## AGENT STARTUP PROTOCOL

When awakened, check for pending dialogs:

1. Check `docs/F-Agent-Dialogs/`
2. Find dialogs with status "Not Started" or "In Progress"
3. Present pending dialogs to user

| Status | Meaning |
|--------|---------|
| **Not Started** | Created but no steps executed |
| **In Progress** | Some steps complete |
| **Blocked** | Waiting on dependency |
| **On Hold** | Deliberately paused |
| **Complete** | All steps finished |

---

## DIALOG TYPES

Choose the right template. See [templates/dialog-types/INDEX.md](templates/dialog-types/INDEX.md).

| Type | Icon | Use When |
|------|------|----------|
| **Prototype Implementation** | 🔧 | Building UI from specifications |
| **Bug Fix** | 🐛 | Fixing issues and defects |
| **Design Exploration** | 🎨 | Exploring visual/UX directions |
| **Capture** | 💾 | Saving ideas for later |
| **Generic** | 📋 | Anything else |

---

## FOLDER STRUCTURE

```
docs/F-Agent-Dialogs/
└── {DATE}-{agent}-{feature-name}/
    ├── {DATE}-{agent}-{feature-name}-dialog.md    ← Main file
    └── steps/
        ├── 01-{step-name}.md                      ← Self-contained step
        ├── 02-{step-name}.md
        └── ...
```

**Naming:** Date `YYYY-MM-DD`, agent lowercase, feature hyphenated.

**Capture Dialogs** (save for later): Just create the main dialog file, expand later.

---

## THE DIALOG FILE

Template: [templates/dialog.template.md](templates/dialog.template.md)

**Required Sections:**
1. **Meta** — Date, agent, feature, spec reference, status
2. **Purpose** — What this dialog accomplishes
3. **Where to Find What** — Navigation table for agents/humans
4. **Setup Context** — All context an agent needs to start fresh
5. **Scope** — In/out, dependencies
6. **Steps Overview** — Progress table
7. **Progress Log** — Chronological work record
8. **Spec Changes Discovered** — Track spec updates during implementation

---

## STEP FILES

Each step is **self-contained** — an agent with no context can execute it.

**Core principle: Link, don't duplicate.** Steps reference spec sections via Object IDs:

```markdown
## Object ID Implementation Map
| Object ID | Spec Section | Lines |
|-----------|--------------|-------|
| `booking-detail-header` | Drawer Header | L149-L158 |
```

Template: [templates/step.template.md](templates/step.template.md)

**Required Sections:**
1. Meta — Agent, step number, focus area
2. Single Source of Truth — Link to spec
3. Object ID Implementation Map — IDs → spec line numbers
4. Task — What to implement
5. Files to Modify — Explicit file list
6. Implementation Checklist — Per Object ID: Read → Implement → Verify
7. Acceptance Criteria — All Object IDs present and match spec

---

## WORKFLOW PHASES

### Phase 1: Dialog Initialization
Create folder and main dialog file from template.
**Go to:** [steps/step-01-initialize-dialog.md](steps/step-01-initialize-dialog.md)

### Phase 2: Scope Analysis
Read specs, determine scope, document in/out.
**Go to:** [steps/step-02-analyze-scope.md](steps/step-02-analyze-scope.md)

### Phase 3: Step Breakdown
Break work into discrete steps, create step files.
**Go to:** [steps/step-03-create-steps.md](steps/step-03-create-steps.md)

### Phase 4: Step Execution
Execute each step, verify, update progress. Can run in fresh context.
**Go to:** [steps/step-04-execute-steps.md](steps/step-04-execute-steps.md)

### Phase 5: Completion
Verify all steps, capture spec changes and learnings.
**Go to:** [steps/step-05-complete-dialog.md](steps/step-05-complete-dialog.md)

---

## FIRST STEP

Load and execute [steps/step-01-initialize-dialog.md](steps/step-01-initialize-dialog.md).

**User input needed:**
- What feature/implementation?
- Which specification(s)?
- Target dialog folder location?

---

## BEST PRACTICES

- **Never duplicate spec content** — Link with Object IDs and line numbers
- **Setup Context must be thorough** — Assume agent has zero prior knowledge
- **One clear task per step** — Each step accomplishes one thing
- **Read spec before implementing** — For every Object ID
- **Update progress as you go** — Don't batch updates
- **Track spec changes discovered** — Note any changes found during implementation

---

## EXAMPLES

```
2026-01-23-freya-booking-details-drawer/     ← Feature implementation
├── dialog.md
└── steps/ (01-drawer-shell, 02-date-display, 03-dog-info, ...)

2026-01-23-dev-calendar-scroll-fix/          ← Bug fix
├── dialog.md
└── steps/ (01-reproduce, 02-fix, 03-verify)

2026-01-23-saga-user-settings-page/          ← Capture (expand later)
└── dialog.md
```
