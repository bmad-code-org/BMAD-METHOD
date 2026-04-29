# Reference example — tech-debt epic

This file shows a complete tech-debt epic with mixed `task` and `bug` story types and **no PRD** behind it. Use it as a shape primer when an initiative has no functional requirements — only a list of debt items or target areas. Do not copy the content.

## File: `04-billing-cleanup/epic.md`

```markdown
---
title: "Billing Cleanup"
epic: "04"
status: draft
depends_on: ["01"]
metadata:
  initiative: tech-debt-q3
---

# Billing Cleanup

## Goal

Reduce ongoing maintenance cost in the billing module by removing two dead
code paths, fixing the long-standing rounding bug in invoice totals, and
extracting the price calculator into its own service for testability.

## Shared Context

- All work is contained in `apps/api/src/billing/` and its test directory.
- The price calculator extraction is the most invasive change; do it last so
  earlier stories don't have to be re-tested against the new boundary.
- No customer-visible behaviour changes; existing snapshot tests must pass
  unchanged after every story (except the rounding-bug story, which updates
  one snapshot deliberately).

## Story Sequence

01 and 02 remove the dead paths; they are independent and can run in parallel.
03 fixes the rounding bug and updates the affected snapshot.
04 extracts the calculator and depends on all three earlier stories so the new
boundary is drawn around the cleaned-up code.

## References

- `{planning_artifacts}/initiative-context.md` (debt rationale)
- `{planning_artifacts}/architecture.md#billing` (target end-state)
```

## File: `04-billing-cleanup/01-remove-legacy-coupon-path.md`

```markdown
---
title: "Remove Legacy Coupon Code Path"
type: task
status: draft
epic: 04-billing-cleanup
depends_on: []
---

# Remove Legacy Coupon Code Path

## Acceptance Criteria

- **AC1** — Given the codebase, When `applyLegacyCoupon` is grepped for,
  Then there are zero references and the function file is deleted.
- **AC2** — Given the test suite, When it runs after the deletion,
  Then all tests pass with no skipped or pending tests.

## Technical Notes

- File to delete: `apps/api/src/billing/legacy-coupons.ts`.
- Two callers in `checkout.ts` already short-circuit; remove their dead branches.

## Coverage

- AC1 → debt item D1 (legacy coupon path, see initiative-context.md)
- AC2 → no regressions
```

## File: `04-billing-cleanup/03-fix-invoice-rounding-bug.md`

```markdown
---
title: "Fix Invoice Total Rounding Bug"
type: bug
status: draft
epic: 04-billing-cleanup
depends_on: []
---

# Fix Invoice Total Rounding Bug

As a finance operator,
I want invoice totals to match the sum of their line items to the cent,
So that monthly reconciliations stop flagging false discrepancies.

## Acceptance Criteria

- **AC1** — Given an invoice with three line items totalling $100.005,
  When the invoice is finalized,
  Then the stored total is $100.01 (banker's rounding), matching the line
  items summed in the same order.
- **AC2** — Given the existing snapshot for the rounding regression case,
  When the test runs,
  Then it produces the corrected total and the snapshot is updated.

## Technical Notes

- Switch `Math.round` for the `roundHalfEven` helper at
  `apps/api/src/util/decimal.ts` (already used elsewhere).
- Update one snapshot: `apps/api/test/__snapshots__/invoice-totals.snap`.

## Coverage

- AC1 → bug B1 (rounding discrepancy in monthly reconciliations)
- AC2 → no other regressions
```
