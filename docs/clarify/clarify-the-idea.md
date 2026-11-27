---
title: Clarify the Idea
description: "The Clarify stage: turn raw input, a vague idea, or an open decision into a clear intent with Mary, Sally, bmad-ingest, brainstorming, Forge Idea, Deep Recon, PRFAQs, or a prototype."
sidebar:
  order: 1
---

Use this stage when you are not yet sure what to build, or whether an idea is worth building at all. Clarify answers two questions: why build it, and is it worth the effort? Its skills and agents work independently, so pick only the ones your current gap calls for, in any order. Nothing in this stage creates engineering tickets.

| | Clarify |
| --- | --- |
| **You start with** | A recording, transcript, message thread, pile of notes, rough hunch, or an open strategic decision |
| **You produce** | A concise decision document or clear intent, or a reasoned decision not to build it |
| **It is done when** | You can state what must be true when finished, what must not change, and what stays out of scope |
| **Skip it when** | The intent is already clear and agreed, such as a sharp issue, an existing PRD, or a settled paragraph |
| **What comes next** | [Plan the Work](../plan/plan-the-work.md), or [Build a Change](../build/build-a-change.md) if the idea turns out to be a single self-contained change |

Start with [Mary, Business Analyst](../agents/mary-analyst.md) (`bmad-agent-analyst`). Talk through your rough idea with her to brainstorm options, research markets or your own codebase, pressure-test assumptions, or draft a decision document. Each underlying skill can also run on its own.

```text wrap
/bmad-agent-analyst I have an idea for check-in at meeting-room doors; help me work out whether it is worth building
```

| You have | Talk to or run | You get |
| --- | --- | --- |
| A recording, transcript, thread, or pile of notes | `bmad-ingest` | A clean note where every takeaway cites its exact source |
| A broad topic and no clear direction yet | Mary, or `bmad-brainstorming` | A wider set of options than you would reach alone, narrowed to the few worth keeping |
| One idea you want stress-tested | `bmad-forge-idea` | A clear verdict: hardened, killed, or clarified |
| A decision that depends on markets, competitors, or vendors | Mary, or `bmad-deep-recon` | A cited research summary with an explicit recommendation |
| Questions about how your existing codebase works | `bmad-deep-recon` on your repository | A cited factual account of how the code works and why, with zero recommendations |
| Doubts that a concept deserves budget or engineering time | A PRFAQ from Mary, or a quick prototype | A candid verdict on the concept, or something real people can react to |
| Questions about what drives your users before locking scope | [Sally, UX Designer](../agents/sally-ux-designer.md) | A clear map of user goals, motivations, and hesitations to guide product and screen choices |
| A startup idea and the business around it | [Nadia, Founder Advisor](../founder/founder.md) | A startup diagnostic ending in one dated assignment, or a validation experiment with pass criteria set up front |
| Non-code ideation, storytelling, talks, or systems thinking | [Clio, Creative Director](../creative/creative.md) | Voice-grounded talks, writing, workshops, visual decks, and non-software creative problem solving |

## Turn Raw Input into Notes

Planning skills work best on settled takeaways rather than raw transcripts of how people debated them. Give `bmad-ingest` a call transcript, chat thread, email chain, voice memo, or long document, and it extracts a structured note that later sessions can read cleanly. Every item cites where it came from (a timestamp, section, or speaker and date), records owners and deadlines only when stated explicitly, and places unresolved contradictions under a dedicated "Unclear in the source" section.

`bmad-ingest` preserves your original file untouched in your output folder and saves the clean note beside it. It picks a fitting structure (such as a meeting summary or user interview) and explains its choice. When multiple sources cover the same topic, ask for a single combined note so conflicting accounts sit side by side.

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office meeting-room app, the office manager and facilities lead held a call about rooms that get booked and left empty.

**You:**

```text wrap
/bmad-ingest ~/Downloads/rooms-call.txt
```

**`bmad-ingest`:** Meeting format: two stakeholders settling a policy. I archived the original transcript and saved the structured note in your output folder. One point is unclear in the source: the office manager said a room counts as unused after 10 minutes `[00:12:40]` while facilities said 15 minutes `[00:13:05]`.

The note also captures the agreed rule to free unused rooms and confirms that recurring series are never cancelled as a whole `[00:27:05]`.
:::

## Generate or Pressure-Test an Idea

When you are starting from a blank page, ask Mary to brainstorm or invoke `bmad-brainstorming` with your topic and goal. Choose how actively you want it to participate: Facilitator (all ideas come from you), Creative Partner (it trades ideas back and forth), or Ideate for me (it generates batches for you to judge). You can switch creative techniques, converge on finalists, and save both an interactive HTML keepsake and a short summary that later planning skills read directly.

When you already have a specific idea and want to test whether it holds up, run `bmad-forge-idea` with a one- or two-sentence summary. It asks what you want from the session (clarify it, test its viability, or strengthen it) and whether it modifies an existing product, then probes one question at a time. Say "attack this," "defend this," or "switch roles" whenever you want a tougher angle. Every session finishes with a running record of rejected options and a clear verdict: Hardened, Killed, or Clarified. Killing a weak idea early saves weeks of wasted engineering.

## Research a Decision

Ask Mary to research, or invoke `bmad-deep-recon` with the decision you need to make rather than a vague topic (for example, "help me choose a door tablet: an iPad in kiosk mode or an Android room-display panel"). You can run the research directly after approving a question plan, draft a structured prompt for an external research tool, or process an existing report into the same cited summary format. Every claim carries a source and date, and vendor or option comparisons close with a primary pick, a runner-up, and the strongest argument against the pick.

Point `bmad-deep-recon` at your own Git repository instead of the web and it researches the code and commit history, returning a strictly factual account with file and line citations and no recommendations so technical decisions remain yours.

## Decide Whether It Is Worth Building

| | A PRFAQ from Mary | A prototype |
| --- | --- | --- |
| **How it tests the idea** | Challenges the customer pitch and checks market, cost, and feasibility claims | Puts a working sketch in front of real people |
| **Use it when** | You are about to commit meaningful budget or engineering time, or you started with a solution before validating the customer problem | You need hands-on proof of whether users want it, whether it can be built, or where the hidden effort lies |
| **Ends with** | A press release (with an HTML page view), tough customer and internal FAQs, and a narrative verdict | Clear notes on what you learned and a deliberate choice to keep the code, discard it, or drop the idea |

A **PRFAQ** (Press Release and Frequently Asked Questions, Amazon's Working Backwards method) writes the launch announcement for the finished product first and then forces hard customer and stakeholder questions before anyone writes a line of code. Ask Mary (`bmad-agent-analyst`) to run one:

```text wrap
/bmad-agent-analyst create a PRFAQ for check in or lose the room
```

Mary walks through four parts in sequence: the press release, the customer FAQ, the internal FAQ covering feasibility, viability, resourcing, and risk, and finally a narrative verdict. Her stance shifts with each part, moving from editor to skeptical customer to executive review panel. The verdict explains what holds up, what still needs work before writing a PRD, and what could sink the concept alongside what it would take to fix each gap.

A throwaway prototype does not need a formal workflow; prompt your AI coding tool directly when you just want to try something fast. When you want a structured run with a clear outcome recorded, ask [John, Product Manager](../agents/john-pm.md) (`bmad-agent-pm`), for a prototype plan (which can hand off to `bmad-build-auto` and then asks you to keep the code, throw it away, or drop the idea) or an experiment card with pass and fail thresholds agreed before running. Make the keep-or-discard choice deliberately: throwing away prototype code while handing its lessons to Sofia is often the cleanest path, whereas keeping the code turns it into an existing codebase that needs normal planning and tests.

### Business and Strategic Documents

When stakeholders need a specific decision document before committing to product planning, ask Mary for the shape that fits:

| Document | What it settles |
| --- | --- |
| **Product brief** | Concise summary of the product vision, target users, core problem, and initial boundaries when you already believe in the idea |
| **Opportunity assessment** | Evaluation of whether a customer problem is real and large enough to pursue before committing to any solution |
| **Business case** | Financial and operational justification weighing costs, expected return, and risks for a funding decision |
| **Strategy narrative** | Leadership-level view of strategic direction, bets, and trade-offs across a product line or organization |
| **Program charter** | Mandate, governance, shared guardrails, and ownership boundaries for a multi-initiative program |
| **Business requirements document** | Formal sign-off requirements when an outside team, partner, or regulated domain requires documented business approval |

See [Document Templates](../reference/document-templates.md#mary-and-john-analysis-and-product) for the full catalog shared by Mary and John.

## Hand On a Clear Intent

Downstream planning skills read whatever you pass them, so pass your settled conclusions rather than a raw folder of notes. A clear intent states what must be true when finished, what must stay unchanged, and what is out of scope, keeping it concise enough that another person could plan from it without guessing.

Two utility skills help tighten documents before you hand them on:

- If a draft feels thin or unchallenged, run `bmad-advanced-elicitation` on it for an independent second-pass critique that returns a revised version for you to accept or reject.
- If an existing reference document or legacy specification exceeds roughly 50,000 characters, run `bmad-shard-pro` to split it cleanly or add a navigable index so later agent sessions read only the sections they need. See [Prepare Long Documents for Agents](../plan/prepare-long-documents-for-agents.md).
