---
title: 'How to Install BMad'
description: Install, verify, update, and reconfigure BMad in your project
sidebar:
  order: 1
---

Use `npx bmad-method install` to install BMad in a project, connect it to your
AI coding tool, and update it later.

## When to Use This

- Install BMad in a new or existing project.
- Connect BMad skills to a supported AI coding tool.
- Update an existing BMad installation.
- Add or remove modules, change tools, or reconfigure an installation.

:::note[Prerequisites]

- **Node.js 20.12 or later** is required to run the installer.
- **A supported AI coding tool** is required to use the installed skills. The
  installer can show the current list with `npx bmad-method install --list-tools`.
- **uv** is required by skills that render or run Python through `uv`, including
  `bmad-build` and `bmad-build-auto`. If `uv` is missing, the installer warns
  you but still completes the installation.
- **Git** is required only when you install external modules or custom modules
  from Git.

:::

## Install and verify BMad

### 1. Open the target project

In a terminal, go to the project where you want to install BMad. The installer
uses the current directory unless you choose a different destination.

### 2. Run the installer

```bash
npx bmad-method install
```

Follow the prompts. The choices can change as modules and tool integrations
change, but the installer guides you through the available modules,
configuration, and supported AI coding tools.

If the installer reports an error or warning, follow the action it gives you.
A missing-`uv` warning does not stop the installation, but skills that require
`uv` will not work until you install it.

### 3. Check the success summary

When the installation finishes, the installer displays **BMAD is ready to
use!** and the path where it installed BMad. It also reports any warnings that
still need attention.

### 4. Verify the tool integration

Open your selected AI coding tool from the project directory and invoke the
`bmad-help` skill. Ask it what to do next. If the tool recognizes and runs the
skill, the integration is ready.

## Update or reconfigure BMad

### 1. Rerun the installer

From the project that contains the `_bmad` directory, run:

```bash
npx bmad-method install
```

### 2. Choose the detected path

The installer detects the existing installation and offers the update or
modification paths that apply to it. Choose an update to refresh the existing
setup, or choose modification when you need to change modules, tools, or
configuration. Follow any additional prompts the installer displays.

### 3. Verify the updated integration

Review the success summary, reopen your AI coding tool if needed, and invoke
`bmad-help` again.

## Install the prerelease

To install prerelease core and BMM and apply prerelease selection to external
modules chosen in that run, use:

```bash
npx bmad-method@next install
```

To update a prerelease installation, rerun the same command. Prerelease builds
change more frequently and can include unfinished changes, so use the stable
command for ordinary project work.

## Headless CI installs

For a typical fresh headless install of BMM configured for Claude Code, run:

```bash
npx bmad-method install --yes --modules bmm --tools claude-code
```

Use `npx bmad-method install --help` to see the current automation flags and
`npx bmad-method install --list-tools` to find valid tool IDs. If your
automation uses `@next` or an explicit package version, use that same tag or
version when checking the help and running the installer.

## What You Get

BMad's skills are installed in the skill directories used by each AI tool you
selected. The project's `_bmad` directory contains shared configuration and
supporting scripts used by those skills. When installation finishes, the
installer reports the configured tools and any warnings that still need
attention.
