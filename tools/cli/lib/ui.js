/**
 * WDS Installer UI - Banner, prompts, and success message.
 */

const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer').default || require('inquirer');
const path = require('node:path');
const { getIdeChoices } = require('./ide-configs');

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
    console.log(chalk.white(`  Target: ${chalk.cyan(projectDir)}`));
    console.log(chalk.dim(`  Agents and workflows will be installed in ${chalk.white('_wds/')}\n`));

    // Confirm directory
    const { confirmDir } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmDir',
        message: 'Install WDS in this directory?',
        default: true,
      },
    ]);

    if (!confirmDir) {
      return { cancelled: true };
    }

    // Collect configuration
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'user_name',
        message: 'Your name (agents will greet you by name):',
        default: 'Designer',
      },
      {
        type: 'list',
        name: 'project_type',
        message: 'What type of project are you working on?',
        choices: [
          { name: 'Digital Product - Multiple scenarios with more complex structure', value: 'digital_product' },
          { name: 'Single Scenario - Simple web sites and flat navigation', value: 'single_scenario' },
          { name: 'Single Page - Landing pages or simple one page web sites', value: 'single_page' },
          { name: 'Custom - Specialized structure, define later', value: 'custom' },
        ],
        default: 'digital_product',
      },
      {
        type: 'list',
        name: 'design_experience',
        message: 'What is your design experience level?',
        choices: [
          { name: 'Beginner - New to UX design, provide detailed guidance', value: 'beginner' },
          { name: 'Intermediate - Familiar with design concepts, balanced approach', value: 'intermediate' },
          { name: 'Expert - Experienced designer, be direct and efficient', value: 'expert' },
        ],
        default: 'intermediate',
      },
      {
        type: 'confirm',
        name: 'include_learning',
        message: 'Include learning & reference material in _wds-learn/?',
        default: true,
      },
      {
        type: 'checkbox',
        name: 'ides',
        message: 'Which AI IDE/tools are you using? (Space to select, Enter to confirm)',
        choices: getIdeChoices(),
        validate: (answer) => (answer.length > 0 ? true : 'Select at least one IDE.'),
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
    console.log(chalk.green.bold('  Installation complete!'));
    console.log('');
    console.log(chalk.white('  Getting started:'));
    console.log(chalk.dim(`  1. Open your project in your AI IDE`));
    console.log(chalk.dim(`  2. Tell the AI:`));
    console.log(chalk.cyan(`     "Read and activate the agent in ${wdsFolder}/agents/mimir-orchestrator.md"`));
    console.log(chalk.dim(`  3. Mimir will greet you and guide you through project setup`));
    console.log('');
    console.log(chalk.white(`  Agents in ${chalk.cyan(wdsFolder + '/agents/')}:`));
    console.log(chalk.dim(`  - Mimir (Orchestrator) - Your guide. Start here.`));
    console.log(chalk.dim(`  - Saga  (Analyst)      - Product Brief & Trigger Mapping`));
    console.log(chalk.dim(`  - Idunn (PM)           - Platform Requirements & Deliveries`));
    console.log(chalk.dim(`  - Freya (Designer)     - UX Design & Testing`));
    console.log('');
    console.log(chalk.dim('  https://github.com/whiteport-collective/whiteport-design-studio'));
    console.log('');
  }
}

module.exports = { UI };
