<!-- doc-pro template
purpose: Requirements a team, human or AI, builds from without this conversation.
good for: Committed work at any altitude, from a program down to small work.
not for: Deciding whether to build (`brief`, `opportunity`); one feature for a coding agent (`agent-spec`); a regulated or contracted baseline (`srs`).
stance: Draw the product out of the user; when you start naming wedges, MVP cuts or phases, hand the decision back. The user narrates journeys as real sessions; you structure them.
inputs: Form factor if the sources do not say. Only the user knows who it is for, what is out, and what success looks like.
writing: Program and initiative documents state outcomes, capabilities and rules for everything below them; epic documents state testable requirements; small work does both, briefly. Capabilities, not implementation: technology choices go to the addendum. Ids (UJ-N, FR-N, SM-N) are global and stable; no traceability matrix. Domain nouns are used exactly as the glossary defines them.
done when: Every FR has testable consequences and traces to a journey or need; non-goals and out-of-scope reasons are stated; every primary metric has a counter-metric.
view: document
-->
---
title: ""
template: prd
status: draft
created: ""
updated: ""
---

# {title}

## Document purpose
<!-- required. Who reads it, and the inputs it builds on (ticket, brief, UX work) with where they live, instead of repeating them. -->

## Vision
<!-- required. What this is, for whom, why it matters, and why now when timing matters. -->

## Users and journeys
<!-- required. Who it serves and their jobs; UJ-N journeys: a named protagonist with persona inline, entry state, three to five beats, the climax where value lands, the resolution, optionally one failure. One sentence each at low stakes; add a flow and edge cases when it feeds UX or architecture. -->

## Glossary
<!-- required. Each domain noun defined once. -->

## Features and requirements
<!-- required. By feature: its behavior and the journeys it realizes, then nested FR-N: "[Actor] can [capability] [under conditions]", testable consequences, out-of-scope bounds. -->

## Non-goals
<!-- required. What this is not and will not become, so no level below adds the nearby thing. -->

## MVP scope
<!-- required. In scope; out of scope, each with a reason and its target release. -->

## Success metrics
<!-- required. SM-N with target and the FRs they validate; counter-metrics naming the metric they balance. -->

## Quality and constraints
<!-- include when: performance, security, reliability, privacy or cost matter product-wide. -->

## Experience and platform
<!-- include when: a consumer or branded product. Tone, information architecture, platforms, monetization. -->

## Stakeholders, risks and rollout
<!-- include when: several teams or an enterprise. Sign-offs, risks and mitigations, rollout, change management. -->

## Integrations and operations
<!-- include when: it depends on existing systems or carries service levels. -->

## Data and compliance
<!-- include when: personal or regulated data, or a regulation the user names. Residency, retention, audit, each named obligation. -->

## API contract and versioning
<!-- include when: a developer product. Public surface, breaking-change and deprecation policy. -->

## SLOs and performance budgets
<!-- include when: consumers depend on latency, throughput or availability. -->

## Consumer migration
<!-- include when: existing consumers must move. -->

## Developer experience
<!-- include when: developers adopt it. Onboarding, documentation, errors, samples. -->

## Hardware and deployment
<!-- include when: embedded or hardware. Memory, power, form factor, updates, environment. -->

## Stories
<!-- include when: the work is one or two stories. Each with acceptance criteria. -->

## Open questions
<!-- required. Each becomes a ticket or research. -->
