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

### Scenario Check (CRITICAL GATE)

Before starting page design, verify that a scenario exists for the selected scenario:

1. Look for scenario files in `{output_folder}/C-UX-Scenarios/[NN-slug]/[NN-slug].md`
2. **If a Phase 3 scenario exists** → Skip to **Page Creation** below. The scenario's 8-question answers, shortest path, and first page specification provide everything needed.
3. **If NO scenario exists** → Do NOT attempt to define the scenario here. Instead:
   - Inform the user: *"Before we design pages, we need a scenario outline. This gives us the user's device, mental state, entry point, and the shortest path — all essential for good page design."*
   - Suggest returning to Phase 3 to outline the scenario using the 8-question dialog
   - The user can then return here with [D] from the Phase 3 post-scenario menu

**Why:** Phase 3's 8-question dialog is the canonical way to define scenarios. It produces richer, more grounded scenarios than trying to shortcut the process here.

### Phase 3 Handover Context

When entering from Phase 3's [D] option (start designing), the scenario file and page folders already exist. Use:
- **Page folders** from `{output_folder}/C-UX-Scenarios/[NN-slug]/pages/[NN].1-[page-slug]/` — each page has a boilerplate `.md` and a `Sketches/` subfolder
- **First page spec** (`[NN].1-*.md`) has full entry context (device, arrival, mental state) from Q4, Q5, Q6
- **Shortest path** from Q8 to know the full page sequence

## Steps

Execute steps in `./steps-s/`:

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
