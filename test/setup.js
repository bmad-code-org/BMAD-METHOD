import { beforeEach, afterEach } from 'vitest';

// Global test setup
beforeEach(() => {
  // Reset environment variables to prevent test pollution
  // Store original env for restoration
  if (!globalThis.__originalEnv) {
    globalThis.__originalEnv = { ...process.env };
  }
});

afterEach(async () => {
  // Restore original environment variables
  if (globalThis.__originalEnv) {
    process.env = { ...globalThis.__originalEnv };
  }

  // Any global cleanup can go here
});

// Increase timeout for file system operations
// (Individual tests can override this if needed)
const DEFAULT_TIMEOUT = 10_000; // 10 seconds

// Make timeout available globally
globalThis.DEFAULT_TEST_TIMEOUT = DEFAULT_TIMEOUT;
