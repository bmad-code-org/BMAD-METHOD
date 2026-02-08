const path = require('node:path');
const fs = require('fs-extra');
const csv = require('csv-parse/sync');
const { toColonName, toColonPath, toDashPath, BMAD_FOLDER_NAME } = require('./path-utils');

/**
 * Generates command files for standalone tasks and tools
 */
class TaskToolCommandGenerator {
  /**
   * @param {string} bmadFolderName - Name of the BMAD folder for template rendering (default: '_bmad')
   * Note: This parameter is accepted for API consistency with AgentCommandGenerator and
   * WorkflowCommandGenerator, but is not used for path stripping. The manifest always stores
   * filesystem paths with '_bmad/' prefix (the actual folder name), while bmadFolderName is
   * used for template placeholder rendering ({{bmadFolderName}}).
   */
  constructor(bmadFolderName = BMAD_FOLDER_NAME) {
    this.bmadFolderName = bmadFolderName;
  }

  /**
   * Collect task and tool artifacts for IDE installation
   * @param {string} bmadDir - BMAD installation directory
   * @returns {Promise<Object>} Artifacts array with metadata
   */
  async collectTaskToolArtifacts(bmadDir) {
    const tasks = await this.loadTaskManifest(bmadDir);
    const tools = await this.loadToolManifest(bmadDir);

    // All tasks/tools in manifest are standalone (internal=true items are filtered during manifest generation)
    const artifacts = [];
    const bmadPrefix = `${BMAD_FOLDER_NAME}/`;

    // Collect task artifacts
    for (const task of tasks || []) {
      let taskPath = (task.path || '').replaceAll('\\', '/');
      // Convert absolute paths to relative paths
      if (path.isAbsolute(taskPath)) {
        taskPath = path.relative(bmadDir, taskPath).replaceAll('\\', '/');
      }
      // Remove _bmad/ prefix if present to get relative path within bmad folder
      if (taskPath.startsWith(bmadPrefix)) {
        taskPath = taskPath.slice(bmadPrefix.length);
      }

      const taskExt = path.extname(taskPath) || '.md';
      artifacts.push({
        type: 'task',
        name: task.name,
        displayName: task.displayName || task.name,
        description: task.description || `Execute ${task.displayName || task.name}`,
        module: task.module,
        // Use forward slashes for cross-platform consistency (not path.join which uses backslashes on Windows)
        relativePath: `${task.module}/tasks/${task.name}${taskExt}`,
        path: taskPath,
      });
    }

    // Collect tool artifacts
    for (const tool of tools || []) {
      let toolPath = (tool.path || '').replaceAll('\\', '/');
      // Convert absolute paths to relative paths
      if (path.isAbsolute(toolPath)) {
        toolPath = path.relative(bmadDir, toolPath).replaceAll('\\', '/');
      }
      // Remove _bmad/ prefix if present to get relative path within bmad folder
      if (toolPath.startsWith(bmadPrefix)) {
        toolPath = toolPath.slice(bmadPrefix.length);
      }

      const toolExt = path.extname(toolPath) || '.md';
      artifacts.push({
        type: 'tool',
        name: tool.name,
        displayName: tool.displayName || tool.name,
        description: tool.description || `Execute ${tool.displayName || tool.name}`,
        module: tool.module,
        // Use forward slashes for cross-platform consistency (not path.join which uses backslashes on Windows)
        relativePath: `${tool.module}/tools/${tool.name}${toolExt}`,
        path: toolPath,
      });
    }

    return {
      artifacts,
      counts: {
        tasks: (tasks || []).length,
        tools: (tools || []).length,
      },
    };
  }

  /**
   * Generate task and tool commands from manifest CSVs
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {string} baseCommandsDir - Optional base commands directory (defaults to .claude/commands/bmad)
   */
  async generateTaskToolCommands(projectDir, bmadDir, baseCommandsDir = null) {
    const tasks = await this.loadTaskManifest(bmadDir);
    const tools = await this.loadToolManifest(bmadDir);

    // Base commands directory - use provided or default to Claude Code structure
    const commandsDir = baseCommandsDir || path.join(projectDir, '.claude', 'commands', 'bmad');

    let generatedCount = 0;

    // Generate command files for tasks
    for (const task of tasks || []) {
      const moduleTasksDir = path.join(commandsDir, task.module, 'tasks');
      await fs.ensureDir(moduleTasksDir);

      const commandContent = this.generateCommandContent(task, 'task');
      const commandPath = path.join(moduleTasksDir, `${task.name}.md`);

      await fs.writeFile(commandPath, commandContent);
      generatedCount++;
    }

    // Generate command files for tools
    for (const tool of tools || []) {
      const moduleToolsDir = path.join(commandsDir, tool.module, 'tools');
      await fs.ensureDir(moduleToolsDir);

      const commandContent = this.generateCommandContent(tool, 'tool');
      const commandPath = path.join(moduleToolsDir, `${tool.name}.md`);

      await fs.writeFile(commandPath, commandContent);
      generatedCount++;
    }

    return {
      generated: generatedCount,
      tasks: (tasks || []).length,
      tools: (tools || []).length,
    };
  }

  /**
   * Generate command content for a task or tool
   */
  generateCommandContent(item, type) {
    const description = item.description || `Execute ${item.displayName || item.name}`;

    // Convert path to use {project-root} placeholder
    // Handle undefined/missing path by constructing from module and name
    let itemPath = item.path;
    if (!itemPath || typeof itemPath !== 'string') {
      // Fallback: construct path from module and name if path is missing
      const typePlural = type === 'task' ? 'tasks' : 'tools';
      itemPath = `{project-root}/${this.bmadFolderName}/${item.module}/${typePlural}/${item.name}.md`;
    } else {
      // Normalize path separators to forward slashes
      itemPath = itemPath.replaceAll('\\', '/');

      // Extract relative path from absolute paths (Windows or Unix)
      // Look for _bmad/ or bmad/ in the path and extract everything after it
      // Match patterns like: /_bmad/core/tasks/... or /bmad/core/tasks/...
      // Use [/\\] to handle both Unix forward slashes and Windows backslashes,
      // and also paths without a leading separator (e.g., C:/_bmad/...)
      const bmadMatch = itemPath.match(/[/\\]_bmad[/\\](.+)$/) || itemPath.match(/[/\\]bmad[/\\](.+)$/);
      if (bmadMatch) {
        // Found /_bmad/ or /bmad/ - use relative path after it
        itemPath = `{project-root}/${this.bmadFolderName}/${bmadMatch[1]}`;
      } else if (itemPath.startsWith(`${BMAD_FOLDER_NAME}/`)) {
        // Relative path starting with _bmad/
        itemPath = `{project-root}/${this.bmadFolderName}/${itemPath.slice(BMAD_FOLDER_NAME.length + 1)}`;
      } else if (itemPath.startsWith('bmad/')) {
        // Relative path starting with bmad/
        itemPath = `{project-root}/${this.bmadFolderName}/${itemPath.slice(5)}`;
      } else if (!itemPath.startsWith('{project-root}')) {
        // For other relative paths, prefix with project root and bmad folder
        itemPath = `{project-root}/${this.bmadFolderName}/${itemPath}`;
      }
    }

    return `---
description: '${description.replaceAll("'", "''")}'
disable-model-invocation: true
---

# ${item.displayName || item.name}

Read the entire ${type} file at: ${itemPath}

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
   * Creates flat files like: bmad_bmm_help.md
   *
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {string} baseCommandsDir - Base commands directory for the IDE
   * @returns {Object} Generation results
   */
  async generateColonTaskToolCommands(projectDir, bmadDir, baseCommandsDir) {
    const tasks = await this.loadTaskManifest(bmadDir);
    const tools = await this.loadToolManifest(bmadDir);

    let generatedCount = 0;

    // Generate command files for tasks
    for (const task of tasks || []) {
      const commandContent = this.generateCommandContent(task, 'task');
      // Use underscore format: bmad_bmm_name.md
      const flatName = toColonName(task.module, 'tasks', task.name);
      const commandPath = path.join(baseCommandsDir, flatName);
      await fs.ensureDir(path.dirname(commandPath));
      await fs.writeFile(commandPath, commandContent);
      generatedCount++;
    }

    // Generate command files for tools
    for (const tool of tools || []) {
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
      tasks: (tasks || []).length,
      tools: (tools || []).length,
    };
  }

  /**
   * Generate task and tool commands using underscore format (Windows-compatible)
   * Creates flat files like: bmad_bmm_help.md
   *
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {string} baseCommandsDir - Base commands directory for the IDE
   * @returns {Object} Generation results
   */
  async generateDashTaskToolCommands(projectDir, bmadDir, baseCommandsDir) {
    const tasks = await this.loadTaskManifest(bmadDir);
    const tools = await this.loadToolManifest(bmadDir);

    let generatedCount = 0;

    // Generate command files for tasks
    for (const task of tasks || []) {
      const commandContent = this.generateCommandContent(task, 'task');
      // Use dash format: bmad-bmm-name.md
      const flatName = toDashPath(`${task.module}/tasks/${task.name}.md`);
      const commandPath = path.join(baseCommandsDir, flatName);
      await fs.ensureDir(path.dirname(commandPath));
      await fs.writeFile(commandPath, commandContent);
      generatedCount++;
    }

    // Generate command files for tools
    for (const tool of tools || []) {
      const commandContent = this.generateCommandContent(tool, 'tool');
      // Use dash format: bmad-bmm-name.md
      const flatName = toDashPath(`${tool.module}/tools/${tool.name}.md`);
      const commandPath = path.join(baseCommandsDir, flatName);
      await fs.ensureDir(path.dirname(commandPath));
      await fs.writeFile(commandPath, commandContent);
      generatedCount++;
    }

    return {
      generated: generatedCount,
      tasks: (tasks || []).length,
      tools: (tools || []).length,
    };
  }

  /**
   * Write task/tool artifacts using underscore format (Windows-compatible)
   * Creates flat files like: bmad_bmm_help.md
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
   * Write task/tool artifacts using dash format (NEW STANDARD)
   * Creates flat files like: bmad-bmm-help.md
   *
   * Note: Tasks/tools do NOT have bmad-agent- prefix - only agents do.
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
        // Use dash format: bmad-module-name.md
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
