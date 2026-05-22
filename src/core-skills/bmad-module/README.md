# bmad-module

The core BMAD skill for installing, updating, removing, and listing community
BMAD modules. Modules are standalone GitHub repos that conform to the BMAD
Module Manifest Spec (see `docs/spec.md` in `bmad-marketplace`).

## How it fits

- **Authors** publish a single repo with `.claude-plugin/plugin.json` that
  works in both Claude Code's plugin marketplace and BMAD-METHOD.
- **Users** install via this skill — no CLI required. Modules land in
  `_bmad/<bmad.code>/` alongside the official modules.
- **BMAD-METHOD** treats community-installed modules as a new `source: 'community'`
  row in `manifest.yaml`; re-running `bmad install` preserves them (with the
  paired `manifest-generator.js` patch).

## Verbs

```
bmad-module install <source> [--ref <r>] [--channel <c>] [--dry-run]
bmad-module update  <code|--all> [--ref <r>] [--channel <c>]
bmad-module remove  <code> [--purge]
bmad-module list    [--json]
```

`<source>` accepts `owner/repo`, a full git URL, or a local path.

## Behavior notes

- **Source of truth** for what was installed is `_bmad/_config/files-manifest.csv`
  (per-file hashes) and `_bmad/_config/skill-manifest.csv` (one row per
  shipped skill). `manifest.yaml` carries the source/version/sha tuple.
- **`update`** refuses to overwrite locally-modified files (hash mismatch
  against the recorded hash). Move overrides into `_bmad/custom/<code>/`
  and retry.
- **`remove`** without `--purge` preserves `_bmad/custom/<code>/` so a
  re-install picks the customizations back up. `--purge` deletes them.
- **Hooks / MCP / LSP / Claude subagents** declared in the module manifest
  are *copied* but NOT auto-activated by this skill. Use Claude Code's
  plugin manager to wire them up.

## Implementation

The skill itself is a thin verb router (`SKILL.md`). All filesystem work
happens in `scripts/bmad-module.mjs` and the `lib/` modules, which are
self-contained (only `yaml` and `semver` as runtime deps). They re-use no
BMAD-METHOD internal modules — the same code runs during development inside
`bmad-marketplace` and after the skill is PR'd into BMAD-METHOD core.

## Exit codes

See `SKILL.md` for the full table. The script's stderr always names the
condition; the codes are stable so tooling can branch.

## Tests

Integration tests live in `tests/integration.test.sh` and run end-to-end on
a fresh BMAD install. Fixtures for negative cases (collisions, path
traversal, reserved codes) are under `tests/fixtures/`.
