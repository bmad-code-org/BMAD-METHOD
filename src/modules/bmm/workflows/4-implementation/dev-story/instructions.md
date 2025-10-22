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

  <step n="1" goal="Locate and load story from sprint status">
    <check if="{{story_path}} is provided">
      <action>Use {{story_path}} directly</action>
      <action>Read COMPLETE story file</action>
      <action>Extract story_key from filename or metadata</action>
      <goto>task_check</goto>
    </check>

    <action>Query sprint-status for ready stories:</action>

    <invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
      <param>action: get_next_story</param>
      <param>filter_status: ready-for-dev</param>
    </invoke-workflow>

    <check if="{{result_found}} == false">
      <output>📋 No ready-for-dev stories found in sprint-status.yaml

**Options:**
1. Run `story-ready` to mark drafted stories as ready
2. Run `create-story` if no stories are drafted yet
3. Check sprint-status.yaml to see current story states
      </output>
      <action>HALT</action>
    </check>

    <action>Use {{result_story_key}} to find story file in {{story_dir}}</action>
    <action>Read COMPLETE story file from discovered path</action>
    <action>Store {{result_story_key}} for later status updates</action>

    <anchor id="task_check" />

    <action>Parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Dev Agent Record, File List, Change Log, Status</action>
    <action>Identify first incomplete task (unchecked [ ]) in Tasks/Subtasks</action>

    <check>If no incomplete tasks → <goto step="6">Completion sequence</goto></check>
    <check>If story file inaccessible → HALT: "Cannot develop story without access to story file"</check>
    <check>If task requirements ambiguous → ASK user to clarify or HALT</check>
  </step>

  <step n="1.5" goal="Mark story in-progress in sprint status">
    <invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
      <param>action: get_story_status</param>
      <param>story_key: {{result_story_key}}</param>
    </invoke-workflow>

    <check if="{{result_status}} == 'ready-for-dev'">
      <invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
        <param>action: update_story_status</param>
        <param>story_key: {{result_story_key}}</param>
        <param>new_status: in-progress</param>
        <param>validate: true</param>
      </invoke-workflow>

      <check if="{{result_success}} == true">
        <output>🚀 Starting work on story {{result_story_key}}
Status updated: {{result_old_status}} → {{result_new_status}}
        </output>
      </check>
    </check>

    <check if="{{result_status}} == 'in-progress'">
      <output>⏯️ Resuming work on story {{result_story_key}}
Story is already marked in-progress
      </output>
    </check>
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

    <invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
      <param>action: update_story_status</param>
      <param>story_key: {{result_story_key}}</param>
      <param>new_status: review</param>
      <param>validate: true</param>
    </invoke-workflow>

    <check if="{{result_success}} == false">
      <output>⚠️ Story file updated, but sprint-status update failed: {{result_error}}

Story is marked Ready for Review in file, but sprint-status.yaml may be out of sync.
      </output>
    </check>

    <check>If any task is incomplete → Return to step 1 to complete remaining work (Do NOT finish with partial progress)</check>
    <check>If regression failures exist → STOP and resolve before completing</check>
    <check>If File List is incomplete → Update it before completing</check>
  </step>

  <step n="7" goal="Validation and handoff" optional="true">
    <action>Optionally run the workflow validation task against the story using {project-root}/bmad/core/tasks/validate-workflow.xml</action>
    <action>Prepare a concise summary in Dev Agent Record → Completion Notes</action>
    <action>Communicate that the story is Ready for Review</action>
    <output>**✅ Story Implementation Complete, {user_name}!**

**Story Details:**
- Story ID: {{current_story_id}}
- Story Key: {{result_story_key}}
- Title: {{current_story_title}}
- File: {{story_path}}
- Status: {{result_new_status}} (was {{result_old_status}})

**Next Steps:**
1. Review the implemented story and test the changes
2. Verify all acceptance criteria are met
3. Run `review-story` workflow for senior developer review
4. When review passes, run `story-done` to mark complete
    </output>
  </step>

</workflow>
```
