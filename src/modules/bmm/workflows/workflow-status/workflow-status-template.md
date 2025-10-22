# BMM Workflow Status

## Project Configuration

PROJECT_NAME: {{project_name}}
PROJECT_TYPE: {{project_type}}
PROJECT_LEVEL: {{project_level}}
FIELD_TYPE: {{field_type}}
START_DATE: {{start_date}}
WORKFLOW_PATH: {{workflow_path_file}}

## Current State

CURRENT_PHASE: {{current_phase}}
CURRENT_WORKFLOW: {{current_workflow}}
CURRENT_AGENT: {{current_agent}}
PHASE_1_COMPLETE: {{phase_1_complete}}
PHASE_2_COMPLETE: {{phase_2_complete}}
PHASE_3_COMPLETE: {{phase_3_complete}}
PHASE_4_COMPLETE: {{phase_4_complete}}

## Next Action

NEXT_ACTION: {{next_action}}
NEXT_COMMAND: {{next_command}}
NEXT_AGENT: {{next_agent}}

## Story Backlog

{{#backlog_stories}}

- {{story_id}}: {{story_title}}
  {{/backlog_stories}}

## Completed Stories

{{#done_stories}}

- {{story_id}}: {{completed_date}}
  {{/done_stories}}

---

_Last Updated: {{last_updated}}_
_Status Version: 2.0_
