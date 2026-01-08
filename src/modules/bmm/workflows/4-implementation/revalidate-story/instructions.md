# Revalidate Story - Verify Checkboxes Against Codebase Reality

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="1" goal="Load story and backup current state">
  <action>Verify story_file parameter provided</action>

  <check if="story_file not provided">
    <output>❌ ERROR: story_file parameter required

Usage:
  /revalidate-story story_file=path/to/story.md
  /revalidate-story story_file=path/to/story.md fill_gaps=true
    </output>
    <action>HALT</action>
  </check>

  <action>Read COMPLETE story file: {{story_file}}</action>
  <action>Parse sections: Acceptance Criteria, Tasks/Subtasks, Definition of Done, Dev Agent Record</action>

  <action>Extract story_key from filename (e.g., "2-7-image-file-handling")</action>

  <action>Create backup of current checkbox state:</action>
  <action>Count currently checked items:
    - ac_checked_before = count of [x] in Acceptance Criteria
    - tasks_checked_before = count of [x] in Tasks/Subtasks
    - dod_checked_before = count of [x] in Definition of Done
    - total_checked_before = sum of above
  </action>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 STORY REVALIDATION STARTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Story:** {{story_key}}
**File:** {{story_file}}
**Mode:** {{#if fill_gaps}}Verify & Fill Gaps{{else}}Verify Only{{/if}}

**Current State:**
- Acceptance Criteria: {{ac_checked_before}}/{{ac_total}} checked
- Tasks: {{tasks_checked_before}}/{{tasks_total}} checked
- Definition of Done: {{dod_checked_before}}/{{dod_total}} checked
- **Total:** {{total_checked_before}}/{{total_items}} ({{pct_before}}%)

**Action:** Clearing all checkboxes and re-verifying against codebase...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="2" goal="Clear all checkboxes">
  <output>🧹 Clearing all checkboxes to start fresh verification...</output>

  <action>Use Edit tool to replace all [x] with [ ] in Acceptance Criteria section</action>
  <action>Use Edit tool to replace all [x] with [ ] in Tasks/Subtasks section</action>
  <action>Use Edit tool to replace all [x] with [ ] in Definition of Done section</action>

  <action>Save story file with all boxes unchecked</action>

  <output>✅ All checkboxes cleared. Starting verification from clean slate...</output>
</step>

<step n="3" goal="Verify Acceptance Criteria against codebase">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 VERIFYING ACCEPTANCE CRITERIA ({{ac_total}} items)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Extract all AC items from Acceptance Criteria section</action>

  <iterate>For each AC item:</iterate>

  <substep n="3a" title="Parse AC and determine what should exist">
    <action>Extract AC description and identify artifacts:
      - File mentions (e.g., "UserProfile component")
      - Function names (e.g., "updateUser function")
      - Features (e.g., "dark mode toggle")
      - Test requirements (e.g., "unit tests covering edge cases")
    </action>

    <output>Verifying AC{{@index}}: {{ac_description}}</output>
  </substep>

  <substep n="3b" title="Search codebase for evidence">
    <action>Use Glob to find relevant files:
      - If AC mentions specific file: glob for that file
      - If AC mentions component: glob for **/*ComponentName*
      - If AC mentions feature: glob for files in related directories
    </action>

    <action>Use Grep to search for symbols/functions/features</action>

    <action>Read found files to verify:</action>
    <action>- NOT a stub (check for "TODO", "Not implemented", "throw new Error")</action>
    <action>- Has actual implementation (not just empty function)</action>
    <action>- Tests exist (search for *.test.* or *.spec.* files)</action>
    <action>- Tests pass (if --fill-gaps mode, run tests)</action>
  </substep>

  <substep n="3c" title="Determine verification status">
    <check if="all evidence found AND no stubs AND tests exist">
      <action>verification_status = VERIFIED</action>
      <action>Check box [x] in story file for this AC</action>
      <action>Record evidence: "✅ VERIFIED: {{files_found}}, tests: {{test_files}}"</action>
      <output>  ✅ AC{{@index}}: VERIFIED</output>
    </check>

    <check if="partial evidence OR stubs found OR tests missing">
      <action>verification_status = PARTIAL</action>
      <action>Check box [~] in story file for this AC</action>
      <action>Record gap: "🔶 PARTIAL: {{what_exists}}, missing: {{what_is_missing}}"</action>
      <output>  🔶 AC{{@index}}: PARTIAL ({{what_is_missing}})</output>
      <action>Add to gaps_list with details</action>
    </check>

    <check if="no evidence found">
      <action>verification_status = MISSING</action>
      <action>Leave box unchecked [ ] in story file</action>
      <action>Record gap: "❌ MISSING: No implementation found for {{ac_description}}"</action>
      <output>  ❌ AC{{@index}}: MISSING</output>
      <action>Add to gaps_list with details</action>
    </check>
  </substep>

  <action>Save story file after each AC verification</action>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Acceptance Criteria Verification Complete
✅ Verified: {{ac_verified}}
🔶 Partial: {{ac_partial}}
❌ Missing: {{ac_missing}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="4" goal="Verify Tasks/Subtasks against codebase">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 VERIFYING TASKS ({{tasks_total}} items)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Extract all Task items from Tasks/Subtasks section</action>

  <iterate>For each Task item (same verification logic as ACs):</iterate>

  <action>Parse task description for artifacts</action>
  <action>Search codebase with Glob/Grep</action>
  <action>Read and verify (check for stubs, tests)</action>
  <action>Determine status: VERIFIED | PARTIAL | MISSING</action>
  <action>Update checkbox: [x] | [~] | [ ]</action>
  <action>Record evidence or gap</action>
  <action>Save story file</action>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tasks Verification Complete
✅ Verified: {{tasks_verified}}
🔶 Partial: {{tasks_partial}}
❌ Missing: {{tasks_missing}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="5" goal="Verify Definition of Done against codebase">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 VERIFYING DEFINITION OF DONE ({{dod_total}} items)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Extract all DoD items from Definition of Done section</action>

  <iterate>For each DoD item:</iterate>

  <action>Parse DoD requirement:
    - "Type check passes" → Run type checker
    - "Unit tests 90%+ coverage" → Run coverage report
    - "Linting clean" → Run linter
    - "Build succeeds" → Run build
    - "All tests pass" → Run test suite
  </action>

  <action>Execute verification for this DoD item</action>

  <check if="verification passes">
    <action>Check box [x]</action>
    <action>Record: "✅ VERIFIED: {{verification_result}}"</action>
  </check>

  <check if="verification fails or N/A">
    <action>Leave unchecked [ ] or partial [~]</action>
    <action>Record gap if applicable</action>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition of Done Verification Complete
✅ Verified: {{dod_verified}}
🔶 Partial: {{dod_partial}}
❌ Missing: {{dod_missing}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="6" goal="Generate revalidation report">
  <action>Calculate overall completion:</action>
  <action>
    total_verified = ac_verified + tasks_verified + dod_verified
    total_partial = ac_partial + tasks_partial + dod_partial
    total_missing = ac_missing + tasks_missing + dod_missing
    total_items = ac_total + tasks_total + dod_total

    verified_pct = (total_verified / total_items) × 100
    completion_pct = ((total_verified + total_partial) / total_items) × 100
  </action>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 REVALIDATION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Story:** {{story_key}}
**File:** {{story_file}}

**Verification Results:**
- ✅ Verified Complete: {{total_verified}}/{{total_items}} ({{verified_pct}}%)
- 🔶 Partially Complete: {{total_partial}}/{{total_items}}
- ❌ Missing/Incomplete: {{total_missing}}/{{total_items}}

**Breakdown:**
- Acceptance Criteria: {{ac_verified}}✅ {{ac_partial}}🔶 {{ac_missing}}❌ / {{ac_total}} total
- Tasks: {{tasks_verified}}✅ {{tasks_partial}}🔶 {{tasks_missing}}❌ / {{tasks_total}} total
- Definition of Done: {{dod_verified}}✅ {{dod_partial}}🔶 {{dod_missing}}❌ / {{dod_total}} total

**Status Assessment:**
{{#if verified_pct >= 95}}
✅ Story is COMPLETE ({{verified_pct}}% verified)
{{else if verified_pct >= 80}}
🔶 Story is MOSTLY COMPLETE ({{verified_pct}}% verified, {{total_missing}} gaps)
{{else if verified_pct >= 50}}
⚠️ Story is PARTIALLY COMPLETE ({{verified_pct}}% verified, {{total_missing}} gaps)
{{else}}
❌ Story is INCOMPLETE ({{verified_pct}}% verified, significant work missing)
{{/if}}

**Before Revalidation:** {{total_checked_before}}/{{total_items}} checked ({{pct_before}}%)
**After Revalidation:** {{total_verified}}/{{total_items}} verified ({{verified_pct}}%)
**Accuracy:** {{#if pct_before == verified_pct}}Perfect match{{else if pct_before > verified_pct}}{{pct_before - verified_pct}}% over-reported{{else}}{{verified_pct - pct_before}}% under-reported{{/if}}

{{#if total_missing > 0}}
---
**Gaps Found ({{total_missing}}):**
{{#each gaps_list}}
{{@index + 1}}. {{item_type}} - {{item_description}}
   Status: {{status}}
   Missing: {{what_is_missing}}
   {{#if evidence}}Evidence checked: {{evidence}}{{/if}}
{{/each}}
---
{{/if}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <check if="create_report == true">
    <action>Write detailed report to: {sprint_artifacts}/revalidation-{{story_key}}-{{timestamp}}.md</action>
    <action>Include: verification results, gaps list, evidence for each item, recommendations</action>
    <output>📄 Detailed report: {{report_path}}</output>
  </check>
</step>

<step n="7" goal="Decide on gap filling">
  <check if="fill_gaps == false">
    <output>
✅ Verification complete (verify-only mode)

{{#if total_missing > 0}}
**To fill the {{total_missing}} gaps, run:**
/revalidate-story story_file={{story_file}} fill_gaps=true
{{else}}
No gaps found - story is complete!
{{/if}}
    </output>
    <action>Exit workflow</action>
  </check>

  <check if="fill_gaps == true AND total_missing == 0">
    <output>✅ No gaps to fill - story is already complete!</output>
    <action>Exit workflow</action>
  </check>

  <check if="fill_gaps == true AND total_missing > 0">
    <check if="total_missing > max_gaps_to_fill">
      <output>
⚠️ TOO MANY GAPS: {{total_missing}} gaps found (max: {{max_gaps_to_fill}})

This story has too many missing items for automatic gap filling.
Consider:
1. Re-implementing the story from scratch with /dev-story
2. Manually implementing the gaps
3. Increasing max_gaps_to_fill in workflow.yaml (use cautiously)

Gap filling HALTED for safety.
      </output>
      <action>HALT</action>
    </check>

    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 GAP FILLING MODE ({{total_missing}} gaps to fill)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>

    <action>Continue to Step 8</action>
  </check>
</step>

<step n="8" goal="Fill gaps (implement missing items)">
  <iterate>For each gap in gaps_list:</iterate>

  <substep n="8a" title="Confirm gap filling">
    <check if="require_confirmation == true">
      <ask>
Fill this gap?

**Item:** {{item_description}}
**Type:** {{item_type}} ({{section}})
**Missing:** {{what_is_missing}}

[Y] Yes - Implement this item
[A] Auto-fill - Implement this and all remaining gaps without asking
[S] Skip - Leave this gap unfilled
[H] Halt - Stop gap filling

Your choice:
      </ask>

      <check if="choice == 'A'">
        <action>Set require_confirmation = false (auto-fill remaining)</action>
      </check>

      <check if="choice == 'S'">
        <action>Continue to next gap</action>
      </check>

      <check if="choice == 'H'">
        <action>Exit gap filling loop</action>
        <action>Jump to Step 9 (Summary)</action>
      </check>
    </check>
  </substep>

  <substep n="8b" title="Implement missing item">
    <output>🔧 Implementing: {{item_description}}</output>

    <action>Load story context (Technical Requirements, Architecture Compliance, Dev Notes)</action>
    <action>Implement missing item following story specifications</action>
    <action>Write tests if required</action>
    <action>Run tests to verify implementation</action>
    <action>Verify linting/type checking passes</action>

    <check if="implementation succeeds AND tests pass">
      <action>Check box [x] for this item in story file</action>
      <action>Update File List with new/modified files</action>
      <action>Add to Dev Agent Record: "Gap filled: {{item_description}}"</action>
      <output>  ✅ Implemented and verified</output>

      <check if="commit_strategy == 'per_gap'">
        <action>Stage files for this gap</action>
        <action>Commit: "fix({{story_key}}): fill gap - {{item_description}}"</action>
        <output>  ✅ Committed</output>
      </check>
    </check>

    <check if="implementation fails">
      <output>  ❌ Failed to implement: {{error_message}}</output>
      <action>Leave box unchecked</action>
      <action>Record failure in gaps_list</action>
      <action>Add to failed_gaps</action>
    </check>
  </substep>

  <action>After all gaps processed:</action>
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Gap Filling Complete
✅ Filled: {{gaps_filled}}
❌ Failed: {{gaps_failed}}
⏭️ Skipped: {{gaps_skipped}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="9" goal="Re-verify filled gaps and finalize">
  <check if="gaps_filled > 0">
    <output>🔍 Re-verifying filled gaps...</output>

    <iterate>For each filled gap:</iterate>
    <action>Re-run verification for that item</action>
    <action>Ensure still VERIFIED after all changes</action>

    <output>✅ All filled gaps re-verified</output>
  </check>

  <action>Calculate final completion:</action>
  <action>
    final_verified = count of [x] across all sections
    final_partial = count of [~] across all sections
    final_missing = count of [ ] across all sections
    final_pct = (final_verified / total_items) × 100
  </action>

  <check if="commit_strategy == 'all_at_once' AND gaps_filled > 0">
    <action>Stage all changed files</action>
    <action>Commit: "fix({{story_key}}): fill {{gaps_filled}} gaps from revalidation"</action>
    <output>✅ All gaps committed</output>
  </check>

  <check if="update_sprint_status == true">
    <action>Load {sprint_status} file</action>
    <action>Update entry with current progress:</action>
    <action>Format: {{story_key}}: {{current_status}}  # Revalidated: {{final_verified}}/{{total_items}} ({{final_pct}}%) verified</action>
    <action>Save sprint-status.yaml</action>
    <output>✅ Sprint status updated with revalidation results</output>
  </check>

  <check if="update_dev_agent_record == true">
    <action>Add to Dev Agent Record in story file:</action>
    <action>
## Revalidation Record ({{timestamp}})

**Revalidation Mode:** {{#if fill_gaps}}Verify & Fill{{else}}Verify Only{{/if}}

**Results:**
- Verified: {{final_verified}}/{{total_items}} ({{final_pct}}%)
- Gaps Found: {{total_missing}}
- Gaps Filled: {{gaps_filled}}

**Evidence:**
{{#each verification_evidence}}
- {{item}}: {{evidence}}
{{/each}}

{{#if gaps_filled > 0}}
**Gaps Filled:**
{{#each filled_gaps}}
- {{item}}: {{what_was_implemented}}
{{/each}}
{{/if}}

{{#if failed_gaps.length > 0}}
**Failed to Fill:**
{{#each failed_gaps}}
- {{item}}: {{error}}
{{/each}}
{{/if}}
    </action>
    <action>Save story file</action>
  </check>
</step>

<step n="10" goal="Final summary and recommendations">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ REVALIDATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Story:** {{story_key}}

**Final Status:**
- ✅ Verified Complete: {{final_verified}}/{{total_items}} ({{final_pct}}%)
- 🔶 Partially Complete: {{final_partial}}/{{total_items}}
- ❌ Missing/Incomplete: {{final_missing}}/{{total_items}}

{{#if fill_gaps}}
**Gap Filling Results:**
- Filled: {{gaps_filled}}
- Failed: {{gaps_failed}}
- Skipped: {{gaps_skipped}}
{{/if}}

**Accuracy Check:**
- Before revalidation: {{pct_before}}% checked
- After revalidation: {{final_pct}}% verified
- Checkbox accuracy: {{#if pct_before == final_pct}}✅ Perfect (0% discrepancy){{else if pct_before > final_pct}}⚠️ {{pct_before - final_pct}}% over-reported (checkboxes were optimistic){{else}}🔶 {{final_pct - pct_before}}% under-reported (work done but not checked){{/if}}

{{#if final_pct >= 95}}
**Recommendation:** Story is COMPLETE - mark as "done" or "review"
{{else if final_pct >= 80}}
**Recommendation:** Story is mostly complete - finish remaining {{final_missing}} items then mark "review"
{{else if final_pct >= 50}}
**Recommendation:** Story has significant gaps - continue development with /dev-story
{{else}}
**Recommendation:** Story is mostly incomplete - consider re-implementing with /dev-story or /super-dev-pipeline
{{/if}}

{{#if failed_gaps.length > 0}}
**⚠️ Manual attention needed for {{failed_gaps.length}} items that failed to fill automatically**
{{/if}}

{{#if create_report}}
**Detailed Report:** {sprint_artifacts}/revalidation-{{story_key}}-{{timestamp}}.md
{{/if}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

</workflow>
