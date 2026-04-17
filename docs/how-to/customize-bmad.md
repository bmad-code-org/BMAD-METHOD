---
title: 'How to Customize BMad'
description: Customize agents, workflows, and modules while preserving update compatibility
sidebar:
  order: 8
---

Tailor agent personas, inject domain context, add capabilities, and configure workflow behavior -- all without modifying installed files. Your customizations survive every update.

## When to Use This

- You want to change an agent's name, personality, or communication style
- You need to inject domain-specific context (compliance rules, company guidelines)
- You want to add custom menu items that trigger your own skills or inline instructions
- You want to configure workflow behavior (output paths, review settings, default modes)
- Your team needs shared customizations committed to git, with personal preferences layered on top

:::note[Prerequisites]

- BMad installed in your project (see [How to Install BMad](./install-bmad.md))
- A text editor for TOML files
:::

## How It Works

Every skill that supports customization ships a `customize.toml` file with its defaults. This file defines the skill's complete customization surface -- look at it to see what's customizable. You never edit this file. Instead, you create sparse override files containing only the fields you want to change.

### Three-Layer Override Model

```text
Priority 1 (wins): _bmad/customizations/{name}.user.toml   (personal, gitignored)
Priority 2:        _bmad/customizations/{name}.toml          (team/org, committed)
Priority 3 (last): skill's own customize.toml                (defaults)
```

The `_bmad/customizations/` folder starts empty. Files only appear when someone actively customizes.

### Override Rules

- **Tables and scalars:** sparse override. Only include the fields you want to change; everything else inherits from the layer below.
- **Arrays replace atomically.** When you override an array field (like `additional_resources`), include the complete array you want.
- **Menu items use merge-by-code.** Menu entries with a matching `code` replace that item; new codes add items. Items not mentioned keep their defaults.

## Steps

### 1. Find the Skill's Customization Surface

Look at the `customize.toml` in the skill's source directory. For example, the PM agent's defaults:

```text
src/bmm-skills/2-plan-workflows/bmad-agent-pm/customize.toml
```

This file documents every customizable field with comments and examples.

### 2. Create Your Override File

Create the `_bmad/customizations/` directory in your project root if it doesn't exist. Then create a file named after the skill:

```text
_bmad/customizations/
  bmad-agent-pm.toml        # team overrides (committed to git)
  bmad-agent-pm.user.toml   # personal preferences (gitignored)
```

Only include the fields you want to change. Unmentioned fields inherit from the layer below.

### 3. Customize What You Need

#### Agent Persona

Change any combination of name, title, icon, identity, communication style, and principles:

```toml
# _bmad/customizations/bmad-agent-pm.toml

[persona]
displayName = "Priya"
title = "Senior Product Lead"
icon = "🏥"

identity = """\
15-year product leader in healthcare technology and digital health \
platforms. Deep expertise in EHR integrations and navigating \
FDA/HIPAA regulatory landscapes."""
```

Fields you omit (like `communicationStyle` and `principles` above) keep their defaults.

#### Injected Context

Add domain-specific context that loads before or after the agent's core instructions:

```toml
[inject]
before = """\
CRITICAL CONTEXT: All product work must comply with:
- HIPAA Privacy and Security Rules
- FDA 21 CFR Part 11
- SOC 2 Type II"""

after = """\
Always remind the user that CRB review is required before \
development begins on clinical features."""
```

#### Additional Resources

Load extra files into the agent's context:

```toml
additional_resources = [
    "_bmad/resources/company-product-playbook.md",
    "_bmad/resources/regulatory-checklist.md",
]
```

Since `additional_resources` is an array, include the complete list you want -- it replaces, not appends.

#### Menu Customization

Add new capabilities or replace existing ones using the `code` as the merge key:

```toml
# Replaces existing CE item with a custom skill
[[menu]]
code = "CE"
description = "Create Epics using our delivery framework"
action = "skill"
skill = "custom-create-epics"

# Adds a new item (code RC doesn't exist in defaults)
[[menu]]
code = "RC"
description = "Run compliance pre-check"
action = "inline"
instruction = """\
Scan all documents in {planning_artifacts} for compliance gaps..."""
```

Items not listed keep their SKILL.md defaults.

#### Workflow Configuration

Workflows expose config fields specific to their behavior:

```toml
# _bmad/customizations/bmad-product-brief.toml

[config]
alwaysGenerateDistillate = true

[config.sections]
users           = { enabled = true, weight = "high" }
successCriteria = { enabled = true, weight = "high" }

[[config.customSections]]
name = "Regulatory Impact"
description = "Classify this product under regulatory framework..."
weight = "high"

[review]
contextualReviewLens = "Regulatory and clinical safety risk reviewer"
```

### 4. Personal vs Team

**Team file** (`bmad-agent-pm.toml`): Committed to git. Shared across the org. Use for compliance rules, company persona, custom capabilities.

**Personal file** (`bmad-agent-pm.user.toml`): Gitignored automatically. Use for nickname preferences, tone adjustments, personal workflows.

```toml
# _bmad/customizations/bmad-agent-pm.user.toml

[persona]
displayName = "Doc P"

[inject]
after = """\
When presenting options, always include a rough complexity estimate \
(low/medium/high) so I can gauge engineering effort at a glance."""
```

## How Resolution Works

Customization values are resolved just-in-time when needed -- not all loaded at activation. Each skill includes a `resolve-customization.py` script that handles the three-layer merge:

```bash
# Resolve a single field
python ./scripts/resolve-customization.py bmad-agent-pm --key persona.displayName

# Resolve an entire section
python ./scripts/resolve-customization.py bmad-agent-pm --key persona

# Full dump
python ./scripts/resolve-customization.py bmad-agent-pm
```

Output is JSON. When the script is unavailable (web platforms, etc.), the LLM reads the TOML files directly using the same priority order.

## Troubleshooting

**Customization not appearing?**

- Verify your file is in `_bmad/customizations/` with the correct skill name
- Check TOML syntax (comments start with `#`, strings use `"`, multi-line strings use `"""`)
- Ensure `additional_resources` is at the top of your file, before any `[table]` header -- TOML scoping puts all keys after a `[table]` inside that table

**Need to see what's customizable?**

- Read the skill's `customize.toml` -- it documents every field with comments and examples

**Need to reset?**

- Delete your override file from `_bmad/customizations/` -- the skill falls back to its built-in defaults
