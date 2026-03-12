const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');

/**
 * Claude Code IDE setup handler for WDS
 */
class ClaudeCodeSetup extends BaseIdeSetup {
  constructor() {
    super('claude-code', 'Claude Code', true); // preferred IDE
    this.configDir = '.claude/skills';
  }

  /**
   * Setup Claude Code IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} wdsDir - WDS installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, wdsDir, options = {}) {
    // Get all WDS agents
    const agents = await this.getAgents(wdsDir);

    if (agents.length === 0) {
      throw new Error('No agents found in WDS installation');
    }

    // Create launcher file for each agent in .claude/skills/{slug}/SKILL.md
    const skillsDir = path.join(projectDir, this.configDir);
    let agentCount = 0;
    for (const agent of agents) {
      // Create launcher content that references the compiled agent
      const launcher = this.formatAgentLauncher(agent.name, agent.path);

      // Add Claude Code-specific YAML frontmatter
      const content = this.processContent(launcher, agent.metadata);

      // Write launcher file as .claude/skills/{slug}/SKILL.md
      const agentDir = path.join(skillsDir, agent.slug);
      await this.ensureDir(agentDir);
      const filePath = path.join(agentDir, 'SKILL.md');
      await this.writeFile(filePath, content);
      agentCount++;
    }

    if (options.logger) {
      options.logger.log(chalk.dim(`    - ${agentCount} agent(s) configured for Claude Code`));
    }

    return {
      success: true,
      agents: agentCount,
    };
  }

  /**
   * Process content with Claude Code-specific YAML frontmatter
   * @param {string} content - Launcher content
   * @param {Object} metadata - Agent metadata
   * @returns {string} Processed content with Claude Code YAML frontmatter
   */
  processContent(content, metadata = {}) {
    // Strip any existing frontmatter from launcher
    const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
    const contentWithoutFrontmatter = content.replace(frontmatterRegex, '');

    const name = metadata.name || 'WDS Agent';
    const description = metadata.description || 'Agent';

    // Create Claude Code YAML metadata header
    const yamlHeader = `---
name: ${name}
description: ${description}
---

`;

    return yamlHeader + contentWithoutFrontmatter;
  }

  /**
   * Cleanup Claude Code WDS configuration
   * @param {string} projectDir - Project directory
   */
  async cleanup(projectDir) {
    // Remove per-agent skill directories
    const agents = ['saga', 'freya'];
    for (const slug of agents) {
      const skillPath = path.join(projectDir, this.configDir, slug);
      if (await this.exists(skillPath)) {
        await this.remove(skillPath);
      }
    }

    // Also clean up legacy .claude/skills/wds/ if present
    const legacyPath = path.join(projectDir, '.claude/skills/wds');
    if (await this.exists(legacyPath)) {
      await this.remove(legacyPath);
      console.log(chalk.dim(`Removed legacy Claude Code WDS configuration`));
    }
  }

  /**
   * Detect if Claude Code is configured in project
   * @param {string} projectDir - Project directory
   * @returns {boolean}
   */
  async detect(projectDir) {
    return await this.exists(path.join(projectDir, '.claude'));
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

module.exports = { ClaudeCodeSetup };
