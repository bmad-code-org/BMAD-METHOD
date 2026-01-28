const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');
const platformCodes = require(path.join(__dirname, '../../../../tools/cli/lib/platform-codes'));

/**
 * RMTN Developer Suite Installer
 */
async function install(options) {
  const { projectRoot, config, installedIDEs, logger } = options;

  try {
    logger.log(chalk.blue('Installing RMTN Developer Suite...'));

    // Create Saga directory
    if (config['saga_folder']) {
      const sagaConfig = config['saga_folder'].replace('{project-root}/', '');
      const sagaPath = path.join(projectRoot, sagaConfig);
      if (!(await fs.pathExists(sagaPath))) {
        logger.log(chalk.yellow(`Creating Saga directory: ${sagaConfig}`));
        await fs.ensureDir(sagaPath);
      }
    }

    // Create Quests directory
    if (config['quests_folder']) {
      const questsConfig = config['quests_folder'].replace('{project-root}/', '');
      const questsPath = path.join(projectRoot, questsConfig);
      if (!(await fs.pathExists(questsPath))) {
        logger.log(chalk.yellow(`Creating Quests directory: ${questsConfig}`));
        await fs.ensureDir(questsPath);
      }
    }

    // IDE-specific configuration
    if (installedIDEs && installedIDEs.length > 0) {
      logger.log(chalk.cyan(`Configuring for IDEs: ${installedIDEs.join(', ')}`));
      for (const ide of installedIDEs) {
        await configureForIDE(ide, projectRoot, config, logger);
      }
    }

    logger.log(chalk.green('✓ RMTN Developer Suite installation complete'));
    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing module: ${error.message}`));
    return false;
  }
}

async function configureForIDE(ide, projectRoot, config, logger) {
  // Simple check for now, can be expanded with full platform code validation
  // if (!platformCodes.isValidPlatform(ide)) { ... }

  const platformSpecificPath = path.join(__dirname, 'platform-specifics', `${ide}.js`);

  try {
    if (await fs.pathExists(platformSpecificPath)) {
      const platformHandler = require(platformSpecificPath);
      if (typeof platformHandler.install === 'function') {
        await platformHandler.install({ projectRoot, config, logger });
      }
    } else {
      // Optionally log that no specific handler exists for this IDE if that's expected behavior
      // logger.log(chalk.dim(`No specific configuration for ${ide}`));
    }
  } catch (error) {
    logger.warn(chalk.yellow(`Warning: Could not configure ${ide}: ${error.message}`));
  }
}

module.exports = { install };
