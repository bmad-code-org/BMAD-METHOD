#!/usr/bin/env node
// build-ide-sync — regenerates (and, with --check, verifies) the self-contained
// `ide-sync.mjs` bundle this skill ships, plus its sidecar `platform-codes.yaml`.
//
// Why this exists: after the bmad-module skill installs/updates/removes a
// community module under `_bmad/`, it must distribute that module's skills to
// exactly the coding assistants the user chose at `bmad install` time. The real
// distribution engine lives in `tools/installer/ide/*` (IdeManager /
// ConfigDrivenIdeSetup / platform-codes.yaml), but that code — and its
// dependencies (csv-parse, yaml, @clack/prompts) — is NOT present in a user's
// project (the installer ships the skill without node_modules). So we bundle the
// REAL engine into one dependency-free ESM file with esbuild (the same toolchain
// and vendoring philosophy as yaml.mjs), aliasing `../prompts` and
// `../project-root` to tiny shims so the interactive/heavy bits are dropped.
//
// The skill execs `vendor/ide-sync.mjs` from inside the user's project — no npx,
// no network, no node_modules. Because it is built from `tools/installer/ide/*`
// (not hand-forked) and verified by `vendor:check`, it can never silently drift
// from the engine the interactive installer uses.
//
// Usage (via root package.json):
//   npm run vendor:build     # regenerate ide-sync.mjs + platform-codes.yaml
//   npm run vendor:check     # fail if the committed bundle is stale (CI gate)

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const vendorDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(vendorDir, '../../../../../..'); // -> repo root
const installerDir = path.join(repoRoot, 'tools', 'installer');
const ideDir = path.join(installerDir, 'ide');

const outfile = path.join(vendorDir, 'ide-sync.mjs');
const sidecarOut = path.join(vendorDir, 'platform-codes.yaml');
const sidecarSrc = path.join(ideDir, 'platform-codes.yaml');

const promptsShim = path.join(vendorDir, 'shims', 'prompts.cjs');
const projectRootShim = path.join(vendorDir, 'shims', 'project-root.cjs');

const checkMode = process.argv.includes('--check');

const esbuild = await import('esbuild');
const esbuildVersion = require('esbuild/package.json').version;
const yamlVersion = require('yaml/package.json').version;
// csv-parse restricts ./package.json via its "exports" map, so read it directly.
const csvVersion = JSON.parse(await fs.readFile(path.join(repoRoot, 'node_modules', 'csv-parse', 'package.json'), 'utf8')).version;

// Redirect the engine's interactive/installer-only deps to lightweight shims so
// @clack/prompts and the custom-module-manager graph never enter the bundle.
const aliasPlugin = {
  name: 'ide-sync-aliases',
  setup(build) {
    build.onResolve({ filter: /^\.\.\/prompts$/ }, () => ({ path: promptsShim }));
    build.onResolve({ filter: /^\.\.\/project-root$/ }, () => ({ path: projectRootShim }));
  },
};

// NOTE: no builder-specific data (node version, timestamp) in the banner — the
// output must be reproducible so --check can byte-compare.
const banner = `// ============================================================================
// GENERATED — DO NOT EDIT BY HAND.  Run \`npm run vendor:build\` to regenerate.
// Self-contained bundle of BMAD's IDE-distribution engine
// (tools/installer/ide/* via tools/installer/core/ide-sync.js).
//
//   bundler   : esbuild ${esbuildVersion}
//   yaml      : ${yamlVersion}
//   csv-parse : ${csvVersion}
//
// Shipped because the bmad-module skill is copied into projects without
// node_modules; see build-ide-sync.mjs and vendor/README.md for the rationale.
// Reads platform-codes.yaml from beside this file (or $BMAD_IDE_PLATFORM_CODES).
// ============================================================================
// Provide a real \`require\` so esbuild's CJS interop can load node: builtins
// (node:path/fs/os/crypto) from this ESM bundle. All third-party deps are
// inlined, so only builtins ever reach this require.
import { createRequire as __createRequire } from 'node:module';
const require = __createRequire(import.meta.url);
`;

// The entry sets the platform-codes path to the sidecar beside the bundle, then
// runs the CLI. Imports are hoisted/initialised first; the engine reads the env
// var lazily (loadPlatformCodes), by which point the body below has set it.
const entryContents = `
import { runIdeSyncCli } from './core/ide-sync.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
if (!process.env.BMAD_IDE_PLATFORM_CODES) {
  process.env.BMAD_IDE_PLATFORM_CODES = join(__dir, 'platform-codes.yaml');
}

runIdeSyncCli(process.argv.slice(2))
  .then((code) => process.exit(code))
  .catch((err) => {
    process.stderr.write('[ide-sync] ' + ((err && err.stack) || err) + '\\n');
    process.exit(1);
  });
`;

const result = await esbuild.build({
  stdin: {
    contents: entryContents,
    resolveDir: installerDir, // so './core/ide-sync.js' resolves
    sourcefile: 'ide-sync-entry.mjs',
    loader: 'js',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node20',
  minify: false,
  charset: 'utf8',
  legalComments: 'inline',
  banner: { js: banner },
  plugins: [aliasPlugin],
  write: false,
});
const built = result.outputFiles[0].text;
const sidecar = await fs.readFile(sidecarSrc, 'utf8');

// Self-check: the freshly built bundle must distribute a fixture skill to a
// selected IDE with no node_modules on its resolution path (the runtime
// condition). Build a throwaway project, run the bundle, assert the output.
await selfCheck(built, sidecar);

if (checkMode) {
  const currentBundle = await fs.readFile(outfile, 'utf8').catch(() => null);
  const currentSidecar = await fs.readFile(sidecarOut, 'utf8').catch(() => null);
  if (currentBundle === built && currentSidecar === sidecar) {
    process.stdout.write(`vendor:check OK — ide-sync.mjs matches engine (esbuild ${esbuildVersion})\n`);
    process.exit(0);
  }
  process.stderr.write(
    `vendor:check FAILED — vendor/ide-sync.mjs or platform-codes.yaml is stale or hand-edited.\n` +
      `  The committed bundle no longer matches tools/installer/ide/*.\n` +
      `  Fix: run \`npm run vendor:build\` and commit the regenerated files.\n`,
  );
  process.exit(1);
}

await fs.writeFile(outfile, built, 'utf8');
await fs.writeFile(sidecarOut, sidecar, 'utf8');
process.stdout.write(`built ide-sync.mjs + platform-codes.yaml (self-check OK, esbuild ${esbuildVersion})\n`);

// ---------------------------------------------------------------------------

async function selfCheck(bundleText, sidecarText) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-ide-sync-check-'));
  try {
    // Lay down the bundle + sidecar together.
    await fs.writeFile(path.join(dir, 'ide-sync.mjs'), bundleText, 'utf8');
    await fs.writeFile(path.join(dir, 'platform-codes.yaml'), sidecarText, 'utf8');

    // Minimal project: one community skill recorded in the manifests.
    const proj = path.join(dir, 'proj');
    const skillDir = path.join(proj, '_bmad', 'demo', 'skills', 'bmad-demo-skill');
    await fs.mkdir(skillDir, { recursive: true });
    await fs.mkdir(path.join(proj, '_bmad', '_config'), { recursive: true });
    await fs.writeFile(path.join(skillDir, 'SKILL.md'), '---\nname: bmad-demo-skill\ndescription: demo\n---\nbody\n', 'utf8');
    await fs.writeFile(
      path.join(proj, '_bmad', '_config', 'manifest.yaml'),
      'installation:\n  version: "0.0.0"\nmodules:\n  - name: demo\n    source: community\nides:\n  - claude-code\n',
      'utf8',
    );
    await fs.writeFile(
      path.join(proj, '_bmad', '_config', 'skill-manifest.csv'),
      'canonicalId,name,description,module,path\n"bmad-demo-skill","bmad-demo-skill","demo","demo","_bmad/demo/skills/bmad-demo-skill/SKILL.md"\n',
      'utf8',
    );

    const { spawn } = await import('node:child_process');
    const code = await new Promise((resolve) => {
      const child = spawn(process.execPath, [path.join(dir, 'ide-sync.mjs'), '-d', proj], {
        stdio: process.env.BMAD_IDE_SYNC_DEBUG ? 'inherit' : 'ignore',
      });
      child.on('close', resolve);
    });
    if (code !== 0) throw new Error(`ide-sync self-check: bundle exited ${code}`);

    const distributed = path.join(proj, '.claude', 'skills', 'bmad-demo-skill', 'SKILL.md');
    await fs.access(distributed).catch(() => {
      throw new Error('ide-sync self-check FAILED: skill was not distributed to .claude/skills');
    });
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}
