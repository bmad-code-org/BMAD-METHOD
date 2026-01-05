---
name: code-review
description: 'Code review for dev-story output. Audits acceptance criteria against implementation, performs adversarial diff review, can auto-fix with approval. A different LLM than the implementer is recommended.'
web_bundle: false

input_file_patterns:
  architecture:
    description: 'System architecture for review context'
    whole: '{planning_artifacts}/*architecture*.md'
    sharded: '{planning_artifacts}/*architecture*/*.md'
    load_strategy: 'FULL_LOAD'
  ux_design:
    description: 'UX design specification (if UI review)'
    whole: '{planning_artifacts}/*ux*.md'
    sharded: '{planning_artifacts}/*ux*/*.md'
    load_strategy: 'FULL_LOAD'
  epics:
    description: 'Epic containing story being reviewed'
    whole: '{planning_artifacts}/*epic*.md'
    sharded_index: '{planning_artifacts}/*epic*/index.md'
    sharded_single: '{planning_artifacts}/*epic*/epic-{{epic_num}}.md'
    load_strategy: 'SELECTIVE_LOAD'
---

# Code Review Workflow

## WORKFLOW ARCHITECTURE: STEP FILES

- This file (workflow.md) stays in context throughout
- Each step file is read just before processing (current step stays at end of context)
- State persists via variables: `{story_path}`, `{story_key}`, `{context_aware_findings}`, `{asymmetric_findings}`

---

## INITIALIZATION

### Configuration Loading

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `user_name`, `communication_language`, `user_skill_level`, `document_output_language`
- `planning_artifacts`, `implementation_artifacts`
- `date` as system-generated current datetime

- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Paths

- `installed_path` = `{project-root}/_bmad/bmm/workflows/4-implementation/code-review`
- `project_context` = `**/project-context.md` (load if exists)
- `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`

---

## EXECUTION

Read and follow `steps/step-01-load-story.md` to begin the workflow.
