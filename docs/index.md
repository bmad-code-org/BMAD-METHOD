---
title: Build Software with BMad
description: BMad helps you decide what to build and then build it. Start here to install it, make your first change, or find the path that fits the work in front of you.
hero:
  title: 'Turn ideas into software. At any scale.'
  tagline: Think it through, then build it. You make the calls, so you understand what you ship.
  actions:
    - text: Meet the BMad Agent
      link: ./start/the-bmad-agent/
      variant: primary
    - text: Install BMad
      link: ./start/install-bmad/
      variant: secondary
---

BMad adds a set of named commands, called skills, to AI coding tools such as Claude Code, Codex, and Cursor. Some skills help you think: explore an idea, research it, challenge its weak spots, and write down what you settle on. Others help you build: give `bmad-build` a change you want made, and it plans, writes, reviews, and commits the code.

## Start with the BMad Agent

Before reading through all the guides, read [The BMad Agent](./start/the-bmad-agent.md). In BMad v7, the BMad Agent (`bmad`) is your central guide inside your coding tool: it keeps BMad up to date, adds and removes modules, answers questions from what you actually have installed, runs or customizes skills on request, and coaches you on using BMad cohesively alongside any non-BMad skills in your setup. The fastest way to learn BMad and figure out what to run next is simply to ask it.

You can use BMad's thinking skills and building skills together or on their own. Many people run the thinking skills without asking BMad to write code, and a single clear change can go straight to building with no planning documents at all.

## Find Your Starting Point

![The BMad delivery loop: a vague notion starts at Clarify, a big clear idea at Plan, and a small change at Build and verify; Learn and adjust loops back to Plan](/diagrams/bmad-delivery-loop.svg)

Every path runs the same loop. Work with more moving parts or shared decisions enters the loop earlier and goes around it more often, while a single self-contained change enters straight at Build and verify. [How BMad Works](./start/how-bmad-works.md) explains the loop and the ticket that carries your specification through it, and [Meet the Agents](./agents/agents.md) introduces the specialist personas you can talk to at each stage.

| You have | Start at |
| --- | --- |
| Questions about what BMad can do, what to run next, or keeping your install current | [The BMad Agent](./start/the-bmad-agent.md): ask `bmad` directly in your coding tool chat |
| Nothing yet, and you want to see BMad work | [Build Your First Change](./start/build-your-first-change.md), a guided first build in an empty project |
| One clear, self-contained change or small new app | [Make a Small Change](./scenarios/make-a-small-change.md): run `bmad-build` and describe what you want |
| A clear idea with several connected parts and no plan yet | [Write and Slice the Initiative](./plan/write-and-slice-the-initiative.md): Sofia, the Product Owner (`bmad-agent-po`), sizes the work and writes the initiative (the top-level plan) or epic (one cohesive capability) |
| A decision made in a conversation or brainstorm with one decision-maker | [Build from a Conversation](./scenarios/build-from-a-conversation.md) |
| A feature several people must agree on first | [Plan a Feature as a Team](./scenarios/plan-a-feature-as-a-team.md), starting with a PRD (product requirements document) from John, the Product Manager (`bmad-agent-pm`) |
| Multiple related initiatives or a cross-team program | [Plan Inside an Organization](./plan/plan-inside-an-organization.md) for program-level planning and team sign-offs |
| A quick prototype that proved an idea | [Turn a Prototype into a Product](./scenarios/turn-a-prototype-into-a-product.md) |
| Working code with no written decisions | [Change an Existing Codebase](./scenarios/change-an-existing-codebase.md) |
| Raw notes, a vague idea, or doubts that it is worth building | [Clarify the Idea](./clarify/clarify-the-idea.md) |
| A team with its own rules and practices | [Customize BMad](./customize/customize-bmad.md) and [Adopt BMad Across a Team](./customize/adopt-bmad-across-a-team.md) |

[Pick a Route](./start/how-bmad-works.md#pick-a-route) lists additional routes, and the same page describes [the example app](./start/how-bmad-works.md#the-example-app) that these guides share.

## Specialist Agents and Optional Modules

BMad Method ships six specialist agents covering analysis, product management, product ownership, UX design, system architecture, and development. See [Meet the Agents](./agents/agents.md) to see who handles what and when to talk to each one.

Optional modules extend BMad beyond software product delivery:

| Module | Agent | What it covers |
| --- | --- | --- |
| [Founder](./founder/founder.md) | Nadia, the Founder Advisor | Startup discovery, financial modeling, fundraising, and keeping one business record |
| [Creative](./creative/creative.md) | Clio, the Creative Director | Voice-grounded writing, talks, fiction, visual decks, and non-code ideation |
| [Toolsmith](./toolsmith/toolsmith.md) | Smithy, the Toolsmith | Building, evaluating, and packaging your own BMad skills, agents, and modules |

:::tip[Unsure where to start?]
Talk to the BMad Agent (`bmad`) in your coding tool chat and describe what you are trying to do. See [The BMad Agent](./start/the-bmad-agent.md) for everything it handles, or [Get Answers About BMad](./start/get-answers-about-bmad.md) for community channels.
:::
