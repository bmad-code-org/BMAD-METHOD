# Migrate to GitHub v3.0 - Production-Grade Story Migration

<purpose>
Migrate BMAD stories to GitHub Issues with full safety guarantees.
Idempotent, atomic, verified, resumable, and reversible.
</purpose>

<philosophy>
**Reliability First, Data Integrity Over Speed**

- Idempotent: Can re-run safely (checks for duplicates)
- Atomic: Each story fully succeeds or rolls back
- Verified: Reads back each created issue
- Resumable: Saves state after each story
- Reversible: Creates rollback manifest
</philosophy>

<config>
name: migrate-to-github
version: 3.0.0

modes:
  dry-run: {description: "Preview only, no changes", default: true}
  execute: {description: "Actually create issues"}
  verify: {description: "Double-check migration accuracy"}
  rollback: {description: "Close migrated issues"}

defaults:
  update_existing: false
  halt_on_critical_error: true
  save_state_after_each: true
  max_retries: 3
  retry_backoff_ms: [1000, 3000, 10000]

labels:
  - "type:story"
  - "story:{{story_key}}"
  - "status:{{status}}"
  - "epic:{{epic_number}}"
  - "complexity:{{complexity}}"
</config>

<execution_context>
@patterns/hospital-grade.md
</execution_context>

<process>

<step name="preflight_checks" priority="first">
**Verify all prerequisites before ANY operations**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ PRE-FLIGHT SAFETY CHECKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**1. Verify GitHub MCP access:**
```
Call: mcp__github__get_me()
If fails: HALT - Cannot proceed without GitHub API access
```

**2. Verify repository access:**
```
Call: mcp__github__list_issues(owner, repo, per_page=1)
If fails: HALT - Repository not accessible
```

**3. Verify local files exist:**
```bash
[ -f "docs/sprint-artifacts/sprint-status.yaml" ] || { echo "HALT"; exit 1; }
```

**4. Check for existing migration:**
- If state file exists: offer Resume/Fresh/View/Delete
- If resuming: load already-migrated stories, filter from queue

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PRE-FLIGHT CHECKS PASSED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
</step>

<step name="dry_run" if="mode == dry-run">
**Preview migration plan without making changes**

For each story:
1. Search GitHub for existing issue with label `story:{{story_key}}`
2. If exists: mark as "Would UPDATE" or "Would SKIP"
3. If not exists: mark as "Would CREATE"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DRY-RUN SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Would CREATE: {{create_count}} new issues
Would UPDATE: {{update_count}} existing issues
Would SKIP: {{skip_count}}

Estimated API Calls: ~{{total_calls}}
Rate Limit Impact: Safe (< 1000 calls)

⚠️ This was a DRY-RUN. No issues created.
To execute: /migrate-to-github mode=execute
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
</step>

<step name="execute" if="mode == execute">
**Perform migration with atomic operations**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ EXECUTE MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Final confirmation:**
```
Type "I understand and want to proceed" to continue:
```

Initialize migration state and rollback manifest.

For each story:

**1. Check if exists (idempotent):**
```
Search: label:story:{{story_key}}
If exists AND update_existing=false: SKIP
```

**2. Generate issue body:**
```markdown
**Story File:** [{{story_key}}.md](path)
**Epic:** {{epic_number}}

## Business Context
{{parsed.businessContext}}

## Acceptance Criteria
{{#each ac}}
- [ ] {{this}}
{{/each}}

## Tasks
{{#each tasks}}
- [ ] {{this}}
{{/each}}
```

**3. Create/update with retry and verification:**
```
attempt = 0
WHILE attempt < max_retries:
  TRY:
    result = mcp__github__issue_write(create/update)
    sleep 2 seconds  # GitHub eventual consistency

    verification = mcp__github__issue_read(issue_number)
    IF verification.title != expected:
      THROW "Verification failed"

    SUCCESS - add to rollback manifest
    BREAK

  CATCH:
    attempt++
    IF attempt < max_retries:
      sleep backoff_ms[attempt]
    ELSE:
      FAIL - add to issues_failed
```

**4. Save state after each story**

**5. Progress updates every 10 stories:**
```
📊 Progress: {{index}}/{{total}}
   Created: {{created}}, Updated: {{updated}}, Failed: {{failed}}
```
</step>

<step name="verify" if="mode == verify">
**Double-check migration accuracy**

For each migrated story:
1. Fetch issue from GitHub
2. Verify title, labels, AC count match
3. Report mismatches

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 VERIFICATION RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Verified Correct: {{verified}}
Warnings: {{warnings}}
Failures: {{failures}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
</step>

<step name="rollback" if="mode == rollback">
**Close migrated issues (GitHub API doesn't support delete)**

Load rollback manifest. For each created issue:
```
mcp__github__issue_write({
  issue_number: {{number}},
  state: "closed",
  labels: ["migrated:rolled-back"],
  state_reason: "not_planned"
})

mcp__github__add_issue_comment({
  body: "Issue closed - migration was rolled back."
})
```
</step>

<step name="generate_report">
**Create comprehensive migration report**

Write to: `docs/sprint-artifacts/github-migration-{{timestamp}}.md`

Include:
- Executive summary
- Created/updated/failed issues
- GitHub URLs for each issue
- Rollback instructions
- Next steps
</step>

<step name="final_summary">
**Display completion status**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ MIGRATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: {{total}} stories
Created: {{created}}
Updated: {{updated}}
Failed: {{failed}}
Success Rate: {{success_pct}}%

View in GitHub:
https://github.com/{{owner}}/{{repo}}/issues?q=label:type:story

Rollback Manifest: {{rollback_path}}
State File: {{state_path}}

Next Steps:
1. Verify: /migrate-to-github mode=verify
2. Enable GitHub sync in workflow.yaml
3. Share Issues URL with Product Owner
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
</step>

</process>

<failure_handling>
**GitHub MCP unavailable:** HALT - Cannot proceed.
**Repository not accessible:** HALT - Check permissions.
**Issue create fails:** Retry with backoff, then fail story.
**Verification fails:** Log warning, continue.
**All stories fail:** Report systemic issue, HALT.
</failure_handling>

<success_criteria>
- [ ] Pre-flight checks passed
- [ ] All stories processed
- [ ] Issues verified after creation
- [ ] State and rollback manifest saved
- [ ] Report generated
</success_criteria>
