---
name: 'step-06b-sync-github'
description: 'Sync completion to GitHub - create PR, update issue, release lock'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-06b-sync-github.md'
prevStepFile: '{workflow_path}/steps/step-06-complete.md'
nextStepFile: '{workflow_path}/steps/step-07-summary.md'

# GitHub Integration
github_integration: "{config_source}:github_integration"

# Role
role: sm
---

# Step 6b: Sync to GitHub (Enterprise Integration)

## CONDITIONAL EXECUTION

**Only execute if GitHub integration is enabled:**

```
IF github_integration.enabled != true:
  SKIP this step
  GOTO step-07-summary
```

## STEP GOAL

Close the development loop with GitHub:
1. Create Pull Request linking to issue
2. Update issue status to in-review
3. Add completion comment to issue
4. Release story lock (optional - keep until approved)

## EXECUTION SEQUENCE

### 1. Load GitHub Context

```javascript
// Load cache metadata
cache_meta = load {{cache_dir}}/.bmad-cache-meta.json

story_meta = cache_meta.stories[{{story_key}}]
issue_number = story_meta.github_issue

IF NOT issue_number:
  output: "⚠️ Story not synced to GitHub - skipping PR creation"
  output: "Run /migrate-to-github to sync, then create PR manually"
  GOTO step-07-summary

github_owner = {{github_integration.repository.owner}}
github_repo = {{github_integration.repository.repo}}
```

### 2. Create Pull Request

**Get current branch:**
```bash
current_branch=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $current_branch"
```

**Get commit information:**
```bash
commit_sha=$(git rev-parse HEAD)
commit_msg=$(git log -1 --pretty=format:"%s")
```

**Create PR via GitHub MCP:**
```javascript
// Generate PR body
pr_body = `
## Story: ${story_key}

Implements: #${issue_number}

### Acceptance Criteria

${format_acs_from_story(story_file)}

### Implementation Summary

${story.devAgentRecord?.summary || "See commit history for details."}

### Changes

${generate_file_list_from_story(story_file)}

### Testing

- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

---
Closes #${issue_number}
`

// Create PR
pr = await mcp__github__create_pull_request({
  owner: github_owner,
  repo: github_repo,
  title: `Story ${story_key}: ${story.title}`,
  body: pr_body,
  head: current_branch,
  base: "main",  // Or detected default branch
  draft: false
})

pr_number = pr.number
pr_url = pr.html_url

output: "✅ PR #${pr_number} created"
output: "   URL: ${pr_url}"
```

**Handle PR creation failure:**
```javascript
CATCH (error) {
  IF error.message.includes("already exists"):
    // PR already exists - find it
    existing = await mcp__github__search_pull_requests({
      query: `repo:${github_owner}/${github_repo} head:${current_branch} is:open`
    })
    IF existing.items.length > 0:
      pr = existing.items[0]
      pr_number = pr.number
      pr_url = pr.html_url
      output: "ℹ️ Using existing PR #${pr_number}"
  ELSE:
    output: "⚠️ Could not create PR: ${error.message}"
    output: "   You can create it manually in GitHub"
    // Continue without PR - not a blocker
}
```

### 3. Update GitHub Issue

**Add completion comment:**
```javascript
await mcp__github__add_issue_comment({
  owner: github_owner,
  repo: github_repo,
  issue_number: issue_number,
  body: `
✅ **Implementation Complete**

**Commit:** \`${commit_sha.substring(0, 7)}\`
**Branch:** \`${current_branch}\`
${pr_number ? `**PR:** #${pr_number}` : ''}

---

**Summary:**
${story.devAgentRecord?.summary || commit_msg}

**Files Changed:**
${generate_file_list_markdown(story_file)}

---
_Completed by super-dev-pipeline at ${timestamp}_
`
})
```

**Update issue labels:**
```javascript
// Get current labels
issue = await mcp__github__issue_read({
  method: "get",
  owner: github_owner,
  repo: github_repo,
  issue_number: issue_number
})

current_labels = issue.labels.map(l => l.name)

// Update: remove in-progress, add in-review
new_labels = current_labels
  .filter(l => l != "status:in-progress")

IF NOT new_labels.includes("status:in-review"):
  new_labels.push("status:in-review")

await mcp__github__issue_write({
  method: "update",
  owner: github_owner,
  repo: github_repo,
  issue_number: issue_number,
  labels: new_labels
})

output: "✅ Issue #${issue_number} updated to in-review"
```

### 4. Update Cache Metadata

```javascript
// Update cache with PR link
cache_meta.stories[story_key].pr_number = pr_number
cache_meta.stories[story_key].pr_url = pr_url
cache_meta.stories[story_key].completed_at = timestamp

save_cache_meta(cache_meta)
```

### 5. Lock Decision

**For batch mode:** Keep lock until PO approves
```javascript
IF batch_mode:
  output: "ℹ️ Lock retained - will be released on PO approval"
  // Lock stays with developer until /approve-story
```

**For interactive mode:** Offer choice
```
Story implementation complete.

[K] Keep lock (you'll address review feedback)
[R] Release lock (others can pick up review fixes)

Choice:
```

```javascript
IF choice == 'R':
  await release_lock(story_key)
  output: "✅ Lock released"
ELSE:
  output: "ℹ️ Lock retained until story approved"
```

### 6. Display Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ GITHUB SYNC COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Story:** {{story_key}}
**Issue:** #{{issue_number}} → status:in-review
**PR:** #{{pr_number}}
**URL:** {{pr_url}}

**What Happens Next:**
1. PO reviews PR in GitHub
2. PO runs /approve-story to sign off
3. PR merged, issue closed, lock released

**View in GitHub:**
- Issue: https://github.com/{{github_owner}}/{{github_repo}}/issues/{{issue_number}}
- PR: {{pr_url}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Continue to Summary

Load and execute `{nextStepFile}`.

## ERROR HANDLING

**Network failure:**
```javascript
TRY:
  // All GitHub operations
CATCH (network_error):
  output: "⚠️ GitHub sync failed - network issue"
  output: "   Changes committed locally"
  output: "   Sync manually when network restored:"
  output: "   - Create PR: gh pr create"
  output: "   - Update issue: Use GitHub UI"
  // Continue to summary - local commit is safe
```

**API rate limit:**
```javascript
IF error.status == 403 AND error.message.includes("rate limit"):
  output: "⚠️ GitHub API rate limited"
  output: "   Wait a few minutes and run /sync-to-github"
  // Continue - not a blocker
```

## QUALITY GATE

Before proceeding:
- [x] Commit created (from step-06)
- [ ] PR created or existing PR found
- [ ] Issue updated to in-review
- [ ] Completion comment added
- [ ] Cache metadata updated

## SUCCESS METRICS

### ✅ SUCCESS
- PR links to issue with "Closes #N"
- Issue status updated
- Developer notified via issue comment
- Cache reflects PR link

### ⚠️ PARTIAL
- PR created but issue not updated
- Network issues (commit is safe)

### ❌ FAILURE
- Critical GitHub operation fails repeatedly
- Should not block story completion (commit exists)
