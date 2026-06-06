import fs from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from './vendor/yaml.mjs';
import { valid as semverValid } from './semver-lite.mjs';
import { safePathInsideRoot } from './fs-safe.mjs';
import { MODULE_HELP_CSV_HEADER } from './help-catalog.mjs';
import { EXIT, BmadModuleError } from './exit.mjs';

// Resolve a LEGACY BMAD module (marketplace.json + module.yaml) into a synthetic
// manifest of the same shape readAndValidateManifest produces, so the install
// pipeline (validateDeclaredPaths → buildCopyPlan → rewriteManifestPaths → …)
// handles it with no special-casing. This is a self-contained port of the full
// installer's PluginResolver (tools/installer/modules/plugin-resolver.js)
// strategies 1–5; the skill must not import from tools/installer (it ships
// standalone under .claude/skills/).
//
// Strategies, tried per marketplace plugin in order:
//   1. Module files (module.yaml + module-help.csv) at the skills' common parent
//      or any directory between there and the repo root.
//   2. A `*-setup` skill with assets/module.yaml + assets/module-help.csv.
//   3. A single standalone skill with both files in its assets/.
//   4. Multiple standalone skills, each with both files → one module each.
//   5. Fallback: synthesize module.yaml + module-help.csv from marketplace.json
//      metadata and SKILL.md frontmatter.
//
// Returns null when there is no marketplace.json (caller emits the normal
// BAD_MANIFEST). Returns { manifest, synthesized } on success, where
// `synthesized` is { 'module.yaml': string|null, 'module-help.csv': string|null }
// (non-null only for strategy 5, which the caller writes into the temp source
// dir before buildCopyPlan reads it). Throws BmadModuleError(BAD_MANIFEST) on an
// unparseable marketplace.json, when nothing resolves, or on multi-module
// ambiguity that `selector` does not disambiguate.
export async function resolveLegacyModule(sourceDir, { selector = null } = {}) {
  const mpPath = path.join(sourceDir, '.claude-plugin', 'marketplace.json');
  let raw;
  try {
    raw = await fs.readFile(mpPath, 'utf8');
  } catch {
    return null;
  }
  let mp;
  try {
    mp = JSON.parse(raw);
  } catch (e) {
    throw new BmadModuleError(EXIT.BAD_MANIFEST, `.claude-plugin/marketplace.json failed to parse: ${e.message}`);
  }
  const plugins = Array.isArray(mp.plugins) ? mp.plugins : [];
  if (plugins.length === 0) {
    throw new BmadModuleError(EXIT.BAD_MANIFEST, `marketplace.json declares no plugins`);
  }

  const candidates = [];
  for (const plugin of plugins) {
    if (!plugin || typeof plugin !== 'object') continue;
    const skillPaths = await resolveSkillPaths(sourceDir, plugin.skills || []);
    if (skillPaths.length === 0) continue; // plugin contributes no installable skills
    const resolved =
      (await tryRootModuleFiles(sourceDir, plugin, skillPaths)) ||
      (await trySetupSkill(sourceDir, plugin, skillPaths)) ||
      (await trySingleStandalone(sourceDir, plugin, skillPaths)) ||
      (await tryMultipleStandalone(sourceDir, plugin, skillPaths)) ||
      (await synthesizeFallback(sourceDir, plugin, skillPaths));
    candidates.push(...resolved);
  }

  if (candidates.length === 0) {
    throw new BmadModuleError(EXIT.BAD_MANIFEST, `marketplace.json resolved no installable module (no skills found on disk)`);
  }

  const pick = selectModule(candidates, selector);
  return toSyntheticManifest(pick, sourceDir);
}

// ─── Skill-path resolution ───────────────────────────────────────────────────

// Map a plugin's skills[] (repo-relative, ./-prefixed) to source-relative POSIX
// paths that exist on disk and stay inside the source root. Mirrors
// plugin-resolver.js:60-71.
async function resolveSkillPaths(sourceDir, skillRel) {
  const out = [];
  for (const rel of skillRel) {
    if (typeof rel !== 'string') continue;
    const normalized = rel.replace(/^\.\//, '');
    const abs = safePathInsideRoot(sourceDir, normalized);
    if (!abs) continue; // traversal / absolute path — skip
    if (await exists(abs)) out.push(toRel(sourceDir, abs));
  }
  return out;
}

// ─── Strategy 1: root module files (walk up from skills' common parent) ───────

async function tryRootModuleFiles(sourceDir, plugin, skillRelPaths) {
  const commonParentAbs = computeCommonParent(skillRelPaths.map((r) => path.resolve(sourceDir, r)));
  const candidates = await findModuleFilesUpward(commonParentAbs, sourceDir);
  if (candidates.length === 0) return null;
  // Deepest candidate (closest to the skills) is the safe default; a CLI has no
  // interactive picker so we don't prompt between chain candidates.
  const { moduleYamlAbs, moduleHelpAbs } = candidates[0];
  const data = await readModuleYaml(moduleYamlAbs);
  if (!data) return null;
  return [
    makeCandidate(plugin, data, skillRelPaths, {
      moduleYamlRel: toRel(sourceDir, moduleYamlAbs),
      moduleHelpCsvRel: toRel(sourceDir, moduleHelpAbs),
    }),
  ];
}

// ─── Strategy 2: -setup skill with assets/module.yaml ─────────────────────────

async function trySetupSkill(sourceDir, plugin, skillRelPaths) {
  for (const skillRel of skillRelPaths) {
    if (!path.posix.basename(skillRel).endsWith('-setup')) continue;
    const found = await skillAssets(sourceDir, skillRel);
    if (!found) continue;
    const data = await readModuleYaml(path.resolve(sourceDir, found.moduleYamlRel));
    if (!data) continue;
    return [makeCandidate(plugin, data, skillRelPaths, found)];
  }
  return null;
}

// ─── Strategy 3: single standalone skill ──────────────────────────────────────

async function trySingleStandalone(sourceDir, plugin, skillRelPaths) {
  if (skillRelPaths.length !== 1) return null;
  const found = await skillAssets(sourceDir, skillRelPaths[0]);
  if (!found) return null;
  const data = await readModuleYaml(path.resolve(sourceDir, found.moduleYamlRel));
  if (!data) return null;
  return [makeCandidate(plugin, data, skillRelPaths, found)];
}

// ─── Strategy 4: multiple standalone skills, each its own module ───────────────

async function tryMultipleStandalone(sourceDir, plugin, skillRelPaths) {
  if (skillRelPaths.length < 2) return null;
  const resolved = [];
  for (const skillRel of skillRelPaths) {
    const found = await skillAssets(sourceDir, skillRel);
    if (!found) continue;
    const data = await readModuleYaml(path.resolve(sourceDir, found.moduleYamlRel));
    if (!data) continue;
    resolved.push(
      makeCandidate({ ...plugin }, data, [skillRel], found, {
        fallbackCode: path.posix.basename(skillRel),
      }),
    );
  }
  // Only use strategy 4 if EVERY skill carries module files; otherwise fall
  // through to the synthesizer (mirrors plugin-resolver.js:349-355).
  return resolved.length === skillRelPaths.length ? resolved : null;
}

// ─── Strategy 5: synthesize from marketplace.json + SKILL.md frontmatter ──────

async function synthesizeFallback(sourceDir, plugin, skillRelPaths) {
  const skillInfos = [];
  for (const skillRel of skillRelPaths) {
    const fm = await parseSkillFrontmatter(path.resolve(sourceDir, skillRel));
    skillInfos.push({
      dirName: path.posix.basename(skillRel),
      name: fm.name || path.posix.basename(skillRel),
      description: fm.description || '',
    });
  }
  const code = plugin.name || path.posix.basename(skillRelPaths[0]);
  const moduleName = formatDisplayName(code);
  const synthesizedYaml =
    `code: ${code}\n` +
    `name: ${JSON.stringify(moduleName)}\n` +
    `description: ${JSON.stringify(plugin.description || '')}\n` +
    `module_version: ${plugin.version || '1.0.0'}\n`;
  const synthesizedCsv = buildSynthesizedHelpCsv(moduleName, skillInfos);
  return [
    {
      code,
      name: moduleName,
      version: plugin.version || null,
      description: plugin.description || '',
      pluginName: plugin.name,
      skillRelPaths,
      moduleYamlRel: 'module.yaml',
      moduleHelpCsvRel: 'module-help.csv',
      synthesizedYaml,
      synthesizedCsv,
    },
  ];
}

// ─── Candidate selection ──────────────────────────────────────────────────────

function selectModule(candidates, selector) {
  if (candidates.length === 1) return candidates[0];
  const codes = candidates.map((c) => c.code);
  if (selector) {
    const matches = candidates.filter((c) => c.code === selector);
    if (matches.length === 1) return matches[0];
    throw new BmadModuleError(EXIT.BAD_MANIFEST, `no module with code "${selector}" in this repo. Available: ${codes.join(', ')}.`);
  }
  throw new BmadModuleError(EXIT.BAD_MANIFEST, `this repo defines multiple modules: ${codes.join(', ')}. Re-run with --module <code>.`);
}

// ─── Synthetic manifest builder ───────────────────────────────────────────────

function toSyntheticManifest(pick, _sourceDir) {
  const name = sanitizeName(pick.pluginName || pick.code);
  const version = semverValid(pick.version) ? pick.version : '0.0.0';
  const manifest = {
    name,
    version,
    description: pick.description || '',
    skills: pick.skillRelPaths.map((p) => `./${p}`),
    bmad: {
      specVersion: '1.0.0',
      code: pick.code,
      compatibility: { bmadMethod: '>=6.0.0' },
      moduleVersion: pick.version || version,
      moduleDefinition: `./${pick.moduleYamlRel}`,
      moduleHelpCsv: `./${pick.moduleHelpCsvRel}`,
    },
  };
  return {
    manifest,
    synthesized: {
      'module.yaml': pick.synthesizedYaml || null,
      'module-help.csv': pick.synthesizedCsv || null,
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Normalize a module.yaml + plugin pair into the intermediate candidate shape.
function makeCandidate(plugin, data, skillRelPaths, files, { fallbackCode } = {}) {
  return {
    code: data.code || fallbackCode || plugin.name,
    name: data.name || plugin.name,
    version: plugin.version || data.module_version || null,
    description: data.description || plugin.description || '',
    pluginName: plugin.name,
    skillRelPaths,
    moduleYamlRel: files.moduleYamlRel,
    moduleHelpCsvRel: files.moduleHelpCsvRel,
    synthesizedYaml: null,
    synthesizedCsv: null,
  };
}

// Return assets/module.yaml + assets/module-help.csv under a skill dir when both
// exist, as source-relative POSIX paths; else null.
async function skillAssets(sourceDir, skillRel) {
  const moduleYamlRel = path.posix.join(skillRel, 'assets', 'module.yaml');
  const moduleHelpCsvRel = path.posix.join(skillRel, 'assets', 'module-help.csv');
  if (!(await exists(path.resolve(sourceDir, moduleYamlRel)))) return null;
  if (!(await exists(path.resolve(sourceDir, moduleHelpCsvRel)))) return null;
  return { moduleYamlRel, moduleHelpCsvRel };
}

// Walk from startDirAbs up to the source root, collecting dirs that contain BOTH
// module.yaml and module-help.csv. Deepest-first; bounded by sourceDir.
async function findModuleFilesUpward(startDirAbs, sourceDir) {
  const root = path.resolve(sourceDir);
  let dir = path.resolve(startDirAbs);
  if (dir !== root && !dir.startsWith(root + path.sep)) dir = root;
  const out = [];
  while (true) {
    const moduleYamlAbs = path.join(dir, 'module.yaml');
    const moduleHelpAbs = path.join(dir, 'module-help.csv');
    if ((await exists(moduleYamlAbs)) && (await exists(moduleHelpAbs))) {
      out.push({ moduleYamlAbs, moduleHelpAbs });
    }
    if (dir === root) break;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return out;
}

// Deepest common ancestor of absolute paths. Single path → its dirname.
function computeCommonParent(absPaths) {
  if (absPaths.length === 0) return '/';
  if (absPaths.length === 1) return path.dirname(absPaths[0]);
  const segments = absPaths.map((p) => p.split(path.sep));
  const minLen = Math.min(...segments.map((s) => s.length));
  const common = [];
  for (let i = 0; i < minLen; i++) {
    const seg = segments[0][i];
    if (segments.every((s) => s[i] === seg)) common.push(seg);
    else break;
  }
  return common.join(path.sep) || '/';
}

async function readModuleYaml(yamlAbs) {
  try {
    return parseYaml(await fs.readFile(yamlAbs, 'utf8'));
  } catch {
    return null;
  }
}

async function parseSkillFrontmatter(skillDirAbs) {
  try {
    const content = await fs.readFile(path.join(skillDirAbs, 'SKILL.md'), 'utf8');
    const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!match) return { name: '', description: '' };
    const parsed = parseYaml(match[1]) || {};
    return { name: parsed.name || '', description: parsed.description || '' };
  } catch {
    return { name: '', description: '' };
  }
}

function buildSynthesizedHelpCsv(moduleName, skillInfos) {
  const rows = [MODULE_HELP_CSV_HEADER];
  for (const info of skillInfos) {
    const displayName = formatDisplayName(info.name || info.dirName);
    const menuCode = generateMenuCode(info.name || info.dirName);
    const description = escapeCsvField(info.description);
    rows.push(`${moduleName},${info.dirName},${displayName},${menuCode},${description},activate,,anytime,,,false,,`);
  }
  return rows.join('\n') + '\n';
}

function formatDisplayName(name) {
  const cleaned = String(name || '')
    .replace(/^bmad-agent-/, '')
    .replace(/^bmad-/, '');
  return cleaned
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function generateMenuCode(name) {
  const cleaned = String(name || '')
    .replace(/^bmad-agent-/, '')
    .replace(/^bmad-/, '');
  return cleaned
    .split(/[-_]/)
    .filter((w) => w.length > 0)
    .map((w) => w.charAt(0).toUpperCase())
    .join('')
    .slice(0, 3);
}

function escapeCsvField(value) {
  if (!value) return '';
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

// Coerce an arbitrary plugin/module name into a manifest `name` that passes
// NAME_REGEX (/^[a-z][a-z0-9-]+$/, 3–64 chars): lowercase, non-[a-z0-9-] → '-',
// collapse and trim dashes, ensure it starts with a letter and is ≥3 chars.
function sanitizeName(raw) {
  let s = String(raw || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!/^[a-z]/.test(s)) s = `bmad-${s}`.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  if (s.length < 3) s = `bmad-module-${s}`.replace(/-+$/g, '');
  return s.slice(0, 64).replace(/-+$/g, '');
}

function toRel(sourceDir, abs) {
  return path.relative(sourceDir, abs).split(path.sep).join('/');
}

async function exists(abs) {
  try {
    await fs.access(abs);
    return true;
  } catch {
    return false;
  }
}
