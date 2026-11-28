---
title: 'Meet the Agents'
description: 'Meet the BMad Agent and the six BMad Method specialist agents, see who to talk to at each stage of your project, and find agents in optional modules.'
sidebar:
  order: 1
---

BMad gives you a core guide called the BMad Agent (`bmad`) plus six specialist agents in BMad Method that you can talk to directly inside your AI coding tool. Each specialist handles a different part of turning an idea into working, reviewed software, so you never have to guess how to structure a conversation or remember agile terminology.

You do not need to talk to everyone on every project. A small, clear code change can go straight to [Amelia](amelia-dev.md), while a larger product or team effort can move through research, product planning, UX design, architecture, backlog slicing, and implementation with the right specialist at each step.

## The BMad Agent (`bmad`)

Installed with Core Tools in every BMad project, [The BMad Agent](../start/the-bmad-agent.md) is your advisor across every module you have installed. Ask it where to start, what to do next, or how BMad fits alongside any other skills in your coding tool, and it reads your installed modules and project folder to give you a direct recommendation. It also keeps BMad up to date, adds and removes modules, switches your active work, and runs or customizes skills for you when you ask (for example, `"Hey BMad, customize the build skill to always run thorough reviews"`).

## BMad Method Specialist Agents

| Agent | Role | Call when you want to | Typical outputs |
| ----- | ---- | --------------------- | --------------- |
| [Mary](mary-analyst.md) | Business Analyst | Brainstorm ideas, run market, competitor, or codebase research, pressure-test a concept, make a business case, or keep `AGENTS.md` current | Research briefs, business cases, experiment plans, `AGENTS.md` |
| [John](john-pm.md) | Product Manager | Shape what to build at any scale, plan a prototype or time-boxed cycle, write a PRD, or coordinate a launch | Product briefs, PRDs (product requirements documents), launch plans |
| [Sofia](sofia-po.md) | Product Owner | Turn notes or plans into an organized tree of initiatives, epics, and stories, track what is ready next, replan mid-project changes, or sync with an issue tracker | Ticket tree in `_bmad-output/`, acceptance criteria, synced tracker issues |
| [Sally](sally-ux-designer.md) | UX Designer | Build a brand identity, find visual direction, design app flows or websites, bridge Figma or Stitch, or audit an existing UI | `DESIGN.md`, `EXPERIENCE.md`, `BRAND.md`, interactive HTML mockups |
| [Winston](winston-architect.md) | System Architect | Choose a tech stack, align shared technical decisions across features, design AI or agent systems, plan migrations, or review security and repo readiness | Shared architecture docs, ADRs (architecture decision records), API contracts, migration plans |
| [Amelia](amelia-dev.md) | Developer | Build a change interactively, run ready stories unattended, review diffs, walk through unfamiliar code, add API or end-to-end tests, or wrap up a finished epic | Working code and tests, build plans, code review findings, epic retrospectives |

## How to Start a Conversation

Start the BMad Agent or any specialist in whichever style your AI coding tool supports:

- In tools that support slash commands (such as Claude Code), invoke the skill directly, for example `/bmad` or `/bmad-agent-pm` followed by what you need.
- In any AI coding tool, call the agent by name in plain English, for example `"Hey BMad, what should I work on next?"` or `"Hey John, help me plan a self-serve billing flow."`

If you want to see everything an agent offers before starting, ask `"What can you help me with?"` and they will summarize their capabilities without dumping a wall of options.

## Working Together and Customizing Agents

When a decision benefits from multiple viewpoints at once, you can gather several agents in the same room with [Run Multi-Agent Discussions](../customize/run-multi-agent-discussions.md) (`bmad-party-mode`) to debate trade-offs before you commit.

Every agent can also be tailored to match your tone, standing rules, or team templates. Tell the BMad Agent or `bmad-customize` what you want changed rather than editing files by hand; see [Customize BMad](../customize/customize-bmad.md) for how team and personal overrides work.

## Specialist Agents in Optional Modules

Beyond software delivery, optional BMad modules add dedicated agents you can install alongside BMad Method or in their own separate folders:

- [Nadia](../founder/founder.md) (Founder) is a startup advisor and co-founder partner for customer validation, pricing, financial models, cap tables, fundraising, and investor pitch practice.
- [Clio](../creative/creative.md) (Creative) is a creative director for essays, talks, presentations, fiction, creative problem-solving, and structured critique in your own voice.
- [Smithy](../toolsmith/toolsmith.md) (Toolsmith) is a skill and module builder who helps you author, review, evaluate, and package your own BMad skills, agents, and modules.

For the full catalog of every installed skill and agent name, see [Skills and Agents](../reference/skills-and-agents.md).
