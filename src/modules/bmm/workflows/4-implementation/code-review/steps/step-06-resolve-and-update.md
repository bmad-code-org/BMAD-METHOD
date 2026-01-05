---
name: 'step-06-resolve-and-update'
description: 'Present findings, fix or create action items, update story and sprint status'
---

# Step 6: Resolve Findings and Update Status

**Goal:** Present findings to user, handle resolution (fix or action items), update story file and sprint status.

---

## AVAILABLE STATE

From previous steps:

- `{story_path}`, `{story_key}`
- `{consolidated_findings}` - Merged findings from step 5
- `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`

---

## STATE VARIABLES (capture now)

- `{fixed_count}` - Number of issues fixed
- `{action_count}` - Number of action items created
- `{new_status}` - Final story status

---

## EXECUTION SEQUENCE

### 1. Present Resolution Options

```markdown
**Code Review Findings for {user_name}**

**Story:** {story_key}
**Total Issues:** {consolidated_findings.count}

{consolidated_findings_table}

---

**What should I do with these issues?**

**[1] Fix them automatically** - I'll update the code and tests
**[2] Create action items** - Add to story Tasks/Subtasks for later
**[3] Walk through** - Discuss each finding individually
**[4] Show details** - Deep dive into specific issues

Choose [1], [2], [3], [4], or specify which issue (e.g., "CF-3"):
```

### 2. Handle User Choice

**Option [1]: Fix Automatically**

1. For each CRITICAL and HIGH finding:
   - Apply the fix in the code
   - Add/update tests if needed
   - Record what was fixed
2. Update story Dev Agent Record → File List if files changed
3. Add "Code Review Fixes Applied" entry to Change Log
4. Set `{fixed_count}` = number of issues fixed
5. Set `{action_count}` = 0 (LOW findings can become action items)

**Option [2]: Create Action Items**

1. Add "Review Follow-ups (AI)" subsection to Tasks/Subtasks
2. For each finding:
   ```
   - [ ] [AI-Review][{severity}] {description} [{location}]
   ```
3. Set `{action_count}` = number of action items created
4. Set `{fixed_count}` = 0

**Option [3]: Walk Through**

For each finding in order:

1. Present finding with full context and code snippet
2. Ask: **[f]ix now / [s]kip / [d]iscuss more**
3. If fix: Apply fix immediately, increment `{fixed_count}`
4. If skip: Note as acknowledged, optionally create action item
5. If discuss: Provide more detail, repeat choice
6. Continue to next finding

After all processed, summarize what was fixed/skipped.

**Option [4]: Show Details**

1. Present expanded details for specific finding(s)
2. Return to resolution choice

### 3. Determine Final Status

Evaluate completion:

**If ALL conditions met:**

- All CRITICAL issues fixed
- All HIGH issues fixed or have action items
- All ACs verified as implemented

Set `{new_status}` = "done"

**Otherwise:**

Set `{new_status}` = "in-progress"

### 4. Update Story File

1. Update story Status field to `{new_status}`
2. Add review notes to Dev Agent Record:

```markdown
## Senior Developer Review (AI)

**Date:** {date}
**Reviewer:** AI Code Review

**Findings Summary:**
- CRITICAL: {count} ({fixed}/{action_items})
- HIGH: {count} ({fixed}/{action_items})
- MEDIUM: {count}
- LOW: {count}

**Resolution:** {approach_taken}

**Files Modified:** {list if fixes applied}
```

3. Update Change Log:

```markdown
- [{date}] Code review completed - {outcome_summary}
```

4. Save story file

### 5. Sync Sprint Status

Check if `{sprint_status}` file exists:

**If exists:**

1. Load `{sprint_status}`
2. Find `{story_key}` in development_status
3. Update status to `{new_status}`
4. Save file, preserving ALL comments and structure

```
 Sprint status synced: {story_key}  {new_status}
```

**If not exists or key not found:**

```
 Sprint status sync skipped (no sprint tracking or key not found)
```

### 6. Completion Output

```markdown
** Code Review Complete!**

**Story:** {story_key}
**Final Status:** {new_status}
**Issues Fixed:** {fixed_count}
**Action Items Created:** {action_count}

{if new_status == "done"}
Code review passed! Story is ready for final verification.
{else}
Address the action items and run another review cycle.
{endif}

---

**Next Steps:**
- Commit changes (if fixes applied)
- Run tests to verify fixes
- Address remaining action items (if any)
- Mark story complete when all items resolved
```

---

## WORKFLOW COMPLETE

This is the final step. The Code Review workflow is now complete.

---

## SUCCESS METRICS

- Resolution options presented clearly
- User choice handled correctly
- Fixes applied cleanly (if chosen)
- Action items created correctly (if chosen)
- Story status determined correctly
- Story file updated with review notes
- Sprint status synced (if applicable)
- Completion summary provided

## FAILURE MODES

- Not presenting resolution options
- Fixing without user consent
- Not updating story file
- Wrong status determination (done when issues remain)
- Not syncing sprint status when it exists
- Missing completion summary
