# Code Review — Jira Integration

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: the workflow-jira.yaml for this workflow</critical>

## Overview

Runs the code review checklist and posts the results as a structured Jira comment on the story. If the review passes, transitions the story to Done. If it fails, adds findings and keeps the story in Review for fixes.

---

<workflow>

<step n="1" goal="Identify the story under review">
<action>Call `Search Issues` with JQL:</action>

```
project = {jira_project_key} AND issuetype = Story AND status = "Review" ORDER BY updated DESC
```

`fields: "summary,description,labels"` and `limit: 5`

<action>If user specified a story key, use that instead</action>
<action>Present candidates and wait for selection</action>
<action>Call `Get Issue` with `issue_key: "{selected_issue_key}"` and `fields: "summary,description,comment"` and `comment_limit: 10` to load the dev agent record</action>
</step>

<step n="2" goal="Lock the story and run code review">
<action>Invoke `lock-issue` task with `issue_key: "{selected_issue_key}"`, `action: "lock"`, `agent_name: "code-review"`</action>

<action>Follow the code review checklist at `{checklist}`</action>

Review the implementation across all quality facets:
- Code correctness and completeness against acceptance criteria
- Test coverage and quality
- Architecture alignment
- Security considerations
- Performance implications
- Code style and maintainability
</step>

<step n="3" goal="Post review results to Jira">
<action>Call `Add Comment` with:</action>

```
issue_key: "{selected_issue_key}"
body: |
  ## Code Review Results

  **Reviewer:** BMAD Code Review Agent
  **Date:** {date}
  **Verdict:** {PASS | FAIL | PASS_WITH_NOTES}

  ### Summary
  {review_summary}

  ### Findings

  {for_each_finding}
  #### {finding_severity}: {finding_title}
  - **Location:** {file_path}:{line_number}
  - **Description:** {finding_description}
  - **Recommendation:** {recommendation}
  {end_for_each}

  ### Acceptance Criteria Verification
  {for_each_ac}
  - [x] AC #{ac_number}: {ac_description} — {verification_status}
  {end_for_each}

  ### Test Coverage
  - Unit Tests: {unit_test_count}
  - Integration Tests: {integration_test_count}
  - Coverage: {coverage_percentage}
```
</step>

<step n="4" goal="Transition based on review outcome">

**If review PASSES:**
<action>Invoke `transition-jira-issue` task:</action>

```
issue_key: "{selected_issue_key}"
transition_id: "{status_transitions.story.review_to_done}"
comment: "Code review passed. Story complete."
fallback_status_name: "Done"
```

<action>Call `Update Issue` to add review label:</action>

```
issue_key: "{selected_issue_key}"
fields: {}
additional_fields:
  labels: ["{existing_labels}", "bmad-reviewed", "review-passed"]
```

<action>Check if all stories in the parent Epic are now Done:</action>
<action>Call `Search Issues` with JQL: `"Epic Link" = {parent_epic_key} AND issuetype = Story AND status != Done`</action>
<action>If no results (all done), invoke `transition-jira-issue` to transition the Epic to Done using `{status_transitions.epic.in_progress_to_done}`</action>

**If review FAILS:**
<action>Call `Update Issue` to add review label:</action>

```
issue_key: "{selected_issue_key}"
fields: {}
additional_fields:
  labels: ["{existing_labels}", "bmad-reviewed", "review-failed"]
```

<action>Do NOT transition — keep in Review status for the dev agent to address findings</action>
<action>Report the specific findings that need to be addressed</action>
</step>

<step n="5" goal="Unlock, hand off, and report">
<action>Invoke `lock-issue` task with `issue_key: "{selected_issue_key}"`, `action: "unlock"`, `agent_name: "code-review"`</action>

{if_passed}
<action>Invoke `post-handoff` task with:</action>

```
handoff_to: "SM"
handoff_type: "review_complete"
summary: "Code review passed for {selected_issue_key}. Story transitioned to Done. SM should check if next story is ready or if retrospective is needed."
jira_issue_keys: ["{selected_issue_key}"]
```
{end_if}

<action>Report to user:</action>

**Code Review: {verdict}**

- **Story:** {selected_issue_key} — {story_title}
- **Findings:** {finding_count} ({critical_count} critical, {major_count} major, {minor_count} minor)
- **AC Verified:** {verified_count}/{total_ac_count}

{if_passed}
Story transitioned to **Done**. {if_epic_complete} Epic {parent_epic_key} also marked Done — all stories complete!{end_if}
{end_if}

{if_failed}
Story remains in **Review**. Address the findings and re-run [CR] Code Review.
{end_if}
</step>

</workflow>
