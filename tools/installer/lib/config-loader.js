const fs = require('fs-extra');
const path = require('node:path');
const yaml = require('js-yaml');
const { extractYamlFromAgent } = require('../../lib/yaml-utils');

class ConfigLoader {
  constructor() {
    this.configPath = path.join(__dirname, '..', 'config', 'install.config.yaml');
    this.config = null;
  }

  async load() {
    if (this.config) return this.config;

    try {
      const configContent = await fs.readFile(this.configPath, 'utf8');
      this.config = yaml.load(configContent);
      return this.config;
    } catch (error) {
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
  }

  async getInstallationOptions() {
    const config = await this.load();
    return config['installation-options'] || {};
  }

  async getAvailableAgents() {
    const agentsDir = path.join(this.getBmadCorePath(), 'agents');

    try {
      const entries = await fs.readdir(agentsDir, { withFileTypes: true });
      const agents = [];

      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
          const agentPath = path.join(agentsDir, entry.name);
          const agentId = path.basename(entry.name, '.md');

          try {
            const agentContent = await fs.readFile(agentPath, 'utf8');

            // Extract YAML block from agent file
            const yamlContentText = extractYamlFromAgent(agentContent);
            if (yamlContentText) {
              const yamlContent = yaml.load(yamlContentText);
              const agentConfig = yamlContent.agent || {};

              agents.push({
                id: agentId,
                name: agentConfig.title || agentConfig.name || agentId,
                file: `bmad-core/agents/${entry.name}`,
                description: agentConfig.whenToUse || 'No description available',
              });
            }
          } catch (error) {
            console.warn(`Failed to read agent ${entry.name}: ${error.message}`);
          }
        }
      }

      // Sort agents by name for consistent display
      agents.sort((a, b) => a.name.localeCompare(b.name));

      return agents;
    } catch (error) {
      console.warn(`Failed to read agents directory: ${error.message}`);
      return [];
    }
  }

  async getAvailableExpansionPacks() {
    const expansionPacksDir = path.join(this.getBmadCorePath(), '..', 'expansion-packs');

    try {
      const entries = await fs.readdir(expansionPacksDir, { withFileTypes: true });
      const expansionPacks = [];

      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          const packPath = path.join(expansionPacksDir, entry.name);
          const configPath = path.join(packPath, 'config.yaml');

          try {
            // Read config.yaml
            const configContent = await fs.readFile(configPath, 'utf8');
            const config = yaml.load(configContent);

            expansionPacks.push({
              id: entry.name,
              name: config.name || entry.name,
              description:
                config['short-title'] || config.description || 'No description available',
              fullDescription:
                config.description || config['short-title'] || 'No description available',
              version: config.version || '1.0.0',
              author: config.author || 'BMad Team',
              packPath: packPath,
              dependencies: config.dependencies?.agents || [],
            });
          } catch (error) {
            // Fallback if config.yaml doesn't exist or can't be read
            console.warn(
              `Failed to read config for expansion pack ${entry.name}: ${error.message}`,
            );

            // Try to derive info from directory name as fallback
            const name = entry.name
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            expansionPacks.push({
              id: entry.name,
              name: name,
              description: 'No description available',
              fullDescription: 'No description available',
              version: '1.0.0',
              author: 'BMad Team',
              packPath: packPath,
              dependencies: [],
            });
          }
        }
      }

      return expansionPacks;
    } catch (error) {
      console.warn(`Failed to read expansion packs directory: ${error.message}`);
      return [];
    }
  }

  async getAgentDependencies(agentId) {
    // Use DependencyResolver to dynamically parse agent dependencies
    const DependencyResolver = require('../../lib/dependency-resolver');
    const resolver = new DependencyResolver(path.join(__dirname, '..', '..', '..'));

    const agentDeps = await resolver.resolveAgentDependencies(agentId);

    // Convert to flat list of file paths
    const depPaths = [];

    // Core files and utilities are included automatically by DependencyResolver

    // Add agent file itself is already handled by installer

    // Add all resolved resources
    for (const resource of agentDeps.resources) {
      const filePath = `.bmad-core/${resource.type}/${resource.id}.md`;
      if (!depPaths.includes(filePath)) {
        depPaths.push(filePath);
      }
    }

    return depPaths;
  }

  async getIdeConfiguration(ide) {
    const config = await this.load();
    const ideConfigs = config['ide-configurations'] || {};
    return ideConfigs[ide] || null;
  }

  getBmadCorePath() {
    // Get the path to bmad-core relative to the installer (now under tools)
    return path.join(__dirname, '..', '..', '..', 'bmad-core');
  }

  getDistPath() {
    // Get the path to dist directory relative to the installer
    return path.join(__dirname, '..', '..', '..', 'dist');
  }

  getAgentPath(agentId) {
    return path.join(this.getBmadCorePath(), 'agents', `${agentId}.md`);
  }

  async getAvailableTeams() {
    const teamsDir = path.join(this.getBmadCorePath(), 'agent-teams');

    try {
      const entries = await fs.readdir(teamsDir, { withFileTypes: true });
      const teams = [];

      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.yaml')) {
          const teamPath = path.join(teamsDir, entry.name);

          try {
            const teamContent = await fs.readFile(teamPath, 'utf8');
            const teamConfig = yaml.load(teamContent);

            if (teamConfig.bundle) {
              teams.push({
                id: path.basename(entry.name, '.yaml'),
                name: teamConfig.bundle.name || entry.name,
                description: teamConfig.bundle.description || 'Team configuration',
                icon: teamConfig.bundle.icon || '📋',
              });
            }
          } catch (error) {
            console.warn(`Warning: Could not load team config ${entry.name}: ${error.message}`);
          }
        }
      }

      return teams;
    } catch (error) {
      console.warn(`Warning: Could not scan teams directory: ${error.message}`);
      return [];
    }
  }

  getTeamPath(teamId) {
    return path.join(this.getBmadCorePath(), 'agent-teams', `${teamId}.yaml`);
  }

  async getTeamDependencies(teamId) {
    // Use DependencyResolver to dynamically parse team dependencies
    const DependencyResolver = require('../../lib/dependency-resolver');
    const resolver = new DependencyResolver(path.join(__dirname, '..', '..', '..'));

    try {
      const teamDeps = await resolver.resolveTeamDependencies(teamId);

      // Convert to flat list of file paths
      const depPaths = [];

      // Add team config file
      depPaths.push(`.bmad-core/agent-teams/${teamId}.yaml`);

      // Add all agents
      for (const agent of teamDeps.agents) {
        const filePath = `.bmad-core/agents/${agent.id}.md`;
        if (!depPaths.includes(filePath)) {
          depPaths.push(filePath);
        }
      }

      // Add all resolved resources
      for (const resource of teamDeps.resources) {
        const filePath = `.bmad-core/${resource.type}/${resource.id}.${resource.type === 'workflows' ? 'yaml' : 'md'}`;
        if (!depPaths.includes(filePath)) {
          depPaths.push(filePath);
        }
      }

      return depPaths;
    } catch (error) {
      throw new Error(`Failed to resolve team dependencies for ${teamId}: ${error.message}`);
    }
  }
}

module.exports = new ConfigLoader();
