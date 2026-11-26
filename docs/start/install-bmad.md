---
title: 'How to Install BMad'
description: Install BMad's skills with the Skills CLI, set up the project runtime, and verify or update it.
---

Install BMad through the Skills CLI, then run `bmad setup` in the project.

## Prerequisites

You need an AI coding tool that supports skills and [uv](https://docs.astral.sh/uv/) for setup and Python scripts. The Skills CLI also needs Node.js, npm, and Git.

## Install the Skills

From your project directory, run:

```bash
npx skills add bmad-code-org/BMAD-METHOD/skills/core-tools --skill '*'
npx skills add bmad-code-org/BMAD-METHOD/skills/method --skill '*'
```

Each module sits in its own folder of the repository, and each command installs one module whole, its record included. `--skill '*'` takes every skill in the folder; the Skills CLI still asks which coding tools to install to. Core tools hold the `bmad` skill for setup and help, so every install needs them. Add Toolsmith (`skills/toolsmith`) or Founder (`skills/founder`) the same way.

To choose skills instead, run `npx skills add bmad-code-org/BMAD-METHOD` and select your coding tool and skills. Include `bmad` for setup and help, and the module records `bmod-core-tools` and `bmod-method` for the modules you use. To install a small set by name:

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

## Set Up and Verify

Open the coding tool from the project folder and ask the `bmad` skill to run `bmad setup`. Setup installs the shared runtime and module scripts under `_bmad/`. Ask for `bmad status` to verify the installation and versions. Documents and tickets go to `_bmad-output`, inside the active initiative's folder when one is set; ask `bmad` to create or switch one.

Setup also asks whether to install the session-start hook. Answer `on` and it writes an entry into each coding tool's own hook file in the project, such as `.claude/settings.json`, so every new session opens with a short note of the BMad skills installed and when to use them; the tool keeps using its other skills. The default is `off`, and answering `off` later removes the entry. Codex runs project hooks only after you trust them in its `/hooks` menu.

Invoke `bmad-build` with the change you want, or ask `bmad` for guidance. For work spanning repositories, set up at the workspace root so skills can reach both the output folder and code repositories.

## Update an Installation

Ask the `bmad` skill to run `bmad setup` again. It checks each module's version and runs `npx skills update` for you when there is a newer one. Then it asks any new config questions, moves your `_bmad/custom/` files when a skill was renamed, and offers to delete skills a module renamed or removed. Last, it checks whether a migration applies and asks whether to run it.

If you update by hand with `npx skills update`, run `bmad setup` afterwards. If `bmad status` reports that it could not check a module for updates, read the reason it gives: when the module's source has moved, run `npx skills update` once, then `bmad setup`. Restart your coding tool when its skill catalog needs refreshing.

If you are coming from an earlier BMad version, `bmad setup` offers to remove what the earlier version left behind and to migrate your planning documents. The earlier version's documentation stays on [its own branch](https://github.com/bmad-code-org/BMAD-METHOD/tree/V6.12).

Skills install to your coding tool's folder in the project by default, or to a per-user folder with `-g`; [Where Skills Live](../reference/skills-and-agents.md#where-skills-live) lists the folders. Setup updates either scope, but it writes `_bmad/` only in the project it runs in, so run `bmad setup` in each project that uses BMad.

### Pin a Release

To stay on one release, add BMad from the repository at its tag, `npx skills add bmad-code-org/BMAD-METHOD#<tag>`, choosing the same skills as before, then run `bmad setup`. `npx skills update` keeps a pinned install on its tag. When a newer release exists, `bmad status` reports `pinned` and gives the command that moves to it, as it does for [modules](../customize/add-modules.md#keep-a-module-updated).

### Start Each Epic in a Fresh Worktree

Builds expect a branch that fits the epic. To give that branch its own folder and a current install, open a git worktree when you pick up an epic, and remove it once the epic is closed:

1. Run `git worktree add -b epic-2 ../room-booker-epic-2`, then open your coding tool in the new folder.
2. Install the skills as above, at your pinned tag if you use one, and run `bmad setup`. Copy your personal `_bmad/custom/*.user.toml` files across, because a new worktree has no gitignored files.
3. Refine, plan, and build the epic there, then run its retrospective and close it.
4. Merge the branch, then run `git worktree remove ../room-booker-epic-2`.

Ticket status is committed with the code, so merge a story another epic waits on as soon as it is done. If your installed skills are committed, commit the fresh install before building, because builds need a clean tree.

## What You Get

Your coding tool discovers the installed skills. The project's `_bmad/` holds shared configuration and supporting scripts. Team and personal customizations live under `_bmad/custom/` and survive setup refreshes.
