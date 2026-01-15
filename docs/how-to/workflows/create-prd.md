---
title: "How to Create a PRD"
description: How to create a Product Requirements Document using the BMad Method
---

Use the `prd` workflow to create a strategic Product Requirements Document with Functional Requirements (FRs) and Non-Functional Requirements (NFRs).

## When to Use This

- Medium to large feature sets
- Multi-screen user experiences
- Complex business logic
- Multiple system integrations
- Phased delivery required

:::note[Prerequisites]
- BMad Method installed
- PM agent available
- Optional: Product brief from Phase 1
:::

## Steps

### 1. Load the PM Agent

Start a fresh chat and load the PM agent.

### 2. Run the PRD Workflow

```
*create-prd
```

### 3. Provide Context

The workflow will:
- Load any existing product brief
- Ask about your project scope
- Gather requirements through conversation

### 4. Define Requirements

Work with the agent to define:
- Functional Requirements (FRs) — What the system should do
- Non-Functional Requirements (NFRs) — How well it should do it

### 5. Review the PRD

The agent produces a comprehensive PRD scaled to your project.

## What You Get

A `PRD.md` document containing:

- Executive summary
- Problem statement
- User personas
- Functional requirements (FRs)
- Non-functional requirements (NFRs)
- Success metrics
- Risks and assumptions

## Scale-Adaptive Structure

The PRD adapts to your project complexity:

| Scale | Pages | Focus |
|-------|-------|-------|
| **Light** | 10-15 | Focused FRs/NFRs, simplified analysis |
| **Standard** | 20-30 | Comprehensive FRs/NFRs, thorough analysis |
| **Comprehensive** | 30-50+ | Extensive FRs/NFRs, multi-phase, stakeholder analysis |

## Example

E-commerce checkout → PRD with:
- 15 FRs (user account, cart management, payment flow)
- 8 NFRs (performance, security, scalability)

## Tips

- **Do Product Brief first** — Run product-brief from Phase 1 for better results
- **Focus on "What" not "How"** — Planning defines what to build and why. Leave how (technical design) to Phase 3
- **Document-Project first for Brownfield** — Always run `document-project` before planning brownfield projects. AI agents need existing codebase context

## Next Steps

After PRD:

1. **Create UX Design** (optional) — If UX is critical
2. **Create Architecture** — Technical design
3. **Create Epics and Stories** — After architecture
