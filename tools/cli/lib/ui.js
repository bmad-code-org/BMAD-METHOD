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
   * @param {Object} options - Command-line options from install command
   * @returns {Object} Installation configuration
   */
  async promptInstall(options = {}) {
    await CLIUtils.displayLogo();

    // Display version-specific start message from install-messages.yaml
    const { MessageLoader } = require('../installers/lib/message-loader');
    const messageLoader = new MessageLoader();
    await messageLoader.displayStartMessage();

    // Get directory from options or prompt
    let confirmedDirectory;
    if (options.directory) {
      // Use provided directory from command-line
      const expandedDir = this.expandUserPath(options.directory);
      const validation = this.validateDirectorySync(expandedDir);
      if (validation) {
        throw new Error(`Invalid directory: ${validation}`);
      }
      confirmedDirectory = expandedDir;
      await prompts.log.info(`Using directory from command-line: ${confirmedDirectory}`);
    } else {
      confirmedDirectory = await this.getConfirmedDirectory();
    }

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
          legacyBmadPath = path.join(confirmedDirectory, entry.name);
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

    // Handle legacy .bmad or _cfg folder - these are very old (v4 or alpha)
    // Show version warning instead of offering conversion
    if (hasLegacyBmadFolder || hasLegacyCfg) {
      await prompts.log.warn('LEGACY INSTALLATION DETECTED');
      await prompts.note(
        'Found a ".bmad"/"bmad" folder, or a legacy "_cfg" folder under the bmad folder -\n' +
          'this is from an old BMAD version that is out of date for automatic upgrade,\n' +
          'manual intervention required.\n\n' +
          'You have a legacy version installed (v4 or alpha).\n' +
          'Legacy installations may have compatibility issues.\n\n' +
          'For the best experience, we strongly recommend:\n' +
          '  1. Delete your current BMAD installation folder (.bmad or bmad)\n' +
          '  2. Run a fresh installation\n\n' +
          'If you do not want to start fresh, you can attempt to proceed beyond this\n' +
          'point IF you have ensured the bmad folder is named _bmad, and under it there\n' +
          'is a _config folder. If you have a folder under your bmad folder named _cfg,\n' +
          'you would need to rename it _config, and then restart the installer.\n\n' +
          'Benefits of a fresh install:\n' +
          '  \u2022 Cleaner configuration without legacy artifacts\n' +
          '  \u2022 All new features properly configured\n' +
          '  \u2022 Fewer potential conflicts\n\n' +
          'If you have already produced output from an earlier alpha version, you can\n' +
          'still retain those artifacts. After installation, ensure you configured during\n' +
          'install the proper file locations for artifacts depending on the module you\n' +
          'are using, or move the files to the proper locations.',
        'Legacy Installation Detected',
      );

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
        await prompts.note('1. Delete the existing bmad folder in your project\n' + "2. Run 'bmad install' again", 'To do a fresh install');
        process.exit(0);
        return;
      }

      const s = await prompts.spinner();
      s.start('Updating folder structure...');
      try {
        // Handle .bmad folder
        if (hasLegacyBmadFolder) {
          const newBmadPath = path.join(confirmedDirectory, '_bmad');
          await fs.move(legacyBmadPath, newBmadPath);
          bmadDir = newBmadPath;
          s.stop(`Renamed "${path.basename(legacyBmadPath)}" to "_bmad"`);
        }

        // Handle _cfg folder (either from .bmad or standalone)
        const cfgPath = path.join(bmadDir, '_cfg');
        if (await fs.pathExists(cfgPath)) {
          s.start('Renaming configuration folder...');
          const newCfgPath = path.join(bmadDir, '_config');
          await fs.move(cfgPath, newCfgPath);
          s.stop('Renamed "_cfg" to "_config"');
        }
      } catch (error) {
        s.stop('Failed to update folder structure');
        await prompts.log.error(`Error: ${error.message}`);
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

      // Check if version is pre beta
      const shouldProceed = await this.showLegacyVersionWarning(installedVersion, currentVersion, path.basename(bmadDir), options);

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

      // Check if action is provided via command-line
      if (options.action) {
        const validActions = choices.map((c) => c.value);
        if (!validActions.includes(options.action)) {
          throw new Error(`Invalid action: ${options.action}. Valid actions: ${validActions.join(', ')}`);
        }
        actionType = options.action;
        await prompts.log.info(`Using action from command-line: ${actionType}`);
      } else if (options.yes) {
        // Default to quick-update if available, otherwise first available choice
        if (choices.length === 0) {
          throw new Error('No valid actions available for this installation');
        }
        const hasQuickUpdate = choices.some((c) => c.value === 'quick-update');
        actionType = hasQuickUpdate ? 'quick-update' : choices[0].value;
        await prompts.log.info(`Non-interactive mode (--yes): defaulting to ${actionType}`);
      } else {
        actionType = await prompts.select({
          message: 'How would you like to proceed?',
          choices: choices,
          default: choices[0].value,
        });
      }

      // Handle quick update separately
      if (actionType === 'quick-update') {
        // Quick update doesn't install custom content - just updates existing modules
        return {
          actionType: 'quick-update',
          directory: confirmedDirectory,
          customContent: { hasCustomContent: false },
          skipPrompts: options.yes || false,
        };
      }

      // Handle compile agents separately
      if (actionType === 'compile-agents') {
        // Only recompile agents with customizations, don't update any files
        return {
          actionType: 'compile-agents',
          directory: confirmedDirectory,
          customContent: { hasCustomContent: false },
          skipPrompts: options.yes || false,
        };
      }

      // If actionType === 'update', handle it with the new flow
      // Return early with modify configuration
      if (actionType === 'update') {
        // Get existing installation info
        const { installedModuleIds } = await this.getExistingInstallation(confirmedDirectory);

        await prompts.log.message(`Found existing modules: ${[...installedModuleIds].join(', ')}`);

        // Unified module selection - all modules in one grouped multiselect
        let selectedModules;
        if (options.modules) {
          // Use modules from command-line
          selectedModules = options.modules
            .split(',')
            .map((m) => m.trim())
            .filter(Boolean);
          await prompts.log.info(`Using modules from command-line: ${selectedModules.join(', ')}`);
        } else if (options.yes) {
          selectedModules = await this.getDefaultModules(installedModuleIds);
          await prompts.log.info(
            `Non-interactive mode (--yes): using default modules (installed + defaults): ${selectedModules.join(', ')}`,
          );
        } else {
          selectedModules = await this.selectAllModules(installedModuleIds);
        }

        // After module selection, ask about custom modules
        let customModuleResult = { selectedCustomModules: [], customContentConfig: { hasCustomContent: false } };

        if (options.customContent) {
          // Use custom content from command-line
          const paths = options.customContent
            .split(',')
            .map((p) => p.trim())
            .filter(Boolean);
          await prompts.log.info(`Using custom content from command-line: ${paths.join(', ')}`);

          // Build custom content config similar to promptCustomContentSource
          const customPaths = [];
          const selectedModuleIds = [];

          for (const customPath of paths) {
            const expandedPath = this.expandUserPath(customPath);
            const validation = this.validateCustomContentPathSync(expandedPath);
            if (validation) {
              await prompts.log.warn(`Skipping invalid custom content path: ${customPath} - ${validation}`);
              continue;
            }

            // Read module metadata
            let moduleMeta;
            try {
              const moduleYamlPath = path.join(expandedPath, 'module.yaml');
              const moduleYaml = await fs.readFile(moduleYamlPath, 'utf-8');
              const yaml = require('yaml');
              moduleMeta = yaml.parse(moduleYaml);
            } catch (error) {
              await prompts.log.warn(`Skipping custom content path: ${customPath} - failed to read module.yaml: ${error.message}`);
              continue;
            }

            if (!moduleMeta.code) {
              await prompts.log.warn(`Skipping custom content path: ${customPath} - module.yaml missing 'code' field`);
              continue;
            }

            customPaths.push(expandedPath);
            selectedModuleIds.push(moduleMeta.code);
          }

          if (customPaths.length > 0) {
            customModuleResult = {
              selectedCustomModules: selectedModuleIds,
              customContentConfig: {
                hasCustomContent: true,
                paths: customPaths,
                selectedModuleIds: selectedModuleIds,
              },
            };
          }
        } else if (options.yes) {
          // Non-interactive mode: preserve existing custom modules (matches default: false)
          const cacheDir = path.join(bmadDir, '_config', 'custom');
          if (await fs.pathExists(cacheDir)) {
            const entries = await fs.readdir(cacheDir, { withFileTypes: true });
            for (const entry of entries) {
              if (entry.isDirectory()) {
                customModuleResult.selectedCustomModules.push(entry.name);
              }
            }
            await prompts.log.info(
              `Non-interactive mode (--yes): preserving ${customModuleResult.selectedCustomModules.length} existing custom module(s)`,
            );
          } else {
            await prompts.log.info('Non-interactive mode (--yes): no existing custom modules found');
          }
        } else {
          const changeCustomModules = await prompts.confirm({
            message: 'Modify custom modules, agents, or workflows?',
            default: false,
          });

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
        }

        // Merge any selected custom modules
        if (customModuleResult.selectedCustomModules.length > 0) {
          selectedModules.push(...customModuleResult.selectedCustomModules);
        }

        // Filter out core - it's always installed via installCore flag
        selectedModules = selectedModules.filter((m) => m !== 'core');

        // Get tool selection
        const toolSelection = await this.promptToolSelection(confirmedDirectory, options);

        const coreConfig = await this.collectCoreConfig(confirmedDirectory, options);

        return {
          actionType: 'update',
          directory: confirmedDirectory,
          installCore: true,
          modules: selectedModules,
          ides: toolSelection.ides,
          skipIde: toolSelection.skipIde,
          coreConfig: coreConfig,
          customContent: customModuleResult.customContentConfig,
          skipPrompts: options.yes || false,
        };
      }
    }

    // This section is only for new installations (update returns early above)
    const { installedModuleIds } = await this.getExistingInstallation(confirmedDirectory);

    // Unified module selection - all modules in one grouped multiselect
    let selectedModules;
    if (options.modules) {
      // Use modules from command-line
      selectedModules = options.modules
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);
      await prompts.log.info(`Using modules from command-line: ${selectedModules.join(', ')}`);
    } else if (options.yes) {
      // Use default modules when --yes flag is set
      selectedModules = await this.getDefaultModules(installedModuleIds);
      await prompts.log.info(`Using default modules (--yes flag): ${selectedModules.join(', ')}`);
    } else {
      selectedModules = await this.selectAllModules(installedModuleIds);
    }

    // Ask about custom content (local modules/agents/workflows)
    if (options.customContent) {
      // Use custom content from command-line
      const paths = options.customContent
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      await prompts.log.info(`Using custom content from command-line: ${paths.join(', ')}`);

      // Build custom content config similar to promptCustomContentSource
      const customPaths = [];
      const selectedModuleIds = [];

      for (const customPath of paths) {
        const expandedPath = this.expandUserPath(customPath);
        const validation = this.validateCustomContentPathSync(expandedPath);
        if (validation) {
          await prompts.log.warn(`Skipping invalid custom content path: ${customPath} - ${validation}`);
          continue;
        }

        // Read module metadata
        let moduleMeta;
        try {
          const moduleYamlPath = path.join(expandedPath, 'module.yaml');
          const moduleYaml = await fs.readFile(moduleYamlPath, 'utf-8');
          const yaml = require('yaml');
          moduleMeta = yaml.parse(moduleYaml);
        } catch (error) {
          await prompts.log.warn(`Skipping custom content path: ${customPath} - failed to read module.yaml: ${error.message}`);
          continue;
        }

        if (!moduleMeta.code) {
          await prompts.log.warn(`Skipping custom content path: ${customPath} - module.yaml missing 'code' field`);
          continue;
        }

        customPaths.push(expandedPath);
        selectedModuleIds.push(moduleMeta.code);
      }

      if (customPaths.length > 0) {
        customContentConfig = {
          hasCustomContent: true,
          paths: customPaths,
          selectedModuleIds: selectedModuleIds,
        };
      }
    } else if (!options.yes) {
      const wantsCustomContent = await prompts.confirm({
        message: 'Add custom modules, agents, or workflows from your computer?',
        default: false,
      });

      if (wantsCustomContent) {
        customContentConfig = await this.promptCustomContentSource();
      }
    }

    // Add custom content modules if any were selected
    if (customContentConfig && customContentConfig.selectedModuleIds) {
      selectedModules.push(...customContentConfig.selectedModuleIds);
    }

    selectedModules = selectedModules.filter((m) => m !== 'core');
    let toolSelection = await this.promptToolSelection(confirmedDirectory, options);
    const coreConfig = await this.collectCoreConfig(confirmedDirectory, options);

    return {
      actionType: 'install',
      directory: confirmedDirectory,
      installCore: true,
      modules: selectedModules,
      ides: toolSelection.ides,
      skipIde: toolSelection.skipIde,
      coreConfig: coreConfig,
      customContent: customContentConfig,
      skipPrompts: options.yes || false,
    };
  }

  /**
   * Prompt for tool/IDE selection (called after module configuration)
   * Uses a split prompt approach:
   *   1. Recommended tools - standard multiselect for 3 preferred tools
   *   2. Additional tools - autocompleteMultiselect with search capability
   * @param {string} projectDir - Project directory to check for existing IDEs
   * @param {Object} options - Command-line options
   * @returns {Object} Tool configuration
   */
  async promptToolSelection(projectDir, options = {}) {
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
    await ideManager.ensureInitialized(); // IMPORTANT: Must initialize before getting IDEs

    const preferredIdes = ideManager.getPreferredIdes();
    const otherIdes = ideManager.getOtherIdes();

    // Determine which configured IDEs are in "preferred" vs "other" categories
    const configuredPreferred = configuredIdes.filter((id) => preferredIdes.some((ide) => ide.value === id));
    const configuredOther = configuredIdes.filter((id) => otherIdes.some((ide) => ide.value === id));

    // Warn about previously configured tools that are no longer available
    const allKnownValues = new Set([...preferredIdes, ...otherIdes].map((ide) => ide.value));
    const unknownTools = configuredIdes.filter((id) => id && typeof id === 'string' && !allKnownValues.has(id));
    if (unknownTools.length > 0) {
      await prompts.log.warn(`Previously configured tools are no longer available: ${unknownTools.join(', ')}`);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UPGRADE PATH: If tools already configured, show all tools with configured at top
    // ─────────────────────────────────────────────────────────────────────────────
    if (configuredIdes.length > 0) {
      const allTools = [...preferredIdes, ...otherIdes];

      // Non-interactive: handle --tools and --yes flags before interactive prompt
      if (options.tools) {
        if (options.tools.toLowerCase() === 'none') {
          await prompts.log.info('Skipping tool configuration (--tools none)');
          return { ides: [], skipIde: true };
        }
        const selectedIdes = options.tools
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
        await prompts.log.info(`Using tools from command-line: ${selectedIdes.join(', ')}`);
        await this.displaySelectedTools(selectedIdes, preferredIdes, allTools);
        return { ides: selectedIdes, skipIde: false };
      }

      if (options.yes) {
        await prompts.log.info(`Non-interactive mode (--yes): keeping configured tools: ${configuredIdes.join(', ')}`);
        await this.displaySelectedTools(configuredIdes, preferredIdes, allTools);
        return { ides: configuredIdes, skipIde: false };
      }

      // Sort: configured tools first, then preferred, then others
      const sortedTools = [
        ...allTools.filter((ide) => configuredIdes.includes(ide.value)),
        ...allTools.filter((ide) => !configuredIdes.includes(ide.value)),
      ];

      const upgradeOptions = sortedTools.map((ide) => {
        const isConfigured = configuredIdes.includes(ide.value);
        const isPreferred = preferredIdes.some((p) => p.value === ide.value);
        let label = ide.name;
        if (isPreferred) label += ' ⭐';
        if (isConfigured) label += ' ✅';
        return { label, value: ide.value };
      });

      // Sort initialValues to match display order
      const sortedInitialValues = sortedTools.filter((ide) => configuredIdes.includes(ide.value)).map((ide) => ide.value);

      const upgradeSelected = await prompts.autocompleteMultiselect({
        message: 'Integrate with',
        options: upgradeOptions,
        initialValues: sortedInitialValues,
        required: false,
        maxItems: 8,
      });

      const selectedIdes = upgradeSelected || [];

      if (selectedIdes.length === 0) {
        const confirmNoTools = await prompts.confirm({
          message: 'No tools selected. Continue without installing any tools?',
          default: false,
        });

        if (!confirmNoTools) {
          return this.promptToolSelection(projectDir, options);
        }

        return { ides: [], skipIde: true };
      }

      // Display selected tools
      await this.displaySelectedTools(selectedIdes, preferredIdes, allTools);

      return { ides: selectedIdes, skipIde: false };
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // NEW INSTALL: Show all tools with search
    // ─────────────────────────────────────────────────────────────────────────────
    const allTools = [...preferredIdes, ...otherIdes];

    const allToolOptions = allTools.map((ide) => {
      const isPreferred = preferredIdes.some((p) => p.value === ide.value);
      let label = ide.name;
      if (isPreferred) label += ' ⭐';
      return {
        label,
        value: ide.value,
      };
    });

    let selectedIdes = [];

    // Check if tools are provided via command-line
    if (options.tools) {
      // Check for explicit "none" value to skip tool installation
      if (options.tools.toLowerCase() === 'none') {
        await prompts.log.info('Skipping tool configuration (--tools none)');
        return { ides: [], skipIde: true };
      } else {
        selectedIdes = options.tools
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
        await prompts.log.info(`Using tools from command-line: ${selectedIdes.join(', ')}`);
        await this.displaySelectedTools(selectedIdes, preferredIdes, allTools);
        return { ides: selectedIdes, skipIde: false };
      }
    } else if (options.yes) {
      // If --yes flag is set, skip tool prompt and use previously configured tools or empty
      if (configuredIdes.length > 0) {
        await prompts.log.info(`Using previously configured tools (--yes flag): ${configuredIdes.join(', ')}`);
        await this.displaySelectedTools(configuredIdes, preferredIdes, allTools);
        return { ides: configuredIdes, skipIde: false };
      } else {
        await prompts.log.info('Skipping tool configuration (--yes flag, no previous tools)');
        return { ides: [], skipIde: true };
      }
    }

    // Interactive mode
    const interactiveSelectedIdes = await prompts.autocompleteMultiselect({
      message: 'Integrate with:',
      options: allToolOptions,
      initialValues: configuredIdes.length > 0 ? configuredIdes : undefined,
      required: false,
      maxItems: 8,
    });

    selectedIdes = interactiveSelectedIdes || [];

    // ─────────────────────────────────────────────────────────────────────────────
    // STEP 3: Confirm if no tools selected
    // ─────────────────────────────────────────────────────────────────────────────
    if (selectedIdes.length === 0) {
      const confirmNoTools = await prompts.confirm({
        message: 'No tools selected. Continue without installing any tools?',
        default: false,
      });

      if (!confirmNoTools) {
        // User wants to select tools - recurse
        return this.promptToolSelection(projectDir, options);
      }

      return {
        ides: [],
        skipIde: true,
      };
    }

    // Display selected tools
    await this.displaySelectedTools(selectedIdes, preferredIdes, allTools);

    return {
      ides: selectedIdes,
      skipIde: selectedIdes.length === 0,
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
   * @param {Object} options - Command-line options
   * @returns {Object} Core configuration
   */
  async collectCoreConfig(directory, options = {}) {
    const { ConfigCollector } = require('../installers/lib/core/config-collector');
    const configCollector = new ConfigCollector();

    // If options are provided, set them directly
    if (options.userName || options.communicationLanguage || options.documentOutputLanguage || options.outputFolder) {
      const coreConfig = {};
      if (options.userName) {
        coreConfig.user_name = options.userName;
        await prompts.log.info(`Using user name from command-line: ${options.userName}`);
      }
      if (options.communicationLanguage) {
        coreConfig.communication_language = options.communicationLanguage;
        await prompts.log.info(`Using communication language from command-line: ${options.communicationLanguage}`);
      }
      if (options.documentOutputLanguage) {
        coreConfig.document_output_language = options.documentOutputLanguage;
        await prompts.log.info(`Using document output language from command-line: ${options.documentOutputLanguage}`);
      }
      if (options.outputFolder) {
        coreConfig.output_folder = options.outputFolder;
        await prompts.log.info(`Using output folder from command-line: ${options.outputFolder}`);
      }

      // Load existing config to merge with provided options
      await configCollector.loadExistingConfig(directory);

      // Merge provided options with existing config (or defaults)
      const existingConfig = configCollector.collectedConfig.core || {};
      configCollector.collectedConfig.core = { ...existingConfig, ...coreConfig };

      // If not all options are provided, collect the missing ones interactively (unless --yes flag)
      if (
        !options.yes &&
        (!options.userName || !options.communicationLanguage || !options.documentOutputLanguage || !options.outputFolder)
      ) {
        await configCollector.collectModuleConfig('core', directory, false, true);
      }
    } else if (options.yes) {
      // Use all defaults when --yes flag is set
      await configCollector.loadExistingConfig(directory);
      const existingConfig = configCollector.collectedConfig.core || {};

      // If no existing config, use defaults
      if (Object.keys(existingConfig).length === 0) {
        let safeUsername;
        try {
          safeUsername = os.userInfo().username;
        } catch {
          safeUsername = process.env.USER || process.env.USERNAME || 'User';
        }
        const defaultUsername = safeUsername.charAt(0).toUpperCase() + safeUsername.slice(1);
        configCollector.collectedConfig.core = {
          user_name: defaultUsername,
          communication_language: 'English',
          document_output_language: 'English',
          output_folder: '_bmad-output',
        };
        await prompts.log.info('Using default configuration (--yes flag)');
      }
    } else {
      // Load existing configs first if they exist
      await configCollector.loadExistingConfig(directory);
      // Now collect with existing values as defaults (false = don't skip loading, true = skip completion message)
      await configCollector.collectModuleConfig('core', directory, false, true);
    }

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
    const color = await prompts.getColor();
    const moduleChoices = [];
    const isNewInstallation = installedModuleIds.size === 0;

    const customContentItems = [];

    // Add custom content items
    if (customContentConfig && customContentConfig.hasCustomContent && customContentConfig.customPath) {
      // Existing installation - show from directory
      const customHandler = new CustomHandler();
      const customFiles = await customHandler.findCustomContent(customContentConfig.customPath);

      for (const customFile of customFiles) {
        const customInfo = await customHandler.getCustomInfo(customFile);
        if (customInfo) {
          customContentItems.push({
            name: `${color.cyan('\u2713')} ${customInfo.name} ${color.dim(`(${customInfo.relativePath})`)}`,
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
          name: `${color.cyan('\u2713')} ${mod.name} ${color.dim('(cached)')}`,
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
   * Select all modules (official + community) using grouped multiselect.
   * Core is shown as locked but filtered from the result since it's always installed separately.
   * @param {Set} installedModuleIds - Currently installed module IDs
   * @returns {Array} Selected module codes (excluding core)
   */
  async selectAllModules(installedModuleIds = new Set()) {
    const { ModuleManager } = require('../installers/lib/modules/manager');
    const moduleManager = new ModuleManager();
    const { modules: localModules } = await moduleManager.listAvailable();

    // Get external modules
    const externalManager = new ExternalModuleManager();
    const externalModules = await externalManager.listAvailable();

    // Build flat options list with group hints for autocompleteMultiselect
    const allOptions = [];
    const initialValues = [];
    const lockedValues = ['core'];

    // Core module is always installed — show it locked at the top
    allOptions.push({ label: 'BMad Core Module', value: 'core', hint: 'Core configuration and shared resources' });
    initialValues.push('core');

    // Helper to build module entry with proper sorting and selection
    const buildModuleEntry = (mod, value, group) => {
      const isInstalled = installedModuleIds.has(value);
      return {
        label: mod.name,
        value,
        hint: mod.description || group,
        // Pre-select only if already installed (not on fresh install)
        selected: isInstalled,
      };
    };

    // Local modules (BMM, BMB, etc.)
    const localEntries = [];
    for (const mod of localModules) {
      if (!mod.isCustom && mod.id !== 'core') {
        const entry = buildModuleEntry(mod, mod.id, 'Local');
        localEntries.push(entry);
        if (entry.selected) {
          initialValues.push(mod.id);
        }
      }
    }
    allOptions.push(...localEntries.map(({ label, value, hint }) => ({ label, value, hint })));

    // Group 2: BMad Official Modules (type: bmad-org)
    const officialModules = [];
    for (const mod of externalModules) {
      if (mod.type === 'bmad-org') {
        const entry = buildModuleEntry(mod, mod.code, 'Official');
        officialModules.push(entry);
        if (entry.selected) {
          initialValues.push(mod.code);
        }
      }
    }
    allOptions.push(...officialModules.map(({ label, value, hint }) => ({ label, value, hint })));

    // Group 3: Community Modules (type: community)
    const communityModules = [];
    for (const mod of externalModules) {
      if (mod.type === 'community') {
        const entry = buildModuleEntry(mod, mod.code, 'Community');
        communityModules.push(entry);
        if (entry.selected) {
          initialValues.push(mod.code);
        }
      }
    }
    allOptions.push(...communityModules.map(({ label, value, hint }) => ({ label, value, hint })));

    const selected = await prompts.autocompleteMultiselect({
      message: 'Select modules to install:',
      options: allOptions,
      initialValues: initialValues.length > 0 ? initialValues : undefined,
      lockedValues,
      required: true,
      maxItems: allOptions.length,
    });

    const result = selected ? selected.filter((m) => m !== 'core') : [];

    // Display selected modules as bulleted list
    if (result.length > 0) {
      const moduleLines = result.map((moduleId) => {
        const opt = allOptions.find((o) => o.value === moduleId);
        return `  \u2022 ${opt?.label || moduleId}`;
      });
      await prompts.log.message('Selected modules:\n' + moduleLines.join('\n'));
    }

    return result;
  }

  /**
   * Get default modules for non-interactive mode
   * @param {Set} installedModuleIds - Already installed module IDs
   * @returns {Array} Default module codes
   */
  async getDefaultModules(installedModuleIds = new Set()) {
    const { ModuleManager } = require('../installers/lib/modules/manager');
    const moduleManager = new ModuleManager();
    const { modules: localModules } = await moduleManager.listAvailable();

    const defaultModules = [];

    // Add default-selected local modules (typically BMM)
    for (const mod of localModules) {
      if (mod.defaultSelected === true || installedModuleIds.has(mod.id)) {
        defaultModules.push(mod.id);
      }
    }

    // If no defaults found, use 'bmm' as the fallback default
    if (defaultModules.length === 0) {
      defaultModules.push('bmm');
    }

    return defaultModules;
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
    await prompts.log.info(`Resolved installation path: ${directory}`);

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

          const bmadNote = hasBmadInstall ? ` including existing BMAD installation (${path.basename(bmadResult.bmadDir)})` : '';
          await prompts.log.message(`Directory exists and contains ${files.length} item(s)${bmadNote}`);
        } else {
          await prompts.log.message('Directory exists and is empty');
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
        await prompts.log.warn("Let's try again with a different path.");
      }

      return proceed;
    } else {
      // Ask for confirmation to create the directory
      const create = await prompts.confirm({
        message: `Create directory: ${directory}?`,
        default: false,
      });

      if (!create) {
        await prompts.log.warn("Let's try again with a different path.");
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
      await prompts.log.warn('Could not load existing configurations');
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

      await prompts.log.success(`Confirmed local custom module: ${moduleData.name || moduleData.code}`);
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
    await prompts.log.info('Custom Modules');
    if (cachedCustomModules.length > 0) {
      await prompts.log.message('Found custom modules in your installation:');
    } else {
      await prompts.log.message('No custom modules currently installed.');
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
        await prompts.log.message(`Keeping ${result.selectedCustomModules.length} custom module(s)`);
        break;
      }

      case 'select': {
        // Let user choose which to keep
        const selectChoices = cachedCustomModules.map((m) => ({
          name: `${m.name} (${m.id})`,
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
          message: 'Select custom modules to keep (use arrow keys, space to toggle):',
          choices: choicesWithSkip,
          required: true,
        });

        // If user selected both "__NONE__" and other modules, honor the "None" choice
        if (keepModules && keepModules.includes('__NONE__') && keepModules.length > 1) {
          await prompts.log.warn('"None / I changed my mind" was selected, so no custom modules will be kept.');
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
        await prompts.log.warn('All custom modules will be removed from the installation');
        break;
      }

      case 'cancel': {
        // User cancelled - no custom modules
        await prompts.log.message('No custom modules will be added');
        break;
      }
    }

    return result;
  }

  /**
   * Check if installed version is a legacy version that needs fresh install
   * @param {string} installedVersion - The installed version
   * @returns {boolean} True if legacy (v4 or any alpha)
   */
  isLegacyVersion(installedVersion) {
    if (!installedVersion || installedVersion === 'unknown') {
      return true; // Treat unknown as legacy for safety
    }
    // Check if version string contains -alpha or -Alpha (any v6 alpha)
    return /-alpha\./i.test(installedVersion);
  }

  /**
   * Show warning for legacy version (v4 or alpha) and ask if user wants to proceed
   * @param {string} installedVersion - The installed version
   * @param {string} currentVersion - The current version
   * @param {string} bmadFolderName - Name of the BMAD folder
   * @returns {Promise<boolean>} True if user wants to proceed, false if they cancel
   */
  async showLegacyVersionWarning(installedVersion, currentVersion, bmadFolderName, options = {}) {
    if (!this.isLegacyVersion(installedVersion)) {
      return true; // Not legacy, proceed
    }

    let warningContent;
    if (installedVersion === 'unknown') {
      warningContent = 'Unable to detect your installed BMAD version.\n' + 'This appears to be a legacy or unsupported installation.';
    } else {
      warningContent =
        `You are updating from ${installedVersion} to ${currentVersion}.\n` + 'You have a legacy version installed (v4 or alpha).';
    }

    warningContent +=
      '\n\nFor the best experience, we recommend:\n' +
      '  1. Delete your current BMAD installation folder\n' +
      `     (the "${bmadFolderName}/" folder in your project)\n` +
      '  2. Run a fresh installation\n\n' +
      'Benefits of a fresh install:\n' +
      '  \u2022 Cleaner configuration without legacy artifacts\n' +
      '  \u2022 All new features properly configured\n' +
      '  \u2022 Fewer potential conflicts';

    await prompts.log.warn('VERSION WARNING');
    await prompts.note(warningContent, 'Version Warning');

    if (options.yes) {
      await prompts.log.warn('Non-interactive mode (--yes): auto-proceeding with legacy update');
      return true;
    }

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
      await prompts.note(
        `1. Delete the "${bmadFolderName}/" folder in your project\n` + "2. Run 'bmad install' again",
        'To do a fresh install',
      );
    }

    return proceed === 'proceed';
  }

  /**
   * Display module versions with update availability
   * @param {Array} modules - Array of module info objects with version info
   * @param {Array} availableUpdates - Array of available updates
   */
  async displayModuleVersions(modules, availableUpdates = []) {
    // Group modules by source
    const builtIn = modules.filter((m) => m.source === 'built-in');
    const external = modules.filter((m) => m.source === 'external');
    const custom = modules.filter((m) => m.source === 'custom');
    const unknown = modules.filter((m) => m.source === 'unknown');

    const lines = [];
    const formatGroup = (group, title) => {
      if (group.length === 0) return;
      lines.push(title);
      for (const mod of group) {
        const updateInfo = availableUpdates.find((u) => u.name === mod.name);
        const versionDisplay = mod.version || 'unknown';
        if (updateInfo) {
          lines.push(`  ${mod.name.padEnd(20)} ${versionDisplay} \u2192 ${updateInfo.latestVersion} \u2191`);
        } else {
          lines.push(`  ${mod.name.padEnd(20)} ${versionDisplay} \u2713`);
        }
      }
    };

    formatGroup(builtIn, 'Built-in Modules');
    formatGroup(external, 'External Modules (Official)');
    formatGroup(custom, 'Custom Modules');
    formatGroup(unknown, 'Other Modules');

    await prompts.note(lines.join('\n'), 'Module Versions');
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

    await prompts.log.info('Available Updates');

    const choices = availableUpdates.map((update) => ({
      name: `${update.name} (v${update.installedVersion} \u2192 v${update.latestVersion})`,
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
      message: 'Select modules to update (use arrow keys, space to toggle):',
      choices: choices,
      required: true,
    });

    return selected || [];
  }

  /**
   * Display status of all installed modules
   * @param {Object} statusData - Status data with modules, installation info, and available updates
   */
  async displayStatus(statusData) {
    const { installation, modules, availableUpdates, bmadDir } = statusData;

    // Installation info
    const infoLines = [
      `Version:       ${installation.version || 'unknown'}`,
      `Location:      ${bmadDir}`,
      `Installed:     ${new Date(installation.installDate).toLocaleDateString()}`,
      `Last Updated:  ${installation.lastUpdated ? new Date(installation.lastUpdated).toLocaleDateString() : 'unknown'}`,
    ];

    await prompts.note(infoLines.join('\n'), 'BMAD Status');

    // Module versions
    await this.displayModuleVersions(modules, availableUpdates);

    // Update summary
    if (availableUpdates.length > 0) {
      await prompts.log.warn(`${availableUpdates.length} update(s) available`);
      await prompts.log.message('Run \'bmad install\' and select "Quick Update" to update');
    } else {
      await prompts.log.success('All modules are up to date');
    }
  }

  /**
   * Display list of selected tools after IDE selection
   * @param {Array} selectedIdes - Array of selected IDE values
   * @param {Array} preferredIdes - Array of preferred IDE objects
   * @param {Array} allTools - Array of all tool objects
   */
  async displaySelectedTools(selectedIdes, preferredIdes, allTools) {
    if (selectedIdes.length === 0) return;

    const preferredValues = new Set(preferredIdes.map((ide) => ide.value));
    const toolLines = selectedIdes.map((ideValue) => {
      const tool = allTools.find((t) => t.value === ideValue);
      const name = tool?.name || ideValue;
      const marker = preferredValues.has(ideValue) ? ' \u2B50' : '';
      return `  \u2022 ${name}${marker}`;
    });
    await prompts.log.message('Selected tools:\n' + toolLines.join('\n'));
  }
}

module.exports = { UI };
