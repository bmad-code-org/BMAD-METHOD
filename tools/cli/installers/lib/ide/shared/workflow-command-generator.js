const path = require('node:path');
const fs = require('fs-extra');
const csv = require('csv-parse/sync');
const { BMAD_FOLDER_NAME } = require('./path-utils');

/**
 * Generates command files for each workflow in the manifest
 */
class WorkflowCommandGenerator {
  constructor(bmadFolderName = BMAD_FOLDER_NAME) {
    this.bmadFolderName = bmadFolderName;
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
      // Calculate the relative workflow path (e.g., bmm/workflows/4-implementation/sprint-planning/workflow.md)
      let workflowRelPath = workflow.path || '';
      // Normalize path separators for cross-platform compatibility
      workflowRelPath = workflowRelPath.replaceAll('\\', '/');
      // Remove _bmad/ prefix if present to get relative path from project root
      // Handle both absolute paths (/path/to/_bmad/...) and relative paths (_bmad/...)
      if (workflowRelPath.includes('_bmad/')) {
        const parts = workflowRelPath.split(/_bmad\//);
        if (parts.length > 1) {
          workflowRelPath = parts.slice(1).join('/');
        }
      } else if (workflowRelPath.includes('/src/')) {
        // Normalize source paths (e.g. .../src/bmm/...) to relative module path (e.g. bmm/...)
        const match = workflowRelPath.match(/\/src\/([^/]+)\/(.+)/);
        if (match) {
          workflowRelPath = `${match[1]}/${match[2]}`;
        }
      }
      artifacts.push({
        type: 'workflow-command',
        name: workflow.name,
        description: workflow.description || `${workflow.name} workflow`,
        module: workflow.module,
        canonicalId: workflow.canonicalId || '',
        relativePath: path.join(workflow.module, 'workflows', `${workflow.name}.md`),
        workflowPath: workflowRelPath, // Relative path to actual workflow file
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
1. LOAD the workflow.md file at the path shown above
2. READ its entire contents and follow its directions exactly
3. Save outputs after EACH section

## Modes
- Normal: Full interaction
- #yolo: Skip optional steps
`;

    return content;
  }

  transformWorkflowPath(workflowPath) {
    let transformed = workflowPath;

    if (workflowPath.includes('/src/bmm/')) {
      const match = workflowPath.match(/\/src\/bmm\/(.+)/);
      if (match) {
        transformed = `{project-root}/${this.bmadFolderName}/bmm/${match[1]}`;
      }
    } else if (workflowPath.includes('/src/core/')) {
      const match = workflowPath.match(/\/src\/core\/(.+)/);
      if (match) {
        transformed = `{project-root}/${this.bmadFolderName}/core/${match[1]}`;
      }
    }

    return transformed;
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
}

module.exports = { WorkflowCommandGenerator };
