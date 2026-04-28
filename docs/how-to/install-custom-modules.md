---
title: 'Install Custom and Community Modules'
description: Install third-party modules from the community registry, Git repositories, or local paths
sidebar:
  order: 3
---

Use the BMad installer to add modules from the community registry, third-party Git repositories, or local file paths.

## When to Use This

- Installing a community-contributed module from the BMad registry
- Installing a module from a third-party Git repository (GitHub, GitLab, Bitbucket, self-hosted)
- Testing a module you are developing locally with BMad Builder
- Installing modules from a private or self-hosted Git server

:::note[Prerequisites]
Requires [Node.js](https://nodejs.org) v20+ and `npx` (included with npm). Custom and community modules can be selected during a fresh install or added to an existing installation.
:::

## Community Modules

Community modules are curated in the [BMad plugins marketplace](https://github.com/bmad-code-org/bmad-plugins-marketplace). They are organized by category and are pinned to an approved commit for safety.

### 1. Run the Installer

```bash
npx bmad-method install
```

### 2. Browse the Community Catalog

After selecting official modules, the installer asks:

```
Would you like to browse community modules?
```

Select **Yes** to enter the catalog browser. You can:

- Browse by category
- View featured modules
- View all available modules
- Search by keyword

### 3. Select Modules

Pick modules from any category. The installer shows descriptions, versions, and trust tiers. Already-installed modules are pre-checked for update.

### 4. Continue with Installation

After selecting community modules, the installer proceeds to custom sources, then tool/IDE configuration and the rest of the install flow.

## Custom Sources (Git URLs and Local Paths)

Custom modules can come from any Git repository or a local directory on your machine. The installer resolves the source, analyzes the module structure, and installs it alongside your other modules.

### Interactive Installation

During installation, after the community module step, the installer asks:

```
Would you like to install from a custom source (Git URL or local path)?
```

Select **Yes**, then provide a source:

| Input Type            | Example                                           |
| --------------------- | ------------------------------------------------- |
| HTTPS URL (any host)  | `https://github.com/org/repo`                     |
| HTTP URL (any host)   | `http://host/org/repo`                    |
| HTTPS URL with subdir | `https://github.com/org/repo/tree/main/my-module` |
| SSH URL               | `git@github.com:org/repo.git`                     |
| Local path            | `/Users/me/projects/my-module`                    |
| Local path with tilde | `~/projects/my-module`                            |

The installer clones the repository (for URLs) or reads directly from disk (for local paths), then presents the discovered modules for selection.

### Non-Interactive Installation

Use the `--custom-source` flag to install custom modules from the command line:

```bash
npx bmad-method install \
  --directory . \
  --custom-source /path/to/my-module \
  --tools claude-code \
  --yes
```

When `--custom-source` is provided without `--modules`, only core and the custom modules are installed. To include official modules as well, add `--modules`:

```bash
npx bmad-method install \
  --directory . \
  --modules bmm \
  --custom-source https://gitlab.com/myorg/my-module \
  --tools claude-code \
  --yes
```

Multiple sources can be comma-separated:

```bash
--custom-source /path/one,https://github.com/org/repo,/path/two
```

## How Module Discovery Works

The installer uses two modes to find installable modules in a source:

| Mode      | Trigger                                           | Behavior                                                                                     |
| --------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Discovery | Source contains `.claude-plugin/marketplace.json` | Lists all plugins from the manifest; you pick which to install                               |
| Direct    | No marketplace.json found                         | Scans the directory for skills (subdirectories with `SKILL.md`), resolves as a single module |

Discovery mode is typical for published modules. Direct mode is convenient when pointing at a skills directory during local development.

:::note[About `.claude-plugin/`]
The `.claude-plugin/marketplace.json` path is a standard convention adopted across multiple AI tool installers for plugin discoverability. It does not require Claude, does not use Claude APIs, and has no effect on which AI tool you use. Any module with this file can be discovered by any installer that follows the convention.
:::

## Local Development Workflow

If you are building a module with [BMad Builder](https://github.com/bmad-code-org/bmad-builder), you can install it directly from your working directory:

```bash
npx bmad-method install \
  --directory ~/my-project \
  --custom-source ~/my-module-repo/skills \
  --tools claude-code \
  --yes
```

Local sources are referenced by path, not copied to a cache. When you update your module source and reinstall, the installer picks up the latest changes.

:::caution[Source Removal]
If you delete the local source directory after installation, the installed module files in `_bmad/` are preserved. The module will be skipped during updates until the source path is restored.
:::

## What You Get

After installation, custom modules appear in `_bmad/` alongside official modules:

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

The manifest records the source of each custom module (`repoUrl` for Git sources, `localPath` for local sources) so that quick updates can locate the source again.

## Updating Custom Modules

Custom modules participate in the normal update flow:

- **Quick update** (`--action quick-update`): Refreshes all modules from their original sources. Git-based modules are re-fetched; local modules are re-read from their source path.
- **Full update**: Re-runs module selection so you can add or remove custom modules.

## Creating Your Own Modules

Use [BMad Builder](https://github.com/bmad-code-org/bmad-builder) to create modules that others can install:

1. Run `bmad-module-builder` to scaffold your module structure
2. Add skills, agents, and workflows with the various bmad builder tools
3. Publish to a Git repository or share the folder collection
4. Others install with `--custom-source <your-repo-url>`

For modules to support discovery mode, include a `.claude-plugin/marketplace.json` in your repository root (this is a cross-tool convention, not Claude-specific). See the [BMad Builder documentation](https://github.com/bmad-code-org/bmad-builder) for the marketplace.json format.

:::tip[Testing Locally First]
During development, install your module with a local path to iterate quickly before publishing to a Git repository.
:::
