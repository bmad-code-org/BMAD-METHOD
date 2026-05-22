import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { copyDir } from './fs-safe.mjs';
import { EXIT, BmadModuleError } from './exit.mjs';

const execFileP = promisify(execFile);

const GH_SHORT_RE = /^[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9._-]+$/;

// Normalize a `<source>` argument from the CLI into a descriptor:
//   { kind: 'local' | 'git', path?, url?, displayName, rawInput }
// Accepts:
//   - owner/repo                  → GitHub HTTPS
//   - https://… or git@… URL      → as given
//   - file://path                 → local
//   - relative or absolute path   → local (if it exists on disk)
export function parseSource(input) {
  if (typeof input !== 'string' || !input.trim()) {
    throw new BmadModuleError(EXIT.USAGE, `source is required`);
  }
  const raw = input.trim();

  if (raw.startsWith('file://')) {
    const p = decodeURI(raw.slice('file://'.length));
    return { kind: 'local', path: path.resolve(p), displayName: p, rawInput: raw };
  }

  if (
    raw.startsWith('https://') ||
    raw.startsWith('http://') ||
    raw.startsWith('git@') ||
    raw.startsWith('ssh://') ||
    raw.startsWith('git://')
  ) {
    return { kind: 'git', url: raw, displayName: raw, rawInput: raw };
  }

  if (GH_SHORT_RE.test(raw)) {
    const url = `https://github.com/${raw}`;
    return { kind: 'git', url, displayName: raw, rawInput: raw };
  }

  // Treat anything else as a local path.
  return { kind: 'local', path: path.resolve(raw), displayName: raw, rawInput: raw };
}

// Resolve a parsed descriptor into a usable source directory on disk.
// For local sources, copies into a fresh temp dir so installation can stage
// without touching the user's working tree. For git, shallow-clones into a
// temp dir (no shared cache for v1 — keeps install deterministic and avoids
// stale checkouts).
//
// Returns { dir, sha, ref, cleanup } where `sha` and `ref` are null for
// local sources and `cleanup()` removes the temp dir.
export async function materializeSource(descriptor, opts = {}) {
  const { ref = null } = opts;
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-module-'));

  if (descriptor.kind === 'local') {
    const srcStat = await fs.stat(descriptor.path).catch(() => null);
    if (!srcStat || !srcStat.isDirectory()) {
      throw new BmadModuleError(EXIT.USAGE, `local source not a directory: ${descriptor.path}`);
    }
    const dir = path.join(tmpRoot, 'src');
    await copyDir(
      descriptor.path,
      dir,
      (rel) => rel === '.git' || rel.startsWith('.git/') || rel === 'node_modules' || rel.startsWith('node_modules/'),
    );
    return {
      dir,
      sha: null,
      ref: null,
      cleanup: () => fs.rm(tmpRoot, { recursive: true, force: true }),
    };
  }

  // git
  const dir = path.join(tmpRoot, 'src');
  const args = ['clone', '--depth', '1'];
  if (ref) args.push('--branch', ref);
  args.push(descriptor.url, dir);
  try {
    await execFileP('git', args, { timeout: 120_000 });
  } catch (e) {
    await fs.rm(tmpRoot, { recursive: true, force: true });
    throw new BmadModuleError(EXIT.NETWORK_FAILURE, `git clone failed: ${e.stderr || e.message}`);
  }

  let sha = null;
  try {
    const { stdout } = await execFileP('git', ['rev-parse', 'HEAD'], { cwd: dir });
    sha = stdout.trim();
  } catch {
    // sha unknown — non-fatal, manifest will show null
  }

  return {
    dir,
    sha,
    ref,
    cleanup: () => fs.rm(tmpRoot, { recursive: true, force: true }),
  };
}
