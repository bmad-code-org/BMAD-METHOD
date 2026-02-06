---
name: Agentic Development
description: AI-assisted development for non-technical designers using Agent Dialogs and structured collaboration
web_bundle: true
---

# Agentic Development Workflow

**Goal:** Enable non-technical designers to build production-ready code through structured AI collaboration

**Your Role:** Implementation partner guiding step-by-step development with clear feedback protocols and approval gates

---

## WHEN TO USE

- Page specifications are complete and approved
- Ready to build working implementations with AI
- Want iterative development with approval gates

**Skip when:** Specifications incomplete, still sketching, simple one-file changes, or pure exploration.

---

## ESSENTIAL GUIDES (Read Before Starting)

- **[Feedback Protocol](guides/FEEDBACK-PROTOCOL.md)** — Classify feedback before acting (Bug/Quick/Addition/Change)
- **[Session Protocol](guides/SESSION-PROTOCOL.md)** — Read dialog, verify plan, present status before implementing
- **[Execution Principles](guides/EXECUTION-PRINCIPLES.md)** — Document-first, sketch fidelity, plan-then-execute pattern

**Process Guides:**
- [Agentic Development Guide](guides/AGENTIC-DEVELOPMENT-GUIDE.md)
- [Creation Guide](guides/CREATION-GUIDE.md)
- [Prototype Initiation Dialog](guides/PROTOTYPE-INITIATION-DIALOG.md)
- [Prototype Analysis](guides/PROTOTYPE-ANALYSIS.md)
- [File Index](guides/FILE-INDEX.md)

---

## THE 5 PHASES

### Phase 1: Prototype Setup (one-time per scenario)
Set up prototype environment and folder structure.
**Go to:** [steps-c/1-prototype-setup.md](steps-c/1-prototype-setup.md)

### Phase 2: Scenario Analysis (one-time per scenario)
Analyze all scenario steps and identify logical views.
**Go to:** [steps-c/2-scenario-analysis.md](steps-c/2-scenario-analysis.md)

### Phase 3: Logical View Selection & Breakdown (per view)
Identify objects and break view into sections.
**Go to:** [steps-c/3-logical-view-breakdown.md](steps-c/3-logical-view-breakdown.md)

### Phase 4: Section Story & Implementation Loop (per section)

| Step | Task | File |
|------|------|------|
| 4a | Announce & Gather | [4a-announce-and-gather.md](steps-c/4a-announce-and-gather.md) |
| 4b | Create Story File | [4b-create-story-file.md](steps-c/4b-create-story-file.md) |
| 4c | Implement Section | [4c-implement-section.md](steps-c/4c-implement-section.md) |
| 4d | Present for Testing | [4d-present-for-testing.md](steps-c/4d-present-for-testing.md) |
| 4e | Handle Issue | [4e-handle-issue.md](steps-c/4e-handle-issue.md) |
| 4f | Handle Improvement | [4f-handle-improvement.md](steps-c/4f-handle-improvement.md) |
| 4g | Section Approved | [4g-section-approved.md](steps-c/4g-section-approved.md) |

**Flow:** 4a → 4b → 4c → 4d → [4e/4f if needed → 4d] → 4g → [next section]

### Phase 5: Finalization (per view)
Integration test all states and final approval.
**Go to:** [steps-c/5-finalization.md](steps-c/5-finalization.md)

---

## CRITICAL RULES

- **ALWAYS** complete Phase 1 setup before starting
- **ALWAYS** analyze scenario before selecting views
- **ALWAYS** use section-by-section approach (Phase 4 loop)
- **ALWAYS** get approval before moving to next section
- **ALWAYS** create story files just-in-time (not upfront)

---

## OUTPUT

```
[Scenario]-Prototype/
├── [View].html files (one per logical view)
├── shared/ (shared code)
├── components/ (reusable components)
├── pages/ (page-specific scripts)
├── data/ (demo data JSON)
├── stories/ (section dev files, created just-in-time)
├── work/ (planning files)
└── PROTOTYPE-ROADMAP.md
```

---

## FIRST STEP

Load, read and execute `steps-c/1-prototype-setup.md` to begin.
