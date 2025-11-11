# Story Ready Workflow Instructions (SM Agent)

<critical>The workflow execution engine is governed by: {project_root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>

<workflow>

<critical>This workflow is run by SM agent AFTER user reviews a drafted story and confirms it's ready for development</critical>
<critical>Simple workflow: Update story file status to Ready</critical>

<step n="1" goal="Find drafted story to mark ready" tag="sprint-status">

<action>If {{story_path}} is provided → use it directly; extract story_key from filename or metadata; GOTO mark_ready</action>

<critical>MUST read COMPLETE sprint-status.yaml file from start to end to preserve order</critical>
<action>Load the FULL file: {{output_folder}}/sprint-status.yaml</action>
<action>Read ALL lines from beginning to end - do not skip any content</action>
<action>Parse the development_status section completely</action>

<action>Find ALL stories (reading in order from top to bottom) where:

- Key matches pattern: number-number-name (e.g., "1-2-user-auth")
- NOT an epic key (epic-X) or retrospective (epic-X-retrospective)
- Status value equals "drafted"
  </action>

<action>Collect up to 10 drafted story keys in order (limit for display purposes)</action>
<action>Count total drafted stories found</action>

<check if="no drafted stories found">
  <output>📋 No drafted stories found in sprint-status.yaml

All stories are either still in backlog or already marked ready/in-progress/done.

**Options:**

1. Run `create-story` to draft more stories
2. Run `sprint-planning` to refresh story tracking
   </output>
   <action>HALT</action>
   </check>

<action>Display available drafted stories:

**Drafted Stories Available ({{drafted_count}} found):**

{{list_of_drafted_story_keys}}

</action>

<ask if="{{non_interactive}} == false">Select the drafted story to mark as Ready (enter story key or number):</ask>
<action if="{{non_interactive}} == true">Auto-select first story from the list</action>

<action>Resolve selected story_key from user input or auto-selection</action>
<action>Find matching story file in {{story_dir}} using story_key pattern</action>

<anchor id="mark_ready" />

<action>Read the story file from resolved path</action>
<action>Extract story_id and story_title from the file</action>

<action>Find the "Status:" line (usually at the top)</action>
<action>Update story file: Change Status to "ready-for-dev"</action>
<action>Save the story file</action>
</step>

<step n="2" goal="Update sprint status to ready-for-dev" tag="sprint-status">
<action>Load the FULL file: {{output_folder}}/sprint-status.yaml</action>
<action>Find development_status key matching {{story_key}}</action>
<action>Verify current status is "drafted" (expected previous state)</action>
<action>Update development_status[{{story_key}}] = "ready-for-dev"</action>
<action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>

<check if="story key not found in file">
  <output>⚠️ Story file updated, but could not update sprint-status: {{story_key}} not found

You may need to run sprint-planning to refresh tracking.
</output>
</check>

</step>

<step n="3" goal="Confirm completion to user">

<output>**Story Marked Ready for Development, {user_name}!**

✅ Story file updated: `{{story_file}}` → Status: ready-for-dev
✅ Sprint status updated: drafted → ready-for-dev

**Story Details:**

- **ID:** {{story_id}}
- **Key:** {{story_key}}
- **Title:** {{story_title}}
- **File:** `{{story_file}}`
- **Status:** ready-for-dev

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
