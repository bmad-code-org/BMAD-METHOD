---
title: "Checkout Tech Design"
template: arch-epic
status: final
---

# Checkout Tech Design

## Architecture Decisions

### AD-1 — Server-side pricing authority

All totals and promo discounts are computed by `POST /api/cart/price` before payment intent creation.
