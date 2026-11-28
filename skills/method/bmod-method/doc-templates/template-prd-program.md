---
title: ""
template: prd-program
version: 1.0.0
description: "Outcomes, guardrails, rollout strategy and initiative map for a program."
not_for: "One initiative with several capabilities (`prd`); one capability's requirements (`prd-epic`); program mandate and governance (`charter`); contracted business baseline (`brd`)."
agents: [bmad-agent-pm]
facilitation_order: [problem-and-vision, scope-and-non-goals, okrs, invariants, shared-nouns-and-seams, initiative-map, rollout-and-integration-strategy, deferred-decisions-and-risks]
guidance: guidance-method.md
rubric: rubric-planning.md
forbid_id_prefixes: [FR]
status: draft
created: ""
updated: ""
---

<!-- purpose: The portfolio contract several initiatives build under: what the program is for, how portfolio and wave outcomes are graded, what no initiative may break, cross-domain seams, how initiatives split, and how the program rolls out and integrates. People, architects and delivery leads read it in ten to fifteen minutes. -->

<!-- stance: Stay strictly at program altitude. Sort every detail by reach: only what crosses initiatives belongs here; single-initiative design, child epic maps and granular requirements stay out. In the read-back, before any section is worked, propose provisional initiatives (INIT-01, INIT-02..), each a bounded domain workstream with a name and a line, and confirm or reshuffle them; the Initiative map is finalized once scope, OKRs, invariants and seams settle. From then on, when the user gives a detail that belongs to one initiative, never turn it away and never expand it here: write it in their words under that initiative's `Saved for this initiative:` in the Initiative map and say where it went. Never cut rollout, migration or pilot phases as initiatives. When the work fits one initiative, say so and offer `prd`; when sponsor mandate, funding or decision rights are the core question, offer `charter`. Stop when the program is ready to launch Wave 1. -->

<!-- opening: First establish whether the program is legacy modernization, net-new greenfield, or hybrid, which decides the rollout and integration strategy. Then invite an uninterrupted brain dump: why the program exists, who it serves, the outcomes expected across waves and the major domain workstreams, plus any charter, BRD, strategy doc or existing architecture context to read first. -->

<!-- inputs: Read any charter, BRD, strategy doc or enterprise architecture first before asking anything it answers. Keep any upstream document ids and cite them by short handle and id rather than copying their full text or reusing them for different items, and continue numbering above its highest id when adding new items in the same prefix. Only the user knows sponsor outcomes, priorities, risk appetite and constraints. -->

<!-- writing: Outcomes, guardrails, seams and initiative boundaries — zero child epic maps and zero requirement lists (`FR` belongs in each epic's `prd-epic`, never here). Global ids: OKR-N, INV-N, OQ-N, and INIT-01, INIT-02 onward for initiatives (never E01, which belongs to epics). Give each id a short bold handle at definition time; child initiative PRDs cite them by handle and id rather than restating their full text. Shared nouns and cross-domain contract names are used exactly as defined. Shape cues: Problem and vision half a page, each initiative three to five lines. Padding to look thorough is the failure. -->

<!-- done when: Portfolio and wave OKRs are agreed with Passable / Good / Excellent bands and how production measures each; enterprise invariants and cross-domain seams are settled enough that Initiative 1 will not corner Initiative 2; the Initiative map (INIT-01..) is agreed and Wave 1 is chosen; the rollout and integration strategy matches legacy, greenfield or hybrid reality; every deferred decision names an owner or initiative; and nothing was invented to fill a section. -->

# {title}

## Table of Contents

## Problem and vision
<!-- Half a page at most. One line on who reads this and the inputs it builds on, with where they live. Then the program problem and who has it, why now, the target end state across waves, and who is affected. Ask what stays broken across the organization if these initiatives run uncoordinated instead of as one program. -->

## OKRs
<!-- Portfolio and wave-level outcomes the program must prove, graded before anything is built. Ask what the sponsor wants shown or proven across waves, and who will judge it, in a message that proposes nothing so their answer is not anchored on yours. Once answered, propose the key results with all three bands filled in, each marked as your proposal for the user to react to and sharpen. One to three objectives, each an outcome in a sentence, with its key results in a table: OKR-N, the measure, current baseline when known, Passable (the floor to advance or keep funding), Good (the target for the delivery wave), Excellent (the long-horizon stretch, showing where the design must leave room), how production measures it and when it is read, and the initiatives (INIT-NN) that move it. No key result stands until it names how production measures it; one nobody can measure is cut or becomes an open question. Press when the bands sit too close together, when Passable is today's baseline, or when every result counts outputs shipped rather than business or user change. Add counter-metrics naming the OKR-N each keeps honest. Done when the sponsor could grade a wave Passable, Good or Excellent from this table alone. -->

## Scope and non-goals
<!-- Crisp bullets, settled before metrics and seams drift: in now (Wave 1), later waves (each with the trigger or wave OKR gate that brings it in), and never (what this program will not take on). Ask what delivery leads or stakeholders will assume is included or will push into Wave 1. When modernizing a legacy estate or running hybrid, add a table of what stays as it is, what changes, what is added and what retires, and ask what users or downstream consumers rely on that nobody wrote down. Weigh the initiative map against team capacity and target dates: make the case for launching Wave 1 small enough to finish, integrate cleanly and prove value. Headless, list candidates as open questions and cut nothing. -->

## Invariants
<!-- `INV-N — <short handle>`, one line each, binary pass or fail rules inherited by every initiative: security, tenant isolation, data sovereignty, audit trail, regulatory or contractual obligations. Coach it as a workout: ask what must always or never hold before proposing any, and never open with a drafted list. A quality that can be better or worse is an OKR, not an invariant; when it also needs a hard floor, the invariant cites the OKR by handle and id and takes its Passable band so numbers live in one place. A rule from a `brd` or `charter` keeps its BR-N or RULE-N id. No generic non-functional checklist. -->

## Shared nouns and seams
<!-- A table of the canonical nouns shared across more than one initiative: what each is, its major states, and which bounded domain owns its system of record. Draft from what the user said and ask what is wrong, missing or owned elsewhere; a noun inside one initiative stays out. `diagram: er` when three or more nouns relate. Then cross-domain and external seams: each interface between initiatives or external systems, what crosses, the versioned contract boundary, and who owns each side. `diagram: flowchart` showing the domains/systems and what moves between them. -->

## Initiative map
<!-- Proposed provisionally in read-back as domain buckets and finalized here after scope, OKRs, invariants and seams settle. Bounded domain initiatives (`### INIT-01: <Name>`, `### INIT-02: <Name>`, ... — never E01, and never cut rollout, migration or pilot phases as initiatives). Each entry three to five lines: what it delivers and for whom, one outcome checkable when done, the OKR-N ids it moves, and dependencies on other initiatives. Zero child epic maps and zero requirement lists. Under each entry, `Saved for this initiative:` holds single-initiative details the user shared, verbatim, one line each. Name Wave 1 (which initiatives start first and why) and ask which boundary the user is least sure of. Done when the user defends the domain split and Wave 1 is chosen. -->

## Rollout and integration strategy
<!-- Adaptive to the program type established at Opening:
- Legacy modernization: Strangler Fig / parallel run, dual-write or coexistence boundaries, data migration and reconciliation waves, cutover sequencing, and rollback gates per wave.
- Net-new greenfield: Wave 0 walking skeleton proving end-to-end integration early, shared platform or foundation initiative sequencing, progressive release waves (Alpha / Beta / Pilot / GA) tied to wave OKR gates and cross-domain contract tests.
- Hybrid: legacy coexistence and migration boundaries paired with greenfield progressive release waves.
Never cut rollout, migration or pilot phases as standalone initiatives or epics; they live here as wave gates and cutover controls. Include rollback triggers tied to OKR-N Passable floors or INV-N breaches. -->

## Deferred decisions and risks
<!-- Deliberately deferred program decisions (OQ-N table: decision or question, owning initiative or person, needed-by wave or date) and program-level risks with mitigations; single-initiative risks move to `Saved for this initiative:`. When multiple teams, dated launches or user migrations are involved, list cross-team gates with owner and needed-by date. `diagram: gantt` when dates are supplied. -->
