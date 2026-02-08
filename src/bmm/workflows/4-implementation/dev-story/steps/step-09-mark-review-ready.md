---
name: 'step-09-mark-review-ready'
description: 'Finalize story, enforce definition-of-done, and set review status'
nextStepFile: './step-10-closeout.md'
---

  <step n="9" goal="Story completion and mark for review" tag="sprint-status">
    <action>Verify ALL tasks and subtasks are marked [x] (re-scan the story document now)</action>
    <action>Run the full regression suite (do not skip)</action>
    <action>Confirm File List includes every changed file</action>
    <action>Execute enhanced definition-of-done validation</action>
    <action>Update the story Status to: "review"</action>
    <action>Initialize sprint tracking state deterministically before any sprint-status check:
      - Set {{current_sprint_status}} = "no-sprint-tracking"
      - Set {{sprint_tracking_enabled}} = false
      - If {sprint_status} exists and is readable:
        - Load the FULL file: {sprint_status}
        - If file content indicates tracking disabled OR development_status section is missing, keep "no-sprint-tracking"
        - Else set {{current_sprint_status}} = "enabled" and {{sprint_tracking_enabled}} = true
      - If file missing/unreadable, keep defaults and continue with story-only status update
    </action>

    <!-- Enhanced Definition of Done Validation -->
    <action>Validate definition-of-done checklist with essential requirements:
      - All tasks/subtasks marked complete with [x]
      - Implementation satisfies every Acceptance Criterion
      - Unit tests for core functionality added/updated
      - Integration tests for component interactions added when required
      - End-to-end tests for critical flows added when story demands them
      - All tests pass (no regressions, new tests successful)
      - Code quality checks pass (linting, static analysis if configured)
      - File List includes every new/modified/deleted file (relative paths)
      - Dev Agent Record contains implementation notes
      - Change Log includes summary of changes
      - Only permitted story sections were modified
    </action>

    <!-- Mark story ready for review - sprint status conditional -->
    <check if="{{sprint_tracking_enabled}} == true">
      <action>Find development_status key matching {{story_key}}</action>
      <check if="story key found in sprint status">
        <action>Verify current status is "in-progress" (expected previous state)</action>
        <action>Update development_status[{{story_key}}] = "review"</action>
        <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>
        <output>✅ Story status updated to "review" in sprint-status.yaml</output>
      </check>
      <check if="story key not found in sprint status">
        <output>⚠️ Story file updated, but sprint-status update failed: {{story_key}} not found

          Story status is set to "review" in file, but sprint-status.yaml may be out of sync.
        </output>
      </check>
    </check>

    <check if="{{sprint_tracking_enabled}} == false">
      <output>ℹ️ Story status updated to "review" in story file (no sprint tracking configured)</output>
    </check>

    <!-- Final validation gates -->
    <action if="any task is incomplete">Invoke HALT protocol (reason_code: DEV-STORY-STEP-09-INCOMPLETE-TASKS, step_id: step-09-mark-review-ready, message: "Incomplete tasks remain before review-ready transition.", required_action: "Complete all tasks/subtasks and rerun validations.")</action>
    <action if="regression failures exist">Invoke HALT protocol (reason_code: DEV-STORY-STEP-09-REGRESSION-FAIL, step_id: step-09-mark-review-ready, message: "Regression suite has failures.", required_action: "Fix failing tests and rerun full regression suite.")</action>
    <action if="File List is incomplete">Invoke HALT protocol (reason_code: DEV-STORY-STEP-09-FILE-LIST-INCOMPLETE, step_id: step-09-mark-review-ready, message: "File List does not include all changed files.", required_action: "Update File List with all added/modified/deleted paths.")</action>
    <action if="definition-of-done validation fails">Invoke HALT protocol (reason_code: DEV-STORY-STEP-09-DOD-FAIL, step_id: step-09-mark-review-ready, message: "Definition-of-done checks failed.", required_action: "Address DoD failures and rerun validation.")</action>
  </step>

## Next
- Read fully and follow: `./step-10-closeout.md`.
