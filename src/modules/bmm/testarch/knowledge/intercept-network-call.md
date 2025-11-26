# Intercept Network Call Utility

## Principle

Intercept network requests with a single declarative call that returns a Promise. Automatically parse JSON responses, support both spy (observe) and stub (mock) patterns, and use powerful glob pattern matching for URL filtering.

## Rationale

Vanilla Playwright's network interception requires multiple steps:

- `page.route()` to setup, `page.waitForResponse()` to capture
- Manual JSON parsing
- Verbose syntax for conditional handling
- Complex filter predicates

The `interceptNetworkCall` utility provides:

- **Single declarative call**: Setup and wait in one statement
- **Automatic JSON parsing**: Response pre-parsed, strongly typed
- **Flexible URL patterns**: Glob matching with picomatch
- **Spy or stub modes**: Observe real traffic or mock responses
- **Concise API**: Reduces boilerplate by 60-70%

## Pattern Examples

### Example 1: Spy on Network (Observe Real Traffic)

**Context**: Capture and inspect real API responses for validation.

**Implementation**:

```typescript
import { test } from '@seontechnologies/playwright-utils/intercept-network-call/fixtures';

test('should spy on users API', async ({ page, interceptNetworkCall }) => {
  // Setup interception BEFORE navigation
  const usersCall = interceptNetworkCall({
    url: '**/api/users', // Glob pattern
  });

  await page.goto('/dashboard');

  // Wait for response and access parsed data
  const { responseJson, status } = await usersCall;

  expect(status).toBe(200);
  expect(responseJson).toHaveLength(10);
  expect(responseJson[0]).toHaveProperty('name');
});
```

**Key Points**:

- Intercept before navigation (critical for race-free tests)
- Returns Promise with `{ responseJson, status, requestBody }`
- Glob patterns (`**` matches any path segment)
- JSON automatically parsed

### Example 2: Stub Network (Mock Response)

**Context**: Mock API responses for testing UI behavior without backend.

**Implementation**:

```typescript
test('should stub users API', async ({ page, interceptNetworkCall }) => {
  const mockUsers = [
    { id: 1, name: 'Test User 1' },
    { id: 2, name: 'Test User 2' },
  ];

  const usersCall = interceptNetworkCall({
    url: '**/api/users',
    fulfillResponse: {
      status: 200,
      body: mockUsers,
    },
  });

  await page.goto('/dashboard');
  await usersCall;

  // UI shows mocked data
  await expect(page.getByText('Test User 1')).toBeVisible();
  await expect(page.getByText('Test User 2')).toBeVisible();
});
```

**Key Points**:

- `fulfillResponse` mocks the API
- No backend needed
- Test UI logic in isolation
- Status code and body fully controllable

### Example 3: Conditional Response Handling

**Context**: Different responses based on request method or parameters.

**Implementation**:

```typescript
test('conditional mocking', async ({ page, interceptNetworkCall }) => {
  await interceptNetworkCall({
    url: '**/api/data',
    handler: async (route, request) => {
      if (request.method() === 'POST') {
        // Mock POST success
        await route.fulfill({
          status: 201,
          body: JSON.stringify({ id: 'new-id', success: true }),
        });
      } else if (request.method() === 'GET') {
        // Mock GET with data
        await route.fulfill({
          status: 200,
          body: JSON.stringify([{ id: 1, name: 'Item' }]),
        });
      } else {
        // Let other methods through
        await route.continue();
      }
    },
  });

  await page.goto('/data-page');
});
```

**Key Points**:

- `handler` function for complex logic
- Access full `route` and `request` objects
- Can mock, continue, or abort
- Flexible for advanced scenarios

### Example 4: Error Simulation

**Context**: Testing error handling in UI when API fails.

**Implementation**:

```typescript
test('should handle API errors gracefully', async ({ page, interceptNetworkCall }) => {
  // Simulate 500 error
  const errorCall = interceptNetworkCall({
    url: '**/api/users',
    fulfillResponse: {
      status: 500,
      body: { error: 'Internal Server Error' },
    },
  });

  await page.goto('/dashboard');
  await errorCall;

  // Verify UI shows error state
  await expect(page.getByText('Failed to load users')).toBeVisible();
  await expect(page.getByTestId('retry-button')).toBeVisible();
});

// Simulate network timeout
test('should handle timeout', async ({ page, interceptNetworkCall }) => {
  await interceptNetworkCall({
    url: '**/api/slow',
    handler: async (route) => {
      // Never respond - simulates timeout
      await new Promise(() => {});
    },
  });

  await page.goto('/slow-page');

  // UI should show timeout error
  await expect(page.getByText('Request timed out')).toBeVisible({ timeout: 10000 });
});
```

**Key Points**:

- Mock error statuses (4xx, 5xx)
- Test timeout scenarios
- Validate error UI states
- No real failures needed

### Example 5: Multiple Intercepts (Order Matters!)

**Context**: Intercepting different endpoints in same test - setup order is critical.

**Implementation**:

```typescript
test('multiple intercepts', async ({ page, interceptNetworkCall }) => {
  // ✅ CORRECT: Setup all intercepts BEFORE navigation
  const usersCall = interceptNetworkCall({ url: '**/api/users' });
  const productsCall = interceptNetworkCall({ url: '**/api/products' });
  const ordersCall = interceptNetworkCall({ url: '**/api/orders' });

  // THEN navigate
  await page.goto('/dashboard');

  // Wait for all (or specific ones)
  const [users, products] = await Promise.all([usersCall, productsCall]);

  expect(users.responseJson).toHaveLength(10);
  expect(products.responseJson).toHaveLength(50);
});
```

**Key Points**:

- Setup all intercepts before triggering actions
- Use `Promise.all()` to wait for multiple calls
- Order: intercept → navigate → await
- Prevents race conditions

## URL Pattern Matching

**Supported glob patterns:**

```typescript
'**/api/users'; // Any path ending with /api/users
'/api/users'; // Exact match
'**/users/*'; // Any users sub-path
'**/api/{users,products}'; // Either users or products
'**/api/users?id=*'; // With query params
```

**Uses picomatch library** - same pattern syntax as Playwright's `page.route()` but cleaner API.

## Comparison with Vanilla Playwright

| Vanilla Playwright                                          | intercept-network-call                                       |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| `await page.route('/api/users', route => route.continue())` | `const call = interceptNetworkCall({ url: '**/api/users' })` |
| `const resp = await page.waitForResponse('/api/users')`     | (Combined in single statement)                               |
| `const json = await resp.json()`                            | `const { responseJson } = await call`                        |
| `const status = resp.status()`                              | `const { status } = await call`                              |
| Complex filter predicates                                   | Simple glob patterns                                         |

**Reduction:** ~5-7 lines → ~2-3 lines per interception

## Related Fragments

- `network-first.md` - Core pattern: intercept before navigate
- `network-recorder.md` - HAR-based offline testing
- `overview.md` - Fixture composition basics

## Anti-Patterns

**❌ Intercepting after navigation:**

```typescript
await page.goto('/dashboard'); // Navigation starts
const usersCall = interceptNetworkCall({ url: '**/api/users' }); // Too late!
```

**✅ Intercept before navigate:**

```typescript
const usersCall = interceptNetworkCall({ url: '**/api/users' }); // First
await page.goto('/dashboard'); // Then navigate
const { responseJson } = await usersCall; // Then await
```

**❌ Ignoring the returned Promise:**

```typescript
interceptNetworkCall({ url: '**/api/users' }); // Not awaited!
await page.goto('/dashboard');
// No deterministic wait - race condition
```

**✅ Always await the intercept:**

```typescript
const usersCall = interceptNetworkCall({ url: '**/api/users' });
await page.goto('/dashboard');
await usersCall; // Deterministic wait
```
