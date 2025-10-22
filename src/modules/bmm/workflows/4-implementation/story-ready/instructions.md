# Story Ready Workflow Instructions (SM Agent)

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>

<workflow>

<critical>This workflow is run by SM agent AFTER user reviews a drafted story and confirms it's ready for development</critical>
<critical>Simple workflow: Update story file status to Ready</critical>

<step n="1" goal="Locate story and update status">

<action>If {{story_path}} explicitly provided → use it</action>
<action>Otherwise list story-\*.md files from {{story_dir}}, sort by modified time</action>
<ask>Select the drafted story to mark as Ready, or enter path:</ask>

<action>Read the story file: {{story_path}}</action>
<action>Extract story ID and title from the file</action>

<action>Find the "Status:" line (usually at the top)</action>

<action>Update story file:</action>

- Change: `Status: Draft` or similar
- To: `Status: Ready`

<action>Save the story file</action>

</step>

<step n="2" goal="Confirm completion to user">

<output>**Story Marked Ready for Development, {user_name}!**

✅ Story file updated: `{{story_file}}` → Status: Ready

**Story Details:**

- **ID:** {{story_id}}
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
