# Addendum — Forkbird Kitchen

## Options considered (and not taken)

### B2B / corporate catering

Considered as a parallel revenue stream from day one. Rejected for MVP. Different operational rhythm (bulk orders, fixed delivery windows, invoiced billing), different customer (procurement, not eaters), different unit economics. Splitting attention at launch risked degrading both. Revisit if consumer foundation is established by month 12.

### Subscription / meal plan

Considered as a recurring-revenue layer. Rejected for MVP. Operationally expensive at our planned scale: requires demand forecasting per subscriber, kitchen scheduling locked further out, and packaging/refrigerated handling we are not yet equipped for. Reasonable to revisit once kitchen utilization stabilizes.

### Retail / grocery channel

Considered (refrigerated meals in Whole Foods, Sprouts). Rejected for MVP. Different product (cold meals, longer shelf life, different texture profile), different go-to-market (broker relationships, slotting fees, category management). Parked for year 2 — would require a separate product line, not a channel extension.

### Lower-priced everyday tier

Considered. Rejected for now. The brand position is chef-driven; introducing a value tier alongside risks the premium signal in marketplace search ranking and review patterns. Explored alternative of separate brand for value tier; deferred.

## Personas (extended)

**The plant-based weekday professional.** Lives in a dense urban neighborhood, orders 4–6 times a month, splits between own-cooking and delivery. Sources of dissatisfaction with current options: chain plant-based menus feel formulaic, fine-dining plant-based is too expensive for weeknight, marketplace search surfaces too many low-quality options.

**The dietary-flex household member.** One person in a household is plant-based by preference; the other(s) are not. Ordering pattern is "tonight one of us wants Forkbird, the other wants something else." We benefit from being a dependable single-cuisine option that doesn't require negotiating across diets.

## Sizing notes

- Total addressable: ~6.2M urban professionals across 5 metros eating plant-based 3+ times/week (based on 2024 Plant Based Foods Association data, urban segmentation).
- Serviceable addressable (within delivery radius of planned kitchens at launch): ~840K.
- Realistic Y1 capture (per metro forecast): 0.4% of SAM = 3,360 active customers across all metros.

## Sourcing standard — exact wording

"For each dish on the menu, we publish the source of every ingredient that represents at least 5% of cost. We commit that at least 60% of total ingredient weight is sourced within 200 miles of the kitchen preparing that dish. Both numbers are auditable; we publish them per-dish in the app. If we cannot meet the 60% local threshold for a dish, the dish does not ship."

## Technical constraints

- Marketplace integration (DoorDash, UberEats, Grubhub) requires their menu management API. We are using a third-party middleware (Olo) to avoid maintaining three separate integrations.
- Ingredient transparency display requires structured data per dish. We need an ingredient-master database; current option is to extend our recipe-management software vendor.
