const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');

/**
 * Roo Code IDE setup handler for WDS
 */
class RooSetup extends BaseIdeSetup {
  constructor() {
    super('roo', 'Roo Code', false);
    this.configDir = '.roo/commands/wds';
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
name: ${metadata.name || 'WDS Agent'}
description: ${metadata.description || 'Agent'}
---

${content}`;
  }

  async detect(projectDir) {
    return await this.exists(path.join(projectDir, '.roo'));
  }
}

module.exports = { RooSetup };
