# Dialog Type Templates

Choose the template that matches your work type.

---

## Naming Convention

```
{output_folder}/_progress/agent-dialogs/
└── {YYYY-MM-DD}-{agent}-{feature-name}/
    └── {YYYY-MM-DD}-{agent}-{feature-name}-dialog.md
```

**Example:** `2026-01-23-freya-booking-details-overlay-dialog.md`

---

## Available Types

| Type | Icon | Template | Use When |
|------|------|----------|----------|
| **Prototype Implementation** | 🔧 | [prototype-implementation.template.md](prototype-implementation.template.md) | Building UI from specifications |
| **Stitch UI Generation** | 🪡 | [stitch-generation.template.md](stitch-generation.template.md) | AI-assisted UI design with Google Stitch |
| **Bug Fix** | 🐛 | [bug-fix.template.md](bug-fix.template.md) | Fixing issues and defects |
| **Design Exploration** | 🎨 | [design-exploration.template.md](design-exploration.template.md) | Exploring visual/UX directions |
| **Capture** | 💾 | [../dialog-capture.template.md](../dialog-capture.template.md) | Saving ideas for later |
| **Generic** | 📋 | [../dialog.template.md](../dialog.template.md) | Anything else |

---

## Type Details

### 🔧 Prototype Implementation

**Best for:**
- Implementing features from WDS specifications
- Building UI components section-by-section
- Following design system patterns

**Key sections:**
- Specification summary with Object IDs
- Section-by-section approval flow
- Design system component mapping

---

### 🪡 Stitch UI Generation

**Best for:**
- Generating UI designs from specifications using Google Stitch AI
- Rapid visual design iteration
- Creating production-quality screens from sketches

**Key sections:**
- Input formula: Visual Reference + Sketch + Specification
- Screen-by-screen generation tracking
- Export and integration workflow

**Input Formula:**
```
Visual Reference + Sketch + Specification (as prompt) = Stitch Generation
```

---

### 🐛 Bug Fix

**Best for:**
- Fixing reported issues
- Investigating unexpected behavior
- Quick targeted fixes

**Key sections:**
- Symptoms and reproduction steps
- Investigation hypotheses
- Root cause and solution documentation

---

### 🎨 Design Exploration

**Best for:**
- Exploring visual directions
- Comparing design approaches
- Making design decisions

**Key sections:**
- Multiple exploration directions
- Pros/cons analysis
- Artifact outputs (moodboards, sketches)

---

### 💾 Capture

**Best for:**
- Saving ideas when you don't have time
- Capturing context for later
- Minimal documentation

**Key sections:**
- Just purpose and initial thoughts
- "When I Return" checklist

---

### 📋 Generic

**Best for:**
- Work that doesn't fit other types
- Custom workflows
- Flexible structure

**Key sections:**
- Full setup context
- Custom step breakdown
- Standard progress tracking

---

## Choosing a Template

```
Start here:
    │
    ├── Building code from spec? → 🔧 Prototype Implementation
    │
    ├── Generating UI designs with AI? → 🪡 Stitch UI Generation
    │
    ├── Fixing something broken? → 🐛 Bug Fix
    │
    ├── Exploring design options? → 🎨 Design Exploration
    │
    ├── No time now, save for later? → 💾 Capture
    │
    └── Something else? → 📋 Generic
```

---

_Dialog Type Templates — WDS Agent Dialog Workflow_
