const path = require('node:path');
const fs = require('fs-extra');
const csv = require('csv-parse/sync');
const chalk = require('chalk');
const { toColonName, toColonPath, toDashPath } = require('./path-utils');

/**
 * Generates command files for standalone tasks and tools
 */
class TaskToolCommandGenerator {
  /**
   * Generate task and tool commands from manifest CSVs
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {string} baseCommandsDir - Optional base commands directory (defaults to .claude/commands/bmad)
   */
  async generateTaskToolCommands(projectDir, bmadDir, baseCommandsDir = null) {
    const tasks = await this.loadTaskManifest(bmadDir);
    const tools = await this.loadToolManifest(bmadDir);

    // Filter to only standalone items
    const standaloneTasks = tasks ? tasks.filter((t) => t.standalone === 'true' || t.standalone === true) : [];
    const standaloneTools = tools ? tools.filter((t) => t.standalone === 'true' || t.standalone === true) : [];

    // Base commands directory - use provided or default to Claude Code structure
    const commandsDir = baseCommandsDir || path.join(projectDir, '.claude', 'commands', 'bmad');

    let generatedCount = 0;

    // Generate command files for tasks
    for (const task of standaloneTasks) {
      const moduleTasksDir = path.join(commandsDir, task.module, 'tasks');
      await fs.ensureDir(moduleTasksDir);

      const commandContent = this.generateCommandContent(task, 'task');
      const commandPath = path.join(moduleTasksDir, `${task.name}.md`);

      await fs.writeFile(commandPath, commandContent);
      generatedCount++;
    }

    // Generate command files for tools
    for (const tool of standaloneTools) {
      const moduleToolsDir = path.join(commandsDir, tool.module, 'tools');
      await fs.ensureDir(moduleToolsDir);

      const commandContent = this.generateCommandContent(tool, 'tool');
      const commandPath = path.join(moduleToolsDir, `${tool.name}.md`);

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
   * Generate command content for a task or tool
   */
  generateCommandContent(item, type) {
    const description = item.description || `Execute ${item.displayName || item.name}`;

    // Convert path to use {project-root} placeholder
    let itemPath = item.path;
    if (itemPath.startsWith('bmad/')) {
      itemPath = `{project-root}/${itemPath}`;
    }

    return `---
description: '${description.replaceAll("'", "''")}'
---

# ${item.displayName || item.name}

LOAD and execute the ${type} at: ${itemPath}

Follow all instructions in the ${type} file exactly as written.
`;
  }

  /**
   * Load task manifest CSV
   */
  async loadTaskManifest(bmadDir) {
    const manifestPath = path.join(bmadDir, '_config', 'task-manifest.csv');

    if (!(await fs.pathExists(manifestPath))) {
      return null;
    }

    const csvContent = await fs.readFile(manifestPath, 'utf8');
    return csv.parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
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
    return csv.parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });
  }

  /**
   * Generate task and tool commands using underscore format (Windows-compatible)
   * Creates flat files like: bmad_bmm_bmad-help.md
   *
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {string} baseCommandsDir - Base commands directory for the IDE
   * @returns {Object} Generation results
   */
  async generateColonTaskToolCommands(projectDir, bmadDir, baseCommandsDir) {
    const tasks = await this.loadTaskManifest(bmadDir);
    const tools = await this.loadToolManifest(bmadDir);

    // Filter to only standalone items
    const standaloneTasks = tasks ? tasks.filter((t) => t.standalone === 'true' || t.standalone === true) : [];
    const standaloneTools = tools ? tools.filter((t) => t.standalone === 'true' || t.standalone === true) : [];

    let generatedCount = 0;

    // Generate command files for tasks
    for (const task of standaloneTasks) {
      const commandContent = this.generateCommandContent(task, 'task');
      // Use underscore format: bmad_bmm_name.md
      const flatName = toColonName(task.module, 'tasks', task.name);
      const commandPath = path.join(baseCommandsDir, flatName);
      await fs.ensureDir(path.dirname(commandPath));
      await fs.writeFile(commandPath, commandContent);
      generatedCount++;
    }

    // Generate command files for tools
    for (const tool of standaloneTools) {
      const commandContent = this.generateCommandContent(tool, 'tool');
      // Use underscore format: bmad_bmm_name.md
      const flatName = toColonName(tool.module, 'tools', tool.name);
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
   * Generate task and tool commands using underscore format (Windows-compatible)
   * Creates flat files like: bmad_bmm_bmad-help.md
   *
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {string} baseCommandsDir - Base commands directory for the IDE
   * @returns {Object} Generation results
   */
  async generateDashTaskToolCommands(projectDir, bmadDir, baseCommandsDir) {
    const tasks = await this.loadTaskManifest(bmadDir);
    const tools = await this.loadToolManifest(bmadDir);

    // Filter to only standalone items
    const standaloneTasks = tasks ? tasks.filter((t) => t.standalone === 'true' || t.standalone === true) : [];
    const standaloneTools = tools ? tools.filter((t) => t.standalone === 'true' || t.standalone === true) : [];

    let generatedCount = 0;

    // Generate command files for tasks
    for (const task of standaloneTasks) {
      const commandContent = this.generateCommandContent(task, 'task');
      // Use underscore format: bmad_bmm_name.md
      const flatName = toDashPath(`${task.module}/tasks/${task.name}.md`);
      const commandPath = path.join(baseCommandsDir, flatName);
      await fs.ensureDir(path.dirname(commandPath));
      await fs.writeFile(commandPath, commandContent);
      generatedCount++;
    }

    // Generate command files for tools
    for (const tool of standaloneTools) {
      const commandContent = this.generateCommandContent(tool, 'tool');
      // Use underscore format: bmad_bmm_name.md
      const flatName = toDashPath(`${tool.module}/tools/${tool.name}.md`);
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
}

module.exports = { TaskToolCommandGenerator };
