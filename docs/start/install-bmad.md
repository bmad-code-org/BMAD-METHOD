---
title: 'How to Install BMad'
description: Install the stable BMad release or the preview skills, set up the project runtime, and verify or update it.
---

Install BMad through the Skills CLI or your coding tool's plugin marketplace, then run `bmad setup` in the project.

:::caution[V7 Preview Alpha]
This page installs v7 of BMad, which is in preview alpha. Its skills, install path, and documentation change often, and updates can break an existing setup. It is recommended for solo or small teams that can pivot as things will change before beta. The v7 release ETA is October 16, 2026, and it might be sooner. If you need stability until v7 is finalized for release, install v6.12 instead.
:::

## Install the Stable Release

The stable release is v6.12, frozen aside from bug fixes. With [Node.js](https://nodejs.org) 20.12+, [Python](https://www.python.org) 3.10+, and [uv](https://docs.astral.sh/uv/), run in your project:

```bash
npx bmad-method install
```

The rest of this page does not apply to v6.12. Its source and documentation live on the [V6.12 branch](https://github.com/bmad-code-org/BMAD-METHOD/tree/V6.12).

## Prerequisites

You need an AI coding tool that supports skills and [uv](https://docs.astral.sh/uv/) for setup and Python scripts. The Skills CLI also needs Node.js, npm, and Git.

## Install the Skills

From your project directory, run:

```bash
npx skills add bmad-code-org/BMAD-METHOD --skill '*'
```

`--skill '*'` installs the full BMad Method and asks which coding tools to install to. To choose skills instead, run the command without `--skill '*'` and select your coding tool and skills. Include `bmad` for setup and help, and the module records `bmod-core-tools` and `bmod-method` for the modules you use. To install a small set by name:

```bash
npx skills add bmad-code-org/BMAD-METHOD --skill bmad --skill bmod-core-tools --skill bmod-method --skill bmad-build --skill bmad-agent-po
```

Add review, retrospective, or other skills as needed. Keep project and global installation scopes consistent.

## Security Scan Warnings

During install, the Skills CLI shows a Security Risk Assessments table from three scanners: Gen Agent Trust Hub, Socket, and Snyk. Some BMad skills get a Med Risk or High Risk rating. The scanners flag behavior the skills use on purpose:

- Skills run Python scripts from the project's `_bmad/scripts/` folder with `uv run` to load configuration and customizations.
- Customization files under `_bmad/custom/` can add activation steps that the skill runs.
- Some skills read text written by other people, such as tickets, issues, and pull request diffs, which scanners treat as a prompt injection risk.
- Some skills tell you to install a missing skill with `npx skills add`.

Skills run with your coding tool's permissions, so add only customizations you trust. The full report for each skill is on [skills.sh](https://skills.sh/bmad-code-org/BMAD-METHOD).

## Install through a Plugin Marketplace

As an alternative, add the marketplace inside Claude Code:

```text
/plugin marketplace add bmad-code-org/bmad-plugins
```

Or add it from your terminal for Codex:

```bash
codex plugin marketplace add bmad-code-org/bmad-plugins
```

Install `bmad-method` for delivery workflows and `bmad-core-tools` for standalone skills, including the `bmad` hub. Use one installation method for a given skill to avoid duplicate commands.

## Set Up and Verify

Open the coding tool from the project folder and ask the `bmad` skill to run `bmad setup`. Setup installs the shared runtime and module scripts under `_bmad/`. Ask for `bmad status` to verify the installation and versions. Documents and tickets go to `_bmad-output`, inside the active initiative's folder when one is set; ask `bmad` to create or switch one.

Invoke `bmad-build` with the change you want, or ask `bmad` for guidance. For work spanning repositories, set up at the workspace root so skills can reach both the output folder and code repositories.

## Update an Installation

Ask the `bmad` skill to run `bmad setup` again. It checks each module's version and runs `npx skills update` for you when there is a newer one. Then it asks any new config questions, moves your `_bmad/custom/` files when a skill was renamed, and offers to delete skills a module renamed or removed. Last, it checks whether a migration applies and asks whether to run it.

If you update by hand with `npx skills update`, run `bmad setup` afterwards. For plugins, use your marketplace's update flow, then `bmad setup`. Restart your coding tool when its skill catalog needs refreshing.

## What You Get

Your coding tool discovers the installed skills. The project's `_bmad/` holds shared configuration and supporting scripts. Team and personal customizations live under `_bmad/custom/` and survive setup refreshes.
