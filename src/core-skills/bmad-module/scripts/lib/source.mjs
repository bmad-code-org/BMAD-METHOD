import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { copyDir } from './fs-safe.mjs';
import { ensureCachedRepo } from './cache.mjs';
import { EXIT, BmadModuleError } from './exit.mjs';

const GH_SHORT_RE = /^[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9._-]+$/;
// A `@<tag-or-branch>` tail is ref-shaped (no `:` so we never eat the auth
// segment of `git@host:…`). Raw commit SHAs are not supported — `git clone
// --branch` can't take them; pass a tag/branch or check the SHA out manually.
const REF_TAIL_RE = /^[\w.\-+/]+$/;

// Normalize a `<source>` argument from the CLI into a descriptor:
//   { kind: 'local' | 'git', path?, url?, subdir, ref, cacheKey, displayName, rawInput }
// `ref` is a branch/tag extracted from an explicit `@<ref>` suffix or an
// embedded browser-URL path (`…/tree/<ref>`); `subdir` is a module location
// inside the repo extracted from a deep-path / `?path=` URL. Accepts:
//   - owner/repo[@ref]                          → GitHub HTTPS
//   - https://…, http://…, git@…, ssh://, git:// → as given (ref/subdir parsed)
//   - file://path                                → local
//   - relative or absolute path                  → local (if it exists on disk)
// Mirrors tools/installer/modules/custom-module-manager.js#parseSource, adapted
// to the skill's throw-on-invalid contract and node:-only deps; keeps the skill's
// `owner/repo` shorthand, which the installer (URL/marketplace-driven) lacks.
export function parseSource(input) {
  if (typeof input !== 'string' || !input.trim()) {
    throw new BmadModuleError(EXIT.USAGE, `source is required`);
  }
  const rawInput = input.trim();

  // Split off an optional @<ref> suffix, but only when the part before the `@`
  // looks like a complete repo reference — so we don't disturb `git@host:…` or
  // an `@` that's part of the path.
  let body = rawInput;
  let ref = null;
  const lastAt = rawInput.lastIndexOf('@');
  if (lastAt > 0) {
    const candidate = rawInput.slice(lastAt + 1);
    const before = rawInput.slice(0, lastAt);
    if (REF_TAIL_RE.test(candidate) && !candidate.includes(':')) {
      const beforeLooksLikeRepo =
        before.startsWith('/') ||
        before.startsWith('./') ||
        before.startsWith('../') ||
        before.startsWith('~') ||
        before.startsWith('file://') ||
        /^(?:https?|ssh|git):\/\//i.test(before) ||
        /^git@[^:]+:.+/.test(before) ||
        GH_SHORT_RE.test(before);
      if (beforeLooksLikeRepo) {
        ref = candidate;
        body = before;
      }
    }
  }

  if (body.startsWith('file://')) {
    if (ref) throw new BmadModuleError(EXIT.USAGE, `local paths do not support @ref suffixes`);
    const p = decodeURI(body.slice('file://'.length));
    return localDescriptor(path.resolve(p), p, rawInput);
  }

  // Local path: starts with /, ./, ../, or ~.
  if (body.startsWith('/') || body.startsWith('./') || body.startsWith('../') || body.startsWith('~')) {
    if (ref) throw new BmadModuleError(EXIT.USAGE, `local paths do not support @ref suffixes`);
    const expanded = body.startsWith('~') ? path.join(os.homedir(), body.slice(1)) : body;
    return localDescriptor(path.resolve(expanded), body, rawInput);
  }

  // SSH: git@host:owner/repo[.git]
  const sshMatch = body.match(/^git@([^:]+):(.+?)\/([^/.]+?)(?:\.git)?$/);
  if (sshMatch) {
    const [, host, owner, repo] = sshMatch;
    return {
      kind: 'git',
      url: body,
      subdir: null,
      ref,
      cacheKey: `${host}/${owner}/${repo}`,
      displayName: `${owner}/${repo}`,
      rawInput,
    };
  }

  // HTTP(S) / ssh:// / git:// URLs — parse with the URL API so any host, nested
  // group, dotted repo name, or browse-link shape is handled host-agnostically.
  if (/^(?:https?|ssh|git):\/\//i.test(body)) {
    return parseUrlDescriptor(body, ref, rawInput);
  }

  // owner/repo shorthand → GitHub HTTPS.
  if (GH_SHORT_RE.test(body)) {
    return {
      kind: 'git',
      url: `https://github.com/${body}`,
      subdir: null,
      ref,
      cacheKey: `github.com/${body}`,
      displayName: body,
      rawInput,
    };
  }

  throw new BmadModuleError(EXIT.USAGE, `not a valid module source (owner/repo, git URL, or local path): ${rawInput}`);
}

function localDescriptor(absPath, displayName, rawInput) {
  return { kind: 'local', path: absPath, subdir: null, ref: null, cacheKey: null, displayName, rawInput };
}

// Browser-style deep paths that embed a ref (branch/tag/commit) and optional
// subdirectory, across hosts:
//   GitHub  /<repo>/tree|blob/<ref>[/<subdir>]
//   GitLab  /<repo>/-/tree|blob/<ref>[/<subdir>]
//   Gitea   /<repo>/src/[branch|commit|tag/]<ref>[/<subdir>]
// Group 1 = repo path prefix, 2 = ref, 3 = subdir (optional).
const DEEP_PATH_PATTERNS = [
  /^(.+?)\/(?:-\/)?(?:tree|blob)\/([^/]+)(?:\/(.+))?$/,
  /^(.+?)\/src\/(?:branch\/|commit\/|tag\/)?([^/]+)(?:\/(.+))?$/,
];

function parseUrlDescriptor(body, refFromSuffix, rawInput) {
  let url;
  try {
    url = new URL(body);
  } catch {
    url = null;
  }
  if (!url || !url.host) {
    throw new BmadModuleError(EXIT.USAGE, `not a valid Git URL: ${rawInput}`);
  }

  const host = url.host;
  let repoPath = url.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  let subdir = null;
  let urlRef = null;

  for (const pattern of DEEP_PATH_PATTERNS) {
    const m = repoPath.match(pattern);
    if (m) {
      repoPath = m[1];
      if (m[2]) urlRef = m[2];
      if (m[3]) {
        const cleaned = m[3].replace(/\/+$/, '');
        if (cleaned) subdir = cleaned;
      }
      break;
    }
  }

  // Some hosts use ?path=/subdir on browse links.
  if (!subdir) {
    const pathParam = url.searchParams.get('path');
    if (pathParam) {
      const cleaned = pathParam.replace(/^\/+/, '').replace(/\/+$/, '');
      if (cleaned) subdir = cleaned;
    }
  }

  const repoPathClean = repoPath.replace(/\.git$/i, '');
  if (!repoPathClean) {
    throw new BmadModuleError(EXIT.USAGE, `not a valid Git URL: ${rawInput}`);
  }

  const segments = repoPathClean.split('/').filter(Boolean);
  const displayName = segments.length >= 2 ? `${segments.at(-2)}/${segments.at(-1)}` : segments.at(-1);

  return {
    kind: 'git',
    url: `${url.protocol}//${host}/${repoPathClean}`,
    subdir,
    // Explicit @ref suffix wins over an embedded /tree/<ref> path segment.
    ref: refFromSuffix || urlRef || null,
    cacheKey: `${host}/${repoPathClean}`,
    displayName,
    rawInput,
  };
}

// Files that should never be staged into _bmad/<code>/ from a source tree.
const STAGE_IGNORE = (rel) =>
  rel === '.git' ||
  rel.startsWith('.git/') ||
  rel === 'node_modules' ||
  rel.startsWith('node_modules/') ||
  rel === '.bmad-source.json' ||
  rel === '.bmad-channel.json';

// Resolve a parsed descriptor into a usable source directory on disk.
//
// Always returns a throwaway temp working copy so the install pipeline can write
// into it (e.g. synthesized module.yaml for legacy strategy 5) and stage from it
// without mutating the user's tree or the shared clone cache.
//   - local: copies the directory into the temp working copy.
//   - git: ensures the repo is in the shared cache (~/.bmad/cache/custom-modules),
//     then copies the module root (the subdir if the source URL named one) out of
//     the cache into the temp working copy.
//
// Returns { dir, sha, ref, cleanup } where `sha`/`ref` are null for local
// sources and `cleanup()` removes the temp working copy (never the cache).
export async function materializeSource(descriptor, opts = {}) {
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-module-'));
  const dir = path.join(tmpRoot, 'src');
  const cleanup = () => fs.rm(tmpRoot, { recursive: true, force: true });

  if (descriptor.kind === 'local') {
    const srcStat = await fs.stat(descriptor.path).catch(() => null);
    if (!srcStat || !srcStat.isDirectory()) {
      await cleanup();
      throw new BmadModuleError(EXIT.USAGE, `local source not a directory: ${descriptor.path}`);
    }
    await copyDir(descriptor.path, dir, STAGE_IGNORE);
    return { dir, sha: null, ref: null, cleanup };
  }

  // git — explicit --ref/resolved channel wins over a ref parsed from the source.
  const ref = opts.ref ?? descriptor.ref ?? null;
  let cached;
  try {
    cached = await ensureCachedRepo(descriptor, ref);
  } catch (e) {
    await cleanup();
    throw e;
  }

  const moduleRoot = descriptor.subdir ? path.join(cached.repoDir, descriptor.subdir) : cached.repoDir;
  const rootStat = await fs.stat(moduleRoot).catch(() => null);
  if (!rootStat || !rootStat.isDirectory()) {
    await cleanup();
    throw new BmadModuleError(EXIT.USAGE, `subdirectory "${descriptor.subdir}" not found in ${descriptor.displayName}`);
  }

  await copyDir(moduleRoot, dir, STAGE_IGNORE);
  return { dir, sha: cached.sha, ref: cached.ref, cleanup };
}
