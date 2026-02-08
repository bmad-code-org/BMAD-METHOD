---
name: 'step-08-mark-task-complete'
description: 'Mark work complete only after strict validation gates are satisfied'
nextStepFile: './step-09-mark-review-ready.md'
---

  <step n="8" goal="Validate and mark task complete ONLY when fully done">
    <critical>NEVER mark a task complete unless ALL conditions are met - NO LYING OR CHEATING</critical>

    <action>Initialize review-tracking variables before checks:
      - If {{resolved_review_items}} is undefined: set {{resolved_review_items}} = []
      - If {{unresolved_review_items}} is undefined: set {{unresolved_review_items}} = []
      - Set {{review_continuation}} by checking current task title/original task list for prefix "[AI-Review]"
      - Set {{date}} from system-generated timestamp in project date format
    </action>

    <!-- VALIDATION GATES -->
    <action>Verify ALL tests for this task/subtask ACTUALLY EXIST and PASS 100%</action>
    <action>Confirm implementation matches EXACTLY what the task/subtask specifies - no extra features</action>
    <action>Validate that ALL acceptance criteria related to this task are satisfied</action>
    <action>Run full test suite to ensure NO regressions introduced</action>

    <!-- REVIEW FOLLOW-UP HANDLING -->
    <check if="task is review follow-up (has [AI-Review] prefix)">
      <action>Extract review item details (severity, description, related AC/file)</action>
      <action>Add current review task to resolution tracking list: append structured entry to {{resolved_review_items}}</action>

      <!-- Mark task in Review Follow-ups section -->
      <action>Mark task checkbox [x] in "Tasks/Subtasks → Review Follow-ups (AI)" section</action>

      <!-- CRITICAL: Also mark corresponding action item in review section -->
      <action>Find matching action item in "Senior Developer Review (AI) → Action Items" using fuzzy matching:
        1. Normalize strings (lowercase, trim, remove "[AI-Review]" prefix/punctuation)
        2. Try exact and substring matches first
        3. If none, compute token-overlap/Jaccard score per candidate
        4. Select highest-scoring candidate when score >= 0.60
        5. If tie at best score, prefer the candidate with more shared tokens; log ambiguity
      </action>
      <check if="matching action item found">
        <action>Mark that action item checkbox [x] as resolved</action>
      </check>
      <check if="no candidate meets threshold">
        <action>Log warning and append task to {{unresolved_review_items}}</action>
        <action>Add resolution note in Dev Agent Record that no corresponding action item was found</action>
      </check>

      <action>Add to Dev Agent Record → Completion Notes: "✅ Resolved review finding [{{severity}}]: {{description}}"</action>
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
      <action>Set {{resolved_count}} = length({{resolved_review_items}})</action>
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

## Next
- Read fully and follow: `./step-09-mark-review-ready.md`.
