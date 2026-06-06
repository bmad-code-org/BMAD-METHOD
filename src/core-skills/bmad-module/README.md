# bmad-module

The core BMAD skill for installing, updating, removing, and listing community BMAD modules. Modules are standalone GitHub repos that conform to the BMAD Module Manifest Spec.

## How it fits

- **Authors** publish a single repo with `.claude-plugin/plugin.json` that works in both Claude Code's plugin marketplace and BMAD-METHOD.
- **Legacy modules** (a `.claude-plugin/marketplace.json` + `module.yaml`, the pre-`plugin.json` format) also install: `install` resolves a legacy repo into a synthetic manifest and runs it through the same pipeline. See `lib/legacy-resolver.mjs`, a self-contained port of the full installer's `PluginResolver` strategies.
- **Users** install via this skill — no CLI required. Modules are staged under `_bmad/<bmad.code>/`, then their skills are distributed to the coding assistants the user chose at `bmad install` time (the `ides:` list in `_bmad/_config/manifest.yaml`), exactly like official modules.
- **BMAD-METHOD** treats community-installed modules as a new `source: 'community'` row in `manifest.yaml`; re-running `bmad install` preserves them (`manifest-generator.js` carries `source: 'community'` rows through regeneration).

## Verbs

```
bmad-module install <source> [--ref <r>] [--channel <c>] [--module <code>] [--dry-run]
bmad-module update  <code|--all> [--ref <r>] [--channel <c>]
bmad-module remove  <code> [--purge]
bmad-module list    [--json]
```

`<source>` accepts `owner/repo`, a full git URL (`https://…`, `git@…`, `ssh://`, `git://`), or a local path. A git source may carry an `@<tag-or-branch>` suffix and may be a browser-style deep link (`/tree|blob/<ref>[/<subdir>]`, GitLab `/-/tree/…`, Gitea `/src/branch/…`, or `?path=`); `parseSource` in `lib/source.mjs` extracts the embedded ref and a repo subdirectory, mirroring the installer's `custom-module-manager.js`.

## Behavior notes

- **Source resolution & caching.** Git sources are cloned into a shared cache at `~/.bmad/cache/custom-modules/<host>/<owner>/<repo>/` (with `.bmad-source.json` / `.bmad-channel.json` metadata), the same cache the full installer uses; a matching ref is reused, otherwise the clone is fetched/refreshed, and a fetch failure keeps the stale copy so installs work offline. The install then copies the module root (the subdir, if the URL named one) out of the cache into a throwaway temp tree to stage from — the cache is never mutated. Local sources are copied straight to the temp tree. See `lib/cache.mjs`.
- **Channels.** `lib/channel-resolver.mjs` (a `node:`-only port of the installer's `channel-resolver.js`) resolves `--channel`: `pinned` → an explicit `--ref`/`@ref`; `stable` → the latest non-prerelease GitHub release tag (falls back to `next` when there are no tags, the URL isn't GitHub, or the tags API is unreachable); `next` (the default for a bare git source) → the default branch. `update` re-resolves the channel the module was installed with.
- **Source of truth** for what was installed is `_bmad/_config/files-manifest.csv` (per-file hashes) and `_bmad/_config/skill-manifest.csv` (one row per shipped skill). `manifest.yaml` carries the source/version/sha tuple.
- **`update`** refuses to overwrite locally-modified files (hash mismatch against the recorded hash). Move overrides into `_bmad/custom/<code>/` and retry.
- **`remove`** without `--purge` preserves `_bmad/custom/<code>/` so a re-install picks the customizations back up. `--purge` deletes them. Remove also prunes the module's skills from every configured IDE.
- **IDE distribution** runs after every install/update/remove via a self-contained bundle of BMAD's real IDE engine, shipped at `lib/vendor/ide-sync.mjs` (built from `tools/installer/ide/*` by `lib/vendor/build-ide-sync.mjs`, gated by `vendor:check`). The skill execs it locally — no npx, no network. The same engine also backs the `bmad ide-sync` CLI command and the full installer's IDE setup, so all three stay in lockstep. If the bundle is unreachable on an older install, the skill says so and points the user at `bmad ide-sync`.
- **Hooks / MCP / LSP / Claude subagents** declared in the module manifest are _copied_ but NOT auto-activated by this skill (they are Claude Code plugin surfaces, not skills). Use Claude Code's plugin manager to wire them up.
- **Legacy resolution** keys off the absence of a `plugin.json#bmad`: if `marketplace.json` is present, the skill resolves the module via `module.yaml` (or synthesizes one from SKILL.md frontmatter when none exists). A repo defining more than one module exits 20 with the available codes; re-run with `--module <code>`. The reserved-code guard (exit 21) is relaxed on the legacy path so first-party modules (`gds`, `bmm`, …) install; current-spec `plugin.json` authors still get exit 21.

## Implementation

The skill itself is a thin verb router (`SKILL.md`). `scripts/bmad-module.mjs` is a zero-import launcher that guards the import graph (a missing/corrupt runtime file becomes a documented exit code, not a raw stack trace); the verb dispatcher lives in `scripts/cli.mjs` and all filesystem work happens in the `lib/` modules. These carry **no registry dependencies** — important because the installer copies the skill into the IDE skills directories (e.g. `.claude/skills/bmad-module/`) without `node_modules` and never runs `npm install` there:

- `manifest.yaml` is read/written with a **vendored copy of the real `yaml` library** (`lib/vendor/yaml.mjs`, regenerated by `lib/vendor/build-vendor.mjs`) so it stays byte-identical to BMAD core's writer.
- `semver` validity/range checks **and** the version comparison the stable-channel resolver needs (`prerelease`, `compare`, `rcompare`) use a small `node:`-only helper (`lib/semver-lite.mjs`) instead of the `semver` package.
- The shared clone cache (`lib/cache.mjs`) and channel resolution (`lib/channel-resolver.mjs`) use only `node:child_process` / `node:https` so the skill needs no dependencies after distribution.

## Exit codes

See `SKILL.md` for the full table. The script's stderr always names the condition; the codes are stable so tooling can branch.

## Tests

Integration tests live in `tests/integration.test.sh` and run end-to-end on a fresh BMAD install. Fixtures for negative cases (collisions, path traversal, reserved codes) are under `tests/fixtures/`; legacy-format fixtures (strategy-1 module files, a reserved code, and the synthesize fallback) are under `tests/fixtures/examples/legacy/`.

The pure (no-network) install plumbing — `parseSource` URL/`@ref`/subdir parsing, `semver-lite`, and the `channel-resolver` helpers — is unit-tested in `test/test-bmad-module-source.mjs` (run via `npm run test:skill-source`, included in `npm test`), kept at parity with the installer's `test/test-parse-source-urls.js` and `test/test-installer-channels.js`.
