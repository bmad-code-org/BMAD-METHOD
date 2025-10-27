#!/usr/bin/env node

const { program } = require('commander');
const path = require('node:path');
const fs = require('node:fs').promises;
const yaml = require('js-yaml');
const chalk = require('chalk').default || require('chalk');
const inquirer = require('inquirer').default || require('inquirer');
const semver = require('semver');
const https = require('node:https');

// Handle both execution contexts (from root via npx or from installer directory)
let version;
let installer;
let packageName;
try {
  // Try installer context first (when run from tools/installer/)
  version = require('../package.json').version;
  packageName = require('../package.json').name;
  installer = require('../lib/installer');
} catch (error) {
  // Fall back to root context (when run via npx from GitHub)
  console.log(`Installer context not found (${error.message}), trying root context...`);
  try {
    version = require('../../../package.json').version;
    installer = require('../../../tools/installer/lib/installer');
  } catch (error) {
    console.error(
      'Error: Could not load required modules. Please ensure you are running from the correct directory.',
    );
    console.error('Debug info:', {
      __dirname,
      cwd: process.cwd(),
      error: error.message,
    });
    process.exit(1);
  }
}

program
  .version(version)
  .description('BMad Method installer - Universal AI agent framework for any domain');

program
  .command('install')
  .description('Install BMad Method agents and tools')
  .option('-f, --full', 'Install complete BMad Method')
  .option('-x, --expansion-only', 'Install only expansion packs (no bmad-core)')
  .option('-d, --directory <path>', 'Installation directory')
  .option(
    '-i, --ide <ide...>',
    'Configure for specific IDE(s) - can specify multiple (cursor, claude-code, windsurf, trae, roo, kilo, cline, gemini, qwen-code, github-copilot, codex, codex-web, auggie-cli, iflow-cli, opencode, other)',
  )
  .option(
    '-e, --expansion-packs <packs...>',
    'Install specific expansion packs (can specify multiple)',
  )
  .action(async (options) => {
    try {
      if (!options.full && !options.expansionOnly) {
        // Interactive mode
        const answers = await promptInstallation();
        if (!answers._alreadyInstalled) {
          await installer.install(answers);
          process.exit(0);
        }
      } else {
        // Direct mode
        let installType = 'full';
        if (options.expansionOnly) installType = 'expansion-only';

        const config = {
          installType,
          directory: options.directory || '.',
          ides: (options.ide || []).filter((ide) => ide !== 'other'),
          expansionPacks: options.expansionPacks || [],
        };
        await installer.install(config);
        process.exit(0);
      }
    } catch (error) {
      console.error(chalk.red('Installation failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('update')
  .description('Update existing BMad installation')
  .option('--force', 'Force update, overwriting modified files')
  .option('--dry-run', 'Show what would be updated without making changes')
  .action(async () => {
    try {
      await installer.update();
    } catch (error) {
      console.error(chalk.red('Update failed:'), error.message);
      process.exit(1);
    }
  });

// Command to check if updates are available
program
  .command('update-check')
  .description('Check for BMad Update')
  .action(async () => {
    console.log('Checking for updates...');

    // Make HTTP request to npm registry for latest version info
    const req = https.get(`https://registry.npmjs.org/${packageName}/latest`, (res) => {
      // Check for HTTP errors (non-200 status codes)
      if (res.statusCode !== 200) {
        console.error(chalk.red(`Update check failed: Received status code ${res.statusCode}`));
        return;
      }

      // Accumulate response data chunks
      let data = '';
      res.on('data', (chunk) => (data += chunk));

      // Process complete response
      res.on('end', () => {
        try {
          // Parse npm registry response and extract version
          const latest = JSON.parse(data).version;

          // Compare versions using semver
          if (semver.gt(latest, version)) {
            console.log(
              chalk.bold.blue(`⚠️  ${packageName} update available: ${version} → ${latest}`),
            );
            console.log(chalk.bold.blue('\nInstall latest by running:'));
            console.log(chalk.bold.magenta(`  npm install ${packageName}@latest`));
            console.log(chalk.dim('  or'));
            console.log(chalk.bold.magenta(`  npx ${packageName}@latest`));
          } else {
            console.log(chalk.bold.blue(`✨ ${packageName} is up to date`));
          }
        } catch (error) {
          // Handle JSON parsing errors
          console.error(chalk.red('Failed to parse npm registry data:'), error.message);
        }
      });
    });

    // Handle network/connection errors
    req.on('error', (error) => {
      console.error(chalk.red('Update check failed:'), error.message);
    });

    // Set 30 second timeout to prevent hanging
    req.setTimeout(30_000, () => {
      req.destroy();
      console.error(chalk.red('Update check timed out'));
    });
  });

program
  .command('list:expansions')
  .description('List available expansion packs')
  .action(async () => {
    try {
      await installer.listExpansionPacks();
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show installation status')
  .action(async () => {
    try {
      await installer.showStatus();
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('flatten')
  .description('Flatten codebase to XML format')
  .option('-i, --input <path>', 'Input directory to flatten', process.cwd())
  .option('-o, --output <path>', 'Output file path', 'flattened-codebase.xml')
  .action(async (options) => {
    try {
      await installer.flatten(options);
    } catch (error) {
      console.error(chalk.red('Flatten failed:'), error.message);
      process.exit(1);
    }
  });

async function promptInstallation() {
  // Display ASCII logo
  console.log(
    chalk.bold.cyan(`
██████╗ ███╗   ███╗ █████╗ ██████╗       ███╗   ███╗███████╗████████╗██╗  ██╗ ██████╗ ██████╗ 
██╔══██╗████╗ ████║██╔══██╗██╔══██╗      ████╗ ████║██╔════╝╚══██╔══╝██║  ██║██╔═══██╗██╔══██╗
██████╔╝██╔████╔██║███████║██║  ██║█████╗██╔████╔██║█████╗     ██║   ███████║██║   ██║██║  ██║
██╔══██╗██║╚██╔╝██║██╔══██║██║  ██║╚════╝██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██║   ██║██║  ██║
██████╔╝██║ ╚═╝ ██║██║  ██║██████╔╝      ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║╚██████╔╝██████╔╝
╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝       ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ 
  `),
  );

  console.log(chalk.bold.magenta('🚀 Universal AI Agent Framework for Any Domain'));
  console.log(chalk.bold.blue(`✨ Installer v${version}\n`));

  const answers = {};

  // Ask for installation directory first
  const { directory } = await inquirer.prompt([
    {
      type: 'input',
      name: 'directory',
      message: 'Enter the full path to your project directory where BMad should be installed:',
      default: path.resolve('.'),
      validate: (input) => {
        if (!input.trim()) {
          return 'Please enter a valid project path';
        }
        return true;
      },
    },
  ]);
  answers.directory = directory;

  // Detect existing installations
  const installDir = path.resolve(directory);
  const state = await installer.detectInstallationState(installDir);

  // Check for existing expansion packs
  const existingExpansionPacks = state.expansionPacks || {};

  // Get available expansion packs
  const availableExpansionPacks = await installer.getAvailableExpansionPacks();

  // Build choices list
  const choices = [];

  // Load core config to get short-title
  const coreConfigPath = path.join(__dirname, '..', '..', '..', 'bmad-core', 'core-config.yaml');
  const coreConfig = yaml.load(await fs.readFile(coreConfigPath, 'utf8'));
  const coreShortTitle = coreConfig['short-title'] || 'BMad Agile Core System';

  // Add BMad core option
  let bmadOptionText;
  if (state.type === 'v4_existing') {
    const currentVersion = state.manifest?.version || 'unknown';
    const newVersion = version; // Always use package.json version
    const versionInfo =
      currentVersion === newVersion
        ? `(v${currentVersion} - reinstall)`
        : `(v${currentVersion} → v${newVersion})`;
    bmadOptionText = `Update ${coreShortTitle} ${versionInfo} .bmad-core`;
  } else {
    bmadOptionText = `${coreShortTitle} (v${version}) .bmad-core`;
  }

  choices.push({
    name: bmadOptionText,
    value: 'bmad-core',
    checked: true,
  });

  // Add expansion pack options
  for (const pack of availableExpansionPacks) {
    const existing = existingExpansionPacks[pack.id];
    let packOptionText;

    if (existing) {
      const currentVersion = existing.manifest?.version || 'unknown';
      const newVersion = pack.version;
      const versionInfo =
        currentVersion === newVersion
          ? `(v${currentVersion} - reinstall)`
          : `(v${currentVersion} → v${newVersion})`;
      packOptionText = `Update ${pack.shortTitle} ${versionInfo} .${pack.id}`;
    } else {
      packOptionText = `${pack.shortTitle} (v${pack.version}) .${pack.id}`;
    }

    choices.push({
      name: packOptionText,
      value: pack.id,
      checked: false,
    });
  }

  // Ask what to install
  const { selectedItems } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedItems',
      message: 'Select what to install/update (use space to select, enter to continue):',
      choices: choices,
      validate: (selected) => {
        if (selected.length === 0) {
          return 'Please select at least one item to install';
        }
        return true;
      },
    },
  ]);

  // Process selections
  answers.installType = selectedItems.includes('bmad-core') ? 'full' : 'expansion-only';
  answers.expansionPacks = selectedItems.filter((item) => item !== 'bmad-core');

  // Ask sharding questions if installing BMad core
  if (selectedItems.includes('bmad-core')) {
    console.log(chalk.cyan('\n📋 Document Organization Settings'));
    console.log(chalk.dim('Configure how your project documentation should be organized.\n'));

    // Ask about PRD sharding
    const { prdSharded } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'prdSharded',
        message: 'Will the PRD (Product Requirements Document) be sharded into multiple files?',
        default: true,
      },
    ]);
    answers.prdSharded = prdSharded;

    // Ask about architecture sharding
    const { architectureSharded } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'architectureSharded',
        message: 'Will the architecture documentation be sharded into multiple files?',
        default: true,
      },
    ]);
    answers.architectureSharded = architectureSharded;

    // Show warning if architecture sharding is disabled
    if (!architectureSharded) {
      console.log(chalk.yellow.bold('\n⚠️  IMPORTANT: Architecture Sharding Disabled'));
      console.log(
        chalk.yellow(
          'With architecture sharding disabled, you should still create the files listed',
        ),
      );
      console.log(
        chalk.yellow(
          'in devLoadAlwaysFiles (like coding-standards.md, tech-stack.md, source-tree.md)',
        ),
      );
      console.log(chalk.yellow('as these are used by the dev agent at runtime.'));
      console.log(
        chalk.yellow(
          '\nAlternatively, you can remove these files from the devLoadAlwaysFiles list',
        ),
      );
      console.log(chalk.yellow('in your core-config.yaml after installation.'));

      const { acknowledge } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'acknowledge',
          message: 'Do you acknowledge this requirement and want to proceed?',
          default: false,
        },
      ]);

      if (!acknowledge) {
        console.log(chalk.red('Installation cancelled.'));
        process.exit(0);
      }
    }
  }

  // Ask for IDE configuration
  let ides = [];
  let ideSelectionComplete = false;

  while (!ideSelectionComplete) {
    console.log(chalk.cyan('\n🛠️  IDE Configuration'));
    console.log(
      chalk.bold.yellow.bgRed(
        ' ⚠️  IMPORTANT: This is a MULTISELECT! Use SPACEBAR to toggle each IDE! ',
      ),
    );
    console.log(chalk.bold.magenta('🔸 Use arrow keys to navigate'));
    console.log(chalk.bold.magenta('🔸 Use SPACEBAR to select/deselect IDEs'));
    console.log(chalk.bold.magenta('🔸 Press ENTER when finished selecting\n'));

    const ideResponse = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'ides',
        message:
          'Which IDE(s) do you want to configure? (Select with SPACEBAR, confirm with ENTER):',
        choices: [
          { name: 'Cursor', value: 'cursor' },
          { name: 'Claude Code', value: 'claude-code' },
          { name: 'iFlow CLI', value: 'iflow-cli' },
          { name: 'Windsurf', value: 'windsurf' },
          { name: 'Trae', value: 'trae' }, // { name: 'Trae', value: 'trae'}
          { name: 'Roo Code', value: 'roo' },
          { name: 'Kilo Code', value: 'kilo' },
          { name: 'Cline', value: 'cline' },
          { name: 'Gemini CLI', value: 'gemini' },
          { name: 'Qwen Code', value: 'qwen-code' },
          { name: 'Crush', value: 'crush' },
          { name: 'Github Copilot', value: 'github-copilot' },
          { name: 'Auggie CLI (Augment Code)', value: 'auggie-cli' },
          { name: 'Codex CLI', value: 'codex' },
          { name: 'Codex Web', value: 'codex-web' },
          { name: 'OpenCode', value: 'opencode' },
        ],
      },
    ]);

    ides = ideResponse.ides;

    // Confirm no IDE selection if none selected
    if (ides.length === 0) {
      const { confirmNoIde } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmNoIde',
          message: chalk.red(
            '⚠️  You have NOT selected any IDEs. This means NO IDE integration will be set up. Is this correct?',
          ),
          default: false,
        },
      ]);

      if (!confirmNoIde) {
        console.log(
          chalk.bold.red(
            '\n🔄 Returning to IDE selection. Remember to use SPACEBAR to select IDEs!\n',
          ),
        );
        continue; // Go back to IDE selection only
      }
    }

    ideSelectionComplete = true;
  }

  // Use selected IDEs directly
  answers.ides = ides;

  // Configure GitHub Copilot immediately if selected
  if (ides.includes('github-copilot')) {
    console.log(chalk.cyan('\n🔧 GitHub Copilot Configuration'));
    console.log(
      chalk.dim('BMad works best with specific VS Code settings for optimal agent experience.\n'),
    );

    const { configChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'configChoice',
        message: chalk.yellow('How would you like to configure GitHub Copilot settings?'),
        choices: [
          {
            name: 'Use recommended defaults (fastest setup)',
            value: 'defaults',
          },
          {
            name: 'Configure each setting manually (customize to your preferences)',
            value: 'manual',
          },
          {
            name: "Skip settings configuration (I'll configure manually later)",
            value: 'skip',
          },
        ],
        default: 'defaults',
      },
    ]);

    answers.githubCopilotConfig = { configChoice };
  }

  // Configure OpenCode immediately if selected
  if (ides.includes('opencode')) {
    console.log(chalk.cyan('\n⚙️  OpenCode Configuration'));
    console.log(
      chalk.dim(
        'OpenCode will include agents and tasks from the packages you selected above; choose optional key prefixes (defaults: no prefixes).\n',
      ),
    );

    const { useAgentPrefix, useCommandPrefix } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useAgentPrefix',
        message: "Prefix agent keys with 'bmad-'? (e.g., 'bmad-dev')",
        default: true,
      },
      {
        type: 'confirm',
        name: 'useCommandPrefix',
        message: "Prefix command keys with 'bmad:tasks:'? (e.g., 'bmad:tasks:create-doc')",
        default: true,
      },
    ]);

    answers.openCodeConfig = {
      opencode: {
        useAgentPrefix,
        useCommandPrefix,
      },
      // pass previously selected packages so IDE setup only applies those
      selectedPackages: {
        includeCore: selectedItems.includes('bmad-core'),
        packs: answers.expansionPacks || [],
      },
    };
  }

  // Configure Auggie CLI (Augment Code) immediately if selected
  if (ides.includes('auggie-cli')) {
    console.log(chalk.cyan('\n📍 Auggie CLI Location Configuration'));
    console.log(chalk.dim('Choose where to install BMad agents for Auggie CLI access.\n'));

    const { selectedLocations } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedLocations',
        message: 'Select Auggie CLI command locations:',
        choices: [
          {
            name: 'User Commands (Global): Available across all your projects (user-wide)',
            value: 'user',
          },
          {
            name: 'Workspace Commands (Project): Stored in repository, shared with team',
            value: 'workspace',
          },
        ],
        validate: (selected) => {
          if (selected.length === 0) {
            return 'Please select at least one location';
          }
          return true;
        },
      },
    ]);

    answers.augmentCodeConfig = { selectedLocations };
  }

  // Ask for web bundles installation
  const { includeWebBundles } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'includeWebBundles',
      message:
        'Would you like to include pre-built web bundles? (standalone files for ChatGPT, Claude, Gemini)',
      default: false,
    },
  ]);

  if (includeWebBundles) {
    console.log(chalk.cyan('\n📦 Web bundles are standalone files perfect for web AI platforms.'));
    console.log(
      chalk.dim('   You can choose different teams/agents than your IDE installation.\n'),
    );

    const { webBundleType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'webBundleType',
        message: 'What web bundles would you like to include?',
        choices: [
          {
            name: 'All available bundles (agents, teams, expansion packs)',
            value: 'all',
          },
          {
            name: 'Specific teams only',
            value: 'teams',
          },
          {
            name: 'Individual agents only',
            value: 'agents',
          },
          {
            name: 'Custom selection',
            value: 'custom',
          },
        ],
      },
    ]);

    answers.webBundleType = webBundleType;

    // If specific teams, let them choose which teams
    if (webBundleType === 'teams' || webBundleType === 'custom') {
      const teams = await installer.getAvailableTeams();
      const { selectedTeams } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selectedTeams',
          message: 'Select team bundles to include:',
          choices: teams.map((t) => ({
            name: `${t.icon || '📋'} ${t.name}: ${t.description}`,
            value: t.id,
            checked: webBundleType === 'teams', // Check all if teams-only mode
          })),
          validate: (answer) => {
            if (answer.length === 0) {
              return 'You must select at least one team.';
            }
            return true;
          },
        },
      ]);
      answers.selectedWebBundleTeams = selectedTeams;
    }

    // If custom selection, also ask about individual agents
    if (webBundleType === 'custom') {
      const { includeIndividualAgents } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'includeIndividualAgents',
          message: 'Also include individual agent bundles?',
          default: true,
        },
      ]);
      answers.includeIndividualAgents = includeIndividualAgents;
    }

    const { webBundlesDirectory } = await inquirer.prompt([
      {
        type: 'input',
        name: 'webBundlesDirectory',
        message: 'Enter directory for web bundles:',
        default: `${answers.directory}/web-bundles`,
        validate: (input) => {
          if (!input.trim()) {
            return 'Please enter a valid directory path';
          }
          return true;
        },
      },
    ]);
    answers.webBundlesDirectory = webBundlesDirectory;
  }

  answers.includeWebBundles = includeWebBundles;

  return answers;
}

program.parse(process.argv);

// Show help if no command provided
if (process.argv.slice(2).length === 0) {
  program.outputHelp();
}
