const path = require('node:path');
const fs = require('fs-extra');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');

/**
 * KiloCode IDE setup handler
 * Creates comprehensive .kilocode configuration including:
 * - Custom modes (.kilocodemodes)
 * - Workflows (.kilocode/workflows/)
 * - Memory Bank (.kilocode/rules/memory-bank/)
 * - Custom Rules (.kilocode/rules/)
 */
class KiloSetup extends BaseIdeSetup {
  constructor() {
    super('kilo', 'Kilo Code');
    this.configFile = '.kilocodemodes';
    this.configDir = '.kilocode';
  }

  /**
   * Setup KiloCode IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    const stats = {
      modes: 0,
      workflows: 0,
      memoryBankFiles: 0,
      ruleFiles: 0,
    };

    // 1. Setup custom modes (.kilocodemodes)
    const modesResult = await this.setupCustomModes(projectDir, bmadDir);
    stats.modes = modesResult.added;

    // 2. Setup workflows directory
    const workflowsResult = await this.setupWorkflows(projectDir, bmadDir, options);
    stats.workflows = workflowsResult.generated;

    // 3. Setup Memory Bank
    const memoryBankResult = await this.setupMemoryBank(projectDir, bmadDir, options);
    stats.memoryBankFiles = memoryBankResult.filesCreated;

    // 4. Setup Custom Rules
    const rulesResult = await this.setupCustomRules(projectDir, bmadDir, options);
    stats.ruleFiles = rulesResult.filesCreated;

    // 5. Create README
    await this.createKilocodeReadme(projectDir, stats);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${stats.modes} custom modes added`));
    console.log(chalk.dim(`  - ${stats.workflows} workflows generated`));
    console.log(chalk.dim(`  - ${stats.memoryBankFiles} Memory Bank files created`));
    console.log(chalk.dim(`  - ${stats.ruleFiles} custom rule files created`));
    console.log(chalk.dim(`  - Configuration: ${this.configFile} and ${this.configDir}/`));
    console.log(chalk.dim('\n  Restart Kilocode to load the new configuration'));

    return {
      success: true,
      ...stats,
    };
  }

  /**
   * Setup custom modes in .kilocodemodes
   */
  async setupCustomModes(projectDir, bmadDir) {
    const kiloModesPath = path.join(projectDir, this.configFile);
    let existingModes = [];
    let existingContent = '';

    // Check for existing modes
    if (await this.pathExists(kiloModesPath)) {
      existingContent = await this.readFile(kiloModesPath);
      const modeMatches = existingContent.matchAll(/- slug: ([\w-]+)/g);
      for (const match of modeMatches) {
        existingModes.push(match[1]);
      }
      console.log(chalk.yellow(`  Found existing .kilocodemodes with ${existingModes.length} modes`));
    }

    // Get agents
    const agents = await this.getAgents(bmadDir);

    // Create modes content
    let newModesContent = '';
    let addedCount = 0;
    let skippedCount = 0;

    for (const agent of agents) {
      const slug = `bmad-${agent.module}-${agent.name}`;

      // Skip if already exists
      if (existingModes.includes(slug)) {
        console.log(chalk.dim(`    Skipping mode ${slug} - already exists`));
        skippedCount++;
        continue;
      }

      const content = await this.readFile(agent.path);
      const modeEntry = this.createModeEntry(agent, content, projectDir);

      newModesContent += modeEntry;
      addedCount++;
    }

    // Build final content
    let finalContent = '';
    if (existingContent) {
      finalContent = existingContent.trim() + '\n' + newModesContent;
    } else {
      finalContent = 'customModes:\n' + newModesContent;
    }

    // Write .kilocodemodes file
    await this.writeFile(kiloModesPath, finalContent);

    return { added: addedCount, skipped: skippedCount };
  }

  /**
   * Create a mode entry for an agent
   */
  createModeEntry(agent, content, projectDir) {
    // Extract metadata
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(agent.name);

    const iconMatch = content.match(/icon="([^"]+)"/);
    const icon = iconMatch ? iconMatch[1] : '🤖';

    // Get relative path to agent file
    const relativePath = path.relative(projectDir, agent.path).replaceAll('\\', '/');

    // Build mode entry with enhanced structure
    const slug = `bmad-${agent.module}-${agent.name}`;
    let modeEntry = `  - slug: ${slug}\n`;
    modeEntry += `    name: '${icon} ${title}'\n`;
    modeEntry += `    description: BMAD ${title} agent from ${agent.module} module\n`;
    modeEntry += `    roleDefinition: |\n`;
    modeEntry += `      You are the BMAD ${title}. Read the full agent definition from ${relativePath}\n`;
    modeEntry += `      and follow all activation instructions precisely. Stay in character until exit.\n`;
    modeEntry += `    customInstructions: |\n`;
    modeEntry += `      CRITICAL: Execute these steps in order:\n`;
    modeEntry += `      1. Read the complete agent file: ${relativePath}\n`;
    modeEntry += `      2. Parse the <activation> section and execute each step\n`;
    modeEntry += `      3. Load ${relativePath.replace(/agents.*/, 'config.yaml')} for user preferences\n`;
    modeEntry += `      4. Follow the agent's persona and communication style\n`;
    modeEntry += `      5. Present the agent's menu and wait for user input\n`;
    modeEntry += `    groups:\n`;
    modeEntry += `      - read\n`;
    modeEntry += `      - edit\n`;
    modeEntry += `      - terminal\n`;
    modeEntry += `\n`;

    return modeEntry;
  }

  /**
   * Setup workflows directory with markdown workflow files
   */
  async setupWorkflows(projectDir, bmadDir, options) {
    const workflowsDir = path.join(projectDir, this.configDir, 'workflows');
    await this.ensureDir(workflowsDir);

    // Get workflows from manifest
    const workflows = await this.getWorkflows(bmadDir, true); // standalone only

    let generatedCount = 0;

    for (const workflow of workflows) {
      // Read workflow.yaml to get metadata
      const yaml = require('js-yaml');
      const workflowYamlContent = await this.readFile(workflow.path);
      const workflowData = yaml.load(workflowYamlContent);

      // Create workflow markdown file for Kilocode
      const workflowContent = this.createWorkflowFile(workflowData, workflow, projectDir, bmadDir);
      const workflowFileName = `${workflow.name}.md`;
      const workflowPath = path.join(workflowsDir, workflowFileName);

      await this.writeFile(workflowPath, workflowContent);
      generatedCount++;
    }

    return { generated: generatedCount };
  }

  /**
   * Create workflow markdown file for Kilocode
   */
  createWorkflowFile(workflowData, workflow, projectDir, bmadDir) {
    const relativePath = path.relative(projectDir, workflow.path).replaceAll('\\', '/');

    let content = `# ${workflowData.name || workflow.name}\n\n`;

    if (workflowData.description) {
      content += `${workflowData.description}\n\n`;
    }

    content += `## Execution\n\n`;
    content += `This workflow is defined in: \`${relativePath}\`\n\n`;
    content += `To execute this workflow:\n\n`;
    content += `1. Activate the **BMad Master** mode\n`;
    content += `2. Tell the agent to execute this workflow:\n`;
    content += `   \`\`\`\n`;
    content += `   Execute workflow: ${relativePath}\n`;
    content += `   \`\`\`\n\n`;

    if (workflowData.steps && Array.isArray(workflowData.steps)) {
      content += `## Workflow Steps\n\n`;
      workflowData.steps.forEach((step, index) => {
        content += `### Step ${index + 1}: ${step.name || step.id}\n\n`;
        if (step.description) {
          content += `${step.description}\n\n`;
        }
      });
    }

    content += `\n---\n\n`;
    content += `*This workflow is part of the BMAD ${workflow.module} module*\n`;

    return content;
  }

  /**
   * Setup Memory Bank files
   */
  async setupMemoryBank(projectDir, bmadDir, options) {
    const memoryBankDir = path.join(projectDir, this.configDir, 'rules', 'memory-bank');
    await this.ensureDir(memoryBankDir);

    const selectedModules = options.selectedModules || [];
    const projectName = options.projectName || path.basename(projectDir);

    const templates = {
      'brief.md': this.createBriefTemplate(projectName, selectedModules),
      'product.md': this.createProductTemplate(),
      'context.md': this.createContextTemplate(selectedModules),
      'architecture.md': this.createArchitectureTemplate(selectedModules),
      'tech.md': this.createTechTemplate(),
    };

    let filesCreated = 0;
    for (const [filename, content] of Object.entries(templates)) {
      const filePath = path.join(memoryBankDir, filename);

      // Only create if doesn't exist (don't overwrite user changes)
      if (!(await this.pathExists(filePath))) {
        await this.writeFile(filePath, content);
        filesCreated++;
      }
    }

    return { filesCreated };
  }

  /**
   * Setup custom rules files
   */
  async setupCustomRules(projectDir, bmadDir, options) {
    const rulesDir = path.join(projectDir, this.configDir, 'rules');
    await this.ensureDir(rulesDir);

    const rules = {
      'bmad-conventions.md': this.createBmadConventionsRule(),
      'bmad-workflow-execution.md': this.createWorkflowExecutionRule(),
    };

    let filesCreated = 0;
    for (const [filename, content] of Object.entries(rules)) {
      const filePath = path.join(rulesDir, filename);

      // Only create if doesn't exist
      if (!(await this.pathExists(filePath))) {
        await this.writeFile(filePath, content);
        filesCreated++;
      }
    }

    return { filesCreated };
  }

  /**
   * Create brief.md template
   */
  createBriefTemplate(projectName, modules) {
    return `# ${projectName} - Project Brief

## Overview

This project uses the BMAD (Collaboration Optimized Reflection Engine) framework for AI-assisted development.

## Installed Modules

${modules.map((m) => `- **${m}**: ${this.getModuleDescription(m)}`).join('\n')}

## Purpose

[Describe the main purpose and goals of this project]

## Key Features

- [Feature 1]
- [Feature 2]
- [Feature 3]

## Development Approach

This project follows the BMAD methodology, using specialized AI agents for different aspects of development:
- Analysis and planning
- Architecture and design
- Implementation and review
- Testing and quality assurance

---

*Update this file with project-specific information. This helps Kilocode AI understand your project context.*
`;
  }

  /**
   * Create product.md template
   */
  createProductTemplate() {
    return `# Product Context

## Problem Statement

[What problem does this project solve?]

## Target Users

[Who will use this product/system?]

## User Goals

[What do users want to accomplish?]

## Success Metrics

[How will you measure success?]

---

*Keep this updated with product vision and user insights*
`;
  }

  /**
   * Create context.md template
   */
  createContextTemplate(modules) {
    const date = new Date().toISOString().split('T')[0];

    return `# Current Development Context

## Status

**Last Updated**: ${date}

**Current Phase**: Initial setup

## Recent Changes

- BMAD framework installed with modules: ${modules.join(', ')}
- Kilocode AI configuration generated

## Current Focus

[What are you working on right now?]

## Next Priorities

1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

## Known Issues

[List any known issues or blockers]

---

*Update this frequently - it's the most dynamic Memory Bank file*
`;
  }

  /**
   * Create architecture.md template
   */
  createArchitectureTemplate(modules) {
    return `# Technical Architecture

## System Overview

[High-level description of the system architecture]

## Key Components

[Describe main system components]

## Technology Stack

[List technologies being used]

## BMAD Integration

This project uses BMAD modules:
${modules.map((m) => `- **${m}**: ${this.getModuleDescription(m)}`).join('\n')}

## Architectural Decisions

[Document key architectural decisions and rationale]

---

*Update when architecture changes or major technical decisions are made*
`;
  }

  /**
   * Create tech.md template
   */
  createTechTemplate() {
    return `# Technology Stack & Setup

## Runtime Environment

[Node.js version, Python version, etc.]

## Dependencies

[Key dependencies and versions]

## Development Setup

\`\`\`bash
# Installation steps
npm install
# or
pip install -r requirements.txt
\`\`\`

## Build & Deploy

[Build and deployment process]

## Development Tools

- BMAD Framework: AI-assisted development
- [Other tools]

---

*Keep this updated with tech stack changes*
`;
  }

  /**
   * Create BMAD conventions rule
   */
  createBmadConventionsRule() {
    return `# BMAD Framework Conventions

When working with this BMAD project, follow these conventions:

## File Structure

- **bmad/core/**: Core framework
- **bmad/{module}/**: Module-specific files
- **bmad/_cfg/**: User customizations (update-safe)

## Agent Activation

When activating a BMAD agent:

1. Always load the agent's full markdown file
2. Execute the <activation> section step-by-step
3. Load bmad/core/config.yaml for user preferences
4. Use {user_name} and {communication_language} from config
5. Follow the agent's persona and menu structure

## Workflow Execution

For workflows:

1. BMad Master coordinates workflow execution
2. Read bmad/core/tasks/workflow.xml for execution logic
3. Execute steps sequentially
4. Save state after each step

## Configuration

- User config: \`bmad/core/config.yaml\`
- Agent customizations: \`bmad/_cfg/agents/*.yaml\`
- These survive framework updates

## Best Practices

- Guide users through reflection, don't just provide answers
- Use the C.O.R.E. philosophy (Collaboration, Optimized, Reflection, Engine)
- Reference project context from Memory Bank
- Follow scale-adaptive approach (Levels 0-4) based on project complexity
`;
  }

  /**
   * Create workflow execution rule
   */
  createWorkflowExecutionRule() {
    return `# BMAD Workflow Execution

When executing BMAD workflows:

## Execution Pattern

1. **Activate BMad Master** mode
2. **Load workflow.yaml** from specified path
3. **Read workflow.xml** (the core execution engine)
4. **Execute steps** sequentially:
   - Read step instructions
   - Perform step actions
   - Save output
   - Update state
5. **Validate completion** before moving to next step

## Workflow Components

Each workflow directory may contain:

- \`workflow.yaml\` - Step definitions
- \`instructions.md\` - Detailed instructions
- \`template.md\` - Output templates
- \`checklist.md\` - Validation checklist

## State Management

- Save progress after EACH step
- Never batch multiple steps
- Preserve context between steps
- Handle errors gracefully

## Output Generation

- Use templates when provided
- Write to configured output folder
- Use professional language (+2sd from communication style)
- Generate in user's preferred output language
`;
  }

  /**
   * Create Kilocode README
   */
  async createKilocodeReadme(projectDir, stats) {
    const readmePath = path.join(projectDir, this.configDir, 'README.md');

    const content = `# Kilocode AI Configuration for BMAD

This directory contains Kilocode AI configuration for this BMAD project.

## Generated Configuration

- **${stats.modes} Custom Modes** - Specialized modes matching BMAD agents
- **${stats.workflows} Workflows** - Automated workflow commands
- **${stats.memoryBankFiles} Memory Bank Files** - Persistent project context
- **${stats.ruleFiles} Custom Rules** - Project-specific guidelines

## Structure

\`\`\`
.kilocode/
├── README.md (this file)
├── rules/
│   ├── memory-bank/       # Persistent AI context
│   │   ├── brief.md       # Project overview
│   │   ├── product.md     # Product context
│   │   ├── context.md     # Current state (update frequently!)
│   │   ├── architecture.md # Technical architecture
│   │   └── tech.md        # Technology stack
│   ├── bmad-conventions.md     # BMAD framework conventions
│   └── bmad-workflow-execution.md # Workflow execution rules
└── workflows/             # Workflow command files
    └── [workflow-name].md

.kilocodemodes             # Custom modes definition (project root)
\`\`\`

## Using Custom Modes

Switch between BMAD agent modes in Kilocode to access specialized expertise:

- 🧙 BMad Master - Workflow orchestration
- 📋 PM - Product planning
- 🏗️ Architect - System design
- 💻 Developer - Implementation
- And more...

## Memory Bank

The Memory Bank provides persistent project context:

1. **brief.md** - Update rarely (major changes only)
2. **product.md** - Update occasionally (product evolution)
3. **context.md** - Update frequently (current work)
4. **architecture.md** - Update as needed (architectural changes)
5. **tech.md** - Update as needed (tech stack changes)

## Workflows

Execute workflows using the \`/workflow-name\` command in Kilocode chat.

Or activate BMad Master mode and request workflow execution.

## Maintaining This Configuration

- **Update Memory Bank** regularly (especially context.md)
- **Don't delete** generated files (they provide AI context)
- **Customize** rules and workflows as needed
- **Re-run installer** to update when BMAD is updated

## Resources

- [Kilocode Custom Modes](https://kilocode.ai/docs/features/custom-modes)
- [Kilocode Workflows](https://kilocode.ai/docs/features/slash-commands/workflows)
- [Kilocode Memory Bank](https://kilocode.ai/docs/advanced-usage/memory-bank)
- [BMAD Documentation](./bmad/README.md)

---

*Generated by BMAD installer v6 for Kilocode AI*
`;

    await this.writeFile(readmePath, content);
  }

  /**
   * Get module description
   */
  getModuleDescription(moduleName) {
    const descriptions = {
      core: 'Core framework and orchestration',
      bmm: 'BMad Method - Agile development methodology',
      bmb: 'BMad Builder - Create custom agents and workflows',
      cis: 'Creative Intelligence Suite - Innovation and creativity workflows',
      bmd: 'BMad Development - Development utilities',
    };
    return descriptions[moduleName] || 'BMAD module';
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
   * Cleanup KiloCode configuration
   */
  async cleanup(projectDir) {
    // Remove BMAD modes from .kilocodemodes
    const kiloModesPath = path.join(projectDir, this.configFile);

    if (await fs.pathExists(kiloModesPath)) {
      const content = await fs.readFile(kiloModesPath, 'utf8');

      // Remove BMAD modes only
      const lines = content.split('\n');
      const filteredLines = [];
      let skipMode = false;
      let removedCount = 0;

      for (const line of lines) {
        if (/^\s*- slug: bmad-/.test(line)) {
          skipMode = true;
          removedCount++;
        } else if (skipMode && /^\s*- slug: /.test(line)) {
          skipMode = false;
        }

        if (!skipMode) {
          filteredLines.push(line);
        }
      }

      await fs.writeFile(kiloModesPath, filteredLines.join('\n'));
      console.log(chalk.dim(`  Removed ${removedCount} BMAD modes from .kilocodemodes`));
    }

    // Remove .kilocode directory
    const kilocodeDir = path.join(projectDir, this.configDir);
    if (await fs.pathExists(kilocodeDir)) {
      await fs.remove(kilocodeDir);
      console.log(chalk.dim(`  Removed .kilocode directory`));
    }
  }
}

module.exports = { KiloSetup };
