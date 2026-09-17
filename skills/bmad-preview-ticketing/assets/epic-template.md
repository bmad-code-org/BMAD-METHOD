---
id: ""   # set at publish
remote: ""   # the store url, for a tracker
type: epic
title: "[The outcome this container exists to reach]"
parent: [folder name of the initiative]
covers: [parent requirement ids this epic owns; keep these when adding an epic-local spec]
blocked_by: []
assignee: ""
status: draft
risk: [low|medium|high — the highest expected among its children]
estimate: ""   # t-shirt, when estimation is on
estimate_basis: ""   # envelope | spec | drafts | stories
---

<!-- At initiative slicing, the envelope: frontmatter, Description, Outcome, Done when, Boundaries, References, and known Notes. Requirements and Breakdown are completed at this epic's inception. -->

# [Title]

## Description

[What is true when this is done and why it matters. With a spec, one paragraph pointing at it; without one, the intent in full.]

## Outcome

[One sentence: for whom, what changes, and the signal that shows it worked — the spec's, named not restated, when there is one.]

## Requirements

[The requirement source at this altitude: the source's lines as stable ids for children to cite, each mapping to a parent id in covers. Reuse the parent's ids when the lines are the parent's; when the epic splits or adds one, mint `E<n> (R<m>)` so the map is on the line. An epic with no parent ids, such as the platform baseline, leaves covers empty and cites the source section on each line instead. A referenced numbered source replaces it; a separate spec only when the source outgrows this section.]

## Done when

[Three to six checks a person can run without opening a child — the measures, limits, and behaviors from the source. Each fails today. Closing every child is not one.]

## Breakdown

[At inception: every agreed entry in build order, one line each, exactly `- nn type — title; blocked_by: nn, nn; covers: ids`. tickets.py reads these lines; a table or any other shape is invisible to it. Anything more about an entry goes in Notes or waits for its file. An entry becomes a file with the same nn when pulled; its line stays. Status lives on the files, never here. Cut at initiative slicing.]

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
- Unknown: [what will likely need a spike, known now so it is not found late]
- Parked: [a requirement id not placed on any child, and why, with the user's knowledge]
- Decision: [a choice the user made, dated, so it is not asked again — a declined suggestion belongs here too]
- Blocked by [id] because: [the one-line reason for each entry in blocked_by]

<!-- Example, not part of the ticket: an incepted epic with no spec of its own. The parent assigned R1–R4 to this epic from an unnumbered PRD; Requirements records those lines using the same ids. Done when holds deliverable checks. Breakdown holds the agreed entries; the files exist only for those pulled. Notes holds decisions and unknowns. -->

```markdown
---
id: ""
remote: ""
type: epic
title: "Shoppers manage their cart"
parent: initiative-checkout
covers: [R1, R2, R3, R4]
blocked_by: []
assignee: ""
status: draft
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

## Breakdown

- 01 story — Cart service scaffold; covers: R1
- 02 story — Cart UI shell; blocked_by: 01; covers: R1
- 03 spike — Can the discount engine validate within R4?; blocked_by: 01; covers: R4
- 04 story — Apply and refuse discount codes; blocked_by: 02, 03; covers: R2, R3
- 05 story — Total shown equals total charged, end to end; blocked_by: 04; covers: R3

## Boundaries

The cart UI. Not the pricing service (epic Pricing rules), not tax (epic Tax and payment).

## References

- prd — _bmad-output/initiative-checkout/prd-checkout-2026-07-02/prd.md, sections Capabilities and Constraints
- design — https://figma.com/design/ab12cd/checkout, frame Cart

## Notes

- Decision: codes are case-insensitive (user's decision, 2026-08-12).
- Unknown: whether the discount engine can validate a code within R4; a spike if not.
```
