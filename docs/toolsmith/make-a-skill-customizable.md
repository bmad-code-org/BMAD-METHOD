---
title: 'Make a Skill Customizable'
description: 'Use customize.toml to let teams change a skill without forking it: decide what to expose, name it well, wire it into the skill, and test an override.'
sidebar:
  order: 8
---

Use a `customize.toml` file to let teams adapt your skill's behavior without forking it. A skill only you run needs none; add one when other people or teams will install and tailor it. This page is for skill authors. To tailor a skill someone else wrote, see [Customize BMad](../customize/customize-bmad.md).

Every setting you expose is a compatibility promise. Teams pin values to those keys and commit overrides, so later releases must keep honoring them. Expose only what genuinely varies between users.

## When to Use This

- Different teams need different output paths, templates, or standing rules
- Users would otherwise fork the skill to make a small local change
- Your skill should let a team run its own steps before or after activation

## When to Skip This

- Every user wants roughly the same value, so a sensible default is enough
- The skill is only for your personal use
- The setting would change the skill's core identity rather than something it consumes
- You are trying to customize a memory agent's persona or menu: a memory agent stores its persona and learned preferences in its memory folder, and only uses `customize.toml` for workspace folder access entries (`[[agent.dominion]]`). See [Agents with Memory](agents-with-memory.md).

:::note[Prerequisites]
- A skill built with Smithy, or a BMad skill of your own
- `bmad-customize` installed, so you can test an override
:::

## Steps

### 1. Decide What Earns a Setting

Test each candidate setting against three questions, and expose it only if all three answers are yes:

1. Does it genuinely vary across your users?
2. Is it an input the skill consumes (such as a template, standing fact, or output path) rather than part of what the skill fundamentally is?
3. Would hiding it force someone to fork the skill? If a single line in `persistent_facts` covers it, leave the dedicated key out.

### 2. Ask Smithy to Add It

Tell Smithy during discovery what teams will need to vary, or use [edit mode](modes.md#edit) on an existing skill. He writes `customize.toml` and wires each value into the skill.

A plain skill uses a `[workflow]` table, while a standard agent uses `[agent]` for its persona, menu, and activation steps, plus an optional `[workflow]` table beside it resolved in the same call. Persona fields creeping into `[workflow]` usually mean the skill should be an agent.

| Key | Use it for |
| --- | --- |
| `activation_steps_prepend`, `activation_steps_append` | Steps a team runs before or after activation |
| `persistent_facts` | Standing facts or `file:` globs to load for the run |
| `on_complete` | A hook to run when the skill finishes |
| `<purpose>_output_path` | Where a generated file lands |
| `run_folder_pattern` | How run folders are named |
| Your own settings | Anything else a team must vary, such as a template path |

### 3. Name Each Setting Clearly

Most users change overrides through a conversation with `bmad-customize`, so key names should read cleanly aloud. `release_notes_template` is clear, while `tmpl_override` is cryptic. Add a short comment above each key explaining when to override it.

```toml
[workflow]
# Override to send the notes to your team's release folder.
release_notes_output_path = "{project-root}/docs/releases"

# Override to use your own template.
release_notes_template = "assets/release-notes-template.md"
```

### 4. Set Defaults That Work

The skill must run cleanly with zero overrides. Avoid boolean feature toggles, because a switch usually means the author deferred a design choice; expose the concrete value the skill consumes instead.

### 5. Read Every Value in the Skill

The skill resolves its tables on activation, then references each resolved value as `{workflow.<key>}` or `{agent.<key>}`.

```bash
uv run "{project-root}/_bmad/scripts/resolve_customization.py" --skill "{skill-root}" --project-root "{project-root}" --key workflow
```

Declaring a key in `customize.toml` while hardcoding the value in `SKILL.md` is a defect because overrides will silently do nothing. Smithy's review checks for dead keys.

A skill never writes its own override files, never parses or merges TOML by hand, and never maintains a fallback code path for when BMad is absent. The single deliberate exception is a memory agent recording owner-chosen workspace folders (`[[agent.dominion]]`) into its own override file during first-run setup. Everywhere else, `resolve_customization.py` reads overrides and `bmad-customize` writes them; when a skill mentions a configurable setting, it simply tells the user to invoke `bmad-customize` and names the key.

### 6. Test an Override

Invoke `bmad-customize` and override one setting. It writes `_bmad/custom/<skill>.toml` for a team override or `_bmad/custom/<skill>.user.toml` for a personal one. Run your skill and confirm the override took effect; see [Configuration and Customization Reference](../reference/configuration.md) for resolver inspection commands that show the final merged values.

## What You Get

- A `customize.toml` beside `SKILL.md` holding working defaults and author comments
- Team and personal overrides stored under `_bmad/custom/` so they survive skill updates
- Predictable merge behavior on activation: scalars replace, arrays append, and arrays of tables merge by `code` or `id`

## Tips

- Give every entry in an array of tables a `code` or `id` field so overrides can replace an item in place rather than only appending.
- Put project-wide values such as the output folder in core config and read them with `resolve_config.py`.
- For standard agents, `name` and `title` are fixed; a team that wants a different agent name or role builds a new agent.
