const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');

/**
 * Roo IDE setup handler
 * Creates custom commands in .roo/commands directory
 */
class RooSetup extends BaseIdeSetup {
  constructor() {
    super('roo', 'Roo Code');
    this.configDir = '.roo';
    this.commandsDir = 'commands';
  }

  /**
   * Setup Roo IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Create .roo/commands directory
    const rooCommandsDir = path.join(projectDir, this.configDir, this.commandsDir);
    await this.ensureDir(rooCommandsDir);

    // Generate agent launchers
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);
    const { artifacts: agentArtifacts } = await agentGen.collectAgentArtifacts(bmadDir, options.selectedModules || []);

    let addedCount = 0;
    let skippedCount = 0;

    for (const artifact of agentArtifacts) {
      const commandName = `bmad-${artifact.module}-agent-${artifact.name}`;
      const commandPath = path.join(rooCommandsDir, `${commandName}.md`);

      // Skip if already exists
      if (await this.pathExists(commandPath)) {
        console.log(chalk.dim(`  Skipping ${commandName} - already exists`));
        skippedCount++;
        continue;
      }

      // artifact.sourcePath contains the full path to the agent file
      if (!artifact.sourcePath) {
        console.error(`Error: Missing sourcePath for artifact ${artifact.name} from module ${artifact.module}`);
        console.error(`Artifact object:`, artifact);
        throw new Error(`Missing sourcePath for agent: ${artifact.name}`);
      }

      const content = await this.readFile(artifact.sourcePath);

      // Create command file that references the actual _bmad agent
      await this.createCommandFile(
        { module: artifact.module, name: artifact.name, path: artifact.sourcePath },
        content,
        commandPath,
        projectDir,
      );

      addedCount++;
      console.log(chalk.green(`  ✓ Added command: ${commandName}`));
    }

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${addedCount} commands added`));
    if (skippedCount > 0) {
      console.log(chalk.dim(`  - ${skippedCount} commands skipped (already exist)`));
    }
    console.log(chalk.dim(`  - Commands directory: ${this.configDir}/${this.commandsDir}/bmad/`));
    console.log(chalk.dim(`  Commands will be available when you open this project in Roo Code`));

    return {
      success: true,
      commands: addedCount,
      skipped: skippedCount,
    };
  }

  /**
   * Create a unified command file for agents
   * @param {string} commandPath - Path where to write the command file
   * @param {Object} options - Command options
   * @param {string} options.name - Display name for the command
   * @param {string} options.description - Description for the command
   * @param {string} options.agentPath - Path to the agent file (relative to project root)
   * @param {string} [options.icon] - Icon emoji (defaults to 🤖)
   * @param {string} [options.extraContent] - Additional content to include before activation
   */
  async createAgentCommandFile(commandPath, options) {
    const { name, description, agentPath, icon = '🤖', extraContent = '' } = options;

    // Build command content with YAML frontmatter
    let commandContent = `---\n`;
    commandContent += `name: '${icon} ${name}'\n`;
    commandContent += `description: '${description}'\n`;
    commandContent += `---\n\n`;

    commandContent += `You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.\n\n`;

    // Add any extra content (e.g., warnings for custom agents)
    if (extraContent) {
      commandContent += `${extraContent}\n\n`;
    }

    commandContent += `<agent-activation CRITICAL="TRUE">\n`;
    commandContent += `1. LOAD the FULL agent file from @${agentPath}\n`;
    commandContent += `2. READ its entire contents - this contains the complete agent persona, menu, and instructions\n`;
    commandContent += `3. Execute ALL activation steps exactly as written in the agent file\n`;
    commandContent += `4. Follow the agent's persona and menu system precisely\n`;
    commandContent += `5. Stay in character throughout the session\n`;
    commandContent += `</agent-activation>\n`;

    // Write command file
    await this.writeFile(commandPath, commandContent);
  }

  /**
   * Create a command file for an agent
   */
  async createCommandFile(agent, content, commandPath, projectDir) {
    // Extract metadata from agent content
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(agent.name);

    const iconMatch = content.match(/icon="([^"]+)"/);
    const icon = iconMatch ? iconMatch[1] : '🤖';

    const whenToUseMatch = content.match(/whenToUse="([^"]+)"/);
    const whenToUse = whenToUseMatch ? whenToUseMatch[1] : `Use for ${title} tasks`;

    // Get relative path
    const relativePath = path.relative(projectDir, agent.path).replaceAll('\\', '/');

    // Use unified method
    await this.createAgentCommandFile(commandPath, {
      name: title,
      description: whenToUse,
      agentPath: relativePath,
      icon: icon,
    });
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
   * Cleanup Roo configuration
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');
    const rooCommandsDir = path.join(projectDir, this.configDir, this.commandsDir);

    if (await fs.pathExists(rooCommandsDir)) {
      const files = await fs.readdir(rooCommandsDir);
      let removedCount = 0;

      for (const file of files) {
        if (file.startsWith('bmad-') && file.endsWith('.md')) {
          await fs.remove(path.join(rooCommandsDir, file));
          removedCount++;
        }
      }

      if (removedCount > 0) {
        console.log(chalk.dim(`Removed ${removedCount} BMAD commands from .roo/commands/`));
      }
    }

    // Also clean up old .roomodes file if it exists
    const roomodesPath = path.join(projectDir, '.roomodes');
    if (await fs.pathExists(roomodesPath)) {
      const content = await fs.readFile(roomodesPath, 'utf8');

      // Remove BMAD modes only
      const lines = content.split('\n');
      const filteredLines = [];
      let skipMode = false;
      let removedCount = 0;

      for (const line of lines) {
        if (/^\s*- slug: bmad-/.test(line)) {
          skipMode = true;
          removedCount++;
        } else if (skipMode && /^\s*- slug: /.test(line)) {
          skipMode = false;
        }

        if (!skipMode) {
          filteredLines.push(line);
        }
      }

      // Write back filtered content
      await fs.writeFile(roomodesPath, filteredLines.join('\n'));
      if (removedCount > 0) {
        console.log(chalk.dim(`Removed ${removedCount} BMAD modes from legacy .roomodes file`));
      }
    }
  }

  /**
   * Install a custom agent launcher for Roo
   * @param {string} projectDir - Project directory
   * @param {string} agentName - Agent name (e.g., "fred-commit-poet")
   * @param {string} agentPath - Path to compiled agent (relative to project root)
   * @param {Object} metadata - Agent metadata (unused, kept for compatibility)
   * @returns {Object} Installation result
   */
  async installCustomAgentLauncher(projectDir, agentName, agentPath, metadata) {
    const rooCommandsDir = path.join(projectDir, this.configDir, this.commandsDir);
    await this.ensureDir(rooCommandsDir);

    const commandName = `bmad-custom-agent-${agentName.toLowerCase()}`;
    const commandPath = path.join(rooCommandsDir, `${commandName}.md`);

    // Check if command already exists
    if (await this.pathExists(commandPath)) {
      return {
        ide: 'roo',
        path: path.join(this.configDir, this.commandsDir, `${commandName}.md`),
        command: commandName,
        type: 'custom-agent-launcher',
        alreadyExists: true,
      };
    }

    // Read the custom agent file to extract metadata (same as regular agents)
    const fullAgentPath = path.join(projectDir, agentPath);
    const content = await this.readFile(fullAgentPath);

    // Extract metadata from agent content
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(agentName);

    const iconMatch = content.match(/icon="([^"]+)"/);
    const icon = iconMatch ? iconMatch[1] : '🤖';

    const whenToUseMatch = content.match(/whenToUse="([^"]+)"/);
    const whenToUse = whenToUseMatch ? whenToUseMatch[1] : `Use for ${title} tasks`;

    // Use unified method without extra content (clean)
    await this.createAgentCommandFile(commandPath, {
      name: title,
      description: whenToUse,
      agentPath: agentPath,
      icon: icon,
    });

    return {
      ide: 'roo',
      path: path.join(this.configDir, this.commandsDir, `${commandName}.md`),
      command: commandName,
      type: 'custom-agent-launcher',
    };
  }
}

module.exports = { RooSetup };
