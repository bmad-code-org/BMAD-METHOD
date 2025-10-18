# Story Ready Workflow Instructions (SM Agent)

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>

<workflow>

<critical>This workflow is run by SM agent AFTER user reviews a drafted story and confirms it's ready for development</critical>
<critical>NO SEARCHING - SM agent reads status file TODO section to know which story was drafted</critical>
<critical>Simple workflow: Update story file status, move story TODO → IN PROGRESS, move next story BACKLOG → TODO</critical>

<step n="1" goal="Get TODO story from status file">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: data</param>
  <param>data_request: next_story</param>
</invoke-workflow>

<check if="status_exists == false OR todo_story_id == ''">
  <output>❌ No status file or no TODO story found.

This workflow requires an active status file with a TODO story.

Run `workflow-status` to check your project state.</output>
<action>Exit workflow</action>
</check>

<action>Use extracted story information:</action>

- {{todo_story_id}}: Story to mark ready
- {{todo_story_title}}: Story title
- {{todo_story_file}}: Story file path
- {{status_file_path}}: Status file to update

</step>

<step n="2" goal="Update the story file status">

<action>Read the story file: {story_dir}/{todo_story_file}</action>

<action>Find the "Status:" line (usually at the top)</action>

<action>Update story file:</action>

- Change: `Status: Draft`
- To: `Status: Ready`

<action>Save the story file</action>

</step>

<step n="3" goal="Update status file - move story TODO → IN PROGRESS">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: update</param>
  <param>action: start_story</param>
</invoke-workflow>

<check if="success == false">
  <output>⚠️ Failed to update status: {{error}}</output>
  <output>Story file was updated, but status file update failed.</output>
</check>

<check if="success == true">
  <output>Status updated: Story {{in_progress_story}} ready for development.</output>
  <check if="next_todo != ''">
    <output>Next TODO: {{next_todo}}</output>
  </check>
</check>

</step>

<step n="4" goal="Confirm completion to user">

<action>Display summary</action>

**Story Marked Ready for Development, {user_name}!**

✅ Story file updated: `{{todo_story_file}}` → Status: Ready
✅ Status file updated: Story moved TODO → IN PROGRESS
{{#if next_story}}✅ Next story moved: BACKLOG → TODO ({{next_story_id}}: {{next_story_title}}){{/if}}
{{#if no_more_stories}}✅ All stories have been drafted - backlog is empty{{/if}}

**Current Story (IN PROGRESS):**

- **ID:** {{todo_story_id}}
- **Title:** {{todo_story_title}}
- **File:** `{{todo_story_file}}`
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
