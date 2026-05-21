/**
 * Verification Test for install-bmad-memtrace.sh
 *
 * Simulates the installation process in a clean temporary directory by:
 * 1. Initializing a mock Git repository.
 * 2. Committing some dummy "legacy clone" files.
 * 3. Adding the install script and helper script fixtures.
 * 4. Running the bash installer.
 * 5. Verifying cleanup, restore, workspace anchor generation, and MCP config injection.
 *
 * Usage: node test/verify-installer.js
 */

const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { exec } = require('node:child_process');

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

function runCmd(command, cwd) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// Helper to ensure parent directories exist
async function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch { /* directory may already exist */ }
}

async function runVerification() {
  console.log(`${colors.cyan}========================================`);
  console.log('Standalone Installer Verification');
  console.log(`========================================${colors.reset}\n`);

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-installer-verify-'));
  console.log(`Created temporary test environment at: ${tempDir}\n`);

  try {
    // 1. Initialize git repository
    await runCmd('git init -b main', tempDir);
    await runCmd('git config user.name "Test"', tempDir);
    await runCmd('git config user.email "test@example.com"', tempDir);

    // 2. Create and commit dummy cloned files (to simulate legacy clone cleanup)
    const dummyClonedFile = path.join(tempDir, 'README.md');
    await fs.writeFile(dummyClonedFile, '# Legacy README\n');
    await runCmd('git add README.md', tempDir);
    await runCmd('git commit -m "initial commit"', tempDir);

    // 3. Create core BMad directory structure and helper script
    const helperSourcePath = path.resolve(__dirname, '../_bmad/scripts/memtrace/inject-mcp-config.mjs');
    const helperDestPath = path.join(tempDir, '_bmad/scripts/memtrace/inject-mcp-config.mjs');
    await ensureDir(helperDestPath);
    await fs.copyFile(helperSourcePath, helperDestPath);

    // Also copy install script
    const installerSourcePath = path.resolve(__dirname, '../install-bmad-memtrace.sh');
    const installerDestPath = path.join(tempDir, 'install-bmad-memtrace.sh');
    await fs.copyFile(installerSourcePath, installerDestPath);

    // 4. Run installer script in bash
    // We override TEST_CLAUDE_CONFIG_PATH and TEST_OPENCODE_CONFIG_PATH so it targets temp config files
    const claudeTestConfig = path.join(tempDir, 'claude_desktop_config.json');
    const opencodeTestConfig = path.join(tempDir, 'opencode.json');

    console.log('Running install-bmad-memtrace.sh in temp directory...');
    const envOverrides = {
      ...process.env,
      TEST_CLAUDE_CONFIG_PATH: claudeTestConfig,
      TEST_OPENCODE_CONFIG_PATH: opencodeTestConfig,
    };

    // Run bash on Windows (locate git-bash path to avoid WSL-relay failures)
    let command = 'bash install-bmad-memtrace.sh';
    if (process.platform === 'win32') {
      try {
        const { execSync } = require('node:child_process');
        const gitPath = execSync('where git').toString().trim().split('\r\n')[0];
        if (gitPath) {
          const gitDir = path.dirname(gitPath); // C:\Program Files\Git\cmd
          const gitParent = path.dirname(gitDir);
          const possibleBash1 = path.join(gitParent, 'bin', 'bash.exe');
          const possibleBash2 = path.join(gitParent, 'bin', 'sh.exe');

          if (
            await fs
              .access(possibleBash1)
              .then(() => true)
              .catch(() => false)
          ) {
            command = `"${possibleBash1}" install-bmad-memtrace.sh`;
          } else if (
            await fs
              .access(possibleBash2)
              .then(() => true)
              .catch(() => false)
          ) {
            command = `"${possibleBash2}" install-bmad-memtrace.sh`;
          }
        }
      } catch {
        // Fallback
        const paths = [String.raw`C:\Program Files\Git\bin\bash.exe`, String.raw`C:\Program Files (x86)\Git\bin\bash.exe`];
        for (const p of paths) {
          if (
            await fs
              .access(p)
              .then(() => true)
              .catch(() => false)
          ) {
            command = `"${p}" install-bmad-memtrace.sh`;
            break;
          }
        }
      }
    }

    console.log(`Running installer with command: ${command}`);
    const result = await new Promise((resolve, reject) => {
      exec(command, { cwd: tempDir, env: envOverrides }, (error, stdout, stderr) => {
        if (error) reject({ error, stdout, stderr });
        else resolve({ stdout, stderr });
      });
    });

    console.log(`${colors.dim}${result.stdout}${colors.reset}\n`);

    // 5. Assertions

    // AC 1: .memtrace-workspace exists
    const anchorExists = await fs
      .access(path.join(tempDir, '.memtrace-workspace'))
      .then(() => true)
      .catch(() => false);
    assert(anchorExists, 'AC 1: .memtrace-workspace anchor file successfully created in project root');

    // Legacy cleanup: README.md is deleted
    const readmeExists = await fs
      .access(dummyClonedFile)
      .then(() => true)
      .catch(() => false);
    assert(!readmeExists, 'Legacy cleanup: Tracked clone files (README.md) successfully deleted');

    // Git removal: .git is deleted
    const gitExists = await fs
      .access(path.join(tempDir, '.git'))
      .then(() => true)
      .catch(() => false);
    assert(!gitExists, 'Security/Standalone: .git directory completely removed');

    // Staging cleanup: bmad-install is deleted
    const stagingExists = await fs
      .access(path.join(tempDir, 'bmad-install'))
      .then(() => true)
      .catch(() => false);
    assert(!stagingExists, 'Runtime cleanup: bmad-install staging directory successfully removed');

    // BMad preservation: _bmad directory remains
    const bmadExists = await fs
      .access(path.join(tempDir, '_bmad'))
      .then(() => true)
      .catch(() => false);
    assert(bmadExists, 'Core preservation: _bmad directory preserved post-cleanup');

    // AC 2: Claude Desktop configuration successfully injected
    const claudeContent = await fs.readFile(claudeTestConfig, 'utf8');
    const claudeConfig = JSON.parse(claudeContent);
    assert(
      claudeConfig.mcpServers && claudeConfig.mcpServers.memtrace && claudeConfig.mcpServers.memtrace.command === 'memtrace',
      'AC 2: Claude Desktop config correctly created and populated with memtrace MCP server',
    );

    // AC 3: OpenCode configuration successfully injected
    const opencodeContent = await fs.readFile(opencodeTestConfig, 'utf8');
    const opencodeConfig = JSON.parse(opencodeContent);
    assert(
      opencodeConfig.mcp && opencodeConfig.mcp.memtrace && opencodeConfig.mcp.memtrace.type === 'local',
      'AC 3: OpenCode config correctly created and populated with memtrace local definition',
    );
  } catch (error) {
    console.error('Verification failed with error:', error);
    if (error.stdout) console.error('stdout:', error.stdout);
    if (error.stderr) console.error('stderr:', error.stderr);
    failed++;
  }

  // Clean up
  try {
    await fs.rm(tempDir, { recursive: true, force: true });
  } catch { /* cleanup errors are non-fatal */ }

  console.log(`\n${colors.cyan}========================================`);
  console.log(`Verification Summary: Passed: ${passed}, Failed: ${failed}`);
  console.log(`========================================${colors.reset}\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runVerification().catch((error) => {
  console.error('Fatal verification error:', error);
  process.exit(1);
});
