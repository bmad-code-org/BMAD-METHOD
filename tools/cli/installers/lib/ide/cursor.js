const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');
const { WorkflowCommandGenerator } = require('./shared/workflow-command-generator');
const { TaskToolCommandGenerator } = require('./shared/task-tool-command-generator');

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
    const bmadRulesDir = path.join(projectDir, this.configDir, this.rulesDir, 'bmad');
    const bmadCommandsDir = path.join(projectDir, this.configDir, this.commandsDir, 'bmad');

    if (await fs.pathExists(bmadRulesDir)) {
      await fs.remove(bmadRulesDir);
      console.log(chalk.dim(`  Removed old BMAD rules from ${this.name}`));
    }

    if (await fs.pathExists(bmadCommandsDir)) {
      await fs.remove(bmadCommandsDir);
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
    const bmadCommandsDir = path.join(commandsDir, 'bmad');

    await this.ensureDir(bmadCommandsDir);

    // Generate agent launchers using AgentCommandGenerator
    // This creates small launcher files that reference the actual agents in _bmad/
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);
    const { artifacts: agentArtifacts, counts: agentCounts } = await agentGen.collectAgentArtifacts(bmadDir, options.selectedModules || []);

    // Create directories for each module
    const modules = new Set();
    for (const artifact of agentArtifacts) {
      modules.add(artifact.module);
    }

    for (const module of modules) {
      await this.ensureDir(path.join(bmadCommandsDir, module));
      await this.ensureDir(path.join(bmadCommandsDir, module, 'agents'));
    }

    // Write agent launcher files
    const agentCount = await agentGen.writeAgentLaunchers(bmadCommandsDir, agentArtifacts);

    // Generate workflow commands from manifest (if it exists)
    const workflowGen = new WorkflowCommandGenerator(this.bmadFolderName);
    const { artifacts: workflowArtifacts } = await workflowGen.collectWorkflowArtifacts(bmadDir);

    // Write only workflow-command artifacts, skip workflow-launcher READMEs
    let workflowCommandCount = 0;
    for (const artifact of workflowArtifacts) {
      if (artifact.type === 'workflow-command') {
        const moduleWorkflowsDir = path.join(bmadCommandsDir, artifact.module, 'workflows');
        await this.ensureDir(moduleWorkflowsDir);
        const commandPath = path.join(moduleWorkflowsDir, path.basename(artifact.relativePath));
        await this.writeFile(commandPath, artifact.content);
        workflowCommandCount++;
      }
      // Skip workflow-launcher READMEs as they would be treated as slash commands
    }

    // Generate task and tool commands from manifests (if they exist)
    const taskToolGen = new TaskToolCommandGenerator();
    const taskToolResult = await taskToolGen.generateTaskToolCommands(projectDir, bmadDir, bmadCommandsDir);

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
    console.log(chalk.dim(`  - Commands directory: ${path.relative(projectDir, bmadCommandsDir)}`));

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
    const customAgentsDir = path.join(projectDir, this.configDir, this.commandsDir, 'bmad', 'custom', 'agents');

    if (!(await this.exists(path.join(projectDir, this.configDir)))) {
      return null; // IDE not configured for this project
    }

    await this.ensureDir(customAgentsDir);

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

    const launcherPath = path.join(customAgentsDir, `${agentName}.md`);
    await this.writeFile(launcherPath, commandContent);

    return {
      path: launcherPath,
      command: `/bmad/custom/agents/${agentName}`,
    };
  }
}

module.exports = { CursorSetup };
