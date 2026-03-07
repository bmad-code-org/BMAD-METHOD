# Jira State Reader — Automated Project State Polling

**Purpose:** Read the current state of a BMAD project from Jira and Confluence via MCP tools. Returns a structured state model that the agent dispatch rules use to determine which agent to invoke next.

---

## When to Run

- At the start of every automated orchestrator cycle
- When a user asks "what's next?" or "show project status"
- After any agent completes its workflow (to determine the next action)

---

## State Model

The state reader builds a `ProjectState` object with the following structure:

```yaml
project_state:
  project_key: "{jira_project_key}"
  timestamp: "{current_time}"

  # Planning artefacts (from Confluence)
  artefacts:
    product_brief: { exists: bool, page_id: str }
    research: { exists: bool, page_ids: [str] }
    prd: { exists: bool, page_id: str }
    ux_design: { exists: bool, page_id: str }
    architecture: { exists: bool, page_id: str }
    readiness_report: { exists: bool, page_id: str }

  # Jira state
  epics:
    total: int
    by_status: { backlog: int, in_progress: int, done: int }
    details: [{ key: str, summary: str, status: str }]

  stories:
    total: int
    by_status: { backlog: int, ready_for_dev: int, in_progress: int, review: int, done: int }

  # Active work
  locked_issues: [{ key: str, summary: str, locked_since: str }]
  stale_locks: [{ key: str, summary: str, locked_since: str }]

  # Handoff signals
  pending_handoffs: [{ issue_key: str, target_agent: str, label: str }]

  # Sprint
  active_sprint: { exists: bool, name: str, sprint_id: str, story_count: int }
```

---

## Polling Sequence

<workflow>

<step n="1" goal="Check Confluence for planning artefacts">
<action>For each artefact type, check the key map file first:</action>
<action>Read `{key_map_file}` and check `confluence_pages` section for existing page IDs</action>

<action>For any missing entries, search Confluence:</action>

```
Search Content: query = "space = {confluence_space_key} AND label = bmad-brief"         → product_brief
Search Content: query = "space = {confluence_space_key} AND label = bmad-research"      → research (may return multiple)
Search Content: query = "space = {confluence_space_key} AND label = bmad-prd"            → prd
Search Content: query = "space = {confluence_space_key} AND label = bmad-ux"             → ux_design
Search Content: query = "space = {confluence_space_key} AND label = bmad-architecture"   → architecture
Search Content: query = "space = {confluence_space_key} AND label = bmad-readiness"      → readiness_report
```

<action>Record existence and page IDs for each</action>
</step>

<step n="2" goal="Query Jira for epics">
<action>Call `Search Issues` with JQL:</action>

```
project = {jira_project_key} AND issuetype = Epic ORDER BY rank ASC
```

`fields: "summary,status,labels"` and `limit: 50`

<action>Count epics by status category</action>
<action>Record each epic's key, summary, and status</action>
</step>

<step n="3" goal="Query Jira for stories">
<action>Call `Search Issues` with JQL:</action>

```
project = {jira_project_key} AND issuetype = Story ORDER BY rank ASC
```

`fields: "summary,status,labels"` and `limit: 50`

<action>Count stories by status. Map Jira status names to BMAD statuses:</action>

| Jira Status (common names) | BMAD Status |
|---|---|
| To Do, Backlog, Open | backlog |
| Ready for Dev, Selected for Development | ready_for_dev |
| In Progress, In Development | in_progress |
| In Review, Code Review, Review | review |
| Done, Closed, Resolved | done |

<action>If pagination is needed (more than 50 stories), make additional calls with `start_at`</action>
</step>

<step n="4" goal="Check for locked issues">
<action>Call `Search Issues` with JQL:</action>

```
project = {jira_project_key} AND labels = "{lock_label}"
```

`fields: "summary,labels,updated"`

<action>For each locked issue, check if it's stale (updated more than 1 hour ago)</action>
<action>Record locked issues and flag stale locks</action>
</step>

<step n="5" goal="Scan for handoff labels">
<action>Call `Search Issues` with JQL:</action>

```
project = {jira_project_key} AND labels in ("bmad-handoff-analyst", "bmad-handoff-pm", "bmad-handoff-ux-designer", "bmad-handoff-architect", "bmad-handoff-sm", "bmad-handoff-dev", "bmad-handoff-qa")
```

`fields: "summary,labels"`

<action>For each issue with a handoff label, extract the target agent name from the label (e.g., `bmad-handoff-sm` → SM)</action>
<action>Record in `pending_handoffs` array with issue_key, target_agent, and label</action>
<action>Handoff labels take priority over state-based dispatch in the agent dispatch rules</action>
</step>

<step n="6" goal="Check active sprint">
<action>If `{jira_board_id}` is configured:</action>
<action>Call `Get Sprints from Board` with `board_id: "{jira_board_id}"` and `state: "active"`</action>
<action>If active sprint found, call `Get Sprint Issues` with `sprint_id` and count stories</action>
</step>

<step n="7" goal="Clear stale locks (if any)">
<action>For each stale lock found in step 4:</action>
<action>Call `Get Issue` with `issue_key` and `fields: "labels"` to get current labels</action>
<action>Build new labels array without `{lock_label}`</action>
<action>Call `Update Issue` to remove the lock label</action>
<action>Call `Add Comment`: "🔓 Stale lock cleared by orchestrator (locked for >1 hour with no activity)"</action>
</step>

<step n="8" goal="Sync key map">
<action>Update `{key_map_file}` with any newly discovered Jira keys or Confluence page IDs that weren't previously recorded</action>
<action>Update `last_updated` timestamp</action>
</step>

</workflow>

---

## Output

Returns the `ProjectState` object to the calling orchestrator or agent dispatch rules.

For human display, format as:

```
📊 Project Status: {jira_project_key}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Planning Artefacts:
  Product Brief:  {✅ | ❌}
  PRD:            {✅ | ❌}
  UX Design:      {✅ | ❌}
  Architecture:   {✅ | ❌}

Epics: {total} ({done} done, {in_progress} active, {backlog} backlog)
Stories: {total} ({done} done, {review} review, {in_progress} active, {ready_for_dev} ready, {backlog} backlog)

Sprint: {sprint_name or "None active"}
Locked Issues: {count} ({stale_count} stale — auto-cleared)
```
