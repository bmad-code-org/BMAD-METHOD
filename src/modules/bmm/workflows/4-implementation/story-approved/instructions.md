# Story Approved Workflow Instructions (DEV Agent)

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>

<workflow>

<critical>This workflow is run by DEV agent AFTER user confirms a story is approved (Definition of Done is complete)</critical>
<critical>NO SEARCHING - DEV agent reads status file IN PROGRESS section to know which story was being worked on</critical>
<critical>Workflow: Update story file status, move story IN PROGRESS → DONE, move TODO → IN PROGRESS, move BACKLOG → TODO</critical>

<step n="1" goal="Get story queue from status file">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: data</param>
  <param>data_request: all</param>
</invoke-workflow>

<check if="status_exists == false OR in_progress_story == ''">
  <output>❌ No status file or no IN PROGRESS story found.

This workflow requires an active status file with an IN PROGRESS story.

Run `workflow-status` to check your project state.</output>
<action>Exit workflow</action>
</check>

<action>Use extracted story queue:</action>

- {{in_progress_story}}: Current story to mark done
- {{todo_story_id}}: Next story (move to IN PROGRESS)
- {{stories_sequence}}: All stories
- {{stories_done}}: Completed stories
- {{status_file_path}}: Status file to update

</step>

<step n="2" goal="Update the current story file status to Done">

<action>Read the story file: {story_dir}/{current_story_file}</action>

<action>Find the "Status:" line (usually at the top)</action>

<action>Update story file:</action>

- Change: `Status: Ready` or `Status: In Review`
- To: `Status: Done`

<action>Add completion notes if Dev Agent Record section exists:</action>

Find "## Dev Agent Record" section and add:

```
### Completion Notes
**Completed:** {{date}}
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing, deployed
```

<action>Save the story file</action>

</step>

<step n="3" goal="Update status file - advance story queue">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: update</param>
  <param>action: complete_story</param>
</invoke-workflow>

<check if="success == false">
  <output>⚠️ Failed to update status: {{error}}</output>
  <output>Story file was updated, but status file update failed.</output>
</check>

<check if="success == true">
  <output>Status updated: Story {{completed_story}} marked done.</output>
  <check if="all_complete == true">
    <output>🎉 All stories complete! Phase 4 done!</output>
  </check>
  <check if="all_complete == false">
    <output>{{stories_remaining}} stories remaining.</output>
  </check>
</check>

</step>

<step n="4" goal="Confirm completion to user">

<action>Display summary</action>

**Story Approved and Marked Done, {user_name}!**

✅ Story file updated: `{{current_story_file}}` → Status: Done
✅ Status file updated: Story moved IN PROGRESS → DONE
{{#if todo_story}}✅ Next story moved: TODO → IN PROGRESS ({{todo_story_id}}: {{todo_story_title}}){{/if}}
{{#if next_backlog_story}}✅ Next story moved: BACKLOG → TODO ({{next_backlog_story_id}}: {{next_backlog_story_title}}){{/if}}

**Completed Story:**

- **ID:** {{current_story_id}}
- **Title:** {{current_story_title}}
- **File:** `{{current_story_file}}`
- **Points:** {{current_story_points}}
- **Completed:** {{date}}

**Progress Summary:**

- **Stories Completed:** {{done_count}} / {{total_stories}}
- **Points Completed:** {{done_points}} / {{total_points}}
- **Progress:** {{progress_percentage}}%

{{#if all_stories_complete}}
**🎉 ALL STORIES COMPLETE!**

Congratulations! You have completed all stories for this project.

**Next Steps:**

1. Run `retrospective` workflow with PM agent to review the project
2. Close out the project
3. Celebrate! 🎊
   {{/if}}

{{#if todo_story}}
**Next Story (IN PROGRESS):**

- **ID:** {{todo_story_id}}
- **Title:** {{todo_story_title}}
- **File:** `{{todo_story_file}}`
- **Status:** {{todo_story_status}}

**Next Steps:**
{{#if todo_story_status == 'Draft'}}

1. Review the drafted story {{todo_story_file}}
2. Load SM agent and run `story-ready` workflow to approve it
3. Then return to DEV agent to implement
   {{else}}
4. Stay with DEV agent and run `dev-story` workflow
5. Implement story {{todo_story_id}}
   {{/if}}
   {{/if}}

{{#if backlog_not_empty AND todo_empty}}
**Next Story (TODO):**

- **ID:** {{next_backlog_story_id}}
- **Title:** {{next_backlog_story_title}}

**Next Steps:**

1. Load SM agent
2. Run `create-story` workflow to draft story {{next_backlog_story_id}}
   {{/if}}

</step>

</workflow>
```
