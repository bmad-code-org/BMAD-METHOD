const fs = require('node:fs');
const path = require('node:path');

let ClientModulePromise;
let StdioModulePromise;

async function loadSdkModules() {
  if (!ClientModulePromise) {
    ClientModulePromise = import('@modelcontextprotocol/sdk/client/index.js');
  }
  if (!StdioModulePromise) {
    StdioModulePromise = import('@modelcontextprotocol/sdk/client/stdio.js');
  }

  const [{ Client }, { StdioClientTransport }] = await Promise.all([
    ClientModulePromise,
    StdioModulePromise,
  ]);

  return { Client, StdioClientTransport };
}

class ChromeDevToolsMcpClient {
  constructor(options = {}) {
    this.options = options;
    this.client = null;
    this.transport = null;
    this.stderrBuffer = '';
  }

  async connect() {
    if (this.client) {
      return;
    }

    const { Client, StdioClientTransport } = await loadSdkModules();
    const transport = new StdioClientTransport(this.buildServerParameters());

    if (transport.stderr) {
      transport.stderr.on('data', (chunk) => {
        const message = chunk.toString();
        this.stderrBuffer += message;
        if (this.options.logFile) {
          fs.appendFileSync(this.options.logFile, message);
        }
      });
    }

    const client = new Client(
      {
        name: this.options.clientName ?? 'bmad-cli-chrome-mcp',
        version: this.options.clientVersion ?? '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          logging: {},
        },
      },
    );

    try {
      await client.connect(transport);
      await client.listTools({});
      this.client = client;
      this.transport = transport;
    } catch (error) {
      await transport.close();
      const diagnostic = this.stderrBuffer.trim();
      const message =
        diagnostic.length > 0 ? `${error.message}\n${diagnostic}` : error.message;
      throw new Error(`Failed to connect to chrome-devtools-mcp: ${message}`);
    }
  }

  async disconnect() {
    if (!this.client || !this.transport) {
      return;
    }

    await this.client.close();
    await this.transport.close();
    this.client = null;
    this.transport = null;
  }

  async listTools() {
    if (!this.client) {
      throw new Error('MCP client is not connected');
    }
    const result = await this.client.listTools({});
    return result.tools;
  }

  async callTool(name, args) {
    if (!this.client) {
      throw new Error('MCP client is not connected');
    }
    return this.client.callTool({ name, arguments: args });
  }

  buildServerParameters() {
    const args = ['chrome-devtools-mcp@latest'];

    if (this.options.browserUrl) {
      args.push(`--browser-url=${this.options.browserUrl}`);
    } else {
      const headless =
        this.options.headless === undefined ? true : Boolean(this.options.headless);
      const isolated =
        this.options.isolated === undefined ? true : Boolean(this.options.isolated);
      const viewport = this.options.viewport || '1280x720';
      args.push(`--headless=${headless}`);
      args.push(`--isolated=${isolated}`);
      args.push(`--viewport=${viewport}`);

      if (this.options.channel) {
        args.push(`--channel=${this.options.channel}`);
      }
      if (this.options.acceptInsecureCerts) {
        args.push('--acceptInsecureCerts=true');
      }
      if (this.options.executablePath) {
        args.push(`--executablePath=${this.options.executablePath}`);
      }
      if (Array.isArray(this.options.extraChromeArgs)) {
        for (const chromeArg of this.options.extraChromeArgs) {
          args.push(`--chromeArg=${chromeArg}`);
        }
      }
    }

    const logFile = this.options.logFile
      ? path.resolve(this.options.logFile)
      : undefined;
    if (logFile) {
      args.push(`--logFile=${logFile}`);
    }

    return {
      command: 'npx',
      args: ['-y', ...args],
      stderr: 'pipe',
      env: this.options.env,
      cwd: this.options.cwd,
    };
  }
}

module.exports = {
  ChromeDevToolsMcpClient,
};
