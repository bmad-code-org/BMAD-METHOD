---
title: 'Design UX and Architecture'
description: When UX and architecture work is necessary, and how documented decisions stop agents and epics from implementing a system in conflicting ways.
sidebar:
  order: 6
---

Use this page to decide whether a change needs UX or architecture work before
implementation. Most changes do not. Multi-epic and cross-system work usually
does, because without shared decisions each agent or session makes its own.

## Do You Need It?

| Work characteristics                              | Guidance                                                      |
| ------------------------------------------------- | ------------------------------------------------------------- |
| Clear, local change with established patterns     | Usually unnecessary                                           |
| Several related components with known constraints | Optional, based on coordination risk                          |
| Multiple epics or cross-system decisions          | Needed to align implementation                                |
| Regulated, high-risk, or enterprise initiative    | Follow required governance; architecture is normally required |

If several epics could be implemented by different agents or people, you need
architecture. If the product has a user interface whose look and behavior
matter to the outcome, you need UX.

Both change what `bmad-build` reads; neither changes how Build runs. Build
still runs one session at a time. What changes is that each session reads the
same decisions, so the sessions fit together.

## The Problem Without Shared Decisions

When several agents implement different parts of a system with no shared
guidance, each makes independent technical choices. The results conflict in
predictable places: one epic exposes REST while another writes GraphQL;
`snake_case` columns meet `camelCase` ones; Redux in one area and React
Context in the next; different directory layouts and test patterns per epic;
session cookies here and JWT there. Each choice is defensible alone. Together
they produce integration issues discovered mid-sprint, rework, and
inconsistent patterns.

## The Architecture Spine

Run `bmad-architecture` and you get a short architecture document (the
**spine**). It records only the decisions that would conflict if two people
made them independently: the design approach, the boundaries, how state is
changed, who owns shared data. The stack, the folder tree, and the full data
shape are starting points; the code owns them once they exist.

One test decides what belongs. If two units built this independently, could
they choose incompatibly? A decision goes in the spine only when the answer
is yes, the call is non-obvious, and it is a real trade-off. Everything else
is left to the code. Each decision gets a stable ID so specs and stories can
cite it.

The skill works from whatever you have: a spec, a raw idea, a long
architecture document to shorten, or an existing codebase, where it reads the
real code and records the conventions already there. Coaching is the default:
the important calls are shown with the alternatives weighed, then you choose.
A Fast path drafts the whole spine with `[ASSUMPTION]` tags instead. For a
new project it recommends a current, well-known starter, because a good one
already decides a lot of the architecture.

Point it at the whole system or at one epic; an epic spine inherits the
parent's decisions and records only what the parent left open. When it
finishes, it offers to attach itself to the spec, which is how Build and the
readiness gate find it. Seed
[project context](../how-to/project-context.md) from it so every later skill
reads the same rules.

:::caution[Common mistakes]
Deciding the API style "as we go", documenting every minor choice, and a spine
written once and never updated are the three ways this step fails. Document
decisions that cross epic boundaries, keep the spine current as you learn, and
run `bmad-correct-course` for a significant mid-implementation change.
:::

## UX Design

Run `bmad-ux` when user experience matters to the outcome. It produces two
peer documents: `DESIGN.md` for how the product looks (colors, typography,
spacing, components) and `EXPERIENCE.md` for how it works (information
architecture, behavior and states, accessibility, key user flows). Both win
over any mock or wireframe on conflict.

The facilitator records your vision; it never volunteers colors, patterns, or
directions. Three working modes: a Fast path that drafts both documents with
`[ASSUMPTION]` tags, a Coaching path that walks the decisions with creative
tools (color themes, design directions, wireframes, key-screen mocks), or a
design handoff that builds a prompt for an external design tool and folds its
output back in. UX can lead the PRD, follow it, or stand alone.

Skip it for back-end work, internal tooling with no real interface, and
changes to an existing UI that already has established patterns.

## What Comes Next

The spine and the UX documents become input to the spec and to
[Break Work into Stories and Track It](./break-work-into-stories-and-track-it.md),
where the readiness gate checks that stories do not depend on decisions
nothing records.
