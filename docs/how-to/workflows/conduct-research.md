---
title: "How to Conduct Research"
description: How to conduct market, technical, and competitive research using BMad Method
---


Use the `research` workflow to perform comprehensive multi-type research for validating ideas, understanding markets, and making informed decisions.

---

## When to Use This

- Need market viability validation
- Choosing frameworks or platforms
- Understanding competitive landscape
- Need user understanding
- Understanding domain or industry
- Need deeper AI-assisted research

---

## Prerequisites

- BMad Method installed
- Analyst agent available

---

## Steps

### 1. Load the Analyst Agent

Start a fresh chat and load the Analyst agent.

### 2. Run the Research Workflow

```
*research
```

### 3. Choose Research Type

Select the type of research you need:

| Type            | Purpose                                                | Use When                            |
| --------------- | ------------------------------------------------------ | ----------------------------------- |
| **market**      | TAM/SAM/SOM, competitive analysis                      | Need market viability validation    |
| **technical**   | Technology evaluation, ADRs                            | Choosing frameworks/platforms       |
| **competitive** | Deep competitor analysis                               | Understanding competitive landscape |
| **user**        | Customer insights, personas, JTBD                      | Need user understanding             |
| **domain**      | Industry deep dives, trends                            | Understanding domain/industry       |
| **deep_prompt** | Generate AI research prompts (ChatGPT, Claude, Gemini) | Need deeper AI-assisted research    |

### 4. Provide Context

Give the agent details about what you're researching:

- "SaaS project management tool"
- "React vs Vue for our dashboard"
- "Fintech compliance requirements"

### 5. Set Research Depth

Choose your depth level:

- **Quick** - Fast overview
- **Standard** - Balanced depth
- **Comprehensive** - Deep analysis

---

## What You Get

### Market Research Example

```
TAM: $50B
SAM: $5B
SOM: $50M

Top Competitors:
- Asana
- Monday
- etc.

Positioning Recommendation: ...
```

### Technical Research Example

Technology evaluation with:
- Comparison matrix
- Trade-off analysis
- Recommendations with rationale

---

## Key Features

- Real-time web research
- Multiple analytical frameworks (Porter's Five Forces, SWOT, Technology Adoption Lifecycle)
- Platform-specific optimization for deep_prompt type
- Configurable research depth

---

## Next Steps

After research:

1. **Product Brief** - Capture strategic vision informed by research
2. **PRD** - Use findings as context for requirements
3. **Architecture** - Use technical research in ADRs

---

## Tips

- Use market research early for new products
- Technical research helps with architecture decisions
- Competitive research informs positioning
- Domain research is valuable for specialized industries

---

## Related

- [Run Brainstorming Session](/docs/how-to/workflows/run-brainstorming-session.md) - Explore ideas before research
- [Create Product Brief](/docs/how-to/workflows/create-product-brief.md) - Capture strategic vision
- [Create PRD](/docs/how-to/workflows/create-prd.md) - Move to formal planning
