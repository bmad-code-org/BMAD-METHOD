# Interactive Prototype Workflow

**Agent**: Freya WDS Designer Agent  
**Purpose**: Step-by-step guide for creating production-ready interactive prototypes

**Note**: We use "scenario step" instead of "page" - a step can be a full page, a modal, an overlay, a state change, or any UI change that requires a new sketch.

---

## 🎯 Overview

This workflow creates self-contained, production-ready interactive prototypes using:
- ✅ Tailwind CSS (no separate CSS files)
- ✅ Vanilla JavaScript (components in shared folders)
- ✅ Section-by-section implementation (approval gates)
- ✅ Just-in-time story files (created as needed)
- ✅ Demo data auto-loading

---

## 📁 Prototype Folder Structure

```
[Scenario-Number]-[Scenario-Name]-Prototype/
├── [Page].html files (in root)
├── shared/ (ONE COPY of shared code)
├── components/ (ONE COPY of reusable components)
├── pages/ (page-specific scripts if complex)
├── data/ (demo data JSON files)
├── stories/ (section development files - created just-in-time)
├── work/ (planning files)
└── PROTOTYPE-ROADMAP.md
```

---

## 🔄 Workflow Phases

### **Phase 1: Prototype Setup** (one-time per scenario)

**When**: User requests prototypes for a scenario (that already has a specification)

**What**: Set up the prototype environment

**Go to**: `phases/1-prototype-setup.md`

**Creates**:
- ✅ `[Scenario]-Prototype/` folder with complete structure
- ✅ `data/demo-data.json`
- ✅ `PROTOTYPE-ROADMAP.md`
- ✅ All working folders (work/, stories/, shared/, components/, pages/, assets/)

---

### **Phase 2: Scenario Analysis** (one-time per scenario)

**When**: Ready to start building prototypes

**What**: Analyze all scenario steps and identify logical views

**Go to**: `phases/2-scenario-analysis.md`

**Creates**:
- ✅ `work/Logical-View-Map.md` (maps steps to logical views)

---

### **Phase 3: Logical View Selection & Breakdown** (per logical view)

**When**: User selects which logical view to build

**What**: Identify all objects and break into sections

**Go to**: `phases/3-logical-view-breakdown.md`

**Creates**:
- ✅ `work/[View]-Work.yaml` (section breakdown)

---

### **Phase 4: Section Story & Implementation Loop** (iterative)

**When**: Ready to build sections

**What**: For each section - prepare, create story, implement, test, handle feedback, approve

**Steps (micro-tasks)**:
- **4a**: `phases/4a-announce-and-gather.md` - Announce section & gather requirements
- **4b**: `phases/4b-create-story-file.md` - Create focused story file
- **4c**: `phases/4c-implement-section.md` - Implement code following story
- **4d**: `phases/4d-present-for-testing.md` - Present to user with test instructions
- **4e**: `phases/4e-handle-issue.md` - Fix issues (if user reports problems)
- **4f**: `phases/4f-handle-improvement.md` - Implement improvements (if user suggests)
- **4g**: `phases/4g-section-approved.md` - Finalize approval & move to next

**Creates (per section)**:
- ✅ `stories/[View].[N]-[section].md` (just-in-time)
- ✅ Updates to `[View].html` (incremental)
- ✅ Learnings captured in story and specs

**Flow**: 4a → 4b → 4c → 4d → [4e or 4f if needed, loops back to 4d] → 4g → [back to 4a for next section]

**Key**: One clear task per file → No confusion → Linear execution → Better results!

---

### **Phase 5: Finalization** (end of logical view)

**When**: All sections complete for a logical view

**What**: Integration test all states and final approval

**Go to**: `phases/5-finalization.md`

**Result**: Production-ready logical view handling all its states!

---

## 📚 Reference Files

**Templates**:
- `templates/work-file-template.yaml`
- `templates/story-file-template.md`
- `templates/page-template.html`
- `templates/components/dev-mode.*`

**Guides**:
- `PROTOTYPE-INITIATION-DIALOG.md` (conversation scripts)
- `PROTOTYPE-ANALYSIS.md` (quality standards)
- `CREATION-GUIDE.md` (technical details)

**Principles**: `principles/` folder

---

**Start with Phase 1** when beginning a new scenario! 🚀

