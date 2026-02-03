const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('node:path');

/**
 * Core Module Installer
 * Standard module installer function that executes after IDE installations
 *
 * @param {Object} options - Installation options
 * @param {string} options.projectRoot - The root directory of the target project
 * @param {Object} options.config - Module configuration from module.yaml
 * @param {Array<string>} options.installedIDEs - Array of IDE codes that were installed
 * @param {Object} options.logger - Logger instance for output
 * @returns {Promise<boolean>} - Success status
 */
async function install(options) {
  const { projectRoot, config, installedIDEs, logger } = options;

  try {
    logger.log(chalk.blue('🏗️  Installing Core Module...'));

    // Core agent configs are created by the main installer's createAgentConfigs method
    // No need to create them here - they'll be handled along with all other agents

    // Handle IDE-specific configurations if needed
    if (installedIDEs && installedIDEs.length > 0) {
      logger.log(chalk.cyan(`Configuring Core for IDEs: ${installedIDEs.join(', ')}`));

      // Add any IDE-specific Core configurations here
      for (const ide of installedIDEs) {
        await configureForIDE(ide, projectRoot, config, logger);
      }
    }

    logger.log(chalk.green('✓ Core Module installation complete'));
    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing Core module: ${error.message}`));
    return false;
  }
}

/**
 * Configure Core module for specific IDE
 * @param {string} ide - The IDE code (e.g., 'claude-code', 'cursor')
 * @param {string} projectRoot - Path to the target project root
 * @param {Object} config - Module configuration
 * @param {Object} logger - Logger instance
 * @private
 */
async function configureForIDE(ide, projectRoot, config, logger) {
  switch (ide) {
    case 'claude-code': {
      // Install BMAD Auto scripts for automated development workflow
      await installBmadAutoScripts(projectRoot, config, logger);
      break;
    }
    default: {
      // No specific configuration needed for other IDEs
      break;
    }
  }
}

/**
 * Install BMAD Auto automation scripts for Claude Code
 *
 * This function:
 * 1. Creates the .scripts/bmad-auto/claude/ directory in the target project
 * 2. Copies the automation scripts (PS1, SH, MD files)
 * 3. Generates a config file with project-specific paths
 *
 * @param {string} projectRoot - Path to the target project root
 * @param {Object} config - Module configuration containing output_folder
 * @param {Object} logger - Logger instance for output
 * @private
 */
async function installBmadAutoScripts(projectRoot, config, logger) {
  // Source directory: where our template scripts are stored
  // Located relative to this installer file: ../scripts/bmad-auto/
  const scriptsSource = path.join(__dirname, '..', 'scripts', 'bmad-auto');

  // Target directory: where scripts will be installed in user's project
  const scriptsTarget = path.join(projectRoot, '.scripts', 'bmad-auto', 'claude');

  // Check if source scripts exist
  if (!(await fs.pathExists(scriptsSource))) {
    logger.log(chalk.yellow('  ⚠ BMAD Auto scripts source not found, skipping'));
    return;
  }

  // Create target directory
  await fs.ensureDir(scriptsTarget);

  // List of script files to copy
  const scriptFiles = [
    'bmad-loop.ps1', // Windows PowerShell version
    'bmad-loop.sh', // Linux/macOS Bash version
    'bmad-prompt.md', // Prompt template for Claude Code
    'README.md', // Usage documentation
  ];

  // Copy each script file
  for (const file of scriptFiles) {
    const sourcePath = path.join(scriptsSource, file);
    const targetPath = path.join(scriptsTarget, file);

    if (await fs.pathExists(sourcePath)) {
      await fs.copy(sourcePath, targetPath);
    }
  }

  // Generate the configuration file with project-specific paths
  // The output_folder may contain template variables like {project-root}/
  const outputFolder = (config.output_folder || '_bmad-output')
    .replace('{project-root}/', '')
    .replace('{project-root}\\', '')
    .replace(/^\//, '') // Remove leading slash if present
    .replace(/^\\/, ''); // Remove leading backslash if present

  // Create config YAML content
  // Using forward slashes for cross-platform compatibility
  const configContent = `# BMAD Auto Configuration
# ============================================================
# This file is auto-generated during BMAD installation.
# It contains paths specific to your project setup.
#
# You can modify these values if you change your BMAD configuration:
# - output_folder: Where BMAD stores generated files
# - implementation_artifacts: Where sprint-status.yaml is located
# ============================================================

# Absolute path to your project root directory
project_root: "${projectRoot.replaceAll('\\', '/')}"

# Relative path to BMAD output folder (from project root)
output_folder: "${outputFolder}"

# Relative path to implementation artifacts (where sprint-status.yaml lives)
implementation_artifacts: "${outputFolder}/implementation-artifacts"
`;

  // Write the config file
  const configPath = path.join(scriptsTarget, 'bmad-auto-config.yaml');
  await fs.writeFile(configPath, configContent, 'utf8');

  // Make bash script executable on Unix systems
  const bashScriptPath = path.join(scriptsTarget, 'bmad-loop.sh');
  if (await fs.pathExists(bashScriptPath)) {
    try {
      await fs.chmod(bashScriptPath, 0o755);
    } catch {
      // Ignore chmod errors on Windows
    }
  }

  logger.log(chalk.green('  ✓ BMAD Auto scripts installed to .scripts/bmad-auto/claude/'));
}

module.exports = { install };
