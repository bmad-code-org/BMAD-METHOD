const path = require('node:path');
const prompts = require('../lib/prompts');
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
        await prompts.log.warn('No BMAD installation found in the current directory.');
        await prompts.log.message(`Expected location: ${bmadDir}`);
        await prompts.log.message('Run "bmad install" to set up a new installation.');
        process.exit(0);
        return;
      }

      // Read manifest
      const manifestData = await manifest._readRaw(bmadDir);

      if (!manifestData) {
        await prompts.log.warn('No BMAD installation manifest found.');
        await prompts.log.message('Run "bmad install" to set up a new installation.');
        process.exit(0);
        return;
      }

      // Get installation info
      const installation = manifestData.installation || {};
      const modules = manifestData.modules || [];

      // Check for available updates (only for external modules)
      const availableUpdates = await manifest.checkForUpdates(bmadDir);

      // Display status
      await ui.displayStatus({
        installation,
        modules,
        availableUpdates,
        bmadDir,
      });

      process.exit(0);
    } catch (error) {
      await prompts.log.error(`Status check failed: ${error.message}`);
      if (process.env.BMAD_DEBUG) {
        await prompts.log.message(error.stack);
      }
      process.exit(1);
    }
  },
};
