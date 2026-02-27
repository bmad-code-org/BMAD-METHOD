---
name: agent-dialogs
description: Create structured agent dialog folders for implementation tasks with isolated context and reproducible instructions
web_bundle: true
---

# Agent Dialog Workflow

> **DEPRECATED:** This workflow has been replaced by the Design Log system (`_progress/00-design-log.md`). Project state is now tracked in the design log's Backlog/Current/Design Loop Status/Log sections. Session insights are saved to `_progress/agent-experiences/`. This folder is preserved as reference for the structured step-file approach — do not use for new projects.

**Goal:** Create structured, documented agent dialog folders that enable isolated, reproducible implementation tasks. Plan first, then execute in order.

**Your Role:** Guide the user through creating an agent dialog structure that captures scope, context, and step-by-step instructions.

---

## WORKFLOW ARCHITECTURE

Cross-cutting utility — available to all agents across all phases.

### Steps

| # | Name | Purpose |
|---|------|---------|
| 1 | [Initialize Dialog](steps/step-01-initialize-dialog.md) | Check pending dialogs, create folder and dialog file |
| 2 | [Analyze Scope](steps/step-02-analyze-scope.md) | Read specs, determine in/out scope |
| 3 | [Create Steps](steps/step-03-create-steps.md) | Break work into discrete, self-contained step files |
| 4 | [Execute Steps](steps/step-04-execute-steps.md) | Execute each step, verify, update progress |
| 5 | [Complete Dialog](steps/step-05-complete-dialog.md) | Verify all steps, capture learnings, close |

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read full config from `{project-root}/_bmad/wds/config.yaml` and resolve:

- `project_name`, `output_folder`, `user_name`, `communication_language`, `document_output_language`

### 2. First Step

Load and execute `./steps/step-01-initialize-dialog.md` to begin the dialog workflow.

### Output

- `{output_folder}/_progress/agent-dialogs/{date}-{agent}-{feature}/` — Dialog folder
- `{output_folder}/_progress/agent-dialogs/{date}-{agent}-{feature}/{date}-{agent}-{feature}-dialog.md` — Main dialog file
- `{output_folder}/_progress/agent-dialogs/{date}-{agent}-{feature}/steps/` — Self-contained step files

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

1. Check `{output_folder}/_progress/agent-dialogs/`
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
{output_folder}/_progress/agent-dialogs/
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
