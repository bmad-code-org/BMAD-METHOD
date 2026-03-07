# Retrospective — Jira/Confluence Integration

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: the workflow-jira.yaml for this workflow</critical>

## Overview

Runs an epic-level retrospective by gathering data from Jira stories, Dev Agent Records, and QA findings. Generates insights and lessons learned, publishes the retrospective to Confluence, and optionally transitions the Epic to Done.

---

<workflow>

<step n="1" goal="Identify target — determine which Epic to retrospect">
<action>Communicate in {communication_language} with {user_name}</action>
<action>Ask the user which Epic to run the retrospective for</action>
<action>If context is available (e.g. a recently completed sprint), detect the target Epic automatically and confirm with the user</action>
<action>Call `Get Issue` to load the full Epic details for the selected epic_key</action>
</step>

<step n="2" goal="Gather data — load all stories, comments, and dev records for the Epic">
<action>Call `Search Issues` with JQL: `project = {jira_project_key} AND "Epic Link" = {epic_key} ORDER BY rank ASC`</action>
<action>For each Story returned, call `Get Issue` to load the full description, status, and acceptance criteria</action>
<action>For each Story, call `Get Comments` to retrieve all comments</action>
<action>Parse comments to identify:</action>

1. **Dev Agent Records** — implementation notes, decisions made during development
2. **QA findings** — test results, bugs found, regressions
3. **Code review feedback** — review comments, requested changes, approvals
4. **Blockers and escalations** — issues that required intervention

<action>Record the status of each story (Done, In Progress, To Do, etc.)</action>
<action>Note any stories that were added, removed, or significantly changed mid-sprint</action>
</step>

<step n="3" goal="Analyse — categorize findings and identify patterns">
<action>Categorize findings into:</action>

**What went well:**
- Stories completed on time with clean acceptance
- Effective patterns or practices identified in dev records
- Smooth handoffs between agents

**What didn't go well:**
- Stories that took significantly longer than expected
- Recurring blockers or impediments
- Quality issues found in code review or QA
- Communication gaps or misalignments

**Patterns in dev records:**
- Common technical challenges across stories
- Repeated architectural decisions or deviations
- Testing gaps or coverage patterns

**Code review findings:**
- Frequently requested changes
- Quality trends across the epic
- Technical debt introduced or addressed
</step>

<step n="4" goal="Generate insights — lessons learned, improvements, and technical debt">
<action>Synthesize the analysis into actionable insights:</action>

1. **Lessons learned** — key takeaways for future epics
2. **Process improvements** — specific changes to workflows, templates, or practices
3. **Technical debt identified** — items that need future attention
4. **Estimation accuracy** — how well story sizing matched actual effort
5. **Recommendations** — concrete suggestions for the next epic or sprint

<action>Prepare the retrospective content in {document_output_language}</action>
</step>

<step n="5" goal="Publish retrospective and wrap up">
<action>Invoke the `write-to-confluence` task with:</action>

```
space_key: "{confluence_space_key}"
parent_page_id: "{confluence_parent_page_id}"
title: "{project_name} — Retrospective: {epic_summary} ({date})"
content: "{compiled_retrospective_content}"
key_map_entry: "confluence_pages.retrospective_{epic_id}"
```

<action>Update `{key_map_file}` with the new Confluence page ID under `confluence_pages.retrospective_{epic_id}`</action>

<action>Post a summary comment on the Epic in Jira:</action>
<action>Call `Add Comment` with:</action>

```
issue_key: "{epic_key}"
body: |
  ## Retrospective Complete

  **Date:** {date}
  **Report:** {retrospective_confluence_url}

  ### Key Takeaways
  {top_3_insights}

  ### Action Items
  {action_items_summary}
```

<action>Check if all Stories under the Epic are in Done status</action>
<action>If all stories are Done, invoke the `transition-jira-issue` task to transition the Epic to Done:</action>

```
issue_key: "{epic_key}"
target_status: "Done"
```

<action>If the Epic is now Done, activate BMAD Party Mode:</action>

```
🎉🎉🎉 EPIC COMPLETE! 🎉🎉🎉

  {epic_key}: {epic_summary}

  Stories Delivered: {total_stories}
  Retrospective: {retrospective_confluence_url}

  Great work, {user_name}! Time to celebrate! 🥳
```

<action>Invoke the `post-handoff` task with:</action>

```
handoff_to: "SM"
handoff_type: "retrospective_complete"
summary: "Retrospective for {epic_key} published to Confluence. {epic_status_message}"
confluence_page: "{retrospective_page_id}"
```

<action>Report to user:</action>

**Retrospective Complete**

- **Confluence Report:** {retrospective_confluence_url}
- **Epic:** {epic_key} — {epic_summary}
- **Stories Reviewed:** {story_count}
- **Epic Status:** {epic_status}
- **Key Insights:** {insight_count}
- **Action Items:** {action_item_count}
</step>

</workflow>
