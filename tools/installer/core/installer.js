const path = require('node:path');
const fs = require('fs-extra');
const { Manifest } = require('./manifest');
const { OfficialModules } = require('../modules/official-modules');
const { CustomModules } = require('../modules/custom-modules');
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
    this.customModules = new CustomModules();
    this.ideManager = new IdeManager();
    this.fileOps = new FileOps();
    this.installedFiles = new Set(); // Track all installed files
    this.bmadFolderName = BMAD_FOLDER_NAME;
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

      await this.customModules.discoverPaths(originalConfig, paths);

      if (existingInstall.installed) {
        await this._removeDeselectedModules(existingInstall, config, paths);
        updateState = await this._prepareUpdateState(paths, config, existingInstall, officialModules);
        await this._removeDeselectedIdes(existingInstall, config, paths);
      }

      await this._validateIdeSelection(config);

      // Results collector for consolidated summary
      const results = [];
      const addResult = (step, status, detail = '') => results.push({ step, status, detail });

      await this._cacheCustomModules(paths, addResult);

      // Compute module lists: official = selected minus custom, all = both
      const customModuleIds = new Set(this.customModules.paths.keys());
      const officialModuleIds = (config.modules || []).filter((m) => !customModuleIds.has(m));
      const allModules = [...officialModuleIds, ...[...customModuleIds].filter((id) => !officialModuleIds.includes(id))];

      await this._installAndConfigure(config, originalConfig, paths, officialModuleIds, allModules, addResult, officialModules);

      await this._setupIdes(config, allModules, paths, addResult);

      const restoreResult = await this._restoreUserFiles(paths, updateState);

      // Render consolidated summary
      await this.renderInstallSummary(results, {
        bmadDir: paths.bmadDir,
        modules: config.modules,
        ides: config.ides,
        customFiles: restoreResult.customFiles.length > 0 ? restoreResult.customFiles : undefined,
        modifiedFiles: restoreResult.modifiedFiles.length > 0 ? restoreResult.modifiedFiles : undefined,
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
   * Cache custom modules into the local cache directory.
   * Updates this.customModules.paths in place with cached locations.
   */
  async _cacheCustomModules(paths, addResult) {
    if (!this.customModules.paths || this.customModules.paths.size === 0) return;

    const { CustomModuleCache } = require('./custom-module-cache');
    const customCache = new CustomModuleCache(paths.bmadDir);

    for (const [moduleId, sourcePath] of this.customModules.paths) {
      const cachedInfo = await customCache.cacheModule(moduleId, sourcePath, {
        sourcePath: sourcePath,
      });
      this.customModules.paths.set(moduleId, cachedInfo.cachePath);
    }

    addResult('Custom modules cached', 'ok');
  }

  /**
   * Install modules, create directories, generate configs and manifests.
   */
  async _installAndConfigure(config, originalConfig, paths, officialModuleIds, allModules, addResult, officialModules) {
    const isQuickUpdate = config.isQuickUpdate();
    const moduleConfigs = officialModules.moduleConfigs;

    const dirResults = { createdDirs: [], movedDirs: [], createdWdsFolders: [] };

    const installTasks = [];

    if (allModules.length > 0) {
      installTasks.push({
        title: isQuickUpdate ? `Updating ${allModules.length} module(s)` : `Installing ${allModules.length} module(s)`,
        task: async (message) => {
          const installedModuleNames = new Set();

          await this._installOfficialModules(config, paths, officialModuleIds, addResult, isQuickUpdate, officialModules, {
            message,
            installedModuleNames,
          });

          await this._installCustomModules(config, paths, addResult, officialModules, {
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
        this.installedFiles.add(paths.agentManifest());

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
        });

        message('Generating help catalog...');
        await this.mergeModuleHelpCatalogs(paths.bmadDir);
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
  async _setupIdes(config, allModules, paths, addResult) {
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
      });

      if (setupResult.success) {
        addResult(ide, 'ok', setupResult.detail || '');
      } else {
        addResult(ide, 'error', setupResult.error || 'failed');
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
   * Scan the custom module cache directory and register any cached custom modules
   * that aren't already known from the manifest or external module list.
   * @param {Object} paths - InstallPaths instance
   */
  async _scanCachedCustomModules(paths) {
    const cacheDir = paths.customCacheDir;
    if (!(await fs.pathExists(cacheDir))) {
      return;
    }

    const cachedModules = await fs.readdir(cacheDir, { withFileTypes: true });

    for (const cachedModule of cachedModules) {
      const moduleId = cachedModule.name;
      const cachedPath = path.join(cacheDir, moduleId);

      // Skip if path doesn't exist (broken symlink, deleted dir) - avoids lstat ENOENT
      if (!(await fs.pathExists(cachedPath)) || !cachedModule.isDirectory()) {
        continue;
      }

      // Skip if we already have this module from manifest
      if (this.customModules.paths.has(moduleId)) {
        continue;
      }

      // Check if this is an external official module - skip cache for those
      const isExternal = await this.externalModuleManager.hasModule(moduleId);
      if (isExternal) {
        continue;
      }

      // Check if this is actually a custom module (has module.yaml)
      const moduleYamlPath = path.join(cachedPath, 'module.yaml');
      if (await fs.pathExists(moduleYamlPath)) {
        this.customModules.paths.set(moduleId, cachedPath);
      }
    }
  }

  /**
   * Common update preparation: detect files, preserve core config, scan cache, back up.
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

    await this._scanCachedCustomModules(paths);

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

    for (const moduleName of officialModuleIds) {
      if (installedModuleNames.has(moduleName)) continue;
      installedModuleNames.add(moduleName);

      message(`${isQuickUpdate ? 'Updating' : 'Installing'} ${moduleName}...`);

      const moduleConfig = officialModules.moduleConfigs[moduleName] || {};
      await officialModules.install(
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

      addResult(`Module: ${moduleName}`, 'ok', isQuickUpdate ? 'updated' : 'installed');
    }
  }

  /**
   * Install custom modules using CustomModules.install().
   * Source paths come from this.customModules.paths (populated by discoverPaths).
   */
  async _installCustomModules(config, paths, addResult, officialModules, ctx) {
    const { message, installedModuleNames } = ctx;
    const isQuickUpdate = config.isQuickUpdate();

    for (const [moduleName, sourcePath] of this.customModules.paths) {
      if (installedModuleNames.has(moduleName)) continue;
      installedModuleNames.add(moduleName);

      message(`${isQuickUpdate ? 'Updating' : 'Installing'} ${moduleName}...`);

      const collectedModuleConfig = officialModules.moduleConfigs[moduleName] || {};
      const result = await this.customModules.install(moduleName, paths.bmadDir, (filePath) => this.installedFiles.add(filePath), {
        moduleConfig: collectedModuleConfig,
      });

      // Generate runtime config.yaml with merged values
      await this.generateModuleConfigs(paths.bmadDir, {
        [moduleName]: { ...config.coreConfig, ...result.moduleConfig, ...collectedModuleConfig },
      });

      addResult(`Module: ${moduleName}`, 'ok', isQuickUpdate ? 'updated' : 'installed');
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
    const lines = [];
    for (const r of results) {
      let stepLabel = null;

      if (r.status !== 'ok') {
        stepLabel = r.step;
      } else if (r.step === 'Core') {
        stepLabel = 'BMAD';
      } else if (r.step.startsWith('Module: ')) {
        stepLabel = r.step;
      } else if (selectedIdes.has(String(r.step).toLowerCase())) {
        stepLabel = r.step;
      }

      if (!stepLabel) {
        continue;
      }

      let icon;
      if (r.status === 'ok') {
        icon = color.green('\u2713');
      } else if (r.status === 'warn') {
        icon = color.yellow('!');
      } else {
        icon = color.red('\u2717');
      }
      const detail = r.detail ? color.dim(` (${r.detail})`) : '';
      lines.push(`  ${icon}  ${stepLabel}${detail}`);
    }

    if ((context.ides || []).length === 0) {
      lines.push(`  ${color.green('\u2713')}  No IDE selected ${color.dim('(installed in _bmad only)')}`);
    }

    // Context and warnings
    lines.push('');
    if (context.bmadDir) {
      lines.push(`  Installed to: ${color.dim(context.bmadDir)}`);
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
      '  Next steps:',
      `    Read our new Docs Site: ${color.dim('https://docs.bmad-method.org/')}`,
      `    Join our Discord: ${color.dim('https://discord.gg/gk8jAdXWmj')}`,
      `    Star us on GitHub: ${color.dim('https://github.com/bmad-code-org/BMAD-METHOD/')}`,
      `    Subscribe on YouTube: ${color.dim('https://www.youtube.com/@BMadCode')}`,
    );
    if (context.ides && context.ides.length > 0) {
      lines.push(`    Invoke the ${color.cyan('bmad-help')} skill in your IDE Agent to get started`);
    }

    await prompts.note(lines.join('\n'), 'BMAD is ready to use!');
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

    const customModuleSources = await this.customModules.assembleQuickUpdateSources(
      config,
      existingInstall,
      bmadDir,
      this.externalModuleManager,
    );

    // Get available modules (what we have source for)
    const availableModulesData = await new OfficialModules().listAvailable();
    const availableModules = [...availableModulesData.modules, ...availableModulesData.customModules];

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

    // Add custom modules from manifest if their sources exist
    for (const [moduleId, customModule] of customModuleSources) {
      const sourcePath = customModule.sourcePath;
      if (sourcePath && (await fs.pathExists(sourcePath)) && !availableModules.some((m) => m.id === moduleId)) {
        availableModules.push({
          id: moduleId,
          name: customModule.name || moduleId,
          path: sourcePath,
          isCustom: true,
          fromManifest: true,
        });
      }
    }

    // Handle missing custom module sources
    const customModuleResult = await this.handleMissingCustomSources(
      customModuleSources,
      bmadDir,
      projectRoot,
      'update',
      installedModules,
      config.skipPrompts || false,
    );

    const { validCustomModules, keptModulesWithoutSources } = customModuleResult;

    const customModulesFromManifest = validCustomModules.map((m) => ({
      ...m,
      isCustom: true,
      hasUpdate: true,
    }));

    const allAvailableModules = [...availableModules, ...customModulesFromManifest];
    const availableModuleIds = new Set(allAvailableModules.map((m) => m.id));

    // Only update modules that are BOTH installed AND available (we have source for)
    const modulesToUpdate = installedModules.filter((id) => availableModuleIds.has(id));
    const skippedModules = installedModules.filter((id) => !availableModuleIds.has(id));

    // Add custom modules that were kept without sources to the skipped modules
    for (const keptModule of keptModulesWithoutSources) {
      if (!skippedModules.includes(keptModule)) {
        skippedModules.push(keptModule);
      }
    }

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
      _customModuleSources: customModuleSources,
      _existingModules: installedModules,
      customContent: config.customContent,
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
   * Handle missing custom module sources interactively
   * @param {Map} customModuleSources - Map of custom module ID to info
   * @param {string} bmadDir - BMAD directory
   * @param {string} projectRoot - Project root directory
   * @param {string} operation - Current operation ('update', 'compile', etc.)
   * @param {Array} installedModules - Array of installed module IDs (will be modified)
   * @param {boolean} [skipPrompts=false] - Skip interactive prompts and keep all modules with missing sources
   * @returns {Object} Object with validCustomModules array and keptModulesWithoutSources array
   */
  async handleMissingCustomSources(customModuleSources, bmadDir, projectRoot, operation, installedModules, skipPrompts = false) {
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

    // Non-interactive mode: keep all modules with missing sources
    if (skipPrompts) {
      for (const missing of customModulesWithMissingSources) {
        keptModulesWithoutSources.push(missing.id);
      }
      return { validCustomModules, keptModulesWithoutSources };
    }

    await prompts.log.warn(`Found ${customModulesWithMissingSources.length} custom module(s) with missing sources:`);

    let keptCount = 0;
    let updatedCount = 0;
    let removedCount = 0;

    for (const missing of customModulesWithMissingSources) {
      await prompts.log.message(
        `${missing.name} (${missing.id})\n  Original source: ${missing.relativePath}\n  Full path: ${missing.sourcePath}`,
      );

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

          // Defensive: handleCancel should have exited, but guard against symbol propagation
          if (typeof newSourcePath !== 'string') {
            keptCount++;
            keptModulesWithoutSources.push(missing.id);
            continue;
          }

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
          await prompts.log.success('Updated source location');

          break;
        }
        case 'remove': {
          // Extra confirmation for destructive remove
          await prompts.log.error(
            `WARNING: This will PERMANENTLY DELETE "${missing.name}" and all its files!\n  Module location: ${path.join(bmadDir, missing.id)}`,
          );

          const confirmDelete = await prompts.confirm({
            message: 'Are you absolutely sure you want to delete this module?',
            default: false,
          });

          if (confirmDelete) {
            const typedConfirm = await prompts.text({
              message: 'Type "DELETE" to confirm permanent deletion:',
              validate: (input) => {
                if (input !== 'DELETE') {
                  return 'You must type "DELETE" exactly to proceed';
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
                await prompts.log.warn(`Deleted module directory: ${path.relative(projectRoot, modulePath)}`);
              }

              await this.manifest.removeModule(bmadDir, missing.id);
              await this.manifest.removeCustomModule(bmadDir, missing.id);
              await prompts.log.warn('Removed from manifest');

              // Also remove from installedModules list
              if (installedModules && installedModules.includes(missing.id)) {
                const index = installedModules.indexOf(missing.id);
                if (index !== -1) {
                  installedModules.splice(index, 1);
                }
              }

              removedCount++;
              await prompts.log.error(`"${missing.name}" has been permanently removed`);
            } else {
              await prompts.log.message('Removal cancelled - module will be kept');
              keptCount++;
            }
          } else {
            await prompts.log.message('Removal cancelled - module will be kept');
            keptCount++;
          }

          break;
        }
        case 'keep': {
          keptCount++;
          keptModulesWithoutSources.push(missing.id);
          await prompts.log.message('Module will be kept as-is');

          break;
        }
        // No default
      }
    }

    // Show summary
    if (keptCount > 0 || updatedCount > 0 || removedCount > 0) {
      let summary = 'Summary for custom modules with missing sources:';
      if (keptCount > 0) summary += `\n  • ${keptCount} module(s) kept as-is`;
      if (updatedCount > 0) summary += `\n  • ${updatedCount} module(s) updated with new sources`;
      if (removedCount > 0) summary += `\n  • ${removedCount} module(s) permanently deleted`;
      await prompts.log.message(summary);
    }

    return {
      validCustomModules,
      keptModulesWithoutSources,
    };
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
