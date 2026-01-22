---
title: "Getting Started with Test Architect"
description: Learn Test Architect fundamentals by generating and running tests for an existing demo app in 30 minutes
---

Welcome! **Test Architect (TEA) Lite** is the simplest way to get started with TEA - just use `*automate` to generate tests for existing features. Perfect for beginners who want to learn TEA fundamentals quickly.

## What You'll Build

By the end of this 30-minute tutorial, you'll have:
- A working Playwright test framework
- Your first risk-based test plan
- Passing tests for an existing demo app feature

:::note[Prerequisites]
- Node.js installed (v20 or later)
- 30 minutes of focused time
- We'll use TodoMVC (<https://todomvc.com/examples/react/dist/>) as our demo app
:::

:::tip[Quick Path]
Load TEA (`*tea`) → scaffold framework (`*framework`) → create test plan (`*test-design`) → generate tests (`*automate`) → run with `npx playwright test`.
:::

## TEA Approaches Explained

Before we start, understand the three ways to use TEA:

- **TEA Lite** (this tutorial): Beginner using just `*automate` to test existing features
- **TEA Solo**: Using TEA standalone without full BMad Method integration
- **TEA Integrated**: Full BMad Method with all TEA workflows across phases

This tutorial focuses on **TEA Lite** - the fastest way to see TEA in action.

## Step 0: Setup (2 minutes)

We'll test TodoMVC, a standard demo app used across testing documentation.

**Demo App:** <https://todomvc.com/examples/react/dist/>

No installation needed - TodoMVC runs in your browser. Open the link above and:
1. Add a few todos (type and press Enter)
2. Mark some as complete (click checkbox)
3. Try the "All", "Active", "Completed" filters

You've just explored the features we'll test!

## Step 1: Install BMad and Scaffold Framework (10 minutes)

### Install BMad Method

Install BMad (see installation guide for latest command).

When prompted:
- **Select modules:** Choose "BMM: BMad Method" (press Space, then Enter)
- **Project name:** Keep default or enter your project name
- **Experience level:** Choose "beginner" for this tutorial
- **Planning artifacts folder:** Keep default
- **Implementation artifacts folder:** Keep default
- **Project knowledge folder:** Keep default
- **Enable TEA Playwright Model Context Protocol (MCP) enhancements?** Choose "No" for now (we'll explore this later)
- **Using playwright-utils?** Choose "No" for now (we'll explore this later)

BMad is now installed! You'll see a `_bmad/` folder in your project.

### Load TEA Agent

Start a new chat with your AI assistant (Claude, etc.) and type:

```
*tea
```

This loads the Test Architect agent. You'll see TEA's menu with available workflows.

### Scaffold Test Framework

In your chat, run:

```
*framework
```

TEA will ask you questions:

**Q: What's your tech stack?**
A: "We're testing a React web application (TodoMVC)"

**Q: Which test framework?**
A: "Playwright"

**Q: Testing scope?**
A: "End-to-end (E2E) testing for a web application"

**Q: Continuous integration/continuous deployment (CI/CD) platform?**
A: "GitHub Actions" (or your preference)

TEA will generate:
- `tests/` directory with Playwright config
- `playwright.config.ts` with base configuration
- Sample test structure
- `.env.example` for environment variables
- `.nvmrc` for Node version

**Verify the setup:**

```bash
npm install
npx playwright install
```

You now have a production-ready test framework!

## Step 2: Your First Test Design (5 minutes)

Test design is where TEA shines - risk-based planning before writing tests.

### Run Test Design

In your chat with TEA, run:

```
*test-design
```

**Q: System-level or epic-level?**
A: "Epic-level - I want to test TodoMVC's basic functionality"

**Q: What feature are you testing?**
A: "TodoMVC's core operations - creating, completing, and deleting todos"

**Q: Any specific risks or concerns?**
A: "We want to ensure the filter buttons (All, Active, Completed) work correctly"

TEA will analyze and create `test-design-epic-1.md` with:

1. **Risk Assessment**
   - Probability × Impact scoring
   - Risk categories (TECH, SEC, PERF, DATA, BUS, OPS)
   - High-risk areas identified

2. **Test Priorities**
   - P0: Critical path (creating and displaying todos)
   - P1: High value (completing todos, filters)
   - P2: Medium value (deleting todos)
   - P3: Low value (edge cases)

3. **Coverage Strategy**
   - E2E tests for user workflows
   - Which scenarios need testing
   - Suggested test structure

**Review the test design file** - notice how TEA provides a systematic approach to what needs testing and why.

## Step 3: Generate Tests for Existing Features (5 minutes)

Now the magic happens - TEA generates tests based on your test design.

### Run Automate

In your chat with TEA, run:

```
*automate
```

**Q: What are you testing?**
A: "TodoMVC React app at <https://todomvc.com/examples/react/dist/> - focus on the test design we just created"

**Q: Reference existing docs?**
A: "Yes, use test-design-epic-1.md"

**Q: Any specific test scenarios?**
A: "Cover the P0 and P1 scenarios from the test design"

TEA will generate:

**`tests/e2e/todomvc.spec.ts`** with tests like:
```typescript
import { test, expect } from '@playwright/test';

test.describe('TodoMVC - Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/react/dist/');
  });

  test('should create a new todo', async ({ page }) => {
    // TodoMVC uses a simple input without placeholder or test IDs
    const todoInput = page.locator('.new-todo');
    await todoInput.fill('Buy groceries');
    await todoInput.press('Enter');

    // Verify todo appears in list
    await expect(page.locator('.todo-list li')).toContainText('Buy groceries');
  });

  test('should mark todo as complete', async ({ page }) => {
    // Create a todo
    const todoInput = page.locator('.new-todo');
    await todoInput.fill('Complete tutorial');
    await todoInput.press('Enter');

    // Mark as complete using the toggle checkbox
    await page.locator('.todo-list li .toggle').click();

    // Verify completed state
    await expect(page.locator('.todo-list li')).toHaveClass(/completed/);
  });

  test('should filter todos by status', async ({ page }) => {
    // Create multiple todos
    const todoInput = page.locator('.new-todo');
    await todoInput.fill('Buy groceries');
    await todoInput.press('Enter');
    await todoInput.fill('Write tests');
    await todoInput.press('Enter');

    // Complete the first todo ("Buy groceries")
    await page.locator('.todo-list li .toggle').first().click();

    // Test Active filter (shows only incomplete todos)
    await page.locator('.filters a[href="#/active"]').click();
    await expect(page.locator('.todo-list li')).toHaveCount(1);
    await expect(page.locator('.todo-list li')).toContainText('Write tests');

    // Test Completed filter (shows only completed todos)
    await page.locator('.filters a[href="#/completed"]').click();
    await expect(page.locator('.todo-list li')).toHaveCount(1);
    await expect(page.locator('.todo-list li')).toContainText('Buy groceries');
  });
});
```

TEA also creates:
- **`tests/README.md`** - How to run tests, project conventions
- **Definition of Done summary** - What makes a test "good"

### With Playwright Utils (Optional Enhancement)

If you have `tea_use_playwright_utils: true` in your config, TEA generates tests using production-ready utilities:

**Vanilla Playwright:**
```typescript
test('should mark todo as complete', async ({ page, request }) => {
  // Manual API call
  const response = await request.post('/api/todos', {
    data: { title: 'Complete tutorial' }
  });
  const todo = await response.json();

  await page.goto('/');
  await page.locator(`.todo-list li:has-text("${todo.title}") .toggle`).click();
  await expect(page.locator('.todo-list li')).toHaveClass(/completed/);
});
```

**With Playwright Utils:**
```typescript
import { test } from '@seontechnologies/playwright-utils/api-request/fixtures';
import { expect } from '@playwright/test';

test('should mark todo as complete', async ({ page, apiRequest }) => {
  // Typed API call with cleaner syntax
  const { status, body: todo } = await apiRequest({
    method: 'POST',
    path: '/api/todos',
    body: { title: 'Complete tutorial' }  
  });

  expect(status).toBe(201);
  await page.goto('/');
  await page.locator(`.todo-list li:has-text("${todo.title}") .toggle`).click();
  await expect(page.locator('.todo-list li')).toHaveClass(/completed/);
});
```

**Benefits:**
- Type-safe API responses (`{ status, body }`)
- Automatic retry for 5xx errors
- Built-in schema validation
- Cleaner, more maintainable code

See [Integrate Playwright Utils](/docs/how-to/customization/integrate-playwright-utils.md) to enable this.

## Step 4: Run and Validate (5 minutes)

Time to see your tests in action!

### Run the Tests

```bash
npx playwright test
```

You should see:
```
Running 3 tests using 1 worker

  ✓ tests/e2e/todomvc.spec.ts:7:3 › should create a new todo (2s)
  ✓ tests/e2e/todomvc.spec.ts:15:3 › should mark todo as complete (2s)
  ✓ tests/e2e/todomvc.spec.ts:30:3 › should filter todos by status (3s)

  3 passed (7s)
```

All green! Your tests are passing against the existing TodoMVC app.

### View Test Report

```bash
npx playwright show-report
```

Opens a beautiful HTML report showing:
- Test execution timeline
- Screenshots (if any failures)
- Trace viewer for debugging

### What Just Happened?

You used **TEA Lite** to:
1. Scaffold a production-ready test framework (`*framework`)
2. Create a risk-based test plan (`*test-design`)
3. Generate comprehensive tests (`*automate`)
4. Run tests against an existing application

All in 30 minutes!

## What You Learned

Congratulations! You've completed the TEA Lite tutorial. You learned:

### Quick Reference

| Command        | Purpose                              |
| -------------- | ------------------------------------ |
| `*tea`         | Load the TEA agent                   |
| `*framework`   | Scaffold test infrastructure         |
| `*test-design` | Risk-based test planning             |
| `*automate`    | Generate tests for existing features |

### TEA Principles
- **Risk-based testing** - Depth scales with impact (P0 vs P3)
- **Test design first** - Plan before generating
- **Network-first patterns** - Tests wait for actual responses (no hard waits)
- **Production-ready from day one** - Not toy examples

:::tip[Key Takeaway]
TEA Lite (just `*automate`) is perfect for beginners learning TEA fundamentals, testing existing applications, quick test coverage expansion, and teams wanting fast results.
:::

## Understanding ATDD vs Automate

This tutorial used `*automate` to generate tests for **existing features** (tests pass immediately).

**When to use `*automate`:**
- Feature already exists
- Want to add test coverage
- Tests should pass on first run

**When to use `*atdd` (Acceptance Test-Driven Development):**
- Feature doesn't exist yet (Test-Driven Development workflow)
- Want failing tests BEFORE implementation
- Following red → green → refactor cycle

See [How to Run ATDD](/docs/how-to/workflows/run-atdd.md) for the test-drive development (TDD) approach.

## Next Steps

### Level Up Your TEA Skills

**How-To Guides** (task-oriented):
- [How to Run Test Design](/docs/how-to/workflows/run-test-design.md) - Deep dive into risk assessment
- [How to Run ATDD](/docs/how-to/workflows/run-atdd.md) - Generate failing tests first (TDD)
- [How to Set Up CI Pipeline](/docs/how-to/workflows/setup-ci.md) - Automate test execution
- [How to Review Test Quality](/docs/how-to/workflows/run-test-review.md) - Audit test quality

**Explanation** (understanding-oriented):
- [TEA Overview](/docs/explanation/features/tea-overview.md) - Complete TEA capabilities
- [Testing as Engineering](/docs/explanation/philosophy/testing-as-engineering.md) - **Why TEA exists** (problem + solution)
- [Risk-Based Testing](/docs/explanation/tea/risk-based-testing.md) - How risk scoring works

**Reference** (quick lookup):
- [TEA Command Reference](/docs/reference/tea/commands.md) - All 8 TEA workflows
- [TEA Configuration](/docs/reference/tea/configuration.md) - Config options
- [Glossary](/docs/reference/glossary/index.md) - TEA terminology

### Try TEA Solo

Ready for standalone usage without full BMad Method? Use TEA Solo:
- Run any TEA workflow independently
- Bring your own requirements
- Use on non-BMad projects

See [TEA Overview](/docs/explanation/features/tea-overview.md) for engagement models.

### Go Full TEA Integrated

Want the complete quality operating model? Try TEA Integrated with BMad Method:
- Phase 2: Planning with non-functional requirements (NFR) assessment
- Phase 3: Architecture testability review
- Phase 4: Per-epic test design → ATDD → automate
- Release Gate: Coverage traceability and gate decisions

See [BMad Method Documentation](/) for the full workflow.

## Common Questions

- [Why can't my tests find elements?](#why-cant-my-tests-find-elements)
- [How do I fix network timeouts?](#how-do-i-fix-network-timeouts)

### Why can't my tests find elements?

TodoMVC doesn't use test IDs or accessible roles consistently. The selectors in this tutorial use CSS classes that match TodoMVC's actual structure:

```typescript
// TodoMVC uses these CSS classes:
page.locator('.new-todo')      // Input field
page.locator('.todo-list li')  // Todo items
page.locator('.toggle')        // Checkbox

// If testing your own app, prefer accessible selectors:
page.getByRole('textbox')
page.getByRole('listitem')
page.getByRole('checkbox')
```

In production code, use accessible selectors (`getByRole`, `getByLabel`, `getByText`) for better resilience. TodoMVC is used here for learning, not as a selector best practice example.

### How do I fix network timeouts?

Increase timeout in `playwright.config.ts`:

```typescript
use: {
  timeout: 30000, // 30 seconds
}
```

## Getting Help

- **Documentation:** <https://docs.bmad-method.org>
- **GitHub Issues:** <https://github.com/bmad-code-org/bmad-method/issues>
- **Discord:** Join the BMAD community
