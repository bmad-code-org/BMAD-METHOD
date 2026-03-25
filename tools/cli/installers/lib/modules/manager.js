const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const prompts = require('../../../lib/prompts');
const { getProjectRoot, getSourcePath, getModulePath } = require('../../../lib/project-root');
const { ExternalModuleManager } = require('./external-manager');
const { BMAD_FOLDER_NAME } = require('../ide/shared/path-utils');

/**
 * Manages the installation, updating, and removal of BMAD modules.
 * Handles module discovery, dependency resolution, and configuration processing.
 *
 * @class ModuleManager
 * @requires fs-extra
 * @requires yaml
 * @requires prompts
 *
 * @example
 * const manager = new ModuleManager();
 * const modules = await manager.listAvailable();
 * await manager.install('core-module', '/path/to/bmad');
 */
class ModuleManager {
  constructor(options = {}) {
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
   * List all available modules (excluding core which is always installed)
   * bmm is the only built-in module, directly under src/bmm-skills
   * All other modules come from external-official-modules.yaml
   * @returns {Object} Object with modules array and customModules array
   */
  async listAvailable() {
    const modules = [];
    const customModules = [];

    // Add built-in bmm module (directly under src/bmm-skills)
    const bmmPath = getSourcePath('bmm-skills');
    if (await fs.pathExists(bmmPath)) {
      const bmmInfo = await this.getModuleInfo(bmmPath, 'bmm', 'src/bmm-skills');
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
    const isCustomSource =
      sourceDescription !== 'src/bmm-skills' && sourceDescription !== 'src/core-skills' && sourceDescription !== 'src/modules';
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

    // Check for built-in bmm module (directly under src/bmm-skills)
    if (moduleCode === 'bmm') {
      const bmmPath = getSourcePath('bmm-skills');
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

    // Copy module files with filtering
    await this.copyModuleWithFiltering(sourcePath, targetPath, fileTrackingCallback, options.moduleConfig);

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

      // Skip sidecar directories - these contain agent-specific assets not needed at install time
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

      // Skip module root config.yaml only - generated by config collector with actual values
      // Workflow-level config.yaml (e.g. workflows/orchestrate-story/config.yaml) must be copied
      // for custom modules that use workflow-specific configuration
      if (file === 'config.yaml') {
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

      // Copy the file with placeholder replacement
      await this.copyFileWithPlaceholderReplacement(sourceFile, targetFile);

      // Track the file if callback provided
      if (fileTrackingCallback) {
        fileTrackingCallback(targetFile);
      }
    }
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

    // Special handling for core module - it's in src/core-skills not src/modules
    let sourcePath;
    if (moduleName === 'core') {
      sourcePath = getSourcePath('core-skills');
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
