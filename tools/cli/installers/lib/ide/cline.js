const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const inquirer = require('inquirer');

/**
 * Cline IDE setup handler
 * Creates rules in .clinerules directory with ordering support
 */
class ClineSetup extends BaseIdeSetup {
  constructor() {
    super('cline', 'Cline');
    this.configDir = '.clinerules';
    this.defaultOrder = {
      core: 10,
      bmm: 20,
      cis: 30,
      other: 99,
    };
  }

  /**
   * Collect configuration choices before installation
   * @param {Object} options - Configuration options
   * @returns {Object} Collected configuration
   */
  async collectConfiguration(options = {}) {
    const response = await inquirer.prompt([
      {
        type: 'list',
        name: 'ordering',
        message: 'How should BMAD rules be ordered in Cline?',
        choices: [
          { name: 'By module (core first, then modules)', value: 'module' },
          { name: 'By importance (dev agents first)', value: 'importance' },
          { name: 'Alphabetical (simple A-Z ordering)', value: 'alphabetical' },
          { name: "Custom (I'll reorder manually)", value: 'custom' },
        ],
        default: 'module',
      },
    ]);

    return { ordering: response.ordering };
  }

  /**
   * Setup Cline IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    const preCollectedConfig = options.preCollectedConfig || null;

    // Create .clinerules directory
    const clineRulesDir = path.join(projectDir, this.configDir);
    await this.ensureDir(clineRulesDir);

    // Get agents and tasks
    const agents = await this.getAgents(bmadDir);
    const tasks = await this.getTasks(bmadDir);

    // Use pre-collected configuration if available
    const config = preCollectedConfig || {};
    const orderingStrategy = config.ordering || options.ordering || 'module';

    // Process agents as rules with ordering
    let ruleCount = 0;
    for (const agent of agents) {
      const content = await this.readFile(agent.path);
      const order = this.getOrder(agent, orderingStrategy);
      const processedContent = this.createAgentRule(agent, content, projectDir);

      // Use numeric prefix for ordering
      const prefix = order.toString().padStart(2, '0');
      const targetPath = path.join(clineRulesDir, `${prefix}-${agent.module}-${agent.name}.md`);

      await this.writeFile(targetPath, processedContent);
      ruleCount++;
    }

    // Process tasks with ordering
    for (const task of tasks) {
      const content = await this.readFile(task.path);
      const order = this.getTaskOrder(task, orderingStrategy);
      const processedContent = this.createTaskRule(task, content);

      // Tasks get higher order numbers to appear after agents
      const prefix = (order + 50).toString().padStart(2, '0');
      const targetPath = path.join(clineRulesDir, `${prefix}-task-${task.module}-${task.name}.md`);

      await this.writeFile(targetPath, processedContent);
      ruleCount++;
    }

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${ruleCount} rules created in ${path.relative(projectDir, clineRulesDir)}`));
    console.log(chalk.dim(`  - Ordering: ${orderingStrategy}`));

    // Important message about toggle system
    console.log(chalk.yellow('\n  ⚠️  IMPORTANT: Cline Toggle System'));
    console.log(chalk.cyan('  Rules are OFF by default to avoid context pollution'));
    console.log(chalk.dim('  To use BMAD agents:'));
    console.log(chalk.dim('    1. Click rules icon below chat input'));
    console.log(chalk.dim('    2. Toggle ON the specific agent you need'));
    console.log(chalk.dim('    3. Type @{agent-name} to activate'));
    console.log(chalk.dim('    4. Toggle OFF when done to free context'));
    console.log(chalk.dim('\n  💡 Best practice: Only enable 1-2 agents at a time'));

    return {
      success: true,
      rules: ruleCount,
      ordering: orderingStrategy,
      persistedConfig: { ordering: orderingStrategy },
    };
  }

  /**
   * Ask user about rule ordering strategy
   */
  async askOrderingStrategy() {
    const response = await inquirer.prompt([
      {
        type: 'list',
        name: 'ordering',
        message: 'How should BMAD rules be ordered in Cline?',
        choices: [
          { name: 'By module (core first, then modules)', value: 'module' },
          { name: 'By importance (dev agents first)', value: 'importance' },
          { name: 'Alphabetical (simple A-Z ordering)', value: 'alphabetical' },
          { name: "Custom (I'll reorder manually)", value: 'custom' },
        ],
        default: 'module',
      },
    ]);

    return response.ordering;
  }

  /**
   * Get order number for an agent based on strategy
   */
  getOrder(agent, strategy) {
    switch (strategy) {
      case 'module': {
        return this.defaultOrder[agent.module] || this.defaultOrder.other;
      }

      case 'importance': {
        // Prioritize certain agent types
        if (agent.name.includes('dev') || agent.name.includes('code')) return 10;
        if (agent.name.includes('architect') || agent.name.includes('design')) return 15;
        if (agent.name.includes('test') || agent.name.includes('qa')) return 20;
        if (agent.name.includes('doc') || agent.name.includes('write')) return 25;
        if (agent.name.includes('review')) return 30;
        return 40;
      }

      case 'alphabetical': {
        // Use a fixed number, files will sort alphabetically by name
        return 50;
      }

      default: {
        // 'custom' or any other value - user will reorder manually
        return 99;
      }
    }
  }

  /**
   * Get order number for a task
   */
  getTaskOrder(task, strategy) {
    // Tasks always come after agents
    return this.getOrder(task, strategy) + 50;
  }

  /**
   * Create rule content for an agent
   */
  createAgentRule(agent, content, projectDir) {
    // Extract metadata
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(agent.name);

    // Extract YAML content
    const yamlMatch = content.match(/```ya?ml\r?\n([\s\S]*?)```/);
    const yamlContent = yamlMatch ? yamlMatch[1] : content;

    // Get relative path
    const relativePath = path.relative(projectDir, agent.path).replaceAll('\\', '/');

    let ruleContent = `# ${title} Agent

This rule defines the ${title} persona and project standards.

## Role Definition

When the user types \`@${agent.name}\`, adopt this persona and follow these guidelines:

\`\`\`yaml
${yamlContent}
\`\`\`

## Project Standards

- Always maintain consistency with project documentation in BMAD directories
- Follow the agent's specific guidelines and constraints
- Update relevant project files when making changes
- Reference the complete agent definition in [${relativePath}](${relativePath})

## Usage

Type \`@${agent.name}\` to activate this ${title} persona.

## Module

Part of the BMAD ${agent.module.toUpperCase()} module.
`;

    return ruleContent;
  }

  /**
   * Create rule content for a task
   */
  createTaskRule(task, content) {
    // Extract task name
    const nameMatch = content.match(/<name>([^<]+)<\/name>/);
    const taskName = nameMatch ? nameMatch[1] : this.formatTitle(task.name);

    let ruleContent = `# ${taskName} Task

This rule defines the ${taskName} task workflow.

## Task Workflow

When this task is referenced, execute the following steps:

${content}

## Project Integration

- This task follows BMAD Method standards
- Ensure all outputs align with project conventions
- Update relevant documentation after task completion

## Usage

Reference with \`@task-${task.name}\` to access this workflow.

## Module

Part of the BMAD ${task.module.toUpperCase()} module.
`;

    return ruleContent;
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
   * Cleanup Cline configuration
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');
    const clineRulesDir = path.join(projectDir, this.configDir);

    if (await fs.pathExists(clineRulesDir)) {
      // Remove all numbered BMAD rules
      const files = await fs.readdir(clineRulesDir);
      let removed = 0;

      for (const file of files) {
        // Check if it matches our naming pattern (XX-module-name.md)
        if (/^\d{2}-.*\.md$/.test(file)) {
          const filePath = path.join(clineRulesDir, file);
          const content = await fs.readFile(filePath, 'utf8');

          // Verify it's a BMAD rule
          if (content.includes('BMAD') && content.includes('Module')) {
            await fs.remove(filePath);
            removed++;
          }
        }
      }

      console.log(chalk.dim(`Removed ${removed} BMAD rules from Cline`));
    }
  }
}

module.exports = { ClineSetup };
