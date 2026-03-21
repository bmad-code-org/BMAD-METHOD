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
 * Usage: node test/test-installation-extensions.js
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
    throw new Error(`${testName}${errorMessage ? ': ' + errorMessage : ''}`);
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

/**
 * Create a minimal manifest so manager.install() can record module metadata.
 */
async function createMinimalManifest(bmadDir) {
  await fs.ensureDir(path.join(bmadDir, '_config'));
  await fs.writeFile(
    path.join(bmadDir, '_config', 'manifest.yaml'),
    'installation:\n  version: "0.0.0"\n  installDate: "2026-01-01T00:00:00.000Z"\n  lastUpdated: "2026-01-01T00:00:00.000Z"\nmodules: []\nides: []\n',
  );
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

      await createMinimalManifest(bmadDir);
      const manager = new ModuleManager();

      // Step 1: Install base module via manager.install()
      manager.setCustomModulePaths(new Map([['bmm', baseSrc]]));
      await manager.install('bmm', bmadDir, null, { silent: true, skipModuleInstaller: true });

      // Step 2: Install extension WITHOUT isExtension flag (old/broken behavior: wipes directory)
      manager.setCustomModulePaths(new Map([['bmm', extSrc]]));
      await manager.install('bmm', bmadDir, null, { silent: true, skipModuleInstaller: true });

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

      await createMinimalManifest(bmadDir);
      const manager = new ModuleManager();

      // Step 1: Install base module via manager.install()
      manager.setCustomModulePaths(new Map([['bmm', baseSrc]]));
      await manager.install('bmm', bmadDir, null, { silent: true, skipModuleInstaller: true });

      // Step 2: Install extension with isExtension:true → should MERGE on top of base
      manager.setCustomModulePaths(new Map([['bmm', extSrc]]));
      await manager.install('bmm', bmadDir, null, { isExtension: true, silent: true, skipModuleInstaller: true });

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
      const baseSrc = await createBaseModuleSource(tmpDir);
      const bmadDir = path.join(tmpDir, '_bmad');
      const targetPath = path.join(bmadDir, 'bmm');

      await createMinimalManifest(bmadDir);
      const manager = new ModuleManager();
      manager.setCustomModulePaths(new Map([['bmm', baseSrc]]));

      // Install base so target directory exists
      await manager.install('bmm', bmadDir, null, { silent: true, skipModuleInstaller: true });

      // Add a sentinel file that simulates a file the user placed in the installed module
      await fs.writeFile(path.join(targetPath, 'sentinel.txt'), 'user data');
      assert(await fs.pathExists(path.join(targetPath, 'sentinel.txt')), 'Pre-condition: sentinel.txt exists before extension install');

      // With isExtension:true → fs.remove is skipped; sentinel must survive
      await manager.install('bmm', bmadDir, null, { isExtension: true, silent: true, skipModuleInstaller: true });
      assert(
        await fs.pathExists(path.join(targetPath, 'sentinel.txt')),
        'With isExtension:true: sentinel.txt PRESERVED (fs.remove was skipped)',
      );

      // Without isExtension → fs.remove runs; sentinel must be gone
      await manager.install('bmm', bmadDir, null, { silent: true, skipModuleInstaller: true });
      assert(
        !(await fs.pathExists(path.join(targetPath, 'sentinel.txt'))),
        'Without isExtension: sentinel.txt REMOVED (directory was cleared by fs.remove)',
      );
    } finally {
      await fs.remove(tmpDir);
    }
  }

  console.log('');

  // ─────────────────────────────────────────────────────────────────────────
  // Test 4 (E2E): installModuleWithDependencies → base install, then
  //               moduleManager.install with isExtension:true → merge
  // ─────────────────────────────────────────────────────────────────────────
  console.log(
    `${colors.yellow}Scenario D: E2E install — base via installModuleWithDependencies, extension via moduleManager.install${colors.reset}\n`,
  );

  {
    const { Installer } = require('../tools/cli/installers/lib/core/installer');
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-e2e-test-'));
    try {
      const baseSrc = await createBaseModuleSource(tmpDir);
      const extSrc = await createExtensionModuleSource(tmpDir);
      const bmadDir = path.join(tmpDir, '_bmad');

      // Pre-create a minimal manifest so moduleManager.install can record the module
      await createMinimalManifest(bmadDir);

      const installer = new Installer();

      // Stub the resolver: point 'bmm' at the fake base source
      installer.moduleManager.setCustomModulePaths(new Map([['bmm', baseSrc]]));

      // Step 1: Install base module via the public installModuleWithDependencies
      await installer.installModuleWithDependencies('bmm', bmadDir, {});

      const targetPath = path.join(bmadDir, 'bmm');
      assert(
        await fs.pathExists(path.join(targetPath, 'agents', 'analyst.md')),
        'E2E: after base install via installModuleWithDependencies — analyst.md is present',
      );
      assert(
        await fs.pathExists(path.join(targetPath, 'agents', 'pm.md')),
        'E2E: after base install via installModuleWithDependencies — pm.md is present',
      );

      // Step 2: Re-stub the resolver to point to the extension source, then install
      // the extension with isExtension:true so it merges on top of the base
      installer.moduleManager.setCustomModulePaths(new Map([['bmm', extSrc]]));
      await installer.moduleManager.install('bmm', bmadDir, null, {
        isExtension: true,
        skipModuleInstaller: true,
        silent: true,
      });

      // Assert merged output: base files preserved, extension files added/overridden
      assert(
        await fs.pathExists(path.join(targetPath, 'agents', 'analyst.md')),
        'E2E: base analyst.md is PRESERVED after extension install (merge, not replace)',
      );
      assert(
        await fs.pathExists(path.join(targetPath, 'agents', 'my-agent.md')),
        'E2E: extension my-agent.md is ADDED alongside base agents',
      );
      const pmContent = await fs.readFile(path.join(targetPath, 'agents', 'pm.md'), 'utf8');
      assert(pmContent.includes('pm-override'), 'E2E: extension pm.md OVERRIDES base pm.md (same-name wins)');

      // Verify manifest has exactly one 'bmm' entry (no duplicates)
      const yaml = require('yaml');
      const manifestRaw = await fs.readFile(path.join(bmadDir, '_config', 'manifest.yaml'), 'utf8');
      const manifest = yaml.parse(manifestRaw);
      const bmmEntries = (manifest.modules || []).filter((m) => m.name === 'bmm');
      assert(bmmEntries.length === 1, 'E2E: manifest contains exactly one bmm entry (no duplicates)');
    } finally {
      await fs.remove(tmpDir);
    }
  }

  console.log('');

  // ─────────────────────────────────────────────────────────────────────────
  // Test 5 (E2E update): user-modified files are preserved when extension
  //                      overlay is applied with isExtension:true
  // ─────────────────────────────────────────────────────────────────────────
  console.log(`${colors.yellow}Scenario E: user-modified sentinel file is preserved during extension overlay${colors.reset}\n`);

  {
    const { Installer } = require('../tools/cli/installers/lib/core/installer');
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-e2e-update-'));
    try {
      const baseSrc = await createBaseModuleSource(tmpDir);
      const extSrc = await createExtensionModuleSource(tmpDir);
      const bmadDir = path.join(tmpDir, '_bmad');

      await createMinimalManifest(bmadDir);
      const installer = new Installer();
      installer.moduleManager.setCustomModulePaths(new Map([['bmm', baseSrc]]));

      // Step 1: Install base module
      await installer.installModuleWithDependencies('bmm', bmadDir, {});

      const targetPath = path.join(bmadDir, 'bmm');

      // Step 2: Simulate a user adding a file to the installed module
      await fs.writeFile(path.join(targetPath, 'user-modified.txt'), 'my custom content');
      // Also record the original pm.md content so we can confirm the extension overrides it
      assert(
        await fs.pathExists(path.join(targetPath, 'agents', 'analyst.md')),
        'Update pre-condition: base analyst.md is present before extension overlay',
      );

      // Step 3: Apply extension overlay (isExtension:true → skip fs.remove)
      installer.moduleManager.setCustomModulePaths(new Map([['bmm', extSrc]]));
      await installer.moduleManager.install('bmm', bmadDir, null, {
        isExtension: true,
        skipModuleInstaller: true,
        silent: true,
      });

      // User-added file must survive because isExtension skips directory removal
      assert(
        await fs.pathExists(path.join(targetPath, 'user-modified.txt')),
        'Update: user-modified.txt is PRESERVED (extension overlay did not wipe the directory)',
      );
      // Base file must also survive
      assert(
        await fs.pathExists(path.join(targetPath, 'agents', 'analyst.md')),
        'Update: base analyst.md is PRESERVED after extension overlay',
      );
      // Extension-specific file must be present
      assert(await fs.pathExists(path.join(targetPath, 'agents', 'my-agent.md')), 'Update: extension my-agent.md is ADDED by the overlay');
      // Extension pm.md overrides the base version
      const pmUpdated = await fs.readFile(path.join(targetPath, 'agents', 'pm.md'), 'utf8');
      assert(pmUpdated.includes('pm-override'), 'Update: extension pm.md OVERRIDES base pm.md during overlay');
    } finally {
      await fs.remove(tmpDir);
    }
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
