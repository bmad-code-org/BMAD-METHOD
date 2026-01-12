---
title: "How to Create a UX Design"
description: How to create UX specifications using the BMad Method
---

Use the `create-ux-design` workflow to create UX specifications for projects where user experience is a primary differentiator.

## When to Use This

- UX is primary competitive advantage
- Complex user workflows needing design thinking
- Innovative interaction patterns
- Design system creation
- Accessibility-critical experiences

## When to Skip This

- Simple CRUD interfaces
- Internal tools with standard patterns
- Changes to existing screens you're happy with
- Quick Flow projects

:::note[Prerequisites]
- BMad Method installed
- UX Designer agent available
- PRD completed
:::

## Steps

### 1. Load the UX Designer Agent

Start a fresh chat and load the UX Designer agent.

### 2. Run the UX Design Workflow

```
*create-ux-design
```

### 3. Provide Context

Point the agent to your PRD and describe:
- Key user journeys
- UX priorities
- Any existing design patterns

### 4. Collaborate on Design

The workflow uses a collaborative approach:

1. **Visual exploration** — Generate multiple options
2. **Informed decisions** — Evaluate with user needs
3. **Collaborative design** — Refine iteratively
4. **Living documentation** — Evolves with project

### 5. Review the UX Spec

The agent produces comprehensive UX documentation.

## What You Get

The `ux-spec.md` document includes:

- User journeys
- Wireframes and mockups
- Interaction specifications
- Design system (components, patterns, tokens)
- Epic breakdown (UX stories)

## Example

Dashboard redesign produces:
- Card-based layout with split-pane toggle
- 5 card components
- 12 color tokens
- Responsive grid
- 3 epics (Layout, Visualization, Accessibility)

## Integration

The UX spec feeds into:
- PRD updates
- Epic and story creation
- Architecture decisions (Phase 3)

## Tips

- **Focus on user problems first** — Solutions come second
- **Generate multiple options** — Don't settle on the first idea
- **Consider accessibility from the start** — Not an afterthought
- **Document component reusability** — Build a system, not just screens

## Next Steps

After UX design:

1. **Update PRD** — Incorporate UX findings
2. **Create Architecture** — Technical design informed by UX
3. **Create Epics and Stories** — Include UX-specific stories
