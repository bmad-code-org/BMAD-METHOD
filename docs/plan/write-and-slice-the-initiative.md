---
title: Write and Slice the Initiative
description: Talk to Sofia, the Product Owner, to turn a PRD, a brief, notes, or an idea into the initiative's requirements, settle what she could not, and cut the initiative into epics.
sidebar:
  order: 3
---

Use Sofia, the Product Owner (`bmad-agent-po`), to write the initiative: the
ticket that is the spec for the whole piece of work. She lifts what your
inputs say into requirement lines with stable ids, names the gaps, and then
cuts the initiative into epics. Every later skill reads the initiative instead
of your original documents.

:::note[Prerequisites]
BMad installed. Tickets kept in the repository, the default, need no setup;
for a tracker, see [Set Up the Ticket Tree](./set-up-the-ticket-tree.md).
:::

## Steps

### 1. Point Sofia at What You Have

Sofia sizes new work first: one story or bug becomes a standalone ticket,
several stories stay one epic, and more than one epic becomes an initiative.
She proposes one epic unless a distinct outcome, or a part people can use
early, splits it.

Say what you want and name your inputs: "write the initiative from
prd-check-in/", "distill this PRD", or "write the requirements from these
notes". A PRD, a brief, a PRFAQ, cited notes, UX files, or an idea
explained in a paragraph all work, and she takes more than one. With no
initiative active, she creates `initiative-<slug>/` and records it as the
active initiative.

She writes the initiative's Requirements, one line each under a stable `R<n>`
id naming its source, such as `R1 (FR-1)`, and its Constraints, each citing
its source id, such as `(RULE-1)`. From a PRD, each capability becomes a
Requirements line and each rule a Constraints line, citing its id. The
input's non-goals go to Boundaries. On a new initiative she also writes its
Description, Outcome, and Done when: three to six checks at the level of your
source's ids. Read them as closely as the R lines. Tables, diagrams, and
documents other skills wrote stay beside the ticket and are named in its
References rather than copied.

She extracts rich input without asking questions. With sparse input she names
the gaps and walks them with you, Requirements then Constraints. Say you would
rather move on, and each gap becomes an `Open question:` line. To work an
idea out before she writes it, she offers John for a PRD. For something
lighter, ask Mary for a brief yourself. A long document goes in as the main
file `bmad-shard-pro` writes; see
[Prepare Long Documents for Agents](./prepare-long-documents-for-agents.md).

### 2. Settle What She Could Not

After each run she reports the requirement count, the companions (files
later skills read beside the ticket), and the verdict of her own check. The
check tests each line against her writing rules, such as a testable result
per requirement, and confirms that every source claim that matters reached
the ticket or a companion. Then she lists the `Assumption:` and
`Open question:` lines. Walk them with her. An answer can update the source,
the ticket, or both; say which. Each answer you confirm turns its
`Assumption:` into a dated `Decision:` line in Notes. Read the `R` lines
yourself too: now, before anything is cut from it, change any line you
would not defend to a stakeholder.

Sofia is the only writer of these sections, so don't edit them by hand.
When an input changes, run her again with the change: she keeps every id and
names the stories whose requirements changed.

### 3. Cut It into Epics

Ask for the cut, and tell her the split if you already have one in mind:

```text wrap
/bmad-agent-po split this initiative into epics
```

Before cutting epics, she asks you to confirm the scope. She proposes the
epics, their build order, and what each needs from the ones before, and
records the agreed order in the initiative's `tickets/tickets.toml`. Each
epic is written thin: its description, outcome, boundaries, and done-when as
far as they are known, marked `refined: false`.
Its requirements come later, when you refine it.

An epic is one capability, or a tightly coupled pair, delivered and deployed
together, and typically eight to twelve stories once planned. A service or
module is an epic only when it is also a deployment boundary. A unit the work
only consumes or configures gets no epic: Sofia lists it in the initiative's
Boundaries as a touch point, with the epic that owns it. If your team cuts
epics by its own rule, tell Sofia and she offers to save it to
`_bmad/custom/bmad-agent-po.toml`.

She then lists the decisions more than one epic must adopt, such as a
contract, a data format, or a shared value list, and offers `bmad-architecture`
to settle them. Decline, and each becomes a story in the opening epic that the
others wait on. See [Design UX and Architecture](./design-ux-and-architecture.md).
She records each slicing choice, and each suggestion you decline, as a dated
`Decision:` line in the initiative's Notes.

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office's meeting-room app:

**You:**

```text wrap
/bmad-agent-po write the initiative from prd-check-in/
```
**Sofia:** Wrote `initiative-check-in.md`: 4 requirements and 1 constraint,
and my check passed. One assumption is open: the 15-minute no-show window,
for facilities to confirm.

```markdown wrap
## Requirements
R1 (FR-1): A room freed for a no-show can be booked by anyone.
R2 (FR-2): Freeing one day of a recurring booking leaves the rest of the series booked.
R3 (FR-3): A person checks in at their room's door tablet.
R4 (FR-4): A door tablet shows its room's bookings for the day.

## Constraints
- A booked room nobody checks into within 15 minutes of its start is freed (RULE-1).

## Notes
- Assumption: the 15-minute window in RULE-1 is unconfirmed; facilities to confirm.
```

**You:** Facilities confirmed 15 minutes. Split this initiative into epics.

**Sofia:** Two epics, since they are two distinct outcomes: 1 Door check-in,
then 2 Free no-show rooms, which needs check-ins to exist. Both depend on
where the no-show timer runs. Settle that with `bmad-architecture`?
:::

## What You Get

- `initiative-<slug>/initiative-<slug>.md`, the spec for the whole initiative,
  with any companions beside it
- `initiative-<slug>/tickets/tickets.toml`, the epics in build order
- One folder per epic under `tickets/`, each holding a thin epic file

When the work is more than one initiative's worth, Sofia proposes a parent
initiative instead of nesting deeper: an ordinary initiative whose breakdown
lists child initiatives in build order, each in its own folder beside it.
