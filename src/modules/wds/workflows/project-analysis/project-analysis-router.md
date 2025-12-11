# Project Analysis Router

**Purpose**: Route to appropriate analysis file based on project state  
**When**: Called AFTER agent presentation is complete

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
