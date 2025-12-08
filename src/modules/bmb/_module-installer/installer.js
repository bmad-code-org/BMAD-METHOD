const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');

/**
 * BMB Module Installer
 * Sets up custom agent and workflow locations for the BMad Builder module
 *
 * @param {Object} options - Installation options
 * @param {string} options.projectRoot - The root directory of the target project
 * @param {Object} options.config - Module configuration from module.yaml
 * @param {Object} options.coreConfig - Core configuration containing user_name
 * @param {Array<string>} options.installedIDEs - Array of IDE codes that were installed
 * @param {Object} options.logger - Logger instance for output
 * @returns {Promise<boolean>} - Success status
 */
async function install(options) {
  const { projectRoot, config, coreConfig, installedIDEs, logger } = options;

  try {
    logger.log(chalk.blue('🔧 Setting up BMB Module...'));

    // Generate custom.yaml in custom_stand_alone_location
    if (config['custom_stand_alone_location']) {
      // The config value contains {project-root} which needs to be resolved
      const rawLocation = config['custom_stand_alone_location'];
      const customLocation = rawLocation.replace('{project-root}', projectRoot);
      const customDestPath = path.join(customLocation, 'custom.yaml');

      logger.log(chalk.cyan(`  Setting up custom agents at: ${customLocation}`));

      // Ensure the directory exists
      await fs.ensureDir(customLocation);

      // Generate the custom.yaml content
      const userName = (coreConfig && coreConfig.user_name) || 'my';
      const customContent = `code: my-custom-bmad
name: "${userName}-Custom-BMad: Sample Stand Alone Custom Agents and Workflows"
default_selected: true
`;

      // Write the custom.yaml file (only if it doesn't exist to preserve user changes)
      if (await fs.pathExists(customDestPath)) {
        logger.log(chalk.yellow(`    ✓ custom.yaml already exists at ${customDestPath}`));
      } else {
        await fs.writeFile(customDestPath, customContent, 'utf8');
        logger.log(chalk.green(`    ✓ Created custom.yaml at ${customDestPath}`));
      }
    }

    // Set up custom module location if configured
    if (config['custom_module_location']) {
      const rawModuleLocation = config['custom_module_location'];
      const moduleLocation = rawModuleLocation.replace('{project-root}', projectRoot);

      logger.log(chalk.cyan(`  Setting up custom modules at: ${moduleLocation}`));

      // Ensure the directory exists
      await fs.ensureDir(moduleLocation);
      logger.log(chalk.green(`    ✓ Created modules directory at ${moduleLocation}`));
    }

    // Handle IDE-specific configurations if needed
    if (installedIDEs && installedIDEs.length > 0) {
      logger.log(chalk.cyan(`  Configuring BMB for IDEs: ${installedIDEs.join(', ')}`));
    }

    logger.log(chalk.green('✓ BMB Module setup complete'));
    return true;
  } catch (error) {
    logger.error(chalk.red(`Error setting up BMB module: ${error.message}`));
    return false;
  }
}

module.exports = { install };
