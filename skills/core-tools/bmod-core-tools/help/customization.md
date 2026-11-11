# How customization works

Open this when the user asks where an override goes, how it merges, why it is not applied, or how to change central config. To change one skill or agent, recommend `bmad-customize`. For team-wide rules see `help/team-adoption.md`.

## The layers for one skill

A skill is customizable only if its folder holds a `customize.toml`, which lists every field that can change. Updates overwrite it, so nobody edits it. Overrides live in `{project-root}/_bmad/custom/`, named after the skill folder.

| Priority | File | For | Committed |
|---|---|---|---|
| 1 (wins) | `<skill>.user.toml` | One person: tone, private facts | No |
| 2 | `<skill>.toml` | The team: policy, conventions | Yes |
| 3 | the skill's `customize.toml` | Shipped defaults | With the skill |

`bmad setup` writes `_bmad/custom/.gitignore` with `*.user.toml` when none exists.

## Merge rules

The value's shape decides the merge. The field name does not.

| Shape | Rule |
|---|---|
| Scalar | The override wins. |
| Table | Merged key by key, by these same rules. |
| Array of tables where every item has `code`, or every item has `id` | A matching key replaces that item. A new key appends. |
| Any other array | Appended: shipped, then team, then user. |

## Limits

- An override cannot remove a shipped item. Replace a keyed item with one that does nothing.
- It cannot change step logic or any field `customize.toml` does not list. Never invent a field. Offer `activation_steps_prepend`, `activation_steps_append` or `persistent_facts` instead, or a feature request.
- On an agent skill, `agent.name` and `agent.title` are metadata. Overriding them does nothing.
- Write only the changed fields. A full copy of `customize.toml` blocks later shipped defaults.

## Agent or workflow

The top table in `customize.toml` is `[agent]` or `[workflow]`. Override fields go under the same table. A rule for every workflow an agent runs goes on the agent skill: persona, style, principles, facts, menu. A rule for one workflow goes on that workflow skill: templates, output paths, `on_complete`, step hooks.

## Central config

It holds `[core]` values such as `output_folder`, module answers under `[modules.<code>]`, and optional `[agents.<code>]` tables that add an agent of the user's own or add details such as `team` to an installed one. An installed agent's name, title, and icon come from its own skill and its override file, not from here. Three files merge by the same rules, highest first:

1. `_bmad/custom/config.user.toml`: personal. `bmad setup` writes user answers here. Not committed.
2. `_bmad/custom/config.toml`: team pins. Written by hand only. Committed.
3. `_bmad/config.toml`: created by `bmad setup`, which writes team answers here.

All three may be hand-edited. `bmad setup` never changes an existing value, so to change an answer, edit its key in the file `bmad setup` reports for it. `bmad-customize` does not write central config: help the user edit the TOML.

## Check the merged result

`bmad-customize` shows the merged result after it writes. `_bmad/scripts/resolve_customization.py` (one skill) and `resolve_config.py` (central config) print the merged values as JSON. If a script is missing, recommend `bmad setup`.

## An override is not applied

1. The file is in `_bmad/custom/` and named exactly after the skill folder.
2. The TOML parses. The resolver errors and names a broken file.
3. Fields sit under `[agent]` or `[workflow]` and exist in `customize.toml`.
4. The shape matches, and a replaced item uses the same `code` or `id`.
5. No user file overrides the team value.
6. `uv` runs. Without the resolver, many skills use shipped defaults.

## Reset

Delete the override file, or the one field. The skill uses shipped defaults on its next run.
