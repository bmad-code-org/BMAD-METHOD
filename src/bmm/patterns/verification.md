# Independent Verification Pattern

**Philosophy:** Trust but verify. Fresh eyes catch what familiarity misses.

## Core Principle

The person who built something should NOT validate their own work.

**Why?**
- Confirmation bias (see what you expect to see)
- Blind spots (familiar with your own code)
- Fatigue (validated while building, miss issues)

## Verification Requirements

### Fresh Context
Inspector agent has:
- ✅ No knowledge of what Builder did
- ✅ No preconceptions about implementation
- ✅ Only the story requirements as context

**This means:**
- Run all checks yourself
- Don't trust any claims
- Start from scratch

### What to Verify

**1. Files Exist**
```bash
# For each file mentioned in story tasks
ls -la {{file_path}}
# FAIL if file missing or empty
```

**2. File Contents**
- Open each file
- Check it has actual code (not just TODO/stub)
- Verify it matches story requirements

**3. Tests Exist**
```bash
find . -name "*.test.ts" -o -name "__tests__"
# FAIL if no tests found for new code
```

**4. Quality Checks Pass**

Run these yourself. Don't trust claims.

```bash
# Type check
npm run type-check
# FAIL if any errors

# Linter
npm run lint
# FAIL if any errors or warnings

# Build
npm run build
# FAIL if build fails

# Tests
npm test -- {{story_specific_tests}}
# FAIL if any tests fail
# FAIL if tests are skipped
# FAIL if coverage < 90%
```

**5. Git Status**
```bash
git status
# Check for uncommitted files
# List what was changed
```

## Verification Verdict

### PASS Criteria
All of these must be true:
- [ ] All story files exist and have content
- [ ] Type check returns 0 errors
- [ ] Linter returns 0 errors/warnings
- [ ] Build succeeds
- [ ] Tests run and pass (not skipped)
- [ ] Test coverage >= 90%
- [ ] Git status is clean or has expected changes

**If ANY checkbox is unchecked → FAIL verdict**

### PASS Output

```markdown
✅ VALIDATION PASSED

Evidence:
- Files verified: [list files checked]
- Type check: PASS (0 errors)
- Linter: PASS (0 warnings)
- Build: PASS
- Tests: 45/45 passing (95% coverage)
- Git: 12 files modified, 3 new files

Ready for code review.
```

### FAIL Output

```markdown
❌ VALIDATION FAILED

Failures:
1. File missing: app/api/occupant/agreement/route.ts
2. Type check: 3 errors in lib/api/auth.ts
3. Tests: 2 failing (api/occupant tests)

Cannot proceed to code review until these are fixed.
```

## Why This Works

**Verification is NOT rubber-stamping.**

Inspector's job is to find the truth:
- Did the work actually get done?
- Do the quality checks actually pass?
- Are the files actually there?

If something is wrong, say so with evidence.

## Anti-Patterns

**Don't do this:**
- ❌ Take Builder's word for anything
- ❌ Skip verification steps
- ❌ Assume tests pass without running them
- ❌ Give PASS verdict if ANY check fails

**Do this instead:**
- ✅ Run all checks yourself
- ✅ Provide specific evidence
- ✅ Give honest verdict
- ✅ FAIL fast if issues found

## Example: Good Verification

```markdown
## Verification Results

**File Checks:**
✅ lib/billing/payment-processor.ts (1,234 lines)
✅ lib/billing/__tests__/payment-processor.test.ts (456 lines)
✅ lib/billing/worker.ts (modified)

**Quality Checks:**
✅ Type check: PASS (0 errors)
✅ Linter: PASS (0 warnings)
✅ Build: PASS (2.3s)

**Tests:**
✅ 48/48 passing
✅ 96% coverage
✅ 0 skipped

**Git Status:**
- Modified: 1 file
- Created: 2 files
- Total: 3 files changed

**Verdict:** PASS

Ready for code review.
```

## Example: Bad Verification (Don't Do This)

```markdown
## Verification Results

Everything looks good! ✅

Builder said tests pass and I believe them.

**Verdict:** PASS
```

**What's wrong:**
- ❌ No evidence
- ❌ Trusted claims without verification
- ❌ Didn't run checks
- ❌ Rubber-stamped

## Remember

**You are the INSPECTOR. Your job is to find the truth.**

If you give a PASS verdict and later find issues, that's on you.
