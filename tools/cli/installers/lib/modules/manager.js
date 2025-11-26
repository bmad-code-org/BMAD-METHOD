const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const chalk = require('chalk');
const { XmlHandler } = require('../../../lib/xml-handler');
const { getProjectRoot, getSourcePath, getModulePath } = require('../../../lib/project-root');

/**
 * Manages the installation, updating, and removal of BMAD modules.
 * Handles module discovery, dependency resolution, configuration processing,
 * and agent file management including XML activation block injection.
 *
 * @class ModuleManager
 * @requires fs-extra
 * @requires js-yaml
 * @requires chalk
 * @requires XmlHandler
 *
 * @example
 * const manager = new ModuleManager();
 * const modules = await manager.listAvailable();
 * await manager.install('core-module', '/path/to/bmad');
 */
class ModuleManager {
  constructor() {
    // Path to source modules directory
    this.modulesSourcePath = getSourcePath('modules');
    this.xmlHandler = new XmlHandler();
    this.bmadFolderName = 'bmad'; // Default, can be overridden
  }

  /**
   * Set the bmad folder name for placeholder replacement
   * @param {string} bmadFolderName - The bmad folder name
   */
  setBmadFolderName(bmadFolderName) {
    this.bmadFolderName = bmadFolderName;
  }

  /**
   * Copy a file and replace {bmad_folder} placeholder with actual folder name
   * @param {string} sourcePath - Source file path
   * @param {string} targetPath - Target file path
   */
  async copyFileWithPlaceholderReplacement(sourcePath, targetPath) {
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
          content = content.replaceAll('{bmad_folder}', this.bmadFolderName);
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
   * Copy a directory recursively with placeholder replacement
   * @param {string} sourceDir - Source directory path
   * @param {string} targetDir - Target directory path
   */
  async copyDirectoryWithPlaceholderReplacement(sourceDir, targetDir) {
    await fs.ensureDir(targetDir);
    const entries = await fs.readdir(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);
      const targetPath = path.join(targetDir, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectoryWithPlaceholderReplacement(sourcePath, targetPath);
      } else {
        await this.copyFileWithPlaceholderReplacement(sourcePath, targetPath);
      }
    }
  }

  /**
   * List all available modules
   * @returns {Array} List of available modules with metadata
   */
  async listAvailable() {
    const modules = [];

    if (!(await fs.pathExists(this.modulesSourcePath))) {
      console.warn(chalk.yellow('Warning: src/modules directory not found'));
      return modules;
    }

    const entries = await fs.readdir(this.modulesSourcePath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const modulePath = path.join(this.modulesSourcePath, entry.name);
        // Check for new structure first
        const installerConfigPath = path.join(modulePath, '_module-installer', 'install-config.yaml');
        // Fallback to old structure
        const configPath = path.join(modulePath, 'config.yaml');

        const moduleInfo = {
          id: entry.name,
          path: modulePath,
          name: entry.name.toUpperCase(),
          description: 'BMAD Module',
          version: '5.0.0',
        };

        // Try to read module config for metadata (prefer new location)
        const configToRead = (await fs.pathExists(installerConfigPath)) ? installerConfigPath : configPath;
        if (await fs.pathExists(configToRead)) {
          try {
            const configContent = await fs.readFile(configToRead, 'utf8');
            const config = yaml.load(configContent);

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
            console.warn(`Failed to read config for ${entry.name}:`, error.message);
          }
        }

        modules.push(moduleInfo);
      }
    }

    return modules;
  }

  /**
   * Install a module
   * @param {string} moduleName - Name of the module to install
   * @param {string} bmadDir - Target bmad directory
   * @param {Function} fileTrackingCallback - Optional callback to track installed files
   * @param {Object} options - Additional installation options
   * @param {Array<string>} options.installedIDEs - Array of IDE codes that were installed
   * @param {Object} options.moduleConfig - Module configuration from config collector
   * @param {Object} options.logger - Logger instance for output
   */
  async install(moduleName, bmadDir, fileTrackingCallback = null, options = {}) {
    const sourcePath = path.join(this.modulesSourcePath, moduleName);
    const targetPath = path.join(bmadDir, moduleName);

    // Check if source module exists
    if (!(await fs.pathExists(sourcePath))) {
      throw new Error(`Module '${moduleName}' not found in ${this.modulesSourcePath}`);
    }

    // Check if already installed
    if (await fs.pathExists(targetPath)) {
      console.log(chalk.yellow(`Module '${moduleName}' already installed, updating...`));
      await fs.remove(targetPath);
    }

    // Vendor cross-module workflows BEFORE copying
    // This reads source agent.yaml files and copies referenced workflows
    await this.vendorCrossModuleWorkflows(sourcePath, targetPath, moduleName);

    // Copy module files with filtering
    await this.copyModuleWithFiltering(sourcePath, targetPath, fileTrackingCallback, options.moduleConfig);

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
    const sourcePath = path.join(this.modulesSourcePath, moduleName);
    const targetPath = path.join(bmadDir, moduleName);

    // Check if source module exists
    if (!(await fs.pathExists(sourcePath))) {
      throw new Error(`Module '${moduleName}' not found in source`);
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
        const config = yaml.load(configContent);
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

    // Game development files to conditionally exclude
    const gameDevFiles = [
      'agents/game-architect.agent.yaml',
      'agents/game-designer.agent.yaml',
      'agents/game-dev.agent.yaml',
      'workflows/1-analysis/brainstorm-game',
      'workflows/1-analysis/game-brief',
      'workflows/2-plan-workflows/gdd',
    ];

    for (const file of sourceFiles) {
      // Skip sub-modules directory - these are IDE-specific and handled separately
      if (file.startsWith('sub-modules/')) {
        continue;
      }

      // Skip _module-installer directory - it's only needed at install time
      if (file.startsWith('_module-installer/')) {
        continue;
      }

      // Skip config.yaml templates - we'll generate clean ones with actual values
      if (file === 'config.yaml' || file.endsWith('/config.yaml')) {
        continue;
      }

      // Skip user documentation if install_user_docs is false
      if (moduleConfig.install_user_docs === false && (file.startsWith('docs/') || file.startsWith('docs\\'))) {
        console.log(chalk.dim(`  Skipping user documentation: ${file}`));
        continue;
      }

      // Skip game development content if include_game_planning is false
      if (moduleConfig.include_game_planning === false) {
        const shouldSkipGameDev = gameDevFiles.some((gamePath) => {
          // Check if file path starts with or is within any game dev directory
          return file === gamePath || file.startsWith(gamePath + '/') || file.startsWith(gamePath + '\\');
        });

        if (shouldSkipGameDev) {
          console.log(chalk.dim(`  Skipping game dev content: ${file}`));
          continue;
        }
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

    // IMPORTANT: Replace {bmad_folder} BEFORE parsing YAML
    // Otherwise parsing will fail on the placeholder
    yamlContent = yamlContent.replaceAll('{bmad_folder}', this.bmadFolderName);

    try {
      // First check if web_bundle exists by parsing
      const workflowConfig = yaml.load(yamlContent);

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
   * Process agent files to inject activation block
   * @param {string} modulePath - Path to installed module
   * @param {string} moduleName - Module name
   */
  async processAgentFiles(modulePath, moduleName) {
    const agentsPath = path.join(modulePath, 'agents');

    // Check if agents directory exists
    if (!(await fs.pathExists(agentsPath))) {
      return; // No agents to process
    }

    // Get all agent files
    const agentFiles = await fs.readdir(agentsPath);

    for (const agentFile of agentFiles) {
      if (!agentFile.endsWith('.md')) continue;

      const agentPath = path.join(agentsPath, agentFile);
      let content = await fs.readFile(agentPath, 'utf8');

      // Check if content has agent XML and no activation block
      if (content.includes('<agent') && !content.includes('<activation')) {
        // Inject the activation block using XML handler
        content = this.xmlHandler.injectActivationSimple(content);
        await fs.writeFile(agentPath, content, 'utf8');
      }
    }
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
      const agentYaml = yaml.load(await fs.readFile(agentPath, 'utf8'));

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
        // Handle both {bmad_folder} placeholder and hardcoded 'bmad'
        // Example: {project-root}/{bmad_folder}/bmm/workflows/4-implementation/create-story/workflow.yaml
        // Or: {project-root}/bmad/bmm/workflows/4-implementation/create-story/workflow.yaml
        const sourceMatch = sourceWorkflowPath.match(/\{project-root\}\/(?:\{bmad_folder\}|bmad)\/([^/]+)\/workflows\/(.+)/);
        if (!sourceMatch) {
          console.warn(chalk.yellow(`      Could not parse workflow path: ${sourceWorkflowPath}`));
          continue;
        }

        const [, sourceModule, sourceWorkflowSubPath] = sourceMatch;

        // Parse INSTALL workflow path
        // Handle both {bmad_folder} placeholder and hardcoded 'bmad'
        // Example: {project-root}/{bmad_folder}/bmgd/workflows/4-production/create-story/workflow.yaml
        const installMatch = installWorkflowPath.match(/\{project-root\}\/(?:\{bmad_folder\}|bmad)\/([^/]+)\/workflows\/(.+)/);
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

    // Replace config_source: "{project-root}/{bmad_folder}/OLD_MODULE/config.yaml"
    // with config_source: "{project-root}/{bmad_folder}/NEW_MODULE/config.yaml"
    // Note: At this point {bmad_folder} has already been replaced with actual folder name
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
      sourcePath = path.join(this.modulesSourcePath, moduleName);
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
