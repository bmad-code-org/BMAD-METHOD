const fs = require('node:fs');
const path = require('node:path');
const csv = require('csv-parse/sync');
const chalk = require('chalk');

class KiroCLIGenerator {
  constructor() {}

  /**
   * Generate Kiro CLI agent files from BMAD agent manifest
   * @param {string} projectRoot - Project root directory
   * @param {string} outputDir - Output directory for Kiro CLI agents
   * @param {boolean} force - Overwrite existing files
   * @returns {Object} Generation results
   */
  async generateAgents(projectRoot, outputDir = null, force = false) {
    const manifestPath = path.join(projectRoot, '.bmad/_cfg/agent-manifest.csv');
    const defaultOutputDir = path.join(projectRoot, '.kiro/agents');
    const targetOutputDir = outputDir || defaultOutputDir;

    // Validate manifest exists
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Agent manifest not found at: ${manifestPath}`);
    }

    // Create output directory
    if (!fs.existsSync(targetOutputDir)) {
      fs.mkdirSync(targetOutputDir, { recursive: true });
    }

    // Read and parse agent manifest
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const agents = csv.parse(manifestContent, {
      columns: true,
      skip_empty_lines: true,
    });

    let generated = 0;
    let skipped = 0;

    for (const agent of agents) {
      const agentJsonPath = path.join(targetOutputDir, `${agent.name}.json`);
      const agentPromptPath = path.join(targetOutputDir, `${agent.name}-prompt.md`);

      // Skip if files exist and not forcing
      if (!force && (fs.existsSync(agentJsonPath) || fs.existsSync(agentPromptPath))) {
        skipped++;
        continue;
      }

      // Generate Kiro CLI agent JSON
      const kiroAgent = {
        name: agent.name,
        description: `BMAD ${agent.title} (context optimized) - auto-generated from manifest`,
        prompt: `file://./${agent.name}-prompt.md`,
        tools: ['read', 'write', 'shell', '@docker_mcp_gateway'],
        allowedTools: ['read', 'write', 'shell', '@docker_mcp_gateway'],
        mcpServers: {},
        resources: ['file://.bmad/bmm/config.yaml'],
        model: 'claude-sonnet-4',
      };

      // Generate Kiro CLI agent prompt
      const kiroPrompt = `# ${agent.name} (Context Optimized)

**IMPORTANT**: Only load specific workflow/task details when explicitly needed using fs_read.
Load workflows: \`file://.bmad/bmm/workflows/[name]/workflow.yaml\`

You are ${agent.displayName}, a ${agent.title} ${agent.icon}

## Core Identity
- **Role**: ${agent.role}
- **Identity**: ${agent.identity}
- **Communication Style**: ${agent.communicationStyle}
- **Principles**: ${agent.principles}

## Kiro CLI Optimization
- **Lazy Loading**: Load workflow files only when requested using read tool
- **Context Efficiency**: Minimal initial load, expand on demand
- **File Output**: Generate files as specified in workflows
- **Session Continuity**: Maintain conversation context within Kiro CLI
- **MCP Integration**: Inherits MCP servers from agent configuration

## Available Workflows
Load workflows from: \`.bmad/bmm/workflows/\`

## MCP Server Access
You have access to any MCP servers configured in this agent's configuration.
Use MCP capabilities when they provide better functionality than basic tools.

## Interaction Pattern
1. **Greet user** as ${agent.displayName}
2. **Offer capabilities** based on role and available workflows
3. **Load workflows** on demand using read tool when user requests specific functionality
4. **Execute conversationally** following loaded workflow instructions
5. **Generate outputs** to appropriate file paths
6. **Leverage available MCP servers** when they enhance functionality

## Configuration
- **Project Root**: Use current working directory
- **Config**: Load from .bmad/bmm/config.yaml
- **Output**: Use configured output folder from config

Remember: You are ${agent.displayName} - ${agent.identity}`;

      // Write files
      fs.writeFileSync(agentJsonPath, JSON.stringify(kiroAgent, null, 2));
      fs.writeFileSync(agentPromptPath, kiroPrompt);
      generated++;
    }

    return {
      total: agents.length,
      generated,
      skipped,
      outputDir: targetOutputDir,
    };
  }

  /**
   * Generate Kiro CLI agents with console output
   * @param {string} projectRoot - Project root directory
   * @param {Object} options - Generation options
   */
  async generateWithOutput(projectRoot, options = {}) {
    try {
      console.log(chalk.cyan('🤖 Generating Kiro CLI agents...'));

      const result = await this.generateAgents(projectRoot, options.outputDir, options.force);

      if (result.generated > 0) {
        console.log(chalk.green(`✅ Generated ${result.generated} Kiro CLI agents`));
        if (result.skipped > 0) {
          console.log(chalk.yellow(`⏭️  Skipped ${result.skipped} existing agents`));
        }
        console.log(chalk.dim(`📁 Output: ${result.outputDir}`));
      } else {
        console.log(chalk.yellow('⏭️  All Kiro CLI agents already exist (use --force to regenerate)'));
      }

      return result;
    } catch (error) {
      console.error(chalk.red('❌ Kiro CLI agent generation failed:'), error.message);
      throw error;
    }
  }
  name = 'Kiro CLI Agent Generator';
}

module.exports = { KiroCLIGenerator };
