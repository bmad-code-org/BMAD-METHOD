---
title: 'Migrate an Old Module'
description: 'Convert a module written for the module.yaml format into a bmod with Smithy.'
sidebar:
  order: 12
---

Use Smithy's migrate mode to convert an older `module.yaml` module into the current `bmod` format in place. Modules built before the `bmod` format rely on a dedicated setup skill, `module.yaml`, and `module-help.csv`, which do not work with `bmad setup`.

## When to Use This

- Your module ships a `<code>-setup` skill, or a `module-setup.md` inside a skill's assets
- It carries `module.yaml` and `module-help.csv`
- It writes to `_bmad/config.yaml` or `_bmad/module-help.csv`, or its skills read `_bmad/<code>/config.yaml`
- Smithy's validate mode flagged it as an old-format module

:::note[Prerequisites]
- The module's source under version control
- Toolsmith installed
- The module pushed to a Git repository so you can provide its `update_source`
:::

## Steps

### 1. Start the Migration

Ask Smithy to migrate the module and point him at the folder holding its skills and setup skill (or, for a one-skill module, the skill's own folder). Smithy scans the module and asks only for its `update_source`.

### 2. Read the Execution Plan

Smithy presents the complete migration plan as tables and waits for your approval before touching any files.

| Old | New |
| --- | --- |
| The setup skill, merge scripts, and any `bmad-manifest.json` | Deleted, with the setup skill recorded under `removed` in `retired.toml` |
| `module.yaml` | `bmod-<code>/bmod.toml`, with one `[[bmod.config_questions]]` entry per config key and `greeting` moved to `post_install_message` |
| Agents | `roster.toml` |
| `module-help.csv` | `help/help.md`, plus a topic file for any skill with many rows |
| Each skill | A `bmod.toml` with a `[skill]` table |
| A folder with one skill | A single-skill module, with no separate `bmod-<code>` folder |

Skill instructions convert at the same time. The execution plan maps each old config read and placeholder (such as `{planning_artifacts}` or `{communication_language}`) to its current equivalent. Each skill reads every key it needs in one `resolve_config.py` call at activation, keeping placeholders for keys that still exist (such as `{output_folder}`):

- `output_folder` becomes `core.output_folder`.
- `planning_artifacts` and `implementation_artifacts` become the active initiative folder, `{output_folder}/{active_initiative}`, with documents written under `<type>-<slug>/<type>-<slug>.md`.
- `project_knowledge` has no built-in key; Smithy asks whether the module needs its own setup question for it or should name the project's docs folder directly.
- `user_name`, `communication_language`, `document_output_language`, and `user_skill_level` have no built-in keys; their reads are removed and sentences relying on them are rewritten without placeholders.
- Module-specific keys become `modules.<code>.<key>`, renaming any key that repeats the module code.
- Fallbacks to the old per-module config file are removed.

The execution plan also lists anything from the old format that cannot convert automatically:

| Old feature | What happens |
| --- | --- |
| Select-list setup questions | Converted to a free-text string question listing the options in the prompt, or dropped |
| Old `greeting` text | Migrates to `post_install_message` in `bmod.toml` |
| Per-key validation rules, auto-created directories, and free-form post-install checklist notes | Have no automated equivalent in `bmad setup`, so move short reminders into `post_install_message`, let the skill handle checks on first run, or drop them |
| Headless and inline-argument setup | Removed, because `bmad setup` has neither |
| Saved answers in `_bmad/config.yaml` | Not carried over, so `bmad setup <code>` asks the module's questions again |

### 3. Approve

Once you approve, Smithy writes the new `bmod` files, updates every config read and placeholder, and removes old setup-skill steps from each member skill. Whenever a member's output path changes, he updates every sibling skill that reads that path. He records cross-module dependencies, replaces retired skill names with their successors, and deletes only the listed legacy files.

### 4. Review the Checks

Smithy runs validation over the migrated module, fixes any failures, and finishes with his standard hand-off checks.

### 5. Run Setup

Ask `bmad` to run `bmad setup <code>` and answer the module's questions again, since legacy `_bmad/config.yaml` answers are not carried over.

## What You Get

- A `bmod` module that `bmad` can set up, recommend in help, and check for updates
- Member skills that read configuration cleanly through `resolve_config.py`
- An explicit list of anything that did not convert automatically so you can decide how to handle it

## Tips

- Commit your working tree before starting so you can review the entire migration as a clean Git diff.
- Update your README to replace older install instructions with `npx skills add`; see [Distribute Your Module](distribute-your-module.md).
- Remove `.claude-plugin/marketplace.json` if it is no longer needed, since the current install path works directly from your Git repository.
