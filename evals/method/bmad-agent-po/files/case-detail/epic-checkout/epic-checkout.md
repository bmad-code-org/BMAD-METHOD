---
id: 1
type: epic
title: "Checkout Flow"
parent: none
sources:
  - files/case-detail/epic-checkout/prd-epic-checkout/prd-epic-checkout.md
companions:
  - files/case-detail/epic-checkout/prd-epic-checkout/prd-epic-checkout.md
  - files/case-detail/epic-checkout/ux-epic-checkout/DESIGN.md
  - files/case-detail/epic-checkout/ux-epic-checkout/EXPERIENCE.md
  - files/case-detail/epic-checkout/ux-epic-checkout/mockups/cart.html
  - files/case-detail/epic-checkout/arch-epic-checkout/arch-epic-checkout.md
after: []
risk: medium
refined: true
---

# Checkout Flow

## Description

Shoppers review cart items, apply promo codes, and complete payment.

## Outcome

Shoppers complete online purchases cleanly with measurable checkout conversion.

## Requirements

- R1 (E01-FR-01, E01-FR-02): Shoppers add, update quantity, and remove cart items with live total recalculation.
- R2 (E01-FR-03): Shoppers apply valid discount codes or see clear refusal reasons for expired or ineligible codes.
- R3 (Instrumentation): Emit `checkout_completed` and `promo_rejected` events with `cart_total` and `duration_ms` to measure checkout conversion.

## Constraints

- C1 (INV-01): Price calculation runs server-side only; client totals are display hints.

## Done when

- Checkout conversion reaches Passable 65% / Good 75% on production telemetry.
- All cart and promo flows deploy to production behind live payment validation.

## Boundaries

- Out of scope: subscription renewals and multi-currency conversion.

## References

- prd — files/case-detail/epic-checkout/prd-epic-checkout/prd-epic-checkout.md, sections Requirements, Instrumentation
- design — files/case-detail/epic-checkout/ux-epic-checkout/DESIGN.md, files/case-detail/epic-checkout/ux-epic-checkout/EXPERIENCE.md#cart-flow, files/case-detail/epic-checkout/ux-epic-checkout/mockups/cart.html
- architecture — files/case-detail/epic-checkout/arch-epic-checkout/arch-epic-checkout.md (AD-1)
