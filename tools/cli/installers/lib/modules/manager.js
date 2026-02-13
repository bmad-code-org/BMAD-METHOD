const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const prompts = require('../../../lib/prompts');
const { XmlHandler } = require('../../../lib/xml-handler');
const { getProjectRoot, getSourcePath, getModulePath } = require('../../../lib/project-root');
const { filterCustomizationData } = require('../../../lib/agent/compiler');
const { ExternalModuleManager } = require('./external-manager');
const { BMAD_FOLDER_NAME } = require('../ide/shared/path-utils');

/**
 * Manages the installation, updating, and removal of BMAD modules.
 * Handles module discovery, dependency resolution, configuration processing,
 * and agent file management including XML activation block injection.
 *
 * @class ModuleManager
 * @requires fs-extra
 * @requires yaml
 * @requires prompts
 * @requires XmlHandler
 *
 * @example
 * const manager = new ModuleManager();
 * const modules = await manager.listAvailable();
 * await manager.install('core-module', '/path/to/bmad');
 */
class ModuleManager {
  constructor(options = {}) {
    this.xmlHandler = new XmlHandler();
    this.bmadFolderName = BMAD_FOLDER_NAME; // Default, can be overridden
    this.customModulePaths = new Map(); // Initialize custom module paths
    this.externalModuleManager = new ExternalModuleManager(); // For external official modules
  }

  /**
   * Set the bmad folder name for placeholder replacement
   * @param {string} bmadFolderName - The bmad folder name
   */
  setBmadFolderName(bmadFolderName) {
    this.bmadFolderName = bmadFolderName;
  }

  /**
   * Set the core configuration for access during module installation
   * @param {Object} coreConfig - Core configuration object
   */
  setCoreConfig(coreConfig) {
    this.coreConfig = coreConfig;
  }

  /**
   * Set custom module paths for priority lookup
   * @param {Map<string, string>} customModulePaths - Map of module ID to source path
   */
  setCustomModulePaths(customModulePaths) {
    this.customModulePaths = customModulePaths;
  }

  /**
   * Copy a file to the target location
   * @param {string} sourcePath - Source file path
   * @param {string} targetPath - Target file path
   * @param {boolean} overwrite - Whether to overwrite existing files (default: true)
   */
  async copyFileWithPlaceholderReplacement(sourcePath, targetPath, overwrite = true) {
    await fs.copy(sourcePath, targetPath, { overwrite });
  }

  /**
   * Copy a directory recursively
   * @param {string} sourceDir - Source directory path
   * @param {string} targetDir - Target directory path
   * @param {boolean} overwrite - Whether to overwrite existing files (default: true)
   */
  async copyDirectoryWithPlaceholderReplacement(sourceDir, targetDir, overwrite = true) {
    await fs.ensureDir(targetDir);
    const entries = await fs.readdir(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);
      const targetPath = path.join(targetDir, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectoryWithPlaceholderReplacement(sourcePath, targetPath, overwrite);
      } else {
        await this.copyFileWithPlaceholderReplacement(sourcePath, targetPath, overwrite);
      }
    }
  }

  /**
   * Copy sidecar directory to _bmad/_memory location with update-safe handling
   * @param {string} sourceSidecarPath - Source sidecar directory path
   * @param {string} agentName - Name of the agent (for naming)
   * @param {string} bmadMemoryPath - This should ALWAYS be _bmad/_memory
   * @param {boolean} isUpdate - Whether this is an update (default: false)
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} installer - Installer instance for file tracking
   */
  async copySidecarToMemory(sourceSidecarPath, agentName, bmadMemoryPath, isUpdate = false, bmadDir = null, installer = null) {
    const crypto = require('node:crypto');
    const sidecarTargetDir = path.join(bmadMemoryPath, `${agentName}-sidecar`);

    // Ensure target directory exists
    await fs.ensureDir(bmadMemoryPath);
    await fs.ensureDir(sidecarTargetDir);

    // Get existing files manifest for update checking
    let existingFilesManifest = [];
    if (isUpdate && installer) {
      existingFilesManifest = await installer.readFilesManifest(bmadDir);
    }

    // Build map of existing sidecar files with their hashes
    const existingSidecarFiles = new Map();
    for (const fileEntry of existingFilesManifest) {
      if (fileEntry.path && fileEntry.path.includes(`${agentName}-sidecar/`)) {
        existingSidecarFiles.set(fileEntry.path, fileEntry.hash);
      }
    }

    // Get all files in source sidecar
    const sourceFiles = await this.getFileList(sourceSidecarPath);

    for (const file of sourceFiles) {
      const sourceFilePath = path.join(sourceSidecarPath, file);
      const targetFilePath = path.join(sidecarTargetDir, file);

      // Calculate current source file hash
      const sourceHash = crypto
        .createHash('sha256')
        .update(await fs.readFile(sourceFilePath))
        .digest('hex');

      // Path relative to bmad directory
      const relativeToBmad = path.join('_memory', `${agentName}-sidecar`, file);

      if (isUpdate && (await fs.pathExists(targetFilePath))) {
        // Calculate current target file hash
        const currentTargetHash = crypto
          .createHash('sha256')
          .update(await fs.readFile(targetFilePath))
          .digest('hex');

        // Get the last known hash from files-manifest
        const lastKnownHash = existingSidecarFiles.get(relativeToBmad);

        if (lastKnownHash) {
          // We have a record of this file
          if (currentTargetHash === lastKnownHash) {
            // File hasn't been modified by user, safe to update
            await this.copyFileWithPlaceholderReplacement(sourceFilePath, targetFilePath, true);
            if (process.env.BMAD_VERBOSE_INSTALL === 'true') {
              await prompts.log.message(`    Updated sidecar file: ${relativeToBmad}`);
            }
          } else {
            // User has modified the file, preserve it
            if (process.env.BMAD_VERBOSE_INSTALL === 'true') {
              await prompts.log.message(`    Preserving user-modified file: ${relativeToBmad}`);
            }
          }
        } else {
          // First time seeing this file in manifest, copy it
          await this.copyFileWithPlaceholderReplacement(sourceFilePath, targetFilePath, true);
          if (process.env.BMAD_VERBOSE_INSTALL === 'true') {
            await prompts.log.message(`    Added new sidecar file: ${relativeToBmad}`);
          }
        }
      } else {
        // New installation
        await this.copyFileWithPlaceholderReplacement(sourceFilePath, targetFilePath, true);
        if (process.env.BMAD_VERBOSE_INSTALL === 'true') {
          await prompts.log.message(`    Copied sidecar file: ${relativeToBmad}`);
        }
      }

      // Track the file in the installer's file tracking system
      if (installer && installer.installedFiles) {
        installer.installedFiles.add(targetFilePath);
      }
    }

    // Return list of files that were processed
    const processedFiles = sourceFiles.map((file) => path.join('_memory', `${agentName}-sidecar`, file));
    return processedFiles;
  }

  /**
   * List all available modules (excluding core which is always installed)
   * bmm is the only built-in module, directly under src/bmm
   * All other modules come from external-official-modules.yaml
   * @returns {Object} Object with modules array and customModules array
   */
  async listAvailable() {
    const modules = [];
    const customModules = [];

    // Add built-in bmm module (directly under src/bmm)
    const bmmPath = getSourcePath('bmm');
    if (await fs.pathExists(bmmPath)) {
      const bmmInfo = await this.getModuleInfo(bmmPath, 'bmm', 'src/bmm');
      if (bmmInfo) {
        modules.push(bmmInfo);
      }
    }

    // Check for cached custom modules in _config/custom/
    if (this.bmadDir) {
      const customCacheDir = path.join(this.bmadDir, '_config', 'custom');
      if (await fs.pathExists(customCacheDir)) {
        const cacheEntries = await fs.readdir(customCacheDir, { withFileTypes: true });
        for (const entry of cacheEntries) {
          if (entry.isDirectory()) {
            const cachePath = path.join(customCacheDir, entry.name);
            const moduleInfo = await this.getModuleInfo(cachePath, entry.name, '_config/custom');
            if (moduleInfo && !modules.some((m) => m.id === moduleInfo.id) && !customModules.some((m) => m.id === moduleInfo.id)) {
              moduleInfo.isCustom = true;
              moduleInfo.fromCache = true;
              customModules.push(moduleInfo);
            }
          }
        }
      }
    }

    return { modules, customModules };
  }

  /**
   * Get module information from a module path
   * @param {string} modulePath - Path to the module directory
   * @param {string} defaultName - Default name for the module
   * @param {string} sourceDescription - Description of where the module was found
   * @returns {Object|null} Module info or null if not a valid module
   */
  async getModuleInfo(modulePath, defaultName, sourceDescription) {
    // Check for module structure (module.yaml OR custom.yaml)
    const moduleConfigPath = path.join(modulePath, 'module.yaml');
    const rootCustomConfigPath = path.join(modulePath, 'custom.yaml');
    let configPath = null;

    if (await fs.pathExists(moduleConfigPath)) {
      configPath = moduleConfigPath;
    } else if (await fs.pathExists(rootCustomConfigPath)) {
      configPath = rootCustomConfigPath;
    }

    // Skip if this doesn't look like a module
    if (!configPath) {
      return null;
    }

    // Mark as custom if it's using custom.yaml OR if it's outside src/bmm or src/core
    const isCustomSource = sourceDescription !== 'src/bmm' && sourceDescription !== 'src/core' && sourceDescription !== 'src/modules';
    const moduleInfo = {
      id: defaultName,
      path: modulePath,
      name: defaultName
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      description: 'BMAD Module',
      version: '5.0.0',
      source: sourceDescription,
      isCustom: configPath === rootCustomConfigPath || isCustomSource,
    };

    // Read module config for metadata
    try {
      const configContent = await fs.readFile(configPath, 'utf8');
      const config = yaml.parse(configContent);

      // Use the code property as the id if available
      if (config.code) {
        moduleInfo.id = config.code;
      }

      moduleInfo.name = config.name || moduleInfo.name;
      moduleInfo.description = config.description || moduleInfo.description;
      moduleInfo.version = config.version || moduleInfo.version;
      moduleInfo.dependencies = config.dependencies || [];
      moduleInfo.defaultSelected = config.default_selected === undefined ? false : config.default_selected;
    } catch (error) {
      await prompts.log.warn(`Failed to read config for ${defaultName}: ${error.message}`);
    }

    return moduleInfo;
  }

  /**
   * Find the source path for a module by searching all possible locations
   * @param {string} moduleCode - Code of the module to find (from module.yaml)
   * @returns {string|null} Path to the module source or null if not found
   */
  async findModuleSource(moduleCode, options = {}) {
    const projectRoot = getProjectRoot();

    // First check custom module paths if they exist
    if (this.customModulePaths && this.customModulePaths.has(moduleCode)) {
      return this.customModulePaths.get(moduleCode);
    }

    // Check for built-in bmm module (directly under src/bmm)
    if (moduleCode === 'bmm') {
      const bmmPath = getSourcePath('bmm');
      if (await fs.pathExists(bmmPath)) {
        return bmmPath;
      }
    }

    // Check external official modules
    const externalSource = await this.findExternalModuleSource(moduleCode, options);
    if (externalSource) {
      return externalSource;
    }

    return null;
  }

  /**
   * Check if a module is an external official module
   * @param {string} moduleCode - Code of the module to check
   * @returns {boolean} True if the module is external
   */
  async isExternalModule(moduleCode) {
    return await this.externalModuleManager.hasModule(moduleCode);
  }

  /**
   * Get the cache directory for external modules
   * @returns {string} Path to the external modules cache directory
   */
  getExternalCacheDir() {
    const os = require('node:os');
    const cacheDir = path.join(os.homedir(), '.bmad', 'cache', 'external-modules');
    return cacheDir;
  }

  /**
   * Clone an external module repository to cache
   * @param {string} moduleCode - Code of the external module
   * @returns {string} Path to the cloned repository
   */
  async cloneExternalModule(moduleCode, options = {}) {
    const { execSync } = require('node:child_process');
    const moduleInfo = await this.externalModuleManager.getModuleByCode(moduleCode);

    if (!moduleInfo) {
      throw new Error(`External module '${moduleCode}' not found in external-official-modules.yaml`);
    }

    const cacheDir = this.getExternalCacheDir();
    const moduleCacheDir = path.join(cacheDir, moduleCode);
    const silent = options.silent || false;

    // Create cache directory if it doesn't exist
    await fs.ensureDir(cacheDir);

    // Helper to create a spinner or a no-op when silent
    const createSpinner = async () => {
      if (silent) {
        return {
          start() {},
          stop() {},
          error() {},
          message() {},
          cancel() {},
          clear() {},
          get isSpinning() {
            return false;
          },
          get isCancelled() {
            return false;
          },
        };
      }
      return await prompts.spinner();
    };

    // Track if we need to install dependencies
    let needsDependencyInstall = false;
    let wasNewClone = false;

    // Check if already cloned
    if (await fs.pathExists(moduleCacheDir)) {
      // Try to update if it's a git repo
      const fetchSpinner = await createSpinner();
      fetchSpinner.start(`Fetching ${moduleInfo.name}...`);
      try {
        const currentRef = execSync('git rev-parse HEAD', { cwd: moduleCacheDir, stdio: 'pipe' }).toString().trim();
        // Fetch and reset to remote - works better with shallow clones than pull
        execSync('git fetch origin --depth 1', {
          cwd: moduleCacheDir,
          stdio: ['ignore', 'pipe', 'pipe'],
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        });
        execSync('git reset --hard origin/HEAD', {
          cwd: moduleCacheDir,
          stdio: ['ignore', 'pipe', 'pipe'],
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        });
        const newRef = execSync('git rev-parse HEAD', { cwd: moduleCacheDir, stdio: 'pipe' }).toString().trim();

        fetchSpinner.stop(`Fetched ${moduleInfo.name}`);
        // Force dependency install if we got new code
        if (currentRef !== newRef) {
          needsDependencyInstall = true;
        }
      } catch {
        fetchSpinner.error(`Fetch failed, re-downloading ${moduleInfo.name}`);
        // If update fails, remove and re-clone
        await fs.remove(moduleCacheDir);
        wasNewClone = true;
      }
    } else {
      wasNewClone = true;
    }

    // Clone if not exists or was removed
    if (wasNewClone) {
      const fetchSpinner = await createSpinner();
      fetchSpinner.start(`Fetching ${moduleInfo.name}...`);
      try {
        execSync(`git clone --depth 1 "${moduleInfo.url}" "${moduleCacheDir}"`, {
          stdio: ['ignore', 'pipe', 'pipe'],
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        });
        fetchSpinner.stop(`Fetched ${moduleInfo.name}`);
      } catch (error) {
        fetchSpinner.error(`Failed to fetch ${moduleInfo.name}`);
        throw new Error(`Failed to clone external module '${moduleCode}': ${error.message}`);
      }
    }

    // Install dependencies if package.json exists
    const packageJsonPath = path.join(moduleCacheDir, 'package.json');
    const nodeModulesPath = path.join(moduleCacheDir, 'node_modules');
    if (await fs.pathExists(packageJsonPath)) {
      // Install if node_modules doesn't exist, or if package.json is newer (dependencies changed)
      const nodeModulesMissing = !(await fs.pathExists(nodeModulesPath));

      // Force install if we updated or cloned new
      if (needsDependencyInstall || wasNewClone || nodeModulesMissing) {
        const installSpinner = await createSpinner();
        installSpinner.start(`Installing dependencies for ${moduleInfo.name}...`);
        try {
          execSync('npm install --omit=dev --no-audit --no-fund --no-progress --legacy-peer-deps', {
            cwd: moduleCacheDir,
            stdio: ['ignore', 'pipe', 'pipe'],
            timeout: 120_000, // 2 minute timeout
          });
          installSpinner.stop(`Installed dependencies for ${moduleInfo.name}`);
        } catch (error) {
          installSpinner.error(`Failed to install dependencies for ${moduleInfo.name}`);
          if (!silent) await prompts.log.warn(`  ${error.message}`);
        }
      } else {
        // Check if package.json is newer than node_modules
        let packageJsonNewer = false;
        try {
          const packageStats = await fs.stat(packageJsonPath);
          const nodeModulesStats = await fs.stat(nodeModulesPath);
          packageJsonNewer = packageStats.mtime > nodeModulesStats.mtime;
        } catch {
          // If stat fails, assume we need to install
          packageJsonNewer = true;
        }

        if (packageJsonNewer) {
          const installSpinner = await createSpinner();
          installSpinner.start(`Installing dependencies for ${moduleInfo.name}...`);
          try {
            execSync('npm install --omit=dev --no-audit --no-fund --no-progress --legacy-peer-deps', {
              cwd: moduleCacheDir,
              stdio: ['ignore', 'pipe', 'pipe'],
              timeout: 120_000, // 2 minute timeout
            });
            installSpinner.stop(`Installed dependencies for ${moduleInfo.name}`);
          } catch (error) {
            installSpinner.error(`Failed to install dependencies for ${moduleInfo.name}`);
            if (!silent) await prompts.log.warn(`  ${error.message}`);
          }
        }
      }
    }

    return moduleCacheDir;
  }

  /**
   * Find the source path for an external module
   * @param {string} moduleCode - Code of the external module
   * @returns {string|null} Path to the module source or null if not found
   */
  async findExternalModuleSource(moduleCode, options = {}) {
    const moduleInfo = await this.externalModuleManager.getModuleByCode(moduleCode);

    if (!moduleInfo) {
      return null;
    }

    // Clone the external module repo
    const cloneDir = await this.cloneExternalModule(moduleCode, options);

    // The module-definition specifies the path to module.yaml relative to repo root
    // We need to return the directory containing module.yaml
    const moduleDefinitionPath = moduleInfo.moduleDefinition; // e.g., 'src/module.yaml'
    const moduleDir = path.dirname(path.join(cloneDir, moduleDefinitionPath));

    return moduleDir;
  }

  /**
   * Install a module
   * @param {string} moduleName - Code of the module to install (from module.yaml)
   * @param {string} bmadDir - Target bmad directory
   * @param {Function} fileTrackingCallback - Optional callback to track installed files
   * @param {Object} options - Additional installation options
   * @param {Array<string>} options.installedIDEs - Array of IDE codes that were installed
   * @param {Object} options.moduleConfig - Module configuration from config collector
   * @param {Object} options.logger - Logger instance for output
   */
  async install(moduleName, bmadDir, fileTrackingCallback = null, options = {}) {
    const sourcePath = await this.findModuleSource(moduleName, { silent: options.silent });
    const targetPath = path.join(bmadDir, moduleName);

    // Check if source module exists
    if (!sourcePath) {
      // Provide a more user-friendly error message
      throw new Error(
        `Source for module '${moduleName}' is not available. It will be retained but cannot be updated without its source files.`,
      );
    }

    // Check if this is a custom module and read its custom.yaml values
    let customConfig = null;
    const rootCustomConfigPath = path.join(sourcePath, 'custom.yaml');

    if (await fs.pathExists(rootCustomConfigPath)) {
      try {
        const customContent = await fs.readFile(rootCustomConfigPath, 'utf8');
        customConfig = yaml.parse(customContent);
      } catch (error) {
        await prompts.log.warn(`Failed to read custom.yaml for ${moduleName}: ${error.message}`);
      }
    }

    // If this is a custom module, merge its values into the module config
    if (customConfig) {
      options.moduleConfig = { ...options.moduleConfig, ...customConfig };
      if (options.logger) {
        await options.logger.log(`  Merged custom configuration for ${moduleName}`);
      }
    }

    // Check if already installed
    if (await fs.pathExists(targetPath)) {
      await fs.remove(targetPath);
    }

    // Vendor cross-module workflows BEFORE copying
    // This reads source agent.yaml files and copies referenced workflows
    await this.vendorCrossModuleWorkflows(sourcePath, targetPath, moduleName);

    // Copy module files with filtering
    await this.copyModuleWithFiltering(sourcePath, targetPath, fileTrackingCallback, options.moduleConfig);

    // Compile any .agent.yaml files to .md format
    await this.compileModuleAgents(sourcePath, targetPath, moduleName, bmadDir, options.installer);

    // Process agent files to inject activation block
    await this.processAgentFiles(targetPath, moduleName);

    // Create directories declared in module.yaml (unless explicitly skipped)
    if (!options.skipModuleInstaller) {
      await this.createModuleDirectories(moduleName, bmadDir, options);
    }

    // Capture version info for manifest
    const { Manifest } = require('../core/manifest');
    const manifestObj = new Manifest();
    const versionInfo = await manifestObj.getModuleVersionInfo(moduleName, bmadDir, sourcePath);

    await manifestObj.addModule(bmadDir, moduleName, {
      version: versionInfo.version,
      source: versionInfo.source,
      npmPackage: versionInfo.npmPackage,
      repoUrl: versionInfo.repoUrl,
    });

    return {
      success: true,
      module: moduleName,
      path: targetPath,
      versionInfo,
    };
  }

  /**
   * Update an existing module
   * @param {string} moduleName - Name of the module to update
   * @param {string} bmadDir - Target bmad directory
   * @param {boolean} force - Force update (overwrite modifications)
   */
  async update(moduleName, bmadDir, force = false, options = {}) {
    const sourcePath = await this.findModuleSource(moduleName);
    const targetPath = path.join(bmadDir, moduleName);

    // Check if source module exists
    if (!sourcePath) {
      throw new Error(`Module '${moduleName}' not found in any source location`);
    }

    // Check if module is installed
    if (!(await fs.pathExists(targetPath))) {
      throw new Error(`Module '${moduleName}' is not installed`);
    }

    if (force) {
      // Force update - remove and reinstall
      await fs.remove(targetPath);
      return await this.install(moduleName, bmadDir, null, { installer: options.installer });
    } else {
      // Selective update - preserve user modifications
      await this.syncModule(sourcePath, targetPath);

      // Recompile agents (#1133)
      await this.compileModuleAgents(sourcePath, targetPath, moduleName, bmadDir, options.installer);
      await this.processAgentFiles(targetPath, moduleName);
    }

    return {
      success: true,
      module: moduleName,
      path: targetPath,
    };
  }

  /**
   * Remove a module
   * @param {string} moduleName - Name of the module to remove
   * @param {string} bmadDir - Target bmad directory
   */
  async remove(moduleName, bmadDir) {
    const targetPath = path.join(bmadDir, moduleName);

    if (!(await fs.pathExists(targetPath))) {
      throw new Error(`Module '${moduleName}' is not installed`);
    }

    await fs.remove(targetPath);

    return {
      success: true,
      module: moduleName,
    };
  }

  /**
   * Check if a module is installed
   * @param {string} moduleName - Name of the module
   * @param {string} bmadDir - Target bmad directory
   * @returns {boolean} True if module is installed
   */
  async isInstalled(moduleName, bmadDir) {
    const targetPath = path.join(bmadDir, moduleName);
    return await fs.pathExists(targetPath);
  }

  /**
   * Get installed module info
   * @param {string} moduleName - Name of the module
   * @param {string} bmadDir - Target bmad directory
   * @returns {Object|null} Module info or null if not installed
   */
  async getInstalledInfo(moduleName, bmadDir) {
    const targetPath = path.join(bmadDir, moduleName);

    if (!(await fs.pathExists(targetPath))) {
      return null;
    }

    const configPath = path.join(targetPath, 'config.yaml');
    const moduleInfo = {
      id: moduleName,
      path: targetPath,
      installed: true,
    };

    if (await fs.pathExists(configPath)) {
      try {
        const configContent = await fs.readFile(configPath, 'utf8');
        const config = yaml.parse(configContent);
        Object.assign(moduleInfo, config);
      } catch (error) {
        await prompts.log.warn(`Failed to read installed module config: ${error.message}`);
      }
    }

    return moduleInfo;
  }

  /**
   * Copy module with filtering for localskip agents and conditional content
   * @param {string} sourcePath - Source module path
   * @param {string} targetPath - Target module path
   * @param {Function} fileTrackingCallback - Optional callback to track installed files
   * @param {Object} moduleConfig - Module configuration with conditional flags
   */
  async copyModuleWithFiltering(sourcePath, targetPath, fileTrackingCallback = null, moduleConfig = {}) {
    // Get all files in source
    const sourceFiles = await this.getFileList(sourcePath);

    for (const file of sourceFiles) {
      // Skip sub-modules directory - these are IDE-specific and handled separately
      if (file.startsWith('sub-modules/')) {
        continue;
      }

      // Only skip sidecar directories - they are handled separately during agent compilation
      // But still allow other files in agent directories
      const isInAgentDirectory = file.startsWith('agents/');
      const isInSidecarDirectory = path
        .dirname(file)
        .split('/')
        .some((dir) => dir.toLowerCase().endsWith('-sidecar'));

      if (isInSidecarDirectory) {
        continue;
      }

      // Skip module.yaml at root - it's only needed at install time
      if (file === 'module.yaml') {
        continue;
      }

      // Skip config.yaml templates - we'll generate clean ones with actual values
      if (file === 'config.yaml' || file.endsWith('/config.yaml')) {
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
          await prompts.log.message(`  Skipping web-only agent: ${path.basename(file)}`);
          continue; // Skip this agent
        }
      }

      // Check if this is a workflow.yaml file
      if (file.endsWith('workflow.yaml')) {
        await fs.ensureDir(path.dirname(targetFile));
        await this.copyWorkflowYamlStripped(sourceFile, targetFile);
      } else {
        // Copy the file with placeholder replacement
        await this.copyFileWithPlaceholderReplacement(sourceFile, targetFile);
      }

      // Track the file if callback provided
      if (fileTrackingCallback) {
        fileTrackingCallback(targetFile);
      }
    }
  }

  /**
   * Copy workflow.yaml file with web_bundle section stripped
   * Preserves comments, formatting, and line breaks
   * @param {string} sourceFile - Source workflow.yaml file path
   * @param {string} targetFile - Target workflow.yaml file path
   */
  async copyWorkflowYamlStripped(sourceFile, targetFile) {
    // Read the source YAML file
    let yamlContent = await fs.readFile(sourceFile, 'utf8');

    // IMPORTANT: Replace escape sequence and placeholder BEFORE parsing YAML
    // Otherwise parsing will fail on the placeholder
    yamlContent = yamlContent.replaceAll('_bmad', this.bmadFolderName);

    try {
      // First check if web_bundle exists by parsing
      const workflowConfig = yaml.parse(yamlContent);

      if (workflowConfig.web_bundle === undefined) {
        // No web_bundle section, just write (placeholders already replaced above)
        await fs.writeFile(targetFile, yamlContent, 'utf8');
        return;
      }

      // Find the line that starts web_bundle
      const lines = yamlContent.split('\n');
      let startIdx = -1;
      let endIdx = -1;
      let baseIndent = 0;

      // Find the start of web_bundle section
      for (const [i, line] of lines.entries()) {
        const match = line.match(/^(\s*)web_bundle:/);
        if (match) {
          startIdx = i;
          baseIndent = match[1].length;
          break;
        }
      }

      if (startIdx === -1) {
        // web_bundle not found in text (shouldn't happen), copy as-is
        await fs.writeFile(targetFile, yamlContent, 'utf8');
        return;
      }

      // Find the end of web_bundle section
      // It ends when we find a line with same or less indentation that's not empty/comment
      endIdx = startIdx;
      for (let i = startIdx + 1; i < lines.length; i++) {
        const line = lines[i];

        // Skip empty lines and comments
        if (line.trim() === '' || line.trim().startsWith('#')) {
          continue;
        }

        // Check indentation
        const indent = line.match(/^(\s*)/)[1].length;
        if (indent <= baseIndent) {
          // Found next section at same or lower indentation
          endIdx = i - 1;
          break;
        }
      }

      // If we didn't find an end, it goes to end of file
      if (endIdx === startIdx) {
        endIdx = lines.length - 1;
      }

      // Remove the web_bundle section (including the line before if it's just a blank line)
      const newLines = [...lines.slice(0, startIdx), ...lines.slice(endIdx + 1)];

      // Clean up any double blank lines that might result
      const strippedYaml = newLines.join('\n').replaceAll(/\n\n\n+/g, '\n\n');

      // Placeholders already replaced at the beginning of this function
      await fs.writeFile(targetFile, strippedYaml, 'utf8');
    } catch {
      // If anything fails, just copy the file as-is
      await prompts.log.warn(`  Could not process ${path.basename(sourceFile)}, copying as-is`);
      await fs.copy(sourceFile, targetFile, { overwrite: true });
    }
  }

  /**
   * Compile .agent.yaml files to .md format in modules
   * @param {string} sourcePath - Source module path
   * @param {string} targetPath - Target module path
   * @param {string} moduleName - Module name
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} installer - Installer instance for file tracking
   */
  async compileModuleAgents(sourcePath, targetPath, moduleName, bmadDir, installer = null) {
    const sourceAgentsPath = path.join(sourcePath, 'agents');
    const targetAgentsPath = path.join(targetPath, 'agents');
    const cfgAgentsDir = path.join(bmadDir, '_config', 'agents');

    // Check if agents directory exists in source
    if (!(await fs.pathExists(sourceAgentsPath))) {
      return; // No agents to compile
    }

    // Get all agent YAML files recursively
    const agentFiles = await this.findAgentFiles(sourceAgentsPath);

    for (const agentFile of agentFiles) {
      if (!agentFile.endsWith('.agent.yaml')) continue;

      const relativePath = path.relative(sourceAgentsPath, agentFile).split(path.sep).join('/');
      const targetDir = path.join(targetAgentsPath, path.dirname(relativePath));

      await fs.ensureDir(targetDir);

      const agentName = path.basename(agentFile, '.agent.yaml');
      const sourceYamlPath = agentFile;
      const targetMdPath = path.join(targetDir, `${agentName}.md`);
      const customizePath = path.join(cfgAgentsDir, `${moduleName}-${agentName}.customize.yaml`);

      // Read and compile the YAML
      try {
        const yamlContent = await fs.readFile(sourceYamlPath, 'utf8');
        const { compileAgent } = require('../../../lib/agent/compiler');

        // Create customize template if it doesn't exist
        if (!(await fs.pathExists(customizePath))) {
          const { getSourcePath } = require('../../../lib/project-root');
          const genericTemplatePath = getSourcePath('utility', 'agent-components', 'agent.customize.template.yaml');
          if (await fs.pathExists(genericTemplatePath)) {
            await this.copyFileWithPlaceholderReplacement(genericTemplatePath, customizePath);
            // Only show customize creation in verbose mode
            if (process.env.BMAD_VERBOSE_INSTALL === 'true') {
              await prompts.log.message(`  Created customize: ${moduleName}-${agentName}.customize.yaml`);
            }

            // Store original hash for modification detection
            const crypto = require('node:crypto');
            const customizeContent = await fs.readFile(customizePath, 'utf8');
            const originalHash = crypto.createHash('sha256').update(customizeContent).digest('hex');

            // Store in main manifest
            const manifestPath = path.join(bmadDir, '_config', 'manifest.yaml');
            let manifestData = {};
            if (await fs.pathExists(manifestPath)) {
              const manifestContent = await fs.readFile(manifestPath, 'utf8');
              const yaml = require('yaml');
              manifestData = yaml.parse(manifestContent);
            }
            if (!manifestData.agentCustomizations) {
              manifestData.agentCustomizations = {};
            }
            manifestData.agentCustomizations[path.relative(bmadDir, customizePath)] = originalHash;

            // Write back to manifest
            const yaml = require('yaml');
            // Clean the manifest data to remove any non-serializable values
            const cleanManifestData = structuredClone(manifestData);

            const updatedContent = yaml.stringify(cleanManifestData, {
              indent: 2,
              lineWidth: 0,
            });
            await fs.writeFile(manifestPath, updatedContent, 'utf8');
          }
        }

        // Check for customizations and build answers object
        let customizedFields = [];
        let answers = {};
        if (await fs.pathExists(customizePath)) {
          const customizeContent = await fs.readFile(customizePath, 'utf8');
          const customizeData = yaml.parse(customizeContent);
          customizedFields = customizeData.customized_fields || [];

          // Build answers object from customizations
          if (customizeData.persona) {
            answers.persona = customizeData.persona;
          }
          if (customizeData.agent?.metadata) {
            const filteredMetadata = filterCustomizationData(customizeData.agent.metadata);
            if (Object.keys(filteredMetadata).length > 0) {
              Object.assign(answers, { metadata: filteredMetadata });
            }
          }
          if (customizeData.critical_actions && customizeData.critical_actions.length > 0) {
            answers.critical_actions = customizeData.critical_actions;
          }
          if (customizeData.memories && customizeData.memories.length > 0) {
            answers.memories = customizeData.memories;
          }
          if (customizeData.menu && customizeData.menu.length > 0) {
            answers.menu = customizeData.menu;
          }
          if (customizeData.prompts && customizeData.prompts.length > 0) {
            answers.prompts = customizeData.prompts;
          }
        }

        // Check if agent has sidecar
        let hasSidecar = false;
        try {
          const agentYaml = yaml.parse(yamlContent);
          hasSidecar = agentYaml?.agent?.metadata?.hasSidecar === true;
        } catch {
          // Continue without sidecar processing
        }

        // Compile with customizations if any
        const { xml } = await compileAgent(yamlContent, answers, agentName, relativePath, { config: this.coreConfig || {} });

        // Write the compiled agent
        await fs.writeFile(targetMdPath, xml, 'utf8');

        // Handle sidecar copying if present
        if (hasSidecar) {
          // Get the agent's directory to look for sidecar
          const agentDir = path.dirname(agentFile);
          const sidecarDirName = `${agentName}-sidecar`;
          const sourceSidecarPath = path.join(agentDir, sidecarDirName);

          // Check if sidecar directory exists
          if (await fs.pathExists(sourceSidecarPath)) {
            // Memory is always in _bmad/_memory
            const bmadMemoryPath = path.join(bmadDir, '_memory');

            // Determine if this is an update (by checking if agent already exists)
            const isUpdate = await fs.pathExists(targetMdPath);

            // Copy sidecar to memory location with update-safe handling
            const copiedFiles = await this.copySidecarToMemory(sourceSidecarPath, agentName, bmadMemoryPath, isUpdate, bmadDir, installer);

            if (process.env.BMAD_VERBOSE_INSTALL === 'true' && copiedFiles.length > 0) {
              await prompts.log.message(`    Sidecar files processed: ${copiedFiles.length} files`);
            }
          } else if (process.env.BMAD_VERBOSE_INSTALL === 'true') {
            await prompts.log.warn(`    Agent marked as having sidecar but ${sidecarDirName} directory not found`);
          }
        }

        // Copy any non-sidecar files from agent directory (e.g., foo.md)
        const agentDir = path.dirname(agentFile);
        const agentEntries = await fs.readdir(agentDir, { withFileTypes: true });

        for (const entry of agentEntries) {
          if (entry.isFile() && !entry.name.endsWith('.agent.yaml') && !entry.name.endsWith('.md')) {
            // Copy additional files (like foo.md) to the agent target directory
            const sourceFile = path.join(agentDir, entry.name);
            const targetFile = path.join(targetDir, entry.name);
            await this.copyFileWithPlaceholderReplacement(sourceFile, targetFile);
          }
        }

        // Only show compilation details in verbose mode
        if (process.env.BMAD_VERBOSE_INSTALL === 'true') {
          await prompts.log.message(
            `    Compiled agent: ${agentName} -> ${path.relative(targetPath, targetMdPath)}${hasSidecar ? ' (with sidecar)' : ''}`,
          );
        }
      } catch (error) {
        await prompts.log.warn(`    Failed to compile agent ${agentName}: ${error.message}`);
      }
    }
  }

  /**
   * Find all .agent.yaml files recursively in a directory
   * @param {string} dir - Directory to search
   * @returns {Array} List of .agent.yaml file paths
   */
  async findAgentFiles(dir) {
    const agentFiles = [];

    async function searchDirectory(searchDir) {
      const entries = await fs.readdir(searchDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(searchDir, entry.name);

        if (entry.isFile() && entry.name.endsWith('.agent.yaml')) {
          agentFiles.push(fullPath);
        } else if (entry.isDirectory()) {
          await searchDirectory(fullPath);
        }
      }
    }

    await searchDirectory(dir);
    return agentFiles;
  }

  /**
   * Process agent files to inject activation block
   * @param {string} modulePath - Path to installed module
   * @param {string} moduleName - Module name
   */
  async processAgentFiles(modulePath, moduleName) {
    // const agentsPath = path.join(modulePath, 'agents');
    // // Check if agents directory exists
    // if (!(await fs.pathExists(agentsPath))) {
    //   return; // No agents to process
    // }
    // // Get all agent MD files recursively
    // const agentFiles = await this.findAgentMdFiles(agentsPath);
    // for (const agentFile of agentFiles) {
    //   if (!agentFile.endsWith('.md')) continue;
    //   let content = await fs.readFile(agentFile, 'utf8');
    //   // Check if content has agent XML and no activation block
    //   if (content.includes('<agent') && !content.includes('<activation')) {
    //     // Inject the activation block using XML handler
    //     content = this.xmlHandler.injectActivationSimple(content);
    //     await fs.writeFile(agentFile, content, 'utf8');
    //   }
    // }
  }

  /**
   * Find all .md agent files recursively in a directory
   * @param {string} dir - Directory to search
   * @returns {Array} List of .md agent file paths
   */
  async findAgentMdFiles(dir) {
    const agentFiles = [];

    async function searchDirectory(searchDir) {
      const entries = await fs.readdir(searchDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(searchDir, entry.name);

        if (entry.isFile() && entry.name.endsWith('.md')) {
          agentFiles.push(fullPath);
        } else if (entry.isDirectory()) {
          await searchDirectory(fullPath);
        }
      }
    }

    await searchDirectory(dir);
    return agentFiles;
  }

  /**
   * Vendor cross-module workflows referenced in agent files
   * Scans SOURCE agent.yaml files for workflow-install and copies workflows to destination
   * @param {string} sourcePath - Source module path
   * @param {string} targetPath - Target module path (destination)
   * @param {string} moduleName - Module name being installed
   */
  async vendorCrossModuleWorkflows(sourcePath, targetPath, moduleName) {
    const sourceAgentsPath = path.join(sourcePath, 'agents');

    // Check if source agents directory exists
    if (!(await fs.pathExists(sourceAgentsPath))) {
      return; // No agents to process
    }

    // Get all agent YAML files from source
    const agentFiles = await fs.readdir(sourceAgentsPath);
    const yamlFiles = agentFiles.filter((f) => f.endsWith('.agent.yaml') || f.endsWith('.yaml'));

    if (yamlFiles.length === 0) {
      return; // No YAML agent files
    }

    let workflowsVendored = false;

    for (const agentFile of yamlFiles) {
      const agentPath = path.join(sourceAgentsPath, agentFile);
      const agentYaml = yaml.parse(await fs.readFile(agentPath, 'utf8'));

      // Check if agent has menu items with workflow-install
      const menuItems = agentYaml?.agent?.menu || [];
      const workflowInstallItems = menuItems.filter((item) => item['workflow-install']);

      if (workflowInstallItems.length === 0) {
        continue; // No workflow-install in this agent
      }

      if (!workflowsVendored) {
        await prompts.log.info(`\n  Vendoring cross-module workflows for ${moduleName}...`);
        workflowsVendored = true;
      }

      await prompts.log.message(`    Processing: ${agentFile}`);

      for (const item of workflowInstallItems) {
        const sourceWorkflowPath = item.workflow; // Where to copy FROM
        const installWorkflowPath = item['workflow-install']; // Where to copy TO

        // Parse SOURCE workflow path
        // Handle both _bmad placeholder and hardcoded 'bmad'
        // Example: {project-root}/_bmad/bmm/workflows/4-implementation/create-story/workflow.yaml
        // Or: {project-root}/bmad/bmm/workflows/4-implementation/create-story/workflow.yaml
        const sourceMatch = sourceWorkflowPath.match(/\{project-root\}\/(?:_bmad)\/([^/]+)\/workflows\/(.+)/);
        if (!sourceMatch) {
          await prompts.log.warn(`      Could not parse workflow path: ${sourceWorkflowPath}`);
          continue;
        }

        const [, sourceModule, sourceWorkflowSubPath] = sourceMatch;

        // Parse INSTALL workflow path
        // Handle_bmad
        // Example: {project-root}/_bmad/bmgd/workflows/4-production/create-story/workflow.yaml
        const installMatch = installWorkflowPath.match(/\{project-root\}\/(_bmad)\/([^/]+)\/workflows\/(.+)/);
        if (!installMatch) {
          await prompts.log.warn(`      Could not parse workflow-install path: ${installWorkflowPath}`);
          continue;
        }

        const installWorkflowSubPath = installMatch[2];

        const sourceModulePath = getModulePath(sourceModule);
        const actualSourceWorkflowPath = path.join(sourceModulePath, 'workflows', sourceWorkflowSubPath.replace(/\/workflow\.yaml$/, ''));

        const actualDestWorkflowPath = path.join(targetPath, 'workflows', installWorkflowSubPath.replace(/\/workflow\.yaml$/, ''));

        // Check if source workflow exists
        if (!(await fs.pathExists(actualSourceWorkflowPath))) {
          await prompts.log.warn(`      Source workflow not found: ${actualSourceWorkflowPath}`);
          continue;
        }

        // Copy the entire workflow folder
        await prompts.log.message(
          `      Vendoring: ${sourceModule}/workflows/${sourceWorkflowSubPath.replace(/\/workflow\.yaml$/, '')} → ${moduleName}/workflows/${installWorkflowSubPath.replace(/\/workflow\.yaml$/, '')}`,
        );

        await fs.ensureDir(path.dirname(actualDestWorkflowPath));
        // Copy the workflow directory recursively with placeholder replacement
        await this.copyDirectoryWithPlaceholderReplacement(actualSourceWorkflowPath, actualDestWorkflowPath);

        // Update the workflow.yaml config_source reference
        const workflowYamlPath = path.join(actualDestWorkflowPath, 'workflow.yaml');
        if (await fs.pathExists(workflowYamlPath)) {
          await this.updateWorkflowConfigSource(workflowYamlPath, moduleName);
        }
      }
    }

    if (workflowsVendored) {
      await prompts.log.success(`  Workflow vendoring complete\n`);
    }
  }

  /**
   * Update workflow.yaml config_source to point to new module
   * @param {string} workflowYamlPath - Path to workflow.yaml file
   * @param {string} newModuleName - New module name to reference
   */
  async updateWorkflowConfigSource(workflowYamlPath, newModuleName) {
    let yamlContent = await fs.readFile(workflowYamlPath, 'utf8');

    // Replace config_source: "{project-root}/_bmad/OLD_MODULE/config.yaml"
    // with config_source: "{project-root}/_bmad/NEW_MODULE/config.yaml"
    // Note: At this point _bmad has already been replaced with actual folder name
    const configSourcePattern = /config_source:\s*["']?\{project-root\}\/[^/]+\/[^/]+\/config\.yaml["']?/g;
    const newConfigSource = `config_source: "{project-root}/${this.bmadFolderName}/${newModuleName}/config.yaml"`;

    const updatedYaml = yamlContent.replaceAll(configSourcePattern, newConfigSource);

    if (updatedYaml !== yamlContent) {
      await fs.writeFile(workflowYamlPath, updatedYaml, 'utf8');
      await prompts.log.message(`      Updated config_source to: ${this.bmadFolderName}/${newModuleName}/config.yaml`);
    }
  }

  /**
   * Create directories declared in module.yaml's `directories` key
   * This replaces the security-risky module installer pattern with declarative config
   * During updates, if a directory path changed, moves the old directory to the new path
   * @param {string} moduleName - Name of the module
   * @param {string} bmadDir - Target bmad directory
   * @param {Object} options - Installation options
   * @param {Object} options.moduleConfig - Module configuration from config collector
   * @param {Object} options.existingModuleConfig - Previous module config (for detecting path changes during updates)
   * @param {Object} options.coreConfig - Core configuration
   * @returns {Promise<{createdDirs: string[], movedDirs: string[], createdWdsFolders: string[]}>} Created directories info
   */
  async createModuleDirectories(moduleName, bmadDir, options = {}) {
    const moduleConfig = options.moduleConfig || {};
    const existingModuleConfig = options.existingModuleConfig || {};
    const projectRoot = path.dirname(bmadDir);
    const emptyResult = { createdDirs: [], movedDirs: [], createdWdsFolders: [] };

    // Special handling for core module - it's in src/core not src/modules
    let sourcePath;
    if (moduleName === 'core') {
      sourcePath = getSourcePath('core');
    } else {
      sourcePath = await this.findModuleSource(moduleName, { silent: true });
      if (!sourcePath) {
        return emptyResult; // No source found, skip
      }
    }

    // Read module.yaml to find the `directories` key
    const moduleYamlPath = path.join(sourcePath, 'module.yaml');
    if (!(await fs.pathExists(moduleYamlPath))) {
      return emptyResult; // No module.yaml, skip
    }

    let moduleYaml;
    try {
      const yamlContent = await fs.readFile(moduleYamlPath, 'utf8');
      moduleYaml = yaml.parse(yamlContent);
    } catch {
      return emptyResult; // Invalid YAML, skip
    }

    if (!moduleYaml || !moduleYaml.directories) {
      return emptyResult; // No directories declared, skip
    }

    const directories = moduleYaml.directories;
    const wdsFolders = moduleYaml.wds_folders || [];
    const createdDirs = [];
    const movedDirs = [];
    const createdWdsFolders = [];

    for (const dirRef of directories) {
      // Parse variable reference like "{design_artifacts}"
      const varMatch = dirRef.match(/^\{([^}]+)\}$/);
      if (!varMatch) {
        // Not a variable reference, skip
        continue;
      }

      const configKey = varMatch[1];
      const dirValue = moduleConfig[configKey];
      if (!dirValue || typeof dirValue !== 'string') {
        continue; // No value or not a string, skip
      }

      // Strip {project-root}/ prefix if present
      let dirPath = dirValue.replace(/^\{project-root\}\/?/, '');

      // Handle remaining {project-root} anywhere in the path
      dirPath = dirPath.replaceAll('{project-root}', '');

      // Resolve to absolute path
      const fullPath = path.join(projectRoot, dirPath);

      // Validate path is within project root (prevent directory traversal)
      const normalizedPath = path.normalize(fullPath);
      const normalizedRoot = path.normalize(projectRoot);
      if (!normalizedPath.startsWith(normalizedRoot + path.sep) && normalizedPath !== normalizedRoot) {
        const color = await prompts.getColor();
        await prompts.log.warn(color.yellow(`${configKey} path escapes project root, skipping: ${dirPath}`));
        continue;
      }

      // Check if directory path changed from previous config (update/modify scenario)
      const oldDirValue = existingModuleConfig[configKey];
      let oldFullPath = null;
      let oldDirPath = null;
      if (oldDirValue && typeof oldDirValue === 'string') {
        // F3: Normalize both values before comparing to avoid false negatives
        // from trailing slashes, separator differences, or prefix format variations
        let normalizedOld = oldDirValue.replace(/^\{project-root\}\/?/, '');
        normalizedOld = path.normalize(normalizedOld.replaceAll('{project-root}', ''));
        const normalizedNew = path.normalize(dirPath);

        if (normalizedOld !== normalizedNew) {
          oldDirPath = normalizedOld;
          oldFullPath = path.join(projectRoot, oldDirPath);
          const normalizedOldAbsolute = path.normalize(oldFullPath);
          if (!normalizedOldAbsolute.startsWith(normalizedRoot + path.sep) && normalizedOldAbsolute !== normalizedRoot) {
            oldFullPath = null; // Old path escapes project root, ignore it
          }

          // F13: Prevent parent/child move (e.g. docs/planning → docs/planning/v2)
          if (oldFullPath) {
            const normalizedNewAbsolute = path.normalize(fullPath);
            if (
              normalizedOldAbsolute.startsWith(normalizedNewAbsolute + path.sep) ||
              normalizedNewAbsolute.startsWith(normalizedOldAbsolute + path.sep)
            ) {
              const color = await prompts.getColor();
              await prompts.log.warn(
                color.yellow(
                  `${configKey}: cannot move between parent/child paths (${oldDirPath} / ${dirPath}), creating new directory instead`,
                ),
              );
              oldFullPath = null;
            }
          }
        }
      }

      const dirName = configKey.replaceAll('_', ' ');

      if (oldFullPath && (await fs.pathExists(oldFullPath)) && !(await fs.pathExists(fullPath))) {
        // Path changed and old dir exists → move old to new location
        // F1: Use fs.move() instead of fs.rename() for cross-device/volume support
        // F2: Wrap in try/catch — fallback to creating new dir on failure
        try {
          await fs.ensureDir(path.dirname(fullPath));
          await fs.move(oldFullPath, fullPath);
          movedDirs.push(`${dirName}: ${oldDirPath} → ${dirPath}`);
        } catch (moveError) {
          const color = await prompts.getColor();
          await prompts.log.warn(
            color.yellow(
              `Failed to move ${oldDirPath} → ${dirPath}: ${moveError.message}\n  Creating new directory instead. Please move contents from the old directory manually.`,
            ),
          );
          await fs.ensureDir(fullPath);
          createdDirs.push(`${dirName}: ${dirPath}`);
        }
      } else if (oldFullPath && (await fs.pathExists(oldFullPath)) && (await fs.pathExists(fullPath))) {
        // F5: Both old and new directories exist — warn user about potential orphaned documents
        const color = await prompts.getColor();
        await prompts.log.warn(
          color.yellow(
            `${dirName}: path changed but both directories exist:\n  Old: ${oldDirPath}\n  New: ${dirPath}\n  Old directory may contain orphaned documents — please review and merge manually.`,
          ),
        );
      } else if (!(await fs.pathExists(fullPath))) {
        // New directory doesn't exist yet → create it
        createdDirs.push(`${dirName}: ${dirPath}`);
        await fs.ensureDir(fullPath);
      }

      // Create WDS subfolders if this is the design_artifacts directory
      if (configKey === 'design_artifacts' && wdsFolders.length > 0) {
        for (const subfolder of wdsFolders) {
          const subPath = path.join(fullPath, subfolder);
          if (!(await fs.pathExists(subPath))) {
            await fs.ensureDir(subPath);
            createdWdsFolders.push(subfolder);
          }
        }
      }
    }

    return { createdDirs, movedDirs, createdWdsFolders };
  }

  /**
   * Private: Process module configuration
   * @param {string} modulePath - Path to installed module
   * @param {string} moduleName - Module name
   */
  async processModuleConfig(modulePath, moduleName) {
    const configPath = path.join(modulePath, 'config.yaml');

    if (await fs.pathExists(configPath)) {
      try {
        let configContent = await fs.readFile(configPath, 'utf8');

        // Replace path placeholders
        configContent = configContent.replaceAll('{project-root}', `bmad/${moduleName}`);
        configContent = configContent.replaceAll('{module}', moduleName);

        await fs.writeFile(configPath, configContent, 'utf8');
      } catch (error) {
        await prompts.log.warn(`Failed to process module config: ${error.message}`);
      }
    }
  }

  /**
   * Private: Sync module files (preserving user modifications)
   * @param {string} sourcePath - Source module path
   * @param {string} targetPath - Target module path
   */
  async syncModule(sourcePath, targetPath) {
    // Get list of all source files
    const sourceFiles = await this.getFileList(sourcePath);

    for (const file of sourceFiles) {
      const sourceFile = path.join(sourcePath, file);
      const targetFile = path.join(targetPath, file);

      // Check if target file exists and has been modified
      if (await fs.pathExists(targetFile)) {
        const sourceStats = await fs.stat(sourceFile);
        const targetStats = await fs.stat(targetFile);

        // Skip if target is newer (user modified)
        if (targetStats.mtime > sourceStats.mtime) {
          continue;
        }
      }

      // Copy file with placeholder replacement
      await this.copyFileWithPlaceholderReplacement(sourceFile, targetFile);
    }
  }

  /**
   * Private: Get list of all files in a directory
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
        const subFiles = await this.getFileList(fullPath, baseDir);
        files.push(...subFiles);
      } else {
        files.push(path.relative(baseDir, fullPath));
      }
    }

    return files;
  }
}

module.exports = { ModuleManager };
