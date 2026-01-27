# Validate v3.0 - Unified Story/Epic Validation

<purpose>
Single workflow for all validation needs. Validates stories against codebase,
detects false positives (checked but not implemented), and reports health scores.
Read-only by default - does not modify files.
</purpose>

<philosophy>
**Trust But Verify**

- Quick mode: Checkbox counting, file existence, pattern matching
- Deep mode: Haiku agents read actual code, verify implementation quality
- Categorize: VERIFIED_COMPLETE, NEEDS_REWORK, FALSE_POSITIVE, IN_PROGRESS
- Report accuracy gaps between claimed and actual completion
</philosophy>

<config>
name: validate
version: 3.0.0

parameters:
  scope:
    story: "Single story file"
    epic: "All stories in an epic"
    all: "All stories in sprint"

  target: "story_file path OR epic_number (depends on scope)"

  depth:
    quick: "Checkbox counting, file existence checks"
    deep: "Haiku agents verify actual code implementation"

  fix_mode: false  # If true, update checkboxes and sprint-status

defaults:
  scope: story
  depth: quick
  fix_mode: false
  batch_size: 10
  model_for_deep: haiku

categories:
  VERIFIED_COMPLETE: {score: ">=95", false_positives: 0}
  COMPLETE_WITH_ISSUES: {score: ">=80", false_positives: "<=2"}
  FALSE_POSITIVE: {score: "<50", description: "Claimed done but missing code"}
  NEEDS_REWORK: {false_positives: ">2"}
  IN_PROGRESS: {description: "Accurately reflects partial completion"}
  NOT_STARTED: {checked: 0}
</config>

<execution_context>
@patterns/verification.md
@patterns/hospital-grade.md
</execution_context>

<process>

<step name="resolve_targets" priority="first">
**Determine what to validate based on scope**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 VALIDATION: {{scope}} scope, {{depth}} depth
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**If scope == story:**
```bash
STORY_FILE="{{target}}"
[ -f "$STORY_FILE" ] || { echo "❌ Story file not found"; exit 1; }
```
stories_to_validate = [target]

**If scope == epic:**
```bash
EPIC_NUM="{{target}}"
# Get stories from sprint-status.yaml matching epic
grep "^${EPIC_NUM}-" docs/sprint-artifacts/sprint-status.yaml
```
stories_to_validate = all stories starting with `{epic_num}-`

**If scope == all:**
```bash
# Find all story files, exclude meta-documents
find docs/sprint-artifacts -name "*.md" | grep -v "EPIC-\|COMPLETION\|REPORT\|README"
```
stories_to_validate = all story files

Display:
```
Stories to validate: {{count}}
Depth: {{depth}}
{{#if depth == deep}}
Estimated cost: ~${{count * 0.13}} (Haiku agents)
{{/if}}
```
</step>

<step name="validate_quick" if="depth == quick">
**Quick validation: checkbox counting and file checks**

For each story:

1. **Read story file** - Extract tasks, ACs, DoD
2. **Count checkboxes:**
   ```
   total_tasks = count of "- [ ]" and "- [x]"
   checked_tasks = count of "- [x]"
   completion_pct = checked / total × 100
   ```

3. **Check file existence** (from Dev Agent Record):
   ```bash
   for file in $FILE_LIST; do
     [ -f "$file" ] && echo "✅ $file" || echo "❌ $file MISSING"
   done
   ```

4. **Basic stub detection:**
   ```bash
   grep -l "TODO\|FIXME\|Not implemented\|throw new Error" $FILE_LIST
   ```

5. **Categorize:**
   - ≥95% checked + files exist → VERIFIED_COMPLETE
   - ≥80% checked → COMPLETE_WITH_ISSUES
   - Files missing for checked tasks → FALSE_POSITIVE
   - <50% checked → IN_PROGRESS
   - 0% checked → NOT_STARTED

6. **Store result** with score and category
</step>

<step name="validate_deep" if="depth == deep">
**Deep validation: Haiku agents verify actual code**

For each story (or batch):

Spawn Haiku agent:
```
Task({
  subagent_type: "general-purpose",
  model: "haiku",
  description: "Deep validate {{story_id}}",
  prompt: `
Verify ALL tasks for story {{story_id}} by reading actual code.

**Tasks to Verify:**
{{#each tasks}}
{{@index}}. [{{checked}}] {{text}}
{{/each}}

**Files from Dev Agent Record:**
{{file_list}}

**For EACH task:**
1. Find relevant files (Glob)
2. Read the files (Read tool)
3. Verify: Is it real code or stubs? Tests exist? Error handling?
4. Judge: actually_complete = true/false

**Return JSON:**
{
  "story_id": "{{story_id}}",
  "tasks": [
    {
      "task_number": 0,
      "is_checked": true,
      "actually_complete": false,
      "confidence": "high",
      "evidence": "File has TODO on line 45",
      "issues": ["Stub implementation", "No tests"]
    }
  ]
}
`
})
```

Parse results:
- **False positive:** checked=true, actually_complete=false
- **False negative:** checked=false, actually_complete=true
- **Correct:** checked matches actually_complete

Calculate verification score:
```
score = (correct_count / total_count) × 100
score -= (false_positive_count × 5)  # Penalty for false positives
```
</step>

<step name="categorize_results">
**Assign categories based on scores**

| Category | Criteria | Recommended Status |
|----------|----------|-------------------|
| VERIFIED_COMPLETE | score ≥95, FP=0 | done |
| COMPLETE_WITH_ISSUES | score ≥80, FP≤2 | review |
| FALSE_POSITIVE | score <50 OR FP>5 | in-progress |
| NEEDS_REWORK | FP>2 | in-progress |
| IN_PROGRESS | partial completion | in-progress |
| NOT_STARTED | 0 checked | backlog |

For each story:
- Compare current_status vs recommended_status
- Flag if status is inaccurate
</step>

<step name="aggregate_report" if="scope != story">
**Generate batch summary**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 VALIDATION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Scope: {{scope}} {{#if target}}({{target}}){{/if}}
Stories Validated: {{count}}
Depth: {{depth}}

Overall Health Score: {{health_score}}/100

By Category:
- ✅ VERIFIED_COMPLETE: {{verified_count}} ({{verified_pct}}%)
- ⚠️ NEEDS_REWORK: {{rework_count}} ({{rework_pct}}%)
- ❌ FALSE_POSITIVE: {{fp_count}} ({{fp_pct}}%)
- 🔄 IN_PROGRESS: {{progress_count}} ({{progress_pct}}%)
- 📋 NOT_STARTED: {{not_started_count}}

Task Accuracy:
- Total tasks: {{total_tasks}}
- False positives: {{fp_tasks}} (checked but not done)
- False negatives: {{fn_tasks}} (done but not checked)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**If FALSE_POSITIVE stories found:**
```
❌ FALSE POSITIVE STORIES (Claimed Done, Not Implemented):

{{#each fp_stories}}
- {{story_id}}: Score {{score}}/100, {{fp_task_count}} tasks missing
  Current: {{current_status}} → Should be: in-progress
{{/each}}

Action: These stories need implementation work!
```
</step>

<step name="display_single_result" if="scope == story">
**Show single story validation result**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 STORY VALIDATION: {{story_id}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Epic: {{epic_num}}
Current Status: {{current_status}}
Recommended Status: {{recommended_status}}

Verification Score: {{score}}/100
Category: {{category}}

Tasks: {{checked}}/{{total}} checked
{{#if depth == deep}}
- Verified complete: {{verified_count}}
- False positives: {{fp_count}} (checked but code missing)
- False negatives: {{fn_count}} (code exists, not checked)
{{/if}}

{{#if category == "VERIFIED_COMPLETE"}}
✅ Story is production-ready
{{else if category == "FALSE_POSITIVE"}}
❌ Story claimed done but has {{fp_count}} missing tasks
   Action: Update status to in-progress, implement missing code
{{else if category == "NEEDS_REWORK"}}
⚠️ Story needs rework: {{fp_count}} tasks with issues
{{else if category == "IN_PROGRESS"}}
🔄 Story accurately reflects partial completion
{{/if}}

{{#if fp_tasks}}
**False Positive Tasks (checked but not done):**
{{#each fp_tasks}}
- [ ] {{task}} — {{evidence}}
{{/each}}
{{/if}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
</step>

<step name="apply_fixes" if="fix_mode">
**Auto-fix mode: update files based on validation**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 AUTO-FIX MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Fix false negatives** (code exists but unchecked):
Use Edit tool to change `- [ ]` to `- [x]` for verified tasks

**Update sprint-status.yaml:**
Use Edit tool to change status for inaccurate entries

**DO NOT auto-fix false positives** (requires implementation work)

```
✅ Auto-fix complete:
- {{fn_fixed}} false negatives checked
- {{status_fixed}} statuses updated
- {{fp_count}} false positives flagged (need manual implementation)
```
</step>

</process>

<examples>
```bash
# Validate single story (quick)
/validate scope=story target=docs/sprint-artifacts/2-5-auth.md

# Validate single story (deep - uses Haiku)
/validate scope=story target=docs/sprint-artifacts/2-5-auth.md depth=deep

# Validate all stories in epic 2
/validate scope=epic target=2

# Validate all stories in epic 2 (deep)
/validate scope=epic target=2 depth=deep

# Validate entire sprint
/validate scope=all

# Validate and auto-fix false negatives
/validate scope=all fix_mode=true
```
</examples>

<failure_handling>
**Story file not found:** Skip with warning, continue batch.
**Haiku agent fails:** Fall back to quick validation for that story.
**All stories fail:** Report systemic issue, halt.
</failure_handling>

<success_criteria>
- [ ] All target stories validated
- [ ] Categories assigned based on scores
- [ ] False positives identified
- [ ] Report generated
- [ ] Fixes applied (if fix_mode=true)
</success_criteria>
