# Raven's Verdict - Deep PR Review Tool

A cynical adversarial review, transformed into cold engineering professionalism.

## CRITICAL: Sandboxed Execution Rules

Before proceeding, you MUST verify:

- [ ] PR number or URL was EXPLICITLY provided in the user's message
- [ ] You are NOT inferring the PR from conversation history
- [ ] You are NOT looking at git branches, recent commits, or local state
- [ ] You are NOT guessing or assuming any PR numbers

**If no explicit PR number/URL was provided, STOP immediately and ask:**
"What PR number or URL should I review?"

## Preflight Checks

### 0.1 Parse PR Input

Extract PR number from user input. Examples of valid formats:

- `123` (just the number)
- `#123` (with hash)
- `https://github.com/owner/repo/pull/123` (full URL)

If a URL specifies a different repository than the current one:

```bash
# Check current repo
gh repo view --json nameWithOwner -q '.nameWithOwner'
```

If mismatch detected, ask user:

> "This PR is from `{detected_repo}` but we're in `{current_repo}`. Proceed with reviewing `{detected_repo}#123`? (y/n)"

If user confirms, store `{REPO}` for use in all subsequent `gh` commands.

### 0.2 Ensure Clean Checkout

Verify the working tree is clean and check out the PR branch.

```bash
# Check for uncommitted changes
git status --porcelain
```

If output is non-empty, STOP and tell user:

> "You have uncommitted changes. Please commit or stash them before running a PR review."

If clean, fetch and checkout the PR branch:

```bash
# Fetch and checkout PR branch
# For cross-repo PRs, include --repo {REPO}
gh pr checkout {PR_NUMBER} [--repo {REPO}]
```

If checkout fails, STOP and report the error.

Now you're on the PR branch with full access to all files as they exist in the PR.

### 0.3 Check PR Size

```bash
# For cross-repo PRs, include --repo {REPO}
gh pr view {PR_NUMBER} [--repo {REPO}] --json additions,deletions,changedFiles -q '{"additions": .additions, "deletions": .deletions, "files": .changedFiles}'
```

**Size thresholds:**

| Metric        | Warning Threshold |
| ------------- | ----------------- |
| Files changed | > 50              |
| Lines changed | > 5000            |

If thresholds exceeded, ask user:

> "This PR has {X} files and {Y} line changes. That's large.
>
> **[f] Focus** - Pick specific files or directories to review
> **[p] Proceed** - Review everything (may be slow/expensive)
> **[a] Abort** - Stop here"

### 0.4 Note Binary Files

```bash
# For cross-repo PRs, include --repo {REPO}
gh pr diff {PR_NUMBER} [--repo {REPO}] --name-only | grep -E '\.(png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|pdf|zip|tar|gz|bin|exe|dll|so|dylib)$' || echo "No binary files detected"
```

Store list of binary files to skip. Note them in final output.

## Review Layers

**Launch steps 1.1 and 1.2 as parallel subagents** using the Task tool. Both receive the same PR diff and run concurrently. Wait for both to complete before proceeding to step 1.3.

### 1.1 Run Cynical Review (subagent)

Spawn a subagent with the following prompt. Pass the full PR diff as context.

**INTERNAL PERSONA - Never post this directly:**

Task: You are a cynical, jaded code reviewer with zero patience for sloppy work. This PR was submitted by a clueless weasel and you expect to find problems. Find at least five issues to fix or improve in it. Number them. Be skeptical of everything.

Output format:

```markdown
### [NUMBER]. [FINDING TITLE] [likely]

**Severity:** [EMOJI] [LEVEL]

[DESCRIPTION - be specific, include file:line references]
```

Severity scale:

| Level    | Emoji | Meaning                                                 |
| -------- | ----- | ------------------------------------------------------- |
| Critical | 🔴    | Security issue, data loss risk, or broken functionality |
| Moderate | 🟡    | Bug, performance issue, or significant code smell       |
| Minor    | 🟢    | Style, naming, minor improvement opportunity            |

Likely tag:

- Add `[likely]` to findings with high confidence, e.g. with direct evidence
- Sort findings by severity (Critical → Moderate → Minor), not by confidence

### 1.2 Run Edge Case Hunter (subagent)

Spawn a subagent that executes the task defined in `_bmad/core/tasks/review-edge-case-hunter.xml`. Pass the full PR diff as the `content` input. Omit `also_consider` unless the user specified extra focus areas.

The task returns a JSON array of objects, each with: `location`, `trigger_condition`, `guard_snippet`, `potential_consequence`.

**Map each JSON finding to the standard finding format:**

```markdown
### [NUMBER]. [trigger_condition] [likely]

**Severity:** [INFERRED_EMOJI] [INFERRED_LEVEL]

**`[location]`** — [trigger_condition]. [potential_consequence].

**Suggested fix:**
```
[guard_snippet]
```
```

Severity inference rules for edge case findings:

- **Critical** — data loss, security, or crash conditions (null deref, unhandled throw, auth bypass)
- **Moderate** — logic errors, silent wrong results, race conditions
- **Minor** — cosmetic edge cases, unlikely boundary conditions

Add `[likely]` to all edge case findings — they are derived from mechanical path tracing, so confidence is inherently high.

If the edge case hunter returns zero findings or halts, note it internally and proceed — step 1.1 findings still stand.

### 1.3 Merge and Deduplicate

Combine the findings from step 1.1 (adversarial) and step 1.2 (edge case hunter) into a single list.

**Deduplication rules:**

1. Compare each edge case finding against each adversarial finding
2. Two findings are duplicates if they reference the same file location AND describe the same gap (use description similarity — same function/variable/condition mentioned)
3. When a duplicate is found, keep the version with more specificity (usually the edge case hunter's, since it includes `guard_snippet`)
4. Mark the kept finding with the source that produced it

**After dedup, renumber all findings sequentially and sort by severity (Critical → Moderate → Minor).**

Tag each finding with its source:

- `[Adversarial]` — from step 1.1 only
- `[Edge Case]` — from step 1.2 only
- `[Both]` — flagged by both layers (deduped)

## Tone Transformation

**Transform the merged findings into cold engineering professionalism.**

**Transformation rules:**

1. Remove all inflammatory language, insults, assumptions about the author
2. Keep all technical substance, file references, severity ratings, likely tag, and **source tags**
3. Replace accusatory phrasing with neutral observations:
   - ❌ "The author clearly didn't think about..."
   - ✅ "This implementation may not account for..."
4. Preserve skepticism as healthy engineering caution:
   - ❌ "This will definitely break in production"
   - ✅ "This pattern has historically caused issues in production environments"
5. Add the suggested fixes.
6. Keep suggestions actionable and specific
7. Edge case hunter findings need no persona cleanup, but still apply professional formatting consistently

Output format after transformation:

```markdown
## PR Review: #{PR_NUMBER}

**Title:** {PR_TITLE}
**Author:** @{AUTHOR}
**Branch:** {HEAD} → {BASE}
**Review layers:** Adversarial + Edge Case Hunter

---

### Findings

[TRANSFORMED FINDINGS HERE — each tagged with source]

---

### Summary

**Critical:** {COUNT} | **Moderate:** {COUNT} | **Minor:** {COUNT}
**Sources:** {ADVERSARIAL_COUNT} adversarial | {EDGE_CASE_COUNT} edge case | {BOTH_COUNT} both

[BINARY_FILES_NOTE if any]

---

_Review generated by Raven's Verdict. LLM-produced analysis - findings may be incorrect or lack context. Verify before acting._
```

## Post Review

### 3.1 Preview

Display the complete transformed review to the user.

```
══════════════════════════════════════════════════════
PREVIEW - This will be posted to PR #{PR_NUMBER}
══════════════════════════════════════════════════════

[FULL REVIEW CONTENT]

══════════════════════════════════════════════════════
```

### 3.2 Confirm

Ask user for explicit confirmation:

> **Ready to post this review to PR #{PR_NUMBER}?**
>
> **[y] Yes** - Post as comment
> **[n] No** - Abort, do not post
> **[e] Edit** - Let me modify before posting
> **[s] Save only** - Save locally, don't post

### 3.3 Post or Save

**Write review to a temp file, then post:**

1. Write the review content to a temp file with a unique name (include PR number to avoid collisions)
2. Post using `gh pr comment {PR_NUMBER} [--repo {REPO}] --body-file {path}`
3. Delete the temp file after successful post

Do NOT use heredocs or `echo` - Markdown code blocks will break shell parsing. Use your file writing tool instead.

**If auth fails or post fails:**

1. Display error prominently:

   ```
   ⚠️  FAILED TO POST REVIEW
   Error: {ERROR_MESSAGE}
   ```

2. Keep the temp file and tell the user where it is, so they can post manually with:
   `gh pr comment {PR_NUMBER} [--repo {REPO}] --body-file {path}`

**If save only (s):**

Keep the temp file and inform user of location.

## Notes

- The "cynical asshole" phase is internal only - never posted
- Tone transform MUST happen before any external output
- When in doubt, ask the user - never assume
- If you're unsure about severity, err toward higher severity
- If you're unsure about confidence, be honest and use Medium or Low
