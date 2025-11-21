# Network Recorder Utility

## Principle

Record network traffic to HAR files during test execution, then play back from disk for offline testing. Enables frontend tests to run in complete isolation from backend services with intelligent stateful CRUD detection for realistic API behavior.

## Rationale

Traditional E2E tests require live backend services:

- Slow (real network latency)
- Flaky (backend instability affects tests)
- Expensive (full stack running for UI tests)
- Coupled (UI tests break when API changes)

HAR-based recording/playback provides:

- **True offline testing**: UI tests run without backend
- **Deterministic behavior**: Same responses every time
- **Fast execution**: No network latency
- **Stateful mocking**: CRUD operations work naturally (not just read-only)
- **Environment flexibility**: Map URLs for any environment

## Pattern Examples

### Example 1: Basic Record and Playback

**Context**: The fundamental pattern - record traffic once, play back for all subsequent runs.

**Implementation**:

```typescript
import { test } from '@seontechnologies/playwright-utils/network-recorder/fixtures';

// Set mode in test file (recommended)
process.env.PW_NET_MODE = 'playback'; // or 'record'

test('CRUD operations work offline', async ({ page, context, networkRecorder }) => {
  // Setup recorder (records or plays back based on PW_NET_MODE)
  await networkRecorder.setup(context);

  await page.goto('/');

  // First time (record mode): Records all network traffic to HAR
  // Subsequent runs (playback mode): Plays back from HAR (no backend!)
  await page.fill('#movie-name', 'Inception');
  await page.click('#add-movie');

  // Intelligent CRUD detection makes this work offline!
  await expect(page.getByText('Inception')).toBeVisible();
});
```

**Key Points**:

- `PW_NET_MODE=record` captures traffic to HAR files
- `PW_NET_MODE=playback` replays from HAR files
- Set mode in test file or via environment variable
- HAR files auto-organized by test name
- Stateful mocking detects CRUD operations

### Example 2: Complete CRUD Flow with HAR

**Context**: Full create-read-update-delete flow that works completely offline.

**Implementation**:

```typescript
process.env.PW_NET_MODE = 'playback';

test.describe('Movie CRUD - offline with network recorder', () => {
  test.beforeEach(async ({ page, networkRecorder, context }) => {
    await networkRecorder.setup(context);
    await page.goto('/');
  });

  test('should add, edit, delete movie browser-only', async ({ page, interceptNetworkCall }) => {
    // Create
    await page.fill('#movie-name', 'Inception');
    await page.fill('#year', '2010');
    await page.click('#add-movie');

    // Verify create (reads from stateful HAR)
    await expect(page.getByText('Inception')).toBeVisible();

    // Update
    await page.getByText('Inception').click();
    await page.fill('#movie-name', "Inception Director's Cut");

    const updateCall = interceptNetworkCall({
      method: 'PUT',
      url: '/movies/*',
    });

    await page.click('#save');
    await updateCall; // Wait for update

    // Verify update (HAR reflects state change!)
    await page.click('#back');
    await expect(page.getByText("Inception Director's Cut")).toBeVisible();

    // Delete
    await page.click(`[data-testid="delete-Inception Director's Cut"]`);

    // Verify delete (HAR reflects removal!)
    await expect(page.getByText("Inception Director's Cut")).not.toBeVisible();
  });
});
```

**Key Points**:

- Full CRUD operations work offline
- Stateful HAR mocking tracks creates/updates/deletes
- Combine with `interceptNetworkCall` for deterministic waits
- First run records, subsequent runs replay

### Example 3: Environment Switching

**Context**: Record in dev environment, play back in CI with different base URLs.

**Implementation**:

```typescript
// playwright.config.ts - Map URLs for different environments
export default defineConfig({
  use: {
    baseURL: process.env.CI ? 'https://app.ci.example.com' : 'http://localhost:3000',
  },
});

// Test works in both environments
test('cross-environment playback', async ({ page, context, networkRecorder }) => {
  await networkRecorder.setup(context);

  // In dev: hits http://localhost:3000/api/movies
  // In CI: HAR replays with https://app.ci.example.com/api/movies
  await page.goto('/movies');

  // Network recorder auto-maps URLs
  await expect(page.getByTestId('movie-list')).toBeVisible();
});
```

**Key Points**:

- HAR files record absolute URLs
- Playback maps to current baseURL
- Same HAR works across environments
- No manual URL rewriting needed

### Example 4: Automatic vs Manual Mode Control

**Context**: Choose between environment-based switching or in-test mode control.

**Implementation**:

```typescript
// Option 1: Environment variable (recommended for CI)
PW_NET_MODE=record npm run test:pw   # Record traffic
PW_NET_MODE=playback npm run test:pw # Playback traffic

// Option 2: In-test control (recommended for development)
process.env.PW_NET_MODE = 'record'  // Set at top of test file

test('my test', async ({ page, context, networkRecorder }) => {
  await networkRecorder.setup(context)
  // ...
})

// Option 3: Auto-fallback (record if HAR missing, else playback)
// This is the default behavior when PW_NET_MODE not set
test('auto mode', async ({ page, context, networkRecorder }) => {
  await networkRecorder.setup(context)
  // First run: auto-records
  // Subsequent runs: auto-plays back
})
```

**Key Points**:

- Three mode options: record, playback, auto
- `PW_NET_MODE` environment variable
- In-test `process.env.PW_NET_MODE` assignment
- Auto-fallback when no mode specified

## Why Use This Instead of Native Playwright?

| Native Playwright (`routeFromHAR`) | network-recorder Utility       |
| ---------------------------------- | ------------------------------ |
| ~80 lines setup boilerplate        | ~5 lines total                 |
| Manual HAR file management         | Automatic file organization    |
| Complex setup/teardown             | Automatic cleanup via fixtures |
| **Read-only tests**                | **Full CRUD support**          |
| **Stateless**                      | **Stateful mocking**           |
| Manual URL mapping                 | Automatic environment mapping  |

**The game-changer: Stateful CRUD detection**

Native Playwright HAR playback is stateless - a POST create followed by GET list won't show the created item. This utility intelligently tracks CRUD operations in memory to reflect state changes, making offline tests behave like real APIs.

## Integration with Other Utilities

**With interceptNetworkCall** (deterministic waits):

```typescript
test('use both utilities', async ({ page, context, networkRecorder, interceptNetworkCall }) => {
  await networkRecorder.setup(context);

  const createCall = interceptNetworkCall({
    method: 'POST',
    url: '/api/movies',
  });

  await page.click('#add-movie');
  await createCall; // Wait for create (works with HAR!)

  // Network recorder provides playback, intercept provides determinism
});
```

## Related Fragments

- `overview.md` - Installation and fixture patterns
- `intercept-network-call.md` - Combine for deterministic offline tests
- `auth-session.md` - Record authenticated traffic
- `network-first.md` - Core pattern for intercept-before-navigate

## Anti-Patterns

**❌ Mixing record and playback in same test:**

```typescript
process.env.PW_NET_MODE = 'record';
// ... some test code ...
process.env.PW_NET_MODE = 'playback'; // Don't switch mid-test
```

**✅ One mode per test:**

```typescript
process.env.PW_NET_MODE = 'playback'; // Set once at top

test('my test', async ({ page, context, networkRecorder }) => {
  await networkRecorder.setup(context);
  // Entire test uses playback mode
});
```

**❌ Forgetting to call setup:**

```typescript
test('broken', async ({ page, networkRecorder }) => {
  await page.goto('/'); // HAR not active!
});
```

**✅ Always call setup before navigation:**

```typescript
test('correct', async ({ page, context, networkRecorder }) => {
  await networkRecorder.setup(context); // Must setup first
  await page.goto('/'); // Now HAR is active
});
```
