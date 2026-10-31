---
title: 'Add Modules'
description: Add a module with the Skills CLI and bmad setup, keep it updated, and find out where to build your own.
sidebar:
  order: 3
---

A module is a set of skills that belong together, plus a `bmod-<code>` record folder that tells the `bmad` skill about them. You add one with the Skills CLI, then run `bmad setup <code>` to configure it. There is no separate installer, registry, or build step.

:::note[Using v6.12?]
v6.12 adds modules through `npx bmad-method install`, with `--custom-source` for Git URLs and local paths. That flow is documented on the [V6.12 branch](https://github.com/bmad-code-org/BMAD-METHOD/tree/V6.12). The rest of this page covers v7.
:::

## Official modules

| Module | What it adds | Source |
| --- | --- | --- |
| Test Architect (TEA), code `tea` | Test strategy, automation, test review, traceability, and release-gate decisions through an agent and eight workflows | [bmad-method-test-architecture-enterprise](https://github.com/bmad-code-org/bmad-method-test-architecture-enterprise) |
| Creative Intelligence Suite, code `cis` | Brainstorming, design thinking, and problem-solving agents | [bmad-module-creative-intelligence-suite](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite) |
| Game Dev Studio, code `gds` | Game design documents and game-aware planning for Unity, Unreal, Godot, and custom engines | [bmad-module-game-dev-studio](https://github.com/bmad-code-org/bmad-module-game-dev-studio) |

Each repository's README says which BMad version it supports. TEA's `bmad-tea-automate` generates heavier test coverage than the built-in `bmad-qa-generate-e2e-tests`; [Test Completed Work](../build/test-completed-work.md) helps you choose between them.

## Add a module

From your project folder, add the module's skills with the Skills CLI. For TEA:

```bash
npx skills add bmad-code-org/bmad-method-test-architecture-enterprise
```

Select your coding tool and the skills you want. Include the module record, `bmod-tea` here. Keep the project and global installation scopes consistent with the rest of your BMad skills.

Then ask the `bmad` skill to run `bmad setup tea`. Setup asks the module's configuration questions, places its scripts under `_bmad/<code>/`, and offers any migration the module ships. Ask for `bmad status` to confirm the module and its version.

Any repository that follows the module layout installs the same way. The source can also be a local folder, or a tag, with `owner/repo#v1.2.0`.

## Keep a module updated

`bmad setup` compares each module's version with its source and runs `npx skills update` when a newer one exists. If you update by hand, run `bmad setup` afterwards.

A module installed from a tag reports `pinned` in `bmad status`, because `npx skills update` keeps it on that tag. To move to a newer version, add it again at the new tag, for example `npx skills add owner/repo#v1.3.0 --skill bmod-tea`.

## Create your own module

Ask Smithy, the `bmad-toolsmith` skill, to scaffold a module, add skills and agents to it, and validate it. [Toolsmith](../toolsmith/toolsmith.md) describes what it builds and how.

A module needs one `bmod-<code>` folder holding a `bmod.toml` record, a stub `SKILL.md`, and a `help/help.md` that `bmad` reads to guide users. Publish the repository and others add it with `npx skills add`. To test before publishing, add it from the local folder.

## Modules in v6.12

v6.12 reads modules from the official list in `npx bmad-method install`, or from a Git URL or local path you give it:

| Input | Example |
| --- | --- |
| HTTPS or SSH Git URL | `https://github.com/org/repo`, `git@github.com:org/repo.git` |
| URL with a subfolder or `@ref` | `https://github.com/org/repo/tree/main/my-module`, `https://github.com/org/repo@v1.2.0` |
| Local path | `/Users/me/projects/my-module` |

Pass a source on the command line with `--custom-source`; separate several sources with commas.

```bash
npx bmad-method install --directory . --custom-source /path/to/my-module --tools claude-code --yes
```

A source with `.claude-plugin/marketplace.json` lists its plugins for you to pick from. Without one, the installer scans the folder for skills and treats them as one module. Quick update (`--action quick-update`) refreshes installed modules from their recorded sources, and a full update (`--action update`) lets you add or remove them.
