---
title: "How to Create a Product Brief"
description: How to create a product brief using the BMad Method
---

Use the `product-brief` workflow to define product vision and strategy through an interactive process.

## When to Use This

- Starting new product or major feature initiative
- Aligning stakeholders before detailed planning
- Transitioning from exploration to strategy
- Need executive-level product documentation

:::note[Prerequisites]
- BMad Method installed
- Analyst agent available
- Optional: Research documents from previous workflows
:::

## Steps

### 1. Load the Analyst Agent

Start a fresh chat and load the Analyst agent.

### 2. Run the Product Brief Workflow

```
*product-brief
```

### 3. Answer the Interactive Questions

The workflow guides you through strategic product vision definition:

- What problem are you solving?
- Who are your target users?
- What makes this solution different?
- What's the MVP scope?

### 4. Review and Refine

The agent will draft sections and let you refine them interactively.

## What You Get

The `product-brief.md` document includes:

- **Executive summary** — High-level overview
- **Problem statement** — With evidence
- **Proposed solution** — And differentiators
- **Target users** — Segmented
- **MVP scope** — Ruthlessly defined
- **Financial impact** — And ROI
- **Strategic alignment** — With business goals
- **Risks and open questions** — Documented upfront

## Integration with Other Workflows

The product brief feeds directly into the PRD workflow:

| Analysis Output | Planning Input |
|-----------------|----------------|
| product-brief.md | **prd** workflow |
| market-research.md | **prd** context |
| technical-research.md | **architecture** (Phase 3) |

Planning workflows automatically load the product brief if it exists.

## Common Patterns

**Greenfield Software (Full Analysis):**

```
1. brainstorm-project - explore approaches
2. research (market/technical/domain) - validate viability
3. product-brief - capture strategic vision
4. → Phase 2: prd
```

**Skip Analysis (Clear Requirements):**

```
→ Phase 2: prd or tech-spec directly
```

## Tips

- **Be specific about the problem** — Vague problems lead to vague solutions
- **Ruthlessly prioritize MVP scope** — Less is more
- **Document assumptions and risks** — Surface unknowns early
- **Use research findings as evidence** — Back up claims with data
- **Recommended for greenfield projects** — Sets strategic foundation
