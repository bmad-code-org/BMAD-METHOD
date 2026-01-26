const chalk = require('chalk');
const path = require('node:path');
const { Installer } = require('../installers/lib/core/installer');
const { Manifest } = require('../installers/lib/core/manifest');
const { UI } = require('../lib/ui');

const installer = new Installer();
const manifest = new Manifest();
const ui = new UI();

module.exports = {
  command: 'status',
  description: 'Display BMAD installation status and module versions',
  options: [],
  action: async (options) => {
    try {
      // Find the bmad directory
      const projectDir = process.cwd();
      const { bmadDir } = await installer.findBmadDir(projectDir);

      // Check if bmad directory exists
      const fs = require('fs-extra');
      if (!(await fs.pathExists(bmadDir))) {
        console.log(chalk.yellow('No BMAD installation found in the current directory.'));
        console.log(chalk.dim(`Expected location: ${bmadDir}`));
        console.log(chalk.dim('\nRun "bmad install" to set up a new installation.'));
        process.exit(0);
        return;
      }

      // Read manifest
      const manifestData = await manifest._readRaw(bmadDir);

      if (!manifestData) {
        console.log(chalk.yellow('No BMAD installation manifest found.'));
        console.log(chalk.dim('\nRun "bmad install" to set up a new installation.'));
        process.exit(0);
        return;
      }

      // Get installation info
      const installation = manifestData.installation || {};
      const modules = manifestData.modules || [];

      // Check for available updates (only for external modules)
      const availableUpdates = await manifest.checkForUpdates(bmadDir);

      // Display status
      ui.displayStatus({
        installation,
        modules,
        availableUpdates,
        bmadDir,
      });

      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Status check failed:'), error.message);
      if (process.env.BMAD_DEBUG) {
        console.error(chalk.dim(error.stack));
      }
      process.exit(1);
    }
  },
};
