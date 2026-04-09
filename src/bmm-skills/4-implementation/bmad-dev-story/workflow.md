# Dev Story Workflow

**Goal:** Execute story implementation following a context filled story spec file.

**Your Role:** Developer implementing the story.
- Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}
- Generate all documents in {document_output_language}
- Only modify the story file in these areas: Tasks/Subtasks checkboxes, Dev Agent Record (Implementation Plan, Debug Log, Completion Notes), File List, Change Log, Status, and existing Senior Developer Review (AI) action-item checkboxes when resolving review continuation work
- Content inside `<frozen-after-approval>` blocks (Story statement, Acceptance Criteria, Exit Criteria, Rollback Boundary) is immutable — if implementation cannot satisfy a frozen requirement, HALT and escalate to the user rather than modifying it
- Execute ALL steps in exact order; do NOT skip steps
- Absolutely DO NOT stop because of "milestones", "significant progress", or "session boundaries". Continue in a single execution until the story is COMPLETE (all ACs satisfied and all tasks/subtasks checked) UNLESS a HALT condition is triggered or the USER gives other instruction.
- Do NOT schedule a "next session" or request review pauses unless a HALT condition applies. Only Step 9 decides story completion.
- User skill level ({user_skill_level}) affects conversation style ONLY, not code updates.

---

## INITIALIZATION

### Configuration Loading

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `user_name`
- `communication_language`, `document_output_language`
- `user_skill_level`
- `implementation_artifacts`
- `date` as system-generated current datetime

### Paths

- `story_path` = `` (explicit story path; auto-discovered if empty)
- `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`

### Context

- `project_context` = `**/project-context.md` (load if exists)

---

## EXECUTION

<workflow>
  <critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
  <critical>Generate all documents in {document_output_language}</critical>
  <critical>Only modify the story file in these areas: Tasks/Subtasks checkboxes, Dev Agent Record (Implementation Plan, Debug Log,
    Completion Notes), File List, Change Log, Status, and existing Senior Developer Review (AI) action-item checkboxes when resolving
    review continuation work</critical>
  <critical>Content inside frozen-after-approval blocks is immutable — HALT and escalate to user if implementation cannot satisfy a frozen Acceptance Criterion, Exit Criterion, or Rollback Boundary</critical>
  <critical>Execute ALL steps in exact order; do NOT skip steps</critical>
  <critical>Absolutely DO NOT stop because of "milestones", "significant progress", or "session boundaries". Continue in a single execution
    until the story is COMPLETE (all ACs satisfied and all tasks/subtasks checked) UNLESS a HALT condition is triggered or the USER gives
    other instruction.</critical>
  <critical>Do NOT schedule a "next session" or request review pauses unless a HALT condition applies. Only Step 9 decides story completion.</critical>
  <critical>User skill level ({user_skill_level}) affects conversation style ONLY, not code updates.</critical>

  <step n="1" goal="Find next ready story and load it" tag="sprint-status">
    <check if="{{story_path}} is provided">
      <action>Use {{story_path}} directly</action>
      <action>Read COMPLETE story file</action>
      <action>Extract story_key from filename or metadata</action>
      <goto anchor="task_check" />
    </check>

    <!-- Sprint-based story discovery -->
    <check if="{{sprint_status}} file exists">
      <critical>MUST read COMPLETE sprint-status.yaml file from start to end to preserve order</critical>
      <action>Load the FULL file: {{sprint_status}}</action>
      <action>Read ALL lines from beginning to end - do not skip any content</action>
      <action>Parse the development_status section completely to understand story order</action>

      <action>Find the FIRST story (by reading in order from top to bottom) where:
        - Key matches pattern: number-number-name (e.g., "1-2-user-auth")
        - NOT an epic key (epic-X) or retrospective (epic-X-retrospective)
        - Status value equals "in-progress"
      </action>

      <action if="no in-progress story found">Find the FIRST story (by reading in order from top to bottom) where:
        - Key matches pattern: number-number-name (e.g., "1-2-user-auth")
        - NOT an epic key (epic-X) or retrospective (epic-X-retrospective)
        - Status value equals "ready-for-dev"
      </action>

      <check if="no ready-for-dev or in-progress story found">
        <output>📋 No ready-for-dev stories found in sprint-status.yaml

          **Current Sprint Status:** {{sprint_status_summary}}

          **What would you like to do?**
          1. Run `create-story` to create next story from epics with comprehensive context
          2. Review and improve an existing story before development (recommended quality check)
          3. Specify a particular story file to develop (provide full path)
          4. Check {{sprint_status}} file to see current sprint status

          💡 **Tip:** Stories in `ready-for-dev` may still benefit from a quick story quality review before development.
        </output>
        <ask>Choose option [1], [2], [3], or [4], or specify story file path:</ask>

        <check if="user chooses '1'">
          <action>HALT - Run create-story to create next story</action>
        </check>

        <check if="user chooses '2'">
          <action>HALT - Review and improve the selected story before rerunning dev-story</action>
        </check>

        <check if="user chooses '3'">
          <ask>Provide the story file path to develop:</ask>
          <action>Store user-provided story path as {{story_path}}</action>
          <goto anchor="task_check" />
        </check>

        <check if="user chooses '4'">
          <output>Loading {{sprint_status}} for detailed status review...</output>
          <action>Display detailed sprint status analysis</action>
          <action>HALT - User can review sprint status and provide story path</action>
        </check>

        <check if="user provides story file path">
          <action>Store user-provided story path as {{story_path}}</action>
          <goto anchor="task_check" />
        </check>
      </check>
    </check>

    <!-- Non-sprint story discovery -->
    <check if="{{sprint_status}} file does NOT exist">
      <action>Search {implementation_artifacts} for stories directly</action>
      <action>Find stories with "in-progress" or "ready-for-dev" status in files</action>
      <action>Look for story files matching pattern: *-*-*.md</action>
      <action>Read each candidate story file to check Status section</action>

      <check if="no in-progress or ready-for-dev stories found in story files">
        <output>📋 No in-progress or ready-for-dev stories found

          **Available Options:**
          1. Run `create-story` to create next story from epics with comprehensive context
          2. Review and improve an existing story before development
          3. Specify which story to develop
        </output>
        <ask>What would you like to do? Choose option [1], [2], or [3]:</ask>

        <check if="user chooses '1'">
          <action>HALT - Run create-story to create next story</action>
        </check>

        <check if="user chooses '2'">
          <action>HALT - Review and improve the selected story before rerunning dev-story</action>
        </check>

        <check if="user chooses '3'">
          <ask>It's unclear what story you want developed. Please provide the full path to the story file:</ask>
          <action>Store user-provided story path as {{story_path}}</action>
          <action>Continue with provided story file</action>
        </check>
      </check>

      <check if="in-progress or ready-for-dev story found in files">
        <action>Use discovered story file and extract story_key</action>
      </check>
    </check>

    <action>Store the found story_key (e.g., "1-2-user-authentication") for later status updates</action>
    <action>Find matching story file in {implementation_artifacts} using story_key pattern: {{story_key}}.md</action>
    <action>Read COMPLETE story file from discovered path</action>

    <anchor id="task_check" />

    <action>Parse sections: Story, Acceptance Criteria, Exit Criteria, Rollback Boundary, Tasks/Subtasks, Dev Notes, Dev Agent Record (including Implementation Plan), File List, Change Log, Status, Senior Developer Review (AI)</action>

    <action>Load comprehensive context from story file's Dev Notes section</action>
    <action>Extract developer guidance from Dev Notes: architecture requirements, previous learnings, technical specifications</action>
    <action>Use enhanced story context to inform implementation decisions and approaches</action>

    <action>Identify first incomplete task (unchecked [ ]) in Tasks/Subtasks</action>

    <action if="no incomplete tasks">Set {{all_tasks_complete}} = true</action>
    <action if="incomplete tasks remain">Set {{all_tasks_complete}} = false</action>
    <action if="story file inaccessible">HALT: "Cannot develop story without access to story file"</action>
    <action if="incomplete task or subtask requirements ambiguous">ASK user to clarify or HALT</action>
  </step>

  <step n="2" goal="Load project context and story information">
    <critical>Load all available context to inform implementation</critical>

    <action>Load {project_context} for coding standards and project-wide patterns (if exists)</action>
    <action>Parse sections: Story, Acceptance Criteria, Exit Criteria, Rollback Boundary, Tasks/Subtasks, Dev Notes, Dev Agent Record (including Implementation Plan), File List, Change Log, Status, Senior Developer Review (AI)</action>
    <action>Load comprehensive context from story file's Dev Notes section</action>
    <action>Extract developer guidance from Dev Notes: architecture requirements, previous learnings, technical specifications</action>
    <action>Use enhanced story context to inform implementation decisions and approaches</action>
    <output>✅ **Context Loaded**
      Story and project context available for implementation
    </output>
  </step>

  <step n="3" goal="Detect review continuation and extract review context">
    <critical>Determine if this is a fresh start or continuation after code review</critical>

    <action>Check the Tasks/Subtasks section for a `### Review Findings` subsection and any unchecked review items (`[Review][Decision]` or `[Review][Patch]`)</action>
    <action>Check for legacy review artifacts: `Senior Developer Review (AI)` section, `Review Follow-ups (AI)` subsection, or `[AI-Review]` task prefixes</action>
    <action>Count unresolved review items across supported formats:
      - Current format: unchecked `[Review][Decision]` and `[Review][Patch]` items in `### Review Findings`
      - Legacy format: unchecked [ ] review follow-up items and unresolved `Senior Developer Review (AI)` action items
    </action>
    <action>Count deferred review items across supported formats (`[Review][Defer]` or legacy deferred items)</action>
    <action>Store list of unresolved review items as {{pending_review_items}}</action>

    <check if="{{pending_review_items}} is not empty">
      <action>Set review_continuation = true</action>

      <output>⏯️ **Resuming Story After Code Review**

        **Outstanding Review Items:** {{unchecked_review_count}} remaining
        **Decision Items:** {{review_decision_count}}
        **Patch Items:** {{review_patch_count}}
        **Deferred Items:** {{review_defer_count}}

        **Strategy:** Prioritize unresolved review findings before continuing with regular tasks.
      </output>
    </check>

    <check if="{{pending_review_items}} is empty">
      <action>Set review_continuation = false</action>
      <action>Set {{pending_review_items}} = empty</action>

      <check if="{{all_tasks_complete}} == true">
        <output>✅ **All Story Tasks Already Complete**

          Story: {{story_key}}
          Story Status: {{current_status}}
          Proceeding to final completion validation and review transition.
        </output>
      </check>

      <check if="{{all_tasks_complete}} != true">
        <output>🚀 **Starting Fresh Implementation**

          Story: {{story_key}}
          Story Status: {{current_status}}
          First incomplete task: {{first_task_description}}
        </output>
      </check>
    </check>
  </step>

  <step n="4" goal="Mark story in-progress" tag="sprint-status">
    <check if="{{sprint_status}} file exists">
      <action>Load the FULL file: {{sprint_status}}</action>
      <action>Read all development_status entries to find {{story_key}}</action>
      <action>Get current status value for development_status[{{story_key}}]</action>

      <check if="current status == 'ready-for-dev' OR review_continuation == true">
        <action>Update the story in the sprint status report to = "in-progress"</action>
        <action>Update last_updated field to current date</action>
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

      <action>Store {{current_sprint_status}} for later use</action>
    </check>

    <check if="{{sprint_status}} file does NOT exist">
      <output>ℹ️ No sprint status file exists - story progress will be tracked in story file only</output>
      <action>Set {{current_sprint_status}} = "no-sprint-tracking"</action>
    </check>

    <check if="{{all_tasks_complete}} == true">
      <output>✅ All tasks are already checked; proceeding to final completion gates.</output>
      <goto step="9">Completion</goto>
    </check>
  </step>

  <step n="5" goal="Implement task following red-green-refactor cycle">
    <critical>FOLLOW THE STORY FILE TASKS/SUBTASKS SEQUENCE EXACTLY AS WRITTEN - NO DEVIATION</critical>

    <action>Review the current task/subtask from the story file - this is your authoritative implementation guide</action>
    <action>Plan implementation following red-green-refactor cycle</action>
    <action>Review the frozen Exit Criteria and Rollback Boundary before making changes</action>
    <action if="current task is an unresolved `[Review][Decision]` item">HALT: "Review decision item requires user resolution before implementation can continue"</action>

    <!-- RED PHASE -->
    <action>Write FAILING tests first for the task/subtask functionality</action>
    <action>Confirm tests fail before implementation - this validates test correctness</action>

    <!-- GREEN PHASE -->
    <action>Implement MINIMAL code to make tests pass</action>
    <action>Run tests to confirm they now pass</action>
    <action>Handle error conditions and edge cases as specified in task/subtask</action>

    <!-- REFACTOR PHASE -->
    <action>Improve code structure while keeping tests green</action>
    <action>Ensure code follows architecture patterns and coding standards from Dev Notes</action>

    <action>Document technical approach and decisions in Dev Agent Record → Implementation Plan</action>

    <action if="new dependencies required beyond story specifications">HALT: "Additional dependencies need user approval"</action>
    <action if="planned implementation would violate the frozen Rollback Boundary">HALT: "Implementation would cross the rollback boundary and needs user approval"</action>
    <action if="it becomes clear the frozen Exit Criteria cannot be satisfied within the approved story scope">HALT: "Frozen exit criteria cannot be satisfied without renegotiation"</action>
    <action if="3 consecutive implementation failures occur">HALT and request guidance</action>
    <action if="required configuration is missing">HALT: "Cannot proceed without necessary configuration files"</action>

    <critical>NEVER implement anything not mapped to a specific task/subtask in the story file</critical>
    <critical>NEVER proceed to next task until current task/subtask is complete AND tests pass</critical>
    <critical>Execute continuously without pausing until all tasks/subtasks are complete or explicit HALT condition</critical>
    <critical>Do NOT propose to pause for review until Step 9 completion gates are satisfied</critical>
  </step>

  <step n="6" goal="Author comprehensive tests">
    <action>Create unit tests for business logic and core functionality introduced/changed by the task</action>
    <action>Add integration tests for component interactions specified in story requirements</action>
    <action>Include end-to-end tests for critical user flows when story requirements demand them</action>
    <action>Cover edge cases and error handling scenarios identified in story Dev Notes</action>
  </step>

  <step n="7" goal="Run validations and tests">
    <action>Determine how to run tests for this repo (infer test framework from project structure)</action>
    <action>Run all existing tests to ensure no regressions</action>
    <action>Run the new tests to verify implementation correctness</action>
    <action>Run linting and code quality checks if configured in project</action>
    <action>Validate implementation meets ALL story acceptance criteria and exit criteria; enforce quantitative thresholds explicitly</action>
    <action if="regression tests fail">STOP and fix before continuing - identify breaking changes immediately</action>
    <action if="new tests fail">STOP and fix before continuing - ensure implementation correctness</action>
  </step>

  <step n="8" goal="Validate and mark task complete ONLY when fully done">
    <critical>NEVER mark a task complete unless ALL conditions are met - NO LYING OR CHEATING</critical>

    <!-- VALIDATION GATES -->
    <action>Verify ALL tests for this task/subtask ACTUALLY EXIST and PASS 100%</action>
    <action>Confirm implementation matches EXACTLY what the task/subtask specifies - no extra features</action>
    <action>Validate that ALL acceptance criteria related to this task are satisfied</action>
    <action>Validate that the implementation still supports the frozen Exit Criteria and has not crossed the frozen Rollback Boundary</action>
    <action>Run full test suite to ensure NO regressions introduced</action>

    <!-- REVIEW FOLLOW-UP HANDLING -->
    <check if="task is a persisted review item (has [Review][Patch] prefix or [AI-Review] prefix)">
      <action>Extract review item details (category, description, related AC/file)</action>
      <action>Add to resolution tracking list: {{resolved_review_items}}</action>

      <check if="task comes from `### Review Findings` subsection">
        <action>Mark the matching `[Review][Patch]` item checkbox [x] in "Tasks/Subtasks → Review Findings"</action>
      </check>

      <check if="task comes from legacy `Review Follow-ups (AI)` subsection">
        <action>Mark task checkbox [x] in "Tasks/Subtasks → Review Follow-ups (AI)" section</action>
      </check>

      <check if="legacy `Senior Developer Review (AI) → Action Items` section exists">
        <action>Find matching action item in "Senior Developer Review (AI) → Action Items" section by matching description</action>
        <action>Mark that action item checkbox [x] as resolved</action>
      </check>

      <action>Add to Dev Agent Record → Completion Notes: "✅ Resolved review finding: {{description}}"</action>
    </check>

    <!-- ONLY MARK COMPLETE IF ALL VALIDATION PASS -->
    <check if="ALL validation gates pass AND tests ACTUALLY exist and pass">
      <action>ONLY THEN mark the task (and subtasks) checkbox with [x]</action>
      <action>Update File List section with ALL new, modified, or deleted files (paths relative to repo root)</action>
      <action>Add completion notes to Dev Agent Record summarizing what was ACTUALLY implemented and tested</action>
    </check>

    <check if="ANY validation fails">
      <action>DO NOT mark task complete - fix issues first</action>
      <action>HALT if unable to fix validation failures</action>
    </check>

    <check if="review_continuation == true and {{resolved_review_items}} is not empty">
      <action>Count total resolved review items in this session</action>
      <action>Add Change Log entry: "Addressed code review findings - {{resolved_count}} items resolved (Date: {{date}})"</action>
    </check>

    <action>Save the story file</action>
    <action>Determine if more incomplete tasks remain</action>
    <action if="more tasks remain">
      <goto step="5">Next task</goto>
    </action>
    <action if="no tasks remain">
      <goto step="9">Completion</goto>
    </action>
  </step>

  <step n="9" goal="Story completion and mark for review" tag="sprint-status">
    <action>Verify ALL tasks and subtasks are marked [x] (re-scan the story document now)</action>
    <action>Run the full regression suite (do not skip)</action>
    <action>Confirm File List includes every changed file</action>
    <action>Execute enhanced definition-of-done validation</action>

    <!-- Enhanced Definition of Done Validation -->
    <action>Validate definition-of-done checklist with essential requirements:
      - All tasks/subtasks marked complete with [x]
      - Implementation satisfies every Acceptance Criterion
      - Implementation satisfies every Exit Criterion
      - Unit tests for core functionality added/updated
      - Integration tests for component interactions added when required
      - End-to-end tests for critical flows added when story demands them
      - All tests pass (no regressions, new tests successful)
      - Code quality checks pass (linting, static analysis if configured)
      - Frozen Rollback Boundary remains valid; no unauthorized irreversible scope expansion
      - File List includes every new/modified/deleted file (relative paths)
      - Dev Agent Record contains implementation notes
      - Change Log includes summary of changes
      - Only permitted story sections were modified
    </action>

    <!-- Final validation gates -->
    <action if="any task is incomplete">HALT - Complete remaining tasks before marking ready for review</action>
    <action if="regression failures exist">HALT - Fix regression issues before completing</action>
    <action if="File List is incomplete">HALT - Update File List with all changed files</action>
    <action if="definition-of-done validation fails">HALT - Address DoD failures before completing</action>

    <action>Update the story Status to: "review"</action>

    <!-- Mark story ready for review - sprint status conditional -->
    <check if="{sprint_status} file exists AND {{current_sprint_status}} != 'no-sprint-tracking'">
      <action>Load the FULL file: {sprint_status}</action>
      <action>Find development_status key matching {{story_key}}</action>
      <action>Verify current status is "in-progress" (expected previous state)</action>
      <action>Update development_status[{{story_key}}] = "review"</action>
      <action>Update last_updated field to current date</action>
      <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>
      <output>✅ Story status updated to "review" in sprint-status.yaml</output>
    </check>

    <check if="{sprint_status} file does NOT exist OR {{current_sprint_status}} == 'no-sprint-tracking'">
      <output>ℹ️ Story status updated to "review" in story file (no sprint tracking configured)</output>
    </check>

    <check if="story key not found in sprint status">
      <output>⚠️ Story file updated, but sprint-status update failed: {{story_key}} not found

        Story status is set to "review" in file, but sprint-status.yaml may be out of sync.
      </output>
    </check>
  </step>

  <step n="10" goal="Completion communication and user support">
    <action>Execute the enhanced definition-of-done checklist using the validation framework</action>
    <action>Prepare a concise summary in Dev Agent Record → Completion Notes</action>

    <action>Communicate to {user_name} that story implementation is complete and ready for review</action>
    <action>Summarize key accomplishments: story ID, story key, title, key changes made, tests added, files modified</action>
    <action>Provide the story file path and current status (now "review")</action>

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
    <action>Recommended next steps (flexible based on project setup):
      - Review the implemented story and test the changes
      - Verify all acceptance criteria are met
      - Ensure deployment readiness if applicable
      - Run `code-review` workflow for peer review
      - Optional: If Test Architect module installed, run `/bmad:tea:automate` to expand guardrail tests
    </action>

    <output>💡 **Tip:** For best results, run `code-review` using a **different** LLM than the one that implemented this story.</output>
    <check if="{sprint_status} file exists">
      <action>Suggest checking {sprint_status} to see project progress</action>
    </check>
    <action>Remain flexible - allow user to choose their own path or ask for other assistance</action>
  </step>

</workflow>
