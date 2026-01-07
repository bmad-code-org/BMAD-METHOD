const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');

/**
 * BMM Platform-specific installer for Windsurf
 *
 * @param {Object} options - Installation options
 * @param {string} options.projectRoot - The root directory of the target project
 * @param {Object} options.config - Module configuration from module.yaml
 * @param {Object} options.logger - Logger instance for output
 * @returns {Promise<boolean>} - Success status
 */
async function install(options) {
  const { projectRoot, logger } = options;

  try {
    logger.log(chalk.cyan('  BMM-Windsurf Specifics installed'));

    // Create .windsurfrules/commands directory if Windsurf uses slash commands
    // Note: Windsurf's command system may differ from Claude Code
    // This creates commands in .claude-commands as a fallback for cross-compatibility
    const commandsDir = path.join(projectRoot, '.claude-commands');
    await fs.ensureDir(commandsDir);

    // Install batch-super-dev slash command
    const batchSuperDevCommand = `---
name: batch-super-dev
description: "Interactive batch selector for super-dev-pipeline - select and process multiple ready-for-dev stories with full quality gates"
group: implementation
---

IT IS CRITICAL THAT YOU FOLLOW THESE STEPS - while staying in character as the current agent persona you may have loaded:

<steps CRITICAL="TRUE">
1. Always LOAD the FULL @_bmad/core/tasks/workflow.xml
2. READ its entire contents - this is the CORE OS for EXECUTING the specific workflow-config @_bmad/bmm/workflows/4-implementation/batch-super-dev/workflow.yaml
3. Pass the yaml path _bmad/bmm/workflows/4-implementation/batch-super-dev/workflow.yaml as 'workflow-config' parameter to the workflow.xml instructions
4. Follow workflow.xml instructions EXACTLY as written to process and follow the specific workflow config and its instructions
5. Save outputs after EACH section when generating any documents from templates
</steps>
`;

    const batchCommandPath = path.join(commandsDir, 'batch-super-dev.md');
    await fs.writeFile(batchCommandPath, batchSuperDevCommand);
    logger.log(chalk.green(`    ✓ Created /batch-super-dev command`));

    // Install super-dev-pipeline slash command
    const superDevPipelineCommand = `---
description: 'Step-file workflow with anti-vibe-coding enforcement - works for greenfield AND brownfield development'
---

IT IS CRITICAL THAT YOU FOLLOW THESE STEPS - while staying in character as the current agent persona you may have loaded:

<steps CRITICAL="TRUE">
1. Always LOAD the FULL @_bmad/core/tasks/workflow.xml
2. READ its entire contents - this is the CORE OS for EXECUTING the specific workflow-config @_bmad/bmm/workflows/4-implementation/super-dev-pipeline/workflow.yaml
3. Pass the yaml path _bmad/bmm/workflows/4-implementation/super-dev-pipeline/workflow.yaml as 'workflow-config' parameter to the workflow.xml instructions
4. Follow workflow.xml instructions EXACTLY as written to process and follow the specific workflow config and its instructions
5. Save outputs after EACH section when generating any documents from templates
</steps>
`;

    const superDevCommandPath = path.join(commandsDir, 'super-dev-pipeline.md');
    await fs.writeFile(superDevCommandPath, superDevPipelineCommand);
    logger.log(chalk.green(`    ✓ Created /super-dev-pipeline command`));

    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing BMM Windsurf specifics: ${error.message}`));
    return false;
  }
}

module.exports = { install };
