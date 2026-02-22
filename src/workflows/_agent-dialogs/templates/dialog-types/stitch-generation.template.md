# {YYYY-MM-DD} {Feature Name} — Stitch UI Generation

<!--
FILE NAMING CONVENTION:
- Folder: {YYYY-MM-DD}-freya-stitch-{feature-name}/
- File:   {YYYY-MM-DD}-freya-stitch-{feature-name}-dialog.md

Example:
- Folder: 2026-01-26-freya-stitch-signin-flow/
- File:   2026-01-26-freya-stitch-signin-flow-dialog.md
-->

## Meta

| Field | Value |
|-------|-------|
| **Date** | {YYYY-MM-DD} |
| **Type** | 🪡 Stitch UI Generation |
| **Agent** | Freya (WDS Designer) |
| **Feature** | {Feature/flow name} |
| **Specifications** | [{Spec 1}]({path}), [{Spec 2}]({path}) |
| **Design Reference** | [{Reference design}]({path}) — visual style source |
| **Status** | Not Started |

---

## Purpose

Generate production-quality UI designs for {feature name} using Google Stitch AI, based on existing specifications and sketches.

---

## About This Dialog

This dialog guides the **AI-assisted UI generation workflow** using Google Stitch.

```
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│   INPUTS            │         │   STITCH PROCESS    │         │   OUTPUTS           │
│                     │         │                     │         │                     │
│ • Specifications    │────────▶│ • Prompt crafting   │────────▶│ • UI designs        │
│ • Sketches          │         │ • Generation        │         │ • Figma exports     │
│ • Reference designs │         │ • Iteration         │         │ • HTML/CSS code     │
│ • Strategic context │         │ • Refinement        │         │ • Design decisions  │
└─────────────────────┘         └─────────────────────┘         └─────────────────────┘
     Source Materials                AI Generation                  Project Assets
```

**Specifications remain the single source of truth.** Stitch generates visual interpretations that must align with spec requirements.

---

## When to Use Stitch

| Scenario | Use Stitch? | Why |
|----------|-------------|-----|
| New page with detailed spec | ✅ Yes | Accelerates visual design from requirements |
| Exploring visual directions | ✅ Yes | Quick iteration on look & feel |
| Complex multi-state UI | ⚠️ Partially | Generate base, refine states manually |
| Design system components | ❌ No | Build from tokens, not generated |
| Minor spec updates | ❌ No | Edit existing designs directly |

---

## Stitch Capabilities & Limits

### What Stitch Does Well
- Single screen generation from prompts
- Style matching from reference images
- Responsive layouts (mobile/desktop)
- Clean HTML/CSS export
- Figma-compatible output

### Current Limitations
- Best with 2-3 screens at a time
- Layouts can be generic (need refinement)
- Doesn't capture deep UX nuance
- No built-in design system awareness
- Requires iteration for production quality

---

## Setup Context

### Project Context

- **Project:** {Project name}
- **Brand:** {Brand characteristics — tone, colors, typography}
- **Tech Stack:** {e.g., React, Next.js, Tailwind CSS}
- **Design System:** [{Design System}]({path})

### Strategic Context

| Document | Path | Key Elements |
|----------|------|--------------|
| VTC/Trigger Map | [{path}]({path}) | {Key triggers for this feature} |
| User Personas | [{path}]({path}) | {Target personas} |
| Product Brief | [{path}]({path}) | {Relevant product goals} |

### Reference Materials

| Type | File | Purpose |
|------|------|---------|
| **Style Reference** | [{design}]({path}) | Visual language source for Stitch |
| **Sketch** | [{sketch}]({path}) | Layout and structure guide |
| **Specification** | [{spec}]({path}) | Requirements and content |

---

## Pre-Generation Questions

Before generating, decide for each screen:

### Question 1: Which screens need Stitch generation?

| Screen | Has Code? | Has Sketch? | Generate in Stitch? | Why |
|--------|-----------|-------------|---------------------|-----|
| {Screen 1} | ✅/❌ | ✅/❌ | ✅/❌ | {reason} |
| {Screen 2} | ✅/❌ | ✅/❌ | ✅/❌ | {reason} |

### Question 2: What visual reference for each screen?

| Option | When to Use |
|--------|-------------|
| **Screenshot of existing code** | Code exists and represents the correct visual direction |
| **Original sketch** | Starting fresh, or code doesn't match desired direction |
| **Both** | Use code as style reference + sketch for layout guidance |

| Screen | Reference Choice | Source |
|--------|------------------|--------|
| {Screen 1} | Code screenshot / Sketch / Both | {path or "take screenshot"} |
| {Screen 2} | Code screenshot / Sketch / Both | {path or "take screenshot"} |

---

## Screens to Generate

| # | Screen | Specification | Visual Reference | Layout Guide | Priority | Status |
|---|--------|---------------|------------------|--------------|----------|--------|
| 1 | {Screen name} | [{spec}]({path}) | {screenshot/sketch} | {sketch if different} | High | 🔲 |
| 2 | {Screen name} | [{spec}]({path}) | {screenshot/sketch} | {sketch if different} | High | 🔲 |

**Status:** 🔲 Not Started | 🔄 In Progress | ✅ Generated | 🔁 Needs Refinement | ✅✅ Approved

---

## Stitch Input Formula

```
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│ VISUAL REFERENCE│ + │     SKETCH      │ + │  SPECIFICATION  │ = Stitch Generation
│  (style source) │   │ (layout/structure)│   │ (paste as prompt)│
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

**That's it.** Upload the reference + sketch images, paste the spec as prompt text.

---

## Stitch Workflow Steps

### Step 1: Gather Inputs

| Input | Source | Format |
|-------|--------|--------|
| **Visual Reference** | Screenshot of existing design (e.g., start page) | Image (PNG/JPG) |
| **Sketch** | Wireframe sketch from spec folder | Image (PNG/JPG) |
| **Specification** | Full spec markdown or key sections | Text (paste into prompt) |

**Checklist:**
- [ ] Visual reference captured (shows brand style)
- [ ] Sketch image ready
- [ ] Spec content copied (full doc or key sections)

---

### Step 2: Generate in Stitch

1. Go to [stitch.withgoogle.com](https://stitch.withgoogle.com)
2. Upload **visual reference** image
3. Upload **sketch** image
4. Paste **specification** as prompt text (or key sections)
5. Add brief instruction: *"Generate this screen matching the visual style of the reference and layout of the sketch."*
6. Generate 2-3 variants
7. Select best result

**Settings:**
- Mode: Standard (fast) or Pro (higher fidelity)
- Viewport: {Mobile 390px | Desktop 1440px}

**Results:**
| Screen | Variants | Selected | Notes |
|--------|----------|----------|-------|
| {name} | {#} | v{#} | {observations} |

---

### Step 3: Review Against Spec

Quick check - does the output match spec requirements?

| Check | ✅/❌ | Fix Needed |
|-------|-------|------------|
| Content/copy matches spec | | |
| Layout follows sketch | | |
| Visual style matches reference | | |
| All key elements present | | |

**If refinement needed:** Re-prompt with specific corrections or edit in Stitch.

---

### Step 4: Export & Store

| Format | Destination |
|--------|-------------|
| **Figma** | Copy to Figma for team/design system work |
| **HTML/CSS** | `{spec-folder}/Visual-Design/` |
| **Screenshot** | `{spec-folder}/Visual-Design/` |

**Naming:** `{screen-name}-stitch-v{#}.{ext}`

---

### Step 5: Link in Spec

Add reference to the specification file:

```markdown
## Visual Design

**Stitch Generated:** [{screen-name}-stitch-v1.png](Visual-Design/{screen-name}-stitch-v1.png)
```

---

## Prompts

Store each screen's prompt in a separate file in the dialog folder.

**Naming:** Match the scenario numbering: `{scenario#}-{screen-name}-stitch-prompt.md`

| # | Screen | Prompt File | Status |
|---|--------|-------------|--------|
| 1 | {Screen 1} | [{scenario#}-{screen-name}-stitch-prompt.md]({scenario#}-{screen-name}-stitch-prompt.md) | 🔲 |
| 2 | {Screen 2} | [{scenario#}-{screen-name}-stitch-prompt.md]({scenario#}-{screen-name}-stitch-prompt.md) | 🔲 |

**Examples:** `1.2-sign-in-stitch-prompt.md`, `1.3-profile-setup-stitch-prompt.md`

Use the [stitch-prompt.template.md](../../../6-asset-generation/templates/stitch-prompt.template.md) to create each prompt file.

---

## Outputs Log

| Screen | Version | Format | Path | Approved? |
|--------|---------|--------|------|-----------|
| {name} | v1 | Figma | {link} | 🔲 |
| {name} | v2 | HTML | {path} | ✅ |

---

## Design Decisions

| Decision | Context | Rationale |
|----------|---------|-----------|
| {what was decided} | {why it came up} | {reasoning} |

---

## Spec Deviations

Issues where Stitch output differs from specification:

| Screen | Spec Requirement | Stitch Output | Resolution |
|--------|------------------|---------------|------------|
| {screen} | {requirement} | {what Stitch did} | {how resolved} |

---

## Progress Log

### {YYYY-MM-DD}

- Created dialog for {feature}
- Identified {#} screens to generate
- Prepared reference materials

<!--
### {YYYY-MM-DD}
- Generated Screen 1: {name} - v1
- Refinements needed: {list}
- Re-generated with updated prompt
- Approved ✅
-->

---

## Learnings

<!--
Capture prompt patterns and techniques that worked well.
-->

| What Worked | Why | Reuse For |
|-------------|-----|-----------|
| {technique} | {reason} | {future use} |

---

_Stitch UI Generation Dialog — Freya WDS Designer — WDS Agent Dialog Workflow_
