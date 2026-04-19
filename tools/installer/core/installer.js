const path = require('node:path');
const fs = require('../fs-native');
const { Manifest } = require('./manifest');
const { OfficialModules } = require('../modules/official-modules');
const { IdeManager } = require('../ide/manager');
const { FileOps } = require('../file-ops');
const { Config } = require('./config');
const { getProjectRoot, getSourcePath } = require('../project-root');
const { ManifestGenerator } = require('./manifest-generator');
const prompts = require('../prompts');
const { BMAD_FOLDER_NAME } = require('../ide/shared/path-utils');
const { InstallPaths } = require('./install-paths');
const { ExternalModuleManager } = require('../modules/external-manager');

const { ExistingInstall } = require('./existing-install');

class Installer {
  constructor() {
    this.externalModuleManager = new ExternalModuleManager();
    this.manifest = new Manifest();
    this.ideManager = new IdeManager();
    this.fileOps = new FileOps();
    this.installedFiles = new Set(); // Track all installed files
    this.bmadFolderName = BMAD_FOLDER_NAME;
  }

  /**
   * Read the module version from .claude-plugin/marketplace.json
   * Walks up from sourcePath looking for .claude-plugin/marketplace.json
   * @param {string} sourcePath - Module source directory
   * @returns {string} Version string or empty string
   */
  async _getMarketplaceVersion(sourcePath) {
    let dir = sourcePath;
    for (let i = 0; i < 5; i++) {
      const marketplacePath = path.join(dir, '.claude-plugin', 'marketplace.json');
      if (await fs.pathExists(marketplacePath)) {
        try {
          const data = JSON.parse(await fs.readFile(marketplacePath, 'utf8'));
          return this._extractMarketplaceVersion(data);
        } catch {
          return '';
        }
      }
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
    return '';
  }

  /**
   * Extract the highest version from marketplace.json plugins array
   */
  _extractMarketplaceVersion(data) {
    const plugins = data?.plugins;
    if (!Array.isArray(plugins) || plugins.length === 0) return '';
    let best = '';
    for (const p of plugins) {
      if (p.version && (!best || p.version > best)) best = p.version;
    }
    return best;
  }

  /**
   * Main installation method
   * @param {Object} config - Installation configuration
   * @param {string} config.directory - Target directory
   * @param {string[]} config.modules - Modules to install (including 'core')
   * @param {string[]} config.ides - IDEs to configure
   */
  async install(originalConfig) {
    let updateState = null;

    try {
      const config = Config.build(originalConfig);
      const paths = await InstallPaths.create(config);
      const officialModules = await OfficialModules.build(config, paths);
      const existingInstall = await ExistingInstall.detect(paths.bmadDir);

      if (existingInstall.installed) {
        await this._removeDeselectedModules(existingInstall, config, paths);
        updateState = await this._prepareUpdateState(paths, config, existingInstall, officialModules);
        await this._removeDeselectedIdes(existingInstall, config, paths);
      }

      await this._validateIdeSelection(config);

      // Capture pre-install module versions for from→to display
      const preInstallVersions = new Map();
      if (existingInstall.installed) {
        const existingModules = await this.manifest.getAllModuleVersions(paths.bmadDir);
        for (const mod of existingModules) {
          if (mod.name && mod.version) {
            preInstallVersions.set(mod.name, mod.version);
          }
        }
      }

      // Results collector for consolidated summary
      const results = [];
      const addResult = (step, status, detail = '', meta = {}) => results.push({ step, status, detail, ...meta });

      // Capture previously installed skill IDs before they get overwritten
      const previousSkillIds = new Set();
      const prevCsvPath = path.join(paths.bmadDir, '_config', 'skill-manifest.csv');
      if (await fs.pathExists(prevCsvPath)) {
        try {
          const csvParse = require('csv-parse/sync');
          const content = await fs.readFile(prevCsvPath, 'utf8');
          const records = csvParse.parse(content, { columns: true, skip_empty_lines: true });
          for (const r of records) {
            if (r.canonicalId) previousSkillIds.add(r.canonicalId);
          }
        } catch (error) {
          await prompts.log.warn(`Failed to parse skill-manifest.csv: ${error.message}`);
        }
      }

      const allModules = config.modules || [];

      await this._installAndConfigure(config, originalConfig, paths, allModules, allModules, addResult, officialModules);

      await this._setupIdes(config, allModules, paths, addResult, previousSkillIds);

      // Skills are now in IDE directories — remove redundant copies from _bmad/.
      // Also cleans up skill dirs left by older installer versions.
      await this._cleanupSkillDirs(paths.bmadDir);

      const restoreResult = await this._restoreUserFiles(paths, updateState);

      // Render consolidated summary
      await this.renderInstallSummary(results, {
        bmadDir: paths.bmadDir,
        modules: config.modules,
        ides: config.ides,
        customFiles: restoreResult.customFiles.length > 0 ? restoreResult.customFiles : undefined,
        modifiedFiles: restoreResult.modifiedFiles.length > 0 ? restoreResult.modifiedFiles : undefined,
        preInstallVersions,
      });

      return {
        success: true,
        path: paths.bmadDir,
        modules: config.modules,
        ides: config.ides,
        projectDir: paths.projectRoot,
      };
    } catch (error) {
      await prompts.log.error('Installation failed');

      // Clean up any temp backup directories that were created before the failure
      try {
        if (updateState?.tempBackupDir && (await fs.pathExists(updateState.tempBackupDir))) {
          await fs.remove(updateState.tempBackupDir);
        }
        if (updateState?.tempModifiedBackupDir && (await fs.pathExists(updateState.tempModifiedBackupDir))) {
          await fs.remove(updateState.tempModifiedBackupDir);
        }
      } catch {
        // Best-effort cleanup — don't mask the original error
      }

      throw error;
    }
  }

  /**
   * Remove modules that were previously installed but are no longer selected.
   * No confirmation — the user's module selection is the decision.
   */
  async _removeDeselectedModules(existingInstall, config, paths) {
    const previouslyInstalled = new Set(existingInstall.moduleIds);
    const newlySelected = new Set(config.modules || []);
    const toRemove = [...previouslyInstalled].filter((m) => !newlySelected.has(m) && m !== 'core');

    for (const moduleId of toRemove) {
      const modulePath = paths.moduleDir(moduleId);
      try {
        if (await fs.pathExists(modulePath)) {
          await fs.remove(modulePath);
        }
      } catch (error) {
        await prompts.log.warn(`Warning: Failed to remove ${moduleId}: ${error.message}`);
      }
    }
  }

  /**
   * Fail fast if all selected IDEs are suspended.
   */
  async _validateIdeSelection(config) {
    if (!config.ides || config.ides.length === 0) return;

    await this.ideManager.ensureInitialized();
    const suspendedIdes = config.ides.filter((ide) => {
      const handler = this.ideManager.handlers.get(ide);
      return handler?.platformConfig?.suspended;
    });

    if (suspendedIdes.length > 0 && suspendedIdes.length === config.ides.length) {
      for (const ide of suspendedIdes) {
        const handler = this.ideManager.handlers.get(ide);
        await prompts.log.error(`${handler.displayName || ide}: ${handler.platformConfig.suspended}`);
      }
      throw new Error(
        `All selected tool(s) are suspended: ${suspendedIdes.join(', ')}. Installation aborted to prevent upgrading _bmad/ without a working IDE configuration.`,
      );
    }
  }

  /**
   * Remove IDEs that were previously installed but are no longer selected.
   * No confirmation — the user's IDE selection is the decision.
   */
  async _removeDeselectedIdes(existingInstall, config, paths) {
    const previouslyInstalled = new Set(existingInstall.ides);
    const newlySelected = new Set(config.ides || []);
    const toRemove = [...previouslyInstalled].filter((ide) => !newlySelected.has(ide));

    if (toRemove.length === 0) return;

    await this.ideManager.ensureInitialized();
    for (const ide of toRemove) {
      try {
        const handler = this.ideManager.handlers.get(ide);
        if (handler) {
          await handler.cleanup(paths.projectRoot);
        }
      } catch (error) {
        await prompts.log.warn(`Warning: Failed to remove ${ide}: ${error.message}`);
      }
    }
  }

  /**
   * Install modules, create directories, generate configs and manifests.
   */
  async _installAndConfigure(config, originalConfig, paths, officialModuleIds, allModules, addResult, officialModules) {
    const isQuickUpdate = config.isQuickUpdate();
    const moduleConfigs = officialModules.moduleConfigs;

    const dirResults = { createdDirs: [], movedDirs: [], createdWdsFolders: [] };

    const installTasks = [];

    installTasks.push({
      title: 'Installing shared scripts',
      task: async () => {
        await this._installSharedScripts(paths);
        addResult('Shared scripts', 'ok');
        return 'Shared scripts installed';
      },
    });

    if (allModules.length > 0) {
      installTasks.push({
        title: isQuickUpdate ? `Updating ${allModules.length} module(s)` : `Installing ${allModules.length} module(s)`,
        task: async (message) => {
          const installedModuleNames = new Set();

          await this._installOfficialModules(config, paths, officialModuleIds, addResult, isQuickUpdate, officialModules, {
            message,
            installedModuleNames,
          });

          return `${allModules.length} module(s) ${isQuickUpdate ? 'updated' : 'installed'}`;
        },
      });
    }

    installTasks.push({
      title: 'Creating module directories',
      task: async (message) => {
        const verboseMode = process.env.BMAD_VERBOSE_INSTALL === 'true' || config.verbose;
        const moduleLogger = {
          log: async (msg) => (verboseMode ? await prompts.log.message(msg) : undefined),
          error: async (msg) => await prompts.log.error(msg),
          warn: async (msg) => await prompts.log.warn(msg),
        };

        if (config.modules && config.modules.length > 0) {
          for (const moduleName of config.modules) {
            message(`Setting up ${moduleName}...`);
            const result = await officialModules.createModuleDirectories(moduleName, paths.bmadDir, {
              installedIDEs: config.ides || [],
              moduleConfig: moduleConfigs[moduleName] || {},
              existingModuleConfig: officialModules.existingConfig?.[moduleName] || {},
              coreConfig: moduleConfigs.core || {},
              logger: moduleLogger,
              silent: true,
            });
            if (result) {
              dirResults.createdDirs.push(...result.createdDirs);
              dirResults.movedDirs.push(...(result.movedDirs || []));
              dirResults.createdWdsFolders.push(...result.createdWdsFolders);
            }
          }
        }

        addResult('Module directories', 'ok');
        return 'Module directories created';
      },
    });

    const configTask = {
      title: 'Generating configurations',
      task: async (message) => {
        await this.generateModuleConfigs(paths.bmadDir, moduleConfigs);
        addResult('Configurations', 'ok', 'generated');

        this.installedFiles.add(paths.manifestFile());
        this.installedFiles.add(paths.centralConfig());
        this.installedFiles.add(paths.centralUserConfig());

        message('Generating manifests...');
        const manifestGen = new ManifestGenerator();

        const allModulesForManifest = config.isQuickUpdate()
          ? originalConfig._existingModules || allModules || []
          : originalConfig._preserveModules
            ? [...allModules, ...originalConfig._preserveModules]
            : allModules || [];

        let modulesForCsvPreserve;
        if (config.isQuickUpdate()) {
          modulesForCsvPreserve = originalConfig._existingModules || allModules || [];
        } else {
          modulesForCsvPreserve = originalConfig._preserveModules ? [...allModules, ...originalConfig._preserveModules] : allModules;
        }

        await manifestGen.generateManifests(paths.bmadDir, allModulesForManifest, [...this.installedFiles], {
          ides: config.ides || [],
          preservedModules: modulesForCsvPreserve,
          moduleConfigs,
        });

        message('Generating help catalog...');
        await this.mergeModuleHelpCatalogs(paths.bmadDir, manifestGen.agents);
        addResult('Help catalog', 'ok');

        return 'Configurations generated';
      },
    };
    installTasks.push(configTask);

    // Run install + dirs first, then render dir output, then run config generation
    const mainTasks = installTasks.filter((t) => t !== configTask);
    await prompts.tasks(mainTasks);

    const color = await prompts.getColor();
    if (dirResults.movedDirs.length > 0) {
      const lines = dirResults.movedDirs.map((d) => `  ${d}`).join('\n');
      await prompts.log.message(color.cyan(`Moved directories:\n${lines}`));
    }
    if (dirResults.createdDirs.length > 0) {
      const lines = dirResults.createdDirs.map((d) => `  ${d}`).join('\n');
      await prompts.log.message(color.yellow(`Created directories:\n${lines}`));
    }
    if (dirResults.createdWdsFolders.length > 0) {
      const lines = dirResults.createdWdsFolders.map((f) => color.dim(`  \u2713 ${f}/`)).join('\n');
      await prompts.log.message(color.cyan(`Created WDS folder structure:\n${lines}`));
    }

    await prompts.tasks([configTask]);
  }

  /**
   * Set up IDE integrations for each selected IDE.
   */
  async _setupIdes(config, allModules, paths, addResult, previousSkillIds = new Set()) {
    if (config.skipIde || !config.ides || config.ides.length === 0) return;

    await this.ideManager.ensureInitialized();
    const validIdes = config.ides.filter((ide) => ide && typeof ide === 'string');

    if (validIdes.length === 0) {
      addResult('IDE configuration', 'warn', 'no valid IDEs selected');
      return;
    }

    for (const ide of validIdes) {
      const setupResult = await this.ideManager.setup(ide, paths.projectRoot, paths.bmadDir, {
        selectedModules: allModules || [],
        verbose: config.verbose,
        previousSkillIds,
      });

      if (setupResult.success) {
        addResult(ide, 'ok', setupResult.detail || '');
      } else {
        addResult(ide, 'error', setupResult.error || 'failed');
      }
    }
  }

  /**
   * Remove skill directories from _bmad/ after IDE installation.
   * Skills are self-contained in IDE directories, so _bmad/ only needs
   * module-level files (config.yaml, _config/, etc.).
   * Also cleans up skill dirs left by older installer versions.
   * @param {string} bmadDir - BMAD installation directory
   */
  async _cleanupSkillDirs(bmadDir) {
    const csv = require('csv-parse/sync');
    const csvPath = path.join(bmadDir, '_config', 'skill-manifest.csv');
    if (!(await fs.pathExists(csvPath))) return;

    const csvContent = await fs.readFile(csvPath, 'utf8');
    const records = csv.parse(csvContent, { columns: true, skip_empty_lines: true });
    const bmadFolderName = path.basename(bmadDir);
    const bmadPrefix = bmadFolderName + '/';

    for (const record of records) {
      if (!record.path) continue;
      const relativePath = record.path.startsWith(bmadPrefix) ? record.path.slice(bmadPrefix.length) : record.path;
      const sourceDir = path.dirname(path.join(bmadDir, relativePath));
      if (await fs.pathExists(sourceDir)) {
        await fs.remove(sourceDir);
      }
    }
  }

  /**
   * Restore custom and modified files that were backed up before the update.
   * No-op for fresh installs (updateState is null).
   * @param {Object} paths - InstallPaths instance
   * @param {Object|null} updateState - From _prepareUpdateState, or null for fresh installs
   * @returns {Object} { customFiles, modifiedFiles } — lists of restored files
   */
  async _restoreUserFiles(paths, updateState) {
    const noFiles = { customFiles: [], modifiedFiles: [] };

    if (!updateState || (updateState.customFiles.length === 0 && updateState.modifiedFiles.length === 0)) {
      return noFiles;
    }

    let restoredCustomFiles = [];
    let restoredModifiedFiles = [];

    await prompts.tasks([
      {
        title: 'Finalizing installation',
        task: async (message) => {
          if (updateState.customFiles.length > 0) {
            message(`Restoring ${updateState.customFiles.length} custom files...`);

            for (const originalPath of updateState.customFiles) {
              const relativePath = path.relative(paths.bmadDir, originalPath);
              const backupPath = path.join(updateState.tempBackupDir, relativePath);

              if (await fs.pathExists(backupPath)) {
                await fs.ensureDir(path.dirname(originalPath));
                await fs.copy(backupPath, originalPath, { overwrite: true });
              }
            }

            if (updateState.tempBackupDir && (await fs.pathExists(updateState.tempBackupDir))) {
              await fs.remove(updateState.tempBackupDir);
            }

            restoredCustomFiles = updateState.customFiles;
          }

          if (updateState.modifiedFiles.length > 0) {
            restoredModifiedFiles = updateState.modifiedFiles;

            if (updateState.tempModifiedBackupDir && (await fs.pathExists(updateState.tempModifiedBackupDir))) {
              message(`Restoring ${restoredModifiedFiles.length} modified files as .bak...`);

              for (const modifiedFile of restoredModifiedFiles) {
                const relativePath = path.relative(paths.bmadDir, modifiedFile.path);
                const tempBackupPath = path.join(updateState.tempModifiedBackupDir, relativePath);
                const bakPath = modifiedFile.path + '.bak';

                if (await fs.pathExists(tempBackupPath)) {
                  await fs.ensureDir(path.dirname(bakPath));
                  await fs.copy(tempBackupPath, bakPath, { overwrite: true });
                }
              }

              await fs.remove(updateState.tempModifiedBackupDir);
            }
          }

          return 'Installation finalized';
        },
      },
    ]);

    return { customFiles: restoredCustomFiles, modifiedFiles: restoredModifiedFiles };
  }

  /**
   * Common update preparation: detect files, preserve core config, back up.
   * @param {Object} paths - InstallPaths instance
   * @param {Object} config - Clean config (may have coreConfig updated)
   * @param {Object} existingInstall - Detection result
   * @param {Object} officialModules - OfficialModules instance
   * @returns {Object} Update state: { customFiles, modifiedFiles, tempBackupDir, tempModifiedBackupDir }
   */
  async _prepareUpdateState(paths, config, existingInstall, officialModules) {
    // Detect custom and modified files BEFORE updating (compare current files vs files-manifest.csv)
    const existingFilesManifest = await this.readFilesManifest(paths.bmadDir);
    const { customFiles, modifiedFiles } = await this.detectCustomFiles(paths.bmadDir, existingFilesManifest);

    // Preserve existing core configuration during updates
    // (no-op for quick-update which already has core config from collectModuleConfigQuick)
    const coreConfigPath = paths.moduleConfig('core');
    if ((await fs.pathExists(coreConfigPath)) && (!config.coreConfig || Object.keys(config.coreConfig).length === 0)) {
      try {
        const yaml = require('yaml');
        const coreConfigContent = await fs.readFile(coreConfigPath, 'utf8');
        const existingCoreConfig = yaml.parse(coreConfigContent);

        config.coreConfig = existingCoreConfig;
        officialModules.moduleConfigs.core = existingCoreConfig;
      } catch (error) {
        await prompts.log.warn(`Warning: Could not read existing core config: ${error.message}`);
      }
    }

    const backupDirs = await this._backupUserFiles(paths, customFiles, modifiedFiles);

    return {
      customFiles,
      modifiedFiles,
      tempBackupDir: backupDirs.tempBackupDir,
      tempModifiedBackupDir: backupDirs.tempModifiedBackupDir,
    };
  }

  /**
   * Back up custom and modified files to temp directories before overwriting.
   * Returns the temp directory paths (or undefined if no files to back up).
   * @param {Object} paths - InstallPaths instance
   * @param {string[]} customFiles - Absolute paths of custom (user-added) files
   * @param {Object[]} modifiedFiles - Array of { path, relativePath } for modified files
   * @returns {Object} { tempBackupDir, tempModifiedBackupDir } — undefined if no files
   */
  async _backupUserFiles(paths, customFiles, modifiedFiles) {
    let tempBackupDir;
    let tempModifiedBackupDir;

    if (customFiles.length > 0) {
      tempBackupDir = path.join(paths.projectRoot, '_bmad-custom-backup-temp');
      await fs.ensureDir(tempBackupDir);

      for (const customFile of customFiles) {
        const relativePath = path.relative(paths.bmadDir, customFile);
        const backupPath = path.join(tempBackupDir, relativePath);
        await fs.ensureDir(path.dirname(backupPath));
        await fs.copy(customFile, backupPath);
      }
    }

    if (modifiedFiles.length > 0) {
      tempModifiedBackupDir = path.join(paths.projectRoot, '_bmad-modified-backup-temp');
      await fs.ensureDir(tempModifiedBackupDir);

      for (const modifiedFile of modifiedFiles) {
        const relativePath = path.relative(paths.bmadDir, modifiedFile.path);
        const tempBackupPath = path.join(tempModifiedBackupDir, relativePath);
        await fs.ensureDir(path.dirname(tempBackupPath));
        await fs.copy(modifiedFile.path, tempBackupPath, { overwrite: true });
      }
    }

    return { tempBackupDir, tempModifiedBackupDir };
  }

  /**
   * Sync src/scripts/* → _bmad/scripts/ so shared Python scripts
   * (e.g. resolve_customization.py) are available at install time.
   * Wipes the destination first so files removed or renamed in source
   * don't linger and get recorded as installed. Also seeds
   * _bmad/custom/.gitignore on fresh installs so *.user.toml overrides
   * stay out of version control.
   */
  async _installSharedScripts(paths) {
    const srcScriptsDir = path.join(paths.srcDir, 'src', 'scripts');
    if (!(await fs.pathExists(srcScriptsDir))) {
      throw new Error(`Shared scripts source directory not found: ${srcScriptsDir}`);
    }

    await fs.remove(paths.scriptsDir);
    await fs.ensureDir(paths.scriptsDir);
    await fs.copy(srcScriptsDir, paths.scriptsDir, { overwrite: true });
    await this._trackFilesRecursive(paths.scriptsDir);

    const customGitignore = path.join(paths.customDir, '.gitignore');
    if (!(await fs.pathExists(customGitignore))) {
      await fs.writeFile(customGitignore, '*.user.toml\n', 'utf8');
      this.installedFiles.add(customGitignore);
    }
  }

  async _trackFilesRecursive(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await this._trackFilesRecursive(full);
      } else if (entry.isFile()) {
        this.installedFiles.add(full);
      }
    }
  }

  /**
   * Install official (non-custom) modules.
   * @param {Object} config - Installation configuration
   * @param {Object} paths - InstallPaths instance
   * @param {string[]} officialModuleIds - Official module IDs to install
   * @param {Function} addResult - Callback to record installation results
   * @param {boolean} isQuickUpdate - Whether this is a quick update
   * @param {Object} ctx - Shared context: { message, installedModuleNames }
   */
  async _installOfficialModules(config, paths, officialModuleIds, addResult, isQuickUpdate, officialModules, ctx) {
    const { message, installedModuleNames } = ctx;
    const { CustomModuleManager } = require('../modules/custom-module-manager');

    for (const moduleName of officialModuleIds) {
      if (installedModuleNames.has(moduleName)) continue;
      installedModuleNames.add(moduleName);

      message(`${isQuickUpdate ? 'Updating' : 'Installing'} ${moduleName}...`);

      const moduleConfig = officialModules.moduleConfigs[moduleName] || {};
      const installResult = await officialModules.install(
        moduleName,
        paths.bmadDir,
        (filePath) => {
          this.installedFiles.add(filePath);
        },
        {
          skipModuleInstaller: true,
          moduleConfig: moduleConfig,
          installer: this,
          silent: true,
        },
      );

      // Get display name from source module.yaml; version from resolution cache or marketplace.json
      const sourcePath = await officialModules.findModuleSource(moduleName, { silent: true });
      const moduleInfo = sourcePath ? await officialModules.getModuleInfo(sourcePath, moduleName, '') : null;
      const displayName = moduleInfo?.name || moduleName;

      // Prefer version from resolution cache (accurate for custom/local modules),
      // fall back to marketplace.json walk-up for official modules
      const cachedResolution = CustomModuleManager._resolutionCache.get(moduleName);
      const version = cachedResolution?.version || (sourcePath ? await this._getMarketplaceVersion(sourcePath) : '');
      addResult(displayName, 'ok', '', { moduleCode: moduleName, newVersion: version });
    }
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
      await prompts.log.warn('Could not read files-manifest.csv: ' + error.message);
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

    // Memory subtrees (v6.1: _bmad/_memory, current: _bmad/memory) hold
    // per-user runtime data generated by agents with sidecars. These files
    // aren't installer-managed and must never be reported as "custom" or
    // "modified" — they're user state, not user overrides.
    const bmadMemoryPaths = ['_memory', 'memory'];

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

            if (bmadMemoryPaths.some((mp) => relativePath === mp || relativePath.startsWith(mp + '/'))) {
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
    const nonModuleDirs = new Set(['_config', '_memory', 'memory', 'docs', 'scripts', 'custom']);
    const installedModules = entries.filter((entry) => entry.isDirectory() && !nonModuleDirs.has(entry.name)).map((entry) => entry.name);

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
   * Merge all module-help.csv files into a single bmad-help.csv.
   * Scans all installed modules for module-help.csv and merges them.
   * Enriches agent info from the in-memory agent list produced by ManifestGenerator.
   * Output is written to _bmad/_config/bmad-help.csv.
   * @param {string} bmadDir - BMAD installation directory
   * @param {Array<Object>} agentEntries - Agents collected from module.yaml (code, name, title, icon, module, ...)
   */
  async mergeModuleHelpCatalogs(bmadDir, agentEntries = []) {
    const allRows = [];
    const headerRow =
      'module,phase,name,code,sequence,workflow-file,command,required,agent-name,agent-command,agent-display-name,agent-title,options,description,output-location,outputs';

    // Build agent lookup from the in-memory list (agent code → command + display fields).
    const agentInfo = new Map();
    for (const agent of agentEntries) {
      if (!agent || !agent.code) continue;
      const agentCommand = agent.module ? `bmad:${agent.module}:agent:${agent.code}` : `bmad:agent:${agent.code}`;
      const displayName = agent.name || agent.code;
      const titleCombined = agent.icon && agent.title ? `${agent.icon} ${agent.title}` : agent.title || agent.code;
      agentInfo.set(agent.code, {
        command: agentCommand,
        displayName,
        title: titleCombined,
      });
    }

    // Get all installed module directories
    const entries = await fs.readdir(bmadDir, { withFileTypes: true });
    const nonModuleDirs = new Set(['_config', '_memory', 'memory', 'docs', 'scripts', 'custom']);
    const installedModules = entries.filter((entry) => entry.isDirectory() && !nonModuleDirs.has(entry.name)).map((entry) => entry.name);

    // Add core module to scan (it's installed at root level as _config, but we check src/core-skills)
    const coreModulePath = getSourcePath('core-skills');
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

              // Pass through _meta rows as-is (module metadata, not a skill)
              if (phase === '_meta') {
                const finalModule = (!module || module.trim() === '') && moduleName !== 'core' ? moduleName : module || '';
                const metaRow = [finalModule, '_meta', '', '', '', '', '', 'false', '', '', '', '', '', '', outputLocation || '', ''];
                allRows.push(metaRow.map((c) => this.escapeCSVField(c)).join(','));
                continue;
              }

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
            await prompts.log.message(`  Merged module-help from: ${moduleName}`);
          }
        } catch (error) {
          await prompts.log.warn(`  Warning: Failed to read module-help.csv from ${moduleName}: ${error.message}`);
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
      await prompts.log.message(`  Generated bmad-help.csv: ${allRows.length} workflows`);
    }
  }

  /**
   * Render a consolidated install summary using prompts.note()
   * @param {Array} results - Array of {step, status: 'ok'|'error'|'warn', detail}
   * @param {Object} context - {bmadDir, modules, ides, customFiles, modifiedFiles}
   */
  async renderInstallSummary(results, context = {}) {
    const color = await prompts.getColor();
    const selectedIdes = new Set((context.ides || []).map((ide) => String(ide).toLowerCase()));

    // Build step lines with status indicators
    const preVersions = context.preInstallVersions || new Map();
    const lines = [];
    for (const r of results) {
      const stepLabel = r.step;

      let icon;
      if (r.status === 'ok') {
        icon = color.green('\u2713');
      } else if (r.status === 'warn') {
        icon = color.yellow('!');
      } else {
        icon = color.red('\u2717');
      }

      // Build version detail for module results
      let detail = '';
      if (r.moduleCode && r.newVersion) {
        const oldVersion = preVersions.get(r.moduleCode);
        if (oldVersion && oldVersion === r.newVersion) {
          detail = ` (v${r.newVersion}, no change)`;
        } else if (oldVersion) {
          detail = ` (v${oldVersion} → v${r.newVersion})`;
        } else {
          detail = ` (v${r.newVersion}, installed)`;
        }
      } else if (r.detail) {
        detail = ` (${r.detail})`;
      }
      lines.push(`  ${icon}  ${stepLabel}${detail}`);
    }

    if ((context.ides || []).length === 0) {
      lines.push(`  ${color.green('\u2713')}  No IDE selected (installed in _bmad only)`);
    }

    // Context and warnings
    lines.push('');
    if (context.bmadDir) {
      lines.push(`  Installed to: ${context.bmadDir}`);
    }
    if (context.customFiles && context.customFiles.length > 0) {
      lines.push(`  ${color.cyan(`Custom files preserved: ${context.customFiles.length}`)}`);
    }
    if (context.modifiedFiles && context.modifiedFiles.length > 0) {
      lines.push(`  ${color.yellow(`Modified files backed up (.bak): ${context.modifiedFiles.length}`)}`);
    }

    // Next steps
    lines.push(
      '',
      '  Get started:',
      `    1. Launch your AI agent from your project folder`,
      `    2. Not sure what to do? Invoke the ${color.cyan('bmad-help')} skill and ask it what to do!`,
      '',
      `    Blog, Docs and Guides: ${color.blue('https://bmadcode.com/')}`,
      `    Community: ${color.blue('https://discord.gg/gk8jAdXWmj')}`,
    );

    await prompts.box(lines.join('\n'), 'BMAD is ready to use!', {
      rounded: true,
      formatBorder: color.green,
    });
  }

  /**
   * Quick update method - preserves all settings and only prompts for new config fields
   * @param {Object} config - Configuration with directory
   * @returns {Object} Update result
   */
  async quickUpdate(config) {
    const projectDir = path.resolve(config.directory);
    const { bmadDir } = await this.findBmadDir(projectDir);

    // Check if bmad directory exists
    if (!(await fs.pathExists(bmadDir))) {
      throw new Error(`BMAD not installed at ${bmadDir}. Use regular install for first-time setup.`);
    }

    // Detect existing installation
    const existingInstall = await ExistingInstall.detect(bmadDir);
    const installedModules = existingInstall.moduleIds;
    const configuredIdes = existingInstall.ides;
    const projectRoot = path.dirname(bmadDir);

    // Get available modules (what we have source for)
    const availableModulesData = await new OfficialModules().listAvailable();
    const availableModules = [...availableModulesData.modules];

    // Add external official modules to available modules
    const externalModules = await this.externalModuleManager.listAvailable();
    for (const externalModule of externalModules) {
      if (installedModules.includes(externalModule.code) && !availableModules.some((m) => m.id === externalModule.code)) {
        availableModules.push({
          id: externalModule.code,
          name: externalModule.name,
          isExternal: true,
          fromExternal: true,
        });
      }
    }

    // Add installed community modules to available modules
    const { CommunityModuleManager } = require('../modules/community-manager');
    const communityMgr = new CommunityModuleManager();
    const communityModules = await communityMgr.listAll();
    for (const communityModule of communityModules) {
      if (installedModules.includes(communityModule.code) && !availableModules.some((m) => m.id === communityModule.code)) {
        availableModules.push({
          id: communityModule.code,
          name: communityModule.displayName,
          isExternal: true,
          fromCommunity: true,
        });
      }
    }

    // Add installed custom modules to available modules
    const { CustomModuleManager } = require('../modules/custom-module-manager');
    const customMgr = new CustomModuleManager();
    for (const moduleId of installedModules) {
      if (!availableModules.some((m) => m.id === moduleId)) {
        const customSource = await customMgr.findModuleSourceByCode(moduleId, { bmadDir });
        if (customSource) {
          availableModules.push({
            id: moduleId,
            name: moduleId,
            isExternal: true,
            fromCustom: true,
          });
        }
      }
    }

    const availableModuleIds = new Set(availableModules.map((m) => m.id));

    // Only update modules that are BOTH installed AND available (we have source for)
    const modulesToUpdate = installedModules.filter((id) => availableModuleIds.has(id));
    const skippedModules = installedModules.filter((id) => !availableModuleIds.has(id));

    if (skippedModules.length > 0) {
      await prompts.log.warn(`Skipping ${skippedModules.length} module(s) - no source available: ${skippedModules.join(', ')}`);
    }

    // Load existing configs and collect new fields (if any)
    await prompts.log.info('Checking for new configuration options...');
    const quickModules = new OfficialModules();
    await quickModules.loadExistingConfig(projectDir);

    let promptedForNewFields = false;

    const corePrompted = await quickModules.collectModuleConfigQuick('core', projectDir, true);
    if (corePrompted) {
      promptedForNewFields = true;
    }

    for (const moduleName of modulesToUpdate) {
      if (moduleName === 'core') continue; // Already collected above
      const modulePrompted = await quickModules.collectModuleConfigQuick(moduleName, projectDir, true);
      if (modulePrompted) {
        promptedForNewFields = true;
      }
    }

    if (!promptedForNewFields) {
      await prompts.log.success('All configuration is up to date, no new options to configure');
    }

    quickModules.collectedConfig._meta = {
      version: require(path.join(getProjectRoot(), 'package.json')).version,
      installDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    // Build config and delegate to install()
    const installConfig = {
      directory: projectDir,
      modules: modulesToUpdate,
      ides: configuredIdes,
      coreConfig: quickModules.collectedConfig.core,
      moduleConfigs: quickModules.collectedConfig,
      actionType: 'install',
      _quickUpdate: true,
      _preserveModules: skippedModules,
      _existingModules: installedModules,
    };

    await this.install(installConfig);

    return {
      success: true,
      moduleCount: modulesToUpdate.length,
      hadNewFields: promptedForNewFields,
      modules: modulesToUpdate,
      skippedModules: skippedModules,
      ides: configuredIdes,
    };
  }

  /**
   * Uninstall BMAD with selective removal options
   * @param {string} directory - Project directory
   * @param {Object} options - Uninstall options
   * @param {boolean} [options.removeModules=true] - Remove _bmad/ directory
   * @param {boolean} [options.removeIdeConfigs=true] - Remove IDE configurations
   * @param {boolean} [options.removeOutputFolder=false] - Remove user artifacts output folder
   * @returns {Object} Result with success status and removed components
   */
  async uninstall(directory, options = {}) {
    const projectDir = path.resolve(directory);
    const { bmadDir } = await this.findBmadDir(projectDir);

    if (!(await fs.pathExists(bmadDir))) {
      return { success: false, reason: 'not-installed' };
    }

    // 1. DETECT: Read state BEFORE deleting anything
    const existingInstall = await ExistingInstall.detect(bmadDir);
    const outputFolder = await this._readOutputFolder(bmadDir);

    const removed = { modules: false, ideConfigs: false, outputFolder: false };

    // 2. IDE CLEANUP (before _bmad/ deletion so configs are accessible)
    if (options.removeIdeConfigs !== false) {
      await this.uninstallIdeConfigs(projectDir, existingInstall, { silent: options.silent });
      removed.ideConfigs = true;
    }

    // 3. OUTPUT FOLDER (only if explicitly requested)
    if (options.removeOutputFolder === true && outputFolder) {
      removed.outputFolder = await this.uninstallOutputFolder(projectDir, outputFolder);
    }

    // 4. BMAD DIRECTORY (last, after everything that needs it)
    if (options.removeModules !== false) {
      removed.modules = await this.uninstallModules(projectDir);
    }

    return { success: true, removed, version: existingInstall.installed ? existingInstall.version : null };
  }

  /**
   * Uninstall IDE configurations only
   * @param {string} projectDir - Project directory
   * @param {Object} existingInstall - Detection result from detector.detect()
   * @param {Object} [options] - Options (e.g. { silent: true })
   * @returns {Promise<Object>} Results from IDE cleanup
   */
  async uninstallIdeConfigs(projectDir, existingInstall, options = {}) {
    await this.ideManager.ensureInitialized();
    const cleanupOptions = { isUninstall: true, silent: options.silent };
    const ideList = existingInstall.ides;
    if (ideList.length > 0) {
      return this.ideManager.cleanupByList(projectDir, ideList, cleanupOptions);
    }
    return this.ideManager.cleanup(projectDir, cleanupOptions);
  }

  /**
   * Remove user artifacts output folder
   * @param {string} projectDir - Project directory
   * @param {string} outputFolder - Output folder name (relative)
   * @returns {Promise<boolean>} Whether the folder was removed
   */
  async uninstallOutputFolder(projectDir, outputFolder) {
    if (!outputFolder) return false;
    const resolvedProject = path.resolve(projectDir);
    const outputPath = path.resolve(resolvedProject, outputFolder);
    if (!outputPath.startsWith(resolvedProject + path.sep)) {
      return false;
    }
    if (await fs.pathExists(outputPath)) {
      await fs.remove(outputPath);
      return true;
    }
    return false;
  }

  /**
   * Remove the _bmad/ directory
   * @param {string} projectDir - Project directory
   * @returns {Promise<boolean>} Whether the directory was removed
   */
  async uninstallModules(projectDir) {
    const { bmadDir } = await this.findBmadDir(projectDir);
    if (await fs.pathExists(bmadDir)) {
      await fs.remove(bmadDir);
      return true;
    }
    return false;
  }

  /**
   * Get installation status
   */
  async getStatus(directory) {
    const projectDir = path.resolve(directory);
    const { bmadDir } = await this.findBmadDir(projectDir);
    return await ExistingInstall.detect(bmadDir);
  }

  /**
   * Get available modules
   */
  async getAvailableModules() {
    return await new OfficialModules().listAvailable();
  }

  /**
   * Get the configured output folder name for a project
   * Resolves bmadDir internally from projectDir
   * @param {string} projectDir - Project directory
   * @returns {string} Output folder name (relative, default: '_bmad-output')
   */
  async getOutputFolder(projectDir) {
    const { bmadDir } = await this.findBmadDir(projectDir);
    return this._readOutputFolder(bmadDir);
  }

  /**
   * Find the bmad installation directory in a project
   * Always uses the standard _bmad folder name
   * @param {string} projectDir - Project directory
   * @returns {Promise<Object>} { bmadDir: string }
   */
  async findBmadDir(projectDir) {
    const bmadDir = path.join(projectDir, BMAD_FOLDER_NAME);
    return { bmadDir };
  }

  /**
   * Read the output_folder setting from module config files
   * Checks bmm/config.yaml first, then other module configs
   * @param {string} bmadDir - BMAD installation directory
   * @returns {string} Output folder path or default
   */
  async _readOutputFolder(bmadDir) {
    const yaml = require('yaml');

    // Check bmm/config.yaml first (most common)
    const bmmConfigPath = path.join(bmadDir, 'bmm', 'config.yaml');
    if (await fs.pathExists(bmmConfigPath)) {
      try {
        const content = await fs.readFile(bmmConfigPath, 'utf8');
        const config = yaml.parse(content);
        if (config && config.output_folder) {
          // Strip {project-root}/ prefix if present
          return config.output_folder.replace(/^\{project-root\}[/\\]/, '');
        }
      } catch {
        // Fall through to other modules
      }
    }

    // Scan other module config.yaml files
    try {
      const entries = await fs.readdir(bmadDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory() || entry.name === 'bmm' || entry.name.startsWith('_')) continue;
        const configPath = path.join(bmadDir, entry.name, 'config.yaml');
        if (await fs.pathExists(configPath)) {
          try {
            const content = await fs.readFile(configPath, 'utf8');
            const config = yaml.parse(content);
            if (config && config.output_folder) {
              return config.output_folder.replace(/^\{project-root\}[/\\]/, '');
            }
          } catch {
            // Continue scanning
          }
        }
      }
    } catch {
      // Directory scan failed
    }

    // Default fallback
    return '_bmad-output';
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
}

module.exports = { Installer };
