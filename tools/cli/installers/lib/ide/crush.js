const path = require('node:path');
const fs = require('fs-extra');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');
const { WorkflowCommandGenerator } = require('./shared/workflow-command-generator');
const { TaskToolCommandGenerator } = require('./shared/task-tool-command-generator');
const { customAgentColonName } = require('./shared/path-utils');

/**
 * Crush IDE setup handler
 * Creates commands in .crush/commands/ directory structure using flat colon naming
 */
class CrushSetup extends BaseIdeSetup {
  constructor() {
    super('crush', 'Crush');
    this.configDir = '.crush';
    this.commandsDir = 'commands';
  }

  /**
   * Setup Crush IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Clean up old BMAD installation first
    await this.cleanup(projectDir);

    // Create .crush/commands directory
    const crushDir = path.join(projectDir, this.configDir);
    const commandsDir = path.join(crushDir, this.commandsDir);
    await this.ensureDir(commandsDir);

    // Use underscore format: files written directly to commands dir (no bmad subfolder)
    // Creates: .crush/commands/bmad_bmm_pm.md

    // Generate agent launchers
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);
    const { artifacts: agentArtifacts } = await agentGen.collectAgentArtifacts(bmadDir, options.selectedModules || []);

    // Write agent launcher files using flat underscore naming
    // Creates files like: bmad_bmm_pm.md
    const agentCount = await agentGen.writeColonArtifacts(commandsDir, agentArtifacts);

    // Get ALL workflows using the new workflow command generator
    const workflowGenerator = new WorkflowCommandGenerator(this.bmadFolderName);
    const { artifacts: workflowArtifacts } = await workflowGenerator.collectWorkflowArtifacts(bmadDir);

    // Write workflow-command artifacts using flat underscore naming
    // Creates files like: bmad_bmm_correct-course.md
    const workflowCount = await workflowGenerator.writeColonArtifacts(commandsDir, workflowArtifacts);

    // Generate task and tool commands using flat underscore naming
    const taskToolGen = new TaskToolCommandGenerator();
    const taskToolResult = await taskToolGen.generateColonTaskToolCommands(projectDir, bmadDir, commandsDir);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${agentCount} agent commands created`));
    console.log(chalk.dim(`  - ${taskToolResult.tasks} task commands created`));
    console.log(chalk.dim(`  - ${taskToolResult.tools} tool commands created`));
    console.log(chalk.dim(`  - ${workflowCount} workflow commands created`));
    console.log(chalk.dim(`  - Commands directory: ${path.relative(projectDir, commandsDir)}`));
    console.log(chalk.dim('\n  Commands can be accessed via Crush command palette'));

    return {
      success: true,
      agents: agentCount,
      tasks: taskToolResult.tasks || 0,
      tools: taskToolResult.tools || 0,
      workflows: workflowCount,
    };
  }

  /**
   * Cleanup Crush configuration
   */
  async cleanup(projectDir) {
    const commandsDir = path.join(projectDir, this.configDir, this.commandsDir);

    // Remove any bmad* files from the commands directory (cleans up old bmad: and bmad- formats)
    if (await fs.pathExists(commandsDir)) {
      const entries = await fs.readdir(commandsDir);
      for (const entry of entries) {
        if (entry.startsWith('bmad')) {
          await fs.remove(path.join(commandsDir, entry));
        }
      }
    }
    // Also remove legacy bmad folder if it exists
    const bmadFolder = path.join(commandsDir, 'bmad');
    if (await fs.pathExists(bmadFolder)) {
      await fs.remove(bmadFolder);
      console.log(chalk.dim(`Removed BMAD commands from Crush`));
    }
  }

  /**
   * Install a custom agent launcher for Crush
   * @param {string} projectDir - Project directory
   * @param {string} agentName - Agent name (e.g., "fred-commit-poet")
   * @param {string} agentPath - Path to compiled agent (relative to project root)
   * @param {Object} metadata - Agent metadata
   * @returns {Object} Installation result
   */
  async installCustomAgentLauncher(projectDir, agentName, agentPath, metadata) {
    const commandsDir = path.join(projectDir, this.configDir, this.commandsDir);

    // Create .crush/commands directory if it doesn't exist
    await fs.ensureDir(commandsDir);

    // Create custom agent launcher
    const launcherContent = `# ${agentName} Custom Agent

**⚠️ IMPORTANT**: Run @${agentPath} first to load the complete agent!

This is a launcher for the custom BMAD agent "${agentName}".

## Usage
1. First run: \`${agentPath}\` to load the complete agent
2. Then use this command to activate ${agentName}

The agent will follow the persona and instructions from the main agent file.

---

*Generated by BMAD Method*`;

    // Use underscore format: bmad_custom_fred-commit-poet.md
    // Written directly to commands dir (no bmad subfolder)
    const launcherName = customAgentColonName(agentName);
    const launcherPath = path.join(commandsDir, launcherName);

    // Write the launcher file
    await fs.writeFile(launcherPath, launcherContent, 'utf8');

    return {
      ide: 'crush',
      path: path.relative(projectDir, launcherPath),
      command: launcherName.replace('.md', ''),
      type: 'custom-agent-launcher',
    };
  }
}

module.exports = { CrushSetup };
