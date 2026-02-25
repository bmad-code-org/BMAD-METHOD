# Specification Audit Workflow

**Phase:** 4 - UX Design  
**Agent:** Freya (WDS Designer)  
**Purpose:** Systematically validate page and scenario specifications for completeness, consistency, and quality

---

## When to Use This Workflow

**Triggers:**
- Before handoff to development (Phase 4 [H] Handover)
- After completing scenario specifications
- When reviewing existing specifications
- Quality gate before prototype creation
- On-demand specification review

---

## Audit Levels

### Quick Audit (15-30 minutes)
Essential checks only - use for rapid validation during active design work.

### Standard Audit (1-2 hours)
Comprehensive review - use before development handoff.

### Complete Audit (2-4 hours)
Full validation including visual-spec alignment - use for critical pages or final quality gate.

---

## Audit Structure

The audit follows a hierarchical approach from formatting → scenario → page → component → content.

### Level 0: Specification Formatting & Standards
**WDS Formatting Compliance**

### Level 1: Scenario-Level Audit
**Strategic Foundation**

### Level 2: Page-Level Audit
**Structure & Organization**

### Level 3: Component-Level Audit
**Componentization & Design System**

### Level 4: Feature-Level Audit
**Shared Functionality**

### Level 5: Content Audit
**Text & Accessibility Content**

---

## Level 0: Specification Formatting & Standards

**Purpose:** Validate specification follows WDS formatting conventions and standards

### Checklist

**Markdown Structure:**
- [ ] Proper heading hierarchy (H1 → H2 → H3 → H4, no skipped levels)
- [ ] Only one H1 per page (page title)
- [ ] H2 for major sections
- [ ] H3 for subsections
- [ ] H4 for component details

**Area Label Format:**
- [ ] Format: `**AREA LABEL**: `{label}`` (bold, all caps, backticks)
- [ ] Naming convention: `{page}-{section}-{element}` (lowercase, hyphens)
- [ ] Consistent throughout specification

**Translation Format:**
- [ ] Each language on separate line
- [ ] Format: `- {LANG}: "{content}"`
- [ ] All product languages present for each content item
- [ ] Consistent language order throughout spec
- [ ] No inline translations (e.g., "Text (EN), Text (SE)")

**List Formatting:**
- [ ] Use `-` for unordered lists (not `*` or `+`)
- [ ] Consistent indentation (2 spaces per level)
- [ ] Proper spacing (blank line before/after lists)
- [ ] No unnecessary blank lines between items

**Code Blocks:**
- [ ] Language specified for syntax highlighting
- [ ] Triple backticks used
- [ ] Proper indentation

**Section Organization:**
- [ ] Sections in standard order (per template)
- [ ] No missing required sections
- [ ] No duplicate sections
- [ ] Logical flow maintained
- [ ] **Open Questions section present** (even if empty)

**Spacing & Formatting:**
- [ ] Consistent spacing between sections
- [ ] Proper use of bold for field labels
- [ ] No excessive blank lines
- [ ] Consistent indentation throughout

**Links:**
- [ ] Descriptive link text (not "here" or "click here")
- [ ] Valid relative paths for internal links
- [ ] Proper markdown format: `[Text](path)`

**File Naming:**
- [ ] Follows WDS naming conventions
- [ ] No generic names (README.md, GUIDE.md)
- [ ] Descriptive and specific

### Common Formatting Violations

**Inline Translations:**
```markdown
❌ **Content:** "Sign In" (EN), "Logga In" (SE)

✅ **Content:**
   - EN: "Sign In"
   - SE: "Logga In"
```

**Inconsistent Area Label Format:**
```markdown
❌ Area Label: signin-form-email
❌ **area-label**: `signin-form-email`

✅ **AREA LABEL**: `signin-form-email`
```

**Skipped Heading Levels:**
```markdown
❌ # Page Title
   #### Component

✅ # Page Title
   ## Section
   ### Subsection
   #### Component
```

**Missing Translations:**
```markdown
❌ **Content:**
   - EN: "Submit"
   (Missing SE)

✅ **Content:**
   - EN: "Submit"
   - SE: "Skicka"
```

### Navigation Best Practice

**Navigation Placement (Required for Long Specs):**
Long specifications must have navigation links in THREE locations so users can navigate without scrolling:
```markdown
✅ Above the sketch:
**Previous Step:** ← [3.1 Page Name](path)
**Next Step:** → [3.3 Page Name](path)

![Page Sketch](Sketches/page-sketch.jpg)

✅ Below the sketch (still in header area):
**Previous Step:** ← [3.1 Page Name](path)
**Next Step:** → [3.3 Page Name](path)

... specification content ...

✅ Bottom of document:
**Previous Step:** ← [3.1 Page Name](path)
**Next Step:** → [3.3 Page Name](path)
```
This is especially important for storyboards and multi-state specifications where sketches and content can be very long.

### Output
- List of formatting violations by type
- Specific line numbers or sections with issues
- Recommendations for corrections
- Severity (Critical/Warning/Suggestion)

**Reference:** `../../workflows/00-system/SPECIFICATION-FORMATTING-STANDARDS.md`

---

## Level 1: Scenario-Level Audit

**Purpose:** Validate strategic foundation and navigation flow

### Checklist

**Strategic Foundation**
- [ ] User situation clearly defined
- [ ] Usage context documented
- [ ] Strategic context (Trigger Map) defined and linked
- [ ] Scenario purpose stated
- [ ] Success criteria defined

**Navigation Flow**
- [ ] All pages in scenario identified
- [ ] Entry points documented for each page
- [ ] Exit points documented for each page
- [ ] User can navigate through all pages
- [ ] Navigation paths logical and complete
- [ ] Dead ends identified and resolved

**Scenario Overview**
- [ ] Scenario overview file exists
- [ ] Overview describes user journey
- [ ] Page sequence makes sense
- [ ] Links to all page specifications work

### Output
- List of missing strategic elements
- Navigation flow gaps
- Broken links or missing pages

---

## Level 2: Page-Level Audit

**Purpose:** Validate page structure, organization, and visual alignment

### A. Template Check

**Determine which template applies:**
- [ ] Single sketch → uses page-specification.template.md
- [ ] Multiple sketches → uses storyboard extension
- [ ] If storyboard: State Flow Overview present with ASCII diagram
- [ ] If storyboard: State 1 fully documented as baseline
- [ ] If storyboard: States 2+ document only changes

### B. Structure & Organization

**Checklist:**
- [ ] Page purpose clearly stated
- [ ] Success criteria defined
- [ ] Trigger Map reference present
- [ ] Sections properly separated and named
- [ ] Section purposes defined
- [ ] Page layout logical and flows well
- [ ] Layout structure diagram present
- [ ] Navigation present (Previous/Next links: above sketch, below sketch, and at document bottom)

**Structural Area Labels:**
- [ ] Page container (`{page-name}-page`)
- [ ] Header section (`{page-name}-header`)
- [ ] Main content area (`{page-name}-main`)
- [ ] Form container if applicable (`{page-name}-form`)
- [ ] Section containers (`{page-name}-{section}-section`)
- [ ] Section header bars if visible (`{page-name}-{section}-header-bar`)

### C. Visual-Spec Alignment

**Checklist:**
- [ ] Sketch/visualization exists in Sketches/ folder
- [ ] Sketch linked in specification
- [ ] All objects in sketch documented in spec
- [ ] All objects in spec visible in sketch
- [ ] Visual hierarchy matches spec structure
- [ ] Component placement matches sketch

**Gap Analysis:**
- Objects in sketch but missing from spec → Add to spec
- Objects in spec but missing from sketch → Update sketch or remove from spec
- Visual elements don't match description → Align sketch and spec

### D. Area Label Coverage

**Checklist:**
- [ ] All interactive elements have Area Labels (OBJECT IDs)
- [ ] Labels follow naming convention (`{page}-{section}-{element}`)
- [ ] Labels are unique within page
- [ ] ARIA labels match Area Labels
- [ ] Labels support html.to.design layer naming

### Output
- Structure issues list
- Visual-spec misalignment report
- Missing Area Labels list
- Recommendations for fixes

---

## Level 3: Component-Level Audit

**Purpose:** Validate componentization and design system integration

### A. Componentization

**Checklist:**
- [ ] Reusable sections identified (header, footer, navigation)
- [ ] Components properly separated from page specs
- [ ] Component specifications exist
- [ ] Component references valid and linked
- [ ] Shared patterns documented

**Common Reusable Components:**
- Navigation header
- Footer
- Form fields (inputs, selects, textareas)
- Buttons (primary, secondary, tertiary)
- Cards
- Modals/dialogs
- Error messages
- Loading indicators

### B. Cross-Page Duplicate Detection

**Purpose:** Compare sections across all pages in the scenario and flag identical or near-identical content that should be shared components.

**Process:**
1. Collect all section definitions from completed page specs in the scenario
2. Compare sections by structure (heading patterns, object types, layout)
3. Flag matches:
   - **Exact duplicate** — identical section structure and content across 2+ pages (e.g., navigation header, footer)
   - **Near duplicate** — same structure with minor content differences (e.g., hero sections with different text but identical layout)
   - **Repeated pattern** — same object types appearing in multiple pages (e.g., card grids, form fields)

**Checklist:**
- [ ] All completed pages in scenario scanned
- [ ] Exact duplicates flagged with source pages listed
- [ ] Near duplicates flagged with diff summary
- [ ] Repeated patterns identified
- [ ] Extraction recommendation for each finding (extract / leave as-is / parameterize)

**Severity:**
- **Critical** — Exact duplicate in 3+ pages (must extract)
- **Warning** — Exact duplicate in 2 pages or near duplicate in 3+ (should extract)
- **Suggestion** — Repeated pattern (consider extracting)

### C. Design System Integration (if enabled)

**Checklist:**
- [ ] All components added to design system
- [ ] Components at proper hierarchy level:
  - Atomic: Buttons, inputs, icons, labels
  - Molecular: Form fields, cards, list items
  - Organism: Headers, forms, sections
- [ ] Design tokens applied (colors, spacing, typography)
- [ ] Figma components linked
- [ ] Component variants documented

### Output
- Cross-page duplicate report (from B)
- List of components needing extraction
- Design system gaps
- Component hierarchy recommendations

---

## Level 4: Feature-Level Audit

**Purpose:** Validate shared functionality is properly extracted

### Checklist

**Shared Features:**
- [ ] Common features identified (e.g., image upload, validation)
- [ ] Feature files created and documented
- [ ] Feature references consistent across pages
- [ ] Validation rules centralized
- [ ] Error handling standardized

**Common Shared Features:**
- Image upload/cropping
- Form validation
- Authentication flows
- Payment processing
- Search functionality
- Filtering/sorting
- Pagination
- Date/time selection

### Output
- List of features needing extraction
- Feature documentation gaps
- Inconsistencies across pages

---

## Level 5: Content Audit

**Purpose:** Validate all content is defined and accessible

### A. Text Content

**Checklist:**
- [ ] **All Text Defined** - No placeholder content?
- [ ] **Error Messages** - All error states have messages in all languages?
- [ ] **Success Messages** - Confirmation messages defined?
- [ ] **Empty States** - Messages for no-data scenarios?
- [ ] **Loading States** - Loading indicators and messages?
- [ ] **Meta Content** - Page title and meta description for public pages?
- [ ] **Social Sharing** - Social media title, description, and image for public pages?
- [ ] Field labels present and clear
- [ ] Button text defined and action-oriented
- [ ] Help text/tooltips documented

### B. Accessibility Content

**Checklist:**

**ARIA Labels:**
- [ ] All interactive elements have aria-label attributes
- [ ] ARIA labels descriptive and meaningful
- [ ] ARIA labels match Area Labels

**Images:**
- [ ] All images have alt text specified
- [ ] Alt text descriptive (not just filename)
- [ ] Decorative images marked as such (alt="")

**Forms:**
- [ ] All inputs have associated labels (visible or aria-label)
- [ ] Required fields marked with aria-required
- [ ] Field instructions associated with aria-describedby
- [ ] Error messages announced to screen readers

**Keyboard Navigation:**
- [ ] Tab order documented
- [ ] Focus management specified
- [ ] Keyboard shortcuts documented (if any)
- [ ] Skip links present

**Screen Reader Support:**
- [ ] Semantic HTML specified (header, main, nav, section)
- [ ] Heading hierarchy logical (H1 → H2 → H3)
- [ ] ARIA live regions for dynamic content
- [ ] Loading states announced

**Visual Accessibility:**
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Information not conveyed by color alone
- [ ] Focus indicators visible (3:1 contrast)
- [ ] Text readable at 200% zoom

**WCAG Compliance:**
- [ ] Target compliance level documented (AA/AAA)
- [ ] Known accessibility issues documented
- [ ] Testing approach specified

### Output
- Missing content list
- Accessibility gaps
- WCAG compliance issues
- Recommendations for fixes

---

## Audit Report Template

```markdown
# Specification Audit Report

**Date:** {YYYY-MM-DD}
**Auditor:** {Name}
**Scope:** {Scenario/Page name}
**Audit Level:** {Quick/Standard/Complete}

---

## Executive Summary

**Overall Status:** {Pass/Pass with Issues/Fail}

**Critical Issues:** {count}
**Warnings:** {count}
**Suggestions:** {count}

---

## Level 1: Scenario-Level Findings

### Strategic Foundation
- ✅ Pass / ⚠️ Warning / ❌ Fail
- Issues: {list}

### Navigation Flow
- ✅ Pass / ⚠️ Warning / ❌ Fail
- Issues: {list}

---

## Level 2: Page-Level Findings

### Structure & Organization
- ✅ Pass / ⚠️ Warning / ❌ Fail
- Issues: {list}

### Visual-Spec Alignment
- ✅ Pass / ⚠️ Warning / ❌ Fail
- Misalignments: {list}

### Area Label Coverage
- ✅ Pass / ⚠️ Warning / ❌ Fail
- Missing Labels: {list}

---

## Level 3: Component-Level Findings

### Componentization
- ✅ Pass / ⚠️ Warning / ❌ Fail
- Issues: {list}

### Design System Integration
- ✅ Pass / ⚠️ Warning / ❌ Fail
- Issues: {list}

---

## Level 4: Feature-Level Findings

### Shared Functionality
- ✅ Pass / ⚠️ Warning / ❌ Fail
- Issues: {list}

---

## Level 5: Content Audit Findings

### Text Content
- ✅ Pass / ⚠️ Warning / ❌ Fail
- Missing content: {list}

### Accessibility Content
- ✅ Pass / ⚠️ Warning / ❌ Fail
- Accessibility gaps: {list}

---

## Recommendations

### Critical (Must Fix Before Development)
1. {Issue and recommended fix}
2. {Issue and recommended fix}

### Warnings (Should Fix)
1. {Issue and recommended fix}
2. {Issue and recommended fix}

### Suggestions (Nice to Have)
1. {Issue and recommended fix}
2. {Issue and recommended fix}

---

## Next Steps

- [ ] {Action item}
- [ ] {Action item}
- [ ] Re-audit after fixes

---

**Audit Complete:** {YYYY-MM-DD}
```

---

## Quick Audit Checklist

For rapid validation during active design work:

**Formatting (Level 0):**
- [ ] Proper heading hierarchy
- [ ] Area Label format correct
- [ ] Translations on separate lines
- [ ] All product languages present

**Content (Levels 1-5):**
- [ ] Page purpose clear
- [ ] Trigger Map reference present
- [ ] Structural Area Labels complete
- [ ] Interactive Area Labels complete
- [ ] Multi-language content present
- [ ] ARIA labels on interactive elements
- [ ] Alt text on images
- [ ] Form labels present
- [ ] Error messages defined
- [ ] Sketch exists and linked
- [ ] **Open Questions section present** (populate using open-questions.instructions.md)

---

## Standard Audit Checklist

For comprehensive review before development handoff:

**All Quick Audit items, plus:**

**Formatting (Level 0):**
- [ ] Section organization follows template
- [ ] Consistent spacing and indentation
- [ ] Code blocks have language specified
- [ ] Links properly formatted
- [ ] No formatting violations

**Content (Levels 1-5):**
- [ ] Scenario navigation complete
- [ ] Section purposes defined
- [ ] Visual-spec alignment verified
- [ ] Components properly extracted
- [ ] Design system integration complete
- [ ] Shared features documented
- [ ] All content defined (no placeholders)
- [ ] Open Questions section reviewed (all resolved or acceptable for dev handoff)
- [ ] Accessibility requirements complete
- [ ] WCAG compliance documented
- [ ] API endpoints defined
- [ ] Validation rules specified

---

## Complete Audit Checklist

For full validation including visual verification:

**All Standard Audit items, plus:**

- [ ] Sketch matches spec exactly
- [ ] All sketch objects documented
- [ ] All spec objects in sketch
- [ ] Component hierarchy optimal
- [ ] Feature extraction complete
- [ ] Keyboard navigation tested
- [ ] Screen reader compatibility verified
- [ ] Color contrast checked
- [ ] Focus management validated
- [ ] Responsive behavior specified

---

## Integration with WDS

**Workflow Placement:**
- Phase 4 (UX Design) - Before prototype creation
- Phase 4 [H] Handover (Design Deliveries) - Before development handoff
- Phase 8 (Product Evolution) - When updating specifications

**Agent Integration:**
- Freya runs audits on page specifications
- Idunn can request audits before development
- Saga can audit for strategic alignment

**Menu Trigger:**
Add to Freya's menu:
```yaml
- trigger: audit-spec
  exec: "{project-root}/_bmad/wds/workflows/4-ux-design/specification-audit-workflow.md"
  description: "[AS] Audit page or scenario specifications for completeness and quality"
```

---

## Related Resources

### Templates
- **Page Specification:** `./templates/page-specification.template.md`
- **Storyboard Extension:** `./templates/storyboard-specification.template.md` (for multi-sketch pages)

### Micro-Instructions (conditional sections)
- **Open Questions (always):** `./templates/instructions/open-questions.instructions.md` ← Auto-populate questions
- **SEO/Social:** `./templates/instructions/meta-content.instructions.md`
- **Forms:** `./templates/instructions/form-validation.instructions.md`
- **API Data:** `./templates/instructions/data-api.instructions.md`
- **Responsive:** `./templates/instructions/responsive.instructions.md`
- **Accessibility:** `./templates/instructions/accessibility.instructions.md`
- **Accessibility Audit:** `./templates/instructions/accessibility-audit.workflow.md`

### Guides
- **Specification Quality Guide:** `../../data/agent-guides/freya/specification-quality.md`
- **Accessibility Guidelines:** WCAG 2.1 Level AA

---

## Template Router

**Before auditing, determine which template applies:**

| Condition | Template |
|-----------|----------|
| Single sketch | page-specification.template.md |
| Multiple sketches (states, flows) | page-specification + storyboard extension |

**Check for required micro-instructions:**

| Page Has | Include |
|----------|---------|
| **All pages** | **open-questions.instructions.md** (auto-populate questions) |
| Public visibility | meta-content.instructions.md |
| Forms/inputs | form-validation.instructions.md |
| API data | data-api.instructions.md |
| Multiple breakpoints | responsive.instructions.md |

---

## Object Hierarchy Check

Verify specs follow the hierarchy:

```
Page
└── Section (OBJECT ID: page-section)
    ├── Object (OBJECT ID: page-object)
    └── Group/Container (OBJECT ID: page-group)
        └── Nested Object (OBJECT ID: page-group-object)
```

**Storyboard pages also need:**
- State Flow Overview (ASCII diagram + state table)
- State 1 fully documented (baseline)
- States 2+ document only changes (reuse OBJECT IDs)

---

**Use this workflow to ensure specifications are complete, consistent, and ready for confident implementation.**
