const path = require('node:path');
const fs = require('fs-extra');
const os = require('node:os');
const chalk = require('chalk');
const { ConfigDrivenIdeSetup } = require('./_config-driven');
const { getSourcePath } = require('../../../lib/project-root');
const prompts = require('../../../lib/prompts');

/**
 * Codex setup handler (CLI mode)
 *
 * Extends config-driven setup with Codex-specific features:
 * - Install location choice (global vs project-specific)
 * - Configuration prompts
 * - Detailed setup instructions
 */
class CodexSetup extends ConfigDrivenIdeSetup {
  constructor() {
    // Initialize with codex platform config
    const platformConfig = {
      name: 'Codex',
      preferred: false,
      installer: {
        target_dir: '.codex/prompts',
        frontmatter_template: 'none', // Codex uses no frontmatter
      },
    };
    super('codex', platformConfig);
  }

  /**
   * Get the Codex agent command activation header from central template
   * @returns {string} The activation header text
   */
  async getAgentCommandHeader() {
    const headerPath = getSourcePath('tools/cli/installers/lib/ide/templates', 'codex-agent-command-template.md');
    return await fs.readFile(headerPath, 'utf8');
  }

  /**
   * Override setup to add install location choice and instructions
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Collect install location choice
    const installLocation = options.preCollectedConfig?.installLocation || (await this.collectInstallLocation());

    // Determine destination directory
    const destDir = this.getCodexPromptDir(projectDir, installLocation);
    await fs.ensureDir(destDir);
    await this.clearOldBmadFiles(destDir);

    // Use unified installer with custom destination
    const { UnifiedInstaller, NamingStyle } = require('./shared/unified-installer');
    const installer = new UnifiedInstaller(this.bmadFolderName);
    const counts = await installer.install(
      projectDir,
      bmadDir,
      {
        targetDir: destDir,
        namingStyle: NamingStyle.FLAT_DASH,
        frontmatterTemplate: 'none', // Codex uses no frontmatter
      },
      options.selectedModules || [],
    );

    // Show results and instructions
    this.printResults(counts, destDir, installLocation);

    return {
      success: true,
      mode: 'cli',
      ...counts,
      destination: destDir,
      installLocation,
    };
  }

  /**
   * Collect install location choice from user
   */
  async collectInstallLocation() {
    let confirmed = false;
    let installLocation = 'global';

    while (!confirmed) {
      installLocation = await prompts.select({
        message: 'Where would you like to install Codex CLI prompts?',
        choices: [
          {
            name: 'Global - Simple for single project (~/codex/prompts, references THIS project only)',
            value: 'global',
          },
          {
            name: `Project-specific - Recommended for real work (requires CODEX_HOME=<project-dir>/.codex)`,
            value: 'project',
          },
        ],
        default: 'global',
      });

      console.log('');
      if (installLocation === 'project') {
        console.log(this.getProjectSpecificInstructions());
      } else {
        console.log(this.getGlobalInstructions());
      }

      confirmed = await prompts.confirm({
        message: 'Proceed with this installation option?',
        default: true,
      });

      if (!confirmed) {
        console.log(chalk.yellow("\n  Let's choose a different installation option.\n"));
      }
    }

    return { installLocation };
  }

  /**
   * Get Codex prompts directory based on location choice
   */
  getCodexPromptDir(projectDir = null, location = 'global') {
    if (location === 'project' && projectDir) {
      return path.join(projectDir, '.codex', 'prompts');
    }
    return path.join(os.homedir(), '.codex', 'prompts');
  }

  /**
   * Print results and instructions
   */
  printResults(counts, destDir, installLocation) {
    console.log(chalk.green(`✓ Codex configured:`));
    console.log(chalk.dim(`  - Mode: CLI`));
    console.log(chalk.dim(`  - Location: ${installLocation}`));
    console.log(chalk.dim(`  - ${counts.agents} agents installed`));
    if (counts.workflows > 0) {
      console.log(chalk.dim(`  - ${counts.workflows} workflow commands generated`));
    }
    if (counts.tasks + counts.tools > 0) {
      console.log(chalk.dim(`  - ${counts.tasks + counts.tools} task/tool commands (${counts.tasks} tasks, ${counts.tools} tools)`));
    }
    console.log(chalk.dim(`  - ${counts.total} files written`));
    console.log(chalk.dim(`  - Destination: ${destDir}`));

    // Show setup instructions if project-specific
    if (installLocation === 'project') {
      console.log('');
      console.log(chalk.yellow('  Next steps:'));
      console.log(chalk.dim(this.getProjectSpecificNextSteps()));
    }
  }

  /**
   * Get instructions for global installation
   */
  getGlobalInstructions() {
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
      chalk.dim('    Example: /bmad-bmm-pm'),
      chalk.dim('    Type / to see all available commands'),
      '',
      chalk.bold.cyan('═'.repeat(70)),
      '',
    ];
    return lines.join('\n');
  }

  /**
   * Get instructions for project-specific installation
   */
  getProjectSpecificInstructions() {
    const isWindows = os.platform() === 'win32';

    const commonLines = [
      '',
      chalk.bold.cyan('═'.repeat(70)),
      chalk.bold.yellow('  Project-Specific Codex Configuration'),
      chalk.bold.cyan('═'.repeat(70)),
      '',
      chalk.white('  Prompts will be installed to: ') + chalk.cyan('<project>/.codex/prompts'),
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

    return [...commonLines, ...(isWindows ? windowsLines : unixLines)].join('\n');
  }

  /**
   * Get next steps for project-specific installation
   */
  getProjectSpecificNextSteps() {
    const isWindows = os.platform() === 'win32';
    if (isWindows) {
      return `Create codex.cmd in project root with:\n    set CODEX_HOME=%~dp0.codex\n    codex %*`;
    }
    return `Add to ~/.bashrc or ~/.zshrc:\n    alias codex='CODEX_HOME="$PWD/.codex" codex'`;
  }

  /**
   * Clear old BMAD files from destination
   */
  async clearOldBmadFiles(destDir) {
    if (!(await fs.pathExists(destDir))) {
      return;
    }

    const entries = await fs.readdir(destDir);
    for (const entry of entries) {
      if (!entry.startsWith('bmad')) {
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

  /**
   * Detect Codex installation (checks both global and project locations)
   */
  async detect(projectDir) {
    const globalDir = this.getCodexPromptDir(null, 'global');
    const projectDir_local = projectDir || process.cwd();
    const projectSpecificDir = this.getCodexPromptDir(projectDir_local, 'project');

    // Check global location
    if (await fs.pathExists(globalDir)) {
      const entries = await fs.readdir(globalDir);
      if (entries.some((entry) => entry.startsWith('bmad'))) {
        return true;
      }
    }

    // Check project-specific location
    if (await fs.pathExists(projectSpecificDir)) {
      const entries = await fs.readdir(projectSpecificDir);
      if (entries.some((entry) => entry.startsWith('bmad'))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Cleanup Codex configuration (both global and project-specific)
   */
  async cleanup(projectDir = null) {
    const globalDir = this.getCodexPromptDir(null, 'global');
    await this.clearOldBmadFiles(globalDir);

    if (projectDir) {
      const projectSpecificDir = this.getCodexPromptDir(projectDir, 'project');
      await this.clearOldBmadFiles(projectSpecificDir);
    }
  }

  /**
   * Install a custom agent launcher for Codex
   */
  async installCustomAgentLauncher(projectDir, agentName, agentPath, metadata) {
    const destDir = this.getCodexPromptDir(projectDir, 'project');
    await fs.ensureDir(destDir);

    // Load the custom agent launcher template
    const templatePath = getSourcePath('tools/cli/installers/lib/ide/templates', 'codex-custom-agent-template.md');
    let templateContent = await fs.readFile(templatePath, 'utf8');

    // Get activation header
    const activationHeader = await this.getAgentCommandHeader();

    // Replace placeholders
    const relativePath = `_bmad/${agentPath}`;
    templateContent = templateContent
      .replaceAll('{{name}}', agentName)
      .replaceAll('{{description}}', `${agentName} agent`)
      .replaceAll('{{activationHeader}}', activationHeader)
      .replaceAll('{{relativePath}}', relativePath);

    const { customAgentDashName } = require('./shared/path-utils');
    const fileName = customAgentDashName(agentName);
    const launcherPath = path.join(destDir, fileName);
    await fs.writeFile(launcherPath, templateContent, 'utf8');

    return {
      path: path.relative(projectDir, launcherPath),
      command: `/${fileName.replace('.md', '')}`,
    };
  }
}

module.exports = { CodexSetup };
