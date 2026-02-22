---
name: 'workflow-sketch'
description: 'Analyze user-provided sketches (photos, screenshots, wireframes) and translate them into structured page specifications.'
---

# [K] Share Sketches — Interpret User Sketches

**Goal:** Analyze user-provided sketches (photos, screenshots, wireframes) and translate them into structured page specifications.

**When to use:** When the user has sketched something on paper, in a tool, or wants to share visual references for the agent to interpret.

---

## INITIALIZATION

### Agent Dialog Gate

1. Check for pending activity dialogs
2. If none, suggest creating one
3. Load dialog context


## Entry

User provides sketch (image file, photo, or description of sketch).

## Steps

Execute steps in `./steps-k/`:

| Step | File | Purpose |
|------|------|---------|
| 01 | step-01-sketch-analysis.md | Analyze and interpret the sketch |

**Reference data:**
- `./data/guides/SKETCH-TEXT-ANALYSIS-GUIDE.md` — sketch analysis methodology
- `./data/guides/SKETCH-TEXT-QUICK-REFERENCE.md` — quick reference
- `./data/object-types/` — component identification

---

## AFTER COMPLETION

1. Update design log
2. Suggest next action
3. Return to activity menu
