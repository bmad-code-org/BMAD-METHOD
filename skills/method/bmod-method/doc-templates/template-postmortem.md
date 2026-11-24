---
title: ""
template: postmortem
version: 1.3.0
category: risk-and-ops
description: "Causes and actions after something went wrong, written blamelessly."
not_for: "Judging a person's performance."
agents: [bmad-agent-architect]
order: fixed
facilitation_order: [impact, timeline, detection-and-response, contributing-factors, lessons, action-items, communication, summary]
guidance: guidance-method.md
rubric: rubric-planning.md
status: draft
created: ""
updated: ""
---

<!-- purpose: Learn from something that went wrong: what happened, why, and what changes so it does not recur. -->

<!-- stance:
  - Blameless: assume people acted sensibly on what they knew, and fix systems and processes, not people.
  - Facts before causes: settle the timeline, then analyze.
-->

<!-- opening: What went wrong and when, in a sentence or two, and where the records of it live (logs, chat, tickets, alerts), so they are read before anyone reconstructs events from memory. No brain dump: the story as people remember it, and what they think caused it, wait for the Timeline, where each is set against the records. -->

<!-- inputs: Timestamped logs, chat, tickets, alerts and emails, asked for before reconstructing anything, because records beat memory; an event placed from memory alone is tagged `[ASSUMPTION]`. Only the user knows what people saw and believed at each moment, where the team got lucky, and which actions it will commit to. -->

<!-- writing:
  - Two to three pages; the timeline and the action items are tables.
  - Roles, not names, wherever cause is discussed.
  - Prefer action items that change a system over "be more careful".
  - One time zone, stated once.
-->

<!-- companions: When customers were told or still need telling, also write `{id}-{slug}-customer-notice.md`: what happened, who was affected and what changed, in plain words, with no internal names or system details. -->

<!-- done when: A reader who was not involved can follow the timeline and see how each factor contributed, and every factor has an action or a stated reason it has none. -->

# {title}

## Table of Contents

## Summary
<!-- built: from the other sections. What happened, the impact, and where things stand, in two or three sentences. Done when it holds nothing the sections do not. -->

## Impact
<!-- Who or what was affected, how much, for how long. Ask for numbers from the records: requests failed, customers affected, minutes down, money lost. Done when each figure names its source or is tagged. -->

## Timeline
<!-- From the earliest trigger through detection, response and resolution, with times. You are an investigator who trusts records over memory: ask for the logs, chat and alerts first, and place each event from them. Hold any talk of causes until this section closes; note it for later. Done when the events run in order with times and the gaps are named. diagram: timeline -->

## Detection and response
<!-- optional. How it was noticed, how long it went unnoticed, what sped or slowed the response. -->

## Contributing factors
<!-- The conditions and decisions that combined to cause it, the trigger separated from what let it do harm. You are a blameless facilitator: assume everyone acted sensibly on what they knew. When an answer names a person as the cause or stops at human error, ask what let the mistake happen. Ask more than once why each factor existed. Done when each factor traces to a condition a system or process could change. diagram: flowchart -->

## Lessons
<!-- optional. What went well, what went poorly, where the team got lucky. -->

## Action items
<!-- Owner, due date, the factor addressed, and whether it prevents, detects or mitigates. Push back on "be more careful" and "add a checklist" when a system could change instead. Done when every factor has an action or a stated reason it has none, and every action has an owner and a date. -->

## Communication
<!-- include when: customers, funders or the public were told or still need telling. What was said and what remains. -->
