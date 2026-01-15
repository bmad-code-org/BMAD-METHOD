---
title: "How to Run ATDD with TEA"
description: Generate failing acceptance tests before implementation using TEA's ATDD workflow
---

# How to Run ATDD with TEA

Use TEA's `*atdd` workflow to generate failing acceptance tests BEFORE implementation. This is the TDD (Test-Driven Development) red phase - tests fail first, guide development, then pass.

## When to Use This

- You're about to implement a NEW feature (feature doesn't exist yet)
- You want to follow TDD workflow (red → green → refactor)
- You want tests to guide your implementation
- You're practicing acceptance test-driven development

**Don't use this if:**
- Feature already exists (use `*automate` instead)
- You want tests that pass immediately

## Prerequisites

- BMad Method installed
- TEA agent available
- Test framework setup complete (run `*framework` if needed)
- Story or feature defined with acceptance criteria

**Note:** This guide uses Playwright examples. If using Cypress, commands and syntax will differ (e.g., `cy.get()` instead of `page.locator()`).

## Steps

### 1. Load TEA Agent

Start a fresh chat and load TEA:

```
*tea
```

### 2. Run the ATDD Workflow

```
*atdd
```

### 3. Provide Context

TEA will ask for:

**Story/Feature Details:**
```
We're adding a user profile page where users can:
- View their profile information
- Edit their name and email
- Upload a profile picture
- Save changes with validation
```

**Acceptance Criteria:**
```
Given I'm logged in
When I navigate to /profile
Then I see my current name and email

Given I'm on the profile page
When I click "Edit Profile"
Then I can modify my name and email

Given I've edited my profile
When I click "Save"
Then my changes are persisted
And I see a success message

Given I upload an invalid file type
When I try to save
Then I see an error message
And changes are not saved
```

**Reference Documents** (optional):
- Point to your story file
- Reference PRD or tech spec
- Link to test design (if you ran `*test-design` first)

### 4. Specify Test Levels

TEA will ask what test levels to generate:

**Options:**
- E2E tests (browser-based, full user journey)
- API tests (backend only, faster)
- Component tests (UI components in isolation)
- Mix of levels (see [API Tests First, E2E Later](#api-tests-first-e2e-later) tip)

### Component Testing by Framework

TEA generates component tests using framework-appropriate tools:

| Your Framework | Component Testing Tool                      |
| -------------- | ------------------------------------------- |
| **Cypress**    | Cypress Component Testing (*.cy.tsx)        |
| **Playwright** | Vitest + React Testing Library (*.test.tsx) |

**Example response:**
```
Generate:
- API tests for profile CRUD operations
- E2E tests for the complete profile editing flow
- Component tests for ProfileForm validation (if using Cypress or Vitest)
- Focus on P0 and P1 scenarios
```

### 5. Review Generated Tests

TEA generates **failing tests** in appropriate directories:

#### API Tests (`tests/api/profile.spec.ts`):

**Vanilla Playwright:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Profile API', () => {
  test('should fetch user profile', async ({ request }) => {
    const response = await request.get('/api/profile');

    expect(response.status()).toBe(200);
    const profile = await response.json();
    expect(profile).toHaveProperty('name');
    expect(profile).toHaveProperty('email');
    expect(profile).toHaveProperty('avatarUrl');
  });

  test('should update user profile', async ({ request }) => {
    const response = await request.patch('/api/profile', {
      data: {
        name: 'Updated Name',
        email: 'updated@example.com'
      }
    });

    expect(response.status()).toBe(200);
    const updated = await response.json();
    expect(updated.name).toBe('Updated Name');
    expect(updated.email).toBe('updated@example.com');
  });

  test('should validate email format', async ({ request }) => {
    const response = await request.patch('/api/profile', {
      data: {
        email: 'invalid-email'
      }
    });

    expect(response.status()).toBe(400);
    const error = await response.json();
    expect(error.message).toContain('Invalid email format');
  });
});
```

**With Playwright Utils:**
```typescript
import { test } from '@seontechnologies/playwright-utils/api-request/fixtures';
import { expect } from '@playwright/test';
import { z } from 'zod';

const ProfileSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().url()
});

test.describe('Profile API', () => {
  test('should fetch user profile', async ({ apiRequest }) => {
    const { status, body } = await apiRequest({
      method: 'GET',
      path: '/api/profile'
    }).validateSchema(ProfileSchema);  // Chained validation

    expect(status).toBe(200);
    // Schema already validated, type-safe access
    expect(body.name).toBeDefined();
    expect(body.email).toContain('@');
  });

  test('should update user profile', async ({ apiRequest }) => {
    const { status, body } = await apiRequest({
      method: 'PATCH',
      path: '/api/profile',
      body: {  
        name: 'Updated Name',
        email: 'updated@example.com'
      }
    }).validateSchema(ProfileSchema);  // Chained validation

    expect(status).toBe(200);
    expect(body.name).toBe('Updated Name');
    expect(body.email).toBe('updated@example.com');
  });

  test('should validate email format', async ({ apiRequest }) => {
    const { status, body } = await apiRequest({
      method: 'PATCH',
      path: '/api/profile',
      body: { email: 'invalid-email' }  
    });

    expect(status).toBe(400);
    expect(body.message).toContain('Invalid email format');
  });
});
```

**Key Benefits:**
- Returns `{ status, body }` (cleaner than `response.status()` + `await response.json()`)
- Automatic schema validation with Zod
- Type-safe response bodies
- Automatic retry for 5xx errors
- Less boilerplate

#### E2E Tests (`tests/e2e/profile.spec.ts`):

```typescript
import { test, expect } from '@playwright/test';

test('should edit and save profile', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Navigate to profile
  await page.goto('/profile');

  // Edit profile
  await page.getByRole('button', { name: 'Edit Profile' }).click();
  await page.getByLabel('Name').fill('Updated Name');
  await page.getByRole('button', { name: 'Save' }).click();

  // Verify success
  await expect(page.getByText('Profile updated')).toBeVisible();
});
```

TEA generates additional E2E tests for display, validation errors, etc. based on acceptance criteria.

#### Implementation Checklist

TEA also provides an implementation checklist:

```markdown
## Implementation Checklist

### Backend
- [ ] Create `GET /api/profile` endpoint
- [ ] Create `PATCH /api/profile` endpoint
- [ ] Add email validation middleware
- [ ] Add profile picture upload handling
- [ ] Write API unit tests

### Frontend
- [ ] Create ProfilePage component
- [ ] Implement profile form with validation
- [ ] Add file upload for avatar
- [ ] Handle API errors gracefully
- [ ] Add loading states

### Tests
- [x] API tests generated (failing)
- [x] E2E tests generated (failing)
- [ ] Run tests after implementation (should pass)
```

### 6. Verify Tests Fail

This is the TDD red phase - tests MUST fail before implementation.

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
Running 6 tests using 1 worker

  ✗ tests/api/profile.spec.ts:3:3 › should fetch user profile
    Error: expect(received).toBe(expected)
    Expected: 200
    Received: 404

  ✗ tests/e2e/profile.spec.ts:10:3 › should display current profile information
    Error: page.goto: net::ERR_ABORTED
```

**All tests should fail!** This confirms:
- Feature doesn't exist yet
- Tests will guide implementation
- You have clear success criteria

### 7. Implement the Feature

Now implement the feature following the test guidance:

1. Start with API tests (backend first)
2. Make API tests pass
3. Move to E2E tests (frontend)
4. Make E2E tests pass
5. Refactor with confidence (tests protect you)

### 8. Verify Tests Pass

After implementation, run your test suite.

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
Running 6 tests using 1 worker

  ✓ tests/api/profile.spec.ts:3:3 › should fetch user profile (850ms)
  ✓ tests/api/profile.spec.ts:15:3 › should update user profile (1.2s)
  ✓ tests/api/profile.spec.ts:30:3 › should validate email format (650ms)
  ✓ tests/e2e/profile.spec.ts:10:3 › should display current profile (2.1s)
  ✓ tests/e2e/profile.spec.ts:18:3 › should edit and save profile (3.2s)
  ✓ tests/e2e/profile.spec.ts:35:3 › should show validation error (1.8s)

  6 passed (9.8s)
```

**Green!** You've completed the TDD cycle: red → green → refactor.

## What You Get

### Failing Tests
- API tests for backend endpoints
- E2E tests for user workflows
- Component tests (if requested)
- All tests fail initially (red phase)

### Implementation Guidance
- Clear checklist of what to build
- Acceptance criteria translated to assertions
- Edge cases and error scenarios identified

### TDD Workflow Support
- Tests guide implementation
- Confidence to refactor
- Living documentation of features

## Tips

### Start with Test Design

Run `*test-design` before `*atdd` for better results:

```
*test-design   # Risk assessment and priorities
*atdd          # Generate tests based on design
```

### MCP Enhancements (Optional)

If you have MCP servers configured (`tea_use_mcp_enhancements: true`), TEA can use them during `*atdd`.

**Note:** ATDD is for features that don't exist yet, so recording mode (verify selectors with live UI) only applies if you have skeleton/mockup UI already implemented. For typical ATDD (no UI yet), TEA infers selectors from best practices.

See [Enable MCP Enhancements](/docs/how-to/customization/enable-tea-mcp-enhancements.md) for setup.

### Focus on P0/P1 Scenarios

Don't generate tests for everything at once:

```
Generate tests for:
- P0: Critical path (happy path)
- P1: High value (validation, errors)

Skip P2/P3 for now - add later with *automate
```

### API Tests First, E2E Later

Recommended order:
1. Generate API tests with `*atdd`
2. Implement backend (make API tests pass)
3. Generate E2E tests with `*atdd` (or `*automate`)
4. Implement frontend (make E2E tests pass)

This "outside-in" approach is faster and more reliable.

### Keep Tests Deterministic

TEA generates deterministic tests by default:
- No hard waits (`waitForTimeout`)
- Network-first patterns (wait for responses)
- Explicit assertions (no conditionals)

Don't modify these patterns - they prevent flakiness!

## Related Guides

- [How to Run Test Design](/docs/how-to/workflows/run-test-design.md) - Plan before generating
- [How to Run Automate](/docs/how-to/workflows/run-automate.md) - Tests for existing features
- [How to Set Up Test Framework](/docs/how-to/workflows/setup-test-framework.md) - Initial setup

## Understanding the Concepts

- [Testing as Engineering](/docs/explanation/philosophy/testing-as-engineering.md) - **Why TEA generates quality tests** (foundational)
- [Risk-Based Testing](/docs/explanation/tea/risk-based-testing.md) - Why P0 vs P3 matters
- [Test Quality Standards](/docs/explanation/tea/test-quality-standards.md) - What makes tests good
- [Network-First Patterns](/docs/explanation/tea/network-first-patterns.md) - Avoiding flakiness

## Reference

- [Command: *atdd](/docs/reference/tea/commands.md#atdd) - Full command reference
- [TEA Configuration](/docs/reference/tea/configuration.md) - MCP and Playwright Utils options

---

Generated with [BMad Method](https://bmad-method.org) - TEA (Test Architect)
