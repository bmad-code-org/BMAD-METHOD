import https from 'node:https';
import { valid, prerelease, rcompare } from './semver-lite.mjs';

// Channel resolver for community modules — decides which ref of a module to
// clone when no explicit version is supplied:
//   - stable: highest pure-semver git tag (excludes -alpha/-beta/-rc)
//   - next:   default-branch HEAD
//   - pinned: an explicit user-supplied tag/branch
//
// node:-only port of tools/installer/modules/channel-resolver.js (which uses the
// `semver` package + node:https). Uses lib/semver-lite.mjs to stay registry-free
// — the skill ships without node_modules. Talks only to the GitHub tags API and
// does semver math; clone logic lives in source.mjs.

const GITHUB_API_BASE = 'https://api.github.com';
const DEFAULT_TIMEOUT_MS = 10_000;
const USER_AGENT = 'bmad-method-installer';

// Per-process cache: 'owner/repo' => [{ tag, version }] sorted newest-first.
const tagCache = new Map();

// Parse a GitHub repo URL into { owner, repo }, or null for non-GitHub URLs.
export function parseGitHubRepo(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url
    .trim()
    .replace(/\.git$/, '')
    .replace(/\/$/, '');
  const httpsMatch = trimmed.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)(?:\/.*)?$/i);
  if (httpsMatch) return { owner: httpsMatch[1], repo: httpsMatch[2] };
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
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

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

// Strip a leading 'v' and return a valid non-prerelease semver, else null.
export function normalizeStableTag(tagName) {
  if (typeof tagName !== 'string') return null;
  const stripped = tagName.startsWith('v') ? tagName.slice(1) : tagName;
  const v = valid(stripped);
  if (!v) return null;
  if (prerelease(v)) return null; // exclude prereleases
  return v;
}

// Fetch pure-semver tags (highest first) from a GitHub repo, cached per-process.
// Returns [{ tag, version }]: tag is the original ref (e.g. "v1.7.0"), version
// the cleaned semver ("1.7.0").
export async function fetchStableTags(owner, repo, { timeout } = {}) {
  const cacheKey = `${owner}/${repo}`;
  if (tagCache.has(cacheKey)) return tagCache.get(cacheKey);

  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/tags?per_page=100`;
  const raw = await fetchJson(url, { timeout });
  if (!Array.isArray(raw)) throw new TypeError(`Unexpected response from ${url}`);

  const stable = [];
  for (const entry of raw) {
    const version = normalizeStableTag(entry?.name);
    if (version) stable.push({ tag: entry.name, version });
  }
  stable.sort((a, b) => rcompare(a.version, b.version));
  tagCache.set(cacheKey, stable);
  return stable;
}

// Resolve a channel into a git-clonable ref.
//   ref:     ref for `git clone --branch`, or null for default-branch HEAD (next)
//   version: tag name for stable/pinned, 'main' for next
// Falls back to next-channel semantics with resolvedFallback=true when stable
// turns up no tags or the URL isn't a GitHub repo. Throws on a pinned channel
// with no pin, or on a GitHub API error during stable resolution.
export async function resolveChannel({ channel, pin, repoUrl, timeout }) {
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
      return { channel: 'next', ref: null, version: 'main', resolvedFallback: true, reason: 'not-a-github-url' };
    }
    const tags = await fetchStableTags(parsed.owner, parsed.repo, { timeout });
    if (tags.length === 0) {
      return { channel: 'next', ref: null, version: 'main', resolvedFallback: true, reason: 'no-stable-tags' };
    }
    const top = tags[0];
    return { channel: 'stable', ref: top.tag, version: top.tag, resolvedFallback: false };
  }

  throw new Error(`resolveChannel: unknown channel '${channel}'`);
}

// Test-only: clear the per-process tag cache.
export function _clearTagCache() {
  tagCache.clear();
}
