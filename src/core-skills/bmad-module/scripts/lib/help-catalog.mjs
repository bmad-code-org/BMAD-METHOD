import fs from 'node:fs/promises';
import path from 'node:path';

// Regenerate the merged help catalog `_bmad/_config/bmad-help.csv` from every
// installed module's `module-help.csv`. This mirrors the full installer's
// `Installer.mergeModuleHelpCatalogs` (tools/installer/core/installer.js) so a
// module installed via this skill is visible to the `bmad-help` skill, which
// reads `_bmad/_config/bmad-help.csv` (see src/core-skills/bmad-help/SKILL.md).
//
// Self-contained note: the installer scans core from its source tree
// (`getSourcePath('core-skills')`); we instead scan `_bmad/<module>/` for every
// installed module — including core, whose `module-help.csv` is copied into
// `_bmad/core/` at `bmad install` time — so this needs no source checkout.

// Canonical per-module CSV header. Must match
// tools/installer/modules/module-help-schema.js (MODULE_HELP_CSV_HEADER). A
// per-module file whose header differs is loaded positionally with a warning.
export const MODULE_HELP_CSV_HEADER =
  'module,skill,display-name,menu-code,description,action,args,phase,preceded-by,followed-by,required,output-location,outputs';
const COLUMN_COUNT = 13;
const PHASE_INDEX = 7;

// Top-level _bmad children that are not modules and must not be scanned.
const NON_MODULE_DIRS = new Set(['_config', '_memory', 'memory', 'docs', 'scripts', 'custom']);

// Parse a single CSV line into fields. Mirrors Installer.parseCSVLine: handles
// `""`-escaped quotes inside quoted fields and unquoted commas as separators.
function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// Quote a field only when it contains a comma, quote, or newline. Mirrors
// Installer.escapeCSVField so the merged output is byte-compatible.
function escapeCsvField(field) {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replaceAll('"', '""')}"`;
  }
  return str;
}

// Read every installed module's module-help.csv, merge into the canonical
// catalog, and write `_bmad/_config/bmad-help.csv`. Returns the data-row count.
// Re-scans the whole tree each call, so it is correct after install AND remove.
export async function regenerateHelpCatalog(bmadDir) {
  let entries;
  try {
    entries = await fs.readdir(bmadDir, { withFileTypes: true });
  } catch {
    return 0;
  }
  const moduleNames = entries
    .filter((e) => e.isDirectory() && !NON_MODULE_DIRS.has(e.name) && !e.name.startsWith('.'))
    .map((e) => e.name)
    .sort();

  const allRows = [];
  for (const moduleName of moduleNames) {
    const helpFilePath = path.join(bmadDir, moduleName, 'module-help.csv');
    let content;
    try {
      content = await fs.readFile(helpFilePath, 'utf8');
    } catch {
      continue; // module ships no help catalog — fine
    }
    const lines = content.split('\n').filter((line) => line.trim() && !line.startsWith('#'));
    let headerWarned = false;
    for (const line of lines) {
      // Canonical header row: warn on drift, then skip. (A non-canonical header
      // that doesn't start with `module,` falls through and is loaded as data,
      // matching the installer — author CSVs should use the canonical header.)
      if (line.startsWith('module,')) {
        if (!headerWarned && line.trim() !== MODULE_HELP_CSV_HEADER) {
          process.stderr.write(
            `[bmad-module] warn: ${moduleName}/module-help.csv header differs from canonical schema — data loaded positionally.\n`,
          );
          headerWarned = true;
        }
        continue;
      }
      const columns = parseCsvLine(line);
      if (columns.length < COLUMN_COUNT - 1) continue;
      const padded = columns.slice(0, COLUMN_COUNT);
      while (padded.length < COLUMN_COUNT) padded.push('');
      // Empty module column → fill with the dir name (core stays empty so its
      // rows render as universal tools), matching the installer.
      if ((!padded[0] || padded[0].trim() === '') && moduleName !== 'core') {
        padded[0] = moduleName;
      }
      allRows.push(padded.map((c) => escapeCsvField(c)).join(','));
    }
  }

  // Sort by (module, phase); stable within a phase to preserve authored order.
  const decorated = allRows.map((row, index) => ({ row, index, cols: parseCsvLine(row) }));
  decorated.sort((a, b) => {
    const moduleA = (a.cols[0] || '').toLowerCase();
    const moduleB = (b.cols[0] || '').toLowerCase();
    if (moduleA !== moduleB) return moduleA.localeCompare(moduleB);
    const phaseA = a.cols[PHASE_INDEX] || '';
    const phaseB = b.cols[PHASE_INDEX] || '';
    if (phaseA !== phaseB) return phaseA.localeCompare(phaseB);
    return a.index - b.index;
  });
  const sortedRows = decorated.map((d) => d.row);

  const outputPath = path.join(bmadDir, '_config', 'bmad-help.csv');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, [MODULE_HELP_CSV_HEADER, ...sortedRows].join('\n'), 'utf8');
  return sortedRows.length;
}
