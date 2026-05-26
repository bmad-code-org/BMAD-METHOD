const https = require('node:https');
const semver = require('semver');

/**
 * Channel resolver for external and community modules.
 *
 * A "channel" is the resolution strategy that decides which ref of a module
 * to clone when no explicit version is supplied:
 *   - stable: highest pure-semver git tag (excludes -alpha/-beta/-rc)
 *   - next:   main branch HEAD
 *   - pinned: an explicit user-supplied tag
 *
 * This module is pure (no prompts, no git, no filesystem). It only talks to
 * the GitHub tags API and performs semver math. Clone logic lives in the
 * module managers that call resolveChannel().
 */

const GITHUB_API_BASE = 'https://api.github.com';
const DEFAULT_TIMEOUT_MS = 10_000;
const USER_AGENT = 'bmad-method-installer';

// Per-process cache: { 'owner/repo' => string[] sorted desc } of pure-semver tags.
const tagCache = new Map();

/**
 * Parse a GitHub repo URL into { owner, repo }. Returns null if the URL is
 * not a GitHub URL the resolver can handle.
 */
function parseGitHubRepo(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url
    .trim()
    .replace(/\.git$/, '')
    .replace(/\/$/, '');

  // https://github.com/owner/repo
  const httpsMatch = trimmed.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)(?:\/.*)?$/i);
  if (httpsMatch) return { owner: httpsMatch[1], repo: httpsMatch[2] };

  // git@github.com:owner/repo
  const sshMatch = trimmed.match(/^git@github\.com:([^/]+)\/([^/]+)$/i);
  if (sshMatch) return { owner: sshMatch[1], repo: sshMatch[2] };

  return null;
}

function fetchJson(url, { timeout = DEFAULT_TIMEOUT_MS } = {}) {
  const headers = {
    'User-Agent': USER_AGENT,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers, timeout }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          const err = new Error(`GitHub API ${res.statusCode} for ${url}: ${body.slice(0, 200)}`);
          err.statusCode = res.statusCode;
          return reject(err);
        }
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(new Error(`Failed to parse GitHub response: ${error.message}`));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`GitHub API request timed out: ${url}`));
    });
  });
}

/**
 * Strip a leading 'v' and return a valid semver string, or null if the tag
 * is not valid semver or is a prerelease (contains -alpha/-beta/-rc/etc.).
 */
function normalizeStableTag(tagName) {
  if (typeof tagName !== 'string') return null;
  const stripped = tagName.startsWith('v') ? tagName.slice(1) : tagName;
  const valid = semver.valid(stripped);
  if (!valid) return null;
  // Exclude prereleases. semver.prerelease returns null for pure releases.
  if (semver.prerelease(valid)) return null;
  return valid;
}

/**
 * Fetch pure-semver tags (highest first) from a GitHub repo.
 * Cached per-process per owner/repo.
 *
 * @returns {Promise<Array<{tag: string, version: string}>>}
 *   tag is the original ref name (e.g. "v1.7.0"), version is the cleaned
 *   semver (e.g. "1.7.0").
 */
async function fetchStableTags(owner, repo, { timeout } = {}) {
  const cacheKey = `${owner}/${repo}`;
  if (tagCache.has(cacheKey)) return tagCache.get(cacheKey);

  // GitHub returns up to 100 tags per page; one page is plenty for our modules.
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/tags?per_page=100`;
  const raw = await fetchJson(url, { timeout });
  if (!Array.isArray(raw)) {
    throw new TypeError(`Unexpected response from ${url}`);
  }

  const stable = [];
  for (const entry of raw) {
    const version = normalizeStableTag(entry?.name);
    if (version) stable.push({ tag: entry.name, version });
  }
  stable.sort((a, b) => semver.rcompare(a.version, b.version));

  tagCache.set(cacheKey, stable);
  return stable;
}

/**
 * Resolve a channel plan for a single module into a git-clonable ref.
 *
 * @param {Object} args
 * @param {'stable'|'next'|'pinned'} args.channel
 * @param {string} [args.pin] - Required when channel === 'pinned'
 * @param {string} args.repoUrl - Module's git URL (for tag lookup)
 * @returns {Promise<{channel, ref, version}>} where
 *   ref:     the git ref to pass to `git clone --branch`, or null for HEAD (next)
 *   version: the resolved version string (tag name for stable/pinned, 'main' for next)
 *
 * Throws on:
 *   - pinned without a pin value
 *   - stable with no GitHub repo parseable from the URL (pass through to caller to fall back)
 *
 * Falls back to next-channel semantics and sets resolvedFallback=true when
 * stable resolution turns up no tags.
 */
async function resolveChannel({ channel, pin, repoUrl, timeout }) {
  if (channel === 'pinned') {
    if (!pin) throw new Error('resolveChannel: pinned channel requires a pin value');
    return { channel: 'pinned', ref: pin, version: pin, resolvedFallback: false };
  }

  if (channel === 'next') {
    return { channel: 'next', ref: null, version: 'main', resolvedFallback: false };
  }

  if (channel === 'stable') {
    const parsed = parseGitHubRepo(repoUrl);
    if (!parsed) {
      // No GitHub URL — caller must handle by falling back to next.
      return { channel: 'next', ref: null, version: 'main', resolvedFallback: true, reason: 'not-a-github-url' };
    }

    try {
      const tags = await fetchStableTags(parsed.owner, parsed.repo, { timeout });
      if (tags.length === 0) {
        return { channel: 'next', ref: null, version: 'main', resolvedFallback: true, reason: 'no-stable-tags' };
      }
      const top = tags[0];
      return { channel: 'stable', ref: top.tag, version: top.tag, resolvedFallback: false };
    } catch (error) {
      // Propagate the error; callers decide whether to fall back or abort.
      error.message = `Failed to resolve stable channel for ${parsed.owner}/${parsed.repo}: ${error.message}`;
      throw error;
    }
  }

  throw new Error(`resolveChannel: unknown channel '${channel}'`);
}

/**
 * Verify that a specific tag exists in a GitHub repo. Used to validate
 * --pin values before the user sits through a long clone that then fails.
 */
async function tagExists(owner, repo, tagName, { timeout } = {}) {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs/tags/${encodeURIComponent(tagName)}`;
  try {
    await fetchJson(url, { timeout });
    return true;
  } catch (error) {
    if (error.statusCode === 404) return false;
    throw error;
  }
}

/**
 * Classify the semver delta between two versions.
 *   - 'none'  → same version (or downgrade; treated same)
 *   - 'patch' → same major.minor, higher patch
 *   - 'minor' → same major, higher minor
 *   - 'major' → different major
 *   - 'unknown' → either version is not valid semver; caller should treat as major
 */
function classifyUpgrade(currentVersion, newVersion) {
  const current = semver.valid(semver.coerce(currentVersion));
  const next = semver.valid(semver.coerce(newVersion));
  if (!current || !next) return 'unknown';
  if (semver.lte(next, current)) return 'none';
  const diff = semver.diff(current, next);
  if (diff === 'patch') return 'patch';
  if (diff === 'minor' || diff === 'preminor') return 'minor';
  if (diff === 'major' || diff === 'premajor') return 'major';
  // prepatch, prerelease — treat conservatively as minor (prereleases shouldn't
  // normally surface here since stable channel filters them out).
  return 'minor';
}

/**
 * Build the GitHub release notes URL for a resolved tag.
 * Returns null if the repo URL isn't a GitHub URL.
 */
function releaseNotesUrl(repoUrl, tag) {
  const parsed = parseGitHubRepo(repoUrl);
  if (!parsed || !tag) return null;
  return `https://github.com/${parsed.owner}/${parsed.repo}/releases/tag/${encodeURIComponent(tag)}`;
}

/**
 * Test-only: clear the per-process tag cache.
 */
function _clearTagCache() {
  tagCache.clear();
}

module.exports = {
  parseGitHubRepo,
  fetchStableTags,
  resolveChannel,
  tagExists,
  classifyUpgrade,
  releaseNotesUrl,
  normalizeStableTag,
  _clearTagCache,
};
