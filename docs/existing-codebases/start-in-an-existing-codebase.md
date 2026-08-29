---
title: 'Start in an Existing Codebase'
description: Start BMad work in a repository that already exists — what to prepare, how much planning the change needs, and how Build treats your conventions.
sidebar:
  order: 1
---

You have an existing project and a stream of change requests coming
in — bugs, tickets, new features. Most of the knowledge about this
application is already encoded in its source. Modern agents are
trained very well to get knowledge from code. Feeding them textual
descriptions of things they can already read there creates
contradiction, ambiguity, and context-window bloat. That, oddly
enough, includes the original greenfield context (PRD etc). Keep it
archived for the few sessions that need it, and out of reach of an
ordinary change — an agent doing a small request should not even be
able to find it by accident.

For a small change, use `[bmad-build](../build/build-a-change.md)`.
For one that needs several coding sessions, run `bmad-spec`, then a
Build for each piece, then
optionally `bmad-retrospective`. If it is bigger than that, treat it as a project and follow [Choose a Planning Path](../plan/choose-a-planning-path.md).

Too little planning costs one Build run: Build looks at the code
first, and stops to ask when it cannot settle the intent. Too much
planning costs documents nobody reads. When unsure, ask `bmad-help`
rather than deciding alone. It inspects the project and answers
questions like "I have an existing Rails app, where should I start?"
It also runs at the end of every workflow to say what comes next.

Often, the codebase is all you need, but supplementing it with a
tight project context in `AGENTS.md` and companion files really
helps.

## Prepare Project Context, or Skip It

`bmad-project-context` writes a small verified block of agent instructions
into your repo's `AGENTS.md`. See
[Set and Maintain Project Context](./set-and-maintain-project-context.md) for
how to run it. (The earlier `bmad-document-project` workflow is deprecated)

Run it when those instructions are missing, stale, or you are not sure they
are any good. Skip it when the repo already has an `AGENTS.md`, `CLAUDE.md`,
or editor rules someone keeps current, or when agents already have another
discovery tool to build on.

Skipping it does not fail a Build. The cost is the same mistake every session
until someone writes it down. You can run it later, including a refresh or
audit partway through a project.

## Plan Around What Already Exists

When a change needs a PRD, make the agent find and read the existing project
documentation before it writes requirements. If the PRD cites nothing the
repository already does, expect to rework the design once Build meets the
real code.

UX work is optional. Run it when this change adds or alters screens, flows, or
patterns. Skip it for simple updates to screens you are happy with. Running it
with nothing to design wastes a pass; skipping it when new patterns are needed
produces inconsistent screens, one story at a time.

Architecture work needs the architect to use the documented architecture files
and scan the existing codebase. If the proposed decisions do not name what the
code already does, expect a reinvented component or a choice that conflicts
with the current architecture, found during implementation.
[Design UX and Architecture](../plan/design-ux-and-architecture.md) covers
both when the change calls for them.

## Build Follows What It Finds

You do not inventory conventions beforehand. `bmad-build` investigates the
repository, writes down what to reuse and what not to change, and follows
that. It does not stop to ask whether to match the current codebase.

If you want this change to break a pattern, say so in the request, and
write why in the spec so later sessions follow the new rule. If you
dislike a pattern but have no plan to change it, say nothing — it will
match the code. Hoping it modernizes on its own continues the pattern.
Changing one file and leaving the rest leaves two standards with no
record of which one wins.

## Try It on a Known Tree First

[Getting Deeper](./getting-deeper.md) is optional. It walks through one
bounded Build in a specific Django checkout, then a spec-backed epic of three
stories, so you can see both paths before touching your own repository.
