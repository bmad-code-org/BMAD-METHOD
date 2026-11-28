---
title: Write a PRD
description: Write a PRD with John, the Product Manager, or another planning document with John or Mary, the Business Analyst. Covers stakes, working modes, assumption tags, and choosing the right level.
sidebar:
  order: 2
---

Use John, the Product Manager (`bmad-agent-pm`), when people must agree on what a product should do before anyone starts coding. A PRD (Product Requirements Document) answers what to build and why without dictating how engineers should implement it. It works at two main levels: a concise PRD for work spanning several capabilities that maps out the epics, and a detailed epic PRD written when a specific epic's turn arrives. Write a PRD when:

- Several people or teams must agree on the product
- Several epics must stay aligned with one shared definition
- External integrations or service-level agreements (SLAs) are involved
- Someone outside the build team must approve scope, funding, or launch

Across several initiatives, John writes a program PRD covering portfolio outcomes, initiative order, and shared rules, or a program charter when governance is the main question.

The right document depends on the size of the work, not on team size or deadlines:

| The work is | Level | Written as |
| --- | --- | --- |
| One end-to-end user behavior | Story | A story ticket from Sofia |
| Several stories for one capability | Epic | An epic PRD |
| Several capabilities sharing outcomes, rules, or concepts | Initiative | A concise initiative PRD with its epic map |
| Several coordinated initiatives | Program | A program PRD, or a program charter for governance |

Start at the lowest level that holds the work; John moves up a level if the scope proves larger.

Skip a PRD when one person makes the calls and the goal fits in a few paragraphs: hand those notes straight to Sofia. A PRD is an optional input to your initiative, never a prerequisite.

## Steps

### 1. Start with Everything You Have

Ask for John by name, describe what you want to achieve, and point him at any existing material such as a product brief, research notes, call summaries, or an existing PRD from Confluence or Notion. You do not need to know which document type fits: John proposes the right one, explains why, names close alternatives, and waits for your confirmation before starting. If you already ask for "a PRD", he skips that selection step.

If no active initiative is set yet, John first offers to set one up with the `bmad` skill so the PRD and the initiative Sofia later writes share the same folder.

Next, John asks whether this is a new product or a change to an existing one (unless you already said) and invites a quick brain dump: who the product is for, what they do with it, what must be true when it ships, and any files he should read. In a separate reply, he plays back the purpose, audience, and stakes he heard so you can correct him early. Before drafting any section, he asks the few big questions whose answers ripple across the whole document, such as who buys it or what it must never do.

### 2. Choose the Mode

By default, John works in `freeform` mode: you talk naturally across topics while he updates the document quietly in the background and plays back major decisions as they settle. You can switch anytime to `step-by-step` to walk through sections in order, or ask for `fast` mode so he asks only the high-impact questions and drafts the rest with `[ASSUMPTION]` tags for you to review. To change the default mode for yourself or your team, invoke `bmad-customize` and tell it which mode you prefer for planning documents.

In every mode, John asks only for judgment calls that belong to you and looks up other facts himself. The stakes of the project change how hard he pushes and what he fills in on his own:

| Stakes | What changes |
| --- | --- |
| Hobby or personal | Short answers can fill a section; no automated review passes run |
| Internal, investor pitch, publication, or public launch | He fills gaps himself, marks each with `[ASSUMPTION]`, and pushes back harder as stakes rise |
| Regulated or contracted | He asks instead of guessing and invents no regulation, citation, or threshold |

Read every `[ASSUMPTION]` tag carefully: any guess that only a stakeholder can confirm is a question for that person, not something to accept blindly. Confirm items one by one, because a blanket "accept everything" leaves tags open. When you finalize, John walks through any assumption that blocks a decision one at a time and moves lower-priority unknowns to open questions. If a document finishes in an unattended (non-interactive) run, or if you approve a batch at once, any unconfirmed tags are collected into a closing Assumptions list so nothing hides in the prose.

Document length stays bounded by its level: roughly 2,000 words for an initiative PRD, up to 3,000 for a program PRD, and roughly 2,000 for an epic PRD. Extra detail belongs one level down rather than bloating the parent document.

### 3. Keep the First Version Small

Once the epic map is on the table and before scope locks in, John checks what you asked for against your team and timeline. When the plan looks ambitious, he says so, points out what can wait and why, and makes the case for a smaller first version you can finish, test, and learn from. He pushes hardest when you are validating a new idea, eases off when a mandate or regulation fixes scope, and skips this check when the plan is already lean. The final call is always yours.

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office meeting-room app, you have a call summary from `bmad-ingest` about rooms booked and left empty, plus `facilities-email.md` with facilities' rules.

**You:**

```text wrap
/bmad-agent-pm Help me work out room check-in: rooms get booked and never used. Read the rooms call note and facilities-email.md
```

**John:** A PRD fits this because people need to agree on the check-in rules before anyone builds. If you first need to decide whether it is worth doing at all, an opportunity assessment comes before it. Start the PRD?

**You:** Yes, the PRD.

**John:** Tell me everything first: why this PRD, who acts on it, and every input I should read.

After your brain dump:

**John:** Purpose: agree on the check-in rules before anyone builds. Readers: facilities and two developers. Stakes: internal. We will work freeform; say step-by-step or fast to switch, or tell me to finish anytime.

After the conversation, part of `prd-check-in/prd-check-in.md` looks like this:

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

Finalizing settles every assumption that blocks a decision and asks you to verify the three calls John is least confident about. You can pause and resume in a fresh chat anytime because the document marks which sections are still open. Each open question records an owner, when an answer is needed, and what it blocks; John never guesses names, owners, or dates.

Ask John to **validate** a PRD to get a review report in chat without editing the file, with an option to apply fixes afterward. Ask him to **update** a PRD when requirements change so he reconciles conflicts with earlier decisions before editing anything. When a PRD changes after Sofia has already created the initiative, bring the updated PRD back to Sofia; see [Learn and Adjust](../learn/learn-and-adjust.md#a-change-mid-flight).

## What You Get

An initiative PRD lands in `prd-<slug>/prd-<slug>.md` inside the active initiative's folder, ready for Sofia to distill into the initiative's requirements and epic split. An epic PRD lands inside that epic's folder, where Sofia uses it to refine the epic and plan stories.

### The PRD for several capabilities

This document stays short on purpose (a ten- to fifteen-minute read) and avoids exhaustive low-level requirement lists.

- The document covers eight sections: Problem and users, OKRs (Objectives and Key Results), Scope and non-goals, Invariants, Shared nouns and seams, Journeys, Epic map, and Deferred decisions and risks.
- Conversation order differs from document order: after your brain dump, John proposes the epics first, then settles scope, OKRs, hard rules, and shared concepts, and finishes with deferred decisions and which epic goes first.
- Each entry in the epic map is one cohesive capability a user can see working on its own, described in three to five lines with one verifiable outcome and the OKRs it moves.
- Details that belong to only one epic are parked under that epic's entry in your own words so nothing gets lost without cluttering the rest of the PRD.
- John runs a right-sizing check as scope takes shape: if the work turns out to be a single capability, he offers an epic PRD instead, and if capabilities share no goals, rules, or concepts, he flags that they look like separate initiatives and asks which to tackle first.
- OKRs are written in three bands: Passable (minimum to ship), Good (target for this delivery), and Excellent (stretch goal), along with how production will measure them, and any band you have not confirmed stays marked as his proposal.
- Invariants record non-negotiable pass/fail rules (such as permissions, audit trails, or legal rules) that every epic inherits, kept separate from graded OKRs.
- The PRD is ready to slice once OKRs are agreed, hard rules and shared concepts are settled enough that the first epic will not paint the second into a corner, deferred decisions have owners, and the first epic is picked.

### The PRD for one epic

Write an epic PRD when an epic's turn arrives and it still has open product questions. Ask John for "the PRD for epic E02" and point him at the parent PRD if you have one.

- The document covers Context, Journeys and flows, Requirements, Rules, edge cases and failure modes, Instrumentation, Chunky story slice map, and Open questions, plus Seams, Product specifics, and Changes to the parent when they apply.
- John inherits settled context by reading the parent PRD, the notes saved for this epic, and the code already built, playing back what is already decided and asking only what this epic adds (which OKRs it moves, which target band it aims for, and what stays out).
- Requirements are distilled from the user journeys and edge cases you walk through and numbered with the epic's prefix (such as `E02-FR-07`) so every requirement is testable and traces back to a journey or rule.
- A chunky story slice map proposes right-sized, end-to-end stories for the epic along with a full coverage table mapping every functional requirement and measurement check to an owning story, which Sofia adopts directly when slicing stories.
- If detailed epic discovery uncovers a change to a shared rule, concept, or sibling epic, interactive runs can apply agreed updates directly back to the parent PRD with your confirmation.
- When written standalone without a parent PRD, the Context section captures a concise summary of the problem, non-goals, three-band key results, and invariants.
- Branching journeys, state lifecycles, and multi-system exchanges are drawn as diagrams instead of long paragraphs wherever prose drags.

## Other Documents

Most projects need no planning document or only one of these:

| Document | Who | Fits |
| --- | --- | --- |
| Initiative PRD | John | Outcomes, guardrails, and epic map for work spanning several capabilities |
| Epic PRD | John | Detailed requirements and story slice map for one capability when its turn arrives |
| Prototype plan | John | A personal project or an idea to test before committing |
| Product brief | Mary, the Business Analyst (`bmad-agent-analyst`) | Explaining why to build a product, or pitching it, in one or two pages |
| Requirements specification | John | A regulated or contracted baseline with traceable, verifiable requirements |
| Business requirements document (BRD) | Mary | What business stakeholders sign off on before a PRD when an external party builds, a sponsor signs, or a regulator expects it |

Ask for a document by name, or describe what you are trying to decide and let John or Mary suggest the right fit. Every document they write supports creating, updating, and validating in the same way. For the full catalog and template IDs, see [Document Templates](../reference/document-templates.md#mary-and-john-analysis-and-product). To add company-specific questions or standards to every PRD, see [Customize a Document for Your Team](../customize/customize-a-document-for-your-team.md).
