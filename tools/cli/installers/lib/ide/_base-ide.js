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
   * Get the agent command activation header from the central template
   * @returns {string} The activation header text (without XML tags)
   */
  async getAgentCommandHeader() {
    const headerPath = path.join(getSourcePath(), 'src', 'utility', 'models', 'agent-command-header.md');
    try {
      const content = await fs.readFile(headerPath, 'utf8');
      // Strip the <critical> tags to get plain text
      return content.replaceAll(/<critical>|<\/critical>/g, '').trim();
    } catch {
      // Fallback if file doesn't exist
      return "You must fully embody this agent's persona and follow all activation instructions, steps and rules exactly as specified. NEVER break character until given an exit command.";
    }
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
   * Install a custom agent launcher - subclasses should override
   * @param {string} projectDir - Project directory
   * @param {string} agentName - Agent name (e.g., "fred-commit-poet")
   * @param {string} agentPath - Path to compiled agent (relative to project root)
   * @param {Object} metadata - Agent metadata
   * @returns {Object|null} Info about created command, or null if not supported
   */
  async installCustomAgentLauncher(projectDir, agentName, agentPath, metadata) {
    // Default implementation - subclasses can override
    return null;
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
      if (entry.isDirectory() && entry.name !== 'core' && entry.name !== '_cfg' && entry.name !== 'agents') {
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

    // Get standalone agents from bmad/agents/ directory
    const standaloneAgentsDir = path.join(bmadDir, 'agents');
    if (await fs.pathExists(standaloneAgentsDir)) {
      const agentDirs = await fs.readdir(standaloneAgentsDir, { withFileTypes: true });

      for (const agentDir of agentDirs) {
        if (!agentDir.isDirectory()) continue;

        const agentDirPath = path.join(standaloneAgentsDir, agentDir.name);
        const agentFiles = await fs.readdir(agentDirPath);

        for (const file of agentFiles) {
          if (!file.endsWith('.md')) continue;
          if (file.includes('.customize.')) continue;

          const filePath = path.join(agentDirPath, file);
          const content = await fs.readFile(filePath, 'utf8');

          if (content.includes('localskip="true"')) continue;

          agents.push({
            name: file.replace('.md', ''),
            path: filePath,
            relativePath: path.relative(standaloneAgentsDir, filePath),
            filename: file,
            module: 'standalone', // Mark as standalone agent
          });
        }
      }
    }

    return agents;
  }

  /**
   * Get list of tasks from BMAD installation
   * @param {string} bmadDir - BMAD installation directory
   * @param {boolean} standaloneOnly - If true, only return standalone tasks
   * @returns {Array} List of task files
   */
  async getTasks(bmadDir, standaloneOnly = false) {
    const tasks = [];

    // Get core tasks (scan for both .md and .xml)
    const coreTasksPath = path.join(bmadDir, 'core', 'tasks');
    if (await fs.pathExists(coreTasksPath)) {
      const coreTasks = await this.scanDirectoryWithStandalone(coreTasksPath, ['.md', '.xml']);
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
      if (entry.isDirectory() && entry.name !== 'core' && entry.name !== '_cfg' && entry.name !== 'agents') {
        const moduleTasksPath = path.join(bmadDir, entry.name, 'tasks');
        if (await fs.pathExists(moduleTasksPath)) {
          const moduleTasks = await this.scanDirectoryWithStandalone(moduleTasksPath, ['.md', '.xml']);
          tasks.push(
            ...moduleTasks.map((t) => ({
              ...t,
              module: entry.name,
            })),
          );
        }
      }
    }

    // Filter by standalone if requested
    if (standaloneOnly) {
      return tasks.filter((t) => t.standalone === true);
    }

    return tasks;
  }

  /**
   * Get list of tools from BMAD installation
   * @param {string} bmadDir - BMAD installation directory
   * @param {boolean} standaloneOnly - If true, only return standalone tools
   * @returns {Array} List of tool files
   */
  async getTools(bmadDir, standaloneOnly = false) {
    const tools = [];

    // Get core tools (scan for both .md and .xml)
    const coreToolsPath = path.join(bmadDir, 'core', 'tools');
    if (await fs.pathExists(coreToolsPath)) {
      const coreTools = await this.scanDirectoryWithStandalone(coreToolsPath, ['.md', '.xml']);
      tools.push(
        ...coreTools.map((t) => ({
          ...t,
          module: 'core',
        })),
      );
    }

    // Get module tools
    const entries = await fs.readdir(bmadDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'core' && entry.name !== '_cfg' && entry.name !== 'agents') {
        const moduleToolsPath = path.join(bmadDir, entry.name, 'tools');
        if (await fs.pathExists(moduleToolsPath)) {
          const moduleTools = await this.scanDirectoryWithStandalone(moduleToolsPath, ['.md', '.xml']);
          tools.push(
            ...moduleTools.map((t) => ({
              ...t,
              module: entry.name,
            })),
          );
        }
      }
    }

    // Filter by standalone if requested
    if (standaloneOnly) {
      return tools.filter((t) => t.standalone === true);
    }

    return tools;
  }

  /**
   * Get list of workflows from BMAD installation
   * @param {string} bmadDir - BMAD installation directory
   * @param {boolean} standaloneOnly - If true, only return standalone workflows
   * @returns {Array} List of workflow files
   */
  async getWorkflows(bmadDir, standaloneOnly = false) {
    const workflows = [];

    // Get core workflows
    const coreWorkflowsPath = path.join(bmadDir, 'core', 'workflows');
    if (await fs.pathExists(coreWorkflowsPath)) {
      const coreWorkflows = await this.findWorkflowYamlFiles(coreWorkflowsPath);
      workflows.push(
        ...coreWorkflows.map((w) => ({
          ...w,
          module: 'core',
        })),
      );
    }

    // Get module workflows
    const entries = await fs.readdir(bmadDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'core' && entry.name !== '_cfg' && entry.name !== 'agents') {
        const moduleWorkflowsPath = path.join(bmadDir, entry.name, 'workflows');
        if (await fs.pathExists(moduleWorkflowsPath)) {
          const moduleWorkflows = await this.findWorkflowYamlFiles(moduleWorkflowsPath);
          workflows.push(
            ...moduleWorkflows.map((w) => ({
              ...w,
              module: entry.name,
            })),
          );
        }
      }
    }

    // Filter by standalone if requested
    if (standaloneOnly) {
      return workflows.filter((w) => w.standalone === true);
    }

    return workflows;
  }

  /**
   * Recursively find workflow.yaml files
   * @param {string} dir - Directory to search
   * @returns {Array} List of workflow file info objects
   */
  async findWorkflowYamlFiles(dir) {
    const workflows = [];

    if (!(await fs.pathExists(dir))) {
      return workflows;
    }

    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively search subdirectories
        const subWorkflows = await this.findWorkflowYamlFiles(fullPath);
        workflows.push(...subWorkflows);
      } else if (entry.isFile() && entry.name === 'workflow.yaml') {
        // Read workflow.yaml to get name and standalone property
        try {
          const yaml = require('js-yaml');
          const content = await fs.readFile(fullPath, 'utf8');
          const workflowData = yaml.load(content);

          if (workflowData && workflowData.name) {
            workflows.push({
              name: workflowData.name,
              path: fullPath,
              relativePath: path.relative(dir, fullPath),
              filename: entry.name,
              description: workflowData.description || '',
              standalone: workflowData.standalone === true, // Check standalone property
            });
          }
        } catch {
          // Skip invalid workflow files
        }
      }
    }

    return workflows;
  }

  /**
   * Scan a directory for files with specific extension(s)
   * @param {string} dir - Directory to scan
   * @param {string|Array<string>} ext - File extension(s) to match (e.g., '.md' or ['.md', '.xml'])
   * @returns {Array} List of file info objects
   */
  async scanDirectory(dir, ext) {
    const files = [];

    if (!(await fs.pathExists(dir))) {
      return files;
    }

    // Normalize ext to array
    const extensions = Array.isArray(ext) ? ext : [ext];

    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        const subFiles = await this.scanDirectory(fullPath, ext);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        // Check if file matches any of the extensions
        const matchedExt = extensions.find((e) => entry.name.endsWith(e));
        if (matchedExt) {
          files.push({
            name: path.basename(entry.name, matchedExt),
            path: fullPath,
            relativePath: path.relative(dir, fullPath),
            filename: entry.name,
          });
        }
      }
    }

    return files;
  }

  /**
   * Scan a directory for files with specific extension(s) and check standalone attribute
   * @param {string} dir - Directory to scan
   * @param {string|Array<string>} ext - File extension(s) to match (e.g., '.md' or ['.md', '.xml'])
   * @returns {Array} List of file info objects with standalone property
   */
  async scanDirectoryWithStandalone(dir, ext) {
    const files = [];

    if (!(await fs.pathExists(dir))) {
      return files;
    }

    // Normalize ext to array
    const extensions = Array.isArray(ext) ? ext : [ext];

    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        const subFiles = await this.scanDirectoryWithStandalone(fullPath, ext);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        // Check if file matches any of the extensions
        const matchedExt = extensions.find((e) => entry.name.endsWith(e));
        if (matchedExt) {
          // Read file content to check for standalone attribute
          let standalone = false;
          try {
            const content = await fs.readFile(fullPath, 'utf8');

            // Check for standalone="true" in XML files
            if (entry.name.endsWith('.xml')) {
              // Look for standalone="true" in the opening tag (task or tool)
              const standaloneMatch = content.match(/<(?:task|tool)[^>]+standalone="true"/);
              standalone = !!standaloneMatch;
            } else if (entry.name.endsWith('.md')) {
              // Check for standalone: true in YAML frontmatter
              const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
              if (frontmatterMatch) {
                const yaml = require('js-yaml');
                try {
                  const frontmatter = yaml.load(frontmatterMatch[1]);
                  standalone = frontmatter.standalone === true;
                } catch {
                  // Ignore YAML parse errors
                }
              }
            }
          } catch {
            // If we can't read the file, assume not standalone
            standalone = false;
          }

          files.push({
            name: path.basename(entry.name, matchedExt),
            path: fullPath,
            relativePath: path.relative(dir, fullPath),
            filename: entry.name,
            standalone: standalone,
          });
        }
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

    // Only replace {project-root} if a specific projectDir is provided
    // Otherwise leave the placeholder intact
    // Note: Don't add trailing slash - paths in source include leading slash
    if (projectDir) {
      processed = processed.replaceAll('{project-root}', projectDir);
    }
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
   * Write file with content (replaces {bmad_folder} placeholder)
   * @param {string} filePath - File path
   * @param {string} content - File content
   */
  async writeFile(filePath, content) {
    // Replace {bmad_folder} placeholder if present
    if (typeof content === 'string' && content.includes('{bmad_folder}')) {
      content = content.replaceAll('{bmad_folder}', this.bmadFolderName);
    }
    await this.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf8');
  }

  /**
   * Copy file from source to destination (replaces {bmad_folder} placeholder in text files)
   * @param {string} source - Source file path
   * @param {string} dest - Destination file path
   */
  async copyFile(source, dest) {
    // List of text file extensions that should have placeholder replacement
    const textExtensions = ['.md', '.yaml', '.yml', '.txt', '.json', '.js', '.ts', '.html', '.css', '.sh', '.bat', '.csv'];
    const ext = path.extname(source).toLowerCase();

    await this.ensureDir(path.dirname(dest));

    // Check if this is a text file that might contain placeholders
    if (textExtensions.includes(ext)) {
      try {
        // Read the file content
        let content = await fs.readFile(source, 'utf8');

        // Replace {bmad_folder} placeholder with actual folder name
        if (content.includes('{bmad_folder}')) {
          content = content.replaceAll('{bmad_folder}', this.bmadFolderName);
        }

        // Write to dest with replaced content
        await fs.writeFile(dest, content, 'utf8');
      } catch {
        // If reading as text fails, fall back to regular copy
        await fs.copy(source, dest, { overwrite: true });
      }
    } else {
      // Binary file or other file type - just copy directly
      await fs.copy(source, dest, { overwrite: true });
    }
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
   * Flatten a relative path to a single filename for flat slash command naming
   * Example: 'module/agents/name.md' -> 'bmad-module-agents-name.md'
   * Used by IDEs that ignore directory structure for slash commands (e.g., Antigravity, Codex)
   * @param {string} relativePath - Relative path to flatten
   * @returns {string} Flattened filename with 'bmad-' prefix
   */
  flattenFilename(relativePath) {
    const sanitized = relativePath.replaceAll(/[/\\]/g, '-');
    return `bmad-${sanitized}`;
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
