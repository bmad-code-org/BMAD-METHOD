---
title: 'Explore and Validate an Idea'
description: Decide which early idea skill to use — generate options with brainstorming, pressure-test a held idea with Forge Idea, or skip idea work and go straight to requirements.
sidebar:
  order: 3
---

Use this page to decide what to do with an idea before you commit to
requirements or code. Idea work is optional. Skipping it is fine when you
already know what you want; skipping it on a vague idea means every later
document inherits the vagueness.

## Pick a Starting Point

Start from your situation, not from a preferred skill.

| Situation                                                         | Use                                                                                                           |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| "I have a topic and want far more ideas on it than I'd get alone" | `bmad-brainstorming`                                                                                          |
| "I hold an idea and want it clarified, tested, or made better"    | `bmad-forge-idea`                                                                                             |
| "I need to understand the market, domain, or technology first"    | `bmad-deep-recon` — see [Research a Decision](./research-a-decision.md)                                       |
| "I already have conviction and want it written down"              | A product brief — see [Define Requirements and a Specification](./define-requirements-and-a-specification.md) |
| "I have a product concept and want it proven customer-first"      | A PRFAQ — see [Define Requirements and a Specification](./define-requirements-and-a-specification.md)         |
| "I want my agents to discuss or decide together"                  | `bmad-party-mode` — see [Run Multi-Agent Discussions](../customize/run-multi-agent-discussions.md)            |

None of these are stages. Run whichever fit, in any order, and condense what
comes out before the next step.

:::tip[Not Sure?]
Run `bmad-help` and describe your situation. It recommends a starting point
based on what you have already produced.
:::

## Generate Options with Brainstorming

Run `bmad-brainstorming` when you have a topic and want to push past the
obvious ideas on it. You choose the stance for the session:

- **Facilitator**: the coach never supplies ideas. It runs techniques and asks
  sharper questions so every idea is yours.
- **Creative Partner**: it facilitates and plays along, trading ideas with you.
- **Ideate for me**: it runs the whole session itself and shows you the result.

Tell it what you are brainstorming and why; the goal shapes which techniques
it offers. You pick a batch of techniques, or let it choose, and it runs each
until it stops producing, aiming well past a hundred ideas before it lets you
wrap. Say when you want to narrow and it switches to prioritizing and
deciding. Sessions can be paused and resumed.

You get an HTML record of the session, and a short `brainstorm-intent.md`
holding only the chosen discoveries, shaped to feed `bmad-spec`,
`bmad-product-brief`, or `bmad-prd`.

## Pressure-Test an Idea with Forge Idea

Run `bmad-forge-idea` with a half-formed idea and it questions the idea, one
question at a time, until you can act on it with conviction or drop it. It
works on a software feature, a business model, or a decision you keep
circling. Better thinking is the goal; a written file is optional. A
conversation is the cheapest place to find a hole in the idea, because
changing your mind there costs nothing.

It first pins down the idea, your goal for the session (clarify it, test
whether it holds up, or make it better), and whether it is new or a change to
an existing project. Clarifying pins down terms and assumptions; testing goes
after the central claim first; improving drives each unresolved branch to a
concrete decision.

It then works one question at a time and includes its own best answer when
that helps you respond. A concrete proposal is easier to accept, reject, or
revise than an open prompt. Fuzzy terms do not pass: when `user`, `buyer`, and
`payer` collapse into one word, it asks you to pick. For an idea inside an
existing project, the project's files are the source of truth.

It does not agree or praise unless that helps you think. Say **"attack this"**,
**"defend this"**, or **"switch roles"** to change how the current branch is
argued.

Each turn brings two voices: one from your installed agents or personas, and
one generated for the topic (a competitor, a buyer, a finance reviewer). Name
a persona to change who participates, or ask to go one-on-one. See
[Run Multi-Agent Discussions](../customize/run-multi-agent-discussions.md) and
[Agents](../reference/agents.md) for the roster.

:::tip[Let it kill the idea]
Finding out cheaply that an idea doesn't hold is the win. Don't steer the
session toward a yes.
:::

## How a Forge Session Ends

Every run writes a `forge-report.html`. The session ends in one of three ways,
and each is a valid result:

| Outcome      | What it means                                                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hardened** | The idea is specific enough to use. A short `forged-idea.md` records the decisions, the rejected options, and the reasons later skills need. |
| **Killed**   | The idea does not hold up. The report records why.                                                                                           |
| **Clearer**  | You understand the idea better, but there is nothing to hand off. The session log is the record.                                             |

`forged-idea.md` should be short enough to feed `bmad-spec`, `bmad-prd`, or
`bmad-prfaq`. If it reads like a document, it is too long.

:::note[Example]
**You:** "I want AI-generated weekly summaries in the app. Users get a digest email every Monday."

**Forge:** "Before the feature, who asked for this? My recommended answer is nobody did, and you're reasoning from 'AI summaries sound valuable.' Push back if there's a real signal."

**Skeptical CFO (generated):** "And a Monday digest is a recurring inference cost across your whole active base, forever. What revenue line pays for it?"

**You:** "Retention, I guess. People forget to come back."

**Forge:** "Then the load-bearing claim is 'a Monday email brings lapsing users back,' not 'AI summaries are valuable.' Those are different ideas. Which one are we forging?"
:::

The first idea was a feature. Two questions in, the real idea is a retention
bet you could test with a plain email and no model at all.

## Improve a Draft

Point `bmad-advanced-elicitation` at a recent piece of output (a section, a
plan, a draft, a decision) and it offers a short menu of critique methods,
such as pre-mortem, first principles, or red team, runs the ones you pick, and
shows proposed changes for you to apply or reject. The brief, PRD, UX, and
spec skills offer it at their own pauses. See
[Advanced Elicitation](../explanation/advanced-elicitation.md).

## What Comes Next

Idea work leaves a brainstorm intent, a `forged-idea.md`, a session log, or a
clearer decision. When the next question is "what is true out there," go to
[Research a Decision](./research-a-decision.md). When it is "what exactly are
we building," go to
[Define Requirements and a Specification](./define-requirements-and-a-specification.md).
