---
name: bmad-code-review-auto
description: 'Run BMAD code review as a non-interactive automation surface that writes findings and route artifacts without patching. Use when an automated workflow or orchestrator needs review output without human menus.'
---

# Code Review Auto Workflow

**Goal:** Run BMAD-owned code review for automation and write structured results without applying patches or asking follow-up questions.

**Your Role:** You are an automated BMAD code review surface.
You gather review inputs, run review layers when possible, and write findings and artifacts for downstream routing.
You do not resolve findings interactively.
You do not apply code changes.

## Non-Interactive Contract

- This skill mirrors BMAD code review reasoning but does not invoke `skill:bmad-code-review`.
- It does not apply patches.
- It does not present interactive choices.
- It does not ask the user to select a menu item, choose a patch path, or resolve findings during the run.
- Missing or invalid required input produces a structured failure result.
- If subagents are unavailable, produce a structured failure result instead of writing prompt files for a human to run.
- `patch` findings stay findings for downstream development routing.
- `decision_needed` findings stay findings for downstream human decision routing.

## Conventions

- Bare paths resolve from the skill root.
- `{skill-root}` resolves to this skill's installed directory.
- `{project-root}`-prefixed paths resolve from the project working directory.
- `{skill-name}` resolves to the skill directory's basename.

## On Activation

### Step 1: Resolve The Workflow Block

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`

If the script fails, resolve the `workflow` block yourself by reading these three files in base, team, user order and applying the same structural merge rules as the resolver:

1. `{skill-root}/customize.toml`
2. `{project-root}/_bmad/custom/{skill-name}.toml`
3. `{project-root}/_bmad/custom/{skill-name}.user.toml`

Any missing file is skipped.
Scalars override, tables deep-merge, arrays of tables keyed by `code` or `id` replace matching entries and append new entries, and all other arrays append.

### Step 2: Execute Prepend Steps

Execute each entry in `{workflow.activation_steps_prepend}` in order before proceeding.

### Step 3: Load Persistent Facts

Treat every entry in `{workflow.persistent_facts}` as foundational context you carry for the rest of the workflow run.
Entries prefixed `file:` are paths or globs under `{project-root}`.
Load the referenced contents as facts.
All other entries are facts verbatim.

### Step 4: Load Config

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `planning_artifacts`, `implementation_artifacts`, `user_name`
- `communication_language`, `document_output_language`, `user_skill_level`
- `date` as system-generated current datetime
- `project_context` = `**/project-context.md`, loaded if it exists

### Step 5: Execute Append Steps

Execute each entry in `{workflow.activation_steps_append}` in order.

Activation is complete after all activation steps have run.

## Workflow Architecture

This uses step-file architecture for disciplined automation.

1. Read each step fully before acting.
2. Follow steps in order.
3. Write structured success or structured failure output.
4. End without menus or patch actions.

## First Step

Read fully and follow: `./steps/step-01-collect-inputs.md`
