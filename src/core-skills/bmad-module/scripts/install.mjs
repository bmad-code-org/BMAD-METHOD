import path from 'node:path';
import { EXIT, BmadModuleError } from './lib/exit.mjs';
import { findBmadDir, ensureConfigDir } from './lib/bmad-dir.mjs';
import fsp from 'node:fs/promises';
import { parseSource, materializeSource } from './lib/source.mjs';
import { resolveChannel } from './lib/channel-resolver.mjs';
import { readAndValidateManifest, validateManifestObject, hasBmadPluginJson } from './lib/plugin-json.mjs';
import { resolveLegacyModule } from './lib/legacy-resolver.mjs';
import { readUserIgnores, buildIgnoreMatcher, buildCopyPlan, rewriteManifestPaths, validateDeclaredPaths } from './lib/install-plan.mjs';
import { stageCopyPlan, atomicSwapDir } from './lib/fs-safe.mjs';
import { readManifestYaml, addModuleToManifest, appendSkillManifestRows, appendFilesManifestRows } from './lib/manifest-ops.mjs';
import { distributeToIdes } from './lib/ide-sync.mjs';
import { installModuleDeps } from './lib/npm-deps.mjs';
import { regenerateCentralConfig, readModuleConfigValues, resolveSectionKey } from './lib/config-gen.mjs';
import { createModuleDirectories } from './lib/module-dirs.mjs';
import { regenerateHelpCatalog } from './lib/help-catalog.mjs';

// Run the install verb. `opts` shape:
//   { source, ref, sha, channel, dryRun, module, setOverrides, projectDir }
// `module` selects one module by code when a legacy marketplace.json resolves to
// more than one. Returns nothing; throws BmadModuleError on failure.
export async function runInstall(opts) {
  const projectDir = opts.projectDir || process.cwd();

  // §1. Resolve _bmad/ first — fail fast if BMAD is not installed.
  const bmadDir = await findBmadDir(projectDir);
  if (!bmadDir) {
    throw new BmadModuleError(EXIT.NO_BMAD_DIR, `no _bmad/ found in ${projectDir}. Run \`bmad install\` first.`);
  }
  await ensureConfigDir(bmadDir);

  // §2. Normalize source, resolve the channel/ref to a concrete clone target,
  // then materialize (clone into the shared cache and copy out a working tree).
  const descriptor = parseSource(opts.source);
  const target = await resolveCloneTarget(descriptor, opts);
  const materialized = await materializeSource(descriptor, { ref: target.ref });

  try {
    // §3. Read + validate the manifest. New-spec modules carry a
    // `.claude-plugin/plugin.json#bmad`; legacy modules carry a
    // `.claude-plugin/marketplace.json` + module.yaml, which we resolve into a
    // synthetic manifest of the same shape.
    let manifest;
    let synthesized = null;
    if (await hasBmadPluginJson(materialized.dir)) {
      manifest = await readAndValidateManifest(materialized.dir);
    } else {
      const legacy = await resolveLegacyModule(materialized.dir, { selector: opts.module || null });
      if (!legacy) {
        throw new BmadModuleError(
          EXIT.BAD_MANIFEST,
          `no .claude-plugin/plugin.json#bmad and no .claude-plugin/marketplace.json at ${materialized.dir}`,
        );
      }
      // Legacy first-party modules (gds, bmm, …) legitimately use reserved codes.
      validateManifestObject(legacy.manifest, { allowReserved: true });
      manifest = legacy.manifest;
      synthesized = legacy.synthesized;
      process.stdout.write(`[bmad-module] resolved legacy module ${manifest.bmad.code} from marketplace.json\n`);
    }
    const code = manifest.bmad.code;

    // §4. Collision check against installed manifest.
    const existing = await readManifestYaml(bmadDir);
    const existingEntry = existing?.modules?.find((m) => m && m.name === code);
    if (existingEntry) {
      const sameSource =
        (existingEntry.rawSource && existingEntry.rawSource === descriptor.rawInput) ||
        (existingEntry.repoUrl && descriptor.kind === 'git' && existingEntry.repoUrl === descriptor.url);
      const sameSha = materialized.sha && existingEntry.sha === materialized.sha;
      if (sameSource && sameSha) {
        process.stdout.write(`[bmad-module] ${code} ${existingEntry.version} already installed at this sha — no-op.\n`);
        return;
      }
      if (existingEntry.source === 'community' && sameSource) {
        // Same module, different sha — user should use `update`.
        throw new BmadModuleError(
          EXIT.PREFIX_COLLISION,
          `${code} already installed from this source at sha ${existingEntry.sha || '?'}. ` +
            `Run \`bmad-module update ${code}\` to change version.`,
        );
      }
      throw new BmadModuleError(
        EXIT.PREFIX_COLLISION,
        `code "${code}" already used by ${existingEntry.source} module ` +
          `${existingEntry.repoUrl || existingEntry.rawSource || existingEntry.npmPackage || '(local)'}. ` +
          `Module authors should pick a unique bmad.code.`,
      );
    }

    // Strategy-5 legacy modules have no module.yaml/module-help.csv on disk —
    // the resolver synthesized them. Write them into the throwaway temp source so
    // buildCopyPlan/validateDeclaredPaths discover them via the normal path (the
    // synthetic manifest already points moduleDefinition/moduleHelpCsv at them).
    if (synthesized) {
      if (synthesized['module.yaml']) {
        await fsp.writeFile(path.join(materialized.dir, 'module.yaml'), synthesized['module.yaml'], 'utf8');
      }
      if (synthesized['module-help.csv']) {
        await fsp.writeFile(path.join(materialized.dir, 'module-help.csv'), synthesized['module-help.csv'], 'utf8');
      }
    }

    // §5. Build install plan.
    validateDeclaredPaths(materialized.dir, manifest);
    const userIgnores = await readUserIgnores(materialized.dir, manifest);
    const matchIgnore = buildIgnoreMatcher(userIgnores);
    const { plan, skillDestDirs } = await buildCopyPlan(materialized.dir, manifest, matchIgnore);
    const rewrittenManifestJson = rewriteManifestPaths(manifest);

    if (opts.dryRun) {
      process.stdout.write(`[bmad-module] dry-run: would install ${code} (${manifest.name} ${manifest.version})\n`);
      process.stdout.write(`[bmad-module] target: ${path.join(bmadDir, code)}\n`);
      process.stdout.write(`[bmad-module] files (${plan.length + 1}):\n`);
      process.stdout.write(`  .claude-plugin/plugin.json (rewritten to canonical paths)\n`);
      for (const { srcRel, destRel } of plan) {
        process.stdout.write(srcRel === destRel ? `  ${destRel}\n` : `  ${destRel}  (from ${srcRel})\n`);
      }
      return;
    }

    // §6. Stage to tmp/staged-out, then atomic swap.
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

    // §7. Register in manifests.
    await addModuleToManifest(bmadDir, code, {
      // Git installs record the resolved channel version (tag for stable/pinned,
      // 'main' for next) like the full installer; local installs keep the
      // module's declared version since there is no clone ref.
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

    process.stdout.write(
      `[bmad-module] installed ${code} (${manifest.name} ${manifest.version})${materialized.sha ? ` @ ${materialized.sha.slice(0, 7)}` : ''}\n`,
    );
    process.stdout.write(`[bmad-module] copied ${destPaths.length} file(s) to ${path.relative(projectDir, targetDir)}\n`);

    // §7.5. Complete the install the way the full installer does for custom
    // modules: install JS deps, generate central config + agent roster, create
    // declared working directories, and rebuild the merged help catalog. All are
    // non-fatal — the module is already committed to _bmad/<code>/.
    await finishModuleInstall({ bmadDir, code, targetDir, manifest, setOverrides: opts.setOverrides });

    // §8. Distribute the module's skills to the coding assistants the user chose
    // at `bmad install` time (read from _bmad/_config/manifest.yaml). This is the
    // same distribution the full installer performs; without it the skills would
    // sit in _bmad/ and never reach Claude Code / Cursor / Copilot / etc.
    const ideResult = await distributeToIdes({ projectDir, bmadDir });
    if (ideResult.skipped) {
      process.stdout.write(
        `[bmad-module] note: no coding assistants are configured in _bmad/_config/manifest.yaml — ` +
          `skills are in _bmad/${code}/ only. Run \`bmad install\` to choose your IDEs.\n`,
      );
    } else if (!ideResult.ok) {
      process.stderr.write(`[bmad-module] warning: ${ideResult.hint}\n`);
    }

    // §9. Warn about Claude-plugin-only surfaces (not distributed as skills).
    const claudeOnly = [];
    if (manifest.hooks) claudeOnly.push('hooks');
    if (manifest.mcpServers) claudeOnly.push('mcpServers');
    if (manifest.lspServers) claudeOnly.push('lspServers');
    if (Array.isArray(manifest.agents) && manifest.agents.length) claudeOnly.push('agents');
    if (Array.isArray(manifest.commands) && manifest.commands.length) claudeOnly.push('commands');
    if (claudeOnly.length) {
      process.stdout.write(
        `[bmad-module] note: ${claudeOnly.join(', ')} are Claude Code plugin surfaces and were copied but ` +
          `NOT auto-activated. Use Claude Code's plugin manager to wire them up.\n`,
      );
    }
    if (manifest.bmad?.install?.postInstallSkill) {
      process.stdout.write(`[bmad-module] next: run the \`${manifest.bmad.install.postInstallSkill}\` skill to finish setup.\n`);
    }
  } finally {
    await materialized.cleanup();
  }
}

// Resolve a parsed source + CLI flags into a concrete clone target:
//   { ref, channel, version }
// ref     — git ref to clone (null = default branch / local source)
// channel — manifest channel tag: 'stable' | 'pinned' | 'next' | null (local)
// version — manifest version string for git installs (tag for stable/pinned,
//           'main' for next); null for local (caller uses the module version).
//
// Mirrors the installer's channel semantics: an explicit --ref (or an @ref /
// /tree/<ref> parsed from the source) pins; --channel stable resolves the latest
// non-prerelease GitHub tag, falling back to next (with a warning) when there are
// no tags, the URL isn't a GitHub repo, or the tags API is unreachable.
const VALID_CHANNELS = new Set(['stable', 'pinned', 'next']);

export async function resolveCloneTarget(descriptor, opts) {
  // Reject typo'd channels up front (e.g. `--channel stabl`) so they error
  // instead of silently falling through the branches below to the `next` default.
  if (opts.channel && !VALID_CHANNELS.has(opts.channel)) {
    throw new BmadModuleError(EXIT.USAGE, `unknown --channel "${opts.channel}" (expected: stable, pinned, next)`);
  }

  if (descriptor.kind !== 'git') {
    return { ref: null, channel: null, version: null };
  }

  const explicitRef = opts.ref ?? descriptor.ref ?? null;
  let channel = opts.channel || (explicitRef ? 'pinned' : 'next');

  if (channel === 'pinned') {
    if (explicitRef) {
      return { ref: explicitRef, channel: 'pinned', version: explicitRef };
    } else {
      process.stderr.write(`[bmad-module] warning: --channel pinned needs a --ref; falling back to next.\n`);
      channel = 'next';
    }
  }

  if (channel === 'stable') {
    try {
      const r = await resolveChannel({ channel: 'stable', repoUrl: descriptor.url });
      if (r.resolvedFallback) {
        process.stderr.write(
          `[bmad-module] note: no stable release found for ${descriptor.displayName} (${r.reason}); tracking the default branch.\n`,
        );
        return { ref: null, channel: 'next', version: 'main' };
      }
      return { ref: r.ref, channel: 'stable', version: r.version };
    } catch (e) {
      process.stderr.write(`[bmad-module] warning: could not resolve stable channel (${e.message}); tracking the default branch.\n`);
      return { ref: null, channel: 'next', version: 'main' };
    }
  }

  // next
  return { ref: null, channel: 'next', version: 'main' };
}

// Shared post-copy completion for install and update: install JS deps, generate
// the central config + agent roster, create declared working directories, and
// rebuild the merged help catalog. Mirrors what the full installer does for a
// custom module so a skill-driven install lands the same on-disk state. Every
// step is non-fatal — the module files are already committed under _bmad/<code>/.
export async function finishModuleInstall({ bmadDir, code, targetDir, manifest, setOverrides }) {
  // 1. npm deps (in place — see npm-deps.mjs for the design note).
  const dep = await installModuleDeps(targetDir, manifest);
  if (dep.ran && dep.ok) process.stdout.write(`[bmad-module] installed npm dependencies for ${code}\n`);
  else if (dep.ran && !dep.ok) process.stderr.write(`[bmad-module] warning: npm install failed for ${code}: ${dep.error}\n`);

  // 2. Capture prior config (for directory move-detection on update) before regen.
  const sectionKey = await resolveSectionKey(bmadDir, code);
  let existingConfig = {};
  try {
    existingConfig = await readModuleConfigValues(bmadDir, sectionKey);
  } catch {
    /* no prior config — fine */
  }

  // 3. Central config + agent roster.
  let resolved = { values: {} };
  try {
    resolved = await regenerateCentralConfig(bmadDir, code, { setOverrides: setOverrides || {} });
  } catch (e) {
    process.stderr.write(`[bmad-module] warning: config generation failed for ${code}: ${e.message}\n`);
  }

  // 4. Declared working directories.
  try {
    const dirs = await createModuleDirectories(bmadDir, code, resolved.values, existingConfig);
    const made = dirs.createdDirs.length;
    const moved = dirs.movedDirs.length;
    if (made) process.stdout.write(`[bmad-module] created ${made} working director${made === 1 ? 'y' : 'ies'} for ${code}\n`);
    if (moved) process.stdout.write(`[bmad-module] moved ${moved} working director${moved === 1 ? 'y' : 'ies'} for ${code}\n`);
  } catch (e) {
    process.stderr.write(`[bmad-module] warning: directory creation failed for ${code}: ${e.message}\n`);
  }

  // 5. Merged help catalog.
  try {
    await regenerateHelpCatalog(bmadDir);
  } catch (e) {
    process.stderr.write(`[bmad-module] warning: help catalog rebuild failed: ${e.message}\n`);
  }
}
