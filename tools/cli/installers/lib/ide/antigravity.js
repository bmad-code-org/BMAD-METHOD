const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');

/**
 * Antigravity IDE setup handler for WDS
 */
class AntigravitySetup extends BaseIdeSetup {
  constructor() {
    super('antigravity', 'Antigravity', false);
    this.configDir = '.agent/workflows/wds';
  }

  async setup(projectDir, wdsDir, options = {}) {
    const targetDir = path.join(projectDir, this.configDir);
    await this.ensureDir(targetDir);

    const agents = await this.getAgents(wdsDir);
    if (agents.length === 0) throw new Error('No agents found in WDS installation');

    for (const agent of agents) {
      const launcher = this.formatAgentLauncher(agent.name, agent.path);
      // Antigravity uses no frontmatter
      await this.writeFile(path.join(targetDir, `${agent.slug}.md`), launcher);
    }

    return { success: true, agents: agents.length };
  }

  async detect(projectDir) {
    return await this.exists(path.join(projectDir, '.agent'));
  }
}

module.exports = { AntigravitySetup };
