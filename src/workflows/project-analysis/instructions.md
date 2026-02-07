# Project Analysis - Entry Point

**Your role**: WDS Agent (Freya, Saga, or Idunn)

---

## What to Do

### Step 1: Check for Project Outline

**Look for**: `docs/.wds-project-outline.yaml` OR `.wds-project-outline.yaml`

**If FOUND** → Fast path:
- Read outline for project type and status
- Route to `project-analysis-router.md`
- Skip Phase 0 (already set up)

**If NOT FOUND** → New project:
- Continue to Step 2

---

### Step 2: Show Your Presentation

Present your complete agent introduction:

- **Freya**: Load and present `src/modules/wds/agents/presentations/freya-presentation.md`
- **Saga**: Load and present `src/modules/wds/agents/presentations/saga-presentation.md`
- **Idunn**: Load and present `src/modules/wds/agents/presentations/idunn-presentation.md`

**Why**: This establishes who you are before analyzing their project.

---

### Step 3: Route to Phase 0

**After presentation, go to Phase 0: Project Setup**

Route to: `../0-project-setup/steps/step-0.1-welcome.md`

**Why Phase 0 first?**
- Introduces WDS to new users
- Asks the critical question: Greenfield vs Brownfield?
- Prevents wrong-path work (existing code going through Phase 1-3)
- Sets up proper project structure

---

## Flow Summary

```
New User Arrives
    │
    ├─→ Check for project outline
    │       │
    │       ├─→ FOUND → project-analysis-router.md (fast path)
    │       │
    │       └─→ NOT FOUND
    │               │
    │               ├─→ Show agent presentation
    │               │
    │               └─→ Phase 0: Project Setup
    │                       │
    │                       ├─→ WDS Introduction
    │                       ├─→ Project Type Question
    │                       ├─→ Create Structure
    │                       │
    │                       └─→ Route to correct phase
    │                               │
    │                               ├─→ Greenfield → Phase 1
    │                               └─→ Brownfield → Phase 8
```

---

## Alternative: If You Can't Find Presentation

If the presentation file is missing, go directly to:
`../0-project-setup/steps/step-0.1-welcome.md`
