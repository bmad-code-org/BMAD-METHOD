# /start — Session Resume Skill

**Invocation:** `/start` (also called automatically from agent activation files)
**Works for:** any agent (saga, freya, mimir, idunn)

---

## Purpose

Detects whether a previous session was saved for the active agent and offers to resume it. If no state file exists, proceeds silently with the normal activation sequence.

---

## Behavior When Invoked

### 1. Detect Active Agent

Identify which agent is currently active. Look for `_bmad/_state/[agent].md` in the current project repo.

### 2. If State File Found

Display the previous session summary clearly:

```
⏸ Previous session found ([date from Wrapped field])

Where I left off: [content from "Where I Left Off" section]
Next action: [content from "Next Action" section]

Resume where we left off, or start fresh?
```

Wait for the user's response.

**If resume:**
- Read the full state file, including the Context and Open Questions sections
- Jump straight to the Next Action — no scanning, no re-introduction, no status report
- Treat the context as already established — don't re-explain what was already known

**If fresh:**
- Proceed with the normal activation sequence for this agent
- Do not delete the state file (the user may want to refer back to it)

### 3. If State File Not Found

Proceed with the normal activation sequence. Do not mention /start or the absence of a state file — it's irrelevant if there's nothing to resume.

---

## Notes

- The state file is written by `/wrap`. If no `/wrap` was run at the end of the previous session, there will be no file to find.
- The state file lives at `_bmad/_state/[agent].md` relative to the project root.
- On resume, prioritize getting back to work quickly. The user already knows the context — they don't need a recap beyond what's shown in the summary.
