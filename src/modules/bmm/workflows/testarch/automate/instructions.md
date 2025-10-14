<!-- Powered by BMAD-CORE™ -->

# Test Automation Expansion

**Workflow ID**: `bmad/bmm/testarch/automate`
**Version**: 4.0 (BMad v6)

---

## Overview

Expands test automation coverage by generating comprehensive test suites at appropriate levels (E2E, API, Component, Unit) with supporting infrastructure. This workflow operates in **dual mode**:

1. **BMad-Integrated Mode**: Works WITH BMad artifacts (story, tech-spec, PRD, test-design) to expand coverage after story implementation
2. **Standalone Mode**: Works WITHOUT BMad artifacts - analyzes existing codebase and generates tests independently

**Core Principle**: Generate prioritized, deterministic tests that avoid duplicate coverage and follow testing best practices.

---

## Preflight Requirements

**Flexible:** This workflow can run with minimal prerequisites. Only HALT if framework is completely missing.

### Required (Always)

- ✅ Framework scaffolding configured (run `framework` workflow if missing)
- ✅ Test framework configuration available (playwright.config.ts or cypress.config.ts)

### Optional (BMad-Integrated Mode)

- Story markdown with acceptance criteria (enhances coverage targeting)
- Tech spec or PRD (provides architectural context)
- Test design document (provides risk/priority context)

### Optional (Standalone Mode)

- Source code to analyze (feature implementation)
- Existing tests (for gap analysis)

**If framework is missing:** HALT with message: "Framework scaffolding required. Run `bmad tea *framework` first."

---

## Step 1: Determine Execution Mode and Load Context

### Actions

1. **Detect Execution Mode**

   Check if BMad artifacts are available:
   - If `{story_file}` variable is set → BMad-Integrated Mode
   - If `{target_feature}` or `{target_files}` set → Standalone Mode
   - If neither set → Auto-discover mode (scan codebase for features needing tests)

2. **Load BMad Artifacts (If Available)**

   **BMad-Integrated Mode:**
   - Read story markdown from `{story_file}`
   - Extract acceptance criteria and technical requirements
   - Load tech-spec.md if `{use_tech_spec}` is true
   - Load test-design.md if `{use_test_design}` is true
   - Load PRD.md if `{use_prd}` is true
   - Note: These are **optional enhancements**, not hard requirements

   **Standalone Mode:**
   - Skip BMad artifact loading
   - Proceed directly to source code analysis

3. **Load Framework Configuration**
   - Read test framework config (playwright.config.ts or cypress.config.ts)
   - Identify test directory structure from `{test_dir}`
   - Check existing test patterns in `{test_dir}`
   - Note test runner capabilities (parallel execution, fixtures, etc.)

4. **Analyze Existing Test Coverage**

   If `{analyze_coverage}` is true:
   - Search `{test_dir}` for existing test files
   - Identify tested features vs untested features
   - Map tests to source files (coverage gaps)
   - Check existing fixture and factory patterns

5. **Load Knowledge Base Fragments**

   **Critical:** Consult `{project-root}/bmad/bmm/testarch/tea-index.csv` to load:
   - `test-levels-framework.md` - Test level selection (E2E vs API vs Component vs Unit)
   - `test-priorities.md` - Priority classification (P0-P3)
   - `fixture-architecture.md` - Test fixture patterns
   - `data-factories.md` - Factory patterns with faker
   - `selective-testing.md` - Targeted test execution strategies
   - `ci-burn-in.md` - Flaky test detection patterns
   - `test-quality.md` - Test design principles

---

## Step 2: Identify Automation Targets

### Actions

1. **Determine What Needs Testing**

   **BMad-Integrated Mode (story available):**
   - Map acceptance criteria from story to test scenarios
   - Identify features implemented in this story
   - Check if story has existing ATDD tests (from `*atdd` workflow)
   - Expand beyond ATDD with edge cases and negative paths

   **Standalone Mode (no story):**
   - If `{target_feature}` specified: Analyze that specific feature
   - If `{target_files}` specified: Analyze those specific files
   - If `{auto_discover_features}` is true: Scan `{source_dir}` for features
   - Prioritize features with:
     - No test coverage (highest priority)
     - Complex business logic
     - External integrations (API calls, database, auth)
     - Critical user paths (login, checkout, etc.)

2. **Apply Test Level Selection Framework**

   **Knowledge Base Reference**: `test-levels-framework.md`

   For each feature or acceptance criterion, determine appropriate test level:

   **E2E (End-to-End)**:
   - Critical user journeys (login, checkout, core workflows)
   - Multi-system integration
   - Full user-facing scenarios
   - Characteristics: High confidence, slow, brittle

   **API (Integration)**:
   - Business logic validation
   - Service contracts and data transformations
   - Backend integration without UI
   - Characteristics: Fast feedback, stable, good balance

   **Component**:
   - UI component behavior (buttons, forms, modals)
   - Interaction testing (click, hover, keyboard)
   - State management within component
   - Characteristics: Fast, isolated, granular

   **Unit**:
   - Pure business logic and algorithms
   - Edge cases and error handling
   - Minimal dependencies
   - Characteristics: Fastest, most granular

3. **Avoid Duplicate Coverage**

   **Critical principle:** Don't test same behavior at multiple levels unless necessary
   - Use E2E for critical happy path only
   - Use API tests for business logic variations
   - Use component tests for UI interaction edge cases
   - Use unit tests for pure logic edge cases

   **Example:**
   - E2E: User can log in with valid credentials → Dashboard loads
   - API: POST /auth/login returns 401 for invalid credentials
   - API: POST /auth/login returns 200 and JWT token for valid credentials
   - Component: LoginForm disables submit button when fields are empty
   - Unit: validateEmail() returns false for malformed email addresses

4. **Assign Test Priorities**

   **Knowledge Base Reference**: `test-priorities.md`

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

   **Priority Variables:**
   - `{include_p0}` - Always include (default: true)
   - `{include_p1}` - High priority (default: true)
   - `{include_p2}` - Medium priority (default: true)
   - `{include_p3}` - Low priority (default: false)

5. **Create Test Coverage Plan**

   Document what will be tested at each level with priorities:

   ```markdown
   ## Test Coverage Plan

   ### E2E Tests (P0)

   - User login with valid credentials → Dashboard loads
   - User logout → Redirects to login page

   ### API Tests (P1)

   - POST /auth/login - valid credentials → 200 + JWT token
   - POST /auth/login - invalid credentials → 401 + error message
   - POST /auth/login - missing fields → 400 + validation errors

   ### Component Tests (P1)

   - LoginForm - empty fields → submit button disabled
   - LoginForm - valid input → submit button enabled

   ### Unit Tests (P2)

   - validateEmail() - valid email → returns true
   - validateEmail() - malformed email → returns false
   ```

---

## Step 3: Generate Test Infrastructure

### Actions

1. **Enhance Fixture Architecture**

   **Knowledge Base Reference**: `fixture-architecture.md`

   Check existing fixtures in `tests/support/fixtures/`:
   - If missing or incomplete, create fixture architecture
   - Use Playwright's `test.extend()` pattern
   - Ensure all fixtures have auto-cleanup in teardown

   **Common fixtures to create/enhance:**
   - **authenticatedUser**: User with valid session (auto-deletes user after test)
   - **apiRequest**: Authenticated API client with base URL and headers
   - **mockNetwork**: Network mocking for external services
   - **testDatabase**: Database with test data (auto-cleanup after test)

   **Example fixture:**

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

2. **Enhance Data Factories**

   **Knowledge Base Reference**: `data-factories.md`

   Check existing factories in `tests/support/factories/`:
   - If missing or incomplete, create factory architecture
   - Use `@faker-js/faker` for all random data (no hardcoded values)
   - Support overrides for specific test scenarios

   **Common factories to create/enhance:**
   - User factory (email, password, name, role)
   - Product factory (name, price, description, SKU)
   - Order factory (items, total, status, customer)

   **Example factory:**

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

3. **Create/Enhance Helper Utilities**

   If `{update_helpers}` is true:

   Check `tests/support/helpers/` for common utilities:
   - **waitFor**: Polling helper for complex conditions
   - **retry**: Retry helper for flaky operations
   - **testData**: Test data generation helpers
   - **assertions**: Custom assertion helpers

   **Example helper:**

   ```typescript
   // tests/support/helpers/wait-for.ts
   export const waitFor = async (condition: () => Promise<boolean>, timeout = 5000, interval = 100): Promise<void> => {
     const startTime = Date.now();
     while (Date.now() - startTime < timeout) {
       if (await condition()) return;
       await new Promise((resolve) => setTimeout(resolve, interval));
     }
     throw new Error(`Condition not met within ${timeout}ms`);
   };
   ```

---

## Step 4: Generate Test Files

### Actions

1. **Create Test File Structure**

   ```
   tests/
   ├── e2e/
   │   └── {feature-name}.spec.ts        # E2E tests (P0-P1)
   ├── api/
   │   └── {feature-name}.api.spec.ts    # API tests (P1-P2)
   ├── component/
   │   └── {ComponentName}.test.tsx      # Component tests (P1-P2)
   ├── unit/
   │   └── {module-name}.test.ts         # Unit tests (P2-P3)
   └── support/
       ├── fixtures/                      # Test fixtures
       ├── factories/                     # Data factories
       └── helpers/                       # Utility functions
   ```

2. **Write E2E Tests (If Applicable)**

   **Follow Given-When-Then format:**

   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('User Authentication', () => {
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

     test('[P1] should display error for invalid credentials', async ({ page }) => {
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
   - Tag tests with priority: `[P0]`, `[P1]`, `[P2]`, `[P3]` in test name
   - One assertion per test (atomic tests)
   - Explicit waits (no hard waits/sleeps)
   - Network-first approach (route interception before navigation)
   - data-testid selectors for stability
   - Clear Given-When-Then structure

3. **Write API Tests (If Applicable)**

   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('User Authentication API', () => {
     test('[P1] POST /api/auth/login - should return token for valid credentials', async ({ request }) => {
       // GIVEN: Valid user credentials
       const credentials = {
         email: 'user@example.com',
         password: 'Password123!',
       };

       // WHEN: Logging in via API
       const response = await request.post('/api/auth/login', {
         data: credentials,
       });

       // THEN: Returns 200 and JWT token
       expect(response.status()).toBe(200);
       const body = await response.json();
       expect(body).toHaveProperty('token');
       expect(body.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/); // JWT format
     });

     test('[P1] POST /api/auth/login - should return 401 for invalid credentials', async ({ request }) => {
       // GIVEN: Invalid credentials
       const credentials = {
         email: 'invalid@example.com',
         password: 'wrongpassword',
       };

       // WHEN: Attempting login
       const response = await request.post('/api/auth/login', {
         data: credentials,
       });

       // THEN: Returns 401 with error
       expect(response.status()).toBe(401);
       const body = await response.json();
       expect(body).toMatchObject({
         error: 'Invalid credentials',
       });
     });
   });
   ```

4. **Write Component Tests (If Applicable)**

   **Knowledge Base Reference**: `component-tdd.md`

   ```typescript
   import { test, expect } from '@playwright/experimental-ct-react';
   import { LoginForm } from './LoginForm';

   test.describe('LoginForm Component', () => {
     test('[P1] should disable submit button when fields are empty', async ({ mount }) => {
       // GIVEN: LoginForm is mounted
       const component = await mount(<LoginForm />);

       // WHEN: Form is initially rendered
       const submitButton = component.locator('button[type="submit"]');

       // THEN: Submit button is disabled
       await expect(submitButton).toBeDisabled();
     });

     test('[P1] should enable submit button when fields are filled', async ({ mount }) => {
       // GIVEN: LoginForm is mounted
       const component = await mount(<LoginForm />);

       // WHEN: User fills in email and password
       await component.locator('[data-testid="email-input"]').fill('user@example.com');
       await component.locator('[data-testid="password-input"]').fill('Password123!');

       // THEN: Submit button is enabled
       const submitButton = component.locator('button[type="submit"]');
       await expect(submitButton).toBeEnabled();
     });
   });
   ```

5. **Write Unit Tests (If Applicable)**

   ```typescript
   import { validateEmail } from './validation';

   describe('Email Validation', () => {
     test('[P2] should return true for valid email', () => {
       // GIVEN: Valid email address
       const email = 'user@example.com';

       // WHEN: Validating email
       const result = validateEmail(email);

       // THEN: Returns true
       expect(result).toBe(true);
     });

     test('[P2] should return false for malformed email', () => {
       // GIVEN: Malformed email addresses
       const invalidEmails = ['notanemail', '@example.com', 'user@', 'user @example.com'];

       // WHEN/THEN: Each should fail validation
       invalidEmails.forEach((email) => {
         expect(validateEmail(email)).toBe(false);
       });
     });
   });
   ```

6. **Apply Network-First Pattern (E2E tests)**

   **Knowledge Base Reference**: `network-first.md`

   **Critical pattern to prevent race conditions:**

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

7. **Enforce Quality Standards**

   **For every test:**
   - ✅ Uses Given-When-Then format
   - ✅ Has clear, descriptive name with priority tag
   - ✅ One assertion per test (atomic)
   - ✅ No hard waits or sleeps (use explicit waits)
   - ✅ Self-cleaning (uses fixtures with auto-cleanup)
   - ✅ Deterministic (no flaky patterns)
   - ✅ Fast (under {max_test_duration} seconds)
   - ✅ Lean (test file under {max_file_lines} lines)

   **Forbidden patterns:**
   - ❌ Hard waits: `await page.waitForTimeout(2000)`
   - ❌ Conditional flow: `if (await element.isVisible()) { ... }`
   - ❌ Try-catch for test logic (use for cleanup only)
   - ❌ Hardcoded test data (use factories)
   - ❌ Page objects (keep tests simple and direct)
   - ❌ Shared state between tests

---

## Step 5: Update Documentation and Scripts

### Actions

1. **Update Test README**

   If `{update_readme}` is true:

   Create or update `tests/README.md` with:
   - Overview of test suite structure
   - How to run tests (all, specific files, by priority)
   - Fixture and factory usage examples
   - Priority tagging convention ([P0], [P1], [P2], [P3])
   - How to write new tests
   - Common patterns and anti-patterns

   **Example section:**

   ````markdown
   ## Running Tests

   ```bash
   # Run all tests
   npm run test:e2e

   # Run by priority
   npm run test:e2e -- --grep "@P0"
   npm run test:e2e -- --grep "@P1"

   # Run specific file
   npm run test:e2e -- user-authentication.spec.ts

   # Run in headed mode
   npm run test:e2e -- --headed

   # Debug specific test
   npm run test:e2e -- user-authentication.spec.ts --debug
   ```
   ````

   ## Priority Tags
   - **[P0]**: Critical paths, run every commit
   - **[P1]**: High priority, run on PR to main
   - **[P2]**: Medium priority, run nightly
   - **[P3]**: Low priority, run on-demand

   ```

   ```

2. **Update package.json Scripts**

   If `{update_package_scripts}` is true:

   Add or update test execution scripts:

   ```json
   {
     "scripts": {
       "test:e2e": "playwright test",
       "test:e2e:p0": "playwright test --grep '@P0'",
       "test:e2e:p1": "playwright test --grep '@P1|@P0'",
       "test:api": "playwright test tests/api",
       "test:component": "playwright test tests/component",
       "test:unit": "vitest"
     }
   }
   ```

3. **Run Test Suite**

   If `{run_tests_after_generation}` is true:
   - Run full test suite locally
   - Capture results (passing/failing counts)
   - Verify no flaky patterns (tests should be deterministic)
   - Document any setup requirements or known issues

---

## Step 6: Generate Automation Summary

### Actions

1. **Create Automation Summary Document**

   Save to `{output_summary}` with:

   **BMad-Integrated Mode:**

   ````markdown
   # Automation Summary - {feature_name}

   **Date:** {date}
   **Story:** {story_id}
   **Coverage Target:** {coverage_target}

   ## Tests Created

   ### E2E Tests (P0-P1)

   - `tests/e2e/user-authentication.spec.ts` (2 tests, 87 lines)
     - [P0] Login with valid credentials → Dashboard loads
     - [P1] Display error for invalid credentials

   ### API Tests (P1-P2)

   - `tests/api/auth.api.spec.ts` (3 tests, 102 lines)
     - [P1] POST /auth/login - valid credentials → 200 + token
     - [P1] POST /auth/login - invalid credentials → 401 + error
     - [P2] POST /auth/login - missing fields → 400 + validation

   ### Component Tests (P1)

   - `tests/component/LoginForm.test.tsx` (2 tests, 45 lines)
     - [P1] Empty fields → submit button disabled
     - [P1] Valid input → submit button enabled

   ## Infrastructure Created

   ### Fixtures

   - `tests/support/fixtures/auth.fixture.ts` - authenticatedUser with auto-cleanup

   ### Factories

   - `tests/support/factories/user.factory.ts` - createUser(), deleteUser()

   ### Helpers

   - `tests/support/helpers/wait-for.ts` - Polling helper for complex conditions

   ## Test Execution

   ```bash
   # Run all new tests
   npm run test:e2e

   # Run by priority
   npm run test:e2e:p0  # Critical paths only
   npm run test:e2e:p1  # P0 + P1 tests
   ```
   ````

   ## Coverage Analysis

   **Total Tests:** 7
   - P0: 1 test (critical path)
   - P1: 5 tests (high priority)
   - P2: 1 test (medium priority)

   **Test Levels:**
   - E2E: 2 tests (user journeys)
   - API: 3 tests (business logic)
   - Component: 2 tests (UI behavior)

   **Coverage Status:**
   - ✅ All acceptance criteria covered
   - ✅ Happy path covered (E2E + API)
   - ✅ Error cases covered (API)
   - ✅ UI validation covered (Component)
   - ⚠️ Edge case: Password reset flow not yet covered (future story)

   ## Definition of Done
   - [x] All tests follow Given-When-Then format
   - [x] All tests use data-testid selectors
   - [x] All tests have priority tags
   - [x] All tests are self-cleaning (fixtures with auto-cleanup)
   - [x] No hard waits or flaky patterns
   - [x] Test files under 300 lines
   - [x] All tests run under 1.5 minutes each
   - [x] README updated with test execution instructions
   - [x] package.json scripts updated

   ## Next Steps
   1. Review generated tests with team
   2. Run tests in CI pipeline: `npm run test:e2e`
   3. Integrate with quality gate: `bmad tea *gate`
   4. Monitor for flaky tests in burn-in loop

   ````

   **Standalone Mode:**
   ```markdown
   # Automation Summary - {target_feature}

   **Date:** {date}
   **Target:** {target_feature} (standalone analysis)
   **Coverage Target:** {coverage_target}

   ## Feature Analysis

   **Source Files Analyzed:**
   - `src/auth/login.ts` - Login logic and validation
   - `src/auth/session.ts` - Session management
   - `src/auth/validation.ts` - Email/password validation

   **Existing Coverage:**
   - E2E tests: 0 found
   - API tests: 0 found
   - Component tests: 0 found
   - Unit tests: 0 found

   **Coverage Gaps Identified:**
   - ❌ No E2E tests for login flow
   - ❌ No API tests for /auth/login endpoint
   - ❌ No component tests for LoginForm
   - ❌ No unit tests for validateEmail()

   ## Tests Created

   {Same structure as BMad-Integrated Mode}

   ## Recommendations

   1. **High Priority (P0-P1):**
      - Add E2E test for password reset flow
      - Add API tests for token refresh endpoint
      - Add component tests for logout button

   2. **Medium Priority (P2):**
      - Add unit tests for session timeout logic
      - Add E2E test for "remember me" functionality

   3. **Future Enhancements:**
      - Consider contract testing for auth API
      - Add visual regression tests for login page
      - Set up burn-in loop for flaky test detection

   ## Definition of Done

   {Same checklist as BMad-Integrated Mode}
   ````

2. **Provide Summary to User**

   Output concise summary:

   ```markdown
   ## Automation Complete

   **Coverage:** {total_tests} tests created across {test_levels} levels
   **Priority Breakdown:** P0: {p0_count}, P1: {p1_count}, P2: {p2_count}, P3: {p3_count}
   **Infrastructure:** {fixture_count} fixtures, {factory_count} factories
   **Output:** {output_summary}

   **Run tests:** `npm run test:e2e`
   **Next steps:** Review tests, run in CI, integrate with quality gate
   ```

---

## Important Notes

### Dual-Mode Operation

**BMad-Integrated Mode** (story available):

- Uses story acceptance criteria for coverage targeting
- Aligns with test-design risk/priority assessment
- Expands ATDD tests with edge cases and negative paths
- Updates BMad status tracking

**Standalone Mode** (no story):

- Analyzes source code independently
- Identifies coverage gaps automatically
- Generates tests based on code analysis
- Works with any project (BMad or non-BMad)

**Auto-discover Mode** (no targets specified):

- Scans codebase for features needing tests
- Prioritizes features with no coverage
- Generates comprehensive test plan

### Avoid Duplicate Coverage

**Critical principle:** Don't test same behavior at multiple levels

**Good coverage:**

- E2E: User can login → Dashboard loads (critical happy path)
- API: POST /auth/login returns correct status codes (variations)
- Component: LoginForm validates input (UI edge cases)

**Bad coverage (duplicate):**

- E2E: User can login → Dashboard loads
- E2E: User can login with different emails → Dashboard loads (unnecessary duplication)
- API: POST /auth/login returns 200 (already covered in E2E)

Use E2E sparingly for critical paths. Use API/Component for variations and edge cases.

### Priority Tagging

**Tag every test with priority in test name:**

```typescript
test('[P0] should login with valid credentials', async ({ page }) => { ... });
test('[P1] should display error for invalid credentials', async ({ page }) => { ... });
test('[P2] should remember login preference', async ({ page }) => { ... });
```

**Enables selective test execution:**

```bash
# Run only P0 tests (critical paths)
npm run test:e2e -- --grep "@P0"

# Run P0 + P1 tests (pre-merge)
npm run test:e2e -- --grep "@P0|@P1"
```

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

### Self-Cleaning Tests

**Every test must clean up its data:**

```typescript
// ✅ CORRECT: Fixture with auto-cleanup
export const test = base.extend({
  testUser: async ({ page }, use) => {
    const user = await createUser();
    await use(user);
    await deleteUser(user.id); // Auto-cleanup
  },
});

// ❌ WRONG: Manual cleanup (can be forgotten)
test('should login', async ({ page }) => {
  const user = await createUser();
  // ... test logic ...
  // Forgot to delete user!
});
```

### File Size Limits

**Keep test files lean (under {max_file_lines} lines):**

- If file exceeds limit, split into multiple files by feature area
- Group related tests in describe blocks
- Extract common setup to fixtures

### Knowledge Base Integration

**Auto-load enabled:**

- `test-levels-framework.md` - Test level selection
- `test-priorities.md` - Priority classification
- `fixture-architecture.md` - Fixture patterns
- `data-factories.md` - Factory patterns
- `selective-testing.md` - Targeted test execution
- `ci-burn-in.md` - Flaky test detection

**Manual reference:**

- Use `tea-index.csv` to find additional fragments
- Load `network-first.md` for route interception patterns
- Load `test-quality.md` for test design principles

---

## Output Summary

After completing this workflow, provide a summary:

````markdown
## Automation Complete

**Mode:** {standalone_mode ? "Standalone" : "BMad-Integrated"}
**Target:** {story_id || target_feature || "Auto-discovered features"}

**Tests Created:**

- E2E: {e2e_count} tests ({p0_count} P0, {p1_count} P1, {p2_count} P2)
- API: {api_count} tests ({p0_count} P0, {p1_count} P1, {p2_count} P2)
- Component: {component_count} tests ({p1_count} P1, {p2_count} P2)
- Unit: {unit_count} tests ({p2_count} P2, {p3_count} P3)

**Infrastructure:**

- Fixtures: {fixture_count} created/enhanced
- Factories: {factory_count} created/enhanced
- Helpers: {helper_count} created/enhanced

**Documentation Updated:**

- ✅ Test README with execution instructions
- ✅ package.json scripts for test execution

**Test Execution:**

```bash
# Run all tests
npm run test:e2e

# Run by priority
npm run test:e2e:p0  # Critical paths only
npm run test:e2e:p1  # P0 + P1 tests

# Run specific file
npm run test:e2e -- {first_test_file}
```
````

**Coverage Status:**

- ✅ {coverage_percentage}% of features covered
- ✅ All P0 scenarios covered
- ✅ All P1 scenarios covered
- ⚠️ {gap_count} coverage gaps identified (documented in summary)

**Quality Checks:**

- ✅ All tests follow Given-When-Then format
- ✅ All tests have priority tags
- ✅ All tests use data-testid selectors
- ✅ All tests are self-cleaning
- ✅ No hard waits or flaky patterns
- ✅ All test files under {max_file_lines} lines

**Output File:** {output_summary}

**Next Steps:**

1. Review generated tests with team
2. Run tests in CI pipeline
3. Monitor for flaky tests in burn-in loop
4. Integrate with quality gate: `bmad tea *gate`

**Knowledge Base References Applied:**

- Test level selection framework (E2E vs API vs Component vs Unit)
- Priority classification (P0-P3)
- Fixture architecture patterns with auto-cleanup
- Data factory patterns using faker
- Selective testing strategies
- Test quality principles

```

---

## Validation

After completing all steps, verify:

- [ ] Execution mode determined (BMad-Integrated, Standalone, or Auto-discover)
- [ ] BMad artifacts loaded if available (story, tech-spec, test-design, PRD)
- [ ] Framework configuration loaded
- [ ] Existing test coverage analyzed (gaps identified)
- [ ] Knowledge base fragments loaded (test-levels, test-priorities, fixture-architecture, data-factories, selective-testing)
- [ ] Automation targets identified (what needs testing)
- [ ] Test levels selected appropriately (E2E, API, Component, Unit)
- [ ] Duplicate coverage avoided (same behavior not tested at multiple levels)
- [ ] Test priorities assigned (P0, P1, P2, P3)
- [ ] Fixture architecture created/enhanced (with auto-cleanup)
- [ ] Data factories created/enhanced (using faker)
- [ ] Helper utilities created/enhanced (if needed)
- [ ] E2E tests written (Given-When-Then, priority tags, data-testid selectors)
- [ ] API tests written (Given-When-Then, priority tags, comprehensive coverage)
- [ ] Component tests written (Given-When-Then, priority tags, UI behavior)
- [ ] Unit tests written (Given-When-Then, priority tags, pure logic)
- [ ] Network-first pattern applied (route interception before navigation)
- [ ] Quality standards enforced (no hard waits, no flaky patterns, self-cleaning, deterministic)
- [ ] Test README updated (execution instructions, priority tagging, patterns)
- [ ] package.json scripts updated (test execution commands)
- [ ] Test suite run locally (results captured)
- [ ] Automation summary created (tests, infrastructure, coverage, DoD)
- [ ] Output file formatted correctly

Refer to `checklist.md` for comprehensive validation criteria.
```
