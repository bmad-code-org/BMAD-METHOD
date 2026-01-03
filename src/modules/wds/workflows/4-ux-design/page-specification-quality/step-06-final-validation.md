# Step 6: Final Validation

**Purpose:** Run comprehensive quality checks and generate final report.

---

## What Final Validation Provides

**Quality Assurance:**
- Catches missing elements before handoff
- Ensures consistency across specification
- Validates against WDS standards

**Confidence:**
- Designer knows spec is complete
- Developer can trust the specification
- Team has single source of truth

**Traceability:**
- All elements accounted for
- Clear audit trail
- Easy to identify gaps

---

## Validation Checklist

Run through all items systematically.

### 1. Navigation Validation

- [ ] H3 header with page number present
- [ ] First "Next Step" link present and correct
- [ ] Sketch image embedded with correct path
- [ ] Second "Next Step" link present and correct
- [ ] H1 header matches H3 header exactly

### 2. Page Overview Validation

- [ ] Page description (1-2 paragraphs) present
- [ ] User Situation section present
- [ ] Page Purpose section present
- [ ] Content is specific, not generic
- [ ] Emotional context included

### 3. Page Sections Validation

- [ ] "## Page Sections" header present
- [ ] All sections use H3 with "Object" suffix
- [ ] Every section has Purpose statement
- [ ] All components use H4
- [ ] Every interactive element has Object ID
- [ ] Object IDs follow naming convention
- [ ] All Object IDs are unique
- [ ] Content specified (not placeholder)
- [ ] Multilingual content marked

### 4. Object Registry Validation

- [ ] "## Object Registry" header present
- [ ] Introduction paragraph present
- [ ] At least one Master Object List table
- [ ] All Page Section Object IDs in registry
- [ ] No orphan Object IDs in registry
- [ ] Table formatting correct
- [ ] Object IDs use backticks
- [ ] All table cells populated

### 5. Sketch Coverage Validation

**Process:**
1. Open the sketch image
2. Identify all visible elements top to bottom
3. Check each element has specification in Page Sections
4. Mark missing elements

**Common Missing Elements:**
- Background patterns or decorations
- Icons within buttons or cards
- Subtle UI elements (dividers, borders)
- Error states or empty states
- Loading indicators
- Hover states

- [ ] All visible elements in sketch are specified
- [ ] All interactive states documented
- [ ] All content elements captured

### 6. Design System Linking

- [ ] Component links present where system exists
- [ ] Component links use relative paths
- [ ] Component links point to correct locations
- [ ] Missing components marked as "TBD" with creation task

### 7. Cross-Reference Validation

**Object ID Audit:**

Create two lists:
1. All Object IDs from Page Sections
2. All Object IDs from Object Registry

**Compare:**
- [ ] Lists are identical (no missing, no extra)
- [ ] No duplicates within either list
- [ ] All follow naming convention

**Path Audit:**

- [ ] Navigation "Next Step" paths exist
- [ ] Sketch image path exists
- [ ] Design system component paths exist (where applicable)
- [ ] All paths use relative format

---

## Generate Quality Report

<output>
# Page Specification Quality Report

**Page:** {page_number} {page_name}  
**Date:** {current_date}  
**Status:** ✅ READY FOR HANDOFF / ⚠️ NEEDS REVISION / ❌ INCOMPLETE

---

## Executive Summary

**Total Object IDs:** {count}  
**Sections:** {count}  
**Components:** {count}

**Critical Issues:** {count}  
**Warnings:** {count}  
**Recommendations:** {count}

---

## Section-by-Section Results

### ✅ Navigation Structure
- Status: PASS / FAIL
- Issues: [List if any]

### ✅ Page Overview
- Status: PASS / FAIL
- Issues: [List if any]

### ✅ Page Sections
- Status: PASS / FAIL
- Missing Object IDs: [Count]
- Duplicate Object IDs: [Count]
- Issues: [List if any]

### ✅ Object Registry
- Status: PASS / FAIL
- Objects in Sections: {count}
- Objects in Registry: {count}
- Match: YES / NO
- Issues: [List if any]

### ✅ Sketch Coverage
- Status: PASS / FAIL
- Unspecified elements: [List]

### ✅ Design System Links
- Status: PASS / FAIL
- Broken links: [Count]
- Missing links: [Count]

---

## Detailed Findings

### 🔴 Critical Issues (Must Fix)

1. [Issue description]
   - **Location:** [Where in spec]
   - **Impact:** [Why this matters]
   - **Fix:** [Specific action needed]

### ⚠️ Warnings (Should Fix)

1. [Issue description]
   - **Location:** [Where in spec]
   - **Impact:** [Why this matters]
   - **Fix:** [Specific action needed]

### 💡 Recommendations (Nice to Have)

1. [Suggestion]
   - **Rationale:** [Why this would help]

---

## Object ID Audit

**Total Object IDs:** {count}

**In Page Sections but not in Registry:**
- [List Object IDs]

**In Registry but not in Page Sections:**
- [List Object IDs]

**Duplicate Object IDs:**
- [List duplicates]

**Naming Convention Violations:**
- [List Object IDs not following pattern]

---

## Missing Elements from Sketch

Elements visible in sketch but not specified:

1. [Element description]
   - **Location in sketch:** [Where]
   - **Suggested Object ID:** [Proposed ID]

---

## Broken Links Audit

**Navigation Links:**
- [List any broken "Next Step" links]

**Sketch Image:**
- [Report if sketch image path broken]

**Design System Links:**
- [List any broken component links]

---

## Next Actions

**Before Handoff:**
1. [Required action]
2. [Required action]

**For Future Iteration:**
1. [Optional improvement]
2. [Optional improvement]

---

## Approval

**Status:** ✅ APPROVED / ⚠️ CONDITIONAL / ❌ REJECTED

**Approved by:** [Role - Designer/Lead/PM]  
**Date:** [Approval date]  
**Notes:** [Any comments]

</output>

---

## Pass/Fail Criteria

### ✅ READY FOR HANDOFF

**All of these must be true:**
- [ ] Zero critical issues
- [ ] Navigation complete and correct
- [ ] Page overview complete
- [ ] All Object IDs present and unique
- [ ] Object Registry matches Page Sections 100%
- [ ] All sketch elements specified
- [ ] All paths valid

**Warnings and recommendations are acceptable** for handoff but should be tracked.

### ⚠️ NEEDS REVISION

**If any of these are true:**
- 1-3 critical issues present
- Object Registry incomplete (<90% match)
- Some sketch elements missing (<5)
- Some broken links present

**Action:** Fix critical issues before handoff.

### ❌ INCOMPLETE

**If any of these are true:**
- 4+ critical issues
- Major sections missing
- Object Registry severely incomplete (<70% match)
- Many sketch elements unspecified (5+)
- Multiple broken links

**Action:** Complete specification before validation.

---

## Common Critical Issues

**These always block handoff:**

1. **Missing Object IDs on interactive elements**
   - Developer cannot implement without IDs
   - Testing impossible without target IDs

2. **Duplicate Object IDs**
   - Creates implementation conflicts
   - Breaks element targeting

3. **Missing navigation structure**
   - Developer doesn't know flow
   - Routing cannot be implemented

4. **Placeholder content in interactive elements**
   - Cannot implement button with "TBD" text
   - Cannot create form with undefined fields

5. **Object Registry mismatch >10%**
   - Indicates specification chaos
   - High risk of missed elements

---

## Automated Checks (Future)

**These checks can be automated:**

- Object ID uniqueness
- Object ID naming convention
- Object Registry vs Page Sections matching
- Markdown formatting
- Path validation
- Required section presence

**Manual checks still needed:**

- Sketch coverage
- Content quality
- Purpose statement clarity
- Design system appropriateness

---

## After Validation

<if condition="Status is READY FOR HANDOFF">

### Next Steps

1. **Save quality report** to spec folder
2. **Update scenario tracking** (mark page as complete)
3. **Notify team** spec is ready for review
4. **Proceed to prototype generation** (if applicable)
5. **Hand off to developer** with confidence

</if>

<if condition="Status is NEEDS REVISION or INCOMPLETE">

### Next Steps

1. **Share quality report** with page owner
2. **Prioritize critical issues** from report
3. **Fix issues** and re-run validation
4. **Track progress** in scenario tracking file
5. **Re-validate** when fixes complete

</if>

---

## Quality Metrics Tracking

**Track these over time to improve process:**

- Average Object IDs per page
- Common missing elements
- Most frequent critical issues
- Time to fix issues
- Pass rate on first validation

---

## Completion

<output>
**Page Specification Quality Validation Complete**

**Final Status:** [✅ READY / ⚠️ NEEDS REVISION / ❌ INCOMPLETE]

**Summary:**
- Validated: {date}
- Critical Issues: {count}
- Warnings: {count}
- Object IDs: {count}

{if READY}
✅ This specification is ready for handoff to development or prototype generation.
{endif}

{if NEEDS REVISION}
⚠️ Please address {count} critical issues before proceeding.
{endif}

{if INCOMPLETE}
❌ This specification requires substantial work before validation.
{endif}

**Quality Report saved to:** `{path}/quality-report-{date}.md`
</output>

---

**Workflow Complete** ✅

Return to: [Page Specification Quality Workflow](instructions.md)

