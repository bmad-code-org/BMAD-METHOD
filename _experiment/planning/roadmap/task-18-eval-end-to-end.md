# Task 18: End-to-End Evaluation

## Prerequisite

All step-level test/eval cycles complete.

## Intent

Run the fully tightened QD2 on a real task end-to-end. Compare holistically against QD + QS combined baseline.

## Method

1. Pick a representative task (not trivial, not huge — the sweet spot QD2 is designed for).
2. Run QD2 start to finish.
3. If possible, run the same task through QS → QD for comparison.

## Metrics

- Total human turns (north star)
- Total time
- Total tokens
- Output quality (code correctness, spec quality, review thoroughness)
- Number of unnecessary human interactions
- Would you ship this?

## Output

Final eval report: `_experiment/results/end-to-end-eval.md` with go/no-go recommendation for promoting QD2 to replace QS+QD.
