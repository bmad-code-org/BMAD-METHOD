---
title: Why BMad Works This Way
description: The reasons behind BMad's main design choices, each linked to the pull requests and commits where the team made it.
sidebar:
  order: 2
---

This page gives the reasons behind the way BMad works, in the words the team
used when it made each change. Every section ends with links to the pull
requests and commits that state the choice.

## The Ticket Is the Spec

Specs and tickets used to be separate documents written by three skills. They
drifted apart, and readers had to decide which one to trust. Now the
initiative, epic or story file is the spec at its level, so there is one
source per level. Every skill that works on a ticket reads it first and in
full and trusts it; only Sofia re-reads its sources, when she updates it.

Where it's decided: [PR #3100](https://github.com/bmad-code-org/BMAD-METHOD/pull/3100), [commit 0f20b63](https://github.com/bmad-code-org/BMAD-METHOD/commit/0f20b63bc1ec3986169f1e9576defe2aa74271dc).

## Start Anywhere, Right-Sized

The four stages describe what kind of help a skill gives; they are not a
mandatory sequence to complete. BMad recommends the smallest path that safely
fits the work. The skills are independent tools, so BMad never marches you
through all of them, and the work is complete when the intent is satisfied and
its chosen checks pass, whether or not every skill has run.

Where it's decided: [commit b284c68](https://github.com/bmad-code-org/BMAD-METHOD/commit/b284c6866505b32de2f72ef4fce22cfcd58bbea2), [PR #2916](https://github.com/bmad-code-org/BMAD-METHOD/pull/2916).

## Size the Work Before Planning It

Sofia sizes new work first and says which path it takes: one bug or story on
its own, one epic, an initiative of several epics, or a `program` container (`program-*`)
when a larger goal, theme, or delivery program spans multiple initiatives. The level comes from the work
itself: one story is a story, more than one story of one capability is an
epic, and several capabilities are an initiative. Epics are the initiative's
cohesive capabilities, not a split by who builds them.

Where it's decided: [PR #2932](https://github.com/bmad-code-org/BMAD-METHOD/pull/2932), [commit 49fd27e](https://github.com/bmad-code-org/BMAD-METHOD/commit/49fd27e452021a0e64cccab3c76110c1d1777ce1), [commit f6ffa35](https://github.com/bmad-code-org/BMAD-METHOD/commit/f6ffa3533b8667dcd38d88d9c828c6128d9f6d53).

## One Story, One Capability

A story is one complete capability a person can see working end to end and
verify in one sitting. It is large on purpose: an epic may have one story, or
a few. Small stories were a way to coordinate people typing; they hide the
whole behavior from a coding agent and tire out the person reviewing.

The steps inside a story, such as a migration, an endpoint, a screen and its
tests, are the build's own plan. They are never tickets and never reach a
tracker. One session holds one goal, roughly 500 changed lines, started in a
fresh chat; a story larger than that is built from the same plan over several
sessions. A second, independent goal is offered as a split. A story that
would leave work for now, as a placeholder, or wired later is split, never
shrunk.

Where it's decided: [PR #1807](https://github.com/bmad-code-org/BMAD-METHOD/pull/1807), [PR #2884](https://github.com/bmad-code-org/BMAD-METHOD/pull/2884), [PR #2916](https://github.com/bmad-code-org/BMAD-METHOD/pull/2916), [commit 2522f6a](https://github.com/bmad-code-org/BMAD-METHOD/commit/2522f6ac5d4fb5015b8192b7dfaa23f12af09a4b).

## Plan Thin, Refine When It Pays

Slicing writes each epic thin, with `refined: false`: its scope is agreed, not
its detail. Refining it is its own stage, run on request or before its stories
are planned. A story is an entry in `tickets.toml` and gets its own file only
when it is reviewed, refined or published. The build plans a story's
acceptance criteria from the epic's Requirements and Done when; full criteria
come first only for a bug, a ticket with no epic, or on request.

Where it's decided: [PR #2932](https://github.com/bmad-code-org/BMAD-METHOD/pull/2932), [PR #2934](https://github.com/bmad-code-org/BMAD-METHOD/pull/2934), [PR #2986](https://github.com/bmad-code-org/BMAD-METHOD/pull/2986), [commit 49fd27e](https://github.com/bmad-code-org/BMAD-METHOD/commit/49fd27e452021a0e64cccab3c76110c1d1777ce1).

## You Mark Work Done

Builds stop at `built` and never write `done`. Only you, or a script or AI
session you direct, mark a ticket done. An unattended worker must not choose
its own work: `bmad-build-auto` builds only what it is given, and given
nothing it halts with `unclear intent`. Something else chooses each ticket:
you, a script, or an AI session that starts one worker per ticket.

Where it's decided: [PR #2944](https://github.com/bmad-code-org/BMAD-METHOD/pull/2944).

## Review Depth Follows the Stakes

A build reviews `quick` by default, which suits the inner loop. `thorough`
suits a change that is unusually risky or makes many design decisions, and
work with production consequences should get a thorough review of every change
before it ships. The depth a build ran at is your choice, not a reason for another
pass. At the end of an epic, `bmad-retrospective` is the thorough pass over the
epic's diff.

Where it's decided: [PR #2975](https://github.com/bmad-code-org/BMAD-METHOD/pull/2975), [PR #2982](https://github.com/bmad-code-org/BMAD-METHOD/pull/2982), [PR #2985](https://github.com/bmad-code-org/BMAD-METHOD/pull/2985).

## Research Reports What the Code Does

Codebase research in `bmad-deep-recon` says how the relevant code works at one
commit and how it got that way, every claim cited to a line or a commit, with
no recommendation in it. Its researchers see only factual questions, never the
goal, because a researcher who knows what is being built reports what should
be instead of what is. What to change is yours to decide.

Where it's decided: [PR #3085](https://github.com/bmad-code-org/BMAD-METHOD/pull/3085).

## One Facilitator for Planning Documents

One engine with templates replaces a separate skill per document type: Mary
and John write every planning document through `bmad-facilitate`. A PRD is
optional: a described intent is valid input too, and a single builder or a
small team that already agrees needs none. Each document fits the level the
work sits at and is sized to the stakes.

Where it's decided: [PR #3172](https://github.com/bmad-code-org/BMAD-METHOD/pull/3172), [PR #3176](https://github.com/bmad-code-org/BMAD-METHOD/pull/3176), [commit fb28c03](https://github.com/bmad-code-org/BMAD-METHOD/commit/fb28c032fbd1276cebca8b79b47fecc5331ed2fb).

## Change Goes Back to the Plan

A change mid-flight goes to Sofia, who replans so that the remaining tickets
stay true and nothing already built is rewritten. She updates what is required
first, re-slices, drops what no longer belongs, and records the reason as a
dated `Decision:` line. On a team, the requirements are updated before the
architecture spine. To start, tell Sofia that something changed and ask what
now.

Where it's decided: [commit 3a67c86](https://github.com/bmad-code-org/BMAD-METHOD/commit/3a67c86f1195daf0b1337bc6bb82beb0db3344e2), [commit 1c55fed](https://github.com/bmad-code-org/BMAD-METHOD/commit/1c55fed905a83e5db5119c98100e70238b2f37b0).

## Done and Dropped Work Is the Record

A done or dropped ticket is left as written and is not reshaped to a newer
template. An entry is never deleted from an approved `tickets.toml`; it is
marked dropped, with a `Dropped:` line that says why, so its id is not reused.
Plans stay as evidence after the work is done, and deleting them can turn
completed entries back into planned work.

Where it's decided: [PR #2944](https://github.com/bmad-code-org/BMAD-METHOD/pull/2944), [PR #2986](https://github.com/bmad-code-org/BMAD-METHOD/pull/2986), [commit f6ffa35](https://github.com/bmad-code-org/BMAD-METHOD/commit/f6ffa3533b8667dcd38d88d9c828c6128d9f6d53).

## Ask in Plain Words

An agent runs the item that fits your request, and a request that fits nothing
becomes a conversation. With no request it says in one line what it does.
Asked what it can do, it answers in a few sentences and offers its list; the
full table appears only when you ask for it. Items are words, not two-letter
codes.

Where it's decided: [PR #3172](https://github.com/bmad-code-org/BMAD-METHOD/pull/3172), [PR #3176](https://github.com/bmad-code-org/BMAD-METHOD/pull/3176), [PR #3197](https://github.com/bmad-code-org/BMAD-METHOD/pull/3197).
