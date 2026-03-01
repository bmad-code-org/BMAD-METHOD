const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');

/**
 * Kiro CLI setup handler for WDS
 * Creates JSON config + markdown prompt files
 */
class KiroCliSetup extends BaseIdeSetup {
  constructor() {
    super('kiro-cli', 'Kiro CLI', false);
    this.configDir = '.kiro/agents/wds';
  }

  async setup(projectDir, wdsDir, options = {}) {
    const targetDir = path.join(projectDir, this.configDir);
    await this.ensureDir(targetDir);

    const agents = await this.getAgents(wdsDir);
    if (agents.length === 0) throw new Error('No agents found in WDS installation');

    for (const agent of agents) {
      const launcher = this.formatAgentLauncher(agent.name, agent.path);

      // Write JSON config
      const jsonConfig = {
        name: agent.metadata.name || agent.slug,
        description: agent.metadata.description || 'WDS Agent',
        prompt: `./${agent.slug}-prompt.md`,
      };
      await this.writeFile(path.join(targetDir, `${agent.slug}.json`), JSON.stringify(jsonConfig, null, 2));

      // Write markdown prompt
      await this.writeFile(path.join(targetDir, `${agent.slug}-prompt.md`), launcher);
    }

    return { success: true, agents: agents.length };
  }

  async detect(projectDir) {
    return await this.exists(path.join(projectDir, '.kiro'));
  }
}

module.exports = { KiroCliSetup };
