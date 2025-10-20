# Develop Story - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>Only modify the story file in these areas: Tasks/Subtasks checkboxes, Dev Agent Record (Debug Log, Completion Notes), File List, Change Log, and Status</critical>
<critical>Execute ALL steps in exact order; do NOT skip steps</critical>
<critical>If {{run_until_complete}} == true, run non-interactively: do not pause between steps unless a HALT condition is reached or explicit user approval is required for unapproved dependencies.</critical>
<critical>Absolutely DO NOT stop because of "milestones", "significant progress", or "session boundaries". Continue in a single execution until the story is COMPLETE (all ACs satisfied and all tasks/subtasks checked) or a HALT condition is triggered.</critical>
<critical>Do NOT schedule a "next session" or request review pauses unless a HALT condition applies. Only Step 6 decides completion.</critical>

<critical>User skill level ({user_skill_level}) affects conversation style ONLY, not code updates.</critical>

<workflow>

  <step n="1" goal="Load story from status file IN PROGRESS section">
    <invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
      <param>mode: data</param>
      <param>data_request: next_story</param>
    </invoke-workflow>

    <check if="status_exists == true AND in_progress_story != ''">
      <action>Use IN PROGRESS story from status:</action>
      - {{in_progress_story}}: Current story ID
      - Story file path derived from ID format

      <critical>DO NOT SEARCH - status file provides exact story</critical>

      <action>Determine story file path from in_progress_story ID</action>
      <action>Set {{story_path}} = {story_dir}/{{derived_story_file}}</action>
    </check>

    <check if="status_exists == false OR in_progress_story == ''">
      <action>Fall back to legacy auto-discovery:</action>
      <action>If {{story_path}} explicitly provided → use it</action>
      <action>Otherwise list story-*.md files from {{story_dir}}, sort by modified time</action>
      <ask optional="true" if="{{non_interactive}} == false">Select story or enter path</ask>
      <action if="{{non_interactive}} == true">Auto-select most recent</action>
    </check>

    <action>Read COMPLETE story file from {{story_path}}</action>
    <action>Parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Dev Agent Record, File List, Change Log, Status</action>
    <action>Identify first incomplete task (unchecked [ ]) in Tasks/Subtasks</action>

    <check>If no incomplete tasks → <goto step="6">Completion sequence</goto></check>
    <check>If story file inaccessible → HALT: "Cannot develop story without access to story file"</check>
    <check>If task requirements ambiguous → ASK user to clarify or HALT</check>
  </step>

  <step n="2" goal="Plan and implement task">
    <action>Review acceptance criteria and dev notes for the selected task</action>
    <action>Plan implementation steps and edge cases; write down a brief plan in Dev Agent Record → Debug Log</action>
    <action>Implement the task COMPLETELY including all subtasks, following architecture patterns and coding standards in this repo</action>
    <action>Handle error conditions and edge cases appropriately</action>
    <check>If unapproved dependencies are needed → ASK user for approval before adding</check>
    <check>If 3 consecutive implementation failures occur → HALT and request guidance</check>
    <check>If required configuration is missing → HALT: "Cannot proceed without necessary configuration files"</check>
    <check>If {{run_until_complete}} == true → Do not stop after partial progress; continue iterating tasks until all ACs are satisfied or a HALT condition triggers</check>
    <check>Do NOT propose to pause for review, standups, or validation until Step 6 gates are satisfied</check>
  </step>

  <step n="3" goal="Author comprehensive tests">
    <action>Create unit tests for business logic and core functionality introduced/changed by the task</action>
    <action>Add integration tests for component interactions where applicable</action>
    <action>Include end-to-end tests for critical user flows if applicable</action>
    <action>Cover edge cases and error handling scenarios noted in the plan</action>
  </step>

  <step n="4" goal="Run validations and tests">
    <action>Determine how to run tests for this repo (infer or use {{run_tests_command}} if provided)</action>
    <action>Run all existing tests to ensure no regressions</action>
    <action>Run the new tests to verify implementation correctness</action>
    <action>Run linting and code quality checks if configured</action>
    <action>Validate implementation meets ALL story acceptance criteria; if ACs include quantitative thresholds (e.g., test pass rate), ensure they are met before marking complete</action>
    <check>If regression tests fail → STOP and fix before continuing</check>
    <check>If new tests fail → STOP and fix before continuing</check>
  </step>

  <step n="5" goal="Mark task complete and update story">
    <action>ONLY mark the task (and subtasks) checkbox with [x] if ALL tests pass and validation succeeds</action>
    <action>Update File List section with any new, modified, or deleted files (paths relative to repo root)</action>
    <action>Add completion notes to Dev Agent Record if significant changes were made (summarize intent, approach, and any follow-ups)</action>
    <action>Append a brief entry to Change Log describing the change</action>
    <action>Save the story file</action>
    <check>Determine if more incomplete tasks remain</check>
    <check>If more tasks remain → <goto step="1">Next task</goto></check>
    <check>If no tasks remain → <goto step="6">Completion</goto></check>
  </step>

  <step n="6" goal="Story completion sequence">
    <action>Verify ALL tasks and subtasks are marked [x] (re-scan the story document now)</action>
    <action>Run the full regression suite (do not skip)</action>
    <action>Confirm File List includes every changed file</action>
    <action>Execute story definition-of-done checklist, if the story includes one</action>
    <action>Update the story Status to: Ready for Review</action>
    <check>If any task is incomplete → Return to step 1 to complete remaining work (Do NOT finish with partial progress)</check>
    <check>If regression failures exist → STOP and resolve before completing</check>
    <check>If File List is incomplete → Update it before completing</check>
  </step>

  <step n="7" goal="Validation and handoff" optional="true">
    <action>Optionally run the workflow validation task against the story using {project-root}/bmad/core/tasks/validate-workflow.xml</action>
    <action>Prepare a concise summary in Dev Agent Record → Completion Notes</action>
    <action>Communicate that the story is Ready for Review</action>
  </step>

  <step n="8" goal="Update status file on completion">
    <action>Search {output_folder}/ for files matching pattern: bmm-workflow-status.md</action>
    <action>Find the most recent file (by date in filename)</action>

    <check if="status file exists">
      <invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
        <param>mode: update</param>
        <param>action: set_current_workflow</param>
        <param>workflow_name: dev-story</param>
      </invoke-workflow>

      <check if="success == true">
        <output>✅ Status updated: Story {{current_story_id}} ready for review</output>
      </check>

      <output>**✅ Story Implementation Complete, {user_name}!**

**Story Details:**
- Story ID: {{current_story_id}}
- Title: {{current_story_title}}
- File: {{story_path}}
- Status: Ready for Review

**Status file updated:**
- Current step: dev-story (Story {{current_story_id}}) ✓
- Progress: {{new_progress_percentage}}%

**Next Steps:**
1. Review the implemented story and test the changes
2. Verify all acceptance criteria are met
3. When satisfied, run `story-approved` to mark story complete and advance the queue

Or check status anytime with: `workflow-status`
      </output>
    </check>

    <check if="status file not found">
      <output>**✅ Story Implementation Complete, {user_name}!**

**Story Details:**
- Story ID: {{current_story_id}}
- Title: {{current_story_title}}
- File: {{story_path}}
- Status: Ready for Review

Note: Running in standalone mode (no status file).

To track progress across workflows, run `workflow-status` first.
      </output>
    </check>
  </step>

</workflow>
```
