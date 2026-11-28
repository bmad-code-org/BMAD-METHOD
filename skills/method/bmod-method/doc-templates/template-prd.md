---
title: ""
template: prd
version: 1.4.0
description: "Outcomes, guardrails and the epic map for work with several capabilities."
not_for: "Multi-initiative programs (`prd-program`); one capability's detailed requirements (`prd-epic`); deciding whether to build (`opportunity`) or writing down why (`brief`); a hobby project, or an idea to try before committing (`prototype-plan`); a regulated or contracted baseline (`srs`); what a business signs for when the builder is a separate party (`brd`)."
agents: [bmad-agent-pm]
facilitation_order: [problem-and-users, journeys, scope-and-non-goals, okrs, invariants, shared-nouns-and-seams, epic-map, deferred-decisions-and-risks]
guidance: guidance-method.md
rubric: rubric-planning.md
forbid_id_prefixes: [FR]
status: draft
created: ""
updated: ""
---

<!-- purpose: The contract several epics build under: what the work is for, how success is graded, what none of them may break, and how it splits. People, architects and coding agents read it in ten to fifteen minutes. -->

<!-- stance: This document stays thin. Sort every detail by how far a change to it would reach: what several epics must agree on belongs here, and what touches one epic is saved for that epic and kept out of every other section. In the read-back, before any section is worked, propose provisional epics — the cohesive capabilities in the journey the user just walked, each a name and a line — and let the user confirm or reshuffle them; they stay open while scope, OKRs, invariants and seams settle and are finalized second-to-last in the Epic map. From then on, when the user gives a detail that belongs to one epic, never turn it away and never expand it here: write it in their words under that epic's `Saved for this epic` in the Epic map and say where it went. When only one capability comes out, or the user says this is for one epic, say so and offer `prd-epic` in its place. When the capabilities share no outcome, invariant or noun, say this looks like more than one initiative and ask which to take first, or offer `prd-program` when they belong together under one multi-initiative program. Journeys are captured, not authored: the user narrates and you structure. Stop when the document is ready to slice; going deeper is each epic's job. -->

<!-- opening: Whether this is a new product or a change to an existing one, which decides how much of what exists the document must respect. The brain dump runs uninterrupted: why this exists, who it is for and the rough arc from start to finish, with any brief, research, notes or code to read. -->

<!-- inputs: Under a program, read its `prd-program` first and ask only for what differs here. For a change to an existing product, read the code or its architecture document before asking anything it answers. A business requirements document among the sources: keep its ids. Only the user knows who it is for, what is out and what success looks like. -->

<!-- writing: Outcomes and guardrails, not behavior, and no requirement lists: an FR belongs to its epic's PRD. Ids (OKR-N, INV-N, UJ-N, OQ-N, and E01, E02 for epics) are global, and a child document cites them rather than restating them. Shared nouns are used exactly as defined. Shape cues: Problem and users half a page, an epic three to five lines. Padding to look thorough is the failure. -->

<!-- done when: The document is ready to slice, not complete: the OKRs are agreed, each with its three bands and how production measures it; the invariants and shared nouns are settled enough that the first epic will not corner the second; every decision put off names the epic or person who will make it; the epic map is agreed and the first epic is chosen. The user remembers making every decision in it, and nothing was invented to fill a section. -->

# {title}

## Table of Contents

## Problem and users
<!-- Half a page at most. One line on who reads this and the inputs it builds on, with where they live. Then the problem and who has it, what this is, why it matters, and why now when timing matters; and who it serves, with their jobs, and the non-users when the boundary is not obvious. Ask who has the problem worst and what it costs them. -->

## OKRs
<!-- What the delivery must prove, graded before anything is built. Ask what the user wants shown or proven when this ships, and who will judge it, in a message that proposes nothing, so their answer is not anchored on yours. Once they have answered, propose the key results with all three bands filled in, grounded in this domain and in what the journeys and epics suggest, each marked as your proposal for the user to react to and sharpen: most people freeze when asked for graded numbers from a blank page. A key result is a business outcome, or a quality the product must show, such as speed, reliability, accuracy, cost or adoption. One to three objectives, each an outcome in a sentence, with its key results in a table: OKR-N, the measure, where it stands today when known, then a column for each of three bands, Passable (the floor to ship: below it the release is held or rolled back), Good (the target for this delivery) and Excellent (the long-horizon stretch, which shows where the design must leave room), how production will measure it and when it is read, and the epics that move it. No key result stands until it names how it will be measured; one nobody can measure is cut or becomes an open question. A band the user has not reacted to stays tagged as yours. Press when the three sit so close they are one target, when Passable is where things already stand, or when every key result counts output shipped and none counts what changed for the user. Then the counter-metrics, each naming the key result it keeps honest. Done when the user could grade the finished delivery Passable, Good or Excellent from this table alone. -->

## Scope and non-goals
<!-- Crisp bullets, settled before the metrics and seams drift: in now; later, each with what would bring it in; and never, what this is not and will not become, so no epic adds the nearby thing. Ask what a builder or a stakeholder would assume is in and is not, and which request the user expects in the first review and will turn down. When the work changes an existing product, add a table of what stays as it is, what changes, what is added and what must not change, and ask what users of the current product rely on that nobody wrote down. Then weigh the epic map against the team and the date: when it looks ambitious, say so in your own words, name the epics that could wait and why, and make the case for a first release small enough to finish, test fully and win with. Press hardest on an idea being tested and ease off where a mandate or regulation fixes the scope. The call is the user's: what they keep stays. Headless, list the candidates as an open question and cut nothing. -->

## Invariants
<!-- INV-N, one line each, pass or fail with nothing graded, and inherited by every epic: who may see what, isolation between customers, encryption, an audit trail, a legal or contractual obligation. Coach it as a workout: ask what must always or never hold before you propose any, and never open with a drafted list. A quality that can be better or worse is an OKR, not an invariant: when it also needs a floor, the invariant cites the OKR-N and takes its Passable band, so each number lives in one place. No generic non-functional list. A rule from a `brd` or a parent document keeps its id. -->

## Shared nouns and seams
<!-- A table of the five to fifteen nouns more than one epic touches: what each is, its major states, and which system holds its record. Draft it from what the user has said and ask which are wrong, missing or owned elsewhere; a noun only one epic uses is left to that epic. diagram: er, when three or more of the nouns relate; state, for a noun whose lifecycle several epics move. Then the seams: each system or contract outside this work that it touches, what crosses, and who owns the other side. diagram: flowchart of those systems and what moves between them. -->

## Journeys
<!-- The few end-to-end flows, UJ-N, each with a named person, where they start, what they get, and the steps between at the level of capabilities, with the epic that carries each step. No screens, filters or error messages, which belong to the epics. Structure them from the user's own telling and confirm. diagram: a flowchart for a journey that branches or passes between people or systems, in place of walking it in prose. -->

## Epic map
<!-- Proposed provisionally in the read-back and confirmed here once scope, OKRs, invariants and seams settle. The epics are this initiative's cohesive capabilities, taken from the journey the user walked: each is something a person could see working by itself. When describing one takes an "and" that joins two things which each stand alone, it is two. Put a split the user brings to the same test. Each gets a `###` with its id, E01 onward, and name, then three to five lines: what it delivers and for whom, one outcome someone could check when it is done, the OKRs it moves, and what it needs from another epic. No requirement list. Under it, `Saved for this epic:` holds the single-epic details the user gave, in their words, one line each. Name the epic to take up first and why, and ask which the user is least sure of. Done when the user would defend the split and the first epic is chosen. -->

## Deferred decisions and risks
<!-- This is the section for open questions. A table of what is deliberately not decided here: each decision or question (OQ-N), the epic that will settle it or the person who owns it, and when it is needed. Then the risks to the whole, each with what is being done; a risk inside one epic is saved for that epic. When several teams, a dated launch or users who must move are involved, the gates, each with an owner and a needed-by date. diagram: gantt, when the user gave the dates. -->
