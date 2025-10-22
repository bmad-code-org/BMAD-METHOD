const path = require('node:path');
const chalk = require('chalk');
const {
  ChromeDevToolsMcpClient,
} = require('../../mcp/chrome-devtools-client');
const {
  executeManifest,
  executeSpecs,
  loadSpecFromFile,
  resolveMcpOptionsFromEnv,
} = require('../../mcp/runner');

function collectArray(value, previous = []) {
  previous.push(value);
  return previous;
}

function collectEnv(value, previous = {}) {
  const separatorIndex = value.indexOf('=');
  if (separatorIndex === -1) {
    throw new Error(`Invalid env value "${value}". Use KEY=VALUE format.`);
  }
  const key = value.slice(0, separatorIndex).trim();
  const envValue = value.slice(separatorIndex + 1);
  if (!key) {
    throw new Error(`Invalid env key in "${value}"`);
  }
  return { ...previous, [key]: envValue };
}

function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Failed to parse JSON value: ${error.message}`);
  }
}

function buildClientOptions(options) {
  const defaults = resolveMcpOptionsFromEnv();
  const result = {
    ...defaults,
    env: { ...(defaults.env ?? {}) },
  };

  if (options.browserUrl) {
    result.browserUrl = options.browserUrl;
  }
  if (options.channel) {
    result.channel = options.channel;
  }
  if (options.viewport) {
    result.viewport = options.viewport;
  }
  if (options.logFile) {
    result.logFile = path.resolve(options.logFile);
  }
  if (options.cwd) {
    result.cwd = path.resolve(options.cwd);
  }
  if (options.env && Object.keys(options.env).length) {
    result.env = { ...result.env, ...options.env };
  }
  if (options.extraArg?.length) {
    result.extraChromeArgs = options.extraArg;
  }
  if (typeof options.headless === 'boolean') {
    result.headless = options.headless;
  }
  if (typeof options.isolated === 'boolean') {
    result.isolated = options.isolated;
  }
  if (options.acceptInsecureCerts !== undefined) {
    result.acceptInsecureCerts = options.acceptInsecureCerts;
  }
  if (options.executablePath) {
    result.executablePath = path.resolve(options.executablePath);
  }

  return result;
}

async function listTools(options) {
  const client = new ChromeDevToolsMcpClient(buildClientOptions(options));
  await client.connect();
  try {
    const tools = await client.listTools();
    if (tools.length === 0) {
      console.log('No tools available from chrome-devtools-mcp.');
      return;
    }
    console.log('\nAvailable tools:\n');
    for (const tool of tools) {
      const description = tool.description ? ` — ${tool.description}` : '';
      console.log(`• ${tool.name}${description}`);
    }
  } finally {
    await client.disconnect();
  }
}

async function callTool(options) {
  if (!options.call) {
    throw new Error('Tool name is required when using --call.');
  }

  const params = options.params ? options.params : {};
  const client = new ChromeDevToolsMcpClient(buildClientOptions(options));
  await client.connect();
  try {
    const response = await client.callTool(options.call, params);
    console.log(
      '\nResponse:',
      JSON.stringify(response, null, 2),
    );
  } finally {
    await client.disconnect();
  }
}

async function runManifestCommand(options) {
  const manifestPath = path.resolve(options.manifest);
  const execution = await executeManifest(manifestPath, {
    projectRoot: process.cwd(),
    clientOptions: buildClientOptions(options),
    artifactDir: options.artifactDir ? path.resolve(options.artifactDir) : undefined,
    filter: {
      batch: options.batch,
      scenario: options.scenario,
    },
  });

  if (execution.status === 'failed') {
    process.exitCode = 1;
  }
}

async function runSpecCommand(options) {
  const specPath = path.resolve(options.spec);
  const spec = loadSpecFromFile(specPath);
  const execution = await executeSpecs([spec], {
    clientOptions: buildClientOptions(options),
    artifactDir: options.artifactDir ? path.resolve(options.artifactDir) : undefined,
  });

  if (execution.status === 'failed') {
    process.exitCode = 1;
  }
}

module.exports = {
  command: 'mcp',
  description: 'Interact with chrome-devtools-mcp transports',
  options: [
    ['-m, --manifest <path>', 'Run MCP specs defined in a manifest file'],
    ['-s, --spec <path>', 'Run a single MCP spec YAML file'],
    ['-b, --batch <id>', 'Only run a specific manifest batch (requires --manifest)'],
    ['--scenario <id>', 'Only run a specific scenario within a manifest batch'],
    ['-l, --list-tools', 'List tools exposed by the MCP connector'],
    ['-c, --call <name>', 'Invoke a specific tool'],
    ['-p, --params <json>', 'JSON payload for --call', parseJson],
    ['--browser-url <url>', 'Connect to an existing Chrome debugging endpoint'],
    ['--channel <name>', 'Chrome channel to use when launching a browser'],
    ['--viewport <size>', 'Viewport size, e.g. 1280x720'],
    ['--log-file <path>', 'Path to write chrome-devtools-mcp logs'],
    ['--cwd <path>', 'Working directory for chrome-devtools-mcp child process'],
    ['--extra-arg <arg>', 'Additional Chrome argument (repeatable)', collectArray, []],
    ['--env <key=value>', 'Environment variable for MCP child process', collectEnv, {}],
    ['--artifact-dir <path>', 'Directory for MCP artifacts'],
    ['--executable-path <path>', 'Specify Chrome executable path'],
    ['--accept-insecure-certs', 'Allow insecure certificates when launching Chrome'],
    ['--no-headless', 'Disable headless mode'],
    ['--no-isolated', 'Disable isolated browser profile'],
  ],
  action: async (options) => {
    try {
      if (options.listTools) {
        await listTools(options);
        return;
      }

      if (options.call) {
        await callTool(options);
        return;
      }

      if (options.manifest) {
        await runManifestCommand(options);
        return;
      }

      if (options.spec) {
        await runSpecCommand(options);
        return;
      }

      console.log(chalk.yellow('No action specified. Use --help to see available options.'));
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      if (error.stack) {
        console.error(chalk.dim(error.stack));
      }
      process.exitCode = 1;
    }
  },
};
