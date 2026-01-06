const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');
const platformCodes = require(path.join(__dirname, '../../../../tools/cli/lib/platform-codes'));

/**
 * Validate that a resolved path is within the project root (prevents path traversal)
 * @param {string} resolvedPath - The fully resolved absolute path
 * @param {string} projectRoot - The project root directory
 * @returns {boolean} - True if path is within project root
 */
function isWithinProjectRoot(resolvedPath, projectRoot) {
  const normalizedResolved = path.normalize(resolvedPath);
  const normalizedRoot = path.normalize(projectRoot);
  return normalizedResolved.startsWith(normalizedRoot + path.sep) || normalizedResolved === normalizedRoot;
}

/**
 * BMGD Module Installer
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
    logger.log(chalk.blue('🎮 Installing BMGD Module...'));

    // Create planning artifacts directory (for GDDs, game briefs, architecture)
    if (config['planning_artifacts'] && typeof config['planning_artifacts'] === 'string') {
      // Strip project-root prefix variations
      const planningConfig = config['planning_artifacts'].replace(/^\{project-root\}\/?/, '');
      const planningPath = path.join(projectRoot, planningConfig);
      if (!isWithinProjectRoot(planningPath, projectRoot)) {
        logger.warn(chalk.yellow(`Warning: planning_artifacts path escapes project root, skipping: ${planningConfig}`));
      } else if (!(await fs.pathExists(planningPath))) {
        logger.log(chalk.yellow(`Creating game planning artifacts directory: ${planningConfig}`));
        await fs.ensureDir(planningPath);
      }
    }

    // Create implementation artifacts directory (sprint status, stories, reviews)
    // Check both implementation_artifacts and implementation_artifacts for compatibility
    const implConfig = config['implementation_artifacts'] || config['implementation_artifacts'];
    if (implConfig && typeof implConfig === 'string') {
      // Strip project-root prefix variations
      const implConfigClean = implConfig.replace(/^\{project-root\}\/?/, '');
      const implPath = path.join(projectRoot, implConfigClean);
      if (!isWithinProjectRoot(implPath, projectRoot)) {
        logger.warn(chalk.yellow(`Warning: implementation_artifacts path escapes project root, skipping: ${implConfigClean}`));
      } else if (!(await fs.pathExists(implPath))) {
        logger.log(chalk.yellow(`Creating implementation artifacts directory: ${implConfigClean}`));
        await fs.ensureDir(implPath);
      }
    }

    // Create project knowledge directory
    if (config['project_knowledge'] && typeof config['project_knowledge'] === 'string') {
      // Strip project-root prefix variations
      const knowledgeConfig = config['project_knowledge'].replace(/^\{project-root\}\/?/, '');
      const knowledgePath = path.join(projectRoot, knowledgeConfig);
      if (!isWithinProjectRoot(knowledgePath, projectRoot)) {
        logger.warn(chalk.yellow(`Warning: project_knowledge path escapes project root, skipping: ${knowledgeConfig}`));
      } else if (!(await fs.pathExists(knowledgePath))) {
        logger.log(chalk.yellow(`Creating project knowledge directory: ${knowledgeConfig}`));
        await fs.ensureDir(knowledgePath);
      }
    }

    // Log selected game engine(s)
    if (config['primary_platform']) {
      const platforms = Array.isArray(config['primary_platform']) ? config['primary_platform'] : [config['primary_platform']];

      const platformNames = platforms.map((p) => {
        switch (p) {
          case 'unity': {
            return 'Unity';
          }
          case 'unreal': {
            return 'Unreal Engine';
          }
          case 'godot': {
            return 'Godot';
          }
          default: {
            return p;
          }
        }
      });

      logger.log(chalk.cyan(`Game engine support configured for: ${platformNames.join(', ')}`));
    }

    // Handle IDE-specific configurations if needed
    if (installedIDEs && installedIDEs.length > 0) {
      logger.log(chalk.cyan(`Configuring BMGD for IDEs: ${installedIDEs.join(', ')}`));

      for (const ide of installedIDEs) {
        await configureForIDE(ide, projectRoot, config, logger);
      }
    }

    logger.log(chalk.green('✓ BMGD Module installation complete'));
    logger.log(chalk.dim('  Game development workflows ready'));
    logger.log(chalk.dim('  Agents: Game Designer, Game Dev, Game Architect, Game SM, Game QA, Game Solo Dev'));

    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing BMGD module: ${error.message}`));
    return false;
  }
}

/**
 * Configure BMGD module for specific platform/IDE
 * @private
 */
async function configureForIDE(ide, projectRoot, config, logger) {
  // Validate platform code
  if (!platformCodes.isValidPlatform(ide)) {
    logger.warn(chalk.yellow(`  Warning: Unknown platform code '${ide}'. Skipping BMGD configuration.`));
    return;
  }

  const platformName = platformCodes.getDisplayName(ide);

  // Try to load platform-specific handler
  const platformSpecificPath = path.join(__dirname, 'platform-specifics', `${ide}.js`);

  try {
    if (await fs.pathExists(platformSpecificPath)) {
      const platformHandler = require(platformSpecificPath);

      if (typeof platformHandler.install === 'function') {
        const success = await platformHandler.install({
          projectRoot,
          config,
          logger,
          platformInfo: platformCodes.getPlatform(ide),
        });
        if (!success) {
          logger.warn(chalk.yellow(`  Warning: BMGD platform handler for ${platformName} returned failure`));
        }
      }
    } else {
      // No platform-specific handler for this IDE
      logger.log(chalk.dim(`  No BMGD-specific configuration for ${platformName}`));
    }
  } catch (error) {
    logger.warn(chalk.yellow(`  Warning: Could not load BMGD platform-specific handler for ${platformName}: ${error.message}`));
  }
}

module.exports = { install };
