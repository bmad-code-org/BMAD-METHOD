const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');

/**
 * Cline IDE setup handler for WDS
 */
class ClineSetup extends BaseIdeSetup {
  constructor() {
    super('cline', 'Cline', false);
    this.configDir = '.cline';
  }

  /**
   * Setup Cline IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} wdsDir - WDS installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, wdsDir, options = {}) {
    // Create .cline directory
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

      // Add Cline-specific formatting (flat markdown, no frontmatter)
      const content = this.processContent(launcher, agent.metadata);

      // Write launcher file
      const filePath = path.join(targetDir, `${agent.slug}.md`);
      await this.writeFile(filePath, content);
      agentCount++;
    }

    if (options.logger) {
      options.logger.log(chalk.dim(`    - ${agentCount} agent(s) configured for Cline`));
    }

    return {
      success: true,
      agents: agentCount,
    };
  }

  /**
   * Process content with Cline-specific formatting
   * Cline uses flat markdown with no frontmatter
   * @param {string} content - Launcher content
   * @param {Object} metadata - Agent metadata
   * @returns {string} Processed content without frontmatter
   */
  processContent(content, metadata = {}) {
    // Strip any existing frontmatter from launcher
    const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
    const contentWithoutFrontmatter = content.replace(frontmatterRegex, '');

    // Add title header for Cline
    const title = metadata.name ? `${metadata.name} - ${metadata.description}` : metadata.description || 'WDS Agent';

    return `# ${title}

${contentWithoutFrontmatter}`;
  }

  /**
   * Cleanup Cline WDS configuration
   * @param {string} projectDir - Project directory
   */
  async cleanup(projectDir) {
    const wdsPath = path.join(projectDir, this.configDir);

    if (await this.exists(wdsPath)) {
      // Only remove WDS agent files, not entire .cline directory
      const agents = ['saga.md', 'freya.md'];
      for (const agentFile of agents) {
        const filePath = path.join(wdsPath, agentFile);
        if (await this.exists(filePath)) {
          await this.removeFile(filePath);
        }
      }
      console.log(chalk.dim(`Removed Cline WDS configuration`));
    }
  }

  /**
   * Detect if Cline is configured in project
   * @param {string} projectDir - Project directory
   * @returns {boolean}
   */
  async detect(projectDir) {
    return await this.exists(path.join(projectDir, '.cline'));
  }

  /**
   * Remove file helper
   * @param {string} filePath - File to remove
   */
  async removeFile(filePath) {
    const fs = require('fs-extra');
    await fs.remove(filePath);
  }
}

module.exports = { ClineSetup };
