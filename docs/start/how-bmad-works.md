---
title: How BMad Works
description: The four stages of BMad's loop, the ticket that serves as the spec at each level, and how to tell where your work starts.
sidebar:
  order: 1
---

Read this page to see how BMad's skills fit together before you pick one. BMad
takes an intent of any size through four stages, and keeps what was decided in
one place, the ticket, so that each new session builds from the same spec. You
start where your inputs are and skip what does not apply.

## The Loop

![The BMad delivery loop: a vague notion starts at Clarify, a big clear idea at Plan, and a small change at Build and verify; Learn and adjust loops back to Plan](/diagrams/bmad-delivery-loop.svg)

| Stage                                            | Question it answers                   | It ends with                                                                           | Main skills                                                                                                                |
| ------------------------------------------------ | ------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| [Clarify](../clarify/clarify-the-idea.md)        | Why build it, and is it worth it?     | A clear intent: what should be true, what must not change, what is out of scope        | Mary (`bmad-agent-analyst`), who runs `bmad-brainstorming` and `bmad-deep-recon`; also `bmad-ingest` and `bmad-forge-idea` |
| [Plan](../plan/plan-the-work.md)                 | What exactly, how, and in what order? | Requirements in the ticket, any decisions epics must share, and stories ready to build | John (`bmad-agent-pm`), Sofia (`bmad-agent-po`), Sally (`bmad-agent-ux-designer`), and Winston (`bmad-agent-architect`) |
| [Build and verify](../build/build-and-verify.md) | Does it work as intended?             | Reviewed, committed code that a person has marked done                                 | `bmad-build`, `bmad-build-auto`, `bmad-code-review`, `bmad-walkthrough`                                                    |
| [Learn and adjust](../learn/learn-and-adjust.md) | What should we change?                | Each epic given a verdict and closed, and changes sent back to Plan                    | Sofia, then `bmad-retrospective`                                                                                           |

The stages describe the kind of help a skill gives, not a sequence to
complete. A small fix starts at Build and verify, and a vague idea at Clarify.
Most work never touches every skill.

At the end of an epic, mark its stories done, run the retrospective on the
finished epic, then have Sofia validate and close it.

## Who Does What

Each role on a team has an agent to work through.

| Person on the team | Agent                            | What it runs or writes                                                                                                                                                                                   |
| ------------------ | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Analyst            | Mary (`bmad-agent-analyst`)      | Runs `bmad-brainstorming`, `bmad-deep-recon`, and `bmad-project-context`; writes the documents that decide whether and why to go ahead, such as a brief, PRFAQ, or business case                                                                                                  |
| Product manager    | John (`bmad-agent-pm`)           | Proposes the planning document your goal needs and writes it with you: a PRD, or [another planning document](../reference/document-templates.md#documents-john-and-mary-write) when the work calls for one, such as a prototype plan, experiment card, or launch plan |
| Product owner      | Sofia (`bmad-agent-po`)          | Writes the initiative, its epics, and their stories; runs the board                                                                                                                                      |
| UX designer        | Sally (`bmad-agent-ux-designer`) | Coaches UX-first strategy (`trigger-map`), corporate brand packages (`brand-identity`), visual direction (`design-direction`), product UX (`ux-system`, `ux-epic`, `ux-quick`), websites (`website-design`), and UI audits (`ux-audit`) through `bmad-facilitate` |
| Architect          | Winston (`bmad-agent-architect`) | Coaches architecture spines (`arch-spine`, `arch-epic`), technical designs, and repo/AI readiness through `bmad-facilitate`                                                                                                               |
| Developer          | Amelia (`bmad-agent-dev`)       | Knows the development skills and picks the one that fits; runs `bmad-build`, `bmad-build-auto`, `bmad-code-review`, `bmad-walkthrough`, `bmad-qa-generate-e2e-tests`, and `bmad-retrospective`           |

Each agent runs the skills named, and calling a skill directly does the same
work. Say what you want in plain words. Ask an agent what it can do and it
answers in a few sentences, with its full list only if you ask for it.

## Pick a Route

| You have                                                                      | Route                                                                                                                         |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| An obvious, low-risk edit                                                     | Your agent, directly. No skill is needed                                                                                      |
| A change one session can build                                                | [Make a Small Change](../scenarios/make-a-small-change.md)                                                                    |
| A small new app, such as a to-do list                                         | One `bmad-build` run: [Build Your First Change](./build-your-first-change.md)                                                 |
| A clear idea bigger than one session, and no initiative yet                   | Sofia sizes it and writes the initiative or epic: [Write and Slice the Initiative](../plan/write-and-slice-the-initiative.md) |
| A decision made in a conversation or a brainstorm, and one person who decides | [Build from a Conversation](../scenarios/build-from-a-conversation.md)                                                        |
| A quick prototype that proved an idea                                         | [Turn a Prototype into a Product](../scenarios/turn-a-prototype-into-a-product.md)                                            |
| A feature several people must agree on                                        | [Plan a Feature as a Team](../scenarios/plan-a-feature-as-a-team.md)                                                          |
| Code that works but has no written decisions                                  | [Change an Existing Codebase](../scenarios/change-an-existing-codebase.md)                                                    |
| Raw notes, a vague idea, or doubts that it is worth building                  | [Clarify the Idea](../clarify/clarify-the-idea.md)                                                                            |
| An initiative already written                                                 | Ask Sofia "what's next?". The state of the initiative and its epics names the next step                                       |
| An epic whose stories are all built, or a change mid-flight                   | [Learn and Adjust](../learn/learn-and-adjust.md)                                                                              |

:::tip[Ask BMad]
Run `bmad` and describe what you have. It follows the same routes and
recommends the smallest one that fits.
:::

BMad works beside other skills. Register one with a module and the `bmad`
skill recommends it next to its own; see
[Modules and Registration](../toolsmith/modules.md#what-registering-gives-you).

## The Ticket Is the Spec

Tracked work lives in a ticket tree with three levels:

| Level          | What it is                                                                                             | Holds                                      |
| -------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| Initiative     | Several capabilities toward one outcome, such as a new product or a feature set                                | Its epics, in build order                  |
| Epic           | One cohesive capability: something a person could see working by itself | Its stories, in build order                |
| Story          | One complete capability a person can verify end to end; also a spike or a bug                                               | Nothing; a build plan records its progress |

Each initiative and epic file is the spec at its level. Its Requirements are
lines with stable ids, such as `R1 (E01)`, each naming where it came from,
and its Constraints cite their sources too. A requirement is what the work
delivers; a constraint is what it must obey, whichever part it touches. The
file also says what done looks like (Done when), what is out of scope
(Boundaries), and which documents a build must read beside it (References).
Every skill that works on a ticket reads it first and trusts it. At the story
level, the entry, or the story file once it exists, is the spec the build
reads first.

Sofia, the Product Owner, writes and keeps those lines. Her sources can be a
PRD from John, the Product Manager; a brief from Mary, the Business Analyst;
meeting notes; or a design. She lifts what they say into the ticket and cites
them, and later skills read the ticket instead of the sources. UX files and
the architecture spine sit beside the ticket as References. A story is
usually just an entry in its epic's `tickets.toml`: one line of what it
delivers and how it is verified.
The build writes its acceptance criteria when it starts.

![The room booker's check-in feature as a ticket tree: one initiative, two epics, and their stories in build order, one marked hitl and one waiting on another](/diagrams/room-booker-ticket-tree.svg)

A story marked `hitl` is one a person does part of. An `after` arrow points
from the story that must be built first.

```text
_bmad-output/initiative-check-in/
  initiative-check-in.md        # the spec for the whole initiative
  prd-check-in/  ux-check-in/  architecture-check-in/
  tickets/
    tickets.toml                # the epics, in build order
    epic-door-check-in/
      epic-door-check-in.md     # the spec for this epic
      tickets/
        tickets.toml            # the stories, in build order
        story-show-each-room-on-its-door-tablet-plan.md   # a build's plan and status
```

Exact layout, ids, and statuses are in [The Ticket Tree](../reference/ticket-tree.md).

## The Example App

Examples on these pages use one made-up app, the **room booker**: an office's
meeting-room app, where staff book rooms by the hour. The feature most
examples follow is called "Check in or lose the room". It adds a tablet at
each door where people check in, and frees a room nobody checks into within
the no-show window, the minutes a booked room waits, so someone else can book
it.

What the skills ask and write is shortened in the examples. Your runs will
word things differently.

## Size and Stakes

Size decides how many build sessions the work needs. Stakes, from a hobby
project to regulated or contracted work, decide how heavy the planning gets.
A large hobby project keeps planning light; a small change to a regulated
system may not. [Write a PRD](../plan/write-a-prd.md#2-choose-the-mode) lists
what each level changes. Risk, unclear requirements, broad architectural
reach, or several people involved push work up from one session even when it
is small.

![Four nested paths reuse the same unit: edit directly, run one Build, repeat Build across an epic, or repeat epic paths across a project](/diagrams/development-paths.svg)

Every size builds the same way: one build per story, over as many sessions as its plan needs. Epics are cut by
outcome and deployment, not by who will build them. Once cut, one developer
usually owns each, and BMad doesn't record who. Larger work adds shared
context around each build session and repeats it; it does not switch to a
different way of delivering.

### How Big Each Piece Is

| Piece | Size | When it is too big or too small |
| --- | --- | --- |
| Build session | One goal: roughly 500 changed lines, not counting tests, in a handful of files, started in a fresh chat | The build offers to split a request with two independent goals; on a split it writes the rest to `deferred-work.md` |
| Story | One complete capability a person can see working end to end; an epic may have one, or a few | Sofia merges one that cannot be verified as an outcome by itself; setup and production delivery are part of a story, not stories of their own; the steps inside a story are the build's plan, never tickets |
| Epic | One cohesive capability: something a person could see working by itself | One that takes an "and" joining two things which each stand alone is two epics; an epic may have a single story |
| Initiative | Several epics toward one outcome | Work spanning multiple initiatives uses a `program` container (`program-*`) holding child initiatives (`tickets/initiative-*`), not epics inside epics |

Sofia sizes stories and epics by judgment, and `tickets.py` checks no size. A
story that turns out too big usually surfaces when the build offers a split.
[Why BMad Works This Way](./why-bmad-works-this-way.md#one-story-one-capability)
gives the reasons.

## You Make the Calls

The skills ask only what you alone know and find other facts themselves.
Where they fill a gap without you, they say so: an `[ASSUMPTION]` tag in a
document, an `Assumption:` or `Open question:` line in a ticket. Reading those
is your job, because the next session will treat whatever is written as
settled. At any point you can ask for `bmad-advanced-elicitation` to push
harder on a draft, or `bmad-party-mode` to have several agents discuss it.

A build stops at `built`; you, or a script or AI session you direct, mark a
story done. In an organization, people approve at five sign-offs before work
moves on; [Plan Inside an Organization](../plan/plan-inside-an-organization.md)
names them.

For the reasoning behind these choices, see [Why BMad Works This Way](./why-bmad-works-this-way.md).
