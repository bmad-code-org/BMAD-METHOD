/**
 * Unified BMAD Installer for all IDEs
 *
 * ALL IDE configuration comes from platform-codes.yaml
 * NO IDE-specific code in this file - just loads and applies templates
 */

const path = require('node:path');
const fs = require('fs-extra');
const chalk = require('chalk');
const { AgentCommandGenerator } = require('./agent-command-generator');
const { WorkflowCommandGenerator } = require('./workflow-command-generator');
const { TaskToolCommandGenerator } = require('./task-tool-command-generator');
const { toColonPath, toDashPath, toSuffixBasedName, getArtifactSuffix } = require('./path-utils');

/**
 * Naming styles
 * @deprecated Use 'suffix-based' for all new installations
 */
const NamingStyle = {
  FLAT_COLON: 'flat-colon',
  FLAT_DASH: 'flat-dash',
  NESTED: 'nested',
  SUFFIX_BASED: 'suffix-based',
};

/**
 * Unified installer configuration
 * @typedef {Object} UnifiedInstallConfig
 * @property {string} targetDir - Full path to target directory
 * @property {NamingStyle} namingStyle - How to name files
 * @property {string} [frontmatterTemplate] - Frontmatter template filename (from platform-codes.yaml)
 * @property {string} [fileExtension='.md'] - File extension including dot
 * @property {boolean} includeNestedStructure - For NESTED style, create subdirectories
 * @property {Function} [customTemplateFn] - Optional custom template function
 */

/**
 * Unified BMAD Installer
 *
 * Driven entirely by platform-codes.yaml configuration
 * Frontmatter templates are loaded from templates/frontmatter/ directory
 */
class UnifiedInstaller {
  constructor(bmadFolderName = 'bmad') {
    this.bmadFolderName = bmadFolderName;
    this.templateDir = path.join(__dirname, '../templates/frontmatter');
  }

  /**
   * Install BMAD artifacts for an IDE
   *
   * @param {string} projectDir - Project root directory
   * @param {string} bmadDir - BMAD installation directory (_bmad)
   * @param {UnifiedInstallConfig} config - Installation configuration
   * @param {Array<string>} selectedModules - Modules to install
   * @returns {Promise<Object>} Installation result with counts
   */
  async install(projectDir, bmadDir, config, selectedModules = []) {
    const {
      targetDir,
      namingStyle = NamingStyle.SUFFIX_BASED,
      frontmatterTemplate = 'common-yaml.md',
      fileExtension = '.md',
      includeNestedStructure = false,
      customTemplateFn = null,
      skipExisting = false,
      artifactTypes = null,
    } = config;

    // Clean up any existing BMAD files in target directory (unless skipExisting)
    if (!skipExisting) {
      await this.cleanupBmadFiles(targetDir, fileExtension);
    }

    // Ensure target directory exists
    await fs.ensureDir(targetDir);

    // Count results
    const counts = {
      agents: 0,
      workflows: 0,
      tasks: 0,
      tools: 0,
      total: 0,
    };

    // Check if we should install agents
    const installAgents = !artifactTypes || artifactTypes.includes('agents');
    const installWorkflows = !artifactTypes || artifactTypes.includes('workflows');
    const installTasks = !artifactTypes || artifactTypes.includes('tasks');
    const installTools = !artifactTypes || artifactTypes.includes('tools');

    // Load frontmatter template once (if not 'none')
    let templateContent = null;
    if (frontmatterTemplate && frontmatterTemplate !== 'none') {
      templateContent = await this.loadFrontmatterTemplate(frontmatterTemplate);
    }

    // 1. Install Agents
    if (installAgents) {
      const agentGen = new AgentCommandGenerator(this.bmadFolderName);
      const { artifacts: agentArtifacts } = await agentGen.collectAgentArtifacts(bmadDir, selectedModules);
      counts.agents = await this.writeArtifacts(
        agentArtifacts,
        targetDir,
        namingStyle,
        templateContent,
        frontmatterTemplate,
        fileExtension,
        customTemplateFn,
        'agent',
        skipExisting,
      );
    }

    // 2. Install Workflows (filter out README artifacts)
    if (installWorkflows) {
      const workflowGen = new WorkflowCommandGenerator(this.bmadFolderName);
      const { artifacts: workflowArtifacts } = await workflowGen.collectWorkflowArtifacts(bmadDir);
      const workflowArtifactsFiltered = workflowArtifacts.filter((a) => {
        const name = path.basename(a.relativePath || '');
        return name.toLowerCase() !== 'readme.md' && !name.toLowerCase().startsWith('readme-');
      });
      counts.workflows = await this.writeArtifacts(
        workflowArtifactsFiltered,
        targetDir,
        namingStyle,
        templateContent,
        frontmatterTemplate,
        fileExtension,
        customTemplateFn,
        'workflow',
        skipExisting,
      );
    }

    // 3. Install Tasks and Tools from manifest CSV
    if (installTasks || installTools) {
      const ttGen = new TaskToolCommandGenerator();

      // Use suffix-based naming if specified
      if (namingStyle === NamingStyle.SUFFIX_BASED) {
        const taskToolResult = await ttGen.generateSuffixBasedTaskToolCommands(
          projectDir,
          bmadDir,
          targetDir,
          fileExtension,
          templateContent,
          frontmatterTemplate,
          skipExisting,
        );
        counts.tasks = taskToolResult.tasks || 0;
        counts.tools = taskToolResult.tools || 0;
      } else if (namingStyle === NamingStyle.FLAT_DASH) {
        const taskToolResult = await ttGen.generateDashTaskToolCommands(projectDir, bmadDir, targetDir, fileExtension);
        counts.tasks = taskToolResult.tasks || 0;
        counts.tools = taskToolResult.tools || 0;
      } else {
        const taskToolResult = await ttGen.generateColonTaskToolCommands(projectDir, bmadDir, targetDir, fileExtension);
        counts.tasks = taskToolResult.tasks || 0;
        counts.tools = taskToolResult.tools || 0;
      }
    }

    counts.total = counts.agents + counts.workflows + counts.tasks + counts.tools;

    return counts;
  }

  /**
   * Load frontmatter template from file
   * @param {string} templateFile - Template filename
   * @returns {Promise<string|null>} Template content or null if not found
   */
  async loadFrontmatterTemplate(templateFile) {
    const templatePath = path.join(this.templateDir, templateFile);
    try {
      return await fs.readFile(templatePath, 'utf8');
    } catch {
      console.warn(chalk.yellow(`Warning: Could not load template ${templateFile}, using default`));
      return null;
    }
  }

  /**
   * Apply frontmatter template to content
   * @param {Object} artifact - Artifact with metadata
   * @param {string} content - Original content
   * @param {string} templateContent - Template content
   * @param {string} templateFile - Template filename (for special handling)
   * @returns {string} Content with frontmatter applied
   */
  applyFrontmatterTemplate(artifact, content, templateContent, templateFile) {
    if (!templateContent) {
      return content;
    }

    // Extract existing frontmatter if present
    const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
    const contentWithoutFrontmatter = content.replace(frontmatterRegex, '').trim();

    // Get artifact metadata for template substitution
    const name = artifact.name || artifact.displayName || 'workflow';
    const title = this.formatTitle(name);
    const iconMatch = content.match(/icon="([^"]+)"/);
    const icon = iconMatch ? iconMatch[1] : '🤖';

    // Use artifact's description if available, otherwise generate fallback
    const description = artifact.description || `Activates the ${name} ${artifact.type || 'workflow'}.`;

    // Template variables
    const variables = {
      name,
      title,
      displayName: name,
      description,
      icon,
      content: contentWithoutFrontmatter,

      // Special variables for certain templates
      autoExecMode: this.getAutoExecMode(artifact),
      tools: JSON.stringify(this.getCopilotTools()),
    };

    // Apply template substitutions
    let result = templateContent;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replaceAll(`{{${key}}}`, value);
    }

    // Append content after frontmatter (for TOML templates with prompt field)
    if (templateFile.includes('toml') && !result.includes('{{content}}')) {
      const escapedContent = contentWithoutFrontmatter.replaceAll('"""', String.raw`\"\"\"`);
      result = result.replace(/prompt = """/, `prompt = """\n${escapedContent}`);
    }

    return result.trim() + '\n\n' + contentWithoutFrontmatter;
  }

  /**
   * Get auto_execution_mode for Windsurf based on artifact type
   */
  getAutoExecMode(artifact) {
    if (artifact.type === 'agent') return '3';
    if (artifact.type === 'task' || artifact.type === 'tool') return '2';
    return '1'; // default for workflows
  }

  /**
   * Get GitHub Copilot tools array
   */
  getCopilotTools() {
    return [
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
    ];
  }

  /**
   * Clean up any existing BMAD files in target directory
   */
  async cleanupBmadFiles(targetDir, fileExtension = '.md') {
    if (!(await fs.pathExists(targetDir))) {
      return;
    }

    const entries = await fs.readdir(targetDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name.startsWith('bmad') && entry.name.endsWith(fileExtension)) {
        const entryPath = path.join(targetDir, entry.name);
        await fs.remove(entryPath);
      }
    }
  }

  /**
   * Write artifacts with specified naming style and template
   */
  async writeArtifacts(
    artifacts,
    targetDir,
    namingStyle,
    templateContent,
    templateFile,
    fileExtension,
    customTemplateFn,
    artifactType,
    skipExisting = false,
  ) {
    let written = 0;
    let skipped = 0;

    for (const artifact of artifacts) {
      // Determine target path based on naming style
      let targetPath;
      let content = artifact.content;

      switch (namingStyle) {
        case NamingStyle.SUFFIX_BASED: {
          const suffixName = toSuffixBasedName(artifact.relativePath, artifactType, fileExtension);
          targetPath = path.join(targetDir, suffixName);

          break;
        }
        case NamingStyle.FLAT_COLON: {
          const flatName = toColonPath(artifact.relativePath, fileExtension);
          targetPath = path.join(targetDir, flatName);

          break;
        }
        case NamingStyle.FLAT_DASH: {
          const flatName = toDashPath(artifact.relativePath, fileExtension);
          targetPath = path.join(targetDir, flatName);

          break;
        }
        default: {
          const flatName = toColonPath(artifact.relativePath, fileExtension);
          targetPath = path.join(targetDir, flatName);
        }
      }

      // Skip if file already exists
      if (skipExisting && (await fs.pathExists(targetPath))) {
        skipped++;
        continue;
      }

      // Apply template transformations
      if (customTemplateFn) {
        content = customTemplateFn(artifact, content, templateFile);
      } else if (templateFile !== 'none') {
        content = this.applyFrontmatterTemplate(artifact, content, templateContent, templateFile);
      }

      await fs.ensureDir(targetDir);
      await fs.writeFile(targetPath, content, 'utf8');
      written++;
    }

    if (skipped > 0) {
      console.log(chalk.dim(`  Skipped ${skipped} existing files`));
    }

    return written;
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
}

module.exports = {
  UnifiedInstaller,
  NamingStyle,
};
