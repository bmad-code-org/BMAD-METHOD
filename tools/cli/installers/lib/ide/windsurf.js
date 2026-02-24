const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');

/**
 * Windsurf IDE setup handler for WDS
 */
class WindsurfSetup extends BaseIdeSetup {
  constructor() {
    super('windsurf', 'Windsurf', true); // preferred IDE
    this.configDir = '.windsurf/workflows/wds';
  }

  /**
   * Setup Windsurf IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} wdsDir - WDS installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, wdsDir, options = {}) {
    // Create .windsurf/workflows/wds directory
    const targetDir = path.join(projectDir, this.configDir);
    await this.ensureDir(targetDir);

    // Get all WDS agents
    const agents = await this.getAgents(wdsDir);

    if (agents.length === 0) {
      throw new Error('No agents found in WDS installation');
    }

    // Create launcher file for each agent
    let agentCount = 0;
    for (const agent of agents) {
      // Create launcher content that references the compiled agent
      const launcher = this.formatAgentLauncher(agent.name, agent.path);

      // Add Windsurf-specific frontmatter
      const content = this.processContent(launcher, agent.metadata);

      // Write launcher file
      const filePath = path.join(targetDir, `${agent.slug}.md`);
      await this.writeFile(filePath, content);
      agentCount++;
    }

    if (options.logger) {
      options.logger.log(chalk.dim(`    - ${agentCount} agent(s) configured for Windsurf`));
    }

    return {
      success: true,
      agents: agentCount,
    };
  }

  /**
   * Process content with Windsurf-specific frontmatter
   * @param {string} content - Launcher content
   * @param {Object} metadata - Agent metadata
   * @returns {string} Processed content with Windsurf YAML frontmatter
   */
  processContent(content, metadata = {}) {
    const description = metadata.name ?
      `${metadata.name} - ${metadata.description}` :
      metadata.description || 'WDS Agent';

    return `---
description: ${description}
auto_execution_mode: 3
---

${content}`;
  }

  /**
   * Cleanup Windsurf WDS configuration
   * @param {string} projectDir - Project directory
   */
  async cleanup(projectDir) {
    const wdsPath = path.join(projectDir, this.configDir);

    if (await this.exists(wdsPath)) {
      await this.remove(wdsPath);
      console.log(chalk.dim(`Removed Windsurf WDS configuration`));
    }
  }

  /**
   * Detect if Windsurf is configured in project
   * @param {string} projectDir - Project directory
   * @returns {boolean}
   */
  async detect(projectDir) {
    return await this.exists(path.join(projectDir, '.windsurf'));
  }

  /**
   * Remove directory helper
   * @param {string} dirPath - Directory to remove
   */
  async remove(dirPath) {
    const fs = require('fs-extra');
    await fs.remove(dirPath);
  }
}

module.exports = { WindsurfSetup };
