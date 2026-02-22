# Task 12: Tighten Step 4 — Review

## Prerequisite

Step 3 test/eval cycle complete. Findings indicate step 4 needs tightening.

## Intent

Add specificity to step-04-review.md. This is the highest-risk step. Reference `_experiment/planning/redesign-plan.md` Step 4 section.

## Likely areas

- Context isolation for review subagents (does it actually strip context?)
- Layer 1 vs Layer 2 separation
- Classification cascade (intent > spec > patch)
- INTENT_GAP two-question test
- Spec loop mechanics (frozen sections, change log ratchet, positive preservation)
- Iteration cap enforcement

## Constraint

This step has the most detailed plan material. Resist the urge to dump it all in. Add only what testing proves is needed.
