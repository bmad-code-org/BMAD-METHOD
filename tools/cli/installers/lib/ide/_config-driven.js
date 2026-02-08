const path = require('node:path');
const fs = require('fs-extra');
const { BaseIdeSetup } = require('./_base-ide');
const prompts = require('../../../lib/prompts');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');
const { WorkflowCommandGenerator } = require('./shared/workflow-command-generator');
const { TaskToolCommandGenerator } = require('./shared/task-tool-command-generator');

/**
 * Config-driven IDE setup handler
 *
 * This class provides a standardized way to install BMAD artifacts to IDEs
 * based on configuration in platform-codes.yaml. It eliminates the need for
 * individual installer files for each IDE.
 *
 * Features:
 * - Config-driven from platform-codes.yaml
 * - Template-based content generation
 * - Multi-target installation support (e.g., GitHub Copilot)
 * - Artifact type filtering (agents, workflows, tasks, tools)
 */
class ConfigDrivenIdeSetup extends BaseIdeSetup {
  constructor(platformCode, platformConfig) {
    super(platformCode, platformConfig.name, platformConfig.preferred);
    this.platformConfig = platformConfig;
    this.installerConfig = platformConfig.installer || null;
  }

  /**
   * Main setup method - called by IdeManager
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   * @returns {Promise<Object>} Setup result
   */
  async setup(projectDir, bmadDir, options = {}) {
    if (!options.silent) await prompts.log.info(`Setting up ${this.name}...`);

    // Clean up any old BMAD installation first
    await this.cleanup(projectDir, options);

    if (!this.installerConfig) {
      return { success: false, reason: 'no-config' };
    }

    // Handle multi-target installations (e.g., GitHub Copilot)
    if (this.installerConfig.targets) {
      return this.installToMultipleTargets(projectDir, bmadDir, this.installerConfig.targets, options);
    }

    // Handle single-target installations
    if (this.installerConfig.target_dir) {
      return this.installToTarget(projectDir, bmadDir, this.installerConfig, options);
    }

    return { success: false, reason: 'invalid-config' };
  }

  /**
   * Install to a single target directory
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} config - Installation configuration
   * @param {Object} options - Setup options
   * @returns {Promise<Object>} Installation result
   */
  async installToTarget(projectDir, bmadDir, config, options) {
    const { target_dir, template_type, artifact_types } = config;

    // Skip explicitly empty targets to avoid creating empty command directories.
    if (Array.isArray(artifact_types) && artifact_types.length === 0) {
      return { success: true, results: { agents: 0, workflows: 0, tasks: 0, tools: 0 } };
    }

    const targetPath = path.join(projectDir, target_dir);
    await this.ensureDir(targetPath);

    const selectedModules = options.selectedModules || [];
    const results = { agents: 0, workflows: 0, tasks: 0, tools: 0 };

    // Install agents
    if (!artifact_types || artifact_types.includes('agents')) {
      const agentGen = new AgentCommandGenerator(this.bmadFolderName);
      const { artifacts } = await agentGen.collectAgentArtifacts(bmadDir, selectedModules);
      results.agents = await this.writeAgentArtifacts(targetPath, artifacts, template_type, config);
    }

    // Install workflows
    if (!artifact_types || artifact_types.includes('workflows')) {
      const workflowGen = new WorkflowCommandGenerator(this.bmadFolderName);
      const { artifacts } = await workflowGen.collectWorkflowArtifacts(bmadDir);
      results.workflows = await this.writeWorkflowArtifacts(targetPath, artifacts, template_type, config);
    }

    // Install tasks and tools
    if (!artifact_types || artifact_types.includes('tasks') || artifact_types.includes('tools')) {
      const taskToolGen = new TaskToolCommandGenerator();
      const { artifacts } = await taskToolGen.collectTaskToolArtifacts(bmadDir);
      const taskToolResult = await this.writeTaskToolArtifacts(targetPath, artifacts, template_type, config, artifact_types);
      results.tasks = taskToolResult.tasks;
      results.tools = taskToolResult.tools;
    }

    await this.printSummary(results, target_dir, options);
    return { success: true, results };
  }

  /**
   * Install to multiple target directories
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Array} targets - Array of target configurations
   * @param {Object} options - Setup options
   * @returns {Promise<Object>} Installation result
   */
  async installToMultipleTargets(projectDir, bmadDir, targets, options) {
    const allResults = { agents: 0, workflows: 0, tasks: 0, tools: 0 };

    for (const target of targets) {
      const result = await this.installToTarget(projectDir, bmadDir, target, options);
      if (result.success) {
        allResults.agents += result.results.agents || 0;
        allResults.workflows += result.results.workflows || 0;
        allResults.tasks += result.results.tasks || 0;
        allResults.tools += result.results.tools || 0;
      }
    }

    return { success: true, results: allResults };
  }

  /**
   * Write agent artifacts to target directory
   * @param {string} targetPath - Target directory path
   * @param {Array} artifacts - Agent artifacts
   * @param {string} templateType - Template type to use
   * @param {Object} config - Installation configuration
   * @returns {Promise<number>} Count of artifacts written
   */
  async writeAgentArtifacts(targetPath, artifacts, templateType, config = {}) {
    // Try to load platform-specific template, fall back to default-agent
    const { template, extension } = await this.loadTemplateWithMetadata(templateType, 'agent', config, 'default-agent');
    let count = 0;

    for (const artifact of artifacts) {
      const content = this.renderTemplate(template, artifact);
      const filename = this.generateFilename(artifact, 'agent', extension);
      const filePath = path.join(targetPath, filename);
      await this.writeFile(filePath, content);
      count++;
    }

    return count;
  }

  /**
   * Write workflow artifacts to target directory
   * @param {string} targetPath - Target directory path
   * @param {Array} artifacts - Workflow artifacts
   * @param {string} templateType - Template type to use
   * @param {Object} config - Installation configuration
   * @returns {Promise<number>} Count of artifacts written
   */
  async writeWorkflowArtifacts(targetPath, artifacts, templateType, config = {}) {
    let count = 0;

    for (const artifact of artifacts) {
      if (artifact.type === 'workflow-command') {
        // Allow explicit override, but normalize to template type prefix (without "-workflow" suffix)
        const workflowTemplateType = (config.md_workflow_template || templateType).replace(/-workflow$/, '');

        // Fall back to default template if the requested one doesn't exist
        const finalTemplateType = 'default-workflow';
        const { template, extension } = await this.loadTemplateWithMetadata(workflowTemplateType, 'workflow', config, finalTemplateType);
        const content = this.renderTemplate(template, artifact);
        const filename = this.generateFilename(artifact, 'workflow', extension);
        const filePath = path.join(targetPath, filename);
        await this.writeFile(filePath, content);
        count++;
      }
    }

    return count;
  }

  /**
   * Write task/tool artifacts to target directory
   * @param {string} targetPath - Target directory path
   * @param {Array} artifacts - Task/tool artifacts
   * @param {string} templateType - Template type to use
   * @param {Object} config - Installation configuration
   * @param {Array<string>} artifactTypes - Optional include filter from installer config
   * @returns {Promise<{tasks:number,tools:number}>} Count of artifacts written
   */
  async writeTaskToolArtifacts(targetPath, artifacts, templateType, config = {}, artifactTypes = null) {
    let tasks = 0;
    let tools = 0;
    const templateCache = new Map();

    for (const artifact of artifacts) {
      if (artifact.type !== 'task' && artifact.type !== 'tool') {
        continue;
      }

      if (artifactTypes && !artifactTypes.includes(`${artifact.type}s`)) {
        continue;
      }

      const cacheKey = `${templateType}:${artifact.type}`;
      if (!templateCache.has(cacheKey)) {
        const loaded = await this.loadTemplateWithMetadata(templateType, artifact.type, config, `default-${artifact.type}`);
        templateCache.set(cacheKey, loaded);
      }

      const { template, extension } = templateCache.get(cacheKey);
      const content = this.renderTemplate(template, artifact);
      const filename = this.generateFilename(artifact, artifact.type, extension);
      const filePath = path.join(targetPath, filename);
      await this.writeFile(filePath, content);

      if (artifact.type === 'task') {
        tasks++;
      } else {
        tools++;
      }
    }

    return { tasks, tools };
  }

  /**
   * Load template based on type and configuration
   * @param {string} templateType - Template type (claude, windsurf, etc.)
   * @param {string} artifactType - Artifact type (agent, workflow, task, tool)
   * @param {Object} config - Installation configuration
   * @param {string} fallbackTemplateType - Fallback template type if requested template not found
   * @returns {Promise<string>} Template content
   */
  async loadTemplate(templateType, artifactType, config = {}, fallbackTemplateType = null) {
    const { template } = await this.loadTemplateWithMetadata(templateType, artifactType, config, fallbackTemplateType);
    return template;
  }

  /**
   * Load template with file extension metadata for extension-aware command generation
   * @param {string} templateType - Template type (claude, windsurf, etc.)
   * @param {string} artifactType - Artifact type (agent, workflow, task, tool)
   * @param {Object} config - Installation configuration
   * @param {string} fallbackTemplateType - Fallback template type if requested template not found
   * @returns {Promise<{template:string, extension:string}>} Template content and extension
   */
  async loadTemplateWithMetadata(templateType, artifactType, config = {}, fallbackTemplateType = null) {
    const { header_template, body_template } = config;
    const supportedExtensions = ['.md', '.toml', '.yaml', '.yml', '.json', '.txt'];

    // Check for separate header/body templates
    if (header_template || body_template) {
      const template = await this.loadSplitTemplates(templateType, artifactType, header_template, body_template);
      return { template, extension: this.normalizeExtension(config.extension) };
    }

    // Load combined template with extension detection
    const templateBaseName = artifactType ? `${templateType}-${artifactType}` : templateType;
    for (const extension of supportedExtensions) {
      const templateName = `${templateBaseName}${extension}`;
      const templatePath = path.join(__dirname, 'templates', 'combined', templateName);
      if (await fs.pathExists(templatePath)) {
        return {
          template: await fs.readFile(templatePath, 'utf8'),
          extension,
        };
      }
    }

    // Fall back to default template (if provided)
    if (fallbackTemplateType) {
      for (const extension of supportedExtensions) {
        const fallbackPath = path.join(__dirname, 'templates', 'combined', `${fallbackTemplateType}${extension}`);
        if (await fs.pathExists(fallbackPath)) {
          return {
            template: await fs.readFile(fallbackPath, 'utf8'),
            extension,
          };
        }
      }
    }

    // Ultimate fallback - minimal template
    return {
      template: this.getDefaultTemplate(artifactType),
      extension: '.md',
    };
  }

  /**
   * Load split templates (header + body)
   * @param {string} templateType - Template type
   * @param {string} artifactType - Artifact type
   * @param {string} headerTpl - Header template name
   * @param {string} bodyTpl - Body template name
   * @returns {Promise<string>} Combined template content
   */
  async loadSplitTemplates(templateType, artifactType, headerTpl, bodyTpl) {
    let header = '';
    let body = '';

    // Load header template
    if (headerTpl) {
      const headerPath = path.join(__dirname, 'templates', 'split', headerTpl);
      if (await fs.pathExists(headerPath)) {
        header = await fs.readFile(headerPath, 'utf8');
      }
    } else {
      // Use default header for template type
      const defaultHeaderPath = path.join(__dirname, 'templates', 'split', templateType, 'header.md');
      if (await fs.pathExists(defaultHeaderPath)) {
        header = await fs.readFile(defaultHeaderPath, 'utf8');
      }
    }

    // Load body template
    if (bodyTpl) {
      const bodyPath = path.join(__dirname, 'templates', 'split', bodyTpl);
      if (await fs.pathExists(bodyPath)) {
        body = await fs.readFile(bodyPath, 'utf8');
      }
    } else {
      // Use default body for template type
      const defaultBodyPath = path.join(__dirname, 'templates', 'split', templateType, 'body.md');
      if (await fs.pathExists(defaultBodyPath)) {
        body = await fs.readFile(defaultBodyPath, 'utf8');
      }
    }

    // Combine header and body
    return `${header}\n${body}`;
  }

  normalizeExtension(extension) {
    if (!extension) {
      return '.md';
    }

    const trimmed = String(extension).trim();
    if (trimmed === '') {
      return '.md';
    }

    return trimmed.startsWith('.') ? trimmed : `.${trimmed}`;
  }

  /**
   * Get default minimal template
   * @param {string} artifactType - Artifact type
   * @returns {string} Default template
   */
  getDefaultTemplate(artifactType) {
    if (artifactType === 'agent') {
      return `---
name: '{{name}}'
description: '{{description}}'
---

You must fully embody this agent's persona and follow all activation instructions exactly as specified.

<agent-activation CRITICAL="TRUE">
1. LOAD the FULL agent file from {project-root}/{{bmadFolderName}}/{{path}}
2. READ its entire contents - this contains the complete agent persona, menu, and instructions
3. FOLLOW every step in the <activation> section precisely
</agent-activation>
`;
    }
    return `---
name: '{{name}}'
description: '{{description}}'
---

# {{name}}

LOAD and execute from: {project-root}/{{bmadFolderName}}/{{path}}
`;
  }

  /**
   * Render template with artifact data
   * @param {string} template - Template content
   * @param {Object} artifact - Artifact data
   * @returns {string} Rendered content
   */
  renderTemplate(template, artifact) {
    // Use the appropriate path property based on artifact type
    let pathToUse = artifact.relativePath || '';
    if (artifact.type === 'agent-launcher') {
      pathToUse = artifact.agentPath || artifact.relativePath || '';
    } else if (artifact.type === 'workflow-command') {
      pathToUse = artifact.workflowPath || artifact.relativePath || '';
    }

    let rendered = template
      .replaceAll('{{name}}', artifact.name || '')
      .replaceAll('{{module}}', artifact.module || 'core')
      .replaceAll('{{path}}', pathToUse)
      .replaceAll('{{description}}', artifact.description || `${artifact.name} ${artifact.type || ''}`)
      .replaceAll('{{workflow_path}}', pathToUse);

    // Replace _bmad placeholder with actual folder name
    rendered = rendered.replaceAll('_bmad', this.bmadFolderName);

    // Replace {{bmadFolderName}} placeholder if present
    rendered = rendered.replaceAll('{{bmadFolderName}}', this.bmadFolderName);

    return rendered;
  }

  /**
   * Generate filename for artifact
   * @param {Object} artifact - Artifact data
   * @param {string} artifactType - Artifact type (agent, workflow, task, tool)
   * @returns {string} Generated filename
   */
  generateFilename(artifact, artifactType, extension = '.md') {
    const { toDashPath } = require('./shared/path-utils');
    // toDashPath already handles the .agent.md suffix for agents correctly
    // No need to add it again here
    const dashName = toDashPath(artifact.relativePath);
    if (extension === '.md') {
      return dashName;
    }
    return dashName.replace(/\.md$/i, extension);
  }

  /**
   * Print installation summary
   * @param {Object} results - Installation results
   * @param {string} targetDir - Target directory (relative)
   */
  async printSummary(results, targetDir, options = {}) {
    if (options.silent) return;
    const parts = [];
    if (results.agents > 0) parts.push(`${results.agents} agents`);
    if (results.workflows > 0) parts.push(`${results.workflows} workflows`);
    if (results.tasks > 0) parts.push(`${results.tasks} tasks`);
    if (results.tools > 0) parts.push(`${results.tools} tools`);
    await prompts.log.success(`${this.name} configured: ${parts.join(', ')} → ${targetDir}`);
  }

  /**
   * Cleanup IDE configuration
   * @param {string} projectDir - Project directory
   */
  async cleanup(projectDir, options = {}) {
    // Clean all target directories
    if (this.installerConfig?.targets) {
      for (const target of this.installerConfig.targets) {
        await this.cleanupTarget(projectDir, target.target_dir, options);
      }
    } else if (this.installerConfig?.target_dir) {
      await this.cleanupTarget(projectDir, this.installerConfig.target_dir, options);
    }
  }

  /**
   * Cleanup a specific target directory
   * @param {string} projectDir - Project directory
   * @param {string} targetDir - Target directory to clean
   */
  async cleanupTarget(projectDir, targetDir, options = {}) {
    const targetPath = path.join(projectDir, targetDir);

    if (!(await fs.pathExists(targetPath))) {
      return;
    }

    // Remove all bmad* files
    let entries;
    try {
      entries = await fs.readdir(targetPath);
    } catch {
      // Directory exists but can't be read - skip cleanup
      return;
    }

    if (!entries || !Array.isArray(entries)) {
      return;
    }

    let removedCount = 0;

    for (const entry of entries) {
      if (!entry || typeof entry !== 'string') {
        continue;
      }
      if (entry.startsWith('bmad')) {
        const entryPath = path.join(targetPath, entry);
        try {
          await fs.remove(entryPath);
          removedCount++;
        } catch {
          // Skip entries that can't be removed (broken symlinks, permission errors)
        }
      }
    }

    if (removedCount > 0 && !options.silent) {
      await prompts.log.message(`  Cleaned ${removedCount} BMAD files from ${targetDir}`);
    }
  }
}

module.exports = { ConfigDrivenIdeSetup };
