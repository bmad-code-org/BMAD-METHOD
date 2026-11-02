---
title: ""
template: prd
version: 1.0.0
description: "Requirements a team builds from, at any altitude."
not_for: "Deciding whether to build (`brief`, `opportunity`); a very simple project (`prd-light`); one feature for a coding agent (`agent-spec`); a regulated or contracted baseline (`srs`); what a business signs for when the builder is a separate party (`brd`)."
rubric: rubric-planning
status: draft
created: ""
updated: ""
---

<!-- purpose: Requirements a team, human or AI, builds from. -->

<!-- stance: This template is expert prior knowledge, not a checklist. Required here means the default: drop a section only for a reason a reviewer would accept, reorder and combine for readability, and never include one just because it appears. Drop or downscale journeys for a single-operator internal tool, a regulatory-only update, hobby work or a purely technical PRD. Otherwise journeys are captured, not authored: the user narrates a real session with a named protagonist (Mary, mom of three, not "the user"), covering what the person does, in what order and where it lands; you structure it into UJ-N form and confirm. On the coaching path, ask which entry fits, because it sets the section order: Vision + Features (capability-first, for enterprise, developer products, internal tools and anyone who thinks in features), Journey-led (user-first, for consumer, UX-heavy and multi-stakeholder products), or let you suggest from what you heard.

Altitude sets what this document decides: keep a line when the level below would decide wrongly without it, and leave it out when that level would decide better with more information. A program PRD states outcomes, the initiatives and their order, and the rules over all of them, with no requirements. An initiative PRD states the problem and who has it, the outcome and its measures, capabilities with one checkable result each, rules, non-goals, known risks and the questions only the user can answer; how each capability behaves, screens, architecture, story order and the edge cases an epic will meet stay below it. An epic PRD states testable requirements, edge cases and failure states, what is in and out for this slice and what stays unchanged; it cites its parent's ids rather than restating them, and leaves data model, APIs and story scenarios below it. Non-goals and known rabbit holes take detail at every altitude, because they stop invention below. -->

<!-- inputs: Form factor if the sources do not say. Only the user knows who it is for, what is out, and what success looks like. -->

<!-- writing: Capabilities, not implementation. Ids (UJ-N, FR-N, RULE-N, SM-N, OQ-N) are global; no traceability matrix. Domain nouns are used exactly as the glossary defines them. Ceilings: about 3,000 words at program or initiative altitude, 2,000 at epic altitude, two pages for hobby and solo work. A document past its ceiling pushes detail to the level below or splits; padding to look thorough is the failure. -->

<!-- done when: Every FR can be checked at its altitude and traces to a journey or need, and every journey beat that needs the product has an FR; non-goals and out-of-scope items are explicit; above hobby stakes, success metrics name their counter-metrics; the shape fits the product (journeys carry a consumer, multi-stakeholder or UX-heavy product, a single-operator tool reads as a capability spec, a regulatory update traces its constraints, hobby work stays light); the user remembers making every decision in it, and nothing was invented to fill a section. -->

<!-- next: At close, say the PRD is revisited after each epic lands: what was learned retires assumptions and open questions through an Update. -->

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
<!-- required. By feature: its behavior and the journeys it realizes, then nested FR-N: "[Actor] can [capability] [under conditions]" and out-of-scope bounds. At epic altitude each FR adds testable consequences; above it, one checkable result per capability, the edge cases left to the epics. At initiative altitude each feature is a likely epic: name it so the name lasts, and order features by dependency. Add a feature's own NFRs when they apply only to it. -->

## Rules
<!-- include when: program or initiative altitude, where it is required; below that, when a rule spans the FRs and no parent states it. RULE-N, one line each: what everything below must obey, whichever feature it touches. A rule from a `brd` or a parent document keeps its id. -->

## Non-goals
<!-- required. What this is not and will not become, so no level below adds the nearby thing. -->

## MVP scope
<!-- required. In scope; out of scope, with a one-line reason where it matters. Anything deferred names its target release, or says a later version when what the first one teaches will decide. Once the requirements are out and before settling this section, step back and coach leanness from what you know: how much was asked for against the team and the date, and whether this proves out an idea, delivers a clear mandate or meets a regulation. When it looks ambitious, say so in your own words, name what could wait and why, and make the case for a first version small enough to finish, test fully and win with, then a next one built on what that teaches. Press hardest on an idea being tested, ease off where a mandate or regulation fixes the scope, and skip this when the work is already lean. The call is the user's: what they keep stays. Headless, list the candidates as an open question and cut nothing. -->

## Success metrics
<!-- required. SM-N with the current value where known, the target and the FRs they validate; counter-metrics naming the metric they balance. One sentence is enough at hobby stakes. -->

## Quality and constraints
<!-- include when: performance, security, reliability, privacy or cost matter product-wide. RULE-N under the same id, each with a threshold and the user outcome it protects; no generic non-functional list. -->

## Change boundary
<!-- include when: the work changes an existing product. What stays as it is, what changes, what is added and what must not change. -->

## AI behavior and evaluation
<!-- include when: a model decides or generates what users see. What it must never do; failure modes taken from real outputs, a prototype's where one exists; eval thresholds to ship and to roll back; fallback on refusal, timeout, tool failure and low confidence. -->

## Experience and platform
<!-- include when: a consumer or branded product. Tone, information architecture, platforms, monetization. -->

## Stakeholders, risks and rollout
<!-- include when: several teams or an enterprise. Sign-offs, risks and mitigations, rollout with an owner and needed-by date per gate, each checked against the launch date, change management. diagram: gantt -->

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

## Decisions
<!-- optional. One line per decision: what was chosen, why, and the alternative it beat. A decision deferred on purpose names what would trigger making it. There is no addendum: detail stays in the memlog, a decision worth its own record goes to `decision-record`, a technical one to `bmad-architecture`, an edge case to the epic that meets it. -->

## Open questions
<!-- required. OQ-N, each with an owner, when it is needed and the FRs or gates it blocks. Each becomes a ticket or research. -->
