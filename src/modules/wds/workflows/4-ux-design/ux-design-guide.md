# Phase 4: UX Design Workflow

**Freya's domain - From sketch to specification**

---

## Overview

Phase 4 transforms sketches and ideas into detailed, developer-ready page specifications with multi-language support.

---

## Workflow Steps

| Step                  | File                           | Purpose                                   |
| --------------------- | ------------------------------ | ----------------------------------------- |
| **Init**              | `step-01-init.md`              | Welcome, load context, initialize session |
| **Define Scenario**   | `step-02-define-scenario.md`   | Plan user journey and pages               |
| **Design Page**       | `step-03-design-page.md`       | Orchestrate 4A-4E substeps per page       |
| **Complete Scenario** | `step-04-complete-scenario.md` | Finalize and summarize scenario           |
| **Next Steps**        | `step-05-next-steps.md`        | Continue or exit workflow                 |

---

## Substeps (4A-4E)

### 4A: Exploration

**File:** `substeps/4a-exploration.md`

- Think through user journey
- Clarify context and goals

### 4B: Sketch Analysis

**File:** `substeps/4b-sketch-analysis.md`

- **Section-first approach:** AI reads entire sketch, identifies all sections
- User confirms structure
- Section-by-section AI interpretation
- User refinement dialog

### 4C: Specification (Micro-steps 01-08)

**Files:** `substeps/4c-01-page-basics.md` through `4c-08-generate-spec.md`

1. **Page Basics** - Name, purpose, route
2. **Layout** - Structure, grid, responsive
3. **Components** - Identify objects, route to object-type instructions
4. **Content** - Text, images, media with translations
5. **Interactions** - Behaviors, events, state changes
6. **States** - Loading, error, empty, success
7. **Validation** - Rules, messages, error handling
8. **Generate Spec** - Complete page specification

### 4D: Prototype

**File:** `substeps/4d-prototype.md`

- Generate interactive HTML prototype
- Uses Design System if enabled
- **Visual refinement option:** Extract to Figma via MCP server if design system incomplete
- Iterative refinement: Prototype → Figma → Design System → Re-render
- See: `workflows/5-design-system/figma-integration/prototype-to-figma-workflow.md`

### 4E: PRD Update

**File:** `substeps/4e-prd-update.md`

- Extract functional requirements
- Update Product Requirements Document

---

## Object Type Instructions

**Location:** `object-types/`

Each object type has a dedicated instruction file:

| File               | Purpose                                              |
| ------------------ | ---------------------------------------------------- |
| `object-router.md` | Detects object types, routes to appropriate file     |
| `button.md`        | Button specification                                 |
| `text-input.md`    | Input field specification                            |
| `link.md`          | Link/anchor specification                            |
| `heading-text.md`  | Text element specification with purpose-based naming |
| `image.md`         | Image specification                                  |

**Key Features:**

- Purpose-based naming (function over content)
- Grouped translations (coherent language blocks)
- Design System integration (use existing, create new, or page-specific)
- Text placeholder analysis (line thickness → font weight, spacing → font size)

---

## Templates

**Location:** `templates/`

| File                             | Purpose                          |
| -------------------------------- | -------------------------------- |
| `page-specification.template.md` | Complete page spec output format |
| `scenario-overview.template.md`  | Scenario summary format          |

---

## Documentation

| File                                | Purpose                                                  |
| ----------------------------------- | -------------------------------------------------------- |
| `ARCHITECTURE.md`                   | Complete workflow architecture overview                  |
| `WDS-SPECIFICATION-PATTERN.md`      | **Standard specification format** (Dog Week as example)  |
| `TRANSLATION-ORGANIZATION-GUIDE.md` | Purpose-based text organization and grouped translations |
| `SKETCH-TEXT-ANALYSIS-GUIDE.md`     | How to interpret text markers in sketches                |
| `SKETCH-TEXT-QUICK-REFERENCE.md`    | Quick reference for text analysis                        |
| `SKETCH-TEXT-STRATEGY.md`           | When to use actual text vs. line markers                 |
| `PROACTIVE-TRANSLATION-WORKFLOW.md` | How agent suggests translations                          |
| `ROUTER-FLOW-DIAGRAM.md`            | Visual flow of object routing with examples              |

---

## Key Patterns

### 1. Section-First Workflow

- AI reads entire sketch → identifies sections
- User confirms structure
- Section-by-section interpretation
- User refines details
- Batch generation of specs

### 2. Purpose-Based Naming

- Name text by **function**, not content
- `hero-headline` not `welcome-message`
- `form-error` not `invalid-email-text`

### 3. Grouped Translations

```markdown
#### Primary Headline

**Content**:

- EN: "Welcome to Dog Week"
- SE: "Välkommen till Hundveckan"
```

### 4. Design System Integration

For each object:

1. Use existing component
2. Create new component (mark for Phase 5)
3. Page-specific only

### 5. Text Marker Analysis

- **2 lines together** = 1 line of text
- **Line thickness** = font weight (thick = bold)
- **Spacing between pairs** = font size
- **Line count** = number of text lines

---

## Multi-Language Support

**Configuration:** Set in `workflow-init`

- **Specification Language**: Language for writing specs (EN, SE, etc.)
- **Product Languages**: Languages the product supports (array)

**All text objects include translations for every product language.**

See: `LANGUAGE-CONFIGURATION-GUIDE.md` in workflows folder

---

## Example: Dog Week Start Page

The complete Dog Week Start Page specification demonstrates the pattern in action.

**See:** `WDS-SPECIFICATION-PATTERN.md`

---

## v6 Best Practices

✅ **Goal-based instructions** - Trust the agent to interpret
✅ **Micro-file design** - Small, focused instruction files
✅ **Just-in-time loading** - Only current step in memory
✅ **State tracking** - Progress in output file frontmatter
✅ **Show don't tell** - Examples over explanations

---

## Output Structure

```
docs/
  C-Scenarios/
    {scenario-name}/
      00-{scenario-name}-overview.md
      01-{page-name}.md
      02-{page-name}.md
      ...
```

Each page spec includes:

- Page metadata and purpose
- All sections with objects
- Complete multi-language content
- Component references (if Design System enabled)
- Interaction behaviors
- States and validation rules

---

**Phase 4 Status:** ✅ **COMPLETE** (December 6, 2025)
