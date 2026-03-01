const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');

/**
 * Qwen Code setup handler for WDS
 * Uses TOML format for commands
 */
class QwenSetup extends BaseIdeSetup {
  constructor() {
    super('qwen', 'Qwen Code', false);
    this.configDir = '.qwen/commands/wds';
  }

  async setup(projectDir, wdsDir, options = {}) {
    const targetDir = path.join(projectDir, this.configDir);
    await this.ensureDir(targetDir);

    const agents = await this.getAgents(wdsDir);
    if (agents.length === 0) throw new Error('No agents found in WDS installation');

    for (const agent of agents) {
      const launcher = this.formatAgentLauncher(agent.name, agent.path);
      const content = this.processContent(launcher, agent.metadata);
      await this.writeFile(path.join(targetDir, `${agent.slug}.toml`), content);
    }

    return { success: true, agents: agents.length };
  }

  processContent(content, metadata = {}) {
    const description = metadata.name ?
      `${metadata.name} - ${metadata.description}` :
      metadata.description || 'WDS Agent';

    // Escape content for TOML multi-line string
    const escapedContent = content.replaceAll('"""', String.raw`\"\"\"`);

    return `description = "${description}"

[prompt]
text = """
${escapedContent}
"""
`;
  }

  async detect(projectDir) {
    return await this.exists(path.join(projectDir, '.qwen'));
  }
}

module.exports = { QwenSetup };
