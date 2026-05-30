import path from 'node:path';
import { EXIT, BmadModuleError } from './lib/exit.mjs';
import { findBmadDir, ensureConfigDir } from './lib/bmad-dir.mjs';
import { parseSource, materializeSource } from './lib/source.mjs';
import { readAndValidateManifest } from './lib/plugin-json.mjs';
import { readUserIgnores, buildIgnoreMatcher, buildCopyPlan, rewriteManifestPaths, validateDeclaredPaths } from './lib/install-plan.mjs';
import { stageCopyPlan, atomicSwapDir } from './lib/fs-safe.mjs';
import { readManifestYaml, addModuleToManifest, appendSkillManifestRows, appendFilesManifestRows } from './lib/manifest-ops.mjs';
import { distributeToIdes } from './lib/ide-sync.mjs';

// Run the install verb. `opts` shape:
//   { source, ref, sha, channel, dryRun, projectDir }
// Returns nothing; throws BmadModuleError on failure.
export async function runInstall(opts) {
  const projectDir = opts.projectDir || process.cwd();

  // §1. Resolve _bmad/ first — fail fast if BMAD is not installed.
  const bmadDir = await findBmadDir(projectDir);
  if (!bmadDir) {
    throw new BmadModuleError(EXIT.NO_BMAD_DIR, `no _bmad/ found in ${projectDir}. Run \`bmad install\` first.`);
  }
  await ensureConfigDir(bmadDir);

  // §2. Normalize + materialize source.
  const descriptor = parseSource(opts.source);
  const materialized = await materializeSource(descriptor, { ref: opts.ref || null });

  try {
    // §3. Read + validate plugin.json.
    const manifest = await readAndValidateManifest(materialized.dir);
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
          `Module authors should pick a unique bmad.code (spec §7.1).`,
      );
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
      version: manifest.bmad.moduleVersion || manifest.version,
      repoUrl: descriptor.kind === 'git' ? descriptor.url : null,
      sha: materialized.sha,
      ref: materialized.ref,
      channel: opts.channel || (opts.ref ? 'pinned' : descriptor.kind === 'git' ? 'next' : null),
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
