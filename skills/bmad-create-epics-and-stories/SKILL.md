---
name: bmad-create-epics-and-stories
description: 'Break requirements into epics and user stories. Use when the user says "create the epics and stories list"'
---

# Create Epics and Stories

**Goal:** Transform PRD requirements and Architecture decisions into comprehensive stories organized by user value, creating detailed, actionable stories with complete acceptance criteria for the Developer agent.

**Your Role:** In addition to your name, communication_style, and persona, you are also a product strategist and technical specifications writer collaborating with a product owner. This is a partnership, not a client-vendor relationship. You bring expertise in requirements decomposition, technical implementation context, and acceptance criteria writing, while the user brings their product vision, user needs, and business requirements. Work together as equals.

## Conventions

- Bare paths (e.g. `steps/step-01-validate-prerequisites.md`) resolve from the skill root.
- `{skill-root}` resolves to this skill's installed directory (where `customize.toml` lives).
- `{project-root}`-prefixed paths resolve from the project working directory.
- `{skill-name}` resolves to the skill directory's basename.

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

### Core Principles

- **Micro-file Design**: Each step toward the overall goal is a self-contained instruction file; adhere to one file at a time, as directed
- **Just-In-Time Loading**: Only 1 current step file will be loaded and followed to completion - never load future step files until told to do so
- **Sequential Enforcement**: Sequence within the step files must be completed in order, no skipping or optimization allowed
- **State Tracking**: Document progress in output file frontmatter using `stepsCompleted` array when a workflow produces a document
- **Append-Only Building**: Build documents by appending content as directed to the output file

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate
3. **WAIT FOR INPUT**: If a menu is presented, halt and wait for user selection
4. **CHECK CONTINUATION**: If the step has a menu with Continue as an option, only proceed to next step when user selects 'C' (Continue)
5. **SAVE STATE**: Update `stepsCompleted` in frontmatter before loading next step
6. **LOAD NEXT**: When directed, read fully and follow the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** load multiple step files simultaneously
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip steps or optimize the sequence
- 💾 **ALWAYS** update frontmatter of output files when writing the final output for a specific step
- 🎯 **ALWAYS** follow the exact instructions in the step file
- ⏸️ **ALWAYS** halt at menus and wait for user input
- 📋 **NEVER** create mental todo lists from future steps

## On Activation

### Step 1: Resolve the Workflow Block

Run: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --project-root {project-root} --key workflow`

**If the script fails**, resolve the `workflow` block yourself by reading these three files in base → team → user order and applying the same structural merge rules as the resolver:

1. `{skill-root}/customize.toml` — defaults
2. `{project-root}/_bmad/custom/{skill-name}.toml` — team overrides
3. `{project-root}/_bmad/custom/{skill-name}.user.toml` — personal overrides

Any missing file is skipped. Scalars override, tables deep-merge, arrays of tables keyed by `code` or `id` replace matching entries and append new entries, and all other arrays append.

### Step 2: Execute Prepend Steps

Execute each entry in `{workflow.activation_steps_prepend}` in order before proceeding.

### Step 3: Load Persistent Facts

Treat every entry in `{workflow.persistent_facts}` as foundational context you carry for the rest of the workflow run. Entries prefixed `file:` are paths or globs under `{project-root}` — load the referenced contents as facts. All other entries are facts verbatim.

### Step 4: Load Config

Run: `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key modules.bmm.planning_artifacts --key modules.bmm.project_knowledge`

- Use `{planning_artifacts}` for output location and artifact scanning
- Use `{project_knowledge}` for additional context scanning

### Step 5: Greet the User

Headless (no interactive user) → see `## Headless Mode` below, and skip this step. Otherwise greet the user.

### Step 6: Execute Append Steps

Execute each entry in `{workflow.activation_steps_append}` in order.

Activation is complete. If `activation_steps_prepend` or `activation_steps_append` were non-empty, confirm every entry was executed in order before proceeding. Do not begin the main workflow until all activation steps have been completed.

## Headless Mode

No interactive user: infer everything, ask nothing, but never invent — record every inferred choice as an `assumptions[]` entry in `{planning_artifacts}/epics.md`'s frontmatter, and anything that genuinely needs a human as `open_questions[]`. Detect headless the same way as this project's other envelopes: a `headless: true` flag, a non-interactive / no-TTY invocation, an activation hook that declares it, or a first message that pre-supplies all inputs and asks for an artifact path back; when ambiguous, default to interactive.

The moment headless is detected — before Step 1's template initialization — set `mode: headless` in `{planning_artifacts}/epics.md`'s frontmatter. Every step file (`steps/step-01` through `steps/step-04`) is loaded Just-In-Time in its own turn per this skill's **Just-In-Time Loading** principle, so this frontmatter flag — not conversational memory — is what each step checks to know it's headless; each step file's own "Headless:" note tells it exactly what that means for its own menu/halt points.

**What headless skips:** every `[C] Continue` halt, every `[A] Advanced Elicitation` / `[P] Party Mode` offer (interactive-only enrichments, not required functionality — never invoked headless), and every "ask the user" / "get confirmation" checkpoint across all four steps. Infer the best answer from the extracted requirements and the step's own written guidelines instead of asking, and log the judgment call as an assumption.

**What headless does NOT skip:** the actual validation work. Step 4's full validation process — FR coverage, architecture/starter-template compliance, story quality, epic independence, and the within-epic dependency check — still runs in full and must still pass before the document is considered complete. Headless skips only the human picking from a menu, never the checks themselves; a validation failure still means fixing the content, not lowering the bar.

**Hard blockers, unchanged from interactive mode:** PRD.md and Architecture.md are still required inputs (Step 1) — if neither can be found under `{planning_artifacts}`, halt `blocked` rather than inventing requirements from nothing. The UX design contract remains optional; its absence is never blocking, headless or not.

End with JSON only, omitting keys for artifacts not produced:

```json
{
  "status": "complete | partial | blocked",
  "epics_file": "{planning_artifacts}/epics.md",
  "epic_count": 0,
  "story_count": 0,
  "fr_coverage": "complete | incomplete",
  "assumptions": [],
  "open_questions": [],
  "reason": "<one line, only when blocked>"
}
```

`complete` stands alone · `partial` (epics.md produced, but `open_questions[]` non-empty or a critical input like Architecture was inferred/absent) means review before downstream use · `blocked` means no epics.md produced — return only `status`, `reason`, and `epics_file` if a template was at least initialized, omitting the count/coverage/assumption fields that don't apply.

## Execution

Read fully and follow: `steps/step-01-validate-prerequisites.md` to begin the workflow.
