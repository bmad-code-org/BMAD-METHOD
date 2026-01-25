const path = require('node:path');
const fs = require('fs-extra');
const chalk = require('chalk');
const ora = require('ora');
const { Detector } = require('./detector');
const { Manifest } = require('./manifest');
const { ModuleManager } = require('../modules/manager');
const { IdeManager } = require('../ide/manager');
const { FileOps } = require('../../../lib/file-ops');
const { Config } = require('../../../lib/config');
const { XmlHandler } = require('../../../lib/xml-handler');
const { DependencyResolver } = require('./dependency-resolver');
const { ConfigCollector } = require('./config-collector');
const { getProjectRoot, getSourcePath, getModulePath } = require('../../../lib/project-root');
const { CLIUtils } = require('../../../lib/cli-utils');
const { ManifestGenerator } = require('./manifest-generator');
const { IdeConfigManager } = require('./ide-config-manager');
const { CustomHandler } = require('../custom/handler');
const prompts = require('../../../lib/prompts');

// BMAD installation folder name - this is constant and should never change
const BMAD_FOLDER_NAME = '_bmad';

class Installer {
  constructor() {
    this.detector = new Detector();
    this.manifest = new Manifest();
    this.moduleManager = new ModuleManager();
    this.ideManager = new IdeManager();
    this.fileOps = new FileOps();
    this.config = new Config();
    this.xmlHandler = new XmlHandler();
    this.dependencyResolver = new DependencyResolver();
    this.configCollector = new ConfigCollector();
    this.ideConfigManager = new IdeConfigManager();
    this.installedFiles = new Set(); // Track all installed files
    this.bmadFolderName = BMAD_FOLDER_NAME;
  }

  /**
   * Find the bmad installation directory in a project
   * Always uses the standard _bmad folder name
   * Also checks for legacy _cfg folder for migration
   * @param {string} projectDir - Project directory
   * @returns {Promise<Object>} { bmadDir: string, hasLegacyCfg: boolean }
   */
  async findBmadDir(projectDir) {
    const bmadDir = path.join(projectDir, BMAD_FOLDER_NAME);

    // Check if project directory exists
    if (!(await fs.pathExists(projectDir))) {
      // Project doesn't exist yet, return default
      return { bmadDir, hasLegacyCfg: false };
    }

    // Check for legacy _cfg folder if bmad directory exists
    let hasLegacyCfg = false;
    if (await fs.pathExists(bmadDir)) {
      const legacyCfgPath = path.join(bmadDir, '_cfg');
      if (await fs.pathExists(legacyCfgPath)) {
        hasLegacyCfg = true;
      }
    }

    return { bmadDir, hasLegacyCfg };
  }

  /**
   * @function copyFileWithPlaceholderReplacement
   * @intent Copy files from BMAD source to installation directory with dynamic content transformation
   * @why Enables installation-time customization: _bmad replacement
   * @param {string} sourcePath - Absolute path to source file in BMAD repository
   * @param {string} targetPath - Absolute path to destination file in user's project
   * @param {string} bmadFolderName - User's chosen bmad folder name (default: 'bmad')
   * @returns {Promise<void>} Resolves when file copy and transformation complete
   * @sideeffects Writes transformed file to targetPath, creates parent directories if needed
   * @edgecases Binary files bypass transformation, falls back to raw copy if UTF-8 read fails
   * @calledby installCore(), installModule(), IDE installers during file vendoring
   * @calls fs.readFile(), fs.writeFile(), fs.copy()
   *

   *
   * 3. Document marker in instructions.md (if applicable)
   */
  async copyFileWithPlaceholderReplacement(sourcePath, targetPath) {
    // List of text file extensions that should have placeholder replacement
    const textExtensions = ['.md', '.yaml', '.yml', '.txt', '.json', '.js', '.ts', '.html', '.css', '.sh', '.bat', '.csv', '.xml'];
    const ext = path.extname(sourcePath).toLowerCase();

    // Check if this is a text file that might contain placeholders
    if (textExtensions.includes(ext)) {
      try {
        // Read the file content
        let content = await fs.readFile(sourcePath, 'utf8');

        // Write to target with replaced content
        await fs.ensureDir(path.dirname(targetPath));
        await fs.writeFile(targetPath, content, 'utf8');
      } catch {
        // If reading as text fails (might be binary despite extension), fall back to regular copy
        await fs.copy(sourcePath, targetPath, { overwrite: true });
      }
    } else {
      // Binary file or other file type - just copy directly
      await fs.copy(sourcePath, targetPath, { overwrite: true });
    }
  }

  /**
   * Collect Tool/IDE configurations after module configuration
   * @param {string} projectDir - Project directory
   * @param {Array} selectedModules - Selected modules from configuration
   * @param {boolean} isFullReinstall - Whether this is a full reinstall
   * @param {Array} previousIdes - Previously configured IDEs (for reinstalls)
   * @param {Array} preSelectedIdes - Pre-selected IDEs from early prompt (optional)
   * @returns {Object} Tool/IDE selection and configurations
   */
  async collectToolConfigurations(projectDir, selectedModules, isFullReinstall = false, previousIdes = [], preSelectedIdes = null) {
    // Use pre-selected IDEs if provided, otherwise prompt
    let toolConfig;
    if (preSelectedIdes === null) {
      // Fallback: prompt for tool selection (backwards compatibility)
      const { UI } = require('../../../lib/ui');
      const ui = new UI();
      toolConfig = await ui.promptToolSelection(projectDir);
    } else {
      // IDEs were already selected during initial prompts
      toolConfig = {
        ides: preSelectedIdes,
        skipIde: !preSelectedIdes || preSelectedIdes.length === 0,
      };
    }

    // Check for already configured IDEs
    const { Detector } = require('./detector');
    const detector = new Detector();
    const bmadDir = path.join(projectDir, BMAD_FOLDER_NAME);

    // During full reinstall, use the saved previous IDEs since bmad dir was deleted
    // Otherwise detect from existing installation
    let previouslyConfiguredIdes;
    if (isFullReinstall) {
      // During reinstall, treat all IDEs as new (need configuration)
      previouslyConfiguredIdes = [];
    } else {
      const existingInstall = await detector.detect(bmadDir);
      previouslyConfiguredIdes = existingInstall.ides || [];
    }

    // Load saved IDE configurations for already-configured IDEs
    const savedIdeConfigs = await this.ideConfigManager.loadAllIdeConfigs(bmadDir);

    // Collect IDE-specific configurations if any were selected
    const ideConfigurations = {};

    // First, add saved configs for already-configured IDEs
    for (const ide of toolConfig.ides || []) {
      if (previouslyConfiguredIdes.includes(ide) && savedIdeConfigs[ide]) {
        ideConfigurations[ide] = savedIdeConfigs[ide];
      }
    }

    if (!toolConfig.skipIde && toolConfig.ides && toolConfig.ides.length > 0) {
      // Determine which IDEs are newly selected (not previously configured)
      const newlySelectedIdes = toolConfig.ides.filter((ide) => !previouslyConfiguredIdes.includes(ide));

      if (newlySelectedIdes.length > 0) {
        console.log('\n'); // Add spacing before IDE questions

        // Use IdeManager to get handlers (supports both config-driven and custom IDEs)
        await this.ideManager.ensureInitialized();

        for (const ide of newlySelectedIdes) {
          try {
            const handler = this.ideManager.handlers.get(ide);

            if (!handler) {
              // IDE not recognized - skip silently
              continue;
            }

            // Check if this IDE handler has a collectConfiguration method
            if (typeof handler.collectConfiguration === 'function') {
              console.log(chalk.cyan(`\nConfiguring ${ide}...`));
              ideConfigurations[ide] = await handler.collectConfiguration({
                selectedModules: selectedModules || [],
                projectDir,
                bmadDir,
              });
            }
            // Most config-driven IDEs don't need configuration - silently skip
          } catch {
            // IDE doesn't have collectConfiguration or had an error - skip
            continue;
          }
        }
      }

      // Log which IDEs are already configured and being kept
      const keptIdes = toolConfig.ides.filter((ide) => previouslyConfiguredIdes.includes(ide));
      if (keptIdes.length > 0) {
        console.log(chalk.dim(`\nKeeping existing configuration for: ${keptIdes.join(', ')}`));
      }
    }

    return {
      ides: toolConfig.ides,
      skipIde: toolConfig.skipIde,
      configurations: ideConfigurations,
    };
  }

  /**
   * Main installation method
   * @param {Object} config - Installation configuration
   * @param {string} config.directory - Target directory
   * @param {boolean} config.installCore - Whether to install core
   * @param {string[]} config.modules - Modules to install
   * @param {string[]} config.ides - IDEs to configure
   * @param {boolean} config.skipIde - Skip IDE configuration
   */
  async install(originalConfig) {
    // Clone config to avoid mutating the caller's object
    const config = { ...originalConfig };

    // Check if core config was already collected in UI
    const hasCoreConfig = config.coreConfig && Object.keys(config.coreConfig).length > 0;

    // Only display logo if core config wasn't already collected (meaning we're not continuing from UI)
    if (!hasCoreConfig) {
      // Display BMAD logo
      CLIUtils.displayLogo();

      // Display welcome message
      CLIUtils.displaySection('BMad™  Installation', 'Version ' + require(path.join(getProjectRoot(), 'package.json')).version);
    }

    // Note: Legacy V4 detection now happens earlier in UI.promptInstall()
    // before any config collection, so we don't need to check again here

    const projectDir = path.resolve(config.directory);

    // If core config was pre-collected (from interactive mode), use it
    if (config.coreConfig && Object.keys(config.coreConfig).length > 0) {
      this.configCollector.collectedConfig.core = config.coreConfig;
      // Also store in allAnswers for cross-referencing
      this.configCollector.allAnswers = {};
      for (const [key, value] of Object.entries(config.coreConfig)) {
        this.configCollector.allAnswers[`core_${key}`] = value;
      }
    }

    // Collect configurations for modules (skip if quick update already collected them)
    let moduleConfigs;
    let customModulePaths = new Map();

    if (config._quickUpdate) {
      // Quick update already collected all configs, use them directly
      moduleConfigs = this.configCollector.collectedConfig;

      // For quick update, populate customModulePaths from _customModuleSources
      if (config._customModuleSources) {
        for (const [moduleId, customInfo] of config._customModuleSources) {
          customModulePaths.set(moduleId, customInfo.sourcePath);
        }
      }
    } else {
      // For regular updates (modify flow), check manifest for custom module sources
      if (config._isUpdate && config._existingInstall && config._existingInstall.customModules) {
        for (const customModule of config._existingInstall.customModules) {
          // Ensure we have an absolute sourcePath
          let absoluteSourcePath = customModule.sourcePath;

          // Check if sourcePath is a cache-relative path (starts with _config)
          if (absoluteSourcePath && absoluteSourcePath.startsWith('_config')) {
            // Convert cache-relative path to absolute path
            absoluteSourcePath = path.join(bmadDir, absoluteSourcePath);
          }
          // If no sourcePath but we have relativePath, convert it
          else if (!absoluteSourcePath && customModule.relativePath) {
            // relativePath is relative to the project root (parent of bmad dir)
            absoluteSourcePath = path.resolve(projectDir, customModule.relativePath);
          }
          // Ensure sourcePath is absolute for anything else
          else if (absoluteSourcePath && !path.isAbsolute(absoluteSourcePath)) {
            absoluteSourcePath = path.resolve(absoluteSourcePath);
          }

          if (absoluteSourcePath) {
            customModulePaths.set(customModule.id, absoluteSourcePath);
          }
        }
      }

      // Build custom module paths map from customContent

      // Handle selectedFiles (from existing install path or manual directory input)
      if (config.customContent && config.customContent.selected && config.customContent.selectedFiles) {
        const customHandler = new CustomHandler();
        for (const customFile of config.customContent.selectedFiles) {
          const customInfo = await customHandler.getCustomInfo(customFile, path.resolve(config.directory));
          if (customInfo && customInfo.id) {
            customModulePaths.set(customInfo.id, customInfo.path);
          }
        }
      }

      // Handle new custom content sources from UI
      if (config.customContent && config.customContent.sources) {
        for (const source of config.customContent.sources) {
          customModulePaths.set(source.id, source.path);
        }
      }

      // Handle cachedModules (from new install path where modules are cached)
      // Only include modules that were actually selected for installation
      if (config.customContent && config.customContent.cachedModules) {
        // Get selected cached module IDs (if available)
        const selectedCachedIds = config.customContent.selectedCachedModules || [];
        // If no selection info, include all cached modules (for backward compatibility)
        const shouldIncludeAll = selectedCachedIds.length === 0 && config.customContent.selected;

        for (const cachedModule of config.customContent.cachedModules) {
          // For cached modules, the path is the cachePath which contains the module.yaml
          if (
            cachedModule.id &&
            cachedModule.cachePath && // Include if selected or if we should include all
            (shouldIncludeAll || selectedCachedIds.includes(cachedModule.id))
          ) {
            customModulePaths.set(cachedModule.id, cachedModule.cachePath);
          }
        }
      }

      // Get list of all modules including custom modules
      // Order: core first, then official modules, then custom modules
      const allModulesForConfig = ['core'];

      // Add official modules (excluding core and any custom modules)
      const officialModules = (config.modules || []).filter((m) => m !== 'core' && !customModulePaths.has(m));
      allModulesForConfig.push(...officialModules);

      // Add custom modules at the end
      for (const [moduleId] of customModulePaths) {
        if (!allModulesForConfig.includes(moduleId)) {
          allModulesForConfig.push(moduleId);
        }
      }

      // Check if core was already collected in UI
      if (config.coreConfig && Object.keys(config.coreConfig).length > 0) {
        // Core already collected, skip it in config collection
        const modulesWithoutCore = allModulesForConfig.filter((m) => m !== 'core');
        moduleConfigs = await this.configCollector.collectAllConfigurations(modulesWithoutCore, path.resolve(config.directory), {
          customModulePaths,
        });
      } else {
        // Core not collected yet, include it
        moduleConfigs = await this.configCollector.collectAllConfigurations(allModulesForConfig, path.resolve(config.directory), {
          customModulePaths,
        });
      }
    }

    // Set bmad folder name on module manager and IDE manager for placeholder replacement
    this.moduleManager.setBmadFolderName(BMAD_FOLDER_NAME);
    this.moduleManager.setCoreConfig(moduleConfigs.core || {});
    this.moduleManager.setCustomModulePaths(customModulePaths);
    this.ideManager.setBmadFolderName(BMAD_FOLDER_NAME);

    // Tool selection will be collected after we determine if it's a reinstall/update/new install

    const spinner = ora('Preparing installation...').start();

    try {
      // Resolve target directory (path.resolve handles platform differences)
      const projectDir = path.resolve(config.directory);

      // Always use the standard _bmad folder name
      const bmadDir = path.join(projectDir, BMAD_FOLDER_NAME);

      // Create a project directory if it doesn't exist (user already confirmed)
      if (!(await fs.pathExists(projectDir))) {
        spinner.text = 'Creating installation directory...';
        try {
          // fs.ensureDir handles platform-specific directory creation
          // It will recursively create all necessary parent directories
          await fs.ensureDir(projectDir);
        } catch (error) {
          spinner.fail('Failed to create installation directory');
          console.error(chalk.red(`Error: ${error.message}`));
          // More detailed error for common issues
          if (error.code === 'EACCES') {
            console.error(chalk.red('Permission denied. Check parent directory permissions.'));
          } else if (error.code === 'ENOSPC') {
            console.error(chalk.red('No space left on device.'));
          }
          throw new Error(`Cannot create directory: ${projectDir}`);
        }
      }

      // Check existing installation
      spinner.text = 'Checking for existing installation...';
      const existingInstall = await this.detector.detect(bmadDir);

      if (existingInstall.installed && !config.force && !config._quickUpdate) {
        spinner.stop();

        // Check if user already decided what to do (from early menu in ui.js)
        let action = null;
        if (config.actionType === 'update') {
          action = 'update';
        } else {
          // Fallback: Ask the user (backwards compatibility for other code paths)
          console.log(chalk.yellow('\n⚠️  Existing BMAD installation detected'));
          console.log(chalk.dim(`  Location: ${bmadDir}`));
          console.log(chalk.dim(`  Version: ${existingInstall.version}`));

          const promptResult = await this.promptUpdateAction();
          action = promptResult.action;
        }

        if (action === 'update') {
          // Store that we're updating for later processing
          config._isUpdate = true;
          config._existingInstall = existingInstall;

          // Detect modules that were previously installed but are NOT in the new selection (to be removed)
          const previouslyInstalledModules = new Set(existingInstall.modules.map((m) => m.id));
          const newlySelectedModules = new Set(config.modules || []);

          // Find modules to remove (installed but not in new selection)
          // Exclude 'core' from being removable
          const modulesToRemove = [...previouslyInstalledModules].filter((m) => !newlySelectedModules.has(m) && m !== 'core');

          // If there are modules to remove, ask for confirmation
          if (modulesToRemove.length > 0) {
            const prompts = require('../../../lib/prompts');
            spinner.stop();

            console.log('');
            console.log(chalk.yellow.bold('⚠️  Modules to be removed:'));
            for (const moduleId of modulesToRemove) {
              const moduleInfo = existingInstall.modules.find((m) => m.id === moduleId);
              const displayName = moduleInfo?.name || moduleId;
              const modulePath = path.join(bmadDir, moduleId);
              console.log(chalk.red(`  - ${displayName} (${modulePath})`));
            }
            console.log('');

            const confirmRemoval = await prompts.confirm({
              message: `Remove ${modulesToRemove.length} module(s) from BMAD installation?`,
              default: false,
            });

            if (confirmRemoval) {
              // Remove module folders
              for (const moduleId of modulesToRemove) {
                const modulePath = path.join(bmadDir, moduleId);
                try {
                  if (await fs.pathExists(modulePath)) {
                    await fs.remove(modulePath);
                    console.log(chalk.dim(`  ✓ Removed: ${moduleId}`));
                  }
                } catch (error) {
                  console.warn(chalk.yellow(`  Warning: Failed to remove ${moduleId}: ${error.message}`));
                }
              }
              console.log(chalk.green(`  ✓ Removed ${modulesToRemove.length} module(s)`));
            } else {
              console.log(chalk.dim('  → Module removal cancelled'));
              // Add the modules back to the selection since user cancelled removal
              for (const moduleId of modulesToRemove) {
                if (!config.modules) config.modules = [];
                config.modules.push(moduleId);
              }
            }

            spinner.start('Preparing update...');
          }

          // Detect custom and modified files BEFORE updating (compare current files vs files-manifest.csv)
          const existingFilesManifest = await this.readFilesManifest(bmadDir);
          const { customFiles, modifiedFiles } = await this.detectCustomFiles(bmadDir, existingFilesManifest);

          config._customFiles = customFiles;
          config._modifiedFiles = modifiedFiles;

          // Preserve existing core configuration during updates
          // Read the current core config.yaml to maintain user's settings
          const coreConfigPath = path.join(bmadDir, 'core', 'config.yaml');
          if ((await fs.pathExists(coreConfigPath)) && (!config.coreConfig || Object.keys(config.coreConfig).length === 0)) {
            try {
              const yaml = require('yaml');
              const coreConfigContent = await fs.readFile(coreConfigPath, 'utf8');
              const existingCoreConfig = yaml.parse(coreConfigContent);

              // Store in config.coreConfig so it's preserved through the installation
              config.coreConfig = existingCoreConfig;

              // Also store in configCollector for use during config collection
              this.configCollector.collectedConfig.core = existingCoreConfig;
            } catch (error) {
              console.warn(chalk.yellow(`Warning: Could not read existing core config: ${error.message}`));
            }
          }

          // Also check cache directory for custom modules (like quick update does)
          const cacheDir = path.join(bmadDir, '_config', 'custom');
          if (await fs.pathExists(cacheDir)) {
            const cachedModules = await fs.readdir(cacheDir, { withFileTypes: true });

            for (const cachedModule of cachedModules) {
              if (cachedModule.isDirectory()) {
                const moduleId = cachedModule.name;

                // Skip if we already have this module from manifest
                if (customModulePaths.has(moduleId)) {
                  continue;
                }

                // Check if this is an external official module - skip cache for those
                const isExternal = await this.moduleManager.isExternalModule(moduleId);
                if (isExternal) {
                  // External modules are handled via cloneExternalModule, not from cache
                  continue;
                }

                const cachedPath = path.join(cacheDir, moduleId);

                // Check if this is actually a custom module (has module.yaml)
                const moduleYamlPath = path.join(cachedPath, 'module.yaml');
                if (await fs.pathExists(moduleYamlPath)) {
                  customModulePaths.set(moduleId, cachedPath);
                }
              }
            }

            // Update module manager with the new custom module paths from cache
            this.moduleManager.setCustomModulePaths(customModulePaths);
          }

          // If there are custom files, back them up temporarily
          if (customFiles.length > 0) {
            const tempBackupDir = path.join(projectDir, '_bmad-custom-backup-temp');
            await fs.ensureDir(tempBackupDir);

            spinner.start(`Backing up ${customFiles.length} custom files...`);
            for (const customFile of customFiles) {
              const relativePath = path.relative(bmadDir, customFile);
              const backupPath = path.join(tempBackupDir, relativePath);
              await fs.ensureDir(path.dirname(backupPath));
              await fs.copy(customFile, backupPath);
            }
            spinner.succeed(`Backed up ${customFiles.length} custom files`);

            config._tempBackupDir = tempBackupDir;
          }

          // For modified files, back them up to temp directory (will be restored as .bak files after install)
          if (modifiedFiles.length > 0) {
            const tempModifiedBackupDir = path.join(projectDir, '_bmad-modified-backup-temp');
            await fs.ensureDir(tempModifiedBackupDir);

            spinner.start(`Backing up ${modifiedFiles.length} modified files...`);
            for (const modifiedFile of modifiedFiles) {
              const relativePath = path.relative(bmadDir, modifiedFile.path);
              const tempBackupPath = path.join(tempModifiedBackupDir, relativePath);
              await fs.ensureDir(path.dirname(tempBackupPath));
              await fs.copy(modifiedFile.path, tempBackupPath, { overwrite: true });
            }
            spinner.succeed(`Backed up ${modifiedFiles.length} modified files`);

            config._tempModifiedBackupDir = tempModifiedBackupDir;
          }
        }
      } else if (existingInstall.installed && config._quickUpdate) {
        // Quick update mode - automatically treat as update without prompting
        spinner.text = 'Preparing quick update...';
        config._isUpdate = true;
        config._existingInstall = existingInstall;

        // Detect custom and modified files BEFORE updating
        const existingFilesManifest = await this.readFilesManifest(bmadDir);
        const { customFiles, modifiedFiles } = await this.detectCustomFiles(bmadDir, existingFilesManifest);

        config._customFiles = customFiles;
        config._modifiedFiles = modifiedFiles;

        // Also check cache directory for custom modules (like quick update does)
        const cacheDir = path.join(bmadDir, '_config', 'custom');
        if (await fs.pathExists(cacheDir)) {
          const cachedModules = await fs.readdir(cacheDir, { withFileTypes: true });

          for (const cachedModule of cachedModules) {
            if (cachedModule.isDirectory()) {
              const moduleId = cachedModule.name;

              // Skip if we already have this module from manifest
              if (customModulePaths.has(moduleId)) {
                continue;
              }

              // Check if this is an external official module - skip cache for those
              const isExternal = await this.moduleManager.isExternalModule(moduleId);
              if (isExternal) {
                // External modules are handled via cloneExternalModule, not from cache
                continue;
              }

              const cachedPath = path.join(cacheDir, moduleId);

              // Check if this is actually a custom module (has module.yaml)
              const moduleYamlPath = path.join(cachedPath, 'module.yaml');
              if (await fs.pathExists(moduleYamlPath)) {
                customModulePaths.set(moduleId, cachedPath);
              }
            }
          }

          // Update module manager with the new custom module paths from cache
          this.moduleManager.setCustomModulePaths(customModulePaths);
        }

        // Back up custom files
        if (customFiles.length > 0) {
          const tempBackupDir = path.join(projectDir, '_bmad-custom-backup-temp');
          await fs.ensureDir(tempBackupDir);

          spinner.start(`Backing up ${customFiles.length} custom files...`);
          for (const customFile of customFiles) {
            const relativePath = path.relative(bmadDir, customFile);
            const backupPath = path.join(tempBackupDir, relativePath);
            await fs.ensureDir(path.dirname(backupPath));
            await fs.copy(customFile, backupPath);
          }
          spinner.succeed(`Backed up ${customFiles.length} custom files`);
          config._tempBackupDir = tempBackupDir;
        }

        // Back up modified files
        if (modifiedFiles.length > 0) {
          const tempModifiedBackupDir = path.join(projectDir, '_bmad-modified-backup-temp');
          await fs.ensureDir(tempModifiedBackupDir);

          spinner.start(`Backing up ${modifiedFiles.length} modified files...`);
          for (const modifiedFile of modifiedFiles) {
            const relativePath = path.relative(bmadDir, modifiedFile.path);
            const tempBackupPath = path.join(tempModifiedBackupDir, relativePath);
            await fs.ensureDir(path.dirname(tempBackupPath));
            await fs.copy(modifiedFile.path, tempBackupPath, { overwrite: true });
          }
          spinner.succeed(`Backed up ${modifiedFiles.length} modified files`);
          config._tempModifiedBackupDir = tempModifiedBackupDir;
        }
      }

      // Now collect tool configurations after we know if it's a reinstall
      // Skip for quick update since we already have the IDE list
      spinner.stop();
      let toolSelection;
      if (config._quickUpdate) {
        // Quick update already has IDEs configured, use saved configurations
        const preConfiguredIdes = {};
        const savedIdeConfigs = config._savedIdeConfigs || {};

        for (const ide of config.ides || []) {
          // Use saved config if available, otherwise mark as already configured (legacy)
          if (savedIdeConfigs[ide]) {
            preConfiguredIdes[ide] = savedIdeConfigs[ide];
          } else {
            preConfiguredIdes[ide] = { _alreadyConfigured: true };
          }
        }
        toolSelection = {
          ides: config.ides || [],
          skipIde: !config.ides || config.ides.length === 0,
          configurations: preConfiguredIdes,
        };
      } else {
        // Pass pre-selected IDEs from early prompt (if available)
        // This allows IDE selection to happen before file copying, improving UX
        const preSelectedIdes = config.ides && config.ides.length > 0 ? config.ides : null;
        toolSelection = await this.collectToolConfigurations(
          path.resolve(config.directory),
          config.modules,
          config._isFullReinstall || false,
          config._previouslyConfiguredIdes || [],
          preSelectedIdes,
        );
      }

      // Merge tool selection into config (for both quick update and regular flow)
      config.ides = toolSelection.ides;
      config.skipIde = toolSelection.skipIde;
      const ideConfigurations = toolSelection.configurations;

      // Add spacing after prompts before installation progress
      console.log('');

      if (spinner.isSpinning) {
        spinner.text = 'Continuing installation...';
      } else {
        spinner.start('Continuing installation...');
      }

      // Create bmad directory structure
      spinner.text = 'Creating directory structure...';
      await this.createDirectoryStructure(bmadDir);

      // Cache custom modules if any
      if (customModulePaths && customModulePaths.size > 0) {
        spinner.text = 'Caching custom modules...';
        const { CustomModuleCache } = require('./custom-module-cache');
        const customCache = new CustomModuleCache(bmadDir);

        for (const [moduleId, sourcePath] of customModulePaths) {
          const cachedInfo = await customCache.cacheModule(moduleId, sourcePath, {
            sourcePath: sourcePath, // Store original path for updates
          });

          // Update the customModulePaths to use the cached location
          customModulePaths.set(moduleId, cachedInfo.cachePath);
        }

        // Update module manager with the cached paths
        this.moduleManager.setCustomModulePaths(customModulePaths);
        spinner.succeed('Custom modules cached');
      }

      const projectRoot = getProjectRoot();

      // Step 1: Install core module first (if requested)
      if (config.installCore) {
        spinner.start('Installing BMAD core...');
        await this.installCoreWithDependencies(bmadDir, { core: {} });
        spinner.succeed('Core installed');

        // Generate core config file
        await this.generateModuleConfigs(bmadDir, { core: config.coreConfig || {} });
      }

      // Custom content is already handled in UI before module selection
      let finalCustomContent = config.customContent;

      // Step 3: Prepare modules list including cached custom modules
      let allModules = [...(config.modules || [])];

      // During quick update, we might have custom module sources from the manifest
      if (config._customModuleSources) {
        // Add custom modules from stored sources
        for (const [moduleId, customInfo] of config._customModuleSources) {
          if (!allModules.includes(moduleId) && (await fs.pathExists(customInfo.sourcePath))) {
            allModules.push(moduleId);
          }
        }
      }

      // Add cached custom modules
      if (finalCustomContent && finalCustomContent.cachedModules) {
        for (const cachedModule of finalCustomContent.cachedModules) {
          if (!allModules.includes(cachedModule.id)) {
            allModules.push(cachedModule.id);
          }
        }
      }

      // Regular custom content from user input (non-cached)
      if (finalCustomContent && finalCustomContent.selected && finalCustomContent.selectedFiles) {
        // Add custom modules to the installation list
        const customHandler = new CustomHandler();
        for (const customFile of finalCustomContent.selectedFiles) {
          const customInfo = await customHandler.getCustomInfo(customFile, projectDir);
          if (customInfo && customInfo.id) {
            allModules.push(customInfo.id);
          }
        }
      }

      // Don't include core again if already installed
      if (config.installCore) {
        allModules = allModules.filter((m) => m !== 'core');
      }

      const modulesToInstall = allModules;

      // For dependency resolution, we only need regular modules (not custom modules)
      // Custom modules are already installed in _bmad and don't need dependency resolution from source
      const regularModulesForResolution = allModules.filter((module) => {
        // Check if this is a custom module
        const isCustom =
          customModulePaths.has(module) ||
          (finalCustomContent && finalCustomContent.cachedModules && finalCustomContent.cachedModules.some((cm) => cm.id === module)) ||
          (finalCustomContent &&
            finalCustomContent.selected &&
            finalCustomContent.selectedFiles &&
            finalCustomContent.selectedFiles.some((f) => f.includes(module)));
        return !isCustom;
      });

      // For dependency resolution, we need to pass the project root
      // Create a temporary module manager that knows about custom content locations
      const tempModuleManager = new ModuleManager({
        bmadDir: bmadDir, // Pass bmadDir so we can check cache
      });

      const resolution = await this.dependencyResolver.resolve(projectRoot, regularModulesForResolution, {
        verbose: config.verbose,
        moduleManager: tempModuleManager,
      });

      spinner.succeed('Dependencies resolved');

      // Install modules with their dependencies
      if (allModules && allModules.length > 0) {
        const installedModuleNames = new Set();

        for (const moduleName of allModules) {
          // Skip if already installed
          if (installedModuleNames.has(moduleName)) {
            continue;
          }
          installedModuleNames.add(moduleName);

          // Show appropriate message based on whether this is a quick update
          const isQuickUpdate = config._quickUpdate || false;
          spinner.start(`${isQuickUpdate ? 'Updating' : 'Installing'} module: ${moduleName}...`);

          // Check if this is a custom module
          let isCustomModule = false;
          let customInfo = null;
          let useCache = false;

          // First check if we have a cached version
          if (finalCustomContent && finalCustomContent.cachedModules) {
            const cachedModule = finalCustomContent.cachedModules.find((m) => m.id === moduleName);
            if (cachedModule) {
              isCustomModule = true;
              customInfo = {
                id: moduleName,
                path: cachedModule.cachePath,
                config: {},
              };
              useCache = true;
            }
          }

          // Then check if we have custom module sources from the manifest (for quick update)
          if (!isCustomModule && config._customModuleSources && config._customModuleSources.has(moduleName)) {
            customInfo = config._customModuleSources.get(moduleName);
            isCustomModule = true;

            // Check if this is a cached module (source path starts with _config)
            if (
              customInfo.sourcePath &&
              (customInfo.sourcePath.startsWith('_config') || customInfo.sourcePath.includes('_config/custom'))
            ) {
              useCache = true;
              // Make sure we have the right path structure
              if (!customInfo.path) {
                customInfo.path = customInfo.sourcePath;
              }
            }
          }

          // Finally check regular custom content
          if (!isCustomModule && finalCustomContent && finalCustomContent.selected && finalCustomContent.selectedFiles) {
            const customHandler = new CustomHandler();
            for (const customFile of finalCustomContent.selectedFiles) {
              const info = await customHandler.getCustomInfo(customFile, projectDir);
              if (info && info.id === moduleName) {
                isCustomModule = true;
                customInfo = info;
                break;
              }
            }
          }

          if (isCustomModule && customInfo) {
            // Custom modules are now installed via ModuleManager just like standard modules
            // The custom module path should already be in customModulePaths from earlier setup
            if (!customModulePaths.has(moduleName) && customInfo.path) {
              customModulePaths.set(moduleName, customInfo.path);
              this.moduleManager.setCustomModulePaths(customModulePaths);
            }

            const collectedModuleConfig = moduleConfigs[moduleName] || {};

            // Use ModuleManager to install the custom module
            await this.moduleManager.install(
              moduleName,
              bmadDir,
              (filePath) => {
                this.installedFiles.add(filePath);
              },
              {
                isCustom: true,
                moduleConfig: collectedModuleConfig,
                isQuickUpdate: config._quickUpdate || false,
                installer: this,
              },
            );

            // Create module config (include collected config from module.yaml prompts)
            await this.generateModuleConfigs(bmadDir, {
              [moduleName]: { ...config.coreConfig, ...customInfo.config, ...collectedModuleConfig },
            });
          } else {
            // Regular module installation
            // Special case for core module
            if (moduleName === 'core') {
              await this.installCoreWithDependencies(bmadDir, resolution.byModule[moduleName]);
            } else {
              await this.installModuleWithDependencies(moduleName, bmadDir, resolution.byModule[moduleName]);
            }
          }

          spinner.succeed(`Module ${isQuickUpdate ? 'updated' : 'installed'}: ${moduleName}`);
        }

        // Install partial modules (only dependencies)
        for (const [module, files] of Object.entries(resolution.byModule)) {
          if (!allModules.includes(module) && module !== 'core') {
            const totalFiles =
              files.agents.length +
              files.tasks.length +
              files.tools.length +
              files.templates.length +
              files.data.length +
              files.other.length;
            if (totalFiles > 0) {
              spinner.start(`Installing ${module} dependencies...`);
              await this.installPartialModule(module, bmadDir, files);
              spinner.succeed(`${module} dependencies installed`);
            }
          }
        }
      }

      // All content is now installed as modules - no separate custom content handling needed

      // Generate clean config.yaml files for each installed module
      spinner.start('Generating module configurations...');
      await this.generateModuleConfigs(bmadDir, moduleConfigs);
      spinner.succeed('Module configurations generated');

      // Create agent configuration files
      // Note: Legacy createAgentConfigs removed - using YAML customize system instead
      // Customize templates are now created in processAgentFiles when building YAML agents

      // Pre-register manifest files that will be created (except files-manifest.csv to avoid recursion)
      const cfgDir = path.join(bmadDir, '_config');
      this.installedFiles.add(path.join(cfgDir, 'manifest.yaml'));
      this.installedFiles.add(path.join(cfgDir, 'workflow-manifest.csv'));
      this.installedFiles.add(path.join(cfgDir, 'agent-manifest.csv'));
      this.installedFiles.add(path.join(cfgDir, 'task-manifest.csv'));

      // Generate CSV manifests for workflows, agents, tasks AND ALL FILES with hashes BEFORE IDE setup
      // This must happen BEFORE mergeModuleHelpCatalogs because it depends on agent-manifest.csv
      spinner.start('Generating workflow and agent manifests...');
      const manifestGen = new ManifestGenerator();

      // For quick update, we need ALL installed modules in the manifest
      // Not just the ones being updated
      const allModulesForManifest = config._quickUpdate
        ? config._existingModules || allModules || []
        : config._preserveModules
          ? [...allModules, ...config._preserveModules]
          : allModules || [];

      // For regular installs (including when called from quick update), use what we have
      let modulesForCsvPreserve;
      if (config._quickUpdate) {
        // Quick update - use existing modules or fall back to modules being updated
        modulesForCsvPreserve = config._existingModules || allModules || [];
      } else {
        // Regular install - use the modules we're installing plus any preserved ones
        modulesForCsvPreserve = config._preserveModules ? [...allModules, ...config._preserveModules] : allModules;
      }

      const manifestStats = await manifestGen.generateManifests(bmadDir, allModulesForManifest, [...this.installedFiles], {
        ides: config.ides || [],
        preservedModules: modulesForCsvPreserve, // Scan these from installed bmad/ dir
      });

      // Custom modules are now included in the main modules list - no separate tracking needed

      spinner.succeed(
        `Manifests generated: ${manifestStats.workflows} workflows, ${manifestStats.agents} agents, ${manifestStats.tasks} tasks, ${manifestStats.tools} tools, ${manifestStats.files} files`,
      );

      // Merge all module-help.csv files into bmad-help.csv
      // This must happen AFTER generateManifests because it depends on agent-manifest.csv
      spinner.start('Generating workflow help catalog...');
      await this.mergeModuleHelpCatalogs(bmadDir);
      spinner.succeed('Workflow help catalog generated');

      // Configure IDEs and copy documentation
      if (!config.skipIde && config.ides && config.ides.length > 0) {
        // Filter out any undefined/null values from the IDE list
        const validIdes = config.ides.filter((ide) => ide && typeof ide === 'string');

        if (validIdes.length === 0) {
          console.log(chalk.yellow('⚠️  No valid IDEs selected. Skipping IDE configuration.'));
        } else {
          // Check if any IDE might need prompting (no pre-collected config)
          const needsPrompting = validIdes.some((ide) => !ideConfigurations[ide]);

          if (!needsPrompting) {
            spinner.start('Configuring IDEs...');
          }

          // Temporarily suppress console output if not verbose
          const originalLog = console.log;
          if (!config.verbose) {
            console.log = () => {};
          }

          for (const ide of validIdes) {
            // Only show spinner if we have pre-collected config (no prompts expected)
            if (ideConfigurations[ide] && !needsPrompting) {
              spinner.text = `Configuring ${ide}...`;
            } else if (!ideConfigurations[ide]) {
              // Stop spinner before prompting
              if (spinner.isSpinning) {
                spinner.stop();
              }
              console.log(chalk.cyan(`\nConfiguring ${ide}...`));
            }

            // Pass pre-collected configuration to avoid re-prompting
            await this.ideManager.setup(ide, projectDir, bmadDir, {
              selectedModules: allModules || [],
              preCollectedConfig: ideConfigurations[ide] || null,
              verbose: config.verbose,
            });

            // Save IDE configuration for future updates
            if (ideConfigurations[ide] && !ideConfigurations[ide]._alreadyConfigured) {
              await this.ideConfigManager.saveIdeConfig(bmadDir, ide, ideConfigurations[ide]);
            }

            // Restart spinner if we stopped it
            if (!ideConfigurations[ide] && !spinner.isSpinning) {
              spinner.start('Configuring IDEs...');
            }
          }

          // Restore console.log
          console.log = originalLog;

          if (spinner.isSpinning) {
            spinner.succeed(`Configured: ${validIdes.join(', ')}`);
          } else {
            console.log(chalk.green(`✓ Configured: ${validIdes.join(', ')}`));
          }
        }
      }

      // Run module-specific installers after IDE setup
      spinner.start('Running module-specific installers...');

      // Create a conditional logger based on verbose mode
      const verboseMode = process.env.BMAD_VERBOSE_INSTALL === 'true' || config.verbose;
      const moduleLogger = {
        log: (msg) => (verboseMode ? console.log(msg) : {}), // Only log in verbose mode
        error: (msg) => console.error(msg), // Always show errors
        warn: (msg) => console.warn(msg), // Always show warnings
      };

      // Run core module installer if core was installed
      if (config.installCore || resolution.byModule.core) {
        spinner.text = 'Running core module installer...';

        await this.moduleManager.runModuleInstaller('core', bmadDir, {
          installedIDEs: config.ides || [],
          moduleConfig: moduleConfigs.core || {},
          coreConfig: moduleConfigs.core || {},
          logger: moduleLogger,
        });
      }

      // Run installers for user-selected modules
      if (config.modules && config.modules.length > 0) {
        for (const moduleName of config.modules) {
          spinner.text = `Running ${moduleName} module installer...`;

          // Pass installed IDEs and module config to module installer
          await this.moduleManager.runModuleInstaller(moduleName, bmadDir, {
            installedIDEs: config.ides || [],
            moduleConfig: moduleConfigs[moduleName] || {},
            coreConfig: moduleConfigs.core || {},
            logger: moduleLogger,
          });
        }
      }

      spinner.succeed('Module-specific installers completed');

      // Note: Manifest files are already created by ManifestGenerator above
      // No need to create legacy manifest.csv anymore

      // If this was an update, restore custom files
      let customFiles = [];
      let modifiedFiles = [];
      if (config._isUpdate) {
        if (config._customFiles && config._customFiles.length > 0) {
          spinner.start(`Restoring ${config._customFiles.length} custom files...`);

          for (const originalPath of config._customFiles) {
            const relativePath = path.relative(bmadDir, originalPath);
            const backupPath = path.join(config._tempBackupDir, relativePath);

            if (await fs.pathExists(backupPath)) {
              await fs.ensureDir(path.dirname(originalPath));
              await fs.copy(backupPath, originalPath, { overwrite: true });
            }
          }

          // Clean up temp backup
          if (config._tempBackupDir && (await fs.pathExists(config._tempBackupDir))) {
            await fs.remove(config._tempBackupDir);
          }

          spinner.succeed(`Restored ${config._customFiles.length} custom files`);
          customFiles = config._customFiles;
        }

        if (config._modifiedFiles && config._modifiedFiles.length > 0) {
          modifiedFiles = config._modifiedFiles;

          // Restore modified files as .bak files
          if (config._tempModifiedBackupDir && (await fs.pathExists(config._tempModifiedBackupDir))) {
            spinner.start(`Restoring ${modifiedFiles.length} modified files as .bak...`);

            for (const modifiedFile of modifiedFiles) {
              const relativePath = path.relative(bmadDir, modifiedFile.path);
              const tempBackupPath = path.join(config._tempModifiedBackupDir, relativePath);
              const bakPath = modifiedFile.path + '.bak';

              if (await fs.pathExists(tempBackupPath)) {
                await fs.ensureDir(path.dirname(bakPath));
                await fs.copy(tempBackupPath, bakPath, { overwrite: true });
              }
            }

            // Clean up temp backup
            await fs.remove(config._tempModifiedBackupDir);

            spinner.succeed(`Restored ${modifiedFiles.length} modified files as .bak`);
          }
        }
      }

      spinner.stop();

      // Report custom and modified files if any were found
      if (customFiles.length > 0) {
        console.log(chalk.cyan(`\n📁 Custom files preserved: ${customFiles.length}`));
      }

      if (modifiedFiles.length > 0) {
        console.log(chalk.yellow(`\n⚠️  User modified files detected: ${modifiedFiles.length}`));
        console.log(
          chalk.dim(
            '\nThese user modified files have been updated with the new version, search the project for .bak files that had your customizations.',
          ),
        );
        console.log(chalk.dim('Remove these .bak files it no longer needed\n'));
      }

      // Display completion message
      const { UI } = require('../../../lib/ui');
      const ui = new UI();
      ui.showInstallSummary({
        path: bmadDir,
        modules: config.modules,
        ides: config.ides,
        customFiles: customFiles.length > 0 ? customFiles : undefined,
      });

      return {
        success: true,
        path: bmadDir,
        modules: config.modules,
        ides: config.ides,
        projectDir: projectDir,
      };
    } catch (error) {
      spinner.fail('Installation failed');
      throw error;
    }
  }

  /**
   * Update existing installation
   */
  async update(config) {
    const spinner = ora('Checking installation...').start();

    try {
      const projectDir = path.resolve(config.directory);
      const { bmadDir } = await this.findBmadDir(projectDir);
      const existingInstall = await this.detector.detect(bmadDir);

      if (!existingInstall.installed) {
        spinner.fail('No BMAD installation found');
        throw new Error(`No BMAD installation found at ${bmadDir}`);
      }

      spinner.text = 'Analyzing update requirements...';

      // Compare versions and determine what needs updating
      const currentVersion = existingInstall.version;
      const newVersion = require(path.join(getProjectRoot(), 'package.json')).version;

      // Check for custom modules with missing sources before update
      const customModuleSources = new Map();

      // Check manifest for backward compatibility
      if (existingInstall.customModules) {
        for (const customModule of existingInstall.customModules) {
          customModuleSources.set(customModule.id, customModule);
        }
      }

      // Also check cache directory
      const cacheDir = path.join(bmadDir, '_config', 'custom');
      if (await fs.pathExists(cacheDir)) {
        const cachedModules = await fs.readdir(cacheDir, { withFileTypes: true });

        for (const cachedModule of cachedModules) {
          if (cachedModule.isDirectory()) {
            const moduleId = cachedModule.name;

            // Skip if we already have this module
            if (customModuleSources.has(moduleId)) {
              continue;
            }

            // Check if this is an external official module - skip cache for those
            const isExternal = await this.moduleManager.isExternalModule(moduleId);
            if (isExternal) {
              // External modules are handled via cloneExternalModule, not from cache
              continue;
            }

            const cachedPath = path.join(cacheDir, moduleId);

            // Check if this is actually a custom module (has module.yaml)
            const moduleYamlPath = path.join(cachedPath, 'module.yaml');
            if (await fs.pathExists(moduleYamlPath)) {
              customModuleSources.set(moduleId, {
                id: moduleId,
                name: moduleId,
                sourcePath: path.join('_config', 'custom', moduleId), // Relative path
                cached: true,
              });
            }
          }
        }
      }

      if (customModuleSources.size > 0) {
        spinner.stop();
        console.log(chalk.yellow('\nChecking custom module sources before update...'));

        const projectRoot = getProjectRoot();
        await this.handleMissingCustomSources(
          customModuleSources,
          bmadDir,
          projectRoot,
          'update',
          existingInstall.modules.map((m) => m.id),
        );

        spinner.start('Preparing update...');
      }

      if (config.dryRun) {
        spinner.stop();
        console.log(chalk.cyan('\n🔍 Update Preview (Dry Run)\n'));
        console.log(chalk.bold('Current version:'), currentVersion);
        console.log(chalk.bold('New version:'), newVersion);
        console.log(chalk.bold('Core:'), existingInstall.hasCore ? 'Will be updated' : 'Not installed');

        if (existingInstall.modules.length > 0) {
          console.log(chalk.bold('\nModules to update:'));
          for (const mod of existingInstall.modules) {
            console.log(`  - ${mod.id}`);
          }
        }
        return;
      }

      // Perform actual update
      if (existingInstall.hasCore) {
        spinner.text = 'Updating core...';
        await this.updateCore(bmadDir, config.force);
      }

      for (const module of existingInstall.modules) {
        spinner.text = `Updating module: ${module.id}...`;
        await this.moduleManager.update(module.id, bmadDir, config.force);
      }

      // Update manifest
      spinner.text = 'Updating manifest...';
      await this.manifest.update(bmadDir, {
        version: newVersion,
        updateDate: new Date().toISOString(),
      });

      spinner.succeed('Update complete');
      return { success: true };
    } catch (error) {
      spinner.fail('Update failed');
      throw error;
    }
  }

  /**
   * Get installation status
   */
  async getStatus(directory) {
    const projectDir = path.resolve(directory);
    const { bmadDir } = await this.findBmadDir(projectDir);
    return await this.detector.detect(bmadDir);
  }

  /**
   * Get available modules
   */
  async getAvailableModules() {
    return await this.moduleManager.listAvailable();
  }

  /**
   * Uninstall BMAD
   */
  async uninstall(directory) {
    const projectDir = path.resolve(directory);
    const { bmadDir } = await this.findBmadDir(projectDir);

    if (await fs.pathExists(bmadDir)) {
      await fs.remove(bmadDir);
    }

    // Clean up IDE configurations
    await this.ideManager.cleanup(projectDir);

    return { success: true };
  }

  /**
   * Private: Create directory structure
   */
  /**
   * Merge all module-help.csv files into a single bmad-help.csv
   * Scans all installed modules for module-help.csv and merges them
   * Enriches agent info from agent-manifest.csv
   * Output is written to _bmad/_config/bmad-help.csv
   * @param {string} bmadDir - BMAD installation directory
   */
  async mergeModuleHelpCatalogs(bmadDir) {
    const allRows = [];
    const headerRow =
      'module,phase,name,code,sequence,workflow-file,command,required,agent-name,agent-command,agent-display-name,agent-title,options,description,output-location,outputs';

    // Load agent manifest for agent info lookup
    const agentManifestPath = path.join(bmadDir, '_config', 'agent-manifest.csv');
    const agentInfo = new Map(); // agent-name -> {command, displayName, title+icon}

    if (await fs.pathExists(agentManifestPath)) {
      const manifestContent = await fs.readFile(agentManifestPath, 'utf8');
      const lines = manifestContent.split('\n').filter((line) => line.trim());

      for (const line of lines) {
        if (line.startsWith('name,')) continue; // Skip header

        const cols = line.split(',');
        if (cols.length >= 4) {
          const agentName = cols[0].replaceAll('"', '').trim();
          const displayName = cols[1].replaceAll('"', '').trim();
          const title = cols[2].replaceAll('"', '').trim();
          const icon = cols[3].replaceAll('"', '').trim();
          const module = cols[10] ? cols[10].replaceAll('"', '').trim() : '';

          // Build agent command: bmad:module:agent:name
          const agentCommand = module ? `bmad:${module}:agent:${agentName}` : `bmad:agent:${agentName}`;

          agentInfo.set(agentName, {
            command: agentCommand,
            displayName: displayName || agentName,
            title: icon && title ? `${icon} ${title}` : title || agentName,
          });
        }
      }
    }

    // Get all installed module directories
    const entries = await fs.readdir(bmadDir, { withFileTypes: true });
    const installedModules = entries
      .filter((entry) => entry.isDirectory() && entry.name !== '_config' && entry.name !== 'docs' && entry.name !== '_memory')
      .map((entry) => entry.name);

    // Add core module to scan (it's installed at root level as _config, but we check src/core)
    const coreModulePath = getSourcePath('core');
    const modulePaths = new Map();

    // Map all module source paths
    if (await fs.pathExists(coreModulePath)) {
      modulePaths.set('core', coreModulePath);
    }

    // Map installed module paths
    for (const moduleName of installedModules) {
      const modulePath = path.join(bmadDir, moduleName);
      modulePaths.set(moduleName, modulePath);
    }

    // Scan each module for module-help.csv
    for (const [moduleName, modulePath] of modulePaths) {
      const helpFilePath = path.join(modulePath, 'module-help.csv');

      if (await fs.pathExists(helpFilePath)) {
        try {
          const content = await fs.readFile(helpFilePath, 'utf8');
          const lines = content.split('\n').filter((line) => line.trim() && !line.startsWith('#'));

          for (const line of lines) {
            // Skip header row
            if (line.startsWith('module,')) {
              continue;
            }

            // Parse the line - handle quoted fields with commas
            const columns = this.parseCSVLine(line);
            if (columns.length >= 12) {
              // Map old schema to new schema
              // Old: module,phase,name,code,sequence,workflow-file,command,required,agent,options,description,output-location,outputs
              // New: module,phase,name,code,sequence,workflow-file,command,required,agent-name,agent-command,agent-display-name,agent-title,options,description,output-location,outputs

              const [
                module,
                phase,
                name,
                code,
                sequence,
                workflowFile,
                command,
                required,
                agentName,
                options,
                description,
                outputLocation,
                outputs,
              ] = columns;

              // If module column is empty, set it to this module's name (except for core which stays empty for universal tools)
              const finalModule = (!module || module.trim() === '') && moduleName !== 'core' ? moduleName : module || '';

              // Lookup agent info
              const cleanAgentName = agentName ? agentName.trim() : '';
              const agentData = agentInfo.get(cleanAgentName) || { command: '', displayName: '', title: '' };

              // Build new row with agent info
              const newRow = [
                finalModule,
                phase || '',
                name || '',
                code || '',
                sequence || '',
                workflowFile || '',
                command || '',
                required || 'false',
                cleanAgentName,
                agentData.command,
                agentData.displayName,
                agentData.title,
                options || '',
                description || '',
                outputLocation || '',
                outputs || '',
              ];

              allRows.push(newRow.map((c) => this.escapeCSVField(c)).join(','));
            }
          }

          if (process.env.BMAD_VERBOSE_INSTALL === 'true') {
            console.log(chalk.dim(`  Merged module-help from: ${moduleName}`));
          }
        } catch (error) {
          console.warn(chalk.yellow(`  Warning: Failed to read module-help.csv from ${moduleName}:`, error.message));
        }
      }
    }

    // Sort by module, then phase, then sequence
    allRows.sort((a, b) => {
      const colsA = this.parseCSVLine(a);
      const colsB = this.parseCSVLine(b);

      // Module comparison (empty module/universal tools come first)
      const moduleA = (colsA[0] || '').toLowerCase();
      const moduleB = (colsB[0] || '').toLowerCase();
      if (moduleA !== moduleB) {
        return moduleA.localeCompare(moduleB);
      }

      // Phase comparison
      const phaseA = colsA[1] || '';
      const phaseB = colsB[1] || '';
      if (phaseA !== phaseB) {
        return phaseA.localeCompare(phaseB);
      }

      // Sequence comparison
      const seqA = parseInt(colsA[4] || '0', 10);
      const seqB = parseInt(colsB[4] || '0', 10);
      return seqA - seqB;
    });

    // Write merged catalog
    const outputDir = path.join(bmadDir, '_config');
    await fs.ensureDir(outputDir);
    const outputPath = path.join(outputDir, 'bmad-help.csv');

    const mergedContent = [headerRow, ...allRows].join('\n');
    await fs.writeFile(outputPath, mergedContent, 'utf8');

    // Track the installed file
    this.installedFiles.add(outputPath);

    if (process.env.BMAD_VERBOSE_INSTALL === 'true') {
      console.log(chalk.dim(`  Generated bmad-help.csv: ${allRows.length} workflows`));
    }
  }

  /**
   * Parse a CSV line, handling quoted fields
   * @param {string} line - CSV line to parse
   * @returns {Array} Array of field values
   */
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }

  /**
   * Escape a CSV field if it contains special characters
   * @param {string} field - Field value to escape
   * @returns {string} Escaped field
   */
  escapeCSVField(field) {
    if (field === null || field === undefined) {
      return '';
    }
    const str = String(field);
    // If field contains comma, quote, or newline, wrap in quotes and escape inner quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replaceAll('"', '""')}"`;
    }
    return str;
  }

  async createDirectoryStructure(bmadDir) {
    await fs.ensureDir(bmadDir);
    await fs.ensureDir(path.join(bmadDir, '_config'));
    await fs.ensureDir(path.join(bmadDir, '_config', 'agents'));
    await fs.ensureDir(path.join(bmadDir, '_config', 'custom'));
  }

  /**
   * Generate clean config.yaml files for each installed module
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} moduleConfigs - Collected configuration values
   */
  async generateModuleConfigs(bmadDir, moduleConfigs) {
    const yaml = require('yaml');

    // Extract core config values to share with other modules
    const coreConfig = moduleConfigs.core || {};

    // Get all installed module directories
    const entries = await fs.readdir(bmadDir, { withFileTypes: true });
    const installedModules = entries
      .filter((entry) => entry.isDirectory() && entry.name !== '_config' && entry.name !== 'docs')
      .map((entry) => entry.name);

    // Generate config.yaml for each installed module
    for (const moduleName of installedModules) {
      const modulePath = path.join(bmadDir, moduleName);

      // Get module-specific config or use empty object if none
      const config = moduleConfigs[moduleName] || {};

      if (await fs.pathExists(modulePath)) {
        const configPath = path.join(modulePath, 'config.yaml');

        // Create header
        const packageJson = require(path.join(getProjectRoot(), 'package.json'));
        const header = `# ${moduleName.toUpperCase()} Module Configuration
# Generated by BMAD installer
# Version: ${packageJson.version}
# Date: ${new Date().toISOString()}

`;

        // For non-core modules, add core config values directly
        let finalConfig = { ...config };
        let coreSection = '';

        if (moduleName !== 'core' && coreConfig && Object.keys(coreConfig).length > 0) {
          // Add core values directly to the module config
          // These will be available for reference in the module
          finalConfig = {
            ...config,
            ...coreConfig, // Spread core config values directly into the module config
          };

          // Create a comment section to identify core values
          coreSection = '\n# Core Configuration Values\n';
        }

        // Clean the config to remove any non-serializable values (like functions)
        const cleanConfig = structuredClone(finalConfig);

        // Convert config to YAML
        let yamlContent = yaml.stringify(cleanConfig, {
          indent: 2,
          lineWidth: 0,
          minContentWidth: 0,
        });

        // If we have core values, reorganize the YAML to group them with their comment
        if (coreSection && moduleName !== 'core') {
          // Split the YAML into lines
          const lines = yamlContent.split('\n');
          const moduleConfigLines = [];
          const coreConfigLines = [];

          // Separate module-specific and core config lines
          for (const line of lines) {
            const key = line.split(':')[0].trim();
            if (Object.prototype.hasOwnProperty.call(coreConfig, key)) {
              coreConfigLines.push(line);
            } else {
              moduleConfigLines.push(line);
            }
          }

          // Rebuild YAML with module config first, then core config with comment
          yamlContent = moduleConfigLines.join('\n');
          if (coreConfigLines.length > 0) {
            yamlContent += coreSection + coreConfigLines.join('\n');
          }
        }

        // Write the clean config file with POSIX-compliant final newline
        const content = header + yamlContent;
        await fs.writeFile(configPath, content.endsWith('\n') ? content : content + '\n', 'utf8');

        // Track the config file in installedFiles
        this.installedFiles.add(configPath);
      }
    }
  }

  /**
   * Install core with resolved dependencies
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} coreFiles - Core files to install
   */
  async installCoreWithDependencies(bmadDir, coreFiles) {
    const sourcePath = getModulePath('core');
    const targetPath = path.join(bmadDir, 'core');
    await this.installCore(bmadDir);
  }

  /**
   * Install module with resolved dependencies
   * @param {string} moduleName - Module name
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} moduleFiles - Module files to install
   */
  async installModuleWithDependencies(moduleName, bmadDir, moduleFiles) {
    // Get module configuration for conditional installation
    const moduleConfig = this.configCollector.collectedConfig[moduleName] || {};

    // Use existing module manager for full installation with file tracking
    // Note: Module-specific installers are called separately after IDE setup
    await this.moduleManager.install(
      moduleName,
      bmadDir,
      (filePath) => {
        this.installedFiles.add(filePath);
      },
      {
        skipModuleInstaller: true, // We'll run it later after IDE setup
        moduleConfig: moduleConfig, // Pass module config for conditional filtering
        installer: this,
      },
    );

    // Process agent files to build YAML agents and create customize templates
    const modulePath = path.join(bmadDir, moduleName);
    await this.processAgentFiles(modulePath, moduleName);

    // Dependencies are already included in full module install
  }

  /**
   * Install partial module (only dependencies needed by other modules)
   */
  async installPartialModule(moduleName, bmadDir, files) {
    const sourceBase = getModulePath(moduleName);
    const targetBase = path.join(bmadDir, moduleName);

    // Create module directory
    await fs.ensureDir(targetBase);

    // Copy only the required dependency files
    if (files.agents && files.agents.length > 0) {
      const agentsDir = path.join(targetBase, 'agents');
      await fs.ensureDir(agentsDir);

      for (const agentPath of files.agents) {
        const fileName = path.basename(agentPath);
        const sourcePath = path.join(sourceBase, 'agents', fileName);
        const targetPath = path.join(agentsDir, fileName);

        if (await fs.pathExists(sourcePath)) {
          await this.copyFileWithPlaceholderReplacement(sourcePath, targetPath);
          this.installedFiles.add(targetPath);
        }
      }
    }

    if (files.tasks && files.tasks.length > 0) {
      const tasksDir = path.join(targetBase, 'tasks');
      await fs.ensureDir(tasksDir);

      for (const taskPath of files.tasks) {
        const fileName = path.basename(taskPath);
        const sourcePath = path.join(sourceBase, 'tasks', fileName);
        const targetPath = path.join(tasksDir, fileName);

        if (await fs.pathExists(sourcePath)) {
          await this.copyFileWithPlaceholderReplacement(sourcePath, targetPath);
          this.installedFiles.add(targetPath);
        }
      }
    }

    if (files.tools && files.tools.length > 0) {
      const toolsDir = path.join(targetBase, 'tools');
      await fs.ensureDir(toolsDir);

      for (const toolPath of files.tools) {
        const fileName = path.basename(toolPath);
        const sourcePath = path.join(sourceBase, 'tools', fileName);
        const targetPath = path.join(toolsDir, fileName);

        if (await fs.pathExists(sourcePath)) {
          await this.copyFileWithPlaceholderReplacement(sourcePath, targetPath);
          this.installedFiles.add(targetPath);
        }
      }
    }

    if (files.templates && files.templates.length > 0) {
      const templatesDir = path.join(targetBase, 'templates');
      await fs.ensureDir(templatesDir);

      for (const templatePath of files.templates) {
        const fileName = path.basename(templatePath);
        const sourcePath = path.join(sourceBase, 'templates', fileName);
        const targetPath = path.join(templatesDir, fileName);

        if (await fs.pathExists(sourcePath)) {
          await this.copyFileWithPlaceholderReplacement(sourcePath, targetPath);
          this.installedFiles.add(targetPath);
        }
      }
    }

    if (files.data && files.data.length > 0) {
      for (const dataPath of files.data) {
        // Preserve directory structure for data files
        const relative = path.relative(sourceBase, dataPath);
        const targetPath = path.join(targetBase, relative);

        await fs.ensureDir(path.dirname(targetPath));

        if (await fs.pathExists(dataPath)) {
          await this.copyFileWithPlaceholderReplacement(dataPath, targetPath);
          this.installedFiles.add(targetPath);
        }
      }
    }

    // Create a marker file to indicate this is a partial installation
    const markerPath = path.join(targetBase, '.partial');
    await fs.writeFile(
      markerPath,
      `This module contains only dependencies required by other modules.\nInstalled: ${new Date().toISOString()}\n`,
    );
  }

  /**
   * Private: Install core
   * @param {string} bmadDir - BMAD installation directory
   */
  async installCore(bmadDir) {
    const sourcePath = getModulePath('core');
    const targetPath = path.join(bmadDir, 'core');

    // Copy core files (skip .agent.yaml files like modules do)
    await this.copyCoreFiles(sourcePath, targetPath);

    // Compile agents using the same compiler as modules
    const { ModuleManager } = require('../modules/manager');
    const moduleManager = new ModuleManager();
    await moduleManager.compileModuleAgents(sourcePath, targetPath, 'core', bmadDir, this);

    // Process agent files to inject activation block
    await this.processAgentFiles(targetPath, 'core');
  }

  /**
   * Copy core files (similar to copyModuleWithFiltering but for core)
   * @param {string} sourcePath - Source path
   * @param {string} targetPath - Target path
   */
  async copyCoreFiles(sourcePath, targetPath) {
    // Get all files in source
    const files = await this.getFileList(sourcePath);

    for (const file of files) {
      // Skip sub-modules directory - these are IDE-specific and handled separately
      if (file.startsWith('sub-modules/')) {
        continue;
      }

      // Skip sidecar directories - they are handled separately during agent compilation
      if (
        path
          .dirname(file)
          .split('/')
          .some((dir) => dir.toLowerCase().includes('sidecar'))
      ) {
        continue;
      }

      // Skip _module-installer directory - it's only needed at install time
      if (file.startsWith('_module-installer/') || file === 'module.yaml') {
        continue;
      }

      // Skip config.yaml templates - we'll generate clean ones with actual values
      if (file === 'config.yaml' || file.endsWith('/config.yaml') || file === 'custom.yaml' || file.endsWith('/custom.yaml')) {
        continue;
      }

      // Skip .agent.yaml files - they will be compiled separately
      if (file.endsWith('.agent.yaml')) {
        continue;
      }

      const sourceFile = path.join(sourcePath, file);
      const targetFile = path.join(targetPath, file);

      // Check if this is an agent file
      if (file.startsWith('agents/') && file.endsWith('.md')) {
        // Read the file to check for localskip
        const content = await fs.readFile(sourceFile, 'utf8');

        // Check for localskip="true" in the agent tag
        const agentMatch = content.match(/<agent[^>]*\slocalskip="true"[^>]*>/);
        if (agentMatch) {
          console.log(chalk.dim(`  Skipping web-only agent: ${path.basename(file)}`));
          continue; // Skip this agent
        }
      }

      // Copy the file with placeholder replacement
      await fs.ensureDir(path.dirname(targetFile));
      await this.copyFileWithPlaceholderReplacement(sourceFile, targetFile);

      // Track the installed file
      this.installedFiles.add(targetFile);
    }
  }

  /**
   * Get list of all files in a directory recursively
   * @param {string} dir - Directory path
   * @param {string} baseDir - Base directory for relative paths
   * @returns {Array} List of relative file paths
   */
  async getFileList(dir, baseDir = dir) {
    const files = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip _module-installer directories
        if (entry.name === '_module-installer') {
          continue;
        }
        const subFiles = await this.getFileList(fullPath, baseDir);
        files.push(...subFiles);
      } else {
        files.push(path.relative(baseDir, fullPath));
      }
    }

    return files;
  }

  /**
   * Process agent files to build YAML agents and inject activation blocks
   * @param {string} modulePath - Path to module in bmad/ installation
   * @param {string} moduleName - Module name
   */
  async processAgentFiles(modulePath, moduleName) {
    const agentsPath = path.join(modulePath, 'agents');

    // Check if agents directory exists
    if (!(await fs.pathExists(agentsPath))) {
      return; // No agents to process
    }

    // Determine project directory (parent of bmad/ directory)
    const bmadDir = path.dirname(modulePath);
    const cfgAgentsDir = path.join(bmadDir, '_config', 'agents');

    // Ensure _config/agents directory exists
    await fs.ensureDir(cfgAgentsDir);

    // Get all agent files
    const agentFiles = await fs.readdir(agentsPath);

    for (const agentFile of agentFiles) {
      // Skip .agent.yaml files - they should already be compiled by compileModuleAgents
      if (agentFile.endsWith('.agent.yaml')) {
        continue;
      }

      // Only process .md files (already compiled from YAML)
      if (!agentFile.endsWith('.md')) {
        continue;
      }

      const agentName = agentFile.replace('.md', '');
      const mdPath = path.join(agentsPath, agentFile);
      const customizePath = path.join(cfgAgentsDir, `${moduleName}-${agentName}.customize.yaml`);

      // For .md files that are already compiled, we don't need to do much
      // Just ensure the customize template exists
      if (!(await fs.pathExists(customizePath))) {
        const genericTemplatePath = getSourcePath('utility', 'agent-components', 'agent.customize.template.yaml');
        if (await fs.pathExists(genericTemplatePath)) {
          await this.copyFileWithPlaceholderReplacement(genericTemplatePath, customizePath);
          if (process.env.BMAD_VERBOSE_INSTALL === 'true') {
            console.log(chalk.dim(`  Created customize: ${moduleName}-${agentName}.customize.yaml`));
          }
        }
      }
    }
  }

  /**
   * Private: Update core
   */
  async updateCore(bmadDir, force = false) {
    const sourcePath = getModulePath('core');
    const targetPath = path.join(bmadDir, 'core');

    if (force) {
      await fs.remove(targetPath);
      await this.installCore(bmadDir);
    } else {
      // Selective update - preserve user modifications
      await this.fileOps.syncDirectory(sourcePath, targetPath);

      // Recompile agents (#1133)
      const { ModuleManager } = require('../modules/manager');
      const moduleManager = new ModuleManager();
      await moduleManager.compileModuleAgents(sourcePath, targetPath, 'core', bmadDir, this);
      await this.processAgentFiles(targetPath, 'core');
    }
  }

  /**
   * Quick update method - preserves all settings and only prompts for new config fields
   * @param {Object} config - Configuration with directory
   * @returns {Object} Update result
   */
  async quickUpdate(config) {
    const ora = require('ora');
    const spinner = ora('Starting quick update...').start();

    try {
      const projectDir = path.resolve(config.directory);
      const { bmadDir } = await this.findBmadDir(projectDir);

      // Check if bmad directory exists
      if (!(await fs.pathExists(bmadDir))) {
        spinner.fail('No BMAD installation found');
        throw new Error(`BMAD not installed at ${bmadDir}. Use regular install for first-time setup.`);
      }

      spinner.text = 'Detecting installed modules and configuration...';

      // Detect existing installation
      const existingInstall = await this.detector.detect(bmadDir);
      const installedModules = existingInstall.modules.map((m) => m.id);
      const configuredIdes = existingInstall.ides || [];
      const projectRoot = path.dirname(bmadDir);

      // Get custom module sources from cache
      const customModuleSources = new Map();
      const cacheDir = path.join(bmadDir, '_config', 'custom');
      if (await fs.pathExists(cacheDir)) {
        const cachedModules = await fs.readdir(cacheDir, { withFileTypes: true });

        for (const cachedModule of cachedModules) {
          if (cachedModule.isDirectory()) {
            const moduleId = cachedModule.name;

            // Skip if we already have this module from manifest
            if (customModuleSources.has(moduleId)) {
              continue;
            }

            // Check if this is an external official module - skip cache for those
            const isExternal = await this.moduleManager.isExternalModule(moduleId);
            if (isExternal) {
              // External modules are handled via cloneExternalModule, not from cache
              continue;
            }

            const cachedPath = path.join(cacheDir, moduleId);

            // Check if this is actually a custom module (has module.yaml)
            const moduleYamlPath = path.join(cachedPath, 'module.yaml');
            if (await fs.pathExists(moduleYamlPath)) {
              // For quick update, we always rebuild from cache
              customModuleSources.set(moduleId, {
                id: moduleId,
                name: moduleId, // We'll read the actual name if needed
                sourcePath: cachedPath,
                cached: true, // Flag to indicate this is from cache
              });
            }
          }
        }
      }

      // Load saved IDE configurations
      const savedIdeConfigs = await this.ideConfigManager.loadAllIdeConfigs(bmadDir);

      // Get available modules (what we have source for)
      const availableModulesData = await this.moduleManager.listAvailable();
      const availableModules = [...availableModulesData.modules, ...availableModulesData.customModules];

      // Add external official modules to available modules
      // These can always be obtained by cloning from their remote URLs
      const { ExternalModuleManager } = require('../modules/external-manager');
      const externalManager = new ExternalModuleManager();
      const externalModules = await externalManager.listAvailable();
      for (const externalModule of externalModules) {
        // Only add if not already in the list and is installed
        if (installedModules.includes(externalModule.code) && !availableModules.some((m) => m.id === externalModule.code)) {
          availableModules.push({
            id: externalModule.code,
            name: externalModule.name,
            isExternal: true,
            fromExternal: true,
          });
        }
      }

      // Add custom modules from manifest if their sources exist
      for (const [moduleId, customModule] of customModuleSources) {
        // Use the absolute sourcePath
        const sourcePath = customModule.sourcePath;

        // Check if source exists at the recorded path
        if (
          sourcePath &&
          (await fs.pathExists(sourcePath)) && // Add to available modules if not already there
          !availableModules.some((m) => m.id === moduleId)
        ) {
          availableModules.push({
            id: moduleId,
            name: customModule.name || moduleId,
            path: sourcePath,
            isCustom: true,
            fromManifest: true,
          });
        }
      }

      // Handle missing custom module sources using shared method
      const customModuleResult = await this.handleMissingCustomSources(
        customModuleSources,
        bmadDir,
        projectRoot,
        'update',
        installedModules,
      );

      const { validCustomModules, keptModulesWithoutSources } = customModuleResult;

      const customModulesFromManifest = validCustomModules.map((m) => ({
        ...m,
        isCustom: true,
        hasUpdate: true,
      }));

      const allAvailableModules = [...availableModules, ...customModulesFromManifest];
      const availableModuleIds = new Set(allAvailableModules.map((m) => m.id));

      // Core module is special - never include it in update flow
      const nonCoreInstalledModules = installedModules.filter((id) => id !== 'core');

      // Only update modules that are BOTH installed AND available (we have source for)
      const modulesToUpdate = nonCoreInstalledModules.filter((id) => availableModuleIds.has(id));
      const skippedModules = nonCoreInstalledModules.filter((id) => !availableModuleIds.has(id));

      // Add custom modules that were kept without sources to the skipped modules
      // This ensures their agents are preserved in the manifest
      for (const keptModule of keptModulesWithoutSources) {
        if (!skippedModules.includes(keptModule)) {
          skippedModules.push(keptModule);
        }
      }

      spinner.succeed(`Found ${modulesToUpdate.length} module(s) to update and ${configuredIdes.length} configured tool(s)`);

      if (skippedModules.length > 0) {
        console.log(chalk.yellow(`⚠️  Skipping ${skippedModules.length} module(s) - no source available: ${skippedModules.join(', ')}`));
      }

      // Load existing configs and collect new fields (if any)
      console.log(chalk.cyan('\n📋 Checking for new configuration options...'));
      await this.configCollector.loadExistingConfig(projectDir);

      let promptedForNewFields = false;

      // Check core config for new fields
      const corePrompted = await this.configCollector.collectModuleConfigQuick('core', projectDir, true);
      if (corePrompted) {
        promptedForNewFields = true;
      }

      // Check each module we're updating for new fields (NOT skipped modules)
      for (const moduleName of modulesToUpdate) {
        const modulePrompted = await this.configCollector.collectModuleConfigQuick(moduleName, projectDir, true);
        if (modulePrompted) {
          promptedForNewFields = true;
        }
      }

      if (!promptedForNewFields) {
        console.log(chalk.green('✓ All configuration is up to date, no new options to configure'));
      }

      // Add metadata
      this.configCollector.collectedConfig._meta = {
        version: require(path.join(getProjectRoot(), 'package.json')).version,
        installDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };

      // Build the config object for the installer
      const installConfig = {
        directory: projectDir,
        installCore: true,
        modules: modulesToUpdate, // Only update modules we have source for
        ides: configuredIdes,
        skipIde: configuredIdes.length === 0,
        coreConfig: this.configCollector.collectedConfig.core,
        actionType: 'install', // Use regular install flow
        _quickUpdate: true, // Flag to skip certain prompts
        _preserveModules: skippedModules, // Preserve these in manifest even though we didn't update them
        _savedIdeConfigs: savedIdeConfigs, // Pass saved IDE configs to installer
        _customModuleSources: customModuleSources, // Pass custom module sources for updates
        _existingModules: installedModules, // Pass all installed modules for manifest generation
      };

      // Call the standard install method
      const result = await this.install(installConfig);

      // Only succeed the spinner if it's still spinning
      // (install method might have stopped it if folder name changed)
      if (spinner.isSpinning) {
        spinner.succeed('Quick update complete!');
      }

      return {
        success: true,
        moduleCount: modulesToUpdate.length + 1, // +1 for core
        hadNewFields: promptedForNewFields,
        modules: ['core', ...modulesToUpdate],
        skippedModules: skippedModules,
        ides: configuredIdes,
      };
    } catch (error) {
      spinner.fail('Quick update failed');
      throw error;
    }
  }

  /**
   * Compile agents with customizations only
   * @param {Object} config - Configuration with directory
   * @returns {Object} Compilation result
   */
  async compileAgents(config) {
    const ora = require('ora');
    const chalk = require('chalk');
    const { ModuleManager } = require('../modules/manager');
    const { getSourcePath } = require('../../../lib/project-root');

    const spinner = ora('Recompiling agents with customizations...').start();

    try {
      const projectDir = path.resolve(config.directory);
      const { bmadDir } = await this.findBmadDir(projectDir);

      // Check if bmad directory exists
      if (!(await fs.pathExists(bmadDir))) {
        spinner.fail('No BMAD installation found');
        throw new Error(`BMAD not installed at ${bmadDir}. Use regular install for first-time setup.`);
      }

      // Detect existing installation
      const existingInstall = await this.detector.detect(bmadDir);
      const installedModules = existingInstall.modules.map((m) => m.id);

      // Initialize module manager
      const moduleManager = new ModuleManager();
      moduleManager.setBmadFolderName(path.basename(bmadDir));

      let totalAgentCount = 0;

      // Get custom module sources from cache
      const customModuleSources = new Map();
      const cacheDir = path.join(bmadDir, '_config', 'custom');
      if (await fs.pathExists(cacheDir)) {
        const cachedModules = await fs.readdir(cacheDir, { withFileTypes: true });

        for (const cachedModule of cachedModules) {
          if (cachedModule.isDirectory()) {
            const moduleId = cachedModule.name;
            const cachedPath = path.join(cacheDir, moduleId);
            const moduleYamlPath = path.join(cachedPath, 'module.yaml');

            // Check if this is actually a custom module
            if (await fs.pathExists(moduleYamlPath)) {
              // Check if this is an external official module - skip cache for those
              const isExternal = await this.moduleManager.isExternalModule(moduleId);
              if (isExternal) {
                // External modules are handled via cloneExternalModule, not from cache
                continue;
              }
              customModuleSources.set(moduleId, cachedPath);
            }
          }
        }
      }

      // Process each installed module
      for (const moduleId of installedModules) {
        spinner.text = `Recompiling agents in ${moduleId}...`;

        // Get source path
        let sourcePath;
        if (moduleId === 'core') {
          sourcePath = getSourcePath('core');
        } else {
          // First check if it's in the custom cache
          if (customModuleSources.has(moduleId)) {
            sourcePath = customModuleSources.get(moduleId);
          } else {
            sourcePath = await moduleManager.findModuleSource(moduleId);
          }
        }

        if (!sourcePath) {
          console.log(chalk.yellow(`  Warning: Source not found for module ${moduleId}, skipping...`));
          continue;
        }

        const targetPath = path.join(bmadDir, moduleId);

        // Compile agents for this module
        await moduleManager.compileModuleAgents(sourcePath, targetPath, moduleId, bmadDir, this);

        // Count agents (rough estimate based on files)
        const agentsPath = path.join(targetPath, 'agents');
        if (await fs.pathExists(agentsPath)) {
          const agentFiles = await fs.readdir(agentsPath);
          const agentCount = agentFiles.filter((f) => f.endsWith('.md')).length;
          totalAgentCount += agentCount;
        }
      }

      spinner.succeed('Agent recompilation complete!');

      return {
        success: true,
        agentCount: totalAgentCount,
        modules: installedModules,
      };
    } catch (error) {
      spinner.fail('Agent recompilation failed');
      throw error;
    }
  }

  /**
   * Private: Prompt for update action
   */
  async promptUpdateAction() {
    const action = await prompts.select({
      message: 'What would you like to do?',
      choices: [{ name: 'Update existing installation', value: 'update' }],
    });
    return { action };
  }

  /**
   * Handle legacy BMAD v4 detection with simple warning
   * @param {string} _projectDir - Project directory (unused in simplified version)
   * @param {Object} _legacyV4 - Legacy V4 detection result (unused in simplified version)
   */
  async handleLegacyV4Migration(_projectDir, _legacyV4) {
    console.log('');
    console.log(chalk.yellow.bold('⚠️  Legacy BMAD v4 detected'));
    console.log(chalk.yellow('─'.repeat(80)));
    console.log(chalk.yellow('Found .bmad-method folder from BMAD v4 installation.'));
    console.log('');

    console.log(chalk.dim('Before continuing with installation, we recommend:'));
    console.log(chalk.dim('  1. Remove the .bmad-method folder, OR'));
    console.log(chalk.dim('  2. Back it up by renaming it to another name (e.g., bmad-method-backup)'));
    console.log('');

    console.log(chalk.dim('If your v4 installation set up rules or commands, you should remove those as well.'));
    console.log('');

    const proceed = await prompts.select({
      message: 'What would you like to do?',
      choices: [
        {
          name: 'Exit and clean up manually (recommended)',
          value: 'exit',
          hint: 'Exit installation',
        },
        {
          name: 'Continue with installation anyway',
          value: 'continue',
          hint: 'Continue',
        },
      ],
      default: 'exit',
    });

    if (proceed === 'exit') {
      console.log('');
      console.log(chalk.cyan('Please remove the .bmad-method folder and any v4 rules/commands,'));
      console.log(chalk.cyan('then run the installer again.'));
      console.log('');
      process.exit(0);
    }

    console.log('');
    console.log(chalk.yellow('⚠️  Proceeding with installation despite legacy v4 folder'));
    console.log('');
  }

  /**
   * Read files-manifest.csv
   * @param {string} bmadDir - BMAD installation directory
   * @returns {Array} Array of file entries from files-manifest.csv
   */
  async readFilesManifest(bmadDir) {
    const filesManifestPath = path.join(bmadDir, '_config', 'files-manifest.csv');
    if (!(await fs.pathExists(filesManifestPath))) {
      return [];
    }

    try {
      const content = await fs.readFile(filesManifestPath, 'utf8');
      const lines = content.split('\n');
      const files = [];

      for (let i = 1; i < lines.length; i++) {
        // Skip header
        const line = lines[i].trim();
        if (!line) continue;

        // Parse CSV line properly handling quoted values
        const parts = [];
        let current = '';
        let inQuotes = false;

        for (const char of line) {
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            parts.push(current);
            current = '';
          } else {
            current += char;
          }
        }
        parts.push(current); // Add last part

        if (parts.length >= 4) {
          files.push({
            type: parts[0],
            name: parts[1],
            module: parts[2],
            path: parts[3],
            hash: parts[4] || null, // Hash may not exist in old manifests
          });
        }
      }

      return files;
    } catch (error) {
      console.warn('Warning: Could not read files-manifest.csv:', error.message);
      return [];
    }
  }

  /**
   * Detect custom and modified files
   * @param {string} bmadDir - BMAD installation directory
   * @param {Array} existingFilesManifest - Previous files from files-manifest.csv
   * @returns {Object} Object with customFiles and modifiedFiles arrays
   */
  async detectCustomFiles(bmadDir, existingFilesManifest) {
    const customFiles = [];
    const modifiedFiles = [];

    // Memory is always in _bmad/_memory
    const bmadMemoryPath = '_memory';

    // Check if the manifest has hashes - if not, we can't detect modifications
    let manifestHasHashes = false;
    if (existingFilesManifest && existingFilesManifest.length > 0) {
      manifestHasHashes = existingFilesManifest.some((f) => f.hash);
    }

    // Build map of previously installed files from files-manifest.csv with their hashes
    const installedFilesMap = new Map();
    for (const fileEntry of existingFilesManifest) {
      if (fileEntry.path) {
        const absolutePath = path.join(bmadDir, fileEntry.path);
        installedFilesMap.set(path.normalize(absolutePath), {
          hash: fileEntry.hash,
          relativePath: fileEntry.path,
        });
      }
    }

    // Recursively scan bmadDir for all files
    const scanDirectory = async (dir) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            // Skip certain directories
            if (entry.name === 'node_modules' || entry.name === '.git') {
              continue;
            }
            await scanDirectory(fullPath);
          } else if (entry.isFile()) {
            const normalizedPath = path.normalize(fullPath);
            const fileInfo = installedFilesMap.get(normalizedPath);

            // Skip certain system files that are auto-generated
            const relativePath = path.relative(bmadDir, fullPath);
            const fileName = path.basename(fullPath);

            // Skip _config directory EXCEPT for modified agent customizations
            if (relativePath.startsWith('_config/') || relativePath.startsWith('_config\\')) {
              // Special handling for .customize.yaml files - only preserve if modified
              if (relativePath.includes('/agents/') && fileName.endsWith('.customize.yaml')) {
                // Check if the customization file has been modified from manifest
                const manifestPath = path.join(bmadDir, '_config', 'manifest.yaml');
                if (await fs.pathExists(manifestPath)) {
                  const crypto = require('node:crypto');
                  const currentContent = await fs.readFile(fullPath, 'utf8');
                  const currentHash = crypto.createHash('sha256').update(currentContent).digest('hex');

                  const yaml = require('yaml');
                  const manifestContent = await fs.readFile(manifestPath, 'utf8');
                  const manifestData = yaml.parse(manifestContent);
                  const originalHash = manifestData.agentCustomizations?.[relativePath];

                  // Only add to customFiles if hash differs (user modified)
                  if (originalHash && currentHash !== originalHash) {
                    customFiles.push(fullPath);
                  }
                }
              }
              continue;
            }

            if (relativePath.startsWith(bmadMemoryPath + '/') && path.dirname(relativePath).includes('-sidecar')) {
              continue;
            }

            // Skip config.yaml files - these are regenerated on each install/update
            if (fileName === 'config.yaml') {
              continue;
            }

            if (!fileInfo) {
              // File not in manifest = custom file
              // EXCEPT: Agent .md files in module folders are generated files, not custom
              // Only treat .md files under _config/agents/ as custom
              if (!(fileName.endsWith('.md') && relativePath.includes('/agents/') && !relativePath.startsWith('_config/'))) {
                customFiles.push(fullPath);
              }
            } else if (manifestHasHashes && fileInfo.hash) {
              // File in manifest with hash - check if it was modified
              const currentHash = await this.manifest.calculateFileHash(fullPath);
              if (currentHash && currentHash !== fileInfo.hash) {
                // Hash changed = file was modified
                modifiedFiles.push({
                  path: fullPath,
                  relativePath: fileInfo.relativePath,
                });
              }
            }
          }
        }
      } catch {
        // Ignore errors scanning directories
      }
    };

    await scanDirectory(bmadDir);
    return { customFiles, modifiedFiles };
  }

  /**
   * Handle missing custom module sources interactively
   * @param {Map} customModuleSources - Map of custom module ID to info
   * @param {string} bmadDir - BMAD directory
   * @param {string} projectRoot - Project root directory
   * @param {string} operation - Current operation ('update', 'compile', etc.)
   * @param {Array} installedModules - Array of installed module IDs (will be modified)
   * @returns {Object} Object with validCustomModules array and keptModulesWithoutSources array
   */
  async handleMissingCustomSources(customModuleSources, bmadDir, projectRoot, operation, installedModules) {
    const validCustomModules = [];
    const keptModulesWithoutSources = []; // Track modules kept without sources
    const customModulesWithMissingSources = [];

    // Check which sources exist
    for (const [moduleId, customInfo] of customModuleSources) {
      if (await fs.pathExists(customInfo.sourcePath)) {
        validCustomModules.push({
          id: moduleId,
          name: customInfo.name,
          path: customInfo.sourcePath,
          info: customInfo,
        });
      } else {
        // For cached modules that are missing, we just skip them without prompting
        if (customInfo.cached) {
          // Skip cached modules without prompting
          keptModulesWithoutSources.push({
            id: moduleId,
            name: customInfo.name,
            cached: true,
          });
        } else {
          customModulesWithMissingSources.push({
            id: moduleId,
            name: customInfo.name,
            sourcePath: customInfo.sourcePath,
            relativePath: customInfo.relativePath,
            info: customInfo,
          });
        }
      }
    }

    // If no missing sources, return immediately
    if (customModulesWithMissingSources.length === 0) {
      return {
        validCustomModules,
        keptModulesWithoutSources: [],
      };
    }

    // Stop any spinner for interactive prompts
    const currentSpinner = ora();
    if (currentSpinner.isSpinning) {
      currentSpinner.stop();
    }

    console.log(chalk.yellow(`\n⚠️  Found ${customModulesWithMissingSources.length} custom module(s) with missing sources:`));

    let keptCount = 0;
    let updatedCount = 0;
    let removedCount = 0;

    for (const missing of customModulesWithMissingSources) {
      console.log(chalk.dim(`  • ${missing.name} (${missing.id})`));
      console.log(chalk.dim(`    Original source: ${missing.relativePath}`));
      console.log(chalk.dim(`    Full path: ${missing.sourcePath}`));

      const choices = [
        {
          name: 'Keep installed (will not be processed)',
          value: 'keep',
          hint: 'Keep',
        },
        {
          name: 'Specify new source location',
          value: 'update',
          hint: 'Update',
        },
      ];

      // Only add remove option if not just compiling agents
      if (operation !== 'compile-agents') {
        choices.push({
          name: '⚠️  REMOVE module completely (destructive!)',
          value: 'remove',
          hint: 'Remove',
        });
      }

      const action = await prompts.select({
        message: `How would you like to handle "${missing.name}"?`,
        choices,
      });

      switch (action) {
        case 'update': {
          // Use sync validation because @clack/prompts doesn't support async validate
          const newSourcePath = await prompts.text({
            message: 'Enter the new path to the custom module:',
            default: missing.sourcePath,
            validate: (input) => {
              if (!input || input.trim() === '') {
                return 'Please enter a path';
              }
              const expandedPath = path.resolve(input.trim());
              if (!fs.pathExistsSync(expandedPath)) {
                return 'Path does not exist';
              }
              // Check if it looks like a valid module
              const moduleYamlPath = path.join(expandedPath, 'module.yaml');
              const agentsPath = path.join(expandedPath, 'agents');
              const workflowsPath = path.join(expandedPath, 'workflows');

              if (!fs.pathExistsSync(moduleYamlPath) && !fs.pathExistsSync(agentsPath) && !fs.pathExistsSync(workflowsPath)) {
                return 'Path does not appear to contain a valid custom module';
              }
              return; // clack expects undefined for valid input
            },
          });

          // Update the source in manifest
          const resolvedPath = path.resolve(newSourcePath.trim());
          missing.info.sourcePath = resolvedPath;
          // Remove relativePath - we only store absolute sourcePath now
          delete missing.info.relativePath;
          await this.manifest.addCustomModule(bmadDir, missing.info);

          validCustomModules.push({
            id: missing.id,
            name: missing.name,
            path: resolvedPath,
            info: missing.info,
          });

          updatedCount++;
          console.log(chalk.green(`✓ Updated source location`));

          break;
        }
        case 'remove': {
          // Extra confirmation for destructive remove
          console.log(chalk.red.bold(`\n⚠️  WARNING: This will PERMANENTLY DELETE "${missing.name}" and all its files!`));
          console.log(chalk.red(`  Module location: ${path.join(bmadDir, missing.id)}`));

          const confirmDelete = await prompts.confirm({
            message: chalk.red.bold('Are you absolutely sure you want to delete this module?'),
            default: false,
          });

          if (confirmDelete) {
            const typedConfirm = await prompts.text({
              message: chalk.red.bold('Type "DELETE" to confirm permanent deletion:'),
              validate: (input) => {
                if (input !== 'DELETE') {
                  return chalk.red('You must type "DELETE" exactly to proceed');
                }
                return; // clack expects undefined for valid input
              },
            });

            if (typedConfirm === 'DELETE') {
              // Remove the module from filesystem and manifest
              const modulePath = path.join(bmadDir, missing.id);
              if (await fs.pathExists(modulePath)) {
                const fsExtra = require('fs-extra');
                await fsExtra.remove(modulePath);
                console.log(chalk.yellow(`  ✓ Deleted module directory: ${path.relative(projectRoot, modulePath)}`));
              }

              await this.manifest.removeModule(bmadDir, missing.id);
              await this.manifest.removeCustomModule(bmadDir, missing.id);
              console.log(chalk.yellow(`  ✓ Removed from manifest`));

              // Also remove from installedModules list
              if (installedModules && installedModules.includes(missing.id)) {
                const index = installedModules.indexOf(missing.id);
                if (index !== -1) {
                  installedModules.splice(index, 1);
                }
              }

              removedCount++;
              console.log(chalk.red.bold(`✓ "${missing.name}" has been permanently removed`));
            } else {
              console.log(chalk.dim('  Removal cancelled - module will be kept'));
              keptCount++;
            }
          } else {
            console.log(chalk.dim('  Removal cancelled - module will be kept'));
            keptCount++;
          }

          break;
        }
        case 'keep': {
          keptCount++;
          keptModulesWithoutSources.push(missing.id);
          console.log(chalk.dim(`  Module will be kept as-is`));

          break;
        }
        // No default
      }
    }

    // Show summary
    if (keptCount > 0 || updatedCount > 0 || removedCount > 0) {
      console.log(chalk.dim(`\nSummary for custom modules with missing sources:`));
      if (keptCount > 0) console.log(chalk.dim(`  • ${keptCount} module(s) kept as-is`));
      if (updatedCount > 0) console.log(chalk.dim(`  • ${updatedCount} module(s) updated with new sources`));
      if (removedCount > 0) console.log(chalk.red(`  • ${removedCount} module(s) permanently deleted`));
    }

    return {
      validCustomModules,
      keptModulesWithoutSources,
    };
  }
}

module.exports = { Installer };
