---
name: Object Type Router
description: Intelligent object detection and routing system for page specification
web_bundle: true
---

# Object Type Router

**Goal:** Analyze sketch objects, detect type, assess complexity, and route to appropriate specification template

**Your Role:** Intelligent router providing object analysis and specification guidance

---

## OVERVIEW

Router workflow used within the page specification process (called from step 4c-03).

**Not a standalone workflow** — only used within page specification.

---

## THE 3-STEP PROCESS

### Step 1: Text Detection (Priority)

**FIRST:** Check for horizontal line pairs
- 2 parallel lines = 1 line of text
- Multiple pairs = multiple text lines
- Single lines = decorative (borders, dividers)

**If text detected** → Route to [heading-text.md](templates/heading-text.md)

**Reference:** [TEXT-DETECTION-PRIORITY.md](TEXT-DETECTION-PRIORITY.md)

### Step 2: Object Analysis (if not text)

- Analyze visual shape, style, interactive indicators, context
- Suggest object type with reasoning
- Get user confirmation

**Reference:** [object-router.md](object-router.md)

### Step 3: Complexity Assessment

**Simple Component** (single state, no business logic):
→ Document in page specification only

**Complex Component** (3+ states, business rules, multi-step interactions):
→ Route to decomposition coaching

**Reference:** [COMPLEXITY-ROUTER.md](COMPLEXITY-ROUTER.md)

---

## ROUTING FLOW

```
Start
  ↓
[1] Text Detection Priority
  ├─ Horizontal line pairs?
  │   ├─ YES → Route to heading-text.md
  │   └─ NO → Continue to [2]
  ↓
[2] Object Analysis
  ├─ Analyze visual/context
  ├─ Suggest interpretation
  ├─ Get user confirmation
  └─ Confirmed type → Continue to [3]
  ↓
[3] Complexity Assessment
  ├─ Simple → Route to object template
  └─ Complex → Complexity Router (decomposition)
```

**Full diagram:** [ROUTER-FLOW-DIAGRAM.md](ROUTER-FLOW-DIAGRAM.md)

---

## AVAILABLE OBJECT TYPES

### Text Elements
**[Heading / Text](templates/heading-text.md)** — Headings, paragraphs, labels, captions

### Interactive Elements
- **[Button](templates/button.md)** — Primary, secondary, icon buttons
- **[Text Input](templates/text-input.md)** — Single-line inputs, search, forms
- **[Link](templates/link.md)** — Text, navigation, action links
- **[Image](templates/image.md)** — Static, responsive, placeholders
- Additional: Textarea, Select, Checkbox, Radio, Toggle

### Container Elements
Card, Modal/Dialog, Table, List

### Navigation Elements
Navigation menu, Tabs, Breadcrumbs

### Status Elements
Badge, Alert/Toast, Progress indicator

### Custom Components
Unique to project — decomposed via Complexity Router

---

## INTERPRETATION APPROACH

**Trust-the-Agent:** Agent interprets with reasoning, user confirms.

When interpreting, explain:
- What visual cues you see (placement, color, shape)
- What you think it does (purpose, behavior)
- Why you chose this type

User can confirm, clarify, or correct.

---

## FILES REFERENCE

**Router Files:**
- [object-router.md](object-router.md) — Main routing logic
- [COMPLEXITY-ROUTER.md](COMPLEXITY-ROUTER.md) — Complexity assessment
- [ROUTER-FLOW-DIAGRAM.md](ROUTER-FLOW-DIAGRAM.md) — Visual flow
- [TEXT-DETECTION-PRIORITY.md](TEXT-DETECTION-PRIORITY.md) — Text detection rules

**Object Templates:** All in [templates/](templates/) — button.md, heading-text.md, text-input.md, image.md, link.md
