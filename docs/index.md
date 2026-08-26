---
title: Build Software with BMad
description: BMad helps you decide what to build and then build it. Start here to install it, make your first change, or find the path that fits the work in front of you.
hero:
  title: 'Turn ideas into software.<br>At any scale.'
  tagline: Think it through, then build it. You make the calls, so you understand what you ship.
  actions:
    - text: Build your first change
      link: ./start/build-your-first-change/
      variant: primary
    - text: Install BMad
      link: ./start/install-bmad/
      variant: secondary
---

BMad adds a set of named commands, called skills, to AI coding tools such as
Claude Code and Cursor. Some of them help you think: explore an idea, research
it, argue against it, and write down what you have settled on. Others help you
build: give `bmad-build` a change you want made, and it writes the code and
reviews it.

You can use either group on its own. Many people run the thinking skills and
never ask BMad to write a line of code, and a small fix can go straight to
building with no planning at all.

## Find Your Starting Point

**You want to see it work.**
[Build Your First Change](./start/build-your-first-change.md) walks through one build in an
empty project.

**You know exactly what needs to change, and it is small.**
Run `bmad-build` and describe the change. See [Quick Fixes](./how-to/quick-fixes.md).

**You are working in an existing codebase.**
Consider running `bmad-project-context`, then build as usual. See
[Established Projects](./how-to/established-projects.md) and
[Manage Project Context](./how-to/project-context.md).

**You are building a larger feature or a whole product.**
If you can give `bmad-spec` a complete intent, start there. If you need to
go through the ideation/planning paces first, choose a path in the
[Workflow Map](./reference/workflow-map.md).

**Your idea is still vague, or you are not sure it is a good one.**
Generate options with [Brainstorming](./explanation/brainstorming.md), gather
evidence with [Deep Recon](./explanation/deep-recon.md), or
[pressure-test the idea](./how-to/pressure-test-an-idea.md).

**You want BMad to follow your team's own rules and practices.**
See [Customize BMad](./how-to/customize-bmad.md) and
[Expand BMad for Your Organization](./how-to/expand-bmad-for-your-org.md).

:::tip[Unsure where to start?]
Run `bmad-help`.
:::
