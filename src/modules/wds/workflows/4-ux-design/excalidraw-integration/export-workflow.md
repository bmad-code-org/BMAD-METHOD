# Export Workflow

**How to export Excalidraw files for documentation and GitHub**

---

## Why Export?

**Excalidraw files (`.excalidraw`) are JSON:**

- ✅ Perfect for editing
- ✅ Version control friendly
- ✅ AI can generate
- ❌ Don't render in GitHub

**Exported images (PNG/SVG):**

- ✅ Display in GitHub
- ✅ Show in documentation
- ✅ Easy to share
- ✅ No special tools needed

**Solution:** Keep both!

```
sketch.excalidraw  ← Source (editable)
sketch.png         ← Display (GitHub)
```

---

## Manual Export

### **From VS Code Extension**

**Step 1: Open file**

```
Click .excalidraw file in VS Code
Opens in Excalidraw editor
```

**Step 2: Export**

```
1. Click hamburger menu (top-right)
2. Export image
3. Choose format:
   - PNG (recommended for docs)
   - SVG (scalable, optional)
4. Click "Export"
5. Save to same folder as source
```

**Step 3: Name correctly**

```
Source:  dashboard.excalidraw
Export:  dashboard.png
         dashboard.svg (optional)
```

### **From Web App**

**Step 1: Open file**

```
1. Go to https://excalidraw.com
2. File → Open
3. Select .excalidraw file
```

**Step 2: Export**

```
1. Click hamburger menu
2. Export image
3. Choose format (PNG/SVG)
4. Download
```

**Step 3: Move to project**

```
1. Move downloaded file to project
2. Place in same folder as source
3. Rename if needed
```

---

## Export Settings

### **PNG Export**

**Recommended settings:**

```
Format: PNG
Background: Transparent or White
Scale: 2x (for retina displays)
Include: Only selected (if partial export)
```

**When to use:**

- Documentation
- GitHub README
- Presentations
- Quick sharing

**Pros:**

- ✅ Universal support
- ✅ Good quality
- ✅ Reasonable file size

**Cons:**

- ❌ Not scalable
- ❌ Larger than SVG

### **SVG Export**

**Recommended settings:**

```
Format: SVG
Background: Transparent
Embed fonts: Yes (for portability)
```

**When to use:**

- Scalable documentation
- Print materials
- High-resolution needs
- Technical diagrams

**Pros:**

- ✅ Infinitely scalable
- ✅ Smaller file size
- ✅ Crisp at any size

**Cons:**

- ❌ Some tools don't support
- ❌ More complex

---

## File Organization

### **Standard Structure**

```
C-Scenarios/[scenario-name]/
├── sketches/
│   ├── dashboard.excalidraw     ← Source
│   ├── dashboard.png            ← Export (PNG)
│   ├── dashboard.svg            ← Export (SVG, optional)
│   ├── task-list.excalidraw
│   ├── task-list.png
│   └── user-flow.excalidraw
└── Frontend/
    └── specifications.md
```

### **Naming Conventions**

**Pattern:**

```
[descriptive-name].excalidraw  ← Source
[descriptive-name].png         ← PNG export
[descriptive-name].svg         ← SVG export (optional)
```

**Examples:**

```
✅ dashboard.excalidraw / dashboard.png
✅ login-page.excalidraw / login-page.png
✅ user-flow.excalidraw / user-flow.svg
✅ button-states.excalidraw / button-states.png

❌ sketch1.excalidraw / image.png (not descriptive)
❌ Dashboard.excalidraw / dashboard.PNG (inconsistent case)
```

### **Versions**

**Option A: Numbered versions**

```
dashboard-v1.excalidraw
dashboard-v1.png
dashboard-v2.excalidraw
dashboard-v2.png
dashboard-final.excalidraw
dashboard-final.png
```

**Option B: Git history (recommended)**

```
dashboard.excalidraw  ← Always latest
dashboard.png         ← Always latest
Git history shows all versions
```

---

## Using Exports in Documentation

### **In Markdown Files**

**Basic image:**

```markdown
![Dashboard Wireframe](./sketches/dashboard.png)
```

**With link to source:**

```markdown
## Dashboard Design

![Dashboard Wireframe](./sketches/dashboard.png)

[Edit in Excalidraw](./sketches/dashboard.excalidraw)
```

**With caption:**

```markdown
![Dashboard showing today's tasks with card-based layout](./sketches/dashboard.png)
_Dashboard showing today's tasks with card-based layout_
```

**Multiple images:**

```markdown
## Layout Options

### Option A: Card-Based

![Card-based layout](./sketches/dashboard-cards.png)

### Option B: List-Based

![List-based layout](./sketches/dashboard-list.png)

### Option C: Calendar-Focused

![Calendar-focused layout](./sketches/dashboard-calendar.png)
```

### **In Specifications**

**Example:**

```markdown
# Dashboard Page Specification

## Visual Design

![Dashboard Wireframe](./sketches/dashboard.png)

[Edit Source](./sketches/dashboard.excalidraw)

## Layout Structure

The dashboard follows a card-based layout with:

- Header: Logo, menu, add button
- Content: Today's tasks in card format
- Footer: Bottom navigation

[Detailed specifications below...]
```

---

## Automated Export (Optional)

### **GitHub Actions**

**Automatically export on push:**

**File:** `.github/workflows/excalidraw-export.yml`

```yaml
name: Export Excalidraw

on:
  push:
    paths:
      - '**/*.excalidraw'

jobs:
  export:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3

      - name: Install CLI
        run: npm install -g @excalidraw/cli

      - name: Export files
        run: |
          find . -name "*.excalidraw" | while read file; do
            excalidraw-cli export "$file" --output "${file%.excalidraw}.png"
          done

      - name: Commit
        run: |
          git config user.name "GitHub Action"
          git config user.email "action@github.com"
          git add "*.png"
          git commit -m "Auto-export Excalidraw [skip ci]" || true
          git push
```

**Enable:** Set `auto_export: true` in project config

**See:** [automation/README.md](automation/README.md) (future)

---

## Best Practices

### **DO ✅**

**Always export:**

- Export after every significant change
- Keep exports in sync with source
- Use consistent naming
- Commit both source and export

**Choose right format:**

- PNG for most documentation
- SVG for scalable needs
- Both if unsure

**Organize well:**

- Keep exports with sources
- Use descriptive names
- Follow naming conventions

**Document in markdown:**

- Show image inline
- Link to source file
- Add helpful captions

### **DON'T ❌**

**Don't:**

- Commit only PNG (lose editability)
- Commit only .excalidraw (won't show in GitHub)
- Use inconsistent naming
- Forget to update exports
- Skip captions/context
- Use generic names

---

## Troubleshooting

### **Export looks blurry**

**Issue:** PNG export is low resolution

**Solution:**

```
1. Check export scale (use 2x)
2. Ensure source is high quality
3. Try SVG instead
```

### **File size too large**

**Issue:** PNG files are huge

**Solution:**

```
1. Use SVG instead
2. Reduce export scale
3. Optimize PNG with tools
4. Remove unnecessary elements
```

### **GitHub not showing image**

**Issue:** Image link broken in markdown

**Solution:**

```
1. Check file path is correct
2. Use relative paths (./sketches/file.png)
3. Verify file is committed
4. Check file name matches exactly (case-sensitive)
```

### **Can't find export option**

**Issue:** Export menu not visible

**Solution:**

```
VS Code: Hamburger menu → Export image
Web: File menu → Export image
Desktop: File → Export
```

---

## Quick Reference

### **Export Checklist**

**Before exporting:**

- [ ] Sketch is complete
- [ ] All elements labeled
- [ ] Grid alignment checked
- [ ] Annotations added

**During export:**

- [ ] Choose correct format (PNG/SVG)
- [ ] Set appropriate scale (2x for PNG)
- [ ] Use descriptive filename
- [ ] Save to correct folder

**After exporting:**

- [ ] Verify export looks good
- [ ] Update markdown references
- [ ] Commit both source and export
- [ ] Test GitHub display

---

## Examples

### **Example 1: Single Page**

**Files:**

```
sketches/
├── dashboard.excalidraw
└── dashboard.png
```

**In specifications.md:**

```markdown
# Dashboard Specification

![Dashboard](./sketches/dashboard.png)
[Edit](./sketches/dashboard.excalidraw)
```

### **Example 2: Multiple Variations**

**Files:**

```
sketches/
├── dashboard-cards.excalidraw
├── dashboard-cards.png
├── dashboard-list.excalidraw
├── dashboard-list.png
├── dashboard-calendar.excalidraw
└── dashboard-calendar.png
```

**In specifications.md:**

```markdown
# Dashboard Options

## Option A: Card-Based

![Cards](./sketches/dashboard-cards.png)
[Edit](./sketches/dashboard-cards.excalidraw)

## Option B: List-Based

![List](./sketches/dashboard-list.png)
[Edit](./sketches/dashboard-list.excalidraw)

## Option C: Calendar-Focused

![Calendar](./sketches/dashboard-calendar.png)
[Edit](./sketches/dashboard-calendar.excalidraw)
```

### **Example 3: States**

**Files:**

```
sketches/
├── button-states.excalidraw
└── button-states.png
```

**In specifications.md:**

```markdown
# Button Component

## States

![Button States](./sketches/button-states.png)
[Edit](./sketches/button-states.excalidraw)

The button has 5 states:

- Default: Blue background, white text
- Hover: Darker blue, slight scale
- Active: Even darker, pressed appearance
- Disabled: Gray, reduced opacity
- Loading: Spinner, disabled interaction
```

---

## Next Steps

**After exporting:**

1. ✅ PNG/SVG created
2. ✅ Files organized
3. ✅ Markdown updated
4. ✅ Committed to git
5. ✅ Visible in GitHub

**Continue to:**

- Phase 4C: Create specifications
- Use exports in documentation
- Share with team

---

**Export workflow complete! Your sketches are now visible everywhere while remaining editable!** 📸✨
