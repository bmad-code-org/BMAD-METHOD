---
title: 'Choose a Planning Path'
description: Choose the smallest BMad path that safely fits a software change, from a trivial edit to a multi-epic project.
sidebar:
  order: 1
---

Use this page to decide how much planning a change needs. The answer turns on
one question: is the intent already well defined? If it is, feed it to
`bmad-spec`, which shapes it to the size of the work, and build. If it is not,
the other pages in this chapter are how you get a defined intent. If the work
belongs to an organization, with a PRD other people must approve and several
engineers building in parallel, read
[Plan Inside an Organization](./plan-inside-an-organization.md) first; it
says how this chapter fits the process you already have.

## Start from the Intent

A well-defined intent says what should be true when the work is done, what
must not change, and what is out of scope: complete enough that someone else
could build it without guessing, and no longer than that. Where it came from
does not matter: a sentence, an issue, a forged idea, a research report, a
PRD.

Keep the input short. `bmad-spec` reads everything you give it in one pass,
and the practical ceiling is a few tens of thousands of tokens, roughly a
40-page document. Hand it a pile of raw documents several times that size and
it silently loses the parts that mattered; condense them first. If the spec
says the input is too thin, you are not done on this chapter yet.

- **Well-defined intent**: run `bmad-spec` with it. A spec that fits one Build
  session goes straight to `bmad-build`; an epic-sized one goes to
  `bmad-preview-ticketing` for stories, then a Build per story. See
  [Define Requirements and a Specification](./define-requirements-and-a-specification.md).
- **Anything else**: the intent is not ready yet. Use the pages below until it
  is, then run `bmad-spec`. The spec skill writes the contract; it does not
  help you figure out what you want.

If the change fits one implementation session, you are on the Build page's
territory, not this chapter's: [Build a Change](../build/build-a-change.md)
covers sizing a session and whether a small change needs BMad at all.

:::note[Prerequisites]
Install BMad before using Build or another BMad workflow. You don't need BMad
for an obvious, low-risk edit.
:::

## Get to a Well-Defined Intent

These are independent tools, not stages. Pick the ones the gap calls for, in
any order. None of them build anything. Condense what they produce and hand
`bmad-spec` the result, not the raw pile.

| The intent is missing                                            | Do this                                                                                                      |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| A clear idea at all, or confidence the idea is good              | [Explore and Validate an Idea](./explore-and-validate-an-idea.md)                                            |
| Evidence a decision should rest on                               | [Research a Decision](./research-a-decision.md)                                                              |
| A written account of what the product is, for a PRD or a pitch   | A brief or PRFAQ: [Define Requirements and a Specification](./define-requirements-and-a-specification.md)    |
| Shared decisions several epics or agents must follow             | [Design UX and Architecture](./design-ux-and-architecture.md)                                                |
| Agreement, ownership, and sign-off among several people or teams | A PRD as the document the organization owns: [Plan Inside an Organization](./plan-inside-an-organization.md) |

A short list of decisions is often enough on its own. You need a PRD when more
than one person must agree on what the product is, or more than one epic must
not diverge; otherwise skip it. A multi-epic product runs `bmad-spec` once per
epic with those documents as sources.

## Planning Skills and What They Produce

Every skill in this chapter writes a document you can hand on. The table runs
from analysis through planning to solutioning; each chapter page is linked
from the first skill it covers and explains when its skills fit. In an
installed project, `bmad` recommends the next one. Each document lands in
its own `<type>-<slug>/` folder inside the active initiative's folder, or
directly in the output folder (`_bmad-output` by default) when no initiative
is active.

| Skill                           | Purpose                                                                                                                                        | Produces                                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `bmad-brainstorming`            | Generate ideas with a facilitated session ([Explore and Validate an Idea](./explore-and-validate-an-idea.md))                                  | `brainstorm.html` keepsake plus an optional `brainstorm-<topic>.md`                 |
| `bmad-forge-idea`               | Pressure-test an idea until it hardens, proves out, or dies cheaply                                                                            | `forge-report.html` every run; `forge-<slug>.md` when the idea hardens              |
| `bmad-deep-recon`               | Research a subject to support a decision ([Research a Decision](./research-a-decision.md))                                                     | Cited `research-<topic>.md` plus an optional HTML briefing                          |
| `bmad-product-brief`            | Capture the product vision when the concept is clear ([Define Requirements and a Specification](./define-requirements-and-a-specification.md)) | `brief-<slug>.md` + `addendum.md`                                                   |
| `bmad-prfaq`                    | Stress-test a product concept customer-first, working backwards from the press release                                                         | `prfaq-<slug>.md` + a distillate                                                    |
| `bmad-prd`                      | Create, update, or validate a PRD                                                                                                              | Create/update: `prd-<slug>.md`, `addendum.md`, `.memlog.md`; validate: HTML + `.md` report |
| `bmad-ux`                       | Record how the product looks and behaves ([Design UX and Architecture](./design-ux-and-architecture.md))                                       | `DESIGN.md`, `EXPERIENCE.md`, `ux-<slug>.md`, `.memlog.md`                          |
| `bmad-spec`                     | Condense any intent into a short contract; hand it to `bmad-preview-ticketing` for stories on request                                          | `spec-<slug>.md` + companions                                                       |
| `bmad-architecture`             | Make the technical decisions that keep separately built parts consistent                                                                       | `architecture-<slug>.md` by default                                                 |
| `bmad-preview-ticketing` | [Plan and track entries](./break-work-into-stories-and-track-it.md) | Epic envelopes, ordered `tickets.toml`, and optional leaf files |

`bmad-prd` has three intents, create, update, and validate; say which one you
want when you invoke it, or it will ask. `bmad-product-brief` feeds `bmad-prd`,
which reads the brief during discovery, but neither requires the other.

![Three columns of planning skills and the files each writes: analysis (brainstorming, forge idea, deep recon, product brief, PRFAQ), planning (PRD, UX, spec), and solutioning (architecture and ticketing), all handing off to bmad-build, one session per unit](/diagrams/planning-skills.svg)

## Size Follows the Intent

The size of the intent decides how many Build sessions follow. One coherent
outcome that needs several sessions is an epic. Work that spans several epics,
or likely needs roughly 20 or more sessions, is a project. Scope is only one
signal: use more planning when the work has high risk, unclear requirements,
broad architectural reach, cross-system effects, or coordination between
people or teams.

![Four nested paths reuse the same unit: edit directly, run one Build, repeat Build across an epic, or repeat epic paths across a project](/diagrams/development-paths.svg)

Every path uses the same implementation unit. Larger work adds shared context
around that unit and repeats it; it does not switch to a separate delivery
system.

## Run the Path

### 1. Start Epic-Sized Work

Use this path when the work needs several Build sessions but still has one
coherent outcome.

**Define and divide the epic**

1. Run `bmad-spec` with the epic intent. See
   [Define Requirements and a Specification](./define-requirements-and-a-specification.md)
   for what a spec contains and when it is enough on its own.
2. Run `bmad-preview-ticketing` with the spec folder. It plans the epic with
   you and records the stories in build order in the epic's `tickets.toml`.
3. Review the proposed order and decide which stories need a checkpoint.
4. Build each story from its entry when you are ready; no story file is
   needed. Refine a story first only when its entry says `refine = true`, the
   ticket has no epic, or you want the acceptance criteria written before
   build.

The breakdown is an execution plan, not a promise that nothing will change.
Update the spec and re-slice the remaining stories when earlier work reveals a
missing constraint, a better division, or a conflict between stories.

**Establish the implementation pattern**

Implement important, risky, or foundational stories with `bmad-build`. Early
stories often settle the architecture, initial project structure, and repeated
patterns that later stories will follow. Give those decisions human attention
before automating repetitions of them.

Run Build once per story, naming the story. Build writes its plan beside the
epic's `tickets.toml` and leaves the plan at `built` until you mark it done
through the ticketing skill. To run stories unattended instead, give
`bmad-build-auto` the story as its intent, one run per story; see
[Autonomous Development Loops](../build/autonomous-development-loops.md).

**Finish the epic**

Verify the stories together, then run `bmad-retrospective` with the epic folder, id, or slug. It reads entries and joined plans and judges the combined result against the epic's requirements. Keep those plans after closure.
See [Finish an Epic](../build/finish-an-epic.md).

### 2. Start Project-Sized Work

Use the full BMad flow for a greenfield product, a multi-epic initiative, or
work likely to need roughly 20 or more implementation sessions.

Prepare only the planning the project actually needs from the table above
([Plan Inside an Organization](./plan-inside-an-organization.md) covers who
owns which document and where sign-off happens). Then run `bmad-spec` per epic,
track the stories with
[Break Work into Stories and Track It](./break-work-into-stories-and-track-it.md),
and close each epic with [Finish an Epic](../build/finish-an-epic.md).

These documents coordinate implementation. They do not replace Build. Each
epic still becomes a sequence of one-session units. Independent epic streams
can proceed in parallel when their boundaries are explicit. Each stream needs
an owner, and all streams stay accountable to the same product intent and
architecture. Run integration checks and a retrospective at each epic
boundary.

Dividing work can lose information: a requirement weakens, a constraint
disappears, or two correct stories fail when combined. The PRD, architecture,
and specs exist so later sessions can still see the whole.

## After Decisions Stabilize

`bmad-build-auto` runs one session without waiting for human input. It does
not choose the next story or own the backlog. Use it after the important
implementation decisions are stable. For the worker contract, see
[Autonomous Development Loops](../build/autonomous-development-loops.md).

## What You Get

A path sized to the work: a spec and stories for an epic, or shared product
documents plus one spec per epic for a project — each still implemented one
Build session at a time.
