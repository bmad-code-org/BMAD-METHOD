---
title: Standalone Skills & Module Dependencies
description: How single-skill modules, hidden modules, and the module dependencies mechanism work — including the BMad Analysis pack.
sidebar:
  order: 8
---

Some BMad skills are not tied to the core module or to a domain suite like BMM. They ship as **standalone single-skill modules** — each with its own `module.yaml` and `module-help.csv` — and install on their own, either directly or because another module depends on them.

## Module dependencies

A module's `module.yaml` can declare a `dependencies` list of module codes:

```yaml
code: bmad-analysis
name: 'BMad Analysis'
description: 'The BMad thinking pack ...'

dependencies:
  - bmad-brainstorming
  - bmad-party-mode
  - bmad-forge-idea
```

When you select a module in the installer, the installer resolves the recursive union of its dependencies and installs those modules too. A dependency code the installer doesn't recognize produces a warning and is skipped — it never blocks the install.

## Hidden modules

A module can set `hidden: true` in its `module.yaml`. Hidden modules do not appear in the installer's module picker; they install only when another module declares them as a dependency, or when selected explicitly (for example, in a non-interactive install manifest).

This is how single-skill modules stay out of the picker without becoming unreachable: the picker stays short, and bundles or domain modules pull in exactly the atoms they need.

## The BMad Analysis pack

**BMad Analysis** (`bmad-analysis`) is a bundle module: it ships no skills of its own, only a `dependencies` list. Selecting it in the installer installs the three standalone thinking skills:

| Skill | Module code | Purpose |
| --- | --- | --- |
| `bmad-brainstorming` | `bmad-brainstorming` | Diverge — facilitated ideation with a curated technique library |
| `bmad-forge-idea` | `bmad-forge-idea` | Pressure-test — persona-driven interrogation until an idea hardens or dies cheaply |
| `bmad-party-mode` | `bmad-party-mode` | Multi-perspective — round-table discussions between installed agents or custom personas |

All three are hidden single-skill modules. Any other module can also declare them as dependencies and get them installed automatically.

Each skill is documented in [Core Tools](./core-tools.md#standalone-thinking-skills).

## Source layout

In the BMad Method repository, standalone skill modules live under `src/standalone-skills/`. BMad Analysis is a module (like `core` and `bmm`), so it lives at the same level as the other module folders:

```text
src/
├── core-skills/              # the core module
├── bmm-skills/               # the BMad Method module
├── bmad-analysis-skills/     # the BMad Analysis module (bundle: module.yaml with dependencies only)
└── standalone-skills/
    ├── bmad-brainstorming/   # hidden single-skill module
    │   ├── module.yaml
    │   ├── module-help.csv
    │   └── bmad-brainstorming/   # the skill itself
    ├── bmad-forge-idea/
    └── bmad-party-mode/
```

Each standalone module reads the central BMad configuration (user name, communication language, output folder) from the shared four-layer TOML merge — none of them asks its own install questions.
