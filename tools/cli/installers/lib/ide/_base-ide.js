const path = require('node:path');
const fs = require('fs-extra');
const chalk = require('chalk');
const yaml = require('yaml');

/**
 * Base class for IDE-specific setup
 * All IDE handlers should extend this class
 */
class BaseIdeSetup {
  constructor(name, displayName = null, preferred = false) {
    this.name = name;
    this.displayName = displayName || name; // Human-readable name for UI
    this.preferred = preferred; // Whether this IDE should be shown in preferred list
    this.configDir = null; // Override in subclasses (e.g., '.windsurf/workflows/wds')
    this.configFile = null; // Override in subclasses when detection is file-based
    this.detectionPaths = []; // Additional paths that indicate the IDE is configured
    this.wdsFolderName = '_wds'; // Default, can be overridden
  }

  /**
   * Set the WDS folder name for placeholder replacement
   * @param {string} wdsFolderName - The WDS folder name
   */
  setWdsFolderName(wdsFolderName) {
    this.wdsFolderName = wdsFolderName;
  }

  /**
   * Main setup method - must be implemented by subclasses
   * @param {string} projectDir - Project directory
   * @param {string} wdsDir - WDS installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, wdsDir, options = {}) {
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
        await fs.remove(configPath);
        console.log(chalk.dim(`Removed ${this.name} WDS configuration`));
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
   * Get list of agents from WDS installation
   * @param {string} wdsDir - WDS installation directory
   * @returns {Array} List of agent files with metadata
   */
  async getAgents(wdsDir) {
    const agents = [];
    const agentsPath = path.join(wdsDir, 'agents');

    if (!(await fs.pathExists(agentsPath))) {
      return agents;
    }

    const files = await fs.readdir(agentsPath);

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const filePath = path.join(agentsPath, file);
      const agentName = file.replace('.md', '');

      // Extract metadata from agent file
      const metadata = await this.extractAgentMetadata(filePath);

      // Create slug from agent name (e.g., 'saga-analyst' -> 'saga')
      const slug = metadata.slug || agentName.split('-')[0];

      agents.push({
        name: agentName,
        slug: slug,
        path: filePath,
        relativePath: path.relative(wdsDir, filePath),
        filename: file,
        metadata: metadata,
      });
    }

    return agents;
  }

  /**
   * Extract agent metadata from compiled agent markdown file
   * Reads YAML frontmatter or fallback to defaults
   * @param {string} filePath - Path to agent markdown file
   * @returns {Object} Agent metadata
   */
  async extractAgentMetadata(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');

      // Try to extract YAML frontmatter
      const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        const frontmatter = yaml.parse(frontmatterMatch[1]);

        return {
          name: frontmatter.name || path.basename(filePath, '.md'),
          description: frontmatter.description || frontmatter.role || '',
          icon: frontmatter.icon || '📋',
          slug: frontmatter.id ? path.basename(frontmatter.id, '.md').split('-')[0] : null,
        };
      }

      // Fallback: extract from filename
      const agentName = path.basename(filePath, '.md');
      return {
        name: this.formatTitle(agentName),
        description: agentName.includes('saga') ? 'Strategic Analyst' :
                     agentName.includes('freya') ? 'Designer' : '',
        icon: '📋',
        slug: agentName.split('-')[0],
      };
    } catch (error) {
      // Fallback metadata on error
      const agentName = path.basename(filePath, '.md');
      return {
        name: this.formatTitle(agentName),
        description: '',
        icon: '📋',
        slug: agentName.split('-')[0],
      };
    }
  }

  /**
   * Format agent launcher content that references the compiled agent
   * @param {string} agentName - Agent name (e.g., 'saga-analyst')
   * @param {string} agentPath - Relative path to agent file (e.g., 'agents/saga-analyst.md')
   * @returns {string} Launcher content
   */
  formatAgentLauncher(agentName, agentPath) {
    const relativePath = path.relative(process.cwd(), agentPath)
      .replace(/\\/g, '/'); // Convert Windows paths to forward slashes

    return `<!-- WDS Agent Launcher -->
<!-- This file references the compiled agent. Do not edit directly. -->
<!-- Source: ${this.wdsFolderName}/agents/${agentName}.md -->

@include(${this.wdsFolderName}/agents/${agentName}.md)
`;
  }

  /**
   * Process content with IDE-specific frontmatter
   * Subclasses must override this to add IDE-specific headers
   * @param {string} content - Launcher content
   * @param {Object} metadata - Agent metadata
   * @returns {string} Processed content with IDE-specific frontmatter
   */
  processContent(content, metadata = {}) {
    // Default implementation - subclasses should override
    return content;
  }

  /**
   * Ensure directory exists
   * @param {string} dirPath - Directory path
   */
  async ensureDir(dirPath) {
    await fs.ensureDir(dirPath);
  }

  /**
   * Write file with content (replaces _wds placeholder)
   * @param {string} filePath - File path
   * @param {string} content - File content
   */
  async writeFile(filePath, content) {
    // Replace _wds placeholder if present
    if (typeof content === 'string' && content.includes('_wds')) {
      content = content.replaceAll('_wds', this.wdsFolderName);
    }

    await this.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf8');
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
   * @param {string} name - Name to format (e.g., 'saga-analyst')
   * @returns {string} Formatted title (e.g., 'Saga Analyst')
   */
  formatTitle(name) {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

module.exports = { BaseIdeSetup };
