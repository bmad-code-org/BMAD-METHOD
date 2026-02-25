# Excalidraw

**Category:** Wireframing Tool
**Purpose:** Agent + human collaborative wireframing with editable JSON format
**Website:** <https://excalidraw.com>
**VS Code Extension:** [Excalidraw Editor](https://marketplace.visualstudio.com/items?itemName=pomdtr.excalidraw-editor)

---

## What It Is

Excalidraw is a whiteboard-style drawing tool with a hand-drawn aesthetic. In WDS, its killer feature is that `.excalidraw` files are **plain JSON** — meaning agents can programmatically create, modify, and clean up wireframes while the user edits the same file visually in VS Code.

This creates a genuine **two-way collaboration loop** that no other wireframing tool offers:

1. Agent scaffolds wireframe from spec (JSON manipulation)
2. User opens in VS Code, tweaks layout and positions visually
3. Agent reads file back, updates spec to match
4. Agent adds new elements or cleans up annotations
5. User exports PNG for documentation

**Output formats:**
- `.excalidraw` — Editable JSON source (version controlled)
- `.png` / `.svg` — Exported images for documentation and GitHub rendering

---

## Why WDS Recommends It

**Agent-Human Collaboration:**
- Agent writes JSON, user edits visually — same file, no handoff
- The "sketchy" hand-drawn style signals "work in progress" — right tone for wireframes
- JSON diffs are readable in git — fits the plain-text WDS philosophy
- No account, no cloud service, no API keys required

**Speed:**
- Agent can scaffold a full page wireframe from a spec in one pass
- User can drag elements, adjust sizes, add hand-drawn touches instantly
- Cleanup scripts batch-remove annotations for clean exports
- No export/import cycle between tools

**Integration:**
- Lives directly in the project repository alongside specs
- VS Code extension opens files inline — no context switching
- PNG export renders on GitHub for spec review
- Object IDs and groupIds map directly to spec sections

---

## Setup Instructions

### 1. VS Code Extension

Install the Excalidraw Editor extension:

1. Open VS Code Extensions (Ctrl+Shift+X)
2. Search for "Excalidraw Editor" by pomdtr
3. Install
4. `.excalidraw` files now open as visual drawings in VS Code

### 2. Folder Convention

Place wireframe files in the page's Sketches folder:

```
C-UX-Scenarios/
└── 01-about-pages/
    └── 1.1-hem/
        ├── 1.1-hem.md              # Spec (references wireframe)
        └── Sketches/
            ├── 1.1-hem-wireframe.excalidraw   # Editable source
            └── 1.1-hem-wireframe.png           # Exported image
```

### 3. No Additional Setup Required

Excalidraw requires no accounts, API keys, or cloud services. The VS Code extension is all you need.

---

## File Format Reference

### Structure

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://marketplace.visualstudio.com/items?itemName=pomdtr.excalidraw-editor",
  "elements": [ ... ],
  "appState": { ... }
}
```

### Element Properties

| Property | Purpose | Example |
|----------|---------|---------|
| `id` | Unique identifier | `"elem_30"`, `"hero_badge_bg"` |
| `type` | Element type | `"rectangle"`, `"text"`, `"line"`, `"ellipse"` |
| `x`, `y` | Position | `211`, `400` |
| `width`, `height` | Size | `1440`, `80` |
| `strokeColor` | Stroke/text color | `"#1e1e1e"`, `"#ffffff"` |
| `backgroundColor` | Fill color | `"#364fc7"`, `"transparent"` |
| `groupIds` | Section membership | `["header"]`, `["hero"]` |
| `text` | Text content (text elements) | `"Bilverkstad på\nnorra Öland"` |
| `fontSize` | Font size (text elements) | `48`, `14` |
| `fontFamily` | Font style | 1=handwritten, 2=sans-serif, 3=monospace |

### GroupIds Convention

Map groupIds to spec sections:

| groupId | Spec Section |
|---------|-------------|
| `"header"` | Site Header |
| `"service-menu"` | Service Menu |
| `"hero"` | Hero Section |
| `"vehicle-icons"` | Vehicle Icon Bar |
| `"about"` | About Preview |
| `"trust-card-0"` | Trust Card 1 |
| `"seasons"` | Seasons Section |
| `"season-0"` | Season Card (Spring) |
| `"footer"` | Footer |

---

## WDS Workflows

### Workflow A: Agent Scaffolds Wireframe from Spec

When a page spec exists but has no wireframe yet:

```
1. Agent reads page spec (sections, objects, content)
2. Agent creates .excalidraw JSON with elements for each section
   - Rectangles for containers and image placeholders
   - Text elements for headings, body, labels
   - Lines for dividers and decorations
   - groupIds matching spec sections
3. Agent adds annotation layer (optional, for dev reference)
4. User opens file, adjusts layout visually
5. User exports PNG
6. Agent updates spec header to reference wireframe + PNG
```

**Agent code pattern:**

```javascript
const fs = require('fs');

const data = {
  type: 'excalidraw',
  version: 2,
  source: 'https://marketplace.visualstudio.com/items?itemName=pomdtr.excalidraw-editor',
  elements: []
};

// Add a section background
data.elements.push({
  type: 'rectangle',
  id: 'hero_bg',
  x: 100, y: 200, width: 1440, height: 600,
  strokeColor: '#1e1e1e',
  backgroundColor: '#343a40',
  groupIds: ['hero'],
  // ... other required properties
});

// Add a text element
data.elements.push({
  type: 'text',
  id: 'hero_heading',
  x: 200, y: 350, width: 500, height: 60,
  strokeColor: '#ffffff',
  text: 'Page Heading',
  fontSize: 48,
  fontFamily: 1,
  groupIds: ['hero'],
  // ... other required properties
});

fs.writeFileSync('wireframe.excalidraw', JSON.stringify(data, null, 2));
```

### Workflow B: Agent Updates Existing Wireframe

When the wireframe needs changes (new elements, cleanup, style updates):

```
1. Agent reads .excalidraw JSON
2. Agent modifies elements array:
   - Add: data.elements.push(newElement)
   - Remove: data.elements = data.elements.filter(e => !removeIds.has(e.id))
   - Update: element.strokeColor = '#ffffff'
3. Agent writes file back
4. User closes and reopens tab in VS Code (extension caches in memory)
5. User reviews, adjusts, exports new PNG
```

### Workflow C: Spec ↔ Wireframe Sync

When wireframe and spec need to stay aligned:

```
Wireframe changed → Update spec:
1. Agent reads wireframe, catalogs all text elements and groups
2. Agent compares against spec sections
3. Agent updates spec: layout diagram, object specs, Object ID table

Spec changed → Update wireframe:
1. Agent reads spec for new/changed objects
2. Agent adds/modifies wireframe elements
3. User adjusts layout visually
```

### Workflow D: Annotation and Cleanup

For development annotations that should be removed before export:

```
Adding annotations:
- Red (#e03131) + fontFamily 3 = component ID labels: [object-id]
- Brown (#846358) + fontFamily 3 = section numbers: ①②③
- Green (#2f9e44) + fontFamily 3 = change notes
- Place outside page boundaries (x < 100 or x >= 1560)
- Leave groupIds empty (not part of any section)

Removing annotations (before export):
- Filter by strokeColor: #e03131, #846358, #2f9e44
- Filter by fontFamily: 3 (monospace = annotation font)
- Filter by position: outside page bounds
- Filter by empty groupIds
```

---

## Spec Page Integration

### Header Format

Every spec page that has a wireframe should use this header structure:

```markdown
### page-name

**Previous Step:** ...
**Next Step:** → ...

![Page Wireframe](Sketches/page-wireframe.png)

[page-wireframe.excalidraw](Sketches/page-wireframe.excalidraw) (open in VS Code with Excalidraw extension)

**Previous Step:** ...
**Next Step:** → ...

---
```

**Key rules:**
- Navigation appears **above and below** the wireframe (user shouldn't have to scroll back up)
- PNG image renders inline on GitHub
- Excalidraw link opens in VS Code for editing

### Layout Structure Diagram

The spec should include an ASCII layout diagram that matches the wireframe:

```
┌──────────────────────────────────────────────────────────────────┐
│ [SHARED] Site Header                                             │
├──────────────────────────────────────────────────────────────────┤
│ [PAGE] Hero Section                                              │
│ Status badge, H1, subtitle, CTA buttons                         │
├──────────────────────────────────────────────────────────────────┤
│ [PAGE] Content Section                                           │
├──────────────────────────────────────────────────────────────────┤
│ [SHARED] Footer                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## WDS Best Practices

### DO

**1. Use GroupIds Consistently**
- Every element belongs to a group matching its spec section
- Shared components: `"header"`, `"service-menu"`, `"footer"`
- Page sections: `"hero"`, `"about"`, `"trust-card-0"`, `"season-2"`

**2. Use Descriptive Element IDs**
- `"hero_badge_bg"`, `"lang_pill_bg"`, `"hitta_btn_bg"`
- Or sequential: `"elem_1"`, `"elem_2"` for initial scaffolding

**3. Keep Wireframe Content Accurate**
- Text in wireframe should match spec content (at least Swedish version)
- Layout proportions should roughly match intended design
- Use placeholder patterns (X-cross lines) for image areas

**4. Export PNG After Each Major Change**
- PNG is what renders on GitHub
- Excalidraw extension has built-in export
- Keep PNG and .excalidraw in sync

**5. Version Control Both Files**
- Commit `.excalidraw` (editable source) and `.png` (rendered image)
- JSON diffs show exactly what changed

### DON'T

**1. Don't Leave Annotations in Exports**
- Always clean up red/brown/green annotations before PNG export
- Agent can batch-remove with a filter script

**2. Don't Over-Detail Wireframes**
- Wireframes show layout and content hierarchy, not pixel-perfect design
- The hand-drawn style is a feature — it communicates "this is iterative"
- Save visual polish for Figma or production code

**3. Don't Edit While Agent Is Writing**
- VS Code extension caches in memory
- If agent modifies file on disk, close and reopen the tab
- Avoid simultaneous edits

**4. Don't Add Annotations to Exported Images**
- Annotations are for the editable .excalidraw file only
- PNG should show only what the end user sees

---

## Caveats and Limitations

### VS Code Extension Caching

The Excalidraw VS Code extension caches file content in memory. When the agent modifies the `.excalidraw` file on disk via scripts, the editor tab does **not** auto-reload. The user must **close and reopen** the tab to see changes.

**Always warn the user about this after programmatic modifications.**

### No MCP Server

Unlike Figma, Excalidraw has no MCP server for live bidirectional sync. The agent reads and writes the JSON file directly. This is actually simpler — no server setup, no API keys, no network dependency.

### Desktop Canvas Size

Wireframes use a 1440px desktop canvas width convention:
- Page content area: x=100 to x=1540
- Annotations: x < 100 (left margin) or x >= 1560 (right margin)

### Export Quality

PNG export from the VS Code extension is adequate for documentation. For higher quality, open the file at excalidraw.com and export from there.

---

## When to Use

### Use Excalidraw for:

- **Phase 4 wireframing** — Layout structure, content hierarchy, component placement
- **Spec ↔ wireframe sync** — Agent keeps both artifacts aligned
- **Iterative design** — User adjusts layout, agent updates spec
- **Documentation** — PNG renders on GitHub, Excalidraw source stays editable
- **Early mockups** — Quick visual representation of page structure

### Don't use for:

- **Pixel-perfect design** — Use Figma for production-ready visuals
- **Image asset creation** — Use NanoBanana for hero photos, card images
- **Interactive prototypes** — Use HTML/Astro prototypes for interactivity
- **Design system documentation** — Use Figma or code-based design tokens

---

## Resources

- Website: <https://excalidraw.com>
- VS Code Extension: [Excalidraw Editor](https://marketplace.visualstudio.com/items?itemName=pomdtr.excalidraw-editor)
- File Format: <https://github.com/excalidraw/excalidraw/blob/master/packages/excalidraw/data/json.ts>

---

[← Back to Tools](wds-tools-guide.md)
