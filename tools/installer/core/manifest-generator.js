const path = require('node:path');
const fs = require('../fs-native');
const yaml = require('yaml');
const crypto = require('node:crypto');
const { resolveInstalledModuleYaml } = require('../project-root');
const { globalUserConfigPath, loadGlobalConfig } = require('../global-config');
const { upsertTomlKey } = require('../set-overrides');
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
    // Per-module module.toml floor — shipped defaults + agent roster, read
    // by resolve_config.py as the lowest-priority layer. Independent of the
    // central config.toml; remains stable across user customizations.
    const moduleTomlPaths = await this.writeModuleTomls(bmadDir);
    // Task D: route scope:user core answers to ~/.bmad/config.user.toml.
    // Identity persists across projects on this machine, so re-installs in
    // other directories don't re-prompt for the same name/language.
    await this.writeGlobalUserCore(options.moduleConfigs || {});
    const manifestFiles = [
      await this.writeMainManifest(cfgDir),
      await this.writeSkillManifest(cfgDir),
      teamConfigPath,
      userConfigPath,
      ...moduleTomlPaths,
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
   * Write central _bmad/config.toml as a LEAN OVERRIDE FILE — only values
   * the user actually changed from defaults land here. Defaults flow through
   * the module.toml floor (written by writeModuleTomls) and the global
   * config layer (~/.bmad/...).
   *
   * Specifically (Phase 1 — tasks D + F):
   *   - [core] team-scope: emit only keys whose value differs from BOTH the
   *     module.yaml default AND the global value (if any). Identity that
   *     equals the global wins via the resolver chain regardless.
   *   - [core] user-scope (user_name, communication_language): NEVER written
   *     here. Routed to ~/.bmad/config.user.toml via writeGlobalUserCore.
   *   - [modules.X]: emit only keys whose value differs from the module's
   *     processed default. Skip the section entirely if all keys are default.
   *   - [agents.X]: NEVER emitted. The roster lives in module.toml floor;
   *     custom agents go in _bmad/custom/config.toml (never touched by us).
   *
   * Install-owned: both files are regenerated on every install. User
   * overrides live in _bmad/custom/config.toml and _bmad/custom/config.user.toml
   * (never touched by installer).
   *
   * @returns {string[]} Paths to the written config files
   */
  async writeCentralConfig(bmadDir, moduleConfigs) {
    const teamPath = path.join(bmadDir, 'config.toml');
    const userPath = path.join(bmadDir, 'config.user.toml');

    // Load each module's source module.yaml to determine:
    //   1. scope per prompt key (team vs user)
    //   2. the canonical module code (for [modules.{code}] section names)
    //   3. processed defaults per key (for delta detection)
    //
    // Pass 1: parse every module.yaml and capture its raw shipped defaults.
    // We use those — NOT the user's answered moduleConfigs — to resolve
    // cross-key placeholders like `{output_folder}`. Otherwise a user override
    // of output_folder would make every derived default (e.g. planning_artifacts)
    // match the user's value and get stripped from config.toml as "default",
    // even though module.toml's floor still carries the shipped path.
    const scopeByModuleKey = {};
    const codeByModuleName = {};
    const defaultsByModuleKey = {};
    const parsedByModule = {};
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
        parsedByModule[moduleName] = parsed;
        if (parsed.code) codeByModuleName[moduleName] = parsed.code;
      } catch (error) {
        console.warn(
          `[warn] writeCentralConfig: could not parse module.yaml for '${moduleName}' (${error.message}). ` +
            `Answers from this module will default to team scope — user-scoped keys may mis-file into config.toml.`,
        );
      }
    }

    // Build the cross-key defaults map (same logic writeModuleTomls uses).
    // Shipped defaults only — never user answers.
    const crossKeyDefaults = {};
    for (const parsed of Object.values(parsedByModule)) {
      const raw = extractModuleDefaults(parsed);
      for (const [key, value] of Object.entries(raw)) {
        if (crossKeyDefaults[key] !== undefined) continue;
        let stripped = value;
        if (typeof stripped === 'string' && stripped.startsWith('{project-root}/')) {
          stripped = stripped.slice('{project-root}/'.length);
        }
        crossKeyDefaults[key] = stripped;
      }
    }

    // Pass 2: compute scopes and processed defaults using the symmetric map.
    for (const [moduleName, parsed] of Object.entries(parsedByModule)) {
      scopeByModuleKey[moduleName] = {};
      defaultsByModuleKey[moduleName] = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (!value || typeof value !== 'object' || !('prompt' in value)) continue;
        scopeByModuleKey[moduleName][key] = value.scope === 'user' ? 'user' : 'team';
        const processedDefault = computeProcessedDefault(value, crossKeyDefaults);
        if (processedDefault !== undefined) {
          defaultsByModuleKey[moduleName][key] = processedDefault;
        }
      }
    }

    // Load the global config snapshot for [core] delta detection. If a key's
    // current value equals the global value, no need to duplicate it into the
    // project file — the resolver finds it globally.
    const globalSnapshot = await loadGlobalConfig().catch(() => ({ merged: {} }));
    const globalCore = (globalSnapshot.merged && globalSnapshot.merged.core) || {};

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

    // Drop entries whose value equals an already-known default. Tasks F + D
    // both want config.toml to be a *delta* file — anything that matches
    // either the module.yaml default or the global config gets resolved
    // through the layer chain at read time, so writing it here is dead weight.
    const stripDefaults = (entries, perKeyDefaults = {}, fallbackDefaults = {}) => {
      const result = {};
      for (const [key, value] of Object.entries(entries)) {
        const moduleDefault = perKeyDefaults[key];
        const fallbackDefault = fallbackDefaults[key];
        const isDefault =
          (moduleDefault !== undefined && deepEqualScalar(moduleDefault, value)) ||
          (fallbackDefault !== undefined && deepEqualScalar(fallbackDefault, value));
        if (!isDefault) result[key] = value;
      }
      return result;
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

    // [core] team — emit only deltas from module.yaml default AND global value.
    const coreConfig = moduleConfigs.core || {};
    const { team: coreTeamRaw } = partition('core', coreConfig);
    const coreTeam = stripDefaults(coreTeamRaw, defaultsByModuleKey.core || {}, globalCore);
    if (Object.keys(coreTeam).length > 0) {
      teamLines.push('[core]');
      for (const [key, value] of Object.entries(coreTeam)) {
        teamLines.push(`${key} = ${formatTomlValue(value)}`);
      }
      teamLines.push('');
    }
    // [core] user-scope: never written to the project user.toml. Task D routes
    // these to ~/.bmad/config.user.toml via writeGlobalUserCore (called by
    // generateManifests after this method returns). config.user.toml stays
    // empty unless the user has manually pinned a per-project override.

    // [modules.<code>] — emit only deltas; skip section if no deltas.
    for (const moduleName of this.updatedModules) {
      if (moduleName === 'core') continue;
      const cfg = moduleConfigs[moduleName];
      if (!cfg || Object.keys(cfg).length === 0) continue;
      const sectionKey = codeByModuleName[moduleName] || moduleName;
      const haveSchema = Object.keys(scopeByModuleKey[moduleName] || {}).length > 0;
      const { team: modTeamRaw, user: modUserRaw } = partition(moduleName, cfg, haveSchema);

      const moduleDefaults = defaultsByModuleKey[moduleName] || {};
      const modTeam = stripDefaults(modTeamRaw, moduleDefaults);
      const modUser = stripDefaults(modUserRaw, moduleDefaults);

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

    // [agents.<code>] — intentionally NOT emitted (Task F). The roster lives
    // in the per-module module.toml floor. Users who want to override or
    // add agents per-project edit _bmad/custom/config.toml; that file is
    // never touched by the installer.

    const teamContent = teamLines.join('\n').replace(/\n+$/, '\n');
    const userContent = userLines.join('\n').replace(/\n+$/, '\n');
    await fs.writeFile(teamPath, teamContent);
    await fs.writeFile(userPath, userContent);
    return [teamPath, userPath];
  }

  /**
   * Write scope:user core values to ~/.bmad/config.user.toml (Task D).
   * Merge-preserves any existing global content the user hand-edited.
   *
   * Why a global write step at all? Identity values (user_name,
   * communication_language) are properties of the human, not the project.
   * Asking them at every install is friction. Phase 1 stores them globally
   * so they're answered once per machine.
   *
   * @param {object} moduleConfigs - the fully-resolved moduleConfigs map
   * @returns {Promise<string|null>} the path written, or null if no values
   */
  async writeGlobalUserCore(moduleConfigs) {
    const coreScopes = {};
    // We need core's module.yaml scope map. Build it lazily here so this
    // method is callable without re-doing the writeCentralConfig setup.
    const coreYamlPath = await resolveInstalledModuleYaml('core');
    if (!coreYamlPath) return null;
    try {
      const parsed = yaml.parse(await fs.readFile(coreYamlPath, 'utf8'));
      if (parsed && typeof parsed === 'object') {
        for (const [key, value] of Object.entries(parsed)) {
          if (value && typeof value === 'object' && 'prompt' in value) {
            coreScopes[key] = value.scope === 'user' ? 'user' : 'team';
          }
        }
      }
    } catch {
      return null;
    }

    const userScopeValues = {};
    for (const [key, value] of Object.entries(moduleConfigs.core || {})) {
      if (coreScopes[key] === 'user' && value !== undefined && value !== null && value !== '') {
        userScopeValues[key] = value;
      }
    }
    if (Object.keys(userScopeValues).length === 0) return null;

    const globalPath = globalUserConfigPath();
    await fs.ensureDir(path.dirname(globalPath));

    // Line-surgery upsert into the existing file (or a fresh one with the
    // installer header). We only touch the [core] keys we own. Every other
    // section, comment, and value passes through byte-for-byte — including
    // shapes the previous round-trip parser quietly dropped (arrays,
    // single-quoted strings, dotted/quoted keys, \uXXXX escapes, etc.).
    let content;
    if (await fs.pathExists(globalPath)) {
      content = await fs.readFile(globalPath, 'utf8');
    } else {
      content =
        [
          '# ─────────────────────────────────────────────────────────────────',
          '# Global personal BMad config — values tied to YOU as a user, not',
          '# any specific project. Installer writes scope:user identity here',
          '# (user_name, communication_language) so re-installs across projects',
          "# don't re-ask the same questions.",
          '#',
          '# Location precedence: $BMAD_HOME if set, else ~/.bmad',
          '# Resolver tier: lower than project-level _bmad/*.toml.',
          '# ─────────────────────────────────────────────────────────────────',
          '',
        ].join('\n') + '\n';
    }
    for (const [key, value] of Object.entries(userScopeValues)) {
      content = upsertTomlKey(content, '[core]', key, formatTomlValue(value));
    }
    await fs.writeFile(globalPath, content);
    return globalPath;
  }

  /**
   * Write per-module `_bmad/{module}/module.toml` files — the "module floor"
   * read by resolve_config.py as the lowest-priority layer.
   *
   * Each file contains the shipped defaults for one module:
   *   [modules.{code}]       paths and other module-shape values (from
   *                          module.yaml question defaults, with `result:`
   *                          template applied + cross-key placeholders like
   *                          `{output_folder}` resolved against other modules'
   *                          defaults at install time)
   *   [agents.{agent-code}]  one block per agent owned by this module
   *
   * `{project-root}` is preserved literally — runtime substitution by skills.
   * Other cross-key references resolve against module.yaml DEFAULTS only,
   * not the user's actual answers. This keeps module.toml stable as a "what
   * the module ships" snapshot independent of per-project customization.
   * User overrides land in _bmad/config.toml above the floor.
   *
   * Source of truth is the authored module.yaml. This file is a build artifact
   * — regenerated on every install, never hand-edited.
   *
   * @param {string} bmadDir
   * @returns {Promise<string[]>} Paths to all written module.toml files
   */
  async writeModuleTomls(bmadDir) {
    // Pass 1: parse every installed module.yaml, extract its raw defaults
    // (just `{value}` substituted; cross-key placeholders left literal).
    const moduleData = [];
    for (const moduleName of this.updatedModules) {
      const moduleYamlPath = await resolveInstalledModuleYaml(moduleName);
      if (!moduleYamlPath) continue;

      let moduleDef;
      try {
        moduleDef = yaml.parse(await fs.readFile(moduleYamlPath, 'utf8'));
      } catch (error) {
        console.warn(
          `[warn] writeModuleTomls: could not parse module.yaml for '${moduleName}' (${error.message}). ` +
            `Skipping module.toml for this module.`,
        );
        continue;
      }
      if (!moduleDef || typeof moduleDef !== 'object') continue;

      const moduleDir = path.join(bmadDir, moduleName);
      if (!(await fs.pathExists(moduleDir))) continue;

      const moduleCode = typeof moduleDef.code === 'string' ? moduleDef.code : moduleName;
      const rawDefaults = extractModuleDefaults(moduleDef);
      moduleData.push({ moduleName, moduleCode, moduleDir, rawDefaults });
    }

    // Build a flat cross-key lookup map from every module's raw defaults.
    // First-define wins (deterministic given sorted updatedModules input).
    // Values are stripped of a leading `{project-root}/` so substitutions
    // re-compose cleanly when consumed in a `{project-root}/{key}/...` slot
    // — matches the installer's processResultTemplate convention.
    const crossKeyMap = {};
    for (const { rawDefaults } of moduleData) {
      for (const [key, value] of Object.entries(rawDefaults)) {
        if (crossKeyMap[key] !== undefined) continue;
        let stripped = value;
        if (typeof stripped === 'string' && stripped.startsWith('{project-root}/')) {
          stripped = stripped.slice('{project-root}/'.length);
        }
        crossKeyMap[key] = stripped;
      }
    }

    // Pass 2: resolve cross-key placeholders in each module's defaults and
    // write the final module.toml file.
    const written = [];
    for (const { moduleName, moduleCode, moduleDir, rawDefaults } of moduleData) {
      const resolvedDefaults = {};
      for (const [key, value] of Object.entries(rawDefaults)) {
        resolvedDefaults[key] = resolveCrossKeyPlaceholders(value, crossKeyMap);
      }

      const lines = [
        '# Module-shipped defaults. Build artifact — do not edit by hand.',
        "# Source: this module's module.yaml (authored at source).",
        '# Regenerated on every install.',
        '#',
        '# Read by _bmad/scripts/resolve_config.py as the lowest-priority',
        '# floor of the config layer chain. Project _bmad/config.toml and',
        '# user overrides in _bmad/custom/ sit above this and win.',
        '',
      ];

      if (Object.keys(resolvedDefaults).length > 0) {
        // Core's defaults belong under top-level [core] — that's where
        // writeCentralConfig emits core deltas and where resolve_config.py
        // consumers read core.* from. Everything else gets the per-module
        // [modules.<code>] namespace.
        const sectionHeader = moduleCode === 'core' ? '[core]' : `[modules.${moduleCode}]`;
        lines.push(sectionHeader);
        for (const [key, value] of Object.entries(resolvedDefaults)) {
          lines.push(`${key} = ${formatTomlValue(value)}`);
        }
        lines.push('');
      }

      const moduleAgents = this.agents.filter((a) => a.module === moduleName);
      for (const agent of moduleAgents) {
        lines.push(`[agents.${agent.code}]`, `module = ${formatTomlValue(agent.module)}`, `team = ${formatTomlValue(agent.team)}`);
        if (agent.name) lines.push(`name = ${formatTomlValue(agent.name)}`);
        if (agent.title) lines.push(`title = ${formatTomlValue(agent.title)}`);
        if (agent.icon) lines.push(`icon = ${formatTomlValue(agent.icon)}`);
        if (agent.description) lines.push(`description = ${formatTomlValue(agent.description)}`);
        lines.push('');
      }

      const outputPath = path.join(moduleDir, 'module.toml');
      const content = lines.join('\n').replace(/\n+$/, '\n');
      await fs.writeFile(outputPath, content);
      written.push(outputPath);
    }
    return written;
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
/**
 * Compute the processed default value for a module.yaml question item.
 * Resolves `{key}` cross-references against the flat `crossKeyDefaults` lookup
 * (shipped defaults, never user answers — see writeCentralConfig comment).
 * Used by writeCentralConfig to detect default-equal values that should NOT
 * be re-emitted into the lean config.toml. Matches the lookup table that
 * writeModuleTomls uses, so module.toml's floor and config.toml's delta
 * detection agree on what "default" means.
 *
 * Steps:
 *   1. Substitute {key} references against crossKeyDefaults (with leading
 *      "{project-root}/" stripped, matching the installer's
 *      processResultTemplate behavior).
 *   2. Apply the result: template with {value} substituted.
 *
 * Returns undefined for items without a default.
 *
 * @param {object} item - one module.yaml question schema
 * @param {Record<string, *>} crossKeyDefaults - flat shipped-defaults lookup
 * @returns {*} processed default value (string/scalar) or undefined
 */
function computeProcessedDefault(item, crossKeyDefaults) {
  if (!item || item.default === undefined || item.default === null) return;
  let value = item.default;
  if (typeof value === 'string') {
    value = value.replaceAll(/{([^}]+)}/g, (match, refKey) => {
      if (refKey === 'project-root' || refKey === 'value' || refKey === 'directory_name') {
        return match;
      }
      const replacement = (crossKeyDefaults || {})[refKey];
      return replacement === undefined ? match : String(replacement);
    });
  }
  if (typeof item.result === 'string' && value !== undefined) {
    return item.result.replaceAll('{value}', String(value));
  }
  return value;
}

/**
 * Resolve `{key}` cross-references in a string value against a flat
 * `{key: value}` lookup map. `{project-root}` and `{directory_name}` are
 * preserved literal — they're runtime placeholders, substituted by the skill
 * or resolver when the value is consumed. Unknown keys are left literal too.
 *
 * Used by writeModuleTomls so that module.toml's [modules.X] keys carry the
 * same shape as the installer's resolved config (e.g.
 * `"{project-root}/_bmad-output/planning-artifacts"`) — making the floor a
 * drop-in for the central config when the latter omits a value as default.
 *
 * @param {*} value - typically a string; non-strings returned unchanged
 * @param {Record<string, *>} crossKeyMap
 * @returns {*}
 */
function resolveCrossKeyPlaceholders(value, crossKeyMap) {
  if (typeof value !== 'string') return value;
  return value.replaceAll(/{([^}]+)}/g, (match, key) => {
    if (key === 'project-root' || key === 'directory_name' || key === 'value') {
      return match;
    }
    const replacement = crossKeyMap[key];
    return replacement === undefined ? match : String(replacement);
  });
}

/**
 * Scalar / shallow equality for delta detection. Handles strings, numbers,
 * booleans, and arrays of scalars (the only shapes module.yaml defaults
 * produce). Different types compare unequal.
 */
function deepEqualScalar(a, b) {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqualScalar(item, b[i]));
  }
  return false;
}

/**
 * Module.yaml top-level keys that are metadata, not question knobs. These
 * never appear in a module's [modules.{code}] floor section.
 */
const MODULE_DEFAULTS_SKIP = new Set([
  'code',
  'name',
  'description',
  'default_selected',
  'header',
  'subheader',
  'agents',
  'directories',
  'dependencies',
  'prompt',
]);

/**
 * Extract shipped defaults from a parsed module.yaml. For each question-style
 * key (object with a `default` field), capture the default and apply its
 * `result:` template with `{value}` substituted. Cross-key placeholders like
 * `{output_folder}` are left as literal strings — see writeModuleTomls() doc
 * for why and how that's handled in phase 1.
 *
 * @param {object} moduleDef - parsed module.yaml content
 * @returns {Record<string, string|number|boolean|Array<*>>}
 */
function extractModuleDefaults(moduleDef) {
  const defaults = {};
  for (const [key, value] of Object.entries(moduleDef)) {
    if (MODULE_DEFAULTS_SKIP.has(key)) continue;
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
    if (!('default' in value)) continue;

    let resolved = value.default;
    if (typeof value.result === 'string' && resolved !== undefined) {
      // Apply `result:` template with `{value}` substituted by default. Leave
      // other placeholders (`{project-root}`, `{output_folder}`, ...) literal.
      resolved = value.result.replaceAll('{value}', String(resolved));
    }
    defaults[key] = resolved;
  }
  return defaults;
}

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

module.exports = { ManifestGenerator };
