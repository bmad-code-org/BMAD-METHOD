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
const fs = require('../tools/installer/fs-native');
const { Installer } = require('../tools/installer/core/installer');
const { ManifestGenerator } = require('../tools/installer/core/manifest-generator');
const { OfficialModules } = require('../tools/installer/modules/official-modules');
const { IdeManager } = require('../tools/installer/ide/manager');
const { clearCache, loadPlatformCodes } = require('../tools/installer/ide/platform-codes');

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
  const fixtureRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-fixture-'));
  const fixtureDir = path.join(fixtureRoot, '_bmad');
  await fs.ensureDir(fixtureDir);

  // Skill manifest CSV — the sole source of truth for IDE skill installation
  await fs.ensureDir(path.join(fixtureDir, '_config'));
  await fs.writeFile(
    path.join(fixtureDir, '_config', 'skill-manifest.csv'),
    [
      'canonicalId,name,description,module,path',
      '"bmad-master","bmad-master","Minimal test agent fixture","core","_bmad/core/bmad-master/SKILL.md"',
      '',
    ].join('\n'),
  );

  // Minimal SKILL.md for the skill entry
  const skillDir = path.join(fixtureDir, 'core', 'bmad-master');
  await fs.ensureDir(skillDir);
  await fs.writeFile(
    path.join(skillDir, 'SKILL.md'),
    [
      '---',
      'name: bmad-master',
      'description: Minimal test agent fixture',
      '---',
      '',
      '<!-- agent-activation -->',
      'You are a test agent.',
    ].join('\n'),
  );
  await fs.writeFile(path.join(skillDir, 'workflow.md'), '# Test Workflow\nStep 1: Do the thing.\n');

  return fixtureDir;
}

async function createSkillCollisionFixture() {
  const fixtureRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-skill-collision-'));
  const fixtureDir = path.join(fixtureRoot, '_bmad');
  const configDir = path.join(fixtureDir, '_config');
  await fs.ensureDir(configDir);

  await fs.writeFile(
    path.join(configDir, 'skill-manifest.csv'),
    [
      'canonicalId,name,description,module,path',
      '"bmad-help","bmad-help","Native help skill","core","_bmad/core/tasks/bmad-help/SKILL.md"',
      '',
    ].join('\n'),
  );

  const skillDir = path.join(fixtureDir, 'core', 'tasks', 'bmad-help');
  await fs.ensureDir(skillDir);
  await fs.writeFile(
    path.join(skillDir, 'SKILL.md'),
    ['---', 'name: bmad-help', 'description: Native help skill', '---', '', 'Use this skill directly.'].join('\n'),
  );

  const agentDir = path.join(fixtureDir, 'core', 'agents');
  await fs.ensureDir(agentDir);
  await fs.writeFile(
    path.join(agentDir, 'bmad-master.md'),
    ['---', 'name: BMAD Master', 'description: Master agent', '---', '', '<agent name="BMAD Master" title="Master">', '</agent>'].join(
      '\n',
    ),
  );

  return { root: fixtureRoot, bmadDir: fixtureDir };
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
  // Test 1: Windsurf Native Skills Install
  // ============================================================
  console.log(`${colors.yellow}Test Suite 1: Windsurf Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes = await loadPlatformCodes();
    const windsurfInstaller = platformCodes.platforms.windsurf?.installer;

    assert(windsurfInstaller?.target_dir === '.windsurf/skills', 'Windsurf target_dir uses native skills path');

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
    await fs.remove(path.dirname(installedBmadDir));
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
    await fs.remove(path.dirname(installedBmadDir));
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
    await fs.remove(path.dirname(installedBmadDir));
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
    await fs.remove(path.dirname(installedBmadDir));
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
    await fs.remove(path.dirname(installedBmadDir));
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

    // Verify name frontmatter matches directory name
    const skillContent9 = await fs.readFile(skillFile9, 'utf8');
    const nameMatch9 = skillContent9.match(/^name:\s*(.+)$/m);
    assert(nameMatch9 && nameMatch9[1].trim() === 'bmad-master', 'Claude Code skill name frontmatter matches directory name exactly');

    assert(!(await fs.pathExists(legacyDir9)), 'Claude Code setup removes legacy commands dir');

    await fs.remove(tempProjectDir9);
    await fs.remove(path.dirname(installedBmadDir9));
  } catch (error) {
    assert(false, 'Claude Code native skills migration test succeeds', error.message);
  }

  console.log('');

  // Test 10: Removed — ancestor conflict check no longer applies (no IDE inherits skills from parent dirs)

  // ============================================================
  // Test 11: Codex Native Skills Install
  // ============================================================
  console.log(`${colors.yellow}Test Suite 11: Codex Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes11 = await loadPlatformCodes();
    const codexInstaller = platformCodes11.platforms.codex?.installer;

    assert(codexInstaller?.target_dir === '.agents/skills', 'Codex target_dir uses native skills path');

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

    // Verify name frontmatter matches directory name
    const skillContent11 = await fs.readFile(skillFile11, 'utf8');
    const nameMatch11 = skillContent11.match(/^name:\s*(.+)$/m);
    assert(nameMatch11 && nameMatch11[1].trim() === 'bmad-master', 'Codex skill name frontmatter matches directory name exactly');

    assert(!(await fs.pathExists(legacyDir11)), 'Codex setup removes legacy prompts dir');

    await fs.remove(tempProjectDir11);
    await fs.remove(path.dirname(installedBmadDir11));
  } catch (error) {
    assert(false, 'Codex native skills migration test succeeds', error.message);
  }

  console.log('');

  // Test 12: Removed — ancestor conflict check no longer applies (no IDE inherits skills from parent dirs)

  // ============================================================
  // Test 13: Cursor Native Skills Install
  // ============================================================
  console.log(`${colors.yellow}Test Suite 13: Cursor Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes13 = await loadPlatformCodes();
    const cursorInstaller = platformCodes13.platforms.cursor?.installer;

    assert(cursorInstaller?.target_dir === '.cursor/skills', 'Cursor target_dir uses native skills path');

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

    // Verify name frontmatter matches directory name
    const skillContent13c = await fs.readFile(skillFile13c, 'utf8');
    const nameMatch13c = skillContent13c.match(/^name:\s*(.+)$/m);
    assert(nameMatch13c && nameMatch13c[1].trim() === 'bmad-master', 'Cursor skill name frontmatter matches directory name exactly');

    assert(!(await fs.pathExists(legacyDir13c)), 'Cursor setup removes legacy commands dir');

    await fs.remove(tempProjectDir13c);
    await fs.remove(path.dirname(installedBmadDir13c));
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
    await fs.remove(path.dirname(installedBmadDir13));
  } catch (error) {
    assert(false, 'Roo native skills migration test succeeds', error.message);
  }

  console.log('');

  // Test 15: Removed — ancestor conflict check no longer applies (no IDE inherits skills from parent dirs)

  // Test 16: Removed — old YAML→XML QA agent compilation no longer applies (agents now use SKILL.md format)

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
    await fs.remove(path.dirname(installedBmadDir17));
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
    await fs.remove(path.dirname(installedBmadDir18));
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
    await fs.remove(path.dirname(installedBmadDir19));
  } catch (error) {
    assert(false, 'CodeBuddy native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Test 20: Crush Native Skills Install
  // ============================================================
  console.log(`${colors.yellow}Test Suite 20: Crush Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes20 = await loadPlatformCodes();
    const crushInstaller = platformCodes20.platforms.crush?.installer;

    assert(crushInstaller?.target_dir === '.crush/skills', 'Crush target_dir uses native skills path');

    assert(
      Array.isArray(crushInstaller?.legacy_targets) && crushInstaller.legacy_targets.includes('.crush/commands'),
      'Crush installer cleans legacy command output',
    );

    const tempProjectDir20 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-crush-test-'));
    const installedBmadDir20 = await createTestBmadFixture();
    const legacyDir20 = path.join(tempProjectDir20, '.crush', 'commands', 'bmad-legacy-dir');
    await fs.ensureDir(legacyDir20);
    await fs.writeFile(path.join(tempProjectDir20, '.crush', 'commands', 'bmad-legacy.md'), 'legacy\n');
    await fs.writeFile(path.join(legacyDir20, 'SKILL.md'), 'legacy\n');

    const ideManager20 = new IdeManager();
    await ideManager20.ensureInitialized();
    const result20 = await ideManager20.setup('crush', tempProjectDir20, installedBmadDir20, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result20.success === true, 'Crush setup succeeds against temp project');

    const skillFile20 = path.join(tempProjectDir20, '.crush', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile20), 'Crush install writes SKILL.md directory output');

    const skillContent20 = await fs.readFile(skillFile20, 'utf8');
    const nameMatch20 = skillContent20.match(/^name:\s*(.+)$/m);
    assert(nameMatch20 && nameMatch20[1].trim() === 'bmad-master', 'Crush skill name frontmatter matches directory name exactly');

    assert(!(await fs.pathExists(path.join(tempProjectDir20, '.crush', 'commands'))), 'Crush setup removes legacy commands dir');

    const result20b = await ideManager20.setup('crush', tempProjectDir20, installedBmadDir20, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result20b.success === true, 'Crush reinstall/upgrade succeeds over existing skills');
    assert(await fs.pathExists(skillFile20), 'Crush reinstall preserves SKILL.md output');

    await fs.remove(tempProjectDir20);
    await fs.remove(path.dirname(installedBmadDir20));
  } catch (error) {
    assert(false, 'Crush native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Test 21: Trae Native Skills Install
  // ============================================================
  console.log(`${colors.yellow}Test Suite 21: Trae Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes21 = await loadPlatformCodes();
    const traeInstaller = platformCodes21.platforms.trae?.installer;

    assert(traeInstaller?.target_dir === '.trae/skills', 'Trae target_dir uses native skills path');

    assert(
      Array.isArray(traeInstaller?.legacy_targets) && traeInstaller.legacy_targets.includes('.trae/rules'),
      'Trae installer cleans legacy rules output',
    );

    const tempProjectDir21 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-trae-test-'));
    const installedBmadDir21 = await createTestBmadFixture();
    const legacyDir21 = path.join(tempProjectDir21, '.trae', 'rules');
    await fs.ensureDir(legacyDir21);
    await fs.writeFile(path.join(legacyDir21, 'bmad-legacy.md'), 'legacy\n');

    const ideManager21 = new IdeManager();
    await ideManager21.ensureInitialized();
    const result21 = await ideManager21.setup('trae', tempProjectDir21, installedBmadDir21, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result21.success === true, 'Trae setup succeeds against temp project');

    const skillFile21 = path.join(tempProjectDir21, '.trae', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile21), 'Trae install writes SKILL.md directory output');

    const skillContent21 = await fs.readFile(skillFile21, 'utf8');
    const nameMatch21 = skillContent21.match(/^name:\s*(.+)$/m);
    assert(nameMatch21 && nameMatch21[1].trim() === 'bmad-master', 'Trae skill name frontmatter matches directory name exactly');

    assert(!(await fs.pathExists(path.join(tempProjectDir21, '.trae', 'rules'))), 'Trae setup removes legacy rules dir');

    const result21b = await ideManager21.setup('trae', tempProjectDir21, installedBmadDir21, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result21b.success === true, 'Trae reinstall/upgrade succeeds over existing skills');
    assert(await fs.pathExists(skillFile21), 'Trae reinstall preserves SKILL.md output');

    await fs.remove(tempProjectDir21);
    await fs.remove(path.dirname(installedBmadDir21));
  } catch (error) {
    assert(false, 'Trae native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Suite 22: KiloCoder Native Skills
  // ============================================================
  console.log(`${colors.yellow}Test Suite 22: KiloCoder Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes22 = await loadPlatformCodes();
    const kiloConfig22 = platformCodes22.platforms.kilo;

    assert(!kiloConfig22?.suspended, 'KiloCoder is not suspended');

    assert(kiloConfig22?.installer?.target_dir === '.kilocode/skills', 'KiloCoder target_dir uses native skills path');

    assert(
      Array.isArray(kiloConfig22?.installer?.legacy_targets) && kiloConfig22.installer.legacy_targets.includes('.kilocode/workflows'),
      'KiloCoder installer cleans legacy workflows output',
    );

    const ideManager22 = new IdeManager();
    await ideManager22.ensureInitialized();

    // Should appear in available IDEs
    const availableIdes22 = ideManager22.getAvailableIdes();
    assert(
      availableIdes22.some((ide) => ide.value === 'kilo'),
      'KiloCoder appears in IDE selection',
    );

    const tempProjectDir22 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-kilo-test-'));
    const installedBmadDir22 = await createTestBmadFixture();

    // Pre-populate legacy Kilo artifacts that should be cleaned up
    const legacyDir22 = path.join(tempProjectDir22, '.kilocode', 'workflows');
    await fs.ensureDir(legacyDir22);
    await fs.writeFile(path.join(legacyDir22, 'bmad-legacy.md'), 'legacy\n');

    const result22 = await ideManager22.setup('kilo', tempProjectDir22, installedBmadDir22, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result22.success === true, 'KiloCoder setup succeeds against temp project');

    const skillFile22 = path.join(tempProjectDir22, '.kilocode', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile22), 'KiloCoder install writes SKILL.md directory output');

    const skillContent22 = await fs.readFile(skillFile22, 'utf8');
    const nameMatch22 = skillContent22.match(/^name:\s*(.+)$/m);
    assert(nameMatch22 && nameMatch22[1].trim() === 'bmad-master', 'KiloCoder skill name frontmatter matches directory name exactly');

    assert(!(await fs.pathExists(path.join(tempProjectDir22, '.kilocode', 'workflows'))), 'KiloCoder setup removes legacy workflows dir');

    const result22b = await ideManager22.setup('kilo', tempProjectDir22, installedBmadDir22, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result22b.success === true, 'KiloCoder reinstall/upgrade succeeds over existing skills');
    assert(await fs.pathExists(skillFile22), 'KiloCoder reinstall preserves SKILL.md output');

    await fs.remove(tempProjectDir22);
    await fs.remove(path.dirname(installedBmadDir22));
  } catch (error) {
    assert(false, 'KiloCoder native skills test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Suite 23: Gemini CLI Native Skills
  // ============================================================
  console.log(`${colors.yellow}Test Suite 23: Gemini CLI Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes23 = await loadPlatformCodes();
    const geminiInstaller = platformCodes23.platforms.gemini?.installer;

    assert(geminiInstaller?.target_dir === '.gemini/skills', 'Gemini target_dir uses native skills path');

    assert(
      Array.isArray(geminiInstaller?.legacy_targets) && geminiInstaller.legacy_targets.includes('.gemini/commands'),
      'Gemini installer cleans legacy commands output',
    );

    const tempProjectDir23 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-gemini-test-'));
    const installedBmadDir23 = await createTestBmadFixture();
    const legacyDir23 = path.join(tempProjectDir23, '.gemini', 'commands');
    await fs.ensureDir(legacyDir23);
    await fs.writeFile(path.join(legacyDir23, 'bmad-legacy.toml'), 'legacy\n');

    const ideManager23 = new IdeManager();
    await ideManager23.ensureInitialized();
    const result23 = await ideManager23.setup('gemini', tempProjectDir23, installedBmadDir23, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result23.success === true, 'Gemini setup succeeds against temp project');

    const skillFile23 = path.join(tempProjectDir23, '.gemini', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile23), 'Gemini install writes SKILL.md directory output');

    const skillContent23 = await fs.readFile(skillFile23, 'utf8');
    const nameMatch23 = skillContent23.match(/^name:\s*(.+)$/m);
    assert(nameMatch23 && nameMatch23[1].trim() === 'bmad-master', 'Gemini skill name frontmatter matches directory name exactly');

    assert(!(await fs.pathExists(path.join(tempProjectDir23, '.gemini', 'commands'))), 'Gemini setup removes legacy commands dir');

    const result23b = await ideManager23.setup('gemini', tempProjectDir23, installedBmadDir23, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result23b.success === true, 'Gemini reinstall/upgrade succeeds over existing skills');
    assert(await fs.pathExists(skillFile23), 'Gemini reinstall preserves SKILL.md output');

    await fs.remove(tempProjectDir23);
    await fs.remove(path.dirname(installedBmadDir23));
  } catch (error) {
    assert(false, 'Gemini native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Suite 24: iFlow Native Skills
  // ============================================================
  console.log(`${colors.yellow}Test Suite 24: iFlow Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes24 = await loadPlatformCodes();
    const iflowInstaller = platformCodes24.platforms.iflow?.installer;

    assert(iflowInstaller?.target_dir === '.iflow/skills', 'iFlow target_dir uses native skills path');
    assert(
      Array.isArray(iflowInstaller?.legacy_targets) && iflowInstaller.legacy_targets.includes('.iflow/commands'),
      'iFlow installer cleans legacy commands output',
    );

    const tempProjectDir24 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-iflow-test-'));
    const installedBmadDir24 = await createTestBmadFixture();
    const legacyDir24 = path.join(tempProjectDir24, '.iflow', 'commands');
    await fs.ensureDir(legacyDir24);
    await fs.writeFile(path.join(legacyDir24, 'bmad-legacy.md'), 'legacy\n');

    const ideManager24 = new IdeManager();
    await ideManager24.ensureInitialized();
    const result24 = await ideManager24.setup('iflow', tempProjectDir24, installedBmadDir24, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result24.success === true, 'iFlow setup succeeds against temp project');

    const skillFile24 = path.join(tempProjectDir24, '.iflow', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile24), 'iFlow install writes SKILL.md directory output');

    // Verify name frontmatter matches directory name
    const skillContent24 = await fs.readFile(skillFile24, 'utf8');
    const nameMatch24 = skillContent24.match(/^name:\s*(.+)$/m);
    assert(nameMatch24 && nameMatch24[1].trim() === 'bmad-master', 'iFlow skill name frontmatter matches directory name exactly');

    assert(!(await fs.pathExists(path.join(tempProjectDir24, '.iflow', 'commands'))), 'iFlow setup removes legacy commands dir');

    await fs.remove(tempProjectDir24);
    await fs.remove(path.dirname(installedBmadDir24));
  } catch (error) {
    assert(false, 'iFlow native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Suite 25: QwenCoder Native Skills
  // ============================================================
  console.log(`${colors.yellow}Test Suite 25: QwenCoder Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes25 = await loadPlatformCodes();
    const qwenInstaller = platformCodes25.platforms.qwen?.installer;

    assert(qwenInstaller?.target_dir === '.qwen/skills', 'QwenCoder target_dir uses native skills path');
    assert(
      Array.isArray(qwenInstaller?.legacy_targets) && qwenInstaller.legacy_targets.includes('.qwen/commands'),
      'QwenCoder installer cleans legacy commands output',
    );

    const tempProjectDir25 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-qwen-test-'));
    const installedBmadDir25 = await createTestBmadFixture();
    const legacyDir25 = path.join(tempProjectDir25, '.qwen', 'commands');
    await fs.ensureDir(legacyDir25);
    await fs.writeFile(path.join(legacyDir25, 'bmad-legacy.md'), 'legacy\n');

    const ideManager25 = new IdeManager();
    await ideManager25.ensureInitialized();
    const result25 = await ideManager25.setup('qwen', tempProjectDir25, installedBmadDir25, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result25.success === true, 'QwenCoder setup succeeds against temp project');

    const skillFile25 = path.join(tempProjectDir25, '.qwen', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile25), 'QwenCoder install writes SKILL.md directory output');

    // Verify name frontmatter matches directory name
    const skillContent25 = await fs.readFile(skillFile25, 'utf8');
    const nameMatch25 = skillContent25.match(/^name:\s*(.+)$/m);
    assert(nameMatch25 && nameMatch25[1].trim() === 'bmad-master', 'QwenCoder skill name frontmatter matches directory name exactly');

    assert(!(await fs.pathExists(path.join(tempProjectDir25, '.qwen', 'commands'))), 'QwenCoder setup removes legacy commands dir');

    await fs.remove(tempProjectDir25);
    await fs.remove(path.dirname(installedBmadDir25));
  } catch (error) {
    assert(false, 'QwenCoder native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Suite 26: Rovo Dev Native Skills
  // ============================================================
  console.log(`${colors.yellow}Test Suite 26: Rovo Dev Native Skills${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes26 = await loadPlatformCodes();
    const rovoInstaller = platformCodes26.platforms['rovo-dev']?.installer;

    assert(rovoInstaller?.target_dir === '.rovodev/skills', 'Rovo Dev target_dir uses native skills path');
    assert(
      Array.isArray(rovoInstaller?.legacy_targets) && rovoInstaller.legacy_targets.includes('.rovodev/workflows'),
      'Rovo Dev installer cleans legacy workflows output',
    );

    const tempProjectDir26 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-rovodev-test-'));
    const installedBmadDir26 = await createTestBmadFixture();
    const legacyDir26 = path.join(tempProjectDir26, '.rovodev', 'workflows');
    await fs.ensureDir(legacyDir26);
    await fs.writeFile(path.join(legacyDir26, 'bmad-legacy.md'), 'legacy\n');

    // Create a prompts.yml with BMAD entries and a user entry
    const yaml26 = require('yaml');
    const promptsPath26 = path.join(tempProjectDir26, '.rovodev', 'prompts.yml');
    const promptsContent26 = yaml26.stringify({
      prompts: [
        { name: 'bmad-bmm-create-prd', description: 'BMAD workflow', content_file: 'workflows/bmad-bmm-create-prd.md' },
        { name: 'my-custom-prompt', description: 'User prompt', content_file: 'custom.md' },
      ],
    });
    await fs.writeFile(promptsPath26, promptsContent26);

    const ideManager26 = new IdeManager();
    await ideManager26.ensureInitialized();
    const result26 = await ideManager26.setup('rovo-dev', tempProjectDir26, installedBmadDir26, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result26.success === true, 'Rovo Dev setup succeeds against temp project');

    const skillFile26 = path.join(tempProjectDir26, '.rovodev', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile26), 'Rovo Dev install writes SKILL.md directory output');

    // Verify name frontmatter matches directory name
    const skillContent26 = await fs.readFile(skillFile26, 'utf8');
    const nameMatch26 = skillContent26.match(/^name:\s*(.+)$/m);
    assert(nameMatch26 && nameMatch26[1].trim() === 'bmad-master', 'Rovo Dev skill name frontmatter matches directory name exactly');

    assert(!(await fs.pathExists(path.join(tempProjectDir26, '.rovodev', 'workflows'))), 'Rovo Dev setup removes legacy workflows dir');

    // Verify prompts.yml cleanup: BMAD entries removed, user entry preserved
    const cleanedPrompts26 = yaml26.parse(await fs.readFile(promptsPath26, 'utf8'));
    assert(
      Array.isArray(cleanedPrompts26.prompts) && cleanedPrompts26.prompts.length === 1,
      'Rovo Dev cleanup removes BMAD entries from prompts.yml',
    );
    assert(cleanedPrompts26.prompts[0].name === 'my-custom-prompt', 'Rovo Dev cleanup preserves non-BMAD entries in prompts.yml');

    await fs.remove(tempProjectDir26);
    await fs.remove(path.dirname(installedBmadDir26));
  } catch (error) {
    assert(false, 'Rovo Dev native skills migration test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Suite 27: Cleanup preserves bmad-os-* skills
  // ============================================================
  console.log(`${colors.yellow}Test Suite 27: Cleanup preserves bmad-os-* skills${colors.reset}\n`);

  try {
    const tempProjectDir27 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-os-preserve-test-'));
    const installedBmadDir27 = await createTestBmadFixture();

    // Pre-populate .claude/skills with bmad-os-* skills (version-controlled repo skills)
    const osSkillDir27 = path.join(tempProjectDir27, '.claude', 'skills', 'bmad-os-review-pr');
    await fs.ensureDir(osSkillDir27);
    await fs.writeFile(
      path.join(osSkillDir27, 'SKILL.md'),
      '---\nname: bmad-os-review-pr\ndescription: Review PRs\n---\nOS skill content\n',
    );

    const osSkillDir27b = path.join(tempProjectDir27, '.claude', 'skills', 'bmad-os-release-module');
    await fs.ensureDir(osSkillDir27b);
    await fs.writeFile(
      path.join(osSkillDir27b, 'SKILL.md'),
      '---\nname: bmad-os-release-module\ndescription: Release module\n---\nOS skill content\n',
    );

    // Also add a regular bmad skill that SHOULD be cleaned up
    const regularSkillDir27 = path.join(tempProjectDir27, '.claude', 'skills', 'bmad-architect');
    await fs.ensureDir(regularSkillDir27);
    await fs.writeFile(
      path.join(regularSkillDir27, 'SKILL.md'),
      '---\nname: bmad-architect\ndescription: Architect\n---\nOld skill content\n',
    );

    // Add bmad-architect to the existing skill-manifest.csv so cleanup knows it was previously installed
    const configDir27 = path.join(installedBmadDir27, '_config');
    const existingCsv27 = await fs.readFile(path.join(configDir27, 'skill-manifest.csv'), 'utf8');
    await fs.writeFile(
      path.join(configDir27, 'skill-manifest.csv'),
      existingCsv27.trimEnd() + '\n"bmad-architect","bmad-architect","Architect","bmm","_bmad/bmm/agents/bmad-architect/SKILL.md"\n',
    );

    // Run Claude Code setup (which triggers cleanup then install)
    const ideManager27 = new IdeManager();
    await ideManager27.ensureInitialized();
    const result27 = await ideManager27.setup('claude-code', tempProjectDir27, installedBmadDir27, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result27.success === true, 'Claude Code setup succeeds with bmad-os-* skills present');

    // bmad-os-* skills must survive
    assert(await fs.pathExists(osSkillDir27), 'Cleanup preserves bmad-os-review-pr skill');
    assert(await fs.pathExists(osSkillDir27b), 'Cleanup preserves bmad-os-release-module skill');

    // bmad-os skill content must be untouched
    const osContent27 = await fs.readFile(path.join(osSkillDir27, 'SKILL.md'), 'utf8');
    assert(osContent27.includes('OS skill content'), 'bmad-os-review-pr skill content is unchanged');

    // Regular bmad skill should have been replaced by fresh install
    const newSkillFile27 = path.join(tempProjectDir27, '.claude', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(newSkillFile27), 'Fresh bmad skills are installed alongside preserved bmad-os-* skills');

    // Stale non-bmad-os skill must have been removed by cleanup
    assert(!(await fs.pathExists(regularSkillDir27)), 'Cleanup removes stale non-bmad-os skills');

    await fs.remove(tempProjectDir27);
    await fs.remove(path.dirname(installedBmadDir27));
  } catch (error) {
    assert(false, 'bmad-os-* skill preservation test succeeds', error.message);
  }

  console.log('');

  // ============================================================
  // Suite 28: Pi Native Skills
  // ============================================================
  console.log(`${colors.yellow}Test Suite 28: Pi Native Skills${colors.reset}\n`);

  let tempProjectDir28;
  let installedBmadDir28;
  try {
    clearCache();
    const platformCodes28 = await loadPlatformCodes();
    const piInstaller = platformCodes28.platforms.pi?.installer;

    assert(piInstaller?.target_dir === '.pi/skills', 'Pi target_dir uses native skills path');

    tempProjectDir28 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-pi-test-'));
    installedBmadDir28 = await createTestBmadFixture();

    const ideManager28 = new IdeManager();
    await ideManager28.ensureInitialized();

    // Verify Pi is selectable in available IDEs list
    const availableIdes28 = ideManager28.getAvailableIdes();
    assert(
      availableIdes28.some((ide) => ide.value === 'pi'),
      'Pi appears in available IDEs list',
    );

    // Verify Pi is NOT detected before install
    const detectedBefore28 = await ideManager28.detectInstalledIdes(tempProjectDir28);
    assert(!detectedBefore28.includes('pi'), 'Pi is not detected before install');

    const result28 = await ideManager28.setup('pi', tempProjectDir28, installedBmadDir28, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result28.success === true, 'Pi setup succeeds against temp project');

    // Verify Pi IS detected after install
    const detectedAfter28 = await ideManager28.detectInstalledIdes(tempProjectDir28);
    assert(detectedAfter28.includes('pi'), 'Pi is detected after install');

    const skillFile28 = path.join(tempProjectDir28, '.pi', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile28), 'Pi install writes SKILL.md directory output');

    // Parse YAML frontmatter between --- markers
    const skillContent28 = await fs.readFile(skillFile28, 'utf8');
    const fmMatch28 = skillContent28.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    assert(fmMatch28, 'Pi SKILL.md contains valid frontmatter delimiters');

    const frontmatter28 = fmMatch28[1];
    const body28 = fmMatch28[2];

    // Verify name in frontmatter matches directory name
    const fmName28 = frontmatter28.match(/^name:\s*(.+)$/m);
    assert(fmName28 && fmName28[1].trim() === 'bmad-master', 'Pi skill name frontmatter matches directory name exactly');

    // Verify description exists and is non-empty
    const fmDesc28 = frontmatter28.match(/^description:\s*(.+)$/m);
    assert(fmDesc28 && fmDesc28[1].trim().length > 0, 'Pi skill description frontmatter is present and non-empty');

    // Verify frontmatter contains only name and description keys
    const fmKeys28 = [...frontmatter28.matchAll(/^([a-zA-Z0-9_-]+):/gm)].map((m) => m[1]);
    assert(
      fmKeys28.length === 2 && fmKeys28.includes('name') && fmKeys28.includes('description'),
      'Pi skill frontmatter contains only name and description keys',
    );

    // Verify body content is non-empty and contains expected activation instructions
    assert(body28.trim().length > 0, 'Pi skill body content is non-empty');
    assert(body28.includes('agent-activation'), 'Pi skill body contains expected agent activation instructions');

    // Reinstall/upgrade: run setup again over existing output
    const result28b = await ideManager28.setup('pi', tempProjectDir28, installedBmadDir28, {
      silent: true,
      selectedModules: ['bmm'],
    });
    assert(result28b.success === true, 'Pi reinstall/upgrade succeeds over existing skills');
    assert(await fs.pathExists(skillFile28), 'Pi reinstall preserves SKILL.md output');
  } catch (error) {
    assert(false, 'Pi native skills test succeeds', error.message);
  } finally {
    if (tempProjectDir28) await fs.remove(tempProjectDir28).catch(() => {});
    if (installedBmadDir28) await fs.remove(path.dirname(installedBmadDir28)).catch(() => {});
  }

  console.log('');

  // ============================================================
  // Suite 29: Unified Skill Scanner — collectSkills
  // ============================================================
  console.log(`${colors.yellow}Test Suite 29: Unified Skill Scanner${colors.reset}\n`);

  let tempFixture29;
  try {
    tempFixture29 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-skill-scanner-'));

    // Create _config dir (required by manifest generator)
    await fs.ensureDir(path.join(tempFixture29, '_config'));

    // --- Skill at unusual path: core/custom-area/my-skill/ ---
    const skillDir29 = path.join(tempFixture29, 'core', 'custom-area', 'my-skill');
    await fs.ensureDir(skillDir29);
    await fs.writeFile(
      path.join(skillDir29, 'SKILL.md'),
      '---\nname: my-skill\ndescription: A skill at an unusual path\n---\n\nFollow the instructions in [workflow.md](workflow.md).\n',
    );
    await fs.writeFile(path.join(skillDir29, 'workflow.md'), '# My Custom Skill\n\nSkill body content\n');

    // --- Regular workflow dir: core/workflows/regular-wf/ (type: workflow) ---
    const wfDir29 = path.join(tempFixture29, 'core', 'workflows', 'regular-wf');
    await fs.ensureDir(wfDir29);
    await fs.writeFile(path.join(wfDir29, 'bmad-skill-manifest.yaml'), 'type: workflow\ncanonicalId: regular-wf\n');
    await fs.writeFile(
      path.join(wfDir29, 'workflow.md'),
      '---\nname: Regular Workflow\ndescription: A regular workflow not a skill\n---\n\nWorkflow body\n',
    );

    // --- Skill inside workflows/ dir: core/workflows/wf-skill/ ---
    const wfSkillDir29 = path.join(tempFixture29, 'core', 'workflows', 'wf-skill');
    await fs.ensureDir(wfSkillDir29);
    await fs.writeFile(
      path.join(wfSkillDir29, 'SKILL.md'),
      '---\nname: wf-skill\ndescription: A skill inside workflows dir\n---\n\nFollow the instructions in [workflow.md](workflow.md).\n',
    );
    await fs.writeFile(path.join(wfSkillDir29, 'workflow.md'), '# Workflow Skill\n\nSkill in workflows\n');

    // --- Skill inside tasks/ dir: core/tasks/task-skill/ ---
    const taskSkillDir29 = path.join(tempFixture29, 'core', 'tasks', 'task-skill');
    await fs.ensureDir(taskSkillDir29);
    await fs.writeFile(
      path.join(taskSkillDir29, 'SKILL.md'),
      '---\nname: task-skill\ndescription: A skill inside tasks dir\n---\n\nFollow the instructions in [workflow.md](workflow.md).\n',
    );
    await fs.writeFile(path.join(taskSkillDir29, 'workflow.md'), '# Task Skill\n\nSkill in tasks\n');

    // --- Native agent entrypoint inside agents/: core/agents/bmad-tea/ ---
    const nativeAgentDir29 = path.join(tempFixture29, 'core', 'agents', 'bmad-tea');
    await fs.ensureDir(nativeAgentDir29);
    await fs.writeFile(path.join(nativeAgentDir29, 'bmad-skill-manifest.yaml'), 'type: agent\ncanonicalId: bmad-tea\n');
    await fs.writeFile(
      path.join(nativeAgentDir29, 'SKILL.md'),
      '---\nname: bmad-tea\ndescription: Native agent entrypoint\n---\n\nPresent a capability menu.\n',
    );

    // Minimal agent so core module is detected
    await fs.ensureDir(path.join(tempFixture29, 'core', 'agents'));
    const minimalAgent29 = '<agent name="Test" title="T"><persona>p</persona></agent>';
    await fs.writeFile(path.join(tempFixture29, 'core', 'agents', 'test.md'), minimalAgent29);

    const generator29 = new ManifestGenerator();
    await generator29.generateManifests(tempFixture29, ['core'], [], { ides: [] });

    // Skill at unusual path should be in skills
    const skillEntry29 = generator29.skills.find((s) => s.canonicalId === 'my-skill');
    assert(skillEntry29 !== undefined, 'Skill at unusual path appears in skills[]');
    assert(skillEntry29 && skillEntry29.name === 'my-skill', 'Skill has correct name from frontmatter');
    assert(
      skillEntry29 && skillEntry29.path.includes('custom-area/my-skill/SKILL.md'),
      'Skill path includes relative path from module root',
    );

    // Skill in tasks/ dir should be in skills
    const taskSkillEntry29 = generator29.skills.find((s) => s.canonicalId === 'task-skill');
    assert(taskSkillEntry29 !== undefined, 'Skill in tasks/ dir appears in skills[]');

    // Native agent entrypoint should be installed as a verbatim skill.
    // (Agent roster is now sourced from module.yaml's `agents:` block, not
    // from per-skill bmad-skill-manifest.yaml sidecars, so this test no longer
    // verifies agents[] membership — see collectAgentsFromModuleYaml tests.)
    const nativeAgentEntry29 = generator29.skills.find((s) => s.canonicalId === 'bmad-tea');
    assert(nativeAgentEntry29 !== undefined, 'Native type:agent SKILL.md dir appears in skills[]');
    assert(
      nativeAgentEntry29 && nativeAgentEntry29.path.includes('agents/bmad-tea/SKILL.md'),
      'Native type:agent SKILL.md path points to the agent directory entrypoint',
    );

    // Regular type:workflow should NOT appear in skills[]
    const regularInSkills29 = generator29.skills.find((s) => s.canonicalId === 'regular-wf');
    assert(regularInSkills29 === undefined, 'Regular type:workflow does NOT appear in skills[]');

    // Skill inside workflows/ should be in skills[]
    const wfSkill29 = generator29.skills.find((s) => s.canonicalId === 'wf-skill');
    assert(wfSkill29 !== undefined, 'Skill in workflows/ dir appears in skills[]');

    // Test scanInstalledModules recognizes skill-only modules
    const skillOnlyModDir29 = path.join(tempFixture29, 'skill-only-mod');
    await fs.ensureDir(path.join(skillOnlyModDir29, 'deep', 'nested', 'my-skill'));
    await fs.writeFile(
      path.join(skillOnlyModDir29, 'deep', 'nested', 'my-skill', 'SKILL.md'),
      '---\nname: my-skill\ndescription: desc\n---\n\nFollow the instructions in [workflow.md](workflow.md).\n',
    );
    await fs.writeFile(path.join(skillOnlyModDir29, 'deep', 'nested', 'my-skill', 'workflow.md'), '# Nested Skill\n\nbody\n');

    const scannedModules29 = await generator29.scanInstalledModules(tempFixture29);
    assert(scannedModules29.includes('skill-only-mod'), 'scanInstalledModules recognizes skill-only module');

    // Test scanInstalledModules recognizes native-agent-only modules too
    const agentOnlyModDir29 = path.join(tempFixture29, 'agent-only-mod');
    await fs.ensureDir(path.join(agentOnlyModDir29, 'deep', 'nested', 'bmad-tea'));
    await fs.writeFile(path.join(agentOnlyModDir29, 'deep', 'nested', 'bmad-tea', 'bmad-skill-manifest.yaml'), 'type: agent\n');
    await fs.writeFile(
      path.join(agentOnlyModDir29, 'deep', 'nested', 'bmad-tea', 'SKILL.md'),
      '---\nname: bmad-tea\ndescription: desc\n---\n\nAgent menu.\n',
    );

    const rescannedModules29 = await generator29.scanInstalledModules(tempFixture29);
    assert(rescannedModules29.includes('agent-only-mod'), 'scanInstalledModules recognizes native-agent-only module');

    // Test scanInstalledModules recognizes multi-entry manifests keyed under SKILL.md
    const multiEntryModDir29 = path.join(tempFixture29, 'multi-entry-mod');
    await fs.ensureDir(path.join(multiEntryModDir29, 'deep', 'nested', 'bmad-tea'));
    await fs.writeFile(
      path.join(multiEntryModDir29, 'deep', 'nested', 'bmad-tea', 'bmad-skill-manifest.yaml'),
      'SKILL.md:\n  type: agent\n  canonicalId: bmad-tea\n',
    );
    await fs.writeFile(
      path.join(multiEntryModDir29, 'deep', 'nested', 'bmad-tea', 'SKILL.md'),
      '---\nname: bmad-tea\ndescription: desc\n---\n\nAgent menu.\n',
    );

    const rescannedModules29b = await generator29.scanInstalledModules(tempFixture29);
    assert(rescannedModules29b.includes('multi-entry-mod'), 'scanInstalledModules recognizes multi-entry native-agent module');

    // skill-manifest.csv should include the native agent entrypoint
    const skillManifestCsv29 = await fs.readFile(path.join(tempFixture29, '_config', 'skill-manifest.csv'), 'utf8');
    assert(skillManifestCsv29.includes('bmad-tea'), 'skill-manifest.csv includes native type:agent SKILL.md entrypoint');
  } catch (error) {
    assert(false, 'Unified skill scanner test succeeds', error.message);
  } finally {
    if (tempFixture29) await fs.remove(tempFixture29).catch(() => {});
  }

  console.log('');

  // ============================================================
  // Suite 30: parseSkillMd validation (negative cases)
  // ============================================================
  console.log(`${colors.yellow}Test Suite 30: parseSkillMd Validation${colors.reset}\n`);

  let tempFixture30;
  try {
    tempFixture30 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-test-30-'));

    const generator30 = new ManifestGenerator();
    generator30.bmadFolderName = '_bmad';

    // Case 1: Missing SKILL.md entirely
    const noSkillDir = path.join(tempFixture30, 'no-skill-md');
    await fs.ensureDir(noSkillDir);
    const result1 = await generator30.parseSkillMd(path.join(noSkillDir, 'SKILL.md'), noSkillDir, 'no-skill-md');
    assert(result1 === null, 'parseSkillMd returns null when SKILL.md is missing');

    // Case 2: SKILL.md with no frontmatter
    const noFmDir = path.join(tempFixture30, 'no-frontmatter');
    await fs.ensureDir(noFmDir);
    await fs.writeFile(path.join(noFmDir, 'SKILL.md'), '# Just a heading\n\nNo frontmatter here.\n');
    const result2 = await generator30.parseSkillMd(path.join(noFmDir, 'SKILL.md'), noFmDir, 'no-frontmatter');
    assert(result2 === null, 'parseSkillMd returns null when SKILL.md has no frontmatter');

    // Case 3: SKILL.md missing description
    const noDescDir = path.join(tempFixture30, 'no-desc');
    await fs.ensureDir(noDescDir);
    await fs.writeFile(path.join(noDescDir, 'SKILL.md'), '---\nname: no-desc\n---\n\nBody.\n');
    const result3 = await generator30.parseSkillMd(path.join(noDescDir, 'SKILL.md'), noDescDir, 'no-desc');
    assert(result3 === null, 'parseSkillMd returns null when description is missing');

    // Case 4: SKILL.md missing name
    const noNameDir = path.join(tempFixture30, 'no-name');
    await fs.ensureDir(noNameDir);
    await fs.writeFile(path.join(noNameDir, 'SKILL.md'), '---\ndescription: has desc but no name\n---\n\nBody.\n');
    const result4 = await generator30.parseSkillMd(path.join(noNameDir, 'SKILL.md'), noNameDir, 'no-name');
    assert(result4 === null, 'parseSkillMd returns null when name is missing');

    // Case 5: Name mismatch
    const mismatchDir = path.join(tempFixture30, 'actual-dir-name');
    await fs.ensureDir(mismatchDir);
    await fs.writeFile(path.join(mismatchDir, 'SKILL.md'), '---\nname: wrong-name\ndescription: A skill\n---\n\nBody.\n');
    const result5 = await generator30.parseSkillMd(path.join(mismatchDir, 'SKILL.md'), mismatchDir, 'actual-dir-name');
    assert(result5 === null, 'parseSkillMd returns null when name does not match directory name');

    // Case 6: Valid SKILL.md (positive control)
    const validDir = path.join(tempFixture30, 'valid-skill');
    await fs.ensureDir(validDir);
    await fs.writeFile(path.join(validDir, 'SKILL.md'), '---\nname: valid-skill\ndescription: A valid skill\n---\n\nBody.\n');
    const result6 = await generator30.parseSkillMd(path.join(validDir, 'SKILL.md'), validDir, 'valid-skill');
    assert(result6 !== null && result6.name === 'valid-skill', 'parseSkillMd returns metadata for valid SKILL.md');

    // Case 7: Malformed YAML (non-object)
    const malformedDir = path.join(tempFixture30, 'malformed');
    await fs.ensureDir(malformedDir);
    await fs.writeFile(path.join(malformedDir, 'SKILL.md'), '---\njust a string\n---\n\nBody.\n');
    const result7 = await generator30.parseSkillMd(path.join(malformedDir, 'SKILL.md'), malformedDir, 'malformed');
    assert(result7 === null, 'parseSkillMd returns null for non-object YAML frontmatter');
  } catch (error) {
    assert(false, 'parseSkillMd validation test succeeds', error.message);
  } finally {
    if (tempFixture30) await fs.remove(tempFixture30).catch(() => {});
  }

  console.log('');

  // ============================================================
  // Test 31: Skill-format installs report unique skill directories
  // ============================================================
  console.log(`${colors.yellow}Test Suite 31: Skill Count Reporting${colors.reset}\n`);

  let collisionFixtureRoot = null;
  let collisionProjectDir = null;

  try {
    clearCache();
    const collisionFixture = await createSkillCollisionFixture();
    collisionFixtureRoot = collisionFixture.root;
    collisionProjectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-antigravity-test-'));

    const ideManager = new IdeManager();
    await ideManager.ensureInitialized();
    const result = await ideManager.setup('antigravity', collisionProjectDir, collisionFixture.bmadDir, {
      silent: true,
      selectedModules: ['core'],
    });

    assert(result.success === true, 'Antigravity setup succeeds with overlapping skill names');
    assert(result.detail === '1 skills', 'Installer detail reports skill count');
    assert(result.handlerResult.results.skillDirectories === 1, 'Result exposes unique skill directory count');
    assert(result.handlerResult.results.skills === 1, 'Result retains verbatim skill count');
    assert(
      await fs.pathExists(path.join(collisionProjectDir, '.agent', 'skills', 'bmad-help', 'SKILL.md')),
      'Skill directory is created from skill-manifest',
    );
  } catch (error) {
    assert(false, 'Skill-format unique count test succeeds', error.message);
  } finally {
    if (collisionProjectDir) await fs.remove(collisionProjectDir).catch(() => {});
    if (collisionFixtureRoot) await fs.remove(collisionFixtureRoot).catch(() => {});
  }

  console.log('');

  // ============================================================
  // Suite 32: Ona Native Skills
  // ============================================================
  console.log(`${colors.yellow}Test Suite 32: Ona Native Skills${colors.reset}\n`);

  let tempProjectDir32;
  let installedBmadDir32;
  try {
    clearCache();
    const platformCodes32 = await loadPlatformCodes();
    const onaInstaller = platformCodes32.platforms.ona?.installer;

    assert(onaInstaller?.target_dir === '.ona/skills', 'Ona target_dir uses native skills path');

    tempProjectDir32 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-ona-test-'));
    installedBmadDir32 = await createTestBmadFixture();

    const ideManager32 = new IdeManager();
    await ideManager32.ensureInitialized();

    // Verify Ona is selectable in available IDEs list
    const availableIdes32 = ideManager32.getAvailableIdes();
    assert(
      availableIdes32.some((ide) => ide.value === 'ona'),
      'Ona appears in available IDEs list',
    );

    // Verify Ona is NOT detected before install
    const detectedBefore32 = await ideManager32.detectInstalledIdes(tempProjectDir32);
    assert(!detectedBefore32.includes('ona'), 'Ona is not detected before install');

    const result32 = await ideManager32.setup('ona', tempProjectDir32, installedBmadDir32, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result32.success === true, 'Ona setup succeeds against temp project');

    // Verify Ona IS detected after install
    const detectedAfter32 = await ideManager32.detectInstalledIdes(tempProjectDir32);
    assert(detectedAfter32.includes('ona'), 'Ona is detected after install');

    const skillFile32 = path.join(tempProjectDir32, '.ona', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile32), 'Ona install writes SKILL.md directory output');

    const workflowFile32 = path.join(tempProjectDir32, '.ona', 'skills', 'bmad-master', 'workflow.md');
    assert(await fs.pathExists(workflowFile32), 'Ona install copies non-SKILL.md files (workflow.md) verbatim');

    // Parse YAML frontmatter between --- markers
    const skillContent32 = await fs.readFile(skillFile32, 'utf8');
    const fmMatch32 = skillContent32.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    assert(fmMatch32, 'Ona SKILL.md contains valid frontmatter delimiters');

    const frontmatter32 = fmMatch32[1];
    const body32 = fmMatch32[2];

    // Verify name in frontmatter matches directory name
    const fmName32 = frontmatter32.match(/^name:\s*(.+)$/m);
    assert(fmName32 && fmName32[1].trim() === 'bmad-master', 'Ona skill name frontmatter matches directory name exactly');

    // Verify description exists and is non-empty
    const fmDesc32 = frontmatter32.match(/^description:\s*(.+)$/m);
    assert(fmDesc32 && fmDesc32[1].trim().length > 0, 'Ona skill description frontmatter is present and non-empty');

    // Verify frontmatter contains only name and description keys
    const fmKeys32 = [...frontmatter32.matchAll(/^([a-zA-Z0-9_-]+):/gm)].map((m) => m[1]);
    assert(
      fmKeys32.length === 2 && fmKeys32.includes('name') && fmKeys32.includes('description'),
      'Ona skill frontmatter contains only name and description keys',
    );

    // Verify body content is non-empty and contains expected activation instructions
    assert(body32.trim().length > 0, 'Ona skill body content is non-empty');
    assert(body32.includes('agent-activation'), 'Ona skill body contains expected agent activation instructions');

    // Reinstall/upgrade: run setup again over existing output
    const result32b = await ideManager32.setup('ona', tempProjectDir32, installedBmadDir32, {
      silent: true,
      selectedModules: ['bmm'],
    });
    assert(result32b.success === true, 'Ona reinstall/upgrade succeeds over existing skills');
    assert(await fs.pathExists(skillFile32), 'Ona reinstall preserves SKILL.md output');
  } catch (error) {
    assert(false, 'Ona native skills test succeeds', error.message);
  } finally {
    if (tempProjectDir32) await fs.remove(tempProjectDir32).catch(() => {});
    if (installedBmadDir32) await fs.remove(path.dirname(installedBmadDir32)).catch(() => {});
  }

  console.log('');

  // ============================================================
  // Test Suite 33: Community & Custom Module Managers
  // ============================================================
  console.log(`${colors.yellow}Test Suite 33: Community & Custom Module Managers${colors.reset}\n`);

  // --- CustomModuleManager._normalizeCustomModule ---
  {
    const { CustomModuleManager } = require('../tools/installer/modules/custom-module-manager');
    const mgr = new CustomModuleManager();

    const plugin = { name: 'test-plugin', description: 'A test', version: '1.0.0', author: 'tester', source: './src' };
    const data = { owner: 'Fallback Owner' };
    const result = mgr._normalizeCustomModule(plugin, 'https://github.com/o/r', data);

    assert(result.code === 'test-plugin', 'normalizeCustomModule sets code from plugin name');
    assert(result.type === 'custom', 'normalizeCustomModule sets type to custom');
    assert(result.trustTier === 'unverified', 'normalizeCustomModule sets trustTier to unverified');
    assert(result.version === '1.0.0', 'normalizeCustomModule preserves version');
    assert(result.author === 'tester', 'normalizeCustomModule uses plugin author over data.owner');

    const pluginNoAuthor = { name: 'x', description: '', version: null };
    const result2 = mgr._normalizeCustomModule(pluginNoAuthor, 'https://github.com/o/r', data);
    assert(result2.author === 'Fallback Owner', 'normalizeCustomModule falls back to data.owner');
  }

  // --- CommunityModuleManager._normalizeCommunityModule ---
  {
    const { CommunityModuleManager } = require('../tools/installer/modules/community-manager');
    const mgr = new CommunityModuleManager();

    const mod = {
      name: 'test-mod',
      display_name: 'Test Module',
      code: 'tm',
      description: 'desc',
      repository: 'https://github.com/o/r',
      module_definition: 'src/module.yaml',
      category: 'software-development',
      subcategory: 'dev-tools',
      trust_tier: 'bmad-certified',
      version: '2.0.0',
      approved_sha: 'abc123',
      promoted: true,
      promoted_rank: 1,
      keywords: ['test', 'module'],
    };
    const result = mgr._normalizeCommunityModule(mod);

    assert(result.code === 'tm', 'normalizeCommunityModule sets code');
    assert(result.displayName === 'Test Module', 'normalizeCommunityModule sets displayName from display_name');
    assert(result.type === 'community', 'normalizeCommunityModule sets type to community');
    assert(result.category === 'software-development', 'normalizeCommunityModule preserves category');
    assert(result.trustTier === 'bmad-certified', 'normalizeCommunityModule maps trust_tier');
    assert(result.approvedSha === 'abc123', 'normalizeCommunityModule maps approved_sha');
    assert(result.promoted === true, 'normalizeCommunityModule maps promoted');
    assert(result.promotedRank === 1, 'normalizeCommunityModule maps promoted_rank');
    assert(result.builtIn === false, 'normalizeCommunityModule sets builtIn false');
  }

  // --- CommunityModuleManager.searchByKeyword (with injected cache) ---
  {
    const { CommunityModuleManager } = require('../tools/installer/modules/community-manager');
    const mgr = new CommunityModuleManager();

    // Inject cached index to avoid network call
    mgr._cachedIndex = {
      modules: [
        { name: 'mod-a', display_name: 'Alpha', code: 'a', description: 'testing tools', category: 'dev', keywords: ['test'] },
        { name: 'mod-b', display_name: 'Beta', code: 'b', description: 'design suite', category: 'design', keywords: ['ux'] },
        { name: 'mod-c', display_name: 'Gamma', code: 'c', description: 'game engine', category: 'game', keywords: ['unity'] },
      ],
    };

    const r1 = await mgr.searchByKeyword('test');
    assert(r1.length === 1 && r1[0].code === 'a', 'searchByKeyword matches keyword');

    const r2 = await mgr.searchByKeyword('design');
    assert(r2.length === 1 && r2[0].code === 'b', 'searchByKeyword matches description');

    const r3 = await mgr.searchByKeyword('alpha');
    assert(r3.length === 1 && r3[0].code === 'a', 'searchByKeyword matches display name');

    const r4 = await mgr.searchByKeyword('xyz');
    assert(r4.length === 0, 'searchByKeyword returns empty for no match');

    const r5 = await mgr.searchByKeyword('UNITY');
    assert(r5.length === 1 && r5[0].code === 'c', 'searchByKeyword is case-insensitive');
  }

  // --- CommunityModuleManager.listFeatured (with injected cache) ---
  {
    const { CommunityModuleManager } = require('../tools/installer/modules/community-manager');
    const mgr = new CommunityModuleManager();

    mgr._cachedIndex = {
      modules: [
        { name: 'a', code: 'a', promoted: true, promoted_rank: 3 },
        { name: 'b', code: 'b', promoted: false },
        { name: 'c', code: 'c', promoted: true, promoted_rank: 1 },
      ],
    };

    const featured = await mgr.listFeatured();
    assert(featured.length === 2, 'listFeatured returns only promoted modules');
    assert(featured[0].code === 'c' && featured[1].code === 'a', 'listFeatured sorts by promoted_rank ascending');
  }

  // --- CommunityModuleManager.getCategoryList (with injected cache) ---
  {
    const { CommunityModuleManager } = require('../tools/installer/modules/community-manager');
    const mgr = new CommunityModuleManager();

    mgr._cachedIndex = {
      modules: [
        { name: 'a', code: 'a', category: 'software-development' },
        { name: 'b', code: 'b', category: 'design-and-creative' },
        { name: 'c', code: 'c', category: 'software-development' },
      ],
    };
    mgr._cachedCategories = {
      categories: {
        'software-development': { name: 'Software Development' },
        'design-and-creative': { name: 'Design & Creative' },
      },
    };

    const cats = await mgr.getCategoryList();
    assert(cats.length === 2, 'getCategoryList returns categories with modules');
    const swDev = cats.find((c) => c.slug === 'software-development');
    assert(swDev && swDev.moduleCount === 2, 'getCategoryList counts modules per category');
    assert(cats[0].name === 'Design & Creative', 'getCategoryList sorts alphabetically');
  }

  // --- CommunityModuleManager SHA pinning normalization ---
  {
    const { CommunityModuleManager } = require('../tools/installer/modules/community-manager');
    const mgr = new CommunityModuleManager();

    // Module with SHA set
    const withSha = mgr._normalizeCommunityModule({
      name: 'pinned-mod',
      code: 'pm',
      approved_sha: 'abc123def456',
      approved_tag: 'v1.0.0',
    });
    assert(withSha.approvedSha === 'abc123def456', 'SHA is preserved when set');
    assert(withSha.approvedTag === 'v1.0.0', 'Tag is preserved as metadata');

    // Module with null SHA (trusted contributor)
    const noSha = mgr._normalizeCommunityModule({
      name: 'trusted-mod',
      code: 'tm',
      approved_sha: null,
    });
    assert(noSha.approvedSha === null, 'Null SHA means no pinning (trusted contributor)');
  }

  // --- CommunityModuleManager.listByCategory (with injected cache) ---
  {
    const { CommunityModuleManager } = require('../tools/installer/modules/community-manager');
    const mgr = new CommunityModuleManager();

    mgr._cachedIndex = {
      modules: [
        { name: 'a', code: 'a', category: 'design-and-creative' },
        { name: 'b', code: 'b', category: 'software-development' },
        { name: 'c', code: 'c', category: 'design-and-creative' },
        { name: 'd', code: 'd', category: 'game-development' },
      ],
    };

    const design = await mgr.listByCategory('design-and-creative');
    assert(design.length === 2, 'listByCategory filters to matching category');
    assert(
      design.every((m) => m.category === 'design-and-creative'),
      'listByCategory returns only matching modules',
    );

    const empty = await mgr.listByCategory('nonexistent');
    assert(empty.length === 0, 'listByCategory returns empty for unknown category');
  }

  // --- CommunityModuleManager.getModuleByCode (with injected cache) ---
  {
    const { CommunityModuleManager } = require('../tools/installer/modules/community-manager');
    const mgr = new CommunityModuleManager();

    mgr._cachedIndex = {
      modules: [
        { name: 'test-mod', code: 'tm', display_name: 'Test Module' },
        { name: 'other-mod', code: 'om', display_name: 'Other Module' },
      ],
    };

    const found = await mgr.getModuleByCode('tm');
    assert(found !== null && found.code === 'tm', 'getModuleByCode finds existing module');

    const notFound = await mgr.getModuleByCode('xyz');
    assert(notFound === null, 'getModuleByCode returns null for unknown code');
  }

  console.log('');

  // ============================================================
  // Test Suite 34: RegistryClient GitHub API Cascade
  // ============================================================
  console.log(`${colors.yellow}Test Suite 34: RegistryClient GitHub API Cascade${colors.reset}\n`);

  {
    const { RegistryClient } = require('../tools/installer/modules/registry-client');

    // Build a RegistryClient with stubbed fetch paths so we can assert on cascade behavior
    // without making real network calls.
    function createStubbedClient({ apiResult, rawResult }) {
      const client = new RegistryClient();
      const calls = [];

      // Stub _fetchWithHeaders (GitHub API path)
      client._fetchWithHeaders = async (url) => {
        calls.push(`api:${url}`);
        if (apiResult instanceof Error) throw apiResult;
        return apiResult;
      };

      // Stub fetch (raw CDN path) — only intercept raw.githubusercontent.com calls
      const originalFetch = client.fetch.bind(client);
      client.fetch = async (url, timeout) => {
        if (url.includes('raw.githubusercontent.com')) {
          calls.push(`raw:${url}`);
          if (rawResult instanceof Error) throw rawResult;
          return rawResult;
        }
        return originalFetch(url, timeout);
      };

      return { client, calls };
    }

    // --- API success skips raw CDN ---
    {
      const { client, calls } = createStubbedClient({ apiResult: 'api-content', rawResult: 'raw-content' });
      const result = await client.fetchGitHubFile('owner', 'repo', 'path/file.txt', 'main');

      assert(result === 'api-content', 'RegistryClient API success returns API content');
      assert(calls.length === 1, 'RegistryClient API success makes exactly one call');
      assert(calls[0].startsWith('api:'), 'RegistryClient API success calls API endpoint');
    }

    // --- API failure falls back to raw CDN ---
    {
      const { client, calls } = createStubbedClient({ apiResult: new Error('HTTP 403'), rawResult: 'raw-content' });
      const result = await client.fetchGitHubFile('owner', 'repo', 'path/file.txt', 'main');

      assert(result === 'raw-content', 'RegistryClient API failure returns raw CDN content');
      assert(calls.length === 2, 'RegistryClient API failure makes two calls');
      assert(calls[0].startsWith('api:'), 'RegistryClient first call is to API');
      assert(calls[1].startsWith('raw:'), 'RegistryClient second call is to raw CDN');
    }

    // --- Both endpoints failing throws ---
    {
      const { client } = createStubbedClient({ apiResult: new Error('HTTP 403'), rawResult: new Error('HTTP 404') });
      let threw = false;
      try {
        await client.fetchGitHubFile('owner', 'repo', 'path/file.txt', 'main');
      } catch {
        threw = true;
      }
      assert(threw, 'RegistryClient both endpoints failing throws an error');
    }

    // --- API URL construction ---
    {
      const { client, calls } = createStubbedClient({ apiResult: 'content', rawResult: 'content' });
      await client.fetchGitHubFile('bmad-code-org', 'bmad-plugins-marketplace', 'registry/official.yaml', 'main');

      const apiCall = calls[0];
      assert(
        apiCall.includes('api.github.com/repos/bmad-code-org/bmad-plugins-marketplace/contents/registry/official.yaml'),
        'RegistryClient API URL contains correct path',
      );
      assert(apiCall.includes('ref=main'), 'RegistryClient API URL contains ref parameter');
    }

    // --- Raw CDN URL construction ---
    {
      const { client, calls } = createStubbedClient({ apiResult: new Error('fail'), rawResult: 'content' });
      await client.fetchGitHubFile('bmad-code-org', 'bmad-plugins-marketplace', 'registry/official.yaml', 'main');

      const rawCall = calls[1];
      assert(
        rawCall.includes('raw.githubusercontent.com/bmad-code-org/bmad-plugins-marketplace/main/registry/official.yaml'),
        'RegistryClient raw CDN URL contains correct path',
      );
    }

    // --- fetchGitHubYaml parses YAML ---
    {
      const yamlContent = 'modules:\n  - name: test\n    description: A test module\n';
      const { client } = createStubbedClient({ apiResult: yamlContent, rawResult: yamlContent });
      const result = await client.fetchGitHubYaml('owner', 'repo', 'file.yaml', 'main');

      assert(Array.isArray(result.modules), 'fetchGitHubYaml parses YAML correctly');
      assert(result.modules[0].name === 'test', 'fetchGitHubYaml preserves YAML values');
    }
  }

  console.log('');

  // ============================================================
  // Test Suite 35: Central Config Emission
  // ============================================================
  console.log(`${colors.yellow}Test Suite 35: Central Config Emission${colors.reset}\n`);

  {
    // Use the real src/ tree (core-skills + bmm-skills module.yaml are read via
    // getModulePath). Only the destination bmadDir is a temp dir, which the
    // installer writes config.toml / config.user.toml / custom/ into.
    const tempBmadDir35 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-central-config-'));

    try {
      const moduleConfigs = {
        core: {
          user_name: 'TestUser',
          communication_language: 'Spanish',
          document_output_language: 'English',
          output_folder: '_bmad-output',
        },
        bmm: {
          project_name: 'demo-project',
          user_skill_level: 'expert',
          planning_artifacts: '{project-root}/_bmad-output/planning-artifacts',
          implementation_artifacts: '{project-root}/_bmad-output/implementation-artifacts',
          project_knowledge: '{project-root}/docs',
          // Spread-from-core pollution: legacy per-module config.yaml merges
          // core values into every module; writeCentralConfig must strip these
          // from [modules.bmm] so core values only live in [core].
          user_name: 'TestUser',
          communication_language: 'Spanish',
          document_output_language: 'English',
          output_folder: '_bmad-output',
        },
        'external-mod': {
          // No src/modules/external-mod/module.yaml exists; installer treats
          // this as unknown-schema and falls through. Core-key stripping still
          // applies, so user_name/language must NOT appear under this module.
          custom_setting: 'external-value',
          another_setting: 'another-value',
          user_name: 'TestUser',
          communication_language: 'Spanish',
        },
      };

      const generator35 = new ManifestGenerator();
      generator35.bmadDir = tempBmadDir35;
      generator35.bmadFolderName = path.basename(tempBmadDir35);
      generator35.updatedModules = ['core', 'bmm', 'external-mod'];

      // collectAgentsFromModuleYaml reads from src/bmm-skills/module.yaml
      await generator35.collectAgentsFromModuleYaml();
      assert(generator35.agents.length >= 6, 'collectAgentsFromModuleYaml discovers bmm agents from module.yaml (>= 6 agents)');

      const maryEntry = generator35.agents.find((a) => a.code === 'bmad-agent-analyst');
      assert(maryEntry !== undefined, 'collectAgentsFromModuleYaml includes bmad-agent-analyst');
      assert(maryEntry && maryEntry.name === 'Mary', 'Agent entry carries name field');
      assert(maryEntry && maryEntry.title === 'Business Analyst', 'Agent entry carries title field');
      assert(maryEntry && maryEntry.icon === '📊', 'Agent entry carries icon field');
      assert(maryEntry && maryEntry.description.length > 0, 'Agent entry carries description field');
      assert(maryEntry && maryEntry.module === 'bmm', 'Agent entry module derives from owning module');
      assert(maryEntry && maryEntry.team === 'software-development', 'Agent entry carries explicit team from module.yaml');

      // writeCentralConfig produces the two root files
      const [teamPath, userPath] = await generator35.writeCentralConfig(tempBmadDir35, moduleConfigs);
      assert(teamPath === path.join(tempBmadDir35, 'config.toml'), 'writeCentralConfig returns team config path');
      assert(userPath === path.join(tempBmadDir35, 'config.user.toml'), 'writeCentralConfig returns user config path');
      assert(await fs.pathExists(teamPath), 'config.toml is written to disk');
      assert(await fs.pathExists(userPath), 'config.user.toml is written to disk');

      const teamContent = await fs.readFile(teamPath, 'utf8');
      const userContent = await fs.readFile(userPath, 'utf8');

      // [core] — team-scoped keys land in config.toml
      assert(teamContent.includes('[core]'), 'config.toml has [core] section');
      assert(teamContent.includes('document_output_language = "English"'), 'Team-scope core key lands in config.toml');
      assert(teamContent.includes('output_folder = "_bmad-output"'), 'Team-scope output_folder lands in config.toml');
      assert(!teamContent.includes('user_name'), 'user_name (scope: user) is absent from config.toml');
      assert(!teamContent.includes('communication_language'), 'communication_language (scope: user) is absent from config.toml');

      // [core] — user-scoped keys land in config.user.toml
      assert(userContent.includes('[core]'), 'config.user.toml has [core] section');
      assert(userContent.includes('user_name = "TestUser"'), 'user_name lands in config.user.toml');
      assert(userContent.includes('communication_language = "Spanish"'), 'communication_language lands in config.user.toml');
      assert(!userContent.includes('document_output_language'), 'Team-scope key is absent from config.user.toml');

      // [modules.bmm] — core-key pollution stripped; own user-scope key routed to user file
      const bmmTeamMatch = teamContent.match(/\[modules\.bmm\][\s\S]*?(?=\n\[|$)/);
      assert(bmmTeamMatch !== null, 'config.toml has [modules.bmm] section');
      if (bmmTeamMatch) {
        const bmmTeamBlock = bmmTeamMatch[0];
        assert(bmmTeamBlock.includes('project_name = "demo-project"'), 'bmm team-scope key lands under [modules.bmm]');
        assert(!bmmTeamBlock.includes('user_name'), 'user_name stripped from [modules.bmm] (core-key pollution)');
        assert(!bmmTeamBlock.includes('communication_language'), 'communication_language stripped from [modules.bmm]');
        assert(!bmmTeamBlock.includes('user_skill_level'), 'user_skill_level (scope: user) absent from [modules.bmm] in config.toml');
      }

      const bmmUserMatch = userContent.match(/\[modules\.bmm\][\s\S]*?(?=\n\[|$)/);
      assert(bmmUserMatch !== null, 'config.user.toml has [modules.bmm] section');
      if (bmmUserMatch) {
        assert(bmmUserMatch[0].includes('user_skill_level = "expert"'), 'user_skill_level lands in config.user.toml [modules.bmm]');
      }

      // [modules.external-mod] — unknown schema, falls through as team; core keys still stripped
      const extMatch = teamContent.match(/\[modules\.external-mod\][\s\S]*?(?=\n\[|$)/);
      assert(extMatch !== null, 'Unknown-schema module survives with its own [modules.*] section');
      if (extMatch) {
        const extBlock = extMatch[0];
        assert(extBlock.includes('custom_setting = "external-value"'), 'Unknown-schema module retains its own keys');
        assert(!extBlock.includes('user_name'), 'Core-key pollution stripped from unknown-schema module too');
        assert(!extBlock.includes('communication_language'), 'All core-key pollution stripped from unknown-schema module');
      }

      // [agents.*] — agent roster from bmm module.yaml baked into config.toml (team-only)
      assert(teamContent.includes('[agents.bmad-agent-analyst]'), 'config.toml has [agents.bmad-agent-analyst] table');
      assert(teamContent.includes('[agents.bmad-agent-dev]'), 'config.toml has [agents.bmad-agent-dev] table');
      assert(teamContent.includes('module = "bmm"'), 'Agent entry serializes module field');
      assert(teamContent.includes('team = "software-development"'), 'Agent entry serializes team field');
      assert(teamContent.includes('name = "Mary"'), 'Agent entry serializes name');
      assert(teamContent.includes('icon = "📊"'), 'Agent entry serializes icon');
      assert(!userContent.includes('[agents.'), '[agents.*] tables are never written to config.user.toml');

      // Header comments present on both files
      assert(teamContent.includes('Installer-managed. Regenerated on every install'), 'config.toml has installer-managed header');
      assert(userContent.includes('Holds install answers scoped to YOU personally.'), 'config.user.toml header clarifies user scope');
    } finally {
      await fs.remove(tempBmadDir35).catch(() => {});
    }
  }

  console.log('');

  // ============================================================
  // Test Suite 36: Custom Config Stubs
  // ============================================================
  console.log(`${colors.yellow}Test Suite 36: Custom Config Stubs${colors.reset}\n`);

  {
    const tempBmadDir36 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-custom-stubs-'));

    try {
      const generator36 = new ManifestGenerator();

      // First install: both stubs are created
      await generator36.ensureCustomConfigStubs(tempBmadDir36);

      const teamStub = path.join(tempBmadDir36, 'custom', 'config.toml');
      const userStub = path.join(tempBmadDir36, 'custom', 'config.user.toml');

      assert(await fs.pathExists(teamStub), 'ensureCustomConfigStubs creates custom/config.toml');
      assert(await fs.pathExists(userStub), 'ensureCustomConfigStubs creates custom/config.user.toml');

      // User writes content into the stub
      const userEdit = '# User edit\n[agents.kirk]\ndescription = "Enterprise captain"\n';
      await fs.writeFile(userStub, userEdit);

      // Second install: stubs are NOT overwritten
      await generator36.ensureCustomConfigStubs(tempBmadDir36);

      const preservedContent = await fs.readFile(userStub, 'utf8');
      assert(preservedContent === userEdit, 'ensureCustomConfigStubs does not overwrite user-edited custom/config.user.toml');
    } finally {
      await fs.remove(tempBmadDir36).catch(() => {});
    }
  }

  console.log('');

  // ============================================================
  // Test Suite 37: Agent Preservation for Non-Contributing Modules
  // ============================================================
  console.log(`${colors.yellow}Test Suite 37: Agent Preservation for Non-Contributing Modules${colors.reset}\n`);

  {
    // Scenario: quickUpdate preserves a module whose source isn't available
    // (e.g. external/marketplace). Its module.yaml isn't read, so its agents
    // aren't in this.agents. writeCentralConfig must read the prior config.toml
    // and keep those [agents.*] blocks so the roster doesn't silently shrink.
    const tempBmadDir37 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-agent-preserve-'));

    try {
      // Seed a prior config.toml with an agent from an external module
      const priorToml = [
        '# prior',
        '',
        '[agents.bmad-agent-analyst]',
        'module = "bmm"',
        'team = "bmm"',
        'name = "Stale Mary"',
        '',
        '[agents.external-hero]',
        'module = "external-mod"',
        'team = "external-mod"',
        'name = "Hero"',
        'title = "External Agent"',
        'icon = "🦸"',
        'description = "Ships with the marketplace module."',
        '',
      ].join('\n');
      await fs.writeFile(path.join(tempBmadDir37, 'config.toml'), priorToml);

      const generator37 = new ManifestGenerator();
      generator37.bmadDir = tempBmadDir37;
      generator37.bmadFolderName = path.basename(tempBmadDir37);
      generator37.updatedModules = ['core', 'bmm', 'external-mod'];

      // bmm source is available; external-mod is not — it's a preserved module
      await generator37.collectAgentsFromModuleYaml();
      const freshModules = new Set(generator37.agents.map((a) => a.module));
      assert(freshModules.has('bmm'), 'bmm contributes fresh agents from src module.yaml');
      assert(!freshModules.has('external-mod'), 'external-mod source is unavailable (preserved-module scenario)');

      await generator37.writeCentralConfig(tempBmadDir37, { core: {}, bmm: {}, 'external-mod': {} });

      const teamContent = await fs.readFile(path.join(tempBmadDir37, 'config.toml'), 'utf8');

      assert(
        teamContent.includes('[agents.external-hero]'),
        'Preserved [agents.external-hero] block survives rewrite even though external-mod source was unavailable',
      );
      assert(teamContent.includes('Ships with the marketplace module.'), 'Preserved block keeps its original description');
      assert(teamContent.includes('module = "external-mod"'), 'Preserved block keeps its module field');

      // Freshly collected agents win over stale entries with the same code
      const maryMatches = teamContent.match(/\[agents\.bmad-agent-analyst\]/g) || [];
      assert(maryMatches.length === 1, 'bmad-agent-analyst emitted exactly once (fresh wins; stale not duplicated)');
      assert(!teamContent.includes('Stale Mary'), 'Stale name from prior config.toml is discarded when fresh module.yaml is read');
    } finally {
      await fs.remove(tempBmadDir37).catch(() => {});
    }
  }

  console.log('');

  // ============================================================
  // Test Suite 38: External-Module Agent Resolution
  // ============================================================
  console.log(`${colors.yellow}Test Suite 38: External-Module Agent Resolution${colors.reset}\n`);

  {
    // Scenario: external official modules (bmb, cis, gds, ...) are cloned into
    // ~/.bmad/cache/external-modules/<name>/ — NOT copied into src/modules/.
    // collectAgentsFromModuleYaml must resolve them from the cache or their
    // agent roster silently vanishes from config.toml.
    const tempCacheDir38 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-ext-cache-'));
    const tempBmadDir38 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-ext-install-'));
    const priorCacheEnv = process.env.BMAD_EXTERNAL_MODULES_CACHE;
    process.env.BMAD_EXTERNAL_MODULES_CACHE = tempCacheDir38;

    try {
      // Seed a fake external module with agents at cache/<mod>/src/module.yaml —
      // matches the real CIS layout.
      const extSrcDir = path.join(tempCacheDir38, 'fake-ext', 'src');
      await fs.ensureDir(extSrcDir);
      await fs.writeFile(
        path.join(extSrcDir, 'module.yaml'),
        [
          'code: fake-ext',
          'name: "Fake External Module"',
          'agents:',
          '  - code: bmad-fake-ext-agent-one',
          '    name: Ext-One',
          '    title: External Agent One',
          '    icon: "🧪"',
          '    team: fake',
          '    description: "First fake external agent."',
          '  - code: bmad-fake-ext-agent-two',
          '    name: Ext-Two',
          '    title: External Agent Two',
          '    icon: "🧬"',
          '    team: fake',
          '    description: "Second fake external agent."',
          '',
        ].join('\n'),
      );

      // Second fake module at cache/<mod>/skills/module.yaml — matches bmb layout.
      const extSkillsDir = path.join(tempCacheDir38, 'fake-skills', 'skills');
      await fs.ensureDir(extSkillsDir);
      await fs.writeFile(
        path.join(extSkillsDir, 'module.yaml'),
        [
          'code: fake-skills',
          'name: "Fake Skills-Layout Module"',
          'agents:',
          '  - code: bmad-fake-skills-agent',
          '    name: SkillsHero',
          '    title: Skills Layout Agent',
          '    icon: "🛠️"',
          '    team: fake-skills',
          '    description: "Lives under skills/ not src/."',
          '',
        ].join('\n'),
      );

      const generator38 = new ManifestGenerator();
      generator38.bmadDir = tempBmadDir38;
      generator38.bmadFolderName = path.basename(tempBmadDir38);
      generator38.updatedModules = ['core', 'bmm', 'fake-ext', 'fake-skills'];

      await generator38.collectAgentsFromModuleYaml();

      const byCode = new Map(generator38.agents.map((a) => [a.code, a]));
      assert(byCode.has('bmad-fake-ext-agent-one'), 'external module at cache/<name>/src resolves and contributes agent one');
      assert(byCode.has('bmad-fake-ext-agent-two'), 'external module at cache/<name>/src resolves and contributes agent two');
      assert(byCode.has('bmad-fake-skills-agent'), 'external module at cache/<name>/skills layout also resolves');
      assert(byCode.get('bmad-fake-ext-agent-one').module === 'fake-ext', 'agent.module matches the owning external module name');
      assert(byCode.get('bmad-fake-ext-agent-one').team === 'fake', 'explicit team from module.yaml is preserved');

      await generator38.writeCentralConfig(tempBmadDir38, {
        core: {},
        bmm: {},
        'fake-ext': {},
        'fake-skills': {},
      });

      const teamContent = await fs.readFile(path.join(tempBmadDir38, 'config.toml'), 'utf8');
      assert(teamContent.includes('[agents.bmad-fake-ext-agent-one]'), 'external-module agents land in config.toml [agents.*] section');
      assert(teamContent.includes('[agents.bmad-fake-skills-agent]'), 'skills-layout external module agents also land in config.toml');
      assert(teamContent.includes('First fake external agent.'), 'agent description from external module.yaml is written');
    } finally {
      if (priorCacheEnv === undefined) {
        delete process.env.BMAD_EXTERNAL_MODULES_CACHE;
      } else {
        process.env.BMAD_EXTERNAL_MODULES_CACHE = priorCacheEnv;
      }
      await fs.remove(tempCacheDir38).catch(() => {});
      await fs.remove(tempBmadDir38).catch(() => {});
    }
  }

  console.log('');

  // ============================================================
  // Test Suite 39: Module Version Resolution
  // ============================================================
  console.log(`${colors.yellow}Test Suite 39: Module Version Resolution${colors.reset}\n`);

  // --- package.json beats module.yaml and marketplace.json for cached external modules ---
  {
    const { resolveModuleVersion } = require('../tools/installer/modules/version-resolver');
    const tempCacheDir39 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-version-cache-'));
    const priorCacheEnv39 = process.env.BMAD_EXTERNAL_MODULES_CACHE;
    process.env.BMAD_EXTERNAL_MODULES_CACHE = tempCacheDir39;

    try {
      const moduleRoot = path.join(tempCacheDir39, 'tea');
      const moduleSrc = path.join(moduleRoot, 'src');
      await fs.ensureDir(path.join(moduleRoot, '.claude-plugin'));
      await fs.ensureDir(moduleSrc);

      await fs.writeFile(
        path.join(moduleRoot, 'package.json'),
        JSON.stringify({ name: 'bmad-method-test-architecture-enterprise', version: '1.12.3' }, null, 2) + '\n',
      );
      await fs.writeFile(
        path.join(moduleSrc, 'module.yaml'),
        ['code: tea', 'name: Test Architect', 'module_version: 1.11.0', ''].join('\n'),
      );
      await fs.writeFile(
        path.join(moduleRoot, '.claude-plugin', 'marketplace.json'),
        JSON.stringify({ plugins: [{ name: 'tea', version: '1.7.2' }] }, null, 2) + '\n',
      );

      const versionInfo = await resolveModuleVersion('tea');
      assert(versionInfo.version === '1.12.3', 'resolver prefers cached package.json over stale marketplace metadata for external modules');
      assert(versionInfo.source === 'package.json', 'resolver reports package.json as the winning metadata source');
    } finally {
      if (priorCacheEnv39 === undefined) {
        delete process.env.BMAD_EXTERNAL_MODULES_CACHE;
      } else {
        process.env.BMAD_EXTERNAL_MODULES_CACHE = priorCacheEnv39;
      }
      await fs.remove(tempCacheDir39).catch(() => {});
    }
  }

  // --- module.yaml is used when package.json is absent ---
  {
    const { resolveModuleVersion } = require('../tools/installer/modules/version-resolver');
    const tempRepo39 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-version-module-yaml-'));
    const tempCacheDir39 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-version-module-yaml-cache-'));
    const priorCacheEnv39 = process.env.BMAD_EXTERNAL_MODULES_CACHE;
    process.env.BMAD_EXTERNAL_MODULES_CACHE = tempCacheDir39;

    try {
      const moduleDir = path.join(tempRepo39, 'src');
      await fs.ensureDir(path.join(tempRepo39, '.claude-plugin'));
      await fs.ensureDir(moduleDir);

      await fs.writeFile(path.join(moduleDir, 'module.yaml'), ['code: sample-mod', 'module_version: 2.4.0', ''].join('\n'));
      await fs.writeFile(
        path.join(tempRepo39, '.claude-plugin', 'marketplace.json'),
        JSON.stringify({ plugins: [{ name: 'sample-mod', version: '1.7.2' }] }, null, 2) + '\n',
      );

      const versionInfo = await resolveModuleVersion('sample-mod', { moduleSourcePath: moduleDir });
      assert(versionInfo.version === '2.4.0', 'resolver falls back to module.yaml when package.json is missing');
      assert(versionInfo.source === 'module.yaml', 'resolver reports module.yaml when it provides the selected version');
    } finally {
      if (priorCacheEnv39 === undefined) {
        delete process.env.BMAD_EXTERNAL_MODULES_CACHE;
      } else {
        process.env.BMAD_EXTERNAL_MODULES_CACHE = priorCacheEnv39;
      }
      await fs.remove(tempRepo39).catch(() => {});
      await fs.remove(tempCacheDir39).catch(() => {});
    }
  }

  // --- marketplace fallback uses semver-aware comparison ---
  {
    const { resolveModuleVersion } = require('../tools/installer/modules/version-resolver');
    const tempRepo39 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-version-marketplace-'));
    const tempCacheDir39 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-version-marketplace-cache-'));
    const priorCacheEnv39 = process.env.BMAD_EXTERNAL_MODULES_CACHE;
    process.env.BMAD_EXTERNAL_MODULES_CACHE = tempCacheDir39;

    try {
      const moduleDir = path.join(tempRepo39, 'src');
      await fs.ensureDir(path.join(tempRepo39, '.claude-plugin'));
      await fs.ensureDir(moduleDir);

      await fs.writeFile(
        path.join(tempRepo39, '.claude-plugin', 'marketplace.json'),
        JSON.stringify(
          {
            plugins: [
              { name: 'older-plugin', version: '1.7.2' },
              { name: 'newer-plugin', version: '1.12.3' },
            ],
          },
          null,
          2,
        ) + '\n',
      );

      const versionInfo = await resolveModuleVersion('missing-plugin', { moduleSourcePath: moduleDir });
      assert(
        versionInfo.version === '1.12.3',
        'resolver picks the highest marketplace fallback version using semver instead of string comparison',
      );
      assert(versionInfo.source === 'marketplace.json', 'resolver reports marketplace.json when it is the only usable metadata source');
    } finally {
      if (priorCacheEnv39 === undefined) {
        delete process.env.BMAD_EXTERNAL_MODULES_CACHE;
      } else {
        process.env.BMAD_EXTERNAL_MODULES_CACHE = priorCacheEnv39;
      }
      await fs.remove(tempRepo39).catch(() => {});
      await fs.remove(tempCacheDir39).catch(() => {});
    }
  }

  // --- package.json lookup must not escape the module repo boundary ---
  {
    const { resolveModuleVersion } = require('../tools/installer/modules/version-resolver');
    const tempHost39 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-version-boundary-host-'));
    const tempCacheDir39 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-version-boundary-cache-'));
    const priorCacheEnv39 = process.env.BMAD_EXTERNAL_MODULES_CACHE;
    process.env.BMAD_EXTERNAL_MODULES_CACHE = tempCacheDir39;

    try {
      const moduleRoot = path.join(tempHost39, 'nested-module');
      const moduleDir = path.join(moduleRoot, 'src');
      await fs.ensureDir(path.join(moduleRoot, '.claude-plugin'));
      await fs.ensureDir(moduleDir);

      await fs.writeFile(path.join(tempHost39, 'package.json'), JSON.stringify({ name: 'host-project', version: '9.9.9' }, null, 2) + '\n');
      await fs.writeFile(path.join(moduleDir, 'module.yaml'), ['code: sample-mod', 'module_version: 2.4.0', ''].join('\n'));
      await fs.writeFile(
        path.join(moduleRoot, '.claude-plugin', 'marketplace.json'),
        JSON.stringify({ plugins: [{ name: 'sample-mod', version: '1.7.2' }] }, null, 2) + '\n',
      );

      const versionInfo = await resolveModuleVersion('sample-mod', { moduleSourcePath: moduleDir });
      assert(versionInfo.version === '2.4.0', 'resolver does not read a host project package.json outside the module repo boundary');
      assert(versionInfo.source === 'module.yaml', 'resolver stops at the module repo boundary before climbing into host project metadata');
    } finally {
      if (priorCacheEnv39 === undefined) {
        delete process.env.BMAD_EXTERNAL_MODULES_CACHE;
      } else {
        process.env.BMAD_EXTERNAL_MODULES_CACHE = priorCacheEnv39;
      }
      await fs.remove(tempHost39).catch(() => {});
      await fs.remove(tempCacheDir39).catch(() => {});
    }
  }

  // --- Manifest uses the shared resolver for external modules ---
  {
    const { Manifest } = require('../tools/installer/core/manifest');
    const { ExternalModuleManager } = require('../tools/installer/modules/external-manager');
    const tempCacheDir39 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-manifest-version-cache-'));
    const tempBmadDir39 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-manifest-version-install-'));
    const priorCacheEnv39 = process.env.BMAD_EXTERNAL_MODULES_CACHE;
    const originalLoadConfig39 = ExternalModuleManager.prototype.loadExternalModulesConfig;
    process.env.BMAD_EXTERNAL_MODULES_CACHE = tempCacheDir39;

    ExternalModuleManager.prototype.loadExternalModulesConfig = async function () {
      return {
        modules: [
          {
            code: 'tea',
            name: 'Test Architect',
            repository: 'https://example.com/tea.git',
            module_definition: 'src/module.yaml',
            npm_package: 'bmad-method-test-architecture-enterprise',
          },
        ],
      };
    };

    try {
      const moduleRoot = path.join(tempCacheDir39, 'tea');
      const moduleSrc = path.join(moduleRoot, 'src');
      await fs.ensureDir(path.join(moduleRoot, '.claude-plugin'));
      await fs.ensureDir(moduleSrc);

      await fs.writeFile(
        path.join(moduleRoot, 'package.json'),
        JSON.stringify({ name: 'bmad-method-test-architecture-enterprise', version: '1.12.3' }, null, 2) + '\n',
      );
      await fs.writeFile(path.join(moduleSrc, 'module.yaml'), ['code: tea', 'module_version: 1.11.0', ''].join('\n'));
      await fs.writeFile(
        path.join(moduleRoot, '.claude-plugin', 'marketplace.json'),
        JSON.stringify({ plugins: [{ name: 'tea', version: '1.7.2' }] }, null, 2) + '\n',
      );

      const manifest39 = new Manifest();
      const versionInfo = await manifest39.getModuleVersionInfo('tea', tempBmadDir39, moduleSrc);

      assert(versionInfo.version === '1.12.3', 'manifest version info prefers external package.json over stale marketplace metadata');
      assert(versionInfo.source === 'external', 'manifest preserves external source classification while using the shared resolver');
      assert(
        versionInfo.npmPackage === 'bmad-method-test-architecture-enterprise',
        'manifest preserves npm package metadata for external modules',
      );
    } finally {
      ExternalModuleManager.prototype.loadExternalModulesConfig = originalLoadConfig39;
      if (priorCacheEnv39 === undefined) {
        delete process.env.BMAD_EXTERNAL_MODULES_CACHE;
      } else {
        process.env.BMAD_EXTERNAL_MODULES_CACHE = priorCacheEnv39;
      }
      await fs.remove(tempCacheDir39).catch(() => {});
      await fs.remove(tempBmadDir39).catch(() => {});
    }
  }

  // --- Update checks should not advertise npm downgrades when source installs are newer ---
  {
    const { Manifest } = require('../tools/installer/core/manifest');
    const manifest39 = new Manifest();
    const originalGetAllModuleVersions39 = manifest39.getAllModuleVersions.bind(manifest39);
    const originalFetchNpmVersion39 = manifest39.fetchNpmVersion.bind(manifest39);

    manifest39.getAllModuleVersions = async () => [
      {
        name: 'tea',
        version: '1.12.3',
        npmPackage: 'bmad-method-test-architecture-enterprise',
      },
    ];
    manifest39.fetchNpmVersion = async () => '1.7.2';

    try {
      const updates = await manifest39.checkForUpdates('/unused');
      assert(updates.length === 0, 'update check ignores older npm versions when installed source metadata is newer');
    } finally {
      manifest39.getAllModuleVersions = originalGetAllModuleVersions39;
      manifest39.fetchNpmVersion = originalFetchNpmVersion39;
    }
  }

  // --- Update checks ignore non-semver version strings instead of flagging false positives ---
  {
    const { Manifest } = require('../tools/installer/core/manifest');
    const manifest39 = new Manifest();
    const originalGetAllModuleVersions39 = manifest39.getAllModuleVersions.bind(manifest39);
    const originalFetchNpmVersion39 = manifest39.fetchNpmVersion.bind(manifest39);

    manifest39.getAllModuleVersions = async () => [
      {
        name: 'tea',
        version: 'workspace-build',
        npmPackage: 'bmad-method-test-architecture-enterprise',
      },
    ];
    manifest39.fetchNpmVersion = async () => 'latest-build';

    try {
      const updates = await manifest39.checkForUpdates('/unused');
      assert(updates.length === 0, 'update check ignores non-semver version strings instead of reporting misleading updates');
    } finally {
      manifest39.getAllModuleVersions = originalGetAllModuleVersions39;
      manifest39.fetchNpmVersion = originalFetchNpmVersion39;
    }
  }

  // --- Official module picker uses git tags for external module labels ---
  {
    const { UI } = require('../tools/installer/ui');
    const prompts = require('../tools/installer/prompts');
    const channelResolver = require('../tools/installer/modules/channel-resolver');
    const { ExternalModuleManager } = require('../tools/installer/modules/external-manager');

    const ui = new UI();
    const originalOfficialListAvailable39 = OfficialModules.prototype.listAvailable;
    const originalExternalListAvailable39 = ExternalModuleManager.prototype.listAvailable;
    const originalAutocomplete39 = prompts.autocompleteMultiselect;
    const originalSpinner39 = prompts.spinner;
    const originalWarn39 = prompts.log.warn;
    const originalMessage39 = prompts.log.message;
    const originalResolveChannel39 = channelResolver.resolveChannel;

    const seenLabels39 = [];
    const spinnerStarts39 = [];
    const spinnerStops39 = [];
    const warnings39 = [];

    OfficialModules.prototype.listAvailable = async function () {
      return {
        modules: [
          {
            id: 'core',
            name: 'BMad Core Module',
            description: 'always installed',
            defaultSelected: true,
          },
        ],
      };
    };

    ExternalModuleManager.prototype.listAvailable = async function () {
      return [
        {
          code: 'bmb',
          name: 'BMad Builder',
          description: 'Builder module',
          defaultSelected: false,
          builtIn: false,
          url: 'https://github.com/bmad-code-org/bmad-builder',
          defaultChannel: 'stable',
        },
        {
          code: 'tea',
          name: 'Test Architect',
          description: 'Test architecture module',
          defaultSelected: false,
          builtIn: false,
          url: 'https://github.com/bmad-code-org/bmad-method-test-architecture-enterprise',
          defaultChannel: 'stable',
        },
      ];
    };

    channelResolver.resolveChannel = async function ({ repoUrl, channel }) {
      if (channel !== 'stable') {
        return { channel, version: channel === 'next' ? 'main' : 'unknown' };
      }
      if (repoUrl.includes('bmad-builder')) {
        return { channel: 'stable', version: 'v1.7.0', ref: 'v1.7.0', resolvedFallback: false };
      }
      if (repoUrl.includes('bmad-method-test-architecture-enterprise')) {
        return { channel: 'stable', version: 'v1.15.0', ref: 'v1.15.0', resolvedFallback: false };
      }
      throw new Error(`unexpected repo ${repoUrl}`);
    };

    prompts.autocompleteMultiselect = async (options) => {
      seenLabels39.push(...options.options.map((opt) => opt.label));
      return ['core'];
    };
    prompts.spinner = async () => ({
      start(message) {
        spinnerStarts39.push(message);
      },
      stop(message) {
        spinnerStops39.push(message);
      },
      error(message) {
        spinnerStops39.push(`error:${message}`);
      },
    });
    prompts.log.warn = async (message) => {
      warnings39.push(message);
    };
    prompts.log.message = async () => {};

    try {
      await ui._selectOfficialModules(
        new Set(['bmb']),
        new Map([
          ['bmb', '1.1.0'],
          ['core', '6.2.0'],
        ]),
        { global: null, nextSet: new Set(), pins: new Map(), warnings: [] },
      );

      assert(
        seenLabels39.includes('BMad Builder (v1.1.0 → v1.7.0)'),
        'official module picker shows installed-to-latest arrow from git tags',
      );
      assert(seenLabels39.includes('Test Architect (v1.15.0)'), 'official module picker shows latest git-tag version for fresh installs');
      assert(
        spinnerStarts39.includes('Checking latest module versions...'),
        'official module picker wraps external lookups in a single spinner',
      );
      assert(spinnerStops39.includes('Checked latest module versions.'), 'official module picker stops the version-check spinner');
      assert(warnings39.length === 0, 'official module picker does not warn when tag lookups succeed');
    } finally {
      OfficialModules.prototype.listAvailable = originalOfficialListAvailable39;
      ExternalModuleManager.prototype.listAvailable = originalExternalListAvailable39;
      prompts.autocompleteMultiselect = originalAutocomplete39;
      prompts.spinner = originalSpinner39;
      prompts.log.warn = originalWarn39;
      prompts.log.message = originalMessage39;
      channelResolver.resolveChannel = originalResolveChannel39;
    }
  }

  // --- Official module picker warns and falls back to cached versions when tag lookups fail ---
  {
    const { UI } = require('../tools/installer/ui');
    const prompts = require('../tools/installer/prompts');
    const channelResolver = require('../tools/installer/modules/channel-resolver');
    const { ExternalModuleManager } = require('../tools/installer/modules/external-manager');

    const ui = new UI();
    const tempCacheDir39 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-picker-cache-'));
    const priorCacheEnv39 = process.env.BMAD_EXTERNAL_MODULES_CACHE;
    const originalOfficialListAvailable39 = OfficialModules.prototype.listAvailable;
    const originalExternalListAvailable39 = ExternalModuleManager.prototype.listAvailable;
    const originalAutocomplete39 = prompts.autocompleteMultiselect;
    const originalSpinner39 = prompts.spinner;
    const originalWarn39 = prompts.log.warn;
    const originalMessage39 = prompts.log.message;
    const originalResolveChannel39 = channelResolver.resolveChannel;

    const seenLabels39 = [];
    const warnings39 = [];

    process.env.BMAD_EXTERNAL_MODULES_CACHE = tempCacheDir39;
    await fs.ensureDir(path.join(tempCacheDir39, 'bmb'));
    await fs.writeFile(
      path.join(tempCacheDir39, 'bmb', 'package.json'),
      JSON.stringify({ name: 'bmad-builder', version: '1.7.0' }, null, 2) + '\n',
    );

    OfficialModules.prototype.listAvailable = async function () {
      return {
        modules: [
          {
            id: 'core',
            name: 'BMad Core Module',
            description: 'always installed',
            defaultSelected: true,
          },
        ],
      };
    };

    ExternalModuleManager.prototype.listAvailable = async function () {
      return [
        {
          code: 'bmb',
          name: 'BMad Builder',
          description: 'Builder module',
          defaultSelected: false,
          builtIn: false,
          url: 'https://github.com/bmad-code-org/bmad-builder',
          defaultChannel: 'stable',
        },
      ];
    };

    channelResolver.resolveChannel = async function () {
      throw new Error('tag lookup unavailable');
    };

    prompts.autocompleteMultiselect = async (options) => {
      seenLabels39.push(...options.options.map((opt) => opt.label));
      return ['core'];
    };
    prompts.spinner = async () => ({
      start() {},
      stop() {},
      error() {},
    });
    prompts.log.warn = async (message) => {
      warnings39.push(message);
    };
    prompts.log.message = async () => {};

    try {
      await ui._selectOfficialModules(new Set(), new Map(), { global: null, nextSet: new Set(), pins: new Map(), warnings: [] });

      assert(
        seenLabels39.includes('BMad Builder (v1.7.0)'),
        'official module picker falls back to cached/local versions when tag lookup fails',
      );
      assert(
        warnings39.includes('Could not check latest module versions; showing cached/local versions.'),
        'official module picker warns once when all latest-version lookups fail',
      );
    } finally {
      OfficialModules.prototype.listAvailable = originalOfficialListAvailable39;
      ExternalModuleManager.prototype.listAvailable = originalExternalListAvailable39;
      prompts.autocompleteMultiselect = originalAutocomplete39;
      prompts.spinner = originalSpinner39;
      prompts.log.warn = originalWarn39;
      prompts.log.message = originalMessage39;
      channelResolver.resolveChannel = originalResolveChannel39;
      if (priorCacheEnv39 === undefined) {
        delete process.env.BMAD_EXTERNAL_MODULES_CACHE;
      } else {
        process.env.BMAD_EXTERNAL_MODULES_CACHE = priorCacheEnv39;
      }
      await fs.remove(tempCacheDir39).catch(() => {});
    }
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
