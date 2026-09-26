---
title: 'How to Install BMad'
description: Install the current BMad skills, set up the project runtime, and verify or update it.
---

Install BMad through the Skills CLI or your coding tool's plugin marketplace, then run `bmad setup` in the project.

## Prerequisites

You need an AI coding tool that supports skills and [uv](https://docs.astral.sh/uv/) for setup and Python scripts. The Skills CLI also needs Node.js, npm, and Git.

## Install the Skills

From your project directory, run:

```bash
npx skills add bmad-code-org/BMAD-METHOD
```

Select your coding tool and skills. Include `bmad` for setup and help, and the module records `bmod-core-tools` and `bmod-method` for the modules you use. To install a small set by name:

```bash
npx skills add bmad-code-org/BMAD-METHOD --skill bmad --skill bmod-core-tools --skill bmod-method --skill bmad-build --skill bmad-preview-ticketing
```

Add review, retrospective, or other skills as needed. Keep project and global installation scopes consistent.

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

Open the coding tool from the project folder and ask the `bmad` skill to run `bmad setup`. Setup installs the shared runtime and module scripts under `_bmad/`. Ask for `bmad status` to verify the installation and versions.

Invoke `bmad-build` with the change you want, or ask `bmad` for guidance. For work spanning repositories, set up at the workspace root so skills can reach both the planning store and code repositories.

## Update an Installation

Update through the same installation method:

```bash
npx skills update
```

For plugins, use your marketplace's update flow instead. Then run `bmad setup` again to refresh the project's runtime and `bmad status` to verify it. Restart your coding tool when its skill catalog needs refreshing.

## What You Get

Your coding tool discovers the installed skills. The project's `_bmad/` holds shared configuration and supporting scripts. Team and personal customizations live under `_bmad/custom/` and survive setup refreshes.
