# Test Quality Review Workflow

The Test Quality Review workflow performs comprehensive quality validation of test code using TEA's knowledge base of best practices. It detects flaky patterns, validates structure, and provides actionable feedback to improve test maintainability and reliability.

## Overview

This workflow reviews test quality against proven patterns from TEA's knowledge base including fixture architecture, network-first safeguards, data factories, determinism, isolation, and flakiness prevention. It generates a quality score (0-100) with detailed feedback on violations and recommendations.

**Key Features:**

- **Knowledge-Based Review**: Applies patterns from 19+ knowledge fragments in tea-index.csv
- **Quality Scoring**: 0-100 score with letter grade (A+ to F) based on violations
- **Multi-Scope Review**: Single file, directory, or entire test suite
- **Pattern Detection**: Identifies hard waits, race conditions, shared state, conditionals
- **Best Practice Validation**: BDD format, test IDs, priorities, assertions, test length
- **Actionable Feedback**: Critical issues (must fix) vs recommendations (should fix)
- **Code Examples**: Every issue includes recommended fix with code snippets
- **Integration**: Works with story files, test-design, acceptance criteria context

---

## Usage

```bash
bmad tea *test-review
```

The TEA agent runs this workflow when:

- After `*atdd` workflow → validate generated acceptance tests
- After `*automate` workflow → ensure regression suite quality
- After developer writes tests → provide quality feedback
- Before `*gate` workflow → confirm test quality before release
- User explicitly requests review: `bmad tea *test-review`
- Periodic quality audits of existing test suite

**Typical workflow sequence:**

1. `*atdd` → Generate failing acceptance tests
2. **`*test-review`** → Validate test quality ⬅️ YOU ARE HERE (option 1)
3. `*dev story` → Implement feature with tests passing
4. **`*test-review`** → Review implementation tests ⬅️ YOU ARE HERE (option 2)
5. `*automate` → Expand regression suite
6. **`*test-review`** → Validate new regression tests ⬅️ YOU ARE HERE (option 3)
7. `*gate` → Final quality gate decision

---

## Inputs

### Required Context Files

- **Test File(s)**: One or more test files to review (auto-discovered or explicitly provided)
- **Test Framework Config**: playwright.config.ts, jest.config.js, etc. (for context)

### Recommended Context Files

- **Story File**: Acceptance criteria for context (e.g., `story-1.3.md`)
- **Test Design**: Priority context (P0/P1/P2/P3) from test-design.md
- **Knowledge Base**: tea-index.csv with best practice fragments (required for thorough review)

### Workflow Variables

Key variables that control review behavior (configured in `workflow.yaml`):

- **review_scope**: `single` | `directory` | `suite` (default: `single`)
  - `single`: Review one test file
  - `directory`: Review all tests in a directory
  - `suite`: Review entire test suite

- **quality_score_enabled**: Enable 0-100 quality scoring (default: `true`)
- **append_to_file**: Add inline comments to test files (default: `false`)
- **check_against_knowledge**: Use tea-index.csv fragments (default: `true`)
- **strict_mode**: Fail on any violation vs advisory only (default: `false`)

**Quality Criteria Flags** (all default to `true`):

- `check_given_when_then`: BDD format validation
- `check_test_ids`: Test ID conventions
- `check_priority_markers`: P0/P1/P2/P3 classification
- `check_hard_waits`: Detect sleep(), wait(X)
- `check_determinism`: No conditionals/try-catch abuse
- `check_isolation`: Tests clean up, no shared state
- `check_fixture_patterns`: Pure function → Fixture → mergeTests
- `check_data_factories`: Factory usage vs hardcoded data
- `check_network_first`: Route intercept before navigate
- `check_assertions`: Explicit assertions present
- `check_test_length`: Warn if >300 lines
- `check_test_duration`: Warn if >1.5 min
- `check_flakiness_patterns`: Common flaky patterns

---

## Outputs

### Primary Deliverable

**Test Quality Review Report** (`test-review-{filename}.md`):

- **Executive Summary**: Overall assessment, key strengths/weaknesses, recommendation
- **Quality Score**: 0-100 score with letter grade (A+ to F)
- **Quality Criteria Assessment**: Table with all criteria evaluated (PASS/WARN/FAIL)
- **Critical Issues**: P0/P1 violations that must be fixed
- **Recommendations**: P2/P3 violations that should be fixed
- **Best Practices Examples**: Good patterns found in tests
- **Knowledge Base References**: Links to detailed guidance

Each issue includes:

- Code location (file:line)
- Explanation of problem
- Recommended fix with code example
- Knowledge base fragment reference

### Secondary Outputs

- **Inline Comments**: TODO comments in test files at violation locations (if enabled)
- **Quality Badge**: Badge with score (e.g., "Test Quality: 87/100 (A)")
- **Story Update**: Test quality section appended to story file (if enabled)

### Validation Safeguards

- ✅ All knowledge base fragments loaded successfully
- ✅ Test files parsed and structure analyzed
- ✅ All enabled quality criteria evaluated
- ✅ Violations categorized by severity (P0/P1/P2/P3)
- ✅ Quality score calculated with breakdown
- ✅ Actionable feedback with code examples provided

---

## Quality Criteria Explained

### 1. BDD Format (Given-When-Then)

**PASS**: Tests use clear Given-When-Then structure

```typescript
// Given: User is logged in
const user = await createTestUser();
await loginPage.login(user.email, user.password);

// When: User navigates to dashboard
await page.goto('/dashboard');

// Then: User sees welcome message
await expect(page.locator('[data-testid="welcome"]')).toContainText(user.name);
```

**FAIL**: Tests lack structure, hard to understand intent

```typescript
await page.goto('/dashboard');
await page.click('.button');
await expect(page.locator('.text')).toBeVisible();
```

**Knowledge**: test-quality.md, tdd-cycles.md

---

### 2. Test IDs

**PASS**: All tests have IDs following convention

```typescript
test.describe('1.3-E2E-001: User Login Flow', () => {
  test('should log in successfully with valid credentials', async ({ page }) => {
    // Test implementation
  });
});
```

**FAIL**: No test IDs, can't trace to requirements

```typescript
test.describe('Login', () => {
  test('login works', async ({ page }) => {
    // Test implementation
  });
});
```

**Knowledge**: traceability.md, test-quality.md

---

### 3. Priority Markers

**PASS**: Tests classified as P0/P1/P2/P3

```typescript
test.describe('P0: Critical User Journey - Checkout', () => {
  // Critical tests
});

test.describe('P2: Edge Case - International Addresses', () => {
  // Nice-to-have tests
});
```

**Knowledge**: test-priorities.md, risk-governance.md

---

### 4. No Hard Waits

**PASS**: No sleep(), wait(), hardcoded delays

```typescript
// ✅ Good: Explicit wait for condition
await expect(page.locator('[data-testid="user-menu"]')).toBeVisible({ timeout: 10000 });
```

**FAIL**: Hard waits introduce flakiness

```typescript
// ❌ Bad: Hard wait
await page.waitForTimeout(2000);
await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
```

**Knowledge**: test-quality.md, network-first.md

---

### 5. Determinism

**PASS**: Tests work deterministically, no conditionals

```typescript
// ✅ Good: Deterministic test
await expect(page.locator('[data-testid="status"]')).toHaveText('Active');
```

**FAIL**: Conditionals make tests unpredictable

```typescript
// ❌ Bad: Conditional logic
const status = await page.locator('[data-testid="status"]').textContent();
if (status === 'Active') {
  await page.click('[data-testid="deactivate"]');
} else {
  await page.click('[data-testid="activate"]');
}
```

**Knowledge**: test-quality.md, data-factories.md

---

### 6. Isolation

**PASS**: Tests clean up, no shared state

```typescript
test.afterEach(async ({ page, testUser }) => {
  // Cleanup: Delete test user
  await api.deleteUser(testUser.id);
});
```

**FAIL**: Shared state, tests depend on order

```typescript
// ❌ Bad: Shared global variable
let userId: string;

test('create user', async () => {
  userId = await createUser(); // Sets global
});

test('update user', async () => {
  await updateUser(userId); // Depends on previous test
});
```

**Knowledge**: test-quality.md, data-factories.md

---

### 7. Fixture Patterns

**PASS**: Pure function → Fixture → mergeTests

```typescript
// ✅ Good: Pure function fixture
const createAuthenticatedPage = async (page: Page, user: User) => {
  await loginPage.login(user.email, user.password);
  return page;
};

const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    const user = createTestUser();
    const authedPage = await createAuthenticatedPage(page, user);
    await use(authedPage);
  },
});
```

**FAIL**: No fixtures, repeated setup

```typescript
// ❌ Bad: Repeated setup in every test
test('test 1', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('[type="submit"]');
  // Test logic
});
```

**Knowledge**: fixture-architecture.md

---

### 8. Data Factories

**PASS**: Factory functions with overrides

```typescript
// ✅ Good: Factory function
import { createTestUser } from './factories/user-factory';

test('user can update profile', async ({ page }) => {
  const user = createTestUser({ role: 'admin' });
  await api.createUser(user); // API-first setup
  // Test UI interaction
});
```

**FAIL**: Hardcoded test data

```typescript
// ❌ Bad: Magic strings
await page.fill('[name="email"]', 'test@example.com');
await page.fill('[name="phone"]', '555-1234');
```

**Knowledge**: data-factories.md

---

### 9. Network-First Pattern

**PASS**: Route intercept before navigate

```typescript
// ✅ Good: Intercept before navigation
await page.route('**/api/users', (route) => route.fulfill({ json: mockUsers }));
await page.goto('/users'); // Navigate after route setup
```

**FAIL**: Race condition risk

```typescript
// ❌ Bad: Navigate before intercept
await page.goto('/users');
await page.route('**/api/users', (route) => route.fulfill({ json: mockUsers })); // Too late!
```

**Knowledge**: network-first.md

---

### 10. Explicit Assertions

**PASS**: Clear, specific assertions

```typescript
await expect(page.locator('[data-testid="username"]')).toHaveText('John Doe');
await expect(page.locator('[data-testid="status"]')).toHaveClass(/active/);
```

**FAIL**: Missing or vague assertions

```typescript
await page.locator('[data-testid="username"]').isVisible(); // No assertion!
```

**Knowledge**: test-quality.md

---

### 11. Test Length

**PASS**: ≤300 lines per file (ideal: ≤200)
**WARN**: 301-500 lines (consider splitting)
**FAIL**: >500 lines (too large)

**Knowledge**: test-quality.md

---

### 12. Test Duration

**PASS**: ≤1.5 minutes per test (target: <30 seconds)
**WARN**: 1.5-3 minutes (consider optimization)
**FAIL**: >3 minutes (too slow)

**Knowledge**: test-quality.md, selective-testing.md

---

### 13. Flakiness Patterns

Common flaky patterns detected:

- Tight timeouts (e.g., `{ timeout: 1000 }`)
- Race conditions (navigation before route interception)
- Timing-dependent assertions
- Retry logic hiding flakiness
- Environment-dependent assumptions

**Knowledge**: test-quality.md, network-first.md, ci-burn-in.md

---

## Quality Scoring

### Score Calculation

```
Starting Score: 100

Deductions:
- Critical Violations (P0): -10 points each
- High Violations (P1): -5 points each
- Medium Violations (P2): -2 points each
- Low Violations (P3): -1 point each

Bonus Points (max +30):
+ Excellent BDD structure: +5
+ Comprehensive fixtures: +5
+ Comprehensive data factories: +5
+ Network-first pattern consistently used: +5
+ Perfect isolation (all tests clean up): +5
+ All test IDs present and correct: +5

Final Score: max(0, min(100, Starting Score - Violations + Bonus))
```

### Quality Grades

- **90-100** (A+): Excellent - Production-ready, best practices followed
- **80-89** (A): Good - Minor improvements recommended
- **70-79** (B): Acceptable - Some issues to address
- **60-69** (C): Needs Improvement - Several issues detected
- **<60** (F): Critical Issues - Significant problems, not production-ready

---

## Example Scenarios

### Scenario 1: Excellent Quality (Score: 95)

```markdown
# Test Quality Review: checkout-flow.spec.ts

**Quality Score**: 95/100 (A+ - Excellent)
**Recommendation**: Approve - Production Ready

## Executive Summary

Excellent test quality with comprehensive coverage and best practices throughout.
Tests demonstrate expert-level patterns including fixture architecture, data
factories, network-first approach, and perfect isolation.

**Strengths:**
✅ Clear Given-When-Then structure in all tests
✅ Comprehensive fixtures for authenticated states
✅ Data factories with faker.js for realistic test data
✅ Network-first pattern prevents race conditions
✅ Perfect test isolation with cleanup
✅ All test IDs present (1.2-E2E-001 through 1.2-E2E-005)

**Minor Recommendations:**
⚠️ One test slightly verbose (245 lines) - consider extracting helper function

**Recommendation**: Approve without changes. Use as reference for other tests.
```

---

### Scenario 2: Good Quality (Score: 82)

```markdown
# Test Quality Review: user-profile.spec.ts

**Quality Score**: 82/100 (A - Good)
**Recommendation**: Approve with Comments

## Executive Summary

Solid test quality with good structure and coverage. A few improvements would
enhance maintainability and reduce flakiness risk.

**Strengths:**
✅ Good BDD structure
✅ Test IDs present
✅ Explicit assertions

**Issues to Address:**
⚠️ 2 hard waits detected (lines 34, 67) - use explicit waits instead
⚠️ Hardcoded test data (line 23) - use factory functions
⚠️ Missing cleanup in one test (line 89) - add afterEach hook

**Recommendation**: Address hard waits before merging. Other improvements
can be addressed in follow-up PR.
```

---

### Scenario 3: Needs Improvement (Score: 68)

```markdown
# Test Quality Review: legacy-report.spec.ts

**Quality Score**: 68/100 (C - Needs Improvement)
**Recommendation**: Request Changes

## Executive Summary

Test has several quality issues that should be addressed before merging.
Primarily concerns around flakiness risk and maintainability.

**Critical Issues:**
❌ 5 hard waits detected (flakiness risk)
❌ Race condition: navigation before route interception (line 45)
❌ Shared global state between tests (line 12)
❌ Missing test IDs (can't trace to requirements)

**Recommendations:**
⚠️ Test file is 487 lines - consider splitting
⚠️ Hardcoded data throughout - use factories
⚠️ Missing cleanup in afterEach

**Recommendation**: Address all critical issues (❌) before re-review.
Significant refactoring needed.
```

---

### Scenario 4: Critical Issues (Score: 42)

```markdown
# Test Quality Review: data-export.spec.ts

**Quality Score**: 42/100 (F - Critical Issues)
**Recommendation**: Block - Not Production Ready

## Executive Summary

CRITICAL: Test has severe quality issues that make it unsuitable for
production. Significant refactoring required.

**Critical Issues:**
❌ 12 hard waits (page.waitForTimeout) throughout
❌ No test IDs or structure
❌ Try/catch blocks swallowing errors (lines 23, 45, 67, 89)
❌ No cleanup - tests leave data in database
❌ Conditional logic (if/else) throughout tests
❌ No assertions in 3 tests (tests do nothing!)
❌ 687 lines - far too large
❌ Multiple race conditions
❌ Hardcoded credentials in plain text (SECURITY ISSUE)

**Recommendation**: BLOCK MERGE. Complete rewrite recommended following
TEA knowledge base patterns. Suggest pairing session with QA engineer.
```

---

## Integration with Other Workflows

### Before Test Review

1. **atdd** - Generates acceptance tests → TEA reviews for quality
2. **dev story** - Developer implements tests → TEA provides feedback
3. **automate** - Expands regression suite → TEA validates new tests

### After Test Review

1. **Developer** - Addresses critical issues, improves based on recommendations
2. **gate** - Test quality feeds into release decision (high-quality tests increase confidence)

### Coordinates With

- **Story File**: Review links to acceptance criteria for context
- **Test Design**: Review validates tests align with P0/P1/P2/P3 prioritization
- **Knowledge Base**: All feedback references tea-index.csv fragments

---

## Review Scopes

### Single File Review

```bash
# Review specific test file
bmad tea *test-review
# Provide test_file_path when prompted: tests/auth/login.spec.ts
```

**Use When:**

- Reviewing tests just written
- PR review of specific test file
- Debugging flaky test
- Learning test quality patterns

---

### Directory Review

```bash
# Review all tests in directory
bmad tea *test-review
# Provide review_scope: directory
# Provide test_dir: tests/auth/
```

**Use When:**

- Feature branch has multiple test files
- Reviewing entire feature test suite
- Auditing test quality for module

---

### Suite Review

```bash
# Review entire test suite
bmad tea *test-review
# Provide review_scope: suite
```

**Use When:**

- Periodic quality audit (monthly/quarterly)
- Before major release
- Identifying patterns across codebase
- Establishing quality baseline

---

## Configuration Examples

### Strict Review (Fail on Violations)

```yaml
review_scope: 'single'
quality_score_enabled: true
strict_mode: true # Fail if score <70
check_against_knowledge: true
# All check_* flags: true
```

Use for: PR gates, production releases

---

### Balanced Review (Advisory)

```yaml
review_scope: 'single'
quality_score_enabled: true
strict_mode: false # Advisory only
check_against_knowledge: true
# All check_* flags: true
```

Use for: Most development workflows (default)

---

### Focused Review (Specific Criteria)

```yaml
review_scope: 'single'
check_hard_waits: true
check_flakiness_patterns: true
check_network_first: true
# Other checks: false
```

Use for: Debugging flaky tests, targeted improvements

---

## Important Notes

1. **Non-Prescriptive**: Review provides guidance, not rigid rules
2. **Context Matters**: Some violations may be justified (document with comments)
3. **Knowledge-Based**: All feedback grounded in proven patterns
4. **Actionable**: Every issue includes recommended fix with code example
5. **Quality Score**: Use as indicator, not absolute measure
6. **Continuous Improvement**: Review tests periodically as patterns evolve
7. **Learning Tool**: Use reviews to learn best practices, not just find bugs

---

## Knowledge Base References

This workflow automatically consults:

- **test-quality.md** - Definition of Done (no hard waits, <300 lines, <1.5 min, self-cleaning)
- **fixture-architecture.md** - Pure function → Fixture → mergeTests pattern
- **network-first.md** - Route intercept before navigate (race condition prevention)
- **data-factories.md** - Factory functions with overrides, API-first setup
- **test-levels-framework.md** - E2E vs API vs Component vs Unit appropriateness
- **playwright-config.md** - Environment-based configuration patterns
- **tdd-cycles.md** - Red-Green-Refactor patterns
- **selective-testing.md** - Duplicate coverage detection
- **ci-burn-in.md** - Flakiness detection patterns
- **test-priorities.md** - P0/P1/P2/P3 classification framework
- **traceability.md** - Requirements-to-tests mapping

See `tea-index.csv` for complete knowledge fragment mapping.

---

## Troubleshooting

### Problem: Quality score seems too low

**Solution:**

- Review violation breakdown - focus on critical issues first
- Consider project context - some patterns may be justified
- Check if criteria are appropriate for project type
- Score is indicator, not absolute - focus on actionable feedback

---

### Problem: No test files found

**Solution:**

- Verify test_dir path is correct
- Check test file extensions (_.spec.ts, _.test.js, etc.)
- Use glob pattern to discover: `tests/**/*.spec.ts`

---

### Problem: Knowledge fragments not loading

**Solution:**

- Verify tea-index.csv exists in testarch/ directory
- Check fragment file paths are correct in tea-index.csv
- Ensure auto_load_knowledge: true in workflow variables

---

### Problem: Too many false positives

**Solution:**

- Add justification comments in code for legitimate violations
- Adjust check\_\* flags to disable specific criteria
- Use strict_mode: false for advisory-only feedback
- Context matters - document why pattern is appropriate

---

## Related Commands

- `bmad tea *atdd` - Generate acceptance tests (review after generation)
- `bmad tea *automate` - Expand regression suite (review new tests)
- `bmad tea *gate` - Quality gate decision (test quality feeds into decision)
- `bmad dev story` - Implement story (review tests after implementation)
