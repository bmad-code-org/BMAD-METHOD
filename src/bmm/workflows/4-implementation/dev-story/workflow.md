---
name: dev-story
description: "Execute a story by implementing tasks/subtasks, writing tests, validating, and updating the story file per acceptance criteria"
projectRoot: '{project-root}'
main_config: '{projectRoot}/_bmad/bmm/config.yaml'
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
- Continue until the story is complete unless a defined HALT condition triggers.

## HALT Definition
- HALT triggers:
  - Required inputs/files are missing or unreadable.
  - Validation gates fail and cannot be remediated in current step.
  - Test/regression failures persist after fix attempts.
  - Story state becomes inconsistent (e.g., malformed task structure preventing safe updates).
- HALT behavior:
  - Stop executing further steps immediately.
  - Persist current story-file edits and workflow state safely.
  - Emit explicit user-facing error message describing trigger and remediation needed.
  - Do not apply partial completion marks after HALT.
- Resume semantics:
  - Manual resume only after user confirms the blocking issue is resolved.
  - Resume from the last incomplete step checkpoint, re-running validations before progressing.

## Execution
Read fully and follow: `steps/step-01-find-story.md`.
