/**
 * Resource Locator - Centralized file path resolution and caching
 * Reduces duplicate file system operations and memory usage
 */

const path = require('node:path');
const fs = require('fs-extra');
const moduleManager = require('./module-manager');

class ResourceLocator {
  constructor() {
    this._pathCache = new Map();
    this._globCache = new Map();
    this._bmadCorePath = null;
    this._expansionPacksPath = null;
  }

  /**
   * Get the base path for bmad-core
   */
  getBmadCorePath() {
    if (!this._bmadCorePath) {
      this._bmadCorePath = path.join(__dirname, '../../../bmad-core');
    }
    return this._bmadCorePath;
  }

  /**
   * Get the base path for expansion packs
   */
  getExpansionPacksPath() {
    if (!this._expansionPacksPath) {
      this._expansionPacksPath = path.join(__dirname, '../../../expansion-packs');
    }
    return this._expansionPacksPath;
  }

  /**
   * Find all files matching a pattern, with caching
   * @param {string} pattern - Glob pattern
   * @param {Object} options - Glob options
   * @returns {Promise<string[]>} Array of matched file paths
   */
  async findFiles(pattern, options = {}) {
    const cacheKey = `${pattern}:${JSON.stringify(options)}`;

    if (this._globCache.has(cacheKey)) {
      return this._globCache.get(cacheKey);
    }

    const { glob } = await moduleManager.getModules(['glob']);
    const files = await glob(pattern, options);

    // Cache for 5 minutes
    this._globCache.set(cacheKey, files);
    setTimeout(() => this._globCache.delete(cacheKey), 5 * 60 * 1000);

    return files;
  }

  /**
   * Get agent path with caching
   * @param {string} agentId - Agent identifier
   * @returns {Promise<string|null>} Path to agent file or null if not found
   */
  async getAgentPath(agentId) {
    const cacheKey = `agent:${agentId}`;

    if (this._pathCache.has(cacheKey)) {
      return this._pathCache.get(cacheKey);
    }

    // Check in bmad-core
    let agentPath = path.join(this.getBmadCorePath(), 'agents', `${agentId}.md`);
    if (await fs.pathExists(agentPath)) {
      this._pathCache.set(cacheKey, agentPath);
      return agentPath;
    }

    // Check in expansion packs
    const expansionPacks = await this.getExpansionPacks();
    for (const pack of expansionPacks) {
      agentPath = path.join(pack.path, 'agents', `${agentId}.md`);
      if (await fs.pathExists(agentPath)) {
        this._pathCache.set(cacheKey, agentPath);
        return agentPath;
      }
    }

    return null;
  }

  /**
   * Get available agents with metadata
   * @returns {Promise<Array>} Array of agent objects
   */
  async getAvailableAgents() {
    const cacheKey = 'all-agents';

    if (this._pathCache.has(cacheKey)) {
      return this._pathCache.get(cacheKey);
    }

    const agents = [];
    const yaml = require('js-yaml');
    const { extractYamlFromAgent } = require('../../lib/yaml-utils');

    // Get agents from bmad-core
    const coreAgents = await this.findFiles('agents/*.md', {
      cwd: this.getBmadCorePath(),
    });

    for (const agentFile of coreAgents) {
      const content = await fs.readFile(path.join(this.getBmadCorePath(), agentFile), 'utf8');
      const yamlContent = extractYamlFromAgent(content);
      if (yamlContent) {
        try {
          const metadata = yaml.load(yamlContent);
          agents.push({
            id: path.basename(agentFile, '.md'),
            name: metadata.agent_name || path.basename(agentFile, '.md'),
            description: metadata.description || 'No description available',
            source: 'core',
          });
        } catch {
          // Skip invalid agents
        }
      }
    }

    // Cache for 10 minutes
    this._pathCache.set(cacheKey, agents);
    setTimeout(() => this._pathCache.delete(cacheKey), 10 * 60 * 1000);

    return agents;
  }

  /**
   * Get available expansion packs
   * @returns {Promise<Array>} Array of expansion pack objects
   */
  async getExpansionPacks() {
    const cacheKey = 'expansion-packs';

    if (this._pathCache.has(cacheKey)) {
      return this._pathCache.get(cacheKey);
    }

    const packs = [];
    const expansionPacksPath = this.getExpansionPacksPath();

    if (await fs.pathExists(expansionPacksPath)) {
      const entries = await fs.readdir(expansionPacksPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const configPath = path.join(expansionPacksPath, entry.name, 'config.yaml');
          if (await fs.pathExists(configPath)) {
            try {
              const yaml = require('js-yaml');
              const config = yaml.load(await fs.readFile(configPath, 'utf8'));
              packs.push({
                id: entry.name,
                name: config.name || entry.name,
                version: config.version || '1.0.0',
                description: config.description || 'No description available',
                shortTitle:
                  config['short-title'] || config.description || 'No description available',
                author: config.author || 'Unknown',
                path: path.join(expansionPacksPath, entry.name),
              });
            } catch {
              // Skip invalid packs
            }
          }
        }
      }
    }

    // Cache for 10 minutes
    this._pathCache.set(cacheKey, packs);
    setTimeout(() => this._pathCache.delete(cacheKey), 10 * 60 * 1000);

    return packs;
  }

  /**
   * Get team configuration
   * @param {string} teamId - Team identifier
   * @returns {Promise<Object|null>} Team configuration or null
   */
  async getTeamConfig(teamId) {
    const cacheKey = `team:${teamId}`;

    if (this._pathCache.has(cacheKey)) {
      return this._pathCache.get(cacheKey);
    }

    const teamPath = path.join(this.getBmadCorePath(), 'agent-teams', `${teamId}.yaml`);

    if (await fs.pathExists(teamPath)) {
      try {
        const yaml = require('js-yaml');
        const content = await fs.readFile(teamPath, 'utf8');
        const config = yaml.load(content);
        this._pathCache.set(cacheKey, config);
        return config;
      } catch {
        return null;
      }
    }

    return null;
  }

  /**
   * Get resource dependencies for an agent
   * @param {string} agentId - Agent identifier
   * @returns {Promise<Object>} Dependencies object
   */
  async getAgentDependencies(agentId) {
    const cacheKey = `deps:${agentId}`;

    if (this._pathCache.has(cacheKey)) {
      return this._pathCache.get(cacheKey);
    }

    const agentPath = await this.getAgentPath(agentId);
    if (!agentPath) {
      return { all: [], byType: {} };
    }

    const content = await fs.readFile(agentPath, 'utf8');
    const { extractYamlFromAgent } = require('../../lib/yaml-utils');
    const yamlContent = extractYamlFromAgent(content);

    if (!yamlContent) {
      return { all: [], byType: {} };
    }

    try {
      const yaml = require('js-yaml');
      const metadata = yaml.load(yamlContent);
      const dependencies = metadata.dependencies || {};

      // Flatten dependencies
      const allDeps = [];
      const byType = {};

      for (const [type, deps] of Object.entries(dependencies)) {
        if (Array.isArray(deps)) {
          byType[type] = deps;
          for (const dep of deps) {
            allDeps.push(`.bmad-core/${type}/${dep}`);
          }
        }
      }

      const result = { all: allDeps, byType };
      this._pathCache.set(cacheKey, result);
      return result;
    } catch {
      return { all: [], byType: {} };
    }
  }

  /**
   * Clear all caches to free memory
   */
  clearCache() {
    this._pathCache.clear();
    this._globCache.clear();
  }

  /**
   * Get IDE configuration
   * @param {string} ideId - IDE identifier
   * @returns {Promise<Object|null>} IDE configuration or null
   */
  async getIdeConfig(ideId) {
    const cacheKey = `ide:${ideId}`;

    if (this._pathCache.has(cacheKey)) {
      return this._pathCache.get(cacheKey);
    }

    const idePath = path.join(this.getBmadCorePath(), 'ide-rules', `${ideId}.yaml`);

    if (await fs.pathExists(idePath)) {
      try {
        const yaml = require('js-yaml');
        const content = await fs.readFile(idePath, 'utf8');
        const config = yaml.load(content);
        this._pathCache.set(cacheKey, config);
        return config;
      } catch {
        return null;
      }
    }

    return null;
  }
}

// Singleton instance
const resourceLocator = new ResourceLocator();

module.exports = resourceLocator;
