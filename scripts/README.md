## BMAD Automation Scripts

This directory contains **optional automation utilities** for running BMAD workflows via external agent CLIs.

Scripts in this folder **do not modify** core BMAD roles, prompts, or methodology.  
They are reference implementations and power-user tools.

---

## `yolo_cursor.py`

Runs a full end-to-end BMAD development workflow for one or more stories using the **Cursor CLI (`cursor-agent`)**.

The workflow includes **12 explicit steps**:

1. SM creates the story  
2. SM validates the story draft  
3. SM optionally applies recommendations (logged even if skipped)  
4. TEA generates ATDD  
5. Dev implements the story  
6. Dev verifies the ATDD checklist  
7. Dev runs tests and fixes issues (pre-review)  
8. Dev performs first auto-fixing code review  
9. Dev performs second auto-fixing code review  
10. Dev runs tests and fixes issues (post-review)  
11. SM updates development status  
12. Dev provides final handoff notes

All steps are logged to Markdown files.

---

### Requirements

- Python 3.9+
- Cursor installed with `cursor-agent` available on `PATH`
- `pyyaml`

```bash
pip install pyyaml
```

> Note: `--list-backlog` only reads YAML and does not require Cursor. All workflow execution commands require `cursor-agent`.

---

### Usage

```bash
# Run first backlog story
python scripts/yolo_cursor.py

# List backlog stories
python scripts/yolo_cursor.py --list-backlog

# Run a specific story
python scripts/yolo_cursor.py --story 2-4-user-login-frontend

# Interactive selection
python scripts/yolo_cursor.py --pick

# Batch run multiple stories
python scripts/yolo_cursor.py --batch 2-4-user-login-frontend,2-5-auth-context
```

---

### Logs

Logs are written to:

```
docs/sprint-artifacts/yolo-logs/<story-id>/
```

Each step produces a Markdown file, plus a `RESULT.md` summary.

---

### Reliability Features

- **Step timing** is recorded in every step log.
- **Heartbeat output** is printed every minute while a step is running.
- **Global step timeout** (10 minutes by default) prevents infinite hangs.
- On failure/timeout/Ctrl+C, an additional `*_ERROR.md` log is written for the step.
- **Resume support:** if step logs already exist for a story, the script resumes **after the last successful step**.

---

### Scope & Notes

- Cursor CLI only (for now)
- Sequential execution (no parallelism)
- No changes to BMAD core prompts or roles
- Designed as a reference pattern for future automation scripts

---