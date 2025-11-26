const path = require('node:path');
const fs = require('fs-extra');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');

/**
 * Trae IDE setup handler
 */
class TraeSetup extends BaseIdeSetup {
  constructor() {
    super('trae', 'Trae');
    this.configDir = '.trae';
    this.rulesDir = 'rules';
  }

  /**
   * Setup Trae IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Create .trae/rules directory
    const traeDir = path.join(projectDir, this.configDir);
    const rulesDir = path.join(traeDir, this.rulesDir);

    await this.ensureDir(rulesDir);

    // Clean up any existing BMAD files before reinstalling
    await this.cleanup(projectDir);

    // Generate agent launchers
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);
    const { artifacts: agentArtifacts } = await agentGen.collectAgentArtifacts(bmadDir, options.selectedModules || []);

    // Get tasks, tools, and workflows (standalone only)
    const tasks = await this.getTasks(bmadDir, true);
    const tools = await this.getTools(bmadDir, true);
    const workflows = await this.getWorkflows(bmadDir, true);

    // Process agents as rules with bmad- prefix
    let agentCount = 0;
    for (const artifact of agentArtifacts) {
      const processedContent = await this.createAgentRule(artifact, bmadDir, projectDir);

      // Use bmad- prefix: bmad-agent-{module}-{name}.md
      const targetPath = path.join(rulesDir, `bmad-agent-${artifact.module}-${artifact.name}.md`);
      await this.writeFile(targetPath, processedContent);
      agentCount++;
    }

    // Process tasks as rules with bmad- prefix
    let taskCount = 0;
    for (const task of tasks) {
      const content = await this.readFile(task.path);
      const processedContent = this.createTaskRule(task, content);

      // Use bmad- prefix: bmad-task-{module}-{name}.md
      const targetPath = path.join(rulesDir, `bmad-task-${task.module}-${task.name}.md`);
      await this.writeFile(targetPath, processedContent);
      taskCount++;
    }

    // Process tools as rules with bmad- prefix
    let toolCount = 0;
    for (const tool of tools) {
      const content = await this.readFile(tool.path);
      const processedContent = this.createToolRule(tool, content);

      // Use bmad- prefix: bmad-tool-{module}-{name}.md
      const targetPath = path.join(rulesDir, `bmad-tool-${tool.module}-${tool.name}.md`);
      await this.writeFile(targetPath, processedContent);
      toolCount++;
    }

    // Process workflows as rules with bmad- prefix
    let workflowCount = 0;
    for (const workflow of workflows) {
      const content = await this.readFile(workflow.path);
      const processedContent = this.createWorkflowRule(workflow, content);

      // Use bmad- prefix: bmad-workflow-{module}-{name}.md
      const targetPath = path.join(rulesDir, `bmad-workflow-${workflow.module}-${workflow.name}.md`);
      await this.writeFile(targetPath, processedContent);
      workflowCount++;
    }

    const totalRules = agentCount + taskCount + toolCount + workflowCount;

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${agentCount} agent rules created`));
    console.log(chalk.dim(`  - ${taskCount} task rules created`));
    console.log(chalk.dim(`  - ${toolCount} tool rules created`));
    console.log(chalk.dim(`  - ${workflowCount} workflow rules created`));
    console.log(chalk.dim(`  - Total: ${totalRules} rules`));
    console.log(chalk.dim(`  - Rules directory: ${path.relative(projectDir, rulesDir)}`));
    console.log(chalk.dim(`  - Agents can be activated with @{agent-name}`));

    return {
      success: true,
      rules: totalRules,
      agents: agentCount,
      tasks: taskCount,
      tools: toolCount,
      workflows: workflowCount,
    };
  }

  /**
   * Create rule content for an agent
   */
  async createAgentRule(artifact, bmadDir, projectDir) {
    // Strip frontmatter from launcher
    const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
    const contentWithoutFrontmatter = artifact.content.replace(frontmatterRegex, '').trim();

    // Extract metadata from launcher content
    const titleMatch = artifact.content.match(/description:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(artifact.name);

    // Calculate relative path for reference
    const relativePath = path.relative(projectDir, artifact.sourcePath).replaceAll('\\', '/');

    let ruleContent = `# ${title} Agent Rule

This rule is triggered when the user types \`@${artifact.name}\` and activates the ${title} agent persona.

## Agent Activation

${contentWithoutFrontmatter}

## File Reference

The full agent definition is located at: \`${relativePath}\`
`;

    return ruleContent;
  }

  /**
   * Create rule content for a task
   */
  createTaskRule(task, content) {
    // Extract task name from content
    const nameMatch = content.match(/name="([^"]+)"/);
    const taskName = nameMatch ? nameMatch[1] : this.formatTitle(task.name);

    let ruleContent = `# ${taskName} Task Rule

This rule defines the ${taskName} task workflow.

## Task Definition

When this task is triggered, execute the following workflow:

${content}

## Usage

Reference this task with \`@task-${task.name}\` to execute the defined workflow.

## Module

Part of the BMAD ${task.module.toUpperCase()} module.
`;

    return ruleContent;
  }

  /**
   * Create rule content for a tool
   */
  createToolRule(tool, content) {
    // Extract tool name from content
    const nameMatch = content.match(/name="([^"]+)"/);
    const toolName = nameMatch ? nameMatch[1] : this.formatTitle(tool.name);

    let ruleContent = `# ${toolName} Tool Rule

This rule defines the ${toolName} tool.

## Tool Definition

When this tool is triggered, execute the following:

${content}

## Usage

Reference this tool with \`@tool-${tool.name}\` to execute it.

## Module

Part of the BMAD ${tool.module.toUpperCase()} module.
`;

    return ruleContent;
  }

  /**
   * Create rule content for a workflow
   */
  createWorkflowRule(workflow, content) {
    let ruleContent = `# ${workflow.name} Workflow Rule

This rule defines the ${workflow.name} workflow.

## Workflow Description

${workflow.description || 'No description provided'}

## Workflow Definition

${content}

## Usage

Reference this workflow with \`@workflow-${workflow.name}\` to execute the guided workflow.

## Module

Part of the BMAD ${workflow.module.toUpperCase()} module.
`;

    return ruleContent;
  }

  /**
   * Format agent/task name as title
   */
  formatTitle(name) {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Cleanup Trae configuration - surgically remove only BMAD files
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');
    const rulesPath = path.join(projectDir, this.configDir, this.rulesDir);

    if (await fs.pathExists(rulesPath)) {
      // Only remove files that start with bmad- prefix
      const files = await fs.readdir(rulesPath);
      let removed = 0;

      for (const file of files) {
        if (file.startsWith('bmad-') && file.endsWith('.md')) {
          await fs.remove(path.join(rulesPath, file));
          removed++;
        }
      }

      if (removed > 0) {
        console.log(chalk.dim(`  Cleaned up ${removed} existing BMAD rules`));
      }
    }
  }

  /**
   * Install a custom agent launcher for Trae
   * @param {string} projectDir - Project directory
   * @param {string} agentName - Agent name (e.g., "fred-commit-poet")
   * @param {string} agentPath - Path to compiled agent (relative to project root)
   * @param {Object} metadata - Agent metadata
   * @returns {Object} Installation result
   */
  async installCustomAgentLauncher(projectDir, agentName, agentPath, metadata) {
    const traeDir = path.join(projectDir, this.configDir);
    const rulesDir = path.join(traeDir, this.rulesDir);

    // Create .trae/rules directory if it doesn't exist
    await fs.ensureDir(rulesDir);

    // Create custom agent launcher
    const launcherContent = `# ${agentName} Custom Agent

**⚠️ IMPORTANT**: Run @${agentPath} first to load the complete agent!

This is a launcher for the custom BMAD agent "${agentName}".

## Usage
1. First run: \`${agentPath}\` to load the complete agent
2. Then use this rule to activate ${agentName}

The agent will follow the persona and instructions from the main agent file.

---

*Generated by BMAD Method*`;

    const fileName = `bmad-agent-custom-${agentName.toLowerCase()}.md`;
    const launcherPath = path.join(rulesDir, fileName);

    // Write the launcher file
    await fs.writeFile(launcherPath, launcherContent, 'utf8');

    return {
      ide: 'trae',
      path: path.relative(projectDir, launcherPath),
      command: agentName,
      type: 'custom-agent-launcher',
    };
  }
}

module.exports = { TraeSetup };
