# Read Jira Context — Reusable Task

**Purpose:** Fetch relevant Jira issues and Confluence pages to build context for an agent. Returns only what the agent needs for its current task, keeping the context window narrow.

---

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `context_type` | Yes | Type of context needed (see context types below) |
| `scope_key` | No | Specific epic key, story key, or identifier to scope the query |
| `fields` | No | Jira fields to include (defaults vary by context type) |

---

## Context Types

### `project_overview`

**Used by:** Orchestrator, PM (initial PRD creation)

<action>Call `Search Issues` with JQL: `project = {jira_project_key} AND issuetype = Epic ORDER BY rank ASC` and `fields: "summary,status,description"`</action>
<action>Call `Search Content` with `query: "space = {confluence_space_key} AND label = bmad-prd"` to find PRD page</action>
<action>Call `Search Content` with `query: "space = {confluence_space_key} AND label = bmad-architecture"` to find Architecture page</action>

**Returns:** List of epics with statuses, PRD page ID (if exists), Architecture page ID (if exists)

---

### `epic_detail`

**Used by:** SM (create-story), Architect (architecture decisions)

<action>Call `Get Issue` with `issue_key: "{scope_key}"` and `fields: "summary,description,status,labels"`</action>
<action>Call `Search Issues` with JQL: `"Epic Link" = {scope_key} AND issuetype = Story ORDER BY rank ASC` and `fields: "summary,status,description"`</action>

**Returns:** Epic details + all stories under that epic with their statuses

---

### `story_detail`

**Used by:** Dev (dev-story), SM (create-story enrichment)

<action>Call `Get Issue` with `issue_key: "{scope_key}"` and `fields: "summary,description,status,labels,comment"` and `comment_limit: 5`</action>
<action>Look up the parent Epic from the issue's epic link field</action>
<action>If Architecture page exists in key map, call `Get Page` with `page_id: "{architecture_page_id}"` to fetch architecture context</action>

**Returns:** Full story details with recent comments, parent epic summary, architecture excerpts

---

### `sprint_status`

**Used by:** SM (sprint planning), Orchestrator

<action>Call `Get Sprints from Board` with `board_id: "{jira_board_id}"` and `state: "active"`</action>
<action>If active sprint found, call `Get Sprint Issues` with `sprint_id: "{active_sprint_id}"` and `fields: "summary,status,assignee"`</action>
<action>Call `Search Issues` with JQL: `project = {jira_project_key} AND issuetype = Story AND sprint is EMPTY AND status != Done ORDER BY rank ASC` and `fields: "summary,status"` to find unplanned stories</action>

**Returns:** Active sprint issues with statuses, backlog stories not yet in a sprint

---

### `confluence_artefact`

**Used by:** Any agent needing a specific Confluence document

<action>Look up `{scope_key}` in `.jira-key-map.yaml` under `confluence_pages`</action>
<action>If found, call `Get Page` with `page_id: "{page_id}"`</action>
<action>If not found, call `Search Content` with `query: "space = {confluence_space_key} AND label = bmad-{scope_key}"`</action>

**Returns:** Page content in markdown format

---

### `previous_story_learnings`

**Used by:** SM (create-story, to incorporate learnings from previous stories)

<action>Call `Search Issues` with JQL: `project = {jira_project_key} AND issuetype = Story AND status = Done ORDER BY updated DESC` and `limit: 3` and `fields: "summary,comment"`</action>
<action>Extract completion notes from the most recent comments on each done story</action>

**Returns:** Summary of last 3 completed stories' dev agent records and completion notes

---

## Output Format

The task returns a structured context block that the calling workflow injects into the agent's prompt:

```markdown
## Jira Context for {agent_name}

### {context_section_1_title}
{content}

### {context_section_2_title}
{content}
```

This replaces the file-system pattern of reading local markdown files. The agent receives the same information but sourced from Jira/Confluence.
