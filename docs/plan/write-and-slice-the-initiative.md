---
title: Write and Slice the Initiative
description: Talk to Sofia, the Product Owner, to turn a PRD, a brief, notes, or an idea into the initiative's requirements, settle open gaps, and split the work into epics.
sidebar:
  order: 3
---

Use Sofia, the Product Owner (`bmad-agent-po`), to turn your inputs into the working spec for the whole project. She distills what your documents say into clear, testable requirements, highlights what is still undecided, and breaks the initiative into epics in build order. Every later planning and coding step reads Sofia's spec instead of re-reading raw notes.

:::note[Prerequisites]
BMad installed. Tickets kept in your repository (the default) need no setup; to connect an issue tracker, see [Set Up the Ticket Tree](./set-up-the-ticket-tree.md).
:::

## Steps

### 1. Point Sofia at What You Have

Sofia sizes new work before creating folders so you never get more hierarchy than you need:

- One end-to-end behavior or bug fix stays a standalone ticket.
- Several stories for a single capability stay a standalone epic (`epic-<slug>/`).
- Multiple related capabilities become an initiative (`initiative-<slug>/`).
- Several coordinated initiatives roll up into a program (`program-<slug>/`) that nests each child initiative inside its own `tickets/` folder.

Tell Sofia what you want and name your inputs: "write the initiative from prd-check-in/", "distill this PRD", or "write the requirements from these notes". She accepts a PRD, a brief, a PRFAQ (Press Release / FAQ), call notes, UX designs, or a plain paragraph, and she can combine multiple inputs at once. When no active initiative is set yet, she creates the folder and records it as active.

From your inputs, Sofia writes the initiative's description, intended outcome, completion checks, requirements, constraints, and boundaries (what is explicitly out of scope). Every requirement and constraint keeps a stable tracking ID and points back to the source material it came from. Supporting tables, diagrams, and documents from other specialists stay beside the ticket as linked references rather than being copied and duplicated.

When your input is detailed, she extracts the spec without interrogating you. When your input is sparse, she names the missing pieces and walks through them with you; if you prefer to move forward and decide later, she records each unanswered point as an open question. If the idea still needs product discovery before writing requirements, she recommends starting a fresh chat with John for a PRD. For very long source documents (past about 50 KB), prepare them first with [Prepare Long Documents for Agents](./prepare-long-documents-for-agents.md).

### 2. Settle What She Could Not

After writing or updating the spec, Sofia reports how many requirements she captured, which companion documents are linked beside the ticket, and the result of her own consistency check. That check verifies that every requirement has a testable outcome and that no important claim from your source documents was dropped.

Next, she lists every assumption she had to make and every open question still unresolved. Walk through them with her and say whether each answer should update your source document, the ticket, or both. Every answer you confirm is recorded as a dated decision in the ticket's notes so future sessions know why the call was made. Read the requirement lines carefully yourself as well: fixing wording now, before epics and stories branch from it, is much faster than correcting downstream work later.

Let Sofia handle edits to the spec sections rather than editing them by hand. When an input changes later, bring the update back to her: she keeps existing requirement IDs intact and tells you which stories are now out of date.

### 3. Cut It into Epics

Ask Sofia to split the initiative into epics, and mention your own preferred breakdown if you already have one in mind:

```text wrap
/bmad-agent-po split this initiative into epics
```

If the initiative came from a PRD with an epic map, Sofia adopts that map directly and shows it once for your confirmation. Otherwise, she confirms the overall scope and proposes the epics, their build order, and what each epic depends on from earlier ones. Once you approve, she saves the ordered list in `tickets/tickets.toml` and creates an initial outline file for each epic (holding its description, outcome, boundaries, and known completion checks, marked as not yet refined). Detailed epic requirements wait until that epic's turn arrives: an epic with open product questions gets an epic PRD from John, while a straightforward epic is refined directly by Sofia.

Each epic should represent one cohesive capability that a user can see working on its own. If describing an epic takes an "and" joining two independent behaviors, it belongs as two epics. External systems that your work only configures or calls do not get their own epics; Sofia lists them as touch points in the initiative's boundaries along with which epic owns the integration.

After creating the epics, Sofia highlights any visual experience or shared technical decisions that span multiple epics, such as a design system, API contract, data format, or shared state rules. She offers fresh chats with Sally (`bmad-agent-ux-designer`) for UI-heavy initiatives without a UX design yet, and with Winston (`bmad-agent-architect`) to settle shared technical decisions. If you decline shared architecture, Sofia turns each shared technical decision into an explicit task in the opening epic that later epics wait on. Every slicing choice and declined recommendation is logged as a dated decision in the initiative's notes. See [Design UX and Architecture](./design-ux-and-architecture.md).

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office meeting-room app:

**You:**

```text wrap
/bmad-agent-po write the initiative from prd-check-in/
```

**Sofia:** Wrote `initiative-check-in.md`: 2 requirements and 1 constraint, and my consistency check passed. One assumption is still open: the 15-minute no-show window needs confirmation from facilities.

```markdown wrap
## Requirements
R1 (E01): A person checks in at their room's door tablet, which shows the room's bookings for the day.
R2 (E02): A room nobody checks into is freed and can be booked by anyone; freeing one day of a recurring booking leaves the rest of the series booked.

## Constraints
- A booked room nobody checks into within 15 minutes of its start is freed (INV-1).

## Notes
- Assumption: the 15-minute window in INV-1 is unconfirmed; facilities to confirm.
```

**You:** Facilities confirmed 15 minutes. Split this initiative into epics.

**Sofia:** Two epics, taken from the PRD's epic map: 1 Door check-in, then 2 Free no-show rooms, which needs check-ins to exist. Both depend on where the no-show timer runs. Want to settle that with Winston (`bmad-agent-architect`) in a fresh chat, or design the tablet screens with Sally (`bmad-agent-ux-designer`) first?
:::

## What You Get

For a standard multi-epic initiative, Sofia creates:

- `initiative-<slug>/initiative-<slug>.md`, the spec for the whole initiative, with any companion documents beside it
- `initiative-<slug>/tickets/tickets.toml`, the epics in build order
- One folder per epic under `tickets/`, each holding an outline epic file ready to refine when its turn comes

When your work fits a different scale, Sofia uses the matching container instead:

- For a single capability, she creates a standalone `epic-<slug>/` folder at the top of your store, holding its own `epic-<slug>.md` and `tickets/` breakdown without an extra initiative wrapper.
- For multiple initiatives, she creates a top-level `program-<slug>/` folder whose `tickets/` directory lists child initiatives in build order and nests each `tickets/initiative-<slug>/` folder underneath, so Sofia can roll up progress across the whole program while each initiative keeps its own epics and stories.
