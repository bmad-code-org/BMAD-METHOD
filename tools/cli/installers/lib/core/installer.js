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
// processInstallation no longer needed - LLMs understand {project-root}
const { getProjectRoot, getSourcePath, getModulePath } = require('../../../lib/project-root');
const { AgentPartyGenerator } = require('../../../lib/agent-party-generator');
const { CLIUtils } = require('../../../lib/cli-utils');
const { ManifestGenerator } = require('./manifest-generator');
const { IdeConfigManager } = require('./ide-config-manager');

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
    this.installedFiles = []; // Track all installed files
  }

  /**
   * Find the bmad installation directory in a project
   * V6+ installations can use ANY folder name but ALWAYS have _cfg/manifest.yaml
   * @param {string} projectDir - Project directory
   * @returns {Promise<string>} Path to bmad directory
   */
  async findBmadDir(projectDir) {
    // Check if project directory exists
    if (!(await fs.pathExists(projectDir))) {
      // Project doesn't exist yet, return default
      return path.join(projectDir, 'bmad');
    }

    // V6+ strategy: Look for ANY directory with _cfg/manifest.yaml
    // This is the definitive marker of a V6+ installation
    try {
      const entries = await fs.readdir(projectDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const manifestPath = path.join(projectDir, entry.name, '_cfg', 'manifest.yaml');
          if (await fs.pathExists(manifestPath)) {
            // Found a V6+ installation
            return path.join(projectDir, entry.name);
          }
        }
      }
    } catch {
      // Ignore errors, fall through to default
    }

    // No V6+ installation found, return default
    // This will be used for new installations
    return path.join(projectDir, 'bmad');
  }

  /**
   * Copy a file and replace {bmad_folder} placeholder with actual folder name
   * @param {string} sourcePath - Source file path
   * @param {string} targetPath - Target file path
   * @param {string} bmadFolderName - The bmad folder name to use for replacement
   */
  async copyFileWithPlaceholderReplacement(sourcePath, targetPath, bmadFolderName) {
    // List of text file extensions that should have placeholder replacement
    const textExtensions = ['.md', '.yaml', '.yml', '.txt', '.json', '.js', '.ts', '.html', '.css', '.sh', '.bat', '.csv'];
    const ext = path.extname(sourcePath).toLowerCase();

    // Check if this is a text file that might contain placeholders
    if (textExtensions.includes(ext)) {
      try {
        // Read the file content
        let content = await fs.readFile(sourcePath, 'utf8');

        // Replace {bmad_folder} placeholder with actual folder name
        if (content.includes('{bmad_folder}')) {
          content = content.replaceAll('{bmad_folder}', bmadFolderName);
        }

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
      toolConfig = await ui.promptToolSelection(projectDir, selectedModules);
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
    const bmadDir = path.join(projectDir, this.bmadFolderName || 'bmad');

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

        for (const ide of newlySelectedIdes) {
          // List of IDEs that have interactive prompts
          const needsPrompts = ['claude-code', 'github-copilot', 'roo', 'cline', 'auggie', 'codex', 'qwen', 'gemini'].includes(ide);

          if (needsPrompts) {
            // Get IDE handler and collect configuration
            try {
              // Dynamically load the IDE setup module
              const ideModule = require(`../ide/${ide}`);

              // Get the setup class (handle different export formats)
              let SetupClass;
              const className =
                ide
                  .split('-')
                  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                  .join('') + 'Setup';

              if (ideModule[className]) {
                SetupClass = ideModule[className];
              } else if (ideModule.default) {
                SetupClass = ideModule.default;
              } else {
                // Skip if no setup class found
                continue;
              }

              const ideSetup = new SetupClass();

              // Check if this IDE has a collectConfiguration method
              if (typeof ideSetup.collectConfiguration === 'function') {
                console.log(chalk.cyan(`\nConfiguring ${ide}...`));
                ideConfigurations[ide] = await ideSetup.collectConfiguration({
                  selectedModules: selectedModules || [],
                  projectDir,
                  bmadDir,
                });
              }
            } catch {
              // IDE doesn't have a setup file or collectConfiguration method
              console.warn(chalk.yellow(`Warning: Could not load configuration for ${ide}`));
            }
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
  async install(config) {
    // Display BMAD logo
    CLIUtils.displayLogo();

    // Display welcome message
    CLIUtils.displaySection('BMAD™ Installation', 'Version ' + require(path.join(getProjectRoot(), 'package.json')).version);

    // Note: Legacy V4 detection now happens earlier in UI.promptInstall()
    // before any config collection, so we don't need to check again here

    const projectDir = path.resolve(config.directory);

    // If core config was pre-collected (from interactive mode), use it
    if (config.coreConfig) {
      this.configCollector.collectedConfig.core = config.coreConfig;
      // Also store in allAnswers for cross-referencing
      this.configCollector.allAnswers = {};
      for (const [key, value] of Object.entries(config.coreConfig)) {
        this.configCollector.allAnswers[`core_${key}`] = value;
      }
    }

    // Collect configurations for modules (skip if quick update already collected them)
    let moduleConfigs;
    if (config._quickUpdate) {
      // Quick update already collected all configs, use them directly
      moduleConfigs = this.configCollector.collectedConfig;
    } else {
      // Regular install - collect configurations (core was already collected in UI.promptInstall if interactive)
      moduleConfigs = await this.configCollector.collectAllConfigurations(config.modules || [], path.resolve(config.directory));
    }

    // Get bmad_folder from config (default to 'bmad' for backwards compatibility)
    const bmadFolderName = moduleConfigs.core && moduleConfigs.core.bmad_folder ? moduleConfigs.core.bmad_folder : 'bmad';
    this.bmadFolderName = bmadFolderName; // Store for use in other methods

    // Set bmad folder name on module manager and IDE manager for placeholder replacement
    this.moduleManager.setBmadFolderName(bmadFolderName);
    this.ideManager.setBmadFolderName(bmadFolderName);

    // Tool selection will be collected after we determine if it's a reinstall/update/new install

    const spinner = ora('Preparing installation...').start();

    try {
      // Resolve target directory (path.resolve handles platform differences)
      const projectDir = path.resolve(config.directory);

      // Check if bmad_folder has changed from existing installation (only if project dir exists)
      let existingBmadDir = null;
      let existingBmadFolderName = null;

      if (await fs.pathExists(projectDir)) {
        existingBmadDir = await this.findBmadDir(projectDir);
        existingBmadFolderName = path.basename(existingBmadDir);
      }

      const targetBmadDir = path.join(projectDir, bmadFolderName);

      // If bmad_folder changed during update/upgrade, back up old folder and do fresh install
      if (existingBmadDir && (await fs.pathExists(existingBmadDir)) && existingBmadFolderName !== bmadFolderName) {
        spinner.stop();
        console.log(chalk.yellow(`\n⚠️  bmad_folder has changed: ${existingBmadFolderName} → ${bmadFolderName}`));
        console.log(chalk.yellow('This will result in a fresh installation to the new folder.'));

        const inquirer = require('inquirer');
        const { confirmFreshInstall } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmFreshInstall',
            message: chalk.cyan('Proceed with fresh install? (Your old folder will be backed up)'),
            default: true,
          },
        ]);

        if (!confirmFreshInstall) {
          console.log(chalk.yellow('Installation cancelled.'));
          return { success: false, cancelled: true };
        }

        spinner.start('Backing up existing installation...');

        // Find a unique backup name
        let backupDir = `${existingBmadDir}-bak`;
        let counter = 1;
        while (await fs.pathExists(backupDir)) {
          backupDir = `${existingBmadDir}-bak-${counter}`;
          counter++;
        }

        // Rename the old folder to backup
        await fs.move(existingBmadDir, backupDir);

        spinner.succeed(`Backed up ${existingBmadFolderName} → ${path.basename(backupDir)}`);
        console.log(chalk.cyan('\n📋 Important:'));
        console.log(chalk.dim(`  - Your old installation has been backed up to: ${path.basename(backupDir)}`));
        console.log(chalk.dim(`  - If you had custom agents or configurations, copy them from:`));
        console.log(chalk.dim(`    ${path.basename(backupDir)}/_cfg/`));
        console.log(chalk.dim(`  - To the new location:`));
        console.log(chalk.dim(`    ${bmadFolderName}/_cfg/`));
        console.log('');

        spinner.start('Starting fresh installation...');
      }

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

      const bmadDir = path.join(projectDir, bmadFolderName);

      // Check existing installation
      spinner.text = 'Checking for existing installation...';
      const existingInstall = await this.detector.detect(bmadDir);

      if (existingInstall.installed && !config.force && !config._quickUpdate) {
        spinner.stop();

        // Check if user already decided what to do (from early menu in ui.js)
        let action = null;
        if (config._requestedReinstall) {
          action = 'reinstall';
        } else if (config.actionType === 'update') {
          action = 'update';
        } else {
          // Fallback: Ask the user (backwards compatibility for other code paths)
          console.log(chalk.yellow('\n⚠️  Existing BMAD installation detected'));
          console.log(chalk.dim(`  Location: ${bmadDir}`));
          console.log(chalk.dim(`  Version: ${existingInstall.version}`));

          const promptResult = await this.promptUpdateAction();
          action = promptResult.action;
        }

        if (action === 'cancel') {
          console.log('Installation cancelled.');
          return { success: false, cancelled: true };
        }

        if (action === 'reinstall') {
          // Warn about destructive operation
          console.log(chalk.red.bold('\n⚠️  WARNING: This is a destructive operation!'));
          console.log(chalk.red('All custom files and modifications in the bmad directory will be lost.'));

          const inquirer = require('inquirer');
          const { confirmReinstall } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirmReinstall',
              message: chalk.yellow('Are you sure you want to delete and reinstall?'),
              default: false,
            },
          ]);

          if (!confirmReinstall) {
            console.log('Installation cancelled.');
            return { success: false, cancelled: true };
          }

          // Remember previously configured IDEs before deleting
          config._previouslyConfiguredIdes = existingInstall.ides || [];

          // Remove existing installation
          await fs.remove(bmadDir);
          console.log(chalk.green('✓ Removed existing installation\n'));

          // Mark this as a full reinstall so we re-collect IDE configurations
          config._isFullReinstall = true;
        } else if (action === 'update') {
          // Store that we're updating for later processing
          config._isUpdate = true;
          config._existingInstall = existingInstall;

          // Detect custom and modified files BEFORE updating (compare current files vs files-manifest.csv)
          const existingFilesManifest = await this.readFilesManifest(bmadDir);
          console.log(chalk.dim(`DEBUG: Read ${existingFilesManifest.length} files from manifest`));
          console.log(chalk.dim(`DEBUG: Manifest has hashes: ${existingFilesManifest.some((f) => f.hash)}`));

          const { customFiles, modifiedFiles } = await this.detectCustomFiles(bmadDir, existingFilesManifest);

          console.log(chalk.dim(`DEBUG: Found ${customFiles.length} custom files, ${modifiedFiles.length} modified files`));
          if (modifiedFiles.length > 0) {
            console.log(chalk.yellow('DEBUG: Modified files:'));
            for (const f of modifiedFiles) console.log(chalk.dim(`  - ${f.path}`));
          }

          config._customFiles = customFiles;
          config._modifiedFiles = modifiedFiles;

          // If there are custom files, back them up temporarily
          if (customFiles.length > 0) {
            const tempBackupDir = path.join(projectDir, '.bmad-custom-backup-temp');
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
            const tempModifiedBackupDir = path.join(projectDir, '.bmad-modified-backup-temp');
            await fs.ensureDir(tempModifiedBackupDir);

            console.log(chalk.yellow(`\nDEBUG: Backing up ${modifiedFiles.length} modified files to temp location`));
            spinner.start(`Backing up ${modifiedFiles.length} modified files...`);
            for (const modifiedFile of modifiedFiles) {
              const relativePath = path.relative(bmadDir, modifiedFile.path);
              const tempBackupPath = path.join(tempModifiedBackupDir, relativePath);
              console.log(chalk.dim(`DEBUG: Backing up ${relativePath} to temp`));
              await fs.ensureDir(path.dirname(tempBackupPath));
              await fs.copy(modifiedFile.path, tempBackupPath, { overwrite: true });
            }
            spinner.succeed(`Backed up ${modifiedFiles.length} modified files`);

            config._tempModifiedBackupDir = tempModifiedBackupDir;
          } else {
            console.log(chalk.dim('DEBUG: No modified files detected'));
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

        // Back up custom files
        if (customFiles.length > 0) {
          const tempBackupDir = path.join(projectDir, '.bmad-custom-backup-temp');
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
          const tempModifiedBackupDir = path.join(projectDir, '.bmad-modified-backup-temp');
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

      spinner.start('Continuing installation...');

      // Create bmad directory structure
      spinner.text = 'Creating directory structure...';
      await this.createDirectoryStructure(bmadDir);

      // Resolve dependencies for selected modules
      spinner.text = 'Resolving dependencies...';
      const projectRoot = getProjectRoot();
      const modulesToInstall = config.installCore ? ['core', ...config.modules] : config.modules;

      // For dependency resolution, we need to pass the project root
      const resolution = await this.dependencyResolver.resolve(projectRoot, config.modules || [], { verbose: config.verbose });

      if (config.verbose) {
        spinner.succeed('Dependencies resolved');
      } else {
        spinner.succeed('Dependencies resolved');
      }

      // Install core if requested or if dependencies require it
      if (config.installCore || resolution.byModule.core) {
        spinner.start('Installing BMAD core...');
        await this.installCoreWithDependencies(bmadDir, resolution.byModule.core);
        spinner.succeed('Core installed');
      }

      // Install modules with their dependencies
      if (config.modules && config.modules.length > 0) {
        for (const moduleName of config.modules) {
          spinner.start(`Installing module: ${moduleName}...`);
          await this.installModuleWithDependencies(moduleName, bmadDir, resolution.byModule[moduleName]);
          spinner.succeed(`Module installed: ${moduleName}`);
        }

        // Install partial modules (only dependencies)
        for (const [module, files] of Object.entries(resolution.byModule)) {
          if (!config.modules.includes(module) && module !== 'core') {
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

      // Generate clean config.yaml files for each installed module
      spinner.start('Generating module configurations...');
      await this.generateModuleConfigs(bmadDir, moduleConfigs);
      spinner.succeed('Module configurations generated');

      // Create agent configuration files
      // Note: Legacy createAgentConfigs removed - using YAML customize system instead
      // Customize templates are now created in processAgentFiles when building YAML agents

      // Pre-register manifest files that will be created (except files-manifest.csv to avoid recursion)
      const cfgDir = path.join(bmadDir, '_cfg');
      this.installedFiles.push(
        path.join(cfgDir, 'manifest.yaml'),
        path.join(cfgDir, 'workflow-manifest.csv'),
        path.join(cfgDir, 'agent-manifest.csv'),
        path.join(cfgDir, 'task-manifest.csv'),
      );

      // Generate CSV manifests for workflows, agents, tasks AND ALL FILES with hashes BEFORE IDE setup
      spinner.start('Generating workflow and agent manifests...');
      const manifestGen = new ManifestGenerator();

      // Include preserved modules (from quick update) in the manifest
      const allModulesToList = config._preserveModules ? [...(config.modules || []), ...config._preserveModules] : config.modules || [];

      const manifestStats = await manifestGen.generateManifests(bmadDir, config.modules || [], this.installedFiles, {
        ides: config.ides || [],
        preservedModules: config._preserveModules || [], // Scan these from installed bmad/ dir
      });

      spinner.succeed(
        `Manifests generated: ${manifestStats.workflows} workflows, ${manifestStats.agents} agents, ${manifestStats.tasks} tasks, ${manifestStats.tools} tools, ${manifestStats.files} files`,
      );

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
              selectedModules: config.modules || [],
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
            spinner.succeed(`Configured ${validIdes.length} IDE${validIdes.length > 1 ? 's' : ''}`);
          } else {
            console.log(chalk.green(`✓ Configured ${validIdes.length} IDE${validIdes.length > 1 ? 's' : ''}`));
          }
        }

        // Copy IDE-specific documentation (only for valid IDEs)
        const validIdesForDocs = (config.ides || []).filter((ide) => ide && typeof ide === 'string');
        if (validIdesForDocs.length > 0) {
          spinner.start('Copying IDE documentation...');
          await this.copyIdeDocumentation(validIdesForDocs, bmadDir);
          spinner.succeed('IDE documentation copied');
        }
      }

      // Run module-specific installers after IDE setup
      spinner.start('Running module-specific installers...');

      // Run core module installer if core was installed
      if (config.installCore || resolution.byModule.core) {
        spinner.text = 'Running core module installer...';

        await this.moduleManager.runModuleInstaller('core', bmadDir, {
          installedIDEs: config.ides || [],
          moduleConfig: moduleConfigs.core || {},
          logger: {
            log: (msg) => console.log(msg),
            error: (msg) => console.error(msg),
            warn: (msg) => console.warn(msg),
          },
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
            logger: {
              log: (msg) => console.log(msg),
              error: (msg) => console.error(msg),
              warn: (msg) => console.warn(msg),
            },
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
        console.log(chalk.dim('The following custom files were found and restored:\n'));
        for (const file of customFiles) {
          console.log(chalk.dim(`  - ${path.relative(bmadDir, file)}`));
        }
        console.log('');
      }

      if (modifiedFiles.length > 0) {
        console.log(chalk.yellow(`\n⚠️  Modified files detected: ${modifiedFiles.length}`));
        console.log(chalk.dim('The following files were modified and backed up with .bak extension:\n'));
        for (const file of modifiedFiles) {
          console.log(chalk.dim(`  - ${file.relativePath} → ${file.relativePath}.bak`));
        }
        console.log(chalk.dim('\nThese files have been updated with the new version.'));
        console.log(chalk.dim('Review the .bak files to see your changes and merge if needed.\n'));
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

      return { success: true, path: bmadDir, modules: config.modules, ides: config.ides };
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
      const bmadDir = await this.findBmadDir(projectDir);
      const existingInstall = await this.detector.detect(bmadDir);

      if (!existingInstall.installed) {
        spinner.fail('No BMAD installation found');
        throw new Error(`No BMAD installation found at ${bmadDir}`);
      }

      spinner.text = 'Analyzing update requirements...';

      // Compare versions and determine what needs updating
      const currentVersion = existingInstall.version;
      const newVersion = require(path.join(getProjectRoot(), 'package.json')).version;

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
    const bmadDir = await this.findBmadDir(projectDir);
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
    const bmadDir = await this.findBmadDir(projectDir);

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
  async createDirectoryStructure(bmadDir) {
    await fs.ensureDir(bmadDir);
    await fs.ensureDir(path.join(bmadDir, '_cfg'));
    await fs.ensureDir(path.join(bmadDir, '_cfg', 'agents'));
  }

  /**
   * Generate clean config.yaml files for each installed module
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} moduleConfigs - Collected configuration values
   */
  async generateModuleConfigs(bmadDir, moduleConfigs) {
    const yaml = require('js-yaml');

    // Extract core config values to share with other modules
    const coreConfig = moduleConfigs.core || {};

    // Get all installed module directories
    const entries = await fs.readdir(bmadDir, { withFileTypes: true });
    const installedModules = entries
      .filter((entry) => entry.isDirectory() && entry.name !== '_cfg' && entry.name !== 'docs')
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

        // Convert config to YAML
        let yamlContent = yaml.dump(finalConfig, {
          indent: 2,
          lineWidth: -1,
          noRefs: true,
          sortKeys: false,
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
        this.installedFiles.push(configPath);
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

    // Install full core
    await this.installCore(bmadDir);

    // If there are specific dependency files, ensure they're included
    if (coreFiles) {
      // Already handled by installCore for core module
    }
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
        this.installedFiles.push(filePath);
      },
      {
        skipModuleInstaller: true, // We'll run it later after IDE setup
        moduleConfig: moduleConfig, // Pass module config for conditional filtering
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
          await this.copyFileWithPlaceholderReplacement(sourcePath, targetPath, this.bmadFolderName || 'bmad');
          this.installedFiles.push(targetPath);
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
          await this.copyFileWithPlaceholderReplacement(sourcePath, targetPath, this.bmadFolderName || 'bmad');
          this.installedFiles.push(targetPath);
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
          await this.copyFileWithPlaceholderReplacement(sourcePath, targetPath, this.bmadFolderName || 'bmad');
          this.installedFiles.push(targetPath);
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
          await this.copyFileWithPlaceholderReplacement(sourcePath, targetPath, this.bmadFolderName || 'bmad');
          this.installedFiles.push(targetPath);
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
          await this.copyFileWithPlaceholderReplacement(dataPath, targetPath, this.bmadFolderName || 'bmad');
          this.installedFiles.push(targetPath);
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

    // Copy core files with filtering for localskip agents
    await this.copyDirectoryWithFiltering(sourcePath, targetPath);

    // Process agent files to inject activation block
    await this.processAgentFiles(targetPath, 'core');
  }

  /**
   * Copy directory with filtering for localskip agents
   * @param {string} sourcePath - Source directory path
   * @param {string} targetPath - Target directory path
   */
  async copyDirectoryWithFiltering(sourcePath, targetPath) {
    // Get all files in source directory
    const files = await this.getFileList(sourcePath);

    for (const file of files) {
      // Skip config.yaml templates - we'll generate clean ones with actual values
      if (file === 'config.yaml' || file.endsWith('/config.yaml')) {
        continue;
      }

      const sourceFile = path.join(sourcePath, file);
      const targetFile = path.join(targetPath, file);

      // Check if this is an agent file
      if (file.includes('agents/') && file.endsWith('.md')) {
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
      await this.copyFileWithPlaceholderReplacement(sourceFile, targetFile, this.bmadFolderName || 'bmad');

      // Track the installed file
      this.installedFiles.push(targetFile);
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
    const projectDir = path.dirname(bmadDir);
    const cfgAgentsDir = path.join(bmadDir, '_cfg', 'agents');

    // Ensure _cfg/agents directory exists
    await fs.ensureDir(cfgAgentsDir);

    // Get all agent files
    const agentFiles = await fs.readdir(agentsPath);

    for (const agentFile of agentFiles) {
      // Handle YAML agents - build them to .md
      if (agentFile.endsWith('.agent.yaml')) {
        const agentName = agentFile.replace('.agent.yaml', '');
        const yamlPath = path.join(agentsPath, agentFile);
        const mdPath = path.join(agentsPath, `${agentName}.md`);
        const customizePath = path.join(cfgAgentsDir, `${moduleName}-${agentName}.customize.yaml`);

        // Create customize template if it doesn't exist
        if (!(await fs.pathExists(customizePath))) {
          const genericTemplatePath = getSourcePath('utility', 'templates', 'agent.customize.template.yaml');
          if (await fs.pathExists(genericTemplatePath)) {
            await this.copyFileWithPlaceholderReplacement(genericTemplatePath, customizePath, this.bmadFolderName || 'bmad');
            console.log(chalk.dim(`  Created customize: ${moduleName}-${agentName}.customize.yaml`));
          }
        }

        // Build YAML + customize to .md
        const customizeExists = await fs.pathExists(customizePath);
        const xmlContent = await this.xmlHandler.buildFromYaml(yamlPath, customizeExists ? customizePath : null, {
          includeMetadata: true,
        });

        // DO NOT replace {project-root} - LLMs understand this placeholder at runtime
        // const processedContent = xmlContent.replaceAll('{project-root}', projectDir);

        // Write the built .md file to bmad/{module}/agents/ with POSIX-compliant final newline
        const content = xmlContent.endsWith('\n') ? xmlContent : xmlContent + '\n';
        await fs.writeFile(mdPath, content, 'utf8');
        this.installedFiles.push(mdPath);

        // Remove the source YAML file - we can regenerate from installer source if needed
        await fs.remove(yamlPath);

        console.log(chalk.dim(`  Built agent: ${agentName}.md`));
      }
      // Handle legacy .md agents - inject activation if needed
      else if (agentFile.endsWith('.md')) {
        const agentPath = path.join(agentsPath, agentFile);
        let content = await fs.readFile(agentPath, 'utf8');

        // Check if content has agent XML and no activation block
        if (content.includes('<agent') && !content.includes('<activation')) {
          // Inject the activation block using XML handler
          content = this.xmlHandler.injectActivationSimple(content);
          // Ensure POSIX-compliant final newline
          const finalContent = content.endsWith('\n') ? content : content + '\n';
          await fs.writeFile(agentPath, finalContent, 'utf8');
        }
      }
    }
  }

  /**
   * Build standalone agents in bmad/agents/ directory
   * @param {string} bmadDir - Path to bmad directory
   * @param {string} projectDir - Path to project directory
   */
  async buildStandaloneAgents(bmadDir, projectDir) {
    const standaloneAgentsPath = path.join(bmadDir, 'agents');
    const cfgAgentsDir = path.join(bmadDir, '_cfg', 'agents');

    // Check if standalone agents directory exists
    if (!(await fs.pathExists(standaloneAgentsPath))) {
      return;
    }

    // Get all subdirectories in agents/
    const agentDirs = await fs.readdir(standaloneAgentsPath, { withFileTypes: true });

    for (const agentDir of agentDirs) {
      if (!agentDir.isDirectory()) continue;

      const agentDirPath = path.join(standaloneAgentsPath, agentDir.name);

      // Find any .agent.yaml file in the directory
      const files = await fs.readdir(agentDirPath);
      const yamlFile = files.find((f) => f.endsWith('.agent.yaml'));

      if (!yamlFile) continue;

      const agentName = path.basename(yamlFile, '.agent.yaml');
      const sourceYamlPath = path.join(agentDirPath, yamlFile);
      const targetMdPath = path.join(agentDirPath, `${agentName}.md`);
      const customizePath = path.join(cfgAgentsDir, `${agentName}.customize.yaml`);

      // Check for customizations
      const customizeExists = await fs.pathExists(customizePath);
      let customizedFields = [];

      if (customizeExists) {
        const customizeContent = await fs.readFile(customizePath, 'utf8');
        const yaml = require('js-yaml');
        const customizeYaml = yaml.load(customizeContent);

        // Detect what fields are customized (similar to rebuildAgentFiles)
        if (customizeYaml) {
          if (customizeYaml.persona) {
            for (const [key, value] of Object.entries(customizeYaml.persona)) {
              if (value !== '' && value !== null && !(Array.isArray(value) && value.length === 0)) {
                customizedFields.push(`persona.${key}`);
              }
            }
          }
          if (customizeYaml.agent?.metadata) {
            for (const [key, value] of Object.entries(customizeYaml.agent.metadata)) {
              if (value !== '' && value !== null) {
                customizedFields.push(`metadata.${key}`);
              }
            }
          }
          if (customizeYaml.critical_actions && customizeYaml.critical_actions.length > 0) {
            customizedFields.push('critical_actions');
          }
          if (customizeYaml.menu && customizeYaml.menu.length > 0) {
            customizedFields.push('menu');
          }
        }
      }

      // Build YAML to XML .md
      const xmlContent = await this.xmlHandler.buildFromYaml(sourceYamlPath, customizeExists ? customizePath : null, {
        includeMetadata: true,
      });

      // DO NOT replace {project-root} - LLMs understand this placeholder at runtime
      // const processedContent = xmlContent.replaceAll('{project-root}', projectDir);

      // Write the built .md file with POSIX-compliant final newline
      const content = xmlContent.endsWith('\n') ? xmlContent : xmlContent + '\n';
      await fs.writeFile(targetMdPath, content, 'utf8');

      // Display result
      if (customizedFields.length > 0) {
        console.log(chalk.dim(`  Built standalone agent: ${agentName}.md `) + chalk.yellow(`(customized: ${customizedFields.join(', ')})`));
      } else {
        console.log(chalk.dim(`  Built standalone agent: ${agentName}.md`));
      }
    }
  }

  /**
   * Rebuild agent files from installer source (for compile command)
   * @param {string} modulePath - Path to module in bmad/ installation
   * @param {string} moduleName - Module name
   */
  async rebuildAgentFiles(modulePath, moduleName) {
    // Get source agents directory from installer
    const sourceAgentsPath =
      moduleName === 'core' ? path.join(getModulePath('core'), 'agents') : path.join(getSourcePath(`modules/${moduleName}`), 'agents');

    if (!(await fs.pathExists(sourceAgentsPath))) {
      return; // No source agents to rebuild
    }

    // Determine project directory (parent of bmad/ directory)
    const bmadDir = path.dirname(modulePath);
    const projectDir = path.dirname(bmadDir);
    const cfgAgentsDir = path.join(bmadDir, '_cfg', 'agents');
    const targetAgentsPath = path.join(modulePath, 'agents');

    // Ensure target directory exists
    await fs.ensureDir(targetAgentsPath);

    // Get all YAML agent files from source
    const sourceFiles = await fs.readdir(sourceAgentsPath);

    for (const file of sourceFiles) {
      if (file.endsWith('.agent.yaml')) {
        const agentName = file.replace('.agent.yaml', '');
        const sourceYamlPath = path.join(sourceAgentsPath, file);
        const targetMdPath = path.join(targetAgentsPath, `${agentName}.md`);
        const customizePath = path.join(cfgAgentsDir, `${moduleName}-${agentName}.customize.yaml`);

        // Check for customizations
        const customizeExists = await fs.pathExists(customizePath);
        let customizedFields = [];

        if (customizeExists) {
          const customizeContent = await fs.readFile(customizePath, 'utf8');
          const yaml = require('js-yaml');
          const customizeYaml = yaml.load(customizeContent);

          // Detect what fields are customized
          if (customizeYaml) {
            if (customizeYaml.persona) {
              for (const [key, value] of Object.entries(customizeYaml.persona)) {
                if (value !== '' && value !== null && !(Array.isArray(value) && value.length === 0)) {
                  customizedFields.push(`persona.${key}`);
                }
              }
            }
            if (customizeYaml.agent?.metadata) {
              for (const [key, value] of Object.entries(customizeYaml.agent.metadata)) {
                if (value !== '' && value !== null) {
                  customizedFields.push(`metadata.${key}`);
                }
              }
            }
            if (customizeYaml.critical_actions && customizeYaml.critical_actions.length > 0) {
              customizedFields.push('critical_actions');
            }
            if (customizeYaml.memories && customizeYaml.memories.length > 0) {
              customizedFields.push('memories');
            }
            if (customizeYaml.menu && customizeYaml.menu.length > 0) {
              customizedFields.push('menu');
            }
            if (customizeYaml.prompts && customizeYaml.prompts.length > 0) {
              customizedFields.push('prompts');
            }
          }
        }

        // Build YAML + customize to .md
        const xmlContent = await this.xmlHandler.buildFromYaml(sourceYamlPath, customizeExists ? customizePath : null, {
          includeMetadata: true,
        });

        // DO NOT replace {project-root} - LLMs understand this placeholder at runtime
        // const processedContent = xmlContent.replaceAll('{project-root}', projectDir);

        // Write the rebuilt .md file with POSIX-compliant final newline
        const content = xmlContent.endsWith('\n') ? xmlContent : xmlContent + '\n';
        await fs.writeFile(targetMdPath, content, 'utf8');

        // Display result with customizations if any
        if (customizedFields.length > 0) {
          console.log(chalk.dim(`  Rebuilt agent: ${agentName}.md `) + chalk.yellow(`(customized: ${customizedFields.join(', ')})`));
        } else {
          console.log(chalk.dim(`  Rebuilt agent: ${agentName}.md`));
        }
      }
    }
  }

  /**
   * Compile/rebuild all agents and tasks for quick updates
   * @param {Object} config - Compilation configuration
   * @returns {Object} Compilation results
   */
  async compileAgents(config) {
    const ora = require('ora');
    const spinner = ora('Starting agent compilation...').start();

    try {
      const projectDir = path.resolve(config.directory);
      const bmadDir = await this.findBmadDir(projectDir);

      // Check if bmad directory exists
      if (!(await fs.pathExists(bmadDir))) {
        spinner.fail('No BMAD installation found');
        throw new Error(`BMAD not installed at ${bmadDir}`);
      }

      let agentCount = 0;
      let taskCount = 0;

      // Process all modules in bmad directory
      spinner.text = 'Rebuilding agent files...';
      const entries = await fs.readdir(bmadDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== '_cfg' && entry.name !== 'docs') {
          const modulePath = path.join(bmadDir, entry.name);

          // Special handling for standalone agents in bmad/agents/ directory
          if (entry.name === 'agents') {
            spinner.text = 'Building standalone agents...';
            await this.buildStandaloneAgents(bmadDir, projectDir);

            // Count standalone agents
            const standaloneAgentsPath = path.join(bmadDir, 'agents');
            const standaloneAgentDirs = await fs.readdir(standaloneAgentsPath, { withFileTypes: true });
            for (const agentDir of standaloneAgentDirs) {
              if (agentDir.isDirectory()) {
                const agentDirPath = path.join(standaloneAgentsPath, agentDir.name);
                const agentFiles = await fs.readdir(agentDirPath);
                agentCount += agentFiles.filter((f) => f.endsWith('.md') && !f.endsWith('.agent.yaml')).length;
              }
            }
          } else {
            // Rebuild module agents from installer source
            const agentsPath = path.join(modulePath, 'agents');
            if (await fs.pathExists(agentsPath)) {
              await this.rebuildAgentFiles(modulePath, entry.name);
              const agentFiles = await fs.readdir(agentsPath);
              agentCount += agentFiles.filter((f) => f.endsWith('.md')).length;
            }

            // Count tasks (already built)
            const tasksPath = path.join(modulePath, 'tasks');
            if (await fs.pathExists(tasksPath)) {
              const taskFiles = await fs.readdir(tasksPath);
              taskCount += taskFiles.filter((f) => f.endsWith('.md')).length;
            }
          }
        }
      }

      // Regenerate manifests after compilation
      spinner.start('Regenerating manifests...');
      const installedModules = entries
        .filter((e) => e.isDirectory() && e.name !== '_cfg' && e.name !== 'docs' && e.name !== 'agents' && e.name !== 'core')
        .map((e) => e.name);
      const manifestGen = new ManifestGenerator();

      // Get existing IDE list from manifest
      const existingManifestPath = path.join(bmadDir, '_cfg', 'manifest.yaml');
      let existingIdes = [];
      if (await fs.pathExists(existingManifestPath)) {
        const manifestContent = await fs.readFile(existingManifestPath, 'utf8');
        const yaml = require('js-yaml');
        const manifest = yaml.load(manifestContent);
        existingIdes = manifest.ides || [];
      }

      await manifestGen.generateManifests(bmadDir, installedModules, [], {
        ides: existingIdes,
      });
      spinner.succeed('Manifests regenerated');

      // Update IDE configurations using the existing IDE list from manifest
      if (existingIdes && existingIdes.length > 0) {
        spinner.start('Updating IDE configurations...');

        for (const ide of existingIdes) {
          spinner.text = `Updating ${ide}...`;

          // Stop spinner before IDE setup to prevent blocking any potential prompts
          // However, we pass _alreadyConfigured to skip all prompts during compile
          spinner.stop();

          await this.ideManager.setup(ide, projectDir, bmadDir, {
            selectedModules: installedModules,
            skipModuleInstall: true, // Skip module installation, just update IDE files
            verbose: config.verbose,
            preCollectedConfig: { _alreadyConfigured: true }, // Skip all interactive prompts during compile
          });

          // Restart spinner for next IDE
          if (existingIdes.indexOf(ide) < existingIdes.length - 1) {
            spinner.start('Updating IDE configurations...');
          }
        }

        console.log(chalk.green('✓ IDE configurations updated'));
      } else {
        console.log(chalk.yellow('⚠️  No IDEs configured. Skipping IDE update.'));
      }

      return { agentCount, taskCount };
    } catch (error) {
      spinner.fail('Compilation failed');
      throw error;
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
      const bmadDir = await this.findBmadDir(projectDir);

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

      // Load saved IDE configurations
      const savedIdeConfigs = await this.ideConfigManager.loadAllIdeConfigs(bmadDir);

      // Get available modules (what we have source for)
      const availableModules = await this.moduleManager.listAvailable();
      const availableModuleIds = new Set(availableModules.map((m) => m.id));

      // Only update modules that are BOTH installed AND available (we have source for)
      const modulesToUpdate = installedModules.filter((id) => availableModuleIds.has(id));
      const skippedModules = installedModules.filter((id) => !availableModuleIds.has(id));

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

      // Now run the full installation with the collected configs
      spinner.start('Updating BMAD installation...');

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
      };

      // Call the standard install method
      const result = await this.install(installConfig);

      spinner.succeed('Quick update complete!');

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
   * Private: Prompt for update action
   */
  async promptUpdateAction() {
    const inquirer = require('inquirer');
    return await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Update existing installation', value: 'update' },
          { name: 'Remove and reinstall', value: 'reinstall' },
          { name: 'Cancel', value: 'cancel' },
        ],
      },
    ]);
  }

  /**
   * Handle legacy BMAD v4 migration with automatic backup
   * @param {string} projectDir - Project directory
   * @param {Object} legacyV4 - Legacy V4 detection result with offenders array
   */
  async handleLegacyV4Migration(projectDir, legacyV4) {
    console.log(chalk.yellow.bold('\n⚠️  Legacy BMAD v4 detected'));
    console.log(chalk.dim('The installer found legacy artefacts in your project.\n'));

    // Separate .bmad* folders (auto-backup) from other offending paths (manual cleanup)
    const bmadFolders = legacyV4.offenders.filter((p) => {
      const name = path.basename(p);
      return name.startsWith('.bmad'); // Only dot-prefixed folders get auto-backed up
    });
    const otherOffenders = legacyV4.offenders.filter((p) => {
      const name = path.basename(p);
      return !name.startsWith('.bmad'); // Everything else is manual cleanup
    });

    const inquirer = require('inquirer');

    // Show warning for other offending paths FIRST
    if (otherOffenders.length > 0) {
      console.log(chalk.yellow('⚠️  Recommended cleanup:'));
      console.log(chalk.dim('It is recommended to remove the following items before proceeding:\n'));
      for (const p of otherOffenders) console.log(chalk.dim(` - ${p}`));

      console.log(chalk.cyan('\nCleanup commands you can copy/paste:'));
      console.log(chalk.dim('macOS/Linux:'));
      for (const p of otherOffenders) console.log(chalk.dim(`  rm -rf '${p}'`));
      console.log(chalk.dim('Windows:'));
      for (const p of otherOffenders) console.log(chalk.dim(`  rmdir /S /Q "${p}"`));

      const { cleanedUp } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'cleanedUp',
          message: 'Have you completed the recommended cleanup? (You can proceed without it, but it is recommended)',
          default: false,
        },
      ]);

      if (cleanedUp) {
        console.log(chalk.green('✓ Cleanup acknowledged\n'));
      } else {
        console.log(chalk.yellow('⚠️  Proceeding without recommended cleanup\n'));
      }
    }

    // Handle .bmad* folders with automatic backup
    if (bmadFolders.length > 0) {
      console.log(chalk.cyan('The following legacy folders will be moved to v4-backup:'));
      for (const p of bmadFolders) console.log(chalk.dim(` - ${p}`));

      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Proceed with backing up legacy v4 folders?',
          default: true,
        },
      ]);

      if (proceed) {
        const backupDir = path.join(projectDir, 'v4-backup');
        await fs.ensureDir(backupDir);

        for (const folder of bmadFolders) {
          const folderName = path.basename(folder);
          const backupPath = path.join(backupDir, folderName);

          // If backup already exists, add timestamp
          let finalBackupPath = backupPath;
          if (await fs.pathExists(backupPath)) {
            const timestamp = new Date().toISOString().replaceAll(/[:.]/g, '-').split('T')[0];
            finalBackupPath = path.join(backupDir, `${folderName}-${timestamp}`);
          }

          await fs.move(folder, finalBackupPath, { overwrite: false });
          console.log(chalk.green(`✓ Moved ${folderName} to ${path.relative(projectDir, finalBackupPath)}`));
        }
      } else {
        throw new Error('Installation cancelled by user');
      }
    }
  }

  /**
   * Read files-manifest.csv
   * @param {string} bmadDir - BMAD installation directory
   * @returns {Array} Array of file entries from files-manifest.csv
   */
  async readFilesManifest(bmadDir) {
    const filesManifestPath = path.join(bmadDir, '_cfg', 'files-manifest.csv');
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

    // Check if the manifest has hashes - if not, we can't detect modifications
    let manifestHasHashes = false;
    if (existingFilesManifest && existingFilesManifest.length > 0) {
      manifestHasHashes = existingFilesManifest.some((f) => f.hash);
    }

    // Build map of previously installed files from files-manifest.csv with their hashes
    const installedFilesMap = new Map();
    for (const fileEntry of existingFilesManifest) {
      if (fileEntry.path) {
        // Files in manifest are stored as relative paths starting with 'bmad/'
        // Convert to absolute path
        const relativePath = fileEntry.path.startsWith('bmad/') ? fileEntry.path.slice(5) : fileEntry.path;
        const absolutePath = path.join(bmadDir, relativePath);
        installedFilesMap.set(path.normalize(absolutePath), {
          hash: fileEntry.hash,
          relativePath: relativePath,
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

            // Skip _cfg directory - system files
            if (relativePath.startsWith('_cfg/') || relativePath.startsWith('_cfg\\')) {
              continue;
            }

            // Skip config.yaml files - these are regenerated on each install/update
            // Users should use _cfg/agents/ override files instead
            if (fileName === 'config.yaml') {
              continue;
            }

            if (!fileInfo) {
              // File not in manifest = custom file
              customFiles.push(fullPath);
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
            // If manifest doesn't have hashes, we can't detect modifications
            // so we just skip files that are in the manifest
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
   * Private: Create agent configuration files
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} userInfo - User information including name and language
   */
  async createAgentConfigs(bmadDir, userInfo = null) {
    const agentConfigDir = path.join(bmadDir, '_cfg', 'agents');
    await fs.ensureDir(agentConfigDir);

    // Get all agents from all modules
    const agents = [];
    const agentDetails = []; // For manifest generation

    // Check modules for agents (including core)
    const entries = await fs.readdir(bmadDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== '_cfg') {
        const moduleAgentsPath = path.join(bmadDir, entry.name, 'agents');
        if (await fs.pathExists(moduleAgentsPath)) {
          const agentFiles = await fs.readdir(moduleAgentsPath);
          for (const agentFile of agentFiles) {
            if (agentFile.endsWith('.md')) {
              const agentPath = path.join(moduleAgentsPath, agentFile);
              const agentContent = await fs.readFile(agentPath, 'utf8');

              // Skip agents with localskip="true"
              const hasLocalSkip = agentContent.match(/<agent[^>]*\slocalskip="true"[^>]*>/);
              if (hasLocalSkip) {
                continue; // Skip this agent - it should not have been installed
              }

              const agentName = path.basename(agentFile, '.md');

              // Extract any nodes with agentConfig="true"
              const agentConfigNodes = this.extractAgentConfigNodes(agentContent);

              agents.push({
                name: agentName,
                module: entry.name,
                agentConfigNodes: agentConfigNodes,
              });

              // Use shared AgentPartyGenerator to extract details
              let details = AgentPartyGenerator.extractAgentDetails(agentContent, entry.name, agentName);

              // Apply config overrides if they exist
              if (details) {
                const configPath = path.join(agentConfigDir, `${entry.name}-${agentName}.md`);
                if (await fs.pathExists(configPath)) {
                  const configContent = await fs.readFile(configPath, 'utf8');
                  details = AgentPartyGenerator.applyConfigOverrides(details, configContent);
                }
                agentDetails.push(details);
              }
            }
          }
        }
      }
    }

    // Create config file for each agent
    let createdCount = 0;
    let skippedCount = 0;

    // Load agent config template
    const templatePath = getSourcePath('utility', 'models', 'agent-config-template.md');
    const templateContent = await fs.readFile(templatePath, 'utf8');

    for (const agent of agents) {
      const configPath = path.join(agentConfigDir, `${agent.module}-${agent.name}.md`);

      // Skip if config file already exists (preserve custom configurations)
      if (await fs.pathExists(configPath)) {
        skippedCount++;
        continue;
      }

      // Build config content header
      let configContent = `# Agent Config: ${agent.name}\n\n`;

      // Process template and add agent-specific config nodes
      let processedTemplate = templateContent;

      // Replace {core:user_name} placeholder with actual user name if available
      if (userInfo && userInfo.userName) {
        processedTemplate = processedTemplate.replaceAll('{core:user_name}', userInfo.userName);
      }

      // Replace {core:communication_language} placeholder with actual language if available
      if (userInfo && userInfo.responseLanguage) {
        processedTemplate = processedTemplate.replaceAll('{core:communication_language}', userInfo.responseLanguage);
      }

      // If this agent has agentConfig nodes, add them after the existing comment
      if (agent.agentConfigNodes && agent.agentConfigNodes.length > 0) {
        // Find the agent-specific configuration nodes comment
        const commentPattern = /(\s*<!-- Agent-specific configuration nodes -->)/;
        const commentMatch = processedTemplate.match(commentPattern);

        if (commentMatch) {
          // Add nodes right after the comment
          let agentSpecificNodes = '';
          for (const node of agent.agentConfigNodes) {
            agentSpecificNodes += `\n    ${node}`;
          }

          processedTemplate = processedTemplate.replace(commentPattern, `$1${agentSpecificNodes}`);
        }
      }

      configContent += processedTemplate;

      // Ensure POSIX-compliant final newline
      if (!configContent.endsWith('\n')) {
        configContent += '\n';
      }

      await fs.writeFile(configPath, configContent, 'utf8');
      this.installedFiles.push(configPath); // Track agent config files
      createdCount++;
    }

    // Generate agent manifest with overrides applied
    await this.generateAgentManifest(bmadDir, agentDetails);

    return { total: agents.length, created: createdCount, skipped: skippedCount };
  }

  /**
   * Generate agent manifest XML file
   * @param {string} bmadDir - BMAD installation directory
   * @param {Array} agentDetails - Array of agent details
   */
  async generateAgentManifest(bmadDir, agentDetails) {
    const manifestPath = path.join(bmadDir, '_cfg', 'agent-manifest.csv');
    await AgentPartyGenerator.writeAgentParty(manifestPath, agentDetails, { forWeb: false });
  }

  /**
   * Extract nodes with agentConfig="true" from agent content
   * @param {string} content - Agent file content
   * @returns {Array} Array of XML nodes that should be added to agent config
   */
  extractAgentConfigNodes(content) {
    const nodes = [];

    try {
      // Find all XML nodes with agentConfig="true"
      // Match self-closing tags and tags with content
      const selfClosingPattern = /<([a-zA-Z][a-zA-Z0-9_-]*)\s+[^>]*agentConfig="true"[^>]*\/>/g;
      const withContentPattern = /<([a-zA-Z][a-zA-Z0-9_-]*)\s+[^>]*agentConfig="true"[^>]*>([\s\S]*?)<\/\1>/g;

      // Extract self-closing tags
      let match;
      while ((match = selfClosingPattern.exec(content)) !== null) {
        // Extract just the tag without children (structure only)
        const tagMatch = match[0].match(/<([a-zA-Z][a-zA-Z0-9_-]*)([^>]*)\/>/);
        if (tagMatch) {
          const tagName = tagMatch[1];
          const attributes = tagMatch[2].replace(/\s*agentConfig="true"/, ''); // Remove agentConfig attribute
          nodes.push(`<${tagName}${attributes}></${tagName}>`);
        }
      }

      // Extract tags with content
      while ((match = withContentPattern.exec(content)) !== null) {
        const fullMatch = match[0];
        const tagName = match[1];

        // Extract opening tag with attributes (removing agentConfig="true")
        const openingTagMatch = fullMatch.match(new RegExp(`<${tagName}([^>]*)>`));
        if (openingTagMatch) {
          const attributes = openingTagMatch[1].replace(/\s*agentConfig="true"/, '');
          // Add empty node structure (no children)
          nodes.push(`<${tagName}${attributes}></${tagName}>`);
        }
      }
    } catch (error) {
      console.error('Error extracting agentConfig nodes:', error);
    }

    return nodes;
  }

  /**
   * Copy IDE-specific documentation to BMAD docs
   * @param {Array} ides - List of selected IDEs
   * @param {string} bmadDir - BMAD installation directory
   */
  async copyIdeDocumentation(ides, bmadDir) {
    const docsDir = path.join(bmadDir, 'docs');
    await fs.ensureDir(docsDir);

    for (const ide of ides) {
      const sourceDocPath = path.join(getProjectRoot(), 'docs', 'ide-info', `${ide}.md`);
      const targetDocPath = path.join(docsDir, `${ide}-instructions.md`);

      if (await fs.pathExists(sourceDocPath)) {
        await this.copyFileWithPlaceholderReplacement(sourceDocPath, targetDocPath, this.bmadFolderName || 'bmad');
      }
    }
  }
}

module.exports = { Installer };
