# Post Handoff — Cross-Agent Communication

<critical>This is a reusable task. It is invoked by workflows at completion to notify the next agent.</critical>

## Purpose

Posts a structured handoff notification on relevant Jira issues when an agent completes its workflow and work is ready for the next agent. This enables traceability and automated orchestrator dispatch.

---

## Required Inputs

| Input | Description |
|---|---|
| `handoff_to` | The target agent name (e.g., "PM", "Architect", "SM", "Dev", "QA") |
| `handoff_type` | The type of handoff (e.g., "product_brief_complete", "prd_complete", "architecture_complete", "sprint_planned", "story_prepared", "dev_complete", "review_complete") |
| `summary` | Brief description of what was completed and what the next agent should do |
| `jira_issue_keys` | (Optional) Specific Jira issue keys to post the handoff comment on. If not provided, posts on the most relevant Epic. |
| `confluence_page` | (Optional) Confluence page ID of the artefact produced |

---

## Procedure

### Step 1 — Determine target issues

If `jira_issue_keys` are provided, use those directly.

If not, determine the most relevant issues based on `handoff_type`:

- **product_brief_complete / research_complete**: Find the first Epic via JQL: `project = {jira_project_key} AND issuetype = Epic ORDER BY rank ASC LIMIT 1`. If no Epics exist yet, skip Jira comment (Confluence page is the primary artefact).
- **prd_complete / ux_design_complete / architecture_complete / readiness_complete**: Post on all Epics: `project = {jira_project_key} AND issuetype = Epic ORDER BY rank ASC`
- **sprint_planned**: Post on each Epic that has stories in the sprint.
- **story_prepared**: Post on the specific story issue.
- **dev_complete / review_complete**: Post on the specific story issue.
- **retrospective_complete**: Post on the Epic being retrospected.
- **correct_course_complete**: Post on all affected issues.

### Step 2 — Post handoff comment

For each target Jira issue, call `Add Comment` with:

```
issue_key: "{target_issue_key}"
body: |
  ## Agent Handoff: {current_agent} → {handoff_to}

  **Completed:** {handoff_type}
  **Summary:** {summary}
  **Artefact:** {confluence_page_url or "See Jira issue updates"}
  **Next Action:** {recommended_next_workflow}

  ---
  _Posted by BMAD Agent System_
```

### Step 3 — Apply handoff label

For each target Jira issue, add a handoff label to signal the orchestrator:

Call `Get Issue` for the target issue to read current labels.

Call `Update Issue` with:

```
issue_key: "{target_issue_key}"
additional_fields:
  labels: [{existing_labels}, "bmad-handoff-{handoff_to_lowercase}"]
```

Where `{handoff_to_lowercase}` is the target agent name in lowercase (e.g., "bmad-handoff-sm", "bmad-handoff-dev").

### Step 4 — Update key map (if applicable)

If a `confluence_page` ID was provided, ensure it is recorded in `{key_map_file}` under the appropriate `confluence_pages` entry.

### Step 5 — Log completion

Report the handoff:

```
Handoff posted: {current_agent} → {handoff_to}
Issues notified: {issue_key_list}
Label applied: bmad-handoff-{handoff_to_lowercase}
```

---

## Handoff Type Reference

| Handoff Type | From Agent | To Agent | Next Workflow |
|---|---|---|---|
| `product_brief_complete` | Analyst | PM | Create PRD |
| `research_complete` | Analyst | PM | Create PRD |
| `prd_complete` | PM | UX Designer | Create UX Design |
| `ux_design_complete` | UX Designer | Architect | Create Architecture |
| `architecture_complete` | Architect | SM | Create Epics and Stories |
| `readiness_complete` | SM | SM | Sprint Planning |
| `sprint_planned` | SM | SM | Create Story |
| `story_prepared` | SM | Dev | Dev Story |
| `dev_complete` | Dev | QA | Code Review |
| `review_complete` | QA | SM | Next Story or Retrospective |
| `retrospective_complete` | SM | SM | Next Epic or Complete |
| `correct_course_complete` | SM | Dev/SM | Resume work |

---

## Orchestrator Integration

The orchestrator's `jira-state-reader` scans for `bmad-handoff-*` labels during its polling cycle. When detected:

1. The label indicates which agent should be dispatched next
2. The orchestrator reads the handoff comment for context
3. After dispatching the agent, the `bmad-handoff-*` label is removed

This creates a reliable, label-based signalling mechanism that survives across sessions and is visible in the Jira UI.
