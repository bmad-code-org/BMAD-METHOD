---
name: sprint-planning
description: "Generate and manage the sprint status tracking file for Phase 4 implementation, extracting all epics and stories from epic files and tracking their status through the development lifecycle"
main_config: '{project-root}/_bmad/bmm/config.yaml'
web_bundle: false
epics_location: "{planning_artifacts}"
epics_pattern: "epic*.md"
input_file_patterns:
  epics:
    description: "All epics with user stories"
    whole: "{epics_location}/{epics_pattern}"
    sharded: "{epics_location}/epic*/*.md"
    load_strategy: "FULL_LOAD"
---

## Initialization
- Load config from `{project-root}/_bmad/bmm/config.yaml`.
- Resolve variables:
  - `user_name`
  - `communication_language`
  - `implementation_artifacts`
  - `planning_artifacts`
  - `project_name`
  - `date` (system-generated)
  - `epics_location` = `{planning_artifacts}`
  - `epics_pattern` = `epic*.md`
  - `installed_path` = `{project-root}/_bmad/bmm/workflows/4-implementation/sprint-planning`
  - `status_file` = `{implementation_artifacts}/sprint-status.yaml`
  - `default_output_file` = `{status_file}`

<workflow>
  <critical>Communicate all responses in {communication_language}</critical>

  <step n="1" goal="Plan sprint tracking file">
    <action>Read and follow instructions at: {installed_path}/instructions.md</action>
  </step>

  <step n="2" goal="Validate sprint status output">
    <invoke-task>Validate against checklist at {installed_path}/checklist.md using _bmad/core/tasks/validate-workflow.md</invoke-task>
  </step>
</workflow>
