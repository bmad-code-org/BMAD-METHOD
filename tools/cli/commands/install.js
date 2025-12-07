const chalk = require('chalk');
const path = require('node:path');
const { Installer } = require('../installers/lib/core/installer');
const { UI } = require('../lib/ui');

const installer = new Installer();
const ui = new UI();

module.exports = {
  command: 'install',
  description: 'Install BMAD Core agents and tools',
  options: [],
  action: async (options) => {
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
        console.log(chalk.yellow('\nThank you for helping test the early release version of the new BMad Core and BMad Method!'));
        console.log(chalk.cyan('Stable Beta coming soon - please read the full README.md and linked documentation to get started!'));

        // Run AgentVibes installer if needed
        if (result.needsAgentVibes) {
          console.log(chalk.magenta('\n🎙️  AgentVibes TTS Setup'));
          console.log(chalk.cyan('AgentVibes provides voice synthesis for BMAD agents with:'));
          console.log(chalk.dim('  • ElevenLabs AI (150+ premium voices)'));
          console.log(chalk.dim('  • Piper TTS (50+ free voices)\n'));

          const readline = require('node:readline');
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

          await new Promise((resolve) => {
            rl.question(chalk.green('Press Enter to start AgentVibes installer...'), () => {
              rl.close();
              resolve();
            });
          });

          console.log('');

          // Run AgentVibes installer
          const { execSync } = require('node:child_process');
          const fs = require('node:fs');
          const path = require('node:path');

          try {
            // Clear ALL npm config env vars to prevent inheritance issues
            // when BMAD is invoked with --prefix flag
            // npm sets many npm_config_* and npm_package_* vars that can interfere
            const cleanEnv = Object.fromEntries(
              Object.entries(process.env).filter(([key]) => !key.startsWith('npm_config_') && !key.startsWith('npm_package_')),
            );

            // Check if this is first-time AgentVibes installation
            const agentvibesDir = path.join(result.projectDir, '.agentvibes');
            const isFirstTime = !fs.existsSync(agentvibesDir);
            const installCmd = isFirstTime ? 'npx agentvibes@latest install --with-audio' : 'npx agentvibes@latest install';

            execSync(installCmd, {
              cwd: result.projectDir,
              stdio: 'inherit',
              shell: true,
              env: cleanEnv,
            });
            console.log(chalk.green('\n✓ AgentVibes installation complete'));
          } catch {
            console.log(chalk.yellow('\n⚠ AgentVibes installation was interrupted or failed'));
            console.log(chalk.cyan('You can run it manually later with:'));
            console.log(chalk.green(`  cd ${result.projectDir}`));
            console.log(chalk.green('  npx agentvibes install\n'));
          }
        }

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
