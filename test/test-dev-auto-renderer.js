/** Black-box tests for the installed dev-auto immutable snapshot renderer. */
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const REPO = path.resolve(__dirname, '..');
const SCRIPT_SRC = path.join(REPO, 'src', 'scripts');
const SKILL_SRC = path.join(REPO, 'src', 'bmm-skills', '4-implementation', 'bmad-dev-auto');
const tempDirs = [];
let total = 0;
let passed = 0;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`  PASS ${name}`);
  } catch (error) {
    console.error(`  FAIL ${name}: ${error.message}`);
  }
}

async function asyncTest(name, fn) {
  total++;
  try {
    await fn();
    passed++;
    console.log(`  PASS ${name}`);
  } catch (error) {
    console.error(`  FAIL ${name}: ${error.message}`);
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function baseConfig(extra = '') {
  return [
    '[core]',
    'communication_language = "English"',
    'document_output_language = "French"',
    '',
    '[modules.bmm]',
    'user_skill_level = "expert"',
    'planning_artifacts = "{project-root}/planning"',
    'implementation_artifacts = "{project-root}/implementation"',
    extra,
    '',
  ].join('\n');
}

function fixture({ sharedBmad, config = baseConfig() } = {}) {
  const outer = fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-dev-auto-render-'));
  tempDirs.push(outer);
  const project = path.join(outer, 'project');
  const bmad = sharedBmad || path.join(outer, 'installed-bmad');
  fs.mkdirSync(project, { recursive: true });
  if (!sharedBmad) {
    fs.mkdirSync(path.join(bmad, 'scripts'), { recursive: true });
    for (const name of ['config_utils.py', 'render_skill.py']) {
      fs.copyFileSync(path.join(SCRIPT_SRC, name), path.join(bmad, 'scripts', name));
    }
    copyDir(SKILL_SRC, path.join(bmad, 'bmm', 'bmad-dev-auto'));
    fs.writeFileSync(path.join(bmad, 'config.toml'), config, 'utf8');
  }
  fs.symlinkSync(bmad, path.join(project, '_bmad'), process.platform === 'win32' ? 'junction' : 'dir');
  fs.mkdirSync(path.join(project, 'nested', 'cwd'), { recursive: true });
  return { outer, project, bmad, skill: path.join(bmad, 'bmm', 'bmad-dev-auto') };
}

function run(fix, cwd = fix.project) {
  return spawnSync(
    'uv',
    ['run', '--python', '3.11', path.join(fix.bmad, 'scripts', 'render_skill.py'), '--project-root', fix.project, '--skill', fix.skill],
    {
      cwd,
      encoding: 'utf8',
    },
  );
}

function runAsync(fix) {
  return new Promise((resolve) => {
    const child = spawn(
      'uv',
      ['run', '--python', '3.11', path.join(fix.bmad, 'scripts', 'render_skill.py'), '--project-root', fix.project, '--skill', fix.skill],
      { cwd: fix.project },
    );
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => (stdout += chunk));
    child.stderr.on('data', (chunk) => (stderr += chunk));
    child.on('error', (error) => resolve({ status: null, stdout, stderr: `${stderr}${error.message}` }));
    child.on('close', (status) => resolve({ status, stdout, stderr }));
  });
}

function entry(result) {
  assert(result.status === 0, `renderer failed: ${result.stdout}${result.stderr}`);
  const lines = result.stdout.trim().split('\n');
  const prefix = 'read and follow ';
  const outputPath = lines[0]?.slice(prefix.length);
  assert(lines.length === 1 && lines[0].startsWith(prefix) && path.isAbsolute(outputPath), `bad dispatch: ${result.stdout}`);
  return outputPath;
}

function bytesByName(directory) {
  return Object.fromEntries(
    fs
      .readdirSync(directory)
      .sort()
      .map((name) => [name, fs.readFileSync(path.join(directory, name))]),
  );
}

function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

async function main() {
  const fix = fixture();
  let firstEntry;
  let firstBytes;

  test('one uv call from a nested cwd publishes one absolute dispatch', () => {
    const result = run(fix, path.join(fix.project, 'nested', 'cwd'));
    firstEntry = entry(result);
    assert(path.isAbsolute(firstEntry), 'entry is not absolute');
    assert(fs.existsSync(firstEntry), 'entry does not exist');
    firstBytes = bytesByName(path.dirname(firstEntry));
  });

  test('snapshot excludes SKILL.md and manifest hashes every rendered output', () => {
    const dir = path.dirname(firstEntry);
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
    const actualNames = fs.readdirSync(dir).sort();
    const expectedNames = [...Object.keys(manifest.outputs), 'manifest.json'].sort();
    assert(JSON.stringify(actualNames) === JSON.stringify(expectedNames), 'snapshot file set differs from manifest');
    assert(!fs.existsSync(path.join(dir, 'SKILL.md')), 'SKILL.md was published');
    assert(manifest.project_root === fs.realpathSync(fix.project), 'manifest root is wrong');
    for (const [name, expected] of Object.entries(manifest.outputs)) {
      assert(hash(fs.readFileSync(path.join(dir, name))) === expected, `bad output hash for ${name}`);
    }
  });

  test('compile tokens disappear, runtime placeholders survive, and references stay in generation', () => {
    const dir = path.dirname(firstEntry);
    const markdown = fs
      .readdirSync(dir)
      .filter((name) => name.endsWith('.md'))
      .map((name) => fs.readFileSync(path.join(dir, name), 'utf8'))
      .join('\n');
    assert(!/\{\{\.|\{workflow\.|\[\[bmad-snapshot:/.test(markdown), 'compile token survived');
    assert(markdown.includes('{spec_file}'), 'runtime placeholder was removed');
    assert(markdown.includes('tailored to `expert`'), 'user_skill_level behavior missing');
    for (const match of markdown.matchAll(/`(\/[^`]+\/step-[^`]+\.md)`/g)) {
      assert(path.dirname(match[1]) === dir, `cross-generation reference: ${match[1]}`);
    }
  });

  test('identical input and irrelevant config changes reuse immutable bytes', () => {
    const second = entry(run(fix));
    assert(second === firstEntry, 'identical input created a generation');
    fs.appendFileSync(path.join(fix.bmad, 'config.toml'), '\nunreferenced_value = "ignored"\n');
    const third = entry(run(fix));
    assert(third === firstEntry, 'unreferenced config changed generation identity');
    const current = bytesByName(path.dirname(firstEntry));
    for (const name of Object.keys(firstBytes)) {
      assert(firstBytes[name].equals(current[name]), `immutable file changed: ${name}`);
    }
  });

  test('effective source changes publish a new generation and preserve the old one', () => {
    fs.appendFileSync(path.join(fix.skill, 'compile-epic-context.md'), '\n<!-- effective change -->\n');
    const next = entry(run(fix));
    assert(next !== firstEntry, 'effective change reused generation');
    const current = bytesByName(path.dirname(firstEntry));
    for (const name of Object.keys(firstBytes)) {
      assert(firstBytes[name].equals(current[name]), `old generation changed: ${name}`);
    }
  });

  test('a referenced resolved value publishes a new generation', () => {
    const configured = fixture();
    const before = entry(run(configured));
    fs.writeFileSync(path.join(configured.bmad, 'config.user.toml'), '[core]\ncommunication_language = "Japanese"\n', 'utf8');
    const after = entry(run(configured));
    assert(after !== before, 'referenced config change reused generation');
    assert(fs.readFileSync(after, 'utf8').includes('Speak in `Japanese`'), 'new value was not rendered');
    assert(fs.existsSync(before), 'prior generation disappeared');
  });

  test('two project roots sharing _bmad get distinct root-bound snapshots', () => {
    const other = fixture({ sharedBmad: fix.bmad });
    const one = entry(run(fix));
    const two = entry(run(other));
    assert(one !== two, 'shared roots collided');
    assert(fs.readFileSync(two, 'utf8').includes(other.project), 'second root was not baked');
    assert(fs.readFileSync(one, 'utf8').includes(fix.project), 'first root lost its binding');
  });

  await asyncTest('concurrent identical renderers both reuse one complete generation', async () => {
    const concurrent = fixture();
    const results = await Promise.all([runAsync(concurrent), runAsync(concurrent)]);
    const entries = results.map(entry);
    assert(entries[0] === entries[1], 'concurrent renderers returned different generations');
    assert(fs.existsSync(path.join(path.dirname(entries[0]), 'manifest.json')), 'manifest missing');
  });

  test('malformed present config and customization layers HALT without traceback or dispatch', () => {
    const invalid = fixture();
    fs.mkdirSync(path.join(invalid.bmad, 'custom'), { recursive: true });
    fs.writeFileSync(path.join(invalid.bmad, 'custom', 'config.toml'), '[core\nbad', 'utf8');
    let result = run(invalid);
    assert(result.status !== 0 && result.stdout.startsWith('HALT:'), 'malformed config did not HALT');
    assert(!result.stdout.includes('read and follow') && !result.stderr.includes('Traceback'), 'failure leaked dispatch/traceback');
    fs.rmSync(path.join(invalid.bmad, 'custom', 'config.toml'));
    fs.writeFileSync(path.join(invalid.bmad, 'custom', 'bmad-dev-auto.toml'), '[workflow\nbad', 'utf8');
    result = run(invalid);
    assert(result.status !== 0 && result.stdout.includes('failed to parse'), 'malformed customization did not HALT');
  });

  test('missing, wrong-type, and non-string keyed values HALT cleanly', () => {
    const missing = fixture({ config: baseConfig().replace('user_skill_level = "expert"\n', '') });
    assert(run(missing).stdout.includes('missing config value'), 'missing value accepted');
    const wrong = fixture({ config: baseConfig().replace('user_skill_level = "expert"', 'user_skill_level = 42') });
    assert(run(wrong).stdout.includes('must be a string'), 'wrong type accepted');
    const keyed = fixture();
    fs.mkdirSync(path.join(keyed.bmad, 'custom'), { recursive: true });
    fs.writeFileSync(
      path.join(keyed.bmad, 'custom', 'bmad-dev-auto.toml'),
      '[[workflow.review_layers]]\nid = 42\nname = "bad"\ninstruction = "bad"\n',
      'utf8',
    );
    assert(run(keyed).stdout.includes('identifier `id` must be a string'), 'non-string id accepted');
  });

  test('snapshot-like text inside customization prose is preserved', () => {
    const custom = fixture();
    fs.mkdirSync(path.join(custom.bmad, 'custom'), { recursive: true });
    const literal = '[[bmad-snapshot:step-04-review.md]]';
    const compileLiteral = '{workflow.implementation_handoff}';
    fs.writeFileSync(
      path.join(custom.bmad, 'custom', 'bmad-dev-auto.user.toml'),
      `[workflow]\non_complete = "Preserve ${literal} and ${compileLiteral} as prose"\n`,
      'utf8',
    );
    const output = fs.readFileSync(entry(run(custom)), 'utf8');
    assert(output.includes(literal), 'customization prose was globally rewritten');
    assert(output.includes(compileLiteral), 'customization compile-token prose was rewritten');
  });

  test('review layer overrides, guards, disabling, and the empty-layer HALT are rendered', () => {
    const reviewed = fixture();
    fs.mkdirSync(path.join(reviewed.bmad, 'custom'), { recursive: true });
    fs.writeFileSync(
      path.join(reviewed.bmad, 'custom', 'bmad-dev-auto.toml'),
      [
        '[[workflow.review_layers]]',
        'id = "blind-hunter"',
        'name = "Replacement"',
        'instruction = "Run replacement review."',
        'when = "the replacement condition holds"',
        '',
      ].join('\n'),
      'utf8',
    );
    let review = fs.readFileSync(path.join(path.dirname(entry(run(reviewed))), 'step-04-review.md'), 'utf8');
    assert(review.includes('Replacement (`blind-hunter`)'), 'keyed review override missing');
    assert(review.includes('Run only when: the replacement condition holds'), 'review guard missing');
    assert(review.includes('Run replacement review.'), 'review instruction missing');

    const ids = ['blind-hunter', 'edge-case-hunter', 'verification-gap', 'intent-alignment'];
    fs.writeFileSync(
      path.join(reviewed.bmad, 'custom', 'bmad-dev-auto.toml'),
      ids.map((id) => `[[workflow.review_layers]]\nid = "${id}"\nname = "disabled"\ninstruction = ""\n`).join('\n'),
      'utf8',
    );
    review = fs.readFileSync(path.join(path.dirname(entry(run(reviewed))), 'step-04-review.md'), 'utf8');
    assert(review.includes('No active review layers. HALT'), 'all-disabled review HALT missing');
  });

  test('contract and renderer identity changes create new immutable generations', () => {
    const identity = fixture();
    const original = entry(run(identity));
    fs.appendFileSync(path.join(identity.skill, 'render.toml'), '\n# identity change\n');
    const contractChanged = entry(run(identity));
    assert(contractChanged !== original, 'contract change reused generation');
    fs.appendFileSync(path.join(identity.bmad, 'scripts', 'render_skill.py'), '\n# renderer identity change\n');
    const rendererChanged = entry(run(identity));
    assert(rendererChanged !== contractChanged, 'renderer change reused generation');
    assert(fs.existsSync(original) && fs.existsSync(contractChanged), 'prior identity generation disappeared');
  });

  test('invalid contract tokens, allow_empty types, reserved outputs, and source symlink escapes HALT', () => {
    for (const mutation of [
      (text) => text.replace('token = "{{.communication_language}}"', 'token = "{spec_file}"'),
      (text) => text.replace('allow_empty = true', 'allow_empty = "false"'),
      (text) => text.replace('"workflow.md",', '"workflow.md",\n  "manifest.json",'),
    ]) {
      const invalid = fixture();
      const contract = path.join(invalid.skill, 'render.toml');
      fs.writeFileSync(contract, mutation(fs.readFileSync(contract, 'utf8')), 'utf8');
      const result = run(invalid);
      assert(result.status !== 0 && result.stdout.startsWith('HALT:'), `invalid contract accepted: ${result.stdout}`);
    }

    const escaped = fixture();
    const outside = path.join(escaped.outer, 'outside.md');
    fs.writeFileSync(outside, 'outside', 'utf8');
    fs.rmSync(path.join(escaped.skill, 'workflow.md'));
    fs.symlinkSync(outside, path.join(escaped.skill, 'workflow.md'), 'file');
    assert(run(escaped).stdout.includes('escapes skill directory'), 'source symlink escape accepted');
  });

  test('long project basenames are bounded in the snapshot namespace', () => {
    const outer = fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-dev-auto-long-'));
    tempDirs.push(outer);
    const long = 'project-' + 'x'.repeat(220);
    const project = path.join(outer, long);
    const source = fixture();
    fs.mkdirSync(project);
    fs.symlinkSync(source.bmad, path.join(project, '_bmad'), process.platform === 'win32' ? 'junction' : 'dir');
    const longFix = { project, bmad: source.bmad, skill: source.skill };
    const output = entry(run(longFix));
    assert(path.basename(path.dirname(path.dirname(output))).length <= 93, 'namespace component was not bounded');
  });

  test('publication failure does not dispatch or alter another root snapshot', () => {
    const stable = fixture();
    const original = entry(run(stable));
    const originalBytes = bytesByName(path.dirname(original));
    const broken = fixture({ sharedBmad: stable.bmad });
    const slug = path
      .basename(broken.project)
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, '-');
    const rootHash = hash(Buffer.from(fs.realpathSync(broken.project))).slice(0, 12);
    const namespace = path.join(stable.bmad, 'render', 'bmad-dev-auto', `${slug}-${rootHash}`);
    fs.writeFileSync(namespace, 'not a directory', 'utf8');
    const result = run(broken);
    assert(result.status !== 0 && result.stdout.startsWith('HALT:'), 'publication failure did not HALT');
    assert(!result.stdout.includes('read and follow'), 'failed publication dispatched');
    const current = bytesByName(path.dirname(original));
    for (const name of Object.keys(originalBytes)) {
      assert(originalBytes[name].equals(current[name]), `stable snapshot changed: ${name}`);
    }
  });

  test('corrupt existing destination is never overwritten or dispatched', () => {
    const corrupt = fixture();
    const output = entry(run(corrupt));
    const workflow = path.join(path.dirname(output), 'workflow.md');
    fs.appendFileSync(workflow, 'corrupt');
    const result = run(corrupt);
    assert(result.status !== 0 && result.stdout.includes('hash mismatch'), 'corruption was reused');
    assert(fs.readFileSync(workflow, 'utf8').endsWith('corrupt'), 'corrupt generation was overwritten');
  });

  for (const dir of tempDirs) fs.rmSync(dir, { recursive: true, force: true });
  console.log(`\n${passed}/${total} dev-auto renderer tests passed`);
  process.exitCode = passed === total ? 0 : 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
