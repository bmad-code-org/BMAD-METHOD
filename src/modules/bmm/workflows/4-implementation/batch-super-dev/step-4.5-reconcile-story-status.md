# Step 4.5: Smart Story Reconciliation

<critical>Execute AFTER super-dev-pipeline completes but BEFORE marking story as "completed"</critical>
<critical>This ensures story checkboxes and status accurately reflect actual implementation</critical>

## Goal

Verify story file accuracy by reconciling:
1. **Acceptance Criteria checkboxes** vs Dev Agent Record
2. **Tasks/Subtasks checkboxes** vs Dev Agent Record
3. **Definition of Done checkboxes** vs Dev Agent Record
4. **Story status** (should be "done" if implementation complete)
5. **sprint-status.yaml entry** (should match story file status)

---

## Execution

### 1. Load Story File

<action>Read story file: {story_file_path}</action>
<action>Extract sections:
  - Acceptance Criteria (## Acceptance Criteria)
  - Tasks / Subtasks (## Tasks / Subtasks)
  - Definition of Done (## Definition of Done)
  - Dev Agent Record (## Dev Agent Record)
  - Story status header (**Status:** ...)
</action>

### 2. Analyze Dev Agent Record

<action>Read "Dev Agent Record" section</action>

<check if="Dev Agent Record is empty or says '(To be filled by dev agent)'">
  <output>⚠️ Story {{story_key}}: Dev Agent Record is empty - cannot reconcile</output>
  <output>This suggests super-dev-pipeline did not complete successfully.</output>
  <action>Mark story as FAILED reconciliation</action>
  <action>Return early (skip remaining checks)</action>
</check>

<action>Parse Dev Agent Record fields:
  - **Agent Model Used** (should have model name, not empty)
  - **Implementation Summary** (should describe what was built)
  - **File List** (should list new/modified files)
  - **Test Results** (should show test counts)
  - **Completion Notes** (should document what works)
</action>

<check if="Implementation Summary contains 'COMPLETE' or lists specific deliverables">
  <action>Set implementation_status = COMPLETE</action>
</check>

<check if="Implementation Summary is vague or says 'pending'">
  <action>Set implementation_status = INCOMPLETE</action>
  <output>⚠️ Story {{story_key}}: Implementation appears incomplete based on Dev Agent Record</output>
</check>

### 3. Reconcile Acceptance Criteria

<action>For each AC subsection (AC1, AC2, AC3, AC4, etc.):</action>

<iterate>For each checkbox in AC section:</iterate>

<substep n="3a" title="Identify expected status from Dev Agent Record">
  <action>Search Implementation Summary and File List for keywords from checkbox text</action>

  <example>
  Checkbox: "[ ] FlexibleGridSection component (renders dynamic grid layouts)"
  Implementation Summary mentions: "FlexibleGridSection component created"
  File List includes: "FlexibleGridSection.tsx"
  → Expected status: CHECKED
  </example>

  <action>Determine expected_checkbox_status:
    - CHECKED if Implementation Summary confirms it OR File List shows created files OR Test Results mention it
    - UNCHECKED if no evidence in Dev Agent Record
    - PARTIAL if mentioned as "pending" or "infrastructure ready"
  </action>
</substep>

<substep n="3b" title="Compare actual vs expected">
  <action>Read actual checkbox state from story file ([x] vs [ ] vs [~])</action>

  <check if="actual != expected">
    <output>🔧 Reconciling AC: "{{checkbox_text}}"
      Actual: {{actual_status}}
      Expected: {{expected_status}}
      Reason: {{evidence_from_dev_record}}
    </output>
    <action>Add to reconciliation_changes list</action>
  </check>
</substep>

<action>After checking all ACs:
  - Count total AC items
  - Count checked AC items (after reconciliation)
  - Calculate AC completion percentage
</action>

### 4. Reconcile Tasks / Subtasks

<action>For each Task (Task 1, Task 2, etc.):</action>

<iterate>For each checkbox in Tasks section:</iterate>

<substep n="4a" title="Identify expected status from Dev Agent Record">
  <action>Search Implementation Summary and File List for task keywords</action>

  <example>
  Task checkbox: "[ ] **2.2:** Create FlexibleGridSection component"
  File List includes: "apps/frontend/web/src/components/FlexibleGridSection.tsx"
  → Expected status: CHECKED
  </example>

  <action>Determine expected_checkbox_status using same logic as AC section</action>
</substep>

<substep n="4b" title="Compare and reconcile">
  <action>Read actual checkbox state</action>

  <check if="actual != expected">
    <output>🔧 Reconciling Task: "{{task_text}}"
      Actual: {{actual_status}}
      Expected: {{expected_status}}
      Reason: {{evidence_from_dev_record}}
    </output>
    <action>Add to reconciliation_changes list</action>
  </check>
</substep>

<action>After checking all Tasks:
  - Count total task items
  - Count checked task items (after reconciliation)
  - Calculate task completion percentage
</action>

### 5. Reconcile Definition of Done

<action>For each DoD category (Code Quality, Testing, Security, etc.):</action>

<iterate>For each checkbox in DoD section:</iterate>

<substep n="5a" title="Determine expected status">
  <action>Check Test Results, Completion Notes for evidence</action>

  <example>
  DoD checkbox: "[ ] Type check passes: `pnpm type-check` (zero errors)"
  Completion Notes say: "Type check passes ✅"
  → Expected status: CHECKED
  </example>

  <example>
  DoD checkbox: "[ ] Unit tests: 90%+ coverage"
  Test Results say: "37 tests passing"
  Completion Notes say: "100% coverage on FlexibleGridSection"
  → Expected status: CHECKED
  </example>

  <action>Determine expected_checkbox_status</action>
</substep>

<substep n="5b" title="Compare and reconcile">
  <action>Read actual checkbox state</action>

  <check if="actual != expected">
    <output>🔧 Reconciling DoD: "{{dod_text}}"
      Actual: {{actual_status}}
      Expected: {{expected_status}}
      Reason: {{evidence_from_dev_record}}
    </output>
    <action>Add to reconciliation_changes list</action>
  </check>
</substep>

<action>After checking all DoD items:
  - Count total DoD items
  - Count checked DoD items (after reconciliation)
  - Calculate DoD completion percentage
</action>

### 6. Determine Correct Story Status

<action>Based on completion percentages, determine correct story status:</action>

<check if="AC >= 95% AND Tasks >= 95% AND DoD >= 95%">
  <action>Set correct_story_status = "done"</action>
</check>

<check if="AC >= 80% AND Tasks >= 80% AND DoD >= 80%">
  <action>Set correct_story_status = "review"</action>
</check>

<check if="AC < 80% OR Tasks < 80% OR DoD < 80%">
  <action>Set correct_story_status = "in-progress"</action>
</check>

<check if="implementation_status == INCOMPLETE">
  <action>Override: Set correct_story_status = "in-progress"</action>
  <output>⚠️ Overriding status to "in-progress" due to incomplete implementation</output>
</check>

<action>Read current story status from story file (**Status:** ...)</action>

<check if="current_story_status != correct_story_status">
  <output>🔧 Story status mismatch:
    Current: {{current_story_status}}
    Expected: {{correct_story_status}}
    Reason: AC={{ac_pct}}% Tasks={{tasks_pct}}% DoD={{dod_pct}}%
  </output>
  <action>Add to reconciliation_changes list</action>
</check>

### 7. Verify sprint-status.yaml Entry

<action>Read {sprint_status} file</action>
<action>Find entry for {{story_key}}</action>
<action>Extract current status from sprint-status.yaml</action>

<check if="sprint_status_yaml_status != correct_story_status">
  <output>🔧 sprint-status.yaml mismatch:
    Current: {{sprint_status_yaml_status}}
    Expected: {{correct_story_status}}
  </output>
  <action>Add to reconciliation_changes list</action>
</check>

### 8. Apply Reconciliation Changes

<check if="reconciliation_changes is empty">
  <output>✅ Story {{story_key}}: Already accurate (0 changes needed)</output>
  <action>Return SUCCESS (no updates needed)</action>
</check>

<check if="reconciliation_changes is NOT empty">
  <output>
🔧 Story {{story_key}}: Reconciling {{count}} issues

**Changes to apply:**
{{#each reconciliation_changes}}
{{@index}}. {{change_description}}
{{/each}}
  </output>

  <ask>Apply these reconciliation changes? (yes/no):</ask>

  <check if="response != 'yes'">
    <output>⏭️ Skipping reconciliation for {{story_key}}</output>
    <action>Return SUCCESS (user declined changes)</action>
  </check>

  <substep n="8a" title="Update Acceptance Criteria">
    <action>For each AC checkbox that needs updating:</action>
    <action>Use Edit tool to update checkbox from [ ] to [x] or [~]</action>
    <action>Add note explaining why: "- [x] Item - COMPLETE: {{evidence}}"</action>
  </substep>

  <substep n="8b" title="Update Tasks / Subtasks">
    <action>For each Task checkbox that needs updating:</action>
    <action>Use Edit tool to update checkbox</action>
    <action>Update task header if all subtasks complete: "### Task 1: ... ✅ COMPLETE"</action>
  </substep>

  <substep n="8c" title="Update Definition of Done">
    <action>For each DoD checkbox that needs updating:</action>
    <action>Use Edit tool to update checkbox</action>
    <action>Add verification note: "- [x] Item ✅ (verified in Dev Agent Record)"</action>
  </substep>

  <substep n="8d" title="Update Story Status">
    <check if="story status needs updating">
      <action>Use Edit tool to update status line</action>
      <action>Change from: **Status:** {{old_status}}</action>
      <action>Change to: **Status:** {{correct_story_status}}</action>
    </check>
  </substep>

  <substep n="8e" title="Update sprint-status.yaml">
    <check if="sprint-status.yaml needs updating">
      <action>Use Edit tool to update status entry</action>
      <action>Update comment if needed to reflect completion</action>
      <example>
      Before: 20-8-...: ready-for-dev  # Story description
      After:  20-8-...: done  # ✅ COMPLETED: Component + tests + docs
      </example>
    </check>
  </substep>

  <output>✅ Story {{story_key}}: Reconciliation complete ({{count}} changes applied)</output>
</check>

### 9. Final Verification

<action>Re-read story file to verify changes applied correctly</action>
<action>Calculate final completion percentages</action>

<output>
📊 Story {{story_key}} - Final Status

**Acceptance Criteria:** {{ac_checked}}/{{ac_total}} ({{ac_pct}}%)
**Tasks/Subtasks:** {{tasks_checked}}/{{tasks_total}} ({{tasks_pct}}%)
**Definition of Done:** {{dod_checked}}/{{dod_total}} ({{dod_pct}}%)

**Story Status:** {{correct_story_status}}
**sprint-status.yaml:** {{correct_story_status}}

{{#if correct_story_status == "done"}}
✅ Story is COMPLETE and accurately reflects implementation
{{/if}}

{{#if correct_story_status == "review"}}
⚠️ Story needs review (some items incomplete)
{{/if}}

{{#if correct_story_status == "in-progress"}}
⚠️ Story has significant gaps (implementation incomplete)
{{/if}}
</output>

<action>Return SUCCESS with reconciliation summary</action>

---

## Success Criteria

Story reconciliation succeeds when:
1. ✅ All checkboxes match Dev Agent Record evidence
2. ✅ Story status accurately reflects completion (done/review/in-progress)
3. ✅ sprint-status.yaml entry matches story file status
4. ✅ Completion percentages calculated and reported
5. ✅ Changes documented in reconciliation summary

---

## Error Handling

<check if="story file not found">
  <output>❌ Story {{story_key}}: File not found at {{story_file_path}}</output>
  <action>Return FAILED reconciliation</action>
</check>

<check if="Dev Agent Record missing or empty">
  <output>⚠️ Story {{story_key}}: Cannot reconcile - Dev Agent Record not populated</output>
  <action>Mark as INCOMPLETE (not implemented yet)</action>
  <action>Return WARNING reconciliation</action>
</check>

<check if="Edit tool fails">
  <output>❌ Story {{story_key}}: Failed to apply changes (Edit tool error)</output>
  <action>Log error details</action>
  <action>Return FAILED reconciliation</action>
</check>

---

## Integration with batch-super-dev

**Insert this step:**
- **Sequential mode:** After Step 4s-a (Process individual story), before marking completed
- **Parallel mode:** After Step 4p-a (Spawn Task agents), after agent completes but before marking completed

**Flow:**
```
super-dev-pipeline completes → Step 4.5 (Reconcile) → Mark as completed/failed
```

**Benefits:**
- Ensures all batch-processed stories have accurate status
- Catches mismatches automatically
- Prevents "done" stories with unchecked items
- Maintains sprint-status.yaml accuracy
