---
name: sprint-status
description: "Summarize sprint-status.yaml, surface risks, and route to the right implementation workflow"
main_config: '{project-root}/_bmad/bmm/config.yaml'
web_bundle: false
---

## Initialization
- Load config from `{project-root}/_bmad/bmm/config.yaml`.
- Resolve variables:
  - `user_name`
  - `communication_language`
  - `document_output_language`
  - `implementation_artifacts`
  - `planning_artifacts`
  - `date` (system-generated)
  - `sprint_status_file` = `{implementation_artifacts}/sprint-status.yaml`
  - `installed_path` = `{project-root}/_bmad/bmm/workflows/4-implementation/sprint-status`

<workflow>
  <critical>Communicate all responses in {communication_language} and generate all documents in {document_output_language}</critical>

  <step n="1" goal="Summarize sprint progress and route next action">
    <action>Read and follow instructions at: {installed_path}/instructions.md</action>
  </step>
</workflow>
