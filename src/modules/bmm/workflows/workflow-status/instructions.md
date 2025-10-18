# Workflow Status Check - Multi-Mode Service

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/bmm/workflows/workflow-status/workflow.yaml</critical>
<critical>This workflow operates in multiple modes: interactive (default), validate, data, init-check, update</critical>
<critical>Other workflows can call this as a service to avoid duplicating status logic</critical>

<workflow>

<step n="0" goal="Determine execution mode">
  <action>Check for {{mode}} parameter passed by calling workflow</action>
  <action>Default mode = "interactive" if not specified</action>

  <check if="mode == interactive">
    <action>Continue to Step 1 for normal status check flow</action>
  </check>

  <check if="mode == validate">
    <action>Jump to Step 10 for workflow validation service</action>
  </check>

  <check if="mode == data">
    <action>Jump to Step 20 for data extraction service</action>
  </check>

  <check if="mode == init-check">
    <action>Jump to Step 30 for simple init check</action>
  </check>

  <check if="mode == update">
    <action>Jump to Step 40 for status update service</action>
  </check>
</step>

<step n="1" goal="Check for status file">
<action>Search {output_folder}/ for file: bmm-workflow-status.md</action>

<check if="no status file found">
  <output>No workflow status found. To get started:

Load analyst agent and run: `workflow-init`

This will guide you through project setup and create your workflow path.</output>
<action>Exit workflow</action>
</check>

<check if="status file found">
  <action>Continue to step 2</action>
</check>
</step>

<step n="2" goal="Read and parse status">
<action>Read bmm-workflow-status.md</action>
<action>Extract key-value pairs from status file:</action>

Parse these fields:

- PROJECT_NAME
- PROJECT_TYPE
- PROJECT_LEVEL
- FIELD_TYPE
- CURRENT_PHASE
- CURRENT_WORKFLOW
- TODO_STORY
- IN_PROGRESS_STORY
- NEXT_ACTION
- NEXT_COMMAND
- NEXT_AGENT
  </step>

<step n="3" goal="Display current status and options">
<action>Load workflow path file to check for optional steps</action>
<action>Check if current workflow is in progress or complete</action>

<output>
## 📊 Current Status

**Project:** {{PROJECT_NAME}} (Level {{PROJECT_LEVEL}} {{PROJECT_TYPE}})
**Phase:** {{CURRENT_PHASE}}
**Current Workflow:** {{CURRENT_WORKFLOW}}

{{#if CURRENT_PHASE == "4-Implementation"}}
**Development Queue:**

- TODO: {{TODO_STORY}} - {{TODO_TITLE}}
- IN PROGRESS: {{IN_PROGRESS_STORY}} - {{IN_PROGRESS_TITLE}}
  {{/if}}

## 🎯 Your Options

{{#if CURRENT_WORKFLOW != "complete"}}
**Continue in progress:**

- {{CURRENT_WORKFLOW}} ({{CURRENT_AGENT}} agent)
  {{/if}}

**Next required step:**

- Command: `{{NEXT_COMMAND}}`
- Agent: {{NEXT_AGENT}}

{{#if optional_workflows_available}}
**Optional workflows available:**
{{#each optional_workflows}}

- {{workflow_name}} ({{agent}})
  {{/each}}
  {{/if}}
  </output>
  </step>

<step n="4" goal="Offer actions">
<ask>What would you like to do?

{{#if CURRENT_WORKFLOW != "complete"}}

1. **Continue current** - Resume {{CURRENT_WORKFLOW}}
   {{/if}}
2. **Next required** - {{NEXT_COMMAND}}
   {{#if optional_workflows_available}}
3. **Optional workflow** - Choose from available options
   {{/if}}
4. **View full status** - See complete status file
5. **Exit** - Return to agent

Your choice:</ask>

<action>Handle user selection based on available options</action>
</step>

<!-- ============================================= -->
<!-- SERVICE MODES - Called by other workflows -->
<!-- ============================================= -->

<step n="10" goal="Validate mode - Check if calling workflow should proceed">
<action>Read {output_folder}/bmm-workflow-status.md if exists</action>

<check if="status file not found">
  <template-output>status_exists = false</template-output>
  <template-output>should_proceed = true</template-output>
  <template-output>warning = "No status file found. Running without progress tracking."</template-output>
  <template-output>suggestion = "Consider running workflow-init first for progress tracking"</template-output>
  <action>Return to calling workflow</action>
</check>

<check if="status file found">
  <action>Parse status file fields</action>
  <action>Load workflow path file from WORKFLOW_PATH field</action>
  <action>Check if {{calling_workflow}} matches CURRENT_WORKFLOW or NEXT_COMMAND</action>

<template-output>status_exists = true</template-output>
<template-output>current_phase = {{CURRENT_PHASE}}</template-output>
<template-output>current_workflow = {{CURRENT_WORKFLOW}}</template-output>
<template-output>next_workflow = {{NEXT_COMMAND}}</template-output>
<template-output>project_level = {{PROJECT_LEVEL}}</template-output>
<template-output>project_type = {{PROJECT_TYPE}}</template-output>
<template-output>field_type = {{FIELD_TYPE}}</template-output>

  <check if="calling_workflow == current_workflow">
    <template-output>should_proceed = true</template-output>
    <template-output>warning = ""</template-output>
    <template-output>suggestion = "Resuming {{current_workflow}}"</template-output>
  </check>

  <check if="calling_workflow == next_workflow">
    <template-output>should_proceed = true</template-output>
    <template-output>warning = ""</template-output>
    <template-output>suggestion = "Proceeding with planned next step"</template-output>
  </check>

  <check if="calling_workflow != current_workflow AND calling_workflow != next_workflow">
    <action>Check if calling_workflow is in optional workflows list</action>

    <check if="is optional">
      <template-output>should_proceed = true</template-output>
      <template-output>warning = "Running optional workflow {{calling_workflow}}"</template-output>
      <template-output>suggestion = "This is optional. Expected next: {{next_workflow}}"</template-output>
    </check>

    <check if="not optional">
      <template-output>should_proceed = true</template-output>
      <template-output>warning = "⚠️ Out of sequence: Expected {{next_workflow}}, running {{calling_workflow}}"</template-output>
      <template-output>suggestion = "Consider running {{next_workflow}} instead, or continue if intentional"</template-output>
    </check>

  </check>

<template-output>status_file_path = {{path to bmm-workflow-status.md}}</template-output>
</check>

<action>Return control to calling workflow with all template outputs</action>
</step>

<step n="20" goal="Data mode - Extract specific information">
<action>Read {output_folder}/bmm-workflow-status.md if exists</action>

<check if="status file not found">
  <template-output>status_exists = false</template-output>
  <template-output>error = "No status file to extract data from"</template-output>
  <action>Return to calling workflow</action>
</check>

<check if="status file found">
  <action>Parse status file completely</action>
  <template-output>status_exists = true</template-output>

  <check if="data_request == next_story">
    <action>Extract from Development Queue section</action>
    <template-output>todo_story_id = {{TODO_STORY}}</template-output>
    <template-output>todo_story_title = {{TODO_TITLE}}</template-output>
    <template-output>in_progress_story = {{IN_PROGRESS_STORY}}</template-output>
    <template-output>stories_sequence = {{STORIES_SEQUENCE}}</template-output>
    <template-output>stories_done = {{STORIES_DONE}}</template-output>

    <action>Determine story file path based on ID format</action>
    <check if='todo_story_id matches "N.M" format'>
      <template-output>todo_story_file = "story-{{N}}.{{M}}.md"</template-output>
    </check>
    <check if='todo_story_id matches "slug-N" format'>
      <template-output>todo_story_file = "story-{{slug}}-{{N}}.md"</template-output>
    </check>
    <check if='todo_story_id matches "slug" format'>
      <template-output>todo_story_file = "story-{{slug}}.md"</template-output>
    </check>

  </check>

  <check if="data_request == project_config">
    <template-output>project_name = {{PROJECT_NAME}}</template-output>
    <template-output>project_type = {{PROJECT_TYPE}}</template-output>
    <template-output>project_level = {{PROJECT_LEVEL}}</template-output>
    <template-output>field_type = {{FIELD_TYPE}}</template-output>
    <template-output>workflow_path = {{WORKFLOW_PATH}}</template-output>
  </check>

  <check if="data_request == phase_status">
    <template-output>current_phase = {{CURRENT_PHASE}}</template-output>
    <template-output>phase_1_complete = {{PHASE_1_COMPLETE}}</template-output>
    <template-output>phase_2_complete = {{PHASE_2_COMPLETE}}</template-output>
    <template-output>phase_3_complete = {{PHASE_3_COMPLETE}}</template-output>
    <template-output>phase_4_complete = {{PHASE_4_COMPLETE}}</template-output>
  </check>

  <check if="data_request == all">
    <action>Return all parsed fields as template outputs</action>
  </check>

<template-output>status_file_path = {{path to bmm-workflow-status.md}}</template-output>
</check>

<action>Return control to calling workflow with requested data</action>
</step>

<step n="30" goal="Init-check mode - Simple existence check">
<action>Check if {output_folder}/bmm-workflow-status.md exists</action>

<check if="exists">
  <template-output>status_exists = true</template-output>
  <template-output>suggestion = "Status file found. Ready to proceed."</template-output>
</check>

<check if="not exists">
  <template-output>status_exists = false</template-output>
  <template-output>suggestion = "No status file. Run workflow-init to create one (optional for progress tracking)"</template-output>
</check>

<action>Return immediately to calling workflow</action>
</step>

<step n="40" goal="Update mode - Centralized status file updates">
<action>Read {output_folder}/bmm-workflow-status.md</action>

<check if="status file not found">
  <template-output>success = false</template-output>
  <template-output>error = "No status file found. Cannot update."</template-output>
  <action>Return to calling workflow</action>
</check>

<check if="status file found">
  <action>Parse all current values from status file</action>
  <action>Load workflow path file from WORKFLOW_PATH field</action>
  <action>Check {{action}} parameter to determine update type</action>

  <!-- ============================================= -->
  <!-- ACTION: complete_workflow -->
  <!-- ============================================= -->
  <check if="action == complete_workflow">
    <action>Get {{workflow_name}} parameter (required)</action>

    <action>Mark workflow complete:</action>
    - Update CURRENT_WORKFLOW to "{{workflow_name}} - Complete"

    <action>Find {{workflow_name}} in loaded path YAML</action>
    <action>Determine next workflow from path sequence</action>

    <action>Update Next Action fields:</action>
    - NEXT_ACTION: Description from next workflow in path
    - NEXT_COMMAND: Command for next workflow
    - NEXT_AGENT: Agent for next workflow
    - CURRENT_WORKFLOW: Set to next workflow name (or "Complete" if no more)
    - CURRENT_AGENT: Set to next agent

    <action>Check if phase complete:</action>
    - If {{workflow_name}} is last required workflow in current phase
    - Update PHASE_X_COMPLETE to true
    - Update CURRENT_PHASE to next phase (if applicable)

    <check if="populate_stories_from parameter provided">
      <action>Trigger story population (see populate_stories action below)</action>
    </check>

    <action>Update LAST_UPDATED to {{date}}</action>
    <action>Save status file</action>

    <template-output>success = true</template-output>
    <template-output>next_workflow = {{determined next workflow}}</template-output>
    <template-output>next_agent = {{determined next agent}}</template-output>
    <template-output>phase_complete = {{true/false}}</template-output>

  </check>

  <!-- ============================================= -->
  <!-- ACTION: populate_stories -->
  <!-- ============================================= -->
  <check if="action == populate_stories">
    <action>Get {{epics_file}} parameter (required - path to epics.md)</action>

    <action>Read {{epics_file}} completely</action>
    <action>Parse all story definitions from epic sections</action>
    <action>Extract story IDs in sequential order (e.g., story-1.1, story-1.2, story-2.1...)</action>
    <action>Extract story titles for each ID</action>

    <action>Build ordered story list:</action>
    - Format: JSON array or comma-separated
    - Example: ["story-1.1", "story-1.2", "story-1.3", "story-2.1"]

    <action>Update status file:</action>
    - STORIES_SEQUENCE: {{ordered_story_list}}
    - TODO_STORY: {{first_story_id}}
    - TODO_TITLE: {{first_story_title}}
    - IN_PROGRESS_STORY: (empty)
    - IN_PROGRESS_TITLE: (empty)
    - STORIES_DONE: []

    <action>Update LAST_UPDATED to {{date}}</action>
    <action>Save status file</action>

    <template-output>success = true</template-output>
    <template-output>total_stories = {{count}}</template-output>
    <template-output>first_story = {{first_story_id}}</template-output>

  </check>

  <!-- ============================================= -->
  <!-- ACTION: start_story (TODO → IN PROGRESS) -->
  <!-- ============================================= -->
  <check if="action == start_story">
    <action>Get current TODO_STORY from status file</action>

    <check if="TODO_STORY is empty">
      <template-output>success = false</template-output>
      <template-output>error = "No TODO story to start"</template-output>
      <action>Return to calling workflow</action>
    </check>

    <action>Move TODO → IN PROGRESS:</action>
    - IN_PROGRESS_STORY: {{current TODO_STORY}}
    - IN_PROGRESS_TITLE: {{current TODO_TITLE}}

    <action>Find next story in STORIES_SEQUENCE after current TODO_STORY</action>

    <check if="next story found">
      <action>Move next story to TODO:</action>
      - TODO_STORY: {{next_story_id}}
      - TODO_TITLE: {{next_story_title}}
    </check>

    <check if="no next story">
      <action>Clear TODO:</action>
      - TODO_STORY: (empty)
      - TODO_TITLE: (empty)
    </check>

    <action>Update NEXT_ACTION and NEXT_COMMAND:</action>
    - NEXT_ACTION: "Implement story {{IN_PROGRESS_STORY}}"
    - NEXT_COMMAND: "dev-story"
    - NEXT_AGENT: "dev"

    <action>Update LAST_UPDATED to {{date}}</action>
    <action>Save status file</action>

    <template-output>success = true</template-output>
    <template-output>in_progress_story = {{IN_PROGRESS_STORY}}</template-output>
    <template-output>next_todo = {{TODO_STORY or empty}}</template-output>

  </check>

  <!-- ============================================= -->
  <!-- ACTION: complete_story (IN PROGRESS → DONE) -->
  <!-- ============================================= -->
  <check if="action == complete_story">
    <action>Get current IN_PROGRESS_STORY from status file</action>

    <check if="IN_PROGRESS_STORY is empty">
      <template-output>success = false</template-output>
      <template-output>error = "No IN PROGRESS story to complete"</template-output>
      <action>Return to calling workflow</action>
    </check>

    <action>Move IN PROGRESS → DONE:</action>
    - Add {{IN_PROGRESS_STORY}} to STORIES_DONE list

    <action>Move TODO → IN PROGRESS:</action>
    - IN_PROGRESS_STORY: {{current TODO_STORY}}
    - IN_PROGRESS_TITLE: {{current TODO_TITLE}}

    <action>Find next story in STORIES_SEQUENCE after current TODO_STORY</action>

    <check if="next story found">
      <action>Move next story to TODO:</action>
      - TODO_STORY: {{next_story_id}}
      - TODO_TITLE: {{next_story_title}}
    </check>

    <check if="no next story">
      <action>Clear TODO:</action>
      - TODO_STORY: (empty)
      - TODO_TITLE: (empty)
    </check>

    <check if="all stories complete (STORIES_DONE == STORIES_SEQUENCE)">
      <action>Mark Phase 4 complete:</action>
      - PHASE_4_COMPLETE: true
      - CURRENT_WORKFLOW: "Complete"
      - NEXT_ACTION: "All stories complete!"
      - NEXT_COMMAND: (empty)
    </check>

    <check if="stories remain">
      <action>Update NEXT_ACTION:</action>
      - If IN_PROGRESS_STORY exists: "Implement story {{IN_PROGRESS_STORY}}"
      - If only TODO_STORY exists: "Draft story {{TODO_STORY}}"
      - NEXT_COMMAND: "dev-story" or "create-story"
    </check>

    <action>Update LAST_UPDATED to {{date}}</action>
    <action>Save status file</action>

    <template-output>success = true</template-output>
    <template-output>completed_story = {{completed_story_id}}</template-output>
    <template-output>stories_remaining = {{count}}</template-output>
    <template-output>all_complete = {{true/false}}</template-output>

  </check>

  <!-- ============================================= -->
  <!-- ACTION: set_current_workflow (manual override) -->
  <!-- ============================================= -->
  <check if="action == set_current_workflow">
    <action>Get {{workflow_name}} parameter (required)</action>
    <action>Get {{agent_name}} parameter (optional)</action>

    <action>Update current workflow:</action>
    - CURRENT_WORKFLOW: {{workflow_name}}
    - CURRENT_AGENT: {{agent_name or infer from path}}

    <action>Find {{workflow_name}} in path to determine next:</action>
    - NEXT_ACTION: Next workflow description
    - NEXT_COMMAND: Next workflow command
    - NEXT_AGENT: Next workflow agent

    <action>Update LAST_UPDATED to {{date}}</action>
    <action>Save status file</action>

    <template-output>success = true</template-output>

  </check>

  <!-- ============================================= -->
  <!-- Unknown action -->
  <!-- ============================================= -->
  <check if="action not recognized">
    <template-output>success = false</template-output>
    <template-output>error = "Unknown action: {{action}}. Valid actions: complete_workflow, populate_stories, start_story, complete_story, set_current_workflow"</template-output>
  </check>

</check>

<action>Return control to calling workflow with template outputs</action>
</step>

</workflow>
