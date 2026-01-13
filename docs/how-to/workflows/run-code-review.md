---
title: "How to Run Code Review"
description: How to run code review for quality assurance
---

Use the `code-review` workflow to perform a thorough quality review of implemented code.

## When to Use This

- After dev-story completes implementation
- Before marking a story as DONE
- Every story goes through code review — no exceptions

:::note[Prerequisites]
- BMad Method installed
- DEV agent available
- Story implementation complete
- Tests written and passing
:::

## Steps

### 1. Load the DEV Agent

Start a fresh chat (or continue from dev-story) and load the DEV agent.

### 2. Run the Workflow

```
*code-review
```

### 3. Provide Context

Point the agent to:
- The story file
- Files changed during implementation
- Test files

### 4. Review Findings

The agent performs a senior developer code review and reports findings.

### 5. Address Issues

If issues are found:
1. Fix issues using dev-story
2. Re-run tests
3. Run code-review again

## What Gets Reviewed

| Category | Checks |
|----------|--------|
| **Code Quality** | Clean code, appropriate abstractions, no code smells, proper error handling |
| **Architecture Alignment** | Follows ADRs, consistent with patterns, proper separation of concerns |
| **Testing** | Adequate coverage, meaningful tests, edge cases, follows project patterns |
| **Security** | No hardcoded secrets, input validation, proper auth, no common vulnerabilities |
| **Performance** | No obvious issues, appropriate data structures, efficient queries |

## Review Outcomes

**Approved** — Code meets quality standards, tests pass. Mark story as DONE in sprint-status.yaml.

**Changes Requested** — Issues identified that need fixing. Fix issues in dev-story, then re-run code-review.

## Quality Gates

Every story goes through code-review before being marked done. This ensures:

- Consistent code quality
- Architecture adherence
- Test coverage
- Security review

## Tips

- **Don't skip for "simple" changes** — Simple changes can have subtle bugs
- **Address all findings** — Not just critical ones
- **Use findings as learning opportunities** — Improve over time
- **Re-run review after fixes** — Verify issues are resolved

## Next Steps

After code review:

1. **If approved** — Update sprint-status.yaml to mark story DONE
2. **If changes requested** — Fix issues and re-run review
3. **Move to next story** — Run create-story for the next item
