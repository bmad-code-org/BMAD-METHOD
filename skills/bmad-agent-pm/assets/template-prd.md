---
title: ""
template: prd
description: "Committed work that needs requirements to build from, at any altitude. Not for deciding whether to build (`brief`, `opportunity`); one feature for a coding agent (`agent-spec`); a regulated or contracted baseline (`srs`)."
rubric: rubric-prd.md
status: draft
created: ""
updated: ""
---

<!-- purpose: Requirements a team, human or AI, builds from. -->

<!-- stance: This template is expert prior knowledge, not a checklist. Required here means the default: drop a section only for a reason a reviewer would accept, reorder and combine for readability, and never include one just because it appears. Drop or downscale journeys for a single-operator internal tool, a regulatory-only update, hobby work or a purely technical PRD. Otherwise journeys are captured, not authored: the user narrates a real session with a named protagonist (Mary, mom of three, not "the user"), covering what the person does, in what order and where it lands; you structure it into UJ-N form and confirm. On the coaching path, ask which entry fits, because it sets the section order: Vision + Features (capability-first, for enterprise, developer products, internal tools and anyone who thinks in features), Journey-led (user-first, for consumer, UX-heavy and multi-stakeholder products), or let you suggest from what you heard. -->

<!-- inputs: Form factor if the sources do not say. Only the user knows who it is for, what is out, and what success looks like. -->

<!-- writing: Capabilities, not implementation. Ids (UJ-N, FR-N, SM-N) are global; no traceability matrix. Domain nouns are used exactly as the glossary defines them. Hobby and solo PRDs run about two pages, internal tools five to eight, launch PRDs and those feeding UX and architecture as long as their FRs and concerns require; padding to look thorough is the failure. -->

<!-- done when: Every FR can be checked at its altitude and traces to a journey or need, and every journey beat that needs the product has an FR; non-goals and out-of-scope items are explicit; above hobby stakes, success metrics name their counter-metrics. -->

# {title}

## Table of Contents

## Document purpose
<!-- required. Who reads it, and the inputs it builds on (ticket, brief, UX work) with where they live, instead of repeating them. -->

## Vision
<!-- required. Two or three paragraphs, compelling enough to stand alone: what this is, for whom, why it matters, and why now when timing matters. -->

## Users and journeys
<!-- required. Who it serves and their jobs (emotional, social, functional, contextual, whichever apply); non-users when the audience boundary is not obvious; UJ-N journeys: a named protagonist with persona inline, entry state, three to five beats, the climax where value lands, the resolution, optionally one failure, ending with the FRs that realize it. Each beat forces specificity the team would otherwise leave implicit: auth assumptions, screen order, what tells the user value landed. One sentence each at low stakes; add a flow and edge cases when it feeds UX or architecture. -->
<!-- example: UJ-3. Priya checks the trip damage before she's even home. Priya, budgeting on a single income with a new baby, finishes a grocery run and gets in the car. Already authenticated via biometric on a previous session, she opens the app, taps the camera and scans the receipt. The app reads the total and shows a single-screen overlay: this trip $84.20, weekly cap $250, $172.10 remaining, three days left in the week. She closes the app and drives home. Edge case: if she scanned a receipt earlier today, the app asks whether this replaces or adds to that trip before counting it against the cap. -->

## Glossary
<!-- required. Each domain noun defined once, with its relationships to other terms and its cardinality where relevant. A new noun in Features joins the glossary in the same pass. -->

## Features and requirements
<!-- required. By feature: its behavior and the journeys it realizes, then nested FR-N: "[Actor] can [capability] [under conditions]" and out-of-scope bounds. At epic altitude each FR adds testable consequences; above it, one checkable result per capability, the edge cases left to the epics. Add a feature's own NFRs when they apply only to it. -->

## Non-goals
<!-- required. What this is not and will not become, so no level below adds the nearby thing. -->

## MVP scope
<!-- required. In scope; out of scope, with a one-line reason where it matters and the target release of anything deferred. -->

## Success metrics
<!-- required. SM-N with target and the FRs they validate; counter-metrics naming the metric they balance. One sentence is enough at hobby stakes. -->

## Quality and constraints
<!-- include when: performance, security, reliability, privacy or cost matter product-wide. -->

## Experience and platform
<!-- include when: a consumer or branded product. Tone, information architecture, platforms, monetization. -->

## Stakeholders, risks and rollout
<!-- include when: several teams or an enterprise. Sign-offs, risks and mitigations, rollout with an owner and needed-by date per gate, change management. diagram: gantt -->

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
