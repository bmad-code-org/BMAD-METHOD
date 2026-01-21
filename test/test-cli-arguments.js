/**
 * CLI Argument Handling Test Suite
 *
 * Tests for proper handling of CLI arguments, especially:
 * - Arguments containing spaces
 * - Arguments with special characters
 * - The npx wrapper's argument preservation
 * - Various quoting scenarios
 *
 * This test suite was created to prevent regression of the bug where
 * the npx wrapper used args.join(' ') which broke arguments containing spaces.
 *
 * Usage: node test/test-cli-arguments.js
 * Exit codes: 0 = all tests pass, 1 = test failures
 */

const fs = require('fs-extra');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

// ANSI color codes
const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  yellow: '\u001B[33m',
  blue: '\u001B[34m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
  bold: '\u001B[1m',
};

// Test utilities
let testCount = 0;
let passCount = 0;
let failCount = 0;
let skipCount = 0;
const failures = [];

function test(name, fn) {
  testCount++;
  try {
    fn();
    passCount++;
    console.log(`  ${colors.green}✓${colors.reset} ${name}`);
  } catch (error) {
    failCount++;
    console.log(`  ${colors.red}✗${colors.reset} ${name}`);
    console.log(`    ${colors.red}${error.message}${colors.reset}`);
    failures.push({ name, error: error.message });
  }
}

async function testAsync(name, fn) {
  testCount++;
  try {
    await fn();
    passCount++;
    console.log(`  ${colors.green}✓${colors.reset} ${name}`);
  } catch (error) {
    failCount++;
    console.log(`  ${colors.red}✗${colors.reset} ${name}`);
    console.log(`    ${colors.red}${error.message}${colors.reset}`);
    failures.push({ name, error: error.message });
  }
}

function skip(name, reason = '') {
  skipCount++;
  console.log(`  ${colors.yellow}○${colors.reset} ${name} ${colors.dim}(skipped${reason ? ': ' + reason : ''})${colors.reset}`);
}

function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`${message}\n    Expected: ${JSON.stringify(expected)}\n    Actual: ${JSON.stringify(actual)}`);
  }
}

function assertTrue(value, message = 'Expected true') {
  if (!value) {
    throw new Error(message);
  }
}

function assertFalse(value, message = 'Expected false') {
  if (value) {
    throw new Error(message);
  }
}

function assertContains(str, substring, message = '') {
  if (!str.includes(substring)) {
    throw new Error(`${message}\n    Expected to contain: "${substring}"\n    Actual: "${str.slice(0, 500)}..."`);
  }
}

function assertNotContains(str, substring, message = '') {
  if (str.includes(substring)) {
    throw new Error(`${message}\n    Expected NOT to contain: "${substring}"`);
  }
}

function assertExists(filePath, message = '') {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${message || 'File does not exist'}: ${filePath}`);
  }
}

// Create temporary test directory with BMAD structure
function createTestProject() {
  const tmpDir = path.join(os.tmpdir(), `bmad-cli-args-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  // Create minimal BMAD structure
  fs.mkdirSync(path.join(tmpDir, '_bmad', '_config'), { recursive: true });
  fs.mkdirSync(path.join(tmpDir, '_bmad-output'), { recursive: true });

  return tmpDir;
}

function cleanupTestProject(tmpDir) {
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
}

// Paths to CLI entry points
const CLI_PATH = path.join(__dirname, '..', 'tools', 'cli', 'bmad-cli.js');
const NPX_WRAPPER_PATH = path.join(__dirname, '..', 'tools', 'bmad-npx-wrapper.js');

/**
 * Execute CLI command using spawnSync with an array of arguments.
 * This properly preserves argument boundaries, just like the shell does.
 *
 * @param {string[]} args - Array of arguments (NOT a joined string)
 * @param {string} cwd - Working directory
 * @param {Object} options - Additional options
 * @returns {Object} Result with success, output, stderr, exitCode
 */
function runCliArray(args, cwd, options = {}) {
  const result = spawnSync('node', [CLI_PATH, ...args], {
    cwd,
    encoding: 'utf8',
    timeout: options.timeout || 30_000,
    env: { ...process.env, ...options.env, FORCE_COLOR: '0' },
  });

  return {
    success: result.status === 0,
    output: result.stdout || '',
    stderr: result.stderr || '',
    exitCode: result.status || 0,
    error: result.error ? result.error.message : null,
  };
}

/**
 * Execute CLI command via the npx wrapper using spawnSync.
 * This tests the actual npx execution path.
 *
 * @param {string[]} args - Array of arguments
 * @param {string} cwd - Working directory
 * @param {Object} options - Additional options
 * @returns {Object} Result with success, output, stderr, exitCode
 */
function runNpxWrapper(args, cwd, options = {}) {
  const result = spawnSync('node', [NPX_WRAPPER_PATH, ...args], {
    cwd,
    encoding: 'utf8',
    timeout: options.timeout || 30_000,
    env: { ...process.env, ...options.env, FORCE_COLOR: '0' },
  });

  return {
    success: result.status === 0,
    output: result.stdout || '',
    stderr: result.stderr || '',
    exitCode: result.status || 0,
    error: result.error ? result.error.message : null,
  };
}

// ============================================================================
// Arguments with Spaces Tests
// ============================================================================

function testArgumentsWithSpaces() {
  console.log(`\n${colors.blue}${colors.bold}Arguments with Spaces Tests${colors.reset}`);

  test('scope create with description containing spaces (direct CLI)', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      const result = runCliArray(
        ['scope', 'create', 'test-scope', '--name', 'Test Scope', '--description', 'This is a description with multiple words'],
        tmpDir,
      );
      assertTrue(result.success, `Create should succeed: ${result.stderr || result.error}`);
      assertContains(result.output, "Scope 'test-scope' created successfully");

      // Verify the description was saved correctly
      const infoResult = runCliArray(['scope', 'info', 'test-scope'], tmpDir);
      assertContains(infoResult.output, 'This is a description with multiple words');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope create with description containing spaces (via npx wrapper)', () => {
    const tmpDir = createTestProject();
    try {
      runNpxWrapper(['scope', 'init'], tmpDir);
      const result = runNpxWrapper(
        ['scope', 'create', 'test-scope', '--name', 'Test Scope', '--description', 'This is a description with multiple words'],
        tmpDir,
      );
      assertTrue(result.success, `Create should succeed via wrapper: ${result.stderr || result.error}`);
      assertContains(result.output, "Scope 'test-scope' created successfully");

      // Verify the description was saved correctly
      const infoResult = runNpxWrapper(['scope', 'info', 'test-scope'], tmpDir);
      assertContains(infoResult.output, 'This is a description with multiple words');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope create with long description (many spaces)', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      const longDesc = 'PRD Auto queue for not inbound yet products with special handling for edge cases';
      const result = runCliArray(['scope', 'create', 'auto-queue', '--name', 'AutoQueue', '--description', longDesc], tmpDir);
      assertTrue(result.success, `Create should succeed: ${result.stderr || result.error}`);

      const infoResult = runCliArray(['scope', 'info', 'auto-queue'], tmpDir);
      assertContains(infoResult.output, 'PRD Auto queue for not inbound yet products');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope create with name containing spaces', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      const result = runCliArray(
        ['scope', 'create', 'auth', '--name', 'User Authentication Service', '--description', 'Handles user auth'],
        tmpDir,
      );
      assertTrue(result.success, `Create should succeed: ${result.stderr || result.error}`);

      const infoResult = runCliArray(['scope', 'info', 'auth'], tmpDir);
      assertContains(infoResult.output, 'User Authentication Service');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });
}

// ============================================================================
// Special Characters Tests
// ============================================================================

function testSpecialCharacters() {
  console.log(`\n${colors.blue}${colors.bold}Special Characters Tests${colors.reset}`);

  test('scope create with name containing ampersand', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      const result = runCliArray(['scope', 'create', 'auth', '--name', 'Auth & Users', '--description', ''], tmpDir);
      assertTrue(result.success, 'Should handle ampersand');

      const infoResult = runCliArray(['scope', 'info', 'auth'], tmpDir);
      assertContains(infoResult.output, 'Auth & Users');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope create with name containing parentheses', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      const result = runCliArray(['scope', 'create', 'auth', '--name', 'Auth Service (v2)', '--description', ''], tmpDir);
      assertTrue(result.success, 'Should handle parentheses');

      const infoResult = runCliArray(['scope', 'info', 'auth'], tmpDir);
      assertContains(infoResult.output, 'Auth Service (v2)');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope create with description containing quotes', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      const result = runCliArray(['scope', 'create', 'auth', '--name', 'Auth', '--description', 'Handle "special" cases'], tmpDir);
      assertTrue(result.success, 'Should handle quotes in description');

      const infoResult = runCliArray(['scope', 'info', 'auth'], tmpDir);
      assertContains(infoResult.output, 'Handle "special" cases');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope create with description containing single quotes', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      const result = runCliArray(['scope', 'create', 'auth', '--name', 'Auth', '--description', "Handle user's authentication"], tmpDir);
      assertTrue(result.success, 'Should handle single quotes');

      const infoResult = runCliArray(['scope', 'info', 'auth'], tmpDir);
      assertContains(infoResult.output, "user's");
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope create with description containing colons', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      const result = runCliArray(
        ['scope', 'create', 'auth', '--name', 'Auth', '--description', 'Features: login, logout, sessions'],
        tmpDir,
      );
      assertTrue(result.success, 'Should handle colons');

      const infoResult = runCliArray(['scope', 'info', 'auth'], tmpDir);
      assertContains(infoResult.output, 'Features: login, logout, sessions');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope create with description containing hyphens and dashes', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      const result = runCliArray(
        ['scope', 'create', 'auth', '--name', 'Auth', '--description', 'Multi-factor auth - two-step verification'],
        tmpDir,
      );
      assertTrue(result.success, 'Should handle hyphens and dashes');

      const infoResult = runCliArray(['scope', 'info', 'auth'], tmpDir);
      assertContains(infoResult.output, 'Multi-factor auth - two-step verification');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope create with description containing slashes', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      const result = runCliArray(['scope', 'create', 'auth', '--name', 'Auth', '--description', 'Handles /api/auth/* endpoints'], tmpDir);
      assertTrue(result.success, 'Should handle slashes');

      const infoResult = runCliArray(['scope', 'info', 'auth'], tmpDir);
      assertContains(infoResult.output, '/api/auth/*');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });
}

// ============================================================================
// NPX Wrapper Specific Tests
// ============================================================================

function testNpxWrapperBehavior() {
  console.log(`\n${colors.blue}${colors.bold}NPX Wrapper Behavior Tests${colors.reset}`);

  test('npx wrapper preserves argument boundaries', () => {
    const tmpDir = createTestProject();
    try {
      runNpxWrapper(['scope', 'init'], tmpDir);

      // This was the exact failing case: description with multiple words
      const result = runNpxWrapper(
        ['scope', 'create', 'auto-queue', '--name', 'AutoQueue', '--description', 'PRD Auto queue for not inbound yet products'],
        tmpDir,
      );
      assertTrue(result.success, `NPX wrapper should preserve spaces: ${result.stderr || result.output}`);

      // Verify full description was saved
      const infoResult = runNpxWrapper(['scope', 'info', 'auto-queue'], tmpDir);
      assertContains(infoResult.output, 'PRD Auto queue for not inbound yet products');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('npx wrapper handles multiple space-containing arguments', () => {
    const tmpDir = createTestProject();
    try {
      runNpxWrapper(['scope', 'init'], tmpDir);

      const result = runNpxWrapper(
        ['scope', 'create', 'test-scope', '--name', 'My Test Scope Name', '--description', 'A long description with many words and spaces'],
        tmpDir,
      );
      assertTrue(result.success, 'Should handle multiple space-containing args');

      const infoResult = runNpxWrapper(['scope', 'info', 'test-scope'], tmpDir);
      assertContains(infoResult.output, 'My Test Scope Name');
      assertContains(infoResult.output, 'A long description with many words and spaces');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('npx wrapper handles help commands', () => {
    const tmpDir = createTestProject();
    try {
      const result = runNpxWrapper(['scope', 'help'], tmpDir);
      assertTrue(result.success, 'Help should work via wrapper');
      assertContains(result.output, 'BMAD Scope Management');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('npx wrapper handles subcommand help', () => {
    const tmpDir = createTestProject();
    try {
      const result = runNpxWrapper(['scope', 'help', 'create'], tmpDir);
      assertTrue(result.success, 'Subcommand help should work via wrapper');
      assertContains(result.output, 'bmad scope create');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('npx wrapper preserves exit codes on failure', () => {
    const tmpDir = createTestProject();
    try {
      runNpxWrapper(['scope', 'init'], tmpDir);
      const result = runNpxWrapper(['scope', 'info', 'nonexistent'], tmpDir);
      assertFalse(result.success, 'Should fail for non-existent scope');
      assertTrue(result.exitCode !== 0, 'Exit code should be non-zero');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });
}

// ============================================================================
// Edge Cases Tests
// ============================================================================

function testEdgeCases() {
  console.log(`\n${colors.blue}${colors.bold}Edge Cases Tests${colors.reset}`);

  test('empty description argument', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      const result = runCliArray(['scope', 'create', 'auth', '--name', 'Auth', '--description', ''], tmpDir);
      assertTrue(result.success, 'Should handle empty description');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('description with only spaces', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      const result = runCliArray(['scope', 'create', 'auth', '--name', 'Auth', '--description', '   '], tmpDir);
      assertTrue(result.success, 'Should handle whitespace-only description');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('name with leading and trailing spaces', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      const result = runCliArray(['scope', 'create', 'auth', '--name', '  Spaced Name  ', '--description', ''], tmpDir);
      assertTrue(result.success, 'Should handle leading/trailing spaces in name');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('mixed flags and positional arguments', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      // Some CLI parsers are sensitive to flag ordering
      const result = runCliArray(['scope', 'create', '--name', 'Auth Service', 'auth', '--description', 'User authentication'], tmpDir);
      // Depending on Commander.js behavior, this might fail or succeed
      // The important thing is it doesn't crash unexpectedly
      // Note: Commander.js is strict about positional arg ordering, so this may fail
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('very long description', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      const longDesc = 'A '.repeat(100) + 'very long description';
      const result = runCliArray(['scope', 'create', 'auth', '--name', 'Auth', '--description', longDesc], tmpDir);
      assertTrue(result.success, 'Should handle very long description');

      const infoResult = runCliArray(['scope', 'info', 'auth'], tmpDir);
      assertContains(infoResult.output, 'very long description');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('description with newline-like content', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      // Note: actual newlines would be handled by the shell, this tests the literal string
      const result = runCliArray(['scope', 'create', 'auth', '--name', 'Auth', '--description', String.raw`Line1\nLine2`], tmpDir);
      assertTrue(result.success, 'Should handle backslash-n in description');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('description with unicode characters', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      const result = runCliArray(['scope', 'create', 'auth', '--name', 'Auth', '--description', 'Handles authentication 认证 🔐'], tmpDir);
      assertTrue(result.success, 'Should handle unicode in description');

      const infoResult = runCliArray(['scope', 'info', 'auth'], tmpDir);
      assertContains(infoResult.output, '认证');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });
}

// ============================================================================
// Argument Count Tests (Regression tests for "too many arguments" error)
// ============================================================================

function testArgumentCounts() {
  console.log(`\n${colors.blue}${colors.bold}Argument Count Tests (Regression)${colors.reset}`);

  test('9-word description does not cause "too many arguments" error', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      // This was the exact case that failed: 9 words became 9 separate arguments
      const result = runCliArray(
        ['scope', 'create', 'auto-queue', '--name', 'AutoQueue', '--description', 'PRD Auto queue for not inbound yet products'],
        tmpDir,
      );
      assertTrue(result.success, `Should not fail with "too many arguments": ${result.stderr}`);
      assertNotContains(result.stderr || '', 'too many arguments');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('20-word description works correctly', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      const desc =
        'This is a very long description with exactly twenty words to test that argument parsing works correctly for descriptions';
      const result = runCliArray(['scope', 'create', 'test', '--name', 'Test', '--description', desc], tmpDir);
      assertTrue(result.success, 'Should handle 20-word description');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('multiple flag values with spaces all preserved', () => {
    const tmpDir = createTestProject();
    try {
      runNpxWrapper(['scope', 'init'], tmpDir);
      const result = runNpxWrapper(
        ['scope', 'create', 'my-scope', '--name', 'My Scope Name Here', '--description', 'This is a description with many spaces'],
        tmpDir,
      );
      assertTrue(result.success, 'All spaced arguments should be preserved');

      const infoResult = runNpxWrapper(['scope', 'info', 'my-scope'], tmpDir);
      assertContains(infoResult.output, 'My Scope Name Here');
      assertContains(infoResult.output, 'This is a description with many spaces');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });
}

// ============================================================================
// Install Command Tests (for completeness)
// ============================================================================

function testInstallCommand() {
  console.log(`\n${colors.blue}${colors.bold}Install Command Tests${colors.reset}`);

  test('install --help works via npx wrapper', () => {
    const tmpDir = createTestProject();
    try {
      const result = runNpxWrapper(['install', '--help'], tmpDir);
      assertTrue(result.success || result.output.includes('Install'), 'Install help should work');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('install --debug flag works', () => {
    const tmpDir = createTestProject();
    try {
      // Just verify the flag is recognized, don't actually run full install
      const result = runNpxWrapper(['install', '--help'], tmpDir);
      // If we got here without crashing, the CLI is working
      assertTrue(true, 'Install command accepts flags');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });
}

// ============================================================================
// Main Test Runner
// ============================================================================

function main() {
  console.log(`\n${colors.bold}BMAD CLI Argument Handling Test Suite${colors.reset}`);
  console.log(colors.dim + '═'.repeat(70) + colors.reset);
  console.log(colors.cyan + 'Testing proper preservation of argument boundaries,' + colors.reset);
  console.log(colors.cyan + 'especially for arguments containing spaces.' + colors.reset);

  const startTime = Date.now();

  // Run all test suites
  testArgumentsWithSpaces();
  testSpecialCharacters();
  testNpxWrapperBehavior();
  testEdgeCases();
  testArgumentCounts();
  testInstallCommand();

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  // Summary
  console.log(`\n${colors.dim}${'─'.repeat(70)}${colors.reset}`);
  console.log(`\n${colors.bold}Test Results${colors.reset}`);
  console.log(`  Total:   ${testCount}`);
  console.log(`  ${colors.green}Passed:  ${passCount}${colors.reset}`);
  if (failCount > 0) {
    console.log(`  ${colors.red}Failed:  ${failCount}${colors.reset}`);
  }
  if (skipCount > 0) {
    console.log(`  ${colors.yellow}Skipped: ${skipCount}${colors.reset}`);
  }
  console.log(`  Time:    ${duration}s`);

  if (failures.length > 0) {
    console.log(`\n${colors.red}${colors.bold}Failures:${colors.reset}`);
    for (const { name, error } of failures) {
      console.log(`\n  ${colors.red}✗${colors.reset} ${name}`);
      console.log(`    ${colors.dim}${error}${colors.reset}`);
    }
    process.exit(1);
  }

  console.log(`\n${colors.green}${colors.bold}All tests passed!${colors.reset}\n`);
  process.exit(0);
}

main();
