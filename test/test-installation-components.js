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

    assert(windsurfInstaller?.target_dir === '.agents/skills', 'Windsurf target_dir uses native skills path');

    const tempProjectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-windsurf-test-'));
    const installedBmadDir = await createTestBmadFixture();

    const ideManager = new IdeManager();
    await ideManager.ensureInitialized();
    const result = await ideManager.setup('windsurf', tempProjectDir, installedBmadDir, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result.success === true, 'Windsurf setup succeeds against temp project');

    const skillFile = path.join(tempProjectDir, '.agents', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile), 'Windsurf install writes SKILL.md directory output');

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

    const tempProjectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-kiro-test-'));
    const installedBmadDir = await createTestBmadFixture();

    const ideManager = new IdeManager();
    await ideManager.ensureInitialized();
    const result = await ideManager.setup('kiro', tempProjectDir, installedBmadDir, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result.success === true, 'Kiro setup succeeds against temp project');

    const skillFile = path.join(tempProjectDir, '.kiro', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile), 'Kiro install writes SKILL.md directory output');

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

    const tempProjectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-antigravity-test-'));
    const installedBmadDir = await createTestBmadFixture();

    const ideManager = new IdeManager();
    await ideManager.ensureInitialized();
    const result = await ideManager.setup('antigravity', tempProjectDir, installedBmadDir, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result.success === true, 'Antigravity setup succeeds against temp project');

    const skillFile = path.join(tempProjectDir, '.agent', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile), 'Antigravity install writes SKILL.md directory output');

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

    assert(auggieInstaller?.target_dir === '.agents/skills', 'Auggie target_dir uses native skills path');

    assert(
      auggieInstaller?.ancestor_conflict_check !== true,
      'Auggie installer does not enable ancestor conflict checks without verified inheritance',
    );

    const tempProjectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-auggie-test-'));
    const installedBmadDir = await createTestBmadFixture();

    const ideManager = new IdeManager();
    await ideManager.ensureInitialized();
    const result = await ideManager.setup('auggie', tempProjectDir, installedBmadDir, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result.success === true, 'Auggie setup succeeds against temp project');

    const skillFile = path.join(tempProjectDir, '.agents', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile), 'Auggie install writes SKILL.md directory output');

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

    assert(opencodeInstaller?.target_dir === '.agents/skills', 'OpenCode target_dir uses native skills path');
    assert(
      opencodeInstaller?.commands_target_dir === '.opencode/commands',
      'OpenCode commands_target_dir is configured for /<skill> slash commands',
    );

    const tempProjectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-opencode-test-'));
    const installedBmadDir = await createTestBmadFixture();

    const ideManager = new IdeManager();
    await ideManager.ensureInitialized();
    const result = await ideManager.setup('opencode', tempProjectDir, installedBmadDir, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result.success === true, 'OpenCode setup succeeds against temp project');

    const skillFile = path.join(tempProjectDir, '.agents', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile), 'OpenCode install writes SKILL.md directory output');

    // Command pointer assertions: a /<canonicalId> slash command should exist
    // for each installed skill so users can invoke skills directly without
    // going through the /skills menu.
    const commandFile = path.join(tempProjectDir, '.opencode', 'commands', 'bmad-master.md');
    assert(await fs.pathExists(commandFile), 'OpenCode install writes per-skill command pointer file');

    const commandContent = await fs.readFile(commandFile, 'utf8');
    assert(commandContent.includes('@skills/bmad-master'), 'Command pointer body references the skill via @skills/<canonicalId>');
    assert(commandContent.includes('description:'), 'Command pointer carries a description in YAML frontmatter');

    // Idempotency: re-running install must not duplicate or rewrite pointers.
    const result2 = await ideManager.setup('opencode', tempProjectDir, installedBmadDir, {
      silent: true,
      selectedModules: ['bmm'],
    });
    assert(result2.success === true, 'Second OpenCode install succeeds (idempotent)');
    assert(await fs.pathExists(commandFile), 'Command pointer survives a second install pass');

    // Description-update propagation: when the manifest description changes
    // and the on-disk pointer still matches the generator pattern, refresh
    // the file so users see the updated description.
    const csvPath = path.join(installedBmadDir, '_config', 'skill-manifest.csv');
    const updatedCsv =
      'canonicalId,name,description,module,path\n' +
      '"bmad-master","bmad-master","UPDATED description for the test agent","core","_bmad/core/bmad-master/SKILL.md"\n';
    await fs.writeFile(csvPath, updatedCsv);
    const result3 = await ideManager.setup('opencode', tempProjectDir, installedBmadDir, {
      silent: true,
      selectedModules: ['bmm'],
    });
    assert(result3.success === true, 'Third OpenCode install succeeds after description update');
    const refreshed = await fs.readFile(commandFile, 'utf8');
    assert(refreshed.includes('UPDATED description'), 'Generator-shaped pointer is refreshed when manifest description changes');

    // Hand-edit preservation across the production install flow. The
    // installer passes previousSkillIds — without the cleanup-side spare,
    // hand edits would be wiped here.
    const SENTINEL = 'HAND_EDITED_BY_USER_SHOULD_SURVIVE';
    const handEditedBody = `---\ndescription: my custom description\n---\n\n${SENTINEL}\n`;
    await fs.writeFile(commandFile, handEditedBody);
    const result4 = await ideManager.setup('opencode', tempProjectDir, installedBmadDir, {
      silent: true,
      selectedModules: ['bmm'],
      previousSkillIds: new Set(['bmad-master']),
    });
    assert(result4.success === true, 'Fourth OpenCode install succeeds with hand-edited pointer present');
    const afterReinstall = await fs.readFile(commandFile, 'utf8');
    assert(afterReinstall.includes(SENTINEL), 'Hand-edited pointer survives a routine reinstall (cleanup spares active-manifest IDs)');

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

    const tempProjectDir9 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-claude-code-test-'));
    const installedBmadDir9 = await createTestBmadFixture();

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

    const tempProjectDir11 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-codex-test-'));
    const installedBmadDir11 = await createTestBmadFixture();

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

    assert(cursorInstaller?.target_dir === '.agents/skills', 'Cursor target_dir uses native skills path');

    assert(!cursorInstaller?.ancestor_conflict_check, 'Cursor installer does not enable ancestor conflict checks');

    const tempProjectDir13c = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-cursor-test-'));
    const installedBmadDir13c = await createTestBmadFixture();

    const ideManager13c = new IdeManager();
    await ideManager13c.ensureInitialized();
    const result13c = await ideManager13c.setup('cursor', tempProjectDir13c, installedBmadDir13c, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result13c.success === true, 'Cursor setup succeeds against temp project');

    const skillFile13c = path.join(tempProjectDir13c, '.agents', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile13c), 'Cursor install writes SKILL.md directory output');

    // Verify name frontmatter matches directory name
    const skillContent13c = await fs.readFile(skillFile13c, 'utf8');
    const nameMatch13c = skillContent13c.match(/^name:\s*(.+)$/m);
    assert(nameMatch13c && nameMatch13c[1].trim() === 'bmad-master', 'Cursor skill name frontmatter matches directory name exactly');

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

    assert(rooInstaller?.target_dir === '.agents/skills', 'Roo target_dir uses native skills path');

    const tempProjectDir13 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-roo-test-'));
    const installedBmadDir13 = await createTestBmadFixture();

    const ideManager13 = new IdeManager();
    await ideManager13.ensureInitialized();
    const result13 = await ideManager13.setup('roo', tempProjectDir13, installedBmadDir13, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result13.success === true, 'Roo setup succeeds against temp project');

    const skillFile13 = path.join(tempProjectDir13, '.agents', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile13), 'Roo install writes SKILL.md directory output');

    // Verify name frontmatter matches directory name (Roo constraint: lowercase alphanumeric + hyphens)
    const skillContent13 = await fs.readFile(skillFile13, 'utf8');
    const nameMatch13 = skillContent13.match(/^name:\s*(.+)$/m);
    assert(
      nameMatch13 && nameMatch13[1].trim() === 'bmad-master',
      'Roo skill name frontmatter matches directory name exactly (lowercase alphanumeric + hyphens)',
    );

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

    assert(copilotInstaller?.target_dir === '.agents/skills', 'GitHub Copilot target_dir uses native skills path');
    assert(
      copilotInstaller?.commands_target_dir === '.github/agents',
      'GitHub Copilot commands_target_dir is configured for the Custom Agents picker',
    );
    assert(copilotInstaller?.commands_extension === '.agent.md', 'GitHub Copilot uses .agent.md extension for Custom Agents files');
    assert(
      typeof copilotInstaller?.commands_body_template === 'string' && copilotInstaller.commands_body_template.includes('{canonicalId}'),
      'GitHub Copilot defines a commands_body_template with {canonicalId} placeholder',
    );
    assert(
      copilotInstaller?.commands_filter === 'agents-only',
      'GitHub Copilot filters Custom Agents picker to persona agents only (agents-only)',
    );

    const tempProjectDir17 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-copilot-test-'));
    const installedBmadDir17 = await createTestBmadFixture();

    // Extend the fixture to exercise the agents-only filter, which detects
    // persona agents by the `[agent]` section in each skill's source
    // customize.toml. Five skill types covered:
    //
    //   1. Persona agent — has customize.toml with [agent]      → INCLUDED
    //   2. Persona with non-conventional id — also has [agent]   → INCLUDED
    //      (verifies the filter doesn't depend on `-agent-` naming)
    //   3. Meta-skill whose id contains `-agent-` but isn't a
    //      persona — has customize.toml with [workflow]          → EXCLUDED
    //      (mirrors `bmad-agent-builder` in the real manifest)
    //   4. Workflow skill — no customize.toml at all             → EXCLUDED
    //   5. `bmad-help` — meta-help skill with no customize.toml;
    //      every persona agent's activation already advertises it,
    //      so it's correctly excluded from the picker as redundant    → EXCLUDED
    const fixtureCsvPath17 = path.join(installedBmadDir17, '_config', 'skill-manifest.csv');
    await fs.writeFile(
      fixtureCsvPath17,
      [
        'canonicalId,name,description,module,path',
        '"bmad-master","bmad-master","Workflow with no customize.toml — should NOT appear in Copilot agents picker","core","_bmad/core/bmad-master/SKILL.md"',
        '"bmad-agent-fixture","bmad-agent-fixture","Persona agent — customize.toml has [agent], SHOULD appear","core","_bmad/core/bmad-agent-fixture/SKILL.md"',
        '"bmad-tea","bmad-tea","Non-conventional id but [agent] in customize.toml — SHOULD appear","core","_bmad/core/bmad-tea/SKILL.md"',
        '"bmad-agent-builder","bmad-agent-builder","Skill-builder workflow — id contains -agent- but customize.toml has [workflow] — should NOT appear","core","_bmad/core/bmad-agent-builder/SKILL.md"',
        '"bmad-help","bmad-help","Meta-help skill — no customize.toml; SHOULD NOT appear in agents picker (toml-driven filter)","core","_bmad/core/bmad-help/SKILL.md"',
        '',
      ].join('\n'),
    );

    // Materialise the source skill directories so the agents-only filter
    // can read their customize.toml. The bmad-master and bmad-agent-builder
    // SKILL.md files were already populated by createTestBmadFixture (they
    // share the bmad-master target_dir layout); only the customize.toml
    // and the new agent fixtures need to be created here.
    for (const id of ['bmad-agent-fixture', 'bmad-tea', 'bmad-agent-builder', 'bmad-help']) {
      const dir17 = path.join(installedBmadDir17, 'core', id);
      await fs.ensureDir(dir17);
      await fs.writeFile(
        path.join(dir17, 'SKILL.md'),
        ['---', `name: ${id}`, `description: fixture for ${id}`, '---', '', `Body of ${id}.`].join('\n'),
      );
    }
    // Note: bmad-help intentionally has NO customize.toml — it exercises
    // the toml-driven filter's exclusion path (a skill with no
    // customize.toml is correctly kept out of the Copilot agents picker).
    // [agent] customize.toml for the two persona fixtures.
    await fs.writeFile(
      path.join(installedBmadDir17, 'core', 'bmad-agent-fixture', 'customize.toml'),
      ['[agent]', 'name = "Fixture Agent"', 'title = "Test Persona"', ''].join('\n'),
    );
    await fs.writeFile(
      path.join(installedBmadDir17, 'core', 'bmad-tea', 'customize.toml'),
      ['[agent]', 'name = "Murat"', 'title = "Test Architect"', ''].join('\n'),
    );
    // [workflow] customize.toml for the meta-skill — its id contains `-agent-`
    // but it is NOT a persona (mirrors bmad-agent-builder in production).
    await fs.writeFile(
      path.join(installedBmadDir17, 'core', 'bmad-agent-builder', 'customize.toml'),
      ['[workflow]', '', '# Meta-skill that builds agents but is not itself a persona.', ''].join('\n'),
    );

    const copilotInstructionsPath17 = path.join(tempProjectDir17, '.github', 'copilot-instructions.md');
    await fs.ensureDir(path.dirname(copilotInstructionsPath17));
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

    const skillFile17 = path.join(tempProjectDir17, '.agents', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile17), 'GitHub Copilot install writes SKILL.md directory output');

    // Verify name frontmatter matches directory name
    const skillContent17 = await fs.readFile(skillFile17, 'utf8');
    const nameMatch17 = skillContent17.match(/^name:\s*(.+)$/m);
    assert(nameMatch17 && nameMatch17[1].trim() === 'bmad-master', 'GitHub Copilot skill name frontmatter matches directory name exactly');

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

    // Custom Agents picker integration: persona agents (those with [agent]
    // in their source customize.toml) get .agent.md files in
    // .github/agents/. Workflows and meta-skills with [workflow] (or no
    // customize.toml at all) do NOT — the agents-only filter keeps the
    // picker uncluttered and the signal is naming-independent.
    const agentsDir17 = path.join(tempProjectDir17, '.github', 'agents');
    const agentFileForPersona17 = path.join(agentsDir17, 'bmad-agent-fixture.agent.md');
    const agentFileForTea17 = path.join(agentsDir17, 'bmad-tea.agent.md');
    const agentFileForWorkflow17 = path.join(agentsDir17, 'bmad-master.agent.md');
    const agentFileForMetaSkill17 = path.join(agentsDir17, 'bmad-agent-builder.agent.md');
    const agentFileForBmadHelp17 = path.join(agentsDir17, 'bmad-help.agent.md');

    assert(
      await fs.pathExists(agentFileForPersona17),
      'Persona agent ([agent] in customize.toml) gets a .agent.md file in .github/agents/',
    );
    assert(await fs.pathExists(agentFileForTea17), 'Non-conventional id with [agent] in customize.toml is included (no allowlist needed)');
    assert(!(await fs.pathExists(agentFileForWorkflow17)), 'Workflow skill (no customize.toml) is FILTERED OUT of .github/agents/');
    assert(
      !(await fs.pathExists(agentFileForBmadHelp17)),
      'bmad-help is excluded from Copilot agents picker (no customize.toml; allowlist removed per maintainer feedback)',
    );
    assert(
      !(await fs.pathExists(agentFileForMetaSkill17)),
      'Meta-skill with -agent- in id but [workflow] in customize.toml is FILTERED OUT (signal is behavior, not naming)',
    );

    // Body content of the persona agent file: frontmatter description +
    // LOAD pattern referencing the skill's SKILL.md path under target_dir.
    const personaAgentContent17 = await fs.readFile(agentFileForPersona17, 'utf8');
    assert(
      personaAgentContent17.includes('description:'),
      'Copilot agent pointer carries a description in YAML frontmatter (drives the agents picker label)',
    );
    assert(
      personaAgentContent17.includes('{project-root}/.agents/skills/bmad-agent-fixture/SKILL.md'),
      'Copilot agent pointer body resolves to the skill via LOAD {project-root}/<target_dir>/<id>/SKILL.md',
    );

    // Idempotency: re-running setup must not duplicate or rewrite the agent
    // pointer when the source manifest is unchanged, AND must not start
    // emitting workflow-skill agent files.
    const result17b = await ideManager17.setup('github-copilot', tempProjectDir17, installedBmadDir17, {
      silent: true,
      selectedModules: ['bmm'],
    });
    assert(result17b.success === true, 'Second GitHub Copilot install succeeds (idempotent)');
    assert(await fs.pathExists(agentFileForPersona17), 'Persona agent pointer survives a second install pass');
    assert(!(await fs.pathExists(agentFileForWorkflow17)), 'Workflow skill remains filtered out of agents picker on second install');

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

    const tempProjectDir18 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-cline-test-'));
    const installedBmadDir18 = await createTestBmadFixture();

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

    const tempProjectDir19 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-codebuddy-test-'));
    const installedBmadDir19 = await createTestBmadFixture();

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

    assert(crushInstaller?.target_dir === '.agents/skills', 'Crush target_dir uses native skills path');

    const tempProjectDir20 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-crush-test-'));
    const installedBmadDir20 = await createTestBmadFixture();

    const ideManager20 = new IdeManager();
    await ideManager20.ensureInitialized();
    const result20 = await ideManager20.setup('crush', tempProjectDir20, installedBmadDir20, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result20.success === true, 'Crush setup succeeds against temp project');

    const skillFile20 = path.join(tempProjectDir20, '.agents', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile20), 'Crush install writes SKILL.md directory output');

    const skillContent20 = await fs.readFile(skillFile20, 'utf8');
    const nameMatch20 = skillContent20.match(/^name:\s*(.+)$/m);
    assert(nameMatch20 && nameMatch20[1].trim() === 'bmad-master', 'Crush skill name frontmatter matches directory name exactly');

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

    const tempProjectDir21 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-trae-test-'));
    const installedBmadDir21 = await createTestBmadFixture();

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

    assert(kiloConfig22?.installer?.target_dir === '.agents/skills', 'KiloCoder target_dir uses native skills path');

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

    const result22 = await ideManager22.setup('kilo', tempProjectDir22, installedBmadDir22, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result22.success === true, 'KiloCoder setup succeeds against temp project');

    const skillFile22 = path.join(tempProjectDir22, '.agents', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile22), 'KiloCoder install writes SKILL.md directory output');

    const skillContent22 = await fs.readFile(skillFile22, 'utf8');
    const nameMatch22 = skillContent22.match(/^name:\s*(.+)$/m);
    assert(nameMatch22 && nameMatch22[1].trim() === 'bmad-master', 'KiloCoder skill name frontmatter matches directory name exactly');

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

    assert(geminiInstaller?.target_dir === '.agents/skills', 'Gemini target_dir uses native skills path');

    const tempProjectDir23 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-gemini-test-'));
    const installedBmadDir23 = await createTestBmadFixture();

    const ideManager23 = new IdeManager();
    await ideManager23.ensureInitialized();
    const result23 = await ideManager23.setup('gemini', tempProjectDir23, installedBmadDir23, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result23.success === true, 'Gemini setup succeeds against temp project');

    const skillFile23 = path.join(tempProjectDir23, '.agents', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile23), 'Gemini install writes SKILL.md directory output');

    const skillContent23 = await fs.readFile(skillFile23, 'utf8');
    const nameMatch23 = skillContent23.match(/^name:\s*(.+)$/m);
    assert(nameMatch23 && nameMatch23[1].trim() === 'bmad-master', 'Gemini skill name frontmatter matches directory name exactly');

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

    const tempProjectDir24 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-iflow-test-'));
    const installedBmadDir24 = await createTestBmadFixture();

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

    const tempProjectDir25 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-qwen-test-'));
    const installedBmadDir25 = await createTestBmadFixture();

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

    assert(rovoInstaller?.target_dir === '.agents/skills', 'Rovo Dev target_dir uses native skills path');

    const tempProjectDir26 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-rovodev-test-'));
    const installedBmadDir26 = await createTestBmadFixture();

    // Create a prompts.yml with BMAD entries and a user entry
    const yaml26 = require('yaml');
    const promptsPath26 = path.join(tempProjectDir26, '.rovodev', 'prompts.yml');
    const promptsContent26 = yaml26.stringify({
      prompts: [
        { name: 'bmad-bmm-create-prd', description: 'BMAD workflow', content_file: 'workflows/bmad-bmm-create-prd.md' },
        { name: 'my-custom-prompt', description: 'User prompt', content_file: 'custom.md' },
      ],
    });
    await fs.ensureDir(path.dirname(promptsPath26));
    await fs.writeFile(promptsPath26, promptsContent26);

    const ideManager26 = new IdeManager();
    await ideManager26.ensureInitialized();
    const result26 = await ideManager26.setup('rovo-dev', tempProjectDir26, installedBmadDir26, {
      silent: true,
      selectedModules: ['bmm'],
    });

    assert(result26.success === true, 'Rovo Dev setup succeeds against temp project');

    const skillFile26 = path.join(tempProjectDir26, '.agents', 'skills', 'bmad-master', 'SKILL.md');
    assert(await fs.pathExists(skillFile26), 'Rovo Dev install writes SKILL.md directory output');

    // Verify name frontmatter matches directory name
    const skillContent26 = await fs.readFile(skillFile26, 'utf8');
    const nameMatch26 = skillContent26.match(/^name:\s*(.+)$/m);
    assert(nameMatch26 && nameMatch26[1].trim() === 'bmad-master', 'Rovo Dev skill name frontmatter matches directory name exactly');

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

    assert(piInstaller?.target_dir === '.agents/skills', 'Pi target_dir uses native skills path');

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

    const skillFile28 = path.join(tempProjectDir28, '.agents', 'skills', 'bmad-master', 'SKILL.md');
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
    assert(result.detail === '1 skills → .agent/skills', 'Installer detail reports skill count and target dir');
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
  // Test Suite 33: Custom Module Managers
  // ============================================================
  console.log(`${colors.yellow}Test Suite 33: Custom Module Managers${colors.reset}\n`);

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

  console.log('');

  // ============================================================
  // Test Suite 35: Central Config Emission (lean overrides + global routing)
  // ============================================================
  console.log(`${colors.yellow}Test Suite 35: Central Config Emission${colors.reset}\n`);

  {
    // Use the real src/ tree (core-skills + bmm-skills module.yaml are read via
    // getModulePath). Only the destination bmadDir is a temp dir, which the
    // installer writes config.toml / config.user.toml / custom/ into.
    const tempBmadDir35 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-central-config-'));
    // Phase 1: writeCentralConfig now writes scope:user core values to
    // ~/.bmad/config.user.toml. Isolate via BMAD_HOME so we don't pollute
    // the developer's real global config.
    const tempGlobalDir35 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-global-'));
    const priorBmadHome35 = process.env.BMAD_HOME;
    process.env.BMAD_HOME = tempGlobalDir35;

    try {
      const moduleConfigs = {
        core: {
          user_name: 'TestUser',
          project_name: 'demo-project',
          communication_language: 'Spanish',
          document_output_language: 'English',
          output_folder: '_bmad-output',
        },
        bmm: {
          user_skill_level: 'expert',
          planning_artifacts: '{project-root}/_bmad-output/planning-artifacts',
          implementation_artifacts: '{project-root}/_bmad-output/implementation-artifacts',
          project_knowledge: '{project-root}/docs',
          // Spread-from-core pollution: legacy per-module config.yaml merges
          // core values into every module; writeCentralConfig must strip these
          // from [modules.bmm] so core values only live in [core].
          // project_name is now a core key (#2279), so it joins user_name etc.
          // as a spread-from-core key that must be stripped.
          user_name: 'TestUser',
          project_name: 'stale-bmm-copy',
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

      // generateManifests would call writeGlobalUserCore right after this; we
      // call it directly here to test the full contract.
      const globalCorePath = await generator35.writeGlobalUserCore(moduleConfigs);
      assert(globalCorePath !== null, 'writeGlobalUserCore writes a file when scope:user values exist');
      assert(globalCorePath.startsWith(tempGlobalDir35), 'writeGlobalUserCore targets $BMAD_HOME');
      assert(await fs.pathExists(globalCorePath), '~/.bmad/config.user.toml is written to disk');

      const teamContent = await fs.readFile(teamPath, 'utf8');
      const userContent = await fs.readFile(userPath, 'utf8');
      const globalContent = await fs.readFile(globalCorePath, 'utf8');

      // [core] — lean: only deltas from module.yaml defaults remain.
      // project_name = "demo-project" differs from default ({directory_name}).
      // document_output_language = "English" EQUALS default — stripped.
      // output_folder = "_bmad-output" EQUALS default — stripped.
      assert(teamContent.includes('[core]'), 'config.toml has [core] section (carries project_name delta)');
      assert(teamContent.includes('project_name = "demo-project"'), 'Delta core key (project_name) lands in config.toml');
      assert(!teamContent.includes('document_output_language'), 'Default core values are stripped from config.toml (Task F)');
      assert(!teamContent.includes('user_name'), 'user_name (scope: user) is absent from config.toml');
      assert(!teamContent.includes('communication_language'), 'communication_language (scope: user) is absent from config.toml');

      // [core] user-scope no longer goes to project user file — it's routed
      // to ~/.bmad/config.user.toml (Task D).
      assert(!userContent.includes('user_name'), 'config.user.toml does NOT contain user_name (Task D: routed to global)');
      assert(
        !userContent.includes('communication_language'),
        'config.user.toml does NOT contain communication_language (Task D: routed to global)',
      );

      // Global file at ~/.bmad/config.user.toml carries the scope:user core values
      assert(globalContent.includes('[core]'), '~/.bmad/config.user.toml has [core] section');
      assert(globalContent.includes('user_name = "TestUser"'), 'user_name lands in ~/.bmad/config.user.toml');
      assert(globalContent.includes('communication_language = "Spanish"'), 'communication_language lands in ~/.bmad/config.user.toml');

      // [modules.bmm] — bmm answers in this fixture are ALL defaults (the test
      // intentionally seeds the same values module.yaml defaults to). With
      // Task F, an all-defaults section is omitted entirely.
      // user_skill_level = "expert" IS a delta from default "intermediate"
      // → that one key remains in [modules.bmm] in config.user.toml.
      assert(!teamContent.includes('[modules.bmm]'), 'config.toml has NO [modules.bmm] section when all values equal defaults (Task F)');
      const bmmUserMatch = userContent.match(/\[modules\.bmm\][\s\S]*?(?=\n\[|$)/);
      assert(bmmUserMatch !== null, 'config.user.toml has [modules.bmm] section (carries the user_skill_level delta)');
      if (bmmUserMatch) {
        assert(bmmUserMatch[0].includes('user_skill_level = "expert"'), 'user_skill_level delta lands in config.user.toml');
      }

      // [modules.external-mod] — unknown schema, no defaults to compare. Falls
      // through as team; core-key pollution still stripped.
      const extMatch = teamContent.match(/\[modules\.external-mod\][\s\S]*?(?=\n\[|$)/);
      assert(extMatch !== null, 'Unknown-schema module survives with its own [modules.*] section');
      if (extMatch) {
        const extBlock = extMatch[0];
        assert(extBlock.includes('custom_setting = "external-value"'), 'Unknown-schema module retains its own keys');
        assert(!extBlock.includes('user_name'), 'Core-key pollution stripped from unknown-schema module too');
        assert(!extBlock.includes('communication_language'), 'All core-key pollution stripped from unknown-schema module');
      }

      // [agents.*] — Task F: NEVER emitted to config.toml. Roster lives in
      // _bmad/{module}/module.toml floor (written by writeModuleTomls).
      assert(!teamContent.includes('[agents.'), 'config.toml has NO [agents.*] sections (Task F)');
      assert(!userContent.includes('[agents.'), '[agents.*] tables are never written to config.user.toml');

      // Header comments present on both project files
      assert(teamContent.includes('Installer-managed. Regenerated on every install'), 'config.toml has installer-managed header');
      assert(userContent.includes('Holds install answers scoped to YOU personally.'), 'config.user.toml header clarifies user scope');
      assert(globalContent.includes('Global personal BMad config'), '~/.bmad/config.user.toml has global-personal header');

      // writeGlobalUserCore must preserve hand-edits in shapes the old
      // round-trip parser silently dropped — arrays, single-quoted strings,
      // dotted/quoted keys, \uXXXX escapes, custom sections.
      const handEdited = [
        '# user-authored — should survive installer rewrites',
        '[core]',
        'user_name = "WillBeOverwritten"',
        'nickname = "blank-on-purpose"',
        '',
        '[custom_section]',
        "literal = 'single-quoted string'",
        'tags = ["a", "b", "c"]',
        String.raw`unicode = "Märy"`,
        '"weird.key" = "quoted-dotted key"',
        '',
      ].join('\n');
      await fs.writeFile(globalCorePath, handEdited, 'utf8');
      await generator35.writeGlobalUserCore({ core: { user_name: 'Updated', communication_language: 'Italian' } });
      const afterReplay = await fs.readFile(globalCorePath, 'utf8');
      assert(afterReplay.includes('user_name = "Updated"'), 'writeGlobalUserCore updates the key we own');
      assert(afterReplay.includes('communication_language = "Italian"'), 'writeGlobalUserCore writes new scope:user key');
      assert(afterReplay.includes("literal = 'single-quoted string'"), 'writeGlobalUserCore preserves single-quoted string values');
      assert(afterReplay.includes('tags = ["a", "b", "c"]'), 'writeGlobalUserCore preserves array values');
      assert(afterReplay.includes(String.raw`unicode = "Märy"`), String.raw`writeGlobalUserCore preserves \uXXXX escapes verbatim`);
      assert(afterReplay.includes('"weird.key" = "quoted-dotted key"'), 'writeGlobalUserCore preserves quoted/dotted keys');
      assert(afterReplay.includes('[custom_section]'), 'writeGlobalUserCore preserves user-authored sections');
      assert(
        afterReplay.includes('nickname = "blank-on-purpose"'),
        'writeGlobalUserCore preserves hand-written keys outside the installer schema',
      );
    } finally {
      await fs.remove(tempBmadDir35).catch(() => {});
      await fs.remove(tempGlobalDir35).catch(() => {});
      if (priorBmadHome35 === undefined) {
        delete process.env.BMAD_HOME;
      } else {
        process.env.BMAD_HOME = priorBmadHome35;
      }
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
  // Test Suite 37: Agent roster routes through module.toml, not config.toml
  // ============================================================
  console.log(`${colors.yellow}Test Suite 37: Agent roster routes through module.toml${colors.reset}\n`);

  {
    // Phase 1 (Task F): writeCentralConfig no longer emits [agents.*] blocks.
    // The roster lives in _bmad/{module}/module.toml (the resolver floor).
    // This suite verifies the relocation — same data, different home.
    //
    // Preservation across reinstalls (the OLD concern of this suite) is now
    // a non-issue: writeModuleTomls always reads the source module.yaml at
    // install time and rewrites module.toml from scratch. There's no "stale
    // entry" to preserve because the file gets fully regenerated.
    const tempBmadDir37 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-agents-floor-'));
    const tempGlobalDir37 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-global-37-'));
    const priorBmadHome37 = process.env.BMAD_HOME;
    process.env.BMAD_HOME = tempGlobalDir37;

    try {
      // Set up bmm/ directory so writeModuleTomls has a place to write
      await fs.ensureDir(path.join(tempBmadDir37, 'bmm'));

      const generator37 = new ManifestGenerator();
      generator37.bmadDir = tempBmadDir37;
      generator37.bmadFolderName = path.basename(tempBmadDir37);
      generator37.updatedModules = ['core', 'bmm'];

      await generator37.collectAgentsFromModuleYaml();
      await generator37.writeCentralConfig(tempBmadDir37, { core: {}, bmm: {} });
      await generator37.writeModuleTomls(tempBmadDir37);

      const teamContent = await fs.readFile(path.join(tempBmadDir37, 'config.toml'), 'utf8');
      const bmmTomlContent = await fs.readFile(path.join(tempBmadDir37, 'bmm', 'module.toml'), 'utf8');

      // Task F: config.toml carries no [agents.*] sections
      assert(!teamContent.includes('[agents.'), 'config.toml has no [agents.*] sections (Task F)');

      // The roster lives in module.toml instead
      assert(bmmTomlContent.includes('[agents.bmad-agent-analyst]'), 'bmm/module.toml carries [agents.bmad-agent-analyst]');
      assert(bmmTomlContent.includes('[agents.bmad-agent-dev]'), 'bmm/module.toml carries [agents.bmad-agent-dev]');
      assert(bmmTomlContent.includes('module = "bmm"'), 'Agent block in module.toml has module field');
      assert(bmmTomlContent.includes('name = "Mary"'), 'Agent block in module.toml has name');
    } finally {
      await fs.remove(tempBmadDir37).catch(() => {});
      await fs.remove(tempGlobalDir37).catch(() => {});
      if (priorBmadHome37 === undefined) {
        delete process.env.BMAD_HOME;
      } else {
        process.env.BMAD_HOME = priorBmadHome37;
      }
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

      // Set up per-module dirs so writeModuleTomls has somewhere to write
      await fs.ensureDir(path.join(tempBmadDir38, 'fake-ext'));
      await fs.ensureDir(path.join(tempBmadDir38, 'fake-skills'));

      // Isolate BMAD_HOME for the global-config write step
      const tempGlobalDir38 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-global-38-'));
      const priorBmadHome38 = process.env.BMAD_HOME;
      process.env.BMAD_HOME = tempGlobalDir38;

      try {
        await generator38.writeCentralConfig(tempBmadDir38, {
          core: {},
          bmm: {},
          'fake-ext': {},
          'fake-skills': {},
        });
        await generator38.writeModuleTomls(tempBmadDir38);

        const teamContent = await fs.readFile(path.join(tempBmadDir38, 'config.toml'), 'utf8');
        // Task F: agents NEVER land in config.toml anymore
        assert(!teamContent.includes('[agents.'), 'External module agents are NOT in config.toml (Task F)');

        // Instead, each external module gets its own _bmad/{module}/module.toml floor
        const fakeExtToml = await fs.readFile(path.join(tempBmadDir38, 'fake-ext', 'module.toml'), 'utf8');
        const fakeSkillsToml = await fs.readFile(path.join(tempBmadDir38, 'fake-skills', 'module.toml'), 'utf8');

        assert(fakeExtToml.includes('[agents.bmad-fake-ext-agent-one]'), 'external-module agents land in their own module.toml floor');
        assert(
          fakeSkillsToml.includes('[agents.bmad-fake-skills-agent]'),
          'skills-layout external module agents land in their own module.toml floor',
        );
        assert(fakeExtToml.includes('First fake external agent.'), 'agent description from external module.yaml lands in module.toml');
      } finally {
        await fs.remove(tempGlobalDir38).catch(() => {});
        if (priorBmadHome38 === undefined) {
          delete process.env.BMAD_HOME;
        } else {
          process.env.BMAD_HOME = priorBmadHome38;
        }
      }
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
  // Test Suite 40: Shared target_dir coordination
  // ============================================================
  console.log(`${colors.yellow}Test Suite 40: Shared target_dir coordination${colors.reset}\n`);

  try {
    // Cursor and Gemini both use .agents/skills — verify they coordinate.
    clearCache();
    const platformCodes40 = await loadPlatformCodes();
    const cursorTarget = platformCodes40.platforms.cursor?.installer?.target_dir;
    const geminiTarget = platformCodes40.platforms.gemini?.installer?.target_dir;
    assert(cursorTarget === '.agents/skills' && geminiTarget === '.agents/skills', 'Cursor and Gemini share .agents/skills target_dir');

    const tempProjectDir40 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-shared-target-'));
    const installedBmadDir40 = await createTestBmadFixture();

    const ideManager40 = new IdeManager();
    await ideManager40.ensureInitialized();

    // Run setupBatch with both platforms — second should skip skill write.
    const batchResults = await ideManager40.setupBatch(['cursor', 'gemini'], tempProjectDir40, installedBmadDir40, {
      silent: true,
      selectedModules: ['core'],
    });

    assert(batchResults.length === 2, 'setupBatch returns one result per IDE');
    assert(batchResults[0].success === true, 'First platform (cursor) succeeds');
    assert(batchResults[1].success === true, 'Second platform (gemini) succeeds');
    assert(
      batchResults[1].handlerResult?.results?.sharedTargetHandledByPeer === true,
      'Second platform marked sharedTargetHandledByPeer (skipped redundant write)',
    );

    // Skill should be present in the shared dir after batch.
    const sharedDir = path.join(tempProjectDir40, '.agents', 'skills');
    const sharedDirEntries = await fs.readdir(sharedDir);
    assert(sharedDirEntries.includes('bmad-master'), 'Shared .agents/skills/ contains bmad-master after batched install');

    // Now uninstall just cursor while gemini remains. Skills must survive.
    const cleanupResults = await ideManager40.cleanupByList(tempProjectDir40, ['cursor'], {
      silent: true,
      remainingIdes: ['gemini'],
    });
    assert(cleanupResults[0].skippedTarget === true, 'Cursor cleanup skips target_dir wipe when Gemini remains');
    const stillThere = await fs.readdir(sharedDir);
    assert(stillThere.includes('bmad-master'), 'bmad-master still present after partial uninstall (gemini still installed)');

    // (Cleanup of the last sharing platform requires bmadDir to be inside
    //  projectDir to compute removalSet; that's the production layout. The
    //  fixture above keeps bmad in a separate temp dir, so test 41 below
    //  exercises the in-project layout instead.)

    await fs.remove(tempProjectDir40).catch(() => {});
    await fs.remove(path.dirname(installedBmadDir40)).catch(() => {});
  } catch (error) {
    console.log(`${colors.red}Test Suite 40 setup failed: ${error.message}${colors.reset}`);
    failed++;
  }

  console.log('');

  // ============================================================
  // Test Suite 40b: setupBatch — failed first writer does not poison peers
  // ============================================================
  console.log(`${colors.yellow}Test Suite 40b: setupBatch resilience to first-writer failure${colors.reset}\n`);

  try {
    const tempProjectDir40b = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-batch-fail-'));
    const installedBmadDir40b = await createTestBmadFixture();

    const ideManager40b = new IdeManager();
    await ideManager40b.ensureInitialized();

    // Force cursor's setup() to fail. With the bug, gemini would see the
    // claimed target and skip — leaving .agents/skills/ empty.
    const cursorHandler40b = ideManager40b.handlers.get('cursor');
    const originalSetup = cursorHandler40b.setup.bind(cursorHandler40b);
    cursorHandler40b.setup = async () => {
      throw new Error('Simulated cursor failure');
    };

    const batchResults40b = await ideManager40b.setupBatch(['cursor', 'gemini'], tempProjectDir40b, installedBmadDir40b, {
      silent: true,
      selectedModules: ['core'],
    });

    // Restore so other tests aren't affected.
    cursorHandler40b.setup = originalSetup;

    assert(batchResults40b[0].success === false, 'Cursor reports failure');
    assert(batchResults40b[1].success === true, 'Gemini still succeeds despite cursor failure');
    assert(
      batchResults40b[1].handlerResult?.results?.sharedTargetHandledByPeer !== true,
      'Gemini does NOT skip its own write — it becomes the new first writer',
    );

    const sharedDir40b = path.join(tempProjectDir40b, '.agents', 'skills');
    const entries40b = await fs.readdir(sharedDir40b);
    assert(entries40b.includes('bmad-master'), 'Shared dir is populated by gemini after cursor failure');

    await fs.remove(tempProjectDir40b).catch(() => {});
    await fs.remove(path.dirname(installedBmadDir40b)).catch(() => {});
  } catch (error) {
    console.log(`${colors.red}Test Suite 40b setup failed: ${error.message}${colors.reset}`);
    failed++;
  }

  console.log('');

  // ============================================================
  // Test Suite 40c: OpenCode command pointers in multi-IDE batches
  // ============================================================
  // Regression: when OpenCode is the *peer* in a setupBatch sharing
  // .agents/skills (e.g. with openhands), the skill write is dedup-skipped
  // but the per-IDE .opencode/commands/ pointers must still be generated.
  // Symmetrically, partial uninstall while a peer remains must still clean
  // up OpenCode's own command pointers.
  console.log(`${colors.yellow}Test Suite 40c: OpenCode command pointers in shared-target batches${colors.reset}\n`);

  try {
    clearCache();
    const platformCodes40c = await loadPlatformCodes();
    const opencodeTarget40c = platformCodes40c.platforms.opencode?.installer?.target_dir;
    const openhandsTarget40c = platformCodes40c.platforms.openhands?.installer?.target_dir;
    assert(
      opencodeTarget40c === '.agents/skills' && openhandsTarget40c === '.agents/skills',
      'OpenCode and OpenHands share .agents/skills target_dir',
    );

    // Order A: opencode first → opencode is the writer.
    const projA = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-opencode-batch-a-'));
    const bmadA = await createTestBmadFixture();
    const mgrA = new IdeManager();
    await mgrA.ensureInitialized();
    const resultsA = await mgrA.setupBatch(['opencode', 'openhands'], projA, bmadA, {
      silent: true,
      selectedModules: ['core'],
    });
    const cmdA = path.join(projA, '.opencode', 'commands', 'bmad-master.md');
    assert(
      resultsA.every((r) => r.success === true),
      'opencode-first batch: all platforms succeed',
    );
    assert(await fs.pathExists(cmdA), 'opencode-first batch: command pointer is created');

    // Order B: openhands first → opencode is the peer (skipTarget=true).
    // Without the fix, the early-return would bypass installCommandPointers.
    const projB = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-opencode-batch-b-'));
    const bmadB = await createTestBmadFixture();
    const mgrB = new IdeManager();
    await mgrB.ensureInitialized();
    const resultsB = await mgrB.setupBatch(['openhands', 'opencode'], projB, bmadB, {
      silent: true,
      selectedModules: ['core'],
    });
    const cmdB = path.join(projB, '.opencode', 'commands', 'bmad-master.md');
    const opencodeResultB = resultsB.find((r) => r.ide === 'opencode');
    assert(
      resultsB.every((r) => r.success === true),
      'openhands-first batch: all platforms succeed',
    );
    assert(
      opencodeResultB?.handlerResult?.results?.sharedTargetHandledByPeer === true,
      'openhands-first batch: opencode is marked sharedTargetHandledByPeer (skill write deduped)',
    );
    assert(await fs.pathExists(cmdB), 'openhands-first batch: command pointer is generated even when skill write is deduped');

    // Cleanup symmetry: uninstall opencode while openhands remains.
    // Uses an in-project bmadDir so the cleanup path can compute removalSet
    // from the manifest (the production layout). The cross-temp-dir fixture
    // above can't exercise this — same constraint Test Suite 40 documents.
    const projC = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-opencode-batch-c-'));
    const bmadC = path.join(projC, '_bmad');
    await fs.ensureDir(path.join(bmadC, '_config'));
    await fs.writeFile(
      path.join(bmadC, '_config', 'skill-manifest.csv'),
      'canonicalId,name,description,module,path\n' +
        '"bmad-master","bmad-master","Minimal test agent fixture","core","_bmad/core/bmad-master/SKILL.md"\n',
    );
    const skillC = path.join(bmadC, 'core', 'bmad-master');
    await fs.ensureDir(skillC);
    await fs.writeFile(
      path.join(skillC, 'SKILL.md'),
      ['---', 'name: bmad-master', 'description: Minimal test agent fixture', '---', '', 'You are a test agent.'].join('\n'),
    );

    const mgrC = new IdeManager();
    await mgrC.ensureInitialized();
    await mgrC.setupBatch(['openhands', 'opencode'], projC, bmadC, {
      silent: true,
      selectedModules: ['core'],
    });
    const cmdC = path.join(projC, '.opencode', 'commands', 'bmad-master.md');
    assert(await fs.pathExists(cmdC), 'in-project fixture: pointer is generated for opencode peer');

    const cleanupResultsC = await mgrC.cleanupByList(projC, ['opencode'], {
      silent: true,
      remainingIdes: ['openhands'],
    });
    assert(cleanupResultsC[0].success !== false, 'opencode partial-uninstall reports success');
    const sharedSurvivesC = await fs.pathExists(path.join(projC, '.agents', 'skills', 'bmad-master', 'SKILL.md'));
    assert(sharedSurvivesC, 'shared .agents/skills/ survives partial uninstall (peer still uses it)');
    assert(!(await fs.pathExists(cmdC)), 'opencode command pointer is removed on partial uninstall even when peer remains');

    await fs.remove(projA).catch(() => {});
    await fs.remove(path.dirname(bmadA)).catch(() => {});
    await fs.remove(projB).catch(() => {});
    await fs.remove(path.dirname(bmadB)).catch(() => {});
    await fs.remove(projC).catch(() => {});
  } catch (error) {
    console.log(`${colors.red}Test Suite 40c setup failed: ${error.message}${colors.reset}`);
    failed++;
  }

  console.log('');

  // ============================================================
  // Test Suite 41: Custom-module skill ownership (non-bmad prefix)
  // ============================================================
  console.log(`${colors.yellow}Test Suite 41: Custom-module skill ownership${colors.reset}\n`);

  try {
    // A custom module can ship a skill with any canonicalId (e.g. "fred-cool-skill").
    // detect() must recognize it as BMAD-owned via the manifest, not the bmad- prefix.
    const fixtureRoot41 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-custom-prefix-'));
    const bmadDir41 = path.join(fixtureRoot41, '_bmad');
    await fs.ensureDir(path.join(bmadDir41, '_config'));
    await fs.writeFile(
      path.join(bmadDir41, '_config', 'skill-manifest.csv'),
      [
        'canonicalId,name,description,module,path',
        '"fred-cool-skill","fred-cool-skill","Custom module skill","fred","_bmad/fred/skills/fred-cool-skill/SKILL.md"',
        '',
      ].join('\n'),
    );
    const fredSkill = path.join(bmadDir41, 'fred', 'skills', 'fred-cool-skill');
    await fs.ensureDir(fredSkill);
    await fs.writeFile(
      path.join(fredSkill, 'SKILL.md'),
      ['---', 'name: fred-cool-skill', 'description: Custom module skill', '---', '', 'A custom module skill.'].join('\n'),
    );

    const ideManager41 = new IdeManager();
    await ideManager41.ensureInitialized();
    await ideManager41.setup('cursor', fixtureRoot41, bmadDir41, { silent: true, selectedModules: ['fred'] });

    const cursorHandler = ideManager41.handlers.get('cursor');
    const detected = await cursorHandler.detect(fixtureRoot41);
    assert(detected === true, 'detect() recognizes non-bmad-prefixed skill as BMAD-owned via skill-manifest.csv');

    await fs.remove(fixtureRoot41).catch(() => {});
  } catch (error) {
    console.log(`${colors.red}Test Suite 41 setup failed: ${error.message}${colors.reset}`);
    failed++;
  }

  console.log('');

  // ============================================================
  // Test Suite 42: --tools flag parsing & validation (#2326)
  // ============================================================
  console.log(`${colors.yellow}Test Suite 42: --tools flag parsing & validation${colors.reset}\n`);
  try {
    const { UI } = require('../tools/installer/ui');
    const ui = new UI();
    const known = new Set(['claude-code', 'cursor', 'windsurf']);

    assert(
      JSON.stringify(ui._parseToolsFlag('claude-code', known)) === JSON.stringify(['claude-code']),
      'parseToolsFlag returns single ID',
    );

    assert(
      JSON.stringify(ui._parseToolsFlag('claude-code,cursor', known)) === JSON.stringify(['claude-code', 'cursor']),
      'parseToolsFlag returns multiple IDs',
    );

    assert(
      JSON.stringify(ui._parseToolsFlag(' claude-code , cursor ', known)) === JSON.stringify(['claude-code', 'cursor']),
      'parseToolsFlag trims whitespace',
    );

    let emptyErr;
    try {
      ui._parseToolsFlag('', known);
    } catch (error) {
      emptyErr = error;
    }
    assert(
      emptyErr && emptyErr.expected === true && /empty/i.test(emptyErr.message),
      'parseToolsFlag rejects empty string with expected=true',
    );

    let commasOnlyErr;
    try {
      ui._parseToolsFlag(' , , ', known);
    } catch (error) {
      commasOnlyErr = error;
    }
    assert(commasOnlyErr && commasOnlyErr.expected === true, 'parseToolsFlag rejects whitespace/comma-only input');

    let noneErr;
    try {
      ui._parseToolsFlag('none', known);
    } catch (error) {
      noneErr = error;
    }
    assert(noneErr && noneErr.expected === true && /Unknown tool ID/.test(noneErr.message), 'parseToolsFlag rejects "none" as unknown ID');

    let typoErr;
    try {
      ui._parseToolsFlag('claude-code,claude-cdoe', known);
    } catch (error) {
      typoErr = error;
    }
    const typoHeader = typoErr ? typoErr.message.split('\n')[0] : '';
    assert(
      typoErr && typoErr.expected === true && /claude-cdoe/.test(typoHeader) && !/claude-code/.test(typoHeader),
      'parseToolsFlag reports only the unknown ID in error header (valid ones not listed as unknown)',
    );

    // --list-tools and --tools validation must agree on what counts as a valid ID.
    const { formatPlatformList } = require('../tools/installer/ide/platform-codes');
    const { IdeManager } = require('../tools/installer/ide/manager');
    const ideManager42 = new IdeManager();
    await ideManager42.ensureInitialized();
    const validIds = new Set(ideManager42.getAvailableIdes().map((i) => i.value));
    const listed = await formatPlatformList();
    // Each entry line starts with ' *' (preferred) or '  ' (other), followed by the ID, then padding.
    const entryLines = listed.split('\n').filter((l) => /^( \*| {2})[a-z]/.test(l));
    const listedIds = entryLines.map((l) => l.trim().replace(/^\*/, '').split(/\s+/)[0]);
    const missingFromList = [...validIds].filter((id) => !listedIds.includes(id));
    const extraInList = listedIds.filter((id) => !validIds.has(id));
    assert(
      missingFromList.length === 0 && extraInList.length === 0,
      '--list-tools output matches the IDs that --tools accepts',
      `Missing from list: ${missingFromList.join(',') || '(none)'}; Extra in list: ${extraInList.join(',') || '(none)'}`,
    );
  } catch (error) {
    console.log(`${colors.red}Test Suite 42 setup failed: ${error.message}${colors.reset}`);
    console.log(error.stack);
    failed++;
  }

  console.log('');

  // ============================================================
  // Test Suite 43: project_name promoted to core + hoist migration (#2279)
  // ============================================================
  console.log(`${colors.yellow}Test Suite 43: project_name in core + hoist migration${colors.reset}\n`);
  try {
    const yamlLib = require('yaml');
    const coreSchemaPath = path.join(__dirname, '..', 'src', 'core-skills', 'module.yaml');
    const bmmSchemaPath = path.join(__dirname, '..', 'src', 'bmm-skills', 'module.yaml');
    const coreSchema = yamlLib.parse(await fs.readFile(coreSchemaPath, 'utf8'));
    const bmmSchema = yamlLib.parse(await fs.readFile(bmmSchemaPath, 'utf8'));

    assert(
      coreSchema.project_name && coreSchema.project_name.prompt && coreSchema.project_name.default === '{directory_name}',
      'core/module.yaml declares project_name with {directory_name} default',
    );

    assert(coreSchema.project_name.scope === undefined, 'project_name has no user scope (project-scoped, not user-scoped)');

    assert(bmmSchema.project_name === undefined, 'bmm/module.yaml no longer declares project_name (now inherited from core)');

    // Set up a mock existing install: bmm directory has project_name (legacy),
    // core has user_name but not project_name. After hoist, project_name should
    // move to core, leaving bmm with only its own keys.
    const fixtureRoot43 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-fixture-43-'));
    const bmadDir43 = path.join(fixtureRoot43, '_bmad');
    await fs.ensureDir(path.join(bmadDir43, '_config'));
    await fs.writeFile(path.join(bmadDir43, '_config', 'manifest.yaml'), 'modules: []\n', 'utf8');
    await fs.ensureDir(path.join(bmadDir43, 'core'));
    await fs.ensureDir(path.join(bmadDir43, 'bmm'));
    await fs.writeFile(path.join(bmadDir43, 'core', 'config.yaml'), 'user_name: alice\n', 'utf8');
    await fs.writeFile(
      path.join(bmadDir43, 'bmm', 'config.yaml'),
      'project_name: legacy-from-bmm\nuser_skill_level: intermediate\n',
      'utf8',
    );

    const officialModules43 = new OfficialModules();
    await officialModules43.loadExistingConfig(fixtureRoot43);

    assert(
      officialModules43.existingConfig.core?.project_name === 'legacy-from-bmm',
      'loadExistingConfig hoists bmm.project_name to core on existing-install upgrade',
    );

    assert(
      !('project_name' in (officialModules43.existingConfig.bmm || {})),
      'loadExistingConfig removes project_name from bmm after hoisting',
    );

    assert(
      officialModules43.existingConfig.bmm?.user_skill_level === 'intermediate',
      'loadExistingConfig leaves non-core bmm keys (user_skill_level) untouched',
    );

    assert(officialModules43.existingConfig.core?.user_name === 'alice', 'loadExistingConfig preserves pre-existing core values');

    // Precedence: if core already has the key, hoist must NOT overwrite it.
    const fixtureRoot43b = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-fixture-43b-'));
    const bmadDir43b = path.join(fixtureRoot43b, '_bmad');
    await fs.ensureDir(path.join(bmadDir43b, '_config'));
    await fs.writeFile(path.join(bmadDir43b, '_config', 'manifest.yaml'), 'modules: []\n', 'utf8');
    await fs.ensureDir(path.join(bmadDir43b, 'core'));
    await fs.ensureDir(path.join(bmadDir43b, 'bmm'));
    await fs.writeFile(path.join(bmadDir43b, 'core', 'config.yaml'), 'project_name: from-core\n', 'utf8');
    await fs.writeFile(path.join(bmadDir43b, 'bmm', 'config.yaml'), 'project_name: stale-from-bmm\n', 'utf8');

    const officialModules43b = new OfficialModules();
    await officialModules43b.loadExistingConfig(fixtureRoot43b);

    assert(officialModules43b.existingConfig.core?.project_name === 'from-core', 'hoist does not overwrite an existing core value');

    assert(
      !('project_name' in (officialModules43b.existingConfig.bmm || {})),
      'hoist still strips the duplicate from bmm so writeCentralConfig partition stays clean',
    );

    // Malformed config.yaml (parses to a scalar) must not crash loadExistingConfig
    // or the hoist pass — they should treat it as "no config for that module"
    // and continue. Regression for augment review on PR #2348.
    const fixtureRoot43c = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-fixture-43c-'));
    const bmadDir43c = path.join(fixtureRoot43c, '_bmad');
    await fs.ensureDir(path.join(bmadDir43c, '_config'));
    await fs.writeFile(path.join(bmadDir43c, '_config', 'manifest.yaml'), 'modules: []\n', 'utf8');
    await fs.ensureDir(path.join(bmadDir43c, 'core'));
    await fs.ensureDir(path.join(bmadDir43c, 'bmm'));
    // Scalar YAML — yaml.parse returns the literal 42 (truthy non-object).
    // Pre-fix this crashed _hoistCoreKeysFromLegacyModuleConfigs with
    // "Cannot use 'in' operator to search for 'project_name' in 42".
    await fs.writeFile(path.join(bmadDir43c, 'core', 'config.yaml'), '42\n', 'utf8');
    await fs.writeFile(path.join(bmadDir43c, 'bmm', 'config.yaml'), 'project_name: rescued\n', 'utf8');

    const officialModules43c = new OfficialModules();
    let crashErr;
    try {
      await officialModules43c.loadExistingConfig(fixtureRoot43c);
    } catch (error) {
      crashErr = error;
    }
    assert(!crashErr, 'loadExistingConfig does not crash on a scalar core/config.yaml', crashErr?.stack);

    assert(
      officialModules43c.existingConfig.core?.project_name === 'rescued',
      'scalar core gets replaced with {} and bmm.project_name still hoists in',
    );

    await fs.remove(fixtureRoot43).catch(() => {});
    await fs.remove(fixtureRoot43b).catch(() => {});
    await fs.remove(fixtureRoot43c).catch(() => {});
  } catch (error) {
    console.log(`${colors.red}Test Suite 43 setup failed: ${error.message}${colors.reset}`);
    console.log(error.stack);
    failed++;
  }

  console.log('');

  // ============================================================
  // Test Suite 44: --set <module>.<key>=<value> CLI overrides (#1663)
  // ============================================================
  console.log(`${colors.yellow}Test Suite 44: --set CLI overrides${colors.reset}\n`);
  // Isolate $BMAD_HOME for the whole suite — applySetOverrides now consults
  // ~/.bmad/config.user.toml for routing decisions, and we don't want tests
  // touching the developer's actual global identity.
  const tempGlobalDir44 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-applyset-global-'));
  const priorBmadHome44 = process.env.BMAD_HOME;
  process.env.BMAD_HOME = tempGlobalDir44;
  try {
    const { parseSetEntry, parseSetEntries, applySetOverrides, upsertTomlKey, tomlString } = require('../tools/installer/set-overrides');
    const { discoverOfficialModuleYamls, formatOptionsList } = require('../tools/installer/list-options');

    // ---- Parser ----------------------------------------------------------
    const ok = parseSetEntry('bmm.project_knowledge=research');
    assert(
      ok.module === 'bmm' && ok.key === 'project_knowledge' && ok.value === 'research',
      'parseSetEntry splits <module>.<key>=<value> correctly',
    );
    assert(parseSetEntry('bmm.weird=a=b=c').value === 'a=b=c', 'parseSetEntry preserves additional "=" inside the value');

    const badInputs = ['no-equals', 'no-dot=value', '=value', '.=value', 'foo.=value', '.bar=value', ''];
    let allBadThrow = true;
    for (const bad of badInputs) {
      try {
        parseSetEntry(bad);
        allBadThrow = false;
      } catch {
        /* expected */
      }
    }
    assert(allBadThrow, `parseSetEntry rejects malformed inputs (${badInputs.length} cases)`);

    const multi = parseSetEntries(['bmm.project_knowledge=research', 'bmm.user_skill_level=expert', 'core.user_name=Brian']);
    assert(
      multi.bmm.project_knowledge === 'research' && multi.bmm.user_skill_level === 'expert' && multi.core.user_name === 'Brian',
      'parseSetEntries groups by module',
    );
    assert(parseSetEntries(['bmm.x=first', 'bmm.x=second']).bmm.x === 'second', 'parseSetEntries: later --set entry overrides earlier');
    const empty = parseSetEntries();
    assert(empty && Object.keys(empty).length === 0, 'parseSetEntries() returns empty object when called without args');

    // Prototype-pollution guard. `--set __proto__.x=1` would otherwise reach
    // `overrides.__proto__[x] = 1` and pollute every plain object.
    const polluteProbe = {};
    let pollutionThrown = false;
    try {
      parseSetEntries(['__proto__.polluted=1']);
    } catch {
      pollutionThrown = true;
    }
    assert(pollutionThrown, 'parseSetEntries rejects __proto__ as a module name');
    assert(polluteProbe.polluted === undefined, 'Object.prototype is not polluted by __proto__ in --set entries');
    let constructorThrown = false;
    try {
      parseSetEntries(['bmm.constructor=evil']);
    } catch {
      constructorThrown = true;
    }
    assert(constructorThrown, 'parseSetEntries rejects "constructor" as a key name');

    // ---- tomlString ------------------------------------------------------
    assert(tomlString('hello') === '"hello"', 'tomlString quotes a plain string');
    assert(tomlString('with "quotes"') === String.raw`"with \"quotes\""`, 'tomlString escapes embedded double-quotes');
    assert(tomlString(String.raw`back\slash`) === String.raw`"back\\slash"`, 'tomlString escapes backslashes');
    assert(tomlString('line1\nline2') === String.raw`"line1\nline2"`, 'tomlString escapes newlines');

    // ---- tomlString: type inference (--set bmm.workers=4 must be int) ----
    assert(tomlString('true') === 'true', 'tomlString emits bare bool for "true"');
    assert(tomlString('false') === 'false', 'tomlString emits bare bool for "false"');
    assert(tomlString('4') === '4', 'tomlString emits bare integer for digit string');
    assert(tomlString('-17') === '-17', 'tomlString emits bare integer for negative');
    assert(tomlString('3.14') === '3.14', 'tomlString emits bare float for decimal');
    assert(tomlString('-0.5') === '-0.5', 'tomlString emits bare float for negative decimal');
    assert(tomlString('1e10') === '"1e10"', 'tomlString quotes scientific notation (not in inferred set)');
    assert(tomlString('4.') === '"4."', 'tomlString quotes incomplete float (preserves as string)');
    assert(tomlString('"true"') === String.raw`"\"true\""`, 'tomlString preserves explicitly-quoted "true" as string');

    // ---- upsertTomlKey: insert into existing section ---------------------
    {
      const before = `[core]\nuser_name = "Brian"\n\n[modules.bmm]\nproject_knowledge = "{project-root}/docs"\n`;
      const after = upsertTomlKey(before, '[modules.bmm]', 'future_thing', '"persists"');
      assert(after.includes('future_thing = "persists"'), 'upsertTomlKey inserts a new key into an existing section');
      assert(/project_knowledge = "{project-root}\/docs"/.test(after), 'upsertTomlKey preserves existing keys');
    }

    // ---- upsertTomlKey: replace existing key, keep comment tail ----------
    {
      const before = `[core]\nuser_name = "old"  # set on first install\n`;
      const after = upsertTomlKey(before, '[core]', 'user_name', '"Brian"');
      assert(/user_name = "Brian"\s+# set on first install/.test(after), 'upsertTomlKey preserves trailing comments');
      assert(!after.includes('"old"'), 'upsertTomlKey replaces the prior value');
    }

    // ---- upsertTomlKey: section missing → append new section -------------
    {
      const before = `[core]\nuser_name = "Brian"\n`;
      const after = upsertTomlKey(before, '[modules.bmm]', 'project_knowledge', '"research"');
      assert(after.includes('[modules.bmm]'), 'upsertTomlKey appends a new section when missing');
      assert(after.includes('project_knowledge = "research"'), 'upsertTomlKey appends the key under the new section');
      // Existing section remains untouched
      assert(after.indexOf('[core]') < after.indexOf('[modules.bmm]'), 'upsertTomlKey adds the new section AFTER existing content');
    }

    // ---- upsertTomlKey: empty file ---------------------------------------
    {
      const after = upsertTomlKey('', '[core]', 'user_name', '"Brian"');
      assert(after.startsWith('[core]'), 'upsertTomlKey on an empty string emits the section header');
      assert(after.includes('user_name = "Brian"'), 'upsertTomlKey on an empty string writes the key');
    }

    // ---- upsertTomlKey: trailing newline preserved -----------------------
    {
      const withTrailing = upsertTomlKey('[core]\nuser_name = "old"\n', '[core]', 'user_name', '"new"');
      assert(withTrailing.endsWith('\n'), 'upsertTomlKey preserves trailing newline');
      const withoutTrailing = upsertTomlKey('[core]\nuser_name = "old"', '[core]', 'user_name', '"new"');
      assert(!withoutTrailing.endsWith('\n'), 'upsertTomlKey preserves absence of trailing newline');
    }

    // ---- upsertTomlKey: `#` inside string value is NOT a comment ---------
    // Per TOML spec, basic strings may contain unescaped `#`. The previous
    // /\s+#/ scanner truncated such values, producing malformed TOML.
    {
      const before = `[core]\nproject_name = "hello # world"\n`;
      const after = upsertTomlKey(before, '[core]', 'project_name', '"updated # value"');
      assert(after.includes('project_name = "updated # value"'), 'upsertTomlKey writes value containing # intact');
      assert(!after.includes('# world'), 'upsertTomlKey does not preserve a fake comment that lived inside the old string');
    }

    // ---- upsertTomlKey: section header with inline comment is found -----
    {
      const before = `[core]  # personal identity\nuser_name = "old"\n`;
      const after = upsertTomlKey(before, '[core]', 'user_name', '"Brian"');
      assert(after.includes('user_name = "Brian"'), 'upsertTomlKey updates key under header with inline comment');
      // Should not have appended a duplicate [core] block at EOF.
      const headerOccurrences = (after.match(/^\[core]/gm) || []).length;
      assert(headerOccurrences === 1, `upsertTomlKey reuses existing [core] header (got ${headerOccurrences} headers)`);
    }

    // ---- applySetOverrides happy path ------------------------------------
    {
      const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-applyset-'));
      const bmadDir = path.join(tmp, '_bmad');
      await fs.ensureDir(bmadDir);
      // Seed a realistic post-install state: team config has bmm.project_knowledge,
      // user config has core.user_name. The applySetOverrides router should
      // route bmm.user_skill_level → user.toml (already there), core.user_name
      // update → user.toml (already there), and a brand-new key → team.toml.
      await fs.writeFile(
        path.join(bmadDir, 'config.toml'),
        '[core]\nproject_name = "demo"\n\n[modules.bmm]\nproject_knowledge = "{project-root}/docs"\n',
        'utf8',
      );
      await fs.writeFile(
        path.join(bmadDir, 'config.user.toml'),
        '[core]\nuser_name = "OldName"\n\n[modules.bmm]\nuser_skill_level = "intermediate"\n',
        'utf8',
      );
      // Per-module config.yaml stubs are the "is this module installed?"
      // signal applySetOverrides uses to skip uninstalled-module overrides.
      await fs.ensureDir(path.join(bmadDir, 'core'));
      await fs.writeFile(path.join(bmadDir, 'core', 'config.yaml'), 'project_name: demo\n', 'utf8');
      await fs.ensureDir(path.join(bmadDir, 'bmm'));
      await fs.writeFile(
        path.join(bmadDir, 'bmm', 'config.yaml'),
        'project_knowledge: "{project-root}/docs"\nuser_skill_level: intermediate\n',
        'utf8',
      );

      const overrides = {
        core: { user_name: 'Brian' },
        bmm: { user_skill_level: 'expert', future_thing: 'persists' },
      };
      const applied = await applySetOverrides(overrides, bmadDir);

      const team = await fs.readFile(path.join(bmadDir, 'config.toml'), 'utf8');
      const user = await fs.readFile(path.join(bmadDir, 'config.user.toml'), 'utf8');

      assert(user.includes('user_name = "Brian"'), 'applySetOverrides updates user-scope key in config.user.toml');
      assert(user.includes('user_skill_level = "expert"'), 'applySetOverrides updates pre-existing user-scope key in config.user.toml');
      assert(team.includes('future_thing = "persists"'), 'applySetOverrides routes brand-new key to team config.toml');
      assert(team.includes('project_knowledge = "{project-root}/docs"'), 'applySetOverrides leaves untouched team keys alone');
      assert(!team.includes('user_name = "Brian"'), 'applySetOverrides does NOT duplicate user-scope key into team file');

      const summary = applied
        .map((a) => `${a.module}.${a.key}->${a.scope}`)
        .sort()
        .join(',');
      assert(
        summary === 'bmm.future_thing->team,bmm.user_skill_level->user,core.user_name->user',
        `applySetOverrides reports correct routing decisions (got: ${summary})`,
      );

      await fs.remove(tmp).catch(() => {});
    }

    // ---- applySetOverrides creates config.user.toml if missing -----------
    {
      const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-applyset-nouser-'));
      const bmadDir = path.join(tmp, '_bmad');
      await fs.ensureDir(bmadDir);
      await fs.writeFile(path.join(bmadDir, 'config.toml'), '[core]\nuser_name = "Brian"\n', 'utf8');
      await fs.ensureDir(path.join(bmadDir, 'core'));
      await fs.writeFile(path.join(bmadDir, 'core', 'config.yaml'), 'user_name: Brian\n', 'utf8');
      // Override targets a core scope:user key. Per Task D's 3-tier routing,
      // core.user_name lands in ~/.bmad/config.user.toml regardless of whether
      // project user.toml exists — that's where the resolver picks it up.
      // Project files (team and user) are left untouched.
      await applySetOverrides({ core: { user_name: 'Updated' } }, bmadDir);
      const team = await fs.readFile(path.join(bmadDir, 'config.toml'), 'utf8');
      const globalContent = await fs.readFile(path.join(tempGlobalDir44, 'config.user.toml'), 'utf8');
      assert(
        globalContent.includes('user_name = "Updated"'),
        'applySetOverrides routes core.user_name to global when project user.toml is absent',
      );
      assert(!team.includes('user_name = "Updated"'), 'applySetOverrides does not write core scope:user keys to project team config');
      assert(
        !(await fs.pathExists(path.join(bmadDir, 'config.user.toml'))),
        'applySetOverrides does not create project config.user.toml for scope:user core keys',
      );
      // Reset global file for the next test block.
      await fs.remove(path.join(tempGlobalDir44, 'config.user.toml')).catch(() => {});
      await fs.remove(tmp).catch(() => {});
    }

    // ---- applySetOverrides skips modules without per-module config.yaml --
    {
      const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-applyset-skip-'));
      const bmadDir = path.join(tmp, '_bmad');
      await fs.ensureDir(bmadDir);
      await fs.writeFile(path.join(bmadDir, 'config.toml'), '[core]\nuser_name = "Brian"\n', 'utf8');
      await fs.ensureDir(path.join(bmadDir, 'core'));
      await fs.writeFile(path.join(bmadDir, 'core', 'config.yaml'), 'user_name: Brian\n', 'utf8');
      // bmm is not installed (no `_bmad/bmm/config.yaml`). The override for
      // bmm should be silently skipped, no `[modules.bmm]` section created.
      // core.user_name is scope:user → routed to global (~/.bmad).
      const applied = await applySetOverrides({ bmm: { foo: 'bar' }, core: { user_name: 'Updated' } }, bmadDir);
      const team = await fs.readFile(path.join(bmadDir, 'config.toml'), 'utf8');
      const globalContent = await fs.readFile(path.join(tempGlobalDir44, 'config.user.toml'), 'utf8');
      assert(!team.includes('[modules.bmm]'), 'applySetOverrides does NOT create section for uninstalled module');
      assert(
        globalContent.includes('user_name = "Updated"'),
        'applySetOverrides still applies overrides for installed modules (routed to global for scope:user core)',
      );
      assert(applied.length === 1 && applied[0].module === 'core', 'applySetOverrides reports only the installed-module entries');
      await fs.remove(path.join(tempGlobalDir44, 'config.user.toml')).catch(() => {});
      await fs.remove(tmp).catch(() => {});
    }

    // ---- applySetOverrides: empty/missing input is a no-op ---------------
    {
      const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-applyset-empty-'));
      const bmadDir = path.join(tmp, '_bmad');
      await fs.ensureDir(bmadDir);
      const empty1 = await applySetOverrides({}, bmadDir);
      const empty2 = await applySetOverrides(null, bmadDir);
      const empty3 = await applySetOverrides(undefined, bmadDir);
      assert(
        empty1.length === 0 && empty2.length === 0 && empty3.length === 0,
        'applySetOverrides is a no-op for empty/null/undefined input',
      );
      await fs.remove(tmp).catch(() => {});
    }

    // ---- discoverOfficialModuleYamls + formatOptionsList -----------------
    // These read the on-disk external-module cache. Point that env at a temp
    // dir so test results don't depend on whatever the developer / CI runner
    // has cached.
    const priorCacheEnv44 = process.env.BMAD_EXTERNAL_MODULES_CACHE;
    const tempCacheDir44 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-list-options-cache-'));
    process.env.BMAD_EXTERNAL_MODULES_CACHE = tempCacheDir44;
    try {
      const discovered = await discoverOfficialModuleYamls();
      const codes = new Set(discovered.map((d) => d.code));
      assert(codes.has('core') && codes.has('bmm'), 'discoverOfficialModuleYamls finds core and bmm built-ins');

      const bmmListing = await formatOptionsList('bmm');
      assert(bmmListing.ok === true, '--list-options bmm reports ok: true');
      assert(bmmListing.text.includes('bmm.project_knowledge'), '--list-options bmm renders bmm.project_knowledge');
      assert(bmmListing.text.includes('bmm.user_skill_level'), '--list-options bmm renders bmm.user_skill_level');

      // Case-insensitive filter.
      const bmmUpper = await formatOptionsList('BMM');
      assert(bmmUpper.ok === true && bmmUpper.text.includes('bmm.project_knowledge'), '--list-options is case-insensitive');

      // Unknown module → non-zero exit signal.
      const unknown = await formatOptionsList('definitely-not-a-module');
      assert(unknown.ok === false, '--list-options <unknown> reports ok: false');
      assert(unknown.text.includes('No locally-known module.yaml'), '--list-options unknown explains the miss');
    } finally {
      if (priorCacheEnv44 === undefined) {
        delete process.env.BMAD_EXTERNAL_MODULES_CACHE;
      } else {
        process.env.BMAD_EXTERNAL_MODULES_CACHE = priorCacheEnv44;
      }
      await fs.remove(tempCacheDir44).catch(() => {});
    }
  } catch (error) {
    console.log(`${colors.red}Test Suite 44 setup failed: ${error.message}${colors.reset}`);
    console.log(error.stack);
    failed++;
  } finally {
    if (priorBmadHome44 === undefined) {
      delete process.env.BMAD_HOME;
    } else {
      process.env.BMAD_HOME = priorBmadHome44;
    }
    await fs.remove(tempGlobalDir44).catch(() => {});
  }

  console.log('');

  // ============================================================
  // Test Suite 45: Per-module module.toml floor (writeModuleTomls)
  // ============================================================
  console.log(`${colors.yellow}Test Suite 45: Per-module module.toml floor${colors.reset}\n`);

  try {
    const tempBmadDir45 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-module-toml-'));

    try {
      // Real bmm src tree provides module.yaml. Installer expects each
      // installed module directory to exist before writeModuleTomls runs.
      await fs.ensureDir(path.join(tempBmadDir45, 'bmm'));
      await fs.ensureDir(path.join(tempBmadDir45, 'core'));

      const generator45 = new ManifestGenerator();
      generator45.bmadDir = tempBmadDir45;
      generator45.bmadFolderName = path.basename(tempBmadDir45);
      generator45.updatedModules = ['core', 'bmm'];

      // Collect agents (needed for [agents.X] blocks per module)
      await generator45.collectAgentsFromModuleYaml();
      assert(generator45.agents.length >= 6, 'agents collected before writeModuleTomls');

      const written = await generator45.writeModuleTomls(tempBmadDir45);
      assert(Array.isArray(written), 'writeModuleTomls returns array of written paths');
      assert(written.length > 0, 'writeModuleTomls writes at least one module.toml');

      const bmmTomlPath = path.join(tempBmadDir45, 'bmm', 'module.toml');
      assert(await fs.pathExists(bmmTomlPath), 'bmm/module.toml is written to disk');

      const bmmContent = await fs.readFile(bmmTomlPath, 'utf8');

      // Header comment present
      assert(bmmContent.includes('Module-shipped defaults'), 'module.toml has header comment');
      assert(bmmContent.includes('Build artifact'), 'module.toml warns against hand-editing');

      // [modules.bmm] section with defaults from module.yaml
      assert(bmmContent.includes('[modules.bmm]'), 'bmm/module.toml has [modules.bmm] section');
      assert(/planning_artifacts\s*=\s*"[^"]+"/.test(bmmContent), '[modules.bmm] carries planning_artifacts default');
      // {project-root} preserved literal (runtime substitution); {output_folder}
      // resolved at install time against core's default output_folder. Final
      // shape matches the legacy config.yaml convention.
      assert(
        bmmContent.includes('{project-root}/_bmad-output/planning-artifacts'),
        'Cross-key placeholders resolved at install time ({output_folder} → "_bmad-output"); {project-root} preserved',
      );
      assert(!bmmContent.includes('{output_folder}'), '{output_folder} placeholder is NOT left literal — resolved against module defaults');

      // [agents.X] blocks for module-owned agents
      assert(bmmContent.includes('[agents.bmad-agent-analyst]'), 'bmm/module.toml has [agents.bmad-agent-analyst]');
      assert(bmmContent.includes('[agents.bmad-agent-dev]'), 'bmm/module.toml has [agents.bmad-agent-dev]');
      assert(bmmContent.includes('module = "bmm"'), 'Agent block carries module field');
      assert(bmmContent.includes('name = "Mary"'), 'Agent block carries name');
      assert(bmmContent.includes('icon = "📊"'), 'Agent block carries emoji icon');

      // module.toml is SCOPED to one module — bmm should not carry core's agents
      // (core/module.yaml ships no agents today, but the principle stands)
      const coreTomlPath = path.join(tempBmadDir45, 'core', 'module.toml');
      assert(await fs.pathExists(coreTomlPath), 'core/module.toml is written even without agents');

      const coreContent = await fs.readFile(coreTomlPath, 'utf8');
      // bmm agents must NOT appear in core/module.toml
      assert(!coreContent.includes('[agents.bmad-agent-analyst]'), 'bmm-owned agents do NOT leak into core/module.toml');

      // [core] questions (user_name, project_name, etc.) are core's defaults
      // and must live at top-level [core] — resolvers + consumers read core.*
      // from that namespace, not from a nested [modules.core] subtree.
      assert(coreContent.includes('[core]'), 'core/module.toml has top-level [core] section');
      assert(!coreContent.includes('[modules.core]'), 'core defaults do NOT live under [modules.core]');
      assert(coreContent.includes('user_name = "BMad"'), 'core/module.toml carries user_name default ("BMad" from module.yaml)');
      assert(coreContent.includes('document_output_language = "English"'), 'core/module.toml carries document_output_language default');

      // Question UI machinery NEVER appears as a TOML key in module.toml
      // (Match on line-start "key =" so we don't catch the word "prompt" inside
      // a description string — e.g. "Speaks like a terminal prompt".)
      assert(!/^prompt\s*=/m.test(bmmContent), 'No prompt key in module.toml');
      assert(!/^scope\s*=/m.test(bmmContent), 'No scope key in module.toml');
      assert(!bmmContent.includes('single-select'), 'No single-select machinery in module.toml');
    } finally {
      await fs.remove(tempBmadDir45).catch(() => {});
    }
  } catch (error) {
    console.log(`${colors.red}Test Suite 45 setup failed: ${error.message}${colors.reset}`);
    console.log(error.stack);
    failed++;
  }

  console.log('');

  // ============================================================
  // Test Suite 46: Phase 1 end-to-end — fresh machine + second project
  // ============================================================
  console.log(`${colors.yellow}Test Suite 46: Phase 1 end-to-end (fresh machine + second project)${colors.reset}\n`);

  try {
    const tempGlobalDir46 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-e2e-global-'));
    const priorBmadHome46 = process.env.BMAD_HOME;
    process.env.BMAD_HOME = tempGlobalDir46;

    try {
      // ────────────────────────────────────────────────────────────
      // Part A: Fresh-machine install, project #1
      // ────────────────────────────────────────────────────────────
      const project1 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-e2e-proj1-'));
      const bmad1 = path.join(project1, '_bmad');
      await fs.ensureDir(path.join(bmad1, 'core'));
      await fs.ensureDir(path.join(bmad1, 'bmm'));

      // Simulated installer output for project #1: user kept defaults for
      // every core key EXCEPT project_name, which is per-project.
      const project1Configs = {
        core: {
          user_name: 'Brian',
          project_name: 'first-project',
          communication_language: 'English',
          document_output_language: 'English',
          output_folder: '{project-root}/_bmad-output',
        },
        bmm: {
          user_skill_level: 'intermediate',
          planning_artifacts: '{project-root}/_bmad-output/planning-artifacts',
          implementation_artifacts: '{project-root}/_bmad-output/implementation-artifacts',
          project_knowledge: '{project-root}/docs',
        },
      };

      const gen1 = new ManifestGenerator();
      gen1.bmadDir = bmad1;
      gen1.bmadFolderName = path.basename(bmad1);
      gen1.updatedModules = ['core', 'bmm'];
      await gen1.collectAgentsFromModuleYaml();
      await gen1.writeCentralConfig(bmad1, project1Configs);
      await gen1.writeModuleTomls(bmad1);
      await gen1.writeGlobalUserCore(project1Configs);

      // Project #1: config.toml is lean — only project_name (the one delta)
      const team1 = await fs.readFile(path.join(bmad1, 'config.toml'), 'utf8');
      assert(team1.includes('project_name = "first-project"'), 'P1 config.toml carries project_name delta');
      assert(!team1.includes('user_name'), 'P1 config.toml has no user_name (scope:user routed to global)');
      assert(!team1.includes('document_output_language'), 'P1 config.toml strips default document_output_language');
      assert(!team1.includes('[agents.'), 'P1 config.toml has NO [agents.*] sections');
      assert(!team1.includes('[modules.bmm]'), 'P1 config.toml has NO [modules.bmm] section (all defaults)');

      // Project #1: config.user.toml is just the header
      const user1 = await fs.readFile(path.join(bmad1, 'config.user.toml'), 'utf8');
      assert(!user1.includes('user_name'), 'P1 config.user.toml has no user_name');
      assert(!user1.includes('[modules.bmm]'), 'P1 config.user.toml has no [modules.bmm]');

      // Global file populated with scope:user core values from project #1
      const globalPath = path.join(tempGlobalDir46, 'config.user.toml');
      assert(await fs.pathExists(globalPath), 'Global ~/.bmad/config.user.toml created on first install');
      const global1 = await fs.readFile(globalPath, 'utf8');
      assert(global1.includes('user_name = "Brian"'), 'Global identity carries Brian after P1');
      assert(global1.includes('communication_language = "English"'), 'Global identity carries language after P1');

      // module.toml floor: cross-key placeholders resolved at install time
      const bmm1 = await fs.readFile(path.join(bmad1, 'bmm', 'module.toml'), 'utf8');
      assert(
        bmm1.includes('planning_artifacts = "{project-root}/_bmad-output/planning-artifacts"'),
        'P1 bmm/module.toml has cross-key-resolved planning_artifacts',
      );
      assert(bmm1.includes('[agents.bmad-agent-analyst]'), 'P1 bmm/module.toml carries agent roster');

      // ────────────────────────────────────────────────────────────
      // Part B: Second project install on the same machine
      //   - Global identity from P1 should be picked up by the OfficialModules
      //     loader (loadGlobalConfig) as a silent default-source for scope:user
      //     core questions (D) and a seed for non-user-scope ones (E).
      //   - Resolver chain at runtime: global.core.user_name → reaches skills
      //     even though P2 never wrote it locally.
      // ────────────────────────────────────────────────────────────
      const { OfficialModules } = require('../tools/installer/modules/official-modules');

      const project2 = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-e2e-proj2-'));
      const bmad2 = path.join(project2, '_bmad');
      await fs.ensureDir(bmad2);

      const om = new OfficialModules();
      // Simulate what collectAllConfigurations does on entry: load global.
      om.globalConfig = await require('../tools/installer/global-config').loadGlobalConfig();
      assert(om.globalConfig.merged.core, 'OfficialModules.loadGlobalConfig returns populated [core]');
      assert(om.globalConfig.merged.core.user_name === 'Brian', 'Global config from P1 visible to OfficialModules on P2 install');
      assert(om.globalConfig.merged.core.communication_language === 'English', 'Global identity round-trips through TOML correctly');

      // ────────────────────────────────────────────────────────────
      // Part C: Python resolver sees identity via global even when P2's
      // project _bmad has no [core] user_name. Validates the full layered
      // resolver chain end-to-end.
      // ────────────────────────────────────────────────────────────
      // Write a minimal P2 install (just project_name in config.toml)
      const gen2 = new ManifestGenerator();
      gen2.bmadDir = bmad2;
      gen2.bmadFolderName = path.basename(bmad2);
      gen2.updatedModules = ['core', 'bmm'];
      await fs.ensureDir(path.join(bmad2, 'core'));
      await fs.ensureDir(path.join(bmad2, 'bmm'));
      const project2Configs = {
        core: {
          user_name: 'Brian', // Reused from global silently (D) — would normally bypass write
          project_name: 'second-project',
          communication_language: 'English',
          document_output_language: 'English',
          output_folder: '{project-root}/_bmad-output',
        },
        bmm: {
          user_skill_level: 'intermediate',
          planning_artifacts: '{project-root}/_bmad-output/planning-artifacts',
          implementation_artifacts: '{project-root}/_bmad-output/implementation-artifacts',
          project_knowledge: '{project-root}/docs',
        },
      };
      await gen2.collectAgentsFromModuleYaml();
      await gen2.writeCentralConfig(bmad2, project2Configs);
      await gen2.writeModuleTomls(bmad2);
      // Note: do NOT call writeGlobalUserCore again — values would be a no-op
      // merge, but in the real install they'd silently skip.

      const { execSync } = require('node:child_process');
      const resolverPath = path.resolve(__dirname, '..', 'src/scripts/resolve_config.py');
      const resolved = JSON.parse(
        execSync(
          `python3 ${resolverPath} --project-root ${project2} ` +
            `--key core.user_name --key core.project_name --key agents.bmad-agent-analyst.name`,
          { encoding: 'utf8', env: { ...process.env, BMAD_HOME: tempGlobalDir46 } },
        ),
      );
      assert(resolved['core.user_name'] === 'Brian', 'Resolver returns user_name from global layer (P2 lean config.toml omitted it)');
      assert(
        resolved['core.project_name'] === 'second-project',
        'Resolver returns project_name from P2 config.toml (project layer beats global)',
      );
      assert(resolved['agents.bmad-agent-analyst.name'] === 'Mary', 'Resolver returns agent name from P2 module.toml floor');

      await fs.remove(project1).catch(() => {});
      await fs.remove(project2).catch(() => {});
    } finally {
      await fs.remove(tempGlobalDir46).catch(() => {});
      if (priorBmadHome46 === undefined) {
        delete process.env.BMAD_HOME;
      } else {
        process.env.BMAD_HOME = priorBmadHome46;
      }
    }
  } catch (error) {
    console.log(`${colors.red}Test Suite 46 setup failed: ${error.message}${colors.reset}`);
    console.log(error.stack);
    failed++;
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
