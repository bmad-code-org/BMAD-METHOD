---
title: bmad-module CLI
description: Reference for the bmad-module command — install, update, remove, and list BMad community/custom modules from inside a project.
sidebar:
  order: 7
---

`bmad-module` installs, updates, removes, and lists **community and custom BMad modules** in a project that already has BMad installed (a `_bmad/` directory). It is the command behind the `bmad-module` skill, and it mirrors the official installer's behavior for custom modules so a skill-driven install lands the same on-disk state.

Run it from your project root (the directory containing `_bmad/`), or point it elsewhere with `--project-dir`.

## Commands

```
bmad-module install <source> [--ref <ref>] [--channel <c>] [--module <code>] [--set <code>.<key>=<v>] [--dry-run]
bmad-module update  <code|--all> [--ref <ref>] [--channel <c>] [--set <code>.<key>=<v>]
bmad-module remove  <code> [--purge]
bmad-module list    [--json]
```

### install `<source>`

Resolve a module from `<source>`, copy it into `_bmad/<code>/`, generate its config and agent roster, create its declared working directories, and distribute its skills to the coding assistants (IDEs) you chose at `bmad install` time.

`<source>` may be:

- A GitHub shorthand — `acme/acme-devlog`
- A full Git URL — `https://github.com/acme/acme-devlog` (optionally with `@ref` or `/tree/<ref>`)
- A local path — `./examples/minimal/acme-md-lint`
- A legacy `marketplace.json` repo — `bmad-code-org/bmad-module-game-dev-studio`

| Flag | Description |
| --- | --- |
| `--ref <ref>` | Clone a specific git tag/branch/commit. Implies `--channel pinned`. |
| `--channel <c>` | Release channel: `stable`, `next`, or `pinned` (see [Channels](#channels)). |
| `--module <code>` | Pick one module by `code` when a legacy `marketplace.json` repo resolves to more than one. |
| `--set <code>.<key>=<v>` | Override a module config answer. Repeatable. |
| `--dry-run` | Print the resolved install plan without writing anything. |

### update `<code>` | `--all`

Re-resolve an installed module and atomically swap in the new version. Aborts (exit `80`) if you have locally modified tracked files, so your edits are never silently overwritten.

| Flag | Description |
| --- | --- |
| `--all` | Update every installed community/custom module instead of a single `<code>`. |
| `--ref <ref>` | Update to a specific git ref. |
| `--channel <c>` | Switch/track a release channel (`stable`, `next`, `pinned`). |
| `--set <code>.<key>=<v>` | Override a module config answer. Repeatable. |

### remove `<code>`

Remove an installed module: delete `_bmad/<code>/`, prune its entries from the central config and help catalog, and remove its skills from your IDE directories.

| Flag | Description |
| --- | --- |
| `--purge` | Also delete the module's user customizations under `_bmad/custom/` (e.g. `_bmad/custom/<skill>.toml`). Without `--purge`, customizations are left intact. |

### list

List installed community/custom modules with their code, version, channel, and source.

| Flag | Description |
| --- | --- |
| `--json` | Emit machine-readable JSON instead of a formatted table. |

## Global flags

| Flag | Description |
| --- | --- |
| `--project-dir <path>` | Project root containing `_bmad/` (default: current directory). |

## Channels

`bmad-module` mirrors the official installer's channel semantics:

- **`stable`** — the latest non-prerelease GitHub release tag. Falls back to `next` (with a note) when the repo has no tags, isn't a GitHub repo, or the tags API is unreachable.
- **`next`** — the repository's default branch (`main`).
- **`pinned`** — the exact `--ref` you supply (or an `@ref` / `/tree/<ref>` parsed from the source). `--channel pinned` without a `--ref` falls back to `next`.

An explicit `--ref` (or an `@ref` in the source) implies `pinned`. An unknown `--channel` value is rejected with a usage error rather than silently tracking `next`.

## Examples

```bash
# Install from GitHub shorthand
bmad-module install acme/acme-devlog

# Install a local module
bmad-module install ./examples/minimal/acme-md-lint

# Pin to a release tag
bmad-module install https://github.com/acme/acme-devlog --ref v0.4.0

# Install a legacy marketplace.json module
bmad-module install bmad-code-org/bmad-module-game-dev-studio

# Override a config answer at install time
bmad-module install acme/acme-devlog --set devlog.author="Ada Lovelace"

# List, update, and remove
bmad-module list
bmad-module update devlog
bmad-module update --all
bmad-module remove mdlint --purge
```

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Success |
| `2` | Usage error (bad arguments, unknown flag/channel) |
| `5` | Skill runtime files missing/corrupt — reinstall the skill |
| `10` | No `_bmad/` directory in the project |
| `20` | Missing or invalid `plugin.json` |
| `21` | Reserved `bmad.code` |
| `30` | Prefix collision with an existing module |
| `50` | Filesystem commit failed |
| `60` | Network / git clone failed |
| `70` | Path traversal detected in a manifest path |
| `80` | Update aborted: locally modified files |
| `90` | No such installed module |
