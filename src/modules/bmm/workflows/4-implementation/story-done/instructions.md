# Story Approved Workflow Instructions (DEV Agent)

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>

<workflow>

<critical>This workflow is run by DEV agent AFTER user confirms a story is approved (Definition of Done is complete)</critical>
<critical>Workflow: Update story file status to Done</critical>

<step n="1" goal="Find reviewed story and mark done">

<action>If {{story_path}} is provided → use it directly; extract story_key from filename or metadata; GOTO mark_done</action>

<action>Otherwise query sprint-status for reviewed stories:</action>

<invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
  <param>action: list_stories</param>
  <param>filter_status: review</param>
  <param>limit: 10</param>
</invoke-workflow>

<check if="{{result_count}} == 0">
  <output>📋 No stories in review status found

All stories are either still in development or already done.

**Options:**

1. Run `dev-story` to implement stories
2. Run `review-story` if stories need review first
3. Check sprint-status.yaml for current story states
   </output>
   <action>HALT</action>
   </check>

<action>Display available reviewed stories:

**Stories Ready to Mark Done ({{result_count}} found):**

{{result_story_list}}

</action>

<ask>Select the story to mark as Done (enter story key or number):</ask>

<action>Resolve selected story_key from user input</action>
<action>Find matching story file in {{story_dir}} using story_key pattern</action>

<anchor id="mark_done" />

<action>Read the story file from resolved path</action>
<action>Extract story_id and story_title from the file</action>

<action>Find the "Status:" line (usually at the top)</action>
<action>Update story file: Change Status to "Done"</action>

<action>Add completion notes to Dev Agent Record section:</action>
<action>Find "## Dev Agent Record" section and add:

```
### Completion Notes
**Completed:** {{date}}
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing
```

</action>

<action>Save the story file</action>

<invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
  <param>action: update_story_status</param>
  <param>story_key: {{story_key}}</param>
  <param>new_status: done</param>
  <param>validate: true</param>
</invoke-workflow>

<check if="{{result_success}} == false">
  <output>⚠️ Story file updated, but could not update sprint-status: {{result_error}}

Story is marked Done in file, but sprint-status.yaml may be out of sync.
</output>
</check>

</step>

<step n="2" goal="Confirm completion to user">

<output>**Story Approved and Marked Done, {user_name}!**

✅ Story file updated: `{{story_file}}` → Status: Done
✅ Sprint status updated: {{result_old_status}} → {{result_new_status}}

**Completed Story:**

- **ID:** {{story_id}}
- **Key:** {{story_key}}
- **Title:** {{story_title}}
- **File:** `{{story_file}}`
- **Completed:** {{date}}

**Next Steps:**

1. Continue with next story in your backlog
   - Run `create-story` for next backlog story
   - Or run `dev-story` if ready stories exist
2. Check epic completion status
   - Run `retrospective` workflow to check if epic is complete
   - Epic retrospective will verify all stories are done
     </output>

</step>

</workflow>
```
