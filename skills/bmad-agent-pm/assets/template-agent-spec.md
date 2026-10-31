---
title: ""
template: agent-spec
description: "One feature handed to a coding agent: stories with independent tests, acceptance, edge cases. Not for work a story or epic ticket already specifies. Several features or a product (`prd`)."
status: draft
created: ""
updated: ""
---

<!-- purpose: A feature spec a coding agent can build and test from with no other context. -->

<!-- stance: Draft first from the conversation and the codebase, then ask only what changes scope, security or what the user experiences, each with a recommended answer; read the code for the rest. -->

<!-- inputs: The requested behavior, who uses it, the codebase's conventions and terms, constraints and boundaries. Only the user knows priority and what is out. -->

<!-- writing: Behavior, not implementation: no file paths or code, except a fragment that pins a decision more exactly than prose (a schema, a state machine). Success criteria are measurable without knowing the implementation. -->

<!-- done when: Every story has an independent test and Given/When/Then acceptance; edge cases cover boundaries and failures; nothing about scope is left for the agent to guess. -->

# {title}

## Table of Contents

## Problem
<!-- required. Who is affected and what they cannot do now. -->

## User stories
<!-- required. Ordered by priority, P1 first. Each: the story, why this priority, an independent test showing it delivers value alone, and Given/When/Then acceptance scenarios. -->

## Edge cases
<!-- required. Boundaries, invalid input, failures and what the system does in each. -->

## Requirements
<!-- required. FR-N, each "The system MUST ..." or "Users MUST be able to ...". -->

## Key entities
<!-- include when: the feature stores or moves data. What each represents and how they relate, without schema detail. diagram: er -->

## Success criteria
<!-- required. SC-N measurable outcomes. -->

## Out of scope
<!-- required. What the agent must not build or change. -->

## Assumptions
<!-- required. Defaults chosen where the input was silent, and existing systems the feature depends on. -->

## Implementation context
<!-- optional. Decisions already made, modules and interfaces touched, and the highest seam where the tests run. -->

## Open questions
<!-- include when: anything remains open. Each blocks handoff until answered. -->
