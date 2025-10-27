/* deno-lint-ignore-file */
/*
 Automatic test matrix for project root detection.
 Creates temporary fixtures for various ecosystems and validates findProjectRoot().
 No external options or flags required. Safe to run multiple times.
*/

const os = require('node:os');
const path = require('node:path');
const fs = require('fs-extra');
const { promisify } = require('node:util');
const { execFile } = require('node:child_process');
const process = require('node:process');
const execFileAsync = promisify(execFile);

const { findProjectRoot } = require('./projectRoot.js');

async function cmdAvailable(cmd) {
  try {
    await execFileAsync(cmd, ['--version'], { timeout: 500, windowsHide: true });
    return true;
  } catch {
    return false;
  }

  async function testSvnMarker() {
    const root = await mkTmpDir('svn');
    const nested = path.join(root, 'proj', 'code');
    await fs.ensureDir(nested);
    await fs.ensureDir(path.join(root, '.svn'));
    const found = await findProjectRoot(nested);
    assertEqual(found, root, '.svn marker should be detected');
    return { name: 'svn-marker', ok: true };
  }

  async function testSymlinkStart() {
    const root = await mkTmpDir('symlink-start');
    const nested = path.join(root, 'a', 'b');
    await fs.ensureDir(nested);
    await fs.writeFile(path.join(root, '.project-root'), '\n');
    const tmp = await mkTmpDir('symlink-tmp');
    const link = path.join(tmp, 'link-to-b');
    try {
      await fs.symlink(nested, link);
    } catch {
      // symlink may not be permitted on some systems; skip
      return { name: 'symlink-start', ok: true, skipped: true };
    }
    const found = await findProjectRoot(link);
    assertEqual(found, root, 'should resolve symlinked start to real root');
    return { name: 'symlink-start', ok: true };
  }

  async function testSubmoduleLikeInnerGitFile() {
    const root = await mkTmpDir('submodule-like');
    const mid = path.join(root, 'mid');
    const leaf = path.join(mid, 'leaf');
    await fs.ensureDir(leaf);
    // outer repo
    await fs.ensureDir(path.join(root, '.git'));
    // inner submodule-like .git file
    await fs.writeFile(path.join(mid, '.git'), 'gitdir: ../.git/modules/mid\n');
    const found = await findProjectRoot(leaf);
    assertEqual(found, root, 'outermost .git should win on tie weight');
    return { name: 'submodule-like-gitfile', ok: true };
  }
}

async function mkTmpDir(name) {
  const base = await fs.realpath(os.tmpdir());
  const dir = await fs.mkdtemp(path.join(base, `flattener-${name}-`));
  return dir;
}

function assertEqual(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error(`${msg}: expected="${expected}" actual="${actual}"`);
  }
}

async function testSentinel() {
  const root = await mkTmpDir('sentinel');
  const nested = path.join(root, 'a', 'b', 'c');
  await fs.ensureDir(nested);
  await fs.writeFile(path.join(root, '.project-root'), '\n');
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, 'sentinel .project-root should win');
  return { name: 'sentinel', ok: true };
}

async function testOtherSentinels() {
  const root = await mkTmpDir('other-sentinels');
  const nested = path.join(root, 'x', 'y');
  await fs.ensureDir(nested);
  await fs.writeFile(path.join(root, '.workspace-root'), '\n');
  const found1 = await findProjectRoot(nested);
  assertEqual(found1, root, 'sentinel .workspace-root should win');

  await fs.remove(path.join(root, '.workspace-root'));
  await fs.writeFile(path.join(root, '.repo-root'), '\n');
  const found2 = await findProjectRoot(nested);
  assertEqual(found2, root, 'sentinel .repo-root should win');
  return { name: 'other-sentinels', ok: true };
}

async function testGitCliAndMarker() {
  const hasGit = await cmdAvailable('git');
  if (!hasGit) return { name: 'git-cli', ok: true, skipped: true };

  const root = await mkTmpDir('git');
  const nested = path.join(root, 'pkg', 'src');
  await fs.ensureDir(nested);
  await execFileAsync('git', ['init'], { cwd: root, timeout: 2000 });
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, 'git toplevel should be detected');
  return { name: 'git-cli', ok: true };
}

async function testHgMarkerOrCli() {
  // Prefer simple marker test to avoid requiring Mercurial install
  const root = await mkTmpDir('hg');
  const nested = path.join(root, 'lib');
  await fs.ensureDir(nested);
  await fs.ensureDir(path.join(root, '.hg'));
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, '.hg marker should be detected');
  return { name: 'hg-marker', ok: true };
}

async function testWorkspacePnpm() {
  const root = await mkTmpDir('pnpm-workspace');
  const pkgA = path.join(root, 'packages', 'a');
  await fs.ensureDir(pkgA);
  await fs.writeFile(path.join(root, 'pnpm-workspace.yaml'), 'packages:\n  - packages/*\n');
  const found = await findProjectRoot(pkgA);
  await assertEqual(found, root, 'pnpm-workspace.yaml should be detected');
  return { name: 'pnpm-workspace', ok: true };
}

async function testPackageJsonWorkspaces() {
  const root = await mkTmpDir('package-workspaces');
  const pkgA = path.join(root, 'packages', 'a');
  await fs.ensureDir(pkgA);
  await fs.writeJson(
    path.join(root, 'package.json'),
    { private: true, workspaces: ['packages/*'] },
    { spaces: 2 },
  );
  const found = await findProjectRoot(pkgA);
  await assertEqual(found, root, 'package.json workspaces should be detected');
  return { name: 'package.json-workspaces', ok: true };
}

async function testLockfiles() {
  const root = await mkTmpDir('lockfiles');
  const nested = path.join(root, 'src');
  await fs.ensureDir(nested);
  await fs.writeFile(path.join(root, 'yarn.lock'), '\n');
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, 'yarn.lock should be detected');
  return { name: 'lockfiles', ok: true };
}

async function testLanguageConfigs() {
  const root = await mkTmpDir('lang-configs');
  const nested = path.join(root, 'x', 'y');
  await fs.ensureDir(nested);
  await fs.writeFile(path.join(root, 'pyproject.toml'), "[tool.poetry]\nname='tmp'\n");
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, 'pyproject.toml should be detected');
  return { name: 'language-configs', ok: true };
}

async function testPreferOuterOnTie() {
  const root = await mkTmpDir('tie');
  const mid = path.join(root, 'mid');
  const leaf = path.join(mid, 'leaf');
  await fs.ensureDir(leaf);
  // same weight marker at two levels
  await fs.writeFile(path.join(root, 'requirements.txt'), '\n');
  await fs.writeFile(path.join(mid, 'requirements.txt'), '\n');
  const found = await findProjectRoot(leaf);
  await assertEqual(found, root, 'outermost directory should win on equal weight');
  return { name: 'prefer-outermost-tie', ok: true };
}

// Additional coverage: Bazel, Nx/Turbo/Rush, Go workspaces, Deno, Java/Scala, PHP, Rust, Nix, Changesets, env markers,
// and priority interaction between package.json and lockfiles.

async function testBazelWorkspace() {
  const root = await mkTmpDir('bazel');
  const nested = path.join(root, 'apps', 'svc');
  await fs.ensureDir(nested);
  await fs.writeFile(path.join(root, 'WORKSPACE'), 'workspace(name="tmp")\n');
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, 'Bazel WORKSPACE should be detected');
  return { name: 'bazel-workspace', ok: true };
}

async function testNx() {
  const root = await mkTmpDir('nx');
  const nested = path.join(root, 'apps', 'web');
  await fs.ensureDir(nested);
  await fs.writeJson(path.join(root, 'nx.json'), { npmScope: 'tmp' }, { spaces: 2 });
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, 'nx.json should be detected');
  return { name: 'nx', ok: true };
}

async function testTurbo() {
  const root = await mkTmpDir('turbo');
  const nested = path.join(root, 'packages', 'x');
  await fs.ensureDir(nested);
  await fs.writeJson(path.join(root, 'turbo.json'), { pipeline: {} }, { spaces: 2 });
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, 'turbo.json should be detected');
  return { name: 'turbo', ok: true };
}

async function testRush() {
  const root = await mkTmpDir('rush');
  const nested = path.join(root, 'apps', 'a');
  await fs.ensureDir(nested);
  await fs.writeJson(path.join(root, 'rush.json'), { projectFolderMinDepth: 1 }, { spaces: 2 });
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, 'rush.json should be detected');
  return { name: 'rush', ok: true };
}

async function testGoWorkAndMod() {
  const root = await mkTmpDir('gowork');
  const mod = path.join(root, 'modA');
  const nested = path.join(mod, 'pkg');
  await fs.ensureDir(nested);
  await fs.writeFile(path.join(root, 'go.work'), 'go 1.22\nuse ./modA\n');
  await fs.writeFile(path.join(mod, 'go.mod'), 'module example.com/a\ngo 1.22\n');
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, 'go.work should define the workspace root');
  return { name: 'go-work', ok: true };
}

async function testDenoJson() {
  const root = await mkTmpDir('deno');
  const nested = path.join(root, 'src');
  await fs.ensureDir(nested);
  await fs.writeJson(path.join(root, 'deno.json'), { tasks: {} }, { spaces: 2 });
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, 'deno.json should be detected');
  return { name: 'deno-json', ok: true };
}

async function testGradleSettings() {
  const root = await mkTmpDir('gradle');
  const nested = path.join(root, 'app');
  await fs.ensureDir(nested);
  await fs.writeFile(path.join(root, 'settings.gradle'), "rootProject.name='tmp'\n");
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, 'settings.gradle should be detected');
  return { name: 'gradle-settings', ok: true };
}

async function testMavenPom() {
  const root = await mkTmpDir('maven');
  const nested = path.join(root, 'module');
  await fs.ensureDir(nested);
  await fs.writeFile(path.join(root, 'pom.xml'), '<project></project>\n');
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, 'pom.xml should be detected');
  return { name: 'maven-pom', ok: true };
}

async function testSbtBuild() {
  const root = await mkTmpDir('sbt');
  const nested = path.join(root, 'sub');
  await fs.ensureDir(nested);
  await fs.writeFile(path.join(root, 'build.sbt'), 'name := "tmp"\n');
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, 'build.sbt should be detected');
  return { name: 'sbt-build', ok: true };
}

async function testComposer() {
  const root = await mkTmpDir('composer');
  const nested = path.join(root, 'src');
  await fs.ensureDir(nested);
  await fs.writeJson(path.join(root, 'composer.json'), { name: 'tmp/pkg' }, { spaces: 2 });
  await fs.writeFile(path.join(root, 'composer.lock'), '{}\n');
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, 'composer.{json,lock} should be detected');
  return { name: 'composer', ok: true };
}

async function testCargo() {
  const root = await mkTmpDir('cargo');
  const nested = path.join(root, 'src');
  await fs.ensureDir(nested);
  await fs.writeFile(path.join(root, 'Cargo.toml'), "[package]\nname='tmp'\nversion='0.0.0'\n");
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, 'Cargo.toml should be detected');
  return { name: 'cargo', ok: true };
}

async function testNixFlake() {
  const root = await mkTmpDir('nix');
  const nested = path.join(root, 'work');
  await fs.ensureDir(nested);
  await fs.writeFile(path.join(root, 'flake.nix'), '{ }\n');
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, 'flake.nix should be detected');
  return { name: 'nix-flake', ok: true };
}

async function testChangesetConfig() {
  const root = await mkTmpDir('changeset');
  const nested = path.join(root, 'pkg');
  await fs.ensureDir(nested);
  await fs.ensureDir(path.join(root, '.changeset'));
  await fs.writeJson(
    path.join(root, '.changeset', 'config.json'),
    { $schema: 'https://unpkg.com/@changesets/config@2.3.1/schema.json' },
    { spaces: 2 },
  );
  const found = await findProjectRoot(nested);
  await assertEqual(found, root, '.changeset/config.json should be detected');
  return { name: 'changesets', ok: true };
}

async function testEnvCustomMarker() {
  const root = await mkTmpDir('env-marker');
  const nested = path.join(root, 'dir');
  await fs.ensureDir(nested);
  await fs.writeFile(path.join(root, 'MY_ROOT'), '\n');
  const prev = process.env.PROJECT_ROOT_MARKERS;
  process.env.PROJECT_ROOT_MARKERS = 'MY_ROOT';
  try {
    const found = await findProjectRoot(nested);
    await assertEqual(found, root, 'custom env marker should be honored');
  } finally {
    if (prev === undefined) delete process.env.PROJECT_ROOT_MARKERS;
    else process.env.PROJECT_ROOT_MARKERS = prev;
  }
  return { name: 'env-custom-marker', ok: true };
}

async function testPackageLowPriorityVsLock() {
  const root = await mkTmpDir('pkg-vs-lock');
  const nested = path.join(root, 'nested');
  await fs.ensureDir(path.join(nested, 'deep'));
  await fs.writeJson(path.join(nested, 'package.json'), { name: 'nested' }, { spaces: 2 });
  await fs.writeFile(path.join(root, 'yarn.lock'), '\n');
  const found = await findProjectRoot(path.join(nested, 'deep'));
  await assertEqual(found, root, 'lockfile at root should outrank nested package.json');
  return { name: 'package-vs-lock-priority', ok: true };
}

async function run() {
  const tests = [
    testSentinel,
    testOtherSentinels,
    testGitCliAndMarker,
    testHgMarkerOrCli,
    testWorkspacePnpm,
    testPackageJsonWorkspaces,
    testLockfiles,
    testLanguageConfigs,
    testPreferOuterOnTie,
    testBazelWorkspace,
    testNx,
    testTurbo,
    testRush,
    testGoWorkAndMod,
    testDenoJson,
    testGradleSettings,
    testMavenPom,
    testSbtBuild,
    testComposer,
    testCargo,
    testNixFlake,
    testChangesetConfig,
    testEnvCustomMarker,
    testPackageLowPriorityVsLock,
    testSvnMarker,
    testSymlinkStart,
    testSubmoduleLikeInnerGitFile,
  ];

  const results = [];
  for (const t of tests) {
    try {
      const r = await t();
      results.push({ ...r, ok: true });
      console.log(`✔ ${r.name}${r.skipped ? ' (skipped)' : ''}`);
    } catch (error) {
      console.error(`✖ ${t.name}:`, error && error.message ? error.message : error);
      results.push({ name: t.name, ok: false, error: String(error) });
    }
  }

  const failed = results.filter((r) => !r.ok);
  console.log('\nSummary:');
  for (const r of results) {
    console.log(`- ${r.name}: ${r.ok ? 'ok' : 'FAIL'}${r.skipped ? ' (skipped)' : ''}`);
  }

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
