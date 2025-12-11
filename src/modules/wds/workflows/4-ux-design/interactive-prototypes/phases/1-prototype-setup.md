# Phase 1: Prototype Setup

**Purpose**: Set up the prototype environment for an entire scenario (one-time setup)

**Note**: This assumes the **scenario specification already exists** (created via `scenario-init/` workflow)

**Reference**: `../PROTOTYPE-INITIATION-DIALOG.md` (Part 1: Scenario Initiation)

---

## When to Use This Phase

- ✅ Starting prototypes for a brand new scenario
- ✅ No prototype folder exists yet for this scenario

**Skip this phase if**: Scenario already has `data/demo-data.json` and `PROTOTYPE-ROADMAP.md`

---

## Step 1: User Requests Scenario Setup

**User says**: "Create interactive prototypes for Scenario [N]: [Scenario Name]"

**Your response**: Follow the **Scenario Initiation Dialog** in `PROTOTYPE-INITIATION-DIALOG.md`

---

## Step 2: Run Initiation Dialog

**Ask 4 questions**:

1. **Device Compatibility** (Mobile-Only / Mobile+Tablet / Fully Responsive / Desktop-Only)
2. **Design Fidelity** (Gray Model / Design System / Figma Integration)
3. **Languages** (if project supports multiple languages)
4. **Demo Data** (Create realistic test family data)

**See**: `PROTOTYPE-INITIATION-DIALOG.md` for exact conversation scripts

---

## Step 3: Create Prototype Folder Structure

**Actions**:

1. **Create prototype folder**: `[Scenario-Number]-[Scenario-Name]-Prototype/`
2. **Create all subfolders**:
   - `data/` - Demo data JSON files
   - `work/` - Planning/work files (one per page)
   - `stories/` - Section implementation guides (created just-in-time)
   - `shared/` - Shared JavaScript (utilities, API abstraction)
   - `components/` - Reusable UI components
   - `pages/` - Page-specific scripts (if complex)
   - `assets/` - Images, icons, etc.
3. **Create `data/demo-data.json`** with demo family
4. **Create `PROTOTYPE-ROADMAP.md`** with scenario overview
5. **Record device compatibility and design approach** in roadmap

**Folder structure created**:
```
[Scenario-Number]-[Scenario-Name]-Prototype/
├── PROTOTYPE-ROADMAP.md
├── data/
│   └── demo-data.json
├── work/              (empty, will be filled per-page)
├── stories/           (empty, created just-in-time)
├── shared/            (empty, add as needed)
├── components/        (empty, add as needed)
├── pages/             (empty, add if needed)
└── assets/            (empty, add as needed)

HTML files will be placed in root as they're created.
```

**Your response**:
> "✅ Prototype environment ready!
>
> **Folder structure created**:
> - ✅ `[Scenario]-Prototype/` (main folder)
> - ✅ `data/demo-data.json` (demo family data)
> - ✅ `PROTOTYPE-ROADMAP.md` (scenario overview)
> - ✅ All working folders (work/, stories/, shared/, components/, pages/, assets/)
>
> **Configuration**:
> - 📱 Device: [Device type]
> - 🎨 Design: [Design fidelity]
> - 🌍 Languages: [Languages or single language]
>
> **Which page should we start with?**"

---

## Next Phase

**Go to**: `2-per-page-planning.md` when user selects a page

