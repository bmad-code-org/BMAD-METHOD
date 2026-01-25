const chalk = require('chalk');
const path = require('node:path');
const os = require('node:os');
const fs = require('fs-extra');
const { CLIUtils } = require('./cli-utils');
const { CustomHandler } = require('../installers/lib/custom/handler');
const { ExternalModuleManager } = require('../installers/lib/modules/external-manager');
const prompts = require('./prompts');

// Separator class for visual grouping in select/multiselect prompts
// Note: @clack/prompts doesn't support separators natively, they are filtered out
class Separator {
  constructor(text = '────────') {
    this.line = text;
    this.name = text;
  }
  type = 'separator';
}

// Separator for choice lists (compatible interface)
const choiceUtils = { Separator };

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

    // Display version-specific start message from install-messages.yaml
    const { MessageLoader } = require('../installers/lib/message-loader');
    const messageLoader = new MessageLoader();
    messageLoader.displayStartMessage();

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
        if (entry.isDirectory() && (entry.name === '.bmad' || entry.name === 'bmad')) {
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

    // If no .bmad or bmad found, check for current installations _bmad
    if (!hasLegacyBmadFolder) {
      const bmadResult = await installer.findBmadDir(confirmedDirectory);
      bmadDir = bmadResult.bmadDir;
      hasLegacyCfg = bmadResult.hasLegacyCfg;
    }

    // Handle legacy .bmad or _cfg folder - these are very old (more than 2 versions behind)
    // Show version warning instead of offering conversion
    if (hasLegacyBmadFolder || hasLegacyCfg) {
      console.log('');
      console.log(chalk.yellow.bold('⚠️  LEGACY INSTALLATION DETECTED'));
      console.log(chalk.yellow('─'.repeat(80)));
      console.log(
        chalk.yellow(
          'Found a ".bmad"/"bmad" folder, or a legacy "_cfg" folder under the bmad folder - this is from a old BMAD version that is out of date for automatic upgrade, manual intervention required.',
        ),
      );
      console.log(chalk.yellow('This version is more than 2 alpha versions behind current.'));
      console.log('');
      console.log(chalk.dim('For stability, we only support updates from the previous 2 alpha versions.'));
      console.log(chalk.dim('Legacy installations may have compatibility issues.'));
      console.log('');
      console.log(chalk.dim('For the best experience, we strongly recommend:'));
      console.log(chalk.dim('  1. Delete your current BMAD installation folder (.bmad or bmad)'));
      console.log(
        chalk.dim(
          '  2. Run a fresh installation\n\nIf you do not want to start fresh, you can attempt to proceed beyond this point IF you have ensured the bmad folder is named _bmad, and under it there is a _config folder. If you have a folder under your bmad folder named _cfg, you would need to rename it _config, and then restart the installer.',
        ),
      );
      console.log('');
      console.log(chalk.dim('Benefits of a fresh install:'));
      console.log(chalk.dim('  • Cleaner configuration without legacy artifacts'));
      console.log(chalk.dim('  • All new features properly configured'));
      console.log(chalk.dim('  • Fewer potential conflicts'));
      console.log(chalk.dim(''));
      console.log(
        chalk.dim(
          'If you have already produced output from an earlier alpha version, you can still retain those artifacts. After installation, ensure you configured during install the proper file locations for artifacts depending on the module you are using, or move the files to the proper locations.',
        ),
      );
      console.log(chalk.yellow('─'.repeat(80)));
      console.log('');

      const proceed = await prompts.select({
        message: 'How would you like to proceed?',
        choices: [
          {
            name: 'Cancel and do a fresh install (recommended)',
            value: 'cancel',
          },
          {
            name: 'Proceed anyway (will attempt update, potentially may fail or have unstable behavior)',
            value: 'proceed',
          },
        ],
        default: 'cancel',
      });

      if (proceed === 'cancel') {
        console.log('');
        console.log(chalk.cyan('To do a fresh install:'));
        console.log(chalk.dim('  1. Delete the existing bmad folder in your project'));
        console.log(chalk.dim("  2. Run 'bmad install' again"));
        console.log('');
        process.exit(0);
        return;
      }

      const ora = require('ora');
      const spinner = ora('Updating folder structure...').start();
      try {
        // Handle .bmad folder
        if (hasLegacyBmadFolder) {
          const newBmadPath = path.join(confirmedDirectory, '_bmad');
          await fs.move(legacyBmadPath, newBmadPath);
          bmadDir = newBmadPath;
          spinner.succeed('Renamed ".bmad" to "_bmad"');
        }

        // Handle _cfg folder (either from .bmad or standalone)
        const cfgPath = path.join(bmadDir, '_cfg');
        if (await fs.pathExists(cfgPath)) {
          spinner.start('Renaming configuration folder...');
          const newCfgPath = path.join(bmadDir, '_config');
          await fs.move(cfgPath, newCfgPath);
          spinner.succeed('Renamed "_cfg" to "_config"');
        }
      } catch (error) {
        spinner.fail('Failed to update folder structure');
        console.error(chalk.red(`Error: ${error.message}`));
        process.exit(1);
      }
    }

    // Check if there's an existing BMAD installation (after any folder renames)
    const hasExistingInstall = await fs.pathExists(bmadDir);

    let customContentConfig = { hasCustomContent: false };
    if (!hasExistingInstall) {
      customContentConfig._shouldAsk = true;
    }

    // Track action type (only set if there's an existing installation)
    let actionType;

    // Only show action menu if there's an existing installation
    if (hasExistingInstall) {
      // Get version information
      const { existingInstall, bmadDir } = await this.getExistingInstallation(confirmedDirectory);
      const packageJsonPath = path.join(__dirname, '../../../package.json');
      const currentVersion = require(packageJsonPath).version;
      const installedVersion = existingInstall.version || 'unknown';

      // Check if version is too old and warn user
      const shouldProceed = await this.showOldAlphaVersionWarning(installedVersion, currentVersion, path.basename(bmadDir));

      // If user chose to cancel, exit the installer
      if (!shouldProceed) {
        process.exit(0);
        return;
      }

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

      actionType = await prompts.select({
        message: 'How would you like to proceed?',
        choices: choices,
        default: choices[0].value,
      });

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

        // Unified module selection - all modules in one grouped multiselect
        let selectedModules = await this.selectAllModules(installedModuleIds);

        // After module selection, ask about custom modules
        console.log('');
        const changeCustomModules = await prompts.confirm({
          message: 'Modify custom modules, agents, or workflows?',
          default: false,
        });

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
        const toolSelection = await this.promptToolSelection(confirmedDirectory);

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
        };
      }
    }

    // This section is only for new installations (update returns early above)
    const { installedModuleIds } = await this.getExistingInstallation(confirmedDirectory);

    // Unified module selection - all modules in one grouped multiselect
    let selectedModules = await this.selectAllModules(installedModuleIds);

    // Ask about custom content (local modules/agents/workflows)
    const wantsCustomContent = await prompts.confirm({
      message: 'Add custom modules, agents, or workflows from your computer?',
      default: false,
    });

    if (wantsCustomContent) {
      customContentConfig = await this.promptCustomContentSource();
    }

    // Add custom content modules if any were selected
    if (customContentConfig && customContentConfig.selectedModuleIds) {
      selectedModules.push(...customContentConfig.selectedModuleIds);
    }

    selectedModules = selectedModules.filter((m) => m !== 'core');
    let toolSelection = await this.promptToolSelection(confirmedDirectory);
    const coreConfig = await this.collectCoreConfig(confirmedDirectory);

    return {
      actionType: 'install',
      directory: confirmedDirectory,
      installCore: true,
      modules: selectedModules,
      ides: toolSelection.ides,
      skipIde: toolSelection.skipIde,
      coreConfig: coreConfig,
      customContent: customContentConfig,
    };
  }

  /**
   * Prompt for tool/IDE selection (called after module configuration)
   * @param {string} projectDir - Project directory to check for existing IDEs
   * @returns {Object} Tool configuration
   */
  async promptToolSelection(projectDir) {
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

    const preferredIdes = await ideManager.getPreferredIdes();
    const otherIdes = await ideManager.getOtherIdes();

    // Build grouped options object for groupMultiselect
    const groupedOptions = {};
    const processedIdes = new Set();
    const initialValues = [];

    // First, add previously configured IDEs, marked with ✅
    if (configuredIdes.length > 0) {
      const configuredGroup = [];
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
          configuredGroup.push({
            label: `${ide.name} ✅`,
            value: ide.value,
          });
          processedIdes.add(ide.value);
          initialValues.push(ide.value); // Pre-select configured IDEs
        } else {
          // Warn about unrecognized IDE (but don't fail)
          console.log(chalk.yellow(`⚠️  Previously configured IDE '${ideValue}' is no longer available`));
        }
      }
      if (configuredGroup.length > 0) {
        groupedOptions['Previously Configured'] = configuredGroup;
      }
    }

    // Add preferred tools (excluding already processed)
    const remainingPreferred = preferredIdes.filter((ide) => !processedIdes.has(ide.value));
    if (remainingPreferred.length > 0) {
      groupedOptions['Recommended Tools'] = remainingPreferred.map((ide) => {
        processedIdes.add(ide.value);
        return {
          label: `${ide.name} ⭐`,
          value: ide.value,
        };
      });
    }

    // Add other tools (excluding already processed)
    const remainingOther = otherIdes.filter((ide) => !processedIdes.has(ide.value));
    if (remainingOther.length > 0) {
      groupedOptions['Additional Tools'] = remainingOther.map((ide) => ({
        label: ide.name,
        value: ide.value,
      }));
    }

    // Add standalone "None" option at the end
    groupedOptions[' '] = [
      {
        label: '⚠ None - I am not installing any tools',
        value: '__NONE__',
      },
    ];

    let selectedIdes = [];

    selectedIdes = await prompts.groupMultiselect({
      message: `Select tools to configure ${chalk.dim('(↑/↓ navigates, SPACE toggles, ENTER to confirm)')}:`,
      options: groupedOptions,
      initialValues: initialValues.length > 0 ? initialValues : undefined,
      required: true,
      selectableGroups: false,
    });

    // If user selected both "__NONE__" and other tools, honor the "None" choice
    if (selectedIdes && selectedIdes.includes('__NONE__') && selectedIdes.length > 1) {
      console.log();
      console.log(chalk.yellow('⚠️  "None - I am not installing any tools" was selected, so no tools will be configured.'));
      console.log();
      selectedIdes = [];
    } else if (selectedIdes && selectedIdes.includes('__NONE__')) {
      // Only "__NONE__" was selected
      selectedIdes = [];
    }

    return {
      ides: selectedIdes || [],
      skipIde: !selectedIdes || selectedIdes.length === 0,
    };
  }

  /**
   * Prompt for update configuration
   * @returns {Object} Update configuration
   */
  async promptUpdate() {
    const backupFirst = await prompts.confirm({
      message: 'Create backup before updating?',
      default: true,
    });

    const preserveCustomizations = await prompts.confirm({
      message: 'Preserve local customizations?',
      default: true,
    });

    return { backupFirst, preserveCustomizations };
  }

  /**
   * Confirm action
   * @param {string} message - Confirmation message
   * @param {boolean} defaultValue - Default value
   * @returns {boolean} User confirmation
   */
  async confirm(message, defaultValue = false) {
    return await prompts.confirm({
      message,
      default: defaultValue,
    });
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
   * @returns {Object} Object with existingInstall, installedModuleIds, and bmadDir
   */
  async getExistingInstallation(directory) {
    const { Detector } = require('../installers/lib/core/detector');
    const { Installer } = require('../installers/lib/core/installer');
    const detector = new Detector();
    const installer = new Installer();
    const bmadDirResult = await installer.findBmadDir(directory);
    const bmadDir = bmadDirResult.bmadDir;
    const existingInstall = await detector.detect(bmadDir);
    const installedModuleIds = new Set(existingInstall.modules.map((mod) => mod.id));

    return { existingInstall, installedModuleIds, bmadDir };
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
   * @returns {Array} Module choices for prompt
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
            hint: customInfo.description || undefined,
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
          hint: mod.description || undefined,
        });
      }
    }

    // Add separators and modules in correct order
    if (allCustomModules.length > 0) {
      // Add separator for custom content, all custom modules, and official content separator
      moduleChoices.push(
        new choiceUtils.Separator('── Custom Content ──'),
        ...allCustomModules,
        new choiceUtils.Separator('── Official Content ──'),
      );
    }

    // Add official modules (only non-custom ones)
    for (const mod of availableModules) {
      if (!mod.isCustom) {
        moduleChoices.push({
          name: mod.name,
          value: mod.id,
          checked: isNewInstallation ? mod.defaultSelected || false : installedModuleIds.has(mod.id),
          hint: mod.description || undefined,
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
  async selectModules(moduleChoices, defaultSelections = null) {
    // If defaultSelections is provided, use it to override checked state
    // Otherwise preserve the checked state from moduleChoices (set by getModuleChoices)
    const choicesWithDefaults = moduleChoices.map((choice) => ({
      ...choice,
      ...(defaultSelections === null ? {} : { checked: defaultSelections.includes(choice.value) }),
    }));

    // Add a "None" option at the end for users who changed their mind
    const choicesWithSkipOption = [
      ...choicesWithDefaults,
      {
        value: '__NONE__',
        label: '⚠ None / I changed my mind - skip module installation',
        checked: false,
      },
    ];

    const selected = await prompts.multiselect({
      message: `Select modules to install ${chalk.dim('(↑/↓ navigates, SPACE toggles, ENTER to confirm)')}:`,
      choices: choicesWithSkipOption,
      required: true,
    });

    // If user selected both "__NONE__" and other items, honor the "None" choice
    if (selected && selected.includes('__NONE__') && selected.length > 1) {
      console.log();
      console.log(chalk.yellow('⚠️  "None / I changed my mind" was selected, so no modules will be installed.'));
      console.log();
      return [];
    }

    // Filter out the special '__NONE__' value
    return selected ? selected.filter((m) => m !== '__NONE__') : [];
  }

  /**
   * Get external module choices for selection
   * @returns {Array} External module choices for prompt
   */
  async getExternalModuleChoices() {
    const externalManager = new ExternalModuleManager();
    const modules = await externalManager.listAvailable();

    return modules.map((mod) => ({
      name: mod.name,
      value: mod.code, // Use the code (e.g., 'cis') as the value
      checked: mod.defaultSelected || false,
      hint: mod.description || undefined, // Show description as hint
      module: mod, // Store full module info for later use
    }));
  }

  /**
   * Prompt for external module selection
   * @param {Array} externalModuleChoices - Available external module choices
   * @param {Array} defaultSelections - Module codes to pre-select
   * @returns {Array} Selected external module codes
   */
  async selectExternalModules(externalModuleChoices, defaultSelections = []) {
    // Build a message showing available modules
    const availableNames = externalModuleChoices.map((c) => c.name).join(', ');
    const message = `Select official BMad modules to install ${chalk.dim('(↑/↓ navigates, SPACE toggles, ENTER to confirm)')}:`;

    // Mark choices as checked based on defaultSelections
    const choicesWithDefaults = externalModuleChoices.map((choice) => ({
      ...choice,
      checked: defaultSelections.includes(choice.value),
    }));

    // Add a "None" option at the end for users who changed their mind
    const choicesWithSkipOption = [
      ...choicesWithDefaults,
      {
        name: '⚠ None / I changed my mind - skip external module installation',
        value: '__NONE__',
        checked: false,
      },
    ];

    const selected = await prompts.multiselect({
      message,
      choices: choicesWithSkipOption,
      required: true,
    });

    // If user selected both "__NONE__" and other items, honor the "None" choice
    if (selected && selected.includes('__NONE__') && selected.length > 1) {
      console.log();
      console.log(chalk.yellow('⚠️  "None / I changed my mind" was selected, so no external modules will be installed.'));
      console.log();
      return [];
    }

    // Filter out the special '__NONE__' value
    return selected ? selected.filter((m) => m !== '__NONE__') : [];
  }

  /**
   * Select all modules (core + official + community) using grouped multiselect
   * @param {Set} installedModuleIds - Currently installed module IDs
   * @returns {Array} Selected module codes
   */
  async selectAllModules(installedModuleIds = new Set()) {
    const { ModuleManager } = require('../installers/lib/modules/manager');
    const moduleManager = new ModuleManager();
    const { modules: localModules } = await moduleManager.listAvailable();

    // Get external modules
    const externalManager = new ExternalModuleManager();
    const externalModules = await externalManager.listAvailable();

    // Build grouped options
    const groupedOptions = {};
    const initialValues = [];

    // Helper to build module entry with proper sorting and selection
    const buildModuleEntry = (mod, value) => {
      const isInstalled = installedModuleIds.has(value);
      const isDefault = mod.defaultSelected === true;
      return {
        label: mod.description ? `${mod.name} — ${mod.description}` : mod.name,
        value,
        // For sorting: defaultSelected=0, others=1
        sortKey: isDefault ? 0 : 1,
        // Pre-select if default selected OR already installed
        selected: isDefault || isInstalled,
      };
    };

    // Group 1: BMad Core (BMM, BMB)
    const coreModules = [];
    for (const mod of localModules) {
      if (!mod.isCustom && (mod.id === 'bmm' || mod.id === 'bmb')) {
        const entry = buildModuleEntry(mod, mod.id);
        coreModules.push(entry);
        if (entry.selected) {
          initialValues.push(mod.id);
        }
      }
    }
    // Sort: defaultSelected first, then others
    coreModules.sort((a, b) => a.sortKey - b.sortKey);
    // Remove sortKey from final entries
    if (coreModules.length > 0) {
      groupedOptions['BMad Core'] = coreModules.map(({ label, value }) => ({ label, value }));
    }

    // Group 2: BMad Official Modules (type: bmad-org)
    const officialModules = [];
    for (const mod of externalModules) {
      if (mod.type === 'bmad-org') {
        const entry = buildModuleEntry(mod, mod.code);
        officialModules.push(entry);
        if (entry.selected) {
          initialValues.push(mod.code);
        }
      }
    }
    officialModules.sort((a, b) => a.sortKey - b.sortKey);
    if (officialModules.length > 0) {
      groupedOptions['BMad Official Modules'] = officialModules.map(({ label, value }) => ({ label, value }));
    }

    // Group 3: Community Modules (type: community)
    const communityModules = [];
    for (const mod of externalModules) {
      if (mod.type === 'community') {
        const entry = buildModuleEntry(mod, mod.code);
        communityModules.push(entry);
        if (entry.selected) {
          initialValues.push(mod.code);
        }
      }
    }
    communityModules.sort((a, b) => a.sortKey - b.sortKey);
    if (communityModules.length > 0) {
      groupedOptions['Community Modules'] = communityModules.map(({ label, value }) => ({ label, value }));
    }

    // Add "None" option at the end
    groupedOptions[' '] = [
      {
        label: '⚠ None - Skip module installation',
        value: '__NONE__',
      },
    ];

    const selected = await prompts.groupMultiselect({
      message: `Select modules to install ${chalk.dim('(↑/↓ navigates, SPACE toggles, ENTER to confirm)')}:`,
      options: groupedOptions,
      initialValues: initialValues.length > 0 ? initialValues : undefined,
      required: true,
      selectableGroups: false,
    });

    // If user selected both "__NONE__" and other items, honor the "None" choice
    if (selected && selected.includes('__NONE__') && selected.length > 1) {
      console.log();
      console.log(chalk.yellow('⚠️  "None" was selected, so no modules will be installed.'));
      console.log();
      return [];
    }

    // Filter out the special '__NONE__' value
    return selected ? selected.filter((m) => m !== '__NONE__') : [];
  }

  /**
   * Prompt for directory selection
   * @returns {Object} Directory answer from prompt
   */
  async promptForDirectory() {
    // Use sync validation because @clack/prompts doesn't support async validate
    const directory = await prompts.text({
      message: 'Installation directory:',
      default: process.cwd(),
      placeholder: process.cwd(),
      validate: (input) => this.validateDirectorySync(input),
    });

    // Apply filter logic
    let filteredDir = directory;
    if (!filteredDir || filteredDir.trim() === '') {
      filteredDir = process.cwd();
    } else {
      filteredDir = this.expandUserPath(filteredDir);
    }

    return { directory: filteredDir };
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
      const proceed = await prompts.confirm({
        message: 'Install to this directory?',
        default: true,
      });

      if (!proceed) {
        console.log(chalk.yellow("\nLet's try again with a different path.\n"));
      }

      return proceed;
    } else {
      // Ask for confirmation to create the directory
      const create = await prompts.confirm({
        message: `Create directory: ${directory}?`,
        default: false,
      });

      if (!create) {
        console.log(chalk.yellow("\nLet's try again with a different path.\n"));
      }

      return create;
    }
  }

  /**
   * Validate directory path for installation (sync version for clack prompts)
   * @param {string} input - User input path
   * @returns {string|undefined} Error message or undefined if valid
   */
  validateDirectorySync(input) {
    // Allow empty input to use the default
    if (!input || input.trim() === '') {
      return; // Empty means use default, undefined = valid for clack
    }

    let expandedPath;
    try {
      expandedPath = this.expandUserPath(input.trim());
    } catch (error) {
      return error.message;
    }

    // Check if the path exists
    const pathExists = fs.pathExistsSync(expandedPath);

    if (!pathExists) {
      // Find the first existing parent directory
      const existingParent = this.findExistingParentSync(expandedPath);

      if (!existingParent) {
        return 'Cannot create directory: no existing parent directory found';
      }

      // Check if the existing parent is writable
      try {
        fs.accessSync(existingParent, fs.constants.W_OK);
        // Path doesn't exist but can be created - will prompt for confirmation later
        return;
      } catch {
        // Provide a detailed error message explaining both issues
        return `Directory '${expandedPath}' does not exist and cannot be created: parent directory '${existingParent}' is not writable`;
      }
    }

    // If it exists, validate it's a directory and writable
    const stat = fs.statSync(expandedPath);
    if (!stat.isDirectory()) {
      return `Path exists but is not a directory: ${expandedPath}`;
    }

    // Check write permissions
    try {
      fs.accessSync(expandedPath, fs.constants.W_OK);
    } catch {
      return `Directory is not writable: ${expandedPath}`;
    }

    return;
  }

  /**
   * Validate directory path for installation (async version)
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
   * Find the first existing parent directory (sync version)
   * @param {string} targetPath - The path to check
   * @returns {string|null} The first existing parent directory, or null if none found
   */
  findExistingParentSync(targetPath) {
    let currentPath = path.resolve(targetPath);

    // Walk up the directory tree until we find an existing directory
    while (currentPath !== path.dirname(currentPath)) {
      // Stop at root
      const parent = path.dirname(currentPath);
      if (fs.pathExistsSync(parent)) {
        return parent;
      }
      currentPath = parent;
    }

    return null; // No existing parent found (shouldn't happen in practice)
  }

  /**
   * Find the first existing parent directory (async version)
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
   * Load existing configurations to use as defaults
   * @param {string} directory - Installation directory
   * @returns {Object} Existing configurations
   */
  async loadExistingConfigurations(directory) {
    const configs = {
      hasCustomContent: false,
      coreConfig: {},
      ideConfig: { ides: [], skipIde: false },
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
   * Validate custom content path synchronously
   * @param {string} input - User input path
   * @returns {string|undefined} Error message or undefined if valid
   */
  validateCustomContentPathSync(input) {
    // Allow empty input to cancel
    if (!input || input.trim() === '') {
      return; // Allow empty to exit
    }

    try {
      // Expand the path
      const expandedPath = this.expandUserPath(input.trim());

      // Check if path exists
      if (!fs.pathExistsSync(expandedPath)) {
        return 'Path does not exist';
      }

      // Check if it's a directory
      const stat = fs.statSync(expandedPath);
      if (!stat.isDirectory()) {
        return 'Path must be a directory';
      }

      // Check for module.yaml in the root
      const moduleYamlPath = path.join(expandedPath, 'module.yaml');
      if (!fs.pathExistsSync(moduleYamlPath)) {
        return 'Directory must contain a module.yaml file in the root';
      }

      // Try to parse the module.yaml to get the module ID
      try {
        const yaml = require('yaml');
        const content = fs.readFileSync(moduleYamlPath, 'utf8');
        const moduleData = yaml.parse(content);
        if (!moduleData.code) {
          return 'module.yaml must contain a "code" field for the module ID';
        }
      } catch (error) {
        return 'Invalid module.yaml file: ' + error.message;
      }

      return; // Valid
    } catch (error) {
      return 'Error validating path: ' + error.message;
    }
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
        const action = await prompts.select({
          message: 'Would you like to:',
          choices: [
            { name: 'Add another custom module', value: 'add' },
            { name: 'Continue with installation', value: 'continue' },
          ],
          default: 'continue',
        });

        if (action === 'continue') {
          break;
        }
      }

      let sourcePath;
      let isValid = false;

      while (!isValid) {
        // Use sync validation because @clack/prompts doesn't support async validate
        const inputPath = await prompts.text({
          message: 'Path to custom module folder (press Enter to skip):',
          validate: (input) => this.validateCustomContentPathSync(input),
        });

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
    const shouldInstall = await prompts.confirm({
      message: `Install these ${customContentConfig.sources.length} custom modules?`,
      default: true,
    });

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

    const customAction = await prompts.select({
      message: cachedCustomModules.length > 0 ? 'Manage custom modules?' : 'Add custom modules?',
      choices: choices,
      default: cachedCustomModules.length > 0 ? 'keep' : 'add',
    });

    switch (customAction) {
      case 'keep': {
        // Keep all existing custom modules
        result.selectedCustomModules = cachedCustomModules.map((m) => m.id);
        console.log(chalk.dim(`Keeping ${result.selectedCustomModules.length} custom module(s)`));
        break;
      }

      case 'select': {
        // Let user choose which to keep
        const selectChoices = cachedCustomModules.map((m) => ({
          name: `${m.name} ${chalk.gray(`(${m.id})`)}`,
          value: m.id,
          checked: m.checked,
        }));

        // Add "None / I changed my mind" option at the end
        const choicesWithSkip = [
          ...selectChoices,
          {
            name: '⚠ None / I changed my mind - keep no custom modules',
            value: '__NONE__',
            checked: false,
          },
        ];

        const keepModules = await prompts.multiselect({
          message: `Select custom modules to keep ${chalk.dim('(↑/↓ navigates, SPACE toggles, ENTER to confirm)')}:`,
          choices: choicesWithSkip,
          required: true,
        });

        // If user selected both "__NONE__" and other modules, honor the "None" choice
        if (keepModules && keepModules.includes('__NONE__') && keepModules.length > 1) {
          console.log();
          console.log(chalk.yellow('⚠️  "None / I changed my mind" was selected, so no custom modules will be kept.'));
          console.log();
          result.selectedCustomModules = [];
        } else {
          // Filter out the special '__NONE__' value
          result.selectedCustomModules = keepModules ? keepModules.filter((m) => m !== '__NONE__') : [];
        }
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

  /**
   * Parse alpha version string (e.g., "6.0.0-Alpha.20")
   * @param {string} version - Version string
   * @returns {Object|null} Object with alphaNumber and fullVersion, or null if invalid
   */
  parseAlphaVersion(version) {
    if (!version || version === 'unknown') {
      return null;
    }

    // Remove 'v' prefix if present
    const cleanVersion = version.toString().replace(/^v/i, '');

    // Match alpha version pattern: X.Y.Z-Alpha.N (case-insensitive)
    const match = cleanVersion.match(/[\d.]+-Alpha\.(\d+)/i);

    if (!match) {
      return null;
    }

    return {
      alphaNumber: parseInt(match[1], 10),
      fullVersion: cleanVersion,
    };
  }

  /**
   * Check if installed version is more than 2 alpha versions behind current
   * @param {string} installedVersion - The installed version
   * @param {string} currentVersion - The current version
   * @returns {Object} Object with { isOldVersion, versionDiff, shouldWarn, installed, current }
   */
  checkAlphaVersionAge(installedVersion, currentVersion) {
    const installed = this.parseAlphaVersion(installedVersion);
    const current = this.parseAlphaVersion(currentVersion);

    // If we can't parse either version, don't warn
    if (!installed || !current) {
      return { isOldVersion: false, versionDiff: 0, shouldWarn: false };
    }

    // Calculate alpha version difference
    const versionDiff = current.alphaNumber - installed.alphaNumber;

    // Consider it old if more than 2 versions behind
    const isOldVersion = versionDiff > 2;

    return {
      isOldVersion,
      versionDiff,
      shouldWarn: isOldVersion,
      installed: installed.fullVersion,
      current: current.fullVersion,
      installedAlpha: installed.alphaNumber,
      currentAlpha: current.alphaNumber,
    };
  }

  /**
   * Show warning for old alpha version and ask if user wants to proceed
   * @param {string} installedVersion - The installed version
   * @param {string} currentVersion - The current version
   * @param {string} bmadFolderName - Name of the BMAD folder
   * @returns {Promise<boolean>} True if user wants to proceed, false if they cancel
   */
  async showOldAlphaVersionWarning(installedVersion, currentVersion, bmadFolderName) {
    const versionInfo = this.checkAlphaVersionAge(installedVersion, currentVersion);

    // Also warn if version is unknown or can't be parsed (legacy/unsupported)
    const isUnknownVersion = installedVersion === 'unknown' || !versionInfo.installed;

    if (!versionInfo.shouldWarn && !isUnknownVersion) {
      return true; // Not old, proceed
    }

    console.log('');
    console.log(chalk.yellow.bold('⚠️  VERSION WARNING'));
    console.log(chalk.yellow('─'.repeat(80)));

    if (isUnknownVersion) {
      console.log(chalk.yellow('Unable to detect your installed BMAD version.'));
      console.log(chalk.yellow('This appears to be a legacy or unsupported installation.'));
      console.log('');
      console.log(chalk.dim('For stability, we only support updates from the previous 2 alpha versions.'));
      console.log(chalk.dim('Legacy installations may have compatibility issues.'));
    } else {
      console.log(chalk.yellow(`You are updating from ${versionInfo.installed} to ${versionInfo.current}.`));
      console.log(chalk.yellow(`This is ${versionInfo.versionDiff} alpha versions behind.`));
      console.log('');
      console.log(chalk.dim(`For stability, we only support updates from the previous 2 alpha versions`));
      console.log(chalk.dim(`(Alpha.${versionInfo.currentAlpha - 2} through Alpha.${versionInfo.currentAlpha - 1}).`));
    }

    console.log('');
    console.log(chalk.dim('For the best experience, we recommend:'));
    console.log(chalk.dim('  1. Delete your current BMAD installation folder'));
    console.log(chalk.dim(`     (the "${bmadFolderName}/" folder in your project)`));
    console.log(chalk.dim('  2. Run a fresh installation'));
    console.log('');
    console.log(chalk.dim('Benefits of a fresh install:'));
    console.log(chalk.dim('  • Cleaner configuration without legacy artifacts'));
    console.log(chalk.dim('  • All new features properly configured'));
    console.log(chalk.dim('  • Fewer potential conflicts'));
    console.log(chalk.yellow('─'.repeat(80)));
    console.log('');

    const proceed = await prompts.select({
      message: 'How would you like to proceed?',
      choices: [
        {
          name: 'Proceed with update anyway (may have issues)',
          value: 'proceed',
        },
        {
          name: 'Cancel (recommended - do a fresh install instead)',
          value: 'cancel',
        },
      ],
      default: 'cancel',
    });

    if (proceed === 'cancel') {
      console.log('');
      console.log(chalk.cyan('To do a fresh install:'));
      console.log(chalk.dim(`  1. Delete the "${bmadFolderName}/" folder in your project`));
      console.log(chalk.dim("  2. Run 'bmad install' again"));
      console.log('');
    }

    return proceed === 'proceed';
  }

  /**
   * Display module versions with update availability
   * @param {Array} modules - Array of module info objects with version info
   * @param {Array} availableUpdates - Array of available updates
   */
  displayModuleVersions(modules, availableUpdates = []) {
    console.log('');
    console.log(chalk.cyan.bold('📦 Module Versions'));
    console.log(chalk.gray('─'.repeat(80)));

    // Group modules by source
    const builtIn = modules.filter((m) => m.source === 'built-in');
    const external = modules.filter((m) => m.source === 'external');
    const custom = modules.filter((m) => m.source === 'custom');
    const unknown = modules.filter((m) => m.source === 'unknown');

    const displayGroup = (group, title) => {
      if (group.length === 0) return;

      console.log(chalk.yellow(`\n${title}`));
      for (const module of group) {
        const updateInfo = availableUpdates.find((u) => u.name === module.name);
        const versionDisplay = module.version || chalk.gray('unknown');

        if (updateInfo) {
          console.log(
            `  ${chalk.cyan(module.name.padEnd(20))} ${versionDisplay} → ${chalk.green(updateInfo.latestVersion)} ${chalk.green('↑')}`,
          );
        } else {
          console.log(`  ${chalk.cyan(module.name.padEnd(20))} ${versionDisplay} ${chalk.gray('✓')}`);
        }
      }
    };

    displayGroup(builtIn, 'Built-in Modules');
    displayGroup(external, 'External Modules (Official)');
    displayGroup(custom, 'Custom Modules');
    displayGroup(unknown, 'Other Modules');

    console.log('');
  }

  /**
   * Prompt user to select which modules to update
   * @param {Array} availableUpdates - Array of available updates
   * @returns {Array} Selected module names to update
   */
  async promptUpdateSelection(availableUpdates) {
    if (availableUpdates.length === 0) {
      return [];
    }

    console.log('');
    console.log(chalk.cyan.bold('🔄 Available Updates'));
    console.log(chalk.gray('─'.repeat(80)));

    const choices = availableUpdates.map((update) => ({
      name: `${update.name} ${chalk.dim(`(v${update.installedVersion} → v${update.latestVersion})`)}`,
      value: update.name,
      checked: true, // Default to selecting all updates
    }));

    // Add "Update All" and "Cancel" options
    const action = await prompts.select({
      message: 'How would you like to proceed?',
      choices: [
        { name: 'Update all available modules', value: 'all' },
        { name: 'Select specific modules to update', value: 'select' },
        { name: 'Skip updates for now', value: 'skip' },
      ],
      default: 'all',
    });

    if (action === 'all') {
      return availableUpdates.map((u) => u.name);
    }

    if (action === 'skip') {
      return [];
    }

    // Allow specific selection
    const selected = await prompts.multiselect({
      message: `Select modules to update ${chalk.dim('(↑/↓ navigates, SPACE toggles, ENTER to confirm)')}:`,
      choices: choices,
      required: true,
    });

    return selected || [];
  }

  /**
   * Display status of all installed modules
   * @param {Object} statusData - Status data with modules, installation info, and available updates
   */
  displayStatus(statusData) {
    const { installation, modules, availableUpdates, bmadDir } = statusData;

    console.log('');
    console.log(chalk.cyan.bold('📋 BMAD Status'));
    console.log(chalk.gray('─'.repeat(80)));

    // Installation info
    console.log(chalk.yellow('\nInstallation'));
    console.log(`  ${chalk.gray('Version:'.padEnd(20))} ${installation.version || chalk.gray('unknown')}`);
    console.log(`  ${chalk.gray('Location:'.padEnd(20))} ${bmadDir}`);
    console.log(`  ${chalk.gray('Installed:'.padEnd(20))} ${new Date(installation.installDate).toLocaleDateString()}`);
    console.log(
      `  ${chalk.gray('Last Updated:'.padEnd(20))} ${installation.lastUpdated ? new Date(installation.lastUpdated).toLocaleDateString() : chalk.gray('unknown')}`,
    );

    // Module versions
    this.displayModuleVersions(modules, availableUpdates);

    // Update summary
    if (availableUpdates.length > 0) {
      console.log(chalk.yellow.bold(`\n⚠️  ${availableUpdates.length} update(s) available`));
      console.log(chalk.dim(`  Run 'bmad install' and select "Quick Update" to update`));
    } else {
      console.log(chalk.green.bold('\n✓ All modules are up to date'));
    }

    console.log('');
  }
}

module.exports = { UI };
