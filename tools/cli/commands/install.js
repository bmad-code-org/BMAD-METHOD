const chalk = require('chalk');
const path = require('node:path');
const { Installer } = require('../installers/lib/core/installer');
const { UI } = require('../lib/ui');
const { KiroCLIGenerator } = require('../lib/kiro-cli-generator');

const installer = new Installer();
const ui = new UI();
const kiroGenerator = new KiroCLIGenerator();

module.exports = {
  command: 'install',
  description: 'Install BMAD Core agents and tools',
  options: [],
  action: async () => {
    try {
      const config = await ui.promptInstall();

      // Handle cancel
      if (config.actionType === 'cancel') {
        console.log(chalk.yellow('Installation cancelled.'));
        process.exit(0);
        return;
      }

      // Handle agent compilation separately
      if (config.actionType === 'compile') {
        const result = await installer.compileAgents(config);
        console.log(chalk.green('\n✨ Agent compilation complete!'));
        console.log(chalk.cyan(`Rebuilt ${result.agentCount} agents and ${result.taskCount} tasks`));
        process.exit(0);
        return;
      }

      // Handle quick update separately
      if (config.actionType === 'quick-update') {
        const result = await installer.quickUpdate(config);
        console.log(chalk.green('\n✨ Quick update complete!'));
        console.log(chalk.cyan(`Updated ${result.moduleCount} modules with preserved settings`));
        process.exit(0);
        return;
      }

      // Handle reinstall by setting force flag
      if (config.actionType === 'reinstall') {
        config._requestedReinstall = true;
      }

      // Regular install/update flow
      const result = await installer.install(config);

      // Check if installation was cancelled
      if (result && result.cancelled) {
        process.exit(0);
        return;
      }

      // Check if installation succeeded
      if (result && result.success) {
        console.log(chalk.green('\n✨ Installation complete!'));
        console.log(chalk.cyan('BMAD Core and Selected Modules have been installed to:'), chalk.bold(result.path));

        // Generate Kiro CLI agents automatically using the installation directory
        try {
          // Use the directory where BMAD was installed, not current working directory
          const installDir = path.dirname(result.path); // Remove .bmad from path to get project root
          await kiroGenerator.generateWithOutput(installDir);
        } catch (error) {
          console.log(chalk.yellow('⚠️  Kiro CLI agent generation failed (non-critical):'), error.message);
        }

        console.log(chalk.yellow('\nThank you for helping test the early release version of the new BMad Core and BMad Method!'));
        console.log(chalk.cyan('Stable Beta coming soon - please read the full readme.md and linked documentation to get started!'));
        process.exit(0);
      }
    } catch (error) {
      // Check if error has a complete formatted message
      if (error.fullMessage) {
        console.error(error.fullMessage);
        if (error.stack) {
          console.error('\n' + chalk.dim(error.stack));
        }
      } else {
        // Generic error handling for all other errors
        console.error(chalk.red('Installation failed:'), error.message);
        console.error(chalk.dim(error.stack));
      }
      process.exit(1);
    }
  },
};
