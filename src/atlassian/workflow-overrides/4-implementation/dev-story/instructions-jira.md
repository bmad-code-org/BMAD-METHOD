# Dev Story — Jira-Tracked Implementation

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: the workflow-jira.yaml for this workflow</critical>

## Overview

Executes a story implementation with Jira as the tracking system. The dev agent finds the next story from Jira (instead of local files), locks it, transitions through statuses, and posts completion records as Jira comments.

---

<workflow>

<step n="1" goal="Find the next story to implement">
<action>Call `Search Issues` with JQL:</action>

```
project = {jira_project_key} AND issuetype = Story AND status = "Ready for Dev" ORDER BY rank ASC
```

`fields: "summary,description,labels"` and `limit: 5`

<action>If user specified a story key, use that instead</action>
<action>Present candidates to the user:</action>

| # | Key | Story | Status |
|---|---|---|---|
| 1 | PROJ-12 | Story 1.1: User Authentication | Ready for Dev |
| 2 | PROJ-13 | Story 1.2: Account Management | Ready for Dev |

<action>Wait for user selection (or auto-select the first one if running in automated mode)</action>
</step>

<step n="2" goal="Load story details and lock">
<action>Call `Get Issue` with `issue_key: "{selected_issue_key}"` and `fields: "summary,description,labels,comment"` and `comment_limit: 10`</action>
<action>Parse the story description to extract: user story, acceptance criteria, tasks/subtasks, dev notes</action>

<action>Invoke `lock-issue` task with `issue_key: "{selected_issue_key}"`, `action: "lock"`, `agent_name: "dev"`</action>

<action>Invoke `transition-jira-issue` task to move to In Progress:</action>

```
issue_key: "{selected_issue_key}"
transition_id: "{status_transitions.story.ready_for_dev_to_in_progress}"
comment: "Dev agent starting implementation"
fallback_status_name: "In Progress"
```
</step>

<step n="3" goal="Load architecture and project context">
<action>Invoke `read-jira-context` task with `context_type: "confluence_artefact"` and `scope_key: "architecture"` to fetch the Architecture document</action>
<action>Read the project context file if it exists: `**/project-context.md`</action>
<action>These provide the technical constraints and patterns the dev agent must follow</action>
</step>

<step n="4" goal="Execute implementation">
<action>Follow the standard bmm dev-story checklist at `{bmm_checklist}`:</action>

**Critical Dev Agent Rules (unchanged from bmm):**
- READ the entire story BEFORE any implementation
- Execute tasks/subtasks IN ORDER as written
- Mark task complete ONLY when both implementation AND tests pass
- Run full test suite after each task
- Execute continuously without pausing until all tasks complete
- NEVER lie about tests being written or passing

<action>For each task/subtask in the story:</action>
1. Implement the code changes
2. Write comprehensive unit tests
3. Run the full test suite — all tests must pass
4. Mark the task as complete

<action>If dual-write mode: update the local story file at `{implementation_artifacts}/{story-key}.md` with task completion markers `[x]`</action>
</step>

<step n="5" goal="Post completion record to Jira">
<action>Call `Add Comment` on the story issue:</action>

```
issue_key: "{selected_issue_key}"
body: |
  ## Dev Agent Record

  ### Agent Model
  {agent_model_name_version}

  ### Implementation Summary
  {what_was_implemented}

  ### Tests Created
  {list_of_test_files_and_what_they_cover}

  ### Decisions Made
  {any_implementation_decisions_or_deviations}

  ### Files Changed
  {complete_list_of_changed_files}

  ### All Tests Passing
  ✅ Full test suite passes ({test_count} tests)
```
</step>

<step n="6" goal="Update subtask statuses">
<action>For each subtask under this story in Jira:</action>
<action>Call `Search Issues` with JQL: `parent = {selected_issue_key} AND issuetype = Sub-task`</action>
<action>For each subtask, invoke `transition-jira-issue` to mark as Done</action>
</step>

<step n="7" goal="Transition to Review and unlock">
<action>Invoke `transition-jira-issue` task:</action>

```
issue_key: "{selected_issue_key}"
transition_id: "{status_transitions.story.in_progress_to_review}"
comment: "Implementation complete. Ready for code review."
fallback_status_name: "Review"
```

<action>Invoke `lock-issue` task with `issue_key: "{selected_issue_key}"`, `action: "unlock"`, `agent_name: "dev"`</action>

<action>Report to user:</action>

**Story Complete: {story_title}**

- **Jira Issue:** {selected_issue_key}
- **Status:** Review
- **Files Changed:** {file_count}
- **Tests:** {test_count} passing

**Next Steps:**
1. Run Code Review [CR] for adversarial review (recommended: fresh context, different LLM)
2. Or pick up the next story with [DS] Dev Story
</step>

</workflow>
