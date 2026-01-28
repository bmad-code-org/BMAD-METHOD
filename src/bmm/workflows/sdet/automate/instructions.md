# Quinn SDET - Quick Automate

**Goal**: Generate tests quickly for existing features using standard Playwright patterns.

## Instructions

### Step 1: Identify Features

Ask user what to test:

- Specific feature/component name
- Directory to scan (e.g., `src/components/`)
- Or auto-discover features in the codebase

### Step 2: Generate API Tests (if applicable)

For API endpoints/services:

```typescript
import { test, expect } from '@playwright/test';

test('API endpoint returns success', async ({ request }) => {
  const response = await request.get('/api/endpoint');
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data).toHaveProperty('expectedField');
});
```

**Patterns:**

- Use `request` fixture for API testing
- Test status codes (200, 400, 404, 500)
- Validate response structure
- Test happy path + 1-2 error cases

### Step 3: Generate E2E Tests (if UI exists)

For UI features:

```typescript
import { test, expect } from '@playwright/test';

test('user can complete main workflow', async ({ page }) => {
  await page.goto('/feature');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Success')).toBeVisible();
});
```

**Patterns:**

- Use standard Playwright locators: `getByRole`, `getByText`, `getByLabel`
- Focus on user interactions (clicks, form fills, navigation)
- Assert visible outcomes (text appears, navigation happens)
- Keep tests linear and simple (no complex fixture setups)

### Step 4: Run Tests

Execute tests to verify they pass:

```bash
npx playwright test
```

If failures occur, fix them immediately.

### Step 5: Create Summary

Output markdown summary:

```markdown
# Test Automation Summary

## Generated Tests

### API Tests
- [x] tests/api/endpoint.spec.ts - Endpoint validation

### E2E Tests
- [x] tests/e2e/feature.spec.ts - User workflow

## Coverage
- API endpoints: 5/10 covered
- UI features: 3/8 covered

## Next Steps
- Run tests in CI
- Add more edge cases as needed
```

## Keep It Simple

**Do:**

- Use standard Playwright APIs only
- Focus on happy path + critical errors
- Write readable, maintainable tests
- Run tests to verify they pass

**Avoid:**

- Complex fixture composition
- Network interception (unless necessary)
- Data factories (use inline test data)
- Over-engineering
- Custom utilities

**For Advanced Features:**

If the project needs:

- Risk-based test strategy
- Test design planning
- Quality gates and NFR assessment
- Comprehensive coverage analysis
- Playwright Utils integration

→ **Install Test Architect (TEA) module**: <https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/>

## Output

Save summary to: `{implementation_artifacts}/tests/test-summary.md`

**Done!** Tests generated and verified.
