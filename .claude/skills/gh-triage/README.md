# gh-triage

Fetches all GitHub issues via gh CLI and uses AI agents to deeply analyze, cluster, and prioritize issues.

## Usage

Run from within any BMad Method repository to triage issues.

## What It Does

1. Fetches all open issues via `gh issue list`
2. Splits issues into batches
3. Launches parallel agents to analyze each batch
4. Generates comprehensive triage report to `_bmad-output/triage-reports/`
