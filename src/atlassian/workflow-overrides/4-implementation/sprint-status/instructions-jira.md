# Sprint Status — Jira/Confluence Integration

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: the workflow-jira.yaml for this workflow</critical>

## Overview

Provides a read-only sprint and epic progress dashboard by polling Jira for current sprint state, story statuses, and velocity metrics. Optionally publishes the status as a Confluence page. No transitions or modifications are made.

---

<workflow>

<step n="1" goal="Poll Jira state — load sprint, stories, and epic data">
<action>Communicate in {communication_language} with {user_name}</action>
<action>Call `Get All Sprints` for board `{jira_board_id}` with `state: "active"` to identify the current sprint</action>
<action>Call `Get Sprint Issues` for the active sprint to load all issues in the current sprint</action>
<action>Call `Search Issues` with JQL: `project = {jira_project_key} AND issuetype = Epic ORDER BY rank ASC` to load all Epics</action>
<action>For each Epic, call `Search Issues` with JQL: `"Epic Link" = {epic_key} ORDER BY status ASC` to get status counts per Epic</action>
<action>If no active sprint is found, inform the user and offer to show backlog status instead</action>
</step>

<step n="2" goal="Build status dashboard — sprint progress, epic progress, blockers, velocity">
<action>Compile the sprint status dashboard:</action>

### Sprint Progress: {sprint_name}

| Status | Count | % |
|---|---|---|
| Done | {done_count} | {done_pct}% |
| In Progress | {in_progress_count} | {in_progress_pct}% |
| In Review | {review_count} | {review_pct}% |
| To Do | {todo_count} | {todo_pct}% |
| **Total** | **{total_count}** | **100%** |

### Epic Progress

| Epic | Total Stories | Done | In Progress | To Do | % Complete |
|---|---|---|---|---|---|
| {epic_key}: {epic_summary} | {total} | {done} | {in_progress} | {todo} | {pct}% |

### Blocked Items

| Issue | Summary | Blocker |
|---|---|---|
| {story_key} | {story_summary} | {blocker_description} |

### Velocity Metrics

- **Current Sprint:** {stories_completed_so_far} stories completed of {total_stories}
- **Sprint Days Remaining:** {days_remaining}
- **Projected Completion:** {projected_pct}% by sprint end

<action>Identify any risks: stories at risk of not completing, epics falling behind</action>
</step>

<step n="3" goal="Present status and optionally publish to Confluence">
<action>Present the formatted status dashboard to the user</action>

<action>Ask the user if they would like to publish this status to Confluence</action>

<action>If the user wants to publish, invoke the `write-to-confluence` task with:</action>

```
space_key: "{confluence_space_key}"
parent_page_id: "{confluence_parent_page_id}"
title: "{project_name} — Sprint Status: {sprint_name} ({date})"
content: "{compiled_status_dashboard}"
key_map_entry: "confluence_pages.sprint_status_{sprint_id}"
```

<action>Alternatively, if the user prefers, post a summary comment on each active Epic:</action>
<action>For each Epic with stories in the active sprint, call `Add Comment` with:</action>

```
issue_key: "{epic_key}"
body: |
  ## Sprint Status Update ({date})

  **Sprint:** {sprint_name}
  **Epic Progress:** {done_count}/{total_count} stories done ({pct}%)

  ### Stories in Sprint
  {list_of_stories_with_status}
```

<action>Report to user:</action>

**Sprint Status Complete**

- **Sprint:** {sprint_name}
- **Overall Progress:** {done_count}/{total_count} stories ({overall_pct}%)
- **Blocked Items:** {blocked_count}
- **Days Remaining:** {days_remaining}
{if_published}
- **Confluence Page:** {status_confluence_url}
{end_if}

This is a read-only status check. To make changes, use [Correct Course] or [Sprint Planning].
</step>

</workflow>
