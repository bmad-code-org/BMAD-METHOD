---
title: 'Plan Inside an Organization'
description: How the full planning path works when several people must agree on the product, several engineers build it in parallel, and someone has to sign off — who owns which document, where approval happens, and how change flows.
sidebar:
  order: 2
---

Use this page when the work belongs to an organization rather than to you:
more than one person must agree on what the product is, more than one engineer
will build it, or someone must sign off before money is spent. In that
setting, planning documents are contracts between people first and input to
the skills second.

## The Scaled-Down Version First

A single builder, or a small team that already agrees, does not need most of
what follows. A forged idea, a PRFAQ summary, a brainstorm intent, or a
well-written issue goes straight to `bmad-spec`, and the rest is one spec per
epic. [Choose a Planning Path](./choose-a-planning-path.md) covers that route.
`bmad-spec` will tell you if the input is too thin; until it does, no PRD is
required.

Reach for the full path when one of these is true:

- People who did not do the thinking must approve what the product is.
- Several epics, teams, or agents will build against the same decisions and
  must not diverge.
- A regulator, a steering committee, or an enterprise process requires named
  documents as evidence.

## The PRD Is What the Organization Owns

The PRD is the document the organization owns. It is written by `bmad-prd`,
validated by it, and updated through it; nothing else in the chain claims to
say what the product is. Brainstorming, Forge Idea, Deep Recon, a product
brief, and a PRFAQ exist to get the PRD written well. Everything after the PRD
is derived from it:

- `bmad-ux` writes `DESIGN.md` and `EXPERIENCE.md` alongside the PRD.
- `bmad-architecture` writes a short architecture document (the spine): the
  decisions that keep independently built epics compatible.
- `bmad-spec` writes one spec per epic from the PRD, pointing at the spine and
  the UX documents rather than copying them.
- `bmad-create-epics-and-stories` and `bmad-sprint-planning` turn the specs
  into tracked stories.

Nothing downstream reinterprets the PRD. If a spec needs an answer the PRD
does not give, the answer goes into the PRD first; the spec is re-run after.

## Bring the Documents You Have

Nothing here asks you to replace the planning system you already run. An
organization arrives with a PRD in Confluence or Notion, a backlog in Jira or
Linear, and a review cadence, and all of it stays.

- **Your PRD is the input.** `bmad-prd` opens with a brain dump and reads any
  files you point it at, so the first run is "here is our PRD". Ask it to
  **validate** and you get a findings report on the document as it stands,
  with nothing changed. Ask it to **create** from that input and you get the
  same requirements in the shape the later skills read, with `[ASSUMPTION]`
  tags on anything it had to fill in. After that, the copy your reviewers
  already edit is the source. When it changes, re-run `bmad-prd` in
  **Update** mode pointing at it and let the skill bring `prd.md` in line;
  never edit `prd.md` by hand to catch up.
- **The same holds for design and architecture.** A design system, an
  existing architecture document, or a live codebase is what `bmad-ux` and
  `bmad-architecture` start from. On an existing system the architecture
  skill reads the code and records the conventions already there rather than
  proposing new ones.
- **Your tracker stays your tracker.** Jira remains where the organization
  plans, reports, and reviews. The skills read and write one file,
  `sprint-status.yaml`, and it holds only story status and open action items.
  There is no automatic sync in either direction; treat that file as the
  engineering-side view and update it when the tracker changes.
- **Your reviews stay your reviews.** The five sign-off moments below are
  where the skills produce something reviewable. Put your existing approvals
  at those points and the documents the skills write become the material
  those meetings already needed.

The one thing that does change is where an edit goes: in the PRD the skills
read, not in a spec or a story, so that every derived document can be
regenerated from it.

## Who Owns What

| Role                     | Runs                                                                                              | Owns                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Product manager          | Brainstorming, Forge Idea, Deep Recon, then `bmad-product-brief` or `bmad-prfaq`, then `bmad-prd` | `prd.md` and its update cycle; the one-pager the steering committee reads |
| Designer                 | `bmad-ux`                                                                                         | `DESIGN.md`, `EXPERIENCE.md`                                              |
| Tech lead or architect   | `bmad-architecture`                                                                               | The architecture spine                                                    |
| One engineer, per epic   | `bmad-spec`, Build per story, `bmad-retrospective`                                                | That epic: `SPEC.md`, `stories.yaml`, its verdict                         |
| Whoever tracks the whole | `bmad-sprint-planning`                                                                            | `sprint-status.yaml`, open action items                                   |

The rows are roles, not headcount. One person can hold several; what matters
is that each document has exactly one owner, because each has exactly one
skill that writes it. An epic is a handful of Build sessions, usually a day's
work for one person. The organization's coordination lives in the PRD and the
spine; the epic itself never needs a committee.

## Where Sign-Off Happens

The skills give you five moments where a human decision is expected, and each
one blocks something specific. Put approvals there rather than inventing new
gates.

| Moment                    | What is judged                                                        | What it blocks               |
| ------------------------- | --------------------------------------------------------------------- | ---------------------------- |
| PRFAQ verdict             | Whether the concept is strong enough to resource                      | Writing the PRD              |
| PRD validate              | A findings report on the PRD without changing it                      | Design and architecture work |
| Architecture spine review | The decisions every epic will follow, with alternatives weighed       | Writing specs for the epics  |
| Readiness gate            | Could a developer implement these stories without inventing decisions | Generating sprint tracking   |
| Retrospective verdict     | Did the epic meet its own acceptance criteria                         | Starting the next epic       |

Every one of these produces a written result, so the approval has something to
attach to. In regulated or enterprise settings those documents are the audit
trail. PRFAQ and Retrospective can run unattended (`-H`) when you want the
same check without a conversation.

:::note[Reviewers read copies; change the source]
People will review the PRD, the spine, and a spec, and they will ask for
changes in whichever one they happen to be reading. Apply the change where it
belongs: to the PRD if it is about what the product is, to the spine if it is
about how epics stay compatible, to the spec only if it is about that epic
alone. Then re-run the later skills. Editing a spec to work around a PRD that
no longer says the right thing is how the documents stop agreeing.
:::

## Several Epics at Once

One PRD, one spine, one spec per epic. Several engineers can each take an
epic at the same time when the boundaries are explicit; the spine is what
makes that safe, because it records the calls two people would otherwise make
differently: the API style, how state is changed, who owns shared data. Each
epic's spine inherits the parent's decisions and records only what the parent
left open. Run integration checks and a retrospective at every epic boundary,
not only at the end. [Design UX and Architecture](./design-ux-and-architecture.md)
shows what goes wrong without the spine.

## When Requirements Change Mid-Flight

They will. The path for a change is the same as the path for the original:

1. Run `bmad-prd` in **Update** mode with the change signal. It surfaces
   conflicts with earlier decisions before applying anything.
2. If the change touches a cross-epic decision, update the spine.
3. Re-run `bmad-spec` for each affected epic. It updates `SPEC.md` in place
   and keeps capability IDs stable, so stories that are unaffected stay
   unaffected.
4. Re-run Story Breakdown or `bmad-sprint-planning` for the affected epics.
   Regenerating tracking is safe; finished work stays finished.

For a change large enough to threaten the plan itself, run
`bmad-correct-course` before touching documents.

## What You Get

A set of documents that agree with each other because each has one writer and
one owner; five named points where the organization can say yes or no with
something in hand; and a change path that flows from the PRD outward instead
of from whichever document someone happened to edit. Engineering still
implements one Build session at a time, exactly as it would for a
single-builder change.
