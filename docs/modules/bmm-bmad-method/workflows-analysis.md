# BMM Analysis Workflows (Phase 1)

## Overview

Phase 1 (Analysis) workflows are **optional** exploration and discovery tools that help validate ideas, understand markets, and generate strategic context before planning begins.

**Key principle:** Analysis workflows help you think strategically before committing to implementation. Skip them if your requirements are already clear.

**When to use:** Starting new projects, exploring opportunities, validating market fit, generating ideas, understanding problem spaces.

**When to skip:** Continuing existing projects with clear requirements, well-defined features with known solutions, strict constraints where discovery is complete.

---

## Phase 1 Analysis Workflow Overview

Phase 1 Analysis consists of three categories of optional workflows:

### Discovery & Ideation (Optional)

- **brainstorm-project** - Multi-track solution exploration for software projects

### Research & Validation (Optional)

- **research** - Market, technical, competitive, user, domain, and AI research
- **domain-research** - Industry-specific deep dive research

### Strategic Capture (Recommended for Greenfield)

- **product-brief** - Product vision and strategy definition

These workflows feed into Phase 2 (Planning) workflows, particularly the `prd` workflow.

---

## Quick Reference

| Workflow               | Agent   | Required    | Purpose                                                        | Output                       |
| ---------------------- | ------- | ----------- | -------------------------------------------------------------- | ---------------------------- |
| **brainstorm-project** | Analyst | No          | Explore solution approaches and architectures                  | Solution options + rationale |
| **research**           | Analyst | No          | Multi-type research (market/technical/competitive/user/domain) | Research reports             |
| **product-brief**      | Analyst | Recommended | Define product vision and strategy (interactive)               | Product Brief document       |

---

## Workflow Descriptions

### brainstorm-project

**Purpose:** Generate multiple solution approaches through parallel ideation tracks (architecture, UX, integration, value).

**Agent:** Analyst

**When to Use:**

- Very vague or seed kernal of an idea that needs exploration
- Consider alternatives or enhancements to an idea
- See your idea from different angles and viewpoints
- No idea what you want to build, but want to find some inspiration

---

### research

**Purpose:** Comprehensive multi-type research system consolidating market, technical, competitive, user, and domain analysis.

**Agent:** Analyst

**Research Types:**

| Type            | Purpose                                                | Use When                            |
| --------------- | ------------------------------------------------------ | ----------------------------------- |
| **market**      | TAM/SAM/SOM, competitive analysis                      | Need market viability validation    |
| **technical**   | Technology evaluation, ADRs                            | Choosing frameworks/platforms       |
| **competitive** | Deep competitor analysis                               | Understanding competitive landscape |
| **user**        | Customer insights, personas, JTBD                      | Need user understanding             |
| **domain**      | Industry deep dives, trends                            | Understanding domain/industry       |
| **deep_prompt** | Generate AI research prompts (ChatGPT, Claude, Gemini) | Need deeper AI-assisted research    |

**Key Features:**

- Real-time web research
- Multiple analytical frameworks (Porter's Five Forces, SWOT, Technology Adoption Lifecycle)
- Platform-specific optimization for deep_prompt type
- Configurable research depth (quick/standard/comprehensive)

**Example (market):** "SaaS project management tool" → TAM $50B, SAM $5B, SOM $50M, top competitors (Asana, Monday), positioning recommendation.

---

### product-brief

**Purpose:** Interactive product brief creation that guides strategic product vision definition.

**Agent:** Analyst

**When to Use:**

- Starting new product/major feature initiative
- Aligning stakeholders before detailed planning
- Transitioning from exploration to strategy
- Need executive-level product documentation

**Key Outputs:**

- Executive summary
- Problem statement with evidence
- Proposed solution and differentiators
- Target users (segmented)
- MVP scope (ruthlessly defined)
- Financial impact and ROI
- Strategic alignment
- Risks and open questions

**Integration:** Feeds directly into PRD workflow (Phase 2).

---

## Decision Guide

### Starting a Software Project

```
brainstorm-project (if unclear) → research (market/technical) → product-brief → Phase 2 (prd)
```

### Validating an Idea

```
research (market type) → product-brief → Phase 2
```

### Technical Decision Only

```
research (technical type) → Use findings in Phase 3 (architecture)
```

### Understanding Market

```
research (market/competitive type) → product-brief → Phase 2
```

### Domain Research for Complex Industries

```
domain-research → research (compliance/regulatory) → product-brief → Phase 2
```

---

## Integration with Phase 2 (Planning)

Analysis outputs feed directly into Planning:

| Analysis Output             | Planning Input             |
| --------------------------- | -------------------------- |
| product-brief.md            | **prd** workflow           |
| market-research.md          | **prd** context            |
| domain-research.md          | **prd** context            |
| technical-research.md       | **architecture** (Phase 3) |
| competitive-intelligence.md | **prd** positioning        |

Planning workflows automatically load these documents if they exist in the output folder.

## Common Patterns

### Greenfield Software (Full Analysis)

```
1. brainstorm-project - explore approaches
2. research (market/technical/domain) - validate viability
3. product-brief - capture strategic vision
4. → Phase 2: prd
```

### Skip Analysis (Clear Requirements)

```
→ Phase 2: prd or tech-spec directly
```

### Technical Research Only

```
1. research (technical) - evaluate technologies
2. → Phase 3: architecture (use findings in ADRs)
```

---

## Related Documentation

- [Phase 2: Planning Workflows](../../../../docs/modules/bmm-bmad-method/workflows-planning.md) - Next phase
- [Phase 3: Solutioning Workflows](../../../../docs/modules/bmm-bmad-method/workflows-solutioning.md)
- [Phase 4: Implementation Workflows](../../../../docs/modules/bmm-bmad-method/workflows-implementation.md)
- [Scale Adaptive System](./scale-adaptive-system.md) - Understanding project complexity
- [Agents Guide](../../../../docs/modules/bmm-bmad-method/agents-guide.md) - Complete agent reference
