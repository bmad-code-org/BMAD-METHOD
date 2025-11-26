# Log Utility

## Principle

Use structured logging that integrates with Playwright's test reports. Support object logging, test step decoration, and multiple log levels (info, step, success, warning, error, debug).

## Rationale

Console.log in Playwright tests has limitations:

- Not visible in HTML reports
- No test step integration
- No structured output
- Lost in terminal noise during CI

The `log` utility provides:

- **Report integration**: Logs appear in Playwright HTML reports
- **Test step decoration**: `log.step()` creates collapsible steps in UI
- **Object logging**: Automatically formats objects/arrays
- **Multiple levels**: info, step, success, warning, error, debug
- **Optional console**: Can disable console output but keep report logs

## Pattern Examples

### Example 1: Basic Logging Levels

**Context**: Log different types of messages throughout test execution.

**Implementation**:

```typescript
import { log } from '@seontechnologies/playwright-utils';

test('logging demo', async ({ page }) => {
  await log.step('Navigate to login page');
  await page.goto('/login');

  await log.info('Entering credentials');
  await page.fill('#username', 'testuser');

  await log.success('Login successful');

  await log.warning('Rate limit approaching');

  await log.debug({ userId: '123', sessionId: 'abc' });

  // Errors still throw but get logged first
  try {
    await page.click('#nonexistent');
  } catch (error) {
    await log.error('Click failed', false); // false = no console output
    throw error;
  }
});
```

**Key Points**:

- `step()` creates collapsible steps in Playwright UI
- `info()`, `success()`, `warning()` for different message types
- `debug()` for detailed data (objects/arrays)
- `error()` with optional console suppression
- All logs appear in test reports

### Example 2: Object and Array Logging

**Context**: Log structured data for debugging without cluttering console.

**Implementation**:

```typescript
test('object logging', async ({ apiRequest }) => {
  const { body } = await apiRequest({
    method: 'GET',
    path: '/api/users',
  });

  // Log array of objects
  await log.debug(body); // Formatted as JSON in report

  // Log specific object
  await log.info({
    totalUsers: body.length,
    firstUser: body[0]?.name,
    timestamp: new Date().toISOString(),
  });

  // Complex nested structures
  await log.debug({
    request: {
      method: 'GET',
      path: '/api/users',
      timestamp: Date.now(),
    },
    response: {
      status: 200,
      body: body.slice(0, 3), // First 3 items
    },
  });
});
```

**Key Points**:

- Objects auto-formatted as pretty JSON
- Arrays handled gracefully
- Nested structures supported
- All visible in Playwright report attachments

### Example 3: Test Step Organization

**Context**: Organize test execution into collapsible steps for better readability in reports.

**Implementation**:

```typescript
test('organized with steps', async ({ page, apiRequest }) => {
  await log.step('ARRANGE: Setup test data');
  const { body: user } = await apiRequest({
    method: 'POST',
    path: '/api/users',
    body: { name: 'Test User' },
  });

  await log.step('ACT: Perform user action');
  await page.goto(`/users/${user.id}`);
  await page.click('#edit');
  await page.fill('#name', 'Updated Name');
  await page.click('#save');

  await log.step('ASSERT: Verify changes');
  await expect(page.getByText('Updated Name')).toBeVisible();

  // In Playwright UI, each step is collapsible
});
```

**Key Points**:

- `log.step()` creates collapsible sections
- Organize by Arrange-Act-Assert
- Steps visible in Playwright trace viewer
- Better debugging when tests fail

### Example 4: Conditional Logging

**Context**: Log different messages based on environment or test conditions.

**Implementation**:

```typescript
test('conditional logging', async ({ page }) => {
  const isCI = process.env.CI === 'true';

  if (isCI) {
    await log.info('Running in CI environment');
  } else {
    await log.debug('Running locally');
  }

  const isKafkaWorking = await checkKafkaHealth();

  if (!isKafkaWorking) {
    await log.warning('Kafka unavailable - skipping event checks');
  } else {
    await log.step('Verifying Kafka events');
    // ... event verification
  }
});
```

**Key Points**:

- Log based on environment
- Skip logging with conditionals
- Use appropriate log levels
- Debug info for local, minimal for CI

### Example 5: Integration with Auth and API

**Context**: Log authenticated API requests with tokens (safely).

**Implementation**:

```typescript
import { test } from '@seontechnologies/playwright-utils/fixtures';

// Helper to create safe token preview
function createTokenPreview(token: string): string {
  if (!token || token.length < 10) return '[invalid]';
  return `${token.slice(0, 6)}...${token.slice(-4)}`;
}

test('should log auth flow', async ({ authToken, apiRequest }) => {
  await log.info(`Using token: ${createTokenPreview(authToken)}`);

  await log.step('Fetch protected resource');
  const { status, body } = await apiRequest({
    method: 'GET',
    path: '/api/protected',
    headers: { Authorization: `Bearer ${authToken}` },
  });

  await log.debug({
    status,
    bodyPreview: {
      id: body.id,
      recordCount: body.data?.length,
    },
  });

  await log.success('Protected resource accessed successfully');
});
```

**Key Points**:

- Never log full tokens (security risk)
- Use preview functions for sensitive data
- Combine with auth and API utilities
- Log at appropriate detail level

## Log Levels Guide

| Level     | When to Use                         | Shows in Report      | Shows in Console |
| --------- | ----------------------------------- | -------------------- | ---------------- |
| `step`    | Test organization, major actions    | ✅ Collapsible steps | ✅ Yes           |
| `info`    | General information, state changes  | ✅ Yes               | ✅ Yes           |
| `success` | Successful operations               | ✅ Yes               | ✅ Yes           |
| `warning` | Non-critical issues, skipped checks | ✅ Yes               | ✅ Yes           |
| `error`   | Failures, exceptions                | ✅ Yes               | ✅ Configurable  |
| `debug`   | Detailed data, objects              | ✅ Yes (attached)    | ✅ Configurable  |

## Comparison with console.log

| console.log             | log Utility               |
| ----------------------- | ------------------------- |
| Not in reports          | Appears in reports        |
| No test steps           | Creates collapsible steps |
| Manual JSON.stringify() | Auto-formats objects      |
| No log levels           | 6 log levels              |
| Lost in CI output       | Preserved in artifacts    |

## Related Fragments

- `overview.md` - Basic usage and imports
- `api-request.md` - Log API requests
- `auth-session.md` - Log auth flow (safely)
- `recurse.md` - Log polling progress

## Anti-Patterns

**❌ Logging objects in steps:**

```typescript
await log.step({ user: 'test', action: 'create' }); // Shows empty in UI
```

**✅ Use strings for steps, objects for debug:**

```typescript
await log.step('Creating user: test'); // Readable in UI
await log.debug({ user: 'test', action: 'create' }); // Detailed data
```

**❌ Logging sensitive data:**

```typescript
await log.info(`Password: ${password}`); // Security risk!
await log.info(`Token: ${authToken}`); // Full token exposed!
```

**✅ Use previews or omit sensitive data:**

```typescript
await log.info('User authenticated successfully'); // No sensitive data
await log.debug({ tokenPreview: token.slice(0, 6) + '...' });
```

**❌ Excessive logging in loops:**

```typescript
for (const item of items) {
  await log.info(`Processing ${item.id}`); // 100 log entries!
}
```

**✅ Log summary or use debug level:**

```typescript
await log.step(`Processing ${items.length} items`);
await log.debug({ itemIds: items.map((i) => i.id) }); // One log entry
```
