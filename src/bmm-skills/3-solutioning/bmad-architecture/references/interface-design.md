# Interface Design for Refinement

Use this reference only when interface shape is a material architecture decision.

## Produce alternatives

Compare at least three realistic shapes:

1. Minimal — the smallest stable behavior callers need.
2. Flexible — justified variation without leaking implementation detail.
3. Caller-optimized — shaped around the dominant caller workflow.

Add a ports-and-adapters option only when at least two real implementations or a true external dependency justify the seam.

For each option show:

- interface shape and brief caller usage
- behavior, state, and dependencies hidden behind it
- ownership and dependency direction
- adapter strategy, if any
- observable test surface
- migration and rollback cost
- compatibility or conflict with existing `AD` IDs

## Decide

Rank the options by divergence prevented, locality of change and knowledge, interface leverage, migration risk, and altitude fit. Recommend one option or a precise hybrid; do not leave an unranked menu.

The recommendation becomes architecture only after it is accepted or ratified by existing reality and recorded in the memlog. The resulting spine `AD` states the enforceable rule; detailed examples and rejected alternatives remain in the companion or memlog.
