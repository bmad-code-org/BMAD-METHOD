const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');

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

    // Get agents, tasks, tools, and workflows (standalone only)
    const agents = await this.getAgents(bmadDir);
    const tasks = await this.getTasks(bmadDir, true);
    const tools = await this.getTools(bmadDir, true);
    const workflows = await this.getWorkflows(bmadDir, true);

    // Organize by module
    const agentCount = await this.organizeByModule(commandsDir, agents, tasks, tools, workflows, projectDir);

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
  async organizeByModule(commandsDir, agents, tasks, tools, workflows, projectDir) {
    // Get unique modules
    const modules = new Set();
    for (const agent of agents) modules.add(agent.module);
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

      // Copy module-specific agents
      const moduleAgents = agents.filter((a) => a.module === module);
      for (const agent of moduleAgents) {
        const content = await this.readFile(agent.path);
        const commandContent = this.createAgentCommand(agent, content, projectDir);
        const targetPath = path.join(moduleAgentsDir, `${agent.name}.md`);
        await this.writeFile(targetPath, commandContent);
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
   * Create agent command content
   */
  createAgentCommand(agent, content, projectDir) {
    // Extract metadata
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(agent.name);

    const iconMatch = content.match(/icon="([^"]+)"/);
    const icon = iconMatch ? iconMatch[1] : '🤖';

    // Get relative path
    const relativePath = path.relative(projectDir, agent.path).replaceAll('\\', '/');

    let commandContent = `# /${agent.name} Command

When this command is used, adopt the following agent persona:

## ${icon} ${title} Agent

${content}

## Command Usage

This command activates the ${title} agent from the BMAD ${agent.module.toUpperCase()} module.

## File Reference

Complete agent definition: [${relativePath}](${relativePath})

## Module

Part of the BMAD ${agent.module.toUpperCase()} module.
`;

    return commandContent;
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
}

module.exports = { CrushSetup };
