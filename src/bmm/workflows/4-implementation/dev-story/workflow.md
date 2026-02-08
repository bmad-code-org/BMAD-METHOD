---
name: dev-story
description: "Execute a story by implementing tasks/subtasks, writing tests, validating, and updating the story file per acceptance criteria"
projectRoot: '{project-root}'
main_config: '{project-root}/_bmad/bmm/config.yaml'
web_bundle: false
---

# Dev Story Workflow

## Goal
Implement a ready story end-to-end with strict validation gates, accurate progress tracking, and high-quality test coverage.

## Workflow Architecture
- Uses step-file execution to keep context focused and deterministic.
- Read one step file fully, execute it, then move to the next step file.
- Do not pre-load future step files.

## Initialization
- Resolve `projectRoot`:
  - Prefer `{project-root}` when provided by runtime.
  - If unavailable, resolve repo root from current working directory (locate-repo-root helper / process cwd) and set `projectRoot`.
  - Validate that `{projectRoot}/_bmad/bmm/config.yaml` exists and is readable before continuing.
- Load config from `{projectRoot}/_bmad/bmm/config.yaml`.
- Resolve variables:
  - `user_name`
  - `communication_language`
  - `document_output_language`
  - `user_skill_level`
  - `implementation_artifacts`
  - `story_dir` = `{implementation_artifacts}`
  - `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`
  - `story_file` (if provided)
  - `project_context` = `**/project-context.md`
  - `date` (system-generated)
  - `installed_path` = `{projectRoot}/_bmad/bmm/workflows/4-implementation/dev-story`

## Critical Rules
- Communicate in `{communication_language}` and tailor explanations to `{user_skill_level}`.
- Generate any documents in `{document_output_language}`.
- Only update allowed story sections:
  - Tasks/Subtasks checkboxes
  - Dev Agent Record (Debug Log, Completion Notes)
  - File List
  - Change Log
  - Status
- Execute steps in order and do not skip validation gates.
- Continue until the story is complete unless the HALT protocol below is triggered.

## HALT Protocol (Normative)
- Scope:
  - Every `HALT` instruction in this workflow and all `steps/*.md` files MUST use this protocol.
- Operational definition:
  - HALT is a deterministic hard-stop event raised when execution cannot safely continue.
  - A HALT event MUST include:
    - `reason_code` (stable machine-readable code)
    - `step_id` (current step file + step number)
    - `message` (human-readable failure summary)
    - `required_action` (what user/operator must do before resume)
- Trigger criteria:
  - Required inputs/files are missing, unreadable, or malformed.
  - Validation gates fail and cannot be remediated in the current step.
  - Test/regression failures persist after attempted fixes.
  - Story state is inconsistent (for example malformed task structure preventing safe updates).
- HALT behavior:
  - Stop execution immediately and skip all downstream steps.
  - Persist workflow checkpoint: current step id, resolved variables, and pending task context.
  - Persist only already-applied safe edits; do not apply new partial completion marks after HALT.
  - Emit logger event exactly in this format:
    - `HALT[{reason_code}] step={step_id} story={story_key|unknown} detail=\"{message}\"`
  - Emit user-facing prompt exactly in this format:
    - `Workflow HALTED at {step_id} ({reason_code}): {message}. Required action: {required_action}. Reply RESUME after remediation.`
- Resume semantics:
  - Manual resume only (no automatic retry loop).
  - Resume is checkpoint-based: restart from the halted step after user confirms remediation.
  - Re-run the failed validation/input check before executing further actions.
  - If the same HALT condition repeats, stop again with updated evidence.

## Execution
Read fully and follow: `steps/step-01-find-story.md`.
