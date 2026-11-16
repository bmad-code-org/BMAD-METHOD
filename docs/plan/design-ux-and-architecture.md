---
title: 'Design UX and Architecture'
description: Decide whether the work needs a UX design or an architecture spine, run bmad-ux and bmad-architecture on the initiative or an epic, and have Sofia adopt their files so every build reads them.
sidebar:
  order: 4
---

Use this page to decide whether the work needs UX or architecture before
stories are planned. Most changes need neither. Work whose epics must share
decisions (stack, contracts, formats, hosting) needs an architecture spine;
epics that share none skip it.

| Work | UX and architecture |
| --- | --- |
| A clear, local change with established patterns | Usually unnecessary |
| Several related components with known constraints | Optional, depending on coordination risk |
| Several epics that must share decisions, or decisions that cross systems | Architecture keeps the builds consistent |
| A regulated, high-risk, or enterprise initiative | Follow your governance; architecture is normally required |

Sally, the UX Designer (`bmad-agent-ux-designer`), runs `bmad-ux`, and
Winston, the Architect (`bmad-agent-architect`), runs `bmad-architecture`.
Both change what `bmad-build` reads, not how it runs: each session still builds
one story, but every session reads the same decisions, so the parts fit
together.

At the initiative and on each epic, UX goes first and architecture second, so
the design can inform the technical choices. Architecture reads the
initiative, so both come after Sofia writes and slices it, though UX can also
lead earlier and feed the PRD or the initiative directly. BMad doesn't enforce
the order, so swap them when a technical constraint has to settle what the
screens can do. For kept code, such as a kept prototype, architecture runs
before Sofia slices, to record the decisions the code already made. Skip
either when it has no open questions.

When she slices, Sofia offers `bmad-architecture` for the decisions the epics
share, but she won't prompt for `bmad-ux`. Run it yourself when the epics need
a shared design system.

## Design the Experience

Run `bmad-ux` when the interface matters to the outcome; skip it for back-end
work and internal tools with no real interface. It records your vision, and
never volunteers its own, in two peer documents: `DESIGN.md` for how the
product looks (tokens, typography, components) and `EXPERIENCE.md` for how it
works (structure, states, interactions, accessibility, key flows). When either
conflicts with a mock, the document wins. With an existing design system,
`DESIGN.md` references its tokens and records only your changes, and `EXPERIENCE.md`
records only how your product behaves differently.

Choose a Fast path that drafts both with `[ASSUMPTION]` tags, a
Coaching path with creative tools such as color themes, design directions,
wireframes, and key-screen mocks, or a design handoff that prepares a
prompt for an external design tool and folds its output back in. Change the
files later with `bmad-ux` update, not by editing the ticket.

## Settle the Decisions Epics Share

When several epics or agents build against the same system, each makes its
own defensible choice, and the choices collide: REST here and GraphQL there,
`snake_case` meeting `camelCase`, session cookies against JWT. Run
`bmad-architecture` on the initiative to write a short architecture document,
the **spine**, that records only the calls two people would otherwise make
differently.

One test decides what belongs: if two units built this independently, could
they choose incompatibly? A decision goes in only when the answer is yes, the
call is non-obvious, and it is a real trade-off. Each decision gets a stable
id, `AD-1`, `AD-2`, that tickets cite, and the spine lists what it
deliberately leaves to the code.

Coaching is the default, so you need no architecture background: for each big
call (paradigm, stack or starter, major boundaries, deployment and hosting) it
lays out the realistic options and why it leans one way, then you choose. For
a new project it recommends a current, well-known starter, because a good one
settles a coherent set of decisions for free. On an existing codebase it reads
the code and confirms the conventions already there instead of re-documenting
them. On code an earlier initiative built, the code is the source of truth:
the spine ratifies the invariants it must keep, tagged `[ADOPTED]`, and
decides only what this initiative adds or changes. One session's worth of work
needs no spine.

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office's meeting-room app:

**You:**

```text wrap
/bmad-ux design the door tablet's check-in screen
```

It records the screen's four states in `EXPERIENCE.md`: free, booked and
waiting for check-in, checked in, and just freed. In a new chat:

**You:**

```text wrap
/bmad-architecture settle the decisions the check-in epics share
```
**`bmad-architecture`:** One call your epics would make differently: where the
no-show timer runs. On the server, an offline tablet can never free a room by
itself; on the tablet, check-in still works offline. I lean server. Which?

**You:** Server.

It records that as `AD-1` in `architecture-check-in/`. Then, to Sofia:

**You:**

```text wrap
/bmad-agent-po adopt the design and the spine
```
**Sofia:** Added both to the initiative's References; both epics cite `AD-1`,
and door check-in cites the design.
:::

## Adopt the Files into the Ticket

A design or a spine helps only if the builds find it. When either skill
finishes, ask Sofia to adopt its files:

```text wrap
/bmad-agent-po adopt the spine
```

She adds them to the initiative's References, and the epics that depend on
them cite them. A build then reads them beside its story. `bmad-architecture` recommends this
step itself when it finishes.

Either skill can also run on one epic when the initiative's design or spine
does not cover it. An epic run writes into the epic's folder. An architecture
run inherits the parent spine's decisions and records only what it left open;
for a UX run, ask it to cover only what the initiative's design leaves open.

:::caution[Common mistakes]
Deciding the API style "as we go", documenting every minor choice, and a spine
written once and never updated are the three ways this step fails. Record the
decisions that cross epic boundaries, and when one changes mid-flight, tell
Sofia ([Learn and Adjust](../learn/learn-and-adjust.md#a-change-mid-flight)).
:::
