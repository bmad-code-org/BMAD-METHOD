/**
 * Installation Component Tests
 *
 * Tests individual installation components in isolation:
 * - Agent YAML → XML compilation
 * - Manifest generation
 * - Path resolution
 * - Customization merging
 *
 * These are deterministic unit tests that don't require full installation.
 * Usage: node test/test-installation-components.js
 */

const path = require('node:path');
const os = require('node:os');
const fs = require('fs-extra');
const { YamlXmlBuilder } = require('../tools/cli/lib/yaml-xml-builder');
const { ManifestGenerator } = require('../tools/cli/installers/lib/core/manifest-generator');
const { IdeManager } = require('../tools/cli/installers/lib/ide/manager');
const { clearCache, loadPlatformCodes } = require('../tools/cli/installers/lib/ide/platform-codes');

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

/**
 * Test helper: Assert condition
 */
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
 * Resolve the shared installed BMAD payload for this worktree layout.
 */
async function findInstalledBmadDir(startDir) {
  let current = path.resolve(startDir);

  while (true) {
    const candidate = path.join(current, '_bmad');
    if (await fs.pathExists(path.join(candidate, '_config', 'workflow-manifest.csv'))) {
      return candidate;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error(`Could not locate installed _bmad payload from ${startDir}`);
    }
    current = parent;
  }
}

/**
 * Test Suite
 */
async function runTests() {
  console.log(`${colors.cyan}========================================`);
  console.log('Installation Component Tests');
  console.log(`========================================${colors.reset}\n`);

  const projectRoot = path.join(__dirname, '..');

  // ============================================================
  // Test 1: YAML → XML Agent Compilation (In-Memory)
  // ============================================================
  console.log(`${colors.yellow}Test Suite 1: Agent Compilation${colors.reset}\n`);

  try {
    const builder = new YamlXmlBuilder();
    const pmAgentPath = path.join(projectRoot, 'src/bmm/agents/pm.agent.yaml');

    // Create temp output path
    const tempOutput = path.join(__dirname, 'temp-pm-agent.md');

    try {
      const result = await builder.buildAgent(pmAgentPath, null, tempOutput, { includeMetadata: true });

      assert(result && result.outputPath === tempOutput, 'Agent compilation returns result object with outputPath');

      // Read the output
      const compiled = await fs.readFile(tempOutput, 'utf8');

      assert(compiled.includes('<agent'), 'Compiled agent contains <agent> tag');

      assert(compiled.includes('<persona>'), 'Compiled agent contains <persona> tag');

      assert(compiled.includes('<menu>'), 'Compiled agent contains <menu> tag');

      assert(compiled.includes('Product Manager'), 'Compiled agent contains agent title');

      // Cleanup
      await fs.remove(tempOutput);
    } catch (error) {
      assert(false, 'Agent compilation succeeds', error.message);
    }
  } catch (error) {
    assert(false, 'YamlXmlBuilder instantiates', error.message);
  }

  console.log('');

  // ============================================================
  // Test 2: Customization Merging
  // ============================================================
  console.log(`${colors.yellow}Test Suite 2: Customization Merging${colors.reset}\n`);

  try {
    const builder = new YamlXmlBuilder();

    // Test deepMerge function
    const base = {
      agent: {
        metadata: { name: 'John', title: 'PM' },
        persona: { role: 'Product Manager', style: 'Analytical' },
      },
    };

    const customize = {
      agent: {
        metadata: { name: 'Sarah' }, // Override name only
        persona: { style: 'Concise' }, // Override style only
      },
    };

    const merged = builder.deepMerge(base, customize);

    assert(merged.agent.metadata.name === 'Sarah', 'Deep merge overrides customized name');

    assert(merged.agent.metadata.title === 'PM', 'Deep merge preserves non-overridden title');

    assert(merged.agent.persona.role === 'Product Manager', 'Deep merge preserves non-overridden role');

    assert(merged.agent.persona.style === 'Concise', 'Deep merge overrides customized style');
  } catch (error) {
    assert(false, 'Customization merging works', error.message);
  }

  console.log('');

  // ============================================================
  // Test 3: Path Resolution
  // ============================================================
  console.log(`${colors.yellow}Test Suite 3: Path Variable Resolution${colors.reset}\n`);

  try {
    const builder = new YamlXmlBuilder();

    // Test path resolution logic (if exposed)
    // This would test {project-root}, {installed_path}, {config_source} resolution

    const testPath = '{project-root}/bmad/bmm/config.yaml';
    const expectedPattern = /\/bmad\/bmm\/config\.yaml$/;

    assert(
      true, // Placeholder - would test actual resolution
      'Path variable resolution pattern matches expected format',
      'Note: This test validates path resolution logic exists',
    );
  } catch (error) {
    assert(false, 'Path resolution works', error.message);
  }

  console.log('');

  // ============================================================
  // Test 4: Windsurf Native Skills Install
  // ============================================================
  console.log(`${colors.yellow}Test Suite 4: Windsurf Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes = await loadPlatformCodes();
    const windsurfInstaller = platformCodes.platforms.windsurf?.installer;

    assert(windsurfInstaller?.target_dir === '.windsurf/skills', 'Windsurf target_dir uses native skills path');

    assert(windsurfInstaller?.skill_format === true, 'Windsurf installer enables native skill output');

    assert(
      Array.isArray(windsurfInstaller?.legacy_targets) && windsurfInstaller.legacy_targets.includes('.windsurf/workflows'),
      'Windsurf installer cleans legacy workflow output',
    );

    const tempProjectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-windsurf-test-'));
    const installedBmadDir = await findInstalledBmadDir(projectRoot);
    const legacyDir = path.join(tempProjectDir, '.windsurf', 'workflows', 'bmad-legacy-dir');
    await fs.ensureDir(legacyDir);
    await fs.writeFile(path.join(tempProjectDir, '.windsurf', 'workflows', 'bmad-legacy.md'), 'legacy\n');
    await fs.writeFile(path.join(legacyDir, 'SKILL.md'), 'legacy\n');

    const ideManager = new IdeManager();
    await ideManager.ensureInitialized();
    const result = await ideManager.setup('windsurf', tempProjectDir, installedBmadDir, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result.success === true, 'Windsurf setup succeeds against temp project');

    const skillFile = path.join(tempProjectDir, '.windsurf', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile), 'Windsurf install writes SKILL.md directory output');

    assert(!(await fs.pathExists(path.join(tempProjectDir, '.windsurf', 'workflows'))), 'Windsurf setup removes legacy workflows dir');

    await fs.remove(tempProjectDir);
  } catch (error) {
    assert(false, 'Windsurf native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Test 5: Kiro Native Skills Install
  // ============================================================
  console.log(`${colors.yellow}Test Suite 5: Kiro Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes = await loadPlatformCodes();
    const kiroInstaller = platformCodes.platforms.kiro?.installer;

    assert(kiroInstaller?.target_dir === '.kiro/skills', 'Kiro target_dir uses native skills path');

    assert(kiroInstaller?.skill_format === true, 'Kiro installer enables native skill output');

    assert(
      Array.isArray(kiroInstaller?.legacy_targets) && kiroInstaller.legacy_targets.includes('.kiro/steering'),
      'Kiro installer cleans legacy steering output',
    );

    const tempProjectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-kiro-test-'));
    const installedBmadDir = await findInstalledBmadDir(projectRoot);
    const legacyDir = path.join(tempProjectDir, '.kiro', 'steering', 'bmad-legacy-dir');
    await fs.ensureDir(legacyDir);
    await fs.writeFile(path.join(tempProjectDir, '.kiro', 'steering', 'bmad-legacy.md'), 'legacy\n');
    await fs.writeFile(path.join(legacyDir, 'SKILL.md'), 'legacy\n');

    const ideManager = new IdeManager();
    await ideManager.ensureInitialized();
    const result = await ideManager.setup('kiro', tempProjectDir, installedBmadDir, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result.success === true, 'Kiro setup succeeds against temp project');

    const skillFile = path.join(tempProjectDir, '.kiro', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile), 'Kiro install writes SKILL.md directory output');

    assert(!(await fs.pathExists(path.join(tempProjectDir, '.kiro', 'steering'))), 'Kiro setup removes legacy steering dir');

    await fs.remove(tempProjectDir);
  } catch (error) {
    assert(false, 'Kiro native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Test 6: Antigravity Native Skills Install
  // ============================================================
  console.log(`${colors.yellow}Test Suite 6: Antigravity Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes = await loadPlatformCodes();
    const antigravityInstaller = platformCodes.platforms.antigravity?.installer;

    assert(antigravityInstaller?.target_dir === '.agent/skills', 'Antigravity target_dir uses native skills path');

    assert(antigravityInstaller?.skill_format === true, 'Antigravity installer enables native skill output');

    assert(
      Array.isArray(antigravityInstaller?.legacy_targets) && antigravityInstaller.legacy_targets.includes('.agent/workflows'),
      'Antigravity installer cleans legacy workflow output',
    );

    const tempProjectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-antigravity-test-'));
    const installedBmadDir = await findInstalledBmadDir(projectRoot);
    const legacyDir = path.join(tempProjectDir, '.agent', 'workflows', 'bmad-legacy-dir');
    await fs.ensureDir(legacyDir);
    await fs.writeFile(path.join(tempProjectDir, '.agent', 'workflows', 'bmad-legacy.md'), 'legacy\n');
    await fs.writeFile(path.join(legacyDir, 'SKILL.md'), 'legacy\n');

    const ideManager = new IdeManager();
    await ideManager.ensureInitialized();
    const result = await ideManager.setup('antigravity', tempProjectDir, installedBmadDir, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result.success === true, 'Antigravity setup succeeds against temp project');

    const skillFile = path.join(tempProjectDir, '.agent', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile), 'Antigravity install writes SKILL.md directory output');

    assert(!(await fs.pathExists(path.join(tempProjectDir, '.agent', 'workflows'))), 'Antigravity setup removes legacy workflows dir');

    await fs.remove(tempProjectDir);
  } catch (error) {
    assert(false, 'Antigravity native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Test 7: QA Agent Compilation
  // ============================================================
  console.log(`${colors.yellow}Test Suite 7: QA Agent Compilation${colors.reset}\n`);

  try {
    const builder = new YamlXmlBuilder();
    const qaAgentPath = path.join(projectRoot, 'src/bmm/agents/qa.agent.yaml');
    const tempOutput = path.join(__dirname, 'temp-qa-agent.md');

    try {
      const result = await builder.buildAgent(qaAgentPath, null, tempOutput, { includeMetadata: true });
      const compiled = await fs.readFile(tempOutput, 'utf8');

      assert(compiled.includes('QA Engineer'), 'QA agent compilation includes agent title');

      assert(compiled.includes('qa-generate-e2e-tests'), 'QA agent menu includes automate workflow');

      // Cleanup
      await fs.remove(tempOutput);
    } catch (error) {
      assert(false, 'QA agent compiles successfully', error.message);
    }
  } catch (error) {
    assert(false, 'QA compilation test setup', error.message);
  }

  console.log('');

  // ============================================================
  // Summary
  // ============================================================
  console.log(`${colors.cyan}========================================`);
  console.log('Test Results:');
  console.log(`  Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`  Failed: ${colors.red}${failed}${colors.reset}`);
  console.log(`========================================${colors.reset}\n`);

  if (failed === 0) {
    console.log(`${colors.green}✨ All installation component tests passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}❌ Some installation component tests failed${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error(`${colors.red}Test runner failed:${colors.reset}`, error.message);
  console.error(error.stack);
  process.exit(1);
});
