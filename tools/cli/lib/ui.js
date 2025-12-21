const chalk = require('chalk');
const inquirer = require('inquirer').default || require('inquirer');
const path = require('node:path');
const os = require('node:os');
const fs = require('fs-extra');
const { CLIUtils } = require('./cli-utils');
const { CustomHandler } = require('../installers/lib/custom/handler');

/**
 * UI utilities for the installer
 */
class UI {
  /**
   * Prompt for installation configuration
   * @returns {Object} Installation configuration
   */
  async promptInstall() {
    CLIUtils.displayLogo();

    // Display changelog link
    console.log(chalk.cyan('\n📋 Read the latest updates: https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md\n'));

    const confirmedDirectory = await this.getConfirmedDirectory();

    // Preflight: Check for legacy BMAD v4 footprints immediately after getting directory
    const { Detector } = require('../installers/lib/core/detector');
    const { Installer } = require('../installers/lib/core/installer');
    const detector = new Detector();
    const installer = new Installer();
    const legacyV4 = await detector.detectLegacyV4(confirmedDirectory);
    if (legacyV4.hasLegacyV4) {
      await installer.handleLegacyV4Migration(confirmedDirectory, legacyV4);
    }

    // Check for legacy folders and prompt for rename before showing any menus
    let hasLegacyCfg = false;
    let hasLegacyBmadFolder = false;
    let bmadDir = null;
    let legacyBmadPath = null;

    // First check for legacy .bmad folder (instead of _bmad)
    // Only check if directory exists
    if (await fs.pathExists(confirmedDirectory)) {
      const entries = await fs.readdir(confirmedDirectory, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name === '.bmad') {
          hasLegacyBmadFolder = true;
          legacyBmadPath = path.join(confirmedDirectory, '.bmad');
          bmadDir = legacyBmadPath;

          // Check if it has _cfg folder
          const cfgPath = path.join(legacyBmadPath, '_cfg');
          if (await fs.pathExists(cfgPath)) {
            hasLegacyCfg = true;
          }
          break;
        }
      }
    }

    // If no .bmad found, check for current installations
    if (!hasLegacyBmadFolder) {
      const bmadResult = await installer.findBmadDir(confirmedDirectory);
      bmadDir = bmadResult.bmadDir;
      hasLegacyCfg = bmadResult.hasLegacyCfg;
    }

    if (hasLegacyBmadFolder || hasLegacyCfg) {
      console.log(chalk.yellow('\n⚠️  Legacy folder structure detected'));

      let message = 'The following folders need to be renamed:\n';
      if (hasLegacyBmadFolder) {
        message += chalk.dim(`  • ".bmad" → "_bmad"\n`);
      }
      if (hasLegacyCfg) {
        message += chalk.dim(`  • "_cfg" → "_config"\n`);
      }
      console.log(message);

      const { shouldRename } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'shouldRename',
          message: 'Would you like the installer to rename these folders for you?',
          default: true,
        },
      ]);

      if (!shouldRename) {
        console.log(chalk.red('\n❌ Installation cancelled'));
        console.log(chalk.dim('You must manually rename the folders before proceeding:'));
        if (hasLegacyBmadFolder) {
          console.log(chalk.dim(`  • Rename ".bmad" to "_bmad"`));
        }
        if (hasLegacyCfg) {
          console.log(chalk.dim(`  • Rename "_cfg" to "_config"`));
        }
        process.exit(0);
        return;
      }

      // Perform the renames
      const ora = require('ora');
      const spinner = ora('Updating folder structure...').start();

      try {
        // First rename .bmad to _bmad if needed
        if (hasLegacyBmadFolder) {
          const newBmadPath = path.join(confirmedDirectory, '_bmad');
          await fs.move(legacyBmadPath, newBmadPath);
          bmadDir = newBmadPath;
          spinner.succeed('Renamed ".bmad" to "_bmad"');
        }

        // Then rename _cfg to _config if needed
        if (hasLegacyCfg) {
          spinner.start('Renaming configuration folder...');
          const oldCfgPath = path.join(bmadDir, '_cfg');
          const newCfgPath = path.join(bmadDir, '_config');
          await fs.move(oldCfgPath, newCfgPath);
          spinner.succeed('Renamed "_cfg" to "_config"');
        }

        spinner.succeed('Folder structure updated successfully');
      } catch (error) {
        spinner.fail('Failed to update folder structure');
        console.error(chalk.red(`Error: ${error.message}`));
        process.exit(1);
      }
    }

    // Check if there's an existing BMAD installation (after any folder renames)
    const hasExistingInstall = await fs.pathExists(bmadDir);

    // Collect IDE tool selection early - we need this to know if we should ask about TTS
    let toolSelection;
    let agentVibesConfig = { enabled: false, alreadyInstalled: false };
    let claudeCodeSelected = false;

    if (!hasExistingInstall) {
      // For new installations, collect IDE selection first
      // We don't have modules yet, so pass empty array
      toolSelection = await this.promptToolSelection(confirmedDirectory, []);

      // Check if Claude Code was selected
      claudeCodeSelected = toolSelection.ides && toolSelection.ides.includes('claude-code');

      // If Claude Code was selected, ask about TTS
      if (claudeCodeSelected) {
        const { enableTts } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'enableTts',
            message: 'Claude Code supports TTS (Text-to-Speech). Would you like to enable it?',
            default: false,
          },
        ]);

        if (enableTts) {
          agentVibesConfig = { enabled: true, alreadyInstalled: false };
        }
      }
    }

    let customContentConfig = { hasCustomContent: false };
    if (!hasExistingInstall) {
      customContentConfig._shouldAsk = true;
    }

    // Track action type (only set if there's an existing installation)
    let actionType;

    // Only show action menu if there's an existing installation
    if (hasExistingInstall) {
      // Get version information
      const { existingInstall } = await this.getExistingInstallation(confirmedDirectory);
      const packageJsonPath = path.join(__dirname, '../../../package.json');
      const currentVersion = require(packageJsonPath).version;
      const installedVersion = existingInstall.version || 'unknown';

      // Build menu choices dynamically
      const choices = [];

      // Always show Quick Update first (allows refreshing installation even on same version)
      if (installedVersion !== 'unknown') {
        choices.push({
          name: `Quick Update (v${installedVersion} → v${currentVersion})`,
          value: 'quick-update',
        });
      }

      // Add custom agent compilation option
      if (installedVersion !== 'unknown') {
        choices.push({
          name: 'Recompile Agents (apply customizations only)',
          value: 'compile-agents',
        });
      }

      // Common actions
      choices.push({ name: 'Modify BMAD Installation', value: 'update' });

      const promptResult = await inquirer.prompt([
        {
          type: 'list',
          name: 'actionType',
          message: 'What would you like to do?',
          choices: choices,
          default: choices[0].value, // Use the first option as default
        },
      ]);

      // Extract actionType from prompt result
      actionType = promptResult.actionType;

      // Handle quick update separately
      if (actionType === 'quick-update') {
        // Quick update doesn't install custom content - just updates existing modules
        return {
          actionType: 'quick-update',
          directory: confirmedDirectory,
          customContent: { hasCustomContent: false },
        };
      }

      // Handle compile agents separately
      if (actionType === 'compile-agents') {
        // Only recompile agents with customizations, don't update any files
        return {
          actionType: 'compile-agents',
          directory: confirmedDirectory,
          customContent: { hasCustomContent: false },
        };
      }

      // If actionType === 'update', handle it with the new flow
      // Return early with modify configuration
      if (actionType === 'update') {
        // Get existing installation info
        const { installedModuleIds } = await this.getExistingInstallation(confirmedDirectory);

        console.log(chalk.dim(`  Found existing modules: ${[...installedModuleIds].join(', ')}`));
        const { changeModuleSelection } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'changeModuleSelection',
            message: 'Modify official module selection (BMad Method, BMad Builder, Creative Innovation Suite)?',
            default: false,
          },
        ]);

        let selectedModules = [];
        if (changeModuleSelection) {
          // Show module selection with existing modules pre-selected
          const moduleChoices = await this.getModuleChoices(new Set(installedModuleIds), { hasCustomContent: false });
          selectedModules = await this.selectModules(moduleChoices, [...installedModuleIds]);
        } else {
          selectedModules = [...installedModuleIds];
        }

        // After module selection, ask about custom modules
        console.log('');
        const { changeCustomModules } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'changeCustomModules',
            message: 'Modify custom module selection (add, update, or remove custom modules/agents/workflows)?',
            default: false,
          },
        ]);

        let customModuleResult = { selectedCustomModules: [], customContentConfig: { hasCustomContent: false } };
        if (changeCustomModules) {
          customModuleResult = await this.handleCustomModulesInModifyFlow(confirmedDirectory, selectedModules);
        } else {
          // Preserve existing custom modules if user doesn't want to modify them
          const { Installer } = require('../installers/lib/core/installer');
          const installer = new Installer();
          const { bmadDir } = await installer.findBmadDir(confirmedDirectory);

          const cacheDir = path.join(bmadDir, '_config', 'custom');
          if (await fs.pathExists(cacheDir)) {
            const entries = await fs.readdir(cacheDir, { withFileTypes: true });
            for (const entry of entries) {
              if (entry.isDirectory()) {
                customModuleResult.selectedCustomModules.push(entry.name);
              }
            }
          }
        }

        // Merge any selected custom modules
        if (customModuleResult.selectedCustomModules.length > 0) {
          selectedModules.push(...customModuleResult.selectedCustomModules);
        }

        // Get tool selection
        const toolSelection = await this.promptToolSelection(confirmedDirectory, selectedModules);

        // TTS configuration - ask right after tool selection (matches new install flow)
        const hasClaudeCode = toolSelection.ides && toolSelection.ides.includes('claude-code');
        let enableTts = false;

        if (hasClaudeCode) {
          const { enableTts: enable } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'enableTts',
              message: 'Claude Code supports TTS (Text-to-Speech). Would you like to enable it?',
              default: false,
            },
          ]);
          enableTts = enable;
        }

        // Core config with existing defaults (ask after TTS)
        const coreConfig = await this.collectCoreConfig(confirmedDirectory);

        return {
          actionType: 'update',
          directory: confirmedDirectory,
          installCore: true,
          modules: selectedModules,
          ides: toolSelection.ides,
          skipIde: toolSelection.skipIde,
          coreConfig: coreConfig,
          customContent: customModuleResult.customContentConfig,
          enableAgentVibes: enableTts,
          agentVibesInstalled: false,
        };
      }
    }

    // This section is only for new installations (update returns early above)
    const { installedModuleIds } = await this.getExistingInstallation(confirmedDirectory);

    // Ask about official modules for new installations
    const { wantsOfficialModules } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'wantsOfficialModules',
        message: 'Will you be installing any official BMad modules (BMad Method, BMad Builder, Creative Innovation Suite)?',
        default: true,
      },
    ]);

    let selectedOfficialModules = [];
    if (wantsOfficialModules) {
      const moduleChoices = await this.getModuleChoices(installedModuleIds, { hasCustomContent: false });
      selectedOfficialModules = await this.selectModules(moduleChoices);
    }

    // Ask about custom content
    const { wantsCustomContent } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'wantsCustomContent',
        message: 'Would you like to install a local custom module (this includes custom agents and workflows also)?',
        default: false,
      },
    ]);

    if (wantsCustomContent) {
      customContentConfig = await this.promptCustomContentSource();
    }

    // Store the selected modules for later
    customContentConfig._selectedOfficialModules = selectedOfficialModules;

    // Build the final list of selected modules
    let selectedModules = customContentConfig._selectedOfficialModules || [];

    // Add custom content modules if any were selected
    if (customContentConfig && customContentConfig.selectedModuleIds) {
      selectedModules = [...selectedModules, ...customContentConfig.selectedModuleIds];
    }

    // Remove core if it's in the list (it's always installed)
    selectedModules = selectedModules.filter((m) => m !== 'core');

    // Tool selection (already done for new installs at the beginning)
    if (!toolSelection) {
      toolSelection = await this.promptToolSelection(confirmedDirectory, selectedModules);
    }

    // Collect configurations for new installations
    const coreConfig = await this.collectCoreConfig(confirmedDirectory);

    // TTS already handled at the beginning for new installs

    return {
      actionType: 'install',
      directory: confirmedDirectory,
      installCore: true,
      modules: selectedModules,
      ides: toolSelection.ides,
      skipIde: toolSelection.skipIde,
      coreConfig: coreConfig,
      customContent: customContentConfig,
      enableAgentVibes: agentVibesConfig.enabled,
      agentVibesInstalled: agentVibesConfig.alreadyInstalled,
    };
  }

  /**
   * Prompt for tool/IDE selection (called after module configuration)
   * @param {string} projectDir - Project directory to check for existing IDEs
   * @param {Array} selectedModules - Selected modules from configuration
   * @returns {Object} Tool configuration
   */
  async promptToolSelection(projectDir, selectedModules) {
    // Check for existing configured IDEs - use findBmadDir to detect custom folder names
    const { Detector } = require('../installers/lib/core/detector');
    const { Installer } = require('../installers/lib/core/installer');
    const detector = new Detector();
    const installer = new Installer();
    const bmadResult = await installer.findBmadDir(projectDir || process.cwd());
    const bmadDir = bmadResult.bmadDir;
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
        // Skip empty or invalid IDE values
        if (!ideValue || typeof ideValue !== 'string') {
          continue;
        }

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
        } else {
          // Warn about unrecognized IDE (but don't fail)
          console.log(chalk.yellow(`⚠️  Previously configured IDE '${ideValue}' is no longer available`));
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

    let answers;
    let userConfirmedNoTools = false;

    // Loop until user selects at least one tool OR explicitly confirms no tools
    while (!userConfirmedNoTools) {
      answers = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'ides',
          message: 'Select tools to configure:',
          choices: ideChoices,
          pageSize: 30,
        },
      ]);

      // If tools were selected, we're done
      if (answers.ides && answers.ides.length > 0) {
        break;
      }

      // Warn that no tools were selected - users often miss the spacebar requirement
      console.log();
      console.log(chalk.red.bold('⚠️  WARNING: No tools were selected!'));
      console.log(chalk.red('   You must press SPACEBAR to select items, then ENTER to confirm.'));
      console.log(chalk.red('   Simply highlighting an item does NOT select it.'));
      console.log();

      const { goBack } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'goBack',
          message: chalk.yellow('Would you like to go back and select at least one tool?'),
          default: true,
        },
      ]);

      if (goBack) {
        // Re-display a message before looping back
        console.log();
      } else {
        // User explicitly chose to proceed without tools
        userConfirmedNoTools = true;
      }
    }

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
    // Clean, simple completion message
    console.log('\n' + chalk.green.bold('✨ BMAD is ready to use!'));

    // Show installation summary in a simple format
    console.log(chalk.dim(`Installed to: ${result.path}`));
    if (result.modules && result.modules.length > 0) {
      console.log(chalk.dim(`Modules: ${result.modules.join(', ')}`));
    }
    if (result.agentVibesEnabled) {
      console.log(chalk.dim(`TTS: Enabled`));
    }

    // TTS injection info (simplified)
    if (result.ttsInjectedFiles && result.ttsInjectedFiles.length > 0) {
      console.log(chalk.dim(`\n💡 TTS enabled for ${result.ttsInjectedFiles.length} agent(s)`));
      console.log(chalk.dim('   Agents will now speak when using AgentVibes'));
    }

    console.log(chalk.yellow('\nThank you for helping test the early release version of the new BMad Core and BMad Method!'));
    console.log(chalk.cyan('Stable Beta coming soon - please read the full README.md and linked documentation to get started!'));

    // Add changelog link at the end
    console.log(
      chalk.magenta(
        "\n📋 Want to see what's new? Check out the changelog: https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md",
      ),
    );
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
    const { Installer } = require('../installers/lib/core/installer');
    const detector = new Detector();
    const installer = new Installer();
    const bmadDirResult = await installer.findBmadDir(directory);
    const existingInstall = await detector.detect(bmadDirResult.bmadDir);
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

    const coreConfig = configCollector.collectedConfig.core;
    // Ensure we always have a core config object, even if empty
    return coreConfig || {};
  }

  /**
   * Get module choices for selection
   * @param {Set} installedModuleIds - Currently installed module IDs
   * @param {Object} customContentConfig - Custom content configuration
   * @returns {Array} Module choices for inquirer
   */
  async getModuleChoices(installedModuleIds, customContentConfig = null) {
    const moduleChoices = [];
    const isNewInstallation = installedModuleIds.size === 0;

    const customContentItems = [];
    const hasCustomContentItems = false;

    // Add custom content items
    if (customContentConfig && customContentConfig.hasCustomContent && customContentConfig.customPath) {
      // Existing installation - show from directory
      const customHandler = new CustomHandler();
      const customFiles = await customHandler.findCustomContent(customContentConfig.customPath);

      for (const customFile of customFiles) {
        const customInfo = await customHandler.getCustomInfo(customFile);
        if (customInfo) {
          customContentItems.push({
            name: `${chalk.cyan('✓')} ${customInfo.name} ${chalk.gray(`(${customInfo.relativePath})`)}`,
            value: `__CUSTOM_CONTENT__${customFile}`, // Unique value for each custom content
            checked: true, // Default to selected since user chose to provide custom content
            path: customInfo.path, // Track path to avoid duplicates
          });
        }
      }
    }

    // Add official modules
    const { ModuleManager } = require('../installers/lib/modules/manager');
    const moduleManager = new ModuleManager();
    const { modules: availableModules, customModules: customModulesFromCache } = await moduleManager.listAvailable();

    // First, add all items to appropriate sections
    const allCustomModules = [];

    // Add custom content items from directory
    allCustomModules.push(...customContentItems);

    // Add custom modules from cache
    for (const mod of customModulesFromCache) {
      // Skip if this module is already in customContentItems (by path)
      const isDuplicate = allCustomModules.some((item) => item.path && mod.path && path.resolve(item.path) === path.resolve(mod.path));

      if (!isDuplicate) {
        allCustomModules.push({
          name: `${chalk.cyan('✓')} ${mod.name} ${chalk.gray(`(cached)`)}`,
          value: mod.id,
          checked: isNewInstallation ? mod.defaultSelected || false : installedModuleIds.has(mod.id),
        });
      }
    }

    // Add separators and modules in correct order
    if (allCustomModules.length > 0) {
      // Add separator for custom content, all custom modules, and official content separator
      moduleChoices.push(
        new inquirer.Separator('── Custom Content ──'),
        ...allCustomModules,
        new inquirer.Separator('── Official Content ──'),
      );
    }

    // Add official modules (only non-custom ones)
    for (const mod of availableModules) {
      if (!mod.isCustom) {
        moduleChoices.push({
          name: mod.name,
          value: mod.id,
          checked: isNewInstallation ? mod.defaultSelected || false : installedModuleIds.has(mod.id),
        });
      }
    }

    return moduleChoices;
  }

  /**
   * Prompt for module selection
   * @param {Array} moduleChoices - Available module choices
   * @returns {Array} Selected module IDs
   */
  async selectModules(moduleChoices, defaultSelections = []) {
    const moduleAnswer = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'modules',
        message: 'Select modules to install:',
        choices: moduleChoices,
        default: defaultSelections,
      },
    ]);

    const selected = moduleAnswer.modules || [];

    return selected;
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
          // Check for any bmad installation (any folder with _config/manifest.yaml)
          const { Installer } = require('../installers/lib/core/installer');
          const installer = new Installer();
          const bmadResult = await installer.findBmadDir(directory);
          const hasBmadInstall =
            (await fs.pathExists(bmadResult.bmadDir)) && (await fs.pathExists(path.join(bmadResult.bmadDir, '_config', 'manifest.yaml')));

          console.log(
            chalk.gray(`Directory exists and contains ${files.length} item(s)`) +
              (hasBmadInstall ? chalk.yellow(` including existing BMAD installation (${path.basename(bmadResult.bmadDir)})`) : ''),
          );
        } else {
          console.log(chalk.gray('Directory exists and is empty'));
        }
      }
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

  /**
   * @function promptAgentVibes
   * @intent Ask user if they want AgentVibes TTS integration during BMAD installation
   * @why Enables optional voice features without forcing TTS on users who don't want it
   * @param {string} projectDir - Absolute path to user's project directory
   * @returns {Promise<Object>} Configuration object: { enabled: boolean, alreadyInstalled: boolean }
   * @sideeffects None - pure user input collection, no files written
   * @edgecases Shows warning if user enables TTS but AgentVibes not detected
   * @calledby promptInstall() during installation flow, after core config, before IDE selection
   * @calls checkAgentVibesInstalled(), inquirer.prompt(), chalk.green/yellow/dim()
   *
   * AI NOTE: This prompt is strategically positioned in installation flow:
   * - AFTER core config (user_name, etc)
   * - BEFORE IDE selection (which can hang on Windows/PowerShell)
   *
   * Flow Logic:
   * 1. Auto-detect if AgentVibes already installed (checks for hook files)
   * 2. Show detection status to user (green checkmark or gray "not detected")
   * 3. Prompt: "Enable AgentVibes TTS?" (defaults to true if detected)
   * 4. If user says YES but AgentVibes NOT installed:
   *    → Show warning with installation link (graceful degradation)
   * 5. Return config to promptInstall(), which passes to installer.install()
   *
   * State Flow:
   * promptAgentVibes() → { enabled, alreadyInstalled }
   *                    ↓
   * promptInstall() → config.enableAgentVibes
   *                    ↓
   * installer.install() → this.enableAgentVibes
   *                    ↓
   * processTTSInjectionPoints() → injects OR strips markers
   *
   * RELATED:
   * ========
   * - Detection: checkAgentVibesInstalled() - looks for bmad-speak.sh and play-tts.sh
   * - Processing: installer.js::processTTSInjectionPoints()
   * - Markers: src/core/workflows/party-mode/instructions.md:101, src/modules/bmm/agents/*.md
   * - GitHub Issue: paulpreibisch/AgentVibes#36
   */
  async promptAgentVibes(projectDir) {
    CLIUtils.displaySection('🎤 Voice Features', 'Enable TTS for multi-agent conversations');

    // Check if AgentVibes is already installed
    const agentVibesInstalled = await this.checkAgentVibesInstalled(projectDir);

    if (agentVibesInstalled) {
      console.log(chalk.green('  ✓ AgentVibes detected'));
    } else {
      console.log(chalk.dim('  AgentVibes not detected'));
    }

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'enableTts',
        message: 'Enable Agents to Speak Out loud (powered by Agent Vibes? Claude Code only currently)',
        default: false, // Default to yes - recommended for best experience
      },
    ]);

    if (answers.enableTts && !agentVibesInstalled) {
      console.log(chalk.yellow('\n  ⚠️  AgentVibes not installed'));
      console.log(chalk.dim('  Install AgentVibes separately to enable TTS:'));
      console.log(chalk.dim('  https://github.com/paulpreibisch/AgentVibes\n'));
    }

    return {
      enabled: answers.enableTts,
      alreadyInstalled: agentVibesInstalled,
    };
  }

  /**
   * @function checkAgentVibesInstalled
   * @intent Detect if AgentVibes TTS hooks are present in user's project
   * @why Allows auto-enabling TTS and showing helpful installation guidance
   * @param {string} projectDir - Absolute path to user's project directory
   * @returns {Promise<boolean>} true if both required AgentVibes hooks exist, false otherwise
   * @sideeffects None - read-only file existence checks
   * @edgecases Returns false if either hook missing (both required for functional TTS)
   * @calledby promptAgentVibes() to determine default value and show detection status
   * @calls fs.pathExists() twice (bmad-speak.sh, play-tts.sh)
   *
   * AI NOTE: This checks for the MINIMUM viable AgentVibes installation.
   *
   * Required Files:
   * ===============
   * 1. .claude/hooks/bmad-speak.sh
   *    - Maps agent display names → agent IDs → voice profiles
   *    - Calls play-tts.sh with agent's assigned voice
   *    - Created by AgentVibes installer
   *
   * 2. .claude/hooks/play-tts.sh
   *    - Core TTS router (ElevenLabs or Piper)
   *    - Provider-agnostic interface
   *    - Required by bmad-speak.sh
   *
   * Why Both Required:
   * ==================
   * - bmad-speak.sh alone: No TTS backend
   * - play-tts.sh alone: No BMAD agent voice mapping
   * - Both together: Full party mode TTS integration
   *
   * Detection Strategy:
   * ===================
   * We use simple file existence (not version checks) because:
   * - Fast and reliable
   * - Works across all AgentVibes versions
   * - User will discover version issues when TTS runs (fail-fast)
   *
   * PATTERN: Adding New Detection Criteria
   * =======================================
   * If future AgentVibes features require additional files:
   * 1. Add new pathExists check to this function
   * 2. Update documentation in promptAgentVibes()
   * 3. Consider: should missing file prevent detection or just log warning?
   *
   * RELATED:
   * ========
   * - AgentVibes Installer: creates these hooks
   * - bmad-speak.sh: calls play-tts.sh with agent voices
   * - Party Mode: uses bmad-speak.sh for agent dialogue
   */
  async checkAgentVibesInstalled(projectDir) {
    const fs = require('fs-extra');
    const path = require('node:path');

    // Check for AgentVibes hook files
    const hookPath = path.join(projectDir, '.claude', 'hooks', 'bmad-speak.sh');
    const playTtsPath = path.join(projectDir, '.claude', 'hooks', 'play-tts.sh');

    return (await fs.pathExists(hookPath)) && (await fs.pathExists(playTtsPath));
  }

  /**
   * Load existing configurations to use as defaults
   * @param {string} directory - Installation directory
   * @returns {Object} Existing configurations
   */
  async loadExistingConfigurations(directory) {
    const configs = {
      hasCustomContent: false,
      coreConfig: {},
      ideConfig: { ides: [], skipIde: false },
      agentVibesConfig: { enabled: false, alreadyInstalled: false },
    };

    try {
      // Load core config
      configs.coreConfig = await this.collectCoreConfig(directory);

      // Load IDE configuration
      const configuredIdes = await this.getConfiguredIdes(directory);
      if (configuredIdes.length > 0) {
        configs.ideConfig.ides = configuredIdes;
        configs.ideConfig.skipIde = false;
      }

      // Load AgentVibes configuration
      const agentVibesInstalled = await this.checkAgentVibesInstalled(directory);
      configs.agentVibesConfig = { enabled: agentVibesInstalled, alreadyInstalled: agentVibesInstalled };

      return configs;
    } catch {
      // If loading fails, return empty configs
      console.warn('Warning: Could not load existing configurations');
      return configs;
    }
  }

  /**
   * Get configured IDEs from existing installation
   * @param {string} directory - Installation directory
   * @returns {Array} List of configured IDEs
   */
  async getConfiguredIdes(directory) {
    const { Detector } = require('../installers/lib/core/detector');
    const { Installer } = require('../installers/lib/core/installer');
    const detector = new Detector();
    const installer = new Installer();
    const bmadResult = await installer.findBmadDir(directory);
    const existingInstall = await detector.detect(bmadResult.bmadDir);
    return existingInstall.ides || [];
  }

  /**
   * Prompt user for custom content source location
   * @returns {Object} Custom content configuration
   */
  async promptCustomContentSource() {
    const customContentConfig = { hasCustomContent: true, sources: [] };

    // Keep asking for more sources until user is done
    while (true) {
      // First ask if user wants to add another module or continue
      if (customContentConfig.sources.length > 0) {
        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'Would you like to:',
            choices: [
              { name: 'Add another custom module', value: 'add' },
              { name: 'Continue with installation', value: 'continue' },
            ],
            default: 'continue',
          },
        ]);

        if (action === 'continue') {
          break;
        }
      }

      let sourcePath;
      let isValid = false;

      while (!isValid) {
        const { path: inputPath } = await inquirer.prompt([
          {
            type: 'input',
            name: 'path',
            message: 'Enter the path to your custom content folder (or press Enter to cancel):',
            validate: async (input) => {
              // Allow empty input to cancel
              if (!input || input.trim() === '') {
                return true; // Allow empty to exit
              }

              try {
                // Expand the path
                const expandedPath = this.expandUserPath(input.trim());

                // Check if path exists
                if (!(await fs.pathExists(expandedPath))) {
                  return 'Path does not exist';
                }

                // Check if it's a directory
                const stat = await fs.stat(expandedPath);
                if (!stat.isDirectory()) {
                  return 'Path must be a directory';
                }

                // Check for module.yaml in the root
                const moduleYamlPath = path.join(expandedPath, 'module.yaml');
                if (!(await fs.pathExists(moduleYamlPath))) {
                  return 'Directory must contain a module.yaml file in the root';
                }

                // Try to parse the module.yaml to get the module ID
                try {
                  const yaml = require('yaml');
                  const content = await fs.readFile(moduleYamlPath, 'utf8');
                  const moduleData = yaml.parse(content);
                  if (!moduleData.code) {
                    return 'module.yaml must contain a "code" field for the module ID';
                  }
                } catch (error) {
                  return 'Invalid module.yaml file: ' + error.message;
                }

                return true;
              } catch (error) {
                return 'Error validating path: ' + error.message;
              }
            },
          },
        ]);

        // If user pressed Enter without typing anything, exit the loop
        if (!inputPath || inputPath.trim() === '') {
          // If we have no modules yet, return false for no custom content
          if (customContentConfig.sources.length === 0) {
            return { hasCustomContent: false };
          }
          return customContentConfig;
        }

        sourcePath = this.expandUserPath(inputPath);
        isValid = true;
      }

      // Read module.yaml to get module info
      const yaml = require('yaml');
      const moduleYamlPath = path.join(sourcePath, 'module.yaml');
      const moduleContent = await fs.readFile(moduleYamlPath, 'utf8');
      const moduleData = yaml.parse(moduleContent);

      // Add to sources
      customContentConfig.sources.push({
        path: sourcePath,
        id: moduleData.code,
        name: moduleData.name || moduleData.code,
      });

      console.log(chalk.green(`✓ Confirmed local custom module: ${moduleData.name || moduleData.code}`));
    }

    // Ask if user wants to add these to the installation
    const { shouldInstall } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldInstall',
        message: `Install ${customContentConfig.sources.length} custom module(s) now?`,
        default: true,
      },
    ]);

    if (shouldInstall) {
      customContentConfig.selected = true;
      // Store paths to module.yaml files, not directories
      customContentConfig.selectedFiles = customContentConfig.sources.map((s) => path.join(s.path, 'module.yaml'));
      // Also include module IDs for installation
      customContentConfig.selectedModuleIds = customContentConfig.sources.map((s) => s.id);
    }

    return customContentConfig;
  }

  /**
   * Handle custom modules in the modify flow
   * @param {string} directory - Installation directory
   * @param {Array} selectedModules - Currently selected modules
   * @returns {Object} Result with selected custom modules and custom content config
   */
  async handleCustomModulesInModifyFlow(directory, selectedModules) {
    // Get existing installation to find custom modules
    const { existingInstall } = await this.getExistingInstallation(directory);

    // Check if there are any custom modules in cache
    const { Installer } = require('../installers/lib/core/installer');
    const installer = new Installer();
    const { bmadDir } = await installer.findBmadDir(directory);

    const cacheDir = path.join(bmadDir, '_config', 'custom');
    const cachedCustomModules = [];

    if (await fs.pathExists(cacheDir)) {
      const entries = await fs.readdir(cacheDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const moduleYamlPath = path.join(cacheDir, entry.name, 'module.yaml');
          if (await fs.pathExists(moduleYamlPath)) {
            const yaml = require('yaml');
            const content = await fs.readFile(moduleYamlPath, 'utf8');
            const moduleData = yaml.parse(content);

            cachedCustomModules.push({
              id: entry.name,
              name: moduleData.name || entry.name,
              description: moduleData.description || 'Custom module from cache',
              checked: selectedModules.includes(entry.name),
              fromCache: true,
            });
          }
        }
      }
    }

    const result = {
      selectedCustomModules: [],
      customContentConfig: { hasCustomContent: false },
    };

    // Ask user about custom modules
    console.log(chalk.cyan('\n⚙️  Custom Modules'));
    if (cachedCustomModules.length > 0) {
      console.log(chalk.dim('Found custom modules in your installation:'));
    } else {
      console.log(chalk.dim('No custom modules currently installed.'));
    }

    // Build choices dynamically based on whether we have existing modules
    const choices = [];
    if (cachedCustomModules.length > 0) {
      choices.push(
        { name: 'Keep all existing custom modules', value: 'keep' },
        { name: 'Select which custom modules to keep', value: 'select' },
        { name: 'Add new custom modules', value: 'add' },
        { name: 'Remove all custom modules', value: 'remove' },
      );
    } else {
      choices.push({ name: 'Add new custom modules', value: 'add' }, { name: 'Cancel (no custom modules)', value: 'cancel' });
    }

    const { customAction } = await inquirer.prompt([
      {
        type: 'list',
        name: 'customAction',
        message:
          cachedCustomModules.length > 0 ? 'What would you like to do with custom modules?' : 'Would you like to add custom modules?',
        choices: choices,
        default: cachedCustomModules.length > 0 ? 'keep' : 'add',
      },
    ]);

    switch (customAction) {
      case 'keep': {
        // Keep all existing custom modules
        result.selectedCustomModules = cachedCustomModules.map((m) => m.id);
        console.log(chalk.dim(`Keeping ${result.selectedCustomModules.length} custom module(s)`));
        break;
      }

      case 'select': {
        // Let user choose which to keep
        const choices = cachedCustomModules.map((m) => ({
          name: `${m.name} ${chalk.gray(`(${m.id})`)}`,
          value: m.id,
        }));

        const { keepModules } = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'keepModules',
            message: 'Select custom modules to keep:',
            choices: choices,
            default: cachedCustomModules.filter((m) => m.checked).map((m) => m.id),
          },
        ]);
        result.selectedCustomModules = keepModules;
        break;
      }

      case 'add': {
        // By default, keep existing modules when adding new ones
        // User chose "Add new" not "Replace", so we assume they want to keep existing
        result.selectedCustomModules = cachedCustomModules.map((m) => m.id);

        // Then prompt for new ones (reuse existing method)
        const newCustomContent = await this.promptCustomContentSource();
        if (newCustomContent.hasCustomContent && newCustomContent.selected) {
          result.selectedCustomModules.push(...newCustomContent.selectedModuleIds);
          result.customContentConfig = newCustomContent;
        }
        break;
      }

      case 'remove': {
        // Remove all custom modules
        console.log(chalk.yellow('All custom modules will be removed from the installation'));
        break;
      }

      case 'cancel': {
        // User cancelled - no custom modules
        console.log(chalk.dim('No custom modules will be added'));
        break;
      }
    }

    return result;
  }
}

module.exports = { UI };
