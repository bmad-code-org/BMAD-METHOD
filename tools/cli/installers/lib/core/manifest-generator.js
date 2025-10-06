const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const crypto = require('node:crypto');
const { getSourcePath, getModulePath } = require('../../../lib/project-root');

/**
 * Generates manifest files for installed workflows, agents, and tasks
 */
class ManifestGenerator {
  constructor() {
    this.workflows = [];
    this.agents = [];
    this.tasks = [];
    this.modules = [];
    this.files = [];
    this.selectedIdes = [];
  }

  /**
   * Generate all manifests for the installation
   * @param {string} bmadDir - BMAD installation directory
   * @param {Array} selectedModules - Selected modules for installation
   * @param {Array} installedFiles - All installed files (optional, for hash tracking)
   */
  async generateManifests(bmadDir, selectedModules, installedFiles = [], options = {}) {
    // Create _cfg directory if it doesn't exist
    const cfgDir = path.join(bmadDir, '_cfg');
    await fs.ensureDir(cfgDir);

    // Store modules list
    this.modules = ['core', ...selectedModules];
    this.bmadDir = bmadDir;
    this.allInstalledFiles = installedFiles;

    if (!Object.prototype.hasOwnProperty.call(options, 'ides')) {
      throw new Error('ManifestGenerator requires `options.ides` to be provided – installer should supply the selected IDEs array.');
    }

    const resolvedIdes = options.ides ?? [];
    if (!Array.isArray(resolvedIdes)) {
      throw new TypeError('ManifestGenerator expected `options.ides` to be an array.');
    }

    this.selectedIdes = resolvedIdes;

    // Collect workflow data
    await this.collectWorkflows(selectedModules);

    // Collect agent data
    await this.collectAgents(selectedModules);

    // Collect task data
    await this.collectTasks(selectedModules);

    // Write manifest files and collect their paths
    const manifestFiles = [
      await this.writeMainManifest(cfgDir),
      await this.writeWorkflowManifest(cfgDir),
      await this.writeAgentManifest(cfgDir),
      await this.writeTaskManifest(cfgDir),
      await this.writeFilesManifest(cfgDir),
    ];

    return {
      workflows: this.workflows.length,
      agents: this.agents.length,
      tasks: this.tasks.length,
      files: this.files.length,
      manifestFiles: manifestFiles,
    };
  }

  /**
   * Collect all workflows from core and selected modules
   */
  async collectWorkflows(selectedModules) {
    this.workflows = [];

    // Get core workflows
    const corePath = getModulePath('core');
    const coreWorkflows = await this.getWorkflowsFromPath(corePath, 'core');
    this.workflows.push(...coreWorkflows);

    // Get module workflows
    for (const moduleName of selectedModules) {
      const modulePath = getSourcePath(`modules/${moduleName}`);
      const moduleWorkflows = await this.getWorkflowsFromPath(modulePath, moduleName);
      this.workflows.push(...moduleWorkflows);
    }
  }

  /**
   * Recursively find and parse workflow.yaml files
   */
  async getWorkflowsFromPath(basePath, moduleName) {
    const workflows = [];
    const workflowsPath = path.join(basePath, 'workflows');

    if (!(await fs.pathExists(workflowsPath))) {
      return workflows;
    }

    // Recursively find workflow.yaml files
    const findWorkflows = async (dir, relativePath = '') => {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Recurse into subdirectories
          const newRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
          await findWorkflows(fullPath, newRelativePath);
        } else if (entry.name === 'workflow.yaml') {
          // Parse workflow file
          try {
            const content = await fs.readFile(fullPath, 'utf8');
            const workflow = yaml.load(content);

            // Skip template workflows (those with placeholder values)
            if (workflow.name && workflow.name.includes('{') && workflow.name.includes('}')) {
              continue;
            }

            if (workflow.name && workflow.description) {
              // Build relative path for installation
              const installPath =
                moduleName === 'core'
                  ? `bmad/core/workflows/${relativePath}/workflow.yaml`
                  : `bmad/${moduleName}/workflows/${relativePath}/workflow.yaml`;

              workflows.push({
                name: workflow.name,
                description: workflow.description.replaceAll('"', '""'), // Escape quotes for CSV
                module: moduleName,
                path: installPath,
              });

              // Add to files list
              this.files.push({
                type: 'workflow',
                name: workflow.name,
                module: moduleName,
                path: installPath,
              });
            }
          } catch (error) {
            console.warn(`Warning: Failed to parse workflow at ${fullPath}: ${error.message}`);
          }
        }
      }
    };

    await findWorkflows(workflowsPath);
    return workflows;
  }

  /**
   * Collect all agents from core and selected modules
   * Scans the INSTALLED bmad directory, not the source
   */
  async collectAgents(selectedModules) {
    this.agents = [];

    // Get core agents from installed bmad directory
    const coreAgentsPath = path.join(this.bmadDir, 'core', 'agents');
    if (await fs.pathExists(coreAgentsPath)) {
      const coreAgents = await this.getAgentsFromDir(coreAgentsPath, 'core');
      this.agents.push(...coreAgents);
    }

    // Get module agents from installed bmad directory
    for (const moduleName of selectedModules) {
      const agentsPath = path.join(this.bmadDir, moduleName, 'agents');

      if (await fs.pathExists(agentsPath)) {
        const moduleAgents = await this.getAgentsFromDir(agentsPath, moduleName);
        this.agents.push(...moduleAgents);
      }
    }
  }

  /**
   * Get agents from a directory
   * Only includes compiled .md files (not .agent.yaml source files)
   */
  async getAgentsFromDir(dirPath, moduleName) {
    const agents = [];
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      // Only include .md files, skip .agent.yaml source files and README.md
      if (file.endsWith('.md') && !file.endsWith('.agent.yaml') && file.toLowerCase() !== 'readme.md') {
        const filePath = path.join(dirPath, file);
        const content = await fs.readFile(filePath, 'utf8');

        // Skip files that don't contain <agent> tag (e.g., README files)
        if (!content.includes('<agent')) {
          continue;
        }

        // Skip web-only agents
        if (content.includes('localskip="true"')) {
          continue;
        }

        // Extract agent metadata from the XML structure
        const nameMatch = content.match(/name="([^"]+)"/);
        const titleMatch = content.match(/title="([^"]+)"/);
        const iconMatch = content.match(/icon="([^"]+)"/);

        // Extract persona fields
        const roleMatch = content.match(/<role>([^<]+)<\/role>/);
        const identityMatch = content.match(/<identity>([\s\S]*?)<\/identity>/);
        const styleMatch = content.match(/<communication_style>([\s\S]*?)<\/communication_style>/);
        const principlesMatch = content.match(/<principles>([\s\S]*?)<\/principles>/);

        // Build relative path for installation
        const installPath = moduleName === 'core' ? `bmad/core/agents/${file}` : `bmad/${moduleName}/agents/${file}`;

        const agentName = file.replace('.md', '');

        // Helper function to clean and escape CSV content
        const cleanForCSV = (text) => {
          if (!text) return '';
          return text
            .trim()
            .replaceAll(/\s+/g, ' ') // Normalize whitespace
            .replaceAll('"', '""'); // Escape quotes for CSV
        };

        agents.push({
          name: agentName,
          displayName: nameMatch ? nameMatch[1] : agentName,
          title: titleMatch ? titleMatch[1] : '',
          icon: iconMatch ? iconMatch[1] : '',
          role: roleMatch ? cleanForCSV(roleMatch[1]) : '',
          identity: identityMatch ? cleanForCSV(identityMatch[1]) : '',
          communicationStyle: styleMatch ? cleanForCSV(styleMatch[1]) : '',
          principles: principlesMatch ? cleanForCSV(principlesMatch[1]) : '',
          module: moduleName,
          path: installPath,
        });

        // Add to files list
        this.files.push({
          type: 'agent',
          name: agentName,
          module: moduleName,
          path: installPath,
        });
      }
    }

    return agents;
  }

  /**
   * Collect all tasks from core and selected modules
   * Scans the INSTALLED bmad directory, not the source
   */
  async collectTasks(selectedModules) {
    this.tasks = [];

    // Get core tasks from installed bmad directory
    const coreTasksPath = path.join(this.bmadDir, 'core', 'tasks');
    if (await fs.pathExists(coreTasksPath)) {
      const coreTasks = await this.getTasksFromDir(coreTasksPath, 'core');
      this.tasks.push(...coreTasks);
    }

    // Get module tasks from installed bmad directory
    for (const moduleName of selectedModules) {
      const tasksPath = path.join(this.bmadDir, moduleName, 'tasks');

      if (await fs.pathExists(tasksPath)) {
        const moduleTasks = await this.getTasksFromDir(tasksPath, moduleName);
        this.tasks.push(...moduleTasks);
      }
    }
  }

  /**
   * Get tasks from a directory
   */
  async getTasksFromDir(dirPath, moduleName) {
    const tasks = [];
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(dirPath, file);
        const content = await fs.readFile(filePath, 'utf8');

        // Extract task metadata from content if possible
        const nameMatch = content.match(/name="([^"]+)"/);
        const objMatch = content.match(/<objective>([^<]+)<\/objective>/);

        // Build relative path for installation
        const installPath = moduleName === 'core' ? `bmad/core/tasks/${file}` : `bmad/${moduleName}/tasks/${file}`;

        const taskName = file.replace('.md', '');
        tasks.push({
          name: taskName,
          displayName: nameMatch ? nameMatch[1] : taskName,
          description: objMatch ? objMatch[1].trim().replaceAll('"', '""') : '',
          module: moduleName,
          path: installPath,
        });

        // Add to files list
        this.files.push({
          type: 'task',
          name: taskName,
          module: moduleName,
          path: installPath,
        });
      }
    }

    return tasks;
  }

  /**
   * Write main manifest as YAML with installation info only
   * @returns {string} Path to the manifest file
   */
  async writeMainManifest(cfgDir) {
    const manifestPath = path.join(cfgDir, 'manifest.yaml');

    const manifest = {
      installation: {
        version: '6.0.0-alpha.0',
        installDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
      modules: this.modules,
      ides: this.selectedIdes,
    };

    const yamlStr = yaml.dump(manifest, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    });

    await fs.writeFile(manifestPath, yamlStr);
    return manifestPath;
  }

  /**
   * Write workflow manifest CSV
   * @returns {string} Path to the manifest file
   */
  async writeWorkflowManifest(cfgDir) {
    const csvPath = path.join(cfgDir, 'workflow-manifest.csv');

    // Create CSV header
    let csv = 'name,description,module,path\n';

    // Add rows
    for (const workflow of this.workflows) {
      csv += `"${workflow.name}","${workflow.description}","${workflow.module}","${workflow.path}"\n`;
    }

    await fs.writeFile(csvPath, csv);
    return csvPath;
  }

  /**
   * Write agent manifest CSV
   * @returns {string} Path to the manifest file
   */
  async writeAgentManifest(cfgDir) {
    const csvPath = path.join(cfgDir, 'agent-manifest.csv');

    // Create CSV header with persona fields
    let csv = 'name,displayName,title,icon,role,identity,communicationStyle,principles,module,path\n';

    // Add rows
    for (const agent of this.agents) {
      csv += `"${agent.name}","${agent.displayName}","${agent.title}","${agent.icon}","${agent.role}","${agent.identity}","${agent.communicationStyle}","${agent.principles}","${agent.module}","${agent.path}"\n`;
    }

    await fs.writeFile(csvPath, csv);
    return csvPath;
  }

  /**
   * Write task manifest CSV
   * @returns {string} Path to the manifest file
   */
  async writeTaskManifest(cfgDir) {
    const csvPath = path.join(cfgDir, 'task-manifest.csv');

    // Create CSV header
    let csv = 'name,displayName,description,module,path\n';

    // Add rows
    for (const task of this.tasks) {
      csv += `"${task.name}","${task.displayName}","${task.description}","${task.module}","${task.path}"\n`;
    }

    await fs.writeFile(csvPath, csv);
    return csvPath;
  }

  /**
   * Write files manifest CSV
   */
  /**
   * Calculate SHA256 hash of a file
   * @param {string} filePath - Path to file
   * @returns {string} SHA256 hash
   */
  async calculateFileHash(filePath) {
    try {
      const content = await fs.readFile(filePath);
      return crypto.createHash('sha256').update(content).digest('hex');
    } catch {
      return '';
    }
  }

  /**
   * @returns {string} Path to the manifest file
   */
  async writeFilesManifest(cfgDir) {
    const csvPath = path.join(cfgDir, 'files-manifest.csv');

    // Create CSV header with hash column
    let csv = 'type,name,module,path,hash\n';

    // If we have ALL installed files, use those instead of just workflows/agents/tasks
    const allFiles = [];
    if (this.allInstalledFiles && this.allInstalledFiles.length > 0) {
      // Process all installed files
      for (const filePath of this.allInstalledFiles) {
        const relativePath = 'bmad' + filePath.replace(this.bmadDir, '').replaceAll('\\', '/');
        const ext = path.extname(filePath).toLowerCase();
        const fileName = path.basename(filePath, ext);

        // Determine module from path
        const pathParts = relativePath.split('/');
        const module = pathParts.length > 1 ? pathParts[1] : 'unknown';

        // Calculate hash
        const hash = await this.calculateFileHash(filePath);

        allFiles.push({
          type: ext.slice(1) || 'file',
          name: fileName,
          module: module,
          path: relativePath,
          hash: hash,
        });
      }
    } else {
      // Fallback: use the collected workflows/agents/tasks
      for (const file of this.files) {
        const filePath = path.join(this.bmadDir, file.path.replace('bmad/', ''));
        const hash = await this.calculateFileHash(filePath);
        allFiles.push({
          ...file,
          hash: hash,
        });
      }
    }

    // Sort files by module, then type, then name
    allFiles.sort((a, b) => {
      if (a.module !== b.module) return a.module.localeCompare(b.module);
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      return a.name.localeCompare(b.name);
    });

    // Add rows
    for (const file of allFiles) {
      csv += `"${file.type}","${file.name}","${file.module}","${file.path}","${file.hash}"\n`;
    }

    await fs.writeFile(csvPath, csv);
    return csvPath;
  }
}

module.exports = { ManifestGenerator };
