---
name: retrospective
description: "Run after epic completion to review overall success, extract lessons learned, and surface impact on upcoming work"
main_config: '{project-root}/_bmad/bmm/config.yaml'
web_bundle: false
agent_manifest: '{project-root}/_bmad/_config/agent-manifest.csv'
input_file_patterns:
  epics:
    description: "The completed epic for retrospective"
    whole: "{planning_artifacts}/*epic*.md"
    sharded_index: "{planning_artifacts}/*epic*/index.md"
    sharded_single: "{planning_artifacts}/*epic*/epic-{{epic_num}}.md"
    load_strategy: "SELECTIVE_LOAD"
  previous_retrospective:
    description: "Previous epic's retrospective (optional)"
    pattern: "{implementation_artifacts}/**/epic-{{prev_epic_num}}-retro-*.md"
    load_strategy: "SELECTIVE_LOAD"
  architecture:
    description: "System architecture for context"
    whole: "{planning_artifacts}/*architecture*.md"
    sharded: "{planning_artifacts}/*architecture*/*.md"
    load_strategy: "FULL_LOAD"
  prd:
    description: "Product requirements for context"
    whole: "{planning_artifacts}/*prd*.md"
    sharded: "{planning_artifacts}/*prd*/*.md"
    load_strategy: "FULL_LOAD"
  document_project:
    description: "Brownfield project documentation (optional)"
    sharded: "{planning_artifacts}/*.md"
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
  - `agent_manifest` = `{project-root}/_bmad/_config/agent-manifest.csv`
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
