/**
 * parseSource() URL parsing tests
 *
 * Verifies that CustomModuleManager.parseSource() correctly handles Git URLs
 * across arbitrary hosts and path shapes (deep paths, nested groups, browse
 * links, repo names containing dots, etc.) using host-agnostic rules.
 *
 * Usage: node test/test-parse-source-urls.js
 */

const { CustomModuleManager } = require('../tools/installer/modules/custom-module-manager');

// ANSI colors
const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

let passed = 0;
let failed = 0;

function assert(condition, testName, errorMessage = '') {
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${testName}`);
    passed++;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${testName}`);
    if (errorMessage) {
      console.log(`  ${colors.dim}${errorMessage}${colors.reset}`);
    }
    failed++;
  }
}

const manager = new CustomModuleManager();

// ─── Deep path shapes (4+ segments) ─────────────────────────────────────────

console.log(`\n${colors.cyan}Deep path shapes${colors.reset}\n`);

{
  // Hosts that expose the repo at a nested path like /<org>/<project>/<marker>/<repo>.
  // The parser must preserve the full path (no stripping of intermediate segments).
  const result = manager.parseSource('https://git.example.com/myorg/MyProject/_git/my-module');
  assert(result.isValid === true, 'nested-path URL is valid');
  assert(result.type === 'url', 'nested-path type is url');
  assert(
    result.cloneUrl === 'https://git.example.com/myorg/MyProject/_git/my-module',
    'nested-path cloneUrl preserves full path',
    `Got: ${result.cloneUrl}`,
  );
  assert(result.subdir === null, 'nested-path URL has no subdir');
  assert(
    result.cacheKey === 'git.example.com/myorg/MyProject/_git/my-module',
    'nested-path cacheKey includes full repo path',
    `Got: ${result.cacheKey}`,
  );
  assert(result.displayName === '_git/my-module', 'nested-path displayName uses last two segments', `Got: ${result.displayName}`);
}

{
  const result = manager.parseSource('https://git.example.com/myorg/MyProject/_git/my-module.git');
  assert(result.isValid === true, 'nested-path URL with .git suffix is valid');
  assert(
    result.cloneUrl === 'https://git.example.com/myorg/MyProject/_git/my-module',
    'nested-path .git suffix stripped from cloneUrl',
    `Got: ${result.cloneUrl}`,
  );
}

{
  // Browse links that use ?path=/... to point at a subdirectory.
  const result = manager.parseSource('https://git.example.com/myorg/MyProject/_git/my-module?path=/path/to/subdir');
  assert(result.isValid === true, 'URL with ?path= is valid');
  assert(
    result.cloneUrl === 'https://git.example.com/myorg/MyProject/_git/my-module',
    '?path= cloneUrl excludes subdir',
    `Got: ${result.cloneUrl}`,
  );
  assert(result.subdir === 'path/to/subdir', '?path= subdir correctly extracted', `Got: ${result.subdir}`);
}

// ─── Azure DevOps URLs (Issue #2268) ────────────────────────────────────────

console.log(`\n${colors.cyan}Azure DevOps URLs (Issue #2268)${colors.reset}\n`);

{
  // Modern dev.azure.com format — the exact URL from the bug report.
  const result = manager.parseSource('https://dev.azure.com/myorg/MyProject/_git/my-module');
  assert(result.isValid === true, 'ADO modern URL is valid');
  assert(result.type === 'url', 'ADO modern type is url');
  assert(
    result.cloneUrl === 'https://dev.azure.com/myorg/MyProject/_git/my-module',
    'ADO modern cloneUrl preserves full _git path',
    `Got: ${result.cloneUrl}`,
  );
  assert(
    result.cacheKey === 'dev.azure.com/myorg/MyProject/_git/my-module',
    'ADO modern cacheKey includes full path',
    `Got: ${result.cacheKey}`,
  );
  assert(result.subdir === null, 'ADO modern URL has no subdir');
}

{
  // Modern format with .git suffix
  const result = manager.parseSource('https://dev.azure.com/myorg/MyProject/_git/my-module.git');
  assert(result.isValid === true, 'ADO modern .git suffix is valid');
  assert(
    result.cloneUrl === 'https://dev.azure.com/myorg/MyProject/_git/my-module',
    'ADO modern .git suffix stripped from cloneUrl',
    `Got: ${result.cloneUrl}`,
  );
}

{
  // Modern format with ?path= subdir (browse link)
  const result = manager.parseSource('https://dev.azure.com/myorg/MyProject/_git/my-module?path=/src/skills');
  assert(result.isValid === true, 'ADO modern ?path= is valid');
  assert(
    result.cloneUrl === 'https://dev.azure.com/myorg/MyProject/_git/my-module',
    'ADO modern ?path= cloneUrl excludes subdir',
    `Got: ${result.cloneUrl}`,
  );
  assert(result.subdir === 'src/skills', 'ADO modern ?path= subdir extracted', `Got: ${result.subdir}`);
}

{
  // Legacy visualstudio.com format
  const result = manager.parseSource('https://myorg.visualstudio.com/MyProject/_git/my-module');
  assert(result.isValid === true, 'ADO legacy URL is valid');
  assert(
    result.cloneUrl === 'https://myorg.visualstudio.com/MyProject/_git/my-module',
    'ADO legacy cloneUrl preserves full path',
    `Got: ${result.cloneUrl}`,
  );
  assert(
    result.cacheKey === 'myorg.visualstudio.com/MyProject/_git/my-module',
    'ADO legacy cacheKey includes full path',
    `Got: ${result.cacheKey}`,
  );
}

{
  // Legacy format with .git suffix
  const result = manager.parseSource('https://myorg.visualstudio.com/MyProject/_git/my-module.git');
  assert(result.isValid === true, 'ADO legacy .git suffix is valid');
  assert(
    result.cloneUrl === 'https://myorg.visualstudio.com/MyProject/_git/my-module',
    'ADO legacy .git suffix stripped from cloneUrl',
    `Got: ${result.cloneUrl}`,
  );
}

{
  // Legacy format with ?path= subdir
  const result = manager.parseSource('https://myorg.visualstudio.com/MyProject/_git/my-module?path=/src');
  assert(result.isValid === true, 'ADO legacy ?path= is valid');
  assert(
    result.cloneUrl === 'https://myorg.visualstudio.com/MyProject/_git/my-module',
    'ADO legacy ?path= cloneUrl excludes subdir',
    `Got: ${result.cloneUrl}`,
  );
  assert(result.subdir === 'src', 'ADO legacy ?path= subdir extracted', `Got: ${result.subdir}`);
}

// ─── Subdomain hosts ────────────────────────────────────────────────────────

console.log(`\n${colors.cyan}Subdomain hosts${colors.reset}\n`);

{
  const result = manager.parseSource('https://myorg.example.com/MyProject/_git/my-module');
  assert(result.isValid === true, 'subdomain URL is valid');
  assert(result.type === 'url', 'subdomain type is url');
  assert(
    result.cloneUrl === 'https://myorg.example.com/MyProject/_git/my-module',
    'subdomain cloneUrl preserves full path',
    `Got: ${result.cloneUrl}`,
  );
  assert(result.subdir === null, 'subdomain URL has no subdir');
  assert(
    result.cacheKey === 'myorg.example.com/MyProject/_git/my-module',
    'subdomain cacheKey includes full repo path',
    `Got: ${result.cacheKey}`,
  );
}

// ─── Simple owner/repo URLs (regression) ────────────────────────────────────

console.log(`\n${colors.cyan}Simple owner/repo URLs (regression check)${colors.reset}\n`);

{
  const result = manager.parseSource('https://github.com/owner/repo');
  assert(result.isValid === true, 'GitHub basic URL still valid');
  assert(result.cloneUrl === 'https://github.com/owner/repo', 'GitHub cloneUrl unchanged', `Got: ${result.cloneUrl}`);
  assert(result.cacheKey === 'github.com/owner/repo', 'GitHub cacheKey unchanged', `Got: ${result.cacheKey}`);
}

{
  const result = manager.parseSource('https://github.com/owner/repo/tree/main/subdir');
  assert(result.isValid === true, 'GitHub URL with tree path still valid');
  assert(result.cloneUrl === 'https://github.com/owner/repo', 'GitHub tree URL cloneUrl correct', `Got: ${result.cloneUrl}`);
  assert(result.subdir === 'subdir', 'GitHub tree subdir still extracted', `Got: ${result.subdir}`);
}

{
  const result = manager.parseSource('git@github.com:owner/repo.git');
  assert(result.isValid === true, 'SSH URL still valid');
  assert(result.cloneUrl === 'git@github.com:owner/repo.git', 'SSH cloneUrl unchanged', `Got: ${result.cloneUrl}`);
}

// ─── Generic URL handling (any host, any path depth) ────────────────────────

console.log(`\n${colors.cyan}Generic URL handling${colors.reset}\n`);

{
  // GitLab nested groups — the old 2-segment regex would have failed this.
  const result = manager.parseSource('https://gitlab.com/group/subgroup/repo');
  assert(result.isValid === true, 'GitLab nested-group URL is valid');
  assert(
    result.cloneUrl === 'https://gitlab.com/group/subgroup/repo',
    'GitLab nested-group cloneUrl preserves full path',
    `Got: ${result.cloneUrl}`,
  );
  assert(
    result.cacheKey === 'gitlab.com/group/subgroup/repo',
    'GitLab nested-group cacheKey includes full path',
    `Got: ${result.cacheKey}`,
  );
  assert(result.displayName === 'subgroup/repo', 'GitLab nested-group displayName uses last two segments', `Got: ${result.displayName}`);
}

{
  const result = manager.parseSource('https://gitlab.com/group/subgroup/repo/-/tree/main/src/module');
  assert(result.isValid === true, 'GitLab nested-group tree URL is valid');
  assert(
    result.cloneUrl === 'https://gitlab.com/group/subgroup/repo',
    'GitLab nested-group tree cloneUrl excludes subdir',
    `Got: ${result.cloneUrl}`,
  );
  assert(result.subdir === 'src/module', 'GitLab nested-group tree subdir extracted', `Got: ${result.subdir}`);
}

{
  // Self-hosted host with a repo name containing dots — the old regex
  // explicitly excluded dots from the repo segment.
  const result = manager.parseSource('https://git.example.com/owner/my.repo.name');
  assert(result.isValid === true, 'repo name with dots is valid');
  assert(
    result.cloneUrl === 'https://git.example.com/owner/my.repo.name',
    'repo name with dots preserved in cloneUrl',
    `Got: ${result.cloneUrl}`,
  );
  assert(result.displayName === 'owner/my.repo.name', 'repo name with dots preserved in displayName', `Got: ${result.displayName}`);
}

{
  // Browser URL pointing at a ref with NO trailing subdir must still strip
  // the /tree/<ref> segment from the clone URL.
  const result = manager.parseSource('https://github.com/owner/repo/tree/main');
  assert(result.isValid === true, 'tree URL without subdir is valid');
  assert(
    result.cloneUrl === 'https://github.com/owner/repo',
    'tree URL without subdir strips ref from cloneUrl',
    `Got: ${result.cloneUrl}`,
  );
  assert(result.subdir === null, 'tree URL without subdir yields null subdir', `Got: ${result.subdir}`);
  assert(result.displayName === 'owner/repo', 'tree URL without subdir displayName is owner/repo', `Got: ${result.displayName}`);
}

{
  // Same shape for GitLab's /-/tree form and Gitea's /src/branch form.
  const gitlab = manager.parseSource('https://gitlab.com/group/repo/-/tree/main');
  assert(
    gitlab.cloneUrl === 'https://gitlab.com/group/repo' && gitlab.subdir === null,
    'GitLab /-/tree/<ref> without subdir strips ref',
    `Got: ${gitlab.cloneUrl} subdir=${gitlab.subdir}`,
  );

  const gitea = manager.parseSource('https://gitea.example.com/owner/repo/src/branch/main');
  assert(
    gitea.cloneUrl === 'https://gitea.example.com/owner/repo' && gitea.subdir === null,
    'Gitea /src/branch/<ref> without subdir strips ref',
    `Got: ${gitea.cloneUrl} subdir=${gitea.subdir}`,
  );
}

// ─── Summary ────────────────────────────────────────────────────────────────

console.log(`\n${colors.cyan}Results: ${passed} passed, ${failed} failed${colors.reset}\n`);
process.exit(failed > 0 ? 1 : 0);
