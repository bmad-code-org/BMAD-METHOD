const fs = require('../fs-native');
const path = require('node:path');
const yaml = require('yaml');
const { MODULE_HELP_CSV_HEADER } = require('./module-help-schema');
const { loadBmadModuleLib, readPluginManifest } = require('./bmad-module-lib');

/**
 * Resolves how to install a plugin by analyzing its on-disk shape.
 *
 * Strategy 0 (new module system), tried first:
 *   0. A `.claude-plugin/plugin.json` carrying a `bmad{}` block at the module
 *      root. Resolved + validated via the bmad-module skill's own libs so the
 *      installer and the runtime skill agree on what a module is.
 *
 * Legacy strategies (marketplace.json + module.yaml), tried in order:
 *   1. Root module files at the common parent of all skills
 *   2. A -setup skill with assets/module.yaml + assets/module-help.csv
 *   3. Single standalone skill with both files in its assets/
 *   4. Multiple standalone skills, each with both files in assets/
 *   5. Fallback: synthesize from marketplace.json + SKILL.md frontmatter
 *
 * Every resolved module carries a `format` discriminator ('plugin-json' or
 * 'legacy') so the installer can pick the matching install path.
 */
class PluginResolver {
  /**
   * Resolve a plugin to one or more installable module definitions.
   * @param {string} repoPath - Absolute path to the cloned repository root
   * @param {Object} plugin - Plugin object from marketplace.json
   * @param {string} plugin.name - Plugin identifier
   * @param {string} [plugin.source] - Relative path from repo root
   * @param {string} [plugin.version] - Semantic version
   * @param {string} [plugin.description] - Plugin description
   * @param {string[]} [plugin.skills] - Relative paths to skill directories
   * @param {Object} [options] - Resolution options
   * @param {function} [options.chooseModuleDefinition] - Async selector invoked
   *   when more than one module.yaml + module-help.csv pair is found between the
   *   skills' common parent and the repo root. Receives (candidates, context)
   *   and returns the chosen candidate. When omitted (headless / non-interactive
   *   / CLI), the deepest candidate is used so resolution never blocks.
   * @returns {Promise<ResolvedModule[]>} Array of resolved module definitions
   */
  async resolve(repoPath, plugin, options = {}) {
    // Strategy 0: new module system. Tried before everything else — and before
    // the no-skills early return below — because new-system modules declare
    // their skills inside plugin.json rather than via marketplace.json's
    // skills[] array.
    const pluginJsonResult = await this._tryPluginJson(repoPath, plugin);
    if (pluginJsonResult) return pluginJsonResult;

    const skillRelPaths = plugin.skills || [];

    // No skills array: legacy behavior - caller should use existing findModuleSource
    if (skillRelPaths.length === 0) {
      return [];
    }

    // Resolve skill paths to absolute, constrain to repo root, filter non-existent
    const repoRoot = path.resolve(repoPath);
    const skillPaths = [];
    for (const rel of skillRelPaths) {
      const normalized = rel.replace(/^\.\//, '');
      const abs = path.resolve(repoPath, normalized);
      // Guard against path traversal (.. segments, absolute paths in marketplace.json)
      if (!abs.startsWith(repoRoot + path.sep) && abs !== repoRoot) {
        continue;
      }
      if (await fs.pathExists(abs)) {
        skillPaths.push(abs);
      }
    }

    if (skillPaths.length === 0) {
      return [];
    }

    // Try each strategy in order
    const result =
      (await this._tryRootModuleFiles(repoPath, plugin, skillPaths, options)) ||
      (await this._trySetupSkill(repoPath, plugin, skillPaths)) ||
      (await this._trySingleStandalone(repoPath, plugin, skillPaths)) ||
      (await this._tryMultipleStandalone(repoPath, plugin, skillPaths)) ||
      (await this._synthesizeFallback(repoPath, plugin, skillPaths));

    return result;
  }

  // ─── Strategy 0: New Module System (plugin.json#bmad) ───────────────────────

  /**
   * Detect a `.claude-plugin/plugin.json` carrying a `bmad{}` block at the
   * module root and resolve it via the bmad-module skill's own validator.
   *
   * The module root is `plugin.source` (relative to the repo) when given, else
   * the repo root. Returns a single-element array of a new-format ResolvedModule
   * on success, or null to fall through to the legacy strategies. Throws when a
   * plugin.json#bmad is present but invalid — a malformed new-system manifest
   * should surface, not silently install via the legacy synthesizer.
   */
  async _tryPluginJson(repoPath, plugin) {
    const repoRoot = path.resolve(repoPath);
    let moduleRoot = repoRoot;
    if (plugin.source) {
      const normalized = String(plugin.source).replace(/^\.\//, '');
      const abs = path.resolve(repoPath, normalized);
      // Guard against path traversal out of the repo root.
      if (abs !== repoRoot && !abs.startsWith(repoRoot + path.sep)) {
        return null;
      }
      moduleRoot = abs;
    }

    const rawManifest = await readPluginManifest(moduleRoot);
    if (!rawManifest) return null;

    // Validate with the skill's install-time validator (throws BmadModuleError
    // with a descriptive .message on a bad manifest).
    const { readAndValidateManifest } = await loadBmadModuleLib();
    const manifest = await readAndValidateManifest(moduleRoot);

    // Resolve declared skill dirs to absolute existing paths for display only;
    // the install copy is plan-driven (buildCopyPlan), not skillPaths-driven.
    const skillPaths = [];
    if (Array.isArray(manifest.skills)) {
      for (const rel of manifest.skills) {
        if (typeof rel !== 'string') continue;
        const abs = path.resolve(moduleRoot, rel.replace(/^\.\//, ''));
        if (abs.startsWith(moduleRoot + path.sep) && (await fs.pathExists(abs))) {
          skillPaths.push(abs);
        }
      }
    }

    // Point moduleYamlPath at the source moduleDefinition so the installer's
    // source-resolution helpers (findModuleSourceByCode → createModuleDirectories,
    // resolveInstalledModuleYaml) can read the module's declared `directories`.
    // Install itself flattens this to `_bmad/<code>/module.yaml` via buildCopyPlan.
    let moduleYamlPath = null;
    if (typeof manifest.bmad?.moduleDefinition === 'string') {
      const abs = path.resolve(moduleRoot, manifest.bmad.moduleDefinition.replace(/^\.\//, ''));
      if (abs.startsWith(moduleRoot + path.sep) && (await fs.pathExists(abs))) {
        moduleYamlPath = abs;
      }
    }

    return [
      {
        code: manifest.bmad.code,
        name: manifest.displayName || manifest.name,
        version: manifest.bmad.moduleVersion || manifest.version || null,
        description: manifest.description || plugin.description || '',
        format: 'plugin-json',
        strategy: 'plugin-json',
        pluginName: plugin.name,
        sourceDir: moduleRoot,
        manifest,
        skillPaths,
        moduleYamlPath,
        moduleHelpCsvPath: null,
        synthesizedModuleYaml: null,
        synthesizedHelpCsv: null,
      },
    ];
  }

  // ─── Strategy 1: Root Module Files ──────────────────────────────────────────

  /**
   * Check if module.yaml + module-help.csv exist at the common parent of all
   * skills, or in any directory between there and the repo root.
   *
   * The canonical BMad layout puts module.yaml + module-help.csv at the repo
   * root or under src/, while skills live in src/skills/<name>/ — i.e. one or
   * more levels ABOVE the skills' common parent. We therefore start at the
   * common parent and walk up to the repo root, using the first (deepest)
   * directory that has both files. This catches the common case where, e.g.,
   * module.yaml sits at src/module.yaml but skills are in src/skills/.
   */
  async _tryRootModuleFiles(repoPath, plugin, skillPaths, options = {}) {
    const commonParent = this._computeCommonParent(skillPaths);
    const candidates = await this._findModuleFileCandidatesUpward(commonParent, repoPath);
    if (candidates.length === 0) {
      return null;
    }

    // Deepest candidate (closest to the skills) is the safe default. When more
    // than one directory in the chain carries both files, give an interactive
    // caller the chance to pick — enriching each option with its module.yaml
    // metadata so the choice is meaningful. Headless callers fall through to
    // the deepest candidate without prompting.
    let chosen = candidates[0];
    if (candidates.length > 1 && typeof options.chooseModuleDefinition === 'function') {
      const enriched = [];
      for (const candidate of candidates) {
        const data = await this._readModuleYaml(candidate.moduleYamlPath);
        enriched.push({
          ...candidate,
          relativePath: path.relative(path.resolve(repoPath), candidate.moduleYamlPath),
          code: data?.code || null,
          name: data?.name || null,
          description: data?.description || null,
        });
      }
      const picked = await options.chooseModuleDefinition(enriched, { plugin });
      if (picked && picked.moduleYamlPath && picked.moduleHelpPath) {
        chosen = picked;
      }
    }

    const { moduleYamlPath, moduleHelpPath } = chosen;

    const moduleData = await this._readModuleYaml(moduleYamlPath);
    if (!moduleData) return null;

    return [
      {
        code: moduleData.code || plugin.name,
        name: moduleData.name || plugin.name,
        version: plugin.version || moduleData.module_version || null,
        description: moduleData.description || plugin.description || '',
        format: 'legacy',
        strategy: 1,
        pluginName: plugin.name,
        moduleYamlPath,
        moduleHelpCsvPath: moduleHelpPath,
        skillPaths,
        synthesizedModuleYaml: null,
        synthesizedHelpCsv: null,
      },
    ];
  }

  // ─── Strategy 2: Setup Skill ────────────────────────────────────────────────

  /**
   * Search for a skill ending in -setup with assets/module.yaml + assets/module-help.csv.
   */
  async _trySetupSkill(repoPath, plugin, skillPaths) {
    for (const skillPath of skillPaths) {
      const dirName = path.basename(skillPath);
      if (!dirName.endsWith('-setup')) continue;

      const moduleYamlPath = path.join(skillPath, 'assets', 'module.yaml');
      const moduleHelpPath = path.join(skillPath, 'assets', 'module-help.csv');

      if (!(await fs.pathExists(moduleYamlPath)) || !(await fs.pathExists(moduleHelpPath))) {
        continue;
      }

      const moduleData = await this._readModuleYaml(moduleYamlPath);
      if (!moduleData) continue;

      return [
        {
          code: moduleData.code || plugin.name,
          name: moduleData.name || plugin.name,
          version: plugin.version || moduleData.module_version || null,
          description: moduleData.description || plugin.description || '',
          format: 'legacy',
          strategy: 2,
          pluginName: plugin.name,
          moduleYamlPath,
          moduleHelpCsvPath: moduleHelpPath,
          skillPaths,
          synthesizedModuleYaml: null,
          synthesizedHelpCsv: null,
        },
      ];
    }

    return null;
  }

  // ─── Strategy 3: Single Standalone Skill ────────────────────────────────────

  /**
   * One skill listed, with assets/module.yaml + assets/module-help.csv.
   */
  async _trySingleStandalone(repoPath, plugin, skillPaths) {
    if (skillPaths.length !== 1) return null;

    const skillPath = skillPaths[0];
    const moduleYamlPath = path.join(skillPath, 'assets', 'module.yaml');
    const moduleHelpPath = path.join(skillPath, 'assets', 'module-help.csv');

    if (!(await fs.pathExists(moduleYamlPath)) || !(await fs.pathExists(moduleHelpPath))) {
      return null;
    }

    const moduleData = await this._readModuleYaml(moduleYamlPath);
    if (!moduleData) return null;

    return [
      {
        code: moduleData.code || plugin.name,
        name: moduleData.name || plugin.name,
        version: plugin.version || moduleData.module_version || null,
        description: moduleData.description || plugin.description || '',
        format: 'legacy',
        strategy: 3,
        pluginName: plugin.name,
        moduleYamlPath,
        moduleHelpCsvPath: moduleHelpPath,
        skillPaths,
        synthesizedModuleYaml: null,
        synthesizedHelpCsv: null,
      },
    ];
  }

  // ─── Strategy 4: Multiple Standalone Skills ─────────────────────────────────

  /**
   * Multiple skills, each with assets/module.yaml + assets/module-help.csv.
   * Each becomes its own installable module.
   */
  async _tryMultipleStandalone(repoPath, plugin, skillPaths) {
    if (skillPaths.length < 2) return null;

    const resolved = [];

    for (const skillPath of skillPaths) {
      const moduleYamlPath = path.join(skillPath, 'assets', 'module.yaml');
      const moduleHelpPath = path.join(skillPath, 'assets', 'module-help.csv');

      if (!(await fs.pathExists(moduleYamlPath)) || !(await fs.pathExists(moduleHelpPath))) {
        continue;
      }

      const moduleData = await this._readModuleYaml(moduleYamlPath);
      if (!moduleData) continue;

      resolved.push({
        code: moduleData.code || path.basename(skillPath),
        name: moduleData.name || path.basename(skillPath),
        version: plugin.version || moduleData.module_version || null,
        description: moduleData.description || '',
        format: 'legacy',
        strategy: 4,
        pluginName: plugin.name,
        moduleYamlPath,
        moduleHelpCsvPath: moduleHelpPath,
        skillPaths: [skillPath],
        synthesizedModuleYaml: null,
        synthesizedHelpCsv: null,
      });
    }

    // Only use strategy 4 if ALL skills have module files
    if (resolved.length === skillPaths.length) {
      return resolved;
    }

    // Partial match: fall through to strategy 5
    return null;
  }

  // ─── Strategy 5: Fallback (Synthesized) ─────────────────────────────────────

  /**
   * No module files found anywhere. Synthesize from marketplace.json metadata
   * and SKILL.md frontmatter.
   */
  async _synthesizeFallback(repoPath, plugin, skillPaths) {
    const skillInfos = [];

    for (const skillPath of skillPaths) {
      const frontmatter = await this._parseSkillFrontmatter(skillPath);
      skillInfos.push({
        dirName: path.basename(skillPath),
        name: frontmatter.name || path.basename(skillPath),
        description: frontmatter.description || '',
      });
    }

    const moduleName = this._formatDisplayName(plugin.name);
    const code = plugin.name;

    const synthesizedYaml = {
      code,
      name: moduleName,
      description: plugin.description || '',
      module_version: plugin.version || '1.0.0',
      default_selected: false,
    };

    const synthesizedCsv = this._buildSynthesizedHelpCsv(moduleName, skillInfos);

    return [
      {
        code,
        name: moduleName,
        version: plugin.version || null,
        description: plugin.description || '',
        format: 'legacy',
        strategy: 5,
        pluginName: plugin.name,
        moduleYamlPath: null,
        moduleHelpCsvPath: null,
        skillPaths,
        synthesizedModuleYaml: synthesizedYaml,
        synthesizedHelpCsv: synthesizedCsv,
      },
    ];
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Walk up from startDir to the repo root, collecting every directory that
   * contains BOTH module.yaml and module-help.csv. Bounded by repoRoot so we
   * never escape the cloned repository. Results are ordered deepest-first
   * (closest to startDir), so candidates[0] is the safe default.
   * @param {string} startDir - Directory to start searching from (inclusive)
   * @param {string} repoPath - Repository root (upper bound, inclusive)
   * @returns {Promise<Array<{moduleYamlPath: string, moduleHelpPath: string}>>}
   */
  async _findModuleFileCandidatesUpward(startDir, repoPath) {
    const repoRoot = path.resolve(repoPath);
    let dir = path.resolve(startDir);

    // If startDir somehow falls outside the repo, only consider the repo root.
    if (dir !== repoRoot && !dir.startsWith(repoRoot + path.sep)) {
      dir = repoRoot;
    }

    const candidates = [];
    while (true) {
      const moduleYamlPath = path.join(dir, 'module.yaml');
      const moduleHelpPath = path.join(dir, 'module-help.csv');
      if ((await fs.pathExists(moduleYamlPath)) && (await fs.pathExists(moduleHelpPath))) {
        candidates.push({ moduleYamlPath, moduleHelpPath });
      }
      if (dir === repoRoot) break;
      const parent = path.dirname(dir);
      if (parent === dir) break; // filesystem root — stop defensively
      dir = parent;
    }

    return candidates;
  }

  /**
   * Compute the deepest common ancestor directory of an array of absolute paths.
   * @param {string[]} absPaths - Absolute directory paths
   * @returns {string} Common parent directory
   */
  _computeCommonParent(absPaths) {
    if (absPaths.length === 0) return '/';
    if (absPaths.length === 1) return path.dirname(absPaths[0]);

    const segments = absPaths.map((p) => p.split(path.sep));
    const minLen = Math.min(...segments.map((s) => s.length));
    const common = [];

    for (let i = 0; i < minLen; i++) {
      const segment = segments[0][i];
      if (segments.every((s) => s[i] === segment)) {
        common.push(segment);
      } else {
        break;
      }
    }

    return common.join(path.sep) || '/';
  }

  /**
   * Read and parse a module.yaml file.
   * @param {string} yamlPath - Absolute path to module.yaml
   * @returns {Object|null} Parsed content or null on failure
   */
  async _readModuleYaml(yamlPath) {
    try {
      const content = await fs.readFile(yamlPath, 'utf8');
      return yaml.parse(content);
    } catch {
      return null;
    }
  }

  /**
   * Extract name and description from a SKILL.md YAML frontmatter block.
   * @param {string} skillDirPath - Absolute path to the skill directory
   * @returns {Object} { name, description } or empty strings
   */
  async _parseSkillFrontmatter(skillDirPath) {
    const skillMdPath = path.join(skillDirPath, 'SKILL.md');
    try {
      const content = await fs.readFile(skillMdPath, 'utf8');
      const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
      if (!match) return { name: '', description: '' };

      const parsed = yaml.parse(match[1]);
      return {
        name: parsed.name || '',
        description: parsed.description || '',
      };
    } catch {
      return { name: '', description: '' };
    }
  }

  /**
   * Build a synthesized module-help.csv from plugin metadata and skill frontmatter.
   * Uses the standard 13-column format.
   * @param {string} moduleName - Display name for the module column
   * @param {Array<{dirName: string, name: string, description: string}>} skillInfos
   * @returns {string} CSV content
   */
  _buildSynthesizedHelpCsv(moduleName, skillInfos) {
    const rows = [MODULE_HELP_CSV_HEADER];

    for (const info of skillInfos) {
      const displayName = this._formatDisplayName(info.name || info.dirName);
      const menuCode = this._generateMenuCode(info.name || info.dirName);
      const description = this._escapeCSVField(info.description);

      rows.push(`${moduleName},${info.dirName},${displayName},${menuCode},${description},activate,,anytime,,,false,,`);
    }

    return rows.join('\n') + '\n';
  }

  /**
   * Format a kebab-case or snake_case name into a display name.
   * Strips common prefixes like "bmad-" or "bmad-agent-".
   * @param {string} name - Raw name
   * @returns {string} Formatted display name
   */
  _formatDisplayName(name) {
    let cleaned = name.replace(/^bmad-agent-/, '').replace(/^bmad-/, '');
    return cleaned
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Generate a short menu code from a skill name.
   * Takes first letter of each significant word, uppercased, max 3 chars.
   * @param {string} name - Skill name (kebab-case)
   * @returns {string} Menu code (e.g., "CC" for "code-coach")
   */
  _generateMenuCode(name) {
    const cleaned = name.replace(/^bmad-agent-/, '').replace(/^bmad-/, '');
    const words = cleaned.split(/[-_]/).filter((w) => w.length > 0);
    return words
      .map((w) => w.charAt(0).toUpperCase())
      .join('')
      .slice(0, 3);
  }

  /**
   * Escape a value for CSV output (wrap in quotes if it contains commas, quotes, or newlines).
   * @param {string} value
   * @returns {string}
   */
  _escapeCSVField(value) {
    if (!value) return '';
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replaceAll('"', '""')}"`;
    }
    return value;
  }
}

module.exports = { PluginResolver };
