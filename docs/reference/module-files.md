---
title: Module Files
description: 'The files that make a BMad module: bmod.toml, roster.toml, retired.toml, migration files, and help, with every key and rule.'
sidebar:
  order: 2
---

Use this page for the exact keys in a module's files. For what a module is and how to choose a registration, see [Modules and Registration](../toolsmith/modules.md). Smithy writes these files for you, and `validate_manifests.py` checks them.

## Where the Files Live

| File | Multi-skill module | Single-skill module |
| --- | --- | --- |
| `bmod.toml` with `[bmod]` | In the `bmod-<code>` record folder | In the skill's folder |
| `bmod.toml` with `[skill]` | In each member's folder | The same file, with `[skill]` empty |
| `help/help.md` | In the record folder | In the skill's folder |
| `SKILL.md` | The record has one that only redirects to `bmad setup <code>` | The skill's own |
| `roster.toml`, `retired.toml`, `migration-<n>.toml` | In the record folder | Beside `bmod.toml` |

`bmad` finds a module by its `[bmod]` table. Validation requires a multi-skill record folder to be named `bmod-<code>`, and a single-skill module's folder keeps the skill's name.

## `bmod.toml`

A file holds a `[bmod]` table, a `[skill]` table, or both.

### `[bmod]`

| Key | Required | Meaning |
| --- | --- | --- |
| `code` | Yes | Configuration namespace and the name in `bmad setup <code>`. Cannot be `_config`, `custom`, `modules`, or `scripts` |
| `version` | Yes | The module's version, compared with its source to offer updates |
| `update_source` | Yes | Where updates come from. Starts with `github:`, `https://`, `file:`, or `plugin:` |
| `skills` | Multi-skill | Every member skill |
| `required_skills` | No | Skills the module needs, see [Dependencies](#dependencies) |
| `recommended_skills` | No | Skills that help beside it. Setup reports them and does not insist |
| `pre_install_message` | For validation | Shown before an update, or before `bmad` installs the record itself |
| `post_install_message` | For validation | Shown after installing |

Setup accepts a record without the install messages, but `validate_manifests.py` requires both keys, empty if unused.

A `github:` source is `github:<owner>/<repo>/<path>`, where `<path>` is the folder holding the skill folders, such as `skills`. With no path, the repository root is the skill. Update checks read `bmod.toml` from the `main` branch.

### `[[bmod.config_questions]]`

Each entry is one question for `bmad setup <code>`, asked in file order.

| Key | Required | Meaning |
| --- | --- | --- |
| `key` | Yes | Dotted key, read as `modules.<code>.<key>`. Must not be the code or start with `<code>.` |
| `prompt` | Yes | The question text |
| `default` | Yes | The default answer, with `{project-root}` kept literal |
| `scope` | No | `team`, the default, or `user` for a personal answer that is not committed |

No other keys are allowed.

### `[[bmod.knowledge]]`

Optional. Lists extra help documents inside the record folder, with `path` and `skills`. `skills` is `"*"`, the default, or a list of skill names.

### `[skill]`

| Key | Required | Meaning |
| --- | --- | --- |
| `bmod` | In a member file | The record folder, such as `bmod-acme` |
| `source` | In a member file | Must equal the record's `update_source` |
| `required_skills` | No | What this skill alone requires |
| `recommended_skills` | No | What helps beside this skill |
| `scripts` | No | Paths written like `scripts/foo.py` that setup installs to `_bmad/<code>/scripts/` |

In a single-skill module, leave `[skill]` empty unless it declares `scripts`, because the record in the same file already names the module's one skill.

### Dependencies

A plain name is a skill from the same source. A table names a skill from elsewhere.

```toml
required_skills = [
  "acme-release-notes",
  { skill = "bmad", version = "6.13.0", source = "github:bmad-code-org/BMAD-METHOD/skills" },
]
```

`version` is optional. Module-wide needs go in `[bmod]`, including all of a single-skill module's needs. One member's needs go in its `[skill]` table.

### Examples

A record:

```toml
[bmod]
code = "acme"
version = "1.0.0"
update_source = "github:acme/skills/skills"
skills = ["acme-release-notes", "acme-agent-scout"]
required_skills = [{ skill = "bmad", version = "6.13.0", source = "github:bmad-code-org/BMAD-METHOD/skills" }]
pre_install_message = ""
post_install_message = ""

[[bmod.config_questions]]
key = "release_folder"
prompt = "Where should release notes go?"
default = "{project-root}/docs/releases"
```

A member:

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
required_skills = [{ skill = "bmad", version = "6.13.0", source = "github:bmad-code-org/BMAD-METHOD/skills" }]
pre_install_message = ""
post_install_message = ""

[skill]
```

## Reading Answers

A skill reads a setup answer with one call, listing every key it needs.

```bash
uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key modules.acme.release_folder
```

## `roster.toml`

Required when a member is an agent. It is how `bmad` and party mode know who is available. A member with `skill` is an agent, present only while that skill is installed. A member without `skill` is a guest who exists only in groups.

```toml
[[members]]
code = "acme-agent-scout"
skill = "acme-agent-scout"
name = "Scout"
icon = "🔭"
title = "Release Scout"
persona = "Two sentences on who this agent is."

[[groups]]
id = "release-team"
name = "Release Team"
scene = "A release readiness meeting."
members = ["acme-agent-scout"]
memory = false
```

## `retired.toml`

Lists skills the module no longer ships. `bmad setup` offers to delete any still installed, and moves a renamed skill's `_bmad/custom/` files to the new name. A retired name is never reused, and a name can appear only once.

```toml
renamed = [{ from = "acme-notes", to = "acme-release-notes" }]
removed = ["acme-old-check"]
```

## `migration-<n>.toml`

A module ships a migration beside its `bmod.toml`, and `bmad migrate` runs them in `<n>` order. The file has a `[migration]` table with `module`, `from`, `to`, `title`, `summary`, `detect`, `guide`, and a `checklist` array. A file missing any of these is not listed. The file holds the rules, and `bmad` follows them.

## Help Files

`help/help.md` covers the whole module and is read by the `bmad` skill. Every other `help/*.md` is a topic file, read only when `help.md` names it. See [Write the Help](../toolsmith/modules.md#write-the-help).

## Validate

In a repository with `skills/*/bmod.toml`:

```bash
uv run {project-root}/_bmad/scripts/validate_manifests.py --project-root <repo>
```

It covers manifests, membership, versions, retired names, help topics, and the roster.
