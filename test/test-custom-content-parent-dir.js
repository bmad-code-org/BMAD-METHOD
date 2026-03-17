/**
 * Custom Content Parent Directory Tests
 *
 * Tests that --custom-content works with parent directories containing
 * multiple module subdirectories (1-level recursive scan).
 *
 * Related: https://github.com/bmad-code-org/BMAD-METHOD/issues/2040
 *
 * Usage: node test/test-custom-content-parent-dir.js
 */

const path = require('node:path');
const os = require('node:os');
const fs = require('fs-extra');
const { UI } = require('../tools/cli/lib/ui');

// ANSI colors
const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  yellow: '\u001B[33m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

let passed = 0;
let failed = 0;

function assert(condition, testName, errorMessage = '') {
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${testName}`);
    passed++;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${testName}`);
    if (errorMessage) {
      console.log(`  ${colors.dim}${errorMessage}${colors.reset}`);
    }
    failed++;
  }
}

/**
 * Create a temp directory simulating a parent dir with multiple custom modules
 *
 * Structure:
 *   parentDir/
 *     module-a/
 *       module.yaml   (code: "module-a")
 *     module-b/
 *       module.yaml   (code: "module-b")
 *     not-a-module/
 *       readme.md
 */
async function createParentDirFixture() {
  const parentDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-parent-'));

  // Module A
  await fs.ensureDir(path.join(parentDir, 'module-a'));
  await fs.writeFile(path.join(parentDir, 'module-a', 'module.yaml'), 'code: module-a\nname: Module A\n');

  // Module B
  await fs.ensureDir(path.join(parentDir, 'module-b'));
  await fs.writeFile(path.join(parentDir, 'module-b', 'module.yaml'), 'code: module-b\nname: Module B\n');

  // Not a module (no module.yaml)
  await fs.ensureDir(path.join(parentDir, 'not-a-module'));
  await fs.writeFile(path.join(parentDir, 'not-a-module', 'readme.md'), '# Not a module\n');

  return parentDir;
}

/**
 * Create a temp directory simulating a direct module path
 */
async function createDirectModuleFixture() {
  const moduleDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-module-'));
  await fs.writeFile(path.join(moduleDir, 'module.yaml'), 'code: direct-module\nname: Direct Module\n');
  return moduleDir;
}

/**
 * Create a temp directory with no modules at any level
 */
async function createEmptyDirFixture() {
  const emptyDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-empty-'));
  await fs.writeFile(path.join(emptyDir, 'readme.md'), '# Empty\n');
  return emptyDir;
}

async function runTests() {
  const ui = new UI();

  // ============================================================
  // Test Suite 1: validateCustomContentPathSync with parent dirs
  // ============================================================
  console.log(`\n${colors.yellow}Test Suite 1: validateCustomContentPathSync${colors.reset}\n`);

  let parentDir;
  let directModuleDir;
  let emptyDir;

  try {
    parentDir = await createParentDirFixture();
    directModuleDir = await createDirectModuleFixture();
    emptyDir = await createEmptyDirFixture();

    // Direct module path should pass (existing behavior)
    const directResult = ui.validateCustomContentPathSync(directModuleDir);
    assert(directResult === undefined, 'Direct module path validates successfully');

    // Parent dir with module subdirs should pass (new behavior)
    const parentResult = ui.validateCustomContentPathSync(parentDir);
    assert(parentResult === undefined, 'Parent directory with module subdirectories validates successfully', `Got error: ${parentResult}`);

    // Empty dir (no modules at any level) should fail
    const emptyResult = ui.validateCustomContentPathSync(emptyDir);
    assert(
      typeof emptyResult === 'string' && emptyResult.length > 0,
      'Directory with no modules at any level fails validation',
      `Expected error string, got: ${emptyResult}`,
    );

    // Non-existent path should fail
    const nonExistResult = ui.validateCustomContentPathSync('/tmp/does-not-exist-bmad-xyz');
    assert(typeof nonExistResult === 'string', 'Non-existent path fails validation');

    // Empty input should pass (allows cancel)
    const emptyInputResult = ui.validateCustomContentPathSync('');
    assert(emptyInputResult === undefined, 'Empty input passes (allows cancel)');
  } finally {
    if (parentDir) await fs.remove(parentDir).catch(() => {});
    if (directModuleDir) await fs.remove(directModuleDir).catch(() => {});
    if (emptyDir) await fs.remove(emptyDir).catch(() => {});
  }

  // ============================================================
  // Test Suite 2: resolveCustomContentPaths
  // ============================================================
  console.log(`\n${colors.yellow}Test Suite 2: resolveCustomContentPaths${colors.reset}\n`);

  try {
    parentDir = await createParentDirFixture();
    directModuleDir = await createDirectModuleFixture();
    emptyDir = await createEmptyDirFixture();

    // Direct module path returns itself
    const directPaths = ui.resolveCustomContentPaths(directModuleDir);
    assert(Array.isArray(directPaths), 'resolveCustomContentPaths returns an array for direct module');
    assert(directPaths.length === 1, 'Direct module path resolves to exactly 1 path');
    assert(
      directPaths[0] === directModuleDir,
      'Direct module path resolves to itself',
      `Expected ${directModuleDir}, got ${directPaths[0]}`,
    );

    // Parent dir expands to individual module subdirs
    const parentPaths = ui.resolveCustomContentPaths(parentDir);
    assert(Array.isArray(parentPaths), 'resolveCustomContentPaths returns an array for parent dir');
    assert(
      parentPaths.length === 2,
      'Parent dir resolves to 2 module paths (skips not-a-module)',
      `Expected 2, got ${parentPaths.length}: ${JSON.stringify(parentPaths)}`,
    );

    const resolvedNames = parentPaths.map((p) => path.basename(p)).sort();
    assert(
      resolvedNames[0] === 'module-a' && resolvedNames[1] === 'module-b',
      'Parent dir resolves to module-a and module-b',
      `Got: ${JSON.stringify(resolvedNames)}`,
    );

    // Empty dir returns empty array
    const emptyPaths = ui.resolveCustomContentPaths(emptyDir);
    assert(Array.isArray(emptyPaths), 'resolveCustomContentPaths returns an array for empty dir');
    assert(emptyPaths.length === 0, 'Empty dir resolves to 0 paths', `Expected 0, got ${emptyPaths.length}`);

    // Non-existent path returns empty array
    const nonExistPaths = ui.resolveCustomContentPaths('/tmp/does-not-exist-bmad-xyz');
    assert(Array.isArray(nonExistPaths), 'resolveCustomContentPaths returns array for non-existent path');
    assert(nonExistPaths.length === 0, 'Non-existent path resolves to 0 paths');
  } finally {
    if (parentDir) await fs.remove(parentDir).catch(() => {});
    if (directModuleDir) await fs.remove(directModuleDir).catch(() => {});
    if (emptyDir) await fs.remove(emptyDir).catch(() => {});
  }

  // ============================================================
  // Summary
  // ============================================================
  console.log(`\n${colors.cyan}========================================`);
  console.log('Test Results:');
  console.log(`  Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`  Failed: ${colors.red}${failed}${colors.reset}`);
  console.log(`========================================${colors.reset}\n`);

  if (failed === 0) {
    console.log(`${colors.green}✨ All custom content parent dir tests passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}❌ Some custom content parent dir tests failed${colors.reset}\n`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error(`${colors.red}Test runner failed:${colors.reset}`, error.message);
  console.error(error.stack);
  process.exit(1);
});
