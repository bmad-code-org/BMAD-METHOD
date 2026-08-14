---
schema: 1
id: [KEY-n]
type: epic
title: "[The deliverable]"
description: "[One line — what this epic delivers, in the reader's language]"
status: backlog
depends_on: []
covers: []
risk: [1-5 ceiling hint — leaves score individually]
created: [YYYY-MM-DD]
---

# [KEY-n] — [Title]

## Context

[1–2 sentences: what this epic delivers and for whom. One dev drives this to completion — sized accordingly.]

## Goals

- [What done looks like at epic level — outcomes, not a story list. Children are never enumerated here.]

## Sequencing Notes

[The sequencing rationale from inception: what gates what and why, in prose. The edges themselves live in the children's depends_on. Autonomous-mode self-check outcomes are recorded here.]

## Out of Scope

[Optional — what this epic deliberately does not cover.]

<!-- status: backlog → ready → in-progress → done, or dropped. `ready` means
     inception is finished and work can start; it gates nothing, it records
     that someone decided. `done` is likewise somebody's call, never a counter
     hitting zero. Move it through scripts/update_ticket.py, never by hand. -->

