---
title: "How to Conduct Research"
description: How to conduct market, technical, and competitive research using BMad Method
---

Use the `research` workflow to perform comprehensive multi-type research for validating ideas, understanding markets, and making informed decisions.

## When to Use This

- Need market viability validation
- Choosing frameworks or platforms
- Understanding competitive landscape
- Need user understanding
- Understanding domain or industry
- Need deeper AI-assisted research

:::note[Prerequisites]
- BMad Method installed
- Analyst agent available
:::

## Steps

### 1. Load the Analyst Agent

Start a fresh chat and load the Analyst agent.

### 2. Run the Research Workflow

```
*research
```

### 3. Choose Research Type

Select the type of research you need:

| Type | Purpose | Use When |
|------|---------|----------|
| **market** | TAM/SAM/SOM, competitive analysis | Need market viability validation |
| **technical** | Technology evaluation, ADRs | Choosing frameworks/platforms |
| **competitive** | Deep competitor analysis | Understanding competitive landscape |
| **user** | Customer insights, personas, JTBD | Need user understanding |
| **domain** | Industry deep dives, trends | Understanding domain/industry |
| **deep_prompt** | Generate AI research prompts | Need deeper AI-assisted research |

### 4. Provide Context

Give the agent details about what you're researching:

- "SaaS project management tool"
- "React vs Vue for our dashboard"
- "Fintech compliance requirements"

### 5. Set Research Depth

Choose your depth level:

- **Quick** — Fast overview
- **Standard** — Balanced depth
- **Comprehensive** — Deep analysis

## What You Get

Research output varies by type:

**Market Research:**
- TAM/SAM/SOM analysis
- Top competitors
- Positioning recommendation

**Technical Research:**
- Comparison matrix
- Trade-off analysis
- Recommendations with rationale

## Key Features

- Real-time web research
- Multiple analytical frameworks (Porter's Five Forces, SWOT, Technology Adoption Lifecycle)
- Platform-specific optimization for deep_prompt type
- Configurable research depth

## Tips

- **Use market research early** — Validates new product ideas
- **Technical research helps architecture** — Inform ADRs with data
- **Competitive research informs positioning** — Differentiate your product
- **Domain research for specialized industries** — Fintech, healthcare, etc.

## Next Steps

After research:

1. **Product Brief** — Capture strategic vision informed by research
2. **PRD** — Use findings as context for requirements
3. **Architecture** — Use technical research in ADRs
