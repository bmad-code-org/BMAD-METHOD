---
title: 'Migrate an Old Module'
description: 'Convert a module written for the module.yaml format into a bmod with Smithy.'
sidebar:
  order: 12
---

Use Smithy's migrate mode to convert an old-format module into the current format, in place. A module built before the bmod format carries a setup skill, a `module.yaml`, and a `module-help.csv`, and it does not work with `bmad setup`.

## When to Use This

- Your module has a `<code>-setup` skill, or a `module-setup.md` in a skill's assets
- It carries `module.yaml` and `module-help.csv`
- It writes to `_bmad/config.yaml` or `_bmad/module-help.csv`
- Smithy's validate mode reported it as an old-format module

:::note[Prerequisites]
- The module's source, under version control
- Toolsmith installed
- The module pushed to a Git repository, so you can give its `update_source`
:::

## Steps

### 1. Start the Migration

Ask Smithy to migrate the module, and point at the folder holding its skills and setup skill. For a one-skill module, point at the skill's own folder. Smithy scans the module and asks only for the `update_source`.

### 2. Read the Execution Plan

Smithy shows the whole execution plan as tables and waits for your yes. Nothing changes before that.

| Old | New |
| --- | --- |
| The setup skill and merge scripts | Deleted, with the setup skill listed as removed in `retired.toml` |
| `module.yaml` | `bmod-<code>/bmod.toml`, with one question per config key |
| Agents | `roster.toml` |
| `module-help.csv` | `help/help.md`, with a topic file for a skill that has many rows |
| Each skill | A `bmod.toml` with a `[skill]` table |
| A folder with one skill | A single-skill module, with no `bmod-<code>` folder |

Every config read in the skills changes to use `resolve_config.py`:

- `output_folder` becomes `core.output_folder`.
- A module key becomes `modules.<code>.<key>`. A key that repeats the code must be renamed.
- Reads of `user_name`, `communication_language`, and `document_output_language` are removed, because the current format has no such keys.
- Fallbacks to the old per-module file are removed.

The execution plan also lists what cannot convert:

| Old feature | What happens |
| --- | --- |
| Select questions | Become one string, with the options in the prompt, or are dropped |
| Validation, directories, and post-install notes | Have no equivalent, so the skill handles them or they go |
| Headless and inline-argument setup | Removed, because `bmad setup` has neither |
| Answers in `_bmad/config.yaml` | Not carried over, so `bmad setup <code>` asks again |

### 3. Approve

Smithy writes the new files, rewrites each config read, and removes each skill's step that ran the setup skill. It then deletes the listed files and nothing else.

### 4. Review the Checks

Smithy runs the validators on the result and fixes what they find, then finishes with its ship step.

### 5. Run Setup

Ask `bmad` to run `bmad setup <code>`. Answer the questions again, because old answers are not carried over.

## What You Get

- A module that `bmad` can set up, recommend, and update
- Skills that read their configuration through `resolve_config.py`
- A list of what could not convert, so you can decide how to handle it

## Tips

- Commit before you start, so you can read the whole change as a diff.
- Update your README to replace any old install steps with `npx skills add`. See [Distribute Your Module](distribute-your-module.md).
- Check `.claude-plugin/marketplace.json` if your repository has one. The current install path does not need it.
