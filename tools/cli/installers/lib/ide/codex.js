const path = require('node:path');
const fs = require('fs-extra');
const os = require('node:os');
const chalk = require('chalk');
const { BaseIdeSetup } = require('./_base-ide');
const { WorkflowCommandGenerator } = require('./shared/workflow-command-generator');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');
const { getTasksFromBmad } = require('./shared/bmad-artifacts');

/**
 * Codex setup handler (CLI mode)
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
    const inquirer = require('inquirer').default || require('inquirer');

    let confirmed = false;
    let installLocation = 'global';

    while (!confirmed) {
      const { location } = await inquirer.prompt([
        {
          type: 'list',
          name: 'location',
          message: 'Where would you like to install Codex CLI prompts?',
          choices: [
            {
              name: 'Global - Simple for single project ' + '(~/.codex/prompts, but references THIS project only)',
              value: 'global',
            },
            {
              name: `Project-specific - Recommended for real work (requires CODEX_HOME=<project-dir>${path.sep}.codex)`,
              value: 'project',
            },
          ],
          default: 'global',
        },
      ]);

      installLocation = location;

      // Display detailed instructions for the chosen option
      console.log('');
      if (installLocation === 'project') {
        console.log(this.getProjectSpecificInstructions());
      } else {
        console.log(this.getGlobalInstructions());
      }

      // Confirm the choice
      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Proceed with this installation option?',
          default: true,
        },
      ]);

      confirmed = proceed;

      if (!confirmed) {
        console.log(chalk.yellow("\n  Let's choose a different installation option.\n"));
      }
    }

    return { installLocation };
  }

  /**
   * Setup Codex configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Always use CLI mode
    const mode = 'cli';

    // Get installation location from pre-collected config or default to global
    const installLocation = options.preCollectedConfig?.installLocation || 'global';

    const { artifacts, counts } = await this.collectClaudeArtifacts(projectDir, bmadDir, options);

    const destDir = this.getCodexPromptDir(projectDir, installLocation);
    await fs.ensureDir(destDir);
    await this.clearOldBmadFiles(destDir);
    const written = await this.flattenAndWriteArtifacts(artifacts, destDir);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - Mode: CLI`));
    console.log(chalk.dim(`  - ${counts.agents} agents exported`));
    console.log(chalk.dim(`  - ${counts.tasks} tasks exported`));
    console.log(chalk.dim(`  - ${counts.workflows} workflow commands exported`));
    if (counts.workflowLaunchers > 0) {
      console.log(chalk.dim(`  - ${counts.workflowLaunchers} workflow launchers exported`));
    }
    console.log(chalk.dim(`  - ${written} Codex prompt files written`));
    console.log(chalk.dim(`  - Destination: ${destDir}`));

    return {
      success: true,
      mode,
      artifacts,
      counts,
      destination: destDir,
      written,
      installLocation,
    };
  }

  /**
   * Detect Codex installation by checking for BMAD prompt exports
   */
  async detect(projectDir) {
    // Check both global and project-specific locations
    const globalDir = this.getCodexPromptDir(null, 'global');
    const projectDir_local = projectDir || process.cwd();
    const projectSpecificDir = this.getCodexPromptDir(projectDir_local, 'project');

    // Check global location
    if (await fs.pathExists(globalDir)) {
      const entries = await fs.readdir(globalDir);
      if (entries.some((entry) => entry.startsWith('bmad-'))) {
        return true;
      }
    }

    // Check project-specific location
    if (await fs.pathExists(projectSpecificDir)) {
      const entries = await fs.readdir(projectSpecificDir);
      if (entries.some((entry) => entry.startsWith('bmad-'))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Collect Claude-style artifacts for Codex export.
   * Returns the normalized artifact list for further processing.
   */
  async collectClaudeArtifacts(projectDir, bmadDir, options = {}) {
    const selectedModules = options.selectedModules || [];
    const artifacts = [];

    // Generate agent launchers
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);
    const { artifacts: agentArtifacts } = await agentGen.collectAgentArtifacts(bmadDir, selectedModules);

    for (const artifact of agentArtifacts) {
      artifacts.push({
        type: 'agent',
        module: artifact.module,
        sourcePath: artifact.sourcePath,
        relativePath: artifact.relativePath,
        content: artifact.content,
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

    const workflowGenerator = new WorkflowCommandGenerator(this.bmadFolderName);
    const { artifacts: workflowArtifacts, counts: workflowCounts } = await workflowGenerator.collectWorkflowArtifacts(bmadDir);
    artifacts.push(...workflowArtifacts);

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

  getCodexPromptDir(projectDir = null, location = 'global') {
    if (location === 'project' && projectDir) {
      return path.join(projectDir, '.codex', 'prompts');
    }
    return path.join(os.homedir(), '.codex', 'prompts');
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
   * Get instructions for global installation
   * @returns {string} Instructions text
   */
  getGlobalInstructions(destDir) {
    const lines = [
      '',
      chalk.bold.cyan('═'.repeat(70)),
      chalk.bold.yellow('  IMPORTANT: Codex Configuration'),
      chalk.bold.cyan('═'.repeat(70)),
      '',
      chalk.white('  /prompts installed globally to your HOME DIRECTORY.'),
      '',
      chalk.yellow('  ⚠️  These prompts reference a specific _bmad path'),
      chalk.dim("  To use with other projects, you'd need to copy the _bmad dir"),
      '',
      chalk.green('  ✓ You can now use /commands in Codex CLI'),
      chalk.dim('    Example: /bmad-bmm-agents-pm'),
      chalk.dim('    Type / to see all available commands'),
      '',
      chalk.bold.cyan('═'.repeat(70)),
      '',
    ];
    return lines.join('\n');
  }

  /**
   * Get instructions for project-specific installation
   * @param {string} projectDir - Optional project directory
   * @param {string} destDir - Optional destination directory
   * @returns {string} Instructions text
   */
  getProjectSpecificInstructions(projectDir = null, destDir = null) {
    const isWindows = os.platform() === 'win32';

    const commonLines = [
      '',
      chalk.bold.cyan('═'.repeat(70)),
      chalk.bold.yellow('  Project-Specific Codex Configuration'),
      chalk.bold.cyan('═'.repeat(70)),
      '',
      chalk.white('  Prompts will be installed to: ') + chalk.cyan(destDir || '<project>/.codex/prompts'),
      '',
      chalk.bold.yellow('  ⚠️  REQUIRED: You must set CODEX_HOME to use these prompts'),
      '',
    ];

    const windowsLines = [
      chalk.bold('  Create a codex.cmd file in your project root:'),
      '',
      chalk.green('    @echo off'),
      chalk.green('    set CODEX_HOME=%~dp0.codex'),
      chalk.green('    codex %*'),
      '',
      chalk.dim(String.raw`  Then run: .\codex instead of codex`),
      chalk.dim('  (The %~dp0 gets the directory of the .cmd file)'),
    ];

    const unixLines = [
      chalk.bold('  Add this alias to your ~/.bashrc or ~/.zshrc:'),
      '',
      chalk.green('    alias codex=\'CODEX_HOME="$PWD/.codex" codex\''),
      '',
      chalk.dim('  After adding, run: source ~/.bashrc  (or source ~/.zshrc)'),
      chalk.dim('  (The $PWD uses your current working directory)'),
    ];
    const closingLines = [
      '',
      chalk.dim('  This tells Codex CLI to use prompts from this project instead of ~/.codex'),
      '',
      chalk.bold.cyan('═'.repeat(70)),
      '',
    ];

    const lines = [...commonLines, ...(isWindows ? windowsLines : unixLines), ...closingLines];

    return lines.join('\n');
  }

  /**
   * Cleanup Codex configuration
   */
  async cleanup(projectDir = null) {
    // Clean both global and project-specific locations
    const globalDir = this.getCodexPromptDir(null, 'global');
    await this.clearOldBmadFiles(globalDir);

    if (projectDir) {
      const projectSpecificDir = this.getCodexPromptDir(projectDir, 'project');
      await this.clearOldBmadFiles(projectSpecificDir);
    }
  }

  /**
   * Install a custom agent launcher for Codex
   * @param {string} projectDir - Project directory (not used, Codex installs to home)
   * @param {string} agentName - Agent name (e.g., "fred-commit-poet")
   * @param {string} agentPath - Path to compiled agent (relative to project root)
   * @param {Object} metadata - Agent metadata
   * @returns {Object|null} Info about created command
   */
  async installCustomAgentLauncher(projectDir, agentName, agentPath, metadata) {
    const destDir = this.getCodexPromptDir(projectDir, 'project');
    await fs.ensureDir(destDir);

    const launcherContent = `---
name: '${agentName}'
description: '${agentName} agent'
---

You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.

<agent-activation CRITICAL="TRUE">
1. LOAD the FULL agent file from @${agentPath}
2. READ its entire contents - this contains the complete agent persona, menu, and instructions
3. FOLLOW every step in the <activation> section precisely
4. DISPLAY the welcome/greeting as instructed
5. PRESENT the numbered menu
6. WAIT for user input before proceeding
</agent-activation>
`;

    const fileName = `bmad-custom-agents-${agentName}.md`;
    const launcherPath = path.join(destDir, fileName);
    await fs.writeFile(launcherPath, launcherContent, 'utf8');

    return {
      path: path.relative(projectDir, launcherPath),
      command: `/${fileName.replace('.md', '')}`,
    };
  }
}

module.exports = { CodexSetup };
