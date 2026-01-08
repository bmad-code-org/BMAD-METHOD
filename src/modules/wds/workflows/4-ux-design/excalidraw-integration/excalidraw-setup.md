# Excalidraw Setup for WDS

**Installation and configuration guide**

---

## Installation Options

### **Option A: VS Code Extension (Recommended)**

**Best for:** Working within IDE, integrated workflow

**Steps:**

```
1. Open VS Code
2. Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search "Excalidraw"
4. Install "Excalidraw Editor" by Excalidraw
5. Reload VS Code
```

**Usage:**

- Create new `.excalidraw` file
- Click to open in Excalidraw editor
- Edit and save (Ctrl+S / Cmd+S)
- File auto-saves to project

**Pros:**

- ✅ Never leave IDE
- ✅ Direct file access
- ✅ Git integration
- ✅ Side-by-side with code

### **Option B: Web App**

**Best for:** Quick sketching, no installation

**Steps:**

```
1. Go to https://excalidraw.com
2. Start drawing
3. File → Save to save .excalidraw file
4. Move file to project folder
```

**Usage:**

- Open in browser
- Draw and iterate
- Download when done
- Place in project

**Pros:**

- ✅ Zero installation
- ✅ Works anywhere
- ✅ Always latest version
- ✅ Shareable links

### **Option C: Desktop App**

**Best for:** Dedicated sketching tool

**Steps:**

```
1. Download from https://github.com/excalidraw/excalidraw-desktop
2. Install for your OS
3. Open .excalidraw files directly
```

**Pros:**

- ✅ Standalone app
- ✅ Offline capable
- ✅ Native performance

---

## Project Configuration

### **Enable Excalidraw in Project**

**During project initialization:**

```
Agent: "Which sketching tool would you like to use?
        1. Paper and pen (scan/photograph)
        2. Excalidraw (digital, AI-friendly)
        3. Figma (professional tool)
        4. Other digital tool

        Your choice:"
```

**Or edit manually:**

**File:** `project-config.yaml` (root of project)

```yaml
project:
  name: 'Dog Week'
  wds_version: '6.0'

sketching:
  tool: excalidraw # "paper" | "excalidraw" | "figma" | "other"

  excalidraw:
    enabled: true

    # Auto-export to PNG/SVG on save
    auto_export: false # true | false

    # Load WDS component library
    use_library: true # true | false

    # Grid settings
    grid_size: 20 # pixels
    snap_to_grid: true # true | false

    # Default theme
    theme: light # "light" | "dark"

    # File organization
    sketches_folder: 'sketches' # relative to scenario folder
```

---

## VS Code Configuration

### **Extension Settings**

**File:** `.vscode/settings.json`

```json
{
  "excalidraw.theme": "light",
  "excalidraw.gridMode": true,
  "excalidraw.gridSize": 20,
  "excalidraw.snapToGrid": true,
  "excalidraw.showStats": false,
  "excalidraw.zenMode": false
}
```

### **Recommended Settings**

**Grid:**

- Size: 20px (matches WDS spacing)
- Snap: Enabled (for alignment)
- Visible: Optional (toggle with Ctrl+')

**Theme:**

- Light: Better for screenshots
- Dark: Easier on eyes for long sessions

**Auto-save:**

- Enabled by default in VS Code
- Saves on every change

---

## WDS Component Library (Optional)

### **What is it?**

Pre-built Excalidraw components for common UI elements:

- Device frames (mobile, tablet, desktop)
- Buttons, inputs, cards
- Navigation patterns
- Layout grids

### **Installation**

**If `use_library: true` in config:**

**VS Code:**

```
1. Open any .excalidraw file
2. Click library icon (bottom toolbar)
3. Click "Load library"
4. Select: workflows/4-ux-design/excalidraw-integration/wds-library.excalidrawlib
5. Components now available
```

**Web:**

```
1. Open https://excalidraw.com
2. Click library icon
3. Upload: wds-library.excalidrawlib
4. Components now available
```

### **Usage**

**Drag and drop:**

```
1. Open library panel
2. Find component (e.g., "Mobile Frame")
3. Drag onto canvas
4. Customize as needed
```

**Components included:**

- Mobile Frame (375x812)
- Tablet Frame (768x1024)
- Desktop Frame (1440x900)
- Button (primary, secondary, ghost)
- Input Field
- Card Container
- Navigation Bar
- Header
- Footer

---

## Grid Configuration

### **Why 20px Grid?**

**Matches WDS spacing system:**

- Consistent alignment
- Clean layouts
- Easy calculations
- Professional appearance

### **Setup**

**VS Code:**

```
Settings → Extensions → Excalidraw
- Grid Mode: ✓ Enabled
- Grid Size: 20
- Snap to Grid: ✓ Enabled
```

**Web:**

```
View menu → Show grid (Ctrl+')
Settings → Grid size: 20
```

### **Usage**

**All elements snap to 20px increments:**

- Position: 0, 20, 40, 60, 80...
- Size: 100, 120, 140, 160...
- Spacing: 20, 40, 60, 80...

---

## Theme Configuration

### **Light Theme (Recommended)**

**Best for:**

- Screenshots and exports
- GitHub display
- Documentation
- Presentations

**Colors:**

- Background: White
- Shapes: Light colors
- Text: Dark gray/black

### **Dark Theme**

**Best for:**

- Long sketching sessions
- Reduced eye strain
- Personal preference

**Colors:**

- Background: Dark gray
- Shapes: Bright colors
- Text: White/light gray

### **Setup**

**VS Code:**

```
Settings → Excalidraw → Theme: light/dark
```

**Web:**

```
Settings icon → Appearance → Theme
```

---

## File Organization

### **Folder Structure**

**When Excalidraw enabled:**

```
C-Scenarios/
├── morning-dog-care/
│   ├── sketches/
│   │   ├── dashboard.excalidraw
│   │   ├── dashboard.png
│   │   ├── task-list.excalidraw
│   │   └── task-list.png
│   └── Frontend/
│       └── specifications.md
└── evening-routine/
    └── sketches/
        └── ...
```

### **Naming Conventions**

**Source files:**

```
[page-name].excalidraw
[component-name].excalidraw
[flow-name].excalidraw
```

**Exports:**

```
[page-name].png          (for GitHub/docs)
[page-name].svg          (scalable, optional)
[page-name]-v2.png       (iterations)
```

**Examples:**

```
dashboard.excalidraw
dashboard.png
login-page.excalidraw
login-page.png
user-flow.excalidraw
user-flow.svg
```

---

## Export Configuration

### **Manual Export**

**VS Code:**

```
1. Open .excalidraw file
2. Click hamburger menu (top-right)
3. Export image → PNG or SVG
4. Save to same folder
```

**Web:**

```
1. File menu → Export image
2. Choose format (PNG/SVG)
3. Download
4. Move to project folder
```

### **Auto-Export (Optional)**

**If `auto_export: true` in config:**

**GitHub Actions automatically:**

- Detects `.excalidraw` file changes
- Generates PNG and SVG
- Commits to repository
- Keeps exports in sync

**See:** [automation/README.md](automation/README.md)

---

## Keyboard Shortcuts

### **Essential Shortcuts**

**Drawing:**

- `R` - Rectangle
- `D` - Diamond
- `O` - Ellipse
- `A` - Arrow
- `T` - Text
- `L` - Line

**Editing:**

- `Ctrl/Cmd + D` - Duplicate
- `Ctrl/Cmd + G` - Group
- `Ctrl/Cmd + Shift + G` - Ungroup
- `Delete` - Delete selected

**View:**

- `Ctrl/Cmd + '` - Toggle grid
- `Ctrl/Cmd + Wheel` - Zoom
- `Space + Drag` - Pan canvas

**Selection:**

- `Ctrl/Cmd + A` - Select all
- `Shift + Click` - Multi-select
- `Ctrl/Cmd + Click` - Add to selection

---

## Troubleshooting

### **VS Code extension not working**

**Issue:** Extension installed but files won't open

**Solutions:**

1. Restart VS Code
2. Check extension is enabled (Extensions panel)
3. Try right-click → Open With → Excalidraw
4. Update extension to latest version
5. Fallback: Use web version

### **Files won't open in Excalidraw**

**Issue:** "Invalid file" error

**Solutions:**

1. Verify file extension is `.excalidraw`
2. Check JSON is valid (open in text editor)
3. Try opening in web version
4. Check file isn't corrupted
5. Restore from git if needed

### **Grid not snapping**

**Issue:** Elements don't snap to grid

**Solutions:**

1. Enable "Snap to grid" in settings
2. Check grid size is set (20px)
3. Toggle grid visibility (Ctrl+')
4. Restart Excalidraw

### **Library won't load**

**Issue:** Component library not appearing

**Solutions:**

1. Verify file path is correct
2. Check `.excalidrawlib` file exists
3. Try uploading manually
4. Clear browser cache (web version)
5. Restart VS Code (extension)

---

## Best Practices

### **DO ✅**

- Use 20px grid for alignment
- Save frequently (auto-save helps)
- Export PNG for documentation
- Keep source `.excalidraw` in git
- Use library components when available
- Label all elements clearly

### **DON'T ❌**

- Don't skip grid alignment
- Don't forget to export for GitHub
- Don't delete source files
- Don't over-complicate sketches
- Don't skip annotations
- Don't ignore file naming conventions

---

## Next Steps

**After setup:**

1. ✅ Excalidraw installed and configured
2. ✅ Project config updated
3. ✅ Library loaded (optional)
4. ✅ Grid and theme set

**Now learn:**

- [Sketching Guide](sketching-guide.md) - How to sketch in WDS
- [AI Collaboration](ai-collaboration.md) - Work with AI
- [Export Workflow](export-workflow.md) - Share your work

---

**Setup complete! You're ready to start sketching with Excalidraw!** 🎨✨
