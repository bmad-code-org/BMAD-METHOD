const path = require('node:path');
const fs = require('fs-extra');
const csv = require('csv-parse/sync');
const chalk = require('chalk');

/**
 * Generates command files for each workflow in the manifest
 */
class WorkflowCommandGenerator {
  constructor(bmadFolderName = 'bmad') {
    this.templatePath = path.join(__dirname, '../templates/workflow-command-template.md');
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
      console.log(chalk.yellow('Workflow manifest not found. Skipping command generation.'));
      return { generated: 0 };
    }

    // Filter to only standalone workflows
    const standaloneWorkflows = workflows.filter((w) => w.standalone === 'true' || w.standalone === true);

    // Base commands directory
    const baseCommandsDir = path.join(projectDir, '.claude', 'commands', 'bmad');

    let generatedCount = 0;

    // Generate a command file for each standalone workflow, organized by module
    for (const workflow of standaloneWorkflows) {
      const moduleWorkflowsDir = path.join(baseCommandsDir, workflow.module, 'workflows');
      await fs.ensureDir(moduleWorkflowsDir);

      const commandContent = await this.generateCommandContent(workflow, bmadDir);
      const commandPath = path.join(moduleWorkflowsDir, `${workflow.name}.md`);

      await fs.writeFile(commandPath, commandContent);
      generatedCount++;
    }

    // Also create a workflow launcher README in each module
    const groupedWorkflows = this.groupWorkflowsByModule(standaloneWorkflows);
    await this.createModuleWorkflowLaunchers(baseCommandsDir, groupedWorkflows);

    return { generated: generatedCount };
  }

  async collectWorkflowArtifacts(bmadDir) {
    const workflows = await this.loadWorkflowManifest(bmadDir);

    if (!workflows) {
      return { artifacts: [], counts: { commands: 0, launchers: 0 } };
    }

    // Filter to only standalone workflows
    const standaloneWorkflows = workflows.filter((w) => w.standalone === 'true' || w.standalone === true);

    const artifacts = [];

    for (const workflow of standaloneWorkflows) {
      const commandContent = await this.generateCommandContent(workflow, bmadDir);
      artifacts.push({
        type: 'workflow-command',
        module: workflow.module,
        relativePath: path.join(workflow.module, 'workflows', `${workflow.name}.md`),
        content: commandContent,
        sourcePath: workflow.path,
      });
    }

    const groupedWorkflows = this.groupWorkflowsByModule(standaloneWorkflows);
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
        commands: standaloneWorkflows.length,
        launchers: Object.keys(groupedWorkflows).length,
      },
    };
  }

  /**
   * Generate command content for a workflow
   */
  async generateCommandContent(workflow, bmadDir) {
    // Load the template
    const template = await fs.readFile(this.templatePath, 'utf8');

    // Convert source path to installed path
    // From: /Users/.../src/modules/bmm/workflows/.../workflow.yaml
    // To: {project-root}/{bmad_folder}/bmm/workflows/.../workflow.yaml
    let workflowPath = workflow.path;

    // Extract the relative path from source
    if (workflowPath.includes('/src/modules/')) {
      const match = workflowPath.match(/\/src\/modules\/(.+)/);
      if (match) {
        workflowPath = `${this.bmadFolderName}/${match[1]}`;
      }
    } else if (workflowPath.includes('/src/core/')) {
      const match = workflowPath.match(/\/src\/core\/(.+)/);
      if (match) {
        workflowPath = `${this.bmadFolderName}/core/${match[1]}`;
      }
    }

    // Replace template variables
    return template
      .replaceAll('{{name}}', workflow.name)
      .replaceAll('{{module}}', workflow.module)
      .replaceAll('{{description}}', workflow.description)
      .replaceAll('{{workflow_path}}', workflowPath)
      .replaceAll('{bmad_folder}', this.bmadFolderName)
      .replaceAll('{{interactive}}', workflow.interactive)
      .replaceAll('{{author}}', workflow.author || 'BMAD');
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
1. LOAD {project-root}/${this.bmadFolderName}/core/tasks/workflow.xml
2. Pass the workflow path as 'workflow-config' parameter
3. Follow workflow.xml instructions EXACTLY
4. Save outputs after EACH section

## Modes
- Normal: Full interaction
- #yolo: Skip optional steps
`;

    return content;
  }

  transformWorkflowPath(workflowPath) {
    let transformed = workflowPath;

    if (workflowPath.includes('/src/modules/')) {
      const match = workflowPath.match(/\/src\/modules\/(.+)/);
      if (match) {
        transformed = `{project-root}/${this.bmadFolderName}/${match[1]}`;
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
    const manifestPath = path.join(bmadDir, '_cfg', 'workflow-manifest.csv');

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
