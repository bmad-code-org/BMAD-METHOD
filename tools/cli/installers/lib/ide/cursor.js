const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');

/**
 * Cursor IDE setup handler for WDS
 */
class CursorSetup extends BaseIdeSetup {
  constructor() {
    super('cursor', 'Cursor', true); // preferred IDE
    this.configDir = '.cursor/rules/wds';
  }

  /**
   * Setup Cursor IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} wdsDir - WDS installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, wdsDir, options = {}) {
    // Create .cursor/rules/wds directory
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

      // Add Cursor-specific MDC frontmatter
      const content = this.processContent(launcher, agent.metadata);

      // Write launcher file with .mdc extension
      const filePath = path.join(targetDir, `${agent.slug}.mdc`);
      await this.writeFile(filePath, content);
      agentCount++;
    }

    if (options.logger) {
      options.logger.log(chalk.dim(`    - ${agentCount} agent(s) configured for Cursor`));
    }

    return {
      success: true,
      agents: agentCount,
    };
  }

  /**
   * Process content with Cursor-specific MDC frontmatter
   * @param {string} content - Launcher content
   * @param {Object} metadata - Agent metadata
   * @returns {string} Processed content with Cursor MDC frontmatter
   */
  processContent(content, metadata = {}) {
    // Strip any existing frontmatter from launcher
    const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
    const contentWithoutFrontmatter = content.replace(frontmatterRegex, '');

    const description = metadata.name ?
      `WDS Agent: ${metadata.name} - ${metadata.description}` :
      `WDS Agent: ${metadata.description || 'Agent'}`;

    // Create Cursor MDC metadata header
    const mdcHeader = `---
description: ${description}
globs:
alwaysApply: false
---

`;

    return mdcHeader + contentWithoutFrontmatter;
  }

  /**
   * Cleanup Cursor WDS configuration
   * @param {string} projectDir - Project directory
   */
  async cleanup(projectDir) {
    const wdsPath = path.join(projectDir, this.configDir);

    if (await this.exists(wdsPath)) {
      await this.remove(wdsPath);
      console.log(chalk.dim(`Removed Cursor WDS configuration`));
    }
  }

  /**
   * Detect if Cursor is configured in project
   * @param {string} projectDir - Project directory
   * @returns {boolean}
   */
  async detect(projectDir) {
    return await this.exists(path.join(projectDir, '.cursor'));
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

module.exports = { CursorSetup };
