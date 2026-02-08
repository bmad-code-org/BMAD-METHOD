---
name: correct-course
description: "Navigate significant changes during sprint execution by analyzing impact, proposing solutions, and routing for implementation"
main_config: '{project-root}/_bmad/bmm/config.yaml'
web_bundle: false
---

## Initialization
- Load config from `{project-root}/_bmad/bmm/config.yaml`.
- Resolve variables:
  - `user_name`
  - `communication_language`
  - `document_output_language`
  - `user_skill_level`
  - `planning_artifacts`
  - `implementation_artifacts`
  - `project_knowledge`
  - `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`
  - `date` (system-generated)
  - `installed_path` = `src/bmm/workflows/4-implementation/correct-course`
  - `default_output_file` = `{planning_artifacts}/sprint-change-proposal-{date}.md`

<workflow>
  <critical>Communicate all responses in {communication_language} and generate all documents in {document_output_language}</critical>

  <step n="1" goal="Analyze changes and propose corrective actions">
    <action>Read and follow instructions at: {installed_path}/instructions.md</action>
  </step>

  <step n="2" goal="Validate proposal quality">
    <invoke-task>Validate against checklist at {installed_path}/checklist.md using src/core/tasks/validate-workflow.md</invoke-task>
  </step>
</workflow>
