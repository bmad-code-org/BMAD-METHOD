---
title: 'Add Modules'
description: Choose an official module, install a module from a Git URL or local path, understand how the installer finds modules, keep them updated, and know where to build your own.
sidebar:
  order: 3
---

BMad extends through modules. Official modules are selected during
`npx bmad-method install` and add agents, workflows, and tasks for a domain
beyond the built-in core and BMM (Agile suite). Custom and community
modules come from any Git repository or local directory and install through
the same installer. Pick an official module first; if you need something
the official set does not cover, install it from a custom source.

## Official modules

Run `npx bmad-method install` and select the modules you want. The installer
downloads, configures, and installs them into your IDE. Each module's own
documentation describes its workflows.

### BMad Builder

Create custom agents, workflows, and domain-specific modules.

- **Code:** `bmb`
- **npm:** [`bmad-builder`](https://www.npmjs.com/package/bmad-builder)
- **GitHub:** [bmad-code-org/bmad-builder](https://github.com/bmad-code-org/bmad-builder)

**Provides:**

- Agent Builder -- create agents with custom expertise and tools
- Workflow Builder -- design workflows with steps and decision points
- Module Builder -- package agents and workflows into modules others can install
- Interactive setup with YAML configuration and npm publishing support

### Creative Intelligence Suite

Agents and frameworks for brainstorming, design thinking, and early
problem-solving.

- **Code:** `cis`
- **npm:** [`bmad-creative-intelligence-suite`](https://www.npmjs.com/package/bmad-creative-intelligence-suite)
- **GitHub:** [bmad-code-org/bmad-module-creative-intelligence-suite](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite)

**Provides:**

- Innovation Strategist, Design Thinking Coach, and Brainstorming Coach agents
- Problem Solver and Creative Problem Solver for systematic and lateral thinking
- Storyteller and Presentation Master for narratives and pitches
- Ideation frameworks including SCAMPER, Reverse Brainstorming, and problem reframing

### Game Dev Studio

Game development workflows for Unity, Unreal, Godot, and custom engines,
from a prototype through to a planned production. Implementation uses
Build.

- **Code:** `gds`
- **npm:** [`bmad-game-dev-studio`](https://www.npmjs.com/package/bmad-game-dev-studio)
- **GitHub:** [bmad-code-org/bmad-module-game-dev-studio](https://github.com/bmad-code-org/bmad-module-game-dev-studio)

**Provides:**

- Game Design Document (GDD) generation workflow
- Game-aware planning and context that feed the standard Build implementation loop
- Narrative design support for characters, dialogue, and world-building
- Coverage for 21+ game types with engine-specific architecture guidance

### Test Architect (TEA)

Test strategy, automation guidance, and release-gate decisions through an
agent and nine workflows. Compared with the built-in QA skill, TEA adds
risk-based prioritization and requirements traceability. See
[Test Completed Work](../build/test-completed-work.md) to choose between
them.

- **Code:** `tea`
- **npm:** [`bmad-method-test-architecture-enterprise`](https://www.npmjs.com/package/bmad-method-test-architecture-enterprise)
- **GitHub:** [bmad-code-org/bmad-method-test-architecture-enterprise](https://github.com/bmad-code-org/bmad-method-test-architecture-enterprise)

**Provides:**

- Murat agent (Master Test Architect and Quality Advisor)
- Workflows for test design, ATDD, automation, test review, and traceability
- NFR assessment, CI setup, and framework scaffolding
- P0-P3 prioritization with optional Playwright Utils and MCP integrations

## Install from a custom source

A custom module is any module the installer reads from a Git repository or
a local directory instead of the official list. Community modules install
the same way; the
[bmad-plugins-marketplace](https://github.com/bmad-code-org/bmad-plugins-marketplace)
repository is where to find their URLs.

:::note[Prerequisites]
Requires [Node.js](https://nodejs.org) v20.12+ and `npx` (included with
npm), plus Git for Git URL sources. Custom modules can be selected during a fresh install or added to an
existing installation.
:::

### Interactive installation

Run `npx bmad-method install`. After the official module selection, the
installer asks:

:::note[Installer prompt]
Do you want to install custom or community modules (Git URL or local path)?
:::

Answer yes and enter a source. For a URL source the installer warns
**UNVERIFIED MODULE: This module has not been reviewed by the BMad team.
Only install modules from sources you trust.** For a local path it notes
that changes take effect on reinstall. It then lists the modules it
found so you can pick which to install; modules that are already installed
are pre-checked as updates. You can add another source before the install
continues.

| Input type            | Example                                           |
| --------------------- | ------------------------------------------------- |
| HTTPS URL (any host)  | `https://github.com/org/repo`                     |
| HTTP URL (any host)   | `http://host/org/repo`                            |
| HTTPS URL with subdir | `https://github.com/org/repo/tree/main/my-module` |
| SSH URL               | `git@github.com:org/repo.git`                     |
| URL with `@ref`       | `https://github.com/org/repo@v1.2.0`              |
| Local path            | `/Users/me/projects/my-module`                    |
| Local path with tilde | `~/projects/my-module`                            |

### Non-interactive installation

Use the `--custom-source` flag to install from the command line. Every
module discovered in the source is installed.

```bash
npx bmad-method install \
  --directory . \
  --custom-source /path/to/my-module \
  --tools claude-code \
  --yes
```

`--custom-source` without `--modules` installs only core and the custom
modules. To include official modules as well, add `--modules`:

```bash
npx bmad-method install \
  --directory . \
  --modules bmm \
  --custom-source https://gitlab.com/myorg/my-module \
  --tools claude-code \
  --yes
```

Multiple sources can be comma-separated. A source that cannot be resolved
is reported and skipped; the remaining sources still install.

```bash
--custom-source /path/one,https://github.com/org/repo,/path/two
```

## How the installer finds modules

The installer uses one of two modes, chosen by what the source contains:

| Mode      | Trigger                                           | Behavior                                                                                     |
| --------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Discovery | Source contains `.claude-plugin/marketplace.json` | Lists all plugins from the manifest; you pick which to install                               |
| Direct    | No `marketplace.json` found                       | Scans the directory for skills (subdirectories with `SKILL.md`), resolves as a single module |

Discovery mode is typical for published modules. Direct mode is convenient
when pointing at a skills directory during local development.

:::note[About `.claude-plugin/`]
`.claude-plugin/marketplace.json` is a shared installer convention. It
does not require Claude or Claude APIs, and it does not change which AI
tool you use.
:::

## Develop a module locally

If you are building a module with
[BMad Builder](https://github.com/bmad-code-org/bmad-builder), install it
directly from your working directory:

```bash
npx bmad-method install \
  --directory ~/my-project \
  --custom-source ~/my-module-repo/skills \
  --tools claude-code \
  --yes
```

Local sources are referenced by path, not copied to a cache. When you change
your module source and reinstall, the installer picks up the latest changes.

:::caution[Source removal]
If you delete the local source directory after installation, the installed
module files in `_bmad/` are preserved. The module is skipped during updates
until the source path is restored.
:::

## What you get

After installation, custom modules appear in `_bmad/` alongside official
modules:

```
your-project/
├── _bmad/
│   ├── core/              # Built-in core module
│   ├── bmm/               # Official module (if selected)
│   ├── my-module/         # Your custom module
│   │   ├── my-skill/
│   │   │   └── SKILL.md
│   │   └── module-help.csv
│   └── _config/
│       └── manifest.yaml  # Tracks all modules, versions, and sources
└── ...
```

The manifest records the source of each custom module (`repoUrl` for Git
sources, `localPath` for local sources) so that updates can locate the
source again.

## Update modules

Custom modules participate in the normal update flow:

- **Quick update** (`--action quick-update`): Refreshes installed modules
  from their recorded sources. A module whose source is no longer available
  is skipped with a warning; its files stay in place. A Git source that
  cannot be reached is not refreshed; the cached clone is used with a
  warning.
- **Full update** (`--action update`): Re-runs module selection so you can
  add or remove custom modules. With `--yes` and no `--action`, passing
  `--custom-source` defaults to a full update instead of a quick update.

## Create your own module

Use [BMad Builder](https://github.com/bmad-code-org/bmad-builder) to create
modules that others can install:

1. Run `bmad-module-builder` to scaffold your module structure
2. Add skills, agents, and workflows with the BMad Builder tools
3. Publish to a Git repository or share the folder
4. Others install with `--custom-source <your-repo-url>`

For modules to support discovery mode, include a
`.claude-plugin/marketplace.json` in your repository root. See the
[BMad Builder documentation](https://github.com/bmad-code-org/bmad-builder)
for the `marketplace.json` format.

:::tip[Test locally first]
During development, install your module with a local path to iterate quickly
before publishing to a Git repository.
:::
