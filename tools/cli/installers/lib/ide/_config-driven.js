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

    // Skip targets with explicitly empty artifact_types array
    // This prevents creating empty directories when no artifacts will be written
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

    // Install tasks and tools using template system (supports TOML for Gemini, MD for others)
    if (!artifact_types || artifact_types.includes('tasks') || artifact_types.includes('tools')) {
      const taskToolGen = new TaskToolCommandGenerator(this.bmadFolderName);
      const { artifacts } = await taskToolGen.collectTaskToolArtifacts(bmadDir);
      const taskToolResult = await this.writeTaskToolArtifacts(targetPath, artifacts, template_type, config);
      results.tasks = taskToolResult.tasks || 0;
      results.tools = taskToolResult.tools || 0;
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
    const { content: template, extension } = await this.loadTemplate(templateType, 'agent', config, 'default-agent');
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
        // Use different template based on workflow type (YAML vs MD)
        // Default to 'default' template type, but allow override via config
        const workflowTemplateType = artifact.isYamlWorkflow
          ? config.yaml_workflow_template || `${templateType}-workflow-yaml`
          : config.md_workflow_template || `${templateType}-workflow`;

        // Fall back to default templates if specific ones don't exist
        const finalTemplateType = artifact.isYamlWorkflow ? 'default-workflow-yaml' : 'default-workflow';
        // workflowTemplateType already contains full name (e.g., 'gemini-workflow-yaml'), so pass empty artifactType
        const { content: template, extension } = await this.loadTemplate(workflowTemplateType, '', config, finalTemplateType);
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
   * Write task/tool artifacts to target directory using templates
   * @param {string} targetPath - Target directory path
   * @param {Array} artifacts - Task/tool artifacts
   * @param {string} templateType - Template type to use
   * @param {Object} config - Installation configuration
   * @returns {Promise<Object>} Counts of tasks and tools written
   */
  async writeTaskToolArtifacts(targetPath, artifacts, templateType, config = {}) {
    let taskCount = 0;
    let toolCount = 0;

    // Pre-load templates to avoid repeated file I/O in the loop
    const taskTemplate = await this.loadTemplate(templateType, 'task', config, 'default-task');
    const toolTemplate = await this.loadTemplate(templateType, 'tool', config, 'default-tool');

    const { artifact_types } = config;

    for (const artifact of artifacts) {
      if (artifact.type !== 'task' && artifact.type !== 'tool') {
        continue;
      }

      // Skip if the specific artifact type is not requested in config
      if (artifact_types) {
        if (artifact.type === 'task' && !artifact_types.includes('tasks')) continue;
        if (artifact.type === 'tool' && !artifact_types.includes('tools')) continue;
      }

      // Use pre-loaded template based on artifact type
      const { content: template, extension } = artifact.type === 'task' ? taskTemplate : toolTemplate;

      const content = this.renderTemplate(template, artifact);
      const filename = this.generateFilename(artifact, artifact.type, extension);
      const filePath = path.join(targetPath, filename);
      await this.writeFile(filePath, content);

      if (artifact.type === 'task') {
        taskCount++;
      } else {
        toolCount++;
      }
    }

    return { tasks: taskCount, tools: toolCount };
  }

  /**
   * Load template based on type and configuration
   * @param {string} templateType - Template type (claude, windsurf, etc.)
   * @param {string} artifactType - Artifact type (agent, workflow, task, tool)
   * @param {Object} config - Installation configuration
   * @param {string} fallbackTemplateType - Fallback template type if requested template not found
   * @returns {Promise<{content: string, extension: string}>} Template content and extension
   */
  async loadTemplate(templateType, artifactType, config = {}, fallbackTemplateType = null) {
    const { header_template, body_template } = config;

    // Check for separate header/body templates
    if (header_template || body_template) {
      const content = await this.loadSplitTemplates(templateType, artifactType, header_template, body_template);
      // Allow config to override extension, default to .md
      const ext = config.extension || '.md';
      const normalizedExt = ext.startsWith('.') ? ext : `.${ext}`;
      return { content, extension: normalizedExt };
    }

    // Load combined template - try multiple extensions
    // If artifactType is empty, templateType already contains full name (e.g., 'gemini-workflow-yaml')
    const templateBaseName = artifactType ? `${templateType}-${artifactType}` : templateType;
    const templateDir = path.join(__dirname, 'templates', 'combined');
    const extensions = ['.md', '.toml', '.yaml', '.yml'];

    for (const ext of extensions) {
      const templatePath = path.join(templateDir, templateBaseName + ext);
      if (await fs.pathExists(templatePath)) {
        const content = await fs.readFile(templatePath, 'utf8');
        return { content, extension: ext };
      }
    }

    // Fall back to default template (if provided)
    if (fallbackTemplateType) {
      for (const ext of extensions) {
        const fallbackPath = path.join(templateDir, `${fallbackTemplateType}${ext}`);
        if (await fs.pathExists(fallbackPath)) {
          const content = await fs.readFile(fallbackPath, 'utf8');
          return { content, extension: ext };
        }
      }
    }

    // Ultimate fallback - minimal template
    return { content: this.getDefaultTemplate(artifactType), extension: '.md' };
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
disable-model-invocation: true
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
disable-model-invocation: true
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
    switch (artifact.type) {
      case 'agent-launcher': {
        pathToUse = artifact.agentPath || artifact.relativePath || '';

        break;
      }
      case 'workflow-command': {
        pathToUse = artifact.workflowPath || artifact.relativePath || '';

        break;
      }
      case 'task':
      case 'tool': {
        pathToUse = artifact.path || artifact.relativePath || '';

        break;
      }
      // No default
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
   * @param {string} extension - File extension to use (e.g., '.md', '.toml')
   * @returns {string} Generated filename
   */
  generateFilename(artifact, artifactType, extension = '.md') {
    const { toDashPath } = require('./shared/path-utils');

    // Reuse central logic to ensure consistent naming conventions
    const standardName = toDashPath(artifact.relativePath);

    // Clean up potential double extensions from source files (e.g. .yaml.md, .xml.md -> .md)
    // This handles any extensions that might slip through toDashPath()
    const baseName = standardName.replace(/\.(md|yaml|yml|json|xml|toml)\.md$/i, '.md');

    // If using default markdown, preserve the bmad-agent- prefix for agents
    if (extension === '.md') {
      return baseName;
    }

    // For other extensions (e.g., .toml), replace .md extension
    // Note: agent prefix is preserved even with non-markdown extensions
    return baseName.replace(/\.md$/, extension);
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
