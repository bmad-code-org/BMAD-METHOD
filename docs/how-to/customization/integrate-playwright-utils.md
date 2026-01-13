---
title: "Integrate Playwright Utils with TEA"
description: Add production-ready fixtures and utilities to your TEA-generated tests
---

# Integrate Playwright Utils with TEA

Integrate `@seontechnologies/playwright-utils` with TEA to get production-ready fixtures, utilities, and patterns in your test suite.

## What is Playwright Utils?

A production-ready utility library that provides:
- Typed API request helper
- Authentication session management
- Network recording and replay (HAR)
- Network request interception
- Async polling (recurse)
- Structured logging
- File validation (CSV, PDF, XLSX, ZIP)
- Burn-in testing utilities
- Network error monitoring

**Repository:** https://github.com/seontechnologies/playwright-utils

**npm Package:** `@seontechnologies/playwright-utils`

## When to Use This

- You want production-ready fixtures (not DIY)
- Your team benefits from standardized patterns
- You need utilities like API testing, auth handling, network mocking
- You want TEA to generate tests using these utilities
- You're building reusable test infrastructure

**Don't use if:**
- You're just learning testing (keep it simple first)
- You have your own fixture library
- You don't need the utilities

## Prerequisites

- BMad Method installed
- TEA agent available
- Test framework setup complete (Playwright)
- Node.js v18 or later

**Note:** Playwright Utils is for Playwright only (not Cypress).

## Installation

### Step 1: Install Package

```bash
npm install -D @seontechnologies/playwright-utils
```

### Step 2: Enable in TEA Config

Edit `_bmad/bmm/config.yaml`:

```yaml
tea_use_playwright_utils: true
```

**Note:** If you enabled this during installation (`npx bmad-method@alpha install`), it's already set.

### Step 3: Verify Installation

```bash
# Check package installed
npm list @seontechnologies/playwright-utils

# Check TEA config
grep tea_use_playwright_utils _bmad/bmm/config.yaml
```

Should show:
```
@seontechnologies/playwright-utils@2.x.x
tea_use_playwright_utils: true
```

## What Changes When Enabled

### *framework Workflow

**Vanilla Playwright:**
```typescript
// Basic Playwright fixtures only
import { test, expect } from '@playwright/test';

test('api test', async ({ request }) => {
  const response = await request.get('/api/users');
  const users = await response.json();
  expect(response.status()).toBe(200);
});
```

**With Playwright Utils (Combined Fixtures):**
```typescript
// All utilities available via single import
import { test } from '@seontechnologies/playwright-utils/fixtures';
import { expect } from '@playwright/test';

test('api test', async ({ apiRequest, authToken, log }) => {
  const { status, body } = await apiRequest({
    method: 'GET',
    path: '/api/users',
    headers: { Authorization: `Bearer ${authToken}` }
  });

  log.info('Fetched users', body);
  expect(status).toBe(200);
});
```

**With Playwright Utils (Selective Merge):**
```typescript
import { mergeTests } from '@playwright/test';
import { test as apiRequestFixture } from '@seontechnologies/playwright-utils/api-request/fixtures';
import { test as logFixture } from '@seontechnologies/playwright-utils/log/fixtures';

export const test = mergeTests(apiRequestFixture, logFixture);
export { expect } from '@playwright/test';

test('api test', async ({ apiRequest, log }) => {
  log.info('Fetching users');
  const { status, body } = await apiRequest({
    method: 'GET',
    path: '/api/users'
  });
  expect(status).toBe(200);
});
```

### *atdd and *automate Workflows

**Without Playwright Utils:**
```typescript
// Manual API calls
test('should fetch profile', async ({ page, request }) => {
  const response = await request.get('/api/profile');
  const profile = await response.json();
  // Manual parsing and validation
});
```

**With Playwright Utils:**
```typescript
import { test } from '@seontechnologies/playwright-utils/api-request/fixtures';

test('should fetch profile', async ({ apiRequest }) => {
  const { status, body } = await apiRequest({
    method: 'GET',
    path: '/api/profile'  // 'path' not 'url'
  }).validateSchema(ProfileSchema);  // Chained validation

  expect(status).toBe(200);
  // body is type-safe: { id: string, name: string, email: string }
});
```

### *test-review Workflow

**Without Playwright Utils:**
Reviews against generic Playwright patterns

**With Playwright Utils:**
Reviews against playwright-utils best practices:
- Fixture composition patterns
- Utility usage (apiRequest, authSession, etc.)
- Network-first patterns
- Structured logging

### *ci Workflow

**Without Playwright Utils:**
Basic CI configuration

**With Playwright Utils:**
Enhanced CI with:
- Burn-in utility for smart test selection
- Selective testing based on git diff
- Test prioritization

## Available Utilities

### api-request

Typed HTTP client with schema validation.

**Usage:**
```typescript
import { test } from '@seontechnologies/playwright-utils/api-request/fixtures';
import { expect } from '@playwright/test';
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email()
});

test('should create user', async ({ apiRequest }) => {
  const { status, body } = await apiRequest({
    method: 'POST',
    path: '/api/users',  // Note: 'path' not 'url'
    body: { name: 'Test User', email: 'test@example.com' }  // Note: 'body' not 'data'
  }).validateSchema(UserSchema);  // Note: chained method

  expect(status).toBe(201);
  expect(body.id).toBeDefined();
  expect(body.email).toBe('test@example.com');
});
```

**Benefits:**
- Returns `{ status, body }` structure
- Schema validation with `.validateSchema()` chained method
- Automatic retry for 5xx errors
- Type-safe response body

### auth-session

Authentication session management with token persistence.

**Usage:**
```typescript
import { test } from '@seontechnologies/playwright-utils/auth-session/fixtures';
import { expect } from '@playwright/test';

test('should access protected route', async ({ page, authToken }) => {
  // authToken automatically fetched and persisted
  // No manual login needed - handled by fixture

  await page.goto('/dashboard');
  await expect(page).toHaveURL('/dashboard');

  // Token is reused across tests (persisted to disk)
});
```

**Configuration required** (see auth-session docs for provider setup):
```typescript
// global-setup.ts
import { authStorageInit, setAuthProvider, authGlobalInit } from '@seontechnologies/playwright-utils/auth-session';

async function globalSetup() {
  authStorageInit();
  setAuthProvider(myCustomProvider);  // Define your auth mechanism
  await authGlobalInit();  // Fetch token once
}
```

**Benefits:**
- Token fetched once, reused across all tests
- Persisted to disk (faster subsequent runs)
- Multi-user support via `authOptions.userIdentifier`
- Automatic token renewal if expired

### network-recorder

Record and replay network traffic (HAR) for offline testing.

**Usage:**
```typescript
import { test } from '@seontechnologies/playwright-utils/network-recorder/fixtures';

// Record mode: Set environment variable
process.env.PW_NET_MODE = 'record';

test('should work with recorded traffic', async ({ page, context, networkRecorder }) => {
  // Setup recorder (records or replays based on PW_NET_MODE)
  await networkRecorder.setup(context);

  // Your normal test code
  await page.goto('/dashboard');
  await page.click('#add-item');

  // First run (record): Saves traffic to HAR file
  // Subsequent runs (playback): Uses HAR file, no backend needed
});
```

**Switch modes:**
```bash
# Record traffic
PW_NET_MODE=record npx playwright test

# Playback traffic (offline)
PW_NET_MODE=playback npx playwright test
```

**Benefits:**
- Offline testing (no backend needed)
- Deterministic responses (same every time)
- Faster execution (no network latency)
- Stateful mocking (CRUD operations work)

### intercept-network-call

Spy or stub network requests with automatic JSON parsing.

**Usage:**
```typescript
import { test } from '@seontechnologies/playwright-utils/fixtures';

test('should handle API errors', async ({ page, interceptNetworkCall }) => {
  // Stub API to return error (set up BEFORE navigation)
  const profileCall = interceptNetworkCall({
    method: 'GET',
    url: '**/api/profile',
    fulfillResponse: {
      status: 500,
      body: { error: 'Server error' }
    }
  });

  await page.goto('/profile');

  // Wait for the intercepted response
  const { status, responseJson } = await profileCall;

  expect(status).toBe(500);
  expect(responseJson.error).toBe('Server error');
  await expect(page.getByText('Server error occurred')).toBeVisible();
});
```

**Benefits:**
- Automatic JSON parsing (`responseJson` ready to use)
- Spy mode (observe real traffic) or stub mode (mock responses)
- Glob pattern URL matching
- Returns promise with `{ status, responseJson, requestJson }`

### recurse

Async polling for eventual consistency (Cypress-style).

**Usage:**
```typescript
import { test } from '@seontechnologies/playwright-utils/fixtures';

test('should wait for async job completion', async ({ apiRequest, recurse }) => {
  // Start async job
  const { body: job } = await apiRequest({
    method: 'POST',
    path: '/api/jobs'
  });

  // Poll until complete (smart waiting)
  const completed = await recurse(
    () => apiRequest({ method: 'GET', path: `/api/jobs/${job.id}` }),
    (result) => result.body.status === 'completed',
    {
      timeout: 30000,
      interval: 2000,
      log: 'Waiting for job to complete'
    }
  });

  expect(completed.body.status).toBe('completed');
});
```

**Benefits:**
- Smart polling with configurable interval
- Handles async jobs, background tasks
- Optional logging for debugging
- Better than hard waits or manual polling loops

### log

Structured logging that integrates with Playwright reports.

**Usage:**
```typescript
import { log } from '@seontechnologies/playwright-utils';
import { test, expect } from '@playwright/test';

test('should login', async ({ page }) => {
  await log.info('Starting login test');

  await page.goto('/login');
  await log.step('Navigated to login page');  // Shows in Playwright UI

  await page.getByLabel('Email').fill('test@example.com');
  await log.debug('Filled email field');

  await log.success('Login completed');
  // Logs appear in test output and Playwright reports
});
```

**Benefits:**
- Direct import (no fixture needed for basic usage)
- Structured logs in test reports
- `.step()` shows in Playwright UI
- Supports object logging with `.debug()`
- Trace test execution

### file-utils

Read and validate CSV, PDF, XLSX, ZIP files.

**Usage:**
```typescript
import { handleDownload, readCSV } from '@seontechnologies/playwright-utils/file-utils';
import { expect } from '@playwright/test';
import path from 'node:path';

const DOWNLOAD_DIR = path.join(__dirname, '../downloads');

test('should export valid CSV', async ({ page }) => {
  // Handle download and get file path
  const downloadPath = await handleDownload({
    page,
    downloadDir: DOWNLOAD_DIR,
    trigger: () => page.click('button:has-text("Export")')
  });

  // Read and parse CSV
  const csvResult = await readCSV({ filePath: downloadPath });
  const { data, headers } = csvResult.content;

  // Validate structure
  expect(headers).toEqual(['Name', 'Email', 'Status']);
  expect(data.length).toBeGreaterThan(0);
  expect(data[0]).toMatchObject({
    Name: expect.any(String),
    Email: expect.any(String),
    Status: expect.any(String)
  });
});
```

**Benefits:**
- Handles downloads automatically
- Auto-parses CSV, XLSX, PDF, ZIP
- Type-safe access to parsed data
- Returns structured `{ headers, data }`

### burn-in

Smart test selection with git diff analysis for CI optimization.

**Usage:**
```typescript
// scripts/burn-in-changed.ts
import { runBurnIn } from '@seontechnologies/playwright-utils/burn-in';

async function main() {
  await runBurnIn({
    configPath: 'playwright.burn-in.config.ts',
    baseBranch: 'main'
  });
}

main().catch(console.error);
```

**Config:**
```typescript
// playwright.burn-in.config.ts
import type { BurnInConfig } from '@seontechnologies/playwright-utils/burn-in';

const config: BurnInConfig = {
  skipBurnInPatterns: [
    '**/config/**',
    '**/*.md',
    '**/*types*'
  ],
  burnInTestPercentage: 0.3,
  burnIn: {
    repeatEach: 3,
    retries: 1
  }
};

export default config;
```

**Package script:**
```json
{
  "scripts": {
    "test:burn-in": "tsx scripts/burn-in-changed.ts"
  }
}
```

**Benefits:**
- Smart filtering (skip config, types, docs changes)
- Volume control (run percentage of affected tests)
- Git diff-based test selection
- Faster CI feedback

### network-error-monitor

Automatically detect HTTP 4xx/5xx errors during tests.

**Usage:**
```typescript
import { test } from '@seontechnologies/playwright-utils/network-error-monitor/fixtures';

// That's it! Network monitoring is automatically enabled
test('should not have API errors', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('button');

  // Test fails automatically if any HTTP 4xx/5xx errors occur
  // Error message shows: "Network errors detected: 2 request(s) failed"
  //   GET 500 https://api.example.com/users
  //   POST 503 https://api.example.com/metrics
});
```

**Opt-out for validation tests:**
```typescript
// When testing error scenarios, opt-out with annotation
test('should show error message on 404',
  { annotation: [{ type: 'skipNetworkMonitoring' }] },  // Array format
  async ({ page }) => {
    await page.goto('/invalid-page');  // Will 404
    await expect(page.getByText('Page not found')).toBeVisible();
    // Test won't fail on 404 because of annotation
  }
);

// Or opt-out entire describe block
test.describe('error handling',
  { annotation: [{ type: 'skipNetworkMonitoring' }] },
  () => {
    test('handles 404', async ({ page }) => {
      // Monitoring disabled for all tests in block
    });
  }
);
```

**Benefits:**
- Auto-enabled (zero setup)
- Catches silent backend failures
- Opt-out with annotations
- Structured error reporting

## Fixture Composition

Combine utilities using `mergeTests`:

**Option 1: Use Combined Fixtures (Simplest)**
```typescript
// Import all utilities at once
import { test } from '@seontechnologies/playwright-utils/fixtures';
import { log } from '@seontechnologies/playwright-utils';
import { expect } from '@playwright/test';

test('full test', async ({ apiRequest, authToken, interceptNetworkCall }) => {
  await log.info('Starting test');  // log is direct import

  const { status, body } = await apiRequest({
    method: 'GET',
    path: '/api/data',
    headers: { Authorization: `Bearer ${authToken}` }
  });

  await log.info('Data fetched', body);
  expect(status).toBe(200);
});
```

**Note:** `log` is imported directly (not a fixture). `authToken` requires auth-session provider setup.

**Option 2: Merge Individual Fixtures (Selective)**
```typescript
import { test as base } from '@playwright/test';
import { mergeTests } from '@playwright/test';
import { test as apiRequestFixture } from '@seontechnologies/playwright-utils/api-request/fixtures';
import { test as recurseFixture } from '@seontechnologies/playwright-utils/recurse/fixtures';
import { log } from '@seontechnologies/playwright-utils';

// Merge only the fixtures you need
export const test = mergeTests(
  apiRequestFixture,
  recurseFixture
);

export { expect } from '@playwright/test';

// Use merged utilities in tests
test('selective test', async ({ apiRequest, recurse }) => {
  await log.info('Starting test');  // log is direct import, not fixture

  const { status, body } = await apiRequest({
    method: 'GET',
    path: '/api/data'
  });

  await log.info('Data fetched', body);
  expect(status).toBe(200);
});
```

**Note:** `log` is a direct utility (not a fixture), so import it separately.

**Recommended:** Use Option 1 (combined fixtures) unless you need fine control over which utilities are included.

## Configuration

### Environment Variables

```bash
# .env
PLAYWRIGHT_UTILS_LOG_LEVEL=debug  # debug | info | warn | error
PLAYWRIGHT_UTILS_RETRY_ATTEMPTS=3
PLAYWRIGHT_UTILS_TIMEOUT=30000
```

### Playwright Config

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Playwright Utils works with standard Playwright config
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    extraHTTPHeaders: {
      // Add headers used by utilities
    }
  }
});
```

## Troubleshooting

### Import Errors

**Problem:** Cannot find module '@seontechnologies/playwright-utils/api-request'

**Solution:**
```bash
# Verify package installed
npm list @seontechnologies/playwright-utils

# Check package.json has correct version
"@seontechnologies/playwright-utils": "^2.0.0"

# Reinstall if needed
npm install -D @seontechnologies/playwright-utils
```

### TEA Not Using Utilities

**Problem:** TEA generates tests without playwright-utils.

**Causes:**
1. Config not set: `tea_use_playwright_utils: false`
2. Workflow run before config change
3. Package not installed

**Solution:**
```bash
# Check config
grep tea_use_playwright_utils _bmad/bmm/config.yaml

# Should show: tea_use_playwright_utils: true

# Start fresh chat (TEA loads config at start)
```

### Type Errors with apiRequest

**Problem:** TypeScript errors on apiRequest response.

**Cause:** No schema validation.

**Solution:**
```typescript
// Add Zod schema for type safety
import { z } from 'zod';

const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email()
});

const { status, body } = await apiRequest({
  method: 'GET',
  path: '/api/profile'  // 'path' not 'url'
}).validateSchema(ProfileSchema);  // Chained method

expect(status).toBe(200);
// body is typed as { id: string, name: string, email: string }
```

## Migration Guide

### Migrating Existing Tests

**Before (Vanilla Playwright):**
```typescript
test('should access protected route', async ({ page, request }) => {
  // Manual auth token fetch
  const response = await request.post('/api/auth/login', {
    data: { email: 'test@example.com', password: 'pass' }
  });
  const { token } = await response.json();

  // Manual token storage
  await page.goto('/dashboard');
  await page.evaluate((token) => {
    localStorage.setItem('authToken', token);
  }, token);

  await expect(page).toHaveURL('/dashboard');
});
```

**After (With Playwright Utils):**
```typescript
import { test } from '@seontechnologies/playwright-utils/auth-session/fixtures';

test('should access protected route', async ({ page, authToken }) => {
  // authToken automatically fetched and persisted by fixture
  await page.goto('/dashboard');

  // Token is already in place (no manual storage needed)
  await expect(page).toHaveURL('/dashboard');
});
```

**Benefits:**
- Token fetched once, reused across all tests (persisted to disk)
- No manual token storage or management
- Automatic token renewal if expired
- Multi-user support via `authOptions.userIdentifier`
- 10 lines → 5 lines (less code)

## Related Guides

**Getting Started:**
- [TEA Lite Quickstart Tutorial](/docs/tutorials/getting-started/tea-lite-quickstart.md) - Learn TEA basics
- [How to Set Up Test Framework](/docs/how-to/workflows/setup-test-framework.md) - Initial framework setup

**Workflow Guides:**
- [How to Run ATDD](/docs/how-to/workflows/run-atdd.md) - Generate tests with utilities
- [How to Run Automate](/docs/how-to/workflows/run-automate.md) - Expand coverage with utilities
- [How to Run Test Review](/docs/how-to/workflows/run-test-review.md) - Review against PW-Utils patterns

**Other Customization:**
- [Enable MCP Enhancements](/docs/how-to/customization/enable-tea-mcp-enhancements.md) - Live browser verification

## Understanding the Concepts

- [Fixture Architecture](/docs/explanation/tea/fixture-architecture.md) - Pure function → fixture pattern
- [Network-First Patterns](/docs/explanation/tea/network-first-patterns.md) - Network utilities explained
- [Test Quality Standards](/docs/explanation/tea/test-quality-standards.md) - Patterns PW-Utils enforces

## Reference

- [TEA Configuration](/docs/reference/tea/configuration.md) - tea_use_playwright_utils option
- [Knowledge Base Index](/docs/reference/tea/knowledge-base.md) - Playwright Utils fragments
- [Glossary](/docs/reference/glossary/index.md#test-architect-tea-concepts) - Playwright Utils term
- [Official PW-Utils Docs](https://seontechnologies.github.io/playwright-utils/) - Complete API reference

---

Generated with [BMad Method](https://bmad-method.org) - TEA (Test Architect)
