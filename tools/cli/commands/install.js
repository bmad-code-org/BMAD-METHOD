const chalk = require('chalk');
const path = require('node:path');
const { Installer } = require('../installers/lib/core/installer');
const { UI } = require('../lib/ui');

const installer = new Installer();
const ui = new UI();

module.exports = {
  command: 'install',
  description: `Install BMAD Core agents and tools

Examples:
  bmad install                                          # Interactive installation
  bmad install -y                                       # Non-interactive with defaults
  bmad install -y --user-name=Alice --skill-level=advanced
  bmad install -y --team=fullstack                      # Install fullstack team
  bmad install -y --team=fullstack --agents=+dev        # Add dev to fullstack team
  bmad install -y --agents=dev,architect,pm             # Selective agents
  bmad install -y --profile=minimal                     # Minimal profile
  bmad install -y --workflows=create-prd,dev-story      # Selective workflows

Special Values:
  --agents=all, --agents=none, --agents=minimal
  --workflows=all, --workflows=none, --workflows=minimal

Modifiers:
  --agents=+dev       Add agent to team/profile selection
  --agents=-dev       Remove agent from team/profile selection

Available Teams: fullstack, gamedev
Available Profiles: minimal, full, solo-dev, team`,
  options: [
    ['-y, --non-interactive', 'Run without prompts, use defaults'],
    ['--user-name <name>', 'User name for configuration'],
    ['--skill-level <level>', 'User skill level (beginner, intermediate, advanced)'],
    ['--output-folder <path>', 'Output folder path for BMAD artifacts'],
    ['--modules <list>', 'Comma-separated list of modules to install (e.g., core,bmm)'],
    ['--agents <list>', 'Comma-separated list of agents to install (e.g., dev,architect,pm)'],
    ['--workflows <list>', 'Comma-separated list of workflows to install'],
    ['--team <name>', 'Install predefined team bundle (e.g., fullstack, gamedev)'],
    ['--profile <name>', 'Installation profile (minimal, full, solo-dev)'],
    ['--communication-language <lang>', 'Language for agent communication (default: English)'],
    ['--document-language <lang>', 'Language for generated documents (default: English)'],
  ],
  action: async (options) => {
    try {
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
        console.log(chalk.cyan(`Updated ${result.moduleCount} modules with preserved settings`));
        console.log(
          chalk.magenta(
            "\n📋 Want to see what's new? Check out the changelog: https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md",
          ),
        );
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
