import fs from 'node:fs/promises';
import path from 'node:path';
import { EXIT, BmadModuleError } from './lib/exit.mjs';
import { findBmadDir } from './lib/bmad-dir.mjs';
import { pruneEmptyDirs } from './lib/fs-safe.mjs';
import {
  readManifestYaml,
  removeModuleFromManifest,
  removeSkillManifestRows,
  removeFilesManifestRows,
  readFileEntriesForModule,
  readSkillCanonicalIdsForModule,
} from './lib/manifest-ops.mjs';
import { distributeToIdes } from './lib/ide-sync.mjs';

// Remove a module's installed files and manifest entries. With `--purge` also
// deletes `_bmad/custom/<code>/` (user customization dir). Without it, customs
// are preserved so a re-install picks them back up.
export async function runRemove(opts) {
  const projectDir = opts.projectDir || process.cwd();
  const code = opts.code;
  if (!code) throw new BmadModuleError(EXIT.USAGE, `bmad-module remove <code> is required`);

  const bmadDir = await findBmadDir(projectDir);
  if (!bmadDir) {
    throw new BmadModuleError(EXIT.NO_BMAD_DIR, `no _bmad/ found in ${projectDir}`);
  }

  const manifest = await readManifestYaml(bmadDir);
  const entry = manifest?.modules?.find((m) => m && m.name === code);
  if (!entry) {
    throw new BmadModuleError(EXIT.NOT_INSTALLED, `no module "${code}" in manifest.yaml`);
  }
  if (entry.source !== 'community') {
    throw new BmadModuleError(
      EXIT.PREFIX_COLLISION,
      `module "${code}" was installed as source="${entry.source}", not "community". ` +
        `Use the appropriate uninstaller (e.g. \`bmad-method uninstall\`).`,
    );
  }

  // Capture the module's distributed skill ids before dropping its manifest
  // rows, so we can prune them from the IDE directories afterward.
  const removedSkillIds = await readSkillCanonicalIdsForModule(bmadDir, code);

  // Delete each file tracked in files-manifest.csv; prune empty dirs after.
  const fileEntries = await readFileEntriesForModule(bmadDir, code);
  const moduleRoot = path.join(bmadDir, code);
  for (const fe of fileEntries) {
    const abs = path.join(bmadDir, fe.path);
    try {
      await fs.rm(abs, { force: true });
      await pruneEmptyDirs(path.dirname(abs), moduleRoot);
    } catch (e) {
      process.stderr.write(`[bmad-module] warn: failed to remove ${fe.path}: ${e.message}\n`);
    }
  }

  // Remove the module root if it still exists (in case files-manifest was
  // incomplete or empty). Safe — at this point we've confirmed source=community.
  await fs.rm(moduleRoot, { recursive: true, force: true });

  // Optionally purge custom overrides.
  if (opts.purge) {
    const customDir = path.join(bmadDir, 'custom', code);
    await fs.rm(customDir, { recursive: true, force: true });
  }

  // Drop manifest rows.
  await removeFilesManifestRows(bmadDir, code);
  await removeSkillManifestRows(bmadDir, code);
  await removeModuleFromManifest(bmadDir, code);

  // Prune the module's skills from every configured coding assistant. The
  // manifest no longer lists the module, so ide-sync removes its skill dirs +
  // command pointers and re-syncs the rest.
  const ideResult = await distributeToIdes({ projectDir, bmadDir, prune: removedSkillIds });
  if (!ideResult.skipped && !ideResult.ok) {
    process.stderr.write(`[bmad-module] warning: ${ideResult.hint}\n`);
  }

  process.stdout.write(`[bmad-module] removed ${code} (${fileEntries.length} file(s))\n`);
  if (opts.purge) {
    process.stdout.write(`[bmad-module] purged _bmad/custom/${code}/\n`);
  } else if (await dirExists(path.join(bmadDir, 'custom', code))) {
    process.stdout.write(`[bmad-module] preserved _bmad/custom/${code}/ (use --purge to remove)\n`);
  }
}

async function dirExists(p) {
  try {
    const s = await fs.stat(p);
    return s.isDirectory();
  } catch {
    return false;
  }
}
