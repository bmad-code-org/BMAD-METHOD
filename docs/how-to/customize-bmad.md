---
title: 'How to Customize BMad'
description: Customize agents and workflows while preserving update compatibility
sidebar:
  order: 8
---

Tailor agent personas, inject domain context, add capabilities, and configure workflow behavior -- all without modifying installed files. Your customizations survive every update.

## When to Use This

- You want to change an agent's name, personality, or communication style
- You need to give an agent persistent facts to recall (e.g. "our org is AWS-only")
- You want to add procedural startup steps the agent must run every session
- You want to add custom menu items that trigger your own skills or prompts
- Your team needs shared customizations committed to git, with personal preferences layered on top

:::note[Prerequisites]

- BMad installed in your project (see [How to Install BMad](./install-bmad.md))
- A text editor for YAML files
:::

## How It Works

Every agent skill ships a `customize.yaml` file with its defaults. This file defines the skill's complete customization surface -- read it to see what's customizable. You never edit this file. Instead, you create sparse override files containing only the fields you want to change.

### Three-Layer Override Model

```text
Priority 1 (wins): _bmad/custom/{skill-name}.user.yaml  (personal, gitignored)
Priority 2:        _bmad/custom/{skill-name}.yaml        (team/org, committed)
Priority 3 (last): skill's own customize.yaml                    (defaults)
```

The `_bmad/custom/` folder starts empty. Files only appear when someone actively customizes.

### Merge Rules (per field)

| Field | Rule |
|---|---|
| `agent.metadata` | shallow merge -- scalar fields override |
| `agent.persona` | full replace -- if present in override, it replaces wholesale |
| `agent.critical_actions` | append -- override items are added after defaults |
| `agent.memories` | append |
| `agent.menu` | merge by `code` -- matching codes replace, new codes append |
| other tables | deep merge |
| other arrays | atomic replace |
| scalars | override wins |

## Steps

### 1. Find the Skill's Customization Surface

Look at the skill's `customize.yaml` in its installed directory. For example, the PM agent:

```text
.claude/skills/bmad-agent-pm/customize.yaml
```

(Path varies by IDE -- Cursor uses `.cursor/skills/`, Cline uses `.cline/skills/`, and so on.)

This file is the canonical schema. Every field you see is customizable.

### 2. Create Your Override File

Create the `_bmad/custom/` directory in your project root if it doesn't exist. Then create a file named after the skill:

```text
_bmad/custom/
  bmad-agent-pm.yaml        # team overrides (committed to git)
  bmad-agent-pm.user.yaml   # personal preferences (gitignored)
```

Only include the fields you want to change. Unmentioned fields inherit from the layer below.

### 3. Customize What You Need

#### Agent Persona

Change any combination of title, icon, role, identity, communication style, and principles. Anything under `agent.metadata` merges field-by-field; anything under `agent.persona` replaces the persona wholesale if you include it.

:::note[Agent names are fixed]
The built-in BMad agents (Mary, John, Winston, Sally, Amelia, Paige) have hardcoded names. This is a deliberate design choice so every skill can be reliably invoked by role *or* default name — "hey Mary" always activates the analyst, no matter how the team has customized her behavior. If you genuinely need a differently-named agent, copy the skill folder, rename it, and ship it as a custom skill (a few-minute task).
:::

Team override (shallow merge on metadata):

```yaml
# _bmad/custom/bmad-agent-pm.yaml

agent:
  metadata:
    title: Senior Product Lead
    icon: "🏥"
```

Team override (full persona replacement):

```yaml
agent:
  persona:
    role: "Senior Product Lead specializing in healthcare technology"
    identity: |
      15-year product leader in healthcare technology and digital health
      platforms. Deep expertise in EHR integrations and navigating
      FDA/HIPAA regulatory landscapes.
    communication_style: |
      Precise, regulatory-aware, asks compliance-shaped questions early.
    principles: |
      - Ship nothing that can't pass an FDA audit.
      - User value first, compliance always.
```

Because `agent.persona` is replace-wholesale, include every persona field you want the agent to have -- anything omitted will be blank.

#### Memories

Persistent facts the agent always recalls during the session:

```yaml
agent:
  memories:
    - "Our org is AWS-only -- do not propose GCP or Azure."
    - "All PRDs require legal sign-off before engineering kickoff."
    - "Target users are clinicians, not patients -- frame examples accordingly."
```

Memories append: your items are added after defaults.

#### Critical Actions

Procedural startup steps the agent must execute before presenting its menu:

```yaml
agent:
  critical_actions:
    - "Scan {project-root}/docs/compliance/ and load any HIPAA-related documents as context."
    - "Read {project-root}/_bmad/custom/company-glossary.md if it exists."
```

Critical actions append too. They run top-to-bottom on every activation.

#### Menu Customization

Add new capabilities or replace existing ones using `code` as the merge key. Each menu item has exactly one of `skill` (invokes a registered skill) or `prompt` (executes the text directly).

```yaml
agent:
  menu:
    # Replace the existing CE item with a custom skill
    - code: CE
      description: "Create Epics using our delivery framework"
      skill: custom-create-epics

    # Add a new item (code RC doesn't exist in defaults)
    - code: RC
      description: "Run compliance pre-check"
      prompt: |
        Read {project-root}/_bmad/custom/compliance-checklist.md
        and scan all documents in {planning_artifacts} against it.
        Report any gaps and cite the relevant regulatory section.
```

Items not listed in your override keep their defaults.

#### Referencing Files

When a field's text needs to point at a file (in `memories`, `critical_actions`, or a menu item's `prompt`), use a full path rooted at `{project-root}`. Even if the file sits next to your override in `_bmad/custom/`, spell out the full path: `{project-root}/_bmad/custom/info.md`. The agent resolves `{project-root}` at runtime.

### 4. Personal vs Team

**Team file** (`bmad-agent-pm.yaml`): Committed to git. Shared across the org. Use for compliance rules, company persona, custom capabilities.

**Personal file** (`bmad-agent-pm.user.yaml`): Gitignored automatically. Use for tone adjustments, personal workflow preferences, and private memories.

```yaml
# _bmad/custom/bmad-agent-pm.user.yaml

agent:
  memories:
    - "Always include a rough complexity estimate (low/medium/high) when presenting options."
```

## How Resolution Works

On activation, the agent's SKILL.md runs a shared Python script that does the three-layer merge and returns the resolved `agent` block as JSON. The script uses [PEP 723 inline script metadata](https://peps.python.org/pep-0723/) to declare its dependency on PyYAML, and is designed to be invoked via [`uv`](https://docs.astral.sh/uv/):

```bash
uv run {project-root}/_bmad/scripts/resolve_customization.py \
  --skill {skill-root} \
  --key agent
```

`uv run` reads the inline metadata, creates a cached isolated environment with PyYAML installed, and runs the script. First run takes a few seconds while the env is built; subsequent runs reuse the cache and are instant.

**Requirements**: Python 3.10+ and `uv` (install via `brew install uv`, `pip install uv`, or [the official installer](https://docs.astral.sh/uv/getting-started/installation/)). If `uv` isn't available, the script can be run with plain `python3` provided PyYAML is already installed (`pip install PyYAML`).

`--skill` points at the skill's installed directory (where `customize.yaml` lives). The skill name is derived from the directory's basename, and the script looks up `_bmad/custom/{skill-name}.yaml` and `{skill-name}.user.yaml` automatically.

Useful invocations:

```bash
# Resolve the full agent block
uv run {project-root}/_bmad/scripts/resolve_customization.py \
  --skill /abs/path/to/bmad-agent-pm \
  --key agent

# Resolve a single field
uv run {project-root}/_bmad/scripts/resolve_customization.py \
  --skill /abs/path/to/bmad-agent-pm \
  --key agent.metadata.title

# Full dump (everything under agent plus any other top-level keys)
uv run {project-root}/_bmad/scripts/resolve_customization.py \
  --skill /abs/path/to/bmad-agent-pm
```

Output is always JSON. If the script is unavailable on a given platform, the SKILL.md tells the agent to read the three YAML files directly and apply the same merge rules.

## Workflow Customization

Some workflows expose their own customization surface (output paths, review settings, section toggles, etc.) via the same `customize.yaml` + override mechanism. The merge rules above apply to any top-level key, not just `agent` -- so a workflow might use `workflow`, `config`, or other keys to organize its fields. Check the workflow's `customize.yaml` for its specific shape.

## Troubleshooting

**Customization not appearing?**

- Verify your file is in `_bmad/custom/` with the correct skill name
- Check YAML indentation (spaces only, no tabs) and make sure block scalars (`|`) are correctly indented
- For agents, customization lives under `agent:` -- keys written below it belong to that key until another top-level key begins
- Remember `agent.persona` is replace-wholesale: include every persona field you want, not just the ones you're changing

**Need to see what's customizable?**

- Read the skill's `customize.yaml` -- every field there is customizable

**Need to reset?**

- Delete your override file from `_bmad/custom/` -- the skill falls back to its built-in defaults
