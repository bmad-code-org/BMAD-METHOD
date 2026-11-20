---
title: Clarify the Idea
description: "The Clarify stage: turn raw input, a vague idea, or an open decision into a clear intent, with bmad-ingest, brainstorming, Forge Idea, Deep Recon, Mary's PRFAQ, or a prototype."
sidebar:
  order: 1
---

Use this page when you are not yet sure what to build, or whether it is worth
building. Clarify answers two questions: why build it, and is it worth it?
Its tools are independent. Pick the ones the gap calls for, in any order.
No skill here writes tickets.

| | Clarify |
| --- | --- |
| **You start with** | A transcript, a thread, a pile of notes, a half-formed idea, or a decision you cannot make yet |
| **You produce** | A short document that states the idea, or a decision not to build it |
| **It is done when** | You can say what should be true when the work is done, what must not change, and what is out of scope |
| **Skip it when** | The intent is already written down and agreed: a good issue, an existing PRD, a clear paragraph |
| **What comes next** | [Plan the Work](../plan/plan-the-work.md), or [Build a Change](../build/build-a-change.md) when the idea turns out to be one small change |

Start with Mary, the Business Analyst (`bmad-agent-analyst`). She runs
brainstorming and research for you, and writes the brief or PRFAQ. Each skill
also runs on its own.

```text wrap
/bmad-agent-analyst I have an idea for check-in at meeting-room doors; help me work out whether it is worth building
```

| You have | Ask | You get |
| --- | --- | --- |
| A recording, a transcript, a thread, or a pile of notes | `bmad-ingest` | A note where every item cites its source |
| A topic and no idea yet | Mary, or `bmad-brainstorming` | Far more options than you would find alone, and the few you keep |
| One idea you are unsure of | `bmad-forge-idea` | A verdict: hardened, killed, or clearer |
| A decision that depends on the market or a vendor | Mary, or `bmad-deep-recon` | A cited research summary with a recommendation |
| A question about how your own code works | `bmad-deep-recon` on your repository | A cited account of how it works and why, with no recommendation |
| Doubts that the concept deserves money or people | A PRFAQ from Mary, or a prototype | A verdict on the concept, or something real to show people |
| A startup idea, and the business around it | Nadia, the Founder Advisor, from the optional [Founder module](../customize/add-modules.md) | A startup diagnostic that ends in one dated assignment, or a validation experiment with its pass mark set first |

## Turn Raw Input into Notes

Planning skills work best on conclusions, not on a recording of how people
reached them. Give `bmad-ingest` a transcript, a chat or email thread, a voice
memo, or a long document, and it writes a note a later session can act on.
Every item points back to where it was said: a timestamp, a section, or a
message's date and speaker. Owners, dates, and conditions appear only as the
source states them, and anything it leaves unsettled goes under a last
section, "Unclear in the source".

The original is kept unchanged: a file from outside the project is copied to
`_bmad-output/raw/`, and the note goes to `_bmad-output/notes/` unless you name
another folder. It picks a template, such as a meeting or a user interview,
and says why. Ask for one combined note when several sources belong together,
for example every stakeholder conversation about one decision, so that
conflicting accounts sit side by side.

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office's meeting-room app, the office manager and the
facilities lead spent a call on rooms that are booked and never used.

**You:**

```text wrap
/bmad-ingest ~/Downloads/rooms-call.txt
```
**`bmad-ingest`:** Meeting template: two people settling a rule. I kept the
transcript in `_bmad-output/raw/` and wrote the note to `_bmad-output/notes/`.
One item is unclear in the source: when a room counts as unused, the office
manager said ten minutes [00:12:40] and facilities said fifteen [00:13:05].

The note also records the decision to free unused rooms, and that a recurring
series is never cancelled whole [00:27:05].
:::

## Generate or Pressure-Test an Idea

With no idea yet, ask Mary to brainstorm, or run `bmad-brainstorming` with a
topic and a goal. Pick a stance: Facilitator (every idea is yours), Creative
Partner (it trades ideas with you), or Ideate for me (it runs the session
itself). When a batch stops producing, choose another technique, converge, or
wrap up. At the end you choose what to keep: an HTML keepsake of the session
and a short summary of the chosen ideas that later skills read.

With one idea you are unsure of, run `bmad-forge-idea` with the idea in a
sentence or two. It asks your goal (clarify it, test whether it holds, or make
it better) and whether the idea changes an existing product. Then it argues
with you one question at a time; say "attack this", "defend this", or "switch
roles" to change how a point is argued. Every session ends on a stamped
report: Hardened, Killed, or Clarified. Killing an idea here is a good result,
and it costs little. Every session also keeps `forge-<slug>.md`, its running
record; for a hardened idea it holds the decisions and the options rejected.

## Research a Decision

Ask Mary to research, or run `bmad-deep-recon` with the decision, not the
topic: "help me choose a door tablet: an iPad in kiosk mode or an Android
room-display panel". It offers three services you can combine. Run does the
research here, after you approve a plan of the questions and the effort.
Draft writes a prompt for your own research tool, and Process turns that
tool's report into the same summary. Whichever you use, you get
`research-<topic>.md`, every claim with its source and date. A choice between
candidates ends with a pick, a runner-up, and the strongest argument against
the pick. Ask it later to refresh the claims that age fastest, or to deepen
one area.

Point it at your own repository and it researches the code and its git
history instead of the web, which helps before changing an unfamiliar
system. You get a cited account of how the code works and why, with no
recommendation: what to change stays with you.

## Decide Whether It Is Worth Building

| | A PRFAQ from Mary | A prototype |
| --- | --- | --- |
| **How it answers** | By arguing the concept and researching its market claims | By building something people can try |
| **Use it when** | You are about to commit real money or people, or you lead with a solution instead of a customer problem | You need to know whether people want it, whether it can be built, or where the effort is |
| **Ends with** | A press release, hard customer and internal FAQs, and a verdict, in `prfaq-<slug>/prfaq-<slug>.md` with a press-release page in HTML beside it | Notes on what it taught you, and a decision to keep it, throw it away, or drop the idea |

Ask Mary, the Business Analyst (`bmad-agent-analyst`), for a PRFAQ:

```text wrap
/bmad-agent-analyst create a PRFAQ for check in or lose the room
```

She takes its four parts in order, finishing each before
the next: the press release, the customer FAQ, the internal FAQ on
feasibility, viability, resources, and risk, and the verdict, written last.
Her role changes with the part: an editor for the press release, a skeptical
customer, then the stakeholder panel. The verdict is narrative, not a score:
what is solid, what needs more work before a PRD, and what could sink the
concept, each weakness with what it would take to fix, so you can deal with what
could sink it before you plan.

If you already believe in the product and want it written down, ask Mary for a
brief instead; see [Document Templates](../reference/document-templates.md#documents-john-and-mary-write).

A throwaway prototype needs no skill: prompt your agent directly. John, the
Product Manager (`bmad-agent-pm`), writes a prototype plan when you want the
run recorded, its Outcome noting whether the idea held; for thresholds set in
advance, use the experiment card. Once the prototype plan is final, John
offers to build it with `bmad-build-auto`, then asks you to keep it, throw it
away, or drop the idea. Make that choice on purpose. If you throw the
prototype away, its notes are some of the best input Sofia can get. If you
keep it, it is an existing codebase and needs a spec like any other.

For a funding decision, ask Mary for a business case; to judge a problem
before any solution, an opportunity assessment; for a leadership strategy, a
strategy narrative.

## Hand On a Clear Intent

The next stage reads what you hand it, so hand it the conclusion, not the
pile. A clear intent says what should be true when the work is done, what must
not change, and what is out of scope: complete enough that someone else could
build it without guessing, and no longer than that. Where it came from does
not matter.

Keep it short. Turn a pile of raw input into a note with `bmad-ingest`. Past
about 50,000 characters, run `bmad-shard-pro` on a document you will keep and
edit, such as an old spec; agents read long files badly. It splits the
document or adds a contents list, and you hand on the main file; see
[Prepare Long Documents for Agents](../plan/prepare-long-documents-for-agents.md).
To improve any draft before you hand it on, point `bmad-advanced-elicitation`
at it: it reads the draft independently and returns one revision for you to
accept or reject.
