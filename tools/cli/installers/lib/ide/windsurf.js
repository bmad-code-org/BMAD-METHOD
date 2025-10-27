const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');

/**
 * Windsurf IDE setup handler
 */
class WindsurfSetup extends BaseIdeSetup {
  constructor() {
    super('windsurf', 'Windsurf', true); // preferred IDE
    this.configDir = '.windsurf';
    this.workflowsDir = 'workflows';
  }

  /**
   * Setup Windsurf IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Create .windsurf/workflows directory structure
    const windsurfDir = path.join(projectDir, this.configDir);
    const workflowsDir = path.join(windsurfDir, this.workflowsDir);

    await this.ensureDir(workflowsDir);

    // Get agents, tasks, tools, and workflows (standalone only)
    const agents = await this.getAgents(bmadDir);
    const tasks = await this.getTasks(bmadDir, true);
    const tools = await this.getTools(bmadDir, true);
    const workflows = await this.getWorkflows(bmadDir, true);

    // Create directories for each module
    const modules = new Set();
    for (const item of [...agents, ...tasks, ...tools, ...workflows]) modules.add(item.module);

    for (const module of modules) {
      await this.ensureDir(path.join(workflowsDir, module));
      await this.ensureDir(path.join(workflowsDir, module, 'agents'));
      await this.ensureDir(path.join(workflowsDir, module, 'tasks'));
      await this.ensureDir(path.join(workflowsDir, module, 'tools'));
      await this.ensureDir(path.join(workflowsDir, module, 'workflows'));
    }

    // Process agents as workflows with organized structure
    let agentCount = 0;
    for (const agent of agents) {
      const content = await this.readFile(agent.path);
      const processedContent = this.createWorkflowContent(agent, content);

      // Organized path: module/agents/agent-name.md
      const targetPath = path.join(workflowsDir, agent.module, 'agents', `${agent.name}.md`);
      await this.writeFile(targetPath, processedContent);
      agentCount++;
    }

    // Process tasks as workflows with organized structure
    let taskCount = 0;
    for (const task of tasks) {
      const content = await this.readFile(task.path);
      const processedContent = this.createTaskWorkflowContent(task, content);

      // Organized path: module/tasks/task-name.md
      const targetPath = path.join(workflowsDir, task.module, 'tasks', `${task.name}.md`);
      await this.writeFile(targetPath, processedContent);
      taskCount++;
    }

    // Process tools as workflows with organized structure
    let toolCount = 0;
    for (const tool of tools) {
      const content = await this.readFile(tool.path);
      const processedContent = this.createToolWorkflowContent(tool, content);

      // Organized path: module/tools/tool-name.md
      const targetPath = path.join(workflowsDir, tool.module, 'tools', `${tool.name}.md`);
      await this.writeFile(targetPath, processedContent);
      toolCount++;
    }

    // Process workflows with organized structure
    let workflowCount = 0;
    for (const workflow of workflows) {
      const content = await this.readFile(workflow.path);
      const processedContent = this.createWorkflowWorkflowContent(workflow, content);

      // Organized path: module/workflows/workflow-name.md
      const targetPath = path.join(workflowsDir, workflow.module, 'workflows', `${workflow.name}.md`);
      await this.writeFile(targetPath, processedContent);
      workflowCount++;
    }

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${agentCount} agents installed`));
    console.log(chalk.dim(`  - ${taskCount} tasks installed`));
    console.log(chalk.dim(`  - ${toolCount} tools installed`));
    console.log(chalk.dim(`  - ${workflowCount} workflows installed`));
    console.log(chalk.dim(`  - Organized in modules: ${[...modules].join(', ')}`));
    console.log(chalk.dim(`  - Workflows directory: ${path.relative(projectDir, workflowsDir)}`));

    // Provide additional configuration hints
    if (options.showHints !== false) {
      console.log(chalk.dim('\n  Windsurf workflow settings:'));
      console.log(chalk.dim('  - auto_execution_mode: 3 (recommended for agents)'));
      console.log(chalk.dim('  - auto_execution_mode: 2 (recommended for tasks/tools)'));
      console.log(chalk.dim('  - auto_execution_mode: 1 (recommended for workflows)'));
      console.log(chalk.dim('  - Workflows can be triggered via the Windsurf menu'));
    }

    return {
      success: true,
      agents: agentCount,
      tasks: taskCount,
      tools: toolCount,
      workflows: workflowCount,
    };
  }

  /**
   * Create workflow content for an agent
   */
  createWorkflowContent(agent, content) {
    // Create simple Windsurf frontmatter matching original format
    let workflowContent = `---
description: ${agent.name}
auto_execution_mode: 3
---

${content}`;

    return workflowContent;
  }

  /**
   * Create workflow content for a task
   */
  createTaskWorkflowContent(task, content) {
    // Create simple Windsurf frontmatter matching original format
    let workflowContent = `---
description: task-${task.name}
auto_execution_mode: 2
---

${content}`;

    return workflowContent;
  }

  /**
   * Create workflow content for a tool
   */
  createToolWorkflowContent(tool, content) {
    // Create simple Windsurf frontmatter matching original format
    let workflowContent = `---
description: tool-${tool.name}
auto_execution_mode: 2
---

${content}`;

    return workflowContent;
  }

  /**
   * Create workflow content for a workflow
   */
  createWorkflowWorkflowContent(workflow, content) {
    // Create simple Windsurf frontmatter matching original format
    let workflowContent = `---
description: ${workflow.name}
auto_execution_mode: 1
---

${content}`;

    return workflowContent;
  }

  /**
   * Cleanup Windsurf configuration
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');
    const windsurfPath = path.join(projectDir, this.configDir, this.workflowsDir);

    if (await fs.pathExists(windsurfPath)) {
      // Only remove BMAD workflows, not all workflows
      const files = await fs.readdir(windsurfPath);
      let removed = 0;

      for (const file of files) {
        if (file.includes('-') && file.endsWith('.md')) {
          const filePath = path.join(windsurfPath, file);
          const content = await fs.readFile(filePath, 'utf8');

          // Check if it's a BMAD workflow
          if (content.includes('tags: [bmad')) {
            await fs.remove(filePath);
            removed++;
          }
        }
      }

      console.log(chalk.dim(`Removed ${removed} BMAD workflows from Windsurf`));
    }
  }
}

module.exports = { WindsurfSetup };
