# Page Init - Entry Point

**Purpose:** Route user to appropriate page creation workflow

---

## ROUTING

<action>
**Understand from conversation context:**

Check what user has said:
- Did they mention having a sketch/wireframe/visualization?
- Did they upload an image file?
- Are they describing a page concept without visual?
- Are they asking about creating/defining a page?

**Route based on understanding:**

IF user has sketch/visualization ready:
  → Load and execute: `step-02-substeps/page-init/workshop-page-process.md`
     └─> Intelligent context detection
     └─> New page: Full analysis
     └─> Updated page: Change detection & incremental update

IF user is describing concept without visualization:
  → Load and execute: `step-02-substeps/page-init/workshop-page-creation.md`
     └─> Define page purpose and concept
     └─> Choose visualization method naturally
     └─> Create conceptual specification

IF unclear what user wants:
  → Ask natural clarifying question based on context
     Example: "Do you have a sketch or wireframe I should look at, or should we define the page concept together?"
</action>

---

## PHILOSOPHY

**The page is the conceptual entity.**

It has:
- A purpose (what it accomplishes)
- A user (who it serves)
- Sections (what areas exist)
- Objects (what interactions happen)
- A place in the flow (navigation)

**Visualization is how we represent the page.**

Methods include:
- Sketch (hand-drawn or digital)
- Wireframe (tool-based)
- ASCII layout (text-based)
- Verbal description (discussion)
- Reference (based on existing page)

**Page first. Visualization second.**

---
