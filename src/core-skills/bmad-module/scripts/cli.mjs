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
      // --set is repeatable; collect into an array. All other flags take the
      // last value seen.
      if (key === 'set') {
        (out.flags.set ||= []).push(val);
      } else {
        out.flags[key] = val;
      }
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
  const setOverrides = parseSetOverrides(parsed.flags.set);

  try {
    switch (verb) {
      case 'install':
        await runInstall({
          source: parsed._[0],
          ref: parsed.flags['ref'] || null,
          channel: parsed.flags['channel'] || null,
          dryRun: !!parsed.flags['dry-run'],
          setOverrides,
          projectDir,
        });
        break;
      case 'update':
        await runUpdate({
          code: parsed._[0] || null,
          all: !!parsed.flags['all'],
          ref: parsed.flags['ref'] || null,
          channel: parsed.flags['channel'] || null,
          setOverrides,
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

// Parse repeatable `--set <code>.<key>=<value>` flags into a nested map
// { [code]: { [key]: value } }. Mirrors the full installer's --set spec.
function parseSetOverrides(rawList) {
  const out = {};
  if (!Array.isArray(rawList)) return out;
  for (const spec of rawList) {
    const eq = spec.indexOf('=');
    if (eq === -1) throw new BmadModuleError(EXIT.USAGE, `--set expects <code>.<key>=<value>, got "${spec}"`);
    const lhs = spec.slice(0, eq);
    const value = spec.slice(eq + 1);
    const dot = lhs.indexOf('.');
    if (dot === -1) throw new BmadModuleError(EXIT.USAGE, `--set expects <code>.<key>=<value>, got "${spec}"`);
    const code = lhs.slice(0, dot);
    const key = lhs.slice(dot + 1);
    if (!code || !key) throw new BmadModuleError(EXIT.USAGE, `--set expects <code>.<key>=<value>, got "${spec}"`);
    (out[code] ||= {})[key] = value;
  }
  return out;
}

function printUsage() {
  process.stderr.write(`bmad-module — install, update, remove, or list BMAD community modules.

USAGE
  bmad-module install <source> [--ref <ref>] [--channel <c>] [--set <code>.<key>=<v>] [--dry-run]
  bmad-module update <code|--all> [--ref <ref>] [--channel <c>] [--set <code>.<key>=<v>]
  bmad-module remove <code> [--purge]
  bmad-module list [--json]

GLOBAL FLAGS
  --project-dir <path>   Project root containing _bmad/ (default: cwd)
  --set <code>.<key>=<v> Override a module config answer (repeatable)

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
  50   filesystem commit failed
  60   network/git clone failed
  70   path traversal in manifest
  80   update aborted: locally modified files
  90   no such installed module
`);
}
