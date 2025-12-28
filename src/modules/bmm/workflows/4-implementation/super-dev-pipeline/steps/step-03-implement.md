---
name: 'step-03-implement'
description: 'Adaptive implementation - TDD for greenfield, refactor for brownfield, no vibe coding'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-03-implement.md'
nextStepFile: '{workflow_path}/steps/step-04-post-validation.md'

# Role Continue
role: dev
---

# Step 3: Implement Story

## ROLE CONTINUATION

**Continuing as DEV (Developer) perspective.**

You are now implementing the story tasks with adaptive methodology based on development type.

## STEP GOAL

Implement all unchecked tasks using appropriate methodology:
1. **Greenfield**: TDD approach (write tests first, then implement)
2. **Brownfield**: Refactor approach (understand existing, modify carefully)
3. **Hybrid**: Mix both approaches as appropriate per task

## MANDATORY EXECUTION RULES

### Implementation Principles

- **ONE TASK AT A TIME** - Never batch multiple tasks
- **RUN TESTS FREQUENTLY** - After each significant change
- **FOLLOW PROJECT PATTERNS** - Never invent new patterns
- **NO VIBE CODING** - Follow the sequence exactly
- **VERIFY EACH TASK** - Check works before moving to next

### Adaptive Methodology

**For Greenfield tasks (new files):**
1. Write test first (if applicable)
2. Implement minimal code to pass
3. Verify test passes
4. Move to next task

**For Brownfield tasks (existing files):**
1. Read and understand existing code
2. Write test for new behavior (if applicable)
3. Modify existing code carefully
4. Verify all tests pass (old and new)
5. Move to next task

## EXECUTION SEQUENCE

### 1. Review Refined Tasks

Load story file and get all unchecked tasks (from pre-gap analysis).

Display:
```
Implementation Plan

Total tasks: {unchecked_count}

Development breakdown:
- Greenfield tasks: {new_file_tasks}
- Brownfield tasks: {existing_file_tasks}
- Test tasks: {test_tasks}
- Database tasks: {db_tasks}

Starting implementation loop...
```

### 2. Implementation Loop

**For EACH unchecked task:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Task {n}/{total}: {task_description}
Type: {greenfield|brownfield}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**A. Identify File(s) Affected:**
- New file to create?
- Existing file to modify?
- Test file to add/update?
- Migration file to create?

**B. For NEW FILES (Greenfield):**

```
1. Determine file path and structure
2. Identify dependencies needed
3. Write test first (if applicable):
   - Create test file
   - Write failing test
   - Run test, confirm RED

4. Implement code:
   - Create file
   - Add minimal implementation
   - Follow project patterns from project-context.md

5. Run test:
   npm test -- --run
   Confirm GREEN

6. Verify:
   - File created
   - Exports correct
   - Test passes
```

**C. For EXISTING FILES (Brownfield):**

```
1. Read existing file completely
2. Understand current implementation
3. Identify where to make changes
4. Check if tests exist for this file

5. Add test for new behavior (if applicable):
   - Find or create test file
   - Add test for new/changed behavior
   - Run test, may fail or pass depending on change

6. Modify existing code:
   - Make minimal changes
   - Preserve existing functionality
   - Follow established patterns in the file
   - Don't refactor unrelated code

7. Run ALL tests (not just new ones):
   npm test -- --run
   Confirm all tests pass

8. Verify:
   - Changes made as planned
   - No regressions (all old tests pass)
   - New behavior works (new tests pass)
```

**D. For DATABASE TASKS:**

```
1. Create migration file:
   npx supabase migration new {description}

2. Write migration SQL:
   - Create/alter tables
   - Add RLS policies
   - Add indexes

3. Apply migration:
   npx supabase db push

4. Verify schema:
   mcp__supabase__list_tables
   Confirm changes applied

5. Generate types:
   npx supabase gen types typescript --local
```

**E. For TEST TASKS:**

```
1. Identify what to test
2. Find or create test file
3. Write test with clear assertions
4. Run test:
   npm test -- --run --grep "{test_name}"

5. Verify test is meaningful (not placeholder)
```

**F. Check Task Complete:**

After implementing task, verify:
- [ ] Code exists where expected
- [ ] Tests pass
- [ ] No TypeScript errors
- [ ] Follows project patterns

**Mark task complete in story file:**
```markdown
- [x] {task_description}
```

**Update state file with progress.**

### 3. Handle Errors Gracefully

**If implementation fails:**

```
⚠️ Task failed: {task_description}

Error: {error_message}

Options:
1. Debug and retry
2. Skip and document blocker
3. Simplify approach

DO NOT vibe code or guess!
Follow error systematically.
```

### 4. Run Full Test Suite

After ALL tasks completed:

```bash
npm test -- --run
npm run lint
npm run build
```

**All must pass before proceeding.**

### 5. Verify Task Completion

Re-read story file and count:
- Tasks completed this session: {count}
- Tasks remaining: {should be 0}
- All checked: {should be true}

### 6. Update Pipeline State

Update state file:
- Add `3` to `stepsCompleted`
- Set `lastStep: 3`
- Set `steps.step-03-implement.status: completed`
- Record:
  ```yaml
  implementation:
    files_created: {count}
    files_modified: {count}
    migrations_applied: {count}
    tests_added: {count}
    tasks_completed: {count}
  ```

### 7. Display Summary

```
Implementation Complete

Tasks Completed: {completed_count}

Files:
- Created: {created_files}
- Modified: {modified_files}

Migrations:
- {migration_1}
- {migration_2}

Tests:
- All passing: {pass_count}/{total_count}
- New tests added: {new_test_count}

Build Status:
- Lint: ✓ Clean
- TypeScript: ✓ No errors
- Build: ✓ Success

Ready for Post-Validation
```

**Interactive Mode Menu:**
```
[C] Continue to Post-Validation
[T] Run tests again
[B] Run build again
[H] Halt pipeline
```

**Batch Mode:** Auto-continue

## QUALITY GATE

Before proceeding:
- [ ] All unchecked tasks completed
- [ ] All tests pass
- [ ] Lint clean
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] Followed project patterns
- [ ] **No vibe coding occurred**

## CRITICAL STEP COMPLETION

**ONLY WHEN** [all tasks complete AND all tests pass AND lint clean AND build succeeds],
load and execute `{nextStepFile}` for post-validation.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- All tasks implemented one at a time
- Tests pass for each task
- Brownfield code modified carefully
- No regressions introduced
- Project patterns followed
- Build and lint clean
- **Disciplined execution maintained**

### ❌ FAILURE
- Vibe coding (guessing implementation)
- Batching multiple tasks
- Not running tests per task
- Breaking existing functionality
- Inventing new patterns
- Skipping verification
- **Deviating from step sequence**

## ANTI-VIBE-CODING ENFORCEMENT

This step enforces discipline by:

1. **One task at a time** - Can't batch or optimize
2. **Test after each task** - Immediate verification
3. **Follow existing patterns** - No invention
4. **Brownfield awareness** - Read existing code first
5. **Frequent verification** - Run tests, lint, build

**Even at 200K tokens, you MUST:**
- ✅ Implement ONE task
- ✅ Run tests
- ✅ Verify it works
- ✅ Mark task complete
- ✅ Move to next task

**NO shortcuts. NO optimization. NO vibe coding.**
