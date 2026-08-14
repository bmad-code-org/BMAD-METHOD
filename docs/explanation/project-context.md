---
title: "Project Context"
description: How bmad-project-context writes a repository's agent instructions — a small verified block in AGENTS.md
sidebar:
  order: 10
---

`bmad-project-context` sets up a repository so AI agents work well in it. The output is a small verified block inside the repo's `AGENTS.md`: what the org requires, the commands that were actually run, the conventions where the obvious guess is wrong, and the mistakes agents keep making here.

It is a conversation, not a generator. You bring the rules you want followed — governance, security, coding standards — and it discovers and verifies the rest. The human is in the loop for every write; there is no unattended mode.

For the full reasoning, including what is deliberately *not* captured and why, see [The Theory of Project Context](project-context-theory.md).

## What goes in, and what doesn't

The governing line is what a fact costs to retrieve at the moment it is needed. Agents read code more accurately than they read prose describing code, and a stored description of what they find cheaply is a stale duplicate charged on every call — so repo overviews, directory trees and tech-stack lists never enter. What stays is what an agent rediscovers expensively, or only after the mistake.

What earns a line is what the code cannot say:

- **Policy** the org requires — frozen paths, generated files, branch rules, security and compliance.
- **What a config file cannot say about running the project** — the catch, and which command is the right one to use, not a copy of every script. `pnpm test` is already in `package.json`; that the suite takes eleven minutes, or needs a service running first, is not.
- **Conventions that differ from ecosystem defaults**, because an agent follows the norm unless told otherwise.
- **Known pitfalls**, admitted only from observed failure — a lesson already recorded, the maintainer's recollection, a mistake fixed repeatedly in git history, or one the writing session made and caught. A trap-looking fact from a scan becomes a question, never a line.
- **Cross-component rules and required versions** — the few rules that must hold across parts of the system an agent cannot see from the file it is editing, and the tool versions the project actually builds with.
- **Pointers** to where work lands, and to nested or linked files worth reading first.

Every rule the skill applies is written out in `references/best-practices.md`, with the evidence behind it. The skill uses it to assess what your repo already has, and explains its reasoning back to you at the end.

## The intents

| Intent | What it does |
|--------|--------------|
| **Setup** | For a repo with no instructions worth preserving. Ask what you bring, discover and verify the rest, show you the block, then write it. |
| **Adopt** | For instructions you already wrote. You see where every one of them went before anything is written; nothing is deleted without your sign-off. |
| **Refresh** | The same run against an existing block: re-run its commands, diff deletions and renames since the recorded commit, update what moved. |
| **Record** | Capture one observed agent mistake at the moment it happens. A recurring or costly one earns a line. |
| **Audit** | Re-verify and prune. The block ends smaller or equal, never larger. |

## How agents load it

`AGENTS.md` at the repo root, which every major coding harness reads. BMad owns only the region between `<!-- bmad:context -->` and `<!-- /bmad:context -->`; everything you write outside those markers is preserved byte for byte, and a refresh never touches it.

Monorepo components and nested repositories get their own file under the same rules, listed as pointers in the parent. A large rule set that only applies to one directory can move into an `AGENTS.md` file in that directory — but only after checking that the tools you use actually read it there. If they don't, the rules stay in the root file, each naming the directory it applies to.

## Repo or home directory

What this skill writes belongs committed to the repository — shared by the team, consistent across machines, versioned with the code it constrains. If you find the same rules repeating across every project, or they are your personal preferences rather than the team's, they belong in your agent's global configuration in your home directory instead.

## Interaction with architecture

Decisions are *born* in `bmad-architecture`. If a genuinely contested design decision surfaces here — real tradeoffs, multiple viable shapes — the skill says it deserves `bmad-architecture` rather than quietly making the call.

## Replaces two earlier skills

:::note[Deprecated: bmad-document-project and bmad-generate-project-context]
Both earlier skills are deprecated and now forward here. `bmad-generate-project-context` produced a single `project-context.md` — if you have one, setup offers to absorb its content rather than orphaning it. `bmad-document-project` scanned a brownfield repo into generated documentation, which is the approach the evidence went against; the deeper "explain this system and its rationale" material is a different altitude and is coming as its own capability.
:::
