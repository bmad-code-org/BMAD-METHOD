const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');
const platformCodes = require(path.join(__dirname, '../../../../tools/cli/lib/platform-codes'));

/**
 * BMM Module Installer
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
    logger.log(chalk.blue('🚀 Installing BMM Module...'));

    // Create output directory if configured
    if (config['output_folder']) {
      const outputConfig = config['output_folder'].replace('{project-root}/', '');
      const outputPath = path.join(projectRoot, outputConfig);
      if (!(await fs.pathExists(outputPath))) {
        logger.log(chalk.yellow(`Creating output directory: ${outputConfig}`));
        await fs.ensureDir(outputPath);
      }
    }

    if (config['implementation_artifacts']) {
      const storyConfig = config['implementation_artifacts'].replace('{project-root}/', '');
      const storyPath = path.join(projectRoot, storyConfig);
      if (!(await fs.pathExists(storyPath))) {
        logger.log(chalk.yellow(`Creating story directory: ${storyConfig}`));
        await fs.ensureDir(storyPath);
      }
    }

    // Handle IDE-specific configurations if needed
    if (installedIDEs && installedIDEs.length > 0) {
      logger.log(chalk.cyan(`Configuring BMM for IDEs: ${installedIDEs.join(', ')}`));

      // Add any IDE-specific BMM configurations here
      for (const ide of installedIDEs) {
        await configureForIDE(ide, projectRoot, config, logger);
      }
    }

    logger.log(chalk.green('✓ BMM Module installation complete'));
    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing BMM module: ${error.message}`));
    return false;
  }
}

/**
 * Configure BMM module for specific platform/IDE
 * @private
 */
async function configureForIDE(ide, projectRoot, config, logger) {
  // Validate platform code
  if (!platformCodes.isValidPlatform(ide)) {
    logger.warn(chalk.yellow(`  Warning: Unknown platform code '${ide}'. Skipping BMM configuration.`));
    return;
  }

  const platformName = platformCodes.getDisplayName(ide);

  // Try to load platform-specific handler
  const platformSpecificPath = path.join(__dirname, 'platform-specifics', `${ide}.js`);

  try {
    if (await fs.pathExists(platformSpecificPath)) {
      const platformHandler = require(platformSpecificPath);

      if (typeof platformHandler.install === 'function') {
        await platformHandler.install({
          projectRoot,
          config,
          logger,
          platformInfo: platformCodes.getPlatform(ide), // Pass platform metadata
        });
      }
    } else {
      // No platform-specific handler for this IDE
      logger.log(chalk.dim(`  No BMM-specific configuration for ${platformName}`));
    }
  } catch (error) {
    logger.warn(chalk.yellow(`  Warning: Could not load BMM platform-specific handler for ${platformName}: ${error.message}`));
  }
}

module.exports = { install };
