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

module.exports = {
  discoverShims,
  inferShimPreference,
  isShimSkill,
  parseSkillMetadata,
  readInstalledSkillIds,
};
