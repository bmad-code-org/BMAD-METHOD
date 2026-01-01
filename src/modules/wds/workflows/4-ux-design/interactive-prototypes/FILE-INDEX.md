# Interactive Prototypes - File Index

**Location**: `src/modules/wds/workflows/4-ux-design/interactive-prototypes/`

---

## 📁 Complete File Structure

```
interactive-prototypes/
│
├── INTERACTIVE-PROTOTYPES-GUIDE.md             ← START HERE (overview & quick reference)
├── PROTOTYPE-WORKFLOW.md                       ← Workflow overview with phase links
├── PROTOTYPE-INITIATION-DIALOG.md              ← Conversation scripts for initiation
├── CREATION-GUIDE.md                           ← Original detailed guide (reference)
├── PROTOTYPE-ANALYSIS.md                       ← Dog Week analysis (examples)
│
├── phases/                                     ← Micro-step workflow files
│   ├── 1-prototype-setup.md                    ← Phase 1: Prototype environment setup
│   ├── 2-per-page-planning.md                  ← Phase 2: Analyze spec & create work file
│   ├── 3-section-implementation.md             ← Phase 3: Build section-by-section
│   └── 4-finalization.md                       ← Phase 4: Integration test & approval
│
├── templates/
│   ├── work-file-template.yaml                 ← Planning document template
│   ├── story-file-template.md                  ← Section implementation template
│   ├── page-template.html                      ← Complete HTML page template
│   ├── PROTOTYPE-ROADMAP-template.md           ← Scenario roadmap template
│   ├── demo-data-template.json                 ← Demo data structure template
│   └── components/
│       ├── dev-mode.html                       ← Dev mode toggle button
│       ├── dev-mode.js                         ← Dev mode logic (Shift+Click to copy IDs)
│       ├── dev-mode.css                        ← Dev mode styles
│       └── DEV-MODE-GUIDE.md                   ← Dev mode usage guide
│
└── examples/
    └── (Dog Week prototypes as reference)
```

---

## 📚 What Each File Does

### Core Documentation

#### `INTERACTIVE-PROTOTYPES-GUIDE.md`
**Purpose**: Complete system overview  
**For**: All agents (Freya, Saga, Idunn)  
**Contains**:
- System overview
- Folder structure
- Complete workflow summary
- Key principles
- Quick reference
- Success metrics

**Read this**: To understand the complete system

---

#### `PROTOTYPE-WORKFLOW.md`
**Purpose**: Workflow overview with phase navigation  
**For**: Freya (primary), other agents (reference)  
**Contains**:
- Overview of all 4 phases
- Clear links to phase-specific files
- When to use each phase
- What each phase creates

**Read this**: To understand the workflow structure

---

#### `phases/1-prototype-setup.md`
**Purpose**: Prototype environment setup instructions  
**Contains**: Device compatibility, design fidelity, languages, demo data creation  
**Next**: Phase 2

---

#### `phases/2-per-page-planning.md`
**Purpose**: Page analysis and work file creation  
**Contains**: Spec analysis, section breakdown, work file creation  
**Next**: Phase 3

---

#### `phases/3-section-implementation.md`
**Purpose**: Section-by-section building  
**Contains**: Story creation, implementation, testing, approval loop  
**Next**: Phase 4 or repeat for next section

---

#### `phases/4-finalization.md`
**Purpose**: Integration test and completion  
**Contains**: Final test, quality checklist, next steps  
**Next**: New page (Phase 2) or new scenario (Phase 1)

---

#### `PROTOTYPE-INITIATION-DIALOG.md`
**Purpose**: Conversation scripts for initiation  
**For**: Freya (exact scripts to follow)  
**Contains**:
- Scenario initiation questions
- Per-page section breakdown prompts
- Example complete exchange

**Read this**: For exact conversation patterns

---

#### `CREATION-GUIDE.md`
**Purpose**: Original detailed guide  
**For**: Deep dives, specific techniques  
**Contains**:
- Detailed file structure explanations
- Step-by-step creation process
- Component patterns
- Testing strategies
- Common patterns library

**Read this**: For detailed technical reference

---

#### `PROTOTYPE-ANALYSIS.md`
**Purpose**: Dog Week case study  
**For**: Learning from examples  
**Contains**:
- Analysis of Dog Week prototypes
- What works well
- Patterns to follow
- Lessons learned
- Quality metrics

**Read this**: To see real-world examples

---

### Templates

#### `templates/work-file-template.yaml`
**Purpose**: Planning document  
**When to use**: Start of EVERY prototype  
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
- Header example
- Form examples (input, textarea, split button)
- Submit button with loading state
- Toast notification
- Error banner
- Modal example (commented)
- Shared script includes
- Inline JavaScript template

**Use this**: As starting point for new page HTML

---

#### `templates/PROTOTYPE-ROADMAP-template.md`
**Purpose**: Scenario overview document  
**When to use**: Start of scenario development  
**Created**: Once per scenario  
**Contains**:
- Scenario overview
- Device compatibility details
- Folder structure explanation
- Shared resources documentation
- Component documentation
- Prototype status table
- Testing requirements
- Troubleshooting guide

**Use this**: To create roadmap for scenario

---

#### `templates/demo-data-template.json`
**Purpose**: Demo data structure  
**When to use**: Setting up scenario demo data  
**Created**: Once per scenario (modify as needed)  
**Contains**:
- User object
- Family object
- Members array
- Dogs array (or other entities)
- All fields with examples

**Use this**: To create demo-data.json file

---

## 🎯 Which File When?

### Starting New Scenario
1. Read: `PROTOTYPE-WORKFLOW.md` (understand phases)
2. Follow: `phases/1-prototype-setup.md` (setup)
3. Use: `PROTOTYPE-ROADMAP-template.md` → Create roadmap
4. Use: `demo-data-template.json` → Create demo data

### Starting New Page
1. Follow: `phases/2-per-page-planning.md` (analyze)
2. Use: `work-file-template.yaml` → Create work file
3. Get approval
4. Follow: `phases/3-section-implementation.md`

### Implementing Each Section
1. Follow: `phases/3-section-implementation.md` (loop)
2. Use: `story-file-template.md` → Create story file (just-in-time)
3. Implement in HTML (incrementally)
4. Test
5. Get approval
6. Repeat for next section

### Finishing Page
1. Follow: `phases/4-finalization.md` (integration test)
2. Get final approval
3. Choose: New page, new scenario, or done

### Need Help
1. Check: `PROTOTYPE-WORKFLOW.md` (phase overview)
2. Check: `phases/[N]-*.md` (specific phase)
3. Check: `CREATION-GUIDE.md` (detailed reference)
4. Check: `PROTOTYPE-ANALYSIS.md` (examples)

---

## 📊 File Relationships

```
PROTOTYPE-WORKFLOW.md (overview)
  ├─ phases/1-prototype-setup.md
  ├─ phases/2-per-page-planning.md
  ├─ phases/3-section-implementation.md
  └─ phases/4-finalization.md

PROTOTYPE-INITIATION-DIALOG.md
  └─ Referenced by: phases/1-prototype-setup.md (conversation scripts)

work-file-template.yaml
  └─ Used in: phases/2-per-page-planning.md
  └─ Each section becomes: story-file-template.md (later)

story-file-template.md
  └─ Used in: phases/3-section-implementation.md (just-in-time)
  └─ Guides: Implementation in HTML

page-template.html
  └─ Used in: phases/3-section-implementation.md (Section 1 only)
  └─ Modified: Section by section

PROTOTYPE-ROADMAP-template.md
  └─ Used in: phases/1-scenario-init.md
  └─ Updated: As prototypes complete
```

---

## 🚀 Quick Start Paths

### Path 1: I want to understand the system
1. `INTERACTIVE-PROTOTYPES-GUIDE.md` (overview)
2. `PROTOTYPE-WORKFLOW.md` (workflow phases)
3. `PROTOTYPE-ANALYSIS.md` (examples)

### Path 2: I want to create my first prototype
1. `PROTOTYPE-WORKFLOW.md` (start here)
2. `phases/1-prototype-setup.md` (follow step-by-step)
3. `phases/2-per-page-planning.md` (next)
4. `phases/3-section-implementation.md` (build loop)
5. `phases/4-finalization.md` (finish)

### Path 3: I need specific technical details
1. `CREATION-GUIDE.md` (detailed techniques)
2. `PROTOTYPE-ANALYSIS.md` (real examples)
3. `page-template.html` (code examples)

### Path 4: I'm stuck on something
1. `phases/[current-phase].md` (specific phase help)
2. `CREATION-GUIDE.md` → Common Pitfalls section
3. `templates/components/DEV-MODE-GUIDE.md` (if dev mode issue)

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

## ✅ Checklist: Do I Have Everything?

**For Freya to create prototypes**:
- [x] `INTERACTIVE-PROTOTYPES-GUIDE.md` (overview)
- [x] `PROTOTYPE-WORKFLOW.md` (workflow overview)
- [x] `phases/1-prototype-setup.md` (Phase 1)
- [x] `phases/2-per-page-planning.md` (Phase 2)
- [x] `phases/3-section-implementation.md` (Phase 3)
- [x] `phases/4-finalization.md` (Phase 4)
- [x] `PROTOTYPE-INITIATION-DIALOG.md` (conversation scripts)
- [x] `work-file-template.yaml`
- [x] `story-file-template.md`
- [x] `page-template.html`
- [x] `PROTOTYPE-ROADMAP-template.md`
- [x] `demo-data-template.json`
- [x] `templates/components/dev-mode.*` (dev mode feature)

**For learning**:
- [x] `CREATION-GUIDE.md` (detailed)
- [x] `PROTOTYPE-ANALYSIS.md` (examples)

**For reference**:
- [x] Dog Week examples (real prototypes)

---

**All templates and micro-step instructions are ready!** 🎉

Next step: Activate Freya and follow `PROTOTYPE-WORKFLOW.md` → `phases/1-prototype-setup.md`

