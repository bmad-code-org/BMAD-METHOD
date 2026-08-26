---
title: 'Manage Project Context'
description: Set up and maintain your repository's agent instructions with bmad-project-context
sidebar:
  order: 7
---

Use `bmad-project-context` to set up a repository so AI agents work well in it — for a new project or an existing codebase, with or without a BMad install. The output is a small verified block in your `AGENTS.md`.

:::note[Prerequisites]

- BMad Method installed — or nothing at all: the skill also runs standalone in any repo
  :::

## When to use this

- You're starting AI-assisted work in an existing codebase (this is the brownfield on-ramp)
- You already hand-wrote an `AGENTS.md` or `CLAUDE.md` and want it adopted and improved rather than replaced
- You're starting a new project and want your standards followed from the first commit
- You have governance, security or style rules that agents need to respect
- Agents keep making the same mistake and you want it written down
- Your instructions feel stale or bloated — run an audit

## Step 1: Run it

```bash
bmad-project-context
```

Say what you want in plain language — "set up AGENTS.md", "adopt the AGENTS.md we already have", "refresh the context", "audit our context", "the agent keeps using the wrong test runner" — and the skill routes itself. If the repo already has instructions this skill never wrote, it adopts them; if the skill wrote them before, it updates them; setup is only for a repo with no instructions worth keeping.

Point it at a repo if you're not already in one. If the path resolves to more than one working tree, it asks which before writing anything.

## Step 2: Tell it what you bring

The first thing it does is read what's already there — `AGENTS.md`, `CLAUDE.md`, editor rule files, docs — and report back what's good, what looks stale, and what it suggests changing. A hand-written file is something it improves, never something it discards: before anything is written, you see what happens to every instruction you already have, and nothing is deleted without your sign-off.

Then it asks what rules you want followed regardless of what the repo does: governance, security and compliance requirements, coding standards, style guides, frozen areas. Bring outside documents too — org handbooks, wiki exports, an MCP knowledgebase.

For a greenfield project that conversation is the whole content. For a working codebase it's the half no scan can reach.

## Step 3: It verifies the rest

It checks every path a line names, and reads your `package.json`, `Makefile` and CI config — not to transcribe the scripts, since an agent reads those directly, but to know what they already answer so the block adds only the right commands to use, the corrections, and the caveats.

Then it asks what no scan could answer: what agents keep getting wrong here, what's off limits, what a domain term means, and which commands come with a catch.

## Step 4: Approve the block

You see the complete block before anything is written. Nothing lands without that. On approval it's spliced between the `<!-- bmad:context -->` markers, and everything you wrote outside them is preserved byte for byte.

It never commits. Changes stay in your working tree for you to review.

At the end it tells you what went in, what was left out and why, and the reasoning behind both.

## Keeping it healthy

- **Refresh** after real change — re-checks that the caveats still hold, diffs deletions and renames since the recorded commit, updates what moved, and never re-asks what you already settled
- **Record** the moment an agent gets something wrong — that's the only admissible source for a pitfall
- **Audit** on demand — re-verifies everything and prunes; the block ends smaller or equal, never larger

A rule stays until the thing it guards is gone or you retire it. Nothing broke lately is never a reason to delete one — a working rule erases its own evidence.

## Repo or home directory

What this writes belongs committed to the repo, shared by the team. If the same rules keep repeating across all your projects, or they're your personal preferences, put those in your agent's global configuration in your home directory instead.

## Deprecated predecessors

:::note[Looking for bmad-generate-project-context or bmad-document-project?]
Both are deprecated and forward here — their trigger phrases still work. If you have an existing `project-context.md`, setup offers to absorb its content rather than orphaning it.
:::

## Next steps

- [**Project Context Explanation**](../explanation/project-context.md) — the design and the evidence behind it
- [**Workflow Map**](../reference/workflow-map.md) — where context fits in the method
