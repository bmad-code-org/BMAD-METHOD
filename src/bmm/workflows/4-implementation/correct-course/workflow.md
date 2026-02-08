---
name: correct-course
description: "Navigate significant changes during sprint execution by analyzing impact, proposing solutions, and routing for implementation"
main_config: '{project-root}/_bmad/bmm/config.yaml'
web_bundle: false
input_file_patterns:
  prd:
    description: "Product requirements for impact analysis"
    whole: "{planning_artifacts}/*prd*.md"
    sharded: "{planning_artifacts}/*prd*/*.md"
    load_strategy: "FULL_LOAD"
  epics:
    description: "All epics to analyze change impact"
    whole: "{planning_artifacts}/*epic*.md"
    sharded: "{planning_artifacts}/*epic*/*.md"
    load_strategy: "FULL_LOAD"
  architecture:
    description: "System architecture and decisions"
    whole: "{planning_artifacts}/*architecture*.md"
    sharded: "{planning_artifacts}/*architecture*/*.md"
    load_strategy: "FULL_LOAD"
  ux_design:
    description: "UX design specification (if UI impacts)"
    whole: "{planning_artifacts}/*ux*.md"
    sharded: "{planning_artifacts}/*ux*/*.md"
    load_strategy: "FULL_LOAD"
  tech_spec:
    description: "Technical specification"
    whole: "{planning_artifacts}/*tech-spec*.md"
    load_strategy: "FULL_LOAD"
  document_project:
    description: "Brownfield project documentation (optional)"
    sharded: "{project_knowledge}/index.md"
    load_strategy: "INDEX_GUIDED"
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
  - `installed_path` = `{project-root}/_bmad/bmm/workflows/4-implementation/correct-course`
  - `source_path` = `{project-root}/src/bmm/workflows/4-implementation/correct-course`
  - Note: `installed_path` targets the installed runtime tree under `_bmad/...`; `source_path` is the repository authoring path.
  - `default_output_file` = `{planning_artifacts}/sprint-change-proposal-{date}.md`

<workflow>
  <critical>Communicate all responses in {communication_language} and generate all documents in {document_output_language}</critical>

  <step n="1" goal="Analyze changes and propose corrective actions">
    <action>Resolve workflow content path:
      - If `{installed_path}/instructions.md` exists and is readable, set {{workflow_path}} = `{installed_path}`
      - Else if `{source_path}/instructions.md` exists and is readable, set {{workflow_path}} = `{source_path}`
      - Else emit an error listing both paths and HALT
    </action>
    <action>Read and follow instructions at: {{workflow_path}}/instructions.md</action>
  </step>

  <step n="2" goal="Validate proposal quality">
    <action>If {{workflow_path}} is not set from step 1, repeat path resolution using checklist.md</action>
    <invoke-task>Validate against checklist at {{workflow_path}}/checklist.md using {project-root}/_bmad/core/tasks/validate-workflow.md</invoke-task>
  </step>
</workflow>
