/**
 * Base IDE Setup - Common functionality for all IDE setups
 * Reduces duplication and provides shared methods
 */

const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const chalk = require('chalk').default || require('chalk');
const fileManager = require('./file-manager');
const resourceLocator = require('./resource-locator');
const { extractYamlFromAgent } = require('../../lib/yaml-utils');

class BaseIdeSetup {
  constructor() {
    this._agentCache = new Map();
    this._pathCache = new Map();
  }

  /**
   * Get all agent IDs with caching
   */
  async getAllAgentIds(installDir) {
    const cacheKey = `all-agents:${installDir}`;
    if (this._agentCache.has(cacheKey)) {
      return this._agentCache.get(cacheKey);
    }

    const allAgents = new Set();

    // Get core agents
    const coreAgents = await this.getCoreAgentIds(installDir);
    for (const id of coreAgents) allAgents.add(id);

    // Get expansion pack agents
    const expansionPacks = await this.getInstalledExpansionPacks(installDir);
    for (const pack of expansionPacks) {
      const packAgents = await this.getExpansionPackAgents(pack.path);
      for (const id of packAgents) allAgents.add(id);
    }

    const result = [...allAgents];
    this._agentCache.set(cacheKey, result);
    return result;
  }

  /**
   * Get core agent IDs
   */
  async getCoreAgentIds(installDir) {
    const coreAgents = [];
    const corePaths = [
      path.join(installDir, '.bmad-core', 'agents'),
      path.join(installDir, 'bmad-core', 'agents'),
    ];

    for (const agentsDir of corePaths) {
      if (await fileManager.pathExists(agentsDir)) {
        const files = await resourceLocator.findFiles('*.md', { cwd: agentsDir });
        coreAgents.push(...files.map((file) => path.basename(file, '.md')));
        break; // Use first found
      }
    }

    return coreAgents;
  }

  /**
   * Find agent path with caching
   */
  async findAgentPath(agentId, installDir) {
    const cacheKey = `agent-path:${agentId}:${installDir}`;
    if (this._pathCache.has(cacheKey)) {
      return this._pathCache.get(cacheKey);
    }

    // Use resource locator for efficient path finding
    let agentPath = await resourceLocator.getAgentPath(agentId);

    if (!agentPath) {
      // Check installation-specific paths
      const possiblePaths = [
        path.join(installDir, '.bmad-core', 'agents', `${agentId}.md`),
        path.join(installDir, 'bmad-core', 'agents', `${agentId}.md`),
        path.join(installDir, 'common', 'agents', `${agentId}.md`),
      ];

      for (const testPath of possiblePaths) {
        if (await fileManager.pathExists(testPath)) {
          agentPath = testPath;
          break;
        }
      }
    }

    if (agentPath) {
      this._pathCache.set(cacheKey, agentPath);
    }
    return agentPath;
  }

  /**
   * Get agent title from metadata
   */
  async getAgentTitle(agentId, installDir) {
    const agentPath = await this.findAgentPath(agentId, installDir);
    if (!agentPath) return agentId;

    try {
      const content = await fileManager.readFile(agentPath);
      const yamlContent = extractYamlFromAgent(content);
      if (yamlContent) {
        const metadata = yaml.load(yamlContent);
        return metadata.agent_name || agentId;
      }
    } catch {
      // Fallback to agent ID
    }
    return agentId;
  }

  /**
   * Get installed expansion packs
   */
  async getInstalledExpansionPacks(installDir) {
    const cacheKey = `expansion-packs:${installDir}`;
    if (this._pathCache.has(cacheKey)) {
      return this._pathCache.get(cacheKey);
    }

    const expansionPacks = [];

    // Check for dot-prefixed expansion packs
    const dotExpansions = await resourceLocator.findFiles('.bmad-*', { cwd: installDir });

    for (const dotExpansion of dotExpansions) {
      if (dotExpansion !== '.bmad-core') {
        const packPath = path.join(installDir, dotExpansion);
        const packName = dotExpansion.slice(1); // remove the dot
        expansionPacks.push({
          name: packName,
          path: packPath,
        });
      }
    }

    // Check other dot folders that have config.yaml
    const allDotFolders = await resourceLocator.findFiles('.*', { cwd: installDir });
    for (const folder of allDotFolders) {
      if (!folder.startsWith('.bmad-') && folder !== '.bmad-core') {
        const packPath = path.join(installDir, folder);
        const configPath = path.join(packPath, 'config.yaml');
        if (await fileManager.pathExists(configPath)) {
          expansionPacks.push({
            name: folder.slice(1), // remove the dot
            path: packPath,
          });
        }
      }
    }

    this._pathCache.set(cacheKey, expansionPacks);
    return expansionPacks;
  }

  /**
   * Get expansion pack agents
   */
  async getExpansionPackAgents(packPath) {
    const agentsDir = path.join(packPath, 'agents');
    if (!(await fileManager.pathExists(agentsDir))) {
      return [];
    }

    const agentFiles = await resourceLocator.findFiles('*.md', { cwd: agentsDir });
    return agentFiles.map((file) => path.basename(file, '.md'));
  }

  /**
   * Create agent rule content (shared logic)
   */
  async createAgentRuleContent(agentId, agentPath, installDir, format = 'mdc') {
    const agentContent = await fileManager.readFile(agentPath);
    const agentTitle = await this.getAgentTitle(agentId, installDir);
    const yamlContent = extractYamlFromAgent(agentContent);

    let content = '';

    if (format === 'mdc') {
      // MDC format for Cursor
      content = '---\n';
      content += 'description: \n';
      content += 'globs: []\n';
      content += 'alwaysApply: false\n';
      content += '---\n\n';
      content += `# ${agentId.toUpperCase()} Agent Rule\n\n`;
      content += `This rule is triggered when the user types \`@${agentId}\` and activates the ${agentTitle} agent persona.\n\n`;
      content += '## Agent Activation\n\n';
      content +=
        'CRITICAL: Read the full YAML, start activation to alter your state of being, follow startup section instructions, stay in this being until told to exit this mode:\n\n';
      content += '```yaml\n';
      content += yamlContent || agentContent.replace(/^#.*$/m, '').trim();
      content += '\n```\n\n';
      content += '## File Reference\n\n';
      const relativePath = path.relative(installDir, agentPath).replaceAll('\\', '/');
      content += `The complete agent definition is available in [${relativePath}](mdc:${relativePath}).\n\n`;
      content += '## Usage\n\n';
      content += `When the user types \`@${agentId}\`, activate this ${agentTitle} persona and follow all instructions defined in the YAML configuration above.\n`;
    } else if (format === 'claude') {
      // Claude Code format
      content = `# /${agentId} Command\n\n`;
      content += `When this command is used, adopt the following agent persona:\n\n`;
      content += agentContent;
    }

    return content;
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this._agentCache.clear();
    this._pathCache.clear();
  }
}

module.exports = BaseIdeSetup;
