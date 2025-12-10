# Project Type Selection

**Choose your WDS entry point during project initialization**

---

## The Question

```
Which type of project are you working on?

1. New Product (Greenfield)
2. Existing Product (Brownfield)
```

---

## Software Development Terminology

### Greenfield Development

**Definition:** Building a new project from scratch with no constraints from existing systems.

**Origin:** Agricultural term - plowing a green field that has never been cultivated.

**In software:**

- No legacy code to maintain
- Full creative freedom
- Define architecture from scratch
- Choose tech stack freely
- Design without constraints

---

### Brownfield Development

**Definition:** Developing within an existing system with established constraints.

**Origin:** Industrial term - redeveloping land previously used for industrial purposes.

**In software:**

- Existing codebase to work with
- Legacy systems to integrate
- Established patterns to follow
- Tech stack already decided
- Work within constraints

---

## Option 1: New Product (Greenfield)

**Choose this if:**

- ✅ Starting from scratch
- ✅ No existing product or codebase
- ✅ Designing complete user flows
- ✅ Full creative freedom
- ✅ Defining tech stack
- ✅ **Greenfield development**

**You'll start with:**

- Phase 1: Project Brief (full)
- Phase 2: Trigger Map (complete)
- Phase 3: Platform Requirements (define tech stack)
- Phases 4-7: Iterative development

**Example scenarios:**

- "We're building a new dog care app from scratch"
- "Startup launching first product"
- "New feature that's completely separate from existing product"

---

## Option 2: Existing Product (Brownfield)

**Choose this if:**

- ✅ Product already exists and is live
- ✅ Brought in as "linchpin designer" to solve specific problems
- ✅ Making strategic improvements, not complete redesign
- ✅ Working within existing constraints
- ✅ Tech stack already decided
- ✅ **Brownfield development**

**You'll start with:**

- Phase 8.1: Limited Project Brief (strategic challenge)
- Phase 8.2: Existing Context (upload materials, print trigger map)
- Phase 8.3: Critical Updates (targeted changes)
- Phase 8.4-8.5: Delivery and validation

**Example scenarios:**

- "Onboarding has 60% drop-off, need to redesign it"
- "Users don't understand key feature, need UX improvements"
- "Adding new feature to existing product"
- "Improving conversion rate on checkout flow"

---

## Comparison

| Aspect                    | New Product                        | Existing Product                |
| ------------------------- | ---------------------------------- | ------------------------------- |
| **Entry Point**           | Phase 1                            | Phase 8                         |
| **Project Brief**         | Full (vision, goals, stakeholders) | Limited (strategic challenge)   |
| **Trigger Map**           | Complete (all user needs)          | Focused (specific problem)      |
| **Platform Requirements** | Define from scratch                | Already decided                 |
| **Design Scope**          | Complete user flows                | Targeted updates                |
| **Creative Freedom**      | High                               | Constrained                     |
| **Timeline**              | Months                             | Weeks                           |
| **Deliverables**          | Multiple Design Deliveries         | Design Deliveries (small scope) |

---

## Agent Prompts

### For New Product

```
Great! You're starting a new product from scratch.

Let's begin with Phase 1: Project Brief.

I'll help you define:
- Project vision and goals
- Target users and their needs
- Success criteria
- Stakeholders and team

Ready to start?
```

### For Existing Product

```
Great! You're improving an existing product.

Let's begin with Phase 8.1: Limited Project Brief.

I'll help you define:
- The strategic challenge you're solving
- Why you're bringing in a WDS designer
- Scope of changes
- Success criteria
- Constraints

First, what's the strategic challenge you're trying to solve?
```

---

## Configuration

**Project config file will include:**

```yaml
project:
  type: 'new_product' # or "existing_product"
  entry_point: 'phase_1' # or "phase_8"

# If existing_product:
existing_product:
  strategic_challenge: 'Onboarding has 60% drop-off rate'
  scope: 'Redesign onboarding flow (4 screens)'
  constraints:
    - 'Tech stack: React Native + Supabase (fixed)'
    - 'Brand: Colors and logo are fixed'
    - 'Timeline: 2 weeks'

  existing_materials:
    business_goals: 'path/to/business-goals.pdf'
    user_research: 'path/to/user-research.pdf'
    current_design_system: 'path/to/design-system/'
```

---

## Workflow Differences

### New Product Workflow

```
Phase 1: Project Brief
    ↓
Phase 2: Trigger Map
    ↓
Phase 3: Platform Requirements → [Touch Point 1]
    ↓
┌─────────────────────────────────────┐
│ ITERATIVE CYCLE                     │
├─────────────────────────────────────┤
│ Phase 4-5: Design Complete Flow     │
│ Phase 6: Design Delivery            │
│ Phase 7: Testing                    │
└─────────────────────────────────────┘
    ↓
✅ Launch
    ↓
Phase 8: Ongoing Development
```

### Existing Product Workflow

```
Phase 8.1: Limited Project Brief
    ↓
Phase 8.2: Existing Context
    ↓
Phase 8.3: Critical Updates
    ↓
Phase 8.4: Design Delivery (DD-XXX) → [Touch Point 2]
    ↓
Phase 8.5: Validation ← [Touch Point 3]
    ↓
✅ Deploy Changes
    ↓
(Repeat for next strategic challenge)
```

---

## Tips for Choosing

### Choose New Product if:

- You have time to design properly
- You want to establish best practices
- You're defining the product vision
- You have creative freedom

### Choose Existing Product if:

- You're solving a specific problem
- Timeline is tight (weeks, not months)
- Product is already live
- You're working within constraints

### Not Sure?

**Ask yourself:**

1. Is there already a live product? → Existing Product
2. Are you starting from scratch? → New Product
3. Are you redesigning one specific area? → Existing Product
4. Are you defining the entire product? → New Product

---

## Examples

### New Product Examples

**Dog Week App:**

- Type: New Product
- Entry: Phase 1
- Scope: Complete app from scratch
- Timeline: 3-6 months
- Deliveries: 10-15 Design Deliveries

**SaaS Dashboard:**

- Type: New Product
- Entry: Phase 1
- Scope: Complete dashboard experience
- Timeline: 4-8 months
- Deliveries: 15-20 Design Deliveries

---

### Existing Product Examples

**Onboarding Flow Improvement:**

- Type: Existing Product
- Challenge: 60% drop-off rate
- Scope: 4 screens
- Timeline: 2 weeks
- Delivery: 1 Design Delivery (DD-XXX, small scope)

**Checkout Flow Improvement:**

- Type: Existing Product
- Challenge: Low conversion rate
- Scope: 3 screens + payment flow
- Timeline: 3 weeks
- Delivery: 1 Design Delivery (DD-XXX, small scope)

**New Feature Addition:**

- Type: Existing Product
- Challenge: Users requesting calendar view
- Scope: New calendar feature
- Timeline: 4 weeks
- Delivery: 1 Design Delivery (DD-XXX, small scope)

---

## Migration Path

**Can you switch between modes?**

**Yes!**

**New Product → Existing Product:**
After launching, you naturally transition to Phase 8 for ongoing development.

**Existing Product → New Product:**
If you're adding a major new section that's essentially a separate product, you might start a new Phase 1 cycle for that section.

---

**Choose wisely! Your entry point determines your entire workflow.** 🚀
