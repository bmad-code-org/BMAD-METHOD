<!-- Powered by BMAD-CORE™ -->

# Acceptance Test-Driven Development (ATDD)

**Workflow ID**: `_bmad/bmm/testarch/atdd`
**Version**: 4.0 (BMad v6)

---

## Overview

Generates failing acceptance tests BEFORE implementation following TDD's red-green-refactor cycle. This workflow creates comprehensive test coverage at appropriate levels (E2E, API, Component) with supporting infrastructure (fixtures, factories, mocks) and provides an implementation checklist to guide development.

**Core Principle**: Tests fail first (red phase), then guide development to green, then enable confident refactoring.

---

## Preflight Requirements

**Critical:** Verify these requirements before proceeding. If any fail, HALT and notify the user.

- ✅ Story approved with clear acceptance criteria
- ✅ Development sandbox/environment ready
- ✅ Framework scaffolding exists (run `framework` workflow if missing)
- ✅ Test framework configuration available (playwright.config.ts or cypress.config.ts)

---

## Step 1: Load Story Context and Requirements

### Actions

1. **Read Story Markdown**
   - Load story file from `{story_file}` variable
   - Extract acceptance criteria (all testable requirements)
   - Identify affected systems and components
   - Note any technical constraints or dependencies

2. **Load Framework Configuration**
   - Read framework config (playwright.config.ts or cypress.config.ts)
   - Identify test directory structure
   - Check existing fixture patterns
   - Note test runner capabilities

3. **Load Existing Test Patterns**
   - Search `{test_dir}` for similar tests
   - Identify reusable fixtures and helpers
   - Check data factory patterns
   - Note naming conventions

4. **Check Playwright Utils Flag**

   Read `{config_source}` and check `config.tea_use_playwright_utils`.

5. **Load Knowledge Base Fragments**

   **Critical:** Consult `{project-root}/_bmad/bmm/testarch/tea-index.csv` to load:

   **Core Patterns (Always load):**
   - `data-factories.md` - Factory patterns using faker (override patterns, nested factories, API seeding, 498 lines, 5 examples)
   - `component-tdd.md` - Component test strategies (red-green-refactor, provider isolation, accessibility, visual regression, 480 lines, 4 examples)
   - `test-quality.md` - Test design principles (deterministic tests, isolated with cleanup, explicit assertions, length limits, execution time optimization, 658 lines, 5 examples)
   - `test-healing-patterns.md` - Common failure patterns and healing strategies (stale selectors, race conditions, dynamic data, network errors, hard waits, 648 lines, 5 examples)
   - `selector-resilience.md` - Selector best practices (data-testid > ARIA > text > CSS hierarchy, dynamic patterns, anti-patterns, 541 lines, 4 examples)
   - `timing-debugging.md` - Race condition prevention and async debugging (network-first, deterministic waiting, anti-patterns, 370 lines, 3 examples)

   **If `config.tea_use_playwright_utils: true` (All Utilities):**
   - `overview.md` - Playwright utils for ATDD patterns
   - `api-request.md` - API test examples with schema validation
   - `network-recorder.md` - HAR record/playback for UI acceptance tests
   - `auth-session.md` - Auth setup for acceptance tests
   - `intercept-network-call.md` - Network interception in ATDD scenarios
   - `recurse.md` - Polling for async acceptance criteria
   - `log.md` - Logging in ATDD tests
   - `file-utils.md` - File download validation in acceptance tests
   - `network-error-monitor.md` - Catch silent failures in ATDD
   - `fixtures-composition.md` - Composing utilities for ATDD

   **If `config.tea_use_playwright_utils: false`:**
   - `fixture-architecture.md` - Test fixture patterns with auto-cleanup (pure function → fixture → mergeTests composition, 406 lines, 5 examples)
   - `network-first.md` - Route interception patterns (intercept before navigate, HAR capture, deterministic waiting, 489 lines, 5 examples)

**Halt Condition:** If story has no acceptance criteria or framework is missing, HALT with message: "ATDD requires clear acceptance criteria and test framework setup"

---

## Step 1.5: Generation Mode Selection (NEW - Phase 2.5)

### Actions

1. **Detect Generation Mode**

   Determine mode based on scenario complexity:

   **AI Generation Mode (DEFAULT)**:
   - Clear acceptance criteria with standard patterns
   - Uses: AI-generated tests from requirements
   - Appropriate for: CRUD, auth, navigation, API tests
   - Fastest approach

   **Recording Mode (OPTIONAL - Complex UI)**:
   - Complex UI interactions (drag-drop, wizards, multi-page flows)
   - Uses: Interactive test recording with Playwright MCP
   - Appropriate for: Visual workflows, unclear requirements
   - Only if config.tea_use_mcp_enhancements is true AND MCP available

2. **AI Generation Mode (DEFAULT - Continue to Step 2)**

   For standard scenarios:
   - Continue with existing workflow (Step 2: Select Test Levels and Strategy)
   - AI generates tests based on acceptance criteria from Step 1
   - Use knowledge base patterns for test structure

3. **Recording Mode (OPTIONAL - Complex UI Only)**

   For complex UI scenarios AND config.tea_use_mcp_enhancements is true:

   **A. Check MCP Availability**

   If Playwright MCP tools are available in your IDE:
   - Use MCP recording mode (Step 3.B)

   If MCP unavailable:
   - Fallback to AI generation mode (silent, automatic)
   - Continue to Step 2

   **B. Interactive Test Recording (MCP-Based)**

   Use Playwright MCP test-generator tools:

   **Setup:**

   ```
   1. Use generator_setup_page to initialize recording session
   2. Navigate to application starting URL (from story context)
   3. Ready to record user interactions
   ```

   **Recording Process (Per Acceptance Criterion):**

   ```
   4. Read acceptance criterion from story
   5. Manually execute test scenario using browser_* tools:
      - browser_navigate: Navigate to pages
      - browser_click: Click buttons, links, elements
      - browser_type: Fill form fields
      - browser_select: Select dropdown options
      - browser_check: Check/uncheck checkboxes
   6. Add verification steps using browser_verify_* tools:
      - browser_verify_text: Verify text content
      - browser_verify_visible: Verify element visibility
      - browser_verify_url: Verify URL navigation
   7. Capture interaction log with generator_read_log
   8. Generate test file with generator_write_test
   9. Repeat for next acceptance criterion
   ```

   **Post-Recording Enhancement:**

   ```
   10. Review generated test code
   11. Enhance with knowledge base patterns:
       - Add Given-When-Then comments
       - Replace recorded selectors with data-testid (if needed)
       - Add network-first interception (from network-first.md)
       - Add fixtures for auth/data setup (from fixture-architecture.md)
       - Use factories for test data (from data-factories.md)
   12. Verify tests fail (missing implementation)
   13. Continue to Step 4 (Build Data Infrastructure)
   ```

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

4. **Proceed to Test Level Selection**

   After mode selection:
   - AI Generation: Continue to Step 2 (Select Test Levels and Strategy)
   - Recording: Skip to Step 4 (Build Data Infrastructure) - tests already generated

---

## Step 2: Select Test Levels and Strategy (PYRAMID/TROPHY APPROACH)

### Actions

1. **CRITICAL - Load Epic Test Strategy (if exists)**

   **Check if epic has pre-defined test strategy:**
   - Look for "Test Strategy" or "E2E BDD Test Scenarios" section in epic file
   - If found: Use those as PRIMARY guidance for which ACs become E2E tests
   - If not found: Continue with manual analysis below

2. **Analyze Acceptance Criteria Using Pyramid/Trophy Strategy**

   **CORE PRINCIPLE**: E2E tests are EXPENSIVE - use sparingly only for true integration!

   **Knowledge Base References**:
   - `test-levels-framework.md`
   - `bdd-standards.md` (for BDD test structure)

   For each acceptance criterion, apply this decision tree:

   **QUESTION 1: Is this user-facing (tests behavior from user perspective)?**
   - NO → Unit test (technical AC, internal logic)
   - YES → Continue to Question 2

   **QUESTION 2: Does this REQUIRE frontend + backend integration?**
   - NO → Unit test in frontend OR backend (can be tested in isolation)
   - YES → Continue to Question 3

   **QUESTION 3: Is this a CRITICAL acceptance test (ship-to-production gate)?**
   - NO → Consider Playwright test in `frontend/tests/` (frontend integration only)
   - YES → E2E BDD test in root `tests/` directory

   **STRATEGIC TEST PLACEMENT:**

   **E2E BDD Tests (root `tests/` directory)**:
   - **ONLY** for true backend + frontend integration
   - **ONLY** for critical acceptance criteria (if these pass, ship to production)
   - **REPLACES manual testing** - these are the production gates
   - User-facing happy paths that cross the full stack
   - **Characteristics**: Highest confidence, slowest, most brittle
   - **Target**: 5-10 smoke tests per epic maximum

   **Playwright Tests (`frontend/tests/` directory)**:
   - Frontend component integration (multiple components working together)
   - UI workflows that don't need real backend (can use mocked API)
   - Visual validation and interaction testing
   - **Characteristics**: Fast, stable, frontend-focused
   - **Use when**: Testing UI behavior without backend dependency

   **Backend Unit Tests (`backend/tests/` directory)**:
   - API contract validation
   - Business logic variations and edge cases
   - Error handling and negative cases
   - Data transformations
   - **Characteristics**: Fastest, most stable
   - **Use when**: Testing backend logic in isolation

   **Frontend Unit Tests (`frontend/src/components/*/tests/` directory)**:
   - Component behavior (buttons, forms, modals)
   - Interaction edge cases
   - Rendering logic
   - **Characteristics**: Fast, isolated, granular
   - **Use when**: Testing component logic in isolation

3. **Apply BDD Principles to ALL Playwright Tests (E2E AND Frontend)**

   **CRITICAL**: ALL Playwright tests use Gherkin/BDD format, not just E2E!

   **Knowledge Base Reference**: `bdd-standards.md`

   For ALL Playwright tests (both root `tests/` and `frontend/tests/`):
   - **MUST use Gherkin format**: Given/When/Then syntax
   - Follow ONE When per scenario rule
   - Use declarative language (WHAT user achieves, not HOW UI implements)
   - Use specific entity names when 2+ entities exist
   - Separate entry points from sub-flows to prevent combinatorial explosion
   - **Priority Model**: P0 (smoke) / P1 (entry point) / P2 (sub-flow)

   **The ONLY difference between root tests/ and frontend/tests/**:
   - Root `tests/`: Tests against real backend (full stack integration)
   - `frontend/tests/`: Tests with mocked backend (frontend integration only)
   - **Both use identical Gherkin/BDD syntax!**

4. **Avoid Duplicate Coverage (CRITICAL)**

   **DO NOT test the same behavior at multiple levels:**
   - ✅ **CORRECT**: E2E test for critical happy path, unit tests for variations
   - ❌ **WRONG**: E2E test + API test + component test for same behavior

   **Example - Login Feature:**
   - **E2E BDD (1 test)**: User logs in with valid credentials → sees dashboard
   - **Backend Unit (5 tests)**: Invalid password, expired token, account locked, rate limiting, 2FA flow
   - **Frontend Unit (3 tests)**: Form validation, password visibility toggle, error message display

5. **Categorize and Count**

   **Output test strategy for this story:**

   **E2E BDD Tests (root `tests/`) - Playwright with Gherkin**: {{e2e_count}} scenarios
   {{for each E2E test identified}}
   - BDD-E2E-{{X}}: {{description}}
     - Priority: P0/P1/P2
     - Format: Gherkin/BDD (Given/When/Then)
     - Justification: {{why needs full stack integration}}
   {{end}}

   **Frontend BDD Tests (`frontend/tests/`) - Playwright with Gherkin**: {{playwright_count}} scenarios
   {{for each frontend integration test}}
   - FE-BDD-{{Y}}: {{description}}
   {{end}}

   **Backend Unit Tests**: {{backend_count}} scenarios
   {{for each backend test}}
   - BE-Unit-{{Z}}: {{description}}
   {{end}}

   **Frontend Unit Tests**: {{frontend_count}} scenarios
   {{for each frontend component test}}
   - FE-Unit-{{W}}: {{description}}
   {{end}}

   **VALIDATION CHECK:**
   - [ ] E2E count is reasonable (not testing every variation at E2E level)
   - [ ] Variations and edge cases are unit tests
   - [ ] Each test is at the LOWEST appropriate level (pyramid principle)
   - [ ] ALL Playwright tests use Gherkin/BDD format (Given/When/Then)
   - [ ] E2E and Frontend BDD tests follow BDD principles (ONE When, declarative, specific entities)

**Decision Point:** Set `primary_level` variable and test distribution for this story

---

## Step 3: Generate Failing Tests

### Actions

1. **Create Test File Structure**

   ```
   tests/
   ├── e2e/
   │   └── {feature-name}.spec.ts        # E2E acceptance tests
   ├── api/
   │   └── {feature-name}.api.spec.ts    # API contract tests
   ├── component/
   │   └── {ComponentName}.test.tsx      # Component tests
   └── support/
       ├── fixtures/                      # Test fixtures
       ├── factories/                     # Data factories
       └── helpers/                       # Utility functions
   ```

2. **Write Failing E2E Tests (If Applicable)**

   **Use Given-When-Then format:**

   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('User Login', () => {
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
   });
   ```

   **Critical patterns:**
   - One assertion per test (atomic tests)
   - Explicit waits (no hard waits/sleeps)
   - Network-first approach (route interception before navigation)
   - data-testid selectors for stability
   - Clear Given-When-Then structure

3. **Apply Network-First Pattern**

   **Knowledge Base Reference**: `network-first.md`

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

4. **Write Failing API Tests (If Applicable)**

   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('User API', () => {
     test('POST /api/users - should create new user', async ({ request }) => {
       // GIVEN: Valid user data
       const userData = {
         email: 'newuser@example.com',
         name: 'New User',
       };

       // WHEN: Creating user via API
       const response = await request.post('/api/users', {
         data: userData,
       });

       // THEN: User is created successfully
       expect(response.status()).toBe(201);
       const body = await response.json();
       expect(body).toMatchObject({
         email: userData.email,
         name: userData.name,
         id: expect.any(Number),
       });
     });
   });
   ```

5. **Write Failing Component Tests (If Applicable)**

   **Knowledge Base Reference**: `component-tdd.md`

   ```typescript
   import { test, expect } from '@playwright/experimental-ct-react';
   import { LoginForm } from './LoginForm';

   test.describe('LoginForm Component', () => {
     test('should disable submit button when fields are empty', async ({ mount }) => {
       // GIVEN: LoginForm is mounted
       const component = await mount(<LoginForm />);

       // WHEN: Form is initially rendered
       const submitButton = component.locator('button[type="submit"]');

       // THEN: Submit button is disabled
       await expect(submitButton).toBeDisabled();
     });
   });
   ```

6. **Verify Tests Fail Initially**

   **Critical verification:**
   - Run tests locally to confirm they fail
   - Failure should be due to missing implementation, not test errors
   - Failure messages should be clear and actionable
   - All tests must be in RED phase before sharing with DEV

**Important:** Tests MUST fail initially. If a test passes before implementation, it's not a valid acceptance test.

---

## Step 4: Build Data Infrastructure

### Actions

1. **Create Data Factories**

   **Knowledge Base Reference**: `data-factories.md`

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
   - Use faker for random data (no hardcoded values)
   - Support overrides for specific scenarios
   - Generate complete valid objects
   - Include helper functions for bulk creation

2. **Create Test Fixtures**

   **Knowledge Base Reference**: `fixture-architecture.md`

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

       // Cleanup: Delete user
       await deleteUser(user.id);
     },
   });
   ```

   **Fixture principles:**
   - Auto-cleanup (always delete created data)
   - Composable (fixtures can use other fixtures)
   - Isolated (each test gets fresh data)
   - Type-safe

3. **Document Mock Requirements**

   If external services need mocking, document requirements:

   ```markdown
   ### Mock Requirements for DEV Team

   **Payment Gateway Mock**:

   - Endpoint: `POST /api/payments`
   - Success response: `{ status: 'success', transactionId: '123' }`
   - Failure response: `{ status: 'failed', error: 'Insufficient funds' }`

   **Email Service Mock**:

   - Should not send real emails in test environment
   - Log email contents for verification
   ```

4. **List Required data-testid Attributes**

   ```markdown
   ### Required data-testid Attributes

   **Login Page**:

   - `email-input` - Email input field
   - `password-input` - Password input field
   - `login-button` - Submit button
   - `error-message` - Error message container

   **Dashboard Page**:

   - `user-name` - User name display
   - `logout-button` - Logout button
   ```

---

## Step 5: Create Implementation Checklist

### Actions

1. **Map Tests to Implementation Tasks**

   For each failing test, create corresponding implementation task:

   ```markdown
   ## Implementation Checklist

   ### Epic X - User Authentication

   #### Test: User Login with Valid Credentials

   - [ ] Create `/login` route
   - [ ] Implement login form component
   - [ ] Add email/password validation
   - [ ] Integrate authentication API
   - [ ] Add `data-testid` attributes: `email-input`, `password-input`, `login-button`
   - [ ] Implement error handling
   - [ ] Run test: `npm run test:e2e -- login.spec.ts`
   - [ ] ✅ Test passes (green phase)

   #### Test: Display Error for Invalid Credentials

   - [ ] Add error state management
   - [ ] Display error message UI
   - [ ] Add `data-testid="error-message"`
   - [ ] Run test: `npm run test:e2e -- login.spec.ts`
   - [ ] ✅ Test passes (green phase)
   ```

2. **Include Red-Green-Refactor Guidance**

   ```markdown
   ## Red-Green-Refactor Workflow

   **RED Phase** (Complete):

   - ✅ All tests written and failing
   - ✅ Fixtures and factories created
   - ✅ Mock requirements documented

   **GREEN Phase** (DEV Team):

   1. Pick one failing test
   2. Implement minimal code to make it pass
   3. Run test to verify green
   4. Move to next test
   5. Repeat until all tests pass

   **REFACTOR Phase** (DEV Team):

   1. All tests passing (green)
   2. Improve code quality
   3. Extract duplications
   4. Optimize performance
   5. Ensure tests still pass
   ```

3. **Add Execution Commands**

   ````markdown
   ## Running Tests

   ```bash
   # Run all failing tests
   npm run test:e2e

   # Run specific test file
   npm run test:e2e -- login.spec.ts

   # Run tests in headed mode (see browser)
   npm run test:e2e -- --headed

   # Debug specific test
   npm run test:e2e -- login.spec.ts --debug
   ```
   ````

   ```

   ```

---

## Step 6: Generate Deliverables

### Actions

1. **Create ATDD Checklist Document**

   Use template structure at `{installed_path}/atdd-checklist-template.md`:
   - Story summary
   - Acceptance criteria breakdown
   - Test files created (with paths)
   - Data factories created
   - Fixtures created
   - Mock requirements
   - Required data-testid attributes
   - Implementation checklist
   - Red-green-refactor workflow
   - Execution commands

2. **Verify All Tests Fail**

   Before finalizing:
   - Run full test suite locally
   - Confirm all tests in RED phase
   - Document expected failure messages
   - Ensure failures are due to missing implementation, not test bugs

3. **Write to Output File**

   Save to `{output_folder}/atdd-checklist-{story_id}.md`

---

## Important Notes

### Red-Green-Refactor Cycle

**RED Phase** (TEA responsibility):

- Write failing tests first
- Tests define expected behavior
- Tests must fail for right reason (missing implementation)

**GREEN Phase** (DEV responsibility):

- Implement minimal code to pass tests
- One test at a time
- Don't over-engineer

**REFACTOR Phase** (DEV responsibility):

- Improve code quality with confidence
- Tests provide safety net
- Extract duplications, optimize

### Given-When-Then Structure

**GIVEN** (Setup):

- Arrange test preconditions
- Create necessary data
- Navigate to starting point

**WHEN** (Action):

- Execute the behavior being tested
- Single action per test

**THEN** (Assertion):

- Verify expected outcome
- One assertion per test (atomic)

### Network-First Testing

**Critical pattern:**

```typescript
// ✅ CORRECT: Intercept BEFORE navigation
await page.route('**/api/data', handler);
await page.goto('/page');

// ❌ WRONG: Navigate then intercept (race condition)
await page.goto('/page');
await page.route('**/api/data', handler); // Too late!
```

### Data Factory Best Practices

**Use faker for all test data:**

```typescript
// ✅ CORRECT: Random data
email: faker.internet.email();

// ❌ WRONG: Hardcoded data (collisions, maintenance burden)
email: 'test@example.com';
```

**Auto-cleanup principle:**

- Every factory that creates data must provide cleanup
- Fixtures automatically cleanup in teardown
- No manual cleanup in test code

### One Assertion Per Test

**Atomic test design:**

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

**Why?** If second assertion fails, you don't know if first is still valid.

### Component Test Strategy

**When to use component tests:**

- Complex UI interactions (drag-drop, keyboard nav)
- Form validation logic
- State management within component
- Visual edge cases

**When NOT to use:**

- Simple rendering (snapshot tests are sufficient)
- Integration with backend (use E2E or API tests)
- Full user journeys (use E2E tests)

### Knowledge Base Integration

**Core Fragments (Auto-loaded in Step 1):**

- `fixture-architecture.md` - Pure function → fixture → mergeTests patterns (406 lines, 5 examples)
- `data-factories.md` - Factory patterns with faker, overrides, API seeding (498 lines, 5 examples)
- `component-tdd.md` - Red-green-refactor, provider isolation, accessibility, visual regression (480 lines, 4 examples)
- `network-first.md` - Intercept before navigate, HAR capture, deterministic waiting (489 lines, 5 examples)
- `test-quality.md` - Deterministic tests, cleanup, explicit assertions, length/time limits (658 lines, 5 examples)
- `test-healing-patterns.md` - Common failure patterns: stale selectors, race conditions, dynamic data, network errors, hard waits (648 lines, 5 examples)
- `selector-resilience.md` - Selector hierarchy (data-testid > ARIA > text > CSS), dynamic patterns, anti-patterns (541 lines, 4 examples)
- `timing-debugging.md` - Race condition prevention, deterministic waiting, async debugging (370 lines, 3 examples)

**Reference for Test Level Selection:**

- `test-levels-framework.md` - E2E vs API vs Component vs Unit decision framework (467 lines, 4 examples)

**Manual Reference (Optional):**

- Use `tea-index.csv` to find additional specialized fragments as needed

---

## Output Summary

After completing this workflow, provide a summary:

```markdown
## ATDD Complete - Tests in RED Phase

**Story**: {story_id}
**Primary Test Level**: {primary_level}

**Failing Tests Created**:

- E2E tests: {e2e_count} tests in {e2e_files}
- API tests: {api_count} tests in {api_files}
- Component tests: {component_count} tests in {component_files}

**Supporting Infrastructure**:

- Data factories: {factory_count} factories created
- Fixtures: {fixture_count} fixtures with auto-cleanup
- Mock requirements: {mock_count} services documented

**Implementation Checklist**:

- Total tasks: {task_count}
- Estimated effort: {effort_estimate} hours

**Required data-testid Attributes**: {data_testid_count} attributes documented

**Next Steps for DEV Team**:

1. Run failing tests: `npm run test:e2e`
2. Review implementation checklist
3. Implement one test at a time (RED → GREEN)
4. Refactor with confidence (tests provide safety net)
5. Share progress in daily standup

**Output File**: {output_file}
**Manual Handoff**: Share `{output_file}` and failing tests with the dev workflow (not auto-consumed).

**Knowledge Base References Applied**:

- Fixture architecture patterns
- Data factory patterns with faker
- Network-first route interception
- Component TDD strategies
- Test quality principles
```

---

## Validation

After completing all steps, verify:

- [ ] Story acceptance criteria analyzed and mapped to tests
- [ ] Appropriate test levels selected (E2E, API, Component)
- [ ] All tests written in Given-When-Then format
- [ ] All tests fail initially (RED phase verified)
- [ ] Network-first pattern applied (route interception before navigation)
- [ ] Data factories created with faker
- [ ] Fixtures created with auto-cleanup
- [ ] Mock requirements documented for DEV team
- [ ] Required data-testid attributes listed
- [ ] Implementation checklist created with clear tasks
- [ ] Red-green-refactor workflow documented
- [ ] Execution commands provided
- [ ] Output file created and formatted correctly

Refer to `checklist.md` for comprehensive validation criteria.
