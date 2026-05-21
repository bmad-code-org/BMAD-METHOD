/**
 * Test Suite for inject-mcp-config.mjs
 *
 * Verifies that the MCP server injector works correctly for both Claude Desktop
 * and OpenCode configurations under different initial file states.
 *
 * Usage: node test/test-inject-mcp-config.js
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

// Executes the injector script in a subprocess with custom env variables
function runInjector(mode, envOverrides = {}) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, '../_bmad/scripts/memtrace/inject-mcp-config.mjs');
    const command = `node "${scriptPath}" --mode ${mode}`;

    exec(
      command,
      {
        env: { ...process.env, ...envOverrides },
      },
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stdout, stderr });
        } else {
          resolve({ stdout, stderr });
        }
      },
    );
  });
}

async function runTests() {
  console.log(`${colors.cyan}========================================`);
  console.log('MCP Config Injector Unit Tests');
  console.log(`========================================${colors.reset}\n`);

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-injector-test-'));

  // ============================================================
  // Test Suite 1: Claude Desktop configuration injection
  // ============================================================
  console.log(`${colors.yellow}Test Suite 1: Claude Desktop Configuration${colors.reset}\n`);

  const claudeTestFile = path.join(tempDir, 'claude_desktop_config.json');

  // Test 1.1: File does not exist (creates skeleton)
  try {
    await runInjector('claude', { TEST_CLAUDE_CONFIG_PATH: claudeTestFile });
    const content = await fs.readFile(claudeTestFile, 'utf8');
    const config = JSON.parse(content);

    assert(
      config.mcpServers !== undefined && config.mcpServers.memtrace !== undefined,
      'Test 1.1: Creates new Claude config file and injects memtrace server skeleton',
    );
    assert(
      config.mcpServers.memtrace.command === 'memtrace' && config.mcpServers.memtrace.args[0] === 'mcp',
      'Test 1.1: Injected server details match expected schema format',
    );
  } catch (error) {
    assert(false, 'Test 1.1 Failed with error', error.message || JSON.stringify(error));
  }

  // Test 1.2: File exists with other servers (preserves other servers)
  try {
    const preExistingConfig = {
      mcpServers: {
        otherServer: {
          command: 'node',
          args: ['other-path/server.js'],
        },
      },
    };
    await fs.writeFile(claudeTestFile, JSON.stringify(preExistingConfig, null, 2), 'utf8');

    await runInjector('claude', { TEST_CLAUDE_CONFIG_PATH: claudeTestFile });
    const content = await fs.readFile(claudeTestFile, 'utf8');
    const config = JSON.parse(content);

    assert(
      config.mcpServers.otherServer !== undefined && config.mcpServers.otherServer.command === 'node',
      'Test 1.2: Preserves pre-existing mcpServers in Claude config',
    );
    assert(
      config.mcpServers.memtrace !== undefined && config.mcpServers.memtrace.command === 'memtrace',
      'Test 1.2: Correctly appends memtrace server configuration alongside existing ones',
    );
  } catch (error) {
    assert(false, 'Test 1.2 Failed with error', error.message || JSON.stringify(error));
  }

  // Test 1.3: File exists and memtrace key already exists (overwrites memtrace key only)
  try {
    const preExistingConfig = {
      mcpServers: {
        otherServer: {
          command: 'node',
          args: ['other-path/server.js'],
        },
        memtrace: {
          command: 'old-command',
          args: ['old-arg'],
        },
      },
    };
    await fs.writeFile(claudeTestFile, JSON.stringify(preExistingConfig, null, 2), 'utf8');

    await runInjector('claude', { TEST_CLAUDE_CONFIG_PATH: claudeTestFile });
    const content = await fs.readFile(claudeTestFile, 'utf8');
    const config = JSON.parse(content);

    assert(
      config.mcpServers.otherServer !== undefined && config.mcpServers.otherServer.command === 'node',
      'Test 1.3: Overwriting preserves other servers',
    );
    assert(
      config.mcpServers.memtrace.command === 'memtrace' && config.mcpServers.memtrace.args[0] === 'mcp',
      'Test 1.3: Correctly overwrites only the memtrace key',
    );
  } catch (error) {
    assert(false, 'Test 1.3 Failed with error', error.message || JSON.stringify(error));
  }

  console.log('');

  // ============================================================
  // Test Suite 2: OpenCode configuration injection
  // ============================================================
  console.log(`${colors.yellow}Test Suite 2: OpenCode Configuration${colors.reset}\n`);

  const opencodeTestFile = path.join(tempDir, 'opencode.json');

  // Test 2.1: File does not exist (creates skeleton)
  try {
    await runInjector('opencode', { TEST_OPENCODE_CONFIG_PATH: opencodeTestFile });
    const content = await fs.readFile(opencodeTestFile, 'utf8');
    const config = JSON.parse(content);

    assert(
      config.mcp !== undefined && config.mcp.memtrace !== undefined,
      'Test 2.1: Creates new OpenCode config file and injects memtrace server skeleton',
    );
    assert(
      config.mcp.memtrace.type === 'local' && config.mcp.memtrace.command[0] === 'memtrace' && config.mcp.memtrace.command[1] === 'mcp',
      'Test 2.1: Injected server details match expected OpenCode schema format',
    );
  } catch (error) {
    assert(false, 'Test 2.1 Failed with error', error.message || JSON.stringify(error));
  }

  // Test 2.2: File exists with other keys (preserves other keys)
  try {
    const preExistingConfig = {
      mcp: {
        otherServer: {
          type: 'local',
          command: ['other-server'],
        },
      },
    };
    await fs.writeFile(opencodeTestFile, JSON.stringify(preExistingConfig, null, 2), 'utf8');

    await runInjector('opencode', { TEST_OPENCODE_CONFIG_PATH: opencodeTestFile });
    const content = await fs.readFile(opencodeTestFile, 'utf8');
    const config = JSON.parse(content);

    assert(
      config.mcp.otherServer !== undefined && config.mcp.otherServer.type === 'local',
      'Test 2.2: Preserves pre-existing mcp in OpenCode config',
    );
    assert(
      config.mcp.memtrace !== undefined && config.mcp.memtrace.type === 'local',
      'Test 2.2: Correctly appends memtrace server configuration alongside existing ones',
    );
  } catch (error) {
    assert(false, 'Test 2.2 Failed with error', error.message || JSON.stringify(error));
  }

  // Test 2.3: File exists and memtrace key already exists (overwrites memtrace key only)
  try {
    const preExistingConfig = {
      mcp: {
        otherServer: {
          type: 'local',
          command: ['other-server'],
        },
        memtrace: {
          type: 'remote',
          command: ['old-memtrace'],
        },
      },
    };
    await fs.writeFile(opencodeTestFile, JSON.stringify(preExistingConfig, null, 2), 'utf8');

    await runInjector('opencode', { TEST_OPENCODE_CONFIG_PATH: opencodeTestFile });
    const content = await fs.readFile(opencodeTestFile, 'utf8');
    const config = JSON.parse(content);

    assert(
      config.mcp.otherServer !== undefined && config.mcp.otherServer.type === 'local',
      'Test 2.3: Overwriting preserves other OpenCode servers',
    );
    assert(
      config.mcp.memtrace.type === 'local' && config.mcp.memtrace.command[0] === 'memtrace',
      'Test 2.3: Correctly overwrites only the memtrace key in OpenCode config',
    );
  } catch (error) {
    assert(false, 'Test 2.3 Failed with error', error.message || JSON.stringify(error));
  }

  // Clean up
  try {
    await fs.rm(tempDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }

  console.log(`\n${colors.cyan}========================================`);
  console.log(`Tests Run Summary: Passed: ${passed}, Failed: ${failed}`);
  console.log(`========================================${colors.reset}\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((error) => {
  console.error('Fatal test error:', error);
  process.exit(1);
});
