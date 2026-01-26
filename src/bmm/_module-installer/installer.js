const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');

// Directories to create from config
const DIRECTORIES = ['output_folder', 'planning_artifacts', 'implementation_artifacts'];

/**
 * BMM Module Installer
 * Creates output directories configured in module config
 *
 * @param {Object} options - Installation options
 * @param {string} options.projectRoot - The root directory of the target project
 * @param {Object} options.config - Module configuration from module.yaml
 * @param {Array<string>} options.installedIDEs - Array of IDE codes that were installed
 * @param {Object} options.logger - Logger instance for output
 * @returns {Promise<boolean>} - Success status
 */
async function install(options) {
  const { projectRoot, config, logger } = options;

  try {
    logger.log(chalk.blue('🚀 Installing BMM Module...'));

    // Create configured directories
    for (const configKey of DIRECTORIES) {
      const configValue = config[configKey];
      if (!configValue) continue;

      const dirPath = configValue.replace('{project-root}/', '');
      const fullPath = path.join(projectRoot, dirPath);

      if (!(await fs.pathExists(fullPath))) {
        const dirName = configKey.replace('_', ' ');
        logger.log(chalk.yellow(`Creating ${dirName} directory: ${dirPath}`));
        await fs.ensureDir(fullPath);
      }
    }

    logger.log(chalk.green('✓ BMM Module installation complete'));
    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing BMM module: ${error.message}`));
    return false;
  }
}

module.exports = { install };
