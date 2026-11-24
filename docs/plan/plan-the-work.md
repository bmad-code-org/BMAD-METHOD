---
title: Plan the Work
description: 'The Plan stage: from a clear intent to stories ready to build. Follow the state of the initiative and its epics; John, Sofia, bmad-ux, and bmad-agent-architect each handle one step.'
sidebar:
  order: 1
---

Use this page when the work is bigger than one build session. Plan answers
three questions: what exactly, how, and in what order? It turns a clear intent
into the initiative's requirements, settles the decisions that separately
built parts must share, and breaks each epic into stories an agent can build
one session at a time.

| | Plan |
| --- | --- |
| **You start with** | A clear intent from Clarify, or one you already have: an issue, notes, a brief, an existing PRD |
| **You produce** | The initiative and epic files with their requirements; a PRD, UX files, and an architecture spine when the work needs them; each epic's stories in build order |
| **It is done when** | The next epic's stories are planned and you have approved them |
| **Skip it when** | The work fits one session: go to [Build a Change](../build/build-a-change.md) |
| **What comes next** | [Build and Verify](../build/build-and-verify.md): build the first story that is ready |

## Follow the Initiative's State

You do not need to remember the order. The next step always follows from the
state of the initiative file, then of each epic file. Ask Sofia, the Product
Owner (`bmad-agent-po`), "what's next?" at any point and she names it.

Sofia sizes new work first: one story or bug becomes a standalone ticket,
several stories stay one epic, and more than one epic becomes an initiative.
She proposes one epic unless a distinct outcome, or a part people can use
early, splits it.

With no initiative yet:

```text wrap
/bmad-agent-po write the initiative from my-notes.md
```

With one:

```text wrap
/bmad-agent-po what's next?
```

![The initiative's states in order, each with its next step: no initiative yet, Sofia writes it; open questions, Sofia walks them with you; not sliced, Sofia cuts it into epics; shared design, optionally bmad-ux, adopted; shared decisions, optionally bmad-agent-architect, adopted; epic not refined, Sofia refines it; no stories yet, Sofia plans them; stories ready, bmad-build, one per chat](/diagrams/plan-states.svg)

| State | Next step | Page |
| --- | --- | --- |
| No initiative yet | Sofia writes it from what you have | [Write and Slice the Initiative](./write-and-slice-the-initiative.md) |
| No initiative yet, and people must agree on what the product is | Optionally, John, the Product Manager, first writes a PRD or the planning document that fits | [Write a PRD](./write-a-prd.md) |
| Open questions or assumptions in the initiative | Sofia walks them with you | [Write and Slice the Initiative](./write-and-slice-the-initiative.md#2-settle-what-she-could-not) |
| Not sliced | Sofia cuts it into epics | [Write and Slice the Initiative](./write-and-slice-the-initiative.md#3-cut-it-into-epics) |
| The interface matters, or epics must share decisions | `bmad-ux`, `bmad-agent-architect`, then Sofia adopts their files | [Design UX and Architecture](./design-ux-and-architecture.md) |
| An epic not yet refined | Sofia works out what its stories must agree on | [Plan an Epic's Stories](./plan-an-epics-stories.md) |
| A refined epic with no stories | Sofia plans its stories | [Plan an Epic's Stories](./plan-an-epics-stories.md#2-plan-the-stories) |
| Stories ready | Build them | [Build and Verify](../build/build-and-verify.md) |

An input added later, such as a UX design or an edited PRD, goes back to Sofia
to update the initiative. She keeps every requirement id and tells you which
stories no longer match.

## Choose How Much to Write

Most work needs only the initiative and its epics. Add a document only when it
answers a question the work has:

| Add | When |
| --- | --- |
| A PRD | Several people must agree on what the product is, or several epics must not diverge; integrations or SLAs are involved |
| UX files | The interface is a significant part of the outcome |
| An architecture spine | Two epics, or two agents, could otherwise make incompatible choices, or the stack is still open |

UX goes before architecture, at the initiative and on each epic, so the design
can inform the technical choices. UX can also come earlier and feed the PRD.
The architecture spine comes after Sofia writes and slices the initiative,
because it reads it. For kept code, such as a kept prototype, it runs before
she slices, to record the decisions the code already made. Each can still run
on one epic instead of the whole initiative.
[Plan Inside an Organization](./plan-inside-an-organization.md) shows the order
sign-offs set.

Tickets kept in the repository need no setup. For a tracker, or a store
shared by several repos, see
[Set Up the Ticket Tree](./set-up-the-ticket-tree.md).
