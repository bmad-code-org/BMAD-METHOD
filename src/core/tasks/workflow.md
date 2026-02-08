---
name: workflow
description: Execute a workflow definition by loading configuration, following instructions, and producing outputs
standalone: false
---

# Task: Execute Workflow

## Non-Negotiable Mandates
- Always read complete files. Do not use partial reads for workflow/task files.
- Instructions are mandatory whether embedded or referenced.
- Execute steps in order. Do not skip steps.
- Resolve variables before executing dependent actions.
- Save output checkpoints immediately when a `<template-output>` tag is reached.

## Input Contract
- Required input: `workflow-config` path (usually `workflow.md` or `workflow-*.md`).
- This runner supports markdown workflow definitions with frontmatter and XML-style instruction tags.

## Execution Rules
1. Process steps in numeric order unless a `goto`/conditional explicitly redirects flow.
2. Optional steps require user confirmation unless `#yolo` mode is active.
3. On `<template-output>`, write output, show the section, and wait for user confirmation unless `#yolo` mode is active.
4. If a required value is unknown, ask the user before continuing.

## Execution Flow

### 1. Load and initialize workflow

#### 1a. Load config and resolve variables
- Load workflow definition from `workflow-config`.
- If frontmatter contains `main_config` or `config_source`, load that file.
- Resolve config references and placeholders.
- Resolve system variables:
  - `date` (system-generated)
  - `{project-root}`
  - `{installed_path}`
- Ask the user for unresolved variables.

#### 1b. Load required components
- Load instruction content if referenced by path.
- If a template path exists, load the full template.
- If a validation/checklist path exists, store it for validation steps.
- Data files (`csv`, `json`, etc.) may be loaded lazily when first referenced.

#### 1c. Initialize output (template workflows)
- Resolve `default_output_file`.
- Create output directory if needed.
- Write template skeleton on first write.

### 2. Execute instruction steps

#### 2a. Handle step attributes
- `optional="true"`: include only with user consent unless `#yolo`.
- `if="condition"`: execute only when condition is true.
- `for-each="collection"`: repeat for each item.
- `repeat="n"`: repeat exactly `n` times.

#### 2b. Execute step content
- Execute markdown instructions and XML-style tags.
- Replace `{{variables}}`; ask user when unresolved.

Supported execution tags:
- `<action>`: perform action.
- `<action if="...">`: conditional single action.
- `<check if="...">...</check>`: conditional block.
- `<ask>`: prompt and wait.
- `<goto step="x">`: jump to step.
- `<invoke-workflow>`: run another workflow.
- `<invoke-task>`: run another task.
- `<invoke-protocol name="...">`: run reusable protocol.

#### 2c. Handle `<template-output>`
- Generate content for that section.
- Write/update output file.
- Display section content.
- Offer next action:
  - `[a]` Advanced Elicitation: `{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.md`
  - `[p]` Party Mode: `{project-root}/_bmad/core/workflows/party-mode/workflow.md`
  - `[c]` Continue
  - `[y]` Enable `#yolo` for remaining sections in this run

#### 2d. Step completion prompt
- If no special tag and not `#yolo`, ask whether to continue.

### 3. Completion
- Confirm output is saved (for template workflows).
- Confirm required actions completed (for action workflows).
- Report workflow completion.

## Execution Modes
- `normal`: full confirmations and interaction.
- `#yolo`: skip optional confirmations and proceed with minimal prompts.

## Protocols

### `discover_inputs`
Objective: load relevant project inputs from `input_file_patterns`.

1. Parse `input_file_patterns` from the active workflow frontmatter.
2. For each pattern group, try sources in this order:
- Sharded pattern (if provided)
- Whole-document pattern fallback
3. Apply configured load strategy:
- `FULL_LOAD`: load every matching shard and combine (index first, then alphabetical).
- `SELECTIVE_LOAD`: resolve template variables and load targeted shard(s).
- `INDEX_GUIDED`: load index, infer relevant files from workflow objective, then load likely relevant files.
4. If nothing matches:
- Set corresponding content variable to empty string.
- Note absence as non-fatal.
5. Report loaded variables and source files.

## Final Directives
- Follow this runner first, then the target workflow instructions.
- If behavior is ambiguous, re-read this file and the target workflow definition.
- Keep execution deterministic, explicit, and auditable.
