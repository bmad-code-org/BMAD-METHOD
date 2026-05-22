import { EXIT, BmadModuleError } from './lib/exit.mjs';
import { findBmadDir } from './lib/bmad-dir.mjs';
import { listModuleEntries } from './lib/manifest-ops.mjs';

// List community-source modules from manifest.yaml. Output is a fixed-width
// table; `--json` swaps in JSON for programmatic callers.
export async function runList(opts) {
  const projectDir = opts.projectDir || process.cwd();
  const bmadDir = await findBmadDir(projectDir);
  if (!bmadDir) {
    throw new BmadModuleError(EXIT.NO_BMAD_DIR, `no _bmad/ found in ${projectDir}`);
  }

  const modules = await listModuleEntries(bmadDir);

  if (opts.json) {
    process.stdout.write(JSON.stringify({ modules }, null, 2) + '\n');
    return;
  }

  if (modules.length === 0) {
    process.stdout.write(`[bmad-module] no modules installed.\n`);
    return;
  }

  const rows = modules.map((p) => ({
    code: p.name,
    name: p.moduleName || '-',
    version: p.version || '-',
    sha: p.sha ? p.sha.slice(0, 7) : '-',
    source: p.repoUrl || p.rawSource || '-',
    installed: p.installDate ? p.installDate.slice(0, 10) : '-',
  }));
  const cols = ['code', 'name', 'version', 'sha', 'source', 'installed'];
  const widths = cols.reduce((acc, c) => {
    acc[c] = Math.max(c.length, ...rows.map((r) => String(r[c]).length));
    return acc;
  }, {});
  const fmt = (r) => cols.map((c) => String(r[c]).padEnd(widths[c])).join('  ');
  process.stdout.write(fmt(Object.fromEntries(cols.map((c) => [c, c.toUpperCase()]))) + '\n');
  process.stdout.write(cols.map((c) => '-'.repeat(widths[c])).join('  ') + '\n');
  for (const r of rows) process.stdout.write(fmt(r) + '\n');
}
