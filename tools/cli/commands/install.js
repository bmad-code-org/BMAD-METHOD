const chalk = require('chalk');
const { Installer } = require('../lib/installer');
const { UI } = require('../lib/ui');

const installer = new Installer();
const ui = new UI();

module.exports = {
  command: 'install',
  description: 'Install WDS agents and workflows into your project',
  options: [],
  action: async () => {
    try {
      const config = await ui.promptInstall();

      if (config.cancelled) {
        console.log(chalk.yellow('\nInstallation cancelled.'));
        process.exit(0);
        return;
      }

      const result = await installer.install(config);

      if (result && result.success) {
        ui.displaySuccess(config.wdsFolder, config.ides, config.install_design_space, config.ds_name, config.ds_backend);
        process.exit(0);
      }
    } catch (error) {
      console.error(chalk.red('\nInstallation failed:'), error.message);
      console.error(chalk.dim(error.stack));
      process.exit(1);
    }
  },
};
