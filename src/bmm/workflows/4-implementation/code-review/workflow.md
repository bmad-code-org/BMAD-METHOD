---
name: code-review
description: "Perform an adversarial senior developer code review with concrete findings across quality, tests, architecture, security, and performance"
main_config: '{project-root}/_bmad/bmm/config.yaml'
web_bundle: false
input_file_patterns:
  architecture:
    description: "System architecture for review context"
    whole: "{planning_artifacts}/*architecture*.md"
    sharded: "{planning_artifacts}/*architecture*/*.md"
    load_strategy: "FULL_LOAD"
  ux_design:
    description: "UX design specification (if UI review)"
    whole: "{planning_artifacts}/*ux*.md"
    sharded: "{planning_artifacts}/*ux*/*.md"
    load_strategy: "FULL_LOAD"
  epics:
    description: "Epic and story requirements for review context"
    whole: "{planning_artifacts}/*epic*.md"
    sharded: "{planning_artifacts}/*epic*/*.md"
    load_strategy: "FULL_LOAD"
---

# Code Review Workflow

## Goal
Run a rigorous review that validates story claims against code reality, surfaces actionable findings, and synchronizes story/sprint status.

## Workflow Architecture
- Uses step-file execution for predictable, auditable review flow.
- Read one step file fully, execute it, then continue to the next step.
- Do not load later steps before the current step completes.

## Initialization
- Load config from `{project-root}/_bmad/bmm/config.yaml`.
- Resolve variables:
  - `user_name`
  - `communication_language`
  - `document_output_language`
  - `user_skill_level`
  - `planning_artifacts`
  - `implementation_artifacts`
  - `story_dir` = `{implementation_artifacts}`
  - `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`
  - `project_context` = `**/project-context.md`
  - `date` (system-generated)
  - `installed_path` = `{project-root}/_bmad/bmm/workflows/4-implementation/code-review`

## Critical Rules
- Communicate in `{communication_language}`.
- Review implementation evidence, not assumptions.
- Verify acceptance criteria and completed tasks against actual files.
- Prioritize concrete, actionable findings with severity and evidence.
- Exclude generated/config-only folders from source-code review scope (`_bmad/`, `_bmad-output/`, `.cursor/`, `.windsurf/`, `.claude/`).

## Execution
Read fully and follow: `steps/step-01-load-story-and-changes.md`.
