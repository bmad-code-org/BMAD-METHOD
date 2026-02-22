---
name: 'workflow-suggest'
description: 'Build a scenario's page flow step by step, with the agent proposing and the user confirming at each stage.'
---

# [S] Suggest — Agent Proposes, User Confirms Each Step

**Goal:** Build a scenario's page flow step by step, with the agent proposing and the user confirming at each stage.

**When to use:** When the user wants collaborative control — the agent suggests, the user approves or adjusts before moving on.

---

## INITIALIZATION

### Agent Dialog Gate

1. Check for pending activity dialogs
2. If none, suggest creating one
3. Load dialog context


## Entry

Load scenario context from `{output_folder}/C-UX-Scenarios/`.

## Steps

Execute steps in `./steps-s/`:

### Scenario Setup (if new scenario)

| Step | File | Purpose |
|------|------|---------|
| 01 | step-01-core-feature.md | Identify the core feature |
| 02 | step-02-entry-point.md | Define user entry point |
| 03 | step-03-mental-state.md | Capture user mental state |
| 04 | step-04-mutual-success.md | Define mutual success criteria |
| 05 | step-05-shortest-path.md | Map the shortest path |
| 06 | step-06-scenario-name.md | Name the scenario |
| 07 | step-07-create-scenario-folder.md | Create output structure |

### Page Creation (per page)

| Step | File | Purpose |
|------|------|---------|
| 08 | step-08-page-context.md | Establish page context |
| 09 | step-09-page-name.md | Name the page |
| 10 | step-10-page-purpose.md | Define page purpose |
| 11 | step-11-entry-point.md | Define entry points |
| 12 | step-12-mental-state.md | Capture mental state |
| 13 | step-13-desired-outcome.md | Define desired outcome |
| 14 | step-14-variants.md | Identify page variants |
| 15 | step-15-create-page-structure.md | Create initial structure |

**Agent behavior:** Propose each step, wait for user confirmation before proceeding. Adjust based on feedback.

**Reference data:**
- `./data/scenario-init/` — scenario guides and examples
- `./data/page-creation-flows/` — page creation approaches

---

## AFTER COMPLETION

1. Update design log
2. Suggest next action
3. Return to activity menu
