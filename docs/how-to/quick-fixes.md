---
title: "Quick Fixes"
description: How to make quick fixes and ad-hoc changes
sidebar:
  order: 5
---

Use the **DEV agent** directly for bug fixes, refactorings, or small targeted changes that don't require the full BMad Method or Quick Flow.

## When to Use This

- Bug fixes with a clear, known cause
- Small refactorings (rename, extract, restructure) contained within a few files
- Minor feature tweaks or configuration changes
- Exploratory work to understand an unfamiliar codebase

:::note[Prerequisites]
- BMad Method installed (`npx bmad-method install`)
- An AI-powered IDE (Claude Code, Cursor, Windsurf, or similar)
:::

## Choose Your Approach

| Situation | Agent | Why |
| --- | --- | --- |
| Fix a specific bug or make a small, scoped change | **DEV agent** | Jumps straight into implementation without planning overhead |
| Change touches several files or you want a written plan first | **Quick Flow Solo Dev** | Creates a quick-spec before implementation so the agent stays aligned to your standards |

If you are unsure, start with the DEV agent. You can always escalate to Quick Flow if the change grows.

## Steps

### 1. Load the DEV Agent

Start a **fresh chat** in your AI IDE and load the DEV agent with its slash command:

```text
/bmad-agent-bmm-dev
```

This loads the agent's persona and capabilities into the session. If you decide you need Quick Flow instead, load the **Quick Flow Solo Dev** agent in a fresh chat:

```text
/bmad-agent-bmm-quick-flow-solo-dev
```

Once the Solo Dev agent is loaded, describe your change and ask it to create a **quick-spec**. The agent drafts a lightweight spec capturing what you want to change and how. After you approve the quick-spec, tell the agent to start the **Quick Flow dev cycle** -- it will implement the change, run tests, and perform a self-review, all guided by the spec you just approved.

:::tip[Fresh Chats]
Always start a new chat session when loading an agent. Reusing a session from a previous workflow can cause context conflicts.
:::

### 2. Describe the Change

Tell the agent what you need in plain language. Be specific about the problem and, if you know it, where the relevant code lives.

:::note[Example Prompts]
**Bug fix** -- "Fix the login validation bug that allows empty passwords. The validation logic is in `src/auth/validate.ts`."

**Refactoring** -- "Refactor the UserService to use async/await instead of callbacks."

**Configuration change** -- "Update the CI pipeline to cache node_modules between runs."

**Dependency update** -- "Upgrade the express dependency to the latest v5 release and fix any breaking changes."
:::

You don't need to provide every detail. The agent will read the relevant source files and ask clarifying questions when needed.

### 3. Let the Agent Work

The agent will:

- Read and analyze the relevant source files
- Propose a solution and explain its reasoning
- Implement the change across the affected files
- Run your project's test suite if one exists

If your project has tests, the agent runs them automatically after making changes and iterates until tests pass. For projects without a test suite, verify the change manually (run the app, hit the endpoint, check the output).

### 4. Review and Verify

Before committing, review what changed:

- Read through the diff to confirm the change matches your intent
- Run the application or tests yourself to double-check
- If something looks wrong, tell the agent what to fix -- it can iterate in the same session

Once satisfied, commit the changes with a clear message describing the fix.

:::caution[If Something Breaks]
If a committed change causes unexpected issues, use `git revert HEAD` to undo the last commit cleanly. Then start a fresh chat with the DEV agent to try a different approach.
:::

## Learning Your Codebase

The DEV agent is also useful for exploring unfamiliar code. Load it in a fresh chat and ask questions:

:::note[Example Prompts]
"Explain how the authentication system works in this codebase."

"Show me where error handling happens in the API layer."

"What does the `ProcessOrder` function do and what calls it?"
:::

Use the agent to learn about your project, understand how components connect, and explore unfamiliar areas before making changes.

## What You Get

- Modified source files with the fix or refactoring applied
- Passing tests (if your project has a test suite)
- A clean commit describing the change

No planning artifacts are produced -- that's the point of this approach.

## When to Upgrade to Formal Planning

Consider using [Quick Flow](../explanation/quick-flow.md) or the full BMad Method when:

- The change affects multiple systems or requires coordinated updates across many files
- You are unsure about the scope and need a spec to think it through
- The fix keeps growing in complexity as you work on it
- You need documentation or architectural decisions recorded for the team
