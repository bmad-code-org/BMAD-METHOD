/**
 * WDS Installer UI - Banner, prompts, and success message.
 */

const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer').default || require('inquirer');
const path = require('node:path');
const fs = require('fs-extra');

const WDS_FOLDER = '_bmad/wds';
const LEGACY_WDS_FOLDER = '_wds';

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
   * Detect existing WDS installation and determine folder path
   */
  async detectInstallation(projectDir) {
    const hasBmadWds = await fs.pathExists(path.join(projectDir, WDS_FOLDER));
    const hasLegacyWds = await fs.pathExists(path.join(projectDir, LEGACY_WDS_FOLDER));
    const hasBmadDir = await fs.pathExists(path.join(projectDir, '_bmad'));

    if (hasBmadWds) {
      return { type: 'bmad', folder: WDS_FOLDER };
    }
    if (hasLegacyWds) {
      return { type: 'legacy', folder: LEGACY_WDS_FOLDER };
    }
    if (hasBmadDir) {
      return { type: 'bmad-ready', folder: WDS_FOLDER };
    }
    return { type: 'fresh', folder: WDS_FOLDER };
  }

  /**
   * Run the full prompt flow and return config
   */
  async promptInstall() {
    this.displayBanner();

    const projectDir = process.cwd();
    const defaultProjectName = path.basename(projectDir);
    const detection = await this.detectInstallation(projectDir);

    console.log(chalk.white(`  Target: ${chalk.cyan(projectDir)}`));

    let wdsFolder = detection.folder;
    let action = 'fresh';

    // --- Existing installation: ask update/fresh/migrate FIRST ---
    if (detection.type === 'legacy') {
      console.log(chalk.yellow(`\n  Found legacy installation at ${chalk.white(LEGACY_WDS_FOLDER + '/')}`));
      console.log(chalk.dim(`  BMAD standard path is ${chalk.white(WDS_FOLDER + '/')}\n`));

      const { choice } = await inquirer.prompt([
        {
          type: 'list',
          name: 'choice',
          message: 'How would you like to proceed?',
          choices: [
            { name: `Update & migrate to ${WDS_FOLDER}/ (recommended)`, value: 'migrate-update' },
            { name: `Update at ${LEGACY_WDS_FOLDER}/ (keep legacy path)`, value: 'legacy-update' },
            { name: 'Fresh install (remove everything and start over)', value: 'fresh' },
            { name: 'Cancel', value: 'cancel' },
          ],
        },
      ]);

      if (choice === 'cancel') return { cancelled: true };

      if (choice === 'migrate-update') {
        action = 'update';
        wdsFolder = WDS_FOLDER;
      } else if (choice === 'legacy-update') {
        action = 'update';
        wdsFolder = LEGACY_WDS_FOLDER;
      } else {
        action = 'fresh';
      }
    } else if (detection.type === 'bmad') {
      console.log(chalk.dim(`\n  Found existing installation at ${chalk.white(WDS_FOLDER + '/')}\n`));

      const { choice } = await inquirer.prompt([
        {
          type: 'list',
          name: 'choice',
          message: 'What would you like to do?',
          choices: [
            { name: 'Update - Replace WDS files, keep config.yaml', value: 'update' },
            { name: 'Fresh install - Remove everything and start over', value: 'fresh' },
            { name: 'Cancel', value: 'cancel' },
          ],
        },
      ]);

      if (choice === 'cancel') return { cancelled: true };
      action = choice;
    } else {
      console.log(chalk.dim(`  Agents and workflows will be installed in ${chalk.white(wdsFolder + '/')}\n`));
    }

    // --- Update: skip config questions, config.yaml will be preserved ---
    if (action === 'update') {
      console.log(chalk.dim('  Existing config.yaml will be preserved.\n'));

      return {
        projectDir,
        wdsFolder,
        _detection: detection,
        _action: action,
        cancelled: false,
      };
    }

    // --- Fresh install: ask all config questions ---
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'project_name',
        message: 'Project name:',
        default: defaultProjectName,
      },
      {
        type: 'input',
        name: 'root_folder',
        message: 'Output folder name:',
        default: 'design-process',
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
        type: 'checkbox',
        name: 'ides',
        message: 'Which tools/IDEs are you using? (use spacebar to select)',
        choices: [
          { name: 'Atlassian Rovo Dev', value: 'rovo-dev', checked: false },
          { name: 'Auggie CLI', value: 'auggie', checked: false },
          { name: 'Claude Code', value: 'claude-code', checked: false },
          { name: 'Cline', value: 'cline', checked: false },
          { name: 'Codex', value: 'codex', checked: false },
          { name: 'Crush', value: 'crush', checked: false },
          { name: 'Cursor', value: 'cursor', checked: false },
          { name: 'Gemini CLI', value: 'gemini', checked: false },
          { name: 'GitHub Copilot', value: 'github-copilot', checked: false },
          { name: 'Google Antigravity', value: 'antigravity', checked: false },
          { name: 'iFlow CLI', value: 'iflow', checked: false },
          { name: 'Kilo Code', value: 'kilo', checked: false },
          { name: 'Kiro CLI', value: 'kiro-cli', checked: false },
          { name: 'OpenCode', value: 'opencode', checked: false },
          { name: 'Qwen Code', value: 'qwen', checked: false },
          { name: 'Roo Code', value: 'roo', checked: false },
          { name: 'Trae', value: 'trae', checked: false },
          { name: 'VS Code', value: 'vscode', checked: false },
          { name: 'Windsurf', value: 'windsurf', checked: false },
          { name: 'Other', value: 'other', checked: false },
        ],
        validate: (answers) => {
          if (!answers || answers.length === 0) {
            return 'At least one IDE must be selected';
          }
          return true;
        },
      },
      {
        type: 'confirm',
        name: 'install_learning',
        message: 'Install learning & reference material?',
        default: true,
      },
    ]);

    // --- Design Space (optional) ---
    console.log('');
    console.log(chalk.white.bold('  Design Space'));
    console.log(chalk.dim('  Shared knowledge base and agent communication layer.'));
    console.log(chalk.dim('  Agents can search design knowledge, message each other, and track work.\n'));

    const dsAnswers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'install_design_space',
        message: 'Install Design Space?',
        default: true,
      },
    ]);

    let dsConfig = {};
    if (dsAnswers.install_design_space) {
      dsConfig = await this.promptDesignSpace();
    }

    return {
      projectDir,
      ...answers,
      ...dsConfig,
      wdsFolder,
      _detection: detection,
      _action: action,
      cancelled: false,
    };
  }

  /**
   * Prompt for Design Space configuration
   */
  async promptDesignSpace() {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'ds_name',
        message: 'Name your space:',
        default: 'design-space',
      },
      {
        type: 'list',
        name: 'ds_mode',
        message: 'Connect to an existing space or create a new one?',
        choices: [
          { name: 'Create new (set up fresh)', value: 'create' },
          { name: 'Connect to existing (I have credentials)', value: 'connect' },
        ],
      },
    ]);

    if (answers.ds_mode === 'connect') {
      const connectAnswers = await inquirer.prompt([
        {
          type: 'list',
          name: 'ds_backend',
          message: 'What backend does it use?',
          choices: [
            { name: 'Supabase (team/cloud)', value: 'supabase' },
            { name: 'SQLite (local file)', value: 'sqlite' },
          ],
        },
        {
          type: 'input',
          name: 'ds_url',
          message: 'Base URL:',
          when: (a) => a.ds_backend === 'supabase',
          validate: (v) => (v.includes('supabase.co') || v.startsWith('http') ? true : 'Enter a valid URL'),
        },
        {
          type: 'input',
          name: 'ds_key',
          message: 'Anon key:',
          when: (a) => a.ds_backend === 'supabase',
          validate: (v) => (v.length > 20 ? true : 'Enter the Supabase anon key'),
        },
        {
          type: 'input',
          name: 'ds_db_path',
          message: 'Path to .db file:',
          when: (a) => a.ds_backend === 'sqlite',
          default: './design-space.db',
        },
      ]);

      return {
        install_design_space: true,
        ds_name: answers.ds_name,
        ds_mode: 'connect',
        ds_backend: connectAnswers.ds_backend,
        ds_url: connectAnswers.ds_url,
        ds_key: connectAnswers.ds_key,
        ds_db_path: connectAnswers.ds_db_path,
      };
    }

    // Create new
    const createAnswers = await inquirer.prompt([
      {
        type: 'list',
        name: 'ds_backend',
        message: 'Which database?',
        choices: [
          { name: 'SQLite — local file, zero infrastructure, data stays on your machine', value: 'sqlite' },
          { name: 'Supabase — cloud database, team collaboration, multi-machine', value: 'supabase' },
        ],
      },
    ]);

    return {
      install_design_space: true,
      ds_name: answers.ds_name,
      ds_mode: 'create',
      ds_backend: createAnswers.ds_backend,
    };
  }

  /**
   * Display success message with next steps
   */
  displaySuccess(wdsFolder, ides = ['windsurf'], dsInstalled = false, dsName = '', dsBackend = '') {
    const ideNames = {
      'rovo-dev': 'Atlassian Rovo Dev',
      auggie: 'Auggie CLI',
      'claude-code': 'Claude Code',
      cline: 'Cline',
      codex: 'Codex',
      crush: 'Crush',
      cursor: 'Cursor',
      gemini: 'Gemini CLI',
      'github-copilot': 'GitHub Copilot',
      antigravity: 'Google Antigravity',
      iflow: 'iFlow CLI',
      kilo: 'Kilo Code',
      'kiro-cli': 'Kiro CLI',
      opencode: 'OpenCode',
      qwen: 'Qwen Code',
      roo: 'Roo Code',
      trae: 'Trae',
      vscode: 'VS Code',
      windsurf: 'Windsurf',
      other: 'your IDE',
    };

    // Format IDE list for display
    let ideDisplay;
    if (!ides || ides.length === 0) {
      ideDisplay = 'your IDE';
    } else if (ides.length === 1) {
      ideDisplay = ideNames[ides[0]] || 'your IDE';
    } else {
      const names = ides.map((ide) => ideNames[ide] || ide);
      ideDisplay = names.join(' or ');
    }

    console.log('');
    console.log(chalk.green.bold('  ✨ Installation complete!'));
    console.log('');
    console.log(chalk.white.bold('  Get Started with Your Product Brief'));
    console.log('');
    console.log(chalk.white(`  1. Open this folder in ${ideDisplay}`));
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
    console.log(chalk.dim(`  Available agents: Saga (Analyst), Freya (Designer)`));
    if (dsInstalled) {
      console.log(chalk.dim(`  Design Space: ${dsName} (${dsBackend})`));
    }
    console.log(chalk.dim(`  Need development? Install BMM: npx bmad-builder install`));
    console.log(chalk.dim('  Docs: https://github.com/whiteport-collective/whiteport-design-studio'));
    console.log('');
  }
}

module.exports = { UI };
