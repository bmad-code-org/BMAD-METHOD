---
title: "Checkout PRD"
template: prd-epic
status: final
---

# Checkout PRD

## Requirements

- **E01-FR-01**: Shopper can add and remove items in the cart.
- **E01-FR-02**: Shopper can change item quantities and see updated line and cart totals.
- **E01-FR-03**: Shopper can apply a discount code or see why an expired/invalid code was rejected.

## Instrumentation

- Emit `checkout_completed` and `promo_rejected` events with `cart_total` and `duration_ms`.
