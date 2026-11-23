---
title: ""
template: prd-epic
version: 1.0.0
description: "One capability's requirements, with or without a parent PRD: journeys, FRs, rules, measures."
not_for: "Work with several capabilities, which needs its outcomes and epic map first (`prd`); a hobby project, or an idea to try before committing (`prototype-plan`); a single story, which is a story ticket from Sofia (`bmad-agent-po`); a regulated or contracted baseline (`srs`)."
agents: [bmad-agent-pm]
facilitation_order: [context, journeys-and-flows, rules-edge-cases-and-failure-modes, requirements, instrumentation, seams, product-specifics, changes-to-the-parent, open-questions]
guidance: guidance-method.md
rubric: rubric-planning.md
status: draft
created: ""
updated: ""
---

<!-- purpose: Everything needed to build one capability and prove it worked, detailed enough that stories can be cut from it with nothing dropped. -->

<!-- stance: Go deep, inside this epic only. With a parent PRD, inherit: cite its OKRs, invariants and nouns by id, never restate them, and ask only for what this epic adds. With none, the Context section carries a short version of what a parent would have settled. Requirements are distilled, not listed cold: draw out the journeys, rules and failure cases first, then number what they imply and check the list with the user for gaps and creep. A detail that belongs to another epic is not worked here: name the epic and write it under Open questions for it. -->

<!-- opening: Read before asking anything: the parent PRD when there is one, with what it saved for this epic, any architecture document, and the code built so far. Open with a playback of what is already known about this epic, five bullets at most, so the user starts from there. With a parent, ask only which of its OKRs this epic moves and to which band now, and what is out for this epic. The brain dump is how the capability should work from the first step to the last; with no parent it also covers why this exists and who it is for. -->

<!-- inputs: The parent PRD and its entry for this epic; the architecture document or the live code; tracker comments on the epic. Only the user knows the band to aim for and what this slice leaves out. -->

<!-- writing: Ids carry the epic when a parent names one, such as E02-FR-01; with no parent, FR-1. Ten to twenty-five FRs: more means two epics. Each FR is one testable statement, "[Actor] can [capability] [under conditions]", with its result. Behavior, not implementation: no schema, endpoint or file, which the technical design owns. About 2,000 words. -->

<!-- done when: Every FR can be checked and traces to a journey or a rule; every journey step that needs the product has an FR; the failure cases a builder would otherwise guess are written down; what proves the target band is named; nothing restates the parent; and the user remembers making every decision in it. -->

<!-- next: At close, say whether Changes to the parent calls for an Update of the parent PRD, and offer it. Then the technical design (`bmad-architecture`) against the live code, and Sofia (`bmad-agent-po`) cuts the epic into stories, each citing the requirements it satisfies, with every FR covered. -->

# {title}

## Table of Contents

## Context
<!-- Half a page at most. With a parent: a line linking it, this epic's objective in a sentence, the OKRs it moves and the band it aims for now, such as OKR-2 to Good, the invariants that bear hardest on it, by id, and what is out for this epic. Nothing of the parent is restated. With no parent: the problem and who has it; what is out; one to three key results, for which you ask what the user wants proven, then propose Passable, Good and Excellent bands marked as yours, each with how production measures it; the invariants, each pass or fail; and the nouns and systems this epic touches. -->

## Journeys and flows
<!-- UJ-N journeys, each titled with what the person gets: a named protagonist with their situation in a line, where they start, three to five beats that each say what they do and what the product shows them, the moment the value lands with the real values they see, and the resolution. Then the alternate flows that matter, and where a role or permission changes what someone sees. Use the user's own people and product, and structure what they narrate. Each beat forces a choice the team would otherwise leave implicit: who is signed in, what comes first, what tells the user it worked. diagram: a flowchart for a journey that branches or passes between people or systems, in place of walking those beats in prose. -->

## Requirements
<!-- Worked after the journeys and the rules are settled, from what they imply; ask nothing for it cold. By feature, numbered FRs: "[Actor] can [capability] [under conditions]", each with a result someone could check. Add each FR's id to the end of the journey steps it realizes. Show the list and ask what is missing, what is unclear and what crept in that this epic does not need. Parity features from research are candidates for the user to keep, cut or change. -->

## Rules, edge cases and failure modes
<!-- A table: the case, and what the product does. Validation rules, permission edges, empty and error states, retries, what happens when two people act at once, and what happens when a system it depends on is down. Take each journey step and ask what could go wrong there and what the user sees; include what the user saved for this epic in the parent. Leave out what the codebase's conventions already settle. diagram: state, when the epic moves something through states. -->

## Instrumentation
<!-- What will prove the target band: the events, metrics, logs or benchmarks needed for each OKR this epic moves, where each is read and by whom. Ask how someone would know, a week after it ships, which band it reached. A measure with nothing to record it becomes a requirement here. -->

## Seams
<!-- include when: this epic takes from or gives to another epic, another team's system or an outside service. A table: the other side, what this epic needs from it or offers it, who owns it, and what happens here when it is unavailable. The public surface with its breaking-change policy, and service objectives with their window and budget, when other software depends on this epic. diagram: sequence, for an exchange of more than two steps. -->

## Product specifics
<!-- include when: one of these holds; give each that holds its own `###` and leave the rest out. A model decides or generates what users see: what it must never do, failure modes taken from real outputs, a prototype's where one exists, eval thresholds to ship and to roll back, and the fallback on refusal, timeout, tool failure and low confidence. A consumer or branded product: tone, information architecture, platforms, monetization. Developers adopt it: onboarding, documentation, errors, samples. Embedded or hardware: memory, power, form factor, updates, environment. -->

## Changes to the parent
<!-- include when: a parent PRD exists. Ask it last: did anything found here change a shared noun, an invariant, an OKR or another epic's entry? "None" is the usual answer and is written as that. Otherwise the exact change, and which other epics it touches. -->

## Open questions
<!-- OQ-N, each with an owner, when it is needed and the FRs it blocks. A detail that belongs to another epic is listed under that epic's name, in the user's words. -->
