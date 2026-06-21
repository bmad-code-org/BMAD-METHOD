import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileP = promisify(execFile);

// Install a module's runtime dependencies when it ships a package.json, mirroring
// the full installer's CustomModuleManager.cloneRepo npm step
// (tools/installer/modules/custom-module-manager.js). Unlike the installer — which
// installs into its ~/.bmad cache and copies node_modules across — the skill never
// copies node_modules (it's in DEFAULT_IGNORES), so we install in place inside the
// committed `_bmad/<code>/`.
//
// This relaxes the skill's "no npm in _bmad/" principle, but it is the only way a
// module whose skills shell out to JS deps works after a skill-driven install.
// Gated on package.json presence and opt-out via `bmad.install.skipNpm: true`.
// Always non-fatal: the module files are already committed; a failed dep install
// is a warning, not an install failure.

const NPM_ARGS = ['install', '--omit=dev', '--no-audit', '--no-fund', '--no-progress', '--legacy-peer-deps'];
const TIMEOUT_MS = 120_000;

export async function installModuleDeps(moduleDir, manifest) {
  if (manifest?.bmad?.install?.skipNpm === true) return { ran: false, skipped: 'opted out (bmad.install.skipNpm)' };

  const pkgPath = path.join(moduleDir, 'package.json');
  try {
    const stat = await fs.stat(pkgPath);
    if (!stat.isFile()) return { ran: false };
  } catch {
    return { ran: false }; // no package.json — nothing to install
  }

  try {
    await execFileP('npm', NPM_ARGS, { cwd: moduleDir, timeout: TIMEOUT_MS });
    return { ran: true, ok: true };
  } catch (e) {
    return { ran: true, ok: false, error: e.shortMessage || e.message };
  }
}
