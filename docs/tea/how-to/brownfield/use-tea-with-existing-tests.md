---
title: "Using TEA with Existing Tests (Brownfield)"
description: Apply TEA workflows to legacy codebases with existing test suites
---

# Using TEA with Existing Tests (Brownfield)

Use TEA on brownfield projects (existing codebases with legacy tests) to establish coverage baselines, identify gaps, and improve test quality without starting from scratch.

## When to Use This

- Existing codebase with some tests already written
- Legacy test suite needs quality improvement
- Adding features to existing application
- Need to understand current test coverage
- Want to prevent regression as you add features

## Prerequisites

- BMad Method installed
- TEA agent available
- Existing codebase with tests (even if incomplete or low quality)
- Tests run successfully (or at least can be executed)

**Note:** If your codebase is completely undocumented, run `document-project` first to create baseline documentation.

## Brownfield Strategy

### Phase 1: Establish Baseline

Understand what you have before changing anything.

#### Step 1: Baseline Coverage with `trace`

Run `trace` Phase 1 to map existing tests to requirements:

```
trace
```

**Select:** Phase 1 (Requirements Traceability)

**Provide:**
- Existing requirements docs (PRD, user stories, feature specs)
- Test location (`tests/` or wherever tests live)
- Focus areas (specific features if large codebase)

**Output:** `traceability-matrix.md` showing:
- Which requirements have tests
- Which requirements lack coverage
- Coverage classification (FULL/PARTIAL/NONE)
- Gap prioritization

**Example Baseline:**
```markdown
# Baseline Coverage (Before Improvements)

**Total Requirements:** 50
**Full Coverage:** 15 (30%)
**Partial Coverage:** 20 (40%)
**No Coverage:** 15 (30%)

**By Priority:**
- P0: 50% coverage (5/10) ❌ Critical gap
- P1: 40% coverage (8/20) ⚠️ Needs improvement
- P2: 20% coverage (2/10) ✅ Acceptable
```

This baseline becomes your improvement target.

#### Step 2: Quality Audit with `test-review`

Run `test-review` on existing tests:

```
test-review tests/
```

**Output:** `test-review.md` with quality score and issues.

**Common Brownfield Issues:**
- Hard waits everywhere (`page.waitForTimeout(5000)`)
- Fragile CSS selectors (`.class > div:nth-child(3)`)
- No test isolation (tests depend on execution order)
- Try-catch for flow control
- Tests don't clean up (leave test data in DB)

**Example Baseline Quality:**
```markdown
# Quality Score: 55/100

**Critical Issues:** 12
- 8 hard waits
- 4 conditional flow control

**Recommendations:** 25
- Extract fixtures
- Improve selectors
- Add network assertions
```

This shows where to focus improvement efforts.

### Phase 2: Prioritize Improvements

Don't try to fix everything at once.

#### Focus on Critical Path First

**Priority 1: P0 Requirements**
```
Goal: Get P0 coverage to 100%

Actions:
1. Identify P0 requirements with no tests (from trace)
2. Run `automate` to generate tests for missing P0 scenarios
3. Fix critical quality issues in P0 tests (from test-review)
```

**Priority 2: Fix Flaky Tests**
```
Goal: Eliminate flakiness

Actions:
1. Identify tests with hard waits (from test-review)
2. Replace with network-first patterns
3. Run burn-in loops to verify stability
```

**Example Modernization:**

**Before (Flaky - Hard Waits):**
```typescript
test('checkout completes', async ({ page }) => {
  await page.click('button[name="checkout"]');
  await page.waitForTimeout(5000);  // ❌ Flaky
  await expect(page.locator('.confirmation')).toBeVisible();
});
```

**After (Network-First - Vanilla):**
```typescript
test('checkout completes', async ({ page }) => {
  const checkoutPromise = page.waitForResponse(
    resp => resp.url().includes('/api/checkout') && resp.ok()
  );
  await page.click('button[name="checkout"]');
  await checkoutPromise;  // ✅ Deterministic
  await expect(page.locator('.confirmation')).toBeVisible();
});
```

**After (With Playwright Utils - Cleaner API):**
```typescript
import { test } from '@seontechnologies/playwright-utils/fixtures';
import { expect } from '@playwright/test';

test('checkout completes', async ({ page, interceptNetworkCall }) => {
  // Use interceptNetworkCall for cleaner network interception
  const checkoutCall = interceptNetworkCall({
    method: 'POST',
    url: '**/api/checkout'
  });

  await page.click('button[name="checkout"]');

  // Wait for response (automatic JSON parsing)
  const { status, responseJson: order } = await checkoutCall;

  // Validate API response
  expect(status).toBe(200);
  expect(order.status).toBe('confirmed');

  // Validate UI
  await expect(page.locator('.confirmation')).toBeVisible();
});
```

**Playwright Utils Benefits:**
- `interceptNetworkCall` for cleaner network interception
- Automatic JSON parsing (`responseJson` ready to use)
- No manual `await response.json()`
- Glob pattern matching (`**/api/checkout`)
- Cleaner, more maintainable code

**For automatic error detection,** use `network-error-monitor` fixture separately. See [Integrate Playwright Utils](/docs/tea/how-to/customization/integrate-playwright-utils.md#network-error-monitor).

**Priority 3: P1 Requirements**
```
Goal: Get P1 coverage to 80%+

Actions:
1. Generate tests for highest-risk P1 gaps
2. Improve test quality incrementally
```

#### Create Improvement Roadmap

```markdown
# Test Improvement Roadmap

## Week 1: Critical Path (P0)
- [ ] Add 5 missing P0 tests (Epic 1: Auth)
- [ ] Fix 8 hard waits in auth tests
- [ ] Verify P0 coverage = 100%

## Week 2: Flakiness
- [ ] Replace all hard waits with network-first
- [ ] Fix conditional flow control
- [ ] Run burn-in loops (target: 0 failures in 10 runs)

## Week 3: High-Value Coverage (P1)
- [ ] Add 10 missing P1 tests
- [ ] Improve selector resilience
- [ ] P1 coverage target: 80%

## Week 4: Quality Polish
- [ ] Extract fixtures for common patterns
- [ ] Add network assertions
- [ ] Quality score target: 75+
```

### Phase 3: Incremental Improvement

Apply TEA workflows to new work while improving legacy tests.

#### For New Features (Greenfield Within Brownfield)

**Use full TEA workflow:**
```
1. `test-design` (epic-level) - Plan tests for new feature
2. `atdd` - Generate failing tests first (TDD)
3. Implement feature
4. `automate` - Expand coverage
5. `test-review` - Ensure quality
```

**Benefits:**
- New code has high-quality tests from day one
- Gradually raises overall quality
- Team learns good patterns

#### For Bug Fixes (Regression Prevention)

**Add regression tests:**
```
1. Reproduce bug with failing test
2. Fix bug
3. Verify test passes
4. Run `test-review` on regression test
5. Add to regression test suite
```

#### For Refactoring (Regression Safety)

**Before refactoring:**
```
1. Run `trace` - Baseline coverage
2. Note current coverage %
3. Refactor code
4. Run `trace` - Verify coverage maintained
5. No coverage should decrease
```

### Phase 4: Continuous Improvement

Track improvement over time.

#### Quarterly Quality Audits

**Q1 Baseline:**
```
Coverage: 30%
Quality Score: 55/100
Flakiness: 15% fail rate
```

**Q2 Target:**
```
Coverage: 50% (focus on P0)
Quality Score: 65/100
Flakiness: 5%
```

**Q3 Target:**
```
Coverage: 70%
Quality Score: 75/100
Flakiness: 1%
```

**Q4 Target:**
```
Coverage: 85%
Quality Score: 85/100
Flakiness: <0.5%
```

## Brownfield-Specific Tips

### Don't Rewrite Everything

**Common mistake:**
```
"Our tests are bad, let's delete them all and start over!"
```

**Better approach:**
```
"Our tests are bad, let's:
1. Keep tests that work (even if not perfect)
2. Fix critical quality issues incrementally
3. Add tests for gaps
4. Gradually improve over time"
```

**Why:**
- Rewriting is risky (might lose coverage)
- Incremental improvement is safer
- Team learns gradually
- Business value delivered continuously

### Use Regression Hotspots

**Identify regression-prone areas:**
```markdown
## Regression Hotspots

**Based on:**
- Bug reports (last 6 months)
- Customer complaints
- Code complexity (cyclomatic complexity >10)
- Frequent changes (git log analysis)

**High-Risk Areas:**
1. Authentication flow (12 bugs in 6 months)
2. Checkout process (8 bugs)
3. Payment integration (6 bugs)

**Test Priority:**
- Add regression tests for these areas FIRST
- Ensure P0 coverage before touching code
```

### Quarantine Flaky Tests

Don't let flaky tests block improvement:

```typescript
// Mark flaky tests with .skip temporarily
test.skip('flaky test - needs fixing', async ({ page }) => {
  // TODO: Fix hard wait on line 45
  // TODO: Add network-first pattern
});
```

**Track quarantined tests:**
```markdown
# Quarantined Tests

| Test                | Reason                     | Owner    | Target Fix Date |
| ------------------- | -------------------------- | -------- | --------------- |
| checkout.spec.ts:45 | Hard wait causes flakiness | QA Team  | 2026-01-20      |
| profile.spec.ts:28  | Conditional flow control   | Dev Team | 2026-01-25      |
```

**Fix systematically:**
- Don't accumulate quarantined tests
- Set deadlines for fixes
- Review quarantine list weekly

### Migrate One Directory at a Time

**Large test suite?** Improve incrementally:

**Week 1:** `tests/auth/`
```
1. Run `test-review` on auth tests
2. Fix critical issues
3. Re-review
4. Mark directory as "modernized"
```

**Week 2:** `tests/api/`
```
Same process
```

**Week 3:** `tests/e2e/`
```
Same process
```

**Benefits:**
- Focused improvement
- Visible progress
- Team learns patterns
- Lower risk

### Document Migration Status

**Track which tests are modernized:**

```markdown
# Test Suite Status

| Directory          | Tests | Quality Score | Status        | Notes          |
| ------------------ | ----- | ------------- | ------------- | -------------- |
| tests/auth/        | 15    | 85/100        | ✅ Modernized  | Week 1 cleanup |
| tests/api/         | 32    | 78/100        | ⚠️ In Progress | Week 2         |
| tests/e2e/         | 28    | 62/100        | ❌ Legacy      | Week 3 planned |
| tests/integration/ | 12    | 45/100        | ❌ Legacy      | Week 4 planned |

**Legend:**
- ✅ Modernized: Quality >80, no critical issues
- ⚠️ In Progress: Active improvement
- ❌ Legacy: Not yet touched
```

## Common Brownfield Challenges

### "We Don't Know What Tests Cover"

**Problem:** No documentation, unclear what tests do.

**Solution:**
```
1. Run `trace` - TEA analyzes tests and maps to requirements
2. Review traceability matrix
3. Document findings
4. Use as baseline for improvement
```

TEA reverse-engineers test coverage even without documentation.

### "Tests Are Too Brittle to Touch"

**Problem:** Afraid to modify tests (might break them).

**Solution:**
```
1. Run tests, capture current behavior (baseline)
2. Make small improvement (fix one hard wait)
3. Run tests again
4. If still pass, continue
5. If fail, investigate why

Incremental changes = lower risk
```

### "No One Knows How to Run Tests"

**Problem:** Test documentation is outdated or missing.

**Solution:**
```
1. Document manually or ask TEA to help analyze test structure
2. Create tests/README.md with:
   - How to install dependencies
   - How to run tests (npx playwright test, npm test, etc.)
   - What each test directory contains
   - Common issues and troubleshooting
3. Commit documentation for team
```

**Note:** `framework` is for new test setup, not existing tests. For brownfield, document what you have.

### "Tests Take Hours to Run"

**Problem:** Full test suite takes 4+ hours.

**Solution:**
```
1. Configure parallel execution (shard tests across workers)
2. Add selective testing (run only affected tests on PR)
3. Run full suite nightly only
4. Optimize slow tests (remove hard waits, improve selectors)

Before: 4 hours sequential
After: 15 minutes with sharding + selective testing
```

**How `ci` helps:**
- Scaffolds CI configuration with parallel sharding examples
- Provides selective testing script templates
- Documents burn-in and optimization strategies
- But YOU configure workers, test selection, and optimization

**With Playwright Utils burn-in:**
- Smart selective testing based on git diff
- Volume control (run percentage of affected tests)
- See [Integrate Playwright Utils](/docs/tea/how-to/customization/integrate-playwright-utils.md#burn-in)

### "We Have Tests But They Always Fail"

**Problem:** Tests are so flaky they're ignored.

**Solution:**
```
1. Run `test-review` to identify flakiness patterns
2. Fix top 5 flaky tests (biggest impact)
3. Quarantine remaining flaky tests
4. Re-enable as you fix them

Don't let perfect be the enemy of good
```

## Brownfield TEA Workflow

### Recommended Sequence

**1. Documentation (if needed):**
```
document-project
```

**2. Baseline (Phase 2):**
```
trace Phase 1 - Establish coverage baseline
test-review - Establish quality baseline
```

**3. Planning (Phase 2-3):**
```
prd - Document requirements (if missing)
architecture - Document architecture (if missing)
test-design (system-level) - Testability review
```

**4. Infrastructure (Phase 3):**
```
framework - Modernize test framework (if needed)
ci - Setup or improve CI/CD
```

**5. Per Epic (Phase 4):**
```
test-design (epic-level) - Focus on regression hotspots
automate - Add missing tests
test-review - Ensure quality
trace Phase 1 - Refresh coverage
```

**6. Release Gate:**
```
nfr-assess - Validate NFRs (if enterprise)
trace Phase 2 - Gate decision
```

## Related Guides

**Workflow Guides:**
- [How to Run Trace](/docs/tea/how-to/workflows/run-trace.md) - Baseline coverage analysis
- [How to Run Test Review](/docs/tea/how-to/workflows/run-test-review.md) - Quality audit
- [How to Run Automate](/docs/tea/how-to/workflows/run-automate.md) - Fill coverage gaps
- [How to Run Test Design](/docs/tea/how-to/workflows/run-test-design.md) - Risk assessment

**Customization:**
- [Integrate Playwright Utils](/docs/tea/how-to/customization/integrate-playwright-utils.md) - Modernize tests with utilities

## Understanding the Concepts

- [Engagement Models](/docs/tea/explanation/engagement-models.md) - Brownfield model explained
- [Test Quality Standards](/docs/tea/explanation/test-quality-standards.md) - What makes tests good
- [Network-First Patterns](/docs/tea/explanation/network-first-patterns.md) - Fix flakiness
- [Risk-Based Testing](/docs/tea/explanation/risk-based-testing.md) - Prioritize improvements

## Reference

- [TEA Command Reference](/docs/tea/reference/commands.md) - All 8 workflows
- [TEA Configuration](/docs/tea/reference/configuration.md) - Config options
- [Knowledge Base Index](/docs/tea/reference/knowledge-base.md) - Testing patterns
- [Glossary](/docs/tea/glossary/index.md#test-architect-tea-concepts) - TEA terminology

---

Generated with [BMad Method](https://bmad-method.org) - TEA (Test Architect)
