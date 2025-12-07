# Tech-Spec: PR Review Tool (Raven's Verdict)

**Created:** 2025-12-06
**Status:** Completed

## Overview

### Problem Statement

External contributors submit PRs to the upstream repository without context on code quality expectations. Maintainers need a way to provide deep, thorough code review feedback without spending hours manually reviewing every PR. Automated tools like CodeRabbit handle surface-level checks, but high-compute, human-triggered deep reviews are missing.

### Solution

A portable prompt file that any LLM agent can execute to:

1. Fetch PR diff and full files via `gh` CLI
2. Run an adversarial code review (cynical, thorough)
3. Transform the tone from "cynical asshole" to "cold engineering professional"
4. Post the findings as a comment on the PR

### Scope

**In Scope:**

- Manual trigger via any LLM agent (Claude Code, Cursor, Windsurf, etc.)
- Review of GitHub PRs using `gh` CLI
- Adversarial review with severity + confidence ratings
- Tone transformation before posting
- Preview and explicit confirmation before posting

**Out of Scope:**

- Automated triggers (webhooks, GitHub Actions)
- Integration with CodeRabbit or other tools
- Review of non-GitHub repositories
- Persistent storage or history tracking

## Context for Development

### Codebase Patterns

- Maintainer tools live in `tools/maintainer/`
- Prompts are simple markdown files with clear instructions
- Existing pattern: `review-adversarial.md` (3 lines, direct, effective)

### Files to Reference

- `tools/maintainer/fix-elicitation-wording.md` - Example of agent prompt in maintainer tools
- `.claude/commands/review-adversarial.md` - Base cynical reviewer prompt to adapt

### Technical Decisions

| Decision       | Choice                                    | Rationale                                       |
| -------------- | ----------------------------------------- | ----------------------------------------------- |
| Location       | `tools/maintainer/pr-review/`             | Maintainer tooling, separate from product       |
| Invocation     | Prompt file + PR URL/number               | Portable across all LLM platforms               |
| PR data source | `gh` CLI                                  | Already available, handles auth                 |
| Review input   | Diff + full files                         | Diff for focus, full files for tangents         |
| Tone transform | Same session, Phase 2 with `task:` prefix | Spawns sub-agent if available, inline otherwise |
| Output format  | Numbered, freeform, severity + confidence | Scannable, actionable                           |

## Implementation Plan

### Tasks

- [x] Task 1: Create `tools/maintainer/pr-review/` directory structure
- [x] Task 2: Write `review-prompt.md` - the main prompt file with all phases
- [x] Task 3: Write `README.md` - usage instructions for maintainers
- [ ] Task 4: Test with a real PR on the upstream repo
- [ ] Task 5: Iterate based on output quality

### File Structure

```
tools/maintainer/pr-review/
  ├── README.md           # How to use
  ├── review-prompt.md    # The main prompt file
  └── output/             # Local backup folder (gitignored)
```

### Prompt File Structure (`review-prompt.md`)

```
## Phase 0: Pre-flight Checks
- Verify PR number/URL provided (if not, STOP and ask)
- Check PR size via gh pr view --json
- Confirm repo if different from upstream
- Note binary files to skip

## Phase 1: Adversarial Review
- Fetch diff + full files
- Run cynical review
- Output numbered findings with severity + confidence

## Phase 2: Tone Transform
- task: Rewrite findings as cold engineering professional
- Preserve severity/confidence markers
- Remove inflammatory language, keep substance

## Phase 3: Post
- Preview full comment
- Ask for explicit confirmation
- Post via gh pr comment
- Handle auth failure gracefully
```

### Acceptance Criteria

- [ ] AC 1: Given a PR URL, when agent reads prompt, then it fetches PR data via `gh` without hallucinating PR numbers
- [ ] AC 2: Given PR data, when review runs, then findings are numbered with severity (🔴🟡🟢) and confidence (High/Medium/Low %)
- [ ] AC 3: Given cynical output, when tone transform runs, then language is professional but findings retain substance
- [ ] AC 4: Given transformed output, when user confirms, then comment posts to PR via `gh pr comment`
- [ ] AC 5: Given missing PR number, when agent starts, then it stops and asks user explicitly
- [ ] AC 6: Given PR from different repo, when agent detects mismatch, then it asks user to confirm before proceeding
- [ ] AC 7: Given PR with >50 files or >5000 lines, when pre-flight runs, then agent warns and asks to proceed or focus
- [ ] AC 8: Given auth failure during post, when error occurs, then review is saved locally and error is displayed loudly
- [ ] AC 9: Given PR with binary files, when fetching diff, then binaries are skipped with a note

## Additional Context

### Dependencies

- `gh` CLI installed and authenticated
- Any LLM agent capable of running bash commands

### Sandboxed Execution Rules

The prompt MUST enforce:

- ❌ No inferring PR from conversation history
- ❌ No looking at git branches, recent commits, or local state
- ❌ No guessing or assuming PR numbers
- ✅ Use ONLY explicit PR number/URL from user message
- ✅ If missing, STOP and ask: "What PR number or URL should I review?"

### Severity Scale

| Level       | Meaning                                                 |
| ----------- | ------------------------------------------------------- |
| 🔴 Critical | Security issue, data loss risk, or broken functionality |
| 🟡 Moderate | Bug, performance issue, or significant code smell       |
| 🟢 Minor    | Style, naming, minor improvement opportunity            |

### Confidence Scale

| Level           | Meaning                              |
| --------------- | ------------------------------------ |
| High (>80%)     | Definitely an issue                  |
| Medium (40-80%) | Likely an issue, might need context  |
| Low (<40%)      | Possible issue, could be intentional |

### Example Output Format

```markdown
## PR Review: #1234

### 1. Unbounded query in user search

**Severity:** 🔴 Critical | **Confidence:** High (>80%)

The search endpoint at `src/api/search.ts:47` doesn't limit results, which could return thousands of rows and cause memory issues.

**Suggestion:** Add `.limit(100)` or implement pagination.

### 2. Missing null check in callback

**Severity:** 🟡 Moderate | **Confidence:** Medium (40-80%)

The callback at `src/handlers/webhook.ts:23` could be undefined if the event type is unregistered.

**Suggestion:** Add defensive check: `if (callback) callback(event)`

---

_Review generated by Raven's Verdict - Deep PR Review Tool_
```

### Notes

- The "cynical asshole" phase is internal only - never posted
- Tone transform must happen before any external output
- When in doubt, ask the user - never assume
- This is a POC - iterate based on real usage
