import fs from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from './vendor/yaml.mjs';
import { parseFrontmatter } from './frontmatter.mjs';
import { sha256File } from './fs-safe.mjs';
import { EXIT, BmadModuleError } from './exit.mjs';

// =============================================================================
// manifest.yaml — read/write/addModule/removeModule
// =============================================================================

const MANIFEST_YAML_OPTS = { indent: 2, lineWidth: 0, sortKeys: false };

export async function readManifestYaml(bmadDir) {
  const yamlPath = path.join(bmadDir, '_config', 'manifest.yaml');
  try {
    const content = await fs.readFile(yamlPath, 'utf8');
    return parseYaml(content);
  } catch {
    return null;
  }
}

async function writeManifestYaml(bmadDir, data) {
  const yamlPath = path.join(bmadDir, '_config', 'manifest.yaml');
  await fs.mkdir(path.dirname(yamlPath), { recursive: true });
  const yamlContent = stringifyYaml(structuredClone(data), MANIFEST_YAML_OPTS);
  const content = yamlContent.endsWith('\n') ? yamlContent : yamlContent + '\n';
  await fs.writeFile(yamlPath, content, 'utf8');
}

// Add or update a community module entry in manifest.yaml. Mirrors BMAD-METHOD's
// Manifest.addModule() entry shape exactly (source: 'community') so the
// upstream installer recognizes community rows during regeneration.
export async function addModuleToManifest(bmadDir, code, options) {
  let manifest = await readManifestYaml(bmadDir);
  if (!manifest) {
    throw new BmadModuleError(EXIT.NO_BMAD_DIR, `manifest.yaml not found — _bmad/_config/ missing. Run \`bmad install\` first.`);
  }
  if (!Array.isArray(manifest.modules)) manifest.modules = [];

  const now = new Date().toISOString();
  const idx = manifest.modules.findIndex((m) => m && m.name === code);
  if (idx === -1) {
    const entry = {
      name: code,
      version: options.version || null,
      installDate: now,
      lastUpdated: now,
      source: 'community',
      npmPackage: null,
      repoUrl: options.repoUrl || null,
    };
    if (options.channel) entry.channel = options.channel;
    if (options.sha) entry.sha = options.sha;
    if (options.ref) entry.ref = options.ref;
    if (options.rawSource) entry.rawSource = options.rawSource;
    if (options.moduleName) entry.moduleName = options.moduleName;
    manifest.modules.push(entry);
  } else {
    const existing = manifest.modules[idx];
    manifest.modules[idx] = {
      ...existing,
      version: options.version ?? existing.version,
      source: 'community',
      repoUrl: options.repoUrl ?? existing.repoUrl,
      channel: options.channel ?? existing.channel,
      sha: options.sha ?? existing.sha,
      ref: options.ref ?? existing.ref,
      rawSource: options.rawSource ?? existing.rawSource,
      moduleName: options.moduleName ?? existing.moduleName,
      lastUpdated: now,
    };
  }

  await writeManifestYaml(bmadDir, manifest);
}

export async function removeModuleFromManifest(bmadDir, code) {
  const manifest = await readManifestYaml(bmadDir);
  if (!manifest || !Array.isArray(manifest.modules)) return false;
  const before = manifest.modules.length;
  manifest.modules = manifest.modules.filter((m) => !(m && m.name === code));
  if (manifest.modules.length === before) return false;
  await writeManifestYaml(bmadDir, manifest);
  return true;
}

export async function listModuleEntries(bmadDir) {
  const manifest = await readManifestYaml(bmadDir);
  if (!manifest || !Array.isArray(manifest.modules)) return [];
  return manifest.modules.filter((m) => m && m.source === 'community');
}

// =============================================================================
// CSV helpers — used by both skill-manifest.csv and files-manifest.csv
// =============================================================================

function escapeCsv(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

// Tiny CSV parser sufficient for the shapes BMAD-METHOD writes: header line +
// records with `"…"` fields, quotes escaped as `""`. No commas-in-fields
// outside quotes. Returns array of arrays.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let i = 0;
  let inQuotes = false;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
    } else {
      if (c === '"') {
        inQuotes = true;
        i++;
        continue;
      }
      if (c === ',') {
        row.push(field);
        field = '';
        i++;
        continue;
      }
      if (c === '\n' || c === '\r') {
        if (field !== '' || row.length > 0) {
          row.push(field);
          rows.push(row);
        }
        row = [];
        field = '';
        if (c === '\r' && text[i + 1] === '\n') i += 2;
        else i++;
        continue;
      }
      field += c;
      i++;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

async function readCsvRows(filePath) {
  try {
    const text = await fs.readFile(filePath, 'utf8');
    return parseCsv(text);
  } catch {
    return null;
  }
}

function rowsToCsv(header, rows) {
  let csv = header.join(',') + '\n';
  for (const r of rows) {
    csv += r.map(escapeCsv).join(',') + '\n';
  }
  return csv;
}

// =============================================================================
// skill-manifest.csv — header: canonicalId,name,description,module,path
// =============================================================================

const SKILL_HEADER = ['canonicalId', 'name', 'description', 'module', 'path'];

// Append rows for a module's skills, parsed from each SKILL.md's frontmatter.
// `skillDirs` is an array of POSIX-relative dirs inside `_bmad/<code>/` (e.g.
// `["bmad-devlog-write", "bmad-devlog-summarize"]`).
export async function appendSkillManifestRows(bmadDir, code, skillDirs) {
  const csvPath = path.join(bmadDir, '_config', 'skill-manifest.csv');
  const existingRaw = await readCsvRows(csvPath);
  const rows = existingRaw && existingRaw.length > 0 ? existingRaw.slice(1) : [];

  for (const skillRel of skillDirs) {
    const skillMdPath = path.join(bmadDir, code, skillRel, 'SKILL.md');
    let canonicalId = path.basename(skillRel);
    let name = canonicalId;
    let description = '';
    try {
      const md = await fs.readFile(skillMdPath, 'utf8');
      const fm = parseFrontmatter(md);
      if (fm) {
        if (typeof fm.name === 'string') {
          canonicalId = fm.name;
          name = fm.name;
        }
        if (typeof fm.description === 'string') {
          description = fm.description.replaceAll(/\s+/g, ' ').trim();
        }
      }
    } catch {
      /* SKILL.md unreadable — degrade gracefully with basename */
    }
    rows.push([canonicalId, name, description, code, `_bmad/${code}/${skillRel}/SKILL.md`]);
  }

  // Sort by (module, canonicalId) for stable diffs. Don't sort the header.
  rows.sort((a, b) => {
    if (a[3] !== b[3]) return a[3].localeCompare(b[3]);
    return a[0].localeCompare(b[0]);
  });

  await fs.mkdir(path.dirname(csvPath), { recursive: true });
  await fs.writeFile(csvPath, rowsToCsv(SKILL_HEADER, rows), 'utf8');
}

// Return the canonicalIds of a module's skills currently recorded in
// skill-manifest.csv. Used by update/remove to tell ide-sync which skill
// directories to prune from the IDE targets.
export async function readSkillCanonicalIdsForModule(bmadDir, code) {
  const csvPath = path.join(bmadDir, '_config', 'skill-manifest.csv');
  const rows = await readCsvRows(csvPath);
  if (!rows || rows.length < 2) return [];
  return rows
    .slice(1)
    .filter((r) => r[3] === code)
    .map((r) => r[0])
    .filter(Boolean);
}

export async function removeSkillManifestRows(bmadDir, code) {
  const csvPath = path.join(bmadDir, '_config', 'skill-manifest.csv');
  const existingRaw = await readCsvRows(csvPath);
  if (!existingRaw || existingRaw.length < 1) return;
  const rows = existingRaw.slice(1).filter((r) => r[3] !== code);
  await fs.writeFile(csvPath, rowsToCsv(SKILL_HEADER, rows), 'utf8');
}

// =============================================================================
// files-manifest.csv — header: type,name,module,path,hash
// =============================================================================

const FILES_HEADER = ['type', 'name', 'module', 'path', 'hash'];

// Append rows for every file copied during install. `copiedRelPaths` is the
// POSIX-relative path list returned by buildCopyList, paths relative to the
// staged module root (which == _bmad/<code>/ after commit).
export async function appendFilesManifestRows(bmadDir, code, copiedRelPaths) {
  const csvPath = path.join(bmadDir, '_config', 'files-manifest.csv');
  const existingRaw = await readCsvRows(csvPath);
  const rows = existingRaw && existingRaw.length > 0 ? existingRaw.slice(1) : [];

  const newRows = [];
  for (const rel of copiedRelPaths) {
    const absPath = path.join(bmadDir, code, rel);
    const ext = path.extname(rel).slice(1).toLowerCase();
    const base = path.basename(rel, path.extname(rel));
    const hash = await sha256File(absPath);
    newRows.push([ext || 'file', base, code, `${code}/${rel}`, hash || '']);
  }

  const merged = [...rows, ...newRows];
  merged.sort((a, b) => {
    if (a[2] !== b[2]) return a[2].localeCompare(b[2]);
    if (a[0] !== b[0]) return a[0].localeCompare(b[0]);
    return a[1].localeCompare(b[1]);
  });

  await fs.mkdir(path.dirname(csvPath), { recursive: true });
  await fs.writeFile(csvPath, rowsToCsv(FILES_HEADER, merged), 'utf8');
}

// Return the existing rows for this module code as { path, hash } pairs.
// Used by update to diff old-vs-new and by remove to know what to delete.
export async function readFileEntriesForModule(bmadDir, code) {
  const csvPath = path.join(bmadDir, '_config', 'files-manifest.csv');
  const rows = await readCsvRows(csvPath);
  if (!rows || rows.length < 2) return [];
  return rows
    .slice(1)
    .filter((r) => r[2] === code)
    .map((r) => ({ type: r[0], name: r[1], module: r[2], path: r[3], hash: r[4] }));
}

export async function removeFilesManifestRows(bmadDir, code) {
  const csvPath = path.join(bmadDir, '_config', 'files-manifest.csv');
  const rows = await readCsvRows(csvPath);
  if (!rows || rows.length < 1) return;
  const kept = rows.slice(1).filter((r) => r[2] !== code);
  await fs.writeFile(csvPath, rowsToCsv(FILES_HEADER, kept), 'utf8');
}
