---
name: dev-story
description: "Execute a story by implementing tasks/subtasks, writing tests, validating, and updating the story file per acceptance criteria"
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
- Load config from `{project-root}/_bmad/bmm/config.yaml`.
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
  - `installed_path` = `{project-root}/_bmad/bmm/workflows/4-implementation/dev-story`

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

## Execution
Read fully and follow: `steps/step-01-find-story.md`.
