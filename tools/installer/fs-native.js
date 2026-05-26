// Drop-in replacement for fs-extra using native node:fs APIs.
// Eliminates graceful-fs monkey-patching that causes non-deterministic
// file loss during multi-module installs on macOS (issue #1779).
const fsp = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');

async function pathExists(p) {
  try {
    await fsp.access(p);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

async function remove(p) {
  await fsp.rm(p, { recursive: true, force: true });
}

async function copy(src, dest, options = {}) {
  const filterFn = options.filter;
  const overwrite = options.overwrite !== false;
  const srcStat = await fsp.stat(src);

  if (srcStat.isFile()) {
    if (filterFn && !(await filterFn(src, dest))) return;
    await fsp.mkdir(path.dirname(dest), { recursive: true });
    if (!overwrite) {
      try {
        await fsp.access(dest);
        if (options.errorOnExist) throw new Error(`${dest} already exists`);
        return;
      } catch (error) {
        if (error.message.includes('already exists')) throw error;
      }
    }
    await fsp.copyFile(src, dest);
    return;
  }

  if (srcStat.isDirectory()) {
    if (filterFn && !(await filterFn(src, dest))) return;
    await fsp.mkdir(dest, { recursive: true });
    const entries = await fsp.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
      await copy(path.join(src, entry.name), path.join(dest, entry.name), options);
    }
  }
}

async function move(src, dest) {
  try {
    await fsp.rename(src, dest);
  } catch (error) {
    if (error.code === 'EXDEV') {
      await copy(src, dest);
      await fsp.rm(src, { recursive: true, force: true });
    } else {
      throw error;
    }
  }
}

function readJsonSync(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

async function writeJson(p, data, options = {}) {
  const spaces = options.spaces ?? 2;
  await fsp.writeFile(p, JSON.stringify(data, null, spaces) + '\n', 'utf8');
}

module.exports = {
  // Native async (node:fs/promises)
  readFile: fsp.readFile,
  writeFile: fsp.writeFile,
  stat: fsp.stat,
  readdir: fsp.readdir,
  access: fsp.access,
  realpath: fsp.realpath,
  rename: fsp.rename,
  rmdir: fsp.rmdir,
  unlink: fsp.unlink,
  chmod: fsp.chmod,
  mkdir: fsp.mkdir,
  mkdtemp: fsp.mkdtemp,
  copyFile: fsp.copyFile,
  rm: fsp.rm,

  // fs-extra compatible helpers (native implementations)
  pathExists,
  ensureDir,
  remove,
  copy,
  move,
  readJsonSync,
  writeJson,

  // Sync methods from core node:fs
  existsSync: fs.existsSync.bind(fs),
  readFileSync: fs.readFileSync.bind(fs),
  writeFileSync: fs.writeFileSync.bind(fs),
  statSync: fs.statSync.bind(fs),
  accessSync: fs.accessSync.bind(fs),
  readdirSync: fs.readdirSync.bind(fs),
  createReadStream: fs.createReadStream.bind(fs),
  pathExistsSync: fs.existsSync.bind(fs),

  // Constants
  constants: fs.constants,
};
