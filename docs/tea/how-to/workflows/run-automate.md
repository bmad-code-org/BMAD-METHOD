---
title: "How to Run Automate with TEA"
description: Expand test automation coverage after implementation using TEA's automate workflow
---

# How to Run Automate with TEA

Use TEA's `automate` workflow to generate comprehensive tests for existing features. Unlike `*atdd`, these tests pass immediately because the feature already exists.

## When to Use This

- Feature already exists and works
- Want to add test coverage to existing code
- Need tests that pass immediately
- Expanding existing test suite
- Adding tests to legacy code

**Don't use this if:**
- Feature doesn't exist yet (use `atdd` instead)
- Want failing tests to guide development (use `atdd` for TDD)

## Prerequisites

- BMad Method installed
- TEA agent available
- Test framework setup complete (run `framework` if needed)
- Feature implemented and working

**Note:** This guide uses Playwright examples. If using Cypress, commands and syntax will differ.

## Steps

### 1. Load TEA Agent

Start a fresh chat and load TEA:

```
tea
```

### 2. Run the Automate Workflow

```
automate
```

### 3. Provide Context

TEA will ask for context about what you're testing.

#### Option A: BMad-Integrated Mode (Recommended)

If you have BMad artifacts (stories, test designs, PRDs):

**What are you testing?**
```
I'm testing the user profile feature we just implemented.
Story: story-profile-management.md
Test Design: test-design-epic-1.md
```

**Reference documents:**
- Story file with acceptance criteria
- Test design document (if available)
- PRD sections relevant to this feature
- Tech spec (if available)

**Existing tests:**
```
We have basic tests in tests/e2e/profile-view.spec.ts
Avoid duplicating that coverage
```

TEA will analyze your artifacts and generate comprehensive tests that:
- Cover acceptance criteria from the story
- Follow priorities from test design (P0 → P1 → P2)
- Avoid duplicating existing tests
- Include edge cases and error scenarios

#### Option B: Standalone Mode

If you're using TEA Solo or don't have BMad artifacts:

**What are you testing?**
```
TodoMVC React application at https://todomvc.com/examples/react/dist/
Features: Create todos, mark as complete, filter by status, delete todos
```

**Specific scenarios to cover:**
```
- Creating todos (happy path)
- Marking todos as complete/incomplete
- Filtering (All, Active, Completed)
- Deleting todos
- Edge cases (empty input, long text)
```

TEA will analyze the application and generate tests based on your description.

### 4. Specify Test Levels

TEA will ask which test levels to generate:

**Options:**
- **E2E tests** - Full browser-based user workflows
- **API tests** - Backend endpoint testing (faster, more reliable)
- **Component tests** - UI component testing in isolation (framework-dependent)
- **Mix** - Combination of levels (recommended)

**Example response:**
```
Generate:
- API tests for all CRUD operations
- E2E tests for critical user workflows (P0)
- Focus on P0 and P1 scenarios
- Skip P3 (low priority edge cases)
```

### 5. Review Generated Tests

TEA generates a comprehensive test suite with multiple test levels.

#### API Tests (`tests/api/profile.spec.ts`):

**Vanilla Playwright:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Profile API', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    // Manual auth token fetch
    const response = await request.post('/api/auth/login', {
      data: { email: 'test@example.com', password: 'password123' }
    });
    const { token } = await response.json();
    authToken = token;
  });

  test('should fetch user profile', async ({ request }) => {
    const response = await request.get('/api/profile', {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    expect(response.ok()).toBeTruthy();
    const profile = await response.json();
    expect(profile).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      email: expect.any(String)
    });
  });

  test('should update profile successfully', async ({ request }) => {
    const response = await request.patch('/api/profile', {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        name: 'Updated Name',
        bio: 'Test bio'
      }
    });

    expect(response.ok()).toBeTruthy();
    const updated = await response.json();
    expect(updated.name).toBe('Updated Name');
    expect(updated.bio).toBe('Test bio');
  });

  test('should validate email format', async ({ request }) => {
    const response = await request.patch('/api/profile', {
      headers: { Authorization: `Bearer ${authToken}` },
      data: { email: 'invalid-email' }
    });

    expect(response.status()).toBe(400);
    const error = await response.json();
    expect(error.message).toContain('Invalid email');
  });

  test('should require authentication', async ({ request }) => {
    const response = await request.get('/api/profile');
    expect(response.status()).toBe(401);
  });
});
```

**With Playwright Utils:**
```typescript
import { test as base, expect } from '@playwright/test';
import { test as apiRequestFixture } from '@seontechnologies/playwright-utils/api-request/fixtures';
import { createAuthFixtures } from '@seontechnologies/playwright-utils/auth-session';
import { mergeTests } from '@playwright/test';
import { z } from 'zod';

const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email()
});

// Merge API and auth fixtures
const authFixtureTest = base.extend(createAuthFixtures());
export const testWithAuth = mergeTests(apiRequestFixture, authFixtureTest);

testWithAuth.describe('Profile API', () => {
  testWithAuth('should fetch user profile', async ({ apiRequest, authToken }) => {
    const { status, body } = await apiRequest({
      method: 'GET',
      path: '/api/profile',
      headers: { Authorization: `Bearer ${authToken}` }
    }).validateSchema(ProfileSchema);  // Chained validation

    expect(status).toBe(200);
    // Schema already validated, type-safe access
    expect(body.name).toBeDefined();
  });

  testWithAuth('should update profile successfully', async ({ apiRequest, authToken }) => {
    const { status, body } = await apiRequest({
      method: 'PATCH',
      path: '/api/profile',
      body: { name: 'Updated Name', bio: 'Test bio' },  
      headers: { Authorization: `Bearer ${authToken}` }
    }).validateSchema(ProfileSchema);  // Chained validation

    expect(status).toBe(200);
    expect(body.name).toBe('Updated Name');
  });

  testWithAuth('should validate email format', async ({ apiRequest, authToken }) => {
    const { status, body } = await apiRequest({
      method: 'PATCH',
      path: '/api/profile',
      body: { email: 'invalid-email' },  
      headers: { Authorization: `Bearer ${authToken}` }
    });

    expect(status).toBe(400);
    expect(body.message).toContain('Invalid email');
  });
});
```

**Key Differences:**
- `authToken` fixture (persisted, reused across tests)
- `apiRequest` returns `{ status, body }` (cleaner)
- Schema validation with Zod (type-safe)
- Automatic retry for 5xx errors
- Less boilerplate (no manual `await response.json()` everywhere)

#### E2E Tests (`tests/e2e/profile.spec.ts`):

```typescript
import { test, expect } from '@playwright/test';

test('should edit profile', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Edit profile
  await page.goto('/profile');
  await page.getByRole('button', { name: 'Edit Profile' }).click();
  await page.getByLabel('Name').fill('New Name');
  await page.getByRole('button', { name: 'Save' }).click();

  // Verify success
  await expect(page.getByText('Profile updated')).toBeVisible();
});
```

TEA generates additional tests for validation, edge cases, etc. based on priorities.

#### Fixtures (`tests/support/fixtures/profile.ts`):

**Vanilla Playwright:**
```typescript
import { test as base, Page } from '@playwright/test';

type ProfileFixtures = {
  authenticatedPage: Page;
  testProfile: {
    name: string;
    email: string;
    bio: string;
  };
};

export const test = base.extend<ProfileFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Manual login flow
    await page.goto('/login');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL(/\/dashboard/);

    await use(page);
  },

  testProfile: async ({ request }, use) => {
    // Static test data
    const profile = {
      name: 'Test User',
      email: 'test@example.com',
      bio: 'Test bio'
    };

    await use(profile);
  }
});
```

**With Playwright Utils:**
```typescript
import { test as base } from '@playwright/test';
import { createAuthFixtures } from '@seontechnologies/playwright-utils/auth-session';
import { mergeTests } from '@playwright/test';
import { faker } from '@faker-js/faker';

type ProfileFixtures = {
  testProfile: {
    name: string;
    email: string;
    bio: string;
  };
};

// Merge auth fixtures with custom fixtures
const authTest = base.extend(createAuthFixtures());
const profileTest = base.extend<ProfileFixtures>({
  testProfile: async ({}, use) => {
    // Dynamic test data with faker
    const profile = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      bio: faker.person.bio()
    };

    await use(profile);
  }
});

export const test = mergeTests(authTest, profileTest);
export { expect } from '@playwright/test';
```

**Usage:**
```typescript
import { test, expect } from '../support/fixtures/profile';

test('should update profile', async ({ page, authToken, testProfile }) => {
  // authToken from auth-session (automatic, persisted)
  // testProfile from custom fixture (dynamic data)

  await page.goto('/profile');
  // Test with dynamic, unique data
});
```

**Key Benefits:**
- `authToken` fixture (persisted token, no manual login)
- Dynamic test data with faker (no conflicts)
- Fixture composition with mergeTests
- Reusable across test files

### 6. Review Additional Artifacts

TEA also generates:

#### Updated README (`tests/README.md`):

```markdown
# Test Suite

## Running Tests

### All Tests
npm test

### Specific Levels
npm run test:api      # API tests only
npm run test:e2e      # E2E tests only
npm run test:smoke    # Smoke tests (@smoke tag)

### Single File
npx playwright test tests/api/profile.spec.ts

## Test Structure

tests/
├── api/              # API tests (fast, reliable)
├── e2e/              # E2E tests (full workflows)
├── fixtures/         # Shared test utilities
└── README.md

## Writing Tests

Follow the patterns in existing tests:
- Use fixtures for authentication
- Network-first patterns (no hard waits)
- Explicit assertions
- Self-cleaning tests
```

#### Definition of Done Summary:

```markdown
## Test Quality Checklist

✅ All tests pass on first run
✅ No hard waits (waitForTimeout)
✅ No conditionals for flow control
✅ Assertions are explicit
✅ Tests clean up after themselves
✅ Tests can run in parallel
✅ Execution time < 1.5 minutes per test
✅ Test files < 300 lines
```

### 7. Run the Tests

All tests should pass immediately since the feature exists:

**For Playwright:**
```bash
npx playwright test
```

**For Cypress:**
```bash
npx cypress run
```

Expected output:
```
Running 15 tests using 4 workers

  ✓ tests/api/profile.spec.ts (4 tests) - 2.1s
  ✓ tests/e2e/profile-workflow.spec.ts (2 tests) - 5.3s

  15 passed (7.4s)
```

**All green!** Tests pass because feature already exists.

### 8. Review Test Coverage

Check which scenarios are covered:

```bash
# View test report
npx playwright show-report

# Check coverage (if configured)
npm run test:coverage
```

Compare against:
- Acceptance criteria from story
- Test priorities from test design
- Edge cases and error scenarios

## What You Get

### Comprehensive Test Suite
- **API tests** - Fast, reliable backend testing
- **E2E tests** - Critical user workflows
- **Component tests** - UI component testing (if requested)
- **Fixtures** - Shared utilities and setup

### Component Testing by Framework

TEA supports component testing using framework-appropriate tools:

| Your Framework | Component Testing Tool         | Tests Location                            |
| -------------- | ------------------------------ | ----------------------------------------- |
| **Cypress**    | Cypress Component Testing      | `tests/component/`                        |
| **Playwright** | Vitest + React Testing Library | `tests/component/` or `src/**/*.test.tsx` |

**Note:** Component tests use separate tooling from E2E tests:
- Cypress users: TEA generates Cypress Component Tests
- Playwright users: TEA generates Vitest + React Testing Library tests

### Quality Features
- **Network-first patterns** - Wait for actual responses, not timeouts
- **Deterministic tests** - No flakiness, no conditionals
- **Self-cleaning** - Tests don't leave test data behind
- **Parallel-safe** - Can run all tests concurrently

### Documentation
- **Updated README** - How to run tests
- **Test structure explanation** - Where tests live
- **Definition of Done** - Quality standards

## Tips

### Start with Test Design

Run `test-design` before `automate` for better results:

```
test-design   # Risk assessment, priorities
automate      # Generate tests based on priorities
```

TEA will focus on P0/P1 scenarios and skip low-value tests.

### Prioritize Test Levels

Not everything needs E2E tests:

**Good strategy:**
```
- P0 scenarios: API + E2E tests
- P1 scenarios: API tests only
- P2 scenarios: API tests (happy path)
- P3 scenarios: Skip or add later
```

**Why?**
- API tests are 10x faster than E2E
- API tests are more reliable (no browser flakiness)
- E2E tests reserved for critical user journeys

### Avoid Duplicate Coverage

Tell TEA about existing tests:

```
We already have tests in:
- tests/e2e/profile-view.spec.ts (viewing profile)
- tests/api/auth.spec.ts (authentication)

Don't duplicate that coverage
```

TEA will analyze existing tests and only generate new scenarios.

### MCP Enhancements (Optional)

If you have MCP servers configured (`tea_use_mcp_enhancements: true`), TEA can use them during `automate` for:

- **Healing mode:** Fix broken selectors, update assertions, enhance with trace analysis
- **Recording mode:** Verify selectors with live browser, capture network requests

No prompts - TEA uses MCPs automatically when available. See [Enable MCP Enhancements](/docs/tea/how-to/customization/enable-tea-mcp-enhancements.md) for setup.

### Generate Tests Incrementally

Don't generate all tests at once:

**Iteration 1:**
```
Generate P0 tests only (critical path)
Run: automate
```

**Iteration 2:**
```
Generate P1 tests (high value scenarios)
Run: automate
Tell TEA to avoid P0 coverage
```

**Iteration 3:**
```
Generate P2 tests (if time permits)
Run: automate
```

This iterative approach:
- Provides fast feedback
- Allows validation before proceeding
- Keeps test generation focused

## Common Issues

### Tests Pass But Coverage Is Incomplete

**Problem:** Tests pass but don't cover all scenarios.

**Cause:** TEA wasn't given complete context.

**Solution:** Provide more details:
```
Generate tests for:
- All acceptance criteria in story-profile.md
- Error scenarios (validation, authorization)
- Edge cases (empty fields, long inputs)
```

### Too Many Tests Generated

**Problem:** TEA generated 50 tests for a simple feature.

**Cause:** Didn't specify priorities or scope.

**Solution:** Be specific:
```
Generate ONLY:
- P0 and P1 scenarios
- API tests for all scenarios
- E2E tests only for critical workflows
- Skip P2/P3 for now
```

### Tests Duplicate Existing Coverage

**Problem:** New tests cover the same scenarios as existing tests.

**Cause:** Didn't tell TEA about existing tests.

**Solution:** Specify existing coverage:
```
We already have these tests:
- tests/api/profile.spec.ts (GET /api/profile)
- tests/e2e/profile-view.spec.ts (viewing profile)

Generate tests for scenarios NOT covered by those files
```

### MCP Enhancements for Better Selectors

If you have MCP servers configured, TEA verifies selectors against live browser. Otherwise, TEA generates accessible selectors (`getByRole`, `getByLabel`) by default.

Setup: Answer "Yes" to MCPs in BMad installer + configure MCP servers in your IDE. See [Enable MCP Enhancements](/docs/tea/how-to/customization/enable-tea-mcp-enhancements.md).

## Related Guides

- [How to Run Test Design](/docs/tea/how-to/workflows/run-test-design.md) - Plan before generating
- [How to Run ATDD](/docs/tea/how-to/workflows/run-atdd.md) - Failing tests before implementation
- [How to Run Test Review](/docs/tea/how-to/workflows/run-test-review.md) - Audit generated quality

## Understanding the Concepts

- [Testing as Engineering](/docs/tea/explanation/testing-as-engineering.md) - **Why TEA generates quality tests** (foundational)
- [Risk-Based Testing](/docs/tea/explanation/risk-based-testing.md) - Why prioritize P0 over P3
- [Test Quality Standards](/docs/tea/explanation/test-quality-standards.md) - What makes tests good
- [Fixture Architecture](/docs/tea/explanation/fixture-architecture.md) - Reusable test patterns

## Reference

- [Command: *automate](/docs/tea/reference/commands.md#automate) - Full command reference
- [TEA Configuration](/docs/tea/reference/configuration.md) - MCP and Playwright Utils options

---

Generated with [BMad Method](https://bmad-method.org) - TEA (Test Architect)
