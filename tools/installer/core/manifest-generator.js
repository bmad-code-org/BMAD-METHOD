const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const crypto = require('node:crypto');
const csv = require('csv-parse/sync');
const { getSourcePath, getModulePath } = require('../project-root');
const prompts = require('../prompts');
const {
  loadSkillManifest: loadSkillManifestShared,
  getCanonicalId: getCanonicalIdShared,
  getArtifactType: getArtifactTypeShared,
} = require('../ide/shared/skill-manifest');

// Load package.json for version info
const packageJson = require('../../../package.json');

/**
 * Generates manifest files for installed skills and agents
 */
class ManifestGenerator {
  constructor() {
    this.skills = [];
    this.agents = [];
    this.modules = [];
    this.files = [];
    this.selectedIdes = [];
  }

  /** Delegate to shared skill-manifest module */
  async loadSkillManifest(dirPath) {
    return loadSkillManifestShared(dirPath);
  }

  /** Delegate to shared skill-manifest module */
  getCanonicalId(manifest, filename) {
    return getCanonicalIdShared(manifest, filename);
  }

  /** Delegate to shared skill-manifest module */
  getArtifactType(manifest, filename) {
    return getArtifactTypeShared(manifest, filename);
  }

  /**
   * Clean text for CSV output by normalizing whitespace.
   * Note: Quote escaping is handled by escapeCsv() at write time.
   * @param {string} text - Text to clean
   * @returns {string} Cleaned text
   */
  cleanForCSV(text) {
    if (!text) return '';
    return text.trim().replaceAll(/\s+/g, ' '); // Normalize all whitespace (including newlines) to single space
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

    // Reset files list (defensive: prevent stale data if instance is reused)
    this.files = [];

    // Collect skills first (populates skillClaimedDirs before legacy collectors run)
    await this.collectSkills();

    // Collect agent data - use updatedModules which includes all installed modules
    await this.collectAgents(this.updatedModules);

    // Write manifest files and collect their paths
    const manifestFiles = [
      await this.writeMainManifest(cfgDir),
      await this.writeSkillManifest(cfgDir),
      await this.writeAgentManifest(cfgDir),
      await this.writeFilesManifest(cfgDir),
    ];

    return {
      skills: this.skills.length,
      agents: this.agents.length,
      files: this.files.length,
      manifestFiles: manifestFiles,
    };
  }

  /**
   * Recursively walk a module directory tree, collecting native SKILL.md entrypoints.
   * A directory is discovered as a skill when it contains a SKILL.md file with
   * valid name/description frontmatter (name must match directory name).
   * Manifest YAML is loaded only when present — for agent metadata.
   * Populates this.skills[] and this.skillClaimedDirs (Set of absolute paths).
   */
  async collectSkills() {
    this.skills = [];
    this.skillClaimedDirs = new Set();
    const debug = process.env.BMAD_DEBUG_MANIFEST === 'true';

    for (const moduleName of this.updatedModules) {
      const modulePath = path.join(this.bmadDir, moduleName);
      if (!(await fs.pathExists(modulePath))) continue;

      // Recursive walk skipping . and _ prefixed dirs
      const walk = async (dir) => {
        let entries;
        try {
          entries = await fs.readdir(dir, { withFileTypes: true });
        } catch {
          return;
        }

        // SKILL.md with valid frontmatter is the primary discovery gate
        const skillFile = 'SKILL.md';
        const skillMdPath = path.join(dir, skillFile);
        const dirName = path.basename(dir);

        const skillMeta = await this.parseSkillMd(skillMdPath, dir, dirName, debug);

        if (skillMeta) {
          // Load manifest when present (for agent metadata)
          const manifest = await this.loadSkillManifest(dir);
          const artifactType = this.getArtifactType(manifest, skillFile);

          // Build path relative from module root (points to SKILL.md — the permanent entrypoint)
          const relativePath = path.relative(modulePath, dir).split(path.sep).join('/');
          const installPath = relativePath
            ? `${this.bmadFolderName}/${moduleName}/${relativePath}/${skillFile}`
            : `${this.bmadFolderName}/${moduleName}/${skillFile}`;

          // Native SKILL.md entrypoints derive canonicalId from directory name.
          // Agent entrypoints may keep canonicalId metadata for compatibility, so
          // only warn for non-agent SKILL.md directories.
          if (manifest && manifest.__single && manifest.__single.canonicalId && artifactType !== 'agent') {
            console.warn(
              `Warning: Native entrypoint manifest at ${dir}/bmad-skill-manifest.yaml contains canonicalId — this field is ignored for SKILL.md directories (directory name is the canonical ID)`,
            );
          }
          const canonicalId = dirName;

          this.skills.push({
            name: skillMeta.name,
            description: this.cleanForCSV(skillMeta.description),
            module: moduleName,
            path: installPath,
            canonicalId,
          });

          // Add to files list
          this.files.push({
            type: 'skill',
            name: skillMeta.name,
            module: moduleName,
            path: installPath,
          });

          this.skillClaimedDirs.add(dir);

          if (debug) {
            console.log(`[DEBUG] collectSkills: claimed skill "${skillMeta.name}" as ${canonicalId} at ${dir}`);
          }
        }

        // Recurse into subdirectories
        for (const entry of entries) {
          if (!entry.isDirectory()) continue;
          if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
          await walk(path.join(dir, entry.name));
        }
      };

      await walk(modulePath);
    }

    if (debug) {
      console.log(`[DEBUG] collectSkills: total skills found: ${this.skills.length}, claimed dirs: ${this.skillClaimedDirs.size}`);
    }
  }

  /**
   * Parse and validate SKILL.md for a skill directory.
   * Returns parsed frontmatter object with name/description, or null if invalid.
   * @param {string} skillMdPath - Absolute path to SKILL.md
   * @param {string} dir - Skill directory path (for error messages)
   * @param {string} dirName - Expected name (must match frontmatter name)
   * @param {boolean} debug - Whether to emit debug-level messages
   * @returns {Promise<Object|null>} Parsed frontmatter or null
   */
  async parseSkillMd(skillMdPath, dir, dirName, debug = false) {
    if (!(await fs.pathExists(skillMdPath))) {
      if (debug) console.log(`[DEBUG] parseSkillMd: "${dir}" is missing SKILL.md — skipping`);
      return null;
    }

    try {
      const rawContent = await fs.readFile(skillMdPath, 'utf8');
      const content = rawContent.replaceAll('\r\n', '\n').replaceAll('\r', '\n');

      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        const skillMeta = yaml.parse(frontmatterMatch[1]);

        if (
          !skillMeta ||
          typeof skillMeta !== 'object' ||
          typeof skillMeta.name !== 'string' ||
          typeof skillMeta.description !== 'string' ||
          !skillMeta.name ||
          !skillMeta.description
        ) {
          if (debug) console.log(`[DEBUG] parseSkillMd: SKILL.md in "${dir}" is missing name or description (or wrong type) — skipping`);
          return null;
        }

        if (skillMeta.name !== dirName) {
          console.error(`Error: SKILL.md name "${skillMeta.name}" does not match directory name "${dirName}" — skipping`);
          return null;
        }

        return skillMeta;
      }

      if (debug) console.log(`[DEBUG] parseSkillMd: SKILL.md in "${dir}" has no frontmatter — skipping`);
      return null;
    } catch (error) {
      if (debug) console.log(`[DEBUG] parseSkillMd: failed to parse SKILL.md in "${dir}": ${error.message} — skipping`);
      return null;
    }
  }

  /**
   * Collect all agents from selected modules by walking their directory trees.
   */
  async collectAgents(selectedModules) {
    this.agents = [];
    const debug = process.env.BMAD_DEBUG_MANIFEST === 'true';

    // Walk each module's full directory tree looking for type:agent manifests
    for (const moduleName of this.updatedModules) {
      const modulePath = path.join(this.bmadDir, moduleName);
      if (!(await fs.pathExists(modulePath))) continue;

      const moduleAgents = await this.getAgentsFromDirRecursive(modulePath, moduleName, '', debug);
      this.agents.push(...moduleAgents);
    }

    // Get standalone agents from bmad/agents/ directory
    const standaloneAgentsDir = path.join(this.bmadDir, 'agents');
    if (await fs.pathExists(standaloneAgentsDir)) {
      const standaloneAgents = await this.getAgentsFromDirRecursive(standaloneAgentsDir, 'standalone', '', debug);
      this.agents.push(...standaloneAgents);
    }

    if (debug) {
      console.log(`[DEBUG] collectAgents: total agents found: ${this.agents.length}`);
    }
  }

  /**
   * Recursively walk a directory tree collecting agents.
   * Discovers agents via directory with bmad-skill-manifest.yaml containing type: agent
   *
   * @param {string} dirPath - Current directory being scanned
   * @param {string} moduleName - Module this directory belongs to
   * @param {string} relativePath - Path relative to the module root (for install path construction)
   * @param {boolean} debug - Emit debug messages
   */
  async getAgentsFromDirRecursive(dirPath, moduleName, relativePath = '', debug = false) {
    const agents = [];
    let entries;
    try {
      entries = await fs.readdir(dirPath, { withFileTypes: true });
    } catch {
      return agents;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;

      const fullPath = path.join(dirPath, entry.name);

      // Check for type:agent manifest BEFORE checking skillClaimedDirs —
      // agent dirs may be claimed by collectSkills for IDE installation,
      // but we still need them in agent-manifest.csv.
      const dirManifest = await this.loadSkillManifest(fullPath);
      if (dirManifest && dirManifest.__single && dirManifest.__single.type === 'agent') {
        const m = dirManifest.__single;
        const dirRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
        const agentModule = m.module || moduleName;
        const installPath = `${this.bmadFolderName}/${agentModule}/${dirRelativePath}`;

        agents.push({
          name: m.name || entry.name,
          displayName: m.displayName || m.name || entry.name,
          title: m.title || '',
          icon: m.icon || '',
          capabilities: m.capabilities ? this.cleanForCSV(m.capabilities) : '',
          role: m.role ? this.cleanForCSV(m.role) : '',
          identity: m.identity ? this.cleanForCSV(m.identity) : '',
          communicationStyle: m.communicationStyle ? this.cleanForCSV(m.communicationStyle) : '',
          principles: m.principles ? this.cleanForCSV(m.principles) : '',
          module: agentModule,
          path: installPath,
          canonicalId: m.canonicalId || '',
        });

        this.files.push({
          type: 'agent',
          name: m.name || entry.name,
          module: agentModule,
          path: installPath,
        });

        if (debug) {
          console.log(`[DEBUG] collectAgents: found type:agent "${m.name || entry.name}" at ${fullPath}`);
        }
        continue;
      }

      // Skip directories claimed by collectSkills (non-agent type skills) —
      // avoids recursing into skill trees that can't contain agents.
      if (this.skillClaimedDirs && this.skillClaimedDirs.has(fullPath)) continue;

      // Recurse into subdirectories
      const newRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      const subDirAgents = await this.getAgentsFromDirRecursive(fullPath, moduleName, newRelativePath, debug);
      agents.push(...subDirAgents);
    }

    return agents;
  }

  /**
   * Write main manifest as YAML with installation info only
   * Fetches fresh version info for all modules
   * @returns {string} Path to the manifest file
   */
  async writeMainManifest(cfgDir) {
    const manifestPath = path.join(cfgDir, 'manifest.yaml');
    const installedModuleSet = new Set(this.modules);

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

      const moduleEntry = {
        name: moduleName,
        version: versionInfo.version,
        installDate: existing?.installDate || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        source: versionInfo.source,
        npmPackage: versionInfo.npmPackage,
        repoUrl: versionInfo.repoUrl,
      };
      if (versionInfo.localPath) moduleEntry.localPath = versionInfo.localPath;
      updatedModules.push(moduleEntry);
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
   * Write skill manifest CSV
   * @returns {string} Path to the manifest file
   */
  async writeSkillManifest(cfgDir) {
    const csvPath = path.join(cfgDir, 'skill-manifest.csv');
    const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

    let csvContent = 'canonicalId,name,description,module,path\n';

    for (const skill of this.skills) {
      const row = [
        escapeCsv(skill.canonicalId),
        escapeCsv(skill.name),
        escapeCsv(skill.description),
        escapeCsv(skill.module),
        escapeCsv(skill.path),
      ].join(',');
      csvContent += row + '\n';
    }

    await fs.writeFile(csvPath, csvContent);
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

    // Create CSV header with persona fields and canonicalId
    let csvContent = 'name,displayName,title,icon,capabilities,role,identity,communicationStyle,principles,module,path,canonicalId\n';

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
        canonicalId: agent.canonicalId || '',
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
        escapeCsv(record.canonicalId),
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

        // Check if this looks like a module (has agents directory or skill manifests)
        const modulePath = path.join(bmadDir, entry.name);
        const hasAgents = await fs.pathExists(path.join(modulePath, 'agents'));
        const hasSkills = await this._hasSkillMdRecursive(modulePath);

        if (hasAgents || hasSkills) {
          modules.push(entry.name);
        }
      }
    } catch (error) {
      await prompts.log.warn(`Could not scan for installed modules: ${error.message}`);
    }

    return modules;
  }

  /**
   * Recursively check if a directory tree contains a SKILL.md file.
   * Skips directories starting with . or _.
   * @param {string} dir - Directory to search
   * @returns {boolean} True if a SKILL.md is found
   */
  async _hasSkillMdRecursive(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return false;
    }

    // Check for SKILL.md in this directory
    if (entries.some((e) => !e.isDirectory() && e.name === 'SKILL.md')) return true;

    // Recurse into subdirectories
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
      if (await this._hasSkillMdRecursive(path.join(dir, entry.name))) return true;
    }

    return false;
  }
}

module.exports = { ManifestGenerator };
