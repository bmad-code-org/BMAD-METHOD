const fs = require('fs-extra');
const path = require('node:path');

// Deno/Node compatibility: explicitly import process
const process = require('node:process');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const execFileAsync = promisify(execFile);

// Simple memoization across calls (keyed by realpath of startDir)
const _cache = new Map();

async function _tryRun(cmd, args, cwd, timeoutMs = 500) {
  try {
    const { stdout } = await execFileAsync(cmd, args, {
      cwd,
      timeout: timeoutMs,
      windowsHide: true,
      maxBuffer: 1024 * 1024,
    });
    const out = String(stdout || '').trim();
    return out || null;
  } catch {
    return null;
  }
}

async function _detectVcsTopLevel(startDir) {
  // Run common VCS root queries in parallel; ignore failures
  const gitP = _tryRun('git', ['rev-parse', '--show-toplevel'], startDir);
  const hgP = _tryRun('hg', ['root'], startDir);
  const svnP = (async () => {
    const show = await _tryRun('svn', ['info', '--show-item', 'wc-root'], startDir);
    if (show) return show;
    const info = await _tryRun('svn', ['info'], startDir);
    if (info) {
      const line = info
        .split(/\r?\n/)
        .find((l) => l.toLowerCase().startsWith('working copy root path:'));
      if (line) return line.split(':').slice(1).join(':').trim();
    }
    return null;
  })();
  const [git, hg, svn] = await Promise.all([gitP, hgP, svnP]);
  return git || hg || svn || null;
}

/**
 * Attempt to find the project root by walking up from startDir.
 * Uses a robust, prioritized set of ecosystem markers (VCS > workspaces/monorepo > lock/build > language config).
 * Also recognizes package.json with "workspaces" as a workspace root.
 * You can augment markers via env PROJECT_ROOT_MARKERS as a comma-separated list of file/dir names.
 * @param {string} startDir
 * @returns {Promise<string|null>} project root directory or null if not found
 */
async function findProjectRoot(startDir) {
  try {
    // Resolve symlinks for robustness (e.g., when invoked from a symlinked path)
    let dir = path.resolve(startDir);
    try {
      dir = await fs.realpath(dir);
    } catch {
      // ignore if realpath fails; continue with resolved path
    }
    const startKey = dir; // preserve starting point for caching
    if (_cache.has(startKey)) return _cache.get(startKey);
    const fsRoot = path.parse(dir).root;

    // Helper to safely check for existence
    const exists = (p) => fs.pathExists(p);

    // Build checks: an array of { makePath: (dir) => string, weight }
    const checks = [];

    const add = (rel, weight) => {
      const makePath = (d) => (Array.isArray(rel) ? path.join(d, ...rel) : path.join(d, rel));
      checks.push({ makePath, weight });
    };

    // Highest priority: explicit sentinel markers
    add('.project-root', 110);
    add('.workspace-root', 110);
    add('.repo-root', 110);

    // Highest priority: VCS roots
    add('.git', 100);
    add('.hg', 95);
    add('.svn', 95);

    // Monorepo/workspace indicators
    add('pnpm-workspace.yaml', 90);
    add('lerna.json', 90);
    add('turbo.json', 90);
    add('nx.json', 90);
    add('rush.json', 90);
    add('go.work', 90);
    add('WORKSPACE', 90);
    add('WORKSPACE.bazel', 90);
    add('MODULE.bazel', 90);
    add('pants.toml', 90);

    // Lockfiles and package-manager/top-level locks
    add('yarn.lock', 85);
    add('pnpm-lock.yaml', 85);
    add('package-lock.json', 85);
    add('bun.lockb', 85);
    add('Cargo.lock', 85);
    add('composer.lock', 85);
    add('poetry.lock', 85);
    add('Pipfile.lock', 85);
    add('Gemfile.lock', 85);

    // Build-system root indicators
    add('settings.gradle', 80);
    add('settings.gradle.kts', 80);
    add('gradlew', 80);
    add('pom.xml', 80);
    add('build.sbt', 80);
    add(['project', 'build.properties'], 80);

    // Language/project config markers
    add('deno.json', 75);
    add('deno.jsonc', 75);
    add('pyproject.toml', 75);
    add('Pipfile', 75);
    add('requirements.txt', 75);
    add('go.mod', 75);
    add('Cargo.toml', 75);
    add('composer.json', 75);
    add('mix.exs', 75);
    add('Gemfile', 75);
    add('CMakeLists.txt', 75);
    add('stack.yaml', 75);
    add('cabal.project', 75);
    add('rebar.config', 75);
    add('pubspec.yaml', 75);
    add('flake.nix', 75);
    add('shell.nix', 75);
    add('default.nix', 75);
    add('.tool-versions', 75);
    add('package.json', 74); // generic Node project (lower than lockfiles/workspaces)

    // Changesets
    add(['.changeset', 'config.json'], 70);
    add('.changeset', 70);

    // Custom markers via env (comma-separated names)
    if (process.env.PROJECT_ROOT_MARKERS) {
      for (const name of process.env.PROJECT_ROOT_MARKERS.split(',')
        .map((s) => s.trim())
        .filter(Boolean)) {
        add(name, 72);
      }
    }

    /** Check for package.json with "workspaces" */
    const hasWorkspacePackageJson = async (d) => {
      const pkgPath = path.join(d, 'package.json');
      if (!(await exists(pkgPath))) return false;
      try {
        const raw = await fs.readFile(pkgPath, 'utf8');
        const pkg = JSON.parse(raw);
        return Boolean(pkg && pkg.workspaces);
      } catch {
        return false;
      }
    };

    let best = null; // { dir, weight }

    // Try to detect VCS toplevel once up-front; treat as authoritative slightly above .git marker
    const vcsTop = await _detectVcsTopLevel(dir);
    if (vcsTop) {
      best = { dir: vcsTop, weight: 101 };
    }

    while (true) {
      // Special check: package.json with "workspaces"
      if ((await hasWorkspacePackageJson(dir)) && (!best || 90 >= best.weight))
        best = { dir, weight: 90 };

      // Evaluate all other checks in parallel
      const results = await Promise.all(
        checks.map(async (c) => ({ c, ok: await exists(c.makePath(dir)) })),
      );

      for (const { c, ok } of results) {
        if (!ok) continue;
        if (!best || c.weight >= best.weight) {
          best = { dir, weight: c.weight };
        }
      }

      if (dir === fsRoot) break;
      dir = path.dirname(dir);
    }

    const out = best ? best.dir : null;
    _cache.set(startKey, out);
    return out;
  } catch {
    return null;
  }
}

module.exports = { findProjectRoot };
