const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');
const { BMAD_FOLDER_NAME, toDashPath } = require('./shared/path-utils');
const fs = require('fs-extra');
const csv = require('csv-parse/sync');
const yaml = require('yaml');

/**
 * GitHub Copilot setup handler
 * Creates agents in .github/agents/, prompts in .github/prompts/,
 * copilot-instructions.md, and configures VS Code settings
 */
class GitHubCopilotSetup extends BaseIdeSetup {
  constructor() {
    super('github-copilot', 'GitHub Copilot', false);
    // Don't set configDir to '.github' — nearly every GitHub repo has that directory,
    // which would cause the base detect() to false-positive. Use detectionPaths instead.
    this.configDir = null;
    this.githubDir = '.github';
    this.agentsDir = 'agents';
    this.promptsDir = 'prompts';
    this.detectionPaths = ['.github/copilot-instructions.md', '.github/agents'];
  }

  /**
   * Setup GitHub Copilot configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Create .github/agents and .github/prompts directories
    const githubDir = path.join(projectDir, this.githubDir);
    const agentsDir = path.join(githubDir, this.agentsDir);
    const promptsDir = path.join(githubDir, this.promptsDir);
    await this.ensureDir(agentsDir);
    await this.ensureDir(promptsDir);

    // Preserve any customised tool permissions from existing files before cleanup
    this.existingToolPermissions = await this.collectExistingToolPermissions(projectDir);

    // Clean up any existing BMAD files before reinstalling
    await this.cleanup(projectDir);

    // Load agent manifest for enriched descriptions
    const agentManifest = await this.loadAgentManifest(bmadDir);

    // Generate agent launchers
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);
    const { artifacts: agentArtifacts } = await agentGen.collectAgentArtifacts(bmadDir, options.selectedModules || []);

    // Create agent .agent.md files
    let agentCount = 0;
    for (const artifact of agentArtifacts) {
      const agentMeta = agentManifest.get(artifact.name);

      // Compute fileName first so we can look up any existing tool permissions
      const dashName = toDashPath(artifact.relativePath);
      const fileName = dashName.replace(/\.md$/, '.agent.md');
      const toolsStr = this.getToolsForFile(fileName);
      const agentContent = this.createAgentContent(artifact, agentMeta, toolsStr);
      const targetPath = path.join(agentsDir, fileName);
      await this.writeFile(targetPath, agentContent);
      agentCount++;

      console.log(chalk.green(`  ✓ Created agent: ${fileName}`));
    }

    // Generate prompt files from bmad-help.csv
    const promptCount = await this.generatePromptFiles(projectDir, bmadDir, agentArtifacts, agentManifest);

    // Generate copilot-instructions.md
    await this.generateCopilotInstructions(projectDir, bmadDir, agentManifest);

    console.log(chalk.green(`\n✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${agentCount} agents created in .github/agents/`));
    console.log(chalk.dim(`  - ${promptCount} prompts created in .github/prompts/`));
    console.log(chalk.dim(`  - copilot-instructions.md generated`));
    console.log(chalk.dim(`  - Destination: .github/`));

    return {
      success: true,
      results: {
        agents: agentCount,
        workflows: promptCount,
        tasks: 0,
        tools: 0,
      },
    };
  }

  /**
   * Load agent manifest CSV into a Map keyed by agent name
   * @param {string} bmadDir - BMAD installation directory
   * @returns {Map} Agent metadata keyed by name
   */
  async loadAgentManifest(bmadDir) {
    const manifestPath = path.join(bmadDir, '_config', 'agent-manifest.csv');
    const agents = new Map();

    if (!(await fs.pathExists(manifestPath))) {
      return agents;
    }

    try {
      const csvContent = await fs.readFile(manifestPath, 'utf8');
      const records = csv.parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
      });

      for (const record of records) {
        agents.set(record.name, record);
      }
    } catch {
      // Gracefully degrade if manifest is unreadable/malformed
    }

    return agents;
  }

  /**
   * Load bmad-help.csv to drive prompt generation
   * @param {string} bmadDir - BMAD installation directory
   * @returns {Array|null} Parsed CSV rows
   */
  async loadBmadHelp(bmadDir) {
    const helpPath = path.join(bmadDir, '_config', 'bmad-help.csv');

    if (!(await fs.pathExists(helpPath))) {
      return null;
    }

    try {
      const csvContent = await fs.readFile(helpPath, 'utf8');
      return csv.parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
      });
    } catch {
      // Gracefully degrade if help CSV is unreadable/malformed
      return null;
    }
  }

  /**
   * Create agent .agent.md content with enriched description
   * @param {Object} artifact - Agent artifact from AgentCommandGenerator
   * @param {Object|undefined} manifestEntry - Agent manifest entry with metadata
   * @returns {string} Agent file content
   */
  createAgentContent(artifact, manifestEntry, toolsStr) {
    // Build enriched description from manifest metadata
    let description;
    if (manifestEntry) {
      const persona = manifestEntry.displayName || artifact.name;
      const title = manifestEntry.title || this.formatTitle(artifact.name);
      const capabilities = manifestEntry.capabilities || 'agent capabilities';
      description = `${persona} — ${title}: ${capabilities}`;
    } else {
      description = `Activates the ${this.formatTitle(artifact.name)} agent persona.`;
    }

    // Build the agent file path for the activation block
    const agentPath = artifact.agentPath || artifact.relativePath;
    const agentFilePath = `{project-root}/${this.bmadFolderName}/${agentPath}`;

    return `---
description: '${description.replaceAll("'", "''")}'
tools: ${toolsStr}
disable-model-invocation: true
---

You must fully embody this agent's persona and follow all activation instructions exactly as specified.

<agent-activation CRITICAL="TRUE">
1. LOAD the FULL agent file from ${agentFilePath}
2. READ its entire contents - this contains the complete agent persona, menu, and instructions
3. FOLLOW every step in the <activation> section precisely
4. DISPLAY the welcome/greeting as instructed
5. PRESENT the numbered menu
6. WAIT for user input before proceeding
</agent-activation>
`;
  }

  /**
   * Generate .prompt.md files for workflows, tasks, tech-writer commands, and agent activators
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Array} agentArtifacts - Agent artifacts for activator generation
   * @param {Map} agentManifest - Agent manifest data
   * @returns {number} Count of prompts generated
   */
  async generatePromptFiles(projectDir, bmadDir, agentArtifacts, agentManifest) {
    const promptsDir = path.join(projectDir, this.githubDir, this.promptsDir);
    let promptCount = 0;

    // Load bmad-help.csv to drive workflow/task prompt generation
    const helpEntries = await this.loadBmadHelp(bmadDir);

    if (helpEntries) {
      for (const entry of helpEntries) {
        const command = entry.command;
        if (!command) continue; // Skip entries without a command (tech-writer commands have no command column)

        const workflowFile = entry['workflow-file'];
        if (!workflowFile) continue; // Skip entries with no workflow file path
        const promptFileName = `${command}.prompt.md`;
        const toolsStr = this.getToolsForFile(promptFileName);
        const promptContent = this.createWorkflowPromptContent(entry, workflowFile, toolsStr);
        const promptPath = path.join(promptsDir, promptFileName);
        await this.writeFile(promptPath, promptContent);
        promptCount++;
      }

      // Generate tech-writer command prompts (entries with no command column)
      for (const entry of helpEntries) {
        if (entry.command) continue; // Already handled above
        const techWriterPrompt = this.createTechWriterPromptContent(entry);
        if (techWriterPrompt) {
          const promptFileName = `${techWriterPrompt.fileName}.prompt.md`;
          const promptPath = path.join(promptsDir, promptFileName);
          await this.writeFile(promptPath, techWriterPrompt.content);
          promptCount++;
        }
      }
    }

    // Generate agent activator prompts (Pattern D)
    for (const artifact of agentArtifacts) {
      const agentMeta = agentManifest.get(artifact.name);
      const fileName = `bmad-${artifact.name}.prompt.md`;
      const toolsStr = this.getToolsForFile(fileName);
      const promptContent = this.createAgentActivatorPromptContent(artifact, agentMeta, toolsStr);
      const promptPath = path.join(promptsDir, fileName);
      await this.writeFile(promptPath, promptContent);
      promptCount++;
    }

    return promptCount;
  }

  /**
   * Create prompt content for a workflow/task entry from bmad-help.csv
   * Determines the pattern (A, B, or A for .xml tasks) based on file extension
   * @param {Object} entry - bmad-help.csv row
   * @param {string} workflowFile - Workflow file path
   * @returns {string} Prompt file content
   */
  createWorkflowPromptContent(entry, workflowFile, toolsStr) {
    const description = this.escapeYamlSingleQuote(this.createPromptDescription(entry.name));
    // bmm/config.yaml is safe to hardcode here: these prompts are only generated when
    // bmad-help.csv exists (bmm module data), so bmm is guaranteed to be installed.
    const configLine = `1. Load {project-root}/${this.bmadFolderName}/bmm/config.yaml and store ALL fields as session variables`;

    let body;
    if (workflowFile.endsWith('.yaml')) {
      // Pattern B: YAML-based workflows — use workflow engine
      body = `${configLine}
2. Load the workflow engine at {project-root}/${this.bmadFolderName}/core/tasks/workflow.xml
3. Load and execute the workflow configuration at {project-root}/${workflowFile} using the engine from step 2`;
    } else if (workflowFile.endsWith('.xml')) {
      // Pattern A variant: XML tasks — load and execute directly
      body = `${configLine}
2. Load and execute the task at {project-root}/${workflowFile}`;
    } else {
      // Pattern A: MD workflows — load and follow directly
      body = `${configLine}
2. Load and follow the workflow at {project-root}/${workflowFile}`;
    }

    return `---
description: '${description}'
agent: 'agent'
tools: ${toolsStr}
---

${body}
`;
  }

  /**
   * Create a short 2-5 word description for a prompt from the entry name
   * @param {string} name - Entry name from bmad-help.csv
   * @returns {string} Short description
   */
  createPromptDescription(name) {
    const descriptionMap = {
      'Brainstorm Project': 'Brainstorm ideas',
      'Market Research': 'Market research',
      'Domain Research': 'Domain research',
      'Technical Research': 'Technical research',
      'Create Brief': 'Create product brief',
      'Create PRD': 'Create PRD',
      'Validate PRD': 'Validate PRD',
      'Edit PRD': 'Edit PRD',
      'Create UX': 'Create UX design',
      'Create Architecture': 'Create architecture',
      'Create Epics and Stories': 'Create epics and stories',
      'Check Implementation Readiness': 'Check implementation readiness',
      'Sprint Planning': 'Sprint planning',
      'Sprint Status': 'Sprint status',
      'Create Story': 'Create story',
      'Validate Story': 'Validate story',
      'Dev Story': 'Dev story',
      'QA Automation Test': 'QA automation',
      'Code Review': 'Code review',
      Retrospective: 'Retrospective',
      'Document Project': 'Document project',
      'Generate Project Context': 'Generate project context',
      'Quick Spec': 'Quick spec',
      'Quick Dev': 'Quick dev',
      'Correct Course': 'Correct course',
      Brainstorming: 'Brainstorm ideas',
      'Party Mode': 'Party mode',
      'bmad-help': 'BMAD help',
      'Index Docs': 'Index documents',
      'Shard Document': 'Shard document',
      'Editorial Review - Prose': 'Editorial review prose',
      'Editorial Review - Structure': 'Editorial review structure',
      'Adversarial Review (General)': 'Adversarial review',
    };

    return descriptionMap[name] || name;
  }

  /**
   * Create prompt content for tech-writer agent-only commands (Pattern C)
   * @param {Object} entry - bmad-help.csv row
   * @returns {Object|null} { fileName, content } or null if not a tech-writer command
   */
  createTechWriterPromptContent(entry) {
    if (entry['agent-name'] !== 'tech-writer') return null;

    const techWriterCommands = {
      'Write Document': { code: 'WD', file: 'bmad-bmm-write-document', description: 'Write document' },
      'Update Standards': { code: 'US', file: 'bmad-bmm-update-standards', description: 'Update standards' },
      'Mermaid Generate': { code: 'MG', file: 'bmad-bmm-mermaid-generate', description: 'Mermaid generate' },
      'Validate Document': { code: 'VD', file: 'bmad-bmm-validate-document', description: 'Validate document' },
      'Explain Concept': { code: 'EC', file: 'bmad-bmm-explain-concept', description: 'Explain concept' },
    };

    const cmd = techWriterCommands[entry.name];
    if (!cmd) return null;

    const safeDescription = this.escapeYamlSingleQuote(cmd.description);
    const toolsStr = this.getToolsForFile(`${cmd.file}.prompt.md`);

    const content = `---
description: '${safeDescription}'
agent: 'agent'
tools: ${toolsStr}
---

1. Load {project-root}/${this.bmadFolderName}/bmm/config.yaml and store ALL fields as session variables
2. Load the full agent file from {project-root}/${this.bmadFolderName}/bmm/agents/tech-writer/tech-writer.md and activate the Paige (Technical Writer) persona
3. Execute the ${entry.name} menu command (${cmd.code})
`;

    return { fileName: cmd.file, content };
  }

  /**
   * Create agent activator prompt content (Pattern D)
   * @param {Object} artifact - Agent artifact
   * @param {Object|undefined} manifestEntry - Agent manifest entry
   * @returns {string} Prompt file content
   */
  createAgentActivatorPromptContent(artifact, manifestEntry, toolsStr) {
    let description;
    if (manifestEntry) {
      description = manifestEntry.title || this.formatTitle(artifact.name);
    } else {
      description = this.formatTitle(artifact.name);
    }

    const safeDescription = this.escapeYamlSingleQuote(description);
    const agentPath = artifact.agentPath || artifact.relativePath;
    const agentFilePath = `{project-root}/${this.bmadFolderName}/${agentPath}`;

    // bmm/config.yaml is safe to hardcode: agent activators are only generated from
    // bmm agent artifacts, so bmm is guaranteed to be installed.
    return `---
description: '${safeDescription}'
agent: 'agent'
tools: ${toolsStr}
---

1. Load {project-root}/${this.bmadFolderName}/bmm/config.yaml and store ALL fields as session variables
2. Load the full agent file from ${agentFilePath}
3. Follow ALL activation instructions in the agent file
4. Display the welcome/greeting as instructed
5. Present the numbered menu
6. Wait for user input before proceeding
`;
  }

  /**
   * Generate copilot-instructions.md from module config
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Map} agentManifest - Agent manifest data
   */
  async generateCopilotInstructions(projectDir, bmadDir, agentManifest) {
    const configVars = await this.loadModuleConfig(bmadDir);

    // Build the agents table from the manifest
    let agentsTable = '| Agent | Persona | Title | Capabilities |\n|---|---|---|---|\n';
    const agentOrder = [
      'bmad-master',
      'analyst',
      'architect',
      'dev',
      'pm',
      'qa',
      'quick-flow-solo-dev',
      'sm',
      'tech-writer',
      'ux-designer',
    ];

    for (const agentName of agentOrder) {
      const meta = agentManifest.get(agentName);
      if (meta) {
        const capabilities = meta.capabilities || 'agent capabilities';
        const cleanTitle = (meta.title || '').replaceAll('""', '"');
        agentsTable += `| ${agentName} | ${meta.displayName} | ${cleanTitle} | ${capabilities} |\n`;
      }
    }

    const bmad = this.bmadFolderName;
    const bmadSection = `# BMAD Method — Project Instructions

## Project Configuration

- **Project**: ${configVars.project_name || '{{project_name}}'}
- **User**: ${configVars.user_name || '{{user_name}}'}
- **Communication Language**: ${configVars.communication_language || '{{communication_language}}'}
- **Document Output Language**: ${configVars.document_output_language || '{{document_output_language}}'}
- **User Skill Level**: ${configVars.user_skill_level || '{{user_skill_level}}'}
- **Output Folder**: ${configVars.output_folder || '{{output_folder}}'}
- **Planning Artifacts**: ${configVars.planning_artifacts || '{{planning_artifacts}}'}
- **Implementation Artifacts**: ${configVars.implementation_artifacts || '{{implementation_artifacts}}'}
- **Project Knowledge**: ${configVars.project_knowledge || '{{project_knowledge}}'}

## BMAD Runtime Structure

- **Agent definitions**: \`${bmad}/bmm/agents/\` (BMM module) and \`${bmad}/core/agents/\` (core)
- **Workflow definitions**: \`${bmad}/bmm/workflows/\` (organized by phase)
- **Core tasks**: \`${bmad}/core/tasks/\` (help, editorial review, indexing, sharding, adversarial review)
- **Core workflows**: \`${bmad}/core/workflows/\` (brainstorming, party-mode, advanced-elicitation)
- **Workflow engine**: \`${bmad}/core/tasks/workflow.xml\` (executes YAML-based workflows)
- **Module configuration**: \`${bmad}/bmm/config.yaml\`
- **Core configuration**: \`${bmad}/core/config.yaml\`
- **Agent manifest**: \`${bmad}/_config/agent-manifest.csv\`
- **Workflow manifest**: \`${bmad}/_config/workflow-manifest.csv\`
- **Help manifest**: \`${bmad}/_config/bmad-help.csv\`
- **Agent memory**: \`${bmad}/_memory/\`

## Key Conventions

- Always load \`${bmad}/bmm/config.yaml\` before any agent activation or workflow execution
- Store all config fields as session variables: \`{user_name}\`, \`{communication_language}\`, \`{output_folder}\`, \`{planning_artifacts}\`, \`{implementation_artifacts}\`, \`{project_knowledge}\`
- MD-based workflows execute directly — load and follow the \`.md\` file
- YAML-based workflows require the workflow engine — load \`workflow.xml\` first, then pass the \`.yaml\` config
- Follow step-based workflow execution: load steps JIT, never multiple at once
- Save outputs after EACH step when using the workflow engine
- The \`{project-root}\` variable resolves to the workspace root at runtime

## Available Agents

${agentsTable}
## Slash Commands

Type \`/bmad-\` in Copilot Chat to see all available BMAD workflows and agent activators. Agents are also available in the agents dropdown.`;

    const instructionsPath = path.join(projectDir, this.githubDir, 'copilot-instructions.md');
    const markerStart = '<!-- BMAD:START -->';
    const markerEnd = '<!-- BMAD:END -->';
    const markedContent = `${markerStart}\n${bmadSection}\n${markerEnd}`;

    if (await fs.pathExists(instructionsPath)) {
      const existing = await fs.readFile(instructionsPath, 'utf8');
      const startIdx = existing.indexOf(markerStart);
      const endIdx = existing.indexOf(markerEnd);

      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        // Replace only the BMAD section between markers
        const before = existing.slice(0, startIdx);
        const after = existing.slice(endIdx + markerEnd.length);
        const merged = `${before}${markedContent}${after}`;
        await this.writeFile(instructionsPath, merged);
        console.log(chalk.green('  ✓ Updated BMAD section in copilot-instructions.md'));
      } else {
        // Existing file without markers — back it up before overwriting
        const backupPath = `${instructionsPath}.bak`;
        await fs.copy(instructionsPath, backupPath);
        console.log(chalk.yellow(`  ⚠ Backed up existing copilot-instructions.md → copilot-instructions.md.bak`));
        await this.writeFile(instructionsPath, `${markedContent}\n`);
        console.log(chalk.green('  ✓ Generated copilot-instructions.md (with BMAD markers)'));
      }
    } else {
      // No existing file — create fresh with markers
      await this.writeFile(instructionsPath, `${markedContent}\n`);
      console.log(chalk.green('  ✓ Generated copilot-instructions.md'));
    }
  }

  /**
   * Load module config.yaml for template variables
   * @param {string} bmadDir - BMAD installation directory
   * @returns {Object} Config variables
   */
  async loadModuleConfig(bmadDir) {
    const bmmConfigPath = path.join(bmadDir, 'bmm', 'config.yaml');
    const coreConfigPath = path.join(bmadDir, 'core', 'config.yaml');

    for (const configPath of [bmmConfigPath, coreConfigPath]) {
      if (await fs.pathExists(configPath)) {
        try {
          const content = await fs.readFile(configPath, 'utf8');
          return yaml.parse(content) || {};
        } catch {
          // Fall through to next config
        }
      }
    }

    return {};
  }

  /**
   * Escape a string for use inside YAML single-quoted values.
   * In YAML, the only escape inside single quotes is '' for a literal '.
   * @param {string} value - Raw string
   * @returns {string} Escaped string safe for YAML single-quoted context
   */
  escapeYamlSingleQuote(value) {
    return (value || '').replaceAll("'", "''");
  }

  /**
   * Scan existing agent and prompt files for customised tool permissions before cleanup.
   * Returns a Map<filename, toolsArray> so permissions can be preserved across reinstalls.
   * @param {string} projectDir - Project directory
   * @returns {Map} Existing tool permissions keyed by filename
   */
  async collectExistingToolPermissions(projectDir) {
    const permissions = new Map();
    const dirs = [
      [path.join(projectDir, this.githubDir, this.agentsDir), /^bmad.*\.agent\.md$/],
      [path.join(projectDir, this.githubDir, this.promptsDir), /^bmad-.*\.prompt\.md$/],
    ];

    for (const [dir, pattern] of dirs) {
      if (!(await fs.pathExists(dir))) continue;
      const files = await fs.readdir(dir);

      for (const file of files) {
        if (!pattern.test(file)) continue;

        try {
          const content = await fs.readFile(path.join(dir, file), 'utf8');
          const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
          if (!fmMatch) continue;

          const frontmatter = yaml.parse(fmMatch[1]);
          if (frontmatter && Array.isArray(frontmatter.tools)) {
            permissions.set(file, frontmatter.tools);
          }
        } catch {
          // Skip unreadable files
        }
      }
    }

    return permissions;
  }

  /**
   * Get the tools array string for a file, preserving any existing customisation.
   * Falls back to the default tools if no prior customisation exists.
   * @param {string} fileName - Target filename (e.g. 'bmad-agent-bmm-pm.agent.md')
   * @returns {string} YAML inline array string
   */
  getToolsForFile(fileName) {
    const defaultTools = ['read', 'edit', 'search', 'execute'];
    const tools = (this.existingToolPermissions && this.existingToolPermissions.get(fileName)) || defaultTools;
    return '[' + tools.map((t) => `'${t}'`).join(', ') + ']';
  }

  /**
   * Format name as title
   */
  formatTitle(name) {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Cleanup GitHub Copilot configuration - surgically remove only BMAD files
   */
  async cleanup(projectDir) {
    // Clean up agents directory
    const agentsDir = path.join(projectDir, this.githubDir, this.agentsDir);
    if (await fs.pathExists(agentsDir)) {
      const files = await fs.readdir(agentsDir);
      let removed = 0;

      for (const file of files) {
        if (file.startsWith('bmad') && (file.endsWith('.agent.md') || file.endsWith('.md'))) {
          await fs.remove(path.join(agentsDir, file));
          removed++;
        }
      }

      if (removed > 0) {
        console.log(chalk.dim(`  Cleaned up ${removed} existing BMAD agents`));
      }
    }

    // Clean up prompts directory
    const promptsDir = path.join(projectDir, this.githubDir, this.promptsDir);
    if (await fs.pathExists(promptsDir)) {
      const files = await fs.readdir(promptsDir);
      let removed = 0;

      for (const file of files) {
        if (file.startsWith('bmad-') && file.endsWith('.prompt.md')) {
          await fs.remove(path.join(promptsDir, file));
          removed++;
        }
      }

      if (removed > 0) {
        console.log(chalk.dim(`  Cleaned up ${removed} existing BMAD prompts`));
      }
    }

    // Note: copilot-instructions.md is NOT cleaned up here.
    // generateCopilotInstructions() handles marker-based replacement in a single
    // read-modify-write pass, which correctly preserves user content outside the markers.
    // Stripping markers here would cause generation to treat the file as legacy (no markers)
    // and overwrite user content.
  }
}

module.exports = { GitHubCopilotSetup };
