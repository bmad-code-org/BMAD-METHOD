const path = require('node:path');
const fs = require('fs-extra');
const { BaseIdeSetup } = require('./_base-ide');
const yaml = require('yaml');
const prompts = require('../../../lib/prompts');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');
const { WorkflowCommandGenerator } = require('./shared/workflow-command-generator');
const { TaskToolCommandGenerator } = require('./shared/task-tool-command-generator');

/**
 * IBM Bob IDE setup handler
 * Creates custom modes in .bob/custom_modes.yaml file
 */
class BobSetup extends BaseIdeSetup {
  constructor() {
    super('bob', 'IBM Bob');
    this.configFile = '.bob/custom_modes.yaml';
    this.detectionPaths = ['.bob'];
  }

  /**
   * Setup IBM Bob IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    if (!options.silent) await prompts.log.info(`Setting up ${this.name}...`);

    // Clean up any old BMAD installation first
    await this.cleanup(projectDir, options);

    // Load existing config (may contain non-BMAD modes and other settings)
    const bobModesPath = path.join(projectDir, this.configFile);
    let config = {};

    if (await this.pathExists(bobModesPath)) {
      const existingContent = await this.readFile(bobModesPath);
      try {
        config = yaml.parse(existingContent) || {};
      } catch {
        // If parsing fails, start fresh but warn user
        await prompts.log.warn('Warning: Could not parse existing .bob/custom_modes.yaml, starting fresh');
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

    // Write .bob/custom_modes.yaml file with proper YAML structure
    const finalContent = yaml.stringify(config, { lineWidth: 0 });
    const workflowsDir = path.join(projectDir, '.bob', 'workflows');

    let workflowCount = 0;
    let taskCount = 0;
    let toolCount = 0;

    try {
      await this.writeFile(bobModesPath, finalContent);

      // Generate workflow commands
      const workflowGenerator = new WorkflowCommandGenerator(this.bmadFolderName);
      const { artifacts: workflowArtifacts } = await workflowGenerator.collectWorkflowArtifacts(bmadDir);

      // Write to .bob/workflows/ directory
      await this.ensureDir(workflowsDir);

      // Clear old BMAD workflows before writing new ones
      await this.clearBmadWorkflows(workflowsDir);

      // Write workflow files
      workflowCount = await workflowGenerator.writeDashArtifacts(workflowsDir, workflowArtifacts);

      // Generate task and tool commands
      const taskToolGen = new TaskToolCommandGenerator(this.bmadFolderName);
      const { artifacts: taskToolArtifacts, counts: taskToolCounts } = await taskToolGen.collectTaskToolArtifacts(bmadDir);

      // Write task/tool files to workflows directory (same location as workflows)
      await taskToolGen.writeDashArtifacts(workflowsDir, taskToolArtifacts);
      taskCount = taskToolCounts.tasks || 0;
      toolCount = taskToolCounts.tools || 0;
    } catch (error) {
      // Roll back partial writes to avoid inconsistent state
      try {
        await fs.remove(bobModesPath);
      } catch {
        // Ignore cleanup errors
      }
      await this.clearBmadWorkflows(workflowsDir);
      throw new Error(`Failed to write Bob configuration: ${error.message}`);
    }

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
    // Extract title and icon from the compiled agent file's <agent> XML tag
    // artifact.content is the launcher template which does NOT contain these attributes
    let title = this.formatTitle(artifact.name);
    let icon = '🤖';

    if (artifact.sourcePath && (await this.pathExists(artifact.sourcePath))) {
      const agentContent = await this.readFile(artifact.sourcePath);
      const titleMatch = agentContent.match(/<agent[^>]*\stitle="([^"]+)"/);
      if (titleMatch) title = titleMatch[1];
      const iconMatch = agentContent.match(/<agent[^>]*\sicon="([^"]+)"/);
      if (iconMatch) icon = iconMatch[1];
    }

    const whenToUse = `Use for ${title} tasks`;

    // Get the activation header from central template (trim to avoid YAML formatting issues)
    const activationHeader = (await this.getAgentCommandHeader()).trim();

    const roleDefinition = `You are a ${title} specializing in ${title.toLowerCase()} tasks.`;

    // Get relative path (fall back to artifact name if sourcePath unavailable)
    const relativePath = artifact.sourcePath
      ? path.relative(projectDir, artifact.sourcePath).replaceAll('\\', '/')
      : `${this.bmadFolderName}/agents/${artifact.name}.md`;

    // Build mode object (Bob uses same schema as Kilo/Roo)
    return {
      slug: `bmad-${artifact.module}-${artifact.name}`,
      name: `${icon} ${title}`,
      roleDefinition: roleDefinition,
      whenToUse: whenToUse,
      customInstructions: `${activationHeader} Read the full agent definition from ${relativePath}. Start activation to assume this persona. Follow the startup section instructions. Stay in this mode until told to exit.\n`,
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
    if (!(await this.pathExists(workflowsDir))) return;

    const entries = await fs.readdir(workflowsDir);
    for (const entry of entries) {
      if (entry.startsWith('bmad-') && entry.endsWith('.md')) {
        await fs.remove(path.join(workflowsDir, entry));
      }
    }
  }

  /**
   * Cleanup IBM Bob configuration
   */
  async cleanup(projectDir, options = {}) {
    const bobModesPath = path.join(projectDir, this.configFile);

    if (await this.pathExists(bobModesPath)) {
      const content = await this.readFile(bobModesPath);

      try {
        const config = yaml.parse(content) || {};

        if (Array.isArray(config.customModes)) {
          const originalCount = config.customModes.length;
          // Remove BMAD modes only (keep non-BMAD modes)
          config.customModes = config.customModes.filter((mode) => !mode.slug || !mode.slug.startsWith('bmad-'));
          const removedCount = originalCount - config.customModes.length;

          if (removedCount > 0) {
            await this.writeFile(bobModesPath, yaml.stringify(config, { lineWidth: 0 }));
            if (!options.silent) await prompts.log.message(`Removed ${removedCount} BMAD modes from .bob/custom_modes.yaml`);
          }
        }
      } catch {
        // If parsing fails, leave file as-is
        if (!options.silent) await prompts.log.warn('Warning: Could not parse .bob/custom_modes.yaml for cleanup');
      }
    }

    // Clean up workflow files
    const workflowsDir = path.join(projectDir, '.bob', 'workflows');
    await this.clearBmadWorkflows(workflowsDir);
  }

  /**
   * Install a custom agent launcher for Bob
   * @param {string} projectDir - Project directory
   * @param {string} agentName - Agent name (e.g., "fred-commit-poet")
   * @param {string} agentPath - Path to compiled agent (relative to project root)
   * @param {Object} metadata - Agent metadata
   * @returns {Object} Installation result
   */
  async installCustomAgentLauncher(projectDir, agentName, agentPath, metadata) {
    const bobmodesPath = path.join(projectDir, this.configFile);
    let config = {};

    // Read existing .bob/custom_modes.yaml file
    if (await this.pathExists(bobmodesPath)) {
      const existingContent = await this.readFile(bobmodesPath);
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
        ide: 'bob',
        path: this.configFile,
        command: agentName,
        type: 'custom-agent-launcher',
        alreadyExists: true,
      };
    }

    // Add custom mode object
    const title = metadata?.title || `BMAD Custom: ${agentName}`;
    const icon = metadata?.icon || '🤖';
    const activationHeader = (await this.getAgentCommandHeader()).trim();
    config.customModes.push({
      slug: slug,
      name: `${icon} ${title}`,
      roleDefinition: `You are a custom BMAD agent "${agentName}". Follow the persona and instructions from the agent file.`,
      whenToUse: `Use for custom BMAD agent "${agentName}" tasks`,
      customInstructions: `${activationHeader} Read the full agent definition from ${agentPath}. Start activation to assume this persona. Follow the startup section instructions. Stay in this mode until told to exit.\n`,
      groups: ['read', 'edit', 'browser', 'command', 'mcp'],
    });

    // Write .bob/custom_modes.yaml file with proper YAML structure
    await this.writeFile(bobmodesPath, yaml.stringify(config, { lineWidth: 0 }));

    return {
      ide: 'bob',
      path: this.configFile,
      command: slug,
      type: 'custom-agent-launcher',
    };
  }
}

module.exports = { BobSetup };

// Made with Bob
