# Agent Dispatch Rules — Automated Orchestrator

**Purpose:** Given the `ProjectState` from the Jira State Reader, determine which BMAD agent and workflow to invoke next. Implements the automated polling mode where the orchestrator drives the project forward based on Jira state.

---

## Dispatch Priority

Rules are evaluated in order. The first matching rule fires. If no rule matches, the project is either complete or blocked.

---

## Rule Definitions

<rules>

<rule n="0" name="Handoff Signal Detected">
<condition>project_state.pending_handoffs is not empty</condition>
<action>Dispatch the agent indicated by the handoff label</action>
<procedure>
  1. Take the first pending handoff from the list
  2. Read the handoff comment on the issue for context (look for "## Agent Handoff:" comments)
  3. Dispatch the target agent with the recommended workflow from the handoff comment
  4. After dispatching, remove the `bmad-handoff-{agent}` label from the issue via Update Issue
</procedure>
<message>Handoff detected: {target_agent} should work on {issue_key}. Dispatching.</message>
<notes>Handoff labels take absolute priority over state-based rules below. This ensures agents respond to explicit signals from the previous agent rather than re-inferring state.</notes>
</rule>

<rule n="1" name="Blocked — Agent Active">
<condition>project_state.locked_issues is not empty (after stale lock clearing)</condition>
<action>WAIT — another agent is currently working</action>
<message>Agent is active on: {locked_issue_keys}. Waiting for completion.</message>
<retry>Poll again in 30 seconds</retry>
</rule>

<rule n="2" name="Phase 1 — Product Brief Needed">
<condition>project_state.artefacts.product_brief.exists == false</condition>
<agent>Analyst (Mary)</agent>
<workflow>Create Brief [CB]</workflow>
<context_to_load>None (user provides initial input)</context_to_load>
<message>No product brief found. Starting with Analyst to create the product brief.</message>
<notes>This is typically the entry point for a new project. The user should have an idea to discuss.</notes>
</rule>

<rule n="3" name="Phase 2 — PRD Needed">
<condition>
  project_state.artefacts.product_brief.exists == true
  AND project_state.artefacts.prd.exists == false
</condition>
<agent>PM (John)</agent>
<workflow>Create PRD [CP]</workflow>
<context_to_load>
  - Product Brief from Confluence (page_id from key map)
  - Any research reports from Confluence
</context_to_load>
<message>Product brief exists. Invoking PM to create the PRD.</message>
</rule>

<rule n="4" name="Phase 2 — UX Design Needed">
<condition>
  project_state.artefacts.prd.exists == true
  AND project_state.artefacts.ux_design.exists == false
</condition>
<agent>UX Designer (Sally)</agent>
<workflow>Create UX Design [CU]</workflow>
<context_to_load>
  - PRD from Confluence
  - Product Brief from Confluence
</context_to_load>
<message>PRD exists. Invoking UX Designer for UX design.</message>
<notes>UX Design is recommended but optional. If user wants to skip, proceed to epics.</notes>
</rule>

<rule n="5" name="Phase 2/3 — Epics and Stories Needed">
<condition>
  project_state.artefacts.prd.exists == true
  AND project_state.epics.total == 0
</condition>
<agent>PM (John)</agent>
<workflow>Create Epics and Stories [CE] — with Jira output override</workflow>
<context_to_load>
  - PRD from Confluence
  - UX Design from Confluence (if exists)
</context_to_load>
<message>PRD exists but no epics in Jira. Invoking PM to create epics and stories.</message>
</rule>

<rule n="6" name="Phase 3 — Architecture Needed">
<condition>
  project_state.epics.total > 0
  AND project_state.artefacts.architecture.exists == false
</condition>
<agent>Architect (Winston)</agent>
<workflow>Create Architecture [CA]</workflow>
<context_to_load>
  - PRD from Confluence
  - Epic summaries from Jira (Search Issues: issuetype = Epic)
  - UX Design from Confluence (if exists)
</context_to_load>
<message>Epics exist but no architecture document. Invoking Architect.</message>
</rule>

<rule n="7" name="Phase 3 — Implementation Readiness Check">
<condition>
  project_state.artefacts.architecture.exists == true
  AND project_state.stories.by_status.ready_for_dev == 0
  AND project_state.stories.by_status.in_progress == 0
  AND project_state.stories.by_status.backlog > 0
  AND project_state.active_sprint.exists == false
</condition>
<agent>PM (John) or Architect (Winston)</agent>
<workflow>Implementation Readiness [IR]</workflow>
<context_to_load>
  - PRD, UX Design, Architecture from Confluence
  - All Epics and Stories from Jira
</context_to_load>
<message>Architecture exists. Running implementation readiness check before sprint planning.</message>
<notes>This is an optional quality gate. Can be skipped if user wants to proceed directly.</notes>
</rule>

<rule n="8" name="Phase 4 — Sprint Planning Needed">
<condition>
  project_state.artefacts.architecture.exists == true
  AND project_state.active_sprint.exists == false
  AND project_state.stories.by_status.backlog > 0
</condition>
<agent>SM (Bob)</agent>
<workflow>Sprint Planning [SP] — Jira override</workflow>
<context_to_load>
  - All Epics and Stories from Jira
</context_to_load>
<message>No active sprint. Invoking SM for sprint planning.</message>
</rule>

<rule n="9" name="Phase 4 — Story Preparation Needed">
<condition>
  project_state.stories.by_status.backlog > 0
  AND project_state.stories.by_status.ready_for_dev == 0
  AND project_state.stories.by_status.in_progress == 0
</condition>
<agent>SM (Bob)</agent>
<workflow>Create Story [CS] — Jira override</workflow>
<context_to_load>
  - Next backlog story from Jira
  - Architecture from Confluence
  - Previous story learnings from Jira comments
</context_to_load>
<message>Stories in backlog need dev context. Invoking SM to prepare the next story.</message>
</rule>

<rule n="10" name="Phase 4 — Development">
<condition>project_state.stories.by_status.ready_for_dev > 0</condition>
<agent>Dev (Amelia)</agent>
<workflow>Dev Story [DS] — Jira override</workflow>
<context_to_load>
  - Next "Ready for Dev" story from Jira
  - Architecture from Confluence
</context_to_load>
<message>Stories ready for development. Invoking Dev agent.</message>
</rule>

<rule n="11" name="Phase 4 — Code Review">
<condition>project_state.stories.by_status.review > 0</condition>
<agent>Dev (Amelia)</agent>
<workflow>Code Review [CR] — Jira override</workflow>
<context_to_load>
  - Story in "Review" status from Jira
  - Dev agent record from Jira comments
</context_to_load>
<message>Stories awaiting review. Invoking code review.</message>
<notes>Recommended: use a fresh context window and different LLM for adversarial review</notes>
</rule>

<rule n="12" name="Phase 4 — More Stories to Prepare">
<condition>
  project_state.stories.by_status.backlog > 0
  AND (project_state.stories.by_status.in_progress > 0 OR project_state.stories.by_status.review > 0)
</condition>
<agent>SM (Bob)</agent>
<workflow>Create Story [CS] — Jira override</workflow>
<context_to_load>
  - Next backlog story
  - Previous story learnings
</context_to_load>
<message>Dev is busy. Preparing the next story in parallel.</message>
<notes>Only if team capacity allows parallel work. Default: sequential story prep.</notes>
</rule>

<rule n="13" name="Epic Retrospective">
<condition>
  Any epic where all stories are "done" AND epic status is "in_progress"
</condition>
<agent>SM (Bob)</agent>
<workflow>Epic Retrospective [ER]</workflow>
<context_to_load>
  - All done stories in the epic from Jira
  - Dev agent records from Jira comments
</context_to_load>
<message>All stories complete for Epic {epic_key}. Running retrospective.</message>
<post_action>Transition Epic to Done via transition-jira-issue task</post_action>
</rule>

<rule n="14" name="Project Complete">
<condition>
  project_state.epics.by_status.done == project_state.epics.total
  AND project_state.epics.total > 0
</condition>
<action>COMPLETE</action>
<message>All epics are done. Project implementation is complete! 🎉</message>
</rule>

<rule n="15" name="No Action — Fallback">
<condition>No other rule matched</condition>
<action>ASK_USER</action>
<message>Unable to determine next action automatically. Current state: {state_summary}. What would you like to do?</message>
</rule>

</rules>

---

## Orchestrator Loop

When running in automated mode, the orchestrator repeats:

```
1. Run jira-state-reader to poll project state
2. Evaluate dispatch rules against state
3. If agent should be invoked:
   a. Load the specified context
   b. Invoke the agent with its workflow
   c. Wait for agent completion
   d. Return to step 1
4. If WAIT: pause and re-poll after 30 seconds
5. If COMPLETE or ASK_USER: stop and report to user
```

The user can interrupt at any time to override the automated dispatch or switch to manual mode.
