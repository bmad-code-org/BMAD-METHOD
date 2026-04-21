---
title: 'How to Customize BMad'
description: Customize agents and workflows while preserving update compatibility
sidebar:
  order: 8
---

Tailor agent personas, inject domain context, add capabilities, and configure workflow behavior -- all without modifying installed files. Your customizations survive every update.

## When to Use This

- You want to change an agent's personality or communication style
- You need to give an agent persistent facts to recall (e.g. "our org is AWS-only")
- You want to add procedural startup steps the agent must run every session
- You want to add custom menu items that trigger your own skills or prompts
- Your team needs shared customizations committed to git, with personal preferences layered on top

:::note[Prerequisites]

- BMad installed in your project (see [How to Install BMad](./install-bmad.md))
- Python 3.11+ on your PATH (for the resolver script -- uses stdlib `tomllib`, no `pip install`, no `uv`, no virtualenv)
- A text editor for TOML files
:::

## How It Works

Every customizable skill ships a `customize.toml` file with its defaults. This file defines the skill's complete customization surface -- read it to see what's customizable. You never edit this file. Instead, you create sparse override files containing only the fields you want to change.

### Three-Layer Override Model

```text
Priority 1 (wins): _bmad/custom/{skill-name}.user.toml  (personal, gitignored)
Priority 2:        _bmad/custom/{skill-name}.toml        (team/org, committed)
Priority 3 (last): skill's own customize.toml                    (defaults)
```

The `_bmad/custom/` folder starts empty. Files only appear when someone actively customizes.

### Merge Rules (by shape, not by field name)

The resolver applies four structural rules. Field names are never special-cased — behavior is determined purely by the value's shape:

| Shape | Rule |
|---|---|
| Scalar (string, int, bool, float) | Override wins |
| Table | Deep merge (recursively apply these rules) |
| Array of tables where every item shares the **same** identifier field (every item has `code`, or every item has `id`) | Merge by that key — matching keys **replace in place**, new keys **append** |
| Any other array (scalars; tables with no identifier; arrays that mix `code` and `id` across items) | **Append** — base items first, then team items, then user items |

**No removal mechanism.** Overrides cannot delete base items. If you need to suppress a default menu item, override it by `code` with a no-op description or prompt. If you need to restructure an array more deeply, fork the skill.

**The `code` / `id` convention.** BMad uses `code` (short identifier like `"BP"` or `"R1"`) and `id` (longer stable identifier) as merge keys on arrays of tables. If you author a custom array-of-tables that should be replaceable-by-key rather than append-only, pick **one** convention (either `code` on every item, or `id` on every item) and stick with it across the whole array. Mixing `code` on some items and `id` on others falls back to append — the resolver won't guess which key to merge on.

### Some agent fields are read-only

`agent.name` and `agent.title` live in `customize.toml` as source-of-truth metadata, but the agent's SKILL.md doesn't read them at runtime — they're hardcoded identity. Putting `name = "Bob"` in an override file has no effect. If you genuinely need a different-named agent, copy the skill folder, rename it, and ship it as a custom skill.

## Steps

### 1. Find the Skill's Customization Surface

Look at the skill's `customize.toml` in its installed directory. For example, the PM agent:

```text
.claude/skills/bmad-agent-pm/customize.toml
```

(Path varies by IDE -- Cursor uses `.cursor/skills/`, Cline uses `.cline/skills/`, and so on.)

This file is the canonical schema. Every field you see is customizable (excluding the read-only identity fields noted above).

### 2. Create Your Override File

Create the `_bmad/custom/` directory in your project root if it doesn't exist. Then create a file named after the skill:

```text
_bmad/custom/
  bmad-agent-pm.toml        # team overrides (committed to git)
  bmad-agent-pm.user.toml   # personal preferences (gitignored)
```

:::caution[Do NOT copy the whole `customize.toml`]
Override files are **sparse**. Include only the fields you're changing — nothing else. Every field you omit is inherited automatically from the layer below (team from defaults, user from team-or-defaults).

Copying the full `customize.toml` into an override is actively harmful: the next update ships new defaults, but your override file locks in the old values. You'll silently drift out of sync with every release.
:::

**Example — changing the icon and adding one principle**:

```toml
# _bmad/custom/bmad-agent-pm.toml
# Just the fields I'm changing. Everything else inherits.

[agent]
icon = "🏥"
principles = [
  "Ship nothing that can't pass an FDA audit.",
]
```

This appends the new principle to the defaults (leaving the shipped principles intact) and replaces the icon. Every other field stays as shipped.

### 3. Customize What You Need

All examples below assume BMad's flat agent schema. Fields live directly under `[agent]` — no nested `metadata` or `persona` sub-tables.

**Scalars (icon, role, identity, communication_style).** Scalar overrides win. You only need to set the fields you're changing:

```toml
# _bmad/custom/bmad-agent-pm.toml

[agent]
icon = "🏥"
role = "Drives product discovery for a regulated healthcare domain."
communication_style = "Precise, regulatory-aware, asks compliance-shaped questions early."
```

**Persistent facts, principles, activation hooks (append arrays).** All four arrays below are append-only. Team items run after defaults, user items run last.

```toml
[agent]
# Static facts the agent keeps in mind the whole session — org rules, domain
# constants, user preferences. Distinct from the runtime memory sidecar.
#
# Each entry is either a literal sentence, or a `file:` reference whose
# contents are loaded as facts (glob patterns supported).
persistent_facts = [
  "Our org is AWS-only -- do not propose GCP or Azure.",
  "All PRDs require legal sign-off before engineering kickoff.",
  "Target users are clinicians, not patients -- frame examples accordingly.",
  "file:{project-root}/docs/compliance/hipaa-overview.md",
  "file:{project-root}/_bmad/custom/company-glossary.md",
]

# Adds to the agent's value system
principles = [
  "Ship nothing that can't pass an FDA audit.",
  "User value first, compliance always.",
]

# Runs BEFORE the standard activation (persona, persistent_facts, config, greet).
# Use for pre-flight loads, compliance checks, anything that needs to be in
# context before the agent introduces itself.
activation_steps_prepend = [
  "Scan {project-root}/docs/compliance/ and load any HIPAA-related documents as context.",
]

# Runs AFTER greet, BEFORE the menu. Use for context-heavy setup that should
# happen once the user has been acknowledged.
activation_steps_append = [
  "Read {project-root}/_bmad/custom/company-glossary.md if it exists.",
]
```

**The two hooks do different jobs.** Prepend runs before greeting so the agent can load context it needs to personalize the greeting itself. Append runs after greeting so the user isn't staring at a blank terminal while heavy scans complete.

**Menu customization (merge by `code`).** The menu is an array of tables. Each item has a `code` field (BMad convention), so the resolver merges by code: matching codes replace in place, new codes append.

TOML array-of-tables syntax uses `[[agent.menu]]` for each item:

```toml
# Replace the existing CE item with a custom skill
[[agent.menu]]
code = "CE"
description = "Create Epics using our delivery framework"
skill = "custom-create-epics"

# Add a new item (code RC doesn't exist in defaults)
[[agent.menu]]
code = "RC"
description = "Run compliance pre-check"
prompt = """
Read {project-root}/_bmad/custom/compliance-checklist.md
and scan all documents in {planning_artifacts} against it.
Report any gaps and cite the relevant regulatory section.
"""
```

Each menu item has exactly one of `skill` (invokes a registered skill) or `prompt` (executes the text directly). Items not listed in your override keep their defaults.

**Referencing files.** When a field's text needs to point at a file (in `persistent_facts`, `activation_steps_prepend`/`activation_steps_append`, or a menu item's `prompt`), use a full path rooted at `{project-root}`. Even if the file sits next to your override in `_bmad/custom/`, spell out the full path: `{project-root}/_bmad/custom/info.md`. The agent resolves `{project-root}` at runtime.

### 4. Personal vs Team

**Team file** (`bmad-agent-pm.toml`): Committed to git. Shared across the org. Use for compliance rules, company persona, custom capabilities.

**Personal file** (`bmad-agent-pm.user.toml`): Gitignored automatically. Use for tone adjustments, personal workflow preferences, and private facts the agent should keep in mind.

```toml
# _bmad/custom/bmad-agent-pm.user.toml

[agent]
persistent_facts = [
  "Always include a rough complexity estimate (low/medium/high) when presenting options.",
]
```

## How Resolution Works

On activation, the agent's SKILL.md runs a shared Python script that does the three-layer merge and returns the resolved block as JSON. The script uses the Python standard library's `tomllib` module (no external dependencies), so plain `python3` is enough:

```bash
python3 {project-root}/_bmad/scripts/resolve_customization.py \
  --skill {skill-root} \
  --key agent
```

**Requirements**: Python 3.11+ (earlier versions don't include `tomllib`). No `pip install`, no `uv`, no virtualenv. Check with `python3 --version`. Some platforms (macOS without Homebrew, Ubuntu 22.04) default `python3` to 3.10 or earlier, so you may need to install 3.11+ separately.

`--skill` points at the skill's installed directory (where `customize.toml` lives). The skill name is derived from the directory's basename, and the script looks up `_bmad/custom/{skill-name}.toml` and `{skill-name}.user.toml` automatically.

Useful invocations:

```bash
# Resolve the full agent block
python3 {project-root}/_bmad/scripts/resolve_customization.py \
  --skill /abs/path/to/bmad-agent-pm \
  --key agent

# Resolve a single field
python3 {project-root}/_bmad/scripts/resolve_customization.py \
  --skill /abs/path/to/bmad-agent-pm \
  --key agent.icon

# Full dump
python3 {project-root}/_bmad/scripts/resolve_customization.py \
  --skill /abs/path/to/bmad-agent-pm
```

Output is always JSON. If the script is unavailable on a given platform, the SKILL.md tells the agent to read the three TOML files directly and apply the same merge rules.

## Workflow Customization

Workflows (skills that drive multi-step processes like `bmad-product-brief`) share the same override mechanism as agents. Their customizable surface lives under `[workflow]` instead of `[agent]`:

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]
# Same prepend/append semantics as agents — runs before and after the workflow's
# own activation steps. Overrides append to defaults.
activation_steps_prepend = [
  "Load {project-root}/docs/product/north-star-principles.md as context.",
]

activation_steps_append = []

# Same literal-or-file: semantics as the agent variant. Loaded as foundational
# context for the duration of the workflow run.
persistent_facts = [
  "All briefs must include an explicit regulatory-risk section.",
  "file:{project-root}/docs/compliance/product-brief-checklist.md",
]

# Scalar: runs once the workflow finishes its main output. Override wins.
on_complete = "Summarize the brief in three bullets and offer to email it via the gws-gmail-send skill."
```

The same field conventions cross the agent/workflow boundary: `activation_steps_prepend`/`activation_steps_append`, `persistent_facts` (with `file:` refs), and menu-style `[[…]]` tables with `code`/`id` for keyed merge. The resolver applies the same four structural rules regardless of the top-level key. SKILL.md references follow the namespace: `{workflow.activation_steps_prepend}`, `{workflow.persistent_facts}`, `{workflow.on_complete}`. Any additional fields a workflow exposes (output paths, toggles, review settings, stage flags) follow the same shape-based merge rules. Read the workflow's `customize.toml` to see what's customizable.

### Activation Order

Customizable workflows run their activation in a fixed sequence so you know exactly when your hooks fire:

1. Resolve the `[workflow]` block (base → team → user merge)
2. Execute `activation_steps_prepend` in order
3. Load `persistent_facts` as foundational context for the run
4. Load config (`_bmad/bmm/config.yaml`) and resolve standard variables (project name, languages, paths, date)
5. Greet the user
6. Execute `activation_steps_append` in order

After step 6 the workflow body begins. Use `activation_steps_prepend` when you need context loaded before the greeting can be personalized; use `activation_steps_append` when the setup is heavy and you'd rather the user sees the greeting first.

### Scope of This Initial Pass

Customization is rolling out incrementally. The fields documented above — `activation_steps_prepend`, `activation_steps_append`, `persistent_facts`, `on_complete` — are the **baseline surface** that every customizable workflow exposes, and they will remain stable across versions. They give you broad-stroke control today: inject pre/post steps, pin foundational context, trigger follow-up actions.

Over time, individual workflows will expose **more targeted customization points** tailored to what that workflow actually does — things like step-specific toggles, stage flags, output template paths, or review gates. When those arrive, they stack on top of the baseline fields rather than replacing them, so customizations you author today keep working.

If you need a fine-grained knob that isn't exposed yet, either use `activation_steps_*` and `persistent_facts` to steer behavior, or open an issue describing the specific customization point you want — those requests are what drive which targeted fields get added next.

## Central Configuration

Per-skill `customize.toml` covers **deep behavior** (hooks, menus, persistent_facts, persona overrides for a single agent or workflow). A separate surface covers **cross-cutting state** — install answers and the agent roster that external skills like `bmad-party-mode`, `bmad-retrospective`, and `bmad-advanced-elicitation` consume. That surface lives in four TOML files at project root:

```text
_bmad/config.toml               (installer-owned)  team scope:   install answers + agent roster
_bmad/config.user.toml          (installer-owned)  user scope:   user_name, language, skill level
_bmad/custom/config.toml        (human-authored)   team overrides (committed to git)
_bmad/custom/config.user.toml   (human-authored)   personal overrides (gitignored)
```

### Four-Layer Merge

```text
Priority 1 (wins): _bmad/custom/config.user.toml
Priority 2:        _bmad/custom/config.toml
Priority 3:        _bmad/config.user.toml
Priority 4 (base): _bmad/config.toml
```

Same structural rules as per-skill customize (scalars override, tables deep-merge, `code`/`id`-keyed arrays merge by key, other arrays append).

### What Lives Where

The installer partitions answers by the `scope:` declared on each prompt in `module.yaml`:

- `[core]` and `[modules.<code>]` sections — install answers. Scope `team` lands in `_bmad/config.toml`; scope `user` lands in `_bmad/config.user.toml`.
- `[agents.<code>]` — agent essence (code, name, title, icon, description, team) distilled from each module's `module.yaml` `agents:` block. Always team-scoped.

### Editing Rules

- `_bmad/config.toml` and `_bmad/config.user.toml` are **regenerated every install** from the answers collected during the installer flow. Treat them as read-only outputs — direct edits will be overwritten on the next install. To change an install answer durably, re-run the installer (it remembers your prior answers as defaults) or shadow the value in `_bmad/custom/config.toml`.
- `_bmad/custom/config.toml` and `_bmad/custom/config.user.toml` are **never touched** by the installer. This is the correct surface for custom agents, agent descriptor overrides, team-enforced settings, and any value you want to pin regardless of install answers.

### Example — Rebrand an Agent

```toml
# _bmad/custom/config.toml (committed to git, applies to every developer)

[agents.bmad-agent-pm]
description = "Healthcare PM — regulatory-aware, stakeholder-driven, FDA-shaped questions first."
icon = "🏥"
```

The resolver merges over the installer-written `[agents.bmad-agent-pm]`. `bmad-party-mode` and any other roster consumer pick up the new description automatically.

### Example — Add a Fictional Agent

```toml
# _bmad/custom/config.user.toml (personal, gitignored)

[agents.kirk]
team = "startrek"
name = "Captain James T. Kirk"
title = "Starship Captain"
icon = "🖖"
description = "Bold, rule-bending commander. Speaks in dramatic pauses. Thinks aloud about the weight of command."
```

No skill folder required — the essence alone is enough for party-mode to spawn Kirk as a voice. Filter by the `team` field to invite just the Enterprise crew to a roundtable.

### Example — Override Module Install Settings

```toml
# _bmad/custom/config.toml

[modules.bmm]
planning_artifacts = "/shared/org-planning-artifacts"
```

The override wins over whatever each developer answered during their local install. Useful for pinning team conventions.

### When to Use Which Surface

| Need | Use |
|---|---|
| Add MCP tool calls to every dev workflow | Per-skill: `_bmad/custom/bmad-agent-dev.toml` `persistent_facts` |
| Add a menu item to an agent | Per-skill: `_bmad/custom/bmad-agent-{role}.toml` `[[agent.menu]]` |
| Swap a workflow's output template | Per-skill: `_bmad/custom/{workflow}.toml` scalar override |
| Rebrand an agent's public descriptor | **Central**: `_bmad/custom/config.toml` `[agents.<code>]` |
| Add a custom or fictional agent to the roster | **Central**: `_bmad/custom/config.*.toml` new `[agents.<code>]` entry |
| Pin team-enforced install settings | **Central**: `_bmad/custom/config.toml` `[modules.<code>]` or `[core]` |

Use both surfaces in the same project as needed.

## Worked Examples

For enterprise-oriented recipes (shaping an agent across every workflow it dispatches, enforcing org conventions, publishing outputs to Confluence and Jira, customizing the agent roster, and swapping in your own output templates), see [How to Expand BMad for Your Organization](./expand-bmad-for-your-org.md).

## Troubleshooting

**Customization not appearing?**

- Verify your file is in `_bmad/custom/` with the correct skill name
- Check TOML syntax: strings must be quoted, table headers use `[section]`, array-of-tables use `[[section]]`, and any scalar or array keys for a table must appear *before* any of that table's `[[subtables]]` in the file
- For agents, customization lives under `[agent]` -- fields written below that header belong to `agent` until another table header begins
- Remember `agent.name` and `agent.title` are read-only; overrides there have no effect

**Updates broke my customization?**

- Did you copy the full `customize.toml` into your override file? **Don't.** Override files should contain only the fields you're changing. A full copy locks in old defaults and silently drifts every release. Trim your override back to just the deltas.

**Need to see what's customizable?**

- Read the skill's `customize.toml` -- every field there is customizable (except `name` and `title`)

**Need to reset?**

- Delete your override file from `_bmad/custom/` -- the skill falls back to its built-in defaults
