---
title: Configuration and Customization Reference
description: How BMad layers team and personal configuration files, how overrides merge, and how to tailor skills through the BMad Agent or bmad-customize.
sidebar:
  order: 7
---

BMad keeps your settings and customizations separate from installed skill files so updates never overwrite your changes. You do not need to memorize file paths or edit TOML by hand to use this system.

## Start by Asking in Plain English

The easiest way to configure or customize anything in BMad is to describe what you want in chat. You can talk directly to `bmad-customize`, or ask the BMad Agent (`bmad`), which knows how to route your request to `bmad setup` or `bmad-customize` and apply the change for you.

```text
Hey BMad, customize the build skill to always check our API compatibility rules when modifying endpoints, and ensure we are always in thorough review mode.
```

```text
/bmad-customize Add a Security Sign-off section to every PRD for the whole team, and set my personal writing voice guide at ~/.bmad/voice-bible.md just for me.
```

If you want to know what can be tailored on a specific agent or skill, ask `"Hey BMad, what can I customize on Winston?"` or ask `bmad-customize` directly. Both read the installed skill's own options rather than guessing, show you the proposed change before writing, and verify that your override applies cleanly.

## Central Configuration Files

Project-wide setup answers and shared overrides live in three TOML files under `_bmad/`, where higher-priority files win when the same key appears in more than one place:

```text
Priority 1 (wins): _bmad/custom/config.user.toml   (personal overrides, gitignored)
Priority 2:        _bmad/custom/config.toml        (team overrides, committed)
Priority 3 (base): _bmad/config.toml               (setup-owned defaults, committed)
```

Running `bmad setup` writes team-scope answers to `_bmad/config.toml` and personal answers (such as your active initiative) to `_bmad/custom/config.user.toml`. Setup fills in missing keys and migrates renamed skill files on upgrades, while leaving anything you set under `_bmad/custom/` untouched.

| Setting | Scope | What it controls |
| --- | --- | --- |
| `core.output_folder` | Team | Root folder holding initiatives, standalone epics, `backlog/`, and run folders (defaults to `_bmad-output`) |
| `core.active_initiative` | Personal | Active initiative, standalone epic, or child initiative under a program |
| `modules.core-tools.design_system` | Team | Optional path to your brand guide, `DESIGN.md`, CSS tokens, or design-system folder used when rendering facilitated HTML pages |
| `modules.founder.record_folder` | Team | Folder holding Nadia's business record (defaults to `company/`) |
| `modules.creative.record_folder` | Team | Folder holding Clio's creative record (defaults to `creative/`) |
| `modules.creative.voice_guide` | Personal | Personal writing or speaking voice guide path (for example, `~/.bmad/voice-bible.md`) |

Custom modules you install add their own setup questions under `modules.<code>.<key>`; see [Module Files](./module-files.md).

## Per-Skill Override Files

Every customizable skill ships a `customize.toml` inside its installed directory defining its defaults. Never edit installed skill files, because updates overwrite them. Instead, sparse override files sit under `_bmad/custom/` using the exact skill name:

```text
Priority 1 (wins): _bmad/custom/<skill>.user.toml   (personal overrides, gitignored)
Priority 2:        _bmad/custom/<skill>.toml        (team overrides, committed)
Priority 3 (base): <skill-dir>/customize.toml       (shipped defaults)
```

:::caution[Keep Override Files Sparse]
Only include the settings you intentionally change. Copying an entire `customize.toml` into `_bmad/custom/` locks in old defaults and prevents future skill improvements from taking effect.
:::

## How Overrides Merge

When BMad loads your configuration or a skill's overrides, each value shape merges predictably:

| Value shape | Merge behavior |
| --- | --- |
| Scalar (text, number, boolean) | Higher-priority layer replaces lower-priority layer |
| Table (`[section]`) | Merges recursively key by key |
| Keyed array of tables (items sharing a `code` or `id` key) | Matching keys replace in place; new keys append |
| Any other list | Appends in order: base defaults, then team overrides, then personal overrides |

Two boundaries apply to every override:

- An override file cannot delete an item from a base list. To silence a keyed shortcut, override it by `code` with a no-op instruction, or build a separate skill with [Toolsmith](../toolsmith/toolsmith.md) if you want deeper structural changes.
- An agent's name and title stay fixed so calling an agent by name remains predictable; creating a brand-new named persona belongs in a custom agent skill or a custom [party mode](../customize/run-multi-agent-discussions.md) cast.

## What Agents and Workflows Share

Across all named agents, overrides under `[agent]` let you adjust focus, communication style, standing principles, persistent facts or reference files loaded on every session, startup steps before or after greeting, and optional custom shortcuts. Across workflow skills, overrides under `[workflow]` let you attach standing context, startup steps, and completion hooks alongside whatever options that individual skill exposes.

Rather than maintaining a static catalog of every skill's options here, every skill defines its own customizable settings right beside its prompt. For example, you might ask the BMad Agent to set `bmad-build` to thorough review mode for your team, tell Sofia (`bmad-agent-po`) to publish stories to Jira only when work starts, configure `bmad-facilitate` to save documents in your team's preferred mode and style, or save a custom focus group in `bmad-party-mode`. Whenever you reference a local file inside a custom instruction, write the path from `{project-root}` so it works from any subdirectory.

## Inspecting or Automating Further

`bmad-customize` automatically validates merged overrides whenever it writes a file, and you can always ask the BMad Agent what configuration is currently active in your project. If you are building CI automation or want to inspect the underlying resolution and rendering scripts directly, see the scripts under `_bmad/scripts/` in your project or in the BMAD-METHOD repository.
