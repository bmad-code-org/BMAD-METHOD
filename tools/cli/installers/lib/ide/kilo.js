const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const yaml = require('yaml');
const prompts = require('../../../lib/prompts');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');
const { WorkflowCommandGenerator } = require('./shared/workflow-command-generator');
const { TaskToolCommandGenerator } = require('./shared/task-tool-command-generator');

/**
 * KiloCode IDE setup handler
 * Creates custom modes in .kilocodemodes file (similar to Roo)
 */
class KiloSetup extends BaseIdeSetup {
  constructor() {
    super('kilo', 'Kilo Code');
    this.configFile = '.kilocodemodes';
  }

  /**
   * Setup KiloCode IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    if (!options.silent) await prompts.log.info(`Setting up ${this.name}...`);

    // Clean up any old BMAD installation first
    await this.cleanup(projectDir, options);

    // Load existing config (may contain non-BMAD modes and other settings)
    const kiloModesPath = path.join(projectDir, this.configFile);
    let config = {};

    if (await this.pathExists(kiloModesPath)) {
      const existingContent = await this.readFile(kiloModesPath);
      try {
        config = yaml.parse(existingContent) || {};
      } catch {
        // If parsing fails, start fresh but warn user
        await prompts.log.warn('Warning: Could not parse existing .kilocodemodes, starting fresh');
        config = {};
      }
    }

    // Ensure customModes array exists
    if (!Array.isArray(config.customModes)) {
      config.customModes = [];
    }

    // Generate agent launchers
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);
    const { artifacts: agentArtifacts } = await agentGen.collectAgentArtifacts(bmadDir, options.selectedModules || []);

    // Create mode objects and add to config
    let addedCount = 0;

    for (const artifact of agentArtifacts) {
      const modeObject = await this.createModeObject(artifact, projectDir);
      config.customModes.push(modeObject);
      addedCount++;
    }

    // Write .kilocodemodes file with proper YAML structure
    const finalContent = yaml.stringify(config, { lineWidth: 0 });
    await this.writeFile(kiloModesPath, finalContent);

    // Generate workflow commands
    const workflowGenerator = new WorkflowCommandGenerator(this.bmadFolderName);
    const { artifacts: workflowArtifacts } = await workflowGenerator.collectWorkflowArtifacts(bmadDir);

    // Write to .kilocode/workflows/ directory
    const workflowsDir = path.join(projectDir, '.kilocode', 'workflows');
    await this.ensureDir(workflowsDir);

    // Clear old BMAD workflows before writing new ones
    await this.clearBmadWorkflows(workflowsDir);

    // Write workflow files
    const workflowCount = await workflowGenerator.writeDashArtifacts(workflowsDir, workflowArtifacts);

    // Generate task and tool commands
    const taskToolGen = new TaskToolCommandGenerator(this.bmadFolderName);
    const { artifacts: taskToolArtifacts, counts: taskToolCounts } = await taskToolGen.collectTaskToolArtifacts(bmadDir);

    // Write task/tool files to workflows directory (same location as workflows)
    await taskToolGen.writeDashArtifacts(workflowsDir, taskToolArtifacts);
    const taskCount = taskToolCounts.tasks || 0;
    const toolCount = taskToolCounts.tools || 0;

    if (!options.silent) {
      await prompts.log.success(
        `${this.name} configured: ${addedCount} modes, ${workflowCount} workflows, ${taskCount} tasks, ${toolCount} tools → ${this.configFile}`,
      );
    }

    return {
      success: true,
      modes: addedCount,
      workflows: workflowCount,
      tasks: taskCount,
      tools: toolCount,
    };
  }

  /**
   * Create a mode object for an agent
   * @param {Object} artifact - Agent artifact
   * @param {string} projectDir - Project directory
   * @returns {Object} Mode object for YAML serialization
   */
  async createModeObject(artifact, projectDir) {
    // Extract metadata from launcher content
    const titleMatch = artifact.content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(artifact.name);

    const iconMatch = artifact.content.match(/icon="([^"]+)"/);
    const icon = iconMatch ? iconMatch[1] : '🤖';

    const whenToUseMatch = artifact.content.match(/whenToUse="([^"]+)"/);
    const whenToUse = whenToUseMatch ? whenToUseMatch[1] : `Use for ${title} tasks`;

    // Get the activation header from central template (trim to avoid YAML formatting issues)
    const activationHeader = (await this.getAgentCommandHeader()).trim();

    const roleDefinitionMatch = artifact.content.match(/roleDefinition="([^"]+)"/);
    const roleDefinition = roleDefinitionMatch
      ? roleDefinitionMatch[1]
      : `You are a ${title} specializing in ${title.toLowerCase()} tasks.`;

    // Get relative path
    const relativePath = path.relative(projectDir, artifact.sourcePath).replaceAll('\\', '/');

    // Build mode object (KiloCode uses same schema as Roo)
    return {
      slug: `bmad-${artifact.module}-${artifact.name}`,
      name: `${icon} ${title}`,
      roleDefinition: roleDefinition,
      whenToUse: whenToUse,
      customInstructions: `${activationHeader} Read the full YAML from ${relativePath} start activation to alter your state of being follow startup section instructions stay in this being until told to exit this mode\n`,
      groups: ['read', 'edit', 'browser', 'command', 'mcp'],
    };
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
   * Clear old BMAD workflow files from workflows directory
   * @param {string} workflowsDir - Workflows directory path
   */
  async clearBmadWorkflows(workflowsDir) {
    const fs = require('fs-extra');
    if (!(await fs.pathExists(workflowsDir))) return;

    const entries = await fs.readdir(workflowsDir);
    for (const entry of entries) {
      if (entry.startsWith('bmad-') && entry.endsWith('.md')) {
        await fs.remove(path.join(workflowsDir, entry));
      }
    }
  }

  /**
   * Cleanup KiloCode configuration
   */
  async cleanup(projectDir, options = {}) {
    const fs = require('fs-extra');
    const kiloModesPath = path.join(projectDir, this.configFile);

    if (await fs.pathExists(kiloModesPath)) {
      const content = await fs.readFile(kiloModesPath, 'utf8');

      try {
        const config = yaml.parse(content) || {};

        if (Array.isArray(config.customModes)) {
          const originalCount = config.customModes.length;
          // Remove BMAD modes only (keep non-BMAD modes)
          config.customModes = config.customModes.filter((mode) => !mode.slug || !mode.slug.startsWith('bmad-'));
          const removedCount = originalCount - config.customModes.length;

          if (removedCount > 0) {
            await fs.writeFile(kiloModesPath, yaml.stringify(config, { lineWidth: 0 }));
            if (!options.silent) await prompts.log.message(`Removed ${removedCount} BMAD modes from .kilocodemodes`);
          }
        }
      } catch {
        // If parsing fails, leave file as-is
        if (!options.silent) await prompts.log.warn('Warning: Could not parse .kilocodemodes for cleanup');
      }
    }

    // Clean up workflow files
    const workflowsDir = path.join(projectDir, '.kilocode', 'workflows');
    await this.clearBmadWorkflows(workflowsDir);
  }

  /**
   * Install a custom agent launcher for Kilo
   * @param {string} projectDir - Project directory
   * @param {string} agentName - Agent name (e.g., "fred-commit-poet")
   * @param {string} agentPath - Path to compiled agent (relative to project root)
   * @param {Object} metadata - Agent metadata
   * @returns {Object} Installation result
   */
  async installCustomAgentLauncher(projectDir, agentName, agentPath, metadata) {
    const kilocodemodesPath = path.join(projectDir, this.configFile);
    let config = {};

    // Read existing .kilocodemodes file
    if (await this.pathExists(kilocodemodesPath)) {
      const existingContent = await this.readFile(kilocodemodesPath);
      try {
        config = yaml.parse(existingContent) || {};
      } catch {
        config = {};
      }
    }

    // Ensure customModes array exists
    if (!Array.isArray(config.customModes)) {
      config.customModes = [];
    }

    // Create custom agent mode object
    const slug = `bmad-custom-${agentName.toLowerCase()}`;

    // Check if mode already exists
    if (config.customModes.some((mode) => mode.slug === slug)) {
      return {
        ide: 'kilo',
        path: this.configFile,
        command: agentName,
        type: 'custom-agent-launcher',
        alreadyExists: true,
      };
    }

    // Add custom mode object
    config.customModes.push({
      slug: slug,
      name: `BMAD Custom: ${agentName}`,
      description: `Custom BMAD agent: ${agentName}\n\n**⚠️ IMPORTANT**: Run @${agentPath} first to load the complete agent!\n\nThis is a launcher for the custom BMAD agent "${agentName}". The agent will follow the persona and instructions from the main agent file.\n`,
      prompt: `@${agentPath}\n`,
      always: false,
      permissions: 'all',
    });

    // Write .kilocodemodes file with proper YAML structure
    await this.writeFile(kilocodemodesPath, yaml.stringify(config, { lineWidth: 0 }));

    return {
      ide: 'kilo',
      path: this.configFile,
      command: slug,
      type: 'custom-agent-launcher',
    };
  }
}

module.exports = { KiloSetup };
