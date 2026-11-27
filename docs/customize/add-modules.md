---
title: 'Add Modules'
description: Add a module with the Skills CLI and bmad setup, keep it updated, and find out where to build your own.
sidebar:
  order: 3
---

A module is a set of related skills packaged with metadata so the `bmad` skill can configure, update, and recommend them. Most projects start with two base modules: **Core Tools** (`core-tools`, providing `bmad`, `bmad-facilitate`, `bmad-customize`, `bmad-party-mode`, `bmad-review`, and companion tools) and **BMad Method** (`method`, providing the software delivery agents and build workflows). You can add extra modules at any time with the Skills CLI and `bmad setup`, with no separate installer or build step.

## Official Modules

| Module | What it adds | Install command or source |
| --- | --- | --- |
| **Core Tools** (`core-tools`) | Base `bmad` helper, document facilitation, customization, multi-agent discussions, reviews, brainstorming, and research | `npx skills add bmad-code-org/BMAD-METHOD/skills/core-tools --skill '*'` |
| **BMad Method** (`method`) | Software delivery agents (Mary, John, Sally, Winston, Sofia, Amelia) plus build, autonomous loop, code review, QA, and retrospective skills | `npx skills add bmad-code-org/BMAD-METHOD/skills/method --skill '*'` |
| **[Founder](../founder/founder.md)** (`founder`) | Nadia, the Founder Advisor: seventeen business documents from startup diagnostic to board pack, financial modeling scripts, customer evidence, investor tracking, and pitch rooms in one company record folder | `npx skills add bmad-code-org/BMAD-METHOD/skills/founder --skill '*'` |
| **[Creative](../creative/creative.md)** (`creative`) | Clio, the Creative Director: voice-grounded talks, essays, scripts, stories, characters, worlds, presentations, and studio rooms in one creative record folder | `npx skills add bmad-code-org/BMAD-METHOD/skills/creative --skill '*'` |
| **[Toolsmith](../toolsmith/toolsmith.md)** (`toolsmith`) | Smithy, the Toolsmith (`bmad-toolsmith`) and `bmad-eval` for authoring, validating, evaluating, and packaging BMad skills, agents, and modules | `npx skills add bmad-code-org/BMAD-METHOD/skills/toolsmith --skill '*'` |
| **Test Architect (TEA)** (`tea`) | Test strategy, automation, test review, traceability, and release-gate decisions through an agent and eight workflows | [bmad-method-test-architecture-enterprise](https://github.com/bmad-code-org/bmad-method-test-architecture-enterprise) |
| **Game Dev Studio** (`gds`) | Game design documents and game-aware planning for Unity, Unreal, Godot, and custom engines | [bmad-module-game-dev-studio](https://github.com/bmad-code-org/bmad-module-game-dev-studio) |

Creative replaces the older Creative Intelligence Suite (`cis`), and `bmad setup` offers to remove any retired CIS skills still installed. Each external repository's README notes which BMad version it supports. TEA's `bmad-tea-automate` provides deeper test coverage than the built-in `bmad-qa-generate-e2e-tests`; see [Test Completed Work](../build/test-completed-work.md) to choose between them.

## Add a Module

From your project folder, install the module's skills with the Skills CLI. For example, to install Founder from this repository:

```bash
npx skills add bmad-code-org/BMAD-METHOD/skills/founder --skill '*'
```

Or to install an external module such as Test Architect (TEA):

```bash
npx skills add bmad-code-org/bmad-method-test-architecture-enterprise --skill '*'
```

Choose your coding tool and keep the project or global installation scope consistent with your existing BMad skills. Passing `--skill '*'` ensures the module's metadata record is installed alongside every skill in the module.

Next, open your coding tool's chat and ask the `bmad` skill to run `bmad setup <code>` (for example, `bmad setup founder` or `bmad setup tea`). Setup asks the module's configuration questions, installs any helper scripts under `_bmad/<code>/`, and offers any migrations the module ships. Ask for `bmad status` afterward to confirm the installed module and version.

Any repository following the BMad module layout installs the same way, including local folders or pinned tags such as `owner/repo#v1.2.0`.

## Keep a Module Updated

`bmad setup` checks each installed module's version against its source and offers to run `npx skills update` when a newer version is available. If you update skills yourself, run `bmad setup` afterward so scripts and configuration stay in sync.

When a module was installed from a pinned tag and a newer release exists, `bmad status` reports it as `pinned` (because `npx skills update` stays on that tag) and gives the exact `npx skills add owner/repo#<tag> --skill '*'` command to move to the new release.

## Create Your Own Module

Ask Smithy (`bmad-toolsmith`) to scaffold a module, add skills or agents to it, and validate the layout before publishing. See [Modules](../toolsmith/modules.md) for the authoring walkthrough and [Module Files](../reference/module-files.md) for the exact manifest and folder specification.
