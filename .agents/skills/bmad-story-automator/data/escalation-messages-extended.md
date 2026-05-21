# Escalation Message Templates (Extended)

## 5. Unexpected Error

**Escalation message:**
```
🔔 DECISION NEEDED: Unexpected Error

Story: {story_name}
Step: {step_name}
Error: {error_message}

An unexpected error occurred during orchestration.

Options:
[1] Retry current step
[2] Skip current step
[3] Abort story and continue with next
[4] Pause orchestration for investigation

Select option:
```

---

## 6. Dependency Conflict

**Escalation message:**
```
🔔 DECISION NEEDED: Potential Dependency Conflict

Stories in parallel: {story_list}
Detected conflict: {conflict_description}

These stories may have conflicting changes.

Options:
[1] Continue in parallel (accept risk)
[2] Run sequentially instead
[3] Pause for manual review

Select option:
```

---

## 7. Dev-Story Implementation Failure

**Pre-escalation behavior:**
1. Check blocking status (conservative if uncertain)
2. If BLOCKING: retry up to 3 times
3. If NOT BLOCKING: retry once

**Escalation message:**
```
🔔 DECISION NEEDED: Dev-Story Implementation Failure

Story: {story_name}
Step: dev-story
Attempts: {attempt_count}
Blocking: {yes/no} (affects stories: {list or "none"})

Latest error:
{error_summary}

Options:
[1] Retry dev-story - Spawn new session to fix
[2] Manual fix - Pause orchestration so you can fix it
[3] View session output - See full output
[4] Skip story - Move to next (only if not blocking)
[5] Abort orchestration - Stop entire build cycle

Select option:
```

**Note:** Option [4] only valid if story is NOT blocking.
