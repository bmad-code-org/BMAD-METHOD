const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const crypto = require('node:crypto');
const csv = require('csv-parse/sync');
const { getSourcePath, getModulePath } = require('../../../lib/project-root');
const prompts = require('../../../lib/prompts');

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
   * Clean text for CSV output by normalizing whitespace and escaping quotes
   * @param {string} text - Text to clean
   * @returns {string} Cleaned text safe for CSV
   */
  cleanForCSV(text) {
    if (!text) return '';
    return text
      .trim()
      .replaceAll(/\s+/g, ' ') // Normalize all whitespace (including newlines) to single space
      .replaceAll('"', '""'); // Escape quotes for CSV
  }

  /**
   * Generate all manifests for the installation
   * @param {string} bmadDir - _bmad
   * @param {Array} selectedModules - Selected modules for installation
   * @param {Array} installedFiles - All installed files (optional, for hash tracking)
   */
  async generateManifests(bmadDir, selectedModules, installedFiles = [], options = {}) {
    // Create _config directory if it doesn't exist
    const cfgDir = path.join(bmadDir, '_config');
    await fs.ensureDir(cfgDir);

    // Store modules list (all modules including preserved ones)
    const preservedModules = options.preservedModules || [];

    // Scan the bmad directory to find all actually installed modules
    const installedModules = await this.scanInstalledModules(bmadDir);

    // Since custom modules are now installed the same way as regular modules,
    // we don't need to exclude them from manifest generation
    const allModules = [...new Set(['core', ...selectedModules, ...preservedModules, ...installedModules])];

    this.modules = allModules;
    this.updatedModules = allModules; // Include ALL modules (including custom) for scanning

    // For CSV manifests, we need to include ALL modules that are installed
    // preservedModules controls which modules stay as-is in the CSV (don't get rescanned)
    // But all modules should be included in the final manifest
    this.preservedModules = allModules; // Include ALL modules (including custom)
    this.bmadDir = bmadDir;
    this.bmadFolderName = path.basename(bmadDir); // Get the actual folder name (e.g., '_bmad' or 'bmad')
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

    // Collect agent data - use updatedModules which includes all installed modules
    await this.collectAgents(this.updatedModules);

    // Collect task data
    await this.collectTasks(this.updatedModules);

    // Collect tool data
    await this.collectTools(this.updatedModules);

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
   * Recursively find and parse workflow.yaml and workflow.md files
   */
  async getWorkflowsFromPath(basePath, moduleName) {
    const workflows = [];
    const workflowsPath = path.join(basePath, 'workflows');
    const debug = process.env.BMAD_DEBUG_MANIFEST === 'true';

    if (debug) {
      console.log(`[DEBUG] Scanning workflows in: ${workflowsPath}`);
    }

    if (!(await fs.pathExists(workflowsPath))) {
      if (debug) {
        console.log(`[DEBUG] Workflows path does not exist: ${workflowsPath}`);
      }
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
        } else if (
          entry.name === 'workflow.yaml' ||
          entry.name === 'workflow.md' ||
          (entry.name.startsWith('workflow-') && entry.name.endsWith('.md'))
        ) {
          // Parse workflow file (both YAML and MD formats)
          if (debug) {
            console.log(`[DEBUG] Found workflow file: ${fullPath}`);
          }
          try {
            // Read and normalize line endings (fix Windows CRLF issues)
            const rawContent = await fs.readFile(fullPath, 'utf8');
            const content = rawContent.replaceAll('\r\n', '\n').replaceAll('\r', '\n');

            let workflow;
            if (entry.name === 'workflow.yaml') {
              // Parse YAML workflow
              workflow = yaml.parse(content);
            } else {
              // Parse MD workflow with YAML frontmatter
              const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
              if (!frontmatterMatch) {
                if (debug) {
                  console.log(`[DEBUG] Skipped (no frontmatter): ${fullPath}`);
                }
                continue; // Skip MD files without frontmatter
              }
              workflow = yaml.parse(frontmatterMatch[1]);
            }

            if (debug) {
              console.log(`[DEBUG] Parsed: name="${workflow.name}", description=${workflow.description ? 'OK' : 'MISSING'}`);
            }

            // Skip template workflows (those with placeholder values)
            if (workflow.name && workflow.name.includes('{') && workflow.name.includes('}')) {
              if (debug) {
                console.log(`[DEBUG] Skipped (template placeholder): ${workflow.name}`);
              }
              continue;
            }

            // Skip workflows marked as non-standalone (reference/example workflows)
            if (workflow.standalone === false) {
              if (debug) {
                console.log(`[DEBUG] Skipped (standalone=false): ${workflow.name}`);
              }
              continue;
            }

            if (workflow.name && workflow.description) {
              // Build relative path for installation
              const installPath =
                moduleName === 'core'
                  ? `${this.bmadFolderName}/core/workflows/${relativePath}/${entry.name}`
                  : `${this.bmadFolderName}/${moduleName}/workflows/${relativePath}/${entry.name}`;

              // Workflows with standalone: false are filtered out above
              workflows.push({
                name: workflow.name,
                description: this.cleanForCSV(workflow.description),
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

              if (debug) {
                console.log(`[DEBUG] ✓ Added workflow: ${workflow.name} (${moduleName})`);
              }
            } else {
              if (debug) {
                console.log(`[DEBUG] Skipped (missing name or description): ${fullPath}`);
              }
            }
          } catch (error) {
            await prompts.log.warn(`Failed to parse workflow at ${fullPath}: ${error.message}`);
          }
        }
      }
    };

    await findWorkflows(workflowsPath);

    if (debug) {
      console.log(`[DEBUG] Total workflows found in ${moduleName}: ${workflows.length}`);
    }

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
   * Get agents from a directory recursively
   * Only includes compiled .md files (not .agent.yaml source files)
   */
  async getAgentsFromDir(dirPath, moduleName, relativePath = '') {
    const agents = [];
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Recurse into subdirectories
        const newRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
        const subDirAgents = await this.getAgentsFromDir(fullPath, moduleName, newRelativePath);
        agents.push(...subDirAgents);
      } else if (entry.name.endsWith('.md') && !entry.name.endsWith('.agent.yaml') && entry.name.toLowerCase() !== 'readme.md') {
        const content = await fs.readFile(fullPath, 'utf8');

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
        const capabilitiesMatch = content.match(/capabilities="([^"]+)"/);

        // Extract persona fields
        const roleMatch = content.match(/<role>([^<]+)<\/role>/);
        const identityMatch = content.match(/<identity>([\s\S]*?)<\/identity>/);
        const styleMatch = content.match(/<communication_style>([\s\S]*?)<\/communication_style>/);
        const principlesMatch = content.match(/<principles>([\s\S]*?)<\/principles>/);

        // Build relative path for installation
        const fileRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
        const installPath =
          moduleName === 'core'
            ? `${this.bmadFolderName}/core/agents/${fileRelativePath}`
            : `${this.bmadFolderName}/${moduleName}/agents/${fileRelativePath}`;

        const agentName = entry.name.replace('.md', '');

        agents.push({
          name: agentName,
          displayName: nameMatch ? nameMatch[1] : agentName,
          title: titleMatch ? titleMatch[1] : '',
          icon: iconMatch ? iconMatch[1] : '',
          capabilities: capabilitiesMatch ? this.cleanForCSV(capabilitiesMatch[1]) : '',
          role: roleMatch ? this.cleanForCSV(roleMatch[1]) : '',
          identity: identityMatch ? this.cleanForCSV(identityMatch[1]) : '',
          communicationStyle: styleMatch ? this.cleanForCSV(styleMatch[1]) : '',
          principles: principlesMatch ? this.cleanForCSV(principlesMatch[1]) : '',
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

        // Skip internal/engine files (not user-facing tasks)
        if (content.includes('internal="true"')) {
          continue;
        }

        let name = file.replace(/\.(xml|md)$/, '');
        let displayName = name;
        let description = '';
        let standalone = false;

        if (file.endsWith('.md')) {
          // Parse YAML frontmatter for .md tasks
          const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
          if (frontmatterMatch) {
            try {
              const frontmatter = yaml.parse(frontmatterMatch[1]);
              name = frontmatter.name || name;
              displayName = frontmatter.displayName || frontmatter.name || name;
              description = this.cleanForCSV(frontmatter.description || '');
              // Tasks are standalone by default unless explicitly false (internal=true is already filtered above)
              standalone = frontmatter.standalone !== false && frontmatter.standalone !== 'false';
            } catch {
              // If YAML parsing fails, use defaults
              standalone = true; // Default to standalone
            }
          } else {
            standalone = true; // No frontmatter means standalone
          }
        } else {
          // For .xml tasks, extract from tag attributes
          const nameMatch = content.match(/name="([^"]+)"/);
          displayName = nameMatch ? nameMatch[1] : name;

          const descMatch = content.match(/description="([^"]+)"/);
          const objMatch = content.match(/<objective>([^<]+)<\/objective>/);
          description = this.cleanForCSV(descMatch ? descMatch[1] : objMatch ? objMatch[1].trim() : '');

          const standaloneFalseMatch = content.match(/<task[^>]+standalone="false"/);
          standalone = !standaloneFalseMatch;
        }

        // Build relative path for installation
        const installPath =
          moduleName === 'core' ? `${this.bmadFolderName}/core/tasks/${file}` : `${this.bmadFolderName}/${moduleName}/tasks/${file}`;

        tasks.push({
          name: name,
          displayName: displayName,
          description: description,
          module: moduleName,
          path: installPath,
          standalone: standalone,
        });

        // Add to files list
        this.files.push({
          type: 'task',
          name: name,
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

        // Skip internal tools (same as tasks)
        if (content.includes('internal="true"')) {
          continue;
        }

        let name = file.replace(/\.(xml|md)$/, '');
        let displayName = name;
        let description = '';
        let standalone = false;

        if (file.endsWith('.md')) {
          // Parse YAML frontmatter for .md tools
          const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
          if (frontmatterMatch) {
            try {
              const frontmatter = yaml.parse(frontmatterMatch[1]);
              name = frontmatter.name || name;
              displayName = frontmatter.displayName || frontmatter.name || name;
              description = this.cleanForCSV(frontmatter.description || '');
              // Tools are standalone by default unless explicitly false (internal=true is already filtered above)
              standalone = frontmatter.standalone !== false && frontmatter.standalone !== 'false';
            } catch {
              // If YAML parsing fails, use defaults
              standalone = true; // Default to standalone
            }
          } else {
            standalone = true; // No frontmatter means standalone
          }
        } else {
          // For .xml tools, extract from tag attributes
          const nameMatch = content.match(/name="([^"]+)"/);
          displayName = nameMatch ? nameMatch[1] : name;

          const descMatch = content.match(/description="([^"]+)"/);
          const objMatch = content.match(/<objective>([^<]+)<\/objective>/);
          description = this.cleanForCSV(descMatch ? descMatch[1] : objMatch ? objMatch[1].trim() : '');

          const standaloneFalseMatch = content.match(/<tool[^>]+standalone="false"/);
          standalone = !standaloneFalseMatch;
        }

        // Build relative path for installation
        const installPath =
          moduleName === 'core' ? `${this.bmadFolderName}/core/tools/${file}` : `${this.bmadFolderName}/${moduleName}/tools/${file}`;

        tools.push({
          name: name,
          displayName: displayName,
          description: description,
          module: moduleName,
          path: installPath,
          standalone: standalone,
        });

        // Add to files list
        this.files.push({
          type: 'tool',
          name: name,
          module: moduleName,
          path: installPath,
        });
      }
    }

    return tools;
  }

  /**
   * Write main manifest as YAML with installation info only
   * Fetches fresh version info for all modules
   * @returns {string} Path to the manifest file
   */
  async writeMainManifest(cfgDir) {
    const manifestPath = path.join(cfgDir, 'manifest.yaml');

    // Read existing manifest to preserve install date
    let existingInstallDate = null;
    const existingModulesMap = new Map();

    if (await fs.pathExists(manifestPath)) {
      try {
        const existingContent = await fs.readFile(manifestPath, 'utf8');
        const existingManifest = yaml.parse(existingContent);

        // Preserve original install date
        if (existingManifest.installation?.installDate) {
          existingInstallDate = existingManifest.installation.installDate;
        }

        // Build map of existing modules for quick lookup
        if (existingManifest.modules && Array.isArray(existingManifest.modules)) {
          for (const m of existingManifest.modules) {
            if (typeof m === 'object' && m.name) {
              existingModulesMap.set(m.name, m);
            } else if (typeof m === 'string') {
              existingModulesMap.set(m, { installDate: existingInstallDate });
            }
          }
        }
      } catch {
        // If we can't read existing manifest, continue with defaults
      }
    }

    // Fetch fresh version info for all modules
    const { Manifest } = require('./manifest');
    const manifestObj = new Manifest();
    const updatedModules = [];

    for (const moduleName of this.modules) {
      // Get fresh version info from source
      const versionInfo = await manifestObj.getModuleVersionInfo(moduleName, this.bmadDir);

      // Get existing install date if available
      const existing = existingModulesMap.get(moduleName);

      updatedModules.push({
        name: moduleName,
        version: versionInfo.version,
        installDate: existing?.installDate || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        source: versionInfo.source,
        npmPackage: versionInfo.npmPackage,
        repoUrl: versionInfo.repoUrl,
      });
    }

    const manifest = {
      installation: {
        version: packageJson.version,
        installDate: existingInstallDate || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
      modules: updatedModules,
      ides: this.selectedIdes,
    };

    // Clean the manifest to remove any non-serializable values
    const cleanManifest = structuredClone(manifest);

    const yamlStr = yaml.stringify(cleanManifest, {
      indent: 2,
      lineWidth: 0,
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
      await prompts.log.warn(`Failed to read existing CSV ${csvPath}: ${error.message}`);
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
    const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

    // Create CSV header - standalone column removed, everything is canonicalized to 4 columns
    let csv = 'name,description,module,path\n';

    // Build workflows map from discovered workflows only
    // Old entries are NOT preserved - the manifest reflects what actually exists on disk
    const allWorkflows = new Map();

    // Only add workflows that were actually discovered in this scan
    for (const workflow of this.workflows) {
      const key = `${workflow.module}:${workflow.name}`;
      allWorkflows.set(key, {
        name: workflow.name,
        description: workflow.description,
        module: workflow.module,
        path: workflow.path,
      });
    }

    // Write all workflows
    for (const [, value] of allWorkflows) {
      const row = [escapeCsv(value.name), escapeCsv(value.description), escapeCsv(value.module), escapeCsv(value.path)].join(',');
      csv += row + '\n';
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
    const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

    // Read existing manifest to preserve entries
    const existingEntries = new Map();
    if (await fs.pathExists(csvPath)) {
      const content = await fs.readFile(csvPath, 'utf8');
      const records = csv.parse(content, {
        columns: true,
        skip_empty_lines: true,
      });
      for (const record of records) {
        existingEntries.set(`${record.module}:${record.name}`, record);
      }
    }

    // Create CSV header with persona fields
    let csvContent = 'name,displayName,title,icon,capabilities,role,identity,communicationStyle,principles,module,path\n';

    // Combine existing and new agents, preferring new data for duplicates
    const allAgents = new Map();

    // Add existing entries
    for (const [key, value] of existingEntries) {
      allAgents.set(key, value);
    }

    // Add/update new agents
    for (const agent of this.agents) {
      const key = `${agent.module}:${agent.name}`;
      allAgents.set(key, {
        name: agent.name,
        displayName: agent.displayName,
        title: agent.title,
        icon: agent.icon,
        capabilities: agent.capabilities,
        role: agent.role,
        identity: agent.identity,
        communicationStyle: agent.communicationStyle,
        principles: agent.principles,
        module: agent.module,
        path: agent.path,
      });
    }

    // Write all agents
    for (const [, record] of allAgents) {
      const row = [
        escapeCsv(record.name),
        escapeCsv(record.displayName),
        escapeCsv(record.title),
        escapeCsv(record.icon),
        escapeCsv(record.capabilities),
        escapeCsv(record.role),
        escapeCsv(record.identity),
        escapeCsv(record.communicationStyle),
        escapeCsv(record.principles),
        escapeCsv(record.module),
        escapeCsv(record.path),
      ].join(',');
      csvContent += row + '\n';
    }

    await fs.writeFile(csvPath, csvContent);
    return csvPath;
  }

  /**
   * Write task manifest CSV
   * @returns {string} Path to the manifest file
   */
  async writeTaskManifest(cfgDir) {
    const csvPath = path.join(cfgDir, 'task-manifest.csv');
    const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

    // Read existing manifest to preserve entries
    const existingEntries = new Map();
    if (await fs.pathExists(csvPath)) {
      const content = await fs.readFile(csvPath, 'utf8');
      const records = csv.parse(content, {
        columns: true,
        skip_empty_lines: true,
      });
      for (const record of records) {
        existingEntries.set(`${record.module}:${record.name}`, record);
      }
    }

    // Create CSV header with standalone column
    let csvContent = 'name,displayName,description,module,path,standalone\n';

    // Combine existing and new tasks
    const allTasks = new Map();

    // Add existing entries
    for (const [key, value] of existingEntries) {
      allTasks.set(key, value);
    }

    // Add/update new tasks
    for (const task of this.tasks) {
      const key = `${task.module}:${task.name}`;
      allTasks.set(key, {
        name: task.name,
        displayName: task.displayName,
        description: task.description,
        module: task.module,
        path: task.path,
        standalone: task.standalone,
      });
    }

    // Write all tasks
    for (const [, record] of allTasks) {
      const row = [
        escapeCsv(record.name),
        escapeCsv(record.displayName),
        escapeCsv(record.description),
        escapeCsv(record.module),
        escapeCsv(record.path),
        escapeCsv(record.standalone),
      ].join(',');
      csvContent += row + '\n';
    }

    await fs.writeFile(csvPath, csvContent);
    return csvPath;
  }

  /**
   * Write tool manifest CSV
   * @returns {string} Path to the manifest file
   */
  async writeToolManifest(cfgDir) {
    const csvPath = path.join(cfgDir, 'tool-manifest.csv');
    const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

    // Read existing manifest to preserve entries
    const existingEntries = new Map();
    if (await fs.pathExists(csvPath)) {
      const content = await fs.readFile(csvPath, 'utf8');
      const records = csv.parse(content, {
        columns: true,
        skip_empty_lines: true,
      });
      for (const record of records) {
        existingEntries.set(`${record.module}:${record.name}`, record);
      }
    }

    // Create CSV header with standalone column
    let csvContent = 'name,displayName,description,module,path,standalone\n';

    // Combine existing and new tools
    const allTools = new Map();

    // Add existing entries
    for (const [key, value] of existingEntries) {
      allTools.set(key, value);
    }

    // Add/update new tools
    for (const tool of this.tools) {
      const key = `${tool.module}:${tool.name}`;
      allTools.set(key, {
        name: tool.name,
        displayName: tool.displayName,
        description: tool.description,
        module: tool.module,
        path: tool.path,
        standalone: tool.standalone,
      });
    }

    // Write all tools
    for (const [, record] of allTools) {
      const row = [
        escapeCsv(record.name),
        escapeCsv(record.displayName),
        escapeCsv(record.description),
        escapeCsv(record.module),
        escapeCsv(record.path),
        escapeCsv(record.standalone),
      ].join(',');
      csvContent += row + '\n';
    }

    await fs.writeFile(csvPath, csvContent);
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
        // Store paths relative to bmadDir (no folder prefix)
        const relativePath = filePath.replace(this.bmadDir, '').replaceAll('\\', '/').replace(/^\//, '');
        const ext = path.extname(filePath).toLowerCase();
        const fileName = path.basename(filePath, ext);

        // Determine module from path (first directory component)
        const pathParts = relativePath.split('/');
        const module = pathParts.length > 0 ? pathParts[0] : 'unknown';

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
        // Strip the folder prefix if present (for consistency)
        const relPath = file.path.replace(this.bmadFolderName + '/', '');
        const filePath = path.join(this.bmadDir, relPath);
        const hash = await this.calculateFileHash(filePath);
        allFiles.push({
          ...file,
          path: relPath,
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

  /**
   * Scan the bmad directory to find all installed modules
   * @param {string} bmadDir - Path to bmad directory
   * @returns {Array} List of module names
   */
  async scanInstalledModules(bmadDir) {
    const modules = [];

    try {
      const entries = await fs.readdir(bmadDir, { withFileTypes: true });

      for (const entry of entries) {
        // Skip if not a directory or is a special directory
        if (!entry.isDirectory() || entry.name.startsWith('.') || entry.name === '_config') {
          continue;
        }

        // Check if this looks like a module (has agents, workflows, or tasks directory)
        const modulePath = path.join(bmadDir, entry.name);
        const hasAgents = await fs.pathExists(path.join(modulePath, 'agents'));
        const hasWorkflows = await fs.pathExists(path.join(modulePath, 'workflows'));
        const hasTasks = await fs.pathExists(path.join(modulePath, 'tasks'));
        const hasTools = await fs.pathExists(path.join(modulePath, 'tools'));

        // If it has any of these directories, it's likely a module
        if (hasAgents || hasWorkflows || hasTasks || hasTools) {
          modules.push(entry.name);
        }
      }
    } catch (error) {
      await prompts.log.warn(`Could not scan for installed modules: ${error.message}`);
    }

    return modules;
  }
}

module.exports = { ManifestGenerator };
