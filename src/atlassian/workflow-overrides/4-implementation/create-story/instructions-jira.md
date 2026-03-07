# Create Story — Jira Output

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: the workflow-jira.yaml for this workflow</critical>

## Overview

Prepares a story with full development context. The analysis steps follow the create-story checklist. The output step writes to Jira (updating the Story issue description and adding dev notes as a comment) and transitions the story to "Ready for Dev".

---

<workflow>

<step n="1" goal="Identify the story to prepare">
<action>Ask the user which story to prepare, or present the next unprepared story from the backlog</action>
<action>Invoke `read-jira-context` task with `context_type: "sprint_status"` to find stories in Backlog status</action>
<action>Call `Search Issues` with JQL: `project = {jira_project_key} AND issuetype = Story AND status = Backlog ORDER BY rank ASC` and `limit: 5`</action>

<action>Present candidates to the user:</action>

| # | Key | Story | Epic |
|---|---|---|---|
| 1 | PROJ-12 | Story 1.1: User Authentication | Epic 1 |
| 2 | PROJ-13 | Story 1.2: Account Management | Epic 1 |

<action>Wait for user selection</action>
<action>Call `Get Issue` with the selected `issue_key` and `fields: "summary,description,labels"` to load full story details</action>
</step>

<step n="2" goal="Gather context from Jira and Confluence">
<action>Invoke `read-jira-context` task with `context_type: "story_detail"` and `scope_key: "{selected_issue_key}"` to fetch:</action>
- Full story description and acceptance criteria from Jira
- Parent Epic details
- Architecture document from Confluence (if exists)

<action>Invoke `read-jira-context` task with `context_type: "previous_story_learnings"` to fetch:</action>
- Completion notes from the last 3 done stories (for incorporating learnings)

<action>Read the project context file if it exists: `{project_context}`</action>
</step>

<step n="3" goal="Analyse and prepare story content">
<action>Follow the create-story checklist at `{checklist}`:</action>

1. Validate the story has clear acceptance criteria
2. Identify relevant architecture patterns and constraints
3. Map tasks to the project's source tree
4. Determine testing strategy and standards
5. Check for dependencies on other stories
6. Identify files and modules that will be touched

<action>Build the enriched story content using the story template at `{template}` as the structure guide</action>

The enriched content includes:
- **User Story** (from Jira issue description)
- **Acceptance Criteria** (from Jira, validated for completeness)
- **Tasks / Subtasks** (decomposed from AC, ordered for implementation)
- **Dev Notes** (architecture patterns, source tree components, testing standards)
- **Project Structure Notes** (alignment with project conventions)
- **References** (source paths, relevant documentation sections)
</step>

<step n="4" goal="Write enriched story to Jira">
<action>Call `Update Issue` to replace the story's description with the enriched content:</action>

```
issue_key: "{selected_issue_key}"
fields:
  description: |
    {enriched_story_description_in_markdown}
additional_fields:
  labels: ["{existing_labels}", "{agent_label_prefix}sm"]
```

<action>Call `Add Comment` to post the dev notes separately (keeps them visible in the comment stream):</action>

```
issue_key: "{selected_issue_key}"
body: |
  ## Dev Notes — Prepared by SM Agent

  ### Architecture Context
  {architecture_patterns_and_constraints}

  ### Source Tree Components
  {files_and_modules_to_touch}

  ### Testing Standards
  {testing_approach}

  ### References
  {cited_sources_with_paths}
```
</step>

<step n="5" goal="Create subtasks in Jira (if tasks were decomposed)">
<action>For each Task/Subtask identified in step 3:</action>
<action>Call `Create Issue`:</action>

```
project_key: "{jira_project_key}"
issue_type: "Sub-task"
summary: "{task_description} (AC: #{ac_number})"
description: "{task_details}"
additional_fields:
  parent:
    key: "{selected_issue_key}"
  labels: ["{agent_label_prefix}sm", "bmad-task"]
```
</step>

<step n="6" goal="Transition story to Ready for Dev">
<action>Invoke `transition-jira-issue` task with:</action>

```
issue_key: "{selected_issue_key}"
transition_id: "{status_transitions.story.backlog_to_ready_for_dev}"
comment: "Story prepared with full dev context by SM agent"
fallback_status_name: "Ready for Dev"
```
</step>

<step n="7" goal="Report">
<action>Report to user:</action>

**Story Prepared: {story_title}**

- **Jira Issue:** {selected_issue_key}
- **Status:** Ready for Dev
- **Tasks Created:** {task_count} subtasks
- **Dev Notes:** Posted as comment on {selected_issue_key}

**Next Steps:**
1. Dev agent can pick up this story with [DS] Dev Story
2. Or prepare the next story with [CS] Create Story
</step>

</workflow>
