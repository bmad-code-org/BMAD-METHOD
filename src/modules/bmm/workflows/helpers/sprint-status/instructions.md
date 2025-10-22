# Sprint Status Helper - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>This is a HELPER workflow - it performs operations on sprint-status.yaml and returns results to the calling workflow via variables</critical>

<workflow>

<step n="1" goal="Validate action parameter and load sprint status file">
  <action>Check if {{action}} parameter is provided and not empty</action>

  <check if="{{action}} is empty or not provided">
    <action>Set result_success = false</action>
    <action>Set result_error = "Action parameter is required. See workflow.yaml for supported actions."</action>
    <output>❌ Sprint Status Helper Error: No action specified</output>
    <action>HALT - return to calling workflow with error</action>
  </check>

<action>Check if sprint status file exists at {status_file}</action>

  <check if="file does not exist">
    <action>Set result_success = false</action>
    <action>Set result_error = "file_not_found"</action>
    <action>Set result_file_path = {status_file}</action>

    <check if="{{show_output}} == true">
      <output>❌ Sprint status file not found at: {status_file}

Please run the sprint-planning workflow first to initialize tracking.
</output>
</check>

    <action>HALT - return to calling workflow with error</action>

  </check>

<action>Read complete sprint status file from {status_file}</action>
<action>Parse YAML structure into memory</action>
<action>Extract metadata fields: generated, project, project_key, tracking_system, story_location</action>
<action>Extract development_status map: all epic and story keys with their current status values</action>

  <check if="YAML parsing fails">
    <action>Set result_success = false</action>
    <action>Set result_error = "Invalid YAML format in sprint-status.yaml"</action>
    <output>❌ Sprint status file is malformed. Run sprint-planning to regenerate.</output>
    <action>HALT - return to calling workflow with error</action>
  </check>
</step>

<step n="2" goal="Dispatch to action handler">
  <action>Route to appropriate action handler based on {{action}} value</action>

  <check if="{{action}} == 'get_next_story'">
    <goto step="3">Get Next Story</goto>
  </check>

  <check if="{{action}} == 'list_stories'">
    <goto step="4">List Stories</goto>
  </check>

  <check if="{{action}} == 'get_story_status'">
    <goto step="5">Get Story Status</goto>
  </check>

  <check if="{{action}} == 'get_epic_status'">
    <goto step="6">Get Epic Status</goto>
  </check>

  <check if="{{action}} == 'check_epic_complete'">
    <goto step="7">Check Epic Complete</goto>
  </check>

  <check if="{{action}} == 'update_story_status'">
    <goto step="8">Update Story Status</goto>
  </check>

  <check if="{{action}} == 'update_epic_status'">
    <goto step="9">Update Epic Status</goto>
  </check>

  <check if="{{action}} == 'complete_retrospective'">
    <goto step="10">Complete Retrospective</goto>
  </check>

  <check if="{{action}} == 'validate_transition'">
    <goto step="11">Validate Transition</goto>
  </check>

  <check if="{{action}} == 'get_metadata'">
    <goto step="12">Get Metadata</goto>
  </check>

  <check if="{{action}} == 'get_file_path'">
    <goto step="13">Get File Path</goto>
  </check>

  <check if="action does not match any handler">
    <action>Set result_success = false</action>
    <action>Set result_error = "Unknown action: {{action}}"</action>
    <output>❌ Unknown action: {{action}}

Supported actions: get_next_story, list_stories, get_story_status, get_epic_status, check_epic_complete, update_story_status, update_epic_status, complete_retrospective, validate_transition, get_metadata, get_file_path
</output>
<action>HALT - return to calling workflow with error</action>
</check>
</step>

<!-- ========================================
     ACTION HANDLERS - READ OPERATIONS
     ======================================== -->

<step n="3" goal="Action: get_next_story">
  <action>Filter development_status map to find stories (keys matching pattern: number-number-name, not epic-X or epic-X-retrospective)</action>

  <check if="{{filter_status}} is provided and not empty">
    <action>Further filter to only stories where status == {{filter_status}}</action>
  </check>

  <check if="{{epic_filter}} is provided and not empty">
    <action>Further filter to only stories from epic {{epic_filter}} (keys starting with "{{epic_filter}}-")</action>
  </check>

<action>From filtered list, select the FIRST story (stories are in order in the file)</action>

  <check if="story found">
    <action>Extract story key (e.g., "1-1-user-authentication")</action>
    <action>Parse epic_id from key (first number before dash)</action>
    <action>Parse story_id from key (second number after first dash)</action>
    <action>Get current status value from development_status map</action>

    <action>Set result_found = true</action>
    <action>Set result_story_key = extracted story key</action>
    <action>Set result_story_status = current status</action>
    <action>Set result_epic_id = extracted epic id</action>
    <action>Set result_story_id = extracted story id</action>
    <action>Set result_success = true</action>

    <check if="{{show_output}} == true">
      <output>📋 Next {{filter_status}} story: {{result_story_key}} (Epic {{result_epic_id}}, Story {{result_story_id}})</output>
    </check>

  </check>

  <check if="no story found">
    <action>Set result_found = false</action>
    <action>Set result_story_key = ""</action>
    <action>Set result_story_status = ""</action>
    <action>Set result_epic_id = ""</action>
    <action>Set result_story_id = ""</action>
    <action>Set result_success = true</action>

    <check if="{{show_output}} == true">
      <output>ℹ️ No {{filter_status}} stories found{{#if epic_filter}} in {{epic_filter}}{{/if}}</output>
    </check>

  </check>

<action>COMPLETE - return to calling workflow</action>
</step>

<step n="4" goal="Action: list_stories">
  <action>Filter development_status map to find all stories (keys matching pattern: number-number-name)</action>

  <check if="{{filter_status}} is provided and not empty">
    <action>Further filter to only stories where status == {{filter_status}}</action>
  </check>

  <check if="{{epic_filter}} is provided and not empty">
    <action>Further filter to only stories from epic {{epic_filter}}</action>
  </check>

<action>Collect all matching story keys into an array</action>
<action>Apply limit: if more than {{limit}} stories, take first {{limit}} only</action>

<action>Set result_count = number of stories found (before limit applied)</action>
<action>Set result_stories = array of story keys ["1-1-auth", "1-2-nav", ...]</action>
<action>Set result_story_list = comma-separated string of keys "1-1-auth, 1-2-nav, ..."</action>
<action>Set result_success = true</action>

  <check if="{{show_output}} == true">
    <output>📋 Found {{result_count}} {{filter_status}} stories{{#if epic_filter}} in {{epic_filter}}{{/if}}{{#if result_count > limit}} (showing first {{limit}}){{/if}}</output>
  </check>

<action>COMPLETE - return to calling workflow</action>
</step>

<step n="5" goal="Action: get_story_status">
  <action>Validate {{story_key}} is provided</action>

  <check if="{{story_key}} is empty">
    <action>Set result_success = false</action>
    <action>Set result_error = "story_key parameter required for get_story_status"</action>
    <action>HALT - return to calling workflow with error</action>
  </check>

<action>Look up {{story_key}} in development_status map</action>

  <check if="story key found">
    <action>Get status value from map</action>
    <action>Set result_found = true</action>
    <action>Set result_status = status value</action>
    <action>Set result_success = true</action>

    <check if="{{show_output}} == true">
      <output>📋 Story {{story_key}} status: {{result_status}}</output>
    </check>

  </check>

  <check if="story key not found">
    <action>Set result_found = false</action>
    <action>Set result_status = ""</action>
    <action>Set result_success = true</action>

    <check if="{{show_output}} == true">
      <output>⚠️ Story {{story_key}} not found in sprint-status.yaml</output>
    </check>

  </check>

<action>COMPLETE - return to calling workflow</action>
</step>

<step n="6" goal="Action: get_epic_status">
  <action>Validate {{epic_id}} is provided</action>

  <check if="{{epic_id}} is empty">
    <action>Set result_success = false</action>
    <action>Set result_error = "epic_id parameter required for get_epic_status"</action>
    <action>HALT - return to calling workflow with error</action>
  </check>

<action>Construct epic key: "epic-{{epic_id}}" (e.g., "epic-1")</action>
<action>Look up epic key in development_status map</action>

  <check if="epic key found">
    <action>Get status value from map</action>

    <action>Count total stories in this epic (keys starting with "{{epic_id}}-")</action>
    <action>Count done stories in this epic (keys starting with "{{epic_id}}-" where status == "done")</action>
    <action>Determine if complete: true if done_count == story_count AND all stories exist</action>

    <action>Set result_found = true</action>
    <action>Set result_status = epic status value</action>
    <action>Set result_story_count = total story count</action>
    <action>Set result_done_count = done story count</action>
    <action>Set result_complete = true/false based on completion check</action>
    <action>Set result_success = true</action>

    <check if="{{show_output}} == true">
      <output>📋 Epic {{epic_id}} status: {{result_status}} ({{result_done_count}}/{{result_story_count}} stories done)</output>
    </check>

  </check>

  <check if="epic key not found">
    <action>Set result_found = false</action>
    <action>Set result_status = ""</action>
    <action>Set result_story_count = 0</action>
    <action>Set result_done_count = 0</action>
    <action>Set result_complete = false</action>
    <action>Set result_success = true</action>

    <check if="{{show_output}} == true">
      <output>⚠️ Epic {{epic_id}} not found in sprint-status.yaml</output>
    </check>

  </check>

<action>COMPLETE - return to calling workflow</action>
</step>

<step n="7" goal="Action: check_epic_complete">
  <action>Validate {{epic_id}} is provided</action>

  <check if="{{epic_id}} is empty">
    <action>Set result_success = false</action>
    <action>Set result_error = "epic_id parameter required for check_epic_complete"</action>
    <action>HALT - return to calling workflow with error</action>
  </check>

<action>Find all stories for epic {{epic_id}} (keys starting with "{{epic_id}}-")</action>
<action>Count total stories found</action>
<action>Count stories with status == "done"</action>
<action>Collect list of pending stories (status != "done")</action>

<action>Determine complete: true if all stories are done, false otherwise</action>

<action>Set result_complete = true/false</action>
<action>Set result_total_stories = total count</action>
<action>Set result_done_stories = done count</action>
<action>Set result_pending_stories = array of pending story keys</action>
<action>Set result_success = true</action>

  <check if="{{show_output}} == true">
    <output>📊 Epic {{epic_id}}: {{result_done_stories}}/{{result_total_stories}} stories complete{{#if result_complete}} ✅{{/if}}</output>
  </check>

<action>COMPLETE - return to calling workflow</action>
</step>

<!-- ========================================
     ACTION HANDLERS - WRITE OPERATIONS
     ======================================== -->

<step n="8" goal="Action: update_story_status">
  <action>Validate {{story_key}} is provided</action>
  <action>Validate {{new_status}} is provided</action>

  <check if="{{story_key}} is empty OR {{new_status}} is empty">
    <action>Set result_success = false</action>
    <action>Set result_error = "story_key and new_status parameters required for update_story_status"</action>
    <action>HALT - return to calling workflow with error</action>
  </check>

<action>Look up {{story_key}} in development_status map</action>

  <check if="story key not found">
    <action>Set result_success = false</action>
    <action>Set result_error = "Story {{story_key}} not found in sprint-status.yaml"</action>

    <check if="{{show_output}} == true">
      <output>❌ Story {{story_key}} not found in tracking file</output>
    </check>

    <action>HALT - return to calling workflow with error</action>

  </check>

<action>Get current status (old_status) from map</action>

  <check if="{{validate}} == true">
    <action>Check if transition from old_status → {{new_status}} is legal</action>

    <action>Define legal transitions:
      - backlog → drafted
      - drafted → ready-for-dev OR drafted (re-edit)
      - ready-for-dev → in-progress OR drafted (corrections)
      - in-progress → review OR in-progress (continue work)
      - review → done OR in-progress (corrections needed)
      - done → done (idempotent)
    </action>

    <check if="transition is NOT legal">
      <action>Set result_success = false</action>
      <action>Set result_error = "Invalid transition: {{old_status}} → {{new_status}}"</action>
      <action>Set result_validation_message = "Stories must follow workflow: backlog → drafted → ready-for-dev → in-progress → review → done"</action>

      <check if="{{show_output}} == true">
        <output>❌ Invalid status transition for {{story_key}}: {{old_status}} → {{new_status}}

Legal workflow path: backlog → drafted → ready-for-dev → in-progress → review → done
Stories can move backward for corrections (e.g., review → in-progress)
</output>
</check>

      <action>HALT - return to calling workflow with error</action>
    </check>

  </check>

  <check if="{{dry_run}} == false">
    <action>Update development_status map: set {{story_key}} = {{new_status}}</action>
    <action>Write updated YAML back to {status_file}</action>
    <action>Preserve all metadata and comments in file</action>
    <action>Maintain story order in development_status section</action>
  </check>

<action>Set result_success = true</action>
<action>Set result_old_status = old_status</action>
<action>Set result_new_status = {{new_status}}</action>
<action>Set result_story_key = {{story_key}}</action>

  <check if="{{show_output}} == true">
    <output>✅ Updated sprint-status: {{story_key}} → {{new_status}}{{#if dry_run}} (DRY RUN - not saved){{/if}}</output>
  </check>

<action>COMPLETE - return to calling workflow</action>
</step>

<step n="9" goal="Action: update_epic_status">
  <action>Validate {{epic_id}} is provided</action>
  <action>Validate {{new_status}} is provided</action>

  <check if="{{epic_id}} is empty OR {{new_status}} is empty">
    <action>Set result_success = false</action>
    <action>Set result_error = "epic_id and new_status parameters required for update_epic_status"</action>
    <action>HALT - return to calling workflow with error</action>
  </check>

<action>Construct epic key: "epic-{{epic_id}}"</action>
<action>Look up epic key in development_status map</action>

  <check if="epic key not found">
    <action>Set result_success = false</action>
    <action>Set result_error = "Epic {{epic_id}} not found in sprint-status.yaml"</action>

    <check if="{{show_output}} == true">
      <output>❌ Epic {{epic_id}} not found in tracking file</output>
    </check>

    <action>HALT - return to calling workflow with error</action>

  </check>

<action>Get current status (old_status) from map</action>

  <check if="{{dry_run}} == false">
    <action>Update development_status map: set "epic-{{epic_id}}" = {{new_status}}</action>
    <action>Write updated YAML back to {status_file}</action>
  </check>

<action>Set result_success = true</action>
<action>Set result_old_status = old_status</action>
<action>Set result_new_status = {{new_status}}</action>

  <check if="{{show_output}} == true">
    <output>✅ Updated sprint-status: epic-{{epic_id}} → {{new_status}}{{#if dry_run}} (DRY RUN - not saved){{/if}}</output>
  </check>

<action>COMPLETE - return to calling workflow</action>
</step>

<step n="10" goal="Action: complete_retrospective">
  <action>Validate {{epic_id}} is provided</action>

  <check if="{{epic_id}} is empty">
    <action>Set result_success = false</action>
    <action>Set result_error = "epic_id parameter required for complete_retrospective"</action>
    <action>HALT - return to calling workflow with error</action>
  </check>

<action>Construct retrospective key: "epic-{{epic_id}}-retrospective"</action>
<action>Look up retrospective key in development_status map</action>

  <check if="retrospective key not found">
    <action>Set result_success = false</action>
    <action>Set result_error = "Retrospective for epic {{epic_id}} not found in sprint-status.yaml"</action>

    <check if="{{show_output}} == true">
      <output>❌ Epic {{epic_id}} retrospective not found in tracking file</output>
    </check>

    <action>HALT - return to calling workflow with error</action>

  </check>

<action>Get current status (old_status) from map</action>

  <check if="{{dry_run}} == false">
    <action>Update development_status map: set "epic-{{epic_id}}-retrospective" = "completed"</action>
    <action>Write updated YAML back to {status_file}</action>
  </check>

<action>Set result_success = true</action>
<action>Set result_retro_key = "epic-{{epic_id}}-retrospective"</action>
<action>Set result_old_status = old_status</action>
<action>Set result_new_status = "completed"</action>

  <check if="{{show_output}} == true">
    <output>✅ Updated sprint-status: epic-{{epic_id}}-retrospective → completed{{#if dry_run}} (DRY RUN - not saved){{/if}}</output>
  </check>

<action>COMPLETE - return to calling workflow</action>
</step>

<!-- ========================================
     ACTION HANDLERS - UTILITY OPERATIONS
     ======================================== -->

<step n="11" goal="Action: validate_transition">
  <action>Validate {{from_status}} and {{to_status}} are provided</action>

  <check if="{{from_status}} is empty OR {{to_status}} is empty">
    <action>Set result_success = false</action>
    <action>Set result_error = "from_status and to_status parameters required for validate_transition"</action>
    <action>HALT - return to calling workflow with error</action>
  </check>

<action>Check if transition {{from_status}} → {{to_status}} is legal</action>

<action>Legal transitions for stories: - backlog → drafted: ✓ - drafted → ready-for-dev: ✓ - drafted → drafted: ✓ (re-edit) - ready-for-dev → in-progress: ✓ - ready-for-dev → drafted: ✓ (corrections) - in-progress → review: ✓ - in-progress → in-progress: ✓ (continue) - review → done: ✓ - review → in-progress: ✓ (corrections needed) - done → done: ✓ (idempotent) - All other transitions: ✗
</action>

  <check if="transition is legal">
    <action>Set result_valid = true</action>
    <action>Set result_message = "Legal transition: {{from_status}} → {{to_status}}"</action>
    <action>Set result_success = true</action>
  </check>

  <check if="transition is NOT legal">
    <action>Set result_valid = false</action>
    <action>Set result_message = "Invalid transition: {{from_status}} → {{to_status}}"</action>
    <action>Set result_suggested_path = "backlog → drafted → ready-for-dev → in-progress → review → done"</action>
    <action>Set result_success = true</action>
  </check>

  <check if="{{show_output}} == true">
    <output>{{#if result_valid}}✅{{else}}❌{{/if}} {{result_message}}</output>
  </check>

<action>COMPLETE - return to calling workflow</action>
</step>

<step n="12" goal="Action: get_metadata">
  <action>Extract metadata from loaded sprint status file</action>

<action>Set result_project = metadata.project value</action>
<action>Set result_project_key = metadata.project_key value</action>
<action>Set result_tracking_system = metadata.tracking_system value</action>
<action>Set result_story_location = metadata.story_location value</action>
<action>Set result_generated_date = metadata.generated value</action>
<action>Set result_success = true</action>

  <check if="{{show_output}} == true">
    <output>📋 Sprint Status Metadata:
- Project: {{result_project}}
- Tracking: {{result_tracking_system}}
- Stories: {{result_story_location}}
- Generated: {{result_generated_date}}
    </output>
  </check>

<action>COMPLETE - return to calling workflow</action>
</step>

<step n="13" goal="Action: get_file_path">
  <action>This action was already completed in step 1 when we loaded the file</action>

<action>Set result_file_path = {status_file}</action>
<action>Set result_exists = true (because we successfully loaded it in step 1)</action>
<action>Set result_success = true</action>

  <check if="{{show_output}} == true">
    <output>📁 Sprint status file: {{result_file_path}}</output>
  </check>

<action>COMPLETE - return to calling workflow</action>
</step>

</workflow>
