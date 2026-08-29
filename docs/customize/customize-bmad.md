---
title: 'Customize BMad'
description: Change how an installed agent or workflow behaves — with bmad-customize or by hand — and know what is customizable, where an override lands, and how it merges.
sidebar:
  order: 1
---

You want an agent to remember your organization's rules, a workflow to
publish its output somewhere, a menu item that runs your own skill, or a
different name on the roster. Each of these is an override file next to
BMad's installed defaults. Updates do not touch your files, and you do not
edit installed files.

## Start with the guided path

Run the `bmad-customize` skill and say what you want changed. It scans your
installation for what is customizable, picks the right surface for your
intent (an agent or a workflow), writes the override file, and verifies
that the merged result contains your change. Use it for any per-skill
change. The rest of this page describes what each surface exposes and how
the pieces combine.

There are two surfaces:

| Surface | File | Shapes |
|---|---|---|
| Per-skill override | `_bmad/custom/<skill>.toml` | How one agent or workflow behaves when it activates: persona, facts, hooks, menu, workflow fields |
| Central configuration | `_bmad/custom/config.toml` | Install answers and the agent roster that other skills read |

`bmad-customize` writes per-skill overrides only. Central configuration is
hand-authored; see [Central configuration](#central-configuration).

For ready-made team recipes (an agent-wide rule, publishing to Confluence,
swapping a template, a rebranded roster), see
[Adopt BMad Across a Team](./adopt-bmad-across-a-team.md).

## What an agent is made of

Every named agent has two parts. Name, title, and domain are fixed:
"hey Mary" always activates the analyst. Everything else is customizable:
role, identity statement, communication style, principles, icon, menu,
persistent facts, and activation hooks. The shipped agents are listed in
[Agents](../reference/agents.md).

The per-skill file controls how the agent behaves when it activates.
Central configuration controls how `bmad-party-mode`, `bmad-retrospective`,
and `bmad-advanced-elicitation` introduce the agent. Rewriting Mary's
principles is per-skill; changing the one-line description a party uses
to introduce her is central.

:::note[Prerequisites]

- BMad installed in your project (see [Install BMad](../start/install-bmad.md)).
- [`uv`](https://docs.astral.sh/uv/) on your PATH. BMad runs the resolver with `uv run`, which provisions Python for you; there is nothing to `pip install`.
:::

## How overrides merge

Every customizable skill ships a `customize.toml` in its installed folder.
That file is the schema: read it to see what is customizable. Never edit
it; updates overwrite it. Instead, create sparse override files that
contain only the fields you change.

**Three layers.** The resolver reads three files and the highest wins:

```text
Priority 1 (wins): _bmad/custom/<skill>.user.toml   (personal, gitignored)
Priority 2:        _bmad/custom/<skill>.toml        (team, committed)
Priority 3 (base): the skill's own customize.toml   (shipped defaults)
```

`_bmad/custom/` starts empty. Files appear only when someone customizes.

**Four rules, by shape.** The resolver does not treat fields differently by
name; the merge depends only on the value's shape:

| Shape | Rule |
|---|---|
| Scalar (string, int, bool, float) | Override wins |
| Table | Deep merge — apply these rules recursively |
| Array of tables where every item has `code`, or every item has `id` | Merge by that key: matching keys replace in place, new keys append |
| Any other array (scalars, tables with no key, arrays mixing `code` and `id`) | Append — base items, then team, then user |

**No removal.** An override cannot delete a base item. To suppress a
default menu item, override it by `code` with a description or prompt that
does nothing; to restructure an array further, fork the skill. If you
author your own array of tables, use `code` on every item or `id` on every
item — mixing them falls back to append.

**Read-only fields.** `agent.name` and `agent.title` sit in
`customize.toml` as metadata, but the agent never reads them at runtime.
`name = "Bob"` in an override does nothing. For a differently named agent,
copy the skill folder, rename it, and ship it as a custom skill.

:::caution[Do not copy the whole `customize.toml`]
Every field you omit is inherited from the layer below. A full copy locks
in today's defaults, so the next update ships new values that your
override silently shadows.
:::

## Customize an agent

**Find the surface.** The schema is the skill's installed `customize.toml`:

```text
.claude/skills/bmad-agent-pm/customize.toml
```

The path varies by IDE — Cursor uses `.cursor/skills/`, Cline
`.cline/skills/`, and so on. Fields live directly under `[agent]`.

**Scalars.** Create `_bmad/custom/` in your project root if it does not
exist, then add `<skill>.toml` with only the fields you change. `icon`, `role`, `identity`, and `communication_style` are scalars,
so the override wins:

```toml
# _bmad/custom/bmad-agent-pm.toml

[agent]
icon = "🏥"
role = "Drives product discovery for a regulated healthcare domain."
communication_style = "Precise, regulatory-aware, asks compliance-shaped questions early."
```

**Facts, principles, and hooks.** These four arrays append: shipped items
first, then team, then user. `persistent_facts` are static context the
agent keeps in mind all session; an entry is a literal sentence or a
`file:` reference (globs allowed) whose contents are loaded as facts.

```toml
[agent]
persistent_facts = [
  "Our org is AWS-only -- do not propose GCP or Azure.",
  "file:{project-root}/docs/compliance/hipaa-overview.md",
]

principles = [
  "Ship nothing that can't pass an FDA audit.",
]

# Runs before the greeting.
activation_steps_prepend = [
  "Scan {project-root}/docs/compliance/ and load any HIPAA-related documents as context.",
]

# Runs after the greeting, before the menu.
activation_steps_append = [
  "Read {project-root}/_bmad/custom/company-glossary.md if it exists.",
]
```

Prepend runs before the greeting, when the greeting itself needs that
context. Append runs after, for setup the user should not wait on.

**Menu.** `[[agent.menu]]` is an array of tables keyed by `code`, so a
matching code replaces the shipped item and a new code appends. Each item
has exactly one of `skill` or `prompt`:

```toml
# Replace the shipped CE item with your own skill
[[agent.menu]]
code = "CE"
description = "Create Epics using our delivery framework"
skill = "custom-create-epics"

# Add a new item
[[agent.menu]]
code = "RC"
description = "Run compliance pre-check"
prompt = """
Read {project-root}/_bmad/custom/compliance-checklist.md
and scan all documents in {planning_artifacts} against it.
"""
```

When any field points at a file, spell out the full path from
`{project-root}`, even for a file sitting next to your override in
`_bmad/custom/`. The agent resolves `{project-root}` at runtime.

**Team or personal.** The team file (`bmad-agent-pm.toml`) is committed
and shared: compliance rules, company persona, custom menu items. The
personal file (`bmad-agent-pm.user.toml`) is gitignored: tone, private
preferences, facts only you want the agent to hold.

```toml
# _bmad/custom/bmad-agent-pm.user.toml

[agent]
persistent_facts = [
  "Always include a rough complexity estimate (low/medium/high) when presenting options.",
]
```

## Customize a workflow

Workflows — skills that drive a multi-step process, such as
`bmad-product-brief` — use the same files and rules. Their surface lives
under `[workflow]`. The baseline fields every customizable workflow
exposes are the same hooks and facts as agents plus `on_complete`. For
workflows, a `persistent_facts` entry is a literal sentence, a `file:`
path or glob, or a `skill:` reference to a skill that holds relevant
knowledge. `on_complete` is a string, or an array of instructions run in
order, that runs once the workflow finishes its main output:

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]
activation_steps_prepend = [
  "Load {project-root}/docs/product/north-star-principles.md as context.",
]

persistent_facts = [
  "All briefs must include an explicit regulatory-risk section.",
  "file:{project-root}/docs/compliance/product-brief-checklist.md",
]

on_complete = "Summarize the brief in three bullets and offer to email it via the gws-gmail-send skill."
```

Individual workflows add fields on top — output paths, templates, toggles —
and each follows the shape rules above. `bmad-code-review` ships
`[[workflow.review_layers]]`, keyed by `id`. This override disables one
shipped layer and adds another; the skill skips a layer whose
`instruction` is empty, so nothing is deleted. See
[Review a Change](../build/review-a-change.md) for empty `instruction`,
`when`, and a new `id`.

```toml
# _bmad/custom/bmad-code-review.toml
[[workflow.review_layers]]
id = "blind-hunter"
instruction = ""

[[workflow.review_layers]]
id = "security-bot"
name = "Security bot"
instruction = """
Run the team reviewer via bash on {diff_file} and return its findings as a Markdown list.
"""
```

Read a workflow's `customize.toml` to see the fields it exposes. If the
field you need is not there, use `activation_steps_*` and
`persistent_facts`, or open an issue asking for a customization point.

**Activation order.** A customizable workflow activates in a fixed
sequence, so you know when each hook fires:

1. Resolve the `[workflow]` block (base, then team, then user).
2. Run `activation_steps_prepend`.
3. Load `persistent_facts` as context for the run.
4. Load config and resolve standard variables (project name, languages, paths, date).
5. Greet the user.
6. Run `activation_steps_append`.

The workflow body begins after step 6.

## Central configuration

Per-skill files cover one agent or workflow. Install answers and the agent
roster live in four TOML files:

```text
_bmad/config.toml               (installer-owned)  team scope: install answers + agent roster
_bmad/config.user.toml          (installer-owned)  user scope: user_name, language, skill level
_bmad/custom/config.toml        (human-authored)   team overrides (committed)
_bmad/custom/config.user.toml   (human-authored)   personal overrides (gitignored)
```

**Four layers**, merged with the same shape rules:

```text
Priority 1 (wins): _bmad/custom/config.user.toml
Priority 2:        _bmad/custom/config.toml
Priority 3:        _bmad/config.user.toml
Priority 4 (base): _bmad/config.toml
```

**What lives where.** The installer splits its answers by the `scope:`
declared on each prompt in a module's `module.yaml`: `[core]` and
`[modules.<code>]` answers with scope `team` land in `_bmad/config.toml`,
scope `user` in `_bmad/config.user.toml`. `[agents.<code>]` holds each
agent's descriptor — code, name, title, icon, description, team — taken
from the module's `agents:` block, always team-scoped.

**Editing rules.** The two installer-owned files are regenerated on every
install; treat them as read-only output. To change an install answer so it
survives reinstall, re-run the installer (it remembers prior answers) or
override the value in `_bmad/custom/config.toml`. The two `_bmad/custom/`
files are never touched by the installer; they are the place for custom
agents, descriptor overrides, and any value you want pinned regardless of
install answers.

**Rebrand an agent.** Party mode and other roster skills pick up the new
description automatically:

```toml
# _bmad/custom/config.toml

[agents.bmad-agent-pm]
description = "Healthcare PM — regulatory-aware, stakeholder-driven, FDA-shaped questions first."
icon = "🏥"
```

**Add a fictional agent.** No skill folder is needed; the descriptor alone
lets a party include Kirk, and the `team` field filters who gets invited.
See [Run Multi-Agent Discussions](./run-multi-agent-discussions.md).

```toml
# _bmad/custom/config.user.toml

[agents.kirk]
team = "startrek"
name = "Captain James T. Kirk"
title = "Starship Captain"
icon = "🖖"
description = "Bold, rule-bending commander. Speaks in dramatic pauses."
```

**Override a module install setting.** The override wins over whatever
each developer answered at install:

```toml
# _bmad/custom/config.toml

[modules.bmm]
planning_artifacts = "/shared/org-planning-artifacts"
```

**Which surface to use:**

| Need | Use |
|---|---|
| Add MCP tool calls to every dev workflow | Per-skill: `_bmad/custom/bmad-agent-dev.toml` `persistent_facts` |
| Add a menu item to an agent | Per-skill: `_bmad/custom/bmad-agent-<role>.toml` `[[agent.menu]]` |
| Swap a workflow's output template | Per-skill: `_bmad/custom/<workflow>.toml` scalar override |
| Rebrand an agent's public descriptor | Central: `_bmad/custom/config.toml` `[agents.<code>]` |
| Add a custom or fictional agent to the roster | Central: `_bmad/custom/config.*.toml` new `[agents.<code>]` |
| Pin team-enforced install settings | Central: `_bmad/custom/config.toml` `[modules.<code>]` or `[core]` |

## Check what resolved

On activation, a shared Python script merges the files and returns the
result as JSON. Run it yourself to see exactly what an agent or workflow
will use:

```bash
# Resolve the full agent block
uv run {project-root}/_bmad/scripts/resolve_customization.py \
  --skill /abs/path/to/bmad-agent-pm \
  --key agent

# Resolve a single field
uv run {project-root}/_bmad/scripts/resolve_customization.py \
  --skill /abs/path/to/bmad-agent-pm \
  --key agent.icon

# Full dump: omit --key
```

Replace `{project-root}` with your project root; the skill resolves it
for you at activation, but a shell will not.

`--skill` points at the skill's installed directory; the script derives
the skill name from that folder and finds the matching `_bmad/custom/`
files itself. Output is always JSON.

Use `uv run` so the script gets Python 3.11 or later. If you run it with
`python3` instead, check the version: 3.10 and earlier lack `tomllib`.
If the script cannot run, an agent reads the three TOML files and applies
the same rules; many workflows fall back to shipped defaults, so keep `uv`
working if you rely on workflow overrides.

## Troubleshooting

**Customization not appearing.** Check that the file is in `_bmad/custom/`
and named exactly after the skill directory. Check TOML syntax: strings
quoted, `[section]` for tables, `[[section]]` for arrays of tables, and a
table's scalar or array keys placed before any of its `[[subtables]]`. For
agents, fields belong under `[agent]`. Remember that `agent.name` and
`agent.title` are read-only.

**An update broke it.** You probably copied the full `customize.toml`.
Trim the override back to only the fields you changed.

**See what is customizable.** Run `bmad-customize`, which lists every
customizable skill and which already have overrides, or read the skill's
`customize.toml` directly.

**Reset.** Delete the override file from `_bmad/custom/`. The skill falls
back to its shipped defaults.
