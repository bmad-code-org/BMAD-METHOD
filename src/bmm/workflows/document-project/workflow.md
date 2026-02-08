---
name: document-project
description: "Analyzes and documents brownfield projects by scanning codebase, architecture, and patterns to create comprehensive reference documentation for AI-assisted development"
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
  - `project_knowledge`
  - `date` (system-generated)
  - `installed_path` = `{project-root}/_bmad/bmm/workflows/document-project`
  - `documentation_requirements_csv` = `{installed_path}/documentation-requirements.csv`

<workflow>
  <critical>Communicate all responses in {communication_language} and generate all documents in {document_output_language}</critical>

  <step n="1" goal="Document existing project">
    <action>Read and follow instructions at: {installed_path}/instructions.md</action>
  </step>

  <step n="2" goal="Validate outputs">
    <invoke-task>Validate against checklist at {installed_path}/checklist.md using _bmad/core/tasks/validate-workflow.md</invoke-task>
  </step>
</workflow>
