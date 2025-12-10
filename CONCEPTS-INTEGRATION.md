# Concepts Integration Map

**Where Greenfield/Brownfield and Kaizen/Kaikaku concepts are documented in WDS**

---

## Core Documentation

### Glossary (Complete Reference)

**File:** `src/core/resources/wds/glossary.md`

**Contains:**

- ✅ Greenfield Development (definition, origin, examples)
- ✅ Brownfield Development (definition, origin, examples)
- ✅ Kaizen (改善) - Continuous Improvement (definition, philosophy, examples)
- ✅ Kaikaku (改革) - Revolutionary Change (definition, philosophy, examples)
- ✅ Muda (無駄) - Waste (types, elimination)
- ✅ Comparison tables
- ✅ Usage examples
- ✅ When to use each approach

**Purpose:** Complete reference for all philosophical concepts

---

## Workflow Documentation

### 1. Project Type Selection

**File:** `src/modules/wds/workflows/workflow-init/project-type-selection.md`

**Concepts integrated:**

- ✅ **Greenfield Development** - New Product entry point
- ✅ **Brownfield Development** - Existing Product entry point
- ✅ Definitions and origins
- ✅ When to choose each
- ✅ Comparison table

**Section:** "Software Development Terminology"

**Usage:**

```
Which type of project are you working on?

1. New Product (Greenfield)
2. Existing Product (Brownfield)
```

---

### 2. Phase 8 Workflow

**File:** `src/modules/wds/workflows/8-ongoing-development/workflow.md`

**Concepts integrated:**

- ✅ **Kaizen (改善)** - Continuous Improvement (detailed)
- ✅ **Kaikaku (改革)** - Revolutionary Change (detailed)
- ✅ When to use each approach
- ✅ The balance between Kaikaku and Kaizen
- ✅ Japanese characters and meanings

**Section:** "Lean Manufacturing Philosophy"

**Key insight:**

```
Kaikaku (改革): Build product v1.0 (Phases 1-7)
    ↓
Launch
    ↓
Kaizen (改善): Continuous improvement (Phase 8)
    ↓
Kaizen cycle 1, 2, 3, 4, 5... (ongoing)
```

---

### 3. Existing Product Guide

**File:** `src/modules/wds/workflows/8-ongoing-development/existing-product-guide.md`

**Concepts integrated:**

- ✅ **Brownfield + Kaizen** - Phase 8 approach
- ✅ **Greenfield + Kaikaku** - Phases 1-7 approach
- ✅ Terminology explanations

**Title updated to:**
"Phase 8: Existing Product Development (Brownfield + Kaizen)"

**Section:** "Two Entry Points to WDS"

---

### 4. Phase 8 Step 8.8 (Iterate)

**File:** `src/modules/wds/workflows/8-ongoing-development/steps/step-8.8-iterate.md`

**Concepts integrated:**

- ✅ **Kaizen vs Kaikaku** comparison
- ✅ Quick reference for designers
- ✅ Link to glossary

**Section:** "Kaizen vs Kaikaku"

**Usage:**
Reminds designers they're in Kaizen mode (small, continuous improvements) vs Kaikaku mode (revolutionary change).

---

## Concept Usage by WDS Phase

### Phases 1-7: New Product Development

**Approach:** Greenfield + Kaikaku

**Characteristics:**

- Starting from scratch
- Complete user flows
- Revolutionary change
- Full Design Deliveries (DD-XXX)
- Months of work

**Concepts:**

- Greenfield Development
- Kaikaku (改革) - Revolutionary Change

---

### Phase 8: Ongoing Development

**Approach:** Brownfield + Kaizen

**Characteristics:**

- Existing product
- Incremental improvements
- Continuous improvement
- System Updates (SU-XXX)
- 1-2 week cycles

**Concepts:**

- Brownfield Development
- Kaizen (改善) - Continuous Improvement
- Muda (無駄) - Waste elimination

---

## Quick Reference

### When Starting a Project

**Question:** "Are you building from scratch or improving existing?"

**Answer 1: From Scratch**
→ Greenfield + Kaikaku
→ Phases 1-7
→ Design Deliveries (DD-XXX)
→ Revolutionary change

**Answer 2: Existing Product**
→ Brownfield + Kaizen
→ Phase 8
→ System Updates (SU-XXX)
→ Continuous improvement

---

### When in Phase 8

**Question:** "Should I do small improvements or big redesign?"

**Small Improvements (Kaizen 改善):**

- ✅ Product is working
- ✅ Want low-risk changes
- ✅ 1-2 week cycles
- ✅ Continuous learning
  → Stay in Phase 8, create System Updates

**Big Redesign (Kaikaku 改革):**

- ✅ Product needs overhaul
- ✅ Fundamental problems
- ✅ Months of work
- ✅ Revolutionary change
  → Return to Phases 1-7, create Design Deliveries

---

## Documentation Hierarchy

```
1. Glossary (src/core/resources/wds/glossary.md)
   └─ Complete definitions and philosophy

2. Project Type Selection (workflows/workflow-init/project-type-selection.md)
   └─ Greenfield vs Brownfield choice

3. Phase 8 Workflow (workflows/8-ongoing-development/workflow.md)
   └─ Kaizen vs Kaikaku philosophy

4. Existing Product Guide (workflows/8-ongoing-development/existing-product-guide.md)
   └─ Brownfield + Kaizen approach

5. Step 8.8 (workflows/8-ongoing-development/steps/step-8.8-iterate.md)
   └─ Quick reference during iteration
```

---

## Future Integration Opportunities

### Potential additions:

1. **Phase 1 (Project Brief)**
   - Add Greenfield vs Brownfield context
   - Adapt brief template based on project type

2. **Phase 4-5 (UX Design & Design System)**
   - Reference Kaikaku approach for new flows
   - Reference Kaizen approach for updates

3. **Phase 6 (Design Deliveries)**
   - Distinguish DD-XXX (Kaikaku) from SU-XXX (Kaizen)
   - When to use each delivery type

4. **Integration Guide**
   - Add Greenfield/Brownfield context
   - How BMad handles each approach

5. **Course Modules**
   - Teach Kaizen philosophy in Module 01
   - Explain Greenfield/Brownfield in Module 02

---

## Key Takeaways

**For Designers:**

1. Understand if you're in Greenfield or Brownfield context
2. Choose Kaikaku (revolutionary) or Kaizen (continuous) approach
3. Use appropriate deliverables (DD-XXX vs SU-XXX)
4. Follow appropriate workflow (Phases 1-7 vs Phase 8)

**For Documentation:**

1. Glossary is the source of truth
2. Concepts are integrated where relevant
3. Quick references in workflow steps
4. Consistent terminology throughout

**Philosophy:**

- Kaikaku to establish, Kaizen to improve
- Greenfield gives freedom, Brownfield gives context
- Small improvements compound over time
- Revolutionary change when necessary, continuous improvement always

---

**All concepts are now properly integrated into WDS documentation!** 🎯📚✨
