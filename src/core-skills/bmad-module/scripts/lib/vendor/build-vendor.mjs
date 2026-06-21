#!/usr/bin/env node
// build-vendor — regenerates (and, with --check, verifies) the vendored,
// self-contained copy of the `yaml` library this skill ships.
//
// Why this exists: the bmad-module skill is COPIED into a user's project at
// `_bmad/core/skills/bmad-module/` by `npx bmad-method install`. The installer
// strips `node_modules` (tools/installer/core/installer.js), ships no
// package.json under the skill, and never runs `npm install` in `_bmad/`. So a
// bare `import 'yaml'` cannot resolve at runtime. Every other script BMAD
// installs is zero-third-party-dep; this is the one library we cannot safely
// hand-roll, because `_bmad/_config/manifest.yaml` is CO-OWNED with BMAD core
// (tools/installer/core/manifest.js writes it with the same `yaml` package and
// the same {indent:2,lineWidth:0} options). Vendoring the REAL library is the
// only way to guarantee byte-identical round-trips.
//
// The output `yaml.mjs` is imported by RELATIVE path from manifest-ops.mjs and
// frontmatter.mjs, so it resolves regardless of cwd, install location, or
// node_modules presence.
//
// Usage (via root package.json):
//   npm run vendor:build     # regenerate scripts/lib/vendor/yaml.mjs
//   npm run vendor:check     # fail if the committed bundle is stale (CI gate)
//
// The output is DETERMINISTIC for a given yaml + esbuild version (both pinned in
// the lockfile), which is what lets `--check` byte-compare. Bumping `yaml` (or
// esbuild) makes the check fail until you re-run `npm run vendor:build` and
// commit — so the vendored copy can never silently drift from BMAD core's.

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const vendorDir = path.dirname(fileURLToPath(import.meta.url));
const outfile = path.join(vendorDir, 'yaml.mjs');
const checkMode = process.argv.includes('--check');

const esbuild = await import('esbuild');
const yamlVersion = require('yaml/package.json').version;
const esbuildVersion = require('esbuild/package.json').version;

// NOTE: intentionally no builder-specific data (node version, timestamp) in the
// banner — the output must be reproducible so --check can byte-compare.
const banner = `// ============================================================================
// GENERATED — DO NOT EDIT BY HAND.  Run \`npm run vendor:build\` to regenerate.
// Vendored, self-contained bundle of the \`yaml\` npm package (eemeli/yaml).
//
//   yaml    : ${yamlVersion}
//   bundler : esbuild ${esbuildVersion}
//
// Shipped because the skill is copied into projects without node_modules; see
// build-vendor.mjs and vendor/README.md for the rationale. Only \`parse\` and
// \`stringify\` are re-exported (tree-shaken). Upstream license retained below.
// ============================================================================
import { createRequire as __createRequire } from 'node:module';
const require = __createRequire(import.meta.url);
`;

const result = await esbuild.build({
  stdin: {
    contents: "export { parse, stringify } from 'yaml';",
    resolveDir: vendorDir,
    sourcefile: 'vendor-entry.mjs',
    loader: 'js',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node20',
  minify: false,
  legalComments: 'inline',
  charset: 'utf8',
  banner: { js: banner },
  write: false,
});
const built = result.outputFiles[0].text;

// Self-check: the freshly built bundle must import and round-trip without any
// node_modules on its resolution path (the runtime condition). Import it from a
// temp file so we never need to write the real output to do this.
const tmp = path.join(os.tmpdir(), `bmad-vendor-yaml-${process.pid}.mjs`);
await fs.writeFile(tmp, built, 'utf8');
try {
  const { parse, stringify } = await import(pathToFileURL(tmp).href);
  const sample = { modules: [{ name: 'demo', version: '1.2.3', repoUrl: 'https://example.com/x', when: '2026-05-23T00:00:00.000Z' }] };
  const round = parse(stringify(sample, { indent: 2, lineWidth: 0 }));
  if (JSON.stringify(round) !== JSON.stringify(sample)) {
    throw new Error('vendor self-check FAILED: round-trip mismatch');
  }
} finally {
  await fs.rm(tmp, { force: true });
}

if (checkMode) {
  const current = await fs.readFile(outfile, 'utf8').catch(() => null);
  if (current === built) {
    process.stdout.write(`vendor:check OK — yaml.mjs matches yaml@${yamlVersion} (esbuild ${esbuildVersion})\n`);
    process.exit(0);
  }
  process.stderr.write(
    `vendor:check FAILED — scripts/lib/vendor/yaml.mjs is stale or hand-edited.\n` +
      `  Expected the bundle for yaml@${yamlVersion} (esbuild ${esbuildVersion}).\n` +
      `  Fix: run \`npm run vendor:build\` and commit the regenerated yaml.mjs.\n` +
      `  (This guards manifest.yaml fidelity: the vendored yaml must match the\n` +
      `   one BMAD core writes manifests with — see vendor/README.md.)\n`,
  );
  process.exit(1);
}

await fs.writeFile(outfile, built, 'utf8');
process.stdout.write(`vendored yaml@${yamlVersion} -> ${path.relative(process.cwd(), outfile)} (self-check OK)\n`);
