---
title: "Project Context"
description: How project-context.md guides AI agents with your project's rules and preferences
sidebar:
  order: 7
---

The `project-context.md` file is your project's implementation guide for AI agents. Similar to a "constitution" in other development systems, it captures the rules, patterns, and preferences that ensure consistent code generation across all workflows.

## What It Does

AI agents make implementation decisions constantly — which patterns to follow, how to structure code, what conventions to use. Without clear guidance, they may:
- Follow generic best practices that don't match your codebase
- Make inconsistent decisions across different stories
- Miss project-specific requirements or constraints

The `project-context.md` file solves this by documenting what agents need to know in a concise, LLM-optimized format.

## How It Works

Every implementation workflow automatically loads `project-context.md` if it exists. The architect workflow also loads it to respect your technical preferences when designing the architecture.

**Loaded by these workflows:**
- `create-architecture` — respects technical preferences during solutioning
- `create-story` — informs story creation with project patterns
- `dev-story` — guides implementation decisions
- `code-review` — validates against project standards
- `quick-dev` — applies patterns when implementing tech-specs
- `sprint-planning`, `retrospective`, `correct-course` — provides project-wide context

## When to Create It

The `project-context.md` file is useful at any stage of a project:

| Scenario | When to Create | Purpose |
|----------|----------------|---------|
| **New project, before architecture** | Manually, before `create-architecture` | Document your technical preferences so the architect respects them |
| **New project, after architecture** | Via `generate-project-context` or manually | Capture architecture decisions for implementation agents |
| **Existing project** | Via `generate-project-context` | Discover existing patterns so agents follow established conventions |
| **Quick Flow project** | Before or during `quick-dev` | Ensure quick implementation respects your patterns |

:::tip[Recommended]
For new projects, create it manually before architecture if you have strong technical preferences. Otherwise, generate it after architecture to capture those decisions.
:::

## What Goes In It

The file has two main sections:

### Technology Stack & Versions

Documents the frameworks, languages, and tools your project uses with specific versions:

```markdown
## Technology Stack & Versions

- Node.js 20.x, TypeScript 5.3, React 18.2
- State: Zustand (not Redux)
- Testing: Vitest, Playwright, MSW
- Styling: Tailwind CSS with custom design tokens
```

### Critical Implementation Rules

Documents patterns and conventions that agents might otherwise miss:

```markdown
## Critical Implementation Rules

**TypeScript Configuration:**
- Strict mode enabled — no `any` types without explicit approval
- Use `interface` for public APIs, `type` for unions/intersections

**Code Organization:**
- Components in `/src/components/` with co-located `.test.tsx`
- Utilities in `/src/lib/` for reusable pure functions
- API calls use the `apiClient` singleton — never fetch directly

**Testing Patterns:**
- Unit tests focus on business logic, not implementation details
- Integration tests use MSW to mock API responses
- E2E tests cover critical user journeys only

**Framework-Specific:**
- All async operations use the `handleError` wrapper for consistent error handling
- Feature flags accessed via `featureFlag()` from `@/lib/flags`
- New routes follow the file-based routing pattern in `/src/app/`
```

Focus on what's **unobvious** — things agents might not infer from reading code snippets. Don't document standard practices that apply universally.

## Creating the File

You have three options:

### Manual Creation

Create the file at `_bmad-output/project-context.md` and add your rules:

```bash
# In your project root
mkdir -p _bmad-output
touch _bmad-output/project-context.md
```

Edit it with your technology stack and implementation rules. The architect and implementation workflows will automatically find and load it.

### Generate After Architecture

Run the `generate-project-context` workflow after completing your architecture:

```bash
/bmad-bmm-generate-project-context
```

This scans your architecture document and project files to generate a context file capturing the decisions made.

### Generate for Existing Projects

For existing projects, run `generate-project-context` to discover existing patterns:

```bash
/bmad-bmm-generate-project-context
```

The workflow analyzes your codebase to identify conventions, then generates a context file you can review and refine.

## Why It Matters

Without `project-context.md`, agents make assumptions that may not match your project:

| Without Context | With Context |
|----------------|--------------|
| Uses generic patterns | Follows your established conventions |
| Inconsistent style across stories | Consistent implementation |
| May miss project-specific constraints | Respects all technical requirements |
| Each agent decides independently | All agents align with same rules |

This is especially important for:
- **Quick Flow** — skips PRD and architecture, so context file fills the gap
- **Team projects** — ensures all agents follow the same standards
- **Existing projects** — prevents breaking established patterns

## Editing and Updating

The `project-context.md` file is a living document. Update it when:

- Architecture decisions change
- New conventions are established
- Patterns evolve during implementation
- You identify gaps from agent behavior

You can edit it manually at any time, or re-run `generate-project-context` to update it after significant changes.

:::note[File Location]
The default location is `_bmad-output/project-context.md`. Workflows search for it there, and also check `**/project-context.md` anywhere in your project.
:::
