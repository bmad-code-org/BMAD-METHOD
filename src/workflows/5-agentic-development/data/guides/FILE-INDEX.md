# Agentic Development - File Index

**Location**: `src/workflows/5-agentic-development/`

---

## 📁 Complete File Structure

```
agentic-development/
│
├── AGENTIC-DEVELOPMENT-GUIDE.md             ← START HERE (overview & quick reference)
├── workflow.md                               ← Workflow overview with phase links
├── PROTOTYPE-INITIATION-DIALOG.md            ← Conversation scripts for initiation
├── CREATION-GUIDE.md                         ← Original detailed guide (reference)
├── PROTOTYPE-ANALYSIS.md                     ← Dog Week analysis (examples)
│
├── steps-p/                                  ← Micro-step workflow files
│   ├── 1-prototype-setup.md                  ← Phase 1: Environment setup
│   ├── 2-scenario-analysis.md                ← Phase 2: Analyze spec & create views
│   ├── 3-logical-view-breakdown.md           ← Phase 3: Break view into sections
│   ├── 4a-announce-and-gather.md             ← Phase 4a: Announce section
│   ├── 4b-create-story-file.md               ← Phase 4b: Create story file
│   ├── 4c-implement-section.md               ← Phase 4c: Implement code
│   ├── 4d-present-for-testing.md             ← Phase 4d: Present for testing
│   ├── 4e-handle-issue.md                    ← Phase 4e: Fix issues (loop)
│   ├── 4f-handle-improvement.md              ← Phase 4f: Handle improvements (loop)
│   ├── 4g-section-approved.md                ← Phase 4g: Section approved
│   └── 5-finalization.md                     ← Phase 5: Integration test & approval
│
├── templates/
│   ├── work-file-template.yaml               ← Planning document template
│   ├── story-file-template.md                ← Section implementation template
│   ├── page-template.html                    ← Complete HTML page template
│   ├── PROTOTYPE-ROADMAP-template.md         ← Scenario roadmap template
│   ├── demo-data-template.json               ← Demo data structure template
│   └── components/
│       ├── dev-mode.html                     ← Dev mode toggle button
│       ├── dev-mode.js                       ← Dev mode logic (Shift+Click to copy IDs)
│       ├── dev-mode.css                      ← Dev mode styles
│       └── DEV-MODE-GUIDE.md                 ← Dev mode usage guide
│
└── examples/
    └── (Dog Week prototypes as reference)
```

---

## 📚 What Each File Does

### Core Documentation

#### `AGENTIC-DEVELOPMENT-GUIDE.md`
**Purpose**: Complete system overview
**For**: All agents (Freya, Saga)
**Contains**:
- System overview
- Folder structure
- Complete workflow summary
- Key principles
- Quick reference
- Success metrics

**Read this**: To understand the complete system

---

#### `workflow.md`
**Purpose**: Workflow overview with phase navigation
**For**: Freya (primary), other agents (reference)
**Contains**:
- Overview of all phases
- Clear links to step files
- When to use each phase
- What each phase creates

**Read this**: To understand the workflow structure

---

### Step Files

#### `steps-p/1-prototype-setup.md`
**Purpose**: Environment setup instructions
**Contains**: Device compatibility, design fidelity, languages, demo data creation
**Next**: Phase 2

---

#### `steps-p/2-scenario-analysis.md`
**Purpose**: Scenario analysis and view identification
**Contains**: Spec analysis, logical view mapping
**Next**: Phase 3

---

#### `steps-p/3-logical-view-breakdown.md`
**Purpose**: Break view into implementable sections
**Contains**: Section breakdown, work file creation
**Next**: Phase 4

---

#### `steps-p/4a-4g-*.md` (Phase 4 Loop)
**Purpose**: Section-by-section implementation
**Contains**: Announce, create story, implement, test, handle feedback, approve
**Flow**: 4a → 4b → 4c → 4d → [4e/4f loop] → 4g → [next section]

---

#### `steps-p/5-finalization.md`
**Purpose**: Integration test and completion
**Contains**: Final test, quality checklist, next steps
**Next**: New page (Phase 3) or new scenario (Phase 1)

---

### Templates

#### `templates/work-file-template.yaml`
**Purpose**: Planning document
**When to use**: Start of EVERY implementation
**Created**: Once per page at beginning
**Contains**:
- Metadata (page info, device compatibility)
- Design tokens (Tailwind config)
- Page requirements (from spec)
- Demo data needs
- Object ID map
- Section breakdown (4-8 sections)
- Testing checklist

**Use this**: To create work file (plan BEFORE coding)

---

#### `templates/story-file-template.md`
**Purpose**: Section implementation guide
**When to use**: Just-in-time (right before implementing each section)
**Created**: Once per section (4-8 per page)
**Contains**:
- Section goal
- What to build (HTML/JS)
- Tailwind classes to use
- Dependencies
- Acceptance criteria
- Test instructions
- Common issues

**Use this**: To create story file before each section

---

#### `templates/page-template.html`
**Purpose**: Complete HTML page structure
**When to use**: Creating new HTML page
**Created**: Once per page (at start of Section 1)
**Contains**:
- Complete HTML structure
- Tailwind CDN setup
- Tailwind config inline
- Component examples
- Shared script includes

**Use this**: As starting point for new page HTML

---

## 🎯 Which File When?

### Starting New Scenario
1. Read: `workflow.md` (understand phases)
2. Follow: `steps-p/1-prototype-setup.md` (setup)
3. Use: `PROTOTYPE-ROADMAP-template.md` → Create roadmap
4. Use: `demo-data-template.json` → Create demo data

### Starting New Page
1. Follow: `steps-p/2-scenario-analysis.md` (analyze)
2. Follow: `steps-p/3-logical-view-breakdown.md` (break down)
3. Use: `work-file-template.yaml` → Create work file
4. Get approval

### Implementing Each Section
1. Follow: `steps-p/4a-4g-*.md` (loop)
2. Use: `story-file-template.md` → Create story file (just-in-time)
3. Implement in HTML (incrementally)
4. Test
5. Get approval
6. Repeat for next section

### Finishing Page
1. Follow: `steps-p/5-finalization.md` (integration test)
2. Get final approval
3. Choose: New page, new scenario, or done

---

## 📝 Template Usage Summary

| Template | When Created | How Many | Purpose |
|----------|--------------|----------|---------|
| work-file | Start of page | 1 per page | Complete plan |
| story-file | Before each section | 4-8 per page | Section implementation |
| page | Start of Section 1 | 1 per page | HTML structure |
| roadmap | Start of scenario | 1 per scenario | Scenario overview |
| demo-data | Setup scenario | 1 per scenario | Auto-loading data |

---

**All templates and micro-step instructions are ready!**

Next step: Activate Freya and follow `workflow.md` → `steps-p/1-prototype-setup.md`
