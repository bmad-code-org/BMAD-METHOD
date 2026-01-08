# Excalidraw Guide

**Optional sketching tool integration for visual design thinking**

---

## Overview

Excalidraw is a free, open-source whiteboard tool that creates hand-drawn style diagrams. This integration provides:

- ✅ Setup and configuration guides
- ✅ WDS-specific workflows
- ✅ AI collaboration patterns
- ✅ Export automation (optional)
- ✅ Component library (optional)

**Status:** Optional - Enable in project configuration

---

## When to Use Excalidraw

### **Perfect For:**

- Digital sketching (alternative to paper)
- Collaborative design sessions
- AI-generated layout variations
- Version-controlled wireframes
- Iterative design exploration

### **Not Required If:**

- You prefer paper and pen
- You use other tools (Figma, iPad, etc.)
- You're comfortable with your current workflow

---

## Quick Start

### **1. Enable in Project**

**Edit:** `project-config.yaml` (or during project initialization)

```yaml
sketching:
  tool: excalidraw # or "paper" or "figma" or "other"
  excalidraw:
    enabled: true
    auto_export: false # Auto-generate PNG/SVG on save
    use_library: true # Load WDS component library
    grid_size: 20 # Snap to grid (px)
```

### **2. Install Tools**

**VS Code Extension (Recommended):**

```
1. Open Extensions (Ctrl+Shift+X)
2. Search "Excalidraw"
3. Install "Excalidraw Editor"
```

**Or use web version:**

- <https://excalidraw.com> (no installation needed)

### **3. Load WDS Library (Optional)**

**If `use_library: true` in config:**

```
1. Open Excalidraw
2. Click library icon
3. Load: workflows/4-ux-design/excalidraw-integration/wds-library.excalidrawlib
4. Components now available for drag-and-drop
```

---

## Documentation

### **Setup & Configuration**

→ [excalidraw-setup.md](excalidraw-setup.md)

- Installation options
- VS Code configuration
- Project settings
- Grid and theme setup

### **Sketching Workflow**

→ [sketching-guide.md](sketching-guide.md)

- When to sketch
- What to sketch
- How to sketch
- File organization

### **Export Workflow**

→ [export-workflow.md](export-workflow.md)

- Manual export (PNG/SVG)
- Automated export (GitHub Actions)
- File naming conventions
- GitHub display

### **AI Collaboration**

→ [ai-collaboration.md](ai-collaboration.md)

- AI-generated layouts
- AI analysis of sketches
- Iteration workflow
- Best practices

---

## File Organization

**When Excalidraw is enabled:**

```
C-Scenarios/[scenario-name]/
├── sketches/
│   ├── page-name.excalidraw     ← Source (editable)
│   ├── page-name.png            ← Export (GitHub display)
│   └── page-name.svg            ← Export (scalable, optional)
└── specifications.md
```

**In specifications.md:**

```markdown
## Design

![Page Wireframe](./sketches/page-name.png)

[Edit in Excalidraw](./sketches/page-name.excalidraw)
```

---

## Integration with WDS Workflow

### **Phase 4: UX Design**

**Step 4B-02: Sketch Interface**

**If Excalidraw enabled:**

```
Agent: "I see you've enabled Excalidraw. Would you like to:
        1. Sketch manually in Excalidraw
        2. Have me generate layout variations
        3. Use paper/pen instead"
```

**AI can:**

- Generate `.excalidraw` files with layout options
- Analyze your sketches (upload PNG)
- Suggest improvements
- Create variations

---

## Optional Features

### **Component Library**

**File:** `wds-library.excalidrawlib`

Pre-built components:

- Mobile/tablet/desktop frames
- Buttons, inputs, cards
- Navigation patterns
- Common layouts

**Enable:** Set `use_library: true` in config

### **Auto-Export**

**GitHub Actions or pre-commit hooks**

Automatically generates PNG/SVG when you save `.excalidraw` files.

**Enable:** Set `auto_export: true` in config

See: [automation/README.md](automation/README.md)

---

## Comparison with Other Tools

### **Excalidraw vs Paper**

**Excalidraw:**

- ✅ Digital, shareable
- ✅ AI can generate
- ✅ Version controlled
- ✅ Easy to iterate
- ❌ Requires tool setup

**Paper:**

- ✅ Zero setup
- ✅ Fast and natural
- ✅ No distractions
- ❌ Must photograph/scan
- ❌ Harder to iterate

### **Excalidraw vs Figma**

**Excalidraw:**

- ✅ Free and open-source
- ✅ Hand-drawn aesthetic
- ✅ AI can generate
- ✅ Simpler, faster
- ❌ Less precise

**Figma:**

- ✅ Professional tool
- ✅ Pixel-perfect
- ✅ Component systems
- ✅ Team libraries
- ❌ Steeper learning curve
- ❌ Requires account

---

## Disabling Excalidraw

**To disable after enabling:**

**Edit:** `project-config.yaml`

```yaml
sketching:
  tool: paper # or "figma" or "other"
  excalidraw:
    enabled: false
```

**Agent will:**

- Skip Excalidraw-specific prompts
- Use generic sketching workflow
- Not generate `.excalidraw` files

**Your existing files:**

- Remain in project
- Can still be opened
- Not automatically deleted

---

## Support

### **Issues with Excalidraw?**

**VS Code extension not working:**

- Restart VS Code
- Check extension is enabled
- Try web version as fallback

**Files won't open:**

- Verify JSON is valid
- Check file extension is `.excalidraw`
- Try opening in web version

**AI can't generate files:**

- Check core helpers are loaded
- Verify project config
- Report issue to WDS

### **Community**

**Excalidraw:**

- Website: <https://excalidraw.com>
- GitHub: <https://github.com/excalidraw/excalidraw>
- Discord: <https://discord.gg/UexuTaE>

**WDS:**

- Discord: [WDS community]
- GitHub: [WDS issues]

---

## Next Steps

**If Excalidraw is enabled:**

1. Install VS Code extension (or use web)
2. Load WDS library (optional)
3. Configure grid and theme
4. Start sketching!

**Learn more:**

- [Setup Guide](excalidraw-setup.md)
- [Sketching Guide](sketching-guide.md)
- [AI Collaboration](ai-collaboration.md)

---

**Excalidraw integration is optional but powerful - enable it if digital sketching fits your workflow!** 🎨✨
