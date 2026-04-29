/**
 * Config Resolution Tests
 *
 * Tests the Python config resolution scripts by invoking them as subprocesses
 * with temporary TOML fixtures. Validates:
 * - Global user layer is loaded and merged with correct priority
 * - Project layers override global layers
 * - Missing global dir doesn't break anything (backward compat)
 * - resolve_customization.py global skill layer
 *
 * Usage: node test/test-config-resolution.js
 */

const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs/promises');
const { execSync } = require('node:child_process');

const SCRIPTS_DIR = path.resolve(__dirname, '..', 'src', 'scripts');

const colors = {
  reset: '[0m',
  green: '[32m',
  red: '[31m',
  dim: '[2m',
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

function writeToml(filePath, data) {
  const lines = [];
  for (const [key, val] of Object.entries(data)) {
    if (typeof val === 'string') {
      lines.push(`${key} = "${val}"`);
    } else if (typeof val === 'number' || typeof val === 'boolean') {
      lines.push(`${key} = ${val}`);
    }
  }
  return fs.writeFile(filePath, lines.join('\n') + '\n');
}

async function withTempDir(fn) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-config-test-'));
  try {
    return await fn(dir);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

async function testResolveConfig() {
  console.log('\n--- resolve_config.py ---\n');

  // Test 1: global user overrides installer defaults
  await withTempDir(async (tmpDir) => {
    const globalDir = path.join(tmpDir, '.bmad', 'config');
    await fs.mkdir(globalDir, { recursive: true });
    await writeToml(path.join(globalDir, 'config.user.toml'), {
      user_name: 'GlobalAlice',
      communication_language: 'en',
    });

    const projectDir = path.join(tmpDir, 'project');
    const bmadDir = path.join(projectDir, '_bmad');
    await fs.mkdir(path.join(bmadDir, 'custom'), { recursive: true });
    await writeToml(path.join(bmadDir, 'config.toml'), {
      project_name: 'TestProject',
      user_name: 'InstallerDefault',
    });
    await writeToml(path.join(bmadDir, 'config.user.toml'), {
      user_name: 'InstallerUserDefault',
    });

    const origHome = process.env.HOME;
    process.env.HOME = tmpDir;
    try {
      const result = JSON.parse(execSync(`python3 ${SCRIPTS_DIR}/resolve_config.py --project-root ${projectDir}`, { encoding: 'utf-8' }));

      assert(
        result.user_name === 'GlobalAlice',
        'global user overrides installer defaults',
        `Expected "GlobalAlice", got "${result.user_name}"`,
      );
      assert(
        result.communication_language === 'en',
        'global communication_language preserved when installer has no override',
        `Expected "en", got "${result.communication_language}"`,
      );
      assert(
        result.project_name === 'TestProject',
        'installer team config values preserved',
        `Expected "TestProject", got "${result.project_name}"`,
      );
    } finally {
      process.env.HOME = origHome;
    }
  });

  // Test 2: missing global dir — backward compat
  await withTempDir(async (tmpDir) => {
    const projectDir = path.join(tmpDir, 'project');
    const bmadDir = path.join(projectDir, '_bmad');
    await fs.mkdir(path.join(bmadDir, 'custom'), { recursive: true });
    await writeToml(path.join(bmadDir, 'config.toml'), {
      project_name: 'NoGlobalProject',
    });

    const origHome = process.env.HOME;
    process.env.HOME = tmpDir;
    try {
      const result = JSON.parse(execSync(`python3 ${SCRIPTS_DIR}/resolve_config.py --project-root ${projectDir}`, { encoding: 'utf-8' }));

      assert(
        result.project_name === 'NoGlobalProject',
        'works fine without global config dir',
        `Expected "NoGlobalProject", got "${result.project_name}"`,
      );
    } finally {
      process.env.HOME = origHome;
    }
  });

  // Test 3: full priority chain — base_team < base_user < global < custom_team < custom_user
  await withTempDir(async (tmpDir) => {
    const globalDir = path.join(tmpDir, '.bmad', 'config');
    await fs.mkdir(globalDir, { recursive: true });
    await writeToml(path.join(globalDir, 'config.user.toml'), {
      user_name: 'L2-Global',
    });

    const projectDir = path.join(tmpDir, 'project');
    const bmadDir = path.join(projectDir, '_bmad');
    await fs.mkdir(path.join(bmadDir, 'custom'), { recursive: true });
    await writeToml(path.join(bmadDir, 'config.toml'), { user_name: 'L0-BaseTeam' });
    await writeToml(path.join(bmadDir, 'config.user.toml'), { user_name: 'L1-BaseUser' });
    await writeToml(path.join(bmadDir, 'custom', 'config.toml'), { user_name: 'L3-CustomTeam' });
    await writeToml(path.join(bmadDir, 'custom', 'config.user.toml'), { user_name: 'L4-CustomUser' });

    const origHome = process.env.HOME;
    process.env.HOME = tmpDir;
    try {
      const result = JSON.parse(execSync(`python3 ${SCRIPTS_DIR}/resolve_config.py --project-root ${projectDir}`, { encoding: 'utf-8' }));

      assert(
        result.user_name === 'L4-CustomUser',
        'highest priority layer (custom user) wins',
        `Expected "L4-CustomUser", got "${result.user_name}"`,
      );
    } finally {
      process.env.HOME = origHome;
    }
  });

  // Test 4: --key flag works with global layer
  await withTempDir(async (tmpDir) => {
    const globalDir = path.join(tmpDir, '.bmad', 'config');
    await fs.mkdir(globalDir, { recursive: true });
    await writeToml(path.join(globalDir, 'config.user.toml'), {
      user_name: 'KeyTestGlobal',
      communication_language: 'fr',
    });

    const projectDir = path.join(tmpDir, 'project');
    const bmadDir = path.join(projectDir, '_bmad');
    await fs.mkdir(path.join(bmadDir, 'custom'), { recursive: true });
    await writeToml(path.join(bmadDir, 'config.toml'), {
      project_name: 'KeyTestProject',
    });

    const origHome = process.env.HOME;
    process.env.HOME = tmpDir;
    try {
      const result = JSON.parse(
        execSync(`python3 ${SCRIPTS_DIR}/resolve_config.py --project-root ${projectDir} --key user_name --key communication_language`, {
          encoding: 'utf-8',
        }),
      );

      assert(
        Object.keys(result).length === 2,
        '--key returns only requested keys',
        `Expected 2 keys, got ${Object.keys(result).length}: ${JSON.stringify(Object.keys(result))}`,
      );
      assert(
        result.user_name === 'KeyTestGlobal',
        '--key user_name returns global value',
        `Expected "KeyTestGlobal", got "${result.user_name}"`,
      );
      assert(
        result.communication_language === 'fr',
        '--key communication_language returns global value',
        `Expected "fr", got "${result.communication_language}"`,
      );
    } finally {
      process.env.HOME = origHome;
    }
  });
}

async function testResolveCustomization() {
  console.log('\n--- resolve_customization.py ---\n');

  // Test 1: global skill user overrides skill defaults
  await withTempDir(async (tmpDir) => {
    const globalDir = path.join(tmpDir, '.bmad', 'config');
    await fs.mkdir(globalDir, { recursive: true });
    await writeToml(path.join(globalDir, 'test-skill.user.toml'), {
      agent: 'global-agent-prompt',
    });

    const skillDir = path.join(tmpDir, 'skill', 'test-skill');
    await fs.mkdir(skillDir, { recursive: true });
    await writeToml(path.join(skillDir, 'customize.toml'), {
      agent: 'default-agent-prompt',
      version: '1.0.0',
    });

    const origHome = process.env.HOME;
    process.env.HOME = tmpDir;
    try {
      const result = JSON.parse(execSync(`python3 ${SCRIPTS_DIR}/resolve_customization.py --skill ${skillDir}`, { encoding: 'utf-8' }));

      assert(
        result.agent === 'global-agent-prompt',
        'global user overrides skill defaults',
        `Expected "global-agent-prompt", got "${result.agent}"`,
      );
      assert(result.version === '1.0.0', 'skill default values preserved', `Expected "1.0.0", got "${result.version}"`);
    } finally {
      process.env.HOME = origHome;
    }
  });

  // Test 2: global skill layer provides value not in defaults
  await withTempDir(async (tmpDir) => {
    const globalDir = path.join(tmpDir, '.bmad', 'config');
    await fs.mkdir(globalDir, { recursive: true });
    await writeToml(path.join(globalDir, 'test-skill.user.toml'), {
      extra_global_key: 'from-global',
    });

    const skillDir = path.join(tmpDir, 'skill', 'test-skill');
    await fs.mkdir(skillDir, { recursive: true });
    await writeToml(path.join(skillDir, 'customize.toml'), {
      version: '2.0.0',
    });

    const origHome = process.env.HOME;
    process.env.HOME = tmpDir;
    try {
      const result = JSON.parse(execSync(`python3 ${SCRIPTS_DIR}/resolve_customization.py --skill ${skillDir}`, { encoding: 'utf-8' }));

      assert(
        result.extra_global_key === 'from-global',
        'global key not in defaults is preserved',
        `Expected "from-global", got "${result.extra_global_key}"`,
      );
      assert(result.version === '2.0.0', 'skill defaults still present', `Expected "2.0.0", got "${result.version}"`);
    } finally {
      process.env.HOME = origHome;
    }
  });

  // Test 3: missing global dir — backward compat
  await withTempDir(async (tmpDir) => {
    const skillDir = path.join(tmpDir, 'skill', 'test-skill');
    await fs.mkdir(skillDir, { recursive: true });
    await writeToml(path.join(skillDir, 'customize.toml'), {
      version: '3.0.0',
    });

    const origHome = process.env.HOME;
    process.env.HOME = tmpDir;
    try {
      const result = JSON.parse(execSync(`python3 ${SCRIPTS_DIR}/resolve_customization.py --skill ${skillDir}`, { encoding: 'utf-8' }));

      assert(result.version === '3.0.0', 'works without global config dir', `Expected "3.0.0", got "${result.version}"`);
    } finally {
      process.env.HOME = origHome;
    }
  });

  // Test 4: full priority chain — defaults < global < team < user
  await withTempDir(async (tmpDir) => {
    const globalDir = path.join(tmpDir, '.bmad', 'config');
    await fs.mkdir(globalDir, { recursive: true });
    await writeToml(path.join(globalDir, 'test-skill.user.toml'), {
      agent: 'L1-Global',
    });

    const skillDir = path.join(tmpDir, 'project', '_bmad', 'skills', 'test-skill');
    await fs.mkdir(skillDir, { recursive: true });
    await writeToml(path.join(skillDir, 'customize.toml'), { agent: 'L0-Defaults' });

    const customDir = path.join(tmpDir, 'project', '_bmad', 'custom');
    await fs.mkdir(customDir, { recursive: true });
    await writeToml(path.join(customDir, 'test-skill.toml'), { agent: 'L2-Team' });
    await writeToml(path.join(customDir, 'test-skill.user.toml'), { agent: 'L3-User' });

    const origHome = process.env.HOME;
    process.env.HOME = tmpDir;
    try {
      const result = JSON.parse(execSync(`python3 ${SCRIPTS_DIR}/resolve_customization.py --skill ${skillDir}`, { encoding: 'utf-8' }));

      assert(result.agent === 'L3-User', 'highest priority layer (project user) wins', `Expected "L3-User", got "${result.agent}"`);
    } finally {
      process.env.HOME = origHome;
    }
  });
}

async function main() {
  console.log('Config Resolution Tests\n');

  try {
    await testResolveConfig();
    await testResolveCustomization();
  } catch (error) {
    console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
    process.exit(1);
  }

  console.log(`\n${colors.green}${passed} passed${colors.reset}, ${colors.red}${failed} failed${colors.reset}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
