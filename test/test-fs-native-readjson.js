/**
 * fs-native readJson + resolvePlugin cloneRef stamping tests
 *
 * Regression guard for #2607 (manifest.yaml records `version: main` for pinned
 * git-URL custom modules). Root cause: `tools/installer/fs-native.js` is a
 * drop-in replacement for `fs-extra` but omitted the async `readJson` method.
 * `CustomModuleManager.resolvePlugin()` calls `await fs.readJson('.bmad-source.json')`
 * inside a try/catch; the resulting `TypeError` was silently swallowed, so
 * `cloneMetadata` stayed `null` and `cloneRef`/`cloneSha`/`rawInput` were never
 * stamped onto the resolved module. `manifest.js` then fell through to the
 * hardcoded `'main'` fallback.
 *
 * These tests assert:
 *   1. `fs-native.readJson` exists and reads JSON (the missing-export guard).
 *   2. `resolvePlugin` stamps `cloneRef`/`cloneSha`/`rawInput` from
 *      `.bmad-source.json` so the manifest records the pinned ref.
 *
 * Usage: node test/test-fs-native-readjson.js
 */

const path = require('node:path');
const os = require('node:os');
const fsp = require('node:fs/promises');
const fsNative = require('../tools/installer/fs-native');
const { CustomModuleManager } = require('../tools/installer/modules/custom-module-manager');

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

async function mkdtempFixture() {
  const dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'bmad-fs-native-'));
  return dir;
}

async function main() {
  // ─── fs-native.readJson unit tests ──────────────────────────────────────
  console.log(`\n${colors.cyan}fs-native.readJson (missing-export guard)${colors.reset}\n`);

  assert(typeof fsNative.readJson === 'function', 'fs-native exports async readJson');

  const tmp = await mkdtempFixture();
  const jsonPath = path.join(tmp, 'data.json');
  const payload = { cloneUrl: 'https://example.com/owner/repo.git', version: 'v1.2.3', sha: 'abc' };
  await fsNative.writeJson(jsonPath, payload);

  let readBack = null;
  let readError = null;
  try {
    readBack = await fsNative.readJson(jsonPath);
  } catch (error) {
    readError = error;
  }
  assert(
    readBack && readBack.version === 'v1.2.3',
    'readJson reads JSON written by writeJson',
    readError ? readError.message : `Got: ${JSON.stringify(readBack)}`,
  );
  assert(
    readBack && JSON.stringify(readBack) === JSON.stringify(payload),
    'readJson round-trips full payload',
    readError ? readError.message : `Got: ${JSON.stringify(readBack)}`,
  );

  let threwOnMissing = false;
  try {
    await fsNative.readJson(path.join(tmp, 'does-not-exist.json'));
  } catch {
    threwOnMissing = true;
  }
  assert(threwOnMissing, 'readJson rejects on missing file (matches readJsonSync contract)');

  // ─── resolvePlugin cloneRef stamping (the #2607 regression) ─────────────
  console.log(`\n${colors.cyan}resolvePlugin stamps cloneRef from .bmad-source.json (#2607)${colors.reset}\n`);

  // Fresh per-process static cache so this is isolated from other test files.
  if (CustomModuleManager._resolutionCache && typeof CustomModuleManager._resolutionCache.clear === 'function') {
    CustomModuleManager._resolutionCache.clear();
  }

  const repoDir = await mkdtempFixture();
  const sourceUrl = 'https://github.com/owner/repo.git';
  const pinnedRef = 'v1.0.0';
  const sha = 'deadbeef0000000000000000000000000000';
  const rawInput = `${sourceUrl}@${pinnedRef}`;

  // Mirror what cloneRepo writes (custom-module-manager.js L537 / L549).
  await fsNative.writeJson(path.join(repoDir, '.bmad-source.json'), {
    cloneUrl: sourceUrl,
    cacheKey: 'github.com/owner/repo',
    displayName: 'owner/repo',
    version: pinnedRef,
    rawInput,
    sha,
    clonedAt: new Date().toISOString(),
  });
  await fsNative.ensureDir(path.join(repoDir, '.claude-plugin'));
  await fsNative.writeJson(path.join(repoDir, '.claude-plugin', 'marketplace.json'), {
    name: 'test-marketplace',
    owner: 'tester',
    plugins: [{ name: 'test-mod', source: 'skills/test-mod', skills: ['./skills/test-mod'], version: '1.0.0' }],
  });
  await fsNative.ensureDir(path.join(repoDir, 'skills', 'test-mod'));
  await fsp.writeFile(path.join(repoDir, 'skills', 'test-mod', 'module.yaml'), 'code: test-mod\nname: "Test Mod"\ndescription: "test"\n');
  await fsp.writeFile(path.join(repoDir, 'skills', 'test-mod', 'SKILL.md'), '# Test\n');

  const mgr = new CustomModuleManager();
  const marketplace = await mgr.readMarketplaceJsonFromDisk(repoDir);
  const plugins = await mgr.discoverModules(marketplace, sourceUrl);
  const resolved = await mgr.resolvePlugin(repoDir, plugins[0].rawPlugin, sourceUrl, null);

  assert(Array.isArray(resolved) && resolved.length > 0, 'resolvePlugin returns a resolved module', `Got: ${resolved?.length} modules`);
  const mod = resolved[0];
  assert(mod.cloneRef === pinnedRef, 'resolvePlugin stamps cloneRef from .bmad-source.json.version', `Got cloneRef: ${mod.cloneRef}`);
  assert(mod.cloneSha === sha, 'resolvePlugin stamps cloneSha from .bmad-source.json.sha', `Got cloneSha: ${mod.cloneSha}`);
  assert(mod.rawInput === rawInput, 'resolvePlugin stamps rawInput from .bmad-source.json.rawInput', `Got rawInput: ${mod.rawInput}`);
  assert(mod.repoUrl === sourceUrl, 'resolvePlugin stamps repoUrl', `Got repoUrl: ${mod.repoUrl}`);

  const cached = mgr.getResolution(mod.code);
  assert(cached && cached.cloneRef === pinnedRef, 'getResolution returns cached module with cloneRef', `Got cloneRef: ${cached?.cloneRef}`);

  // ─── Summary ────────────────────────────────────────────────────────────
  console.log(`\n${colors.cyan}Results: ${passed} passed, ${failed} failed${colors.reset}\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(`${colors.red}Test harness error:${colors.reset}`, error);
  process.exit(1);
});
