# Story Approved Workflow Instructions (DEV Agent)

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>

<workflow>

<critical>This workflow is run by DEV agent AFTER user confirms a story is approved (Definition of Done is complete)</critical>
<critical>NO SEARCHING - DEV agent reads status file IN PROGRESS section to know which story was being worked on</critical>
<critical>Workflow: Update story file status, move story IN PROGRESS → DONE, move TODO → IN PROGRESS, move BACKLOG → TODO</critical>

<step n="1" goal="Read status file and identify the IN PROGRESS story">

<action>Read {output_folder}/bmm-workflow-status.md</action>
<action>Navigate to "### Implementation Progress (Phase 4 Only)" section</action>
<action>Find "#### IN PROGRESS (Approved for Development)" section</action>

<action>Extract current story information:</action>

- current_story_id: The story ID (e.g., "1.1", "auth-feature-1", "login-fix")
- current_story_title: The story title
- current_story_file: The exact story file path
- current_story_points: Story points (if tracked)

<action>Read the TODO section to know what's next:</action>

- todo_story_id: Next story to move to IN PROGRESS (if exists)
- todo_story_title: Next story title
- todo_story_file: Next story file path

<action>Read the BACKLOG section to know what comes after:</action>

- next_backlog_story_id: Story to move to TODO (if exists)
- next_backlog_story_title
- next_backlog_story_file

<critical>DO NOT SEARCH for stories - the status file tells you exactly which story is in each state</critical>

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

<step n="3" goal="Move story IN PROGRESS → DONE, advance the queue">

<action>Open {output_folder}/bmm-workflow-status.md</action>

<action>Update "#### DONE (Completed Stories)" section:</action>

Add the completed story to the table:

| Story ID             | File                   | Completed Date | Points                   |
| -------------------- | ---------------------- | -------------- | ------------------------ |
| {{current_story_id}} | {{current_story_file}} | {{date}}       | {{current_story_points}} |

... (existing done stories)

**Total completed:** {{done_count + 1}} stories
**Total points completed:** {{done_points + current_story_points}} points

<action>Update "#### IN PROGRESS (Approved for Development)" section:</action>

<check if="todo_story exists">
  Move the TODO story to IN PROGRESS:

#### IN PROGRESS (Approved for Development)

- **Story ID:** {{todo_story_id}}
- **Story Title:** {{todo_story_title}}
- **Story File:** `{{todo_story_file}}`
- **Story Status:** Ready (OR Draft if not yet reviewed)
- **Context File:** `{{context_file_path}}` (if exists, otherwise note "Context not yet generated")
- **Action:** DEV should run `dev-story` workflow to implement this story
  </check>

<check if="todo_story does NOT exist">
  Mark IN PROGRESS as empty:

#### IN PROGRESS (Approved for Development)

(No story currently in progress - all stories complete!)
</check>

<action>Update "#### TODO (Needs Drafting)" section:</action>

<check if="next_backlog_story exists">
  Move the first BACKLOG story to TODO:

#### TODO (Needs Drafting)

- **Story ID:** {{next_backlog_story_id}}
- **Story Title:** {{next_backlog_story_title}}
- **Story File:** `{{next_backlog_story_file}}`
- **Status:** Not created OR Draft (needs review)
- **Action:** SM should run `create-story` workflow to draft this story
  </check>

<check if="next_backlog_story does NOT exist">
  Mark TODO as empty:

#### TODO (Needs Drafting)

(No more stories to draft - all stories are drafted or complete)
</check>

<action>Update "#### BACKLOG (Not Yet Drafted)" section:</action>

Remove the first story from the BACKLOG table (the one we just moved to TODO).

If BACKLOG had 1 story and is now empty:

| Epic                          | Story | ID  | Title | File |
| ----------------------------- | ----- | --- | ----- | ---- |
| (empty - all stories drafted) |       |     |       |      |

**Total in backlog:** 0 stories

<action>Update story counts in "#### Epic/Story Summary" section:</action>

- Increment done_count by 1
- Increment done_points by {{current_story_points}}
- Decrement backlog_count by 1 (if story was moved from BACKLOG → TODO)
- Update epic breakdown:
  - Increment epic_done_stories for the current story's epic

<check if="all stories complete">
  <action>Check "4-Implementation" checkbox in "### Phase Completion Status"</action>
  <action>Set progress_percentage = 100%</action>
</check>

</step>

<step n="4" goal="Update Decision Log, Progress, and Next Action">

<action>Add to "## Decision Log" section:</action>

```
- **{{date}}**: Story {{current_story_id}} ({{current_story_title}}) approved and marked done by DEV agent. Moved from IN PROGRESS → DONE. {{#if todo_story}}Story {{todo_story_id}} moved from TODO → IN PROGRESS.{{/if}} {{#if next_backlog_story}}Story {{next_backlog_story_id}} moved from BACKLOG → TODO.{{/if}}
```

<template-output file="{{status_file_path}}">current_step</template-output>
<action>Set to: "story-approved (Story {{current_story_id}})"</action>

<template-output file="{{status_file_path}}">current_workflow</template-output>
<action>Set to: "story-approved (Story {{current_story_id}}) - Complete"</action>

<template-output file="{{status_file_path}}">progress_percentage</template-output>
<action>Calculate per-story weight: remaining_40_percent / total_stories / 5</action>
<action>Increment by: {{per_story_weight}} \* 1 (story-approved weight is ~1% per story)</action>
<check if="all stories complete">
<action>Set progress_percentage = 100%</action>
</check>

<action>Update "### Next Action Required" section:</action>

<check if="todo_story exists">
```
**What to do next:** {{#if todo_story_status == 'Draft'}}Review drafted story {{todo_story_id}}, then mark it ready{{else}}Implement story {{todo_story_id}}{{/if}}

**Command to run:** {{#if todo_story_status == 'Draft'}}Load SM agent and run 'story-ready' workflow{{else}}Run 'dev-story' workflow to implement{{/if}}

**Agent to load:** {{#if todo_story_status == 'Draft'}}bmad/bmm/agents/sm.md{{else}}bmad/bmm/agents/dev.md{{/if}}

```
</check>

<check if="todo_story does NOT exist AND backlog not empty">
```

**What to do next:** Draft the next story ({{next_backlog_story_id}})

**Command to run:** Load SM agent and run 'create-story' workflow

**Agent to load:** bmad/bmm/agents/sm.md

```
</check>

<check if="all stories complete">
```

**What to do next:** All stories complete! Run retrospective workflow or close project.

**Command to run:** Load PM agent and run 'retrospective' workflow

**Agent to load:** bmad/bmm/agents/pm.md

```
</check>

<action>Save bmm-workflow-status.md</action>

</step>

<step n="5" goal="Confirm completion to user">

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
1. Stay with DEV agent and run `dev-story` workflow
2. Implement story {{todo_story_id}}
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
