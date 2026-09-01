const path = require('node:path');
const fs = require('../fs-native');
const yaml = require('yaml');
const csv = require('csv-parse/sync');

function parseSkillMetadata(content) {
  const normalized = content.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  try {
    const frontmatter = yaml.parse(match[1]);
    return frontmatter && typeof frontmatter === 'object' ? frontmatter : null;
  } catch {
    return null;
  }
}

function isShimSkill(metadata) {
  return metadata?.metadata?.lifecycle === 'shim';
}

async function discoverShims(modulePath) {
  const shims = [];

  const walk = async (dir) => {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    const skillFile = path.join(dir, 'SKILL.md');
    if (await fs.pathExists(skillFile)) {
      const metadata = parseSkillMetadata(await fs.readFile(skillFile, 'utf8'));
      if (isShimSkill(metadata)) {
        shims.push({
          id: metadata.name || path.basename(dir),
          description: typeof metadata.description === 'string' ? metadata.description : '',
          directory: dir,
          relativeDirectory: path.relative(modulePath, dir),
        });
      }
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
      await walk(path.join(dir, entry.name));
    }
  };

  await walk(modulePath);
  return shims;
}

async function readSkillManifest(bmadDir) {
  const manifestPath = path.join(bmadDir, '_config', 'skill-manifest.csv');
  if (!(await fs.pathExists(manifestPath))) return [];

  try {
    const content = await fs.readFile(manifestPath, 'utf8');
    return csv.parse(content, { columns: true, skip_empty_lines: true });
  } catch {
    // A missing or unreadable legacy manifest means there is no reliable
    // evidence that compatibility shims were installed.
    return [];
  }
}

async function readInstalledSkillIds(bmadDir) {
  const ids = new Set();
  for (const record of await readSkillManifest(bmadDir)) {
    if (record.canonicalId) ids.add(record.canonicalId);
  }
  return ids;
}

// The installed manifest carries no lifecycle column, so the description
// prefix every shim ships with is the only record of what was a shim. This
// is the same signal validate_skills.py uses to exempt them.
async function readInstalledShims(bmadDir) {
  const shims = [];
  for (const record of await readSkillManifest(bmadDir)) {
    if (!record.canonicalId || !/^\s*deprecated\b/i.test(record.description || '')) continue;
    shims.push({ id: record.canonicalId, description: record.description || '', module: record.module || '' });
  }
  return shims;
}

function inferShimPreference({ requested, persisted, availableShims = [], installedSkillIds = new Set(), existing = false }) {
  if (availableShims.length === 0) return false;
  if (typeof requested === 'boolean') return requested;
  if (typeof persisted === 'boolean') return persisted;
  if (!existing) return false;

  return availableShims.some((shim) => installedSkillIds.has(shim.id));
}

// Removal is driven by what is installed, not by what this release ships: a
// shim retired from source is still deleted by the update cleanup.
function selectShimOutcome({ installedShims = [], availableShims = [], install = false }) {
  const availableShimIds = new Set(availableShims.map((shim) => shim.id));
  return {
    retained: install ? availableShims : [],
    removed: installedShims.filter((shim) => !(install && availableShimIds.has(shim.id))),
  };
}

// Shim descriptions all open with "Deprecated — "; the notice heading says it once.
function describeShim(shim) {
  const cleaned = (shim.description || '').replace(/^\s*deprecated\s*[-–—:]*\s*/i, '').trim();
  const source = shim.module ? ` (${shim.module})` : '';
  return cleaned ? `  ${shim.id}${source}: ${cleaned}` : `  ${shim.id}${source}`;
}

function formatRetainedShimNotice(availableShims = []) {
  const lines = availableShims.map((shim) => describeShim(shim)).sort();

  return [
    `${availableShims.length} deprecated shim skill(s) are still installed. Each one only forwards to the skill that replaced it:`,
    '',
    ...lines,
    '',
    'Shims will be removed with v7, and anything still calling the old name stops working then.',
    'Only keep a shim if you customized it and still need to move that customization to the replacement.',
    'Once you have, re-run Quick Update and answer No to this question so the shims come off.',
  ].join('\n');
}

function formatRemovedShimNotice(removedShims = [], { canReinstall = true } = {}) {
  const lines = removedShims.map((shim) => describeShim(shim)).sort();
  const recovery = canReinstall
    ? 'these shims, move it to the replacement, or re-run with --shims to put the shims back.'
    : 'these shims, move it to the replacement. This release no longer ships them, so --shims cannot bring them back.';

  return [
    `${removedShims.length} deprecated shim skill(s) are being removed. Invoking these names will no longer work:`,
    '',
    ...lines,
    '',
    'Each replacement named above is installed and ready. If you still had a customization on one of',
    recovery,
  ].join('\n');
}

module.exports = {
  describeShim,
  formatRemovedShimNotice,
  discoverShims,
  formatRetainedShimNotice,
  inferShimPreference,
  isShimSkill,
  parseSkillMetadata,
  readInstalledShims,
  readInstalledSkillIds,
  selectShimOutcome,
};
