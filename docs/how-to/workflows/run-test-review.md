---
title: "How to Run Test Review with TEA"
description: Audit test quality using TEA's comprehensive knowledge base and get 0-100 scoring
---

# How to Run Test Review with TEA

Use TEA's `*test-review` workflow to audit test quality with objective scoring and actionable feedback. TEA reviews tests against its knowledge base of best practices.

## When to Use This

- Want to validate test quality objectively
- Need quality metrics for release gates
- Preparing for production deployment
- Reviewing team-written tests
- Auditing AI-generated tests
- Onboarding new team members (show good patterns)

## Prerequisites

- BMad Method installed
- TEA agent available
- Tests written (to review)
- Test framework configured

## Steps

### 1. Load TEA Agent

Start a fresh chat and load TEA:

```
*tea
```

### 2. Run the Test Review Workflow

```
*test-review
```

### 3. Specify Review Scope

TEA will ask what to review.

#### Option A: Single File

Review one test file:

```
tests/e2e/checkout.spec.ts
```

**Best for:**
- Reviewing specific failing tests
- Quick feedback on new tests
- Learning from specific examples

#### Option B: Directory

Review all tests in a directory:

```
tests/e2e/
```

**Best for:**
- Reviewing E2E test suite
- Comparing test quality across files
- Finding patterns of issues

#### Option C: Entire Suite

Review all tests:

```
tests/
```

**Best for:**
- Release gate quality check
- Comprehensive audit
- Establishing baseline metrics

### 4. Review the Quality Report

TEA generates a comprehensive quality report with scoring.

#### Report Structure (`test-review.md`):

```markdown
# Test Quality Review Report

**Date:** 2026-01-13
**Scope:** tests/e2e/
**Overall Score:** 76/100

## Summary

- **Tests Reviewed:** 12
- **Passing Quality:** 9 tests (75%)
- **Needs Improvement:** 3 tests (25%)
- **Critical Issues:** 2
- **Recommendations:** 6

## Critical Issues

### 1. Hard Waits Detected

**File:** `tests/e2e/checkout.spec.ts:45`
**Issue:** Using `page.waitForTimeout(3000)`
**Impact:** Test is flaky and unnecessarily slow
**Severity:** Critical

**Current Code:**
```typescript
await page.click('button[type="submit"]');
await page.waitForTimeout(3000);  // ❌ Hard wait
await expect(page.locator('.success')).toBeVisible();
```

**Fix:**
```typescript
await page.click('button[type="submit"]');
// Wait for the API response that triggers success message
await page.waitForResponse(resp =>
  resp.url().includes('/api/checkout') && resp.ok()
);
await expect(page.locator('.success')).toBeVisible();
```

**Why This Matters:**
- Hard waits are fixed timeouts that don't wait for actual conditions
- Tests fail intermittently on slower machines
- Wastes time waiting even when response is fast
- Network-first patterns are more reliable

---

### 2. Conditional Flow Control

**File:** `tests/e2e/profile.spec.ts:28`
**Issue:** Using if/else to handle optional elements
**Impact:** Non-deterministic test behavior
**Severity:** Critical

**Current Code:**
```typescript
if (await page.locator('.banner').isVisible()) {
  await page.click('.dismiss');
}
// ❌ Test behavior changes based on banner presence
```

**Fix:**
```typescript
// Option 1: Make banner presence deterministic
await expect(page.locator('.banner')).toBeVisible();
await page.click('.dismiss');

// Option 2: Test both scenarios separately
test('should show banner for new users', async ({ page }) => {
  // Test with banner
});

test('should not show banner for returning users', async ({ page }) => {
  // Test without banner
});
```

**Why This Matters:**
- Tests should be deterministic (same result every run)
- Conditionals hide bugs (what if banner should always show?)
- Makes debugging harder
- Violates test isolation principle

## Recommendations

### 1. Extract Repeated Setup

**File:** `tests/e2e/profile.spec.ts`
**Issue:** Login code duplicated in every test
**Severity:** Medium
**Impact:** Maintenance burden, test verbosity

**Current:**
```typescript
test('test 1', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  // Test logic...
});

test('test 2', async ({ page }) => {
  // Same login code repeated
});
```

**Fix (Vanilla Playwright):**
```typescript
// Create fixture in tests/support/fixtures/auth.ts
import { test as base, Page } from '@playwright/test';

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL(/\/dashboard/);
    await use(page);
  }
});

// Use in tests
test('test 1', async ({ authenticatedPage }) => {
  // Already logged in
});
```

**Better (With Playwright Utils):**
```typescript
// Use built-in auth-session fixture
import { test as base } from '@playwright/test';
import { createAuthFixtures } from '@seontechnologies/playwright-utils/auth-session';

export const test = base.extend(createAuthFixtures());

// Use in tests - even simpler
test('test 1', async ({ page, authToken }) => {
  // authToken already available (persisted, reused)
  await page.goto('/dashboard');
  // Already authenticated via authToken
});
```

**Playwright Utils Benefits:**
- Token persisted to disk (faster subsequent runs)
- Multi-user support out of the box
- Automatic token renewal if expired
- No manual login flow needed

---

### 2. Add Network Assertions

**File:** `tests/e2e/api-calls.spec.ts`
**Issue:** No verification of API responses
**Severity:** Low
**Impact:** Tests don't catch API errors

**Current:**
```typescript
await page.click('button[name="save"]');
await expect(page.locator('.success')).toBeVisible();
// ❌ What if API returned 500 but UI shows cached success?
```

**Enhancement:**
```typescript
const responsePromise = page.waitForResponse(
  resp => resp.url().includes('/api/profile') && resp.status() === 200
);
await page.click('button[name="save"]');
const response = await responsePromise;

// Verify API response
const data = await response.json();
expect(data.success).toBe(true);

// Verify UI
await expect(page.locator('.success')).toBeVisible();
```

---

### 3. Improve Test Names

**File:** `tests/e2e/checkout.spec.ts`
**Issue:** Vague test names
**Severity:** Low
**Impact:** Hard to understand test purpose

**Current:**
```typescript
test('should work', async ({ page }) => { });
test('test checkout', async ({ page }) => { });
```

**Better:**
```typescript
test('should complete checkout with valid credit card', async ({ page }) => { });
test('should show validation error for expired card', async ({ page }) => { });
```

## Quality Scores by Category

| Category | Score | Target | Status |
|----------|-------|--------|--------|
| **Determinism** | 26/35 | 30/35 | ⚠️ Needs Improvement |
| **Isolation** | 22/25 | 20/25 | ✅ Good |
| **Assertions** | 18/20 | 16/20 | ✅ Good |
| **Structure** | 7/10 | 8/10 | ⚠️ Minor Issues |
| **Performance** | 3/10 | 8/10 | ❌ Critical |

### Scoring Breakdown

**Determinism (35 points max):**
- No hard waits: 0/10 ❌ (found 3 instances)
- No conditionals: 8/10 ⚠️ (found 2 instances)
- No try-catch flow control: 10/10 ✅
- Network-first patterns: 8/15 ⚠️ (some tests missing)

**Isolation (25 points max):**
- Self-cleaning: 20/20 ✅
- No global state: 5/5 ✅
- Parallel-safe: 0/0 ✅ (not tested)

**Assertions (20 points max):**
- Explicit in test body: 15/15 ✅
- Specific and meaningful: 3/5 ⚠️ (some weak assertions)

**Structure (10 points max):**
- Test size < 300 lines: 5/5 ✅
- Clear names: 2/5 ⚠️ (some vague names)

**Performance (10 points max):**
- Execution time < 1.5 min: 3/10 ❌ (3 tests exceed limit)

## Files Reviewed

| File | Score | Issues | Status |
|------|-------|--------|--------|
| `tests/e2e/checkout.spec.ts` | 65/100 | 4 | ❌ Needs Work |
| `tests/e2e/profile.spec.ts` | 72/100 | 3 | ⚠️ Needs Improvement |
| `tests/e2e/search.spec.ts` | 88/100 | 1 | ✅ Good |
| `tests/api/profile.spec.ts` | 92/100 | 0 | ✅ Excellent |

## Next Steps

### Immediate (Fix Critical Issues)
1. Remove hard waits in `checkout.spec.ts` (line 45, 67, 89)
2. Fix conditional in `profile.spec.ts` (line 28)
3. Optimize slow tests in `checkout.spec.ts`

### Short-term (Apply Recommendations)
4. Extract login fixture from `profile.spec.ts`
5. Add network assertions to `api-calls.spec.ts`
6. Improve test names in `checkout.spec.ts`

### Long-term (Continuous Improvement)
7. Re-run `*test-review` after fixes (target: 85/100)
8. Add performance budgets to CI
9. Document test patterns for team

## Knowledge Base References

TEA reviewed against these patterns:
- [test-quality.md](/docs/reference/tea/knowledge-base.md#test-quality) - Execution limits, isolation
- [network-first.md](/docs/reference/tea/knowledge-base.md#network-first) - Deterministic waits
- [timing-debugging.md](/docs/reference/tea/knowledge-base.md#timing-debugging) - Race conditions
- [selector-resilience.md](/docs/reference/tea/knowledge-base.md#selector-resilience) - Robust selectors
```

## Understanding the Scores

### What Do Scores Mean?

| Score Range | Interpretation | Action |
|-------------|----------------|--------|
| **90-100** | Excellent | Minimal changes needed, production-ready |
| **80-89** | Good | Minor improvements recommended |
| **70-79** | Acceptable | Address recommendations before release |
| **60-69** | Needs Improvement | Fix critical issues, apply recommendations |
| **< 60** | Critical | Significant refactoring needed |

### Scoring Criteria

**Determinism (35 points):**
- Tests produce same result every run
- No random failures (flakiness)
- No environment-dependent behavior

**Isolation (25 points):**
- Tests don't depend on each other
- Can run in any order
- Clean up after themselves

**Assertions (20 points):**
- Verify actual behavior
- Specific and meaningful
- Not abstracted away in helpers

**Structure (10 points):**
- Readable and maintainable
- Appropriate size
- Clear naming

**Performance (10 points):**
- Fast execution
- Efficient selectors
- No unnecessary waits

## What You Get

### Quality Report
- Overall score (0-100)
- Category scores (Determinism, Isolation, etc.)
- File-by-file breakdown

### Critical Issues
- Specific line numbers
- Code examples (current vs fixed)
- Why it matters explanation
- Impact assessment

### Recommendations
- Actionable improvements
- Code examples
- Priority/severity levels

### Next Steps
- Immediate actions (fix critical)
- Short-term improvements
- Long-term quality goals

## Tips

### Review Before Release

Make test review part of release checklist:

```markdown
## Release Checklist
- [ ] All tests passing
- [ ] Test review score > 80
- [ ] Critical issues resolved
- [ ] Performance within budget
```

### Review After AI Generation

Always review AI-generated tests:

```
1. Run *atdd or *automate
2. Run *test-review on generated tests
3. Fix critical issues
4. Commit tests
```

### Set Quality Gates

Use scores as quality gates:

```yaml
# .github/workflows/test.yml
- name: Review test quality
  run: |
    # Run test review
    # Parse score from report
    if [ $SCORE -lt 80 ]; then
      echo "Test quality below threshold"
      exit 1
    fi
```

### Review Regularly

Schedule periodic reviews:

- **Per story:** Optional (spot check new tests)
- **Per epic:** Recommended (ensure consistency)
- **Per release:** Recommended for quality gates (required if using formal gate process)
- **Quarterly:** Audit entire suite

### Focus Reviews

For large suites, review incrementally:

**Week 1:** Review E2E tests
**Week 2:** Review API tests
**Week 3:** Review component tests (Cypress CT or Vitest)
**Week 4:** Apply fixes across all suites

**Component Testing Note:** TEA reviews component tests using framework-specific knowledge:
- **Cypress:** Reviews Cypress Component Testing specs (*.cy.tsx)
- **Playwright:** Reviews Vitest component tests (*.test.tsx)

### Use Reviews for Learning

Share reports with team:

```
Team Meeting:
- Review test-review.md
- Discuss critical issues
- Agree on patterns
- Update team guidelines
```

### Compare Over Time

Track improvement:

```markdown
## Quality Trend

| Date | Score | Critical Issues | Notes |
|------|-------|-----------------|-------|
| 2026-01-01 | 65 | 5 | Baseline |
| 2026-01-15 | 72 | 2 | Fixed hard waits |
| 2026-02-01 | 84 | 0 | All critical resolved |
```

## Common Issues

### Low Determinism Score

**Symptoms:**
- Tests fail randomly
- "Works on my machine"
- CI failures that don't reproduce locally

**Common Causes:**
- Hard waits (`waitForTimeout`)
- Conditional flow control (`if/else`)
- Try-catch for flow control
- Missing network-first patterns

**Fix:** Review determinism section, apply network-first patterns

### Low Performance Score

**Symptoms:**
- Tests take > 1.5 minutes each
- Test suite takes hours
- CI times out

**Common Causes:**
- Unnecessary waits (hard timeouts)
- Inefficient selectors (XPath, complex CSS)
- Not using parallelization
- Heavy setup in every test

**Fix:** Optimize waits, improve selectors, use fixtures

### Low Isolation Score

**Symptoms:**
- Tests fail when run in different order
- Tests fail in parallel
- Test data conflicts

**Common Causes:**
- Shared global state
- Tests don't clean up
- Hard-coded test data
- Database not reset between tests

**Fix:** Use fixtures, clean up in afterEach, use unique test data

### "Too Many Issues to Fix"

**Problem:** Report shows 50+ issues, overwhelming.

**Solution:** Prioritize:
1. Fix all critical issues first
2. Apply top 3 recommendations
3. Re-run review
4. Iterate

Don't try to fix everything at once.

### Reviews Take Too Long

**Problem:** Reviewing entire suite takes hours.

**Solution:** Review incrementally:
- Review new tests in PR review
- Schedule directory reviews weekly
- Full suite review quarterly

## Related Guides

- [How to Run ATDD](/docs/how-to/workflows/run-atdd.md) - Generate tests to review
- [How to Run Automate](/docs/how-to/workflows/run-automate.md) - Expand coverage to review
- [How to Run Trace](/docs/how-to/workflows/run-trace.md) - Coverage complements quality

## Understanding the Concepts

- [Test Quality Standards](/docs/explanation/tea/test-quality-standards.md) - What makes tests good
- [Network-First Patterns](/docs/explanation/tea/network-first-patterns.md) - Avoiding flakiness
- [Fixture Architecture](/docs/explanation/tea/fixture-architecture.md) - Reusable patterns

## Reference

- [Command: *test-review](/docs/reference/tea/commands.md#test-review) - Full command reference
- [Knowledge Base Index](/docs/reference/tea/knowledge-base.md) - Patterns TEA reviews against

---

Generated with [BMad Method](https://bmad-method.org) - TEA (Test Architect)
