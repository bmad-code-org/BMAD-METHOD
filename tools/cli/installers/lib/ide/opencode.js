const path = require('node:path');
const fs = require('fs-extra');
const os = require('node:os');
const chalk = require('chalk');
const yaml = require('js-yaml');
const { BaseIdeSetup } = require('./_base-ide');
const { WorkflowCommandGenerator } = require('./workflow-command-generator');
const { TaskToolCommandGenerator } = require('./task-tool-command-generator');

const { getAgentsFromBmad } = require('./shared/bmad-artifacts');

/**
 * OpenCode IDE setup handler
 */
class OpenCodeSetup extends BaseIdeSetup {
  constructor() {
    super('opencode', 'OpenCode', true); // Mark as preferred/recommended
    this.configDir = '.opencode';
    this.commandsDir = 'command';
    this.agentsDir = 'agent';
  }

  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    const baseDir = path.join(projectDir, this.configDir);
    const agentsBaseDir = path.join(baseDir, this.agentsDir, 'bmad');
    const commandsBaseDir = path.join(baseDir, this.commandsDir, 'bmad');

    await this.ensureDir(agentsBaseDir);
    await this.ensureDir(commandsBaseDir);

    // Install primary agents
    const agents = await getAgentsFromBmad(bmadDir, options.selectedModules || []);
    const modules = new Set(agents.map((agent) => agent.module));

    for (const module of modules) {
      await this.ensureDir(path.join(agentsBaseDir, module));
    }

    let agentCount = 0;
    for (const agent of agents) {
      const processed = await this.readAndProcess(agent.path, {
        module: agent.module,
        name: agent.name,
      });

      const agentContent = this.createAgentContent(processed, agent);
      const targetPath = path.join(agentsBaseDir, agent.module, `${agent.name}.md`);
      await this.writeFile(targetPath, agentContent);
      agentCount++;
    }

    // Install workflow commands
    const workflowGenerator = new WorkflowCommandGenerator();
    const { artifacts: workflowArtifacts, counts: workflowCounts } = await workflowGenerator.collectWorkflowArtifacts(bmadDir);

    let workflowCommandCount = 0;
    for (const artifact of workflowArtifacts) {
      // Workflow artifacts already have proper frontmatter from the template
      // No need to wrap with additional frontmatter
      const commandContent = artifact.content;
      const targetPath = path.join(commandsBaseDir, artifact.relativePath);
      await this.writeFile(targetPath, commandContent);
      workflowCommandCount++;
    }

    // Install task and tool commands
    const taskToolGen = new TaskToolCommandGenerator();
    const taskToolResult = await taskToolGen.generateTaskToolCommands(projectDir, bmadDir, commandsBaseDir);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${agentCount} agents installed to .opencode/agent/bmad/`));
    if (workflowCommandCount > 0) {
      console.log(chalk.dim(`  - ${workflowCommandCount} workflow commands generated to .opencode/command/bmad/`));
    }
    if (taskToolResult.generated > 0) {
      console.log(
        chalk.dim(
          `  - ${taskToolResult.generated} task/tool commands generated (${taskToolResult.tasks} tasks, ${taskToolResult.tools} tools)`,
        ),
      );
    }

    return {
      success: true,
      agents: agentCount,
      workflows: workflowCommandCount,
      workflowCounts,
    };
  }

  async readAndProcess(filePath, metadata) {
    const content = await fs.readFile(filePath, 'utf8');
    return this.processContent(content, metadata);
  }

  createAgentContent(content, metadata) {
    const { frontmatter = {}, body } = this.parseFrontmatter(content);

    frontmatter.description =
      frontmatter.description && String(frontmatter.description).trim().length > 0
        ? frontmatter.description
        : `BMAD ${metadata.module} agent: ${metadata.name}`;

    // OpenCode agents use: 'primary' mode for main agents
    frontmatter.mode = 'primary';

    const frontmatterString = this.stringifyFrontmatter(frontmatter);

    return `${frontmatterString}\n${body}`;
  }

  parseFrontmatter(content) {
    const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
    if (!match) {
      return { data: {}, body: content };
    }

    const body = content.slice(match[0].length);

    let frontmatter = {};
    try {
      frontmatter = yaml.load(match[1]) || {};
    } catch {
      frontmatter = {};
    }

    return { frontmatter, body };
  }

  stringifyFrontmatter(frontmatter) {
    const yamlText = yaml
      .dump(frontmatter, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        sortKeys: false,
      })
      .trimEnd();

    return `---\n${yamlText}\n---`;
  }
}

module.exports = { OpenCodeSetup };
