---
title: Plan the Work
description: 'The Plan stage: from a clear intent to stories ready to build. Follow the state of the initiative and its epics; John, Sofia, Sally, and Winston each handle one step.'
sidebar:
  order: 1
---

Use this page when your project is bigger than a single coding session. Plan answers three questions before anyone writes code: what you are building, how separate parts will fit together, and in what order to build them.

| | Plan |
| --- | --- |
| **You start with** | A clear intent from Clarify, or material you already have: an issue, notes, a brief, or an existing PRD |
| **You produce** | The project spec and breakdown into buildable pieces, plus a PRD, UX design, and shared architecture when the work needs them |
| **It is done when** | Your next epic's stories are planned and you have approved them |
| **Skip it when** | The work fits one coding session: go to [Build a Change](../build/build-a-change.md) |
| **What comes next** | [Build and Verify](../build/build-and-verify.md): build the first story that is ready |

## How BMad Organizes Larger Work

You do not need a software-process background to use BMad. Everything uses four plain levels, chosen by the size of the work rather than team size or deadlines:

| Level | Plain meaning | When to use it |
| --- | --- | --- |
| **Story** | One complete behavior a user can see working and a person can verify in one sitting | One self-contained feature or bug fix |
| **Epic** | One cohesive capability made up of a few stories (can live on its own or inside an initiative) | A single capability that needs several coding sessions |
| **Initiative** | Several related capabilities that share goals, rules, or data concepts | A full product, major feature area, or system redesign |
| **Program** | Several initiatives coordinated under one portfolio *(optional)* | Multi-initiative strategy or cross-team delivery |

A **PRD** (Product Requirements Document) is an optional written agreement on what the product should do and why, written by John, the Product Manager, before work is broken down. Work always starts at the lowest level that fits and moves up only if it grows larger. To meet the specialists who help at each step, see [Meet the Agents](../agents/agents.md).

## Follow the Plan's State

You do not need to memorize the sequence. The next step always follows from what is already written in your project folder. Ask Sofia, the Product Owner (`bmad-agent-po`), "what's next?" at any point and she tells you.

Sofia sizes new work first: a single story or bug becomes a standalone ticket, a single capability stays a standalone epic, multiple related capabilities become an initiative, and several initiatives roll up into a program. She keeps work in one epic unless a separate user outcome, or a part people can use early, justifies splitting it.

With no plan yet:

```text wrap
/bmad-agent-po write the initiative from my-notes.md
```

Once a plan exists:

```text wrap
/bmad-agent-po what's next?
```

![The initiative's states in order, each with its next step: no initiative yet, Sofia writes it; open questions, Sofia walks them with you; not sliced, Sofia cuts it into epics; shared design, optionally Sally, adopted; shared decisions, optionally Winston, adopted; epic not refined, Sofia refines it; no stories yet, Sofia plans them; stories ready, bmad-build, one per chat](/diagrams/plan-states.svg)

| State | Next step | Page |
| --- | --- | --- |
| No plan yet | Sofia writes the spec from what you have | [Write and Slice the Initiative](./write-and-slice-the-initiative.md) |
| No plan yet, and several people must agree on the product | Optionally talk through scope, trade-offs, and product requirements with John, the Product Manager | [Write a PRD](./write-a-prd.md) |
| Open questions or assumptions in the spec | Sofia walks through them with you | [Write and Slice the Initiative](./write-and-slice-the-initiative.md#2-settle-what-she-could-not) |
| Not yet broken into epics | Sofia splits the initiative into ordered epics | [Write and Slice the Initiative](./write-and-slice-the-initiative.md#3-cut-it-into-epics) |
| The interface matters, or epics must share technical decisions | Work with Sally (`bmad-agent-ux-designer`) and Winston (`bmad-agent-architect`), then have Sofia attach their files | [Design UX and Architecture](./design-ux-and-architecture.md) |
| An epic is still an outline | Run **epic inception**: Sofia expands the epic just in time, offers any needed epic PRD, UX, or architecture, and settles what its stories must agree on | [Plan an Epic's Stories](./plan-an-epics-stories.md) |
| A refined epic has no stories yet | Sofia slices it into ordered stories and writes their refined story files | [Plan an Epic's Stories](./plan-an-epics-stories.md#2-plan-the-stories) |
| Stories are ready | Build them one session at a time | [Build and Verify](../build/build-and-verify.md) |

When new material arrives later, such as a UX design or an updated PRD, bring it back to Sofia so she updates the spec. She preserves stable tracking links on every requirement and tells you which existing stories need to change.

## Choose How Much to Write

Most projects need only Sofia's spec and its epics. Add another document only when it answers a real question the work raises:

| Add | When |
| --- | --- |
| A PRD | Several people must agree on what the product is, several epics must stay aligned, or external integrations or service-level agreements (SLAs) apply |
| UX design files | The user interface is an important part of the outcome |
| Shared architecture | Two epics or two coding sessions could otherwise make incompatible technical choices, or the tech stack is still undecided |

Run UX design before architecture, both for the whole initiative and on individual epics, so the user experience guides technical choices. UX can also happen earlier and feed the PRD directly. Shared architecture usually runs after Sofia writes and slices the initiative because Winston reads the epic boundaries to see what they share. When you are building on existing code you plan to keep, run architecture before Sofia slices so Winston records the technical decisions already living in the codebase. Either UX or architecture can also run for a single epic instead of the whole initiative. [Plan Inside an Organization](./plan-inside-an-organization.md) shows how formal approvals line up with these steps.

Tickets stored inside your repository need no setup. To connect an issue tracker or share one planning folder across multiple repositories, see [Set Up the Ticket Tree](./set-up-the-ticket-tree.md).
