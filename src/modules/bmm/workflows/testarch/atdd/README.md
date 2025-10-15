# ATDD (Acceptance Test-Driven Development) Workflow

Generates failing acceptance tests BEFORE implementation following TDD's red-green-refactor cycle. Creates comprehensive test coverage at appropriate levels (E2E, API, Component) with supporting infrastructure (fixtures, factories, mocks) and provides an implementation checklist to guide development toward passing tests.

**Core Principle**: Tests fail first (red phase), guide development to green, then enable confident refactoring.

## Usage

```bash
bmad tea *atdd
```

The TEA agent runs this workflow when:

- User story is approved with clear acceptance criteria
- Development is about to begin (before any implementation code)
- Team is practicing Test-Driven Development (TDD)
- Need to establish test-first contract with DEV team

## Inputs

**Required Context Files:**

- **Story markdown** (`{story_file}`): User story with acceptance criteria, functional requirements, and technical constraints
- **Framework configuration**: Test framework config (playwright.config.ts or cypress.config.ts) from framework workflow

**Workflow Variables:**

- `story_file`: Path to story markdown with acceptance criteria (required)
- `test_dir`: Directory for test files (default: `{project-root}/tests`)
- `test_framework`: Detected from framework workflow (playwright or cypress)
- `test_levels`: Which test levels to generate (default: "e2e,api,component")
- `primary_level`: Primary test level for acceptance criteria (default: "e2e")
- `start_failing`: Tests must fail initially - red phase (default: true)
- `use_given_when_then`: BDD-style test structure (default: true)
- `network_first`: Route interception before navigation to prevent race conditions (default: true)
- `one_assertion_per_test`: Atomic test design (default: true)
- `generate_factories`: Create data factory stubs using faker (default: true)
- `generate_fixtures`: Create fixture architecture with auto-cleanup (default: true)
- `auto_cleanup`: Fixtures clean up their data automatically (default: true)
- `include_data_testids`: List required data-testid attributes for DEV (default: true)
- `include_mock_requirements`: Document mock/stub needs (default: true)
- `auto_load_knowledge`: Load fixture-architecture, data-factories, component-tdd fragments (default: true)
- `share_with_dev`: Provide implementation checklist to DEV agent (default: true)
- `output_checklist`: Path for implementation checklist (default: `{output_folder}/atdd-checklist-{story_id}.md`)

**Optional Context:**

- **Test design document**: For risk/priority context alignment (P0-P3 scenarios)
- **Existing fixtures/helpers**: For consistency with established patterns
- **Architecture documents**: For understanding system boundaries and integration points

## Outputs

**Primary Deliverable:**

- **ATDD Checklist** (`atdd-checklist-{story_id}.md`): Implementation guide containing:
  - Story summary and acceptance criteria breakdown
  - Test files created with paths and line counts
  - Data factories created with patterns
  - Fixtures created with auto-cleanup logic
  - Mock requirements for external services
  - Required data-testid attributes list
  - Implementation checklist mapping tests to code tasks
  - Red-green-refactor workflow guidance
  - Execution commands for running tests

**Test Files Created:**

- **E2E tests** (`tests/e2e/{feature-name}.spec.ts`): Full user journey tests for critical paths
- **API tests** (`tests/api/{feature-name}.api.spec.ts`): Business logic and service contract tests
- **Component tests** (`tests/component/{ComponentName}.test.tsx`): UI component behavior tests

**Supporting Infrastructure:**

- **Data factories** (`tests/support/factories/{entity}.factory.ts`): Factory functions using @faker-js/faker for generating test data with overrides support
- **Test fixtures** (`tests/support/fixtures/{feature}.fixture.ts`): Playwright fixtures with setup/teardown and auto-cleanup
- **Mock/stub documentation**: Requirements for external service mocking (payment gateways, email services, etc.)
- **data-testid requirements**: List of required test IDs for stable selectors in UI implementation

**Validation Safeguards:**

- All tests must fail initially (red phase verified by local test run)
- Failure messages are clear and actionable
- Tests use Given-When-Then format for readability
- Network-first pattern applied (route interception before navigation)
- One assertion per test (atomic test design)
- No hard waits or sleeps (explicit waits only)

## Key Features

### Red-Green-Refactor Cycle

**RED Phase** (TEA Agent responsibility):

- Write failing tests first defining expected behavior
- Tests fail for right reason (missing implementation, not test bugs)
- All supporting infrastructure (factories, fixtures, mocks) created

**GREEN Phase** (DEV Agent responsibility):

- Implement minimal code to pass one test at a time
- Use implementation checklist as guide
- Run tests frequently to verify progress

**REFACTOR Phase** (DEV Agent responsibility):

- Improve code quality with confidence (tests provide safety net)
- Extract duplications, optimize performance
- Ensure tests still pass after changes

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
- Visual regression and state management
- Characteristics: Fast, isolated, granular

**Unit**:

- Pure business logic and algorithms
- Edge cases and error handling
- Minimal dependencies
- Characteristics: Fastest, most granular

**Selection Strategy**: Avoid duplicate coverage. Use E2E for critical happy path, API for business logic variations, component for UI edge cases, unit for pure logic.

### Recording Mode (NEW - Phase 2.5)

**atdd** can record complex UI interactions instead of AI generation.

**Activation**: Automatic for complex UI when config.tea_use_mcp_enhancements is true and MCP available

- Fallback: AI generation (silent, automatic)

**When to Use Recording Mode:**

- ✅ Complex UI interactions (drag-drop, multi-step forms, wizards)
- ✅ Visual workflows (modals, dialogs, animations)
- ✅ Unclear requirements (exploratory, discovering expected behavior)
- ✅ Multi-page flows (checkout, registration, onboarding)
- ❌ NOT for simple CRUD (AI generation faster)
- ❌ NOT for API-only tests (no UI to record)

**When to Use AI Generation (Default):**

- ✅ Clear acceptance criteria available
- ✅ Standard patterns (login, CRUD, navigation)
- ✅ Need many tests quickly
- ✅ API/backend tests (no UI interaction)

**How Test Generation Works (Default - AI-Based):**

TEA generates tests using AI by:

1. **Analyzing acceptance criteria** from story markdown
2. **Inferring selectors** from requirement descriptions (e.g., "login button" → `[data-testid="login-button"]`)
3. **Synthesizing test code** based on knowledge base patterns
4. **Estimating interactions** using common UI patterns (click, type, verify)
5. **Applying best practices** from knowledge fragments (Given-When-Then, network-first, fixtures)

**This works well for:**

- ✅ Clear requirements with known UI patterns
- ✅ Standard workflows (login, CRUD, navigation)
- ✅ When selectors follow conventions (data-testid attributes)

**What MCP Adds (Interactive Verification & Enhancement):**

When Playwright MCP is available, TEA **additionally**:

1. **Verifies generated tests** by:
   - **Launching real browser** with `generator_setup_page`
   - **Executing generated test steps** with `browser_*` tools (`navigate`, `click`, `type`)
   - **Seeing actual UI** with `browser_snapshot` (visual verification)
   - **Discovering real selectors** with `browser_generate_locator` (auto-generate from live DOM)

2. **Enhances AI-generated tests** by:
   - **Validating selectors exist** in actual DOM (not just guesses)
   - **Verifying behavior** with `browser_verify_text`, `browser_verify_visible`, `browser_verify_url`
   - **Capturing actual interaction log** with `generator_read_log`
   - **Refining test code** with real observed behavior

3. **Catches issues early** by:
   - **Finding missing selectors** before DEV implements (requirements clarification)
   - **Discovering edge cases** not in requirements (loading states, error messages)
   - **Validating assumptions** about UI structure and behavior

**Key Benefits of MCP Enhancement:**

- ✅ **AI generates tests** (fast, based on requirements) **+** **MCP verifies tests** (accurate, based on reality)
- ✅ **Accurate selectors**: Validated against actual DOM, not just inferred
- ✅ **Visual validation**: TEA sees what user sees (modals, animations, state changes)
- ✅ **Complex flows**: Records multi-step interactions precisely
- ✅ **Edge case discovery**: Observes actual app behavior beyond requirements
- ✅ **Selector resilience**: MCP generates robust locators from live page (role-based, text-based, fallback chains)

**Example Enhancement Flow:**

```
1. AI generates test based on acceptance criteria
   → await page.click('[data-testid="submit-button"]')

2. MCP verifies selector exists (browser_generate_locator)
   → Found: button[type="submit"].btn-primary
   → No data-testid attribute exists!

3. TEA refines test with actual selector
   → await page.locator('button[type="submit"]').click()
   → Documents requirement: "Add data-testid='submit-button' to button"
```

**Recording Workflow (MCP-Based):**

```
1. Set generation_mode: "recording"
2. Use generator_setup_page to init recording session
3. For each acceptance criterion:
   a. Execute scenario with browser_* tools:
      - browser_navigate, browser_click, browser_type
      - browser_select, browser_check
   b. Add verifications with browser_verify_* tools:
      - browser_verify_text, browser_verify_visible
      - browser_verify_url
   c. Capture log with generator_read_log
   d. Generate test with generator_write_test
4. Enhance generated tests with knowledge base patterns:
   - Add Given-When-Then comments
   - Replace selectors with data-testid
   - Add network-first interception
   - Add fixtures/factories
5. Verify tests fail (RED phase)
```

**Example: Recording a Checkout Flow**

```markdown
Recording session for: "User completes checkout with credit card"

Actions recorded:

1. browser_navigate('/cart')
2. browser_click('[data-testid="checkout-button"]')
3. browser_type('[data-testid="card-number"]', '4242424242424242')
4. browser_type('[data-testid="expiry"]', '12/25')
5. browser_type('[data-testid="cvv"]', '123')
6. browser_click('[data-testid="place-order"]')
7. browser_verify_text('Order confirmed')
8. browser_verify_url('/confirmation')

Generated test (enhanced):

- Given-When-Then structure added
- data-testid selectors used
- Network-first payment API mock added
- Card factory created for test data
- Test verified to FAIL (checkout not implemented)
```

**Graceful Degradation:**

- Recording mode is OPTIONAL (default: AI generation)
- Requires Playwright MCP (falls back to AI if unavailable)
- Generated tests enhanced with knowledge base patterns
- Same quality output regardless of generation method

### Given-When-Then Structure

All tests follow BDD format for clarity:

```typescript
test('should display error for invalid credentials', async ({ page }) => {
  // GIVEN: User is on login page
  await page.goto('/login');

  // WHEN: User submits invalid credentials
  await page.fill('[data-testid="email-input"]', 'invalid@example.com');
  await page.fill('[data-testid="password-input"]', 'wrongpassword');
  await page.click('[data-testid="login-button"]');

  // THEN: Error message is displayed
  await expect(page.locator('[data-testid="error-message"]')).toHaveText('Invalid email or password');
});
```

### Network-First Testing Pattern

**Critical pattern to prevent race conditions**:

```typescript
// ✅ CORRECT: Intercept BEFORE navigation
await page.route('**/api/data', handler);
await page.goto('/page');

// ❌ WRONG: Navigate then intercept (race condition)
await page.goto('/page');
await page.route('**/api/data', handler); // Too late!
```

Always set up route interception before navigating to pages that make network requests.

### Data Factory Architecture

Use faker for all test data generation:

```typescript
// tests/support/factories/user.factory.ts
import { faker } from '@faker-js/faker';

export const createUser = (overrides = {}) => ({
  id: faker.number.int(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  createdAt: faker.date.recent().toISOString(),
  ...overrides,
});

export const createUsers = (count: number) => Array.from({ length: count }, () => createUser());
```

**Factory principles:**

- Use faker for random data (no hardcoded values to prevent collisions)
- Support overrides for specific test scenarios
- Generate complete valid objects matching API contracts
- Include helper functions for bulk creation

### Fixture Architecture with Auto-Cleanup

Playwright fixtures with automatic data cleanup:

```typescript
// tests/support/fixtures/auth.fixture.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  authenticatedUser: async ({ page }, use) => {
    // Setup: Create and authenticate user
    const user = await createUser();
    await page.goto('/login');
    await page.fill('[data-testid="email"]', user.email);
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');

    // Provide to test
    await use(user);

    // Cleanup: Delete user (automatic)
    await deleteUser(user.id);
  },
});
```

**Fixture principles:**

- Auto-cleanup (always delete created data in teardown)
- Composable (fixtures can use other fixtures via mergeTests)
- Isolated (each test gets fresh data)
- Type-safe with TypeScript

### One Assertion Per Test (Atomic Design)

Each test should verify exactly one behavior:

```typescript
// ✅ CORRECT: One assertion
test('should display user name', async ({ page }) => {
  await expect(page.locator('[data-testid="user-name"]')).toHaveText('John');
});

// ❌ WRONG: Multiple assertions (not atomic)
test('should display user info', async ({ page }) => {
  await expect(page.locator('[data-testid="user-name"]')).toHaveText('John');
  await expect(page.locator('[data-testid="user-email"]')).toHaveText('john@example.com');
});
```

**Why?** If second assertion fails, you don't know if first is still valid. Split into separate tests for clear failure diagnosis.

### Implementation Checklist for DEV

Maps each failing test to concrete implementation tasks:

```markdown
## Implementation Checklist

### Test: User Login with Valid Credentials

- [ ] Create `/login` route
- [ ] Implement login form component
- [ ] Add email/password validation
- [ ] Integrate authentication API
- [ ] Add `data-testid` attributes: `email-input`, `password-input`, `login-button`
- [ ] Implement error handling
- [ ] Run test: `npm run test:e2e -- login.spec.ts`
- [ ] ✅ Test passes (green phase)
```

Provides clear path from red to green for each test.

## Integration with Other Workflows

**Before this workflow:**

- **framework** workflow: Must run first to establish test framework architecture (Playwright or Cypress config, directory structure, base fixtures)
- **test-design** workflow: Optional but recommended for P0-P3 priority alignment and risk assessment context

**After this workflow:**

- **DEV agent** implements features guided by failing tests and implementation checklist
- **test-review** workflow: Review generated test quality before sharing with DEV team
- **automate** workflow: After story completion, expand regression suite with additional edge case coverage

**Coordinates with:**

- **Story approval process**: ATDD runs after story is approved but before DEV begins implementation
- **Quality gates**: Failing tests serve as acceptance criteria for story completion (all tests must pass)

## Important Notes

### ATDD is Test-First, Not Test-After

**Critical timing**: Tests must be written BEFORE any implementation code. This ensures:

- Tests define the contract (what needs to be built)
- Implementation is guided by tests (no over-engineering)
- Tests verify behavior, not implementation details
- Confidence in refactoring (tests catch regressions)

### All Tests Must Fail Initially

**Red phase verification is mandatory**:

- Run tests locally after creation to confirm RED phase
- Failure should be due to missing implementation, not test bugs
- Failure messages should be clear and actionable
- Document expected failure messages in ATDD checklist

If a test passes before implementation, it's not testing the right thing.

### Use data-testid for Stable Selectors

**Why data-testid?**

- CSS classes change frequently (styling refactors)
- IDs may not be unique or stable
- Text content changes with localization
- data-testid is explicit contract between tests and UI

```typescript
// ✅ CORRECT: Stable selector
await page.click('[data-testid="login-button"]');

// ❌ FRAGILE: Class-based selector
await page.click('.btn.btn-primary.login-btn');
```

ATDD checklist includes complete list of required data-testid attributes for DEV team.

### No Hard Waits or Sleeps

**Use explicit waits only**:

```typescript
// ✅ CORRECT: Explicit wait for condition
await page.waitForSelector('[data-testid="user-name"]');
await expect(page.locator('[data-testid="user-name"]')).toBeVisible();

// ❌ WRONG: Hard wait (flaky, slow)
await page.waitForTimeout(2000);
```

Playwright's auto-waiting is preferred (expect() automatically waits up to timeout).

### Component Tests for Complex UI Only

**When to use component tests:**

- Complex UI interactions (drag-drop, keyboard navigation)
- Form validation logic
- State management within component
- Visual edge cases

**When NOT to use:**

- Simple rendering (snapshot tests are sufficient)
- Integration with backend (use E2E or API tests)
- Full user journeys (use E2E tests)

Component tests are valuable but should complement, not replace, E2E and API tests.

### Auto-Cleanup is Non-Negotiable

**Every test must clean up its data**:

- Use fixtures with automatic teardown
- Never leave test data in database/storage
- Each test should be isolated (no shared state)

**Cleanup patterns:**

- Fixtures: Cleanup in teardown function
- Factories: Provide deletion helpers
- Tests: Use `test.afterEach()` for manual cleanup if needed

Without auto-cleanup, tests become flaky and depend on execution order.

## Knowledge Base References

This workflow automatically consults:

- **fixture-architecture.md** - Test fixture patterns with setup/teardown and auto-cleanup using Playwright's test.extend()
- **data-factories.md** - Factory patterns using @faker-js/faker for random test data generation with overrides support
- **component-tdd.md** - Component test strategies using Playwright Component Testing (@playwright/experimental-ct-react)
- **network-first.md** - Route interception patterns (intercept before navigation to prevent race conditions)
- **test-quality.md** - Test design principles (Given-When-Then, one assertion per test, determinism, isolation)
- **test-levels-framework.md** - Test level selection framework (E2E vs API vs Component vs Unit)

See `tea-index.csv` for complete knowledge fragment mapping and additional references.

## Example Output

After running this workflow, the ATDD checklist will contain:

````markdown
# ATDD Checklist - Epic 3, Story 5: User Authentication

## Story Summary

As a user, I want to log in with email and password so that I can access my personalized dashboard.

## Acceptance Criteria

1. User can log in with valid credentials
2. User sees error message with invalid credentials
3. User is redirected to dashboard after successful login

## Failing Tests Created (RED Phase)

### E2E Tests (3 tests)

- `tests/e2e/user-authentication.spec.ts` (87 lines)
  - ✅ should log in with valid credentials (RED - missing /login route)
  - ✅ should display error for invalid credentials (RED - error message not implemented)
  - ✅ should redirect to dashboard after login (RED - redirect logic missing)

### API Tests (2 tests)

- `tests/api/auth.api.spec.ts` (54 lines)
  - ✅ POST /api/auth/login - should return token for valid credentials (RED - endpoint not implemented)
  - ✅ POST /api/auth/login - should return 401 for invalid credentials (RED - validation missing)

## Data Factories Created

- `tests/support/factories/user.factory.ts` - createUser(), createUsers(count)

## Fixtures Created

- `tests/support/fixtures/auth.fixture.ts` - authenticatedUser fixture with auto-cleanup

## Required data-testid Attributes

### Login Page

- `email-input` - Email input field
- `password-input` - Password input field
- `login-button` - Submit button
- `error-message` - Error message container

### Dashboard Page

- `user-name` - User name display
- `logout-button` - Logout button

## Implementation Checklist

### Test: User Login with Valid Credentials

- [ ] Create `/login` route
- [ ] Implement login form component
- [ ] Add email/password validation
- [ ] Integrate authentication API
- [ ] Add data-testid attributes: `email-input`, `password-input`, `login-button`
- [ ] Run test: `npm run test:e2e -- user-authentication.spec.ts`
- [ ] ✅ Test passes (green phase)

### Test: Display Error for Invalid Credentials

- [ ] Add error state management
- [ ] Display error message UI
- [ ] Add `data-testid="error-message"`
- [ ] Run test: `npm run test:e2e -- user-authentication.spec.ts`
- [ ] ✅ Test passes (green phase)

### Test: Redirect to Dashboard After Login

- [ ] Implement redirect logic after successful auth
- [ ] Verify authentication token stored
- [ ] Add dashboard route protection
- [ ] Run test: `npm run test:e2e -- user-authentication.spec.ts`
- [ ] ✅ Test passes (green phase)

## Running Tests

```bash
# Run all failing tests
npm run test:e2e

# Run specific test file
npm run test:e2e -- user-authentication.spec.ts

# Run tests in headed mode (see browser)
npm run test:e2e -- --headed

# Debug specific test
npm run test:e2e -- user-authentication.spec.ts --debug
```
````

## Red-Green-Refactor Workflow

**RED Phase** (Complete):

- ✅ All tests written and failing
- ✅ Fixtures and factories created
- ✅ data-testid requirements documented

**GREEN Phase** (DEV Team - Next Steps):

1. Pick one failing test from checklist
2. Implement minimal code to make it pass
3. Run test to verify green
4. Check off task in checklist
5. Move to next test
6. Repeat until all tests pass

**REFACTOR Phase** (DEV Team - After All Tests Pass):

1. All tests passing (green)
2. Improve code quality (extract functions, optimize)
3. Remove duplications
4. Ensure tests still pass after each refactor

## Next Steps

1. Review this checklist with team
2. Run failing tests to confirm RED phase: `npm run test:e2e`
3. Begin implementation using checklist as guide
4. Share progress in daily standup
5. When all tests pass, run `bmad sm story-approved` to move story to DONE

```

This comprehensive checklist guides DEV team from red to green with clear tasks and validation steps.
```
