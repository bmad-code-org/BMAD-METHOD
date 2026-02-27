# Page Specification Quality Guide

**Purpose:** Reference guide explaining what the Page Specification Quality Workflow checks and why each validation matters.

**Note:** This is a reference document. To execute the workflow, see `workflow.md`.

---

## Overview

The Page Specification Quality Workflow ensures every WDS page specification meets quality standards with complete structure, Object IDs, and traceability. This guide explains each validation check and its importance.

---

## When to Use Quality Workflow

### During Page Creation ✨
Build specifications correctly from the start:
- Creating a new page specification from a sketch
- Converting rough notes into proper spec format
- Building specs incrementally as design evolves

### After Page Updates 🔄
Validate changes maintain standards:
- Updated sketch with new elements
- Content revisions
- Added sections or components
- Design iteration

### Quality Audits 🔍
Check existing specifications:
- Pre-handoff quality check
- Sprint review preparation
- Onboarding new team members
- Fixing legacy specs

---

## Workflow Architecture

The workflow uses **BMAD v6 micro-step architecture** with 8 sequential validation steps:

```
Step 1: Page Metadata
    ↓
Step 2: Navigation Structure
    ↓
Step 3: Page Overview
    ↓
Step 4: Page Sections & Objects
    ↓
Step 5: Section Order & Structure
    ↓
Step 6: Object Registry
    ↓
Step 7: Design System Separation & Unnecessary Information
    ↓
Step 8: Final Validation
```

**Workflow Philosophy:**
- **Diagnose, don't rewrite** - Identify issues and suggest specific fixes
- **Report findings** - Generate clear, actionable reports for each section
- **Recommend solutions** - Provide examples of correct patterns
- **Let designer decide** - Agent suggests, designer implements (unless asked to fix)

---

## How to Execute Workflow

### For AI Agents (Freya)
Load and execute: `workflow.md`

### For Human Designers
1. Open your page specification
2. Follow the 8 steps sequentially
3. Use the checklists in each step file
4. Generate quality report at Step 8

---

## What This Workflow Checks

### ✅ Step 1: Page Metadata
- Platform declaration present
- Page type specified
- Primary viewport identified
- Interaction model documented
- Navigation context defined
- Inherits from scenario platform strategy

**Why This Matters:**
- Establishes technical context before design decisions
- Ensures platform-appropriate design patterns
- Clarifies device priorities and constraints
- Guides responsive design approach
- Prevents platform-incompatible features
- 📖 **Reference:** [Page Specification Template](../templates/page-specification.template.md)

**Audit Report Example:**
```markdown
🔍 Page Metadata Audit

**Status:** ⚠️ WARNING - Missing platform metadata

**Issues Found:**
1. ❌ No Page Metadata section (should be after page title)
   - Missing: Platform, Page Type, Viewport, Interaction Model
   - Should add: Complete Page Metadata section
   - Why: Developers need platform context before implementation

2. ℹ️ Platform not inherited from scenario
   - Check: Does scenario overview define platform strategy?
   - Action: Confirm platform strategy in scenario, then add to page

**Recommendation:**
Add Page Metadata section with:
- Platform (from Product Brief/Scenario)
- Page Type (Full Page, Modal, etc.)
- Primary Viewport (Mobile-first, Desktop-first, etc.)
- Interaction Model (Touch, Mouse/keyboard, etc.)
- Navigation Context (Public, Authenticated, etc.)

Would you like me to add the Page Metadata section?
```

### ✅ Step 2: Navigation Structure
- H3 and H1 headers with page numbers
- "Next Step" links before and after sketch
- Embedded sketch image
- Correct relative paths

**Why This Matters:**
- Provides immediate context for where page fits in user journey
- Embedded sketch gives visual reference without leaving document
- Consistent navigation enables automated tooling and cross-linking
- 📖 **Reference:** [step-01-navigation.md](step-01-navigation.md)

### ✅ Step 3: Page Overview
- Page description (1-2 paragraphs)
- User Situation section
- Page Purpose section
- Emotional context and pain points

**Why This Matters:**
- Captures strategic intent (WHY) before implementation details (HOW)
- Connects design decisions to user needs and trigger map
- Provides context for developers and stakeholders
- 📖 **Reference:** [step-02-page-overview.md](step-02-page-overview.md)

### ✅ Step 4: Page Sections
- "## Page Sections" header
- Section Objects (H3) with Purpose
- Component specs (H4) with Object IDs
- Design system links
- Content specifications
- Behavior specifications

**Why This Matters:**
- OBJECT IDs enable traceability from spec → code → Figma
- Component references ensure design system consistency
- Content with language tags prevents "lorem ipsum" in production
- Behavior specs reduce developer guesswork
- 📖 **Reference:** [step-03-page-sections.md](step-03-page-sections.md)
- 📖 **Related:** [Page Specifications Deliverable](../../../docs/deliverables/page-specifications.md)

### ✅ Step 6: Object Registry
- "## Object Registry" header
- Introduction paragraph
- Master Object List tables
- 100% coverage of all Object IDs
- Proper table formatting

**Why This Matters:**
- Single source of truth for all page elements
- Enables automated testing (test by OBJECT ID)
- Facilitates content updates and translations
- Supports Figma export workflows (aria-label mapping)
- 📖 **Reference:** [step-04-object-registry.md](step-04-object-registry.md)

### ✅ Step 5: Section Order & Structure
- Sections appear in standard WDS order
- Required sections are present
- Optional sections are appropriately placed
- No duplicate or redundant sections

**Standard Section Order:**
1. Navigation (H3 + Next Step + Sketch + Next Step + H1)
2. Page description paragraph
3. User Situation
4. Page Purpose
5. Reference Materials
6. Page Sections
7. Page-Specific Layout Notes (optional)
8. Object Registry

**Why This Matters:**
- Consistent structure across all page specifications
- Strategic context (WHY) before implementation (WHAT)
- Easy navigation for developers and stakeholders
- Enables automated tooling and validation
- 📖 **Reference:** [Page Specification Standards](../../../docs/deliverables/page-specifications.md)

**Audit Report Example:**
```markdown
🔍 Section Structure Audit

**Status:** ⚠️ WARNING - Sections out of order

**Issues Found:**
1. ⚠️ "Reference Materials" appears after "Page Sections" (Line 250)
   - Should be: Before "Page Sections" (around Line 20)
   - Why: Strategic context should come before implementation details

2. ⚠️ Missing "Object Registry" section
   - Should be: At end of document
   - Why: Required for traceability and automated testing

Would you like me to reorder these sections?
```

### ✅ Step 7: Design System Separation
- NO CSS classes, hex codes, or styling values in page specs
- NO font sizes, padding, margins, or layout measurements
- Component references link to Design System
- Color/typography references use Design System tokens
- Styling details documented in Design System, not page specs

**Why This Matters:**
- Page specs focus on WHAT/WHY (strategic), not HOW (implementation)
- Prevents specifications from becoming outdated when styles change
- Enables design system to be single source of truth for styling
- Reduces specification maintenance burden
- Prevents "reverse-engineering from Figma" anti-pattern
- 📖 **Reference:** [Design System Deliverable](../../../docs/deliverables/design-system.md)
- 📖 **Related:** [Prepare for Figma Export](../../../docs/tools/prepare-for-figma-export.md)

**Common Violations to Check:**
- ❌ CSS class names in component descriptions (`.btn-primary`, `.hero-section`)
- ❌ Color hex codes in content (`#2F1A0C`, `rgb(255, 100, 50)`)
- ❌ Font sizes and weights (`18px Fredoka SemiBold`, `font-size: 2rem`)
- ❌ Spacing values (`padding: 20px`, `margin-bottom: 16px`)
- ❌ Layout measurements (`max-width: 1200px`, `border-radius: 8px`)
- ✅ Component references (`[Button Primary]`, `H1 heading`)
- ✅ Design System links (`See [Color Palette]`, `Uses [Typography System]`)

**Audit Report Example:**
```markdown
## Design System Separation Audit

**Status:** ❌ FAIL - CSS implementation details found in specification

**Critical Issues:**
1. ❌ CSS styling in Hero section (Lines 45-78)
   - Found: Font sizes, colors, padding values
   - Example: "18px Fredoka SemiBold, #2F1A0C, padding: 20px"
   - Should be: Component references and Design System links
   - Action: Move to /docs/D-Design-System/03-Components/

2. ❌ Responsive CSS in component descriptions (Lines 120-145)
   - Found: Media queries and breakpoint values
   - Example: "@media (min-width: 768px) { ... }"
   - Should be: High-level layout notes only
   - Action: Move to Design System Breakpoints documentation

**Recommendation:**
- Keep: OBJECT IDs, content, behavior, strategic rationale
- Remove: All CSS classes, hex codes, measurements, styling
- Add: Links to Design System components
- Add: "Page-Specific Layout Notes" section for high-level responsive behavior

**Next Steps:**
1. Extract styling to Design System documentation
2. Replace CSS details with component references
3. Add Design System links for colors/typography
4. Keep page-specific layout notes (mobile vs desktop behavior)

Would you like me to help extract these styles to the Design System?
```

### ✅ Step 7 (continued): Unnecessary Information Detection
- NO implementation code snippets (HTML, CSS, JavaScript)
- NO developer instructions or technical setup steps
- NO version control information (commit messages, PR notes)
- NO internal project management notes
- NO duplicate content across sections
- NO outdated/deprecated information

**Why This Matters:**
- Keeps specifications focused on design intent
- Prevents confusion between spec and implementation
- Reduces maintenance burden (less to update)
- Improves readability for all stakeholders
- Separates concerns (design specs vs. developer docs)

**Common Unnecessary Content:**
- ❌ Code examples (`<div class="hero">`, `const handleClick = () => {}`)
- ❌ Build instructions ("Run npm install", "Deploy to staging")
- ❌ Git history ("Added in PR #123", "Fixed by John on 2024-01-15")
- ❌ Internal notes ("TODO: Ask PM about this", "Waiting for approval")
- ❌ Duplicate sketches or redundant descriptions
- ❌ Old design iterations that are no longer relevant
- ✅ OBJECT IDs, content, behavior, strategic rationale
- ✅ Component references and Design System links
- ✅ User context and page purpose

**Audit Report Example:**
```markdown
🔍 Unnecessary Information Audit

**Status:** ⚠️ WARNING - Non-specification content found

**Issues Found:**
1. ⚠️ HTML code snippets in component descriptions (Lines 85-92)
   - Found: `<button class="btn-primary">Click me</button>`
   - Why problematic: Implementation details, not design intent
   - Action: Remove code, keep OBJECT ID and behavior description

2. ⚠️ Developer setup instructions (Lines 200-215)
   - Found: "Run npm install, configure .env file..."
   - Why problematic: Belongs in developer documentation
   - Action: Move to /docs/developer-setup.md or remove

3. ⚠️ Duplicate sketch references (Lines 15, 45, 120)
   - Found: Same sketch linked multiple times
   - Why problematic: Clutters document, causes confusion
   - Action: Keep sketch in navigation section only

4. ℹ️ Old design iteration notes (Lines 300-320)
   - Found: "Previous version used blue, changed to green"
   - Why problematic: Historical notes not needed in final spec
   - Action: Remove or move to design decision log

Would you like me to clean up this unnecessary content?
```

### ✅ Step 8: Final Validation
- Cross-reference all sections
- Verify sketch coverage
- Check for broken links
- Validate naming conventions
- Generate quality report

**Why This Matters:**
- Catches inconsistencies before handoff
- Ensures specification completeness
- Provides confidence for developers
- Documents quality metrics for project tracking
- 📖 **Reference:** [step-05-final-validation.md](step-05-final-validation.md)

---

## Example: Standard WDS Pattern

This workflow ensures all WDS page specifications follow a consistent, high-quality pattern.

**Key Pattern Elements:**
- Clear navigation with scenario context
- Embedded sketch images
- Section Objects with Purpose statements
- Component specs with Object IDs
- Complete Object Registry table
- Design system component links

---

## Output: Quality Report

At the end of Step 5, you'll have:

**Comprehensive Quality Report** including:
- Pass/Fail status for each section
- List of critical issues (must fix) with **specific line numbers**
- List of warnings (should fix) with **examples of violations**
- List of recommendations (nice to have)
- Object ID audit (duplicates, missing, orphans)
- Sketch coverage analysis (missing elements)
- Broken links report
- **Suggested fixes** with before/after examples
- Next actions for handoff

**Report Format Example:**
```markdown
## Navigation Structure Audit

**Status:** ❌ FAIL

**Issues Found:**
1. ❌ Missing H3 header before H1
   - Location: Line 1
   - Current: `# 1.1 Start Page`
   - Should be: `### 1.1 Start Page` (add H3 before H1)
   
2. ❌ Missing embedded sketch in navigation
   - Location: Between lines 3-5
   - Should add: `![Start Page Concept](sketches/...)`
   
**Recommendation:**
Add H3 header and embed sketch between dual "Next Step" links.
See: step-01-navigation.md for correct format.
```

**Report Status Levels:**
- ✅ **READY FOR HANDOFF** - Zero critical issues, ready for dev
- ⚠️ **NEEDS REVISION** - 1-3 critical issues, fixable quickly
- ❌ **INCOMPLETE** - 4+ critical issues, needs substantial work

**Agent Behavior:**
- **Report findings** - Don't automatically fix unless asked
- **Provide line numbers** - Make issues easy to locate
- **Show examples** - Include correct patterns for reference
- **Ask before editing** - "Would you like me to fix these issues?"
- **Offer audit stamp** - "Would you like me to add an audit stamp to the page for handoff tracking?"

---

## Optional: Audit Stamp for Handoff

When a page specification passes all quality checks and is ready for development handoff, the agent can offer to add a brief audit stamp at the bottom of the document.

**When to Add:**
- Page passes all quality checks (✅ READY FOR HANDOFF)
- Designer confirms page is ready for development
- Team wants handoff tracking in the document itself

**When NOT to Add:**
- Page still has critical issues
- Specification is work-in-progress
- Team prefers external audit tracking

**Audit Stamp Format:**
```markdown
---

## Quality Audit

**Status:** ✅ READY FOR HANDOFF  
**Audit Date:** 2026-01-21  
**Audited By:** Freya (WDS Page Audit Workflow v1.0)

**Compliance:**
- ✅ Navigation Structure (WDS Standard)
- ✅ Page Overview (Strategic Context)
- ✅ Section Order & Structure
- ✅ Object Registry (100% Coverage)
- ✅ Design System Separation
- ✅ No Unnecessary Information

**Notes:** All OBJECT IDs validated, Design System references confirmed, ready for implementation.
```

**Design Log:**
```
🎉 Audit Complete - All Checks Passed!

**Status:** ✅ READY FOR HANDOFF

This page specification meets all WDS quality standards and is ready for development.

Would you like me to add a quality audit stamp at the bottom of the page?
This can be useful for:
- Tracking when the page was validated
- Confirming handoff readiness to developers
- Project documentation and history

[Yes, add audit stamp] [No, keep page clean]
```

**Removing Audit Stamp:**
The audit stamp can be easily removed later if needed (it's always at the bottom of the document). Some teams prefer to remove it after implementation is complete.

---

## Common Use Cases

### Use Case 1: New Page from Sketch

**Scenario:** Designer uploads a new sketch and needs to create specification.

**Process:**
1. Run Step 1: Confirm page metadata from scenario
2. Run Step 2: Generate navigation structure
3. Run Step 3: Define page overview based on trigger map
4. Run Step 4: Analyze sketch, create sections and Object IDs
5. Run Step 5: Validate section order
6. Run Step 6: Auto-generate Object Registry from sections
7. Run Step 7: Check Design System separation
8. Run Step 8: Validate and generate report

**Outcome:** Complete, validated specification ready for handoff.

---

### Use Case 2: Updated Sketch

**Scenario:** Designer updates existing sketch with new elements.

**Process:**
1. Skip to Step 4: Check existing sections
2. Add new sections/objects from updated sketch
3. Run Step 6: Update Object Registry with new IDs
4. Run Step 8: Validate changes and generate report

**Outcome:** Updated specification with change tracking.

---

### Use Case 3: Quality Audit Before Handoff

**Scenario:** Team lead wants to verify spec quality before developer handoff.

**Process:**
1. Run entire workflow in "validation mode"
2. Step 1-7: Check each section against checklists
3. Step 8: Generate comprehensive quality report
4. Share report with team, fix critical issues
5. Re-run Step 8 after fixes

**Outcome:** Confidence in specification completeness.

---

### Use Case 4: Fixing Legacy Spec

**Scenario:** Old specification doesn't follow WDS standards.

**Process:**
1. Run Step 1-4 in "validation mode" to identify gaps
2. Fix missing navigation structure
3. Add missing Object IDs to all interactive elements
4. Create Object Registry if missing
5. Run Step 5 to verify all issues resolved

**Outcome:** Legacy spec brought up to current standards.

---

## Benefits

### For Designers 🎨
- Clear checklist to follow
- Confidence nothing is missed
- Professional, consistent output
- Easy communication with developers

### For Developers 💻
- Complete, trustworthy specifications
- All interactive elements have Object IDs
- Clear implementation order (top to bottom)
- Easy to test (Object IDs as test targets)

### For Teams 👥
- Shared quality standards
- Consistent specification format
- Easy onboarding for new members
- Reduced back-and-forth during handoff

### For Project Management 📊
- Clear completion criteria
- Quality metrics tracking
- Reduced rework
- Faster handoffs

---

## Integration with WDS Workflows

This quality workflow integrates with:

**Before:** 
- [Page Init Workflow](../steps-s/ and ../data/page-creation-flows/) - Creates initial page structure
- [Sketch Analysis](../steps-k/step-01-sketch-analysis.md) - Identifies page elements

**After:**
- [Agentic Development](../../5-agentic-development/) - Builds HTML demos from specs
- [Handover](../steps-h/) - Packages specs for handoff
- [Platform Requirements](../../../1-project-brief/steps-c/ (steps 27-32)) - Technical boundaries from specs

---

## Tips for Success

### Do:
- ✅ Run the workflow every time you create or update a page
- ✅ Use checklists systematically (don't skip items)
- ✅ Fix critical issues before proceeding to next step
- ✅ Save quality reports for project history
- ✅ Track metrics over time to improve process

### Don't:
- ❌ Skip steps (each builds on the previous)
- ❌ Ignore warnings (they become critical issues later)
- ❌ Rush through validation (thoroughness matters)
- ❌ Mix validation with creation (separate concerns)
- ❌ Forget to re-validate after fixes

---

## Customization

### For Your Project

You can customize this workflow by:

**Adjusting Standards:**
- Modify Object ID naming conventions
- Add project-specific sections
- Extend validation checklists
- Add custom quality metrics

**Adding Steps:**
- Step 3.5: Accessibility audit
- Step 4.5: Content strategy review
- Step 5.5: Stakeholder approval

**Location:**
Customizations should be documented in:
`/examples/[PROJECT]/docs/quality-standards.md`

---

## Support

### Questions or Issues?

**Documentation:**
- [WDS Specification Pattern](../guides/WDS-SPECIFICATION-PATTERN.md)
- [Object Types](../object-types/)
- [Component File Structure](../modular-architecture/COMPONENT-FILE-STRUCTURE.md)

**Examples:**
- See fictional TaskFlow examples in workflow steps
- Check existing WDS project specifications for real-world patterns

**Contact:**
- File issues in project repo
- Discuss in team channel
- Reference this workflow in PRs

---

## Version History

**v1.0.0** - 2025-12-28
- Initial release
- Pattern extracted from successful WDS projects
- 6-step sequential workflow
- Quality report generation

---

**Start the workflow:** [workflow.md](workflow.md)

