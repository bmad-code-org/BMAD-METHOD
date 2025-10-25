# Develop Story - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>Only modify the story file in these areas: Tasks/Subtasks checkboxes, Dev Agent Record (Debug Log, Completion Notes), File List, Change Log, and Status</critical>
<critical>Execute ALL steps in exact order; do NOT skip steps</critical>
<critical>Absolutely DO NOT stop because of "milestones", "significant progress", or "session boundaries". Continue in a single execution until the story is COMPLETE (all ACs satisfied and all tasks/subtasks checked) UNLESS a HALT condition is triggered or the USER gives other instruction.</critical>
<critical>Do NOT schedule a "next session" or request review pauses unless a HALT condition applies. Only Step 6 decides completion.</critical>

<critical>User skill level ({user_skill_level}) affects conversation style ONLY, not code updates.</critical>

<workflow>

  <step n="1" goal="Find next ready story and load it" tag="sprint-status">
    <check if="{{story_path}} is provided">
      <action>Use {{story_path}} directly</action>
      <action>Read COMPLETE story file</action>
      <action>Extract story_key from filename or metadata</action>
      <goto>task_check</goto>
    </check>

    <critical>MUST read COMPLETE sprint-status.yaml file from start to end to preserve order</critical>
    <action>Load the FULL file: {{output_folder}}/sprint-status.yaml</action>
    <action>Read ALL lines from beginning to end - do not skip any content</action>
    <action>Parse the development_status section completely to understand story order</action>

    <action>Find the FIRST story (by reading in order from top to bottom) where:
      - Key matches pattern: number-number-name (e.g., "1-2-user-auth")
      - NOT an epic key (epic-X) or retrospective (epic-X-retrospective)
      - Status value equals "ready-for-dev"
    </action>

    <check if="no ready-for-dev or in-progress story found">
      <output>📋 No ready-for-dev stories found in sprint-status.yaml
**Options:**
1. Run `story-context` to generate context file and mark drafted stories as ready
2. Run `story-ready` to quickly mark drafted stories as ready without generating context
3. Run `create-story` if no incomplete stories are drafted yet
4. Check {output-folder}/sprint-status.yaml to see current sprint status
      </output>
      <action>HALT</action>
    </check>

    <action>Store the found story_key (e.g., "1-2-user-authentication") for later status updates</action>
    <action>Find matching story file in {{story_dir}} using story_key pattern: {{story_key}}.md</action>
    <action>Read COMPLETE story file from discovered path</action>

    <anchor id="task_check" />

    <action>Parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Dev Agent Record, File List, Change Log, Status</action>

    <action>Check if context file exists at: {{story_dir}}/{{story_key}}.context.md</action>
    <check if="context file exists">
      <action>Read COMPLETE context file</action>
      <action>Parse all sections: story details, artifacts (docs, code, dependencies), interfaces, constraints, tests</action>
      <action>Use this context to inform implementation decisions and approaches</action>
    </check>
    <check if="context file does NOT exist">
      <output>ℹ️ No context file found for {{story_key}}

Proceeding with story file only. For better context, consider running `story-context` workflow first.
      </output>
    </check>

    <action>Identify first incomplete task (unchecked [ ]) in Tasks/Subtasks</action>

    <action if="no incomplete tasks"><goto step="6">Completion sequence</goto></action>
    <action if="story file inaccessible">HALT: "Cannot develop story without access to story file"</action>
    <action if="incomplete task or subtask requirements ambiguous">ASK user to clarify or HALT</action>
  </step>

  <step n="1.5" goal="Mark story in-progress" tag="sprint-status">
    <action>Load the FULL file: {{output_folder}}/sprint-status.yaml</action>
    <action>Read all development_status entries to find {{story_key}}</action>
    <action>Get current status value for development_status[{{story_key}}]</action>

    <check if="current status == 'ready-for-dev'">
      <action>Update the story in the sprint status report to = "in-progress"</action>
      <output>🚀 Starting work on story {{story_key}}
Status updated: ready-for-dev → in-progress
      </output>
    </check>

    <check if="current status == 'in-progress'">
      <output>⏯️ Resuming work on story {{story_key}}
Story is already marked in-progress
      </output>
    </check>

    <check if="current status is neither ready-for-dev nor in-progress">
      <output>⚠️ Unexpected story status: {{current_status}}
Expected ready-for-dev or in-progress. Continuing anyway...
      </output>
    </check>
  </step>

  <step n="2" goal="Plan and implement task">
    <action>Review acceptance criteria and dev notes for the selected task</action>
    <action>Plan implementation steps and edge cases; write down a brief plan in Dev Agent Record → Debug Log</action>
    <action>Implement the task COMPLETELY including all subtasks, critically following best practices, coding patterns and coding standards in this repo you have learned about from the story and context file or your own critical agent instructions</action>
    <action>Handle error conditions and edge cases appropriately</action>
    <action if="new or different than what is documented dependencies are needed">ASK user for approval before adding</action>
    <action if="3 consecutive implementation failures occur">HALT and request guidance</action>
    <action if="required configuration is missing">HALT: "Cannot proceed without necessary configuration files"</action>
    <action if="{{run_until_complete}} == true">Do not stop after partial progress; continue iterating tasks until all ACs are satisfied or a HALT condition triggers</action>
    <critical>Do NOT propose to pause for review, standups, or validation until Step 6 gates are satisfied</critical>
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
    <action if="regression tests fail">STOP and fix before continuing, consider how current changes made broke regression</action>
    <action if="new tests fail">STOP and fix before continuing</action>
  </step>

  <step n="5" goal="Mark task complete and update story">
    <action>ONLY mark the task (and subtasks) checkbox with [x] if ALL tests pass and validation succeeds</action>
    <action>Update File List section with any new, modified, or deleted files (paths relative to repo root)</action>
    <action>Add completion notes to Dev Agent Record if significant changes were made (summarize intent, approach, and any follow-ups)</action>
    <action>Save the story file</action>
    <action>Determine if more incomplete tasks remain</action>
    <action if="more tasks remain"><goto step="2">Next task</goto></action>
    <action if="no tasks remain"><goto step="6">Completion</goto></action>
  </step>

  <step n="6" goal="Story completion and mark for review" tag="sprint-status">
    <action>Verify ALL tasks and subtasks are marked [x] (re-scan the story document now)</action>
    <action>Run the full regression suite (do not skip)</action>
    <action>Confirm File List includes every changed file</action>
    <action>Execute story definition-of-done checklist, if the story includes one</action>
    <action>Update the story Status to: review</action>

    <!-- Mark story ready for review -->
    <action>Load the FULL file: {{output_folder}}/sprint-status.yaml</action>
    <action>Find development_status key matching {{story_key}}</action>
    <action>Verify current status is "in-progress" (expected previous state)</action>
    <action>Update development_status[{{story_key}}] = "review"</action>
    <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>

    <check if="story key not found in file">
      <output>⚠️ Story file updated, but sprint-status update failed: {{story_key}} not found

Story is marked Ready for Review in file, but sprint-status.yaml may be out of sync.
      </output>
    </check>

    <action if="any task is incomplete">Return to step 1 to complete remaining work (Do NOT finish with partial progress)</action>
    <action if="regression failures exist">STOP and resolve before completing</action>
    <action if="File List is incomplete">Update it before completing</action>
  </step>

  <step n="7" goal="Completion communication and user support">
    <action>Optionally run the workflow validation task against the story using {project-root}/bmad/core/tasks/validate-workflow.xml</action>
    <action>Prepare a concise summary in Dev Agent Record → Completion Notes</action>

    <action>Communicate to {user_name} that story implementation is complete and ready for review</action>
    <action>Summarize key accomplishments: story ID, story key, title, key changes made, tests added, files modified</action>
    <action>Provide the story file path and current status (now "review", was "in-progress")</action>

    <action>Based on {user_skill_level}, ask if user needs any explanations about:
      - What was implemented and how it works
      - Why certain technical decisions were made
      - How to test or verify the changes
      - Any patterns, libraries, or approaches used
      - Anything else they'd like clarified
    </action>

    <check if="user asks for explanations">
      <action>Provide clear, contextual explanations tailored to {user_skill_level}</action>
      <action>Use examples and references to specific code when helpful</action>
    </check>

    <action>Once explanations are complete (or user indicates no questions), suggest logical next steps</action>
    <action>Common next steps to suggest (but allow user flexibility):
      - Review the implemented story yourself and test the changes
      - Verify all acceptance criteria are met
      - Ensure deployment readiness if applicable
      - Run `review-story` workflow for peer review
      - Check sprint-status.yaml to see project progress
    </action>
    <action>Remain flexible - allow user to choose their own path or ask for other assistance</action>
  </step>

</workflow>
```
