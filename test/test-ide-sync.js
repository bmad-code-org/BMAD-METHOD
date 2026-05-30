// test-ide-sync — behavioral drift guard for the IDE-distribution path.
//
// The bmad-module skill runs a self-contained esbuild bundle
// (src/core-skills/bmad-module/scripts/lib/vendor/ide-sync.mjs) built FROM the
// real engine (tools/installer/ide/* via core/ide-sync.js). vendor:check already
// byte-verifies the bundle matches its source. This test verifies the two
// delivery vehicles behave IDENTICALLY at runtime:
//   1. `bmad ide-sync`            — the engine, run directly from the package
//   2. `vendor/ide-sync.mjs`      — the shipped, dependency-free bundle
// Both must produce the same IDE skill trees for the same project, including
// `--prune`. If the engine changes without rebuilding the bundle, the outputs
// diverge and this fails (complementing the byte-level vendor:check).

const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');
const CLI = path.join(repoRoot, 'tools', 'installer', 'bmad-cli.js');
const BUNDLE = path.join(repoRoot, 'src', 'core-skills', 'bmad-module', 'scripts', 'lib', 'vendor', 'ide-sync.mjs');

let passed = 0;
let failed = 0;
function check(label, fn) {
  try {
    fn();
    passed++;
    process.stdout.write(`  ✓ ${label}\n`);
  } catch (error) {
    failed++;
    process.stdout.write(`  ✗ ${label}\n    ${error.message}\n`);
  }
}

// Build a fresh project with two skills recorded for two IDEs.
function makeProject(skillIds) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-ide-sync-'));
  fs.mkdirSync(path.join(dir, '_bmad', '_config'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, '_bmad', '_config', 'manifest.yaml'),
    'installation:\n  version: "0.0.0"\nmodules:\n  - name: demo\n    source: community\nides:\n  - claude-code\n  - cursor\n',
  );
  let csv = 'canonicalId,name,description,module,path\n';
  for (const id of skillIds) {
    const sd = path.join(dir, '_bmad', 'demo', 'skills', id);
    fs.mkdirSync(sd, { recursive: true });
    fs.writeFileSync(path.join(sd, 'SKILL.md'), `---\nname: ${id}\ndescription: ${id} demo\n---\nbody ${id}\n`);
    csv += `"${id}","${id}","${id} demo","demo","_bmad/demo/skills/${id}/SKILL.md"\n`;
  }
  fs.writeFileSync(path.join(dir, '_bmad', '_config', 'skill-manifest.csv'), csv);
  return dir;
}

// Snapshot the IDE skill trees (relative path -> file contents) for comparison.
function snapshotIdeDirs(projectDir) {
  const snap = {};
  for (const rel of ['.claude/skills', '.agents/skills']) {
    const base = path.join(projectDir, rel);
    if (!fs.existsSync(base)) continue;
    const walk = (d) => {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, entry.name);
        if (entry.isDirectory()) walk(full);
        else snap[path.relative(projectDir, full)] = fs.readFileSync(full, 'utf8');
      }
    };
    walk(base);
  }
  return snap;
}

function runEngine(projectDir, prune) {
  const args = [CLI, 'ide-sync', '-d', projectDir];
  if (prune) args.push('--prune', prune);
  const r = spawnSync(process.execPath, args, { encoding: 'utf8' });
  assert.strictEqual(r.status, 0, `engine ide-sync exited ${r.status}: ${r.stderr}`);
}

function runBundle(projectDir, prune) {
  const args = [BUNDLE, '-d', projectDir];
  if (prune) args.push('--prune', prune);
  const r = spawnSync(process.execPath, args, { encoding: 'utf8' });
  assert.strictEqual(r.status, 0, `bundle ide-sync exited ${r.status}: ${r.stderr}`);
}

process.stdout.write('IDE-sync engine/bundle parity\n');

check('bundle exists (run `npm run vendor:build` if missing)', () => {
  assert.ok(fs.existsSync(BUNDLE), `missing ${BUNDLE}`);
});

const cleanup = [];
try {
  // Distribute: engine vs bundle must yield identical IDE trees.
  check('distribute: engine == bundle', () => {
    const a = makeProject(['sk-a', 'sk-b']);
    const b = makeProject(['sk-a', 'sk-b']);
    cleanup.push(a, b);
    runEngine(a);
    runBundle(b);
    assert.deepStrictEqual(snapshotIdeDirs(a), snapshotIdeDirs(b));
    assert.ok(fs.existsSync(path.join(a, '.claude', 'skills', 'sk-a', 'SKILL.md')), 'engine did not distribute');
  });

  // Prune one skill (the remove path): engine vs bundle must agree.
  check('prune: engine == bundle and removes pruned skill', () => {
    const a = makeProject(['sk-a']); // sk-b dropped from manifest
    const b = makeProject(['sk-a']);
    cleanup.push(a, b);
    runEngine(a, 'sk-b');
    runBundle(b, 'sk-b');
    assert.deepStrictEqual(snapshotIdeDirs(a), snapshotIdeDirs(b));
    assert.ok(!fs.existsSync(path.join(a, '.claude', 'skills', 'sk-b')), 'pruned skill should be gone');
    assert.ok(fs.existsSync(path.join(a, '.claude', 'skills', 'sk-a')), 'kept skill should remain');
  });
} finally {
  for (const d of cleanup) fs.rmSync(d, { recursive: true, force: true });
}

process.stdout.write(`\n  ${passed} pass · ${failed} fail\n`);
process.exit(failed > 0 ? 1 : 0);
