# /wrap — Session Wrap Skill

**Invocation:** `/wrap`
**Works for:** any agent (saga, freya, mimir, idunn)

---

## Purpose

Saves the current session state to a file in the project repo so the next session can resume exactly where this one left off — no re-scanning, no re-discovering the obvious.

State is stored locally by default and ignored by git. The user can opt in to sharing it via git with one command.

---

## Behavior When Invoked

### 1. Detect Active Agent

Identify which agent is currently active from the agent's own persona and identity. The state file will be named after that agent (e.g., `_bmad/_state/saga.md`, `_bmad/_state/freya.md`).

### 2. Conversational Wrap

Ask the following four questions **one at a time**, waiting for the answer before asking the next. Keep it conversational — this is a closing conversation, not a form.

**Question 1:**
```
What were you working on?
```
(Prompt if needed: which phase, which artifact, where in the process)

**Question 2:**
```
Any open questions or blockers?
```
(Prompt if needed: things that need answers before we can move forward, decisions that are pending, external dependencies)

**Question 3:**
```
What's the very first thing to do next session?
```
(This needs to be specific enough to act on immediately — not "continue the brief", but "finish the competitive landscape section and draft the positioning statement")

**Question 4:**
```
Any context I'd lose if we started fresh?
```
(Prompt if needed: key decisions made, constraints discovered, things the user explained that aren't written down anywhere, approaches ruled out and why)

### 3. Write State File

Write `_bmad/_state/[agent].md` in the current project repo. Overwrite if it already exists.

Use this exact format:

```markdown
# [Agent] — Session State
**Repo:** [repo-folder-name]
**Wrapped:** [YYYY-MM-DD]

## Where I Left Off
[Answer from Question 1]

## Open Questions
[Answer from Question 2 — or "None" if no blockers]

## Next Action
[Answer from Question 3 — specific enough to act on immediately]

## Context
[Answer from Question 4 — key decisions, constraints, anything needed to not re-discover the obvious]
```

### 4. Confirm

Print:
```
State saved to `_bmad/_state/[agent].md`

To preserve across sessions: git add -f _bmad/_state/[agent].md && git push
```

---

## Notes

- The `_bmad/_state/` folder is gitignored by default. The user must explicitly opt in with `git add -f` to share state across machines or with collaborators.
- If the agent can't determine the current project repo, ask the user to confirm which project they're in before writing.
- Do not add a summary or closing remarks after the confirmation — the wrap is complete.
