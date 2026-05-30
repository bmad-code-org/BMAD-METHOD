# `lib/vendor/` — vendored runtime dependencies

This directory holds **self-contained, generated** copies of third-party libraries the skill needs at runtime. They are committed on purpose.

## Why vendor at all?

The `bmad-module` skill is **copied into a user's project** at `_bmad/core/skills/bmad-module/` by `npx bmad-method install`. The installer:

- strips `node_modules` while copying (`tools/installer/core/installer.js`),
- ships **no** `package.json` under the skill, and
- never runs `npm install` inside `_bmad/`.

So a bare `import 'yaml'` cannot resolve at runtime — it throws `ERR_MODULE_NOT_FOUND` before any of the skill's exit codes can fire. Every other script BMAD installs is zero-third-party-dependency; vendoring keeps this skill self-sufficient the same way, without setup.

Files here are imported by **relative path** (`./vendor/yaml.mjs`), which resolves regardless of cwd, install location, or `node_modules` presence.

## What's vendored — and what's NOT

| Need | Strategy | Where |
|---|---|---|
| `yaml` (parse/stringify `_bmad/_config/manifest.yaml`) | **vendored, real library** | `vendor/yaml.mjs` |
| `semver` (`valid` + `validRange` on `plugin.json`) | **dropped** — hand-rolled, `node:` only | `../semver-lite.mjs` |

`manifest.yaml` is **co-owned** with BMAD core, which reads/writes it with the same `yaml` package and the same `{indent:2, lineWidth:0}` options (`tools/installer/core/manifest.js`). Hand-rolling a YAML emitter risks diverging from that on the user's live install state, so we ship the **real** library and verify byte-identical output in `build-vendor.mjs`. `semver` is only input-validation of an author's manifest, so it is safe to hand-roll.

## `yaml.mjs`

- **GENERATED — do not edit by hand.** An esbuild single-file bundle of the `yaml` npm package (eemeli/yaml), tree-shaken to just `parse` + `stringify`.
- The exact pinned version and build provenance are in the file's header.
- Upstream license is retained inline (`legalComments: 'inline'`).

### Regenerating

After bumping `yaml` (or esbuild) in the repo's **root** `package.json` + `npm install`:

```bash
npm run vendor:build     # regenerate this yaml.mjs
npm run vendor:check      # verify it's in sync (what CI runs)
```

The build is **deterministic** for a given `yaml` + `esbuild` version (both pinned in the lockfile) and self-checks a parse→stringify round-trip.

**You don't have to remember to do this.** `vendor:check` is wired into `npm test` (husky pre-commit) and `npm run quality` (the `validate` job in `.github/workflows/quality.yaml`). If the committed bundle drifts from the installed `yaml`/`esbuild` version, those gates fail with a message telling you to run `npm run vendor:build` — so a bump can't land with a stale bundle, and manifest writes stay byte-identical between BMAD core and this skill.

Lint/format intentionally ignore this directory (see `eslint.config.mjs` global ignores and `.prettierignore`) — it is generated, not authored.
