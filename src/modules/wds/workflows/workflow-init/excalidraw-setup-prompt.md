# Excalidraw Setup Prompt

**Agent micro-instruction for configuring Excalidraw during project initialization**

---

## When to Use

**Trigger:** During project initialization, after asking about sketching tool preference

**Context:** User has indicated they want to use Excalidraw for sketching

---

## Prompt Sequence

### **Step 1: Confirm Excalidraw**

<ask>
```
You've chosen Excalidraw for sketching. Great choice!

Excalidraw is a free, open-source whiteboard tool that:
✓ Creates hand-drawn style wireframes
✓ Works in VS Code or web browser
✓ AI can generate and analyze sketches
✓ Version control friendly (JSON files)

Would you like me to configure Excalidraw for this project? (y/n)

```
</ask>

**If no:** Skip Excalidraw configuration, set `sketching.tool: "other"` in config

**If yes:** Continue to Step 2

---

### **Step 2: Auto-Export Preference**

<ask>
```

Excalidraw files (.excalidraw) don't display in GitHub by default.
They need to be exported to PNG/SVG for documentation.

Would you like automatic export enabled?

Options:

1. Manual export (you export when needed)
2. Auto-export (GitHub Actions exports automatically on save)

Your choice (1/2):

````
</ask>

**Record:**
```yaml
excalidraw:
  auto_export: true   # if option 2
  auto_export: false  # if option 1
````

**Note:** If auto-export chosen, inform user that GitHub Actions setup will be needed

---

### **Step 3: Component Library**

<ask>
```
WDS includes an Excalidraw component library with:
- Device frames (mobile, tablet, desktop)
- Common UI components (buttons, inputs, cards)
- Layout templates

Would you like to use the WDS component library? (y/n)

````
</ask>

**Record:**
```yaml
excalidraw:
  use_library: true   # if yes
  use_library: false  # if no
````

---

### **Step 4: Grid Settings**

<ask>
```
Excalidraw can snap elements to a grid for alignment.

WDS recommends 20px grid (matches spacing system).

Grid settings:

1. 20px grid with snap (recommended)
2. 10px grid with snap (finer control)
3. No grid (free-form)

Your choice (1/2/3):

````
</ask>

**Record:**
```yaml
excalidraw:
  grid_size: 20          # if option 1
  grid_size: 10          # if option 2
  grid_size: 0           # if option 3
  snap_to_grid: true     # if option 1 or 2
  snap_to_grid: false    # if option 3
````

---

### **Step 5: Theme Preference**

<ask>
```
Choose default Excalidraw theme:

1. Light (better for screenshots and documentation)
2. Dark (easier on eyes for long sessions)

Your choice (1/2):

````
</ask>

**Record:**
```yaml
excalidraw:
  theme: "light"   # if option 1
  theme: "dark"    # if option 2
````

---

### **Step 6: Installation Instructions**

<output>
```
✅ Excalidraw configured for this project!

Configuration saved to: project-config.yaml

NEXT STEPS:

1. Install Excalidraw (choose one):

   Option A: VS Code Extension (Recommended)
   - Open Extensions (Ctrl+Shift+X)
   - Search "Excalidraw"
   - Install "Excalidraw Editor"

   Option B: Web App
   - Go to <https://excalidraw.com>
   - No installation needed

2. Load WDS Component Library (if enabled):
   - Open Excalidraw
   - Click library icon
   - Load: workflows/4-ux-design/excalidraw-integration/wds-library.excalidrawlib

3. Configure Settings:
   - Grid: {{GRID_SIZE}}px
   - Snap to grid: {{SNAP_TO_GRID}}
   - Theme: {{THEME}}

DOCUMENTATION:

- Setup Guide: workflows/4-ux-design/excalidraw-integration/excalidraw-setup.md
- Sketching Guide: workflows/4-ux-design/excalidraw-integration/sketching-guide.md
- AI Collaboration: workflows/4-ux-design/excalidraw-integration/ai-collaboration.md

Ready to start sketching! 🎨

````
</output>

---

## Configuration Output

**Update project-config.yaml:**

```yaml
sketching:
  tool: excalidraw

  excalidraw:
    enabled: true
    auto_export: {{USER_CHOICE}}
    use_library: {{USER_CHOICE}}
    grid_size: {{USER_CHOICE}}
    snap_to_grid: {{USER_CHOICE}}
    theme: {{USER_CHOICE}}
    sketches_folder: "sketches"
````

---

## If User Declines Excalidraw

<output>
```
No problem! You can use any sketching tool you prefer.

Common alternatives:

- Paper and pen (photograph/scan)
- Figma (professional design tool)
- iPad + Apple Pencil
- Other digital whiteboard tools

WDS works with any sketching method. Just:

1. Create your sketches
2. Export to PNG/JPG
3. Upload to AI for analysis
4. Save in scenario sketches folder

Configuration saved with: sketching.tool: "other"

```
</output>

---

## Integration with Phase 4

**During Phase 4B (Sketch Interface):**

**If Excalidraw enabled:**
```

Agent: "I see you've configured Excalidraw for this project.

Would you like to:

1. Sketch manually in Excalidraw
2. Have me generate layout variations in Excalidraw
3. Use a different tool for this scenario

Your choice:"

```

**If Excalidraw not enabled:**
```

Agent: "Time to sketch the interface.

You can:

1. Sketch on paper (photograph/scan)
2. Use your preferred digital tool
3. Enable Excalidraw now (if you'd like)

Your choice:"

```

---

## Error Handling

### **If user unsure:**

<output>
```

Not sure if Excalidraw is right for you?

PROS:
✓ Free and open-source
✓ Works in VS Code or browser
✓ AI can generate sketches
✓ Version control friendly
✓ Easy to learn

CONS:
✗ Requires tool setup
✗ Not as precise as Figma
✗ Limited styling options

RECOMMENDATION:
Try it! You can always switch tools later.
Configuration can be changed in project-config.yaml.

Would you like to enable Excalidraw? (y/n)

```
</output>

### **If installation fails:**

<output>
```

Having trouble installing Excalidraw?

FALLBACK OPTIONS:

1. Use web version (no installation):
   <https://excalidraw.com>
2. Use different tool temporarily:
   - Paper and pen
   - Figma
   - Other whiteboard tool
3. Skip sketching for now:
   - Describe interface verbally
   - AI can generate sketches later

Your choice:

```
</output>

---

## Post-Configuration

**Create folder structure:**
```

C-Scenarios/
└── [scenario-name]/
└── sketches/ ← Created automatically

```

**If use_library: true:**
- Verify wds-library.excalidrawlib exists
- Provide path for loading

**If auto_export: true:**
- Check if GitHub Actions can be configured
- Provide setup instructions
- Warn if not possible (e.g., not using GitHub)

---

## Success Criteria

**Configuration complete when:**
- ✓ User choice recorded in project-config.yaml
- ✓ Installation instructions provided
- ✓ Documentation links shared
- ✓ Folder structure created
- ✓ User knows next steps

---

**This prompt ensures smooth Excalidraw setup tailored to user preferences!** ⚙️✨
```
