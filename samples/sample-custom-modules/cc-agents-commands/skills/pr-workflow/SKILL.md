---
name: pr-workflow
description: Handle pull request operations - create, status, update, validate, merge, sync. Use when user mentions "PR", "pull request", "merge", "create branch", "check PR status", or any Git workflow terms related to pull requests.
---

# PR Workflow Skill

Generic PR management for any Git project. Works with any branching strategy, any base branch, any project structure.

## Capabilities

### Create PR
- Detect current branch automatically
- Determine base branch from Git config
- Generate PR description from commit messages
- Support draft or ready PRs

### Check Status
- Show PR status for current branch
- Display CI check results
- Show merge readiness

### Update PR
- Refresh PR description from recent commits
- Update based on new changes

### Validate
- Check if ready to merge
- Run quality gates (tests, coverage, linting)
- Verify CI passing

### Merge
- Squash or merge commit strategy
- Auto-cleanup branches after merge
- Handle conflicts

### Sync
- Update current branch with base branch
- Resolve merge conflicts
- Keep feature branch current

## How It Works

1. **Introspect Git structure** - Auto-detect base branch, remote, branching pattern
2. **Use gh CLI** - All PR operations via GitHub CLI
3. **No state files** - Everything determined from Git commands
4. **Generic** - Works with ANY repo structure (no hardcoded assumptions)

## Delegation

All operations delegate to the **pr-workflow-manager** subagent which:
- Handles gh CLI operations
- Spawns quality validation agents when needed
- Coordinates with ci_orchestrate, test_orchestrate for failures
- Manages complete PR lifecycle

## Examples

**Natural language triggers:**
- "Create a PR for this branch"
- "What's the status of my PR?"
- "Is my PR ready to merge?"
- "Update my PR description"
- "Merge this PR"
- "Sync my branch with main"

**All work with ANY project structure!**
