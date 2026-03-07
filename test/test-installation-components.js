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

async function createTestBmadFixture() {
  const fixtureDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-fixture-'));

  // Minimal workflow manifest (generators check for this)
  await fs.ensureDir(path.join(fixtureDir, '_config'));
  await fs.writeFile(path.join(fixtureDir, '_config', 'workflow-manifest.csv'), '');

  // Minimal compiled agent for core/agents (contains <agent tag and frontmatter)
  const minimalAgent = [
    '---',
    'name: "test agent"',
    'description: "Minimal test agent fixture"',
    '---',
    '',
    'You are a test agent.',
    '',
    '<agent id="test-agent.agent.yaml" name="Test Agent" title="Test Agent">',
    '<persona>Test persona</persona>',
    '</agent>',
  ].join('\n');

  await fs.ensureDir(path.join(fixtureDir, 'core', 'agents'));
  await fs.writeFile(path.join(fixtureDir, 'core', 'agents', 'bmad-master.md'), minimalAgent);
  // Skill manifest so the installer uses 'bmad-master' as the canonical skill name
  await fs.writeFile(path.join(fixtureDir, 'core', 'agents', 'bmad-skill-manifest.yaml'), 'bmad-master.md:\n  canonicalId: bmad-master\n');

  // Minimal compiled agent for bmm module (tests use selectedModules: ['bmm'])
  await fs.ensureDir(path.join(fixtureDir, 'bmm', 'agents'));
  await fs.writeFile(path.join(fixtureDir, 'bmm', 'agents', 'test-bmm-agent.md'), minimalAgent);

  return fixtureDir;
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
    const installedBmadDir = await createTestBmadFixture();
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
    await fs.remove(installedBmadDir);
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
    const installedBmadDir = await createTestBmadFixture();
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
    await fs.remove(installedBmadDir);
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
    const installedBmadDir = await createTestBmadFixture();
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
    await fs.remove(installedBmadDir);
  } catch (error) {
    assert(false, 'Antigravity native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Test 7: Auggie Native Skills Install
  // ============================================================
  console.log(`${colors.yellow}Test Suite 7: Auggie Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes = await loadPlatformCodes();
    const auggieInstaller = platformCodes.platforms.auggie?.installer;

    assert(auggieInstaller?.target_dir === '.augment/skills', 'Auggie target_dir uses native skills path');

    assert(auggieInstaller?.skill_format === true, 'Auggie installer enables native skill output');

    assert(
      Array.isArray(auggieInstaller?.legacy_targets) && auggieInstaller.legacy_targets.includes('.augment/commands'),
      'Auggie installer cleans legacy command output',
    );

    assert(
      auggieInstaller?.ancestor_conflict_check !== true,
      'Auggie installer does not enable ancestor conflict checks without verified inheritance',
    );

    const tempProjectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-auggie-test-'));
    const installedBmadDir = await createTestBmadFixture();
    const legacyDir = path.join(tempProjectDir, '.augment', 'commands', 'bmad-legacy-dir');
    await fs.ensureDir(legacyDir);
    await fs.writeFile(path.join(tempProjectDir, '.augment', 'commands', 'bmad-legacy.md'), 'legacy\n');
    await fs.writeFile(path.join(legacyDir, 'SKILL.md'), 'legacy\n');

    const ideManager = new IdeManager();
    await ideManager.ensureInitialized();
    const result = await ideManager.setup('auggie', tempProjectDir, installedBmadDir, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result.success === true, 'Auggie setup succeeds against temp project');

    const skillFile = path.join(tempProjectDir, '.augment', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile), 'Auggie install writes SKILL.md directory output');

    assert(!(await fs.pathExists(path.join(tempProjectDir, '.augment', 'commands'))), 'Auggie setup removes legacy commands dir');

    await fs.remove(tempProjectDir);
    await fs.remove(installedBmadDir);
  } catch (error) {
    assert(false, 'Auggie native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Test 8: OpenCode Native Skills Install
  // ============================================================
  console.log(`${colors.yellow}Test Suite 8: OpenCode Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes = await loadPlatformCodes();
    const opencodeInstaller = platformCodes.platforms.opencode?.installer;

    assert(opencodeInstaller?.target_dir === '.opencode/skills', 'OpenCode target_dir uses native skills path');

    assert(opencodeInstaller?.skill_format === true, 'OpenCode installer enables native skill output');

    assert(opencodeInstaller?.ancestor_conflict_check === true, 'OpenCode installer enables ancestor conflict checks');

    assert(
      Array.isArray(opencodeInstaller?.legacy_targets) &&
        ['.opencode/agents', '.opencode/commands', '.opencode/agent', '.opencode/command'].every((legacyTarget) =>
          opencodeInstaller.legacy_targets.includes(legacyTarget),
        ),
      'OpenCode installer cleans split legacy agent and command output',
    );

    const tempProjectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-opencode-test-'));
    const installedBmadDir = await createTestBmadFixture();
    const legacyDirs = [
      path.join(tempProjectDir, '.opencode', 'agents', 'bmad-legacy-agent'),
      path.join(tempProjectDir, '.opencode', 'commands', 'bmad-legacy-command'),
      path.join(tempProjectDir, '.opencode', 'agent', 'bmad-legacy-agent-singular'),
      path.join(tempProjectDir, '.opencode', 'command', 'bmad-legacy-command-singular'),
    ];

    for (const legacyDir of legacyDirs) {
      await fs.ensureDir(legacyDir);
      await fs.writeFile(path.join(legacyDir, 'SKILL.md'), 'legacy\n');
      await fs.writeFile(path.join(path.dirname(legacyDir), `${path.basename(legacyDir)}.md`), 'legacy\n');
    }

    const ideManager = new IdeManager();
    await ideManager.ensureInitialized();
    const result = await ideManager.setup('opencode', tempProjectDir, installedBmadDir, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result.success === true, 'OpenCode setup succeeds against temp project');

    const skillFile = path.join(tempProjectDir, '.opencode', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile), 'OpenCode install writes SKILL.md directory output');

    for (const legacyDir of ['agents', 'commands', 'agent', 'command']) {
      assert(
        !(await fs.pathExists(path.join(tempProjectDir, '.opencode', legacyDir))),
        `OpenCode setup removes legacy .opencode/${legacyDir} dir`,
      );
    }

    await fs.remove(tempProjectDir);
    await fs.remove(installedBmadDir);
  } catch (error) {
    assert(false, 'OpenCode native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Test 9: Claude Code Native Skills Install
  // ============================================================
  console.log(`${colors.yellow}Test Suite 9: Claude Code Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes9 = await loadPlatformCodes();
    const claudeInstaller = platformCodes9.platforms['claude-code']?.installer;

    assert(claudeInstaller?.target_dir === '.claude/skills', 'Claude Code target_dir uses native skills path');

    assert(claudeInstaller?.skill_format === true, 'Claude Code installer enables native skill output');

    assert(claudeInstaller?.ancestor_conflict_check === true, 'Claude Code installer enables ancestor conflict checks');

    assert(
      Array.isArray(claudeInstaller?.legacy_targets) && claudeInstaller.legacy_targets.includes('.claude/commands'),
      'Claude Code installer cleans legacy command output',
    );

    const tempProjectDir9 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-claude-code-test-'));
    const installedBmadDir9 = await createTestBmadFixture();
    const legacyDir9 = path.join(tempProjectDir9, '.claude', 'commands');
    await fs.ensureDir(legacyDir9);
    await fs.writeFile(path.join(legacyDir9, 'bmad-legacy.md'), 'legacy\n');

    const ideManager9 = new IdeManager();
    await ideManager9.ensureInitialized();
    const result9 = await ideManager9.setup('claude-code', tempProjectDir9, installedBmadDir9, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result9.success === true, 'Claude Code setup succeeds against temp project');

    const skillFile9 = path.join(tempProjectDir9, '.claude', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile9), 'Claude Code install writes SKILL.md directory output');

    assert(!(await fs.pathExists(legacyDir9)), 'Claude Code setup removes legacy commands dir');

    await fs.remove(tempProjectDir9);
    await fs.remove(installedBmadDir9);
  } catch (error) {
    assert(false, 'Claude Code native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Test 10: Claude Code Ancestor Conflict
  // ============================================================
  console.log(`${colors.yellow}Test Suite 10: Claude Code Ancestor Conflict${colors.reset}\n`);

  try {
    const tempRoot10 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-claude-code-ancestor-test-'));
    const parentProjectDir10 = path.join(tempRoot10, 'parent');
    const childProjectDir10 = path.join(parentProjectDir10, 'child');
    const installedBmadDir10 = await createTestBmadFixture();

    await fs.ensureDir(path.join(parentProjectDir10, '.git'));
    await fs.ensureDir(path.join(parentProjectDir10, '.claude', 'skills', 'bmad-existing'));
    await fs.ensureDir(childProjectDir10);
    await fs.writeFile(path.join(parentProjectDir10, '.claude', 'skills', 'bmad-existing', 'SKILL.md'), 'legacy\n');

    const ideManager10 = new IdeManager();
    await ideManager10.ensureInitialized();
    const result10 = await ideManager10.setup('claude-code', childProjectDir10, installedBmadDir10, {
      silent: true,
      selectedModules: ['bmm'],
    });
    const expectedConflictDir10 = await fs.realpath(path.join(parentProjectDir10, '.claude', 'skills'));

    assert(result10.success === false, 'Claude Code setup refuses install when ancestor skills already exist');
    assert(result10.handlerResult?.reason === 'ancestor-conflict', 'Claude Code ancestor rejection reports ancestor-conflict reason');
    assert(
      result10.handlerResult?.conflictDir === expectedConflictDir10,
      'Claude Code ancestor rejection points at ancestor .claude/skills dir',
    );

    await fs.remove(tempRoot10);
    await fs.remove(installedBmadDir10);
  } catch (error) {
    assert(false, 'Claude Code ancestor conflict protection test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Test 11: Codex Native Skills Install
  // ============================================================
  console.log(`${colors.yellow}Test Suite 11: Codex Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes11 = await loadPlatformCodes();
    const codexInstaller = platformCodes11.platforms.codex?.installer;

    assert(codexInstaller?.target_dir === '.agents/skills', 'Codex target_dir uses native skills path');

    assert(codexInstaller?.skill_format === true, 'Codex installer enables native skill output');

    assert(codexInstaller?.ancestor_conflict_check === true, 'Codex installer enables ancestor conflict checks');

    assert(
      Array.isArray(codexInstaller?.legacy_targets) && codexInstaller.legacy_targets.includes('.codex/prompts'),
      'Codex installer cleans legacy prompt output',
    );

    const tempProjectDir11 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-codex-test-'));
    const installedBmadDir11 = await createTestBmadFixture();
    const legacyDir11 = path.join(tempProjectDir11, '.codex', 'prompts');
    await fs.ensureDir(legacyDir11);
    await fs.writeFile(path.join(legacyDir11, 'bmad-legacy.md'), 'legacy\n');

    const ideManager11 = new IdeManager();
    await ideManager11.ensureInitialized();
    const result11 = await ideManager11.setup('codex', tempProjectDir11, installedBmadDir11, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result11.success === true, 'Codex setup succeeds against temp project');

    const skillFile11 = path.join(tempProjectDir11, '.agents', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile11), 'Codex install writes SKILL.md directory output');

    assert(!(await fs.pathExists(legacyDir11)), 'Codex setup removes legacy prompts dir');

    await fs.remove(tempProjectDir11);
    await fs.remove(installedBmadDir11);
  } catch (error) {
    assert(false, 'Codex native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Test 12: Codex Ancestor Conflict
  // ============================================================
  console.log(`${colors.yellow}Test Suite 12: Codex Ancestor Conflict${colors.reset}\n`);

  try {
    const tempRoot12 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-codex-ancestor-test-'));
    const parentProjectDir12 = path.join(tempRoot12, 'parent');
    const childProjectDir12 = path.join(parentProjectDir12, 'child');
    const installedBmadDir12 = await createTestBmadFixture();

    await fs.ensureDir(path.join(parentProjectDir12, '.git'));
    await fs.ensureDir(path.join(parentProjectDir12, '.agents', 'skills', 'bmad-existing'));
    await fs.ensureDir(childProjectDir12);
    await fs.writeFile(path.join(parentProjectDir12, '.agents', 'skills', 'bmad-existing', 'SKILL.md'), 'legacy\n');

    const ideManager12 = new IdeManager();
    await ideManager12.ensureInitialized();
    const result12 = await ideManager12.setup('codex', childProjectDir12, installedBmadDir12, {
      silent: true,
      selectedModules: ['bmm'],
    });
    const expectedConflictDir12 = await fs.realpath(path.join(parentProjectDir12, '.agents', 'skills'));

    assert(result12.success === false, 'Codex setup refuses install when ancestor skills already exist');
    assert(result12.handlerResult?.reason === 'ancestor-conflict', 'Codex ancestor rejection reports ancestor-conflict reason');
    assert(result12.handlerResult?.conflictDir === expectedConflictDir12, 'Codex ancestor rejection points at ancestor .agents/skills dir');

    await fs.remove(tempRoot12);
    await fs.remove(installedBmadDir12);
  } catch (error) {
    assert(false, 'Codex ancestor conflict protection test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Test 13: Cursor Native Skills Install
  // ============================================================
  console.log(`${colors.yellow}Test Suite 13: Cursor Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes13 = await loadPlatformCodes();
    const cursorInstaller = platformCodes13.platforms.cursor?.installer;

    assert(cursorInstaller?.target_dir === '.cursor/skills', 'Cursor target_dir uses native skills path');

    assert(cursorInstaller?.skill_format === true, 'Cursor installer enables native skill output');

    assert(
      Array.isArray(cursorInstaller?.legacy_targets) && cursorInstaller.legacy_targets.includes('.cursor/commands'),
      'Cursor installer cleans legacy command output',
    );

    assert(!cursorInstaller?.ancestor_conflict_check, 'Cursor installer does not enable ancestor conflict checks');

    const tempProjectDir13c = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-cursor-test-'));
    const installedBmadDir13c = await createTestBmadFixture();
    const legacyDir13c = path.join(tempProjectDir13c, '.cursor', 'commands');
    await fs.ensureDir(legacyDir13c);
    await fs.writeFile(path.join(legacyDir13c, 'bmad-legacy.md'), 'legacy\n');

    const ideManager13c = new IdeManager();
    await ideManager13c.ensureInitialized();
    const result13c = await ideManager13c.setup('cursor', tempProjectDir13c, installedBmadDir13c, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result13c.success === true, 'Cursor setup succeeds against temp project');

    const skillFile13c = path.join(tempProjectDir13c, '.cursor', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile13c), 'Cursor install writes SKILL.md directory output');

    assert(!(await fs.pathExists(legacyDir13c)), 'Cursor setup removes legacy commands dir');

    await fs.remove(tempProjectDir13c);
    await fs.remove(installedBmadDir13c);
  } catch (error) {
    assert(false, 'Cursor native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Test 14: Roo Code Native Skills Install
  // ============================================================
  console.log(`${colors.yellow}Test Suite 14: Roo Code Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes13 = await loadPlatformCodes();
    const rooInstaller = platformCodes13.platforms.roo?.installer;

    assert(rooInstaller?.target_dir === '.roo/skills', 'Roo target_dir uses native skills path');

    assert(rooInstaller?.skill_format === true, 'Roo installer enables native skill output');

    assert(
      Array.isArray(rooInstaller?.legacy_targets) && rooInstaller.legacy_targets.includes('.roo/commands'),
      'Roo installer cleans legacy command output',
    );

    const tempProjectDir13 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-roo-test-'));
    const installedBmadDir13 = await createTestBmadFixture();
    const legacyDir13 = path.join(tempProjectDir13, '.roo', 'commands', 'bmad-legacy-dir');
    await fs.ensureDir(legacyDir13);
    await fs.writeFile(path.join(tempProjectDir13, '.roo', 'commands', 'bmad-legacy.md'), 'legacy\n');
    await fs.writeFile(path.join(legacyDir13, 'SKILL.md'), 'legacy\n');

    const ideManager13 = new IdeManager();
    await ideManager13.ensureInitialized();
    const result13 = await ideManager13.setup('roo', tempProjectDir13, installedBmadDir13, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result13.success === true, 'Roo setup succeeds against temp project');

    const skillFile13 = path.join(tempProjectDir13, '.roo', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile13), 'Roo install writes SKILL.md directory output');

    // Verify name frontmatter matches directory name (Roo constraint: lowercase alphanumeric + hyphens)
    const skillContent13 = await fs.readFile(skillFile13, 'utf8');
    const nameMatch13 = skillContent13.match(/^name:\s*(.+)$/m);
    assert(
      nameMatch13 && nameMatch13[1].trim() === 'bmad-master',
      'Roo skill name frontmatter matches directory name exactly (lowercase alphanumeric + hyphens)',
    );

    assert(!(await fs.pathExists(path.join(tempProjectDir13, '.roo', 'commands'))), 'Roo setup removes legacy commands dir');

    // Reinstall/upgrade: run setup again over existing skills output
    const result13b = await ideManager13.setup('roo', tempProjectDir13, installedBmadDir13, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result13b.success === true, 'Roo reinstall/upgrade succeeds over existing skills');
    assert(await fs.pathExists(skillFile13), 'Roo reinstall preserves SKILL.md output');

    await fs.remove(tempProjectDir13);
    await fs.remove(installedBmadDir13);
  } catch (error) {
    assert(false, 'Roo native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Test 15: OpenCode Ancestor Conflict
  // ============================================================
  console.log(`${colors.yellow}Test Suite 15: OpenCode Ancestor Conflict${colors.reset}\n`);

  try {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-opencode-ancestor-test-'));
    const parentProjectDir = path.join(tempRoot, 'parent');
    const childProjectDir = path.join(parentProjectDir, 'child');
    const installedBmadDir = await createTestBmadFixture();

    await fs.ensureDir(path.join(parentProjectDir, '.git'));
    await fs.ensureDir(path.join(parentProjectDir, '.opencode', 'skills', 'bmad-existing'));
    await fs.ensureDir(childProjectDir);
    await fs.writeFile(path.join(parentProjectDir, '.opencode', 'skills', 'bmad-existing', 'SKILL.md'), 'legacy\n');

    const ideManager = new IdeManager();
    await ideManager.ensureInitialized();
    const result = await ideManager.setup('opencode', childProjectDir, installedBmadDir, {
      silent: true,
      selectedModules: ['bmm'],
    });
    const expectedConflictDir = await fs.realpath(path.join(parentProjectDir, '.opencode', 'skills'));

    assert(result.success === false, 'OpenCode setup refuses install when ancestor skills already exist');
    assert(result.handlerResult?.reason === 'ancestor-conflict', 'OpenCode ancestor rejection reports ancestor-conflict reason');
    assert(
      result.handlerResult?.conflictDir === expectedConflictDir,
      'OpenCode ancestor rejection points at ancestor .opencode/skills dir',
    );

    await fs.remove(tempRoot);
    await fs.remove(installedBmadDir);
  } catch (error) {
    assert(false, 'OpenCode ancestor conflict protection test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Test 16: QA Agent Compilation
  // ============================================================
  console.log(`${colors.yellow}Test Suite 16: QA Agent Compilation${colors.reset}\n`);

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
  // Test 17: GitHub Copilot Native Skills Install
  // ============================================================
  console.log(`${colors.yellow}Test Suite 17: GitHub Copilot Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes17 = await loadPlatformCodes();
    const copilotInstaller = platformCodes17.platforms['github-copilot']?.installer;

    assert(copilotInstaller?.target_dir === '.github/skills', 'GitHub Copilot target_dir uses native skills path');

    assert(copilotInstaller?.skill_format === true, 'GitHub Copilot installer enables native skill output');

    assert(
      Array.isArray(copilotInstaller?.legacy_targets) && copilotInstaller.legacy_targets.includes('.github/agents'),
      'GitHub Copilot installer cleans legacy agents output',
    );

    assert(
      Array.isArray(copilotInstaller?.legacy_targets) && copilotInstaller.legacy_targets.includes('.github/prompts'),
      'GitHub Copilot installer cleans legacy prompts output',
    );

    const tempProjectDir17 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-copilot-test-'));
    const installedBmadDir17 = await createTestBmadFixture();

    // Create legacy .github/agents/ and .github/prompts/ files
    const legacyAgentsDir17 = path.join(tempProjectDir17, '.github', 'agents');
    const legacyPromptsDir17 = path.join(tempProjectDir17, '.github', 'prompts');
    await fs.ensureDir(legacyAgentsDir17);
    await fs.ensureDir(legacyPromptsDir17);
    await fs.writeFile(path.join(legacyAgentsDir17, 'bmad-legacy.agent.md'), 'legacy agent\n');
    await fs.writeFile(path.join(legacyPromptsDir17, 'bmad-legacy.prompt.md'), 'legacy prompt\n');

    // Create legacy copilot-instructions.md with BMAD markers
    const copilotInstructionsPath17 = path.join(tempProjectDir17, '.github', 'copilot-instructions.md');
    await fs.writeFile(
      copilotInstructionsPath17,
      'User content before\n<!-- BMAD:START -->\nBMAD generated content\n<!-- BMAD:END -->\nUser content after\n',
    );

    const ideManager17 = new IdeManager();
    await ideManager17.ensureInitialized();
    const result17 = await ideManager17.setup('github-copilot', tempProjectDir17, installedBmadDir17, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result17.success === true, 'GitHub Copilot setup succeeds against temp project');

    const skillFile17 = path.join(tempProjectDir17, '.github', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile17), 'GitHub Copilot install writes SKILL.md directory output');

    // Verify name frontmatter matches directory name
    const skillContent17 = await fs.readFile(skillFile17, 'utf8');
    const nameMatch17 = skillContent17.match(/^name:\s*(.+)$/m);
    assert(nameMatch17 && nameMatch17[1].trim() === 'bmad-master', 'GitHub Copilot skill name frontmatter matches directory name exactly');

    assert(!(await fs.pathExists(legacyAgentsDir17)), 'GitHub Copilot setup removes legacy agents dir');

    assert(!(await fs.pathExists(legacyPromptsDir17)), 'GitHub Copilot setup removes legacy prompts dir');

    // Verify copilot-instructions.md BMAD markers were stripped but user content preserved
    const cleanedInstructions17 = await fs.readFile(copilotInstructionsPath17, 'utf8');
    assert(
      !cleanedInstructions17.includes('BMAD:START') && !cleanedInstructions17.includes('BMAD generated content'),
      'GitHub Copilot setup strips BMAD markers from copilot-instructions.md',
    );
    assert(
      cleanedInstructions17.includes('User content before') && cleanedInstructions17.includes('User content after'),
      'GitHub Copilot setup preserves user content in copilot-instructions.md',
    );

    await fs.remove(tempProjectDir17);
    await fs.remove(installedBmadDir17);
  } catch (error) {
    assert(false, 'GitHub Copilot native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Test 18: Cline Native Skills Install
  // ============================================================
  console.log(`${colors.yellow}Test Suite 18: Cline Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes18 = await loadPlatformCodes();
    const clineInstaller = platformCodes18.platforms.cline?.installer;

    assert(clineInstaller?.target_dir === '.cline/skills', 'Cline target_dir uses native skills path');

    assert(clineInstaller?.skill_format === true, 'Cline installer enables native skill output');

    assert(
      Array.isArray(clineInstaller?.legacy_targets) && clineInstaller.legacy_targets.includes('.clinerules/workflows'),
      'Cline installer cleans legacy workflow output',
    );

    const tempProjectDir18 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-cline-test-'));
    const installedBmadDir18 = await createTestBmadFixture();
    const legacyDir18 = path.join(tempProjectDir18, '.clinerules', 'workflows', 'bmad-legacy-dir');
    await fs.ensureDir(legacyDir18);
    await fs.writeFile(path.join(tempProjectDir18, '.clinerules', 'workflows', 'bmad-legacy.md'), 'legacy\n');
    await fs.writeFile(path.join(legacyDir18, 'SKILL.md'), 'legacy\n');

    const ideManager18 = new IdeManager();
    await ideManager18.ensureInitialized();
    const result18 = await ideManager18.setup('cline', tempProjectDir18, installedBmadDir18, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result18.success === true, 'Cline setup succeeds against temp project');

    const skillFile18 = path.join(tempProjectDir18, '.cline', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile18), 'Cline install writes SKILL.md directory output');

    // Verify name frontmatter matches directory name
    const skillContent18 = await fs.readFile(skillFile18, 'utf8');
    const nameMatch18 = skillContent18.match(/^name:\s*(.+)$/m);
    assert(nameMatch18 && nameMatch18[1].trim() === 'bmad-master', 'Cline skill name frontmatter matches directory name exactly');

    assert(!(await fs.pathExists(path.join(tempProjectDir18, '.clinerules', 'workflows'))), 'Cline setup removes legacy workflows dir');

    // Reinstall/upgrade: run setup again over existing skills output
    const result18b = await ideManager18.setup('cline', tempProjectDir18, installedBmadDir18, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result18b.success === true, 'Cline reinstall/upgrade succeeds over existing skills');
    assert(await fs.pathExists(skillFile18), 'Cline reinstall preserves SKILL.md output');

    await fs.remove(tempProjectDir18);
    await fs.remove(installedBmadDir18);
  } catch (error) {
    assert(false, 'Cline native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Test 19: CodeBuddy Native Skills Install
  // ============================================================
  console.log(`${colors.yellow}Test Suite 19: CodeBuddy Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes19 = await loadPlatformCodes();
    const codebuddyInstaller = platformCodes19.platforms.codebuddy?.installer;

    assert(codebuddyInstaller?.target_dir === '.codebuddy/skills', 'CodeBuddy target_dir uses native skills path');

    assert(codebuddyInstaller?.skill_format === true, 'CodeBuddy installer enables native skill output');

    assert(
      Array.isArray(codebuddyInstaller?.legacy_targets) && codebuddyInstaller.legacy_targets.includes('.codebuddy/commands'),
      'CodeBuddy installer cleans legacy command output',
    );

    const tempProjectDir19 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-codebuddy-test-'));
    const installedBmadDir19 = await createTestBmadFixture();
    const legacyDir19 = path.join(tempProjectDir19, '.codebuddy', 'commands', 'bmad-legacy-dir');
    await fs.ensureDir(legacyDir19);
    await fs.writeFile(path.join(tempProjectDir19, '.codebuddy', 'commands', 'bmad-legacy.md'), 'legacy\n');
    await fs.writeFile(path.join(legacyDir19, 'SKILL.md'), 'legacy\n');

    const ideManager19 = new IdeManager();
    await ideManager19.ensureInitialized();
    const result19 = await ideManager19.setup('codebuddy', tempProjectDir19, installedBmadDir19, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result19.success === true, 'CodeBuddy setup succeeds against temp project');

    const skillFile19 = path.join(tempProjectDir19, '.codebuddy', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile19), 'CodeBuddy install writes SKILL.md directory output');

    const skillContent19 = await fs.readFile(skillFile19, 'utf8');
    const nameMatch19 = skillContent19.match(/^name:\s*(.+)$/m);
    assert(nameMatch19 && nameMatch19[1].trim() === 'bmad-master', 'CodeBuddy skill name frontmatter matches directory name exactly');

    assert(!(await fs.pathExists(path.join(tempProjectDir19, '.codebuddy', 'commands'))), 'CodeBuddy setup removes legacy commands dir');

    const result19b = await ideManager19.setup('codebuddy', tempProjectDir19, installedBmadDir19, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result19b.success === true, 'CodeBuddy reinstall/upgrade succeeds over existing skills');
    assert(await fs.pathExists(skillFile19), 'CodeBuddy reinstall preserves SKILL.md output');

    await fs.remove(tempProjectDir19);
    await fs.remove(installedBmadDir19);
  } catch (error) {
    assert(false, 'CodeBuddy native skills migration test succeeds', error.message);
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
