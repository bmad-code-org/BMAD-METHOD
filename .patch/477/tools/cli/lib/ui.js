const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('node:path');
const os = require('node:os');
const fs = require('fs-extra');
const { CLIUtils } = require('./cli-utils');

/**
 * UI utilities for the installer
 */
class UI {
  constructor() {}

  /**
   * Prompt for installation configuration
   * @returns {Object} Installation configuration
   */
  async promptInstall() {
    CLIUtils.displayLogo();
    CLIUtils.displaySection('BMAD™ Setup', 'Build More, Architect Dreams');

    const confirmedDirectory = await this.getConfirmedDirectory();

    // Check if there's an existing BMAD installation
    const fs = require('fs-extra');
    const path = require('node:path');
    const bmadDir = path.join(confirmedDirectory, 'bmad');
    const hasExistingInstall = await fs.pathExists(bmadDir);

    // Only show action menu if there's an existing installation
    if (hasExistingInstall) {
      const { actionType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'actionType',
          message: 'What would you like to do?',
          choices: [
            { name: 'Update BMAD Installation', value: 'install' },
            { name: 'Compile Agents (Quick rebuild of all agent .md files)', value: 'compile' },
          ],
        },
      ]);

      // Handle agent compilation separately
      if (actionType === 'compile') {
        return {
          actionType: 'compile',
          directory: confirmedDirectory,
        };
      }
    }
    const { installedModuleIds } = await this.getExistingInstallation(confirmedDirectory);
    const coreConfig = await this.collectCoreConfig(confirmedDirectory);
    const moduleChoices = await this.getModuleChoices(installedModuleIds);
    const selectedModules = await this.selectModules(moduleChoices);

    console.clear();
    CLIUtils.displayLogo();
    CLIUtils.displayModuleComplete('core', false); // false = don't clear the screen again

    return {
      actionType: 'install', // Explicitly set action type
      directory: confirmedDirectory,
      installCore: true, // Always install core
      modules: selectedModules,
      // IDE selection moved to after module configuration
      ides: [],
      skipIde: true, // Will be handled later
      coreConfig: coreConfig, // Pass collected core config to installer
    };
  }

  /**
   * Prompt for tool/IDE selection (called after module configuration)
   * @param {string} projectDir - Project directory to check for existing IDEs
   * @param {Array} selectedModules - Selected modules from configuration
   * @returns {Object} Tool configuration
   */
  async promptToolSelection(projectDir, selectedModules) {
    // Check for existing configured IDEs
    const { Detector } = require('../installers/lib/core/detector');
    const detector = new Detector();
    const bmadDir = path.join(projectDir || process.cwd(), 'bmad');
    const existingInstall = await detector.detect(bmadDir);
    const configuredIdes = existingInstall.ides || [];

    // Get IDE manager to fetch available IDEs dynamically
    const { IdeManager } = require('../installers/lib/ide/manager');
    const ideManager = new IdeManager();

    const preferredIdes = ideManager.getPreferredIdes();
    const otherIdes = ideManager.getOtherIdes();

    // Build IDE choices array with separators
    const ideChoices = [];
    const processedIdes = new Set();

    // First, add previously configured IDEs at the top, marked with ✅
    if (configuredIdes.length > 0) {
      ideChoices.push(new inquirer.Separator('── Previously Configured ──'));
      for (const ideValue of configuredIdes) {
        // Find the IDE in either preferred or other lists
        const preferredIde = preferredIdes.find((ide) => ide.value === ideValue);
        const otherIde = otherIdes.find((ide) => ide.value === ideValue);
        const ide = preferredIde || otherIde;

        if (ide) {
          ideChoices.push({
            name: `${ide.name} ✅`,
            value: ide.value,
            checked: true, // Previously configured IDEs are checked by default
          });
          processedIdes.add(ide.value);
        }
      }
    }

    // Add preferred tools (excluding already processed)
    const remainingPreferred = preferredIdes.filter((ide) => !processedIdes.has(ide.value));
    if (remainingPreferred.length > 0) {
      ideChoices.push(new inquirer.Separator('── Recommended Tools ──'));
      for (const ide of remainingPreferred) {
        ideChoices.push({
          name: `${ide.name} ⭐`,
          value: ide.value,
          checked: false,
        });
        processedIdes.add(ide.value);
      }
    }

    // Add other tools (excluding already processed)
    const remainingOther = otherIdes.filter((ide) => !processedIdes.has(ide.value));
    if (remainingOther.length > 0) {
      ideChoices.push(new inquirer.Separator('── Additional Tools ──'));
      for (const ide of remainingOther) {
        ideChoices.push({
          name: ide.name,
          value: ide.value,
          checked: false,
        });
      }
    }

    CLIUtils.displaySection('Tool Integration', 'Select AI coding assistants and IDEs to configure');

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'ides',
        message: 'Select tools to configure:',
        choices: ideChoices,
        pageSize: 15,
      },
    ]);

    return {
      ides: answers.ides || [],
      skipIde: !answers.ides || answers.ides.length === 0,
    };
  }

  /**
   * Prompt for update configuration
   * @returns {Object} Update configuration
   */
  async promptUpdate() {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'backupFirst',
        message: 'Create backup before updating?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'preserveCustomizations',
        message: 'Preserve local customizations?',
        default: true,
      },
    ]);

    return answers;
  }

  /**
   * Prompt for module selection
   * @param {Array} modules - Available modules
   * @returns {Array} Selected modules
   */
  async promptModules(modules) {
    const choices = modules.map((mod) => ({
      name: `${mod.name} - ${mod.description}`,
      value: mod.id,
      checked: false,
    }));

    const { selectedModules } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedModules',
        message: 'Select modules to add:',
        choices,
        validate: (answer) => {
          if (answer.length === 0) {
            return 'You must choose at least one module.';
          }
          return true;
        },
      },
    ]);

    return selectedModules;
  }

  /**
   * Confirm action
   * @param {string} message - Confirmation message
   * @param {boolean} defaultValue - Default value
   * @returns {boolean} User confirmation
   */
  async confirm(message, defaultValue = false) {
    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message,
        default: defaultValue,
      },
    ]);

    return confirmed;
  }

  /**
   * Display installation summary
   * @param {Object} result - Installation result
   */
  showInstallSummary(result) {
    CLIUtils.displaySection('Installation Complete', 'BMAD™ has been successfully installed');

    const summary = [
      `📁 Installation Path: ${result.path}`,
      `📦 Modules Installed: ${result.modules?.length > 0 ? result.modules.join(', ') : 'core only'}`,
      `🔧 Tools Configured: ${result.ides?.length > 0 ? result.ides.join(', ') : 'none'}`,
    ];

    CLIUtils.displayBox(summary.join('\n\n'), {
      borderColor: 'green',
      borderStyle: 'round',
    });

    console.log('\n' + chalk.green.bold('✨ BMAD is ready to use!'));
  }

  /**
   * Get confirmed directory from user
   * @returns {string} Confirmed directory path
   */
  async getConfirmedDirectory() {
    let confirmedDirectory = null;
    while (!confirmedDirectory) {
      const directoryAnswer = await this.promptForDirectory();
      await this.displayDirectoryInfo(directoryAnswer.directory);

      if (await this.confirmDirectory(directoryAnswer.directory)) {
        confirmedDirectory = directoryAnswer.directory;
      }
    }
    return confirmedDirectory;
  }

  /**
   * Get existing installation info and installed modules
   * @param {string} directory - Installation directory
   * @returns {Object} Object with existingInstall and installedModuleIds
   */
  async getExistingInstallation(directory) {
    const { Detector } = require('../installers/lib/core/detector');
    const detector = new Detector();
    const bmadDir = path.join(directory, 'bmad');
    const existingInstall = await detector.detect(bmadDir);
    const installedModuleIds = new Set(existingInstall.modules.map((mod) => mod.id));

    return { existingInstall, installedModuleIds };
  }

  /**
   * Collect core configuration
   * @param {string} directory - Installation directory
   * @returns {Object} Core configuration
   */
  async collectCoreConfig(directory) {
    const { ConfigCollector } = require('../installers/lib/core/config-collector');
    const configCollector = new ConfigCollector();
    // Load existing configs first if they exist
    await configCollector.loadExistingConfig(directory);
    // Now collect with existing values as defaults (false = don't skip loading, true = skip completion message)
    await configCollector.collectModuleConfig('core', directory, false, true);

    return configCollector.collectedConfig.core;
  }

  /**
   * Get module choices for selection
   * @param {Set} installedModuleIds - Currently installed module IDs
   * @returns {Array} Module choices for inquirer
   */
  async getModuleChoices(installedModuleIds) {
    const { ModuleManager } = require('../installers/lib/modules/manager');
    const moduleManager = new ModuleManager();
    const availableModules = await moduleManager.listAvailable();

    const isNewInstallation = installedModuleIds.size === 0;
    return availableModules.map((mod) => ({
      name: mod.name,
      value: mod.id,
      checked: isNewInstallation ? mod.defaultSelected || false : installedModuleIds.has(mod.id),
    }));
  }

  /**
   * Prompt for module selection
   * @param {Array} moduleChoices - Available module choices
   * @returns {Array} Selected module IDs
   */
  async selectModules(moduleChoices) {
    CLIUtils.displaySection('Module Selection', 'Choose the BMAD modules to install');

    const moduleAnswer = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'modules',
        message: 'Select modules to install:',
        choices: moduleChoices,
      },
    ]);

    return moduleAnswer.modules || [];
  }

  /**
   * Prompt for directory selection
   * @returns {Object} Directory answer from inquirer
   */
  async promptForDirectory() {
    return await inquirer.prompt([
      {
        type: 'input',
        name: 'directory',
        message: `Installation directory:`,
        default: process.cwd(),
        validate: async (input) => this.validateDirectory(input),
        filter: (input) => {
          // If empty, use the default
          if (!input || input.trim() === '') {
            return process.cwd();
          }
          return this.expandUserPath(input);
        },
      },
    ]);
  }

  /**
   * Display directory information
   * @param {string} directory - The directory path
   */
  async displayDirectoryInfo(directory) {
    console.log(chalk.cyan('\nResolved installation path:'), chalk.bold(directory));

    const dirExists = await fs.pathExists(directory);
    if (dirExists) {
      // Show helpful context about the existing path
      const stats = await fs.stat(directory);
      if (stats.isDirectory()) {
        const files = await fs.readdir(directory);
        if (files.length > 0) {
          console.log(
            chalk.gray(`Directory exists and contains ${files.length} item(s)`) +
              (files.includes('bmad') ? chalk.yellow(' including existing bmad installation') : ''),
          );
        } else {
          console.log(chalk.gray('Directory exists and is empty'));
        }
      }
    } else {
      const existingParent = await this.findExistingParent(directory);
      console.log(chalk.gray(`Will create in: ${existingParent}`));
    }
  }

  /**
   * Confirm directory selection
   * @param {string} directory - The directory path
   * @returns {boolean} Whether user confirmed
   */
  async confirmDirectory(directory) {
    const dirExists = await fs.pathExists(directory);

    if (dirExists) {
      const confirmAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: `Install to this directory?`,
          default: true,
        },
      ]);

      if (!confirmAnswer.proceed) {
        console.log(chalk.yellow("\nLet's try again with a different path.\n"));
      }

      return confirmAnswer.proceed;
    } else {
      // Ask for confirmation to create the directory
      const createConfirm = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'create',
          message: `The directory '${directory}' doesn't exist. Would you like to create it?`,
          default: false,
        },
      ]);

      if (!createConfirm.create) {
        console.log(chalk.yellow("\nLet's try again with a different path.\n"));
      }

      return createConfirm.create;
    }
  }

  /**
   * Validate directory path for installation
   * @param {string} input - User input path
   * @returns {string|true} Error message or true if valid
   */
  async validateDirectory(input) {
    // Allow empty input to use the default
    if (!input || input.trim() === '') {
      return true; // Empty means use default
    }

    let expandedPath;
    try {
      expandedPath = this.expandUserPath(input.trim());
    } catch (error) {
      return error.message;
    }

    // Check if the path exists
    const pathExists = await fs.pathExists(expandedPath);

    if (!pathExists) {
      // Find the first existing parent directory
      const existingParent = await this.findExistingParent(expandedPath);

      if (!existingParent) {
        return 'Cannot create directory: no existing parent directory found';
      }

      // Check if the existing parent is writable
      try {
        await fs.access(existingParent, fs.constants.W_OK);
        // Path doesn't exist but can be created - will prompt for confirmation later
        return true;
      } catch {
        // Provide a detailed error message explaining both issues
        return `Directory '${expandedPath}' does not exist and cannot be created: parent directory '${existingParent}' is not writable`;
      }
    }

    // If it exists, validate it's a directory and writable
    const stat = await fs.stat(expandedPath);
    if (!stat.isDirectory()) {
      return `Path exists but is not a directory: ${expandedPath}`;
    }

    // Check write permissions
    try {
      await fs.access(expandedPath, fs.constants.W_OK);
    } catch {
      return `Directory is not writable: ${expandedPath}`;
    }

    return true;
  }

  /**
   * Find the first existing parent directory
   * @param {string} targetPath - The path to check
   * @returns {string|null} The first existing parent directory, or null if none found
   */
  async findExistingParent(targetPath) {
    let currentPath = path.resolve(targetPath);

    // Walk up the directory tree until we find an existing directory
    while (currentPath !== path.dirname(currentPath)) {
      // Stop at root
      const parent = path.dirname(currentPath);
      if (await fs.pathExists(parent)) {
        return parent;
      }
      currentPath = parent;
    }

    return null; // No existing parent found (shouldn't happen in practice)
  }

  /**
   * Expands the user-provided path: handles ~ and resolves to absolute.
   * @param {string} inputPath - User input path.
   * @returns {string} Absolute expanded path.
   */
  expandUserPath(inputPath) {
    if (typeof inputPath !== 'string') {
      throw new TypeError('Path must be a string.');
    }

    let expanded = inputPath.trim();

    // Handle tilde expansion
    if (expanded.startsWith('~')) {
      if (expanded === '~') {
        expanded = os.homedir();
      } else if (expanded.startsWith('~' + path.sep)) {
        const pathAfterHome = expanded.slice(2); // Remove ~/ or ~\
        expanded = path.join(os.homedir(), pathAfterHome);
      } else {
        const restOfPath = expanded.slice(1);
        const separatorIndex = restOfPath.indexOf(path.sep);
        const username = separatorIndex === -1 ? restOfPath : restOfPath.slice(0, separatorIndex);
        if (username) {
          throw new Error(`Path expansion for ~${username} is not supported. Please use an absolute path or ~${path.sep}`);
        }
      }
    }

    // Resolve to the absolute path relative to the current working directory
    return path.resolve(expanded);
  }
}

/**
 * Prompt Handler
 * Handles question prompting with support for skipping during updates
 */
class PromptHandler {
  constructor() {
    this.inquirer = inquirer;
  }

  /**
   * Wrapper for inquirer.prompt to support mocking
   * @param {Array|Object} questions - Questions to ask
   * @returns {Promise<Object>} User responses
   */
  async prompt(questions) {
    return await this.inquirer.prompt(questions);
  }

  /**
   * Ask PRD sharding question with update handling
   * @param {Object} options - Options object with isUpdate and config
   * @returns {Promise<boolean>} User answer or cached value
   */
  async askPrdSharding(options = {}) {
    const { isUpdate = false, config = {} } = options;

    // Skip on update if config exists
    if (isUpdate && config.hasConfig && config.hasConfig('prd_sharding')) {
      const value = config.getConfig('prd_sharding', true);
      console.log('[PromptHandler] Skipping question: prd_sharding (using cached value)');
      return value;
    }

    // Ask question on fresh install
    const response = await this.prompt([
      {
        type: 'confirm',
        name: 'prd_sharding',
        message: 'Use PRD sharding for multi-instance setups?',
        default: true,
      },
    ]);

    return response.prd_sharding;
  }

  /**
   * Ask architecture sharding question with update handling
   * @param {Object} options - Options object with isUpdate and config
   * @returns {Promise<boolean>} User answer or cached value
   */
  async askArchitectureSharding(options = {}) {
    const { isUpdate = false, config = {} } = options;

    // Skip on update if config exists
    if (isUpdate && config.hasConfig && config.hasConfig('architecture_sharding')) {
      const value = config.getConfig('architecture_sharding', false);
      console.log('[PromptHandler] Skipping question: architecture_sharding (using cached value)');
      return value;
    }

    // Ask question on fresh install
    const response = await this.prompt([
      {
        type: 'confirm',
        name: 'architecture_sharding',
        message: 'Use architecture sharding for distributed systems?',
        default: false,
      },
    ]);

    return response.architecture_sharding;
  }

  /**
   * Ask install type question with update handling
   * @param {Object} options - Options object with isUpdate and config
   * @returns {Promise<string>} User answer or cached value
   */
  async askInstallType(options = {}) {
    const { isUpdate = false, config = {} } = options;

    // Skip on update if config exists
    if (isUpdate && config.hasConfig && config.hasConfig('install_type')) {
      const value = config.getConfig('install_type', 'full');
      console.log('[PromptHandler] Skipping question: install_type (using cached value)');
      return value;
    }

    // Ask question on fresh install
    const response = await this.prompt([
      {
        type: 'list',
        name: 'install_type',
        message: 'Select installation type:',
        choices: ['full', 'minimal', 'custom'],
        default: 'full',
      },
    ]);

    return response.install_type;
  }

  /**
   * Ask doc organization question with update handling
   * @param {Object} options - Options object with isUpdate and config
   * @returns {Promise<string>} User answer or cached value
   */
  async askDocOrganization(options = {}) {
    const { isUpdate = false, config = {} } = options;

    // Skip on update if config exists
    if (isUpdate && config.hasConfig && config.hasConfig('doc_organization')) {
      const value = config.getConfig('doc_organization', 'flat');
      console.log('[PromptHandler] Skipping question: doc_organization (using cached value)');
      return value;
    }

    // Ask question on fresh install
    const response = await this.prompt([
      {
        type: 'list',
        name: 'doc_organization',
        message: 'How would you like to organize documentation?',
        choices: ['flat', 'hierarchical', 'by_module', 'by-module'],
        default: 'flat',
      },
    ]);

    return response.doc_organization;
  }

  /**
   * Generic config question with update handling
   * @param {string} questionKey - Configuration key
   * @param {Object} options - Options object with isUpdate, config, and question details
   * @returns {Promise<*>} User answer or cached value
   */
  async askConfigQuestion(questionKey, options = {}) {
    const { isUpdate = false, config = {} } = options;

    // Skip on update if config exists
    if (isUpdate && config.hasConfig && config.hasConfig(questionKey)) {
      const value = config.getConfig ? config.getConfig(questionKey) : null;
      // Only skip if value is not undefined/null
      if (value !== null && value !== undefined) {
        console.log(`[PromptHandler] Skipping question: ${questionKey} (using cached value)`);
        return value;
      }
      // If config exists but value is undefined, still ask the question
    }

    // Ask question on fresh install or when not in config
    // Use 'answer' as the property name for generic questions (matches test expectations)
    const question = {
      type: 'input',
      name: 'answer',
      message: `Enter value for ${questionKey}:`,
      default: null,
    };

    const response = await this.prompt([question]);
    return response.answer;
  }

  /**
   * Check if question should be skipped
   * @param {string} questionKey - Config key for the question
   * @param {Object} config - Config object from manifest
   * @param {boolean} isUpdate - Whether this is an update
   * @returns {boolean} True if question should be skipped
   */
  shouldSkipQuestion(questionKey, config, isUpdate) {
    if (!isUpdate) {
      return false; // Always ask on fresh install
    }

    if (!config || !config.hasConfig) {
      return false; // Can't skip without config
    }

    return config.hasConfig(questionKey);
  }
}

module.exports = { UI, PromptHandler };
