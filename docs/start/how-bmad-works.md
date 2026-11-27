---
title: How BMad Works
description: The four stages of BMad's loop, the key terms, the ticket that serves as the spec at each level, and how to tell where your work starts.
sidebar:
  order: 1
---

Read this page to see how BMad's skills fit together before you pick one. If you already have BMad installed, the fastest way to learn what to run next is to ask [The BMad Agent](./the-bmad-agent.md) (`bmad`) directly in your coding tool chat.

BMad takes an intent of any size through four stages and keeps what you decide in one place, the ticket, so every new coding session builds from the same specification. You start where your inputs are and skip what does not apply.

Depending on your AI coding tool (such as Claude Code, Codex, or Cursor), you invoke a skill by typing its name with a prefix or in plain text, such as `/bmad`, `$bmad`, or `bmad`. Examples in these guides use `/bmad` syntax, and plain skill names work in chat when your tool supports them.

## Key Terms

| Term | Meaning |
| --- | --- |
| **Skill** | A named command you invoke inside your AI coding tool to run a specific job, such as building a change or reviewing code. |
| **Agent** | A specialist persona (such as Mary the Business Analyst or Sofia the Product Owner) that guides you through decisions and runs the right skills for its role. |
| **Initiative** | A top-level project container grouping several related capabilities toward one outcome, such as a new product or a major feature set. |
| **Epic** | One cohesive capability that a person can see working by itself, made up of one or a few stories. |
| **Story** | One complete, bounded piece of user-facing behavior that you can verify end to end. |
| **Program** | An optional container above initiatives used when multiple related initiatives share portfolio outcomes or cross-team rules. |
| **PRD** | Product Requirements Document: a shared written agreement on what a product or feature must do, who it serves, and what is out of scope. |
| **Ticket tree** | The folder structure inside your project where BMad stores initiatives, epics, stories, and their linked planning documents. |

## The Loop

![The BMad delivery loop: a vague notion starts at Clarify, a big clear idea at Plan, and a small change at Build and verify; Learn and adjust loops back to Plan](/diagrams/bmad-delivery-loop.svg)

| Stage | Question it answers | It ends with | Main skills and agents |
| --- | --- | --- | --- |
| [Clarify](../clarify/clarify-the-idea.md) | Why build it, and is it worth it? | A clear intent: what should be true, what must not change, and what is out of scope | Mary (`bmad-agent-analyst`) for briefs, business cases, PRFAQs, `bmad-brainstorming`, and `bmad-deep-recon`; also `bmad-ingest` and `bmad-forge-idea` |
| [Plan](../plan/plan-the-work.md) | What exactly, how, and in what order? | Requirements in the ticket, any shared UX or technical decisions, and stories ready to build | John (`bmad-agent-pm`), Sofia (`bmad-agent-po`), Sally (`bmad-agent-ux-designer`), and Winston (`bmad-agent-architect`) |
| [Build and verify](../build/build-and-verify.md) | Does it work as intended? | Reviewed, tested, committed code that a person has marked done | Amelia (`bmad-agent-dev`), `bmad-build`, `bmad-build-auto`, `bmad-code-review`, `bmad-walkthrough`, and `bmad-qa-generate-e2e-tests` |
| [Learn and adjust](../learn/learn-and-adjust.md) | What should we change? | Each finished epic reviewed with a verdict and closed, and mid-flight changes routed back into the plan | Amelia (`bmad-retrospective`), then Sofia (`bmad-agent-po`) to validate and close or replan |

The stages describe the kind of help a skill gives, rather than a mandatory checklist. A small fix enters at Build and verify, while a rough idea starts at Clarify, and most work never touches every skill.

At the end of an epic, mark its stories done, run the retrospective on the finished epic, and then ask Sofia to validate and close it.

## Who Does What

Each role on a software team has a specialist agent you can talk to in plain language. See [Meet the Agents](../agents/agents.md) for a fuller guide to working with them.

| Role | Agent | How they help |
| --- | --- | --- |
| Business analyst | [Mary](../agents/mary-analyst.md) (`bmad-agent-analyst`) | Explores rough ideas, researches markets, competitors, or your own codebase, and writes briefs, business cases, and PRFAQs to decide whether and why something is worth building |
| Product manager | [John](../agents/john-pm.md) (`bmad-agent-pm`) | Plans work at any scale, from tightening a small idea or scoping a prototype to writing a full PRD or launch plan |
| Product owner | [Sofia](../agents/sofia-po.md) (`bmad-agent-po`) | Turns ideas, notes, or PRDs into clear requirements and ordered stories, tracks what is ready next, and replans when scope shifts |
| UX designer | [Sally](../agents/sally-ux-designer.md) (`bmad-agent-ux-designer`) | Designs how your product looks, feels, and works: user motivations, brand identity, visual direction, screens and flows, websites, external design handoffs, and UI audits |
| System architect | [Winston](../agents/winston-architect.md) (`bmad-agent-architect`) | Settles shared technical rules, weighs build-vs-buy trade-offs, plans migrations, reviews security, and audits repos for AI coding agent readiness |
| Developer | [Amelia](../agents/amelia-dev.md) (`bmad-agent-dev`) | Builds changes interactively or unattended, runs independent code reviews, walks you through unfamiliar code, adds end-to-end tests, and runs epic retrospectives |

Say what you want in plain words. If you open an agent without a specific request, they orient you in a few short sentences and ask one starter question so you never have to memorize commands.

## Pick a Route

| You have | Route |
| --- | --- |
| An obvious, low-risk edit (typo, label rename, formatting) | Ask your AI coding tool directly with no BMad skill needed |
| One clear, self-contained change or small new app | [Make a Small Change](../scenarios/make-a-small-change.md) or [Build Your First Change](./build-your-first-change.md) |
| A clear idea with multiple connected parts and no plan yet | Sofia sizes it and writes the initiative or epic: [Write and Slice the Initiative](../plan/write-and-slice-the-initiative.md) |
| A decision made in a conversation or brainstorm with one decision-maker | [Build from a Conversation](../scenarios/build-from-a-conversation.md) |
| A quick prototype that proved an idea | [Turn a Prototype into a Product](../scenarios/turn-a-prototype-into-a-product.md) |
| A feature several people must agree on first | [Plan a Feature as a Team](../scenarios/plan-a-feature-as-a-team.md) |
| Multiple related initiatives across a larger program | [Plan Inside an Organization](../plan/plan-inside-an-organization.md) |
| Code that works but has no written decisions | [Change an Existing Codebase](../scenarios/change-an-existing-codebase.md) |
| Raw notes, a vague idea, or doubts that it is worth building | [Clarify the Idea](../clarify/clarify-the-idea.md) |
| An initiative already written | Ask Sofia "what's next?" so she reads the current state and names the next step |
| An epic whose stories are all built, or a change mid-flight | [Learn and Adjust](../learn/learn-and-adjust.md) |

:::tip[Ask BMad]
Run `bmad` and describe what you have. It follows the same routes and recommends the smallest one that fits.
:::

BMad works alongside other skills too. When a custom skill is registered in a module, the `bmad` helper recommends it next to built-in skills; see [Modules and Registration](../toolsmith/modules.md#what-registering-gives-you).

## The Ticket Is the Spec

Everyday tracked work lives in a ticket tree with three levels: Initiative, Epic, and Story. When a portfolio spans multiple related initiatives, BMad adds an optional top-level **Program** container above them, and when a project only needs a single cohesive capability, you can start directly with a standalone **Epic** container without creating an initiative wrapper first.

| Level | What it is | Holds |
| --- | --- | --- |
| Program *(optional)* | Several bounded initiatives sharing portfolio outcomes or cross-domain rules | Child initiatives in build order |
| Initiative | Several capabilities toward one outcome, such as a new product or a feature set | Its epics (or stories directly for small initiatives) in build order |
| Epic | One cohesive capability that a person can see working by itself (can also stand alone at the top level) | Its stories in build order |
| Story | One complete capability a person can verify end to end; also a spike (research task) or a bug | Nothing; a local build plan records its progress |

Each initiative and epic file is the single source of truth at its level. It records numbered requirements (what the work delivers), constraints (what it must obey everywhere), what done looks like, what is out of scope, and links to any shared UX or technical documents a coding session needs. Every skill working on a ticket reads that ticket first and trusts it, so later sessions do not have to re-read raw transcripts or long background notes.

Sofia, the Product Owner, writes and maintains those tickets. Her inputs can be a PRD from John, a brief from Mary, meeting notes, or designs from Sally. She lifts what they settle into the ticket with clear citations, attaches UX designs and shared architecture documents as references, and breaks each epic into ordered stories. By default, once you approve an epic's story breakdown, Sofia writes a full story file with clear acceptance criteria for each story so coding agents know exactly what to verify. If you prefer, you can ask her to leave later stories thin until you are ready to pick them up.

![The room booker's check-in feature as a ticket tree: one initiative, two epics, and their stories in build order, one marked hitl and one waiting on another](/diagrams/room-booker-ticket-tree.svg)

A story marked `hitl` (human-in-the-loop) means a person handles part of the work outside code, such as mounting a door tablet or completing a manual approval. An `after` arrow shows which story must be built first.

```text
_bmad-output/initiative-check-in/
  initiative-check-in.md        # the spec for the whole initiative
  prd-check-in/  ux-check-in/  architecture-check-in/
  tickets/
    epic-door-check-in/
      epic-door-check-in.md     # the spec for this epic
      tickets/
        story-show-each-room-on-its-door-tablet.md        # refined story criteria
        story-show-each-room-on-its-door-tablet-plan.md   # build plan and status
```

Exact folder layout, IDs, and status fields are documented in [The Ticket Tree](../reference/ticket-tree.md).

## The Example App

Examples across these docs use one made-up app, the **room booker**: an office meeting-room app where staff book rooms by the hour. The feature most examples follow is called "Check in or lose the room". It adds a tablet at each door where people check in and frees a room nobody checks into within the no-show window so someone else can book it.

Agent questions and outputs are shortened in these examples, so your own sessions will phrase things differently.

## Size and Stakes

Scope and coupling decide how many stories or epics the work needs, while stakes (from a hobby project to regulated or contracted software) decide how much planning and sign-off happens up front. A large hobby project can keep planning light, while a small change to a regulated system may need formal review. [Write a PRD](../plan/write-a-prd.md#2-choose-the-mode) explains how planning depth adjusts to stakes. High risk, unclear requirements, shared technical contracts, or multiple stakeholders pull work into planning even when the code change looks small.

![Four nested paths reuse the same unit: edit directly, run one Build, repeat Build across an epic, or repeat epic paths across a project](/diagrams/development-paths.svg)

Every size builds the same way: one build per story, over as many coding sessions as its plan needs. Epics are split by user-visible capability and deployment boundaries, rather than by who will build them. Larger work adds shared context around each build and repeats the loop instead of switching to a different delivery process.

### How Big Each Piece Is

| Piece | Size | When it is too big or too small |
| --- | --- | --- |
| Build session | One focused goal (roughly 500 changed lines, excluding tests, in a handful of files) started in a fresh chat | When a request mixes two independent goals, `bmad-build` offers to split the second goal out and save it for later |
| Story | One complete capability a person can see working end to end; an epic typically holds one to a few stories | Sofia merges slices that cannot be verified on their own; setup and deployment belong inside the story that needs them rather than as separate stories, and internal coding steps stay in the build plan |
| Epic | One cohesive capability a person can see working by itself | If an epic uses "and" to glue two independent capabilities together, split it into two epics; a single-story epic is fine when it belongs inside a larger initiative |
| Initiative | Several epics toward one outcome | Work spanning multiple bounded initiatives uses a program container holding child initiatives rather than nesting epics inside epics |

Sofia sizes stories and epics by judgment. If a story still turns out larger than expected once implementation starts, `bmad-build` offers to split it cleanly. See [Why BMad Works This Way](./why-bmad-works-this-way.md#one-story-one-capability) for the reasoning behind this sizing.

## You Make the Calls

BMad skills investigate your repository and documents first and only ask you for choices that require human judgment. Whenever a skill has to make an assumption or leaves a question unresolved, it flags it clearly in the document or ticket for your review. Checking those flagged items is important because the next session treats written decisions as settled. At any point you can also run `bmad-advanced-elicitation` (an independent second-pass critique that proposes a stronger revision of a draft) or `bmad-party-mode` (a structured discussion where several specialist agents weigh in together).

A build always stops at `built`; only you, or a script or agent session you explicitly direct, mark a story done. In an organization, people approve at five formal sign-offs before work moves forward; [Plan Inside an Organization](../plan/plan-inside-an-organization.md) lists each one.

To understand the design reasoning behind these choices, read [Why BMad Works This Way](./why-bmad-works-this-way.md).
