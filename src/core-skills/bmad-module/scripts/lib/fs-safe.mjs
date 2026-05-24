import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

// Resolve `declared` as a path inside `rootAbs`. Rejects absolute paths,
// `..` segments, and symlink escapes. Returns the absolute path or null.
export function safePathInsideRoot(rootAbs, declared) {
  if (typeof declared !== 'string' || declared === '') return null;
  if (path.isAbsolute(declared)) return null;
  if (declared.split(/[\\/]/).includes('..')) return null;
  const resolved = path.resolve(rootAbs, declared);
  if (resolved !== rootAbs && !resolved.startsWith(rootAbs + path.sep)) return null;
  if (fs.existsSync(resolved)) {
    try {
      const real = fs.realpathSync(resolved);
      const realRoot = fs.realpathSync(rootAbs);
      if (real !== realRoot && !real.startsWith(realRoot + path.sep)) return null;
    } catch {
      return null;
    }
  }
  return resolved;
}

// SHA-256 of a file's bytes, returned as a hex string. Returns null on
// I/O failure — callers should treat a null hash as "file unreadable".
export async function sha256File(filePath) {
  try {
    const buf = await fsp.readFile(filePath);
    return crypto.createHash('sha256').update(buf).digest('hex');
  } catch {
    return null;
  }
}

// Recursively copy `srcDir` into `destDir`, creating destDir first.
// Returns an array of relative file paths (POSIX-style) actually copied.
// Skips entries matched by `shouldSkip(relPath)` which receives a POSIX
// path relative to srcDir.
export async function copyDir(srcDir, destDir, shouldSkip = () => false) {
  await fsp.mkdir(destDir, { recursive: true });
  const copied = [];
  async function walk(rel) {
    const absSrc = path.join(srcDir, rel);
    const entries = await fsp.readdir(absSrc, { withFileTypes: true });
    for (const entry of entries) {
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (shouldSkip(childRel)) continue;
      const childSrc = path.join(srcDir, childRel);
      const childDest = path.join(destDir, childRel);
      if (entry.isDirectory()) {
        await fsp.mkdir(childDest, { recursive: true });
        await walk(childRel);
      } else if (entry.isFile()) {
        await fsp.mkdir(path.dirname(childDest), { recursive: true });
        await fsp.copyFile(childSrc, childDest);
        copied.push(childRel);
      }
      // Symlinks are skipped — install staging never preserves them.
    }
  }
  await walk('');
  return copied;
}

// Atomically replace `targetDir` with `stagedDir` contents. Best effort —
// not truly atomic, but minimizes the inconsistent window.
//
// `stagedDir` usually lives under the OS temp dir, which is frequently a
// separate filesystem (e.g. tmpfs on /tmp) from the target. rename() cannot
// move across filesystems and throws EXDEV there, so we first land the staged
// tree onto the target's own filesystem as a sibling — by rename when they
// already share a filesystem, by copy when they don't — and then rename that
// sibling into place, which is always an intra-filesystem atomic swap.
export async function atomicSwapDir(stagedDir, targetDir) {
  const parent = path.dirname(targetDir);
  await fsp.mkdir(parent, { recursive: true });
  const sibling = path.join(parent, `.${path.basename(targetDir)}.bmad-tmp-${crypto.randomBytes(6).toString('hex')}`);
  try {
    try {
      await fsp.rename(stagedDir, sibling);
    } catch (e) {
      if (e.code !== 'EXDEV') throw e;
      await copyDir(stagedDir, sibling);
      await fsp.rm(stagedDir, { recursive: true, force: true });
    }
    await fsp.rm(targetDir, { recursive: true, force: true });
    await fsp.rename(sibling, targetDir);
  } catch (e) {
    await fsp.rm(sibling, { recursive: true, force: true });
    throw e;
  }
}

// Remove empty parent directories upward until a non-empty one is hit,
// stopping at `stopAt` (exclusive). Used after file deletion.
export async function pruneEmptyDirs(startDir, stopAt) {
  let dir = path.resolve(startDir);
  const stop = path.resolve(stopAt);
  while (dir !== stop && dir.startsWith(stop + path.sep)) {
    let entries;
    try {
      entries = await fsp.readdir(dir);
    } catch {
      return;
    }
    if (entries.length > 0) return;
    await fsp.rmdir(dir);
    dir = path.dirname(dir);
  }
}
