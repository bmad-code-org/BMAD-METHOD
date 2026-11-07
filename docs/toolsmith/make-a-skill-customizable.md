---
title: 'Make a Skill Customizable'
description: 'Use customize.toml to let teams change a skill without forking it: decide what to expose, name it well, wire it into the skill, and test an override.'
sidebar:
  order: 8
---

Use a `customize.toml` to let a team change your skill's behavior without forking it. This page is for authors. To change a skill someone else wrote, see [Customize BMad](../customize/customize-bmad.md).

Every value you expose is a promise. Teams will pin values to it and commit overrides, and later releases must respect it. Expose what really varies between your users, and nothing else.

## When to Use This

- Different teams need different output paths, templates, or rules
- Users would otherwise fork the skill for a small change
- Your skill should run a team's own steps before or after it works

## When to Skip This

- Every user wants roughly the same value. Pick a good default.
- The skill is for you alone.
- The value is the skill's identity, not something it consumes.
- It is a memory agent. Its sanctum is already the place to shape it. See [Agents with Memory](agents-with-memory.md).

:::note[Prerequisites]
- A skill built with Smithy, or a BMad skill of your own
- `bmad-customize` installed, to test an override
:::

## Steps

### 1. Decide What Earns a Setting

Ask three questions of each candidate. Expose it only if it passes all three.

1. Does it really vary across your users?
2. Is it something the skill consumes, such as a template, a fact, or an output path, and not part of what the skill is?
3. Would hiding it force a fork? If one sentence in `persistent_facts` would do, leave it out.

### 2. Ask Smithy to Add It

Tell Smithy during discovery what teams will change, or use [edit mode](modes.md#edit) on a skill you already have. Smithy writes the `customize.toml` and connects each value to the skill.

A skill uses a `[workflow]` table and an agent uses `[agent]`. Do not mix them. Persona fields in `[workflow]` suggest the skill should be an agent.

| Key | Use it for |
| --- | --- |
| `activation_steps_prepend`, `activation_steps_append` | Steps a team runs before or after activation |
| `persistent_facts` | Standing facts or `file:` globs to load for the run |
| `on_complete` | A hook to run when the skill finishes |
| `<purpose>_output_path` | Where an output lands |
| `run_folder_pattern` | How run folders are named |
| Your own settings | Anything else a team must vary, such as a template path |

### 3. Name Each Setting Clearly

Most users change settings through a conversation with `bmad-customize`, so names should read well aloud. `release_notes_template` works, and `tmpl_override` does not. Comment each one with when to override it.

```toml
[workflow]
# Override to send the notes to your team's release folder.
release_notes_output_path = "{project-root}/docs/releases"

# Override to use your own template.
release_notes_template = "assets/release-notes-template.md"
```

### 4. Set Defaults That Work

The skill must work with no override. Avoid boolean toggles, because a switch usually means the author never decided. Offer a value the skill consumes.

### 5. Read Every Value in the Skill

The skill resolves its table on activation, then reads each value as `{workflow.<key>}` or `{agent.<key>}`.

```bash
uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --project-root {project-root} --key workflow
```

A value that is declared but hardcoded in the body is a defect, because every override of it does nothing. Smithy's review flags this.

A skill never writes its own overrides, never merges TOML itself, and never carries a second code path for when BMad is absent. `resolve_customization.py` reads, and `bmad-customize` writes. Where users will change a value, the skill says so in one line: invoke `bmad-customize`, naming the key.

### 6. Test an Override

Run `bmad-customize` and change one value. It writes `_bmad/custom/<skill>.toml` for a team or `_bmad/custom/<skill>.user.toml` for one person. Run the skill and confirm the change took effect. [Check what resolved](../customize/customize-bmad.md#check-what-resolved) shows the merged values.

## What You Get

- A `customize.toml` beside `SKILL.md`, holding your defaults and comments
- Overrides that survive updates, because they live in the project and not in the skill
- Layers that merge when the skill activates: scalars override, arrays append, and arrays of tables merge by `code` or `id`

## Tips

- Give each item in an array of tables a `code` or an `id`, or the resolver can only append it.
- Keep project-wide values, such as the output folder, in core config. Read them with `resolve_config.py`.
- For an agent, `name` and `title` are fixed. A team that wants a new name or title creates a new agent.
- When teams differ in which steps run, a [rendered skill](shapes.md#rendered-skill) may fit better.
