const path = require('node:path');
const fs = require('fs-extra');
const os = require('node:os');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { BaseIdeSetup } = require('./_base-ide');
const { WorkflowCommandGenerator } = require('./workflow-command-generator');
const { getAgentsFromBmad, getTasksFromBmad } = require('./shared/bmad-artifacts');

/**
 * Codex setup handler (supports both CLI and Web)
 */
class CodexSetup extends BaseIdeSetup {
  constructor() {
    super('codex', 'Codex', true); // preferred IDE
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
        name: 'mode',
        message: 'Select Codex deployment mode:',
        choices: [
          { name: 'CLI (Command-line interface)', value: 'cli' },
          { name: 'Web (Browser-based interface)', value: 'web' },
        ],
        default: 'cli',
      },
    ]);

    return { codexMode: response.mode };
  }

  /**
   * Setup Codex configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    const config = options.preCollectedConfig || {};
    const mode = config.codexMode || options.codexMode || 'cli';

    const { artifacts, counts } = await this.collectClaudeArtifacts(projectDir, bmadDir, options);

    const destDir = this.getCodexPromptDir();
    await fs.ensureDir(destDir);
    await this.clearOldBmadFiles(destDir);
    const written = await this.flattenAndWriteArtifacts(artifacts, destDir);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - Mode: ${mode === 'web' ? 'Web' : 'CLI'}`));
    console.log(chalk.dim(`  - ${counts.agents} agents exported`));
    console.log(chalk.dim(`  - ${counts.tasks} tasks exported`));
    console.log(chalk.dim(`  - ${counts.workflows} workflow commands exported`));
    if (counts.workflowLaunchers > 0) {
      console.log(chalk.dim(`  - ${counts.workflowLaunchers} workflow launchers exported`));
    }
    if (counts.subagents > 0) {
      console.log(chalk.dim(`  - ${counts.subagents} subagents exported`));
    }
    console.log(chalk.dim(`  - ${written} Codex prompt files written`));
    console.log(chalk.dim(`  - Destination: ${destDir}`));

    // Prominent notice about home directory installation
    console.log('');
    console.log(chalk.bold.cyan('═'.repeat(70)));
    console.log(chalk.bold.yellow('  IMPORTANT: Codex Configuration'));
    console.log(chalk.bold.cyan('═'.repeat(70)));
    console.log('');
    console.log(chalk.white('  Prompts have been installed to your HOME DIRECTORY, not this project.'));
    console.log(chalk.white('  No .codex file was created in the project root.'));
    console.log('');
    console.log(chalk.green('  ✓ You can now use slash commands (/) in Codex CLI'));
    console.log(chalk.dim('    Example: /bmad-bmm-agents-pm'));
    console.log(chalk.dim('    Type / to see all available commands'));
    console.log('');
    console.log(chalk.bold.cyan('═'.repeat(70)));
    console.log('');

    return {
      success: true,
      mode,
      artifacts,
      counts,
      destination: destDir,
      written,
    };
  }

  /**
   * Detect Codex installation by checking for BMAD prompt exports
   */
  async detect(_projectDir) {
    const destDir = this.getCodexPromptDir();

    if (!(await fs.pathExists(destDir))) {
      return false;
    }

    const entries = await fs.readdir(destDir);
    return entries.some((entry) => entry.startsWith('bmad-'));
  }

  /**
   * Collect Claude-style artifacts for Codex export.
   * Returns the normalized artifact list for further processing.
   */
  async collectClaudeArtifacts(projectDir, bmadDir, options = {}) {
    const selectedModules = options.selectedModules || [];
    const artifacts = [];

    const agents = await getAgentsFromBmad(bmadDir, selectedModules);
    for (const agent of agents) {
      const content = await this.readAndProcessWithProject(
        agent.path,
        {
          module: agent.module,
          name: agent.name,
        },
        projectDir,
      );

      artifacts.push({
        type: 'agent',
        module: agent.module,
        sourcePath: agent.path,
        relativePath: path.join(agent.module, 'agents', `${agent.name}.md`),
        content,
      });
    }

    const tasks = await getTasksFromBmad(bmadDir, selectedModules);
    for (const task of tasks) {
      const content = await this.readAndProcessWithProject(
        task.path,
        {
          module: task.module,
          name: task.name,
        },
        projectDir,
      );

      artifacts.push({
        type: 'task',
        module: task.module,
        sourcePath: task.path,
        relativePath: path.join(task.module, 'tasks', `${task.name}.md`),
        content,
      });
    }

    const workflowGenerator = new WorkflowCommandGenerator();
    const { artifacts: workflowArtifacts, counts: workflowCounts } = await workflowGenerator.collectWorkflowArtifacts(bmadDir);
    artifacts.push(...workflowArtifacts);

    return {
      artifacts,
      counts: {
        agents: agents.length,
        tasks: tasks.length,
        workflows: workflowCounts.commands,
        workflowLaunchers: workflowCounts.launchers,
      },
    };
  }

  getCodexPromptDir() {
    return path.join(os.homedir(), '.codex', 'prompts');
  }

  flattenFilename(relativePath) {
    const sanitized = relativePath.replaceAll(/[\\/]/g, '-');
    return `bmad-${sanitized}`;
  }

  async flattenAndWriteArtifacts(artifacts, destDir) {
    let written = 0;

    for (const artifact of artifacts) {
      const flattenedName = this.flattenFilename(artifact.relativePath);
      const targetPath = path.join(destDir, flattenedName);
      await fs.writeFile(targetPath, artifact.content);
      written++;
    }

    return written;
  }

  async clearOldBmadFiles(destDir) {
    if (!(await fs.pathExists(destDir))) {
      return;
    }

    const entries = await fs.readdir(destDir);

    for (const entry of entries) {
      if (!entry.startsWith('bmad-')) {
        continue;
      }

      const entryPath = path.join(destDir, entry);
      const stat = await fs.stat(entryPath);
      if (stat.isFile()) {
        await fs.remove(entryPath);
      } else if (stat.isDirectory()) {
        await fs.remove(entryPath);
      }
    }
  }

  async readAndProcessWithProject(filePath, metadata, projectDir) {
    const content = await fs.readFile(filePath, 'utf8');
    return super.processContent(content, metadata, projectDir);
  }

  /**
   * Cleanup Codex configuration (no-op until export destination is finalized)
   */
  async cleanup() {
    const destDir = this.getCodexPromptDir();
    await this.clearOldBmadFiles(destDir);
  }
}

module.exports = { CodexSetup };
