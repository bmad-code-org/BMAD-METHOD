---
title: Change an Existing Codebase
description: 'Scenario: code that works but has no written decisions. Give agents a project context, learn the code you will change, make one small change first, then take the route the larger work needs.'
sidebar:
  order: 5
---

Use this route when you inherit working code whose design decisions were never written down. You do not need to document the whole repository first, because `bmad-build` inspects the live code on every run and matches the patterns it finds. Start with a small change and add heavier planning only when the scope calls for it.

This illustrative scenario uses a two-year-old version of the [room booker](../start/how-bmad-works.md#the-example-app) (using a TypeScript path below; the hands-on tutorial linked at the bottom uses a Python version). The original author has left, nobody remembers how bookings expire when no one shows up, and the next feature is door check-in.

![Change an Existing Codebase: give agents a project context, learn the code if nobody knows it, make a small change with bmad-build first, then take the route the larger change needs](/diagrams/scenario-existing-codebase.svg)

## Steps

1. Give agents a project context (recommended): a short, verified block in `AGENTS.md` listing how to run tests, where key files live, and what must not change. It adopts an existing `AGENTS.md` or `CLAUDE.md` if your repo already has one. See [Start in an Existing Codebase](../existing-codebases/start-in-an-existing-codebase.md).

   ```text wrap
   /bmad-project-context
   ```

   If an inherited repository keeps confusing AI coding tools with noisy comments, dead code, or inconsistent conventions, you can also ask [Winston, the System Architect](../agents/winston-architect.md) (`bmad-agent-architect`), to run an agent-readiness assessment and flag concrete cleanup priorities.

2. Learn the specific area you plan to change if nobody knows it. `bmad-walkthrough` walks you through an unfamiliar file or directory block by block at your own pace:

   ```text wrap
   /bmad-walkthrough src/bookings/expiry.ts
   ```

   When you need a written factual reference before planning, run `bmad-deep-recon` against your repository. It produces a cited account of how the code works and why, without making recommendations so design decisions stay with you. Ask factual questions, and add any follow-up questions when it presents its research plan:

   ```text wrap
   /bmad-deep-recon before we add check-in, how do bookings end today, and what depends on that?
   ```

   ```text wrap
   Where does the booking expiry timer run today, and what depends on it?
   ```

   Pass that cited report to Sofia when she writes the initiative so your tickets cite verified codebase facts; standalone builds also read it from your planning folder.

3. Make one small, self-contained change first to see how `bmad-build` adapts to the repository. Adding a characterization test that pins current behavior is a safe first run before a larger feature modifies that path:

   ```text wrap
   /bmad-build add a test that pins how a booking ends today when nobody shows up
   ```

4. Take the route the next feature calls for. Because check-in spans multiple connected stories and shared decisions, continue with [Build from a Conversation](./build-from-a-conversation.md) or [Plan a Feature as a Team](./plan-a-feature-as-a-team.md), or stay on [Make a Small Change](./make-a-small-change.md) if the next task is another standalone change.

## What You Have at the End

You finish with a verified project context in `AGENTS.md` that every future session reads, a cited factual account of the code you are changing, and one tested small change built in the repository's own style.

## How a Build Treats Existing Code

`bmad-build` inspects your codebase first, identifies existing helpers to reuse and constraints to preserve, and follows local conventions. When you intentionally want to break an established pattern, state that in your prompt and record the reason in the ticket so later sessions adopt the new rule. [Build Follows What It Finds](../existing-codebases/start-in-an-existing-codebase.md#build-follows-what-it-finds) explains this in more detail.

When Sofia slices an epic in an existing repository, she checks the live code to see where boundaries and shared files sit. Whenever the actual codebase contradicts a written requirement, she flags a **source conflict** (a noted mismatch between what the code does and what the requirement assumed) and proposes a correction for you to approve before coding starts.

To practice this workflow hands-on against a working Python room booker app, follow [Walk Through an Existing Codebase](../start/walk-through-an-existing-codebase.md). New to BMad? Start with [Install BMad](../start/install-bmad.md).
