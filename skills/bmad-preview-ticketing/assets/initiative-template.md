---
tracker_id: ""   # with remote (the url), written at publish on a tracker; cut on the repo store
key: ""   # tracker project or team for everything under this, when it differs from the store's
type: initiative
title: "[The outcome this container exists to reach]"
parent: none
covers: [ids from the spec at this level, or from Requirements below when the source has none]
after: []   # epics this whole container waits on; the order of epics is in the initiative's tickets.toml
assignee: ""   # status is added when work starts (in-progress | done | dropped)
risk: [low|medium|high — the highest expected among its children]
estimate: ""   # t-shirt, when estimation is on
estimate_basis: ""   # envelope | spec | entries | stories
---

# [Title]

## Description

[What is true when this is done and why it matters. With a spec, one paragraph pointing at it; without one, the intent in full.]

## Outcome

[One sentence: for whom, what changes, and the signal that shows it worked — the spec's, named not restated, when there is one.]

## Requirements

[The requirement source at this altitude: the source's lines as stable ids for children to cite, each mapping to a source id in covers. A referenced numbered source replaces it; a separate spec only when the source outgrows this section.]

## Done when

[Three to six checks a person can run without opening a child — the measures, limits, and behaviors from the source. Each fails today. Closing every child is not one.]

## Boundaries

[Which boundary this container follows — team, service, UI, capability — and what it is not. Point at the spec's non-goals when there is one. Then one line per unit the work touches that gets no epic, and the tracer path across epics in one sentence.]

- Touch point: [unit] — [what is consumed or configured there]; owner: epic-[slug]

## References

[`type — location, section`. The spec at this level when one exists (its references are followed from there); otherwise what this was split from.]

- spec — [path from {project-root}, or url for a remote source; section Capabilities]
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

<!-- An initiative is the business outcome its epics serve, tied to a company goal, usually spanning quarters and more than one boundary. For a solo developer or small team with no larger goal above it, a whole product is a fine initiative.
Example, not part of the ticket: match its level of detail. This one keeps a separate spec because its source outgrew the section: Description points at it, covers cites its ids, Requirements is cut, Outcome names its signal. Done when reads as business outcomes a product owner checks at the end, not deliverables. The epic order, with what each needs from the one before, is in `tickets.toml` beside this file. -->

```markdown
---
type: initiative
title: "Checkout that shoppers finish"
parent: none
covers: [C1, C2, C3, C4, C5, C6, P1, P2, T1]
assignee: ""
risk: high
---

# Checkout that shoppers finish

## Description

Shoppers go from cart to paid order in one pass, with the price they saw, on any supported device or as a guest. The spec owns the capabilities, constraints, and non-goals; this initiative delivers them for the fall release.

## Outcome

The Q4 revenue target depends on lifting cart-to-payment completion from 55% to 70%; this initiative owns that number, the spec's success signal, measured over a full quarter.

## Done when

1. Cart-to-payment completion holds at the spec's target for one full quarter after release.
2. Every capability in C1–C6, P1–P2, and T1 is live for all shoppers, not behind a flag.
3. Refund and chargeback rates are no worse than the quarter before release.
4. No P0 or P1 checkout bug open for more than a day during the first month.

## Boundaries

The web store's checkout flow, the payment-provider integration, and guest checkout across web and mobile. Not the order-management backend beyond the order it creates, not loyalty, not the catalog; see the spec's non-goals. Tracer path: one catalog item priced, carted, taxed, and paid by a signed-in shopper.

- Touch point: notification service — a new order-confirmation template, no code change; owner: epic-tax-and-payment

## References

- spec — _bmad-output/initiative-checkout/spec-checkout/spec-checkout.md
- constraint — the same spec, section Constraints, PCI scope and response time
- prd — _bmad-output/initiative-checkout/prd-checkout-2026-07-02/prd.md, for history only

## Notes

- Parked: gift cards (C7); not in the fall release, user's call 2026-08-12.
- Decision: one payment provider for v1, replacing the current one (user's decision, 2026-08-12).
- Unknown: whether the tax service can meet the response-time constraint at peak; epic Tax and payment owns the answer.
```
