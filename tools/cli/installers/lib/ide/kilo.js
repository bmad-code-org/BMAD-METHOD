const path = require('node:path');
const fs = require('fs-extra');
const { BaseIdeSetup } = require('./_base-ide');

/**
 * Kilo Code setup handler for WDS
 * Appends agent modes to .kilocodemodes YAML file
 */
class KiloSetup extends BaseIdeSetup {
  constructor() {
    super('kilo', 'Kilo Code', false);
    this.configFile = '.kilocodemodes';
  }

  async setup(projectDir, wdsDir, options = {}) {
    const agents = await this.getAgents(wdsDir);
    if (agents.length === 0) throw new Error('No agents found in WDS installation');

    const filePath = path.join(projectDir, this.configFile);

    // Build modes content
    let modesContent = '\n# WDS Agent Modes\n';

    for (const agent of agents) {
      const launcher = this.formatAgentLauncher(agent.name, agent.path);

      modesContent += `\n- slug: wds-${agent.slug}`;
      modesContent += `\n  name: "${agent.metadata.name || agent.slug}"`;
      modesContent += `\n  roleDefinition: "${agent.metadata.description || 'WDS Agent'}"`;
      modesContent += `\n  customInstructions: |`;
      // Indent launcher content for YAML block
      const indented = launcher
        .split('\n')
        .map((line) => `    ${line}`)
        .join('\n');
      modesContent += `\n${indented}\n`;
    }

    if (await this.exists(filePath)) {
      // Append to existing file
      await fs.appendFile(filePath, modesContent);
    } else {
      // Create new file
      await this.writeFile(filePath, modesContent);
    }

    return { success: true, agents: agents.length };
  }

  async detect(projectDir) {
    return await this.exists(path.join(projectDir, this.configFile));
  }
}

module.exports = { KiloSetup };
