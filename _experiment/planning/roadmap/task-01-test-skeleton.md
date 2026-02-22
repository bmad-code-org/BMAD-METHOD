# Task 01: Test Bare Skeleton

## Intent

Run QD2 as-is (bare one-liner prompts + BMM plumbing) on a real small task. Document what works and what breaks.

## Method

1. Pick a small real task in the BMAD-METHOD repo (or a test project).
2. Invoke QD2 via the QD2 trigger.
3. Let it run through all 5 steps without intervention (except at the two checkpoints).
4. Record observations per step:
   - Did it follow the plumbing? (config loading, step transitions, NEXT directives)
   - Did it produce reasonable output from training alone?
   - Where did it go off the rails or get stuck?
   - What questions did it ask that it shouldn't have?
   - What did it fail to do that it should have?

## Output

A findings document: `_experiment/results/skeleton-test-findings.md` with per-step observations classified as:
- **Works** — training handled it fine, no tightening needed
- **Gap** — specific behavior missing or wrong, needs prompt tightening
- **Plumbing** — structural issue with the BMM infrastructure itself
