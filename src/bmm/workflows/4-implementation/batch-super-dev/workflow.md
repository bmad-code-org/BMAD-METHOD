# Batch Super-Dev v3.0 - Unified Workflow

<purpose>
Interactive story selector for batch implementation. Scan codebase for gaps, select stories, process with super-dev-pipeline, reconcile results.

**AKA:** "Mend the Gap" - Mind the gap between story requirements and reality, then mend it.
</purpose>

<philosophy>
**Gap Analysis First, Build Only What's Missing**

1. Scan codebase to verify what's actually implemented
2. Find the gap between story requirements and reality
3. Build ONLY what's truly missing (no duplicate work)
4. Update tracking to reflect actual completion

Orchestrator coordinates. Agents do implementation. Orchestrator does reconciliation.
</philosophy>

<config>
name: batch-super-dev
version: 3.0.0

modes:
  sequential: {description: "Process one-by-one in this session", recommended_for: "gap analysis"}
  parallel: {description: "Spawn concurrent Task agents", recommended_for: "greenfield batch"}

complexity_routing:
  micro: {max_tasks: 3, max_files: 5, skip_review: true}
  standard: {max_tasks: 15, max_files: 30, full_pipeline: true}
  complex: {min_tasks: 16, keywords: [auth, security, payment, migration], enhanced_review: true}
</config>

<execution_context>
@patterns/hospital-grade.md
@patterns/agent-completion.md
@super-dev-pipeline/workflow.md
</execution_context>

<process>

<step name="load_sprint_status" priority="first">
**Load and parse sprint-status.yaml**

```bash
SPRINT_STATUS="docs/sprint-artifacts/sprint-status.yaml"
[ -f "$SPRINT_STATUS" ] || { echo "ERROR: sprint-status.yaml not found"; exit 1; }
```

Use Read tool on sprint-status.yaml. Extract:
- Stories with status `ready-for-dev` or `backlog`
- Exclude epics (`epic-*`) and retrospectives (`*-retrospective`)
- Sort by epic number, then story number

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 LOADING SPRINT STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If no available stories: report "All stories complete!" and exit.
</step>

<step name="display_stories">
**Display available stories with file status**

For each story:
1. Check if story file exists in `docs/sprint-artifacts/`
2. Try patterns: `story-{epic}.{story}.md`, `{epic}-{story}.md`, `{story_key}.md`
3. Mark status: ✅ exists, ❌ missing, 🔄 already implemented

```markdown
## 📦 Available Stories (N)

### Ready for Dev (X)
1. **17-10** ✅ occupant-agreement-view
2. **17-11** ✅ agreement-status-tracking

### Backlog (Y)
3. **18-1** ❌ [needs story file]

Legend: ✅ ready | ❌ missing | 🔄 done but not tracked
```
</step>

<step name="validate_stories">
**Validate story files have required sections**

For each story with existing file:
1. Read story file
2. Check for 12 BMAD sections (Business Context, Acceptance Criteria, Tasks, etc.)
3. If invalid: mark for regeneration or skip

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 VALIDATING STORY FILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Skip stories with missing files (status ready-for-dev but no file).
</step>

<step name="score_complexity">
**Score story complexity for pipeline routing**

For each validated story:

```bash
# Count tasks
TASK_COUNT=$(grep -c "^- \[ \]" "$STORY_FILE")

# Check for risk keywords
RISK_KEYWORDS="auth|security|payment|encryption|migration|database|schema"
HIGH_RISK=$(grep -ciE "$RISK_KEYWORDS" "$STORY_FILE")
```

**Scoring:**
| Criteria | micro | standard | complex |
|----------|-------|----------|---------|
| Tasks | ≤3 | 4-15 | ≥16 |
| Files | ≤5 | ≤30 | >30 |
| Risk keywords | 0 | low | high |

Store `complexity_level` for each story.
</step>

<step name="get_selection">
**Get user selection**

Use AskUserQuestion:
```
Which stories would you like to implement?

Options:
1. All ready-for-dev stories (X stories)
2. Select specific stories by number
3. Single story (enter key like "17-10")
```

Validate selection against available stories.
</step>

<step name="choose_mode">
**Choose execution mode**

Use AskUserQuestion:
```
How should stories be processed?

Options:
1. Sequential (recommended for gap analysis)
   - Process one-by-one in this session
   - Verify code → build gaps → check boxes → next

2. Parallel (for greenfield batch)
   - Spawn Task agents concurrently
   - Faster but harder to monitor
```

For sequential: proceed to `execute_sequential`
For parallel: proceed to `execute_parallel`
</step>

<step name="execute_sequential" if="mode == sequential">
**Sequential Processing**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 SEQUENTIAL PROCESSING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

For each selected story:

**Step A: Invoke super-dev-pipeline**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Story {{index}}/{{total}}: {{story_key}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Use super-dev-pipeline workflow with:
- mode: batch
- story_key: {{story_key}}
- complexity_level: {{complexity}}

**Step B: Reconcile (orchestrator does this directly)**

After super-dev-pipeline completes:

1. Get what was built:
```bash
git log -3 --oneline | grep "{{story_key}}"
git diff HEAD~1 --name-only | head -20
```

2. Read story file, check off tasks:
```
Use Edit tool: "- [ ]" → "- [x]" for completed tasks
```

3. Fill Dev Agent Record:
```
Use Edit tool to add implementation date, files, notes
```

4. Verify:
```bash
CHECKED=$(grep -c "^- \[x\]" "$STORY_FILE")
[ "$CHECKED" -gt 0 ] || { echo "❌ BLOCKER: Zero tasks checked"; exit 1; }
echo "✅ Reconciled: $CHECKED tasks"
```

5. Update sprint-status.yaml:
```
Use Edit tool: "{{story_key}}: ready-for-dev" → "{{story_key}}: done"
```

**Step C: Next story or complete**
- If more stories: continue loop
- If complete: proceed to `summary`
</step>

<step name="execute_parallel" if="mode == parallel">
**Parallel Processing with Wave Pattern**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 PARALLEL PROCESSING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Wave Configuration:**
- Max concurrent: 3 agents
- Wait for wave completion before next wave

**For each wave:**

1. Spawn Task agents (up to 3 parallel):
```
Task({
  subagent_type: "general-purpose",
  description: "Implement {{story_key}}",
  prompt: `
Execute super-dev-pipeline for story {{story_key}}.

<execution_context>
@super-dev-pipeline/workflow.md
</execution_context>

<context>
Story: [inline story content]
Complexity: {{complexity_level}}
</context>

<success_criteria>
- [ ] All pipeline phases complete
- [ ] Git commit created
- [ ] Return ## AGENT COMPLETE with summary
</success_criteria>
`
})
```

2. Wait for all agents in wave to complete

3. **Orchestrator reconciles each completed story:**
   - Get git diff
   - Check off tasks
   - Fill Dev Agent Record
   - Verify updates
   - Update sprint-status

4. Continue to next wave or summary
</step>

<step name="summary">
**Display Batch Summary**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ BATCH COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Stories processed: {{total}}
Successful: {{success_count}}
Failed: {{fail_count}}

## Results

| Story | Status | Tasks | Commit |
|-------|--------|-------|--------|
| 17-10 | ✅ done | 8/8 | abc123 |
| 17-11 | ✅ done | 5/5 | def456 |

## Next Steps
- Run /bmad:sprint-status to verify
- Review commits with git log
```
</step>

</process>

<failure_handling>
**Story file missing:** Skip with warning, continue to next.
**Pipeline fails:** Mark story as failed, continue to next.
**Reconciliation fails:** Fix with Edit tool, retry verification.
**All stories fail:** Report systemic issue, halt batch.
</failure_handling>

<success_criteria>
- [ ] All selected stories processed
- [ ] Each story has checked tasks (count > 0)
- [ ] Each story has Dev Agent Record filled
- [ ] Sprint status updated for all stories
- [ ] Summary displayed with results
</success_criteria>
