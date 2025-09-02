const { program } = require('commander');
const path = require('node:path');
const fs = require('node:fs');
const fsPromises = require('node:fs').promises;
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

// Next Method Context Manager
class NextMethodContext {
  constructor() {
    this.contextFile = path.join(process.cwd(), '.next-context.json');
    this.context = this.loadContext();
  }

  loadContext() {
    try {
      if (fs.existsSync(this.contextFile)) {
        const data = fs.readFileSync(this.contextFile, 'utf8');
        return JSON.parse(data);
      }
    } catch {
      console.log('Creating new context...');
    }

    return {
      currentPhase: 'start',
      projectType: null,
      lastAction: null,
      suggestions: [],
      history: [],
      metadata: {},
    };
  }

  saveContext() {
    try {
      fs.writeFileSync(this.contextFile, JSON.stringify(this.context, null, 2));
    } catch (error) {
      console.error('Warning: Could not save context:', error.message);
    }
  }

  updateContext(updates) {
    this.context = { ...this.context, ...updates };
    this.saveContext();
  }

  addToHistory(action, result) {
    this.context.history.push({
      timestamp: new Date().toISOString(),
      action,
      result,
      phase: this.context.currentPhase,
    });
    this.saveContext();
  }

  getNextSuggestions() {
    const suggestions = [];

    if (!this.context.projectType) {
      suggestions.push({
        id: 'detect-project',
        title: 'Detect Project Type',
        description: 'Analyze current directory to determine project type',
        action: 'detect',
      });
    }

    if (this.context.projectType === 'greenfield') {
      suggestions.push({
        id: 'create-project',
        title: 'Create New Project',
        description: 'Start a new project from scratch',
        action: 'create',
      });
    }

    if (this.context.projectType === 'brownfield') {
      suggestions.push({
        id: 'analyze-existing',
        title: 'Analyze Existing Project',
        description: 'Analyze current codebase and requirements',
        action: 'analyze',
      });
    }

    if (this.context.lastAction === 'create' || this.context.lastAction === 'analyze') {
      suggestions.push({
        id: 'generate-requirements',
        title: 'Generate Requirements',
        description: 'Create user stories and requirements',
        action: 'requirements',
      });
    }

    if (this.context.lastAction === 'requirements') {
      suggestions.push({
        id: 'design-architecture',
        title: 'Design Architecture',
        description: 'Create technical architecture and design',
        action: 'architecture',
      });
    }

    if (this.context.lastAction === 'architecture') {
      suggestions.push({
        id: 'implement-features',
        title: 'Implement Features',
        description: 'Start coding and implementation',
        action: 'implement',
      });
    }

    if (this.context.lastAction === 'implement') {
      suggestions.push({
        id: 'test-and-validate',
        title: 'Test and Validate',
        description: 'Run tests and validate implementation',
        action: 'test',
      });
    }

    if (this.context.lastAction === 'test') {
      suggestions.push({
        id: 'deploy',
        title: 'Deploy',
        description: 'Deploy the application',
        action: 'deploy',
      });
    }

    // Always show these options
    suggestions.push(
      {
        id: 'custom-command',
        title: 'Run Custom Command',
        description: 'Execute a specific BMAD command',
        action: 'custom',
      },
      {
        id: 'show-status',
        title: 'Show Project Status',
        description: 'Display current project context and progress',
        action: 'status',
      },
    );

    return suggestions;
  }
}

const nextContext = new NextMethodContext();

program
  .version(version)
  .description('Lazy Method - Iterative AI-driven development with BMAD-METHOD™');

program
  .command('next')
  .description('Get next suggested action and execute it')
  .option('-a, --auto', 'Automatically execute the most logical next step')
  .option('-s, --suggest', 'Only show suggestions without executing')
  .action(async (options) => {
    try {
      const suggestions = nextContext.getNextSuggestions();

      if (suggestions.length === 0) {
        console.log(chalk.green('🎉 Project completed! All phases finished.'));
        return;
      }

      if (options.suggest) {
        console.log(chalk.blue('\n📋 Available next steps:'));
        for (const [index, suggestion] of suggestions.entries()) {
          console.log(chalk.cyan(`  ${index + 1}. ${suggestion.title}`));
          console.log(chalk.gray(`     ${suggestion.description}`));
        }
        return;
      }

      if (options.auto) {
        // Auto-execute the first suggestion
        const suggestion = suggestions[0];
        console.log(chalk.blue(`🤖 Auto-executing: ${suggestion.title}`));
        await executeSuggestion(suggestion);
        return;
      }

      // Interactive mode
      console.log(chalk.blue('\n🚀 What would you like to do next?'));

      const choices = suggestions.map((suggestion, index) => ({
        name: `${suggestion.title} - ${suggestion.description}`,
        value: suggestion.id,
        short: suggestion.title,
      }));

      const { selectedAction } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedAction',
          message: 'Choose the next step:',
          choices,
          pageSize: 10,
        },
      ]);

      const suggestion = suggestions.find((s) => s.id === selectedAction);
      if (suggestion) {
        await executeSuggestion(suggestion);
      }
    } catch (error) {
      console.error(chalk.red('Next command failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('start')
  .description('Initialize a new Next Method project or reset existing project')
  .option('-f, --force', 'Force reset even if project already exists')
  .option('-t, --type <type>', 'Specify project type (greenfield/brownfield)')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🚀 Initializing Next Method project...'));

      // Check if project already exists
      if (nextContext.context.projectType && !options.force) {
        const { confirmReset } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmReset',
            message: 'Project already exists. Do you want to reset and start over?',
            default: false,
          },
        ]);

        if (!confirmReset) {
          console.log(chalk.yellow('Project initialization cancelled.'));
          return;
        }
      }

      // Reset context
      nextContext.updateContext({
        currentPhase: 'start',
        projectType: null,
        lastAction: null,
        suggestions: [],
        history: [],
        metadata: {},
      });

      // Detect or set project type
      let projectType = options.type;
      if (!projectType) {
        const { detectedType } = await detectProjectType();
        projectType = detectedType;
      }

      // Update context with detected type
      nextContext.updateContext({ projectType });

      // Add to history
      nextContext.addToHistory('start', {
        status: 'project_initialized',
        type: projectType,
        timestamp: new Date().toISOString(),
      });

      console.log(chalk.green(`✅ Project initialized successfully!`));
      console.log(chalk.cyan(`   Project Type: ${projectType}`));
      console.log(chalk.cyan(`   Current Phase: start`));

      // Show next suggestions
      const suggestions = nextContext.getNextSuggestions();
      if (suggestions.length > 0) {
        console.log(chalk.blue('\n💡 Next suggested steps:'));
        for (const [index, s] of suggestions.slice(0, 3).entries()) {
          console.log(chalk.cyan(`  ${index + 1}. ${s.title}`));
        }
        console.log(chalk.gray('\nRun "next" to continue or "next --suggest" to see all options'));
      }
    } catch (error) {
      console.error(chalk.red('Project initialization failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize a new Next Method project or reset existing project')
  .option('-f, --force', 'Force reset even if project already exists')
  .option('-t, --type <type>', 'Specify project type (greenfield/brownfield)')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🚀 Initializing Next Method project...'));

      // Check if project already exists
      if (nextContext.context.projectType && !options.force) {
        const { confirmReset } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmReset',
            message: 'Project already exists. Do you want to reset and start over?',
            default: false,
          },
        ]);

        if (!confirmReset) {
          console.log(chalk.yellow('Project initialization cancelled.'));
          return;
        }
      }

      // Reset context
      nextContext.updateContext({
        currentPhase: 'start',
        projectType: null,
        lastAction: null,
        suggestions: [],
        history: [],
        metadata: {},
      });

      // Detect or set project type
      let projectType = options.type;
      if (!projectType) {
        const { detectedType } = await detectProjectType();
        projectType = detectedType;
      }

      // Update context with detected type
      nextContext.updateContext({ projectType });

      // Add to history
      nextContext.addToHistory('start', {
        status: 'project_initialized',
        type: projectType,
        timestamp: new Date().toISOString(),
      });

      console.log(chalk.green(`✅ Project initialized successfully!`));
      console.log(chalk.cyan(`   Project Type: ${projectType}`));
      console.log(chalk.cyan(`   Current Phase: start`));

      // Show next suggestions
      const suggestions = nextContext.getNextSuggestions();
      if (suggestions.length > 0) {
        console.log(chalk.blue('\n💡 Next suggested steps:'));
        for (const [index, s] of suggestions.slice(0, 3).entries()) {
          console.log(chalk.cyan(`  ${index + 1}. ${s.title}`));
        }
        console.log(chalk.gray('\nRun "next" to continue or "next --suggest" to see all options'));
      }
    } catch (error) {
      console.error(chalk.red('Project initialization failed:'), error.message);
      process.exit(1);
    }
  });

async function executeSuggestion(suggestion) {
  console.log(chalk.green(`\n▶️  Executing: ${suggestion.title}`));

  try {
    let result;

    switch (suggestion.action) {
      case 'detect': {
        result = await detectProjectType();
        break;
      }
      case 'create': {
        result = await createProject();
        break;
      }
      case 'analyze': {
        result = await analyzeProject();
        break;
      }
      case 'requirements': {
        result = await generateRequirements();
        break;
      }
      case 'architecture': {
        result = await designArchitecture();
        break;
      }
      case 'implement': {
        result = await implementFeatures();
        break;
      }
      case 'test': {
        result = await testAndValidate();
        break;
      }
      case 'deploy': {
        result = await deployProject();
        break;
      }
      case 'custom': {
        result = await runCustomCommand();
        break;
      }
      case 'status': {
        result = await showStatus();
        break;
      }
      default: {
        console.log(chalk.yellow(`Unknown action: ${suggestion.action}`));
        return;
      }
    }

    nextContext.addToHistory(suggestion.action, result);
    nextContext.updateContext({ lastAction: suggestion.action });

    console.log(chalk.green(`✅ ${suggestion.title} completed successfully!`));

    // Show next suggestions
    const nextSuggestions = nextContext.getNextSuggestions();
    if (nextSuggestions.length > 0) {
      console.log(chalk.blue('\n💡 Next suggested steps:'));
      for (const [index, s] of nextSuggestions.slice(0, 3).entries()) {
        console.log(chalk.cyan(`  ${index + 1}. ${s.title}`));
      }
      console.log(chalk.gray('\nRun "next" to continue or "next --suggest" to see all options'));
    }
  } catch (error) {
    console.error(chalk.red(`❌ ${suggestion.title} failed:`), error.message);
    nextContext.addToHistory(suggestion.action, { error: error.message });
  }
}

async function detectProjectType() {
  // Analyze current directory to determine project type
  const files = await fsPromises.readdir(process.cwd());
  const hasPackageJson = files.includes('package.json');
  const hasGit = files.includes('.git');
  const hasSourceFiles = files.some(
    (f) => f.endsWith('.js') || f.endsWith('.ts') || f.endsWith('.py') || f.endsWith('.java'),
  );

  let projectType = 'empty';
  if (hasSourceFiles && hasPackageJson) {
    projectType = 'brownfield';
  } else if (hasGit && hasSourceFiles) {
    projectType = 'brownfield';
  } else if (hasGit || hasSourceFiles) {
    projectType = 'greenfield';
  }

  nextContext.updateContext({ projectType });

  return {
    type: projectType,
    detectedType: projectType,
    files: files.filter((f) => !f.startsWith('.') && !f.includes('node_modules')),
  };
}

async function createProject() {
  console.log(chalk.blue('Creating new project...'));
  // This would integrate with BMAD-METHOD's project creation
  return { status: 'project_created' };
}

async function analyzeProject() {
  console.log(chalk.blue('Analyzing existing project...'));
  // This would integrate with BMAD-METHOD's analysis tools
  return { status: 'project_analyzed' };
}

async function generateRequirements() {
  console.log(chalk.blue('Generating requirements...'));
  // This would integrate with BMAD-METHOD's requirements generation
  return { status: 'requirements_generated' };
}

async function designArchitecture() {
  console.log(chalk.blue('Designing architecture...'));
  // This would integrate with BMAD-METHOD's architecture tools
  return { status: 'architecture_designed' };
}

async function implementFeatures() {
  console.log(chalk.blue('Implementing features...'));
  // This would integrate with BMAD-METHOD's implementation tools
  return { status: 'features_implemented' };
}

async function testAndValidate() {
  console.log(chalk.blue('Testing and validating...'));
  // This would integrate with BMAD-METHOD's testing tools
  return { status: 'testing_completed' };
}

async function deployProject() {
  console.log(chalk.blue('Deploying project...'));
  // This would integrate with BMAD-METHOD's deployment tools
  return { status: 'deployment_completed' };
}

async function runCustomCommand() {
  const { command } = await inquirer.prompt([
    {
      type: 'input',
      name: 'command',
      message: 'Enter BMAD command to execute:',
      default: 'bmad install',
    },
  ]);

  console.log(chalk.blue(`Executing: ${command}`));
  // This would execute the BMAD command
  return { command, status: 'executed' };
}

async function showStatus() {
  console.log(chalk.blue('\n📊 Project Status:'));
  console.log(chalk.cyan(`  Current Phase: ${nextContext.context.currentPhase}`));
  console.log(chalk.cyan(`  Project Type: ${nextContext.context.projectType || 'Not determined'}`));
  console.log(chalk.cyan(`  Last Action: ${nextContext.context.lastAction || 'None'}`));

  if (nextContext.context.history.length > 0) {
    console.log(chalk.blue('\n📝 Recent Actions:'));
    for (const [index, entry] of nextContext.context.history.slice(-5).entries()) {
      const status = entry.result?.error ? '❌' : '✅';
      console.log(chalk.gray(`  ${status} ${entry.action} (${entry.timestamp})`));
    }
  }

  return { status: 'status_displayed' };
}

// Add other commands that wrap BMAD functionality
program
  .command('install')
  .description('Install BMAD Method (wraps bmad install)')
  .option('-f, --full', 'Install complete BMad Method')
  .option('-x, --expansion-only', 'Install only expansion packs (no bmad-core)')
  .option('-d, --directory <path>', 'Installation directory')
  .option('-i, --ide <ide...>', 'Configure for specific IDE(s)')
  .option('-e, --expansion-packs <packs...>', 'Install specific expansion packs')
  .action(async (options) => {
    try {
      // Forward to BMAD installer
      const { execSync } = require('node:child_process');
      const args = process.argv.slice(3).join(' ');
      execSync(`node "${path.join(__dirname, 'bmad.js')}" install ${args}`, {
        stdio: 'inherit',
        cwd: process.cwd(),
      });
    } catch (error) {
      console.error(chalk.red('Installation failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('update')
  .description('Update existing BMAD installation (wraps bmad update)')
  .option('--force', 'Force update, overwriting modified files')
  .option('--dry-run', 'Show what would be updated without making changes')
  .action(async (options) => {
    try {
      const { execSync } = require('node:child_process');
      const args = process.argv.slice(3).join(' ');
      execSync(`node "${path.join(__dirname, 'bmad.js')}" update ${args}`, {
        stdio: 'inherit',
        cwd: process.cwd(),
      });
    } catch (error) {
      console.error(chalk.red('Update failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show current project status and context')
  .action(async () => {
    await showStatus();
  });

program
  .command('reset')
  .description('Reset the Next Method context')
  .action(async () => {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to reset the Next Method context?',
        default: false,
      },
    ]);

    if (confirm) {
      try {
        fs.unlinkSync(nextContext.contextFile);
        nextContext.context = nextContext.loadContext();
        console.log(chalk.green('✅ Context reset successfully!'));
      } catch {
        console.log(chalk.blue('Context file not found, already reset.'));
      }
    }
  });

program.parse();
