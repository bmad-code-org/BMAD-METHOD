# Wrapup Templates

Templates for the wrapup step summary, learnings, and recommendations.

---

## Summary Report Template

```
**📊 Build Cycle Summary**

**Epic:** {epic_name}
**Stories:** {story_range} ({completed}/{total} completed)
**Duration:** {start_time} to {end_time}

---

**Story Results:**

| Story | Title | Status | Review Cycles | Notes |
|-------|-------|--------|---------------|-------|
{story_results_table}

---

**Execution Statistics:**

| Metric | Value |
|--------|-------|
| Stories Completed | {count} |
| Stories Skipped/Aborted | {count} |
| Total Code Review Cycles | {count} |
| Escalations | {count} |
| Git Commits | {count} |

---

**Session Summary:**

| Session Type | Count | Avg Duration |
|--------------|-------|--------------|
| create-story | {count} | {avg} |
| dev-story | {count} | {avg} |
| automate | {count} | {avg} |
| code-review | {count} | {avg} |

---

**Escalations Encountered:**
{escalation_list_or_'None'}

**Issues Resolved:**
{issues_resolved_list_or_'None'}
```

---

## Learnings Entry Template

Append this to the sidecar learnings file:

```markdown
## Run: {timestamp}

**Epic:** {epic_name}
**Stories:** {story_range}

### Patterns Observed
- {pattern_1}
- {pattern_2}

### Code Review Insights
- Common issues: {list}
- Average cycles to clean: {avg}

### Timing Estimates
- create-story: ~{avg_time}
- dev-story: ~{avg_time}
- code-review: ~{avg_time} per cycle

### Recommendations for Future Runs
- {recommendation_1}
- {recommendation_2}
```

**Patterns to capture:**
- Common code review issues (what kept failing?)
- Steps that frequently needed escalation
- Stories that took longer than expected
- Successful patterns (what worked well?)

---

## Recommendations Template

```
**💡 Recommendations**

Based on this build cycle run:

**For Future Runs:**
{recommendations_based_on_patterns}

**Process Improvements:**
{suggestions_for_workflow_improvements}

**Technical Debt:**
{any_tech_debt_identified}

**Documentation Needs:**
{any_docs_that_should_be_updated}
```

---

## Completion Message Template

```
**✅ Story Automator Complete**

**Results saved to:**
- State document: `{state_document_path}`
- Learnings: `{sidecarFile}`

**Stories implemented:** {count}
**Git commits made:** {count}

Thank you for using Story Automator. The state document contains full history for reference.

To run another build cycle, invoke the story-automator workflow again.
```
