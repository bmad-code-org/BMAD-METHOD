# Workshop: Page Creation (Discussion-Based)

**Purpose:** Define a page concept through conversation, create visualization method based on need

---

## CONTEXT

**This workflow activates when:** User needs to define a page concept but doesn't have a visualization yet.

**Goal:** Define what the page IS, then choose how to visualize it.

**Philosophy:** The page (concept) comes first. Visualization (method) follows.

---

## STEP 1: PAGE CONCEPT

<ask>**What is this page about?**

Tell me in your own words:
- What is this page called?
- What should it accomplish?
- Who uses it and why?

Describe the page concept:</ask>

<action>Store page_concept</action>

---

## STEP 2: VISUALIZATION PREFERENCE

<ask>**How would you like to visualize this page?**

[A] I'll draw a sketch (physical/digital) and upload it
[B] Let's describe it verbally - I'll specify sections through discussion
[C] Create a simple ASCII layout together
[D] It's similar to another page I can reference
[E] Generate HTML prototype - I'll screenshot it for documentation

Choice:</ask>

<action>Store visualization_method</action>

---

## FLOW ROUTING

Based on user choice, load the appropriate flow:

| Choice | Flow | File |
|--------|------|------|
| **A** | Sketch Path | [substeps/flow-a-sketch.md](substeps/flow-a-sketch.md) |
| **B** | Verbal Specification | [substeps/flow-b-verbal.md](substeps/flow-b-verbal.md) |
| **C** | ASCII Layout | [substeps/flow-c-ascii.md](substeps/flow-c-ascii.md) |
| **D** | Reference Page | [substeps/flow-d-reference.md](substeps/flow-d-reference.md) |
| **E** | HTML Prototype | [substeps/flow-e-html.md](substeps/flow-e-html.md) |

<action>Load and execute the selected flow substep</action>

---

## COMPLETION

<output>**Page concept defined!** 🎯

**Page:** {{page_name}}
**Method:** {{visualization_method_description}}
**Status:** Conceptual specification complete

**The page is the place where visualization meets specification.**

**What would you like to do next?**

[A] Create/upload sketch for this page
[B] Create another page
[C] Review what we've created
[D] Back to scenario overview

Choice:</output>

---

## KEY PHILOSOPHY

### ✅ **Page-Centric Thinking**

The **page** is the conceptual entity:
- Has a purpose
- Serves users
- Contains sections
- Has interactive objects
- Exists in a flow

The **visualization** is one representation:
- Sketch (preferred)
- Wireframe
- ASCII (last resort)
- Verbal description
- Reference to similar page

**The page comes first. Visualization follows.**

### ✅ **Flexible Methods**

Different projects need different approaches:
- Early concept → Verbal/ASCII → Sketch later
- Clear vision → Sketch directly
- Existing patterns → Reference + differences
- Iterative → Mix of methods

**The workshop adapts to YOUR process.**

---

## INTEGRATION

This workshop creates:
1. **Conceptual page specification** (always)
2. **Placeholder for visualization** (always)
3. **Guidance for next steps** (always)

Next workshops use:
- **workshop-page-process.md** - When sketch is ready
- **page-init-lightweight.md** - For quick structure
- **4b-sketch-analysis.md** - For detailed analysis

---

**Created:** December 28, 2025
**Purpose:** Define page concept, choose visualization method
**Philosophy:** Page first, visualization second
**Status:** Ready for use
