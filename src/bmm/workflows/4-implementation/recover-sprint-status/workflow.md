# Recover Sprint Status v3.0

<purpose>
Fix sprint-status.yaml when tracking has drifted. Analyzes multiple sources
(story files, git commits, completion reports) to rebuild accurate status.
</purpose>

<philosophy>
**Multiple Evidence Sources, Conservative Updates**

1. Story file quality (size, tasks, checkboxes)
2. Explicit Status: fields in stories
3. Git commits (last 30 days)
4. Autonomous completion reports
5. Task completion rate

Trust explicit Status: fields highest. Require evidence for status changes.
</philosophy>

<config>
name: recover-sprint-status
version: 3.0.0

modes:
  dry-run: {description: "Analysis only, no changes", default: true}
  conservative: {description: "High confidence updates only"}
  aggressive: {description: "Medium+ confidence, infers from git"}
  interactive: {description: "Ask before each batch"}

confidence_levels:
  very_high: {sources: [explicit_status, completion_report]}
  high: {sources: [3+ git_commits, 90% tasks_complete]}
  medium: {sources: [1-2 git_commits, 50-90% tasks_complete]}
  low: {sources: [no_status, no_commits, small_file]}
</config>

<execution_context>
@patterns/hospital-grade.md
</execution_context>

<process>

<step name="analyze_sources" priority="first">
**Scan all evidence sources**

```bash
# Find story files
SPRINT_ARTIFACTS="docs/sprint-artifacts"
STORIES=$(ls $SPRINT_ARTIFACTS/*.md 2>/dev/null | grep -v "epic-")

# Get recent git commits
git log --oneline --since="30 days ago" > /tmp/recent_commits.txt
```

For each story:
1. Read story file, extract Status: field if present
2. Check file size (≥10KB = properly detailed)
3. Count tasks and checkbox completion
4. Search git commits for story references
5. Check for completion reports (.epic-*-completion-report.md)
</step>

<step name="calculate_confidence">
**Determine confidence level for each story**

| Evidence | Confidence | Action |
|----------|------------|--------|
| Explicit Status: done | Very High | Trust it |
| Completion report lists story | Very High | Mark done |
| 3+ git commits + 90% checked | High | Mark done |
| 1-2 commits OR 50-90% checked | Medium | Mark in-progress |
| No commits, <50% checked | Low | Leave as-is |
| File <10KB | Low | Downgrade if done |
</step>

<step name="preview_changes" if="mode == dry-run">
**Show recommendations without applying**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 RECOVERY ANALYSIS (Dry Run)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

High Confidence Updates:
- 2-5-auth: backlog → done (explicit Status:, 3 commits)
- 2-6-profile: in-progress → done (completion report)

Medium Confidence Updates:
- 2-7-settings: backlog → in-progress (2 commits)

Low Confidence (verify manually):
- 2-8-dashboard: no Status:, no commits, <10KB file
```

Exit after preview. No changes made.
</step>

<step name="apply_conservative" if="mode == conservative">
**Apply only high/very-high confidence updates**

For each high+ confidence story:
1. Backup current sprint-status.yaml
2. Use Edit tool to update status
3. Log change

```bash
# Backup
cp $SPRINT_STATUS .sprint-status-backups/sprint-status-recovery-$(date +%Y%m%d).yaml
```

Skip medium/low confidence stories.
</step>

<step name="apply_aggressive" if="mode == aggressive">
**Apply medium+ confidence updates**

Includes:
- Inferring from git commits (even 1 commit)
- Using task completion rate
- Pre-filling brownfield checkboxes

```
⚠️ AGGRESSIVE mode may make incorrect inferences.
   Review results carefully.
```
</step>

<step name="validate_results">
**Verify recovery worked**

```bash
./scripts/sync-sprint-status.sh --validate
```

Should show:
- "✓ sprint-status.yaml is up to date!" (success)
- OR discrepancy count (if issues remain)
</step>

<step name="commit_changes" if="changes_made">
**Commit the recovery**

Use Bash to commit:
```bash
git add docs/sprint-artifacts/sprint-status.yaml
git add .sprint-status-backups/
git commit -m "fix(tracking): Recover sprint-status.yaml - {{mode}} recovery"
```
</step>

</process>

<failure_handling>
**No changes detected:** sprint-status.yaml already accurate.
**Low confidence on known-done stories:** Add Status: field manually, re-run.
**Recovery marks incomplete as done:** Use conservative mode, verify manually.
</failure_handling>

<post_recovery_checklist>
- [ ] Run validation: `./scripts/sync-sprint-status.sh --validate`
- [ ] Review backup in `.sprint-status-backups/`
- [ ] Spot-check 5-10 stories for accuracy
- [ ] Commit changes
- [ ] Document why drift occurred
</post_recovery_checklist>

<success_criteria>
- [ ] All evidence sources analyzed
- [ ] Changes applied based on confidence threshold
- [ ] Validation passes
- [ ] Backup created
</success_criteria>
