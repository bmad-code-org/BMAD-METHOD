# Bug-Fix Root Cause Analysis

Analyze a bug-fix commit or PR and produce a structured Root Cause Analysis report.

## Principles

- **Direct attribution.** This report names the individual who introduced the defect. Industry convention advocates blameless postmortems. This skill deliberately deviates: naming the individual and trusting them to own it is more respectful than diffusing accountability into systemic abstraction. Direct, factual, not accusatory. If authorship can't be determined confidently, say so.
- **Pyramid communication.** The executive summary must convey the full picture. A reader who stops after the first paragraph gets the gist. Everything else is supporting evidence.

## Preflight

Verify `gh auth status` and that you're in a git repository. Stop with a clear message if either fails.

## Execution

1. **Identify the fix.** Accept whatever the user provides — commit SHA, PR, issue, description. Resolve to the specific fix commit/PR using `gh` and `git`. If ambiguous, ask. Confirm the change is actually a bug fix before proceeding.
2. **Gather evidence.** Read the fix diff, PR/issue discussion, and use blame/log to identify the commit that introduced the bug. Collect timeline data.
3. **Analyze.** Apply 5 Whys. Classify the root cause. Identify contributing factors.
4. **Evaluate guardrails.** Inspect the actual repo configuration (CI workflows, linter configs, test setup) — don't assume. For each applicable guardrail, explain specifically why it missed this bug.
5. **Write the report** to `_bmad-output/rca-reports/rca-{YYYY-MM-DD}-{slug}.md`. Present the executive summary in chat.

## Report Structure

```markdown
# Root Cause Analysis: {Bug Title}

**Date:** {today}
**Fix:** {PR link or commit SHA}
**Severity:** {Critical | High | Medium | Low}
**Root Cause Category:** {Requirements | Design | Code Logic | Test Gap | Process | Environment/Config}

## Executive Summary

{One paragraph. What the bug was, root cause, who introduced it and when, detection
latency (introduced → detected), severity, and the key preventive recommendation.}

## What Was the Problem?

## When Did It Happen?

| Event | Date | Reference |
|-------|------|-----------|
| Introduced | | |
| Detected | | |
| Fixed | | |
| **Detection Latency** | **{introduced → detected}** | |

## Who Caused It?

{Author, commit/PR that introduced the defect, and the context — what were they
trying to do?}

## How Did It Happen?

## Why Did It Happen?

{5 Whys analysis. Root cause category. Contributing factors.}

## Failed Guardrails Analysis

| Guardrail | In Place? | Why It Failed |
|-----------|-----------|---------------|
| | | |

**Most Critical Failure:** {Which one mattered most and why.}

## Resolution

## Corrective & Preventive Actions

| # | Action | Type | Priority |
|---|--------|------|----------|
| | | {Prevent/Detect/Mitigate} | |
```
