const path = require('node:path');
const fs = require('fs-extra');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const { KiroCLIGenerator } = require('../../../lib/kiro-cli-generator');

/**
 * Kiro CLI setup handler
 * Generates Kiro CLI agent files from BMAD agent manifest
 */
class KiroCliSetup extends BaseIdeSetup {
  constructor() {
    super('kiro-cli', 'Kiro CLI');
    this.configDir = '.kiro';
    this.agentsDir = 'agents';
    this.kiroGenerator = new KiroCLIGenerator();
  }

  /**
   * Setup Kiro CLI configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} config - Configuration object
   * @returns {Promise<Object>} Setup result
   */
  async setup(projectDir, bmadDir, config) {
    try {
      console.log(chalk.cyan('  Setting up Kiro CLI integration...'));

      const outputDir = path.join(projectDir, this.configDir, this.agentsDir);

      // Generate Kiro CLI agents from BMAD manifest
      const result = await this.kiroGenerator.generateAgents(
        projectDir,
        outputDir,
        true, // Force overwrite to ensure latest versions
      );

      console.log(chalk.green(`  ✅ Generated ${result.generated} Kiro CLI agents`));

      if (result.skipped > 0) {
        console.log(chalk.dim(`     (${result.skipped} agents were up to date)`));
      }

      // Create a simple readme for Kiro CLI users
      const readmePath = path.join(outputDir, 'README.md');
      const readmeContent = `# BMAD Kiro CLI Agents

Auto-generated Kiro CLI agents from your BMAD installation.

## Usage

\`\`\`bash
# Use any BMAD agent in Kiro CLI
kiro-cli chat --agent analyst          # Strategic Business Analyst
kiro-cli chat --agent architect        # System Architect  
kiro-cli chat --agent dev             # Senior Developer
kiro-cli chat --agent pm              # Product Manager
kiro-cli chat --agent sm              # Scrum Master
kiro-cli chat --agent tea             # Test Architect
kiro-cli chat --agent tech-writer     # Technical Writer
kiro-cli chat --agent ux-designer     # UX Designer

# Specialist agents
kiro-cli chat --agent codebase-analyzer
kiro-cli chat --agent tech-debt-auditor
kiro-cli chat --agent market-researcher
# ... and many more
\`\`\`

## Features

- **Lazy Loading**: Workflows loaded on-demand for context efficiency
- **File Outputs**: Generate structured deliverables
- **Conversational**: Optimized for Kiro CLI interaction
- **Full BMAD Capabilities**: Access to all workflows and expertise

## Updates

These agents are automatically regenerated when you update BMAD.
Manual regeneration: \`npm run bmad:generate-kiro-cli --force\`

Generated: ${new Date().toISOString()}
`;

      await fs.writeFile(readmePath, readmeContent);

      return {
        success: true,
        message: `Kiro CLI integration complete with ${result.generated} agents`,
        details: {
          agentsGenerated: result.generated,
          outputDirectory: outputDir,
          totalAgents: result.total,
        },
      };
    } catch (error) {
      console.error(chalk.red('  ❌ Kiro CLI setup failed:'), error.message);
      return {
        success: false,
        message: `Kiro CLI setup failed: ${error.message}`,
        error: error,
      };
    }
  }

  /**
   * Check if Kiro CLI is available/configured in the project
   * @param {string} projectDir - Project directory
   * @returns {Promise<boolean>} True if Kiro CLI is detected
   */
  async isConfigured(projectDir) {
    const kiroDir = path.join(projectDir, this.configDir);
    return await fs.pathExists(kiroDir);
  }

  /**
   * Get setup instructions for Kiro CLI
   * @returns {string} Setup instructions
   */
  getSetupInstructions() {
    return `Kiro CLI agents will be generated automatically.
After setup, use: kiro-cli chat --agent <agent-name>

Example: kiro-cli chat --agent analyst`;
  }

  /**
   * Validate Kiro CLI setup
   * @param {string} projectDir - Project directory
   * @returns {Promise<Object>} Validation result
   */
  async validate(projectDir) {
    const agentsDir = path.join(projectDir, this.configDir, this.agentsDir);

    if (!(await fs.pathExists(agentsDir))) {
      return {
        valid: false,
        message: 'Kiro CLI agents directory not found',
      };
    }

    // Check if we have agent files
    const files = await fs.readdir(agentsDir);
    const agentFiles = files.filter((f) => f.endsWith('.json'));

    if (agentFiles.length === 0) {
      return {
        valid: false,
        message: 'No Kiro CLI agent files found',
      };
    }

    return {
      valid: true,
      message: `Kiro CLI integration ready with ${agentFiles.length} agents`,
      details: {
        agentCount: agentFiles.length,
        agentsDir: agentsDir,
      },
    };
  }
}

module.exports = { KiroCliSetup };
