const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');

/**
 * CIS Module Installer
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
    logger.log(chalk.blue('🎨 Installing CIS Module...'));

    // Create output directory if configured
    if (config['output_folder']) {
      // Strip {project-root}/ prefix if present
      const outputConfig = config['output_folder'].replace('{project-root}/', '');
      const outputPath = path.join(projectRoot, outputConfig);
      if (!(await fs.pathExists(outputPath))) {
        logger.log(chalk.yellow(`Creating CIS output directory: ${outputConfig}`));
        await fs.ensureDir(outputPath);

        // Add any default CIS templates or assets here
        const templatesSource = path.join(__dirname, 'assets');
        const templateFiles = await fs.readdir(templatesSource).catch(() => []);

        for (const file of templateFiles) {
          const source = path.join(templatesSource, file);
          const dest = path.join(outputPath, file);

          if (!(await fs.pathExists(dest))) {
            await fs.copy(source, dest);
            logger.log(chalk.green(`✓ Added ${file}`));
          }
        }
      }
    }

    // Handle IDE-specific configurations if needed
    if (installedIDEs && installedIDEs.length > 0) {
      logger.log(chalk.cyan(`Configuring CIS for IDEs: ${installedIDEs.join(', ')}`));

      // Add any IDE-specific CIS configurations here
      for (const ide of installedIDEs) {
        await configureForIDE(ide, projectRoot, config, logger);
      }
    }

    logger.log(chalk.green('✓ CIS Module installation complete'));
    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing CIS module: ${error.message}`));
    return false;
  }
}

/**
 * Configure CIS module for specific IDE
 * @private
 */
async function configureForIDE(ide) {
  // Add IDE-specific configurations here
  switch (ide) {
    case 'claude-code': {
      // Claude Code specific CIS configurations
      break;
    }
    case 'cursor': {
      // Cursor specific CIS configurations
      break;
    }
    case 'windsurf': {
      // Windsurf specific CIS configurations
      break;
    }
    // Add more IDEs as needed
    default: {
      // No specific configuration needed
      break;
    }
  }
}

module.exports = { install };
