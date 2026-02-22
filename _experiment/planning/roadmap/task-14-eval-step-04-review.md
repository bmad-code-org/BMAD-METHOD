# Task 14: Eval Step 4 — Review Efficiency

## Prerequisite

Task 13 test cycle clean.

## Intent

Evaluate review quality and efficiency.

## Metrics

- Finding quality (real issues vs noise)
- Classification accuracy (spec vs patch vs defer — are they right?)
- Spec loop iterations used vs cap
- Tokens consumed in review (especially spec loop cost)
- Compare review quality against QD step-05 adversarial review baseline
- False positive rate (reject-class findings as % of total)

## Output

Eval report: `_experiment/results/step-04-eval.md`.
