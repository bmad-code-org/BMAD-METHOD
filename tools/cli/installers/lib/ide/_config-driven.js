const path = require('node:path');
const fs = require('fs-extra');
const chalk = require('chalk');
const yaml = require('yaml');
const { BaseIdeSetup } = require('./_base-ide');
const { UnifiedInstaller } = require('./shared/unified-installer');
const { toSuffixBasedName, getArtifactSuffix, customAgentSuffixName } = require('./shared/path-utils');

/**
 * Load platform codes configuration from platform-codes.yaml
 * @returns {Object} Platform configuration object
 */
async function loadPlatformCodes() {
  const platformCodesPath = path.join(__dirname, 'platform-codes.yaml');

  if (!(await fs.pathExists(platformCodesPath))) {
    console.warn(chalk.yellow('Warning: platform-codes.yaml not found'));
    return { platforms: {} };
  }

  const content = await fs.readFile(platformCodesPath, 'utf8');
  const config = yaml.parse(content);
  return config;
}

/**
 * Config-driven IDE setup handler
 *
 * Reads installer configuration from platform-codes.yaml and uses
 * UnifiedInstaller to perform the actual installation.
 *
 * This eliminates the need for separate installer files for most IDEs.
 */
class ConfigDrivenIdeSetup extends BaseIdeSetup {
  /**
   * @param {string} platformCode - Platform code (e.g., 'claude-code', 'cursor')
   * @param {Object} platformConfig - Platform configuration from platform-codes.yaml
   */
  constructor(platformCode, platformConfig) {
    super(platformCode, platformConfig.name, platformConfig.preferred);
    this.platformConfig = platformConfig;
    this.installerConfig = platformConfig.installer || null;
  }

  /**
   * Setup IDE configuration using config-driven approach
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   * @returns {Promise<Object>} Setup result
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    if (!this.installerConfig) {
      console.warn(chalk.yellow(`No installer configuration found for ${this.name}`));
      return { success: false, reason: 'no-config' };
    }

    // Handle multi-target installations (like github-copilot, opencode)
    if (this.installerConfig.targets) {
      return this.installToMultipleTargets(projectDir, bmadDir, this.installerConfig.targets, options);
    }

    // Handle single-target installations
    if (this.installerConfig.target_dir) {
      return this.installToTarget(projectDir, bmadDir, this.installerConfig, options);
    }

    console.warn(chalk.yellow(`Invalid installer configuration for ${this.name}`));
    return { success: false, reason: 'invalid-config' };
  }

  /**
   * Install artifacts to a single target directory
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} targetConfig - Target configuration
   * @param {Object} options - Setup options
   * @returns {Promise<Object>} Setup result
   */
  async installToTarget(projectDir, bmadDir, targetConfig, options) {
    const targetDir = path.join(projectDir, targetConfig.dir || targetConfig.target_dir);

    // Clean up old BMAD installation first
    await this.cleanupTarget(targetDir, targetConfig.file_extension || '.md');

    // Ensure target directory exists
    await this.ensureDir(targetDir);

    // Get frontmatter template from config (defaults to common-yaml.md)
    const frontmatterTemplate = targetConfig.frontmatter_template || 'common-yaml.md';

    // Use the unified installer
    const installer = new UnifiedInstaller(this.bmadFolderName);
    const counts = await installer.install(
      projectDir,
      bmadDir,
      {
        targetDir,
        namingStyle: 'suffix-based',
        frontmatterTemplate,
        fileExtension: targetConfig.file_extension || '.md',
        skipExisting: targetConfig.skip_existing || false,
        artifactTypes: targetConfig.artifact_types,
      },
      options.selectedModules || [],
    );

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${counts.agents} agents installed`));
    if (counts.workflows > 0) {
      console.log(chalk.dim(`  - ${counts.workflows} workflow commands generated`));
    }
    if (counts.tasks + counts.tools > 0) {
      console.log(
        chalk.dim(`  - ${counts.tasks + counts.tools} task/tool commands generated (${counts.tasks} tasks, ${counts.tools} tools)`),
      );
    }
    console.log(chalk.dim(`  - Target directory: ${path.relative(projectDir, targetDir)}`));

    return {
      success: true,
      agents: counts.agents,
      tasks: counts.tasks,
      tools: counts.tools,
      workflows: counts.workflows,
    };
  }

  /**
   * Install artifacts to multiple target directories
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Array} targets - Array of target configurations
   * @param {Object} options - Setup options
   * @returns {Promise<Object>} Setup result
   */
  async installToMultipleTargets(projectDir, bmadDir, targets, options) {
    const totalCounts = {
      agents: 0,
      workflows: 0,
      tasks: 0,
      tools: 0,
      total: 0,
    };

    const targetNames = [];

    for (const targetConfig of targets) {
      const targetDir = path.join(projectDir, targetConfig.dir);

      // Clean up old BMAD installation first
      await this.cleanupTarget(targetDir, targetConfig.file_extension || '.md');

      // Ensure target directory exists
      await this.ensureDir(targetDir);

      // Get frontmatter template from config (defaults to common-yaml.md)
      const frontmatterTemplate = targetConfig.frontmatter_template || 'common-yaml.md';

      // Use the unified installer for this target
      const installer = new UnifiedInstaller(this.bmadFolderName);
      const counts = await installer.install(
        projectDir,
        bmadDir,
        {
          targetDir,
          namingStyle: 'suffix-based',
          frontmatterTemplate,
          fileExtension: targetConfig.file_extension || '.md',
          skipExisting: targetConfig.skip_existing || false,
          artifactTypes: targetConfig.artifact_types,
        },
        options.selectedModules || [],
      );

      // Accumulate counts
      totalCounts.agents += counts.agents;
      totalCounts.workflows += counts.workflows;
      totalCounts.tasks += counts.tasks;
      totalCounts.tools += counts.tools;

      targetNames.push(path.relative(projectDir, targetDir));
    }

    totalCounts.total = totalCounts.agents + totalCounts.workflows + totalCounts.tasks + totalCounts.tools;

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${totalCounts.agents} agents installed`));
    if (totalCounts.workflows > 0) {
      console.log(chalk.dim(`  - ${totalCounts.workflows} workflow commands generated`));
    }
    if (totalCounts.tasks + totalCounts.tools > 0) {
      console.log(
        chalk.dim(
          `  - ${totalCounts.tasks + totalCounts.tools} task/tool commands generated (${totalCounts.tasks} tasks, ${totalCounts.tools} tools)`,
        ),
      );
    }
    console.log(chalk.dim(`  - Target directories: ${targetNames.join(', ')}`));

    // Handle VS Code settings if needed (for github-copilot)
    if (this.installerConfig.has_vscode_settings) {
      await this.configureVsCodeSettings(projectDir, options);
    }

    return {
      success: true,
      ...totalCounts,
    };
  }

  /**
   * Configure VS Code settings for GitHub Copilot
   * @param {string} projectDir - Project directory
   * @param {Object} options - Setup options
   */
  async configureVsCodeSettings(projectDir, options) {
    const vscodeDir = path.join(projectDir, '.vscode');
    const settingsPath = path.join(vscodeDir, 'settings.json');

    await this.ensureDir(vscodeDir);

    // Read existing settings
    let existingSettings = {};
    if (await fs.pathExists(settingsPath)) {
      try {
        const content = await fs.readFile(settingsPath, 'utf8');
        existingSettings = JSON.parse(content);
      } catch {
        console.warn(chalk.yellow('  Could not parse settings.json, creating new'));
      }
    }

    // BMAD VS Code settings
    const bmadSettings = {
      'chat.agent.enabled': true,
      'chat.agent.maxRequests': 15,
      'github.copilot.chat.agent.runTasks': true,
      'chat.mcp.discovery.enabled': true,
      'github.copilot.chat.agent.autoFix': true,
      'chat.tools.autoApprove': false,
    };

    // Merge settings (existing take precedence)
    const mergedSettings = { ...bmadSettings, ...existingSettings };

    // Write settings
    await fs.writeFile(settingsPath, JSON.stringify(mergedSettings, null, 2));
    console.log(chalk.dim(`  - VS Code settings configured`));
  }

  /**
   * Clean up a specific target directory
   * @param {string} targetDir - Target directory to clean
   * @param {string} [fileExtension='.md'] - File extension to match
   */
  async cleanupTarget(targetDir, fileExtension = '.md') {
    if (!(await fs.pathExists(targetDir))) {
      return;
    }

    const entries = await fs.readdir(targetDir);
    let removed = 0;

    for (const entry of entries) {
      // Remove bmad* files with the matching extension
      if (entry.startsWith('bmad') && entry.endsWith(fileExtension)) {
        await fs.remove(path.join(targetDir, entry));
        removed++;
      }
    }

    if (removed > 0) {
      console.log(chalk.dim(`  Cleaned up ${removed} existing BMAD files`));
    }
  }

  /**
   * Cleanup IDE configuration
   * @param {string} projectDir - Project directory
   */
  async cleanup(projectDir) {
    if (!this.installerConfig) {
      return;
    }

    // Handle multi-target cleanup
    if (this.installerConfig.targets) {
      for (const targetConfig of this.installerConfig.targets) {
        const targetDir = path.join(projectDir, targetConfig.dir);
        await this.cleanupTarget(targetDir, targetConfig.file_extension || '.md');
      }
      return;
    }

    // Handle single-target cleanup
    if (this.installerConfig.target_dir) {
      const targetDir = path.join(projectDir, this.installerConfig.target_dir);
      await this.cleanupTarget(targetDir, this.installerConfig.file_extension || '.md');
    }
  }

  /**
   * Install a custom agent launcher for this IDE
   * @param {string} projectDir - Project directory
   * @param {string} agentName - Agent name (e.g., "fred-commit-poet")
   * @param {string} agentPath - Path to compiled agent (relative to project root)
   * @param {Object} metadata - Agent metadata
   * @returns {Object|null} Info about created command
   */
  async installCustomAgentLauncher(projectDir, agentName, agentPath, metadata) {
    if (!this.installerConfig) {
      return null;
    }

    // Determine target directory for agents
    let targetDir;
    let fileExtension = '.md';
    let frontmatterTemplate = 'common-yaml.md';

    if (this.installerConfig.targets) {
      // For multi-target IDEs like github-copilot, find the agents target
      const agentsTarget = this.installerConfig.targets.find((t) => t.artifact_types && t.artifact_types.includes('agents'));
      if (!agentsTarget) {
        return null; // No agents target found
      }
      targetDir = path.join(projectDir, agentsTarget.dir);
      fileExtension = agentsTarget.file_extension || '.md';
      frontmatterTemplate = agentsTarget.frontmatter_template || 'common-yaml.md';
    } else if (this.installerConfig.target_dir) {
      targetDir = path.join(projectDir, this.installerConfig.target_dir);
      fileExtension = this.installerConfig.file_extension || '.md';
      frontmatterTemplate = this.installerConfig.frontmatter_template || 'common-yaml.md';
    } else {
      return null;
    }

    if (!(await this.exists(targetDir))) {
      return null;
    }

    await this.ensureDir(targetDir);

    // Create launcher content using frontmatter template
    const launcherContent = await this.createLauncherContent(agentName, agentPath, metadata, frontmatterTemplate);

    // Use suffix-based naming for custom agents
    const fileName = customAgentSuffixName(agentName, fileExtension);
    const launcherPath = path.join(targetDir, fileName);
    await this.writeFile(launcherPath, launcherContent);

    return {
      path: launcherPath,
      command: fileName.replace(fileExtension, ''),
    };
  }

  /**
   * Create launcher content using frontmatter template
   * @param {string} agentName - Agent name
   * @param {string} agentPath - Path to agent file
   * @param {Object} metadata - Agent metadata
   * @param {string} frontmatterTemplate - Template filename
   * @returns {Promise<string>} Launcher content
   */
  async createLauncherContent(agentName, agentPath, metadata, frontmatterTemplate) {
    const title = metadata.title || this.formatTitle(agentName);

    // Base activation content
    const activationContent = `You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.

<agent-activation CRITICAL="TRUE">
1. LOAD the FULL agent file from @${agentPath}
2. READ its entire contents - this contains the complete agent persona, menu, and instructions
3. FOLLOW every step in the <activation> section precisely
4. DISPLAY the welcome/greeting as instructed
5. PRESENT the numbered menu
6. WAIT for user input before proceeding
</agent-activation>
`;

    // Load frontmatter template
    const { UnifiedInstaller } = require('./shared/unified-installer');
    const installer = new UnifiedInstaller(this.bmadFolderName);
    const templateContent = await installer.loadFrontmatterTemplate(frontmatterTemplate);

    if (!templateContent) {
      // Fallback to basic YAML
      return `---
name: '${agentName}'
description: '${title} agent'
---

${activationContent}`;
    }

    // Apply template variables
    const variables = {
      name: agentName,
      title,
      displayName: agentName,
      description: `Activates the ${title} agent persona.`,
      icon: '🤖',
      content: activationContent,
      tools: JSON.stringify([
        'changes',
        'edit',
        'fetch',
        'githubRepo',
        'problems',
        'runCommands',
        'runTasks',
        'runTests',
        'search',
        'runSubagent',
        'testFailure',
        'todos',
        'usages',
      ]),
    };

    let result = templateContent;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replaceAll(`{{${key}}}`, value);
    }

    // Handle TOML templates specially
    if (frontmatterTemplate.includes('toml')) {
      const escapedContent = activationContent.replaceAll('"""', String.raw`\"\"\"`);
      result = result.replace(
        /prompt = """/,
        `prompt = """\n**⚠️ IMPORTANT**: Run @${agentPath} first to load the complete agent!\n\n${escapedContent}`,
      );
      return result;
    }

    return result + activationContent;
  }
}

module.exports = {
  ConfigDrivenIdeSetup,
  loadPlatformCodes,
};
