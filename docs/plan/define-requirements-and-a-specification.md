---
title: 'Define Requirements and a Specification'
description: Choose between a succinct spec and the full product-planning path — product brief or PRFAQ, then a PRD — and know what each produces.
sidebar:
  order: 5
---

Use this page to pick the requirements skill for the work in front of you: a
product brief or a PRFAQ, then a PRD, for a product; or `bmad-spec` for the
contract implementation reads.

## Which Path Applies

[Choose a Planning Path](./choose-a-planning-path.md) decides the size. Most
work goes straight to `bmad-spec` from whatever defined the intent: a forged
idea, a PRFAQ summary, a brainstorm intent, an issue. A PRD becomes necessary
when several people must agree on what the product is or several epics must
stay aligned; [Plan Inside an Organization](./plan-inside-an-organization.md)
covers that setting. This page covers what each document is for and which
skill writes it. None of them replaces the spec: every epic still ends up as a
`SPEC.md` that Build reads, and when there is a PRD, that is where the spec's
answers come from.

The brief, PRD, and UX skills steer the same way. Each opens with a brain
dump: tell it everything and point it at any files you have. Then you choose a
working mode. **Fast path** batches the remaining gaps into a question or two
and drafts the whole document with `[ASSUMPTION]` tags for you to correct.
**Coaching path** pulls the thinking out of you section by section and pushes
back where an answer is thin. Sessions can be paused and resumed.

## Product Brief: Capture Conviction

Run `bmad-product-brief` to create, update, or validate a brief: a one- to
two-page account of the product concept, right-sized to its purpose. A passion
project does not get investor-grade rigor; a pitch input does. The coach reads
the stakes early and calibrates how hard it pushes.

Use it when your concept is relatively clear and you want it written down
before a PRD. It produces `brief.md` plus `addendum.md`, which holds the depth
that belongs later rather than in the brief: rejected alternatives, options
considered, technical constraints, sizing data. `bmad-prd` reads both. For
serious market sizing or competitor teardowns it hands you to
[Deep Recon](./research-a-decision.md).

## PRFAQ: Working Backwards

Run `bmad-prfaq` for Amazon's Working Backwards method as a challenge. You
write the press release announcing the finished product before anything is
built, then answer the hardest questions customers and stakeholders would
ask. Solution-first and technology-first openings get redirected to the
customer's problem. Vague answers get challenged. When you are stuck it offers
concrete reframings rather than repeating the question.

A run moves through five stages: customer, problem, stakes, and concept; the
press release; the customer FAQ; the internal FAQ on feasibility and
trade-offs; and a verdict on the concept's strength. Claims about the market
and competitors are checked against current research, not assumed. If after a
few exchanges you cannot name a customer or a problem, it sends you back to
brainstorming or Forge Idea instead of forcing it.

Use it when you want the concept stress-tested before committing resources.
If you cannot write a compelling press release, the product is not ready. It
produces the PRFAQ document plus a short summary a PRD or spec can read, and
it accepts `-H` for an unattended first draft when you supply the customer,
problem, stakes, and concept up front.

Brief and PRFAQ both feed a PRD, and the PRFAQ summary can feed `bmad-spec`
directly when no PRD is needed. Choose by how much challenge you want: the
brief is collaborative discovery, the PRFAQ is the harder path. Neither is
required; `bmad-prd` starts from a brain dump on its own.

## PRD: Agree on What and Why

Run `bmad-prd` to create, update, or validate a Product Requirements Document.

- **Create** runs discovery, then drafts. On the Coaching path you also pick
  an entry point: **Vision + Features** for capability-first products and
  internal tools, or **Journey-led** for consumer and multi-stakeholder
  products, where user journeys are told with a named protagonist.
- **Update** reconciles the PRD with a change signal, surfacing conflicts with
  earlier decisions before applying anything.
- **Validate** critiques without changing and produces a findings report.

The PRD describes capabilities, not implementation: features grouped, with
functional requirements under stable IDs and non-functional requirements in
their own section. Technical choices go to `addendum.md`. Length scales with
stakes, from about two pages for a hobby project to as long as the
requirements need for a launch.

It answers "what should we build and why." It does not say how; that is
[Design UX and Architecture](./design-ux-and-architecture.md). It does not
divide work into stories; that is
[Break Work into Stories and Track It](./break-work-into-stories-and-track-it.md).
If you open it with a one-pager in mind or an idea to vet, it points you at
the brief or the PRFAQ instead.

## Spec: The Contract Implementation Reads

Run `bmad-spec` to turn an intent into a short contract that Build reads.
`SPEC.md` has five fields: Why, Capabilities (each with an intent and a
success condition), Constraints, Non-goals, and Success signal. Tables,
diagrams, glossaries, and documents other skills already wrote sit beside it;
the spec points at them rather than copying them.

The spec writes the contract; it does not help you figure out what you want.
Rich input is extracted with no questions. Sparse input gets a choice: a
best-effort draft where every gap becomes an open question, or a guided walk
through the five fields. Input too thin to use ("an app for hikers") is sent
to `bmad-prd`. Input too large is the other failure: a few tens of thousands
of tokens is the practical ceiling, so condense a pile of material first.

`bmad-spec` is the only writer of `SPEC.md`. Do not hand-edit it; run the
skill again with the change and it updates the spec in place, keeping
capability IDs stable. The PRD, UX, and architecture skills can run in any
order and feed the same spec. After every run it reports assumptions it made
and open questions it could not answer, for you to resolve.

On request, **Story Breakdown** turns one spec into an epic. It walks the
capabilities and constraints with you, proposes a story per independently
reviewable slice, and asks for each one whether you want a checkpoint before or
after implementation. The result is the ordered `stories.yaml` beside
`SPEC.md`. That is the whole planning set for a spec-backed epic; see
[Choose a Planning Path](./choose-a-planning-path.md#1-start-epic-sized-work)
for how the epic then runs.

:::note[What each skill produces]
`bmad-product-brief`: `brief.md` and `addendum.md`. `bmad-prfaq`: a PRFAQ
document with a short summary for the PRD or spec. `bmad-prd`: `prd.md` and
`addendum.md`, or a validation report. `bmad-spec`: `SPEC.md` plus supporting
files under `specs/spec-<slug>/`, and `stories.yaml` on request. Exact paths
and options belong to each skill; see
[Planning Skills and What They Produce](./choose-a-planning-path.md#planning-skills-and-what-they-produce).
:::

## What Comes Next

With a PRD in hand for multi-epic work, decide whether the work needs shared
design decisions: [Design UX and Architecture](./design-ux-and-architecture.md).
With a spec in hand for one epic, ask for Story Breakdown and go to
[Break Work into Stories and Track It](./break-work-into-stories-and-track-it.md).
