# Transition Discovery — Jira Workflow Setup

**Purpose:** Discover the Jira transition IDs for your project's workflow and populate the `status_transitions` configuration. Run this once during initial setup and again if your Jira workflow changes.

---

## Prerequisites

- The Atlassian MCP server must be connected and authenticated
- You need at least one existing issue in your Jira project (any type)
- You need your Jira project key (e.g., `PROJ`)

---

## Discovery Workflow

<workflow>

<step n="1" goal="Discover the Jira Agile board">
<action>Call `Get Agile Boards` with `project_key: "{jira_project_key}"`</action>
<action>Record the `board_id` from the response — this is needed for sprint operations</action>
<action>If multiple boards are returned, ask the user which one to use</action>

**Expected output:** Board ID (integer)

**Update config:** Set `jira_board_id` to the discovered board ID
</step>

<step n="2" goal="Find or create a sample Epic to discover Epic transitions">
<action>Call `Search Issues` with JQL: `project = {jira_project_key} AND issuetype = Epic ORDER BY created DESC` and `limit: 1`</action>
<action>If no Epic exists, call `Create Issue` with `project_key: "{jira_project_key}"`, `issue_type: "Epic"`, `summary: "[BMAD Setup] Transition Discovery - Delete After Setup"` to create a temporary one</action>
<action>Record the Epic issue key (e.g., `PROJ-1`)</action>
</step>

<step n="3" goal="Discover Epic transitions">
<action>Call `Get Transitions` with `issue_key: "{epic_issue_key}"`</action>
<action>The response will list available transitions with their IDs and target status names</action>

**Map each transition to the BMAD status flow:**

```
Epic flow: Backlog → In Progress → Done
```

For each transition returned, identify:
- Which transition moves the epic to an "In Progress" equivalent → `backlog_to_in_progress`
- Which transition moves the epic to a "Done" equivalent → `in_progress_to_done`

**Note:** You may need to transition the epic to intermediate states to discover all transitions. Call `Transition Issue` to move it forward, then call `Get Transitions` again to see what's available from the new state.

<action>Record the transition IDs for the Epic status flow</action>
</step>

<step n="4" goal="Find or create a sample Story to discover Story transitions">
<action>Call `Search Issues` with JQL: `project = {jira_project_key} AND issuetype = Story ORDER BY created DESC` and `limit: 1`</action>
<action>If no Story exists, call `Create Issue` with `project_key: "{jira_project_key}"`, `issue_type: "Story"`, `summary: "[BMAD Setup] Transition Discovery - Delete After Setup"` to create a temporary one</action>
<action>Record the Story issue key</action>
</step>

<step n="5" goal="Discover Story transitions through the full workflow">
<action>Call `Get Transitions` with `issue_key: "{story_issue_key}"` from the initial state</action>

**Map transitions to the BMAD Story status flow:**

```
Story flow: Backlog → Ready for Dev → In Progress → Review → Done
```

For each state in the flow:
1. Record the available transitions
2. Identify the transition that moves to the next BMAD-equivalent state
3. Call `Transition Issue` to advance to that state
4. Call `Get Transitions` again to discover the next set

Build the complete mapping:
- `backlog_to_ready_for_dev`: transition ID from Backlog → Ready for Dev (or equivalent)
- `ready_for_dev_to_in_progress`: transition ID from Ready for Dev → In Progress
- `in_progress_to_review`: transition ID from In Progress → Review (or "In Review")
- `review_to_done`: transition ID from Review → Done

**If your Jira workflow has fewer states** (e.g., To Do → In Progress → Done):
- Map "To Do" to both `backlog` and `ready_for_dev`
- Set `backlog_to_ready_for_dev` to empty (no-op, status is already equivalent)
- The adapter will skip no-op transitions

**If your Jira workflow has more states** (e.g., additional QA or UAT states):
- Map the closest equivalent states
- Document the extra states and how they should be handled
</step>

<step n="6" goal="Clean up temporary issues">
<action>If temporary issues were created in steps 2 and 4, call `Delete Issue` to remove them</action>
<action>Only delete issues whose summary starts with "[BMAD Setup]"</action>
</step>

<step n="7" goal="Output the configuration">
<action>Present the discovered configuration to the user:</action>

```yaml
# Paste this into your _bmad/atlassian/config.yaml under status_transitions:

jira_board_id: {discovered_board_id}

status_transitions:
  epic:
    backlog_to_in_progress: "{epic_transition_id_1}"
    in_progress_to_done: "{epic_transition_id_2}"
  story:
    backlog_to_ready_for_dev: "{story_transition_id_1}"
    ready_for_dev_to_in_progress: "{story_transition_id_2}"
    in_progress_to_review: "{story_transition_id_3}"
    review_to_done: "{story_transition_id_4}"
```

<action>Confirm with the user that the mapping looks correct</action>
<action>If any transitions couldn't be discovered (workflow mismatch), flag them and suggest the user update their Jira workflow or adjust the mapping</action>
</step>

</workflow>

---

## Troubleshooting

**"No transitions available"**: The issue may be in a terminal state or restricted by Jira workflow conditions. Check Jira workflow permissions.

**"Transition not found for target state"**: Your Jira workflow may use different status names. The adapter supports configurable mapping — use whatever transition IDs your workflow provides, even if the status names differ from BMAD's defaults.

**Multiple transitions to the same state**: Some workflows have conditional transitions (e.g., "Start Progress" vs "Resume"). Use the most general one. The adapter calls `Get Transitions` before every transition to verify availability.
