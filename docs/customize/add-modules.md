---
title: 'Add Modules'
description: Add a module with the Skills CLI and bmad setup, find the ecosystem modules, keep modules updated, and know where to build your own.
sidebar:
  order: 3
---

Use the Skills CLI to install a module's skills, then ask the `bmad` skill to
run `bmad setup`. A module is a set of skills that belong together, plus one
folder named `bmod-<code>`, the module record, that tells `bmad` about them.
BMad Method (`bmod-method`), the core tools (`bmod-core-tools`), and
Toolsmith (`bmod-toolsmith`) are modules.

## What a Module Adds

Adding a module needs no installer, registry, or build step. Once a module's skills
are installed, `bmad` finds the module on its next run, and the module gets:

- Setup and config questions, which `bmad setup` asks once
- Help that `bmad` answers from, so it can recommend the module's skills
- Its agents and parties in [party mode](./run-multi-agent-discussions.md)
- Offers to install skills that the module's skills require or recommend
- Update checks

:::note[Prerequisites]
BMad installed in the project; see [How to Install BMad](../start/install-bmad.md).
The Skills CLI needs Node.js, npm, and Git, and `bmad setup` needs
[uv](https://docs.astral.sh/uv/).
:::

## Install the Module's Skills

From your project directory, run the Skills CLI with the repository the
module lives in:

```bash
npx skills add <owner>/<repo>
```

Select your coding tool and the skills you want, and include the module's
`bmod-<code>` record. If you leave the record out, `bmad setup` reports it
missing and offers to install it.

The modules in the BMAD-METHOD repository install the same way. Toolsmith,
for example, is not part of a default method install: run
`npx skills add bmad-code-org/BMAD-METHOD` and select `bmod-toolsmith`,
`bmad-toolsmith`, and `bmad-eval`.

`bmad setup` reads every skills folder your coding tool loads, so a module
installed in the project works with a `bmad` skill installed globally.

## Set Up the Module

Open your coding tool in the project and ask the `bmad` skill to run
`bmad setup`. For each new module, setup:

- Asks the module's config questions. A team answer goes to the committed `_bmad/config.toml`, a personal one to `_bmad/custom/config.user.toml`; an answer you already gave is never changed.
- Installs the module's scripts under `_bmad/`.
- Names the module's skills you did not install, and the skills its skills require or recommend, and offers to install them.
- Shows the module's post-install message, such as where to start.

:::note[Install messages]
A module's author can add a message shown before an install or update that
`bmad` runs, and one shown after setup. `bmad` shows each message quoted, as
written, and never follows it as instructions.
:::

Ask for `bmad status` to check the result without changing anything. It
lists each module with its version, scope, and whether an update is
available.

## Ecosystem Modules

These modules live in their own repositories. Each one's documentation
describes what it provides.

| Module | What it is for |
| --- | --- |
| [Creative Intelligence Suite](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite) | Creative thinking partners for innovation, design thinking, and storytelling. |
| [Game Dev Studio](https://github.com/bmad-code-org/bmad-module-game-dev-studio) | Ideate, design, and build games in any framework, including Unity, Unreal, Godot, and Phaser. |
| [Test Architect (TEA)](https://github.com/bmad-code-org/bmad-method-test-architecture-enterprise) | Enterprise testing add-on for BMad Method. [Test Completed Work](../build/test-completed-work.md) compares its `bmad-testarch-automate` with the built-in test skill. |

## Update Modules

Ask `bmad` to run `bmad setup` again. When a module has a newer version, it
runs `npx skills update`, then asks any new config questions, moves your
`_bmad/custom/` files when a skill was renamed, and offers to delete skills
the module renamed or removed. Last, it checks whether a migration applies
and asks before running it.

A module installed through a plugin marketplace is updated there; update it,
then ask for `bmad setup`.

## Build Your Own Module

[Toolsmith](../toolsmith/toolsmith.md) is the module for authoring BMad
content. Its agent, Smithy (`bmad-toolsmith`), builds a skill or an agent from
a conversation and packages skills as a module. Nothing is written until you
approve a read-back, and the read-back says how the new skill registers with
`bmad`:

| Registration | What it means |
| --- | --- |
| Plain skill | No module record. It works, but `bmad` never recommends it, and setup and update checks skip it. |
| Single-skill module | Its own record in the same folder, so setup asks its questions, help recommends it, and updates are checked. |
| Member of an existing module | Joins that module, takes that module's prefix, and is added to its record. |
| First skill of a new module | A new record folder plus the skill. |

A module can also be one skill, or only personas and parties for party mode,
with no skills.

To extend BMad Method in your project, make your own module with your own
prefix, whose skills require or recommend the method skills they build on.
Its skills never take a `bmad-` name, and it never edits the installed
`bmod-method` record, which the next update would overwrite. To contribute to BMad Method itself,
open a pull request to the BMAD-METHOD repository.

Build in the module's source repository, not in the installed copy, which
the next update overwrites. Push the repository, and others install it with
`npx skills add <owner>/<repo>` and run `bmad setup`.
