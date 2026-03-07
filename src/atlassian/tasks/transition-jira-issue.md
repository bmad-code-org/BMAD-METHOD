# Transition Jira Issue — Reusable Task

**Purpose:** Safely transition a Jira issue to a new status. Always verifies the transition is available before attempting it. Handles cases where the target status is already reached or the transition is not available.

---

## Parameters

| Parameter | Required | Description |
|---|---|---|
| `issue_key` | Yes | Jira issue key (e.g., `PROJ-42`) |
| `transition_id` | Yes | Target transition ID from `status_transitions` config |
| `comment` | No | Optional comment to add during transition |
| `fallback_status_name` | No | Target status name for fuzzy matching if transition_id fails |

---

## Execution

<workflow>

<step n="1" goal="Verify transition is available">
<action>Call `Get Transitions` with `issue_key: "{issue_key}"`</action>
<action>The response lists all currently available transitions with their IDs and target status names</action>

**Check for the configured transition:**
- If `{transition_id}` appears in the available transitions → proceed to step 2
- If `{transition_id}` is empty (no-op configured) → skip transition, report success
- If `{transition_id}` is not in available transitions:
  - Check if the issue is already in the target state (transition already happened)
  - If already in target state → skip transition, report success
  - If `{fallback_status_name}` is provided, search available transitions for one whose target name matches → use that transition ID
  - If no match found → report warning: "Transition {transition_id} not available for {issue_key}. Available transitions: {list}. The Jira workflow may need updating or the status_transitions config may need adjustment."
</step>

<step n="2" goal="Execute the transition">
<action>Call `Transition Issue` with:</action>

```
issue_key: "{issue_key}"
transition_id: "{verified_transition_id}"
comment: "{comment}"         # omit if empty
```

<action>Verify the transition succeeded by checking the response</action>
</step>

<step n="3" goal="Report result">
<action>If transition succeeded: report the new status to the calling workflow</action>
<action>If transition failed: report the error and suggest the user check their Jira workflow configuration</action>
</step>

</workflow>

---

## Error Handling

| Scenario | Action |
|---|---|
| Transition ID not found | Search by `fallback_status_name`, then warn user |
| Issue already in target state | Skip silently, return success |
| Transition ID empty (no-op) | Skip silently, return success |
| Permission denied | Report to user — they may need Jira project permissions |
| Network error | Retry once after 2 seconds, then report failure |
