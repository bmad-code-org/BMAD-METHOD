const assert = require('node:assert/strict');
const os = require('node:os');
const path = require('node:path');
const yaml = require('yaml');
const fs = require('../tools/installer/fs-native');
const prompts = require('../tools/installer/prompts');
const { ManifestGenerator } = require('../tools/installer/core/manifest-generator');
const { OfficialModules } = require('../tools/installer/modules/official-modules');
const { UI } = require('../tools/installer/ui');
const { discoverShims, inferShimPreference } = require('../tools/installer/core/shim-policy');

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
    let confirmCalls = 0;
    try {
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
    } finally {
      OfficialModules.prototype.discoverShims = originalDiscover;
      prompts.confirm = originalConfirm;
    }

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

    console.log('Shim installation policy tests passed.');
  } finally {
    await fs.remove(root).catch(() => {});
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
