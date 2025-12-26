const path = require('node:path');
const fs = require('fs-extra');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');
const { WorkflowCommandGenerator } = require('./shared/workflow-command-generator');
const { getTasksFromBmad } = require('./shared/bmad-artifacts');

/**
 * Windsurf IDE setup handler
 * Installs BMAD artifacts to .windsurf/workflows with flattened naming
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

    // Create .windsurf/workflows directory
    const windsurfDir = path.join(projectDir, this.configDir);
    const workflowsDir = path.join(windsurfDir, this.workflowsDir);

    await this.ensureDir(workflowsDir);

    // Clear old BMAD files
    await this.clearBmadPrefixedFiles(workflowsDir);

    // Collect all artifacts
    const { artifacts, counts } = await this.collectWindsurfArtifacts(projectDir, bmadDir, options);

    // Write flattened files
    const written = await this.writeFlattenedArtifacts(artifacts, workflowsDir);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${counts.agents} agents installed`));
    console.log(chalk.dim(`  - ${counts.tasks} tasks installed`));
    console.log(chalk.dim(`  - ${counts.workflows} workflow commands installed`));
    if (counts.workflowLaunchers > 0) {
      console.log(chalk.dim(`  - ${counts.workflowLaunchers} workflow launchers installed`));
    }
    console.log(chalk.dim(`  - ${written} files written to ${path.relative(projectDir, workflowsDir)}`));

    // Usage instructions
    console.log(chalk.yellow('\n  ⚠️  How to Use Windsurf Workflows'));
    console.log(chalk.cyan('  BMAD workflows are available as slash commands in Windsurf'));
    console.log(chalk.dim('  Usage:'));
    console.log(chalk.dim('    - Type / to see available commands'));
    console.log(chalk.dim('    - All BMAD items start with "bmad-"'));
    console.log(chalk.dim('    - Example: /bmad-bmm-agents-pm'));

    // Provide additional configuration hints
    if (options.showHints !== false) {
      console.log(chalk.dim('\n  Windsurf workflow settings:'));
      console.log(chalk.dim('  - auto_execution_mode: 3 (for agents)'));
      console.log(chalk.dim('  - auto_execution_mode: 2 (for tasks)'));
      console.log(chalk.dim('  - auto_execution_mode: 1 (for workflows)'));
    }

    return {
      success: true,
      agents: counts.agents,
      tasks: counts.tasks,
      workflows: counts.workflows,
      workflowLaunchers: counts.workflowLaunchers,
      written,
    };
  }

  /**
   * Detect Windsurf installation by checking for .windsurf/workflows directory
   */
  async detect(projectDir) {
    const workflowsDir = path.join(projectDir, this.configDir, this.workflowsDir);

    if (!(await fs.pathExists(workflowsDir))) {
      return false;
    }

    const entries = await fs.readdir(workflowsDir);
    return entries.some((entry) => entry.startsWith('bmad-'));
  }

  /**
   * Collect all artifacts for Windsurf export
   */
  async collectWindsurfArtifacts(projectDir, bmadDir, options = {}) {
    const selectedModules = options.selectedModules || [];
    const artifacts = [];

    // Generate agent launchers
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);
    const { artifacts: agentArtifacts } = await agentGen.collectAgentArtifacts(bmadDir, selectedModules);

    // Process agent launchers with Windsurf frontmatter
    for (const agentArtifact of agentArtifacts) {
      const content = this.addWindsurfFrontmatter(agentArtifact.content, agentArtifact.name, 'agent');

      artifacts.push({
        type: 'agent',
        module: agentArtifact.module,
        sourcePath: agentArtifact.sourcePath,
        relativePath: agentArtifact.relativePath,
        content,
      });
    }

    // Get tasks
    const tasks = await getTasksFromBmad(bmadDir, selectedModules);
    for (const task of tasks) {
      const rawContent = await this.readFile(task.path);
      const content = this.addWindsurfFrontmatter(rawContent, `task-${task.name}`, 'task');

      artifacts.push({
        type: 'task',
        module: task.module,
        sourcePath: task.path,
        relativePath: path.join(task.module, 'tasks', `${task.name}.md`),
        content,
      });
    }

    // Get workflows
    const workflowGenerator = new WorkflowCommandGenerator(this.bmadFolderName);
    const { artifacts: workflowArtifacts, counts: workflowCounts } = await workflowGenerator.collectWorkflowArtifacts(bmadDir);

    // Process workflow artifacts with Windsurf frontmatter
    for (const artifact of workflowArtifacts) {
      const content = this.addWindsurfFrontmatter(
        artifact.content,
        artifact.name || path.basename(artifact.relativePath, '.md'),
        'workflow',
      );

      artifacts.push({
        ...artifact,
        content,
      });
    }

    return {
      artifacts,
      counts: {
        agents: agentArtifacts.length,
        tasks: tasks.length,
        workflows: workflowCounts.commands,
        workflowLaunchers: workflowCounts.launchers,
      },
    };
  }

  /**
   * Add Windsurf-specific frontmatter with auto_execution_mode
   * @param {string} content - Original content
   * @param {string} name - Artifact name for description
   * @param {string} type - Artifact type (agent, task, workflow)
   * @returns {string} Content with Windsurf frontmatter
   */
  addWindsurfFrontmatter(content, name, type) {
    // Strip existing frontmatter
    const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
    const contentWithoutFrontmatter = content.replace(frontmatterRegex, '');

    // Determine auto_execution_mode based on type
    let mode;
    switch (type) {
      case 'agent': {
        mode = 3;
        break;
      }
      case 'task': {
        mode = 2;
        break;
      }
      default: {
        mode = 1;
        break;
      }
    }

    // Create Windsurf frontmatter
    return `---
description: ${name}
auto_execution_mode: ${mode}
---

${contentWithoutFrontmatter}`;
  }

  // Uses inherited flattenFilename(), writeFlattenedArtifacts(), and clearBmadPrefixedFiles() from BaseIdeSetup

  /**
   * Cleanup Windsurf configuration
   */
  async cleanup(projectDir) {
    const workflowsDir = path.join(projectDir, this.configDir, this.workflowsDir);
    const removedCount = await this.clearBmadPrefixedFiles(workflowsDir);
    if (removedCount > 0) {
      console.log(chalk.dim(`  Removed ${removedCount} old BMAD items from ${this.name}`));
    }
  }

  /**
   * Install a custom agent launcher for Windsurf
   * @param {string} projectDir - Project directory
   * @param {string} agentName - Agent name (e.g., "fred-commit-poet")
   * @param {string} agentPath - Path to compiled agent (relative to project root)
   * @param {Object} metadata - Agent metadata
   * @returns {Object|null} Info about created command
   */
  async installCustomAgentLauncher(projectDir, agentName, agentPath, metadata) {
    const workflowsDir = path.join(projectDir, this.configDir, this.workflowsDir);

    if (!(await this.exists(path.join(projectDir, this.configDir)))) {
      return null; // IDE not configured for this project
    }

    await this.ensureDir(workflowsDir);

    const launcherContent = `You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.

<agent-activation CRITICAL="TRUE">
1. LOAD the FULL agent file from @${agentPath}
2. READ its entire contents - this contains the complete agent persona, menu, and instructions
3. FOLLOW every step in the <activation> section precisely
4. DISPLAY the welcome/greeting as instructed
5. PRESENT the numbered menu
6. WAIT for user input before proceeding
</agent-activation>
`;

    // Windsurf uses workflow format with frontmatter
    const workflowContent = `---
description: ${metadata.title || agentName}
auto_execution_mode: 3
---

${launcherContent}`;

    const fileName = `bmad-custom-agents-${agentName}.md`;
    const launcherPath = path.join(workflowsDir, fileName);
    await fs.writeFile(launcherPath, workflowContent);

    return {
      ide: 'windsurf',
      path: path.relative(projectDir, launcherPath),
      command: `bmad-custom-agents-${agentName}`,
      type: 'custom-agent-launcher',
    };
  }
}

module.exports = { WindsurfSetup };
