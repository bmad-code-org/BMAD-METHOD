const chalk = require('chalk');
const path = require('node:path');
const inquirer = require('inquirer').default || require('inquirer');
const { Installer } = require('../installers/lib/core/installer');
const { UI } = require('../lib/ui');

const installer = new Installer();
const ui = new UI();

module.exports = {
  command: 'install',
  description: 'Install BMAD Core agents and tools',
  options: [['-d, --debug', 'Enable debug output for manifest generation']],
  action: async (options) => {
    try {
      // Set debug flag as environment variable for all components
      if (options.debug) {
        process.env.BMAD_DEBUG_MANIFEST = 'true';
        console.log(chalk.cyan('Debug mode enabled\n'));
      }

      const config = await ui.promptInstall();

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
        console.log(chalk.cyan(`Updated ${result.moduleCount} modules with preserved settings`));

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
        // Run AgentVibes installer if needed
        if (result.needsAgentVibes) {
          // Add some spacing before AgentVibes setup
          console.log('');
          console.log(chalk.magenta('🎙️  AgentVibes TTS Setup'));
          console.log(chalk.cyan('AgentVibes provides voice synthesis for BMAD agents with:'));
          console.log(chalk.dim('  • ElevenLabs AI (150+ premium voices)'));
          console.log(chalk.dim('  • Piper TTS (50+ free voices)\n'));

          await inquirer.prompt([
            {
              type: 'input',
              name: 'continue',
              message: chalk.green('Press Enter to start AgentVibes installer...'),
            },
          ]);

          console.log('');

          // Run AgentVibes installer
          const { execSync } = require('node:child_process');
          try {
            execSync('npx agentvibes@latest install', {
              cwd: result.projectDir,
              stdio: 'inherit',
              shell: true,
            });
            console.log(chalk.green('\n✓ AgentVibes installation complete'));
            console.log(chalk.cyan('\n✨ BMAD with TTS is ready to use!'));
          } catch {
            console.log(chalk.yellow('\n⚠ AgentVibes installation was interrupted or failed'));
            console.log(chalk.cyan('You can run it manually later with:'));
            console.log(chalk.green(`  cd ${result.projectDir}`));
            console.log(chalk.green('  npx agentvibes install\n'));
          }
        }

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
