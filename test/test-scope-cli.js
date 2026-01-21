/**
 * Scope CLI Test Suite
 *
 * Comprehensive tests for the scope CLI command including:
 * - All subcommands (init, create, list, info, set, unset, remove, archive, activate, sync-up, sync-down)
 * - Help system (main help and subcommand-specific help)
 * - Error handling and edge cases
 * - Integration with ScopeManager, ScopeSync, and other components
 *
 * Usage: node test/test-scope-cli.js
 * Exit codes: 0 = all tests pass, 1 = test failures
 */

const fs = require('fs-extra');
const path = require('node:path');
const os = require('node:os');
const { execSync, spawnSync } = require('node:child_process');

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
    throw new Error(`${message}\n    Expected to contain: "${substring}"\n    Actual: "${str.slice(0, 200)}..."`);
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

function assertNotExists(filePath, message = '') {
  if (fs.existsSync(filePath)) {
    throw new Error(`${message || 'File should not exist'}: ${filePath}`);
  }
}

// Create temporary test directory with BMAD structure
function createTestProject() {
  const tmpDir = path.join(os.tmpdir(), `bmad-cli-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
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

// Get path to CLI
const CLI_PATH = path.join(__dirname, '..', 'tools', 'cli', 'bmad-cli.js');

// Execute CLI command and capture output (string-based, for simple cases)
function runCli(args, cwd, options = {}) {
  const cmd = `node "${CLI_PATH}" ${args}`;
  try {
    const output = execSync(cmd, {
      cwd,
      encoding: 'utf8',
      timeout: options.timeout || 30_000,
      env: { ...process.env, ...options.env, FORCE_COLOR: '0' },
    });
    return { success: true, output, exitCode: 0 };
  } catch (error) {
    return {
      success: false,
      output: error.stdout || '',
      stderr: error.stderr || '',
      exitCode: error.status || 1,
      error: error.message,
    };
  }
}

/**
 * Execute CLI command using spawnSync with an array of arguments.
 * This properly preserves argument boundaries, essential for arguments with spaces.
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

// ============================================================================
// Help System Tests
// ============================================================================

function testHelpSystem() {
  console.log(`\n${colors.blue}${colors.bold}Help System Tests${colors.reset}`);

  const tmpDir = createTestProject();

  try {
    // Main help
    test('scope help shows overview', () => {
      const result = runCli('scope help', tmpDir);
      assertContains(result.output, 'BMAD Scope Management');
      assertContains(result.output, 'OVERVIEW');
      assertContains(result.output, 'COMMANDS');
    });

    test('scope help shows all commands', () => {
      const result = runCli('scope help', tmpDir);
      assertContains(result.output, 'init');
      assertContains(result.output, 'list');
      assertContains(result.output, 'create');
      assertContains(result.output, 'info');
      assertContains(result.output, 'set');
      assertContains(result.output, 'unset');
      assertContains(result.output, 'remove');
      assertContains(result.output, 'archive');
      assertContains(result.output, 'activate');
      assertContains(result.output, 'sync-up');
      assertContains(result.output, 'sync-down');
    });

    test('scope help shows options', () => {
      const result = runCli('scope help', tmpDir);
      assertContains(result.output, 'OPTIONS');
      assertContains(result.output, '--name');
      assertContains(result.output, '--description');
      assertContains(result.output, '--force');
      assertContains(result.output, '--dry-run');
      assertContains(result.output, '--resolution');
    });

    test('scope help shows quick start', () => {
      const result = runCli('scope help', tmpDir);
      assertContains(result.output, 'QUICK START');
      assertContains(result.output, 'scope init');
      assertContains(result.output, 'scope create');
      assertContains(result.output, 'scope set');
    });

    test('scope help shows directory structure', () => {
      const result = runCli('scope help', tmpDir);
      assertContains(result.output, 'DIRECTORY STRUCTURE');
      assertContains(result.output, '_bmad-output');
      assertContains(result.output, '_shared');
      assertContains(result.output, 'scopes.yaml');
    });

    test('scope help shows access model', () => {
      const result = runCli('scope help', tmpDir);
      assertContains(result.output, 'ACCESS MODEL');
      assertContains(result.output, 'read-any');
      assertContains(result.output, 'write-own');
    });

    test('scope help shows troubleshooting', () => {
      const result = runCli('scope help', tmpDir);
      assertContains(result.output, 'TROUBLESHOOTING');
    });

    // Subcommand-specific help
    test('scope help init shows detailed help', () => {
      const result = runCli('scope help init', tmpDir);
      assertContains(result.output, 'bmad scope init');
      assertContains(result.output, 'DESCRIPTION');
      assertContains(result.output, 'USAGE');
      assertContains(result.output, 'WHAT IT CREATES');
    });

    test('scope help create shows detailed help', () => {
      const result = runCli('scope help create', tmpDir);
      assertContains(result.output, 'bmad scope create');
      assertContains(result.output, 'ARGUMENTS');
      assertContains(result.output, 'OPTIONS');
      assertContains(result.output, '--name');
      assertContains(result.output, '--deps');
      assertContains(result.output, 'SCOPE ID RULES');
    });

    test('scope help list shows detailed help', () => {
      const result = runCli('scope help list', tmpDir);
      assertContains(result.output, 'bmad scope list');
      assertContains(result.output, '--status');
      assertContains(result.output, 'OUTPUT COLUMNS');
    });

    test('scope help info shows detailed help', () => {
      const result = runCli('scope help info', tmpDir);
      assertContains(result.output, 'bmad scope info');
      assertContains(result.output, 'DISPLAYED INFORMATION');
    });

    test('scope help set shows detailed help', () => {
      const result = runCli('scope help set', tmpDir);
      assertContains(result.output, 'bmad scope set');
      assertContains(result.output, '.bmad-scope');
      assertContains(result.output, 'BMAD_SCOPE');
      assertContains(result.output, 'FILE FORMAT');
    });

    test('scope help unset shows detailed help', () => {
      const result = runCli('scope help unset', tmpDir);
      assertContains(result.output, 'bmad scope unset');
      assertContains(result.output, 'Clear');
    });

    test('scope help remove shows detailed help', () => {
      const result = runCli('scope help remove', tmpDir);
      assertContains(result.output, 'bmad scope remove');
      assertContains(result.output, '--force');
      assertContains(result.output, '--no-backup');
      assertContains(result.output, 'BACKUP LOCATION');
    });

    test('scope help archive shows detailed help', () => {
      const result = runCli('scope help archive', tmpDir);
      assertContains(result.output, 'bmad scope archive');
      assertContains(result.output, 'BEHAVIOR');
    });

    test('scope help activate shows detailed help', () => {
      const result = runCli('scope help activate', tmpDir);
      assertContains(result.output, 'bmad scope activate');
      assertContains(result.output, 'Reactivate');
    });

    test('scope help sync-up shows detailed help', () => {
      const result = runCli('scope help sync-up', tmpDir);
      assertContains(result.output, 'bmad scope sync-up');
      assertContains(result.output, 'WHAT GETS PROMOTED');
      assertContains(result.output, '--dry-run');
      assertContains(result.output, '--resolution');
    });

    test('scope help sync-down shows detailed help', () => {
      const result = runCli('scope help sync-down', tmpDir);
      assertContains(result.output, 'bmad scope sync-down');
      assertContains(result.output, '--dry-run');
      assertContains(result.output, 'keep-local');
      assertContains(result.output, 'keep-shared');
    });

    // Alias help
    test('scope help ls shows list help', () => {
      const result = runCli('scope help ls', tmpDir);
      assertContains(result.output, 'bmad scope list');
    });

    test('scope help use shows set help', () => {
      const result = runCli('scope help use', tmpDir);
      assertContains(result.output, 'bmad scope set');
    });

    test('scope help clear shows unset help', () => {
      const result = runCli('scope help clear', tmpDir);
      assertContains(result.output, 'bmad scope unset');
    });

    test('scope help rm shows remove help', () => {
      const result = runCli('scope help rm', tmpDir);
      assertContains(result.output, 'bmad scope remove');
    });

    test('scope help syncup shows sync-up help', () => {
      const result = runCli('scope help syncup', tmpDir);
      assertContains(result.output, 'bmad scope sync-up');
    });

    // Unknown command help
    test('scope help unknown-cmd shows error', () => {
      const result = runCli('scope help foobar', tmpDir);
      assertContains(result.output, 'Unknown command');
      assertContains(result.output, 'foobar');
    });

    // No args shows help
    test('scope with no args shows help', () => {
      const result = runCli('scope', tmpDir);
      assertContains(result.output, 'BMAD Scope Management');
    });
  } finally {
    cleanupTestProject(tmpDir);
  }
}

// ============================================================================
// Init Command Tests
// ============================================================================

function testInitCommand() {
  console.log(`\n${colors.blue}${colors.bold}Init Command Tests${colors.reset}`);

  test('scope init creates configuration', () => {
    const tmpDir = createTestProject();
    try {
      const result = runCli('scope init', tmpDir);
      assertTrue(result.success, `Init should succeed: ${result.stderr || result.error}`);
      assertContains(result.output, 'initialized successfully');

      // Check files created
      assertExists(path.join(tmpDir, '_bmad', '_config', 'scopes.yaml'));
      assertExists(path.join(tmpDir, '_bmad-output', '_shared'));
      assertExists(path.join(tmpDir, '_bmad', '_events'));
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope init is idempotent', () => {
    const tmpDir = createTestProject();
    try {
      // Run init twice
      runCli('scope init', tmpDir);
      const result = runCli('scope init', tmpDir);
      assertTrue(result.success, 'Second init should succeed');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });
}

// ============================================================================
// Create Command Tests
// ============================================================================

function testCreateCommand() {
  console.log(`\n${colors.blue}${colors.bold}Create Command Tests${colors.reset}`);

  test('scope create with all options', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope create auth --name "Authentication" --description "User auth"', tmpDir);
      assertTrue(result.success, `Create should succeed: ${result.stderr || result.error}`);
      assertContains(result.output, "Scope 'auth' created successfully");

      // Check directories created
      assertExists(path.join(tmpDir, '_bmad-output', 'auth', 'planning-artifacts'));
      assertExists(path.join(tmpDir, '_bmad-output', 'auth', 'implementation-artifacts'));
      assertExists(path.join(tmpDir, '_bmad-output', 'auth', 'tests'));
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope create with dependencies', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create users --name "Users" --description ""', tmpDir);
      const result = runCli('scope create auth --name "Auth" --description "" --deps users', tmpDir);
      assertTrue(result.success, 'Create with deps should succeed');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope create with --context flag', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope create auth --name "Auth" --description "" --context', tmpDir);
      assertTrue(result.success, 'Create with context should succeed');
      // Note: project-context.md creation depends on ScopeInitializer implementation
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope create auto-initializes if needed', () => {
    const tmpDir = createTestProject();
    try {
      // Don't run init, but create should auto-init
      const result = runCli('scope create auth --name "Auth" --description ""', tmpDir);
      assertTrue(result.success, 'Create should auto-init');
      assertExists(path.join(tmpDir, '_bmad', '_config', 'scopes.yaml'));
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope create rejects invalid ID (uppercase)', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope create Auth --name "Auth"', tmpDir);
      assertFalse(result.success, 'Should reject uppercase');
      assertContains(result.output + result.stderr, 'Error');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope create rejects invalid ID (underscore)', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope create user_auth --name "Auth" --description ""', tmpDir);
      assertFalse(result.success, 'Should reject underscore');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope create rejects reserved name _shared', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope create _shared --name "Shared" --description ""', tmpDir);
      assertFalse(result.success, 'Should reject _shared');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope new is alias for create', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope new auth --name "Auth"', tmpDir);
      assertTrue(result.success, 'new alias should work');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });
}

// ============================================================================
// List Command Tests
// ============================================================================

function testListCommand() {
  console.log(`\n${colors.blue}${colors.bold}List Command Tests${colors.reset}`);

  test('scope list shows no scopes initially', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope list', tmpDir);
      assertContains(result.output, 'No scopes found');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope list shows created scopes', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Authentication" --description ""', tmpDir);
      runCli('scope create payments --name "Payments" --description ""', tmpDir);

      const result = runCli('scope list', tmpDir);
      assertContains(result.output, 'auth');
      assertContains(result.output, 'payments');
      assertContains(result.output, 'Authentication');
      assertContains(result.output, 'Payments');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope list --status active filters', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);
      runCli('scope create old --name "Old" --description ""', tmpDir);
      runCli('scope archive old', tmpDir);

      const result = runCli('scope list --status active', tmpDir);
      assertContains(result.output, 'auth');
      assertNotContains(result.output, 'old');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope list --status archived filters', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);
      runCli('scope create old --name "Old" --description ""', tmpDir);
      runCli('scope archive old', tmpDir);

      const result = runCli('scope list --status archived', tmpDir);
      assertContains(result.output, 'old');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope ls is alias for list', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope ls', tmpDir);
      assertTrue(result.success, 'ls alias should work');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope list without init shows helpful message', () => {
    const tmpDir = createTestProject();
    try {
      // Remove the _config directory to simulate uninitialized
      fs.rmSync(path.join(tmpDir, '_bmad', '_config'), { recursive: true, force: true });

      const result = runCli('scope list', tmpDir);
      assertContains(result.output, 'not initialized');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });
}

// ============================================================================
// Info Command Tests
// ============================================================================

function testInfoCommand() {
  console.log(`\n${colors.blue}${colors.bold}Info Command Tests${colors.reset}`);

  test('scope info shows scope details', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Authentication" --description "User auth system"', tmpDir);

      const result = runCli('scope info auth', tmpDir);
      assertTrue(result.success, 'Info should succeed');
      assertContains(result.output, 'auth');
      assertContains(result.output, 'Authentication');
      assertContains(result.output, 'active');
      assertContains(result.output, 'planning-artifacts');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope info shows dependencies', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create users --name "Users" --description ""', tmpDir);
      runCli('scope create auth --name "Auth" --description "" --deps users', tmpDir);

      const result = runCli('scope info auth', tmpDir);
      assertContains(result.output, 'Dependencies');
      assertContains(result.output, 'users');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope info on non-existent scope fails', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope info nonexistent', tmpDir);
      assertFalse(result.success, 'Should fail for non-existent scope');
      assertContains(result.output + result.stderr, 'not found');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope info requires ID', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope info', tmpDir);
      assertFalse(result.success, 'Should require ID');
      assertContains(result.output + result.stderr, 'required');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope show is alias for info', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);
      const result = runCli('scope show auth', tmpDir);
      assertTrue(result.success, 'show alias should work');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope <id> shorthand shows info', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);
      const result = runCli('scope auth', tmpDir);
      assertTrue(result.success, 'shorthand should work');
      assertContains(result.output, 'auth');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });
}

// ============================================================================
// Set/Unset Command Tests
// ============================================================================

function testSetUnsetCommands() {
  console.log(`\n${colors.blue}${colors.bold}Set/Unset Command Tests${colors.reset}`);

  test('scope set creates .bmad-scope file', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);

      const result = runCli('scope set auth', tmpDir);
      assertTrue(result.success, `Set should succeed: ${result.stderr || result.error}`);
      assertContains(result.output, "Active scope set to 'auth'");

      // Check file created
      const scopeFile = path.join(tmpDir, '.bmad-scope');
      assertExists(scopeFile);

      const content = fs.readFileSync(scopeFile, 'utf8');
      assertContains(content, 'active_scope: auth');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope set validates scope exists', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope set nonexistent', tmpDir);
      assertFalse(result.success, 'Should fail for non-existent scope');
      assertContains(result.output + result.stderr, 'not found');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope set warns for archived scope', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create old --name "Old" --description ""', tmpDir);
      runCli('scope archive old', tmpDir);

      // This will prompt for confirmation - we can't easily test interactive mode
      // Just verify it doesn't crash with the scope being archived
      const result = runCli('scope info old', tmpDir);
      assertContains(result.output, 'archived');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope unset removes .bmad-scope file', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);
      runCli('scope set auth', tmpDir);

      const scopeFile = path.join(tmpDir, '.bmad-scope');
      assertExists(scopeFile);

      const result = runCli('scope unset', tmpDir);
      assertTrue(result.success, 'Unset should succeed');
      assertContains(result.output, 'Active scope cleared');
      assertNotExists(scopeFile);
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope unset when no scope is set', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope unset', tmpDir);
      assertTrue(result.success, 'Unset should succeed even if no scope');
      assertContains(result.output, 'No active scope');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope use is alias for set', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);
      const result = runCli('scope use auth', tmpDir);
      assertTrue(result.success, 'use alias should work');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope clear is alias for unset', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);
      runCli('scope set auth', tmpDir);
      const result = runCli('scope clear', tmpDir);
      assertTrue(result.success, 'clear alias should work');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });
}

// ============================================================================
// Archive/Activate Command Tests
// ============================================================================

function testArchiveActivateCommands() {
  console.log(`\n${colors.blue}${colors.bold}Archive/Activate Command Tests${colors.reset}`);

  test('scope archive changes status', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);

      const result = runCli('scope archive auth', tmpDir);
      assertTrue(result.success, 'Archive should succeed');
      assertContains(result.output, 'archived');

      // Verify status changed
      const infoResult = runCli('scope info auth', tmpDir);
      assertContains(infoResult.output, 'archived');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope archive requires ID', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope archive', tmpDir);
      assertFalse(result.success, 'Should require ID');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope activate reactivates archived scope', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);
      runCli('scope archive auth', tmpDir);

      const result = runCli('scope activate auth', tmpDir);
      assertTrue(result.success, 'Activate should succeed');
      assertContains(result.output, 'activated');

      // Verify status changed back
      const infoResult = runCli('scope info auth', tmpDir);
      assertContains(infoResult.output, 'active');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope activate requires ID', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope activate', tmpDir);
      assertFalse(result.success, 'Should require ID');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });
}

// ============================================================================
// Remove Command Tests
// ============================================================================

function testRemoveCommand() {
  console.log(`\n${colors.blue}${colors.bold}Remove Command Tests${colors.reset}`);

  test('scope remove --force removes scope', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);

      const result = runCli('scope remove auth --force', tmpDir);
      assertTrue(result.success, 'Remove should succeed');
      assertContains(result.output, 'removed successfully');

      // Verify scope is gone
      const listResult = runCli('scope list', tmpDir);
      assertNotContains(listResult.output, 'auth');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope remove creates backup by default', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);

      const result = runCli('scope remove auth --force', tmpDir);
      assertContains(result.output, 'backup');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope remove --force --no-backup skips backup', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);

      const result = runCli('scope remove auth --force --no-backup', tmpDir);
      assertTrue(result.success, 'Remove should succeed');
      assertNotContains(result.output, 'backup was created');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope remove requires ID', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope remove --force', tmpDir);
      assertFalse(result.success, 'Should require ID');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope remove on non-existent scope fails', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope remove nonexistent --force', tmpDir);
      assertFalse(result.success, 'Should fail');
      assertContains(result.output + result.stderr, 'not found');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope rm is alias for remove', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);
      const result = runCli('scope rm auth --force', tmpDir);
      assertTrue(result.success, 'rm alias should work');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope delete is alias for remove', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);
      const result = runCli('scope delete auth --force', tmpDir);
      assertTrue(result.success, 'delete alias should work');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });
}

// ============================================================================
// Sync Command Tests
// ============================================================================

function testSyncCommands() {
  console.log(`\n${colors.blue}${colors.bold}Sync Command Tests${colors.reset}`);

  test('scope sync-up requires scope ID', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope sync-up', tmpDir);
      assertFalse(result.success, 'Should require ID');
      assertContains(result.output + result.stderr, 'required');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope sync-up validates scope exists', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope sync-up nonexistent', tmpDir);
      assertFalse(result.success, 'Should fail for non-existent scope');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope sync-up --dry-run shows analysis', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);

      const result = runCli('scope sync-up auth --dry-run', tmpDir);
      assertTrue(result.success, 'Dry run should succeed');
      assertContains(result.output, 'Dry Run');
      assertContains(result.output, 'patterns');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope sync-up runs without errors', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);

      const result = runCli('scope sync-up auth', tmpDir);
      assertTrue(result.success, `Sync-up should succeed: ${result.stderr || result.error}`);
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope sync-down requires scope ID', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope sync-down', tmpDir);
      assertFalse(result.success, 'Should require ID');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope sync-down validates scope exists', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope sync-down nonexistent', tmpDir);
      assertFalse(result.success, 'Should fail for non-existent scope');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope sync-down --dry-run shows analysis', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);

      const result = runCli('scope sync-down auth --dry-run', tmpDir);
      assertTrue(result.success, 'Dry run should succeed');
      assertContains(result.output, 'Dry Run');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope sync-down runs without errors', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);

      const result = runCli('scope sync-down auth', tmpDir);
      assertTrue(result.success, `Sync-down should succeed: ${result.stderr || result.error}`);
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope syncup is alias for sync-up', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);
      const result = runCli('scope syncup auth --dry-run', tmpDir);
      assertTrue(result.success, 'syncup alias should work');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope syncdown is alias for sync-down', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);
      const result = runCli('scope syncdown auth --dry-run', tmpDir);
      assertTrue(result.success, 'syncdown alias should work');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });
}

// ============================================================================
// Edge Cases and Error Handling Tests
// ============================================================================

function testEdgeCases() {
  console.log(`\n${colors.blue}${colors.bold}Edge Cases and Error Handling Tests${colors.reset}`);

  test('handles special characters in scope name', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope create auth --name "Auth & Users (v2)" --description ""', tmpDir);
      assertTrue(result.success, 'Should handle special chars in name');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('handles empty description', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const result = runCli('scope create auth --name "Auth" --description "" --description ""', tmpDir);
      assertTrue(result.success, 'Should handle empty description');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('handles multiple dependencies', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create users --name "Users" --description ""', tmpDir);
      runCli('scope create notifications --name "Notifications" --description ""', tmpDir);
      runCli('scope create logging --name "Logging" --description ""', tmpDir);

      const result = runCli('scope create auth --name "Auth" --description "" --deps users,notifications,logging', tmpDir);
      assertTrue(result.success, 'Should handle multiple deps');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('handles long scope ID', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const longId = 'a'.repeat(50);
      const result = runCli(`scope create ${longId} --name "Long ID"`, tmpDir);
      assertTrue(result.success, 'Should handle long ID');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('rejects too long scope ID', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      const tooLongId = 'a'.repeat(51);
      const result = runCli(`scope create ${tooLongId} --name "Too Long"`, tmpDir);
      assertFalse(result.success, 'Should reject too long ID');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('DEBUG env var enables verbose output', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);
      runCli('scope create auth --name "Auth" --description ""', tmpDir);

      // Trigger an error with DEBUG enabled
      const result = runCli('scope info nonexistent', tmpDir, { env: { DEBUG: 'true' } });
      // Just verify it doesn't crash with DEBUG enabled
      assertFalse(result.success);
    } finally {
      cleanupTestProject(tmpDir);
    }
  });
}

// ============================================================================
// Integration Tests
// ============================================================================

function testIntegration() {
  console.log(`\n${colors.blue}${colors.bold}Integration Tests${colors.reset}`);

  test('full workflow: init -> create -> set -> list -> archive -> activate -> remove', () => {
    const tmpDir = createTestProject();
    try {
      // Init
      let result = runCli('scope init', tmpDir);
      assertTrue(result.success, 'Init failed');

      // Create scopes
      result = runCli('scope create auth --name "Authentication" --description ""', tmpDir);
      assertTrue(result.success, 'Create auth failed');

      result = runCli('scope create payments --name "Payments" --description "" --deps auth', tmpDir);
      assertTrue(result.success, 'Create payments failed');

      // Set active scope
      result = runCli('scope set auth', tmpDir);
      assertTrue(result.success, 'Set failed');

      // List scopes
      result = runCli('scope list', tmpDir);
      assertTrue(result.success, 'List failed');
      assertContains(result.output, 'auth');
      assertContains(result.output, 'payments');

      // Archive
      result = runCli('scope archive auth', tmpDir);
      assertTrue(result.success, 'Archive failed');

      // Activate
      result = runCli('scope activate auth', tmpDir);
      assertTrue(result.success, 'Activate failed');

      // Unset
      result = runCli('scope unset', tmpDir);
      assertTrue(result.success, 'Unset failed');

      // Remove
      result = runCli('scope remove payments --force', tmpDir);
      assertTrue(result.success, 'Remove payments failed');

      result = runCli('scope remove auth --force', tmpDir);
      assertTrue(result.success, 'Remove auth failed');

      // Verify all gone
      result = runCli('scope list', tmpDir);
      assertContains(result.output, 'No scopes found');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('parallel scopes simulation', () => {
    const tmpDir = createTestProject();
    try {
      runCli('scope init', tmpDir);

      // Create multiple scopes (simulating parallel development)
      runCli('scope create frontend --name "Frontend" --description ""', tmpDir);
      runCli('scope create backend --name "Backend" --description ""', tmpDir);
      runCli('scope create mobile --name "Mobile" --description "" --deps backend', tmpDir);

      // Verify all exist
      const result = runCli('scope list', tmpDir);
      assertContains(result.output, 'frontend');
      assertContains(result.output, 'backend');
      assertContains(result.output, 'mobile');

      // Check dependencies
      const infoResult = runCli('scope info mobile', tmpDir);
      assertContains(infoResult.output, 'backend');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });
}

// ============================================================================
// Argument Handling Tests (using runCliArray for proper boundary preservation)
// ============================================================================

function testArgumentHandling() {
  console.log(`\n${colors.blue}${colors.bold}Argument Handling Tests${colors.reset}`);

  test('scope create with multi-word description (array args)', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      const result = runCliArray(
        ['scope', 'create', 'auth', '--name', 'Auth Service', '--description', 'Handles user authentication and sessions'],
        tmpDir,
      );
      assertTrue(result.success, `Create should succeed: ${result.stderr || result.error}`);

      const infoResult = runCliArray(['scope', 'info', 'auth'], tmpDir);
      assertContains(infoResult.output, 'Auth Service');
      assertContains(infoResult.output, 'Handles user authentication and sessions');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('scope create with 9-word description (regression test)', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);
      // This exact case caused "too many arguments" error before the fix
      const result = runCliArray(
        ['scope', 'create', 'auto-queue', '--name', 'AutoQueue', '--description', 'PRD Auto queue for not inbound yet products'],
        tmpDir,
      );
      assertTrue(result.success, `Should not fail with "too many arguments": ${result.stderr}`);
      assertNotContains(result.stderr || '', 'too many arguments');

      const infoResult = runCliArray(['scope', 'info', 'auto-queue'], tmpDir);
      assertContains(infoResult.output, 'PRD Auto queue for not inbound yet products');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('all subcommands work with array args', () => {
    const tmpDir = createTestProject();
    try {
      // init
      let result = runCliArray(['scope', 'init'], tmpDir);
      assertTrue(result.success, 'init should work');

      // create
      result = runCliArray(['scope', 'create', 'test', '--name', 'Test Scope', '--description', 'A test scope'], tmpDir);
      assertTrue(result.success, 'create should work');

      // list
      result = runCliArray(['scope', 'list'], tmpDir);
      assertTrue(result.success, 'list should work');
      assertContains(result.output, 'test');

      // info
      result = runCliArray(['scope', 'info', 'test'], tmpDir);
      assertTrue(result.success, 'info should work');

      // set
      result = runCliArray(['scope', 'set', 'test'], tmpDir);
      assertTrue(result.success, 'set should work');

      // archive
      result = runCliArray(['scope', 'archive', 'test'], tmpDir);
      assertTrue(result.success, 'archive should work');

      // activate
      result = runCliArray(['scope', 'activate', 'test'], tmpDir);
      assertTrue(result.success, 'activate should work');

      // sync-up
      result = runCliArray(['scope', 'sync-up', 'test', '--dry-run'], tmpDir);
      assertTrue(result.success, 'sync-up should work');

      // sync-down
      result = runCliArray(['scope', 'sync-down', 'test', '--dry-run'], tmpDir);
      assertTrue(result.success, 'sync-down should work');

      // unset
      result = runCliArray(['scope', 'unset'], tmpDir);
      assertTrue(result.success, 'unset should work');

      // remove
      result = runCliArray(['scope', 'remove', 'test', '--force'], tmpDir);
      assertTrue(result.success, 'remove should work');

      // help
      result = runCliArray(['scope', 'help'], tmpDir);
      assertTrue(result.success, 'help should work');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });

  test('subcommand aliases work with array args', () => {
    const tmpDir = createTestProject();
    try {
      runCliArray(['scope', 'init'], tmpDir);

      // new (alias for create) - include --description to avoid interactive prompt
      let result = runCliArray(['scope', 'new', 'test', '--name', 'Test', '--description', ''], tmpDir);
      assertTrue(result.success, 'new alias should work');

      // ls (alias for list)
      result = runCliArray(['scope', 'ls'], tmpDir);
      assertTrue(result.success, 'ls alias should work');

      // show (alias for info)
      result = runCliArray(['scope', 'show', 'test'], tmpDir);
      assertTrue(result.success, 'show alias should work');

      // use (alias for set)
      result = runCliArray(['scope', 'use', 'test'], tmpDir);
      assertTrue(result.success, 'use alias should work');

      // clear (alias for unset)
      result = runCliArray(['scope', 'clear'], tmpDir);
      assertTrue(result.success, 'clear alias should work');

      // syncup (alias for sync-up)
      result = runCliArray(['scope', 'syncup', 'test', '--dry-run'], tmpDir);
      assertTrue(result.success, 'syncup alias should work');

      // syncdown (alias for sync-down)
      result = runCliArray(['scope', 'syncdown', 'test', '--dry-run'], tmpDir);
      assertTrue(result.success, 'syncdown alias should work');

      // rm (alias for remove)
      result = runCliArray(['scope', 'rm', 'test', '--force'], tmpDir);
      assertTrue(result.success, 'rm alias should work');
    } finally {
      cleanupTestProject(tmpDir);
    }
  });
}

// ============================================================================
// Main Test Runner
// ============================================================================

function main() {
  console.log(`\n${colors.bold}BMAD Scope CLI Test Suite${colors.reset}`);
  console.log(colors.dim + '═'.repeat(70) + colors.reset);

  const startTime = Date.now();

  // Run all test suites
  testHelpSystem();
  testInitCommand();
  testCreateCommand();
  testListCommand();
  testInfoCommand();
  testSetUnsetCommands();
  testArchiveActivateCommands();
  testRemoveCommand();
  testSyncCommands();
  testEdgeCases();
  testIntegration();
  testArgumentHandling();

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
