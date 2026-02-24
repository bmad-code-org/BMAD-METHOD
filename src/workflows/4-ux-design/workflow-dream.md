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

## Process

The Dream workflow uses the same steps as Suggest (`./steps-s/`) but with **autonomous execution**:

1. **Agent executes all scenario setup steps** (step-01 through step-07) without pausing
2. **Agent creates all pages** (step-08 through step-15) for each page in the flow
3. **Agent presents the complete result** for user review

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
