const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { glob } = require('glob');
const { loadIgnore } = require('./ignoreRules.js');

const pExecFile = promisify(execFile);

async function isGitRepo(rootDir) {
  try {
    const { stdout } = await pExecFile('git', ['rev-parse', '--is-inside-work-tree'], {
      cwd: rootDir,
    });
    return (
      String(stdout || '')
        .toString()
        .trim() === 'true'
    );
  } catch {
    return false;
  }
}

async function gitListFiles(rootDir) {
  try {
    const { stdout } = await pExecFile('git', ['ls-files', '-co', '--exclude-standard'], {
      cwd: rootDir,
    });
    return String(stdout || '')
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Discover files under rootDir.
 * - Prefer git ls-files when available for speed/correctness
 * - Fallback to glob and apply unified ignore rules
 * @param {string} rootDir
 * @param {object} [options]
 * @param {boolean} [options.preferGit=true]
 * @returns {Promise<string[]>} absolute file paths
 */
async function discoverFiles(rootDir, options = {}) {
  const { preferGit = true } = options;
  const { filter } = await loadIgnore(rootDir);

  // Try git first
  if (preferGit && (await isGitRepo(rootDir))) {
    const relFiles = await gitListFiles(rootDir);
    const filteredRel = relFiles.filter((p) => filter(p));
    return filteredRel.map((p) => path.resolve(rootDir, p));
  }

  // Glob fallback
  const globbed = await glob('**/*', {
    cwd: rootDir,
    nodir: true,
    dot: true,
    follow: false,
  });
  const filteredRel = globbed.filter((p) => filter(p));
  return filteredRel.map((p) => path.resolve(rootDir, p));
}

module.exports = {
  discoverFiles,
};
