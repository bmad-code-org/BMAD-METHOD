---
name: 'workflow-dream'
description: 'The agent creates a complete scenario flow autonomously, then presents the result for user review.'
---

# [D] Dream Up — Agent Creates Autonomously, User Reviews

**Goal:** The agent creates a complete scenario flow autonomously, then presents the result for user review.

**When to use:** When the user trusts the agent to make good decisions and prefers to review a complete proposal rather than approve each step.

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
2. **If a Phase 3 scenario exists** → Skip to **Process** below. The scenario's 8-question answers, shortest path, and first page specification provide everything needed.
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

## Process

The Dream workflow uses the same steps as Suggest (`./steps-s/`) but with **autonomous execution**:

1. **Agent creates all pages** (step-08 through step-15) for each page in the flow
2. **Agent presents the complete result** for user review

### Agent Behavior

- Make reasonable decisions at each step based on VTC, scenario context, and WDS patterns
- Document decisions and rationale as you go
- When uncertain, choose the simpler option
- After completion, present a summary of all decisions made
- User can accept, request changes, or switch to **[S] Suggest** for finer control

### Mode Override Rule (CRITICAL)

Step files in `./steps-s/` contain rules like "ALWAYS halt and wait for user input" and "NEVER generate content without user input." **These rules apply ONLY in Suggest mode.**

In Dream mode:
- **OVERRIDE** all "halt and wait" rules — auto-proceed after completing each step
- **OVERRIDE** "NEVER generate content without user input" — generate based on context and WDS patterns
- **DO NOT** display menus or wait for menu selections between steps
- **DO** still save outputs and update agent dialog at each step
- **DO** still follow the step's actual instructions for what to generate
- The user can type **"stop"** or **"pause"** at any time to interrupt and switch to Suggest mode

**Reference data:**
- `./data/scenario-init/` — scenario guides and examples
- `./data/page-creation-flows/` — page creation approaches

---

## AFTER COMPLETION

1. Update design log
2. Suggest next action
3. Return to activity menu
