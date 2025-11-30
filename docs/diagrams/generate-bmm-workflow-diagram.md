# Generate BMM Workflow Diagram

This prompt generates a D2 diagram showing the BMad Method (BMM) workflow phases and their workflows.

## Instructions

Read workflow structure from the manifest and generate a D2 diagram with the following specifications:

### 1. Load Workflow Manifest

Read `docs/diagrams/workflow-manifest.yaml` to get:

- **Version info**: `bmad_version` for the diagram title
- **Entry point**: `entry.workflow-init` with its output file
- **Phases**: All 4 phases (discovery, planning, solutioning, implementation)
  - Phase labels, directories, optional flags
  - Workflows within each phase (id, name, outputs)
  - Connections within phases
  - Decision points (e.g., "Has UI?")
  - Feedback loops (Phase 4)
- **Quick Flow**: Separate diagram with its own entry and workflows
- **Cross-phase connections**: How phases connect to each other
- **Legend**: All output documents with descriptions

**Do NOT scan the codebase** - all workflow information is in the manifest.

### 2. Diagram Structure

```
direction: down

# Top-level vertical layout
grid-rows: 3
grid-columns: 1
grid-gap: 20

# Row 1: Title
title: "BMAD METHOD V{VERSION}"  # Uppercase for blueprint aesthetic

To get version:
1. Read `bmad_version` from workflow-manifest.yaml
2. Use verbatim with "V" prefix uppercase: e.g., "6.0.0-alpha.12" → "V6.0.0-ALPHA.12"

# Row 2: Entry point (workflow-init)
# Position above border between Phase 1 and 2 using spacers:
init-row with grid-columns: 4
  - 1 spacer left
  - workflow-init box
  - 2 spacers right

# Row 3: Lanes container
lanes with grid-columns: 4 for 4 phases side-by-side
```

### 3. Phase Layout

Use ELK layout engine for better container width support:

```d2
vars: {
  d2-config: {
    layout-engine: elk
  }
}
```

Each phase is a colored container with explicit width for A4 landscape ratio:

- **Phase 1 (Discovery)**: Teal/cyan (#e8f4f8), dashed border (optional phase), width: 400
  - Contains "Activities (any order)" sub-container
  - All activities flow to product-brief
- **Phase 2 (Planning)**: Purple/lavender (#f0e8f8), width: 350
  - tech-spec at top (quick-flow entry point)
  - prd → Has UI? → ux-design flow
- **Phase 3 (Solutioning)**: Gold/amber (#f8f0e8), width: 400
  - Vertical flow: architecture → epics-and-stories → impl-readiness
- **Phase 4 (Implementation)**: Green/mint (#e8f8f0), width: 520
  - Vertical flow with feedback loops (orange dashed)
  - Loops: fixes (review→dev), next story (dev→create), next epic (retro→sprint)

Set `grid-gap: 90` on lanes container to achieve ~1.41:1 A4 landscape ratio.

### 4. Naming Convention

All workflow boxes use:

- Forward slash prefix: `/workflow-name`
- Kebab-case: `/sprint-planning`, `/code-review`
- Decision diamonds don't get slashes: "Has UI?"

### 5. Output Document Labels

Workflows that produce artifacts show the output filename on a second line:

```d2
# Use newline to show output document
brief: "/product-brief\n@product-brief.md" { class: n1 }
prd: "/prd\n@PRD.md" { class: n2 }
```

**Get output documents from the manifest:**

- Read each workflow's `outputs` array
- For each output file, show it on a second line with the workflow name
- Example: If workflow `product-brief` has output `@product-brief.md`, render as `/product-brief\n@product-brief.md`

Post-process SVG to make `@*` lines smaller (14px) and gray (#777):

```python
# In shrink-output-labels.py
pattern = r'<tspan[^>]*>@[^<]*</tspan>'
# Add: font-size="14px" fill="#777777"
```

### 6. Cross-Phase Connections

**Get connections from the manifest:**

- Read `cross_phase_connections` array for main diagram connections
- Read `phases.*.connections` for within-phase connections
- Read `phases.*.decisions` for decision points
- Read `phases.*.feedback_loops` for Phase 4 loops

**Note**: Quick-flow is a separate diagram (not connected to main diagram)

### 7. Styling Classes

```d2
classes: {
  phase1-box: { fill: "#e8f4f8", stroke: "#2d7d9a", stroke-width: 3, border-radius: 12 }
  phase2-box: { fill: "#f0e8f8", stroke: "#7d2d9a", stroke-width: 3, border-radius: 12 }
  phase3-box: { fill: "#f8f0e8", stroke: "#9a7d2d", stroke-width: 3, border-radius: 12 }
  phase4-box: { fill: "#e8f8f0", stroke: "#2d9a7d", stroke-width: 3, border-radius: 12 }
  n1: { fill: "#fff", stroke: "#2d7d9a", stroke-width: 2, border-radius: 4, font-size: 18 }
  n2: { fill: "#fff", stroke: "#7d2d9a", stroke-width: 2, border-radius: 4, font-size: 18 }
  n3: { fill: "#fff", stroke: "#9a7d2d", stroke-width: 2, border-radius: 4, font-size: 18 }
  n4: { fill: "#fff", stroke: "#2d9a7d", stroke-width: 2, border-radius: 4, font-size: 18 }
  decision: { shape: diamond, fill: "#fff8e8", stroke: "#7d2d9a" }
  opt: { stroke: "#888", fill: "#f8f8f8", stroke-dash: 5 }
}
```

### 8. Title Styling

Title should be:

- Large font (48px)
- Bold
- Uppercase
- Dark blue color (#1a3a5c)

Post-process to apply outline/hollow letter effect:

```python
# In outline-title.py - make title have stroke but no fill
pattern = r'(<text[^>]*)(fill="#[^"]*")([^>]*style="[^"]*font-size:48px">BMAD METHOD[^<]*</text>)'
replacement = r'\1fill="none" stroke="#1a3a5c" stroke-width="2"\3'
```

### 9. Font

Use ShareTechMono for technical/monospace aesthetic:

```bash
d2 --font-regular=fonts/ShareTechMono-Regular.ttf \
   --font-bold=fonts/ShareTechMono-Regular.ttf \
   bmm-workflow.d2 bmm-workflow.svg
```

### 10. Output Generation

Generate files in this order:

1. `bmm-workflow.d2` - the diagram source
2. Generate base SVG:
   ```bash
   d2 --font-regular=fonts/ShareTechMono-Regular.ttf \
      --font-bold=fonts/ShareTechMono-Regular.ttf \
      bmm-workflow.d2 bmm-workflow-technical.svg
   ```
3. Post-process for output label styling:
   ```bash
   python3 scripts/shrink-output-labels.py bmm-workflow-technical.svg bmm-workflow.svg
   ```
4. Post-process for outline title:
   ```bash
   python3 scripts/outline-title.py bmm-workflow.svg bmm-workflow.svg
   ```
5. Left-align the title:
   ```bash
   python3 scripts/left-align-title.py bmm-workflow.svg bmm-workflow.svg
   ```
6. Inject legend into top-right:
   ```bash
   python3 scripts/inject-legend.py bmm-workflow.svg bmm-workflow.svg
   ```
7. Convert to PNG (max width 1600px to keep file size reasonable):
   ```bash
   rsvg-convert bmm-workflow.svg -w 1600 -o bmm-workflow.png
   ```
8. Verify PNG size before reading (must check dimensions first):
   ```bash
   identify bmm-workflow.png  # Should be ~1600x1150 or smaller
   ```
   If dimensions exceed 1600px width, regenerate with `-w 1600` flag.
9. Clean up intermediate file:
   ```bash
   rm bmm-workflow-technical.svg
   ```

### 11. Post-Processing Scripts

Located in `scripts/` directory:

**shrink-output-labels.py** - Makes `@*.md` labels smaller and gray
**outline-title.py** - Applies hollow/outline effect to title text

### 12. Self-Check

Before finalizing, verify the following:

**Manifest Loading:**

- [ ] workflow-manifest.yaml loaded successfully
- [ ] Version extracted from manifest for title
- [ ] All 4 phases read from manifest
- [ ] Quick-flow section read from manifest
- [ ] All connections and decisions extracted

**Layout & Structure**

- [ ] Four phases displayed horizontally (left to right: Discovery → Planning → Solutioning → Implementation)
- [ ] Phase 1 has dashed border (optional phase)
- [ ] Phases 2-4 have solid borders
- [ ] All workflow boxes are consistent sizes (not shrunk or expanded)
- [ ] Aspect ratio is approximately 1.41:1 (A4 landscape)

**Workflow Boxes**

- [ ] All workflow names start with `/` prefix
- [ ] Decision diamond ("Has UI?") has no `/` prefix
- [ ] Workflows with outputs show `@filename.md` on second line
- [ ] Output labels are smaller and grayed (after post-processing)

**Connections**

- [ ] `/workflow-init` connects to Phase 1 activities (solid line)
- [ ] `/workflow-init` connects to `/tech-spec` (dashed line, "Quick-flow" label)
- [ ] `/product-brief` → `/prd` connection exists
- [ ] "Has UI?" diamond has "Yes" → `/ux-design` and "No" → `/architecture`
- [ ] `/tech-spec` → `/epics-and-stories` (dashed line, quick-flow path)
- [ ] `/impl-readiness` → `/sprint-planning` connection exists

**Phase 4 Feedback Loops**

- [ ] `/code-review` → `/dev-story` loop exists (orange dashed, "fixes" label)
- [ ] `/dev-story` → `/create-story` loop exists (orange dashed, "next story" label)
- [ ] `/retrospective` → `/sprint-planning` loop exists (orange dashed, "next epic" label)

**Title**

- [ ] Title is uppercase: "BMAD METHOD V{VERSION}"
- [ ] Title has outline/hollow letter effect (after post-processing)
- [ ] Version matches current release tag

**Output Documents**

- [ ] `/product-brief` shows `@product-brief.md`
- [ ] `/tech-spec` shows `@tech-spec.md`
- [ ] `/prd` shows `@PRD.md`
- [ ] `/ux-design` shows `@ux-design.md`
- [ ] `/architecture` shows `@architecture.md`
- [ ] `/epics-and-stories` shows `@epics/*.md`
- [ ] `/create-story` shows `@story-*.md`

**Final Output**

- [ ] SVG renders correctly in browser
- [ ] PNG converts without font issues (use `rsvg-convert`)
- [ ] No text overflow or clipping in boxes
- [ ] Colors match phase scheme (teal, purple, gold, green)
- [ ] Legend box in top-right with all output document descriptions
- [ ] Red herring fish stamp visible in bottom-right corner, rotated
- [ ] Footer with metadata (date, repository, license, distribution statement)
