---
title: Write a PRD
description: Write a PRD with John, the Product Manager, or another planning document with John or Mary, the Business Analyst. Covers stakes, step-by-step, freeform and fast modes, assumption tags, and which document fits.
sidebar:
  order: 2
---

Use John, the Product Manager (`bmad-agent-pm`), when people must agree on
what the product is before anyone builds it. A PRD answers "what should we
build and why". It does not say how. It comes at two levels: a thin PRD for
work with several capabilities, which names the epics, and a detailed PRD for
one epic, written when that epic's turn comes. Write one when:

- Several people or teams must agree on the product
- Several epics must not diverge from one account of it
- Integrations or SLAs are involved
- Someone outside the team must approve what gets built: a sponsor, funding,
  or a launch

Across several initiatives, John writes a program PRD: outcomes, the
initiatives and their order, and shared invariants. He adds a program charter when
governance is the question.

Which document depends on the work itself, not on team size or time:

| The work is | Level | Written as |
| --- | --- | --- |
| One story: one end-to-end behavior | Story | A story ticket from Sofia |
| More than one story of one capability | Epic | The epic PRD |
| Several capabilities that share outcomes, invariants or nouns | Initiative | The PRD, thin, with its epic map |
| Several initiatives | Program | The program PRD (`prd-program`), or a charter (`charter`) for governance |

Start at the lowest level that holds the work; John moves it up when it proves
bigger.

Skip it when one person decides and the intent fits in a few paragraphs: give
those to Sofia directly. A PRD is an optional input to the initiative, never a
prerequisite.

## Steps

### 1. Start with Everything You Have

Ask for John by name, tell him what you're trying to achieve, and point him at
your inputs, such as a brief, research, cited notes, or an existing PRD from
Confluence or Notion. You don't need to name a document: he proposes the one
that fits, says why, and names close alternatives, and nothing starts until you
confirm. Naming one, as in "a PRD", skips that choice. With no initiative active, he first offers the `bmad` skill to create
one: accept, so the PRD and the initiative Sofia writes from it share one
folder. He opens the way the document's template says. For a PRD he asks whether this is a new product or a change to one, unless your request answered it, and for a brain dump: who it is for, what they do with it, what must be true when it ships, and every input he should read. Then he asks whether there is anything else. In a separate message he echoes back the purpose, the reader and the stakes he read, so you can correct them. Before the first section he asks the few questions whose answers would change several sections, such as who buys it or what it must never do, so the big forks are settled before any section depends on them.

### 2. Choose the Mode

By default John works through a PRD in `freeform` mode (`prd-program` starts in `step-by-step`) — talking naturally across topics, updating the document quietly in the background, and playing back major decisions as they settle. Switch anytime to `step-by-step` to walk sections one at a time in order, or ask for `fast` (or speed) and he asks the essentials plus high-impact questions before drafting the rest with `[ASSUMPTION]` tags. To make one mode the start for every document, for yourself or your team, ask `bmad-customize` to set `mode` for `bmad-facilitate`.

Either way he asks only what only you know and finds other facts himself. The
stakes change how hard he pushes and what he fills in without you:

| Stakes | What changes |
| --- | --- |
| Hobby or personal | One line can fill a section; no reviewers run |
| Internal, pitch or investor, publication, public launch | He fills gaps himself, tags each `[ASSUMPTION]`, and pushes back harder as the stakes rise |
| Regulated or contracted | He asks instead of guessing, and invents no regulation, citation, or threshold |

Read every tag: one that only a stakeholder can settle is a question to take
to that person, not a guess to accept. Accept each item one by one; a blanket
"take your recommendations" leaves the tags open. A tag stays where it is
until you accept that item. At Finalize, John settles the tags that block a
decision, one at a time, and defers the rest to the PRD's open questions.
After a headless run, or a yes to a group, the tags still open move to the
template's assumptions section or a closing `## Assumptions` list, one line
each.

Length fits the stakes, under a ceiling set by the level: about 2,000 words
for an initiative, 3,000 at most for a program, and about 2,000 for an epic. Past that, detail moves down a level. A PRD padded to look
thorough has failed.

### 3. Keep the First Version Small

Once the epic map is proposed, and before he settles the scope, John
steps back and weighs what was asked for against the team and the date. When
it looks ambitious, he says so, names what could wait and why, and argues for
a first version small enough to finish, test, and learn from. He presses
hardest when the work tests an idea, eases off where a mandate or regulation
fixes the scope, and skips this when the work is already lean. The call is
yours: what you keep stays.

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office's meeting-room app:

You have the cited note `bmad-ingest` wrote from a call about rooms booked and
never used, and `facilities-email.md`, where facilities set out its rules.

**You:**

```text wrap
/bmad-agent-pm Help me work out room check-in: rooms get booked and never used. Read the rooms call note and facilities-email.md
```

**John:** A PRD fits this: the check-in rules people must agree on before
anyone builds. If you first need to decide whether it's worth doing at all, an
opportunity write-up comes before it. Start the PRD?

**You:** Yes, the PRD.

**John:** Tell me everything first: why this PRD, who acts on it, and every
input I should read.

After your brain dump:

**John:** Purpose: agree the check-in rules before anyone builds. Readers:
facilities and two developers. Stakes: internal. We'll work freeform;
say step-by-step or fast to switch, or tell me to finish anytime.

After the conversation, part of `prd-check-in/prd-check-in.md`:

```markdown wrap
## Invariants
- INV-1: A booked room nobody checks into within 15 minutes of its start is freed. [ASSUMPTION: 15 minutes; facilities to confirm]

## Epic map

### E01 Door check-in
A person arriving at a booked room checks in at its door tablet, and anyone at the door can see the room's bookings for the day. Done when a check-in at the tablet shows on the booking. Moves OKR-1.

Saved for this epic:
- The tablet should show the next free slot too.

### E02 Free no-show rooms
A room nobody checks into is freed under INV-1 and can be booked by anyone; a recurring series keeps its other days. Done when a no-show room appears as free. Moves OKR-1. Needs check-ins from E01.

First: E01, because E02 has nothing to act on without check-ins.
```
:::

## Finalize, Validate, and Update

Finalize settles the blocking tags as in step 2 and asks you to read the
three decisions it is least sure of. Sessions pause and resume: a new chat
picks up from the document, which marks the sections still open. Each open
question (`OQ-N`) names an owner, when it is needed, and what it blocks.
Names, owners, and dates come from you; John never guesses them.

Validate reviews the PRD without changing it, gives you the findings in the
conversation, and offers an update from them. Update
reconciles the PRD with a change and shows conflicts with earlier decisions
before it applies anything. When the PRD changes after the initiative is
written, run Sofia again with it; see
[Learn and Adjust](../learn/learn-and-adjust.md#a-change-mid-flight).

## What You Get

`prd-<slug>/prd-<slug>.md` in the active initiative's folder, for Sofia to
lift into the initiative's Requirements and Constraints and to use as the
split into epics. An epic's PRD lands in its own folder inside that epic's
folder, where Sofia refines the epic from it.

### The PRD for several capabilities

Thin on purpose: ten to fifteen minutes to read, and no requirement lists.

- **Sections:** Problem and users, OKRs, Scope and non-goals, Invariants,
  Shared nouns and seams, Journeys, Epic map, and Deferred decisions and
  risks.
- **The conversation runs in a different order from the document.** After
  your brain dump John proposes the epics, then works scope, OKRs, invariants
  and shared nouns, and ends with what is deferred and which epic goes first.
- **Epic map:** the epics are the work's cohesive capabilities, taken from the
  journey you described: each is something a person could see working by
  itself. John proposes them in his read-back and you confirm or reshuffle.
  Each gets three to five lines, with one outcome someone could check and the
  OKRs it moves. Nothing is said here about how a team will deliver it.
- **A detail that belongs to one epic** is saved under that epic, in your
  words, and stays out of every other section. That is how the PRD stays thin
  without anything being lost.
- **One capability only:** John says so and offers the epic PRD. Capabilities
  that share no outcome, invariant or noun: he says it looks like more than
  one initiative and asks which to take first.
- **OKRs (`OKR-N`):** John asks what you want shown when it ships and who
  judges it, then proposes key results in three bands for you to react to:
  Passable (the floor to ship), Good (the target for this delivery) and
  Excellent (the long-horizon stretch). Each names how production will
  measure it. A band you have not reacted to stays marked as his proposal.
- **Invariants (`INV-N`):** pass or fail, with nothing graded: who may see
  what, an audit trail, a legal obligation. Anything that can be better or
  worse is an OKR. Every epic inherits them.
- **Done when it is ready to slice, not complete:** the OKRs are agreed, the
  invariants and shared nouns are settled enough that the first epic will not
  corner the second, every deferred decision names who settles it, and the
  first epic is chosen.

### The PRD for one epic

Written when the epic's turn comes and it still has open product questions,
with its own template, `prd-epic`. Ask
John for "the PRD for epic E02" and point him at the parent PRD.

- **Sections:** Context, Journeys and flows, Requirements, Rules, edge cases
  and failure modes, Instrumentation, and Open questions. Seams, Product
  specifics and Changes to the parent join when they apply.
- **It inherits.** John reads the parent PRD, what it saved for this epic and
  the code built so far, plays back what is known, and asks only what this
  epic adds: which OKRs it moves, to which band, and what is out.
- **Requirements** are distilled from the journeys and rules you walk through,
  ten to twenty-five of them, numbered with the epic's id, such as
  `E02-FR-07`.
- **With no parent PRD,** Context carries a short version of what a parent
  would have settled: the problem, what is out, a few key results in three
  bands, and the invariants.
- **Pictures:** a journey that branches, a noun that moves through states and
  an exchange between systems are drawn in place of prose.

## Other Documents

Most work needs no planning document, or only one of these:

| Document | Who | Fits |
| --- | --- | --- |
| PRD | John | Outcomes, guardrails and the epic map for work with several capabilities |
| Epic PRD | John | One capability's detailed requirements, written when its turn comes |
| Prototype plan | John | A hobby project, or an idea to try before committing |
| Brief | Mary, the Business Analyst (`bmad-agent-analyst`) | Why to build a product, or pitching it, in a page or two |
| Requirements specification | John | A regulated or contracted baseline: traceable, verifiable requirements |
| Business requirements document (BRD) | Mary | What the business signs for, before a PRD, when a separate party builds, a sponsor signs, or a regulator expects it |

Ask for a document by name, or describe the work and let the agent pick, say
why, and name close alternatives. Every document John and Mary write works the
same way: create, update, or validate. The full list, from the opportunity
assessment to the launch plan, is in
[Document Templates](../reference/document-templates.md#documents-john-and-mary-write).
To make every PRD ask the questions your company cares about, see
[Customize a Document for Your Team](../customize/customize-a-document-for-your-team.md).
