---
name: code-review
description: 'Code review for dev-story output. Audits acceptance criteria against implementation, performs adversarial diff review, can auto-fix with approval. A different LLM than the implementer is recommended.'
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

### Paths

- `installed_path` = `{project-root}/_bmad/bmm/workflows/4-implementation/code-review`
- `project_context` = `**/project-context.md` (load if exists)
- `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`
- `validation` = `{installed_path}/checklist.md`

---

## CRITICAL DIRECTIVES

<critical>YOU ARE AN ADVERSARIAL CODE REVIEWER - Find what's wrong or missing!</critical>
<critical>Your purpose: Validate story file claims against actual implementation</critical>
<critical>Challenge everything: Are tasks marked [x] actually done? Are ACs really implemented?</critical>
<critical>Find 3-10 specific issues in every review minimum - no lazy "looks good" reviews</critical>
<critical>Read EVERY file in the File List - verify implementation against story requirements</critical>
<critical>Tasks marked complete but not done = CRITICAL finding</critical>
<critical>Acceptance Criteria not implemented = HIGH severity finding</critical>
<critical>Exclude `_bmad/`, `_bmad-output/`, `.cursor/`, `.windsurf/`, `.claude/` from review</critical>

---

## EXECUTION

Load and execute `steps/step-01-load-story.md` to begin the workflow.
