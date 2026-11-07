---
title: ""
template: postmortem
version: 1.0.0
description: "Causes and actions after something went wrong, written blamelessly."
not_for: "Judging a person's performance."
rubric: rubric-planning
status: draft
created: ""
updated: ""
---

<!-- purpose: Learn from something that went wrong: what happened, why, and what changes so it does not recur. -->

<!-- stance:
  - Blameless: assume people acted sensibly on what they knew, and fix systems and processes, not people.
  - Facts before causes: settle the timeline, then analyze.
-->

<!-- inputs: Timestamped logs, chat, tickets, alerts and emails, asked for before reconstructing anything, because records beat memory; an event placed from memory alone is tagged `[ASSUMPTION]`. Only the user knows what people saw and believed at each moment, where the team got lucky, and which actions it will commit to. -->

<!-- writing:
  - Roles, not names, wherever cause is discussed.
  - Prefer action items that change a system over "be more careful".
  - One time zone, stated once.
-->

<!-- companions: When customers were told or still need telling, also write `{id}-{slug}-customer-notice.md`: what happened, who was affected and what changed, in plain words, with no internal names or system details. -->

<!-- done when: A reader who was not involved can follow the timeline and see how each factor contributed, and every factor has an action or a stated reason it has none. -->

# {title}

## Table of Contents

## Summary
<!-- required. What happened, the impact, and where things stand, in two or three sentences. -->

## Impact
<!-- required. Who or what was affected, how much, for how long. -->

## Timeline
<!-- required. From the earliest trigger through detection, response and resolution, with times. diagram: timeline -->

## Detection and response
<!-- optional. How it was noticed, how long it went unnoticed, what sped or slowed the response. -->

## Contributing factors
<!-- required. The conditions and decisions that combined to cause it, the trigger separated from what let it do harm. When an answer names a person as the cause or stops at human error, ask what let the mistake happen. diagram: flowchart -->

## Lessons
<!-- optional. What went well, what went poorly, where the team got lucky. -->

## Action items
<!-- required. Owner, due date, the factor addressed, and whether it prevents, detects or mitigates. -->

## Communication
<!-- include when: customers, funders or the public were told or still need telling. What was said and what remains. -->
