# Project Analysis Router

**Purpose**: Route to appropriate analysis file based on project state
**When**: Called AFTER agent presentation is complete

---

## FIRST: Check for Agent Dialog Files (Context Loading)

**Before routing, check for ongoing work:**

1. **Look for dialog files:**
   - Check: `docs/progress/dialog/README.md`
   - Check: `design-process/progress/dialog/README.md`
   - Check: `{{custom_root}}/progress/dialog/README.md`

2. **If dialog files exist:**
   - Read `dialog/progress-tracker.md` for progress overview
   - Check which steps are complete
   - Read relevant dialog files (00-context.md, decisions.md) for conversation history
   - **Context loaded:** You now understand what's been done and where user left off

3. **If dialog files don't exist:**
   - Fresh start, no prior context
   - Proceed with routing as normal

**Why this matters:** Dialog files contain conversation history, decisions made, and progress status. Loading them first ensures you continue work seamlessly rather than starting over.

---

## Check Conditions & Route

**Check these conditions IN ORDER and route to first match:**

### Condition A: Project Outline Exists?

**Check for**: `docs/.wds-project-outline.yaml` OR `.wds-project-outline.yaml`

**If EXISTS** → Route to:  
`analysis-types/outline-based-analysis.md`

**STOP CHECKING. Jump to that file now.**

---

### Condition B: Docs Folder with WDS/WPS2C Structure?

**Check for**: `docs/` folder exists AND has numbered (1-_, 2-_) or letter folders (A-_, B-_)

**If EXISTS** → Route to:  
`analysis-types/folder-based-analysis.md`

**STOP CHECKING. Jump to that file now.**

---

### Condition C: Empty Docs Folder?

**Check for**: `docs/` folder exists BUT is empty

**If EMPTY** → Route to:  
`analysis-types/empty-project-response.md`

**STOP CHECKING. Jump to that file now.**

---

### Condition D: No Docs Folder?

**Check for**: NO `docs/` folder at all

**If NO DOCS** → Route to:  
`analysis-types/new-project-response.md`

**STOP CHECKING. Jump to that file now.**

---

### Condition E: Unknown Structure?

**If**: `docs/` exists but no recognizable pattern

**Route to**:  
`analysis-types/unknown-structure-response.md`

**STOP CHECKING. Jump to that file now.**

---

## Rules

- ✅ Check conditions in order (A → B → C → D → E)
- ✅ Route to FIRST matching condition
- ✅ STOP checking after first match
- ✅ Follow instructions in routed file ONLY

---

**This is a ROUTER. Check → Route → Stop.**
