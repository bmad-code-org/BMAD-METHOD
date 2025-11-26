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
 * @param {Object} options.config - Module configuration from install-config.yaml
 * @param {Array<string>} options.installedIDEs - Array of IDE codes that were installed
 * @param {Object} options.logger - Logger instance for output
 * @returns {Promise<boolean>} - Success status
 */
async function install(options) {
  const { projectRoot, config, installedIDEs, logger } = options;

  try {
    logger.log(chalk.blue('🚀 Installing BMM Module...'));

    // Check and create tech_docs directory if configured
    if (config['tech_docs']) {
      // Strip {project-root}/ prefix if present
      const techDocsConfig = config['tech_docs'].replace('{project-root}/', '');
      const techDocsPath = path.join(projectRoot, techDocsConfig);

      if (await fs.pathExists(techDocsPath)) {
        // Check if template exists, add if missing
        const templateDest = path.join(techDocsPath, 'technical-decisions-template.md');
        if (!(await fs.pathExists(templateDest))) {
          const templateSource = path.join(__dirname, 'assets', 'technical-decisions-template.md');
          if (await fs.pathExists(templateSource)) {
            await fs.copy(templateSource, templateDest);
            logger.log(chalk.green('✓ Added technical decisions template to existing directory'));
          }
        }
      } else {
        logger.log(chalk.yellow(`Creating technical documentation directory: ${techDocsConfig}`));
        await fs.ensureDir(techDocsPath);

        // Copy technical decisions template
        const templateSource = path.join(__dirname, 'assets', 'technical-decisions-template.md');
        const templateDest = path.join(techDocsPath, 'technical-decisions-template.md');

        if (await fs.pathExists(templateSource)) {
          await fs.copy(templateSource, templateDest, { overwrite: false });
          logger.log(chalk.green('✓ Added technical decisions template'));
        }
      }
    }

    // Create output directory if configured
    if (config['output_folder']) {
      // Strip {project-root}/ prefix if present
      const outputConfig = config['output_folder'].replace('{project-root}/', '');
      const outputPath = path.join(projectRoot, outputConfig);
      if (!(await fs.pathExists(outputPath))) {
        logger.log(chalk.yellow(`Creating output directory: ${outputConfig}`));
        await fs.ensureDir(outputPath);
      }
    }

    // Create dev story location if configured
    if (config['sprint_artifacts']) {
      // Strip {project-root}/ prefix if present
      const storyConfig = config['sprint_artifacts'].replace('{project-root}/', '');
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
