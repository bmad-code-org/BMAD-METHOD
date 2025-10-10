const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');

/**
 * Qwen Code setup handler
 * Creates TOML command files in .qwen/commands/BMad/
 */
class QwenSetup extends BaseIdeSetup {
  constructor() {
    super('qwen', 'Qwen Code');
    this.configDir = '.qwen';
    this.commandsDir = 'commands';
    this.bmadDir = 'BMad';
  }

  /**
   * Setup Qwen Code configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Create .qwen/commands/BMad directory structure
    const qwenDir = path.join(projectDir, this.configDir);
    const commandsDir = path.join(qwenDir, this.commandsDir);
    const bmadCommandsDir = path.join(commandsDir, this.bmadDir);
    const agentsDir = path.join(bmadCommandsDir, 'agents');
    const tasksDir = path.join(bmadCommandsDir, 'tasks');

    await this.ensureDir(agentsDir);
    await this.ensureDir(tasksDir);

    // Update existing settings.json if present
    await this.updateSettings(qwenDir);

    // Clean up old configuration if exists
    await this.cleanupOldConfig(qwenDir);

    // Get agents and tasks
    const agents = await this.getAgents(bmadDir);
    const tasks = await this.getTasks(bmadDir);

    // Create TOML files for each agent
    let agentCount = 0;
    for (const agent of agents) {
      const content = await this.readFile(agent.path);
      const tomlContent = this.createAgentToml(agent, content, projectDir);
      const tomlPath = path.join(agentsDir, `${agent.name}.toml`);
      await this.writeFile(tomlPath, tomlContent);
      agentCount++;
      console.log(chalk.green(`  ✓ Added agent: /BMad:agents:${agent.name}`));
    }

    // Create TOML files for each task
    let taskCount = 0;
    for (const task of tasks) {
      const content = await this.readFile(task.path);
      const tomlContent = this.createTaskToml(task, content, projectDir);
      const tomlPath = path.join(tasksDir, `${task.name}.toml`);
      await this.writeFile(tomlPath, tomlContent);
      taskCount++;
      console.log(chalk.green(`  ✓ Added task: /BMad:tasks:${task.name}`));
    }

    // Create concatenated QWEN.md for reference
    let concatenatedContent = `# BMAD Method - Qwen Code Configuration

This file contains all BMAD agents and tasks configured for use with Qwen Code.

## Agents
Agents can be activated using: \`/BMad:agents:<agent-name>\`

## Tasks
Tasks can be executed using: \`/BMad:tasks:<task-name>\`

---

`;

    for (const agent of agents) {
      const content = await this.readFile(agent.path);
      const agentSection = this.createAgentSection(agent, content, projectDir);
      concatenatedContent += agentSection;
      concatenatedContent += '\n\n---\n\n';
    }

    for (const task of tasks) {
      const content = await this.readFile(task.path);
      const taskSection = this.createTaskSection(task, content, projectDir);
      concatenatedContent += taskSection;
      concatenatedContent += '\n\n---\n\n';
    }

    const qwenMdPath = path.join(bmadCommandsDir, 'QWEN.md');
    await this.writeFile(qwenMdPath, concatenatedContent);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${agentCount} agents configured`));
    console.log(chalk.dim(`  - ${taskCount} tasks configured`));
    console.log(chalk.dim(`  - Agents activated with: /BMad:agents:<agent-name>`));
    console.log(chalk.dim(`  - Tasks activated with: /BMad:tasks:<task-name>`));

    return {
      success: true,
      agents: agentCount,
      tasks: taskCount,
    };
  }

  /**
   * Update settings.json to remove old agent references
   */
  async updateSettings(qwenDir) {
    const fs = require('fs-extra');
    const settingsPath = path.join(qwenDir, 'settings.json');

    if (await fs.pathExists(settingsPath)) {
      try {
        const settingsContent = await fs.readFile(settingsPath, 'utf8');
        const settings = JSON.parse(settingsContent);
        let updated = false;

        // Remove agent file references from contextFileName
        if (settings.contextFileName && Array.isArray(settings.contextFileName)) {
          const originalLength = settings.contextFileName.length;
          settings.contextFileName = settings.contextFileName.filter(
            (fileName) => !fileName.startsWith('agents/') && !fileName.startsWith('bmad-method/'),
          );

          if (settings.contextFileName.length !== originalLength) {
            updated = true;
          }
        }

        if (updated) {
          await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
          console.log(chalk.green('  ✓ Updated .qwen/settings.json'));
        }
      } catch (error) {
        console.warn(chalk.yellow('  ⚠ Could not update settings.json:'), error.message);
      }
    }
  }

  /**
   * Clean up old configuration directories
   */
  async cleanupOldConfig(qwenDir) {
    const fs = require('fs-extra');
    const agentsDir = path.join(qwenDir, 'agents');
    const bmadMethodDir = path.join(qwenDir, 'bmad-method');

    if (await fs.pathExists(agentsDir)) {
      await fs.remove(agentsDir);
      console.log(chalk.green('  ✓ Removed old agents directory'));
    }

    if (await fs.pathExists(bmadMethodDir)) {
      await fs.remove(bmadMethodDir);
      console.log(chalk.green('  ✓ Removed old bmad-method directory'));
    }
  }

  /**
   * Create TOML file for agent
   */
  createAgentToml(agent, content, projectDir) {
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(agent.name);
    const yamlMatch = content.match(/```ya?ml\r?\n([\s\S]*?)```/);
    const yamlContent = yamlMatch ? yamlMatch[1] : content;
    const relativePath = path.relative(projectDir, agent.path).replaceAll('\\', '/');

    return `# ${title} Agent
name = "${agent.name}"
description = """
${title} agent from BMAD ${agent.module.toUpperCase()} module.

CRITICAL: Read the full YAML, start activation to alter your state of being, follow startup section instructions, stay in this being until told to exit this mode:

\`\`\`yaml
${yamlContent}
\`\`\`

File: ${relativePath}
"""`;
  }

  /**
   * Create TOML file for task
   */
  createTaskToml(task, content, projectDir) {
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(task.name);
    const yamlMatch = content.match(/```ya?ml\r?\n([\s\S]*?)```/);
    const yamlContent = yamlMatch ? yamlMatch[1] : content;
    const relativePath = path.relative(projectDir, task.path).replaceAll('\\', '/');

    return `# ${title} Task
name = "${task.name}"
description = """
${title} task from BMAD ${task.module.toUpperCase()} module.

Execute this task by following the instructions in the YAML configuration:

\`\`\`yaml
${yamlContent}
\`\`\`

File: ${relativePath}
"""`;
  }

  /**
   * Create agent section for concatenated file
   */
  createAgentSection(agent, content, projectDir) {
    // Extract metadata
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(agent.name);

    // Extract YAML content
    const yamlMatch = content.match(/```ya?ml\r?\n([\s\S]*?)```/);
    const yamlContent = yamlMatch ? yamlMatch[1] : content;

    // Get relative path
    const relativePath = path.relative(projectDir, agent.path).replaceAll('\\', '/');

    let section = `# ${agent.name.toUpperCase()} Agent Rule

This rule is triggered when the user types \`/BMad:agents:${agent.name}\` and activates the ${title} agent persona.

## Agent Activation

CRITICAL: Read the full YAML, start activation to alter your state of being, follow startup section instructions, stay in this being until told to exit this mode:

\`\`\`yaml
${yamlContent}
\`\`\`

## File Reference

The complete agent definition is available in [${relativePath}](${relativePath}).

## Usage

When the user types \`/BMad:agents:${agent.name}\`, activate this ${title} persona and follow all instructions defined in the YAML configuration above.

## Module

Part of the BMAD ${agent.module.toUpperCase()} module.`;

    return section;
  }

  /**
   * Create task section for concatenated file
   */
  createTaskSection(task, content, projectDir) {
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(task.name);
    const yamlMatch = content.match(/```ya?ml\r?\n([\s\S]*?)```/);
    const yamlContent = yamlMatch ? yamlMatch[1] : content;
    const relativePath = path.relative(projectDir, task.path).replaceAll('\\', '/');

    let section = `# ${task.name.toUpperCase()} Task

This task is triggered when the user types \`/BMad:tasks:${task.name}\` and executes the ${title} task.

## Task Execution

Execute this task by following the instructions in the YAML configuration:

\`\`\`yaml
${yamlContent}
\`\`\`

## File Reference

The complete task definition is available in [${relativePath}](${relativePath}).

## Usage

When the user types \`/BMad:tasks:${task.name}\`, execute this ${title} task and follow all instructions defined in the YAML configuration above.

## Module

Part of the BMAD ${task.module.toUpperCase()} module.`;

    return section;
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
   * Cleanup Qwen configuration
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');
    const bmadCommandsDir = path.join(projectDir, this.configDir, this.commandsDir, this.bmadDir);
    const oldBmadMethodDir = path.join(projectDir, this.configDir, 'bmad-method');

    if (await fs.pathExists(bmadCommandsDir)) {
      await fs.remove(bmadCommandsDir);
      console.log(chalk.dim(`Removed BMAD configuration from Qwen Code`));
    }

    if (await fs.pathExists(oldBmadMethodDir)) {
      await fs.remove(oldBmadMethodDir);
      console.log(chalk.dim(`Removed old BMAD configuration from Qwen Code`));
    }
  }
}

module.exports = { QwenSetup };
