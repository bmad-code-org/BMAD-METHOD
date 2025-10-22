# Story Approved Workflow Instructions (DEV Agent)

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>

<workflow>

<critical>This workflow is run by DEV agent AFTER user confirms a story is approved (Definition of Done is complete)</critical>
<critical>Workflow: Update story file status to Done</critical>

<step n="1" goal="Locate story and update to Done status">

<action>If {{story_path}} explicitly provided → use it</action>
<action>Otherwise list story-\*.md files from {{story_dir}}, sort by modified time</action>
<ask>Select the story to mark as Done, or enter path:</ask>

<action>Read the story file: {{story_path}}</action>
<action>Extract story ID and title from the file</action>

<action>Find the "Status:" line (usually at the top)</action>

<action>Update story file:</action>

- Change: `Status: Ready for Review` or `Status: In Review` or similar
- To: `Status: Done`

<action>Add completion notes if Dev Agent Record section exists:</action>

Find "## Dev Agent Record" section and add:

```
### Completion Notes
**Completed:** {{date}}
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing
```

<action>Save the story file</action>

</step>

<step n="2" goal="Confirm completion to user">

<output>**Story Approved and Marked Done, {user_name}!**

✅ Story file updated: `{{story_file}}` → Status: Done

**Completed Story:**

- **ID:** {{story_id}}
- **Title:** {{story_title}}
- **File:** `{{story_file}}`
- **Completed:** {{date}}

**Next Steps:**

1. Continue with next story in your backlog
2. Or run `retrospective` workflow if all stories are complete
   </output>

</step>

</workflow>
```
