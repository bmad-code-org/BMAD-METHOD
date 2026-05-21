# Escalation Triggers

**Purpose:** Conditions that require human decision and cannot be resolved autonomously.

## Escalation Categories

### CRITICAL Escalations
**Definition:** Automation CANNOT proceed - requires human decision.

**Behavior:**
1. Delete marker file: `rm "{marker_file}"`
2. Update state: set status to PAUSED in state document
3. Present options (stop hook won't interfere)
4. Wait for user input
5. On resume: recreate marker, set IN_PROGRESS, continue

**Triggers in this category:**
- Code Review Loop Exceeded (#1)
- Session Spawn Failure (#3)
- Git Commit Failure (#4)
- Unexpected Error (#5)
- Dev-Story Implementation Failure (#7) when blocking + retries exhausted
- Session Incomplete (#8) - session finished but workflow not verified complete (v2.2)

### PREFERENCE Escalations
**Definition:** Automation COULD proceed either way - user chooses direction.

**Behavior:**
1. Keep marker file (automation still "active")
2. Present options
3. Act on selection immediately

**Triggers in this category:**
- Cannot Parse Session Output (#2)
- Dependency Conflict (#6)
- Dev-Story Implementation Failure (#7) when NOT blocking

---

## Escalation Protocol

When an escalation trigger is hit:
1. Categorize: CRITICAL or PREFERENCE
2. If CRITICAL: delete marker, set status to PAUSED
3. Notify: sound/notification
4. Present: situation + numbered options
5. Wait: halt until user responds
6. Log: record decision in action log
7. Resume: if CRITICAL, recreate marker, set IN_PROGRESS, continue

---

## Trigger Index

Each trigger includes its escalation message template in:
- `data/escalation-messages-core.md` (Triggers 1-4)
- `data/escalation-messages-extended.md` (Triggers 5-7)

### 1. Code Review Loop Exceeded (CRITICAL)
**Trigger:** Code review has run 5 cycles without clean status.
**See:** `escalation-messages-core.md#1-code-review-loop-exceeded`

### 2. Cannot Parse Session Output (PREFERENCE)
**Trigger:** Output doesn't match success/failure patterns.
**See:** `escalation-messages-core.md#2-cannot-parse-session-output`

### 3. Session Spawn Failure (CRITICAL)
**Trigger:** T-Mux session failed to spawn after retries.
**See:** `escalation-messages-core.md#3-session-spawn-failure`

### 4. Git Commit Failure (CRITICAL)
**Trigger:** Git commit failed (conflict, hook error, etc.).
**See:** `escalation-messages-core.md#4-git-commit-failure`

### 5. Unexpected Error (CRITICAL)
**Trigger:** Unhandled exception or unexpected condition.
**See:** `escalation-messages-extended.md#5-unexpected-error`

### 6. Dependency Conflict (PREFERENCE)
**Trigger:** Parallelism detects potential conflict.
**See:** `escalation-messages-extended.md#6-dependency-conflict`

### 7. Dev-Story Implementation Failure (CRITICAL or PREFERENCE)
**Trigger:** dev-story completes with errors after retries.
**See:** `escalation-messages-extended.md#7-dev-story-implementation-failure`

### 8. Session Incomplete (CRITICAL) [v2.2]
**Trigger:** `story-automator monitor-session` returns `final_state: "incomplete"` **after maxCycles exhausted**
**Condition:** Session finished (idle/exited) but workflow verification failed across all retry attempts.
**Typical cause:** Codex code-review session ended without updating sprint-status.

**Why CRITICAL (not PREFERENCE):**
- Automated retries already exhausted
- Human must decide: manual fix, use Claude, or skip story

**Options:**
1. **[1] Manual Fix** - Update sprint-status.yaml yourself
2. **[2] Run with Claude** - Re-run code-review with Claude agent
3. **[3] Skip Story** - Mark story as skipped and continue
4. **[X] Pause** - Stop orchestration for investigation

**Verification command:**
```bash
"$scripts" orchestrator-helper verify-code-review {story_id}
```

---

## Non-Escalation Conditions

Handled automatically (no escalation):
- Optional step (automate) skipped by override → log and continue
- Session completes with clear success → continue
- Session completes with clear failure → retry once, then escalate if still fails
