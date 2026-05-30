import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readManifestYaml } from './manifest-ops.mjs';

// Distribute the project's installed skills to the coding assistants (IDEs) the
// user chose at `bmad install` time, by running the self-contained engine bundle
// shipped beside this file (vendor/ide-sync.mjs). Pure node: + a local bundle —
// no npx, no network, no node_modules. The bundle reads the chosen IDEs from
// _bmad/_config/manifest.yaml and the skills from _config/skill-manifest.csv.
//
// `prune` is the list of canonicalIds to remove from the IDE directories (the
// skills of a module being updated or removed); pass [] for a plain install.
//
// Returns one of:
//   { skipped: true }              — no IDEs configured; nothing to do
//   { ok: true }                   — bundle ran and distributed successfully
//   { ok: false, hint }            — bundle missing or exited non-zero; caller
//                                    reports the hint but does NOT fail the verb
//                                    (the _bmad/ write already succeeded).
export async function distributeToIdes({ projectDir, bmadDir, prune = [] }) {
  const manifest = await readManifestYaml(bmadDir);
  const ides = Array.isArray(manifest?.ides) ? manifest.ides.filter((i) => i && typeof i === 'string') : [];
  if (ides.length === 0) {
    return { skipped: true };
  }

  const bundlePath = fileURLToPath(new URL('vendor/ide-sync.mjs', import.meta.url));
  if (!existsSync(bundlePath)) {
    return {
      ok: false,
      hint:
        'IDE distribution bundle is missing (older install). Run `bmad install` to refresh BMAD tooling, ' +
        'or `bmad ide-sync` to push skills to your coding assistants.',
    };
  }

  const args = [bundlePath, '-d', projectDir];
  const pruneIds = (prune || []).filter(Boolean);
  if (pruneIds.length) args.push('--prune', pruneIds.join(','));

  const code = await new Promise((resolve) => {
    const child = spawn(process.execPath, args, { stdio: 'inherit' });
    child.on('error', () => resolve(-1));
    child.on('close', (c) => resolve(c ?? -1));
  });

  if (code === 0) return { ok: true };
  return {
    ok: false,
    hint:
      `IDE distribution exited with code ${code}. Your module is installed under _bmad/, but skills may ` +
      'not be in every coding assistant yet — run `bmad ide-sync` to retry.',
  };
}
