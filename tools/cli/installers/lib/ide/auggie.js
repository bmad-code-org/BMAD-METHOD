const path = require('node:path');
const os = require('node:os');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const inquirer = require('inquirer');

/**
 * Auggie CLI setup handler
 * Allows flexible installation of agents to multiple locations
 */
class AuggieSetup extends BaseIdeSetup {
  constructor() {
    super('auggie', 'Auggie CLI');
    this.defaultLocations = [
      { name: 'Project Directory (.augment/commands)', value: '.augment/commands', checked: true },
      { name: 'User Home (~/.augment/commands)', value: path.join(os.homedir(), '.augment', 'commands') },
      { name: 'Custom Location', value: 'custom' },
    ];
    this.detectionPaths = ['.augment'];
  }

  /**
   * Collect configuration choices before installation
   * @param {Object} options - Configuration options
   * @returns {Object} Collected configuration
   */
  async collectConfiguration(options = {}) {
    const response = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'locations',
        message: 'Select Auggie CLI installation locations:',
        choices: this.defaultLocations,
        validate: (answers) => {
          if (answers.length === 0) {
            return 'Please select at least one location';
          }
          return true;
        },
      },
    ]);

    const locations = [];
    for (const loc of response.locations) {
      if (loc === 'custom') {
        const custom = await inquirer.prompt([
          {
            type: 'input',
            name: 'path',
            message: 'Enter custom path for Auggie commands:',
            validate: (input) => {
              if (!input.trim()) {
                return 'Path cannot be empty';
              }
              return true;
            },
          },
        ]);
        locations.push(custom.path);
      } else {
        locations.push(loc);
      }
    }

    return { auggieLocations: locations };
  }

  /**
   * Setup Auggie CLI configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Use pre-collected configuration if available
    const config = options.preCollectedConfig || {};
    const locations = await this.getInstallLocations(projectDir, { ...options, auggieLocations: config.auggieLocations });

    if (locations.length === 0) {
      console.log(chalk.yellow('No locations selected. Skipping Auggie CLI setup.'));
      return { success: false, reason: 'no-locations' };
    }

    // Get agents and tasks
    const agents = await this.getAgents(bmadDir);
    const tasks = await this.getTasks(bmadDir);

    let totalInstalled = 0;

    // Install to each selected location
    for (const location of locations) {
      console.log(chalk.dim(`\n  Installing to: ${location}`));

      const agentsDir = path.join(location, 'agents');
      const tasksDir = path.join(location, 'tasks');

      await this.ensureDir(agentsDir);
      await this.ensureDir(tasksDir);

      // Install agents
      for (const agent of agents) {
        const content = await this.readFile(agent.path);
        const commandContent = this.createAgentCommand(agent, content);

        const targetPath = path.join(agentsDir, `${agent.module}-${agent.name}.md`);
        await this.writeFile(targetPath, commandContent);
        totalInstalled++;
      }

      // Install tasks
      for (const task of tasks) {
        const content = await this.readFile(task.path);
        const commandContent = this.createTaskCommand(task, content);

        const targetPath = path.join(tasksDir, `${task.module}-${task.name}.md`);
        await this.writeFile(targetPath, commandContent);
        totalInstalled++;
      }

      console.log(chalk.green(`  ✓ Installed ${agents.length} agents and ${tasks.length} tasks`));
    }

    console.log(chalk.green(`\n✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${totalInstalled} total commands installed`));
    console.log(chalk.dim(`  - ${locations.length} location(s) configured`));

    return {
      success: true,
      commands: totalInstalled,
      locations: locations.length,
    };
  }

  /**
   * Get installation locations from user
   */
  async getInstallLocations(projectDir, options) {
    if (options.auggieLocations) {
      // Process the pre-collected locations to resolve relative paths
      const processedLocations = [];
      for (const loc of options.auggieLocations) {
        if (loc === '.augment/commands') {
          // Relative to project directory
          processedLocations.push(path.join(projectDir, loc));
        } else {
          processedLocations.push(loc);
        }
      }
      return processedLocations;
    }

    const response = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'locations',
        message: 'Select Auggie CLI installation locations:',
        choices: this.defaultLocations,
        validate: (answers) => {
          if (answers.length === 0) {
            return 'Please select at least one location';
          }
          return true;
        },
      },
    ]);

    const locations = [];
    for (const loc of response.locations) {
      if (loc === 'custom') {
        const custom = await inquirer.prompt([
          {
            type: 'input',
            name: 'path',
            message: 'Enter custom path for Auggie commands:',
            validate: (input) => {
              if (!input.trim()) {
                return 'Path cannot be empty';
              }
              return true;
            },
          },
        ]);
        locations.push(custom.path);
      } else if (loc.startsWith('.augment')) {
        // Relative to project directory
        locations.push(path.join(projectDir, loc));
      } else {
        locations.push(loc);
      }
    }

    return locations;
  }

  /**
   * Create agent command content
   */
  createAgentCommand(agent, content) {
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(agent.name);

    return `# ${title} Agent

## Activation
Type \`@${agent.name}\` to activate this agent.

${content}

## Module
BMAD ${agent.module.toUpperCase()} module
`;
  }

  /**
   * Create task command content
   */
  createTaskCommand(task, content) {
    const nameMatch = content.match(/<name>([^<]+)<\/name>/);
    const taskName = nameMatch ? nameMatch[1] : this.formatTitle(task.name);

    return `# ${taskName} Task

## Activation
Type \`@task-${task.name}\` to execute this task.

${content}

## Module
BMAD ${task.module.toUpperCase()} module
`;
  }

  /**
   * Cleanup Auggie configuration
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');

    // Check common locations
    const locations = [path.join(os.homedir(), '.augment', 'commands'), path.join(projectDir, '.augment', 'commands')];

    for (const location of locations) {
      const agentsDir = path.join(location, 'agents');
      const tasksDir = path.join(location, 'tasks');

      if (await fs.pathExists(agentsDir)) {
        // Remove only BMAD files (those with module prefix)
        const files = await fs.readdir(agentsDir);
        for (const file of files) {
          if (file.includes('-') && file.endsWith('.md')) {
            await fs.remove(path.join(agentsDir, file));
          }
        }
      }

      if (await fs.pathExists(tasksDir)) {
        const files = await fs.readdir(tasksDir);
        for (const file of files) {
          if (file.includes('-') && file.endsWith('.md')) {
            await fs.remove(path.join(tasksDir, file));
          }
        }
      }
    }

    console.log(chalk.dim('Cleaned up Auggie CLI configurations'));
  }
}

module.exports = { AuggieSetup };
