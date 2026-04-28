---
title: 'How to Install BMad'
description: Install, update, and pin BMad for local development, teams, and CI
sidebar:
  order: 1
---

Use `npx bmad-method install` to set up BMad in your project. One command handles first installs, upgrades, channel switching, and scripted CI runs. This page covers all of it.

## When to Use This

- Starting a new project with BMad
- Adding or removing modules on an existing install
- Switching a module to main-HEAD or pinning to a specific release
- Scripting installs for CI pipelines, Dockerfiles, or enterprise rollouts

:::note[Prerequisites]

- **Node.js** 20+ (the installer requires it)
- **Git** (for cloning external modules)
- **An AI tool** such as Claude Code or Cursor (run `npx bmad-method install --list-tools` to see all supported tools)

:::

## First-time install (the fast path)

```bash
npx bmad-method install
```

The interactive flow asks you five things:

1. Installation directory (defaults to the current working directory)
2. Which modules to install (checkboxes for core, bmm, bmb, cis, gds, tea)
3. **"Ready to install (all stable)?"** — Yes accepts the latest released tag for every external module
4. Which AI tools/IDEs to integrate with (claude-code, cursor, and others)
5. Per-module config (name, language, output folder)

Accept the defaults and you land on the latest stable release of every module, configured for your chosen tool.

:::tip[Just want the newest prerelease?]

```bash
npx bmad-method@next install
```

Runs the prerelease installer, which ships a newer snapshot of core and bmm. More churn, fewer delays between development and release.
:::

## Picking a specific version

Two independent axes control what ends up on disk.

### Axis 1: external module channels

Every external module — bmb, cis, gds, tea, and any community module — installs on one of three channels:

| Channel            | What gets installed                                                          | Who picks this                          |
| ------------------ | ---------------------------------------------------------------------------- | --------------------------------------- |
| `stable` (default) | Highest released semver tag. Prereleases like `v2.0.0-alpha.1` are excluded. | Most users                              |
| `next`             | Main branch HEAD at install time                                             | Contributors, early adopters            |
| `pinned`           | A specific tag you name                                                      | Enterprise installs, CI reproducibility |

Channels are per-module. You can run bmb on `next` while leaving cis on `stable` — the flags below let you mix freely.

### Axis 2: installer binary version

The `bmad-method` npm package itself has two dist-tags:

| Command                               | What you get                                                      |
| ------------------------------------- | ----------------------------------------------------------------- |
| `npx bmad-method install` (`@latest`) | Latest stable installer release                                   |
| `npx bmad-method@next install`        | Latest prerelease installer, auto-published on every push to main |

**The installer binary determines your core and bmm versions.** Those two modules ship bundled inside the installer package rather than being cloned from separate repos.

### Why core and bmm don't have their own channel

They're stapled to the installer binary you ran:

- `npx bmad-method install` → latest stable core and bmm
- `npx bmad-method@next install` → prerelease core and bmm
- `node /path/to/local-checkout/tools/installer/bmad-cli.js install` → whatever your local checkout has

`--pin bmm=v6.3.0` and `--next=bmm` are silently ineffective against bundled modules, and the installer warns you when you try. A future release extracts bmm from the installer package; once that ships, bmm gets a proper channel selector like bmb has today.

## Updating an existing install

Running `npx bmad-method install` in a directory that already contains `_bmad/` gives you a menu:

| Choice             | What it does                                                                                                                                                |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Quick Update**   | Re-runs the install with your existing settings. Refreshes files, applies patches and minor stable upgrades, refuses major upgrades. Fast, non-interactive. |
| **Modify Install** | Full interactive flow. Add or remove modules, reconfigure settings, optionally review and switch channels for existing modules.                             |

### Upgrade prompts

When Modify detects a newer stable tag for a module you've installed on `stable`, it classifies the diff and prompts accordingly:

| Upgrade type | Example         | Default |
| ------------ | --------------- | ------- |
| Patch        | v1.7.0 → v1.7.1 | Y       |
| Minor        | v1.7.0 → v1.8.0 | Y       |
| Major        | v1.7.0 → v2.0.0 | **N**   |

Major defaults to N because breaking changes frequently surface as "instability" when they weren't expected. The prompt includes a GitHub release-notes URL so you can read what changed before accepting.

Under `--yes`, patch and minor upgrades apply automatically. Majors stay frozen — pass `--pin <code>=<new-tag>` to accept non-interactively.

### Switching a module's channel

**Interactively:** choose Modify → answer **Yes** to "Review channel assignments?" → each external module offers Keep, Switch to stable, Switch to next, or Pin to a tag.

**Via flags:** the recipes in the next section cover the common cases.

## Headless CI installs

### Flag reference

| Flag                                                                                       | Purpose                                                                            |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `--yes`, `-y`                                                                              | Skip all prompts; accept flag values + defaults                                    |
| `--directory <path>`                                                                       | Install into this directory (default: current working dir)                         |
| `--modules <a,b,c>`                                                                        | Exact module set. Core is auto-added. Not a delta — list everything you want kept. |
| `--tools <a,b>`                                                                            | IDE/tool selection. Required for fresh `--yes` installs. Run `--list-tools` for valid IDs. |
| `--list-tools`                                                                             | Print all supported tool/IDE IDs (with target directories) and exit.               |
| `--action <type>`                                                                          | `install`, `update`, or `quick-update`. Defaults based on existing install state.  |
| `--custom-source <urls>`                                                                   | Install custom modules from Git URLs or local paths                                |
| `--channel <stable\|next>`                                                                 | Apply to all externals (aliased as `--all-stable` / `--all-next`)                  |
| `--all-stable`                                                                             | Alias for `--channel=stable`                                                       |
| `--all-next`                                                                               | Alias for `--channel=next`                                                         |
| `--next=<code>`                                                                            | Put one module on next. Repeatable.                                                |
| `--pin <code>=<tag>`                                                                       | Pin one module to a specific tag. Repeatable.                                      |
| `--user-name`, `--communication-language`, `--document-output-language`, `--output-folder` | Override per-user config defaults                                                  |

Precedence when flags overlap: `--pin` beats `--next=` beats `--channel` / `--all-*` beats the registry default (`stable`).

:::note[Example resolution]
`--all-next --pin cis=v0.2.0` puts bmb, gds, and tea on next while pinning cis to v0.2.0.
:::

### Recipes

**Default install — latest stable for everything:**

```bash
npx bmad-method install --yes --modules bmm,bmb,cis --tools claude-code
```

**Enterprise pin — reproducible byte-for-byte:**

```bash
npx bmad-method install --yes \
  --modules bmm,bmb,cis \
  --pin bmb=v1.7.0 --pin cis=v0.2.0 \
  --tools claude-code
```

**Bleeding edge — externals on main HEAD:**

```bash
npx bmad-method install --yes --modules bmm,bmb --all-next --tools claude-code
```

**Add a module to an existing install** (keep everything else):

```bash
npx bmad-method install --yes --action update \
  --modules bmm,bmb,gds
```

`--tools` is omitted intentionally — `--action update` reuses the tools configured during the first install.

**Mix channels — bmb on next, gds on stable:**

```bash
npx bmad-method install --yes --action update \
  --modules bmm,bmb,cis,gds \
  --next=bmb
```

:::caution[Rate limit on shared IPs]
Anonymous GitHub API calls are capped at 60/hour per IP. A single install hits the API once per external module to resolve the stable tag. Offices behind NAT, CI runner pools, and VPNs can collectively exhaust this.

Set `GITHUB_TOKEN=<personal access token>` in the environment to raise the limit to 5000/hour per account. Any public-repo-read PAT works; no scopes are required.
:::

## What got installed

After any install, `_bmad/_config/manifest.yaml` records exactly what's on disk:

```yaml
modules:
  - name: bmb
    version: v1.7.0 # the tag, or "main" for next
    channel: stable # stable | next | pinned
    sha: 86033fc9aeae2ca6d52c7cdb675c1f4bf17fc1c1
    source: external
    repoUrl: https://github.com/bmad-code-org/bmad-builder
```

The `sha` field is written for git-backed modules (external, community, and URL-based custom). Bundled modules (core, bmm) and local-path custom modules don't have one — their code travels with the installer binary or your filesystem, not a cloneable ref.

For cross-machine reproducibility, don't rely on rerunning the same `--modules` command. Stable-channel installs resolve to the highest released tag **at install time**, so a later rerun lands on whatever has been released since. Convert the recorded tags from `manifest.yaml` into explicit `--pin` flags on the target machine, e.g.:

```bash
npx bmad-method install --yes --modules bmb,cis \
  --pin bmb=v1.7.0 --pin cis=v0.4.2 --tools claude-code
```

## Troubleshooting

### "Could not resolve stable tag" or "API rate limit exceeded"

You've hit GitHub's 60/hr anonymous limit. Set `GITHUB_TOKEN` and retry. If you already have a token set, it may be expired or rate-limited on its own budget — try a different token or wait for the hourly reset.

### "Tag 'vX.Y.Z' not found"

The tag you passed to `--pin` doesn't exist in the module's repo. Check the repo's releases page on GitHub for valid tags.

### A pinned install keeps upgrading

Pinned installs don't upgrade. Quick-update applies patches and minors on stable channel only; it won't touch `pinned` or `next`. If a pinned install changed, open `_bmad/_config/manifest.yaml` — `channel: pinned` plus a fixed `version` and `sha` should hold across runs unless you explicitly override via flags.

### `--pin bmm=X` didn't do anything

bmm is a bundled module — `--pin` and `--next=` don't apply. Use `npx bmad-method@next install` for a prerelease core/bmm, or check out the bmad-bmm repo and run the installer locally to get unreleased changes.
