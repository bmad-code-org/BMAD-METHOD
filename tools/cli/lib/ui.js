/**
 * WDS Installer UI - Banner, prompts, and success message.
 */

const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer').default || require('inquirer');
const path = require('node:path');

class UI {
  /**
   * Display the WDS ASCII banner
   */
  displayBanner() {
    try {
      const banner = figlet.textSync('WDS', { font: 'Standard' });
      console.log(chalk.cyan(banner));
    } catch {
      console.log(chalk.cyan.bold('\n  W D S'));
    }
    console.log(chalk.white.bold('  Whiteport Design Studio'));
    console.log(chalk.dim('  Strategic design methodology for AI-powered workflows\n'));
  }

  /**
   * Run the full prompt flow and return config
   */
  async promptInstall() {
    this.displayBanner();

    const projectDir = process.cwd();
    const defaultProjectName = path.basename(projectDir);

    console.log(chalk.white(`  Target: ${chalk.cyan(projectDir)}`));
    console.log(chalk.dim(`  Agents and workflows will be installed in ${chalk.white('_wds/')}\n`));

    // Minimal 3-question installer
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'project_name',
        message: 'Project name:',
        default: defaultProjectName,
      },
      {
        type: 'list',
        name: 'starting_point',
        message: 'Do you need to create a pitch deck & project contract before starting the project?',
        choices: [
          { name: 'No, start directly with the Product Brief', value: 'brief' },
          { name: 'Yes, start with a project pitch', value: 'pitch' },
        ],
        default: 'brief',
      },
      {
        type: 'input',
        name: 'root_folder',
        message: 'Output folder name:',
        default: 'design-process',
      },
    ]);

    return {
      projectDir,
      ...answers,
      wdsFolder: '_wds',
      cancelled: false,
    };
  }

  /**
   * Display success message with next steps
   */
  displaySuccess(wdsFolder) {
    console.log('');
    console.log(chalk.green.bold('  ✨ Installation complete!'));
    console.log('');
    console.log(chalk.white.bold('  Get Started with Your Product Brief'));
    console.log('');
    console.log(chalk.white('  1. Open this folder in Windsurf or VS Code'));
    console.log('');
    console.log(chalk.white('  2. Locate the chat window in your IDE and type:'));
    console.log('');
    console.log(chalk.cyan(`     "Read and activate ${wdsFolder}/agents/saga-analyst.md"`));
    console.log('');
    console.log(chalk.white(`  3. Saga (your AI analyst) will greet you by name and`));
    console.log(chalk.white(`     guide you through creating your Product Brief`));
    console.log('');
    console.log(chalk.dim('  ─────────────────────────────────────────────────'));
    console.log('');
    console.log(chalk.dim(`  Available agents: Saga (Analyst), Freya (Designer), Idunn (PM)`));
    console.log(chalk.dim(`  Need development? Install BMM: npx bmad-builder install`));
    console.log(chalk.dim('  Docs: https://github.com/whiteport-collective/whiteport-design-studio'));
    console.log('');
  }
}

module.exports = { UI };
