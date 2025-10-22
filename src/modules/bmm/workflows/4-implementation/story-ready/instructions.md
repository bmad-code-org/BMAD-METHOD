# Story Ready Workflow Instructions (SM Agent)

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>

<workflow>

<critical>This workflow is run by SM agent AFTER user reviews a drafted story and confirms it's ready for development</critical>
<critical>Simple workflow: Update story file status to Ready</critical>

<step n="1" goal="Find drafted story and mark as ready">

<action>If {{story_path}} is provided → use it directly; extract story_key from filename or metadata; GOTO mark_ready</action>

<action>Otherwise query sprint-status for drafted stories:</action>

<invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
  <param>action: list_stories</param>
  <param>filter_status: drafted</param>
  <param>limit: 10</param>
</invoke-workflow>

<check if="{{result_count}} == 0">
  <output>📋 No drafted stories found in sprint-status.yaml

All stories are either still in backlog or already marked ready/in-progress/done.

**Options:**

1. Run `create-story` to draft more stories
2. Run `sprint-planning` to refresh story tracking
   </output>
   <action>HALT</action>
   </check>

<action>Display available drafted stories:

**Drafted Stories Available ({{result_count}} found):**

{{result_story_list}}

</action>

<ask if="{{non_interactive}} == false">Select the drafted story to mark as Ready (enter story key or number):</ask>
<action if="{{non_interactive}} == true">Auto-select first story from result_stories</action>

<action>Resolve selected story_key from user input or auto-selection</action>
<action>Find matching story file in {{story_dir}} using story_key pattern</action>

<anchor id="mark_ready" />

<action>Read the story file from resolved path</action>
<action>Extract story_id and story_title from the file</action>

<action>Find the "Status:" line (usually at the top)</action>
<action>Update story file: Change Status to "Ready"</action>
<action>Save the story file</action>

<invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
  <param>action: update_story_status</param>
  <param>story_key: {{story_key}}</param>
  <param>new_status: ready-for-dev</param>
  <param>validate: true</param>
</invoke-workflow>

<check if="{{result_success}} == false">
  <output>⚠️ Story file updated, but could not update sprint-status: {{result_error}}

You may need to run sprint-planning to refresh tracking.
</output>
</check>

</step>

<step n="2" goal="Confirm completion to user">

<output>**Story Marked Ready for Development, {user_name}!**

✅ Story file updated: `{{story_file}}` → Status: Ready
✅ Sprint status updated: {{result_old_status}} → {{result_new_status}}

**Story Details:**

- **ID:** {{story_id}}
- **Key:** {{story_key}}
- **Title:** {{story_title}}
- **File:** `{{story_file}}`
- **Status:** Ready for development

**Next Steps:**

1. **Recommended:** Run `story-context` workflow to generate implementation context
   - This creates a comprehensive context XML for the DEV agent
   - Includes relevant architecture, dependencies, and existing code

2. **Alternative:** Skip context generation and go directly to `dev-story` workflow
   - Faster, but DEV agent will have less context
   - Only recommended for simple, well-understood stories

**To proceed:**

- For context generation: Stay with SM agent and run `story-context` workflow
- For direct implementation: Load DEV agent and run `dev-story` workflow

</step>

</workflow>
