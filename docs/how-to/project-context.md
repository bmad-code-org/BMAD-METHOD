---
title: "Manage Project Context"
description: Create and maintain project-context.md to guide AI agents
sidebar:
  order: 7
---

Use the `project-context.md` file to ensure AI agents follow your project's technical preferences and implementation rules throughout all workflows.

:::note[Prerequisites]
- BMad Method installed
- Understanding of your project's technology stack and conventions
:::

## When to Use This

- You have strong technical preferences before starting architecture
- You've completed architecture and want to capture decisions for implementation
- You're working on an existing codebase with established patterns
- You notice agents making inconsistent decisions across stories

## Step 1: Choose Your Approach

**Manual creation** — Best when you know exactly what rules you want to document

**Generate after architecture** — Best for capturing decisions made during solutioning

**Generate for existing projects** — Best for discovering patterns in existing codebases

## Step 2: Create the File

### Option A: Manual Creation

Create the file at `_bmad-output/project-context.md`:

```bash
mkdir -p _bmad-output
touch _bmad-output/project-context.md
```

Add your technology stack and implementation rules:

```markdown
---
project_name: 'MyProject'
user_name: 'YourName'
date: '2026-02-15'
sections_completed: ['technology_stack', 'critical_rules']
---

# Project Context for AI Agents

## Technology Stack & Versions

- Node.js 20.x, TypeScript 5.3, React 18.2
- State: Zustand
- Testing: Vitest, Playwright
- Styling: Tailwind CSS

## Critical Implementation Rules

**TypeScript:**
- Strict mode enabled, no `any` types
- Use `interface` for public APIs, `type` for unions

**Code Organization:**
- Components in `/src/components/` with co-located tests
- API calls use `apiClient` singleton — never fetch directly

**Testing:**
- Unit tests focus on business logic
- Integration tests use MSW for API mocking
```

### Option B: Generate After Architecture

Run the workflow in a fresh chat:

```bash
/bmad-bmm-generate-project-context
```

The workflow scans your architecture document and project files to generate a context file capturing the decisions made.

### Option C: Generate for Existing Projects

For existing projects, run:

```bash
/bmad-bmm-generate-project-context
```

The workflow analyzes your codebase to identify conventions, then generates a context file you can review and refine.

## Step 3: Verify Content

Review the generated file and ensure it captures:

- Correct technology versions
- Your actual conventions (not generic best practices)
- Rules that prevent common mistakes
- Framework-specific patterns

Edit manually to add anything missing or remove inaccuracies.

## What You Get

A `project-context.md` file that:

- Ensures all agents follow the same conventions
- Prevents inconsistent decisions across stories
- Captures architecture decisions for implementation
- Serves as a reference for your project's patterns and rules

## Tips

:::tip[Focus on the Unobvious]
Document patterns agents might miss such as "Use JSDoc style comments on every public class, function and variable", not universal practices like "use meaningful variable names" which LLMs know at this point.
:::

:::tip[Keep It Lean]
This file is loaded by every implementation workflow. Long files waste context. Do not include content that only applies to narrow scope or specific stories or features.
:::

:::tip[Update as Needed]
Edit manually when patterns change, or re-generate after significant architecture changes.
:::

:::tip[Works for All Project Types]
Just as useful for Quick Flow as for full BMad Method projects.
:::

## Next Steps

- [**Project Context Explanation**](../explanation/project-context.md) — Learn more about how it works
- [**Workflow Map**](../reference/workflow-map.md) — See which workflows load project context
