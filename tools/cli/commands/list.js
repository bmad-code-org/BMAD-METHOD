const chalk = require('chalk');
const { Installer } = require('../installers/lib/core/installer');

const installer = new Installer();

module.exports = {
  command: 'list',
  description: 'List available modules',
  options: [],
  action: async () => {
    try {
      const result = await installer.getAvailableModules();
      const { modules, customModules } = result;

      console.log(chalk.cyan('\n📦 Available BMAD Modules:\n'));

      for (const module of modules) {
        console.log(chalk.bold(`  ${module.id}`));
        console.log(chalk.dim(`    ${module.description}`));
        console.log(chalk.dim(`    Version: ${module.version}`));
        console.log();
      }

      if (customModules && customModules.length > 0) {
        console.log(chalk.cyan('\n🔧 Custom Modules:\n'));
        for (const module of customModules) {
          console.log(chalk.bold(`  ${module.id}`));
          console.log(chalk.dim(`    ${module.description}`));
          console.log(chalk.dim(`    Version: ${module.version}`));
          console.log();
        }
      }

      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  },
};
