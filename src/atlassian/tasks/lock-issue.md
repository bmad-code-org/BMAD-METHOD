# Lock/Unlock Jira Issue — Reusable Task

**Purpose:** Implement simple agent locking by adding or removing the `agent-active` label on a Jira issue. Prevents multiple agents from working on the same issue simultaneously.

---

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `issue_key` | Yes | Jira issue key (e.g., `PROJ-42`) |
| `action` | Yes | `"lock"` or `"unlock"` |
| `agent_name` | No | Name of the agent acquiring/releasing the lock (for comment) |

---

## Execution

<workflow>

<step n="1" goal="Read current labels">
<action>Call `Get Issue` with `issue_key: "{issue_key}"` and `fields: "labels"`</action>
<action>Record the current labels array</action>
</step>

<step n="2" goal="Check lock state and act">

**If action is "lock":**
<action>Check if `{lock_label}` is already in the labels array</action>
- If already locked → STOP. Report: "Issue {issue_key} is already locked by another agent. Wait and retry, or check if the lock is stale."
- If not locked → proceed to add the label

<action>Build new labels array: current labels + `"{lock_label}"`</action>
<action>Call `Update Issue` with:</action>

```
issue_key: "{issue_key}"
fields: {}
additional_fields:
  labels: ["{existing_labels}", "{lock_label}"]
```

<action>If `agent_name` is provided, call `Add Comment` with:</action>

```
issue_key: "{issue_key}"
body: "🔒 Locked by BMAD agent: {agent_name}"
```

**If action is "unlock":**
<action>Build new labels array: current labels minus `"{lock_label}"`</action>
<action>Call `Update Issue` with:</action>

```
issue_key: "{issue_key}"
fields: {}
additional_fields:
  labels: ["{remaining_labels}"]
```

<action>If `agent_name` is provided, call `Add Comment` with:</action>

```
issue_key: "{issue_key}"
body: "🔓 Unlocked by BMAD agent: {agent_name}"
```
</step>

</workflow>

---

## Stale Lock Detection

A lock is considered stale if the issue has been locked for more than 1 hour without any agent activity (no comments or updates). The orchestrator's state reader checks for stale locks during polling and can force-unlock them.

To check for stale locks:
1. Call `Search Issues` with JQL: `project = {jira_project_key} AND labels = "{lock_label}" AND updated < -1h`
2. For any results, force-unlock by removing the label and adding a comment: "🔓 Stale lock cleared by orchestrator"
