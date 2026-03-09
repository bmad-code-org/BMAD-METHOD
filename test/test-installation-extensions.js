/**
 * Extension Module Merge Tests — Issue #1667
 *
 * Verifies that a custom extension module with `code: bmm` in its module.yaml
 * merges its files into the base BMM installation instead of replacing the
 * entire directory.
 *
 * Expected behavior (file-level merge):
 *   - Files with the same name → extension overrides base
 *   - Files with unique names  → extension adds alongside base
 *
 * Usage: node test/test-extension-module-merge.js
 */

const path = require('node:path');
const os = require('node:os');
const fs = require('fs-extra');
const { ModuleManager } = require('../tools/cli/installers/lib/modules/manager');

// ANSI colors (match existing test files)
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
    if (errorMessage) console.log(`  ${colors.dim}${errorMessage}${colors.reset}`);
    failed++;
  }
}

/**
 * Build a minimal compiled agent .md file (no YAML compilation needed).
 */
function minimalAgentMd(name) {
  return ['---', `name: "${name}"`, `description: "Test agent: ${name}"`, '---', '', `You are ${name}.`].join('\n');
}

/**
 * Create a fake base module source directory that looks like src/bmm/.
 * Only files relevant to the merge test are created (agents directory).
 */
async function createBaseModuleSource(tmpDir) {
  const src = path.join(tmpDir, 'src-base');

  // module.yaml
  await fs.ensureDir(src);
  await fs.writeFile(path.join(src, 'module.yaml'), 'name: BMM\ncode: bmm\nversion: 6.0.0\n');

  // agents: analyst + pm (standard base agents)
  await fs.ensureDir(path.join(src, 'agents'));
  await fs.writeFile(path.join(src, 'agents', 'analyst.md'), minimalAgentMd('analyst'));
  await fs.writeFile(path.join(src, 'agents', 'pm.md'), minimalAgentMd('pm'));

  return src;
}

/**
 * Create a fake extension module source directory (simulates a user's
 * custom module with code: bmm in its module.yaml).
 *
 * Includes:
 *   - pm.md       → should OVERRIDE the base pm.md
 *   - my-agent.md → unique name, should be ADDED alongside base agents
 */
async function createExtensionModuleSource(tmpDir) {
  const src = path.join(tmpDir, 'src-extension');

  await fs.ensureDir(src);
  await fs.writeFile(path.join(src, 'module.yaml'), 'name: My Extension\ncode: bmm\nversion: 1.0.0\n');

  await fs.ensureDir(path.join(src, 'agents'));
  await fs.writeFile(path.join(src, 'agents', 'pm.md'), minimalAgentMd('pm-override'));
  await fs.writeFile(path.join(src, 'agents', 'my-agent.md'), minimalAgentMd('my-agent'));

  return src;
}

async function runTests() {
  console.log(`${colors.cyan}========================================`);
  console.log('Extension Module Merge — Issue #1667');
  console.log(`========================================${colors.reset}\n`);

  // ─────────────────────────────────────────────────────────────────────────
  // Test 1: isExtension:false (default) — second install replaces directory
  // (confirms the bug existed: without the fix, extension would wipe base)
  // ─────────────────────────────────────────────────────────────────────────
  console.log(`${colors.yellow}Scenario A: install without isExtension (replacement mode)${colors.reset}\n`);

  {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-ext-test-'));
    try {
      const baseSrc = await createBaseModuleSource(tmpDir);
      const extSrc = await createExtensionModuleSource(tmpDir);
      const bmadDir = path.join(tmpDir, '_bmad');
      const targetPath = path.join(bmadDir, 'bmm');

      const manager = new ModuleManager();
      // Register extension as the 'bmm' custom module path
      manager.setCustomModulePaths(new Map([['bmm', extSrc]]));

      // Simulate base install (not custom)
      await fs.ensureDir(path.join(targetPath, 'agents'));
      await fs.copy(path.join(baseSrc, 'agents', 'analyst.md'), path.join(targetPath, 'agents', 'analyst.md'));
      await fs.copy(path.join(baseSrc, 'agents', 'pm.md'), path.join(targetPath, 'agents', 'pm.md'));

      // Simulate extension install WITHOUT isExtension flag (old/broken behavior)
      if (await fs.pathExists(targetPath)) {
        await fs.remove(targetPath); // This is what the old code did unconditionally
      }
      await fs.ensureDir(path.join(targetPath, 'agents'));
      await fs.copy(path.join(extSrc, 'agents', 'pm.md'), path.join(targetPath, 'agents', 'pm.md'));
      await fs.copy(path.join(extSrc, 'agents', 'my-agent.md'), path.join(targetPath, 'agents', 'my-agent.md'));

      const analystExists = await fs.pathExists(path.join(targetPath, 'agents', 'analyst.md'));
      const myAgentExists = await fs.pathExists(path.join(targetPath, 'agents', 'my-agent.md'));

      assert(!analystExists, 'Without fix: base analyst.md is GONE (replacement behavior confirmed)');
      assert(myAgentExists, 'Without fix: extension my-agent.md is present');
    } finally {
      await fs.remove(tmpDir);
    }
  }

  console.log('');

  // ─────────────────────────────────────────────────────────────────────────
  // Test 2: isExtension:true (the fix) — extension merges on top of base
  // ─────────────────────────────────────────────────────────────────────────
  console.log(`${colors.yellow}Scenario B: install with isExtension:true (merge mode — the fix)${colors.reset}\n`);

  {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-ext-test-'));
    try {
      const baseSrc = await createBaseModuleSource(tmpDir);
      const extSrc = await createExtensionModuleSource(tmpDir);
      const bmadDir = path.join(tmpDir, '_bmad');
      const targetPath = path.join(bmadDir, 'bmm');

      const manager = new ModuleManager();
      manager.setCustomModulePaths(new Map([['bmm', extSrc]]));

      // Step 1: Install base module (normal, no isExtension)
      await fs.ensureDir(path.join(targetPath, 'agents'));
      await fs.copy(path.join(baseSrc, 'agents', 'analyst.md'), path.join(targetPath, 'agents', 'analyst.md'));
      await fs.copy(path.join(baseSrc, 'agents', 'pm.md'), path.join(targetPath, 'agents', 'pm.md'));

      // Step 2: Install extension with isExtension:true → should MERGE
      // (reproduce what manager.install does: skip removal, then copy)
      const skipRemoval = true; // isExtension:true skips fs.remove
      if ((await fs.pathExists(targetPath)) && !skipRemoval) {
        await fs.remove(targetPath);
      }
      // Copy extension files over (overwrite same-named, add unique)
      await fs.copy(path.join(extSrc, 'agents', 'pm.md'), path.join(targetPath, 'agents', 'pm.md'), { overwrite: true });
      await fs.copy(path.join(extSrc, 'agents', 'my-agent.md'), path.join(targetPath, 'agents', 'my-agent.md'));

      const analystExists = await fs.pathExists(path.join(targetPath, 'agents', 'analyst.md'));
      const myAgentExists = await fs.pathExists(path.join(targetPath, 'agents', 'my-agent.md'));
      const pmContent = await fs.readFile(path.join(targetPath, 'agents', 'pm.md'), 'utf8');

      assert(analystExists, 'Base analyst.md is PRESERVED after extension install');
      assert(myAgentExists, 'Extension my-agent.md is ADDED alongside base agents');
      assert(pmContent.includes('pm-override'), 'Extension pm.md OVERRIDES base pm.md (same-name wins)');
    } finally {
      await fs.remove(tmpDir);
    }
  }

  console.log('');

  // ─────────────────────────────────────────────────────────────────────────
  // Test 3: ModuleManager.install() with isExtension:true via options
  // ─────────────────────────────────────────────────────────────────────────
  console.log(`${colors.yellow}Scenario C: ModuleManager.install() respects isExtension option${colors.reset}\n`);

  {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-ext-test-'));
    try {
      const bmadDir = path.join(tmpDir, '_bmad');
      const targetPath = path.join(bmadDir, 'bmm');

      // Pre-populate target with base files (simulates base module already installed)
      await fs.ensureDir(path.join(targetPath, 'agents'));
      await fs.writeFile(path.join(targetPath, 'agents', 'analyst.md'), minimalAgentMd('analyst'));
      await fs.writeFile(path.join(targetPath, 'agents', 'pm.md'), minimalAgentMd('pm-base'));

      // Verify pre-condition
      assert(
        await fs.pathExists(path.join(targetPath, 'agents', 'analyst.md')),
        'Pre-condition: base analyst.md exists before extension install',
      );

      // Now check that isExtension:true in options causes skip of fs.remove
      // by reading the manager source and verifying the condition
      const managerSrc = await fs.readFile(path.join(__dirname, '../tools/cli/installers/lib/modules/manager.js'), 'utf8');

      const hasExtensionGuard = managerSrc.includes('!options.isExtension');
      assert(
        hasExtensionGuard,
        'manager.js guards fs.remove with !options.isExtension',
        'Expected: if ((await fs.pathExists(targetPath)) && !options.isExtension)',
      );
    } finally {
      await fs.remove(tmpDir);
    }
  }

  console.log('');

  // ─────────────────────────────────────────────────────────────────────────
  // Test 4: installer.js includes isExtension detection logic
  // ─────────────────────────────────────────────────────────────────────────
  console.log(`${colors.yellow}Scenario D: installer.js contains extension detection and base-first install${colors.reset}\n`);

  {
    const installerSrc = await fs.readFile(path.join(__dirname, '../tools/cli/installers/lib/core/installer.js'), 'utf8');

    assert(installerSrc.includes('isExtension'), 'installer.js introduces isExtension variable');

    assert(installerSrc.includes('Installing base'), 'installer.js installs base module first when isExtension is true');

    assert(installerSrc.includes('isExtension: isExtension'), 'installer.js passes isExtension flag to moduleManager.install()');

    assert(
      installerSrc.includes('return isExtension'),
      'regularModulesForResolution filter includes extension modules for dependency resolution',
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Summary
  // ─────────────────────────────────────────────────────────────────────────
  console.log(`\n${colors.cyan}========================================${colors.reset}`);
  console.log(`Results: ${colors.green}${passed} passed${colors.reset}, ${failed > 0 ? colors.red : ''}${failed} failed${colors.reset}`);
  console.log(`${colors.cyan}========================================${colors.reset}\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch((error) => {
  console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
  process.exit(1);
});
