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

  // Module with missing code field (invalid)
  await fs.ensureDir(path.join(parentDir, 'bad-module'));
  await fs.writeFile(path.join(parentDir, 'bad-module', 'module.yaml'), 'name: Bad Module\n');

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

    // Parent dir expands to individual module subdirs (any dir with module.yaml)
    const parentPaths = ui.resolveCustomContentPaths(parentDir);
    assert(Array.isArray(parentPaths), 'resolveCustomContentPaths returns an array for parent dir');
    assert(
      parentPaths.length === 3,
      'Parent dir resolves to 3 module paths (skips not-a-module which has no module.yaml)',
      `Expected 3, got ${parentPaths.length}: ${JSON.stringify(parentPaths)}`,
    );

    const resolvedNames = parentPaths.map((p) => path.basename(p)).sort();
    assert(
      resolvedNames.includes('module-a') && resolvedNames.includes('module-b'),
      'Parent dir includes module-a and module-b',
      `Got: ${JSON.stringify(resolvedNames)}`,
    );

    // bad-module has module.yaml but no code field — resolveCustomContentPaths includes it
    // (callers are responsible for filtering invalid modules)
    assert(resolvedNames.includes('bad-module'), 'Parent dir includes bad-module (has module.yaml, callers filter by code)');

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
  // Test Suite 3: Edge cases
  // ============================================================
  console.log(`\n${colors.yellow}Test Suite 3: Edge cases${colors.reset}\n`);

  let parentWithBadModule;
  let directModule2;

  try {
    // Parent dir where only subdir has module.yaml without code field
    parentWithBadModule = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-bad-'));
    await fs.ensureDir(path.join(parentWithBadModule, 'no-code-module'));
    await fs.writeFile(path.join(parentWithBadModule, 'no-code-module', 'module.yaml'), 'name: No Code Module\n');

    // resolveCustomContentPaths includes it (callers filter)
    const badPaths = ui.resolveCustomContentPaths(parentWithBadModule);
    assert(badPaths.length === 1, 'Dir with only code-less module.yaml still resolves (callers filter)');

    // validateCustomContentPathSync accepts it (has module.yaml in subdir)
    const badValidation = ui.validateCustomContentPathSync(parentWithBadModule);
    assert(
      badValidation === undefined,
      'Parent dir with code-less module.yaml passes validation (callers handle filtering)',
      `Got error: ${badValidation}`,
    );

    // Subdir with malformed YAML
    await fs.ensureDir(path.join(parentWithBadModule, 'malformed'));
    await fs.writeFile(path.join(parentWithBadModule, 'malformed', 'module.yaml'), '{{invalid yaml');
    const malformedPaths = ui.resolveCustomContentPaths(parentWithBadModule);
    assert(malformedPaths.length === 2, 'Subdirs with malformed YAML are still resolved (callers handle parse errors)');

    // Direct module alongside parent dir (simulates comma-separated usage)
    directModule2 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-direct2-'));
    await fs.writeFile(path.join(directModule2, 'module.yaml'), 'code: direct-2\nname: Direct Two\n');

    const directPaths2 = ui.resolveCustomContentPaths(directModule2);
    const parentPaths2 = ui.resolveCustomContentPaths(parentWithBadModule);
    const combined = [...directPaths2, ...parentPaths2];
    assert(
      combined.length === 3,
      'Mixed direct + parent paths combine correctly (1 direct + 2 from parent)',
      `Expected 3, got ${combined.length}`,
    );
  } finally {
    if (parentWithBadModule) await fs.remove(parentWithBadModule).catch(() => {});
    if (directModule2) await fs.remove(directModule2).catch(() => {});
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
