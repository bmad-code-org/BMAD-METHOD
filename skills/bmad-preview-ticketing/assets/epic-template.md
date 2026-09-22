---
tracker_id: ""   # with remote (the url), written at publish on a tracker; cut on the repo store
key: ""   # tracker project or team for everything under this, when it differs from the store's
type: epic
title: "[The outcome this container exists to reach]"
parent: [folder name of the initiative]
covers: [parent requirement ids this epic owns; keep these when adding an epic-local spec]
after: []   # epics this whole container waits on; the order of epics is in the initiative's tickets.toml
assignee: ""   # status is added when work starts (in-progress | done | dropped)
risk: [low|medium|high — the highest expected among its children]
estimate: ""   # t-shirt, when estimation is on
estimate_basis: ""   # envelope | spec | entries | stories
---

<!-- At initiative slicing, the envelope: frontmatter, Description, Outcome, Done when, Boundaries, References, and known Notes. Requirements are completed at this epic's inception, and its children are planned in `tickets.toml` beside this file. -->

# [Title]

## Description

[What is true when this is done and why it matters. With a spec, one paragraph pointing at it; without one, the intent in full.]

## Outcome

[One sentence: for whom, what changes, and the signal that shows it worked — the spec's, named not restated, when there is one.]

## Requirements

[The requirement source at this altitude: the source's lines as stable ids for children to cite, each mapping to a parent id in covers. Reuse the parent's ids when the lines are the parent's; when the epic splits or adds one, mint `E<n> (R<m>)` so the map is on the line. An epic with no parent ids, such as the platform baseline, leaves covers empty and cites the source section on each line instead. A referenced numbered source replaces it; a separate spec only when the source outgrows this section.]

## Done when

[Three to six checks a person can run without opening a child — the measures, limits, and behaviors from the source. Each fails today. Closing every child is not one.]

## Boundaries

[Which boundary this container follows — team, service, UI, capability — and what it is not. Point at the spec's non-goals when there is one.]

## References

[`type — location, section`. The spec at this level when one exists (its references are followed from there); otherwise what this was split from.]

- parent — [path or url, section containing the upstream requirement ids]
- spec — [local spec when present; its capability ids map back to parent ids]
- constraint — [the source section that binds this container: privacy, platform, licensing, performance]
- [an input the spec does not carry — location, section]

## Notes

[What is not settled at this level. Cut if empty.]

- Assumption: [a choice made while slicing that the user has not confirmed]
- Open question: [what the source does not settle and which children wait on it]
- Unknown: [what is not yet known and which entries wait on it, recorded now so it is not found late]
- Parked: [a requirement id not placed on any child, and why, with the user's knowledge]
- Decision: [a choice the user made, dated, so it is not asked again — a declined suggestion belongs here too]
- Source conflict: [id or section — what the source says vs what the code or another source shows]
- Waits on [epic] because: [the one-line reason for each entry in after]

<!-- Example, not part of the ticket: an incepted epic with no spec of its own. The parent assigned R1–R4 to this epic from an unnumbered PRD; Requirements records those lines using the same ids. Done when holds deliverable checks. Notes holds decisions and unknowns. -->

```markdown
---
type: epic
title: "Shoppers manage their cart"
parent: initiative-checkout
covers: [R1, R2, R3, R4]
assignee: ""
risk: medium
---

# Shoppers manage their cart

## Description

A shopper adds items, changes quantities, applies discount codes, and recovers from every refusal with a reason — and the total they see is always the one the payment step receives.

## Outcome

Shoppers who reach the cart continue to payment more often because the total never surprises them; the PRD's cart-to-payment completion measure is the signal.

## Requirements

- R1: Add, remove, and change quantity of any item; the total updates at once. (PRD, Capabilities, Cart)
- R2: Apply one discount code; refused codes say why. (PRD, Capabilities, Cart)
- R3: The total shown is the total charged, before tax. (PRD, Capabilities, Cart)
- R4: Cart actions respond within 300 ms on the slowest supported device. (PRD, Constraints)

## Done when

1. R1–R3 work end to end on the live site, refusals included, with the reason shown.
2. The end-to-end suite proves the shown total equals the amount sent to payment on every cart path.
3. R4 holds on the slowest supported device under the load test.
4. A shopper with no code applied sees no change from today's cart.

## Boundaries

The cart UI. Not the pricing service (epic Pricing rules), not tax (epic Tax and payment).

## References

- prd — _bmad-output/initiative-checkout/prd-checkout-2026-07-02/prd.md, sections Capabilities and Constraints
- design — https://figma.com/design/ab12cd/checkout, frame Cart

## Notes

- Decision: codes are case-insensitive (user's decision, 2026-08-12).
- Unknown: whether the discount engine can validate a code within R4; entry 04 waits on it.
```
