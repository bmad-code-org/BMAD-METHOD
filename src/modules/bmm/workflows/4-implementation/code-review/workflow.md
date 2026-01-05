---
name: code-review
description: 'Code review for dev-story output. Audits acceptance criteria against implementation, performs adversarial diff review, can auto-fix with approval. A different LLM than the implementer is recommended.'
web_bundle: false
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
