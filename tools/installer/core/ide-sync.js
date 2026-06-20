// ide-sync — the single, non-interactive primitive for distributing installed
// BMAD skills to the coding assistants (IDEs) recorded in a project's manifest.
//
// This is the ONE implementation of "push skills to the chosen IDEs". Three
// callers route through it so they can never diverge:
//   1. The interactive installer (`Installer._setupIdes` → syncIdes).
//   2. The `bmad ide-sync` CLI command (commands/ide-sync.js → runIdeSync).
//   3. The self-contained bundle shipped into projects at install time and
//      invoked by the bmad-module skill (build target wraps runIdeSyncCli).
//
// It reuses the real config-driven IDE engine (IdeManager / ConfigDrivenIdeSetup
// / platform-codes.yaml), so new platforms and handler changes flow here for
// free. The engine is bundleable (fs-native is zero-dep; yaml/csv-parse inline;
// `../prompts` and `../project-root` are aliased to small shims at bundle time).

const path = require('node:path');
const fs = require('../fs-native');
const { IdeManager } = require('../ide/manager');
const { BMAD_FOLDER_NAME } = require('../ide/shared/path-utils');

const writeOut = (m) => process.stdout.write(`${m}\n`);
const writeErr = (m) => process.stderr.write(`${m}\n`);
const DEFAULT_LOGGER = { info: writeOut, warn: writeErr, error: writeErr };

/**
 * Distribute the skills currently listed in _config/skill-manifest.csv to each
 * selected IDE, prune any `previousSkillIds` no longer present, then remove the
 * now-redundant skill source dirs from _bmad/ (canonical end-state: skills live
 * in IDE dirs).
 *
 * @param {Object} args
 * @param {string} args.projectRoot   Project root (contains _bmad/).
 * @param {string} args.bmadDir       Path to the _bmad/ directory.
 * @param {string[]} args.ides        Platform codes to set up (from manifest.yaml `ides`).
 * @param {string[]} [args.previousSkillIds]  canonicalIds to remove from IDE dirs.
 * @param {boolean} [args.verbose]
 * @param {boolean} [args.cleanup]    Remove _bmad/ skill source dirs afterward (default true).
 *                                    The interactive installer passes false and runs its own
 *                                    unconditional cleanup step.
 * @returns {Promise<{skipped: boolean, results: Array}>}
 */
async function syncIdes({ projectRoot, bmadDir, ides, previousSkillIds = [], verbose = false, cleanup = true, silent = false }) {
  const validIdes = (ides || []).filter((ide) => ide && typeof ide === 'string');
  if (validIdes.length === 0) return { skipped: true, results: [] };

  const ideManager = new IdeManager();
  ideManager.setBmadFolderName(path.basename(bmadDir));
  await ideManager.ensureInitialized();

  const results = await ideManager.setupBatch(validIdes, projectRoot, bmadDir, {
    previousSkillIds: new Set(previousSkillIds),
    verbose,
    silent,
  });

  // Mirror Installer._cleanupSkillDirs: skills are self-contained in IDE dirs,
  // so _bmad/ only needs module-level files. Only clean up when every IDE
  // synced successfully — otherwise the source skill dirs are still needed to
  // retry the failed targets.
  const allSucceeded = results.every((r) => r && r.success);
  if (cleanup && allSucceeded) await cleanupBmadSkillDirs(bmadDir);

  return { skipped: false, results };
}

/**
 * Remove skill source directories from _bmad/ after IDE distribution. Reads
 * _config/skill-manifest.csv and removes the parent dir of each listed SKILL.md
 * (skipping any already gone). Non-skill module files are left untouched.
 * Shared with Installer._cleanupSkillDirs so there is one implementation.
 * @param {string} bmadDir
 */
async function cleanupBmadSkillDirs(bmadDir) {
  const csv = require('csv-parse/sync');
  const csvPath = path.join(bmadDir, '_config', 'skill-manifest.csv');
  if (!(await fs.pathExists(csvPath))) return;

  const csvContent = await fs.readFile(csvPath, 'utf8');
  const records = csv.parse(csvContent, { columns: true, skip_empty_lines: true });
  const bmadFolderName = path.basename(bmadDir);
  const bmadPrefix = bmadFolderName + '/';

  const bmadRoot = path.resolve(bmadDir);
  for (const record of records) {
    if (!record.path) continue;
    const relativePath = record.path.startsWith(bmadPrefix) ? record.path.slice(bmadPrefix.length) : record.path;
    const skillFilePath = path.resolve(bmadDir, relativePath);
    // Containment guard: a malformed CSV row (absolute path or `../`) must not
    // let cleanup escape _bmad/ and remove arbitrary directories.
    if (skillFilePath !== bmadRoot && !skillFilePath.startsWith(bmadRoot + path.sep)) continue;
    const sourceDir = path.dirname(skillFilePath);
    if (sourceDir === bmadRoot) continue;
    if (await fs.pathExists(sourceDir)) {
      await fs.remove(sourceDir);
      await removeEmptyParents(path.dirname(sourceDir), bmadDir);
    }
  }
}

/**
 * Remove now-empty parent directories left behind after skill dir cleanup.
 * Walks up from dir, stopping at (and never removing) bmadDir. Best-effort:
 * a directory that vanishes or fills in mid-walk just ends the walk.
 * @param {string} dir - Directory to start walking up from
 * @param {string} bmadDir - BMAD installation directory (boundary)
 */
async function removeEmptyParents(dir, bmadDir) {
  let current = dir;
  while (true) {
    // Path-boundary check (not a string prefix, so siblings like _bmad2 don't match).
    const rel = path.relative(bmadDir, current);
    if (rel === '' || rel.startsWith('..') || path.isAbsolute(rel)) break;
    try {
      const entries = await fs.readdir(current);
      if (entries.length > 0) break;
      await fs.rmdir(current);
    } catch {
      break;
    }
    current = path.dirname(current);
  }
}

/**
 * Read the selected IDE platform codes from _config/manifest.yaml.
 * @param {string} bmadDir
 * @returns {Promise<string[]>}
 */
async function readSelectedIdes(bmadDir) {
  const yaml = require('yaml');
  const manifestPath = path.join(bmadDir, '_config', 'manifest.yaml');
  if (!(await fs.pathExists(manifestPath))) return [];
  try {
    const parsed = yaml.parse(await fs.readFile(manifestPath, 'utf8'));
    return Array.isArray(parsed?.ides) ? parsed.ides.filter((i) => i && typeof i === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * End-to-end run used by the CLI command and the shipped bundle: resolve paths,
 * read the chosen IDEs from the manifest, distribute, and report. Returns a
 * process exit code (0 ok, 1 failure, 2 no install).
 *
 * @param {Object} opts
 * @param {string} [opts.directory]  Project dir (default '.').
 * @param {string|string[]} [opts.prune]  canonicalIds to remove (CSV string or array).
 * @param {boolean} [opts.verbose]
 * @param {Object} [opts.logger]  { info, warn, error }
 * @returns {Promise<number>} exit code
 */
async function runIdeSync(opts = {}) {
  const logger = opts.logger || DEFAULT_LOGGER;
  const projectRoot = path.resolve(opts.directory || '.');
  const bmadDir = path.join(projectRoot, BMAD_FOLDER_NAME);

  if (!(await fs.pathExists(bmadDir))) {
    logger.error(`[ide-sync] no BMAD installation (_bmad/) found in ${projectRoot}. Run \`bmad install\` first.`);
    return 2;
  }

  const ides = await readSelectedIdes(bmadDir);
  if (ides.length === 0) {
    logger.info('[ide-sync] no IDEs configured in manifest.yaml — nothing to distribute.');
    return 0;
  }

  const previousSkillIds = normalizeIdList(opts.prune);

  const { results } = await syncIdes({
    projectRoot,
    bmadDir,
    ides,
    previousSkillIds,
    verbose: !!opts.verbose,
    // Standalone path prints its own concise [ide-sync] lines; suppress the
    // engine's interactive-style status output (errors still surface).
    silent: true,
  });

  let failed = 0;
  for (const r of results) {
    if (r.success) {
      logger.info(`[ide-sync] ${r.ide}: ${r.detail || 'configured'}`);
    } else {
      failed++;
      logger.error(`[ide-sync] ${r.ide}: FAILED — ${r.error || 'unknown error'}`);
    }
  }
  return failed > 0 ? 1 : 0;
}

/** Parse a comma-separated string or array of canonicalIds into a clean array. */
function normalizeIdList(value) {
  if (!value) return [];
  const arr = Array.isArray(value) ? value : String(value).split(',');
  return arr.map((s) => String(s).trim()).filter(Boolean);
}

/**
 * argv entry point for the shipped bundle. Parses a tiny flag set and calls
 * runIdeSync. Intentionally dependency-free (no commander) so the bundle stays
 * small and self-contained.
 * @param {string[]} argv  process.argv.slice(2)
 * @returns {Promise<number>} exit code
 */
async function runIdeSyncCli(argv = []) {
  const opts = { directory: '.', prune: '', verbose: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--directory=')) {
      opts.directory = a.slice('--directory='.length);
      continue;
    }
    if (a.startsWith('--prune=')) {
      opts.prune = a.slice('--prune='.length);
      continue;
    }
    switch (a) {
      case '-d':
      case '--directory': {
        opts.directory = argv[++i] ?? '.';
        break;
      }
      case '--prune': {
        opts.prune = argv[++i] ?? '';
        break;
      }
      case '-v':
      case '--verbose': {
        opts.verbose = true;
        break;
      }
      default: {
        break;
      }
    }
  }
  return runIdeSync(opts);
}

module.exports = {
  syncIdes,
  cleanupBmadSkillDirs,
  readSelectedIdes,
  runIdeSync,
  runIdeSyncCli,
};
