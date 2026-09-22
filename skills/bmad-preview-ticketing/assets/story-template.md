---
id: [the entry's id in tickets.toml; the next unused one for a ticket with no entry]   # tracker_id and remote are written at publish on a tracker
type: story
title: "[What exists or works when this is done]"
parent: [folder name of the epic, or of the initiative when there are no epics; none for a standalone ticket in backlog/]
covers: [ids from the epic's spec, referenced numbered source, or Requirements; the ones this ticket delivers toward]
after: []   # prerequisites only: a sibling's id; "<epic id>.<entry id>" in another epic; epic-<slug> for that whole epic
assignee: ""   # blocked_at (date) and blocked_reason are added when waiting on a person or an answer
refined: false   # true once refined and approved
hitl: false   # status is written by the build (draft | ready-for-dev | in-progress | in-review | done | blocked); tracker_status by a tracker sync
risk: [low|medium|high]
estimate: ""   # points, when estimation is on
---

<!-- Pulled: a one-sentence Description, Acceptance Criteria as one Verify: line, References, local Notes. Refined: the same, reviewed with the user. Numbered criteria and Boundaries only for a ticket with no epic, an entry with `refine = true`, or on request. -->

# [Title]

## Description

[One sentence, what this delivers; reviewed with the user at refine. With numbered criteria: what exists or works when this is done and how it advances the epic, 2–4 sentences; the criteria carry the proof, do not restate them.]

## Acceptance Criteria

[One line, `Verify: how it will be checked`, nothing else. No epic, `refine = true`, or on request: the numbered criteria below instead.]

1. **[Short name of the behavior]**
   **Given** [the state before: data, user, config]
   **When** [the one action]
   **Then** [what is observed: a response, a record, a screen — something a person or a test can check]
   **And** [a further observation from the same action, when there is one]
2. **[Short name of the behavior]**
   **Given** [...]
   **When** [...]
   **Then** [...]

## Boundaries

- Must not change: [adjacent behavior a valid implementation could damage — name behavior, not files]

## References

- parent — [path or url]
- [source document — path, section]
- [design or prototype — path, for UI work]

## Notes

[Only what is not in the repo or the source, and what is not settled. Cut if empty.]

- [A frozen interface, a declined option]
- Decision: [a choice the user made, dated]
- Assumption: [a choice made while drafting that the user has not confirmed; confirmed, it becomes a Decision line]
- Open question: [what only this ticket waits on. Touches siblings: the parent's Notes. Gates work: a spike.]

## Plan

<!-- Filled in by the coding agent; never sent to a tracker. -->

<!-- Example, not part of the ticket: match its level of detail. What is good here: the Description is what the shopper can do, end to end; every criterion states a rule, not an instance, with its failure path, fails today and passes only through this work; Boundaries names behavior, not files; References points at the nearest document; Notes holds only what is not in the repo or the source, plus one assumption for the user to confirm. Numbered criteria because its entry says `refine = true`. -->

```markdown
---
id: 4
type: story
title: "A shopper applies a discount code and sees the new total"
parent: epic-cart-rules
covers: [R2, R3]
after: [3]
refined: true
hitl: false
risk: medium
---

# A shopper applies a discount code and sees the new total

## Description

A shopper with items in the cart enters a discount code, and the cart total updates to show the discount before tax. An invalid or expired code tells them why it was refused and leaves the total as it was.

## Acceptance Criteria

1. **Valid code reduces the total**
   **Given** a cart and a valid discount code
   **When** the shopper applies it
   **Then** the total drops by the code's value and a discount line shows the code and the amount
2. **Expired code is refused with the reason**
   **Given** a cart and an expired code
   **When** the shopper applies it
   **Then** the total is unchanged and the message says the code expired and when
3. **Unknown code is refused without revealing valid codes**
   **Given** a cart and a code that does not exist
   **When** the shopper applies it
   **Then** the total is unchanged and the message says the code is not recognized, nothing more
4. **An applied code survives a quantity change**
   **Given** an applied code
   **When** the shopper changes an item's quantity
   **Then** the total recomputes with the code still applied
5. **Payment receives the discounted total**
   **Given** an applied code
   **When** the shopper continues to payment
   **Then** the amount sent to payment equals the total shown

## Boundaries

- Must not change: catalog prices, tax computation, the cart for shoppers who apply no code.

## References

- parent — _bmad-output/initiative-checkout/epic-cart-rules/epic-cart-rules.md, Requirements R2 and R3
- design — https://figma.com/design/ab12cd/checkout, frame Cart

## Notes

- Decision: the discount engine's `validate(code, cart) -> {amount, reason}` interface is frozen (2026-08-12).
- Assumption: the refusal messages above are final copy; no design text exists for them.

## Plan

<!-- Filled in by the coding agent; never sent to a tracker. -->
```
