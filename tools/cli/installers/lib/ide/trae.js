const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');

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

    // Get agents, tasks, tools, and workflows (standalone only)
    const agents = await this.getAgents(bmadDir);
    const tasks = await this.getTasks(bmadDir, true);
    const tools = await this.getTools(bmadDir, true);
    const workflows = await this.getWorkflows(bmadDir, true);

    // Process agents as rules with bmad- prefix
    let agentCount = 0;
    for (const agent of agents) {
      const content = await this.readFile(agent.path);
      const processedContent = this.createAgentRule(agent, content, bmadDir, projectDir);

      // Use bmad- prefix: bmad-agent-{module}-{name}.md
      const targetPath = path.join(rulesDir, `bmad-agent-${agent.module}-${agent.name}.md`);
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
  createAgentRule(agent, content, bmadDir, projectDir) {
    // Extract metadata from agent content
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(agent.name);

    const iconMatch = content.match(/icon="([^"]+)"/);
    const icon = iconMatch ? iconMatch[1] : '🤖';

    // Extract YAML content if available
    const yamlMatch = content.match(/```ya?ml\r?\n([\s\S]*?)```/);
    const yamlContent = yamlMatch ? yamlMatch[1] : content;

    // Calculate relative path for reference
    const relativePath = path.relative(projectDir, agent.path).replaceAll('\\', '/');

    let ruleContent = `# ${title} Agent Rule

This rule is triggered when the user types \`@${agent.name}\` and activates the ${title} agent persona.

## Agent Activation

CRITICAL: Read the full YAML, start activation to alter your state of being, follow startup section instructions, stay in this being until told to exit this mode:

\`\`\`yaml
${yamlContent}
\`\`\`

## File Reference

The complete agent definition is available in [${relativePath}](${relativePath}).

## Usage

When the user types \`@${agent.name}\`, activate this ${title} persona and follow all instructions defined in the YAML configuration above.

## Module

Part of the BMAD ${agent.module.toUpperCase()} module.
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
}

module.exports = { TraeSetup };
