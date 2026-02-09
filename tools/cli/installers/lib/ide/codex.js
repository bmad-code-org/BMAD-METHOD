const path = require('node:path');
const fs = require('fs-extra');
const os = require('node:os');
const { BaseIdeSetup } = require('./_base-ide');
const { WorkflowCommandGenerator } = require('./shared/workflow-command-generator');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');
const { TaskToolCommandGenerator } = require('./shared/task-tool-command-generator');
const { getTasksFromBmad } = require('./shared/bmad-artifacts');
const { toDashPath, customAgentDashName } = require('./shared/path-utils');
const prompts = require('../../../lib/prompts');

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
    // Non-interactive mode: use default (global)
    if (options.skipPrompts) {
      return { installLocation: 'global' };
    }

    let confirmed = false;
    let installLocation = 'global';

    while (!confirmed) {
      installLocation = await prompts.select({
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
      });

      // Show brief confirmation hint (detailed instructions available via verbose)
      if (installLocation === 'project') {
        await prompts.log.info('Prompts installed to: <project>/.codex/prompts (requires CODEX_HOME)');
      } else {
        await prompts.log.info('Prompts installed to: ~/.codex/prompts');
      }

      // Confirm the choice
      confirmed = await prompts.confirm({
        message: 'Proceed with this installation option?',
        default: true,
      });

      if (!confirmed) {
        await prompts.log.warn("Let's choose a different installation option.");
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
    if (!options.silent) await prompts.log.info(`Setting up ${this.name}...`);

    // Always use CLI mode
    const mode = 'cli';

    // Get installation location from pre-collected config or default to global
    const installLocation = options.preCollectedConfig?.installLocation || 'global';

    const { artifacts, counts } = await this.collectClaudeArtifacts(projectDir, bmadDir, options);

    const destDir = this.getCodexPromptDir(projectDir, installLocation);
    await fs.ensureDir(destDir);
    await this.clearOldBmadFiles(destDir, options);

    // Collect artifacts and write using underscore format
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);
    const { artifacts: agentArtifacts } = await agentGen.collectAgentArtifacts(bmadDir, options.selectedModules || []);
    const agentCount = await agentGen.writeDashArtifacts(destDir, agentArtifacts);

    const tasks = await getTasksFromBmad(bmadDir, options.selectedModules || []);
    const taskArtifacts = [];
    for (const task of tasks) {
      const content = await this.readAndProcessWithProject(
        task.path,
        {
          module: task.module,
          name: task.name,
        },
        projectDir,
      );
      taskArtifacts.push({
        type: 'task',
        name: task.name,
        displayName: task.name,
        module: task.module,
        path: task.path,
        sourcePath: task.path,
        relativePath: path.join(task.module, 'tasks', `${task.name}.md`),
        content,
      });
    }

    const workflowGenerator = new WorkflowCommandGenerator(this.bmadFolderName);
    const { artifacts: workflowArtifacts } = await workflowGenerator.collectWorkflowArtifacts(bmadDir);
    const workflowCount = await workflowGenerator.writeDashArtifacts(destDir, workflowArtifacts);

    // Also write tasks using underscore format
    const ttGen = new TaskToolCommandGenerator(this.bmadFolderName);
    const tasksWritten = await ttGen.writeDashArtifacts(destDir, taskArtifacts);

    const written = agentCount + workflowCount + tasksWritten;

    if (!options.silent) {
      await prompts.log.success(
        `${this.name} configured: ${counts.agents} agents, ${counts.workflows} workflows, ${counts.tasks} tasks, ${written} files → ${destDir}`,
      );
    }

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
      try {
        const entries = await fs.readdir(globalDir);
        if (entries && entries.some((entry) => entry && typeof entry === 'string' && entry.startsWith('bmad'))) {
          return true;
        }
      } catch {
        // Ignore errors
      }
    }

    // Check project-specific location
    if (await fs.pathExists(projectSpecificDir)) {
      try {
        const entries = await fs.readdir(projectSpecificDir);
        if (entries && entries.some((entry) => entry && typeof entry === 'string' && entry.startsWith('bmad'))) {
          return true;
        }
      } catch {
        // Ignore errors
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
        name: task.name,
        displayName: task.name,
        module: task.module,
        path: task.path,
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

  async clearOldBmadFiles(destDir, options = {}) {
    if (!(await fs.pathExists(destDir))) {
      return;
    }

    let entries;
    try {
      entries = await fs.readdir(destDir);
    } catch (error) {
      // Directory exists but can't be read - skip cleanup
      if (!options.silent) await prompts.log.warn(`Warning: Could not read directory ${destDir}: ${error.message}`);
      return;
    }

    if (!entries || !Array.isArray(entries)) {
      return;
    }

    for (const entry of entries) {
      // Skip non-strings or undefined entries
      if (!entry || typeof entry !== 'string') {
        continue;
      }
      if (!entry.startsWith('bmad')) {
        continue;
      }

      const entryPath = path.join(destDir, entry);
      try {
        await fs.remove(entryPath);
      } catch (error) {
        if (!options.silent) {
          await prompts.log.message(`  Skipping ${entry}: ${error.message}`);
        }
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
      'IMPORTANT: Codex Configuration',
      '',
      '/prompts installed globally to your HOME DIRECTORY.',
      '',
      'These prompts reference a specific _bmad path.',
      "To use with other projects, you'd need to copy the _bmad dir.",
      '',
      'You can now use /commands in Codex CLI',
      '  Example: /bmad_bmm_pm',
      '  Type / to see all available commands',
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
      'Project-Specific Codex Configuration',
      '',
      `Prompts will be installed to: ${destDir || '<project>/.codex/prompts'}`,
      '',
      'REQUIRED: You must set CODEX_HOME to use these prompts',
      '',
    ];

    const windowsLines = [
      'Create a codex.cmd file in your project root:',
      '',
      '  @echo off',
      '  set CODEX_HOME=%~dp0.codex',
      '  codex %*',
      '',
      String.raw`Then run: .\codex instead of codex`,
      '(The %~dp0 gets the directory of the .cmd file)',
    ];

    const unixLines = [
      'Add this alias to your ~/.bashrc or ~/.zshrc:',
      '',
      '  alias codex=\'CODEX_HOME="$PWD/.codex" codex\'',
      '',
      'After adding, run: source ~/.bashrc  (or source ~/.zshrc)',
      '(The $PWD uses your current working directory)',
    ];
    const closingLines = ['', 'This tells Codex CLI to use prompts from this project instead of ~/.codex'];

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
disable-model-invocation: true
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

    // Use underscore format: bmad_custom_fred-commit-poet.md
    const fileName = customAgentDashName(agentName);
    const launcherPath = path.join(destDir, fileName);
    await fs.writeFile(launcherPath, launcherContent, 'utf8');

    return {
      path: path.relative(projectDir, launcherPath),
      command: `/${fileName.replace('.md', '')}`,
    };
  }
}

module.exports = { CodexSetup };
