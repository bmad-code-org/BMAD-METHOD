import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const args = process.argv.slice(2);
const modeArgIndex = args.indexOf('--mode');
const mode = modeArgIndex !== -1 ? args[modeArgIndex + 1] : null;

if (!mode || (mode !== 'claude' && mode !== 'opencode')) {
  console.error('Error: Please specify --mode as "claude" or "opencode"');
  process.exit(1);
}

// Helper to ensure parent directories exist
async function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    // Ignore if already exists or other error handled later
  }
}

// Injects config for Claude Desktop
async function injectClaude() {
  let configPath = process.env.TEST_CLAUDE_CONFIG_PATH || '';
  if (!configPath) {
    const homedir = os.homedir();

    if (process.platform === 'win32') {
      const appdata = process.env.APPDATA;
      if (!appdata) {
        console.warn('Warning: APPDATA environment variable not set. Cannot resolve Claude Desktop config path on Windows.');
        return;
      }
      configPath = path.join(appdata, 'Claude', 'claude_desktop_config.json');
    } else if (process.platform === 'darwin') {
      configPath = path.join(homedir, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
    } else {
      // Linux/fallback
      configPath = path.join(homedir, '.config', 'Claude', 'claude_desktop_config.json');
    }
  }

  console.log(`Targeting Claude Desktop Config: ${configPath}`);

  let configObj = {};

  try {
    const data = await fs.readFile(configPath, 'utf8');
    configObj = JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('Claude Desktop config file does not exist. Creating a new one...');
    } else {
      console.error(`Error reading or parsing Claude Desktop config: ${err.message}`);
      console.warn('Attempting to overwrite with clean skeleton...');
    }
  }

  // Inject or overwrite memtrace server
  if (!configObj.mcpServers) {
    configObj.mcpServers = {};
  }

  configObj.mcpServers.memtrace = {
    command: 'memtrace',
    args: ['mcp']
  };

  try {
    await ensureDir(configPath);
    await fs.writeFile(configPath, JSON.stringify(configObj, null, 2), 'utf8');
    console.log('Successfully configured Memtrace MCP server in Claude Desktop config!');
  } catch (err) {
    console.error(`Failed to write Claude Desktop config: ${err.message}`);
  }
}

// Injects config for OpenCode
async function injectOpenCode() {
  const configPath = process.env.TEST_OPENCODE_CONFIG_PATH || path.resolve(process.cwd(), 'opencode.json');
  console.log(`Targeting OpenCode Config: ${configPath}`);

  let configObj = {};

  try {
    const data = await fs.readFile(configPath, 'utf8');
    configObj = JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('opencode.json does not exist. Creating a new one...');
    } else {
      console.error(`Error reading or parsing opencode.json: ${err.message}`);
      console.warn('Attempting to overwrite with clean skeleton...');
    }
  }

  // Inject or overwrite memtrace server
  if (!configObj.mcp) {
    configObj.mcp = {};
  }

  configObj.mcp.memtrace = {
    type: 'local',
    command: ['memtrace', 'mcp'],
    enabled: true,
    environment: {}
  };

  try {
    await fs.writeFile(configPath, JSON.stringify(configObj, null, 2), 'utf8');
    console.log('Successfully configured Memtrace MCP server in opencode.json!');
  } catch (err) {
    console.error(`Failed to write opencode.json: ${err.message}`);
  }
}

async function run() {
  if (mode === 'claude') {
    await injectClaude();
  } else if (mode === 'opencode') {
    await injectOpenCode();
  }
}

run().catch((err) => {
  console.error(`Fatal execution error: ${err.message}`);
  process.exit(1);
});
