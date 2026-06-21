import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { EXIT, BmadModuleError } from './exit.mjs';

const execFileP = promisify(execFile);
const GIT_ENV = { ...process.env, GIT_TERMINAL_PROMPT: '0' };

// Shared clone cache for community modules — mirrors
// tools/installer/modules/custom-module-manager.js (getCacheDir + cloneRepo) so
// a skill-driven install reuses the same on-disk cache the CLI installer
// maintains. node:-only (execFile, not execSync+fs-extra); npm deps are NOT
// installed here — the skill installs them in _bmad/<code>/ after the copy.

export function getCacheDir() {
  return path.join(os.homedir(), '.bmad', 'cache', 'custom-modules');
}

// A ref must be a tag/branch name git can take as a positional argument. Reject
// option-like values so a crafted `--upload-pack=…` ref can't reach git.
function assertSafeRef(ref) {
  if (!/^[\w.+/][\w.\-+/]*$/.test(ref)) {
    throw new BmadModuleError(EXIT.USAGE, `unsafe git ref: ${ref}`);
  }
  return ref;
}

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readJsonSafe(p) {
  try {
    return JSON.parse(await fs.readFile(p, 'utf8'));
  } catch {
    return null;
  }
}

async function git(args, cwd) {
  return execFileP('git', args, { cwd, env: GIT_ENV, timeout: 120_000 });
}

async function revParseHead(cwd) {
  try {
    const { stdout } = await execFileP('git', ['rev-parse', 'HEAD'], { cwd });
    return stdout.trim();
  } catch {
    return null;
  }
}

async function defaultBranch(cwd) {
  try {
    const { stdout } = await execFileP('git', ['symbolic-ref', '--short', 'refs/remotes/origin/HEAD'], { cwd });
    return stdout.trim().replace(/^origin\//, '') || 'main';
  } catch {
    return 'main';
  }
}

// Ensure the repo behind `descriptor` is cloned/refreshed in the shared cache at
// the requested `ref` (a tag/branch, or null for the default branch). Returns
// { repoDir, sha, ref }. Reuses an existing clone when its recorded version
// matches; re-clones on a version change; on a fetch failure against an existing
// clone, keeps the stale copy and warns (so installs work offline).
export async function ensureCachedRepo(descriptor, ref = null) {
  if (descriptor.kind !== 'git') throw new BmadModuleError(EXIT.USAGE, `ensureCachedRepo requires a git source`);
  if (!descriptor.cacheKey) throw new BmadModuleError(EXIT.USAGE, `git source has no cacheKey: ${descriptor.rawInput}`);
  const effectiveRef = ref;
  if (effectiveRef) assertSafeRef(effectiveRef);

  const repoDir = path.join(getCacheDir(), ...descriptor.cacheKey.split('/'));
  await fs.mkdir(path.dirname(repoDir), { recursive: true });

  // Existing cache at a different version → re-clone from scratch.
  if (await pathExists(repoDir)) {
    const meta = await readJsonSafe(path.join(repoDir, '.bmad-source.json'));
    const cachedVersion = meta?.version || null;
    if (effectiveRef !== cachedVersion) {
      await fs.rm(repoDir, { recursive: true, force: true });
    }
  }

  if (await pathExists(repoDir)) {
    // Refresh the existing clone (same version as before).
    try {
      await git(['fetch', 'origin', '--depth', '1'], repoDir);
      if (effectiveRef) {
        await git(['fetch', '--depth', '1', 'origin', effectiveRef, '--no-tags'], repoDir);
        await git(['checkout', '--quiet', 'FETCH_HEAD'], repoDir);
      } else {
        const branch = await defaultBranch(repoDir);
        assertSafeRef(branch);
        await git(['fetch', '--depth', '1', 'origin', branch], repoDir);
        await git(['reset', '--hard', `origin/${branch}`], repoDir);
      }
    } catch (e) {
      // Remote unreachable — keep the cached copy so the install still works.
      process.stderr.write(
        `[bmad-module] warning: could not refresh ${descriptor.displayName} (${e.stderr || e.message}). Using cached copy.\n`,
      );
    }
  } else {
    // Fresh clone.
    const args = ['clone', '--depth', '1'];
    if (effectiveRef) args.push('--branch', effectiveRef);
    args.push(descriptor.url, repoDir);
    try {
      await git(args);
    } catch (e) {
      await fs.rm(repoDir, { recursive: true, force: true }).catch(() => {});
      const refSuffix = effectiveRef ? `@${effectiveRef}` : '';
      throw new BmadModuleError(EXIT.NETWORK_FAILURE, `git clone failed for ${descriptor.url}${refSuffix}: ${e.stderr || e.message}`);
    }
  }

  const sha = await revParseHead(repoDir);
  const branchForMeta = effectiveRef ? null : await defaultBranch(repoDir);
  const now = new Date().toISOString();
  await fs.writeFile(
    path.join(repoDir, '.bmad-source.json'),
    JSON.stringify(
      {
        cloneUrl: descriptor.url,
        cacheKey: descriptor.cacheKey,
        displayName: descriptor.displayName,
        version: effectiveRef || null,
        rawInput: descriptor.rawInput,
        sha,
        clonedAt: now,
      },
      null,
      2,
    ),
    'utf8',
  );
  await fs.writeFile(
    path.join(repoDir, '.bmad-channel.json'),
    JSON.stringify(
      {
        channel: effectiveRef ? 'pinned' : 'next',
        version: effectiveRef || branchForMeta || 'main',
        sha,
        writtenAt: now,
      },
      null,
      2,
    ),
    'utf8',
  );

  return { repoDir, sha, ref: effectiveRef };
}
