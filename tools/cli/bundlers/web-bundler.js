const path = require('node:path');
const fs = require('fs-extra');
const chalk = require('chalk');
const { XmlHandler } = require('../lib/xml-handler');

class WebBundler {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || path.resolve(__dirname, '../../..');
    this.modulesRoot = options.modulesRoot || path.join(this.projectRoot, 'src', 'modules');
    this.outputRoot = options.outputRoot || path.join(this.projectRoot, 'web-bundles');
    this.logger = options.logger || console;
    this.xmlHandler = new XmlHandler();
  }

  async listModules() {
    if (!(await fs.pathExists(this.modulesRoot))) {
      return [];
    }

    const entries = await fs.readdir(this.modulesRoot, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  }

  async listAgents(moduleName) {
    const agentsDir = path.join(this.modulesRoot, moduleName, 'agents');
    if (!(await fs.pathExists(agentsDir))) {
      return [];
    }

    const files = await this.findAgentFiles(agentsDir);
    return files.map((file) => path.basename(file, '.agent.yaml')).sort();
  }

  async list() {
    const modules = await this.listModules();

    if (modules.length === 0) {
      this.logger.log('No modules found.');
      return;
    }

    this.logger.log(chalk.cyan('Available modules and agents:'));
    for (const moduleName of modules) {
      const agents = await this.listAgents(moduleName);
      this.logger.log(`  ${moduleName}: ${agents.length} agent(s)`);
      for (const agent of agents) {
        this.logger.log(`    - ${agent}`);
      }
    }
  }

  async clean() {
    if (await fs.pathExists(this.outputRoot)) {
      await fs.remove(this.outputRoot);
    }
    this.logger.log(chalk.green('OK: Cleaned web-bundles output'));
  }

  async bundleAll() {
    const modules = await this.listModules();
    if (modules.length === 0) {
      this.logger.log('No modules found to bundle.');
      return;
    }

    await fs.ensureDir(this.outputRoot);
    for (const moduleName of modules) {
      await this.bundleModule(moduleName);
    }
  }

  async bundleModule(moduleName) {
    const moduleRoot = path.join(this.modulesRoot, moduleName);
    if (!(await fs.pathExists(moduleRoot))) {
      throw new Error(`Module not found: ${moduleName}`);
    }

    const agentsDir = path.join(moduleRoot, 'agents');
    if (!(await fs.pathExists(agentsDir))) {
      this.logger.log(chalk.yellow(`Skipping ${moduleName}: no agents directory`));
      return;
    }

    const outputModuleDir = path.join(this.outputRoot, moduleName, 'agents');
    await fs.remove(outputModuleDir);
    await fs.ensureDir(outputModuleDir);

    const agentFiles = await this.findAgentFiles(agentsDir);
    if (agentFiles.length === 0) {
      this.logger.log(chalk.yellow(`Skipping ${moduleName}: no agent files found`));
      return;
    }

    this.logger.log(chalk.cyan(`Bundling ${moduleName} (${agentFiles.length} agent(s))`));
    for (const agentFile of agentFiles) {
      await this.bundleAgentFile(moduleName, agentFile);
    }
  }

  async bundleAgentByName(moduleName, agentName) {
    const agentsDir = path.join(this.modulesRoot, moduleName, 'agents');
    if (!(await fs.pathExists(agentsDir))) {
      throw new Error(`Agents directory not found for module: ${moduleName}`);
    }

    const agentFiles = await this.findAgentFiles(agentsDir);
    const match = agentFiles.find((file) => path.basename(file, '.agent.yaml') === agentName);
    if (!match) {
      throw new Error(`Agent not found: ${moduleName}/${agentName}`);
    }

    const outputModuleDir = path.join(this.outputRoot, moduleName, 'agents');
    await fs.ensureDir(outputModuleDir);
    await this.bundleAgentFile(moduleName, match);
  }

  async bundleAgentFile(moduleName, agentFile) {
    const agentName = path.basename(agentFile, '.agent.yaml');
    const outputFile = path.join(this.outputRoot, moduleName, 'agents', `${agentName}.xml`);

    const bundled = await this.xmlHandler.buildFromYaml(agentFile, null, { forWebBundle: true });
    const xml = this.extractXmlBlock(bundled);

    await fs.writeFile(outputFile, xml, 'utf8');
    this.logger.log(chalk.green(`  OK: ${moduleName}/${agentName}`));
  }

  async findAgentFiles(rootDir) {
    const entries = await fs.readdir(rootDir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      const fullPath = path.join(rootDir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await this.findAgentFiles(fullPath)));
      } else if (entry.isFile() && entry.name.endsWith('.agent.yaml')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  extractXmlBlock(content) {
    const match = content.match(/```xml\s*([\s\S]*?)```/);
    if (!match) {
      return content.trim() + '\n';
    }
    return match[1].trim() + '\n';
  }
}

module.exports = { WebBundler };
