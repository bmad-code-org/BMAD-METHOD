---
title: 'Start in an Existing Codebase'
description: Start BMad work in a repository that already exists, including what to prepare, how much planning a change needs, and how Build treats your conventions.
sidebar:
  order: 1
---

When you have an existing repository and incoming change requests (bugs, tickets, or new features), most of the knowledge about your application is already in the source code. Modern coding agents read source code accurately, while prose descriptions of code they can already inspect create contradictions, stale copies, and wasted context. That includes original planning documents from when the app was first built: keep those archived for the few sessions that need them, and out of the default path for ordinary changes.

For a small change, go straight to [bmad-build](../build/build-a-change.md). For a larger change that needs several coding sessions, ask Sofia, the Product Owner (`bmad-agent-po`), to write an epic (a cohesive feature container) with its requirements and break it into ordered stories, then run `bmad-build` on each story. When the epic is finished, run `bmad-retrospective` to verify the combined result against the requirements, and keep the local build plans because they track live status and review history. For multi-feature work, follow [How BMad Works](../start/how-bmad-works.md#size-and-stakes).

Too little planning costs one Build run, because Build reads the code first and stops to ask when intent is unclear. Too much planning produces documents nobody reads. When you are unsure which path fits, ask `bmad` in your chat instead of guessing. It inspects the project, answers questions like "I have an existing Rails app, where should I start?", and suggests next steps at the end of each workflow.

Often the codebase is enough to start, though pairing it with a short, verified block of agent instructions in `AGENTS.md` prevents repeated mistakes across sessions.

:::note[Introducing BMad to an Existing Team]
If you are a product manager or engineering manager rolling BMad out on an established repository, you do not need an upfront documentation pass before engineers start shipping. Begin with a small verified `AGENTS.md` block, run a few bounded changes through `bmad-build`, and add specs or architecture docs only when multi-story work calls for them. When you want a structured look at how well a repository supports AI-assisted delivery (test speed, conventions, modularity, and guardrails), ask [Winston, the System Architect](../agents/winston-architect.md) to run an agent-readiness assessment.
:::

## Prepare Project Context, or Skip It

`bmad-project-context` writes a small, verified block of agent instructions into your repository's `AGENTS.md`. See [Set and Maintain Project Context](./set-and-maintain-project-context.md) for how to run it.

Run it when agent instructions are missing, stale, or untested. Skip it when the repository already has an `AGENTS.md`, `CLAUDE.md`, or editor rule file that your team maintains, or when agents already have reliable project instructions in place.

Skipping it will not break a Build run, although agents may repeat the same repo-specific mistake until someone records the rule. You can run `bmad-project-context` at any point, including a refresh or audit partway through a project.

## Plan Around What Already Exists

When a change needs a PRD (Product Requirements Document), have John (`bmad-agent-pm`) read your existing documentation and code before writing requirements. If a PRD ignores what the repository already does, expect rework once Build meets the real code.

UX design with Sally (`bmad-agent-ux-designer`) is optional. Run it when the change introduces or alters screens, flows, or interaction patterns, and skip it for small tweaks to screens you already like. Running UX with nothing new to design wastes a pass, while skipping it when new patterns are needed leads to inconsistent screens across stories.

Architecture work with [Winston](../agents/winston-architect.md) should build on your existing architecture files and a scan of the live codebase. When proposed decisions do not account for what the code already does, teams end up with duplicate components or conflicting patterns discovered during implementation. See [Design UX and Architecture](../plan/design-ux-and-architecture.md) for how both workflows fit into planning.

## Build Follows What It Finds

You do not need to inventory your team's conventions ahead of time. On every run, `bmad-build` inspects the repository, notes which existing patterns to reuse and which areas not to touch, and follows them without stopping to ask whether to match the codebase.

If you want a change to break an existing pattern, say so in the request and record why in the spec so later sessions follow the new rule. If you dislike a pattern but have no plan to migrate it, leave it unmentioned so Build stays consistent with the surrounding code. Changing one file while leaving the rest untouched creates two competing patterns with no record of which one wins.

## Practice Guides and Walkthroughs

Use the guide that matches how you want to learn:

- Follow [Change an Existing Codebase](../scenarios/change-an-existing-codebase.md) for a concise scenario with copy-and-paste prompts for onboarding, exploration, and your first change.
- Try [Walk Through an Existing Codebase](../start/walk-through-an-existing-codebase.md) for a guided hands-on tutorial in a small room-booking app with no planning docs.
- Try [Getting Deeper](./getting-deeper.md) if you are a developer who wants a deeper walkthrough in a real Django checkout, covering one bounded Build and a three-story epic.
