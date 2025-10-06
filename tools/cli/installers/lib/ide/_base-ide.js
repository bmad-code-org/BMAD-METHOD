const path = require('node:path');
const fs = require('fs-extra');
const chalk = require('chalk');
const { XmlHandler } = require('../../../lib/xml-handler');
const { getSourcePath } = require('../../../lib/project-root');

/**
 * Base class for IDE-specific setup
 * All IDE handlers should extend this class
 */
class BaseIdeSetup {
  constructor(name, displayName = null, preferred = false) {
    this.name = name;
    this.displayName = displayName || name; // Human-readable name for UI
    this.preferred = preferred; // Whether this IDE should be shown in preferred list
    this.configDir = null; // Override in subclasses
    this.rulesDir = null; // Override in subclasses
    this.configFile = null; // Override in subclasses when detection is file-based
    this.detectionPaths = []; // Additional paths that indicate the IDE is configured
    this.xmlHandler = new XmlHandler();
  }

  /**
   * Main setup method - must be implemented by subclasses
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    throw new Error(`setup() must be implemented by ${this.name} handler`);
  }

  /**
   * Cleanup IDE configuration
   * @param {string} projectDir - Project directory
   */
  async cleanup(projectDir) {
    // Default implementation - can be overridden
    if (this.configDir) {
      const configPath = path.join(projectDir, this.configDir);
      if (await fs.pathExists(configPath)) {
        const bmadRulesPath = path.join(configPath, 'bmad');
        if (await fs.pathExists(bmadRulesPath)) {
          await fs.remove(bmadRulesPath);
          console.log(chalk.dim(`Removed ${this.name} BMAD configuration`));
        }
      }
    }
  }

  /**
   * Detect whether this IDE already has configuration in the project
   * Subclasses can override for custom logic
   * @param {string} projectDir - Project directory
   * @returns {boolean}
   */
  async detect(projectDir) {
    const pathsToCheck = [];

    if (this.configDir) {
      pathsToCheck.push(path.join(projectDir, this.configDir));
    }

    if (this.configFile) {
      pathsToCheck.push(path.join(projectDir, this.configFile));
    }

    if (Array.isArray(this.detectionPaths)) {
      for (const candidate of this.detectionPaths) {
        if (!candidate) continue;
        const resolved = path.isAbsolute(candidate) ? candidate : path.join(projectDir, candidate);
        pathsToCheck.push(resolved);
      }
    }

    for (const candidate of pathsToCheck) {
      if (await fs.pathExists(candidate)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get list of agents from BMAD installation
   * @param {string} bmadDir - BMAD installation directory
   * @returns {Array} List of agent files
   */
  async getAgents(bmadDir) {
    const agents = [];

    // Get core agents
    const coreAgentsPath = path.join(bmadDir, 'core', 'agents');
    if (await fs.pathExists(coreAgentsPath)) {
      const coreAgents = await this.scanDirectory(coreAgentsPath, '.md');
      agents.push(
        ...coreAgents.map((a) => ({
          ...a,
          module: 'core',
        })),
      );
    }

    // Get module agents
    const entries = await fs.readdir(bmadDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'core' && entry.name !== '_cfg') {
        const moduleAgentsPath = path.join(bmadDir, entry.name, 'agents');
        if (await fs.pathExists(moduleAgentsPath)) {
          const moduleAgents = await this.scanDirectory(moduleAgentsPath, '.md');
          agents.push(
            ...moduleAgents.map((a) => ({
              ...a,
              module: entry.name,
            })),
          );
        }
      }
    }

    return agents;
  }

  /**
   * Get list of tasks from BMAD installation
   * @param {string} bmadDir - BMAD installation directory
   * @returns {Array} List of task files
   */
  async getTasks(bmadDir) {
    const tasks = [];

    // Get core tasks
    const coreTasksPath = path.join(bmadDir, 'core', 'tasks');
    if (await fs.pathExists(coreTasksPath)) {
      const coreTasks = await this.scanDirectory(coreTasksPath, '.md');
      tasks.push(
        ...coreTasks.map((t) => ({
          ...t,
          module: 'core',
        })),
      );
    }

    // Get module tasks
    const entries = await fs.readdir(bmadDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'core' && entry.name !== '_cfg') {
        const moduleTasksPath = path.join(bmadDir, entry.name, 'tasks');
        if (await fs.pathExists(moduleTasksPath)) {
          const moduleTasks = await this.scanDirectory(moduleTasksPath, '.md');
          tasks.push(
            ...moduleTasks.map((t) => ({
              ...t,
              module: entry.name,
            })),
          );
        }
      }
    }

    return tasks;
  }

  /**
   * Scan a directory for files with specific extension
   * @param {string} dir - Directory to scan
   * @param {string} ext - File extension to match
   * @returns {Array} List of file info objects
   */
  async scanDirectory(dir, ext) {
    const files = [];

    if (!(await fs.pathExists(dir))) {
      return files;
    }

    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        const subFiles = await this.scanDirectory(fullPath, ext);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith(ext)) {
        files.push({
          name: path.basename(entry.name, ext),
          path: fullPath,
          relativePath: path.relative(dir, fullPath),
          filename: entry.name,
        });
      }
    }

    return files;
  }

  /**
   * Create IDE command/rule file from agent or task
   * @param {string} content - File content
   * @param {Object} metadata - File metadata
   * @param {string} projectDir - The actual project directory path
   * @returns {string} Processed content
   */
  processContent(content, metadata = {}, projectDir = null) {
    // Replace placeholders
    let processed = content;

    // Inject activation block for agent files FIRST (before replacements)
    if (metadata.name && content.includes('<agent')) {
      processed = this.xmlHandler.injectActivationSimple(processed, metadata);
    }

    // Use the actual project directory path if provided, otherwise default to 'bmad'
    // Note: Don't add trailing slash - paths in source include leading slash
    const projectRoot = projectDir || 'bmad';

    // Common replacements (including in the activation block)
    processed = processed.replaceAll('{project-root}', projectRoot);
    processed = processed.replaceAll('{module}', metadata.module || 'core');
    processed = processed.replaceAll('{agent}', metadata.name || '');
    processed = processed.replaceAll('{task}', metadata.name || '');

    return processed;
  }

  /**
   * Ensure directory exists
   * @param {string} dirPath - Directory path
   */
  async ensureDir(dirPath) {
    await fs.ensureDir(dirPath);
  }

  /**
   * Write file with content
   * @param {string} filePath - File path
   * @param {string} content - File content
   */
  async writeFile(filePath, content) {
    await this.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf8');
  }

  /**
   * Copy file from source to destination
   * @param {string} source - Source file path
   * @param {string} dest - Destination file path
   */
  async copyFile(source, dest) {
    await this.ensureDir(path.dirname(dest));
    await fs.copy(source, dest, { overwrite: true });
  }

  /**
   * Check if path exists
   * @param {string} pathToCheck - Path to check
   * @returns {boolean} True if path exists
   */
  async exists(pathToCheck) {
    return await fs.pathExists(pathToCheck);
  }

  /**
   * Alias for exists method
   * @param {string} pathToCheck - Path to check
   * @returns {boolean} True if path exists
   */
  async pathExists(pathToCheck) {
    return await fs.pathExists(pathToCheck);
  }

  /**
   * Read file content
   * @param {string} filePath - File path
   * @returns {string} File content
   */
  async readFile(filePath) {
    return await fs.readFile(filePath, 'utf8');
  }

  /**
   * Format name as title
   * @param {string} name - Name to format
   * @returns {string} Formatted title
   */
  formatTitle(name) {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Create agent configuration file
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} agent - Agent information
   */
  async createAgentConfig(bmadDir, agent) {
    const agentConfigDir = path.join(bmadDir, '_cfg', 'agents');
    await this.ensureDir(agentConfigDir);

    // Load agent config template
    const templatePath = getSourcePath('utility', 'models', 'agent-config-template.md');
    const templateContent = await this.readFile(templatePath);

    const configContent = `# Agent Config: ${agent.name}

${templateContent}`;

    const configPath = path.join(agentConfigDir, `${agent.module}-${agent.name}.md`);
    await this.writeFile(configPath, configContent);
  }
}

module.exports = { BaseIdeSetup };
