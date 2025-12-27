const path = require('node:path');
const fs = require('fs-extra');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');
const { WorkflowCommandGenerator } = require('./shared/workflow-command-generator');
const { getTasksFromBmad, getToolsFromBmad } = require('./shared/bmad-artifacts');

/**
 * Cursor IDE setup handler
 * Installs BMAD artifacts to .cursor/rules with flattened naming and MDC format
 */
class CursorSetup extends BaseIdeSetup {
  constructor() {
    super('cursor', 'Cursor', true); // preferred IDE
    this.configDir = '.cursor';
    this.rulesDir = 'rules';
  }

  /**
   * Setup Cursor IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Create .cursor/rules directory
    const cursorDir = path.join(projectDir, this.configDir);
    const rulesDir = path.join(cursorDir, this.rulesDir);

    await this.ensureDir(rulesDir);

    // Clear old BMAD files
    await this.clearBmadPrefixedFiles(rulesDir);

    // Collect all artifacts
    const { artifacts, counts } = await this.collectCursorArtifacts(projectDir, bmadDir, options);

    // Write flattened files
    const written = await this.writeFlattenedArtifacts(artifacts, rulesDir);

    // Create BMAD index file
    await this.createBMADIndex(rulesDir, counts);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${counts.agents} agents installed`));
    console.log(chalk.dim(`  - ${counts.tasks} tasks installed`));
    console.log(chalk.dim(`  - ${counts.tools} tools installed`));
    console.log(chalk.dim(`  - ${counts.workflows} workflow commands installed`));
    if (counts.workflowLaunchers > 0) {
      console.log(chalk.dim(`  - ${counts.workflowLaunchers} workflow launchers installed`));
    }
    console.log(chalk.dim(`  - ${written} files written to ${path.relative(projectDir, rulesDir)}`));

    // Usage instructions
    console.log(chalk.yellow('\n  ⚠️  How to Use Cursor Rules'));
    console.log(chalk.cyan('  BMAD rules are available as @ references in Cursor'));
    console.log(chalk.dim('  Usage:'));
    console.log(chalk.dim('    - Reference rules with @bmad-{module}-{type}-{name}'));
    console.log(chalk.dim('    - All BMAD items start with "bmad-"'));
    console.log(chalk.dim('    - Example: @bmad-bmm-agents-pm'));

    return {
      success: true,
      agents: counts.agents,
      tasks: counts.tasks,
      tools: counts.tools,
      workflows: counts.workflows,
      workflowLaunchers: counts.workflowLaunchers,
      written,
    };
  }

  /**
   * Detect Cursor installation by checking for .cursor/rules directory
   */
  async detect(projectDir) {
    const rulesDir = path.join(projectDir, this.configDir, this.rulesDir);

    if (!(await fs.pathExists(rulesDir))) {
      return false;
    }

    const entries = await fs.readdir(rulesDir);
    return entries.some((entry) => entry.startsWith('bmad-'));
  }

  /**
   * Collect all artifacts for Cursor export
   */
  async collectCursorArtifacts(projectDir, bmadDir, options = {}) {
    const selectedModules = options.selectedModules || [];
    const artifacts = [];

    // Generate agent launchers
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);
    const { artifacts: agentArtifacts } = await agentGen.collectAgentArtifacts(bmadDir, selectedModules);

    // Process agent launchers with Cursor MDC frontmatter
    for (const agentArtifact of agentArtifacts) {
      const content = this.addCursorMDCFrontmatter(agentArtifact.content, {
        module: agentArtifact.module,
        name: agentArtifact.name,
        type: 'agent',
      });

      artifacts.push({
        type: 'agent',
        module: agentArtifact.module,
        sourcePath: agentArtifact.sourcePath,
        relativePath: agentArtifact.relativePath.replace(/\.md$/, '.mdc'),
        content,
      });
    }

    // Get tasks
    const tasks = await getTasksFromBmad(bmadDir, selectedModules);
    for (const task of tasks) {
      const rawContent = await this.readFile(task.path);
      const content = this.addCursorMDCFrontmatter(rawContent, {
        module: task.module,
        name: task.name,
        type: 'task',
      });

      artifacts.push({
        type: 'task',
        module: task.module,
        sourcePath: task.path,
        relativePath: path.join(task.module, 'tasks', `${task.name}.mdc`),
        content,
      });
    }

    // Get tools
    const tools = await getToolsFromBmad(bmadDir, selectedModules);
    for (const tool of tools) {
      const rawContent = await this.readFile(tool.path);
      const content = this.addCursorMDCFrontmatter(rawContent, {
        module: tool.module,
        name: tool.name,
        type: 'tool',
      });

      artifacts.push({
        type: 'tool',
        module: tool.module,
        sourcePath: tool.path,
        relativePath: path.join(tool.module, 'tools', `${tool.name}.mdc`),
        content,
      });
    }

    // Get workflows
    const workflowGenerator = new WorkflowCommandGenerator(this.bmadFolderName);
    const { artifacts: workflowArtifacts, counts: workflowCounts } = await workflowGenerator.collectWorkflowArtifacts(bmadDir);

    // Process workflow artifacts with Cursor MDC frontmatter
    for (const artifact of workflowArtifacts) {
      const content = this.addCursorMDCFrontmatter(artifact.content, {
        module: artifact.module,
        name: artifact.name || path.basename(artifact.relativePath, '.md'),
        type: 'workflow',
      });

      artifacts.push({
        ...artifact,
        relativePath: artifact.relativePath.replace(/\.md$/, '.mdc'),
        content,
      });
    }

    return {
      artifacts,
      counts: {
        agents: agentArtifacts.length,
        tasks: tasks.length,
        tools: tools.length,
        workflows: workflowCounts.commands,
        workflowLaunchers: workflowCounts.launchers,
      },
    };
  }

  /**
   * Add Cursor-specific MDC frontmatter
   * @param {string} content - Original content
   * @param {Object} metadata - Artifact metadata (module, name, type)
   * @returns {string} Content with MDC frontmatter
   */
  addCursorMDCFrontmatter(content, metadata) {
    // Strip existing frontmatter
    const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
    const contentWithoutFrontmatter = content.replace(frontmatterRegex, '');

    // Build description based on type
    let description;
    switch (metadata.type) {
      case 'agent': {
        description = `BMAD ${metadata.module.toUpperCase()} Agent: ${this.formatTitle(metadata.name)}`;
        break;
      }
      case 'task': {
        description = `BMAD ${metadata.module.toUpperCase()} Task: ${this.formatTitle(metadata.name)}`;
        break;
      }
      case 'tool': {
        description = `BMAD ${metadata.module.toUpperCase()} Tool: ${this.formatTitle(metadata.name)}`;
        break;
      }
      case 'workflow': {
        description = `BMAD ${metadata.module.toUpperCase()} Workflow: ${this.formatTitle(metadata.name)}`;
        break;
      }
      default: {
        description = `BMAD ${metadata.module.toUpperCase()}: ${this.formatTitle(metadata.name)}`;
      }
    }

    // Create MDC frontmatter
    return `---
description: ${description}
globs:
alwaysApply: false
---

${contentWithoutFrontmatter}`;
  }

  /**
   * Create BMAD index file for easy navigation
   */
  async createBMADIndex(rulesDir, counts) {
    const indexPath = path.join(rulesDir, 'bmad-index.mdc');

    const content = `---
description: BMAD Method - Master Index
globs:
alwaysApply: true
---

# BMAD Method - Cursor Rules Index

This is the master index for all BMAD agents, tasks, tools, and workflows available in your project.

## Installation Complete!

BMAD rules have been installed to: \`.cursor/rules/\` with flattened naming.

**Note:** BMAD does not modify your \`.cursorrules\` file. You manage that separately.

## How to Use

- Reference specific rules: @bmad-{module}-{type}-{name}
- Examples:
  - @bmad-bmm-agents-pm
  - @bmad-core-tasks-workflow
  - @bmad-bmm-workflows-create-prd

## Statistics

- **${counts.agents}** agents installed
- **${counts.tasks}** tasks installed
- **${counts.tools}** tools installed
- **${counts.workflows}** workflow commands installed

## Quick Reference

- All BMAD rules are Manual type - reference them explicitly when needed
- Agents provide persona-based assistance with specific expertise
- Tasks are reusable workflows for common operations
- Tools provide specialized functionality
- Workflows orchestrate multi-step processes
- Each agent includes an activation block for proper initialization

## Configuration

BMAD rules are configured as Manual rules (alwaysApply: false) to give you control
over when they're included in your context. Reference them explicitly when you need
specific agent expertise, task workflows, tools, or guided workflows.
`;

    await this.writeFile(indexPath, content);
  }

  // Uses inherited flattenFilename(), writeFlattenedArtifacts(), and clearBmadPrefixedFiles() from BaseIdeSetup

  /**
   * Cleanup Cursor configuration
   */
  async cleanup(projectDir) {
    const rulesDir = path.join(projectDir, this.configDir, this.rulesDir);
    const removedCount = await this.clearBmadPrefixedFiles(rulesDir);
    if (removedCount > 0) {
      console.log(chalk.dim(`  Removed ${removedCount} old BMAD items from ${this.name}`));
    }
  }

  /**
   * Install a custom agent launcher for Cursor
   * @param {string} projectDir - Project directory
   * @param {string} agentName - Agent name (e.g., "fred-commit-poet")
   * @param {string} agentPath - Path to compiled agent (relative to project root)
   * @param {Object} metadata - Agent metadata
   * @returns {Object|null} Info about created command
   */
  async installCustomAgentLauncher(projectDir, agentName, agentPath, metadata) {
    const rulesDir = path.join(projectDir, this.configDir, this.rulesDir);

    if (!(await this.exists(path.join(projectDir, this.configDir)))) {
      return null; // IDE not configured for this project
    }

    await this.ensureDir(rulesDir);

    const launcherContent = `You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.

<agent-activation CRITICAL="TRUE">
1. LOAD the FULL agent file from @${agentPath}
2. READ its entire contents - this contains the complete agent persona, menu, and instructions
3. FOLLOW every step in the <activation> section precisely
4. DISPLAY the welcome/greeting as instructed
5. PRESENT the numbered menu
6. WAIT for user input before proceeding
</agent-activation>
`;

    // Cursor uses MDC format with metadata header
    const mdcContent = `---
description: "${agentName} agent"
globs:
alwaysApply: false
---

${launcherContent}
`;

    const fileName = `bmad-custom-agents-${agentName}.mdc`;
    const launcherPath = path.join(rulesDir, fileName);
    await fs.writeFile(launcherPath, mdcContent);

    return {
      ide: 'cursor',
      path: path.relative(projectDir, launcherPath),
      command: `@bmad-custom-agents-${agentName}`,
      type: 'custom-agent-launcher',
    };
  }
}

module.exports = { CursorSetup };
