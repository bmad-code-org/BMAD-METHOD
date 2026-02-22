# Dialog Template Usage

## Quick Start

**Copy to project:**
```bash
cp -r workflows/1-project-brief/templates/project-brief-dialog projects/{{slug}}/dialog
```

**Update as you progress:**
- Complete each file when the corresponding PB step finishes
- Update README.md progress tracker
- Append to decisions.md whenever key decisions are made

---

## What to Capture

### DO:
- Key questions + user responses (not full transcript)
- Signal-based follow-ups that revealed insights
- Reflection checkpoint (synthesis + confirmation + corrections)
- Final outputs (vision, positioning, etc.)
- WHY decisions were made

### DON'T:
- Verbatim transcripts
- Procedural agent actions
- Implementation details
- Repetitive exchanges

---

## Mandatory Checkpoints

**Document EVERY reflection:**
1. Agent's synthesis (2-3 sentences)
2. User confirmed or corrected?
3. What was misunderstood? (if corrected)

---

## Integration with Steps

**Each step file should mandate:**

```markdown
## Agent Dialog Update

Before marking complete:
1. Update `dialog/{{step}}-{{name}}.md`
2. Document reflection checkpoint
3. Record final synthesis
4. Mark complete in `dialog/README.md`
```

---

## File Sizes

All dialog files: 65-86 lines (well under 100-line target)

---

## Agent Session Dialogs (Meta-Level)

**For multi-session work**, agents should maintain their own session dialog separate from project dialogs.

**Location:** `{{root_folder}}/_progress/agent-dialogs/{{session-date}}-{{agent-name}}-{{task}}.md`

**Structure Pattern:**

```markdown
# Agent Dialog: {{Task Name}}

**Date:** {{date}}
**Agent:** {{agent name}}
**Project:** {{project name}}

---

## CURRENT PLAN

**{{Overall objective}}**

1. ✅ Task 1 name
2. ✅ Task 2 name
3. ⏳ Task 3 name (in progress)
4. ⬜ Task 4 name
5. ⬜ Task 5 name

**Ultimate Goal:** {{End state description}}

---

## ⏳ CURRENT WORK

### Task 3: {{Task name}}

**Objective:** {{What you're doing now}}

**Sub-tasks:**
- {{Specific thing 1}}
- {{Specific thing 2}}
- {{Specific thing 3}}

**Status:** {{Current status}}

---

## 🎯 UPCOMING WORK

### Task 4: {{Next task}}

**Purpose:** {{Why this matters}}

**Implementation:** {{How you'll do it}}

---

## ✅ COMPLETED WORK

*(Reverse chronological order - latest first)*

---

### Task 2: {{Task name}} ({{date}})

**Objective:** {{What was done}}

**Key achievements:**
- {{Achievement 1}}
- {{Achievement 2}}

**Files modified:** {{File count and names}}

**Status:** Complete

---

### Task 1: {{Task name}} ({{date}})

**Objective:** {{What was done}}

[Details...]
```

**Navigation Benefits:**
- Easy to see progress at a glance
- Clear separation: current vs upcoming vs completed
- Latest work always at top of completed section
- Ultimate goal always visible

**Update Protocol:**
1. Complete current task
2. Update agent dialog with changes
3. Show git diff to user
4. Move task from CURRENT WORK to top of COMPLETED WORK
5. Move next task from UPCOMING WORK to CURRENT WORK
6. Update CURRENT PLAN checkboxes (✅/⏳/⬜)

---

## Purpose

Create transparent record of discovery conversations so future agents (and humans) understand WHY decisions were made, not just WHAT was decided.
