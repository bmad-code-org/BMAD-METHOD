# Sprint Planning — Jira Sprint Management

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: the workflow-jira.yaml for this workflow</critical>

## Overview

This workflow replaces the file-based sprint-status.yaml generation with Jira Sprint operations. It discovers stories from Jira, creates/manages sprints, and assigns stories to sprints.

---

<workflow>

<step n="1" goal="Read current Jira project state">
<action>Communicate in {communication_language} with {user_name}</action>
<action>Invoke the `read-jira-context` task with `context_type: "sprint_status"`</action>

This will:
1. Call `Get Sprints from Board` with `board_id: "{jira_board_id}"` and `state: "active"` to find current sprint
2. If active sprint exists, call `Get Sprint Issues` to get issues in the sprint
3. Call `Search Issues` with JQL: `project = {jira_project_key} AND issuetype = Story AND sprint is EMPTY AND status != Done ORDER BY rank ASC` to find unplanned stories
4. Call `Search Issues` with JQL: `project = {jira_project_key} AND issuetype = Epic ORDER BY rank ASC` to get epic overview

<action>Build a complete inventory of all epics, stories, and their current states from Jira</action>
</step>

<step n="2" goal="Determine sprint action">
<action>Present the current state to the user:</action>

**Current Sprint Status:**
- Active Sprint: {sprint_name} (or "None")
- Stories in Sprint: {count} ({done_count} done, {in_progress_count} in progress)
- Backlog Stories: {backlog_count} (not in any sprint)

**Options:**
1. **[C] Continue** - Add backlog stories to the current sprint
2. **[N] New Sprint** - Create a new sprint and select stories
3. **[R] Review Only** - Just show the status, don't modify anything

<action>Wait for user selection</action>
</step>

<step n="3" goal="Create new sprint (if selected)">
<action>If user selected [N] or no active sprint exists:</action>
<action>Ask user for sprint name (default: `"{project_name} Sprint {next_number}"`) and duration (default: 2 weeks)</action>
<action>Call `Create Sprint` with:</action>

```
board_id: "{jira_board_id}"
name: "{sprint_name}"
start_date: "{today_iso}"
end_date: "{end_date_iso}"
goal: "{sprint_goal}"    # Ask user for optional sprint goal
```

<action>Record the returned `sprint_id`</action>
<action>Update `{key_map_file}` under `sprints`: `sprint-{N}: "{sprint_id}"`</action>
</step>

<step n="4" goal="Select and assign stories to sprint">
<action>Present the backlog stories to the user as a numbered list:</action>

| # | Key | Story | Epic | Status |
|---|---|---|---|---|
| 1 | PROJ-12 | Story 1.1: User Authentication | Epic 1 | Backlog |
| 2 | PROJ-13 | Story 1.2: Account Management | Epic 1 | Backlog |
| ... | ... | ... | ... | ... |

<action>Ask user to select stories by number (comma-separated) or "all" for all backlog stories</action>
<action>Call `Add Issues to Sprint` with:</action>

```
sprint_id: "{active_or_new_sprint_id}"
issue_keys: "{selected_story_keys_comma_separated}"
```

<action>For each story added, if it's the first story from its Epic being worked on:</action>
<action>Invoke `transition-jira-issue` task to transition the Epic from Backlog to In Progress using `{status_transitions.epic.backlog_to_in_progress}`</action>
</step>

<step n="5" goal="Generate status summary">
<action>Build the sprint status summary:</action>

**Sprint Planning Complete**

- **Sprint:** {sprint_name}
- **Stories Added:** {added_count}
- **Total in Sprint:** {total_count}
- **Epics Active:** {active_epic_count}

**Sprint Board:** View in Jira at your project board

**Next Steps:**
1. Use SM's **Create Story** ([CS]) to prepare stories with dev context
2. Stories will transition: Backlog → Ready for Dev → In Progress → Review → Done
3. Re-run Sprint Planning to refresh status from Jira
</step>

</workflow>

---

## Status Flow Reference (Jira-mapped)

```
Epic:  Backlog → In Progress → Done
       (Transition IDs from status_transitions.epic)

Story: Backlog → Ready for Dev → In Progress → Review → Done
       (Transition IDs from status_transitions.story)
```

All transitions go through the `transition-jira-issue` reusable task, which calls `Get Transitions` first to verify availability.
