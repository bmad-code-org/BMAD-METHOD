---
name: 'step-06-code-review'
description: 'Adversarial code review finding 3-10 specific issues'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/story-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-06-code-review.md'
nextStepFile: '{workflow_path}/steps/step-07-complete.md'
checklist: '{workflow_path}/checklists/code-review.md'

# Role (continue as dev, but reviewer mindset)
role: dev
requires_fresh_context: true  # In batch mode, checkpoint here for unbiased review
---

# Step 6: Code Review

## ROLE CONTINUATION - ADVERSARIAL MODE

**Continuing as DEV but switching to ADVERSARIAL REVIEWER mindset.**

You are now a critical code reviewer. Your job is to FIND PROBLEMS.
- **NEVER** say "looks good" - that's a failure
- **MUST** find 3-10 specific issues
- **FIX** every issue you find

## STEP GOAL

Perform adversarial code review:
1. Query Supabase advisors for security/performance issues
2. Identify all files changed for this story
3. Review each file against checklist
4. Find and document 3-10 issues (MANDATORY)
5. Fix all issues
6. Verify tests still pass

## MANDATORY EXECUTION RULES

### Adversarial Requirements

- **MINIMUM 3 ISSUES** - If you found fewer, look harder
- **MAXIMUM 10 ISSUES** - Prioritize if more found
- **NO "LOOKS GOOD"** - This is FORBIDDEN
- **FIX EVERYTHING** - Don't just report, fix

### Review Categories (find issues in EACH)

1. Security
2. Performance
3. Error Handling
4. Test Coverage
5. Code Quality
6. Architecture

## EXECUTION SEQUENCE

### 1. Query Supabase Advisors

Use MCP tools:

```
mcp__supabase__get_advisors:
  type: "security"

mcp__supabase__get_advisors:
  type: "performance"
```

Document any issues found.

### 2. Identify Changed Files

```bash
git status
git diff --name-only HEAD~1
```

List all files changed for story {story_id}.

### 3. Review Each Category

#### SECURITY REVIEW

For each file, check:
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Auth checks on all protected routes
- [ ] RLS policies exist and are correct
- [ ] No credential exposure (API keys, secrets)
- [ ] Input validation present
- [ ] Rate limiting considered

#### PERFORMANCE REVIEW

- [ ] No N+1 query patterns
- [ ] Indexes exist for query patterns
- [ ] No unnecessary re-renders
- [ ] Proper caching strategy
- [ ] Efficient data fetching
- [ ] Bundle size impact considered

#### ERROR HANDLING REVIEW

- [ ] Result type used consistently
- [ ] Error messages are user-friendly
- [ ] Edge cases handled
- [ ] Null/undefined checked
- [ ] Network errors handled gracefully

#### TEST COVERAGE REVIEW

- [ ] All AC have tests
- [ ] Edge cases tested
- [ ] Error paths tested
- [ ] Mocking is appropriate (not excessive)
- [ ] Tests are deterministic

#### CODE QUALITY REVIEW

- [ ] DRY - no duplicate code
- [ ] SOLID principles followed
- [ ] TypeScript strict mode compliant
- [ ] No any types
- [ ] Functions are focused (single responsibility)
- [ ] Naming is clear and consistent

#### ARCHITECTURE REVIEW

- [ ] Module boundaries respected
- [ ] Imports from index.ts only
- [ ] Server/client separation correct
- [ ] Data flow is clear
- [ ] No circular dependencies

### 4. Document All Issues

For each issue found:

```yaml
issue_{n}:
  severity: critical|high|medium|low
  category: security|performance|error-handling|testing|quality|architecture
  file: "{file_path}"
  line: {line_number}
  problem: |
    {Clear description of the issue}
  risk: |
    {What could go wrong if not fixed}
  fix: |
    {How to fix it}
```

### 5. Fix All Issues

For EACH issue documented:

1. Edit the file to fix the issue
2. Add test if issue wasn't covered
3. Verify the fix is correct
4. Mark as fixed

### 6. Run Verification

After all fixes:

```bash
npm run lint
npm run build
npm test -- --run
```

All must pass.

### 7. Create Review Report

Append to story file or create `{sprint_artifacts}/review-{story_id}.md`:

```markdown
# Code Review Report - Story {story_id}

## Summary
- Issues Found: {count}
- Issues Fixed: {count}
- Categories Reviewed: {list}

## Issues Detail

### Issue 1: {title}
- **Severity:** {severity}
- **Category:** {category}
- **File:** {file}:{line}
- **Problem:** {description}
- **Fix Applied:** {fix_description}

### Issue 2: {title}
...

## Security Checklist
- [x] RLS policies verified
- [x] No credential exposure
- [x] Input validation present

## Performance Checklist
- [x] No N+1 queries
- [x] Indexes verified

## Final Status
All issues resolved. Tests passing.

Reviewed by: DEV (adversarial)
Reviewed at: {timestamp}
```

### 8. Update Pipeline State

Update state file:
- Add `6` to `stepsCompleted`
- Set `lastStep: 6`
- Set `steps.step-06-code-review.status: completed`
- Record `issues_found` and `issues_fixed`

### 9. Present Summary and Menu

Display:
```
Code Review Complete

Issues Found: {count} (minimum 3 required)
Issues Fixed: {count}

By Category:
- Security: {count}
- Performance: {count}
- Error Handling: {count}
- Test Coverage: {count}
- Code Quality: {count}
- Architecture: {count}

All Tests: PASSING
Lint: CLEAN
Build: SUCCESS

Review Report: {report_path}
```

**Interactive Mode Menu:**
```
[C] Continue to Completion
[R] Run another review pass
[T] Run tests again
[H] Halt pipeline
```

**Batch Mode:** Auto-continue if minimum issues found and fixed

## QUALITY GATE

Before proceeding:
- [ ] Minimum 3 issues found and fixed
- [ ] All categories reviewed
- [ ] All tests still passing
- [ ] Lint clean
- [ ] Build succeeds
- [ ] Review report created

## MCP TOOLS AVAILABLE

- `mcp__supabase__get_advisors` - Security/performance checks
- `mcp__supabase__execute_sql` - Query verification

## CRITICAL STEP COMPLETION

**ONLY WHEN** [minimum 3 issues found AND all fixed AND tests pass],
load and execute `{nextStepFile}` for story completion.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- Found and fixed 3-10 issues
- All categories reviewed
- Tests still passing after fixes
- Review report complete
- No "looks good" shortcuts

### ❌ FAILURE
- Saying "looks good" or "no issues found"
- Finding fewer than 3 issues
- Not fixing issues found
- Tests failing after fixes
- Skipping review categories
