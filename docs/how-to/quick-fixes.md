---
title: "Quick Fixes"
description: How to make quick fixes and ad-hoc changes
---

Use the **DEV agent** directly for bug fixes, refactorings, or small targeted changes that don't require the full BMad method or Quick Flow.

## When to Use This

- Simple bug fixes
- Small refactorings and changes that don't need extensive ideation, planning, or architectural shifts
- Larger refactorings or improvement with built in tool planning and execution mode combination, or better yet use quick flow
- Learning about your codebase

## Steps

### 1. Load an Agent

For quick fixes, you can use:

- **DEV agent** - For implementation-focused work
- **Quick Flow Solo Dev** - For slightly larger changes that still need a quick-spec to keep the agent aligned to planning and standards

### 2. Describe the Change

Simply tell the agent what you need:

```
Fix the login validation bug that allows empty passwords
```

or

```
Refactor the UserService to use async/await instead of callbacks
```

### 3. Let the Agent Work

The agent will:

- Analyze the relevant code
- Propose a solution
- Implement the change
- Run tests (if available)

### 4. Review and Commit

Review the changes made and commit when satisfied.

## Learning Your Codebase

This approach is also excellent for exploring unfamiliar code:

```
Explain how the authentication system works in this codebase
```

```
Show me where error handling happens in the API layer
```

LLMs are excellent at interpreting and analyzing code, whether it was AI-generated or not. Use the agent to:

- Learn about your project
- Understand how things are built
- Explore unfamiliar parts of the codebase

## When to Upgrade to Formal Planning

Consider using Quick Flow or full BMad Method when:

- The change affects multiple files or systems
- You're unsure about the scope
- The fix keeps growing in complexity
- You need documentation for the change
