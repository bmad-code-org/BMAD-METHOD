const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');

/**
 * WDS Module Installer
 * Creates the alphabetized folder structure for Whiteport Design Studio
 *
 * @param {Object} options - Installation options
 * @param {string} options.projectRoot - The root directory of the target project
 * @param {Object} options.config - Module configuration from module.yaml
 * @param {Array<string>} options.installedIDEs - Array of IDE codes that were installed
 * @param {Object} options.logger - Logger instance for output
 * @returns {Promise<boolean>} - Success status
 */
async function install({ projectRoot, installedIDEs, logger }) {
  try {
    logger.log(chalk.blue('🎨 Installing WDS Module...'));

    // Create docs directory if it doesn't exist
    const docsPath = path.join(projectRoot, 'docs');
    if (!(await fs.pathExists(docsPath))) {
      logger.log(chalk.yellow('Creating docs directory'));
      await fs.ensureDir(docsPath);
    }

    // Create WDS alphabetized folder structure
    const wdsFolders = [
      'A-Product-Brief',
      'B-Trigger-Map',
      'C-Platform-Requirements',
      'C-Scenarios',
      'D-Design-System',
      'E-PRD',
      'F-Testing',
      'G-Product-Development',
    ];

    logger.log(chalk.cyan('Creating WDS folder structure...'));

    for (const folder of wdsFolders) {
      const folderPath = path.join(docsPath, folder);
      if (await fs.pathExists(folderPath)) {
        logger.log(chalk.dim(`  → ${folder}/ (already exists)`));
      } else {
        await fs.ensureDir(folderPath);
        logger.log(chalk.dim(`  ✓ ${folder}/`));
      }
    }

    // Create Design-Deliveries subfolder in E-PRD
    const designDeliveriesPath = path.join(docsPath, 'E-PRD', 'Design-Deliveries');
    if (!(await fs.pathExists(designDeliveriesPath))) {
      await fs.ensureDir(designDeliveriesPath);
      logger.log(chalk.dim('  ✓ E-PRD/Design-Deliveries/'));
    }

    // Create .gitkeep files to preserve empty directories
    for (const folder of wdsFolders) {
      const gitkeepPath = path.join(docsPath, folder, '.gitkeep');
      if (!(await fs.pathExists(gitkeepPath))) {
        await fs.writeFile(gitkeepPath, '# This file ensures the directory is tracked by git\n');
      }
    }

    // Create .gitkeep in Design-Deliveries
    const ddGitkeepPath = path.join(designDeliveriesPath, '.gitkeep');
    if (!(await fs.pathExists(ddGitkeepPath))) {
      await fs.writeFile(ddGitkeepPath, '# This file ensures the directory is tracked by git\n');
    }

    logger.log(chalk.green('✓ WDS folder structure created'));

    // Handle IDE-specific configurations if needed
    if (installedIDEs && installedIDEs.length > 0) {
      logger.log(chalk.cyan(`Configuring WDS for IDEs: ${installedIDEs.join(', ')}`));
      // WDS doesn't need IDE-specific configuration currently
      logger.log(chalk.dim('  No IDE-specific configuration needed for WDS'));
    }

    logger.log(chalk.green('✓ WDS Module installation complete'));
    logger.log(chalk.cyan('\n📋 Next steps:'));
    logger.log(chalk.dim('  1. Activate Saga (WDS Analyst) to start with Product Brief'));
    logger.log(chalk.dim('  2. Or activate Idunn (WDS PM) for Platform Requirements'));
    logger.log(chalk.dim('  3. Or activate Freya (WDS Designer) for UX Design'));

    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing WDS module: ${error.message}`));
    return false;
  }
}

module.exports = { install };
