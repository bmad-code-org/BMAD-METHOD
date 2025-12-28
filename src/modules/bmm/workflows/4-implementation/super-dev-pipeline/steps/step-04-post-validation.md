---
name: 'step-04-post-validation'
description: 'Verify completed tasks against codebase reality (catch false positives)'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-04-post-validation.md'
nextStepFile: '{workflow_path}/steps/step-05-code-review.md'
prevStepFile: '{workflow_path}/steps/step-03-implement.md'

# Role Switch
role: dev
requires_fresh_context: false  # Continue from implementation context
---

# Step 5b: Post-Implementation Validation

## ROLE CONTINUATION - VERIFICATION MODE

**Continuing as DEV but switching to VERIFICATION mindset.**

You are now verifying that completed work actually exists in the codebase.
This catches the common problem of tasks marked [x] but implementation is incomplete.

## STEP GOAL

Verify all completed tasks against codebase reality:
1. Re-read story file and extract completed tasks
2. For each completed task, identify what should exist
3. Use codebase search tools to verify existence
4. Run tests to verify they actually pass
5. Identify false positives (marked done but not actually done)
6. If gaps found, uncheck tasks and add missing work
7. Re-run implementation if needed

## MANDATORY EXECUTION RULES

### Verification Principles

- **TRUST NOTHING** - Verify every completed task
- **CHECK EXISTENCE** - Files, functions, components must exist
- **CHECK COMPLETENESS** - Not just existence, but full implementation
- **TEST VERIFICATION** - Claimed test coverage must be real
- **NO ASSUMPTIONS** - Re-scan the codebase with fresh eyes

### What to Verify

For each task marked [x]:
- Files mentioned exist at correct paths
- Functions/components declared and exported
- Tests exist and actually pass
- Database migrations applied
- API endpoints respond correctly

## EXECUTION SEQUENCE

### 1. Load Story and Extract Completed Tasks

Load story file: `{story_file}`

Extract all tasks from story that are marked [x]:
```regex
- \[x\] (.+)
```

Build list of `completed_tasks` to verify.

### 2. Categorize Tasks by Type

For each completed task, determine what needs verification:

**File Creation Tasks:**
- Pattern: "Create {file_path}"
- Verify: File exists at path

**Component/Function Tasks:**
- Pattern: "Add {name} function/component"
- Verify: Symbol exists and is exported

**Test Tasks:**
- Pattern: "Add test for {feature}"
- Verify: Test file exists and test passes

**Database Tasks:**
- Pattern: "Add {table} table", "Create migration"
- Verify: Migration file exists, schema matches

**API Tasks:**
- Pattern: "Create {endpoint} endpoint"
- Verify: Route file exists, handler implemented

**UI Tasks:**
- Pattern: "Add {element} to UI"
- Verify: Component has data-testid attribute

### 3. Verify File Existence

For all file-related tasks:

```bash
# Use Glob to find files
glob: "**/{mentioned_filename}"
```

**Check:**
- [ ] File exists
- [ ] File is not empty
- [ ] File has expected exports

**False Positive Indicators:**
- File doesn't exist
- File exists but is empty
- File exists but missing expected symbols

### 4. Verify Function/Component Implementation

For code implementation tasks:

```bash
# Use Grep to find symbols
grep: "{function_name|component_name}"
  glob: "**/*.{ts,tsx}"
  output_mode: "content"
```

**Check:**
- [ ] Symbol is declared
- [ ] Symbol is exported
- [ ] Implementation is not a stub/placeholder
- [ ] Required logic is present

**False Positive Indicators:**
- Symbol not found
- Symbol exists but marked TODO
- Symbol exists but throws "Not implemented"
- Symbol exists but returns empty/null

### 5. Verify Test Coverage

For all test-related tasks:

```bash
# Find test files
glob: "**/*.test.{ts,tsx}"
glob: "**/*.spec.{ts,tsx}"

# Run specific tests
npm test -- --run --grep "{feature_name}"
```

**Check:**
- [ ] Test file exists
- [ ] Test describes the feature
- [ ] Test actually runs (not skipped)
- [ ] Test passes (GREEN)

**False Positive Indicators:**
- No test file found
- Test exists but skipped (it.skip)
- Test exists but fails
- Test exists but doesn't test the feature (placeholder)

### 6. Verify Database Changes

For database migration tasks:

```bash
# Find migration files
glob: "**/migrations/*.sql"

# Check Supabase schema
mcp__supabase__list_tables
```

**Check:**
- [ ] Migration file exists
- [ ] Migration has been applied
- [ ] Table/column exists in schema
- [ ] RLS policies are present

**False Positive Indicators:**
- Migration file missing
- Migration not applied to database
- Table/column doesn't exist
- RLS policies missing

### 7. Verify API Endpoints

For API endpoint tasks:

```bash
# Find route files
glob: "**/app/api/**/{endpoint}/route.ts"
grep: "export async function {METHOD}"
```

**Check:**
- [ ] Route file exists
- [ ] Handler function implemented
- [ ] Returns proper Response type
- [ ] Error handling present

**False Positive Indicators:**
- Route file doesn't exist
- Handler throws "Not implemented"
- Handler returns stub response

### 8. Run Full Verification

Execute verification for ALL completed tasks:

```typescript
interface VerificationResult {
  task: string;
  status: "verified" | "false_positive";
  evidence: string;
  missing?: string;
}

const results: VerificationResult[] = [];

for (const task of completed_tasks) {
  const result = await verifyTask(task);
  results.push(result);
}
```

### 9. Analyze Verification Results

Count results:
```
Total Verified: {verified_count}
False Positives: {false_positive_count}
```

### 10. Handle False Positives

**IF false positives found (count > 0):**

Display:
```
⚠️ POST-IMPLEMENTATION GAPS DETECTED

Tasks marked complete but implementation incomplete:

{for each false_positive}
- [ ] {task_description}
  Missing: {what_is_missing}
  Evidence: {grep/glob results}

{add new tasks for missing work}
- [ ] Actually implement {missing_part}
```

**Actions:**
1. Uncheck false positive tasks in story file
2. Add new tasks for the missing work
3. Update "Gap Analysis" section in story
4. Set state to re-run implementation

**Re-run implementation:**
```
Detected {false_positive_count} incomplete tasks.
Re-running Step 5: Implementation to complete missing work...

{load and execute step-05-implement.md}
```

After re-implementation, **RE-RUN THIS STEP** (step-05b-post-validation.md)

### 11. Handle Verified Success

**IF no false positives (all verified):**

Display:
```
✅ POST-IMPLEMENTATION VALIDATION PASSED

All {verified_count} completed tasks verified against codebase:
- Files exist and are complete
- Functions/components implemented
- Tests exist and pass
- Database changes applied
- API endpoints functional

Ready for Code Review
```

Update story file "Gap Analysis" section:
```markdown
## Gap Analysis

### Post-Implementation Validation
- **Date:** {timestamp}
- **Tasks Verified:** {verified_count}
- **False Positives:** 0
- **Status:** ✅ All work verified complete

**Verification Evidence:**
{for each verified task}
- ✅ {task}: {evidence}
```

### 12. Update Pipeline State

Update state file:
- Add `5b` to `stepsCompleted`
- Set `lastStep: 5b`
- Set `steps.step-05b-post-validation.status: completed`
- Record verification results:
  ```yaml
  verification:
    tasks_verified: {count}
    false_positives: {count}
    re_implementation_required: {true|false}
  ```

### 13. Present Summary and Menu

Display:
```
Post-Implementation Validation Complete

Verification Summary:
- Tasks Checked: {total_count}
- Verified Complete: {verified_count}
- False Positives: {false_positive_count}
- Re-implementations: {retry_count}

{if false_positives}
Re-running implementation to complete missing work...
{else}
All work verified. Proceeding to Code Review...
{endif}
```

**Interactive Mode Menu (only if no false positives):**
```
[C] Continue to Code Review
[V] Run verification again
[T] Run tests again
[H] Halt pipeline
```

**Batch Mode:**
- Auto re-run implementation if false positives
- Auto-continue if all verified

## QUALITY GATE

Before proceeding to code review:
- [ ] All completed tasks verified against codebase
- [ ] Zero false positives remaining
- [ ] All tests still passing
- [ ] Build still succeeds
- [ ] Gap analysis updated with verification results

## VERIFICATION TOOLS

Use these tools for verification:

```typescript
// File existence
glob("{pattern}")

// Symbol search
grep("{symbol_name}", { glob: "**/*.{ts,tsx}", output_mode: "content" })

// Test execution
bash("npm test -- --run --grep '{test_name}'")

// Database check
mcp__supabase__list_tables()

// Read file contents
read("{file_path}")
```

## CRITICAL STEP COMPLETION

**ONLY WHEN** [all tasks verified AND zero false positives],
load and execute `{nextStepFile}` for code review.

**IF** [false positives detected],
load and execute `{prevStepFile}` to complete missing work,
then RE-RUN this step.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- All completed tasks verified against codebase
- No false positives (or all re-implemented)
- Tests still passing
- Evidence documented for each task
- Gap analysis updated

### ❌ FAILURE
- Skipping verification ("trust the marks")
- Not checking actual code existence
- Not running tests to verify claims
- Allowing false positives to proceed
- Not documenting verification evidence

## COMMON FALSE POSITIVE PATTERNS

Watch for these common issues:

1. **Stub Implementations**
   - Function exists but returns `null`
   - Function throws "Not implemented"
   - Component returns empty div

2. **Placeholder Tests**
   - Test exists but skipped (it.skip)
   - Test doesn't actually test the feature
   - Test always passes (no assertions)

3. **Incomplete Files**
   - File created but empty
   - Missing required exports
   - TODO comments everywhere

4. **Database Drift**
   - Migration file exists but not applied
   - Schema doesn't match migration
   - RLS policies missing

5. **API Stubs**
   - Route exists but returns 501
   - Handler not implemented
   - No error handling

This step is the **safety net** that catches incomplete work before code review.
