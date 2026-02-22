---
name: Modular Component Architecture
description: Reference guides for three-tier specification system (Pages, Components, Features)
web_bundle: true
---

# Modular Component Architecture

**Goal:** Understand and apply three-tier architecture for component specification

**Your Role:** Architecture reference for designing modular, maintainable component systems

---

## OVERVIEW

This is a **guide collection** for three-tier modular architecture, not a step-by-step workflow.

**Three-Tier System:**
- **Pages** - Full page layouts and compositions
- **Components** - Reusable UI elements (simple and complex)
- **Features** - Complex component decompositions

**Purpose:** Separate concerns, reduce duplication, enable modularity

---

## WHEN TO USE

**Use these guides when:**
- ✅ Writing page specifications
- ✅ Decomposing complex components
- ✅ Deciding where to document content
- ✅ Need to understand component complexity
- ✅ Want to optimize agent-designer collaboration

**Skip these guides when:**
- ❌ Building simple prototypes without specs
- ❌ Already familiar with the architecture
- ❌ Using different specification system

---

## THE FOUR SECTIONS

### 00. Foundation

**[Agent-Designer Collaboration](00-foundation/agent-designer-collaboration.md)**

How AI agents optimize designer craft without replacing designer thinking.

**Use when:** Understanding the philosophy behind modular architecture

**Topics:**
- Designer maintains creative control
- AI handles decomposition and optimization
- Collaborative workflow patterns

---

### 01. Core Concepts

Three fundamental concepts of the architecture:

**[Three-Tier Overview](01-core-concepts/three-tier-overview.md)**
- Overview of Pages, Components, and Features separation
- When to use each tier
- Benefits of separation

**[Content Placement Rules](01-core-concepts/content-placement-rules.md)**
- Decision tree for where to document content
- Simple vs complex component rules
- Page-specific vs shared content

**[Complexity Detection](01-core-concepts/complexity-detection.md)**
- How to identify simple vs complex components
- When to decompose further
- Complexity indicators

**Use when:** Learning the architecture or making placement decisions

---

### 02. Workflows

Practical workflows for applying the architecture:

**[Page Specification Workflow](02-workflows/page-specification-workflow.md)**
- Step-by-step page decomposition from sketch to specs
- Extracting components from page layouts
- Handling page-specific content

**[Complexity Router Workflow](02-workflows/complexity-router-workflow.md)**
- Guided decomposition for complex components
- When to create feature folders
- Substep breakdown patterns

**[Storyboards Guide](02-workflows/storyboards-guide.md)**
- Using visual storyboards for complex components
- State documentation
- Interaction flows

**Use when:** Actively creating specifications

---

### 03. Quick References

Fast lookup guides for common questions:

**[Decision Tree](03-quick-refs/decision-tree.md)**
- One-page flowchart for file placement
- Quick decision making
- Common scenarios

**[Benefits Summary](03-quick-refs/benefits.md)**
- Why this architecture works
- Advantages of three-tier system
- Problem it solves

**Use when:** Need quick answers or reminders

---

## DETAILED NAVIGATION

For comprehensive navigation of all guides and substeps:

**[Modular Architecture Guide](00-MODULAR-ARCHITECTURE-GUIDE.md)**

This provides detailed index of all files including examples and substeps.

---

## QUICK START

### "Where do I document this component?"

Start here: [Content Placement Rules](01-core-concepts/content-placement-rules.md)

Then use: [Decision Tree](03-quick-refs/decision-tree.md)

---

### "How do I write a page specification?"

Start here: [Page Specification Workflow](02-workflows/page-specification-workflow.md)

Reference: [Three-Tier Overview](01-core-concepts/three-tier-overview.md)

---

### "When should I decompose a component?"

Start here: [Complexity Detection](01-core-concepts/complexity-detection.md)

Then use: [Complexity Router Workflow](02-workflows/complexity-router-workflow.md)

---

### "How do I document complex interactions?"

Start here: [Storyboards Guide](02-workflows/storyboards-guide.md)

Reference: [Complexity Router Workflow](02-workflows/complexity-router-workflow.md)

---

## INTEGRATION WITH WDS

### During Page Specification Phase

After sketching, before implementation:

1. Review page sketch
2. Apply [Page Specification Workflow](02-workflows/page-specification-workflow.md)
3. Use [Content Placement Rules](01-core-concepts/content-placement-rules.md) for each component
4. Document simple components inline
5. Create feature folders for complex components
6. Use [Complexity Router](02-workflows/complexity-router-workflow.md) for decomposition

### During Prototype Implementation

When building from specs:

1. Read page specification
2. Identify shared vs page-specific components
3. Build modular component library
4. Reference storyboards for complex interactions

---

## ARCHITECTURE BENEFITS

**For Designers:**
- ✅ Reduced duplication
- ✅ Clear decision framework
- ✅ Maintain creative control
- ✅ Better AI collaboration

**For Developers:**
- ✅ Modular component structure
- ✅ Clear implementation boundaries
- ✅ Reusable components identified
- ✅ Less ambiguity

**For Teams:**
- ✅ Consistent specification format
- ✅ Scalable architecture
- ✅ Easier maintenance
- ✅ Better handoff quality

---

## KEY PRINCIPLES

**1. Separation of Concerns**
- Pages handle layout and composition
- Components define reusable elements
- Features decompose complex components

**2. DRY (Don't Repeat Yourself)**
- Define once, reference everywhere
- Shared components in component library
- Page-specific variants documented inline

**3. Progressive Complexity**
- Start simple
- Decompose only when needed
- Use complexity detection to guide decisions

**4. Designer Agency**
- AI assists but doesn't replace designer thinking
- Designer makes final placement decisions
- Architecture enables, doesn't constrain

---

## TROUBLESHOOTING

### "I don't know if my component is complex enough to decompose"

Use: [Complexity Detection](01-core-concepts/complexity-detection.md)

Look for: Multiple states, conditional logic, nested interactions

### "I'm not sure where to document this content"

Use: [Decision Tree](03-quick-refs/decision-tree.md)

Ask: Is it page-specific or shared? Simple or complex?

### "The page specification feels too long"

Use: [Complexity Router Workflow](02-workflows/complexity-router-workflow.md)

Extract complex components to feature folders

---

## EXAMPLES

Throughout the guides, you'll find examples:

- **Simple Button** - Single file documentation
- **Complex Calendar** - Three-tier decomposition
- **Search Bar** - Page-specific content handling

These demonstrate the architecture in practice.

---

## NOTES

**This is architecture guidance** - not mandatory workflow steps.

Apply as needed based on:
- Project complexity
- Team size
- Specification requirements
- Development process

The architecture scales from small to large projects.

**Start simple, add structure when needed.**

---

_Modular Component Architecture - Clear structure, better collaboration_
