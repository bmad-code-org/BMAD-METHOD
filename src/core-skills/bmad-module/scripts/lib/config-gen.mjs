import fs from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from './vendor/yaml.mjs';

// Generate/patch the central TOML config for a community module, mirroring the
// full installer's ManifestGenerator.writeCentralConfig + collectAgentsFromModuleYaml
// (tools/installer/core/manifest-generator.js).
//
// Adaptation for the self-contained skill: the installer regenerates the WHOLE
// config from the source tree (it has core/official module.yaml on disk). The
// skill has only `_bmad/<code>/module.yaml` for the module it just installed, and
// must NOT clobber [core] or sibling modules' interactively-collected answers it
// cannot reconstruct. So we do a TARGETED merge: upsert just this module's
// `[modules.<code>]` (team→config.toml, user→config.user.toml) and its
// `[agents.<code>]` blocks, leaving every other block byte-for-byte intact.
//
// Values are non-interactive: each prompt key resolves from its module.yaml
// `default` (overridable via `--set <code>.<key>=<value>`), with the same
// `result:` template substitution the installer uses. A module's setup skill
// (postInstallSkill) can re-run this with collected answers for interactive refinement.

const TEAM_FILE = 'config.toml';
const USER_FILE = 'config.user.toml';

// ── TOML emit (port of formatTomlValue) ──────────────────────────────────────
export function formatTomlValue(value) {
  if (value === null || value === undefined) return '""';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (Array.isArray(value)) return `[${value.map((v) => formatTomlValue(v)).join(', ')}]`;
  const str = String(value);
  const escaped = str
    .replaceAll('\\', '\\\\')
    .replaceAll('"', '\\"')
    .replaceAll('\n', '\\n')
    .replaceAll('\r', '\\r')
    .replaceAll('\t', '\\t');
  return `"${escaped}"`;
}

// Minimal reverse of formatTomlValue for the scalars we read back (core values).
function parseTomlScalar(raw) {
  const s = raw.trim();
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  if (s.startsWith('"') && s.endsWith('"')) {
    return s
      .slice(1, -1)
      .replaceAll('\\n', '\n')
      .replaceAll('\\r', '\r')
      .replaceAll('\\t', '\t')
      .replaceAll('\\"', '"')
      .replaceAll('\\\\', '\\');
  }
  return s;
}

// ── TOML block model ──────────────────────────────────────────────────────────
// Split a config file into a leading preamble (the comment header before the
// first table) and an ordered list of `[header]` blocks. The file is our own
// controlled output, so a line scanner is safer than a full TOML parser.
function splitBlocks(content) {
  const lines = content.split('\n');
  const preamble = [];
  let i = 0;
  while (i < lines.length && !/^\[[^\]]+]\s*$/.test(lines[i])) {
    preamble.push(lines[i]);
    i++;
  }
  const blocks = [];
  let current = null;
  for (; i < lines.length; i++) {
    const m = lines[i].match(/^\[([^\]]+)]\s*$/);
    if (m) {
      if (current) blocks.push(current);
      current = { header: m[1], lines: [lines[i]] };
    } else if (current) {
      current.lines.push(lines[i]);
    }
  }
  if (current) blocks.push(current);
  return { preamble, blocks };
}

function blockToText(block) {
  const lines = [...block.lines];
  while (lines.length > 1 && lines.at(-1).trim() === '') lines.pop();
  return lines.join('\n');
}

function joinFile(preamble, blocks) {
  const parts = [];
  const pre = [...preamble];
  while (pre.length && pre.at(-1).trim() === '') pre.pop();
  if (pre.length) parts.push(pre.join('\n'));
  for (const b of blocks) parts.push(blockToText(b));
  return parts.join('\n\n').replace(/\n+$/, '') + '\n';
}

async function readFileOrNull(p) {
  try {
    return await fs.readFile(p, 'utf8');
  } catch {
    return null;
  }
}

// Read the `[core]` table from config.toml as a flat {key: value} map. Used to
// resolve `{output_folder}`-style placeholders in module defaults.
function readCoreValues(teamContent) {
  if (!teamContent) return {};
  const { blocks } = splitBlocks(teamContent);
  const core = blocks.find((b) => b.header === 'core');
  if (!core) return {};
  const out = {};
  for (const line of core.lines.slice(1)) {
    const m = line.match(/^([A-Za-z0-9_-]+)\s*=\s*(.+)$/);
    if (m) out[m[1]] = parseTomlScalar(m[2]);
  }
  return out;
}

// ── default/result resolution (port of processResultTemplate) ─────────────────
function applyResultTemplate(template, value, lookups) {
  if (typeof template !== 'string') return value;
  let result = template;
  if (typeof value === 'string') {
    result = result.replace('{value}', value);
  } else if (typeof value === 'boolean' || typeof value === 'number') {
    result = result === '{value}' ? value : result.replace('{value}', String(value));
  } else {
    return value;
  }
  if (typeof result !== 'string') return result;
  return result.replaceAll(/{([^}]+)}/g, (match, key) => {
    if (key === 'project-root') return '{project-root}';
    if (key === 'value') return match;
    let v = lookups[key];
    if (typeof v === 'string' && v.includes('{project-root}/')) v = v.replace('{project-root}/', '');
    return v === undefined || v === null ? match : String(v);
  });
}

// Resolve a module.yaml into { values, scopes } where values are post-template
// strings and scopes maps each key to 'team' | 'user'. `overrides` supplies
// non-default values (from --set); `coreValues` feeds placeholder resolution.
function resolveModuleConfig(moduleYaml, coreValues, overrides) {
  const values = {};
  const scopes = {};
  const lookups = { ...coreValues };
  for (const [key, entry] of Object.entries(moduleYaml || {})) {
    if (!entry || typeof entry !== 'object' || !('prompt' in entry)) continue;
    const raw = key in overrides ? overrides[key] : entry.default;
    if (raw === undefined) continue;
    const resolved = 'result' in entry ? applyResultTemplate(entry.result, raw, lookups) : raw;
    values[key] = resolved;
    scopes[key] = entry.scope === 'user' ? 'user' : 'team';
    // Make this key visible to later keys' placeholder resolution.
    lookups[key] = resolved;
  }
  return { values, scopes };
}

function renderModuleBlock(sectionKey, kv) {
  const lines = [`[modules.${sectionKey}]`];
  for (const [k, v] of Object.entries(kv)) lines.push(`${k} = ${formatTomlValue(v)}`);
  return { header: `modules.${sectionKey}`, lines };
}

function renderAgentBlock(agent) {
  const lines = [`[agents.${agent.code}]`, `module = ${formatTomlValue(agent.module)}`, `team = ${formatTomlValue(agent.team)}`];
  if (agent.name) lines.push(`name = ${formatTomlValue(agent.name)}`);
  if (agent.title) lines.push(`title = ${formatTomlValue(agent.title)}`);
  if (agent.icon) lines.push(`icon = ${formatTomlValue(agent.icon)}`);
  if (agent.description) lines.push(`description = ${formatTomlValue(agent.description)}`);
  return { header: `agents.${agent.code}`, lines };
}

const TEAM_HEADER = [
  '# ─────────────────────────────────────────────────────────────────',
  '# Installer-managed. Regenerated on install — treat as read-only.',
  '# To pin a value or add custom agents, use _bmad/custom/config.toml',
  '# (team, committed) — never touched by the installer.',
  '# ─────────────────────────────────────────────────────────────────',
  '',
];
const USER_HEADER = [
  '# ─────────────────────────────────────────────────────────────────',
  '# Installer-managed. Regenerated on install — treat as read-only.',
  '# Holds install answers scoped to YOU personally.',
  '# For pinned overrides use _bmad/custom/config.user.toml.',
  '# ─────────────────────────────────────────────────────────────────',
  '',
];

// Upsert `[modules.<code>]` and the module's `[agents.*]` blocks, dropping any
// prior copies (idempotent). When no team/user keys exist the module section is
// omitted from that file. Returns the resolved config values for downstream
// consumers (e.g. directory creation).
export async function regenerateCentralConfig(bmadDir, code, opts = {}) {
  const overrides = opts.setOverrides?.[code] || {};
  const moduleYamlPath = path.join(bmadDir, code, 'module.yaml');
  const moduleYamlRaw = await readFileOrNull(moduleYamlPath);

  const teamPath = path.join(bmadDir, TEAM_FILE);
  const userPath = path.join(bmadDir, USER_FILE);
  const teamContent = await readFileOrNull(teamPath);
  const userContent = await readFileOrNull(userPath);

  // No module.yaml → nothing module-specific to write, but still strip any stale
  // blocks for this code so re-installs stay clean.
  let moduleYaml = null;
  if (moduleYamlRaw) {
    try {
      moduleYaml = parseYaml(moduleYamlRaw);
    } catch (e) {
      process.stderr.write(`[bmad-module] warn: could not parse ${code}/module.yaml: ${e.message}\n`);
    }
  }

  const sectionKey = (moduleYaml && moduleYaml.code) || code;
  const coreValues = readCoreValues(teamContent);
  const { values, scopes } = moduleYaml ? resolveModuleConfig(moduleYaml, coreValues, overrides) : { values: {}, scopes: {} };

  const teamKv = {};
  const userKv = {};
  for (const [k, v] of Object.entries(values)) {
    if (scopes[k] === 'user') userKv[k] = v;
    else teamKv[k] = v;
  }

  const agents = Array.isArray(moduleYaml?.agents)
    ? moduleYaml.agents
        .filter((a) => a && typeof a.code === 'string')
        .map((a) => ({
          code: a.code,
          name: a.name || '',
          title: a.title || '',
          icon: a.icon || '',
          description: a.description || '',
          module: code,
          team: a.team || code,
        }))
    : [];
  const agentCodes = new Set(agents.map((a) => a.code));

  // ── config.toml (team) ──
  {
    const base = teamContent || TEAM_HEADER.join('\n') + '\n';
    const { preamble, blocks } = splitBlocks(base);
    // Drop this module's prior [modules.<code>] and its [agents.*] (by code).
    const kept = blocks.filter(
      (b) => b.header !== `modules.${sectionKey}` && !(b.header.startsWith('agents.') && agentCodes.has(b.header.slice('agents.'.length))),
    );
    if (Object.keys(teamKv).length) kept.push(renderModuleBlock(sectionKey, teamKv));
    for (const a of agents) kept.push(renderAgentBlock(a));
    await fs.writeFile(teamPath, joinFile(preamble, kept), 'utf8');
  }

  // ── config.user.toml (user) ──
  {
    const base = userContent || USER_HEADER.join('\n') + '\n';
    const { preamble, blocks } = splitBlocks(base);
    const kept = blocks.filter((b) => b.header !== `modules.${sectionKey}`);
    if (Object.keys(userKv).length) kept.push(renderModuleBlock(sectionKey, userKv));
    await fs.writeFile(userPath, joinFile(preamble, kept), 'utf8');
  }

  return { values, scopes, sectionKey };
}

// Read a module's currently-stored config values from config.toml +
// config.user.toml ([modules.<sectionKey>]), merged into one {key: value} map.
// Used to detect changed directory paths across updates.
export async function readModuleConfigValues(bmadDir, sectionKey) {
  const out = {};
  for (const file of [TEAM_FILE, USER_FILE]) {
    const content = await readFileOrNull(path.join(bmadDir, file));
    if (!content) continue;
    const { blocks } = splitBlocks(content);
    const block = blocks.find((b) => b.header === `modules.${sectionKey}`);
    if (!block) continue;
    for (const line of block.lines.slice(1)) {
      const m = line.match(/^([A-Za-z0-9_-]+)\s*=\s*(.+)$/);
      if (m) out[m[1]] = parseTomlScalar(m[2]);
    }
  }
  return out;
}

// Resolve a module.yaml's `code` field (the TOML section key), falling back to
// the install code when module.yaml is absent/unparseable.
export async function resolveSectionKey(bmadDir, code) {
  const raw = await readFileOrNull(path.join(bmadDir, code, 'module.yaml'));
  if (!raw) return code;
  try {
    const y = parseYaml(raw);
    return (y && y.code) || code;
  } catch {
    return code;
  }
}

// Strip a module's `[modules.<code>]` (both files) and its `[agents.*]` blocks
// (team file) on removal. Agent codes come from the module's module.yaml if it
// still exists; otherwise we drop agent blocks whose `module = "<code>"`.
export async function removeModuleFromConfig(bmadDir, code) {
  const moduleYamlRaw = await readFileOrNull(path.join(bmadDir, code, 'module.yaml'));
  let sectionKey = code;
  const agentCodes = new Set();
  if (moduleYamlRaw) {
    try {
      const y = parseYaml(moduleYamlRaw);
      if (y?.code) sectionKey = y.code;
      if (Array.isArray(y?.agents)) for (const a of y.agents) if (a?.code) agentCodes.add(a.code);
    } catch {
      /* fall through to module= match */
    }
  }

  const teamPath = path.join(bmadDir, TEAM_FILE);
  const userPath = path.join(bmadDir, USER_FILE);
  const teamContent = await readFileOrNull(teamPath);
  const userContent = await readFileOrNull(userPath);

  if (teamContent) {
    const { preamble, blocks } = splitBlocks(teamContent);
    const kept = blocks.filter((b) => {
      if (b.header === `modules.${sectionKey}` || b.header === `modules.${code}`) return false;
      if (b.header.startsWith('agents.')) {
        const ac = b.header.slice('agents.'.length);
        if (agentCodes.has(ac)) return false;
        // Fallback: drop blocks whose module line names this code.
        if (b.lines.some((l) => /^module\s*=/.test(l) && parseTomlScalar(l.split('=').slice(1).join('=')) === code)) return false;
      }
      return true;
    });
    await fs.writeFile(teamPath, joinFile(preamble, kept), 'utf8');
  }
  if (userContent) {
    const { preamble, blocks } = splitBlocks(userContent);
    const kept = blocks.filter((b) => b.header !== `modules.${sectionKey}` && b.header !== `modules.${code}`);
    await fs.writeFile(userPath, joinFile(preamble, kept), 'utf8');
  }
}
