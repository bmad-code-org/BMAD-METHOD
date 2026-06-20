/**
 * bmad-module skill — parseSource / semver-lite / channel-resolver unit tests.
 *
 * Covers the skill's pure (no-network, no-filesystem) install plumbing so the
 * @ref / deep-path-URL / subdir parsing, the registry-free semver math, and the
 * channel resolver stay at parity with the canonical installer
 * (tools/installer/modules/custom-module-manager.js + channel-resolver.js, whose
 * own behavior is pinned by test/test-parse-source-urls.js and
 * test/test-installer-channels.js).
 *
 * Usage: node test/test-bmad-module-source.mjs
 */

import { parseSource } from '../src/core-skills/bmad-module/scripts/lib/source.mjs';
import { valid, prerelease, compare, rcompare, validRange } from '../src/core-skills/bmad-module/scripts/lib/semver-lite.mjs';
import { parseGitHubRepo, normalizeStableTag } from '../src/core-skills/bmad-module/scripts/lib/channel-resolver.mjs';

const colors = { reset: '[0m', green: '[32m', red: '[31m', cyan: '[36m', dim: '[2m' };
let passed = 0;
let failed = 0;

function assert(cond, name, detail = '') {
  if (cond) {
    console.log(`${colors.green}✓${colors.reset} ${name}`);
    passed++;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    if (detail) console.log(`  ${colors.dim}${detail}${colors.reset}`);
    failed++;
  }
}
const eq = (got, want, name) =>
  assert(JSON.stringify(got) === JSON.stringify(want), name, `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`);
function throws(fn, name) {
  try {
    fn();
    assert(false, name, 'expected a throw');
  } catch {
    assert(true, name);
  }
}

// ─── parseSource ────────────────────────────────────────────────────────────
console.log(`\n${colors.cyan}parseSource${colors.reset}\n`);

{
  const r = parseSource('owner/repo');
  eq(
    [r.kind, r.url, r.ref, r.subdir, r.cacheKey],
    ['git', 'https://github.com/owner/repo', null, null, 'github.com/owner/repo'],
    'owner/repo shorthand → GitHub HTTPS',
  );
}
{
  const r = parseSource('acme/devlog@v1.2.3');
  eq([r.url, r.ref], ['https://github.com/acme/devlog', 'v1.2.3'], 'owner/repo@ref strips suffix');
}
{
  const r = parseSource('https://github.com/owner/repo/tree/main/pkg/foo');
  eq([r.url, r.ref, r.subdir], ['https://github.com/owner/repo', 'main', 'pkg/foo'], 'GitHub /tree/<ref>/<subdir>');
}
{
  const r = parseSource('https://github.com/owner/repo/tree/main');
  eq([r.url, r.ref, r.subdir], ['https://github.com/owner/repo', 'main', null], 'GitHub /tree/<ref> without subdir strips ref');
}
{
  const r = parseSource('https://github.com/owner/repo/blob/v2.0.0/src');
  eq([r.url, r.ref, r.subdir], ['https://github.com/owner/repo', 'v2.0.0', 'src'], 'GitHub /blob/<ref>/<subdir>');
}
{
  const r = parseSource('https://gitlab.com/group/subgroup/repo/-/tree/main/src/module');
  eq([r.url, r.ref, r.subdir], ['https://gitlab.com/group/subgroup/repo', 'main', 'src/module'], 'GitLab nested-group /-/tree');
}
{
  const r = parseSource('https://gitea.example.com/owner/repo/src/branch/main');
  eq([r.url, r.subdir], ['https://gitea.example.com/owner/repo', null], 'Gitea /src/branch/<ref> without subdir strips ref');
}
{
  const r = parseSource('https://dev.azure.com/myorg/MyProject/_git/my-module?path=/src/skills');
  eq(
    [r.url, r.subdir, r.cacheKey],
    ['https://dev.azure.com/myorg/MyProject/_git/my-module', 'src/skills', 'dev.azure.com/myorg/MyProject/_git/my-module'],
    'Azure DevOps ?path= + full-path cacheKey',
  );
}
{
  const r = parseSource('https://dev.azure.com/myorg/MyProject/_git/my-module.git');
  eq(r.url, 'https://dev.azure.com/myorg/MyProject/_git/my-module', 'trailing .git stripped from cloneUrl');
}
{
  const r = parseSource('git@github.com:owner/repo.git');
  eq(
    [r.kind, r.url, r.cacheKey, r.displayName],
    ['git', 'git@github.com:owner/repo.git', 'github.com/owner/repo', 'owner/repo'],
    'SSH URL preserved, @ not consumed',
  );
}
{
  const r = parseSource('https://git.example.com/owner/my.repo.name');
  eq([r.url, r.displayName], ['https://git.example.com/owner/my.repo.name', 'owner/my.repo.name'], 'dotted repo name preserved');
}
{
  const r = parseSource('https://git.example.com/myorg/MyProject/_git/my-module');
  eq(
    [r.cacheKey, r.displayName],
    ['git.example.com/myorg/MyProject/_git/my-module', '_git/my-module'],
    'nested path cacheKey + last-two-segment displayName',
  );
}
throws(() => parseSource('./local@v1'), 'local path + @ref throws');
throws(() => parseSource('   '), 'empty source throws');
throws(() => parseSource('not a source'), 'garbage source throws');

// ─── semver-lite ──────────────────────────────────────────────────────────────
console.log(`\n${colors.cyan}semver-lite${colors.reset}\n`);

eq(valid('v1.2.3'), '1.2.3', 'valid() strips leading v');
eq(valid('1.2'), null, 'valid() rejects partial');
eq(prerelease('1.0.0-rc.1'), ['rc', 1], 'prerelease() parses identifiers');
eq(prerelease('1.0.0'), null, 'prerelease() null for release');
eq(compare('1.0.0-alpha', '1.0.0'), -1, 'prerelease < release');
eq(compare('1.0.0-alpha.1', '1.0.0-alpha.beta'), -1, 'numeric id < alphanumeric id');
eq(compare('1.2.0', '1.10.0'), -1, 'numeric (not lexical) field compare');
eq(compare('2.0.0', '2.0.0'), 0, 'equal versions');
eq(compare('bad', '1.0.0'), null, 'compare() null on invalid');
{
  const tags = [
    { tag: 'v1.0.0', version: '1.0.0' },
    { tag: 'v1.7.0', version: '1.7.0' },
    { tag: 'v1.2.0', version: '1.2.0' },
  ];
  tags.sort((a, b) => rcompare(a.version, b.version));
  eq(
    tags.map((t) => t.tag),
    ['v1.7.0', 'v1.2.0', 'v1.0.0'],
    'rcompare() sorts newest-first',
  );
}
assert(validRange('>=6.0.0') !== null, 'validRange() accepts a real range');

// ─── channel-resolver (pure helpers) ──────────────────────────────────────────
console.log(`\n${colors.cyan}channel-resolver${colors.reset}\n`);

eq(parseGitHubRepo('https://github.com/o/r/tree/main'), { owner: 'o', repo: 'r' }, 'parseGitHubRepo from deep URL');
eq(parseGitHubRepo('git@github.com:o/r'), { owner: 'o', repo: 'r' }, 'parseGitHubRepo from SSH');
eq(parseGitHubRepo('https://gitlab.com/o/r'), null, 'parseGitHubRepo null for non-GitHub');
eq(parseGitHubRepo('https://github.com/o/r.git'), { owner: 'o', repo: 'r' }, 'parseGitHubRepo strips .git');
eq(parseGitHubRepo('https://github.com/o/r.git/'), { owner: 'o', repo: 'r' }, 'parseGitHubRepo strips .git before trailing slash');
eq(
  [normalizeStableTag('v1.7.0'), normalizeStableTag('1.0.0-rc.1'), normalizeStableTag('nope')],
  ['1.7.0', null, null],
  'normalizeStableTag excludes prereleases/invalid',
);

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${colors.cyan}Results: ${passed} passed, ${failed} failed${colors.reset}\n`);
process.exit(failed > 0 ? 1 : 0);
