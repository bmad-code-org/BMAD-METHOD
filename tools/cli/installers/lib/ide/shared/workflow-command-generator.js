const path = require('node:path');
const fs = require('fs-extra');
const csv = require('csv-parse/sync');
const prompts = require('../../../../lib/prompts');
const { toColonPath, toDashPath, customAgentColonName, customAgentDashName, BMAD_FOLDER_NAME } = require('./path-utils');

/**
 * Generates command files for each workflow in the manifest
 */
class WorkflowCommandGenerator {
  constructor(bmadFolderName = BMAD_FOLDER_NAME) {
    this.templatePath = path.join(__dirname, '../templates/workflow-commander.md');
    this.bmadFolderName = bmadFolderName;
  }

  /**
   * Generate workflow commands from the manifest CSV
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   */
  async generateWorkflowCommands(projectDir, bmadDir) {
    const workflows = await this.loadWorkflowManifest(bmadDir);

    if (!workflows) {
      await prompts.log.warn('Workflow manifest not found. Skipping command generation.');
      return { generated: 0 };
    }

    // ALL workflows now generate commands - no standalone filtering
    const allWorkflows = workflows;

    // Base commands directory
    const baseCommandsDir = path.join(projectDir, '.claude', 'commands', 'bmad');

    let generatedCount = 0;

    // Generate a command file for each workflow, organized by module
    for (const workflow of allWorkflows) {
      const moduleWorkflowsDir = path.join(baseCommandsDir, workflow.module, 'workflows');
      await fs.ensureDir(moduleWorkflowsDir);

      const commandContent = await this.generateCommandContent(workflow, bmadDir);
      const commandPath = path.join(moduleWorkflowsDir, `${workflow.name}.md`);

      await fs.writeFile(commandPath, commandContent);
      generatedCount++;
    }

    // Also create a workflow launcher README in each module
    const groupedWorkflows = this.groupWorkflowsByModule(allWorkflows);
    await this.createModuleWorkflowLaunchers(baseCommandsDir, groupedWorkflows);

    return { generated: generatedCount };
  }

  async collectWorkflowArtifacts(bmadDir) {
    const workflows = await this.loadWorkflowManifest(bmadDir);

    if (!workflows) {
      return { artifacts: [], counts: { commands: 0, launchers: 0 } };
    }

    // ALL workflows now generate commands - no standalone filtering
    const allWorkflows = workflows;

    const artifacts = [];

    for (const workflow of allWorkflows) {
      const commandContent = await this.generateCommandContent(workflow, bmadDir);
      // Calculate the relative workflow path (e.g., bmm/workflows/4-implementation/sprint-planning/workflow.md)
      let workflowRelPath = workflow.path || '';
      workflowRelPath = workflowRelPath.replaceAll('\\', '/');
      // Remove _bmad/ prefix if present to get relative path from project root
      // Handle both absolute paths (/path/to/_bmad/...) and relative paths (_bmad/...)
      if (workflowRelPath.includes('_bmad/')) {
        const parts = workflowRelPath.split(/_bmad\//);
        if (parts.length > 1) {
          workflowRelPath = parts.at(-1);
        }
      } else if (workflowRelPath.includes('/src/') || workflowRelPath.startsWith('src/')) {
        const match = workflowRelPath.match(/(?:^|\/)src\/([^/]+)\/(.+)/);
        if (match) {
          workflowRelPath = `${match[1]}/${match[2]}`;
        }
      }
      artifacts.push({
        type: 'workflow-command',
        name: workflow.name,
        description: workflow.description || `${workflow.name} workflow`,
        module: workflow.module,
        relativePath: path.join(workflow.module, 'workflows', `${workflow.name}.md`),
        workflowPath: workflowRelPath, // Relative path to actual workflow file
        content: commandContent,
        sourcePath: workflow.path,
      });
    }

    const groupedWorkflows = this.groupWorkflowsByModule(allWorkflows);
    for (const [module, launcherContent] of Object.entries(this.buildModuleWorkflowLaunchers(groupedWorkflows))) {
      artifacts.push({
        type: 'workflow-launcher',
        module,
        relativePath: path.join(module, 'workflows', 'README.md'),
        content: launcherContent,
        sourcePath: null,
      });
    }

    return {
      artifacts,
      counts: {
        commands: allWorkflows.length,
        launchers: Object.keys(groupedWorkflows).length,
      },
    };
  }

  /**
   * Generate command content for a workflow
   */
  async generateCommandContent(workflow, bmadDir) {
    // Load the workflow command template
    const template = await fs.readFile(this.templatePath, 'utf8');
    const workflowPath = this.mapSourcePathToInstalled(workflow.path);

    // Replace template variables
    return template
      .replaceAll('{{name}}', workflow.name)
      .replaceAll('{{module}}', workflow.module)
      .replaceAll('{{description}}', workflow.description)
      .replaceAll('{{workflow_path}}', workflowPath)
      .replaceAll('_bmad', this.bmadFolderName);
  }

  /**
   * Create workflow launcher files for each module
   */
  async createModuleWorkflowLaunchers(baseCommandsDir, workflowsByModule) {
    for (const [module, moduleWorkflows] of Object.entries(workflowsByModule)) {
      const content = this.buildLauncherContent(module, moduleWorkflows);
      const moduleWorkflowsDir = path.join(baseCommandsDir, module, 'workflows');
      await fs.ensureDir(moduleWorkflowsDir);
      const launcherPath = path.join(moduleWorkflowsDir, 'README.md');
      await fs.writeFile(launcherPath, content);
    }
  }

  groupWorkflowsByModule(workflows) {
    const workflowsByModule = {};

    for (const workflow of workflows) {
      if (!workflowsByModule[workflow.module]) {
        workflowsByModule[workflow.module] = [];
      }

      workflowsByModule[workflow.module].push({
        ...workflow,
        displayPath: this.transformWorkflowPath(workflow.path),
      });
    }

    return workflowsByModule;
  }

  buildModuleWorkflowLaunchers(groupedWorkflows) {
    const launchers = {};

    for (const [module, moduleWorkflows] of Object.entries(groupedWorkflows)) {
      launchers[module] = this.buildLauncherContent(module, moduleWorkflows);
    }

    return launchers;
  }

  buildLauncherContent(module, moduleWorkflows) {
    let content = `# ${module.toUpperCase()} Workflows

## Available Workflows in ${module}

`;

    for (const workflow of moduleWorkflows) {
      content += `**${workflow.name}**\n`;
      content += `- Path: \`${workflow.displayPath}\`\n`;
      content += `- ${workflow.description}\n\n`;
    }

    content += `
## Execution

When running any workflow:
1. Resolve loader paths:
   - Primary: {project-root}/${this.bmadFolderName}/core/tasks/workflow.md
   - Optional dev fallback: {project-root}/src/core/tasks/workflow.md (only if it exists and is readable)
2. Check the primary path exists and is readable before loading
3. If primary is missing/unreadable, log a warning with the primary path and error
4. Only if the dev fallback exists and is readable, try the fallback path; otherwise skip it
5. If no readable loader is found, log an error with all attempted readable paths and stop
6. LOAD the resolved workflow loader file
7. Pass the workflow path as 'workflow-config' parameter
8. Follow workflow.md instructions EXACTLY
9. Save outputs after EACH section

## Modes
- Normal: Full interaction
- #yolo: Skip optional steps
`;

    return content;
  }

  transformWorkflowPath(workflowPath) {
    return this.mapSourcePathToInstalled(workflowPath, true);
  }

  mapSourcePathToInstalled(sourcePath, includeProjectRootPrefix = false) {
    if (!sourcePath) {
      return sourcePath;
    }

    const normalized = sourcePath.replaceAll('\\', '/');
    const srcMatch = normalized.match(/(?:^|\/)src\/([^/]+)\/(.+)/);
    if (srcMatch) {
      const mapped = `${this.bmadFolderName}/${srcMatch[1]}/${srcMatch[2]}`;
      return includeProjectRootPrefix ? `{project-root}/${mapped}` : mapped;
    }

    if (normalized.includes('_bmad/')) {
      const parts = normalized.split(/_bmad\//);
      const relative = parts.at(-1);
      const mapped = `${this.bmadFolderName}/${relative}`;
      return includeProjectRootPrefix ? `{project-root}/${mapped}` : mapped;
    }

    if (normalized.startsWith(`${this.bmadFolderName}/`)) {
      return includeProjectRootPrefix ? `{project-root}/${normalized}` : normalized;
    }

    return sourcePath;
  }

  async loadWorkflowManifest(bmadDir) {
    const manifestPath = path.join(bmadDir, '_config', 'workflow-manifest.csv');

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
   * Write workflow command artifacts using underscore format (Windows-compatible)
   * Creates flat files like: bmad_bmm_correct-course.md
   *
   * @param {string} baseCommandsDir - Base commands directory for the IDE
   * @param {Array} artifacts - Workflow artifacts
   * @returns {number} Count of commands written
   */
  async writeColonArtifacts(baseCommandsDir, artifacts) {
    let writtenCount = 0;

    for (const artifact of artifacts) {
      if (artifact.type === 'workflow-command') {
        // Convert relativePath to underscore format: bmm/workflows/correct-course.md → bmad_bmm_correct-course.md
        const flatName = toColonPath(artifact.relativePath);
        const commandPath = path.join(baseCommandsDir, flatName);
        await fs.ensureDir(path.dirname(commandPath));
        await fs.writeFile(commandPath, artifact.content);
        writtenCount++;
      }
    }

    return writtenCount;
  }

  /**
   * Write workflow command artifacts using dash format (NEW STANDARD)
   * Creates flat files like: bmad-bmm-correct-course.md
   *
   * Note: Workflows do NOT have .agent.md suffix - only agents do.
   *
   * @param {string} baseCommandsDir - Base commands directory for the IDE
   * @param {Array} artifacts - Workflow artifacts
   * @returns {number} Count of commands written
   */
  async writeDashArtifacts(baseCommandsDir, artifacts) {
    let writtenCount = 0;

    for (const artifact of artifacts) {
      if (artifact.type === 'workflow-command') {
        // Convert relativePath to dash format: bmm/workflows/correct-course.md → bmad-bmm-correct-course.md
        const flatName = toDashPath(artifact.relativePath);
        const commandPath = path.join(baseCommandsDir, flatName);
        await fs.ensureDir(path.dirname(commandPath));
        await fs.writeFile(commandPath, artifact.content);
        writtenCount++;
      }
    }

    return writtenCount;
  }
}

module.exports = { WorkflowCommandGenerator };
