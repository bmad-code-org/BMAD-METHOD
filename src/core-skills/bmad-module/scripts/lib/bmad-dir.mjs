import fs from 'node:fs/promises';
import path from 'node:path';

// Locate the _bmad/ directory for a project. Matches BMAD-METHOD's
// Installer.findBmadDir semantics exactly: no upward search — always
// `<projectDir>/_bmad`. Returns absolute path or null if absent.
export async function findBmadDir(projectDir) {
  const candidate = path.join(path.resolve(projectDir), '_bmad');
  try {
    const stat = await fs.stat(candidate);
    return stat.isDirectory() ? candidate : null;
  } catch {
    return null;
  }
}

// Resolve a writable _config dir, ensuring it exists. Modules always
// register into <bmadDir>/_config/.
export async function ensureConfigDir(bmadDir) {
  const cfgDir = path.join(bmadDir, '_config');
  await fs.mkdir(cfgDir, { recursive: true });
  return cfgDir;
}
