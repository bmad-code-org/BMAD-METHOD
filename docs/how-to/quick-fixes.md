---
title: 'Quick Fixes'
description: How to make quick fixes and ad-hoc changes
sidebar:
  order: 6
---

Use **Quick Dev** for bug fixes, refactorings, or small targeted changes that don't require the full BMad Method.

## When to Use This

- Bug fixes with a clear, known cause
- Small refactorings (rename, extract, restructure) contained within a few files
- Minor feature tweaks or configuration changes
- Dependency updates

:::note[Prerequisites]

- BMad Method installed (`npx bmad-method install`)
- An AI-powered IDE (Claude Code, Cursor, or similar)
  :::

## Steps

### 1. Start a Fresh Chat

Open a **fresh chat session** in your AI IDE. Reusing a session from a previous workflow can cause context conflicts.

### 2. Give It Your Intent

Quick Dev accepts free-form intent — before, with, or after the invocation. Examples:

```text
run quick-dev — Fix the login validation bug that allows empty passwords.
```

```text
run quick-dev — fix https://github.com/org/repo/issues/42
```

```text
run quick-dev — implement the intent in _bmad-output/implementation-artifacts/my-intent.md
```

```text
I think the problem is in the auth middleware, it's not checking token expiry.
Let me look at it... yeah, src/auth/middleware.ts line 47 skips
the exp check entirely. run quick-dev
```

```text
run quick-dev
> What would you like to do?
Refactor UserService to use async/await instead of callbacks.
```

Plain text, file paths, GitHub issue URLs, bug tracker links — anything the LLM can resolve to a concrete intent.

### 3. Answer Questions and Approve

Quick Dev may ask clarifying questions or present a short spec for your approval before implementing. Answer its questions and approve when you're satisfied with the plan.

### 4. Review and Push

Quick Dev implements the change, reviews its own work, patches issues, and commits locally. When it's done, it opens the affected files in your editor.

- Skim the diff to confirm the change matches your intent
- If something looks off, tell the agent what to fix — it can iterate in the same session

Once satisfied, push the commit. Quick Dev will offer to push and create a PR for you.

:::caution[If Something Breaks]
If a pushed change causes unexpected issues, use `git revert HEAD` to undo the last commit cleanly. Then start a fresh chat and run Quick Dev again to try a different approach.
:::

## What You Get

- Modified source files with the fix or refactoring applied
- Passing tests (if your project has a test suite)
- A ready-to-push commit with a conventional commit message

## Deferred Work

Quick Dev keeps each run focused on a single goal. If your request contains multiple independent goals, or if the review surfaces pre-existing issues unrelated to your change, Quick Dev defers them to a file (`deferred-work.md` in your implementation artifacts directory) rather than trying to tackle everything at once.

Check this file after a run — it's your backlog of things to come back to. Each deferred item can be fed into a fresh Quick Dev run later.

## When to Upgrade to Formal Planning

Consider using the full BMad Method when:

- The change affects multiple systems or requires coordinated updates across many files
- You are unsure about the scope and need requirements discovery first
- You need documentation or architectural decisions recorded for the team

See [Quick Dev](../explanation/quick-dev.md) for more on how Quick Dev fits into the BMad Method.
