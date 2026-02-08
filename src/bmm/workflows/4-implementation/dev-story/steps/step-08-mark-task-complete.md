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
      - Set {{review_continuation}} = false
      - If current {{task_title}} starts with "[AI-Review]", set {{review_continuation}} = true
      - Else scan {{original_task_list}}; if any item starts with "[AI-Review]", set {{review_continuation}} = true
      - Set {{date}} from system-generated timestamp formatted for project change log entries
      - Set {{resolved_count}} = length({{resolved_review_items}})
      - Set {{review_match_threshold}} = 0.60
      - Define normalize(text): lowercase, trim, remove "[AI-Review]" prefix and punctuation, collapse whitespace
      - Define token_set(text): unique whitespace-separated normalized tokens
    </action>

    <!-- VALIDATION GATES -->
    <action>Verify ALL tests for this task/subtask ACTUALLY EXIST and PASS 100%</action>
    <action>Confirm implementation matches EXACTLY what the task/subtask specifies - no extra features</action>
    <action>Validate that ALL acceptance criteria related to this task are satisfied</action>
    <action>Run full test suite to ensure NO regressions introduced</action>

    <!-- REVIEW FOLLOW-UP HANDLING -->
    <check if="task is review follow-up (has [AI-Review] prefix)">
      <action>Extract review item details (severity, description, related AC/file)</action>
      <action>Load all items from "Senior Developer Review (AI) → Action Items" as candidate list {{review_action_items}}</action>
      <action>Set {{task_text_norm}} = normalize(current review follow-up task description)</action>
      <action>Initialize {{best_match}} = null, {{best_score}} = 0, {{best_shared_tokens}} = 0, {{tie_candidates}} = []</action>
      <action>For each candidate action item:
        1. Set {{candidate_text_norm}} = normalize(candidate text)
        2. If {{task_text_norm}} == {{candidate_text_norm}} OR either contains the other:
           - set {{candidate_score}} = 1.0 and mark as strong match
        3. Else:
           - compute Jaccard score = |token_set(task) ∩ token_set(candidate)| / |token_set(task) ∪ token_set(candidate)|
           - set {{candidate_score}} to computed score
        4. Track shared-token count for tie-breaking
        5. Keep highest score candidate; if same score, keep candidate with more shared tokens
        6. If score and shared-token count both tie, add candidate to {{tie_candidates}}
      </action>
      <action>Set {{match_found}} = true only if {{best_score}} >= {{review_match_threshold}}</action>

      <!-- Mark task in Review Follow-ups section (always, regardless of action-item match result) -->
      <action>Mark task checkbox [x] in "Tasks/Subtasks → Review Follow-ups (AI)" section</action>

      <check if="{{match_found}} == true">
        <action>Mark matched action item checkbox [x] in "Senior Developer Review (AI) → Action Items"</action>
        <action>Append structured entry to {{resolved_review_items}}:
          - task: current review follow-up task
          - matched_action_item: {{best_match}}
          - match_score: {{best_score}}
          - resolved_at: {{date}}
          - status: "matched"
        </action>
        <check if="{{tie_candidates}} is not empty">
          <action>Log ambiguity warning with tied candidates and selected best_match</action>
        </check>
        <action>Add to Dev Agent Record → Completion Notes: "✅ Resolved review finding [{{severity}}]: {{description}} (matched action item, score {{best_score}})"</action>
      </check>

      <check if="{{match_found}} == false">
        <action>Log warning: no candidate met threshold {{review_match_threshold}} for task "{{task_text_norm}}"</action>
        <action>Append structured entry to {{resolved_review_items}}:
          - task: current review follow-up task
          - matched_action_item: null
          - match_score: {{best_score}}
          - resolved_at: {{date}}
          - status: "unmatched"
        </action>
        <action>Append structured entry to {{unresolved_review_items}}:
          - task: current review follow-up task
          - reason: "No corresponding action item met fuzzy-match threshold"
          - best_candidate: {{best_match}}
          - best_score: {{best_score}}
          - recorded_at: {{date}}
        </action>
        <action>Add resolution note in Dev Agent Record that no corresponding action item was found, while follow-up checkbox was still marked complete</action>
      </check>
    </check>

    <!-- ONLY MARK COMPLETE IF ALL VALIDATION PASS -->
    <check if="ALL validation gates pass AND tests ACTUALLY exist and pass">
      <action>ONLY THEN mark the task (and subtasks) checkbox with [x]</action>
      <action>Update File List section with ALL new, modified, or deleted files (paths relative to repo root)</action>
      <action>Add completion notes to Dev Agent Record summarizing what was ACTUALLY implemented and tested</action>
    </check>

    <check if="ANY validation fails">
      <action>DO NOT mark task complete - fix issues first</action>
      <action>If unable to fix validation failures, invoke HALT protocol from dev-story/workflow.md with:
        - reason_code: DEV-STORY-STEP-08-VALIDATION-FAIL
        - step_id: step-08-mark-task-complete
        - message: "Task completion validation failed and remediation was unsuccessful."
        - required_action: "Fix failing validations/tests, then resume."
      </action>
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
