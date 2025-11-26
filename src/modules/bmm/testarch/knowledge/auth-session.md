# Auth Session Utility

## Principle

Persist authentication tokens to disk and reuse across test runs. Support multiple user identifiers, ephemeral authentication, and worker-specific accounts for parallel execution. Fetch tokens once, use everywhere.

## Rationale

Playwright's built-in authentication works but has limitations:

- Re-authenticates for every test run (slow)
- Single user per project setup
- No token expiration handling
- Manual session management
- Complex setup for multi-user scenarios

The `auth-session` utility provides:

- **Token persistence**: Authenticate once, reuse across runs
- **Multi-user support**: Different user identifiers in same test suite
- **Ephemeral auth**: On-the-fly user authentication without disk persistence
- **Worker-specific accounts**: Parallel execution with isolated user accounts
- **Automatic token management**: Checks validity, renews if expired
- **Flexible provider pattern**: Adapt to any auth system (OAuth2, JWT, custom)

## Pattern Examples

### Example 1: Basic Auth Session Setup

**Context**: Configure global authentication that persists across test runs.

**Implementation**:

```typescript
// Step 1: Configure in global-setup.ts
import { authStorageInit, setAuthProvider, configureAuthSession, authGlobalInit } from '@seontechnologies/playwright-utils/auth-session';
import myCustomProvider from './auth/custom-auth-provider';

async function globalSetup() {
  // Ensure storage directories exist
  authStorageInit();

  // Configure storage path
  configureAuthSession({
    authStoragePath: process.cwd() + '/playwright/auth-sessions',
    debug: true,
  });

  // Set custom provider (HOW to authenticate)
  setAuthProvider(myCustomProvider);

  // Optional: pre-fetch token for default user
  await authGlobalInit();
}

export default globalSetup;

// Step 2: Create auth fixture
import { test as base } from '@playwright/test';
import { createAuthFixtures, setAuthProvider } from '@seontechnologies/playwright-utils/auth-session';
import myCustomProvider from './custom-auth-provider';

// Register provider early
setAuthProvider(myCustomProvider);

export const test = base.extend(createAuthFixtures());

// Step 3: Use in tests
test('authenticated request', async ({ authToken, request }) => {
  const response = await request.get('/api/protected', {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  expect(response.ok()).toBeTruthy();
});
```

**Key Points**:

- Global setup runs once before all tests
- Token fetched once, reused across all tests
- Custom provider defines your auth mechanism
- Order matters: configure, then setProvider, then init

### Example 2: Multi-User Authentication

**Context**: Testing with different user roles (admin, regular user, guest) in same test suite.

**Implementation**:

```typescript
import { test } from '../support/auth/auth-fixture';

// Option 1: Per-test user override
test('admin actions', async ({ authToken, authOptions }) => {
  // Override default user
  authOptions.userIdentifier = 'admin';

  const { authToken: adminToken } = await test.step('Get admin token', async () => {
    return { authToken }; // Re-fetches with new identifier
  });

  // Use admin token
  const response = await request.get('/api/admin/users', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
});

// Option 2: Parallel execution with different users
test.describe.parallel('multi-user tests', () => {
  test('user 1 actions', async ({ authToken }) => {
    // Uses default user (e.g., 'user1')
  });

  test('user 2 actions', async ({ authToken, authOptions }) => {
    authOptions.userIdentifier = 'user2';
    // Uses different token for user2
  });
});
```

**Key Points**:

- Override `authOptions.userIdentifier` per test
- Tokens cached separately per user identifier
- Parallel tests isolated with different users
- Worker-specific accounts possible

### Example 3: Ephemeral User Authentication

**Context**: Create temporary test users that don't persist to disk (e.g., testing user creation flow).

**Implementation**:

```typescript
import { applyUserCookiesToBrowserContext } from '@seontechnologies/playwright-utils/auth-session';
import { createTestUser } from '../utils/user-factory';

test('ephemeral user test', async ({ context, page }) => {
  // Create temporary user (not persisted)
  const ephemeralUser = await createTestUser({
    role: 'admin',
    permissions: ['delete-users'],
  });

  // Apply auth directly to browser context
  await applyUserCookiesToBrowserContext(context, ephemeralUser);

  // Page now authenticated as ephemeral user
  await page.goto('/admin/users');

  await expect(page.getByTestId('delete-user-btn')).toBeVisible();

  // User and token cleaned up after test
});
```

**Key Points**:

- No disk persistence (ephemeral)
- Apply cookies directly to context
- Useful for testing user lifecycle
- Clean up automatic when test ends

### Example 4: Testing Multiple Users in Single Test

**Context**: Testing interactions between users (messaging, sharing, collaboration features).

**Implementation**:

```typescript
test('user interaction', async ({ browser }) => {
  // User 1 context
  const user1Context = await browser.newContext({
    storageState: './auth-sessions/local/user1/storage-state.json',
  });
  const user1Page = await user1Context.newPage();

  // User 2 context
  const user2Context = await browser.newContext({
    storageState: './auth-sessions/local/user2/storage-state.json',
  });
  const user2Page = await user2Context.newPage();

  // User 1 sends message
  await user1Page.goto('/messages');
  await user1Page.fill('#message', 'Hello from user 1');
  await user1Page.click('#send');

  // User 2 receives message
  await user2Page.goto('/messages');
  await expect(user2Page.getByText('Hello from user 1')).toBeVisible();

  // Cleanup
  await user1Context.close();
  await user2Context.close();
});
```

**Key Points**:

- Each user has separate browser context
- Reference storage state files directly
- Test real-time interactions
- Clean up contexts after test

### Example 5: Worker-Specific Accounts (Parallel Testing)

**Context**: Running tests in parallel with isolated user accounts per worker to avoid conflicts.

**Implementation**:

```typescript
// playwright.config.ts
export default defineConfig({
  workers: 4, // 4 parallel workers
  use: {
    // Each worker uses different user
    storageState: async ({}, use, testInfo) => {
      const workerIndex = testInfo.workerIndex;
      const userIdentifier = `worker-${workerIndex}`;

      await use(`./auth-sessions/local/${userIdentifier}/storage-state.json`);
    },
  },
});

// Tests run in parallel, each worker with its own user
test('parallel test 1', async ({ page }) => {
  // Worker 0 uses worker-0 account
  await page.goto('/dashboard');
});

test('parallel test 2', async ({ page }) => {
  // Worker 1 uses worker-1 account
  await page.goto('/dashboard');
});
```

**Key Points**:

- Each worker has isolated user account
- No conflicts in parallel execution
- Token management automatic per worker
- Scales to any number of workers

## Custom Auth Provider Pattern

**Context**: Adapt auth-session to your authentication system (OAuth2, JWT, SAML, custom).

**Minimal provider structure**:

```typescript
import { type AuthProvider } from '@seontechnologies/playwright-utils/auth-session';

const myCustomProvider: AuthProvider = {
  getEnvironment: (options) => options.environment || 'local',

  getUserIdentifier: (options) => options.userIdentifier || 'default-user',

  extractToken: (storageState) => {
    // Extract token from your storage format
    return storageState.cookies.find((c) => c.name === 'auth_token')?.value;
  },

  extractCookies: (tokenData) => {
    // Convert token to cookies for browser context
    return [
      {
        name: 'auth_token',
        value: tokenData,
        domain: 'example.com',
        path: '/',
        httpOnly: true,
        secure: true,
      },
    ];
  },

  isTokenExpired: (storageState) => {
    // Check if token is expired
    const expiresAt = storageState.cookies.find((c) => c.name === 'expires_at');
    return Date.now() > parseInt(expiresAt?.value || '0');
  },

  manageAuthToken: async (request, options) => {
    // Main token acquisition logic
    // Return storage state with cookies/localStorage
  },
};

export default myCustomProvider;
```

## Integration with API Request

```typescript
import { test } from '@seontechnologies/playwright-utils/fixtures';

test('authenticated API call', async ({ apiRequest, authToken }) => {
  const { status, body } = await apiRequest({
    method: 'GET',
    path: '/api/protected',
    headers: { Authorization: `Bearer ${authToken}` },
  });

  expect(status).toBe(200);
});
```

## Related Fragments

- `overview.md` - Installation and fixture composition
- `api-request.md` - Authenticated API requests
- `fixtures-composition.md` - Merging auth with other utilities

## Anti-Patterns

**❌ Calling setAuthProvider after globalSetup:**

```typescript
async function globalSetup() {
  configureAuthSession(...)
  await authGlobalInit()  // Provider not set yet!
  setAuthProvider(provider)  // Too late
}
```

**✅ Register provider before init:**

```typescript
async function globalSetup() {
  authStorageInit()
  configureAuthSession(...)
  setAuthProvider(provider)  // First
  await authGlobalInit()     // Then init
}
```

**❌ Hardcoding storage paths:**

```typescript
const storageState = './auth-sessions/local/user1/storage-state.json'; // Brittle
```

**✅ Use helper functions:**

```typescript
import { getTokenFilePath } from '@seontechnologies/playwright-utils/auth-session';

const tokenPath = getTokenFilePath({
  environment: 'local',
  userIdentifier: 'user1',
  tokenFileName: 'storage-state.json',
});
```
