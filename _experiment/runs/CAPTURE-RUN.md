# Capture QD2 Run Log

**Read and follow these instructions after completing a QD2 test run.**

---

## 1. Save the Raw Log

Copy the most recent JSONL conversation log to this directory:

```bash
# Find the most recent conversation log
ls -lt ~/.claude/projects/-Users-alex-src-bmad-quick-flow-redesign/*.jsonl | head -1

# Copy it with the naming convention: YYYY-MM-DD-<short-slug>.jsonl
cp <path-from-above> _experiment/runs/YYYY-MM-DD-<short-slug>.jsonl
```

The slug should be a few hyphenated words capturing what the run attempted (e.g., `eliminate-apc-menu-gates`, `add-plan-review-to-task01`).

## 2. Summarize the Run

Create a matching `.md` file with the same name. Use this structure:

```markdown
# QD2 Run: <Title>

**Date:** YYYY-MM-DD
**Workflow:** quick-dev2 (experimental)
**Branch:** <branch name>

---

## Intent

What was requested? Quote the user's actual words or paraphrase closely.

## Routing

- **Route chosen:** One-shot / Plan-code-review / Full BMM
- **Rationale:** Why did the agent pick this route?

## What Happened

Narrative of what the agent actually did. Focus on:
- Did it follow the workflow plumbing? (config loading, step transitions)
- Did it capture intent correctly?
- Where did it drift, assume, or get things wrong?
- What clarifying questions did it ask (or fail to ask)?

## Diff Produced

Summarize the actual changes made (or note if no changes were made).

## Human Notes

<LEAVE BLANK — human fills this in>

## Observations

Bullet list of patterns, surprises, or insights worth tracking.
```

## 3. Get Human Notes

Ask the human: **"Any notes on this run? How did it feel, what went wrong, what surprised you?"**

Write their response into the **Human Notes** section verbatim or lightly edited for clarity. Do not summarize away their meaning.

## 4. Verify

Confirm both files exist:
- `_experiment/runs/YYYY-MM-DD-<slug>.jsonl`
- `_experiment/runs/YYYY-MM-DD-<slug>.md`
