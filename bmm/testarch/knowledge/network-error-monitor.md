# Network Error Monitor

## Principle

Automatically detect and fail tests when HTTP 4xx/5xx errors occur during execution. Act like Sentry for tests - catch silent backend failures even when UI passes assertions.

## Rationale

Traditional Playwright tests focus on UI:

- Backend 500 errors ignored if UI looks correct
- Silent failures slip through
- No visibility into background API health
- Tests pass while features are broken

The `network-error-monitor` provides:

- **Automatic detection**: All HTTP 4xx/5xx responses tracked
- **Test failures**: Fail tests with backend errors (even if UI passes)
- **Structured artifacts**: JSON reports with error details
- **Smart opt-out**: Disable for validation tests expecting errors
- **Deduplication**: Group repeated errors by pattern
- **Domino effect prevention**: Limit test failures per error pattern

## Pattern Examples

### Example 1: Basic Auto-Monitoring

**Context**: Automatically fail tests when backend errors occur.

**Implementation**:

```typescript
import { test } from '@seontechnologies/playwright-utils/network-error-monitor/fixtures';

// Monitoring automatically enabled
test('should load dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');

  // ✅ Passes if no HTTP errors
  // ❌ Fails if any 4xx/5xx errors detected with clear message:
  //    "Network errors detected: 2 request(s) failed"
  //    Failed requests:
  //      GET 500 https://api.example.com/users
  //      POST 503 https://api.example.com/metrics
});
```

**Key Points**:

- Zero setup - auto-enabled for all tests
- Fails on any 4xx/5xx response
- Structured error message with URLs and status codes
- JSON artifact attached to test report

### Example 2: Opt-Out for Validation Tests

**Context**: Some tests expect errors (validation, error handling, edge cases).

**Implementation**:

```typescript
import { test } from '@seontechnologies/playwright-utils/network-error-monitor/fixtures';

// Opt-out with annotation
test('should show error on invalid input', { annotation: [{ type: 'skipNetworkMonitoring' }] }, async ({ page }) => {
  await page.goto('/form');
  await page.click('#submit'); // Triggers 400 error

  // Monitoring disabled - test won't fail on 400
  await expect(page.getByText('Invalid input')).toBeVisible();
});

// Or opt-out entire describe block
test.describe('error handling', { annotation: [{ type: 'skipNetworkMonitoring' }] }, () => {
  test('handles 404', async ({ page }) => {
    // All tests in this block skip monitoring
  });

  test('handles 500', async ({ page }) => {
    // Monitoring disabled
  });
});
```

**Key Points**:

- Use annotation `{ type: 'skipNetworkMonitoring' }`
- Can opt-out single test or entire describe block
- Monitoring still active for other tests
- Perfect for intentional error scenarios

### Example 3: Integration with Merged Fixtures

**Context**: Combine network-error-monitor with other utilities.

**Implementation**:

```typescript
// playwright/support/merged-fixtures.ts
import { mergeTests } from '@playwright/test';
import { test as authFixture } from '@seontechnologies/playwright-utils/auth-session/fixtures';
import { test as networkErrorMonitorFixture } from '@seontechnologies/playwright-utils/network-error-monitor/fixtures';

export const test = mergeTests(
  authFixture,
  networkErrorMonitorFixture,
  // Add other fixtures
);

// In tests
import { test, expect } from '../support/merged-fixtures';

test('authenticated with monitoring', async ({ page, authToken }) => {
  // Both auth and network monitoring active
  await page.goto('/protected');

  // Fails if backend returns errors during auth flow
});
```

**Key Points**:

- Combine with `mergeTests`
- Works alongside all other utilities
- Monitoring active automatically
- No extra setup needed

### Example 4: Domino Effect Prevention

**Context**: One failing endpoint shouldn't fail all tests.

**Implementation**:

```typescript
// Configuration (internal to utility)
const config = {
  maxTestsPerError: 3, // Max 3 tests fail per unique error pattern
};

// Scenario:
// Test 1: GET /api/broken → 500 error → Test fails ❌
// Test 2: GET /api/broken → 500 error → Test fails ❌
// Test 3: GET /api/broken → 500 error → Test fails ❌
// Test 4: GET /api/broken → 500 error → Test passes ⚠️ (limit reached, warning logged)
// Test 5: Different error pattern → Test fails ❌ (new pattern, counter resets)
```

**Key Points**:

- Limits cascading failures
- Groups errors by URL + status code pattern
- Warns when limit reached
- Prevents flaky backend from failing entire suite

### Example 5: Artifact Structure

**Context**: Debugging failed tests with network error artifacts.

**Implementation**:

When test fails due to network errors, artifact attached:

```json
// test-results/my-test/network-errors.json
{
  "errors": [
    {
      "url": "https://api.example.com/users",
      "method": "GET",
      "status": 500,
      "statusText": "Internal Server Error",
      "timestamp": "2024-08-13T10:30:45.123Z"
    },
    {
      "url": "https://api.example.com/metrics",
      "method": "POST",
      "status": 503,
      "statusText": "Service Unavailable",
      "timestamp": "2024-08-13T10:30:46.456Z"
    }
  ],
  "summary": {
    "totalErrors": 2,
    "uniquePatterns": 2
  }
}
```

**Key Points**:

- JSON artifact per failed test
- Full error details (URL, method, status, timestamp)
- Summary statistics
- Easy debugging with structured data

## Comparison with Manual Error Checks

| Manual Approach                                        | network-error-monitor      |
| ------------------------------------------------------ | -------------------------- |
| `page.on('response', resp => { if (!resp.ok()) ... })` | Auto-enabled, zero setup   |
| Check each response manually                           | Automatic for all requests |
| Custom error tracking logic                            | Built-in deduplication     |
| No structured artifacts                                | JSON artifacts attached    |
| Easy to forget                                         | Never miss a backend error |

## When to Use

**Auto-enabled for:**

- ✅ All E2E tests
- ✅ Integration tests
- ✅ Any test hitting real APIs

**Opt-out for:**

- ❌ Validation tests (expecting 4xx)
- ❌ Error handling tests (expecting 5xx)
- ❌ Offline tests (network-recorder playback)

## Integration with Framework Setup

In `*framework` workflow, mention network-error-monitor:

```typescript
// Add to merged-fixtures.ts
import { test as networkErrorMonitorFixture } from '@seontechnologies/playwright-utils/network-error-monitor/fixtures';

export const test = mergeTests(
  // ... other fixtures
  networkErrorMonitorFixture,
);
```

## Related Fragments

- `overview.md` - Installation and fixtures
- `fixtures-composition.md` - Merging with other utilities
- `error-handling.md` - Traditional error handling patterns

## Anti-Patterns

**❌ Opting out of monitoring globally:**

```typescript
// Every test skips monitoring
test.use({ annotation: [{ type: 'skipNetworkMonitoring' }] });
```

**✅ Opt-out only for specific error tests:**

```typescript
test.describe('error scenarios', { annotation: [{ type: 'skipNetworkMonitoring' }] }, () => {
  // Only these tests skip monitoring
});
```

**❌ Ignoring network error artifacts:**

```typescript
// Test fails, artifact shows 500 errors
// Developer: "Works on my machine" ¯\_(ツ)_/¯
```

**✅ Check artifacts for root cause:**

```typescript
// Read network-errors.json artifact
// Identify failing endpoint: GET /api/users → 500
// Fix backend issue before merging
```
