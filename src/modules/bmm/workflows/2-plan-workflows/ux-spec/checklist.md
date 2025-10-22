# UX/UI Specification Workflow Validation Checklist

**Purpose**: Validate UX workflow outputs are complete, actionable, and ready for development.

**Scope**: Can run standalone or integrated with PRD/GDD workflows

**Expected Outputs**: ux-specification.md, optional ai-frontend-prompt.md

---

## 1. Output File Exists

- [ ] ux-specification.md created in output folder
- [ ] Requirements source identified (PRD, GDD, or gathered requirements)
- [ ] No unfilled {{template_variables}}

---

## 2. UX Foundation

### User Personas

- [ ] **At least one primary persona** defined with goals and pain points
- [ ] Personas have sufficient detail to inform design decisions
- [ ] If PRD/GDD exists, personas align with target audience

### Design Principles

- [ ] **3-5 core design principles** established
- [ ] Principles are actionable (guide real design decisions)
- [ ] Principles fit project goals and users

---

## 3. Information Architecture

### Site/App Structure

- [ ] **Complete site map** showing all major sections/screens
- [ ] Hierarchical relationships clear
- [ ] Navigation paths evident
- [ ] Structure makes sense for users

### Navigation

- [ ] Primary navigation defined
- [ ] Mobile navigation strategy clear (if multi-platform)
- [ ] Navigation approach logical

---

## 4. User Flows

- [ ] **At least 2-3 critical user flows** documented
- [ ] Flows show complete start-to-finish paths
- [ ] Decision points and error states considered
- [ ] Flows include Mermaid diagrams or clear descriptions
- [ ] If PRD exists, flows align with user journeys

---

## 5. Component Library and Visual Design

### Component Approach

- [ ] **Design system strategy** defined (existing system, custom, or hybrid)
- [ ] If using existing, which one specified
- [ ] Core components identified
- [ ] Component states documented (default, hover, active, disabled, error)

### Visual Foundation

- [ ] **Color palette** defined with semantic meanings
- [ ] **Typography** specified (fonts, type scale, usage)
- [ ] **Spacing system** documented
- [ ] Design choices support usability

---

## 6. Responsive and Accessibility

### Responsive Design

- [ ] **Breakpoints defined** for target devices
- [ ] Adaptation patterns explained (how layouts change)
- [ ] Mobile strategy clear (if multi-platform)

### Accessibility

- [ ] **Compliance target** specified (WCAG level)
- [ ] Key accessibility requirements documented
- [ ] Keyboard navigation, screen readers, contrast considered

---

## 7. Implementation Readiness

- [ ] **Next steps** clearly defined
- [ ] Design handoff requirements clear
- [ ] Developers can implement from this spec
- [ ] Sufficient detail for front-end development

---

## 8. Integration with Requirements

**If PRD/GDD exists:**

- [ ] UX covers all user-facing features from requirements
- [ ] User flows align with documented user journeys
- [ ] Platform matches PRD/GDD platforms
- [ ] No contradictions with requirements

---

## 9. AI Frontend Prompt (If Generated)

**If ai-frontend-prompt.md was created:**

- [ ] File exists in output folder
- [ ] Contains complete UX context (colors, typography, components, flows)
- [ ] Formatted for AI tools (v0, Lovable, etc.)
- [ ] Includes appropriate warnings about reviewing generated code

---

## 10. Critical Failures (Auto-Fail)

- [ ] ❌ **No user personas** (target users not defined)
- [ ] ❌ **No user flows** (critical paths not documented)
- [ ] ❌ **No information architecture** (site structure missing)
- [ ] ❌ **No component approach** (design system not defined)
- [ ] ❌ **No visual foundation** (colors/typography missing)
- [ ] ❌ **No responsive strategy** (adaptation not addressed for multi-platform)
- [ ] ❌ **Contradicts requirements** (UX fights PRD/GDD if they exist)

---

## Validation Notes

**Document any findings:**

- UX quality: [Production-ready / Good foundation / Needs refinement / Incomplete]
- Strengths:
- Issues to address:
- Recommended actions:

**Ready for development?** [Yes / Needs design phase / No - explain]

---

_Adapt based on whether this is standalone or integrated, and platform requirements._
