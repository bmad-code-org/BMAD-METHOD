# Gap Analysis v3.0 - Verify Story Tasks Against Codebase

<purpose>
Validate story checkbox claims against actual codebase reality.
Find false positives (checked but not done) and false negatives (done but unchecked).
Interactive workflow with options to update, audit, or review.
</purpose>

<philosophy>
**Evidence-Based Verification**

Checkboxes lie. Code doesn't.
- Search codebase for implementation evidence
- Check for stubs, TODOs, empty functions
- Verify tests exist for claimed features
- Report accuracy of story completion claims
</philosophy>

<config>
name: gap-analysis
version: 3.0.0

defaults:
  auto_update: false
  create_audit_report: true
  strict_mode: false  # If true, stubs count as incomplete

output:
  update_story: "Modify checkbox state to match reality"
  audit_report: "Generate detailed gap analysis document"
  no_changes: "Display results only"
</config>

<execution_context>
@patterns/verification.md
@patterns/hospital-grade.md
</execution_context>

<process>

<step name="load_story" priority="first">
**Load and parse story file**

```bash
STORY_FILE="{{story_file}}"
[ -f "$STORY_FILE" ] || { echo "❌ story_file required"; exit 1; }
```

Use Read tool on story file. Extract:
- All `- [ ]` and `- [x]` items
- File references from Dev Agent Record
- Task descriptions with expected artifacts

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 GAP ANALYSIS: {{story_key}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tasks: {{total_tasks}}
Currently checked: {{checked_count}}
```
</step>

<step name="verify_each_task">
**Verify each task against codebase**

For each task item:

1. **Extract artifacts** - File names, component names, function names
2. **Search codebase:**
   ```bash
   # Check file exists
   Glob: {{expected_file}}

   # Check function/component exists
   Grep: "{{function_or_component_name}}"
   ```

3. **If file exists, check quality:**
   ```bash
   # Check for stubs
   Grep: "TODO|FIXME|Not implemented|throw new Error" {{file}}

   # Check for tests
   Glob: {{file_base}}.test.* OR {{file_base}}.spec.*
   ```

4. **Determine status:**
   - **VERIFIED:** File exists, not a stub, tests exist
   - **PARTIAL:** File exists but stub/TODO or no tests
   - **MISSING:** File does not exist
</step>

<step name="calculate_accuracy">
**Compare claimed vs actual**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 GAP ANALYSIS RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tasks analyzed: {{total}}

By Status:
- ✅ Verified Complete: {{verified}} ({{verified_pct}}%)
- ⚠️ Partial: {{partial}} ({{partial_pct}}%)
- ❌ Missing: {{missing}} ({{missing_pct}}%)

Accuracy Analysis:
- Checked & Verified: {{correct_checked}}
- Checked but MISSING: {{false_positives}} ← FALSE POSITIVES
- Unchecked but DONE: {{false_negatives}} ← FALSE NEGATIVES

Checkbox Accuracy: {{accuracy}}%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**If false positives found:**
```
⚠️ FALSE POSITIVES DETECTED
The following tasks are marked done but code is missing:

{{#each false_positives}}
- [ ] {{task}} — Expected: {{expected_file}} — ❌ NOT FOUND
{{/each}}
```
</step>

<step name="present_options">
**Ask user how to proceed**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[U] Update - Fix checkboxes to match reality
[A] Audit Report - Generate detailed report file
[N] No Changes - Display only (already done)
[R] Review Details - Show full evidence for each task

Your choice:
```
</step>

<step name="option_update" if="choice == U">
**Update story file checkboxes**

For false positives:
- Change `[x]` to `[ ]` for tasks with missing code

For false negatives:
- Change `[ ]` to `[x]` for tasks with verified code

Use Edit tool to make changes.

```
✅ Story checkboxes updated
- {{fp_count}} false positives unchecked
- {{fn_count}} false negatives checked
- New completion: {{new_pct}}%
```
</step>

<step name="option_audit" if="choice == A">
**Generate audit report**

Write to: `{{story_dir}}/gap-analysis-{{story_key}}-{{timestamp}}.md`

Include:
- Executive summary
- Detailed task-by-task evidence
- False positive/negative lists
- Recommendations

```
✅ Audit report generated: {{report_path}}
```
</step>

<step name="option_review" if="choice == R">
**Show detailed evidence**

For each task:
```
Task: {{task_text}}
Checkbox: {{checked_state}}
Evidence:
  - File: {{file}} - {{exists ? "✅ EXISTS" : "❌ MISSING"}}
  {{#if exists}}
  - Stub check: {{is_stub ? "⚠️ STUB DETECTED" : "✅ Real implementation"}}
  - Tests: {{has_tests ? "✅ Tests exist" : "❌ No tests"}}
  {{/if}}
Verdict: {{status}}
```

After review, return to options menu.
</step>

<step name="final_summary">
**Display completion**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ GAP ANALYSIS COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Story: {{story_key}}
Verified Completion: {{verified_pct}}%
Checkbox Accuracy: {{accuracy}}%

{{#if updated}}
✅ Checkboxes updated to match reality
{{/if}}

{{#if report_generated}}
📄 Report: {{report_path}}
{{/if}}

{{#if false_positives > 0}}
⚠️ {{false_positives}} tasks need implementation work
{{/if}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
</step>

</process>

<examples>
```bash
# Quick gap analysis of single story
/gap-analysis story_file=docs/sprint-artifacts/2-5-auth.md

# With auto-update enabled
/gap-analysis story_file=docs/sprint-artifacts/2-5-auth.md auto_update=true
```
</examples>

<failure_handling>
**Story file not found:** HALT with clear error.
**Search fails:** Log warning, count as MISSING.
**Edit fails:** Report error, suggest manual update.
</failure_handling>

<success_criteria>
- [ ] All tasks verified against codebase
- [ ] False positives/negatives identified
- [ ] Accuracy metrics calculated
- [ ] User choice executed (update/audit/review)
</success_criteria>
