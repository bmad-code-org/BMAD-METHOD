---
title: 'How to Install BMad'
description: Install BMad's skills with the Skills CLI, set up the project runtime, and verify or update it.
---

Install BMad through the Skills CLI, then run `bmad setup` inside your AI coding tool to initialize your project.

## Prerequisites

Before you install BMad, make sure you have:

- An AI coding tool that supports skills (such as Claude Code, Codex, or Cursor)
- [uv](https://docs.astral.sh/uv/) for project setup and BMad's bundled Python helper scripts
- Node.js (20.12+), npm, and Git (used by the Skills CLI and build workflows)

## Install the Skills

From your project directory, run these two commands to install the core tools and the BMad Method bundle:

```bash
npx skills add bmad-code-org/BMAD-METHOD/skills/core-tools --skill '*'
npx skills add bmad-code-org/BMAD-METHOD/skills/method --skill '*'
```

The first command installs the shared core tools, including the `bmad` setup and help skill that every installation needs. The second installs the BMad Method agents and delivery workflows. Passing `--skill '*'` selects everything in each bundle, and the Skills CLI still asks which AI coding tool you want to install to.

You can add optional bundles the same way:

| Bundle | What it adds | Install command |
| --- | --- | --- |
| [Founder](../founder/founder.md) | Startup discovery, modeling, and fundraising with Nadia | `npx skills add bmad-code-org/BMAD-METHOD/skills/founder --skill '*'` |
| [Creative](../creative/creative.md) | Voice-grounded writing, talks, decks, and storytelling with Clio | `npx skills add bmad-code-org/BMAD-METHOD/skills/creative --skill '*'` |
| [Toolsmith](../toolsmith/toolsmith.md) | Building and testing your own BMad skills with Smithy | `npx skills add bmad-code-org/BMAD-METHOD/skills/toolsmith --skill '*'` |

If you prefer to pick individual skills instead of installing full bundles, run `npx skills add bmad-code-org/BMAD-METHOD` interactively and choose your coding tool and skills (keeping `bmad` selected for setup and help). Keep project and global installation scopes consistent across your bundles. See [Add Modules](../customize/add-modules.md) for external modules such as Test Architect (TEA) and Game Dev Studio.

## Security Scan Warnings

During install, the Skills CLI shows a Security Risk Assessments table from three scanners: Gen Agent Trust Hub, Socket, and Snyk. Some BMad skills get a Med Risk or High Risk rating. The scanners flag behavior the skills use on purpose:

- Skills run Python scripts from the project's `_bmad/scripts/` folder with `uv run` to load configuration and customizations.
- Customization files under `_bmad/custom/` can add activation steps that the skill runs.
- Some skills read text written by other people, such as tickets, issues, and pull request diffs, which scanners treat as a prompt injection risk.
- Some skills tell you to install a missing skill with `npx skills add`.

Skills run with your coding tool's permissions, so add only customizations you trust. The full report for each skill is on [skills.sh](https://skills.sh/bmad-code-org/BMAD-METHOD).

## Set Up and Verify

Open your AI coding tool in the project folder and ask the `bmad` skill to run setup:

```text
/bmad setup
```

Setup installs BMad's runtime configuration and helper scripts under `_bmad/`. To verify your installed bundles and versions, run `/bmad status` in chat. Planning documents and tickets are stored in `_bmad-output/`, organized inside your active initiative folder once you create one.

From there, invoke `bmad-build` with a change you want to make, or ask `bmad` where to start. For work spanning multiple repositories, run setup at the shared workspace root so skills can reach both the output folder and the code repositories.

:::tip[Working on multiple epics in parallel?]
Builds expect a clean Git working tree on a branch that matches the epic, so teams running parallel epics often work in separate branches or Git worktrees (running `bmad setup` in each fresh worktree). See [Build and Verify](../build/build-and-verify.md) and [Plan Inside an Organization](../plan/plan-inside-an-organization.md#several-epics-at-once) for team workflow guidance.
:::

## Update an Installation

Open your coding tool and ask the `bmad` skill to run `/bmad setup` again. It checks each installed module's version and runs `npx skills update` for you when a newer version is available. It then asks any new configuration questions, moves your `_bmad/custom/` files if a skill was renamed, offers to remove retired skills, and checks whether a project migration applies.

If you update manually with `npx skills update`, run `/bmad setup` in chat afterward so the project's `_bmad/` runtime stays in sync. If `/bmad status` reports that a module's source moved, run `npx skills update` once and then `/bmad setup`. Restart your coding tool if its skill list needs refreshing.

If you are upgrading from an earlier BMad version, `/bmad setup` offers to clean up older files and migrate your planning documents. Documentation for the legacy v6 line stays on [its own branch](https://github.com/bmad-code-org/BMAD-METHOD/tree/V6.12).

Skills install into your coding tool's project folder by default, or into a per-user folder with `-g`; [Where Skills Live](../reference/skills-and-agents.md#where-skills-live) lists the paths. Because setup writes `_bmad/` inside the current project, run `/bmad setup` in every project that uses BMad.

### Pin a Release

To stay on a specific release tag, install from the repository at that tag (`npx skills add bmad-code-org/BMAD-METHOD#<tag>`), select the same skills as before, and run `/bmad setup`. Running `npx skills update` keeps a pinned install on its tag. When a newer release comes out, `/bmad status` reports `pinned` and prints the command to upgrade, as described in [Keep a Module Updated](../customize/add-modules.md#keep-a-module-updated).

## What You Get

Your coding tool discovers the installed skills immediately. The project's `_bmad/` folder holds shared configuration and supporting scripts, while team and personal customizations live under `_bmad/custom/` and survive updates.
