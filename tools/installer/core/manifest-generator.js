const path = require('node:path');
const fs = require('../fs-native');
const yaml = require('yaml');
const crypto = require('node:crypto');
const { resolveInstalledModuleYaml } = require('../project-root');
const prompts = require('../prompts');

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

    // Collect agent essence from each module's source module.yaml `agents:` array
    await this.collectAgentsFromModuleYaml();

    // Write manifest files and collect their paths
    const [teamConfigPath, userConfigPath] = await this.writeCentralConfig(bmadDir, options.moduleConfigs || {});
    const manifestFiles = [
      await this.writeMainManifest(cfgDir),
      await this.writeSkillManifest(cfgDir),
      teamConfigPath,
      userConfigPath,
      await this.writeFilesManifest(cfgDir),
    ];

    await this.ensureCustomConfigStubs(bmadDir);

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
          // Build path relative from module root (points to SKILL.md — the permanent entrypoint)
          const relativePath = path.relative(modulePath, dir).split(path.sep).join('/');
          const installPath = relativePath
            ? `${this.bmadFolderName}/${moduleName}/${relativePath}/${skillFile}`
            : `${this.bmadFolderName}/${moduleName}/${skillFile}`;

          // Native SKILL.md entrypoints always derive canonicalId from directory name.
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

        // Recurse into subdirectories — but not inside a discovered skill
        if (!skillMeta) {
          for (const entry of entries) {
            if (!entry.isDirectory()) continue;
            if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
            await walk(path.join(dir, entry.name));
          }
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
   * Collect agents from each installed module's source module.yaml `agents:` array.
   * Essence fields (code, name, title, icon, description) are authored in module.yaml;
   * `team` defaults to module code when not set; `module` is always the owning module.
   */
  async collectAgentsFromModuleYaml() {
    this.agents = [];
    const debug = process.env.BMAD_DEBUG_MANIFEST === 'true';

    for (const moduleName of this.updatedModules) {
      const moduleYamlPath = await resolveInstalledModuleYaml(moduleName);
      if (!moduleYamlPath) {
        // External modules live in ~/.bmad/cache/external-modules, not src/modules.
        // Warn rather than silently skip so missing agent rosters don't vanish
        // from config.toml without notice.
        console.warn(
          `[warn] collectAgentsFromModuleYaml: could not locate module.yaml for '${moduleName}'. ` +
            `Agents declared by this module will not be written to config.toml.`,
        );
        continue;
      }

      let moduleDef;
      try {
        moduleDef = yaml.parse(await fs.readFile(moduleYamlPath, 'utf8'));
      } catch (error) {
        if (debug) console.log(`[DEBUG] collectAgentsFromModuleYaml: failed to parse ${moduleYamlPath}: ${error.message}`);
        continue;
      }

      if (!moduleDef || !Array.isArray(moduleDef.agents)) continue;

      for (const entry of moduleDef.agents) {
        if (!entry || typeof entry.code !== 'string') continue;
        this.agents.push({
          code: entry.code,
          name: entry.name || '',
          title: entry.title || '',
          icon: entry.icon || '',
          description: entry.description || '',
          module: moduleName,
          team: entry.team || moduleName,
        });
      }

      if (debug) {
        console.log(
          `[DEBUG] collectAgentsFromModuleYaml: ${moduleName} contributed ${moduleDef.agents.length} agents from ${moduleYamlPath}`,
        );
      }
    }

    if (debug) {
      console.log(`[DEBUG] collectAgentsFromModuleYaml: total agents found: ${this.agents.length}`);
    }
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
      // Preserve channel/sha from the resolution (external/community/custom)
      // or from the existing entry if this is a no-change rewrite.
      const channel = versionInfo.channel ?? existing?.channel;
      const sha = versionInfo.sha ?? existing?.sha;
      if (channel) moduleEntry.channel = channel;
      if (sha) moduleEntry.sha = sha;
      if (versionInfo.localPath || existing?.localPath) {
        moduleEntry.localPath = versionInfo.localPath || existing.localPath;
      }
      if (versionInfo.rawSource || existing?.rawSource) {
        moduleEntry.rawSource = versionInfo.rawSource || existing.rawSource;
      }
      const regTag = versionInfo.registryApprovedTag ?? existing?.registryApprovedTag;
      const regSha = versionInfo.registryApprovedSha ?? existing?.registryApprovedSha;
      if (regTag) moduleEntry.registryApprovedTag = regTag;
      if (regSha) moduleEntry.registryApprovedSha = regSha;
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
   * Write central _bmad/config.toml with [core], [modules.<code>], [agents.<code>] tables.
   * Install-owned. Team-scope answers → config.toml; user-scope answers → config.user.toml.
   * Both files are regenerated on every install. User overrides live in
   * _bmad/custom/config.toml and _bmad/custom/config.user.toml (never touched by installer).
   * @returns {string[]} Paths to the written config files
   */
  async writeCentralConfig(bmadDir, moduleConfigs) {
    const teamPath = path.join(bmadDir, 'config.toml');
    const userPath = path.join(bmadDir, 'config.user.toml');

    // Load each module's source module.yaml to determine scope per prompt key.
    // Default scope is 'team' when the prompt doesn't declare one.
    // When a module.yaml is unreadable we warn — for known official modules
    // this means user-scoped keys (e.g. user_name) could mis-file into the
    // team config, so the operator should notice.
    const scopeByModuleKey = {};
    // Maps installer moduleName (may be full display name) → module code field
    // from module.yaml, so TOML sections use [modules.<code>] not [modules.<name>].
    const codeByModuleName = {};
    for (const moduleName of this.updatedModules) {
      const moduleYamlPath = await resolveInstalledModuleYaml(moduleName);
      if (!moduleYamlPath) {
        console.warn(
          `[warn] writeCentralConfig: could not locate module.yaml for '${moduleName}'. ` +
            `Answers from this module will default to team scope — user-scoped keys may mis-file into config.toml.`,
        );
        continue;
      }
      try {
        const parsed = yaml.parse(await fs.readFile(moduleYamlPath, 'utf8'));
        if (!parsed || typeof parsed !== 'object') continue;
        if (parsed.code) codeByModuleName[moduleName] = parsed.code;
        scopeByModuleKey[moduleName] = {};
        for (const [key, value] of Object.entries(parsed)) {
          if (value && typeof value === 'object' && 'prompt' in value) {
            scopeByModuleKey[moduleName][key] = value.scope === 'user' ? 'user' : 'team';
          }
        }
      } catch (error) {
        console.warn(
          `[warn] writeCentralConfig: could not parse module.yaml for '${moduleName}' (${error.message}). ` +
            `Answers from this module will default to team scope — user-scoped keys may mis-file into config.toml.`,
        );
      }
    }

    // Core keys are always known (core module.yaml is built-in). These are
    // the only keys allowed in [core]; they must be stripped from every
    // non-core module bucket because legacy _bmad/{mod}/config.yaml files
    // spread core values into each module. Core belongs in [core] only —
    // workflows that need user_name/language/etc. read [core] directly.
    const coreKeys = new Set(Object.keys(scopeByModuleKey.core || {}));

    // Partition a module's answered config into team vs user buckets.
    // For non-core modules: strip core keys always; when we know the module's
    // own schema, also drop keys it doesn't declare. Unknown-schema modules
    // (external / marketplace) fall through with their remaining answers as
    // team so they don't vanish from the config.
    const partition = (moduleName, cfg, onlyDeclaredKeys = false) => {
      const team = {};
      const user = {};
      const scopes = scopeByModuleKey[moduleName] || {};
      const isCore = moduleName === 'core';
      for (const [key, value] of Object.entries(cfg || {})) {
        if (!isCore && coreKeys.has(key)) continue;
        if (onlyDeclaredKeys && !(key in scopes)) continue;
        if (scopes[key] === 'user') {
          user[key] = value;
        } else {
          team[key] = value;
        }
      }
      return { team, user };
    };

    const teamHeader = [
      '# ─────────────────────────────────────────────────────────────────',
      '# Installer-managed. Regenerated on every install — treat as read-only.',
      '#',
      '# Direct edits to this file will be overwritten on the next install.',
      '# To change an install answer durably, re-run the installer (your prior',
      '# answers are remembered as defaults). To pin a value regardless of',
      '# install answers, or to add custom agents / override descriptors, use:',
      '#   _bmad/custom/config.toml       (team, committed)',
      '#   _bmad/custom/config.user.toml  (personal, gitignored)',
      '# Those files are never touched by the installer.',
      '# ─────────────────────────────────────────────────────────────────',
      '',
    ];

    const userHeader = [
      '# ─────────────────────────────────────────────────────────────────',
      '# Installer-managed. Regenerated on every install — treat as read-only.',
      '# Holds install answers scoped to YOU personally.',
      '#',
      '# Direct edits to this file will be overwritten on the next install.',
      '# To change an answer durably, re-run the installer (your prior answers',
      '# are remembered as defaults). For pinned overrides or custom sections',
      '# the installer does not know about, use _bmad/custom/config.user.toml',
      '# — it is never touched by the installer.',
      '# ─────────────────────────────────────────────────────────────────',
      '',
    ];

    const teamLines = [...teamHeader];
    const userLines = [...userHeader];

    // [core] — split into team and user
    const coreConfig = moduleConfigs.core || {};
    const { team: coreTeam, user: coreUser } = partition('core', coreConfig);
    if (Object.keys(coreTeam).length > 0) {
      teamLines.push('[core]');
      for (const [key, value] of Object.entries(coreTeam)) {
        teamLines.push(`${key} = ${formatTomlValue(value)}`);
      }
      teamLines.push('');
    }
    if (Object.keys(coreUser).length > 0) {
      userLines.push('[core]');
      for (const [key, value] of Object.entries(coreUser)) {
        userLines.push(`${key} = ${formatTomlValue(value)}`);
      }
      userLines.push('');
    }

    // [modules.<code>] — split per module
    for (const moduleName of this.updatedModules) {
      if (moduleName === 'core') continue;
      const cfg = moduleConfigs[moduleName];
      if (!cfg || Object.keys(cfg).length === 0) continue;
      // Use the module's code field from module.yaml as the TOML key so the
      // section is [modules.mdo] not [modules.MDO: Maxio DevOps Operations].
      const sectionKey = codeByModuleName[moduleName] || moduleName;
      // Only filter out spread-from-core pollution when we actually know
      // this module's prompt schema. For external/marketplace modules whose
      // module.yaml isn't in the src tree, fall through as all-team so we
      // don't drop their real answers.
      const haveSchema = Object.keys(scopeByModuleKey[moduleName] || {}).length > 0;
      const { team: modTeam, user: modUser } = partition(moduleName, cfg, haveSchema);
      if (Object.keys(modTeam).length > 0) {
        teamLines.push(`[modules.${sectionKey}]`);
        for (const [key, value] of Object.entries(modTeam)) {
          teamLines.push(`${key} = ${formatTomlValue(value)}`);
        }
        teamLines.push('');
      }
      if (Object.keys(modUser).length > 0) {
        userLines.push(`[modules.${sectionKey}]`);
        for (const [key, value] of Object.entries(modUser)) {
          userLines.push(`${key} = ${formatTomlValue(value)}`);
        }
        userLines.push('');
      }
    }

    // [agents.<code>] — always team (agent roster is organizational).
    // Freshly collected agents come from module.yaml this run. If a module
    // was preserved (e.g. during quickUpdate when its source isn't available),
    // its module.yaml wasn't read — so its agents aren't in `this.agents` and
    // would silently disappear from the roster. Preserve those existing
    // [agents.*] blocks verbatim from the prior config.toml.
    const freshAgentCodes = new Set(this.agents.map((a) => a.code));
    const contributingModules = new Set(this.agents.map((a) => a.module));
    const preservedModules = this.updatedModules.filter((m) => !contributingModules.has(m));
    const preservedBlocks = [];
    if (preservedModules.length > 0 && (await fs.pathExists(teamPath))) {
      try {
        const prev = await fs.readFile(teamPath, 'utf8');
        for (const block of extractAgentBlocks(prev)) {
          if (freshAgentCodes.has(block.code)) continue;
          if (block.module && preservedModules.includes(block.module)) {
            preservedBlocks.push(block.body);
          }
        }
      } catch (error) {
        console.warn(`[warn] writeCentralConfig: could not read prior config.toml to preserve agents: ${error.message}`);
      }
    }

    for (const agent of this.agents) {
      const agentLines = [`[agents.${agent.code}]`, `module = ${formatTomlValue(agent.module)}`, `team = ${formatTomlValue(agent.team)}`];
      if (agent.name) agentLines.push(`name = ${formatTomlValue(agent.name)}`);
      if (agent.title) agentLines.push(`title = ${formatTomlValue(agent.title)}`);
      if (agent.icon) agentLines.push(`icon = ${formatTomlValue(agent.icon)}`);
      if (agent.description) agentLines.push(`description = ${formatTomlValue(agent.description)}`);
      agentLines.push('');
      teamLines.push(...agentLines);
    }

    for (const body of preservedBlocks) {
      teamLines.push(body, '');
    }

    const teamContent = teamLines.join('\n').replace(/\n+$/, '\n');
    const userContent = userLines.join('\n').replace(/\n+$/, '\n');
    await fs.writeFile(teamPath, teamContent);
    await fs.writeFile(userPath, userContent);
    return [teamPath, userPath];
  }

  /**
   * Create empty _bmad/custom/config.toml and _bmad/custom/config.user.toml stubs
   * on first install only. Installer never touches these files again after creation.
   */
  async ensureCustomConfigStubs(bmadDir) {
    const customDir = path.join(bmadDir, 'custom');
    await fs.ensureDir(customDir);

    const stubs = [
      {
        file: path.join(customDir, 'config.toml'),
        header: [
          '# Team / enterprise overrides for _bmad/config.toml.',
          '# Committed to the repo — applies to every developer on the project.',
          '# Tables deep-merge over base config; keyed entries merge by key.',
          '# Example: override an agent descriptor, or add a new agent.',
          '#',
          '# [agents.bmad-agent-pm]',
          '# description = "Prefers short, bulleted PRDs over narrative drafts."',
          '',
        ],
      },
      {
        file: path.join(customDir, 'config.user.toml'),
        header: [
          '# Personal overrides for _bmad/config.toml.',
          '# NOT committed (gitignored) — applies only to your local install.',
          '# Wins over both base config and team overrides.',
          '',
        ],
      },
    ];

    for (const { file, header } of stubs) {
      if (await fs.pathExists(file)) continue;
      await fs.writeFile(file, header.join('\n'));
    }
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

/**
 * Format a JS scalar as a TOML value literal.
 * Handles strings (quoted + escaped), booleans, numbers, and arrays of scalars.
 * Objects are not expected at this emit path.
 */
function formatTomlValue(value) {
  if (value === null || value === undefined) return '""';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (Array.isArray(value)) return `[${value.map((v) => formatTomlValue(v)).join(', ')}]`;
  const str = String(value);
  const escaped = str
    .replaceAll('\\', '\\\\')
    .replaceAll('"', String.raw`\"`)
    .replaceAll('\n', String.raw`\n`)
    .replaceAll('\r', String.raw`\r`)
    .replaceAll('\t', String.raw`\t`);
  return `"${escaped}"`;
}

/**
 * Extract [agents.<code>] blocks from a previously-emitted config.toml.
 * We only need this for roster preservation — the file is our own controlled
 * output, so a simple line scanner is safer than adding a TOML parser
 * dependency. Each block runs from its `[agents.<code>]` header until the
 * next `[` heading or EOF; the `module = "..."` line inside drives which
 * entries we keep on the next write.
 * @returns {Array<{code: string, module: string | null, body: string}>}
 */
function extractAgentBlocks(tomlContent) {
  const blocks = [];
  const lines = tomlContent.split('\n');
  let i = 0;
  while (i < lines.length) {
    const header = lines[i].match(/^\[agents\.([^\]]+)]\s*$/);
    if (!header) {
      i++;
      continue;
    }
    const code = header[1];
    const blockLines = [lines[i]];
    let moduleName = null;
    i++;
    while (i < lines.length && !lines[i].startsWith('[')) {
      blockLines.push(lines[i]);
      const m = lines[i].match(/^module\s*=\s*"((?:[^"\\]|\\.)*)"\s*$/);
      if (m) moduleName = m[1];
      i++;
    }
    while (blockLines.length > 1 && blockLines.at(-1) === '') blockLines.pop();
    blocks.push({ code, module: moduleName, body: blockLines.join('\n') });
  }
  return blocks;
}

module.exports = { ManifestGenerator };
