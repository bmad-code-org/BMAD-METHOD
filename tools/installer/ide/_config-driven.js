const path = require('node:path');
const fs = require('../fs-native');
const yaml = require('yaml');
const prompts = require('../prompts');
const csv = require('csv-parse/sync');
const { BMAD_FOLDER_NAME } = require('./shared/path-utils');
const { getInstalledCanonicalIds, isBmadOwnedEntry } = require('./shared/installed-skills');

// Reserved OpenCode slash commands. A skill whose canonicalId collides with
// one of these is skipped during command-pointer generation so it doesn't
// shadow a built-in.
const RESERVED_OPENCODE_COMMANDS = new Set([
  'review',
  'commit',
  'init',
  'help',
  'skills',
  'fast',
  'compact',
  'clear',
  'undo',
  'redo',
  'edit',
  'editor',
  'exit',
  'quit',
  'theme',
  'config',
  'model',
  'session',
]);

// Wrap a description for safe insertion into single-line YAML frontmatter.
// Leaves plain values untouched; double-quotes (and escapes) anything that
// could break YAML parsing or span multiple lines.
function yamlSafeSingleLine(value) {
  const collapsed = String(value)
    .replaceAll(/[\r\n]+/g, ' ')
    .trim();
  const needsQuoting = /[:#'"\\]/.test(collapsed) || /^[!&*?|>%@`[{]/.test(collapsed);
  if (!needsQuoting) return collapsed;
  const escaped = collapsed.replaceAll('\\', '\\\\').replaceAll('"', String.raw`\"`);
  return `"${escaped}"`;
}

// Validate that a canonicalId is a safe basename — no path separators, no
// parent-dir traversal, no leading dots, only the character set we expect.
// Defense-in-depth: the manifest is trusted today, but the value flows
// directly into a file path and a malformed entry should not write outside
// the commands directory.
function isSafeCanonicalId(value) {
  return typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(value) && !value.includes('..');
}

// Default body template for command pointer files. Used when a platform's
// installer config doesn't override `commands_body_template`. Matches
// OpenCode's native `@skills/<id>` skill-reference syntax.
const DEFAULT_COMMANDS_BODY_TEMPLATE = '@skills/{canonicalId}';

// Is this skill a persona agent (vs. a workflow/tool/standalone skill)?
// Used by platforms that surface only persona agents (e.g. Copilot's Custom
// Agents picker). Signal: the skill's source `customize.toml` has an
// `[agent]` section. This is the actual configuration source of truth —
// every BMAD persona is configured via [agent] in its customize.toml,
// every workflow uses [workflow], every standalone skill has no
// customize.toml at all. Verified against the full installed manifest:
// catches exactly the 20 description-confirmed personas across BMM, CIS,
// GDS, WDS, TEA, and correctly excludes meta-skills like
// `bmad-agent-builder` (a skill-builder workflow whose canonical id
// contains `-agent-` but which has no [agent] section because it isn't a
// persona itself).
//
// Reading the source toml — at install time the source skill directory
// (resolved from manifest record.path) still exists; cleanup runs later
// in the install flow.
async function isAgentSkill(record, bmadDir) {
  if (!record?.path || !bmadDir) return false;
  const bmadFolderName = path.basename(bmadDir);
  const bmadPrefix = bmadFolderName + '/';
  const relativePath = record.path.startsWith(bmadPrefix) ? record.path.slice(bmadPrefix.length) : record.path;
  const tomlPath = path.join(bmadDir, path.dirname(relativePath), 'customize.toml');
  if (!(await fs.pathExists(tomlPath))) return false;
  try {
    const content = await fs.readFile(tomlPath, 'utf8');
    return /^\[agent\]/m.test(content);
  } catch {
    return false;
  }
}

// Resolve placeholders in a body template. Supported placeholders:
//   {canonicalId}   — the skill's canonical id
//   {target_dir}    — the platform's skill install directory (e.g. .agents/skills)
//   {project-root}  — left as a literal placeholder for the model/tool to expand
//                     at runtime; consistent with PR #1769's templates.
function expandBodyTemplate(template, { canonicalId, targetDir }) {
  return template.replaceAll('{canonicalId}', canonicalId).replaceAll('{target_dir}', targetDir);
}

// The exact body the installer would generate for a given description and
// canonicalId, given the platform's body template. Centralised so both the
// write and the freshness-check paths agree on the canonical form.
function buildCommandPointerBody(description, canonicalId, { template, targetDir }) {
  const bodyText = expandBodyTemplate(template, { canonicalId, targetDir });
  return `---\ndescription: ${yamlSafeSingleLine(description)}\n---\n\n${bodyText}\n`;
}

// Heuristic: does an existing pointer file look like our generator's output
// (and therefore safe to refresh) versus a user-modified file (which we
// preserve)? We check the body shape rather than full equality so that
// description-only edits in the manifest can propagate without trampling
// hand edits to the body.
function looksLikeGeneratorOutput(content, canonicalId, { template, targetDir }) {
  if (typeof content !== 'string') return false;
  const trimmed = content.trim();
  const expectedTail = expandBodyTemplate(template, { canonicalId, targetDir }).trim();
  // Must end with the exact body our generator writes (post-expansion).
  if (!trimmed.endsWith(expectedTail)) return false;
  // Must start with frontmatter containing exactly one description: line.
  const fmMatch = trimmed.match(/^---\n([\S\s]*?)\n---\n/);
  if (!fmMatch) return false;
  const fmLines = fmMatch[1].split('\n').filter((l) => l.length > 0);
  if (fmLines.length !== 1) return false;
  if (!fmLines[0].startsWith('description:')) return false;
  return true;
}

/**
 * Config-driven IDE setup handler
 *
 * This class provides a standardized way to install BMAD artifacts to IDEs
 * based on configuration in platform-codes.yaml. It eliminates the need for
 * individual installer files for each IDE.
 *
 * Features:
 * - Config-driven from platform-codes.yaml
 * - Verbatim skill installation from skill-manifest.csv
 * - IDE-specific marker removal (copilot-instructions, kilo modes, rovodev prompts)
 */
class ConfigDrivenIdeSetup {
  constructor(platformCode, platformConfig) {
    this.name = platformCode;
    this.displayName = platformConfig.name || platformCode;
    this.preferred = platformConfig.preferred || false;
    this.platformConfig = platformConfig;
    this.installerConfig = platformConfig.installer || null;
    this.bmadFolderName = BMAD_FOLDER_NAME;

    // Set configDir from target_dir so detect() works
    this.configDir = this.installerConfig?.target_dir || null;
  }

  setBmadFolderName(bmadFolderName) {
    this.bmadFolderName = bmadFolderName;
  }

  /**
   * Detect whether this IDE already has configuration in the project.
   * Checks for bmad-prefixed entries in target_dir.
   * @param {string} projectDir - Project directory
   * @returns {Promise<boolean>}
   */
  async detect(projectDir) {
    if (!this.configDir) return false;

    const root = projectDir || process.cwd();
    const dir = path.join(root, this.configDir);
    if (!(await fs.pathExists(dir))) return false;

    let entries;
    try {
      entries = await fs.readdir(dir);
    } catch {
      return false;
    }

    const bmadDir = await this._findBmadDir(root);
    const canonicalIds = await getInstalledCanonicalIds(bmadDir);
    return entries.some((e) => isBmadOwnedEntry(e, canonicalIds));
  }

  /**
   * Main setup method - called by IdeManager
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   * @returns {Promise<Object>} Setup result
   */
  async setup(projectDir, bmadDir, options = {}) {
    // Check for BMAD files in ancestor directories that would cause duplicates
    if (this.installerConfig?.ancestor_conflict_check) {
      const conflict = await this.findAncestorConflict(projectDir);
      if (conflict) {
        await prompts.log.error(
          `Found existing BMAD skills in ancestor installation: ${conflict}\n` +
            `  ${this.name} inherits skills from parent directories, so this would cause duplicates.\n` +
            `  Please remove the BMAD files from that directory first:\n` +
            `    rm -rf "${conflict}"/bmad*`,
        );
        return {
          success: false,
          reason: 'ancestor-conflict',
          error: `Ancestor conflict: ${conflict}`,
          conflictDir: conflict,
        };
      }
    }

    if (!options.silent) await prompts.log.info(`Setting up ${this.name}...`);

    // Clean up any old BMAD installation first
    await this.cleanup(projectDir, options, bmadDir);

    if (!this.installerConfig) {
      return { success: false, reason: 'no-config' };
    }

    // When a peer platform in the same install batch owns this target_dir,
    // skip the skill write — the peer has already populated it. Command
    // pointers, however, write to a separate per-IDE directory and must
    // still be generated for this IDE; they are not deduped across peers.
    if (options.skipTarget) {
      const results = { skills: 0, sharedTargetHandledByPeer: true };
      if (this.installerConfig.commands_target_dir) {
        results.commands = await this.installCommandPointers(projectDir, bmadDir, this.installerConfig, options);
      }
      return { success: true, results };
    }

    if (this.installerConfig.target_dir) {
      return this.installToTarget(projectDir, bmadDir, this.installerConfig, options);
    }

    return { success: false, reason: 'invalid-config' };
  }

  /**
   * Install to a single target directory
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} config - Installation configuration
   * @param {Object} options - Setup options
   * @returns {Promise<Object>} Installation result
   */
  async installToTarget(projectDir, bmadDir, config, options) {
    const { target_dir } = config;
    const targetPath = path.join(projectDir, target_dir);
    await fs.ensureDir(targetPath);

    this.skillWriteTracker = new Set();
    const results = { skills: 0 };

    results.skills = await this.installVerbatimSkills(projectDir, bmadDir, targetPath, config);
    results.skillDirectories = this.skillWriteTracker.size;

    if (config.commands_target_dir) {
      results.commands = await this.installCommandPointers(projectDir, bmadDir, config, options);
    }

    await this.printSummary(results, target_dir, options);
    this.skillWriteTracker = null;
    return { success: true, results };
  }

  /**
   * Generate per-skill command pointer files for IDEs that surface commands
   * separately from skills (e.g. OpenCode's `.opencode/commands/<name>.md`).
   *
   * Each pointer is a tiny markdown file whose body is `@skills/<canonicalId>`
   * so invoking `/<canonicalId>` routes the user straight to the skill instead
   * of forcing them through a `/skills` menu.
   *
   * Skips:
   *  - Names that collide with reserved built-in slash commands.
   *  - canonicalIds that aren't safe basename-only identifiers (defense
   *    against path traversal even though the manifest is currently trusted).
   *  - Existing files whose body looks user-modified (preserves hand edits);
   *    pointer files matching the generator pattern get overwritten so that
   *    description changes in skill-manifest.csv propagate on re-install.
   *
   * Per-file write failures are recorded and reported but do not abort the
   * rest of the install — pointer files are a non-essential adjunct to the
   * skill copy that already succeeded.
   *
   * @param {string} projectDir
   * @param {string} bmadDir
   * @param {Object} config - Installer config; reads commands_target_dir.
   * @param {Object} options - Setup options. forceCommands overwrites existing
   *   files unconditionally (including hand-modified ones).
   * @returns {Promise<Object>} { created, updated, skippedExisting, skippedCollision, skippedInvalidId, writeFailures, fallbackDescription }
   */
  async installCommandPointers(projectDir, bmadDir, config, options = {}) {
    const result = {
      created: 0,
      updated: 0,
      skippedExisting: 0,
      skippedCollision: 0,
      skippedInvalidId: 0,
      skippedFiltered: 0,
      writeFailures: 0,
      fallbackDescription: 0,
    };

    const csvPath = path.join(bmadDir, '_config', 'skill-manifest.csv');
    if (!(await fs.pathExists(csvPath))) return result;

    const commandsPath = path.join(projectDir, config.commands_target_dir);
    await fs.ensureDir(commandsPath);

    // Per-platform pointer-file shape, all overrideable in platform-codes.yaml.
    const extension = config.commands_extension || '.md';
    const template = config.commands_body_template || DEFAULT_COMMANDS_BODY_TEMPLATE;
    const targetDir = config.target_dir;
    const filter = config.commands_filter || null;

    const csvContent = await fs.readFile(csvPath, 'utf8');
    const records = csv.parse(csvContent, { columns: true, skip_empty_lines: true });

    for (const record of records) {
      const canonicalId = record.canonicalId;
      if (!canonicalId) continue;

      // Defensive basename validation. canonicalId comes from a trusted
      // manifest today, but the value flows directly into a file path —
      // reject anything that could escape commands_target_dir.
      if (!isSafeCanonicalId(canonicalId)) {
        result.skippedInvalidId++;
        continue;
      }

      // Optional per-platform filter: surfaces that should only show
      // persona agents (e.g. Copilot's Custom Agents picker) skip
      // workflow/tool skills here so the picker isn't cluttered with
      // 90+ unrelated entries.
      if (filter === 'agents-only' && !(await isAgentSkill(record, bmadDir))) {
        result.skippedFiltered++;
        continue;
      }

      // Reserved-name guard is OpenCode-specific. Other adapters that opt
      // into commands_target_dir later should declare their own reserved
      // set rather than inheriting OpenCode's.
      if (this.name === 'opencode' && RESERVED_OPENCODE_COMMANDS.has(canonicalId)) {
        result.skippedCollision++;
        continue;
      }

      let description = (record.description || '').trim();
      if (!description) {
        description = `Run the ${canonicalId} skill`;
        result.fallbackDescription++;
      }

      const body = buildCommandPointerBody(description, canonicalId, { template, targetDir });
      const commandFile = path.join(commandsPath, `${canonicalId}${extension}`);

      // If a pointer file already exists, decide whether to overwrite based
      // on whether it looks like generator output (description-only diff) or
      // a user-modified file. forceCommands overrides this protection.
      if (!options.forceCommands && (await fs.pathExists(commandFile))) {
        let existing;
        try {
          existing = await fs.readFile(commandFile, 'utf8');
        } catch {
          // Treat unreadable as user-owned and skip — safer than overwriting.
          result.skippedExisting++;
          continue;
        }

        if (existing === body) {
          // No-op idempotent re-run.
          result.skippedExisting++;
          continue;
        }
        if (looksLikeGeneratorOutput(existing, canonicalId, { template, targetDir })) {
          // Description (or other generated bit) has changed; refresh in place.
          try {
            await fs.writeFile(commandFile, body, 'utf8');
            result.updated++;
          } catch (error) {
            result.writeFailures++;
            if (!options.silent) {
              await prompts.log.warn(`Failed to update command pointer ${canonicalId}${extension}: ${error.message}`);
            }
          }
          continue;
        }
        // Hand-modified pointer — preserve it.
        result.skippedExisting++;
        continue;
      }

      try {
        await fs.writeFile(commandFile, body, 'utf8');
        result.created++;
      } catch (error) {
        result.writeFailures++;
        if (!options.silent) {
          await prompts.log.warn(`Failed to write command pointer ${canonicalId}${extension}: ${error.message}`);
        }
      }
    }

    return result;
  }

  /**
   * Install verbatim native SKILL.md directories from skill-manifest.csv.
   * Copies the entire source directory as-is into the IDE skill directory.
   * The source SKILL.md is used directly — no frontmatter transformation or file generation.
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {string} targetPath - Target skills directory
   * @param {Object} config - Installation configuration
   * @returns {Promise<number>} Count of skills installed
   */
  async installVerbatimSkills(projectDir, bmadDir, targetPath, config) {
    const bmadFolderName = path.basename(bmadDir);
    const bmadPrefix = bmadFolderName + '/';
    const csvPath = path.join(bmadDir, '_config', 'skill-manifest.csv');

    if (!(await fs.pathExists(csvPath))) return 0;

    const csvContent = await fs.readFile(csvPath, 'utf8');
    const records = csv.parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    let count = 0;

    for (const record of records) {
      const canonicalId = record.canonicalId;
      if (!canonicalId) continue;

      // Derive source directory from path column
      // path is like "_bmad/bmm/workflows/bmad-quick-flow/bmad-quick-dev-new-preview/SKILL.md"
      // Strip bmadFolderName prefix and join with bmadDir, then get dirname
      const relativePath = record.path.startsWith(bmadPrefix) ? record.path.slice(bmadPrefix.length) : record.path;
      const sourceFile = path.join(bmadDir, relativePath);
      const sourceDir = path.dirname(sourceFile);

      if (!(await fs.pathExists(sourceDir))) continue;

      // Clean target before copy to prevent stale files
      const skillDir = path.join(targetPath, canonicalId);
      await fs.remove(skillDir);
      await fs.ensureDir(skillDir);
      this.skillWriteTracker?.add(canonicalId);

      // Copy all skill files, filtering OS/editor artifacts recursively
      const skipPatterns = new Set(['.DS_Store', 'Thumbs.db', 'desktop.ini']);
      const skipSuffixes = ['~', '.swp', '.swo', '.bak'];
      const filter = (src) => {
        const name = path.basename(src);
        if (src === sourceDir) return true;
        if (skipPatterns.has(name)) return false;
        if (name.startsWith('.') && name !== '.gitkeep') return false;
        if (skipSuffixes.some((s) => name.endsWith(s))) return false;
        return true;
      };
      await fs.copy(sourceDir, skillDir, { filter });

      count++;
    }

    return count;
  }

  /**
   * Print installation summary
   * @param {Object} results - Installation results
   * @param {string} targetDir - Target directory (relative)
   */
  async printSummary(results, targetDir, options = {}) {
    if (options.silent) return;
    const count = results.skillDirectories || results.skills || 0;
    if (count > 0) {
      await prompts.log.success(`${this.name} configured: ${count} skills → ${targetDir}`);
    }
    const cmd = results.commands;
    if (cmd && (cmd.created > 0 || cmd.updated > 0) && this.installerConfig?.commands_target_dir) {
      const total = cmd.created + cmd.updated;
      const detail = cmd.updated > 0 ? `${cmd.created} new, ${cmd.updated} refreshed` : `${total}`;
      await prompts.log.success(`${this.name} commands: ${detail} → ${this.installerConfig.commands_target_dir}`);
      if (cmd.skippedCollision > 0) {
        await prompts.log.message(`  (${cmd.skippedCollision} skipped — name collides with reserved slash command)`);
      }
      if (cmd.writeFailures > 0) {
        await prompts.log.warn(`  (${cmd.writeFailures} pointer writes failed — see warnings above)`);
      }
    }
  }

  /**
   * Cleanup IDE configuration
   * @param {string} projectDir - Project directory
   */
  async cleanup(projectDir, options = {}, bmadDir = null) {
    const resolvedBmadDir = bmadDir || (await this._findBmadDir(projectDir));

    // Build removal set: previously installed skills + removals.txt entries
    let removalSet;
    if (options.previousSkillIds && options.previousSkillIds.size > 0) {
      // Install/update flow: use pre-captured skill IDs (before manifest was overwritten)
      removalSet = new Set(options.previousSkillIds);
      if (resolvedBmadDir) {
        const removals = await this.loadRemovalLists(resolvedBmadDir);
        for (const entry of removals) removalSet.add(entry);
      }
    } else if (resolvedBmadDir) {
      // Uninstall flow: read from current skill-manifest.csv + removals.txt
      removalSet = await this._buildUninstallSet(resolvedBmadDir);
    } else {
      removalSet = new Set();
    }

    // Strip BMAD markers from copilot-instructions.md if present
    if (this.name === 'github-copilot') {
      await this.cleanupCopilotInstructions(projectDir, options);
    }

    // Strip BMAD modes from .kilocodemodes if present
    if (this.name === 'kilo') {
      await this.cleanupKiloModes(projectDir, options);
    }

    // Strip BMAD entries from .rovodev/prompts.yml if present
    if (this.name === 'rovo-dev') {
      await this.cleanupRovoDevPrompts(projectDir, options);
    }

    // Clean generated command pointer files in commands_target_dir.
    // Mirrors target_dir cleanup so uninstalls and skill removals don't
    // leave dangling /<canonicalId> commands pointing at missing skills.
    // Runs regardless of skipTarget — command pointers live in a per-IDE
    // directory and are not deduped across peers, so a peer-owned shared
    // skills directory does not protect this IDE's command pointers from
    // cleanup. The "currently active" set is passed so install-flow cleanup
    // (where removalSet contains skills that will be re-added moments later)
    // doesn't trample hand-edited pointers; install-flow cleanup will only
    // delete pointers for skills that are not in the new manifest.
    if (this.installerConfig?.commands_target_dir) {
      // In the install/update flow (signal: previousSkillIds was passed),
      // spare pointers whose canonicalId is still in the manifest so hand
      // edits survive a routine reinstall. In the uninstall flow (no
      // previousSkillIds — full uninstall or per-IDE removal via
      // cleanupByList), don't spare anything; the IDE itself is going away,
      // so its pointers should go with it.
      const isInstallFlow = options.previousSkillIds && options.previousSkillIds.size > 0;
      const activeSkillIds = isInstallFlow ? await this._readActiveSkillIds(resolvedBmadDir) : new Set();
      const extension = this.installerConfig.commands_extension || '.md';
      await this.cleanupCommandPointers(
        projectDir,
        this.installerConfig.commands_target_dir,
        options,
        removalSet,
        activeSkillIds,
        extension,
      );
    }

    // Skip target_dir cleanup when a peer platform owns this directory
    // (set during dedup'd install or when uninstalling one of several
    // platforms that share the same target_dir).
    if (options.skipTarget) return;

    // Clean current target directory
    if (this.installerConfig?.target_dir) {
      await this.cleanupTarget(projectDir, this.installerConfig.target_dir, options, removalSet);
    }
  }

  /**
   * Find the _bmad directory in a project
   * @param {string} projectDir - Project directory
   * @returns {string|null} Path to bmad dir or null
   */
  async _findBmadDir(projectDir) {
    const bmadDir = path.join(projectDir, BMAD_FOLDER_NAME);
    return (await fs.pathExists(bmadDir)) ? bmadDir : null;
  }

  /**
   * Build the full set of entries to remove for uninstall.
   * Reads skill-manifest.csv to know exactly what was installed, plus removal lists.
   * @param {string} bmadDir - BMAD installation directory
   * @returns {Set<string>} Set of entries to remove
   */
  async _buildUninstallSet(bmadDir) {
    const removals = await this.loadRemovalLists(bmadDir);

    // Also add all currently installed skills from skill-manifest.csv
    const csvPath = path.join(bmadDir, '_config', 'skill-manifest.csv');
    try {
      if (await fs.pathExists(csvPath)) {
        const content = await fs.readFile(csvPath, 'utf8');
        const records = csv.parse(content, { columns: true, skip_empty_lines: true });
        for (const record of records) {
          if (record.canonicalId) {
            removals.add(record.canonicalId);
          }
        }
      }
    } catch {
      // If we can't read the manifest, we still have the removal lists
    }

    return removals;
  }

  /**
   * Load removal lists from all module sources in the bmad directory.
   * Each module can have an optional removals.txt listing entries to remove.
   * @param {string} bmadDir - BMAD installation directory
   * @returns {Set<string>} Set of entries to remove
   */
  async loadRemovalLists(bmadDir) {
    const removals = new Set();
    const { getProjectRoot } = require('../project-root');

    // Read project-level removals.txt (covers core and bmm)
    const projectRemovalsPath = path.join(getProjectRoot(), 'removals.txt');
    await this._readRemovalFile(projectRemovalsPath, removals);

    // Read per-module removals.txt from installed module directories
    try {
      const entries = await fs.readdir(bmadDir);
      for (const entry of entries) {
        if (entry.startsWith('_')) continue;
        const removalPath = path.join(bmadDir, entry, 'removals.txt');
        await this._readRemovalFile(removalPath, removals);
      }
    } catch {
      // bmadDir may not exist yet on fresh install
    }

    return removals;
  }

  /**
   * Read a removals.txt file and add entries to the set
   * @param {string} filePath - Path to removals.txt
   * @param {Set<string>} removals - Set to add entries to
   */
  async _readRemovalFile(filePath, removals) {
    try {
      if (await fs.pathExists(filePath)) {
        const content = await fs.readFile(filePath, 'utf8');
        for (const line of content.split('\n')) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            removals.add(trimmed);
          }
        }
      }
    } catch {
      // Optional file — ignore errors
    }
  }

  /**
   * Cleanup generated command pointer files for entries in removalSet.
   * Symmetric counterpart to installCommandPointers — removes
   * `<canonicalId><extension>` files whose canonicalId is in the set. Removes
   * the commands directory entirely if it ends up empty.
   * @param {string} projectDir
   * @param {string} commandsTargetDir - Relative dir (e.g. .opencode/commands)
   * @param {Object} options
   * @param {Set<string>} removalSet - canonicalIds whose pointer files to remove
   * @param {Set<string>} [activeSkillIds] - canonicalIds present in the
   *   current manifest. Pointers for IDs in this set are spared so an
   *   install-flow cleanup (where removalSet === previousSkillIds and the
   *   same skills are about to be re-installed) doesn't wipe hand-edited
   *   pointer files. Pass an empty set or omit to delete every match in
   *   removalSet (uninstall flow).
   * @param {string} [extension] - Pointer file extension (default '.md');
   *   matches the platform's commands_extension config value so cleanup
   *   correctly identifies pointer files for IDEs whose convention isn't .md
   *   (e.g. Copilot's `.agent.md`).
   */
  async cleanupCommandPointers(
    projectDir,
    commandsTargetDir,
    options = {},
    removalSet = new Set(),
    activeSkillIds = new Set(),
    extension = '.md',
  ) {
    if (!removalSet || removalSet.size === 0) return;

    const commandsPath = path.join(projectDir, commandsTargetDir);
    if (!(await fs.pathExists(commandsPath))) return;

    let entries;
    try {
      entries = await fs.readdir(commandsPath);
    } catch {
      return;
    }

    for (const entry of entries) {
      if (!entry.endsWith(extension)) continue;
      const canonicalId = entry.slice(0, -extension.length);
      if (!removalSet.has(canonicalId)) continue;
      // Spare pointers for skills that are still in the manifest; the
      // install pass will refresh them in place if their content has gone
      // stale, while preserving hand edits.
      if (activeSkillIds.has(canonicalId)) continue;
      try {
        await fs.remove(path.join(commandsPath, entry));
      } catch {
        // Skip files we can't remove.
      }
    }

    // Remove the commands directory if we emptied it.
    try {
      const remaining = await fs.readdir(commandsPath);
      if (remaining.length === 0) {
        await fs.remove(commandsPath);
      }
    } catch {
      // Directory may already be gone.
    }
  }

  /**
   * Read the canonicalIds currently present in the skill-manifest.csv.
   * Used by cleanup to distinguish "re-install of an existing skill"
   * (preserve pointer) from "skill truly being removed" (delete pointer).
   * @param {string|null} bmadDir
   * @returns {Promise<Set<string>>}
   */
  async _readActiveSkillIds(bmadDir) {
    const ids = new Set();
    if (!bmadDir) return ids;
    const csvPath = path.join(bmadDir, '_config', 'skill-manifest.csv');
    if (!(await fs.pathExists(csvPath))) return ids;
    try {
      const content = await fs.readFile(csvPath, 'utf8');
      const records = csv.parse(content, { columns: true, skip_empty_lines: true });
      for (const record of records) {
        if (record.canonicalId) ids.add(record.canonicalId);
      }
    } catch {
      // Manifest unreadable — return an empty set so cleanup falls back to
      // the conservative "delete what removalSet says" behavior.
    }
    return ids;
  }

  /**
   * Cleanup a specific target directory.
   * When removalSet is provided, only removes entries in that set.
   * When removalSet is null (legacy dirs), removes all bmad-prefixed entries.
   * @param {string} projectDir - Project directory
   * @param {string} targetDir - Target directory to clean
   * @param {Object} options - Cleanup options
   * @param {Set<string>|null} removalSet - Entries to remove, or null for legacy prefix matching
   */
  async cleanupTarget(projectDir, targetDir, options = {}, removalSet = new Set()) {
    const targetPath = path.join(projectDir, targetDir);

    if (!(await fs.pathExists(targetPath))) {
      return;
    }

    if (removalSet && removalSet.size === 0) {
      return;
    }

    let entries;
    try {
      entries = await fs.readdir(targetPath);
    } catch {
      return;
    }

    if (!entries || !Array.isArray(entries)) {
      return;
    }

    let removedCount = 0;

    for (const entry of entries) {
      if (!entry || typeof entry !== 'string') continue;

      // Always preserve bmad-os-* utility skills regardless of cleanup mode
      if (entry.startsWith('bmad-os-')) continue;

      // Surgical removal from set, or fallback to manifest+prefix detection when null
      const shouldRemove = removalSet ? removalSet.has(entry) : isBmadOwnedEntry(entry, null);

      if (shouldRemove) {
        try {
          await fs.remove(path.join(targetPath, entry));
          removedCount++;
        } catch {
          // Skip entries that can't be removed
        }
      }
    }

    // Only log cleanup when it's not a routine reinstall (legacy dir cleanup or actual removals)
    // Suppress for current target_dir since it's always cleaned before a fresh write

    // Remove empty directory after cleanup
    if (removedCount > 0) {
      try {
        const remaining = await fs.readdir(targetPath);
        if (remaining.length === 0) {
          await fs.remove(targetPath);
        }
      } catch {
        // Directory may already be gone or in use
      }
    }
  }

  /**
   * Strip BMAD-owned content from .github/copilot-instructions.md.
   * The old custom installer injected content between <!-- BMAD:START --> and <!-- BMAD:END --> markers.
   * Deletes the file if nothing remains. Restores .bak backup if one exists.
   */
  async cleanupCopilotInstructions(projectDir, options = {}) {
    const filePath = path.join(projectDir, '.github', 'copilot-instructions.md');

    if (!(await fs.pathExists(filePath))) return;

    try {
      const content = await fs.readFile(filePath, 'utf8');
      const startIdx = content.indexOf('<!-- BMAD:START -->');
      const endIdx = content.indexOf('<!-- BMAD:END -->');

      if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return;

      const cleaned = content.slice(0, startIdx) + content.slice(endIdx + '<!-- BMAD:END -->'.length);

      if (cleaned.trim().length === 0) {
        await fs.remove(filePath);
        const backupPath = `${filePath}.bak`;
        if (await fs.pathExists(backupPath)) {
          await fs.rename(backupPath, filePath);
          if (!options.silent) await prompts.log.message('  Restored copilot-instructions.md from backup');
        }
      } else {
        await fs.writeFile(filePath, cleaned, 'utf8');
        const backupPath = `${filePath}.bak`;
        if (await fs.pathExists(backupPath)) await fs.remove(backupPath);
      }

      if (!options.silent) await prompts.log.message('  Cleaned BMAD markers from copilot-instructions.md');
    } catch {
      if (!options.silent) await prompts.log.warn('  Warning: Could not clean BMAD markers from copilot-instructions.md');
    }
  }

  /**
   * Strip BMAD-owned modes from .kilocodemodes.
   * The old custom kilo.js installer added modes with slug starting with 'bmad-'.
   * Parses YAML, filters out BMAD modes, rewrites. Leaves file as-is on parse failure.
   */
  async cleanupKiloModes(projectDir, options = {}) {
    const kiloModesPath = path.join(projectDir, '.kilocodemodes');

    if (!(await fs.pathExists(kiloModesPath))) return;

    const content = await fs.readFile(kiloModesPath, 'utf8');

    let config;
    try {
      config = yaml.parse(content) || {};
    } catch {
      if (!options.silent) await prompts.log.warn('  Warning: Could not parse .kilocodemodes for cleanup');
      return;
    }

    if (!Array.isArray(config.customModes)) return;

    const originalCount = config.customModes.length;
    config.customModes = config.customModes.filter((mode) => mode && (!mode.slug || !mode.slug.startsWith('bmad-')));
    const removedCount = originalCount - config.customModes.length;

    if (removedCount > 0) {
      try {
        await fs.writeFile(kiloModesPath, yaml.stringify(config, { lineWidth: 0 }));
        if (!options.silent) await prompts.log.message(`  Removed ${removedCount} BMAD modes from .kilocodemodes`);
      } catch {
        if (!options.silent) await prompts.log.warn('  Warning: Could not write .kilocodemodes during cleanup');
      }
    }
  }

  /**
   * Strip BMAD-owned entries from .rovodev/prompts.yml.
   * The old custom rovodev.js installer registered workflows in prompts.yml.
   * Parses YAML, filters out entries with name starting with 'bmad-', rewrites.
   * Removes the file if no entries remain.
   */
  async cleanupRovoDevPrompts(projectDir, options = {}) {
    const promptsPath = path.join(projectDir, '.rovodev', 'prompts.yml');

    if (!(await fs.pathExists(promptsPath))) return;

    const content = await fs.readFile(promptsPath, 'utf8');

    let config;
    try {
      config = yaml.parse(content) || {};
    } catch {
      if (!options.silent) await prompts.log.warn('  Warning: Could not parse prompts.yml for cleanup');
      return;
    }

    if (!Array.isArray(config.prompts)) return;

    const originalCount = config.prompts.length;
    config.prompts = config.prompts.filter((entry) => entry && (!entry.name || !entry.name.startsWith('bmad-')));
    const removedCount = originalCount - config.prompts.length;

    if (removedCount > 0) {
      try {
        if (config.prompts.length === 0) {
          await fs.remove(promptsPath);
        } else {
          await fs.writeFile(promptsPath, yaml.stringify(config, { lineWidth: 0 }));
        }
        if (!options.silent) await prompts.log.message(`  Removed ${removedCount} BMAD entries from prompts.yml`);
      } catch {
        if (!options.silent) await prompts.log.warn('  Warning: Could not write prompts.yml during cleanup');
      }
    }
  }

  /**
   * Check ancestor directories for existing BMAD files in the same target_dir.
   * IDEs like Claude Code inherit commands from parent directories, so an existing
   * installation in an ancestor would cause duplicate commands.
   * @param {string} projectDir - Project directory being installed to
   * @returns {Promise<string|null>} Path to conflicting directory, or null if clean
   */
  async findAncestorConflict(projectDir) {
    const targetDir = this.installerConfig?.target_dir;
    if (!targetDir) return null;

    const resolvedProject = await fs.realpath(path.resolve(projectDir));
    let current = path.dirname(resolvedProject);
    const root = path.parse(current).root;

    while (current !== root && current.length > root.length) {
      const candidatePath = path.join(current, targetDir);
      try {
        if (await fs.pathExists(candidatePath)) {
          const entries = await fs.readdir(candidatePath);
          const ancestorBmadDir = await this._findBmadDir(current);
          const canonicalIds = await getInstalledCanonicalIds(ancestorBmadDir);
          if (entries.some((e) => isBmadOwnedEntry(e, canonicalIds))) {
            return candidatePath;
          }
        }
      } catch {
        // Can't read directory — skip
      }
      current = path.dirname(current);
    }

    return null;
  }
}

module.exports = { ConfigDrivenIdeSetup };
