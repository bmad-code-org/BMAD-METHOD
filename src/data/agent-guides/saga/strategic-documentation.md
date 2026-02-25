# Saga's Strategic Documentation Guide

**When to load:** When creating Product Brief, Project Outline, or any strategic documentation

---

## Core Principle

**Create documentation that coordinates teams and persists context.**

Every project needs a North Star - clear, accessible, living documentation that guides all work.

---

## The Project Outline

**Created during Product Brief (Step 1), updated throughout project**

### Purpose
- **Single source of truth** for project status
- **Coordination point** for all team members
- **Context preservation** across sessions
- **Onboarding tool** for new collaborators

---

### What Goes In Project Outline

```yaml
project:
  name: [Project Name]
  type: [digital_product|landing_page|website|other]
  status: [planning|in_progress|complete]

methodology:
  type: [wds-v6|wps2c-v4|custom]
  instructions_file: [if custom]

phases:
  phase_1_product_brief:
    folder: "docs/A-Product-Brief/"
    name: "Product Exploration"
    status: [not_started|in_progress|complete]
    artifacts:
      - product-brief.md
      - pitch-deck.md (if created)
  
  phase_2_trigger_mapping:
    folder: "docs/B-Trigger-Map/"
    name: "Trigger Mapping"
    status: [not_started|in_progress|complete]
    artifacts:
      - trigger-map.md
      - trigger-map-diagram.mermaid
  
  # ... other phases

languages:
  specification_language: "en"
  product_languages: ["en", "se"]

design_system:
  enabled: true
  mode: [none|figma|component_library]
  library: [if mode=component_library]
```

---

### When to Update Project Outline

**Always update when:**
- ✅ Completing a phase
- ✅ Creating new artifacts
- ✅ Changing project scope
- ✅ Adding new workflows

**Project outline is living documentation** - keep it current!

---

## The Product Brief

**10-step conversational workshop creates:**

### 1. Vision & Problem Statement
**What are we building and why?**

- Product vision (aspirational)
- Problem statement (what pain exists)
- Solution approach (high-level)

---

### 2. Positioning
**How are we different?**

- Target customer
- Need/opportunity
- Product category
- Key benefits
- Differentiation vs competition

**Format:** "For [target] who [need], our [product] is [category] that [benefits]. Unlike [competition], we [differentiators]."

---

### 3. Strategic Context (from Trigger Map)
**Strategic benchmark for early decisions**

Extracted from the Trigger Map to provide strategic grounding:
- Business goal
- Solution context
- Target group / persona
- Driving forces (positive + negative)
- Customer awareness progression

---

### 4. Business Model
**How do we make money?**

- Revenue model (subscription, transaction, license, etc.)
- Pricing approach
- Unit economics
- Key assumptions

---

### 5. Business Customers
**Who pays? (B2B/Enterprise)**

- Decision makers
- Budget owners
- Procurement process
- Deal cycle

**Skip if B2C.**

---

### 6. Target Users
**Who actually uses it?**

- User segments
- Demographics
- Psychographics
- Current behavior patterns

**Note:** Detailed in Trigger Map later, this is overview.

---

### 7. Success Criteria
**How do we measure success?**

- Business metrics (revenue, users, retention)
- User metrics (engagement, satisfaction, NPS)
- Technical metrics (performance, uptime)
- Timeline milestones

---

### 8. Competitive Landscape
**Who else solves this?**

- Direct competitors
- Indirect competitors
- Substitutes
- Our advantages/disadvantages

---

### 9. Unfair Advantage
**What do we have that others can't easily copy?**

- Network effects
- Proprietary data
- Domain expertise
- Strategic partnerships
- Technology
- Brand/reputation

---

### 10. Constraints
**What are our limits?**

- Budget constraints
- Timeline constraints
- Technical constraints
- Resource constraints
- Regulatory constraints

---

### 11. Tone of Voice
**How should UI microcopy sound?**

- Brand personality
- Writing principles
- Do's and don'ts
- Example phrases

**Used for:** Field labels, buttons, error messages, success messages

**NOT for:** Strategic content (that uses Content Creation Workshop)

---

### 12. Create Product Brief
**Bring it all together**

Generate complete Product Brief document using template.

**See:** `{project-root}/_bmad/wds/templates/1-project-brief/project-brief.template.md`

---

## File Naming Conventions

**CRITICAL: Never use generic names**

### ❌ Wrong (Generic)
- `README.md`
- `guide.md`
- `notes.md`
- `documentation.md`

**Why bad:** Ambiguous, unmaintainable, confusing

---

### ✅ Right (Specific)
- `product-brief.md`
- `trigger-mapping-guide.md`
- `platform-requirements.md`
- `design-system-guide.md`

**Why better:** Clear purpose, searchable, maintainable

---

### Pattern: `[TOPIC]-GUIDE.md`

**For methodology documentation:**
- `phase-1-product-exploration-guide.md`
- `value-trigger-chain-guide.md`
- `content-creation-philosophy.md`

**For deliverables:**
- `product-brief.md`
- `trigger-map.md`
- `platform-prd.md`

**For examples:**
- `wds-examples-guide.md`
- `wds-v6-conversion-guide.md`

---

## Documentation Quality Standards

### Precision
**Articulate requirements with precision while keeping language accessible**

❌ "Users probably want something to help them..."

✅ "Consultants need proposal templates that reduce formatting time by 80% while maintaining professional appearance"

---

### Evidence
**Ground all findings in verifiable evidence**

❌ "Most consultants struggle with proposals"

✅ "In 15 user interviews, 12 consultants (80%) reported spending 3+ hours per proposal on formatting alone"

---

### Accessibility
**Technical accuracy, but readable by non-experts**

❌ "Implement OAuth 2.0 authorization code flow with PKCE extension for SPA-based authentication"

✅ "Use industry-standard secure login (OAuth 2.0) that protects user data even in browser-based apps"

---

### Structure
**Clear hierarchy, scannable, actionable**

Good structure:
```markdown
# Main Topic

## Overview
[High-level summary]

## Key Concepts
### Concept 1
[Explanation]

### Concept 2
[Explanation]

## How to Use This
[Actionable steps]

## Related Resources
[Links to related docs]
```

---

## The Bible: `project-context.md`

**If this file exists, treat it as gospel.**

### What It Contains
- Project history
- Key decisions and rationale
- Technical constraints
- Business constraints
- Team context
- Anything critical to know

### How to Use It
1. **First action:** Check if exists
2. **If exists:** Read thoroughly before any work
3. **If missing:** Offer to create one

**Location:** Usually `docs/project-context.md` or root `project-context.md`

---

## Absolute vs Relative Paths

**WDS uses absolute paths for artifacts:**

### ✅ Absolute (Explicit)
```
docs/A-Product-Brief/product-brief.md
docs/B-Trigger-Map/trigger-map.md
docs/C-UX-Scenarios/landing-page/01-hero-section.md
```

**Why:** Clear, unambiguous, no confusion about location

---

### ❌ Relative (Ambiguous)
```
../product-brief.md
../../trigger-map.md
```

**Why bad:** Depends on current location, breaks easily

---

## Alliterative Persona Names

**Create memorable, fun persona names using alliteration**

### Good Examples
- Harriet the Hairdresser
- Marcus Manager
- Diana Designer
- Samantha Salesperson
- Tony Trainer
- Petra Product Manager

**Why:** Easier to remember, more human, makes documentation engaging

---

### Bad Examples
- John (generic)
- User 1 (impersonal)
- Target Group A (clinical)

**Why bad:** Forgettable, boring, doesn't bring persona to life

---

## Documentation Maintenance

**Documents are living artifacts:**

### When to Update
- ✅ New information discovered
- ✅ Assumptions proven wrong
- ✅ Priorities shift
- ✅ Scope changes
- ✅ Phase completes

### Version Control
- Use git for all documentation
- Commit with clear messages
- Tag major milestones
- Keep history

### Archive, Don't Delete
- Old versions have context value
- Create `archive/` folder if needed
- Document why something changed

---

## Documentation Handoffs

**When handing to development team:**

### Complete Package Includes
1. **Product Brief** - Strategic foundation
2. **Trigger Map** - User psychology
3. **Platform PRD** - Technical requirements
4. **Page Specifications** - Detailed UX specs
5. **Design System** (if created) - Component library
6. **Design Delivery PRD** - Complete handoff package

**See:** Phase 6 (Design Deliveries) for handoff process

---

## Quality Checklist

Before marking documentation "complete":

- [ ] **Clear purpose** - Why does this document exist?
- [ ] **Specific names** - No README.md or generic.md?
- [ ] **Absolute paths** - All file references explicit?
- [ ] **Evidence-based** - Claims backed by research/data?
- [ ] **Accessible language** - Readable by all stakeholders?
- [ ] **Structured well** - Scannable, logical hierarchy?
- [ ] **Up to date** - Reflects current reality?
- [ ] **Actionable** - Others can use this to make decisions?

---

## Related Resources

- **Product Brief Workflow:** `../../workflows/1-project-brief/project-brief/`
- **File Naming Conventions:** `../../workflows/00-system/FILE-NAMING-CONVENTIONS.md`
- **Project Outline Template:** Created during Phase 1 Step 1
- **Documentation Standards:** `../../../bmm/data/documentation-standards.md`

---

*Good documentation is the foundation of coordinated, confident execution. It's not overhead - it's leverage.*


