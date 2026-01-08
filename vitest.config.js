import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test file patterns
    include: ['test/unit/**/*.test.js', 'test/integration/**/*.test.js'],
    exclude: ['test/test-*.js', 'node_modules/**'],

    // Timeouts
    testTimeout: 10_000, // 10s for unit tests
    hookTimeout: 30_000, // 30s for setup/teardown

    // Parallel execution for speed
    threads: true,
    maxThreads: 4,

    // Coverage configuration (using V8)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json-summary'],

      // Files to include in coverage
      include: ['tools/**/*.js', 'src/**/*.js'],

      // Files to exclude from coverage
      exclude: [
        'test/**',
        'tools/flattener/**', // Separate concern
        'tools/bmad-npx-wrapper.js', // Entry point
        'tools/build-docs.js', // Documentation tools
        'tools/check-doc-links.js', // Documentation tools
        '**/*.config.js', // Configuration files
      ],

      // Include all files for accurate coverage
      all: true,

      // Coverage thresholds (fail if below these)
      statements: 85,
      branches: 80,
      functions: 85,
      lines: 85,
    },

    // Global setup file
    setupFiles: ['./test/setup.js'],

    // Environment
    environment: 'node',
  },
});
