---
name: 'step-06-run-quality-checks'
description: 'Run tests, type checks, and linter - fix all problems before code review'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-06-run-quality-checks.md'
stateFile: '{state_file}'
storyFile: '{story_file}'

# Next step
nextStep: '{workflow_path}/steps/step-07-code-review.md'
---

# Step 6: Run Quality Checks

**Goal:** Verify implementation quality through automated checks: tests, type checking, and linting. Fix ALL problems before proceeding to human/AI code review.

## Why Automate First?

1. **Fast feedback**: Automated checks run in seconds
2. **Catch obvious issues**: Type errors, lint violations, failing tests
3. **Save review time**: Don't waste code review time on mechanical issues
4. **Enforce standards**: Consistent code style and quality

## Principles

- **Zero tolerance**: ALL checks must pass
- **Fix, don't skip**: If a check fails, fix it - don't disable the check
- **Iterate quickly**: Run-fix-run loop until all green
- **Document workarounds**: If you must suppress a check, document why

---

## Process

### 1. Run Test Suite

```bash
echo "📋 Running test suite..."

# Run all tests
npm test

# Or for other stacks:
# pytest
# dotnet test
# mvn test
# cargo test
```

**Expected output:**
```
✅ PASS  __tests__/components/UserDashboard.test.tsx
  UserDashboard
    AC1: Display user profile information
      ✓ should render user name (12ms)
      ✓ should render user email (8ms)
      ✓ should render user avatar (6ms)
    AC2: Allow user to edit profile
      ✓ should show edit button when not in edit mode (10ms)
      ✓ should enable edit mode when edit button clicked (15ms)
      ✓ should save changes when save button clicked (22ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Time:        2.134s
```

**If tests fail:**
```
❌ Test failures detected!

Failed tests:
  - UserDashboard › AC2 › should save changes when save button clicked
    Expected: { name: 'Jane Doe', email: 'john@example.com' }
    Received: undefined

Action required:
1. Analyze the failure
2. Fix the implementation
3. Re-run tests
4. Repeat until all tests pass

DO NOT PROCEED until all tests pass.
```

### 2. Check Test Coverage

```bash
echo "📊 Checking test coverage..."

# Generate coverage report
npm run test:coverage

# Or for other stacks:
# pytest --cov
# dotnet test /p:CollectCoverage=true
# cargo tarpaulin
```

**Minimum coverage thresholds:**
```yaml
Line Coverage: ≥80%
Branch Coverage: ≥75%
Function Coverage: ≥80%
Statement Coverage: ≥80%
```

**If coverage is low:**
```
⚠️ Test coverage below threshold!

Current coverage:
  Lines: 72% (threshold: 80%)
  Branches: 68% (threshold: 75%)
  Functions: 85% (threshold: 80%)

Uncovered areas:
  - src/components/UserDashboard.tsx: lines 45-52 (error handling)
  - src/services/userService.ts: lines 23-28 (edge case)

Action required:
1. Add tests for uncovered code paths
2. Re-run coverage check
3. Achieve ≥80% coverage before proceeding
```

### 3. Run Type Checker

```bash
echo "🔍 Running type checker..."

# For TypeScript
npx tsc --noEmit

# For Python
# mypy src/

# For C#
# dotnet build

# For Java
# mvn compile
```

**Expected output:**
```
✅ No type errors found
```

**If type errors found:**
```
❌ Type errors detected!

src/components/UserDashboard.tsx:45:12 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.

45     onSave(user.name);
              ~~~~~~~~~

src/services/userService.ts:23:18 - error TS2339: Property 'id' does not exist on type 'User'.

23     return user.id;
                   ~~

Found 2 errors in 2 files.

Action required:
1. Fix type errors
2. Re-run type checker
3. Repeat until zero errors

DO NOT PROCEED with type errors.
```

### 4. Run Linter

```bash
echo "✨ Running linter..."

# For JavaScript/TypeScript
npm run lint

# For Python
# pylint src/

# For C#
# dotnet format --verify-no-changes

# For Java
# mvn checkstyle:check
```

**Expected output:**
```
✅ No linting errors found
```

**If lint errors found:**
```
❌ Lint errors detected!

src/components/UserDashboard.tsx
  45:1   error  'useState' is not defined  no-undef
  52:12  error  Unexpected console statement  no-console
  67:5   warning  Unexpected var, use let or const instead  no-var

src/services/userService.ts
  23:1   error  Missing return type on function  @typescript-eslint/explicit-function-return-type

✖ 4 problems (3 errors, 1 warning)

Action required:
1. Run auto-fix if available: npm run lint:fix
2. Manually fix remaining errors
3. Re-run linter
4. Repeat until zero errors and zero warnings

DO NOT PROCEED with lint errors.
```

### 5. Auto-Fix What's Possible

```bash
echo "🔧 Attempting auto-fixes..."

# Run formatters and auto-fixable linters
npm run lint:fix
npm run format

# Stage the auto-fixes
git add .
```

### 6. Manual Fixes

For issues that can't be auto-fixed:

```typescript
// Example: Fix type error
// Before:
const userName = user.name; // Type error if name is optional
onSave(userName);

// After:
const userName = user.name ?? ''; // Handle undefined case
onSave(userName);
```

```typescript
// Example: Fix lint error
// Before:
var count = 0; // ESLint: no-var

// After:
let count = 0; // Use let instead of var
```

### 7. Verify All Checks Pass

Run everything again to confirm:

```bash
echo "✅ Final verification..."

# Run all checks
npm test && \
  npx tsc --noEmit && \
  npm run lint

echo "✅ ALL QUALITY CHECKS PASSED!"
```

### 8. Commit Quality Fixes

```bash
# Only if fixes were needed
if git diff --cached --quiet; then
  echo "No fixes needed - all checks passed first time!"
else
  git commit -m "fix(story-{story_id}): address quality check issues

- Fix type errors
- Resolve lint violations
- Improve test coverage to {coverage}%

All automated checks now passing:
✅ Tests: {test_count} passed
✅ Type check: No errors
✅ Linter: No violations
✅ Coverage: {coverage}%"
fi
```

### 9. Update State

```yaml
# Update {stateFile}
current_step: 6
quality_checks:
  tests_passed: true
  test_count: {test_count}
  coverage: {coverage}%
  type_check_passed: true
  lint_passed: true
  all_checks_passed: true
ready_for_code_review: true
```

---

## Quality Gate

**CRITICAL:** This is a **BLOCKING STEP**. You **MUST NOT** proceed to code review until ALL of the following pass:

✅ **All tests passing** (0 failures)
✅ **Test coverage ≥80%** (or project threshold)
✅ **Zero type errors**
✅ **Zero lint errors**
✅ **Zero lint warnings** (or all warnings justified and documented)

If ANY check fails:
1. Fix the issue
2. Re-run all checks
3. Repeat until ALL PASS
4. THEN proceed to next step

---

## Troubleshooting

**Tests fail sporadically:**
- Check for test interdependencies
- Look for timing issues (use `waitFor` in async tests)
- Check for environment-specific issues

**Type errors in third-party libraries:**
- Install `@types` packages
- Use type assertions carefully (document why)
- Consider updating library versions

**Lint rules conflict with team standards:**
- Discuss with team before changing config
- Document exceptions in comments
- Update lint config if truly inappropriate

**Coverage can't reach 80%:**
- Focus on critical paths first
- Test error cases and edge cases
- Consider if untested code is actually needed

---

## Skip Conditions

This step CANNOT be skipped. All stories must pass quality checks.

The only exception: Documentation-only stories with zero code changes.

---

## Next Step

Proceed to **Step 7: Code Review** ({nextStep})

Now that all automated checks pass, the code is ready for human/AI review.
