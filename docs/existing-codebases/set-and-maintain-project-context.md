---
title: 'Set and Maintain Project Context'
description: Set up and maintain your repository's agent instructions with bmad-project-context — what goes in, what stays out, and how to keep it healthy.
sidebar:
  order: 2
---

Use `bmad-project-context` to set up a repository so AI agents work well in
it. It works for a new project or an existing codebase, with or without a BMad
install. The output is a small verified block in your `AGENTS.md`. It asks
before it writes; you approve every change.

## When to Use This

- You are starting AI-assisted work in an existing codebase.
- You already wrote an `AGENTS.md` or `CLAUDE.md` and want it kept and
  improved.
- You are starting a new project and want your standards followed from the
  first commit.
- You have governance, security, or style rules that agents need to respect.
- Agents keep making the same mistake, or the instructions feel stale.

## Step 1: Run It

```bash
bmad-project-context
```

Say what you want in plain language — "set up AGENTS.md", "adopt the AGENTS.md
we already have", "refresh the context", "audit our context", "the agent keeps
using the wrong test runner" — and the skill routes to setup, adopt, refresh,
record, or audit.

Point it at a repo if you are not already in one. If that path points to more
than one working tree, it asks which one before writing. If you cannot commit
in that tree, it asks before writing there.

## Step 2: Tell It What You Bring

It reads what is already there — `AGENTS.md`, `CLAUDE.md`, editor rule files,
docs — and reports what is good, what looks stale, and what it wants to
change. A file you wrote is improved, not thrown away: you see what happens to
every instruction, and nothing is deleted without your sign-off.

Then it asks what rules you want followed regardless of what the repo does:
governance, security and compliance, coding standards, style guides, frozen
areas. Bring outside documents too — org handbooks, wiki exports, an MCP
knowledgebase.

For a new project, that conversation is the whole content. For an existing
codebase, it is the part a scan cannot find.

## Step 3: It Verifies the Rest

It checks every path a line names, and reads your `package.json`, `Makefile`,
and CI config — not to copy the scripts, since an agent reads those directly,
but to know what they already answer so the block adds only the right commands
to use, the corrections, and the caveats.

Then it asks what no scan could answer: what agents keep getting wrong here,
what is off limits, what a domain term means, and which commands come with a
catch.

## Step 4: Approve the Block

You see the complete block before anything is written. On approval it is
written between the `<!-- bmad:context -->` and `<!-- /bmad:context -->`
markers in `AGENTS.md` at the repo root. For a tool that reads a different
file, such as Claude Code's `CLAUDE.md`, the skill proposes and verifies a
one-line `@AGENTS.md` import for the tools you use. Everything outside those
markers is left unchanged, and no later run touches it.

It never commits. Changes stay in your working tree for you to review.

At the end it tells you what went in, what was left out, and why.

## Keep It Healthy

- **Refresh** after real change. It re-checks the caveats, diffs deletions
  and renames since the recorded commit, updates what moved, and never re-asks
  what you already settled.
- **Record** the moment an agent gets something wrong. A pitfall goes in only
  when someone has seen the mistake. A scan finding that looks like a trap
  becomes a question, not a line.
- **Audit** on demand. It re-checks and cuts; the block ends smaller or
  equal, never larger.

A rule stays until what it is about is gone, or you retire it. "Nothing broke
lately" is never a reason to delete one — a working rule erases the evidence
that it is still needed.

## What Earns a Line

The block holds only what is expensive to rediscover, or that the agent learns
only after it has already gone wrong. Repo overviews, directory trees, and
tech-stack lists never enter: agents read code better than prose about code,
and the copy goes stale. What earns a line is what the code cannot say:

- **Policy** the org requires — frozen paths, generated files, branch rules,
  security and compliance.
- **What a config file cannot say about running the project** — the catch,
  and which command is the right one to use. `pnpm test` is already in
  `package.json`; that the suite takes eleven minutes, or needs a service
  running first, is not.
- **Conventions that differ from ecosystem defaults**, because an agent
  follows the norm unless told otherwise.
- **Observed pitfalls** — a recorded lesson, the maintainer's recollection, a
  mistake fixed repeatedly in git history, or one the writing session made and
  caught.
- **Cross-component rules and required versions** — rules that must hold
  across parts of the system an agent cannot see from the file it is editing,
  and the tool versions the project actually builds with.
- **Pointers** to where work lands, and to nested or linked files worth
  reading first.

Every rule the skill applies is in its `references/best-practices.md`. It uses
that file to judge what you already have and to explain its reasoning. For why
the block is kept this small, see
[The Theory of Project Context](./theory-of-project-context.md).

## The Intents

| Intent      | Use it when                                                     |
| ----------- | --------------------------------------------------------------- |
| **Setup**   | The repo has no instructions worth preserving.                  |
| **Adopt**   | You already wrote instructions and want them kept and improved. |
| **Refresh** | The code changed since the block was written.                   |
| **Record**  | An agent just made a mistake worth writing down.                |
| **Audit**   | The block feels stale or bloated.                               |

## Where the File Lives

Monorepo components and nested repositories get their own file under the same
rules, listed as pointers in the parent. A large rule set that only applies to
one directory can move into an `AGENTS.md` in that directory — but only after
checking that the tools you use actually read it there. If they do not, the
rules stay in the root file, each naming the directory it applies to.

Commit what the skill writes. The team shares it, and it is versioned with the
code it constrains. Rules that repeat across every project, or that are your
personal preferences, belong in your agent's global configuration instead.

## Hand-Off to Architecture

Make design decisions in `bmad-architecture`. If a decision has real
tradeoffs and more than one viable shape, the skill tells you to run
`bmad-architecture` instead of choosing for you. See
[Design UX and Architecture](../plan/design-ux-and-architecture.md).

## Replaces Two Earlier Skills

:::note[Looking for bmad-generate-project-context or bmad-document-project?]
Both are deprecated and forward here; their trigger phrases still work. If you
have a `project-context.md` from `bmad-generate-project-context`, setup offers
to absorb its content rather than ignore it. `bmad-document-project`
generated repository documentation, which the evidence says not to do.
:::
