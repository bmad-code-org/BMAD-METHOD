---
title: "How to Add a Feature to an Existing Project"
description: How to add new features to an existing brownfield project
---

Use the `workflow-init` workflow to add new functionality to your brownfield codebase while respecting existing patterns and architecture.

## When to Use This

- Adding a new feature to an existing codebase
- Major enhancements that need proper planning
- Features that touch multiple parts of the system

:::note[Prerequisites]
- BMad Method installed
- Existing project documentation (run `document-project` first if needed)
- Clear understanding of what you want to build
:::

## Steps

### 1. Run workflow-init

```
Run workflow-init
```

The workflow should recognize you're in an existing project. If not, explicitly clarify that this is brownfield development.

### 2. Choose Your Approach

| Feature Scope | Recommended Approach |
|---------------|---------------------|
| Small (1-5 stories) | Quick Flow with tech-spec |
| Medium (5-15 stories) | BMad Method with PRD |
| Large (15+ stories) | Full BMad Method with architecture |

### 3. Create Planning Documents

**For Quick Flow:**
- Load PM agent
- Run tech-spec workflow
- The agent will analyze your existing codebase and create a context-aware spec

**For BMad Method:**
- Load PM agent
- Run PRD workflow
- Ensure the agent reads your existing documentation
- Review that integration points are clearly identified

### 4. Consider Architecture Impact

If your feature affects system architecture:

- Load Architect agent
- Run architecture workflow
- Ensure alignment with existing patterns
- Document any new ADRs (Architecture Decision Records)

### 5. Implement

Follow the standard Phase 4 implementation workflows:

1. `sprint-planning` - Organize your work
2. `create-story` - Prepare each story
3. `dev-story` - Implement with tests
4. `code-review` - Quality assurance

## Tips

- Always ensure agents read your existing documentation
- Pay attention to integration points with existing code
- Follow existing conventions unless deliberately changing them
- Document why you're adding new patterns (if any)
