/**
 * Drop-in replacement for fs-extra that uses only native Node.js fs.
 *
 * fs-extra routes every call through graceful-fs, whose EMFILE retry queue
 * causes non-deterministic file loss on macOS during bulk copy operations.
 * This module provides the same API surface used by the CLI codebase but
 * backed entirely by `node:fs` and `node:fs/promises` — no third-party
 * wrappers, no retry queues, no silent data loss.
 *
 * Async methods return native promises (from `node:fs/promises`).
 * Sync methods delegate directly to `node:fs`.
 */

const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');

// ── Re-export every native fs member ────────────────────────────────────────
// Callers that use fs.constants, fs.createReadStream, etc. keep working.
module.exports = { ...fs };

// ── Async methods (return promises, like fs-extra) ──────────────────────────

module.exports.readFile = fsp.readFile;
module.exports.writeFile = fsp.writeFile;
module.exports.readdir = fsp.readdir;
module.exports.stat = fsp.stat;
module.exports.access = fsp.access;
module.exports.mkdtemp = fsp.mkdtemp;
module.exports.rename = fsp.rename;
module.exports.realpath = fsp.realpath;
module.exports.rmdir = fsp.rmdir;

/**
 * Recursively ensure a directory exists.
 * @param {string} dirPath
 */
module.exports.ensureDir = async function ensureDir(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
};

/**
 * Check whether a path exists.
 * @param {string} p
 * @returns {Promise<boolean>}
 */
module.exports.pathExists = async function pathExists(p) {
  try {
    await fsp.access(p);
    return true;
  } catch (error) {
    if (error && (error.code === 'ENOENT' || error.code === 'ENOTDIR')) {
      return false;
    }
    throw error;
  }
};

/**
 * Synchronous variant of pathExists.
 * @param {string} p
 * @returns {boolean}
 */
module.exports.pathExistsSync = function pathExistsSync(p) {
  return fs.existsSync(p);
};

/**
 * Recursively copy a directory tree synchronously.
 * @param {string} src  - Source directory
 * @param {string} dest - Destination directory
 * @param {boolean} force - Whether to overwrite existing files
 * @param {Function} [filter] - Optional filter(srcPath) → boolean; return false to skip
 */
function copyDirSync(src, dest, force, filter) {
  if (filter && !filter(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (filter && !filter(srcPath)) continue;
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath, force, filter);
    } else {
      if (!force && fs.existsSync(destPath)) {
        continue;
      }
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Copy a file or directory.
 * @param {string} src
 * @param {string} dest
 * @param {object} [options]
 * @param {boolean} [options.overwrite=true]
 * @param {Function} [options.filter] - Optional filter(srcPath) → boolean; return false to skip
 */
module.exports.copy = async function copy(src, dest, options = {}) {
  const overwrite = options.overwrite !== false;
  const filter = options.filter;

  if (filter && !filter(src)) return;

  const srcStat = await fsp.stat(src);

  if (srcStat.isDirectory()) {
    copyDirSync(src, dest, overwrite, filter);
  } else {
    await fsp.mkdir(path.dirname(dest), { recursive: true });
    if (!overwrite) {
      try {
        await fsp.access(dest);
        return; // dest exists, skip
      } catch {
        // dest doesn't exist, proceed
      }
    }
    fs.copyFileSync(src, dest);
  }
};

/**
 * Recursively remove a file or directory.
 * @param {string} p
 */
module.exports.remove = async function remove(p) {
  fs.rmSync(p, { recursive: true, force: true });
};

/**
 * Move (rename) a file or directory, with cross-device fallback.
 * @param {string} src
 * @param {string} dest
 */
module.exports.move = async function move(src, dest) {
  try {
    await fsp.rename(src, dest);
  } catch (error) {
    if (error.code === 'EXDEV') {
      // Cross-device: copy then remove
      const srcStat = fs.statSync(src);
      if (srcStat.isDirectory()) {
        copyDirSync(src, dest, true);
      } else {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
      }
      fs.rmSync(src, { recursive: true, force: true });
    } else {
      throw error;
    }
  }
};

/**
 * Read and parse a JSON file synchronously.
 * @param {string} filePath
 * @returns {any}
 */
module.exports.readJsonSync = function readJsonSync(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(raw);
};
