# Task 02: Eval Bare Skeleton

## Prerequisite

Task 01 test cycle is clean (all gaps and plumbing issues resolved).

## Intent

Evaluate the bare skeleton's efficiency against the existing QD workflow as baseline.

## Method

1. Run the same task through both QD (old) and QD2 (skeleton) if possible, or compare against a recent QD session log.
2. Measure:
   - Total human turns (the north star metric)
   - Total agent turns / API round-trips
   - Approximate token usage (context window utilization)
   - Time to completion
   - Quality of output (subjective: did it produce what was asked for?)
3. Note where QD2 is better, where it's worse, where it's equivalent.

## Output

An eval report: `_experiment/results/skeleton-eval-report.md` with metrics comparison and recommendations for which steps need tightening first (prioritized by impact on the north star metric).
