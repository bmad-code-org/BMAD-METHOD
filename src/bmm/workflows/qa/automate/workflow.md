---
name: qa-automate
description: "Generate tests quickly for existing features using standard test patterns"
main_config: '{project-root}/_bmad/bmm/config.yaml'
web_bundle: false
---

## Initialization
- Load config from `{project-root}/_bmad/bmm/config.yaml`.
- Resolve variables:
  - `user_name`
  - `communication_language`
  - `document_output_language`
  - `output_folder`
  - `implementation_artifacts`
  - `installed_path`
  - `config_source`
  - `test_dir`
  - `source_dir`

# QA Automate Workflow

<critical>Communicate all responses in {communication_language}</critical>

<workflow>

<step n="1" goal="Generate automated tests">
  <action>Read and follow instructions at: {installed_path}/instructions.md</action>
  <action>Validate against checklist at: {installed_path}/checklist.md</action>
</step>

</workflow>
