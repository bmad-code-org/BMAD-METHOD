const os = require('node:os');
const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const { BaseIdeSetup } = require('./_base-ide');
const prompts = require('../../../lib/prompts');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');
const { WorkflowCommandGenerator } = require('./shared/workflow-command-generator');
const { TaskToolCommandGenerator } = require('./shared/task-tool-command-generator');
const csv = require('csv-parse/sync');

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

    // Set configDir from target_dir so base-class detect() works
    if (this.installerConfig?.target_dir) {
      this.configDir = this.installerConfig.target_dir;
    }
  }

  /**
   * Detect whether this IDE already has configuration in the project.
   * For skill_format platforms, checks for bmad-prefixed entries in target_dir
   * (matching old codex.js behavior) instead of just checking directory existence.
   * @param {string} projectDir - Project directory
   * @returns {Promise<boolean>}
   */
  async detect(projectDir) {
    if (this.installerConfig?.skill_format && this.configDir) {
      const dir = path.join(projectDir || process.cwd(), this.configDir);
      if (await fs.pathExists(dir)) {
        try {
          const entries = await fs.readdir(dir);
          return entries.some((e) => typeof e === 'string' && e.startsWith('bmad'));
        } catch {
          return false;
        }
      }
      return false;
    }
    return super.detect(projectDir);
  }

  /**
   * Main setup method - called by IdeManager
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   * @returns {Promise<Object>} Setup result
   */
  async setup(projectDir, bmadDir, options = {}) {
    // Check for BMAD files in ancestor directories that would cause duplicates
    if (this.installerConfig?.ancestor_conflict_check) {
      const conflict = await this.findAncestorConflict(projectDir);
      if (conflict) {
        await prompts.log.error(
          `Found existing BMAD skills in ancestor installation: ${conflict}\n` +
            `  ${this.name} inherits skills from parent directories, so this would cause duplicates.\n` +
            `  Please remove the BMAD files from that directory first:\n` +
            `    rm -rf "${conflict}"/bmad*`,
        );
        return {
          success: false,
          reason: 'ancestor-conflict',
          error: `Ancestor conflict: ${conflict}`,
          conflictDir: conflict,
        };
      }
    }

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

    // Skip targets with explicitly empty artifact_types and no verbatim skills
    // This prevents creating empty directories when no artifacts will be written
    const skipStandardArtifacts = Array.isArray(artifact_types) && artifact_types.length === 0;
    if (skipStandardArtifacts && !config.skill_format) {
      return { success: true, results: { agents: 0, workflows: 0, tasks: 0, tools: 0, skills: 0 } };
    }

    const targetPath = path.join(projectDir, target_dir);
    await this.ensureDir(targetPath);

    const selectedModules = options.selectedModules || [];
    const results = { agents: 0, workflows: 0, tasks: 0, tools: 0, skills: 0 };

    // Install standard artifacts (agents, workflows, tasks, tools)
    if (!skipStandardArtifacts) {
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
        const taskToolResult = await this.writeTaskToolArtifacts(targetPath, artifacts, template_type, config, bmadDir);
        results.tasks = taskToolResult.tasks || 0;
        results.tools = taskToolResult.tools || 0;
      }
    }

    // Install verbatim skills (type: skill)
    if (config.skill_format) {
      results.skills = await this.installVerbatimSkills(projectDir, bmadDir, targetPath, config);
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
    const allResults = { agents: 0, workflows: 0, tasks: 0, tools: 0, skills: 0 };

    for (const target of targets) {
      const result = await this.installToTarget(projectDir, bmadDir, target, options);
      if (result.success) {
        allResults.agents += result.results.agents || 0;
        allResults.workflows += result.results.workflows || 0;
        allResults.tasks += result.results.tasks || 0;
        allResults.tools += result.results.tools || 0;
        allResults.skills += result.results.skills || 0;
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

      if (config.skill_format) {
        await this.writeSkillFile(targetPath, artifact, content);
      } else {
        const filePath = path.join(targetPath, filename);
        await this.writeFile(filePath, content);
      }
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

        if (config.skill_format) {
          await this.writeSkillFile(targetPath, artifact, content);
        } else {
          const filePath = path.join(targetPath, filename);
          await this.writeFile(filePath, content);
        }
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
  async writeTaskToolArtifacts(targetPath, artifacts, templateType, config = {}, bmadDir = null) {
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

      if (config.skill_format) {
        await this.writeSkillFile(targetPath, artifact, content, bmadDir);
      } else {
        const filePath = path.join(targetPath, filename);
        await this.writeFile(filePath, content);
      }

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

    // Replace _bmad placeholder with actual folder name BEFORE inserting paths,
    // so that paths containing '_bmad' are not corrupted by the blanket replacement.
    let rendered = template.replaceAll('_bmad', this.bmadFolderName);

    // Replace {{bmadFolderName}} placeholder if present
    rendered = rendered.replaceAll('{{bmadFolderName}}', this.bmadFolderName);

    rendered = rendered
      .replaceAll('{{name}}', artifact.name || '')
      .replaceAll('{{module}}', artifact.module || 'core')
      .replaceAll('{{path}}', pathToUse)
      .replaceAll('{{description}}', artifact.description || `${artifact.name} ${artifact.type || ''}`)
      .replaceAll('{{workflow_path}}', pathToUse);

    return rendered;
  }

  /**
   * Write artifact as a skill directory with SKILL.md inside.
   * Writes artifact as a skill directory with SKILL.md inside.
   * @param {string} targetPath - Base skills directory
   * @param {Object} artifact - Artifact data
   * @param {string} content - Rendered template content
   */
  async writeSkillFile(targetPath, artifact, content, bmadDir = null) {
    const { resolveSkillName } = require('./shared/path-utils');

    // Get the skill name (prefers canonicalId, falls back to path-derived) and remove .md
    const flatName = resolveSkillName(artifact);
    const skillName = path.basename(flatName.replace(/\.md$/, ''));

    if (!skillName) {
      throw new Error(`Cannot derive skill name for artifact: ${artifact.relativePath || JSON.stringify(artifact)}`);
    }

    // Create skill directory
    const skillDir = path.join(targetPath, skillName);
    await this.ensureDir(skillDir);

    // Transform content: rewrite frontmatter for skills format
    const skillContent = this.transformToSkillFormat(content, skillName);

    await this.writeFile(path.join(skillDir, 'SKILL.md'), skillContent);

    await this.writeShardDocPrototypeSkill(targetPath, bmadDir, skillName);
  }

  /**
   * Copy shard-doc prototype skill during transition when installing skill-format targets.
   * Keeps scope literal for the first PoC without introducing generalized prototype linkage.
   * @param {string} targetPath - Base skills directory
   * @param {string|null} bmadDir - Installed bmad directory
   * @param {string} skillName - Canonical skill name being written
   */
  async writeShardDocPrototypeSkill(targetPath, bmadDir, skillName) {
    if (!bmadDir || skillName !== 'bmad-shard-doc') return;

    const prototypeId = 'bmad-shard-doc-skill-prototype';
    const sourceSkillPath = path.join(bmadDir, 'core', 'tasks', prototypeId, 'SKILL.md');
    if (!(await fs.pathExists(sourceSkillPath))) return;

    const sourceSkillContent = await fs.readFile(sourceSkillPath, 'utf8');
    if (!sourceSkillContent) return;

    const prototypeDir = path.join(targetPath, prototypeId);
    await this.ensureDir(prototypeDir);
    await this.writeFile(path.join(prototypeDir, 'SKILL.md'), sourceSkillContent);
  }

  /**
   * Transform artifact content to Agent Skills format.
   * Rewrites frontmatter to contain only unquoted name and description.
   * @param {string} content - Original content with YAML frontmatter
   * @param {string} skillName - Skill name (must match directory name)
   * @returns {string} Transformed content
   */
  transformToSkillFormat(content, skillName) {
    // Normalize line endings
    content = content.replaceAll('\r\n', '\n').replaceAll('\r', '\n');

    // Parse frontmatter
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!fmMatch) {
      // No frontmatter -- wrap with minimal frontmatter
      const fm = yaml.stringify({ name: skillName, description: skillName }).trimEnd();
      return `---\n${fm}\n---\n\n${content}`;
    }

    const frontmatter = fmMatch[1];
    const body = fmMatch[2];

    // Parse frontmatter with yaml library to extract description
    let description;
    try {
      const parsed = yaml.parse(frontmatter);
      const rawDesc = parsed?.description;
      description = typeof rawDesc === 'string' && rawDesc ? rawDesc : `${skillName} skill`;
    } catch {
      description = `${skillName} skill`;
    }

    // Build new frontmatter with only name and description, unquoted
    const newFrontmatter = yaml.stringify({ name: skillName, description: String(description) }, { lineWidth: 0 }).trimEnd();
    return `---\n${newFrontmatter}\n---\n${body}`;
  }

  /**
   * Install a custom agent launcher.
   * For skill_format platforms, produces <skillDir>/SKILL.md.
   * For flat platforms, produces a single file in target_dir.
   * @param {string} projectDir - Project directory
   * @param {string} agentName - Agent name (e.g., "fred-commit-poet")
   * @param {string} agentPath - Path to compiled agent (relative to project root)
   * @param {Object} metadata - Agent metadata
   * @returns {Object|null} Info about created file/skill
   */
  async installCustomAgentLauncher(projectDir, agentName, agentPath, metadata) {
    if (!this.installerConfig?.target_dir) return null;

    const { customAgentDashName } = require('./shared/path-utils');
    const targetPath = path.join(projectDir, this.installerConfig.target_dir);
    await this.ensureDir(targetPath);

    // Build artifact to reuse existing template rendering.
    // The default-agent template already includes the _bmad/ prefix before {{path}},
    // but agentPath is relative to project root (e.g. "_bmad/custom/agents/fred.md").
    // Strip the bmadFolderName prefix so the template doesn't produce a double path.
    const bmadPrefix = this.bmadFolderName + '/';
    const normalizedPath = agentPath.startsWith(bmadPrefix) ? agentPath.slice(bmadPrefix.length) : agentPath;

    const artifact = {
      type: 'agent-launcher',
      name: agentName,
      description: metadata?.description || `${agentName} agent`,
      agentPath: normalizedPath,
      relativePath: normalizedPath,
      module: 'custom',
    };

    const { content: template } = await this.loadTemplate(
      this.installerConfig.template_type || 'default',
      'agent',
      this.installerConfig,
      'default-agent',
    );
    const content = this.renderTemplate(template, artifact);

    if (this.installerConfig.skill_format) {
      const skillName = customAgentDashName(agentName).replace(/\.md$/, '');
      const skillDir = path.join(targetPath, skillName);
      await this.ensureDir(skillDir);
      const skillContent = this.transformToSkillFormat(content, skillName);
      const skillPath = path.join(skillDir, 'SKILL.md');
      await this.writeFile(skillPath, skillContent);
      return { path: path.relative(projectDir, skillPath), command: `$${skillName}` };
    }

    // Flat file output
    const filename = customAgentDashName(agentName);
    const filePath = path.join(targetPath, filename);
    await this.writeFile(filePath, content);
    return { path: path.relative(projectDir, filePath), command: agentName };
  }

  /**
   * Generate filename for artifact
   * @param {Object} artifact - Artifact data
   * @param {string} artifactType - Artifact type (agent, workflow, task, tool)
   * @param {string} extension - File extension to use (e.g., '.md', '.toml')
   * @returns {string} Generated filename
   */
  generateFilename(artifact, artifactType, extension = '.md') {
    const { resolveSkillName } = require('./shared/path-utils');

    // Reuse central logic to ensure consistent naming conventions
    // Prefers canonicalId from manifest when available, falls back to path-derived name
    const standardName = resolveSkillName(artifact);

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
   * Install verbatim skill directories (type: skill entries from skill-manifest.csv).
   * Copies the entire source directory into the IDE skill directory, auto-generating SKILL.md.
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {string} targetPath - Target skills directory
   * @param {Object} config - Installation configuration
   * @returns {Promise<number>} Count of skills installed
   */
  async installVerbatimSkills(projectDir, bmadDir, targetPath, config) {
    const bmadFolderName = path.basename(bmadDir);
    const csvPath = path.join(bmadDir, '_config', 'skill-manifest.csv');

    if (!(await fs.pathExists(csvPath))) return 0;

    const csvContent = await fs.readFile(csvPath, 'utf8');
    const records = csv.parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    let count = 0;

    for (const record of records) {
      const canonicalId = record.canonicalId;
      if (!canonicalId) continue;

      // Derive source directory from path column
      // path is like "_bmad/bmm/workflows/bmad-quick-flow/bmad-quick-dev-new-preview/workflow.md"
      // Strip bmadFolderName prefix and join with bmadDir, then get dirname
      const relativePath = record.path.replace(new RegExp(`^${bmadFolderName}/`), '');
      const sourceFile = path.join(bmadDir, relativePath);
      const sourceDir = path.dirname(sourceFile);

      if (!(await fs.pathExists(sourceDir))) continue;

      // Clean target before copy to prevent stale files
      const skillDir = path.join(targetPath, canonicalId);
      await fs.remove(skillDir);
      await fs.ensureDir(skillDir);

      // Parse workflow.md frontmatter for description
      let description = `${canonicalId} skill`;
      try {
        const workflowContent = await fs.readFile(sourceFile, 'utf8');
        const fmMatch = workflowContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (fmMatch) {
          const frontmatter = yaml.parse(fmMatch[1]);
          if (frontmatter?.description) {
            description = frontmatter.description;
          }
        }
      } catch (error) {
        await prompts.log.warn(`Failed to parse frontmatter from ${sourceFile}: ${error.message}`);
      }

      // Generate SKILL.md with YAML-safe frontmatter
      const frontmatterYaml = yaml.stringify({ name: canonicalId, description: String(description) }, { lineWidth: 0 }).trimEnd();
      const skillMd = `---\n${frontmatterYaml}\n---\n\nIT IS CRITICAL THAT YOU FOLLOW THIS COMMAND: LOAD the FULL workflow.md, READ its entire contents and follow its directions exactly!\n`;
      await fs.writeFile(path.join(skillDir, 'SKILL.md'), skillMd);

      // Copy all files except bmad-skill-manifest.yaml
      const entries = await fs.readdir(sourceDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name === 'bmad-skill-manifest.yaml') continue;
        const srcPath = path.join(sourceDir, entry.name);
        const destPath = path.join(skillDir, entry.name);
        await fs.copy(srcPath, destPath);
      }

      count++;
    }

    // Post-install cleanup: remove _bmad/ directories for skills with install_to_bmad === "false"
    for (const record of records) {
      if (record.install_to_bmad === 'false') {
        const relativePath = record.path.replace(new RegExp(`^${bmadFolderName}/`), '');
        const sourceFile = path.join(bmadDir, relativePath);
        const sourceDir = path.dirname(sourceFile);
        if (await fs.pathExists(sourceDir)) {
          await fs.remove(sourceDir);
        }
      }
    }

    return count;
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
    if (results.skills > 0) parts.push(`${results.skills} skills`);
    await prompts.log.success(`${this.name} configured: ${parts.join(', ')} → ${targetDir}`);
  }

  /**
   * Cleanup IDE configuration
   * @param {string} projectDir - Project directory
   */
  async cleanup(projectDir, options = {}) {
    // Migrate legacy target directories (e.g. .opencode/agent → .opencode/agents)
    if (this.installerConfig?.legacy_targets) {
      if (!options.silent) await prompts.log.message('  Migrating legacy directories...');
      for (const legacyDir of this.installerConfig.legacy_targets) {
        if (this.isGlobalPath(legacyDir)) {
          await this.warnGlobalLegacy(legacyDir, options);
        } else {
          await this.cleanupTarget(projectDir, legacyDir, options);
          await this.removeEmptyParents(projectDir, legacyDir);
        }
      }
    }

    // Strip BMAD markers from copilot-instructions.md if present
    if (this.name === 'github-copilot') {
      await this.cleanupCopilotInstructions(projectDir, options);
    }

    // Strip BMAD modes from .kilocodemodes if present
    if (this.name === 'kilo') {
      await this.cleanupKiloModes(projectDir, options);
    }

    // Strip BMAD entries from .rovodev/prompts.yml if present
    if (this.name === 'rovo-dev') {
      await this.cleanupRovoDevPrompts(projectDir, options);
    }

    // Clean all target directories
    if (this.installerConfig?.targets) {
      const parentDirs = new Set();
      for (const target of this.installerConfig.targets) {
        await this.cleanupTarget(projectDir, target.target_dir, options);
        // Track parent directories for empty-dir cleanup
        const parentDir = path.dirname(target.target_dir);
        if (parentDir && parentDir !== '.') {
          parentDirs.add(parentDir);
        }
      }
      // After all targets cleaned, remove empty parent directories (recursive up to projectDir)
      for (const parentDir of parentDirs) {
        await this.removeEmptyParents(projectDir, parentDir);
      }
    } else if (this.installerConfig?.target_dir) {
      await this.cleanupTarget(projectDir, this.installerConfig.target_dir, options);
    }
  }

  /**
   * Check if a path is global (starts with ~ or is absolute)
   * @param {string} p - Path to check
   * @returns {boolean}
   */
  isGlobalPath(p) {
    return p.startsWith('~') || path.isAbsolute(p);
  }

  /**
   * Warn about stale BMAD files in a global legacy directory (never auto-deletes)
   * @param {string} legacyDir - Legacy directory path (may start with ~)
   * @param {Object} options - Options (silent, etc.)
   */
  async warnGlobalLegacy(legacyDir, options = {}) {
    try {
      const expanded = legacyDir.startsWith('~/')
        ? path.join(os.homedir(), legacyDir.slice(2))
        : legacyDir === '~'
          ? os.homedir()
          : legacyDir;

      if (!(await fs.pathExists(expanded))) return;

      const entries = await fs.readdir(expanded);
      const bmadFiles = entries.filter((e) => typeof e === 'string' && e.startsWith('bmad'));

      if (bmadFiles.length > 0 && !options.silent) {
        await prompts.log.warn(`Found ${bmadFiles.length} stale BMAD file(s) in ${expanded}. Remove manually: rm ${expanded}/bmad-*`);
      }
    } catch {
      // Errors reading global paths are silently ignored
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
      if (entry.startsWith('bmad') && !entry.startsWith('bmad-os-')) {
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

    // Remove empty directory after cleanup
    if (removedCount > 0) {
      try {
        const remaining = await fs.readdir(targetPath);
        if (remaining.length === 0) {
          await fs.remove(targetPath);
        }
      } catch {
        // Directory may already be gone or in use — skip
      }
    }
  }
  /**
   * Strip BMAD-owned content from .github/copilot-instructions.md.
   * The old custom installer injected content between <!-- BMAD:START --> and <!-- BMAD:END --> markers.
   * Deletes the file if nothing remains. Restores .bak backup if one exists.
   */
  async cleanupCopilotInstructions(projectDir, options = {}) {
    const filePath = path.join(projectDir, '.github', 'copilot-instructions.md');

    if (!(await fs.pathExists(filePath))) return;

    try {
      const content = await fs.readFile(filePath, 'utf8');
      const startIdx = content.indexOf('<!-- BMAD:START -->');
      const endIdx = content.indexOf('<!-- BMAD:END -->');

      if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return;

      const cleaned = content.slice(0, startIdx) + content.slice(endIdx + '<!-- BMAD:END -->'.length);

      if (cleaned.trim().length === 0) {
        await fs.remove(filePath);
        const backupPath = `${filePath}.bak`;
        if (await fs.pathExists(backupPath)) {
          await fs.rename(backupPath, filePath);
          if (!options.silent) await prompts.log.message('  Restored copilot-instructions.md from backup');
        }
      } else {
        await fs.writeFile(filePath, cleaned, 'utf8');
        const backupPath = `${filePath}.bak`;
        if (await fs.pathExists(backupPath)) await fs.remove(backupPath);
      }

      if (!options.silent) await prompts.log.message('  Cleaned BMAD markers from copilot-instructions.md');
    } catch {
      if (!options.silent) await prompts.log.warn('  Warning: Could not clean BMAD markers from copilot-instructions.md');
    }
  }

  /**
   * Strip BMAD-owned modes from .kilocodemodes.
   * The old custom kilo.js installer added modes with slug starting with 'bmad-'.
   * Parses YAML, filters out BMAD modes, rewrites. Leaves file as-is on parse failure.
   */
  async cleanupKiloModes(projectDir, options = {}) {
    const kiloModesPath = path.join(projectDir, '.kilocodemodes');

    if (!(await fs.pathExists(kiloModesPath))) return;

    const content = await fs.readFile(kiloModesPath, 'utf8');

    let config;
    try {
      config = yaml.parse(content) || {};
    } catch {
      if (!options.silent) await prompts.log.warn('  Warning: Could not parse .kilocodemodes for cleanup');
      return;
    }

    if (!Array.isArray(config.customModes)) return;

    const originalCount = config.customModes.length;
    config.customModes = config.customModes.filter((mode) => mode && (!mode.slug || !mode.slug.startsWith('bmad-')));
    const removedCount = originalCount - config.customModes.length;

    if (removedCount > 0) {
      try {
        await fs.writeFile(kiloModesPath, yaml.stringify(config, { lineWidth: 0 }));
        if (!options.silent) await prompts.log.message(`  Removed ${removedCount} BMAD modes from .kilocodemodes`);
      } catch {
        if (!options.silent) await prompts.log.warn('  Warning: Could not write .kilocodemodes during cleanup');
      }
    }
  }

  /**
   * Strip BMAD-owned entries from .rovodev/prompts.yml.
   * The old custom rovodev.js installer registered workflows in prompts.yml.
   * Parses YAML, filters out entries with name starting with 'bmad-', rewrites.
   * Removes the file if no entries remain.
   */
  async cleanupRovoDevPrompts(projectDir, options = {}) {
    const promptsPath = path.join(projectDir, '.rovodev', 'prompts.yml');

    if (!(await fs.pathExists(promptsPath))) return;

    const content = await fs.readFile(promptsPath, 'utf8');

    let config;
    try {
      config = yaml.parse(content) || {};
    } catch {
      if (!options.silent) await prompts.log.warn('  Warning: Could not parse prompts.yml for cleanup');
      return;
    }

    if (!Array.isArray(config.prompts)) return;

    const originalCount = config.prompts.length;
    config.prompts = config.prompts.filter((entry) => entry && (!entry.name || !entry.name.startsWith('bmad-')));
    const removedCount = originalCount - config.prompts.length;

    if (removedCount > 0) {
      try {
        if (config.prompts.length === 0) {
          await fs.remove(promptsPath);
        } else {
          await fs.writeFile(promptsPath, yaml.stringify(config, { lineWidth: 0 }));
        }
        if (!options.silent) await prompts.log.message(`  Removed ${removedCount} BMAD entries from prompts.yml`);
      } catch {
        if (!options.silent) await prompts.log.warn('  Warning: Could not write prompts.yml during cleanup');
      }
    }
  }

  /**
   * Check ancestor directories for existing BMAD files in the same target_dir.
   * IDEs like Claude Code inherit commands from parent directories, so an existing
   * installation in an ancestor would cause duplicate commands.
   * @param {string} projectDir - Project directory being installed to
   * @returns {Promise<string|null>} Path to conflicting directory, or null if clean
   */
  async findAncestorConflict(projectDir) {
    const targetDir = this.installerConfig?.target_dir;
    if (!targetDir) return null;

    const resolvedProject = await fs.realpath(path.resolve(projectDir));
    let current = path.dirname(resolvedProject);
    const root = path.parse(current).root;

    while (current !== root && current.length > root.length) {
      const candidatePath = path.join(current, targetDir);
      try {
        if (await fs.pathExists(candidatePath)) {
          const entries = await fs.readdir(candidatePath);
          const hasBmad = entries.some(
            (e) => typeof e === 'string' && e.toLowerCase().startsWith('bmad') && !e.toLowerCase().startsWith('bmad-os-'),
          );
          if (hasBmad) {
            return candidatePath;
          }
        }
      } catch {
        // Can't read directory — skip
      }
      current = path.dirname(current);
    }

    return null;
  }

  /**
   * Walk up ancestor directories from relativeDir toward projectDir, removing each if empty
   * Stops at projectDir boundary — never removes projectDir itself
   * @param {string} projectDir - Project root (boundary)
   * @param {string} relativeDir - Relative directory to start from
   */
  async removeEmptyParents(projectDir, relativeDir) {
    const resolvedProject = path.resolve(projectDir);
    let current = relativeDir;
    let last = null;
    while (current && current !== '.' && current !== last) {
      last = current;
      const fullPath = path.resolve(projectDir, current);
      // Boundary guard: never traverse outside projectDir
      if (!fullPath.startsWith(resolvedProject + path.sep) && fullPath !== resolvedProject) break;
      try {
        if (!(await fs.pathExists(fullPath))) {
          // Dir already gone — advance current; last is reset at top of next iteration
          current = path.dirname(current);
          continue;
        }
        const remaining = await fs.readdir(fullPath);
        if (remaining.length > 0) break;
        await fs.rmdir(fullPath);
      } catch (error) {
        // ENOTEMPTY: TOCTOU race (file added between readdir and rmdir) — skip level, continue upward
        // ENOENT: dir removed by another process between pathExists and rmdir — skip level, continue upward
        if (error.code === 'ENOTEMPTY' || error.code === 'ENOENT') {
          current = path.dirname(current);
          continue;
        }
        break; // fatal error (e.g. EACCES) — stop upward walk
      }
      current = path.dirname(current);
    }
  }
}

module.exports = { ConfigDrivenIdeSetup };
