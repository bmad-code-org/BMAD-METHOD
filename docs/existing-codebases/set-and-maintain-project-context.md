---
title: 'Set and Maintain Project Context'
description: Set up and maintain your repository's agent instructions with bmad-project-context, including what goes in, what stays out, and how to keep it healthy.
sidebar:
  order: 2
---

Use `bmad-project-context` to set up a repository so AI coding agents work reliably in it. It works for a new project or an existing codebase, with or without a full BMad install. The skill writes a small, verified block of instructions inside your `AGENTS.md`, and you approve every change before anything is saved.

## When to Use This

- You are starting AI-assisted work in an existing codebase.
- You already wrote an `AGENTS.md` or `CLAUDE.md` and want it preserved and improved.
- You are starting a new project and want your team's standards followed from the first commit.
- You have governance, security, or style rules that agents need to respect.
- Agents keep repeating the same mistake, or your current instructions feel stale.

## Step 1: Run It in Your Coding Tool Chat

Open your AI coding tool in your repository and type the skill name in chat (not in your terminal):

```text
bmad-project-context
```

Describe what you want in plain language, such as "set up AGENTS.md", "adopt the AGENTS.md we already have", "refresh the context", "audit our context", or "the agent keeps using the wrong test runner". The skill routes to setup, adopt, refresh, record, or audit based on what it finds and what you ask.

If you are not already inside the repository, pass its path. When a path resolves to multiple working trees or to a tree where you cannot commit, the skill asks before writing.

## Step 2: Share the Rules You Bring

The skill reads what is already in the repository (`AGENTS.md`, `CLAUDE.md`, editor rule files, and docs) and reports what is solid, what looks stale, and what it proposes to change. Any instructions you wrote by hand are treated as a baseline to improve rather than replace: you see where every rule lands, and nothing is deleted without your sign-off.

Next, it asks what rules you want followed regardless of what the code currently does, including governance, security and compliance rules, coding standards, style guides, and frozen paths. You can also bring outside sources such as org handbooks, wiki exports, or an MCP knowledgebase.

For a new project, that conversation supplies the full content. For an existing codebase, it supplies the rules no code scan can detect.

## Step 3: Verify Against the Repository

The skill checks every file path a rule mentions and reads your `package.json`, `Makefile`, `pyproject.toml`, and CI config. It reads those files so it does not duplicate scripts that an agent can read directly; instead, the block records only the right command when several look plausible, along with corrections and caveats.

It then asks only what a scan cannot answer: what agents keep getting wrong, what areas are off limits, what domain terms mean here, and which commands come with a catch.

## Step 4: Approve the Block

You review the full block before anything is written. Once you approve, the skill splices the block between the `<!-- bmad:context -->` and `<!-- /bmad:context -->` markers in `AGENTS.md` at the repository root. If your team uses a tool that reads a different filename, such as `CLAUDE.md`, the skill proposes and verifies a one-line `@AGENTS.md` import so rules are not duplicated. Everything outside those markers stays untouched across future runs.

The skill never commits on its own, leaving changes in your working tree for review. At the end, it summarizes what went in, what stayed out, and why.

## Keep It Healthy

- Refresh the block after meaningful repository changes; the skill re-checks caveats, diffs deleted or renamed files since the last verified commit, updates moved paths, and avoids re-asking settled questions.
- Record a pitfall as soon as an agent makes a real mistake; a rule enters only from observed evidence, while a suspicious scan finding becomes a question rather than an unverified rule.
- Audit the block whenever it feels stale or bloated; the skill re-checks every claim and prunes lines that no longer change behavior, so the block ends the same size or smaller.

A rule stays until the thing it guards is gone, a linter or CI check enforces it automatically, or you explicitly retire it. Seeing no recent failures is not a reason to delete a rule, because a working rule prevents the failures that would prove it is needed.

## What Earns a Line

The block keeps only facts that are expensive to rediscover or that an agent learns only after making a mistake. Repo overviews, directory trees, and tech-stack summaries stay out, because agents read source code more accurately than prose descriptions and summaries go stale quickly. The rules the skill enforces admit six categories of facts that the code alone cannot state:

- Organization policy such as frozen paths, generated files, branch rules, and security or compliance requirements.
- Command caveats that config files do not state, such as which command is the right entry point, whether integration tests need a running service, or whether a full test suite is slow.
- Conventions that differ from typical language or framework defaults, since an agent follows common defaults unless told otherwise.
- Observed pitfalls backed by real mistakes, maintainer experience, recurring fixes in git history, or an error caught during the session.
- Cross-component rules and required tool or runtime versions that an agent cannot see from the single file it is editing.
- Pointers to where specific work belongs and to nested or linked files worth reading before editing a given area.

For the reasoning behind keeping this block small and selective, see [The Theory of Project Context](./theory-of-project-context.md).

## The Intents

| Intent | Use it when |
| --- | --- |
| **Setup** | The repo has no meaningful instructions yet. |
| **Adopt** | You already wrote instructions and want them preserved and improved. |
| **Refresh** | The code changed since the block was last verified. |
| **Record** | An agent just made a mistake worth writing down. |
| **Audit** | The block feels stale or bloated. |

## Where the File Lives

Monorepo packages and nested repositories can have their own `AGENTS.md` under the same rules, listed as pointers in the root file. A large set of directory-specific rules can move into a nested `AGENTS.md` only after verifying that every coding tool your team uses actually loads nested files there. If any tool does not, keep those rules in the root `AGENTS.md` with clear path prefixes.

Commit the file so the whole team shares the same instructions versioned alongside the code. Rules that apply across all of your personal projects belong in your coding tool's global configuration instead.

## Hand-Off to Architecture

For architectural decisions with real tradeoffs and more than one viable design, talk with [Winston, the System Architect](../agents/winston-architect.md) (`bmad-agent-architect`). When `bmad-project-context` encounters an unsettled design tradeoff, it points you to Winston rather than guessing for you. See [Design UX and Architecture](../plan/design-ux-and-architecture.md).

:::note[Migrating from Earlier Skills]
The earlier `bmad-generate-project-context` and `bmad-document-project` skills were removed and replaced by `bmad-project-context`. If your repository still has a `project-context.md` file from `bmad-generate-project-context`, `bmad-project-context` reads it during setup and offers to absorb its useful rules into your `AGENTS.md` block rather than ignoring it.
:::
