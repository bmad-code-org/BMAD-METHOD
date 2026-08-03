// Test only deterministic renderer behavior.
// Do not test model inference or assert prose copied verbatim from skill sources.
/** Black-box tests for the shared immutable snapshot renderer, covering both bmad-build-auto and bmad-build. */
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const REPO = path.resolve(__dirname, '..');
const SCRIPT_SRC = path.join(REPO, 'src', 'scripts');
const SKILLS_SRC = path.join(REPO, 'src', 'bmm-skills', 'ship');
const DEFAULT_SKILL = 'bmad-build-auto';
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

function fixture({ sharedBmad, config = baseConfig(), projectName = 'project', skillName = DEFAULT_SKILL } = {}) {
  const outer = fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-build-auto-render-'));
  tempDirs.push(outer);
  const project = path.join(outer, projectName);
  const bmad = sharedBmad || path.join(outer, 'installed-bmad');
  fs.mkdirSync(project, { recursive: true });
  if (!sharedBmad) {
    fs.mkdirSync(path.join(bmad, 'scripts'), { recursive: true });
    for (const name of ['config_utils.py', 'render_skill.py']) {
      fs.copyFileSync(path.join(SCRIPT_SRC, name), path.join(bmad, 'scripts', name));
    }
    copyDir(path.join(SKILLS_SRC, skillName), path.join(bmad, 'bmm', skillName));
    fs.writeFileSync(path.join(bmad, 'config.toml'), config, 'utf8');
  }
  fs.symlinkSync(bmad, path.join(project, '_bmad'), process.platform === 'win32' ? 'junction' : 'dir');
  fs.mkdirSync(path.join(project, 'nested', 'cwd'), { recursive: true });
  return { outer, project, bmad, skillName, skill: path.join(bmad, 'bmm', skillName) };
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
  const files = {};

  function visit(current, relative = '') {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const name = relative ? path.posix.join(relative, entry.name) : entry.name;
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) visit(fullPath, name);
      else files[name] = fs.readFileSync(fullPath);
    }
  }

  visit(directory);
  return Object.fromEntries(Object.entries(files).sort(([left], [right]) => left.localeCompare(right)));
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

  test('renderer execution leaves no bytecode cache beside installed files', () => {
    assert(!fs.existsSync(path.join(fix.bmad, 'scripts', '__pycache__')), 'shared-script bytecode cache was created');
    assert(!fs.existsSync(path.join(fix.skill, '__pycache__')), 'skill bytecode cache was created');
  });

  test('snapshot excludes SKILL.md and manifest hashes every rendered output', () => {
    const dir = path.dirname(firstEntry);
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
    const actualNames = Object.keys(bytesByName(dir));
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
    assert(!/\{\{(?:\.|config\.)|\{workflow\.|\[\[bmad-snapshot:/.test(markdown), 'compile token survived');
    assert(!markdown.includes('{skill-root}'), 'mutable skill-root reference survived');
    assert(markdown.includes('{spec_file}'), 'runtime placeholder was removed');
    assert(markdown.includes('tailored to `expert`'), 'user_skill_level behavior missing');
    // Blind hunter is inlined in customize.toml; only file-backed reviewers ship under review-prompts/.
    for (const prompt of ['edge-case-hunter.md', 'verification-gap.md']) {
      const promptPath = path.join(dir, 'review-prompts', prompt);
      assert(markdown.includes(promptPath), `snapshot reviewer path missing: ${prompt}`);
      assert(fs.existsSync(promptPath), `snapshot reviewer missing: ${prompt}`);
    }
    assert(markdown.includes('Conduct a review of CONTENT.'), 'inlined blind-hunter prompt missing from rendered layers');
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
    fs.writeFileSync(path.join(invalid.bmad, 'custom', `${invalid.skillName}.toml`), '[workflow\nbad', 'utf8');
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
      path.join(keyed.bmad, 'custom', `${keyed.skillName}.toml`),
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
      path.join(custom.bmad, 'custom', `${custom.skillName}.user.toml`),
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
      path.join(reviewed.bmad, 'custom', `${reviewed.skillName}.toml`),
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
      path.join(reviewed.bmad, 'custom', `${reviewed.skillName}.toml`),
      ids.map((id) => `[[workflow.review_layers]]\nid = "${id}"\nname = "disabled"\ninstruction = ""\n`).join('\n'),
      'utf8',
    );
    review = fs.readFileSync(path.join(path.dirname(entry(run(reviewed))), 'step-04-review.md'), 'utf8');
    assert(review.includes('No active review layers. HALT'), 'all-disabled review HALT missing');
  });

  test('renderer identity changes create a new immutable generation', () => {
    const identity = fixture();
    const original = entry(run(identity));
    fs.appendFileSync(path.join(identity.bmad, 'scripts', 'render_skill.py'), '\n# renderer identity change\n');
    const rendererChanged = entry(run(identity));
    assert(rendererChanged !== original, 'renderer change reused generation');
    assert(fs.existsSync(original), 'prior identity generation disappeared');
  });

  test('Markdown sources are discovered without a duplicate render contract', () => {
    const discovered = fixture();
    fs.writeFileSync(path.join(discovered.skill, 'extra.md'), 'Speak in {{config.core.communication_language}}.\n', 'utf8');
    const output = entry(run(discovered));
    const extra = path.join(path.dirname(output), 'extra.md');
    assert(fs.readFileSync(extra, 'utf8').includes('Speak in English.'), 'discovered source was not rendered');
    assert(!fs.existsSync(path.join(discovered.skill, 'render.toml')), 'duplicate render contract exists');
  });

  test('shared renderer accepts a convention-only skill without customization', () => {
    const generic = fixture();
    const skill = path.join(generic.bmad, 'core', 'plain-workflow');
    fs.mkdirSync(skill, { recursive: true });
    fs.writeFileSync(path.join(skill, 'workflow.md'), 'Read [[bmad-snapshot:step.md]].\n', 'utf8');
    fs.writeFileSync(path.join(skill, 'step.md'), 'No rendered values required.\n', 'utf8');
    const output = entry(run({ ...generic, skill }));
    assert(output.includes(`${path.sep}render${path.sep}plain-workflow${path.sep}`), 'generic skill namespace missing');
    assert(fs.existsSync(path.join(path.dirname(output), 'step.md')), 'generic skill source missing');
  });

  test('ambiguous shorthand config and source symlink escapes HALT', () => {
    const invalid = fixture({ config: baseConfig('communication_language = "German"') });
    let result = run(invalid);
    assert(result.status !== 0 && result.stdout.includes('ambiguous config value'), 'ambiguous config accepted');

    const escaped = fixture();
    const outside = path.join(escaped.outer, 'outside.md');
    fs.writeFileSync(outside, 'outside', 'utf8');
    fs.rmSync(path.join(escaped.skill, 'workflow.md'));
    fs.symlinkSync(outside, path.join(escaped.skill, 'workflow.md'), 'file');
    result = run(escaped);
    assert(result.stdout.includes('escapes skill directory'), 'source symlink escape accepted');
  });

  test('long project basenames are bounded in the snapshot namespace', () => {
    const outer = fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-build-auto-long-'));
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

  test('snapshot paths remain opaque when the project root resembles render tokens', () => {
    const special = fixture({ projectName: '{workflow.on_complete}-{{.communication_language}}' });
    const output = entry(run(special));
    const workflow = fs.readFileSync(output, 'utf8');
    const match = workflow.match(/`([^`]*step-01-clarify-and-route\.md)`/);
    assert(match, 'rendered workflow has no first-step reference');
    assert(match[1].startsWith(fs.realpathSync(special.project)), 'project root was rewritten as a source token');
    assert(fs.existsSync(match[1]), 'rendered first-step reference does not exist');
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
    const namespace = path.join(stable.bmad, 'render', stable.skillName, `${slug}-${rootHash}`);
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

  test('bmad-build renders through the same shared snapshot contract', () => {
    const build = fixture({ skillName: 'bmad-build' });
    const output = entry(run(build));
    const dir = path.dirname(output);
    assert(path.basename(output) === 'workflow.md', `dispatch is not a snapshot workflow.md: ${output}`);
    assert(output.includes(`${path.sep}render${path.sep}bmad-build${path.sep}`), 'bmad-build snapshot namespace missing');

    const markdown = Object.entries(bytesByName(dir))
      .filter(([name]) => name.endsWith('.md'))
      .map(([, content]) => content.toString('utf8'))
      .join('\n');
    assert(!markdown.includes('{{.'), 'config token survived');
    assert(!markdown.includes('{workflow.'), 'customization token survived');
    assert(!markdown.includes('[[bmad-snapshot:'), 'snapshot token survived');
    assert(!/`\.{1,2}\/[^`]*\.md`/.test(markdown), 'relative skill-root reference survived');
    assert(!markdown.includes('resolve_customization.py'), 'legacy renderer script referenced');
    assert(!markdown.includes('main_config'), 'legacy config variable referenced');

    const renderRoot = path.join(fs.realpathSync(build.project), '_bmad', 'render');
    const referenced = new Set();
    for (const match of markdown.matchAll(/`(\/[^`]+\.md)`/g)) {
      const target = match[1];
      if (!target.startsWith(`${renderRoot}${path.sep}`)) continue;
      assert(target.startsWith(`${dir}${path.sep}`), `cross-generation reference: ${target}`);
      assert(fs.existsSync(target), `snapshot reference does not resolve: ${target}`);
      referenced.add(path.relative(dir, target));
    }
    // Every published step must be reachable, which also keeps the loop above non-vacuous.
    for (const name of Object.keys(bytesByName(dir))) {
      if (!/^(?:step-|sync-sprint-status)/.test(name)) continue;
      assert(referenced.has(name), `published step is unreachable from the snapshot: ${name}`);
    }

    const prompt = path.join(dir, 'review-prompts', 'edge-case-hunter.md');
    assert(fs.existsSync(prompt), 'review prompt was not published into the snapshot');
    assert(markdown.includes(prompt), 'snapshot reviewer path missing');

    const review = fs.readFileSync(path.join(dir, 'step-04-review.md'), 'utf8');
    for (const heading of [
      '#### Blind Hunter (`blind-hunter`)',
      '#### Edge Case Hunter (`edge-case-hunter`)',
      '#### Verification Gap Reviewer (`verification-gap`)',
    ]) {
      assert(review.includes(heading), `default review layer missing: ${heading}`);
    }
    assert(review.includes('{diff_output}'), 'runtime placeholder was removed from review layers');

    const oneshot = fs.readFileSync(path.join(dir, 'step-oneshot.md'), 'utf8');
    assert(oneshot.includes('#### Blind Hunter (`blind-hunter`)'), 'oneshot review layer block missing');

    // The spec editor handoff must reach both terminal routes (#2652).
    const present = fs.readFileSync(path.join(dir, 'step-05-present.md'), 'utf8');
    assert(present.includes('code -r'), 'open_spec default missing from step-05-present.md');
    assert(oneshot.includes('code -r'), 'open_spec default missing from step-oneshot.md');
    assert(/^Offer to push\b/m.test(present), 'standalone "Offer to push" line was lost');

    const artifacts = `${fs.realpathSync(build.project)}/implementation`;
    assert(markdown.includes(`${artifacts}/sprint-status.yaml`), 'sprint-status path was not baked absolute');
    assert(markdown.includes(`${artifacts}/deferred-work.md`), 'deferred-work path was not baked absolute');

    for (const name of ['step-01-clarify-and-route.md', 'step-02-plan.md', 'step-04-review.md', 'step-oneshot.md']) {
      const site = fs.readFileSync(path.join(dir, name), 'utf8');
      assert(site.includes(`${artifacts}/deferred-work.md`), `${name} does not contain the deferred-work path`);
    }

    const shipped = fs.readFileSync(path.join(SKILLS_SRC, 'bmad-build', 'customize.toml'), 'utf8');
    assert(
      !shipped.includes('{absolute-root}') && !shipped.includes('{absolute-spec-file}'),
      'legacy absolute-path token in customize.toml',
    );
  });

  test('empty open_spec override disables automatic opening', () => {
    const build = fixture({ skillName: 'bmad-build' });
    fs.mkdirSync(path.join(build.bmad, 'custom'), { recursive: true });
    fs.writeFileSync(path.join(build.bmad, 'custom', `${build.skillName}.user.toml`), '[workflow]\nopen_spec = ""\n', 'utf8');
    const dir = path.dirname(entry(run(build)));
    for (const name of ['step-05-present.md', 'step-oneshot.md']) {
      const rendered = fs.readFileSync(path.join(dir, name), 'utf8');
      assert(!rendered.includes('code -r'), `open_spec default survived in ${name}`);
      assert(!rendered.includes('spec was sent'), `opening summary survived in ${name}`);
      assert(rendered.includes('Suggested Review Order'), `review trail generation disappeared from ${name}`);
    }
  });

  test('the command shipped in SKILL.md dispatches for both skills', () => {
    for (const skillName of [DEFAULT_SKILL, 'bmad-build']) {
      const fix = fixture({ skillName });
      const fenced = fs.readFileSync(path.join(fix.skill, 'SKILL.md'), 'utf8').match(/```bash\n([\s\S]*?)```/);
      assert(fenced, `${skillName}: SKILL.md ships no bash command block`);
      const command = fenced[1].trim().replaceAll('{project-root}', fix.project).replaceAll('{skill-root}', fix.skill);
      assert(!command.includes('{'), `${skillName}: unsubstituted placeholder in shipped command: ${command}`);
      // Run it verbatim from a nested cwd — no --python pin, exactly as an agent would.
      const dispatched = entry(spawnSync(command, { cwd: path.join(fix.project, 'nested', 'cwd'), shell: true, encoding: 'utf8' }));
      assert(path.basename(dispatched) === 'workflow.md', `${skillName}: shipped command did not dispatch workflow.md`);
      assert(fs.existsSync(dispatched), `${skillName}: dispatched entry does not exist`);
    }
  });

  for (const dir of tempDirs) fs.rmSync(dir, { recursive: true, force: true });
  console.log(`\n${passed}/${total} shared renderer tests passed`);
  process.exitCode = passed === total ? 0 : 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
