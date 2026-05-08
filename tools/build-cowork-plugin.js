'use strict';

/**
 * Cowork Plugin Tree Generator
 *
 * Generates a flat skills/<id>/SKILL.md tree inside each plugin's `source`
 * directory so Claude Cowork's "Add marketplace" UI can load the skills.
 *
 * Cowork requires:
 *   <source>/
 *     .claude-plugin/plugin.json   ← name, version, description, author
 *     skills/<skill-id>/SKILL.md   ← one subdir per skill, flat layout
 *
 * The generator reads each plugin's `source` and `skills` fields from
 * .claude-plugin/marketplace.json, wipes the source directory, and rebuilds
 * it from the canonical src/**\/SKILL.md files. Run this whenever skills change.
 *
 * Usage:
 *   node tools/build-cowork-plugin.js          generate / regenerate
 *   node tools/build-cowork-plugin.js --check  exit 1 if tree is stale (CI)
 */

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const MARKETPLACE_PATH = path.join(ROOT, '.claude-plugin', 'marketplace.json');
const PACKAGE_JSON = require(path.join(ROOT, 'package.json'));

const CHECK = process.argv.includes('--check');

function hash(filePath) {
  return crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');
}

function buildPlugin(plugin) {
  if (!plugin.source) throw new Error(`Plugin "${plugin.name}" is missing a source field`);

  const skills = Array.isArray(plugin.skills) ? plugin.skills : [];
  const pluginDir = path.join(ROOT, plugin.source);
  const skillsDir = path.join(pluginDir, 'skills');

  // In --check mode: verify the tree matches without writing
  if (CHECK) {
    const pluginJsonPath = path.join(pluginDir, '.claude-plugin', 'plugin.json');
    if (!fs.existsSync(pluginJsonPath)) {
      console.error(`✗ ${plugin.name}: cowork-plugin tree missing — run npm run build:cowork-plugin`);
      process.exit(1);
    }
    for (const skillRelPath of skills) {
      const skillId = path.basename(skillRelPath);
      const dest = path.join(skillsDir, skillId, 'SKILL.md');
      const src = path.join(ROOT, skillRelPath, 'SKILL.md');
      if (!fs.existsSync(dest) || hash(dest) !== hash(src)) {
        console.error(`✗ ${plugin.name}: stale — run npm run build:cowork-plugin`);
        process.exit(1);
      }
    }
    console.log(`✓ ${plugin.name}: up to date`);
    return 0;
  }

  // Generate
  fs.rmSync(pluginDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(pluginDir, '.claude-plugin'), { recursive: true });
  fs.mkdirSync(skillsDir, { recursive: true });

  const authorName = typeof PACKAGE_JSON.author === 'string' ? PACKAGE_JSON.author : PACKAGE_JSON.author?.name;

  fs.writeFileSync(
    path.join(pluginDir, '.claude-plugin', 'plugin.json'),
    JSON.stringify(
      {
        name: plugin.name,
        version: plugin.version || PACKAGE_JSON.version,
        description: plugin.description || '',
        author: plugin.author || { name: authorName },
      },
      null,
      2,
    ) + '\n',
  );

  for (const skillRelPath of skills) {
    const skillId = path.basename(skillRelPath);
    const src = path.join(ROOT, skillRelPath, 'SKILL.md');
    if (!fs.existsSync(src)) {
      console.error(`✗ SKILL.md not found: ${src}`);
      process.exit(1);
    }
    const destDir = path.join(skillsDir, skillId);
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, path.join(destDir, 'SKILL.md'));
  }

  return skills.length;
}

const marketplace = JSON.parse(fs.readFileSync(MARKETPLACE_PATH, 'utf8'));
const plugins = Array.isArray(marketplace.plugins) ? marketplace.plugins : [];

let total = 0;
for (const plugin of plugins) {
  const count = buildPlugin(plugin);
  if (!CHECK) console.log(`✓ ${plugin.name}: ${count} skills → ${plugin.source}`);
  total += count;
}

if (!CHECK) console.log(`\n✓ cowork-plugin built: ${total} skills total`);
