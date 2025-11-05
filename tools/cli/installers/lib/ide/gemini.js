const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');

/**
 * Gemini CLI setup handler
 * Creates TOML files in .gemini/commands/ structure
 */
class GeminiSetup extends BaseIdeSetup {
  constructor() {
    super('gemini', 'Gemini CLI', true); // preferred IDE
    this.configDir = '.gemini';
    this.commandsDir = 'commands';
  }

  /**
   * Setup Gemini CLI configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Create .gemini/commands directory (flat structure with bmad- prefix)
    const geminiDir = path.join(projectDir, this.configDir);
    const commandsDir = path.join(geminiDir, this.commandsDir);

    await this.ensureDir(commandsDir);

    // Clean up any existing BMAD files before reinstalling
    await this.cleanup(projectDir);

    // Get agents and tasks
    const agents = await this.getAgents(bmadDir);
    const tasks = await this.getTasks(bmadDir);

    // Install agents as TOML files with bmad- prefix (flat structure)
    let agentCount = 0;
    for (const agent of agents) {
      const content = await this.readFile(agent.path);
      const tomlContent = this.createAgentToml(agent, content, bmadDir);

      // Flat structure: bmad-agent-{module}-{name}.toml
      const tomlPath = path.join(commandsDir, `bmad-agent-${agent.module}-${agent.name}.toml`);
      await this.writeFile(tomlPath, tomlContent);
      agentCount++;

      console.log(chalk.green(`  ✓ Added agent: /bmad:agents:${agent.module}:${agent.name}`));
    }

    // Install tasks as TOML files with bmad- prefix (flat structure)
    let taskCount = 0;
    for (const task of tasks) {
      const content = await this.readFile(task.path);
      const tomlContent = this.createTaskToml(task, content, bmadDir);

      // Flat structure: bmad-task-{module}-{name}.toml
      const tomlPath = path.join(commandsDir, `bmad-task-${task.module}-${task.name}.toml`);
      await this.writeFile(tomlPath, tomlContent);
      taskCount++;

      console.log(chalk.green(`  ✓ Added task: /bmad:tasks:${task.module}:${task.name}`));
    }

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${agentCount} agents configured`));
    console.log(chalk.dim(`  - ${taskCount} tasks configured`));
    console.log(chalk.dim(`  - Commands directory: ${path.relative(projectDir, commandsDir)}`));
    console.log(chalk.dim(`  - Agent activation: /bmad:agents:{agent-name}`));
    console.log(chalk.dim(`  - Task activation: /bmad:tasks:{task-name}`));

    return {
      success: true,
      agents: agentCount,
      tasks: taskCount,
    };
  }

  /**
   * Create agent TOML content
   */
  createAgentToml(agent, content, bmadDir) {
    // Extract metadata
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(agent.name);

    // Get relative path from project root to agent file
    const relativePath = path.relative(process.cwd(), agent.path).replaceAll('\\', '/');

    // Create TOML content
    const tomlContent = `description = "Activates the ${title} agent from the BMad Method."
prompt = """
CRITICAL: You are now the BMad '${title}' agent. Adopt its persona and capabilities as defined in the following configuration.

Read and internalize the full agent definition, following all instructions and maintaining this persona until explicitly told to switch or exit.

@${relativePath}
"""
`;

    return tomlContent;
  }

  /**
   * Create task TOML content
   */
  createTaskToml(task, content, bmadDir) {
    // Extract task name from XML if available
    const nameMatch = content.match(/<name>([^<]+)<\/name>/);
    const taskName = nameMatch ? nameMatch[1] : this.formatTitle(task.name);

    // Get relative path from project root to task file
    const relativePath = path.relative(process.cwd(), task.path).replaceAll('\\', '/');

    // Create TOML content
    const tomlContent = `description = "Executes the ${taskName} task from the BMad Method."
prompt = """
Execute the following BMad Method task workflow:

@${relativePath}

Follow all instructions and complete the task as defined.
"""
`;

    return tomlContent;
  }

  /**
   * Cleanup Gemini configuration - surgically remove only BMAD files
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');
    const commandsDir = path.join(projectDir, this.configDir, this.commandsDir);

    if (await fs.pathExists(commandsDir)) {
      // Only remove files that start with bmad- prefix
      const files = await fs.readdir(commandsDir);
      let removed = 0;

      for (const file of files) {
        if (file.startsWith('bmad-') && file.endsWith('.toml')) {
          await fs.remove(path.join(commandsDir, file));
          removed++;
        }
      }

      if (removed > 0) {
        console.log(chalk.dim(`  Cleaned up ${removed} existing BMAD files`));
      }
    }
  }
}

module.exports = { GeminiSetup };
