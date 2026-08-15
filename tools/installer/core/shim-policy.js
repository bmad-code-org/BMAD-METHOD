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

async function readInstalledSkillIds(bmadDir) {
  const ids = new Set();
  const manifestPath = path.join(bmadDir, '_config', 'skill-manifest.csv');
  if (!(await fs.pathExists(manifestPath))) return ids;

  try {
    const content = await fs.readFile(manifestPath, 'utf8');
    const records = csv.parse(content, { columns: true, skip_empty_lines: true });
    for (const record of records) {
      if (record.canonicalId) ids.add(record.canonicalId);
    }
  } catch {
    // A missing or unreadable legacy manifest means there is no reliable
    // evidence that compatibility shims were installed.
  }

  return ids;
}

function inferShimPreference({ requested, persisted, availableShims = [], installedSkillIds = new Set(), existing = false }) {
  if (availableShims.length === 0) return false;
  if (typeof requested === 'boolean') return requested;
  if (typeof persisted === 'boolean') return persisted;
  if (!existing) return false;

  return availableShims.some((shim) => installedSkillIds.has(shim.id));
}

/**
 * Every shim description already opens with "Deprecated — forwards to X".
 * The heading of the notice says that once, so strip the prefix rather than
 * repeating it on all twenty lines.
 */
function describeShim(shim) {
  const cleaned = (shim.description || '').replace(/^\s*deprecated\s*[-–—:]*\s*/i, '').trim();
  const source = shim.module ? ` (${shim.module})` : '';
  return cleaned ? `  ${shim.id}${source}: ${cleaned}` : `  ${shim.id}${source}`;
}

/**
 * Body of the notice shown whenever an install keeps its compatibility shims.
 * Names every shim so the user can see what is still forwarding, and what it
 * forwards to, without going digging.
 */
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

/**
 * Counterpart to the retained notice, for the run that takes shims away.
 * Removal is silent everywhere else in the installer, so without this a
 * headless run gives no sign that a skill the user may still be invoking
 * just disappeared.
 */
function formatRemovedShimNotice(removedShims = []) {
  const lines = removedShims.map((shim) => describeShim(shim)).sort();

  return [
    `${removedShims.length} deprecated shim skill(s) are being removed. Invoking these names will no longer work:`,
    '',
    ...lines,
    '',
    'Each replacement named above is installed and ready. If you still had a customization on one of',
    'these shims, move it to the replacement, or re-run with --shims to put the shims back.',
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
  readInstalledSkillIds,
};
