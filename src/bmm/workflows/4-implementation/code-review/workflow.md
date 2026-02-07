---
name: code-review
description: "Perform an adversarial senior developer code review with concrete findings across quality, tests, architecture, security, and performance"
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
  - `story_dir` = `{implementation_artifacts}`
  - `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`
  - `project_context` = `**/project-context.md`
  - `date` (system-generated)
  - `installed_path` = `{project-root}/_bmad/bmm/workflows/4-implementation/code-review`

<workflow>
  <critical>Communicate all responses in {communication_language} and generate all documents in {document_output_language}</critical>

  <step n="1" goal="Perform review">
    <action>Read and follow instructions at: {installed_path}/instructions.xml</action>
  </step>

  <step n="2" goal="Validate review checklist">
    <invoke-task>Validate against checklist at {installed_path}/checklist.md using _bmad/core/tasks/validate-workflow.md</invoke-task>
  </step>
</workflow>
