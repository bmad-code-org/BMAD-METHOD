const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const fs = require('fs-extra');
const yaml = require('yaml');

/**
 * Kiro CLI setup handler for BMad Method
 */
class KiroCliSetup extends BaseIdeSetup {
  constructor() {
    super('kiro-cli', 'Kiro CLI', false);
    this.configDir = '.kiro';
    this.agentsDir = 'agents';
  }

  /**
   * Cleanup old BMAD installation before reinstalling
   * @param {string} projectDir - Project directory
   */
  async cleanup(projectDir) {
    const bmadAgentsDir = path.join(projectDir, this.configDir, this.agentsDir);

    if (await fs.pathExists(bmadAgentsDir)) {
      // Remove existing BMad agents
      const files = await fs.readdir(bmadAgentsDir);
      for (const file of files) {
        if (file.startsWith('bmad-') || file.includes('bmad')) {
          await fs.remove(path.join(bmadAgentsDir, file));
        }
      }
      console.log(chalk.dim(`  Cleaned old BMAD agents from ${this.name}`));
    }
  }

  /**
   * Setup Kiro CLI configuration with BMad agents
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    await this.cleanup(projectDir);

    const kiroDir = path.join(projectDir, this.configDir);
    const agentsDir = path.join(kiroDir, this.agentsDir);

    await this.ensureDir(agentsDir);

    // Create BMad agents from source YAML files
    await this.createBmadAgentsFromSource(agentsDir, projectDir);

    console.log(chalk.green(`✓ ${this.name} configured with BMad agents`));
  }

  /**
   * Create BMad agent definitions from source YAML files
   * @param {string} agentsDir - Agents directory
   * @param {string} projectDir - Project directory
   */
  async createBmadAgentsFromSource(agentsDir, projectDir) {
    const sourceDir = path.join(__dirname, '../../../../../src/modules');

    // Find all agent YAML files
    const agentFiles = await this.findAgentFiles(sourceDir);

    for (const agentFile of agentFiles) {
      try {
        await this.processAgentFile(agentFile, agentsDir, projectDir);
      } catch (error) {
        console.warn(chalk.yellow(`⚠️  Failed to process ${agentFile}: ${error.message}`));
      }
    }
  }

  /**
   * Find all agent YAML files in modules and core
   * @param {string} sourceDir - Source modules directory
   * @returns {Array} Array of agent file paths
   */
  async findAgentFiles(sourceDir) {
    const agentFiles = [];

    // Check core agents
    const coreAgentsDir = path.join(__dirname, '../../../../../src/core/agents');
    if (await fs.pathExists(coreAgentsDir)) {
      const files = await fs.readdir(coreAgentsDir);

      for (const file of files) {
        if (file.endsWith('.agent.yaml')) {
          agentFiles.push(path.join(coreAgentsDir, file));
        }
      }
    }

    // Check module agents
    if (!(await fs.pathExists(sourceDir))) {
      return agentFiles;
    }

    const modules = await fs.readdir(sourceDir);

    for (const module of modules) {
      const moduleAgentsDir = path.join(sourceDir, module, 'agents');

      if (await fs.pathExists(moduleAgentsDir)) {
        const files = await fs.readdir(moduleAgentsDir);

        for (const file of files) {
          if (file.endsWith('.agent.yaml')) {
            agentFiles.push(path.join(moduleAgentsDir, file));
          }
        }
      }
    }

    return agentFiles;
  }

  /**
   * Validate BMad Core compliance
   * @param {Object} agentData - Agent YAML data
   * @returns {boolean} True if compliant
   */
  validateBmadCompliance(agentData) {
    const requiredFields = ['agent.metadata.id', 'agent.persona.role', 'agent.persona.principles'];

    for (const field of requiredFields) {
      const keys = field.split('.');
      let current = agentData;

      for (const key of keys) {
        if (!current || !current[key]) {
          return false;
        }
        current = current[key];
      }
    }

    return true;
  }

  /**
   * Process individual agent YAML file
   * @param {string} agentFile - Path to agent YAML file
   * @param {string} agentsDir - Target agents directory
   * @param {string} projectDir - Project directory
   */
  async processAgentFile(agentFile, agentsDir, projectDir) {
    const yamlContent = await fs.readFile(agentFile, 'utf8');
    const agentData = yaml.parse(yamlContent);

    if (!this.validateBmadCompliance(agentData)) {
      return;
    }

    // Extract module from file path
    const normalizedPath = path.normalize(agentFile);
    const pathParts = normalizedPath.split(path.sep);
    const basename = path.basename(agentFile, '.agent.yaml');

    // Find the module name from path
    let moduleName = 'unknown';
    if (pathParts.includes('src')) {
      const srcIndex = pathParts.indexOf('src');
      if (srcIndex + 3 < pathParts.length) {
        const folderAfterSrc = pathParts[srcIndex + 1];
        // Handle both src/core/agents and src/modules/[module]/agents patterns
        if (folderAfterSrc === 'core') {
          moduleName = 'core';
        } else if (folderAfterSrc === 'modules') {
          moduleName = pathParts[srcIndex + 2]; // The actual module name
        }
      }
    }

    // Extract the agent name from the ID path in YAML if available
    let agentBaseName = basename;
    if (agentData.agent && agentData.agent.metadata && agentData.agent.metadata.id) {
      const idPath = agentData.agent.metadata.id;
      agentBaseName = path.basename(idPath, '.md');
    }

    const agentName = `bmad-${moduleName}-${agentBaseName}`;
    const sanitizedAgentName = this.sanitizeAgentName(agentName);

    // Create JSON definition
    await this.createAgentDefinitionFromYaml(agentsDir, sanitizedAgentName, agentData);

    // Create prompt file
    await this.createAgentPromptFromYaml(agentsDir, sanitizedAgentName, agentData, projectDir);
  }

  /**
   * Sanitize agent name for file naming
   * @param {string} name - Agent name
   * @returns {string} Sanitized name
   */
  sanitizeAgentName(name) {
    return name
      .toLowerCase()
      .replaceAll(/\s+/g, '-')
      .replaceAll(/[^a-z0-9-]/g, '');
  }

  /**
   * Create agent JSON definition from YAML data
   * @param {string} agentsDir - Agents directory
   * @param {string} agentName - Agent name (role-based)
   * @param {Object} agentData - Agent YAML data
   */
  async createAgentDefinitionFromYaml(agentsDir, agentName, agentData) {
    const personName = agentData.agent.metadata.name;
    const role = agentData.agent.persona.role;

    const agentConfig = {
      name: agentName,
      description: `${personName} - ${role}`,
      prompt: `file://./${agentName}-prompt.md`,
      tools: ['*'],
      mcpServers: {},
      useLegacyMcpJson: true,
      resources: [],
    };

    const agentPath = path.join(agentsDir, `${agentName}.json`);
    await fs.writeJson(agentPath, agentConfig, { spaces: 2 });
  }

  /**
   * Create agent prompt from YAML data
   * @param {string} agentsDir - Agents directory
   * @param {string} agentName - Agent name (role-based)
   * @param {Object} agentData - Agent YAML data
   * @param {string} projectDir - Project directory
   */
  async createAgentPromptFromYaml(agentsDir, agentName, agentData, projectDir) {
    const promptPath = path.join(agentsDir, `${agentName}-prompt.md`);

    // Generate prompt from YAML data
    const prompt = this.generatePromptFromYaml(agentData);
    await fs.writeFile(promptPath, prompt);
  }

  /**
   * Generate prompt content from YAML data
   * @param {Object} agentData - Agent YAML data
   * @returns {string} Generated prompt
   */
  generatePromptFromYaml(agentData) {
    const agent = agentData.agent;
    const name = agent.metadata.name;
    const icon = agent.metadata.icon || '🤖';
    const role = agent.persona.role;
    const identity = agent.persona.identity;
    const style = agent.persona.communication_style;
    const principles = agent.persona.principles;

    let prompt = `# ${name} ${icon}\n\n`;
    prompt += `## Role\n${role}\n\n`;

    if (identity) {
      prompt += `## Identity\n${identity}\n\n`;
    }

    if (style) {
      prompt += `## Communication Style\n${style}\n\n`;
    }

    if (principles) {
      prompt += `## Principles\n`;
      if (typeof principles === 'string') {
        // Handle multi-line string principles
        prompt += principles + '\n\n';
      } else if (Array.isArray(principles)) {
        // Handle array principles
        for (const principle of principles) {
          prompt += `- ${principle}\n`;
        }
        prompt += '\n';
      }
    }

    // Add menu items if available
    if (agent.menu && agent.menu.length > 0) {
      prompt += `## Available Workflows\n`;
      for (let i = 0; i < agent.menu.length; i++) {
        const item = agent.menu[i];
        prompt += `${i + 1}. **${item.trigger}**: ${item.description}\n`;
      }
      prompt += '\n';
    }

    prompt += `## Instructions\nYou are ${name}, part of the BMad Method. Follow your role and principles while assisting users with their development needs.\n`;

    return prompt;
  }

  /**
   * Check if Kiro CLI is available
   * @returns {Promise<boolean>} True if available
   */
  async isAvailable() {
    try {
      const { execSync } = require('node:child_process');
      execSync('kiro-cli --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get installation instructions
   * @returns {string} Installation instructions
   */
  getInstallInstructions() {
    return `Install Kiro CLI:
  curl -fsSL https://github.com/aws/kiro-cli/releases/latest/download/install.sh | bash
  
  Or visit: https://github.com/aws/kiro-cli`;
  }
}

module.exports = { KiroCliSetup };
