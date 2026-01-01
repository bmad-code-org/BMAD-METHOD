# Page Specification Quality Workflow

**Purpose:** Ensure every WDS page specification meets quality standards with complete structure, Object IDs, and traceability.

---

## When to Use This Workflow

### During Page Creation ✨
Use this workflow step-by-step to build specifications correctly from the start:
- Creating a new page specification from a sketch
- Converting rough notes into proper spec format
- Building specs incrementally as design evolves

### After Page Updates 🔄
Use this workflow to validate changes maintain standards:
- Updated sketch with new elements
- Content revisions
- Added sections or components
- Design iteration

### Quality Audits 🔍
Use this workflow to check existing specifications:
- Pre-handoff quality check
- Sprint review preparation
- Onboarding new team members
- Fixing legacy specs

---

## Workflow Overview

This workflow consists of 5 sequential steps:

```
Step 1: Navigation Structure
    ↓
Step 2: Page Overview
    ↓
Step 3: Page Sections & Objects
    ↓
Step 4: Object Registry
    ↓
Step 5: Final Validation
```

Each step focuses on one structural element to ensure nothing is missed.

---

## Quick Start

### For Freya (AI Agent)

<action>Load and execute: instructions.md</action>

This will start the sequential workflow, automatically progressing through each step.

### For Human Designers

1. **Open your page specification**
2. **Start at Step 1** (Navigation Structure)
3. **Work through each step sequentially**
4. **Use the checklists** to validate each section
5. **Generate quality report** at Step 5

---

## What This Workflow Checks

### ✅ Navigation Structure (Step 1)
- H3 and H1 headers with page numbers
- "Next Step" links before and after sketch
- Embedded sketch image
- Correct relative paths

### ✅ Page Overview (Step 2)
- Page description (1-2 paragraphs)
- User Situation section
- Page Purpose section
- Emotional context and pain points

### ✅ Page Sections (Step 3)
- "## Page Sections" header
- Section Objects (H3) with Purpose
- Component specs (H4) with Object IDs
- Design system links
- Content specifications
- Behavior specifications

### ✅ Object Registry (Step 4)
- "## Object Registry" header
- Introduction paragraph
- Master Object List tables
- 100% coverage of all Object IDs
- Proper table formatting

### ✅ Final Validation (Step 5)
- Cross-reference all sections
- Verify sketch coverage
- Check for broken links
- Validate naming conventions
- Generate quality report

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
- List of critical issues (must fix)
- List of warnings (should fix)
- List of recommendations (nice to have)
- Object ID audit (duplicates, missing, orphans)
- Sketch coverage analysis (missing elements)
- Broken links report
- Next actions for handoff

**Report Status Levels:**
- ✅ **READY FOR HANDOFF** - Zero critical issues, ready for dev
- ⚠️ **NEEDS REVISION** - 1-3 critical issues, fixable quickly
- ❌ **INCOMPLETE** - 4+ critical issues, needs substantial work

---

## Common Use Cases

### Use Case 1: New Page from Sketch

**Scenario:** Designer uploads a new sketch and needs to create specification.

**Process:**
1. Run Step 1: Generate navigation structure
2. Run Step 2: Define page overview based on trigger map
3. Run Step 3: Analyze sketch, create sections and Object IDs
4. Run Step 4: Auto-generate Object Registry from sections
5. Run Step 5: Validate and generate report

**Outcome:** Complete, validated specification ready for handoff.

---

### Use Case 2: Updated Sketch

**Scenario:** Designer updates existing sketch with new elements.

**Process:**
1. Skip to Step 3: Check existing sections
2. Add new sections/objects from updated sketch
3. Run Step 4: Update Object Registry with new IDs
4. Run Step 5: Validate changes and generate report

**Outcome:** Updated specification with change tracking.

---

### Use Case 3: Quality Audit Before Handoff

**Scenario:** Team lead wants to verify spec quality before developer handoff.

**Process:**
1. Run entire workflow in "validation mode"
2. Step 1-4: Check each section against checklists
3. Step 5: Generate comprehensive quality report
4. Share report with team, fix critical issues
5. Re-run Step 5 after fixes

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
- [Page Init Workflow](../steps/step-02-substeps/page-init/) - Creates initial page structure
- [Sketch Analysis](../substeps/4b-sketch-analysis.md) - Identifies page elements

**After:**
- [Interactive Prototypes](../interactive-prototypes/) - Builds HTML demos from specs
- [Design Deliveries](../../../6-design-deliveries/) - Packages specs for handoff
- [PRD Generation](../../../3-prd-platform/) - Creates developer stories from specs

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
- [WDS Specification Pattern](../WDS-SPECIFICATION-PATTERN.md)
- [Object Types](../object-types/)
- [Component File Structure](../COMPONENT-FILE-STRUCTURE.md)

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

**Start the workflow:** [instructions.md](instructions.md)

