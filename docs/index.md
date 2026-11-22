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

![The BMad delivery loop: a vague notion starts at Clarify, a big clear idea at Plan, and a small change at Build and verify; Learn and adjust loops back to Plan](/diagrams/bmad-delivery-loop.svg)

Every path runs the same loop. Bigger work enters it earlier and goes round it
more often; it does not become a different way of delivering.
[How BMad Works](./start/how-bmad-works.md) explains the loop and the ticket
that carries the spec through it.

| You have | Start at |
| --- | --- |
| Nothing yet, and you want to see it work | [Build Your First Change](./start/build-your-first-change.md), one build in an empty project |
| A change one session can build | [Make a Small Change](./scenarios/make-a-small-change.md): run `bmad-build` and describe it |
| A small new app, such as a to-do list | One `bmad-build` run: [Build Your First Change](./start/build-your-first-change.md) |
| A clear idea bigger than one session, and no initiative yet | [Write and Slice the Initiative](./plan/write-and-slice-the-initiative.md): Sofia, the Product Owner (`bmad-agent-po`), sizes it and writes the initiative or epic |
| A decision made in a conversation or a brainstorm, and one person who decides | [Build from a Conversation](./scenarios/build-from-a-conversation.md) |
| A feature several people must agree on | [Plan a Feature as a Team](./scenarios/plan-a-feature-as-a-team.md), with a PRD from John, the Product Manager (`bmad-agent-pm`) |
| A quick prototype that proved an idea | [Turn a Prototype into a Product](./scenarios/turn-a-prototype-into-a-product.md) |
| Code that works but has no written decisions | [Change an Existing Codebase](./scenarios/change-an-existing-codebase.md) |
| Raw notes, a vague idea, or doubts that it is worth building | [Clarify the Idea](./clarify/clarify-the-idea.md) |
| A team with its own rules and practices | [Customize BMad](./customize/customize-bmad.md) and [Adopt BMad Across a Team](./customize/adopt-bmad-across-a-team.md) |

[Pick a Route](./start/how-bmad-works.md#pick-a-route) lists more routes, and
the same page describes [the example app](./start/how-bmad-works.md#the-example-app)
that these pages share.

:::tip[Unsure where to start?]
Run `bmad`. If that is not enough, see
[Get Answers About BMad](./start/get-answers-about-bmad.md).
:::
