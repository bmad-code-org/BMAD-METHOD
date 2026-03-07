# Check Implementation Readiness — Jira/Confluence Integration

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: the workflow-jira.yaml for this workflow</critical>

## Overview

Validates that PRD, UX Design, Architecture, and Epics/Stories are complete and aligned before Phase 4 implementation begins. Reads all artefacts from Confluence and Jira. Generates a readiness report using the template, publishes it to Confluence, and posts a summary comment on each Epic.

---

<workflow>

<step n="1" goal="Load context — read project artefacts from Confluence and Epics/Stories from Jira">
<action>Communicate in {communication_language} with {user_name}</action>
<action>Invoke the `read-jira-context` task with `context_type: "project_overview"` to discover all available project artefacts</action>

<action>Load each artefact from Confluence:</action>
<action>Invoke `read-jira-context` with `context_type: "confluence_artefact"` and `scope_key: "prd"` to load the PRD</action>
<action>Invoke `read-jira-context` with `context_type: "confluence_artefact"` and `scope_key: "architecture"` to load the Architecture</action>
<action>Invoke `read-jira-context` with `context_type: "confluence_artefact"` and `scope_key: "ux_design"` to load the UX design (if exists)</action>
<action>Invoke `read-jira-context` with `context_type: "confluence_artefact"` and `scope_key: "product_brief"` to load the product brief</action>

<action>Load Epics and Stories from Jira:</action>
<action>Call `Search Issues` with JQL: `project = {jira_project_key} AND issuetype = Epic ORDER BY rank ASC`</action>
<action>For each Epic, call `Search Issues` with JQL: `"Epic Link" = {epic_key} AND issuetype = Story ORDER BY rank ASC`</action>
<action>Call `Get Issue` for each Epic and Story to load full descriptions and acceptance criteria</action>

<action>Report discovery results to the user:</action>

| Artefact | Status |
|---|---|
| PRD | {found/missing} |
| Architecture | {found/missing} |
| UX Design | {found/missing} |
| Product Brief | {found/missing} |
| Epics | {count} found |
| Stories | {count} found |

<action>If any critical artefact is missing, warn the user and ask whether to proceed with a partial readiness check</action>
</step>

<step n="2" goal="Requirements coverage check — verify every PRD requirement maps to at least one Epic/Story">
<action>Extract all functional and non-functional requirements from the PRD</action>
<action>Map each requirement to one or more Epics/Stories</action>
<action>Identify any requirements that are not covered by any Epic or Story</action>
<action>Identify any Epics that do not trace back to a PRD requirement</action>
<action>Record coverage gaps for the readiness report</action>
</step>

<step n="3" goal="Architecture alignment check — verify tech stack, patterns, and ADRs are reflected in story structure">
<action>Review the Architecture document for tech stack decisions, patterns, and ADRs</action>
<action>Verify that stories reference or align with the chosen tech stack and patterns</action>
<action>Check that ADR decisions are reflected in story constraints or implementation notes</action>
<action>Identify any architectural decisions that lack corresponding stories or tasks</action>
<action>Record alignment findings for the readiness report</action>
</step>

<step n="4" goal="Story completeness check — verify all stories have acceptance criteria and proper subtasks">
<action>Review each Story in Jira for completeness:</action>

1. Does every story have clear, testable acceptance criteria?
2. Are stories appropriately sized (not too large or too small)?
3. Do stories have proper subtasks where needed?
4. Are dependencies between stories identified and linked?
5. Is the story ordering logical for implementation?
6. Do stories align with the architecture's component structure?

<action>Record quality findings for the readiness report</action>
</step>

<step n="5" goal="Risk assessment — identify gaps, missing stories, and unaddressed requirements">
<action>Compile all findings from Steps 2–4 into a risk assessment:</action>

1. **Critical gaps** — requirements with no coverage, architectural misalignment
2. **Major gaps** — incomplete stories, missing acceptance criteria
3. **Minor gaps** — ordering issues, missing subtasks, cosmetic concerns

<action>Assign an overall readiness verdict:</action>

- **READY**: All checks pass, implementation can begin
- **READY WITH NOTES**: Minor gaps identified, can proceed with awareness
- **NOT READY**: Critical gaps that must be addressed first

<action>Record the risk assessment for the readiness report</action>
</step>

<step n="6" goal="Generate readiness report, write to Confluence, post comments, and hand off">
<action>Compile the complete readiness report using the template at `{template}`</action>
<action>Generate the report in {document_output_language}</action>

<action>Invoke the `write-to-confluence` task with:</action>

```
space_key: "{confluence_space_key}"
parent_page_id: "{confluence_parent_page_id}"
title: "{project_name} — Implementation Readiness Report ({date})"
content: "{compiled_readiness_report}"
key_map_entry: "confluence_pages.readiness_report"
```

<action>Update `{key_map_file}` with the new Confluence page ID under `confluence_pages.readiness_report`</action>

<action>Post a summary comment on each Epic in Jira:</action>
<action>For each Epic, call `Add Comment` with:</action>

```
issue_key: "{epic_key}"
body: |
  ## Implementation Readiness: {verdict}

  **Date:** {date}
  **Report:** {readiness_report_confluence_url}

  ### Epic-Specific Findings
  {findings_for_this_epic}

  ### Action Items
  {action_items_for_this_epic}
```

<action>Invoke the `post-handoff` task with:</action>

```
handoff_to: "SM"
handoff_type: "readiness_check_complete"
summary: "Implementation readiness check completed. Verdict: {verdict}. Report published to Confluence."
confluence_page: "{readiness_report_page_id}"
```

<action>Report to user:</action>

**Implementation Readiness: {verdict}**

- **Confluence Report:** {readiness_report_page_url}
- **Epics Reviewed:** {epic_count}
- **Stories Reviewed:** {story_count}
- **Findings:** {critical_count} critical, {major_count} major, {minor_count} minor

{if_ready}
**Next Steps:**
1. Begin Phase 4 with [Sprint Planning] to create the first sprint
2. Use [Create Story] to prepare stories with full dev context
{end_if}

{if_not_ready}
**Action Required:**
{list_of_critical_gaps}
Address these gaps before beginning implementation.
{end_if}
</step>

</workflow>
