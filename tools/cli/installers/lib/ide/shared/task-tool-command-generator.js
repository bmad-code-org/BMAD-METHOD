const path = require('node:path');
const fs = require('fs-extra');
const csv = require('csv-parse/sync');
const chalk = require('chalk');
const { toColonName, toColonPath, toDashPath, toSuffixBasedName } = require('./path-utils');

/**
 * Generates command files for standalone tasks and tools
 */
class TaskToolCommandGenerator {
  /**
   * REMOVED: Old generateTaskToolCommands method that created nested structure.
   * This was causing bugs where files were written to wrong directories.
   * Use generateColonTaskToolCommands() or generateDashTaskToolCommands() instead.
   */

  /**
   * Load task manifest CSV
   */
  async loadTaskManifest(bmadDir) {
    const manifestPath = path.join(bmadDir, '_config', 'task-manifest.csv');

    if (!(await fs.pathExists(manifestPath))) {
      return null;
    }

    const csvContent = await fs.readFile(manifestPath, 'utf8');
    const tasks = csv.parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Filter out README files
    return tasks.filter((task) => {
      const nameLower = task.name.toLowerCase();
      return !nameLower.includes('readme') && task.name !== 'README';
    });
  }

  /**
   * Load tool manifest CSV
   */
  async loadToolManifest(bmadDir) {
    const manifestPath = path.join(bmadDir, '_config', 'tool-manifest.csv');

    if (!(await fs.pathExists(manifestPath))) {
      return null;
    }

    const csvContent = await fs.readFile(manifestPath, 'utf8');
    const tools = csv.parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Filter out README files
    return tools.filter((tool) => {
      const nameLower = tool.name.toLowerCase();
      return !nameLower.includes('readme') && tool.name !== 'README';
    });
  }

  /**
   * Generate task and tool commands using underscore format (Windows-compatible)
   * Creates flat files like: bmad_bmm_bmad-help.md
   *
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {string} baseCommandsDir - Base commands directory for the IDE
   * @param {string} [fileExtension='.md'] - File extension including dot (e.g., '.md', '.toml')
   * @returns {Object} Generation results
   */
  async generateColonTaskToolCommands(projectDir, bmadDir, baseCommandsDir, fileExtension = '.md') {
    const tasks = await this.loadTaskManifest(bmadDir);
    const tools = await this.loadToolManifest(bmadDir);

    // Filter to only standalone items
    const standaloneTasks = tasks ? tasks.filter((t) => t.standalone === 'true' || t.standalone === true) : [];
    const standaloneTools = tools ? tools.filter((t) => t.standalone === 'true' || t.standalone === true) : [];

    // Determine format based on file extension
    const format = fileExtension === '.toml' ? 'toml' : 'yaml';
    let generatedCount = 0;

    // DEBUG: Log parameters
    console.log(`[DEBUG generateColonTaskToolCommands] baseCommandsDir: ${baseCommandsDir}, format=${format}`);

    // Generate command files for tasks
    for (const task of standaloneTasks) {
      const commandContent = this.generateCommandContent(task, 'task', format);
      // Use underscore format: bmad_bmm_name.<ext>
      const flatName = toColonName(task.module, 'tasks', task.name, fileExtension);
      const commandPath = path.join(baseCommandsDir, flatName);
      console.log(`[DEBUG generateColonTaskToolCommands] Writing task ${task.name} to: ${commandPath}`);
      await fs.ensureDir(path.dirname(commandPath));
      await fs.writeFile(commandPath, commandContent);
      generatedCount++;
    }

    // Generate command files for tools
    for (const tool of standaloneTools) {
      const commandContent = this.generateCommandContent(tool, 'tool', format);
      // Use underscore format: bmad_bmm_name.<ext>
      const flatName = toColonName(tool.module, 'tools', tool.name, fileExtension);
      const commandPath = path.join(baseCommandsDir, flatName);
      await fs.ensureDir(path.dirname(commandPath));
      await fs.writeFile(commandPath, commandContent);
      generatedCount++;
    }

    return {
      generated: generatedCount,
      tasks: standaloneTasks.length,
      tools: standaloneTools.length,
    };
  }

  /**
   * Generate task and tool commands using dash format
   * Creates flat files like: bmad-bmm-bmad-help.md
   *
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {string} baseCommandsDir - Base commands directory for the IDE
   * @param {string} [fileExtension='.md'] - File extension including dot (e.g., '.md', '.toml')
   * @returns {Object} Generation results
   */
  async generateDashTaskToolCommands(projectDir, bmadDir, baseCommandsDir, fileExtension = '.md') {
    const tasks = await this.loadTaskManifest(bmadDir);
    const tools = await this.loadToolManifest(bmadDir);

    // Filter to only standalone items
    const standaloneTasks = tasks ? tasks.filter((t) => t.standalone === 'true' || t.standalone === true) : [];
    const standaloneTools = tools ? tools.filter((t) => t.standalone === 'true' || t.standalone === true) : [];

    // Determine format based on file extension
    const format = fileExtension === '.toml' ? 'toml' : 'yaml';
    let generatedCount = 0;

    // Generate command files for tasks
    for (const task of standaloneTasks) {
      const commandContent = this.generateCommandContent(task, 'task', format);
      // Use dash format: bmad-bmm-task-name.<ext>
      const flatName = toDashPath(`${task.module}/tasks/${task.name}.md`, fileExtension);
      const commandPath = path.join(baseCommandsDir, flatName);
      await fs.ensureDir(path.dirname(commandPath));
      await fs.writeFile(commandPath, commandContent);
      generatedCount++;
    }

    // Generate command files for tools
    for (const tool of standaloneTools) {
      const commandContent = this.generateCommandContent(tool, 'tool', format);
      // Use dash format: bmad-bmm-tool-name.<ext>
      const flatName = toDashPath(`${tool.module}/tools/${tool.name}.md`, fileExtension);
      const commandPath = path.join(baseCommandsDir, flatName);
      await fs.ensureDir(path.dirname(commandPath));
      await fs.writeFile(commandPath, commandContent);
      generatedCount++;
    }

    return {
      generated: generatedCount,
      tasks: standaloneTasks.length,
      tools: standaloneTools.length,
    };
  }

  /**
   * Write task/tool artifacts using underscore format (Windows-compatible)
   * Creates flat files like: bmad_bmm_bmad-help.md
   *
   * @param {string} baseCommandsDir - Base commands directory for the IDE
   * @param {Array} artifacts - Task/tool artifacts with relativePath
   * @returns {number} Count of commands written
   */
  async writeColonArtifacts(baseCommandsDir, artifacts) {
    let writtenCount = 0;

    for (const artifact of artifacts) {
      if (artifact.type === 'task' || artifact.type === 'tool') {
        const commandContent = this.generateCommandContent(artifact, artifact.type);
        // Use underscore format: bmad_module_name.md
        const flatName = toColonPath(artifact.relativePath);
        const commandPath = path.join(baseCommandsDir, flatName);
        await fs.ensureDir(path.dirname(commandPath));
        await fs.writeFile(commandPath, commandContent);
        writtenCount++;
      }
    }

    return writtenCount;
  }

  /**
   * Write task/tool artifacts using underscore format (Windows-compatible)
   * Creates flat files like: bmad_bmm_bmad-help.md
   *
   * @param {string} baseCommandsDir - Base commands directory for the IDE
   * @param {Array} artifacts - Task/tool artifacts with relativePath
   * @returns {number} Count of commands written
   */
  async writeDashArtifacts(baseCommandsDir, artifacts) {
    let writtenCount = 0;

    for (const artifact of artifacts) {
      if (artifact.type === 'task' || artifact.type === 'tool') {
        const commandContent = this.generateCommandContent(artifact, artifact.type);
        // Use underscore format: bmad_module_name.md
        const flatName = toDashPath(artifact.relativePath);
        const commandPath = path.join(baseCommandsDir, flatName);
        await fs.ensureDir(path.dirname(commandPath));
        await fs.writeFile(commandPath, commandContent);
        writtenCount++;
      }
    }

    return writtenCount;
  }

  /**
   * Generate task and tool commands using suffix-based format (NEW UNIVERSAL STANDARD)
   * Creates flat files like: bmad-bmm-create-story.task.md
   *
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {string} baseCommandsDir - Base commands directory for the IDE
   * @param {string} [fileExtension='.md'] - File extension including dot (e.g., '.md', '.toml')
   * @param {string} [templateContent] - Frontmatter template content (from platform-codes.yaml)
   * @param {string} [frontmatterTemplate] - Frontmatter template filename
   * @param {boolean} [skipExisting=false] - Skip if file already exists
   * @returns {Object} Generation results
   */
  async generateSuffixBasedTaskToolCommands(
    projectDir,
    bmadDir,
    baseCommandsDir,
    fileExtension = '.md',
    templateContent = null,
    frontmatterTemplate = 'common-yaml.md',
    skipExisting = false,
  ) {
    const tasks = await this.loadTaskManifest(bmadDir);
    const tools = await this.loadToolManifest(bmadDir);

    // Filter to only standalone items
    const standaloneTasks = tasks ? tasks.filter((t) => t.standalone === 'true' || t.standalone === true) : [];
    const standaloneTools = tools ? tools.filter((t) => t.standalone === 'true' || t.standalone === true) : [];

    let generatedCount = 0;
    let skippedCount = 0;

    // Generate command files for tasks
    for (const task of standaloneTasks) {
      const commandContent = this.generateCommandContent(task, 'task', templateContent, frontmatterTemplate);
      // Use suffix-based format: bmad-bmm-create-story.task.md
      const relativePath = `${task.module}/tasks/${task.name}.md`;
      const suffixName = toSuffixBasedName(relativePath, 'task', fileExtension);
      const commandPath = path.join(baseCommandsDir, suffixName);

      // Skip if already exists
      if (skipExisting && (await fs.pathExists(commandPath))) {
        skippedCount++;
        continue;
      }

      await fs.ensureDir(baseCommandsDir);
      await fs.writeFile(commandPath, commandContent);
      generatedCount++;
    }

    // Generate command files for tools
    for (const tool of standaloneTools) {
      const commandContent = this.generateCommandContent(tool, 'tool', templateContent, frontmatterTemplate);
      // Use suffix-based format: bmad-bmm-file-ops.tool.md
      const relativePath = `${tool.module}/tools/${tool.name}.md`;
      const suffixName = toSuffixBasedName(relativePath, 'tool', fileExtension);
      const commandPath = path.join(baseCommandsDir, suffixName);

      // Skip if already exists
      if (skipExisting && (await fs.pathExists(commandPath))) {
        skippedCount++;
        continue;
      }

      await fs.ensureDir(baseCommandsDir);
      await fs.writeFile(commandPath, commandContent);
      generatedCount++;
    }

    if (skippedCount > 0) {
      console.log(chalk.dim(`  Skipped ${skippedCount} existing task/tool files`));
    }

    return {
      generated: generatedCount,
      tasks: standaloneTasks.length,
      tools: standaloneTools.length,
    };
  }

  /**
   * Generate command content for a task or tool
   * @param {Object} item - Task or tool item from manifest
   * @param {string} type - 'task' or 'tool'
   * @param {string|Object|null} [templateOrFormat] - Template content or format string ('yaml'/'toml') for backward compat
   * @param {string} [frontmatterTemplate] - Template filename (for format detection)
   */
  generateCommandContent(item, type, templateOrFormat = null, frontmatterTemplate = null) {
    const description = item.description || `Execute ${item.displayName || item.name}`;

    // Convert path to use {project-root} placeholder
    let itemPath = item.path;
    if (itemPath.startsWith('bmad/')) {
      itemPath = `{project-root}/${itemPath}`;
    }

    const content = `# ${item.displayName || item.name}

LOAD and execute the ${type} at: ${itemPath}

Follow all instructions in the ${type} file exactly as written.
`;

    // Handle old calling convention: (item, type, format) where format is 'yaml' or 'toml'
    if (typeof templateOrFormat === 'string' && (templateOrFormat === 'yaml' || templateOrFormat === 'toml')) {
      if (templateOrFormat === 'toml') {
        // TOML format
        const escapedContent = content.replaceAll('"""', String.raw`\"\"\"`);
        return `description = "${description}"
prompt = """
${escapedContent}
"""
`;
      }
      // Default YAML format
      return `---
description: '${description.replaceAll("'", "''")}'
---

${content}`;
    }

    // New calling convention with template content
    const templateContent = templateOrFormat;
    if (!templateContent || frontmatterTemplate === 'none' || (templateContent === null && frontmatterTemplate === null)) {
      // Default YAML
      return `---
description: '${description.replaceAll("'", "''")}'
---

${content}`;
    }

    // Apply template variables
    const variables = {
      name: item.name,
      displayName: item.displayName || item.name,
      description,
      content,
      icon: '🤖',
    };

    let result = templateContent;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replaceAll(`{{${key}}}`, value);
    }

    // Handle TOML templates specially
    if (frontmatterTemplate && frontmatterTemplate.includes('toml')) {
      const escapedContent = content.replaceAll('"""', String.raw`\"\"\"`);
      result = result.replace(/prompt = """/, `prompt = """\n${escapedContent}`);
    }

    return result;
  }
}

module.exports = { TaskToolCommandGenerator };
