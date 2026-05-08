'use strict';

/**
 * Marketplace Drift Validator
 *
 * Verifies .claude-plugin/marketplace.json stays in sync with src/**\/SKILL.md.
 * The marketplace.json is what Claude Code (and Claude Cowork) consume when a
 * user runs `/plugin marketplace add bmad-code-org/BMAD-METHOD` — every skill
 * shipped to other IDEs through the regular installer must also be reachable
 * through the marketplace, or Cowork users silently miss skills.
 *
 * Checks:
 *   - Every src/**\/SKILL.md path is declared in some plugin's `skills` array.
 *   - Every declared skill path resolves to an existing src/.../SKILL.md.
 *   - No skill path is declared by more than one plugin.
 *
 * Usage:
 *   node tools/validate-marketplace.js              human-readable report
 *   node tools/validate-marketplace.js --strict     exit 1 on any drift (CI)
 *   node tools/validate-marketplace.js --json       JSON output
 */

const fs = require('node:fs');
const path = require('node:path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const MARKETPLACE_PATH = path.join(PROJECT_ROOT, '.claude-plugin', 'marketplace.json');

const args = new Set(process.argv.slice(2));
const STRICT = args.has('--strict');
const JSON_OUTPUT = args.has('--json');

function findSkillPaths(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findSkillPaths(full, acc);
    } else if (entry.name === 'SKILL.md') {
      // Normalize to forward slashes so the string-equal comparison against
      // marketplace.json paths works on Windows (where path.relative uses '\').
      const rel = path.relative(PROJECT_ROOT, path.dirname(full)).split(path.sep).join('/');
      acc.push('./' + rel);
    }
  }
  return acc;
}

function suggestPlugin(skillPath, plugins) {
  // Score by shared path-segment depth (not raw character prefix), so a new
  // module like ./src/cis-skills/foo doesn't get falsely suggested under
  // bmad-pro-skills just because both share './src/'.
  // Suggest only when the match goes beyond the './src/<family>/' boundary.
  const skillSegments = skillPath.split('/');
  let best = null;
  let bestScore = 0;
  for (const plugin of plugins) {
    for (const declared of plugin.skills || []) {
      const declaredSegments = declared.split('/');
      let i = 0;
      while (i < skillSegments.length && i < declaredSegments.length && skillSegments[i] === declaredSegments[i]) {
        i++;
      }
      if (i > bestScore) {
        bestScore = i;
        best = plugin.name;
      }
    }
  }
  // Two skills in the same module family (e.g., both under ./src/core-skills/)
  // share exactly 3 segments: '.', 'src', '<family>'. A skill in a brand-new
  // family (e.g., ./src/cis-skills/) only shares 2 segments. Require >= 3
  // so suggestions stay within the same family and don't leak across modules.
  return bestScore >= 3 ? best : null;
}

function validate() {
  if (!fs.existsSync(MARKETPLACE_PATH)) {
    return { ok: false, fatal: `marketplace.json not found at ${MARKETPLACE_PATH}` };
  }

  let marketplace;
  try {
    marketplace = JSON.parse(fs.readFileSync(MARKETPLACE_PATH, 'utf8'));
  } catch (error) {
    return { ok: false, fatal: `marketplace.json is not valid JSON: ${error.message}` };
  }

  const plugins = Array.isArray(marketplace.plugins) ? marketplace.plugins : [];
  const declaredBy = new Map(); // skillPath -> [pluginName]
  for (const plugin of plugins) {
    for (const skillPath of plugin.skills || []) {
      if (!declaredBy.has(skillPath)) declaredBy.set(skillPath, []);
      declaredBy.get(skillPath).push(plugin.name);
    }
  }

  const onDisk = new Set(findSkillPaths(SRC_DIR));

  const missing = []; // SKILL.md exists in src/ but no plugin declares it
  for (const skillPath of [...onDisk].sort()) {
    if (!declaredBy.has(skillPath)) {
      missing.push({ path: skillPath, suggestedPlugin: suggestPlugin(skillPath, plugins) });
    }
  }

  const orphans = []; // plugin declares a path that has no SKILL.md
  for (const skillPath of declaredBy.keys()) {
    if (!onDisk.has(skillPath)) {
      orphans.push({ path: skillPath, declaredBy: declaredBy.get(skillPath) });
    }
  }

  const duplicates = []; // same path declared by multiple plugins
  for (const [skillPath, names] of declaredBy) {
    if (names.length > 1) duplicates.push({ path: skillPath, declaredBy: names });
  }

  return {
    ok: missing.length === 0 && orphans.length === 0 && duplicates.length === 0,
    totals: { onDisk: onDisk.size, declared: declaredBy.size, plugins: plugins.length },
    missing,
    orphans,
    duplicates,
  };
}

function reportHuman(result) {
  if (result.fatal) {
    console.error(`✗ ${result.fatal}`);
    return;
  }
  const { totals, missing, orphans, duplicates, ok } = result;
  console.log(`Marketplace coverage: ${totals.declared} declared / ${totals.onDisk} on disk across ${totals.plugins} plugin(s)`);

  if (missing.length > 0) {
    console.log(`\n✗ ${missing.length} skill(s) on disk are not declared in marketplace.json:`);
    for (const m of missing) {
      const hint = m.suggestedPlugin ? ` → likely belongs in "${m.suggestedPlugin}"` : '';
      console.log(`    ${m.path}${hint}`);
    }
  }

  if (orphans.length > 0) {
    console.log(`\n✗ ${orphans.length} declared skill path(s) do not exist on disk:`);
    for (const o of orphans) {
      console.log(`    ${o.path}  (declared by: ${o.declaredBy.join(', ')})`);
    }
  }

  if (duplicates.length > 0) {
    console.log(`\n✗ ${duplicates.length} skill path(s) declared by multiple plugins:`);
    for (const d of duplicates) {
      console.log(`    ${d.path}  (in: ${d.declaredBy.join(', ')})`);
    }
  }

  if (ok) console.log('\n✓ marketplace.json is in sync with src/');
}

const result = validate();

if (JSON_OUTPUT) {
  console.log(JSON.stringify(result, null, 2));
} else {
  reportHuman(result);
}

if (!result.ok && (STRICT || result.fatal)) {
  process.exit(1);
}
