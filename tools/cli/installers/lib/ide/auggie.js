const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');

/**
 * Auggie CLI setup handler for WDS
 */
class AuggieSetup extends BaseIdeSetup {
  constructor() {
    super('auggie', 'Auggie CLI', false);
    this.configDir = '.augment/commands/wds';
  }

  async setup(projectDir, wdsDir, options = {}) {
    const targetDir = path.join(projectDir, this.configDir);
    await this.ensureDir(targetDir);

    const agents = await this.getAgents(wdsDir);
    if (agents.length === 0) throw new Error('No agents found in WDS installation');

    for (const agent of agents) {
      const launcher = this.formatAgentLauncher(agent.name, agent.path);
      const content = this.processContent(launcher, agent.metadata);
      await this.writeFile(path.join(targetDir, `${agent.slug}.md`), content);
    }

    return { success: true, agents: agents.length };
  }

  processContent(content, metadata = {}) {
    return `---
description: ${metadata.name || 'WDS Agent'} - ${metadata.description || 'Agent'}
---

${content}`;
  }

  async detect(projectDir) {
    return await this.exists(path.join(projectDir, '.augment'));
  }
}

module.exports = { AuggieSetup };
