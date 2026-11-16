---
title: Write a PRD
description: Write a PRD with John, the Product Manager, or another planning document with John or Mary, the Business Analyst. Covers stakes, the coaching and fast paths, assumption tags, and which document fits.
sidebar:
  order: 2
---

Use John, the Product Manager (`bmad-agent-pm`), when people must agree on
what the product is before anyone builds it. A PRD answers "what should we
build and why". It does not say how, and it does not divide the work; the
initiative, the architecture spine, and the stories do that. Write one when:

- Several people or teams must agree on the product
- Several epics must not diverge from one account of it
- Integrations or SLAs are involved
- Someone outside the team must approve what gets built: a sponsor, funding,
  or a launch

Across several initiatives, John writes a program PRD: outcomes, the
initiatives and their order, and shared rules. He adds a program charter when
governance is the question.

Skip it when one person decides and the intent fits in a few paragraphs: give
those to Sofia directly. A PRD is an optional input to the initiative, never a
prerequisite.

## Steps

### 1. Start with Everything You Have

Ask for John by name or say what you want, and point him at your inputs, such
as a brief, research, cited notes, or an existing PRD from Confluence or
Notion. With no initiative active, he first offers the `bmad` skill to create
one: accept, so the PRD and the initiative Sofia writes from it share one
folder. He opens with a brain dump: why the document exists, who will act on
it, and the full picture. Then, in a separate message, he echoes back the purpose, the reader,
and the stakes he read, so you can correct them.

### 2. Choose the Path

The coaching path, the default, is a conversation that steers back to the
sections still unfilled and pushes back where an answer is thin. The fast
path, when you ask for speed, asks what the template requires, topped up with
its own high-impact questions to three in all, then drafts the rest.

Either way he asks only what only you know and finds other facts himself. The
stakes change how hard he pushes and what he fills in without you:

| Stakes | What changes |
| --- | --- |
| Hobby or personal | One line can fill a section; a light review, or none |
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

Length fits the stakes, under a ceiling set by the level: about 3,000 words
for a program or an initiative, 2,000 for an epic, and two pages for hobby or
solo work. Past that, detail moves down a level. A PRD padded to look
thorough has failed.

### 3. Keep the First Version Small

Once the requirements are out, and before he settles the MVP scope, John
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
/bmad-agent-pm create a PRD for room check-in from the rooms call note and facilities-email.md
```

**John:** Tell me everything first: why this PRD, who acts on it, and every
input I should read.

After your brain dump:

**John:** Purpose: agree the check-in rules before anyone builds. Readers:
facilities and two developers. Stakes: internal. I'll coach unless you'd
rather take the fast path.

After the conversation, part of `prd-check-in/prd-check-in.md`:

```markdown wrap
## Features and requirements

### Door check-in
- FR-3: A person can check in at the room's door tablet.
- FR-4: Anyone at the door can see the room's bookings for the day.

### Freeing no-show rooms
- FR-1: Anyone can book a room freed under RULE-1.
- FR-2: An organizer keeps the rest of a recurring series when one day is freed.

## Rules
- RULE-1: A booked room nobody checks into within 15 minutes of its start is freed. [ASSUMPTION: 15 minutes; facilities to confirm]

## MVP scope
- Out: an email warning before a room is freed. Version two; the first version tests whether rooms free up at all.
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

`prd-<slug>/prd-<slug>.md` in the active initiative's folder. An initiative
PRD states capabilities, rules (`RULE-N`), measures, and non-goals with stable
ids, for Sofia to lift into the initiative's Requirements and Constraints.
Detailed edge cases are left to the epics. Run on one epic, the PRD goes in
the epic's folder and states testable requirements.

- **Sections:** Document purpose, Vision, Users and journeys, Glossary,
  Features and requirements, Non-goals, MVP scope, Success metrics, and Open
  questions, plus Rules at program or initiative level. Others join only when
  they apply: Stakeholders, risks and rollout (sign-offs, and an owner and
  needed-by date per rollout gate) when several teams are involved; Data and
  compliance; Integrations and operations.
- **Ids:** journeys `UJ-N`, requirements `FR-N`, rules `RULE-N`, success
  metrics `SM-N`, and open questions `OQ-N`.
- **Done when:** every FR traces to a journey or need, and above hobby stakes,
  every success metric names a counter-metric.

## Other Documents

Most work needs no planning document, or only one of these:

| Document | Who | Fits |
| --- | --- | --- |
| PRD | John | Requirements a team builds from, at any level |
| Light PRD | John | A very simple project when you still want a PRD; for hobby work John first offers a prototype plan |
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
