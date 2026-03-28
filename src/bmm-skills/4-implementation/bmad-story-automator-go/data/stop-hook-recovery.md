# Stop Hook Recovery

**You are reading this because the Stop hook blocked your attempt to stop.**

---

## Decision Matrix

**Find your scenario and follow the action exactly:**

| Scenario | Action | Why |
|----------|--------|-----|
| Just finished a story, more in queue | **CONTINUE** → Process next story | Stopping between stories wastes progress |
| Session completed successfully | **CONTINUE** → Check state, process output | Session done ≠ orchestration done |
| Session failed/errored | **CONTINUE** → Follow retry/fallback strategy | Retries not exhausted yet |
| Feeling uncertain what to do | **CONTINUE** → Check state document, follow step instructions | Uncertainty is not a blocker |
| Want to "check in" with user | **CONTINUE** → User will interrupt if needed | User doesn't want status updates |
| Waiting at a menu for user input | **DECIDE** → Use sub-agent to gather context, make informed decision | Don't block on user, keep moving |
| Multiple valid paths forward | **DECIDE** → Pick the path most likely to finish stories in order | Your job is to finish, not ask |
| Unrecoverable error (all retries exhausted) | **STOP** → Follow stop procedure below | Cannot proceed without intervention |
| External dependency down (API, service) | **RETRY** → Sleep with increasing delay (1m, 2m, 4m, 8m, 16m), max 5 attempts | Often recovers on its own |
| User explicitly requested stop earlier | **STOP** → Follow stop procedure below | Honoring user intent |

---

## Quick Reference

### CONTINUE (Most Scenarios)

1. Read your state document
2. Check `currentStep`, `storyQueue`, `currentStoryId`
3. Resume execution from where you left off
4. Process the next story in queue

### DECIDE (Autonomous Decision Required)

1. Spawn sub-agent to analyze current context
2. Gather: state document, recent session output, story requirements
3. Make the decision most likely to complete stories in order
4. Document decision in state log, then execute
5. **Never wait for user** - your job is to keep moving

### RETRY (External Dependency Issues)

1. Log the failure with timestamp
2. Sleep with exponential backoff: 1m → 2m → 4m → 8m → 16m
3. Retry the operation after each sleep
4. After 5 failed attempts → treat as unrecoverable → STOP

### STOP (Genuinely Unrecoverable)

1. Update state document status to `STOPPED`
2. Delete marker: `rm "{project_root}/.claude/.story-automator-active"`
3. Log WHY you stopped (be specific)
4. Exit cleanly

---

## Stop Hook Messages ≠ User Input

The stop hook fires when Claude pauses, not just when explicitly stopping.

**If you see this while at a decision point:**
- This message is NOT telling you what to choose
- Use a sub-agent to gather context and DECIDE autonomously
- Do NOT wait for user - make the call yourself

---

## Core Principle

**Your job is to finish every story in the correct order.**

Do whatever it takes. Make autonomous decisions. Only stop when genuinely unrecoverable (all retries exhausted, user explicitly requested stop).

---

## Common Mistakes to Avoid

| Mistake | Correct Behavior |
|---------|------------------|
| Stopping to report progress | Continue silently, user sees state doc |
| Stopping after one story completes | Continue to next story |
| Stopping because session errored | Follow retry strategy first |
| Waiting for user at decision points | Decide autonomously, keep moving |
| Stopping on first API/service failure | Retry with exponential backoff (5 attempts) |
| Asking user which path to take | Pick the path that finishes stories in order |
