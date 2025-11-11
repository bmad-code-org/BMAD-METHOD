const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');

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

    // Create .windsurf/workflows/bmad directory structure
    const windsurfDir = path.join(projectDir, this.configDir);
    const workflowsDir = path.join(windsurfDir, this.workflowsDir);
    const bmadWorkflowsDir = path.join(workflowsDir, 'bmad');

    await this.ensureDir(bmadWorkflowsDir);

    // Clean up any existing BMAD workflows before reinstalling
    await this.cleanup(projectDir);

    // Generate agent launchers
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);
    const { artifacts: agentArtifacts } = await agentGen.collectAgentArtifacts(bmadDir, options.selectedModules || []);

    // Convert artifacts to agent format for module organization
    const agents = agentArtifacts.map((a) => ({ module: a.module, name: a.name }));

    // Get tasks, tools, and workflows (standalone only)
    const tasks = await this.getTasks(bmadDir, true);
    const tools = await this.getTools(bmadDir, true);
    const workflows = await this.getWorkflows(bmadDir, true);

    // Create directories for each module under bmad/
    const modules = new Set();
    for (const item of [...agents, ...tasks, ...tools, ...workflows]) modules.add(item.module);

    for (const module of modules) {
      await this.ensureDir(path.join(bmadWorkflowsDir, module));
      await this.ensureDir(path.join(bmadWorkflowsDir, module, 'agents'));
      await this.ensureDir(path.join(bmadWorkflowsDir, module, 'tasks'));
      await this.ensureDir(path.join(bmadWorkflowsDir, module, 'tools'));
      await this.ensureDir(path.join(bmadWorkflowsDir, module, 'workflows'));
    }

    // Process agent launchers as workflows with organized structure
    let agentCount = 0;
    for (const artifact of agentArtifacts) {
      const processedContent = this.createWorkflowContent({ module: artifact.module, name: artifact.name }, artifact.content);

      // Organized path: bmad/module/agents/agent-name.md
      const targetPath = path.join(bmadWorkflowsDir, artifact.module, 'agents', `${artifact.name}.md`);
      await this.writeFile(targetPath, processedContent);
      agentCount++;
    }

    // Process tasks as workflows with organized structure
    let taskCount = 0;
    for (const task of tasks) {
      const content = await this.readFile(task.path);
      const processedContent = this.createTaskWorkflowContent(task, content);

      // Organized path: bmad/module/tasks/task-name.md
      const targetPath = path.join(bmadWorkflowsDir, task.module, 'tasks', `${task.name}.md`);
      await this.writeFile(targetPath, processedContent);
      taskCount++;
    }

    // Process tools as workflows with organized structure
    let toolCount = 0;
    for (const tool of tools) {
      const content = await this.readFile(tool.path);
      const processedContent = this.createToolWorkflowContent(tool, content);

      // Organized path: bmad/module/tools/tool-name.md
      const targetPath = path.join(bmadWorkflowsDir, tool.module, 'tools', `${tool.name}.md`);
      await this.writeFile(targetPath, processedContent);
      toolCount++;
    }

    // Process workflows with organized structure
    let workflowCount = 0;
    for (const workflow of workflows) {
      const content = await this.readFile(workflow.path);
      const processedContent = this.createWorkflowWorkflowContent(workflow, content);

      // Organized path: bmad/module/workflows/workflow-name.md
      const targetPath = path.join(bmadWorkflowsDir, workflow.module, 'workflows', `${workflow.name}.md`);
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
    // Strip existing frontmatter from launcher
    const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
    const contentWithoutFrontmatter = content.replace(frontmatterRegex, '');

    // Create simple Windsurf frontmatter matching original format
    let workflowContent = `---
description: ${agent.name}
auto_execution_mode: 3
---

${contentWithoutFrontmatter}`;

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
   * Cleanup Windsurf configuration - surgically remove only BMAD files
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');
    const bmadPath = path.join(projectDir, this.configDir, this.workflowsDir, 'bmad');

    if (await fs.pathExists(bmadPath)) {
      // Remove the entire bmad folder - this is our territory
      await fs.remove(bmadPath);
      console.log(chalk.dim(`  Cleaned up existing BMAD workflows`));
    }
  }
}

module.exports = { WindsurfSetup };
