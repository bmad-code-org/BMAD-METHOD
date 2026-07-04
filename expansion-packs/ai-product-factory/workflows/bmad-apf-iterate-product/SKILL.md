---
name: bmad-apf-iterate-product
description: Post-launch product iteration based on analytics, user feedback, and growth experiments.
---

# Iterate Product — AI Product Factory

## On Activation

1. Load deployed product URLs, analytics setup, growth metrics.
2. Load existing artifacts from all phases.

## Step 1: Data Collection

Invoke `bmad-apf-growth-analytics`:
- Key metrics dashboard
- Cohort analysis
- Funnel drop-offs
- Feature usage heatmap

## Step 2: Feedback Synthesis

Collect and categorize:
- User feedback / support tickets
- App store reviews
- Social mentions
- Feature requests

Output: `{apf_artifacts}/growth/feedback-synthesis.md`

## Step 3: Prioritize Iterations

Invoke `bmad-apf-feature-prioritizer` with growth lens:
- Impact on retention
- Impact on conversion
- Impact on revenue
- Effort estimate

Output: `{apf_artifacts}/growth/iteration-backlog.md`

## Step 4: Experiment Design

Invoke `bmad-apf-experiment`:
- Hypothesis for top 3 items
- A/B test design
- Success criteria
- Timeline

## Step 5: Execute Iteration

Route to appropriate agents:
- Feature changes → `bmad-apf-build-mvp` (incremental)
- Pricing changes → `bmad-apf-growth-pricing`
- Retention flows → `bmad-apf-retention`
- Funnel optimization → `bmad-apf-growth-funnel`

## Step 6: Measure & Learn

After iteration ships:
- Compare metrics to baseline
- Document learnings
- Update product roadmap

Output: `{apf_artifacts}/growth/iteration-report.md`

Run `{workflow.on_complete}`.
