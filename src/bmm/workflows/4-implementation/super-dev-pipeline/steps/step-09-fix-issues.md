---
name: 'step-09-fix-issues'
description: 'Fix MUST FIX and SHOULD FIX issues from review analysis'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-09-fix-issues.md'
stateFile: '{state_file}'
storyFile: '{story_file}'
reviewAnalysis: '{sprint_artifacts}/review-analysis-{story_id}.md'

# Next step
nextStep: '{workflow_path}/steps/step-10-complete.md'
---

# Step 9: Fix Issues

**Goal:** Implement fixes for MUST FIX and SHOULD FIX items identified in review analysis. Skip rejected items (gold plating already documented).

## Principles

- **Fix real problems only**: MUST FIX and SHOULD FIX categories
- **Skip rejected items**: Already documented why in step 8
- **Verify each fix**: Run tests after each fix
- **Commit incrementally**: One fix per commit for traceability

---

## Process

### 1. Load Review Analysis

```bash
# Read review analysis from step 8
review_analysis="{reviewAnalysis}"
test -f "$review_analysis" || (echo "⚠️ No review analysis found - skipping fix step" && exit 0)
```

Parse the analysis report to extract:
- MUST FIX items (count: {must_fix_count})
- SHOULD FIX items (count: {should_fix_count})
- Rejected items (for reference - DO NOT fix these)

### 2. Fix MUST FIX Items (Critical - Blocking)

**These are MANDATORY fixes - cannot proceed without fixing.**

For each MUST FIX issue:

```
🔴 Issue #{number}: {title}
   File: {file}:{line}
   Severity: CRITICAL
   Category: {category} (SECURITY | CORRECTNESS | etc.)

   Problem:
   {description}

   Fix Required:
   {recommendation}

   Estimated Time: {estimate}
```

**Fix Process:**
1. Read the file at the specified location
2. Understand the issue context
3. Implement the recommended fix
4. Add test if issue was caught by testing gap
5. Run tests to verify fix works
6. Commit the fix

```bash
# Example fix commit
git add {file}
git commit -m "fix(story-{story_id}): {issue_title}

{category}: {brief_description}

- Issue: {problem_summary}
- Fix: {fix_summary}
- Testing: {test_verification}

Addresses review finding #{number} (MUST FIX)
Related to story {story_id}"
```

**Quality Check After Each Fix:**
```bash
# Verify fix doesn't break anything
npm test

# If tests fail:
# 1. Fix the test or the code
# 2. Re-run tests
# 3. Only commit when tests pass
```

### 3. Fix SHOULD FIX Items (High Priority)

**These are important for code quality and team standards.**

For each SHOULD FIX issue:

```
🟠 Issue #{number}: {title}
   File: {file}:{line}
   Severity: HIGH
   Category: {category} (STANDARDS | MAINTAINABILITY | etc.)

   Problem:
   {description}

   Fix Required:
   {recommendation}

   Estimated Time: {estimate}
```

Same fix process as MUST FIX items, but with SHOULD FIX label in commit.

### 4. Consider CONSIDER Items (If Time/Scope Permits)

For CONSIDER items, evaluate:

```
🟡 Issue #{number}: {title}
   File: {file}:{line}
   Severity: MEDIUM

   Scope Check:
   - Is this within story scope? {yes/no}
   - Time remaining in story? {estimate}
   - Would this improve maintainability? {yes/no}

   Decision:
   [ ] FIX NOW - In scope and quick
   [ ] CREATE TECH DEBT TICKET - Out of scope
   [ ] SKIP - Not worth the effort
```

If fixing:
- Same process as SHOULD FIX
- Label as "refactor" or "improve" instead of "fix"

If creating tech debt ticket:
```markdown
# Tech Debt: {title}

**Source:** Code review finding from story {story_id}
**Priority:** Medium
**Estimated Effort:** {estimate}

**Description:**
{issue_description}

**Recommendation:**
{recommendation}

**Why Deferred:**
{reason} (e.g., out of scope, time constraints, etc.)
```

### 5. Skip REJECTED Items

**DO NOT fix rejected items.**

Display confirmation:
```
⚪ REJECTED ITEMS (Skipped):
   Total: {rejected_count}

   These findings were analyzed and rejected in step 8:
   - #{number}: {title} - {rejection_reason}
   - #{number}: {title} - {rejection_reason}

   ✅ Correctly skipped (documented as gold plating/false positives)
```

### 6. Skip OPTIONAL Items (Tech Debt Backlog)

For OPTIONAL items:
- Create tech debt tickets (if not already created)
- Do NOT implement now
- Add to project backlog

### 7. Verify All Fixes Work Together

After all fixes applied, run complete quality check:

```bash
echo "🔍 Verifying all fixes together..."

# Run full test suite
npm test

# Run type checker
npx tsc --noEmit

# Run linter
npm run lint

# Check test coverage
npm run test:coverage
```

**If any check fails:**
```
❌ Quality checks failed after fixes!

This means fixes introduced new issues.

Action required:
1. Identify which fix broke which test
2. Fix the issue
3. Re-run quality checks
4. Repeat until all checks pass

DO NOT PROCEED until all quality checks pass.
```

### 8. Summary Report

```markdown
# Fix Summary: Story {story_id}

## Issues Addressed

### 🔴 MUST FIX: {must_fix_count} issues
- [x] Issue #1: {title} - FIXED ✅
- [x] Issue #2: {title} - FIXED ✅

### 🟠 SHOULD FIX: {should_fix_count} issues
- [x] Issue #3: {title} - FIXED ✅
- [x] Issue #4: {title} - FIXED ✅

### 🟡 CONSIDER: {consider_fixed_count}/{consider_count} issues
- [x] Issue #5: {title} - FIXED ✅
- [ ] Issue #6: {title} - Tech debt ticket created

### ⚪ REJECTED: {rejected_count} items
- Correctly skipped (documented in review analysis)

### 🔵 OPTIONAL: {optional_count} items
- Tech debt tickets created
- Added to backlog

## Commits Made

Total commits: {commit_count}
- MUST FIX commits: {must_fix_commits}
- SHOULD FIX commits: {should_fix_commits}
- Other commits: {other_commits}

## Final Quality Check

✅ All tests passing: {test_count} tests
✅ Type check: No errors
✅ Linter: No violations
✅ Coverage: {coverage}%

## Time Spent

Estimated: {estimated_time}
Actual: {actual_time}
Efficiency: {efficiency_percentage}%
```

### 9. Update State

```yaml
# Update {stateFile}
current_step: 9
issues_fixed:
  must_fix: {must_fix_count}
  should_fix: {should_fix_count}
  consider: {consider_fixed_count}
  rejected: {rejected_count} (skipped - documented)
  optional: {optional_count} (tech debt created)
fixes_verified: true
all_quality_checks_passed: true
ready_for_completion: true
```

---

## Quality Gates

**BLOCKING:** Cannot proceed to step 10 until:

✅ **All MUST FIX issues resolved**
✅ **All SHOULD FIX issues resolved**
✅ **All tests passing**
✅ **Type check passing**
✅ **Linter passing**
✅ **Coverage maintained or improved**

If any gate fails:
1. Fix the issue
2. Re-run quality checks
3. Repeat until ALL PASS
4. THEN proceed to next step

---

## Skip Conditions

This step can be skipped only if:
- Review analysis (step 8) found zero issues requiring fixes
- All findings were REJECTED or OPTIONAL

Display when skipping:
```
✅ No fixes required!

Review analysis found no critical or high-priority issues.
All findings were either rejected as gold plating or marked as optional tech debt.

Proceeding to completion...
```

---

## Error Handling

**If a fix causes test failures:**
```
⚠️ Fix introduced regression!

Test failures after applying fix for: {issue_title}

Failed tests:
- {test_name_1}
- {test_name_2}

Action:
1. Review the fix - did it break existing functionality?
2. Either fix the implementation or update the tests
3. Re-run tests
4. Only proceed when tests pass
```

**If stuck on a fix:**
```
⚠️ Fix is more complex than estimated

Issue: {issue_title}
Estimated: {estimate}
Actual time spent: {actual} (exceeded estimate)

Options:
[C] Continue - Keep working on this fix
[D] Defer - Create tech debt ticket and continue
[H] Help - Request human intervention

If deferring:
- Document current progress
- Create detailed tech debt ticket
- Note blocking issues
- Continue with other fixes
```

---

## Next Step

Proceed to **Step 10: Complete + Update Status** ({nextStep})

All issues fixed, all quality checks passed. Ready to mark story as done!
