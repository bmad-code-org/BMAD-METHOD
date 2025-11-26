const path = require('node:path');
const fs = require('fs-extra');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');

/**
 * Crush IDE setup handler
 * Creates commands in .crush/commands/ directory structure
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

    // Create .crush/commands/bmad directory structure
    const crushDir = path.join(projectDir, this.configDir);
    const commandsDir = path.join(crushDir, this.commandsDir, 'bmad');

    await this.ensureDir(commandsDir);

    // Generate agent launchers
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);
    const { artifacts: agentArtifacts } = await agentGen.collectAgentArtifacts(bmadDir, options.selectedModules || []);

    // Get tasks, tools, and workflows (standalone only)
    const tasks = await this.getTasks(bmadDir, true);
    const tools = await this.getTools(bmadDir, true);
    const workflows = await this.getWorkflows(bmadDir, true);

    // Organize by module
    const agentCount = await this.organizeByModule(commandsDir, agentArtifacts, tasks, tools, workflows, projectDir);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${agentCount.agents} agent commands created`));
    console.log(chalk.dim(`  - ${agentCount.tasks} task commands created`));
    console.log(chalk.dim(`  - ${agentCount.tools} tool commands created`));
    console.log(chalk.dim(`  - ${agentCount.workflows} workflow commands created`));
    console.log(chalk.dim(`  - Commands directory: ${path.relative(projectDir, commandsDir)}`));
    console.log(chalk.dim('\n  Commands can be accessed via Crush command palette'));

    return {
      success: true,
      ...agentCount,
    };
  }

  /**
   * Organize commands by module
   */
  async organizeByModule(commandsDir, agentArtifacts, tasks, tools, workflows, projectDir) {
    // Get unique modules
    const modules = new Set();
    for (const artifact of agentArtifacts) modules.add(artifact.module);
    for (const task of tasks) modules.add(task.module);
    for (const tool of tools) modules.add(tool.module);
    for (const workflow of workflows) modules.add(workflow.module);

    let agentCount = 0;
    let taskCount = 0;
    let toolCount = 0;
    let workflowCount = 0;

    // Create module directories
    for (const module of modules) {
      const moduleDir = path.join(commandsDir, module);
      const moduleAgentsDir = path.join(moduleDir, 'agents');
      const moduleTasksDir = path.join(moduleDir, 'tasks');
      const moduleToolsDir = path.join(moduleDir, 'tools');
      const moduleWorkflowsDir = path.join(moduleDir, 'workflows');

      await this.ensureDir(moduleAgentsDir);
      await this.ensureDir(moduleTasksDir);
      await this.ensureDir(moduleToolsDir);
      await this.ensureDir(moduleWorkflowsDir);

      // Write module-specific agent launchers
      const moduleAgents = agentArtifacts.filter((a) => a.module === module);
      for (const artifact of moduleAgents) {
        const targetPath = path.join(moduleAgentsDir, `${artifact.name}.md`);
        await this.writeFile(targetPath, artifact.content);
        agentCount++;
      }

      // Copy module-specific tasks
      const moduleTasks = tasks.filter((t) => t.module === module);
      for (const task of moduleTasks) {
        const content = await this.readFile(task.path);
        const commandContent = this.createTaskCommand(task, content);
        const targetPath = path.join(moduleTasksDir, `${task.name}.md`);
        await this.writeFile(targetPath, commandContent);
        taskCount++;
      }

      // Copy module-specific tools
      const moduleTools = tools.filter((t) => t.module === module);
      for (const tool of moduleTools) {
        const content = await this.readFile(tool.path);
        const commandContent = this.createToolCommand(tool, content);
        const targetPath = path.join(moduleToolsDir, `${tool.name}.md`);
        await this.writeFile(targetPath, commandContent);
        toolCount++;
      }

      // Copy module-specific workflows
      const moduleWorkflows = workflows.filter((w) => w.module === module);
      for (const workflow of moduleWorkflows) {
        const content = await this.readFile(workflow.path);
        const commandContent = this.createWorkflowCommand(workflow, content);
        const targetPath = path.join(moduleWorkflowsDir, `${workflow.name}.md`);
        await this.writeFile(targetPath, commandContent);
        workflowCount++;
      }
    }

    return {
      agents: agentCount,
      tasks: taskCount,
      tools: toolCount,
      workflows: workflowCount,
    };
  }

  /**
   * Create task command content
   */
  createTaskCommand(task, content) {
    // Extract task name
    const nameMatch = content.match(/name="([^"]+)"/);
    const taskName = nameMatch ? nameMatch[1] : this.formatTitle(task.name);

    let commandContent = `# /task-${task.name} Command

When this command is used, execute the following task:

## ${taskName} Task

${content}

## Command Usage

This command executes the ${taskName} task from the BMAD ${task.module.toUpperCase()} module.

## Module

Part of the BMAD ${task.module.toUpperCase()} module.
`;

    return commandContent;
  }

  /**
   * Create tool command content
   */
  createToolCommand(tool, content) {
    // Extract tool name
    const nameMatch = content.match(/name="([^"]+)"/);
    const toolName = nameMatch ? nameMatch[1] : this.formatTitle(tool.name);

    let commandContent = `# /tool-${tool.name} Command

When this command is used, execute the following tool:

## ${toolName} Tool

${content}

## Command Usage

This command executes the ${toolName} tool from the BMAD ${tool.module.toUpperCase()} module.

## Module

Part of the BMAD ${tool.module.toUpperCase()} module.
`;

    return commandContent;
  }

  /**
   * Create workflow command content
   */
  createWorkflowCommand(workflow, content) {
    const workflowName = workflow.name ? this.formatTitle(workflow.name) : 'Workflow';

    let commandContent = `# /${workflow.name} Command

When this command is used, execute the following workflow:

## ${workflowName} Workflow

${content}

## Command Usage

This command executes the ${workflowName} workflow from the BMAD ${workflow.module.toUpperCase()} module.

## Module

Part of the BMAD ${workflow.module.toUpperCase()} module.
`;

    return commandContent;
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
   * Cleanup Crush configuration
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');
    const bmadCommandsDir = path.join(projectDir, this.configDir, this.commandsDir, 'bmad');

    if (await fs.pathExists(bmadCommandsDir)) {
      await fs.remove(bmadCommandsDir);
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
    const crushDir = path.join(projectDir, this.configDir);
    const bmadCommandsDir = path.join(crushDir, this.commandsDir, 'bmad');

    // Create .crush/commands/bmad directory if it doesn't exist
    await fs.ensureDir(bmadCommandsDir);

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

    const fileName = `custom-${agentName.toLowerCase()}.md`;
    const launcherPath = path.join(bmadCommandsDir, fileName);

    // Write the launcher file
    await fs.writeFile(launcherPath, launcherContent, 'utf8');

    return {
      ide: 'crush',
      path: path.relative(projectDir, launcherPath),
      command: agentName,
      type: 'custom-agent-launcher',
    };
  }
}

module.exports = { CrushSetup };
