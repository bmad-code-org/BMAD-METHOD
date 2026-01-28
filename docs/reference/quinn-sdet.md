---
title: Quinn - SDET Agent
description: Quick test automation with standard Playwright patterns
---

# Quinn - Software Development Engineer in Test (SDET)

Quinn is a beginner-friendly SDET agent built into BMad Method for quick test automation.

## Quick Start

```bash
# Load Quinn
quinn

# Or trigger directly
QA

# Or use full command
/bmad:bmm:quick-automate
```

## What Quinn Does

Generates tests quickly for existing features using **standard Playwright patterns**.

**Focus:**

- Fast coverage over perfect architecture
- Happy path + critical edge cases
- Standard Playwright APIs (no advanced utilities)
- Beginner-friendly approach

## Example Workflow

**1. Trigger Quinn:**

```
QA
```

**2. Specify what to test:**

```
Generate tests for the user login feature
```

**3. Quinn generates:**

- API tests (if applicable)
- E2E tests (if UI exists)
- Test summary with coverage metrics

**4. Verify tests pass:**

```bash
npx playwright test
```

**Done!** Tests are ready to run in CI.

## Quinn vs Test Architect (TEA)

| Feature                | Quinn (SDET)              | Test Architect (TEA)                              |
| ---------------------- | ------------------------- | ------------------------------------------------- |
| **Availability**       | Built-in BMM              | Optional module (install separately)              |
| **Workflows**          | 1 (Quick Automate)        | 8 (Framework, CI, Design, ATDD, Automate, Review, Trace, NFR) |
| **Complexity**         | Beginner-friendly         | Enterprise-grade                                  |
| **Test Patterns**      | Standard Playwright       | Playwright Utils + Knowledge Base (34 fragments)  |
| **Features**           | Basic coverage            | Risk-based planning, quality gates, NFR assessment |
| **Trigger**            | `QA`                      | `TF`, `CI`, `TD`, `AT`, `TA`, `RV`, `TR`, `NR`   |
| **Use Case**           | Small projects, quick tests | Enterprise, compliance, comprehensive strategy   |
| **Learning Curve**     | Easy                      | Moderate                                          |

## When to Use Quinn

✅ **Use Quinn for:**

- Small to medium projects
- Quick test coverage
- Standard Playwright patterns
- Beginner teams
- Rapid iteration

## When to Use Test Architect

🚀 **Upgrade to TEA for:**

- Enterprise projects
- Risk-based test strategy
- Comprehensive test planning (ATDD)
- Quality gates and release decisions
- NFR assessment (security, performance, reliability)
- Requirements traceability
- Advanced patterns (Playwright Utils, MCP)

**Install TEA:**

```bash
npx bmad-method install
# Select: Test Architect (TEA)
```

**Documentation:** [https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/)

## Generated Test Pattern

**API Test Example:**

```typescript
import { test, expect } from '@playwright/test';

test('API returns user data', async ({ request }) => {
  const response = await request.get('/api/users/1');
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data).toHaveProperty('id');
  expect(data).toHaveProperty('name');
});
```

**E2E Test Example:**

```typescript
import { test, expect } from '@playwright/test';

test('user can login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Welcome')).toBeVisible();
});
```

## Validation

Quinn includes a simple checklist to verify:

- ✅ All tests run successfully
- ✅ Tests use proper locators
- ✅ Tests cover happy path + errors
- ✅ No hardcoded waits
- ✅ Tests are independent

---

**Keep it simple, ship it, iterate!** 🚀

For advanced testing needs, see [Test Architect (TEA)](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/).
