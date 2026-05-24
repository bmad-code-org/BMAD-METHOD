// bmad-module CLI — verb dispatcher. Loaded by the thin launcher in
// bmad-module.mjs, which guards this whole import graph: if any runtime asset
// (e.g. lib/vendor/yaml.mjs) is missing, the launcher reports a documented
// setup error instead of leaking a raw ESM stack trace. See bmad-module.mjs.
//
// Usage:
//   node bmad-module.mjs install <source> [--ref <r>] [--channel <c>] [--dry-run] [--project-dir <p>]
//   node bmad-module.mjs update <code|--all> [--ref <r>] [--channel <c>] [--project-dir <p>]
//   node bmad-module.mjs remove <code> [--purge] [--project-dir <p>]
//   node bmad-module.mjs list [--json] [--project-dir <p>]
//
// Exit codes — see SKILL.md / lib/exit.mjs. 0 = ok; everything ≥5 = structured error.

import { runInstall } from './install.mjs';
import { runUpdate } from './update.mjs';
import { runRemove } from './remove.mjs';
import { runList } from './list.mjs';
import { EXIT, BmadModuleError } from './lib/exit.mjs';

const VERBS = new Set(['install', 'update', 'remove', 'list']);

function parseArgs(argv) {
  const out = { _: [], flags: {} };
  let i = 0;
  while (i < argv.length) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      // boolean flags
      if (['dry-run', 'purge', 'all', 'json'].includes(key)) {
        out.flags[key] = true;
        i++;
        continue;
      }
      // value flags
      const val = argv[i + 1];
      if (val === undefined || val.startsWith('--')) {
        throw new BmadModuleError(EXIT.USAGE, `flag --${key} requires a value`);
      }
      out.flags[key] = val;
      i += 2;
      continue;
    }
    out._.push(a);
    i++;
  }
  return out;
}

export async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h') {
    printUsage();
    process.exit(EXIT.USAGE);
  }
  const verb = argv[0];
  if (!VERBS.has(verb)) {
    process.stderr.write(`[bmad-module] unknown verb "${verb}". Valid: install, update, remove, list.\n`);
    process.exit(EXIT.USAGE);
  }

  let parsed;
  try {
    parsed = parseArgs(argv.slice(1));
  } catch (e) {
    if (e instanceof BmadModuleError) {
      process.stderr.write(`[bmad-module] ${e.message}\n`);
      process.exit(e.code);
    }
    throw e;
  }

  const projectDir = parsed.flags['project-dir'] || process.cwd();

  try {
    switch (verb) {
      case 'install':
        await runInstall({
          source: parsed._[0],
          ref: parsed.flags['ref'] || null,
          channel: parsed.flags['channel'] || null,
          dryRun: !!parsed.flags['dry-run'],
          projectDir,
        });
        break;
      case 'update':
        await runUpdate({
          code: parsed._[0] || null,
          all: !!parsed.flags['all'],
          ref: parsed.flags['ref'] || null,
          channel: parsed.flags['channel'] || null,
          projectDir,
        });
        break;
      case 'remove':
        await runRemove({
          code: parsed._[0],
          purge: !!parsed.flags['purge'],
          projectDir,
        });
        break;
      case 'list':
        await runList({
          json: !!parsed.flags['json'],
          projectDir,
        });
        break;
    }
  } catch (e) {
    if (e instanceof BmadModuleError) {
      process.stderr.write(`[bmad-module] ${e.message}\n`);
      process.exit(e.code);
    }
    process.stderr.write(`[bmad-module] unexpected error: ${e.stack || e.message}\n`);
    process.exit(1);
  }
}

function printUsage() {
  process.stderr.write(`bmad-module — install, update, remove, or list BMAD community modules.

USAGE
  bmad-module install <source> [--ref <ref>] [--channel <c>] [--dry-run]
  bmad-module update <code|--all> [--ref <ref>] [--channel <c>]
  bmad-module remove <code> [--purge]
  bmad-module list [--json]

GLOBAL FLAGS
  --project-dir <path>   Project root containing _bmad/ (default: cwd)

EXAMPLES
  bmad-module install acme/acme-devlog
  bmad-module install ./examples/minimal/acme-md-lint
  bmad-module install https://github.com/acme/acme-devlog --ref v0.4.0
  bmad-module list
  bmad-module update devlog
  bmad-module remove mdlint --purge

EXIT CODES
  0    success
  2    usage error
  5    skill runtime files missing/corrupt — reinstall the skill
  10   no _bmad/ in project
  20   missing or invalid plugin.json
  21   reserved bmad.code
  30   prefix collision with existing module
  40   file overlap outside the module root
  50   filesystem commit failed
  60   network/git clone failed
  70   path traversal in manifest
  80   update aborted: locally modified files
  90   no such installed module
`);
}
