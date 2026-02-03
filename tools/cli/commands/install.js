const chalk = require('chalk');
const path = require('node:path');
const { Installer } = require('../installers/lib/core/installer');
const { UI } = require('../lib/ui');

const installer = new Installer();
const ui = new UI();

module.exports = {
  command: 'install',
  description: 'Install BMAD Core agents and tools',
  options: [
    ['-d, --debug', 'Enable debug output for manifest generation'],
    ['--directory <path>', 'Installation directory (default: current directory)'],
    ['--modules <modules>', 'Comma-separated list of module IDs to install (e.g., "bmm,bmb")'],
    [
      '--tools <tools>',
      'Comma-separated list of tool/IDE IDs to configure (e.g., "claude-code,cursor"). Use "none" to skip tool configuration.',
    ],
    ['--custom-content <paths>', 'Comma-separated list of paths to custom modules/agents/workflows'],
    ['--action <type>', 'Action type for existing installations: install, update, quick-update, or compile-agents'],
    ['--user-name <name>', 'Name for agents to use (default: system username)'],
    ['--communication-language <lang>', 'Language for agent communication (default: English)'],
    ['--document-output-language <lang>', 'Language for document output (default: English)'],
    ['--output-folder <path>', 'Output folder path relative to project root (default: _bmad-output)'],
    ['-y, --yes', 'Accept all defaults and skip prompts where possible'],
  ],
  action: async (options) => {
    try {
      // Set debug flag as environment variable for all components
      if (options.debug) {
        process.env.BMAD_DEBUG_MANIFEST = 'true';
        console.log(chalk.cyan('Debug mode enabled\n'));
      }

      const config = await ui.promptInstall(options);

      // Handle cancel
      if (config.actionType === 'cancel') {
        console.log(chalk.yellow('Installation cancelled.'));
        process.exit(0);
        return;
      }

      // Handle quick update separately
      if (config.actionType === 'quick-update') {
        const result = await installer.quickUpdate(config);
        console.log(chalk.green('\n✨ Quick update complete!'));
        console.log(chalk.cyan(`Updated ${result.moduleCount} modules with preserved settings (${result.modules.join(', ')})`));

        // Display version-specific end message
        const { MessageLoader } = require('../installers/lib/message-loader');
        const messageLoader = new MessageLoader();
        messageLoader.displayEndMessage();

        process.exit(0);
        return;
      }

      // Handle compile agents separately
      if (config.actionType === 'compile-agents') {
        const result = await installer.compileAgents(config);
        console.log(chalk.green('\n✨ Agent recompilation complete!'));
        console.log(chalk.cyan(`Recompiled ${result.agentCount} agents with customizations applied`));
        process.exit(0);
        return;
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
        // Display version-specific end message from install-messages.yaml
        const { MessageLoader } = require('../installers/lib/message-loader');
        const messageLoader = new MessageLoader();
        messageLoader.displayEndMessage();

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
