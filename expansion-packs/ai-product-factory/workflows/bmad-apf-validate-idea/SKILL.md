---
name: bmad-apf-validate-idea
description: Validate a startup idea with structured analysis before any build investment. Use when the user has an idea and wants to know if it's worth pursuing.
---

# Validate Startup Idea

Structured idea validation workflow producing a go/no-go recommendation with evidence.

## On Activation

1. Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`
2. Load config. Resolve `{user_name}`, `{communication_language}`, `{apf_artifacts}`.
3. Greet and explain the validation process.

## Step 1: Idea Capture

Collect:
- **Problem** — What pain exists? Who feels it?
- **Solution** — What does the product do?
- **Target user** — Who pays or uses it?
- **Why now** — What changed to make this viable?
- **Founder edge** — Why you?

Write to `{apf_artifacts}/founder/idea-brief.md`.

## Step 2: Assumption Mapping

Identify top 5 riskiest assumptions. For each:
- State the assumption
- Rate confidence (1-5)
- Define how to test cheaply

Write to `{apf_artifacts}/founder/assumption-map.md`.

## Step 3: Problem-Solution Fit

Invoke `bmad-apf-idea-validator` agent logic:
- Score problem severity (1-10)
- Score solution uniqueness (1-10)
- Score market timing (1-10)
- Identify fatal flaws

## Step 4: Quick Market Scan

Spawn research subagent:
- 3-5 comparable products
- Market size indicators
- Trend signals

Write to `{apf_artifacts}/founder/quick-market-scan.md`.

## Step 5: SWOT

Generate SWOT analysis from gathered evidence.
Write to `{apf_artifacts}/founder/swot.md`.

## Step 6: Lean Canvas Draft

Generate Lean Canvas from all inputs.
Write to `{apf_artifacts}/founder/lean-canvas.md`.

## Step 7: Verdict

Produce **Idea Validation Report** at `{apf_artifacts}/founder/idea-validation-report.md`:

```yaml
---
status: go | conditional-go | no-go
confidence: high | medium | low
date: {date}
---
```

Include:
- Executive summary (3 sentences)
- Scores table
- Top 3 risks
- Recommended next steps
- If conditional-go: conditions to meet

## Handoff

- **GO** → `bmad-apf-launch-startup` or `bmad-apf-market-research`
- **CONDITIONAL GO** → list conditions, offer to address them
- **NO-GO** → suggest pivots or alternative angles

Run `{workflow.on_complete}`.
