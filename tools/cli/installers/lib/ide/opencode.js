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
    const commandsBaseDir = path.join(baseDir, this.commandsDir);
    const agentsBaseDir = path.join(baseDir, this.agentsDir);

    await this.ensureDir(agentsBaseDir);
    await this.ensureDir(commandsBaseDir);

    // Install primary agents with flat naming: bmad-agent-{module}-{name}.md
    const agents = await getAgentsFromBmad(bmadDir, options.selectedModules || []);

    let agentCount = 0;
    for (const agent of agents) {
      const processed = await this.readAndProcess(agent.path, {
        module: agent.module,
        name: agent.name,
      });

      const agentContent = this.createAgentContent(processed, agent);
      // Flat structure in command folder: bmad-agent-{module}-{name}.md
      const targetPath = path.join(agentsBaseDir, `bmad-agent-${agent.module}-${agent.name}.md`);
      await this.writeFile(targetPath, agentContent);
      agentCount++;
    }

    // Install workflow commands with flat naming: bmad-workflow-{module}-{name}.md
    const workflowGenerator = new WorkflowCommandGenerator();
    const { artifacts: workflowArtifacts, counts: workflowCounts } = await workflowGenerator.collectWorkflowArtifacts(bmadDir);

    let workflowCommandCount = 0;
    for (const artifact of workflowArtifacts) {
      if (artifact.type === 'workflow-command') {
        const commandContent = artifact.content;
        // Flat structure: bmad-workflow-{module}-{name}.md
        // artifact.relativePath is like: bmm/workflows/plan-project.md
        const workflowName = path.basename(artifact.relativePath, '.md');
        const targetPath = path.join(commandsBaseDir, `bmad-workflow-${artifact.module}-${workflowName}.md`);
        await this.writeFile(targetPath, commandContent);
        workflowCommandCount++;
      }
      // Skip workflow launcher READMEs as they're not needed in flat structure
    }

    // Install task and tool commands with flat naming
    const { tasks, tools } = await this.generateFlatTaskToolCommands(bmadDir, commandsBaseDir);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${agentCount} agents installed to .opencode/command/`));
    if (workflowCommandCount > 0) {
      console.log(chalk.dim(`  - ${workflowCommandCount} workflows installed to .opencode/command/`));
    }
    if (tasks + tools > 0) {
      console.log(chalk.dim(`  - ${tasks + tools} tasks/tools installed to .opencode/command/ (${tasks} tasks, ${tools} tools)`));
    }

    return {
      success: true,
      agents: agentCount,
      workflows: workflowCommandCount,
      workflowCounts,
    };
  }

  /**
   * Generate flat task and tool commands for OpenCode
   * OpenCode doesn't support nested command directories
   */
  async generateFlatTaskToolCommands(bmadDir, commandsBaseDir) {
    const taskToolGen = new TaskToolCommandGenerator();
    const tasks = await taskToolGen.loadTaskManifest(bmadDir);
    const tools = await taskToolGen.loadToolManifest(bmadDir);

    // Filter to only standalone items
    const standaloneTasks = tasks ? tasks.filter((t) => t.standalone === 'true' || t.standalone === true) : [];
    const standaloneTools = tools ? tools.filter((t) => t.standalone === 'true' || t.standalone === true) : [];

    // Generate command files for tasks with flat naming: bmad-task-{module}-{name}.md
    for (const task of standaloneTasks) {
      const commandContent = taskToolGen.generateCommandContent(task, 'task');
      const targetPath = path.join(commandsBaseDir, `bmad-task-${task.module}-${task.name}.md`);
      await this.writeFile(targetPath, commandContent);
    }

    // Generate command files for tools with flat naming: bmad-tool-{module}-{name}.md
    for (const tool of standaloneTools) {
      const commandContent = taskToolGen.generateCommandContent(tool, 'tool');
      const targetPath = path.join(commandsBaseDir, `bmad-tool-${tool.module}-${tool.name}.md`);
      await this.writeFile(targetPath, commandContent);
    }

    return {
      tasks: standaloneTasks.length,
      tools: standaloneTools.length,
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
