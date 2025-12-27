const path = require('node:path');
const fs = require('fs-extra');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');
const { WorkflowCommandGenerator } = require('./shared/workflow-command-generator');
const { getTasksFromBmad, getToolsFromBmad } = require('./shared/bmad-artifacts');

/**
 * Crush IDE setup handler
 * Installs BMAD artifacts to .crush/commands with flattened naming
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

    // Create .crush/commands directory
    const crushDir = path.join(projectDir, this.configDir);
    const commandsDir = path.join(crushDir, this.commandsDir);

    await this.ensureDir(commandsDir);

    // Clear old BMAD files
    await this.clearBmadPrefixedFiles(commandsDir);

    // Collect all artifacts
    const { artifacts, counts } = await this.collectCrushArtifacts(projectDir, bmadDir, options);

    // Write flattened files
    const written = await this.writeFlattenedArtifacts(artifacts, commandsDir);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${counts.agents} agent commands created`));
    console.log(chalk.dim(`  - ${counts.tasks} task commands created`));
    console.log(chalk.dim(`  - ${counts.tools} tool commands created`));
    console.log(chalk.dim(`  - ${counts.workflows} workflow commands created`));
    if (counts.workflowLaunchers > 0) {
      console.log(chalk.dim(`  - ${counts.workflowLaunchers} workflow launchers created`));
    }
    console.log(chalk.dim(`  - ${written} files written to ${path.relative(projectDir, commandsDir)}`));

    // Usage instructions
    console.log(chalk.yellow('\n  ⚠️  How to Use Crush Commands'));
    console.log(chalk.cyan('  BMAD commands are available via the Crush command palette'));
    console.log(chalk.dim('  Usage:'));
    console.log(chalk.dim('    - All BMAD items start with "bmad-"'));
    console.log(chalk.dim('    - Example: /bmad-bmm-agents-pm'));

    return {
      success: true,
      agents: counts.agents,
      tasks: counts.tasks,
      tools: counts.tools,
      workflows: counts.workflows,
      workflowLaunchers: counts.workflowLaunchers,
      written,
    };
  }

  /**
   * Detect Crush installation by checking for .crush/commands directory
   */
  async detect(projectDir) {
    const commandsDir = path.join(projectDir, this.configDir, this.commandsDir);

    if (!(await fs.pathExists(commandsDir))) {
      return false;
    }

    const entries = await fs.readdir(commandsDir);
    return entries.some((entry) => entry.startsWith('bmad-'));
  }

  /**
   * Collect all artifacts for Crush export
   */
  async collectCrushArtifacts(projectDir, bmadDir, options = {}) {
    const selectedModules = options.selectedModules || [];
    const artifacts = [];

    // Generate agent launchers
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);
    const { artifacts: agentArtifacts } = await agentGen.collectAgentArtifacts(bmadDir, selectedModules);

    // Process agent launchers
    for (const agentArtifact of agentArtifacts) {
      artifacts.push({
        type: 'agent',
        module: agentArtifact.module,
        sourcePath: agentArtifact.sourcePath,
        relativePath: agentArtifact.relativePath,
        content: agentArtifact.content,
      });
    }

    // Get tasks
    const tasks = await getTasksFromBmad(bmadDir, selectedModules);
    for (const task of tasks) {
      const rawContent = await this.readFile(task.path);
      const content = this.createTaskCommand(task, rawContent);

      artifacts.push({
        type: 'task',
        module: task.module,
        sourcePath: task.path,
        relativePath: path.join(task.module, 'tasks', `${task.name}.md`),
        content,
      });
    }

    // Get tools
    const tools = await getToolsFromBmad(bmadDir, selectedModules);
    for (const tool of tools) {
      const rawContent = await this.readFile(tool.path);
      const content = this.createToolCommand(tool, rawContent);

      artifacts.push({
        type: 'tool',
        module: tool.module,
        sourcePath: tool.path,
        relativePath: path.join(tool.module, 'tools', `${tool.name}.md`),
        content,
      });
    }

    // Get workflows
    const workflowGenerator = new WorkflowCommandGenerator(this.bmadFolderName);
    const { artifacts: workflowArtifacts, counts: workflowCounts } = await workflowGenerator.collectWorkflowArtifacts(bmadDir);

    // Add workflow artifacts
    artifacts.push(...workflowArtifacts);

    return {
      artifacts,
      counts: {
        agents: agentArtifacts.length,
        tasks: tasks.length,
        tools: tools.length,
        workflows: workflowCounts.commands,
        workflowLaunchers: workflowCounts.launchers,
      },
    };
  }

  /**
   * Create task command content
   */
  createTaskCommand(task, content) {
    // Extract task name
    const nameMatch = content.match(/name="([^"]+)"/);
    const taskName = nameMatch ? nameMatch[1] : this.formatTitle(task.name);

    return `# /task-${task.name} Command

When this command is used, execute the following task:

## ${taskName} Task

${content}

## Command Usage

This command executes the ${taskName} task from the BMAD ${task.module.toUpperCase()} module.

## Module

Part of the BMAD ${task.module.toUpperCase()} module.
`;
  }

  /**
   * Create tool command content
   */
  createToolCommand(tool, content) {
    // Extract tool name
    const nameMatch = content.match(/name="([^"]+)"/);
    const toolName = nameMatch ? nameMatch[1] : this.formatTitle(tool.name);

    return `# /tool-${tool.name} Command

When this command is used, execute the following tool:

## ${toolName} Tool

${content}

## Command Usage

This command executes the ${toolName} tool from the BMAD ${tool.module.toUpperCase()} module.

## Module

Part of the BMAD ${tool.module.toUpperCase()} module.
`;
  }

  // Uses inherited flattenFilename(), writeFlattenedArtifacts(), and clearBmadPrefixedFiles() from BaseIdeSetup

  /**
   * Cleanup Crush configuration
   */
  async cleanup(projectDir) {
    const commandsDir = path.join(projectDir, this.configDir, this.commandsDir);
    const removedCount = await this.clearBmadPrefixedFiles(commandsDir);
    if (removedCount > 0) {
      console.log(chalk.dim(`  Removed ${removedCount} old BMAD items from ${this.name}`));
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
    const commandsDir = path.join(projectDir, this.configDir, this.commandsDir);

    if (!(await this.exists(path.join(projectDir, this.configDir)))) {
      return null; // IDE not configured for this project
    }

    await this.ensureDir(commandsDir);

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

    const fileName = `bmad-custom-agents-${agentName.toLowerCase()}.md`;
    const launcherPath = path.join(commandsDir, fileName);

    // Write the launcher file
    await fs.writeFile(launcherPath, launcherContent, 'utf8');

    return {
      ide: 'crush',
      path: path.relative(projectDir, launcherPath),
      command: `bmad-custom-agents-${agentName}`,
      type: 'custom-agent-launcher',
    };
  }
}

module.exports = { CrushSetup };
