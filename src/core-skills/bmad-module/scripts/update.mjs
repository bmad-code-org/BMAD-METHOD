import path from 'node:path';
import { EXIT, BmadModuleError } from './lib/exit.mjs';
import { findBmadDir } from './lib/bmad-dir.mjs';
import { parseSource, materializeSource } from './lib/source.mjs';
import { readAndValidateManifest } from './lib/plugin-json.mjs';
import { readUserIgnores, buildIgnoreMatcher, buildCopyPlan, rewriteManifestPaths, validateDeclaredPaths } from './lib/install-plan.mjs';
import { stageCopyPlan, atomicSwapDir, sha256File, pruneEmptyDirs } from './lib/fs-safe.mjs';
import {
  readManifestYaml,
  addModuleToManifest,
  appendSkillManifestRows,
  appendFilesManifestRows,
  removeSkillManifestRows,
  removeFilesManifestRows,
  readFileEntriesForModule,
  readSkillCanonicalIdsForModule,
} from './lib/manifest-ops.mjs';
import { distributeToIdes } from './lib/ide-sync.mjs';
import { finishModuleInstall, resolveCloneTarget } from './install.mjs';

// Update one installed module (or all when opts.all is true). v1 semantics:
//   - Re-resolves the original source (or new --ref) and re-clones.
//   - Same sha → no-op.
//   - Different sha → diff files-manifest rows; abort if any tracked file has
//     been modified locally; otherwise install-over-top and prune removed.
export async function runUpdate(opts) {
  const projectDir = opts.projectDir || process.cwd();
  const bmadDir = await findBmadDir(projectDir);
  if (!bmadDir) {
    throw new BmadModuleError(EXIT.NO_BMAD_DIR, `no _bmad/ found in ${projectDir}`);
  }

  const manifest = await readManifestYaml(bmadDir);
  const allModules = (manifest?.modules || []).filter((m) => m && m.source === 'community');

  let targets;
  if (opts.all) {
    targets = allModules;
  } else {
    if (!opts.code) throw new BmadModuleError(EXIT.USAGE, `bmad-module update <code|--all> is required`);
    const t = allModules.find((m) => m.name === opts.code);
    if (!t) throw new BmadModuleError(EXIT.NOT_INSTALLED, `no module "${opts.code}" in manifest.yaml`);
    targets = [t];
  }

  for (const entry of targets) {
    await updateOne(bmadDir, projectDir, entry, opts);
  }
}

async function updateOne(bmadDir, projectDir, entry, opts) {
  const code = entry.name;
  if (!entry.rawSource) {
    throw new BmadModuleError(EXIT.BAD_MANIFEST, `module ${code} has no rawSource in manifest.yaml — cannot re-resolve`);
  }
  const descriptor = parseSource(entry.rawSource);
  // Re-resolve against the channel/ref the module was installed with, unless the
  // CLI overrides either. A `stable` entry re-resolves to the latest tag; a
  // pinned entry stays put unless `--ref` moves it.
  const target = await resolveCloneTarget(descriptor, {
    ref: opts.ref ?? entry.ref ?? null,
    channel: opts.channel ?? entry.channel ?? null,
  });
  const materialized = await materializeSource(descriptor, { ref: target.ref });

  try {
    // No-op fast path.
    if (materialized.sha && materialized.sha === entry.sha) {
      process.stdout.write(`[bmad-module] ${code} already at ${materialized.sha.slice(0, 7)} — no-op.\n`);
      return;
    }

    const manifest = await readAndValidateManifest(materialized.dir);
    if (manifest.bmad.code !== code) {
      throw new BmadModuleError(
        EXIT.PREFIX_COLLISION,
        `source manifest declares bmad.code "${manifest.bmad.code}" but installed code is "${code}"`,
      );
    }

    // Capture the currently-distributed skill ids before we rewrite the
    // manifest, so any skill dropped between versions is pruned from the IDE
    // directories (and re-distributed ones are refreshed).
    const oldSkillIds = await readSkillCanonicalIdsForModule(bmadDir, code);

    // Modified-file check: any tracked file whose on-disk hash diverges from
    // the recorded one is treated as user-modified. Abort rather than clobber.
    const oldEntries = await readFileEntriesForModule(bmadDir, code);
    const modified = [];
    for (const fe of oldEntries) {
      const abs = path.join(bmadDir, fe.path);
      const current = await sha256File(abs);
      if (current === null) continue;
      if (fe.hash && current !== fe.hash) modified.push(fe.path);
    }
    if (modified.length) {
      throw new BmadModuleError(
        EXIT.MODIFIED_FILES,
        `update would overwrite ${modified.length} locally-modified file(s):\n  ` +
          modified.join('\n  ') +
          `\nMove your changes into _bmad/custom/${code}/ and re-run.`,
      );
    }

    // Build new copy plan, stage, swap.
    validateDeclaredPaths(materialized.dir, manifest);
    const userIgnores = await readUserIgnores(materialized.dir, manifest);
    const matchIgnore = buildIgnoreMatcher(userIgnores);
    const { plan, skillDestDirs } = await buildCopyPlan(materialized.dir, manifest, matchIgnore);
    const rewrittenManifestJson = rewriteManifestPaths(manifest);

    const stagedDir = path.join(path.dirname(materialized.dir), 'staged-out');
    await stageCopyPlan(materialized.dir, stagedDir, plan, {
      '.claude-plugin/plugin.json': rewrittenManifestJson,
    });
    const targetDir = path.join(bmadDir, code);
    try {
      await atomicSwapDir(stagedDir, targetDir);
    } catch (e) {
      throw new BmadModuleError(EXIT.COMMIT_FAILURE, `failed to swap into ${targetDir}: ${e.message}`);
    }

    // Manifest rewrites: remove old rows for this code, then re-append.
    await removeSkillManifestRows(bmadDir, code);
    await removeFilesManifestRows(bmadDir, code);
    await addModuleToManifest(bmadDir, code, {
      version: descriptor.kind === 'git' ? target.version : manifest.bmad.moduleVersion || manifest.version,
      repoUrl: descriptor.kind === 'git' ? descriptor.url : null,
      sha: materialized.sha,
      ref: materialized.ref,
      channel: target.channel,
      rawSource: descriptor.rawInput,
      moduleName: manifest.name,
    });
    const destPaths = ['.claude-plugin/plugin.json', ...plan.map((p) => p.destRel)];
    await appendSkillManifestRows(bmadDir, code, skillDestDirs);
    await appendFilesManifestRows(bmadDir, code, destPaths);

    // Prune empty dirs left behind from removed files. (The atomic swap of
    // the module root already replaced everything; this is a no-op guard for
    // the edge case where rm-then-mkdir leaves stale parents.)
    await pruneEmptyDirs(targetDir, bmadDir);

    process.stdout.write(
      `[bmad-module] updated ${code} (${manifest.name} ${manifest.version})${materialized.sha ? ` @ ${materialized.sha.slice(0, 7)}` : ''}\n`,
    );
    process.stdout.write(`[bmad-module] previous ${oldEntries.length} file(s) → new ${destPaths.length} file(s)\n`);

    // Re-run the same post-copy completion as install: deps, config + agent
    // roster, working directories (moves if a path changed), and help catalog.
    await finishModuleInstall({ bmadDir, code, targetDir, manifest, setOverrides: opts.setOverrides });

    // Re-distribute to the configured coding assistants: prune skills that no
    // longer exist in this version, refresh the rest.
    const ideResult = await distributeToIdes({ projectDir, bmadDir, prune: oldSkillIds });
    if (!ideResult.skipped && !ideResult.ok) {
      process.stderr.write(`[bmad-module] warning: ${ideResult.hint}\n`);
    }
  } finally {
    await materialized.cleanup();
  }
}
