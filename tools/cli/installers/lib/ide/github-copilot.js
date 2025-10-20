const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const inquirer = require('inquirer');

/**
 * GitHub Copilot setup handler
 * Creates chat modes in .github/chatmodes/ and configures VS Code settings
 */
class GitHubCopilotSetup extends BaseIdeSetup {
  constructor() {
    super('github-copilot', 'GitHub Copilot', true); // preferred IDE
    this.configDir = '.github';
    this.chatmodesDir = 'chatmodes';
    this.vscodeDir = '.vscode';
  }

  /**
   * Collect configuration choices before installation
   * @param {Object} options - Configuration options
   * @returns {Object} Collected configuration
   */
  async collectConfiguration(options = {}) {
    const config = {};

    console.log('\n' + chalk.blue('  🔧 VS Code Settings Configuration'));
    console.log(chalk.dim('  GitHub Copilot works best with specific settings\n'));

    const response = await inquirer.prompt([
      {
        type: 'list',
        name: 'configChoice',
        message: 'How would you like to configure VS Code settings?',
        choices: [
          { name: 'Use recommended defaults (fastest)', value: 'defaults' },
          { name: 'Configure each setting manually', value: 'manual' },
          { name: 'Skip settings configuration', value: 'skip' },
        ],
        default: 'defaults',
      },
    ]);
    config.vsCodeConfig = response.configChoice;

    if (response.configChoice === 'manual') {
      config.manualSettings = await inquirer.prompt([
        {
          type: 'input',
          name: 'maxRequests',
          message: 'Maximum requests per session (1-50)?',
          default: '15',
          validate: (input) => {
            const num = parseInt(input);
            return (num >= 1 && num <= 50) || 'Enter 1-50';
          },
        },
        {
          type: 'confirm',
          name: 'runTasks',
          message: 'Allow running workspace tasks?',
          default: true,
        },
        {
          type: 'confirm',
          name: 'mcpDiscovery',
          message: 'Enable MCP server discovery?',
          default: true,
        },
        {
          type: 'confirm',
          name: 'autoFix',
          message: 'Enable automatic error fixing?',
          default: true,
        },
        {
          type: 'confirm',
          name: 'autoApprove',
          message: 'Auto-approve tools (less secure)?',
          default: false,
        },
      ]);
    }

    return config;
  }

  /**
   * Setup GitHub Copilot configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Configure VS Code settings using pre-collected config if available
    const config = options.preCollectedConfig || {};
    await this.configureVsCodeSettings(projectDir, { ...options, ...config });

    // Create .github/chatmodes directory
    const githubDir = path.join(projectDir, this.configDir);
    const chatmodesDir = path.join(githubDir, this.chatmodesDir);
    await this.ensureDir(chatmodesDir);

    // Get agents
    const agents = await this.getAgents(bmadDir);

    // Create chat mode files
    let modeCount = 0;
    for (const agent of agents) {
      const content = await this.readFile(agent.path);
      const chatmodeContent = this.createChatmodeContent(agent, content);

      const targetPath = path.join(chatmodesDir, `${agent.module}-${agent.name}.chatmode.md`);
      await this.writeFile(targetPath, chatmodeContent);
      modeCount++;

      console.log(chalk.green(`  ✓ Created chat mode: ${agent.module}-${agent.name}`));
    }

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${modeCount} chat modes created`));
    console.log(chalk.dim(`  - Chat modes directory: ${path.relative(projectDir, chatmodesDir)}`));
    console.log(chalk.dim(`  - VS Code settings configured`));
    console.log(chalk.dim('\n  Chat modes available in VS Code Chat view'));

    return {
      success: true,
      chatmodes: modeCount,
      settings: true,
    };
  }

  /**
   * Configure VS Code settings for GitHub Copilot
   */
  async configureVsCodeSettings(projectDir, options) {
    const fs = require('fs-extra');
    const vscodeDir = path.join(projectDir, this.vscodeDir);
    const settingsPath = path.join(vscodeDir, 'settings.json');

    await this.ensureDir(vscodeDir);

    // Read existing settings
    let existingSettings = {};
    if (await fs.pathExists(settingsPath)) {
      try {
        const content = await fs.readFile(settingsPath, 'utf8');
        existingSettings = JSON.parse(content);
        console.log(chalk.yellow('  Found existing .vscode/settings.json'));
      } catch {
        console.warn(chalk.yellow('  Could not parse settings.json, creating new'));
      }
    }

    // Use pre-collected configuration or skip if not available
    let configChoice = options.vsCodeConfig;
    if (!configChoice) {
      // If no pre-collected config, skip configuration
      console.log(chalk.yellow('  ⚠ No configuration collected, skipping VS Code settings'));
      return;
    }

    if (configChoice === 'skip') {
      console.log(chalk.yellow('  ⚠ Skipping VS Code settings'));
      return;
    }

    let bmadSettings = {};

    if (configChoice === 'defaults') {
      bmadSettings = {
        'chat.agent.enabled': true,
        'chat.agent.maxRequests': 15,
        'github.copilot.chat.agent.runTasks': true,
        'chat.mcp.discovery.enabled': true,
        'github.copilot.chat.agent.autoFix': true,
        'chat.tools.autoApprove': false,
      };
      console.log(chalk.green('  ✓ Using recommended defaults'));
    } else {
      // Manual configuration - use pre-collected settings
      const manual = options.manualSettings || {};

      bmadSettings = {
        'chat.agent.enabled': true,
        'chat.agent.maxRequests': parseInt(manual.maxRequests || 15),
        'github.copilot.chat.agent.runTasks': manual.runTasks === undefined ? true : manual.runTasks,
        'chat.mcp.discovery.enabled': manual.mcpDiscovery === undefined ? true : manual.mcpDiscovery,
        'github.copilot.chat.agent.autoFix': manual.autoFix === undefined ? true : manual.autoFix,
        'chat.tools.autoApprove': manual.autoApprove || false,
      };
    }

    // Merge settings (existing take precedence)
    const mergedSettings = { ...bmadSettings, ...existingSettings };

    // Write settings
    await fs.writeFile(settingsPath, JSON.stringify(mergedSettings, null, 2));
    console.log(chalk.green('  ✓ VS Code settings configured'));
  }

  /**
   * Create chat mode content
   */
  createChatmodeContent(agent, content) {
    // Extract metadata
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(agent.name);

    const whenToUseMatch = content.match(/whenToUse="([^"]+)"/);
    const description = whenToUseMatch ? whenToUseMatch[1] : `Activates the ${title} agent persona.`;

    // Available GitHub Copilot tools
    const tools = [
      'changes',
      'codebase',
      'fetch',
      'findTestFiles',
      'githubRepo',
      'problems',
      'usages',
      'editFiles',
      'new',
      'runCommands',
      'runTasks',
      'runTests',
      'search',
      'searchResults',
      'terminalLastCommand',
      'terminalSelection',
      'testFailure',
    ];

    let chatmodeContent = `---
description: "${description.replaceAll('"', String.raw`\"`)}"
tools: ${JSON.stringify(tools)}
---

# ${title} Agent

${content}

## Module

Part of the BMAD ${agent.module.toUpperCase()} module.
`;

    return chatmodeContent;
  }

  /**
   * Format name as title
   */
  formatTitle(name) {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Cleanup GitHub Copilot configuration
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');
    const chatmodesDir = path.join(projectDir, this.configDir, this.chatmodesDir);

    if (await fs.pathExists(chatmodesDir)) {
      // Remove BMAD chat modes
      const files = await fs.readdir(chatmodesDir);
      let removed = 0;

      for (const file of files) {
        if (file.endsWith('.chatmode.md')) {
          const filePath = path.join(chatmodesDir, file);
          const content = await fs.readFile(filePath, 'utf8');

          if (content.includes('BMAD') && content.includes('Module')) {
            await fs.remove(filePath);
            removed++;
          }
        }
      }

      console.log(chalk.dim(`Removed ${removed} BMAD chat modes from GitHub Copilot`));
    }
  }
}

module.exports = { GitHubCopilotSetup };
