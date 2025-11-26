const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const crypto = require('node:crypto');
const { getSourcePath, getModulePath } = require('../../../lib/project-root');

// Load package.json for version info
const packageJson = require('../../../../../package.json');

/**
 * Generates manifest files for installed workflows, agents, and tasks
 */
class ManifestGenerator {
  constructor() {
    this.workflows = [];
    this.agents = [];
    this.tasks = [];
    this.tools = [];
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

    // Store modules list (all modules including preserved ones)
    const preservedModules = options.preservedModules || [];
    // Deduplicate modules list to prevent duplicates
    this.modules = [...new Set(['core', ...selectedModules, ...preservedModules])];
    this.updatedModules = [...new Set(['core', ...selectedModules])]; // Only these get rescanned
    this.preservedModules = preservedModules; // These stay as-is in CSVs
    this.bmadDir = bmadDir;
    this.bmadFolderName = path.basename(bmadDir); // Get the actual folder name (e.g., '.bmad' or 'bmad')
    this.allInstalledFiles = installedFiles;

    if (!Object.prototype.hasOwnProperty.call(options, 'ides')) {
      throw new Error('ManifestGenerator requires `options.ides` to be provided – installer should supply the selected IDEs array.');
    }

    const resolvedIdes = options.ides ?? [];
    if (!Array.isArray(resolvedIdes)) {
      throw new TypeError('ManifestGenerator expected `options.ides` to be an array.');
    }

    // Filter out any undefined/null values from IDE list
    this.selectedIdes = resolvedIdes.filter((ide) => ide && typeof ide === 'string');

    // Collect workflow data
    await this.collectWorkflows(selectedModules);

    // Collect agent data
    await this.collectAgents(selectedModules);

    // Collect task data
    await this.collectTasks(selectedModules);

    // Collect tool data
    await this.collectTools(selectedModules);

    // Write manifest files and collect their paths
    const manifestFiles = [
      await this.writeMainManifest(cfgDir),
      await this.writeWorkflowManifest(cfgDir),
      await this.writeAgentManifest(cfgDir),
      await this.writeTaskManifest(cfgDir),
      await this.writeToolManifest(cfgDir),
      await this.writeFilesManifest(cfgDir),
    ];

    return {
      workflows: this.workflows.length,
      agents: this.agents.length,
      tasks: this.tasks.length,
      tools: this.tools.length,
      files: this.files.length,
      manifestFiles: manifestFiles,
    };
  }

  /**
   * Collect all workflows from core and selected modules
   * Scans the INSTALLED bmad directory, not the source
   */
  async collectWorkflows(selectedModules) {
    this.workflows = [];

    // Use updatedModules which already includes deduplicated 'core' + selectedModules
    for (const moduleName of this.updatedModules) {
      const modulePath = path.join(this.bmadDir, moduleName);

      if (await fs.pathExists(modulePath)) {
        const moduleWorkflows = await this.getWorkflowsFromPath(modulePath, moduleName);
        this.workflows.push(...moduleWorkflows);
      }
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
                  ? `${this.bmadFolderName}/core/workflows/${relativePath}/workflow.yaml`
                  : `${this.bmadFolderName}/${moduleName}/workflows/${relativePath}/workflow.yaml`;

              // Check for standalone property (default: false)
              const standalone = workflow.standalone === true;

              workflows.push({
                name: workflow.name,
                description: workflow.description.replaceAll('"', '""'), // Escape quotes for CSV
                module: moduleName,
                path: installPath,
                standalone: standalone,
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

    // Use updatedModules which already includes deduplicated 'core' + selectedModules
    for (const moduleName of this.updatedModules) {
      const agentsPath = path.join(this.bmadDir, moduleName, 'agents');

      if (await fs.pathExists(agentsPath)) {
        const moduleAgents = await this.getAgentsFromDir(agentsPath, moduleName);
        this.agents.push(...moduleAgents);
      }
    }

    // Get standalone agents from bmad/agents/ directory
    const standaloneAgentsDir = path.join(this.bmadDir, 'agents');
    if (await fs.pathExists(standaloneAgentsDir)) {
      const agentDirs = await fs.readdir(standaloneAgentsDir, { withFileTypes: true });

      for (const agentDir of agentDirs) {
        if (!agentDir.isDirectory()) continue;

        const agentDirPath = path.join(standaloneAgentsDir, agentDir.name);
        const standaloneAgents = await this.getAgentsFromDir(agentDirPath, 'standalone');
        this.agents.push(...standaloneAgents);
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
        const installPath =
          moduleName === 'core' ? `${this.bmadFolderName}/core/agents/${file}` : `${this.bmadFolderName}/${moduleName}/agents/${file}`;

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

    // Use updatedModules which already includes deduplicated 'core' + selectedModules
    for (const moduleName of this.updatedModules) {
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
      // Check for both .xml and .md files
      if (file.endsWith('.xml') || file.endsWith('.md')) {
        const filePath = path.join(dirPath, file);
        const content = await fs.readFile(filePath, 'utf8');

        // Extract task metadata from content if possible
        const nameMatch = content.match(/name="([^"]+)"/);

        // Try description attribute first, fall back to <objective> element
        const descMatch = content.match(/description="([^"]+)"/);
        const objMatch = content.match(/<objective>([^<]+)<\/objective>/);
        const description = descMatch ? descMatch[1] : objMatch ? objMatch[1].trim() : '';

        // Check for standalone attribute in <task> tag (default: false)
        const standaloneMatch = content.match(/<task[^>]+standalone="true"/);
        const standalone = !!standaloneMatch;

        // Build relative path for installation
        const installPath =
          moduleName === 'core' ? `${this.bmadFolderName}/core/tasks/${file}` : `${this.bmadFolderName}/${moduleName}/tasks/${file}`;

        const taskName = file.replace(/\.(xml|md)$/, '');
        tasks.push({
          name: taskName,
          displayName: nameMatch ? nameMatch[1] : taskName,
          description: description.replaceAll('"', '""'),
          module: moduleName,
          path: installPath,
          standalone: standalone,
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
   * Collect all tools from core and selected modules
   * Scans the INSTALLED bmad directory, not the source
   */
  async collectTools(selectedModules) {
    this.tools = [];

    // Use updatedModules which already includes deduplicated 'core' + selectedModules
    for (const moduleName of this.updatedModules) {
      const toolsPath = path.join(this.bmadDir, moduleName, 'tools');

      if (await fs.pathExists(toolsPath)) {
        const moduleTools = await this.getToolsFromDir(toolsPath, moduleName);
        this.tools.push(...moduleTools);
      }
    }
  }

  /**
   * Get tools from a directory
   */
  async getToolsFromDir(dirPath, moduleName) {
    const tools = [];
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      // Check for both .xml and .md files
      if (file.endsWith('.xml') || file.endsWith('.md')) {
        const filePath = path.join(dirPath, file);
        const content = await fs.readFile(filePath, 'utf8');

        // Extract tool metadata from content if possible
        const nameMatch = content.match(/name="([^"]+)"/);

        // Try description attribute first, fall back to <objective> element
        const descMatch = content.match(/description="([^"]+)"/);
        const objMatch = content.match(/<objective>([^<]+)<\/objective>/);
        const description = descMatch ? descMatch[1] : objMatch ? objMatch[1].trim() : '';

        // Check for standalone attribute in <tool> tag (default: false)
        const standaloneMatch = content.match(/<tool[^>]+standalone="true"/);
        const standalone = !!standaloneMatch;

        // Build relative path for installation
        const installPath =
          moduleName === 'core' ? `${this.bmadFolderName}/core/tools/${file}` : `${this.bmadFolderName}/${moduleName}/tools/${file}`;

        const toolName = file.replace(/\.(xml|md)$/, '');
        tools.push({
          name: toolName,
          displayName: nameMatch ? nameMatch[1] : toolName,
          description: description.replaceAll('"', '""'),
          module: moduleName,
          path: installPath,
          standalone: standalone,
        });

        // Add to files list
        this.files.push({
          type: 'tool',
          name: toolName,
          module: moduleName,
          path: installPath,
        });
      }
    }

    return tools;
  }

  /**
   * Write main manifest as YAML with installation info only
   * @returns {string} Path to the manifest file
   */
  async writeMainManifest(cfgDir) {
    const manifestPath = path.join(cfgDir, 'manifest.yaml');

    const manifest = {
      installation: {
        version: packageJson.version,
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

    // Ensure POSIX-compliant final newline
    const content = yamlStr.endsWith('\n') ? yamlStr : yamlStr + '\n';
    await fs.writeFile(manifestPath, content);
    return manifestPath;
  }

  /**
   * Read existing CSV and preserve rows for modules NOT being updated
   * @param {string} csvPath - Path to existing CSV file
   * @param {number} moduleColumnIndex - Which column contains the module name (0-indexed)
   * @param {Array<string>} expectedColumns - Expected column names in order
   * @param {Object} defaultValues - Default values for missing columns
   * @returns {Array} Preserved CSV rows (without header), upgraded to match expected columns
   */
  async getPreservedCsvRows(csvPath, moduleColumnIndex, expectedColumns, defaultValues = {}) {
    if (!(await fs.pathExists(csvPath)) || this.preservedModules.length === 0) {
      return [];
    }

    try {
      const content = await fs.readFile(csvPath, 'utf8');
      const lines = content.trim().split('\n');

      if (lines.length < 2) {
        return []; // No data rows
      }

      // Parse header to understand old schema
      const header = lines[0];
      const headerColumns = header.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const oldColumns = headerColumns.map((c) => c.replaceAll(/^"|"$/g, ''));

      // Skip header row for data
      const dataRows = lines.slice(1);
      const preservedRows = [];

      for (const row of dataRows) {
        // Simple CSV parsing (handles quoted values)
        const columns = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        const cleanColumns = columns.map((c) => c.replaceAll(/^"|"$/g, ''));

        const moduleValue = cleanColumns[moduleColumnIndex];

        // Keep this row if it belongs to a preserved module
        if (this.preservedModules.includes(moduleValue)) {
          // Upgrade row to match expected schema
          const upgradedRow = this.upgradeRowToSchema(cleanColumns, oldColumns, expectedColumns, defaultValues);
          preservedRows.push(upgradedRow);
        }
      }

      return preservedRows;
    } catch (error) {
      console.warn(`Warning: Failed to read existing CSV ${csvPath}:`, error.message);
      return [];
    }
  }

  /**
   * Upgrade a CSV row from old schema to new schema
   * @param {Array<string>} rowValues - Values from old row
   * @param {Array<string>} oldColumns - Old column names
   * @param {Array<string>} newColumns - New column names
   * @param {Object} defaultValues - Default values for missing columns
   * @returns {string} Upgraded CSV row
   */
  upgradeRowToSchema(rowValues, oldColumns, newColumns, defaultValues) {
    const upgradedValues = [];

    for (const newCol of newColumns) {
      const oldIndex = oldColumns.indexOf(newCol);

      if (oldIndex !== -1 && oldIndex < rowValues.length) {
        // Column exists in old schema, use its value
        upgradedValues.push(rowValues[oldIndex]);
      } else if (defaultValues[newCol] === undefined) {
        // Column missing, no default provided
        upgradedValues.push('');
      } else {
        // Column missing, use default value
        upgradedValues.push(defaultValues[newCol]);
      }
    }

    // Properly quote values and join
    return upgradedValues.map((v) => `"${v}"`).join(',');
  }

  /**
   * Write workflow manifest CSV
   * @returns {string} Path to the manifest file
   */
  async writeWorkflowManifest(cfgDir) {
    const csvPath = path.join(cfgDir, 'workflow-manifest.csv');

    // Create CSV header with standalone column
    let csv = 'name,description,module,path,standalone\n';

    // Add all workflows
    for (const workflow of this.workflows) {
      csv += `"${workflow.name}","${workflow.description}","${workflow.module}","${workflow.path}","${workflow.standalone}"\n`;
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

    // Add all agents
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

    // Create CSV header with standalone column
    let csv = 'name,displayName,description,module,path,standalone\n';

    // Add all tasks
    for (const task of this.tasks) {
      csv += `"${task.name}","${task.displayName}","${task.description}","${task.module}","${task.path}","${task.standalone}"\n`;
    }

    await fs.writeFile(csvPath, csv);
    return csvPath;
  }

  /**
   * Write tool manifest CSV
   * @returns {string} Path to the manifest file
   */
  async writeToolManifest(cfgDir) {
    const csvPath = path.join(cfgDir, 'tool-manifest.csv');

    // Create CSV header with standalone column
    let csv = 'name,displayName,description,module,path,standalone\n';

    // Add all tools
    for (const tool of this.tools) {
      csv += `"${tool.name}","${tool.displayName}","${tool.description}","${tool.module}","${tool.path}","${tool.standalone}"\n`;
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
        const filePath = path.join(this.bmadDir, file.path.replace(this.bmadFolderName + '/', ''));
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

    // Add all files
    for (const file of allFiles) {
      csv += `"${file.type}","${file.name}","${file.module}","${file.path}","${file.hash}"\n`;
    }

    await fs.writeFile(csvPath, csv);
    return csvPath;
  }
}

module.exports = { ManifestGenerator };
