---
name: retrospective
description: "Run after epic completion to review overall success, extract lessons learned, and surface impact on upcoming work"
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
  - `sprint_status_file` = `{implementation_artifacts}/sprint-status.yaml`
  - `story_directory` = `{implementation_artifacts}`
  - `retrospectives_folder` = `{implementation_artifacts}`
  - `date` (system-generated)
  - `installed_path` = `{project-root}/_bmad/bmm/workflows/4-implementation/retrospective`

<workflow>
  <critical>Communicate all responses in {communication_language} and generate all documents in {document_output_language}</critical>

  <step n="1" goal="Run retrospective">
    <action>Read and follow instructions at: {installed_path}/instructions.md</action>
  </step>
</workflow>
