const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const chalk = require('chalk');
const { XmlHandler } = require('../../../lib/xml-handler');
const { getProjectRoot, getSourcePath, getModulePath } = require('../../../lib/project-root');
const { filterCustomizationData } = require('../../../lib/agent/compiler');

/**
 * Manages the installation, updating, and removal of BMAD modules.
 * Handles module discovery, dependency resolution, configuration processing,
 * and agent file management including XML activation block injection.
 *
 * @class ModuleManager
 * @requires fs-extra
 * @requires yaml
 * @requires chalk
 * @requires XmlHandler
 *
 * @example
 * const manager = new ModuleManager();
 * const modules = await manager.listAvailable();
 * await manager.install('core-module', '/path/to/bmad');
 */
class ModuleManager {
  constructor(options = {}) {
    // Path to source modules directory
    this.modulesSourcePath = getSourcePath('modules');
    this.xmlHandler = new XmlHandler();
    this.bmadFolderName = 'bmad'; // Default, can be overridden
    this.customModulePaths = new Map(); // Initialize custom module paths
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
              console.log(chalk.dim(`    Updated sidecar file: ${relativeToBmad}`));
            }
          } else {
            // User has modified the file, preserve it
            if (process.env.BMAD_VERBOSE_INSTALL === 'true') {
              console.log(chalk.dim(`    Preserving user-modified file: ${relativeToBmad}`));
            }
          }
        } else {
          // First time seeing this file in manifest, copy it
          await this.copyFileWithPlaceholderReplacement(sourceFilePath, targetFilePath, true);
          if (process.env.BMAD_VERBOSE_INSTALL === 'true') {
            console.log(chalk.dim(`    Added new sidecar file: ${relativeToBmad}`));
          }
        }
      } else {
        // New installation
        await this.copyFileWithPlaceholderReplacement(sourceFilePath, targetFilePath, true);
        if (process.env.BMAD_VERBOSE_INSTALL === 'true') {
          console.log(chalk.dim(`    Copied sidecar file: ${relativeToBmad}`));
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
   * @returns {Object} Object with modules array and customModules array
   */
  async listAvailable() {
    const modules = [];
    const customModules = [];

    // First, scan src/modules (the standard location)
    if (await fs.pathExists(this.modulesSourcePath)) {
      const entries = await fs.readdir(this.modulesSourcePath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const modulePath = path.join(this.modulesSourcePath, entry.name);
          // Check for module structure (module.yaml OR custom.yaml)
          const moduleConfigPath = path.join(modulePath, 'module.yaml');
          const installerConfigPath = path.join(modulePath, '_module-installer', 'module.yaml');
          const customConfigPath = path.join(modulePath, '_module-installer', 'custom.yaml');

          // Skip if this doesn't look like a module
          if (
            !(await fs.pathExists(moduleConfigPath)) &&
            !(await fs.pathExists(installerConfigPath)) &&
            !(await fs.pathExists(customConfigPath))
          ) {
            continue;
          }

          // Skip core module - it's always installed first and not selectable
          if (entry.name === 'core') {
            continue;
          }

          const moduleInfo = await this.getModuleInfo(modulePath, entry.name, 'src/modules');
          if (moduleInfo) {
            modules.push(moduleInfo);
          }
        }
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
    const installerConfigPath = path.join(modulePath, '_module-installer', 'module.yaml');
    const customConfigPath = path.join(modulePath, '_module-installer', 'custom.yaml');
    const rootCustomConfigPath = path.join(modulePath, 'custom.yaml');
    let configPath = null;

    if (await fs.pathExists(moduleConfigPath)) {
      configPath = moduleConfigPath;
    } else if (await fs.pathExists(installerConfigPath)) {
      configPath = installerConfigPath;
    } else if (await fs.pathExists(customConfigPath)) {
      configPath = customConfigPath;
    } else if (await fs.pathExists(rootCustomConfigPath)) {
      configPath = rootCustomConfigPath;
    }

    // Skip if this doesn't look like a module
    if (!configPath) {
      return null;
    }

    // Mark as custom if it's using custom.yaml OR if it's outside src/modules
    const isCustomSource = sourceDescription !== 'src/modules';
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
      isCustom: configPath === customConfigPath || configPath === rootCustomConfigPath || isCustomSource,
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
      console.warn(`Failed to read config for ${defaultName}:`, error.message);
    }

    return moduleInfo;
  }

  /**
   * Find the source path for a module by searching all possible locations
   * @param {string} moduleCode - Code of the module to find (from module.yaml)
   * @returns {string|null} Path to the module source or null if not found
   */
  async findModuleSource(moduleCode) {
    const projectRoot = getProjectRoot();

    // First check custom module paths if they exist
    if (this.customModulePaths && this.customModulePaths.has(moduleCode)) {
      return this.customModulePaths.get(moduleCode);
    }

    // Search in src/modules by READING module.yaml files to match by code
    if (await fs.pathExists(this.modulesSourcePath)) {
      const entries = await fs.readdir(this.modulesSourcePath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const modulePath = path.join(this.modulesSourcePath, entry.name);

          // Read module.yaml to get the code
          const moduleConfigPath = path.join(modulePath, 'module.yaml');
          const installerConfigPath = path.join(modulePath, '_module-installer', 'module.yaml');
          const customConfigPath = path.join(modulePath, '_module-installer', 'custom.yaml');

          let configPath = null;
          if (await fs.pathExists(moduleConfigPath)) {
            configPath = moduleConfigPath;
          } else if (await fs.pathExists(installerConfigPath)) {
            configPath = installerConfigPath;
          } else if (await fs.pathExists(customConfigPath)) {
            configPath = customConfigPath;
          }

          if (configPath) {
            try {
              const configContent = await fs.readFile(configPath, 'utf8');
              const config = yaml.parse(configContent);
              if (config.code === moduleCode) {
                return modulePath;
              }
            } catch (error) {
              // Continue to next module if parse fails
              console.warn(`Warning: Failed to parse module config at ${configPath}: ${error.message}`);
            }
          }
        }
      }
    }

    return null;
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
    const sourcePath = await this.findModuleSource(moduleName);
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
    const moduleInstallerCustomPath = path.join(sourcePath, '_module-installer', 'custom.yaml');

    if (await fs.pathExists(rootCustomConfigPath)) {
      try {
        const customContent = await fs.readFile(rootCustomConfigPath, 'utf8');
        customConfig = yaml.parse(customContent);
      } catch (error) {
        console.warn(chalk.yellow(`Warning: Failed to read custom.yaml for ${moduleName}:`, error.message));
      }
    } else if (await fs.pathExists(moduleInstallerCustomPath)) {
      try {
        const customContent = await fs.readFile(moduleInstallerCustomPath, 'utf8');
        customConfig = yaml.parse(customContent);
      } catch (error) {
        console.warn(chalk.yellow(`Warning: Failed to read custom.yaml for ${moduleName}:`, error.message));
      }
    }

    // If this is a custom module, merge its values into the module config
    if (customConfig) {
      options.moduleConfig = { ...options.moduleConfig, ...customConfig };
      if (options.logger) {
        options.logger.log(chalk.cyan(`  Merged custom configuration for ${moduleName}`));
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

    // Call module-specific installer if it exists (unless explicitly skipped)
    if (!options.skipModuleInstaller) {
      await this.runModuleInstaller(moduleName, bmadDir, options);
    }

    return {
      success: true,
      module: moduleName,
      path: targetPath,
    };
  }

  /**
   * Update an existing module
   * @param {string} moduleName - Name of the module to update
   * @param {string} bmadDir - Target bmad directory
   * @param {boolean} force - Force update (overwrite modifications)
   */
  async update(moduleName, bmadDir, force = false) {
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
      return await this.install(moduleName, bmadDir);
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
        console.warn(`Failed to read installed module config:`, error.message);
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

      // Skip _module-installer directory - it's only needed at install time
      if (file.startsWith('_module-installer/') || file === 'module.yaml') {
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
          console.log(chalk.dim(`  Skipping web-only agent: ${path.basename(file)}`));
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
    yamlContent = yamlContent.replaceAll('_bmad', '_bmad');
    yamlContent = yamlContent.replaceAll('_bmad', this.bmadFolderName);

    try {
      // First check if web_bundle exists by parsing
      const workflowConfig = yaml.parse(yamlContent);

      if (workflowConfig.web_bundle === undefined) {
        // No web_bundle section, just write (placeholders already replaced above)
        await fs.writeFile(targetFile, yamlContent, 'utf8');
        return;
      }

      // Remove web_bundle section using regex to preserve formatting
      // Match the web_bundle key and all its content (including nested items)
      // This handles both web_bundle: false and web_bundle: {...}

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
      console.warn(chalk.yellow(`  Warning: Could not process ${path.basename(sourceFile)}, copying as-is`));
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

      const relativePath = path.relative(sourceAgentsPath, agentFile);
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
              console.log(chalk.dim(`  Created customize: ${moduleName}-${agentName}.customize.yaml`));
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

        // Process TTS injection points if installer is available
        let finalXml = xml;
        if (installer && installer.processTTSInjectionPoints) {
          finalXml = installer.processTTSInjectionPoints(xml, targetMdPath);
        }

        // Write the compiled agent
        await fs.writeFile(targetMdPath, finalXml, 'utf8');

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
              console.log(chalk.dim(`    Sidecar files processed: ${copiedFiles.length} files`));
            }
          } else if (process.env.BMAD_VERBOSE_INSTALL === 'true') {
            console.log(chalk.yellow(`    Warning: Agent marked as having sidecar but ${sidecarDirName} directory not found`));
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
          console.log(
            chalk.dim(
              `    Compiled agent: ${agentName} -> ${path.relative(targetPath, targetMdPath)}${hasSidecar ? ' (with sidecar)' : ''}`,
            ),
          );
        }
      } catch (error) {
        console.warn(chalk.yellow(`    Failed to compile agent ${agentName}:`, error.message));
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
        console.log(chalk.cyan(`\n  Vendoring cross-module workflows for ${moduleName}...`));
        workflowsVendored = true;
      }

      console.log(chalk.dim(`    Processing: ${agentFile}`));

      for (const item of workflowInstallItems) {
        const sourceWorkflowPath = item.workflow; // Where to copy FROM
        const installWorkflowPath = item['workflow-install']; // Where to copy TO

        // Parse SOURCE workflow path
        // Handle both _bmad placeholder and hardcoded 'bmad'
        // Example: {project-root}/_bmad/bmm/workflows/4-implementation/create-story/workflow.yaml
        // Or: {project-root}/bmad/bmm/workflows/4-implementation/create-story/workflow.yaml
        const sourceMatch = sourceWorkflowPath.match(/\{project-root\}\/(?:_bmad)\/([^/]+)\/workflows\/(.+)/);
        if (!sourceMatch) {
          console.warn(chalk.yellow(`      Could not parse workflow path: ${sourceWorkflowPath}`));
          continue;
        }

        const [, sourceModule, sourceWorkflowSubPath] = sourceMatch;

        // Parse INSTALL workflow path
        // Handle_bmad
        // Example: {project-root}/_bmad/bmgd/workflows/4-production/create-story/workflow.yaml
        const installMatch = installWorkflowPath.match(/\{project-root\}\/(_bmad)\/([^/]+)\/workflows\/(.+)/);
        if (!installMatch) {
          console.warn(chalk.yellow(`      Could not parse workflow-install path: ${installWorkflowPath}`));
          continue;
        }

        const installWorkflowSubPath = installMatch[2];

        // Determine actual filesystem paths
        const sourceModulePath = path.join(this.modulesSourcePath, sourceModule);
        const actualSourceWorkflowPath = path.join(sourceModulePath, 'workflows', sourceWorkflowSubPath.replace(/\/workflow\.yaml$/, ''));

        const actualDestWorkflowPath = path.join(targetPath, 'workflows', installWorkflowSubPath.replace(/\/workflow\.yaml$/, ''));

        // Check if source workflow exists
        if (!(await fs.pathExists(actualSourceWorkflowPath))) {
          console.warn(chalk.yellow(`      Source workflow not found: ${actualSourceWorkflowPath}`));
          continue;
        }

        // Copy the entire workflow folder
        console.log(
          chalk.dim(
            `      Vendoring: ${sourceModule}/workflows/${sourceWorkflowSubPath.replace(/\/workflow\.yaml$/, '')} → ${moduleName}/workflows/${installWorkflowSubPath.replace(/\/workflow\.yaml$/, '')}`,
          ),
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
      console.log(chalk.green(`  ✓ Workflow vendoring complete\n`));
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
      console.log(chalk.dim(`      Updated config_source to: ${this.bmadFolderName}/${newModuleName}/config.yaml`));
    }
  }

  /**
   * Run module-specific installer if it exists
   * @param {string} moduleName - Name of the module
   * @param {string} bmadDir - Target bmad directory
   * @param {Object} options - Installation options
   */
  async runModuleInstaller(moduleName, bmadDir, options = {}) {
    // Special handling for core module - it's in src/core not src/modules
    let sourcePath;
    if (moduleName === 'core') {
      sourcePath = getSourcePath('core');
    } else {
      sourcePath = await this.findModuleSource(moduleName);
      if (!sourcePath) {
        // No source found, skip module installer
        return;
      }
    }

    const installerPath = path.join(sourcePath, '_module-installer', 'installer.js');

    // Check if module has a custom installer
    if (!(await fs.pathExists(installerPath))) {
      return; // No custom installer
    }

    try {
      // Load the module installer
      const moduleInstaller = require(installerPath);

      if (typeof moduleInstaller.install === 'function') {
        // Get project root (parent of bmad directory)
        const projectRoot = path.dirname(bmadDir);

        // Prepare logger (use console if not provided)
        const logger = options.logger || {
          log: console.log,
          error: console.error,
          warn: console.warn,
        };

        // Call the module installer
        const result = await moduleInstaller.install({
          projectRoot,
          config: options.moduleConfig || {},
          coreConfig: options.coreConfig || {},
          installedIDEs: options.installedIDEs || [],
          logger,
        });

        if (!result) {
          console.warn(chalk.yellow(`Module installer for ${moduleName} returned false`));
        }
      }
    } catch (error) {
      console.error(chalk.red(`Error running module installer for ${moduleName}: ${error.message}`));
    }
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
        console.warn(`Failed to process module config:`, error.message);
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
}

module.exports = { ModuleManager };
