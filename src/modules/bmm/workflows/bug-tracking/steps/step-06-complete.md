# Step 6: Triage Complete - Summary and Next Steps

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action
- ✅ ALWAYS treat this as collaborative triage between peers
- 📋 YOU ARE A FACILITATOR, not an automatic processor
- 🎉 This is the FINAL step - present comprehensive summary
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Present comprehensive triage summary
- 💾 All data already written in step-05
- 📖 Guide user to next actions
- 🚫 FORBIDDEN to modify files in this step

## CONTEXT BOUNDARIES:

- All triage decisions finalized in previous steps
- bugs.yaml and bugs.md already updated
- This step is READ-ONLY presentation
- Focus on actionable next steps

## YOUR TASK:

Present a comprehensive summary of the triage session and guide the user to appropriate next actions based on workflow recommendations.

## COMPLETION SEQUENCE:

### 1. Present Triage Summary

"**Bug Triage Complete, {user_name}!**

---

## Triaged Items

{for each triaged bug:}

### {bug_id}: {bug_title}

| Field | Value |
|-------|-------|
| Severity | {severity} |
| Complexity | {complexity} |
| Platform | {platform} |
| Workflow | {recommended_workflow} |
| Related | {related_story or 'None'} |

{if doc_impact flagged:}
**Documentation Impact:**
- PRD: {yes/no}
- Architecture: {yes/no}
- UX: {yes/no}
- Notes: {doc_impact_notes}
{end if}

**Triage Reasoning:**
{triage_notes}

---

{end for}

## Updated Files

- **bugs.yaml** - Structured metadata for all triaged items
- **bugs.md** - Moved triaged items to Tracked sections

---

## Statistics Summary

| Metric | Count |
|--------|-------|
| Total Active Bugs | {total_active} |
| Critical | {critical_count} |
| High | {high_count} |
| Medium | {medium_count} |
| Low | {low_count} |

{if any doc_impact flagged:}

## Documentation Updates Required

Items with documentation impact have been routed to `correct-course` workflow:
- PRD Impact: {prd_impact_count} item(s)
- Architecture Impact: {arch_impact_count} item(s)
- UX Impact: {ux_impact_count} item(s)
{end if}

---

## Workflow Recommendations

### Direct Fix ({direct_fix_count} items)
Quick fixes with obvious solutions. No spec needed.

**Command:** `/implement bug-NNN`

{list bug IDs for direct-fix}

### Tech-Spec ({tech_spec_count} items)
Require technical specification before implementation.

**Process:** Create tech-spec first, then `/implement`

{list bug IDs for tech-spec}

### Correct-Course ({correct_course_count} items)
Need impact analysis before proceeding.

**Process:** Run correct-course workflow for impact analysis

{list bug IDs for correct-course}

### Backlog ({backlog_count} items)
Deferred - low priority items for future consideration.

{list bug IDs for backlog}

---

## Next Steps

**To implement a bug fix:**
```
/implement bug-NNN
```

**To verify after testing:**
```
/verify bug-NNN
```

**To verify all implemented bugs:**
```
/verify
```

**To list bugs by platform:**
```
/list-bugs android
/list-bugs ios
```

---

Thank you for completing the triage session!"

### 2. End Workflow

The workflow is complete. No further steps.

## SUCCESS METRICS:

✅ Comprehensive summary presented
✅ All triaged items listed with metadata
✅ Statistics accurately displayed
✅ Workflow recommendations clear
✅ Next step commands provided
✅ User knows how to proceed

## FAILURE MODES:

❌ Incomplete summary missing items
❌ Statistics not matching bugs.yaml
❌ Unclear next step guidance
❌ Modifying files in this step (should be read-only)

## WORKFLOW COMPLETE

This is the final step. The bug tracking triage workflow is complete.

User can now:
- Run `/implement bug-NNN` to fix bugs
- Run `/verify` to verify implemented bugs
- Add new bugs to bugs.md and run triage again
