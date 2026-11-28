---
title: Module Files
description: 'The files that make a BMad module: bmod.toml, roster.toml, retired.toml, migration files, and help, with every key and rule.'
sidebar:
  order: 4
---

Use this page for the exact keys in a module's files. For what a module is and how to choose a registration shape, see [Modules and Registration](../toolsmith/modules.md). Smithy (`bmad-toolsmith`) writes these files for you, and `validate_manifests.py` checks them.

## Where the Files Live

| File | Multi-skill module | Single-skill module |
| --- | --- | --- |
| `bmod.toml` with `[bmod]` | In the `bmod-<code>` record folder | In the skill's folder |
| `bmod.toml` with `[skill]` | In each member's folder | The same file, with `[skill]` empty (unless declaring `scripts`) |
| `help/help.md` | In the record folder | In the skill's folder |
| `SKILL.md` | The record has a stub redirecting to `bmad setup <code>` | The skill's own |
| `roster.toml`, `retired.toml`, `migration-<n>.toml` | In the record folder | Beside `bmod.toml` |

`bmad` finds a module by its `[bmod]` table. Validation requires a multi-skill record folder to be named `bmod-<code>`, while a single-skill module keeps the skill's name.

## `bmod.toml`

A file holds a `[bmod]` table, a `[skill]` table, or both.

### `[bmod]`

| Key | Required | Meaning |
| --- | --- | --- |
| `code` | Yes | Configuration namespace and the name in `bmad setup <code>`. Cannot be `_config`, `custom`, `modules`, or `scripts` |
| `version` | Yes | Valid SemVer (`MAJOR.MINOR.PATCH` with optional prerelease) compared with the source to offer updates. Rejects `-dev` prereleases (cannot be ordered by `setup.py`) and `+build` metadata (ignored during ordering) |
| `update_source` | Yes | Where updates come from. Starts with `github:`, `https://`, `file:`, or `plugin:` |
| `skills` | Multi-skill | Every member skill |
| `required_skills` | No | Skills the module needs; see [Dependencies](#dependencies) |
| `recommended_skills` | No | Skills that help beside it; setup reports them without insisting |
| `pre_install_message` | For validation | Shown before an update or before `bmad` installs the record itself (empty string if unused) |
| `post_install_message` | For validation | Shown after installing (empty string if unused) |

Setup accepts a record without install messages, whereas `validate_manifests.py` requires both keys (empty if unused).

A `github:` source is `github:<owner>/<repo>/<path>`, where `<path>` is the folder holding the skill folders (such as `skills` or `skills/founder`). With no path, the repository root is the skill. Update checks read `bmod.toml` from the `main` branch.

### `[[bmod.config_questions]]`

Each entry is one question for `bmad setup <code>`, asked in file order:

| Key | Required | Meaning |
| --- | --- | --- |
| `key` | Yes | Dotted key read as `modules.<code>.<key>`. Must not equal `<code>` or start with `<code>.` |
| `prompt` | Yes | The question text |
| `default` | Yes | The default answer, keeping `{project-root}` literal |
| `scope` | No | `team` (default, written to `_bmad/config.toml`) or `user` (personal, written to `_bmad/custom/config.user.toml`) |

No other keys are allowed.

### `[[bmod.knowledge]]`

Optional. Lists extra help documents inside the record folder with `path` and `skills` (`"*"` by default, or a list of skill names).

### `[skill]`

| Key | Required | Meaning |
| --- | --- | --- |
| `bmod` | In a member file | The record folder name, such as `bmod-acme` |
| `source` | In a member file | Must equal the record's `update_source` |
| `required_skills` | No | What this skill alone requires |
| `recommended_skills` | No | What helps beside this skill |
| `scripts` | No | Relative paths such as `scripts/foo.py` installed by setup into `_bmad/<code>/scripts/` |

In a single-skill module, leave `[skill]` empty unless declaring `scripts`, because `[bmod]` in the same file already identifies the skill.

### Dependencies

A plain string names a skill from the same source; a table names a skill from another source:

```toml
required_skills = [
  "acme-release-notes",
  { skill = "bmad", version = "6.13.0", source = "github:bmad-code-org/BMAD-METHOD/skills/core-tools" },
]
```

`version` is optional and cannot carry `+build` metadata. Module-wide dependencies go in `[bmod]` (including all dependencies of a single-skill module), while member-specific dependencies go in `[skill]`.

### Examples

A multi-skill record:

```toml
[bmod]
code = "acme"
version = "1.0.0"
update_source = "github:acme/skills/skills"
skills = ["acme-release-notes", "acme-agent-scout"]
required_skills = [{ skill = "bmad", version = "6.13.0", source = "github:bmad-code-org/BMAD-METHOD/skills/core-tools" }]
pre_install_message = ""
post_install_message = ""

[[bmod.config_questions]]
key = "release_folder"
prompt = "Where should release notes go?"
default = "{project-root}/docs/releases"
```

A member skill:

```toml
[skill]
bmod = "bmod-acme"
source = "github:acme/skills/skills"
```

A single-skill module:

```toml
[bmod]
code = "acme"
version = "0.1.0"
update_source = "github:acme/acme-release-notes/skills"
required_skills = [{ skill = "bmad", version = "6.13.0", source = "github:bmad-code-org/BMAD-METHOD/skills/core-tools" }]
pre_install_message = ""
post_install_message = ""

[skill]
```

## Reading Setup Answers

Skills read saved setup answers through BMad's config resolver using dotted keys such as `modules.acme.release_folder`, so you do not have to parse TOML files manually. Smithy wires those lookups in for you when building a module, and you can inspect the script under `_bmad/scripts/resolve_config.py` if you need exact flags.

## `roster.toml`

Required whenever a module includes an agent so `bmad`, `bmad-party-mode`, `bmad-forge-idea`, and `bmad-advanced-elicitation` know who is available. A member with `skill` is an installed agent; a member without `skill` is a guest available only inside groups:

```toml
[[members]]
code = "acme-agent-scout"
skill = "acme-agent-scout"
name = "Scout"
icon = "🔭"
title = "Release Scout"
persona = "Two sentences describing how this agent thinks and speaks."

[[groups]]
id = "release-team"
name = "Release Team"
scene = "A release readiness meeting."
members = ["acme-agent-scout"]
memory = false
```

## `retired.toml`

Lists skills the module no longer ships. `bmad setup` offers to delete any still installed and moves `_bmad/custom/` override files for renamed skills to the new name. Retired names are never reused, and each name appears only once:

```toml
renamed = [{ from = "acme-notes", to = "acme-release-notes" }]
removed = ["acme-old-check"]
```

## `migration-<n>.toml`

A module ships version migrations beside its `bmod.toml`, and `bmad migrate` executes them in numeric `<n>` order. The `[migration]` table requires `module`, `from`, `to`, `title`, `summary`, `detect`, `guide`, and `checklist` (files missing any required key are skipped):

```toml
[migration]
module = "acme"
from = "1"
to = "2"
title = "Move v1 release notes into the v2 releases folder"
summary = "Copies legacy release files into the new per-release folder layout after making a backup."
detect = "Legacy release-*.md files exist at the repository root without a releases/ folder."
guide = """
1. Back up existing release-*.md files to .acme-v1-backup/.
2. Move each file into docs/releases/<version>/release.md.
3. Update cross-links and report moved paths.
"""
checklist = [
  "Backup created before moving any file",
  "Every release-*.md file landed in docs/releases/<version>/release.md",
]
```

## Help Files

`help/help.md` summarizes the module for the `bmad` skill. Additional `help/*.md` files are topic guides read only when `help/help.md` references them. See [Write the Help](../toolsmith/modules.md#write-the-help).

## Validate

Ask Smithy (`bmad-toolsmith`) to validate your module before releasing it. Manifest validation supports both flat repositories (`skills/<skill>/bmod.toml`) and multi-module grouped repositories (`skills/<module>/<skill>/bmod.toml`, where each module's skills sit one level down under `skills/` and install flat under their skill names), checking manifest schemas, module membership, SemVer rules (rejecting `-dev` prereleases and `+build` metadata), retired names, help topics, and `roster.toml`. If you are wiring validation into CI, inspect `skills/core-tools/bmad/scripts/validate_manifests.py` in the repository for its CLI arguments.
