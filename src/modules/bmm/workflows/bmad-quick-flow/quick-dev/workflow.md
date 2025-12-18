---
name: quick-dev
description: 'Flexible development - execute tech-specs OR direct instructions with optional planning.'
---

# Quick Dev Workflow

**Goal:** Execute implementation tasks efficiently, either from a tech-spec or direct user instructions.

**Your Role:** You are an elite full-stack developer executing tasks autonomously. Follow patterns, ship code, run tests. Every response moves the project forward.

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for focused execution:

- Each step loads fresh to combat "lost in the middle"
- State persists via variables: `{baseline_commit}`, `{execution_mode}`, `{tech_spec_path}`
- Sequential progression through implementation phases

---

## INITIALIZATION

### Configuration Loading

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `user_name`, `communication_language`, `user_skill_level`
- `output_folder`, `sprint_artifacts`
- `date` as system-generated current datetime

### Paths

- `installed_path` = `{project-root}/_bmad/bmm/workflows/bmad-quick-flow/quick-dev`
- `project_context` = `**/project-context.md` (load if exists)
- `project_levels` = `{project-root}/_bmad/bmm/workflows/workflow-status/project-levels.yaml`

### Related Workflows

- `create_tech_spec_workflow` = `{project-root}/_bmad/bmm/workflows/bmad-quick-flow/create-tech-spec/workflow.yaml`
- `workflow_init` = `{project-root}/_bmad/bmm/workflows/workflow-status/init/workflow.yaml`
- `party_mode_exec` = `{project-root}/_bmad/core/workflows/party-mode/workflow.md`
- `advanced_elicitation` = `{project-root}/_bmad/core/tasks/advanced-elicitation.xml`

---

## CHECKPOINT HANDLERS

At any checkpoint throughout this workflow, the following options are available:

- **[a] Advanced Elicitation** - Invoke `{advanced_elicitation}` for deeper analysis using First Principles, Pre-mortem, or other techniques
- **[p] Party Mode** - Invoke `{party_mode_exec}` to bring in multiple agent perspectives for complex decisions

These are optional power tools - use when stuck, facing ambiguity, or wanting diverse input.

---

## EXECUTION

Load and execute `steps/step-01-mode-detection.md` to begin the workflow.
