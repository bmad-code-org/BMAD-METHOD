# Correct Course — Jira/Confluence Integration

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: the workflow-jira.yaml for this workflow</critical>

## Overview

Facilitates mid-sprint course corrections when scope changes, technical blockers, requirement changes, or timeline shifts occur. Assesses impact, proposes Jira updates, and executes approved changes.

---

<workflow>

<step n="1" goal="Assess current state — sprint progress, blocked stories, velocity">
<action>Communicate in {communication_language} with {user_name}</action>
<action>Invoke the `read-jira-context` task with `context_type: "sprint_status"` to load current sprint state</action>
<action>Present the current sprint status to the user:</action>

| Metric | Value |
|---|---|
| Sprint | {sprint_name} |
| Stories Total | {total_stories} |
| Done | {done_count} |
| In Progress | {in_progress_count} |
| To Do | {todo_count} |
| Blocked | {blocked_count} |
| Velocity (avg) | {avg_velocity} |

<action>List any blocked stories with their blockers</action>
</step>

<step n="2" goal="Identify issues — understand what triggered the course correction">
<action>Ask the user what changed or what problem triggered the course correction</action>
<action>Categorize the issue into one or more of:</action>

1. **Scope change** — new requirements or features added/removed
2. **Technical blocker** — implementation obstacle, dependency failure, or architectural issue
3. **Requirement change** — existing requirements modified or clarified
4. **Timeline change** — deadline moved, resource availability changed

<action>Gather details for each identified issue</action>
<action>Confirm the categorization with the user</action>
</step>

<step n="3" goal="Impact analysis — determine which epics and stories are affected">
<action>Based on the identified issues, determine which Epics and Stories are affected</action>
<action>Call `Search Issues` with JQL to load affected items:</action>
<action>For scope/requirement changes: `project = {jira_project_key} AND issuetype in (Epic, Story) AND status != Done ORDER BY rank ASC`</action>
<action>For technical blockers: load the specific blocked stories and their dependencies</action>

<action>Use the checklist at `{checklist}` to evaluate each proposed change:</action>

1. Does this change affect acceptance criteria?
2. Does this change require new stories?
3. Does this change invalidate completed work?
4. Does this change affect other epics or dependencies?
5. What is the effort impact?
6. What is the risk if not addressed?

<action>Present the impact analysis to the user</action>
</step>

<step n="4" goal="Propose changes — define specific Jira updates for each affected item">
<action>For each affected item, propose one or more of the following actions:</action>

1. **Update story description/ACs** — modify the existing story via `Update Issue` to reflect changed requirements
2. **Create new remediation stories** — use `Create Issue` to create new stories and `Link Issues` to attach them to the appropriate Epic
3. **Re-prioritize stories** — adjust story rank within the sprint or backlog
4. **Adjust sprint scope** — move stories in or out of the current sprint
5. **Add blockers** — link blocking relationships between issues

<action>Present the full change proposal to the user:</action>

```
## Sprint Change Proposal

### Stories to Update
{list of stories with proposed description/AC changes}

### New Stories to Create
{list of new stories with descriptions and target epics}

### Sprint Scope Changes
{stories to add/remove from sprint}

### Priority Changes
{stories to re-rank}
```

<action>Wait for user approval before proceeding</action>
</step>

<step n="5" goal="Execute changes — apply approved Jira updates">
<action>After user approval, execute each approved change:</action>

<action>For story updates:</action>
<action>Call `Update Issue` for each story with modified descriptions or acceptance criteria</action>
<action>Post a "Sprint Change Proposal" comment on each affected issue:</action>

```
issue_key: "{story_key}"
body: |
  ## Course Correction Applied ({date})

  **Trigger:** {change_category}
  **Change:** {description_of_change}

  **Previous State:** {previous_description_summary}
  **Updated State:** {new_description_summary}
```

<action>For new stories:</action>
<action>Call `Create Issue` for each new story with:</action>

```
project: "{jira_project_key}"
issuetype: "Story"
summary: "{story_summary}"
description: "{story_description}"
epic_link: "{target_epic_key}"
```

<action>For sprint scope changes:</action>
<action>Move stories in/out of the active sprint as approved</action>

<action>Track all changes made for the confirmation step</action>
</step>

<step n="6" goal="Confirm and notify — summarize changes and post handoff">
<action>Compile a summary of all changes executed:</action>

**Course Correction Summary**

- **Trigger:** {change_category}
- **Stories Updated:** {updated_count}
- **Stories Created:** {created_count}
- **Sprint Scope Changes:** {scope_change_count}
- **Priority Changes:** {priority_change_count}

| Action | Issue | Detail |
|---|---|---|
| Updated | {story_key} | {change_summary} |
| Created | {new_story_key} | {new_story_summary} |
| Moved | {story_key} | {in/out of sprint} |

<action>Invoke the `post-handoff` task with:</action>

```
handoff_to: "SM"
handoff_type: "course_correction_complete"
summary: "Course correction applied. {updated_count} stories updated, {created_count} new stories created. Trigger: {change_category}."
```

<action>Report to user:</action>

**Course Correction Complete**

All approved changes have been applied to Jira. The sprint backlog has been updated to reflect the new priorities and scope.

**Next Steps:**
1. Review updated stories in Jira
2. Resume development with [Dev Story] on the highest-priority item
3. Monitor progress with [Sprint Status]
</step>

</workflow>
