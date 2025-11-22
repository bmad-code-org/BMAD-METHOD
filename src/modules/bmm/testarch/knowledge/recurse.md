# Recurse (Polling) Utility

## Principle

Use Cypress-style polling with Playwright's `expect.poll` to wait for asynchronous conditions. Provides configurable timeout, interval, logging, and post-polling callbacks with enhanced error categorization.

## Rationale

Testing async operations (background jobs, eventual consistency, webhook processing) requires polling:

- Vanilla `expect.poll` is verbose
- No built-in logging for debugging
- Generic timeout errors
- No post-poll hooks

The `recurse` utility provides:

- **Clean syntax**: Inspired by cypress-recurse
- **Enhanced errors**: Timeout vs command failure vs predicate errors
- **Built-in logging**: Track polling progress
- **Post-poll callbacks**: Process results after success
- **Type-safe**: Full TypeScript generic support

## Pattern Examples

### Example 1: Basic Polling

**Context**: Wait for async operation to complete with custom timeout and interval.

**Implementation**:

```typescript
import { test } from '@seontechnologies/playwright-utils/recurse/fixtures';

test('should wait for job completion', async ({ recurse, apiRequest }) => {
  // Start job
  const { body } = await apiRequest({
    method: 'POST',
    path: '/api/jobs',
    body: { type: 'export' },
  });

  // Poll until ready
  const result = await recurse(
    () => apiRequest({ method: 'GET', path: `/api/jobs/${body.id}` }),
    (response) => response.body.status === 'completed',
    {
      timeout: 60000, // 60 seconds max
      interval: 2000, // Check every 2 seconds
      log: 'Waiting for export job to complete',
    },
  );

  expect(result.body.downloadUrl).toBeDefined();
});
```

**Key Points**:

- First arg: command function (what to execute)
- Second arg: predicate function (when to stop)
- Options: timeout, interval, log message
- Returns the value when predicate returns true

### Example 2: Polling with Assertions

**Context**: Use assertions directly in predicate for more expressive tests.

**Implementation**:

```typescript
test('should poll with assertions', async ({ recurse, apiRequest }) => {
  await apiRequest({
    method: 'POST',
    path: '/api/events',
    body: { type: 'user-created', userId: '123' },
  });

  // Poll with assertions in predicate
  await recurse(
    async () => {
      const { body } = await apiRequest({ method: 'GET', path: '/api/events/123' });
      return body;
    },
    (event) => {
      // Use assertions instead of boolean returns
      expect(event.processed).toBe(true);
      expect(event.timestamp).toBeDefined();
      // If assertions pass, predicate succeeds
    },
    { timeout: 30000 },
  );
});
```

**Key Points**:

- Predicate can use `expect()` assertions
- If assertions throw, polling continues
- If assertions pass, polling succeeds
- More expressive than boolean returns

### Example 3: Custom Error Messages

**Context**: Provide context-specific error messages for timeout failures.

**Implementation**:

```typescript
test('custom error on timeout', async ({ recurse, apiRequest }) => {
  try {
    await recurse(
      () => apiRequest({ method: 'GET', path: '/api/status' }),
      (res) => res.body.ready === true,
      {
        timeout: 10000,
        error: 'System failed to become ready within 10 seconds - check background workers',
      },
    );
  } catch (error) {
    // Error message includes custom context
    expect(error.message).toContain('check background workers');
    throw error;
  }
});
```

**Key Points**:

- `error` option provides custom message
- Replaces default "Timed out after X ms"
- Include debugging hints in error message
- Helps diagnose failures faster

### Example 4: Post-Polling Callback

**Context**: Process or log results after successful polling.

**Implementation**:

```typescript
test('post-poll processing', async ({ recurse, apiRequest }) => {
  const finalResult = await recurse(
    () => apiRequest({ method: 'GET', path: '/api/batch-job/123' }),
    (res) => res.body.status === 'completed',
    {
      timeout: 60000,
      post: (result) => {
        // Runs after successful polling
        console.log(`Job completed in ${result.body.duration}ms`);
        console.log(`Processed ${result.body.itemsProcessed} items`);
        return result.body;
      },
    },
  );

  expect(finalResult.itemsProcessed).toBeGreaterThan(0);
});
```

**Key Points**:

- `post` callback runs after predicate succeeds
- Receives the final result
- Can transform or log results
- Return value becomes final `recurse` result

### Example 5: Integration with API Request (Common Pattern)

**Context**: Most common use case - polling API endpoints for state changes.

**Implementation**:

```typescript
import { test } from '@seontechnologies/playwright-utils/fixtures';

test('end-to-end polling', async ({ apiRequest, recurse }) => {
  // Trigger async operation
  const { body: createResp } = await apiRequest({
    method: 'POST',
    path: '/api/data-import',
    body: { source: 's3://bucket/data.csv' },
  });

  // Poll until import completes
  const importResult = await recurse(
    () => apiRequest({ method: 'GET', path: `/api/data-import/${createResp.importId}` }),
    (response) => {
      const { status, rowsImported } = response.body;
      return status === 'completed' && rowsImported > 0;
    },
    {
      timeout: 120000, // 2 minutes for large imports
      interval: 5000, // Check every 5 seconds
      log: `Polling import ${createResp.importId}`,
    },
  );

  expect(importResult.body.rowsImported).toBeGreaterThan(1000);
  expect(importResult.body.errors).toHaveLength(0);
});
```

**Key Points**:

- Combine `apiRequest` + `recurse` for API polling
- Both from `@seontechnologies/playwright-utils/fixtures`
- Complex predicates with multiple conditions
- Logging shows polling progress in test reports

## Enhanced Error Types

The utility categorizes errors for easier debugging:

```typescript
// TimeoutError - Predicate never returned true
Error: Polling timed out after 30000ms: Job never completed

// CommandError - Command function threw
Error: Command failed: Request failed with status 500

// PredicateError - Predicate function threw (not from assertions)
Error: Predicate failed: Cannot read property 'status' of undefined
```

## Comparison with Vanilla Playwright

| Vanilla Playwright                                                | recurse Utility                                                           |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `await expect.poll(() => { ... }, { timeout: 30000 }).toBe(true)` | `await recurse(() => { ... }, (val) => val === true, { timeout: 30000 })` |
| No logging                                                        | Built-in log option                                                       |
| Generic timeout errors                                            | Categorized errors (timeout/command/predicate)                            |
| No post-poll hooks                                                | `post` callback support                                                   |

## When to Use

**Use recurse for:**

- ✅ Background job completion
- ✅ Webhook/event processing
- ✅ Database eventual consistency
- ✅ Cache propagation
- ✅ State machine transitions

**Stick with vanilla expect.poll for:**

- Simple UI element visibility (use `expect(locator).toBeVisible()`)
- Single-property checks
- Cases where logging isn't needed

## Related Fragments

- `api-request.md` - Combine for API endpoint polling
- `overview.md` - Fixture composition patterns
- `fixtures-composition.md` - Using with mergeTests

## Anti-Patterns

**❌ Using hard waits instead of polling:**

```typescript
await page.click('#export');
await page.waitForTimeout(5000); // Arbitrary wait
expect(await page.textContent('#status')).toBe('Ready');
```

**✅ Poll for actual condition:**

```typescript
await page.click('#export');
await recurse(
  () => page.textContent('#status'),
  (status) => status === 'Ready',
  { timeout: 10000 },
);
```

**❌ Polling too frequently:**

```typescript
await recurse(
  () => apiRequest({ method: 'GET', path: '/status' }),
  (res) => res.body.ready,
  { interval: 100 }, // Hammers API every 100ms!
);
```

**✅ Reasonable interval for API calls:**

```typescript
await recurse(
  () => apiRequest({ method: 'GET', path: '/status' }),
  (res) => res.body.ready,
  { interval: 2000 }, // Check every 2 seconds (reasonable)
);
```
