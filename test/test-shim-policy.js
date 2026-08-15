const assert = require('node:assert/strict');
const os = require('node:os');
const path = require('node:path');
const yaml = require('yaml');
const fs = require('../tools/installer/fs-native');
const prompts = require('../tools/installer/prompts');
const { ManifestGenerator } = require('../tools/installer/core/manifest-generator');
const { OfficialModules } = require('../tools/installer/modules/official-modules');
const { UI } = require('../tools/installer/ui');
const {
  discoverShims,
  formatRemovedShimNotice,
  formatRetainedShimNotice,
  inferShimPreference,
  readInstalledShims,
  selectShimOutcome,
} = require('../tools/installer/core/shim-policy');

async function writeSkill(directory, name, lifecycle) {
  await fs.ensureDir(directory);
  const frontmatter = {
    name,
    description: lifecycle === 'shim' ? 'Deprecated compatibility entry' : 'Use when testing active behavior',
  };
  if (lifecycle) frontmatter.metadata = { lifecycle };
  await fs.writeFile(path.join(directory, 'SKILL.md'), `---\n${yaml.stringify(frontmatter)}---\n\nTest skill.\n`);
}

async function run() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-shim-policy-'));

  try {
    const source = path.join(root, 'source');
    await writeSkill(path.join(source, 'plan', 'active-skill'), 'active-skill');
    await writeSkill(path.join(source, 'plan', 'legacy-name'), 'legacy-name', 'shim');

    const discovered = await discoverShims(source);
    assert.deepEqual(
      discovered.map((entry) => entry.id),
      ['legacy-name'],
      'shim discovery uses lifecycle metadata rather than directory naming',
    );
    assert.equal(
      discovered[0].description,
      'Deprecated compatibility entry',
      'discovery carries the description used to name the replacement',
    );

    assert.equal(inferShimPreference({ availableShims: discovered, existing: false }), false, 'fresh installations default shims off');
    assert.equal(
      inferShimPreference({ availableShims: discovered, installedSkillIds: new Set(['legacy-name']), existing: true }),
      true,
      'legacy installations containing a shim preserve it by default',
    );
    assert.equal(
      inferShimPreference({
        requested: false,
        persisted: true,
        availableShims: discovered,
        installedSkillIds: new Set(['legacy-name']),
        existing: true,
      }),
      false,
      'an explicit user choice disables previously installed shims',
    );
    assert.equal(
      inferShimPreference({ persisted: true, availableShims: [], installedSkillIds: new Set(['legacy-name']), existing: true }),
      false,
      'a shimless incoming release ignores the old enabled preference',
    );
    assert.equal(
      inferShimPreference({ persisted: false, availableShims: [], installedSkillIds: new Set(), existing: true }),
      false,
      'a shimless incoming release also updates installations that already omitted shims',
    );

    const moduleInstaller = new OfficialModules();
    const withoutShims = path.join(root, 'without-shims');
    await moduleInstaller.copyModuleWithFiltering(source, withoutShims, null, {}, { installShims: false });
    assert.equal(await fs.pathExists(path.join(withoutShims, 'plan', 'active-skill', 'SKILL.md')), true);
    assert.equal(await fs.pathExists(path.join(withoutShims, 'plan', 'legacy-name')), false);

    const withShims = path.join(root, 'with-shims');
    await moduleInstaller.copyModuleWithFiltering(source, withShims, null, {}, { installShims: true });
    assert.equal(await fs.pathExists(path.join(withShims, 'plan', 'active-skill', 'SKILL.md')), true);
    assert.equal(await fs.pathExists(path.join(withShims, 'plan', 'legacy-name', 'SKILL.md')), true);

    const rootShimSource = path.join(root, 'root-shim-source');
    await writeSkill(rootShimSource, 'root-shim', 'shim');
    const rootShimTarget = path.join(root, 'root-shim-target');
    await moduleInstaller.copyModuleWithFiltering(rootShimSource, rootShimTarget, null, {}, { installShims: false });
    assert.equal(await fs.pathExists(path.join(rootShimTarget, 'SKILL.md')), false, 'standalone plugin shims are filtered at their root');

    const originalDiscover = OfficialModules.prototype.discoverShims;
    const originalConfirm = prompts.confirm;
    const originalIsTTY = process.stdin.isTTY;
    let confirmCalls = 0;
    try {
      process.stdin.isTTY = true; // the prompt now skips itself without a TTY
      OfficialModules.prototype.discoverShims = async () => [];
      prompts.confirm = async () => {
        confirmCalls++;
        return true;
      };
      const selection = await new UI()._selectShimPreference({
        selectedModules: ['core'],
        bmadDir: path.join(root, '_bmad'),
        existing: true,
        options: {},
        channelOptions: null,
      });
      assert.equal(selection, undefined);
      assert.equal(confirmCalls, 0, 'no shim prompt is shown when the incoming release has no shims');

      const legacyBmadDir = path.join(root, 'legacy', '_bmad');
      await fs.ensureDir(path.join(legacyBmadDir, '_config'));
      await fs.writeFile(
        path.join(legacyBmadDir, '_config', 'manifest.yaml'),
        yaml.stringify({ installation: { version: '6.11.0' }, modules: [], ides: [] }),
      );
      await fs.writeFile(
        path.join(legacyBmadDir, '_config', 'skill-manifest.csv'),
        'canonicalId,name,description,module,path\n"legacy-name","legacy-name","Deprecated","core","_bmad/core/legacy-name/SKILL.md"\n',
      );

      OfficialModules.prototype.discoverShims = async () => [{ id: 'legacy-name' }];
      let offeredDefault;
      prompts.confirm = async (question) => {
        offeredDefault = question.default;
        return false;
      };
      const disabledByUser = await new UI()._selectShimPreference({
        selectedModules: ['core'],
        bmadDir: legacyBmadDir,
        existing: true,
        options: {},
        channelOptions: null,
      });
      assert.equal(offeredDefault, true, 'an existing installation containing shims keeps them enabled by default');
      assert.equal(disabledByUser, false, 'the interactive result records the user explicitly disabling shims');

      let quickUpdatePrompts = 0;
      let quickUpdateDefault;
      prompts.confirm = async (question) => {
        quickUpdatePrompts++;
        quickUpdateDefault = question.default;
        return question.default;
      };
      const quickUpdateKept = await new UI()._selectShimPreference({
        selectedModules: ['core'],
        bmadDir: legacyBmadDir,
        existing: true,
        options: {},
        channelOptions: null,
        quickUpdate: true,
      });
      assert.equal(quickUpdatePrompts, 1, 'quick update asks before carrying shims forward again');
      assert.equal(quickUpdateDefault, true, 'quick update defaults to keeping shims that are already installed');
      assert.equal(quickUpdateKept, true, 'accepting the default retains the shims');

      const shimlessBmadDir = path.join(root, 'shimless', '_bmad');
      await fs.ensureDir(path.join(shimlessBmadDir, '_config'));
      await fs.writeFile(
        path.join(shimlessBmadDir, '_config', 'manifest.yaml'),
        yaml.stringify({ installation: { version: '6.11.0', installShims: false }, modules: [], ides: [] }),
      );
      quickUpdatePrompts = 0;
      const quickUpdateSkipped = await new UI()._selectShimPreference({
        selectedModules: ['core'],
        bmadDir: shimlessBmadDir,
        existing: true,
        options: {},
        channelOptions: null,
        quickUpdate: true,
      });
      assert.equal(quickUpdatePrompts, 0, 'quick update stays quiet for an installation that already removed its shims');
      assert.equal(quickUpdateSkipped, false, 'a shimless installation keeps its standing answer');

      process.stdin.isTTY = undefined;
      quickUpdatePrompts = 0;
      const headless = await new UI()._selectShimPreference({
        selectedModules: ['core'],
        bmadDir: legacyBmadDir,
        existing: true,
        options: {},
        channelOptions: null,
        quickUpdate: true,
      });
      assert.equal(quickUpdatePrompts, 0, 'a run with no TTY never reaches the prompt');
      assert.equal(headless, true, 'a headless run keeps the shims it already had');
    } finally {
      OfficialModules.prototype.discoverShims = originalDiscover;
      prompts.confirm = originalConfirm;
      process.stdin.isTTY = originalIsTTY;
    }

    const installedShims = await readInstalledShims(path.join(root, 'legacy', '_bmad'));
    assert.deepEqual(
      installedShims.map((shim) => shim.id),
      ['legacy-name'],
      'installed shims are recovered from the manifest, independent of what the incoming release ships',
    );
    assert.deepEqual(await readInstalledShims(path.join(root, 'nothing-here')), [], 'a missing manifest reports no installed shims');

    // The v7 cut: the release ships no shims at all, so nothing is discoverable
    // in source, yet the update still deletes what is installed.
    const v7 = selectShimOutcome({ installedShims, availableShims: [], install: false });
    assert.equal(v7.retained.length, 0);
    assert.deepEqual(
      v7.removed.map((shim) => shim.id),
      ['legacy-name'],
      'a shimless release still reports the shims it is deleting',
    );
    const v7Notice = formatRemovedShimNotice(v7.removed, { canReinstall: false });
    assert.match(v7Notice, /legacy-name/, 'the retired shim is named in the notice');
    assert.match(v7Notice, /--shims cannot bring them back/, 'a retired shim is not advertised as reinstallable');
    assert.match(formatRemovedShimNotice(v7.removed), /re-run with --shims/, 'a shim the release still ships can be restored');

    // A shim retired from source while the user keeps the rest: retained and
    // removed are both non-empty in the same run.
    const partial = selectShimOutcome({
      installedShims: [{ id: 'still-shipped' }, { id: 'retired' }],
      availableShims: [{ id: 'still-shipped' }],
      install: true,
    });
    assert.deepEqual(
      partial.retained.map((shim) => shim.id),
      ['still-shipped'],
    );
    assert.deepEqual(
      partial.removed.map((shim) => shim.id),
      ['retired'],
      'a shim dropped from source is reported as removed even while shims stay enabled',
    );

    assert.deepEqual(
      selectShimOutcome({ installedShims, availableShims: [{ id: 'legacy-name' }], install: true }).removed,
      [],
      'nothing is reported removed when the shim is reinstalled',
    );

    const manifestDir = path.join(root, 'manifest', '_config');
    await fs.ensureDir(manifestDir);
    const generator = new ManifestGenerator();
    generator.modules = [];
    generator.selectedIdes = [];
    generator.bmadDir = path.dirname(manifestDir);
    generator.shimsAvailable = false;
    generator.installShims = true;
    await generator.writeMainManifest(manifestDir);
    const shimlessManifest = yaml.parse(await fs.readFile(path.join(manifestDir, 'manifest.yaml'), 'utf8'));
    assert.equal('installShims' in shimlessManifest.installation, false, 'dead shim preference is omitted from a shimless manifest');

    generator.shimsAvailable = true;
    generator.installShims = false;
    await generator.writeMainManifest(manifestDir);
    const availableManifest = yaml.parse(await fs.readFile(path.join(manifestDir, 'manifest.yaml'), 'utf8'));
    assert.equal(availableManifest.installation.installShims, false, 'the active user preference is persisted while shims exist');

    const notice = formatRetainedShimNotice([
      { id: 'bmad-market-research', description: 'Deprecated — forwards to bmad-deep-recon (market type)', module: 'bmm' },
      { id: 'bmad-editorial-review', description: 'Deprecated — forwards to bmad-review' },
      { id: 'no-description' },
    ]);
    assert.match(notice, /3 deprecated shim skill\(s\) are still installed/, 'the notice counts what is being kept');
    assert.match(notice, /bmad-market-research \(bmm\): forwards to bmad-deep-recon \(market type\)/, 'each shim names its replacement');
    assert.match(notice, /bmad-editorial-review: forwards to bmad-review/, 'the module suffix is omitted when unknown');
    assert.match(notice, /^ {2}no-description$/m, 'a shim without a description still gets listed');
    assert.match(notice, /re-run Quick Update/, 'the notice tells the user how to remove them');

    const removalNotice = formatRemovedShimNotice([
      { id: 'bmad-market-research', description: 'Deprecated — forwards to bmad-deep-recon (market type)', module: 'bmm' },
    ]);
    assert.match(removalNotice, /1 deprecated shim skill\(s\) are being removed/, 'removal is reported, not silent');
    assert.match(removalNotice, /bmad-market-research \(bmm\): forwards to bmad-deep-recon/, 'the removal names what is going away');
    assert.match(removalNotice, /--shims/, 'the removal notice says how to undo it');
    assert.equal(/Deprecated\s*—\s*forwards/.test(notice), false, 'the redundant "Deprecated" prefix is stripped from each line');

    console.log('Shim installation policy tests passed.');
  } finally {
    await fs.remove(root).catch(() => {});
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
