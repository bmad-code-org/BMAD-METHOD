const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');
const { WorkflowCommandGenerator } = require('./shared/workflow-command-generator');
const { TaskToolCommandGenerator } = require('./shared/task-tool-command-generator');
const { customAgentColonName } = require('./shared/path-utils');

/**
 * Cursor IDE setup handler
 */
class CursorSetup extends BaseIdeSetup {
  constructor() {
    super('cursor', 'Cursor', true); // preferred IDE
    this.configDir = '.cursor';
    this.rulesDir = 'rules';
    this.commandsDir = 'commands';
  }

  /**
   * Cleanup old BMAD installation before reinstalling
   * @param {string} projectDir - Project directory
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');
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
      console.log(chalk.dim(`  Removed old BMAD commands from ${this.name}`));
    }
  }

  /**
   * Setup Cursor IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Clean up old BMAD installation first
    await this.cleanup(projectDir);

    // Create .cursor/commands directory structure
    const cursorDir = path.join(projectDir, this.configDir);
    const commandsDir = path.join(cursorDir, this.commandsDir);
    await this.ensureDir(commandsDir);

    // Use underscore format: files written directly to commands dir (no bmad subfolder)
    // Creates: .cursor/commands/bmad_bmm_pm.md

    // Generate agent launchers using AgentCommandGenerator
    // This creates small launcher files that reference the actual agents in _bmad/
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);
    const { artifacts: agentArtifacts, counts: agentCounts } = await agentGen.collectAgentArtifacts(bmadDir, options.selectedModules || []);

    // Write agent launcher files using flat underscore naming
    // Creates files like: bmad_bmm_pm.md
    const agentCount = await agentGen.writeColonArtifacts(commandsDir, agentArtifacts);

    // Generate workflow commands from manifest (if it exists)
    const workflowGen = new WorkflowCommandGenerator(this.bmadFolderName);
    const { artifacts: workflowArtifacts } = await workflowGen.collectWorkflowArtifacts(bmadDir);

    // Write workflow-command artifacts using flat underscore naming
    // Creates files like: bmad_bmm_correct-course.md
    const workflowCommandCount = await workflowGen.writeColonArtifacts(commandsDir, workflowArtifacts);

    // Generate task and tool commands from manifests (if they exist)
    const taskToolGen = new TaskToolCommandGenerator();
    const taskToolResult = await taskToolGen.generateColonTaskToolCommands(projectDir, bmadDir, commandsDir);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${agentCount} agents installed`));
    if (workflowCommandCount > 0) {
      console.log(chalk.dim(`  - ${workflowCommandCount} workflow commands generated`));
    }
    if (taskToolResult.generated > 0) {
      console.log(
        chalk.dim(
          `  - ${taskToolResult.generated} task/tool commands generated (${taskToolResult.tasks} tasks, ${taskToolResult.tools} tools)`,
        ),
      );
    }
    console.log(chalk.dim(`  - Commands directory: ${path.relative(projectDir, commandsDir)}`));

    return {
      success: true,
      agents: agentCount,
      tasks: taskToolResult.tasks || 0,
      tools: taskToolResult.tools || 0,
      workflows: workflowCommandCount,
    };
  }

  /**
   * Install a custom agent launcher for Cursor
   * @param {string} projectDir - Project directory
   * @param {string} agentName - Agent name (e.g., "fred-commit-poet")
   * @param {string} agentPath - Path to compiled agent (relative to project root)
   * @param {Object} metadata - Agent metadata
   * @returns {Object|null} Info about created command
   */
  async installCustomAgentLauncher(projectDir, agentName, agentPath, metadata) {
    const commandsDir = path.join(projectDir, this.configDir, this.commandsDir);

    if (!(await this.exists(path.join(projectDir, this.configDir)))) {
      return null; // IDE not configured for this project
    }

    await this.ensureDir(commandsDir);

    const launcherContent = `You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.

<agent-activation CRITICAL="TRUE">
1. LOAD the FULL agent file from @${agentPath}
2. READ its entire contents - this contains the complete agent persona, menu, and instructions
3. FOLLOW every step in the <activation> section precisely
4. DISPLAY the welcome/greeting as instructed
5. PRESENT the numbered menu
6. WAIT for user input before proceeding
</agent-activation>
`;

    // Cursor uses YAML frontmatter matching Claude Code format
    const commandContent = `---
name: '${agentName}'
description: '${agentName} agent'
---

${launcherContent}
`;

    // Use underscore format: bmad_custom_fred-commit-poet.md
    // Written directly to commands dir (no bmad subfolder)
    const launcherName = customAgentColonName(agentName);
    const launcherPath = path.join(commandsDir, launcherName);
    await this.writeFile(launcherPath, commandContent);

    return {
      path: launcherPath,
      command: `/${launcherName.replace('.md', '')}`,
    };
  }
}

module.exports = { CursorSetup };
