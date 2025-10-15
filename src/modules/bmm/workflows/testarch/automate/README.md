# Automate Workflow

Expands test automation coverage by generating comprehensive test suites at appropriate levels (E2E, API, Component, Unit) with supporting infrastructure. This workflow operates in **dual mode** - works seamlessly WITH or WITHOUT BMad artifacts.

**Core Principle**: Generate prioritized, deterministic tests that avoid duplicate coverage and follow testing best practices.

## Usage

```bash
bmad tea *automate
```

The TEA agent runs this workflow when:

- **BMad-Integrated**: After story implementation to expand coverage beyond ATDD tests
- **Standalone**: Point at any codebase/feature and generate tests independently ("work out of thin air")
- **Auto-discover**: No targets specified - scans codebase for features needing tests

## Inputs

**Execution Modes:**

1. **BMad-Integrated Mode** (story available) - OPTIONAL
2. **Standalone Mode** (no BMad artifacts) - Direct code analysis
3. **Auto-discover Mode** (no targets) - Scan for coverage gaps

**Required Context Files:**

- **Framework configuration**: Test framework config (playwright.config.ts or cypress.config.ts) - REQUIRED

**Optional Context (BMad-Integrated Mode):**

- **Story markdown** (`{story_file}`): User story with acceptance criteria (enhances coverage targeting but NOT required)
- **Tech spec**: Technical specification (provides architectural context)
- **Test design**: Risk/priority context (P0-P3 alignment)
- **PRD**: Product requirements (business context)

**Optional Context (Standalone Mode):**

- **Source code**: Feature implementation to analyze
- **Existing tests**: Current test suite for gap analysis

**Workflow Variables:**

- `standalone_mode`: Can work without BMad artifacts (default: true)
- `story_file`: Path to story markdown (optional)
- `target_feature`: Feature name or directory to analyze (e.g., "user-authentication" or "src/auth/")
- `target_files`: Specific files to analyze (comma-separated paths)
- `test_dir`: Directory for test files (default: `{project-root}/tests`)
- `source_dir`: Source code directory (default: `{project-root}/src`)
- `auto_discover_features`: Automatically find features needing tests (default: true)
- `analyze_coverage`: Check existing test coverage gaps (default: true)
- `coverage_target`: Coverage strategy - "critical-paths", "comprehensive", "selective" (default: "critical-paths")
- `test_levels`: Which levels to generate - "e2e,api,component,unit" (default: all)
- `avoid_duplicate_coverage`: Don't test same behavior at multiple levels (default: true)
- `include_p0`: Include P0 critical path tests (default: true)
- `include_p1`: Include P1 high priority tests (default: true)
- `include_p2`: Include P2 medium priority tests (default: true)
- `include_p3`: Include P3 low priority tests (default: false)
- `use_given_when_then`: BDD-style test structure (default: true)
- `one_assertion_per_test`: Atomic test design (default: true)
- `network_first`: Route interception before navigation (default: true)
- `deterministic_waits`: No hard waits or sleeps (default: true)
- `generate_fixtures`: Create/enhance fixture architecture (default: true)
- `generate_factories`: Create/enhance data factories (default: true)
- `update_helpers`: Add utility functions (default: true)
- `use_test_design`: Load test-design.md if exists (default: true)
- `use_tech_spec`: Load tech-spec.md if exists (default: true)
- `use_prd`: Load PRD.md if exists (default: true)
- `update_readme`: Update test README with new specs (default: true)
- `update_package_scripts`: Add test execution scripts (default: true)
- `output_summary`: Path for automation summary (default: `{output_folder}/automation-summary.md`)
- `max_test_duration`: Maximum seconds per test (default: 90)
- `max_file_lines`: Maximum lines per test file (default: 300)
- `require_self_cleaning`: All tests must clean up data (default: true)
- `auto_load_knowledge`: Load relevant knowledge fragments (default: true)
- `run_tests_after_generation`: Verify tests pass/fail as expected (default: true)
- `auto_validate`: Run generated tests after creation (default: true) **NEW**
- `auto_heal_failures`: Enable automatic healing (default: false, opt-in) **NEW**
- `max_healing_iterations`: Maximum healing attempts per test (default: 3) **NEW**
- `fail_on_unhealable`: Fail workflow if tests can't be healed (default: false) **NEW**
- `mark_unhealable_as_fixme`: Mark unfixable tests with test.fixme() (default: true) **NEW**
- `use_mcp_healing`: Use Playwright MCP if available (default: true) **NEW**
- `healing_knowledge_fragments`: Healing patterns to load (default: "test-healing-patterns,selector-resilience,timing-debugging") **NEW**

## Outputs

**Primary Deliverable:**

- **Automation Summary** (`automation-summary.md`): Comprehensive report containing:
  - Execution mode (BMad-Integrated, Standalone, Auto-discover)
  - Feature analysis (source files analyzed, coverage gaps)
  - Tests created (E2E, API, Component, Unit) with counts and paths
  - Infrastructure created (fixtures, factories, helpers)
  - Test execution instructions
  - Coverage analysis (P0-P3 breakdown, coverage percentage)
  - Definition of Done checklist
  - Next steps and recommendations

**Test Files Created:**

- **E2E tests** (`tests/e2e/{feature-name}.spec.ts`): Critical user journeys (P0-P1)
- **API tests** (`tests/api/{feature-name}.api.spec.ts`): Business logic and contracts (P1-P2)
- **Component tests** (`tests/component/{ComponentName}.test.tsx`): UI behavior (P1-P2)
- **Unit tests** (`tests/unit/{module-name}.test.ts`): Pure logic (P2-P3)

**Supporting Infrastructure:**

- **Fixtures** (`tests/support/fixtures/{feature}.fixture.ts`): Setup/teardown with auto-cleanup
- **Data factories** (`tests/support/factories/{entity}.factory.ts`): Random test data using faker
- **Helpers** (`tests/support/helpers/{utility}.ts`): Utility functions (waitFor, retry, etc.)

**Documentation Updates:**

- **Test README** (`tests/README.md`): Test suite overview, execution instructions, priority tagging, patterns
- **package.json scripts**: Test execution commands (test:e2e, test:e2e:p0, test:api, etc.)

**Validation Safeguards:**

- All tests follow Given-When-Then format
- All tests have priority tags ([P0], [P1], [P2], [P3])
- All tests use data-testid selectors (stable, not CSS classes)
- All tests are self-cleaning (fixtures with auto-cleanup)
- No hard waits or flaky patterns (deterministic)
- Test files under 300 lines (lean and focused)
- Tests run under 1.5 minutes each (fast feedback)

## Key Features

### Dual-Mode Operation

**BMad-Integrated Mode** (story available):

- Uses story acceptance criteria for coverage targeting
- Aligns with test-design risk/priority assessment
- Expands ATDD tests with edge cases and negative paths
- Optional - story enhances coverage but not required

**Standalone Mode** (no story):

- Analyzes source code independently
- Identifies coverage gaps automatically
- Generates tests based on code analysis
- Works with any project (BMad or non-BMad)

**Auto-discover Mode** (no targets):

- Scans codebase for features needing tests
- Prioritizes features with no coverage
- Generates comprehensive test plan

### Avoid Duplicate Coverage

**Critical principle**: Don't test same behavior at multiple levels

**Good coverage strategy:**

- **E2E**: User can login → Dashboard loads (critical happy path only)
- **API**: POST /auth/login returns correct status codes (variations: 200, 401, 400)
- **Component**: LoginForm validates input (UI edge cases: empty fields, invalid format)
- **Unit**: validateEmail() logic (pure function edge cases)

**Bad coverage (duplicate):**

- E2E: User can login → Dashboard loads
- E2E: User can login with different emails → Dashboard loads (unnecessary duplication)
- API: POST /auth/login returns 200 (already covered in E2E)

Use E2E sparingly for critical paths. Use API/Component/Unit for variations and edge cases.

### Healing Capabilities (NEW - Phase 2.5)

**automate** automatically validates and heals test failures after generation.

**Configuration**: Controlled by `config.tea_use_mcp_enhancements` (default: true)

- If true + MCP available → MCP-assisted healing
- If true + MCP unavailable → Pattern-based healing
- If false → No healing, document failures for manual review

**Constants**: Max 3 healing attempts, unfixable tests marked as `test.fixme()`

**How Healing Works (Default - Pattern-Based):**

TEA heals tests using pattern-based analysis by:

1. **Parsing error messages** from test output logs
2. **Matching patterns** against known failure signatures
3. **Applying fixes** from healing knowledge fragments:
   - `test-healing-patterns.md` - Common failure patterns (selectors, timing, data, network)
   - `selector-resilience.md` - Selector refactoring (CSS → data-testid, nth() → filter())
   - `timing-debugging.md` - Race condition fixes (hard waits → event-based waits)
4. **Re-running tests** to verify fix (max 3 iterations)
5. **Marking unfixable tests** as `test.fixme()` with detailed comments

**This works well for:**

- ✅ Common failure patterns (stale selectors, timing issues, dynamic data)
- ✅ Text-based errors with clear signatures
- ✅ Issues documented in knowledge base
- ✅ Automated CI environments without browser access

**What MCP Adds (Interactive Debugging Enhancement):**

When Playwright MCP is available, TEA **additionally**:

1. **Debugs failures interactively** before applying pattern-based fixes:
   - **Pause test execution** with `playwright_test_debug_test` (step through, inspect state)
   - **See visual failure context** with `browser_snapshot` (screenshot of failure state)
   - **Inspect live DOM** with browser tools (find why selector doesn't match)
   - **Analyze console logs** with `browser_console_messages` (JS errors, warnings, debug output)
   - **Inspect network activity** with `browser_network_requests` (failed API calls, CORS errors, timeouts)

2. **Enhances pattern-based fixes** with real-world data:
   - **Pattern match identifies issue** (e.g., "stale selector")
   - **MCP discovers actual selector** with `browser_generate_locator` from live page
   - **TEA applies refined fix** using real DOM structure (not just pattern guess)
   - **Verification happens in browser** (see if fix works visually)

3. **Catches root causes** pattern matching might miss:
   - **Network failures**: MCP shows 500 error on API call (not just timeout)
   - **JS errors**: MCP shows `TypeError: undefined` in console (not just "element not found")
   - **Timing issues**: MCP shows loading spinner still visible (not just "selector timeout")
   - **State problems**: MCP shows modal blocking button (not just "not clickable")

**Key Benefits of MCP Enhancement:**

- ✅ **Pattern-based fixes** (fast, automated) **+** **MCP verification** (accurate, context-aware)
- ✅ **Visual debugging**: See exactly what user sees when test fails
- ✅ **DOM inspection**: Discover why selectors don't match (element missing, wrong attributes, dynamic IDs)
- ✅ **Network visibility**: Identify API failures, slow requests, CORS issues
- ✅ **Console analysis**: Catch JS errors that break page functionality
- ✅ **Robust selectors**: Generate locators from actual DOM (role, text, testid hierarchy)
- ✅ **Faster iteration**: Debug and fix in same browser session (no restart needed)
- ✅ **Higher success rate**: MCP helps diagnose failures pattern matching can't solve

**Example Enhancement Flow:**

```
1. Pattern-based healing identifies issue
   → Error: "Locator '.submit-btn' resolved to 0 elements"
   → Pattern match: Stale selector (CSS class)
   → Suggested fix: Replace with data-testid

2. MCP enhances diagnosis (if available)
   → browser_snapshot shows button exists but has class ".submit-button" (not ".submit-btn")
   → browser_generate_locator finds: button[type="submit"].submit-button
   → browser_console_messages shows no errors

3. TEA applies refined fix
   → await page.locator('button[type="submit"]').click()
   → (More accurate than pattern-based guess)
```

**Healing Modes:**

1. **MCP-Enhanced Healing** (when Playwright MCP available):
   - Pattern-based analysis **+** Interactive debugging
   - Visual context with `browser_snapshot`
   - Console log analysis with `browser_console_messages`
   - Network inspection with `browser_network_requests`
   - Live DOM inspection with `browser_generate_locator`
   - Step-by-step debugging with `playwright_test_debug_test`

2. **Pattern-Based Healing** (always available):
   - Error message parsing and pattern matching
   - Automated fixes from healing knowledge fragments
   - Text-based analysis (no visual/DOM inspection)
   - Works in CI without browser access

**Healing Workflow:**

```
1. Generate tests → Run tests
2. IF pass → Success ✅
3. IF fail AND auto_heal_failures=false → Report failures ⚠️
4. IF fail AND auto_heal_failures=true → Enter healing loop:
   a. Identify failure pattern (selector, timing, data, network)
   b. Apply automated fix from knowledge base
   c. Re-run test (max 3 iterations)
   d. IF healed → Success ✅
   e. IF unhealable → Mark test.fixme() with detailed comment
```

**Example Healing Outcomes:**

```typescript
// ❌ Original (failing): CSS class selector
await page.locator('.btn-primary').click();

// ✅ Healed: data-testid selector
await page.getByTestId('submit-button').click();

// ❌ Original (failing): Hard wait
await page.waitForTimeout(3000);

// ✅ Healed: Network-first pattern
await page.waitForResponse('**/api/data');

// ❌ Original (failing): Hardcoded ID
await expect(page.getByText('User 123')).toBeVisible();

// ✅ Healed: Regex pattern
await expect(page.getByText(/User \d+/)).toBeVisible();
```

**Unfixable Tests (Marked as test.fixme()):**

```typescript
test.fixme('[P1] should handle complex interaction', async ({ page }) => {
  // FIXME: Test healing failed after 3 attempts
  // Failure: "Locator 'button[data-action="submit"]' resolved to 0 elements"
  // Attempted fixes:
  //   1. Replaced with page.getByTestId('submit-button') - still failing
  //   2. Replaced with page.getByRole('button', { name: 'Submit' }) - still failing
  //   3. Added waitForLoadState('networkidle') - still failing
  // Manual investigation needed: Selector may require application code changes
  // TODO: Review with team, may need data-testid added to button component
  // Original test code...
});
```

**When to Enable Healing:**

- ✅ Enable for greenfield projects (catch generated test issues early)
- ✅ Enable for brownfield projects (auto-fix legacy selector patterns)
- ❌ Disable if environment not ready (application not deployed/seeded)
- ❌ Disable if preferring manual review of all generated tests

**Healing Report Example:**

```markdown
## Test Healing Report

**Auto-Heal Enabled**: true
**Healing Mode**: Pattern-based
**Iterations Allowed**: 3

### Validation Results

- **Total tests**: 10
- **Passing**: 7
- **Failing**: 3

### Healing Outcomes

**Successfully Healed (2 tests):**

- `tests/e2e/login.spec.ts:15` - Stale selector (CSS class → data-testid)
- `tests/e2e/checkout.spec.ts:42` - Race condition (added network-first interception)

**Unable to Heal (1 test):**

- `tests/e2e/complex-flow.spec.ts:67` - Marked as test.fixme()
  - Requires application code changes (add data-testid to component)

### Healing Patterns Applied

- **Selector fixes**: 1
- **Timing fixes**: 1
```

**Graceful Degradation:**

- Healing is OPTIONAL (default: disabled)
- Works without Playwright MCP (pattern-based fallback)
- Unfixable tests marked clearly (not silently broken)
- Manual investigation path documented

### Recording Mode (NEW - Phase 2.5)

**automate** can record complex UI interactions instead of AI generation.

**Activation**: Automatic for complex UI scenarios when config.tea_use_mcp_enhancements is true and MCP available

- Complex scenarios: drag-drop, wizards, multi-page flows
- Fallback: AI generation (silent, automatic)

**When to Use Recording Mode:**

- ✅ Complex UI interactions (drag-drop, multi-step forms, wizards)
- ✅ Visual workflows (modals, dialogs, animations, transitions)
- ✅ Unclear requirements (exploratory, discovering behavior)
- ✅ Multi-page flows (checkout, registration, onboarding)
- ❌ NOT for simple CRUD (AI generation faster)
- ❌ NOT for API-only tests (no UI to record)

**When to Use AI Generation (Default):**

- ✅ Clear requirements available
- ✅ Standard patterns (login, CRUD, navigation)
- ✅ Need many tests quickly
- ✅ API/backend tests (no UI interaction)

**Recording Workflow (Same as atdd):**

```
1. Set generation_mode: "recording"
2. Use generator_setup_page to init recording
3. For each test scenario:
   - Execute with browser_* tools (navigate, click, type, select)
   - Add verifications with browser_verify_* tools
   - Capture log and generate test file
4. Enhance with knowledge base patterns:
   - Given-When-Then structure
   - data-testid selectors
   - Network-first interception
   - Fixtures/factories
5. Validate (run tests if auto_validate enabled)
6. Heal if needed (if auto_heal_failures enabled)
```

**Combination: Recording + Healing:**

automate can use BOTH recording and healing together:

- Generate tests via recording (complex flows captured interactively)
- Run tests to validate (auto_validate)
- Heal failures automatically (auto_heal_failures)

This is particularly powerful for brownfield projects where:

- Requirements unclear → Use recording to capture existing behavior
- Application complex → Recording captures nuances AI might miss
- Tests may fail → Healing fixes common issues automatically

**Graceful Degradation:**

- Recording mode is OPTIONAL (default: AI generation)
- Requires Playwright MCP (falls back to AI if unavailable)
- Works with or without healing enabled
- Same quality output regardless of generation method

### Test Level Selection Framework

**E2E (End-to-End)**:

- Critical user journeys (login, checkout, core workflows)
- Multi-system integration
- User-facing acceptance criteria
- Characteristics: High confidence, slow execution, brittle

**API (Integration)**:

- Business logic validation
- Service contracts and data transformations
- Backend integration without UI
- Characteristics: Fast feedback, good balance, stable

**Component**:

- UI component behavior (buttons, forms, modals)
- Interaction testing (click, hover, keyboard navigation)
- State management within component
- Characteristics: Fast, isolated, granular

**Unit**:

- Pure business logic and algorithms
- Edge cases and error handling
- Minimal dependencies
- Characteristics: Fastest, most granular

### Priority Classification (P0-P3)

**P0 (Critical - Every commit)**:

- Critical user paths that must always work
- Security-critical functionality (auth, permissions)
- Data integrity scenarios
- Run in pre-commit hooks or PR checks

**P1 (High - PR to main)**:

- Important features with high user impact
- Integration points between systems
- Error handling for common failures
- Run before merging to main branch

**P2 (Medium - Nightly)**:

- Edge cases with moderate impact
- Less-critical feature variations
- Performance/load testing
- Run in nightly CI builds

**P3 (Low - On-demand)**:

- Nice-to-have validations
- Rarely-used features
- Exploratory testing scenarios
- Run manually or weekly

**Priority tagging enables selective execution:**

```bash
npm run test:e2e:p0  # Run only P0 tests (critical paths)
npm run test:e2e:p1  # Run P0 + P1 tests (pre-merge)
```

### Given-When-Then Test Structure

All tests follow BDD format for clarity:

```typescript
test('[P0] should login with valid credentials and load dashboard', async ({ page }) => {
  // GIVEN: User is on login page
  await page.goto('/login');

  // WHEN: User submits valid credentials
  await page.fill('[data-testid="email-input"]', 'user@example.com');
  await page.fill('[data-testid="password-input"]', 'Password123!');
  await page.click('[data-testid="login-button"]');

  // THEN: User is redirected to dashboard
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('[data-testid="user-name"]')).toBeVisible();
});
```

### One Assertion Per Test (Atomic Design)

Each test verifies exactly one behavior:

```typescript
// ✅ CORRECT: One assertion
test('[P0] should display user name', async ({ page }) => {
  await expect(page.locator('[data-testid="user-name"]')).toHaveText('John');
});

// ❌ WRONG: Multiple assertions (not atomic)
test('[P0] should display user info', async ({ page }) => {
  await expect(page.locator('[data-testid="user-name"]')).toHaveText('John');
  await expect(page.locator('[data-testid="user-email"]')).toHaveText('john@example.com');
});
```

**Why?** If second assertion fails, you don't know if first is still valid. Split into separate tests for clear failure diagnosis.

### Network-First Testing Pattern

**Critical pattern to prevent race conditions**:

```typescript
test('should load user dashboard after login', async ({ page }) => {
  // CRITICAL: Intercept routes BEFORE navigation
  await page.route('**/api/user', (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({ id: 1, name: 'Test User' }),
    }),
  );

  // NOW navigate
  await page.goto('/dashboard');

  await expect(page.locator('[data-testid="user-name"]')).toHaveText('Test User');
});
```

Always set up route interception before navigating to pages that make network requests.

### Fixture Architecture with Auto-Cleanup

Playwright fixtures with automatic data cleanup:

```typescript
// tests/support/fixtures/auth.fixture.ts
import { test as base } from '@playwright/test';
import { createUser, deleteUser } from '../factories/user.factory';

export const test = base.extend({
  authenticatedUser: async ({ page }, use) => {
    // Setup: Create and authenticate user
    const user = await createUser();
    await page.goto('/login');
    await page.fill('[data-testid="email"]', user.email);
    await page.fill('[data-testid="password"]', user.password);
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');

    // Provide to test
    await use(user);

    // Cleanup: Delete user automatically
    await deleteUser(user.id);
  },
});
```

**Fixture principles:**

- Auto-cleanup (always delete created data in teardown)
- Composable (fixtures can use other fixtures)
- Isolated (each test gets fresh data)
- Type-safe with TypeScript

### Data Factory Architecture

Use faker for all test data generation:

```typescript
// tests/support/factories/user.factory.ts
import { faker } from '@faker-js/faker';

export const createUser = (overrides = {}) => ({
  id: faker.number.int(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  name: faker.person.fullName(),
  role: 'user',
  createdAt: faker.date.recent().toISOString(),
  ...overrides,
});

export const createUsers = (count: number) => Array.from({ length: count }, () => createUser());

// API helper for cleanup
export const deleteUser = async (userId: number) => {
  await fetch(`/api/users/${userId}`, { method: 'DELETE' });
};
```

**Factory principles:**

- Use faker for random data (no hardcoded values to prevent collisions)
- Support overrides for specific test scenarios
- Generate complete valid objects matching API contracts
- Include helper functions for bulk creation and cleanup

### No Page Objects

**Do NOT create page object classes.** Keep tests simple and direct:

```typescript
// ✅ CORRECT: Direct test
test('should login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.click('[data-testid="login-button"]');
  await expect(page).toHaveURL('/dashboard');
});

// ❌ WRONG: Page object abstraction
class LoginPage {
  async login(email, password) { ... }
}
```

Use fixtures for setup/teardown, not page objects for actions.

### Deterministic Tests Only

**No flaky patterns allowed:**

```typescript
// ❌ WRONG: Hard wait
await page.waitForTimeout(2000);

// ✅ CORRECT: Explicit wait
await page.waitForSelector('[data-testid="user-name"]');
await expect(page.locator('[data-testid="user-name"]')).toBeVisible();

// ❌ WRONG: Conditional flow
if (await element.isVisible()) {
  await element.click();
}

// ✅ CORRECT: Deterministic assertion
await expect(element).toBeVisible();
await element.click();

// ❌ WRONG: Try-catch for test logic
try {
  await element.click();
} catch (e) {
  // Test shouldn't catch errors
}

// ✅ CORRECT: Let test fail if element not found
await element.click();
```

## Integration with Other Workflows

**Before this workflow:**

- **framework** workflow: Establish test framework architecture (Playwright/Cypress config, directory structure) - REQUIRED
- **test-design** workflow: Optional for P0-P3 priority alignment and risk assessment context (BMad-Integrated mode only)
- **atdd** workflow: Optional - automate expands beyond ATDD tests with edge cases (BMad-Integrated mode only)

**After this workflow:**

- **trace** workflow: Update traceability matrix with new test coverage (Phase 1) and make quality gate decision (Phase 2)
- **CI pipeline**: Run tests in burn-in loop to detect flaky patterns

**Coordinates with:**

- **DEV agent**: Tests validate implementation correctness
- **Story workflow**: Tests cover acceptance criteria (BMad-Integrated mode only)

## Important Notes

### Works Out of Thin Air

**automate does NOT require BMad artifacts:**

- Can analyze any codebase independently
- User can point TEA at a feature: "automate tests for src/auth/"
- Works on non-BMad projects
- BMad artifacts (story, tech-spec, PRD) are OPTIONAL enhancements, not requirements

**Similar to:**

- **framework**: Can scaffold tests on any project
- **ci**: Can generate CI config without BMad context

**Different from:**

- **atdd**: REQUIRES story with acceptance criteria (halt if missing)
- **test-design**: REQUIRES PRD/epic context (halt if missing)
- **trace (Phase 2)**: REQUIRES test results for gate decision (halt if missing)

### File Size Limits

**Keep test files lean (under 300 lines):**

- If file exceeds limit, split into multiple files by feature area
- Group related tests in describe blocks
- Extract common setup to fixtures

### Quality Standards Enforced

**Every test must:**

- ✅ Use Given-When-Then format
- ✅ Have clear, descriptive name with priority tag
- ✅ One assertion per test (atomic)
- ✅ No hard waits or sleeps
- ✅ Use data-testid selectors (not CSS classes)
- ✅ Self-cleaning (fixtures with auto-cleanup)
- ✅ Deterministic (no flaky patterns)
- ✅ Fast (under 90 seconds)

**Forbidden patterns:**

- ❌ Hard waits: `await page.waitForTimeout(2000)`
- ❌ Conditional flow: `if (await element.isVisible()) { ... }`
- ❌ Try-catch for test logic
- ❌ Hardcoded test data (use factories with faker)
- ❌ Page objects
- ❌ Shared state between tests

## Knowledge Base References

This workflow automatically consults:

- **test-levels-framework.md** - Test level selection (E2E vs API vs Component vs Unit) with characteristics and use cases
- **test-priorities.md** - Priority classification (P0-P3) with execution timing and risk alignment
- **fixture-architecture.md** - Test fixture patterns with setup/teardown and auto-cleanup using Playwright's test.extend()
- **data-factories.md** - Factory patterns using @faker-js/faker for random test data generation with overrides
- **selective-testing.md** - Targeted test execution strategies for CI optimization
- **ci-burn-in.md** - Flaky test detection patterns (10 iterations to catch intermittent failures)
- **test-quality.md** - Test design principles (Given-When-Then, determinism, isolation, atomic assertions)

**Healing Knowledge (If `auto_heal_failures` enabled):**

- **test-healing-patterns.md** - Common failure patterns and automated fixes (selectors, timing, data, network, hard waits)
- **selector-resilience.md** - Robust selector strategies and debugging (data-testid hierarchy, filter vs nth, anti-patterns)
- **timing-debugging.md** - Race condition identification and deterministic wait fixes (network-first, event-based waits)

See `tea-index.csv` for complete knowledge fragment mapping (22 fragments total).

## Example Output

### BMad-Integrated Mode

````markdown
# Automation Summary - User Authentication

**Date:** 2025-10-14
**Story:** Epic 3, Story 5
**Coverage Target:** critical-paths

## Tests Created

### E2E Tests (2 tests, P0-P1)

- `tests/e2e/user-authentication.spec.ts` (87 lines)
  - [P0] Login with valid credentials → Dashboard loads
  - [P1] Display error for invalid credentials

### API Tests (3 tests, P1-P2)

- `tests/api/auth.api.spec.ts` (102 lines)
  - [P1] POST /auth/login - valid credentials → 200 + token
  - [P1] POST /auth/login - invalid credentials → 401 + error
  - [P2] POST /auth/login - missing fields → 400 + validation

### Component Tests (2 tests, P1)

- `tests/component/LoginForm.test.tsx` (45 lines)
  - [P1] Empty fields → submit button disabled
  - [P1] Valid input → submit button enabled

## Infrastructure Created

- Fixtures: `tests/support/fixtures/auth.fixture.ts`
- Factories: `tests/support/factories/user.factory.ts`

## Test Execution

```bash
npm run test:e2e       # Run all tests
npm run test:e2e:p0    # Critical paths only
npm run test:e2e:p1    # P0 + P1 tests
```
````

## Coverage Analysis

**Total:** 7 tests (P0: 1, P1: 5, P2: 1)
**Levels:** E2E: 2, API: 3, Component: 2

✅ All acceptance criteria covered
✅ Happy path (E2E + API)
✅ Error cases (API)
✅ UI validation (Component)

````

### Standalone Mode

```markdown
# Automation Summary - src/auth/

**Date:** 2025-10-14
**Target:** src/auth/ (standalone analysis)
**Coverage Target:** critical-paths

## Feature Analysis

**Source Files Analyzed:**
- `src/auth/login.ts`
- `src/auth/session.ts`
- `src/auth/validation.ts`

**Existing Coverage:** 0 tests found

**Coverage Gaps:**
- ❌ No E2E tests for login flow
- ❌ No API tests for /auth/login endpoint
- ❌ No unit tests for validateEmail()

## Tests Created

{Same structure as BMad-Integrated mode}

## Recommendations

1. **High Priority (P0-P1):**
   - Add E2E test for password reset flow
   - Add API tests for token refresh endpoint

2. **Medium Priority (P2):**
   - Add unit tests for session timeout logic
````

Ready to continue?
