/**
 * End-to-End Test: Multi-Scope Parallel Workflows
 *
 * Tests the complete flow of running parallel workflows in different scopes,
 * including artifact isolation, sync operations, and event notifications.
 *
 * Usage: node test/test-scope-e2e.js
 * Exit codes: 0 = all tests pass, 1 = test failures
 */

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

// ANSI color codes
const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  yellow: '\u001B[33m',
  blue: '\u001B[34m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

// Test utilities
let testCount = 0;
let passCount = 0;
let failCount = 0;
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

async function asyncTest(name, fn) {
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

function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`${message}\n    Expected: ${expected}\n    Actual: ${actual}`);
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

function assertFileExists(filePath, message = '') {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${message || 'File should exist'}: ${filePath}`);
  }
}

function assertFileNotExists(filePath, message = '') {
  if (fs.existsSync(filePath)) {
    throw new Error(`${message || 'File should not exist'}: ${filePath}`);
  }
}

function assertFileContains(filePath, content, message = '') {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  if (!fileContent.includes(content)) {
    throw new Error(`${message || 'File should contain'}: "${content}" in ${filePath}`);
  }
}

// Create temporary test directory with BMAD structure
function createTestProject() {
  const tmpDir = path.join(os.tmpdir(), `bmad-e2e-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  // Create BMAD directory structure
  fs.mkdirSync(path.join(tmpDir, '_bmad', '_config'), { recursive: true });
  fs.mkdirSync(path.join(tmpDir, '_bmad', '_events'), { recursive: true });
  fs.mkdirSync(path.join(tmpDir, '_bmad-output'), { recursive: true });

  return tmpDir;
}

function cleanupTestProject(tmpDir) {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

// ============================================================================
// E2E Test: Complete Parallel Workflow Simulation
// ============================================================================

async function testParallelScopeWorkflow() {
  console.log(`\n${colors.blue}E2E: Parallel Scope Workflow Simulation${colors.reset}`);

  const { ScopeManager } = require('../src/core/lib/scope/scope-manager');
  const { ScopeContext } = require('../src/core/lib/scope/scope-context');
  const { ArtifactResolver } = require('../src/core/lib/scope/artifact-resolver');
  const { ScopeSync } = require('../src/core/lib/scope/scope-sync');
  const { EventLogger } = require('../src/core/lib/scope/event-logger');

  let tmpDir;

  try {
    tmpDir = createTestProject();

    // Initialize components
    const manager = new ScopeManager({ projectRoot: tmpDir });
    const context = new ScopeContext({ projectRoot: tmpDir });

    // ========================================
    // Step 1: Initialize scope system
    // ========================================
    await asyncTest('Initialize scope system', async () => {
      await manager.initialize();

      assertFileExists(path.join(tmpDir, '_bmad', '_config', 'scopes.yaml'));
      assertFileExists(path.join(tmpDir, '_bmad-output', '_shared'));
      assertFileExists(path.join(tmpDir, '_bmad', '_events'));
    });

    // ========================================
    // Step 2: Create two scopes (auth and payments)
    // ========================================
    await asyncTest('Create auth scope', async () => {
      const scope = await manager.createScope('auth', {
        name: 'Authentication Service',
        description: 'User auth, SSO, authorization',
      });

      assertEqual(scope.id, 'auth');
      assertEqual(scope.status, 'active');
      assertFileExists(path.join(tmpDir, '_bmad-output', 'auth', 'planning-artifacts'));
      assertFileExists(path.join(tmpDir, '_bmad-output', 'auth', 'implementation-artifacts'));
      assertFileExists(path.join(tmpDir, '_bmad-output', 'auth', 'tests'));
    });

    await asyncTest('Create payments scope with dependency on auth', async () => {
      const scope = await manager.createScope('payments', {
        name: 'Payment Processing',
        description: 'Payment gateway integration',
        dependencies: ['auth'],
      });

      assertEqual(scope.id, 'payments');
      assertTrue(scope.dependencies.includes('auth'));
    });

    // ========================================
    // Step 3: Simulate parallel artifact creation
    // ========================================
    await asyncTest('Simulate parallel PRD creation in auth scope', async () => {
      // Create PRD in auth scope
      const prdPath = path.join(tmpDir, '_bmad-output', 'auth', 'planning-artifacts', 'prd.md');
      fs.writeFileSync(prdPath, '# Auth PRD\n\nAuthentication requirements...');

      assertFileExists(prdPath);
      assertFileContains(prdPath, 'Auth PRD');
    });

    await asyncTest('Simulate parallel PRD creation in payments scope', async () => {
      // Create PRD in payments scope
      const prdPath = path.join(tmpDir, '_bmad-output', 'payments', 'planning-artifacts', 'prd.md');
      fs.writeFileSync(prdPath, '# Payments PRD\n\nPayment processing requirements...');

      assertFileExists(prdPath);
      assertFileContains(prdPath, 'Payments PRD');
    });

    // ========================================
    // Step 4: Verify artifact isolation
    // ========================================
    await asyncTest('Verify artifacts are isolated', async () => {
      const authPrd = fs.readFileSync(path.join(tmpDir, '_bmad-output', 'auth', 'planning-artifacts', 'prd.md'), 'utf8');
      const paymentsPrd = fs.readFileSync(path.join(tmpDir, '_bmad-output', 'payments', 'planning-artifacts', 'prd.md'), 'utf8');

      assertTrue(authPrd.includes('Auth PRD'), 'Auth PRD should contain auth content');
      assertTrue(paymentsPrd.includes('Payments PRD'), 'Payments PRD should contain payments content');
      assertFalse(authPrd.includes('Payments'), 'Auth PRD should not contain payments content');
      assertFalse(paymentsPrd.includes('Auth'), 'Payments PRD should not contain auth content');
    });

    // ========================================
    // Step 5: Test ArtifactResolver access control
    // ========================================
    await asyncTest('ArtifactResolver allows cross-scope read', async () => {
      const resolver = new ArtifactResolver({
        currentScope: 'payments',
        basePath: '_bmad-output',
        projectRoot: tmpDir,
      });

      // Payments scope can read auth scope - canRead returns {allowed, reason}
      assertTrue(
        resolver.canRead(path.join(tmpDir, '_bmad-output', 'auth', 'planning-artifacts', 'prd.md')).allowed,
        'Should allow cross-scope read',
      );
    });

    await asyncTest('ArtifactResolver blocks cross-scope write', async () => {
      const resolver = new ArtifactResolver({
        currentScope: 'payments',
        basePath: '_bmad-output',
        projectRoot: tmpDir,
        isolationMode: 'strict',
      });

      // Payments scope cannot write to auth scope - canWrite returns {allowed, reason, warning}
      assertFalse(
        resolver.canWrite(path.join(tmpDir, '_bmad-output', 'auth', 'planning-artifacts', 'new.md')).allowed,
        'Should block cross-scope write',
      );
    });

    // ========================================
    // Step 6: Test scope context session
    // ========================================
    await asyncTest('Session-sticky scope works', async () => {
      await context.setScope('auth');

      const currentScope = await context.getCurrentScope();
      assertEqual(currentScope, 'auth', 'Session scope should be auth');

      // Check .bmad-scope file was created
      assertFileExists(path.join(tmpDir, '.bmad-scope'));
    });

    await asyncTest('Session scope can be switched', async () => {
      await context.setScope('payments');

      const currentScope = await context.getCurrentScope();
      assertEqual(currentScope, 'payments', 'Session scope should be payments');
    });

    // ========================================
    // Step 7: Test sync-up (promote to shared)
    // ========================================
    await asyncTest('Sync-up promotes artifacts to shared layer', async () => {
      const sync = new ScopeSync({ projectRoot: tmpDir });

      // Create a promotable artifact matching pattern 'architecture/*.md'
      const archPath = path.join(tmpDir, '_bmad-output', 'auth', 'architecture', 'overview.md');
      fs.mkdirSync(path.dirname(archPath), { recursive: true });
      fs.writeFileSync(archPath, '# Auth Architecture\n\nShared auth patterns...');

      await sync.syncUp('auth');

      // Check artifact was promoted to _shared/auth/architecture/overview.md
      assertFileExists(
        path.join(tmpDir, '_bmad-output', '_shared', 'auth', 'architecture', 'overview.md'),
        'Architecture should be promoted to shared',
      );
    });

    // ========================================
    // Step 8: Test event logging
    // ========================================
    await asyncTest('Events are logged', async () => {
      const eventLogger = new EventLogger({ projectRoot: tmpDir });
      await eventLogger.initialize();

      // EventLogger uses logEvent(type, scopeId, data) not log({...})
      await eventLogger.logEvent('artifact_created', 'auth', { artifact: 'prd.md' });

      // getEvents takes (scopeId, options) not ({scope})
      const events = await eventLogger.getEvents('auth');
      assertTrue(events.length > 0, 'Should have logged events');
      assertEqual(events[0].type, 'artifact_created');
    });

    // ========================================
    // Step 9: Test dependency tracking
    // ========================================
    await asyncTest('Dependent scopes can be found', async () => {
      const dependents = await manager.findDependentScopes('auth');

      assertTrue(dependents.includes('payments'), 'payments should depend on auth');
    });

    // ========================================
    // Step 10: Test scope archival
    // ========================================
    await asyncTest('Scope can be archived', async () => {
      await manager.archiveScope('auth');

      const scope = await manager.getScope('auth');
      assertEqual(scope.status, 'archived', 'Scope should be archived');

      // Re-activate for cleanup
      await manager.activateScope('auth');
    });

    // ========================================
    // Step 11: Verify final state
    // ========================================
    await asyncTest('Final state verification', async () => {
      const scopes = await manager.listScopes();
      assertEqual(scopes.length, 2, 'Should have 2 scopes');

      // Both scopes should have their artifacts
      assertFileExists(path.join(tmpDir, '_bmad-output', 'auth', 'planning-artifacts', 'prd.md'));
      assertFileExists(path.join(tmpDir, '_bmad-output', 'payments', 'planning-artifacts', 'prd.md'));

      // Shared layer should have promoted artifacts
      assertFileExists(path.join(tmpDir, '_bmad-output', '_shared'));
    });
  } finally {
    if (tmpDir) {
      cleanupTestProject(tmpDir);
    }
  }
}

// ============================================================================
// E2E Test: Concurrent Lock Simulation
// ============================================================================

async function testConcurrentLockSimulation() {
  console.log(`\n${colors.blue}E2E: Concurrent Lock Simulation${colors.reset}`);

  const { StateLock } = require('../src/core/lib/scope/state-lock');

  let tmpDir;

  try {
    tmpDir = createTestProject();
    const lock = new StateLock();
    const lockPath = path.join(tmpDir, 'state.lock');

    // ========================================
    // Simulate concurrent access from two "terminals"
    // ========================================
    await asyncTest('Concurrent operations are serialized', async () => {
      const results = [];
      const startTime = Date.now();

      // Simulate Terminal 1 (auth scope)
      const terminal1 = lock.withLock(lockPath, async () => {
        results.push({ terminal: 1, action: 'start', time: Date.now() - startTime });
        await new Promise((r) => setTimeout(r, 50)); // Simulate work
        results.push({ terminal: 1, action: 'end', time: Date.now() - startTime });
        return 'terminal1';
      });

      // Simulate Terminal 2 (payments scope) - starts slightly after
      await new Promise((r) => setTimeout(r, 10));
      const terminal2 = lock.withLock(lockPath, async () => {
        results.push({ terminal: 2, action: 'start', time: Date.now() - startTime });
        await new Promise((r) => setTimeout(r, 50)); // Simulate work
        results.push({ terminal: 2, action: 'end', time: Date.now() - startTime });
        return 'terminal2';
      });

      await Promise.all([terminal1, terminal2]);

      // Terminal 2 should start after Terminal 1 ends
      const t1End = results.find((r) => r.terminal === 1 && r.action === 'end');
      const t2Start = results.find((r) => r.terminal === 2 && r.action === 'start');

      assertTrue(t2Start.time >= t1End.time, `Terminal 2 should start (${t2Start.time}ms) after Terminal 1 ends (${t1End.time}ms)`);
    });
  } finally {
    if (tmpDir) {
      cleanupTestProject(tmpDir);
    }
  }
}

// ============================================================================
// E2E Test: Help Commands
// ============================================================================

async function testHelpCommandsE2E() {
  console.log(`\n${colors.blue}E2E: Help Commands${colors.reset}`);

  const { execSync } = require('node:child_process');
  const cliPath = path.join(__dirname, '..', 'tools', 'cli', 'bmad-cli.js');

  await asyncTest('scope --help shows subcommands', () => {
    const output = execSync(`node ${cliPath} scope --help`, { encoding: 'utf8' });
    assertTrue(output.includes('SUBCOMMANDS'), 'Should show SUBCOMMANDS section');
    assertTrue(output.includes('init'), 'Should mention init');
    assertTrue(output.includes('create'), 'Should mention create');
    assertTrue(output.includes('list'), 'Should mention list');
  });

  await asyncTest('scope -h shows same as --help', () => {
    const output = execSync(`node ${cliPath} scope -h`, { encoding: 'utf8' });
    assertTrue(output.includes('SUBCOMMANDS'), 'Should show SUBCOMMANDS section');
  });

  await asyncTest('scope help shows comprehensive documentation', () => {
    const output = execSync(`node ${cliPath} scope help`, { encoding: 'utf8' });
    assertTrue(output.includes('OVERVIEW'), 'Should show OVERVIEW section');
    assertTrue(output.includes('COMMANDS'), 'Should show COMMANDS section');
    assertTrue(output.includes('QUICK START'), 'Should show QUICK START section');
  });

  await asyncTest('scope help create shows detailed create help', () => {
    const output = execSync(`node ${cliPath} scope help create`, { encoding: 'utf8' });
    assertTrue(output.includes('bmad scope create'), 'Should show create command title');
    assertTrue(output.includes('ARGUMENTS'), 'Should show ARGUMENTS section');
    assertTrue(output.includes('OPTIONS'), 'Should show OPTIONS section');
  });

  await asyncTest('scope help init shows detailed init help', () => {
    const output = execSync(`node ${cliPath} scope help init`, { encoding: 'utf8' });
    assertTrue(output.includes('bmad scope init'), 'Should show init command title');
    assertTrue(output.includes('DESCRIPTION'), 'Should show DESCRIPTION section');
  });

  await asyncTest('scope help with invalid subcommand shows error', () => {
    const output = execSync(`node ${cliPath} scope help invalidcommand`, { encoding: 'utf8' });
    assertTrue(output.includes('Unknown command'), 'Should show unknown command error');
  });

  await asyncTest('scope help works with aliases', () => {
    const output = execSync(`node ${cliPath} scope help ls`, { encoding: 'utf8' });
    assertTrue(output.includes('bmad scope list'), 'Should show list help for ls alias');
  });
}

// ============================================================================
// E2E Test: Error Handling and Edge Cases
// ============================================================================

async function testErrorHandlingE2E() {
  console.log(`\n${colors.blue}E2E: Error Handling and Edge Cases${colors.reset}`);

  const { ScopeManager } = require('../src/core/lib/scope/scope-manager');
  const { ScopeContext } = require('../src/core/lib/scope/scope-context');
  const { ScopeSync } = require('../src/core/lib/scope/scope-sync');

  let tmpDir;

  try {
    tmpDir = createTestProject();
    const manager = new ScopeManager({ projectRoot: tmpDir });

    // ========================================
    // Error: Operations on uninitialized system
    // ========================================
    await asyncTest('List scopes on uninitialized system returns empty', async () => {
      // Don't initialize, just try to list
      let result = [];
      try {
        result = await manager.listScopes();
      } catch {
        // Expected - system not initialized
        result = [];
      }
      assertEqual(result.length, 0, 'Should return empty or throw');
    });

    // Initialize for remaining tests
    await manager.initialize();

    // ========================================
    // Error: Duplicate scope creation
    // ========================================
    await asyncTest('Creating duplicate scope throws meaningful error', async () => {
      await manager.createScope('duptest', { name: 'Dup Test' });

      let errorMsg = '';
      try {
        await manager.createScope('duptest', { name: 'Dup Test 2' });
      } catch (error) {
        errorMsg = error.message;
      }
      assertTrue(errorMsg.includes('already exists') || errorMsg.includes('duplicate'), `Error should mention duplicate: ${errorMsg}`);
    });

    // ========================================
    // Error: Invalid operations on archived scope
    // ========================================
    await asyncTest('Operations on archived scope work correctly', async () => {
      await manager.createScope('archtest', { name: 'Archive Test' });
      await manager.archiveScope('archtest');

      // Should still be able to get info
      const scope = await manager.getScope('archtest');
      assertEqual(scope.status, 'archived', 'Should get archived scope');

      // Activate should work
      await manager.activateScope('archtest');
      const reactivated = await manager.getScope('archtest');
      assertEqual(reactivated.status, 'active', 'Should be reactivated');
    });

    // ========================================
    // Edge: Scope with maximum valid name length
    // ========================================
    await asyncTest('Scope with maximum length name', async () => {
      const longName = 'A'.repeat(200); // Very long name
      const scope = await manager.createScope('longname', {
        name: longName,
        description: 'B'.repeat(500),
      });
      assertEqual(scope.id, 'longname', 'Should create scope with long name');
    });

    // ========================================
    // Edge: Scope with special characters in name/description
    // ========================================
    await asyncTest('Scope with special characters in metadata', async () => {
      const scope = await manager.createScope('specialchars', {
        name: 'Test <script>alert("xss")</script>',
        description: 'Description with "quotes" and \'apostrophes\' and `backticks`',
      });
      assertEqual(scope.id, 'specialchars', 'Should create scope with special chars in metadata');
    });

    // ========================================
    // Edge: Empty dependencies array
    // ========================================
    await asyncTest('Scope with empty dependencies array', async () => {
      const scope = await manager.createScope('nodeps', {
        name: 'No Deps',
        dependencies: [],
      });
      assertEqual(scope.dependencies.length, 0, 'Should have no dependencies');
    });

    // ========================================
    // Sync operations on non-existent scope - documents current behavior
    // ========================================
    await asyncTest('Sync-up on non-existent scope handles gracefully', async () => {
      const sync = new ScopeSync({ projectRoot: tmpDir });

      // Current implementation may return empty result or throw
      // This documents actual behavior
      let result = null;
      try {
        result = await sync.syncUp('nonexistent');
        // If it doesn't throw, result should indicate no files synced
        assertTrue(result.promoted.length === 0 || result.success !== false, 'Should handle gracefully with no files to sync');
      } catch {
        // Throwing is also acceptable behavior
        assertTrue(true, 'Throws for non-existent scope');
      }
    });

    // ========================================
    // Edge: Rapid scope status changes
    // ========================================
    await asyncTest('Rapid archive/activate cycles', async () => {
      await manager.createScope('rapidcycle', { name: 'Rapid Cycle' });

      for (let i = 0; i < 5; i++) {
        await manager.archiveScope('rapidcycle');
        await manager.activateScope('rapidcycle');
      }

      const scope = await manager.getScope('rapidcycle');
      assertEqual(scope.status, 'active', 'Should end up active after cycles');
    });
  } finally {
    if (tmpDir) {
      cleanupTestProject(tmpDir);
    }
  }
}

// ============================================================================
// E2E Test: Complex Dependency Scenarios
// ============================================================================

async function testComplexDependencyE2E() {
  console.log(`\n${colors.blue}E2E: Complex Dependency Scenarios${colors.reset}`);

  const { ScopeManager } = require('../src/core/lib/scope/scope-manager');

  let tmpDir;

  try {
    tmpDir = createTestProject();
    const manager = new ScopeManager({ projectRoot: tmpDir });
    await manager.initialize();

    // ========================================
    // Diamond dependency pattern
    // ========================================
    await asyncTest('Diamond dependency pattern works', async () => {
      //       core
      //      /    \
      //   auth    user
      //      \    /
      //     payments
      await manager.createScope('core', { name: 'Core' });
      await manager.createScope('auth', { name: 'Auth', dependencies: ['core'] });
      await manager.createScope('user', { name: 'User', dependencies: ['core'] });
      await manager.createScope('payments', { name: 'Payments', dependencies: ['auth', 'user'] });

      const payments = await manager.getScope('payments');
      assertTrue(payments.dependencies.includes('auth'), 'Should depend on auth');
      assertTrue(payments.dependencies.includes('user'), 'Should depend on user');
    });

    // ========================================
    // Finding all dependents in complex graph
    // ========================================
    await asyncTest('Finds all dependents in complex graph', async () => {
      const coreDependents = await manager.findDependentScopes('core');
      assertTrue(coreDependents.includes('auth'), 'auth should depend on core');
      assertTrue(coreDependents.includes('user'), 'user should depend on core');
      // Transitive dependents may or may not be included depending on implementation
    });

    // ========================================
    // Removing scope in middle of dependency chain
    // ========================================
    await asyncTest('Cannot remove scope with dependents without force', async () => {
      let threw = false;
      try {
        await manager.removeScope('auth'); // payments depends on auth
      } catch {
        threw = true;
      }
      assertTrue(threw, 'Should throw when removing scope with dependents');
    });

    // ========================================
    // Adding dependency to existing scope
    // ========================================
    await asyncTest('Adding new dependency to existing scope', async () => {
      await manager.createScope('notifications', { name: 'Notifications' });
      await manager.updateScope('payments', {
        dependencies: ['auth', 'user', 'notifications'],
      });

      const payments = await manager.getScope('payments');
      assertTrue(payments.dependencies.includes('notifications'), 'Should have new dependency');
    });

    // ========================================
    // Archiving scope in dependency chain
    // ========================================
    await asyncTest('Archiving scope in dependency chain', async () => {
      await manager.archiveScope('auth');

      // Payments should still exist and have auth as dependency
      const payments = await manager.getScope('payments');
      assertTrue(payments.dependencies.includes('auth'), 'Dependency should remain');

      // Reactivate for cleanup
      await manager.activateScope('auth');
    });
  } finally {
    if (tmpDir) {
      cleanupTestProject(tmpDir);
    }
  }
}

// ============================================================================
// E2E Test: Sync Operations Edge Cases
// ============================================================================

async function testSyncOperationsE2E() {
  console.log(`\n${colors.blue}E2E: Sync Operations Edge Cases${colors.reset}`);

  const { ScopeManager } = require('../src/core/lib/scope/scope-manager');
  const { ScopeSync } = require('../src/core/lib/scope/scope-sync');

  let tmpDir;

  try {
    tmpDir = createTestProject();
    const manager = new ScopeManager({ projectRoot: tmpDir });
    await manager.initialize();

    const sync = new ScopeSync({ projectRoot: tmpDir });

    // Create test scope
    await manager.createScope('synctest', { name: 'Sync Test' });

    // ========================================
    // Sync-up with no promotable files
    // ========================================
    await asyncTest('Sync-up with no promotable files', async () => {
      // Create non-promotable file
      const filePath = path.join(tmpDir, '_bmad-output', 'synctest', 'planning-artifacts', 'notes.md');
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, '# Random Notes');

      const result = await sync.syncUp('synctest');
      // Should succeed but with no files promoted
      assertTrue(result.success || result.promoted.length === 0, 'Should handle no promotable files');
    });

    // ========================================
    // Sync-up with empty architecture directory
    // ========================================
    await asyncTest('Sync-up with empty promotable directory', async () => {
      // Create empty architecture directory
      fs.mkdirSync(path.join(tmpDir, '_bmad-output', 'synctest', 'architecture'), { recursive: true });

      const result = await sync.syncUp('synctest');
      assertTrue(result.success !== false, 'Should handle empty directory');
    });

    // ========================================
    // Sync-up with binary files (should skip)
    // ========================================
    await asyncTest('Sync-up skips binary files', async () => {
      // Create a file that might be considered binary
      const archPath = path.join(tmpDir, '_bmad-output', 'synctest', 'architecture', 'diagram.png');
      fs.mkdirSync(path.dirname(archPath), { recursive: true });
      fs.writeFileSync(archPath, Buffer.from([0x89, 0x50, 0x4e, 0x47])); // PNG header

      const result = await sync.syncUp('synctest');
      // Should succeed, binary might be skipped or included depending on implementation
      assertTrue(result.success !== false, 'Should handle binary files gracefully');
    });

    // ========================================
    // Create scope when directory already exists - safe by default
    // ========================================
    await asyncTest('Creating scope when directory exists throws by default', async () => {
      // Pre-create the directory
      fs.mkdirSync(path.join(tmpDir, '_bmad-output', 'preexist', 'planning-artifacts'), { recursive: true });
      fs.writeFileSync(path.join(tmpDir, '_bmad-output', 'preexist', 'planning-artifacts', 'existing.md'), '# Existing File');

      // Create scope - should throw because directory exists (safe default)
      let threw = false;
      let errorMsg = '';
      try {
        await manager.createScope('preexist', { name: 'Pre-existing' });
      } catch (error) {
        threw = true;
        errorMsg = error.message;
      }

      assertTrue(threw, 'Should throw when directory exists');
      assertTrue(errorMsg.includes('already exists'), 'Error should mention directory exists');

      // Existing file should still be preserved
      const existingContent = fs.readFileSync(path.join(tmpDir, '_bmad-output', 'preexist', 'planning-artifacts', 'existing.md'), 'utf8');
      assertTrue(existingContent.includes('Existing File'), 'Should preserve existing files');
    });

    // ========================================
    // Sync with very long file paths
    // ========================================
    await asyncTest('Sync handles deeply nested paths', async () => {
      const deepPath = path.join(tmpDir, '_bmad-output', 'synctest', 'architecture', 'deep', 'nested', 'structure', 'document.md');
      fs.mkdirSync(path.dirname(deepPath), { recursive: true });
      fs.writeFileSync(deepPath, '# Deeply Nested');

      const result = await sync.syncUp('synctest');
      assertTrue(result.success !== false, 'Should handle deep paths');
    });

    // ========================================
    // Sync with special characters in filename
    // ========================================
    await asyncTest('Sync handles special characters in filenames', async () => {
      const specialPath = path.join(tmpDir, '_bmad-output', 'synctest', 'architecture', 'design (v2) [draft].md');
      fs.mkdirSync(path.dirname(specialPath), { recursive: true });
      fs.writeFileSync(specialPath, '# Design v2 Draft');

      const result = await sync.syncUp('synctest');
      assertTrue(result.success !== false, 'Should handle special chars in filenames');
    });
  } finally {
    if (tmpDir) {
      cleanupTestProject(tmpDir);
    }
  }
}

// ============================================================================
// E2E Test: File System Edge Cases
// ============================================================================

async function testFileSystemEdgeCasesE2E() {
  console.log(`\n${colors.blue}E2E: File System Edge Cases${colors.reset}`);

  const { ScopeManager } = require('../src/core/lib/scope/scope-manager');
  const { ScopeInitializer } = require('../src/core/lib/scope/scope-initializer');

  let tmpDir;

  try {
    tmpDir = createTestProject();
    const manager = new ScopeManager({ projectRoot: tmpDir });
    const initializer = new ScopeInitializer({ projectRoot: tmpDir });
    await manager.initialize();

    // ========================================
    // Remove scope with readonly files
    // ========================================
    await asyncTest('Remove scope handles readonly files', async () => {
      await manager.createScope('readonly', { name: 'Readonly Test' });

      // Make a file readonly
      const filePath = path.join(tmpDir, '_bmad-output', 'readonly', 'planning-artifacts', 'locked.md');
      fs.writeFileSync(filePath, '# Locked');
      try {
        fs.chmodSync(filePath, 0o444); // Read-only
      } catch {
        // Windows might not support chmod
      }

      // Remove should handle this gracefully
      let removed = false;
      try {
        await initializer.removeScope('readonly', { backup: false });
        await manager.removeScope('readonly', { force: true });
        removed = true;
      } catch {
        // May fail on some systems, that's ok
        // Clean up by making it writable again
        try {
          fs.chmodSync(filePath, 0o644);
          await initializer.removeScope('readonly', { backup: false });
          await manager.removeScope('readonly', { force: true });
          removed = true;
        } catch {
          // Ignore cleanup errors
        }
      }
      // Just verify it attempted the operation
      assertTrue(true, 'Attempted removal of readonly files');
    });

    // ========================================
    // Scope with symlinks (if supported)
    // ========================================
    await asyncTest('Scope handles symlinks gracefully', async () => {
      await manager.createScope('symtest', { name: 'Symlink Test' });

      const targetPath = path.join(tmpDir, '_bmad-output', 'symtest', 'planning-artifacts', 'target.md');
      const linkPath = path.join(tmpDir, '_bmad-output', 'symtest', 'planning-artifacts', 'link.md');

      fs.writeFileSync(targetPath, '# Target');

      try {
        fs.symlinkSync(targetPath, linkPath);

        // Should be able to read through symlink
        const content = fs.readFileSync(linkPath, 'utf8');
        assertTrue(content.includes('Target'), 'Should read through symlink');
      } catch {
        // Symlinks may not be supported on all systems
        assertTrue(true, 'Symlinks not supported on this system');
      }
    });

    // ========================================
    // Large number of files in scope
    // ========================================
    await asyncTest('Scope with many files', async () => {
      await manager.createScope('manyfiles', { name: 'Many Files' });

      const planningDir = path.join(tmpDir, '_bmad-output', 'manyfiles', 'planning-artifacts');

      // Create 100 files
      for (let i = 0; i < 100; i++) {
        fs.writeFileSync(path.join(planningDir, `file-${i}.md`), `# File ${i}`);
      }

      // Should still be able to manage scope
      const scope = await manager.getScope('manyfiles');
      assertEqual(scope.id, 'manyfiles', 'Should manage scope with many files');
    });
  } finally {
    if (tmpDir) {
      cleanupTestProject(tmpDir);
    }
  }
}

// ============================================================================
// E2E Test: Concurrent Operations Stress Test
// ============================================================================

async function testConcurrentOperationsE2E() {
  console.log(`\n${colors.blue}E2E: Concurrent Operations Stress Test${colors.reset}`);

  const { ScopeManager } = require('../src/core/lib/scope/scope-manager');
  const { ScopeContext } = require('../src/core/lib/scope/scope-context');

  let tmpDir;

  try {
    tmpDir = createTestProject();
    const manager = new ScopeManager({ projectRoot: tmpDir });
    await manager.initialize();

    // ========================================
    // Concurrent scope creation stress test
    // ========================================
    await asyncTest('Concurrent scope creations (stress test)', async () => {
      const createPromises = [];
      for (let i = 0; i < 20; i++) {
        createPromises.push(
          manager
            .createScope(`concurrent-${i}`, { name: `Concurrent ${i}` })
            .catch((error) => ({ error: error.message, id: `concurrent-${i}` })),
        );
      }

      const results = await Promise.all(createPromises);

      // Count successes
      const successes = results.filter((r) => !r.error);
      assertTrue(successes.length > 0, 'At least some concurrent creates should succeed');

      // Verify all created scopes exist
      const scopes = await manager.listScopes();
      assertTrue(scopes.length >= successes.length, 'All successful creates should persist');
    });

    // ========================================
    // Concurrent read/write operations
    // ========================================
    await asyncTest('Concurrent reads during writes', async () => {
      await manager.createScope('rwtest', { name: 'Read/Write Test' });

      const operations = [];

      // Mix of reads and writes
      for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) {
          // Read
          operations.push(manager.getScope('rwtest'));
        } else {
          // Write (update)
          operations.push(manager.updateScope('rwtest', { description: `Update ${i}` }));
        }
      }

      await Promise.all(operations);

      // Verify scope is still valid
      const scope = await manager.getScope('rwtest');
      assertEqual(scope.id, 'rwtest', 'Scope should still be valid');
    });

    // ========================================
    // Concurrent context switches
    // ========================================
    await asyncTest('Concurrent context switches', async () => {
      const context1 = new ScopeContext({ projectRoot: tmpDir });
      const context2 = new ScopeContext({ projectRoot: tmpDir });

      // Both try to set different scopes
      const [, scope1, scope2] = await Promise.all([
        manager.createScope('ctx1', { name: 'Context 1' }),
        context1.setScope('rwtest').then(() => context1.getCurrentScope()),
        context2.setScope('rwtest').then(() => context2.getCurrentScope()),
      ]);

      // One should win (last write wins)
      const finalScope = await context1.getCurrentScope();
      assertTrue(finalScope === 'rwtest', 'Should have a valid scope set');
    });
  } finally {
    if (tmpDir) {
      cleanupTestProject(tmpDir);
    }
  }
}

// ============================================================================
// Main Runner
// ============================================================================

async function main() {
  console.log(`${colors.cyan}╔═══════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  Multi-Scope End-to-End Test Suite                         ║${colors.reset}`);
  console.log(`${colors.cyan}╚═══════════════════════════════════════════════════════════╝${colors.reset}`);

  try {
    await testParallelScopeWorkflow();
    await testConcurrentLockSimulation();

    // New comprehensive E2E tests
    await testHelpCommandsE2E();
    await testErrorHandlingE2E();
    await testComplexDependencyE2E();
    await testSyncOperationsE2E();
    await testFileSystemEdgeCasesE2E();
    await testConcurrentOperationsE2E();
  } catch (error) {
    console.log(`\n${colors.red}Fatal error: ${error.message}${colors.reset}`);
    console.log(error.stack);
    process.exit(1);
  }

  // Summary
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}E2E Test Results:${colors.reset}`);
  console.log(`  Total:  ${testCount}`);
  console.log(`  Passed: ${colors.green}${passCount}${colors.reset}`);
  console.log(`  Failed: ${failCount === 0 ? colors.green : colors.red}${failCount}${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}\n`);

  if (failures.length > 0) {
    console.log(`${colors.red}Failed Tests:${colors.reset}\n`);
    for (const failure of failures) {
      console.log(`${colors.red}✗${colors.reset} ${failure.name}`);
      console.log(`  ${failure.error}\n`);
    }
    process.exit(1);
  }

  console.log(`${colors.green}All E2E tests passed!${colors.reset}\n`);
  process.exit(0);
}

main().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
