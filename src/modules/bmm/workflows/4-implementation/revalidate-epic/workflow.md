# Revalidate Epic v3.0 - Batch Story Revalidation

<purpose>
Batch revalidate all stories in an epic using parallel agents (semaphore pattern).
Clears checkboxes, verifies against codebase, re-checks verified items.
</purpose>

<philosophy>
**Parallel Verification, Continuous Worker Pool**

- Spawn up to N workers, refill as each completes
- Each story gets fresh context verification
- Aggregate results into epic-level health score
- Optionally fill gaps found during verification
</philosophy>

<config>
name: revalidate-epic
version: 3.0.0

defaults:
  max_concurrent: 3
  fill_gaps: false
  continue_on_failure: true
  create_epic_report: true
  update_sprint_status: true
</config>

<execution_context>
@patterns/verification.md
@patterns/hospital-grade.md
@revalidate-story/workflow.md
</execution_context>

<process>

<step name="load_epic_stories" priority="first">
**Find all stories for the epic**

```bash
EPIC_NUMBER="{{epic_number}}"
[ -n "$EPIC_NUMBER" ] || { echo "ERROR: epic_number required"; exit 1; }

# Filter stories from sprint-status.yaml
grep "^${EPIC_NUMBER}-" docs/sprint-artifacts/sprint-status.yaml
```

Use Read tool on sprint-status.yaml. Filter stories starting with `{epic_number}-`.
Exclude epics and retrospectives.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 EPIC {{epic_number}} REVALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stories Found: {{count}}
Mode: {{fill_gaps ? "Verify & Fill Gaps" : "Verify Only"}}
Max Concurrent: {{max_concurrent}} agents
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Use AskUserQuestion: Proceed with revalidation? (yes/no)
</step>

<step name="spawn_worker_pool">
**Initialize semaphore pattern for parallel revalidation**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Starting Parallel Revalidation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Initialize state:
- story_queue = epic_stories
- active_workers = {}
- completed_stories = []
- failed_stories = []

Fill initial worker slots (up to max_concurrent):

```
Task({
  subagent_type: "general-purpose",
  description: "Revalidate story {{story_key}}",
  prompt: `
Execute revalidate-story workflow for {{story_key}}.

<execution_context>
@revalidate-story/workflow.md
</execution_context>

Parameters:
- story_file: {{story_file}}
- fill_gaps: {{fill_gaps}}

Return verification summary with verified_pct, gaps_found, gaps_filled.
`,
  run_in_background: true
})
```
</step>

<step name="maintain_worker_pool">
**Keep workers running until all stories done**

While active_workers > 0 OR stories remaining in queue:

1. Poll for completed workers (non-blocking with TaskOutput)
2. When worker completes:
   - Parse verification results
   - Add to completed_stories
   - If more stories in queue: spawn new worker in that slot
3. Display progress every 30 seconds:

```
📊 Progress: {{completed}} completed, {{active}} active, {{queued}} queued
```
</step>

<step name="aggregate_results">
**Generate epic-level summary**

Calculate totals across all stories:
- epic_verified = sum of verified items
- epic_partial = sum of partial items
- epic_missing = sum of missing items
- epic_verified_pct = (verified / total) × 100

Group stories by health:
- Complete (≥95% verified)
- Mostly Complete (80-94%)
- Partial (50-79%)
- Incomplete (<50%)
</step>

<step name="display_summary">
**Show epic revalidation results**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 EPIC {{epic_number}} REVALIDATION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Stories: {{count}}
Completed: {{completed_count}}
Failed: {{failed_count}}

Epic-Wide Verification:
- ✅ Verified: {{verified}}/{{total}} ({{pct}}%)
- 🔶 Partial: {{partial}}/{{total}}
- ❌ Missing: {{missing}}/{{total}}

Epic Health Score: {{epic_verified_pct}}/100

{{#if pct >= 95}}
✅ Epic is COMPLETE and verified
{{else if pct >= 80}}
🔶 Epic is MOSTLY COMPLETE
{{else if pct >= 50}}
⚠️ Epic is PARTIALLY COMPLETE
{{else}}
❌ Epic is INCOMPLETE (major rework needed)
{{/if}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
</step>

<step name="update_tracking" if="update_sprint_status">
**Update sprint-status with revalidation results**

Use Edit tool to add comment to epic entry:
```
epic-{{epic_number}}: done  # Revalidated: {{pct}}% verified ({{timestamp}})
```
</step>

</process>

<failure_handling>
**Worker fails:** Log error, refill slot if continue_on_failure=true.
**All stories fail:** Report systemic issue, halt batch.
**Story file missing:** Skip with warning.
</failure_handling>

<success_criteria>
- [ ] All epic stories processed
- [ ] Results aggregated
- [ ] Epic health score calculated
- [ ] Sprint status updated (if enabled)
</success_criteria>
