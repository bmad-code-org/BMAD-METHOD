<!-- doc-pro template
purpose: A feature spec a coding agent can build and test from with no other context.
good for: One feature outside the ticket tree, or one handed to an external agent or tool.
not for: Work whose epic or story ticket already holds the requirements: in BMad the ticket is the spec, and Sofia (`bmad-agent-po`) writes it. Several features or a product (`prd`).
stance: Draft first from the conversation and the codebase; ask only what changes scope, security or what the user experiences, one question at a time with a recommended answer. Facts about the code come from reading it, not from the user.
inputs: The requested behavior, who uses it, the codebase's conventions and terms, constraints and boundaries. Only the user knows priority and what is out.
writing: Behavior, not implementation: no file paths or code, except a fragment that pins a decision more exactly than prose (a schema, a state machine). Success criteria are measurable without knowing the implementation.
done when: Every story has an independent test and Given/When/Then acceptance; every requirement is testable; edge cases cover boundaries and failures; nothing about scope is left for the agent to guess.
view: document
-->
---
title: ""
template: agent-spec
status: draft
created: ""
updated: ""
---

# {title}

## Problem
<!-- required. Who is affected and what they cannot do now. -->

## User stories
<!-- required. Ordered by priority, P1 first. Each: the story, why this priority, an independent test showing it delivers value when built alone, and Given/When/Then acceptance scenarios. -->

## Edge cases
<!-- required. Boundaries, invalid input, failures and what the system does in each. -->

## Requirements
<!-- required. FR-N, each "The system MUST ..." or "Users MUST be able to ...", testable. -->

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
