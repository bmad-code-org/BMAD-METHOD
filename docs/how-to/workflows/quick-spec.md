---
title: "How to Use Quick Spec"
description: How to create a technical specification using Quick Spec workflow
---

Use the `quick-spec` workflow for Quick Flow projects to go directly from idea to implementation-ready specification.

## When to Use This

- Bug fixes and small enhancements
- Small features with clear scope (1-15 stories)
- Rapid prototyping
- Adding to existing brownfield codebase
- Quick Flow track projects

:::note[Prerequisites]
- BMad Method installed
- PM agent or Quick Flow Solo Dev agent available
- Project directory (can be empty for greenfield)
:::

## Steps

### 1. Load the PM Agent

Start a fresh chat and load the PM agent (or Quick Flow Solo Dev agent).

### 2. Run the Tech Spec Workflow

```
*quick-spec
```

Or simply describe what you want to build:

```
I want to fix the login validation bug
```

### 3. Answer Discovery Questions

The workflow will ask:
- What problem are you solving?
- What's the scope of the change?
- Any specific constraints?

### 4. Review Detected Context

For brownfield projects, the agent will:
- Detect your project stack
- Analyze existing code patterns
- Detect test frameworks
- Ask: "Should I follow these existing conventions?"

### 5. Get Your Tech Spec

The agent generates a comprehensive tech-spec with ready-to-implement stories.

## What You Get

**tech-spec.md:**
- Problem statement and solution
- Detected framework versions and dependencies
- Brownfield code patterns (if applicable)
- Existing test patterns to follow
- Specific file paths to modify
- Complete implementation guidance

**Story Files:**
- Single changes: `story-[slug].md`
- Small features: `epics.md` + `story-[epic-slug]-1.md`, etc.

## Example: Bug Fix

**You:** "I want to fix the login validation bug that allows empty passwords"

**Agent:**
1. Asks clarifying questions about the issue
2. Detects your Node.js stack (Express 4.18.2, Jest for testing)
3. Analyzes existing UserService code patterns
4. Asks: "Should I follow your existing conventions?" → Yes
5. Generates tech-spec.md with specific file paths
6. Creates story-login-fix.md

## Example: Small Feature

**You:** "I want to add OAuth social login (Google, GitHub)"

**Agent:**
1. Asks about feature scope
2. Detects your stack (Next.js 13.4, NextAuth.js already installed!)
3. Analyzes existing auth patterns
4. Confirms conventions
5. Generates:
   - tech-spec.md (comprehensive implementation guide)
   - epics.md (OAuth Integration epic)
   - story-oauth-1.md (Backend OAuth setup)
   - story-oauth-2.md (Frontend login buttons)

## Implementing After Tech Spec

```bash
# Single change:
# Load DEV agent and run dev-story

# Multi-story feature:
# Optional: Load SM agent and run sprint-planning
# Then: Load DEV agent and run dev-story for each story
```

## Tips

- **Be specific in discovery** — "Fix email validation in UserService to allow plus-addressing" beats "Fix validation bug"
- **Trust convention detection** — If it detects your patterns correctly, say yes! It's faster than establishing new conventions
- **Keep single changes atomic** — If your "single change" needs 3+ files, it might be a multi-story feature. Let the workflow guide you

## Next Steps

After tech spec:

1. **Implement Story** — Run dev-story with the DEV agent
2. **Sprint Planning** — Optional for multi-story features
